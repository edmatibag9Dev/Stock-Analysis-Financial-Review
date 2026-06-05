"use strict";
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageNumber, LevelFormat, PageBreak
} = require("/tmp/npm-global/lib/node_modules/docx");
const fs = require("fs");

// ── helpers ────────────────────────────────────────────────────────────────────
const NAVY     = "1F4E79";
const WHITE    = "FFFFFF";
const GRAY_BG  = "F2F2F2";
const BLUE_BG  = "DEEAF1";

function cellBorder(color) {
  const s = { style: BorderStyle.SINGLE, size: 1, color: color || "CCCCCC" };
  return { top: s, bottom: s, left: s, right: s };
}

function para(text, opts) {
  opts = opts || {};
  return new Paragraph({
    spacing: { before: opts.spaceBefore || 60, after: opts.after || 100 },
    alignment: opts.align || AlignmentType.LEFT,
    pageBreakBefore: opts.pageBreakBefore || false,
    children: [new TextRun({
      text: text,
      font: "Arial",
      size: opts.size || 24,
      bold: opts.bold || false,
      italics: opts.italic || false,
      color: opts.color || "000000",
    })]
  });
}

function h1(text, pageBreakBefore) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    pageBreakBefore: !!pageBreakBefore,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, font: "Arial", size: 32, bold: true, color: NAVY })]
  });
}

function subHead(text) {
  return new Paragraph({
    spacing: { before: 160, after: 60 },
    children: [new TextRun({ text, font: "Arial", size: 24, bold: true, color: "1F4E79" })]
  });
}

function italicNote(text) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [new TextRun({ text, font: "Arial", size: 20, italics: true, color: "595959" })]
  });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, font: "Arial", size: 24 })]
  });
}

function thCell(text, width) {
  return new TableCell({
    borders: cellBorder("FFFFFF"),
    width: { size: width, type: WidthType.DXA },
    shading: { fill: NAVY, type: ShadingType.CLEAR },
    margins: { top: 100, bottom: 100, left: 120, right: 120 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text, font: "Arial", size: 22, bold: true, color: WHITE })]
    })]
  });
}

function tdCell(text, width, fill, bold, align) {
  return new TableCell({
    borders: cellBorder("CCCCCC"),
    width: { size: width, type: WidthType.DXA },
    shading: fill ? { fill, type: ShadingType.CLEAR } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({
      alignment: align || AlignmentType.LEFT,
      children: [new TextRun({ text, font: "Arial", size: 22, bold: !!bold })]
    })]
  });
}

function kvTable(rows) {
  const colW = [3360, 6000];
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: colW,
    rows: rows.map((r, i) => {
      const fill = i % 2 === 0 ? GRAY_BG : BLUE_BG;
      return new TableRow({
        children: [
          tdCell(r[0], colW[0], fill, true),
          tdCell(r[1], colW[1], fill, false),
        ]
      });
    })
  });
}

const chartData = fs.readFileSync("/sessions/hopeful-loving-babbage/mnt/outputs/sg_chart.png");

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      }
    ]
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 24 } } },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: NAVY },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 }
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: NAVY },
        paragraph: { spacing: { before: 180, after: 80 }, outlineLevel: 1 }
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: NAVY, space: 1 } },
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "CONFIDENTIAL — INVESTMENT MEMO", font: "Arial", size: 20, bold: true, color: NAVY })]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Page ", font: "Arial", size: 18, color: "595959" }),
            new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 18, color: "595959" }),
            new TextRun({ text: " of ", font: "Arial", size: 18, color: "595959" }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], font: "Arial", size: 18, color: "595959" }),
          ]
        })]
      })
    },
    children: [

      // TITLE
      new Paragraph({
        spacing: { before: 240, after: 60 },
        children: [new TextRun({ text: "SG (SWEETGREEN) — INVESTMENT MEMO", font: "Arial", size: 40, bold: true, color: NAVY })]
      }),
      new Paragraph({
        spacing: { before: 0, after: 60 },
        children: [new TextRun({ text: "Date: June 5, 2026  |  Analyst: Ed  |  Rating: SPECULATIVE — AVOID at $7.42 / ACCUMULATE via Cash-Secured Puts at $5–6", font: "Arial", size: 22, color: "595959" })]
      }),
      new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: NAVY, space: 2 } },
        spacing: { before: 0, after: 240 },
        children: [new TextRun({ text: "" })]
      }),

      // ── SECTION 1: INVESTMENT SUMMARY ──────────────────────────────────────
      h1("1. INVESTMENT SUMMARY", false),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1200, 2800, 1900, 1600, 1860],
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              thCell("Scenario", 1200),
              thCell("Key Drivers", 2800),
              thCell("Revenue x Multiple", 1900),
              thCell("Implied Price", 1600),
              thCell("vs. Current ($7.42)", 1860),
            ]
          }),
          new TableRow({
            children: [
              tdCell("Bear Case", 1200, "FFC7CE", true),
              tdCell("Comps stay deeply negative, cash burns through FY2027. No meaningful Infinite Kitchen scale benefit. Restaurant-level margins stuck at 12–13%. Equity raise required — dilutive. AUV continues declining toward $2,200K.", 2800, "FFC7CE"),
              tdCell("$640M x 0.7x ≈ $448M EV", 1900, "FFC7CE"),
              tdCell("$2.50 – $3.00", 1600, "FFC7CE"),
              tdCell("▼ ~60–65% decline", 1860, "FFC7CE", true),
            ]
          }),
          new TableRow({
            children: [
              tdCell("Base Case", 1200, "FFEB9C", true),
              tdCell("Comps stabilize at flat by FY2027. Restaurant-level margins recover to 16–17% by FY2028. Infinite Kitchen provides modest labor savings. Business reaches Adj. EBITDA breakeven FY2027. Slow but positive unit growth.", 2800, "FFEB9C"),
              tdCell("$655M x 1.1x ≈ $720M EV", 1900, "FFEB9C"),
              tdCell("$5.25 – $6.00", 1600, "FFEB9C"),
              tdCell("▼ ~20–30% downside", 1860, "FFEB9C", true),
            ]
          }),
          new TableRow({
            children: [
              tdCell("Bull Case", 1200, "C6EFCE", true),
              tdCell("Infinite Kitchen scales to 100+ locations by FY2028, driving margins to 20%+ (Chipotle-like economics). Wraps launch + SG Rewards drives traffic recovery; SSS turns positive FY2027. Revenue reaches $960M by FY2030.", 2800, "C6EFCE"),
              tdCell("$960M x 3.0x ≈ $2.88B EV", 1900, "C6EFCE"),
              tdCell("$19 – $22", 1600, "C6EFCE"),
              tdCell("▲ ~160–200% upside", 1860, "C6EFCE", true),
            ]
          }),
        ]
      }),
      new Paragraph({ spacing: { before: 80, after: 0 }, children: [] }),
      italicNote("Revenue multiple approach reflects market pricing behavior. EBITDA-terminal DCF (bull ~$14.77 / base ~$3.49 / bear ~$1.36) is in Section 5. IMPORTANT: Base case is BELOW current price — buyer at $7.42 is already pricing in above-base execution."),

      // ── SECTION 2: BUSINESS SNAPSHOT ───────────────────────────────────────
      h1("2. BUSINESS SNAPSHOT", true),
      para("Sweetgreen (NYSE: SG) is a fast-casual restaurant chain built around salads, grain bowls, and warm plates, with 285 locations across the U.S. as of March 2026. Its key differentiator is the Infinite Kitchen — a proprietary robotic assembly system designed to reduce labor costs, improve consistency, and expand restaurant-level margins toward Chipotle-like economics."),
      para("Prior Context from Open Brain: A note captured June 5, 2026 — \"Thought Sweet Green $SG. video on possible investment due to social hype.\" This analysis examines whether the social thesis has fundamental support.", { italic: true, color: "595959" }),
      new Paragraph({ spacing: { before: 120, after: 60 }, children: [] }),

      kvTable([
        ["Current Price",                    "$7.42 (June 5, 2026)"],
        ["52-Week Range",                    "$4.49 – $16.70"],
        ["Market Cap",                       "~$881M"],
        ["Enterprise Value",                 "~$720M (Market cap – $161M net cash)"],
        ["EV/FY2025 Revenue",                "1.06x"],
        ["FY2025 Total Revenue",             "$679.5M (+0.4% YoY)"],
        ["Q1 2026 Revenue",                  "$161.5M (-2.9% YoY)"],
        ["Q1 2026 Same-Store Sales",         "(12.8%)"],
        ["Q1 2026 Restaurant-Level Margin",  "10.0% (vs. 17.9% prior year)"],
        ["Q1 2026 Adj. EBITDA",              "($8.1M)"],
        ["Cash + Restricted Cash",           "$160.9M"],
        ["Wonder Group Investment",          "$86.4M (illiquid Series C Preferred)"],
        ["Diluted Shares",                   "~118.8M"],
        ["Total Restaurants",               "285 (33 with Infinite Kitchen)"],
        ["Average Unit Volume (AUV)",        "$2,572K (trailing)"],
        ["FY2026 SSS Guidance",              "(4%) to (2%)"],
        ["FY2026 Adj. EBITDA Guidance",      "$1M – $6M"],
      ]),

      // ── SECTION 3: BULL CASE ───────────────────────────────────────────────
      h1("3. BULL CASE", true),

      subHead("a) Infinite Kitchen is a structurally different restaurant model"),
      para("The Infinite Kitchen is not a gimmick — it is a labor-cost transformation. Traditional fast-casual restaurants are labor-intensive, with labor typically 28–32% of revenue. Sweetgreen’s Q1 2026 labor costs were 31.4% of revenue. Infinite Kitchen reduces manual assembly steps, creates a more consistent product, and — when fully scaled — should reduce labor costs by an estimated 20–30%. Chipotle operates at 27% restaurant-level margins; Sweetgreen’s IK-equipped restaurants, at scale, could approach similar economics. With 33 IK restaurants today and a target of ~50% of new openings in 2026 being IK format, the inflection point is approaching."),

      subHead("b) The comp decline is explainable and potentially reversible"),
      para("The -12.8% SSS in Q1 2026 was driven by three temporary factors: adverse weather, the prior-year benefit from the Ripple Fries launch (a tough comparable), and transition from the old Sweetpass+ loyalty program to SG Rewards. Management’s FY2026 guidance of -4% to -2% SSS implies significant recovery through the year. The April 2026 nationwide Wraps launch — Sweetgreen’s most significant menu expansion in years — drove measurable guest acquisition and strong retention during market testing. If Wraps succeeds and SG Rewards matures, the traffic decline could reverse in FY2027."),

      subHead("c) Valuation is undemanding IF the business executes"),
      para("At 1.06x EV/FY2025 revenue, Sweetgreen trades at the cheapest EV/Sales of any fast-casual growth concept in public markets. CAVA trades at ~7x EV/Sales, Chipotle at ~5.5x, Dutch Bros at ~2.5x. The gap reflects execution risk, not a permanently broken business. If Sweetgreen reaches $50M Adj. EBITDA by FY2028 (achievable in the bull case through IK margin expansion) and the market awards a 20x EBITDA multiple — consistent with a high-growth restaurant concept — the stock would trade at approximately $18–22/share, a 3x return from current levels."),

      subHead("d) Clean balance sheet and the Spyce monetization provide runway"),
      para("The $160.9M in cash (plus $86.4M in illiquid Wonder Group preferred stock received from the Spyce sale) means the company is not in immediate distress. At the current EBITDA burn rate, management has approximately 5–6 quarters of runway before needing additional capital. This is enough time for the IK expansion and comp recovery to demonstrate results. If the business reaches Adj. EBITDA breakeven by Q4 2026 (guided $1–6M for full year), the dilution risk subsides."),

      // ── SECTION 4: BEAR CASE ───────────────────────────────────────────────
      h1("4. BEAR CASE", true),

      subHead("a) The comp trajectory is alarming and may not be temporary"),
      para("SSS went from -3.1% in Q1 2025 to -12.8% in Q1 2026 — a consistent worsening over four quarters. Traffic is down 11.2% year-over-year. While management attributes this to weather and program transitions, the pattern suggests a structural demand issue: Sweetgreen’s target customer (urban, health-conscious, higher-income) is increasingly choosing CAVA, which grew comps 9%+ in the same period, over Sweetgreen. With average check prices already at premium levels, there is limited ability to drive traffic through further price increases. The Wraps launch may provide a temporary boost, but reversing traffic declines of this magnitude typically requires years, not quarters."),

      subHead("b) The cash burn and path to profitability are more precarious than they appear"),
      para("The $160.9M cash balance sounds comfortable, but Sweetgreen burned $29.6M in operating cash and capex in Q1 2026 alone — a quarterly burn rate that implies only 5–6 quarters of runway. FY2026 Adj. EBITDA guidance of $1–6M is barely breakeven, and those estimates have been consistently missed. Q4 2025 Adj. EBITDA came in at -$13.3M, well below any reasonable prior guidance. If the comp recovery fails to materialize, the company will need to raise equity by mid-FY2027 — at what will likely be dilutive prices, further depressing per-share value."),

      subHead("c) Infinite Kitchen is capital-intensive and unproven at scale"),
      para("The Infinite Kitchen concept requires significant upfront capital — each IK restaurant costs more to build than a traditional format. With only 33 IK restaurants out of 285 total (11.6%), the cost savings are not yet reflected in aggregate economics. The hypothesis that IK will drive margins to 20%+ has not been validated in the data: Q1 2026 restaurant-level margin was 10.0% across all formats, worse than any comparable period. Until IK restaurants demonstrate materially higher margins than traditional locations in audited financials, the thesis remains speculative."),

      subHead("d) CAVA is eating Sweetgreen’s lunch — literally"),
      para("CAVA Group (NYSE: CAVA) grew revenue 32.2% to $434.4M in Q1 2026 with comps UP ~9%, while Sweetgreen’s comps were -12.8%. Both target the same urban, health-conscious consumer segment. CAVA’s Mediterranean-style warm bowls are a direct substitute for Sweetgreen’s salads and warm bowls, priced competitively, and growing rapidly. CAVA is opening restaurants aggressively and has stronger unit economics (~23% restaurant-level margins). If CAVA continues taking Sweetgreen’s core customer, the traffic recovery scenario may never materialize — not because Sweetgreen is executing poorly, but because its direct competitor is executing very well."),

      // ── SECTION 5: DCF VALUATION ──────────────────────────────────────────
      h1("5. DCF VALUATION", true),
      para("Given Sweetgreen is pre-EBITDA profitability, this analysis uses an EBITDA-terminal multiple approach (consistent with restaurant industry practice) rather than standard FCF DCF. The terminal value reflects the company reaching maturity by FY2030 and being valued at an EV/EBITDA multiple consistent with comparable restaurant companies."),
      new Paragraph({ spacing: { before: 120, after: 60 }, children: [] }),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3200, 2053, 2053, 2054],
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              thCell("Metric", 3200),
              thCell("Bull Case", 2053),
              thCell("Base Case", 2053),
              thCell("Bear Case", 2054),
            ]
          }),
          ...[
            ["Discount Rate",                              "11%",         "13%",         "15%"],
            ["FY2030 Revenue",                             "$960M",       "$770M",       "$630M"],
            ["FY2030 Restaurant-Level Margin",             "25%",         "17.5%",       "14%"],
            ["FY2030 G&A as % Revenue",                   "11%",         "14%",         "17%"],
            ["FY2030 Adj. EBITDA",                         "~$134M",      "~$26M",       "~($19M)"],
            ["Terminal EV/EBITDA Multiple",                "20x",         "18x",         "N/A"],
            ["Terminal EV/Sales Multiple (cross-check)",   "3.0x",        "1.1x",        "0.7x"],
            ["Terminal Value Method",                      "EV/EBITDA",   "EV/EBITDA",   "EV/Sales (distressed)"],
            ["Implied Terminal EV",                        "~$2.68B",     "~$468M",      "~$431M"],
            ["PV of Terminal Value",                       "~$1.59B",     "~$254M",      "~$214M"],
            ["+ Net Cash",                                 "$161M",       "$161M",       "$161M"],
            ["Less: Dilution (equity raise)",              "—",           "—",           "($80M est.)"],
            ["Equity Value",                               "~$1.75B",     "~$415M",      "~$295M"],
            ["Diluted Shares",                             "118.8M",      "118.8M",      "~135M (diluted)"],
            ["Intrinsic Price/Share",                      "~$14.77",     "~$3.49",      "~$1.36"],
            ["Current Price",                              "$7.42",       "$7.42",       "$7.42"],
            ["Premium/(Discount)",                         "(50% discount to bull)", "(113% premium to base)", "(446% premium to bear)"],
          ].map((r, i) => {
            const fill = i % 2 === 0 ? GRAY_BG : undefined;
            const isBold = r[0].startsWith("Intrinsic") || r[0].startsWith("Premium");
            return new TableRow({
              children: [
                tdCell(r[0], 3200, fill, isBold),
                tdCell(r[1], 2053, fill, isBold, AlignmentType.CENTER),
                tdCell(r[2], 2053, fill, isBold, AlignmentType.CENTER),
                tdCell(r[3], 2054, fill, isBold, AlignmentType.CENTER),
              ]
            });
          })
        ]
      }),
      new Paragraph({ spacing: { before: 80, after: 0 }, children: [] }),
      para("Critical Interpretation: The current price of $7.42 sits ABOVE the base-case intrinsic value of $3.49 and dramatically above the bear case ($1.36). To justify buying at $7.42, you need to assign high probability to the bull case. The bull case requires: (1) Infinite Kitchen scaling to 100+ locations by FY2028, (2) same-store sales recovery to positive territory by FY2027, AND (3) restaurant-level margins reaching 25% by FY2030. Each of these is plausible individually; all three simultaneously is a demanding set of conditions. Note: discount rates (11%/13%/15%) vary by scenario as a proxy for execution risk; a single 12% WACC across scenarios would yield a tighter range."),

      // ── SECTION 6: UNIT ECONOMICS SCORECARD ──────────────────────────────
      h1("6. UNIT ECONOMICS SCORECARD", true),
      para("The most important metrics for a fast-casual restaurant investor are: average unit volume (AUV), restaurant-level margin, same-store sales trend, and new unit economics. Together they determine whether the business compounds value per unit or destroys it."),
      new Paragraph({ spacing: { before: 120, after: 60 }, children: [] }),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2560, 1700, 1700, 1700, 1700],
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              thCell("Metric", 2560),
              thCell("FY2024", 1700),
              thCell("FY2025", 1700),
              thCell("Q1 2026", 1700),
              thCell("FY2026E", 1700),
            ]
          }),
          ...[
            ["AUV ($K)",                      "~$2,900",  "~$2,800",  "$2,572",    "~$2,600"],
            ["Restaurant-Level Margin",        "~17%",     "~12%",     "10.0%",     "14.2–14.7%"],
            ["Same-Store Sales Change",        "6.2%",     "(7.9%)",   "(12.8%)",   "(4%) to (2%)"],
            ["Adj. EBITDA ($M)",               "~$0",      "~($20)",   "($8.1)",    "$1–$6"],
            ["Total Restaurants",              "~246",     "~281",     "285",       "~294"],
            ["Infinite Kitchen Locations",     "~10",      "~27",      "33",        "~40"],
            ["IK % of Total",                  "~4%",      "~10%",     "~12%",      "~14%"],
          ].map((r, i) => {
            const fill = i % 2 === 0 ? GRAY_BG : undefined;
            return new TableRow({
              children: [
                tdCell(r[0], 2560, fill, true),
                tdCell(r[1], 1700, fill, false, AlignmentType.CENTER),
                tdCell(r[2], 1700, fill, false, AlignmentType.CENTER),
                tdCell(r[3], 1700, fill, false, AlignmentType.CENTER),
                tdCell(r[4], 1700, fill, false, AlignmentType.CENTER),
              ]
            });
          })
        ]
      }),
      new Paragraph({ spacing: { before: 80, after: 0 }, children: [] }),
      para("The trend is clear and concerning — AUV, restaurant-level margins, and same-store sales are all declining simultaneously. This is the opposite of what you want to see in a restaurant concept building toward profitability. Chipotle at a comparable stage of development was growing comps and expanding margins. The FY2026 guidance (margins 14.2–14.7%, SSS -4% to -2%) represents an improvement from Q1 2026 levels, but still reflects a business under significant pressure. The key unknown is whether the Infinite Kitchen — at meaningful scale — changes these unit economics materially."),

      // ── SECTION 7: PEER COMPARABLES ──────────────────────────────────────
      h1("7. PEER COMPARABLES", true),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [700, 1400, 1200, 1400, 900, 1200, 2560],
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              thCell("Ticker", 700),
              thCell("Company", 1400),
              thCell("Fwd Rev Growth", 1200),
              thCell("Rest-Level Margin", 1400),
              thCell("EV/Sales", 900),
              thCell("Status", 1200),
              thCell("Note", 2560),
            ]
          }),
          ...[
            { row: ["SG",   "Sweetgreen",  "(2%) to 0%", "14–15%", "1.1x",  "Declining", "Negative comps, pre-profit"],  fill: "FFFF00" },
            { row: ["CAVA", "CAVA Group",  "~30%",        "~23%",        "~7.0x", "Growing",   "Direct competitor, winning"],  fill: null },
            { row: ["CMG",  "Chipotle",    "~10%",        "~27%",        "~5.5x", "Mature",    "Category standard"],           fill: GRAY_BG },
            { row: ["SHAK", "Shake Shack", "~10%",        "~20%",        "~1.5x", "Stable",    "Premium burgers"],             fill: null },
            { row: ["BROS", "Dutch Bros",  "~20%",        "N/A",         "~2.5x", "Growing",   "Coffee drive-thru"],           fill: GRAY_BG },
            { row: ["WING", "Wingstop",    "~15%",        "N/A",         "~4.0x", "Mature",    "Asset-light model"],           fill: null },
            { row: ["FWRK", "First Watch", "~12%",        "~18%",        "~1.2x", "Stable",    "Daytime dining"],              fill: GRAY_BG },
          ].map((entry) => {
            const [tk, co, gr, mg, ev, st, nt] = entry.row;
            const f = entry.fill;
            return new TableRow({
              children: [
                tdCell(tk, 700,  f, true),
                tdCell(co, 1400, f),
                tdCell(gr, 1200, f, false, AlignmentType.CENTER),
                tdCell(mg, 1400, f, false, AlignmentType.CENTER),
                tdCell(ev, 900,  f, false, AlignmentType.CENTER),
                tdCell(st, 1200, f),
                tdCell(nt, 2560, f),
              ]
            });
          })
        ]
      }),
      new Paragraph({ spacing: { before: 80, after: 0 }, children: [] }),
      para("Sweetgreen at 1.1x EV/Sales is the cheapest name in the peer group by a wide margin. But this discount is warranted: it is the only company with declining revenue, negative same-store sales, and sub-15% restaurant-level margins. CAVA — its most direct competitor — trades at 7x EV/Sales with 30% revenue growth. The valuation gap between SG and CAVA is a referendum on execution quality and growth trajectory, not a hidden opportunity. Note: all peer figures are approximate estimates as of June 2026."),

      // ── SECTION 8: TECHNICAL SETUP ────────────────────────────────────────
      h1("8. TECHNICAL SETUP", true),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 120, after: 60 },
        children: [new ImageRun({
          type: "png",
          data: chartData,
          transformation: { width: 624, height: 293 },
          altText: { title: "SG Price Chart", description: "SG daily chart with SMA 20/50/200", name: "SG Chart" }
        })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 120 },
        children: [new TextRun({ text: "SG Daily Chart — SMA 20/50/200 | Source: Finviz.com | June 5, 2026", font: "Arial", size: 18, italics: true, color: "595959" })]
      }),

      kvTable([
        ["Current Price",      "$7.42"],
        ["52-Week Range",      "$4.49 – $16.70"],
        ["20-Day SMA",         "$8.35 (stock trading BELOW — bearish signal)"],
        ["50-Day SMA",         "$7.08 (stock trading ABOVE — near-term support)"],
        ["200-Day SMA",        "~$8.99 (stock trading BELOW — bearish signal)"],
        ["RSI (14-day)",       "~45 (neutral, trending lower)"],
        ["Implied Volatility", "~85–95% (estimated — small-cap speculative)"],
        ["IV Rank",            "Elevated (post-rally and reversal)"],
      ]),
      new Paragraph({ spacing: { before: 80, after: 0 }, children: [] }),
      para("The chart tells a clear story — SG had a significant short squeeze / speculative rally from ~$5 to $11 between late March and mid-May 2026 (a 120%+ move), followed by an equally sharp reversal back to $7.42. This is a classic failed breakout pattern. The stock is now below its 20-day SMA ($8.35) and 200-day SMA ($8.99), suggesting the rally momentum has exhausted. The 50-day SMA at $7.08 provides the nearest technical support; a break below $7 would likely test $5–6 range. The elevated IV from this recent volatile move means options premiums are rich — which favors premium-selling strategies (puts) over premium-buying strategies (calls). Key resistance: $8.35 (SMA 20), $9, $11 (May high). Key support: $7.08 (SMA 50), $6, $4.49 (52-week low)."),

      // ── SECTION 9: OPTIONS STRATEGY ───────────────────────────────────────
      h1("9. OPTIONS STRATEGY RECOMMENDATION", true),
      para("Given the base-case DCF ($3.49) is BELOW the current price ($7.42), IV is elevated from the recent rally/reversal, and no current position exists, the highest-conviction strategy is to sell premium via cash-secured puts to build a position below intrinsic value — rather than buying stock at current levels."),

      subHead("Strategy 1 — PRIMARY: Cash-Secured Put (Income + Better Entry)"),
      bullet("Structure: Sell SG $6.00 put, August 2026 expiry (~10 weeks)"),
      bullet("Estimated Premium: ~$0.80–1.10 per contract (requires $600 cash-secured per contract)"),
      bullet("Max Gain: Premium collected ($80–110 per contract) if SG stays above $6.00 at expiry"),
      bullet("Max Loss: Assignment at $6.00 minus premium = effective cost basis ~$4.90–$5.20 per share"),
      bullet("Rationale: The $4.90–5.20 effective basis is near the 52-week low ($4.49) and above the base-case DCF ($3.49) — meaning assignment still carries downside if the base case plays out. At ~85%+ IV, you’re collecting substantial time premium (~13–18% per cycle; verify annualized yield against current options chain before trading). If not assigned, collect premium and repeat. This is the best risk/reward strategy available given current setup."),

      subHead("Strategy 2 — SPECULATIVE: Bull Call Spread (Infinite Kitchen Thesis)"),
      bullet("Structure: Buy $8.00 call / Sell $12.00 call, January 2027 expiry (~7 months)"),
      bullet("Estimated Debit: ~$0.90–1.20 per spread"),
      bullet("Max Gain: ~$2.80–3.10 per spread if SG reaches $12 at expiry (~250–340% return)"),
      bullet("Max Loss: Debit paid ($90–120 per spread) — fully defined risk"),
      bullet("Rationale: The $12 target is below the prior May high ($11) and within range of partial bull-case realization (bull DCF ~$14.77). If Wraps gain traction and IK momentum builds through summer/fall, $12 is achievable. Defined risk means limited downside, substantial upside if the thesis plays out. Allocate only a small portion of intended position to this."),

      subHead("Strategy 3 — AVOID: Long Stock at $7.42"),
      bullet("Structure: Purchase shares at market"),
      bullet("Rationale: With base-case DCF at $3.49 and bear case at $1.36, buying equity at $7.42 means you’re pricing in bull-case execution from day one. The risk/reward (-53% to base, -82% to bear vs. +99% to bull) is asymmetric — and not in your favor as a first entry. Wait for a pullback to $5–6 range, or use the cash-secured put strategy to get there."),

      new Paragraph({ spacing: { before: 120, after: 60 }, children: [] }),
      new Paragraph({
        spacing: { before: 80, after: 80 },
        shading: { fill: "FFF2CC", type: ShadingType.CLEAR },
        border: {
          top:    { style: BorderStyle.SINGLE, size: 6, color: "FF8C00", space: 1 },
          bottom: { style: BorderStyle.SINGLE, size: 6, color: "FF8C00", space: 1 },
          left:   { style: BorderStyle.SINGLE, size: 6, color: "FF8C00", space: 1 },
          right:  { style: BorderStyle.SINGLE, size: 6, color: "FF8C00", space: 1 },
        },
        children: [new TextRun({ text: "RISK WARNING: Sweetgreen is a speculative, pre-profitability restaurant in the middle of a transformation. All position sizing should reflect the possibility of a 60–65% decline in the bear case. Never allocate more than you can afford to hold through a dilutive equity raise. Verify all options premiums against the live options chain before trading — IV estimates are approximations only.", font: "Arial", size: 22, bold: true, color: "7B3F00" })]
      }),

      // ── SECTION 10: VERDICT ───────────────────────────────────────────────
      h1("10. VERDICT", true),
      new Paragraph({
        spacing: { before: 0, after: 120 },
        children: [new TextRun({ text: "Rating: SPECULATIVE / AVOID AT $7.42 — Accumulate via Cash-Secured Puts at $5–6", font: "Arial", size: 26, bold: true, color: NAVY })]
      }),

      para("The Sweetgreen Infinite Kitchen story is real and compelling as a long-term thesis. Automation is the right structural answer for a restaurant with premium ingredients and high labor costs, and the potential to achieve Chipotle-like economics over 5 years is genuinely significant. The brand has strong recognition, loyal customers, and a defensible niche in healthy fast-casual dining."),
      para("However, the fundamentals today do not support the current price. Same-store sales declined 12.8% in Q1 2026, revenue is contracting, restaurant-level margins collapsed 800 basis points year-over-year, and the company is burning approximately $30M per quarter. The base-case DCF of $3.49 per share is less than half the current price of $7.42 — meaning buyers at market are pricing in bull-case execution, not base-case. The social hype that brought you to this name — a YouTube video about Infinite Kitchen — drove the stock from $5 to $11 in two months. That rally has reversed. The underlying business has not materially changed."),
      para("The right strategy: don’t buy equity at $7.42. Instead, sell cash-secured puts at $6.00 (Aug 2026) to potentially acquire shares at an effective basis of $4.90–5.20. Note that this basis, while near the 52-week low, still sits above the base-case DCF ($3.49) — you need the IK thesis to partially play out to profit. If you want defined-risk exposure to the IK bull case, allocate a small amount to bull call spreads ($8/$12, Jan 2027). Together, these strategies give you exposure to the Sweetgreen transformation story without paying full freight for optionality that current buyers are already pricing in."),

      new Paragraph({
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: NAVY, space: 1 } },
        spacing: { before: 240, after: 80 },
        children: [new TextRun({ text: "Sources", font: "Arial", size: 22, bold: true, color: NAVY })]
      }),
      para("Sweetgreen Q1 2026 8-K Earnings Release (SEC EDGAR, May 7, 2026)", { size: 20, color: "595959" }),
      para("Sweetgreen Q4 FY2025 8-K Earnings Release (SEC EDGAR, Feb 26, 2026)", { size: 20, color: "595959" }),
      para("Sweetgreen Q1 2026 10-Q (SEC EDGAR, CIK 0001477815)", { size: 20, color: "595959" }),
      para("Prior context from Open Brain: note captured June 5, 2026 (\"investment due to social hype\")", { size: 20, color: "595959" }),
      para("This memo is for informational purposes only and does not constitute financial advice.", { size: 20, color: "595959", italic: true }),

    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  const outPath = "/sessions/hopeful-loving-babbage/mnt/Stock Ticker Analysis/SG_Investment_Memo.docx";
  fs.writeFileSync(outPath, buffer);
  console.log("Written:", outPath, buffer.length, "bytes");
}).catch(err => {
  console.error("ERROR:", err);
  process.exit(1);
});
