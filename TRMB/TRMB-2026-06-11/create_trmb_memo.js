const fs = require("fs");
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel, BorderStyle,
  WidthType, ShadingType, PageNumber, ImageRun } = require("/tmp/npm-global/lib/node_modules/docx");

const NAVY="2B4C7E", TEAL="2C7A6B", INK="1A1A1A", MUT="6B7280";
const RED="FFC7CE", YEL="FFEB9C", GRN="C6EFCE", LTEAL="DCEBE7", LNAVY="DCE3EE";
const FONT="Inter";
const CW=9360;
const border={style:BorderStyle.SINGLE,size:1,color:"CCCCCC"};
const borders={top:border,bottom:border,left:border,right:border};

const T=(t,o={})=>new TextRun({text:t,font:FONT,size:o.size||22,bold:o.bold||false,italics:o.it||false,color:o.color||INK});
const P=(runs,o={})=>new Paragraph({children:Array.isArray(runs)?runs:[runs],spacing:{after:o.after!=null?o.after:120,before:o.before||0,line:276},alignment:o.align||AlignmentType.LEFT});
const H1=(t)=>new Paragraph({heading:HeadingLevel.HEADING_1,pageBreakBefore:t._first?false:true,children:[new TextRun({text:t.text||t,font:FONT,size:30,bold:true,color:NAVY})],spacing:{before:120,after:160}});
const H1first=(t)=>new Paragraph({heading:HeadingLevel.HEADING_1,children:[new TextRun({text:t,font:FONT,size:30,bold:true,color:NAVY})],spacing:{before:0,after:160}});
const SUBH=(t)=>P([new TextRun({text:t,font:FONT,size:23,bold:true,color:TEAL})],{after:60,before:120});

function cell(text,w,o={}){
  const runs=Array.isArray(text)?text:[new TextRun({text:String(text),font:FONT,size:o.size||20,bold:o.bold||false,color:o.color||INK})];
  return new TableCell({borders,width:{size:w,type:WidthType.DXA},
    shading:o.fill?{fill:o.fill,type:ShadingType.CLEAR,color:"auto"}:undefined,
    margins:{top:60,bottom:60,left:110,right:110},
    children:[new Paragraph({children:runs,alignment:o.align||AlignmentType.LEFT,spacing:{after:0,line:252}})]});
}
function headerRow(labels,widths){
  return new TableRow({tableHeader:true,children:labels.map((l,i)=>cell([new TextRun({text:l,font:FONT,size:19,bold:true,color:"FFFFFF"})],widths[i],{fill:NAVY,align:i==0?AlignmentType.LEFT:AlignmentType.CENTER}))});
}
function mkTable(widths,headers,rows){
  const trs=[headerRow(headers,widths)];
  rows.forEach(r=>{
    trs.push(new TableRow({children:r.cells.map((c,i)=>cell(c,widths[i],{fill:r.fill,bold:r.bold,align:i==0?AlignmentType.LEFT:AlignmentType.CENTER,color:r.color,size:r.size}))}));
  });
  return new Table({width:{size:CW,type:WidthType.DXA},columnWidths:widths,rows:trs});
}
const bullet=(t)=>new Paragraph({numbering:{reference:"b",level:0},spacing:{after:80,line:276},children:Array.isArray(t)?t:[new TextRun({text:t,font:FONT,size:22,color:INK})]});

const chart=fs.readFileSync("/sessions/nice-loving-clarke/mnt/outputs/trmb_chart.png");

const doc=new Document({
  creator:"Ed", title:"TRMB Investment Memo",
  styles:{default:{document:{run:{font:FONT,size:22}}},
    paragraphStyles:[
      {id:"Heading1",name:"Heading 1",basedOn:"Normal",next:"Normal",quickFormat:true,
        run:{size:30,bold:true,font:FONT,color:NAVY},paragraph:{spacing:{before:120,after:160},outlineLevel:0}}]},
  numbering:{config:[{reference:"b",levels:[{level:0,format:LevelFormat.BULLET,text:"•",alignment:AlignmentType.LEFT,style:{run:{font:FONT},paragraph:{indent:{left:540,hanging:280}}}}]}]},
  sections:[{
    properties:{page:{size:{width:12240,height:15840},margin:{top:1440,right:1440,bottom:1440,left:1440}}},
    headers:{default:new Header({children:[new Paragraph({alignment:AlignmentType.RIGHT,spacing:{after:0},children:[new TextRun({text:"CONFIDENTIAL — INVESTMENT MEMO",font:FONT,size:16,color:MUT,bold:true})]})]})},
    footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:0},children:[new TextRun({text:"Trimble Inc. (TRMB)  ·  ",font:FONT,size:16,color:MUT}),new TextRun({text:"Page ",font:FONT,size:16,color:MUT}),new TextRun({children:[PageNumber.CURRENT],font:FONT,size:16,color:MUT})]})]})},
    children:[
      // ===== TITLE
      new Paragraph({spacing:{after:40},children:[new TextRun({text:"TRMB (Trimble Inc.) — INVESTMENT MEMO",font:FONT,size:40,bold:true,color:NAVY})]}),
      new Paragraph({border:{bottom:{style:BorderStyle.SINGLE,size:12,color:TEAL,space:2}},spacing:{after:120},children:[new TextRun({text:"Geospatial · Construction & Field Technology · Software-Hardware Hybrid",font:FONT,size:20,color:TEAL,italics:true})]}),
      P([T("Date: ",{bold:true}),T("June 11, 2026   |   "),T("Analyst: ",{bold:true}),T("Ed   |   "),T("Rating: ",{bold:true}),T("BUY / ACCUMULATE ON WEAKNESS",{bold:true,color:TEAL})],{after:200}),

      // ===== SECTION 1
      H1first("1. Investment Summary"),
      P([T("Trimble has fallen to roughly $50 — down ~35% year-to-date and the single most oversold name in the S&P 500 (RSI ~26) — even as the company "),T("raised",{bold:true}),T(" its 2026 guidance. The selloff reflects fear that AI-native rivals could erode Trimble’s software moat and soft visibility in Field Systems for the second half of 2026, not a deterioration in current results. The table below frames market-multiple scenarios on forward revenue.")]),
      mkTable([1150,3050,2050,1450,1660],
        ["Scenario","Key Drivers","Revenue × Multiple","Implied Price","vs. Current"],
        [
          {cells:["🐻 Bear","AI rivals erode software share; Field Systems stalls; T&L keeps shrinking; multiple compresses toward hardware peers.","$3.9B × 2.5x ≈ $9.7B EV","$36","▼ ~28%"],fill:RED,size:18},
          {cells:["⚖️ Base","12% ARR growth holds; recurring mix (78%) drives margin expansion; re-rates to mid software-hybrid multiple.","$3.9B × 4.0x ≈ $15.5B EV","$61","▲ ~22%"],fill:YEL,size:18},
          {cells:["🐂 Bull","AI integrations (e.g. Claude-powered SketchUp) accelerate attach + pricing; AECO compounds; FCF margin to 25%+.","$3.9B × 5.5x ≈ $21.3B EV","$86","▲ ~71%"],fill:GRN,size:18},
        ]),
      P([new TextRun({text:"Revenue-multiple approach reflects market pricing behavior. DCF intrinsic value (bull $97 / base $72 / bear $36) is in Section 5 and is the primary anchor for the verdict.",font:FONT,size:18,italics:true,color:MUT})],{before:100,after:40}),

      // ===== SECTION 2
      H1("2. Business Snapshot"),
      P([T("Trimble is a geospatial and field-technology company that fuses precise positioning (GNSS, optical, inertial) with software and recurring services across construction, civil infrastructure, surveying, and transportation. After divesting its agriculture and mobility hardware units, it has reshaped itself into a higher-margin, ~78%-recurring software-and-services business organized in three segments: AECO (architecture, engineering, construction & owners software), Field Systems (positioning hardware + field software), and Transport & Logistics.")]),
      mkTable([4680,4680],["Metric","Value"],[
        {cells:["Current Price","$50.00 (as of Jun 11, 2026)"]},
        {cells:["Market Cap","~$11.75B"]},
        {cells:["Enterprise Value","~$12.9B"]},
        {cells:["52-Week Range","$49.43 – $87.50"]},
        {cells:["Q1 2026 Revenue","$939.9M (+12% YoY, +12% organic)"]},
        {cells:["Annualized Recurring Revenue (ARR)","$2.44B (+12% YoY, +12% organic)"]},
        {cells:["Recurring / Software % of Revenue","78%"]},
        {cells:["Non-GAAP Gross Margin","71.0%"]},
        {cells:["Non-GAAP Operating Margin","25.9%"]},
        {cells:["Adj. EBITDA Margin","27.4%"]},
        {cells:["Q1 FCF / FCF Margin","$268.6M / 28.6% (seasonally high)"]},
        {cells:["Cash / Total Debt / Net Leverage","$234M / $1,413M / 1.1x"]},
        {cells:["Diluted Shares","~235M"]},
        {cells:["Rule of 40 (growth + NG op margin)","~38 (12% + 25.9%)"],fill:LTEAL,bold:true},
        {cells:["FY2026 Guided Revenue","$3.84B – $3.92B (~+10% vs FY25E)"]},
        {cells:["FY2026 Guided Non-GAAP EPS","$3.47 – $3.64"]},
      ]),

      // ===== SECTION 3 BULL
      H1("3. Bull Case"),
      SUBH("A recurring-revenue compounder priced like cyclical hardware"),
      P([T("78% of revenue is now software, services, and subscriptions, and ARR grew 12% organically to $2.44B. Yet at ~3.3x EV/sales and ~14x forward earnings, TRMB trades closer to hardware-blend peers (Zebra ~2.8x, AGCO ~1.1x) than to infrastructure-software peers like Bentley (~9.5x) or Autodesk (~8x). If the market re-rates Trimble even partway toward its recurring-revenue quality, the multiple expansion alone is worth tens of percent.")]),
      SUBH("Margin expansion is structural, not cyclical"),
      P([T("The portfolio reshaping (exiting low-margin ag/mobility hardware) lifted non-GAAP operating margin to 25.9% and adjusted EBITDA margin to 27.4% in Q1 2026. As the mix tilts further toward subscription software, gross margin (71% non-GAAP) and FCF conversion should keep climbing. Our base case models FCF margin rising from ~17% in 2026 to ~22% by 2030 — a credible path given the recurring base.")]),
      SUBH("AI as an accelerant to the workflow moat"),
      P([T("Trimble launched a Claude-powered SketchUp integration alongside its Q1 results. Rather than a threat, generative AI layered onto Trimble’s proprietary field, design, and as-built data can deepen switching costs and create new monetization (AI-assisted design, automated takeoffs, constructible models). The bear narrative treats AI purely as disruption risk; the bull case is that Trimble’s data and installed base are exactly what make these features defensible.")]),
      SUBH("AECO is the growth engine"),
      P([T("AECO revenue grew 16.6% YoY in Q1 to $391.1M, the fastest of the three segments, riding the secular digitization of construction and infrastructure. Combined with a balance sheet at just 1.1x net leverage and $608M left on buyback authorization (4.7M shares / $317M repurchased in Q1 alone), management can compound per-share value through the downturn in sentiment.")]),
      SUBH("Sell-side still sees substantial upside"),
      P([T("Consensus remains Buy with an average target around $93 (range $79–$103). Even after cutting targets, Barclays ($79, Overweight) and Oppenheimer ($80, Outperform) sit far above the current ~$50 — the cut was to the magnitude of upside, not the direction.")]),

      // ===== SECTION 4 BEAR
      H1("4. Bear Case"),
      SUBH("AI could commoditize the software premium"),
      P([T("The core reason the stock de-rated: faster-moving, AI-native competitors in cloud design and construction software could out-innovate Trimble and compress the very software multiple the bull case depends on. If AECO’s growth slows or its pricing power erodes, the case for a software-like multiple weakens and TRMB drifts toward a hardware valuation — the bear $36 outcome.")]),
      SUBH("Field Systems visibility and hardware cyclicality"),
      P([T("Field Systems (+13.9% in Q1) still carries hardware exposure tied to construction and capital-equipment cycles. Oppenheimer explicitly flagged limited second-half-2026 visibility here. Higher-for-longer rates, a construction slowdown, or tariff-driven cost pressure would hit this segment first, and a single soft guide could re-ignite the selloff.")]),
      SUBH("Transport & Logistics is shrinking"),
      P([T("T&L revenue fell 4.4% YoY to $139.6M — a persistent drag and a reminder that not every segment participates in the recurring-revenue story. Continued declines weigh on blended growth and complicate the “clean software compounder” thesis.")]),
      SUBH("The chart is broken"),
      P([T("Price sits below both the 50- and 200-day moving averages in a clear downtrend, and falling knives can keep falling regardless of fundamentals. Buying a name making fresh 52-week lows requires either a strong stomach or a disciplined, staged entry — momentum is firmly against the long here.")]),

      // ===== SECTION 5 DCF
      H1("5. DCF Valuation"),
      P([T("Five-year unlevered free-cash-flow projection off an estimated FY2025 revenue base of ~$3.52B, with a terminal exit multiple on Year-5 FCF, discounted at a single 9.5% WACC across all three scenarios (per methodology — only growth, margin, and exit multiple vary).")]),
      mkTable([3060,2100,2100,2100],["Metric","Bear","Base","Bull"],[
        {cells:["Discount Rate (WACC)","9.5%","9.5%","9.5%"]},
        {cells:["Terminal Growth (x-check)","2.5%","3.5%","4.0%"]},
        {cells:["Rev Growth Yr1–Yr5","7→3%","10→7%","11→9%"]},
        {cells:["Terminal FCF Margin","17%","22%","25%"]},
        {cells:["Terminal EV/FCF Multiple","15x","20x","22x"]},
        {cells:["Implied Enterprise Value","$9.6B","$18.1B","$23.9B"]},
        {cells:["Less: Net Debt","($1.2B)","($1.2B)","($1.2B)"]},
        {cells:["Equity Value","$8.5B","$16.9B","$22.7B"]},
        {cells:["Intrinsic Price / Share","$36","$72","$97"],bold:true,fill:LNAVY},
        {cells:["Current Price","$50","$50","$50"]},
        {cells:["Premium / (Discount)","(28%)","+44%","+93%"],bold:true},
      ]),
      P([T("At ~$50, TRMB trades 31% below the base-case intrinsic value of $72 and only ~39% above the bear case of $36 — the market is pricing in something close to the bear scenario. The risk/reward is asymmetric to the upside: ~44% to base and ~93% to bull, against ~28% downside if the AI-disruption fear fully plays out.")]),

      // ===== SECTION 6 RULE OF 40
      H1("6. Rule of 40 Analysis"),
      P([T("Rule of 40 (revenue growth % + profitability margin %) is a quality screen for software-led businesses; Trimble is a hybrid, so we show it on three bases. Note: Trimble is ~78% recurring but retains hardware exposure, so the FCF-margin reading runs lower than a pure-SaaS peer.")]),
      mkTable([3960,1800,1800,1800],["Basis","Growth","Profit %","Rule of 40"],[
        {cells:["Q1’26 organic ARR + NG op margin","12%","25.9%","~38"],fill:LTEAL,bold:true},
        {cells:["Q1’26 rev growth + adj. EBITDA margin","12%","27.4%","~39"]},
        {cells:["FY26E rev growth + FCF margin","10%","17.5%","~28"]},
      ]),
      P([T("Trimble sits just below the 40 threshold on its strongest (margin-based) reading and clearly below it on FCF — a solid, profitable compounder rather than a hypergrowth name. The investment case rests on durable low-teens recurring growth plus margin expansion and a cheap entry multiple, not on a 40+ growth-efficiency score.")]),

      // ===== SECTION 7 PEERS
      H1("7. Peer Comparables"),
      mkTable([1900,1100,1500,1450,1410,2000],
        ["Company","Ticker","Fwd Rev Gr","FCF Margin","Fwd EV/Sales","Note"],[
        {cells:["Trimble","TRMB","10%","17.5%","3.3x","78% recurring"],fill:YEL,bold:true},
        {cells:["Hexagon AB","HXGBY","6%","20%","4.5x","Closest geo peer"]},
        {cells:["Bentley Systems","BSY","11%","27%","9.5x","Infra SW pure-play"]},
        {cells:["Autodesk","ADSK","11%","30%","8.0x","Design software"]},
        {cells:["Zebra Tech","ZBRA","6%","13%","2.8x","Enterprise HW+SW"]},
        {cells:["AGCO","AGCO","2%","7%","1.1x","Ag, cyclical"]},
        {cells:["Topcon","7732.T","5%","8%","1.3x","Positioning/medical"]},
      ]),
      P([new TextRun({text:"Peer figures are approximate, for relative context only.",font:FONT,size:18,italics:true,color:MUT})],{after:60}),
      P([T("Trimble’s ~3.3x forward EV/sales sits at a steep discount to software-pure infrastructure peers (Bentley 9.5x, Autodesk 8x) and below its closest geospatial comp (Hexagon ~4.5x), despite a comparable or better recurring mix. The comps imply meaningful re-rating room if Trimble defends its software growth — and explain why the bear case hinges entirely on that “if.”")]),

      // ===== SECTION 8 TECHNICAL
      H1("8. Technical Setup"),
      new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:60},children:[new ImageRun({type:"png",data:chart,transformation:{width:600,height:282},altText:{title:"TRMB Daily Chart",description:"Trimble daily price chart with SMAs",name:"TRMBchart"}})]}),
      new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:140},children:[new TextRun({text:"TRMB Daily Chart — SMA 20/50/200  |  Source: Finviz.com  |  June 11, 2026",font:FONT,size:16,italics:true,color:MUT})]}),
      mkTable([4680,4680],["Indicator","Reading"],[
        {cells:["Current Price","$50.00"]},
        {cells:["52-Week Range","$49.43 – $87.50"]},
        {cells:["50-Day SMA (approx)","~$62 (price below — bearish)"]},
        {cells:["200-Day SMA (approx)","~$73 (price below — bearish)"]},
        {cells:["RSI (14)","~26 (oversold; most oversold in S&P 500)"]},
        {cells:["Implied Volatility / IV Rank","Elevated (IV Rank ~70+)"]},
      ]),
      P([T("TRMB is in a confirmed downtrend, trading below both key moving averages and printing fresh 52-week lows near $49–50, which is now the obvious support shelf; resistance sits at the 50-day (~$62) then the gap toward $73. RSI near 26 signals deeply oversold conditions that often precede a bounce, but oversold can persist. The practical read: this is a level to begin accumulating in tranches, not to chase — and elevated IV means options can pay you to wait.")]),

      // ===== SECTION 9 OPTIONS
      H1("9. Options Strategy Recommendation"),
      P([T("With the stock trading at a discount to DCF base ($72) and IV elevated after the selloff, the textbook structure for a no-position investor is to "),T("sell premium to initiate",{bold:true}),T(" rather than buy expensive calls. High IV favors cash-secured puts; reserve long calls/LEAPs for a smaller, time-matched directional sleeve.")]),
      SUBH("Cash-Secured Put — primary initiation"),
      bullet([new TextRun({text:"Structure: ",font:FONT,size:22,bold:true}),new TextRun({text:"Sell the $45 put, ~60 DTE. Est. premium ~$2.00 ($200/contract). Max gain $200; max loss $4,300 (assignment to 0).",font:FONT,size:22})]),
      bullet([new TextRun({text:"Rationale: ",font:FONT,size:22,bold:true}),new TextRun({text:"~4.4% per-cycle yield; net entry ~$43 if assigned — a 40% discount to base-case intrinsic value. Gets paid by elevated IV to wait for a better price.",font:FONT,size:22})]),
      SUBH("Cash-Secured Put — deeper / safer"),
      bullet([new TextRun({text:"Structure: ",font:FONT,size:22,bold:true}),new TextRun({text:"Sell the $42.50 put, ~60 DTE. Est. premium ~$1.40 ($140). Max loss $4,110.",font:FONT,size:22})]),
      bullet([new TextRun({text:"Rationale: ",font:FONT,size:22,bold:true}),new TextRun({text:"Strike sits below the 52-week low; collect ~3.3% per cycle while the downtrend resolves.",font:FONT,size:22})]),
      SUBH("Long LEAP — leveraged upside sleeve"),
      bullet([new TextRun({text:"Structure: ",font:FONT,size:22,bold:true}),new TextRun({text:"Buy the Jan-2027 $50 call, est. debit ~$6.50 ($650). Max loss $650; upside unbounded.",font:FONT,size:22})]),
      bullet([new TextRun({text:"Rationale: ",font:FONT,size:22,bold:true}),new TextRun({text:"Matches the multi-quarter re-rating thesis (target DCF base $72). Time the expiry to the thesis, not the cheapest strike.",font:FONT,size:22})]),
      SUBH("Covered Call — after assignment"),
      bullet([new TextRun({text:"Structure: ",font:FONT,size:22,bold:true}),new TextRun({text:"Once long shares, sell the $60 call ~45 DTE to harvest IV above cost.",font:FONT,size:22})]),
      P([new TextRun({text:"Per-cycle yields, not annualized. Size positions so the bear-case outcome ($36) does not cause unacceptable portfolio loss.",font:FONT,size:20,bold:true,color:"C0392B"})],{before:100}),

      // ===== SECTION 10 VERDICT
      H1("10. Verdict"),
      P([new TextRun({text:"Rating: BUY / ACCUMULATE ON WEAKNESS",font:FONT,size:26,bold:true,color:TEAL})],{after:120}),
      P([T("Trimble is a fundamentally improved business — ~78% recurring revenue, 12% organic ARR growth, 25.9% non-GAAP operating margins, strong free cash flow, and a 1.1x-levered balance sheet — that the market is valuing as if its software franchise is about to break. The strongest single data point is the disconnect: management raised 2026 guidance while the stock fell to the most oversold reading in the entire S&P 500.")]),
      P([T("On valuation, the current ~$50 sits 31% below our base-case DCF of $72 and barely above the bear case of $36, which assumes AI rivals genuinely erode the software moat and Field Systems stalls. That is a real risk and the reason for a staged entry rather than a full position — but at ~14x forward earnings and ~3.3x EV/sales for a recurring-revenue compounder, the price already discounts a lot of bad news. Risk/reward is roughly +44% to base and +93% to bull versus ~28% downside.")]),
      P([T("Action: begin accumulating equity in tranches near $48–50 with adds on further weakness toward the bear-case zone, OR initiate via the $45 / $42.50 cash-secured puts to harvest elevated IV and engineer a sub-$45 entry. Add a small Jan-2027 $50 LEAP sleeve for leveraged exposure to a re-rating. Do not size the full position at once — the chart is in a downtrend and the AI-competition risk is genuine.")]),
      P([new TextRun({text:"Sources: Trimble Q1 2026 results (8-K Ex-99.1, SEC EDGAR, May 2026); Trimble Q1 2026 10-Q (SEC EDGAR); Trimble FY2024 results 8-K; market & analyst data (Yahoo Finance, MarketScreener, Simply Wall St, GuruFocus, Finviz), June 2026; Day One / Open Brain (no prior TRMB thesis found). This memo is for informational purposes only and does not constitute financial advice.",font:FONT,size:16,italics:true,color:MUT})],{before:160}),
    ]
  }]
});

Packer.toBuffer(doc).then(b=>{fs.writeFileSync("TRMB_Investment_Memo.docx",b);console.log("memo written",b.length,"bytes");});
