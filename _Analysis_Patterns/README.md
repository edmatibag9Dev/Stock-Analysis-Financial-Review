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
