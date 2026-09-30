Maha Academy — Math Lab, Grade 7 (مختبر الرياضيات - الصف الأول المتوسط)
=========================================

This folder holds the editable SOURCE files for the game. The single file
you play/share ("Grade7_MathLab.html") is generated FROM these files —
don't hand-edit the final file, edit the source here instead.

This is a THIRD, completely separate engine — different from both the
English Adventure games and the Math Adventure (map/star) game:
  - No world map. Instead: a "Math Laboratory" hub screen with 5 modules
    (Algebra, Integers, Functions, Ratios, Challenge Arena), each holding
    a set of interactive "machines" (stations) you open and play.
  - Every machine is a genuine hands-on manipulation — click chips, drag
    tiles, build an expression from palettes, balance an equation, cancel
    zero pairs, place points on a graph, fill a ratio table — never a
    plain multiple-choice quiz.
  - XP + Level + per-module Mastery% progression (not stars), with
    difficulty that quietly auto-adjusts up/down based on your last few
    answers in that module.
  - Dynamic, randomized question generation (the GEN.* functions in
    data.js) — every playthrough uses different numbers, so replaying a
    machine is never just memorizing the same round.
  - A 3-tier hint system on every machine: Think → Guide → Solution.
    Never reveals the answer immediately.
  - Dark "laboratory" visual theme (navy/purple background, teal/cyan/gold
    glass panels, monospace numbers) — deliberately different from the
    Adventure games' purple-gradient/white-card look, so the two feel like
    distinct products even though they teach the same grade/subject.
  - Same characters as always (Mahir, Maya, Marya, Malik) but with
    DIFFERENT roles here: Mahir asks discovery questions, Maya is the
    reasoning mentor, Marya builds/operates the machines, and Malik only
    shows up for round-end celebration — see CHAR_FOR_MACHINE in engine.js.
  - Arabic-primary/RTL with the same "AR / AR+EN" toggle as the other games.

Files:
  index.html       Page structure/markup (the "skeleton" of every screen)
  styles.css        All visual styling (dark lab theme, colors, layout)
  data.js           LEVEL_TITLES, MODULES registry, and every GEN.* random
                     question generator (one per machine)
  engine.js         The game engine: hub/module/activity navigation, the
                     hint system, XP/mastery/difficulty logic, and the
                     RENDERERS.* object — one bespoke interactive UI per
                     machine (15 of them; the Challenge Arena reuses them)
  app.js            Small glue code: navigation, settings, startup, AR/EN
                     toggle, reset-progress
  build.py          Combines all of the above into the single final HTML

If you want to build another grade's Math Lab yourself: copy this whole
folder, replace data.js's MODULES/GEN content, and change the
PROGRESS_KEY line near the top of engine.js to a new unique name (e.g.
"mahaMathLabProgress_g8_v1") so its saved progress doesn't overwrite
another grade's on the same device. The current key is
"mahaMathLabProgress_g7_v1" — deliberately different from both the
English Adventure keys and the Math Adventure key
("mahaAcademyProgress_g7math_v1") so all three can coexist in the same
browser without clobbering each other's localStorage.

Adding a new machine: give it an entry in a MODULES[i].machines array
(key, titleAr/En, emoji, descAr/En), write a GEN.<key>(tier) function in
data.js that returns everything RENDERERS.<key> needs for one round, add
that RENDERERS.<key> function in engine.js (renders the round + wires up
its own "check answer" logic, ending with finalizeRoundSuccess() or
showMistakeFeedback()), and add 3 tiers to hintTiers() for it. If it
should appear in the mixed Challenge Arena, add its key to ARENA_POOL.

IMPORTANT — a hard-won lesson from building this engine (an RTL/bidi bug
that cost significant debugging time): in an <html dir="rtl"> page, any
span you wrap in dir="ltr" to keep numbers left-to-right is normally
enough — but if that SAME span's own text contains a colon (":") AND
there is ANOTHER colon anywhere else in the same paragraph/element
(e.g. "Base ratio: <span dir=ltr>4 : 3</span> (fuel : distance)"), some
browsers can still visually reverse the digits inside the span, even
though the DOM/computed-style is 100% correct and a screenshot is the
only way to catch it (this was confirmed to happen reliably in the real
built game, not just in theory). The fix that reliably worked was NOT
another CSS trick — it was structural: give the number its own, separate
element with nothing else sharing its paragraph (see the .ratio-badge
div in RENDERERS.ratiobuilder for the pattern). The general rule: if a
piece of text you're displaying has more than one number/token with a
left-right relationship (a ratio, a signed number, a coordinate pair, an
equation), either use the global L() helper AND put nothing else after it
in the same element, or better, give it a dedicated sibling element.
Always verify with an actual screenshot (not just reading the HTML
source) after adding any new Arabic-text-plus-numbers UI — re-run it
several times, since this class of bug can be inconsistent from one
render to the next.

How to preview changes while you edit:
  Open index-dev.html directly in your browser (double-click it). It loads
  styles.css/data.js/engine.js/app.js as normal separate files, so you can
  edit any of them, refresh the page, and see your change immediately —
  no build step needed.

How to produce the final, single-file game to share or play standalone:
  Run in Terminal, from inside this folder:
    python3 build.py
  This writes maha-mathlab.html — rename/copy it to "Grade7_MathLab.html"
  (or whatever name you like) and that's the file to open normally,
  upload, or send to anyone. It does not need index-dev.html, or any of
  the other files, next to it — everything is bundled inside it.

Tip: index.html itself is NOT meant to be opened directly in a browser —
it contains placeholder markers (like /*__DATA__*/) that only build.py
understands. Use index-dev.html for live editing/previewing instead.
