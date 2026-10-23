/* =========================================================
   الواجهة — الشاشات، اختيار الشخصية والدرس، نافذة السؤال، النتائج
   ========================================================= */
(function () {
  "use strict";
  var CFG = window.GAME_CONFIG, LESSONS = window.LESSONS, UNITS = window.UNITS;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var CHARACTERS = [
    { id: "maya",  ar: "مايا",  en: "Maya",  src: "assets/chars/maya.webp",  side: "assets/chars/side/maya.webp", body: "assets/chars/side/maya_body.webp",  rig: { top: 0, bot: 639, cut: 416, pivot: 126, mid: 112, feet: false, h: 98, near: [[90,402],[92,418],[100,470],[108,552],[109,572],[100,576],[95,588],[82,600],[64,606],[54,612],[50,622],[52,634],[64,640],[185,640],[185,402]], arm: [[110,163],[133,158],[157,163],[163,190],[164,233],[160,277],[148,307],[137,323],[132,340],[130,380],[120,397],[100,395],[92,380],[90,357],[100,337],[105,310],[106,297],[105,250],[106,200],[108,173]], shoulder: [135,180] } },
    { id: "marya", ar: "ماريا", en: "Marya", src: "assets/chars/marya.webp", side: "assets/chars/side/marya.webp", body: "assets/chars/side/marya_body.webp", rig: { top: 0, bot: 639, cut: 437, pivot: 104, mid: 92,  feet: false, h: 92, near: [[60,436],[69,500],[77,540],[78,548],[79,570],[80,578],[74,590],[70,600],[56,604],[40,610],[33,617],[32,628],[38,636],[48,640],[169,640],[169,436]], arm: [[90,178],[113,173],[132,182],[135,217],[133,260],[132,307],[127,330],[110,353],[103,370],[100,417],[90,437],[70,437],[60,425],[61,400],[68,375],[75,363],[82,350],[82,323],[82,290],[85,250],[87,200]], shoulder: [112,195] } },
    { id: "mahir", ar: "ماهر", en: "Mahir", src: "assets/chars/mahir.webp", side: "assets/chars/side/mahir.webp", body: "assets/chars/side/mahir_body.webp", rig: { top: 0, bot: 639, cut: 586, pivot: 82,  mid: 82,  feet: true,  h: 86, near: [[68,586],[62,592],[50,606],[36,614],[28,620],[24,624],[25,636],[34,640],[212,640],[212,586]], arm: [[72,213],[100,208],[127,220],[132,250],[130,300],[123,350],[117,383],[110,400],[97,403],[95,430],[90,450],[77,455],[62,450],[53,430],[55,407],[62,397],[60,367],[59,317],[60,267],[65,233]], shoulder: [98,228] } },
    { id: "malik", ar: "مالك", en: "Malik", src: "assets/chars/malik.webp", side: "assets/chars/side/malik.webp", body: "assets/chars/side/malik_body.webp", rig: { top: 0, bot: 639, cut: 585, pivot: 120, mid: 120, feet: true,  h: 68, near: [[100,585],[94,590],[84,593],[76,602],[70,610],[67,620],[68,630],[74,638],[80,640],[238,640],[238,585]], arm: [[92,277],[127,270],[157,285],[170,323],[172,360],[163,383],[148,410],[140,430],[127,450],[110,452],[90,443],[77,427],[80,410],[100,393],[100,363],[97,330],[90,303]], shoulder: [125,295] } }
  ];
  // src = الصورة الأمامية (للقوائم). side = المنظر الجانبي من لوحة الشخصية (للعب، يمشي نحو اتجاه الحركة).
  // rig: خط الساقين ونقطة الارتكاز داخل صورة المنظر الجانبي، h = الطول داخل اللعبة (يحافظ على ترتيب الأعمار)
  // near: مضلع يحيط بالساق/القدم القريبة كاملة (الظاهرة بالكامل في الصورة).
  // أثناء المشي نرسم الساق القريبة مرتين: نسخة خلفية أغمق ونسخة أمامية — فتظهر ساقان وحذاءان كاملان دائمًا.

  function clipPiece(img, poly, dark) {
    var W = img.naturalWidth, H = img.naturalHeight;
    var c = document.createElement("canvas"); c.width = W; c.height = H;
    var g = c.getContext("2d"); g.beginPath();
    poly.forEach(function (pt, i) { if (i) g.lineTo(pt[0], pt[1]); else g.moveTo(pt[0], pt[1]); });
    g.closePath(); g.clip(); g.drawImage(img, 0, 0);
    if (dark) { g.globalCompositeOperation = "source-atop"; g.fillStyle = "rgba(20,10,30,0.28)"; g.fillRect(0, 0, W, H); }
    return c;
  }
  /* نقص الساق القريبة والذراع القريبة من الصورة الأصلية (كاملتين)، ونسخة أغمق لكل منهما للجهة الخلفية */
  function buildLegs(img) {
    var r = img.rig; if (!r.near || !img.naturalWidth) return;
    var top = Math.min.apply(null, r.near.map(function (p) { return p[1]; }));
    img.legs = { near: clipPiece(img, r.near, false), far: clipPiece(img, r.near, true), top: top };
    if (r.arm) img.arms = { near: clipPiece(img, r.arm, false), far: clipPiece(img, r.arm, true) };
  }
  var IMAGES = {};
  CHARACTERS.forEach(function (c) {
    var im = new Image(); im.rig = c.rig;
    im.onload = function () { buildLegs(im); };
    im.src = c.side; IMAGES[c.id] = im;
    // الجسم بدون الذراع القريبة (تُرسم الذراع فوقه وهي تتأرجح)
    var bd = new Image(); bd.onload = function () { im.bodyNoArm = bd; }; bd.src = c.body;
  });
  function charById(id) { for (var i = 0; i < CHARACTERS.length; i++) if (CHARACTERS[i].id === id) return CHARACTERS[i]; return null; }

  var state = { pickedChar: null, currentLesson: 0 };
  var P = window.Progress;

  /* ---------- أدوات ---------- */
  function show(id) {
    $$(".screen").forEach(function (s) { s.classList.toggle("active", s.id === "screen-" + id); });
    if (id !== "game") { window.Game.stop(); window.Sound.stopMusic(); }
    if (id === "lessons") renderLessons();
    if (id === "start") renderStart();
    if (id === "char") renderChars();
  }
  function bankFor(lesson) { return (window.QUESTION_BANKS && window.QUESTION_BANKS[lesson.id]) || []; }
  function toast(msg) {
    var t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove("show"); }, 2300);
  }
  function syncSoundButtons() {
    var m = window.Sound.isMuted();
    $$(".sound-btn").forEach(function (b) { b.textContent = m ? "🔇" : "🔊"; b.setAttribute("aria-pressed", m ? "true" : "false"); b.title = m ? "تشغيل الصوت" : "كتم الصوت"; });
  }
  function teacherText() {
    var t = CFG.teacher || {}, parts = [];
    if (t.name && t.name.trim()) parts.push("معلم/ة المادة: " + t.name.trim());
    if (t.instagram && t.instagram.trim()) parts.push("📷 Instagram: @" + t.instagram.trim().replace(/^@/, ""));
    return parts.join("  |  ");
  }
  // صيغة العدد العربية: 1 سؤال، 2 سؤالان، 3–10 أسئلة، 11+ سؤالًا
  function arCount(n, one, two, few, many) {
    if (n === 1) return one; if (n === 2) return two;
    if (n >= 3 && n <= 10) return n + " " + few; return n + " " + many;
  }
  function hearts(n) { var s = ""; for (var i = 0; i < CFG.startLives; i++) s += i < n ? "❤️" : "🤍"; return s; }

  /* ---------- شاشة البداية ---------- */
  function renderStart() {
    var d = P.get();
    var cont = $("#btn-continue");
    if (d.character && d.lastLesson) {
      var idx = LESSONS.findIndex(function (l) { return l.id === d.lastLesson; });
      if (idx >= 0 && bankFor(LESSONS[idx]).length) { cont.hidden = false; $("span", cont).textContent = LESSONS[idx].title; cont.dataset.idx = idx; }
      else cont.hidden = true;
    } else cont.hidden = true;
    $("#btn-change-char").hidden = !d.character;
  }

  /* ---------- اختيار الشخصية ---------- */
  function renderChars() {
    var grid = $(".char-grid"); grid.innerHTML = "";
    state.pickedChar = state.pickedChar || P.get().character;
    CHARACTERS.forEach(function (c) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "char-card"; b.setAttribute("role", "radio");
      b.setAttribute("aria-checked", state.pickedChar === c.id ? "true" : "false");
      b.dataset.id = c.id;
      b.innerHTML = '<img alt=""><span class="nm"></span><span class="en"></span>';
      $("img", b).src = c.src; $("img", b).alt = c.ar;
      $(".nm", b).textContent = c.ar; $(".en", b).textContent = c.en;
      b.addEventListener("click", function () {
        state.pickedChar = c.id; window.Sound.play("tap");
        $$(".char-card", grid).forEach(function (x) { x.setAttribute("aria-checked", x.dataset.id === c.id ? "true" : "false"); });
        $("#btn-confirm-char").disabled = false;
      });
      grid.appendChild(b);
    });
    $("#btn-confirm-char").disabled = !state.pickedChar;
  }

  /* ---------- قائمة الدروس ---------- */
  function renderLessons() {
    var d = P.get(), ch = charById(d.character);
    var chip = $("#lessons-char");
    if (ch) { $("img", chip).src = ch.src; $("span", chip).textContent = ch.ar; }
    $(".best-line").textContent = "🏆 أعلى نتيجة: " + d.highScore + "  ·  المراحل المكتملة: " + LESSONS.filter(function (l) { return P.lesson(l.id).completed; }).length + " من " + LESSONS.length;
    var list = $("#lesson-list"); list.innerHTML = "";
    UNITS.forEach(function (u) {
      var w = document.createElement("section"); w.className = "world";
      var h = document.createElement("h3"); h.textContent = u.title; w.appendChild(h);
      var grid = document.createElement("div"); grid.className = "world-levels"; w.appendChild(grid);
      LESSONS.forEach(function (l, i) {
        if (l.unit !== u.id) return;
        var n = bankFor(l).length, pr = P.lesson(l.id);
        var b = document.createElement("button"); b.type = "button"; b.className = "level-block";
        if (!n) b.classList.add("empty");
        if (d.lastLesson === l.id) b.classList.add("is-last");
        b.innerHTML = '<span class="num"></span><span><span class="ttl"></span><span class="meta"></span></span>';
        $(".num", b).textContent = i + 1;
        $(".ttl", b).textContent = l.icon + " " + l.title;
        $(".meta", b).textContent = n ? (arCount(n, "سؤال واحد", "سؤالان", "أسئلة", "سؤالًا") + (pr.bestScore ? "  ·  أفضل نتيجة " + pr.bestScore : "")) : "بانتظار الأسئلة";
        b.setAttribute("aria-label", "المرحلة " + (i + 1) + ": " + l.title + (n ? "" : " — بانتظار الأسئلة"));
        if (pr.completed) { var dn = document.createElement("span"); dn.className = "done"; dn.textContent = "✓ مكتملة"; b.appendChild(dn); }
        b.title = l.chapter;
        b.addEventListener("click", function () {
          if (!n) { window.Sound.play("bump"); return; }
          startLesson(i);
        });
        grid.appendChild(b);
      });
      list.appendChild(w);
    });
  }

  /* ---------- بدء المرحلة ---------- */
  function startLesson(i) {
    var d = P.get();
    if (!d.character) { show("char"); return; }
    state.currentLesson = i;
    var l = LESSONS[i];
    P.setLastLesson(l.id);
    show("game");
    $(".hud-subject").textContent = CFG.subject + " – " + CFG.grade;
    $(".hud-lesson").textContent = "المرحلة " + (i + 1) + ": " + l.title;
    window.Sound.unlock(); window.Sound.startMusic();
    var img = IMAGES[d.character];
    var go = function () { window.Game.resize(); window.Game.start(i, img); };
    if (img.complete && img.naturalWidth) go(); else img.onload = go;
  }

  /* ---------- نافذة السؤال ---------- */
  var LETTERS = ["أ", "ب", "ج", "د"], LETTERS_EN = ["A", "B", "C", "D"];
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  function showQuestion(q, reason, answerFn, closedFn) {
    var m = $("#modal-question");
    $(".q-reason", m).textContent = reason === "life" ? "💔 خسرت روحًا — أجب ثم تابع من آخر نقطة حفظ" : "🪙 جمعت " + arCount(window.Game.coins, "ذهبية واحدة", "ذهبيتين", "ذهبيات", "ذهبية") + " — حان وقت السؤال!";
    var ltr = (q.dir || CFG.questionDir) === "ltr"; // أسئلة اللغة الإنجليزية تُعرض من اليسار لليمين
    var card = $(".q-card", m), qt = $(".q-text", m), box0 = $(".q-options", m);
    qt.setAttribute("dir", ltr ? "ltr" : "rtl"); qt.setAttribute("lang", ltr ? "en" : "ar");
    box0.setAttribute("dir", ltr ? "ltr" : "rtl");
    card.classList.toggle("is-ltr", ltr);
    $(".q-type", m).textContent = q.type === "tf" ? (ltr ? "True or False" : "صح أو خطأ") : (ltr ? "Choose the correct answer" : "اختيار من متعدد");
    $(".q-text", m).textContent = q.text;
    // بيانات المعلم فقط (إن وُجدت) — لا يُعرض المصدر ولا رقم الصفحة للطالب
    var tt = teacherText(); $(".q-foot", m).hidden = !tt; $(".q-teacher", m).textContent = tt;
    var fb = $(".q-feedback", m); fb.textContent = ""; fb.className = "q-feedback";
    var cont = $(".q-continue", m); cont.hidden = true;
    var box = $(".q-options", m); box.innerHTML = ""; box.className = "q-options" + (q.type === "tf" ? " tf" : "");
    var locked = false;

    var choices;
    if (q.type === "tf") choices = ltr ? [{ label: "True ✓", value: true, cls: "tf-true" }, { label: "False ✗", value: false, cls: "tf-false" }]
                                       : [{ label: "صح ✓", value: true, cls: "tf-true" }, { label: "خطأ ✗", value: false, cls: "tf-false" }];
    else choices = shuffle(q.options.map(function (o, idx) { return { label: o, value: idx }; }));

    choices.forEach(function (c, k) {
      var b = document.createElement("button"); b.type = "button"; b.className = "q-opt" + (c.cls ? " " + c.cls : "");
      if (q.type === "tf") b.textContent = c.label;
      else { var lt = document.createElement("span"); lt.className = "lt"; lt.textContent = (ltr ? LETTERS_EN : LETTERS)[k]; var tx = document.createElement("span"); tx.textContent = c.label; b.appendChild(lt); b.appendChild(tx); }
      b.addEventListener("click", function () {
        if (locked) return; // منع احتساب الإجابة مرتين
        locked = true;
        $$(".q-opt", box).forEach(function (x) { x.disabled = true; });
        box.classList.add("locked");
        var ok = answerFn(c.value);
        if (ok) { b.classList.add("picked-ok"); fb.textContent = "✔ إجابة صحيحة! +" + CFG.points.correctAnswer + " نقطة"; fb.className = "q-feedback ok"; }
        else { b.classList.add("picked-bad"); fb.textContent = "حاول مرة أخرى عندما يظهر السؤال لاحقًا  (−1 ❤️)"; fb.className = "q-feedback bad"; }
        cont.hidden = false; cont.textContent = window.Game.lives <= 0 ? "عرض النتيجة" : "متابعة اللعب ◀";
        setTimeout(function () { cont.focus(); }, 30);
      });
      box.appendChild(b);
    });

    cont.onclick = function () {
      cont.onclick = null; m.hidden = true; window.Sound.play("tap");
      closedFn();
    };
    m.hidden = false;
    setTimeout(function () { var f = $(".q-opt", box); if (f) f.focus({ preventScroll: true }); }, 30);
  }

  /* ---------- النتائج ---------- */
  function onFinish(won, st) {
    window.Sound.duckMusic && window.Sound.duckMusic(true);
    var l = LESSONS[state.currentLesson];
    var rec = P.recordResult(l.id, { completed: won, score: st.score, coins: st.coins, pct: st.pct });
    var m = $("#modal-result");
    var ch = charById(P.get().character);
    $(".result-char", m).src = ch ? ch.src : ""; $(".result-char", m).alt = ch ? ch.ar : "";
    $(".result-title", m).textContent = won ? "🎉 أحسنت! أكملت المرحلة" : "انتهت المحاولة";
    $(".result-lesson", m).textContent = "المرحلة " + (state.currentLesson + 1) + ": " + l.title;
    var rows = [["⭐ النقاط", st.score], ["🪙 الذهب", st.coins], ["❓ الأسئلة", st.asked], ["✔ الصحيحة", st.correct], ["✗ الخاطئة", st.wrong], ["📊 النسبة", st.pct + "%"]];
    if (won) rows.push(["❤️ الأرواح المتبقية", st.lives]);
    rows.push(["🏆 أفضل نتيجة للدرس", rec.bestScore]);
    var grid = $(".result-grid", m); grid.innerHTML = "";
    rows.forEach(function (r) { var d = document.createElement("div"); var a = document.createElement("span"); a.textContent = r[0]; var b = document.createElement("b"); b.textContent = r[1]; d.appendChild(a); d.appendChild(b); grid.appendChild(d); });
    var acts = $(".result-actions", m); acts.innerHTML = "";
    function act(label, cls, fn) { var b = document.createElement("button"); b.type = "button"; b.className = "btn " + cls; b.textContent = label; b.addEventListener("click", function () { m.hidden = true; fn(); }); acts.appendChild(b); return b; }
    var first;
    if (won) {
      var next = state.currentLesson + 1;
      while (next < LESSONS.length && !bankFor(LESSONS[next]).length) next++;
      if (next < LESSONS.length) first = act("المرحلة التالية ◀", "btn-gold btn-lg", function () { startLesson(next); });
      var r = act("إعادة المرحلة", first ? "btn-green" : "btn-gold btn-lg", function () { startLesson(state.currentLesson); });
      first = first || r;
    } else first = act("إعادة المحاولة (3 أرواح)", "btn-gold btn-lg", function () { startLesson(state.currentLesson); });
    act("قائمة الدروس", "btn-blue", function () { show("lessons"); });
    var tt = teacherText(); $(".teacher-line", m).hidden = !tt; $(".teacher-line", m).textContent = tt;
    m.hidden = false;
    setTimeout(function () { first.focus(); }, 30);
  }

  /* ---------- الإيقاف المؤقت ---------- */
  function openPause() {
    if (window.Game.state !== "play") return;
    window.Game.pause(); window.Sound.duckMusic(true);
    $("#modal-pause").hidden = false; $("#modal-pause [data-act=resume]").focus();
  }
  function closePause() { $("#modal-pause").hidden = true; window.Sound.duckMusic(false); window.Game.resume(); }

  /* ---------- التحكم باللمس ---------- */
  function bindTouch() {
    var Input = window.GameInput;
    $$(".tc-btn").forEach(function (b) {
      var key = b.dataset.key;
      function down(e) {
        e.preventDefault(); window.Sound.unlock();
        if (b.setPointerCapture && e.pointerId != null) try { b.setPointerCapture(e.pointerId); } catch (x) {}
        b.classList.add("on");
        if (key === "jump") Input.pressJump(); else Input[key] = true;
      }
      function up(e) {
        e.preventDefault(); b.classList.remove("on");
        if (key === "jump") Input.releaseJump(); else Input[key] = false;
      }
      b.addEventListener("pointerdown", down);
      b.addEventListener("pointerup", up); b.addEventListener("pointercancel", up); b.addEventListener("lostpointercapture", up);
      b.addEventListener("contextmenu", function (e) { e.preventDefault(); });
    });
    var isTouch = ("ontouchstart" in window) || navigator.maxTouchPoints > 0 || (window.matchMedia && matchMedia("(pointer: coarse)").matches);
    if (isTouch) document.documentElement.classList.add("is-touch");
    window.addEventListener("touchstart", function () {
      if (!document.documentElement.classList.contains("is-touch")) { document.documentElement.classList.add("is-touch"); window.Game.resize(); }
    }, { once: true, passive: true });
  }

  /* ---------- التهيئة ---------- */
  function init() {
    $("#title-game").textContent = CFG.gameTitle;
    $("#title-subject").textContent = CFG.subject;
    $("#title-grade").textContent = CFG.grade;
    $("#title-term").textContent = CFG.term;
    document.title = CFG.gameTitle + " – " + CFG.subject + " " + CFG.grade + " | أكاديمية مها";
    var tt = teacherText();
    $$(".teacher-line").forEach(function (el) { el.hidden = !tt; el.textContent = tt; });
    var tb = $(".teacher-badge"); tb.hidden = !tt; tb.textContent = tt;
    $$(".academy-home").forEach(function (a) { a.href = CFG.academyHomeUrl; });

    $$(".sound-btn").forEach(function (b) { b.addEventListener("click", function () { window.Sound.unlock(); window.Sound.toggle(); syncSoundButtons(); window.Sound.play("tap"); }); });
    syncSoundButtons();

    $("#btn-play").addEventListener("click", function () { window.Sound.unlock(); window.Sound.play("tap"); show("char"); });
    $("#btn-continue").addEventListener("click", function () { window.Sound.unlock(); startLesson(+this.dataset.idx); });
    $("#btn-change-char").addEventListener("click", function () { show("char"); });
    $("#lessons-char").addEventListener("click", function () { show("char"); });
    $$("[data-go]").forEach(function (b) { b.addEventListener("click", function () { window.Sound.play("tap"); show(b.dataset.go); }); });
    $("#btn-confirm-char").addEventListener("click", function () {
      if (!state.pickedChar) return;
      P.setCharacter(state.pickedChar); window.Sound.play("correct");
      show("lessons");
    });

    $("#btn-pause").addEventListener("click", openPause);
    $("#modal-pause").addEventListener("click", function (e) {
      var a = e.target.closest("[data-act]"); if (!a) return;
      var act = a.dataset.act; $("#modal-pause").hidden = true;
      if (act === "resume") closePause();
      else if (act === "restart") startLesson(state.currentLesson);
      else if (act === "lessons") show("lessons");
      else if (act === "char") show("char");
    });
    window.addEventListener("keydown", function (e) {
      if ((e.code === "Escape" || e.code === "KeyP") && $("#screen-game").classList.contains("active")) {
        if (!$("#modal-pause").hidden) closePause(); else openPause();
      }
    });
    document.addEventListener("visibilitychange", function () { if (document.hidden) openPause(); });

    bindTouch();
    window.Game.init($("#game-canvas"), {
      hud: function (h) {
        $(".hud-stat.lives").textContent = hearts(h.lives);
        $(".hud-stat.lives").setAttribute("aria-label", "الأرواح: " + h.lives);
        $(".hud-stat.coins b").textContent = h.coins;
        $(".hud-stat.score b").textContent = h.score;
      },
      showQuestion: showQuestion,
      onFinish: onFinish,
      toast: toast
    });
    renderStart();
  }

  var ready = document.fonts && document.fonts.load ? Promise.all([document.fonts.load("900 20px Cairo", "؟"), document.fonts.load("800 20px Baloo", "مغامرة")]).catch(function () {}) : Promise.resolve();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { ready.then(init, init); });
  else ready.then(init, init);

  window.UI = { show: show, startLesson: startLesson, CHARACTERS: CHARACTERS };
})();
