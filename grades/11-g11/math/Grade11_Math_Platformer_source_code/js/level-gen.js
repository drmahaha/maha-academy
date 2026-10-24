/* =========================================================
   مولّد المراحل — كل درس له مرحلة ثابتة (بذرة ثابتة) وصعوبة متدرجة
   الشبكة: 15 صفًا، الأرض تبدأ من الصف 13
   ========================================================= */
(function () {
  "use strict";
  var T = 32, H = 15, GROUND = 13;
  var E = 0, GRD = 1, BRICK = 2, QB = 3, USED = 4, PTL = 5, PTR = 6, PBL = 7, PBR = 8, STONE = 9, SPIKE = 10;

  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function generate(index, total, salt) {
    // الصعوبة 0..11 موزعة على عدد الدروس (أول درس الأسهل، آخر درس الأصعب)
    total = total || 12;
    var d = total > 1 ? Math.round(index * 11 / (total - 1)) : 0;
    var R = rng(1000 + index * 7919 + (salt || 0) * 104729);
    function ri(a, b) { return a + Math.floor(R() * (b - a + 1)); }
    function chance(p) { return R() < p; }

    var W = 170 + d * 8;
    var tiles = new Uint8Array(W * H);
    var L = {
      T: T, W: W, H: H, GROUND: GROUND, tiles: tiles, index: index,
      coins: [], enemies: [], platforms: [], checkpoints: [], goal: null, decor: [],
      start: { x: 3 * T, y: (GROUND - 2) * T }
    };
    function set(x, y, v) { if (x >= 0 && x < W && y >= 0 && y < H) tiles[y * W + x] = v; }
    function get(x, y) { return (x < 0 || x >= W || y < 0 || y >= H) ? 0 : tiles[y * W + x]; }
    function ground(x0, x1) { for (var x = x0; x <= x1; x++) { set(x, GROUND, GRD); set(x, GROUND + 1, GRD); } }
    function coin(tx, ty) { L.coins.push({ x: tx * T + T / 2, y: ty * T + T / 2, taken: false }); }
    function coinRow(tx, ty, n) { for (var i = 0; i < n; i++) coin(tx + i, ty); }
    function coinArc(tx, n, base) { for (var i = 0; i < n; i++) { var h = Math.round(Math.sin(Math.PI * (i + 0.5) / n) * 2); coin(tx + i, base - h); } }
    function enemy(type, tx, ty, extra) {
      var e = { type: type, x: tx * T + 2, y: ty * T, w: 28, h: 26, vx: -(38 + d * 4), alive: true, startX: tx * T, t: R() * 6 };
      if (type === "bee") { e.h = 24; e.baseY = ty * T; e.vx = 0; e.amp = 22 + d * 2; }
      for (var k in extra || {}) e[k] = extra[k];
      L.enemies.push(e);
    }

    // منطقة البداية الآمنة
    ground(0, 13);
    coinArc(6, 4, 11);
    L.decor.push({ type: "sign", x: 1 });
    var x = 14;
    var lastCheckpoint = 0;
    var enemyRate = Math.min(0.75, 0.35 + d * 0.04);

    var segTypes = ["flat", "pit", "pipe", "blocks", "stairs", "spikes", "float", "moving", "bees"];
    function weight(t) {
      switch (t) {
        case "flat": return 3;
        case "pit": return 2 + d * 0.15;
        case "pipe": return 2;
        case "blocks": return 3;
        case "stairs": return 1;
        case "spikes": return d >= 2 ? 1 + d * 0.1 : 0;
        case "float": return d >= 2 ? 1.2 : 0;
        case "moving": return d >= 3 ? 1 + d * 0.08 : 0;
        case "bees": return d >= 5 ? 1 : 0;
      }
      return 0;
    }
    function pickSeg() {
      var tot = 0, i; for (i = 0; i < segTypes.length; i++) tot += weight(segTypes[i]);
      var r = R() * tot;
      for (i = 0; i < segTypes.length; i++) { r -= weight(segTypes[i]); if (r <= 0) return segTypes[i]; }
      return "flat";
    }

    var endAt = W - 26;
    while (x < endAt) {
      // نقطة حفظ كل ~50 خانة على أرض مستوية آمنة
      if (x - lastCheckpoint >= 48 && x > 30) {
        ground(x, x + 5);
        L.checkpoints.push({ tx: x + 2, x: (x + 2) * T, active: false });
        coinRow(x + 1, 11, 3); // بارتفاع المشي لكل الشخصيات (حتى مالك)
        lastCheckpoint = x; x += 6; continue;
      }
      var seg = pickSeg(), n;
      switch (seg) {
        case "flat":
          n = ri(6, 9); ground(x, x + n - 1);
          if (chance(0.6)) coinArc(x + 1, Math.min(5, n - 2), 11); else coinRow(x + 2, 11, 3);
          if (chance(enemyRate)) enemy("germ", x + n - 3, GROUND - 1);
          if (chance(0.3)) L.decor.push({ type: "bush", x: x + 1 });
          x += n; break;

        case "pit":
          var pw = d < 4 ? 2 : ri(2, 3);
          ground(x, x + 2); x += 3;
          // جسر من الذهبيات فوق الحفرة
          coinArc(x, pw, 10);
          x += pw;
          ground(x, x + 3); x += 4; break;

        case "pipe":
          ground(x, x + 7);
          var ph = d < 3 ? 2 : ri(2, 3), px = x + 3;
          for (var py = GROUND - ph; py < GROUND; py++) {
            set(px, py, py === GROUND - ph ? PTL : PBL);
            set(px + 1, py, py === GROUND - ph ? PTR : PBR);
          }
          coinRow(px, GROUND - ph - 2, 2);
          if (chance(enemyRate * 0.7)) enemy("germ", x + 6, GROUND - 1);
          x += 8; break;

        case "blocks":
          n = ri(7, 10); ground(x, x + n - 1);
          var bx = x + 2, bl = ri(3, 5);
          for (var i = 0; i < bl; i++) set(bx + i, 9, (i % 2 === 1 || (bl === 3 && i === 1)) ? QB : BRICK);
          coinRow(bx, 7, bl);
          if (chance(enemyRate)) enemy("germ", x + n - 2, GROUND - 1);
          x += n; break;

        case "stairs":
          var sh = Math.min(4, 2 + Math.floor(d / 3));
          ground(x, x + sh * 2 + 3);
          for (var s = 0; s < sh; s++) for (var yy = GROUND - 1 - s; yy < GROUND; yy++) set(x + 1 + s, yy, STONE);
          for (s = 0; s < sh; s++) for (yy = GROUND - sh + s; yy < GROUND; yy++) set(x + 1 + sh + 1 + s, yy, STONE);
          set(x + 1 + sh, GROUND - sh, STONE); for (yy = GROUND - sh; yy < GROUND; yy++) set(x + 1 + sh, yy, STONE);
          coinRow(x + 1 + sh - 1, GROUND - sh - 2, 3);
          x += sh * 2 + 4; break;

        case "spikes":
          n = 8; ground(x, x + n - 1);
          var sw = d < 6 ? 1 : 2;
          for (var k = 0; k < sw; k++) set(x + 3 + k, GROUND - 1, SPIKE);
          coinArc(x + 2, sw + 2, 10);
          x += n; break;

        case "float":
          ground(x, x + 1); x += 2;
          var fw = 5;
          set(x + 1, 10, BRICK); set(x + 2, 10, BRICK); set(x + 3, 10, BRICK); // جسر طوب فوق الحفرة (لا كتل ؟ فوق الحفر)
          coinRow(x + 1, 8, 3);
          x += fw;
          ground(x, x + 3); x += 4; break;

        case "moving":
          ground(x, x + 1); x += 2;
          var mw = d < 7 ? 5 : 6;
          L.platforms.push({ x: x * T, y: 11 * T, w: 3 * T, h: 14, minX: x * T, maxX: (x + mw - 3) * T, vx: 40 + d * 3, dx: 0 });
          coinRow(x + 1, 9, mw - 2);
          x += mw;
          ground(x, x + 3); x += 4; break;

        case "bees":
          n = 10; ground(x, x + n - 1);
          enemy("bee", x + 5, 8);
          coinRow(x + 2, 11, 3);
          x += n; break;
      }
    }

    // نهاية المرحلة: سلّم ثم سارية العلم ثم المختبر
    ground(x, W - 1);
    var sx = x + 2, top = 5;
    for (var s2 = 0; s2 < top; s2++) for (var y2 = GROUND - 1 - s2; y2 < GROUND; y2++) set(sx + s2, y2, STONE);
    coinRow(sx, GROUND - top - 2, 3);
    L.goal = { tx: sx + top + 3, x: (sx + top + 3) * T + T / 2, topY: 4 * T, reached: false };
    L.decor.push({ type: "lab", x: sx + top + 7 });

    // تعريف دوال الوصول
    L.get = get; L.set = set;
    L.solid = function (v) { return v === GRD || v === BRICK || v === QB || v === USED || (v >= PTL && v <= PBR) || v === STONE; };
    L.CODES = { E: E, GRD: GRD, BRICK: BRICK, QB: QB, USED: USED, PTL: PTL, PTR: PTR, PBL: PBL, PBR: PBR, STONE: STONE, SPIKE: SPIKE };
    return L;
  }

  window.LevelGen = { generate: generate, T: T, H: H, GROUND: GROUND };
})();
