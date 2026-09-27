/* 55993.com — Number Explorer: every property of any whole number */
(function () {
  "use strict";
  var ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  var TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  var SCALE = ["", "thousand", "million", "billion", "trillion", "quadrillion"];
  function words(n) {
    if (n === 0) return "zero";
    function h(x) { var s = []; if (x >= 100) { s.push(ONES[Math.floor(x / 100)] + " hundred"); x %= 100; } if (x >= 20) { s.push(TENS[Math.floor(x / 10)] + (x % 10 ? "-" + ONES[x % 10] : "")); } else if (x) s.push(ONES[x]); return s.join(" "); }
    var parts = [], i = 0; while (n > 0) { var c = n % 1000; if (c) parts.unshift(h(c) + (SCALE[i] ? " " + SCALE[i] : "")); n = Math.floor(n / 1000); i++; }
    return parts.join(" ");
  }
  function roman(n) { if (n < 1 || n > 3999) return "— (1–3999 only)"; var m = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]], r = ""; m.forEach(function (p) { while (n >= p[0]) { r += p[1]; n -= p[0]; } }); return r; }
  function isSq(n) { var r = Math.round(Math.sqrt(n)); return r * r === n; }
  function isFib(n) { return isSq(5 * n * n + 4) || isSq(5 * n * n - 4); }
  function divisors(n) { var d = [], big = []; for (var i = 1; i * i <= n; i++) if (n % i === 0) { d.push(i); if (i * i !== n) big.unshift(n / i); } return d.concat(big); }
  function collatz(n) { var s = 0; while (n !== 1 && s < 10000) { n = n % 2 ? 3 * n + 1 : n / 2; s++; } return s; }
  var CULTURE = {
    "0": "Completeness & potential; in Chinese, 零 (líng).",
    "1": "Unity and beginnings; often read as 'first' or 'leader'.",
    "2": "Pairs and harmony — 'good things come in pairs' in Chinese tradition.",
    "3": "In Cantonese, 3 sounds like 生 (sāng/shēng) — 'life' or 'birth'.",
    "4": "Avoided in parts of East Asia: 四 (sì) sounds like 死 ('death').",
    "5": "五 (wǔ) sounds like 無 (wú, 'none') or 吾 ('me'); five elements (wǔxíng).",
    "6": "六 (liù) evokes 流 ('flow'/'smooth') — '66' means everything goes smoothly.",
    "7": "Considered lucky in Western cultures; seven days, seven notes.",
    "8": "八 (bā) sounds like 發 (fā, 'prosper') — the luckiest digit in Chinese culture.",
    "9": "九 (jiǔ) sounds like 久 ('long-lasting'); associated with longevity."
  };
  function run(n) {
    var out = document.getElementById("ex-out"); if (!out) return;
    if (!Number.isSafeInteger(n) || n < 1) { out.innerHTML = '<p class="muted">Enter a whole number from 1 to 9,007,199,254,740,991.</p>'; return; }
    var s = String(n), f = window.factorize(n), prime = f.length === 1, cnt = {}; f.forEach(function (p) { cnt[p] = (cnt[p] || 0) + 1; });
    var fact = Object.keys(cnt).map(function (p) { return cnt[p] > 1 ? p + "<sup>" + cnt[p] + "</sup>" : p; }).join(" × ");
    var small = n <= 1e12, dv = small ? divisors(n) : null, sd = dv ? dv.reduce(function (a, b) { return a + b; }, 0) - n : null;
    var ds = s.split("").reduce(function (a, b) { return a + +b; }, 0), dr = 1 + (n - 1) % 9;
    var arm = s.split("").reduce(function (a, b) { return a + Math.pow(+b, s.length); }, 0) === n;
    var tri = isSq(8 * n + 1), cube = Math.round(Math.cbrt(n)) ** 3 === n;
    function P(label, val, sub) { return '<div class="prop"><small>' + label + "</small><b>" + val + "</b>" + (sub ? '<small>' + sub + "</small>" : "") + "</div>"; }
    function YN(b) { return b ? '<span class="yes">Yes</span>' : '<span class="no">No</span>'; }
    var digits = s.split("").filter(function (c, i, a) { return a.indexOf(c) === i; });
    out.innerHTML =
      '<h2 class="num" style="font-size:clamp(2rem,6vw,3.2rem)">' + n.toLocaleString() + "</h2><p class='muted' style='text-transform:capitalize'>" + words(n) + "</p>" +
      '<div class="prop-grid">' +
      P("Prime?", YN(prime), prime ? "Only divisible by 1 and itself" : "Composite number") +
      P("Prime factorization", fact || "1") +
      P("Parity", n % 2 ? "Odd" : "Even") +
      P("Number of divisors", dv ? dv.length : "—", dv && dv.length <= 24 ? dv.join(", ") : "") +
      P("Sum of proper divisors", sd === null ? "—" : sd.toLocaleString(), sd === null ? "" : (sd === n ? "Perfect number" : sd > n ? "Abundant number" : "Deficient number")) +
      P("Digit sum / digital root", ds + " / " + dr) +
      P("Palindrome?", YN(s === s.split("").reverse().join(""))) +
      P("Perfect square?", YN(isSq(n)), isSq(n) ? "√ = " + Math.sqrt(n) : "√ ≈ " + Math.sqrt(n).toFixed(6)) +
      P("Perfect cube?", YN(cube), "∛ ≈ " + Math.cbrt(n).toFixed(6)) +
      P("Triangular?", YN(tri)) +
      P("Fibonacci?", YN(n < 1e15 && isFib(n))) +
      P("Harshad (divisible by digit sum)?", YN(n % ds === 0)) +
      P("Armstrong (narcissistic)?", YN(arm)) +
      P("Collatz steps to 1", collatz(n).toLocaleString()) +
      P("Binary", n.toString(2)) + P("Octal", n.toString(8)) + P("Hexadecimal", n.toString(16).toUpperCase()) +
      P("Roman numeral", roman(n)) + P("Scientific notation", n.toExponential(4)) +
      P("Square", n <= 94906265 ? (n * n).toLocaleString() : "≈ " + (n * n).toExponential(6)) +
      P("Reciprocal", (1 / n).toPrecision(8)) + P("Natural log", Math.log(n).toFixed(6)) +
      "</div><h3 style='margin-top:28px'>Cultural digit associations</h3><div class='prop-grid'>" +
      digits.map(function (d) { return P("Digit " + d, "", CULTURE[d]); }).join("") + "</div>" +
      "<p class='small muted' style='margin-top:12px'>Cultural associations are traditional folk meanings shared for interest, not predictions.</p>";
    try { history.replaceState(null, "", "?n=" + n); } catch (e) {}
  }
  var inp = document.getElementById("ex-in");
  if (inp) {
    var q = new URLSearchParams(location.search).get("n"); if (q) inp.value = q.replace(/[^\d]/g, "");
    var go = function () { run(parseInt(String(inp.value).replace(/[^\d]/g, ""), 10)); };
    inp.addEventListener("input", go);
    document.querySelectorAll("[data-try]").forEach(function (b) { b.addEventListener("click", function () { inp.value = b.dataset.try; go(); }); });
    go();
  }
  /* Number of the day (home page) */
  var nd = document.getElementById("notd");
  if (nd) {
    var d = new Date(), seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate(), x = (seed * 2654435761) % 99991 + 2;
    var f = window.factorize(x);
    nd.innerHTML = '<div class="num" style="font-size:3rem;font-weight:700">' + x.toLocaleString() + '</div><p class="muted" style="text-transform:capitalize;margin:0 0 8px">' + words(x) + "</p><p>" + (f.length === 1 ? "A <b>prime number</b>." : "Factors: <b class='num'>" + f.join(" × ") + "</b>.") + " Binary <span class='num'>" + x.toString(2) + "</span>.</p><a class='btn btn-sm btn-ghost' href='numbers.html?n=" + x + "'>Explore all properties →</a>";
  }
})();
