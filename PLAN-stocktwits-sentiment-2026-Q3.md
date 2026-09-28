# PLAN — Stocktwits social sentiment in the stock-analysis workflow

Status: **Phase 5 done (2026-09-28).** Committed and pushed. Ed to re-upload `stock-analysis.skill` in claude.ai. D1–D8 = defaults; R1 = (b), R2 = (a); $NUAI stays Drive-only; $NUAI scenario weights kept at 50/35/15 (Ed, 2026-09-28).

## Phase 5 result (2026-09-28)
- Pilot findings 1–6 applied: sections referenced by name; newest bucket documented as provisional; two-bucket filler test; pull-day price bar dropped before the 16:00 ET close; ordinal fix; the reconciliation check exempts the Sources note. 27 tests pass.
- New finding during Phase 5: `git add -f "$TICKER/"` overrides `.gitignore`, so a gitignore line cannot keep captures out of force-added ticker folders. Every force-add instruction now carries `':(exclude)**/*_sentiment_raw_*.json'` (verified in a scratch repo).
- `stock-analysis.skill` repacked from `skill-src/` and verified identical to it. README, AGENTS.md, CLAUDE.md, CHANGELOG.md, llms.txt, .gitignore updated.
- Next review: re-run the calibration about 2027-03.

## Phase 4 result — $NUAI pilot (2026-09-28, quarterly-update path)
- Output: `$NUAI/$NUAI-2026-09-28/` (Drive-only ticker, gitignored). Memo (.docx + .md), model (.xlsx, 7 sheets incl. Sentiment), chart, capture + features JSON, build scripts. Drive: `$NUAI_Investment_Memo_2026-09-28` (Doc) and `$NUAI_Investment_Model_2026-09-28` (Sheet) in the `$NUAI/` folder.
- Checks: 1,196 formula cells, 0 errors; 28/28 memo numbers match the model and Sentiment sheet. No sentiment wording in Summary / Valuation / Options / Verdict. Sentiment sheet has no inbound references. Hand-typed capture matched the raw MCP responses exactly (3 series, 30 posts, pulse).
- Verdict unchanged: AVOID. Probability-weighted value $1.92 (was $1.96); only lever changed was NUAI's project share, for Vistra's 5%.

### Pilot findings → fixes for Phase 5
1. **Section numbers are not stable.** The $NUAI memo has 13 sections (extra permits + What Changed), so "Section 4/5/9" and "Sections 1, 6, 10, 11" in the skill point at the wrong sections. Fix: refer to sections by name (Bull Case, Bear Case, Technical Setup; Summary, Valuation, Options, Verdict) in SKILL.md, memo_sections.md and the `--memo` labels.
2. **Stocktwits revises the newest buckets.** The 2026-09-25 bucket read 74 / volume 79 on Sep 27 and 58 / 67 on Sep 28. Fix: document the latest bucket as provisional (the pulse is the "now" value); note the pull time wherever it is shown.
3. **Leading filler can be more than one bucket.** The Sep 28 3M series began with two filler buckets. The run-stripping `drop_filler` handled it; add a test.
4. **Intraday pulls include a partial session** in the 5/20-session price returns. Fix: drop a bar dated on the pull day when pulled before the close (model sheet only; the memo is unaffected).
5. **Percentile prints "72th".** Cosmetic; fix the ordinal suffix.
6. **The reconciliation "no sentiment wording" check must exempt the Sources note**, where Stocktwits is cited as a source.
7. **Theme-clause rule worked as intended:** the most-liked post repeated an NVIDIA financing rumor; the memo labels it unconfirmed and not in any filing.

## Ed's framing (2026-09-27, overrides §3 where they conflict)
Stocktwits is **just another data layer, not an edge**. It must not change the setup of the analysis or the bull/bear cases. It may be cited as context, e.g. in the bear case: "social sentiment on Stocktwits shows the crowd holds this view".
- R1 = (b): Sections 4 **and** 5 each close with one Social sentiment line ("shares" / "does not share" / "neutral" / "too thin").
- R2 = (a): an optional paraphrased theme clause, labelled as crowd talk. No quotes, no usernames, never stated as fact.
- Removed from §3.4: Section 10 line, Section 11 "crowd vs verdict" line, Dashboard links, the quarterly "what changed in the crowd" section, and flags in the memo (flags stay on the model sheet, marked reference only).

## Phase 3 result (2026-09-27)
- `SKILL.md`: frontmatter mention; naming rows for the capture/features files; Phase 0B refresh; new Phase 1H with the no-edge rule and capture steps; Sentiment model sheet (no Dashboard links); reconciliation step 4.
- `references/memo_sections.md`: Social sentiment line spec (Sections 4 and 5) with band table and banned wording; Section 9 table.
- `workflows/options_mode.md`: rule 7, sentiment is not an options input.
- `scripts/sentiment_features.py`: `--memo` output (Section 9 table + both case lines). 23 tests pass, including one checking the memo has no forecast wording.

## Phase 2 result (2026-09-27)
Full write-up: `_Analysis_Patterns/stocktwits-calibration-2026-09/FINDINGS.md`. Same-day r = 0.19 (t 5.7); next-day r = 0.02; no forward return or volatility signal at any horizon tested. Thresholds stay 75 / 24 / volume 75. The §3.4 Section 10 rule is dropped. Memo language is limited to describing the crowd. `drop_filler` now strips a leading run.
Created 2026-09-27. Nothing committed. `SKILL.md` and references not edited yet (Phase 3).

## Phase 1 result (2026-09-27)

| File | What |
|---|---|
| `skill-src/stock-analysis/` | Skill source unpacked from `stock-analysis.skill` (D6). Unchanged except the new script. |
| `skill-src/stock-analysis/scripts/sentiment_features.py` | `validate` / `prices` / `compute [--markdown]`. Reads one capture file (schema `stocktwits-capture/1`); never calls Stocktwits. |
| `tests/fixtures/sentiment_raw_{NUAI,NOW}_2026-09-27.json` | Real pulls. Authors anonymised a1..aN; no bodies or usernames. Yahoo closes added. |
| `tests/test_sentiment_features.py` | 20 `unittest` tests (pytest is not installed). All pass. Hand-checked values: NUAI 5/20-session change +23/+39, 5-session return +20.5%. |

Two more quirks found in Phase 1:
6. Every history series starts with a filler bucket (sentiment 50, volume 0) — 7 of 7 series pulled. The script drops it.
7. `get_symbol_messages filter=top` returned posts newest-first, not ranked by engagement. Treat it as a recent sample.

Label bands inferred from observed labels: ≤25 Extremely Bearish (25 itself unobserved), 26–44 Slightly Bearish, 45–54 Neutral, 55–74 Slightly Bullish, ≥75 Extremely Bullish.

Acronyms: MCP = Model Context Protocol (the connector that lets Claude call Stocktwits).
DCF = discounted cash flow. IV = implied volatility. CSP = cash-secured put.
JSON = the structured text format the tools return.

---

## 1. Inventory (measured 2026-09-27)

### 1.1 The workflow being changed

| Item | Measured state |
|---|---|
| Repo | `~/Documents/Claude/Projects/Stock Ticker Analysis` → GitHub `edmatibag9Dev/Stock-Analysis-Financial-Review` (public). Last commit `e365acd`. |
| Session folder | This session opened in `~/Claude/Projects/Stock Ticker Analysis`. That folder holds only `Transcripts/` and `_work/`. It is **not** the repo. |
| Skill that runs an analysis | `anthropic-skills:stock-analysis` — an uploaded skill. Its installed copy is byte-identical to the repo's `stock-analysis.skill` zip (`diff -rq` clean). |
| Skill files | `SKILL.md` (447 lines), `references/{memo_sections, dcf_defaults, non_saas_adapts, leadership_scorecard}.md`, `workflows/options_mode.md`. |
| Current data sources | Day One + Open Brain (1A), SEC EDGAR (1B), web search for price/technicals/IV (1C), Yahoo chart route (memory; Finviz is broken), peers (1F), proxy + Form 4 (1G). **No social or crowd data today.** |
| Memo | 11 sections. Section 9 = Technical Setup. Verification gate 2 requires "all 11 sections". |
| Model | 4 sheets + Leadership_Scorecard block. |

### 1.2 The Stocktwits connector (tested live on $NUAI and $NOW)

13 read-only tools. The ones that matter for analysis:

| Tool | Returns | Use in workflow |
|---|---|---|
| `get_symbol` | name, exchange, price | Validate the ticker. |
| `get_symbol_pulse` | price, sentiment score + label, message volume score, watchers, trending rank, top ~10 posts | Current snapshot in one call. |
| `get_sentiment` | score (0–100), label, legacy bull/bear % | Redundant with pulse. |
| `get_sentiment_history` | one 0–100 score per bucket. `3M` = daily buckets (trading days). `1Y` = weekly buckets. | Trend and "is today extreme for this ticker". |
| `get_message_volume_history` | one 0–100 activity score per bucket | Chatter spikes. |
| `get_message_volume` | activity score across now / 15m / 1D / 1W / 1M / 3M / 6M / 1Y | Snapshot; noisy (see quirks). |
| `get_symbol_messages` | recent posts; `filter=top` for most-engaged | Qualitative themes, bear arguments. |
| `get_trending_symbols` | top trending tickers now | Not per-ticker. Idea source only. |
| `whoami`, `get_watchlist_feed`, `get_following_feed`, `get_user_messages` | Ed's own account feeds | Out of scope for per-ticker analysis. |

### 1.3 Data quirks found in testing (these drive the rules in §3)

1. **Legacy bull/bear % is unusable.** $NOW: `bullish_pct` 96.27 but `score` 40, label BEARISH. Only the `score` is the site's canonical signal. The tool's own description says so.
2. **Volume `label` field is stale.** $NUAI: every timeframe's `label` read EXTREMELY_HIGH while `normalized_label` ranged LOW → EXTREMELY_HIGH. Use `normalized_value` / `normalized_label` only. `value` is not a message count (tool description says so).
3. **Posts are noisy.** In $NUAI's top 10 posts: 5 came from one account tagging 4–5 AI-infrastructure tickers per post; 2 were a bare `$NUAI` with a Bullish tag; 1 was a position brag. Topic-level signal is thin.
4. **Buckets end at the last session.** On Sunday 2026-09-27 the newest daily bucket was Friday 2026-09-25. `price_time` also shows Friday's close.
5. **Current values cannot be re-pulled later.** History can. So every run must save its snapshot with a timestamp.

### 1.4 One observed example (n = 1, not evidence of predictive power)

$NUAI daily sentiment score vs. Yahoo close:

| Date | Close | Sentiment |
|---|---|---|
| 2026-07-17 | $4.07 | 33 |
| 2026-07-20 | $5.15 | 72 |
| 2026-07-21 | $5.91 | 88 (Extremely Bullish) — Ed's first memo: AVOID at $5.15 |
| 2026-07-29 | $4.07 | 37 |
| 2026-09-18 | $5.86 | 51 |
| 2026-09-21 | $7.65 | 76 (Extremely Bullish) |
| 2026-09-25 | $7.06 | 74; message volume 79 (Extremely High); 10,414 watchers |

In both episodes sentiment jumped **the same day** as price. It did not move first. After July's peak, price fell 31% in 6 sessions while sentiment decayed. One ticker proves nothing. It does suggest treating sentiment as a **crowd-positioning gauge**, not a forecast. Phase 2 tests this on more tickers.

---

## 2. Requirements — Ed to state

Tell me in your words. Prompts:
- What decision should sentiment change: entry timing, options strike/premium choice, the verdict, or only a risk flag?
- Which vehicles care most: long equity, CSP overlay, options-only?
- Should it also feed the earnings put screener or the RVOL (relative volume) scan later? (This plan keeps them out of scope.)

---

## 3. Proposed design

### 3.1 Principle
Sentiment measures **what the crowd believes and how loudly**. It never changes intrinsic value. It informs timing, options pricing context, and risk flags. The DCF stays untouched.

### 3.2 New research step — Phase 1H "Crowd Sentiment" (after 1G)
1. `get_symbol` → validate. If Stocktwits has no data, write "No Stocktwits coverage" and skip.
2. `get_symbol_pulse` → snapshot.
3. `get_sentiment_history` at `3M` (daily) and `1Y` (weekly).
4. `get_message_volume_history` at `3M`.
5. `get_symbol_messages filter=top limit=30` → themes only.
6. Yahoo daily closes for the same 3M window (route already proven in memory).
7. Save all raw JSON to `$TICKER-{date}/sentiment_raw_{date}.json` with the pull timestamp.
8. Run `sentiment_features.py` on that file → `sentiment_features_{date}.json`.

### 3.3 Derived metrics (deterministic script, no judgment)

| Metric | Definition |
|---|---|
| Score now / label | From pulse. |
| 1Y percentile | Today's score vs. this ticker's 52 weekly scores. Answers "extreme for *this* name". |
| 5-day and 20-day change | Score delta over daily buckets. |
| Volume now / 3M percentile | `normalized_value`; spike flag at ≥ 75. |
| Watchers | Crowd size. |
| Price–sentiment divergence | Sign of 20-day price return vs. sign of 20-day score change. Flag when opposite. |
| Crowding flag | Score ≥ 75 **and** volume ≥ 75 → "Crowded bullish". Score ≤ 25 **and** volume ≥ 75 → "Crowded bearish / capitulation". Else none. Thresholds tuned in Phase 2. |
| Post quality | Share of top posts tagging ≥ 4 tickers (spam proxy); unique authors; share with an explicit Bullish/Bearish tag. |

Excluded on purpose: legacy bull/bear %, legacy volume `label`, raw volume `value`.

### 3.4 Where it lands in the deliverables

| Place | Change |
|---|---|
| Memo Section 9 (Technical Setup) | New sub-block "Crowd Sentiment": stats table (the §3.3 metrics), one chart (3M price line + sentiment line), 2–3 sentences. Keeps the 11-section gate intact. |
| Memo Section 4 / 5 (Bull / Bear) | A post theme enters only if a filing or press release confirms it. Unverified crowd claims never appear as facts. |
| Memo Section 10 (Options) | One line: crowd state vs. IV. Example rule: "Crowded bullish + high IV rank → premium is rich; CSP strikes still anchor to base/bear DCF." Context only, not a strike input. |
| Memo Section 11 (Verdict) | One line "Crowd vs. our verdict": agree / disagree. Flag when our rating is AVOID and the crowd is Extremely Bullish (the $NUAI case today). |
| Model | New `Sentiment` sheet: snapshot values (blue, hardcoded, source comment "Stocktwits MCP, pulled {timestamp}"), 3M daily series, flags. Dashboard links score + crowding flag (green cross-sheet links). |
| Phase 0B quarterly update | Always refresh sentiment (cheap). Add "What changed in the crowd" vs. the prior run's saved snapshot. |
| Verification gates | Add: raw snapshot saved with timestamp; memo sentiment numbers match the model's Sentiment sheet. |

### 3.5 Rules for handling the data
- Every sentiment number carries its pull timestamp.
- Paraphrase post themes. No quoted posts. No usernames in any deliverable (the repo is public).
- Raw JSON (contains usernames) stays local and is gitignored. Only derived metrics go in the model/memo.
- If a symbol has thin coverage (few watchers, empty history), say so and drop the sub-block to one line.

---

## 4. Decisions — defaults marked

| # | Decision | Options | Default |
|---|---|---|---|
| D1 | Memo placement | (a) sub-block in Section 9; (b) new Section 12 "Crowd Sentiment" (changes the 11-section gate) | **(a)** |
| D2 | Can sentiment change the rating? | (a) never — context and flags only; (b) can move rating one notch | **(a)** |
| D3 | Model | (a) new `Sentiment` sheet; (b) block on Dashboard only | **(a)** |
| D4 | Raw JSON in repo? | (a) local only, gitignored; (b) commit | **(a)** — contains third-party usernames, public repo |
| D5 | Calibration study (Phase 2) | (a) run it on the 7 existing tickers; (b) skip, use fixed thresholds | **(a)** |
| D6 | Skill source of truth | (a) unpack source into repo `skill-src/stock-analysis/`, repack `.skill`, Ed re-uploads; (b) also symlink `~/.claude/skills/stock-analysis` → repo (risk: duplicate skill name with the uploaded copy) | **(a)** |
| D7 | Adjacent workflows (put screener, RVOL scan, TradingView MCP for technicals) | (a) separate later tasks; (b) fold in now | **(a)** |
| D8 | Pilot ticker | (a) $NUAI (Drive-only; Macquarie covenant date ~2026-10-08; crowd bullish vs. our AVOID); (b) an active repo ticker ($SG, $FSLY, $BROS) | **(a)** |

---

## 5. Phases (each ends in a checkpoint — I stop and wait for "continue")

| Phase | Work | Output | Checkpoint |
|---|---|---|---|
| 0 | Inventory + this plan | this file | Ed states requirements, answers D1–D8 |
| 1 | Write `sentiment_features.py` + fixtures from today's $NUAI / $NOW pulls; unit checks for each metric | script + sample output for 2 tickers | Ed reviews metric table |
| 2 | Calibration: 1Y weekly sentiment vs. forward 4-week return and forward realized volatility on $BROS, $FSLY, $NOW, $NUAI, $PLTR, $SG, $TRMB | short findings note in `_Analysis_Patterns/` | Ed approves thresholds |
| 3 | Skill edits: SKILL.md 1H + 0B + gates; memo_sections 9/10/11; options_mode; model sheet spec. Repack `.skill` | diff + new `.skill` | Ed reviews diff |
| 4 | Pilot on the D8 ticker end to end | memo + model with Sentiment sheet; Drive upload | Ed reviews deliverable |
| 5 | README, AGENTS file map, CHANGELOG, `.gitignore` for raw JSON; commit named paths; push | commit | Ed re-uploads `.skill` in claude.ai |

Assumption: the Stocktwits connector is available in whatever surface runs the skill (Claude Code or Cowork). It is a claude.ai connector, so it will **not** be available to launchd jobs.
Assumption: Phase 2's sample (7 tickers × ~52 weeks) is too small to prove an edge. Its job is threshold calibration, not validation.
