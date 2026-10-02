/* Maha Academy — interactive sound effects (no music).
   All sounds are generated live with the Web Audio API, so there are no audio files.
   Hooks into the engine's own functions: correct / wrong / hint / finish / confetti / screen change,
   plus a soft tap on every clickable element. A 🔊 button (saved per browser) mutes everything. */
(function () {
  "use strict";
  if (window.MahaSFX) return;
  var KEY = "mahaSfxMuted";
  var muted = false;
  try { muted = localStorage.getItem(KEY) === "1"; } catch (e) {}
  var ctx = null, master = null;

  function ac() {
    if (!ctx) {
      var C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      ctx = new C();
      master = ctx.createGain();
      master.gain.value = 0.35;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tone(freq, start, dur, opt) {
    opt = opt || {};
    var c = ctx, t = c.currentTime + start;
    var o = c.createOscillator(), g = c.createGain();
    o.type = opt.type || "sine";
    o.frequency.setValueAtTime(freq, t);
    if (opt.to) o.frequency.exponentialRampToValueAtTime(opt.to, t + dur);
    var v = opt.vol == null ? 0.3 : opt.vol;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v, t + Math.min(0.012, dur / 3));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    var node = o;
    if (opt.lp) { var f = c.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = opt.lp; o.connect(f); node = f; }
    node.connect(g); g.connect(master);
    o.start(t); o.stop(t + dur + 0.05);
  }

  function noise(start, dur, vol, fromHz, toHz) {
    var c = ctx, t = c.currentTime + start;
    var len = Math.floor(c.sampleRate * dur), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    var s = c.createBufferSource(); s.buffer = buf;
    var f = c.createBiquadFilter(); f.type = "bandpass"; f.Q.value = 1.2;
    f.frequency.setValueAtTime(fromHz, t); f.frequency.exponentialRampToValueAtTime(toHz, t + dur);
    var g = c.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.3); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(master); s.start(t); s.stop(t + dur + 0.05);
  }

  var SOUNDS = {
    tap: function () { tone(700, 0, 0.06, { to: 520, vol: 0.12 }); },
    correct: function () {
      tone(784, 0, 0.12, { type: "triangle", vol: 0.32 });
      tone(1175, 0.09, 0.22, { type: "triangle", vol: 0.3 });
      tone(2350, 0.09, 0.18, { vol: 0.05 });
    },
    wrong: function () {
      tone(330, 0, 0.13, { type: "square", vol: 0.12, lp: 900 });
      tone(247, 0.13, 0.2, { type: "square", vol: 0.12, lp: 800 });
    },
    bump: function () { tone(160, 0, 0.09, { to: 110, vol: 0.2 }); },
    hint: function () { [1568, 2093, 2637].forEach(function (f, i) { tone(f, i * 0.06, 0.14, { vol: 0.1 }); }); },
    whoosh: function () { noise(0, 0.22, 0.08, 500, 2200); },
    sparkle: function () { for (var i = 0; i < 6; i++) tone(1800 + Math.random() * 1600, i * 0.07, 0.12, { vol: 0.06 }); },
    finish: function () {
      [523, 659, 784, 1047].forEach(function (f, i) { tone(f, i * 0.1, 0.18, { type: "triangle", vol: 0.28 }); });
      [523, 659, 784, 1047].forEach(function (f) { tone(f, 0.42, 0.6, { type: "triangle", vol: 0.12 }); });
    }
  };

  var lastSemantic = 0, lastAny = 0;
  var activated = false;
  ["pointerdown", "keydown", "touchstart"].forEach(function (ev) {
    window.addEventListener(ev, function () { activated = true; }, { capture: true, passive: true });
  });
  function play(name, semantic) {
    if (muted || !activated) return;
    var now = performance.now();
    if (semantic === false && now - lastAny < 150) return;      // background sounds yield to others
    if (!ac()) return;
    try { SOUNDS[name](); } catch (e) {}
    lastAny = now;
    if (semantic !== false) lastSemantic = now;
  }

  function wrap(name, sound, semantic) {
    var fn = window[name];
    if (typeof fn !== "function" || fn.__sfx) return;
    var w = function () { play(sound, semantic); return fn.apply(this, arguments); };
    w.__sfx = true;
    window[name] = w;
  }

  function hook() {
    wrap("finalizeRoundSuccess", "correct");
    wrap("showMistakeFeedback", "wrong");
    wrap("finishMachineSession", "finish");
    wrap("finishGame", "finish");
    wrap("renderFinalScreen", "finish");
    wrap("showHint", "hint");
    wrap("showOrderHint", "hint");
    wrap("spawnConfetti", "sparkle", false);
    wrap("showScreen", "whoosh", false);
    var flash = window.flash;
    if (typeof flash === "function" && !flash.__sfx) {
      var wf = function (el, cls) {
        if (!cls || cls === "shake") { if (performance.now() - lastSemantic > 250) play("bump"); }
        return flash.apply(this, arguments);
      };
      wf.__sfx = true; window.flash = wf;
    }
  }

  function clickable(el) {
    for (var i = 0; el && el !== document.body && i < 5; i++, el = el.parentElement) {
      if (el.matches && el.matches("button, a, [role=button], [onclick], input, select, label, .btn")) return el.disabled ? null : el;
      try { if (getComputedStyle(el).cursor === "pointer") return el; } catch (e) {}
    }
    return null;
  }

  document.addEventListener("click", function (e) {
    if (e.target && e.target.closest && e.target.closest("#mahaSfxToggle")) return;
    if (!clickable(e.target)) return;
    var t0 = performance.now();
    setTimeout(function () { if (lastAny < t0) play("tap", false); }, 0);
  }, true);

  // hint buttons in the Math Lab / Story Library / Science Bus engine
  document.addEventListener("click", function (e) {
    if (e.target && e.target.closest && e.target.closest(".hint-tier-btn")) play("hint");
  }, true);

  function addToggle() {
    if (document.getElementById("mahaSfxToggle")) return;
    var b = document.createElement("button");
    b.id = "mahaSfxToggle"; b.type = "button";
    b.setAttribute("aria-label", "الأصوات / Sounds");
    b.title = "الأصوات / Sounds";
    b.style.cssText = "position:fixed;bottom:14px;left:14px;z-index:99999;width:44px;height:44px;border-radius:50%;" +
      "border:2px solid rgba(255,255,255,.7);background:rgba(46,26,71,.85);color:#fff;font-size:20px;line-height:1;" +
      "cursor:pointer;box-shadow:0 3px 10px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;padding:0;";
    var paint = function () { b.textContent = muted ? "🔇" : "🔊"; };
    paint();
    b.addEventListener("click", function () {
      muted = !muted;
      try { localStorage.setItem(KEY, muted ? "1" : "0"); } catch (e) {}
      paint();
      if (!muted) { ac(); SOUNDS.tap(); }
    });
    document.body.appendChild(b);
  }

  hook();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { hook(); addToggle(); });
  else addToggle();

  window.MahaSFX = { play: play, isMuted: function () { return muted; } };
})();
