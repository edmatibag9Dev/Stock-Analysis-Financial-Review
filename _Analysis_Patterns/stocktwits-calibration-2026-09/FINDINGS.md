# Stocktwits sentiment calibration — findings (2026-09-27)

**Bottom line: in this sample, Stocktwits sentiment moves *with* price on the same day. It does not lead price, and it does not predict returns or volatility over the next 1–20 sessions.** Use it to describe the crowd, not to forecast.

Scope and limits:
- 7 tickers from the repo and Drive: $BROS, $FSLY, $NOW, $NUAI, $PLTR, $SG, $TRMB.
- 6 months of daily data (2026-03-26 → 2026-09-25, about 888 ticker-days) plus up to 5 years of monthly data (365 ticker-months).
- One market regime, with overlapping forward windows. That is too small to prove or disprove an edge. What it can do is set thresholds and rule out claims the design was about to make.

Sources:
- Stocktwits MCP (`get_sentiment_history` 6M/5Y, `get_message_volume_history` 6M), pulled 2026-09-27 at about 11:01 PT.
- Yahoo daily closes.
- All 21 series were checked value-by-value against the raw tool responses: 0 mismatches.
- Reproduce: `python3 calibrate.py` → `results.md`, `results.json`.

## Findings

| # | Question | Result | Read |
|---|---|---|---|
| 1 | Does a sentiment change line up with the **same day's** return? | r = 0.19 (n = 881, t = 5.7). Without $NUAI: r = 0.10 (t = 2.7). | Yes. Sentiment reacts to price. |
| 2 | Does today's sentiment change predict **tomorrow's** return? | r = 0.02 (t = 0.7). Without $NUAI: r = 0.00. | No. |
| 3 | Does the sentiment **level** predict the next 5 / 20 sessions? | r = −0.01 / −0.04 (t = −0.3 / −1.1) | No. |
| 4 | After sentiment first hits ≥ 75 **and** volume ≥ 75 ("crowded bullish") | Next 10 sessions: +0.1% ± 3.4% (n = 19, across 6 tickers), vs. +2.0% ± 0.5% on all days | No detectable difference. |
| 5 | After sentiment first hits ≥ 75 with volume < 75 | +15.3% ± 7.2% (n = 11) | Two standard errors, but n = 11 and one of many cuts tried. Not usable. |
| 6 | After sentiment first hits ≤ 24 | −8.2% ± 6.3% (n = 6) | Too few to read. |
| 7 | Chatter spike (volume ≥ 75): same-day move | Average absolute return 13.8% on spike days vs. 3.6% on all days | Spikes coincide with big price days. |
| 8 | Chatter spike: realized volatility over the next 10 sessions | 84% vs. 71% pooled — **but only 1.07× each ticker's own average**, higher in 53% of cases | The pooled gap is ticker mix (volatile names spike more). No forward volatility signal. |
| 9 | 20-session price-vs-crowd divergence | "Price down, crowd warming" −1.8% next 10 sessions vs. +2–3% in the other states. Overlapping days make the true error several times larger than ±1.2%. | Not distinguishable. |
| 10 | Month-end score vs. next month's return (5Y) | r = 0.03 (n = 358, t = 0.5) | No. |

Threshold sweep (score 65–80 × volume 60–80): the volume cut matters more than the score cut. Forward 10-session means drop from about +4% to about 0% once volume ≥ 75 is required, at every score level. None of those means differs from baseline by more than about one standard error.

## Decisions this drives (applied in Phase 3)

1. **Thresholds stay at Stocktwits' own label boundaries.** ≥ 75 Extremely Bullish, ≤ 24 Extremely Bearish, volume ≥ 75 Extremely High. Nothing in the data justifies a different cut. $NUAI (74 / 79) therefore stays unflagged. It is shown as "one point under".
2. **The crowding flag is descriptive only.** Memo wording: "the crowd is loud and bullish". Never "expect a pullback" or "expect volatility".
3. **Drop the draft Section 10 rule** ("crowded bullish + high IV → premium rich"). Finding 8 shows a spike adds nothing that the implied-volatility number doesn't already show. Section 10 states the crowd state and nothing more.
4. **Divergence stays descriptive** (finding 9).
5. **Allowed memo language:** "the crowd is reacting to…", "the crowd disagrees with our verdict", "chatter spiked on the day the stock moved X%". **Banned:** any sentence that uses sentiment to forecast price, volatility, or timing.
6. **Leading filler is a run, not one bucket.** $NUAI's 5Y series begins with eight months at exactly 50 (before coverage). `drop_filler` now strips the whole leading run.
7. **Re-run this study** in about 6 months (≈ 2027-03) or after 10+ new tickers, whichever comes first. The data files make it a one-command rerun once the series are re-pulled.

## Data quirks confirmed

- 6M zoom = daily (128 buckets). 1Y = weekly. 5Y = monthly; the newest month is partial.
- Monthly history starts when coverage begins: $BROS 2021-10, $SG 2021-11, $NUAI 2024-12 (effective 2025-08).
- Label boundaries seen in the data: 24 Extremely Bearish / 25 Slightly Bearish; 74 Slightly Bullish / 75 Extremely Bullish; 44 Slightly Bearish / 45 Neutral; 54 Neutral / 55 Slightly Bullish.
