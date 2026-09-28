# Options-Only Mode Workflow

**Triggered by:** Phase 0 intake answer (c) — "options-only, no equity position"

This file overrides the standard Section 10 (Options Strategy) and adds options-specific steps to Section 9 and the Excel model. Sections 1–8 of the memo and Phases 1–2 of the main workflow execute identically regardless of trading vehicle.

---

## What Options-Only Mode Changes

| Component | Standard (vehicle a/b) | Options-Only (vehicle c) |
|---|---|---|
| Sections 1–8 | Unchanged | Unchanged |
| Section 9 (Technical) | Price levels, SMAs, RSI | + Catalyst calendar, IV rank analysis |
| Section 10 (Options Strategy) | Income overlay (CSPs, covered calls) | Full options-only strategy: direction x IV matrix, strikes, Greeks, sizing |
| Excel: Options_Strategy sheet | Single-table overlay | Replaced by Options_Strikes sheet (multi-scenario) |
| Excel: new Options_Strikes sheet | Not present | DCF-to-strike bridge + P&L scenarios |

---

## OM-1: IV Rank Analysis (add to Phase 1C research)

IV Rank determines whether to buy or sell options. This is as important as direction.

**Collect:**
- Current IV (30-day implied volatility)
- 52-week IV range (IV low and IV high for the ticker)
- IV Rank = (Current IV - 52-week IV low) / (52-week IV high - 52-week IV low) x 100

**Interpretation:**
- IV Rank >= 50: IV is HIGH relative to history → favor selling premium (spreads, condors)
- IV Rank < 50: IV is LOW relative to history → favor buying options (long calls/puts)
- IV Rank >= 80: IV is VERY HIGH → strong bias toward selling premium, be cautious about buying

**Search:** `"{TICKER} implied volatility rank IV percentile 52 week range options"`

---

## OM-2: Catalyst Calendar (add to Section 9 Technical Setup)

Options expire. A correct thesis that takes 18 months to play out kills a 3-month option. Every options-only analysis must include a catalyst calendar.

**Collect via web search:** `"{TICKER} earnings date 2026 2027 next quarter annual report calendar"`

**Required fields:**
- Next earnings date (exact or estimated)
- Following earnings date
- Annual shareholder meeting / analyst day (if applicable)
- Any known product launches, regulatory decisions, or macro catalysts relevant to the thesis

**Expiry selection rule:**
- Minimum: next catalyst date + 30 days buffer
- Preferred: catalyst date + 45-60 days (captures post-earnings reaction, not just the event)
- If thesis is multi-quarter: use LEAPS (6-12 month expiry) rather than front-month options

Add a "Catalyst Calendar" subsection to Section 9 of the memo with a simple table:

| Date | Event | Options Implication |
|---|---|---|
| [Date] | Q2 2026 Earnings | Primary catalyst; Sep/Oct expiry captures reaction |
| [Date] | Q3 2026 Earnings | Secondary catalyst; Dec expiry |
| [Date] | [Other] | [Note if relevant] |

---

## OM-3: Strategy Selection (replaces standard Section 10)

Use this decision framework. Inputs: DCF direction (from Phase 2B) + IV Rank (from OM-1).

### Decision Matrix

| DCF Direction | IV Rank HIGH (>= 50) — Sell Premium | IV Rank LOW (< 50) — Buy Options |
|---|---|---|
| **Bull** — intrinsic value above current price | Bull Put Spread: sell OTM put, buy lower put. Collect credit. Profit if stock holds above short strike. | Long Call or Bull Call Spread: buy call at/near money, sell higher call to reduce cost. Capture upside to bull case. |
| **Base / Range-bound** — intrinsic near current | Iron Condor: sell OTM call + OTM put, buy wings. Profit from range + IV decay. | Long Straddle / Strangle: buy call + put. Profit from large move in either direction. Use only if binary event is near. |
| **Bear** — intrinsic value below current price | Bear Call Spread: sell OTM call, buy higher call. Collect credit. Profit if stock stays below short strike. | Long Put or Bear Put Spread: buy put at/near money, sell lower put to reduce cost. Capture downside to bear case. |

**Rule:** IV Rank takes precedence over preference. Buying options when IV Rank is above 70 means paying inflated premium — the trade needs to move farther to be profitable.

### Strike Selection from DCF Scenarios

For each recommended strategy, derive strikes directly from DCF intrinsic values:

**Bull thesis (long call / bull call spread):**
- Buy strike: between base case and bull case intrinsic value (captures meaningful upside without paying for the full bull)
- Sell strike (if spread): at or slightly above bull case intrinsic value (cap gain at the bull case level)

**Bear thesis (long put / bear put spread):**
- Buy strike: between base case and bear case intrinsic value (positioned to land in-the-money if bear thesis plays out)
- Sell strike (if spread): at or slightly below bear case intrinsic (define max gain at bear case)

**Example — BROS at $55 (bull $76 / base $47 / bear $26):**
- Bear put spread: buy $50 put / sell $35 put
  - $50 strike is between base ($47) and current ($55) — captures first leg of move
  - $35 strike is between bear ($26) and base ($47) — limits cost while keeping most of the bear case gain
  - Max gain if stock falls to $35 = $15 x 100 = $1,500 per contract (minus premium paid)

### Market Implied Move vs. DCF Scenarios

Calculate whether the options market is pricing in more or less movement than your DCF implies.

**Approximate 1-standard-deviation expected move (for ATM options):**
```
Expected Move = Current Price x IV x sqrt(Days to Expiry / 365)
```

**Compare:**
- If DCF bear case implies -40% downside and market implied move for 90 days is +/-15%, the market is underpricing bear risk → long puts are "cheap" relative to expected move
- If DCF bull case implies +20% upside and market implied move is +/-25%, the market is pricing in MORE movement than your bull case — less compelling to buy calls

Add a 2-sentence "Expected Move vs. DCF" comparison to Section 10 of the memo.

---

## OM-4: Greeks and Risk Summary (Section 10)

For each recommended strategy, provide a brief Greeks summary:

| Metric | Description | Target for Long Options | Target for Short Premium |
|---|---|---|---|
| Delta | Price sensitivity ($/ $1 move in stock) | 0.35–0.55 (directional, not binary) | Sell strikes with Delta 0.20–0.30 |
| Theta | Time decay ($ per day) | Minimize — buy more time than you need | Maximize — shorter duration, faster decay |
| Vega | IV sensitivity ($ per 1pt IV move) | Positive — benefits from IV expansion | Negative — benefits from IV contraction |

State these qualitatively in the memo (e.g., "This trade has positive vega — it benefits if implied volatility expands after entry, which is likely near a binary catalyst."). No need to compute exact dollar Greeks; the characterization is sufficient.

---

## OM-5: Position Sizing (Section 10)

Options-only trades require explicit sizing guidance because the risk profile is fundamentally different from equity:

**Rule: size to max loss, not to premium paid.**

Example sizing framework (adjust to portfolio size):
- Max premium at risk per trade: 2–5% of options portfolio (or total account if no equity)
- Defined-risk structures (spreads): size so that max loss = budget above
- Long options (naked): max loss = premium paid — size accordingly
- Never size based on number of contracts without computing max loss in dollar terms

**Output in Section 10:**
```
Recommended position: {strategy name}
Structure: Buy {strike} {expiry} / Sell {strike} {expiry}
Entry premium (est.): ${X} debit or ${X} credit
Max loss: ${Y} per contract
Breakeven at expiry: ${Z}
Suggested contracts (2% rule at $X portfolio): N contracts = $Y total risk
```

---

## OM-6: Excel Model — Options_Strikes Sheet

Replace the standard Options_Strategy sheet with a two-section Options_Strikes sheet:

### Section A — IV & Market Data (hardcoded inputs, blue)
| Field | Value |
|---|---|
| Current Price | $[X] |
| IV (30-day) | [X]% |
| IV Rank | [X] (high/low/neutral) |
| 52-week IV Low | [X]% |
| 52-week IV High | [X]% |
| Next Earnings Date | [Date] |
| Days to Next Earnings | [N] |
| Recommended Expiry | [Month Year] |

### Section B — DCF-to-Strike Bridge (3 scenarios)
| Scenario | DCF Intrinsic | Direction | Recommended Structure | Buy Strike | Sell Strike | Est. Premium | Max Gain | Max Loss | Breakeven |
|---|---|---|---|---|---|---|---|---|---|
| Bull | $[X] | Long | Bull Call Spread | $[X] | $[X] | $[X] debit | $[X] | $[X] | $[X] |
| Bear | $[X] | Short | Bear Put Spread | $[X] | $[X] | $[X] debit | $[X] | $[X] | $[X] |
| Base | $[X] | Neutral | Iron Condor | $[X]/$[X] | $[X]/$[X] | $[X] credit | $[X] | $[X] | $[X]/$[X] |

All estimated premiums should be labeled with "(est. — verify on broker platform before entry)".

---

## OM-7: Memo Section 10 Template (Options-Only)

Replace the standard Section 10 with this structure:

**9.1 Trading Vehicle Confirmation**
State explicitly: "This analysis supports an options-only directional trade — no underlying equity position."

**9.2 IV Analysis and Strategy Rationale**
- Current IV and IV Rank
- Whether IV is high or low relative to history
- Which side of the matrix this points to (buy vs. sell premium)

**9.3 Catalyst Calendar**
(Move here from Section 9 if it makes the flow cleaner, or cross-reference Section 9)

**9.4 Recommended Strategy**
For each of 1–2 strategies (primary + alternative if IV is ambiguous):
- Strategy name and structure (e.g., "Bear Put Spread")
- Strikes and expiry derived from DCF scenarios
- Entry premium estimate
- Max gain / max loss / breakeven
- Greeks characterization (qualitative)
- Position sizing example

**9.5 Expected Move vs. DCF**
- Market implied 1-SD move for the recommended expiry
- Comparison to DCF bull/base/bear spread
- Conclusion: is the market under- or over-pricing the expected move?

**9.6 Exit Rules**
- Profit target: close at 50% of max gain (for premium sellers) or when stock reaches target strike (for buyers)
- Stop loss: close if premium doubles (for long options) or if stock breaches short strike (for spreads)
- Time stop: close any long options with < 21 days to expiry if thesis has not played out

---

## Critical Options-Only Methodology Rules

1. **IV Rank first, direction second.** The strategy type (buy vs. sell) is determined by IV Rank. Do not buy long options into high-IV environments regardless of how strong the directional conviction is.

2. **Size to max loss.** Never state a recommendation without computing max loss in dollar terms.

3. **Time the thesis, not just the direction.** A correct bear thesis that plays out in 9 months kills a 60-day put. Match expiry to the realistic timeframe of the thesis, not the cheapest available expiry.

4. **Spreads over naked options for directional plays.** Unless the thesis is extremely high-conviction and the catalyst is near, defined-risk spreads are preferred. They reduce cost basis and theta exposure.

5. **"Per-cycle yield" not "annualized yield."** When reporting premium received on short options, label it per-cycle (e.g., "3.2% per cycle" not "annualized at 17%").

6. **Market implied vs. DCF is a required check.** Never skip the expected move comparison. If the market implied move exceeds the DCF scenario spread, the options may be expensive even if the thesis is right.

7. **Social sentiment is not an options input.** Stocktwits sentiment never picks a strategy, strike, expiry, or size. IV Rank and the DCF scenarios do that. A chatter spike did not predict future volatility in the 2026-09 calibration, so it adds nothing IV does not already show.
