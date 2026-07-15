document.documentElement.classList.add("has-js");

// A fixed dark navigation bar keeps one stable frame of reference across the
// dark opening and the editorial body.
(function initNavigation() {
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

// Section motion is deliberately brief and one-way. Without JavaScript every
// section remains visible, and reduced-motion users see the final state.
(function initReveals() {
  var elements = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (!elements.length) return;

  if (!("IntersectionObserver" in window)) {
    elements.forEach(function (element) {
      element.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, {
    rootMargin: "0px 0px -8% 0px",
    threshold: 0.08
  });

  elements.forEach(function (element) {
    observer.observe(element);
  });
})();

// The 99 is the site's single spectacle: a restrained field that gives way
// under a pointer, then returns to its exact form. There are no decorative
// projectiles or perpetual collision effects; motion communicates control.
(function initParticleMark() {
  var canvas = document.getElementById("particle-99");
  var hero = document.getElementById("home");
  if (!canvas || !hero || !canvas.getContext) return;

  var context = canvas.getContext("2d", { alpha: true });
  if (!context) return;

  var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var finePointerQuery = window.matchMedia("(pointer: fine)");
  var particleGroups = [[], [], []];
  var particleCount = 0;
  var particleColors = ["rgb(242,239,231)", "rgb(147,174,184)", "rgb(223,118,80)"];
  var particleAlphas = [0.58, 0.7, 0.82];
  var width = 0;
  var height = 0;
  var dpr = 1;
  var pointerX = -10000;
  var pointerY = -10000;
  var pointerActive = false;
  var inView = true;
  var prepared = false;
  var running = false;
  var frame = 0;
  var lastDraw = 0;
  var resizeTimer = 0;

  var random = function (min, max) {
    return min + Math.random() * (max - min);
  };

  var setCanvasSize = function () {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(hero.clientWidth, 1);
    height = Math.max(hero.clientHeight, 1);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  var seed = function () {
    var sampledParticles = [];
    particleGroups = [[], [], []];
    particleCount = 0;

    var mobile = width <= 700;
    var fontSize = mobile ? Math.min(width * 0.64, 280) : Math.min(width * 0.39, 620);
    var sample = document.createElement("canvas");
    var sampleContext = sample.getContext("2d", { willReadFrequently: true });
    if (!sampleContext) return false;

    sample.width = Math.max(Math.round(fontSize * 1.28), 1);
    sample.height = Math.max(Math.round(fontSize * 1.02), 1);
    sampleContext.clearRect(0, 0, sample.width, sample.height);
    sampleContext.fillStyle = "#ffffff";
    sampleContext.font = "700 " + fontSize + "px \"Source Serif 4 Variable\", \"Source Serif 4\", Georgia, serif";
    sampleContext.textBaseline = "top";
    sampleContext.fillText("99", fontSize * 0.025, -fontSize * 0.035);

    var pixels;
    try {
      pixels = sampleContext.getImageData(0, 0, sample.width, sample.height).data;
    } catch (_error) {
      return false;
    }

    var step = Math.max(mobile ? 6 : 7, Math.round(fontSize / (mobile ? 70 : 96)));
    var visualStart = mobile ? 0 : width * 0.52;
    var offsetX = mobile
      ? (width - sample.width) * 0.5
      : visualStart + (width - visualStart - sample.width) * 0.5;
    var navHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-height")) || 70;
    var offsetY = mobile
      ? navHeight + 12
      : Math.max(92, (height - sample.height) * 0.44);
    var maxParticles = mobile ? 800 : 1700;

    for (var y = 0; y < sample.height; y += step) {
      for (var x = 0; x < sample.width; x += step) {
        if (pixels[(y * sample.width + x) * 4 + 3] < 150) continue;

        var colorRoll = Math.random();
        var colorIndex = colorRoll < 0.012 ? 2 : colorRoll < 0.075 ? 1 : 0;
        var homeX = offsetX + x + random(-1, 1);
        var homeY = offsetY + y + random(-1, 1);

        sampledParticles.push({
          homeX: homeX,
          homeY: homeY,
          x: homeX,
          y: homeY,
          velocityX: 0,
          velocityY: 0,
          radius: random(0.9, 1.8),
          colorIndex: colorIndex,
          phase: random(0, Math.PI * 2),
          speed: random(0.00035, 0.00065),
          amplitude: random(0.45, 1.3)
        });
      }
    }

    if (sampledParticles.length > maxParticles) {
      for (var index = sampledParticles.length - 1; index > 0; index -= 1) {
        var swapIndex = Math.floor(Math.random() * (index + 1));
        var current = sampledParticles[index];
        sampledParticles[index] = sampledParticles[swapIndex];
        sampledParticles[swapIndex] = current;
      }
      sampledParticles.length = maxParticles;
    }

    sampledParticles.forEach(function (particle) {
      particleGroups[particle.colorIndex].push(particle);
    });
    particleCount = sampledParticles.length;
    prepared = particleCount > 0;
    return prepared;
  };

  var draw = function (time) {
    var targetFps = finePointerQuery.matches && pointerActive ? 36 : width > 700 ? 12 : 10;
    var frameInterval = 1000 / targetFps;
    if (lastDraw && time - lastDraw < frameInterval) return;
    lastDraw = time;

    context.clearRect(0, 0, width, height);

    var radius = width <= 700 ? 72 : 104;
    var radiusSquared = radius * radius;
    var canRepel = finePointerQuery.matches && pointerActive;

    for (var groupIndex = 0; groupIndex < particleGroups.length; groupIndex += 1) {
      var group = particleGroups[groupIndex];
      context.globalAlpha = particleAlphas[groupIndex] * (width <= 700 ? 0.8 : 1);
      context.fillStyle = particleColors[groupIndex];

      for (var index = 0; index < group.length; index += 1) {
        var particle = group[index];
        var drift = Math.sin(time * particle.speed + particle.phase) * particle.amplitude;
        var homeX = particle.homeX + drift;
        var homeY = particle.homeY + Math.cos(time * particle.speed * 0.83 + particle.phase) * particle.amplitude * 0.45;

        if (canRepel) {
          var deltaX = particle.x - pointerX;
          var deltaY = particle.y - pointerY;
          var distanceSquared = deltaX * deltaX + deltaY * deltaY;

          if (distanceSquared < radiusSquared && distanceSquared > 0.01) {
            var distance = Math.sqrt(distanceSquared);
            var force = (radius - distance) / radius * 2.7;
            particle.velocityX += deltaX / distance * force;
            particle.velocityY += deltaY / distance * force;
          }
        }

        particle.velocityX += (homeX - particle.x) * 0.045;
        particle.velocityY += (homeY - particle.y) * 0.045;
        particle.velocityX *= 0.84;
        particle.velocityY *= 0.84;
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;

        context.fillRect(
          particle.x - particle.radius,
          particle.y - particle.radius,
          particle.radius * 2,
          particle.radius * 2
        );
      }
    }

    context.globalAlpha = 1;
  };

  var loop = function (time) {
    frame = 0;
    draw(time);
    if (running) frame = window.requestAnimationFrame(loop);
  };

  var shouldRun = function () {
    return prepared && inView && !document.hidden && !motionQuery.matches;
  };

  var start = function () {
    if (running || !shouldRun()) return;
    running = true;
    lastDraw = 0;
    frame = window.requestAnimationFrame(loop);
  };

  var stop = function () {
    running = false;
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
  };

  var showParticles = function () {
    if (!prepared || motionQuery.matches) return;
    hero.classList.add("has-particles");
    canvas.classList.add("is-ready");
  };

  var showFallback = function () {
    hero.classList.remove("has-particles");
    canvas.classList.remove("is-ready");
    context.clearRect(0, 0, width, height);
  };

  var prepare = function () {
    if (motionQuery.matches) {
      showFallback();
      return;
    }
    setCanvasSize();
    if (!seed()) {
      showFallback();
      return;
    }
    showParticles();
    start();
  };

  hero.addEventListener("pointermove", function (event) {
    if (!finePointerQuery.matches) return;
    var bounds = hero.getBoundingClientRect();
    pointerX = event.clientX - bounds.left;
    pointerY = event.clientY - bounds.top;
    pointerActive = true;
  }, { passive: true });

  hero.addEventListener("pointerleave", function () {
    pointerActive = false;
    pointerX = -10000;
    pointerY = -10000;
  }, { passive: true });

  window.addEventListener("resize", function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      stop();
      prepared = false;
      prepare();
    }, 180);
  }, { passive: true });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop();
    else start();
  });

  var handleMotionChange = function () {
    if (motionQuery.matches) {
      stop();
      showFallback();
      return;
    }
    prepared = false;
    prepare();
  };

  if (motionQuery.addEventListener) {
    motionQuery.addEventListener("change", handleMotionChange);
  } else if (motionQuery.addListener) {
    motionQuery.addListener(handleMotionChange);
  }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      inView = Boolean(entries[0] && entries[0].isIntersecting);
      if (inView) start();
      else stop();
    }, { threshold: 0.01 }).observe(hero);
  }

  var fontsReady = document.fonts && document.fonts.ready
    ? document.fonts.ready
    : Promise.resolve();

  var schedulePrepare = function () {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(prepare, { timeout: 1800 });
    } else {
      window.setTimeout(prepare, 120);
    }
  };

  fontsReady.then(schedulePrepare, schedulePrepare);
})();
