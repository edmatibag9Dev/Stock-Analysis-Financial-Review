# Stock Analysis Financial Review

Fundamental and technical investment analysis workflow for publicly traded stocks. Produces a professional investment memo and valuation Excel model for each ticker analyzed.

## Folder Structure

Each analysis is stored in its own subfolder: `{TICKER}-{YYYY-MM-DD}/`

```
├── BROS-2026-06-05/   ← Dutch Bros
├── SG-2026-06-05/     ← Sweetgreen
├── NOW-2026-06-05/    ← ServiceNow
├── PLTR-2026-06-05/   ← Palantir
└── stock-analysis.skill
```

Each folder contains the investment memo (.docx), Excel model (.xlsx where applicable), and the build scripts used to generate them.

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

| Ticker | Company | Date | Rating | DCF Bull / Base / Bear |
|---|---|---|---|---|
| BROS | Dutch Bros | 2026-06-05 | HOLD / ACCUMULATE ON PULLBACK at ~$55 | $76 / $47 / $26 |
| SG | Sweetgreen | 2026-06-05 | AVOID at $7.42 — Accumulate via CSPs at $5–6 | $14.77 / $3.49 / $1.36 |
| PLTR | Palantir | 2026-06-05 | See memo | See PLTR-2026-06-05/ |
| NOW | ServiceNow | 2026-06-05 | See memo | See NOW-2026-06-05/ |

## Running the Build Scripts

**Prerequisites:**
```bash
pip install openpyxl --break-system-packages
npm install -g docx
```

**Generate files (run from inside each ticker folder):**
```bash
cd BROS-2026-06-05 && node create_bros_memo.js
cd SG-2026-06-05   && node create_sg_memo.js && python3 build_sg_model.py
cd NOW-2026-06-05  && node create_now_memo.js
cd PLTR-2026-06-05 && python3 build_model.py
```

> ⚠️ Build scripts must be run in a Cowork desktop session — not Claude mobile. See CLAUDE.md for details.

## Skill

The `stock-analysis.skill` file is an installable Claude Cowork skill that automates the full workflow — research, model build, memo build, and Google Drive upload — for any publicly traded ticker.

> For AI agent instructions and detailed methodology, see [CLAUDE.md](./CLAUDE.md).
