"use strict";
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, WidthType, ShadingType,
  BorderStyle, HeadingLevel, PageNumber, PageBreak, VerticalAlign
} = require("/tmp/npm-global/lib/node_modules/docx/dist/index.cjs");
const fs = require("fs");

const CONTENT_WIDTH = 9360;

function bold(text, opts = {}) {
  return new TextRun({ text, font: "Arial", size: 24, bold: true, ...opts });
}

function run(text, opts = {}) {
  return new TextRun({ text, font: "Arial", size: 24, ...opts });
}

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 280, after: 140 },
    children: [new TextRun({ text, font: "Arial", size: 32, bold: true, color: "1F3864" })],
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, font: "Arial", size: 28, bold: true, color: "2E75B6" })],
  });
}

function para(children, opts = {}) {
  return new Paragraph({ spacing: { after: 120 }, children, ...opts });
}

function bullet(children) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 80 },
    children: Array.isArray(children) ? children : [run(children)],
  });
}

function divider() {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 1 } },
    spacing: { before: 80, after: 80 },
    children: [],
  });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" };
const allBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

function headerCell(text, width, shade) {
  shade = shade || "1F3864";
  return new TableCell({
    borders: allBorders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: shade, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text, font: "Arial", size: 22, bold: true, color: "FFFFFF" })],
    })],
  });
}

function dataCell(text, width, shade, isBold, align, color) {
  shade = shade || "FFFFFF";
  isBold = isBold || false;
  align = align || AlignmentType.LEFT;
  color = color || "000000";
  return new TableCell({
    borders: allBorders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: shade, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      alignment: align,
      children: [new TextRun({ text, font: "Arial", size: 22, bold: isBold, color })],
    })],
  });
}

function buildDcfTable() {
  const col0 = 2720, col1 = 2213, col2 = 2213, col3 = 2214;

  const rows = [
    ["Discount Rate", "10%", "11%", "12%"],
    ["Terminal Growth", "4%", "3.5%", "3%"],
    ["FY2027 Rev Growth", "22%", "20%", "15%"],
    ["FY2028 Rev Growth", "20%", "18%", "12%"],
    ["FY2029 Rev Growth", "18%", "15%", "10%"],
    ["FY2030 Rev Growth", "16%", "12%", "8%"],
    ["FY2026 FCF Margin", "37%", "35%", "32%"],
    ["Terminal FCF Margin", "42%", "40%", "35%"],
    ["Implied EV ($B)", "$189.1B", "$130.0B", "$82.1B"],
    ["+ Net Cash", "$3.7B", "$3.7B", "$3.7B"],
    ["Equity Value ($B)", "$192.8B", "$133.7B", "$85.8B"],
    ["Intrinsic Price/Share", "$185.38", "$128.46", "$82.50"],
    ["Current Price", "$119.29", "$119.29", "$119.29"],
    ["Premium/(Discount)", "(36% discount)", "(7% discount)", "(45% premium)"],
  ];

  const boldRows = new Set([11, 13]);

  const tableRows = [
    new TableRow({
      tableHeader: true,
      children: [
        headerCell("Metric", col0),
        headerCell("Bull Case", col1, "166666"),
        headerCell("Base Case", col2, "1F5C8B"),
        headerCell("Bear Case", col3, "7B2D2D"),
      ],
    }),
    ...rows.map(function(r, i) {
      const shade = i % 2 === 0 ? "F5F8FC" : "FFFFFF";
      const isBold = boldRows.has(i);
      const isHighlight = i === 11;
      const textColor = isHighlight ? "1F3864" : "000000";
      return new TableRow({
        children: [
          dataCell(r[0], col0, shade, isBold, AlignmentType.LEFT, textColor),
          dataCell(r[1], col1, shade, isBold, AlignmentType.CENTER, textColor),
          dataCell(r[2], col2, shade, isBold, AlignmentType.CENTER, textColor),
          dataCell(r[3], col3, shade, isBold, AlignmentType.CENTER, textColor),
        ],
      });
    }),
  ];

  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: [col0, col1, col2, col3],
    rows: tableRows,
  });
}

function buildPeerCompsTable() {
  const w = 1560;
  const colWidths = [w, w, w, w, w, w];
  const hdr = ["Ticker", "Rev Growth", "FCF Margin", "Rule of 40", "EV / Sales", "EV / FCF"];
  const data = [
    ["NOW",  "22%", "35%", "57",  "7.5x",  "21.3x"],
    ["PLTR", "71%", "56%", "127", "46.5x", "82.7x"],
    ["CRM",  "9%",  "32%", "41",  "6.5x",  "20x"],
    ["SNOW", "23%", "18%", "41",  "10x",   "55x"],
    ["DDOG", "23%", "25%", "48",  "14x",   "56x"],
    ["CRWD", "20%", "28%", "48",  "20x",   "71x"],
    ["WDAY", "14%", "25%", "39",  "6x",    "24x"],
  ];

  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [
      new TableRow({
        tableHeader: true,
        children: hdr.map(function(h, i) { return headerCell(h, colWidths[i]); }),
      }),
      ...data.map(function(r, ri) {
        const shade = ri % 2 === 0 ? "F5F8FC" : "FFFFFF";
        const isNow = ri === 0;
        return new TableRow({
          children: r.map(function(cell, ci) {
            return dataCell(cell, colWidths[ci], isNow ? "EAF2FA" : shade, isNow, AlignmentType.CENTER, isNow ? "1F3864" : "000000");
          }),
        });
      }),
    ],
  });
}

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: "•",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
    ],
  },

  styles: {
    default: {
      document: { run: { font: "Arial", size: 24 } },
    },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: "1F3864" },
        paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 0 },
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: "2E75B6" },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 },
      },
    ],
  },

  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "2E75B6", space: 1 } },
            spacing: { after: 80 },
            children: [
              new TextRun({ text: "CONFIDENTIAL — INVESTMENT MEMO", font: "Arial", size: 18, bold: true, color: "7B2D2D" }),
            ],
          }),
        ],
      }),
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            border: { top: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC", space: 1 } },
            spacing: { before: 80 },
            children: [
              new TextRun({ text: "ServiceNow (NOW) Investment Memo | Ed | June 5, 2026  |  Page ", font: "Arial", size: 18, color: "666666" }),
              new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 18, color: "666666" }),
              new TextRun({ text: " of ", font: "Arial", size: 18, color: "666666" }),
              new TextRun({ children: [PageNumber.TOTAL_PAGES], font: "Arial", size: 18, color: "666666" }),
            ],
          }),
        ],
      }),
    },
    children: [
      // TITLE BLOCK
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 80, after: 60 },
        children: [new TextRun({ text: "SERVICENOW (NOW)", font: "Arial", size: 48, bold: true, color: "1F3864" })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 60 },
        children: [new TextRun({ text: "INVESTMENT MEMO", font: "Arial", size: 36, bold: true, color: "2E75B6" })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 40 },
        children: [
          run("Date: "), bold("June 5, 2026"),
          run("  |  Analyst: "), bold("Ed"),
          run("  |  Rating: "), bold("BUY / ACCUMULATE", { color: "1A6B2A" }),
        ],
      }),
      divider(),

      // SECTION 1: BUSINESS SNAPSHOT
      heading1("1. BUSINESS SNAPSHOT"),
      para([
        run("ServiceNow is the enterprise AI platform and workflow automation leader. It positions itself as the “AI control tower for business reinvention” — a single platform connecting intelligence to execution across IT, HR, Customer Service, Finance, Security, and Operations. The company serves 95%+ of the Fortune 500, with 85% of Fortune 500 companies as customers. "),
        bold("5-for-1 stock split effective December 17, 2025."),
      ]),
      para([bold("Q1 2026 Key Stats"), run(" (all figures post-split):")]),
      bullet([bold("Total Revenue: "), run("$3,770M (+22% YoY)")]),
      bullet([bold("Subscription Revenue: "), run("$3,671M (+22% YoY)")]),
      bullet([bold("Non-GAAP Gross Margin: "), run("79.5% (subscription: 81.5%)")]),
      bullet([bold("GAAP Operating Income: "), run("$503M (13.5% margin)")]),
      bullet([bold("Non-GAAP Operating Income: "), run("$1,199M (32% margin)")]),
      bullet([bold("Non-GAAP FCF: "), run("$1,665M (44% margin)")]),
      bullet([bold("cRPO: "), run("$12,640M (+22.5% YoY)")]),
      bullet([bold("Total RPO: "), run("$27,700M (+25% YoY)")]),
      bullet([bold("Cash + marketable securities: "), run("$5,182M; Long-term debt: $1,491M")]),
      bullet([bold("Net cash: "), run("$3,691M")]),
      bullet([bold("GAAP EPS: "), run("$0.45 diluted | Non-GAAP EPS: $0.97 diluted")]),
      bullet([bold("Rule of 40 Score: "), run("66 (22% growth + 44% FCF margin)")]),
      new Paragraph({ spacing: { before: 140, after: 60 }, children: [bold("FY2026 Guidance"), run(" (raised April 22, 2026):")] }),
      bullet([bold("Subscription Revenue: "), run("$15,735–$15,775M (+22–22.5% YoY)")]),
      bullet([bold("Non-GAAP Subscription Gross Margin: "), run("81.5%")]),
      bullet([bold("Non-GAAP Operating Margin: "), run("31.5%")]),
      bullet([bold("Non-GAAP FCF Margin: "), run("35% (headwind from Armis acquisition)")]),
      new Paragraph({ spacing: { before: 140, after: 80 }, children: [
        bold("Current Price: "), run("$119.29/share (June 5, 2026)  |  52-week range: $81.24 – $211.48"),
      ]}),
      para([bold("Market cap: "), run("~$124B  |  "), bold("Enterprise Value: "), run("~$120B")]),
      new Paragraph({
        spacing: { after: 120 },
        shading: { fill: "FFF9E6", type: ShadingType.CLEAR },
        border: { left: { style: BorderStyle.SINGLE, size: 12, color: "E6A817", space: 4 } },
        indent: { left: 360 },
        children: [
          bold("Note from Day One journal (April 28, 2026): ", { italics: true }),
          run("“Stock at ~$103, down ~40% YTD” — the stock has recovered since then to $119, but remains sharply below its 52-week high of $211.48. The Q1 2026 earnings beat drove a 15% intra-day drop — a classic case of “sell the news” despite strong fundamentals.", { italics: true }),
        ],
      }),
      divider(),

      // SECTION 2: BULL CASE
      heading1("2. BULL CASE"),
      heading2("a) cRPO Is the Leading Indicator — and It's Accelerating"),
      para([run("Current Remaining Performance Obligations (cRPO) of $12.64B growing 22.5% YoY represents contracted revenue that will be recognized over the next 12 months. This $12.64B backlog — larger than the entire annual revenue of most software companies — provides extraordinary revenue visibility. The 25% growth in total RPO ($27.7B) means the pipeline is building faster than revenue is being recognized. This is not a stagnating business: it’s a business with a multi-year revenue ramp that’s already contracted.")]),
      heading2("b) Now Assist AI Is Exceeding Expectations and Approaching $1B ACV"),
      para([run("Now Assist customers spending over $1M in annual contract value grew 130% YoY in Q1 2026, and deals with three or more Now Assist products grew 70% YoY. CEO Bill McDermott stated Now Assist is “on a trajectory to exceed a billion-dollar target for 2026.” Unlike many AI features bolted onto existing platforms, Now Assist is deeply integrated into ServiceNow’s workflow engine — it executes actions, not just answers questions. The Autonomous Workforce product (launching AI specialists that resolve L1 IT tickets end-to-end) represents a potential $100B+ TAM in autonomous enterprise labor.")]),
      heading2("c) The Selloff (Down 43% from Highs) Is a Valuation Reset, Not a Fundamental Deterioration"),
      para([run("ServiceNow beat the high end of guidance on every metric in Q1 2026 and still dropped 17% on earnings day — a textbook example of multiple compression rather than fundamental weakness. The business posted $12.64B in contracted future revenue, raised full-year guidance, closed the strategic Armis acquisition, and reported 32% non-GAAP operating margins. The stock decline reflects macro multiple compression (interest rates, growth stock rotation) and temporary margin headwinds from M&A integration — both of which are transient. Meanwhile the FCF machine continues: $1.665B in Q1 2026 alone.")]),
      heading2("d) Platform Expansion (Security + Agentic AI) Dramatically Expands TAM"),
      para([run("The Armis acquisition (closed April 20, 2026) and Veza acquisition (closed March 2, 2026) bring real-time asset discovery and identity governance into the ServiceNow platform, expanding into the $100B+ cybersecurity market. Combined with Autonomous Workforce (agentic AI), EmployeeWorks (AI HR front door), and Context Engine (enterprise organizational intelligence), ServiceNow is evolving from “IT workflow automation” into the “AI control plane for the entire enterprise.” This is a TAM expansion, not just feature creep.")]),
      heading2("e) Customer Economics Are Exceptional and Expanding"),
      para([run("98% renewal rate, 85% Fortune 500 penetration, and 630 customers with >$5M ACV (+22% YoY). Transactions over $5M in net new ACV grew 80% YoY in Q1 2026. The company is not just retaining customers — it’s expanding within them aggressively. Now Assist penetration into the existing customer base represents a massive upsell opportunity with near-zero incremental customer acquisition cost.")]),
      divider(),

      // SECTION 3: BEAR CASE
      heading1("3. BEAR CASE"),
      heading2("a) Margin Compression from Acquisitions Is Real and Longer Than Expected"),
      para([run("The Armis acquisition alone creates a 75bps headwind to FY2026 operating margin and 200bps to FCF margin. Combined with Veza integration costs, M&A-related amortization adds ~$77M to Q1 2026 cost of revenue — compressing subscription gross margin from a historical 84% (Q1 2025 non-GAAP) to 81.5%. If ServiceNow continues its M&A strategy, structural margin pressure may persist longer than management guidance suggests.")]),
      heading2("b) Professional Services Gross Margin Turning Sharply Negative"),
      para([run("Q1 2026 professional services gross margin was -21% (GAAP) — a deterioration from -8.5% in Q1 2025. Professional services and other revenue is $99M with cost of $120M — they are essentially subsidizing implementation work. While this supports subscription upsell, the -21% drag on blended gross margin (75% GAAP vs. 79.5% non-GAAP) creates a widening GAAP/non-GAAP wedge that matters when rates are elevated.")]),
      heading2("c) Geopolitical Headwinds Affecting Deal Timing"),
      para([run("In Q1 2026, approximately 75 basis points of cRPO growth was impacted by delayed closings of large on-premise deals in the Middle East due to ongoing regional conflict. Management guided for this headwind to continue throughout FY2026 at approximately 125bps impact on subscription revenue growth. In a business where large deals and timing matter, any escalation of geopolitical instability could create multiple quarters of deal slippage.")]),
      heading2("d) Competition from Microsoft and Salesforce Is Intensifying"),
      para([run("Microsoft Copilot is embedded in every Microsoft 365 seat (1.5B+ users), directly competing with Now Assist in enterprise AI workflows. Salesforce’s Agentforce platform competes for CRM and CS workflows. While ServiceNow’s IT workflow automation moat remains deep, the expansion into HR, Finance, and Customer Service puts it squarely into territory where Microsoft and Salesforce have large installed bases. The bull case requires ServiceNow to win these adjacencies — which is far from guaranteed.")]),
      divider(),

      // SECTION 4: DCF VALUATION
      pageBreak(),
      heading1("4. DCF VALUATION"),
      buildDcfTable(),
      new Paragraph({ spacing: { before: 160, after: 80 }, children: [bold("Key Insight: ")] }),
      para([run("ServiceNow is currently trading at a "), bold("7% discount"), run(" to our base-case DCF value of $128.46. This is meaningful: you are getting a best-in-class enterprise SaaS business at or below intrinsic value. The bull case ($185) suggests 55% upside from current prices. The bear case ($83) represents only 30% downside — a favorable risk/reward asymmetry at current price.")]),
      divider(),

      // SECTION 5: RULE OF 40
      heading1("5. RULE OF 40 ANALYSIS"),
      para([bold("Rule of 40"), run(" = Revenue Growth Rate + FCF Margin (or Operating Margin)")]),
      para([
        run("ServiceNow Q1 2026: 22% revenue growth + 44% FCF margin = "),
        bold("Rule of 40: 66"),
        run("  (Alternative using non-GAAP op margin: 22% + 32% = "),
        bold("54"),
        run(")"),
      ]),
      para([run("Both measures significantly exceed the 40 threshold. In the context of a $3.8B/quarter business growing 22% with 44% FCF margins, a Rule of 40 of 66 represents an exceptional combination of growth and profitability.")]),
      para([run("Historical trend: FCF margin compression (from Q1 2025’s 48% to Q1 2026’s 44%) reflects M&A integration costs. FY2026 FCF margin guidance of 35% represents the trough — management expects normalization in FY2027.")]),
      para([run("If FCF margin recovers to 40%+ in FY2027 and revenue growth holds at 20%, Rule of 40 reaches 60. At the current 7.5x EV/Sales, the market is not giving credit for this combination.")]),
      para([run("Implied justified EV/Sales for a Rule-of-40 of 66 (using Rule of 40 × ~0.15 heuristic): ~10x EV/Sales → implied equity value of $163B → $157/share. Even this crude screen suggests "), bold("31% upside"), run(".")]),
      divider(),

      // SECTION 6: PEER COMPS
      heading1("6. PEER COMPS"),
      buildPeerCompsTable(),
      new Paragraph({ spacing: { before: 140, after: 80 }, children: [bold("Key Observation: ")] }),
      para([run("NOW trades at 7.5x forward EV/Sales — the cheapest of the high-quality SaaS names on a Rule-of-40-adjusted basis. CrowdStrike trades at 20x with a lower Rule of 40; Datadog at 14x. If NOW re-rates to even 10x EV/Sales (consistent with its Rule of 40 score), the stock would trade at approximately "), bold("$160/share"), run(".")]),
      divider(),

      // SECTION 7: TECHNICAL SETUP
      heading1("7. TECHNICAL SETUP"),
      para([bold("Current Price: "), run("$119.29 (June 5, 2026) — post-5-for-1 split (Dec 2025)")]),
      para([bold("52-Week Range: "), run("$81.24 – $211.48")]),
      para([bold("Key Context: "), run("The 52-week high was $211.48 (pre-compression); current price is $119.29, roughly 44% below the 52-week high. This is NOT a fundamental deterioration — the business grew 22% and beat guidance. It is a valuation multiple compression story.")]),
      new Paragraph({ spacing: { before: 120, after: 80 }, children: [bold("Key Technical Levels:")] }),
      bullet([bold("Strong support: "), run("$110 (round number + prior consolidation), $100, $81.24 (52-week low)")]),
      bullet([bold("Key resistance: "), run("$130, $140 (prior base), $155, $175")]),
      bullet([run("The stock is in a recovery pattern from its lows — has bounced from $81–$103 (journal noted) to $119")]),
      new Paragraph({ spacing: { before: 120, after: 80 }, children: [bold("Technical Interpretation: ")] }),
      para([run("NOW is in a bottoming pattern. The recovery from $81 to $119 (+47%) suggests the worst of the selling is over, but the stock needs to reclaim $130+ to confirm a trend change. The 52-week high of $211 represents substantial overhead supply. From a technical perspective, the $110–$130 range represents the “buy zone” — below intrinsic value and technically supportive.")]),
      para([bold("IV Considerations: "), run("If IV is elevated (post-earnings), selling premium (cash-secured puts) makes more sense. If IV is low (post-compression), buying calls or call spreads is better.")]),
      divider(),

      // SECTION 8: OPTIONS STRATEGY
      pageBreak(),
      heading1("8. OPTIONS STRATEGY RECOMMENDATION"),
      para([run("Given: (1) Stock is at/below DCF base case, (2) Fundamental business is strong, (3) Technical recovery underway, (4) 55% upside to bull case DCF.")]),
      para([bold("Primary Strategy: ACCUMULATE EQUITY + Sell Cash-Secured Puts to Build Position")]),
      heading2("Strategy 1 — Cash-Secured Put (Income + Better Entry)"),
      para([run("Sell NOW puts at the $110 strike, 8–10 weeks out. This generates premium of approximately $7–$9 per contract at current IV levels. If assigned, your effective cost basis is approximately $101–$103 — which represents a 20% discount to base-case DCF and is near the 52-week low. This strategy is the highest-conviction play given the fundamental/valuation setup.")]),
      heading2("Strategy 2 — Long Call Spread (Defined-Risk Bull Play)"),
      para([run("Buy the $120 call, sell the $150 call (January 2027 expiry, ~7 months). Net debit approximately $10–$12 per spread. Maximum profit of ~$18 if stock reaches $150 by expiration. Requires no share ownership. Risk/reward is favorable given the base case DCF of $128 — you’d be profitable before the stock even reaches intrinsic value. This is the preferred strategy for non-equity holders who want exposure with defined risk.")]),
      heading2("Strategy 3 — Covered Call (Existing Holders)"),
      para([run("If you hold NOW shares, sell calls at the $135–$140 strike (6–8 weeks out). Generates approximately $4–$7 per contract in premium at current IV. Reduces cost basis while providing income. Cap applies above $140, so only enter if you’re willing to sell there or roll the call up.")]),
      heading2("Strategy 4 — Long-Dated LEAP Call (High Conviction, Long Time Horizon)"),
      para([run("Buy NOW Jan 2028 calls at the $130 strike. This gives you 19 months to be right on the fundamental thesis. Cost approximately $20–$25 per contract. If the stock recovers to base case ($128) or bull case ($185) over 18 months, the return on these calls could be 3–5x. Suitable only for high-conviction investors with a long time horizon.")]),
      new Paragraph({
        spacing: { before: 140, after: 80 },
        shading: { fill: "FFF3F3", type: ShadingType.CLEAR },
        border: { left: { style: BorderStyle.SINGLE, size: 12, color: "CC0000", space: 4 } },
        indent: { left: 360 },
        children: [
          bold("Risk Management: "),
          run("Size positions so that a bear-case outcome ($83/share) does not cause unacceptable portfolio loss. The 30% downside from current levels to bear case is the primary risk to manage."),
        ],
      }),
      divider(),

      // SECTION 9: VERDICT
      heading1("9. VERDICT"),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 80, after: 140 },
        children: [new TextRun({ text: "RATING: BUY / ACCUMULATE", font: "Arial", size: 32, bold: true, color: "1A6B2A" })],
      }),
      para([run("ServiceNow is one of the most fundamentally sound businesses in enterprise software — $12.64B in contracted future revenue, 98% renewal rates, 85% Fortune 500 penetration, 44% FCF margins, and a CEO who is executing. The business beat every metric in Q1 2026 and raised guidance, and still fell 17% on earnings day.")]),
      para([run("At $119.29, the stock trades at approximately a 7% discount to our base-case DCF of $128.46 and a 36% discount to our bull-case DCF of $185.38. The risk/reward is meaningfully asymmetric: "), bold("55% upside to the bull case"), run(" versus "), bold("30% downside to the bear case"), run(" from current levels.")]),
      para([run("The Armis and Veza acquisitions create near-term margin headwinds but expand the TAM into cybersecurity — a strategic move that should be valued, not penalized. FY2026 FCF margin guidance of 35% is the trough; management expects recovery in FY2027. The cRPO of $12.64B growing 22.5% means revenue visibility extends well into FY2027 with high confidence.")]),
      para([run("The options strategy recommendation is to sell cash-secured puts at $110 to build or add to a position at below base-case DCF, while holding longer-dated call spreads ($120–$150 Jan 2027) to capture the recovery thesis with defined risk.")]),
      new Paragraph({
        spacing: { before: 140, after: 120 },
        shading: { fill: "EAF2FA", type: ShadingType.CLEAR },
        border: { left: { style: BorderStyle.SINGLE, size: 12, color: "2E75B6", space: 4 } },
        indent: { left: 360 },
        children: [
          bold("Context from your Day One journal (April 28, 2026): ", { italics: true }),
          run("You noted the stock at ~$103 with “FY2025 subscription revenue $12.9B, 98% renewal rate, 7,400 enterprise customers, 85% Fortune 500.” The stock has recovered to $119 since then — you were right to be watching. The investment thesis hasn’t changed; in fact, Q1 2026 results strengthened it. Now is the time to act with a defined-risk structure.", { italics: true }),
        ],
      }),
      divider(),

      // SOURCES
      new Paragraph({
        spacing: { before: 200, after: 60 },
        children: [new TextRun({ text: "SOURCES & DISCLAIMER", font: "Arial", size: 20, bold: true, color: "666666" })],
      }),
      new Paragraph({
        spacing: { after: 60 },
        children: [new TextRun({
          text: "Sources: ServiceNow Q1 2026 10-Q (SEC EDGAR, April 22, 2026), ServiceNow Q1 2026 Earnings Press Release (8-K, April 22, 2026), Day One Options Trading Journal entry (April 28, 2026). This memo is for informational purposes only and does not constitute financial advice.",
          font: "Arial",
          size: 18,
          italics: true,
          color: "666666",
        })],
      }),
    ],
  }],
});

Packer.toBuffer(doc).then(function(buffer) {
  const outPath = "/sessions/ecstatic-upbeat-wright/mnt/Stock Ticker Analysis/NOW_Investment_Memo.docx";
  fs.writeFileSync(outPath, buffer);
  console.log("Written:", outPath);
}).catch(function(err) {
  console.error(err);
  process.exit(1);
});
