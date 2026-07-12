# Stock Analysis Financial Review

Fundamental and technical investment analysis workflow for publicly traded stocks. Produces a professional investment memo and valuation Excel model for each ticker analyzed.

## Folder Structure

Each ticker gets a top-level folder holding its dated analyses plus an archive: `{TICKER}/{TICKER}-{YYYY-MM-DD}/`

```
├── BROS/BROS-2026-06-05/   ← Dutch Bros
├── SG/SG-2026-06-05/       ← Sweetgreen
├── NOW/NOW-2026-06-05/     ← ServiceNow
├── PLTR/PLTR-2026-06-05/   ← Palantir
├── FSLY/FSLY-2026-06-08/   ← Fastly
├── TRMB/TRMB-2026-06-11/   ← Trimble
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
| FSLY | Fastly | 2026-06-08 | HOLD / ACCUMULATE ON WEAKNESS at ~$20 | $24.16 / $12.55 / $6.97 |
| TRMB | Trimble | 2026-06-11 | BUY / ACCUMULATE ON WEAKNESS at ~$50 (staged entry; CSPs $45/$42.50) | $97 / $72 / $36 |

## Running the Build Scripts

**Prerequisites:**
```bash
pip install openpyxl --break-system-packages
npm install -g docx
```

**Generate files (run from inside each ticker folder):**
```bash
cd BROS/BROS-2026-06-05 && node create_bros_memo.js
cd SG/SG-2026-06-05     && node create_sg_memo.js && python3 build_sg_model.py
cd NOW/NOW-2026-06-05   && node create_now_memo.js
cd PLTR/PLTR-2026-06-05 && python3 build_model.py
cd FSLY/FSLY-2026-06-08 && node create_fsly_memo.js && python3 build_fsly_model.py
cd TRMB/TRMB-2026-06-11 && node create_trmb_memo.js && python3 build_trmb_model.py
```

> ⚠️ Build scripts must be run in a Cowork desktop session — not Claude mobile. See CLAUDE.md for details.

## Skill

The `stock-analysis.skill` file is an installable Claude Cowork skill that automates the full workflow — research, model build, memo build, and Google Drive upload — for any publicly traded ticker.

> For AI agent instructions and detailed methodology, see [CLAUDE.md](./CLAUDE.md).

---
*Last updated: 2026-07-12*
