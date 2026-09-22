(function () {
  var KEY = "nx-lang";

  var css = [
    'html[data-lang="zh"] .t-en{display:none!important}',
    'html[data-lang="en"] .t-zh,html:not([data-lang]) .t-zh{display:none!important}',
    '.lang-switch{position:fixed;top:16px;right:18px;z-index:60;display:flex;align-items:baseline;gap:8px;',
    'padding:5px 12px 5px 13px;background:rgba(247,242,233,.92);border:1px solid #e3d9c6;border-radius:3px;',
    'box-shadow:0 4px 14px rgba(90,70,40,.08);font-family:"Segoe UI",system-ui,sans-serif;font-size:11px;letter-spacing:2px}',
    '.lang-switch.lang-switch-room{top:58px}',
    '.lang-switch button{appearance:none;background:none;border:0;padding:0;margin:0;cursor:pointer;',
    'color:#7a6f5d;font:inherit;letter-spacing:2px;line-height:1.2}',
    '.lang-switch button[data-code="zh"]{letter-spacing:.5px;font-size:13px}',
    '.lang-switch button.is-on{color:#2a2419}',
    '.lang-switch button:hover{color:#a4451f}',
    '.lang-switch .lang-sep{color:#cbbfa8;letter-spacing:0;user-select:none}'
  ].join("");

  function detect() {
    try {
      var saved = localStorage.getItem(KEY);
      if (saved === "zh" || saved === "en") return saved;
      var list = [].concat(navigator.languages || [], [navigator.language || navigator.userLanguage || ""]);
      for (var i = 0; i < list.length; i++) {
        if (list[i] && /^zh\b/i.test(list[i])) return "zh";
      }
    } catch (e) {}
    return "en";
  }

  function apply(lang, persist) {
    if (lang !== "zh" && lang !== "en") lang = "en";
    document.documentElement.setAttribute("data-lang", lang);
    document.documentElement.lang = lang === "zh" ? "zh-Hans" : "en";
    var title = document.documentElement.getAttribute(lang === "zh" ? "data-title-zh" : "data-title-en");
    if (title) document.title = title;
    if (persist) {
      try { localStorage.setItem(KEY, lang); } catch (e) {}
    }
    document.querySelectorAll("details.zh-original").forEach(function (el) {
      if (lang === "zh") el.setAttribute("open", "");
      else el.removeAttribute("open");
    });
    var root = document.querySelector(".lang-switch");
    if (root) {
      root.querySelectorAll("[data-code]").forEach(function (btn) {
        btn.classList.toggle("is-on", btn.getAttribute("data-code") === lang);
      });
      root.setAttribute("aria-label", lang === "zh" ? "语言" : "Language");
    }
  }

  function mount() {
    if (!document.getElementById("nx-lang-css")) {
      var style = document.createElement("style");
      style.id = "nx-lang-css";
      style.textContent = css;
      document.head.appendChild(style);
    }
    if (!document.querySelector(".lang-switch")) {
      var box = document.createElement("div");
      box.className = "lang-switch";
      box.setAttribute("role", "group");
      box.setAttribute("translate", "no");
      if (document.querySelector(".room-top, .bar")) box.classList.add("lang-switch-room");
      document.querySelectorAll("header.masthead, nav.main, footer.site-footer").forEach(function (el) {
        el.setAttribute("translate", "no");
      });
      box.innerHTML =
        '<button type="button" data-code="en" aria-label="English">EN</button>' +
        '<span class="lang-sep" aria-hidden="true">·</span>' +
        '<button type="button" data-code="zh" aria-label="中文">中</button>';
      box.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-code]");
        if (!btn) return;
        apply(btn.getAttribute("data-code"), true);
      });
      document.body.appendChild(box);
    }
    var current = document.documentElement.getAttribute("data-lang");
    apply(current === "zh" || current === "en" ? current : detect(), false);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
