# Stock Analysis Financial Review

Fundamental and technical investment analysis workflow for publicly traded stocks. Produces a professional investment memo and valuation Excel model for each ticker analyzed.

## What This Produces

For each stock, two deliverables are generated:
- **Investment Memo (.docx)** — 10-section analysis covering business snapshot, bull/bear case, DCF valuation, Rule of 40 (SaaS), peer comps, technical setup, options strategy, and verdict
- **Valuation Model (.xlsx)** — 4-sheet Excel model with historical financials, 5-year projections, DCF waterfall (bull/base/bear), and options strategy reference

## Methodology

- **Fundamental analysis:** SEC 10-Q/8-K filings, management guidance, unit economics
- **DCF valuation:** 3-scenario (bull/base/bear) with a single WACC; EBITDA-terminal approach for pre-profitable companies
- **Rule of 40:** Revenue growth % + FCF margin % for SaaS companies
- **Technical analysis:** SMA 20/50/200, RSI, IV rank for options sizing
- **Options overlay:** Cash-secured puts, covered calls, bull call spreads based on IV and DCF vs. current price

## Analyses

| Ticker | Company | Date | Rating |
|---|---|---|---|
| SG | Sweetgreen | June 2026 | AVOID at $7.42 — Accumulate via CSPs at $5–6 |
| PLTR | Palantir | June 2026 | See memo |
| NOW | ServiceNow | June 2026 | See memo |

## Running the Build Scripts

**Prerequisites:**
```bash
pip install openpyxl --break-system-packages
npm install -g docx
```

**Generate files:**
```bash
python3 build_sg_model.py        # SG Excel model
node create_sg_memo.js           # SG investment memo
python3 build_model.py           # PLTR/NOW Excel model
node create_now_memo.js          # NOW investment memo
```

## Skill

The `stock-analysis.skill` file is an installable Claude Cowork skill that automates the full workflow — research, model build, memo build, and Google Drive upload — for any publicly traded ticker.

> For AI agent instructions and detailed methodology, see [CLAUDE.md](./CLAUDE.md).
