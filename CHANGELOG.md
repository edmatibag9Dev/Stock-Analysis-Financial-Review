# Changelog

All notable changes to Stock Analysis Financial Review are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/); dates are America/Los_Angeles.
Gitignored data/output files are never committed.

## [2026-10-09] — Scrub the Drive folder ID from the docs

### Changed
- `AGENTS.md` and `CLAUDE.md` replace the Google Drive root folder ID with the placeholder `<DRIVE_ROOT_FOLDER_ID>` (public repo; Ed's decision). The real value lives in a gitignored `CONFIG.local.md`.

## [2026-10-09] — Conform to repo standard 2026-10-09

### Changed
- **`AGENTS.md`** — added the `Standard: REPO-STANDARD 2026-10-09` stamp on line 2; renamed the
  gates heading to `## Verification gates`; added a staging gate and a final `repo-check.py` gate;
  moved the repo-specific "Repo hygiene — git lock files" section after the gates (content
  unchanged); replaced the pasted "What to Stage — Never Commit Blindly" block (a verbatim copy of
  `CONTRIBUTING.md`) with a link; `.gitignore` file-map row lists the new entries.
- **`.gitignore`** — added `.env`, `.env.*`, `!.env.example`, `CONFIG.local.md`, `.venv/`,
  `node_modules/` and `*.bak*`.
- **`README.md`** — File Descriptions `.gitignore` line and the Build Notes staging pointer
  updated to match; `Last updated` set to 2026-10-09.

## [2026-10-04] — Keep paid transcripts out of the public repo

### Changed
- `.gitignore` now ignores `Transcripts/` and `_work/`. They held full transcripts of paid-subscriber Substack posts and their capture scratch, which this public repo must not republish. The transcripts stay local; `_work/` was removed.

## [2026-09-28] — $BROS update with Stocktwits; connector call made mandatory in the skill

### Added
- `$BROS/$BROS-2026-09-28/` — quarterly update between earnings: ACCUMULATE (staged) maintained, final tranche moved to the Nov 4 Q3 print; DCF unchanged ($96.52 / $58.77 / $25.91) at $37.89. First committed analysis with the Stocktwits layer (raw capture kept local).
- `sentiment_features.py skip SYMBOL --reason …` — scripted memo text when Phase 1H cannot run; two new tests.

### Changed
- Skill Phase 1H is mandatory and starts with step 0: load the connector tools via ToolSearch, check all five by name, retry for any missing (a single query was shown to miss one), and if none exist use the scripted skip — never estimate sentiment from other sources. The Yahoo `prices` step may be skipped when the sandbox blocks it. The closing summary must state "Stocktwits: called {time}" or "Stocktwits: skipped — {reason}"; reconciliation step 4 and AGENTS gate 2b check it.
- `stock-analysis.skill` repacked (identical to `skill-src/`). README analyses table and AGENTS file map gain the $BROS row.

## [2026-09-28] — Stocktwits social-sentiment data layer

### Added
- `skill-src/stock-analysis/` — the skill source, unpacked from `stock-analysis.skill` so edits are reviewable; the `.skill` is now repacked from it.
- Skill Phase 1H (Stocktwits via the MCP connector) and `scripts/sentiment_features.py` (`validate` / `prices` / `compute --memo`). Output: one "Social sentiment" line closing the Bull Case and one closing the Bear Case, a four-row Technical Setup table, and a Sentiment model sheet. Rule: a data layer, not an edge — never a DCF input, scenario weight, rating or options strike.
- `tests/` — 27 `unittest` tests plus anonymised $NUAI/$NOW fixtures from 2026-09-27.
- `_Analysis_Patterns/stocktwits-calibration-2026-09/` — 7-ticker study: same-day r = 0.19 with price, next-day r = 0.02, no forward return or volatility signal over 1–20 sessions.
- `PLAN-stocktwits-sentiment-2026-Q3.md` — plan, decisions and phase results.

### Changed
- `stock-analysis.skill` repacked: Phase 1H, quarterly-update refresh, Sentiment sheet spec, reconciliation step 4, options rule 7, and sections referenced by name rather than number (a $NUAI pilot memo with 13 sections broke the number references).
- `.gitignore` and every `git add -f` instruction now keep `$TICKER_sentiment_raw_*.json` captures local (`-f` overrides `.gitignore`, so the pathspec exclude is the guard).
- README, AGENTS.md (file map, data contract, gates 2b/2c), CLAUDE.md, llms.txt.

### Notes
- Pilot: $NUAI 2026-09-28 quarterly update ran end to end on the new skill (Drive-only, not committed). Rating AVOID unchanged; probability-weighted value $1.92.
- The installed skill updates only when Ed re-uploads `stock-analysis.skill` in claude.ai.

## [2026-07-12] — FSLY + TRMB analyses; docs synced to TICKER/ layout

### Added
- FSLY (Fastly) analysis, 2026-06-08 — memo, valuation model, chart, build scripts.
  Verdict: HOLD / accumulate on weakness at ~$20; DCF $24.16 / $12.55 / $6.97.
- TRMB (Trimble) analysis, 2026-06-11 — memo, valuation model, build scripts.
  Verdict: BUY / accumulate on weakness at ~$50 (staged entry; CSPs $45/$42.50);
  DCF $97 / $72 / $36 (FCF DCF, 9.5% WACC).
- `FSLY_Archive/` and `TRMB_Archive/` placeholder directories.

### Changed
- README analyses table gains FSLY + TRMB; folder diagram and build-script paths
  corrected to the `{TICKER}/` two-level layout; CLAUDE.md Completed Analyses synced.
- `.gitignore` organized with section comments.

## [2026-07-12] — Repo standardization: llms.txt + CHANGELOG.md

### Added
- `llms.txt` — machine-readable doc index pointing agents at AGENTS.md, the analysis
  folder contract, and the per-ticker build scripts.
- This `CHANGELOG.md`, seeded from the repo's commit history.

## [2026-07-05] — Agent-standards bootstrap

### Added
- `AGENTS.md` — repo-specific agent guide: file map, per-analysis `{TICKER}-{YYYY-MM-DD}/`
  data contract, privacy hard rules, and verification gates.
- `CONTRIBUTING.md` — canonical commit + README standard per Ed's global repo standard.

## [2026-06-06] — Restructure + BROS analysis

### Added
- BROS (Dutch Bros) analysis — investment memo + memo build script.
- Per-ticker `{TICKER}_Archive/` directories for superseded analyses.
- `options_mode` workflow and updated SKILL.md in the packaged skill.

### Changed
- Restructured the repo into a `{TICKER}/` top layer with dated
  `{TICKER}-{YYYY-MM-DD}/` analysis subfolders.

### Fixed
- Mobile memo corruption issue — build scripts must run in a desktop Cowork session,
  not Claude mobile.

## [2026-06-05] — Initial commit

### Added
- Initial analyses: SG (Sweetgreen), PLTR (Palantir), NOW (ServiceNow) — investment
  memos, valuation models, and their build scripts.
- `stock-analysis.skill` — packaged Cowork skill automating research, model build,
  and memo build for any publicly traded ticker.
- README with methodology (3-scenario DCF, Rule of 40, technicals, options overlay)
  and the analyses index table.
