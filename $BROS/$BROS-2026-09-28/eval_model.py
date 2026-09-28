"""Evaluate every formula in the model with the `formulas` library (no LibreOffice on Ed's Mac); print key cells."""
import sys, json, re, formulas
path = sys.argv[1]
sol = formulas.ExcelModel().loads(path).finish().calculate()
vals, errs = {}, []
for k, v in sol.items():
    m = re.match(r"'\[.*\](.+?)'!([A-Z]+\d+)$", k)
    if not m: continue
    try: val = v.value[0][0] if hasattr(v, "value") else v
    except Exception: val = str(v)
    if hasattr(val, "item"):
        try: val = val.item()
        except Exception: val = str(val)
    if str(val).startswith("#") or "XlError" in str(val): errs.append((m.group(1), m.group(2), str(val)))
    vals[f"{m.group(1).upper()}!{m.group(2)}"] = val
out = sys.argv[2] if len(sys.argv) > 2 else "values.json"
json.dump(vals, open(out, "w"), default=str, indent=0)
print("cells", len(vals), "errors", len(errs), errs[:10])
for k in ["DASHBOARD!B5", "DASHBOARD!B8", "DASHBOARD!B10", "DASHBOARD!B11", "DASHBOARD!B32", "DASHBOARD!C32", "DASHBOARD!D32", "DASHBOARD!B33", "DASHBOARD!C33", "DASHBOARD!D33",
          "UNIT_ECONOMICS!B37", "UNIT_ECONOMICS!C37", "OPTIONS_STRATEGY!B6", "OPTIONS_STRATEGY!B7", "OPTIONS_STRATEGY!G12", "OPTIONS_STRATEGY!G13", "OPTIONS_STRATEGY!G14",
          "OPTIONS_STRATEGY!C19", "OPTIONS_STRATEGY!D19", "OPTIONS_STRATEGY!E19", "OPTIONS_STRATEGY!C20", "OPTIONS_STRATEGY!D20", "OPTIONS_STRATEGY!E20", "OPTIONS_STRATEGY!C21",
          "SENTIMENT!B6", "SENTIMENT!B8", "SENTIMENT!B9", "SENTIMENT!B10"]:
    print(k, vals.get(k))
