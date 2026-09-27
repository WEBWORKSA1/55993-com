# -*- coding: utf-8 -*-
"""
55993.com static site generator (Python 3 standard library only).
Run from the repo root:  python3 scripts/build.py
Outputs plain HTML at the repo root so GitHub Pages can serve it with no build step.
"""
import json, os, html, datetime, sys
sys.path.insert(0, os.path.dirname(__file__))
from tools_meta import TOOLS, CATEGORIES

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SITE = "https://55993.com"          # canonical domain (update if you use another)
ADSENSE_META = ""                   # e.g. "ca-pub-1234567890123456" → adds <meta name="google-adsense-account">
INTEREST_URL = "https://web.works/contact"
YEAR = datetime.date.today().year
TODAY = datetime.date.today().isoformat()
CAT = {c[0]: c for c in CATEGORIES}
E = html.escape

NAV = [("tools/index.html", "Tools", "tools"), ("numbers.html", "Number Explorer", "numbers"), ("videos.html", "Videos", "videos"),
       ("contests.html", "Challenges & Prizes", "contests"), ("support.html", "Support", "support")]

def head(base, title, desc, path, schema=None):
    canon = SITE + "/" + path.replace("index.html", "")
    s = "\n".join('<script type="application/ld+json">%s</script>' % json.dumps(x, ensure_ascii=False) for x in (schema or []))
    basefix = "\n<script>document.write('<base href=\"'+(location.hostname.indexOf('github.io')>-1?'/55993-com/':'/')+'\">')</script>" if path == "404.html" else ""
    ads = '<meta name="google-adsense-account" content="%s">' % ADSENSE_META if ADSENSE_META else ""
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">{basefix}
<title>{E(title)}</title>
<meta name="description" content="{E(desc)}">
<link rel="canonical" href="{canon}">
<meta property="og:type" content="website"><meta property="og:site_name" content="55993">
<meta property="og:title" content="{E(title)}"><meta property="og:description" content="{E(desc)}">
<meta property="og:url" content="{canon}"><meta property="og:image" content="{SITE}/assets/img/og.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#4f46e5">
{ads}
<link rel="icon" href="{base}assets/img/favicon.svg" type="image/svg+xml">
<link rel="manifest" href="{base}manifest.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{base}assets/css/style.css">
{s}
</head>"""

def header(base, active):
    links = "".join(f'<a href="{base}{h}"{" aria-current=page" if a == active else ""}>{t}</a>' for h, t, a in NAV)
    return f"""<a class="skip" href="#main">Skip to content</a>
<div class="interest-bar" role="note"><a href="{INTEREST_URL}" target="_blank" rel="noopener">Contact, if you are interested in this website / domain name / Sponsorship / Advertisement / Partnership</a></div>
<header class="site-header"><div class="container nav">
<a class="logo" href="{base}index.html" aria-label="55993 home"><span class="logo-mark">55·99·3</span><span>55993<small>Numbers, Solved.</small></span></a>
<button class="icon-btn menu-toggle" aria-label="Menu" aria-expanded="false">☰</button>
<nav class="nav-links" aria-label="Main">{links}<a class="nav-cta" href="{base}get-matched.html">Get Matched Free</a>
<button class="icon-btn" data-theme-toggle aria-label="Toggle dark mode">☾</button></nav>
</div></header>"""

def footer(base):
    return f"""<div class="container"><div class="ad-slot" data-slot="footer"></div>
<div class="newsletter"><div><span class="eyebrow" style="color:#fff;opacity:.8">Free weekly email</span><h2 style="margin:0">The Weekly Number</h2><p style="margin:.4em 0 0;opacity:.9">One fascinating number, one money tip, one puzzle — plus contest alerts and new tools. No spam, unsubscribe anytime.</p></div>
<form data-form="Newsletter signup" data-success="You're in! Watch your inbox for The Weekly Number." novalidate>
<label class="sr-only" for="nl-email">Email</label><input id="nl-email" type="email" name="email" placeholder="you@example.com" required>
<span class="hp"><input name="_gotcha" tabindex="-1" autocomplete="off"></span>
<button class="btn" type="submit">Subscribe</button><div class="form-status" style="flex-basis:100%"></div></form></div></div>
<footer class="site-footer"><div class="container">
<div class="footer-grid">
<div><a class="logo" href="{base}index.html"><span class="logo-mark">55·99·3</span><span>55993</span></a><p class="muted small" style="margin-top:12px">Free calculators, converters and number tools for money, math, health and everyday life. Fast, private and mobile-friendly.</p>
<a class="btn btn-sm btn-ghost" href="{base}support.html">♥ Support 55993</a></div>
<div><h4>Popular</h4><a href="{base}tools/mortgage-calculator.html">Mortgage</a><a href="{base}tools/compound-interest-calculator.html">Compound Interest</a><a href="{base}tools/percentage-calculator.html">Percentage</a><a href="{base}tools/bmi-calculator.html">BMI</a><a href="{base}tools/scientific-calculator.html">Scientific</a></div>
<div><h4>Explore</h4><a href="{base}tools/index.html">All Tools</a><a href="{base}numbers.html">Number Explorer</a><a href="{base}videos.html">Videos</a><a href="{base}contests.html">Challenges & Prizes</a><a href="{base}get-matched.html">Get Matched</a></div>
<div><h4>Company</h4><a href="{base}about.html">About</a><a href="{base}advertise.html">Advertise & Sponsor</a><a href="{base}careers.html">Careers & Talent</a><a href="{base}support.html">Donate</a><a href="{base}contact.html">Contact</a></div>
<div><h4>Legal</h4><a href="{base}privacy.html">Privacy Policy</a><a href="{base}terms.html">Terms of Use</a><a href="{base}legal.html">Trademark & Copyright</a><a href="{base}legal.html#disclaimer">Disclaimer</a><a href="{INTEREST_URL}" target="_blank" rel="noopener">Domain inquiries</a></div>
</div>
<div class="legal-line">© <span data-year>{YEAR}</span> 55993.com. All original content, code and design are protected by copyright. “55993” is used here only as a domain name and site identifier; this website is not affiliated with, endorsed by or connected to any company, product, postal code, model number or trademark that uses the same number. All third-party names, logos and videos belong to their respective owners. Calculators are for informational purposes only and are not financial, medical or legal advice. <a href="{base}legal.html">Full disclosure</a>.</div>
</div></footer>
<div class="cookie" id="cookie" role="dialog" aria-label="Cookie consent"><b>Cookies & ads</b><p class="small muted" style="margin:6px 0 0">We use cookies to remember your preferences and, where enabled, to show ads (including Google AdSense) and measure traffic. See our <a href="{base}privacy.html">Privacy Policy</a>.</p>
<div class="row"><button class="btn btn-sm btn-ghost" data-consent="essential">Essential only</button><button class="btn btn-sm btn-primary" data-consent="all">Accept all</button></div></div>"""

def page(path, title, desc, body, active="", tool=None, js=(), schema=None):
    depth = path.count("/")
    base = "../" * depth
    scripts = "".join(f'<script src="{base}assets/js/{j}" defer></script>' for j in ["config.js", "tools-index.js", "app.js"] + list(js))
    doc = head(base, title, desc, path, schema) + f"""
<body data-base="{base}"{' data-tool="%s"' % tool if tool else ''}>
{header(base, active)}
<main id="main">
{body}
</main>
{footer(base)}
{scripts}
</body>
</html>
"""
    out = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, "w", encoding="utf-8") as f:
        f.write(doc)
    return path

PAGES = []
def add(path, *a, **k):
    PAGES.append(page(path, *a, **k))

def tool_card(t, base):
    c = CAT[t["cat"]]
    hot = ' <span class="badge badge-hot">Popular</span>' if t["hot"] else ""
    return f'<a class="card tool-card" href="{base}tools/{t["slug"]}.html"><span class="ico">{c[2]}</span><h3>{E(t["name"])}{hot}</h3><p>{E(t["desc"])}</p></a>'

def form_fields_contact(extra=""):
    return f"""<div class="grid-2"><div class="field"><label for="n">Full name</label><input id="n" name="name" required autocomplete="name"></div>
<div class="field"><label for="em">Email</label><input id="em" type="email" name="email" required autocomplete="email"></div></div>{extra}
<span class="hp"><input name="_gotcha" tabindex="-1" autocomplete="off"></span>"""

# ---------------------------------------------------------------- tools index JS
def build_index():
    idx = [dict(s=t["slug"], n=t["name"], c=CAT[t["cat"]][1], k=t["kw"] + " " + t["desc"]) for t in TOOLS]
    idx.append(dict(s="../numbers", n="Number Explorer", c="Numbers", k="number facts properties prime factors meaning 55993"))
    with open(os.path.join(ROOT, "assets/js/tools-index.js"), "w", encoding="utf-8") as f:
        f.write("window.TOOL_INDEX=" + json.dumps(idx, ensure_ascii=False) + ";\n")

# ---------------------------------------------------------------- tool pages
def build_tools():
    base = "../"
    for t in TOOLS:
        c = CAT[t["cat"]]
        related = [x for x in TOOLS if x["cat"] == t["cat"] and x["slug"] != t["slug"]][:6]
        faq_html = "".join(f"<details><summary>{E(q)}</summary><p>{E(a)}</p></details>" for q, a in t["faq"])
        schema = [
            {"@context": "https://schema.org", "@type": "WebApplication", "name": t["name"], "url": f"{SITE}/tools/{t['slug']}.html", "applicationCategory": "UtilitiesApplication", "operatingSystem": "Any", "description": t["desc"], "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"}},
            {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in t["faq"]]},
            {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/"},
                {"@type": "ListItem", "position": 2, "name": "Tools", "item": SITE + "/tools/"},
                {"@type": "ListItem", "position": 3, "name": t["name"]}]}]
        explorer_link = f'<p><a href="{base}numbers.html?n=55993">Open 55,993 in the Number Explorer →</a></p>' if t["slug"] == "prime-factorization-calculator" else ""
        body = f"""<div class="container">
<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="{base}index.html">Home</a> › <a href="{base}tools/index.html">Tools</a> › <a href="{base}tools/index.html#{c[0]}">{c[1]}</a> › {E(t['name'])}</nav>
<div class="ad-slot" data-slot="top"></div>
<div class="tool-layout">
<article>
<span class="eyebrow">{c[1]}</span>
<h1 style="font-size:clamp(1.8rem,4vw,2.6rem)">{E(t['name'])}</h1>
<p class="muted" style="font-size:1.1rem">{E(t['desc'])}</p>
<div class="calc-box" id="calc-root"><noscript>This calculator needs JavaScript enabled.</noscript></div>
<div class="result-actions"><button class="btn btn-ghost btn-sm" data-share>Share this tool</button><a class="btn btn-ghost btn-sm" href="{base}advertise.html#widgets">Embed on your site</a></div>
<div class="ad-slot" data-slot="inContent"></div>
<div class="prose">
<h2>How to use the {E(t['name'])}</h2><p>{E(t['intro'])}</p>
<h2>Formula</h2><code class="formula">{E(t['formula'])}</code>
<h2>Worked example</h2><p>{E(t['example'])}</p>{explorer_link}
<h2>Frequently asked questions</h2><div class="faq">{faq_html}</div>
<p class="small muted">Results are estimates for educational and planning purposes. Always confirm important financial, health or legal decisions with a qualified professional. Last reviewed {TODAY}.</p>
</div>
</article>
<aside class="sidebar">
<div class="card"><h3>Related {c[1].split(' ')[0].lower()} tools</h3><div class="side-list">{''.join(f'<a href="{base}tools/{r["slug"]}.html">{E(r["name"])}</a>' for r in related)}</div></div>
<div class="ad-slot" data-slot="sidebar" style="margin:0"></div>
<div class="card"><h3>Get expert help — free</h3><p class="muted small">Mortgage specialists, financial advisors, tutors and custom calculator builds.</p><a class="btn btn-primary btn-block" href="{base}get-matched.html">Get matched in 2 minutes</a></div>
<div class="card"><h3>Daily Target 🎯</h3><p class="muted small">A 60-second number puzzle. Build a streak, enter the monthly prize challenge.</p><a class="btn btn-ghost btn-block" href="{base}contests.html">Play today's puzzle</a></div>
</aside>
</div></div>"""
        add(f"tools/{t['slug']}.html", f"{t['name']} — Free & Instant | 55993", t["desc"], body, active="tools", tool=t["slug"], js=["tools.js"], schema=schema)

    # tools directory
    sections = ""
    for key, name, ico, cdesc in CATEGORIES:
        items = [t for t in TOOLS if t["cat"] == key]
        sections += f'<section id="{key}" style="padding:32px 0"><div class="section-head"><div><h2>{ico} {name} <span class="badge">{len(items)}</span></h2><p class="muted" style="margin:0">{cdesc}</p></div></div><div class="cards">{"".join(tool_card(t, base) for t in items)}</div></section>'
    pills = "".join(f'<a class="pill" href="#{k}">{n}</a>' for k, n, _, _ in CATEGORIES)
    body = f"""<div class="container"><div class="page-hero"><span class="eyebrow">{len(TOOLS)} free tools · more every month</span><h1>All calculators & tools</h1>
<p>Everything runs instantly in your browser — no sign-up, no downloads, nothing stored on our servers.</p>
<div class="instant" style="margin-top:20px"><label class="sr-only" for="tool-search">Search tools</label><input id="tool-search" placeholder="Search: mortgage, bmi, percent, binary…" autocomplete="off"></div><div class="search-results" id="search-results"></div>
<div class="pill-row" style="margin-top:16px">{pills}<a class="pill" href="{base}numbers.html">Number Explorer</a></div>
<div style="display:none;margin-top:18px"><span class="small muted">Recently used:</span><div class="pill-row" id="recent-tools" style="margin-top:6px"></div></div></div>
<div class="ad-slot" data-slot="top"></div>{sections}
<div class="card center" style="margin:24px 0"><h2>Missing a calculator?</h2><p class="muted">Tell us what you need — we build the most-requested tools first.</p><a class="btn btn-primary" href="{base}contact.html?topic=Calculator%20request">Request a calculator</a></div></div>"""
    add("tools/index.html", f"All {len(TOOLS)} Free Online Calculators & Converters | 55993", "Browse free calculators for finance, math, health, dates, unit conversion and random numbers. Instant, private and mobile-friendly.", body, active="tools")

# ---------------------------------------------------------------- home
def build_home():
    base = ""
    hot = [t for t in TOOLS if t["hot"]]
    cats = "".join(f'<a class="card tool-card" href="tools/index.html#{k}"><span class="ico">{i}</span><h3>{n}</h3><p>{d}</p><span class="small muted">{sum(1 for t in TOOLS if t["cat"] == k)} tools →</span></a>' for k, n, i, d in CATEGORIES)
    schema = [{"@context": "https://schema.org", "@type": "WebSite", "name": "55993", "url": SITE + "/", "potentialAction": {"@type": "SearchAction", "target": SITE + "/tools/index.html?q={search_term_string}", "query-input": "required name=search_term_string"}},
              {"@context": "https://schema.org", "@type": "Organization", "name": "55993", "url": SITE + "/", "logo": SITE + "/assets/img/favicon.svg"}]
    body = f"""<section class="hero"><div class="container">
<span class="eyebrow">Free · Instant · Private</span>
<h1>Every number you need,<br><span class="grad">solved in seconds.</span></h1>
<p class="hero-lead">{len(TOOLS)}+ calculators for money, math, health and everyday life — plus a Number Explorer, daily puzzles with prizes, and free expert matching when you need a human.</p>
<div class="instant"><label class="sr-only" for="instant-input">Calculate or search</label><input id="instant-input" placeholder="Type a sum (12% of 850, 2^10, sqrt(144)) or search a tool…" autocomplete="off"><a class="btn btn-primary" href="tools/index.html">All tools</a></div>
<div class="instant-result" id="instant-result" aria-live="polite"></div><div class="search-results" id="search-results"></div>
<div class="pill-row" style="margin-top:14px">{''.join(f'<a class="pill" href="tools/{t["slug"]}.html">{E(t["name"])}</a>' for t in hot[:8])}</div>
<div class="stats"><div class="num">{len(TOOLS)}+<span>free calculators</span></div><div class="num">0<span>sign-ups required</span></div><div class="num">100%<span>runs in your browser</span></div><div class="num">24/7<span>daily puzzle & prizes</span></div></div>
</div></section>
<div class="container"><div class="ad-slot" data-slot="top"></div></div>
<section style="padding-top:24px"><div class="container"><div class="section-head"><div><span class="eyebrow">Most used</span><h2>Popular calculators</h2></div><a class="btn btn-ghost btn-sm" href="tools/index.html">See all {len(TOOLS)} →</a></div>
<div class="cards">{''.join(tool_card(t, base) for t in hot)}</div>
<div style="display:none;margin-top:18px"><span class="small muted">Recently used:</span><div class="pill-row" id="recent-tools" style="margin-top:6px"></div></div></div></section>
<section style="background:var(--bg2);border-block:1px solid var(--line)"><div class="container"><div class="section-head"><div><span class="eyebrow">Browse by topic</span><h2>Six categories, one fast hub</h2></div></div><div class="cards">{cats}</div></div></section>
<section><div class="container two-col">
<div><span class="eyebrow">Get matched · free</span><h2>Numbers are the start. Get the right expert for the next step.</h2>
<p class="muted">Tell us what you're working on and we'll connect you with vetted professionals — mortgage and loan specialists, financial advisors, math tutors, or a developer to build a custom calculator for your business.</p>
<ul class="list-check"><li>Free and no obligation</li><li>Takes about 2 minutes</li><li>Your details go only to matched partners you approve</li></ul>
<a class="btn btn-primary" href="get-matched.html">Start my free match →</a></div>
<div class="card"><h3>Quick request</h3><form data-form="Quick lead (home)" data-success="Thanks! A specialist will reach out within 1 business day.">
{form_fields_contact('<div class="field"><label for="need">I need help with</label><select id="need" name="need" required><option value="">Choose one…</option><option>Mortgage / refinance</option><option>Personal or business loan</option><option>Financial / retirement planning</option><option>Insurance quote</option><option>Math tutoring / exam prep</option><option>Custom calculator or widget for my website</option><option>Advertising / sponsorship on 55993</option></select></div>')}
<label class="check small"><input type="checkbox" name="consent" value="yes" required> I agree to be contacted about my request and accept the <a href="privacy.html">Privacy Policy</a>.</label>
<button class="btn btn-primary btn-block" type="submit" style="margin-top:12px">Get matched free</button><div class="form-status"></div></form></div>
</div></section>
<section style="background:var(--bg2);border-block:1px solid var(--line)"><div class="container two-col">
<div><span class="eyebrow">Number of the day</span><div class="card" id="notd"></div></div>
<div><span class="eyebrow">Daily Target · monthly prizes</span><div class="card"><h3>Can you hit today's target?</h3><p class="muted">Combine six numbers with + − × ÷ to reach a 3-digit target. Build a streak and enter the monthly Number Challenge for prizes.</p><a class="btn btn-primary" href="contests.html">Play now</a> <a class="btn btn-ghost" href="contests.html#challenge">This month's prizes</a></div></div>
</div></section>
<section><div class="container"><div class="section-head"><div><span class="eyebrow">Watch & learn</span><h2>The math behind the numbers</h2></div><a class="btn btn-ghost btn-sm" href="videos.html">All videos →</a></div><div class="video-grid" data-videos="3"></div></div></section>
<section style="padding-top:0"><div class="container"><div class="card" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px">
<div><span class="eyebrow">Support</span><h3>Keep 55993 free for everyone</h3><p class="muted small">Donations fund servers, new tools, contest prizes and creators.</p><a class="btn btn-accent btn-sm" href="support.html">Donate</a></div>
<div><span class="eyebrow">Advertise</span><h3>Reach people making decisions</h3><p class="muted small">Sponsor a calculator, the newsletter or a monthly challenge.</p><a class="btn btn-ghost btn-sm" href="advertise.html">Media kit</a></div>
<div><span class="eyebrow">We're hiring</span><h3>Writers, devs & creators</h3><p class="muted small">Remote, flexible roles — plus an ambassador program.</p><a class="btn btn-ghost btn-sm" href="careers.html">Open roles</a></div>
</div></div></section>"""
    add("index.html", "55993 — Free Online Calculators, Converters & Number Tools", "Free, instant calculators for mortgage, loans, compound interest, percentages, BMI, age, units and more — plus a Number Explorer, daily puzzles with prizes and free expert matching.", body, active="home", js=["tools.js", "explorer.js"], schema=schema)

# ---------------------------------------------------------------- number explorer
def build_numbers():
    tries = "".join(f'<button class="pill" data-try="{n}">{n:,}</button>' for n in [55993, 8128, 1729, 153, 65536, 2026, 999983])
    body = f"""<div class="container"><div class="page-hero"><span class="eyebrow">Number Explorer</span><h1>Discover everything about any number</h1>
<p>Primes, factors, divisors, bases, Roman numerals, number words, special families and cultural meanings — for any whole number up to 9 quadrillion.</p>
<div class="instant"><label class="sr-only" for="ex-in">Number</label><input id="ex-in" inputmode="numeric" value="55993" autocomplete="off"></div>
<div class="pill-row">{tries}</div></div>
<div class="ad-slot" data-slot="top"></div>
<div id="ex-out" aria-live="polite"></div>
<div class="ad-slot" data-slot="inContent"></div>
<div class="prose" style="max-width:820px">
<h2>About the number 55,993</h2>
<p>55,993 is an odd composite number with the prime factorization 7 × 19 × 421, giving it exactly eight divisors. In hexadecimal it is written DAB9 and in binary 1101101010111001. Its digit sum is 31 and its digital root is 4. Read aloud in pairs — “55 · 99 · 3” — it is easy to remember, which is exactly why short numeric names are prized online.</p>
<h2>How the explorer works</h2><p>Primality and factorization use trial division optimized for odd divisors; divisor lists are generated for numbers up to one trillion. Triangular, square and Fibonacci checks use closed-form tests (for example, n is Fibonacci if 5n² ± 4 is a perfect square). Everything is computed locally in your browser.</p>
<h2>Frequently asked questions</h2><div class="faq">
<details><summary>What is a perfect number?</summary><p>A number equal to the sum of its proper divisors, like 6 (1 + 2 + 3) and 8128.</p></details>
<details><summary>Why is 1729 famous?</summary><p>It is the Hardy–Ramanujan number: the smallest number expressible as the sum of two cubes in two different ways (1³ + 12³ and 9³ + 10³).</p></details>
<details><summary>What is a Harshad number?</summary><p>A number divisible by the sum of its digits, such as 18 (1 + 8 = 9, and 18 ÷ 9 = 2).</p></details>
</div></div></div>"""
    add("numbers.html", "Number Explorer — Facts, Factors & Meaning of Any Number | 55993", "Enter any number to see if it's prime, its factors, divisors, binary, hex, Roman numerals, words, special properties and cultural digit meanings.", body, active="numbers", js=["tools.js", "explorer.js"])

# ---------------------------------------------------------------- videos
def build_videos():
    body = """<div class="container"><div class="page-hero"><span class="eyebrow">Watch & learn</span><h1>Videos: the math behind everyday numbers</h1>
<p>Hand-picked explainers on calculus, growth, geometry and more. Videos load only when you press play (privacy-enhanced mode).</p>
<a class="btn btn-primary" data-yt-channel href="#">Subscribe on YouTube</a></div>
<div class="ad-slot" data-slot="top"></div>
<div class="video-grid" data-videos="99"></div>
<div class="ad-slot" data-slot="inContent"></div>
<div class="two-col" style="margin-top:32px"><div class="card"><h2>Creators: get featured</h2><p class="muted">Make videos about math, money or data? Submit your video for our curated library, collaborate on a sponsored explainer, or pitch a series for the 55993 channel.</p>
<form data-form="Creator video submission" data-success="Thanks! Our team reviews submissions weekly.">""" + form_fields_contact('<div class="field"><label for="vu">Video or channel URL</label><input id="vu" type="url" name="video_url" required placeholder="https://youtube.com/..."></div><div class="field"><label for="vm">Tell us about it</label><textarea id="vm" name="message"></textarea></div>') + """
<button class="btn btn-primary" type="submit">Submit video</button><div class="form-status"></div></form></div>
<div class="card"><h2>Sponsor a video</h2><p class="muted">Put your brand inside an evergreen explainer that keeps earning views for years. Integrations, pre-roll mentions and dedicated tutorials available.</p><a class="btn btn-ghost" href="advertise.html">See sponsorship options</a></div></div></div>"""
    add("videos.html", "Math & Money Explainer Videos | 55993", "Curated video explainers on calculus, compound growth, geometry and the math behind everyday numbers.", body, active="videos")

# ---------------------------------------------------------------- lead gen
def build_lead():
    choices = [("mortgage", "Mortgage / refinance", "Rates, pre-approval, refinancing"), ("loan", "Personal or business loan", "Compare lenders & terms"),
               ("advisor", "Financial advisor", "Retirement, investing, tax planning"), ("insurance", "Insurance quote", "Life, home, auto, health"),
               ("tutor", "Math tutor", "1-on-1 help, exam prep, homework"), ("widget", "Custom calculator for my site", "Branded, lead-capturing widgets"),
               ("advertise", "Advertise on 55993", "Display, sponsorships, newsletter"), ("other", "Something else", "Tell us what you need")]
    grid = "".join(f'<button type="button" class="choice" data-need="{k}"><strong>{n}</strong><span>{d}</span></button>' for k, n, d in choices)
    body = f"""<div class="container"><div class="page-hero center" style="margin:0 auto"><span class="eyebrow">Free · No obligation · 2 minutes</span><h1>Get matched with the right expert</h1>
<p style="margin:0 auto">Answer three quick questions. We'll connect you with vetted specialists for your exact situation — and you only hear from people you approve.</p></div>
<div class="funnel card">
<div class="small muted" id="step-label">Step 1 of 3 — What do you need?</div><div class="progress"><span id="prog"></span></div>
<form id="funnel" data-form="Lead — Get Matched" data-success="🎉 You're matched! A specialist will contact you within 1 business day. Check your inbox (and spam folder).">
<input type="hidden" name="need" id="need">
<div class="step active" data-step="1"><div class="choice-grid">{grid}</div></div>
<div class="step" data-step="2">
<div class="grid-2"><div class="field"><label for="amount">Amount / budget (optional)</label><input id="amount" name="amount" placeholder="e.g. $350,000 or $50/hour"></div>
<div class="field"><label for="timeline">Timeline</label><select id="timeline" name="timeline"><option>As soon as possible</option><option>Within 1 month</option><option>1–3 months</option><option>3–6 months</option><option>Just researching</option></select></div></div>
<div class="grid-2"><div class="field"><label for="country">Country</label><input id="country" name="country" required autocomplete="country-name"></div>
<div class="field"><label for="region">State / province / city</label><input id="region" name="region"></div></div>
<div class="field"><label for="details">Anything else we should know?</label><textarea id="details" name="details" placeholder="Your goals, current situation, preferred contact times…"></textarea></div>
<div class="result-actions"><button type="button" class="btn btn-ghost" data-back>← Back</button><button type="button" class="btn btn-primary" data-next>Continue →</button></div></div>
<div class="step" data-step="3">
{form_fields_contact('<div class="field"><label for="ph">Phone (optional — for faster callbacks)</label><input id="ph" type="tel" name="phone" autocomplete="tel"></div><div class="field"><label for="pref">Preferred contact</label><select id="pref" name="preferred_contact"><option>Email</option><option>Phone</option><option>WhatsApp</option></select></div>')}
<label class="check small"><input type="checkbox" name="consent" value="yes" required> I agree that 55993 may share my request with up to 3 relevant partners so they can contact me. I can opt out anytime. See the <a href="privacy.html">Privacy Policy</a>.</label>
<div class="result-actions"><button type="button" class="btn btn-ghost" data-back>← Back</button><button type="submit" class="btn btn-primary">Get my free match</button></div>
<div class="form-status"></div></div>
</form>
<div class="trust-row"><span>🔒 Encrypted submission</span><span>✓ No spam, ever</span><span>✓ 100% free for you</span><span>✓ Unsubscribe anytime</span></div></div>
<section><div class="section-head"><div><span class="eyebrow">How it works</span><h2>Three steps to the right answer</h2></div></div>
<div class="cards"><div class="card"><div class="num" style="font-size:2rem;font-weight:700;color:var(--brand)">01</div><h3>Tell us your goal</h3><p class="muted">Pick what you need and share a few details. No credit check, no commitment.</p></div>
<div class="card"><div class="num" style="font-size:2rem;font-weight:700;color:var(--brand)">02</div><h3>We match you</h3><p class="muted">We review your request and connect you with specialists suited to your location and needs.</p></div>
<div class="card"><div class="num" style="font-size:2rem;font-weight:700;color:var(--brand)">03</div><h3>Compare & decide</h3><p class="muted">Talk to your matches, compare options and choose — or walk away. Your call.</p></div></div></section>
<div class="card" style="margin-bottom:24px"><h2>Are you a professional?</h2><p class="muted">Mortgage brokers, lenders, advisors, insurers, tutors and agencies: join the 55993 partner network to receive qualified, high-intent leads from people actively running the numbers.</p><a class="btn btn-primary" href="advertise.html#partner">Become a partner</a></div></div>
<script>
(function(){{var f=document.getElementById('funnel'),steps=[].slice.call(f.querySelectorAll('.step')),cur=1,lbl=['','What do you need?','A few details','Where should we reach you?'];
function go(n){{cur=n;steps.forEach(function(s){{s.classList.toggle('active',+s.dataset.step===n)}});document.getElementById('prog').style.width=(n/3*100)+'%';document.getElementById('step-label').textContent='Step '+n+' of 3 — '+lbl[n];f.scrollIntoView({{behavior:'smooth',block:'nearest'}});}}
f.querySelectorAll('.choice').forEach(function(c){{c.addEventListener('click',function(){{f.querySelectorAll('.choice').forEach(function(x){{x.classList.remove('selected')}});c.classList.add('selected');document.getElementById('need').value=c.querySelector('strong').textContent;go(2);}})}});
f.querySelectorAll('[data-back]').forEach(function(b){{b.addEventListener('click',function(){{go(cur-1)}})}});
f.querySelectorAll('[data-next]').forEach(function(b){{b.addEventListener('click',function(){{var c=document.getElementById('country');if(!c.value){{c.reportValidity();return;}}go(3)}})}});
f.addEventListener('sent',function(){{f.querySelectorAll('.choice').forEach(function(x){{x.classList.remove('selected')}});}});
var q=new URLSearchParams(location.search).get('need');if(q){{var b=f.querySelector('[data-need="'+q+'"]');if(b)b.click();}}
go(q?2:1);}})();
</script>"""
    add("get-matched.html", "Get Matched Free — Mortgage, Loans, Advisors, Tutors | 55993", "Free, no-obligation matching with vetted mortgage specialists, lenders, financial advisors, insurance agents, math tutors and calculator developers.", body, active="lead")

# ---------------------------------------------------------------- support / donate
def build_support():
    tiers = [(5, "Supporter", "Buy the servers a coffee.", ""), (25, "Champion", "Funds a new calculator.", "featured"), (100, "Patron", "Sponsors a monthly contest prize.", ""), (500, "Founding Partner", "Logo on our supporters wall + newsletter shout-out.", "")]
    tiers_html = "".join(f'<div class="card tier {c}"><h3>{n}</h3><div class="price">${a}</div><p class="muted small">{d}</p><button class="btn {"btn-primary" if c else "btn-ghost"} btn-block" data-donate="{a}">Give ${a}</button></div>' for a, n, d, c in tiers)
    alloc = [("Operations & hosting", 30), ("New tools & content", 25), ("Contests & prizes", 15), ("Hiring talent & creators", 15), ("Promotion & marketing", 15)]
    alloc_html = "".join(f'<div class="alloc-row"><span>{n}</span><div class="track"><span style="width:{p}%"></span></div><b class="num">{p}%</b></div>' for n, p in alloc)
    links = "".join(f'<a class="btn btn-ghost" data-donate-link="{k}" href="#">{n}</a>' for k, n in [("stripeLink", "Card / Apple Pay"), ("paypalMe", "PayPal"), ("buyMeACoffee", "Buy Me a Coffee"), ("kofi", "Ko-fi"), ("githubSponsors", "GitHub Sponsors")])
    body = f"""<div class="container"><div class="page-hero"><span class="eyebrow">Support 55993</span><h1>Keep the numbers free for everyone</h1>
<p>55993 is free, private and ad-light by design. Your support pays for operations, builds new tools, funds contest prizes, hires talented writers, developers and creators, and helps more people find the site.</p></div>
<div class="tiers">{tiers_html}</div>
<div class="pill-row" style="margin-top:18px">{links}</div>
<section><div class="two-col"><div><span class="eyebrow">Transparency</span><h2>Where every dollar goes</h2><p class="muted">Target allocation of supporter funds. We'll publish a short report each quarter.</p><div class="alloc">{alloc_html}</div></div>
<div class="card" id="pledge-form"><h2>Pledge or sponsor</h2><p class="muted small">Prefer bank transfer, invoice, crypto, a recurring gift or an in-kind sponsorship (prizes, software, services)? Pledge here and we'll reply with secure payment details.</p>
<form data-form="Donation pledge" data-success="Thank you for your generosity! We'll email secure payment details shortly.">{form_fields_contact('<div class="grid-2"><div class="field"><label for="amt">Amount (USD)</label><input id="amt" name="amount" inputmode="decimal" required></div><div class="field"><label for="freq">Frequency</label><select id="freq" name="frequency"><option>One-time</option><option>Monthly</option><option>Yearly</option></select></div></div><div class="field"><label for="purpose">Direct my gift to</label><select id="purpose" name="purpose"><option>Where it is needed most</option><option>Operations & hosting</option><option>Contest prizes</option><option>New tools</option><option>Hiring creators & talent</option><option>Promotion & marketing</option><option>In-kind sponsorship (prizes, services)</option></select></div><div class="field"><label for="pm">Preferred payment method</label><select id="pm" name="payment_method"><option>Card</option><option>PayPal</option><option>Bank transfer / invoice</option><option>Crypto</option><option>Other</option></select></div><label class="check small"><input type="checkbox" name="public_thanks" value="yes"> Thank me publicly on the supporters wall</label>')}
<button class="btn btn-primary btn-block" type="submit" style="margin-top:12px">Send pledge</button><div class="form-status"></div></form></div></div></section>
<div class="card" style="margin-bottom:24px"><h2>Supporters wall</h2><p class="muted">Our first supporters will be listed here with their permission. Be the first name on the wall.</p></div>
<div class="faq" style="margin-bottom:24px"><h2>Questions</h2>
<details><summary>Is my donation tax-deductible?</summary><p>55993 is not a registered charity, so donations are generally not tax-deductible. Business sponsorships may be deductible as marketing — ask your accountant.</p></details>
<details><summary>Can I cancel a recurring gift?</summary><p>Yes, anytime — just reply to any receipt or use the contact page.</p></details>
<details><summary>Can my company sponsor a contest prize?</summary><p>Absolutely. Choose “In-kind sponsorship” above or visit the <a href="advertise.html">advertise page</a>.</p></details></div></div>"""
    add("support.html", "Support & Donate — Keep 55993 Free | 55993", "Donate or sponsor to keep 55993 free: funding operations, new tools, contest prizes, creators and promotion.", body, active="support")

# ---------------------------------------------------------------- contests
def build_contests():
    body = f"""<div class="container"><div class="page-hero"><span class="eyebrow">Challenges & prizes</span><h1>Play daily. Win monthly.</h1><p>Sharpen your number sense with the free Daily Target puzzle, then enter the Monthly Number Challenge for prizes and a spot in the Hall of Fame.</p></div>
<div class="two-col">
<div class="card" id="daily"><span class="eyebrow">Daily Target · new puzzle every day</span><h2>Reach <span class="target num" id="g-target">—</span></h2>
<p class="muted small">Use the numbers below (each at most once) with + − × ÷ and brackets to hit the target exactly.</p>
<div class="game-tiles" id="g-tiles"></div>
<div class="instant" style="margin:12px 0"><label class="sr-only" for="g-in">Your expression</label><input id="g-in" placeholder="e.g. (100 - 4) * 7 + 3" autocomplete="off"><button class="btn btn-primary" id="g-go">Check</button></div>
<p id="g-msg" aria-live="polite" style="min-height:1.6em"></p>
<div class="result-actions"><span class="badge">🔥 Streak: <b id="g-streak">0</b></span><button class="btn btn-ghost btn-sm" id="g-share">Share</button><button class="btn btn-ghost btn-sm" id="g-reveal">Reveal a solution</button></div></div>
<div class="card" id="challenge"><span class="eyebrow">Monthly Number Challenge · <span id="contest-month"></span></span><h2>Closes in</h2><div class="countdown" id="countdown"></div>
<h3 style="margin-top:20px">This month's prizes</h3>
<table class="data"><tr><th>Place</th><th>Prize</th></tr><tr><td>🥇 1st</td><td>$50 gift card + Hall of Fame</td></tr><tr><td>🥈 2nd</td><td>$25 gift card + Hall of Fame</td></tr><tr><td>🥉 3rd</td><td>$10 gift card + Hall of Fame</td></tr><tr><td>🎖 Top 10</td><td>Featured in The Weekly Number</td></tr></table>
<p class="small muted" style="margin-top:8px">Prizes are funded by supporters & sponsors. <a href="advertise.html#partner">Sponsor a bigger prize →</a></p></div>
</div>
<div class="ad-slot" data-slot="inContent"></div>
<section><div class="two-col"><div class="prose"><h2>This month's challenge question</h2>
<p><b>The 55993 problem:</b> 55,993 = 7 × 19 × 421. Find the <b>smallest</b> five-digit number that is also the product of exactly three distinct primes, <b>all</b> of which are greater than 5 — and show your reasoning.</p>
<p class="muted">Correct answers with the clearest explanations are ranked by a panel; ties are broken by random draw using our public <a href="tools/random-number-generator.html">random number generator</a> on a livestream or recorded video.</p>
<h3>Rules (short version)</h3><ul class="list-check"><li>Free to enter — no purchase necessary. One entry per person per month.</li><li>Open worldwide where lawful; void where prohibited. Entrants under 18 need parental permission.</li><li>Entries close at 23:59 (UTC) on the last day of the month.</li><li>Winners are announced within 14 days and contacted by email; unclaimed prizes after 30 days roll over.</li><li>Prizes are non-transferable; no cash alternative unless required by law. Full terms in our <a href="terms.html#contests">Terms of Use</a>.</li></ul></div>
<div class="card"><h2>Submit your entry</h2><form data-form="Monthly challenge entry" data-success="Entry received — good luck! Winners are announced within 14 days of the deadline.">
{form_fields_contact('<div class="grid-2"><div class="field"><label for="ans">Your answer</label><input id="ans" name="answer" required inputmode="numeric"></div><div class="field"><label for="ctry">Country</label><input id="ctry" name="country" required></div></div><div class="field"><label for="why">Your reasoning</label><textarea id="why" name="reasoning" required></textarea></div><div class="field"><label for="dn">Display name for Hall of Fame</label><input id="dn" name="display_name"></div>')}
<label class="check small"><input type="checkbox" name="rules" value="accepted" required> I accept the contest rules and I'm 18+ or have parental permission.</label>
<button class="btn btn-primary btn-block" type="submit" style="margin-top:12px">Submit entry</button><div class="form-status"></div></form></div></div></section>
<div class="card" style="margin-bottom:24px"><h2>🏆 Hall of Fame</h2><p class="muted">The first monthly winners will be listed here. Your name could be first.</p></div></div>"""
    add("contests.html", "Daily Number Puzzle & Monthly Prize Challenge | 55993", "Play the free Daily Target number puzzle, build a streak and enter the Monthly Number Challenge to win prizes.", body, active="contests", js=["game.js"])

# ---------------------------------------------------------------- careers
def build_careers():
    roles = [("Finance & Math Content Writer", "Remote · Freelance", "Write clear, accurate calculator guides, FAQs and explainers. Finance, accounting or math background preferred."),
             ("Front-end Developer (Calculators)", "Remote · Contract", "Build fast, accessible calculators in vanilla JS. Strong math and UX sense."),
             ("YouTube Creator / Video Editor", "Remote · Per project", "Script, animate and edit short explainers and Shorts about numbers and money."),
             ("Growth & SEO Marketer", "Remote · Part-time", "Own keyword strategy, programmatic pages, partnerships and newsletter growth."),
             ("Partnerships & Ad Sales", "Remote · Commission", "Sell sponsorships, calculator branding and lead-gen partnerships."),
             ("Community & Contest Moderator", "Remote · Part-time", "Run the monthly challenge, review entries and grow the community."),
             ("Campus / Creator Ambassador", "Remote · Flexible", "Share 55993 with your audience or campus and earn rewards.")]
    cards = "".join(f'<div class="card"><h3>{n}</h3><span class="badge">{w}</span><p class="muted" style="margin-top:10px">{d}</p><a class="btn btn-ghost btn-sm" href="#apply" onclick="document.getElementById(\'role\').value=\'{n}\'">Apply</a></div>' for n, w, d in roles)
    opts = "".join(f"<option>{n}</option>" for n, _, _ in roles) + "<option>Open application / other</option>"
    body = f"""<div class="container"><div class="page-hero"><span class="eyebrow">Careers & talent</span><h1>Help millions of people get their numbers right</h1><p>We're a lean, remote-first team building the web's friendliest number hub. We hire for craft, clarity and curiosity — wherever you are.</p></div>
<div class="cards">{cards}</div>
<section id="apply"><div class="two-col"><div><h2>Why work with 55993</h2><ul class="list-check"><li>100% remote, async-friendly, flexible hours</li><li>Your work reaches a global audience every day</li><li>Paid per project or retainer — clear scopes, fast payment</li><li>Portfolio-worthy, bylined work</li><li>Grow into lead roles as the network expands</li></ul></div>
<div class="card"><h2>Apply now</h2><form data-form="Job application" data-success="Application received — thank you! We reply to every applicant within 10 business days.">
{form_fields_contact(f'<div class="field"><label for="role">Role</label><select id="role" name="role" required>{opts}</select></div><div class="grid-2"><div class="field"><label for="pf">Portfolio / LinkedIn / GitHub URL</label><input id="pf" type="url" name="portfolio" required></div><div class="field"><label for="loc">Location / time zone</label><input id="loc" name="location"></div></div><div class="field"><label for="rate">Expected rate</label><input id="rate" name="rate" placeholder="e.g. $40/hour or $200/article"></div><div class="field"><label for="cv">Why you? (a few lines)</label><textarea id="cv" name="message" required></textarea></div>')}
<button class="btn btn-primary btn-block" type="submit">Submit application</button><div class="form-status"></div></form></div></div></section></div>"""
    add("careers.html", "Careers — Writers, Developers, Creators | 55993", "Remote roles at 55993: content writers, calculator developers, video creators, growth marketers, ad sales and ambassadors.", body, active="careers")

# ---------------------------------------------------------------- advertise
def build_advertise():
    formats = [("Display advertising", "Responsive banner placements across every calculator page, category page and the homepage."),
               ("Sponsored calculator", "Your logo and CTA on a calculator in your category — e.g. a mortgage tool 'powered by' your brand."),
               ("Lead-generation partnership", "Receive qualified, consented leads from our Get Matched funnel (mortgage, loans, advisors, insurance, tutoring)."),
               ("Newsletter sponsorship", "A native slot in The Weekly Number email."),
               ("Contest sponsorship", "Fund the monthly prize and get branding on the challenge page, entry emails and winner announcements."),
               ("Video integration", "Sponsor an evergreen explainer video or a series on our channel."),
               ("White-label widgets", "We build branded calculators for your website that capture leads for you.")]
    cards = "".join(f'<div class="card"><h3>{n}</h3><p class="muted">{d}</p></div>' for n, d in formats)
    body = f"""<div class="container"><div class="page-hero"><span class="eyebrow">Advertise · Sponsor · Partner</span><h1>Reach people at the exact moment they run the numbers</h1>
<p>Our visitors are actively calculating mortgages, loans, savings, retirement, health and business decisions — the highest-intent moment in the buying journey.</p>
<a class="btn btn-primary" href="#partner">Request the media kit</a> <a class="btn btn-ghost" href="{INTEREST_URL}" target="_blank" rel="noopener">Domain / acquisition inquiry</a></div>
<div class="cards">{cards}</div>
<section id="widgets"><div class="card"><h2>Embed our calculators on your site</h2><p class="muted">Free embeds for bloggers and publishers (with attribution), or fully branded, lead-capturing white-label versions for businesses. Tell us which calculator you want and where it will live.</p><a class="btn btn-ghost" href="#partner">Request an embed</a></div></section>
<section id="partner" style="padding-top:0"><div class="two-col"><div><h2>Let's talk</h2><ul class="list-check"><li>Category exclusivity available for sponsored calculators</li><li>Transparent reporting on impressions, clicks and leads</li><li>Brand-safe: no gambling, adult or misleading financial offers</li><li>Custom packages from small tests to annual partnerships</li></ul><p class="muted small">Interested in acquiring or partnering on the 55993.com domain itself? Use the <a href="{INTEREST_URL}" target="_blank" rel="noopener">domain contact page</a>.</p></div>
<div class="card"><form data-form="Advertising / partnership inquiry" data-success="Thanks! We'll send the media kit and options within 1–2 business days.">
{form_fields_contact('<div class="grid-2"><div class="field"><label for="co">Company</label><input id="co" name="company" required></div><div class="field"><label for="web">Website</label><input id="web" type="url" name="website"></div></div><div class="field"><label for="int">Interested in</label><select id="int" name="interest"><option>Display advertising</option><option>Sponsored calculator</option><option>Lead-generation partnership</option><option>Newsletter sponsorship</option><option>Contest sponsorship</option><option>Video integration</option><option>White-label widget / embed</option><option>Domain acquisition / partnership</option></select></div><div class="field"><label for="bud">Monthly budget</label><select id="bud" name="budget"><option>Under $500</option><option>$500 – $2,000</option><option>$2,000 – $10,000</option><option>$10,000+</option><option>Not sure yet</option></select></div><div class="field"><label for="msg">Goals</label><textarea id="msg" name="message"></textarea></div>')}
<button class="btn btn-primary btn-block" type="submit">Request media kit</button><div class="form-status"></div></form></div></div></section></div>"""
    add("advertise.html", "Advertise, Sponsor & Partner | 55993", "Advertising, sponsored calculators, lead-generation partnerships, newsletter and contest sponsorships, and white-label calculator widgets.", body, active="advertise")

# ---------------------------------------------------------------- about / contact / legal
def build_static():
    add("about.html", "About 55993 — Numbers, Solved.", "Why 55993 exists: fast, free, private calculators and number tools for everyone.",
        f"""<div class="container prose" style="max-width:820px"><div class="page-hero"><span class="eyebrow">About</span><h1>Numbers, solved.</h1></div>
<p>55993 is an independent hub of free calculators, converters and number tools. We believe that the numbers behind life's big decisions — a mortgage, a loan, retirement, health, a business plan — should be easy to understand, free to calculate and private by default.</p>
<h2>What makes us different</h2><ul class="list-check"><li><b>Private by design</b> — every calculation runs in your browser; we never see your numbers.</li><li><b>Show the math</b> — every tool explains its formula with a worked example.</li><li><b>Fast everywhere</b> — lightweight pages that load instantly on any phone.</li><li><b>Human help when you need it</b> — our free Get Matched service connects you with vetted experts.</li></ul>
<h2>Why “55993”?</h2><p>Read it as “55 · 99 · 3”. A short, memorable number is a fitting home for a site about numbers. The name is used purely as a domain and site identifier and has no connection to any other organization using the same number.</p>
<h2>Accuracy & review</h2><p>Formulas follow standard, widely published methods (for example, the standard amortization formula for loans and the Mifflin–St Jeor equation for calorie needs). If you spot an error, please <a href="contact.html?topic=Correction">tell us</a> — corrections are prioritized.</p>
<div class="result-actions"><a class="btn btn-primary" href="tools/index.html">Explore the tools</a><a class="btn btn-ghost" href="careers.html">Join the team</a></div></div>""", active="about")

    topics = ["General question", "Calculator request", "Correction", "Advertising / sponsorship", "Partnership", "Press", "Careers", "Donations", "Privacy request"]
    add("contact.html", "Contact 55993", "Contact the 55993 team for questions, corrections, calculator requests, partnerships and press.",
        f"""<div class="container"><div class="page-hero"><span class="eyebrow">Contact</span><h1>We'd love to hear from you</h1><p>Questions, corrections, calculator requests, partnerships or press — send us a message and we'll reply within 1–2 business days.</p></div>
<div class="two-col" style="margin-bottom:24px"><div class="card"><form data-form="Contact form">{form_fields_contact('<div class="field"><label for="topic">Topic</label><select id="topic" name="topic">' + "".join(f"<option>{t}</option>" for t in topics) + '</select></div><div class="field"><label for="m">Message</label><textarea id="m" name="message" required></textarea></div>')}
<button class="btn btn-primary btn-block" type="submit">Send message</button><div class="form-status"></div></form></div>
<div><div class="card"><h3>Prefer email?</h3><p class="muted small">Opens your email app with our address filled in.</p><a class="btn btn-ghost" href="#contact" data-mail="Hello from 55993.com">✉ Email us</a></div>
<div class="card" style="margin-top:16px"><h3>Interested in this domain or website?</h3><p class="muted small">For acquisition, sponsorship, advertising or partnership of 55993.com itself:</p><a class="btn btn-primary" href="{INTEREST_URL}" target="_blank" rel="noopener">Domain & partnership contact</a></div>
<div class="card" style="margin-top:16px"><h3>Need an expert?</h3><p class="muted small">Mortgage, loans, advisors, tutors, custom calculators.</p><a class="btn btn-ghost" href="get-matched.html">Get matched free</a></div></div></div></div>
<script>(function(){{var t=new URLSearchParams(location.search).get('topic');if(t){{var s=document.getElementById('topic');[].forEach.call(s.options,function(o){{if(o.text===t)s.value=t}});}}}})();</script>""", active="contact")

    add("privacy.html", "Privacy Policy | 55993", "How 55993 handles data, cookies, advertising (Google AdSense), analytics and form submissions.",
        f"""<div class="container prose" style="max-width:820px"><div class="page-hero"><span class="eyebrow">Legal</span><h1>Privacy Policy</h1><p class="small">Last updated {TODAY}</p></div>
<h2>Summary</h2><p>Calculations run entirely in your browser and are not sent to us. We only receive information you choose to submit through our forms. We may use cookies for preferences, analytics and advertising as described below.</p>
<h2>Information we collect</h2><p><b>Form submissions.</b> When you use a contact, lead, newsletter, contest, careers or donation form, we receive the details you enter (such as name, email, and your message). Forms are delivered to us via a third-party form-processing service (FormSubmit). <b>Local storage.</b> Your browser stores preferences such as theme, recently used tools, puzzle streaks and consent choices; this never leaves your device. <b>Usage data.</b> If analytics are enabled and you consent, we collect anonymous usage statistics (pages viewed, device type, approximate region).</p>
<h2>How we use information</h2><p>To answer inquiries, deliver the newsletter, run contests and award prizes, review job applications, process pledges, and — for Get Matched requests where you give consent — share your request with up to three relevant partners so they can contact you.</p>
<h2>Advertising and Google AdSense</h2><p>Third-party vendors, including Google, may use cookies to serve ads based on your prior visits to this and other websites. Google's use of advertising cookies enables it and its partners to serve ads based on your visits to this and/or other sites on the Internet. You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" rel="noopener" target="_blank">Google Ads Settings</a> or <a href="https://www.aboutads.info" rel="noopener" target="_blank">www.aboutads.info</a>. Learn more about <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener">how Google uses information from sites that use its services</a>.</p>
<h2>Embedded content</h2><p>Videos are embedded from YouTube in privacy-enhanced mode and load only after you press play; YouTube's privacy policy then applies.</p>
<h2>Your choices & rights</h2><p>You can choose “Essential only” in the cookie banner, clear local storage at any time, unsubscribe from emails via any message, and request access, correction or deletion of your data through our <a href="contact.html?topic=Privacy%20request">contact form</a>. Residents of the EU/UK (GDPR), California (CCPA/CPRA), Canada (PIPEDA) and other jurisdictions may have additional rights, which we honor.</p>
<h2>Children</h2><p>This site is intended for a general audience and is not directed at children under 13. We do not knowingly collect personal information from children under 13.</p>
<h2>Retention & security</h2><p>We keep submissions only as long as needed for the purpose they were sent. The site is served over HTTPS.</p>
<h2>Contact</h2><p>Questions about privacy? <a href="contact.html?topic=Privacy%20request">Contact us</a>.</p></div>""")

    add("terms.html", "Terms of Use | 55993", "Terms of use for 55993 calculators, content, contests and services.",
        f"""<div class="container prose" style="max-width:820px"><div class="page-hero"><span class="eyebrow">Legal</span><h1>Terms of Use</h1><p class="small">Last updated {TODAY}</p></div>
<h2>1. Acceptance</h2><p>By using 55993.com (the “Site”) you agree to these Terms. If you do not agree, please do not use the Site.</p>
<h2>2. Informational use only</h2><p>All calculators, content and results are provided “as is” for general informational and educational purposes. They are not financial, investment, tax, legal, medical or other professional advice. Verify results and consult a qualified professional before making decisions.</p>
<h2>3. No warranty; limitation of liability</h2><p>We work hard to keep formulas accurate but make no warranty of accuracy, completeness or fitness for a particular purpose. To the maximum extent permitted by law, we are not liable for any loss arising from use of the Site.</p>
<h2>4. Intellectual property</h2><p>The Site's original text, code, design, graphics and compilation are protected by copyright. You may link to any page and share results. You may not copy the Site or substantial parts of it without written permission. See our <a href="legal.html">Trademark & Copyright disclosure</a>.</p>
<h2>5. Get Matched & partners</h2><p>Get Matched is a free referral service. Partners are independent businesses; we do not endorse and are not responsible for their products, advice or services. We may receive compensation from partners.</p>
<h2 id="contests">6. Contests</h2><p>No purchase necessary. Void where prohibited. One entry per person per month. Entrants under 18 require parental permission. Winners are selected by a judging panel based on correctness and clarity, with random draws for ties. Prizes are as described on the contest page, non-transferable, and may be substituted with a prize of equal or greater value. Winners are responsible for any taxes. By entering, winners consent to publication of their display name and country. We may cancel or modify a contest if it cannot run as planned.</p>
<h2>7. Donations</h2><p>Donations are voluntary and non-refundable except where required by law. 55993 is not a registered charity.</p>
<h2>8. User submissions</h2><p>Do not submit unlawful, infringing or misleading content. By submitting content (e.g. contest reasoning or video suggestions) you grant us a non-exclusive licence to display it in connection with the Site.</p>
<h2>9. Changes</h2><p>We may update these Terms; continued use means acceptance of the updated Terms.</p>
<h2>10. Contact</h2><p><a href="contact.html">Contact us</a> with any questions.</p></div>""")

    add("legal.html", "Trademark & Copyright Disclosure | 55993", "Trademark, copyright, affiliate and calculator disclaimers for 55993.com.",
        f"""<div class="container prose" style="max-width:820px"><div class="page-hero"><span class="eyebrow">Legal</span><h1>Trademark & Copyright Disclosure</h1><p class="small">Last updated {TODAY}</p></div>
<h2>Use of the number “55993”</h2><p>“55993” is a numeric string used on this website solely as a domain name (55993.com) and as a descriptive site identifier. No exclusive trademark rights are claimed in the number 55993 itself. This website is <b>not affiliated with, endorsed by, sponsored by or otherwise connected to</b> any company, brand, product, model or part number, postal or ZIP code, telephone number, lottery, game or any other organization or item that uses the number 55993 or a similar sequence. Any such similarity is purely coincidental.</p>
<h2>Copyright</h2><p>© {YEAR} 55993.com. All original written content, calculator code, page design, graphics and the compilation of this website are the property of the site owner and are protected by applicable copyright laws. Mathematical formulas and facts are not claimed as proprietary; our original explanations, layouts and code are. Limited quotation with attribution and a link is welcome.</p>
<h2>Third-party marks and content</h2><p>All third-party names, trademarks, logos and service marks (including Google, AdSense, YouTube, PayPal, Stripe, Buy Me a Coffee, Ko-fi and GitHub) are the property of their respective owners and are used only to identify their services. Embedded YouTube videos remain the property of their creators and are shown via YouTube's official embed player under YouTube's terms. No endorsement by any third party is implied.</p>
<h2>Copyright complaints (DMCA / notice-and-takedown)</h2><p>If you believe content on this site infringes your copyright or trademark, please send a notice via our <a href="contact.html?topic=General%20question">contact form</a> including: your contact details, identification of the work, the URL of the material, a good-faith statement, and a statement under penalty of perjury that you are authorized to act. We respond promptly and remove infringing material where appropriate.</p>
<h2 id="disclaimer">Calculator & content disclaimer</h2><p>Results are estimates for information and education only and do not constitute financial, investment, tax, legal, medical or professional advice. Consult a qualified professional before acting.</p>
<h2>Advertising & affiliate disclosure</h2><p>This site may display advertising (including Google AdSense), sponsored placements and partner offers, and may earn compensation when you use partner services or submit a Get Matched request. Compensation never changes calculator results. Sponsored content is always labeled.</p>
<h2>Domain inquiries</h2><p>For interest in this website, the domain name, sponsorship, advertisement or partnership: <a href="{INTEREST_URL}" target="_blank" rel="noopener">web.works/contact</a>.</p></div>""")

    add("404.html", "Page not found | 55993", "The page you're looking for doesn't exist.",
        """<div class="container center" style="padding:80px 16px"><div class="num" style="font-size:6rem;font-weight:700;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent">404</div><h1>That number doesn't add up.</h1><p class="muted">The page you're looking for has moved or never existed.</p><div class="instant" style="margin:24px auto"><input id="tool-search" placeholder="Search calculators…"></div><div class="search-results" id="search-results" style="margin:0 auto;text-align:left"></div><a class="btn btn-primary" href="index.html">Go home</a></div>""")

# ---------------------------------------------------------------- sitemap etc.
def build_meta():
    urls = [p for p in PAGES if p != "404.html"]
    with open(os.path.join(ROOT, "sitemap.xml"), "w") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
        for u in urls:
            pr = "1.0" if u == "index.html" else ("0.8" if u.startswith("tools/") else "0.6")
            f.write(f"  <url><loc>{SITE}/{u.replace('index.html', '')}</loc><lastmod>{TODAY}</lastmod><priority>{pr}</priority></url>\n")
        f.write("</urlset>\n")
    with open(os.path.join(ROOT, "robots.txt"), "w") as f:
        f.write(f"User-agent: *\nAllow: /\nDisallow: /scripts/\nDisallow: /docs/\n\nSitemap: {SITE}/sitemap.xml\n")
    print(f"Built {len(PAGES)} pages")

if __name__ == "__main__":
    build_index(); build_tools(); build_home(); build_numbers(); build_videos(); build_lead()
    build_support(); build_contests(); build_careers(); build_advertise(); build_static(); build_meta()
