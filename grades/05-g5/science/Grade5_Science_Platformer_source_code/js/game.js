/* =========================================================
   محرك اللعبة — الحركة والفيزياء والتصادم ونظام الذهبيات/الأسئلة/الأرواح
   ========================================================= */
(function () {
  "use strict";
  var CFG = window.GAME_CONFIG;
  var T = 32;
  var GRAV = 1900, JUMP_V = 725, RUN = 185, ACC = 1500, AIR_ACC = 1100, FRICTION = 1700, MAX_FALL = 900;
  var COYOTE = 0.1, JUMP_BUFFER = 0.13;

  var Input = { left: false, right: false, jump: false, _jumpQueued: 0 };
  window.GameInput = Input;
  Input.pressJump = function () { if (!Input.jump) Input._jumpQueued = JUMP_BUFFER; Input.jump = true; };
  Input.releaseJump = function () { Input.jump = false; };
  Input.reset = function () { Input.left = Input.right = Input.jump = false; Input._jumpQueued = 0; };

  var KEYS = { ArrowLeft: "left", KeyA: "left", ArrowRight: "right", KeyD: "right", ArrowUp: "jump", KeyW: "jump", Space: "jump" };
  window.addEventListener("keydown", function (e) {
    var k = KEYS[e.code]; if (!k) return;
    if (Game.state !== "play") return;
    e.preventDefault();
    if (k === "jump") Input.pressJump(); else Input[k] = true;
  });
  window.addEventListener("keyup", function (e) {
    var k = KEYS[e.code]; if (!k) return;
    if (k === "jump") Input.releaseJump(); else Input[k] = false;
  });

  var Game = {
    state: "idle", canvas: null, g: null, hooks: {}, L: null, lessonIndex: 0, lesson: null,
    player: null, charImg: null, camX: 0, time: 0, acc: 0, last: 0, raf: 0,
    lives: 3, coins: 0, score: 0, nextQAt: 5, session: null, particles: [],
    checkpoint: null, pendingCoinQ: 0, flagY: 0, winTimer: 0, dyingTimer: 0, deathCause: null,
    viewW: 0, viewH: 0, k: 1, topExtra: 0, bumps: []
  };
  window.Game = Game;

  Game.init = function (canvas, hooks) {
    Game.canvas = canvas; Game.g = canvas.getContext("2d"); Game.hooks = hooks || {};
    window.addEventListener("resize", Game.resize);
    Game.resize();
  };

  Game.resize = function () {
    var c = Game.canvas; if (!c) return;
    var r = c.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = Math.max(1, Math.round(r.width * dpr)); c.height = Math.max(1, Math.round(r.height * dpr));
    var groundTop = 13 * T, VIEW_TOP = 3.5 * T; // كاميرا قريبة: نُظهر من الصف 3.5 حتى الأرض (شخصية أكبر)
    // على أجهزة اللمس: نحجز شريطًا من التراب أسفل الأرض لأزرار التحكم حتى لا تغطي الشخصية أو المنصات
    var touch = document.documentElement.classList.contains("is-touch");
    var small = r.height < 480; // جوال أفقي: تقريب أكثر حتى تبقى الشخصية كبيرة
    var band = touch ? (small ? 90 : Math.min(120, Math.max(100, r.height * 0.2))) : 0;
    var viewTop = touch && small ? 5 * T : VIEW_TOP;
    var scale = touch ? (r.height - band) / (groundTop - viewTop) : r.height / (groundTop - viewTop + 56);
    if (r.width / scale < 11 * T) scale = r.width / (11 * T); // شاشات عمودية: أظهر 11 خانة عرضًا على الأقل
    if (!touch) band = 56 * scale;
    Game.k = scale * dpr;
    Game.viewW = c.width / Game.k; Game.viewH = c.height / Game.k;
    // إزاحة العالم رأسيًا بحيث يقع سطح الأرض فوق الشريط السفلي
    Game.topExtra = (r.height - band) / scale - groundTop;
    if (Game.state !== "idle" && Game.state !== "play") Game.draw();
  };

  Game.start = function (lessonIndex, charImg) {
    var lesson = window.LESSONS[lessonIndex];
    Game.lessonIndex = lessonIndex; Game.lesson = lesson; Game.charImg = charImg;
    Game.L = window.LevelGen.generate(lessonIndex);
    Game.tiles = window.Render.tilesFor(lesson.theme);
    var bank = (window.QUESTION_BANKS && window.QUESTION_BANKS[lesson.id]) || [];
    Game.session = new window.QuestionSession(bank, { lessonId: lesson.id, gapMin: CFG.retryGapMin, gapMax: CFG.retryGapMax });
    Game.lives = CFG.startLives; Game.coins = 0; Game.score = 0; Game.nextQAt = CFG.coinsPerQuestion;
    Game.particles = []; Game.bumps = []; Game.pendingCoinQ = 0; Game.time = 0; Game.stomps = 0;
    Game.checkpoint = { x: Game.L.start.x, y: Game.L.start.y };
    Game.flagY = Game.L.goal.topY + 10;
    Game.spawnPlayer();
    Input.reset();
    Game.state = "play";
    Game.emitHud();
    cancelAnimationFrame(Game.raf);
    Game.last = performance.now(); Game.acc = 0;
    Game.raf = requestAnimationFrame(Game.loop);
  };

  Game.spawnPlayer = function () {
    var cp = Game.checkpoint;
    Game.player = { x: cp.x, y: cp.y - 16, w: 26, h: 66, vx: 0, vy: 0, onGround: false, coyote: 0, invuln: 1.5, face: 1, runT: 0, ride: null };
    Game.camX = Math.max(0, cp.x - Game.viewW * 0.4);
  };

  Game.stop = function () { cancelAnimationFrame(Game.raf); Game.state = "idle"; };

  Game.pause = function () { if (Game.state === "play") { Game.state = "paused"; Input.reset(); } };
  Game.resume = function () {
    if (Game.state === "paused") { Game.state = "play"; Game.last = performance.now(); }
  };

  Game.loop = function (now) {
    var dt = Math.min(0.05, (now - Game.last) / 1000); Game.last = now;
    if (Game.state === "play" || Game.state === "dying" || Game.state === "won") {
      Game.acc += dt;
      while (Game.acc >= 1 / 120 && (Game.state === "play" || Game.state === "dying" || Game.state === "won")) { Game.step(1 / 120); Game.acc -= 1 / 120; }
    } else Game.acc = 0;
    Game.draw();
    if (Game.state !== "idle") Game.raf = requestAnimationFrame(Game.loop);
  };

  /* ---------------- تصادم الشبكة ---------------- */
  function tileAt(px, py) { var L = Game.L; return L.get(Math.floor(px / T), Math.floor(py / T)); }
  function solidAt(px, py) { return Game.L.solid(tileAt(px, py)); }

  function moveX(o, dx) {
    o.x += dx;
    var top = o.y + 2, bot = o.y + o.h - 2;
    if (dx > 0) {
      var r = o.x + o.w;
      for (var y = top; y <= bot; y += Math.min(T - 1, bot - y || 1)) { if (solidAt(r, y)) { o.x = Math.floor(r / T) * T - o.w - 0.01; o.vx = 0; return true; } if (y === bot) break; }
    } else if (dx < 0) {
      for (y = top; y <= bot; y += Math.min(T - 1, bot - y || 1)) { if (solidAt(o.x, y)) { o.x = (Math.floor(o.x / T) + 1) * T + 0.01; o.vx = 0; return true; } if (y === bot) break; }
    }
    if (o.x < 0) { o.x = 0; o.vx = 0; }
    return false;
  }
  function moveY(o, dy, isPlayer) {
    o.y += dy;
    var l = o.x + 2, rr = o.x + o.w - 2, hit = false;
    if (dy > 0) {
      var b = o.y + o.h;
      if (solidAt(l, b) || solidAt(rr, b) || solidAt((l + rr) / 2, b)) { o.y = Math.floor(b / T) * T - o.h; o.vy = 0; o.onGround = true; hit = true; }
    } else if (dy < 0) {
      var t = o.y;
      var cols = [l, (l + rr) / 2, rr], hitCol = null;
      for (var i = 0; i < cols.length; i++) if (solidAt(cols[i], t)) { hitCol = hitCol == null ? cols[i] : hitCol; }
      if (hitCol != null) {
        o.y = (Math.floor(t / T) + 1) * T; o.vy = 0; hit = true;
        if (isPlayer) {
          // الكتلة الأقرب لمنتصف الرأس
          var mid = (l + rr) / 2, tx = Math.floor(mid / T);
          if (!Game.L.solid(Game.L.get(tx, Math.floor(t / T)))) tx = Math.floor(hitCol / T);
          Game.headBump(tx, Math.floor(t / T));
        }
      }
    }
    return hit;
  }

  Game.headBump = function (tx, ty) {
    var L = Game.L, v = L.get(tx, ty), C = L.CODES;
    if (v === C.QB) {
      L.set(tx, ty, C.USED);
      Game.bumps.push({ tx: tx, ty: ty, t: 0 });
      Game.particles.push({ type: "popcoin", x: tx * T + T / 2, y: ty * T, vy: -380, life: 0.55 });
      window.Sound.play("popup");
      Game.collectCoin(tx * T + T / 2, ty * T - 10);
    } else if (v === C.BRICK) {
      Game.bumps.push({ tx: tx, ty: ty, t: 0 });
      window.Sound.play("bump");
      // اهزم العدو الواقف فوق الطوب
      Game.L.enemies.forEach(function (e) {
        if (e.alive && e.type === "germ" && Math.abs(e.y + e.h - ty * T) < 4 && e.x + e.w > tx * T && e.x < tx * T + T) Game.killEnemy(e);
      });
    } else window.Sound.play("bump");
  };

  /* ---------------- خطوة التحديث ---------------- */
  Game.step = function (dt) {
    if (Game.state !== "play" && Game.state !== "dying" && Game.state !== "won") return; // لا تحديث بعد انتهاء المرحلة أو أثناء السؤال
    Game.time += dt;
    var p = Game.player, L = Game.L;

    Game.bumps.forEach(function (b) { b.t += dt; }); Game.bumps = Game.bumps.filter(function (b) { return b.t < 0.2; });
    Game.particles.forEach(function (q) {
      q.life -= dt;
      if (q.type === "popcoin") { q.y += q.vy * dt; q.vy += 1400 * dt; }
      else if (q.type === "text") { q.y -= 40 * dt; }
      else if (q.type === "dust") { q.x += q.vx * dt; q.y += q.vy * dt; }
    });
    Game.particles = Game.particles.filter(function (q) { return q.life > 0; });

    if (Game.state === "dying") {
      Game.dyingTimer -= dt;
      p.vy += GRAV * dt; p.y += p.vy * dt;
      if (Game.dyingTimer <= 0) Game.afterDeath();
      return;
    }
    if (Game.state === "won") {
      Game.winTimer += dt;
      var groundPx = L.GROUND * T;
      if (Game.flagY < groundPx - 40) Game.flagY += 260 * dt;
      if (p.y + p.h < groundPx) { p.y = Math.min(groundPx - p.h, p.y + 240 * dt); }
      else if (Game.winTimer > 0.8) { p.x += 110 * dt; p.runT += dt; }
      if (Game.winTimer > 2.4 && !Game._winShown) { Game._winShown = true; Game.finish(true); }
      return;
    }

    // الأعداء والمنصات المتحركة
    L.platforms.forEach(function (pl) {
      var old = pl.x; pl.x += pl.vx * dt;
      if (pl.x < pl.minX) { pl.x = pl.minX; pl.vx = Math.abs(pl.vx); }
      if (pl.x > pl.maxX) { pl.x = pl.maxX; pl.vx = -Math.abs(pl.vx); }
      pl.dx = pl.x - old;
    });
    L.enemies.forEach(function (e) {
      if (!e.alive) { e.dead = (e.dead || 0) + dt; return; }
      if (Math.abs(e.x - p.x) > Game.viewW * 1.2) return; // لا يتحرك بعيدًا عن الشاشة
      e.t += dt;
      if (e.type === "germ") {
        e.vy = (e.vy || 0) + GRAV * dt; if (e.vy > MAX_FALL) e.vy = MAX_FALL;
        e.onGround = false;
        moveY(e, e.vy * dt, false);
        var vx0 = e.vx;
        if (moveX(e, vx0 * dt)) e.vx = -vx0; // اصطدم بجدار: اعكس الاتجاه
        // لا يسقط من الحافة
        if (e.onGround) {
          var aheadX = e.vx > 0 ? e.x + e.w + 2 : e.x - 2;
          if (!solidAt(aheadX, e.y + e.h + 4)) e.vx = -e.vx;
        }
        if (e.y > L.H * T + 100) e.alive = false;
      } else if (e.type === "bee") {
        e.y = e.baseY + Math.sin(e.t * 2.2) * e.amp;
        e.x = e.startX + Math.sin(e.t * 0.9) * 40;
      }
    });

    // إدخال اللاعب
    var dir = (Input.right ? 1 : 0) - (Input.left ? 1 : 0);
    var a = p.onGround ? ACC : AIR_ACC;
    if (dir !== 0) { p.vx += dir * a * dt; p.face = dir; }
    else if (p.onGround) { var f = FRICTION * dt; if (Math.abs(p.vx) <= f) p.vx = 0; else p.vx -= Math.sign(p.vx) * f; }
    if (p.vx > RUN) p.vx = RUN; if (p.vx < -RUN) p.vx = -RUN;

    if (p.onGround) p.coyote = COYOTE; else p.coyote -= dt;
    if (Input._jumpQueued > 0) Input._jumpQueued -= dt;
    if (Input._jumpQueued > 0 && p.coyote > 0) {
      p.vy = -JUMP_V; p.onGround = false; p.coyote = 0; Input._jumpQueued = 0; p.ride = null;
      window.Sound.play("jump");
      for (var di = 0; di < 4; di++) Game.particles.push({ type: "dust", x: p.x + p.w / 2, y: p.y + p.h, vx: (Math.random() - 0.5) * 80, vy: -Math.random() * 30, life: 0.3 });
    }
    if (!Input.jump && p.vy < -260) p.vy = -260; // قفزة متغيرة الارتفاع

    p.vy += GRAV * dt; if (p.vy > MAX_FALL) p.vy = MAX_FALL;

    // الركوب على منصة متحركة
    if (p.ride) { p.x += p.ride.dx; }

    moveX(p, p.vx * dt);
    var wasGround = p.onGround; p.onGround = false;
    moveY(p, p.vy * dt, true);

    // منصات متحركة (صلبة من الأعلى فقط)
    p.ride = null;
    L.platforms.forEach(function (pl) {
      if (p.vy >= 0 && p.x + p.w > pl.x + 2 && p.x < pl.x + pl.w - 2) {
        var bottom = p.y + p.h;
        if (bottom >= pl.y && bottom - p.vy * dt - 2 <= pl.y + 2) { p.y = pl.y - p.h; p.vy = 0; p.onGround = true; p.ride = pl; }
      }
    });
    if (p.onGround && Math.abs(p.vx) > 10) p.runT += dt * (Math.abs(p.vx) / RUN);
    if (p.invuln > 0) p.invuln -= dt;

    // الذهبيات
    // نلتقط الذهبية إذا لمست الشخصية كما تظهر على الشاشة (طولها المرسوم، وليس صندوق التصادم فقط)
    var visH = (Game.charImg && Game.charImg.rig && Game.charImg.rig.h) || p.h;
    var pTop = p.y + p.h - Math.max(p.h, visH), pBot = p.y + p.h, pcx = p.x + p.w / 2;
    for (var i = 0; i < L.coins.length; i++) {
      var c = L.coins[i];
      if (!c.taken && Math.abs(c.x - pcx) < p.w / 2 + 12 && c.y > pTop - 12 && c.y < pBot + 12) {
        c.taken = true; Game.collectCoin(c.x, c.y);
      }
    }

    // الشوك
    var C = L.CODES;
    var pts = [[p.x + 4, p.y + p.h - 4], [p.x + p.w - 4, p.y + p.h - 4], [p.x + p.w / 2, p.y + p.h - 12]];
    for (i = 0; i < pts.length; i++) {
      if (tileAt(pts[i][0], pts[i][1]) === C.SPIKE) {
        var ty = Math.floor(pts[i][1] / T);
        if (pts[i][1] > ty * T + 10) { Game.damage("spike"); return; }
      }
    }

    // الأعداء
    for (i = 0; i < L.enemies.length; i++) {
      var e = L.enemies[i];
      if (!e.alive) continue;
      if (p.x < e.x + e.w - 3 && p.x + p.w > e.x + 3 && p.y < e.y + e.h - 3 && p.y + p.h > e.y + 4) {
        var fromAbove = p.vy > 60 && (p.y + p.h) - e.y < 18;
        if (fromAbove) { Game.killEnemy(e); p.vy = Input.jump ? -JUMP_V * 0.85 : -440; }
        else { Game.damage("enemy"); return; }
      }
    }

    // نقاط الحفظ
    L.checkpoints.forEach(function (cp) {
      if (!cp.active && p.x + p.w / 2 > cp.x) {
        cp.active = true; Game.checkpoint = { x: cp.x - 8, y: (L.GROUND - 2) * T };
        window.Sound.play("checkpoint");
        Game.particles.push({ type: "text", x: cp.x, y: (L.GROUND - 3) * T, text: "تم الحفظ ✓", life: 1.2 });
      }
    });

    // السقوط في حفرة
    if (p.y > L.H * T + 20) { Game.damage("fall"); return; }

    // الوصول للنهاية
    if (p.x + p.w >= L.goal.x - 4) {
      Game.state = "won"; Game.winTimer = 0; Game._winShown = false;
      p.vx = 0; p.vy = 0; p.x = L.goal.x - p.w - 4;
      var bonus = CFG.points.levelComplete + Game.lives * CFG.points.perLifeLeft;
      Game.score += bonus; Game.emitHud();
      Game.particles.push({ type: "text", x: L.goal.x, y: L.goal.topY + 40, text: "+" + bonus, life: 1.6 });
      window.Sound.play("win");
      return;
    }

    // الكاميرا
    var target = p.x - Game.viewW * 0.4;
    Game.camX += (target - Game.camX) * Math.min(1, dt * 8);
    Game.camX = Math.max(0, Math.min(Game.camX, L.W * T - Game.viewW));

    // سؤال مؤجل بسبب الذهبيات (يُعرض عند عودة اللعب)
    if (Game.pendingCoinQ > 0 && Game.state === "play") { Game.pendingCoinQ--; Game.askQuestion("coins"); }
  };

  Game.killEnemy = function (e) {
    e.alive = false; e.dead = 0;
    Game.score += CFG.points.stomp; Game.stomps++;
    Game.particles.push({ type: "text", x: e.x + e.w / 2, y: e.y, text: "+" + CFG.points.stomp, life: 0.8 });
    window.Sound.play("stomp"); Game.emitHud();
  };

  Game.collectCoin = function (x, y) {
    Game.coins++; Game.score += CFG.points.coin;
    window.Sound.play("coin");
    Game.particles.push({ type: "text", x: x, y: y - 10, text: "+" + CFG.points.coin, life: 0.6 });
    Game.emitHud();
    if (Game.coins >= Game.nextQAt) {
      Game.nextQAt += CFG.coinsPerQuestion;
      if (Game.state === "play") Game.askQuestion("coins"); else Game.pendingCoinQ++;
    }
  };

  /* خسارة روح بسبب حدث داخل اللعب */
  Game.damage = function (cause) {
    var p = Game.player;
    if (Game.state !== "play") return;
    if (cause !== "fall" && p.invuln > 0) return;
    Game.state = "dying"; Game.deathCause = cause; Game.dyingTimer = cause === "fall" ? 0.5 : 0.9;
    p.vx = 0; p.vy = cause === "fall" ? 0 : -520; Input.reset();
    window.Sound.play("lose");
    if (window.Sound.duckMusic) window.Sound.duckMusic(true);
  };

  Game.afterDeath = function () {
    Game.lives = Math.max(0, Game.lives - 1);
    Game.emitHud();
    if (Game.lives <= 0) { Game.finish(false); return; }
    // سؤال بسبب خسارة روح أثناء اللعب، ثم العودة لآخر نقطة حفظ
    Game.state = "respawnWait";
    var shown = Game.askQuestion("life");
    if (!shown) Game.respawn();
  };

  Game.respawn = function () {
    Game.spawnPlayer();
    Game.state = "play"; Game.last = performance.now();
    if (window.Sound.duckMusic) window.Sound.duckMusic(false);
  };

  /* عرض سؤال — reason: "coins" أو "life". يرجع true إذا عُرض سؤال */
  Game.askQuestion = function (reason) {
    var q = Game.session.next();
    if (!q) {
      if (reason === "coins") {
        var msg = Game.session.allCorrect() ? "أحسنت! أجبت عن جميع أسئلة هذه المرحلة 🌟" : (Game.session.size() ? "لا يوجد سؤال جديد الآن — تابع اللعب!" : "لا توجد أسئلة لهذا الدرس بعد");
        if (Game.hooks.toast) Game.hooks.toast(msg);
      }
      return false;
    }
    var prevState = Game.state;
    Game.state = "question"; Input.reset();
    if (window.Sound.duckMusic) window.Sound.duckMusic(true);
    Game.hooks.showQuestion(q, reason, function (response) {
      var ok = Game.session.answer(response);
      if (ok === null) return; // نقر مكرر
      if (ok) {
        Game.score += CFG.points.correctAnswer;
        window.Sound.play("correct");
      } else {
        // إجابة خاطئة: خصم روح واحدة فقط — ولا يُعرض سؤال جديد بسببها
        Game.lives = Math.max(0, Game.lives - 1);
        window.Sound.play("wrong");
      }
      Game.emitHud();
      return ok;
    }, function onClosed() {
      if (window.Sound.duckMusic) window.Sound.duckMusic(false);
      if (Game.lives <= 0) { Game.finish(false); return; }
      if (reason === "life" || prevState === "respawnWait") Game.respawn();
      else { Game.state = "play"; Game.last = performance.now(); }
    });
    return true;
  };

  Game.stats = function () {
    var s = Game.session.stats;
    return {
      lesson: Game.lesson, coins: Game.coins, score: Game.score, lives: Game.lives,
      asked: s.correct + s.wrong, correct: s.correct, wrong: s.wrong,
      pct: (s.correct + s.wrong) ? Math.round(100 * s.correct / (s.correct + s.wrong)) : 0
    };
  };

  Game.finish = function (won) {
    Game.state = won ? "complete" : "over";
    Input.reset();
    if (!won) window.Sound.play("gameover");
    var st = Game.stats(); st.completed = won;
    if (Game.hooks.onFinish) Game.hooks.onFinish(won, st);
  };

  Game.emitHud = function () {
    if (Game.hooks.hud) Game.hooks.hud({ lives: Game.lives, coins: Game.coins, score: Game.score });
  };

  /* ---------------- الرسم ---------------- */
  Game.draw = function () {
    var g = Game.g, L = Game.L; if (!g || !L) return;
    var R = window.Render, S = Game.tiles, C = L.CODES, t = Game.time;
    g.setTransform(Game.k, 0, 0, Game.k, 0, 0);
    try { g.direction = "ltr"; } catch (e) {} // حتى تظهر "+10" بشكل صحيح داخل صفحة RTL
    var vw = Game.viewW, vh = Game.viewH, top = Game.topExtra, cam = Math.round(Game.camX * 2) / 2;
    R.drawBackground(g, vw, vh, cam, top + L.GROUND * T, Game.lesson.theme, t);
    // تراب إضافي أسفل العالم (منطقة أزرار اللمس)
    var worldBottom = top + L.H * T;
    if (worldBottom < vh) { g.fillStyle = R.THEMES[Game.lesson.theme].dirt; g.fillRect(0, worldBottom - 1, vw, vh - worldBottom + 2); }
    g.save(); g.translate(-cam, top);
    var groundPx = L.GROUND * T;
    var x0 = Math.max(0, Math.floor(cam / T) - 1), x1 = Math.min(L.W - 1, Math.ceil((cam + vw) / T) + 1);

    // زخارف
    L.decor.forEach(function (d) {
      var px = d.x * T; if (px < cam - 200 || px > cam + vw + 50) return;
      if (d.type === "bush") R.drawBush(g, px, groundPx, R.THEMES[Game.lesson.theme].hillNear);
      else if (d.type === "lab") R.drawLab(g, px, groundPx);
      else if (d.type === "sign") R.drawSign(g, px, groundPx);
    });

    // البلاط
    for (var x = x0; x <= x1; x++) {
      for (var y = 0; y < L.H; y++) {
        var v = L.get(x, y); if (!v) continue;
        var img = null;
        if (v === C.GRD) img = L.get(x, y - 1) === C.GRD ? S.ground : S.groundTop;
        else if (v === C.BRICK) img = S.brick; else if (v === C.QB) img = S.qb; else if (v === C.USED) img = S.used;
        else if (v === C.STONE) img = S.stone; else if (v === C.PTL) img = S.ptl; else if (v === C.PTR) img = S.ptr;
        else if (v === C.PBL) img = S.pbl; else if (v === C.PBR) img = S.pbr; else if (v === C.SPIKE) img = S.spike;
        if (!img) continue;
        var oy = 0;
        for (var b = 0; b < Game.bumps.length; b++) if (Game.bumps[b].tx === x && Game.bumps[b].ty === y) oy = -Math.sin(Game.bumps[b].t / 0.2 * Math.PI) * 8;
        if (v === C.QB) oy += 0;
        g.drawImage(img, x * T, y * T + oy, T, T);
      }
    }

    // المنصات المتحركة
    L.platforms.forEach(function (pl) {
      R.rr(g, pl.x, pl.y, pl.w, pl.h, 6); g.fillStyle = "#e9f0ff"; g.fill();
      g.fillStyle = "#7b4fc9"; g.fillRect(pl.x + 4, pl.y + pl.h - 5, pl.w - 8, 3);
    });

    // نقاط الحفظ والهدف
    L.checkpoints.forEach(function (cp) { R.drawCheckpoint(g, cp, groundPx, t); });
    R.drawGoal(g, L.goal, groundPx, Game.flagY, t);

    // الذهبيات
    L.coins.forEach(function (c) { if (!c.taken && c.x > cam - 20 && c.x < cam + vw + 20) R.drawCoin(g, c.x, c.y, t); });

    // الأعداء
    L.enemies.forEach(function (e) {
      if (e.x < cam - 60 || e.x > cam + vw + 60) return;
      if (!e.alive && (e.dead || 0) > 0.5) return;
      if (e.type === "germ") R.drawGerm(g, e, t); else R.drawBee(g, e, t);
    });

    // اللاعب
    Game.drawPlayer(g, t);

    // جزيئات
    Game.particles.forEach(function (q) {
      if (q.type === "popcoin") R.drawCoin(g, q.x, q.y, t * 3);
      else if (q.type === "dust") { g.fillStyle = "rgba(255,255,255," + (q.life / 0.3 * 0.7) + ")"; g.beginPath(); g.arc(q.x, q.y, 3, 0, 7); g.fill(); }
      else if (q.type === "text") {
        g.font = "900 16px Cairo, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
        g.lineWidth = 4; g.strokeStyle = "rgba(40,20,80,.85)"; g.strokeText(q.text, q.x, q.y);
        g.fillStyle = "#fff6c8"; g.fillText(q.text, q.x, q.y);
      }
    });
    g.restore();
  };

  /* رسم الشخصية من المنظر الجانبي: الصورة الأصلية تنظر يسارًا، فتُعكس عند الاتجاه يمينًا.
     الساقان (أو القدمان تحت الثوب) تتحركان كمقص أثناء المشي: ساق خلفية أغمق وساق أمامية */
  Game.drawPlayer = function (g, t) {
    var p = Game.player, img = Game.charImg; if (!p || !img) return;
    if (p.invuln > 0 && Game.state === "play" && Math.floor(t * 14) % 2 === 0) return;
    var W = img.naturalWidth || img.width, H = img.naturalHeight || img.height;
    var rig = img.rig || { top: 0, bot: H, mid: W / 2, pivot: W / 2, cut: H * 0.9, feet: true, h: 90 };
    var s = (rig.h || 90) / (rig.bot - rig.top);
    var walking = p.onGround && Math.abs(p.vx) > 12 && Game.state !== "dying";
    var air = !p.onGround && Game.state !== "dying";
    var ph = p.runT * 11, sw = Math.sin(ph);
    var bob = walking ? Math.abs(Math.cos(ph)) * 2.5 : 0;
    var lean = walking ? Math.min(1, Math.abs(p.vx) / RUN) * 0.06 : 0;
    var cx = p.x + p.w / 2, by = p.y + p.h;
    g.save();
    if (Game.state !== "dying") { g.fillStyle = "rgba(0,0,0,.2)"; g.beginPath(); g.ellipse(cx, by, 18, 4.5, 0, 0, 7); g.fill(); }
    g.translate(cx, by - bob);
    if (Game.state === "dying") g.rotate(Math.sin(t * 20) * 0.3);
    var dir = p.face >= 0 ? -1 : 1;          // الصورة تنظر يسارًا: نعكسها عند الحركة يمينًا
    g.scale(dir * s, s);
    g.rotate(-lean);                          // ميل خفيف للأمام (الأمام = يسار الصورة)
    g.translate(-rig.mid, -rig.bot);

    var cut = rig.cut, legs = img.legs;
    // ساقان فقط: البعيدة والقريبة تتحركان بعكس بعضهما (مثل المقص)
    function legPiece(front) {
      var k = front ? 1 : -1;
      var src = legs ? (front ? legs.near : legs.far) : img;
      var top = legs ? legs.top : (rig.feet ? cut : cut - 12);
      g.save();
      if (!rig.feet) {
        var ang = walking ? sw * 0.42 * k : (air ? (front ? 0.38 : -0.22) : 0);
        g.translate(rig.pivot, cut); g.rotate(ang);
        g.drawImage(src, 0, top, W, H - top, -rig.pivot, top - cut, W, H - top);
      } else {
        var dx = walking ? -sw * 30 * k : (air ? (front ? -20 : 16) : 0);
        var dy = walking ? -Math.max(0, sw * k) * 30 : (air ? -24 : 0);
        g.drawImage(src, 0, top, W, H - top, dx, top + dy, W, H - top);
      }
      g.restore();
    }
    var arms = img.arms, moving = (walking || air) && legs;
    // الذراع القريبة تتأرجح من الكتف بعكس الساق القريبة (مثل المشي الطبيعي). الذراع البعيدة مخفية خلف الجسم في المنظر الجانبي
    function armPiece(front) {
      if (!arms || !rig.shoulder) return;
      var a = walking ? -sw * 0.24 : (air ? 0.35 : 0);
      var sx = rig.shoulder[0], sy = rig.shoulder[1];
      g.save(); g.translate(sx, sy); g.rotate(a);
      g.drawImage(front ? arms.near : arms.far, -sx, -sy);
      g.restore();
    }
    if (moving) {
      legPiece(false); legPiece(true);
      var bodyImg = (arms && img.bodyNoArm) ? img.bodyNoArm : img;
      g.drawImage(bodyImg, 0, 0, W, cut + 2, 0, 0, W, cut + 2);
      if (bodyImg !== img) armPiece(true);   // الذراع الأمامية فوق الجسم
    } else { // وقوف: الرسم الأصلي تمامًا
      var st = rig.feet ? cut : cut - 12;
      g.drawImage(img, 0, st, W, H - st, 0, st, W, H - st);
      g.drawImage(img, 0, 0, W, cut + 2, 0, 0, W, cut + 2);
    }
    g.restore();
  };

  /* أدوات للاختبار الآلي */
  Game._test = {
    giveCoins: function (n) { for (var i = 0; i < n; i++) Game.collectCoin(Game.player.x, Game.player.y); },
    fall: function () { Game.player.y = Game.L.H * T + 100; },
    hitEnemy: function () {
      var p = Game.player; p.invuln = 0;
      Game.L.enemies.push({ type: "germ", x: p.x, y: p.y + p.h - 26, w: 28, h: 26, vx: 0, alive: true, startX: p.x, t: 0 });
    },
    teleport: function (tx) { var p = Game.player; p.x = tx * T; p.y = (Game.L.GROUND - 3) * T; p.vy = 0; },
    toGoal: function () { var p = Game.player; p.x = Game.L.goal.x - 40; p.y = (Game.L.GROUND - 7) * T; p.vy = 0; }
  };
})();
