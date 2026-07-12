# Changelog

All notable changes to Stock Analysis Financial Review are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/); dates are America/Los_Angeles.
Gitignored data/output files are never committed.

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
