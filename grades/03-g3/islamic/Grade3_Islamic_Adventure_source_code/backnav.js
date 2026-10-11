/* Maha Academy — browser Back button inside games.
   Each game is one web page whose screens are swapped by JavaScript, so the browser's
   ← Back used to leave the game at once. This keeps one "guard" entry in the browser
   history while the player is past the start screen; pressing ← Back (or the phone's
   back gesture) then moves UP one level inside the game, like the game's own ⬅ buttons:
     English Adventure:            lesson / results → map → start screen
     Math Lab / Story Library /
     Science Bus:                  lesson → module → hub → start screen
   From the start screen, ← Back leaves the game as usual. */
(function () {
  "use strict";
  if (window.MahaBackNav) return;
  var START = { splash: 1, welcome: 1 };
  var guarded = false;

  function current() {
    var el = document.querySelector(".screen.active");
    return el ? el.id.replace(/^screen-/, "") : null;
  }
  function call(name) {
    if (typeof window[name] === "function") { window[name](); return true; }
    return false;
  }
  function up() {
    var s = current();
    if (s === "map" || s === "hub") { call("goHome") || call("goWelcome"); return; }
    if (s === "activity" || s === "activityEnd") {
      try {
        /* global session, openModule */
        if (typeof session !== "undefined" && session && typeof openModule === "function") { openModule(session.modKey); return; }
      } catch (e) {}
      call("goHub"); return;
    }
    if (s === "module" || s === "progress") { call("goHub"); return; }
    /* English Adventure: game, gameEnd, final */
    call("goMap") || call("goHub") || call("goHome") || call("goWelcome");
  }
  function guard() {
    if (guarded) return;
    try { history.pushState({ mahaBackGuard: true }, ""); guarded = true; } catch (e) {}
  }

  function hook() {
    var orig = window.showScreen;
    if (typeof orig !== "function" || orig.__backnav) return;
    var w = function (id) {
      var r = orig.apply(this, arguments);
      if (!START[id]) guard();
      return r;
    };
    w.__backnav = true;
    if (orig.__sfx) w.__sfx = true;
    window.showScreen = w;
  }

  window.addEventListener("popstate", function () {
    guarded = false;
    var s = current();
    if (!s || START[s]) return;          // already at the start screen: let the browser leave
    up();
    if (!START[current()]) guard();      // still inside the game: keep a guard for the next ← Back
  });

  hook();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", hook);
  window.MahaBackNav = { up: up };
})();
