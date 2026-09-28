// Build $BROS_Investment_Memo_2026-09-28.docx (+ markdown twin for Drive) — quarterly update on the 2026-08-10 analysis.
// Renderer reused from the $NUAI 2026-09-28 script, restyled to the skill memo format (Arial, navy 1F4E79, 12pt). (+ markdown twin for Google Drive)
// Usage: node create_memo.js <output_dir>
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, HeadingLevel,
  AlignmentType, ShadingType, BorderStyle, ImageRun, Header, Footer, PageNumber, LevelFormat,
} = require("docx");

const OUT_DIR = process.argv[2] || ".";
const DATE = "2026-09-28";
const OUT_DOCX = path.join(OUT_DIR, `$BROS_Investment_Memo_${DATE}.docx`);
const OUT_MD = path.join(OUT_DIR, `$BROS_Investment_Memo_${DATE}.md`);
const CHART = path.join(OUT_DIR, "$BROS_chart.png");

const NAVY = "1F4E79", TEAL = "1F4E79", INK = "000000", GREY = "595959";
const BEAR = "FFC7CE", BASE = "FFEB9C", BULL = "C6EFCE", SUB = "EAF4F1";
const BODY = "Arial", HEAD = "Arial";
const FULL = 9360;

// ------------------------------------------------------------------ content blocks
const B = [];
const h1 = (t) => B.push({ t: "h1", text: t });
const h2 = (t) => B.push({ t: "h2", text: t });
const p = (...runs) => B.push({ t: "p", runs: runs.map((r) => (typeof r === "string" ? { text: r } : r)) });
const note = (t) => B.push({ t: "note", text: t });
const bullets = (items) => B.push({ t: "bullets", items });
const table = (widths, header, rows, opts = {}) => B.push({ t: "table", widths, header, rows, ...opts });
const bold = (text) => ({ text, bold: true });
const image = () => B.push({ t: "image" });


// ================================================================== TITLE
B.push({ t: "title", text: "DUTCH BROS INC. ($BROS — NYSE) — INVESTMENT MEMO" });
B.push({ t: "subtitle", text: "Quarterly update (between earnings)  |  Date: September 28, 2026  |  Analyst: Ed  |  Vehicle: Long equity (existing holder)  |  Rating: ACCUMULATE (staged) — maintained; final tranche moved to the Q3 print" });
note("Prior context: Aug 10, 2026 memo upgraded $BROS to ACCUMULATE (staged) at $51.29 with DCF bull $96.52 / base $58.77 / bear $25.91, and logged the cross-ticker pattern \"traffic-composition de-rate on a beat-and-raise\". Jun 5, 2026 memo: HOLD / accumulate on pullback. Day One and Open Brain: no $BROS notes after Aug 10 (Day One hits are a Jun 14 session recap and an Aug 6 AI briefing mention). Ed holds shares; position size is not recorded here because the repo is public. Prices are the Sep 25, 2026 close ($37.89); Sep 28 intraday was about $38.07.");

// ================================================================== 1. INVESTMENT SUMMARY
h1("1. Investment Summary");
p("No quarter has been reported since the August 10 memo, and Dutch Bros has filed no 8-K. The stock has still fallen 26%, from $51.29 to $37.89, a new 52-week low on September 25. Three things did happen. Dutch Bros lost the Salad and Go bankruptcy auction to 7 Brew, which paid $143.2M for 73 sites; Dutch Bros declined to counter its own $105M stalking-horse bid. Analysts cut price targets but kept Buy ratings: TD Cowen to $59 from $73, Melius to $70 from $95, Seaport initiated at $50, and Mizuho held $80. And a director bought shares in the open market for the first time in a year. The DCF inputs are unchanged, so the whole move is in the price: $37.89 is 35.5% below the $58.77 base case and 46% above the $25.91 bear case.");
table([1300, 3300, 2100, 1300, 1360],
  ["Scenario", "Key drivers", "EBITDA × multiple", "Implied price", "vs. current $37.89"],
  [
    ["Bear", "Transactions go negative, SSS 2–3%, margins compress on coffee and occupancy; multiple de-rates to mature-restaurant level.", "$387.5M × 16x ≈ $6.2B EV", "~$35", "▼ ~8%"],
    ["Base", "FY26 guidance delivered; SSS normalizes 4–5% with modest traffic growth; ≥185 openings; market pays a growth-restaurant multiple.", "$387.5M × 24x ≈ $9.3B EV", "~$52", "▲ ~37%"],
    ["Bull", "Traffic re-accelerates on food and menu work; organic pipeline delivers the 2,029-shop 2029 goal; multiple re-rates toward the CAVA/WING tier.", "$387.5M × 30x ≈ $11.6B EV", "~$65", "▲ ~72%"],
  ], { shade: [BEAR, BASE, BULL] });
p(bold("At $37.89 the market prices $BROS at 17.4x FY2026 guided EBITDA, down from ~23.6x on August 10 — close to the 16x bear-case multiple. "), "The market-multiple scenarios use the FY2026 guided EBITDA midpoint ($387.5M), 180M fully exchanged shares and $74M net cash. DCF intrinsic value (bull $96.52 / base $58.77 / bear $25.91) is in Section 6; the live Excel model is authoritative.");

// ================================================================== 2. BUSINESS SNAPSHOT
h1("2. Business Snapshot");
p("Dutch Bros is one of the fastest-growing drive-thru beverage brands in the U.S., with 1,225 shops at the end of Q2 2026 (888 company-operated, 337 franchised) and a target of 2,029 shops by 2029, about 90% of it already in the pipeline. Operating figures below are from the Q2 report (August 5); Q3 results are expected on November 4, 2026, after the close.");
table([4680, 4680], ["Metric", "Value"], [
  ["Current price", "$37.89 (Sep 25, 2026 close; −26% since Aug 10)"],
  ["Market cap (fully exchanged)", "~$6.82B (180M fully exchanged shares)"],
  ["Enterprise value", "~$6.75B ($74M net cash) — 17.4x FY26E EBITDA"],
  ["52-week range", "$37.72 – $74.02"],
  ["Q2 2026 revenue", "$550.9M (+32.5% YoY)"],
  ["Q2 2026 systemwide SSS", "+5.8% (transactions +1.7%, ticket +4.1%)"],
  ["Q2 2026 co-op contribution margin", "30.6% (vs. 31.1% PY)"],
  ["Q2 2026 adj. EBITDA", "$113.7M (20.6% margin vs. 21.4% PY)"],
  ["Cash / net cash (Jun 30)", "$268.6M / ~$74M (vs. $194.6M long-term debt)"],
  ["FY2026 guidance (Aug 5)", "Revenue $2.10–$2.13B; adj. EBITDA $385–$390M; capex $350–$370M; ≥185 openings"],
  ["Short interest", "16.4M shares, 12.6% of float, 4.2 days to cover (up from 14.3M a month earlier)"],
  ["Next earnings", "Q3 2026, estimated Nov 4, 2026 after the close"],
]);

// ================================================================== WHAT CHANGED
h1("What Changed Since August 10, 2026 — Retrospective Signal Check");
p("EDGAR shows no 8-K since the Q2 release. The filings are eight Form 4s, a 13G/A and an automatic shelf registration. None crosses the skill's numeric material-change thresholds (guidance, margin, unit count). The check still runs because the price crossed both the August memo's upgrade price and its technical bear-confirmation level.");
table([1500, 2400, 5460], ["Date", "Source", "What changed"], [
  ["Aug 13", "Form 4", "Director Todd Penegor bought 2,000 shares in the open market at $51.56 (~$103K) — the first open-market insider purchase found in 12 months."],
  ["Aug 20", "Form 4 (×7)", "Routine vesting of 775 restricted stock units for each of seven directors. No insider sales filed Aug 10 – Sep 28."],
  ["Aug 27–28", "NRN; bankruptcy court", "7 Brew bid for about 130 Salad and Go leases; the court approved an auction against Dutch Bros' $105M stalking-horse bid."],
  ["Sep 1", "Daily Coffee News; Restaurant Dive; Axios", "7 Brew won with $143.2M for 73 sites (41 Arizona, 20 Texas, 6 Nevada, 6 Oklahoma). Dutch Bros passed on countering and was named backup bidder. A lease-transfer hearing was set for Sep 21; its outcome was not confirmed for this update."],
  ["Sep 3", "S-3ASR", "Universal automatic shelf: Dutch Bros or selling securityholders — including the TSG sponsor and holders exchanging OpCo units — may sell Class A stock and other securities. No prospectus supplement (no offering) has been filed."],
  ["Sep", "Analyst notes", "Targets cut, ratings kept: TD Cowen Buy $59 (from $73), Melius Buy $70 (from $95), Seaport initiated Buy $50, Mizuho Outperform $80."],
  ["Sep 25", "Price", "Close $37.89, a new 52-week low — below the Aug 10 bear-confirmation level ($44.58) and the final-tranche zone ($44–45)."],
]);
p(bold("SEC filing trend. "), "Nothing in the filings explains a 26% fall. The only insider signal is a small director purchase, and the shelf is a registration, not a sale.");
p(bold("Cross-ticker pattern. "), "This is the continuation of the pattern logged from this ticker on August 6: for premium-multiple growth restaurants, a decelerating transaction comp is treated as a thesis break even when headline sales and guidance improve. Seven weeks later the market is still pricing that risk, without new traffic data.");
p(bold("Could we have seen it coming? "), "Partly. The August memo said that if traffic went negative, \"$51 will not be the low\" — but traffic has not been reported since. The price moved ahead of the data. What the August memo did not anticipate was losing the Salad and Go sites to the most direct competitor.");

// ================================================================== 3. MANAGEMENT & GOVERNANCE
h1("3. Management & Governance");
p("No leadership change since August 10. CEO Christine Barone (hired; CEO since January 2024) runs execution; co-founder Travis Boersma is Executive Chairman and controlling shareholder. The composite stays 30/50: the auction decision and the director purchase are consistent with the existing scores rather than a reason to move them.");
table([2400, 1000, 5960], ["Criterion", "Score", "Evidence"], [
  ["Execution track record", "10/10", "Q2'26 beat; FY26 revenue and EBITDA guidance raised (Aug 5); 32.5% revenue growth; 89 H1 openings on a ≥185 pace. No new operating data since."],
  ["Founder / tenure / skin in game", "5/10", "Founder Executive Chairman with ~38.8% economic stake; hired CEO ~2.7 years in the seat; founder in programmatic sell-down in H1."],
  ["Capital allocation", "5/10", "Declined to counter 7 Brew's $143.2M for Salad and Go — price discipline, but 65 sites lost. Capex $350–370M, negative FCF, no buybacks."],
  ["Insider activity (Form 4)", "5/10", "Director Penegor bought 2,000 shares at $51.56 (Aug 13) — small against chair-linked 10b5-1 sales of ~2.25M shares in H1 at $60–64. No sales filed Aug 10 – Sep 28."],
  ["Governance & alignment", "5/10", "Class B super-vote gives the founder ~73.1% of votes vs. ~38.8% economics (sunset below 5%); separate CEO and Chair; no restatements."],
  ["Composite", "30/50", "NEUTRAL (25–39). No zero, so no asymmetric flag. A secondary offering under the Sep 3 shelf would trigger a re-score of criteria 3–4."],
]);

// ================================================================== 4. BULL CASE
h1("4. Bull Case");
h2("Nothing reported has broken the growth algorithm");
p("The last print showed 32.5% revenue growth, raised guidance on both lines, 89 openings in H1 against a ≥185 target and about 90% of the 2029 pipeline secured. The 26% fall since August came with no filing, no guidance change and no operating data. The next real test is the Q3 transaction comp on November 4.");
h2("The price now sits near the bear-case multiple");
p("At 17.4x FY2026 guided EBITDA the stock trades close to the 16x mature-restaurant multiple the bear case assigns, about 9% above the ~$35 bear-case price and 35.5% below the $58.77 DCF base case. At the 24x base-case multiple, the guidance already published implies ~$52.");
h2("Walking away from Salad and Go kept $105M and the discipline");
p("Dutch Bros declined to top 7 Brew's $143.2M bid, leaving the $105M in the balance sheet. The 65 sites were excluded from guidance and equal about 3% of the 2,029-shop goal, so the organic plan does not depend on them.");
h2("Insiders and analysts are not following the price down");
p("Director Todd Penegor bought 2,000 shares in the open market on August 13, the first such purchase in a year, and no insider sales have been filed since August 10. Every analyst target found for this update is $50 or higher, 32% or more above the current price.");
p({ text: "Social sentiment (Stocktwits, pulled 2026-09-28): the crowd shares this view — score 61 (Slightly Bullish), +22 pts over 20 sessions; message volume 54 of 100. Recent posts center on buying the dip and analyst targets of $50 and up; a short-squeeze list shared in the stream cites short interest above 33% of float, but reported short interest is 12.6%.", italics: true });

// ================================================================== 5. BEAR CASE
h1("5. Bear Case");
h2("The market is not waiting for the traffic print");
p("The stock fell 26% in seven weeks with no new data and closed below $44.58, the level the August memo called bear confirmation. The Q2 composition — transactions +1.7%, down from +3.7% a year earlier, with pricing support falling below 1% in H2 — looks, from the price action alone, like it is being priced as the start of a trend; the Q3 guide of 4–5% SSS already implies deceleration.");
h2("7 Brew just bought 73 corners in Dutch Bros' core markets");
p("The most direct drive-thru competitor, at lower price points, won 41 Arizona, 20 Texas, 6 Nevada and 6 Oklahoma sites — purpose-built drive-thrus in the markets where Dutch Bros is densest. That adds competing capacity exactly where the traffic comp has to hold, and it removes the conversion optionality the August bull case counted.");
h2("Margins and funding pressure are unchanged");
p("Adjusted EBITDA margin fell 80bps YoY in Q2 and management flagged coffee and occupancy costs. Capex of $350–370M against ~$387M of EBITDA leaves free cash flow near zero, so growth remains balance-sheet funded.");
h2("A registered path for sponsor and insider sales");
p("The September 3 automatic shelf lets the company or selling securityholders, including the TSG sponsor and OpCo unit holders, sell Class A stock. Nothing has been sold under it, but it is an overhang at a 52-week low.");
h2("The tape has no support until the mid-$30s");
p("Price is below all three moving averages (20-day $43.23, 50-day $51.88, 200-day $56.13) with RSI at 20.8. Below the $37.72 low, the next support is the $34–35 area from mid-2024, then the $30–31 base from August–September 2024.");
p({ text: "Social sentiment (Stocktwits, pulled 2026-09-28): the crowd does not share this view — score 61 (Slightly Bullish), +22 pts over 20 sessions; message volume 54 of 100.", italics: true });

// ================================================================== 6. DCF VALUATION
h1("6. DCF Valuation");
p("Restaurant methodology: a five-year projection from the FY2026 guidance base with an EBITDA-terminal multiple at FY2030, discounted at a single 12% WACC; terminal multiples are calibrated to terminal margins (18% → 12x, 22% → 18x, 26% → 22x). No input changed in this update: there is no new quarter or guidance, the Salad and Go sites were never in guidance, and the valuation date was not rolled forward. All figures are live-linked from $BROS_Investment_Model_2026-09-28.xlsx (authoritative).");
table([3960, 1800, 1800, 1800], ["Metric", "Bull Case", "Base Case", "Bear Case"], [
  ["Discount rate (single WACC)", "12%", "12%", "12%"],
  ["Revenue CAGR FY26→FY30 (from $2,115M guidance base)", "22.5%", "18.5%", "12.0%"],
  ["FY2030 revenue", "~$4.76B", "~$4.17B", "~$3.33B"],
  ["Terminal EBITDA margin", "26%", "22%", "18%"],
  ["Terminal EV/EBITDA multiple", "22x", "18x", "12x"],
  ["Enterprise value", "~$17.3B", "~$10.5B", "~$4.6B"],
  ["+ Net cash / ÷ fully exchanged shares", "+$74M / 180M", "+$74M / 180M", "+$74M / 180M"],
  ["INTRINSIC PRICE / SHARE", "$96.52", "$58.77", "$25.91"],
  ["Current price $37.89 — premium / (discount)", "(60.7%)", "(35.5%)", "+46.2%"],
], { boldRows: [7] });
p("The stock now trades 35.5% below the base case, up from 12.7% on August 10, and 46% above the bear case. The asymmetry is wider in both directions: +55% to base and +155% to bull against −32% to bear. The bull case keeps its 22.5% growth lever; the lost Salad and Go sites were about 3% of the 2029 shop goal and were never in guidance.");

// ================================================================== 7. UNIT ECONOMICS
h1("7. Unit Economics & Growth Model");
p("Evaluated on unit economics rather than Rule of 40 (restaurant adaptation). No new operating data since Q2; figures are unchanged except the acquired-site pipeline.");
table([4680, 4680], ["Metric", "Value"], [
  ["Systemwide SSS (Q2 2026)", "+5.8% (Q3 guided 4–5%)"],
  ["System transaction growth", "+1.7% — PRIMARY WATCH METRIC (was +3.7% PY); next read Nov 4"],
  ["Average ticket growth", "+4.1% (pricing contribution <1% in H2)"],
  ["Co-op contribution margin", "30.6% (vs. 31.1% PY)"],
  ["Adj. EBITDA margin", "20.6% (vs. 21.4% PY)"],
  ["New openings", "48 in Q2 / 89 in H1 / ≥185 FY26 target"],
  ["Acquired-site pipeline", "20 Clutch Coffee sites; Salad and Go lost to 7 Brew (Dutch Bros is backup bidder)"],
  ["Unit potential", "1,225 today vs. 2,029 by 2029 (~90% pipeline secured); 4,000+ long term"],
]);

// ================================================================== 8. PEERS
h1("8. Peer Comparables");
p("Peer figures are carried from August 2026 and were not refreshed in this update. The subject row uses today's price.");
table([1900, 900, 1200, 1300, 1560, 2500], ["Company", "Ticker", "SSS %", "RL margin", "Fwd EV/EBITDA", "Note"], [
  ["Dutch Bros", "BROS", "+5.8%", "~31%", "~17x", "Subject — fastest grower in set; now priced below Chipotle's multiple"],
  ["Starbucks", "SBUX", "~+1–3%", "n/a", "~16–18x", "Scale leader, traffic-challenged"],
  ["Chipotle", "CMG", "~+2–4%", "~26–27%", "~24–27x", "Margin benchmark"],
  ["CAVA", "CAVA", "~+5–8%", "~25%", "~40x+", "Closest growth comp; richer multiple"],
  ["Shake Shack", "SHAK", "~+2–4%", "~21–22%", "~22–26x", "Mid-growth fast casual"],
  ["Wingstop", "WING", "~flat–+3%", "n/a", "~38–45x", "Franchise-model premium"],
  ["7 Brew", "Private", "n/a", "n/a", "n/a", "Won 73 Salad and Go sites for $143.2M (Sep 1)"],
]);
p("At ~17x forward EBITDA, $BROS trades at a Starbucks multiple while its last print showed 25%+ revenue growth and comparable restaurant-level margins. The market has priced out the growth premium until the transaction comp confirms or breaks.");

// ================================================================== 9. TECHNICAL
h1("9. Technical Setup");
image();
table([4680, 4680], ["Metric", "Value"], [
  ["Current price", "$37.89 (Sep 25, 2026 close); Sep 28 intraday ~$38.07"],
  ["52-week range", "$37.72 – $74.02"],
  ["20-day SMA", "$43.23 — price below"],
  ["50-day SMA", "$51.88 — price below"],
  ["200-day SMA", "$56.13 — price below (bearish for multiple expansion)"],
  ["RSI (14-day)", "20.8 — deeply oversold"],
  ["30-day implied volatility", "33% (AlphaQuery, fetched Sep 28); 20-day realised 33%"],
  ["IV rank", "Not available from free sources"],
  ["Volume", "30-day average 4.2M; Sep 18–22 5.9–6.6M a day around the break below $40"],
  ["Key support", "$37.72 (Sep 23 low), then $34–35, then $30–31"],
  ["Key resistance", "$40–41, then $43.23 (20-day) and $44.58 (old 52-week low)"],
]);
table([4680, 4680], ["Social sentiment (Stocktwits), pulled 2026-09-28 07:31 PT", "Value"], [
  ["Sentiment score (0–100)", "61 (Slightly Bullish)"],
  ["Change over 20 sessions", "+22 pts"],
  ["Message volume (0–100)", "54"],
  ["Watchers", "12,304"],
]);
p("The stock has made lower lows in steps since the August 6 gap, broke below $40 on September 21 on 6.3M shares (1.5x the 30-day average), and closed at $37.89. RSI at 20.8 marks an oversold tape; the next scheduled catalyst is the November 4 print. A close back above $44.58 would repair the August bear-confirmation break; a close below $34 would put the $30–31 base in play. Implied volatility of 33% matches realised volatility, so options are not priced rich.");

// ================================================================== 10. OPTIONS
h1("10. Options Strategy Recommendation");
p("For a current long-equity holder rated ACCUMULATE (staged). Implied volatility has fallen to 33% from the ~45–55% estimated in August, so put-selling pays less than it did. Both November and December expiries span the November 4 earnings release. Premiums are Black-Scholes estimates at 33% IV with days counted from September 28; check live quotes before trading. Any $47.50 puts written under the August plan are in the money at $37.89.");
table([2900, 1500, 1300, 1600, 2060], ["Strategy", "Premium", "Per cycle", "Effective entry", "Max loss / contract"], [
  ["Hold shares, no new options (default)", "—", "—", "—", "—"],
  ["CSP (final tranche, optional): sell Nov 20 $35 put", "$0.69", "2.0%", "~$34.31", "~$3,431"],
  ["CSP ladder (only if sized for bear): sell Dec 18 $32.50 put", "$0.43", "1.3%", "~$32.07", "~$3,207"],
  ["Covered call: sell Nov 20 $45 call", "$0.23", "0.6%", "Caps at $45", "Shares called away above $45"],
]);
p("Rationale: the $35 strike sits at the mid-2024 support; assignment near $34.31 would be 42% below the DCF base and 32% above the bear case. It turns the final tranche into a paid limit order, but it is also a bet taken through the earnings print, so size it for the bear case ($25.91). The covered call is not worth writing: 0.6% per cycle caps the recovery the thesis needs. All yields are per cycle, not annualised.");

// ================================================================== 11. VERDICT
h1("11. Verdict & Monitoring Plan");
p(bold("Overall verdict: ACCUMULATE (staged) — maintained. The final tranche now waits for the Q3 transaction comp, not for price."));
p("Two of the August 10 rules fired at the same time. The upgrade rule — \"price ≤$45 with traffic merely stable\" — is half met: the price is well below $45, but no traffic data will exist until November 4. The technical rule — a close below $44.58 is bear confirmation — fired outright. The fundamentals on file are unchanged, the valuation gap to base widened from 13% to 35%, and the new facts cut both ways: management showed price discipline on Salad and Go, and the competitor it most needs to beat bought 73 sites in its core markets.");
p("Resolution: keep the existing shares, keep the rating, and let the November 4 print decide the final tranche. Adding on price alone would front-run the one data point the thesis depends on; selling on price alone would abandon a base case that nothing reported has changed.");
p("Action plan: (1) Hold existing shares. (2) Do not add the final tranche before November 4 except through the optional Nov 20 $35 cash-secured put, sized for the bear case. (3) After the print: system transactions ≥ +2% with co-op margin ≥30% → add the final tranche and consider BUY; transactions ≤0% → thesis break, halt accumulation and re-underwrite with the bear case ($25.91) as the operative scenario. (4) Re-score leadership if a secondary offering launches under the September 3 shelf.");
table([4680, 4680], ["Monitoring metric", "Threshold"], [
  ["System transaction growth (PRIMARY, Nov 4)", "Target: >2%; Alert: ≤0% — thesis break, halt accumulation"],
  ["Q3 2026 systemwide SSS", "Target: ≥4% (within guide); Alert: <3%"],
  ["Co-op contribution margin", "Target: ≥30%; Alert: <28% (2 consecutive quarters)"],
  ["Adj. EBITDA margin trend", "Alert: third consecutive quarter of YoY decline"],
  ["7 Brew in AZ/TX/NV/OK", "Opening pace of the 73 former Salad and Go sites; any Dutch Bros pricing response on the Q3 call"],
  ["Shelf use", "Any prospectus supplement under the Sep 3 S-3ASR = re-score criteria 3–4"],
  ["Technical", "Close above $44.58 = repair; close below $34 = next support failure"],
]);
note("Sources: Dutch Bros SEC filings via EDGAR — Q2 2026 8-K (Aug 5) and 10-Q (Aug 6), Form 4s (Aug 14 and Aug 21, 2026), 13G/A (Aug 6 and 12), S-3ASR (Sep 3, 2026); NRN (Aug 27, 2026), Daily Coffee News (Sep 2, 2026), Restaurant Dive, Axios Phoenix and QSR Magazine on the Salad and Go auction; ts2.tech (Sep 21, 2026) and 24/7 Wall St. (Sep 25, 2026) for analyst targets and the 52-week low; Yahoo Finance daily and weekly bars to Sep 25, 2026; AlphaQuery 30-day implied volatility and stockanalysis.com short interest and earnings date (fetched Sep 28, 2026); peer figures carried from Aug 2026; Stocktwits via MCP (pulled Sep 28, 2026, 07:31 PT; context only, not a valuation input); prior memos (Aug 10 and Jun 5, 2026). This memo is for informational purposes only and does not constitute financial advice.");

// ------------------------------------------------------------------ DOCX renderer
const run = (r, extra = {}) => new TextRun({ text: r.text, bold: !!r.bold, italics: !!r.italics, font: BODY, size: 24, color: r.color || INK, ...extra });
const cell = (text, w, opts = {}) => new TableCell({
  width: { size: w, type: WidthType.DXA },
  shading: opts.fill ? { type: ShadingType.CLEAR, fill: opts.fill, color: "auto" } : undefined,
  margins: { top: 60, bottom: 60, left: 90, right: 90 },
  children: [new Paragraph({ children: [new TextRun({ text, bold: !!opts.bold, font: BODY, size: opts.size || 19, color: opts.color || INK })] })],
});
const mkTable = (b) => {
  const rows = [];
  rows.push(new TableRow({ tableHeader: true, children: b.header.map((h, i) => cell(h, b.widths[i], { fill: NAVY, color: "FFFFFF", bold: true })) }));
  b.rows.forEach((r, ri) => {
    const fill = b.shade ? (b.shade[ri] || undefined) : undefined;
    const isBold = (b.boldRows && b.boldRows.includes(ri)) || (b.boldLast && ri === b.rows.length - 1);
    rows.push(new TableRow({ children: r.map((c, i) => cell(c, b.widths[i], { fill, bold: isBold })) }));
  });
  return new Table({ width: { size: FULL, type: WidthType.DXA }, columnWidths: b.widths, rows,
    borders: { top: { style: BorderStyle.SINGLE, size: 4, color: "DDE3E3" }, bottom: { style: BorderStyle.SINGLE, size: 4, color: "DDE3E3" }, left: { style: BorderStyle.SINGLE, size: 4, color: "DDE3E3" }, right: { style: BorderStyle.SINGLE, size: 4, color: "DDE3E3" }, insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "DDE3E3" }, insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "DDE3E3" } } });
};

const children = [];
let firstH1 = true;
for (const b of B) {
  if (b.t === "title") children.push(new Paragraph({ children: [new TextRun({ text: b.text, font: HEAD, size: 40, bold: true, color: NAVY })], spacing: { after: 120 } }));
  else if (b.t === "subtitle") children.push(new Paragraph({ children: [new TextRun({ text: b.text, font: BODY, size: 20, color: GREY })], spacing: { after: 200 }, border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: TEAL, space: 4 } } }));
  else if (b.t === "h1") { children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: !firstH1, children: [new TextRun({ text: b.text, font: HEAD, size: 30, bold: true, color: NAVY })], spacing: { before: 240, after: 160 } })); firstH1 = false; }
  else if (b.t === "h2") children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: b.text, font: BODY, size: 23, bold: true, color: TEAL })], spacing: { before: 160, after: 80 } }));
  else if (b.t === "p") children.push(new Paragraph({ children: b.runs.map((r) => run(r)), spacing: { after: 140 }, alignment: AlignmentType.LEFT }));
  else if (b.t === "note") children.push(new Paragraph({ children: [new TextRun({ text: b.text, font: BODY, size: 18, italics: true, color: GREY })], spacing: { after: 160 } }));
  else if (b.t === "bullets") b.items.forEach((it) => children.push(new Paragraph({ numbering: { reference: "bul", level: 0 }, children: [run({ text: it })], spacing: { after: 60 } })));
  else if (b.t === "table") { children.push(mkTable(b)); children.push(new Paragraph({ spacing: { after: 120 } })); }
  else if (b.t === "image") {
    const img = fs.readFileSync(CHART);
    const W = 5943600, H = Math.round(W * 930 / 1500);
    children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: "png", data: img, transformation: { width: Math.round(W / 9525), height: Math.round(H / 9525) } })] }));
    children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "$BROS Daily Chart — SMA 20/50/200 with volume | Source: Yahoo Finance daily bars to Sep 25, 2026 | Sep 28, 2026", font: BODY, size: 18, italics: true, color: GREY })], spacing: { after: 160 } }));
  }
}

const doc = new Document({
  numbering: { config: [{ reference: "bul", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }] },
  styles: { default: { document: { run: { font: BODY, size: 24, color: INK } } } },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
    headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "CONFIDENTIAL — INVESTMENT MEMO  ·  $BROS  ·  Sep 28, 2026", font: BODY, size: 16, color: GREY })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Page ", font: BODY, size: 16, color: GREY }), new TextRun({ children: [PageNumber.CURRENT], font: BODY, size: 16, color: GREY }), new TextRun({ text: "  ·  Ed Matibag  ·  Not financial advice", font: BODY, size: 16, color: GREY })] })] }) },
    children,
  }],
});

// ------------------------------------------------------------------ Markdown renderer (Drive mirror)
const md = [];
for (const b of B) {
  if (b.t === "title") md.push(`# ${b.text}`);
  else if (b.t === "subtitle") md.push(`**${b.text}**\n`);
  else if (b.t === "h1") md.push(`\n## ${b.text}`);
  else if (b.t === "h2") md.push(`\n### ${b.text}`);
  else if (b.t === "p") md.push(b.runs.map((r) => (r.bold ? `**${r.text}**` : r.italics ? `*${r.text}*` : r.text)).join("") + "\n");
  else if (b.t === "note") md.push(`*${b.text}*\n`);
  else if (b.t === "bullets") md.push(b.items.map((i) => `- ${i}`).join("\n") + "\n");
  else if (b.t === "table") {
    md.push(`| ${b.header.join(" | ")} |`);
    md.push(`| ${b.header.map(() => "---").join(" | ")} |`);
    b.rows.forEach((r) => md.push(`| ${r.map((c) => String(c).replace(/\|/g, "/")).join(" | ")} |`));
    md.push("");
  } else if (b.t === "image") md.push("*[Chart: $BROS daily close with SMA 20/50/200 and volume to Sep 25, 2026 — see $BROS_chart.png in the local folder]*\n");
}
fs.writeFileSync(OUT_MD, md.join("\n"));

Packer.toBuffer(doc).then((buf) => { fs.writeFileSync(OUT_DOCX, buf); console.log("saved", OUT_DOCX, buf.length, "bytes;", OUT_MD); });
