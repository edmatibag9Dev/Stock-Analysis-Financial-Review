# Stock Ticker Analysis — AI Agent Context

This repository contains a full-stack investment analysis workflow for publicly traded stocks. It produces two deliverables for each ticker: a professional investment memo (.docx) and a valuation Excel model (.xlsx), covering fundamental analysis, DCF valuation, Rule of 40 (SaaS), peer comparables, technical setup, and an options strategy overlay.

---

## Project Purpose

Ed uses this workflow to build investment theses before making long equity or options trades. The analysis follows a disciplined fundamental + technical framework with three DCF scenarios (bull/base/bear). The stock-analysis.skill file packages the full workflow for use inside Claude Cowork mode.

---

## Repository Structure

```
├── CLAUDE.md                    ← You are here. AI agent instructions.
├── README.md                    ← Human-readable project overview
├── stock-analysis.skill         ← Installable Claude skill (zip). Contains SKILL.md + references/
│
├── build_sg_model.py            ← Python script: builds SG (Sweetgreen) Excel model via openpyxl
├── create_sg_memo.js            ← Node.js script: builds SG investment memo via docx library
│
├── build_model.py               ← Python script: builds PLTR/NOW Excel model (shared template)
├── create_now_memo.js           ← Node.js script: builds NOW (ServiceNow) investment memo
│
├── SG_Investment_Memo.docx      ← Latest SG investment memo (June 5, 2026)
├── SG_Investment_Model.xlsx     ← Latest SG Excel model (June 5, 2026)
├── PLTR_Investment_Memo.docx    ← Palantir investment memo
├── NOW_Investment_Memo.docx     ← ServiceNow investment memo
└── PLTR_NOW_Investment_Model.xlsx ← Shared PLTR/NOW Excel model
```

---

## Skill Architecture (stock-analysis.skill)

The `.skill` file is a zip archive. Unzip to inspect:

```
stock-analysis/
├── SKILL.md                     ← Master workflow: 4 phases (Intake → Research → Analysis → Present)
└── references/
    ├── dcf_defaults.md          ← Discount rates, terminal multiples, FCF margins by company type
    ├── memo_sections.md         ← Full 10-section memo template with formatting rules
    └── non_saas_adapts.md       ← Adaptations for restaurants, semis, financials, biotech
```

### The 4-Phase Workflow

**Phase 0 — Intake:** Confirm ticker, investment vehicle, primary concern, current position.

**Phase 1 — Research:** SEC EDGAR (10-Q + 8-K), price/technical data, Finviz chart, peer comps, Day One journal + Open Brain for prior thesis context.

**Phase 2 — Analysis:**
- Rule of 40 (SaaS companies): Revenue growth % + FCF margin %. >40 = healthy, >60 = exceptional.
- DCF Valuation (3 scenarios): Single WACC across all scenarios (⚠️ do NOT vary WACC by scenario). For restaurants/pre-EBITDA: use EBITDA-terminal multiple approach, NOT FCF DCF.
- Revenue multiple cross-check for Section 1 investment summary table.

**Phase 3 — Build:** Excel model (4 sheets: Dashboard, Model, Rule_of_40/Unit_Economics, Options_Strategy) + Word memo (10 sections). Color coding: blue = hardcoded inputs, black = formulas, green = cross-sheet links.

**Phase 4 — Reconcile + Present:** Verify all memo DCF numbers match the model before presenting. Upload both files to Google Drive folder `Stock Ticker Analysis` (ID: `19XzcvJr0sjyUfrUT9f3IrgfXAY0ns446`) for mobile access.

---

## Critical Methodology Rules

These are hard constraints validated by prior analysis review:

1. **Single WACC rule:** One discount rate across bull/base/bear scenarios. Scenario-dependent WACCs inflate the spread artificially. For a pre-profitable small-cap restaurant, use 12%.

2. **Memo-model reconciliation:** Always verify memo DCF prices match model before delivering. The model (live formulas) is authoritative; the memo is a narrative document prone to going stale.

3. **Restaurant DCF:** Use EBITDA-terminal multiple approach. Match terminal EV/EBITDA multiple to projected terminal EBITDA margin — do NOT apply 18x to a company with 3.5% EBITDA margins (correct multiple: 10–12x at those margins).

4. **Automation thesis (IK/robotics):** Build a unit-level IK vs. traditional decomposition to derive blended margins rather than asserting terminal margins directly.

5. **Options yield labeling:** State as "per-cycle yield" not "annualized yield" (a 13–18% per-cycle yield on a 10-week CSP annualizes to ~80–94%).

6. **Revenue base clarity:** If Year 1 revenue uses management guidance (not prior-year × growth %), label the growth table as "growth from [$X guidance base]" to prevent YoY confusion.

---

## DCF Defaults Quick Reference

| Company Type | WACC | Terminal Multiple | Method |
|---|---|---|---|
| High-growth AI/SaaS (>50% rev growth) | 12% | 25–35x EV/FCF | FCF Gordon Growth |
| Growth SaaS (20–50%) | 10–11% | 20–25x EV/FCF | FCF Gordon Growth |
| Mature SaaS (<20%) | 9–10% | 18–20x EV/FCF | FCF Gordon Growth |
| Restaurant / Fast-Casual (pre-EBITDA) | 12% | 10–22x EV/EBITDA | EBITDA terminal multiple |
| Semiconductor / Hardware | 11–12% | 18–22x EV/FCF | FCF Gordon Growth |

Full tables in `stock-analysis.skill` → `references/dcf_defaults.md`.

---

## Completed Analyses

| Ticker | Company | Date | Verdict | DCF Bull/Base/Bear |
|---|---|---|---|---|
| SG | Sweetgreen | 2026-06-05 | AVOID at $7.42 / Accumulate via CSPs at $5–6 | $14.77 / $3.49 / $1.36 |
| PLTR | Palantir | 2026-06-05 | See PLTR_Investment_Memo.docx | See PLTR_NOW_Investment_Model.xlsx |
| NOW | ServiceNow | 2026-06-05 | See NOW_Investment_Memo.docx | See PLTR_NOW_Investment_Model.xlsx |
| BROS | Dutch Bros | 2026-06-05 | HOLD / ACCUMULATE ON PULLBACK at ~$55 | $76 / $47 / $26 (EBITDA-terminal DCF, 12% WACC) |

---

## Build Scripts

### Excel Model (Python / openpyxl)
```bash
cd "Stock Ticker Analysis"
python3 build_sg_model.py        # Generates SG_Investment_Model.xlsx
python3 build_model.py           # Generates PLTR_NOW_Investment_Model.xlsx
```
Dependencies: `pip install openpyxl --break-system-packages`

### Investment Memo (Node.js / docx)
```bash
node create_sg_memo.js           # Generates SG_Investment_Memo.docx
node create_now_memo.js          # Generates NOW_Investment_Memo.docx
node create_bros_memo.js         # Generates BROS_Investment_Memo.docx
```
Dependencies: `npm install -g docx` (install to `/tmp/npm-global`)

**⚠️ Mobile workflow warning:** Analyses initiated on Claude mobile (iOS/Android) will NOT produce valid .docx output. Mobile Claude lacks access to the Node.js build scripts and falls back to raw XML string building, which produces corrupt ZIP archives (bad CRC, malformed XML). Always run the final build step — `node create_{ticker}_memo.js` — in a Cowork desktop session. The BROS memo was originally generated on mobile and had to be rebuilt on desktop (June 6, 2026).

**Important:** Scripts have hardcoded session paths for the Finviz chart and output files. When running in a new environment, update these paths:
- Chart source: `/sessions/{session-id}/mnt/outputs/{ticker}_chart.png`
- Output path: `/sessions/{session-id}/mnt/Stock Ticker Analysis/{TICKER}_Investment_*.{ext}`

---

## Google Drive Sync

All completed analyses are mirrored to Google Drive for mobile access:
- **Folder:** https://drive.google.com/drive/folders/19XzcvJr0sjyUfrUT9f3IrgfXAY0ns446
- Files are converted to Google Doc/Sheets format on upload for native mobile viewing.
- The skill auto-uploads after every new analysis (Phase 4B in SKILL.md).

---

## Adding a New Analysis

1. Run the stock-analysis skill in Claude Cowork: `analyze $TICKER`
2. The skill handles research (SEC EDGAR + web), model build, memo build, and Drive upload automatically.
3. Add the new build scripts and output files to this repo and push.
4. Update the Completed Analyses table in this CLAUDE.md.
