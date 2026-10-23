/* =========================================================
   الرسم — رسومات أصلية مرسومة بالكود بطابع ألعاب المنصات الكلاسيكية
   (لا تُستخدم أي رسومات من ألعاب أخرى)
   ========================================================= */
(function () {
  "use strict";
  var T = 32;
  var THEMES = [
    // الوحدة الأولى: حديقة خضراء (تنوع الحياة)
    { sky: ["#5fb8ff", "#c9ecff"], hillFar: "#8fdc78", hillNear: "#45b552", groundTop: "#4cc04a", dirt: "#c8763a", dirtDark: "#9a5526", cloud: "#ffffff" },
    // الوحدة الثانية: جبال وشلال وبحيرة (الأنظمة البيئية)
    { sky: ["#4aa8f0", "#d6f1ff"], hillFar: "#7d93b8", hillNear: "#2f8f4e", groundTop: "#5cc85a", dirt: "#8a5a3a", dirtDark: "#5f3c25", cloud: "#ffffff" },
    // الوحدة الثالثة: صحراء وبركان وطاقة (الأرض ومواردها)
    { sky: ["#f6a35b", "#ffe9b8"], hillFar: "#c98a55", hillNear: "#e2b067", groundTop: "#ecc56c", dirt: "#d08a45", dirtDark: "#a1652c", cloud: "#fff6ea" }
  ];

  function mk(w, h, fn) { var c = document.createElement("canvas"); c.width = w; c.height = h; fn(c.getContext("2d"), w, h); return c; }
  function rr(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }

  var cache = {};
  function tilesFor(themeIdx) {
    if (cache[themeIdx]) return cache[themeIdx];
    var th = THEMES[themeIdx];
    var S = {};
    S.groundTop = mk(T, T, function (g) {
      g.fillStyle = th.dirt; g.fillRect(0, 0, T, T);
      g.fillStyle = th.dirtDark; [[5, 14], [20, 20], [12, 26], [26, 10]].forEach(function (p) { g.fillRect(p[0], p[1], 4, 3); });
      g.fillStyle = th.groundTop; g.fillRect(0, 0, T, 9);
      g.fillStyle = "rgba(255,255,255,.35)"; g.fillRect(0, 0, T, 3);
      g.fillStyle = th.groundTop; for (var i = 0; i < T; i += 6) g.fillRect(i, 9, 4, 3);
    });
    S.ground = mk(T, T, function (g) {
      g.fillStyle = th.dirt; g.fillRect(0, 0, T, T);
      g.fillStyle = th.dirtDark; [[4, 6], [18, 3], [24, 18], [9, 22], [14, 13]].forEach(function (p) { g.fillRect(p[0], p[1], 4, 3); });
    });
    S.brick = mk(T, T, function (g) {
      g.fillStyle = "#c4532b"; g.fillRect(0, 0, T, T);
      g.fillStyle = "#7a2a12";
      g.fillRect(0, 0, T, 2); g.fillRect(0, 15, T, 2); g.fillRect(0, 30, T, 2);
      g.fillRect(15, 0, 2, 15); g.fillRect(7, 15, 2, 15); g.fillRect(23, 15, 2, 15);
      g.fillStyle = "rgba(255,255,255,.25)"; g.fillRect(2, 2, 12, 2); g.fillRect(18, 2, 12, 2); g.fillRect(10, 17, 12, 2);
    });
    S.qb = mk(T, T, function (g) {
      rr(g, 1, 1, T - 2, T - 2, 5); g.fillStyle = "#ffbf1f"; g.fill();
      g.lineWidth = 2; g.strokeStyle = "#a25e00"; g.stroke();
      g.fillStyle = "#a25e00"; [[4, 4], [T - 7, 4], [4, T - 7], [T - 7, T - 7]].forEach(function (p) { g.fillRect(p[0], p[1], 3, 3); });
      g.fillStyle = "#fff6c8"; g.font = "900 22px Cairo, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
      g.fillText("؟", T / 2, T / 2 + 1);
    });
    S.used = mk(T, T, function (g) {
      rr(g, 1, 1, T - 2, T - 2, 5); g.fillStyle = "#9b6b43"; g.fill(); g.strokeStyle = "#5c3a1f"; g.lineWidth = 2; g.stroke();
      g.fillStyle = "#5c3a1f"; [[4, 4], [T - 7, 4], [4, T - 7], [T - 7, T - 7]].forEach(function (p) { g.fillRect(p[0], p[1], 3, 3); });
    });
    S.stone = mk(T, T, function (g) {
      g.fillStyle = "#8d8fa6"; g.fillRect(0, 0, T, T);
      g.fillStyle = "#b9bbd0"; g.fillRect(0, 0, T, 4); g.fillRect(0, 0, 4, T);
      g.fillStyle = "#5c5e75"; g.fillRect(0, T - 4, T, 4); g.fillRect(T - 4, 0, 4, T);
    });
    function pipe(top, left) {
      return mk(T, T, function (g) {
        var x0 = left ? 0 : 0;
        var grad = g.createLinearGradient(left ? 2 : -T, 0, left ? 2 + 2 * T : T, 0);
        grad.addColorStop(0, "#2a8f3a"); grad.addColorStop(0.3, "#7ee07e"); grad.addColorStop(0.6, "#33a845"); grad.addColorStop(1, "#1d6a2a");
        g.fillStyle = grad;
        if (top) { g.fillRect(left ? 0 : 0, 2, T, T - 2); g.fillStyle = "#14501f"; g.fillRect(0, 0, T, 2); g.fillRect(0, T - 2, T, 2); if (left) g.fillRect(0, 0, 2, T); else g.fillRect(T - 2, 0, 2, T); }
        else { if (left) g.fillRect(3, 0, T - 3, T); else g.fillRect(0, 0, T - 3, T); g.fillStyle = "#14501f"; if (left) g.fillRect(3, 0, 2, T); else g.fillRect(T - 5, 0, 2, T); }
      });
    }
    S.ptl = pipe(true, true); S.ptr = pipe(true, false); S.pbl = pipe(false, true); S.pbr = pipe(false, false);
    S.spike = mk(T, T, function (g) { // شجيرة شوكية
      g.fillStyle = "#2f7d32";
      g.beginPath(); g.ellipse(T / 2, T - 9, 14, 9, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#e9f7d8";
      for (var i = 0; i < 7; i++) { var a = Math.PI + i * Math.PI / 6; var cx = T / 2 + Math.cos(a) * 13, cy = T - 9 + Math.sin(a) * 9;
        g.beginPath(); g.moveTo(cx - 3, cy + 1); g.lineTo(cx + Math.cos(a) * 7, cy + Math.sin(a) * 7); g.lineTo(cx + 3, cy + 1); g.fill(); }
      g.fillStyle = "#ff4f6d"; g.beginPath(); g.arc(T / 2, T - 11, 3, 0, 7); g.fill();
    });
    cache[themeIdx] = S;
    return S;
  }

  function drawCloud(g, x, y, s, col) {
    g.fillStyle = col;
    g.beginPath();
    g.arc(x, y, 16 * s, 0, 7); g.arc(x + 20 * s, y - 10 * s, 20 * s, 0, 7); g.arc(x + 44 * s, y, 16 * s, 0, 7);
    g.rect(x, y - 2 * s, 44 * s, 18 * s); g.fill();
  }
  function drawHill(g, x, base, w, h, col) {
    g.fillStyle = col; g.beginPath(); g.moveTo(x, base); g.quadraticCurveTo(x + w / 2, base - h * 2, x + w, base); g.fill();
  }

  /* طبقة متكررة بإزاحة (parallax): fn(x, k) حيث k رقم ثابت لكل عنصر في العالم */
  function layer(vw, camX, factor, spacing, fn) {
    var off = camX * factor, first = Math.floor(off / spacing) - 1, n = Math.ceil(vw / spacing) + 3;
    for (var i = 0; i < n; i++) { var k = first + i; fn(k * spacing - off, k); }
  }
  function hash(k, s) { var x = Math.sin(k * 127.1 + (s || 0) * 311.7) * 43758.5453; return x - Math.floor(x); }

  function tree(g, x, base, h, col, dark) { // شجرة دائرية
    g.fillStyle = "#7a4a26"; g.fillRect(x - h * 0.06, base - h * 0.45, h * 0.12, h * 0.45);
    g.fillStyle = dark; g.beginPath(); g.arc(x + h * 0.06, base - h * 0.62, h * 0.3, 0, 7); g.fill();
    g.fillStyle = col; g.beginPath(); g.arc(x - h * 0.12, base - h * 0.66, h * 0.24, 0, 7); g.arc(x + h * 0.1, base - h * 0.78, h * 0.26, 0, 7); g.arc(x - h * 0.02, base - h * 0.52, h * 0.24, 0, 7); g.fill();
  }
  function pine(g, x, base, h, col) {
    g.fillStyle = "#5b3a1e"; g.fillRect(x - 3, base - h * 0.18, 6, h * 0.18);
    g.fillStyle = col;
    for (var j = 0; j < 3; j++) { var w = h * (0.42 - j * 0.1), y = base - h * 0.15 - j * h * 0.26; g.beginPath(); g.moveTo(x - w, y); g.lineTo(x, y - h * 0.42); g.lineTo(x + w, y); g.fill(); }
  }
  function flower(g, x, y, col) {
    g.fillStyle = "#2f8f3a"; g.fillRect(x - 1, y, 2, 10);
    g.fillStyle = col; for (var a = 0; a < 5; a++) { g.beginPath(); g.arc(x + Math.cos(a * 1.26) * 4, y + Math.sin(a * 1.26) * 4, 3, 0, 7); g.fill(); }
    g.fillStyle = "#ffd23a"; g.beginPath(); g.arc(x, y, 2.4, 0, 7); g.fill();
  }

  function drawBackground(g, vw, vh, camX, groundY, themeIdx, time) {
    var th = THEMES[themeIdx];
    var grad = g.createLinearGradient(0, 0, 0, groundY); grad.addColorStop(0, th.sky[0]); grad.addColorStop(1, th.sky[1]);
    g.fillStyle = grad; g.fillRect(0, 0, vw, vh);
    // الشمس
    g.fillStyle = themeIdx === 2 ? "rgba(255,248,210,.95)" : "rgba(255,250,215,.9)";
    g.beginPath(); g.arc(vw * (themeIdx === 2 ? 0.22 : 0.82), groundY * 0.2, 30, 0, 7); g.fill();
    // غيوم
    var drift = time * 8;
    layer(vw, camX + drift / 0.15, 0.15, 320, function (x, k) {
      drawCloud(g, x + hash(k, 1) * 120, groundY * (0.12 + hash(k, 2) * 0.22), 0.9 + hash(k, 3) * 0.5, th.cloud);
    });

    if (themeIdx === 0) {
      // ===== حديقة: تلال، أشجار، أزهار =====
      layer(vw, camX, 0.2, 280, function (x, k) { drawHill(g, x, groundY, 300, 70 + hash(k, 4) * 40, th.hillFar); });
      layer(vw, camX, 0.35, 170, function (x, k) {
        var h = 110 + hash(k, 5) * 60;
        tree(g, x + hash(k, 6) * 60, groundY, h, hash(k, 7) > 0.5 ? "#5cc35a" : "#4bb04f", "#2f8a3e");
      });
      layer(vw, camX, 0.5, 210, function (x, k) { drawHill(g, x, groundY, 170, 30 + hash(k, 8) * 14, th.hillNear); });
      layer(vw, camX, 0.6, 46, function (x, k) {
        if (hash(k, 9) > 0.55) flower(g, x, groundY - 14 - hash(k, 10) * 10, ["#ff6fa8", "#ffffff", "#ffb23a", "#b07cff"][Math.floor(hash(k, 11) * 4)]);
      });
    } else if (themeIdx === 1) {
      // ===== جبال مكسوة بالثلج، شلال، بحيرة، صنوبر =====
      layer(vw, camX, 0.12, 360, function (x, k) {
        var h = 190 + hash(k, 4) * 80, w = 420;
        g.fillStyle = th.hillFar; g.beginPath(); g.moveTo(x - 30, groundY); g.lineTo(x + w * 0.45, groundY - h); g.lineTo(x + w, groundY); g.fill();
        g.fillStyle = "#f4f8ff"; g.beginPath(); g.moveTo(x + w * 0.45, groundY - h); g.lineTo(x + w * 0.45 - h * 0.22, groundY - h * 0.75);
        g.lineTo(x + w * 0.4, groundY - h * 0.8); g.lineTo(x + w * 0.5, groundY - h * 0.72); g.lineTo(x + w * 0.45 + h * 0.2, groundY - h * 0.78); g.fill();
      });
      layer(vw, camX, 0.28, 900, function (x, k) { // جرف وشلال
        var cw = 260, ch = 200, cx = x + 300;
        g.fillStyle = "#6f7f73"; g.beginPath(); g.moveTo(cx - 40, groundY); g.lineTo(cx, groundY - ch); g.lineTo(cx + cw, groundY - ch - 20); g.lineTo(cx + cw + 50, groundY); g.fill();
        g.fillStyle = "#4f9a4a"; g.beginPath(); g.moveTo(cx - 6, groundY - ch - 6); g.quadraticCurveTo(cx + cw / 2, groundY - ch - 40, cx + cw + 6, groundY - ch - 24); g.lineTo(cx + cw, groundY - ch + 10); g.lineTo(cx, groundY - ch + 14); g.fill();
        var wx = cx + cw * 0.42, ww = 46;
        var wg = g.createLinearGradient(wx, 0, wx + ww, 0); wg.addColorStop(0, "#bfe9ff"); wg.addColorStop(0.5, "#ffffff"); wg.addColorStop(1, "#9fd9f7");
        g.fillStyle = wg; g.fillRect(wx, groundY - ch - 14, ww, ch + 14);
        g.fillStyle = "rgba(255,255,255,.75)";
        for (var s = 0; s < 6; s++) { var yy = ((time * 120 + s * 37) % (ch)) ; g.fillRect(wx + 6 + (s * 7) % (ww - 10), groundY - ch + yy, 3, 14); }
        g.beginPath(); for (var b = 0; b < 5; b++) g.arc(wx + b * 12, groundY - 6 + Math.sin(time * 6 + b) * 2, 9, 0, 7); g.fill();
      });
      // بحيرة
      var lake = g.createLinearGradient(0, groundY - 34, 0, groundY); lake.addColorStop(0, "#7fd0f5"); lake.addColorStop(1, "#3ea6dc");
      g.fillStyle = lake; g.fillRect(0, groundY - 30, vw, 30);
      g.fillStyle = "rgba(255,255,255,.55)";
      layer(vw, camX, 0.45, 90, function (x, k) { g.fillRect(x + hash(k, 3) * 40 + Math.sin(time * 1.5 + k) * 6, groundY - 22 + hash(k, 5) * 14, 22, 2); });
      layer(vw, camX, 0.5, 120, function (x, k) {
        if (hash(k, 6) > 0.35) pine(g, x + hash(k, 7) * 50, groundY - 26, 90 + hash(k, 8) * 50, hash(k, 9) > 0.5 ? "#2c7a45" : "#256b3c");
      });
    } else {
      // ===== صحراء: هضاب صخرية، بركان يتصاعد دخانه، توربينات رياح، كثبان =====
      layer(vw, camX, 0.1, 700, function (x, k) { // بركان
        var bx = x + 200, h = 230;
        g.fillStyle = "#a76a45"; g.beginPath(); g.moveTo(bx - 200, groundY); g.lineTo(bx - 34, groundY - h); g.lineTo(bx + 34, groundY - h); g.lineTo(bx + 220, groundY); g.fill();
        g.fillStyle = "#e0552a"; g.beginPath(); g.moveTo(bx - 34, groundY - h); g.lineTo(bx + 34, groundY - h); g.lineTo(bx + 20, groundY - h + 30); g.lineTo(bx + 4, groundY - h + 12); g.lineTo(bx - 14, groundY - h + 40); g.fill();
        for (var p = 0; p < 5; p++) {
          var t2 = (time * 0.35 + p / 5) % 1;
          g.fillStyle = "rgba(110,100,105," + (0.55 * (1 - t2)) + ")";
          g.beginPath(); g.arc(bx + Math.sin(t2 * 4 + p) * 14 + t2 * 30, groundY - h - 10 - t2 * 120, 14 + t2 * 26, 0, 7); g.fill();
        }
      });
      layer(vw, camX, 0.22, 380, function (x, k) { // هضبة صخرية
        var w = 140 + hash(k, 4) * 80, h = 90 + hash(k, 5) * 60, mx = x + hash(k, 6) * 120;
        g.fillStyle = th.hillFar; g.beginPath(); g.moveTo(mx, groundY); g.lineTo(mx + 18, groundY - h); g.lineTo(mx + w - 18, groundY - h); g.lineTo(mx + w, groundY); g.fill();
        g.fillStyle = "rgba(0,0,0,.12)"; g.fillRect(mx + 22, groundY - h + 20, w - 44, 6); g.fillRect(mx + 14, groundY - h + 50, w - 28, 5);
      });
      layer(vw, camX, 0.3, 520, function (x, k) { // توربين رياح (مصادر الطاقة)
        var tx = x + 120 + hash(k, 7) * 200, th2 = 150;
        g.fillStyle = "#f4f4f4"; g.beginPath(); g.moveTo(tx - 4, groundY); g.lineTo(tx - 2, groundY - th2); g.lineTo(tx + 2, groundY - th2); g.lineTo(tx + 4, groundY); g.fill();
        g.save(); g.translate(tx, groundY - th2); g.rotate(time * 1.6 + k);
        for (var bl = 0; bl < 3; bl++) { g.rotate(Math.PI * 2 / 3); g.beginPath(); g.ellipse(0, -30, 5, 30, 0, 0, 7); g.fill(); }
        g.restore(); g.fillStyle = "#d8d8d8"; g.beginPath(); g.arc(tx, groundY - th2, 5, 0, 7); g.fill();
      });
      layer(vw, camX, 0.5, 240, function (x, k) { // كثبان
        g.fillStyle = th.hillNear; g.beginPath(); g.moveTo(x - 20, groundY); g.quadraticCurveTo(x + 90, groundY - 50 - hash(k, 8) * 30, x + 260, groundY); g.fill();
        if (hash(k, 9) > 0.5) { // صبّار
          var sx = x + 120; g.fillStyle = "#4f9a4a"; g.fillRect(sx - 5, groundY - 46, 10, 46);
          g.fillRect(sx - 18, groundY - 32, 8, 18); g.fillRect(sx - 18, groundY - 22, 14, 6); g.fillRect(sx + 10, groundY - 38, 8, 16); g.fillRect(sx + 4, groundY - 28, 14, 6);
        }
      });
    }
  }

  function drawCoin(g, x, y, t) {
    var sx = Math.abs(Math.cos(t * 4 + x * 0.05));
    var w = 11 * Math.max(0.2, sx);
    g.fillStyle = "#c98a00"; g.beginPath(); g.ellipse(x, y, w + 1.5, 13.5, 0, 0, 7); g.fill();
    g.fillStyle = "#ffd23a"; g.beginPath(); g.ellipse(x, y, w, 12, 0, 0, 7); g.fill();
    if (sx > 0.45) { g.fillStyle = "#fff3a6"; g.font = "900 13px Cairo, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("★", x, y + 1); }
  }

  function drawGerm(g, e, t) { // ميكروب لطيف
    var x = e.x, y = e.y, w = e.w, h = e.h;
    if (!e.alive) { // مسطّح بعد الدهس
      g.fillStyle = "#8e5bd8"; g.beginPath(); g.ellipse(x + w / 2, y + h - 4, w / 2, 5, 0, 0, 7); g.fill(); return;
    }
    var bob = Math.sin(t * 10 + e.t) * 1.5;
    g.fillStyle = "#6c3fc0";
    for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4 + t; g.beginPath(); g.arc(x + w / 2 + Math.cos(a) * 15, y + h / 2 + bob + Math.sin(a) * 13, 3, 0, 7); g.fill(); }
    g.fillStyle = "#9b6af0"; g.beginPath(); g.ellipse(x + w / 2, y + h / 2 + bob, w / 2, h / 2, 0, 0, 7); g.fill();
    g.fillStyle = "#c9a8ff"; g.beginPath(); g.ellipse(x + w / 2 - 5, y + h / 2 - 5 + bob, 6, 4, -0.4, 0, 7); g.fill();
    var dir = e.vx < 0 ? -2 : 2;
    g.fillStyle = "#fff"; g.beginPath(); g.arc(x + w / 2 - 6, y + h / 2 + bob, 5, 0, 7); g.arc(x + w / 2 + 6, y + h / 2 + bob, 5, 0, 7); g.fill();
    g.fillStyle = "#1b1036"; g.beginPath(); g.arc(x + w / 2 - 6 + dir, y + h / 2 + bob + 1, 2.4, 0, 7); g.arc(x + w / 2 + 6 + dir, y + h / 2 + bob + 1, 2.4, 0, 7); g.fill();
    g.strokeStyle = "#1b1036"; g.lineWidth = 2; g.beginPath(); g.moveTo(x + w / 2 - 11, y + h / 2 - 7 + bob); g.lineTo(x + w / 2 - 3, y + h / 2 - 4 + bob); g.moveTo(x + w / 2 + 11, y + h / 2 - 7 + bob); g.lineTo(x + w / 2 + 3, y + h / 2 - 4 + bob); g.stroke();
  }

  function drawBee(g, e, t) {
    var x = e.x, y = e.y, w = e.w, h = e.h;
    if (!e.alive) return;
    var flap = Math.sin(t * 40) * 4;
    g.fillStyle = "rgba(220,240,255,.85)"; g.beginPath(); g.ellipse(x + 10, y + 2 - flap / 2, 7, 10 + flap / 2, -0.5, 0, 7); g.ellipse(x + 20, y + 2 - flap / 2, 7, 10 + flap / 2, 0.5, 0, 7); g.fill();
    g.fillStyle = "#ffcc1a"; g.beginPath(); g.ellipse(x + w / 2, y + h / 2 + 2, w / 2, h / 2 - 2, 0, 0, 7); g.fill();
    g.fillStyle = "#2a1a05"; g.fillRect(x + 9, y + 6, 4, h - 8); g.fillRect(x + 17, y + 6, 4, h - 8);
    g.fillStyle = "#fff"; g.beginPath(); g.arc(x + 4, y + h / 2, 4, 0, 7); g.fill();
    g.fillStyle = "#000"; g.beginPath(); g.arc(x + 3, y + h / 2 + 1, 2, 0, 7); g.fill();
  }

  function drawCheckpoint(g, c, groundPx, t) {
    var x = c.x;
    g.fillStyle = "#5a4a3a"; g.fillRect(x - 2, groundPx - 80, 4, 80);
    g.fillStyle = "#ffd23a"; g.beginPath(); g.arc(x, groundPx - 82, 5, 0, 7); g.fill();
    var wave = Math.sin(t * 6) * 3;
    g.fillStyle = c.active ? "#ffbf1f" : "#7b4fc9";
    g.beginPath(); g.moveTo(x + 2, groundPx - 78); g.lineTo(x + 34, groundPx - 70 + wave); g.lineTo(x + 2, groundPx - 58); g.fill();
    g.fillStyle = "#fff"; g.font = "700 10px Cairo, sans-serif"; g.textAlign = "center"; g.fillText(c.active ? "✓" : "حفظ", x + 15, groundPx - 66 + wave / 2);
  }

  function drawGoal(g, goal, groundPx, flagY, t) {
    var x = goal.x;
    g.fillStyle = "#e6e6e6"; g.fillRect(x - 3, goal.topY, 6, groundPx - goal.topY);
    g.fillStyle = "#3fae4a"; g.beginPath(); g.arc(x, goal.topY, 8, 0, 7); g.fill();
    g.fillStyle = "#7b4fc9"; g.beginPath(); g.moveTo(x - 3, flagY); g.lineTo(x - 46, flagY + 16 + Math.sin(t * 5) * 2); g.lineTo(x - 3, flagY + 32); g.fill();
    g.fillStyle = "#ffd23a"; g.font = "900 16px Cairo, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("★", x - 18, flagY + 16);
    g.fillStyle = "#5c5e75"; g.fillRect(x - 10, groundPx - 12, 20, 12);
  }

  function drawLab(g, x, groundPx) { // مختبر العلوم في نهاية المرحلة
    var w = 150, h = 110, y = groundPx - h;
    g.fillStyle = "#f3efe6"; g.fillRect(x, y, w, h);
    g.fillStyle = "#7b4fc9"; g.beginPath(); g.moveTo(x - 12, y); g.lineTo(x + w / 2, y - 46); g.lineTo(x + w + 12, y); g.fill();
    g.fillStyle = "#5b8def"; g.fillRect(x + 16, y + 22, 34, 30); g.fillRect(x + w - 50, y + 22, 34, 30);
    g.fillStyle = "#6b4226"; rr(g, x + w / 2 - 20, y + h - 56, 40, 56, 18); g.fill();
    // علامة الدورق
    g.fillStyle = "#ffd23a"; g.beginPath(); g.arc(x + w / 2, y - 18, 13, 0, 7); g.fill();
    g.fillStyle = "#3fae4a"; g.beginPath(); g.moveTo(x + w / 2 - 4, y - 28); g.lineTo(x + w / 2 + 4, y - 28); g.lineTo(x + w / 2 + 9, y - 10); g.lineTo(x + w / 2 - 9, y - 10); g.fill();
  }
  function drawBush(g, x, groundPx, col) {
    g.fillStyle = col; g.beginPath(); g.arc(x, groundPx - 10, 14, 0, 7); g.arc(x + 18, groundPx - 16, 18, 0, 7); g.arc(x + 38, groundPx - 10, 14, 0, 7); g.fill();
  }
  function drawSign(g, x, groundPx) {
    g.fillStyle = "#6b4226"; g.fillRect(x + 14, groundPx - 40, 5, 40);
    g.fillStyle = "#c58a50"; rr(g, x - 6, groundPx - 64, 46, 28, 5); g.fill();
    g.fillStyle = "#fff"; g.font = "900 16px Cairo, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("➜", x + 17, groundPx - 50);
  }

  window.Render = {
    THEMES: THEMES, tilesFor: tilesFor, drawBackground: drawBackground, drawCoin: drawCoin,
    drawGerm: drawGerm, drawBee: drawBee, drawCheckpoint: drawCheckpoint, drawGoal: drawGoal,
    drawLab: drawLab, drawBush: drawBush, drawSign: drawSign, rr: rr
  };
})();
