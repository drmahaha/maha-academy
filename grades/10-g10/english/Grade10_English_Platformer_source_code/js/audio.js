/* =========================================================
   الصوت — موسيقى ومؤثرات أصلية مُولَّدة بـ Web Audio (بدون ملفات صوتية)
   ========================================================= */
(function () {
  "use strict";
  var ctx = null, master = null, musicGain = null, sfxGain = null;
  var muted = false, musicOn = false, musicTimer = null, nextNoteTime = 0, step = 0;
  var MUTE_KEY = "mahaSciencePlatformer_muted";
  try { muted = localStorage.getItem(MUTE_KEY) === "1"; } catch (e) {}

  function ensure() {
    if (ctx) return true;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = muted ? 0 : 0.9; master.connect(ctx.destination);
    musicGain = ctx.createGain(); musicGain.gain.value = 0.16; musicGain.connect(master);
    sfxGain = ctx.createGain(); sfxGain.gain.value = 0.5; sfxGain.connect(master);
    return true;
  }

  function tone(freq, start, dur, type, vol, dest, slideTo) {
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || "square";
    o.frequency.setValueAtTime(freq, start);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, start + dur);
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(vol || 0.3, start + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    o.connect(g); g.connect(dest || sfxGain);
    o.start(start); o.stop(start + dur + 0.02);
  }
  function noise(start, dur, vol) {
    var len = Math.floor(ctx.sampleRate * dur), buf = ctx.createBuffer(1, len, ctx.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    var s = ctx.createBufferSource(), g = ctx.createGain();
    s.buffer = buf; g.gain.value = vol || 0.2; s.connect(g); g.connect(sfxGain); s.start(start);
  }

  /* ---------- مؤثرات ---------- */
  var SFX = {
    jump: function (t) { tone(330, t, 0.16, "square", 0.22, null, 700); },
    coin: function (t) { tone(988, t, 0.07, "square", 0.2); tone(1319, t + 0.07, 0.22, "square", 0.2); },
    bump: function (t) { tone(140, t, 0.08, "triangle", 0.35); },
    stomp: function (t) { tone(400, t, 0.1, "square", 0.25, null, 120); noise(t, 0.06, 0.15); },
    correct: function (t) { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, t + i * 0.08, 0.18, "square", 0.2); }); },
    wrong: function (t) { tone(311, t, 0.18, "triangle", 0.35); tone(233, t + 0.18, 0.3, "triangle", 0.35); },
    lose: function (t) { tone(660, t, 0.6, "square", 0.22, null, 110); },
    checkpoint: function (t) { tone(784, t, 0.1, "square", 0.18); tone(1175, t + 0.1, 0.2, "square", 0.18); },
    win: function (t) {
      var seq = [523, 659, 784, 1047, 784, 1047, 1319];
      seq.forEach(function (f, i) { tone(f, t + i * 0.12, i === seq.length - 1 ? 0.6 : 0.14, "square", 0.22); });
      [262, 330, 392, 523].forEach(function (f, i) { tone(f, t + i * 0.24, 0.24, "triangle", 0.3); });
    },
    gameover: function (t) { [392, 349, 330, 262].forEach(function (f, i) { tone(f, t + i * 0.22, 0.3, "triangle", 0.35); }); },
    popup: function (t) { tone(600, t, 0.12, "sine", 0.25, null, 900); },
    tap: function (t) { tone(880, t, 0.04, "sine", 0.12); }
  };

  /* ---------- موسيقى أصلية (لحن مرح بطابع ألعاب 8-بت) ---------- */
  // ملاحظات MIDI؛ 0 = صمت. 16 خطوة لكل مازورة، 4 مازورات
  var LEAD = [
    72,0,76,0, 79,0,76,74, 72,0,74,76, 74,0,0,0,
    72,0,76,0, 79,0,81,79, 77,0,76,74, 72,0,0,0,
    77,0,77,79, 81,0,79,77, 76,0,76,77, 79,0,76,0,
    74,0,76,74, 72,0,71,72, 74,0,79,0, 72,0,0,0
  ];
  var BASS = [
    48,0,55,0, 48,0,55,0, 53,0,60,0, 55,0,50,0,
    48,0,55,0, 48,0,55,0, 53,0,60,0, 55,0,48,0,
    53,0,60,0, 53,0,60,0, 48,0,55,0, 52,0,55,0,
    50,0,57,0, 48,0,55,0, 55,0,59,0, 48,0,43,0
  ];
  var TEMPO = 132, STEP = 60 / TEMPO / 4;
  function midi(n) { return 440 * Math.pow(2, (n - 69) / 12); }
  function schedule() {
    while (nextNoteTime < ctx.currentTime + 0.15) {
      var i = step % LEAD.length;
      if (LEAD[i]) tone(midi(LEAD[i]), nextNoteTime, STEP * 1.6, "square", 0.25, musicGain);
      if (BASS[i]) tone(midi(BASS[i]), nextNoteTime, STEP * 1.8, "triangle", 0.5, musicGain);
      if (i % 4 === 2) { // إيقاع خفيف
        var s = nextNoteTime;
        var len = Math.floor(ctx.sampleRate * 0.03), buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
        for (var k = 0; k < len; k++) d[k] = (Math.random() * 2 - 1) * (1 - k / len);
        var src = ctx.createBufferSource(), g = ctx.createGain(); src.buffer = buf; g.gain.value = 0.12;
        src.connect(g); g.connect(musicGain); src.start(s);
      }
      nextNoteTime += STEP; step++;
    }
  }

  window.Sound = {
    unlock: function () { if (ensure() && ctx.state === "suspended") ctx.resume(); },
    play: function (name) {
      if (muted || !ensure() || !SFX[name]) return;
      if (ctx.state === "suspended") ctx.resume();
      try { SFX[name](ctx.currentTime + 0.005); } catch (e) {}
    },
    startMusic: function () {
      if (!ensure()) return;
      if (musicOn) return;
      musicOn = true; step = 0; nextNoteTime = ctx.currentTime + 0.1;
      musicTimer = setInterval(function () { if (!muted) schedule(); else nextNoteTime = ctx.currentTime + 0.1; }, 50);
    },
    stopMusic: function () { musicOn = false; if (musicTimer) clearInterval(musicTimer); musicTimer = null; },
    duckMusic: function (on) { if (musicGain) musicGain.gain.setTargetAtTime(on ? 0.05 : 0.16, ctx.currentTime, 0.1); },
    isMuted: function () { return muted; },
    setMuted: function (m) {
      muted = !!m;
      try { localStorage.setItem(MUTE_KEY, muted ? "1" : "0"); } catch (e) {}
      if (master) master.gain.setTargetAtTime(muted ? 0 : 0.9, ctx.currentTime, 0.02);
    },
    toggle: function () { this.setMuted(!muted); return muted; }
  };
})();
