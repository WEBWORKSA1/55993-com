# 55993.com — Numbers, Solved.

Free calculators, converters, a Number Explorer, daily puzzles with prizes, and free expert matching. It's a static site with no backend, hosted free on GitHub Pages.

**Live:** https://webworksa1.github.io/55993-com/

## Structure
```
index.html, numbers.html, videos.html, contests.html, get-matched.html,
support.html, advertise.html, careers.html, about.html, contact.html,
privacy.html, terms.html, legal.html, 404.html
tools/                 37 calculator pages + directory (generated)
assets/css/style.css   design system (light/dark)
assets/js/config.js    ← AdSense ID, donation links, YouTube videos, form alias
assets/js/app.js       theme, nav, forms, ads, search, safe math parser
assets/js/tools.js     calculator engine + tool logic
assets/js/explorer.js  Number Explorer
assets/js/game.js      Daily Target puzzle + contest countdown
scripts/build.py       static page generator (Python 3, stdlib only)
scripts/tools_meta.py  SEO copy for each tool
docs/BUILD-PROMPT.md   concept, research and phase-wise build prompt
```

## Edit & rebuild
```bash
python3 scripts/make_og.py # optional: regenerates the social preview image (needs Pillow)
python3 scripts/build.py   # regenerates all HTML
```
Commit to `main`, then publish by merging `main` into `gh-pages`. GitHub Pages serves the `gh-pages` branch.

## Switch on monetization
1. **AdSense:** set `adsenseClient` in `assets/js/config.js`, set `ADSENSE_META` in `scripts/build.py`, update `ads.txt`, then rebuild.
2. **Donations:** paste your Stripe, PayPal.me, Buy Me a Coffee, Ko-fi or GitHub Sponsors links into `config.js`.
3. **Forms:** the first submission sends a one-time FormSubmit activation email to the site inbox. Click *Activate*.

## Custom domain
Add a `CNAME` file containing `55993.com`. Point DNS A records to 185.199.108.153, 185.199.109.153, 185.199.110.153 and 185.199.111.153 (plus a `www` CNAME to `webworksa1.github.io`). Then enable *Enforce HTTPS* under Settings → Pages.

© 55993.com. See [legal.html](legal.html) for the trademark and copyright disclosure.
