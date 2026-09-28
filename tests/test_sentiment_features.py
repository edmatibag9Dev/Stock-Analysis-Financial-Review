"""Tests for skill-src/stock-analysis/scripts/sentiment_features.py.

Run from the repo root:  python3 -m unittest discover -s tests -v
Fixtures are real Stocktwits pulls from 2026-09-27 ($NUAI, $NOW) with authors anonymised
and post bodies dropped; prices are Yahoo daily closes added by the `prices` command.
"""
import copy
import json
import pathlib
import sys
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "skill-src" / "stock-analysis" / "scripts"))
import sentiment_features as sf  # noqa: E402

FIX = ROOT / "tests" / "fixtures"


def fixture(sym):
    return json.loads((FIX / f"sentiment_raw_{sym}_2026-09-27.json").read_text())


class TestFixtures(unittest.TestCase):
    def setUp(self):
        self.nuai = sf.compute(fixture("NUAI"))
        self.now = sf.compute(fixture("NOW"))

    def test_fixtures_validate(self):
        for sym in ("NUAI", "NOW"):
            self.assertEqual(sf.validate(fixture(sym)), [])

    def test_nuai_snapshot(self):
        f = self.nuai
        self.assertEqual(f["score_now"], 74)
        self.assertEqual(f["band_now"], "Slightly Bullish")
        self.assertEqual(f["last_bucket"], "2026-09-25")
        self.assertEqual(f["stale_days"], 2)            # Sunday pull, Friday bucket
        self.assertEqual(f["volume_now"], 79)
        self.assertEqual(f["watchers"], 10414)

    def test_nuai_changes_by_hand(self):
        # 2026-09-25 = 74; 5 sessions back 2026-09-18 = 51; 20 sessions back 2026-08-27 = 35
        self.assertEqual(self.nuai["chg_5d"], 23)
        self.assertEqual(self.nuai["chg_20d"], 39)

    def test_nuai_price_return_by_hand(self):
        # 7.06 / 5.86 (2026-09-18 close) - 1 = +20.5%
        self.assertAlmostEqual(self.nuai["ret_5d"], 7.06 / 5.86 - 1, places=2)

    def test_nuai_one_point_below_crowded(self):
        # Score 74 with volume 79: one point under the 75 crowding threshold (Phase 2 calibrates this).
        self.assertIsNone(self.nuai["crowding"])
        self.assertTrue(any(x.startswith("Chatter spike") for x in self.nuai["flags"]))

    def test_nuai_spike_episodes(self):
        eps = self.nuai["spike_episodes_3m"]
        self.assertEqual([(e["start"], e["end"]) for e in eps],
                         [("2026-07-21", "2026-07-27"), ("2026-09-10", "2026-09-11"), ("2026-09-21", "2026-09-25")])
        self.assertEqual(eps[0]["peak_sentiment"], 88)

    def test_nuai_post_quality(self):
        pq = self.nuai["posts"]
        self.assertEqual(pq["n_posts"], 30)
        self.assertEqual(pq["unique_authors"], 17)
        self.assertAlmostEqual(pq["multi_ticker_share"], 7 / 30, places=3)
        self.assertAlmostEqual(pq["top_author_share"], 5 / 30, places=3)
        self.assertEqual(pq["n_bearish_tagged"], 0)

    def test_now_snapshot(self):
        f = self.now
        self.assertEqual(f["score_now"], 40)
        self.assertEqual(f["band_now"], "Slightly Bearish")
        self.assertEqual(f["posts"]["tagged_share"], round(9 / 30, 3))
        self.assertEqual(f["posts"]["n_bearish_tagged"], 1)
        self.assertEqual(f["flags"], [])

    def test_filler_dropped(self):
        raw = fixture("NUAI")
        s, dropped = sf.drop_filler(raw["sentiment_3m"], "sentiment")
        self.assertTrue(dropped)
        self.assertEqual(len(s), len(raw["sentiment_3m"]) - 1)
        v, dropped = sf.drop_filler(raw["volume_3m"], "volume")
        self.assertTrue(dropped)
        self.assertEqual(v[0], ["2026-06-26", 52])

    def test_filler_run_dropped(self):
        # $NUAI 5Y began with eight months at exactly 50 before coverage started
        s = [["2024-12-31", 50]] + [[f"2025-0{m}-28", 50] for m in range(1, 8)] + [["2025-08-31", 49], ["2025-09-30", 50]]
        out, dropped = sf.drop_filler(s, "sentiment")
        self.assertTrue(dropped)
        self.assertEqual(out, [["2025-08-31", 49], ["2025-09-30", 50]])   # a later 50 is real data

    def test_two_leading_filler_buckets(self):
        # $NUAI 3M series pulled 2026-09-28 began with two filler buckets (50/0 on 06-25 and 06-26)
        s = [["2026-06-25", 50], ["2026-06-26", 50], ["2026-06-29", 43]]
        v = [["2026-06-25", 0], ["2026-06-26", 0], ["2026-06-29", 48]]
        self.assertEqual(sf.drop_filler(s, "sentiment")[0], [["2026-06-29", 43]])
        self.assertEqual(sf.drop_filler(v, "volume")[0], [["2026-06-29", 48]])

    def test_memo_uses_section_names(self):
        memo = sf.to_memo(sf.compute(fixture("NUAI")))
        for label in ("TECHNICAL SETUP table", "BULL CASE closing line:", "BEAR CASE closing line:"):
            self.assertIn(label, memo)
        self.assertNotIn("SECTION 4", memo)

    def test_skip_memo_never_invents_numbers(self):
        out = sf.skip_memo("BROS", "Stocktwits connector not connected in this session", "2026-09-28T08:00-07:00")
        self.assertIn("skipped — Stocktwits connector not connected in this session", out)
        self.assertIn("CLOSING SUMMARY status line: Stocktwits: skipped", out)
        for label in ("TECHNICAL SETUP line", "BULL CASE closing line:", "BEAR CASE closing line:"):
            self.assertIn(label, out)
        self.assertNotRegex(out, r"score \d")

    def test_skip_cli(self):
        import contextlib, io
        buf = io.StringIO()
        with contextlib.redirect_stdout(buf):
            self.assertEqual(sf.main(["skip", "$nuai"]), 0)
        self.assertIn("for NUAI: skipped", buf.getvalue())

    def test_markdown_renders(self):
        md = sf.to_markdown(self.nuai)
        self.assertIn("| Sentiment score (0-100) | 74 (Slightly Bullish) |", md)
        self.assertIn("pulled 2026-09-27T10:55:00-07:00", md)


class TestValidateGuards(unittest.TestCase):
    def test_rejects_username(self):
        raw = fixture("NOW")
        raw["top_posts"][0]["author"] = "ExampleTrader99"
        self.assertTrue(any("not anonymised" in e for e in sf.validate(raw)))

    def test_rejects_body(self):
        raw = fixture("NOW")
        raw["top_posts"][0]["body"] = "text"
        self.assertTrue(any("disallowed keys" in e for e in sf.validate(raw)))

    def test_rejects_unsorted_series(self):
        raw = fixture("NOW")
        raw["sentiment_3m"][2], raw["sentiment_3m"][3] = raw["sentiment_3m"][3], raw["sentiment_3m"][2]
        self.assertTrue(any("ascending" in e for e in sf.validate(raw)))

    def test_rejects_missing_key(self):
        raw = fixture("NOW")
        del raw["pulse"]
        self.assertIn("missing key 'pulse'", sf.validate(raw))

    def test_compute_raises_on_invalid(self):
        raw = fixture("NOW")
        raw["schema"] = "x"
        with self.assertRaises(ValueError):
            sf.compute(raw)


class TestRules(unittest.TestCase):
    def test_ordinal(self):
        for x, want in ((72.1, "72nd"), (1, "1st"), (3, "3rd"), (11, "11th"), (12.4, "12th"), (86, "86th"), (101, "101st")):
            self.assertEqual(sf.ordinal(x), want)

    def test_partial_session_dropped_before_close(self):
        import datetime as dt
        prices = [["2026-09-25", 7.06], ["2026-09-28", 7.03]]
        before = dt.datetime.fromisoformat("2026-09-28T06:50:00-07:00")   # 09:50 ET, market open
        after = dt.datetime.fromisoformat("2026-09-28T13:30:00-07:00")    # 16:30 ET, after close
        self.assertEqual(sf.completed_prices(prices, before), ([["2026-09-25", 7.06]], True))
        self.assertEqual(sf.completed_prices(prices, after), (prices, False))
        self.assertEqual(sf.completed_prices(None, before), (None, False))

    def test_pct_rank(self):
        self.assertEqual(sf.pct_rank(50, [10, 20, 30, 40]), 100.0)
        self.assertEqual(sf.pct_rank(5, [10, 20]), 0.0)
        self.assertEqual(sf.pct_rank(20, [10, 20, 30, 40]), 37.5)
        self.assertIsNone(sf.pct_rank(1, []))

    def test_bands(self):
        cases = {23: "Extremely Bearish", 24: "Extremely Bearish", 25: "Slightly Bearish", 26: "Slightly Bearish", 44: "Slightly Bearish", 45: "Neutral",
                 54: "Neutral", 55: "Slightly Bullish", 74: "Slightly Bullish", 75: "Extremely Bullish"}
        for s, label in cases.items():
            self.assertEqual(sf.band_label(s), label, s)

    def test_crowding(self):
        self.assertEqual(sf.crowding(75, 75), "crowded bullish")
        self.assertEqual(sf.crowding(24, 80), "crowded bearish")
        self.assertIsNone(sf.crowding(25, 80))
        self.assertIsNone(sf.crowding(74, 99))
        self.assertIsNone(sf.crowding(90, 74))

    def test_divergence(self):
        self.assertEqual(sf.divergence(0.10, -10), "price up, crowd cooling")
        self.assertEqual(sf.divergence(-0.10, 10), "price down, crowd warming")
        self.assertEqual(sf.divergence(0.10, 10), "aligned")
        self.assertEqual(sf.divergence(0.01, 2), "both flat")
        self.assertEqual(sf.divergence(0.10, 2), "one flat")
        self.assertIsNone(sf.divergence(None, 5))

    def test_case_lines_by_band(self):
        # R1(b): both cases always get a line; wording set by the score band
        base = sf.compute(fixture("NOW"))
        for score, bull, bear in ((74, "shares this view", "does not share this view"),
                                  (55, "shares this view", "does not share this view"),
                                  (44, "does not share this view", "shares this view"),
                                  (40, "does not share this view", "shares this view"),
                                  (45, "neutral", "neutral"), (54, "neutral", "neutral")):
            f = dict(base, score_now=score, band_now=sf.band_label(score))
            lines = sf.case_lines(f)
            self.assertIn(f"the crowd {bull}" if bull != "neutral" else "the crowd is neutral", lines["bull"], score)
            self.assertIn(f"the crowd {bear}" if bear != "neutral" else "the crowd is neutral", lines["bear"], score)
            self.assertIn(f"score {score} (", lines["bull"])
        thin = dict(base, thin_coverage=True, watchers=300)
        self.assertIn("too thin", sf.case_lines(thin)["bull"])
        self.assertEqual(sf.case_lines(thin)["bull"], sf.case_lines(thin)["bear"])

    def test_memo_has_no_forecast_words(self):
        memo = sf.to_memo(sf.compute(fixture("NUAI"))).lower()
        for banned in ("contrarian", "pullback", "expect", "signal", "crowded", "divergence", "spike"):
            self.assertNotIn(banned, memo)

    def test_thin_coverage_and_no_prices(self):
        raw = copy.deepcopy(fixture("NOW"))
        raw["pulse"]["watchers"] = 300
        raw["prices"] = None
        f = sf.compute(raw)
        self.assertTrue(f["thin_coverage"])
        self.assertIsNone(f["ret_20d"])
        self.assertTrue(any("No prices" in n for n in f["notes"]))
        self.assertTrue(f["flags"][0].startswith("Thin coverage"))


if __name__ == "__main__":
    unittest.main()
