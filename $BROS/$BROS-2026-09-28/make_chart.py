"""$BROS daily chart to the Sep 25, 2026 close: close, SMA 20/50/200, volume. Brand fonts; data from bros_hist.json (Yahoo 2y daily; SMAs seeded on 2y, last 12 months plotted)."""
import json, os, datetime, matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import font_manager as fm
import matplotlib.dates as mdates
HERE = os.path.dirname(os.path.abspath(__file__))
for f in ["Inter-Variable.ttf", "IBMPlexMono-Regular.ttf", "Fraunces-Variable.ttf"]:
    try: fm.fontManager.addfont(os.path.expanduser("~/Library/Fonts/") + f)
    except Exception as e: print("font", f, e)
plt.rcParams["font.family"] = "Inter"
d = json.load(open(os.path.join(HERE, "bros_hist.json")))["chart"]["result"][0]
off = d["meta"].get("gmtoffset", 0); q = d["indicators"]["quote"][0]
rows = [(datetime.datetime.fromtimestamp(t + off, datetime.UTC).date(), c, v) for t, c, v in zip(d["timestamp"], q["close"], q["volume"]) if c is not None]
rows = [r for r in rows if r[0] <= datetime.date(2026, 9, 25)]   # last full session; Sep 28 bar is intraday
dates = [r[0] for r in rows]; closes = [r[1] for r in rows]; vols = [r[2] for r in rows]
sma = lambda n: [sum(closes[i-n+1:i+1]) / n if i >= n-1 else None for i in range(len(closes))]
INK, TEAL, NAVY, WARN, GREY, UP, DOWN = "#0B0F0F", "#2C7A6B", "#2B4C7E", "#E0A33E", "#97A3A3", "#2E9E5B", "#D64545"
fig, (ax, axv) = plt.subplots(2, 1, figsize=(10, 6.2), dpi=150, gridspec_kw={"height_ratios": [3.2, 1]}, sharex=True)
S = {n: sma(n) for n in (20, 50, 200)}
k0 = next(i for i, x in enumerate(dates) if x >= datetime.date(2025, 9, 26))
dates, closes, vols = dates[k0:], closes[k0:], vols[k0:]
ax.plot(dates, closes, color=INK, lw=1.3, label="Close")
for n, col in ((20, TEAL), (50, NAVY), (200, WARN)):
    ax.plot(dates, S[n][k0:], color=col, lw=1.1, label=f"SMA {n}")
ax.grid(True, color="#DDE3E3", lw=0.6); ax.spines[["top", "right"]].set_visible(False)
ax.yaxis.set_major_formatter(matplotlib.ticker.FuncFormatter(lambda y, _: f"${y:.0f}"))
for lbl in ax.get_yticklabels(): lbl.set_fontfamily("IBM Plex Mono")
ax.set_title("BROS — daily close, 12 months to Sep 25, 2026", fontfamily="Fraunces", fontsize=13, color=NAVY, loc="left")
ann = [(datetime.date(2026, 8, 6), "Q2 beat-and-raise / −18%", -70, 38), (datetime.date(2026, 9, 2), "7 Brew wins Salad and Go auction", -95, -34),
       (datetime.date(2026, 9, 23), "52-wk low $37.72", -10, -26)]
for dt, txt, dx, dy in ann:
    if dt in dates:
        i = dates.index(dt)
        ax.annotate(txt, (dt, closes[i]), xytext=(dx, dy), textcoords="offset points", fontsize=7, color="#4D5757", ha="center",
                    arrowprops=dict(arrowstyle="-", color=GREY, lw=0.6))
ax.legend(loc="upper left", fontsize=8, frameon=False)
axv.bar(dates, [v / 1e6 for v in vols], color=[UP if i and closes[i] >= closes[i-1] else DOWN for i in range(len(closes))], width=1.0, lw=0)
axv.set_ylabel("Vol (M)", fontsize=8); axv.tick_params(labelsize=8); axv.spines[["top", "right"]].set_visible(False); axv.grid(True, axis="y", color="#DDE3E3", lw=0.6)
axv.xaxis.set_major_formatter(mdates.DateFormatter("%b %y"))
fig.text(0.01, 0.01, "Source: Yahoo Finance daily bars via query1 API, retrieved Sep 28, 2026 (bars to Sep 25 close). SMAs on closes. Volume: green = up day, red = down day.", fontsize=7, color="#6B7777")
fig.tight_layout(rect=(0, 0.03, 1, 1))
out = os.path.join(HERE, "$BROS_chart.png"); fig.savefig(out, facecolor="white"); print("chart", out)
