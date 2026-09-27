/* 55993.com — Daily Target puzzle + monthly contest countdown */
(function () {
  "use strict";
  function rng(seed) { return function () { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }; }
  var d = new Date(), key = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  var R = rng(d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate() + 55993);
  function pick(a) { return a[Math.floor(R() * a.length)]; }
  var nums = [pick([25, 50, 75, 100]), pick([25, 50, 75, 100])];
  while (nums.length < 6) nums.push(1 + Math.floor(R() * 10));
  // build a guaranteed-solvable target from a random subset
  var target, sol;
  for (var tries = 0; tries < 500; tries++) {
    var pool = nums.slice().sort(function () { return R() - .5; }), k = 3 + Math.floor(R() * 3), v = pool[0], ex = String(pool[0]);
    for (var i = 1; i < k; i++) {
      var n = pool[i], op = pick(["+", "*", "-", "+", "*"]);
      if (op === "-" && v - n <= 0) op = "+";
      v = op === "+" ? v + n : op === "*" ? v * n : v - n; ex = "(" + ex + " " + op + " " + n + ")";
    }
    if (v >= 101 && v <= 999) { target = v; sol = ex.replace(/^\((.*)\)$/, "$1"); break; }
  }
  if (!target) { target = nums[0] + nums[1] + nums[2]; sol = nums[0] + " + " + nums[1] + " + " + nums[2]; }

  var tEl = document.getElementById("g-target"); if (!tEl) return;
  tEl.textContent = target;
  document.getElementById("g-tiles").innerHTML = nums.map(function (x) { return "<span>" + x + "</span>"; }).join("");
  var inp = document.getElementById("g-in"), msg = document.getElementById("g-msg");
  var st = window.Store.get("game", { streak: 0, last: "", best: {} });
  function show() { document.getElementById("g-streak").textContent = st.streak; }
  show();
  function check() {
    var s = inp.value.replace(/×/g, "*").replace(/÷/g, "/");
    if (!/^[\d\s+\-*/()]+$/.test(s)) { msg.innerHTML = "Use only the given numbers and + − × ÷ ( )."; return; }
    var used = (s.match(/\d+/g) || []).map(Number), avail = nums.slice();
    for (var i = 0; i < used.length; i++) { var j = avail.indexOf(used[i]); if (j < 0) { msg.innerHTML = "<b>" + used[i] + "</b> isn't available (each tile can be used once)."; return; } avail.splice(j, 1); }
    var v; try { v = window.MathEval.evaluate(s); } catch (e) { msg.textContent = "That expression doesn't parse — check brackets."; return; }
    if (!isFinite(v)) { msg.textContent = "Division by zero isn't allowed."; return; }
    var off = Math.abs(target - v);
    if (off === 0) {
      if (st.last !== key) { var y = new Date(Date.now() - 864e5); st.streak = st.last === y.getFullYear() + "-" + (y.getMonth() + 1) + "-" + y.getDate() ? st.streak + 1 : 1; st.last = key; window.Store.set("game", st); }
      show(); msg.innerHTML = "🎯 <b>Exact!</b> " + s + " = " + target + ". Come back tomorrow to keep your streak.";
    } else msg.innerHTML = "= <b>" + (+v.toFixed(4)) + "</b> — " + off.toFixed(off % 1 ? 2 : 0) + " away. " + (off <= 5 ? "So close!" : off <= 10 ? "Nice — keep going." : "Try another combination.");
  }
  document.getElementById("g-go").addEventListener("click", check);
  inp.addEventListener("keydown", function (e) { if (e.key === "Enter") check(); });
  document.getElementById("g-reveal").addEventListener("click", function () { msg.innerHTML = "One solution: <b class='num'>" + sol + " = " + target + "</b>"; });
  document.getElementById("g-share").addEventListener("click", function () { window.copyText("I played today's 55993 Daily Target (" + target + ") — streak " + st.streak + " 🔥 " + location.href); });
})();

/* Countdown to end of month (contest deadline) */
(function () {
  var el = document.getElementById("countdown"); if (!el) return;
  function tick() {
    var now = new Date(), end = new Date(now.getFullYear(), now.getMonth() + 1, 1) - 1, s = Math.max(0, Math.floor((end - now) / 1000));
    var p = [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), s % 60];
    el.innerHTML = ["Days", "Hours", "Min", "Sec"].map(function (l, i) { return "<div>" + String(p[i]).padStart(2, "0") + "<span>" + l + "</span></div>"; }).join("");
  }
  tick(); setInterval(tick, 1000);
  var m = document.getElementById("contest-month"); if (m) m.textContent = new Date().toLocaleDateString(undefined, { month: "long", year: "numeric" });
})();
