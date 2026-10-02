Maha Academy — Math, Grade 7 (الرياضيات - الصف الأول المتوسط)
=========================================

This folder holds the editable SOURCE files for the game. The single file
you play/share ("Grade7_Math_Adventure.html") is generated FROM these
files — don't hand-edit the final file, edit the source here instead.

This is a NEW engine, separate from the English Adventure games:
  - Arabic-primary: every prompt/label is written in Arabic first. English
    math terms appear only as a small secondary badge (the "AR+EN" / "AR"
    toggle at the top shows/hides them).
  - New activity types made for math, not used in the English games:
      keypad      an on-screen numeric keypad for typing a number answer
      numberline  tap a number chip, then tap its spot on a number line
  - Carried over from the English engine (renamed): concept (was "teach"),
    terms (was "vocab"), mcq, match.
  - Same characters/branding as English: Mahir, Maya, Marya, Malik, the
    map/star/progress system, and the visual look of Maha Academy.

Files:
  index.html       Page structure/markup (the "skeleton" of every screen)
  styles.css        All visual styling (colors, layout, fonts, spacing)
  data.js           All game content: games, activities, rounds, hints (AR+EN)
  engine.js         The game engine: renders activities, handles clicks/logic
  app.js            Small glue code: navigation, settings, startup, AR/EN toggle
  assets_data.js    Character art, encoded as text so everything can ship
                     as one file (large; you won't usually edit this)
  build.py          Combines all of the above into the single final HTML file

If you want to build another math grade yourself: copy this whole folder,
replace data.js with new content, and change the PROGRESS_KEY line near the
top of engine.js to a new unique name (e.g. "mahaAcademyProgress_g8math_v1")
so its saved progress doesn't overwrite another grade's on the same device.

Adding a new game to data.js — each entry in ALL_GAMES needs:
  id, titleAr, titleEn, emoji, character (mahir/maya/marya/malik), and an
  "activities" array. Each activity needs a type — one of:
    terms      { instructionsAr, instructionsEn, terms:[{emoji, ar, en}] }
    concept    { conceptBlocks:[{pillAr, descAr, descEn, examples:[...]}] }
    mcq        { rounds:[{promptAr, promptEn, expr?, options:[...], correct}] }
    keypad     { rounds:[{promptAr, expr?, correct, allowNegative?, allowDecimal?}] }
    numberline { instructionsAr, instructionsEn,
                 rounds:[{min, max, items:[{id, value, labelAr}]}] }
    match      { instructionsAr, instructionsEn,
                 rounds:[{pairs:[{id, labelAr, matchLabel}]}] }
  Every activity also needs tagAr/tagEn (shown as a small label above it).
  IMPORTANT: never use an empty-string ("") option/label anywhere — it
  renders as a blank, confusing button. Always give real, visible text.

How to preview changes while you edit:
  Open index-dev.html directly in your browser (double-click it). It loads
  styles.css/data.js/engine.js/app.js as normal separate files, so you can
  edit any of them, refresh the page, and see your change immediately —
  no build step needed. This is the file to use while you're learning/tinkering.

How to produce the final, single-file game to share or play standalone:
  Run in Terminal, from inside this folder:
    python3 build.py
  This writes maha-academy.html — rename/copy it to
  "Grade7_Math_Adventure.html" (or whatever name you like) and that's
  the file to open normally, upload, or send to anyone. It does not need
  index-dev.html, or any of the other files, next to it — everything is
  bundled inside it.

Tip: index.html itself is NOT meant to be opened directly in a browser —
it contains placeholder markers (like /*__DATA__*/) that only build.py
understands. Use index-dev.html for live editing/previewing instead.
