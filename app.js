document.documentElement.classList.add("has-js");

(function initHeader() {
  var header = document.getElementById("site-header");
  if (!header) return;

  var update = function () {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
})();
