# DCF Default Assumptions by Company Type

## High-Growth AI / SaaS (>50% revenue growth)
Examples: PLTR, early-stage hypergrowth cloud

| | Bull | Base | Bear |
|---|---|---|---|
| Discount rate | 12% | 13% | 15% |
| Terminal growth | 4% | 3.5% | 3% |
| Yr2 growth (vs guided Yr1) | Guided −10pp | Guided −20pp | Guided −35pp |
| Yr3 growth | Yr2 −10pp | Yr2 −15pp | Yr2 −15pp |
| Yr4 growth | Yr3 −10pp | Yr3 −10pp | Yr3 −5pp |
| Yr5 growth | Yr4 −10pp | Yr4 −7pp | Yr4 −5pp |
| FCF margin (terminal) | 55% | 50% | 40% |

## Growth SaaS (20–50% revenue growth)
Examples: NOW, SNOW, DDOG, CRWD

| | Bull | Base | Bear |
|---|---|---|---|
| Discount rate | 10% | 11% | 12% |
| Terminal growth | 4% | 3.5% | 3% |
| Yr2 growth | Guided | Guided −2pp | Guided −7pp |
| Yr3 growth | Yr2 | Yr2 −2pp | Yr2 −6pp |
| Yr4 growth | Yr3 −2pp | Yr3 −3pp | Yr3 −4pp |
| Yr5 growth | Yr4 −2pp | Yr4 −3pp | Yr4 −2pp |
| FCF margin (terminal) | 42% | 40% | 35% |

## Mature / Steady SaaS (<20% growth)
Examples: CRM, WDAY, ORCL

| | Bull | Base | Bear |
|---|---|---|---|
| Discount rate | 9% | 10% | 11% |
| Terminal growth | 3.5% | 3% | 2.5% |
| Yr2–5 growth | Flat to +2pp | Flat | −1 to −3pp |
| FCF margin (terminal) | 38% | 35% | 30% |

## Semiconductor / Hardware
Examples: NVDA, AMD, INTC

| | Bull | Base | Bear |
|---|---|---|---|
| Discount rate | 11% | 12% | 14% |
| Terminal growth | 4% | 3% | 2% |
| Key margin metric | Gross margin % | Gross margin % | Gross margin % |
| FCF margin (terminal) | 35% | 28% | 20% |
| Note | Model TAM expansion | Steady state | Cycle trough |

## FCF Margin Starting Points
Use the most recent quarter's FCF margin as the Yr1 anchor, then trend toward terminal:
- If current FCF margin < terminal: assume steady improvement
- If current FCF margin > terminal: mean-reversion downward (investment cycle, M&A, etc.)
- Flag any >10pp gap between current and terminal as an assumption worth calling out

## Net Cash Calculation
Net cash = (Cash + marketable securities) − Total debt
For companies with no debt: Net cash = Cash + short/long-term marketable securities
For companies with significant debt: model interest expense separately if material

## Restaurant / Fast-Casual (pre-EBITDA or thin-margin)
Examples: SG, SHAK, BROS, CAVA

**Do NOT use standard FCF DCF** if the company has negative or near-zero EBITDA.
Use EBITDA-terminal multiple approach:
1. Project revenue + restaurant-level margin + G&A → Adj. EBITDA for 5 years
2. Terminal value = Year 5 EBITDA × exit multiple (see table below)
3. PV of terminal value (discount back 5 years) + net cash = equity value
4. For bear case with negative EBITDA through terminal year: use distressed EV/Sales (0.5–0.8x)

**CRITICAL — Single WACC Rule:** Use ONE discount rate across all scenarios. Scenario-dependent
WACCs compound execution risk on top of cash flow risk, inflating the bull/bear spread beyond
what fundamentals alone justify. Recommended starting WACC for a pre-profitable restaurant: 12%.

| | Bull | Base | Bear |
|---|---|---|---|
| Discount rate (single WACC) | 12% | 12% | 12% |
| Terminal EV/EBITDA multiple | 20–25x | 12–15x | N/A (use EV/Sales) |
| Terminal EV/Sales (distressed fallback) | — | — | 0.5–0.8x |
| Terminal EBITDA margin check | >18% to justify ≥20x | 8–12% for 12–15x | Negative → sales multiple |

**Terminal multiple calibration by margin (important):**
- EBITDA margin ≥20% at terminal → 18–22x (Chipotle-tier economics)
- EBITDA margin 8–12% at terminal → 10–14x (Shake Shack tier)
- EBITDA margin <5% at terminal → do not apply EBITDA multiple; use distressed EV/Sales

**Key projection inputs:**
- Year 1 revenue: use management guidance, NOT prior-year × growth rate
- Flag if stated growth assumption table uses a different base than prior-year actuals
  (e.g., if model starts from $655M guidance base while FY2025 actual was $679M,
   label the table "growth from $655M guidance base" to avoid YoY confusion)
- Restaurant-level margin: model IK vs. traditional split if automation is the thesis (see non_saas_adapts.md)
- G&A leverage: restaurant G&A typically 12–18% of revenue; model declining to 10–12% only at large scale

**Key metrics to extract from filings:**
- Same-store sales (SSS) — quarterly trend + guidance
- Average Unit Volume (AUV) — trailing and guidance
- Restaurant-level profit and margin (% of restaurant revenue)
- New unit openings and closings (net)
- Adj. EBITDA (company-defined; verify what's excluded)
- Cash + restricted cash, total debt → net cash
- Diluted share count + any ATM/equity raise disclosures
- For automation-thesis companies: IK/robotics location count and % of fleet
