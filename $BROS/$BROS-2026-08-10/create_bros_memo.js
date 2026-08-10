// $BROS Investment Memo — 2026-08-10 quarterly update. Output paths quoted per repo standard.
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType,
  HeadingLevel, AlignmentType, ShadingType, BorderStyle, ImageRun, LevelFormat,
  Header, Footer, PageNumber, convertInchesToTwip,
} = require("docx");

const NAVY = "1F4E79";
const FONT = "Arial";

const p = (text, opts = {}) =>
  new Paragraph({
    spacing: { after: 160 },
    ...opts.para,
    children: [new TextRun({ text, font: FONT, size: 24, ...opts.run })],
  });

const boldPara = (text) => p(text, { run: { bold: true } });
const italic = (text) => p(text, { run: { italics: true, size: 20, color: "595959" } });

const h1 = (text, first = false) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    pageBreakBefore: !first,
    spacing: { before: 240, after: 160 },
    children: [new TextRun({ text, font: FONT, size: 28, bold: true, color: NAVY })],
  });

const h2 = (text) =>
  new Paragraph({
    spacing: { before: 160, after: 100 },
    children: [new TextRun({ text, font: FONT, size: 24, bold: true, color: NAVY })],
  });

const bullets = (items) =>
  items.map(
    (t) =>
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        spacing: { after: 80 },
        children: [new TextRun({ text: t, font: FONT, size: 22 })],
      })
  );

function cell(text, { width, bold = false, shade, size = 20, align } = {}) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: shade ? { type: ShadingType.CLEAR, fill: shade } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [
      new Paragraph({
        alignment: align,
        children: [new TextRun({ text, font: FONT, size, bold })],
      }),
    ],
  });
}

function table(widths, rows) {
  return new Table({
    width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    columnWidths: widths,
    rows: rows.map(
      (r, i) =>
        new TableRow({
          children: r.cells.map((c, j) =>
            cell(c, { width: widths[j], bold: i === 0 || r.boldRow, shade: i === 0 ? "D9D9D9" : r.shade })
          ),
        })
    ),
  });
}

const kv = (pairs, w1 = 3600, w2 = 5760) =>
  table([w1, w2], [{ cells: ["Metric", "Value"] }, ...pairs.map(([a, b]) => ({ cells: [a, b] }))]);

// ---------------- content ----------------
const children = [];

children.push(
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
    children: [new TextRun({ text: "DUTCH BROS INC. ($BROS — NYSE)", font: FONT, size: 36, bold: true, color: NAVY })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
    children: [new TextRun({ text: "INVESTMENT MEMO — Q2 2026 EARNINGS UPDATE", font: FONT, size: 26, bold: true })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 240 },
    children: [new TextRun({
      text: "Date: August 10, 2026 | Analyst: Ed | Rating: ACCUMULATE (staged) — upgraded from HOLD | Prior analysis: June 5, 2026",
      font: FONT, size: 22,
    })],
  })
);

// ---- 1. INVESTMENT SUMMARY
children.push(h1("1. INVESTMENT SUMMARY", true));
children.push(
  p("Dutch Bros delivered a Q2 2026 beat-and-raise — revenue of $550.9M (+32.5% YoY), systemwide SSS of +5.8%, and FY2026 guidance raised on both revenue ($2.10–$2.13B) and adjusted EBITDA ($385–$390M) — yet the stock fell ~18% to ~$51 because comp growth is increasingly price-led (system transactions +1.7% vs. +3.7% a year ago) and Q3 SSS guidance of 4–5% implies further deceleration. The sell-off has pushed the stock from between base and bull to roughly 13% BELOW the rebuilt DCF base case ($58.77), converting a hold into a staged accumulation opportunity — provided traffic does not go negative.")
);
children.push(table(
  [1200, 2800, 1900, 1600, 1860],
  [
    { cells: ["Scenario", "Key Drivers", "EBITDA × Multiple", "Implied Price", "vs. Current ~$51.29"] },
    { cells: ["Bear Case", "Transactions go negative, SSS 2–3%, margins compress on coffee/occupancy costs; multiple de-rates to mature-restaurant level.", "$387.5M × 16x ≈ $6.2B EV", "~$35", "▼ ~32% decline"], shade: "FFC7CE" },
    { cells: ["Base Case", "FY26 guidance delivered; SSS normalizes 4–5% with modest traffic growth; ≥185 openings; market pays growth-restaurant multiple.", "$387.5M × 24x ≈ $9.3B EV", "~$52", "≈ fairly valued (+2%)"], shade: "FFEB9C" },
    { cells: ["Bull Case", "Traffic re-accelerates on food/menu strategy; Salad and Go conversions extend 2,029-shop 2029 goal; multiple re-rates toward CAVA/WING tier.", "$387.5M × 30x ≈ $11.6B EV", "~$65", "▲ ~27% upside"], shade: "C6EFCE" },
  ]
));
children.push(italic(
  "Market-multiple approach reflects near-term pricing behavior on FY2026 guided EBITDA ($387.5M midpoint, 180M fully exchanged shares, +$74M net cash). DCF intrinsic value analysis (bull $96.52 / base $58.77 / bear $25.91) is in Section 6 — the live Excel model is authoritative."
));

// ---- 2. BUSINESS SNAPSHOT
children.push(h1("2. BUSINESS SNAPSHOT"));
children.push(
  p("Dutch Bros is one of the fastest-growing drive-thru beverage brands in the U.S., ending Q2 2026 with 1,225 shops (888 company-operated, 337 franchised) and expanding into Chicago, Atlanta, Charlotte, Tampa, and Mississippi. The company targets 2,029 shops by 2029 — with roughly 90% of the required pipeline already secured — against a stated 4,000+ long-term U.S. unit potential.")
);
children.push(kv([
  ["Current Price", "$51.29 (Aug 10, 2026 close; −18% on Aug 6 post-earnings)"],
  ["Market Cap (fully exchanged)", "~$9.2B (180M fully exchanged shares)"],
  ["Enterprise Value", "~$9.2B ($9.2B − $74M net cash) — ~23.6x FY26E EBITDA"],
  ["52-Week Range", "$44.58 – $74.65"],
  ["Q2 2026 Revenue", "$550.9M (+32.5% YoY)"],
  ["Q2 2026 Systemwide SSS", "+5.8% (transactions +1.7%, ticket +4.1%)"],
  ["Q2 2026 Co-Op SSS", "+8.3% (transactions +3.4%)"],
  ["Q2 2026 Co-Op Contribution Margin", "30.6% (vs. 31.1% PY)"],
  ["Q2 2026 Adj. EBITDA", "$113.7M (20.6% margin vs. 21.4% PY)"],
  ["Q2 2026 Adj. EPS (fully exchanged)", "$0.33 (vs. $0.26 PY)"],
  ["Cash / Net Cash", "$268.6M cash / ~$74M net cash (vs. $194.6M LT debt)"],
  ["Total Shops (Q2 end)", "1,225 (48 opened in Q2; 89 in H1)"],
  ["FY2026 Guided Revenue", "$2.10–$2.13B, raised from $2.05–$2.08B (excl. Salad and Go)"],
  ["FY2026 Guided Adj. EBITDA", "$385–$390M, raised from $370–$380M"],
  ["FY2026 Capex Guide", "$350–$370M | ≥185 system shop openings"],
]));

// ---- WHAT CHANGED
children.push(h1("WHAT CHANGED — Q2 2026 (Retrospective Signal Check)"));
children.push(h2("The print beat; the tape sold the composition"));
children.push(
  p("Q2 2026 was, on its face, the catalyst the June memo asked for: SSS at or above 5% (delivered +5.8%) with restaurant margins above 29% (delivered 30.6% co-op contribution). Guidance was raised on both revenue and EBITDA. But the market sold the composition of the comp: systemwide transaction growth decelerated to +1.7% from +3.7% a year ago, average ticket (+4.1%) carried the quarter, management guided Q3 SSS to 4–5% (below Q2's 5.8%), and pricing contribution falls below 1% in H2 as menu-price rollovers lapse. Adjusted EBITDA margin also slipped 80bps YoY to 20.6% on beverage, packaging, coffee, and occupancy costs. The stock gapped from ~$65.60 to ~$53.60 on ~2.5x average volume, and has drifted to $51.29.")
);
children.push(h2("Capital deployment: Salad and Go + Clutch Coffee site acquisitions"));
children.push(
  p("Dutch Bros agreed to acquire up to 65 Salad and Go drive-thru locations out of bankruptcy for $105M (Arizona, Nevada, Texas, Oklahoma; expected close Q3 2026, conversions starting 2027, excluded from current guidance). This follows the $20M purchase of Clutch Coffee Bar's 20 locations earlier in 2026. Both are distressed real-estate buys of purpose-built drive-thru sites in core densification markets — at ~$1.6M per Salad and Go site, roughly in line with ground-up development cost but with prime corners and faster time-to-open. This crosses the quarterly-update capital-structure/material-event threshold and is the clearest evidence yet that management intends to hit the 2,029-shop 2029 goal partly through opportunistic M&A of sites, not brands.")
);
children.push(h2("Could we have seen it coming?"));
children.push(
  p("Largely, yes — the June memo's bear case led with exactly this: 'the +8.3% Q1 comp included an easy weather comparison,' 'management has guided full-year SSS to mid-single digits, implying meaningful H2 deceleration,' and 'growth increasingly price-led.' What the June memo did not anticipate was the violence of the reaction to a beat-and-raise quarter — an 18% single-day de-rate on a traffic composition signal, not a guidance cut. The pattern worth logging to the cross-ticker library: for premium-multiple growth restaurants (>23x EV/EBITDA), a decelerating transaction comp is treated by the market as a thesis break even when headline SSS and guidance improve. Watch transaction comps, not SSS, as the primary demand signal.")
);
children.push(h2("Model reconciliation note (prior memo discrepancy)"));
children.push(
  p("This update built the first live Excel model for $BROS (the June analysis was memo-only). Rebuilding the June DCF exposed an internal inconsistency in the prior memo: its published base/bull intrinsic values ($47/$76) did not match its own stated EV math — $10.5B base equity value ÷ 177.9M shares implies ~$59, and $17.96B bull equity implies ~$101 (the bear case, $26, did reconcile). The rebuilt model — nearly identical assumptions, updated to raised FY26 guidance — produces bear $25.91 / base $58.77 / bull $96.52. Per methodology, the model is now authoritative; the effective base case is ~$12 higher than the June memo stated, which materially changes the read at $51: the stock is below base-case intrinsic value, not straddling it.")
);

// ---- 3. MANAGEMENT & GOVERNANCE
children.push(h1("3. MANAGEMENT & GOVERNANCE"));
children.push(
  p("CEO Christine Barone (hired; CEO since January 2024, president before that; prior senior leadership at Starbucks and CEO of True Food Kitchen) runs day-to-day execution, while co-founder Travis Boersma (founded 1992) remains Executive Chairman and controlling shareholder. This section is new to the $BROS memo — the scored leadership module was added to the workflow in July 2026.")
);
children.push(kv([
  ["CEO", "Christine Barone (hired, since Jan 2024; ex-Starbucks, ex-True Food Kitchen)"],
  ["Founder involvement", "Travis Boersma, co-founder, Executive Chairman"],
  ["Insider Ownership", "Boersma ~38.8% economic interest via DM Trust / DM Individual Aggregator / DMI Holdco"],
  ["Voting Structure", "Four-class; Class B (Boersma only) carries 10 votes/share → 73.1% voting power; sunset if Class B <5% of shares"],
  ["Recent Insider Activity", "No open-market buys; chair-linked entities sold ~2.25M shares H1 2026 at $60–64 (10b5-1); CEO sold 42,031 shares (10b5-1)"],
  ["Governance Flags", "Dual-class entrenchment (73.1% votes vs. 38.8% economics); separate CEO/Chair; no restatements or related-party flags found"],
]));
children.push(table(
  [3200, 1400, 4760],
  [
    { cells: ["Criterion", "Score", "Evidence"] },
    { cells: ["Execution track record", "10/10", "Q2'26 beat; FY26 revenue AND EBITDA guidance raised (Aug 5, 2026 8-K); 32.5% revenue growth; 89 H1 openings on ≥185 pace"] },
    { cells: ["Founder / tenure / skin in game", "5/10", "Founder Exec Chairman with 38.8% economic stake — but hired CEO tenure only ~2.5 years and founder is in programmatic sell-down"] },
    { cells: ["Capital allocation", "5/10", "Disciplined distressed-site M&A (Clutch $20M/20 sites; Salad and Go $105M/65 sites) offset by $350–370M capex, negative FCF, no buybacks, share-count creep"] },
    { cells: ["Insider activity (Form 4)", "5/10", "Routine 10b5-1 sells only (chair-linked 1.5M shares Jun 10–11 @$60–64 + 750K more; CEO 42K); zero open-market buys in last 12 months"] },
    { cells: ["Governance & alignment", "5/10", "Class B super-vote (10:1) gives founder 73.1% control vs. 38.8% economics — entrenchment risk, partly mitigated by sunset provision and split CEO/Chair"] },
    { cells: ["Composite", "30/50", "NEUTRAL (25–39) — not a differentiator in either direction"], boldRow: true, shade: "FFEB9C" },
  ]
));
children.push(
  p("The 30/50 composite is neutral: execution is elite, but the ownership structure concentrates control with a founder who is a steady programmatic seller, and expansion is still externally funded by the balance sheet rather than self-funded by free cash flow. No criterion scored 0, so no asymmetric governance flag is raised — but a shift from 10b5-1 selling to discretionary selling, or any large secondary offering to fund the acquisitions, would drop criterion 4 and warrant a re-score.")
);

// ---- 4. BULL CASE
children.push(h1("4. BULL CASE"));
children.push(h2("The growth algorithm survived the sell-off intact"));
children.push(
  p("Nothing in the Q2 print broke the 20%+ growth model: revenue grew 32.5%, guidance moved up on both lines, 89 shops opened in H1 against a ≥185 full-year target, and new markets (Chicago, Atlanta, Charlotte, Tampa, Mississippi) are performing consistently with the system. The 2,029-shop 2029 goal now has ~90% of its pipeline secured. An 18% de-rate against improved fundamentals is, mechanically, a cheaper claim on the same growth.")
);
children.push(h2("Unit economics remain best-in-class"));
children.push(
  p("Company-operated contribution margin of 30.6% in Q2 sits at the top of fast casual — above Shake Shack (~21–22%) and near Chipotle (~26–27%) despite a fleet that is far younger. Co-op SSS of +8.3% with +3.4% transaction growth shows the core (mostly Western) fleet is still gaining traffic; the softer systemwide figure is diluted by franchise markets. AUV (~$2.2M and rising) continues to close on the $2.5M target.")
);
children.push(h2("Distressed real estate is accelerating the build-out"));
children.push(
  p("The Salad and Go ($105M, up to 65 sites) and Clutch Coffee ($20M, 20 sites) deals convert two failed concepts' purpose-built drive-thru corners into Dutch Bros capacity in its strongest densification markets. Converted sites shortcut permitting and construction timelines and are excluded from current guidance — optionality on top of the ≥185 organic openings.")
);
children.push(h2("The base case now requires little heroism"));
children.push(
  p("At $51.29 the stock trades ~13% below the rebuilt DCF base case ($58.77), which assumes 18.5% revenue CAGR (below the current 32.5% and below management's ~20% algorithm) and 22% terminal EBITDA margins (vs. 20.6% today). The market-multiple base case (~$52 at 24x guided EBITDA) says the same thing: downside to fair value is roughly zero if Dutch Bros merely executes its raised guidance.")
);

// ---- 5. BEAR CASE
children.push(h1("5. BEAR CASE"));
children.push(h2("Traffic is the thesis — and it is decelerating"));
children.push(
  p("Systemwide transactions grew just +1.7% in Q2, down from +3.7% a year ago and from a +6.9% transaction comp in Q1. With pricing contribution guided below 1% for H2, the comp must be carried by traffic exactly as traffic slows. If transactions go negative — plausible against tough H2 comps and a stretched low-income consumer — SSS prints in the 1–2% range, operating leverage inverts, and the bear case ($25.91 DCF, ~$35 at a 16x multiple) is live. The market's reaction to Q2 shows it will not wait for confirmation.")
);
children.push(h2("Margin pressure is broadening"));
children.push(
  p("Adjusted EBITDA margin fell 80bps YoY (20.6%) with beverage and packaging costs up 80bps, and management explicitly flagged coffee costs and occupancy — including higher-rent build-to-suit leases — as continuing near-term pressure. Co-op contribution margin slipped 50bps YoY (30.6% vs. 31.1%). The June memo's alert threshold (<27%) is far away, but the direction has now been negative for two consecutive quarters at the EBITDA line.")
);
children.push(h2("Expansion is still externally funded — and now includes integration risk"));
children.push(
  p("FY26 capex of $350–370M against ~$387M of EBITDA leaves free cash flow at roughly breakeven-to-negative, and the $105M Salad and Go purchase plus conversion capex comes on top. Converting 65 salad kiosks into coffee shops through 2027 is real operational work; a stumble would pressure both the opening cadence and margins. The 2,029-by-2029 goal embeds ~27% unit growth per year from here — little slack for integration distraction.")
);
children.push(h2("7 Brew and the technical tape"));
children.push(
  p("7 Brew continues its Roark-backed expansion into overlapping Sun Belt and Western markets with lower price points — a direct threat to the traffic comp precisely when it matters most. Technically the stock is broken: below all three SMAs (20d $63.28, 50d $64.21, 200d $57.24), RSI ~20, with a large unfilled gap overhead. Oversold bounces into $57–58 are likely to be sold until transaction data improves.")
);

// ---- 6. DCF VALUATION
children.push(h1("6. DCF VALUATION"));
children.push(
  p("Restaurant methodology: 5-year projection (FY2026 guidance base) with an EBITDA-terminal multiple at FY2030, discounted at a single 12% WACC across all scenarios; terminal multiples are calibrated to terminal EBITDA margins (18% → 12x, 22% → 18x, 26% → 22x). Revenue growth is stated from the $2,115M FY2026 guidance midpoint base. Interim FCF = EBITDA − capex (17% of revenue gliding to 10%) − cash taxes (~15% of EBITDA). All figures below are live-linked from $BROS_Investment_Model_2026-08-10.xlsx (authoritative).")
);
children.push(table(
  [2960, 2130, 2130, 2140],
  [
    { cells: ["Metric", "Bull Case", "Base Case", "Bear Case"] },
    { cells: ["Discount Rate (single WACC)", "12%", "12%", "12%"] },
    { cells: ["Revenue CAGR FY26→FY30 (from $2,115M guidance base)", "22.5%", "18.5%", "12.0%"] },
    { cells: ["FY2030 Revenue", "~$4.76B", "~$4.17B", "~$3.33B"] },
    { cells: ["Terminal EBITDA Margin", "26%", "22%", "18%"] },
    { cells: ["FY2030 EBITDA", "~$1,239M", "~$918M", "~$599M"] },
    { cells: ["Terminal EV/EBITDA Multiple", "22x", "18x", "12x"] },
    { cells: ["PV of Terminal Value", "~$16.6B", "~$10.0B", "~$4.4B"] },
    { cells: ["PV of Interim FCF (FY27–30)", "~$0.7B", "~$0.5B", "~$0.2B"] },
    { cells: ["Enterprise Value", "~$17.3B", "~$10.5B", "~$4.6B"] },
    { cells: ["+ Net Cash", "+$74M", "+$74M", "+$74M"] },
    { cells: ["÷ Fully Exchanged Shares", "180M", "180M", "180M"] },
    { cells: ["INTRINSIC PRICE / SHARE", "$96.52", "$58.77", "$25.91"], boldRow: true },
    { cells: ["Current Price $51.29 — Premium/(Discount)", "(46.9%)", "(12.7%)", "+97.9%"] },
  ]
));
children.push(
  p("The stock trades 12.7% below base-case intrinsic value and at less than half the bull case — the first time in this ticker's coverage that price has been below base. The asymmetry is now favorable (+15% to base, +88% to bull, −49% to bear), but the bear case is not remote: it is simply what happens if transaction growth goes negative and margins keep bleeding. That combination is exactly what Q2's composition hinted at, which is why staged accumulation — not a full position — is the right expression.")
);

// ---- 7. UNIT ECONOMICS
children.push(h1("7. UNIT ECONOMICS & GROWTH MODEL"));
children.push(
  p("Dutch Bros is evaluated on unit economics rather than Rule of 40 (restaurant adaptation). The three compounding levers are unchanged: unit growth (≥185 organic openings plus up to 85 acquired sites from Salad and Go/Clutch), AUV expansion toward $2.5M, and margin expansion toward 30%+ contribution at maturity.")
);
children.push(kv([
  ["Systemwide SSS (Q2 2026)", "+5.8% (Q3 guided 4–5%)"],
  ["System Transaction Growth", "+1.7% — PRIMARY WATCH METRIC (was +3.7% PY)"],
  ["Average Ticket Growth", "+4.1% (pricing contribution <1% in H2)"],
  ["Co-Op Contribution Margin", "30.6% (vs. 31.1% PY)"],
  ["Adj. EBITDA Margin", "20.6% (vs. 21.4% PY)"],
  ["Systemwide AUV", "~$2.2M est. (Q1: $2.16M, +6.6% YoY) vs. $2.5M target"],
  ["New Openings", "48 in Q2 / 89 in H1 / ≥185 FY26 target"],
  ["Acquired Site Pipeline", "Up to 65 Salad and Go + 20 Clutch Coffee conversions (2027)"],
  ["Unit Potential", "1,225 today vs. 2,029 by 2029 goal (~90% pipeline secured); 4,000+ long-term"],
  ["Est. Cash-on-Cash Return (mature unit)", "~35–40% at ~$2.2M AUV / ~30% contribution margin"],
]));

// ---- 8. PEER COMPARABLES
children.push(h1("8. PEER COMPARABLES"));
children.push(table(
  [1900, 1100, 1300, 1500, 1560, 1900],
  [
    { cells: ["Company", "Ticker", "SSS %", "RL Margin", "Fwd EV/EBITDA", "Note"] },
    { cells: ["Dutch Bros", "BROS", "+5.8%", "~31%", "~24x", "Subject — fastest grower in set"], shade: "FFEB9C" },
    { cells: ["Starbucks", "SBUX", "~+1–3%", "n/a", "~16–18x", "Scale leader, traffic-challenged"] },
    { cells: ["Chipotle", "CMG", "~+2–4%", "~26–27%", "~24–27x", "Margin/leverage benchmark"] },
    { cells: ["CAVA", "CAVA", "~+5–8%", "~25%", "~40x+", "Closest growth comp; richer multiple"] },
    { cells: ["Shake Shack", "SHAK", "~+2–4%", "~21–22%", "~22–26x", "Mid-growth fast casual"] },
    { cells: ["Wingstop", "WING", "~flat–+3%", "n/a", "~38–45x", "Franchise-model premium"] },
    { cells: ["7 Brew", "Private", "n/a", "n/a", "n/a", "Most direct drive-thru competitor"] },
  ]
));
children.push(
  p("Peer figures are approximate (August 2026). At ~24x forward EV/EBITDA, BROS now trades in line with Chipotle — a mature 10–12% grower — while compounding revenue at 25%+ with comparable restaurant-level margins. The market has stopped paying the CAVA/WING-tier growth premium pending traffic confirmation; if transaction comps stabilize, that gap is the re-rating opportunity.")
);

// ---- 9. TECHNICAL SETUP
children.push(h1("9. TECHNICAL SETUP"));
children.push(
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
    children: [
      new ImageRun({
        type: "png",
        data: fs.readFileSync("bros_chart.png"),
        transformation: { width: 624, height: 293 },
      }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text: "$BROS Daily Chart — SMA 20/50/200 | Source: Finviz.com | August 10, 2026", font: FONT, size: 18, italics: true, color: "595959" })],
  })
);
children.push(kv([
  ["Current Price", "$51.29 (Aug 10, 2026 close)"],
  ["52-Week Range", "$44.58 – $74.65"],
  ["20-Day SMA", "$63.28 — price far below (post-gap)"],
  ["50-Day SMA", "$64.21 — price far below"],
  ["200-Day SMA", "$57.24 — price below (bearish for multiple expansion)"],
  ["RSI (14-day)", "~20 — deeply oversold"],
  ["Implied Volatility", "~45–55% est. (elevated post-earnings; verify live)"],
  ["Key Support", "$50–51 (current base), then $44.58 (52-week low)"],
  ["Key Resistance", "$57–58 (200-day SMA / gap edge), $63–65 (20/50-day SMAs, gap fill)"],
]));
children.push(
  p("The Aug 6 earnings gap ($65.60 → $53.60 on ~2.5x volume) broke the stock below all three moving averages and left a large overhead gap. RSI ~20 is at levels that historically precede relief bounces, but gap-down-on-volume patterns typically need weeks of base-building; expect sellers into $57–58. For accumulation this is favorable: oversold tape, defined support at $50 and $44.58, and elevated IV that pays put sellers well at exactly the strikes an accumulator wants.")
);

// ---- 10. OPTIONS STRATEGY
children.push(h1("10. OPTIONS STRATEGY RECOMMENDATION"));
children.push(
  p("For Ed as a current long-equity holder with an ACCUMULATE rating: the stock is below DCF base with elevated post-earnings IV — the selection guide points to cash-secured puts as the primary structure (income plus a better entry), with covered calls only on bounces into resistance.")
);
children.push(table(
  [2200, 2100, 1200, 1900, 1960],
  [
    { cells: ["Strategy", "Structure", "Expiry", "Est. Premium", "Max Gain / Max Loss"] },
    { cells: ["Cash-Secured Put (primary — accumulate)", "Sell $47.5 Put", "6–8 wks", "~$1.60–$2.20/sh (~3.4–4.6% per cycle)", "Keep premium if >$47.5 / ~$4,530 per contract if BROS → $0; effective entry ~$45.50–46"] },
    { cells: ["CSP Ladder (aggressive add)", "Sell $45 Put", "8–10 wks", "~$1.20–$1.70/sh (~2.7–3.8% per cycle)", "Keep premium if >$45 / ~$4,330 per contract at max; assignment near 52-wk low"] },
    { cells: ["Covered Call (on bounces only)", "Sell $57.5–$60 Call", "6–8 wks", "~$1.30–$1.90/sh (~2.5–3.5% per cycle)", "Premium + upside to strike / shares called away above strike"] },
  ]
));
children.push(
  p("Rationale: the $47.5 strike sits between DCF base ($58.77) and bear ($25.91), converts the accumulation plan into paid limit orders, and monetizes post-earnings IV. Write covered calls only if the stock bounces toward $57–58 — writing them at $51 caps the recovery the thesis depends on. All yields stated are per-cycle, NOT annualized (a ~4% per-cycle CSP yield annualizes to roughly 25–35%). Premiums are estimates against ~45–55% IV — verify live quotes before trading.")
);
children.push(
  p("Size positions so the bear-case outcome does not cause unacceptable portfolio loss: compute max loss in dollars first — each $47.5 CSP contract carries ~$4,530 of max risk, and the bear-case DCF of $25.91 implies ~45% marks against assigned shares.", { run: { bold: true } })
);

// ---- 11. VERDICT
children.push(h1("11. VERDICT & MONITORING PLAN"));
children.push(boldPara("Overall Verdict: ACCUMULATE (staged) — upgraded from HOLD / ACCUMULATE ON PULLBACK"));
children.push(
  p("The business earned an upgrade the honest way: a beat-and-raise quarter (revenue +32.5%, both guidance lines up, 30.6% contribution margins, 1,225 shops with ~90% of the 2029 pipeline secured) met an 18% price cut. The June memo said the pullback level to buy was 'at or below $47' against a base case that, corrected for the prior memo's math error, is actually $58.77. At $51.29 the stock is 13% below base-case intrinsic value for the first time in this coverage.")
);
children.push(
  p("The reason not to buy the full position at once is the same reason the stock is cheap: transaction growth of +1.7% is one bad quarter from zero, pricing support rolls off in H2, and margins are bleeding 50–80bps YoY. If traffic goes negative, the bear case ($25.91) is the operative scenario and $51 will not be the low. The Q2 tape demonstrated the market prices that risk instantly.")
);
children.push(
  p("Action plan: (1) Hold existing shares. (2) Add the first tranche in the $48–52 zone (current level qualifies). (3) Sell $47.5 CSPs, 6–8 weeks out, as the second tranche — paid to wait at an effective ~$46 entry. (4) Reserve the final tranche for either $44–45 (52-week low retest) or a confirmed traffic re-acceleration print in Q3. (5) Write covered calls only on bounces into $57.5–60. (6) Full re-score if a secondary offering funds Salad and Go or if insider selling turns discretionary.")
);
children.push(table(
  [3600, 5760],
  [
    { cells: ["Monitoring Metric", "Threshold"] },
    { cells: ["System transaction growth (PRIMARY)", "Target: >2%; Alert: ≤0% — thesis break, halt accumulation"] },
    { cells: ["Q3 2026 systemwide SSS", "Target: ≥4% (within guide); Alert: <3%"] },
    { cells: ["Co-op contribution margin", "Target: ≥30%; Alert: <28% (2 consecutive quarters)"] },
    { cells: ["Adj. EBITDA margin trend", "Alert: third consecutive quarter of YoY decline"] },
    { cells: ["Salad and Go close + conversion capex", "Watch Q3 8-K for final count/price and any financing; equity raise = re-score"] },
    { cells: ["FY26 openings pace", "Target: ≥185; Alert: >10% miss"] },
    { cells: ["7 Brew overlap", "Any call language on pricing response in overlapping markets"] },
    { cells: ["Technical", "Close above $57.5–58 on volume = trend repair; close below $44.58 = bear confirmation"] },
  ]
));
children.push(
  p("Catalysts to upgrade to BUY (full position): Q3 transaction comp ≥3% with margins held, or price ≤$45 with traffic merely stable. Catalysts to downgrade to HOLD/SELL: negative transaction comp, contribution margin <28%, or a dilutive raise to fund the acquisition pipeline.")
);
children.push(h2("SOURCES"));
children.push(...bullets([
  "Dutch Bros Q2 2026 Earnings Press Release, 8-K (Businesswire, Aug 5, 2026) — revenue, SSS, margins, guidance",
  "Dutch Bros Q2 2026 10-Q balance sheet data (cash $268.6M, LT debt $194.6M, June 30, 2026)",
  "QSR Magazine / NRN / Daily Coffee News — Salad and Go $105M / 65-site acquisition (Aug 6, 2026)",
  "Investing.com / ts2.tech — Q2 2026 slides and earnings-call coverage; post-earnings price action",
  "stockanalysis.com (Aug 10, 2026 close), Finviz (chart, SMAs), stockinvest.us (RSI)",
  "SEC Form 4 filings via StockTitan — DM Trust/DM Individual Aggregator sales (Jun 2026); LegalClarity — ownership/voting structure",
  "Prior analysis: BROS_Investment_Memo.docx (June 5, 2026); $BROS_Investment_Model_2026-08-10.xlsx (authoritative for all DCF figures)",
  "This memo is for informational purposes only and does not constitute financial advice.",
]));

// ---------------- document ----------------
const doc = new Document({
  numbering: {
    config: [{
      reference: "bullet-list",
      levels: [{
        level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: convertInchesToTwip(0.35), hanging: convertInchesToTwip(0.2) } } },
      }],
    }],
  },
  styles: { default: { document: { run: { font: FONT, size: 24 } } } },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "CONFIDENTIAL — INVESTMENT MEMO", font: FONT, size: 16, color: "808080" })],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16, color: "808080" })],
        })],
      }),
    },
    children,
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync("$BROS_Investment_Memo_2026-08-10.docx", buf);
  console.log("saved $BROS_Investment_Memo_2026-08-10.docx", buf.length, "bytes");
});
