#!/usr/bin/env python3
"""Build $FSLY Investment Model — Q2 2026 quarterly update (2026-08-11).
Fixes prior model's row-40 dashboard-link kludge (base/bear Yr4 FCF was corrupted
by link cells); dashboard now links directly to Model!B52:D52.
"""
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.comments import Comment

BLUE = Font(name="Arial", size=10, color="0000FF")          # hardcoded inputs
BLACK = Font(name="Arial", size=10, color="000000")         # formulas
GREEN = Font(name="Arial", size=10, color="008000")         # cross-sheet links
BOLD = Font(name="Arial", size=10, bold=True)
H1 = Font(name="Arial", size=12, bold=True, color="1F4E79")
H2 = Font(name="Arial", size=10, bold=True, color="1F4E79")
NOTE = Font(name="Arial", size=8, italic=True, color="666666")
HDR_FILL = PatternFill("solid", fgColor="D9E2F3")
YEL = PatternFill("solid", fgColor="FFF2CC")

CUR = '$#,##0.0;($#,##0.0);"-"'
CUR2 = '$#,##0.00;($#,##0.00);"-"'
PCT = '0.0%;(0.0%);"-"'
NUM = '#,##0.0;(#,##0.0);"-"'
MULT = '0.0x'

wb = openpyxl.Workbook()

def sset(ws, cell, val, font=BLACK, fmt=None, fill=None, comment=None, bold=False):
    c = ws[cell]
    c.value = val
    if bold and not font.bold:
        c.font = Font(name=font.name, size=font.size, bold=True, italic=font.italic, color=font.color)
    else:
        c.font = font
    if fmt: c.number_format = fmt
    if fill: c.fill = fill
    if comment: c.comment = Comment(comment, "Claude")
    return c

# ============ DASHBOARD ============
ws = wb.active; ws.title = "Dashboard"
ws.sheet_view.showGridLines = False
for col, w in zip("ABCDEFG", [2, 38, 16, 3, 30, 14, 3]): ws.column_dimensions[col].width = w

sset(ws, "B2", "FASTLY, INC. (NASDAQ: FSLY) — INVESTMENT DASHBOARD", H1)
sset(ws, "B3", "Analysis date: August 11, 2026  |  Analyst: Ed  |  Rating: HOLD — Trim into strength; do not add  |  Vehicle: Long equity (holds shares)", NOTE)

sset(ws, "B5", "MARKET SNAPSHOT", H2, fill=HDR_FILL); sset(ws, "C5", "", fill=HDR_FILL)
rows = [
    ("Current Price", 27.75, CUR2, "Close Aug 10, 2026 (stockanalysis.com; +20.9% on Q2 results/raised guidance)"),
    ("52-Week Range", "$6.70 – $34.82", None, "stockanalysis.com, Aug 11 2026"),
    ("Shares Outstanding (M)", 159.3, NUM, "stockanalysis.com, Aug 11 2026"),
    ("Diluted Shares — valuation (M)", 180.3, NUM, "Q2 2026 press release non-GAAP diluted weighted shares; prior model used 165M — updated for dilution realism"),
]
r = 6
for label, val, fmt, cmt in rows:
    sset(ws, f"B{r}", label, BLACK)
    sset(ws, f"C{r}", val, BLUE, fmt=fmt, comment=cmt)
    r += 1
sset(ws, "B10", "Market Cap ($M)"); sset(ws, "C10", "=C6*C8", BLACK, fmt=CUR)
sset(ws, "B11", "Cash + Marketable Securities ($M)"); sset(ws, "C11", 337.5, BLUE, fmt=CUR, comment="Q2 2026 press release: cash $89.8M + marketable securities $247.7M")
sset(ws, "B12", "Total Debt — convertible notes ($M)"); sset(ws, "C12", 323.96, BLUE, fmt=CUR, comment="Q2 2026 balance sheet: convertible notes")
sset(ws, "B13", "Net Cash ($M)"); sset(ws, "C13", "=C11-C12", BLACK, fmt=CUR)
sset(ws, "B14", "Enterprise Value ($M)"); sset(ws, "C14", "=C10-C13", BLACK, fmt=CUR)

sset(ws, "B16", "FUNDAMENTALS (Most Recent Quarter — Q2 2026)", H2, fill=HDR_FILL); sset(ws, "C16", "", fill=HDR_FILL)
fund = [
    ("Q2 2026 Revenue ($M)", 183.3, CUR, "Q2 2026 press release, Aug 5 2026"),
    ("Revenue Growth (YoY)", 0.23, PCT, "Q2 2026 press release"),
    ("Security Revenue ($M) / Growth", "  $41.7M  +43%", None, "Q2 2026 press release"),
    ("Network Services ($M) / Growth", "  $133.9M  +17%", None, "Q2 2026 press release"),
    ("Other — Compute & Observability", "  $7.7M  +69%", None, "Q2 2026 press release"),
    ("GAAP Gross Margin", 0.633, PCT, "Q2 2026 press release (vs 54.5% PY)"),
    ("Non-GAAP Gross Margin", 0.658, PCT, "Q2 2026 press release (vs 59.0% PY)"),
    ("Non-GAAP Operating Margin", 0.147, PCT, "$27.0M non-GAAP op income / $183.3M"),
    ("Adj. EBITDA Margin", 0.208, PCT, "$38.1M adj. EBITDA / $183.3M"),
    ("FCF Margin (Q2 — heavy capex)", 0.020, PCT, "OCF $39.3M − capex $35.8M = FCF $3.6M"),
    ("LTM Net Retention Rate", 1.17, PCT, "Q2 2026 press release — highest in 3+ years (Q1: 113%)"),
    ("Total RPO ($M) — note seq. decline", 341, CUR, "+38% YoY but down from $369M in Q1 2026 — watch item"),
    ("Top-10 Customer Concentration", 0.37, PCT, "vs 31% prior year — concentration rising"),
]
r = 17
for label, val, fmt, cmt in fund:
    sset(ws, f"B{r}", label)
    sset(ws, f"C{r}", val, BLUE, fmt=fmt, comment=cmt)
    r += 1

sset(ws, "E5", "VALUATION SUMMARY", H2, fill=HDR_FILL); sset(ws, "F5", "", fill=HDR_FILL)
sset(ws, "E6", "DCF Bull Case / share"); sset(ws, "F6", "=Model!B52", GREEN, fmt=CUR2)
sset(ws, "E7", "DCF Base Case / share"); sset(ws, "F7", "=Model!C52", GREEN, fmt=CUR2)
sset(ws, "E8", "DCF Bear Case / share"); sset(ws, "F8", "=Model!D52", GREEN, fmt=CUR2)
sset(ws, "E9", "Current Price"); sset(ws, "F9", "=C6", BLACK, fmt=CUR2)
sset(ws, "E10", "Current vs Bull Case"); sset(ws, "F10", "=F9/F6-1", BLACK, fmt=PCT)
sset(ws, "E11", "Base Case vs Current"); sset(ws, "F11", "=F7/F9-1", BLACK, fmt=PCT)
sset(ws, "E12", "FY2026 Guided Revenue ($M, mid)"); sset(ws, "F12", 739.0, BLUE, fmt=CUR, comment="FY26 guidance $732–746M midpoint, raised Aug 5 2026 from $710–725M")
sset(ws, "E13", "FY2026 Rev Growth (guidance)"); sset(ws, "F13", "=F12/Model!B6-1", BLACK, fmt=PCT)
sset(ws, "E14", "FY2026 Non-GAAP Op Inc ($M, mid)"); sset(ws, "F14", 92.0, BLUE, fmt=CUR, comment="FY26 guidance $88–96M midpoint, raised from $58–68M — margin revision +370bps (material)")
sset(ws, "E15", "EV / FY26 Revenue"); sset(ws, "F15", "=C14/F12", BLACK, fmt=MULT)
sset(ws, "E16", "Rule of 40 (Q2 2026, EBITDA basis)"); sset(ws, "F16", "=Rule_of_40!D15", GREEN, fmt='0.0')
sset(ws, "E17", "Rule of 40 (FY2025, EBITDA basis)"); sset(ws, "F17", "=Rule_of_40!D7", GREEN, fmt='0.0')

sset(ws, "E19", "TECHNICAL LEVELS", H2, fill=HDR_FILL); sset(ws, "F19", "", fill=HDR_FILL)
tech = [
    ("20-Day SMA (est.)", 21.5, CUR2, "Estimated — stock gapped +21% Aug 10"),
    ("50-Day SMA", 19.83, CUR2, "stockanalysis.com, Aug 11 2026"),
    ("200-Day SMA", 17.22, CUR2, "stockanalysis.com, Aug 11 2026"),
    ("RSI (14)", 70.3, '0.0', "stockanalysis.com, Aug 11 2026 — overbought"),
    ("Short % of Float", 0.181, PCT, "25.5M shares short — squeeze fuel in the +21% move"),
    ("Implied Volatility", "Elevated (post-spike)", None, "Post-earnings +21% gap; favorable for premium selling"),
]
r = 20
for label, val, fmt, cmt in tech:
    sset(ws, f"E{r}", label)
    sset(ws, f"F{r}", val, BLUE, fmt=fmt, comment=cmt)
    r += 1

sset(ws, "B31", "Color key: blue = hardcoded input | black = formula | green = cross-sheet link. Sources: Fastly Q2 2026 press release (Aug 5, 2026); stockanalysis.com (Aug 11, 2026). Not investment advice.", NOTE)

# ============ MODEL ============
ws = wb.create_sheet("Model")
ws.sheet_view.showGridLines = False
for col, w in zip("ABCDE", [40, 14, 14, 14, 14]): ws.column_dimensions[col].width = w

sset(ws, "A1", "FSLY — DCF VALUATION MODEL (5-Year FCF, Gordon Growth Terminal)", H1)
sset(ws, "A2", "SINGLE WACC across all scenarios (mandatory). Only growth, FCF margin & terminal growth vary. Updated for Q2 2026 results + raised FY26 guidance.", NOTE)

sset(ws, "A4", "HISTORICAL & BASE ($M)", H2, fill=HDR_FILL); sset(ws, "B4", "", fill=HDR_FILL)
hist = [
    ("FY2024 Revenue", 543.676, "FY2024 10-K"),
    ("FY2025 Revenue", 624.018, "FY2025 10-K / Feb 11 2026 8-K"),
    ("FY2025 Free Cash Flow", 45.809, "FY2025 results"),
    ("H1 2026 Revenue (Q1 $173.0 + Q2 $183.3)", 356.3, "Q1+Q2 2026 press releases"),
    ("H1 2026 FCF (heavy capex cycle)", 7.8, "Q1 $4.2M (est.) + Q2 $3.6M"),
    ("FY2026 Guided Revenue (Yr1 base, mid)", 739.0, "FY26 guidance $732–746M midpoint (raised Aug 5 2026)"),
]
r = 5
for label, val, cmt in hist:
    sset(ws, f"A{r}", label)
    sset(ws, f"B{r}", val, BLUE, fmt=CUR, comment=cmt)
    r += 1
# B7 = FY2025 revenue referenced by Dashboard F13 -> ensure row: FY2025 revenue is row 6
# (Dashboard formula uses Model!B7 — adjust: FY2025 Revenue must be B7.)

sset(ws, "A13", "ASSUMPTIONS", H2, fill=HDR_FILL)
for c in "BCD": sset(ws, f"{c}13", "", fill=HDR_FILL)
sset(ws, "A14", "Assumption", BOLD); sset(ws, "B14", "Bull", BOLD); sset(ws, "C14", "Base", BOLD); sset(ws, "D14", "Bear", BOLD)
assumptions = [
    ("WACC (single, all scenarios)", 0.11, 0.11, 0.11, "Held at 11% per single-WACC rule (unchanged from 2026-06-08 analysis)"),
    ("Yr2 Revenue Growth (FY2027)", 0.20, 0.14, 0.09, "Base raised 13%→14%: NRR 117% (from 113%) + RPO +38% support durability; bull/bear unchanged"),
    ("Yr3 Revenue Growth", 0.18, 0.13, 0.07, "Base raised 12%→13%"),
    ("Yr4 Revenue Growth", 0.16, 0.12, 0.06, "Base raised 11%→12%"),
    ("Yr5 Revenue Growth", 0.14, 0.11, 0.05, "Base raised 10%→11%"),
    ("Yr1 FCF Margin (FY2026)", 0.08, 0.07, 0.06, "H1'26 FCF only $7.8M on heavy capex; guided OI margin 12.4% implies H2 FCF catch-up"),
    ("Yr2 FCF Margin", 0.13, 0.10, 0.07, ""),
    ("Yr3 FCF Margin", 0.17, 0.13, 0.09, ""),
    ("Yr4 FCF Margin", 0.22, 0.16, 0.11, ""),
    ("Yr5 FCF Margin (terminal)", 0.27, 0.20, 0.13, "Bull 26%→27%, base 19%→20%: FY26 op-income guide raised +370bps validates faster leverage"),
    ("Terminal Growth Rate", 0.045, 0.035, 0.03, "Unchanged"),
]
r = 15
for label, b, ba, be, cmt in assumptions:
    sset(ws, f"A{r}", label)
    sset(ws, f"B{r}", b, BLUE, fmt=PCT, comment=cmt or None)
    sset(ws, f"C{r}", ba, BLUE, fmt=PCT)
    sset(ws, f"D{r}", be, BLUE, fmt=PCT)
    r += 1

sset(ws, "A27", "PROJECTIONS — REVENUE ($M)", H2, fill=HDR_FILL)
for c in "BCD": sset(ws, f"{c}27", "", fill=HDR_FILL)
sset(ws, "A28", "Year", BOLD); sset(ws, "B28", "Bull", BOLD); sset(ws, "C28", "Base", BOLD); sset(ws, "D28", "Bear", BOLD)
sset(ws, "A29", "Yr1 (FY2026, guided)");
for c in "BCD": sset(ws, f"{c}29", "=$B$10", BLACK, fmt=CUR)
labels = ["Yr2 (FY2027)", "Yr3 (FY2028)", "Yr4 (FY2029)", "Yr5 (FY2030)"]
for i, lab in enumerate(labels):
    row = 30 + i; arow = 16 + i
    sset(ws, f"A{row}", lab)
    sset(ws, f"B{row}", f"=B{row-1}*(1+$B${arow})", BLACK, fmt=CUR)
    sset(ws, f"C{row}", f"=C{row-1}*(1+$C${arow})", BLACK, fmt=CUR)
    sset(ws, f"D{row}", f"=D{row-1}*(1+$D${arow})", BLACK, fmt=CUR)

sset(ws, "A35", "PROJECTIONS — FREE CASH FLOW ($M)", H2, fill=HDR_FILL)
for c in "BCD": sset(ws, f"{c}35", "", fill=HDR_FILL)
sset(ws, "A36", "Year", BOLD); sset(ws, "B36", "Bull", BOLD); sset(ws, "C36", "Base", BOLD); sset(ws, "D36", "Bear", BOLD)
for i in range(5):
    row = 37 + i; rrow = 29 + i; mrow = 20 + i
    sset(ws, f"A{row}", f"Yr{i+1} FCF")
    sset(ws, f"B{row}", f"=B{rrow}*$B${mrow}", BLACK, fmt=CUR)
    sset(ws, f"C{row}", f"=C{rrow}*$C${mrow}", BLACK, fmt=CUR)
    sset(ws, f"D{row}", f"=D{rrow}*$D${mrow}", BLACK, fmt=CUR)

sset(ws, "A43", "DCF WATERFALL", H2, fill=HDR_FILL)
for c in "BCD": sset(ws, f"{c}43", "", fill=HDR_FILL)
sset(ws, "A44", "Item", BOLD); sset(ws, "B44", "Bull", BOLD); sset(ws, "C44", "Base", BOLD); sset(ws, "D44", "Bear", BOLD)
sset(ws, "A45", "PV of 5-Yr FCF")
for col, acol in zip("BCD", "BCD"):
    f = "+".join([f"{col}{37+i}/(1+${acol}$15)^{i+1}" for i in range(5)])
    sset(ws, f"{col}45", f"={f}", BLACK, fmt=CUR)
sset(ws, "A46", "Terminal Value (Gordon Growth)")
for col in "BCD":
    sset(ws, f"{col}46", f"={col}41*(1+${col}$25)/(${col}$15-${col}$25)", BLACK, fmt=CUR)
sset(ws, "A47", "PV of Terminal Value")
for col in "BCD":
    sset(ws, f"{col}47", f"={col}46/(1+${col}$15)^5", BLACK, fmt=CUR)
sset(ws, "A48", "Enterprise Value")
for col in "BCD":
    sset(ws, f"{col}48", f"={col}45+{col}47", BLACK, fmt=CUR)
sset(ws, "A49", "+ Net Cash")
for col in "BCD":
    sset(ws, f"{col}49", "=Dashboard!$C$13", GREEN, fmt=CUR)
sset(ws, "A50", "Equity Value")
for col in "BCD":
    sset(ws, f"{col}50", f"={col}48+{col}49", BLACK, fmt=CUR)
sset(ws, "A51", "Diluted Shares (M)")
for col in "BCD":
    sset(ws, f"{col}51", "=Dashboard!$C$9", GREEN, fmt=NUM)
sset(ws, "A52", "INTRINSIC PRICE / SHARE", BOLD)
for col in "BCD":
    sset(ws, f"{col}52", f"={col}50/{col}51", BLACK, fmt=CUR2, fill=YEL, bold=True)
sset(ws, "A53", "Upside/(Downside) vs Current")
for col in "BCD":
    sset(ws, f"{col}53", f"={col}52/Dashboard!$C$6-1", BLACK, fmt=PCT)
sset(ws, "A55", "Prior analysis (2026-06-08, 165M shares, $717.5M Yr1 base): Bull $24.16 / Base $12.55 / Bear $6.97. Current model uses 180.3M diluted shares and $739M Yr1 base.", NOTE)
sset(ws, "A56", "Note: prior model's base/bear Yr4 FCF cells were overwritten by dashboard link cells (row-40 kludge), slightly understating base/bear. Fixed in this build — dashboard links directly to B52:D52.", NOTE)

# ============ RULE OF 40 ============
ws = wb.create_sheet("Rule_of_40")
ws.sheet_view.showGridLines = False
for col, w in zip("ABCDEFG", [44, 13, 13, 13, 13, 13, 40]): ws.column_dimensions[col].width = w

sset(ws, "A1", "FSLY — RULE OF 40 ANALYSIS", H1)
sset(ws, "A2", "Rule of 40 = Revenue Growth % + Profitability Margin %.  >40 healthy, >60 exceptional.", NOTE)

sset(ws, "A4", "FSLY SCORECARD — TREND", H2, fill=HDR_FILL)
for c in "BCD": sset(ws, f"{c}4", "", fill=HDR_FILL)
sset(ws, "A5", "Basis", BOLD); sset(ws, "B5", "Growth %", BOLD); sset(ws, "C5", "Margin %", BOLD); sset(ws, "D5", "Rule of 40", BOLD)
score_rows = [
    ("FY2025 — FCF margin", 0.148, 0.073, "FY2025 actuals"),
    ("FY2025 — Adj. EBITDA margin", 0.148, 0.124, "FY2025 actuals"),
    ("Q1 2026 — Adj. EBITDA margin", 0.20, 0.17, "Q1 2026 actuals"),
    ("Q2 2026 — FCF margin (capex-heavy)", 0.23, 0.020, "Q2 2026: FCF $3.6M / $183.3M"),
    ("Q2 2026 — Non-GAAP op margin", 0.23, 0.147, "Q2 2026: $27.0M / $183.3M"),
    ("Q2 2026 — Adj. EBITDA margin", 0.23, 0.208, "Q2 2026: $38.1M / $183.3M"),
    ("FY2026 guided — Non-GAAP op margin", 0.184, 0.124, "FY26 guidance midpoints: rev $739M, OI $92M"),
]
r = 6
for label, g, m, cmt in score_rows:
    sset(ws, f"A{r}", label)
    sset(ws, f"B{r}", g, BLUE, fmt=PCT, comment=cmt)
    sset(ws, f"C{r}", m, BLUE, fmt=PCT)
    sset(ws, f"D{r}", f"=(B{r}+C{r})*100", BLACK, fmt='0.0')
    r += 1
# rows: 6 FY25 FCF, 7 FY25 EBITDA, 8..? wait ordering
# Recompute: rows 6-12. Q2 EBITDA basis row = 11. FY25 EBITDA = row 7.
sset(ws, "A14", "HEADLINES", H2, fill=HDR_FILL)
for c in "BCD": sset(ws, f"{c}14", "", fill=HDR_FILL)
sset(ws, "A15", "Q2 2026 headline R40 (adj. EBITDA basis) — FIRST CROSS ABOVE 40", BOLD)
sset(ws, "D15", "=D11", BLACK, fmt='0.0', fill=YEL, bold=True)
sset(ws, "A8b" if False else "A16", "FY2025 headline R40 (adj. EBITDA basis)")
sset(ws, "D16", "=D7", BLACK, fmt='0.0')
sset(ws, "A17", "Trend: 27.2 (FY25) → 37.0 (Q1'26) → 43.8 (Q2'26). The June 2026 memo called crossing 40 'the single most important fundamental milestone for a re-rating' — it happened this quarter, and the stock re-rated +38%.", NOTE)
# fix Dashboard refs: F16 -> Rule_of_40!D15 (Q2 headline), F17 -> Rule_of_40!D8? FY25 EBITDA is row 7. Fix below after building.

sset(ws, "A19", "PEER COMPARABLES (CDN / Edge / Security)", H2, fill=HDR_FILL)
for c in "BCDEFG": sset(ws, f"{c}19", "", fill=HDR_FILL)
hdrs = ["Company", "Ticker", "Fwd Rev Growth", "FCF Margin (est.)", "Rule of 40", "Fwd EV/Sales", "Note"]
for c, h in zip("ABCDEFG", hdrs): sset(ws, f"{c}20", h, BOLD)
peers = [
    ("Fastly", "FSLY", 0.18, 0.08, 6.0, "Subject — Ro40 crossed on EBITDA basis; EV/S re-rated 4.4x→6.0x since June"),
    ("Cloudflare", "NET", 0.29, 0.12, 26, "Premium multiple; ~30% growth"),
    ("Akamai", "AKAM", 0.06, 0.22, 4.3, "Mature; security/compute pivot"),
    ("Datadog", "DDOG", 0.23, 0.26, 13, "Observability; high R40"),
    ("Cloudflare-tier avg", "—", 0.29, 0.12, 26, "Hypergrowth comp"),
    ("CDN/infra avg", "—", 0.10, 0.18, 4.0, "Mature infra comp"),
    ("Limelight/Edgio (defunct)", "—", None, None, None, "Cautionary CDN comp — went to zero"),
]
r = 21
for name, tkr, g, m, evs, note in peers:
    sset(ws, f"A{r}", name, fill=YEL if tkr == "FSLY" else None)
    sset(ws, f"B{r}", tkr)
    if g is not None:
        sset(ws, f"C{r}", g, BLUE, fmt=PCT, comment="Approximate analyst estimates, Aug 2026")
        sset(ws, f"D{r}", m, BLUE, fmt=PCT)
        sset(ws, f"E{r}", f"=(C{r}+D{r})*100", BLACK, fmt='0.0')
        sset(ws, f"F{r}", evs, BLUE, fmt=MULT)
    else:
        sset(ws, f"C{r}", "n/a"); sset(ws, f"D{r}", "n/a"); sset(ws, f"E{r}", "n/a"); sset(ws, f"F{r}", "n/a")
    sset(ws, f"G{r}", note, NOTE)
    r += 1
sset(ws, "A29", "Peer growth/FCF figures are approximate analyst estimates for context, not precise consensus.", NOTE)

# ---- Leadership Scorecard block ----
sset(ws, "A32", "LEADERSHIP & GOVERNANCE SCORECARD (0/5/10 per criterion, max 50)", H2, fill=HDR_FILL)
for c in "BCDEFG": sset(ws, f"{c}32", "", fill=HDR_FILL)
sset(ws, "A33", "CEO: Kip Compton (hired; internal promotion from Chief Product Officer, June 2025; ex-Cisco SVP)", NOTE)
sset(ws, "A34", "CFO: Richard Wong (Aug 2025; first CFO at Benchling and Houzz; ex-VP Finance LinkedIn)   |   Insider ownership: 6.21%   |   Institutional: 86.45%", NOTE)
sset(ws, "A36", "Criterion", BOLD); sset(ws, "B36", "Score", BOLD); sset(ws, "C36", "Evidence", BOLD)
ws.merge_cells("C36:G36")
lead = [
    ("Execution track record", 10, "Two consecutive beat-and-raise quarters under new team; FY26 op income guide raised 46% ($63M→$92M mid) on Aug 5 2026"),
    ("Founder / tenure / skin in game", 5, "Hired CEO, 14-month tenure; founder Bergman no longer in executive seat; insider ownership 6.21% (modest)"),
    ("Capital allocation", 5, "Converts managed, no dilutive M&A; but diluted count 176.5M→180.3M in 2 qtrs + new universal shelf filed Aug 2026 (dilution overhang)"),
    ("Insider activity (Form 4)", 5, "Routine plan/tax sells only (CEO sold 14,868 sh Aug 2026; CTO tax sells; director 10b5-1); zero open-market buys in last 12 mo"),
    ("Governance & alignment", 5, "Orderly succession but heavy C-suite turnover (CEO, CFO, PAO changed within ~14 months); high board independence"),
]
r = 37
for crit, score, ev in lead:
    sset(ws, f"A{r}", crit)
    sset(ws, f"B{r}", score, BLUE, fmt='0', comment="Judgment input — 0/5/10 scale per leadership_scorecard.md")
    sset(ws, f"C{r}", ev, NOTE); ws.merge_cells(f"C{r}:G{r}")
    r += 1
sset(ws, "A42", "COMPOSITE (max 50)", BOLD)
sset(ws, "B42", "=SUM(B37:B41)", BLACK, fmt='0', fill=YEL, bold=True)
sset(ws, "C42", '=IF(B42>=40,"Strong — supports Bull Case",IF(B42>=25,"Neutral — not a differentiator","Risk — supports Bear Case"))', BLACK)
ws.merge_cells("C42:G42")

# ============ OPTIONS STRATEGY ============
ws = wb.create_sheet("Options_Strategy")
ws.sheet_view.showGridLines = False
for col, w in zip("ABCDEF", [26, 34, 20, 26, 30, 46]): ws.column_dimensions[col].width = w

sset(ws, "A1", "FSLY — OPTIONS OVERLAY (optional; existing long-share position)", H1)
sset(ws, "A2", "Vehicle this run: LONG EQUITY. Overlay is optional income/protection. Post-spike IV is elevated — favors SELLING premium, not buying. Yields PER CYCLE.", NOTE)

sset(ws, "A4", "MARKET REFERENCE", H2, fill=HDR_FILL); sset(ws, "B4", "", fill=HDR_FILL)
refs = [
    ("Current Price", "=Dashboard!C6", GREEN, CUR2, None),
    ("52-Week High (resistance)", 34.82, BLUE, CUR2, "May 2026 peak zone $32.36–34.82"),
    ("50-Day SMA (support)", 19.83, BLUE, CUR2, None),
    ("200-Day SMA (support)", 17.22, BLUE, CUR2, None),
    ("DCF Bull Case", "=Model!B52", GREEN, CUR2, None),
    ("DCF Base Case", "=Model!C52", GREEN, CUR2, None),
    ("DCF Bear Case", "=Model!D52", GREEN, CUR2, None),
]
r = 5
for label, val, font, fmt, cmt in refs:
    sset(ws, f"A{r}", label)
    sset(ws, f"B{r}", val, font, fmt=fmt, comment=cmt)
    r += 1

sset(ws, "A13", "RECOMMENDED STRATEGIES (per 1 contract = 100 shares)", H2, fill=HDR_FILL)
for c in "BCDEF": sset(ws, f"{c}13", "", fill=HDR_FILL)
hdrs = ["Strategy", "Structure", "Net Premium / Cost", "Max Gain", "Max Loss / Risk", "Rationale"]
for c, h in zip("ABCDEF", hdrs): sset(ws, f"{c}14", h, BOLD)
strats = [
    ("Covered Call (primary)", "Sell ~$32 call, 45–60 DTE (Sep/Oct 2026)", "est. +$1.30–1.60 (~$130–160/contract)",
     "Premium + ~$4.25 appreciation to $32 ≈ $560–585/contract", "Caps upside above $32; keep shares unless called",
     "Price already exceeds bull DCF; $32 sits in the May-peak supply zone $32.36–34.82. Harvests post-spike IV. ~5% per-cycle yield."),
    ("Collar (protective)", "Sell $32 call + buy $22 put, ~60 DTE", "≈ net-zero cost (est.)",
     "Premium + appreciation to $32", "Floored near $22 (gap-fill level / pre-earnings base)",
     "After a +21% single-day gap with RSI 70 and 18% short float, protecting the unrealized gain is cheap. Best structure if not trimming shares."),
    ("Cash-Secured Put (re-entry)", "Sell ~$20 put, 45 DTE", "est. +$0.55–0.75 (~$55–75/contract)",
     "Premium kept if FSLY stays above $20", "Assigned at $20 (net ~$19.35) — $2,000 cash/contract",
     "Re-accumulates near 50-day SMA ($19.83) if the gap fully fades. Note: still above base DCF ($12.87) — size modestly."),
]
r = 15
for row in strats:
    for c, val in zip("ABCDEF", row):
        sset(ws, f"{c}{r}", val, BLUE if c != "A" else BLACK)
    r += 1
sset(ws, "A19", "Primary action this quarter is on the SHARES (hold core / trim into strength above bull DCF) — see memo Verdict. Overlay is optional.", NOTE)
sset(ws, "A20", "Premiums are estimates pending live IV; verify on the chain. Yields are PER CYCLE, not annualized. Not investment advice.", NOTE)

wb.save("FSLY_Investment_Model_2026-08-11.xlsx")
print("saved")
