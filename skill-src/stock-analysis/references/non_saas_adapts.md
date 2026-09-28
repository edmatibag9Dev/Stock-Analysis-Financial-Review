# Non-SaaS Company Adaptations

## Semiconductors / Hardware (NVDA, AMD, INTC, AVGO)

**Replace Rule of 40 with:**
- Gross margin trend (key leverage indicator)
- Revenue cyclicality note (where are we in the chip cycle?)
- Design win pipeline or TAM expansion narrative

**Revenue model:**
- Segment breakdown (data center, gaming, auto, etc.)
- Cyclical vs. secular growth components
- ASP trends

**DCF adjustments:**
- Use gross margin as primary profitability proxy in projections
- Model two scenarios for cycle timing (peak cycle vs. trough)
- Terminal FCF margin: 25–35% (lower than SaaS due to COGS)
- Higher discount rate (11–14%) due to cyclicality

**Key metrics to pull from filings:**
- Revenue by end market
- Gross margin %
- R&D as % of revenue
- Inventory levels (leading indicator of cycle)
- Data center revenue growth (for AI exposure)

---

## Financial Companies (banks, insurance, asset managers)

**Do NOT use EV/Sales or FCF-based DCF.** Use:
- Price/Book Value (P/B)
- Price/Tangible Book Value (P/TBV)
- Return on Equity (ROE) vs. Cost of Equity
- Net Interest Margin (for banks)

**DCF replacement:** Dividend Discount Model or Residual Income Model

**Key metrics:**
- NIM (Net Interest Margin)
- Non-performing loans / credit quality
- CET1 ratio (capital adequacy)
- ROE vs. peer median
- Loan growth

**Peer comps:** Use P/B and ROE, not EV/Sales.

---

## Consumer / Retail

**Key metrics:**
- Same-store sales growth
- Gross margin trend
- Inventory turns
- Customer acquisition cost vs. LTV
- E-commerce penetration

**DCF:** Standard FCF-based, but use lower terminal growth (2–3%) and lower terminal margins (10–20%).

**Multiples:** EV/EBITDA is more common than EV/Sales for retail.

---

## Biotech / Pharma (pre-revenue or pipeline-heavy)

**Do NOT use standard DCF** if the company has no revenue or negative FCF.

Instead:
- Risk-adjusted NPV of pipeline (rNPV)
- Sum-of-the-parts by asset
- Cash burn rate and runway
- Probability of approval by trial phase

**Note in memo:** "Standard DCF not applicable. Analysis based on pipeline value and cash runway."

---

## Industrials / Energy

**Key metrics:**
- EBITDA margin
- CapEx intensity (% of revenue)
- Free cash flow conversion (FCF / Net Income)
- Order backlog / book-to-bill ratio
- Commodity price sensitivity

**Multiples:** EV/EBITDA is primary. EV/Sales secondary.

**DCF:** Use unlevered FCF (EBIT × (1-tax) + D&A - CapEx - ΔNWC). Include debt in capital structure.

---

## General Adaptation Rule

When you're unsure how to adapt: search for "how analysts value {Company type} companies" and look at how sell-side research reports structure their analysis. Use the industry-standard profitability metric (gross margin for semis, NIM for banks, EBITDA for industrials) in place of FCF margin wherever the skill calls for FCF margin.

Always disclose the methodology change in the memo: "Note: [Company] is a [type] business. This analysis uses [metric] instead of FCF margin as the primary profitability measure."

---

## Fast-Casual / Restaurant

**Do NOT use FCF-based DCF** if the company is pre-EBITDA profitable. Use EBITDA-terminal
multiple approach (see `dcf_defaults.md` → Restaurant section for full methodology).

**Replace Rule of 40 with Unit Economics Scorecard:**

| Metric | Source | What to Watch |
|---|---|---|
| Same-Store Sales (SSS) % | 8-K / 10-Q | Trend direction matters more than level; 4-quarter deterioration = structural concern |
| Average Unit Volume (AUV) | 8-K / investor deck | Declining AUV + growing units = value destruction |
| Restaurant-Level Margin % | 10-Q (segment P&L) | Target: >20% for mature concept; <15% = under pressure |
| Adj. EBITDA margin | 8-K | Breakeven timing is the key inflection point |
| New unit openings (net) | 10-Q | Negative net = contraction; zero = stagnation |
| Automation % of fleet | Press release / IR deck | For IK/robot thesis: must model separately (see below) |

**For automation / labor-reduction thesis (e.g., Infinite Kitchen):**

Do NOT rely solely on blended margin assumptions. Build a unit-level decomposition:

```
IK restaurant count (current → projected)
IK restaurant-level margin (from disclosed data or proxy)
Traditional restaurant-level margin (derived: (blended - IK×IK%) / (1 - IK%))
Blended margin = (IK count × IK margin + Trad count × Trad margin) / Total count
```

This converts the margin recovery narrative from an assertion into a derivable projection.
If IK margin data is not yet disclosed, flag this explicitly and use a range (+5pp to +10pp
vs. traditional) rather than asserting a specific terminal margin.

**Terminal multiple calibration (restaurant):**
- Do not apply EBITDA multiples >15x to concepts with <8% EBITDA margins at terminal year
- CAVA-tier (23%+ RL margins, 30%+ rev growth) → 25–35x EV/EBITDA supportable
- Chipotle-tier (27% RL margins, mature) → 28–35x EV/EBITDA
- Shake Shack-tier (18–20% RL margins) → 16–20x EV/EBITDA
- Pre-maturity restaurant (10–14% RL, <5% EBITDA) → distressed multiple; use EV/Sales

**Peer comparison table — include these metrics (not just EV/Sales):**
- Forward SSS %
- Restaurant-level margin %
- AUV ($K)
- EV/EBITDA (if profitable)
- EV/Sales

**Wonder Group / illiquid investments:**
If the company holds illiquid non-core investments on the balance sheet, assign a
probability-weighted value (30–50 cents on the dollar for illiquid preferred) rather than
silently zeroing them. Add as a separate line in the equity bridge.

**Competitive displacement risk:**
For SSS-declining restaurants, quantify how much of the comp decline is:
(a) Temporary: weather, tough comparables, loyalty program transition
(b) Structural: market share loss to a direct competitor

Do not accept management's framing without cross-referencing the direct competitor's
SSS in the same period. If competitor comps are +9% while subject is -12%, the structural
explanation deserves equal weighting in the bear case.
