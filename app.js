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
