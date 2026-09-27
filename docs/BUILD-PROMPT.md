# 55993.com — Concept, Research & Phase-wise Build Prompt

## 1. The idea: "55993 — Numbers, Solved."

Pick: a **number-utility hub** built around free calculators, converters and a Number Explorer, monetized with display ads, a lead-generation funnel, sponsorships and donations.

Why this idea wins for a 5-digit numeric domain:

| Criterion | Why the calculator/number hub fits |
|---|---|
| Brand fit | A numeric domain on a numbers site makes sense on sight. "55 · 99 · 3" is easy to remember. |
| Traffic ceiling | Calculator queries are huge, evergreen search categories: mortgage, percentage, BMI, age, compound interest, unit conversion. Category leaders (calculator.net, omnicalculator, rapidtables, calculatorsoup) are among the most-visited utility sites. |
| RPM | Finance calculators draw some of the highest-CPC advertisers there are: mortgage, loans, insurance, investing. |
| Lead-gen | Right after someone runs a calculation, they're at peak intent ("I can afford $2,775/month, now what?"). Bankrate, NerdWallet and SmartAsset all put a "get matched" or "get a quote" button beside the result. |
| Cost | It's static HTML with all the math running in the browser. Hosting is free on GitHub Pages and there's no server risk. |
| Moat | Scale programmatic tool pages over time, and add the Number Explorer, daily puzzle streaks and monthly contests so people come back. |

Rejected alternatives: lottery/number-prediction (AdSense gambling restrictions, low trust), angel-number/numerology (low RPM, thin content risk), ZIP-code 55993 local site (tiny audience, confusion/trademark risk).

## 2. Research summary (40 sites visited)

Sites analysed: Calculator.net, Omnicalculator, CalculatorSoup, RapidTables, MathsIsFun, Desmos, WolframAlpha, Symbolab, Mathway, UnitConverters.net, ConvertUnits, TimeAndDate, Random.org, NumberEmpire, Bankrate, NerdWallet, Calculator.com, GigaCalculator, InchCalculator, GoodCalculators, TheCalculatorSite, MathPapa, GeoGebra, Cuemath, Khan Academy, Brilliant, Project Euler, NumbersAPI, OEIS, Worldometers, Calculators.org, SmartAsset, Moneychimp, dCode, Calculatored, GCFGlobal, MiniWebtool, EasyCalculation, Calculator.io, Splitwise.

Patterns adopted:
- **UX:** an instant-calc/search bar in the hero, a category taxonomy with counts, a "Popular" shelf, related tools on every page, copy-link-to-result, print/share, dark mode, recently used tools, and mobile-first layouts.
- **Content/SEO:** every tool page gets a how-to, formula, worked example, FAQ, breadcrumbs, JSON-LD (WebApplication, FAQPage, BreadcrumbList) and a "last reviewed" date.
- **Monetization:** display slots (top, in-content, sidebar, footer), lead CTAs next to finance results, sponsored calculators, embeddable widgets and white-label B2B builds, plus donations (dCode/OEIS model).
- **Engagement:** a daily puzzle with streaks (the Wordle/Project Euler pattern), a monthly prize challenge, a newsletter, and trust signals.

## 3. Phase-wise build prompt (reusable)

> Use these prompts in order with any capable coding AI. Each phase has to leave the site deployable before the next one starts.

### Phase 0 — Guardrails
```
You are building 55993.com, a static website hosted free on GitHub Pages (repo WEBWORKSA1/55993-com).
Hard rules:
- Pure HTML/CSS/vanilla JS. No server, no build step required to serve. Relative links only (site must work under /55993-com/ and at a custom domain root).
- Top of EVERY page: a bar reading "Contact, if you are interested in this website / domain name / Sponsorship / Advertisement / Partnership" linking to https://web.works/contact.
- ONE contact address for every form, stored encoded in assets/js/config.js and never rendered as visible text, in HTML source or in a mailto: href in markup. Forms post via AJAX to FormSubmit using the decoded address at runtime.
- Do not claim a trademark in "55993". Include a Trademark & Copyright disclosure page and a footer disclaimer.
- Lighthouse targets: Performance ≥ 90, Accessibility ≥ 95, SEO 100. No horizontal scroll at 360px.
```

### Phase 1 — Design system & layout shell
```
Create assets/css/style.css with design tokens (light + dark via prefers-color-scheme and a [data-theme] toggle), Inter + Space Grotesk fonts, a gradient brand (indigo → violet → cyan, lime accent), cards, buttons, forms, pills and a responsive grid.
Build a Python generator (scripts/build.py, stdlib only) that wraps every page in the same head (SEO meta, OG, canonical, JSON-LD), the interest bar, a sticky header with a mobile menu and theme toggle, a newsletter band, a 5-column footer and a cookie-consent banner.
```

### Phase 2 — Calculator engine & 35+ tools
```
Write assets/js/tools.js: a declarative engine (inputs → calc() → {label, main, rows, bars, note}) with live recalculation, a copy-link-with-params action, reset, print and an optional contextual lead CTA.
Tools: mortgage, loan/EMI, compound interest, savings goal, retirement, credit-card payoff, ROI, inflation, salary↔hourly, tip, discount, sales tax/VAT, profit margin, break-even, percentage (5 modes), scientific (safe parser, no eval), quadratic, GCD/LCM, prime factorization, statistics, fractions, exponents/logs, ratio, BMI, calories (Mifflin–St Jeor), ideal weight, water intake, age, date difference, add days (business days), time duration, unit converter (8 categories), base converter (BigInt), Roman numerals, secure RNG, dice/coin, password generator.
For each tool, generate a static SEO page with an intro, formula, worked example, FAQ, related tools, ad slots and a sidebar.
```

### Phase 3 — Signature features
```
- Home: hero with an instant calculator/search bar, popular tools, categories, a lead mini-form, Number of the Day, the Daily Target teaser, a video row, and support/advertise/careers cards.
- Number Explorer (numbers.html): primality, factorization, divisors, perfect/abundant, square/cube/triangular/Fibonacci, Harshad, Armstrong, Collatz, bases, Roman, words, cultural digit meanings, and shareable ?n= URLs.
- Videos: lite YouTube facades (youtube-nocookie, load on click), playlists, a creator submission form, video sponsorship CTA.
```

### Phase 4 — Revenue engines
```
- AdSense: config-driven. When there's no publisher ID, slots show "Advertise here" house ads. When there is one, inject adsbygoogle and respect consent. Add ads.txt.
- Lead generation (get-matched.html): 3-step funnel (need → details → contact), with a progress bar, consent checkbox, trust row, ?need= deep links from tool CTAs, and a partner-recruitment block.
- Donations (support.html): 4 tiers, payment-link buttons from config (Stripe, PayPal.me, BMAC, Ko-fi, GitHub Sponsors), a pledge form fallback, a transparent allocation chart (operations, tools, prizes, hiring, marketing), and a supporters wall.
- Advertise (advertise.html): 7 formats (display, sponsored calculator, lead partnership, newsletter, contest, video, white-label widgets) and a media-kit request form.
- Careers (careers.html): 7 remote roles and an application form.
- Contests (contests.html): a seeded Daily Target puzzle (always solvable) with streaks and sharing, a monthly challenge with countdown, prizes table, rules, entry form and Hall of Fame.
```

### Phase 5 — Trust, legal & SEO
```
Privacy (AdSense cookie language, GDPR/CCPA/PIPEDA rights), Terms (including contest rules), Trademark & Copyright disclosure, 404, sitemap.xml, robots.txt, manifest, favicon, OG image.
```

### Phase 6 — Deploy
```
Commit the sources and the generated HTML to main in WEBWORKSA1/55993-com.
GitHub Pages serves the gh-pages branch (Settings → Pages → Deploy from a branch → gh-pages / root).
To publish an update, open a pull request from main into gh-pages and merge it (or push the same commit to gh-pages).
Verify https://webworksa1.github.io/55993-com/.
Custom domain: add a CNAME file containing 55993.com, then point DNS at the GitHub Pages IPs (A records 185.199.108.153 / .109 / .110 / .111) and enforce HTTPS.
```

### Phase 7 — Growth roadmap (post-launch)
1. Apply for AdSense once the site has 30–50 indexed pages and some organic traffic. Paste the publisher ID into config.js and ads.txt.
2. Programmatic SEO: add per-country and per-state versions of the mortgage and loan tools, plus "X% of Y" and "N in binary" long-tail pages.
3. Sign lead partners: mortgage brokers, lenders, advisor networks and tutoring platforms. Price per lead or rev-share.
4. Sell white-label calculators to real-estate agents, banks and SaaS companies.
5. YouTube: turn each tool into a 60-second Short that links back to the tool.
6. Newsletter: "The Weekly Number". Sell a sponsorship slot once there are 5k subscribers.

## 4. Operating notes
- **Forms:** the first submission triggers a one-time FormSubmit activation email to the site inbox. Click "Activate" once. Optionally paste the random alias FormSubmit gives you into `formAlias` in config.js.
- **Adding a tool:** add its logic to `assets/js/tools.js` and its metadata to `scripts/tools_meta.py`, run `python3 scripts/build.py`, then commit.
- **Contest prizes** are defined in `scripts/build.py` → `build_contests()`. Edit them before each month.
