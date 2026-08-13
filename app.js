document.documentElement.classList.add("has-js");

// Hairline under the sticky header once you have scrolled.
(function initNav() {
  var nav = document.getElementById("site-nav");
  if (!nav) return;

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
})();

// Rows fade in as they enter the viewport. Skipped entirely under reduced
// motion; without JavaScript the page renders fully visible.
(function initReveal() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!("IntersectionObserver" in window)) return;

  var targets = document.querySelectorAll(".reveal");
  if (!targets.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });

  targets.forEach(function (target) { observer.observe(target); });
})();
