Maha Academy — English, Grade 2 (We Can 2)
=========================================

This folder holds the editable SOURCE files for the game. The single file
you play/share ("Grade2_English_Adventure.html") is generated FROM these
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

This is the same engine as the other grades' games — only data.js is
different content. To build another grade's English game yourself: copy
this whole folder, replace data.js, and change PROGRESS_KEY near the top
of engine.js to a new unique name so its saved progress doesn't overwrite
another grade's on the same device.

Content covered (based on the "We Can 2" textbook, term 1 — only 3 real
units this term, confirmed via two independent Saudi curriculum sources):
  1. Feelings              — happy, sad, angry, scared, tired, hungry, thirsty, sick
  2. Things We Wear          — shirt, pants, dress, shoes, socks, hat, jacket, scarf
  3. Things We Do             — run, jump, swim, read, eat, sleep, dance, sing

Note: unlike most other grades (which have 5 units/games), We Can 2's term 1
genuinely only has 3 units in the real textbook, so this game has 3 games
instead of 5 — each one built with the same full activity set (vocab, teach,
listen-and-choose, match, build-the-sentence, challenge) as every other grade,
just fewer stations overall.

How to preview changes while you edit:
  Open index-dev.html directly in your browser (double-click it).

How to produce the final, single-file game to share or play standalone:
  Run in Terminal, from inside this folder:
    python3 build.py
  This writes maha-academy.html — rename it to whatever you like.

Tip: index.html itself is NOT meant to be opened directly in a browser —
use index-dev.html for live editing/previewing instead.
