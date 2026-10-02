Maha Academy — Math Lab, Kindergarten (رياض الأطفال)
=========================================

This folder holds the editable SOURCE files for the game. The single file
you play/share ("KG_MathLab.html", one folder up) is generated FROM
these files — edit the source here, then rebuild.

Same engine and look as the Grade 7 Math Lab (hub of stations → machines,
XP + levels + mastery, 3-tier hints Think → Guide → Solution, randomized
rounds, AR / AR+EN toggle). Content follows the Saudi MoE math book for
this grade, FIRST TERM (الفصل الدراسي الأول).

Files:
  index.html / index-dev.html   page structure (index-dev.html = live preview)
  styles.css                    visual styling (Grade 7 lab theme + machine library)
  data.js                       shared helpers, then THIS GRADE's content:
                                LEVEL_TITLES, MODULES (stations & machines),
                                ARENA_POOL and one GEN.<key>() per machine
  engine.js                     the engine + the shared machine library
                                (RENDERERS.<type>) used by every grade
  app.js                        startup / navigation glue
  build.py                      bundles everything into one HTML file

Each machine in MODULES has a `type` (which interactive renderer it uses,
e.g. sortbins, numline, placevalue, slider...) and its GEN.<key>(tier)
returns that round's content (tier 1–3 = difficulty, auto-adjusted).

Progress is saved in the browser under "mahaMathLabProgress_kg_v1", separate from every
other Maha Academy game.

Preview while editing: open index-dev.html in a browser.
Rebuild the single file: run  python3 build.py  in this folder, then copy
maha-mathlab.html over "KG_MathLab.html".
