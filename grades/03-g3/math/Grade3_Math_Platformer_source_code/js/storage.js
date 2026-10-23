/* حفظ التقدم محليًا (Local Storage) — بدون تسجيل دخول */
(function () {
  "use strict";
  var KEY = window.GAME_CONFIG.storageKey;
  function blank() {
    return { character: null, lastLesson: null, highScore: 0, lessons: {} };
  }
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return blank();
      var d = JSON.parse(raw);
      var b = blank();
      for (var k in b) if (d[k] === undefined) d[k] = b[k];
      return d;
    } catch (e) { return blank(); }
  }
  var data = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {} }

  window.Progress = {
    get: function () { return data; },
    setCharacter: function (c) { data.character = c; save(); },
    setLastLesson: function (id) { data.lastLesson = id; save(); },
    lesson: function (id) { return data.lessons[id] || { completed: false, bestScore: 0, bestCoins: 0, bestPct: 0 }; },
    recordResult: function (id, r) {
      var L = data.lessons[id] || { completed: false, bestScore: 0, bestCoins: 0, bestPct: 0 };
      if (r.completed) L.completed = true;
      L.bestScore = Math.max(L.bestScore, r.score);
      L.bestCoins = Math.max(L.bestCoins, r.coins);
      if (r.completed) L.bestPct = Math.max(L.bestPct || 0, r.pct || 0);
      data.lessons[id] = L;
      data.highScore = Math.max(data.highScore, r.score);
      save();
      return L;
    },
    reset: function () { data = blank(); save(); }
  };
})();
