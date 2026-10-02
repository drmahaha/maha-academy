Maha Academy — English, Grade 6 (Top Goal 3)
=========================================

This folder holds the editable SOURCE files for the game. The single file
you play/share ("Grade6_English_Adventure.html") is generated FROM these
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

Content covered (Top Goal 3, term 1):
  1. Personal Interests      — photography, coding, collecting stamps, gardening, astronomy, calligraphy, robotics, hiking
  2. House Designs           — apartment, villa, balcony, garden, stairs, roof, spacious, modern
  3. Job Paths               — scientist, architect, programmer, pharmacist, astronaut, journalist, vet, pilot
  4. Glorious Food           — kabsa, dates, honey, rice, spicy, sweet, delicious, recipe

How to preview changes while you edit:
  Open index-dev.html directly in your browser (double-click it).

How to produce the final, single-file game:
  python3 build.py   (writes maha-academy.html — rename it)
