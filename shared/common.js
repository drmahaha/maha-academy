/* ==========================================================================
   Maha Academy — Shared Site Script
   Reusable helpers for every game: text-to-speech narration and the
   star/progress reward system. Page-specific game logic (hotspots,
   scoring rules, etc.) belongs in that page's own <script> block.
   ========================================================================== */

window.MahaAcademy = (function () {
  "use strict";

  /* ---------------- Text-to-speech ---------------- */

  function speak(text, opts) {
    opts = opts || {};
    if (!("speechSynthesis" in window)) {
      console.warn("Speech synthesis not supported in this browser.");
      if (typeof opts.onend === "function") opts.onend();
      return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = opts.lang || "en-US";
    utter.rate = opts.rate || 0.95;
    utter.pitch = opts.pitch || 1.05;
    if (typeof opts.onstart === "function") utter.onstart = opts.onstart;
    if (typeof opts.onend === "function") utter.onend = opts.onend;
    if (typeof opts.onboundary === "function") utter.onboundary = opts.onboundary;
    window.speechSynthesis.cancel(); // stop anything currently playing
    window.speechSynthesis.speak(utter);
  }

  // Speak a list of lines in order, calling onLineStart(index) as each
  // begins and onDone() once the whole sequence has finished. Useful for
  // karaoke-style text highlighting.
  function speakSequence(lines, opts) {
    opts = opts || {};
    let i = 0;
    if (!("speechSynthesis" in window) || !lines.length) {
      if (typeof opts.onDone === "function") opts.onDone();
      return;
    }
    window.speechSynthesis.cancel();
    function next() {
      if (i >= lines.length) {
        if (typeof opts.onDone === "function") opts.onDone();
        return;
      }
      const idx = i;
      i++;
      speak(lines[idx], {
        lang: opts.lang,
        rate: opts.rate,
        pitch: opts.pitch,
        onstart: function () {
          if (typeof opts.onLineStart === "function") opts.onLineStart(idx);
        },
        onend: next,
      });
    }
    next();
  }

  function stopSpeaking() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }

  /* ---------------- Star / progress system ---------------- */
  // Progress is namespaced per game id and stored in localStorage so a
  // child's stars persist between visits on the same device.

  function storageKey(gameId) {
    return "maha-academy:progress:" + gameId;
  }

  function getProgress(gameId, totalStars) {
    try {
      const raw = localStorage.getItem(storageKey(gameId));
      const earned = raw ? JSON.parse(raw) : [];
      return { earned: earned, total: totalStars };
    } catch (e) {
      return { earned: [], total: totalStars };
    }
  }

  function awardStar(gameId, starId) {
    try {
      const raw = localStorage.getItem(storageKey(gameId));
      const earned = raw ? JSON.parse(raw) : [];
      if (earned.indexOf(starId) === -1) earned.push(starId);
      localStorage.setItem(storageKey(gameId), JSON.stringify(earned));
      return earned;
    } catch (e) {
      return [];
    }
  }

  // Renders `total` star glyphs into `container` (a DOM element) and marks
  // the ones in `earnedIds` (array) as earned. Returns a function you can
  // call again later to re-render after a new star is earned.
  function renderStars(container, totalIds, earnedIds) {
    container.innerHTML = "";
    totalIds.forEach(function (id) {
      const span = document.createElement("span");
      span.className = "ma-star" + (earnedIds.indexOf(id) !== -1 ? " earned" : "");
      span.textContent = "★"; // ★
      span.dataset.starId = id;
      container.appendChild(span);
    });
  }

  function celebrateStar(container, starId) {
    const el = container.querySelector('[data-star-id="' + starId + '"]');
    if (el) {
      el.classList.add("earned", "just-earned");
      setTimeout(function () { el.classList.remove("just-earned"); }, 550);
    }
  }

  return {
    speak: speak,
    speakSequence: speakSequence,
    stopSpeaking: stopSpeaking,
    getProgress: getProgress,
    awardStar: awardStar,
    renderStars: renderStars,
    celebrateStar: celebrateStar,
  };
})();
