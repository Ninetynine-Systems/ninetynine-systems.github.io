document.documentElement.classList.add("has-js");

// The only script on the page. It draws a hairline under the fixed header once
// you have scrolled, and marks which nav link matches the section you are in.
// Everything else on the page works with JavaScript off.
(function initNavigation() {
  var nav = document.getElementById("site-nav");
  if (!nav) return;

  var navLinks = Array.prototype.slice.call(nav.querySelectorAll('.app-nav a[href^="#"]'));
  var queued = false;

  var update = function () {
    nav.classList.toggle("is-scrolled", window.scrollY > 12);
    queued = false;
  };

  var requestUpdate = function () {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(update);
  };

  requestUpdate();
  window.addEventListener("scroll", requestUpdate, { passive: true });

  if (!("IntersectionObserver" in window) || !navLinks.length) return;

  var sections = navLinks.map(function (link) {
    return document.querySelector(link.getAttribute("href"));
  }).filter(Boolean);

  var setActive = function (id) {
    navLinks.forEach(function (link) {
      var active = link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };

  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, {
    rootMargin: "-30% 0px -60% 0px",
    threshold: 0
  });

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });
})();
