Maha Academy — English, Grade 3 (We Can 3)
=========================================

This folder holds the editable SOURCE files for the game. The single file
you play/share ("Grade3_English_Adventure.html") is generated FROM these
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

Content covered (We Can 3, term 1):
  1. Nice to Meet You        — hello, goodbye, name, friend, teacher, classmate, nice, meet
  2. Sea Animals             — fish, shark, whale, dolphin, octopus, crab, turtle, starfish
  3. Sports and Activities   — soccer, basketball, swimming, running, tennis, cycling, volleyball, karate
  4. Chores                  — clean my room, make my bed, wash the dishes, feed the cat, water the plants, take out the trash, set the table, fold the clothes
  5. Yesterday and Today     — yesterday, today, school, park, zoo, library, beach, home
  6. Jobs                    — doctor, teacher, pilot, farmer, chef, police officer, firefighter, engineer

How to preview changes while you edit:
  Open index-dev.html directly in your browser (double-click it).

How to produce the final, single-file game:
  python3 build.py   (writes maha-academy.html — rename it)
