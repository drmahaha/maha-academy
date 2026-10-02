Maha Academy — English, Grade 8
=========================================

This folder holds the editable SOURCE files for the game. The single file
you play/share ("Grade8_English_Adventure.html") is generated FROM these
files — don't hand-edit the final file, edit the source here instead.

Files:
  index.html       Page structure/markup (the "skeleton" of every screen)
  styles.css        All visual styling (colors, layout, fonts, spacing)
  data.js           All game content: questions, rounds, hints, text (EN+AR)
  engine.js         The game engine: renders activities, handles clicks/logic
  app.js            Small glue code: navigation, settings, startup
  assets_data.js    Character art, encoded as text so everything can ship
                     as one file (large; you won't usually edit this)
  build.py          Combines all of the above into the single final HTML file

This is the same engine as the Grade 5/7 games (same characters, same map
style) — only data.js is different content. To build another grade's
English game yourself: copy this whole folder, replace data.js with new
content, and change the PROGRESS_KEY line near the top of engine.js to a
new unique name (e.g. "mahaAcademyProgress_g9english_v1") so its saved
progress doesn't overwrite another grade's on the same device.

How to preview changes while you edit:
  Open index-dev.html directly in your browser (double-click it). It loads
  styles.css/data.js/engine.js/app.js as normal separate files, so you can
  edit any of them, refresh the page, and see your change immediately —
  no build step needed.

How to produce the final, single-file game to share or play standalone:
  Run in Terminal, from inside this folder:
    python3 build.py
  This writes maha-academy.html — rename/copy it to
  "Grade8_English_Adventure.html" (or whatever name you like).

Tip: index.html itself is NOT meant to be opened directly in a browser —
it contains placeholder markers (like /*__DATA__*/) that only build.py
understands. Use index-dev.html for live editing/previewing instead.
