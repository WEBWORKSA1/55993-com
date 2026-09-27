/* 55993.com — core runtime: theme, nav, ads, forms, search, instant calc, cookies */
(function () {
  "use strict";
  var C = window.SITE_CONFIG || {};
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem("n55993_" + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem("n55993_" + k, JSON.stringify(v)); } catch (e) {} }
  };
  window.Store = store;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  window.$ = $; window.$$ = $$;

  /* ---------- Toast ---------- */
  var toastEl;
  window.toast = function (msg) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add("show");
    clearTimeout(toastEl._t); toastEl._t = setTimeout(function () { toastEl.classList.remove("show"); }, 2200);
  };
  window.copyText = function (t) {
    if (navigator.clipboard) navigator.clipboard.writeText(t).then(function () { toast("Copied to clipboard"); }, function () { toast("Copy failed"); });
  };

  /* ---------- Theme ---------- */
  var root = document.documentElement;
  var saved = store.get("theme", null);
  if (saved) root.setAttribute("data-theme", saved);
  function isDark() { var t = root.getAttribute("data-theme"); return t ? t === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches; }
  $$("[data-theme-toggle]").forEach(function (b) {
    b.textContent = isDark() ? "☀" : "☾";
    b.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark"; root.setAttribute("data-theme", next); store.set("theme", next);
      b.textContent = next === "dark" ? "☀" : "☾";
    });
  });

  /* ---------- Mobile menu ---------- */
  var mt = $(".menu-toggle"), nl = $(".nav-links");
  if (mt && nl) mt.addEventListener("click", function () { var o = nl.classList.toggle("open"); mt.setAttribute("aria-expanded", o); });

  /* ---------- Safe math expression evaluator (no eval) ---------- */
  var MathEval = (function () {
    var FN = {
      sin: Math.sin, cos: Math.cos, tan: Math.tan, asin: Math.asin, acos: Math.acos, atan: Math.atan,
      sqrt: Math.sqrt, cbrt: Math.cbrt, abs: Math.abs, exp: Math.exp, ln: Math.log, log: Math.log10, log2: Math.log2,
      floor: Math.floor, ceil: Math.ceil, round: Math.round
    };
    function fact(n) { if (n < 0 || n !== Math.floor(n)) return NaN; if (n > 170) return Infinity; var r = 1; for (var i = 2; i <= n; i++) r *= i; return r; }
    function tokenize(s) {
      s = s.replace(/%\s*of\b/gi, "%*").replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-").replace(/π/g, "pi").replace(/√/g, "sqrt").replace(/,/g, "");
      var out = [], i = 0, m;
      while (i < s.length) {
        var c = s[i];
        if (/\s/.test(c)) { i++; continue; }
        if ((m = /^(\d+\.?\d*(e[+-]?\d+)?|\.\d+)/i.exec(s.slice(i)))) { out.push({ t: "n", v: parseFloat(m[0]) }); i += m[0].length; continue; }
        if ((m = /^[a-z][a-z0-9]*/i.exec(s.slice(i)))) { out.push({ t: "id", v: m[0].toLowerCase() }); i += m[0].length; continue; }
        if ("+-*/^()%!".indexOf(c) >= 0) { out.push({ t: c }); i++; continue; }
        throw new Error("Unexpected '" + c + "'");
      }
      return out;
    }
    function evaluate(str, opts) {
      opts = opts || {}; var deg = !!opts.deg;
      var tk = tokenize(String(str)), p = 0;
      function peek() { return tk[p]; } function next() { return tk[p++]; }
      function expect(t) { var x = next(); if (!x || x.t !== t) throw new Error("Expected " + t); }
      function expr() { var v = term(); while (peek() && (peek().t === "+" || peek().t === "-")) { var o = next().t; var r = term(); v = o === "+" ? v + r : v - r; } return v; }
      function term() {
        var v = unary();
        while (peek() && (peek().t === "*" || peek().t === "/" || peek().t === "(" || peek().t === "id" || peek().t === "n")) {
          var t = peek().t;
          if (t === "*" || t === "/") { next(); var r = unary(); v = t === "*" ? v * r : v / r; }
          else { v = v * unary(); } // implicit multiplication: 2pi, 3(4)
        }
        return v;
      }
      function unary() { if (peek() && peek().t === "-") { next(); return -unary(); } if (peek() && peek().t === "+") { next(); return unary(); } return power(); }
      function power() { var b = postfix(); if (peek() && peek().t === "^") { next(); return Math.pow(b, unary()); } return b; }
      function postfix() {
        var v = primary();
        while (peek() && (peek().t === "!" || peek().t === "%")) { var t = next().t; v = t === "!" ? fact(v) : v / 100; }
        return v;
      }
      function primary() {
        var x = next(); if (!x) throw new Error("Incomplete expression");
        if (x.t === "n") return x.v;
        if (x.t === "(") { var v = expr(); expect(")"); return v; }
        if (x.t === "id") {
          if (x.v === "pi") return Math.PI; if (x.v === "e") return Math.E; if (x.v === "phi") return (1 + Math.sqrt(5)) / 2;
          if (x.v === "ans") return opts.ans || 0;
          var f = FN[x.v]; if (!f) throw new Error("Unknown '" + x.v + "'");
          var a;
          if (peek() && peek().t === "(") { next(); a = expr(); expect(")"); } else { a = unary(); }
          if (deg && /^(sin|cos|tan)$/.test(x.v)) a = a * Math.PI / 180;
          var r = f(a);
          if (deg && /^(asin|acos|atan)$/.test(x.v)) r = r * 180 / Math.PI;
          return r;
        }
        throw new Error("Unexpected token");
      }
      var val = expr(); if (p < tk.length) throw new Error("Unexpected input");
      return val;
    }
    return { evaluate: evaluate };
  })();
  window.MathEval = MathEval;

  window.fmt = function (n, d) {
    if (typeof n !== "number" || !isFinite(n)) return String(n);
    d = d === undefined ? 2 : d;
    if (Math.abs(n) >= 1e15 || (Math.abs(n) < 1e-6 && n !== 0)) return n.toExponential(6);
    return n.toLocaleString(undefined, { maximumFractionDigits: d, minimumFractionDigits: 0 });
  };
  window.money = function (n) { return isFinite(n) ? n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 }) : "—"; };

  /* ---------- Instant calc (hero) ---------- */
  var ic = $("#instant-input"), ir = $("#instant-result");
  if (ic && ir) {
    var run = function () {
      var v = ic.value.trim(); if (!v) { ir.textContent = ""; showSearch(""); return; }
      try { var r = MathEval.evaluate(v); ir.textContent = "= " + fmt(r, 10); showSearch(""); }
      catch (e) { ir.textContent = ""; showSearch(v); }
    };
    ic.addEventListener("input", run);
    ic.addEventListener("keydown", function (e) { if (e.key === "Enter") { var a = $("#search-results a"); if (a && !ir.textContent) location.href = a.href; } });
  }
  function showSearch(q) {
    var box = $("#search-results"); if (!box || !window.TOOL_INDEX) return;
    q = q.toLowerCase().trim(); if (q.length < 2) { box.style.display = "none"; return; }
    var words = q.split(/\s+/);
    var hits = window.TOOL_INDEX.filter(function (t) { var h = (t.n + " " + t.c + " " + t.k).toLowerCase(); return words.every(function (w) { return h.indexOf(w) >= 0; }); }).slice(0, 7);
    var base = document.body.getAttribute("data-base") || "";
    box.innerHTML = hits.length ? hits.map(function (t) { return '<a href="' + base + "tools/" + t.s + '.html"><b>' + t.n + '</b> <span class="muted small">— ' + t.c + "</span></a>"; }).join("") : '<a href="' + base + 'tools/index.html">No match — browse all tools →</a>';
    box.style.display = "block";
  }
  window.showSearch = showSearch;
  var ts = $("#tool-search");
  if (ts) ts.addEventListener("input", function () { showSearch(ts.value); });

  /* ---------- Contact routing (address is never rendered) ---------- */
  function endpoint() { return "https://formsubmit.co/ajax/" + (C.formAlias || C._route); }
  $$("[data-mail]").forEach(function (a) {
    a.setAttribute("href", "#contact");
    a.addEventListener("click", function (e) {
      e.preventDefault();
      location.href = "mailto:" + C._route + "?subject=" + encodeURIComponent(a.getAttribute("data-mail") || "Inquiry via 55993.com");
    });
  });

  /* ---------- Forms (all submissions route to the hidden address) ---------- */
  $$("form[data-form]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (f.querySelector(".hp input") && f.querySelector(".hp input").value) return; // bot trap
      if (!f.checkValidity()) { f.reportValidity(); return; }
      var data = {}; new FormData(f).forEach(function (v, k) { if (k !== "_gotcha") data[k] = v; });
      var kind = f.getAttribute("data-form");
      data._subject = "[55993.com] " + kind + (data.name ? " — " + data.name : "");
      data._template = "table"; data._captcha = "false";
      data.page = location.pathname; data.submitted = new Date().toISOString();
      var st = f.querySelector(".form-status"), btn = f.querySelector("[type=submit]");
      if (btn) { btn.disabled = true; btn._t = btn.textContent; btn.textContent = "Sending…"; }
      fetch(endpoint(), { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
        .then(function () {
          if (st) { st.className = "form-status ok"; st.textContent = f.getAttribute("data-success") || "Thank you! Your message has been received — we'll reply within 1–2 business days."; }
          f.reset(); if (window.gtag) gtag("event", "generate_lead", { form: kind });
          f.dispatchEvent(new CustomEvent("sent"));
        })
        .catch(function () {
          if (st) {
            st.className = "form-status err";
            st.innerHTML = "We couldn't send that automatically. <a href='#' class='mail-fallback'>Click here to send it by email instead</a>.";
            var mf = st.querySelector(".mail-fallback");
            mf.addEventListener("click", function (ev) {
              ev.preventDefault();
              var body = Object.keys(data).filter(function (k) { return k[0] !== "_"; }).map(function (k) { return k + ": " + data[k]; }).join("\n");
              location.href = "mailto:" + C._route + "?subject=" + encodeURIComponent(data._subject) + "&body=" + encodeURIComponent(body);
            });
          }
        })
        .then(function () { if (btn) { btn.disabled = false; btn.textContent = btn._t; } });
    });
  });

  /* ---------- Ads: AdSense when configured, otherwise house ads ---------- */
  var base = document.body.getAttribute("data-base") || "";
  var slots = $$(".ad-slot");
  if (C.adsenseClient && store.get("consent", null) !== "essential") {
    var s = document.createElement("script"); s.async = true; s.crossOrigin = "anonymous";
    s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + C.adsenseClient;
    document.head.appendChild(s);
    slots.forEach(function (el) {
      var slotId = (C.adsenseSlots || {})[el.getAttribute("data-slot")] || "";
      el.innerHTML = '<span class="ad-label">Advertisement</span><ins class="adsbygoogle" style="display:block" data-ad-client="' + C.adsenseClient + '"' + (slotId ? ' data-ad-slot="' + slotId + '"' : "") + ' data-ad-format="auto" data-full-width-responsive="true"></ins>';
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
    });
  } else {
    var pitches = [
      ["Your brand here.", "Reach people who are actively calculating money, health & life decisions."],
      ["Sponsor a calculator.", "Put your logo on the tools people use every day."],
      ["Sponsor the Monthly Number Challenge.", "Your prize, your brand, thousands of solvers."]
    ];
    slots.forEach(function (el, i) {
      var p = pitches[i % pitches.length];
      el.innerHTML = '<span class="ad-label">Sponsored</span><div class="ad-house"><span><b>' + p[0] + "</b> " + p[1] + '</span><a class="btn btn-sm btn-primary" href="' + base + 'advertise.html">Advertise here</a></div>';
    });
  }

  /* ---------- Analytics (optional) ---------- */
  if (C.gaId && store.get("consent", null) === "all") {
    var g = document.createElement("script"); g.async = true; g.src = "https://www.googletagmanager.com/gtag/js?id=" + C.gaId; document.head.appendChild(g);
    window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); }; gtag("js", new Date()); gtag("config", C.gaId);
  }

  /* ---------- Cookie consent ---------- */
  var ck = $("#cookie");
  if (ck && !store.get("consent", null)) {
    ck.classList.add("show");
    $$("[data-consent]", ck).forEach(function (b) {
      b.addEventListener("click", function () { store.set("consent", b.getAttribute("data-consent")); ck.classList.remove("show"); });
    });
  }

  /* ---------- Share ---------- */
  $$("[data-share]").forEach(function (b) {
    b.addEventListener("click", function () {
      var d = { title: document.title, url: location.href };
      if (navigator.share) navigator.share(d).catch(function () {}); else copyText(location.href);
    });
  });

  /* ---------- Donation buttons ---------- */
  $$("[data-donate]").forEach(function (b) {
    b.addEventListener("click", function (e) {
      var d = C.donate || {}; var url = d.stripeLink || d.buyMeACoffee || d.kofi || d.paypalMe || d.githubSponsors;
      if (url) { e.preventDefault(); window.open(url, "_blank", "noopener"); return; }
      var amt = b.getAttribute("data-donate"); var f = $("#pledge-form");
      if (f) { e.preventDefault(); var a = f.querySelector("[name=amount]"); if (a) a.value = amt; f.scrollIntoView({ behavior: "smooth", block: "start" }); var n = f.querySelector("[name=name]"); if (n) setTimeout(function () { n.focus(); }, 500); }
    });
  });
  $$("[data-donate-link]").forEach(function (a) {
    var key = a.getAttribute("data-donate-link"); var url = (C.donate || {})[key];
    if (url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; } else { a.style.display = "none"; }
  });

  /* ---------- YouTube lite embeds ---------- */
  window.renderVideos = function (el, list, playlists) {
    if (!el) return;
    var html = (list || []).map(function (v) {
      return '<figure style="margin:0"><button class="yt" data-yt="' + v.id + '" style="background-image:url(https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg)" aria-label="Play: ' + v.title + '"><span class="play"></span></button><figcaption style="margin-top:8px"><b>' + v.title + '</b><br><span class="muted small">' + v.by + (v.cat ? " · " + v.cat : "") + "</span></figcaption></figure>";
    }).join("");
    html += (playlists || []).map(function (v) {
      return '<figure style="margin:0"><button class="yt playlist" data-ytlist="' + v.id + '" aria-label="Play playlist: ' + v.title + '"><span class="play"></span><span class="yt-label">▶ Playlist</span></button><figcaption style="margin-top:8px"><b>' + v.title + '</b><br><span class="muted small">' + v.by + "</span></figcaption></figure>";
    }).join("");
    el.innerHTML = html;
    $$(".yt", el).forEach(function (b) {
      b.addEventListener("click", function () {
        var src = b.dataset.yt ? "https://www.youtube-nocookie.com/embed/" + b.dataset.yt + "?autoplay=1&rel=0" : "https://www.youtube-nocookie.com/embed/videoseries?list=" + b.dataset.ytlist + "&autoplay=1";
        b.innerHTML = '<iframe src="' + src + '" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
        b.style.cursor = "default";
      }, { once: true });
    });
  };
  $$("[data-videos]").forEach(function (el) {
    var n = parseInt(el.getAttribute("data-videos"), 10) || 99;
    renderVideos(el, (C.videos || []).slice(0, n), n > 10 ? C.playlists : []);
  });
  $$("[data-yt-channel]").forEach(function (a) { if (C.youtubeChannel) { a.href = C.youtubeChannel; a.target = "_blank"; a.rel = "noopener"; } else a.style.display = "none"; });

  /* ---------- Recently used tools ---------- */
  var slug = document.body.getAttribute("data-tool");
  if (slug) { var rec = store.get("recent", []).filter(function (x) { return x !== slug; }); rec.unshift(slug); store.set("recent", rec.slice(0, 8)); }
  var recEl = $("#recent-tools");
  if (recEl && window.TOOL_INDEX) {
    var rs = store.get("recent", []).map(function (s) { return window.TOOL_INDEX.filter(function (t) { return t.s === s; })[0]; }).filter(Boolean);
    if (rs.length) { recEl.parentElement.style.display = ""; recEl.innerHTML = rs.map(function (t) { return '<a class="pill" href="' + base + "tools/" + t.s + '.html">' + t.n + "</a>"; }).join(""); }
  }

  /* ---------- Year ---------- */
  $$("[data-year]").forEach(function (e) { e.textContent = new Date().getFullYear(); });
})();
