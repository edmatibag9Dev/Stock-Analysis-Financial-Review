# Investment Memo Section Template

## Document Header
Title: **{TICKER} ({Company Name}) — INVESTMENT MEMO**
Subtitle line: `Date: {Date} | Analyst: Ed | Rating: {BUY / ACCUMULATE / HOLD / AVOID}`

---

## Section 1: INVESTMENT SUMMARY
Purpose: Give the reader the verdict at a glance before any detail.

**Format:** 5-column table, full width (9360 DXA for US Letter with 1" margins)
Column widths: 1200 / 2800 / 1900 / 1600 / 1860

| Scenario | Key Drivers | Revenue × Multiple | Implied Price | vs. Current |
|---|---|---|---|---|
| 🐻 Bear Case | 2–3 sentence narrative | $XB × Xx ≈ $XB EV | $XX–$XX | ▼ ~X% decline |
| ⚖️ Base Case | 2–3 sentence narrative | $XB × Xx ≈ $XB EV | $XX–$XX | ▲/▼ ~X% |
| 🐂 Bull Case | 2–3 sentence narrative | $XB × Xx ≈ $XB EV | $XX–$XX | ▲ ~X% upside |

Row shading: Bear = FFC7CE (light red) | Base = FFEB9C (light yellow) | Bull = C6EFCE (light green)

After the table, add an italic note: "Revenue multiple approach reflects market pricing behavior. DCF intrinsic value analysis (bull $X / base $X / bear $X) is in Section 6."

---

## Section 2: BUSINESS SNAPSHOT
Purpose: Orient the reader with key facts and numbers.

Open with 2 sentences: what the company does, market position, key differentiator.

Then a stats table (2-column: Metric | Value):
- Current Price | $X.XX (as of {date})
- Market Cap | ~$XB
- Enterprise Value | ~$XB
- 52-Week Range | $X.XX – $X.XX
- Most Recent Quarter Revenue | $XM (+X% YoY)
- Gross Margin | X%
- Non-GAAP Operating Margin | X%
- FCF Margin | X%
- Cash / Net Cash | $XB
- Diluted Shares | XM
- Rule of 40 Score | X (growth X% + margin X%)
- FY Guided Revenue | $XB (+X% YoY)

For SaaS companies, add:
- cRPO | $XB (+X% YoY)
- Total RPO | $XB
- Customers >$XM ACV | X (+X% YoY)

---

## Section 3: MANAGEMENT & GOVERNANCE
Purpose: Assess who runs the company and why it matters to the thesis. Full method in `references/leadership_scorecard.md`.

**First, the "who"** — open with 2–3 sentences naming the CEO (founder or hired, tenure, prior track record) and CFO, then a stats table (2-column: Field | Value):
- CEO | Name (founder/hired, since YYYY)
- CFO | Name (since YYYY)
- Insider Ownership | X% (from DEF 14A proxy)
- Recent Insider Activity | net open-market buys/sells last 12 mo (Form 4)
- Voting Structure | single-class / dual-class
- Board | X directors, X% independent

**Then, the scored "why it matters"** — 5-criterion rubric from `leadership_scorecard.md` (Part B), each 0/5/10 with a one-line evidence cite. Never score without a specific fact.

| Criterion | Score | Evidence |
|---|---|---|
| Execution track record | X/10 | specific fact |
| Founder / tenure / skin in game | X/10 | specific fact |
| Capital allocation | X/10 | specific fact |
| Insider activity (Form 4) | X/10 | specific fact |
| Governance & alignment | X/10 | specific fact |
| **Composite** | **X/50** | Strong (40–50) / Neutral (25–39) / Risk (0–24) |

Close with 2–3 sentences tying the composite to the thesis: a **40+** score is a reason to own (reinforces the Bull Case); a **sub-25** score, or a **0 on insider activity or governance**, is a risk to flag (reinforces the Bear Case and the Verdict). Governance risk is asymmetric — call out any 0 on insider activity/governance explicitly even if the composite is otherwise fine.

---

## Section 4: BULL CASE
Purpose: Make the strongest possible case FOR buying.

Write 3–5 subsections, each as a bold header followed by 3–4 sentences of substantive prose. Not bullets — full paragraphs with specific data.

Each argument should answer: "Why would this company trade at a significant premium in 2–3 years?"

Good bull case topics (pick the most relevant):
- AI/product moat and competitive differentiation
- Revenue acceleration or inflection point
- Expanding TAM from new products/markets
- Operating leverage and margin expansion trajectory
- Management execution and capital allocation
- Macro tailwinds (government spending, enterprise transformation, etc.)

Every argument must cite a specific number or event from the research.

**Close the section with one "Social sentiment" line** (see *Social sentiment line* below). It is
context, not an argument — never a bull-case subsection and never a reason for the rating.

---

## Section 5: BEAR CASE
Purpose: Make the strongest possible case AGAINST buying at current price.

Same format: 3–4 subsections, prose paragraphs, specific data.

Good bear case topics:
- Valuation: DCF gap, market pricing in perfection
- Competition from larger players
- Customer concentration or churn risk
- Margin compression from M&A, R&D, or competition
- Macro sensitivity (rates, government budget cuts, enterprise spending freeze)
- Management or governance issues
- Regulatory or geopolitical risk

**Close the section with one "Social sentiment" line** (see below) — same rules as the Bull Case.

### Social sentiment line (Bull Case and Bear Case)

Stocktwits sentiment is **one more data layer, not an edge**. It never changes the analysis setup,
a DCF input, a scenario weight, the rating, or an options strike. It only tells the reader whether
the crowd currently shares each case's view. The Bull Case and the Bear Case each get exactly one line.
Find these sections by name: section numbers shift when a memo adds sections (e.g. a permits
tracker or a "What Changed" section in a quarterly update).

Generate both lines with `scripts/sentiment_features.py compute <capture> --memo` (Phase 1H) and paste them as written.
The script decides the wording from the score band:

| Score band | Bull case line says | Bear case line says |
|---|---|---|
| 55–100 (bullish) | the crowd **shares** this view | the crowd **does not share** this view |
| 0–44 (bearish) | the crowd **does not share** this view | the crowd **shares** this view |
| 45–54 (neutral) | the crowd is **neutral** | the crowd is **neutral** |
| thin coverage | coverage too thin for a read | same |

Format (italic, one paragraph, after the last subsection):
*Social sentiment (Stocktwits, pulled {date}): the crowd shares this view — score 74 (Slightly
Bullish), +39 pts over 20 sessions; message volume 79 of 100. Recent posts focus on {theme}.*

The **theme clause is optional** and added by Claude. It is one short paraphrase of what recent
posts discuss, labelled as crowd talk. No quotes, no usernames, and never stated as fact. If a
theme repeats a factual claim (a deal, a date, a number), either confirm it against a filing or
press release, or write it as "posts expect…". Leave the clause out when posts are mostly
cashtag blasts or one-word posts.

Banned wording: anything that uses sentiment to forecast price, volatility, or timing ("the
crowd is a contrarian signal", "sentiment points to a pullback"). Basis: the 2026-09
calibration found sentiment moves with price on the same day and predicts nothing over the
next 1–20 sessions (`_Analysis_Patterns/stocktwits-calibration-2026-09/FINDINGS.md` in the repo).

---

## Section 6: DCF VALUATION
Purpose: Anchor the analysis in fundamental intrinsic value.

Open with 1 sentence explaining the methodology (5-year FCF projection + terminal value).

Then a 3-scenario table:

| Metric | Bull Case | Base Case | Bear Case |
|---|---|---|---|
| Discount Rate | X% | X% | X% |
| Terminal Growth | X% | X% | X% |
| Yr2 Revenue Growth | X% | X% | X% |
| Yr3 Revenue Growth | X% | X% | X% |
| Yr4 Revenue Growth | X% | X% | X% |
| Yr5 Revenue Growth | X% | X% | X% |
| Terminal FCF Margin | X% | X% | X% |
| Implied EV | $XB | $XB | $XB |
| + Net Cash | $XB | $XB | $XB |
| Equity Value | $XB | $XB | $XB |
| **Intrinsic Price/Share** | **$XX** | **$XX** | **$XX** |
| Current Price | $XX | $XX | $XX |
| **Premium/(Discount)** | **(X%)** | **(X%)** | **(X%)** |

Follow the table with 1–2 sentences interpreting the result. If the stock trades at >2× bull case, call this out explicitly: "The market is pricing in a scenario beyond our bull case — it requires [specific assumption] to be sustained for [X] years."

---

## Section 7: RULE OF 40 ANALYSIS
(SaaS companies only — skip or adapt for non-SaaS)

Explain Rule of 40 in one sentence, then show:
- Current score and components
- Historical trend (2–3 data points)
- Peer comparison table
- Forward estimate (bull/base/bear for next 12 months)

---

## Section 8: PEER COMPARABLES
Purpose: Context for whether the valuation is rich or cheap relative to peers.

7-company table minimum. Include the subject company with row highlighted (yellow shading).

| Company | Ticker | Fwd Rev Growth | FCF Margin | Rule of 40 | Fwd EV/Sales | Note |
|---|---|---|---|---|---|---|

After the table, 1–2 sentences on what the comps imply for the subject company's valuation.

---

## Section 9: TECHNICAL SETUP
Purpose: Inform timing and options strike selection.

**First:** Insert the Finviz chart image (centered, full width, with caption).

**Then:** a stats table:
- Current Price
- 52-Week Range
- 20-Day SMA
- 50-Day SMA
- 200-Day SMA (flag if stock is below — bearish for multiple expansion)
- RSI (14-day)
- Implied Volatility
- IV Rank

**Then:** a small "Social sentiment (Stocktwits)" table — paste the `--memo` table from
`sentiment_features.py`. Exactly these rows: sentiment score and band, change over 20
sessions, message volume (0–100), watchers, and a pulled-at timestamp in the caption. No chart,
no flags, and no interpretation here. This table is where the numbers used in the Bull and Bear Case lines live.
If Stocktwits has no coverage, write one line: "No Stocktwits coverage for {TICKER}."

**Then:** 2–3 sentences of technical interpretation:
- Is the stock in an uptrend, downtrend, or consolidation?
- Where are the key support and resistance levels?
- What does RSI say about near-term momentum?
- What does IV Rank tell you about options pricing?

---

## Section 10: OPTIONS STRATEGY RECOMMENDATION
Purpose: Translate the thesis into a specific trade structure.

Opening line: tie the recommendation to the DCF result and technical setup.

For each strategy (2–4 total), write:
- **Strategy name** (Covered Call / Cash-Secured Put / Bull Call Spread / Long LEAP / Bear Put Spread)
- Structure: Buy X strike / Sell Y strike / Month expiry
- Estimated premium or debit
- Max gain and max loss
- Rationale: why this structure given the IV rank, price vs. DCF, and user's position

**Selection guide:**
- Stock at premium to DCF + moderate IV → Covered Call (income) or Bear Call Spread
- Stock at discount to DCF + low IV → Long Call Spread or LEAP
- Stock at discount to DCF + high IV → Cash-Secured Put (income + better entry)
- No current position, bullish → Cash-Secured Put to initiate, then Covered Call

End with a risk warning: "Size positions so bear-case outcome does not cause unacceptable portfolio loss."

---

## Section 11: VERDICT
Purpose: Clear, direct conclusion tying everything together.

**Line 1:** Rating in bold: BUY / ACCUMULATE / HOLD / AVOID new entry

**Paragraph 1:** Why the business deserves attention (or doesn't). Cite the strongest fundamental metric.

**Paragraph 2:** Why the current price is or isn't right. Tie DCF to current price explicitly.

**Paragraph 3:** The specific action: what to buy/sell, at what level, with what options overlay.

**Sources line:** "Sources: {Company} {Quarter} 10-Q (SEC EDGAR, {date}), {Company} {Quarter} Earnings Press Release (8-K, {date}), Day One Options Trading Journal ({dates if applicable}). This memo is for informational purposes only and does not constitute financial advice."
