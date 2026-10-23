/* فحص تصميم المراحل — شغّله بـ: node tests/level_check.test.js
   • كل كتلة ؟ يجب أن يكون تحتها أرض يقف عليها اللاعب، ولا عائق بينهما (حتى يستطيع ضربها من الأسفل).
   • لا حفرة أعرض من قدرة القفز (3 خانات) إلا إذا كان فوقها جسر أو منصة متحركة. */
"use strict";
global.window = global;
const P = require("path");
require(P.join(__dirname, "../js/level-gen.js"));
require(P.join(__dirname, "../js/config.js"));
require(P.join(__dirname, "../js/data/lessons.js"));
const NL = LESSONS.length, SEED = GAME_CONFIG.levelSeed || 0;
let fail = 0;
for (let i = 0; i < NL; i++) {
  const L = LevelGen.generate(i, NL, SEED), C = L.CODES;
  for (let x = 0; x < L.W; x++) for (let y = 0; y < L.GROUND; y++) {
    if (L.get(x, y) !== C.QB) continue;
    let clear = true; for (let yy = y + 1; yy < L.GROUND; yy++) if (L.solid(L.get(x, yy))) clear = false;
    if (L.get(x, L.GROUND) !== C.GRD || !clear) { fail++; console.log(`  ✗ المرحلة ${i + 1}: كتلة ؟ عند (${x},${y}) لا يمكن ضربها من الأسفل`); }
  }
  // كل ذهبية يمكن التقاطها: يوجد سطح وقوف قريب (±3 خانات) تصل منه أقصر شخصية (مالك 68) بالمشي أو القفز (≈136)
  const VIS = 68, JUMP = 136;
  const surfaces = [];
  for (let x = 0; x < L.W; x++) for (let y = 1; y <= L.GROUND; y++)
    if (L.solid(L.get(x, y)) && !L.solid(L.get(x, y - 1)) && L.get(x, y - 1) !== C.SPIKE) surfaces.push({ x0: x * 32, x1: x * 32 + 32, y: y * 32 });
  L.platforms.forEach(p => surfaces.push({ x0: p.minX, x1: p.maxX + p.w, y: p.y }));
  L.coins.forEach(c => {
    const ok = surfaces.some(sf => c.x > sf.x0 - 96 && c.x < sf.x1 + 96 && c.y <= sf.y && c.y >= sf.y - VIS - JUMP + 12);
    if (!ok) { fail++; console.log(`  ✗ المرحلة ${i + 1}: ذهبية لا يمكن الوصول إليها عند (${Math.round(c.x / 32)},${Math.round(c.y / 32)})`); }
  });
  let run = 0;
  for (let x = 0; x <= L.W; x++) {
    if (x < L.W && L.get(x, L.GROUND) !== C.GRD) { run++; continue; }
    if (run > 3) {
      const bridged = L.platforms.some(p => p.minX / 32 <= x - run + 1 && p.maxX / 32 + 3 >= x - 1) ||
        [10, 11].some(r => { for (let k = x - run; k < x; k++) if (L.solid(L.get(k, r))) return true; return false; });
      if (!bridged) { fail++; console.log(`  ✗ المرحلة ${i + 1}: حفرة بعرض ${run} بلا جسر عند ${x - run}`); }
    }
    run = 0;
  }
}
console.log(fail ? `النتيجة: ${fail} مشكلة` : `  ✔ كل كتل ؟ فوق أرض ويمكن ضربها، وكل الذهبيات يمكن التقاطها، وكل الحفر قابلة للعبور (${NL} مرحلة)`);
process.exit(fail ? 1 : 0);
