---
name: stock-analysis
description: |
  Full fundamental and technical investment analysis for ANY publicly traded stock, ETF, or company. Produces a professional investment memo (.docx) and valuation Excel model (.xlsx) covering DCF bull/base/bear scenarios, Rule of 40 (SaaS), peer comps, technical setup with chart, options strategy overlay, and a Stocktwits social-sentiment data layer (context only, never an input). ALWAYS trigger this skill when the user mentions analyzing, researching, or building a thesis on any stock or company; asks for a bull/bear/base case; says things like "analyze $TICKER", "is [stock] worth buying", "DCF for [ticker]", "investment memo for [company]", "options strategy for [ticker]", "Rule of 40 analysis", or pastes a ticker symbol in any investment/trading context. This skill is not limited to specific stocks — it works for any publicly traded equity.
---

# Stock Investment Analysis Skill

Produces two deliverables for any publicly traded stock:
1. **{TICKER}_Investment_Memo.docx** — 10-section investment memo
2. **{TICKER}_Investment_Model.xlsx** — DCF + Rule of 40 + peer comps + options model

Read `references/memo_sections.md` for the full memo template before writing the Word doc.
Read `references/dcf_defaults.md` for DCF assumption defaults by company type.
Read `references/non_saas_adapts.md` if the company is NOT a software/SaaS business.
Read `references/leadership_scorecard.md` for the scored Leadership & Governance module (who runs the company + why it matters).

---

## Output Folder Standard (MANDATORY — applies to every run)

Two stores, different jobs:
- **Google Drive = system of record.** EVERY analysis is saved to Drive, always — including one-look
  passes and AVOID verdicts. Drive holds the complete history so cross-ticker comparisons always have
  full context.
- **Local git repo = active working set only.** The repo (`Stock-Analysis-Financial-Review`) stays
  lean: it holds only tickers Ed is actively engaged with. Keeping it curated is deliberate, not laziness.

Never leave an empty folder, and never drop deliverables loose in the root.

### Repo inclusion policy (decide at the END of every run)
A ticker belongs in the LOCAL REPO only if Ed has one of:
- an open equity position, OR
- an active options trade on it, OR
- a live watchlist entry with a planned entry.

Everything else — a one-look verdict, a pass, an AVOID with no position — is **Drive-only**.
(`$NUAI` = AVOID, no position → Drive-only, never committed. `$SG` = AVOID rating but active CSP
accumulation → repo. The test is active engagement, not the rating.)

At the end of each analysis, after the Drive upload, ASK:
*"Add this ticker to the repo (active position/watchlist), or keep it Drive-only?"*
**Default to Drive-only** unless Ed confirms an active engagement. If Drive-only: upload to Drive and
STOP — do not write or commit the ticker folder into the repo.

Enforcement: the repo `.gitignore` ignores all `/$*/` ticker folders by default, so a Drive-only
ticker cannot be committed by accident. To add an approved ticker, force-add it once:
`git add -f "$TICKER/" ':(exclude)**/*_sentiment_raw_*.json'` (it stays tracked thereafter). The exclude keeps
Phase 1H Stocktwits captures local — `-f` overrides `.gitignore`, so the pathspec is the only guard.

### Naming convention (`$TICKER` everywhere)
The `$` + uppercase symbol is the standard across folders, subfolders, AND output files — identical
in the local repo and in Google Drive:

| Item | Pattern | Example |
|---|---|---|
| Ticker folder | `$TICKER/` | `$NOW/` |
| Dated analysis subfolder | `$TICKER-YYYY-MM-DD/` | `$NOW-2026-07-23/` |
| Archive folder | `$TICKER_Archive/` | `$NOW_Archive/` |
| Memo file | `$TICKER_Investment_Memo_YYYY-MM-DD.docx` | `$NOW_Investment_Memo_2026-07-23.docx` |
| Model file | `$TICKER_Investment_Model_YYYY-MM-DD.xlsx` | `$NOW_Investment_Model_2026-07-23.xlsx` |
| Chart | `$TICKER_chart.png` | `$NOW_chart.png` |
| Sentiment capture (Phase 1H) | `$TICKER_sentiment_raw_YYYY-MM-DD.json` | `$NOW_sentiment_raw_2026-07-23.json` |
| Sentiment features (Phase 1H) | `$TICKER_sentiment_features_YYYY-MM-DD.json` | `$NOW_sentiment_features_2026-07-23.json` |

**Exception (shell-safety):** build scripts and code keep plain names — no `$` (e.g. `build_model.py`,
`create_memo.js`) — because a literal `$` in a path must be quoted/escaped in the shell. Any script
that writes a deliverable MUST quote its output paths (e.g. `"$TICKER/…"`).

**Legacy migration (on next touch):** folders still without the `$` prefix (`BROS`, `PLTR`, `SG`,
`FSLY`, `TRMB`) are renamed to the `$TICKER` standard — folder + subfolders + files — the next time
that ticker is analyzed, in the same run. `$NUAI` (Drive-only) and `$NOW` are already on-standard.

### Save steps
- **Google Drive (always):** create/reuse the `$TICKER/` subfolder under the root and PUT the files
  in it (see Phase 4B).
- **Local repo (approved tickers only):** create/rename `$TICKER/` inside the project folder
  (`…/Documents/Claude/Projects/Stock Ticker Analysis/$TICKER/`), write the dated files, and
  `git add -f "$TICKER/" ':(exclude)**/*_sentiment_raw_*.json'` if new. Skip entirely for Drive-only tickers.

Confirm Drive is populated on every run; confirm the repo is populated only for approved tickers.

---

## Phase 0: Intake

Ask these questions before starting (use AskUserQuestion if the info isn't already in the conversation):

1. **Ticker & company** — confirm symbol and exchange if ambiguous (e.g., "NOW" = ServiceNow on NYSE)
2. **Analysis type** — new analysis, or quarterly update of an existing ticker?
3. **Trading vehicle** — choose one:
   - **(a) Long equity** — buying or holding shares
   - **(b) Options overlay** — options on top of an existing equity position (covered calls, CSPs)
   - **(c) Options-only** — directional options play, no equity position
4. **Primary concern** — valuation, growth durability, macro/rates, or all equally
5. **Current position** — do you already hold shares or options? (size, strikes, expiry if applicable)
6. **Output needed** — memo + model, memo only, or model only?

**Routing rules — apply before proceeding:**

- If answer to (2) is **quarterly update**: do NOT run a full rebuild. Open the most recent analysis folder for this ticker, read the existing memo and model, then jump to **Phase 0B** (Quarterly Update Workflow) below.
- If answer to (3) is **(c) options-only**: read `workflows/options_mode.md` immediately after completing Phase 1 research. Standard Section 10 (Options Strategy) is replaced by the options-only workflow in that file. Sections 1–9 execute identically.
- If answer to (2) is **new analysis** and vehicle is (a) or (b): proceed normally through Phases 1–4 below.

If the user's request already answers these, skip straight to Phase 1.

---

## Phase 0B: Quarterly Update Workflow

**Only enter this phase if the user confirmed this is a quarterly update (not a new analysis).**

### Step 1 — Load prior analysis
- Locate the most recent dated folder for this ticker in the workspace (e.g., `BROS-2026-06-05/`).
- Read the existing memo (.docx) and open the Excel model (.xlsx).
- Note the prior DCF bull/base/bear values and prior rating/verdict.

### Step 2 — Targeted research
Run Phase 1B + 1C only — no need to re-run full peer comps or 10-K unless a structural change occurred:
- Latest 10-Q (most recent quarter not in the prior analysis)
- Latest 8-K earnings press release (guidance updates)
- Any 8-K filings since the last analysis date (material events, capital raises, guidance cuts)
- Re-run Phase 1H (Stocktwits). It is a live snapshot, so refresh it on every update.

### Step 3 — Apply material change thresholds
If ANY of these are triggered, flag this as a **Retrospective Signal Check** (see Step 5):
- Unit/store count guidance cut >= 15%
- Revenue guidance revision >= +/- 5%
- Margin revision >= +/- 200bps
- Capital structure change (equity offering, debt raise, buyback announcement)
- Rating change from prior analysis warranted

### Step 4 — Update only what changed
DO NOT rewrite sections that have not changed. Update only:
- Section 1 (Investment Summary) — refresh DCF prices if assumptions changed
- Section 2 (Business Snapshot) — add latest quarter actuals
- Section 3 (Management & Governance) — re-score if leadership changed (new CEO/CFO, major insider activity, governance event)
- Section 5 (Bear Case) — add any new risks from the quarter
- Section 6 (DCF Valuation) — update if growth/margin assumptions changed
- Section 11 (Verdict) — update rating if warranted
- Bull Case, Bear Case and Technical Setup — replace the Social sentiment lines and table with the fresh Phase 1H output. Numbers only; no new section, and no "what changed in the crowd" commentary.
- Excel model: update actuals row, revise projection inputs if changed; replace the Sentiment sheet

### Step 5 — Retrospective Signal Check (if material change threshold crossed)
Add a "What Changed" section to the memo (insert after Section 2):
1. **Peer comparison** — did comparable companies show similar signals in prior quarters?
2. **SEC filing trend** — look back 2–3 quarters: was there a trend in Capex, deferred revenue, or unit economics pointing toward this change?
3. **Cross-ticker pattern** — check `_Analysis_Patterns/` at the repo root for any documented patterns matching this signal.
4. **Conclusion** — "Could we have seen this coming?" Write 2–3 paragraphs in the What Changed section.

### Step 6 — Save to the ticker folder (dated files)
Save into the `$TICKER/` folder (see **Output Folder Standard** above) using today's date in the
filenames: `$TICKER_Investment_Memo_{YYYY-MM-DD}` and `$TICKER_Investment_Model_{YYYY-MM-DD}`.
Do NOT overwrite the prior analysis — the date in the filename keeps versions distinct.

### Step 7 — Drive upload
Upload the new dated files into the Drive `$TICKER/` subfolder (see Phase 4B).

---

## Phase 1: Research

Complete ALL research before building any deliverable. Run web searches in parallel where possible.

### 1A — Prior Knowledge (Day One + Open Brain)
Search both knowledge stores in parallel before doing any external research.

**Day One Journal:**
```
mcp__dayone__search_entries(search_text="{TICKER}")
mcp__dayone__search_entries(search_text="{Company Name}", journal="Options Trading Journal")
```

**Open Brain:**
```
mcp__open-brain__search_thoughts(query="{TICKER}")
mcp__open-brain__search_thoughts(query="{Company Name}")
```

Synthesize into a "Prior Context" note — carry through the analysis and reference explicitly in the memo. If nothing is found, note briefly and continue.

### 1B — SEC EDGAR Filings
Find and fetch the latest **10-Q** (quarterly) and **8-K earnings press release**.

Search: `"{TICKER} 10-Q 2026 SEC EDGAR filing financials"`

**Extract from 10-Q** (spawn a subagent for files >100KB):
- Revenue: quarterly + prior year quarter (for YoY growth)
- Revenue breakdown by segment if available
- Gross profit and gross margin %
- GAAP operating income/loss
- Non-GAAP operating income (if disclosed)
- Net income and EPS (diluted)
- Cash from operations + capex → implied FCF
- Cash, cash equivalents, marketable securities (balance sheet)
- Total debt (balance sheet)
- Diluted share count
- For SaaS: deferred revenue, RPO, cRPO

**Extract from 8-K press release:**
- Full-year guidance (revenue + margins)
- Next quarter guidance
- Non-GAAP metrics (adjusted operating income, adjusted FCF)
- Key operating metrics (customers, NRR, ACV, etc.)

Also fetch the most recent **10-K** (annual) if you need full-year historical figures.

### 1C — Price & Technical Data
Web search: `"{TICKER} stock price current 2026 52 week high low moving averages"`
Web search: `"{TICKER} implied volatility IV rank options 2026"`

Collect:
- Current price
- 52-week high and low
- 20-day, 50-day, 200-day SMA
- RSI (14-day)
- IV and IV Rank (for options sizing)

### 1D — Finviz Chart
Download the daily chart image:
```bash
curl -L -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" \
  "https://finviz.com/chart.ashx?t={TICKER}&ty=c&ta=1&p=d&s=l" \
  -o /path/to/outputs/{ticker}_chart.png --silent
file {ticker}_chart.png  # verify it's a valid PNG
```
If Finviz blocks the request, note that the user can supply a TradingView snapshot URL instead.

### 1E — Prior Full-Year Results
If the 10-Q only has one quarter, search for the most recent full fiscal year:
`"{TICKER} FY2025 annual revenue FCF full year results"`

Needed for: base year in DCF, Rule of 40 historical trend.

### 1F — Peer Comparables
Identify 5–7 comparable public companies by sector and business model.
For each peer, find (approximately): forward revenue growth %, FCF margin %, forward EV/Sales multiple.
Label as approximate in the model.

### 1G — Leadership & Insider Data
Pull the "who runs this company" data set. See `references/leadership_scorecard.md` (Part A) for the
full field list and source priority. At minimum collect:
- **CEO & CFO** — name, founder-or-hired, year they took the seat (tenure), prior track record
- **Insider ownership %** and **voting/share structure** (single- vs. dual-class) — from the **DEF 14A proxy**
- **Recent insider activity** — net open-market buys vs. sells over the last 12 months from **Form 4** filings
  (exclude routine 10b5-1 / option-exercise sells; flag genuine open-market purchases)
- **Capital-allocation history** — buybacks, M&A, dilution/share-count trend (from 10-K/10-Q + calls)
- **Governance flags** — combined Chair/CEO, related-party deals, restatements, turnover, litigation

Search: `"{TICKER} DEF 14A proxy statement insider ownership"` and `"{TICKER} insider trading Form 4 2026"`.
If a proxy is unavailable (foreign issuer, recent IPO), note the gap and score conservatively.

### 1H — Social Sentiment (Stocktwits data layer)

**Rule: this is one more data layer, not an edge.** It never changes the analysis setup, a DCF
input, a scenario weight, the Leadership score, the rating, or an options strike. Its only outputs
are the Technical Setup table, one "Social sentiment" line closing the Bull Case AND one closing the
Bear Case, and the model's Sentiment sheet. Locate sections **by name, not number**: a memo with extra
sections (a permits tracker, a "What Changed" section) shifts every number after it. (Basis: the 2026-09 calibration on 7 tickers found sentiment moves
with price on the same day and predicts nothing over the next 1–20 sessions —
`_Analysis_Patterns/stocktwits-calibration-2026-09/FINDINGS.md` in the repo.)

Tools: the Stocktwits MCP connector (read-only). Script: `scripts/sentiment_features.py` in this
skill's folder. The script never calls Stocktwits itself. Claude pulls the data and writes one capture file.
**Phase 1H is mandatory on every run** (new analysis and quarterly update). It either produces a validated
capture file or an explicit, reported skip — never a silent omission.

0. **Load the connector tools first.** In a session the tools carry a connector prefix
   (`mcp__<connector-id>__get_symbol_pulse`) and are often deferred. Before any call:
   a. Run ToolSearch `query: "stocktwits sentiment history message volume history symbol pulse messages"`,
      `max_results: 10`.
   b. Check that five tools whose names END in these are loaded: `get_symbol`, `get_symbol_pulse`,
      `get_sentiment_history`, `get_message_volume_history`, `get_symbol_messages`. One query does not
      always return all five (tested 2026-09-28: a narrower query missed `get_message_volume_history`,
      the wider one missed `get_symbol`). For each missing one, search again with its own words (e.g.
      `"stocktwits get_symbol metadata current price"`), or `select:` it by full name once the prefix is known.
   c. **If no Stocktwits tool is found at all**, the connector is not connected in this
   session: run `python3 scripts/sentiment_features.py skip "<SYMBOL>" --reason "Stocktwits connector not
   connected in this session"` and paste its output into Technical Setup and both case lines, skip steps
   1–8, and report it in the closing summary. **Never estimate sentiment from web search, news or
   anything else** — no connector means no sentiment layer.
1. `get_symbol(TICKER)` — confirm coverage. If there is none, write "No Stocktwits coverage for
   {TICKER}" in Technical Setup, use the thin-coverage line in the Bull and Bear Cases, and skip the rest.
2. `get_symbol_pulse(TICKER)` — snapshot: `sentiment.score` + `label`, `message_volume.score` +
   `label`, `watchers.count`, price, `price_time`.
3. `get_sentiment_history(TICKER, zoom="3M")` (daily) and `zoom="1Y"` (weekly).
4. `get_message_volume_history(TICKER, zoom="3M")`.
5. `get_symbol_messages(TICKER, filter="top", limit=30)` — read for the optional theme clause. It
   returns the newest posts first, not the most-engaged, so treat it as a recent sample.
6. Write `$TICKER-{date}/$TICKER_sentiment_raw_{date}.json` in the schema in the script's docstring:
   - Dates are the first 10 characters of each bucket's `time`. Keep every bucket, in order, including the first.
   - Per post keep only id, created_at, n_symbols, tag, author (anonymised a1..aN), likes. **No bodies, no usernames.**
   - **Never copy** the legacy `bull_pct` / `bear_pct` (they contradict the score: $NOW read 96% bullish at score 40), the legacy volume `label`, or the raw volume `value`.
7. Run, quoting paths:
   `python3 scripts/sentiment_features.py validate "<raw>"` → must print OK
   `python3 scripts/sentiment_features.py prices "<raw>"` (adds Yahoo closes; if the sandbox blocks the
   network call, skip it — `compute` still runs, leaves the price-return fields empty and adds a note)
   `python3 scripts/sentiment_features.py compute "<raw>" -o "<features>" --memo`
8. Check: the last daily bucket should equal the pulse score (the script adds a note if not), and
   the series lengths should match what the tools returned. **The newest one or two daily buckets are
   provisional** — Stocktwits revises them (in the $NUAI pilot the 2026-09-25 bucket read 74 on Sep 27
   and 58 on Sep 28). Treat the pulse score as the "now" value, always show the pull timestamp, and
   never compare a new run's newest bucket with an old run's saved one as if both were final. The `--memo` output is pasted
   unchanged into the Bull Case, Bear Case and Technical Setup (template: `references/memo_sections.md`).
9. Record the outcome for the closing summary: **"Stocktwits: called {pulled_at}"** (capture file
   validated) or **"Stocktwits: skipped — {reason}"** (connector not connected, or no coverage).

---

## Phase 2: Analysis

### 2A — Rule of 40 (SaaS / Software companies)
```
Rule of 40 = YoY Revenue Growth % + FCF Margin %
```
Also compute using non-GAAP operating margin as the profitability leg.
Calculate for: most recent quarter, most recent full fiscal year.
Benchmark: >40 = healthy, >60 = exceptional, >100 = rare.
Skip or adapt for non-SaaS companies (see `references/non_saas_adapts.md`).

### 2B — DCF Valuation (3 Scenarios)
See `references/dcf_defaults.md` for default growth rates, FCF margins, discount rates, and terminal assumptions by company type.

**SINGLE WACC RULE (mandatory):** Use ONE discount rate across all three scenarios. Only revenue, margin, and terminal multiple assumptions differ across scenarios.

For pre-profitable restaurants and non-SaaS companies: use the EBITDA-terminal multiple approach, NOT standard FCF DCF.

Structure for each scenario (Bull / Base / Bear):
1. Project revenue and FCF (or EBITDA for restaurants) for 5 years
2. Terminal value = Year 5 metric x exit multiple (or Gordon Growth for FCF)
3. Discount all cash flows to present using the SINGLE agreed WACC
4. Enterprise value = sum of PV(cash flows) + PV(Terminal Value)
5. Equity value = EV + net cash (cash minus debt)
6. Intrinsic price = Equity value / diluted shares

**Revenue base clarity:** If Year 1 revenue uses management guidance, label the growth table as "growth from [$X guidance base]".

**Terminal multiple calibration:** Match terminal multiple to projected terminal margins. A restaurant with 3-5% EBITDA margins should NOT receive a 15-20x multiple.

**Key findings to flag explicitly:**
- If current price > 2x bull case intrinsic value, state it prominently.
- If base case intrinsic is below current price, call it out in Sections 6 and 11.

### 2C — Investment Summary (Revenue Multiple Approach)
Build the 3-scenario market-based table (goes in Section 1 of memo):
- For each scenario: 1-2 sentence narrative on key drivers
- Forward revenue x scenario multiple = implied market cap
- Implied share price and % vs. current

Calibrate multiples from peer EV/Sales range and company's historical multiple range.

### 2D — Leadership & Governance Score
Score the management team using the 5-criterion rubric in `references/leadership_scorecard.md` (Part B):
execution track record, founder/tenure/skin-in-the-game, capital allocation, insider activity (Form 4),
and governance & alignment. Each scored **0 / 5 / 10** (max 50). Every score line must cite a specific
fact from the 1G research — no score without evidence.

Composite interpretation: **40–50** = strong (feeds Bull Case); **25–39** = neutral; **0–24** = risk
(feeds Bear Case, flag in Verdict). A **0 on insider activity or governance** must be called out
explicitly regardless of composite — governance risk is asymmetric. This is a subjective category, so
score honestly: if you are unsure a CEO is a superstar, they are not.

---

## Phase 3: Build Deliverables

**Before writing any files**, read both output-format skills:
- xlsx skill: `/var/folders/p5/pmm8y6710l16101z88w30s940000gn/T/claude-hostloop-plugins/28684559ed7e4f65/skills/xlsx/SKILL.md`
- docx skill: `/var/folders/p5/pmm8y6710l16101z88w30s940000gn/T/claude-hostloop-plugins/28684559ed7e4f65/skills/docx/SKILL.md`

**If trading vehicle is (c) options-only:** read `workflows/options_mode.md` before building Section 9, Section 10, and the Options sheet. That file overrides standard Section 10 and adds an Options_Strikes sheet to the model.

### 3A — Excel Model
**Sheets:**
1. **Dashboard** — Key metrics side-by-side, current price, market cap, EV, growth, margins, Rule of 40, EV multiples, DCF intrinsic values (linked from model sheet), technical levels
2. **{TICKER}_Model** — Historical data (2 years) → 5-year projections → DCF waterfall → intrinsic price per share, all three scenarios
3. **Rule_of_40** — Rule of 40 scorecard + peer comps table + **Leadership_Scorecard block** (see below)
4. **Options_Strategy** — Market data reference + recommended strategies (structure, strikes, expiry, premium est., max gain/loss, rationale). For options-only mode: replaced by expanded structure in `workflows/options_mode.md`
5. **Sentiment** — the Phase 1H data record, built from `$TICKER_sentiment_features_{date}.json`. All values are **blue** hardcoded inputs with a source comment ("Stocktwits MCP, pulled {timestamp}").
   - Header: symbol, pulled_at, last bucket.
   - Snapshot block: score, band, 1Y percentile, 5/20-session change, message volume, watchers, 5/20-session price return.
   - Reference-only block: crowding, divergence, spike episodes, post-quality stats. Label it "reference only — not used in memo".
   - The 3-month daily series: date, score, volume, close.
   - **No links from this sheet to the Dashboard or any valuation cell.**

**Leadership_Scorecard block** (bottom of the Rule_of_40 sheet, or its own sheet if space is tight):
Lay out the 5 criteria from `references/leadership_scorecard.md` (Part B) as rows — Execution, Founder/Tenure,
Capital Allocation, Insider Activity, Governance — with columns: Score (0/5/10), Evidence (one-line cite),
and Notes. Add a **Composite** row `=SUM(scores)` (max 50) and a `Read` cell that maps the composite to
Strong / Neutral / Risk. Score cells are **blue** (hardcoded judgment inputs); the composite is **black**
(formula). Put the insider-ownership % and CEO tenure from Phase 1G in a small header stat area above the block.

**Color coding (mandatory):**
- Blue text = hardcoded inputs | Black = formulas | Green = cross-sheet links
- All zeros display as "-" | Currency in $#,##0 format | Source comments on hardcoded cells

Run `recalc.py` after building. Fix all formula errors before saving.

**Save to:** the `$TICKER/` folder (see Output Folder Standard) as `$TICKER_Investment_Model_{YYYY-MM-DD}.xlsx`

### 3B — Investment Memo
See `references/memo_sections.md` for the complete section-by-section template.

**Key formatting rules (mandatory):**
- US Letter (12240 x 15840 DXA), 1-inch margins, Arial 12pt
- Header color: `1F4E79` (dark navy)
- `<w:pageBreakBefore/>` on every Heading 1 EXCEPT the first section
- Header: "CONFIDENTIAL — INVESTMENT MEMO" | Footer: page numbers
- Never use `\n` — use separate Paragraph elements
- Never use unicode bullets — use LevelFormat.BULLET with numbering config
- Tables: always WidthType.DXA, dual widths (columnWidths + per-cell width)

**Save to:** the `$TICKER/` folder (see Output Folder Standard) as `$TICKER_Investment_Memo_{YYYY-MM-DD}.docx`

### 3C — Embed Chart
After saving the Word doc, embed the Finviz chart into Section 9 (Technical Setup):

```
Unpack → copy PNG to word/media/ → add rId to _rels/document.xml.rels
→ add <Default Extension="png"> to [Content_Types].xml if missing
→ insert <w:drawing> XML after the Technical Setup heading
→ insert italic caption paragraph below image
→ repack → validate
```

Image sizing: width = 5943600 EMUs (6.5"), height = proportional to image dimensions.
Caption: `"{TICKER} Daily Chart — SMA 20/50/200 | Source: Finviz.com | {Date}"`

---

## Phase 4: Reconcile and Present

**Before presenting, run a reconciliation check:**
1. Open the Excel model and note the DCF intrinsic prices per share (bull/base/bear).
2. Search the Word memo for those same numbers — they must match exactly.
3. If any discrepancy exists, update the memo to match the model (model is authoritative).
4. Sentiment: a validated `$TICKER_sentiment_raw_{date}.json` exists, OR the memo carries the scripted skip text and the summary says "skipped — {reason}". The score, 20-session change, volume and watchers in the Technical Setup table, the Bull Case line and the Bear Case line must match the Sentiment sheet. The pulled-at date must match the capture file. Confirm no sentiment wording appears in the Investment Summary, the DCF/Valuation section, Options Strategy or the Verdict — except the Sources note, where Stocktwits is cited as a source.

**Then deliver both deliverables** to the user (`SendUserFile`) and present with
`mcp__cowork__present_files` if available. Google Drive upload (Phase 4B) happens for EVERY analysis.

**Repo decision (see Output Folder Standard → Repo inclusion policy):** after the Drive upload, ASK
whether this ticker is an active position/watchlist (→ repo) or Drive-only. **Default Drive-only.**
Only if Ed confirms active engagement: save into the local `$TICKER/` folder (`device_commit_files`
into `…/Stock Ticker Analysis/$TICKER/` when running in the cloud) and `git add -f "$TICKER/" ':(exclude)**/*_sentiment_raw_*.json'`. For a
Drive-only ticker, do NOT write it into the repo — the `.gitignore` `/$*/` guard blocks accidental commits.

### 4B — Upload to Google Drive (Mobile Access)

Put the files IN the ticker folder — a folder created without files is a failed run.

**Folder structure:**
- Root: `Stock Ticker Analysis` (ID: `19XzcvJr0sjyUfrUT9f3IrgfXAY0ns446`)
- Create/reuse the **`$TICKER/`** subfolder under the root (literal `$` prefix). Search first:
  `search_files(query: "title = '$TICKER' and mimeType = 'application/vnd.google-apps.folder' and parentId = '19XzcvJr0sjyUfrUT9f3IrgfXAY0ns446'")`.
  Create it only if the search returns nothing. If a legacy `TICKER` folder (no `$`) exists, ask the
  user to trash it (the Drive connector has no delete/move).
- File naming: `$TICKER_Investment_Memo_{YYYY-MM-DD}` and `$TICKER_Investment_Model_{YYYY-MM-DD}`.
- **Legacy FILE migration (on next touch):** after uploading the new files, list the `$TICKER/`
  subfolder (`search_files(query: "parentId = '{$TICKER subfolder ID}'")`) and check every file
  against the `$TICKER_*_{YYYY-MM-DD}` pattern. For each legacy-named file (no `$` prefix and/or no
  date — e.g. `BROS_Investment_Memo`):
  1. If no standard-named copy of that analysis exists yet, `copy_file` it to the standard name
     (same folder), dating it from the analysis date on the document itself.
  2. Ask the user to trash the legacy originals — the connector cannot rename, move, or trash.
  3. Skip raw `.docx`/`.xlsx` binaries whose formatted originals already live in the local repo's
     dated `$TICKER/` subfolder — those Drive copies are redundant; just list them for trashing.
  Do this once per ticker; if the user has already trashed the legacy files, leave them be (never
  recreate copies of trashed files, and do not mention them again).

**Upload method — native Google files (preferred, reliable).**
Direct binary upload of `.docx`/`.xlsx` via the connector requires base64-encoding the whole file
into a single tool call, and at real file sizes that data gets truncated by the tool I/O — it is
unreliable. Instead upload as native Google formats built from TEXT (compact, converts cleanly,
mobile-friendly):
- **Memo → Google Doc:** convert the finished `.docx` to markdown (`pandoc memo.docx -t markdown`),
  read it, and create the file with `textContent` = that markdown,
  `contentMimeType: "text/markdown"`, `disableConversionToGoogleType: false`.
- **Model → Google Sheet:** dump the recalculated workbook's key sheets to CSV (values only), and
  create the file with `textContent` = that CSV, `contentMimeType: "text/csv"`,
  `disableConversionToGoogleType: false`.

```
create_file(
  title: "$TICKER_Investment_Memo_{YYYY-MM-DD}",
  parentId: "{$TICKER subfolder ID}",
  contentMimeType: "text/markdown",
  textContent: "<memo markdown>",
  disableConversionToGoogleType: false
)
```

The formatted `.docx`/`.xlsx` (with the embedded chart and live formulas) live in the local
`$TICKER/` folder and in the chat; the Drive Doc/Sheet is the mobile-readable mirror. Only attempt
a base64 binary upload if the user explicitly wants the exact Office files in Drive and the file is
small enough to encode in one call.

**Auto-archive rule:** If more than 3 analyses exist for a ticker in Drive, move the oldest to `$TICKER_Archive/`. Keep only the 3 most recent active.

After uploading, share the link: https://drive.google.com/drive/folders/19XzcvJr0sjyUfrUT9f3IrgfXAY0ns446

Close with a 2–3 sentence summary: verdict + strongest reason, biggest risk, and confirmation that both the local `$TICKER/` folder and the Drive `$TICKER/` folder are populated. End with the Phase 1H status line — "Stocktwits: called {pulled_at}" or "Stocktwits: skipped — {reason}" — so Ed can see whether the connector ran.

---

## Company Type Flags

| Indicator | Type | Action |
|---|---|---|
| SaaS / cloud / subscription | SaaS | Full Rule of 40 analysis |
| Hardware / semiconductors | Non-SaaS | Read `references/non_saas_adapts.md` |
| Financial / bank / insurance | Financial | Read `references/non_saas_adapts.md` |
| Growth stage (no revenue) | Pre-revenue | DCF not applicable; use TAM/multiple-of-revenue |
| Unsure | Ask | "Is [Company] primarily a software/SaaS business?" |
