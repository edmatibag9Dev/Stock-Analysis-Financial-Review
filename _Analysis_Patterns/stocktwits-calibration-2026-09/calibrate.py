#!/usr/bin/env python3
"""Phase 2 calibration: does Stocktwits sentiment lead, lag, or move with price?

Inputs : data/<T>.json (sentiment_6m daily, volume_6m daily, sentiment_5y monthly; pulled via MCP)
         data/prices_<T>.json (Yahoo 5y daily closes; fetched here if missing)
Output : results.md (tables) + results.json. Descriptive statistics only — 7 tickers, one
         6-month window, overlapping forward windows. Nothing here proves a trading edge.

Run from this folder:  python3 calibrate.py [--refresh-prices]
"""
import json
import math
import pathlib
import statistics as st
import sys

HERE = pathlib.Path(__file__).resolve().parent
DATA = HERE / "data"
sys.path.insert(0, str(HERE.parents[1] / "skill-src" / "stock-analysis" / "scripts"))
import sentiment_features as sf  # noqa: E402

TICKERS = ["BROS", "FSLY", "NOW", "NUAI", "PLTR", "SG", "TRMB"]
HORIZONS = (5, 10, 20)


# ------------------------------------------------------------------ data
def load_ticker(t, refresh=False):
    d = json.loads((DATA / f"{t}.json").read_text())
    pp = DATA / f"prices_{t}.json"
    if refresh or not pp.exists():
        pp.write_text(json.dumps(sf.fetch_prices(t, "5y")))
    prices = [(a, c) for a, c in json.loads(pp.read_text()) if c is not None]
    s6, _ = sf.drop_filler([tuple(x) for x in d["sentiment_6m"]], "sentiment")
    v6, _ = sf.drop_filler([tuple(x) for x in d["volume_6m"]], "volume")
    s5, _ = sf.drop_filler([tuple(x) for x in d["sentiment_5y"]], "sentiment")
    return {"s6": s6, "v6": v6, "s5": s5, "prices": prices}


def daily_panel(tk):
    """Rows keyed by trading date where we have sentiment and a close."""
    idx = {d: i for i, (d, _) in enumerate(tk["prices"])}
    closes = [c for _, c in tk["prices"]]
    vol = dict(tk["v6"])
    rows = []
    for d, s in tk["s6"]:
        i = idx.get(d)
        if i is None or i == 0:
            continue
        r = {"date": d, "s": s, "v": vol.get(d), "i": i,
             "ret": closes[i] / closes[i - 1] - 1}
        for h in HORIZONS:
            r[f"fwd{h}"] = closes[i + h] / closes[i] - 1 if i + h < len(closes) else None
            if i + h < len(closes):
                rets = [closes[j] / closes[j - 1] - 1 for j in range(i + 1, i + h + 1)]
                r[f"rv{h}"] = st.pstdev(rets) * math.sqrt(252)
            else:
                r[f"rv{h}"] = None
        r["next_ret"] = closes[i + 1] / closes[i] - 1 if i + 1 < len(closes) else None
        rows.append(r)
    for a, b in zip(rows, rows[1:]):
        b["ds"] = b["s"] - a["s"]
    return rows


def monthly_panel(tk):
    """Month-end sentiment vs. same-month and next-month price return."""
    by_month = {}
    for d, c in tk["prices"]:
        by_month[d[:7]] = c                      # last close of each month
    months = sorted(by_month)
    rows = []
    last_full = months[-2] if months else None          # newest month is partial (run date mid-month)
    for d, s in tk["s5"]:
        m = d[:7]
        if m not in by_month or m > last_full:
            continue
        k = months.index(m)
        if k == 0:
            continue
        prev, cur = by_month[months[k - 1]], by_month[m]
        nxt = by_month[months[k + 1]] if months[k + 1] <= last_full else None
        rows.append({"month": m, "s": s, "ret": cur / prev - 1,
                     "next": None if nxt is None else nxt / cur - 1})
    return rows


# ------------------------------------------------------------------ stats
def corr(xs, ys):
    pairs = [(x, y) for x, y in zip(xs, ys) if x is not None and y is not None]
    if len(pairs) < 8:
        return None, len(pairs), None
    x, y = zip(*pairs)
    if st.pstdev(x) == 0 or st.pstdev(y) == 0:
        return None, len(pairs), None
    r = st.correlation(x, y)
    t = r * math.sqrt((len(pairs) - 2) / max(1e-12, 1 - r * r))
    return round(r, 3), len(pairs), round(t, 2)


def mean(xs):
    xs = [x for x in xs if x is not None]
    return (round(st.mean(xs), 4), len(xs)) if xs else (None, 0)


def episode_starts(rows, pred):
    out, prev = [], False
    for r in rows:
        hit = pred(r)
        if hit and not prev:
            out.append(r)
        prev = hit
    return out


# ------------------------------------------------------------------ study
def run(refresh=False):
    tks = {t: load_ticker(t, refresh) for t in TICKERS if (DATA / f"{t}.json").exists()}
    daily = {t: daily_panel(tk) for t, tk in tks.items()}
    monthly = {t: monthly_panel(tk) for t, tk in tks.items()}
    pool = [r for rows in daily.values() for r in rows]
    mpool = [r for rows in monthly.values() for r in rows]
    res = {"tickers": list(tks), "coverage": {}, "lead_lag": {}, "per_ticker": {}, "extremes": {},
           "sweep": [], "spikes": {}, "monthly": {}}

    for t, rows in daily.items():
        res["coverage"][t] = {"daily_rows": len(rows), "first": rows[0]["date"] if rows else None,
                              "last": rows[-1]["date"] if rows else None, "months": len(monthly[t])}

    # 1. Same-day vs next-day: does the sentiment change line up with today's or tomorrow's return?
    ds = [r.get("ds") for r in pool]
    res["lead_lag"] = {
        "same_day  (d_sent_t vs ret_t)": corr(ds, [r["ret"] for r in pool]),
        "next_day  (d_sent_t vs ret_t+1)": corr(ds, [r["next_ret"] for r in pool]),
        "prior_day (ret_t-1 vs d_sent_t)": corr([None] + [r["ret"] for r in pool[:-1]], ds),
        "level vs fwd5": corr([r["s"] for r in pool], [r["fwd5"] for r in pool]),
        "level vs fwd20": corr([r["s"] for r in pool], [r["fwd20"] for r in pool]),
    }
    for t, rows in daily.items():
        dd = [r.get("ds") for r in rows]
        res["per_ticker"][t] = {
            "same_day": corr(dd, [r["ret"] for r in rows])[0],
            "next_day": corr(dd, [r["next_ret"] for r in rows])[0],
            "level_fwd20": corr([r["s"] for r in rows], [r["fwd20"] for r in rows])[0],
        }

    # 2. Forward returns after the FIRST day of an extreme run vs. all days
    base = {h: mean([r[f"fwd{h}"] for r in pool]) for h in HORIZONS}
    base_rv = mean([r["rv10"] for r in pool])
    groups = {
        "all days": pool,
        "score >= 75 (start)": [r for rows in daily.values() for r in episode_starts(rows, lambda r: r["s"] >= 75)],
        "score <= 24 (start)": [r for rows in daily.values() for r in episode_starts(rows, lambda r: r["s"] <= 24)],
        "score >= 75 & vol >= 75 (start)": [r for rows in daily.values()
                                            for r in episode_starts(rows, lambda r: r["s"] >= 75 and (r["v"] or 0) >= 75)],
    }
    for name, g in groups.items():
        res["extremes"][name] = {"n": len(g), **{f"fwd{h}": mean([r[f"fwd{h}"] for r in g])[0] for h in HORIZONS},
                                 "rv10": mean([r["rv10"] for r in g])[0],
                                 "share_fwd10_neg": round(sum(1 for r in g if (r["fwd10"] or 0) < 0) / len(g), 2) if g else None}
    res["baseline"] = {"fwd": {h: base[h][0] for h in HORIZONS}, "rv10": base_rv[0]}

    # 3. Threshold sweep for the crowding flag
    for sc in (65, 70, 75, 80):
        for vt in (60, 70, 75, 80):
            g = [r for rows in daily.values() for r in episode_starts(rows, lambda r, sc=sc, vt=vt: r["s"] >= sc and (r["v"] or 0) >= vt)]
            f10 = [r["fwd10"] for r in g if r["fwd10"] is not None]
            res["sweep"].append({"score>=": sc, "vol>=": vt, "episodes": len(g),
                                 "tickers": len({t for t, rows in daily.items() for r in rows if r in g}),
                                 "fwd10_mean": round(st.mean(f10), 4) if f10 else None,
                                 "share_neg": round(sum(1 for x in f10 if x < 0) / len(f10), 2) if f10 else None,
                                 "rv10_mean": mean([r["rv10"] for r in g])[0]})

    # 4. Volume spikes: realized volatility after a chatter spike vs. baseline
    sp = [r for rows in daily.values() for r in episode_starts(rows, lambda r: (r["v"] or 0) >= 75)]
    res["spikes"] = {"n": len(sp), "rv10_after": mean([r["rv10"] for r in sp])[0], "rv10_all": base_rv[0],
                     "abs_ret_spike_day": mean([abs(r["ret"]) for r in sp])[0],
                     "abs_ret_all": mean([abs(r["ret"]) for r in pool])[0]}

    # 5. Monthly (5Y): month-end score vs same-month and next-month return
    res["monthly"] = {
        "same_month": corr([r["s"] for r in mpool], [r["ret"] for r in mpool]),
        "next_month": corr([r["s"] for r in mpool], [r["next"] for r in mpool]),
        "per_ticker_same": {t: corr([r["s"] for r in rows], [r["ret"] for r in rows])[0] for t, rows in monthly.items()},
        "per_ticker_next": {t: corr([r["s"] for r in rows], [r["next"] for r in rows])[0] for t, rows in monthly.items()},
    }
    hi = [r["next"] for r in mpool if r["s"] >= 75 and r["next"] is not None]
    lo = [r["next"] for r in mpool if r["s"] <= 24 and r["next"] is not None]
    mid = [r["next"] for r in mpool if 24 < r["s"] < 75 and r["next"] is not None]
    res["monthly"]["next_by_band"] = {k: (round(st.mean(v), 4) if v else None, len(v))
                                      for k, v in (("score>=75", hi), ("25-74", mid), ("score<=24", lo))}
    return res


def fmt_pct(x):
    return "n/a" if x is None else f"{x:+.1%}"


def to_md(r):
    L = ["# Stocktwits calibration — results (generated by calibrate.py)", ""]
    L += ["## Coverage", "", "| Ticker | Daily rows | First | Last | Months (5Y) |", "|---|---|---|---|---|"]
    L += [f"| {t} | {c['daily_rows']} | {c['first']} | {c['last']} | {c['months']} |" for t, c in r["coverage"].items()]
    L += ["", "## 1. Lead / lag (pooled daily, 6M)", "", "| Test | r | n | t |", "|---|---|---|---|"]
    L += [f"| {k} | {v[0]} | {v[1]} | {v[2]} |" for k, v in r["lead_lag"].items()]
    L += ["", "| Ticker | same-day r | next-day r | level vs fwd20 r |", "|---|---|---|---|"]
    L += [f"| {t} | {v['same_day']} | {v['next_day']} | {v['level_fwd20']} |" for t, v in r["per_ticker"].items()]
    L += ["", "## 2. Forward returns after extremes (first day of each run)", "",
          "| Group | n | fwd 5 | fwd 10 | fwd 20 | share fwd10 < 0 | realized vol next 10 |", "|---|---|---|---|---|---|---|"]
    for k, v in r["extremes"].items():
        L.append(f"| {k} | {v['n']} | {fmt_pct(v['fwd5'])} | {fmt_pct(v['fwd10'])} | {fmt_pct(v['fwd20'])} | "
                 f"{v['share_fwd10_neg']} | {fmt_pct(v['rv10'])} |")
    L += ["", "## 3. Crowding threshold sweep (episode starts)", "",
          "| score >= | volume >= | episodes | tickers | fwd10 mean | share neg | realized vol next 10 |", "|---|---|---|---|---|---|---|"]
    L += [f"| {s['score>=']} | {s['vol>=']} | {s['episodes']} | {s['tickers']} | {fmt_pct(s['fwd10_mean'])} | {s['share_neg']} | {fmt_pct(s['rv10_mean'])} |"
          for s in r["sweep"]]
    s = r["spikes"]
    L += ["", "## 4. Chatter spikes (volume >= 75, first day)", "",
          f"- Episodes: {s['n']}",
          f"- Realized vol, next 10 sessions: {fmt_pct(s['rv10_after'])} vs. {fmt_pct(s['rv10_all'])} on all days",
          f"- Absolute return on spike day: {fmt_pct(s['abs_ret_spike_day'])} vs. {fmt_pct(s['abs_ret_all'])} on all days"]
    m = r["monthly"]
    L += ["", "## 5. Monthly, 5Y (month-end score)", "",
          f"- Same-month return: r={m['same_month'][0]}, n={m['same_month'][1]}, t={m['same_month'][2]}",
          f"- Next-month return: r={m['next_month'][0]}, n={m['next_month'][1]}, t={m['next_month'][2]}",
          "", "| Ticker | same-month r | next-month r |", "|---|---|---|"]
    L += [f"| {t} | {m['per_ticker_same'][t]} | {m['per_ticker_next'][t]} |" for t in m["per_ticker_same"]]
    L += ["", "| Month-end band | next-month mean | n |", "|---|---|---|"]
    L += [f"| {k} | {fmt_pct(v[0])} | {v[1]} |" for k, v in m["next_by_band"].items()]
    return "\n".join(L) + "\n"


if __name__ == "__main__":
    res = run(refresh="--refresh-prices" in sys.argv)
    (HERE / "results.json").write_text(json.dumps(res, indent=1, default=str))
    (HERE / "results.md").write_text(to_md(res))
    print(to_md(res))
