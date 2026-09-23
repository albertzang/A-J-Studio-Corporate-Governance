// Read-only document: JavaScript is used only for navigation and browsing aids
// (mobile menu, active-section highlighting, back-to-top). No data or state is
// created, changed, or persisted.
(function () {
  "use strict";

  var sidebar = document.getElementById("sidebar");
  var navToggle = document.querySelector(".nav-toggle");
  var tocLinks = Array.prototype.slice.call(
    document.querySelectorAll(".toc-list a"),
  );
  var sections = tocLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);
  var backToTop = document.querySelector(".back-to-top");

  // Mobile sidebar toggle.
  function setSidebar(open) {
    if (!sidebar || !navToggle) return;
    sidebar.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      setSidebar(!sidebar.classList.contains("is-open"));
    });
  }

  // Close the mobile sidebar after following a link.
  tocLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.matchMedia("(max-width: 860px)").matches) {
        setSidebar(false);
      }
    });
  });

  // Highlight the contents entry for the heading at the reading line.
  // Targets are walked in document order, so a visible subsection wins over
  // its parent section. Headings deeper than the contents list are ignored.
  function readingOffset() {
    var header = document.querySelector(".masthead");
    return (header ? header.offsetHeight : 60) + 24;
  }

  function updateActive() {
    var line = window.scrollY + readingOffset();
    var current = null;
    sections.forEach(function (section) {
      var top = section.getBoundingClientRect().top + window.scrollY;
      if (top <= line) current = section.id;
    });
    tocLinks.forEach(function (link) {
      link.classList.toggle(
        "is-active",
        current !== null && link.getAttribute("href") === "#" + current,
      );
    });
  }

  if (sections.length) {
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    updateActive();
  }

  // Back-to-top visibility and action.
  if (backToTop) {
    var onScroll = function () {
      backToTop.hidden = window.scrollY < 400;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Keep the footer year current.
  var yearEl = document.querySelector("[data-current-year]");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
