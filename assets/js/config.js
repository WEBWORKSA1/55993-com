/* =========================================================================
   55993.com — SITE CONFIG (edit this one file to switch monetization on)
   ========================================================================= */
window.SITE_CONFIG = {
  siteName: "55993",
  tagline: "Numbers, Solved.",

  /* Google AdSense — paste your publisher id (e.g. "ca-pub-1234567890123456").
     While empty, ad slots show "Advertise here" house ads that link to /advertise.html. */
  adsenseClient: "",
  adsenseSlots: { top: "", inContent: "", sidebar: "", footer: "" },

  /* Google Analytics 4 — e.g. "G-XXXXXXXXXX" (optional) */
  gaId: "",

  /* Donation links (optional). Leave empty and the tier buttons open the pledge form instead. */
  donate: {
    buyMeACoffee: "",   // e.g. "https://www.buymeacoffee.com/yourname"
    kofi: "",           // e.g. "https://ko-fi.com/yourname"
    paypalMe: "",       // e.g. "https://paypal.me/yourname"  (never paste an email here)
    stripeLink: "",     // e.g. a Stripe Payment Link
    githubSponsors: ""  // e.g. "https://github.com/sponsors/WEBWORKSA1"
  },

  /* YouTube — your channel URL (optional) + curated videos shown on the site */
  youtubeChannel: "",
  videos: [
    { id: "WUvTyaaNkzM", title: "The essence of calculus", by: "3Blue1Brown", cat: "Math" },
    { id: "spUNpyF58BY", title: "But what is the Fourier Transform? A visual introduction", by: "3Blue1Brown", cat: "Math" },
    { id: "r6sGWTCMz2k", title: "But what is a Fourier series? From heat flow to drawing with circles", by: "3Blue1Brown", cat: "Math" },
    { id: "Kas0tIxDvrg", title: "Exponential growth and epidemics", by: "3Blue1Brown", cat: "Growth & Money" },
    { id: "pQa_tWZmlGs", title: "Why slicing a cone gives an ellipse", by: "3Blue1Brown", cat: "Geometry" }
  ],
  playlists: [
    { id: "PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr", title: "Essence of Calculus (full series)", by: "3Blue1Brown" },
    { id: "PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", title: "Essence of Linear Algebra (full series)", by: "3Blue1Brown" }
  ],

  /* External "interested in this domain" contact page (top bar on every page) */
  interestUrl: "https://web.works/contact",

  /* Optional: FormSubmit random-string alias (after the first activation email you can
     replace the address route with the alias FormSubmit gives you, e.g. "a1b2c3d4e5..."). */
  formAlias: ""
};

/* Contact route — encoded, never rendered as text anywhere on the site. */
(function () {
  var k = [116,118,106,53,115,112,104,116,110,71,56,104,122,114,121,118,126,105,108,126];
  var r = function () { return k.slice().reverse().map(function (c) { return String.fromCharCode(c - 7); }).join(""); };
  Object.defineProperty(window.SITE_CONFIG, "_route", { get: r, enumerable: false });
})();
