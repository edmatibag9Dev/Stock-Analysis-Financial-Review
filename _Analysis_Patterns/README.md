# Cross-Ticker Analysis Patterns

This folder stores recurring patterns identified across multiple stock analyses. Each pattern file documents a signal or behavior observed in 2+ tickers, with evidence and the lesson learned.

## Purpose

When a quarterly update surfaces a material change (e.g., store count cut, margin compression, revenue guide-down), check this folder first:
- Has this pattern appeared in a peer company before?
- Were there SEC filing signals that pointed toward it?
- What was the outcome when we acted (or failed to act) on it?

## Pattern File Format

Each pattern is a markdown file named `pattern_{signal_type}.md` with:
- **Signal name** — short description of the pattern
- **Tickers observed** — which analyses surfaced this pattern
- **Leading indicators** — what SEC filing data or fundamental metrics preceded the event
- **Outcome** — what happened to the stock after the signal
- **Lesson** — what to watch for in future analyses

## Evaluation Cadence

- **Semi-annual**: Review all patterns — mark as "Confirmed" (3+ data points) or "Unconfirmed" (1-2 data points)
- **Annual**: Promote confirmed patterns to the main DCF defaults or methodology rules in CLAUDE.md

## Current Patterns

| File | Signal | Tickers | Status |
|---|---|---|---|
| *(none yet — populated as analyses are completed)* | | | |

## Pattern: Traffic-composition de-rate on a beat-and-raise ($BROS, 2026-08-06)
For premium-multiple growth restaurants (>23x EV/EBITDA), the market treats a decelerating
TRANSACTION comp as a thesis break even when headline SSS beats and guidance is raised.
$BROS fell ~18% in a day on transactions +1.7% (vs +3.7% PY) despite raising both FY26
revenue and EBITDA guidance. Monitor transaction comps, not SSS, as the primary demand
signal; expect instant multiple compression when ticket/pricing carries the comp.

## Pattern: Rule-of-40 crossing triggers re-rating ($FSLY, 2026-08-10)
For an inflecting infra/SaaS name trading near mature-peer multiples, the first clean cross
above Rule of 40 (EBITDA basis) acts as the re-rating catalyst. $FSLY: June 2026 memo scored
Ro40 at ~37 and named crossing 40 "the single most important fundamental milestone for a
re-rating"; Q2'26 printed 43.8 (growth 23% + adj. EBITDA 20.8%) and the stock re-rated
4.4x→6.0x fwd EV/S (+38% vs the June analysis price, incl. a +20.9% day amplified by an
18% short float). Leading indicators that confirmed the path 1–2 quarters ahead: RPO growth,
NRR climbing (113%→117%), security/attach mix shift, record gross margins.
LESSON (process): a purely intrinsic-value accumulation zone ($13–17, base-DCF-anchored)
was never offered — stock bottomed at technical support (~$18–19, 200-day) before the move.
For inflecting names with confirming leading indicators, stage adds at technical support
rather than waiting only for the intrinsic zone. Status: Unconfirmed (1 data point).
