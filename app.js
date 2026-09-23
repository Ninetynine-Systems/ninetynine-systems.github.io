document.documentElement.classList.add("has-js");

(function initHeader() {
  var header = document.getElementById("site-header");
  var sentinel = document.getElementById("scroll-sentinel");
  if (!header || !sentinel || !("IntersectionObserver" in window)) return;

  var observer = new IntersectionObserver(function (entries) {
    header.classList.toggle("is-scrolled", !entries[0].isIntersecting);
  });

  observer.observe(sentinel);
})();
