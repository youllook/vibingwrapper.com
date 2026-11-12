// Google Analytics 4 for vibingwrapper.com — see TRACKING.md for the event list.
// Leave GA_ID empty to turn tracking off (nothing is loaded, no cookies).
(function () {
  var GA_ID = "G-Z2ST7Z1WKJ";
  var host = location.hostname;
  // only the real site reports; local previews (localhost / file://) stay silent
  if (!GA_ID || !/(^|\.)vibingwrapper\.com$/.test(host)) { window.vwTrack = function () {}; return; }

  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag("js", new Date());
  gtag("config", GA_ID);

  window.vwTrack = function (name, params) { gtag("event", name, params || {}); };

  // where on the page a click happened: nav / hero / <section id> / final / footer
  function place(el) {
    var box = el.closest("nav, header, section, footer");
    if (!box) return "other";
    if (box.tagName === "NAV") return "nav";
    if (box.tagName === "HEADER") return "hero";
    if (box.tagName === "FOOTER") return "footer";
    return box.id || (box.classList.contains("final") ? "final" : "section");
  }
  function lang() { return document.documentElement.lang === "zh-Hant" ? "zh" : "en"; }

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    var href = a.href, where = place(a);
    if (/github\.com\/youllook\/VibingWrapper\/releases\/latest/.test(href)) {
      vwTrack("download_click", { link_location: where, page_lang: lang() });
    } else if (/github\.com\/youllook\/VibingWrapper\/issues/.test(href)) {
      vwTrack("feedback_click", { link_location: where });
    } else if (/github\.com/.test(href)) {
      vwTrack("github_click", { link_location: where, link_url: href });
    } else if (/youtube\.com|threads\.(com|net)/.test(href)) {
      vwTrack("social_click", { link_location: where, link_url: href });
    }
  }, true);

  // how far people read: first time each section scrolls into view
  if ("IntersectionObserver" in window) {
    var seen = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var id = en.target.id;
        if (en.isIntersecting && !seen[id]) { seen[id] = 1; vwTrack("section_view", { section_id: id }); io.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    document.addEventListener("DOMContentLoaded", function () {
      document.querySelectorAll("section[id]").forEach(function (sec) { io.observe(sec); });
    });
  }
})();
