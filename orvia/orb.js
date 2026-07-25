/*
 * The thinking orb.
 *
 * Three modes from Thinking Orbs by Jakub Antalik — "composing" (a ribbon of
 * strands undulating around a great circle, the default here), "thinking"
 * (particles on tilted orbits) and "breathing" (a dot sphere on two waves).
 * https://orbs.jakubantalik.com — https://github.com/Jakubantalik/thinking-orbs
 * MIT licensed; the full licence sits next to this file in
 * LICENSE-thinking-orbs.txt.
 *
 * The original ships as a React component. This is the same engine ported to
 * plain browser JavaScript so the page needs no build step, with one change:
 * dots are painted in Orvia's ink colour at varying opacity instead of
 * greyscale, which composites to the same depth reading on our paper.
 */

(function (global) {
  "use strict";

  /** Deterministic hash in [0, 1). */
  function hashD(a, b) {
    var h = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
    return h - Math.floor(h);
  }

  /** Stable directions on a unit sphere (Fibonacci lattice). */
  function fibDir(i, n) {
    var golden = Math.PI * (3 - Math.sqrt(5));
    var y = 1 - (2 * (i + 0.5)) / n;
    var rad = Math.sqrt(1 - y * y);
    var a = i * golden;
    return [rad * Math.cos(a), y, rad * Math.sin(a)];
  }

  /** Spin + tilt + orthographic projection. */
  function makeProj(yaw, tilt, cx, cy, scale) {
    var st = Math.sin(tilt);
    var ct = Math.cos(tilt);
    var sy = Math.sin(yaw);
    var cyw = Math.cos(yaw);
    return function (x, y, z) {
      var x1 = x * cyw + z * sy;
      var z1 = -x * sy + z * cyw;
      var y1 = y * ct - z1 * st;
      var z2 = y * st + z1 * ct;
      return [cx + x1 * scale, cy - y1 * scale, z2];
    };
  }

  /* Dot radii were tuned against a 300pt frame; sub-linear scaling keeps
     small orbs legible. */
  function radiusScale(size, pow) {
    return Math.pow(size / 300, pow);
  }

  /* Painter's algorithm: far to near. `white` is an ink value where 0 is the
     darkest ink, so opacity is 1 - white. */
  function paint(ctx, dots, ink, rMin) {
    dots.sort(function (a, b) {
      return a.z - b.z;
    });
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i];
      var w = Math.min(1, Math.max(0, d.white));
      var alpha = (d.a == null ? 1 : d.a) * (1 - w);
      if (alpha < 0.02) continue;
      ctx.fillStyle = "rgba(" + ink + "," + alpha.toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(d.x, d.y, Math.max(rMin, d.r), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* Composing: a sash of parallel strands rides a great circle, undulating on
     two traveling waves, over a faint sphere of ghost dots. The tuned preset
     freezes the 3D tumble (spin 0) so only the undulation moves. */
  function drawRibbon(ctx, size, t, ink, o) {
    var cx = size / 2;
    var cy = size / 2;
    var R = (size / 2) * 0.78;
    var spin = o.spin;
    var pt = makeProj(t * 0.1 * spin, 0.3, cx, cy, 1);
    var rs = radiusScale(size, o.rsPow);
    var dots = [];
    var i, d, p, depth;

    for (i = 0; i < o.ghostN; i++) {
      d = fibDir(i, o.ghostN);
      p = pt(d[0] * R, d[1] * R, d[2] * R);
      depth = (p[2] / R + 1) / 2;
      dots.push({ x: p[0], y: p[1], z: p[2], r: 0.8 * rs, white: 0.78, a: 0.1 + 0.22 * depth });
    }

    // the band plane, precessing (frozen when spin is 0)
    var ya = t * 0.24 * spin;
    var ta = 0.55 + 0.3 * Math.sin(t * 0.18) * spin;
    var ux = Math.cos(ya);
    var uy = 0;
    var uz = Math.sin(ya);
    var vx = -uz * Math.sin(ta);
    var vy = Math.cos(ta);
    var vz = ux * Math.sin(ta);
    var nx = uy * vz - uz * vy;
    var ny = uz * vx - ux * vz;
    var nz = ux * vy - uy * vx;

    var lanes = Math.max(1, Math.round(o.lanes * o.bandMul));
    for (var w = 0; w < lanes; w++) {
      var laneOff = (w - (lanes - 1) / 2) * 0.075;
      var edge = Math.abs(w - (lanes - 1) / 2) / Math.max(1, (lanes - 1) / 2);
      for (var k = 0; k < o.segs; k++) {
        var a = (k / o.segs) * 2 * Math.PI;
        var wob =
          (0.16 * Math.sin(a * 3 - t * 1.7 + w * 0.22) + 0.07 * Math.sin(a * 5 + t * 1.1)) * o.wobMul;
        var off = laneOff + wob;
        var x = ux * Math.cos(a) + vx * Math.sin(a) + nx * off;
        var y = uy * Math.cos(a) + vy * Math.sin(a) + ny * off;
        var z = uz * Math.cos(a) + vz * Math.sin(a) + nz * off;
        var l = Math.sqrt(x * x + y * y + z * z);
        p = pt((x / l) * R, (y / l) * R, (z / l) * R);
        depth = (p[2] / R + 1) / 2;
        dots.push({
          x: p[0],
          y: p[1],
          z: p[2],
          r: (o.rBase + o.rDepth * depth) * (1 - 0.25 * edge) * rs,
          white: 0.52 - 0.44 * depth + 0.18 * edge,
          a: 0.4 + 0.6 * depth
        });
      }
    }
    paint(ctx, dots, ink, o.rMin);
  }

  /* Thinking: particles running tilted orbits, each orbit drawn as a faint
     ghost path. No nucleus — just the paths and the work being done. */
  function drawOrbits(ctx, size, t, ink, o) {
    var cx = size / 2;
    var cy = size / 2;
    var R = (size / 2) * 0.82;
    var pt = makeProj(t * 0.12, 0.3, cx, cy, 1);
    var rs = radiusScale(size, o.rsPow);
    var dots = [];

    for (var orb = 0; orb < o.orbitN; orb++) {
      var h1 = hashD(orb, 1.7);
      var h2 = hashD(orb, 5.2);
      var h3 = hashD(orb, 8.9);
      var ro = R * (0.45 + 0.52 * h1);
      var th = h1 * 2 * Math.PI;
      var phi = Math.acos(2 * h2 - 1);

      // orbit plane basis (u, v perpendicular to the plane normal n)
      var nx = Math.sin(phi) * Math.cos(th);
      var ny = Math.cos(phi);
      var nz = Math.sin(phi) * Math.sin(th);
      var ux = -ny;
      var uy = nx;
      var uz = 0;
      var ul = Math.max(1e-6, Math.sqrt(ux * ux + uy * uy));
      ux /= ul;
      uy /= ul;
      var vx = ny * uz - nz * uy;
      var vy = nz * ux - nx * uz;
      var vz = nx * uy - ny * ux;
      var speed = (0.25 + 0.55 * h3) * (h3 > 0.5 ? 1 : -1);
      var k, a, p, depth;

      for (k = 0; k < o.ghostN; k++) {
        a = (k / o.ghostN) * 2 * Math.PI;
        p = pt(
          (ux * Math.cos(a) + vx * Math.sin(a)) * ro,
          (uy * Math.cos(a) + vy * Math.sin(a)) * ro,
          (uz * Math.cos(a) + vz * Math.sin(a)) * ro
        );
        depth = (p[2] / ro + 1) / 2;
        dots.push({
          x: p[0],
          y: p[1],
          z: p[2],
          r: o.ghostR * rs,
          white: 0.72,
          a: o.ghostA * (0.4 + 0.6 * depth)
        });
      }

      for (var m = 0; m < o.particles; m++) {
        a = t * speed + (m / o.particles) * 2 * Math.PI + h2 * 6;
        p = pt(
          (ux * Math.cos(a) + vx * Math.sin(a)) * ro,
          (uy * Math.cos(a) + vy * Math.sin(a)) * ro,
          (uz * Math.cos(a) + vz * Math.sin(a)) * ro
        );
        depth = (p[2] / ro + 1) / 2;
        dots.push({
          x: p[0],
          y: p[1],
          z: p[2],
          r: (o.partR + o.partRDepth * depth) * rs,
          white: 0.3 - 0.22 * depth
        });
      }
    }
    paint(ctx, dots, ink, o.rMin);
  }

  /* Breathing: a lat/long dot field on a sphere whose radius undulates on two
     waves of different tempi, so it never quite repeats. */
  function drawWave(ctx, size, t, ink, o) {
    var cx = size / 2;
    var cy = size / 2;
    var R = (size / 2) * 0.874;
    var pt = makeProj(t * 0.18, 0.38, cx, cy, 1);
    var rs = radiusScale(size, o.rsPow);

    var dots = [];
    for (var ri = 0; ri <= o.rings; ri++) {
      var lat = -Math.PI / 2 + (ri / o.rings) * Math.PI;
      var cosLat = Math.cos(lat);
      var sinLat = Math.sin(lat);
      var w = 0.62 * Math.sin(t * 2.1 - ri * 0.52) + 0.38 * Math.sin(t * 1.27 + ri * 0.83);
      var rr = R * (0.88 + 0.105 * w);
      var lonCount = Math.max(1, Math.round(Math.abs(cosLat) * o.lonDensity));
      for (var lj = 0; lj < lonCount; lj++) {
        var lon = (lj / lonCount) * 2 * Math.PI;
        var p = pt(cosLat * Math.cos(lon) * rr, sinLat * rr, cosLat * Math.sin(lon) * rr);
        var depth = (p[2] / R + 1) / 2;
        var crest = Math.max(0, w);
        dots.push({
          x: p[0],
          y: p[1],
          z: p[2],
          r: (o.rBase + o.rDepth * depth) * (1 + 0.4 * crest) * rs,
          white: 0.66 - 0.56 * depth - 0.1 * crest
        });
      }
    }
    paint(ctx, dots, ink, o.rMin);
  }

  /* Counts are the package's own profiles, opened up for a mark this large:
     more ghost dots per orbit than a 64px spinner needs. */
  var MODES = {
    composing: {
      draw: drawRibbon,
      /* The package's own `composing` numbers at 64px, with the strand and
         ghost counts opened up for a mark five times that size. */
      opts: {
        lanes: 3,
        bandMul: 3.9,
        segs: 150,
        ghostN: 420,
        wobMul: 1,
        spin: 0,
        rBase: 0.935,
        rDepth: 1.445,
        rsPow: 0.6,
        rMin: 0.3
      },
      speed: 2.34,
      /* Strand dots want to stay close together as the orb shrinks, so their
         count falls slower than the size; the ghost sphere behind the band
         wants to thin out faster, or it turns into a grey smudge. */
      tune: function (opts, size) {
        var k = size / 340;
        opts.segs = Math.max(44, Math.round(opts.segs * Math.pow(k, 0.75)));
        opts.ghostN = Math.max(40, Math.round(opts.ghostN * Math.pow(k, 1.5)));
        return opts;
      }
    },
    thinking: {
      draw: drawOrbits,
      opts: {
        orbitN: 12,
        ghostN: 210,
        ghostR: 1,
        ghostA: 0.8,
        particles: 5,
        partR: 1.5,
        partRDepth: 2,
        rsPow: 0.6,
        rMin: 0.3
      },
      speed: 1.885,
      /* Ghost dots are spaced along a path, so a smaller orb needs fewer of
         them to read as a continuous line — and paints far fewer circles. */
      tune: function (opts, size) {
        opts.ghostN = Math.max(70, Math.round(opts.ghostN * (size / 340)));
        return opts;
      }
    },
    breathing: {
      draw: drawWave,
      opts: {
        rings: 15,
        lonDensity: 40,
        rBase: 0.6,
        rDepth: 1.7,
        rsPow: 0.6,
        rMin: 0.3
      },
      speed: 1.45
    }
  };

  /**
   * Mount the orb on a canvas. `options.mode` picks "composing" (default),
   * "thinking" or "breathing"; anything else in `options` overrides that
   * mode's numbers.
   * Re-reads its own CSS box on resize, pauses on hidden tabs, and draws a
   * single still frame when the visitor asks for reduced motion.
   */
  global.mountOrb = function (canvas, options) {
    var settings = options || {};
    var mode = MODES[settings.mode] || MODES.composing;
    var base = Object.assign({}, mode.opts, { speed: mode.speed }, settings);
    var draw = mode.draw;
    var o = base;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var still = matchMedia("(prefers-reduced-motion: reduce)");
    var size = 0;

    function readInk() {
      return getComputedStyle(canvas).getPropertyValue("--orb-ink").trim() || "11,18,32";
    }
    var ink = readInk();

    function resize() {
      var box = canvas.getBoundingClientRect();
      size = Math.round(Math.min(box.width, box.height));
      if (!size) return false;
      var dpr = Math.min(2, global.devicePixelRatio || 1);
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      o = mode.tune ? mode.tune(Object.assign({}, base), size) : base;
      return true;
    }

    function frame(seconds) {
      if (!size) return;
      ctx.clearRect(0, 0, size, size);
      draw(ctx, size, seconds, ink, o);
    }

    var raf = 0;
    var running = false;

    function loop() {
      frame((performance.now() / 1000) * o.speed);
      if (running) raf = requestAnimationFrame(loop);
    }
    function start() {
      if (running || still.matches) return;
      running = true;
      raf = requestAnimationFrame(loop);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    function reset() {
      if (!resize()) return;
      ink = readInk();
      if (still.matches) {
        stop();
        frame(0.6);
      } else {
        frame((performance.now() / 1000) * o.speed);
        start();
      }
    }

    reset();

    var pending = 0;
    global.addEventListener(
      "resize",
      function () {
        clearTimeout(pending);
        pending = setTimeout(reset, 120);
      },
      { passive: true }
    );

    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") stop();
      else start();
    });

    still.addEventListener("change", reset);
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
      // let the stylesheet swap --orb-ink first
      setTimeout(reset, 0);
    });

    if (document.fonts && document.fonts.ready) document.fonts.ready.then(reset);
  };
})(window);
