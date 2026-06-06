# Stock Ticker Analysis — AI Agent Context

This repository contains a full-stack investment analysis workflow for publicly traded stocks. It produces two deliverables for each ticker: a professional investment memo (.docx) and a valuation Excel model (.xlsx), covering fundamental analysis, DCF valuation, Rule of 40 (SaaS), peer comparables, technical setup, and an options strategy overlay.

---

## Project Purpose

Ed uses this workflow to build investment theses before making long equity or options trades. The analysis follows a disciplined fundamental + technical framework with three DCF scenarios (bull/base/bear). The stock-analysis.skill file packages the full workflow for use inside Claude Cowork mode.

---

## Repository Structure

Two-level folder hierarchy: `{TICKER}/` at root contains dated analysis subfolders `{TICKER}-{YYYY-MM-DD}/` and an Archive folder. Root-level files are project-wide.

```
├── CLAUDE.md                              ← You are here. AI agent instructions.
├── README.md                              ← Human-readable project overview
├── stock-analysis.skill                   ← Installable Claude skill (zip)
├── _Analysis_Patterns/                    ← Cross-ticker signal pattern library
│   └── README.md
│
├── BROS/
│   ├── BROS-2026-06-05/                   ← Most recent analysis (top of folder)
│   │   ├── BROS_Investment_Memo.docx
│   │   └── create_bros_memo.js
│   └── BROS_Archive/                      ← Analyses older than the last 3
│
├── SG/
│   ├── SG-2026-06-05/
│   │   ├── SG_Investment_Memo.docx
│   │   ├── SG_Investment_Model.xlsx
│   │   ├── build_sg_model.py
│   │   └── create_sg_memo.js
│   └── SG_Archive/
│
├── NOW/
│   ├── NOW-2026-06-05/
│   │   ├── NOW_Investment_Memo.docx
│   │   ├── PLTR_NOW_Investment_Model.xlsx  ← Copy of shared model
│   │   └── create_now_memo.js
│   └── NOW_Archive/
│
└── PLTR/
    ├── PLTR-2026-06-05/
    │   ├── PLTR_Investment_Memo.docx
    │   ├── PLTR_NOW_Investment_Model.xlsx  ← Source of shared model
    │   └── build_model.py
    └── PLTR_Archive/
```

**Naming convention:**
- Top-level folder: `{TICKER}/` — one per company, persists forever
- Analysis subfolder: `{TICKER}-{YYYY-MM-DD}/` — one per analysis date
- Quarterly updates create a new dated subfolder; prior analyses are never overwritten
- Archive rule: keep the 3 most recent dated subfolders active; move older ones to `{TICKER}_Archive/`

---

## Skill Architecture (stock-analysis.skill)

The `.skill` file is a zip archive. Unzip to inspect:

```
stock-analysis/
├── SKILL.md                     ← Master orchestrator: Phase 0 routing + Phases 1–4
├── workflows/
│   └── options_mode.md          ← Options-only workflow (triggered by Phase 0 vehicle = c)
└── references/
    ├── dcf_defaults.md          ← Discount rates, terminal multiples, FCF margins by company type
    ├── memo_sections.md         ← Full 10-section memo template with formatting rules
    └── non_saas_adapts.md       ← Adaptations for restaurants, semis, financials, biotech
```

### The 4-Phase Workflow

**Phase 0 — Intake:** Confirm ticker, analysis type (new vs. quarterly update), trading vehicle (equity / overlay / options-only), primary concern, current position. Routes to Phase 0B for quarterly updates, or to `workflows/options_mode.md` for options-only trades.

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

7. **Options-only mode — IV Rank first:** When trading vehicle is options-only (no equity position), determine IV Rank before selecting strategy. IV Rank ≥ 50 → sell premium (spreads, condors). IV Rank < 50 → buy options. Do NOT buy long options into high-IV environments regardless of directional conviction.

8. **Options-only mode — size to max loss:** Always compute max loss in dollar terms before stating a position size. Never size based on number of contracts without this calculation.

9. **Options-only mode — time the thesis:** Match option expiry to the realistic timeframe of the thesis, not the cheapest available expiry. Use LEAPS (6–12 month) for multi-quarter theses.

10. **Options-only mode — market implied vs. DCF check:** Always compare the options market's 1-SD implied move against the DCF bull/base/bear spread before recommending a trade. Full workflow in `stock-analysis.skill` → `workflows/options_mode.md`.

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
cd "Stock Ticker Analysis/SG/SG-2026-06-05"
python3 build_sg_model.py        # Generates SG_Investment_Model.xlsx

cd "Stock Ticker Analysis/PLTR/PLTR-2026-06-05"
python3 build_model.py           # Generates PLTR_NOW_Investment_Model.xlsx
```
Dependencies: `pip install openpyxl --break-system-packages`

### Investment Memo (Node.js / docx)
```bash
cd "Stock Ticker Analysis/SG/SG-2026-06-05"   && node create_sg_memo.js
cd "Stock Ticker Analysis/NOW/NOW-2026-06-05"  && node create_now_memo.js
cd "Stock Ticker Analysis/BROS/BROS-2026-06-05" && node create_bros_memo.js
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
3. Save all output files into a new subfolder: `{TICKER}-{YYYY-MM-DD}/`
4. Push the new folder to GitHub.
5. Update the Completed Analyses table in this CLAUDE.md.
