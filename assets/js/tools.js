/* 55993.com — calculator engine + tool definitions.
   Add a tool: add an entry to TOOLS here + metadata in scripts/build.py, then run `python3 scripts/build.py`. */
(function () {
  "use strict";
  var C1 = "#4f46e5", C2 = "#06b6d4", C3 = "#84cc16", C4 = "#f59e0b";
  function N(id, label, value, o) { o = o || {}; return { id: id, label: label, type: "number", value: value, step: o.step || "any", min: o.min, suffix: o.suffix, prefix: o.prefix }; }
  function S(id, label, options, value) { return { id: id, label: label, type: "select", options: options, value: value }; }
  function D(id, label, value) { return { id: id, label: label, type: "date", value: value }; }
  function T(id, label, value, ph) { return { id: id, label: label, type: "text", value: value, placeholder: ph || "" }; }
  function iso(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function today(off) { var d = new Date(); d.setDate(d.getDate() + (off || 0)); return iso(d); }
  function pmt(r, n, p) { return r === 0 ? p / n : p * r / (1 - Math.pow(1 + r, -n)); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a; }
  function factorize(n) { var f = [], d = 2; while (d * d <= n) { while (n % d === 0) { f.push(d); n /= d; } d += d === 2 ? 1 : 2; } if (n > 1) f.push(n); return f; }
  window.factorize = factorize; window.gcd = gcd;
  function pct(a, b) { return b ? (a / b * 100) : 0; }

  var TOOLS = {
    /* ================= FINANCE ================= */
    "mortgage-calculator": {
      inputs: [N("price", "Home price ($)", 450000), N("down", "Down payment ($)", 90000), N("rate", "Interest rate (% / yr)", 6.5), S("years", "Loan term", [["30", "30 years"], ["25", "25 years"], ["20", "20 years"], ["15", "15 years"], ["10", "10 years"]], "30"), N("tax", "Property tax ($ / yr)", 4500), N("ins", "Home insurance ($ / yr)", 1500), N("hoa", "HOA ($ / month)", 0)],
      lead: "mortgage",
      calc: function (v) {
        var P = v.price - v.down, r = v.rate / 1200, n = v.years * 12, m = pmt(r, n, P);
        var extra = v.tax / 12 + v.ins / 12 + v.hoa, total = m * n;
        return { label: "Estimated monthly payment", main: money(m + extra), rows: [["Principal & interest", money(m)], ["Property tax / mo", money(v.tax / 12)], ["Insurance / mo", money(v.ins / 12)], ["HOA / mo", money(v.hoa)], ["Loan amount", money(P)], ["Down payment", fmt(pct(v.down, v.price), 1) + "%"], ["Total interest paid", money(total - P)], ["Total of all P&I payments", money(total)]],
          bars: [{ v: P, l: "Principal", c: C1 }, { v: total - P, l: "Interest", c: C2 }, { v: (v.tax + v.ins + v.hoa * 12) * v.years, l: "Tax, insurance & HOA", c: C3 }] };
      }
    },
    "loan-emi-calculator": {
      inputs: [N("amt", "Loan amount", 25000), N("rate", "Interest rate (% / yr)", 9), N("years", "Tenure (years)", 5, { step: "0.5" })], lead: "loan",
      calc: function (v) {
        var r = v.rate / 1200, n = Math.round(v.years * 12), m = pmt(r, n, v.amt), tot = m * n;
        return { label: "Monthly EMI", main: fmt(m, 2), rows: [["Number of payments", n], ["Total interest", fmt(tot - v.amt, 2)], ["Total payable", fmt(tot, 2)], ["Interest as % of loan", fmt(pct(tot - v.amt, v.amt), 1) + "%"]], bars: [{ v: v.amt, l: "Principal", c: C1 }, { v: tot - v.amt, l: "Interest", c: C2 }] };
      }
    },
    "compound-interest-calculator": {
      inputs: [N("p", "Initial deposit ($)", 10000), N("pm", "Monthly contribution ($)", 300), N("rate", "Annual return (%)", 7), N("years", "Years", 20), S("cf", "Compounding", [["12", "Monthly"], ["4", "Quarterly"], ["1", "Yearly"], ["365", "Daily"]], "12")], lead: "advisor",
      calc: function (v) {
        var bal = v.p, months = v.years * 12, contrib = v.p, rate = v.rate / 100, cf = v.cf;
        for (var i = 1; i <= months; i++) { bal += v.pm; contrib += v.pm; if (cf === 12) bal *= 1 + rate / 12; else if (cf === 365) bal *= Math.pow(1 + rate / 365, 365 / 12); else if (i % (12 / cf) === 0) bal *= 1 + rate / cf; }
        return { label: "Future value", main: money(bal), rows: [["Total contributions", money(contrib)], ["Interest earned", money(bal - contrib)], ["Growth multiple", fmt(bal / contrib, 2) + "×"], ["Rule of 72 — doubling time", fmt(72 / v.rate, 1) + " years"]], bars: [{ v: contrib, l: "Contributions", c: C1 }, { v: bal - contrib, l: "Interest", c: C3 }] };
      }
    },
    "savings-goal-calculator": {
      inputs: [N("goal", "Savings goal ($)", 50000), N("have", "Already saved ($)", 5000), N("rate", "Annual return (%)", 4.5), N("years", "Years to reach goal", 5)], lead: "advisor",
      calc: function (v) {
        var r = v.rate / 1200, n = v.years * 12, fvHave = v.have * Math.pow(1 + r, n), need = Math.max(0, v.goal - fvHave);
        var m = r === 0 ? need / n : need * r / (Math.pow(1 + r, n) - 1);
        return { label: "Save this much per month", main: money(m), rows: [["Per week (approx.)", money(m * 12 / 52)], ["Your current savings grow to", money(fvHave)], ["Total you will deposit", money(m * n)], ["Interest does the rest", money(Math.max(0, v.goal - fvHave - m * n + (fvHave - v.have)))]] };
      }
    },
    "retirement-calculator": {
      inputs: [N("age", "Current age", 35), N("ret", "Retirement age", 65), N("saved", "Current savings ($)", 60000), N("pm", "Monthly contribution ($)", 800), N("rate", "Return before retirement (%)", 7), N("spend", "Desired yearly income in retirement ($)", 60000), N("wr", "Safe withdrawal rate (%)", 4)], lead: "advisor",
      calc: function (v) {
        var n = (v.ret - v.age) * 12, r = v.rate / 1200, fv = v.saved * Math.pow(1 + r, n) + (r ? v.pm * (Math.pow(1 + r, n) - 1) / r : v.pm * n);
        var need = v.spend / (v.wr / 100), gap = need - fv;
        return { label: "Projected nest egg at " + v.ret, main: money(fv), rows: [["Target nest egg (" + v.wr + "% rule)", money(need)], [gap > 0 ? "Shortfall" : "Surplus", money(Math.abs(gap))], ["Sustainable yearly income", money(fv * v.wr / 100)], ["Years of saving left", v.ret - v.age]], note: gap > 0 ? "You're behind target — increasing contributions by " + money(r ? gap * r / (Math.pow(1 + r, n) - 1) : gap / n) + "/month closes the gap." : "You're on track for your target income." };
      }
    },
    "credit-card-payoff-calculator": {
      inputs: [N("bal", "Card balance ($)", 6000), N("apr", "APR (%)", 22.9), N("pay", "Monthly payment ($)", 250)], lead: "loan",
      calc: function (v) {
        var r = v.apr / 1200, b = v.bal, m = 0, interest = 0;
        if (v.pay <= b * r) return { label: "Payoff time", main: "Never", rows: [["Minimum needed just to cover interest", money(b * r)]], note: "Your payment doesn't cover the monthly interest. Increase it." };
        while (b > 0 && m < 1200) { var i = b * r; interest += i; b = b + i - v.pay; m++; }
        return { label: "Debt-free in", main: Math.floor(m / 12) + " yr " + (m % 12) + " mo", rows: [["Number of payments", m], ["Total interest paid", money(interest)], ["Total paid", money(v.bal + interest)]], bars: [{ v: v.bal, l: "Balance", c: C1 }, { v: interest, l: "Interest", c: "#e11d48" }] };
      }
    },
    "roi-calculator": {
      inputs: [N("cost", "Amount invested ($)", 10000), N("ret", "Amount returned ($)", 14500), N("years", "Holding period (years)", 3, { step: "0.1" })], lead: "advisor",
      calc: function (v) {
        var gain = v.ret - v.cost, roi = pct(gain, v.cost), ann = (Math.pow(v.ret / v.cost, 1 / v.years) - 1) * 100;
        return { label: "Return on investment", main: fmt(roi, 2) + "%", rows: [["Net gain", money(gain)], ["Annualized ROI (CAGR)", fmt(ann, 2) + "%"], ["Money multiple", fmt(v.ret / v.cost, 2) + "×"]] };
      }
    },
    "inflation-calculator": {
      inputs: [N("amt", "Amount ($)", 1000), N("rate", "Average inflation rate (% / yr)", 3), N("years", "Years", 10), S("dir", "Direction", [["f", "Future cost of today's money"], ["p", "Today's value of future money"]], "f")],
      calc: function (v) {
        var f = Math.pow(1 + v.rate / 100, v.years), out = v.dir === "f" ? v.amt * f : v.amt / f;
        return { label: v.dir === "f" ? "Equivalent future cost" : "Value in today's money", main: money(out), rows: [["Cumulative inflation", fmt((f - 1) * 100, 2) + "%"], ["Purchasing power lost", fmt((1 - 1 / f) * 100, 2) + "%"]] };
      }
    },
    "salary-hourly-calculator": {
      inputs: [N("amt", "Amount ($)", 65000), S("per", "Per", [["year", "Year"], ["month", "Month"], ["week", "Week"], ["day", "Day"], ["hour", "Hour"]], "year"), N("hpw", "Hours per week", 40), N("wpy", "Weeks worked per year", 52)],
      calc: function (v) {
        var h = v.hpw * v.wpy, y = { year: v.amt, month: v.amt * 12, week: v.amt * v.wpy, day: v.amt * v.wpy * 5, hour: v.amt * h }[v.per];
        return { label: "Annual salary", main: money(y), rows: [["Monthly", money(y / 12)], ["Bi-weekly", money(y / 26)], ["Weekly", money(y / v.wpy)], ["Daily (5-day week)", money(y / v.wpy / 5)], ["Hourly", money(y / h)]] };
      }
    },
    "tip-calculator": {
      inputs: [N("bill", "Bill amount ($)", 86.4), N("tip", "Tip (%)", 18), N("people", "Split between (people)", 3, { step: "1", min: 1 })],
      calc: function (v) {
        var t = v.bill * v.tip / 100, tot = v.bill + t, p = Math.max(1, Math.round(v.people));
        return { label: "Each person pays", main: money(tot / p), rows: [["Tip amount", money(t)], ["Total with tip", money(tot)], ["Tip per person", money(t / p)]] };
      }
    },
    "discount-calculator": {
      inputs: [N("price", "Original price ($)", 129.99), N("off", "Discount (%)", 25), N("extra", "Extra discount (%)", 0), N("tax", "Sales tax (%)", 0)],
      calc: function (v) {
        var p1 = v.price * (1 - v.off / 100), p2 = p1 * (1 - v.extra / 100), fin = p2 * (1 + v.tax / 100);
        return { label: "Final price", main: money(fin), rows: [["You save", money(v.price - p2)], ["Effective discount", fmt(pct(v.price - p2, v.price), 2) + "%"], ["Price before tax", money(p2)], ["Tax", money(fin - p2)]] };
      }
    },
    "sales-tax-calculator": {
      inputs: [N("amt", "Amount ($)", 100), N("rate", "Tax / VAT / GST rate (%)", 13), S("mode", "Mode", [["add", "Add tax to net price"], ["remove", "Remove tax from gross price"]], "add")],
      calc: function (v) {
        var net = v.mode === "add" ? v.amt : v.amt / (1 + v.rate / 100), tax = net * v.rate / 100;
        return { label: v.mode === "add" ? "Gross price (incl. tax)" : "Net price (excl. tax)", main: money(v.mode === "add" ? net + tax : net), rows: [["Net", money(net)], ["Tax", money(tax)], ["Gross", money(net + tax)]] };
      }
    },
    "profit-margin-calculator": {
      inputs: [N("cost", "Cost ($)", 40), N("price", "Selling price ($)", 65)],
      calc: function (v) {
        var p = v.price - v.cost;
        return { label: "Gross margin", main: fmt(pct(p, v.price), 2) + "%", rows: [["Profit per unit", money(p)], ["Markup", fmt(pct(p, v.cost), 2) + "%"], ["Price for 50% margin", money(v.cost / 0.5)]] };
      }
    },
    "break-even-calculator": {
      inputs: [N("fixed", "Fixed costs ($ / month)", 12000), N("price", "Price per unit ($)", 49), N("var", "Variable cost per unit ($)", 18)], lead: "business",
      calc: function (v) {
        var cm = v.price - v.var; if (cm <= 0) return { label: "Break-even", main: "Not possible", rows: [], note: "Price must exceed variable cost." };
        var u = v.fixed / cm;
        return { label: "Break-even units", main: fmt(Math.ceil(u), 0), rows: [["Break-even revenue", money(Math.ceil(u) * v.price)], ["Contribution margin / unit", money(cm)], ["Contribution margin ratio", fmt(pct(cm, v.price), 1) + "%"]] };
      }
    },

    /* ================= MATH ================= */
    "percentage-calculator": {
      inputs: [S("mode", "What do you want to find?", [["of", "What is X% of Y?"], ["is", "X is what % of Y?"], ["chg", "% change from X to Y"], ["inc", "Increase Y by X%"], ["dec", "Decrease Y by X%"]], "of"), N("x", "X", 15), N("y", "Y", 240)], lead: "tutor",
      calc: function (v) {
        var m = v.mode, r, l;
        if (m === "of") { r = v.x / 100 * v.y; l = v.x + "% of " + v.y; }
        else if (m === "is") { r = fmt(pct(v.x, v.y), 4) + "%"; l = v.x + " is this % of " + v.y; }
        else if (m === "chg") { r = fmt((v.y - v.x) / Math.abs(v.x) * 100, 4) + "%"; l = "Change from " + v.x + " to " + v.y; }
        else if (m === "inc") { r = v.y * (1 + v.x / 100); l = v.y + " increased by " + v.x + "%"; }
        else { r = v.y * (1 - v.x / 100); l = v.y + " decreased by " + v.x + "%"; }
        return { label: l, main: typeof r === "number" ? fmt(r, 6) : r, rows: [] };
      }
    },
    "quadratic-equation-solver": {
      inputs: [N("a", "a", 1), N("b", "b", -3), N("c", "c", -10)], lead: "tutor",
      calc: function (v) {
        if (v.a === 0) return { label: "Linear equation", main: "x = " + fmt(-v.c / v.b, 6), rows: [] };
        var d = v.b * v.b - 4 * v.a * v.c, vx = -v.b / (2 * v.a), vy = v.a * vx * vx + v.b * vx + v.c, main;
        if (d > 0) main = "x₁ = " + fmt((-v.b + Math.sqrt(d)) / (2 * v.a), 6) + ",  x₂ = " + fmt((-v.b - Math.sqrt(d)) / (2 * v.a), 6);
        else if (d === 0) main = "x = " + fmt(vx, 6);
        else main = "x = " + fmt(vx, 6) + " ± " + fmt(Math.sqrt(-d) / (2 * Math.abs(v.a)), 6) + "i";
        return { label: "Roots of " + v.a + "x² + " + v.b + "x + " + v.c + " = 0", main: main, rows: [["Discriminant (b² − 4ac)", fmt(d, 6)], ["Root type", d > 0 ? "Two real roots" : d === 0 ? "One repeated real root" : "Two complex roots"], ["Vertex", "(" + fmt(vx, 4) + ", " + fmt(vy, 4) + ")"], ["Axis of symmetry", "x = " + fmt(vx, 4)]] };
      }
    },
    "gcd-lcm-calculator": {
      inputs: [T("nums", "Numbers (comma separated)", "12, 18, 30")], lead: "tutor",
      calc: function (v) {
        var a = String(v.nums).split(/[\s,;]+/).map(Number).filter(function (x) { return x && isFinite(x); }).map(Math.round);
        if (a.length < 2) return { label: "Enter at least two whole numbers", main: "—", rows: [] };
        var g = a.reduce(gcd), l = a.reduce(function (x, y) { return x / gcd(x, y) * y; });
        return { label: "Greatest common divisor (GCD)", main: String(g), rows: [["Least common multiple (LCM)", fmt(l, 0)], ["Numbers", a.join(", ")]] };
      }
    },
    "prime-factorization-calculator": {
      inputs: [N("n", "Whole number", 55993, { step: "1", min: 2 })], lead: "tutor",
      calc: function (v) {
        var n = Math.round(v.n); if (n < 2 || n > 9007199254740991) return { label: "Enter a whole number ≥ 2", main: "—", rows: [] };
        var f = factorize(n), cnt = {}; f.forEach(function (p) { cnt[p] = (cnt[p] || 0) + 1; });
        var exp = Object.keys(cnt).map(function (p) { return cnt[p] > 1 ? p + "^" + cnt[p] : p; }).join(" × ");
        var nd = Object.keys(cnt).reduce(function (a, p) { return a * (cnt[p] + 1); }, 1);
        return { label: "Prime factorization of " + n.toLocaleString(), main: exp, rows: [["Is prime?", f.length === 1 ? "Yes" : "No"], ["Distinct prime factors", Object.keys(cnt).length], ["Number of divisors", nd]], note: "Explore every property of " + n + " in the Number Explorer." };
      }
    },
    "statistics-calculator": {
      inputs: [T("data", "Data set (comma or space separated)", "4, 8, 15, 16, 23, 42")], lead: "tutor",
      calc: function (v) {
        var a = String(v.data).split(/[\s,;]+/).filter(Boolean).map(Number).filter(isFinite);
        if (!a.length) return { label: "Enter numbers", main: "—", rows: [] };
        var n = a.length, s = a.slice().sort(function (x, y) { return x - y; }), sum = a.reduce(function (x, y) { return x + y; }, 0), mean = sum / n;
        var med = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
        var freq = {}, mx = 0; a.forEach(function (x) { freq[x] = (freq[x] || 0) + 1; mx = Math.max(mx, freq[x]); });
        var mode = mx > 1 ? Object.keys(freq).filter(function (k) { return freq[k] === mx; }).join(", ") : "none";
        var ss = a.reduce(function (t, x) { return t + (x - mean) * (x - mean); }, 0);
        return { label: "Mean (average)", main: fmt(mean, 6), rows: [["Count", n], ["Sum", fmt(sum, 6)], ["Median", fmt(med, 6)], ["Mode", mode], ["Min / Max", fmt(s[0], 6) + " / " + fmt(s[n - 1], 6)], ["Range", fmt(s[n - 1] - s[0], 6)], ["Population std. dev. (σ)", fmt(Math.sqrt(ss / n), 6)], ["Sample std. dev. (s)", n > 1 ? fmt(Math.sqrt(ss / (n - 1)), 6) : "—"], ["Sample variance", n > 1 ? fmt(ss / (n - 1), 6) : "—"]] };
      }
    },
    "fraction-calculator": {
      inputs: [T("a", "First fraction", "3/4"), S("op", "Operation", [["+", "+ add"], ["-", "− subtract"], ["*", "× multiply"], ["/", "÷ divide"]], "+"), T("b", "Second fraction", "5/6")], lead: "tutor",
      calc: function (v) {
        function parse(s) { s = String(s).trim(); var m = /^(-?\d+)\s+(\d+)\/(\d+)$/.exec(s); if (m) { var w = +m[1]; return [w * +m[3] + (w < 0 ? -1 : 1) * +m[2], +m[3]]; } m = /^(-?\d+)\s*\/\s*(-?\d+)$/.exec(s); if (m) return [+m[1], +m[2]]; if (/^-?\d+$/.test(s)) return [+s, 1]; return null; }
        var a = parse(v.a), b = parse(v.b); if (!a || !b || !a[1] || !b[1]) return { label: "Use formats like 3/4, -2/5 or 1 1/2", main: "—", rows: [] };
        var n, d; if (v.op === "+") { n = a[0] * b[1] + b[0] * a[1]; d = a[1] * b[1]; } else if (v.op === "-") { n = a[0] * b[1] - b[0] * a[1]; d = a[1] * b[1]; } else if (v.op === "*") { n = a[0] * b[0]; d = a[1] * b[1]; } else { n = a[0] * b[1]; d = a[1] * b[0]; }
        if (!d) return { label: "Division by zero", main: "—", rows: [] };
        var g = gcd(n, d) || 1; n /= g; d /= g; if (d < 0) { n = -n; d = -d; }
        var whole = Math.trunc(n / d), rem = Math.abs(n % d);
        return { label: "Result (simplified)", main: d === 1 ? String(n) : n + "/" + d, rows: [["Mixed number", d === 1 ? String(n) : (whole ? whole + " " + rem + "/" + d : n + "/" + d)], ["Decimal", fmt(n / d, 8)], ["Percent", fmt(n / d * 100, 4) + "%"]] };
      }
    },
    "exponent-log-calculator": {
      inputs: [N("b", "Base (b)", 2), N("x", "Exponent / value (x)", 10)], lead: "tutor",
      calc: function (v) {
        return { label: v.b + " ^ " + v.x, main: fmt(Math.pow(v.b, v.x), 8), rows: [["log base " + v.b + " of " + v.x, fmt(Math.log(v.x) / Math.log(v.b), 8)], ["ln(" + v.x + ")", fmt(Math.log(v.x), 8)], ["log₁₀(" + v.x + ")", fmt(Math.log10(v.x), 8)], ["√" + v.x, fmt(Math.sqrt(v.x), 8)], [v.x + " root of " + v.b, fmt(Math.pow(v.b, 1 / v.x), 8)]] };
      }
    },
    "ratio-proportion-calculator": {
      inputs: [N("a", "A", 3), N("b", "B", 4), N("c", "C", 15)], lead: "tutor",
      calc: function (v) {
        var x = v.b * v.c / v.a, g = gcd(Math.round(v.a * 1e6), Math.round(v.b * 1e6)) || 1;
        return { label: "Solve A : B = C : X", main: "X = " + fmt(x, 6), rows: [["Simplified A : B", fmt(v.a * 1e6 / g, 0) + " : " + fmt(v.b * 1e6 / g, 0)], ["A / B as decimal", fmt(v.a / v.b, 6)], ["A as % of (A+B)", fmt(pct(v.a, v.a + v.b), 2) + "%"]] };
      }
    },

    /* ================= HEALTH ================= */
    "bmi-calculator": {
      inputs: [S("unit", "Units", [["m", "Metric (kg, cm)"], ["i", "Imperial (lb, in)"]], "m"), N("w", "Weight", 72), N("h", "Height", 175)],
      calc: function (v) {
        var kg = v.unit === "m" ? v.w : v.w * 0.45359237, m = (v.unit === "m" ? v.h : v.h * 2.54) / 100, bmi = kg / (m * m);
        var cat = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Healthy weight" : bmi < 30 ? "Overweight" : "Obesity";
        return { label: "Body Mass Index — " + cat, main: fmt(bmi, 1), rows: [["Healthy BMI range", "18.5 – 24.9"], ["Healthy weight for your height", fmt(18.5 * m * m, 1) + " – " + fmt(24.9 * m * m, 1) + " kg"], ["BMI Prime", fmt(bmi / 25, 2)]], note: "BMI is a screening measure, not a diagnosis. Talk to a clinician about your health." };
      }
    },
    "calorie-calculator": {
      inputs: [S("sex", "Sex", [["m", "Male"], ["f", "Female"]], "m"), N("age", "Age", 35), N("kg", "Weight (kg)", 78), N("cm", "Height (cm)", 178), S("act", "Activity", [["1.2", "Sedentary"], ["1.375", "Light (1–3 days/wk)"], ["1.55", "Moderate (3–5 days/wk)"], ["1.725", "Very active (6–7 days/wk)"], ["1.9", "Athlete / physical job"]], "1.55")],
      calc: function (v) {
        var bmr = 10 * v.kg + 6.25 * v.cm - 5 * v.age + (v.sex === "m" ? 5 : -161), t = bmr * v.act;
        return { label: "Maintenance calories / day", main: fmt(Math.round(t), 0) + " kcal", rows: [["BMR (Mifflin–St Jeor)", fmt(Math.round(bmr), 0) + " kcal"], ["Mild loss (≈0.25 kg/wk)", fmt(Math.round(t - 275), 0) + " kcal"], ["Loss (≈0.5 kg/wk)", fmt(Math.round(t - 550), 0) + " kcal"], ["Gain (≈0.25 kg/wk)", fmt(Math.round(t + 275), 0) + " kcal"]], note: "Estimates only — individual needs vary." };
      }
    },
    "ideal-weight-calculator": {
      inputs: [S("sex", "Sex", [["m", "Male"], ["f", "Female"]], "m"), N("cm", "Height (cm)", 175)],
      calc: function (v) {
        var inch = v.cm / 2.54 - 60, m = v.sex === "m";
        var devine = (m ? 50 : 45.5) + 2.3 * inch, robinson = (m ? 52 : 49) + (m ? 1.9 : 1.7) * inch, miller = (m ? 56.2 : 53.1) + (m ? 1.41 : 1.36) * inch, hamwi = (m ? 48 : 45.5) + (m ? 2.7 : 2.2) * inch;
        return { label: "Ideal weight (Devine formula)", main: fmt(devine, 1) + " kg", rows: [["Robinson (1983)", fmt(robinson, 1) + " kg"], ["Miller (1983)", fmt(miller, 1) + " kg"], ["Hamwi (1964)", fmt(hamwi, 1) + " kg"], ["Healthy BMI range", fmt(18.5 * Math.pow(v.cm / 100, 2), 1) + " – " + fmt(24.9 * Math.pow(v.cm / 100, 2), 1) + " kg"]] };
      }
    },
    "water-intake-calculator": {
      inputs: [N("kg", "Body weight (kg)", 70), N("ex", "Exercise (minutes / day)", 30), S("clim", "Climate", [["0", "Temperate"], ["0.5", "Hot / humid"]], "0")],
      calc: function (v) {
        var l = v.kg * 0.033 + v.ex / 30 * 0.35 + (+v.clim);
        return { label: "Suggested daily water", main: fmt(l, 1) + " L", rows: [["Glasses (250 ml)", fmt(Math.round(l / 0.25), 0)], ["US fluid ounces", fmt(l * 33.814, 0) + " fl oz"]], note: "General guidance; follow medical advice if you have a condition affecting fluids." };
      }
    },

    /* ================= DATE & TIME ================= */
    "age-calculator": {
      inputs: [D("dob", "Date of birth", "1990-05-15"), D("on", "Age on date", today())],
      calc: function (v) {
        var a = new Date(v.dob + "T00:00:00"), b = new Date(v.on + "T00:00:00"); if (isNaN(a) || isNaN(b) || b < a) return { label: "Check the dates", main: "—", rows: [] };
        var y = b.getFullYear() - a.getFullYear(), m = b.getMonth() - a.getMonth(), d = b.getDate() - a.getDate();
        if (d < 0) { m--; d += new Date(b.getFullYear(), b.getMonth(), 0).getDate(); } if (m < 0) { y--; m += 12; }
        var days = Math.round((b - a) / 864e5), nb = new Date(b.getFullYear(), a.getMonth(), a.getDate()); if (nb < b) nb.setFullYear(nb.getFullYear() + 1);
        return { label: "Exact age", main: y + " years, " + m + " months, " + d + " days", rows: [["Total months", fmt(y * 12 + m, 0)], ["Total weeks", fmt(Math.floor(days / 7), 0)], ["Total days", fmt(days, 0)], ["Total hours (approx.)", fmt(days * 24, 0)], ["Days until next birthday", fmt(Math.round((nb - b) / 864e5), 0)], ["Born on a", a.toLocaleDateString(undefined, { weekday: "long" })]] };
      }
    },
    "date-difference-calculator": {
      inputs: [D("a", "Start date", today(-100)), D("b", "End date", today()), S("inc", "Include end date?", [["0", "No"], ["1", "Yes (+1 day)"]], "0")],
      calc: function (v) {
        var a = new Date(v.a + "T00:00:00"), b = new Date(v.b + "T00:00:00"), days = Math.round((b - a) / 864e5) + (+v.inc), wd = 0, s = new Date(Math.min(a, b)), e = new Date(Math.max(a, b));
        for (var d = new Date(s); d <= e && wd < 400000; d.setDate(d.getDate() + 1)) { var k = d.getDay(); if (k && k !== 6) wd++; }
        return { label: "Days between dates", main: fmt(days, 0) + " days", rows: [["Weeks + days", Math.floor(Math.abs(days) / 7) + " weeks " + Math.abs(days) % 7 + " days"], ["Weekdays (Mon–Fri, inclusive)", fmt(wd, 0)], ["Approx. months", fmt(days / 30.4375, 2)], ["Approx. years", fmt(days / 365.25, 3)]] };
      }
    },
    "add-days-calculator": {
      inputs: [D("d", "Start date", today()), N("n", "Days to add (negative to subtract)", 90, { step: "1" }), S("biz", "Count", [["0", "Calendar days"], ["1", "Business days (Mon–Fri)"]], "0")],
      calc: function (v) {
        var d = new Date(v.d + "T00:00:00"), n = Math.round(v.n), step = n < 0 ? -1 : 1;
        if (v.biz === "1") { var left = Math.abs(n); while (left > 0) { d.setDate(d.getDate() + step); var k = d.getDay(); if (k && k !== 6) left--; } } else d.setDate(d.getDate() + n);
        return { label: "Resulting date", main: d.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" }), rows: [["ISO format", iso(d)], ["Day of year", Math.ceil((d - new Date(d.getFullYear(), 0, 1)) / 864e5) + 1]] };
      }
    },
    "time-duration-calculator": {
      inputs: [T("s", "Start time (HH:MM)", "09:15"), T("e", "End time (HH:MM)", "17:40"), N("brk", "Break (minutes)", 30)],
      calc: function (v) {
        function p(t) { var m = /^(\d{1,2}):(\d{2})$/.exec(String(t).trim()); return m ? +m[1] * 60 + +m[2] : NaN; }
        var s = p(v.s), e = p(v.e); if (isNaN(s) || isNaN(e)) return { label: "Use 24-hour HH:MM", main: "—", rows: [] };
        var mins = e - s; if (mins < 0) mins += 1440; mins -= v.brk;
        return { label: "Duration", main: Math.floor(mins / 60) + " h " + (mins % 60) + " min", rows: [["Decimal hours", fmt(mins / 60, 2)], ["Total minutes", mins], ["Crosses midnight?", e < s ? "Yes" : "No"]] };
      }
    },

    /* ================= CONVERTERS ================= */
    "number-base-converter": {
      inputs: [T("v", "Value", "55993"), S("from", "From base", [["10", "Decimal (10)"], ["2", "Binary (2)"], ["8", "Octal (8)"], ["16", "Hexadecimal (16)"], ["36", "Base 36"]], "10")], lead: "tutor",
      calc: function (v) {
        var s = String(v.v).trim().toLowerCase(), b = +v.from, n;
        try { n = BigInt(0); for (var i = 0; i < s.length; i++) { var d = parseInt(s[i], 36); if (isNaN(d) || d >= b) throw 0; n = n * BigInt(b) + BigInt(d); } } catch (e) { return { label: "Invalid digit for base " + b, main: "—", rows: [] }; }
        return { label: "Decimal", main: n.toString(10), rows: [["Binary", n.toString(2)], ["Octal", n.toString(8)], ["Hexadecimal", n.toString(16).toUpperCase()], ["Base 36", n.toString(36).toUpperCase()], ["Bits needed", n.toString(2).length]] };
      }
    },
    "roman-numeral-converter": {
      inputs: [T("v", "Number or Roman numeral", "2026")],
      calc: function (v) {
        var s = String(v.v).trim().toUpperCase(), map = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
        if (/^\d+$/.test(s)) { var n = +s; if (n < 1 || n > 3999) return { label: "Range is 1–3999", main: "—", rows: [] }; var r = ""; map.forEach(function (p) { while (n >= p[0]) { r += p[1]; n -= p[0]; } }); return { label: s + " in Roman numerals", main: r, rows: [] }; }
        if (!/^[MDCLXVI]+$/.test(s)) return { label: "Enter a number (1–3999) or Roman numeral", main: "—", rows: [] };
        var val = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }, t = 0; for (var i = 0; i < s.length; i++) { var c = val[s[i]], nx = val[s[i + 1]] || 0; t += c < nx ? -c : c; }
        return { label: s + " as a number", main: String(t), rows: [] };
      }
    },

    /* ================= RANDOM ================= */
    "random-number-generator": {
      inputs: [N("min", "Minimum", 1, { step: "1" }), N("max", "Maximum", 100, { step: "1" }), N("count", "How many numbers", 1, { step: "1", min: 1 }), S("uniq", "Allow duplicates?", [["1", "No — unique only"], ["0", "Yes"]], "1")], button: "Generate",
      calc: function (v) {
        var lo = Math.ceil(Math.min(v.min, v.max)), hi = Math.floor(Math.max(v.min, v.max)), n = Math.min(1000, Math.max(1, Math.round(v.count))), span = hi - lo + 1, out = [], seen = {};
        if (v.uniq === "1" && n > span) return { label: "Range too small for unique numbers", main: "—", rows: [] };
        function r() { var a = new Uint32Array(1); crypto.getRandomValues(a); return lo + a[0] % span; }
        while (out.length < n) { var x = r(); if (v.uniq === "1") { if (seen[x]) continue; seen[x] = 1; } out.push(x); }
        return { label: "Your random number" + (n > 1 ? "s" : "") + " (crypto-secure)", main: out.join(", "), rows: n > 1 ? [["Sum", fmt(out.reduce(function (a, b) { return a + b; }, 0), 0)], ["Sorted", out.slice().sort(function (a, b) { return a - b; }).join(", ")]] : [] };
      }
    },
    "dice-coin-roller": {
      inputs: [S("kind", "Roll", [["6", "d6 (standard die)"], ["4", "d4"], ["8", "d8"], ["10", "d10"], ["12", "d12"], ["20", "d20"], ["2", "Coin flip"]], "6"), N("count", "How many", 2, { step: "1", min: 1 })], button: "Roll",
      calc: function (v) {
        var sides = +v.kind, n = Math.min(100, Math.max(1, Math.round(v.count))), out = [];
        for (var i = 0; i < n; i++) { var a = new Uint32Array(1); crypto.getRandomValues(a); out.push(1 + a[0] % sides); }
        if (sides === 2) { var h = out.filter(function (x) { return x === 1; }).length; return { label: "Coin flips", main: out.map(function (x) { return x === 1 ? "Heads" : "Tails"; }).join(", "), rows: [["Heads", h], ["Tails", n - h]] }; }
        return { label: n + " × d" + sides, main: out.join("  ·  "), rows: [["Total", out.reduce(function (a, b) { return a + b; }, 0)], ["Highest", Math.max.apply(null, out)], ["Lowest", Math.min.apply(null, out)]] };
      }
    },
    "password-generator": {
      inputs: [N("len", "Length", 20, { step: "1", min: 6 }), S("set", "Characters", [["all", "Letters + numbers + symbols"], ["an", "Letters + numbers"], ["num", "Numbers only (PIN)"]], "all")], button: "Generate",
      calc: function (v) {
        var sets = { all: "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*-_=+?", an: "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789", num: "0123456789" }, cs = sets[v.set], L = Math.min(128, Math.max(4, Math.round(v.len))), a = new Uint32Array(L), p = "";
        crypto.getRandomValues(a); for (var i = 0; i < L; i++) p += cs[a[i] % cs.length];
        var bits = L * Math.log2(cs.length);
        return { label: "Generated locally in your browser — never sent anywhere", main: p, rows: [["Entropy", fmt(bits, 0) + " bits"], ["Strength", bits >= 100 ? "Excellent" : bits >= 70 ? "Strong" : bits >= 45 ? "Fair" : "Weak"]], copy: p };
      }
    }
  };

  /* ================= CUSTOM TOOLS ================= */
  var UNITS = {
    Length: { m: 1, km: 1000, cm: .01, mm: .001, mi: 1609.344, yd: .9144, ft: .3048, "in": .0254, nmi: 1852 },
    Weight: { kg: 1, g: .001, mg: 1e-6, t: 1000, lb: .45359237, oz: .028349523125, st: 6.35029318 },
    Area: { "m²": 1, "km²": 1e6, "ft²": .09290304, "yd²": .83612736, acre: 4046.8564224, ha: 1e4, "mi²": 2589988.110336 },
    Volume: { L: 1, mL: .001, "m³": 1000, "US gal": 3.785411784, "UK gal": 4.54609, "US cup": .2365882365, "fl oz (US)": .0295735296 },
    Speed: { "km/h": 1, "m/s": 3.6, mph: 1.609344, knot: 1.852 },
    Data: { B: 1, KB: 1e3, MB: 1e6, GB: 1e9, TB: 1e12, KiB: 1024, MiB: 1048576, GiB: 1073741824 },
    Time: { s: 1, min: 60, h: 3600, day: 86400, week: 604800, year: 31557600 },
    Temperature: { "°C": "c", "°F": "f", K: "k" }
  };
  function tempConv(x, f, t) { var c = f === "°C" ? x : f === "°F" ? (x - 32) * 5 / 9 : x - 273.15; return t === "°C" ? c : t === "°F" ? c * 9 / 5 + 32 : c + 273.15; }

  var CUSTOM = {
    "unit-converter": function (root) {
      var cats = Object.keys(UNITS);
      root.innerHTML = '<div class="pill-row" id="uc-cats">' + cats.map(function (c, i) { return '<button class="pill' + (i ? "" : " active") + '" data-c="' + c + '">' + c + "</button>"; }).join("") + '</div><div class="calc-inputs" style="margin-top:16px"><div class="field"><label for="uc-v">Value</label><input id="uc-v" type="number" step="any" value="1"></div><div class="field"><label for="uc-f">From</label><select id="uc-f"></select></div><div class="field"><label for="uc-t">To</label><select id="uc-t"></select></div></div><div class="result-box"><div class="result-label" id="uc-l"></div><div class="result-primary" id="uc-r"></div><table class="result-table" id="uc-all"></table></div>';
      var cat = cats[0];
      function fill() { var u = Object.keys(UNITS[cat]); ["uc-f", "uc-t"].forEach(function (id, i) { $("#" + id).innerHTML = u.map(function (x) { return "<option>" + x + "</option>"; }).join(""); $("#" + id).selectedIndex = Math.min(i, u.length - 1); }); calc(); }
      function conv(x, f, t) { return cat === "Temperature" ? tempConv(x, f, t) : x * UNITS[cat][f] / UNITS[cat][t]; }
      function calc() { var x = parseFloat($("#uc-v").value) || 0, f = $("#uc-f").value, t = $("#uc-t").value; $("#uc-l").textContent = x + " " + f + " ="; $("#uc-r").textContent = fmt(conv(x, f, t), 8) + " " + t; $("#uc-all").innerHTML = Object.keys(UNITS[cat]).map(function (u) { return "<tr><td>" + u + "</td><td>" + fmt(conv(x, f, u), 8) + "</td></tr>"; }).join(""); }
      $$("#uc-cats .pill").forEach(function (b) { b.addEventListener("click", function () { $$("#uc-cats .pill").forEach(function (x) { x.classList.remove("active"); }); b.classList.add("active"); cat = b.dataset.c; fill(); }); });
      ["uc-v", "uc-f", "uc-t"].forEach(function (id) { $("#" + id).addEventListener("input", calc); });
      fill();
    },
    "scientific-calculator": function (root) {
      var keys = ["sin", "cos", "tan", "(", ")", "asin", "acos", "atan", "^", "√", "ln", "log", "π", "e", "!", "7", "8", "9", "÷", "C", "4", "5", "6", "×", "⌫", "1", "2", "3", "−", "%", "0", ".", "Ans", "+", "="];
      root.innerHTML = '<div class="sci"><div class="pill-row" style="margin-bottom:10px"><button class="pill active" id="sc-deg">DEG</button><button class="pill" id="sc-rad">RAD</button></div><div class="sci-display" aria-live="polite"><small id="sc-h"></small><input id="sc-in" aria-label="Expression" style="border:0;background:transparent;text-align:right;font:inherit;padding:0" value=""></div><div class="sci-keys">' + keys.map(function (k) { return '<button class="' + (k === "=" ? "eq" : /[÷×−+^%!()]/.test(k) ? "op" : "") + '" data-k="' + k + '">' + k + "</button>"; }).join("") + "</div></div>";
      var inp = $("#sc-in"), hist = $("#sc-h"), deg = true, ans = 0;
      $("#sc-deg").onclick = function () { deg = true; this.classList.add("active"); $("#sc-rad").classList.remove("active"); };
      $("#sc-rad").onclick = function () { deg = false; this.classList.add("active"); $("#sc-deg").classList.remove("active"); };
      function eq() { try { var r = MathEval.evaluate(inp.value, { deg: deg, ans: ans }); hist.textContent = inp.value + " ="; ans = r; inp.value = String(+r.toPrecision(12)); } catch (e) { hist.textContent = e.message; } }
      $$(".sci-keys button", root).forEach(function (b) {
        b.addEventListener("click", function () {
          var k = b.dataset.k;
          if (k === "=") eq(); else if (k === "C") { inp.value = ""; hist.textContent = ""; } else if (k === "⌫") inp.value = inp.value.slice(0, -1);
          else if (/^(sin|cos|tan|asin|acos|atan|ln|log|√)$/.test(k)) inp.value += k + "("; else if (k === "Ans") inp.value += "ans"; else inp.value += k;
          inp.focus();
        });
      });
      inp.addEventListener("keydown", function (e) { if (e.key === "Enter") eq(); });
    }
  };

  /* ================= RENDERER ================= */
  var LEADS = {
    mortgage: ["Ready to lock in a better rate?", "Get matched with vetted mortgage specialists — free, no obligation.", "mortgage"],
    loan: ["Want a lower rate on this loan?", "Compare personal and business loan offers in 2 minutes.", "loan"],
    advisor: ["Turn this projection into a plan.", "Get matched with a financial advisor who fits your goals.", "advisor"],
    tutor: ["Stuck on math homework or exam prep?", "Get matched with a vetted 1-on-1 math tutor.", "tutor"],
    business: ["Want this calculator on your own website?", "We build branded calculators & widgets that capture leads for you.", "widget"]
  };
  function render() {
    var slug = document.body.getAttribute("data-tool"), root = document.getElementById("calc-root"); if (!slug || !root) return;
    if (CUSTOM[slug]) { CUSTOM[slug](root); return; }
    var t = TOOLS[slug]; if (!t) return;
    var q = new URLSearchParams(location.search);
    root.innerHTML = '<form class="calc-inputs" id="calc-form" onsubmit="return false">' + t.inputs.map(function (i) {
      var val = q.has(i.id) ? q.get(i.id) : i.value, h = '<div class="field"><label for="f-' + i.id + '">' + i.label + "</label>";
      if (i.type === "select") h += '<select id="f-' + i.id + '" name="' + i.id + '">' + i.options.map(function (o) { return '<option value="' + o[0] + '"' + (String(o[0]) === String(val) ? " selected" : "") + ">" + o[1] + "</option>"; }).join("") + "</select>";
      else h += '<input id="f-' + i.id + '" name="' + i.id + '" type="' + i.type + '"' + (i.type === "number" ? ' inputmode="decimal" step="' + i.step + '"' + (i.min !== undefined ? ' min="' + i.min + '"' : "") : "") + ' value="' + String(val).replace(/"/g, "&quot;") + '"' + (i.placeholder ? ' placeholder="' + i.placeholder + '"' : "") + ">";
      return h + "</div>";
    }).join("") + '</form><div class="result-actions">' + (t.button ? '<button class="btn btn-primary" id="calc-go">' + t.button + "</button>" : "") + '<button class="btn btn-ghost btn-sm" id="calc-link">🔗 Copy link to result</button><button class="btn btn-ghost btn-sm" id="calc-reset">Reset</button><button class="btn btn-ghost btn-sm" onclick="window.print()">Print</button></div><div class="result-box" id="result" aria-live="polite"></div>' + (t.lead ? '<div class="lead-inline"><div><h3>' + LEADS[t.lead][0] + "</h3><p>" + LEADS[t.lead][1] + '</p></div><a class="btn" href="' + (document.body.getAttribute("data-base") || "") + "get-matched.html?need=" + LEADS[t.lead][2] + '">Get matched free →</a></div>' : "");
    function values() { var v = {}; t.inputs.forEach(function (i) { var el = document.getElementById("f-" + i.id); v[i.id] = i.type === "number" ? (parseFloat(el.value) || 0) : (i.type === "select" && /^-?[\d.]+$/.test(el.value) && !/^(mode|dir|per|unit|sex|op|biz|inc|uniq|set|kind|from|clim|cf)$/.test(i.id) ? parseFloat(el.value) : el.value); });
      ["years", "cf", "act", "kind"].forEach(function (k) { if (k in v && typeof v[k] === "string" && /^[\d.]+$/.test(v[k])) v[k] = parseFloat(v[k]); }); return v; }
    function out() {
      var r; try { r = t.calc(values()); } catch (e) { r = { label: "Check your inputs", main: "—", rows: [] }; }
      var total = (r.bars || []).reduce(function (a, b) { return a + Math.max(0, b.v); }, 0);
      document.getElementById("result").innerHTML = '<div class="result-label">' + r.label + '</div><div class="result-primary">' + r.main + "</div>" +
        (r.copy ? '<button class="btn btn-sm btn-ghost" onclick="copyText(this.dataset.v)" data-v="' + r.copy.replace(/"/g, "&quot;") + '">Copy</button>' : "") +
        (r.bars && total ? '<div class="bar-chart">' + r.bars.map(function (b) { return '<span style="width:' + (Math.max(0, b.v) / total * 100) + "%;background:" + b.c + '"></span>'; }).join("") + '</div><div class="legend">' + r.bars.map(function (b) { return "<span><i style='background:" + b.c + "'></i>" + b.l + " " + fmt(Math.max(0, b.v) / total * 100, 1) + "%</span>"; }).join("") + "</div>" : "") +
        (r.rows && r.rows.length ? '<table class="result-table">' + r.rows.map(function (x) { return "<tr><td>" + x[0] + "</td><td>" + x[1] + "</td></tr>"; }).join("") + "</table>" : "") +
        (r.note ? '<p class="small muted" style="margin:12px 0 0">' + r.note + "</p>" : "");
    }
    if (!t.button) document.getElementById("calc-form").addEventListener("input", out); else document.getElementById("calc-go").addEventListener("click", out);
    document.getElementById("calc-link").addEventListener("click", function () { var p = new URLSearchParams(); t.inputs.forEach(function (i) { p.set(i.id, document.getElementById("f-" + i.id).value); }); copyText(location.origin + location.pathname + "?" + p.toString()); });
    document.getElementById("calc-reset").addEventListener("click", function () { t.inputs.forEach(function (i) { document.getElementById("f-" + i.id).value = i.value; }); out(); });
    out();
  }
  window.TOOLS = TOOLS;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render); else render();
})();
