#!/usr/bin/env python3
"""Crowd-sentiment features for the stock-analysis skill (Phase 1H).

Stocktwits sentiment is ONE MORE DATA LAYER, NOT AN EDGE. It never changes the analysis
setup, a DCF input, a scenario weight, the rating, or an options strike.

Stocktwits is only reachable through the MCP connector, so Claude pulls the data and
writes ONE capture file per run (schema "stocktwits-capture/1", below). This script
never calls Stocktwits. It only reads that file, optionally adds Yahoo closes, and
computes deterministic metrics.

Usage
  python3 sentiment_features.py validate RAW.json
  python3 sentiment_features.py prices   RAW.json            # adds "prices" from Yahoo (network)
  python3 sentiment_features.py compute  RAW.json [-o OUT.json] [--markdown | --memo]
  python3 sentiment_features.py skip     SYMBOL --reason "Stocktwits connector not connected in this session"
    --memo      memo text: Technical Setup table + the Bull Case / Bear Case "Social sentiment" lines
    --markdown  full diagnostic table incl. flags (model sheet / review only, not the memo)

Capture file (Claude writes it from the MCP responses; keep it compact)
  {
    "schema": "stocktwits-capture/1",
    "symbol": "NUAI", "title": "...", "exchange": "NASDAQ",
    "pulled_at": "2026-09-27T10:55:00-07:00",          # ISO time of the pulse call
    "source": "Stocktwits MCP (...)",
    "pulse": {"price": 7.06, "price_time": "...", "sentiment_score": 74,
              "sentiment_label": "BULLISH", "volume_score": 79,
              "volume_label": "EXTREMELY_HIGH", "watchers": 10414, "trending_rank": null},
    "sentiment_3m": [["2026-06-25", 50], ...],          # get_sentiment_history zoom=3M (daily)
    "sentiment_1y": [["2025-09-28", 50], ...],          # get_sentiment_history zoom=1Y (weekly)
    "volume_3m":    [["2026-06-25", 0], ...],           # get_message_volume_history zoom=3M
    "top_posts": [{"id": 1, "created_at": "...Z", "n_symbols": 1,
                   "tag": "Bullish"|"Bearish"|null, "author": "a1", "likes": 4}],
    "prices": null                                     # filled by the `prices` command
  }
  Rules: pulse.sentiment_score is the canonical score. Never copy the legacy
  bull/bear %, the legacy volume "label", or raw volume "value". Authors are
  anonymised a1..aN in first-seen order. No usernames, no post bodies.
"""
import argparse
import datetime as dt
import json
import re
import sys
import urllib.request
from zoneinfo import ZoneInfo

SCHEMA = "stocktwits-capture/1"

# Label bands inferred from the labels Stocktwits returned on 2026-09-27 ($NUAI, $NOW, $PLTR):
# 24 Extremely Bearish, 25 Slightly Bearish, 44 Slightly Bearish, 45 Neutral, 54 Neutral,
# 55 Slightly Bullish, 74 Slightly Bullish, 75 Extremely Bullish.
EXTREME_BULL = 75           # >= this is Extremely Bullish
EXTREME_BEAR = 24           # <= this is Extremely Bearish
VOLUME_SPIKE = 75           # normalized message volume; "Extremely High" starts here
PRICE_BAND = 0.02           # 20-day price move smaller than +/-2% counts as flat
SENT_BAND = 5               # 20-day sentiment move smaller than +/-5 points counts as flat
MULTI_TICKER = 4            # a post tagging >= 4 symbols is treated as a cashtag blast
THIN_WATCHERS = 1000
FILLER = {"sentiment": 50, "volume": 0}   # first bucket of every history series observed = filler

POST_KEYS = {"id", "created_at", "n_symbols", "tag", "author", "likes"}
AUTHOR_RE = re.compile(r"^a\d+$")


# ---------------------------------------------------------------- helpers
def load(path):
    with open(path) as f:
        return json.load(f)


def validate(raw):
    """Return a list of problems. Empty list = valid."""
    errs = []
    if raw.get("schema") != SCHEMA:
        errs.append(f"schema must be {SCHEMA!r}")
    for k in ("symbol", "pulled_at", "pulse", "sentiment_3m", "sentiment_1y", "volume_3m", "top_posts"):
        if k not in raw:
            errs.append(f"missing key {k!r}")
    if errs:
        return errs
    try:
        dt.datetime.fromisoformat(raw["pulled_at"])
    except ValueError:
        errs.append("pulled_at is not ISO 8601")
    for k in ("sentiment_score", "volume_score", "watchers"):
        if not isinstance(raw["pulse"].get(k), (int, float)):
            errs.append(f"pulse.{k} missing or not a number")
    for name in ("sentiment_3m", "sentiment_1y", "volume_3m"):
        prev = ""
        for row in raw[name]:
            if not (isinstance(row, list) and len(row) == 2 and re.fullmatch(r"\d{4}-\d{2}-\d{2}", str(row[0]))
                    and isinstance(row[1], (int, float)) and 0 <= row[1] <= 100):
                errs.append(f"{name}: bad row {row!r}")
                break
            if row[0] <= prev:
                errs.append(f"{name}: dates not strictly ascending at {row[0]}")
                break
            prev = row[0]
    for p in raw["top_posts"]:
        extra = set(p) - POST_KEYS
        if extra:
            errs.append(f"top_posts: disallowed keys {sorted(extra)} (no bodies/usernames)")
            break
        if not AUTHOR_RE.match(str(p.get("author", ""))):
            errs.append(f"top_posts: author {p.get('author')!r} is not anonymised (a1..aN)")
            break
    return errs


def drop_filler(series, kind):
    """Drop the leading run of filler buckets (sentiment 50 / volume 0).

    The API prepends one filler bucket to every series, and pads months before a
    ticker's coverage began with the same value ($NUAI 5Y: eight leading 50s)."""
    k = 0
    while k < len(series) and series[k][1] == FILLER[kind]:
        k += 1
    return series[k:], k > 0


def pct_rank(x, hist):
    """Percentile rank of x within hist (0-100), ties count half."""
    if not hist:
        return None
    below = sum(1 for v in hist if v < x)
    equal = sum(1 for v in hist if v == x)
    return round(100.0 * (below + 0.5 * equal) / len(hist), 1)


def change(values, back):
    return values[-1] - values[-1 - back] if len(values) > back else None


def band_label(score):
    if score >= EXTREME_BULL:
        return "Extremely Bullish"
    if score >= 55:
        return "Slightly Bullish"
    if score >= 45:
        return "Neutral"
    if score > EXTREME_BEAR:
        return "Slightly Bearish"
    return "Extremely Bearish"


def crowding(score, volume):
    if volume >= VOLUME_SPIKE and score >= EXTREME_BULL:
        return "crowded bullish"
    if volume >= VOLUME_SPIKE and score <= EXTREME_BEAR:
        return "crowded bearish"
    return None


def divergence(price_ret, sent_chg):
    if price_ret is None or sent_chg is None:
        return None
    p = 1 if price_ret > PRICE_BAND else -1 if price_ret < -PRICE_BAND else 0
    s = 1 if sent_chg > SENT_BAND else -1 if sent_chg < -SENT_BAND else 0
    if p == 1 and s == -1:
        return "price up, crowd cooling"
    if p == -1 and s == 1:
        return "price down, crowd warming"
    if p == 0 and s == 0:
        return "both flat"
    if p == s:
        return "aligned"
    return "one flat"


def spike_episodes(vol, sent):
    """Runs of consecutive daily buckets with volume >= VOLUME_SPIKE."""
    s_by_date = dict(sent)
    eps, cur = [], None
    for d, v in vol:
        if v >= VOLUME_SPIKE:
            if cur is None:
                cur = {"start": d, "end": d, "peak_volume": v, "peak_sentiment": s_by_date.get(d)}
            cur["end"] = d
            cur["peak_volume"] = max(cur["peak_volume"], v)
            if s_by_date.get(d) is not None:
                cur["peak_sentiment"] = max(cur["peak_sentiment"] or 0, s_by_date[d])
        elif cur:
            eps.append(cur)
            cur = None
    if cur:
        eps.append(cur)
    return eps


def post_quality(posts):
    n = len(posts)
    if n == 0:
        return {"n_posts": 0}
    authors = {}
    for p in posts:
        authors[p["author"]] = authors.get(p["author"], 0) + 1
    tagged = [p for p in posts if p.get("tag") in ("Bullish", "Bearish")]
    bull = sum(1 for p in tagged if p["tag"] == "Bullish")
    times = sorted(p["created_at"] for p in posts)
    return {
        "n_posts": n,
        "window_utc": [times[0], times[-1]],
        "unique_authors": len(authors),
        "top_author_share": round(max(authors.values()) / n, 3),
        "multi_ticker_share": round(sum(1 for p in posts if p["n_symbols"] >= MULTI_TICKER) / n, 3),
        "tagged_share": round(len(tagged) / n, 3),
        "bullish_share_of_tagged": round(bull / len(tagged), 3) if tagged else None,
        "n_bearish_tagged": len(tagged) - bull,
    }


def completed_prices(prices, pulled):
    """Drop a bar dated on the pull day when the pull happened before the 16:00 ET close —
    Yahoo returns the live, unfinished session as that day's 'close'."""
    if not prices:
        return prices, False
    et = pulled.astimezone(ZoneInfo("America/New_York"))
    if et.hour < 16:
        kept = [row for row in prices if row[0] < et.date().isoformat()]
        return kept, len(kept) < len(prices)
    return prices, False


def price_returns(prices, as_of):
    """5- and 20-session returns ending at the last close on or before as_of."""
    if not prices:
        return None, None, None
    closes = [c for d, c in prices if d <= as_of and c is not None]
    if not closes:
        return None, None, None
    r = lambda k: round(closes[-1] / closes[-1 - k] - 1, 4) if len(closes) > k else None
    return closes[-1], r(5), r(20)


# ---------------------------------------------------------------- compute
def compute(raw):
    errs = validate(raw)
    if errs:
        raise ValueError("; ".join(errs))
    notes = []
    pulse = raw["pulse"]
    s3, d1 = drop_filler(raw["sentiment_3m"], "sentiment")
    s1y, d2 = drop_filler(raw["sentiment_1y"], "sentiment")
    v3, d3 = drop_filler(raw["volume_3m"], "volume")
    if d1 or d2 or d3:
        notes.append("Dropped the leading filler bucket from history series (API artifact).")

    score = pulse["sentiment_score"]
    vol_now = pulse["volume_score"]
    s_vals = [v for _, v in s3]
    last_date = s3[-1][0] if s3 else None
    pulled = dt.datetime.fromisoformat(raw["pulled_at"])
    stale_days = (pulled.date() - dt.date.fromisoformat(last_date)).days if last_date else None
    if s3 and s_vals[-1] != score:
        notes.append(f"Pulse score {score} differs from last daily bucket {s_vals[-1]} ({last_date}).")

    prices, dropped_partial = completed_prices(raw.get("prices"), pulled)
    if dropped_partial:
        notes.append("Pulled before the 16:00 ET close: the pull-day price bar was dropped (unfinished session).")
    close, ret5, ret20 = price_returns(prices, last_date) if last_date else (None, None, None)
    chg5, chg20 = change(s_vals, 5), change(s_vals, 20)
    pq = post_quality(raw["top_posts"])

    thin = (pulse["watchers"] < THIN_WATCHERS or len(s3) < 20 or pq["n_posts"] < 10)
    pct1y = pct_rank(score, [v for _, v in s1y[:-1]])      # exclude current (partial) week
    pct3m = pct_rank(score, s_vals[:-1])                    # exclude today's bucket
    crowd = crowding(score, vol_now)
    div = divergence(ret20, chg20)

    flags = []
    if thin:
        flags.append("Thin coverage: treat every sentiment number as low-confidence.")
    if crowd:
        flags.append(f"Crowding: {crowd} (score {score}, volume {vol_now}).")
    if pct1y is not None and (pct1y >= 90 or pct1y <= 10):
        flags.append(f"Extreme for this ticker: score is at the {ordinal(pct1y)} percentile of its past year.")
    if vol_now >= VOLUME_SPIKE:
        flags.append(f"Chatter spike: message volume {vol_now} (>= {VOLUME_SPIKE}).")
    if div in ("price up, crowd cooling", "price down, crowd warming"):
        flags.append(f"Divergence over 20 sessions: {div}.")
    if pq.get("multi_ticker_share", 0) >= 0.2:
        flags.append(f"Noisy stream: {pq['multi_ticker_share']:.0%} of recent posts tag {MULTI_TICKER}+ tickers.")
    if pq.get("top_author_share", 0) >= 0.2:
        flags.append(f"Concentrated stream: one author wrote {pq['top_author_share']:.0%} of recent posts.")
    if raw.get("prices") is None:
        notes.append("No prices in capture file: price return and divergence not computed.")

    return {
        "symbol": raw["symbol"],
        "pulled_at": raw["pulled_at"],
        "last_bucket": last_date,
        "stale_days": stale_days,
        "score_now": score,
        "label_now": pulse.get("sentiment_label"),
        "band_now": band_label(score),
        "pct_1y_weekly": pct1y,
        "pct_3m_daily": pct3m,
        "chg_5d": chg5,
        "chg_20d": chg20,
        "volume_now": vol_now,
        "volume_pct_3m": pct_rank(vol_now, [v for _, v in v3[:-1]]),
        "watchers": pulse["watchers"],
        "trending_rank": pulse.get("trending_rank"),
        "close": close,
        "ret_5d": ret5,
        "ret_20d": ret20,
        "divergence_20d": div,
        "crowding": crowd,
        "spike_episodes_3m": spike_episodes(v3, s3),
        "posts": pq,
        "thin_coverage": thin,
        "flags": flags,
        "notes": notes,
    }


def ordinal(x):
    n = int(round(x))
    suffix = "th" if 10 <= n % 100 <= 20 else {1: "st", 2: "nd", 3: "rd"}.get(n % 10, "th")
    return f"{n}{suffix}"


def to_markdown(f):
    pct = lambda x: "n/a" if x is None else f"{x:+.1%}"
    num = lambda x: "n/a" if x is None else (f"{x:+d}" if isinstance(x, int) else str(x))
    rows = [
        ("Sentiment score (0-100)", f"{f['score_now']} ({f['band_now']})"),
        ("Percentile vs. past year (weekly)", "n/a" if f["pct_1y_weekly"] is None else ordinal(f["pct_1y_weekly"])),
        ("Change, 5 / 20 sessions", f"{num(f['chg_5d'])} / {num(f['chg_20d'])} pts"),
        ("Message volume (0-100)", f"{f['volume_now']}" + (" (spike)" if f["volume_now"] >= VOLUME_SPIKE else "")),
        ("Watchers", f"{f['watchers']:,}"),
        ("Price return, 5 / 20 sessions", f"{pct(f['ret_5d'])} / {pct(f['ret_20d'])}"),
        ("Price vs. crowd (20 sessions)", f["divergence_20d"] or "n/a"),
        ("Crowding flag", f["crowding"] or "none"),
        ("Chatter spikes in last 3 months", str(len(f["spike_episodes_3m"]))),
    ]
    out = [f"Stocktwits, pulled {f['pulled_at']} (last bucket {f['last_bucket']})", "",
           "| Metric | Value |", "|---|---|"]
    out += [f"| {a} | {b} |" for a, b in rows]
    if f["flags"]:
        out += ["", "Flags:"] + [f"- {x}" for x in f["flags"]]
    return "\n".join(out)


def lean(f):
    """bullish / bearish / neutral / thin — decides the wording of the case lines."""
    if f["thin_coverage"]:
        return "thin"
    if f["score_now"] >= 55:
        return "bullish"
    if f["score_now"] <= 44:
        return "bearish"
    return "neutral"


def case_lines(f):
    """The Bull Case and Bear Case 'Social sentiment' lines. Both cases always get one."""
    head = f"Social sentiment (Stocktwits, pulled {f['pulled_at'][:10]}): "
    if lean(f) == "thin":
        body = f"coverage is too thin for a read ({f['watchers']:,} watchers)."
        return {"bull": head + body, "bear": head + body}
    chg = "n/a" if f["chg_20d"] is None else f"{f['chg_20d']:+d} pts"
    facts = (f"score {f['score_now']} ({f['band_now']}), {chg} over 20 sessions; "
             f"message volume {f['volume_now']} of 100.")
    verdict = {
        "bullish": ("the crowd shares this view", "the crowd does not share this view"),
        "bearish": ("the crowd does not share this view", "the crowd shares this view"),
        "neutral": ("the crowd is neutral", "the crowd is neutral"),
    }[lean(f)]
    return {"bull": f"{head}{verdict[0]} — {facts}", "bear": f"{head}{verdict[1]} — {facts}"}


def to_memo(f):
    """Memo text: the Technical Setup table (numbers only) and the two case lines. Sections are
    named, not numbered — memo numbering shifts when a memo adds sections."""
    chg = "n/a" if f["chg_20d"] is None else f"{f['chg_20d']:+d} pts"
    out = [f"TECHNICAL SETUP table — caption: Social sentiment (Stocktwits), pulled {f['pulled_at']}, "
           f"last bucket {f['last_bucket']}", "",
           "| Metric | Value |", "|---|---|",
           f"| Sentiment score (0-100) | {f['score_now']} ({f['band_now']}) |",
           f"| Change over 20 sessions | {chg} |",
           f"| Message volume (0-100) | {f['volume_now']} |",
           f"| Watchers | {f['watchers']:,} |"]
    lines = case_lines(f)
    out += ["", "BULL CASE closing line:", lines["bull"],
            "", "BEAR CASE closing line:", lines["bear"]]
    return "\n".join(out)


def skip_memo(symbol, reason, when=None):
    """Memo text when Phase 1H cannot run. The sentiment layer is skipped, never estimated."""
    when = when or dt.datetime.now().astimezone().isoformat(timespec="minutes")
    line = f"Social sentiment (Stocktwits): skipped — {reason} ({when[:10]}). No sentiment layer in this memo."
    return "\n".join([
        f"TECHNICAL SETUP line (replaces the table): Social sentiment (Stocktwits) for {symbol}: skipped — {reason}.",
        "", "BULL CASE closing line:", line, "", "BEAR CASE closing line:", line,
        "", f"CLOSING SUMMARY status line: Stocktwits: skipped — {reason}"])


# ---------------------------------------------------------------- prices (network)
def fetch_prices(symbol, rng="6mo"):
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?range={rng}&interval=1d"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        res = json.load(r)["chart"]["result"][0]
    off = res["meta"].get("gmtoffset", 0)
    closes = res["indicators"]["quote"][0]["close"]
    out = []
    for t, c in zip(res["timestamp"], closes):
        d = dt.datetime.fromtimestamp(t + off, dt.timezone.utc).date().isoformat()
        out.append([d, None if c is None else round(c, 4)])
    return out


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("cmd", choices=["validate", "prices", "compute", "skip"])
    ap.add_argument("raw", help="capture file (validate/prices/compute) or SYMBOL (skip)")
    ap.add_argument("--reason", default="Stocktwits connector not connected in this session")
    ap.add_argument("-o", "--out")
    fmt = ap.add_mutually_exclusive_group()
    fmt.add_argument("--markdown", action="store_true")
    fmt.add_argument("--memo", action="store_true")
    a = ap.parse_args(argv)
    if a.cmd == "skip":
        print(skip_memo(a.raw.upper().lstrip("$"), a.reason))
        return 0
    raw = load(a.raw)

    if a.cmd == "validate":
        errs = validate(raw)
        print("OK" if not errs else "\n".join(errs))
        return 0 if not errs else 1
    if a.cmd == "prices":
        raw["prices"] = fetch_prices(raw["symbol"])
        with open(a.raw, "w") as f:
            json.dump(raw, f, indent=1)
        print(f"added {len(raw['prices'])} closes ({raw['prices'][0][0]} .. {raw['prices'][-1][0]})")
        return 0
    feats = compute(raw)
    if a.out:
        with open(a.out, "w") as f:
            json.dump(feats, f, indent=1)
    print(to_memo(feats) if a.memo else to_markdown(feats) if a.markdown else json.dumps(feats, indent=1))
    return 0


if __name__ == "__main__":
    sys.exit(main())
