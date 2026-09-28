# Leadership & Governance — Scored Module

Purpose: turn "who runs this company" into a scored, evidence-based input to the thesis —
**who** they are and **why it matters** to the investment. Modeled on the CEO-judgment step of
Tom Nash's stock research system (execution track record, founder-operators with long tenure,
insider buying as a positive signal, "bozos hire bozos, superstars hire superstars"). This is a
subjective category — Nash's warning applies: *if you are unsure a CEO is a superstar, they are not.*
Score honestly; do not round up.

Every score line MUST cite a specific fact (a filing, a number, a dated event). No score without evidence.

---

## Part A — WHO (identify and profile)

Pull the following before scoring. Sources in priority order:
- **DEF 14A (proxy statement)** — executive/board bios, tenure, compensation structure, beneficial
  ownership %, related-party transactions, dual-class / voting structure.
- **Form 4 filings (last 12 months)** — insider open-market buys vs. sells (exclude automatic
  10b5-1 sells and option-exercise-and-hold noise; flag genuine open-market purchases).
- **10-K / 10-Q + earnings calls** — execution vs. prior guidance, capital-allocation actions.
- **Reputable web** — CEO/founder background, prior companies, notable governance events.

Capture into a short profile:

| Field | What to record |
|---|---|
| CEO | Name, founder or hired, year became CEO (tenure), prior track record |
| CFO | Name, tenure, background |
| Founder involvement | Founder still CEO/Chair/board? Founder-led = plus |
| Insider ownership | % of shares held by insiders (from proxy) |
| Recent insider activity | Net open-market buys/sells last 12 mo (Form 4), notable names |
| Voting structure | Single-class vs. dual-class / super-voting; who controls votes |
| Board | Size, % independent, Chair/CEO split or combined |
| Comp structure | Pay-for-performance vs. guaranteed; metrics tied to comp |
| Governance flags | Related-party deals, dilution history, turnover, restatements, litigation |

---

## Part B — WHY IT MATTERS (scored rubric)

Score each of the 5 criteria **0 / 5 / 10** (Nash's scale). Max = 50.

| # | Criterion | 10 (strong) | 5 (mixed) | 0 (concern) |
|---|---|---|---|---|
| 1 | **Execution track record** | Consistently meets/raises guidance; delivered on prior multi-year targets | Uneven; some misses offset by beats | 2+ guidance misses in 4 qtrs; broken promises |
| 2 | **Founder / tenure / skin in game** | Founder-operator, 10+ yrs, meaningful insider ownership | Long-tenured hired CEO, modest ownership | Short-tenure or revolving door; negligible ownership |
| 3 | **Capital allocation** | Disciplined M&A, buybacks at low prices, low dilution | Neutral; some value-neutral moves | Serial dilution, overpriced M&A, value destruction |
| 4 | **Insider activity (Form 4)** | Net open-market buying by execs/directors | Neutral / routine 10b5-1 sells only | Heavy discretionary insider selling |
| 5 | **Governance & alignment** | Independent board, single-class or aligned voting, clean comp | Some concerns (combined Chair/CEO, rich comp) | Dual-class entrenchment, related-party deals, red flags |

**Composite interpretation (out of 50):**

| Score | Read | Thesis effect |
|---|---|---|
| 40–50 | Strong leadership — a reason to own | Supports **Bull Case** (management execution & capital allocation) |
| 25–39 | Acceptable — not a differentiator | Neutral; note briefly |
| 0–24 | Leadership/governance is a risk | Supports **Bear Case** (management or governance issues); flag in Verdict |

A score of **0 on criterion 4 or 5** (heavy insider selling or entrenchment/red flags) should be called
out explicitly in the memo regardless of the composite — governance risk is asymmetric.

---

## Part C — Adaptations by company type

- **Founder-led hypergrowth (e.g., PLTR-type):** weight execution and founder alignment; dual-class is
  common and not automatically a 0 if execution is elite — but note the entrenchment.
- **Restaurants / consumer:** weight unit-economics execution and capital discipline (new-unit ROIC,
  dilution to fund expansion) over pure guidance-beating.
- **Financials / banks:** weight governance, risk culture, and related-party lending heavily.
- **Pre-revenue / early:** insider ownership and cash-runway stewardship dominate; execution history is thin, so
  score criterion 1 conservatively (default 5 unless there is a clear prior-company track record).

---

## Part D — Outputs this feeds

- **Memo:** the "Management & Governance" section (see `memo_sections.md`) — Part A profile as the
  "who," Part B table as the scored "why it matters."
- **Model:** the `Leadership_Scorecard` block on the Rule_of_40 sheet (see `SKILL.md` Phase 3A) —
  the 5 criteria, scores, and composite, blue = hardcoded judgment inputs.
- **Bull/Bear sections:** a 40+ composite becomes a bull sub-argument; a sub-25 composite (or a 0 on
  criteria 4/5) becomes a bear sub-argument. Always tie to the specific evidence recorded in Part A.
