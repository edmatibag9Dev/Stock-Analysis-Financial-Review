"use strict";
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageNumber, LevelFormat, PageBreak
} = require("/tmp/npm-global/lib/node_modules/docx");
const fs = require("fs");

// ── helpers ────────────────────────────────────────────────────────────────────
const NAVY    = "1F4E79";
const WHITE   = "FFFFFF";
const GRAY_BG = "F2F2F2";
const BLUE_BG = "DEEAF1";

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
    children: [new TextRun({ text, font: "Arial", size: 24, bold: true, color: NAVY })]
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

// Load chart — fall back gracefully if not present
let chartData = null;
try {
  chartData = fs.readFileSync("/tmp/bros_chart.png");
} catch (e) {
  console.warn("Chart not found at /tmp/bros_chart.png — Section 8 will skip chart embed.");
}

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

      // TITLE PAGE
      new Paragraph({
        spacing: { before: 720, after: 120 },
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "DUTCH BROS INC. (NYSE: BROS)", font: "Arial", size: 48, bold: true, color: NAVY })]
      }),
      new Paragraph({
        spacing: { before: 0, after: 120 },
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "INVESTMENT MEMO", font: "Arial", size: 32, color: NAVY })]
      }),
      new Paragraph({
        spacing: { before: 0, after: 80 },
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Date: June 5, 2026  |  Analyst: Ed  |  Rating: HOLD / ACCUMULATE ON PULLBACK", font: "Arial", size: 22, color: "555555" })]
      }),
      new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: NAVY, space: 2 } },
        spacing: { before: 0, after: 240 },
        children: [new TextRun({ text: "" })]
      }),

      // ── SECTION 1: INVESTMENT SUMMARY ─────────────────────────────────────────
      h1("1. INVESTMENT SUMMARY", false),

      para("Dutch Bros is a high-growth drive-thru beverage operator delivering 31% revenue growth with strong unit economics and accelerating traffic. The stock trades near base-case fair value at ~$55 on a forward EV/EBITDA basis. The bull case is achievable if Dutch Bros executes on its 20% annual growth algorithm and pushes restaurant-level margins toward its 30% long-term target.", { after: 160 }),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1200, 2800, 1900, 1600, 1860],
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              thCell("Scenario", 1200),
              thCell("Key Drivers", 2800),
              thCell("FY2026 EBITDA x Multiple", 1900),
              thCell("Implied Price", 1600),
              thCell("vs. Current ~$55", 1860),
            ]
          }),
          new TableRow({
            children: [
              tdCell("Bear Case", 1200, "FCE4D6", true),
              tdCell("SSS growth decelerates to 2-3%, 7 Brew competition intensifies, restaurant margins compress below 26%. Unit openings slow to 100-120/year.", 2800, "FCE4D6"),
              tdCell("$375M x 16x = ~$6.0B EV", 1900, "FCE4D6"),
              tdCell("~$32", 1600, "FCE4D6", true, AlignmentType.CENTER),
              tdCell("Approx. -42% decline", 1860, "FCE4D6"),
            ]
          }),
          new TableRow({
            children: [
              tdCell("Base Case", 1200, GRAY_BG, true),
              tdCell("20% annual revenue growth sustained. SSS normalizes to 4-5%. Restaurant margins reach 29-30% by FY2028. 185+ new shops/year.", 2800, GRAY_BG),
              tdCell("$375M x 26x = ~$9.75B EV", 1900, GRAY_BG),
              tdCell("~$55", 1600, GRAY_BG, true, AlignmentType.CENTER),
              tdCell("Roughly fairly valued", 1860, GRAY_BG),
            ]
          }),
          new TableRow({
            children: [
              tdCell("Bull Case", 1200, "E2EFDA", true),
              tdCell("Maintains 22%+ revenue growth through FY2030. AUV reaches $2.5M+ as food strategy gains traction. 30% restaurant margins unlocked.", 2800, "E2EFDA"),
              tdCell("$375M x 32x = ~$12.0B EV", 1900, "E2EFDA"),
              tdCell("~$68", 1600, "E2EFDA", true, AlignmentType.CENTER),
              tdCell("Approx. +24% upside", 1860, "E2EFDA"),
            ]
          }),
        ]
      }),

      para("Revenue multiple approach reflects market pricing behavior. DCF intrinsic value analysis (bull ~$76 / base ~$47 / bear ~$26) is in Section 5. The stock is priced between DCF base and bull — buyers at current price require above-base execution.", { spaceBefore: 120, italic: true, size: 20, color: "595959" }),

      // ── SECTION 2: BUSINESS SNAPSHOT ──────────────────────────────────────────
      h1("2. BUSINESS SNAPSHOT", true),

      para("Dutch Bros Inc. (NYSE: BROS) is one of the fastest-growing drive-thru beverage brands in the United States, operating and franchising 1,177 shops across 25 states as of Q1 2026. Founded in 1992 in Grants Pass, Oregon, Dutch Bros differentiates through hand-crafted beverages, unparalleled drive-thru speed, and a people-first, community-driven culture that drives industry-leading customer loyalty (74% of transactions through its Dutch Rewards app).", { after: 160 }),

      kvTable([
        ["Current Price", "~$55 (as of June 5, 2026)"],
        ["Market Cap (fully diluted)", "~$9.8B (~177.9M fully exchanged shares)"],
        ["Enterprise Value", "~$9.7B ($9.8B mkt cap - $64M net cash)"],
        ["52-Week Range", "$44.58 - $77.88"],
        ["Q1 2026 Total Revenue", "$464.4M (+30.8% YoY)"],
        ["Q1 2026 Restaurant-Level Contribution Margin", "28.3% (vs. 29.4% prior year)"],
        ["Q1 2026 Adj. EBITDA Margin", "17.1% ($79.4M, +26.2% YoY)"],
        ["FY2026 Guided Revenue", "$2.05-$2.08B (+26% YoY from $1.64B)"],
        ["FY2026 Guided Adj. EBITDA", "$370-$380M (midpoint ~18.2% margin)"],
        ["Cash / Net Cash", "$263.5M cash / ~$64M net cash"],
        ["Total Shops (Q1 2026 end)", "1,177 (844 company-operated, 333 franchised)"],
        ["Systemwide AUV", "$2,160K (Q1 2026, +6.6% YoY)"],
        ["Systemwide SSS Growth", "+8.3% systemwide / +10.6% company-operated (Q1 2026)"],
        ["Dutch Rewards % of Transactions", "74% (up from 72% prior year)"],
        ["FY2025 Annual Revenue", "$1.64B (+27.9% YoY)"],
        ["FY2025 Adj. EBITDA", "~$276M (+38.8% YoY)"],
      ]),

      // ── SECTION 3: BULL CASE ──────────────────────────────────────────────────
      h1("3. BULL CASE", true),

      subHead("Fastest-Growing Beverage Brand With a Category-of-One Position"),
      para("Dutch Bros is not competing with fast food — it is building a beverage category uniquely its own. Q1 2026 delivered the seventh consecutive quarter of transaction growth, with systemwide SSS of +8.3% and company-operated SSS of +10.6%, driven by a 6.9% transaction comp that is rare in the current consumer environment. The brand's 74% Dutch Rewards penetration (versus Starbucks' mid-50s) gives it an unmatched data-driven marketing and personalization engine that is just beginning to be deployed at scale."),

      subHead("Unit Economics Are Improving — AUV Acceleration and Margin Recovery Ahead"),
      para("Systemwide AUV of $2.16M grew 6.6% YoY and is now within reach of Dutch Bros' long-stated target of $2.5M+ per unit. New shop-level EBITDA margins on recently opened company-operated units are tracking above the system average, indicating the newer cohort is maturing quickly. Operating cash flow doubled year-over-year in Q1 2026 ($84.7M vs. ~$31M), signaling that the business is generating meaningful cash even before the margin expansion phase fully arrives."),

      subHead("Long-Term 30% Restaurant Margin Target Is Credible"),
      para("Restaurant-level contribution margin of 28.3% in Q1 2026 (down modestly from 29.4% prior year) was impacted by wage increases and new shop openings, not structural deterioration. Management has consistently guided toward 30% restaurant margins as the unit fleet matures and AUV increases. Chipotle-like operating leverage is achievable at Dutch Bros' scale given its simple menu, no dine-in footprint, and highly efficient ordering flow (mobile ordering, Dutch Lane, drive-thru)."),

      subHead("Whitespace Runway Is Enormous"),
      para("Dutch Bros operates in just 25 states. The company has identified 4,000+ long-term unit potential in the U.S. alone — against 1,177 locations today, that implies a 3x+ build-out ahead. The brand's capital-light franchising model (333 of 1,177 shops are franchised) means this whitespace can be captured at a lower capital intensity than a fully company-operated model. Management's 185+ new shop target for FY2026 represents ~16% unit growth — among the fastest in the restaurant industry."),

      bullet("Q1 2026: 7th consecutive quarter of positive transaction growth; systemwide SSS +8.3%"),
      bullet("AUV of $2.16M growing at 6.6% YoY — approaching $2.5M target"),
      bullet("Operating cash flow doubled YoY ($84.7M in Q1 2026); free cash flow generation accelerating"),
      bullet("4,000+ long-term unit potential vs. 1,177 today; 25 states vs. Starbucks' 50"),
      bullet("Dutch Rewards app at 74% transaction penetration — best-in-class loyalty economics"),

      // ── SECTION 4: BEAR CASE ──────────────────────────────────────────────────
      h1("4. BEAR CASE", true),

      subHead("SSS Deceleration Risk in H2 2026"),
      para("The +8.3% Q1 2026 SSS comp included the benefit of a relatively easy prior-year comparison (Q1 2025 had weather-related headwinds in key Western markets). Management has guided for full-year SSS in the mid-single digits, implying meaningful deceleration in H2 2026. If SSS normalizes to 2-3% on tougher H2 comps, and if traffic growth stalls as interest-rate sensitivity weighs on lower-income consumers, the operating leverage thesis breaks down."),

      subHead("7 Brew and Specialty Coffee Competition Intensifying"),
      para("7 Brew — a fast-growing drive-thru coffee concept backed by Roark Capital — is rapidly expanding in Dutch Bros' core Western and Southern U.S. markets. With a similarly energetic culture and lower price points, 7 Brew represents the most direct competitive threat Dutch Bros has faced. Unlike Starbucks (which Dutch Bros has consistently outperformed on traffic), 7 Brew targets the same drive-thru speed and beverage customization experience that is Dutch Bros' core differentiator. If 7 Brew achieves scale at 3,000+ locations, AUV and margin compression in overlapping markets is a real risk."),

      subHead("Restaurant-Level Margin Compression"),
      para("The 110 basis point YoY decline in restaurant-level contribution margin (28.3% vs. 29.4%) occurred in a quarter with +8.3% SSS. If SSS normalizes or decelerates, the fixed cost absorption deteriorates and margins could fall below 26% — the bear-case threshold. Wage inflation in the Western U.S. (California, Oregon, Washington) remains elevated, and Dutch Bros' labor-intensive drive-thru model is particularly exposed. The company has limited pricing power relative to national chains given its positioning as an everyday affordable indulgence."),

      subHead("Valuation Offers No Margin of Safety"),
      para("At ~$55, the stock trades at ~26x forward EV/EBITDA, pricing in above-base execution before it has been fully delivered. The 28% pullback from the 52-week high of $77.88 has improved the entry, but the stock is still priced between DCF base ($47) and bull ($76). Buyers at current price have no buffer if execution slips in even one quarter."),

      bullet("H2 2026 SSS comps become significantly harder (Q2-Q4 2025 were strong)"),
      bullet("7 Brew expanding into Dutch Bros' core Western/Southern markets with similar positioning"),
      bullet("Restaurant margins below 27% would signal structural cost pressure, not temporary headwinds"),
      bullet("Any guidance cut on FY2026 revenue or EBITDA would re-rate toward bear case ($32)"),
      bullet("Current ~26x EV/EBITDA leaves no margin of safety if growth moderates"),

      // ── SECTION 5: DCF VALUATION ──────────────────────────────────────────────
      h1("5. DCF VALUATION", true),

      para("Dutch Bros is a restaurant/beverage operator, not a SaaS company. Valuation uses the EBITDA-terminal multiple DCF approach (not FCF Gordon Growth). WACC is 12% across all three scenarios — single rate applied consistently per methodology. Terminal multiples are calibrated to projected terminal EBITDA margins."),

      subHead("DCF Model Assumptions"),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2800, 2186, 2187, 2187],
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              thCell("Assumption", 2800),
              thCell("Bear Case", 2186),
              thCell("Base Case", 2187),
              thCell("Bull Case", 2187),
            ]
          }),
          new TableRow({ children: [
            tdCell("FY2026 Revenue (Guided)", 2800, GRAY_BG, true),
            tdCell("$2.05B", 2186, GRAY_BG),
            tdCell("$2.07B", 2187, GRAY_BG),
            tdCell("$2.08B", 2187, GRAY_BG),
          ]}),
          new TableRow({ children: [
            tdCell("Revenue CAGR (FY2026-FY2030)", 2800, BLUE_BG, true),
            tdCell("12-14%", 2186, BLUE_BG),
            tdCell("18-20%", 2187, BLUE_BG),
            tdCell("22-24%", 2187, BLUE_BG),
          ]}),
          new TableRow({ children: [
            tdCell("Terminal Year (FY2030) Revenue", 2800, GRAY_BG, true),
            tdCell("~$3.2B", 2186, GRAY_BG),
            tdCell("~$4.2B", 2187, GRAY_BG),
            tdCell("~$5.1B", 2187, GRAY_BG),
          ]}),
          new TableRow({ children: [
            tdCell("Terminal Year EBITDA Margin", 2800, BLUE_BG, true),
            tdCell("18%", 2186, BLUE_BG),
            tdCell("22%", 2187, BLUE_BG),
            tdCell("26%", 2187, BLUE_BG),
          ]}),
          new TableRow({ children: [
            tdCell("Terminal Year EBITDA", 2800, GRAY_BG, true),
            tdCell("~$576M", 2186, GRAY_BG),
            tdCell("~$924M", 2187, GRAY_BG),
            tdCell("~$1,326M", 2187, GRAY_BG),
          ]}),
          new TableRow({ children: [
            tdCell("Terminal EV/EBITDA Multiple", 2800, BLUE_BG, true),
            tdCell("12x", 2186, BLUE_BG),
            tdCell("18x", 2187, BLUE_BG),
            tdCell("22x", 2187, BLUE_BG),
          ]}),
          new TableRow({ children: [
            tdCell("Terminal EV", 2800, GRAY_BG, true),
            tdCell("~$6.9B", 2186, GRAY_BG),
            tdCell("~$16.6B", 2187, GRAY_BG),
            tdCell("~$29.2B", 2187, GRAY_BG),
          ]}),
          new TableRow({ children: [
            tdCell("WACC", 2800, BLUE_BG, true),
            tdCell("12%", 2186, BLUE_BG),
            tdCell("12%", 2187, BLUE_BG),
            tdCell("12%", 2187, BLUE_BG),
          ]}),
          new TableRow({ children: [
            tdCell("PV of Terminal Value", 2800, GRAY_BG, true),
            tdCell("~$3.9B", 2186, GRAY_BG),
            tdCell("~$9.4B", 2187, GRAY_BG),
            tdCell("~$16.6B", 2187, GRAY_BG),
          ]}),
          new TableRow({ children: [
            tdCell("PV of FCF (5-yr)", 2800, BLUE_BG, true),
            tdCell("~$0.7B", 2186, BLUE_BG),
            tdCell("~$1.0B", 2187, BLUE_BG),
            tdCell("~$1.3B", 2187, BLUE_BG),
          ]}),
          new TableRow({ children: [
            tdCell("Enterprise Value", 2800, GRAY_BG, true),
            tdCell("~$4.6B", 2186, GRAY_BG),
            tdCell("~$10.4B", 2187, GRAY_BG),
            tdCell("~$17.9B", 2187, GRAY_BG),
          ]}),
          new TableRow({ children: [
            tdCell("+ Net Cash", 2800, BLUE_BG, true),
            tdCell("+$64M", 2186, BLUE_BG),
            tdCell("+$64M", 2187, BLUE_BG),
            tdCell("+$64M", 2187, BLUE_BG),
          ]}),
          new TableRow({ children: [
            tdCell("Equity Value", 2800, GRAY_BG, true),
            tdCell("~$4.66B", 2186, GRAY_BG),
            tdCell("~$10.5B", 2187, GRAY_BG),
            tdCell("~$17.96B", 2187, GRAY_BG),
          ]}),
          new TableRow({ children: [
            tdCell("Diluted Shares", 2800, BLUE_BG, true),
            tdCell("177.9M", 2186, BLUE_BG),
            tdCell("177.9M", 2187, BLUE_BG),
            tdCell("177.9M", 2187, BLUE_BG),
          ]}),
          new TableRow({ children: [
            tdCell("INTRINSIC PRICE / SHARE", 2800, NAVY, true),
            tdCell("~$26", 2186, "FCE4D6", true, AlignmentType.CENTER),
            tdCell("~$47", 2187, GRAY_BG, true, AlignmentType.CENTER),
            tdCell("~$76", 2187, "E2EFDA", true, AlignmentType.CENTER),
          ]}),
        ]
      }),

      para("At ~$55, the stock is priced between DCF base ($47) and bull ($76). Buyers at current price are paying for above-base execution before it has been fully delivered. The base case implies ~14% downside; the bull case implies ~38% upside. This asymmetry is acceptable for a current holder, but creates a better risk/reward at or below $47.", { spaceBefore: 120, italic: true, size: 20, color: "595959" }),

      // ── SECTION 6: UNIT ECONOMICS ─────────────────────────────────────────────
      h1("6. UNIT ECONOMICS & GROWTH MODEL", true),

      para("Dutch Bros is evaluated on restaurant/unit economics — not Rule of 40 (which applies to SaaS). Key metrics are AUV trajectory, restaurant-level contribution margin, cash-on-cash returns, and new unit EBITDA ramp."),

      subHead("Unit Economics Snapshot"),

      kvTable([
        ["Systemwide AUV (Q1 2026)", "$2,160K (+6.6% YoY)"],
        ["Company-Operated AUV", "Above system average (selective site curation)"],
        ["Restaurant-Level Contribution Margin (Q1 2026)", "28.3% (vs. 29.4% prior year)"],
        ["Restaurant-Level Contribution Margin Target", "30%+ long-term"],
        ["Avg. Development Cost per Unit", "~$700K-$800K (company-operated)"],
        ["Estimated Cash-on-Cash Return (Mature Unit)", "~35-40% at $2.16M AUV / 28% margin"],
        ["New Unit EBITDA Ramp", "Year 1: ~50-60% of mature; Year 3: full maturity"],
        ["FY2026 New Openings Target", "185+ (approximately 16% unit growth)"],
        ["Total Unit Potential (Mgmt Estimate)", "4,000+ in the U.S."],
        ["Current Penetration", "1,177 / 4,000+ = ~29% of stated potential"],
      ]),

      subHead("Growth Model Drivers"),
      para("Dutch Bros' growth model rests on three compounding levers: (1) unit expansion at 185+ shops/year driving 15-20% annual revenue growth from openings alone; (2) AUV expansion from $2.16M toward $2.5M+ as the food strategy scales and Dutch Rewards drives higher average ticket; and (3) margin expansion from 28% toward 30% restaurant-level margins as new units mature and operating leverage accrues."),

      para("The interplay of AUV growth and margin expansion is the key to the bull case. Each 100bps of margin improvement on $2.5M AUV adds ~$25K of unit-level EBITDA — or roughly $25M across 1,000 units. At 1,500+ shops (achievable by FY2028 at current build pace), that flow-through becomes material to consolidated EBITDA."),

      // ── SECTION 7: COMPETITIVE LANDSCAPE ─────────────────────────────────────
      h1("7. COMPETITIVE LANDSCAPE", true),

      para("Dutch Bros operates in the drive-thru specialty beverage segment — a niche between fast food coffee (McDonald's McCafe) and premium coffeehouse (Starbucks). Its primary competitive reference points are Starbucks, 7 Brew, and other regional drive-thru coffee concepts."),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1600, 1400, 1400, 1400, 1400, 2160],
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              thCell("Company", 1600),
              thCell("Units", 1400),
              thCell("AUV", 1400),
              thCell("Revenue Growth", 1400),
              thCell("EBITDA Margin", 1400),
              thCell("Moat", 2160),
            ]
          }),
          new TableRow({ children: [
            tdCell("Dutch Bros (BROS)", 1600, BLUE_BG, true),
            tdCell("1,177", 1400, BLUE_BG),
            tdCell("$2.16M", 1400, BLUE_BG),
            tdCell("+31% YoY", 1400, BLUE_BG),
            tdCell("~18%", 1400, BLUE_BG),
            tdCell("Brand loyalty, Dutch Rewards, drive-thru speed", 2160, BLUE_BG),
          ]}),
          new TableRow({ children: [
            tdCell("Starbucks (SBUX)", 1600, GRAY_BG, true),
            tdCell("~36,000", 1400, GRAY_BG),
            tdCell("~$1.7M (US drive-thru)", 1400, GRAY_BG),
            tdCell("Mid-single digits", 1400, GRAY_BG),
            tdCell("~15-16%", 1400, GRAY_BG),
            tdCell("Global brand, app ecosystem, premium pricing", 2160, GRAY_BG),
          ]}),
          new TableRow({ children: [
            tdCell("7 Brew (Private)", 1600, BLUE_BG, true),
            tdCell("~600+ (est.)", 1400, BLUE_BG),
            tdCell("~$1.5M (est.)", 1400, BLUE_BG),
            tdCell("Rapid expansion", 1400, BLUE_BG),
            tdCell("N/A (private)", 1400, BLUE_BG),
            tdCell("Similar drive-thru culture; lower price points", 2160, BLUE_BG),
          ]}),
          new TableRow({ children: [
            tdCell("McDonald's (MCD)", 1600, GRAY_BG, true),
            tdCell("~40,000 (global)", 1400, GRAY_BG),
            tdCell("N/A", 1400, GRAY_BG),
            tdCell("Low single digits", 1400, GRAY_BG),
            tdCell("~43-45%", 1400, GRAY_BG),
            tdCell("Scale, convenience, McCafe; lower beverage quality", 2160, GRAY_BG),
          ]}),
          new TableRow({ children: [
            tdCell("Caribou Coffee (Private)", 1600, BLUE_BG, true),
            tdCell("~700 (est.)", 1400, BLUE_BG),
            tdCell("~$0.8M (est.)", 1400, BLUE_BG),
            tdCell("Moderate", 1400, BLUE_BG),
            tdCell("N/A (private)", 1400, BLUE_BG),
            tdCell("Regional; weaker loyalty; coffeehouse format", 2160, BLUE_BG),
          ]}),
        ]
      }),

      para("Dutch Bros' key competitive advantages — 74% Dutch Rewards penetration, drive-thru speed, and an exceptionally strong brand culture — are difficult to replicate quickly. 7 Brew is the most credible near-term competitive threat, but it remains 2x smaller and has not yet demonstrated Dutch Bros' unit-level economics at scale.", { spaceBefore: 120 }),

      // ── SECTION 8: TECHNICAL SETUP ────────────────────────────────────────────
      h1("8. TECHNICAL SETUP", true),

      kvTable([
        ["Current Price", "~$55 (June 5, 2026)"],
        ["52-Week High / Low", "$77.88 / $44.58"],
        ["Pullback from 52-Wk High", "-28.4% — from $77.88 to ~$55"],
        ["Key Support Levels", "$50 (DCF base proximity), $44-45 (52-week low)"],
        ["Key Resistance Levels", "$62.50 (prior support-turned-resistance), $68-70 (bull DCF)"],
        ["20-Day SMA (est.)", "~$54-56 (near current price — consolidating)"],
        ["50-Day SMA (est.)", "~$59-61 (stock below 50-day — short-term bearish)"],
        ["200-Day SMA (est.)", "~$63-65 (stock below 200-day — intermediate-term bearish)"],
        ["RSI (14-day, est.)", "~42-48 (approaching oversold but not extreme)"],
        ["Trend", "Downtrend off Feb 2026 highs; finding support in $50-55 range"],
        ["Volume Pattern", "Recent consolidation on declining volume — potential base building"],
      ]),

      ...(chartData ? [
        new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text: "BROS Daily Chart (Finviz):", font: "Arial", size: 22, bold: true, color: NAVY })] }),
        new Paragraph({
          children: [new ImageRun({ data: chartData, transformation: { width: 540, height: 253 } })]
        }),
        italicNote("Source: Finviz.com. Chart as of June 5, 2026.")
      ] : [
        italicNote("Chart unavailable — please refer to TradingView or Finviz for current BROS chart.")
      ]),

      para("The stock is in a well-defined downtrend off its February 2026 highs but appears to be building a base in the $50-55 zone. A break below $50 (psychological and DCF support) would confirm the bear case setup and re-test the $44-45 52-week low. A close above $62.50 on volume would signal a trend reversal and re-open the path to the $68 bull target.", { spaceBefore: 120 }),

      // ── SECTION 9: OPTIONS STRATEGY ───────────────────────────────────────────
      h1("9. OPTIONS STRATEGY", true),

      para("For Ed as a current long-equity holder: the appropriate options overlay is income generation via covered calls while using pullbacks to accumulate additional shares via cash-secured puts (CSPs) at the DCF base intrinsic value."),

      subHead("Recommended Strategies"),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1400, 1100, 1000, 1100, 1500, 2260],
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              thCell("Strategy", 1400),
              thCell("Structure", 1100),
              thCell("Expiry", 1000),
              thCell("Est. Premium", 1100),
              thCell("Max Gain / Risk", 1500),
              thCell("Rationale", 2260),
            ]
          }),
          new TableRow({ children: [
            tdCell("Covered Call (Income)", 1400, BLUE_BG, true),
            tdCell("Sell $62.50-$65 Call", 1100, BLUE_BG),
            tdCell("6-8 weeks out", 1000, BLUE_BG),
            tdCell("~$1.50-$2.50/share (~3-5%)", 1100, BLUE_BG),
            tdCell("Capped at $62.50-65 upside / current shares at risk", 1500, BLUE_BG),
            tdCell("Generate income at resistance; $62.50 is prior support-turned-resistance. Yield ~3-5% per cycle.", 2260, BLUE_BG),
          ]}),
          new TableRow({ children: [
            tdCell("Cash-Secured Put (Accumulate)", 1400, GRAY_BG, true),
            tdCell("Sell $50 Put", 1100, GRAY_BG),
            tdCell("6-8 weeks out", 1000, GRAY_BG),
            tdCell("~$1.50-$2.00/share (~3-4%)", 1100, GRAY_BG),
            tdCell("Keep premium if $BROS stays above $50; acquire shares at ~$48-48.50 effective cost", 1500, GRAY_BG),
            tdCell("Target adding at effective cost near DCF base intrinsic (~$47). Creates disciplined accumulation below base case.", 2260, GRAY_BG),
          ]}),
          new TableRow({ children: [
            tdCell("Protective Put (Hedge)", 1400, BLUE_BG, true),
            tdCell("Buy $50 Put", 1100, BLUE_BG),
            tdCell("90 days out", 1000, BLUE_BG),
            tdCell("~$3.00-$4.00/share (~5-7%)", 1100, BLUE_BG),
            tdCell("Full downside protection below $50 for 90 days", 1500, BLUE_BG),
            tdCell("Optional. Use if concerned about bear case materializing before Q2 earnings. Expensive given current IV.", 2260, BLUE_BG),
          ]}),
        ]
      }),

      italicNote("Options premiums are estimates based on approximate IV (~35-45% range implied by recent volatility). Verify against live quotes before trading. Per-cycle yield on covered call is not annualized — a ~3-5% per-cycle yield on a 6-8 week CSP or covered call annualizes to approximately 20-40%."),

      // ── SECTION 10: VERDICT ───────────────────────────────────────────────────
      h1("10. VERDICT & MONITORING PLAN", true),

      subHead("Overall Verdict: HOLD / ACCUMULATE ON PULLBACK"),
      para("Dutch Bros is executing at a high level. The Q1 2026 results — 31% revenue growth, +8.3% SSS, record AUV of $2.16M, and operating cash flow doubling year-over-year — confirm that the brand is building a durable, scalable operation with real competitive advantages in customer loyalty, culture, and beverage innovation."),

      para("The Dutch Rewards app (74% of transactions) and the company's people-first culture create differentiation that 7 Brew and other competitors will struggle to replicate on a compressed timeline. The 4,000+ unit potential is credible given the brand's performance in every market it has entered — including high-density suburban and exurban corridors where drive-thru beverage demand is structurally growing."),

      para("At ~$55, the stock is priced between the DCF base case ($47) and the bull case ($76), which means buyers are paying for above-base execution before it has been fully delivered. The base-case EV/EBITDA multiple of ~26x is reasonable for the growth profile but does not offer a margin of safety. The primary risks — SSS deceleration in H2 2026, restaurant-level margin compression, and 7 Brew competition — are real and not fully reflected in the current price."),

      para("The 28% pullback from the 52-week high of $77.88 has created a more attractive entry than existed earlier in the year, but current holders are not in a hurry to add at current prices."),

      subHead("For Ed as a current long-equity holder:"),
      bullet("Hold the position. Do not sell into weakness unless fundamentals deteriorate materially."),
      bullet("Write covered calls at $62.50-$65 on a rolling 6-8 week basis to generate income (3-5% per cycle)."),
      bullet("Sell cash-secured puts at $50 to opportunistically add shares at an effective price near DCF base intrinsic (~$47-48.50)."),
      bullet("Watch for Q2 2026 earnings: any mention of food strategy scale-up and AUV trajectory will be key."),
      bullet("A Q2 beat with SSS at or above 5% and restaurant margins recovering above 29% would be the catalyst to re-rate toward the bull case."),

      subHead("Key Monitoring Metrics"),
      kvTable([
        ["SSS Growth (Q2 2026)", "Target: >5% system; Alert: <3% — signals demand deceleration"],
        ["Restaurant-Level Contribution Margin", "Target: >29%; Alert: <27% — structural margin concern"],
        ["AUV Trajectory", "Target: $2.20M+ next quarter; Alert: flat or declining"],
        ["New Unit Openings Pace", "Target: on track for 185+; Alert: >10% miss on guidance"],
        ["7 Brew Competitive Mentions", "Any earnings call language signaling pricing response = bearish signal"],
        ["Food Strategy Progress", "Menu expansion pilot results; any system-wide rollout announcement = bull catalyst"],
        ["Operating Cash Flow", "Target: continued YoY doubling trend; Alert: significant slowdown"],
      ]),

      para("Catalysts to upgrade to BUY: (1) Q2 SSS at or above 5% with margin recovery above 29%; (2) food strategy scale-up announcement; (3) pullback to $47 or below (DCF base intrinsic). Catalysts to downgrade to SELL: (1) two consecutive quarters of SSS below 3%; (2) restaurant margins below 26%; (3) 7 Brew overlap materially impacting AUV in Western markets.", { spaceBefore: 120 }),

      // SOURCES
      h1("SOURCES", true),

      bullet("Dutch Bros Q1 2026 10-Q (SEC EDGAR, May 2026)"),
      bullet("Dutch Bros Q1 2026 Earnings Press Release 8-K (May 6, 2026)"),
      bullet("Dutch Bros FY2025 10-K (SEC EDGAR, February 2026)"),
      bullet("Yahoo Finance / Investing.com — price and technical data (June 2026)"),
      bullet("QSR Magazine — industry reporting and competitive landscape data"),
      bullet("Peer valuation data from GuruFocus / ValueInvesting.io / AlphaSpread (June 2026)"),

      italicNote("This memo is for informational purposes only and does not constitute financial advice."),

    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  const outPath = "/sessions/optimistic-gifted-darwin/mnt/Stock Ticker Analysis/BROS_Investment_Memo.docx";
  fs.writeFileSync(outPath, buf);
  console.log("Written:", outPath, `(${(buf.length / 1024).toFixed(1)} KB)`);
});
