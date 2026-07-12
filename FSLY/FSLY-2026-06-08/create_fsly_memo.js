const fs = require("fs");
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        Header, Footer, AlignmentType, LevelFormat, HeadingLevel, BorderStyle,
        WidthType, ShadingType, PageNumber, ImageRun, ExternalHyperlink } = require("/tmp/npm-global/lib/node_modules/docx");

const NAVY = "1F4E79";
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const CW = 9360;

function h1(t){return new Paragraph({heading:HeadingLevel.HEADING_1,children:[new TextRun(t)]});}
function h1b(t){return new Paragraph({heading:HeadingLevel.HEADING_1,pageBreakBefore:true,children:[new TextRun(t)]});}
function h2(t){return new Paragraph({heading:HeadingLevel.HEADING_2,children:[new TextRun(t)]});}
function p(runs,opts={}){return new Paragraph({spacing:{after:120},...opts,children:Array.isArray(runs)?runs:[new TextRun(runs)]});}
function t(text,o={}){return new TextRun({text,...o});}
function bullet(text){return new Paragraph({numbering:{reference:"b",level:0},spacing:{after:60},children:Array.isArray(text)?text:[new TextRun(text)]});}

function cell(text,{w,fill,bold,align,size}={}){
  const runs = Array.isArray(text)?text:[new TextRun({text:String(text),bold:!!bold,size:size||20})];
  return new TableCell({borders,width:{size:w,type:WidthType.DXA},
    shading:fill?{fill,type:ShadingType.CLEAR}:undefined,
    margins:{top:80,bottom:80,left:120,right:120},
    children:[new Paragraph({alignment:align||AlignmentType.LEFT,children:runs})]});
}
function hrow(cells,widths,fill=NAVY){
  return new TableRow({children:cells.map((c,i)=>cell([new TextRun({text:c,bold:true,color:"FFFFFF",size:20})],{w:widths[i],fill}))});
}
function row(cells,widths,fills=[]){
  return new TableRow({children:cells.map((c,i)=>cell(c,{w:widths[i],fill:fills[i]}))});
}

const children = [];

// Title
children.push(new Paragraph({spacing:{after:40},children:[new TextRun({text:"FSLY (Fastly, Inc.) — INVESTMENT MEMO",bold:true,size:36,color:NAVY})]}));
children.push(new Paragraph({spacing:{after:240},children:[new TextRun({text:"Date: June 8, 2026  |  Analyst: Ed  |  Rating: HOLD (Accumulate on weakness)  |  Vehicle: Long equity + income options overlay",italic:true,size:20,color:"595959"})]}));

// ---------------- Section 1 ----------------
children.push(h1("1. Investment Summary"));
children.push(p([t("Fastly trades at "),t("$20.09",{bold:true}),t(" after a sharp ~38% pullback from its May 2026 high of $32.36. The business has genuinely inflected — Q1 2026 revenue grew 20% YoY to $173.0M, Security grew 47%, non-GAAP gross margin hit a record 65.1%, and the company is now non-GAAP profitable and free-cash-flow positive. The question is no longer whether Fastly can survive; it is whether 15% top-line growth justifies today's price. On a revenue-multiple framework:")]));
const w1=[1150,2950,1900,1560,1800];
children.push(new Table({width:{size:CW,type:WidthType.DXA},columnWidths:w1,rows:[
  hrow(["Scenario","Key Drivers","Revenue × Multiple","Implied Price","vs. Current"],w1),
  row(["🐻 Bear","Growth fades to high-single digits as Cloudflare/hyperscalers compress CDN pricing; Security can't offset.","$0.72B × 2.5x ≈ $1.79B EV","~$11","▼ ~46%"],w1,["FFC7CE","FFC7CE","FFC7CE","FFC7CE","FFC7CE"]),
  row(["⚖️ Base","Mid-teens growth holds; margins expand steadily but no re-rating to growth-SaaS multiples.","$0.72B × 4.0x ≈ $2.87B EV","~$17","▼ ~13%"],w1,["FFEB9C","FFEB9C","FFEB9C","FFEB9C","FFEB9C"]),
  row(["🐂 Bull","Security + AI inference drive 20%+ growth re-acceleration; FCF margin scales toward 25%.","$0.72B × 6.0x ≈ $4.31B EV","~$26","▲ ~30%"],w1,["C6EFCE","C6EFCE","C6EFCE","C6EFCE","C6EFCE"]),
]}));
children.push(new Paragraph({spacing:{before:120,after:120},children:[new TextRun({text:"Revenue-multiple approach reflects market pricing behavior. DCF intrinsic value analysis (bull $24.16 / base $12.55 / bear $6.97) is in Section 5.",italic:true,size:18})]}));
children.push(p([t("Verdict: "),t("HOLD",{bold:true}),t(". At $20, the market already prices Fastly close to its bull-case DCF and well above base case. The inflection is real but the current quote leaves little margin of safety. Hold existing shares, harvest income with covered calls into resistance, and add via cash-secured puts only on a pullback toward the $13–17 intrinsic zone.")]));

// ---------------- Section 2 ----------------
children.push(h1b("2. Business Snapshot"));
children.push(p("Fastly operates a global edge cloud platform — content delivery (CDN), edge compute, and a fast-growing security suite (Next-Gen WAF, Bot Management, API Security). Its differentiator is a smaller but more powerful network of points-of-presence with software-programmable edge compute, favored by performance-sensitive enterprises. After years of single-digit growth and heavy losses, the model inflected in late 2025 as Security scaled and management drove operating leverage."));
const w2=[4680,4680];
children.push(new Table({width:{size:CW,type:WidthType.DXA},columnWidths:w2,rows:[
  hrow(["Metric","Value"],w2),
  row(["Current Price","$20.09 (as of June 5–7, 2026)"],w2),
  row(["Market Cap","~$3.1B"],w2),
  row(["Enterprise Value","~$3.1B (net cash ~$7M)"],w2),
  row(["52-Week Range","$6.29 – $34.82"],w2),
  row(["Q1 2026 Revenue","$173.0M (+20% YoY)"],w2),
  row(["Security Revenue","$38.8M (+47% YoY; 22% of total)"],w2),
  row(["Non-GAAP Gross Margin","65.1% (record)"],w2),
  row(["Non-GAAP Operating Margin","11.1%"],w2),
  row(["Adj. EBITDA Margin","17.0%"],w2),
  row(["FY2025 FCF Margin","7.3% ($45.8M)"],w2),
  row(["Cash + Securities / Debt","$330M / $324M convertible notes"],w2),
  row(["Diluted Shares (valuation)","~165M (basic 156.4M)"],w2),
  row(["Rule of 40 (Q1'26 ann., EBITDA basis)","37"],w2),
  row(["FY2026 Guided Revenue","$710–725M (+~15% YoY)"],w2),
  row(["LTM Net Retention Rate","113% (up from 100% a year ago)"],w2),
  row(["Total RPO","$369M (+63% YoY)"],w2),
  row(["Large Customers (>$100K)","634"],w2),
]}));

// ---------------- Section 3 Bull ----------------
children.push(h1b("3. Bull Case"));
children.push(h2("Growth has genuinely inflected"));
children.push(p("After bottoming at ~7–8% growth in early 2025, revenue re-accelerated every quarter: 8% → 12% → record Q3 → Q4 +23% → Q1 2026 +20% YoY. RPO jumped 63% to $369M and LTM net retention climbed to 113% from 100% a year earlier. This is not a one-quarter blip; it is a multi-quarter trend management explicitly calls an \"inflection,\" driven by platform cross-sell and a healthier customer mix."));
children.push(h2("Security is the engine"));
children.push(p("Security revenue grew 47% YoY to $38.8M and now represents 22% of total revenue. Fastly's Next-Gen WAF, Bot Management (with new Content Guard for AI bots), and API Security suite are higher-margin, stickier, and less usage-volatile than legacy CDN. As this mix shifts, both growth durability and gross margin improve — non-GAAP gross margin already hit a record 65.1%."));
children.push(h2("Margin inflection and real free cash flow"));
children.push(p("Fastly swung from a non-GAAP operating loss to $19.1M of non-GAAP operating income in Q1 2026 (11.1% margin) and $29.5M adjusted EBITDA (17.0%). FY2025 generated $45.8M of free cash flow. Guidance calls for $58–68M of non-GAAP operating income in 2026. The operating-leverage story is no longer theoretical."));
children.push(h2("AI as an emerging tailwind"));
children.push(p("Management frames AI as an increasing tailwind: edge delivery and security for AI applications, plus new tooling (Fastly Agent Toolkit, Content Guard to monetize/control AI bot traffic). Marquee Q1 wins — a large social platform's API and video workloads, an in-browser VPN, a global API-security cross-sell — show the platform landing multi-product, multimillion-dollar ARR deals."));

// ---------------- Section 4 Bear ----------------
children.push(h1b("4. Bear Case"));
children.push(h2("Valuation already discounts the inflection"));
children.push(p("At $20, Fastly's EV/forward revenue of ~4.4x is reasonable for 15% growth — but the DCF base case is just $12.55, a 38% discount to the current price. The market is paying near the bull-case DCF ($24) today, leaving essentially no margin of safety if growth or margins disappoint even slightly."));
children.push(h2("Network Services is still the majority — and it grows slowly"));
children.push(p("Security gets the headlines, but Network Services (core CDN) is $126.2M of the $173.0M total and grew only 11%. Commodity CDN faces relentless price pressure from Cloudflare, Amazon CloudFront, Akamai, and the hyperscalers. If Security growth ever decelerates, the blended rate reverts toward the low-double-digits that the bear case assumes."));
children.push(h2("Usage-based revenue and customer concentration"));
children.push(p("Fastly's top-ten customers are ~34% of revenue and the model is usage-based, which historically produced volatile quarters (a single large customer's traffic shift caused a guidance shock in 2021). Concentration plus usage volatility makes the smooth re-acceleration the bull case extrapolates inherently fragile."));
children.push(h2("Convertible-note overhang and dilution"));
children.push(p("Fastly carries ~$324M of convertible notes against ~$330M of cash, so net cash is roughly zero — there is no balance-sheet cushion to fund a downturn or buy back stock. Non-GAAP diluted share count has crept up (176.5M in Q1'26 vs 143M a year earlier), and guidance assumes 182M for FY2026 — ongoing dilution that the per-share intrinsic value must absorb."));

// ---------------- Section 5 DCF ----------------
children.push(h1b("5. DCF Valuation"));
children.push(p("Five-year free-cash-flow projection with a Gordon Growth terminal value, built from the FY2026 revenue guidance midpoint ($717.5M) as the Year-1 base. Per project methodology, a single 11% WACC is applied across all three scenarios — only growth, FCF-margin ramp, and terminal growth differ."));
const w5=[3060,2100,2100,2100];
children.push(new Table({width:{size:CW,type:WidthType.DXA},columnWidths:w5,rows:[
  hrow(["Metric","Bull","Base","Bear"],w5),
  row(["WACC (single)","11%","11%","11%"],w5),
  row(["Terminal Growth","4.5%","3.5%","3.0%"],w5),
  row(["Yr2 Revenue Growth","20%","13%","9%"],w5),
  row(["Yr3 Revenue Growth","18%","12%","7%"],w5),
  row(["Yr4 Revenue Growth","16%","11%","6%"],w5),
  row(["Yr5 Revenue Growth","14%","10%","5%"],w5),
  row(["Terminal FCF Margin","26%","19%","13%"],w5),
  row(["Implied EV","$3.98B","$2.06B","$1.14B"],w5),
  row(["+ Net Cash","$0.01B","$0.01B","$0.01B"],w5),
  row(["Equity Value","$3.99B","$2.07B","$1.15B"],w5),
  row(["Intrinsic Price/Share",[t("$24.16",{bold:true})],[t("$12.55",{bold:true})],[t("$6.97",{bold:true})]],w5,["C6EFCE","FFEB9C","FFC7CE"]),
  row(["Current Price","$20.09","$20.09","$20.09"],w5),
  row(["Premium/(Discount)",[t("+20%",{bold:true})],[t("(37%)",{bold:true})],[t("(65%)",{bold:true})]],w5),
]}));
children.push(p([t("Interpretation: ",{bold:true}),t("the current $20.09 sits between the base ($12.55) and bull ($24.16) cases — and much closer to bull. In other words, the market is already paying for a successful, durable re-acceleration to ~20% growth and a march toward 25%+ FCF margins. Fundamentals on a base-case path support roughly $13. This is the core valuation concern: the inflection is real, but the price has largely captured it.")]));

// ---------------- Section 6 Rule of 40 ----------------
children.push(h1b("6. Rule of 40 Analysis"));
children.push(p("Rule of 40 sums revenue growth % and a profitability margin %; >40 is considered healthy for a software business."));
const w6=[3360,2000,2000,2000];
children.push(new Table({width:{size:CW,type:WidthType.DXA},columnWidths:w6,rows:[
  hrow(["Basis","Growth %","Margin %","Rule of 40"],w6),
  row(["FY2025 — Adj. EBITDA margin","14.8%","12.4%","27"],w6),
  row(["FY2025 — FCF margin","14.8%","7.3%","22"],w6),
  row(["Q1 2026 — Adj. EBITDA margin (ann.)","20%","17.0%","37"],w6,["C6EFCE","C6EFCE","C6EFCE","C6EFCE"]),
  row(["Q1 2026 — Non-GAAP op margin (ann.)","20%","11.1%","31"],w6),
]}));
children.push(p("Fastly is not yet a Rule-of-40 company, but the trajectory is unmistakable: from 22–27 in FY2025 to ~37 on a Q1 2026 annualized, EBITDA basis. If the 20% growth and margin expansion hold, Fastly crosses 40 within the next few quarters — the single most important fundamental milestone for a re-rating. Note Q1 FCF margin is seasonally depressed by elevated capex, so the EBITDA-basis score is the better read."));

// ---------------- Section 7 Peers ----------------
children.push(h1b("7. Peer Comparables"));
const w7=[1900,1100,1500,1400,1300,2160];
children.push(new Table({width:{size:CW,type:WidthType.DXA},columnWidths:w7,rows:[
  hrow(["Company","Ticker","Fwd Growth","FCF Margin","Fwd EV/Sales","Note"],w7),
  row(["Fastly","FSLY","~16%","~10%","4.4x","Subject — accelerating Security"],w7,["FFEB9C","FFEB9C","FFEB9C","FFEB9C","FFEB9C","FFEB9C"]),
  row(["Cloudflare","NET","~30%","~12%","28x","Premium hypergrowth comp"],w7),
  row(["Akamai","AKAM","~6%","~22%","4.3x","Mature; security/compute pivot"],w7),
  row(["Datadog","DDOG","~24%","~27%","13x","High Rule of 40"],w7),
  row(["CDN/infra avg","—","~10%","~18%","~4x","Mature infrastructure"],w7),
  row(["Hypergrowth SaaS avg","—","~28%","~15%","~25x","Cloudflare-tier"],w7),
  row(["Edgio (defunct)","—","n/a","n/a","n/a","Cautionary commodity-CDN comp"],w7),
]}));
children.push(p("Fastly trades essentially in line with mature Akamai (~4.3x) despite growing ~3x faster, and at one-sixth of Cloudflare's multiple. That gap is the bull's argument: if Fastly sustains 20% growth and crosses Rule of 40, a re-rating toward 6–8x sales is plausible. The bear's rebuttal: the market has burned CDN investors before (Edgio went to zero), and a 4.4x multiple on 15% growth with commodity-CDN exposure is not obviously cheap."));

// ---------------- Section 8 Technical ----------------
children.push(h1b("8. Technical Setup"));
let chartPara;
try {
  const img = fs.readFileSync("fsly_chart.png");
  chartPara = new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:60},children:[new ImageRun({type:"png",data:img,transformation:{width:600,height:282},altText:{title:"FSLY daily chart",description:"Fastly daily price chart with moving averages",name:"FSLYChart"}})]});
} catch(e){ chartPara = p("[Chart unavailable]"); }
children.push(chartPara);
children.push(new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:160},children:[new TextRun({text:"FSLY Daily Chart — SMA 20/50/200 | Source: Finviz.com | June 8, 2026",italic:true,size:16,color:"808080"})]}));
const w8=[4680,4680];
children.push(new Table({width:{size:CW,type:WidthType.DXA},columnWidths:w8,rows:[
  hrow(["Indicator","Level / Reading"],w8),
  row(["Current Price","$20.09"],w8),
  row(["52-Week Range","$6.29 – $34.82"],w8),
  row(["20-Day SMA (est.)","~$21.2"],w8),
  row(["50-Day SMA","$23.34 — price BELOW (resistance)"],w8),
  row(["200-Day SMA","$17.14 — price ABOVE (support)"],w8),
  row(["RSI (14, est.)","~41 (neutral, recovering from oversold)"],w8),
  row(["Implied Volatility","Elevated after 38% one-month drop"],w8),
]}));
children.push(p("Fastly is in a corrective consolidation: it round-tripped from $6 to $34 and back to $20, and now sits between its rising 200-day SMA ($17.14, support) and falling 50-day SMA ($23.34, resistance). The structure favors a range trade — buyers near $17–18, sellers near $23–25. RSI near 41 signals neither momentum extreme. Most usefully for an overlay, IV is elevated after the sharp drop, which makes selling premium (covered calls, cash-secured puts) attractive relative to buying it."));

// ---------------- Section 9 Options ----------------
children.push(h1b("9. Options Strategy Recommendation"));
children.push(p("Your position is 100–500 shares with an income objective. With the stock below its DCF bull case, sitting under 50-day resistance, and IV elevated, the highest-probability income approach is to SELL premium — covered calls as the core, cash-secured puts to add on weakness. (Per-cycle yields below, not annualized.)"));
children.push(h2("Covered Call — primary income"));
children.push(bullet("Structure: Sell the ~$25 call, ~45–60 DTE (e.g., August 2026), 1 contract per 100 shares held."));
children.push(bullet("Premium: est. ~$1.00/share (~$100 per contract). Max gain: premium + $4.91 appreciation to the $25 strike ≈ $591/contract."));
children.push(bullet("Rationale: $25 is above the 50-day SMA resistance and near the bull-case DCF ($24.16), so you are capping upside only where fundamentals and technicals both turn unfavorable. ~5% per-cycle yield on a $20 stock; you keep the shares unless called away."));
children.push(h2("Cash-Secured Put — add on weakness"));
children.push(bullet("Structure: Sell the ~$17.50 put, ~45 DTE, secured with $1,750 cash per contract."));
children.push(bullet("Premium: est. ~$0.70/share (~$70 per contract). If assigned, net basis ≈ $16.80 — inside the $13–17 intrinsic zone."));
children.push(bullet("Rationale: gets you more shares near support/intrinsic value, or pays you ~4% per cycle to wait. Pairs naturally with the covered call into a wheel."));
children.push(h2("Collar — optional downside insurance"));
children.push(bullet("Structure: Sell $25 call + buy $17 put, ~60 DTE, for roughly net-zero cost. Floors downside near the 200-day SMA while financing protection with the call."));
children.push(bullet("Use only if you want to protect gains given the recent 38% drawdown; it trades away some income for a defined floor."));
children.push(p([t("Size positions so the bear-case outcome (intrinsic ~$7) does not cause unacceptable portfolio loss. ",{bold:true}),t("On 100–500 shares that means 1–5 covered-call contracts; for CSPs, hold enough cash that full assignment ($1,750/contract) stays within your risk budget.")]));

// ---------------- Section 10 Verdict ----------------
children.push(h1b("10. Verdict"));
children.push(p([t("Rating: HOLD — Accumulate on weakness toward $13–17.",{bold:true,size:24})]));
children.push(p("The business deserves attention: Fastly has gone from a structurally challenged single-digit grower to a 20%-growth, FCF-positive platform led by a Security segment compounding ~47%. RPO up 63% and net retention back to 113% confirm the demand is real, and the Rule of 40 score has climbed to ~37 — close to the threshold that historically triggers a re-rating."));
children.push(p("But the price is the problem. At $20.09 the stock trades 38% above its base-case DCF of $12.55 and just under its bull case of $24.16 — meaning the market already pays for a successful re-acceleration with little left over. EV/sales of 4.4x is in line with mature Akamai despite faster growth, so it is not expensive on a relative basis, yet the intrinsic-value math says the margin of safety is thin. This is a quality inflection at a full price, not a bargain."));
children.push(p("Action: hold existing shares rather than chase. Run covered calls at the ~$25 strike (45–60 DTE) to harvest elevated IV at resistance, and lay cash-secured puts at ~$17.50 to either collect premium or accumulate toward the $13–17 intrinsic zone. Add aggressively only on a pullback into that zone or on a clean break of Rule of 40 with sustained 20% growth — that combination would justify paying up for a re-rating."));
children.push(new Paragraph({spacing:{before:200},children:[new TextRun({text:"Sources: Fastly Q1 2026 Form 10-Q and Q1 2026 Investor Supplement (SEC EDGAR, filed May 2026); Fastly FY2025/Q4 Earnings Press Release (8-K, February 11, 2026); price/technical data from MarketBeat and Yahoo Finance (June 5–7, 2026); peer multiples from public market data (June 2026). This memo is for informational purposes only and does not constitute financial advice.",italic:true,size:18,color:"595959"})]}));

const doc = new Document({
  styles:{ default:{document:{run:{font:"Arial",size:24}}},
    paragraphStyles:[
      {id:"Heading1",name:"Heading 1",basedOn:"Normal",next:"Normal",quickFormat:true,run:{size:30,bold:true,font:"Arial",color:NAVY},paragraph:{spacing:{before:240,after:160},outlineLevel:0}},
      {id:"Heading2",name:"Heading 2",basedOn:"Normal",next:"Normal",quickFormat:true,run:{size:24,bold:true,font:"Arial",color:NAVY},paragraph:{spacing:{before:160,after:80},outlineLevel:1}},
    ]},
  numbering:{config:[{reference:"b",levels:[{level:0,format:LevelFormat.BULLET,text:"•",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:720,hanging:360}}}}]}]},
  sections:[{
    properties:{page:{size:{width:12240,height:15840},margin:{top:1440,right:1440,bottom:1440,left:1440}}},
    headers:{default:new Header({children:[new Paragraph({alignment:AlignmentType.RIGHT,children:[new TextRun({text:"CONFIDENTIAL — INVESTMENT MEMO",size:16,color:"808080"})]})]})},
    footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"FSLY Investment Memo — June 8, 2026  |  Page ",size:16,color:"808080"}),new TextRun({children:[PageNumber.CURRENT],size:16,color:"808080"})]})]})},
    children,
  }]
});
Packer.toBuffer(doc).then(buf=>{fs.writeFileSync("FSLY_Investment_Memo.docx",buf);console.log("saved FSLY_Investment_Memo.docx");});
