// $FSLY Investment Memo — Q2 2026 quarterly update (2026-08-11)
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, HeadingLevel, AlignmentType, ShadingType, BorderStyle,
  Header, Footer, PageNumber, ImageRun, LevelFormat, convertInchesToTwip,
} = require("docx");

const NAVY = "1F4E79";
const FONT = "Arial";
const BODY = 24; // 12pt in half-points

const run = (text, opts = {}) => new TextRun({ text, font: FONT, size: BODY, ...opts });

const p = (children, opts = {}) =>
  new Paragraph({ children: Array.isArray(children) ? children : [run(children)], spacing: { after: 160 }, ...opts });

const h1 = (text, first = false) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    pageBreakBefore: !first,
    spacing: { before: first ? 0 : 240, after: 200 },
    children: [new TextRun({ text, font: FONT, size: 28, bold: true, color: NAVY })],
  });

const h2 = (text) =>
  new Paragraph({
    spacing: { before: 160, after: 100 },
    children: [new TextRun({ text, font: FONT, size: BODY, bold: true, color: NAVY })],
  });

const cell = (text, { width, bold = false, shade = null, align = AlignmentType.LEFT, size = 20 } = {}) =>
  new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: shade ? { type: ShadingType.CLEAR, fill: shade } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [new Paragraph({ alignment: align, children: [new TextRun({ text, font: FONT, size, bold })] })],
  });

const TOTAL = 9360;

function statsTable(rows) {
  const w = [3600, 5760];
  return new Table({
    width: { size: TOTAL, type: WidthType.DXA },
    columnWidths: w,
    rows: rows.map(([k, v], i) =>
      new TableRow({
        children: [
          cell(k, { width: w[0], bold: true, shade: i % 2 ? null : "F2F2F2" }),
          cell(v, { width: w[1], shade: i % 2 ? null : "F2F2F2" }),
        ],
      })
    ),
  });
}

// ---------------- Section 1 scenario table ----------------
const sw = [1200, 2800, 1900, 1600, 1860];
const scenarioTable = new Table({
  width: { size: TOTAL, type: WidthType.DXA },
  columnWidths: sw,
  rows: [
    new TableRow({
      tableHeader: true,
      children: ["Scenario", "Key Drivers", "Revenue × Multiple", "Implied Price", "vs. Current"].map((t, i) =>
        cell(t, { width: sw[i], bold: true, shade: "D9E2F3" })
      ),
    }),
    new TableRow({
      children: [
        cell("🐻 Bear Case", { width: sw[0], bold: true, shade: "FFC7CE" }),
        cell("Security decelerates, commodity-CDN price pressure reasserts, a top-10 usage shock returns growth to single digits. Sequential RPO decline proves to be the tell.", { width: sw[1], shade: "FFC7CE" }),
        cell("$805M FY27E × 3.0x ≈ $2.4B EV", { width: sw[2], shade: "FFC7CE" }),
        cell("$13–14", { width: sw[3], shade: "FFC7CE" }),
        cell("▼ ~51%", { width: sw[4], shade: "FFC7CE" }),
      ],
    }),
    new TableRow({
      children: [
        cell("⚖️ Base Case", { width: sw[0], bold: true, shade: "FFEB9C" }),
        cell("Growth moderates to ~14% as H2 guidance conservatism proves roughly right; margins keep expanding but the multiple normalizes once squeeze fuel is spent.", { width: sw[1], shade: "FFEB9C" }),
        cell("$842M FY27E × 4.5–5.0x ≈ $3.8–4.2B EV", { width: sw[2], shade: "FFEB9C" }),
        cell("$21–23", { width: sw[3], shade: "FFEB9C" }),
        cell("▼ ~15–24%", { width: sw[4], shade: "FFEB9C" }),
      ],
    }),
    new TableRow({
      children: [
        cell("🐂 Bull Case", { width: sw[0], bold: true, shade: "C6EFCE" }),
        cell("20% growth proves durable, Rule of 40 holds, Security/Compute mix keeps lifting margins, and the market sustains a premium-infrastructure multiple.", { width: sw[1], shade: "C6EFCE" }),
        cell("$887M FY27E × 7.0x ≈ $6.2B EV", { width: sw[2], shade: "C6EFCE" }),
        cell("$34–35", { width: sw[3], shade: "C6EFCE" }),
        cell("▲ ~24%", { width: sw[4], shade: "C6EFCE" }),
      ],
    }),
  ],
});

// ---------------- Section 3 leadership table ----------------
const lw = [3200, 1200, 4960];
const leadershipTable = new Table({
  width: { size: TOTAL, type: WidthType.DXA },
  columnWidths: lw,
  rows: [
    new TableRow({
      tableHeader: true,
      children: ["Criterion", "Score", "Evidence"].map((t, i) => cell(t, { width: lw[i], bold: true, shade: "D9E2F3" })),
    }),
    ...[
      ["Execution track record", "10/10", "Two consecutive beat-and-raise quarters under the new team; FY26 non-GAAP op income guidance raised 46% at midpoint ($63M → $92M) on Aug 5, 2026."],
      ["Founder / tenure / skin in game", "5/10", "Hired CEO with 14-month tenure; founder no longer in an executive seat; insider ownership 6.21% (modest)."],
      ["Capital allocation", "5/10", "Converts managed without crisis and no dilutive M&A, but diluted share count reached 180.3M and a new universal shelf registration was filed into the Aug 10 rally."],
      ["Insider activity (Form 4)", "5/10", "Routine plan/tax-withholding sells only (CEO sold 14,868 shares Aug 2026; CTO tax sells; director 10b5-1 sale); zero open-market buys in the last 12 months."],
      ["Governance & alignment", "5/10", "Orderly succession, but the CEO, CFO, and principal accounting officer all changed within ~14 months; institutional ownership 86%."],
      ["Composite", "30/50", "Neutral (25–39) — leadership is not a differentiator in either direction; execution is the standout, turnover and dilution the offsets."],
    ].map((r, i) =>
      new TableRow({
        children: r.map((t, j) => cell(t, { width: lw[j], bold: i === 5 || j === 0, shade: i === 5 ? "FFEB9C" : null })),
      })
    ),
  ],
});

// ---------------- Section 6 DCF table ----------------
const dw = [2960, 2130, 2130, 2140];
const dcfRows = [
  ["Discount Rate (single WACC)", "11%", "11%", "11%"],
  ["Terminal Growth", "4.5%", "3.5%", "3.0%"],
  ["Yr2 Revenue Growth", "20%", "14%", "9%"],
  ["Yr3 Revenue Growth", "18%", "13%", "7%"],
  ["Yr4 Revenue Growth", "16%", "12%", "6%"],
  ["Yr5 Revenue Growth", "14%", "11%", "5%"],
  ["Terminal FCF Margin", "27%", "20%", "13%"],
  ["Implied EV", "$4.24B", "$2.40B", "$1.24B"],
  ["+ Net Cash", "$13.5M", "$13.5M", "$13.5M"],
  ["Equity Value", "$4.25B", "$2.41B", "$1.25B"],
  ["Intrinsic Price/Share", "$23.59", "$13.37", "$6.93"],
  ["Current Price", "$27.75", "$27.75", "$27.75"],
  ["Premium/(Discount) to Intrinsic", "+18%", "+108%", "+300%"],
];
const dcfTable = new Table({
  width: { size: TOTAL, type: WidthType.DXA },
  columnWidths: dw,
  rows: [
    new TableRow({
      tableHeader: true,
      children: ["Metric", "Bull Case", "Base Case", "Bear Case"].map((t, i) => cell(t, { width: dw[i], bold: true, shade: "D9E2F3" })),
    }),
    ...dcfRows.map((r, i) =>
      new TableRow({
        children: r.map((t, j) =>
          cell(t, { width: dw[j], bold: i === 10 || j === 0, shade: i === 10 ? "FFEB9C" : i % 2 ? "F2F2F2" : null })
        ),
      })
    ),
  ],
});

// ---------------- Section 7 Ro40 trend table ----------------
const rw = [3900, 1820, 1820, 1820];
const ro40Table = new Table({
  width: { size: TOTAL, type: WidthType.DXA },
  columnWidths: rw,
  rows: [
    new TableRow({
      tableHeader: true,
      children: ["Period (adj. EBITDA basis)", "Growth %", "Margin %", "Rule of 40"].map((t, i) => cell(t, { width: rw[i], bold: true, shade: "D9E2F3" })),
    }),
    ...[
      ["FY2025", "14.8%", "12.4%", "27.2"],
      ["Q1 2026", "20.0%", "17.0%", "37.0"],
      ["Q2 2026 — first cross above 40", "23.0%", "20.8%", "43.8"],
      ["FY2026 guided (non-GAAP op basis)", "18.4%", "12.4%", "30.8"],
    ].map((r, i) =>
      new TableRow({
        children: r.map((t, j) => cell(t, { width: rw[j], bold: i === 2, shade: i === 2 ? "C6EFCE" : i % 2 ? "F2F2F2" : null })),
      })
    ),
  ],
});

// ---------------- Section 8 peer table ----------------
const pw = [2100, 900, 1500, 1400, 1300, 1200, 960];
const peerRows = [
  ["Fastly", "FSLY", "18%", "8%", "26", "6.0x", "Subject"],
  ["Cloudflare", "NET", "29%", "12%", "41", "26x", "Premium"],
  ["Akamai", "AKAM", "6%", "22%", "28", "4.3x", "Mature"],
  ["Datadog", "DDOG", "23%", "26%", "49", "13x", "High R40"],
  ["Cloudflare-tier avg", "—", "29%", "12%", "41", "26x", "Hypergrowth"],
  ["CDN/infra avg", "—", "10%", "18%", "28", "4.0x", "Mature infra"],
  ["Limelight/Edgio", "—", "n/a", "n/a", "n/a", "n/a", "Went to zero"],
];
const peerTable = new Table({
  width: { size: TOTAL, type: WidthType.DXA },
  columnWidths: pw,
  rows: [
    new TableRow({
      tableHeader: true,
      children: ["Company", "Ticker", "Fwd Growth", "FCF Margin", "Rule of 40", "Fwd EV/Sales", "Note"].map((t, i) =>
        cell(t, { width: pw[i], bold: true, shade: "D9E2F3" })
      ),
    }),
    ...peerRows.map((r, i) =>
      new TableRow({
        children: r.map((t, j) => cell(t, { width: pw[j], bold: i === 0, shade: i === 0 ? "FFEB9C" : null })),
      })
    ),
  ],
});

// ---------------- Section 9 chart + technical table ----------------
const chartBuf = fs.readFileSync("fsly_chart.png");
const chartPara = new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 60 },
  children: [new ImageRun({ type: "png", data: chartBuf, transformation: { width: 624, height: 293 } })],
});
const chartCaption = new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 200 },
  children: [new TextRun({ text: "FSLY Daily Chart — SMA 20/50/200 | Source: Finviz.com | August 11, 2026", font: FONT, size: 18, italics: true })],
});

const techTable = statsTable([
  ["Current Price", "$27.75 (Aug 10 close; +20.9% on the day)"],
  ["52-Week Range", "$6.70 – $34.82"],
  ["20-Day SMA (est.)", "~$21.50"],
  ["50-Day SMA", "$19.83"],
  ["200-Day SMA", "$17.22 (price well above — uptrend intact)"],
  ["RSI (14)", "70.3 — overbought"],
  ["Short % of Float", "18.1% (25.5M shares)"],
  ["Implied Volatility", "Elevated post-spike — favors selling premium"],
]);

// ---------------- Build document ----------------
const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 360, hanging: 260 } } } }],
      },
    ],
  },
  styles: { default: { document: { run: { font: FONT, size: BODY } } } },
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({ alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: "CONFIDENTIAL — INVESTMENT MEMO", font: FONT, size: 16, color: "808080" })] })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({ alignment: AlignmentType.CENTER,
            children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16, color: "808080" })] })],
        }),
      },
      children: [
        // Title
        new Paragraph({ spacing: { after: 60 },
          children: [new TextRun({ text: "FSLY (Fastly, Inc.) — INVESTMENT MEMO", font: FONT, size: 36, bold: true, color: NAVY })] }),
        p([new TextRun({ text: "Date: August 11, 2026  |  Analyst: Ed  |  Rating: HOLD — Trim into strength; do not add  |  Vehicle: Long equity  |  Q2 2026 quarterly update (prior: June 8, 2026)", font: FONT, size: 20, italics: true, color: "555555" })]),

        // 1 — Investment Summary
        h1("1. Investment Summary", true),
        p("Fastly trades at $27.75 after a +20.9% single-day surge on August 10 — its highest level since early 2024 — on Q2 2026 results that beat across the board and a raised full-year outlook. Revenue grew 23% YoY to $183.3M, Security grew 43%, non-GAAP gross margin set another record at 65.8%, and the Rule of 40 was crossed for the first time (43.8 on an adjusted-EBITDA basis) — precisely the milestone the June memo called “the single most important fundamental milestone for a re-rating.” The re-rating happened. The problem is now the price: $27.75 sits 18% ABOVE the bull-case DCF of $23.59 and more than double the base case of $13.37."),
        scenarioTable,
        p([new TextRun({ text: "Revenue multiple approach reflects market pricing behavior. DCF intrinsic value analysis (bull $23.59 / base $13.37 / bear $6.93) is in Section 6.", font: FONT, size: 20, italics: true })], { spacing: { before: 100, after: 160 } }),
        p([run("Verdict: ", { bold: true }), run("HOLD — trim into strength. The inflection thesis played out faster than expected, but a 21% squeeze-assisted gap (18% short float) has pushed the quote past our most optimistic intrinsic path. Hold a core position, take partial profits into the $32–35 supply zone, harvest elevated IV with covered calls, and rebuild only on a substantial pullback.")]),

        // 2 — Business Snapshot
        h1("2. Business Snapshot"),
        p("Fastly operates a global edge cloud platform — content delivery, edge compute, and a fast-growing security suite (Next-Gen WAF, Bot Management, API Security) — differentiated by a software-programmable edge favored by performance-sensitive enterprises. After inflecting in late 2025, the model is now compounding: four consecutive quarters of accelerating growth, record gross margins, and a first-ever Rule of 40 cross in Q2 2026."),
        statsTable([
          ["Current Price", "$27.75 (Aug 10, 2026 close)"],
          ["Market Cap / Enterprise Value", "~$4.42B / ~$4.41B"],
          ["52-Week Range", "$6.70 – $34.82"],
          ["Q2 2026 Revenue", "$183.3M (+23% YoY) — Network $133.9M +17%, Security $41.7M +43%, Other $7.7M +69%"],
          ["Non-GAAP Gross Margin", "65.8% (record; 59.0% PY)"],
          ["Non-GAAP Operating Margin", "14.7% ($27.0M)  |  Adj. EBITDA margin 20.8% ($38.1M)"],
          ["FCF Margin", "2.0% ($3.6M — capex-heavy quarter; OCF $39.3M, capex $35.8M)"],
          ["Net Cash", "$13.5M ($337.5M cash & securities − $324.0M converts)"],
          ["Diluted Shares", "180.3M"],
          ["Rule of 40 Score", "43.8 (growth 23% + adj. EBITDA margin 20.8%) — first cross"],
          ["FY2026 Guided Revenue", "$732–746M (+18.4% at midpoint; raised Aug 5)"],
          ["FY2026 Guided Non-GAAP Op Income", "$88–96M (12.4% margin at midpoint; raised from $58–68M)"],
          ["Total RPO", "$341M (+38% YoY; down sequentially from $369M — watch item)"],
          ["LTM Net Retention Rate", "117% — highest in 3+ years (Q1: 113%)"],
          ["Top-10 Customer Concentration", "37% of revenue (vs. 31% PY)"],
        ]),

        // What Changed
        h1("What Changed Since June 8 (Retrospective Signal Check)"),
        p([run("Trigger. ", { bold: true }), run("FY2026 non-GAAP operating income guidance was raised from $58–68M to $88–96M — a +370bps margin revision at the midpoint, well past the ±200bps material-change threshold. (The revenue raise, +3.0% at midpoint, was below the ±5% threshold on its own.) The stock responded with a +20.9% day on August 10, closing 38% above the June 8 analysis price of $20.09.")]),
        p([run("What actually changed. ", { bold: true }), run("Three things: the Rule of 40 crossed (43.8 EBITDA-basis vs. 37.0 in Q1), the margin guide re-based materially higher — with the new CFO explicitly noting Fastly's CPU-based (not GPU-based) infrastructure supports structurally strong gross margins — and market mechanics amplified the move: 18.1% of the float was short into the print. Fastly also filed a universal shelf registration into the rally and RPO declined sequentially ($369M → $341M), both worth watching.")]),
        p([run("Could we have seen it coming? ", { bold: true }), run("Directionally, yes — the June memo explicitly predicted a re-rating on a Rule of 40 cross and identified the leading indicators (RPO +63%, NRR climbing, Security compounding at 47%). The process miss was the accumulation zone: $13–17 was anchored to the base-case DCF, and the market never offered it — the stock bottomed near $18–19 (200-day SMA) between the analyses. For inflecting names where leading indicators are confirming the bull path, a purely intrinsic-value accumulation zone can be unreachable; staged adds at technical support deserve a place in the plan. Logged to _Analysis_Patterns as a candidate pattern (Rule-of-40 crossing re-rate)."),]),
        p([run("Peer check. ", { bold: true }), run("Neither Akamai nor Cloudflare printed a comparable single-quarter inflection this cycle; this was company-specific execution plus squeeze mechanics, not a sector-wide CDN re-rating.")]),

        // 3 — Management & Governance
        h1("3. Management & Governance"),
        p("Fastly is run by a nearly all-new team. CEO Kip Compton (hired June 2025, promoted from Chief Product Officer; previously SVP at Cisco) replaced Todd Nightingale; CFO Richard Wong (August 2025) was the first CFO at both Benchling and Houzz and a VP of Finance at LinkedIn. Scott Lovett was elevated to President of Go-to-Market, and the principal accounting officer role also turned over — meaning the entire finance and executive leadership is on roughly a one-year tenure."),
        statsTable([
          ["CEO", "Kip Compton (hired, since June 2025; internal promotion from CPO; ex-Cisco SVP)"],
          ["CFO", "Richard Wong (since Aug 2025; ex-Benchling, Houzz first CFO; LinkedIn VP Finance)"],
          ["Insider Ownership", "6.21%"],
          ["Recent Insider Activity", "Net sells, all routine plan/tax-related; no open-market buys (last 12 mo)"],
          ["Institutional Ownership", "86.45%"],
          ["Notable", "Universal shelf registration filed Aug 2026 (financing flexibility / dilution overhang)"],
        ]),
        p("Scored rubric (0/5/10 per criterion; evidence required):", { spacing: { before: 120, after: 80 } }),
        leadershipTable,
        p([run("Read-through: ", { bold: true }), run("30/50 — Neutral. The new team's execution is the single best argument for the bull case: two beat-and-raise quarters and a 46% upward revision to the FY26 operating-income guide in 14 months. But nobody in the C-suite has meaningful skin in the game yet, insiders are only sellers (routine ones), and the shelf filed into the rally is a reminder that this management will take cheap capital when offered — at existing holders' expense. Leadership neither adds to nor subtracts from the thesis; the valuation does the talking.")], { spacing: { before: 120 } }),

        // 4 — Bull Case
        h1("4. Bull Case"),
        h2("The Rule of 40 is crossed and the flywheel is compounding"),
        p("Q2 posted 23% growth with a 20.8% adjusted-EBITDA margin — a 43.8 Rule of 40 score, the first above-40 print in company history, up from 27.2 in FY2025 and 37.0 in Q1. Four consecutive quarters of accelerating revenue growth (12% → record Q3 → 23% Q4 → 20% Q1 → 23% Q2) with record 65.8% non-GAAP gross margin is exactly what a durable platform inflection looks like."),
        h2("Security and Compute are transforming the mix"),
        p("Security grew 43% YoY to $41.7M (23% of revenue) and Other — Compute and Observability — grew 69%. These products are higher-margin, stickier, and less usage-volatile than CDN, and they are pulling the whole model upmarket: NRR of 117% is the highest in over three years, and RPO is up 38% YoY."),
        h2("The margin guide re-based, and the cost structure is AI-capex-light"),
        p("Management raised FY26 non-GAAP operating income guidance 46% at the midpoint ($63M → $92M) just six months into the year. CFO Richard Wong's point that Fastly's delivery and security run on CPUs — not GPUs — matters: Fastly gets AI-driven traffic demand (AI traffic management, bot monetization via Content Guard, the LALIGA anti-piracy win, a C++ SDK aimed at enterprise compute) without the GPU capex arms race crushing its free cash flow."),
        h2("Squeeze mechanics can persist"),
        p("Even after the pop, 18.1% of the float remains short. If Q3 delivers another beat-and-raise, the path to the $32–35 prior-high zone is short — covered-call strikes there are not fantasy."),

        // 5 — Bear Case
        h1("5. Bear Case"),
        h2("The price now exceeds the bull-case intrinsic value"),
        p("At $27.75, the stock trades 18% above our bull-case DCF of $23.59 — a scenario that already assumes five years of 14–20% growth and a march to 27% terminal FCF margins at an 11% discount rate. The market is paying for more than our most optimistic modeled path; every incremental dollar of return from here requires either multiple expansion beyond 7x forward sales or assumptions we are not willing to underwrite."),
        h2("The quarter had cracks the tape ignored"),
        p("RPO declined sequentially, from $369M to $341M — bookings ran lighter than revenue burn in the quarter. Implied H2 guidance decelerates to ~16% growth from 23%. And free cash flow remains thin: $3.6M in Q2 and roughly $7.8M for H1, versus $45.8M in all of FY2025, as an elevated capex cycle absorbs the operating-income beat."),
        h2("Concentration is rising in a usage-based model"),
        p("Top-10 customers are now 37% of revenue, up from 31% a year ago. Fastly's 2021 guidance shock came from exactly this exposure — a single large customer's traffic shift. The re-acceleration narrative rests on a customer base that is getting more, not less, concentrated."),
        h2("Dilution machinery is warming up"),
        p("Diluted share count reached 180.3M (from 176.5M two quarters ago), and management filed a universal shelf registration into the August 10 rally. The $324M convert against $337.5M of cash leaves near-zero net cash — any large capital need gets funded with paper. Some of the +21% day was covering, not conviction: 25.5M shares were short, and RSI at 70 says the easy money has been made."),

        // 6 — DCF Valuation
        h1("6. DCF Valuation"),
        p("Five-year free-cash-flow projection with a Gordon Growth terminal value, built from the raised FY2026 revenue guidance midpoint ($739M) as the Year-1 base, discounted at a single 11% WACC across all scenarios (per project methodology; only growth, margin ramp, and terminal growth differ). Versus June: base-case growth nudged up ~1pt/yr on NRR and RPO strength, terminal margins up 1pt on the margin guide, and diluted shares updated from 165M to 180.3M for dilution realism."),
        dcfTable,
        p([run("Interpretation: ", { bold: true }), run("the current price exceeds the bull case by 18% — the market is pricing a scenario beyond our bull case, requiring 20%+ growth to persist beyond 2027 and FCF margins to clear 27%, or a durable premium multiple on top of full execution. In June the stock sat between base and bull; today it sits above bull. That is the entire investment decision: the fundamentals improved meaningfully, and the price improved faster than the fundamentals.")], { spacing: { before: 120 } }),

        // 7 — Rule of 40
        h1("7. Rule of 40 Analysis"),
        p("Rule of 40 sums revenue growth and a profitability margin; above 40 is healthy for a software business."),
        ro40Table,
        p([run("The trend is the story: 27.2 → 37.0 → 43.8 in three prints. ", { bold: true }), run("Forward, the FY26 guided figure (30.8 on an operating-income basis) is the conservative floor — guidance uses non-GAAP op margin, not EBITDA, and assumes H2 deceleration. Bull case for the next twelve months: ~20% growth + ~22% EBITDA margin ≈ 42, holding above the line. Base: ~15% + ~20% ≈ 35. Bear: ~9% + ~16% ≈ 25. Staying above 40 on the EBITDA basis is the metric that keeps the re-rated multiple; the first quarter back below it likely unwinds a chunk of the August move.")], { spacing: { before: 120 } }),

        // 8 — Peer Comparables
        h1("8. Peer Comparables"),
        peerTable,
        p([run("In June, Fastly traded at ~4.4x forward sales — in line with mature Akamai despite 3x the growth. That anomaly closed: at ~6.0x, Fastly now carries a premium to the mature-infra tier that its Rule of 40 cross arguably earns, while remaining far below Cloudflare's ~26x. The relative-value argument that made HOLD comfortable at $20 is spent; from here the multiple needs the growth to keep showing up.")], { spacing: { before: 120 } }),

        // 9 — Technical Setup
        h1("9. Technical Setup"),
        chartPara,
        chartCaption,
        techTable,
        p([run("The structure flipped from range to uptrend: price gapped from $22.45 to $27.75 on 6x volume and now sits above all three SMAs, with the rising 200-day at $17.22 far below. Resistance is the May supply zone at $32.36–34.82 (52-week high); first support is the gap fill near $22.50–23.00, then the 50-day at $19.83. RSI at 70 is overbought — chasing here buys someone else's squeeze. Elevated post-event IV makes selling premium against the position unusually well paid.")], { spacing: { before: 120 } }),

        // 10 — Options Strategy
        h1("10. Options Overlay (Optional — position is long equity)"),
        p("With the price above bull-case DCF, RSI overbought, and IV elevated after the spike, the overlay writes itself: monetize the strength rather than pay for more of it. Primary action is on the shares (Section 11); these structures are optional income/protection on the portion retained."),
        h2("Covered Call — primary income"),
        p("Sell the ~$32 call, 45–60 DTE (Sep/Oct 2026), 1 contract per 100 shares retained. Est. premium ~$1.30–1.60/share. Max gain: premium plus ~$4.25 appreciation to the strike (~$560–585/contract). Rationale: $32 sits at the bottom of the May supply zone and ~36% above bull-case DCF — upside surrendered only where the odds are already against continuation. ~5% per-cycle yield."),
        h2("Collar — protect the gap gain"),
        p("Sell the $32 call and buy the ~$22 put, ~60 DTE, for approximately net-zero cost. Floors the position near the gap-fill level while financing the protection. The right structure if trimming feels premature but giving back a +38% two-month move is unacceptable."),
        h2("Cash-Secured Put — re-entry"),
        p("Sell the ~$20 put, ~45 DTE, est. ~$0.55–0.75/share premium ($2,000 cash secured per contract). Assigns at a ~$19.35 net basis near the 50-day SMA if the gap fully fades. Note honestly: $19.35 is still 45% above base-case DCF ($13.37) — this re-accumulates at technical support, not intrinsic value, so size it modestly."),
        p([run("Size positions so the bear-case outcome (~$7 intrinsic) does not cause unacceptable portfolio loss.", { italics: true })]),

        // 11 — Verdict
        h1("11. Verdict"),
        p([run("Rating: HOLD — Trim into strength; do not add at current levels.", { bold: true })]),
        p("The business has done everything the June thesis asked of it, faster than expected: 23% growth, a 43.8 Rule of 40 on its first cross, record 65.8% gross margin, NRR at a three-year high of 117%, and a 46% upward revision to the full-year operating-income guide. This is a genuine platform inflection led by a Security segment compounding at 43% — the fundamental story is intact and improving."),
        p("But the market paid for it all at once. At $27.75 the stock trades 18% above the bull-case DCF of $23.59, 108% above base ($13.37), and at 6.0x forward sales — with an 18% short float and a +21% gap day doing part of the work. In June the price sat between base and bull and HOLD meant “don't chase, accumulate on weakness.” Today the price sits above bull, which converts the same rating into its mirror image: hold the core, but harvest."),
        p("Action: trim 25–40% of the position into the $30–35 zone (scaling near May's $32.36–34.82 supply), and run covered calls at the $32 strike on shares retained to be paid for that resistance. Do not add above ~$23 (bull DCF). Re-entry plan, learned from this cycle's miss: staged adds at technical support $19–20 (50-day) if leading indicators (NRR, RPO, Security growth) remain confirming — not just at the $13–17 intrinsic zone. Watch Q3 for the RPO trajectory and the first sign of the Rule of 40 slipping back below 40; either unwinds the re-rating case."),
        p([new TextRun({ text: "Sources: Fastly Q2 2026 Earnings Press Release (8-K, August 5, 2026); Fastly Q2 2026 results via investors.fastly.com; price/technical data from stockanalysis.com (August 11, 2026); insider activity from SEC Form 4 filings via StockTitan (2026); CFO commentary via Seeking Alpha (August 10, 2026); prior analysis June 8, 2026 (FSLY_Investment_Memo.docx). This memo is for informational purposes only and does not constitute financial advice.", font: FONT, size: 18, italics: true, color: "555555" })]),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync("FSLY_Investment_Memo_2026-08-11.docx", buf);
  console.log("saved", buf.length);
});
