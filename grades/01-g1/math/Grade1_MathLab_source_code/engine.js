/* ===========================================================
   Maha Academy — Math Lab — Engine
   A "laboratory of machines" engine — genuinely different from
   the Adventure games' map/mcq engine. No world map: a central
   hub of stations, each containing several interactive machines
   (drag/tap manipulation, not plain multiple choice). Content is
   generated dynamically per round via GEN.* in data.js.
   =========================================================== */

const CHAR_IMG = { mahir: MAHIR_IMG, maya: MAYA_IMG, marya: MARYA_IMG, malik: MALIK_IMG };
const CHAR_NAME_AR = { mahir:"ماهر المغامر", maya:"مايا الذكية", marya:"ماريا الصانعة", malik:"مالك المحفّز" };

const CHAR_FOR_TYPE = {
  power:"maya", orderops:"mahir", expreval:"marya", balance:"marya",
  numberline:"mahir", absvalue:"maya", zeropairs:"marya", signrules:"maya",
  iomachine:"marya", rulefinder:"mahir", graphing:"marya",
  ratiobuilder:"marya", rategarage:"maya", proportion:"maya", percent:"maya"
};

/* ARENA_POOL (machine keys mixed into the Challenge Arena) and GRADE
   (grade labels + PROGRESS_KEY) are defined per grade in data.js. */

function findMachineAny(key){
  for(const m of MODULES){ const f = m.machines.find(x => x.key === key); if(f) return f; }
  return null;
}
function machineType(key){ const d = findMachineAny(key); return (d && d.type) || key; }
function charFor(key){
  const d = findMachineAny(key);
  if(d && d.char) return d.char;
  return CHAR_FOR_TYPE[machineType(key)] || "maya";
}

const GOOD_MSGS = [
  {ar:"ممتاز!", en:"Excellent!"}, {ar:"أحسنت!", en:"Great job!"},
  {ar:"رائع!", en:"Amazing!"}, {ar:"دقيق جدًا!", en:"So precise!"}
];
const TRY_MSGS = [
  {ar:"ليس تمامًا. جرّب مرة أخرى.", en:"Not quite. Try again."},
  {ar:"اقتربت! فكّر مرة أخرى.", en:"Close! Think again."},
  {ar:"لا بأس، حاول مرة أخرى.", en:"That's okay, try again."}
];

function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

/* Wrap any numeric/math fragment in an explicit LTR span. Embedding raw
   numbers (especially signed numbers, or two numbers next to a symbol
   like "/" or "÷") directly inside Arabic RTL text is unreliable — the
   bidi algorithm can reorder them (e.g. "-1" showing as "1-", or
   "2 / 4" showing as "4 / 2"). Always route interpolated math through
   this helper instead of trusting the surrounding RTL paragraph. */
function L(v){ return `<span dir="ltr">${v}</span>`; }

/* ---------- Progress storage ---------- */
const PROGRESS_KEY = GRADE.progressKey;

function defaultProgress(){
  const mastery = {}, difficulty = {};
  MODULES.forEach(m => { if(m.key !== "arena"){ mastery[m.key] = {correct:0, attempted:0}; difficulty[m.key] = 1; } });
  mastery.arena = {correct:0, attempted:0}; difficulty.arena = 1;
  return { xp: 0, mastery, difficulty, lang: "ar+en" };
}

function loadProgress(){
  try{
    const raw = localStorage.getItem(PROGRESS_KEY);
    if(!raw) return defaultProgress();
    const parsed = JSON.parse(raw);
    const base = defaultProgress();
    return {
      xp: parsed.xp || 0,
      mastery: Object.assign(base.mastery, parsed.mastery || {}),
      difficulty: Object.assign(base.difficulty, parsed.difficulty || {}),
      lang: parsed.lang || "ar+en"
    };
  }catch(e){ return defaultProgress(); }
}
function saveProgress(){ try{ localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)); }catch(e){} }

let progress = loadProgress();
let session = null;

/* ---------- Screen management ---------- */
function showScreen(id){
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const el = document.getElementById("screen-"+id);
  if(el) el.classList.add("active");
  window.scrollTo({top:0, behavior:"smooth"});
}

let toastTimer = null;
function showToast(ar, en){
  const t = document.getElementById("toast");
  if(!t) return;
  t.innerHTML = ar + (en ? ` <span class="en-badge">${en}</span>` : "");
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove("show"), 2600);
}

function updateTopbar(){
  const lvl = levelForXP(progress.xp);
  const xpEl = document.getElementById("topbarXP");
  const lvlEl = document.getElementById("topbarLevel");
  if(xpEl) xpEl.textContent = `⚡ ${progress.xp} XP`;
  if(lvlEl) lvlEl.textContent = `${lvl.num}. ${lvl.ar}`;
}

function moduleMasteryPct(modKey){
  const m = progress.mastery[modKey];
  if(!m || m.attempted === 0) return 0;
  return Math.round((m.correct / m.attempted) * 100);
}
function masteryStatus(pct){
  if(pct >= 80) return {cls:"mastered", ar:"متقَن", en:"Mastered"};
  if(pct >= 40) return {cls:"practicing", ar:"قيد التدرّب", en:"Practicing"};
  return {cls:"needs", ar:"يحتاج تدريب", en:"Needs Practice"};
}

/* ---------- Hub ---------- */
function renderHub(){
  const grid = document.getElementById("hubGrid");
  if(!grid) return;
  grid.innerHTML = "";
  MODULES.forEach(mod => {
    const pct = moduleMasteryPct(mod.key);
    const card = document.createElement("div");
    card.className = "hub-card";
    card.innerHTML = `
      <div class="hc-glow" style="--hc-color:${mod.color}"></div>
      <span class="hc-emoji">${mod.emoji}</span>
      <div class="hc-title">${mod.titleAr}<span class="en-badge">${mod.titleEn}</span></div>
      <div class="hc-mastery"><div class="hc-mastery-fill" style="width:${pct}%"></div></div>
      <div class="hc-mastery-label">${pct}% <span class="en-badge">mastery</span></div>
    `;
    card.onclick = () => openModule(mod.key);
    grid.appendChild(card);
  });
  updateTopbar();
}

function openModule(modKey){
  const mod = findModule(modKey);
  document.getElementById("moduleEmoji").textContent = mod.emoji;
  document.getElementById("moduleTitleAr").textContent = mod.titleAr;
  document.getElementById("moduleTitleEn").textContent = mod.titleEn;
  document.getElementById("moduleMasteryPill").textContent = moduleMasteryPct(modKey) + "%";
  const grid = document.getElementById("machineGrid");
  grid.innerHTML = "";
  mod.machines.forEach(mach => {
    const card = document.createElement("div");
    card.className = "machine-card";
    card.innerHTML = `
      <div class="mc-emoji">${mach.emoji}</div>
      <div class="mc-title">${mach.titleAr}<span class="en-badge">${mach.titleEn}</span></div>
      <div class="mc-desc">${mach.descAr}</div>
    `;
    card.onclick = () => startMachine(modKey, mach.key);
    grid.appendChild(card);
  });
  showScreen("module");
}

/* ---------- Progress console ---------- */
function renderProgressConsole(){
  const board = document.getElementById("masteryBoard");
  board.innerHTML = "";
  MODULES.forEach(mod => {
    const pct = moduleMasteryPct(mod.key);
    const st = masteryStatus(pct);
    const row = document.createElement("div");
    row.className = "mastery-row";
    row.innerHTML = `
      <div class="mastery-row-top">
        <div class="mr-title">${mod.emoji} ${mod.titleAr}<span class="en-badge">${mod.titleEn}</span></div>
        <div class="mr-pct">${pct}%</div>
      </div>
      <div class="mastery-track"><div class="mastery-fill" style="width:${pct}%"></div></div>
      <div class="mastery-status ${st.cls}">${st.ar} <span class="en-badge">${st.en}</span></div>
    `;
    board.appendChild(row);
  });
}

/* ---------- Machine session ---------- */
const ROUNDS_PER_MACHINE = 4;
const ROUNDS_ARENA = 8;

function getDifficulty(modKey){ return progress.difficulty[modKey] || 1; }
function bumpDifficulty(modKey, delta){
  progress.difficulty[modKey] = Math.max(1, Math.min(3, getDifficulty(modKey) + delta));
}

function startMachine(modKey, machKey){
  session = {
    modKey, machKey,
    roundIdx: 0,
    totalRounds: machKey === "mixed" ? ROUNDS_ARENA : ROUNDS_PER_MACHINE,
    correctFirstTry: 0,
    xpGained: 0,
    hadMistake: false,
    hintsUsed: 0,
    streakCorrect: 0,
    streakWrong: 0,
    tier: getDifficulty(modKey),
    currentMachKey: machKey,
    round: null
  };
  showScreen("activity");
  renderActivityRound();
}

function updateActivityHeader(){
  const mod = findModule(session.modKey);
  const mach = findMachine(session.modKey, session.machKey);
  document.getElementById("activityTitleAr").textContent = mach.titleAr;
  document.getElementById("activityTitleEn").textContent = mach.titleEn;
  const dots = document.getElementById("activityDots");
  dots.innerHTML = Array.from({length: session.totalRounds}).map((_,i) => {
    let cls = "dot";
    if(i < session.roundIdx) cls += " done";
    else if(i === session.roundIdx) cls += " active";
    return `<span class="${cls}"></span>`;
  }).join("");
}

function renderActivityRound(){
  session.hadMistake = false;
  session.hintsUsed = 0;
  if(session.machKey === "mixed"){
    let k = pick(ARENA_POOL);
    if(ARENA_POOL.length > 1) while(k === session.lastArenaKey) k = pick(ARENA_POOL);
    session.lastArenaKey = k;
    session.currentMachKey = k;
  }
  session.currentType = machineType(session.currentMachKey);
  session.round = GEN[session.currentMachKey](session.tier);
  updateActivityHeader();
  const card = document.getElementById("activityCard");
  card.innerHTML = `<div id="machineBody"></div>`;
  const body = document.getElementById("machineBody");
  if(session.machKey === "mixed"){
    const d = findMachineAny(session.currentMachKey);
    if(d) body.innerHTML = `<div class="arena-tag">${d.emoji} ${d.titleAr}<span class="en-badge">${d.titleEn}</span></div>`;
    const inner = document.createElement("div"); body.appendChild(inner);
    RENDERERS[session.currentType](inner, session.round);
  } else {
    RENDERERS[session.currentType](body, session.round);
  }
}

function charRow(machKey, promptAr, promptEn){
  const charKey = session ? charFor(session.currentMachKey) : "maya";
  return `
    <div class="char-row">
      <img src="${CHAR_IMG[charKey]}" alt="${CHAR_NAME_AR[charKey]}">
      <div class="speech"><p>${promptAr}</p><p class="en-badge">${promptEn||""}</p></div>
    </div>`;
}

function hintTiers(machKey, round){
  const r = round;
  if(r.hints) return r.hints;
  if(r.guideAr !== undefined || r.solAr !== undefined){
    return [
      {ar:r.hintAr||"فكّر جيدًا!", en:r.hintEn||"Think carefully!"},
      {ar:r.guideAr||r.hintAr||"", en:r.guideEn||r.hintEn||""},
      {ar:r.solAr||"", en:r.solEn||""}
    ];
  }
  switch(machKey){
    case "power": return [
      {ar:r.hintAr, en:r.hintEn},
      {ar:`اضغط زر ${L("× "+r.base)} بعدد ${L(r.exp)} مرات.`, en:`Tap the "× ${r.base}" button ${r.exp} times.`},
      {ar:`الناتج النهائي هو ${L(r.correct)}.`, en:`The final answer is ${r.correct}.`}
    ];
    case "orderops": return [
      {ar:r.hintAr, en:r.hintEn},
      {ar:"اضغط على العملية التي يجب حسابها أولًا حسب الترتيب الرياضي.", en:"Tap the operation that must be computed first, by math order."},
      {ar:`الناتج النهائي هو ${L(r.result)}.`, en:`The final answer is ${r.result}.`}
    ];
    case "expreval": return [
      {ar:r.hintAr, en:r.hintEn},
      {ar:"اختر عدد الأمثال أولًا (المعامل)، ثم العملية، ثم العدد الثابت.", en:"Pick the coefficient first, then the operation, then the constant."},
      {ar:`العبارة الصحيحة: ${L(r.coeff+"x "+r.sign+" "+r.constant)}`, en:`The correct expression: ${r.coeff}x ${r.sign} ${r.constant}`}
    ];
    case "balance": return [
      {ar:r.hintAr, en:r.hintEn},
      {ar: r.b0 !== 0 ? `اطرح/أضف ${L(Math.abs(r.b0))} من الطرفين أولًا.` : `اقسم الطرفين على ${L(r.a0)}.`,
       en: r.b0 !== 0 ? `Add/subtract ${Math.abs(r.b0)} on both sides first.` : `Divide both sides by ${r.a0}.` },
      {ar:L("x = "+r.x), en:`x = ${r.x}`}
    ];
    case "numberline": return [
      {ar:r.hintAr, en:r.hintEn},
      {ar:`ابدأ من ${L(r.start)} وتحرك ${L(Math.abs(r.move))} خطوة ${r.move>0?"لليمين":"لليسار"}.`, en:`Start at ${r.start} and move ${Math.abs(r.move)} steps ${r.move>0?"right":"left"}.`},
      {ar:`الوجهة النهائية: ${L(r.target)}`, en:`Final destination: ${r.target}`}
    ];
    case "absvalue": return [
      {ar:r.hintAr, en:r.hintEn},
      {ar:"احذف الإشارة السالبة إن وجدت.", en:"Drop the negative sign if there is one."},
      {ar:L(`|${r.a}| = ${r.correct}`), en:`|${r.a}| = ${r.correct}`}
    ];
    case "zeropairs": return [
      {ar:r.hintAr, en:r.hintEn},
      {ar:`لديك ${L(r.posCount)} قطعة (+1) و${L(r.negCount)} قطعة (-1). اضغط على واحدة من كل نوع معًا لتختفي الاثنتان (زوج صفري)، وكرر حتى ينتهي أحد النوعين.`, en:`You have ${r.posCount} (+1) tiles and ${r.negCount} (-1) tiles. Tap one of each together so both disappear (a zero pair), and repeat until one side runs out.`},
      {ar:`الناتج: ${L(r.correct)}`, en:`Result: ${r.correct}`}
    ];
    case "signrules": return [
      {ar:r.hintAr, en:r.hintEn},
      {ar:`إشارة ${L(r.a)} ${r.a>0?"موجبة":"سالبة"} وإشارة ${L(r.b)} ${r.b>0?"موجبة":"سالبة"}.`, en:`${r.a} is ${r.a>0?"positive":"negative"} and ${r.b} is ${r.b>0?"positive":"negative"}.`},
      {ar:L(`${r.a} ${r.op} ${r.b} = ${r.result}`), en:`${r.a} ${r.op} ${r.b} = ${r.result}`}
    ];
    case "iomachine": return [
      {ar:r.hintAr, en:r.hintEn},
      {ar:"طبّق كل مرحلة بالترتيب على المدخل.", en:"Apply each stage, in order, to the input."},
      {ar:`الناتج: ${L(r.challengeOutput)}`, en:`Output: ${r.challengeOutput}`}
    ];
    case "rulefinder": return [
      {ar:r.hintAr, en:r.hintEn},
      {ar:"جرّب عملية ضرب أولًا، ثم عملية جمع/طرح إن لزم.", en:"Try a multiply stage first, then an add/subtract stage if needed."},
      {ar:`القاعدة: ${L("×"+r.rule.m+" "+(r.rule.b>=0?"+":"-")+" "+Math.abs(r.rule.b))}`, en:`Rule: ×${r.rule.m} ${r.rule.b>=0?"+":"-"} ${Math.abs(r.rule.b)}`}
    ];
    case "graphing": return [
      {ar:r.hintAr, en:r.hintEn},
      {ar:"سنُظهر لك المربعات الصحيحة على الشبكة — اضغط عليها لوضع النقاط.", en:"We'll reveal the correct boxes on the grid — tap them to place the points."},
      {ar:"النقاط: " + L(r.points.map(p=>`(${p.x},${p.y})`).join(" ")), en:"Points: " + r.points.map(p=>`(${p.x},${p.y})`).join(" ")}
    ];
    case "ratiobuilder": return [
      {ar:r.hintAr, en:r.hintEn},
      {ar:"اقسم القيمة المعطاة على مضاعف الصف لتجد وحدة واحدة، ثم اضربها.", en:"Divide the given value by the row's multiplier to find one unit, then multiply."},
      {ar:"تحقق من كل خلية باستخدام النسبة الأساسية.", en:"Check each cell using the base ratio."}
    ];
    case "rategarage": return [
      {ar:r.hintAr, en:r.hintEn},
      {ar:L(`${r.distance} ÷ ${r.time} = ?`), en:`${r.distance} ÷ ${r.time} = ?`},
      {ar:`السرعة = ${L(r.correct+" كم/س")}`, en:`Speed = ${r.correct} km/h`}
    ];
    case "proportion": return [
      {ar:r.hintAr, en:r.hintEn},
      {ar:`${L(r.d+" ÷ "+r.b)} = العدد الذي كُبِّر به الطرف الأيمن.`, en:`${r.d} ÷ ${r.b} = the scale factor of the right side.`},
      {ar:L("x = "+r.x), en:`x = ${r.x}`}
    ];
    case "percent": return [
      {ar:r.hintAr, en:r.hintEn},
      {ar:L(`${r.price} × ${r.pct} ÷ 100 = ?`), en:`${r.price} × ${r.pct} ÷ 100 = ?`},
      {ar:`الخصم = ${L(r.discount)}، السعر النهائي = ${L(r.final)}`, en:`Discount = ${r.discount}, final price = ${r.final}`}
    ];
    default: return [{ar:"فكّر جيدًا!",en:"Think carefully!"},{ar:"",en:""},{ar:"",en:""}];
  }
}

function renderHintRow(container, machKey, round){
  const tiers = hintTiers(machKey, round);
  const wrap = document.createElement("div");
  wrap.innerHTML = `
    <div class="hint-box" id="hintBox"></div>
    <div class="hint-tiers" id="hintTiers">
      <button class="hint-tier-btn" data-t="0">💡 فكّر <span class="en-badge">Think</span></button>
      <button class="hint-tier-btn" data-t="1">🧭 وجّهني <span class="en-badge">Guide</span></button>
      <button class="hint-tier-btn" data-t="2">✅ الحل <span class="en-badge">Solution</span></button>
    </div>
  `;
  container.appendChild(wrap);
  wrap.querySelectorAll(".hint-tier-btn").forEach(btn => {
    btn.onclick = () => {
      const t = Number(btn.dataset.t);
      session.hintsUsed = Math.max(session.hintsUsed, t+1);
      const box = document.getElementById("hintBox");
      box.innerHTML = `💡 ${tiers[t].ar} <span class="en-badge">${tiers[t].en}</span>`;
      box.classList.add("show");
      btn.classList.add("used");
    };
  });
}

function feedbackAreaHtml(){ return `<div id="feedbackArea"></div><div class="action-row" id="actionRow"></div>`; }

function finalizeRoundSuccess(){
  const perfect = !session.hadMistake && session.hintsUsed === 0;
  if(perfect) session.correctFirstTry++;
  const xp = perfect ? 10 : session.hintsUsed >= 2 ? 4 : 6;
  session.xpGained += xp;
  progress.xp += xp;
  session.streakCorrect++; session.streakWrong = 0;
  if(session.streakCorrect >= 3){ bumpDifficulty(session.modKey === "arena" ? "arena" : session.modKey, 1); session.streakCorrect = 0; }
  updateTopbar();
  const charKey = charFor(session.currentMachKey);
  const msg = pick(GOOD_MSGS);
  const area = document.getElementById("feedbackArea");
  const actions = document.getElementById("actionRow");
  if(area) area.innerHTML = `
    <div class="feedback-banner good">
      <img src="${CHAR_IMG[charKey]}" alt="${CHAR_NAME_AR[charKey]}">
      <div>${msg.ar} <span class="en-badge">${msg.en}</span><span class="en-badge" style="display:block;">+${xp} XP</span></div>
    </div>`;
  if(actions) actions.innerHTML = `<button class="btn btn-primary" id="nextRoundBtn">التالي ▶ <span class="en-badge">Next</span></button>`;
  const nb = document.getElementById("nextRoundBtn");
  if(nb) nb.onclick = () => advanceRound();
  disableMachineInputs();
}

function showMistakeFeedback(){
  session.hadMistake = true;
  session.streakWrong++; session.streakCorrect = 0;
  if(session.streakWrong >= 2){ bumpDifficulty(session.modKey === "arena" ? "arena" : session.modKey, -1); session.streakWrong = 0; }
  const msg = pick(TRY_MSGS);
  const area = document.getElementById("feedbackArea");
  if(area) area.innerHTML = `
    <div class="feedback-banner retry">
      <img src="${MALIK_IMG}" alt="مالك">
      <div>${msg.ar} <span class="en-badge">${msg.en}</span></div>
    </div>`;
}

function disableMachineInputs(){
  document.querySelectorAll("#machineBody button:not(#nextRoundBtn):not(.hint-tier-btn)").forEach(b => b.disabled = true);
}

function advanceRound(){
  const mod = progress.mastery[session.modKey === "arena" ? "arena" : session.modKey];
  session.roundIdx++;
  if(session.roundIdx >= session.totalRounds){
    finishMachineSession();
    return;
  }
  renderActivityRound();
}

function finishMachineSession(){
  const modKey = session.modKey;
  const bucket = progress.mastery[modKey === "arena" ? "arena" : modKey];
  bucket.attempted += session.totalRounds;
  bucket.correct += session.correctFirstTry;
  saveProgress();
  showScreen("activityEnd");
  const wrap = document.getElementById("activityEndContent");
  const mach = findMachine(session.modKey, session.machKey);
  const pct = Math.round((session.correctFirstTry/session.totalRounds)*100);
  const msg = pct >= 85 ? {ar:"إتقان رائع! أنت تفهم هذا جيدًا.", en:"Great mastery! You've got this."} :
              pct >= 50 ? {ar:"عمل جيد! استمر في التدريب.", en:"Good work! Keep practicing."} :
              {ar:"بداية جيدة — جرّب مرة أخرى لتتقنها أكثر.", en:"Good start — try again to master it further."};
  wrap.innerHTML = `
    <div class="end-card">
      <img src="${MALIK_IMG}" alt="مالك">
      <h2>${mach.titleAr}</h2>
      <div class="en-badge">${mach.titleEn}</div>
      <div class="end-stats">
        <div class="end-stat"><div class="num">${session.totalRounds}</div><div class="lbl">جولات <span class="en-badge">Rounds</span></div></div>
        <div class="end-stat"><div class="num">${session.correctFirstTry}</div><div class="lbl">من أول مرة <span class="en-badge">First Try</span></div></div>
        <div class="end-stat"><div class="num">${pct}%</div><div class="lbl">الدقة <span class="en-badge">Accuracy</span></div></div>
      </div>
      <div class="xp-gain">⚡ +${session.xpGained} XP</div>
      <p class="end-msg">${msg.ar}<span class="en-badge" style="display:block;">${msg.en}</span></p>
      <div class="action-row">
        <button class="btn btn-secondary" id="retryMachineBtn">↺ إعادة <span class="en-badge">Retry</span></button>
        <button class="btn btn-primary" id="backToModuleBtn">🧪 المحطة <span class="en-badge">Station</span></button>
        <button class="btn btn-secondary" id="toProgressBtn">📊 الإتقان <span class="en-badge">Progress</span></button>
      </div>
    </div>`;
  document.getElementById("retryMachineBtn").onclick = () => startMachine(session.modKey, session.machKey);
  document.getElementById("backToModuleBtn").onclick = () => openModule(session.modKey);
  document.getElementById("toProgressBtn").onclick = () => { renderProgressConsole(); showScreen("progress"); };
  updateTopbar();
}

/* ===========================================================
   Machine renderers — RENDERERS[machKey](container, round)
   Each wires up its own interaction and calls
   finalizeRoundSuccess() / showMistakeFeedback() from engine.
   =========================================================== */

const RENDERERS = {};

/* ---- Power Generator ---- */
RENDERERS.power = function(container, r){
  container.innerHTML = charRow("power", `فعّل الضرب ${L(r.exp)} مرات لتكتشف ناتج القوة:`, `Trigger the multiplication ${r.exp} times to reveal the power:`) + `
    <div class="math-expr">${r.base}<sup>${r.exp}</sup> = ?</div>
    <div class="power-running" id="powerRunning">1</div>
    <div class="power-stage-row" id="powerStages"></div>
  ` + feedbackAreaHtml();
  renderHintRow(container, "power", r);
  let running = 1, used = 0;
  const stagesEl = document.getElementById("powerStages");
  for(let i=0;i<r.exp;i++){
    const chip = document.createElement("button");
    chip.className = "power-chip"; chip.type = "button";
    chip.textContent = `× ${r.base}`;
    chip.onclick = () => {
      if(chip.classList.contains("spent")) return;
      running *= r.base; used++;
      document.getElementById("powerRunning").textContent = running;
      chip.classList.add("spent"); chip.disabled = true;
      if(used === r.exp){
        if(running === r.correct) finalizeRoundSuccess();
      }
    };
    stagesEl.appendChild(chip);
  }
};

/* ---- Order of Operations Processor ---- */
RENDERERS.orderops = function(container, r){
  container.innerHTML = charRow("orderops", "اضغط على العمليات بالترتيب الصحيح للحل (الأولى ثم الثانية):", "Tap the operations in the correct order to solve (first, then second):") + `
    <div class="expr-tokens" id="exprTokens"></div>
    <div class="expr-step-log" id="stepLog"></div>
  ` + feedbackAreaHtml();
  renderHintRow(container, "orderops", r);
  const tokEl = document.getElementById("exprTokens");
  let picked = [];
  r.tokens.forEach(tok => {
    const el = document.createElement("span");
    if(tok.t === "num"){ el.className = "expr-token"; el.textContent = tok.v; }
    else if(tok.t === "paren-open"){ el.className = "expr-token"; el.textContent = "("; }
    else if(tok.t === "paren-close"){ el.className = "expr-token"; el.textContent = ")"; }
    else {
      el.className = "expr-token op"; el.textContent = tok.v; el.dataset.id = tok.id;
      el.onclick = () => {
        if(picked.includes(tok.id)) return;
        picked.push(tok.id);
        const badge = document.createElement("span");
        badge.className = "order-badge"; badge.textContent = picked.length;
        el.prepend(badge);
        el.classList.add("selected");
        if(picked.length === r.correctOrder.length){
          const isCorrect = picked.every((id,i) => id === r.correctOrder[i]);
          if(isCorrect){
            document.getElementById("stepLog").innerHTML = `<div>= ${r.result}</div>`;
            finalizeRoundSuccess();
          } else {
            showMistakeFeedback();
            setTimeout(() => {
              picked = [];
              tokEl.querySelectorAll(".expr-token.op").forEach(o => {
                o.classList.remove("selected");
                const b = o.querySelector(".order-badge"); if(b) b.remove();
              });
            }, 700);
          }
        }
      };
    }
    tokEl.appendChild(el);
  });
};

/* ---- Expression Builder ---- */
RENDERERS.expreval = function(container, r){
  container.innerHTML = charRow("expreval", r.phraseAr, r.phraseEn) + `
    <div class="rule-built" id="builtExpr" dir="ltr">___ x ___ ___</div>
    <div style="text-align:center;font-weight:800;color:var(--ink-300);margin-top:14px;">المعامل <span class="en-badge">Coefficient</span></div>
    <div class="rule-palette" id="coeffPalette"></div>
    <div style="text-align:center;font-weight:800;color:var(--ink-300);margin-top:10px;">العملية <span class="en-badge">Operation</span></div>
    <div class="rule-palette" id="signPalette"></div>
    <div style="text-align:center;font-weight:800;color:var(--ink-300);margin-top:10px;">العدد الثابت <span class="en-badge">Constant</span></div>
    <div class="rule-palette" id="constPalette"></div>
  ` + feedbackAreaHtml();
  renderHintRow(container, "expreval", r);
  let chosenCoeff = null, chosenSign = null, chosenConst = null;
  function refreshBuilt(){
    document.getElementById("builtExpr").textContent =
      `${chosenCoeff ?? "___"}x ${chosenSign ?? "___"} ${chosenConst ?? "___"}`;
    if(chosenCoeff !== null && chosenSign !== null && chosenConst !== null) checkBuilt();
  }
  function checkBuilt(){
    if(chosenCoeff === r.coeff && chosenSign === r.sign && chosenConst === r.constant){
      finalizeRoundSuccess();
    } else {
      showMistakeFeedback();
    }
  }
  function buildPalette(elId, values, labelFn, onPick){
    const el = document.getElementById(elId);
    values.forEach(v => {
      const btn = document.createElement("button");
      btn.className = "rule-op-btn"; btn.type = "button";
      btn.textContent = labelFn(v);
      btn.onclick = () => {
        el.querySelectorAll(".rule-op-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        onPick(v);
      };
      el.appendChild(btn);
    });
  }
  buildPalette("coeffPalette", r.coeffChoices, v=>v, v => { chosenCoeff = v; refreshBuilt(); });
  buildPalette("signPalette", r.signChoices, v=>v, v => { chosenSign = v; refreshBuilt(); });
  buildPalette("constPalette", r.constChoices, v=>v, v => { chosenConst = v; refreshBuilt(); });
};

/* ---- Equation Balance Chamber ---- */
RENDERERS.balance = function(container, r){
  let a = r.a0, b = r.b0, c = r.c0;
  container.innerHTML = charRow("balance", "طبّق نفس العملية على الطرفين حتى يبقى x وحده!", "Apply the same operation to both sides until x stands alone!") + `
    <div class="balance-eq-label" id="balanceEq"></div>
    <div class="balance-wrap">
      <div class="balance-beam">
        <div class="balance-pan" id="panLeft"></div>
        <div class="balance-pan" id="panRight"></div>
      </div>
      <div class="balance-fulcrum"></div>
    </div>
    <div class="balance-controls">
      <button class="balance-op-btn" data-op="+">+</button>
      <button class="balance-op-btn" data-op="-">−</button>
      <button class="balance-op-btn" data-op="×">×</button>
      <button class="balance-op-btn" data-op="÷">÷</button>
      <input class="balance-num-input" id="balanceNum" type="text" inputmode="numeric" placeholder="عدد">
      <button class="btn btn-primary" id="applyOpBtn" type="button">تطبيق <span class="en-badge">Apply</span></button>
    </div>
    <div class="balance-history" id="balanceHistory"></div>
  ` + feedbackAreaHtml();
  renderHintRow(container, "balance", r);

  let activeOp = null;
  const history = [];
  document.querySelectorAll(".balance-op-btn").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".balance-op-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeOp = btn.dataset.op;
    };
  });

  function renderPans(){
    const left = document.getElementById("panLeft");
    const right = document.getElementById("panRight");
    left.innerHTML = "";
    if(a === 1) left.innerHTML += `<div class="tile x">x</div>`;
    else if(a > 1) for(let i=0;i<a;i++) left.innerHTML += `<div class="tile x">x</div>`;
    if(b > 0) for(let i=0;i<b;i++) left.innerHTML += `<div class="tile unit">1</div>`;
    if(b < 0) for(let i=0;i<-b;i++) left.innerHTML += `<div class="tile unitneg">-1</div>`;
    right.innerHTML = "";
    if(c >= 0) for(let i=0;i<Math.min(c,24);i++) right.innerHTML += `<div class="tile unit">1</div>`;
    else for(let i=0;i<Math.min(-c,24);i++) right.innerHTML += `<div class="tile unitneg">-1</div>`;
    const coeffLabel = a === 1 ? "x" : a === 0 ? "0" : `${a}x`;
    document.getElementById("balanceEq").textContent =
      `${coeffLabel} ${b === 0 ? "" : (b>0?"+ "+b:"- "+(-b))} = ${c}`;
  }
  renderPans();

  document.getElementById("applyOpBtn").onclick = () => {
    const numRaw = document.getElementById("balanceNum").value.trim();
    const num = Number(numRaw);
    if(!activeOp || numRaw === "" || Number.isNaN(num) || num === 0){
      showToast("اختر عملية وأدخل عددًا صحيحًا غير صفر.", "Pick an operation and enter a nonzero number.");
      return;
    }
    if(activeOp === "+"){ b += num; c += num; }
    else if(activeOp === "-"){ b -= num; c -= num; }
    else if(activeOp === "×"){ a *= num; b *= num; c *= num; }
    else if(activeOp === "÷"){
      if(a % num !== 0 || b % num !== 0 || c % num !== 0){
        showToast("القسمة يجب أن تكون بلا باقٍ على كل الحدود.", "Division must leave no remainder on every term.");
        return;
      }
      a /= num; b /= num; c /= num;
    }
    history.push(`${activeOp}${num}`);
    document.getElementById("balanceHistory").textContent = history.join("  →  ");
    document.getElementById("balanceNum").value = "";
    renderPans();
    if(a === 1 && b === 0){
      if(c === r.x) finalizeRoundSuccess();
      else showMistakeFeedback();
    } else if(a === 0){
      showToast("لا يمكن أن يختفي x تمامًا — جرّب عملية مختلفة.", "x can't disappear entirely — try a different operation.");
    }
  };
};

/* ---- Integer Number Line ---- */
RENDERERS.numberline = function(container, r){
  container.innerHTML = charRow("numberline", `ابدأ من ${L(r.start)}. حرّك المؤشر ${L(Math.abs(r.move))} خطوة ${r.move>0?"لليمين":"لليسار"}.`,
    `Start at ${r.start}. Move the marker ${Math.abs(r.move)} step(s) ${r.move>0?"right":"left"}.`) + `
    <div class="numberline-wrap" id="nlWrap"></div>
    <div class="nl-controls">
      <button class="nl-arrow-btn" id="nlLeftBtn" type="button">◀</button>
      <button class="nl-arrow-btn" id="nlRightBtn" type="button">▶</button>
    </div>
    <div class="nl-step-count" id="nlStepCount">الخطوات: <span dir="ltr">0 / ${Math.abs(r.move)}</span></div>
  ` + feedbackAreaHtml();
  renderHintRow(container, "numberline", r);
  const wrap = document.getElementById("nlWrap");
  const track = document.createElement("div");
  track.className = "numberline-track";
  wrap.appendChild(track);
  const tickPositions = {};
  for(let v=r.min; v<=r.max; v++){
    const tick = document.createElement("div");
    tick.className = "numberline-tick";
    tick.innerHTML = `<div class="nl-tick-mark"></div><div class="nl-tick-label">${v}</div>`;
    wrap.appendChild(tick);
  }
  const marker = document.createElement("div");
  marker.className = "nl-marker"; marker.textContent = "🚀";
  wrap.appendChild(marker);

  let pos = r.start;
  let steps = 0;
  const totalSteps = Math.abs(r.move);
  const dir = r.move > 0 ? 1 : -1;
  const rightBtn = document.getElementById("nlRightBtn");
  const leftBtn = document.getElementById("nlLeftBtn");
  // Only the correct direction is enabled, so the student must move the right way,
  // but they control how many steps (can overshoot and self-correct via the other arrow once unlocked on mistake).
  function updateMarkerPos(){
    const ticks = wrap.querySelectorAll(".numberline-tick");
    const idx = pos - r.min;
    const tickEl = ticks[idx];
    if(tickEl){
      marker.style.left = (tickEl.offsetLeft + tickEl.offsetWidth/2 - marker.offsetWidth/2) + "px";
    }
  }
  function updateButtons(){
    rightBtn.disabled = false; leftBtn.disabled = false;
  }
  setTimeout(updateMarkerPos, 50);
  updateButtons();

  function step(delta){
    pos += delta;
    steps++;
    document.getElementById("nlStepCount").innerHTML = `الخطوات: <span dir="ltr">${Math.min(steps,totalSteps)} / ${totalSteps}</span> — الموقع: <span dir="ltr">${pos}</span>`;
    updateMarkerPos();
    if(pos === r.target){
      finalizeRoundSuccess();
    } else if(steps >= totalSteps + 2){
      showMistakeFeedback();
    }
  }
  rightBtn.onclick = () => step(1);
  leftBtn.onclick = () => step(-1);
};

/* ---- Absolute Value Scanner ---- */
RENDERERS.absvalue = function(container, r){
  container.innerHTML = charRow("absvalue", `ما مسافة العدد ${L(r.a)} عن الصفر؟`, `What is the distance of ${r.a} from zero?`) + `
    <div class="numberline-wrap" id="nlWrap" style="padding-top:36px;"></div>
    <div class="math-expr">|${r.a}| = ?</div>
    <div class="keypad-display" id="keypadDisplay"><span class="kp-cursor">|</span></div>
    <div class="keypad-grid" id="keypadGrid"></div>
  ` + feedbackAreaHtml();
  renderHintRow(container, "absvalue", r);
  const wrap = document.getElementById("nlWrap");
  const track = document.createElement("div");
  track.className = "numberline-track";
  wrap.appendChild(track);
  for(let v=r.min; v<=r.max; v++){
    const tick = document.createElement("div");
    tick.className = "numberline-tick";
    const highlight = (r.a>=0 && v>=0 && v<=r.a) || (r.a<0 && v<=0 && v>=r.a);
    tick.innerHTML = `<div class="nl-tick-mark" style="${highlight?'background:var(--gold-500);':''}"></div><div class="nl-tick-label" style="${v===r.a?'color:var(--cyan-400);font-weight:800;':''}">${v}</div>`;
    wrap.appendChild(tick);
  }
  buildKeypad(document.getElementById("keypadDisplay"), document.getElementById("keypadGrid"), {allowNegative:false}, (value) => {
    if(Number(value) === r.correct) finalizeRoundSuccess();
    else showMistakeFeedback();
  });
};

/* ---- Zero-Pair Reactor ---- */
RENDERERS.zeropairs = function(container, r){
  container.innerHTML = charRow("zeropairs", `احسب: ${L(r.displayExpr)}. اضغط على قطعة (+1) ثم قطعة (-1) لإلغاء زوج صفري بينهما، وكرر ذلك حتى لا يتبقى أزواج — ثم اكتب الناتج المتبقي في اللوحة:`, `Compute: ${r.displayExpr}. Tap a (+1) tile, then a (-1) tile, to cancel a zero pair between them — repeat until no pairs are left, then type what remains on the keypad:`) + `
    <div class="reactor-chamber">
      <div class="reactor-box pos-box">
        <div class="reactor-box-label">موجب ${L("(+1)")} <span class="en-badge">Positive</span></div>
        <div class="reactor-col" id="posCol"></div>
      </div>
      <div class="reactor-vs">⚡</div>
      <div class="reactor-box neg-box">
        <div class="reactor-box-label">سالب ${L("(-1)")} <span class="en-badge">Negative</span></div>
        <div class="reactor-col" id="negCol"></div>
      </div>
    </div>
    <div class="reactor-result-row">
      <div class="keypad-display" id="keypadDisplay"><span class="kp-cursor">|</span></div>
      <div class="keypad-grid" id="keypadGrid"></div>
    </div>
  ` + feedbackAreaHtml();
  renderHintRow(container, "zeropairs", r);
  const posCol = document.getElementById("posCol"), negCol = document.getElementById("negCol");
  let selectedPos = null, selectedNeg = null;
  const posUnits = [], negUnits = [];
  function emptyNote(colEl, ar, en){
    const note = document.createElement("div"); note.className = "reactor-empty-note";
    note.innerHTML = `<span>${ar}</span><span class="en-badge">${en}</span>`;
    colEl.appendChild(note);
  }
  if(r.posCount === 0) emptyNote(posCol, "لا يوجد", "empty");
  for(let i=0;i<r.posCount;i++){
    const u = document.createElement("div"); u.className="reactor-unit pos"; u.textContent="+1";
    u.onclick = () => { if(u.classList.contains("gone")) return; posCol.querySelectorAll(".reactor-unit").forEach(x=>x.classList.remove("selected")); u.classList.add("selected"); selectedPos = u; tryCancel(); };
    posCol.appendChild(u); posUnits.push(u);
  }
  if(r.negCount === 0) emptyNote(negCol, "لا يوجد", "empty");
  for(let i=0;i<r.negCount;i++){
    const u = document.createElement("div"); u.className="reactor-unit neg"; u.textContent="-1";
    u.onclick = () => { if(u.classList.contains("gone")) return; negCol.querySelectorAll(".reactor-unit").forEach(x=>x.classList.remove("selected")); u.classList.add("selected"); selectedNeg = u; tryCancel(); };
    negCol.appendChild(u); negUnits.push(u);
  }
  function tryCancel(){
    if(selectedPos && selectedNeg){
      selectedPos.classList.add("gone"); selectedNeg.classList.add("gone");
      selectedPos = null; selectedNeg = null;
    }
  }
  buildKeypad(document.getElementById("keypadDisplay"), document.getElementById("keypadGrid"), {allowNegative:true}, (value) => {
    if(Number(value) === r.correct) finalizeRoundSuccess();
    else showMistakeFeedback();
  });
};

/* ---- Sign Rule Combinator ---- */
RENDERERS.signrules = function(container, r){
  container.innerHTML = charRow("signrules", "اختر إشارة الناتج أولًا، ثم اكتب مقداره:", "Pick the sign of the result first, then type its magnitude:") + `
    <div class="sign-rule-card">
      <div class="sign-rule-row">
        <span class="sign-rule-pic">➕➕</span><span class="sign-rule-eq">=</span><span class="sign-rule-pic">➕</span><span class="sign-rule-face">😊</span>
        <span class="sign-rule-txt">نفس الإشارة → موجب<span class="en-badge">Same sign → positive</span></span>
      </div>
      <div class="sign-rule-row">
        <span class="sign-rule-pic">➖➖</span><span class="sign-rule-eq">=</span><span class="sign-rule-pic">➕</span><span class="sign-rule-face">😊</span>
        <span class="sign-rule-txt">نفس الإشارة → موجب<span class="en-badge">Same sign → positive</span></span>
      </div>
      <div class="sign-rule-row">
        <span class="sign-rule-pic">➕➖</span><span class="sign-rule-eq">=</span><span class="sign-rule-pic">➖</span><span class="sign-rule-face">😕</span>
        <span class="sign-rule-txt">إشارتان مختلفتان → سالب<span class="en-badge">Different signs → negative</span></span>
      </div>
    </div>
    <div class="math-expr">${r.a} ${r.op} ${r.b} = ?</div>
    <div class="sign-combo-row">
      <div class="sign-pick">
        <div class="sign-btns">
          <button class="sign-btn" data-s="+">+</button>
          <button class="sign-btn" data-s="-">−</button>
        </div>
      </div>
    </div>
    <div class="keypad-display" id="keypadDisplay"><span class="kp-cursor">|</span></div>
    <div class="keypad-grid" id="keypadGrid"></div>
  ` + feedbackAreaHtml();
  renderHintRow(container, "signrules", r);
  let chosenSign = null;
  document.querySelectorAll(".sign-btn").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".sign-btn").forEach(b => b.classList.remove("chosen","plus","minus"));
      btn.classList.add("chosen", btn.dataset.s === "+" ? "plus" : "minus");
      chosenSign = btn.dataset.s;
    };
  });
  buildKeypad(document.getElementById("keypadDisplay"), document.getElementById("keypadGrid"), {allowNegative:false}, (value) => {
    if(chosenSign === null){ showToast("اختر الإشارة أولًا.", "Pick the sign first."); return; }
    if(chosenSign === r.correctSign && Number(value) === r.correctMag) finalizeRoundSuccess();
    else showMistakeFeedback();
  });
};

/* ---- Input/Output Machine ---- */
RENDERERS.iomachine = function(container, r){
  const ruleLabel = r.stages.map(s => `${s.op}${s.val}`).join(" ");
  container.innerHTML = charRow("iomachine", "أوجد الناتج للمدخل المطلوب:", "Find the output for the requested input:") + `
    <div class="fn-machine">
      <div class="fn-box"><div class="fn-label">Input</div><div class="fn-value" id="fnInput">${r.sampleInput}</div></div>
      <div class="fn-arrow">→</div>
      <div class="fn-box" style="border-color:var(--gold-500);"><div class="fn-label">Rule</div><div class="fn-value" style="font-size:16px;">${ruleLabel}</div></div>
      <div class="fn-arrow">→</div>
      <div class="fn-box"><div class="fn-label">Output</div><div class="fn-value" id="fnOutput">${r.sampleOutput}</div></div>
    </div>
    <div style="text-align:center;"><button class="btn btn-secondary" id="tryAnotherBtn" type="button">🔄 جرّب رقمًا آخر <span class="en-badge">Try another number</span></button></div>
    <div class="math-expr" style="margin-top:20px;">Input = ${r.challengeInput} → Output = ?</div>
    <div class="keypad-display" id="keypadDisplay"><span class="kp-cursor">|</span></div>
    <div class="keypad-grid" id="keypadGrid"></div>
  ` + feedbackAreaHtml();
  renderHintRow(container, "iomachine", r);
  document.getElementById("tryAnotherBtn").onclick = () => {
    const v = Math.floor(Math.random()*9)+1;
    document.getElementById("fnInput").textContent = v;
    document.getElementById("fnOutput").textContent = applyRule(r.rule, v);
  };
  buildKeypad(document.getElementById("keypadDisplay"), document.getElementById("keypadGrid"), {allowNegative:true}, (value) => {
    if(Number(value) === r.challengeOutput) finalizeRoundSuccess();
    else showMistakeFeedback();
  });
};

/* ---- Rule Finder ---- */
RENDERERS.rulefinder = function(container, r){
  const rowsHtml = r.pairs.map(p => `<tr><td>${p.x}</td><td>${p.y}</td></tr>`).join("");
  container.innerHTML = charRow("rulefinder", "لاحظ الجدول، ثم ابنِ القاعدة الخفية باستخدام لوحة العمليات:", "Study the table, then build the hidden rule using the operation palette:") + `
    <table class="fn-table">
      <tr><th>Input</th><th>Output</th></tr>
      ${rowsHtml}
    </table>
    <div style="text-align:center;font-weight:800;color:var(--ink-300);">المرحلة الأولى <span class="en-badge">Stage 1</span></div>
    <div style="text-align:center;font-size:13px;font-weight:700;color:var(--gold-500);margin-top:6px;">اختر الإشارة <span class="en-badge">Choose the sign</span></div>
    <div class="rule-palette" id="op1Palette"></div>
    <div style="text-align:center;font-size:13px;font-weight:700;color:var(--gold-500);margin-top:6px;">ثم اختر الرقم <span class="en-badge">Then choose the number</span></div>
    <div class="rule-palette" id="val1Palette"></div>
    <div style="text-align:center;font-weight:800;color:var(--ink-300);margin-top:8px;">المرحلة الثانية (اختياري) <span class="en-badge">Stage 2 (optional)</span></div>
    <div style="text-align:center;font-size:13px;font-weight:700;color:var(--gold-500);margin-top:6px;">اختر الإشارة <span class="en-badge">Choose the sign</span></div>
    <div class="rule-palette" id="op2Palette"></div>
    <div style="text-align:center;font-size:13px;font-weight:700;color:var(--gold-500);margin-top:6px;">ثم اختر الرقم <span class="en-badge">Then choose the number</span></div>
    <div class="rule-palette" id="val2Palette"></div>
    <div class="rule-built" id="ruleBuilt" dir="ltr">x → ?</div>
    <div class="action-row"><button class="btn btn-primary" id="testRuleBtn" type="button">🧪 اختبر القاعدة <span class="en-badge">Test Rule</span></button></div>
  ` + feedbackAreaHtml();
  renderHintRow(container, "rulefinder", r);
  let op1=null, val1=null, op2=null, val2=null;
  function buildPalette(elId, values, onPick){
    const el = document.getElementById(elId);
    values.forEach(v => {
      const btn = document.createElement("button");
      btn.className = "rule-op-btn"; btn.type="button"; btn.textContent = v === "none" ? "بدون" : v;
      btn.onclick = () => { el.querySelectorAll(".rule-op-btn").forEach(b=>b.classList.remove("active")); btn.classList.add("active"); onPick(v); refreshBuilt(); };
      el.appendChild(btn);
    });
  }
  buildPalette("op1Palette", ["×","+","-"], v => op1 = v);
  buildPalette("val1Palette", [1,2,3,4,5,6,7,8,9], v => val1 = v);
  buildPalette("op2Palette", ["none","×","+","-"], v => op2 = v === "none" ? null : v);
  buildPalette("val2Palette", [0,1,2,3,4,5,6,7,8,9], v => val2 = v);
  function refreshBuilt(){
    let s = "x";
    if(op1 && val1 !== null) s += ` ${op1} ${val1}`;
    if(op2 && val2 !== null) s += ` ${op2} ${val2}`;
    document.getElementById("ruleBuilt").textContent = s + " → y";
  }
  document.getElementById("testRuleBtn").onclick = () => {
    if(op1 === null || val1 === null){ showToast("اختر المرحلة الأولى على الأقل.", "Pick at least stage 1."); return; }
    const apply = (x) => {
      let y = x;
      if(op1 === "×") y = y*val1; else if(op1 === "+") y = y+val1; else if(op1 === "-") y = y-val1;
      if(op2){ const v2 = val2||0; if(op2 === "×") y = y*v2; else if(op2 === "+") y = y+v2; else if(op2 === "-") y = y-v2; }
      return y;
    };
    const allMatch = r.pairs.every(p => apply(p.x) === p.y);
    if(allMatch) finalizeRoundSuccess();
    else showMistakeFeedback();
  };
};

/* ---- Graphing Studio ---- */
RENDERERS.graphing = function(container, r){
  container.innerHTML = charRow("graphing", "ضع كل نقطة في مكانها الصحيح على الشبكة:", "Place each point in its correct spot on the grid:") + `
    <div style="text-align:center;font-family:'Space Mono',monospace;color:var(--ink-300);margin-bottom:8px;" id="pointsToPlace"></div>
    <div class="graph-wrap"><svg id="graphSvg"></svg></div>
  ` + feedbackAreaHtml();
  renderHintRow(container, "graphing", r);
  const W = 320, H = 320, pad = 28;
  const cols = r.maxX - r.minX, rows = r.maxY - r.minY;
  const cw = (W-2*pad)/cols, ch = (H-2*pad)/rows;
  function sx(x){ return pad + (x-r.minX)*cw; }
  function sy(y){ return H - pad - (y-r.minY)*ch; }
  const svg = document.getElementById("graphSvg");
  svg.setAttribute("width", W); svg.setAttribute("height", H); svg.classList.add("graph-grid");
  let svgHtml = "";
  for(let gx=r.minX; gx<=r.maxX; gx++) svgHtml += `<line class="graph-gridline" x1="${sx(gx)}" y1="${pad}" x2="${sx(gx)}" y2="${H-pad}"/>`;
  for(let gy=r.minY; gy<=r.maxY; gy++) svgHtml += `<line class="graph-gridline" x1="${pad}" y1="${sy(gy)}" x2="${W-pad}" y2="${sy(gy)}"/>`;
  svgHtml += `<line class="graph-axis" x1="${pad}" y1="${sy(0)}" x2="${W-pad}" y2="${sy(0)}"/>`;
  svgHtml += `<line class="graph-axis" x1="${sx(0)}" y1="${pad}" x2="${sx(0)}" y2="${H-pad}"/>`;
  for(let gx=r.minX; gx<=r.maxX; gx++){
    svgHtml += `<text class="graph-label" x="${sx(gx)}" y="${sy(0)+14}" text-anchor="middle">${gx}</text>`;
  }
  for(let gy=r.minY; gy<=r.maxY; gy++){
    if(gy === 0) continue;
    svgHtml += `<text class="graph-label" x="${sx(0)-10}" y="${sy(gy)+3}" text-anchor="end">${gy}</text>`;
  }
  /* Hidden answer markers — invisible until the "Guide" hint is tapped, so the
     correct spot isn't given away just by looking at the grid. */
  r.points.forEach((p,i) => {
    svgHtml += `<rect class="graph-point-answer" data-idx="${i}" x="${sx(p.x)-7}" y="${sy(p.y)-7}" width="14" height="14" rx="3"/>`;
  });
  /* A uniform, identical-looking clickable slot at EVERY grid intersection —
     not just the correct ones — so the answer can't be spotted from which
     dots happen to be clickable. */
  for(let gx=r.minX; gx<=r.maxX; gx++){
    for(let gy=r.minY; gy<=r.maxY; gy++){
      svgHtml += `<circle class="graph-point-slot" data-x="${gx}" data-y="${gy}" cx="${sx(gx)}" cy="${sy(gy)}" r="6"/>`;
    }
  }
  svg.innerHTML = svgHtml;
  document.getElementById("pointsToPlace").innerHTML = "النقاط المطلوبة: <span dir=\"ltr\">" + r.points.map(p=>`(${p.x}, ${p.y})`).join("  ·  ") + "</span>";
  let placedCount = 0;
  const placedIdx = new Set();
  svg.querySelectorAll(".graph-point-slot").forEach(slot => {
    slot.onclick = () => {
      const gx = Number(slot.dataset.x), gy = Number(slot.dataset.y);
      const idx = r.points.findIndex(p => p.x === gx && p.y === gy);
      if(idx === -1){ showMistakeFeedback(); return; }
      if(placedIdx.has(idx)) return;
      placedIdx.add(idx);
      slot.classList.add("placed");
      const answerRect = svg.querySelector(`.graph-point-answer[data-idx="${idx}"]`);
      if(answerRect) answerRect.classList.add("placed");
      placedCount++;
      if(placedCount === r.points.length){
        // draw connecting line
        const pathD = r.points.map((p,i) => `${i===0?"M":"L"}${sx(p.x)},${sy(p.y)}`).join(" ");
        svg.innerHTML += `<path class="graph-line" d="${pathD}"/>`;
        finalizeRoundSuccess();
      }
    };
  });
  /* Reveal the hidden answer markers only when the "Guide" hint tier (index 1) is tapped. */
  const guideBtn = container.querySelector('.hint-tier-btn[data-t="1"]');
  if(guideBtn){
    const origGuideHandler = guideBtn.onclick;
    guideBtn.onclick = () => {
      if(origGuideHandler) origGuideHandler();
      svg.querySelectorAll(".graph-point-answer").forEach(el => el.classList.add("revealed"));
    };
  }
};

/* ---- Ratio Builder ---- */
RENDERERS.ratiobuilder = function(container, r){
  const ctx = r.ctx;
  const rowsHtml = r.rows.map((row,i) => `
    <tr>
      <td>×${row.k}</td>
      <td>${row.blank === "a" ? `<input class="balance-num-input" data-row="${i}" data-side="a" style="width:56px;">` : row.aVal}</td>
      <td>${row.blank === "b" ? `<input class="balance-num-input" data-row="${i}" data-side="b" style="width:56px;">` : row.bVal}</td>
    </tr>`).join("");
  container.innerHTML = charRow("ratiobuilder", `النسبة الأساسية بين ${ctx.unitAr} و${ctx.unitBAr}. أكمل الجدول للنسب المكافئة!`,
    `Base ratio between ${ctx.unitEn} and ${ctx.unitBEn}. Complete the table of equivalent ratios!`) + `
    <div class="ratio-badge">${L(ctx.a + " : " + ctx.b)}</div>
    <table class="fn-table">
      <tr><th>×</th><th>${ctx.emojiA} ${ctx.unitAr}</th><th>${ctx.emojiB} ${ctx.unitBAr}</th></tr>
      ${rowsHtml}
    </table>
    <div class="action-row"><button class="btn btn-primary" id="checkRatioBtn" type="button">✓ تحقق <span class="en-badge">Check</span></button></div>
  ` + feedbackAreaHtml();
  renderHintRow(container, "ratiobuilder", r);
  document.getElementById("checkRatioBtn").onclick = () => {
    let allCorrect = true;
    container.querySelectorAll("input[data-row]").forEach(inp => {
      const rowIdx = Number(inp.dataset.row), side = inp.dataset.side;
      const expected = side === "a" ? r.rows[rowIdx].aVal : r.rows[rowIdx].bVal;
      if(Number(inp.value) !== expected) allCorrect = false;
    });
    if(allCorrect) finalizeRoundSuccess();
    else showMistakeFeedback();
  };
};

/* ---- Rate Garage ---- */
RENDERERS.rategarage = function(container, r){
  container.innerHTML = charRow("rategarage", `سيارة تقطع ${L(r.distance)} كم في ${L(r.time)} ساعة. ما سرعتها (كم/س)؟`, `A car travels ${r.distance} km in ${r.time} hours. What is its speed (km/h)?`) + `
    <div class="rate-rule-card">
      <div class="rate-rule-row">
        <div class="rate-rule-item">
          <div class="rate-rule-pic">🛣️🚗</div>
          <div class="rate-rule-txt">المسافة<span class="en-badge">Distance</span></div>
        </div>
        <div class="rate-rule-op">÷</div>
        <div class="rate-rule-item">
          <div class="rate-rule-pic">⏱️</div>
          <div class="rate-rule-txt">الزمن<span class="en-badge">Time</span></div>
        </div>
        <div class="rate-rule-op">=</div>
        <div class="rate-rule-item">
          <div class="rate-rule-pic">🏎️💨</div>
          <div class="rate-rule-txt">السرعة<span class="en-badge">Speed</span></div>
        </div>
      </div>
    </div>
    <div class="rate-dial" id="rateDial"><div class="rate-needle" id="rateNeedle"></div><div class="rate-hub"></div></div>
    <div class="keypad-display" id="keypadDisplay"><span class="kp-cursor">|</span></div>
    <div class="keypad-grid" id="keypadGrid"></div>
  ` + feedbackAreaHtml();
  renderHintRow(container, "rategarage", r);
  buildKeypad(document.getElementById("keypadDisplay"), document.getElementById("keypadGrid"), {allowNegative:false}, (value) => {
    const needle = document.getElementById("rateNeedle");
    const angle = -90 + Math.min(180, (Number(value)/r.maxSpeed)*180);
    needle.style.transform = `rotate(${angle}deg)`;
    if(Number(value) === r.correct) finalizeRoundSuccess();
    else showMistakeFeedback();
  });
};

/* ---- Proportion Board ---- */
RENDERERS.proportion = function(container, r){
  container.innerHTML = charRow("proportion", "أوجد قيمة x في التناسب التالي:", "Find the value of x in the following proportion:") + `
    <div class="formula-card">
      <div style="text-align:center;font-size:12px;font-weight:700;color:var(--ink-300);margin-bottom:2px;">
        الفكرة: الرقم العلوي والرقم السفلي يُضربان في نفس العدد للحصول على كسر مكافئ. مثال:
        <span class="en-badge">The idea: the top number and the bottom number are multiplied by the same number to get an equivalent fraction. Example:</span>
      </div>
      <div class="proportion-eq" style="margin:8px 0;gap:10px;">
        <div class="frac">
          <div class="frac-num" style="font-size:18px;padding:1px 8px;">2</div>
          <div class="frac-bar"></div>
          <div class="frac-den" style="font-size:18px;padding:1px 8px;">5</div>
        </div>
        <div class="frac-eq-sign" style="font-size:17px;">×3</div>
        <div class="frac-eq-sign" style="font-size:17px;">=</div>
        <div class="frac">
          <div class="frac-num" style="font-size:18px;padding:1px 8px;">6</div>
          <div class="frac-bar"></div>
          <div class="frac-den" style="font-size:18px;padding:1px 8px;">15</div>
        </div>
      </div>
      <div style="text-align:center;font-size:12px;font-weight:700;color:var(--gold-500);margin-top:2px;">
        🔁 استخدم نفس الفكرة مع أرقام السؤال. <span class="en-badge">Use the same idea with the numbers below.</span>
      </div>
    </div>
    <div class="proportion-eq">
      <div class="frac"><div class="frac-num">${r.a}</div><div class="frac-bar"></div><div class="frac-den">${r.b}</div></div>
      <div class="frac-eq-sign">=</div>
      <div class="frac"><div class="frac-num">x</div><div class="frac-bar"></div><div class="frac-den">${r.d}</div></div>
    </div>
    <div class="keypad-display" id="keypadDisplay"><span class="kp-cursor">|</span></div>
    <div class="keypad-grid" id="keypadGrid"></div>
  ` + feedbackAreaHtml();
  renderHintRow(container, "proportion", r);
  buildKeypad(document.getElementById("keypadDisplay"), document.getElementById("keypadGrid"), {allowNegative:false}, (value) => {
    if(Number(value) === r.x) finalizeRoundSuccess();
    else showMistakeFeedback();
  });
};

/* ---- Percentage Market ---- */
RENDERERS.percent = function(container, r){
  container.innerHTML = charRow("percent", `منتج سعره ${L(r.price + " SAR")} وعليه خصم ${L(r.pct + "%")}. احسب قيمة الخصم، ثم السعر النهائي.`,
    `An item costs ${r.price} SAR with a ${r.pct}% discount. Compute the discount, then the final price.`) + `
    <div class="formula-card">
      <div class="formula-row">
        <div class="formula-item"><div class="formula-pic">🏷️</div><div class="formula-txt">السعر<span class="en-badge">Price</span></div></div>
        <div class="formula-op">×</div>
        <div class="formula-item"><div class="formula-pic">📊</div><div class="formula-txt">النسبة٪<span class="en-badge">Percent %</span></div></div>
        <div class="formula-op">=</div>
        <div class="formula-item"><div class="formula-pic">💸</div><div class="formula-txt">الخصم<span class="en-badge">Discount</span></div></div>
      </div>
      <div class="formula-row">
        <div class="formula-item"><div class="formula-pic">🏷️</div><div class="formula-txt">السعر<span class="en-badge">Price</span></div></div>
        <div class="formula-op">−</div>
        <div class="formula-item"><div class="formula-pic">💸</div><div class="formula-txt">الخصم<span class="en-badge">Discount</span></div></div>
        <div class="formula-op">=</div>
        <div class="formula-item"><div class="formula-pic">🛍️</div><div class="formula-txt">السعر النهائي<span class="en-badge">Final price</span></div></div>
      </div>
    </div>
    <div class="shop-card">
      <div class="shop-emoji">${r.item.emoji}</div>
      <div>${r.item.ar}<span class="en-badge" style="display:block;">${r.item.en}</span></div>
      <div class="shop-price">${r.price} SAR</div>
      <div class="shop-discount">خصم ${r.pct}%</div>
    </div>
    <div style="text-align:center;font-weight:800;color:var(--ink-300);">قيمة الخصم <span class="en-badge">Discount amount</span></div>
    <div class="keypad-display" id="keypadDisplay1"><span class="kp-cursor">|</span></div>
    <div class="keypad-grid" id="keypadGrid1"></div>
    <div id="stage2" style="display:none;">
      <div style="text-align:center;font-weight:800;color:var(--ink-300);margin-top:14px;">السعر النهائي <span class="en-badge">Final price</span></div>
      <div class="keypad-display" id="keypadDisplay2"><span class="kp-cursor">|</span></div>
      <div class="keypad-grid" id="keypadGrid2"></div>
    </div>
  ` + feedbackAreaHtml();
  renderHintRow(container, "percent", r);
  let discountOk = false;
  buildKeypad(document.getElementById("keypadDisplay1"), document.getElementById("keypadGrid1"), {allowNegative:false}, (value) => {
    if(Number(value) === r.discount){
      discountOk = true;
      document.getElementById("stage2").style.display = "block";
      showToast("صحيح! أكمل الآن السعر النهائي.", "Correct! Now finish the final price.");
    } else {
      showMistakeFeedback();
    }
  });
  buildKeypad(document.getElementById("keypadDisplay2"), document.getElementById("keypadGrid2"), {allowNegative:false}, (value) => {
    if(!discountOk){ showToast("أكمل قيمة الخصم أولًا.", "Finish the discount amount first."); return; }
    if(Number(value) === r.final) finalizeRoundSuccess();
    else showMistakeFeedback();
  });
};

/* ---------- Shared keypad builder ---------- */
/* opts: allowNegative, allowDecimal ("."), allowFraction ("/"), checkLabel.
   onCheck(valueString) is called when ✓ is pressed. */
function buildKeypad(displayEl, gridEl, opts, onCheck){
  let value = "";
  opts = opts || {};
  const allowNeg = !!opts.allowNegative, allowDec = !!opts.allowDecimal, allowFrac = !!opts.allowFraction;
  function renderDisplay(){
    displayEl.innerHTML = (value === "" ? '<span class="kp-placeholder">؟</span>' : `<span dir="ltr">${value}</span>`) + '<span class="kp-cursor">|</span>';
  }
  const keys = ["7","8","9","4","5","6","1","2","3", allowNeg ? "+/-" : "", "0","⌫"];
  if(allowDec || allowFrac){ keys.push(allowDec ? "." : "", allowFrac ? "/" : "", ""); }
  keys.forEach(k => {
    const btn = document.createElement("button");
    btn.type = "button";
    if(k === ""){ btn.className = "keypad-key kp-blank"; btn.disabled = true; btn.tabIndex = -1; gridEl.appendChild(btn); return; }
    btn.className = "keypad-key" + (k==="⌫"?" kp-back":"") + (k==="+/-"?" kp-sign":"") + ((k==="."||k==="/")?" kp-sign":"");
    btn.textContent = k; btn.dataset.k = k;
    btn.onclick = () => {
      if(k === "⌫") value = value.slice(0,-1);
      else if(k === "+/-") value = value.startsWith("-") ? value.slice(1) : "-"+value;
      else if(k === "." ){ const seg = value.split("/").pop(); if(!seg.includes(".")) value += (seg===""||seg==="-") ? "0." : "."; }
      else if(k === "/"){ if(!value.includes("/") && /\d$/.test(value)) value += "/"; }
      else { if(value.length < 12) value += k; }
      renderDisplay();
    };
    gridEl.appendChild(btn);
  });
  renderDisplay();
  const checkBtn = document.createElement("button");
  checkBtn.className = "btn btn-primary kp-check"; checkBtn.type = "button"; checkBtn.style.marginTop="8px";
  checkBtn.innerHTML = opts.checkLabel || '✓ تحقق <span class="en-badge">Check</span>';
  checkBtn.onclick = () => { if(value !== "" && value !== "-") onCheck(value); };
  const wrap = document.createElement("div"); wrap.className = "kp-check-row"; wrap.appendChild(checkBtn);
  gridEl.parentElement.insertBefore(wrap, gridEl.nextSibling);
  return { clear(){ value=""; renderDisplay(); }, get(){ return value; } };
}

/* Parse "3", "-2.5", "3/4", "-7/2" into a number (NaN if malformed). */
function parseAnswer(v){
  v = String(v).trim();
  if(v.includes("/")){
    const [a,b] = v.split("/");
    const na = Number(a), nb = Number(b);
    if(b === "" || Number.isNaN(na) || Number.isNaN(nb) || nb === 0) return NaN;
    return na/nb;
  }
  return Number(v);
}
/* Does the typed answer equal the expected one? expected may be a number or a "a/b" string. */
function answerMatches(typed, expected){
  const a = parseAnswer(typed), b = typeof expected === "number" ? expected : parseAnswer(expected);
  if(Number.isNaN(a) || Number.isNaN(b)) return false;
  return Math.abs(a-b) < 1e-9;
}

/* ===========================================================
   Generic machine library (shared by every grade's Math Lab)
   Each machine in data.js has a `type` naming one of these
   renderers; its GEN.<key>() supplies the round's content.
   Every renderer is a hands-on manipulation (tap / build /
   move / shade / sort), not a plain multiple-choice quiz.
   =========================================================== */

function P(r, ar, en){ return charRow(null, r.promptAr || ar, r.promptEn || en); }
function kpHtml(id){ return `<div class="keypad-display" id="kpd${id}"><span class="kp-cursor">|</span></div><div class="keypad-grid" id="kpg${id}"></div>`; }
function mountKeypad(id, opts, onCheck){ return buildKeypad(document.getElementById("kpd"+id), document.getElementById("kpg"+id), opts || {}, onCheck); }
function fmtNum(v, dp){
  if(Math.abs(v - Math.round(v)) < 1e-9) return String(Math.round(v));
  const s = v.toFixed(dp === undefined ? 3 : dp);
  return s.replace(/\.?0+$/,"");
}
function fracHtml(n, d, small){
  return `<span class="mfrac${small?" small":""}" dir="ltr"><span class="mf-n">${n}</span><span class="mf-b"></span><span class="mf-d">${d}</span></span>`;
}
function stepLabel(ar, en){ return `<div class="step-label">${ar} <span class="en-badge">${en||""}</span></div>`; }
function checkBtnHtml(id, ar, en){ return `<div class="action-row"><button class="btn btn-primary" id="${id}" type="button">${ar||"✓ تحقق"} <span class="en-badge">${en||"Check"}</span></button></div>`; }
function flash(el, cls){ if(!el) return; el.classList.remove(cls||"shake"); void el.offsetWidth; el.classList.add(cls||"shake"); }

/* Small visual helpers generators can call (at run time) */
const VIS = {
  tenFrame(n, emoji, total){
    total = total || 10;
    let h = `<div class="ten-frame" dir="ltr">`;
    for(let i=0;i<total;i++) h += `<div class="tf-cell">${i<n ? emoji : ""}</div>`;
    return h + `</div>`;
  },
  groups(k, per, emoji){
    let h = `<div class="vis-groups">`;
    for(let g=0; g<k; g++){ h += `<div class="vis-group">${emoji.repeat(per)}</div>`; }
    return h + `</div>`;
  },
  row(n, emoji){ return `<div class="vis-row">${Array.from({length:n}).map(()=>`<span>${emoji}</span>`).join("")}</div>`; },
  tally(n){
    let h = `<span class="tally" dir="ltr">`;
    for(let i=0;i<Math.floor(n/5);i++) h += `<span class="tally5">||||</span>`;
    h += "|".repeat(n%5);
    return h + `</span>`;
  },
  table(headers, rows){
    return `<table class="fn-table">
      <tr>${headers.map(h=>`<th>${h}</th>`).join("")}</tr>
      ${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}
    </table>`;
  },
  /* Simple SVG coordinate grid with optional segments/points/polygons */
  grid(opts){
    const v = Object.assign({xmin:-6,xmax:6,ymin:-6,ymax:6,W:300,H:300,pad:24}, opts||{});
    const cw = (v.W-2*v.pad)/(v.xmax-v.xmin), ch = (v.H-2*v.pad)/(v.ymax-v.ymin);
    const sx = x => v.pad + (x-v.xmin)*cw, sy = y => v.H - v.pad - (y-v.ymin)*ch;
    let s = `<svg class="graph-grid" width="${v.W}" height="${v.H}" viewBox="0 0 ${v.W} ${v.H}">`;
    for(let x=Math.ceil(v.xmin); x<=v.xmax; x++) s += `<line class="graph-gridline" x1="${sx(x)}" y1="${v.pad}" x2="${sx(x)}" y2="${v.H-v.pad}"/>`;
    for(let y=Math.ceil(v.ymin); y<=v.ymax; y++) s += `<line class="graph-gridline" x1="${v.pad}" y1="${sy(y)}" x2="${v.W-v.pad}" y2="${sy(y)}"/>`;
    if(v.ymin<=0 && v.ymax>=0) s += `<line class="graph-axis" x1="${v.pad}" y1="${sy(0)}" x2="${v.W-v.pad}" y2="${sy(0)}"/>`;
    if(v.xmin<=0 && v.xmax>=0) s += `<line class="graph-axis" x1="${sx(0)}" y1="${v.pad}" x2="${sx(0)}" y2="${v.H-v.pad}"/>`;
    const lx = Math.max(1, Math.ceil((v.xmax-v.xmin)/12)), ly = Math.max(1, Math.ceil((v.ymax-v.ymin)/12));
    for(let x=Math.ceil(v.xmin); x<=v.xmax; x++) if(x!==0 && x%lx===0) s += `<text class="graph-label" x="${sx(x)}" y="${Math.min(v.H-6, Math.max(12, sy(0)+14))}" text-anchor="middle">${x}</text>`;
    for(let y=Math.ceil(v.ymin); y<=v.ymax; y++) if(y!==0 && y%ly===0) s += `<text class="graph-label" x="${Math.max(10, Math.min(v.W-4, sx(0)-6))}" y="${sy(y)+4}" text-anchor="end">${y}</text>`;
    (v.polys||[]).forEach(p => { s += `<polygon class="${p.cls||"vis-poly"}" points="${p.pts.map(q=>sx(q[0])+","+sy(q[1])).join(" ")}"/>`; });
    (v.segs||[]).forEach(g => { s += `<line class="${g.cls||"graph-line"}" x1="${sx(g.a[0])}" y1="${sy(g.a[1])}" x2="${sx(g.b[0])}" y2="${sy(g.b[1])}"/>`; });
    (v.paths||[]).forEach(p => { s += `<path class="${p.cls||"graph-line"}" d="${p.pts.map((q,i)=>(i?"L":"M")+sx(q[0]).toFixed(1)+","+sy(q[1]).toFixed(1)).join(" ")}"/>`; });
    (v.pts||[]).forEach(p => {
      s += `<circle class="${p.cls||"vis-pt"}" cx="${sx(p.x)}" cy="${sy(p.y)}" r="6"/>`;
      if(p.label) s += `<text class="vis-pt-label" x="${sx(p.x)+9}" y="${sy(p.y)-9}">${p.label}</text>`;
    });
    return s + `</svg>`;
  }
};

/* ---------------- 1. COUNT: tap-to-count, make-a-set, compare groups ---------------- */
RENDERERS.count = function(container, r){
  if(r.mode === "make"){
    const frames = Math.ceil(Math.max(r.n, 1)/10);
    container.innerHTML = P(r, `ضع ${L(r.n)} في الإطار!`, `Put ${r.n} in the frame!`) + `
      <div class="big-numeral" dir="ltr">${r.n}</div>
      <div class="frames-wrap" id="cfFrames">${Array.from({length:frames}).map(()=>VIS.tenFrame(0,"",10)).join("")}</div>
      <div class="count-pool" id="cfPool"></div>
      ${checkBtnHtml("cfDone","✓ انتهيت","Done")}
    ` + feedbackAreaHtml();
    renderHintRow(container, "count", r);
    const cells = [...container.querySelectorAll(".tf-cell")];
    const pool = document.getElementById("cfPool");
    let placed = 0;
    function refresh(){ cells.forEach((c,i) => { c.textContent = i < placed ? r.emoji : ""; c.classList.toggle("filled", i<placed); }); }
    for(let i=0;i<r.poolCount;i++){
      const b = document.createElement("button"); b.type="button"; b.className="count-obj"; b.textContent=r.emoji;
      b.onclick = () => { if(placed >= cells.length) return; placed++; b.classList.add("used"); b.disabled = true; refresh(); };
      pool.appendChild(b);
    }
    cells.forEach((c,i) => c.onclick = () => {
      if(i < placed){ placed--; const used = pool.querySelectorAll(".count-obj.used"); const last = used[used.length-1]; if(last){ last.classList.remove("used"); last.disabled=false; } refresh(); }
    });
    document.getElementById("cfDone").onclick = () => { if(placed === r.n) finalizeRoundSuccess(); else showMistakeFeedback(); };
    return;
  }
  if(r.mode === "compare"){
    container.innerHTML = P(r, r.ask==="more" ? "أيّ مجموعة فيها أكثر؟ اضغط عليها." : "أيّ مجموعة فيها أقل؟ اضغط عليها.",
      r.ask==="more" ? "Which group has more? Tap it." : "Which group has fewer? Tap it.") + `
      <div class="cmp-wrap">
        <button class="cmp-box" type="button" data-g="0">${VIS.row(r.a, r.emojiA)}</button>
        <button class="cmp-box" type="button" data-g="1">${VIS.row(r.b, r.emojiB)}</button>
      </div>` + feedbackAreaHtml();
    renderHintRow(container, "count", r);
    const correct = (r.ask==="more") === (r.a > r.b) ? 0 : 1;
    container.querySelectorAll(".cmp-box").forEach(b => b.onclick = () => {
      if(Number(b.dataset.g) === correct){ b.classList.add("right"); finalizeRoundSuccess(); }
      else { flash(b); showMistakeFeedback(); }
    });
    return;
  }
  /* default: count */
  container.innerHTML = P(r, "اضغط على كل شكل لتعدّه، ثم اختر العدد:", "Tap each object to count it, then pick the number:") + `
    <div class="count-field" id="cField"></div>
    <div class="count-running" id="cRun" dir="ltr">0</div>
    <div class="num-tiles" id="cTiles"></div>
  ` + feedbackAreaHtml();
  renderHintRow(container, "count", r);
  const field = document.getElementById("cField");
  let counted = 0;
  for(let i=0;i<r.n;i++){
    const b = document.createElement("button"); b.type="button"; b.className="count-obj"; b.textContent=r.emoji;
    b.onclick = () => { if(b.classList.contains("counted")) return; counted++; b.classList.add("counted"); b.dataset.num = counted; document.getElementById("cRun").textContent = counted; };
    field.appendChild(b);
  }
  const tiles = document.getElementById("cTiles");
  r.choices.forEach(v => {
    const t = document.createElement("button"); t.type="button"; t.className="num-tile"; t.textContent=v; t.dataset.v=v;
    t.onclick = () => { if(v === r.n){ t.classList.add("right"); finalizeRoundSuccess(); } else { flash(t); showMistakeFeedback(); } };
    tiles.appendChild(t);
  });
};

/* ---------------- 2. SORTBINS: tap an item, then tap its bin ---------------- */
RENDERERS.sortbins = function(container, r){
  container.innerHTML = P(r, "اضغط على بطاقة، ثم اضغط على الصندوق المناسب لها:", "Tap a card, then tap the box it belongs in:") + `
    <div class="sort-tray" id="sTray"></div>
    <div class="sort-bins" id="sBins"></div>
  ` + feedbackAreaHtml();
  renderHintRow(container, "sortbins", r);
  const tray = document.getElementById("sTray"), bins = document.getElementById("sBins");
  let selected = null, left = r.items.length;
  r.items.forEach((it,i) => {
    const b = document.createElement("button"); b.type="button"; b.className="sort-item" + (it.ltr?" ltr":""); b.dataset.i=i; b.innerHTML = it.html;
    b.onclick = () => { if(b.classList.contains("placed")) return; tray.querySelectorAll(".sort-item").forEach(x=>x.classList.remove("selected")); b.classList.add("selected"); selected = i; };
    tray.appendChild(b);
  });
  r.bins.forEach((bn,bi) => {
    const d = document.createElement("div"); d.className="sort-bin"; d.dataset.b=bi;
    d.innerHTML = `<div class="sort-bin-head">${bn.emoji?bn.emoji+" ":""}${bn.ar}<span class="en-badge">${bn.en||""}</span></div><div class="sort-bin-zone"></div>`;
    d.onclick = () => {
      if(selected === null){ showToast("اختر بطاقة أولًا.", "Pick a card first."); return; }
      const item = tray.querySelector(`.sort-item[data-i="${selected}"]`);
      if(r.items[selected].bin === bi){
        item.classList.remove("selected"); item.classList.add("placed"); item.disabled = true;
        d.querySelector(".sort-bin-zone").appendChild(item);
        selected = null; left--;
        if(left === 0) finalizeRoundSuccess();
      } else { flash(item); flash(d); showMistakeFeedback(); }
    };
    bins.appendChild(d);
  });
};

/* ---------------- 3. ORDERCARDS: tap cards into order ---------------- */
RENDERERS.ordercards = function(container, r){
  container.innerHTML = P(r, "رتّب البطاقات بالضغط عليها بالترتيب الصحيح:", "Put the cards in order by tapping them:") + `
    ${r.beforeHtml ? `<div class="kv-visual">${r.beforeHtml}</div>` : ""}
    <div class="oc-ends"><span>① ${r.firstAr||""}<span class="en-badge">${r.firstEn||""}</span></span><span>${r.lastAr||""}<span class="en-badge">${r.lastEn||""}</span></span></div>
    <div class="oc-row" id="ocRow"></div>
    <div class="oc-pool" id="ocPool"></div>
    <div id="ocAfter"></div>
  ` + feedbackAreaHtml();
  renderHintRow(container, "ordercards", r);
  const row = document.getElementById("ocRow"), pool = document.getElementById("ocPool");
  const slots = [];
  const n = r.cards.length;
  const seq = [];
  for(let s=0;s<n;s++){ const d = document.createElement("div"); d.className="oc-slot"; d.innerHTML=`<span class="oc-num">${s+1}</span>`; row.appendChild(d); slots.push(d); }
  const cardEls = r.cards.map((c,i) => {
    const b = document.createElement("button"); b.type="button"; b.className="oc-card" + (r.ltr?" ltr":""); b.dataset.i=i; b.innerHTML=c;
    b.onclick = () => {
      if(done) return;
      const at = seq.indexOf(i);
      if(at >= 0){ seq.splice(at,1); pool.appendChild(b); }
      else { if(seq.length>=n) return; seq.push(i); }
      render();
    };
    pool.appendChild(b); return b;
  });
  let done = false;
  function render(){
    slots.forEach((s,k) => {
      s.querySelectorAll(".oc-card").forEach(c => pool.appendChild(c));
      if(seq[k] !== undefined) s.appendChild(cardEls[seq[k]]);
      s.classList.toggle("filled", seq[k] !== undefined);
    });
    if(seq.length === n){
      const ok = seq.every((v,k) => r.order[k] === v || (r.equalGroups && r.equalGroups.some(g => g.includes(v) && g.includes(r.order[k]))));
      if(ok){
        done = true;
        cardEls.forEach(c=>c.disabled=true);
        if(r.after){
          const a = r.after;
          document.getElementById("ocAfter").innerHTML = stepLabel(a.ar, a.en) + kpHtml("A");
          mountKeypad("A", a.opts, v => { if(answerMatches(v, a.answer)) finalizeRoundSuccess(); else showMistakeFeedback(); });
          showToast("الترتيب صحيح! أكمل الآن.", "Correct order! Now finish.");
        } else finalizeRoundSuccess();
      } else { flash(row); showMistakeFeedback(); }
    }
  }
};

/* ---------------- 4. PLACEVALUE: build / read a number with place-value discs ---------------- */
RENDERERS.placevalue = function(container, r){
  const dp = r.dp || 0, scale = Math.pow(10, dp);
  const units = r.places.map(p => Math.round(p.val*scale));
  const counts = r.mode === "read" ? r.counts.slice() : r.places.map(()=>0);
  const prompt = r.mode === "read" ? ["ما العدد الذي تمثله الأقراص؟ اكتبه:", "What number do the discs show? Type it:"] : ["ابنِ العدد بإضافة الأقراص أو إزالتها:", "Build the number by adding or removing discs (+ / −):"];
  container.innerHTML = P(r, prompt[0], prompt[1]) + `
    ${r.mode === "read" ? "" : `<div class="pv-target">${r.targetHtml || `<span dir="ltr">${fmtNum(r.target, dp)}</span>`}</div>`}
    <div class="pv-chart" dir="ltr" id="pvChart"></div>
    ${r.mode === "read" ? kpHtml("P") : `<div class="pv-readout" dir="ltr" id="pvRead">0</div>` + checkBtnHtml("pvCheck")}
  ` + feedbackAreaHtml();
  renderHintRow(container, "placevalue", r);
  const chart = document.getElementById("pvChart");
  r.places.forEach((p,i) => {
    const col = document.createElement("div"); col.className = "pv-col pv-c"+(i%6);
    col.innerHTML = `<div class="pv-head">${p.ar}<span class="en-badge">${p.en||""}</span></div>
      <div class="pv-discs" id="pvD${i}"></div>
      <div class="pv-count" id="pvN${i}">0</div>
      ${r.mode === "read" ? "" : `<div class="pv-btns"><button type="button" class="pv-btn" data-i="${i}" data-d="-1">−</button><button type="button" class="pv-btn" data-i="${i}" data-d="1">+</button></div>`}`;
    chart.appendChild(col);
  });
  function draw(){
    r.places.forEach((p,i) => {
      document.getElementById("pvD"+i).innerHTML = Array.from({length:counts[i]}).map(()=>`<span class="pv-disc">${p.label||fmtNum(p.val, dp)}</span>`).join("");
      document.getElementById("pvN"+i).textContent = counts[i];
    });
    const ro = document.getElementById("pvRead");
    if(ro){ const tot = counts.reduce((s,c,i)=>s+c*units[i],0); ro.textContent = fmtNum(tot/scale, dp); }
  }
  draw();
  container.querySelectorAll(".pv-btn").forEach(b => b.onclick = () => {
    const i = Number(b.dataset.i), d = Number(b.dataset.d);
    counts[i] = Math.max(0, Math.min(19, counts[i]+d)); draw();
  });
  if(r.mode === "read"){
    mountKeypad("P", {allowDecimal: dp>0}, v => { if(answerMatches(v, r.target)) finalizeRoundSuccess(); else showMistakeFeedback(); });
  } else {
    document.getElementById("pvCheck").onclick = () => {
      const tot = counts.reduce((s,c,i)=>s+c*units[i],0);
      const want = Math.round(r.target*scale);
      if(tot === want && counts.every(c => c <= 9)) finalizeRoundSuccess();
      else if(tot === want){ showToast("القيمة صحيحة! لكن بدّل كل 10 أقراص بقرص واحد من المنزلة الأكبر.", "Right value! Now trade every 10 discs for 1 disc of the next place."); }
      else showMistakeFeedback();
    };
  }
};

/* ---------------- 5. NUMLINE: tap a point / hop along a number line ---------------- */
RENDERERS.numline = function(container, r){
  const N = Math.round((r.max - r.min)/r.step);
  const vals = Array.from({length:N+1}).map((_,i) => r.min + i*r.step);
  const every = r.labelEvery || 1;
  function lab(v, i){
    if(!(i === 0 || i === N || i % every === 0 || r.labelAll)) return "";
    if(r.fmt === "frac"){
      const num = Math.round(v*r.den);
      if(num % r.den === 0) return String(num/r.den);
      if(r.mixed && Math.abs(num) > r.den){ const w = Math.trunc(num/r.den), rem = Math.abs(num % r.den); return `<span dir="ltr">${w}${fracHtml(rem, r.den, true)}</span>`; }
      return fracHtml(num, r.den, true);
    }
    return fmtNum(v, r.dp);
  }
  const hop = r.mode === "hop";
  container.innerHTML = P(r, hop ? "حرّك الضفدع بالقفزات حتى تصل، ثم اضغط «هنا»:" : "اضغط على مكان العدد على خط الأعداد:",
                             hop ? "Hop the frog until you arrive, then press “Here”:" : "Tap where the number goes on the number line:") + `
    ${r.showHtml ? `<div class="pv-target">${r.showHtml}</div>` : ""}
    <div class="nl2" dir="ltr" id="nl2">
      <div class="nl2-track"></div>
      <div class="nl2-ticks" id="nl2Ticks"></div>
      ${hop ? `<div class="nl2-frog" id="nl2Frog">🐸</div>` : ""}
    </div>
    ${hop ? `<div class="nl-controls" dir="ltr">
        <button class="nl-arrow-btn wide" id="hopL" type="button">◀ −${fmtNum(r.hop, r.dp)}</button>
        <button class="btn btn-primary" id="hopHere" type="button">📍 هنا <span class="en-badge">Here</span></button>
        <button class="nl-arrow-btn wide" id="hopR" type="button">+${fmtNum(r.hop, r.dp)} ▶</button>
      </div><div class="nl-step-count" id="hopCount">القفزات: <span dir="ltr">0</span></div>` : ""}
  ` + feedbackAreaHtml();
  renderHintRow(container, "numline", r);
  const ticks = document.getElementById("nl2Ticks");
  vals.forEach((v,i) => {
    const t = document.createElement(hop ? "div" : "button");
    if(!hop) t.type = "button";
    t.className = "nl2-tick" + (r.marker !== undefined && Math.abs(v - r.marker) < 1e-9 ? " marked" : "");
    t.dataset.i = i;
    t.innerHTML = `<span class="nl2-mark"></span><span class="nl2-lab">${lab(v,i)}</span>`;
    ticks.appendChild(t);
  });
  if(r.marker !== undefined && !vals.some(v => Math.abs(v-r.marker)<1e-9)){
    const pin = document.createElement("div"); pin.className = "nl2-pin"; pin.innerHTML = `📌<span dir="ltr">${r.markerLabel||fmtNum(r.marker, r.dp)}</span>`;
    pin.style.left = `calc(14px + (100% - 28px) * ${(r.marker - r.min)/(r.max - r.min)})`;
    document.getElementById("nl2").appendChild(pin);
  } else if(r.marker !== undefined){
    const pin = document.createElement("div"); pin.className = "nl2-pin"; pin.innerHTML = `📌<span dir="ltr">${r.markerLabel||fmtNum(r.marker, r.dp)}</span>`;
    pin.style.left = `calc(14px + (100% - 28px) * ${(r.marker - r.min)/(r.max - r.min)})`;
    document.getElementById("nl2").appendChild(pin);
  }
  const targetIdx = Math.round((r.target - r.min)/r.step);
  if(!hop){
    ticks.querySelectorAll(".nl2-tick").forEach(t => t.onclick = () => {
      if(Number(t.dataset.i) === targetIdx){ t.classList.add("right"); if(!t.querySelector(".nl2-lab").textContent.trim()) t.querySelector(".nl2-lab").innerHTML = lab(vals[targetIdx], 0); finalizeRoundSuccess(); }
      else { flash(t); showMistakeFeedback(); }
    });
  } else {
    let pos = Math.round((r.start - r.min)/r.step), hops = 0;
    const hopIdx = Math.round(r.hop / r.step);
    const frog = document.getElementById("nl2Frog");
    function place(){ frog.style.left = `calc(14px + (100% - 28px) * ${pos/N})`; document.getElementById("hopCount").innerHTML = `القفزات: <span dir="ltr">${hops}</span> <span class="en-badge">hops</span>`; }
    place();
    document.getElementById("hopL").onclick = () => { if(pos - hopIdx < 0) return; pos -= hopIdx; hops++; place(); };
    document.getElementById("hopR").onclick = () => { if(pos + hopIdx > N) return; pos += hopIdx; hops++; place(); };
    document.getElementById("hopHere").onclick = () => { if(pos === targetIdx) finalizeRoundSuccess(); else showMistakeFeedback(); };
  }
};

/* ---------------- 6. ARRAY: build rows × columns / squares / split (distributive) ---------------- */
RENDERERS.array = function(container, r){
  let rows = 1, cols = 1, split = r.mode === "split" ? 1 : 0;
  const maxR = r.maxRows || 12, maxC = r.maxCols || 12;
  const titleAr = r.mode === "square" ? `كوّن مربعًا مساحته ${L(r.n)} وحدة مربعة.` : r.mode === "split" ? `حرّك خط التقسيم ليصبح ${L(r.b)} = ${L(r.c)} + ${L(r.b - r.c)}` : `ابنِ مصفوفة ${L(r.a)} صفوف × ${L(r.b)} أعمدة.`;
  const titleEn = r.mode === "square" ? `Build a square with area ${r.n} square units.` : r.mode === "split" ? `Move the split line so ${r.b} = ${r.c} + ${r.b-r.c}` : `Build an array of ${r.a} rows × ${r.b} columns.`;
  if(r.mode === "split"){ rows = r.a; cols = r.b; }
  container.innerHTML = P(r, titleAr, titleEn) + `
    <div class="arr-wrap"><div class="arr-grid" id="arrGrid" dir="ltr"></div></div>
    <div class="arr-ctrls" dir="ltr">
      ${r.mode === "split" ? `
        <div class="arr-ctrl"><span>خط التقسيم <span class="en-badge">split</span></span><button type="button" class="pv-btn" id="spL">−</button><b id="spV">1</b><button type="button" class="pv-btn" id="spR">+</button></div>`
      : r.mode === "square" ? `
        <div class="arr-ctrl"><span>طول الضلع <span class="en-badge">side</span></span><button type="button" class="pv-btn" id="sdM">−</button><b id="sdV">1</b><button type="button" class="pv-btn" id="sdP">+</button></div>`
      : `
        <div class="arr-ctrl"><span>صفوف <span class="en-badge">rows</span></span><button type="button" class="pv-btn" id="rwM">−</button><b id="rwV">1</b><button type="button" class="pv-btn" id="rwP">+</button></div>
        <div class="arr-ctrl"><span>أعمدة <span class="en-badge">cols</span></span><button type="button" class="pv-btn" id="clM">−</button><b id="clV">1</b><button type="button" class="pv-btn" id="clP">+</button></div>`}
    </div>
    <div class="arr-readout" id="arrRead" dir="ltr"></div>
    ${r.mode === "split" ? "" : checkBtnHtml("arrCheck", "✓ هذه مصفوفتي", "That's my array")}
    <div id="arrStage"></div>
  ` + feedbackAreaHtml();
  renderHintRow(container, "array", r);
  const grid = document.getElementById("arrGrid");
  let locked = false;
  function draw(){
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    let h = "";
    for(let i=0;i<rows;i++) for(let j=0;j<cols;j++){
      const part = split && j >= split ? " b" : "";
      h += `<span class="arr-dot${part}${split && j === split-1 ? " edge" : ""}">${r.emoji||""}</span>`;
    }
    grid.innerHTML = h;
    const rd = document.getElementById("arrRead");
    if(r.mode === "split") rd.textContent = `${rows} × (${split} + ${cols-split})`;
    else rd.textContent = `${rows} × ${cols}`;
    ["rwV","clV","sdV","spV"].forEach(id => { const e = document.getElementById(id); if(e) e.textContent = id==="rwV"?rows:id==="clV"?cols:id==="sdV"?rows:split; });
  }
  draw();
  const bind = (id, fn) => { const e = document.getElementById(id); if(e) e.onclick = () => { if(locked) return; fn(); draw(); }; };
  bind("rwM", () => rows = Math.max(1, rows-1)); bind("rwP", () => rows = Math.min(maxR, rows+1));
  bind("clM", () => cols = Math.max(1, cols-1)); bind("clP", () => cols = Math.min(maxC, cols+1));
  bind("sdM", () => { rows = cols = Math.max(1, rows-1); }); bind("sdP", () => { rows = cols = Math.min(maxR, rows+1); });
  bind("spL", () => { split = Math.max(1, split-1); checkSplit(); }); bind("spR", () => { split = Math.min(cols-1, split+1); checkSplit(); });
  function stages(list){
    const st = document.getElementById("arrStage");
    let k = 0;
    function next(){
      if(k >= list.length){ finalizeRoundSuccess(); return; }
      const s = list[k];
      const div = document.createElement("div");
      div.innerHTML = stepLabel(s.ar, s.en) + kpHtml("S"+k);
      st.appendChild(div);
      const myK = k;
      mountKeypad("S"+myK, {}, v => { if(answerMatches(v, s.answer)){ div.querySelectorAll(".keypad-grid button, .kp-check").forEach(b => b.disabled = true); k++; if(k < list.length) showToast("صحيح!", "Correct!"); next(); } else showMistakeFeedback(); });
    }
    next();
  }
  function checkSplit(){
    if(locked || split !== r.c) return;
    locked = true;
    const d = r.b - r.c;
    stages([
      {ar:`${L(r.a+" × "+r.c)} = ؟`, en:`${r.a} × ${r.c} = ?`, answer:r.a*r.c},
      {ar:`${L(r.a+" × "+d)} = ؟`, en:`${r.a} × ${d} = ?`, answer:r.a*d},
      {ar:`${L(r.a+" × "+r.b)} = ؟ (اجمع الجزأين)`, en:`${r.a} × ${r.b} = ? (add the two parts)`, answer:r.a*r.b}
    ]);
  }
  const chk = document.getElementById("arrCheck");
  if(chk) chk.onclick = () => {
    if(locked) return;
    if(r.mode === "square"){
      if(rows*cols === r.n){ locked = true; chk.disabled = true; stages([{ar:`${L("√"+r.n)} = ؟`, en:`√${r.n} = ?`, answer: rows}]); }
      else showMistakeFeedback();
    } else {
      if((rows === r.a && cols === r.b) || (rows === r.b && cols === r.a)){
        locked = true; chk.disabled = true;
        stages([{ar:`${L(r.a+" × "+r.b)} = ؟ (عدّ كل النقاط)`, en:`${r.a} × ${r.b} = ? (count all the dots)`, answer:r.a*r.b}]);
      } else showMistakeFeedback();
    }
  };
};

/* ---------------- 7. BARCHART: build a bar graph / dot plot from data ---------------- */
RENDERERS.barchart = function(container, r){
  const step = r.step || 1, max = r.max;
  const vals = r.cats.map(()=>0);
  let src = "";
  if(r.source === "tally") src = VIS.table(["", "إشارات العدّ <span class='en-badge'>Tally</span>"], r.cats.map(c => [`${c.emoji||""} ${c.ar}`, VIS.tally(c.value)]));
  else if(r.source === "list") src = `<div class="data-list" dir="ltr">${r.list.join(" ، ")}</div>`;
  else src = VIS.table(["", "العدد <span class='en-badge'>Count</span>"], r.cats.map(c => [`${c.emoji||""} ${c.ar}`, `<span dir="ltr">${c.value}</span>`]));
  container.innerHTML = P(r, r.style === "dots" ? "مثّل البيانات بالنقاط: اضغط + لإضافة نقطة فوق كل قيمة." : "مثّل البيانات بالأعمدة: استخدم + و − لضبط طول كل عمود.",
    r.style === "dots" ? "Show the data as a dot plot: press + to add a dot above each value." : "Show the data as a bar graph: use + and − to set each bar.") + `
    <div class="data-src">${src}</div>
    ${r.keyHtml ? `<div class="pv-target">${r.keyHtml}</div>` : ""}
    <div class="bc-chart ${r.style==="dots"?"dots":""}" dir="ltr" id="bcChart"></div>
    ${checkBtnHtml("bcCheck", "✓ تحقق من التمثيل", "Check the graph")}
    <div id="bcStage"></div>
  ` + feedbackAreaHtml();
  renderHintRow(container, "barchart", r);
  const chart = document.getElementById("bcChart");
  const H = 180;
  let axis = `<div class="bc-axis">`;
  for(let v=max; v>=0; v-=step*(max/step>10?2:1)) axis += `<span style="bottom:${v/max*H}px">${v}</span>`;
  chart.innerHTML = axis + `</div>`;
  r.cats.forEach((c,i) => {
    const col = document.createElement("div"); col.className = "bc-col";
    col.innerHTML = `<div class="bc-area" style="height:${H}px"><div class="bc-bar c${i%6}" id="bcB${i}"></div></div>
      <div class="bc-lab">${c.emoji||""}<br>${c.ar}</div>
      <div class="pv-btns"><button type="button" class="pv-btn" data-i="${i}" data-d="-1">−</button><button type="button" class="pv-btn" data-i="${i}" data-d="1">+</button></div>`;
    chart.appendChild(col);
  });
  let locked = false;
  function draw(){
    r.cats.forEach((c,i) => {
      const b = document.getElementById("bcB"+i);
      if(r.style === "dots"){ b.style.height = "auto"; b.innerHTML = Array.from({length: vals[i]/step}).map(()=>`<span class="bc-dot"></span>`).join(""); }
      else { b.style.height = (vals[i]/max*H) + "px"; b.innerHTML = vals[i] ? `<span class="bc-val">${vals[i]}</span>` : ""; }
    });
  }
  draw();
  container.querySelectorAll(".pv-btn").forEach(b => b.onclick = () => {
    if(locked) return;
    const i = Number(b.dataset.i), d = Number(b.dataset.d);
    vals[i] = Math.max(0, Math.min(max, vals[i] + d*step)); draw();
  });
  document.getElementById("bcCheck").onclick = () => {
    if(locked) return;
    if(r.cats.every((c,i) => vals[i] === c.value)){
      locked = true;
      if(r.question){
        const q = r.question;
        document.getElementById("bcStage").innerHTML = stepLabel(q.ar, q.en) + kpHtml("B");
        mountKeypad("B", q.opts, v => { if(answerMatches(v, q.answer)) finalizeRoundSuccess(); else showMistakeFeedback(); });
        showToast("التمثيل صحيح! أجب الآن عن السؤال.", "Graph is right! Now answer the question.");
      } else finalizeRoundSuccess();
    } else showMistakeFeedback();
  };
};

/* ---------------- 8. FRACTION: shade parts / read a model / make an equivalent fraction ---------------- */
function fractionShapeHtml(shape, den, wholeIdx, shadedSet, clickable){
  if(shape === "circle"){
    const R = 56, c = 60;
    let s = `<svg class="fr-circle" width="120" height="120" viewBox="0 0 120 120">`;
    for(let i=0;i<den;i++){
      const a0 = -Math.PI/2 + i*2*Math.PI/den, a1 = a0 + 2*Math.PI/den;
      const x0 = c + R*Math.cos(a0), y0 = c + R*Math.sin(a0), x1 = c + R*Math.cos(a1), y1 = c + R*Math.sin(a1);
      const large = (a1-a0) > Math.PI ? 1 : 0;
      const d = den === 1 ? `M ${c} ${c-R} A ${R} ${R} 0 1 1 ${c-0.01} ${c-R} Z` : `M ${c} ${c} L ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1} Z`;
      s += `<path class="fr-part${shadedSet.has(wholeIdx*den+i)?" on":""}${clickable?" click":""}" data-p="${wholeIdx*den+i}" d="${d}"/>`;
    }
    return s + `</svg>`;
  }
  let h = `<div class="fr-bar" dir="ltr">`;
  for(let i=0;i<den;i++) h += `<div class="fr-part${shadedSet.has(wholeIdx*den+i)?" on":""}${clickable?" click":""}" data-p="${wholeIdx*den+i}"></div>`;
  return h + `</div>`;
}
RENDERERS.fraction = function(container, r){
  const shape = r.shape || "bar";
  if(r.mode === "read"){
    const shaded = new Set(Array.from({length:r.num}).map((_,i)=>i));
    let num = 1, den = 1;
    container.innerHTML = P(r, "ما الكسر الذي يمثّله الجزء الملوّن؟ اضبط البسط والمقام:", "Which fraction is shaded? Set the numerator and denominator:") + `
      <div class="fr-shapes">${Array.from({length:r.wholes||1}).map((_,w)=>fractionShapeHtml(shape, r.den, w, shaded, false)).join("")}</div>
      <div class="fr-stepper" dir="ltr">
        <div class="fr-st-row"><button type="button" class="pv-btn" id="fnM">−</button><b id="fnV">1</b><button type="button" class="pv-btn" id="fnP">+</button><span class="fr-st-lab">البسط <span class="en-badge">numerator</span></span></div>
        <div class="fr-st-bar"></div>
        <div class="fr-st-row"><button type="button" class="pv-btn" id="fdM">−</button><b id="fdV">1</b><button type="button" class="pv-btn" id="fdP">+</button><span class="fr-st-lab">المقام <span class="en-badge">denominator</span></span></div>
      </div>
      ${checkBtnHtml("frCheck")}
    ` + feedbackAreaHtml();
    renderHintRow(container, "fraction", r);
    const upd = () => { document.getElementById("fnV").textContent = num; document.getElementById("fdV").textContent = den; };
    document.getElementById("fnM").onclick = () => { num = Math.max(0, num-1); upd(); };
    document.getElementById("fnP").onclick = () => { num = Math.min(40, num+1); upd(); };
    document.getElementById("fdM").onclick = () => { den = Math.max(1, den-1); upd(); };
    document.getElementById("fdP").onclick = () => { den = Math.min(20, den+1); upd(); };
    document.getElementById("frCheck").onclick = () => {
      const ok = r.acceptEquiv ? num*r.den === den*r.num : (num === r.num && den === r.den);
      if(ok) finalizeRoundSuccess(); else showMistakeFeedback();
    };
    return;
  }
  if(r.mode === "equiv"){
    const leftSet = new Set(Array.from({length:r.a}).map((_,i)=>i));
    let den = r.startDen || r.b;
    const on = new Set();
    container.innerHTML = P(r, `اكتب الكسر ${L(r.a+"/"+r.b)} بمقام ${L(r.targetDen)}: غيّر عدد الأجزاء ثم لوّن.`, `Write ${r.a}/${r.b} with denominator ${r.targetDen}: change the number of parts, then shade.`) + `
      <div class="fr-equiv">
        <div class="fr-side"><div class="fr-cap">${fracHtml(r.a, r.b)}</div>${fractionShapeHtml(shape, r.b, 0, leftSet, false)}</div>
        <div class="fr-eqsign">=</div>
        <div class="fr-side"><div class="fr-cap" id="frRightCap"></div><div id="frRight"></div>
          <div class="fr-st-row" dir="ltr"><button type="button" class="pv-btn" id="edM">−</button><b id="edV"></b><button type="button" class="pv-btn" id="edP">+</button><span class="fr-st-lab">عدد الأجزاء <span class="en-badge">parts</span></span></div>
        </div>
      </div>
      ${checkBtnHtml("frCheck")}
    ` + feedbackAreaHtml();
    renderHintRow(container, "fraction", r);
    function draw(){
      document.getElementById("frRight").innerHTML = fractionShapeHtml(shape, den, 0, on, true);
      document.getElementById("edV").textContent = den;
      document.getElementById("frRightCap").innerHTML = fracHtml(on.size, den);
      document.querySelectorAll("#frRight .fr-part").forEach(p => p.onclick = () => { const k = Number(p.dataset.p); if(on.has(k)) on.delete(k); else on.add(k); draw(); });
    }
    draw();
    document.getElementById("edM").onclick = () => { den = Math.max(1, den-1); on.clear(); draw(); };
    document.getElementById("edP").onclick = () => { den = Math.min(24, den+1); on.clear(); draw(); };
    document.getElementById("frCheck").onclick = () => {
      if(den === r.targetDen && on.size*r.b === r.a*den) finalizeRoundSuccess(); else showMistakeFeedback();
    };
    return;
  }
  /* shade */
  const on = new Set();
  const wholes = r.wholes || 1;
  container.innerHTML = P(r, "لوّن الأجزاء لتمثّل الكسر:", "Shade parts to show the fraction:") + `
    <div class="pv-target">${r.targetHtml || fracHtml(r.num, r.den)}</div>
    <div class="fr-shapes" id="frShapes"></div>
    <div class="fr-count" id="frCount" dir="ltr"></div>
    ${checkBtnHtml("frCheck")}
  ` + feedbackAreaHtml();
  renderHintRow(container, "fraction", r);
  function draw(){
    document.getElementById("frShapes").innerHTML = Array.from({length:wholes}).map((_,w)=>fractionShapeHtml(shape, r.den, w, on, true)).join("");
    document.getElementById("frCount").innerHTML = `${on.size} / ${r.den*wholes}`;
    document.querySelectorAll("#frShapes .fr-part").forEach(p => p.onclick = () => { const k = Number(p.dataset.p); if(on.has(k)) on.delete(k); else on.add(k); draw(); });
  }
  draw();
  document.getElementById("frCheck").onclick = () => { if(on.size === r.num) finalizeRoundSuccess(); else showMistakeFeedback(); };
};

/* ---------------- 9. KEYPADVISUAL: model on screen + step-by-step keypad entries ---------------- */
RENDERERS.keypadvisual = function(container, r){
  const steps = r.steps || [{ar:"", en:"", answer:r.answer, opts:r.opts}];
  container.innerHTML = P(r, "", "") + `
    ${r.visualHtml ? `<div class="kv-visual">${r.visualHtml}</div>` : ""}
    ${r.exprHtml ? `<div class="math-expr" dir="ltr">${r.exprHtml}</div>` : ""}
    <div id="kvSteps"></div>
  ` + feedbackAreaHtml();
  renderHintRow(container, "keypadvisual", r);
  const st = document.getElementById("kvSteps");
  let k = 0;
  function next(){
    if(k >= steps.length){ finalizeRoundSuccess(); return; }
    const s = steps[k];
    const div = document.createElement("div"); div.className = "kv-step";
    div.innerHTML = (s.ar ? stepLabel(s.ar, s.en) : "") + kpHtml("V"+k);
    st.appendChild(div);
    const my = k;
    mountKeypad("V"+my, s.opts || r.opts || {}, v => {
      if(answerMatches(v, s.answer) || (s.alt && s.alt.some(a => answerMatches(v, a)))){
        div.classList.add("done");
        div.querySelectorAll(".keypad-grid button, .kp-check").forEach(b => b.disabled = true);
        k++;
        if(k < steps.length) showToast("صحيح! الخطوة التالية.", "Correct! Next step.");
        next();
      } else showMistakeFeedback();
    });
  }
  next();
};

/* ---------------- 10. COLUMNCALC: vertical addition / subtraction / multiplication ---------------- */
RENDERERS.columncalc = function(container, r){
  const dp = r.dp || 0;
  const strs = r.nums.map(n => (Number(n)).toFixed(dp));
  const res = (Number(r.result)).toFixed(dp);
  const width = Math.max(res.length, ...strs.map(s=>s.length)) + (r.op === "×" ? 0 : 0);
  const pad = s => " ".repeat(width - s.length) + s;
  const opSym = r.op;
  container.innerHTML = P(r, "احسب عموديًا: اضغط على خانة ثم على الرقم. ابدأ من اليمين (الآحاد).", "Work it out in columns: tap a box, then a digit. Start from the right (ones).") + `
    <div class="cc-wrap" dir="ltr"><div class="cc-grid" id="ccGrid" style="grid-template-columns:28px repeat(${width}, 40px)"></div></div>
    <div class="cc-pad" dir="ltr" id="ccPad"></div>
    ${checkBtnHtml("ccCheck")}
  ` + feedbackAreaHtml();
  renderHintRow(container, "columncalc", r);
  const g = document.getElementById("ccGrid");
  let html = `<div class="cc-op"></div>`;
  for(let c=0;c<width;c++) html += (pad(strs[0])[c] === "." ? `<div class="cc-dotcell"></div>` : `<button type="button" class="cc-carry" data-c="${c}"></button>`);
  strs.forEach((s,ri) => {
    const ps = pad(s);
    html += `<div class="cc-op">${ri === strs.length-1 ? opSym : ""}</div>`;
    for(let c=0;c<width;c++) html += `<div class="cc-digit${ps[c]==="."?" dot":""}">${ps[c] === " " ? "" : ps[c]}</div>`;
  });
  html += `<div class="cc-line" style="grid-column:1 / span ${width+1}"></div><div class="cc-op"></div>`;
  const resPad = pad(res);
  for(let c=0;c<width;c++) html += resPad[c] === "." && dp ? `<div class="cc-digit dot">.</div>` : `<button type="button" class="cc-ans" data-c="${c}"></button>`;
  g.innerHTML = html;
  const ansCells = [...g.querySelectorAll(".cc-ans")];
  let active = ansCells.length - 1;
  const vals = ansCells.map(()=> "");
  function paint(){ ansCells.forEach((c,i) => { c.textContent = vals[i]; c.classList.toggle("active", i === active); }); }
  paint();
  ansCells.forEach((c,i) => c.onclick = () => { active = i; paint(); });
  g.querySelectorAll(".cc-carry").forEach(c => c.onclick = () => { const v = c.textContent; c.textContent = v === "" ? "1" : v === "9" ? "" : String(Number(v)+1); });
  const pad2 = document.getElementById("ccPad");
  ["1","2","3","4","5","6","7","8","9","0","⌫"].forEach(k => {
    const b = document.createElement("button"); b.type="button"; b.className="keypad-key"+(k==="⌫"?" kp-back":""); b.textContent=k; b.dataset.k=k;
    b.onclick = () => {
      if(k === "⌫"){ vals[active] = ""; }
      else { vals[active] = k; if(active > 0) active--; }
      paint();
    };
    pad2.appendChild(b);
  });
  document.getElementById("ccCheck").onclick = () => {
    let s = ""; let ci = 0;
    for(let c=0;c<width;c++){ if(resPad[c] === "." && dp) s += "."; else { s += vals[ci] === "" ? " " : vals[ci]; ci++; } }
    const typed = s.trim();
    if(typed !== "" && !typed.includes(" ") && answerMatches(typed, Number(r.result))) finalizeRoundSuccess();
    else showMistakeFeedback();
  };
};

/* ---------------- 11. SLIDER: tune a function's parameters to match a graph / equation ---------------- */
function famY(fam, p, x){
  switch(fam){
    case "linear": return p.m*x + p.b;
    case "abs": return p.a*Math.abs(x - p.h) + p.k;
    case "quad": case "parabolaV": return p.a*(x-p.h)*(x-p.h) + p.k;
    case "sqrt": return x < p.h ? NaN : p.a*Math.sqrt(x - p.h) + p.k;
    case "exp": return Math.pow(p.b, x - (p.h||0)) + (p.k||0);
    case "log": return x <= (p.h||0) ? NaN : Math.log(x - (p.h||0))/Math.log(p.b) + (p.k||0);
    case "sin": return p.a*Math.sin(p.b*x*Math.PI/180) + (p.k||0);
    case "cos": return p.a*Math.cos(p.b*x*Math.PI/180) + (p.k||0);
  }
  return NaN;
}
function famParam(fam, p){
  /* parametric curves (conics) → array of [x,y] */
  const pts = [];
  if(fam === "circle" || fam === "ellipse"){
    const a = fam === "circle" ? p.r : p.a, b = fam === "circle" ? p.r : p.b;
    for(let t=0;t<=360;t+=4){ const q = t*Math.PI/180; pts.push([p.h + a*Math.cos(q), p.k + b*Math.sin(q)]); }
    return [pts];
  }
  if(fam === "parabolaH"){
    for(let y=-12;y<=12;y+=0.1) pts.push([p.a*(y-p.k)*(y-p.k)+p.h, y]);
    return [pts];
  }
  if(fam === "hyperbola"){
    const r1 = [], r2 = [];
    for(let t=-2.5;t<=2.5;t+=0.05){ r1.push([p.h + p.a*Math.cosh(t), p.k + p.b*Math.sinh(t)]); r2.push([p.h - p.a*Math.cosh(t), p.k + p.b*Math.sinh(t)]); }
    return [r1, r2];
  }
  return null;
}
function sgn(v, first){ // " + 3", " − 3"
  const a = fmtNum(Math.abs(v), 2);
  if(first) return v < 0 ? "−" + a : a;
  return v < 0 ? ` − ${a}` : ` + ${a}`;
}
function coefX(a, sym){ // 1x → x, -1x → −x
  if(a === 1) return sym; if(a === -1) return "−"+sym; return fmtNum(a,2).replace("-","−") + sym;
}
function shiftTxt(v, sym){ return v === 0 ? sym : `(${sym}${sgn(-v)})`; }
function famEq(fam, p){
  switch(fam){
    case "linear": return `y = ${p.m === 0 ? "" : coefX(p.m,"x")}${p.m === 0 ? fmtNum(p.b) : p.b === 0 ? "" : sgn(p.b)}`;
    case "abs": return `y = ${coefX(p.a, `|${p.h===0?"x":"x"+sgn(-p.h)}|`)}${p.k===0?"":sgn(p.k)}`;
    case "quad": case "parabolaV": return `y = ${coefX(p.a, shiftTxt(p.h,"x")+"²")}${p.k===0?"":sgn(p.k)}`;
    case "parabolaH": return `x = ${coefX(p.a, shiftTxt(p.k,"y")+"²")}${p.h===0?"":sgn(p.h)}`;
    case "sqrt": return `y = ${coefX(p.a, `√(${p.h===0?"x":"x"+sgn(-p.h)})`)}${p.k===0?"":sgn(p.k)}`;
    case "exp": return `y = ${p.b}<sup>${p.h ? "x"+sgn(-p.h) : "x"}</sup>${p.k ? sgn(p.k) : ""}`;
    case "log": return `y = log<sub>${p.b}</sub>(${p.h ? "x"+sgn(-p.h) : "x"})${p.k ? sgn(p.k) : ""}`;
    case "sin": return `y = ${coefX(p.a, `sin(${p.b===1?"":p.b}x)`)}`;
    case "cos": return `y = ${coefX(p.a, `cos(${p.b===1?"":p.b}x)`)}`;
    case "circle": return `${shiftTxt(p.h,"x")}² + ${shiftTxt(p.k,"y")}² = ${p.r*p.r}`;
    case "ellipse": return `${fracHtml(shiftTxt(p.h,"x")+"²", p.a*p.a, true)} + ${fracHtml(shiftTxt(p.k,"y")+"²", p.b*p.b, true)} = 1`;
    case "hyperbola": return `${fracHtml(shiftTxt(p.h,"x")+"²", p.a*p.a, true)} − ${fracHtml(shiftTxt(p.k,"y")+"²", p.b*p.b, true)} = 1`;
  }
  return "";
}
RENDERERS.slider = function(container, r){
  const v = Object.assign({xmin:-8,xmax:8,ymin:-8,ymax:8}, r.view||{});
  const W = 320, H = 320, pad = 24;
  const cw = (W-2*pad)/(v.xmax-v.xmin), ch = (H-2*pad)/(v.ymax-v.ymin);
  const sx = x => pad + (x-v.xmin)*cw, sy = y => H - pad - (y-v.ymin)*ch;
  const cur = {}; r.params.forEach(p => cur[p.k] = p.v0);
  let solid = true, above = true;
  const showGraph = r.show !== "eq";
  container.innerHTML = P(r, showGraph ? "اضبط المعاملات حتى ينطبق منحناك (الأزرق) على المنحنى الذهبي المنقّط:" : "اضبط المعاملات لترسم تمثيل المعادلة:",
      showGraph ? "Tune the parameters until your curve (blue) sits on the dotted gold one:" : "Tune the parameters to graph the equation:") + `
    ${!showGraph ? `<div class="math-expr" dir="ltr">${r.ineq ? famEq(r.fam, r.target).replace("=", r.ineq.op) : famEq(r.fam, r.target)}</div>` : ""}
    <div class="graph-wrap"><svg id="slSvg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" class="graph-grid"></svg></div>
    <div class="sl-eq" dir="ltr" id="slEq"></div>
    <div class="sl-ctrls" dir="ltr" id="slCtrls"></div>
    ${r.ineq ? `<div class="sl-ctrls" dir="ltr">
        <button type="button" class="rule-op-btn" id="slLine">الخط: متصل <span class="en-badge">solid</span></button>
        <button type="button" class="rule-op-btn" id="slSide">التظليل: فوق <span class="en-badge">above</span></button>
      </div>` : ""}
    ${checkBtnHtml("slCheck")}
  ` + feedbackAreaHtml();
  renderHintRow(container, "slider", r);
  const svg = document.getElementById("slSvg");
  const lx = Math.max(1, Math.round((v.xmax-v.xmin)/(r.view && r.view.xstep ? (v.xmax-v.xmin)/r.view.xstep : 8)));
  function curvePaths(p){
    const par = famParam(r.fam, p);
    if(par) return par;
    const out = []; let cur2 = [];
    const n = 400;
    for(let i=0;i<=n;i++){
      const x = v.xmin + (v.xmax-v.xmin)*i/n, y = famY(r.fam, p, x);
      if(Number.isFinite(y) && y > v.ymin-50 && y < v.ymax+50) cur2.push([x,y]); else if(cur2.length){ out.push(cur2); cur2 = []; }
    }
    if(cur2.length) out.push(cur2);
    return out;
  }
  function pathD(ptsArr){ return ptsArr.map(pts => pts.map((q,i)=>(i?"L":"M")+sx(q[0]).toFixed(1)+","+sy(Math.max(v.ymin-2, Math.min(v.ymax+2, q[1]))).toFixed(1)).join(" ")).join(" "); }
  function draw(){
    let s = `<defs><clipPath id="slClip"><rect x="${pad}" y="${pad}" width="${W-2*pad}" height="${H-2*pad}"/></clipPath></defs>`;
    const xs = r.view && r.view.xstep ? r.view.xstep : 1;
    for(let x=Math.ceil(v.xmin/xs)*xs; x<=v.xmax; x+=xs) s += `<line class="graph-gridline" x1="${sx(x)}" y1="${pad}" x2="${sx(x)}" y2="${H-pad}"/>`;
    for(let y=Math.ceil(v.ymin); y<=v.ymax; y++) s += `<line class="graph-gridline" x1="${pad}" y1="${sy(y)}" x2="${W-pad}" y2="${sy(y)}"/>`;
    s += `<line class="graph-axis" x1="${pad}" y1="${sy(0)}" x2="${W-pad}" y2="${sy(0)}"/><line class="graph-axis" x1="${sx(0)}" y1="${pad}" x2="${sx(0)}" y2="${H-pad}"/>`;
    const lxs = r.view && r.view.xstep ? r.view.xstep*(r.view.xlabelEvery||1) : Math.max(1, Math.ceil((v.xmax-v.xmin)/10));
    for(let x=Math.ceil(v.xmin/lxs)*lxs; x<=v.xmax; x+=lxs) if(x!==0) s += `<text class="graph-label" x="${sx(x)}" y="${sy(0)+14}" text-anchor="middle">${fmtNum(x)}</text>`;
    const lys = Math.max(1, Math.ceil((v.ymax-v.ymin)/10));
    for(let y=Math.ceil(v.ymin/lys)*lys; y<=v.ymax; y+=lys) if(y!==0) s += `<text class="graph-label" x="${sx(0)-6}" y="${sy(y)+4}" text-anchor="end">${y}</text>`;
    s += `<g clip-path="url(#slClip)">`;
    if(r.ineq){
      const x0 = v.xmin-1, x1 = v.xmax+1;
      const y0 = famY("linear", cur, x0), y1 = famY("linear", cur, x1);
      const yEdge = above ? v.ymax+50 : v.ymin-50;
      s += `<polygon class="sl-shade" points="${sx(x0)},${sy(y0)} ${sx(x1)},${sy(y1)} ${sx(x1)},${sy(yEdge)} ${sx(x0)},${sy(yEdge)}"/>`;
    }
    if(showGraph) s += `<path class="sl-target" d="${pathD(curvePaths(r.target))}"/>`;
    s += `<path class="sl-mine${r.ineq && !solid ? " dashed" : ""}" d="${pathD(curvePaths(cur))}"/>`;
    s += `</g>`;
    svg.innerHTML = s;
    let eq = famEq(r.fam, cur);
    if(r.ineq){ const op = above ? (solid ? "≥" : ">") : (solid ? "≤" : "<"); eq = eq.replace("=", op); }
    document.getElementById("slEq").innerHTML = eq;
    r.params.forEach(p => { const e = document.getElementById("slV_"+p.k); if(e) e.textContent = fmtNum(cur[p.k], 2); });
  }
  const ctrls = document.getElementById("slCtrls");
  r.params.forEach(p => {
    const d = document.createElement("div"); d.className = "arr-ctrl";
    d.innerHTML = `<span class="sl-pname">${p.label || p.k}</span><button type="button" class="pv-btn" data-k="${p.k}" data-d="-1">−</button><b id="slV_${p.k}"></b><button type="button" class="pv-btn" data-k="${p.k}" data-d="1">+</button>`;
    ctrls.appendChild(d);
  });
  ctrls.querySelectorAll(".pv-btn").forEach(b => b.onclick = () => {
    const p = r.params.find(q => q.k === b.dataset.k);
    let nv = Math.round((cur[p.k] + Number(b.dataset.d)*p.step)*1000)/1000;
    if(p.skip && p.skip.includes(nv)) nv = Math.round((nv + Number(b.dataset.d)*p.step)*1000)/1000;
    cur[p.k] = Math.max(p.min, Math.min(p.max, nv)); draw();
  });
  if(r.ineq){
    const lb = document.getElementById("slLine"), sb = document.getElementById("slSide");
    lb.onclick = () => { solid = !solid; lb.innerHTML = solid ? `الخط: متصل <span class="en-badge">solid</span>` : `الخط: متقطع <span class="en-badge">dashed</span>`; draw(); };
    sb.onclick = () => { above = !above; sb.innerHTML = above ? `التظليل: فوق <span class="en-badge">above</span>` : `التظليل: تحت <span class="en-badge">below</span>`; draw(); };
  }
  draw();
  document.getElementById("slCheck").onclick = () => {
    let ok = r.params.every(p => Math.abs(cur[p.k] - r.target[p.k]) < 1e-6);
    if(r.ineq){
      const wantSolid = r.ineq.op === "≤" || r.ineq.op === "≥", wantAbove = r.ineq.op === ">" || r.ineq.op === "≥";
      ok = ok && solid === wantSolid && above === wantAbove;
    }
    if(ok) finalizeRoundSuccess(); else showMistakeFeedback();
  };
};

/* ---------------- 12. ANGLELAB: parallel lines & transversal, triangle angle sums ---------------- */
RENDERERS.anglelab = function(container, r){
  if(r.mode === "tri" || r.mode === "ext"){
    const A = r.A, B = r.B, C = 180 - A - B;
    // base from P0 to P1; apex from angles A at P0 and B at P1
    const base = 1, ta = Math.tan(A*Math.PI/180), tb = Math.tan(B*Math.PI/180);
    const xA = base*tb/(ta+tb), yA = xA*ta;
    const pts = [[0,0],[base,0],[xA,yA]];
    const maxX = Math.max(1.35, xA), minX = Math.min(0, xA);
    const scale = Math.min(230/(maxX-minX), 150/Math.max(yA,0.3));
    const T = q => [40 + (q[0]-minX)*scale, 200 - q[1]*scale];
    const [p0,p1,p2] = pts.map(T);
    let s = `<svg class="ang-svg" width="320" height="230" viewBox="0 0 320 230">`;
    if(r.mode === "ext") s += `<line class="ang-ext" x1="${p1[0]}" y1="${p1[1]}" x2="${Math.min(312, p1[0]+70)}" y2="${p1[1]}"/>`;
    s += `<polygon class="ang-tri" points="${p0.join(",")} ${p1.join(",")} ${p2.join(",")}"/>`;
    s += `<text class="ang-txt" x="${p0[0]+22}" y="${p0[1]-8}">${A}°</text>`;
    if(r.mode === "tri"){
      s += `<text class="ang-txt" x="${p1[0]-40}" y="${p1[1]-8}">${B}°</text>`;
      s += `<text class="ang-txt q" x="${p2[0]-8}" y="${p2[1]+30}">?</text>`;
    } else {
      s += `<text class="ang-txt" x="${p2[0]-10}" y="${p2[1]+30}">${C}°</text>`;
      s += `<text class="ang-txt q" x="${p1[0]+14}" y="${p1[1]-10}">?</text>`;
    }
    s += `</svg>`;
    const ans = r.mode === "tri" ? C : A + C;
    container.innerHTML = P(r, r.mode === "tri" ? "أوجد قياس الزاوية المجهولة في المثلث:" : "أوجد قياس الزاوية الخارجية (?):",
      r.mode === "tri" ? "Find the missing angle of the triangle:" : "Find the exterior angle (?):") + `
      <div class="kv-visual">${s}</div>` + kpHtml("G") + feedbackAreaHtml();
    renderHintRow(container, "anglelab", r);
    mountKeypad("G", {}, val => { if(answerMatches(val, ans)) finalizeRoundSuccess(); else showMistakeFeedback(); });
    return;
  }
  const th = r.theta; // acute or obtuse angle of transversal (degrees, math orientation)
  const meas = [th, 180-th, th, 180-th, th, 180-th, th, 180-th];
  const W = 320, H = 260, y1 = 80, y2 = 190, cx = 160, cy = (y1+y2)/2;
  const t = Math.tan(th*Math.PI/180);
  const X = y => cx + (cy - y)/t; // screen: up is -y
  const I1 = [X(y1), y1], I2 = [X(y2), y2];
  const dirs = [th/2, (th+180)/2, 180 + th/2, (th+180)/2 + 180];
  let s = `<svg class="ang-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
  s += `<line class="ang-par" x1="10" y1="${y1}" x2="${W-10}" y2="${y1}"/><line class="ang-par" x1="10" y1="${y2}" x2="${W-10}" y2="${y2}"/>`;
  s += `<text class="ang-par-mark" x="${W-26}" y="${y1-6}">▸</text><text class="ang-par-mark" x="${W-26}" y="${y2-6}">▸</text>`;
  const dx = Math.cos(th*Math.PI/180), dy = Math.sin(th*Math.PI/180);
  s += `<line class="ang-trans" x1="${I1[0]+dx*70}" y1="${I1[1]-dy*70}" x2="${I2[0]-dx*70}" y2="${I2[1]+dy*70}"/>`;
  [I1, I2].forEach((I, j) => dirs.forEach((dg, i) => {
    const idx = j*4 + i, rad = dg*Math.PI/180;
    const px = I[0] + Math.cos(rad)*30, py = I[1] - Math.sin(rad)*30;
    let label = String(idx+1), cls = "ang-lab";
    if(idx === r.given){ label = meas[idx] + "°"; cls += " given"; }
    else if(r.mode === "find" && idx === r.target){ label = "?"; cls += " q"; }
    s += `<g class="${cls}" data-a="${idx}"><circle cx="${px}" cy="${py}" r="15"/><text x="${px}" y="${py+5}" text-anchor="middle">${label}</text></g>`;
  }));
  s += `</svg>`;
  if(r.mode === "find"){
    container.innerHTML = P(r, "المستقيمان متوازيان. أوجد قياس الزاوية (?):", "The two lines are parallel. Find the measure of angle (?):") + `<div class="kv-visual">${s}</div>` + kpHtml("G") + feedbackAreaHtml();
    renderHintRow(container, "anglelab", r);
    mountKeypad("G", {}, val => { if(answerMatches(val, meas[r.target])) finalizeRoundSuccess(); else showMistakeFeedback(); });
    return;
  }
  const need = new Set(meas.map((m,i)=>i).filter(i => i !== r.given && meas[i] === meas[r.given]));
  container.innerHTML = P(r, `المستقيمان متوازيان. اضغط على كل الزوايا التي قياسها ${L(meas[r.given]+"°")} مثل الزاوية المعطاة:`, `The lines are parallel. Tap every angle that measures ${meas[r.given]}°, like the given one:`) + `<div class="kv-visual">${s}</div><div class="nl-step-count" id="angLeft"></div>` + feedbackAreaHtml();
  renderHintRow(container, "anglelab", r);
  const found = new Set();
  const upd = () => document.getElementById("angLeft").innerHTML = `وجدت: <span dir="ltr">${found.size} / ${need.size}</span> <span class="en-badge">found</span>`;
  upd();
  container.querySelectorAll(".ang-lab").forEach(g => g.addEventListener("click", () => {
    const i = Number(g.dataset.a);
    if(i === r.given || found.has(i)) return;
    if(need.has(i)){ found.add(i); g.classList.add("hit"); upd(); if(found.size === need.size) finalizeRoundSuccess(); }
    else { g.classList.add("miss"); setTimeout(()=>g.classList.remove("miss"), 600); showMistakeFeedback(); }
  }));
};

/* ---------------- 13. GRIDFILL: tables, matrices, truth tables with blank cells ---------------- */
RENDERERS.gridfill = function(container, r){
  container.innerHTML = P(r, "اضغط على كل خانة فارغة واملأها:", "Tap each empty box and fill it in:") + `
    ${r.visualHtml ? `<div class="kv-visual">${r.visualHtml}</div>` : ""}
    <div class="gf-wrap" dir="ltr" id="gfWrap"></div>
    <div class="cc-pad" dir="ltr" id="gfPad"></div>
    ${checkBtnHtml("gfCheck")}
  ` + feedbackAreaHtml();
  renderHintRow(container, "gridfill", r);
  const wrap = document.getElementById("gfWrap");
  const blanks = [];
  let active = null;
  r.blocks.forEach(bl => {
    if(bl.op !== undefined){ const o = document.createElement("div"); o.className = "gf-op"; o.innerHTML = bl.op; wrap.appendChild(o); return; }
    const box = document.createElement("div"); box.className = "gf-block" + (bl.bracket ? " bracket" : "");
    if(bl.label) box.innerHTML = `<div class="gf-label">${bl.label}</div>`;
    const tbl = document.createElement("table"); tbl.className = "gf-table" + (bl.bracket ? " mat" : "");
    bl.rows.forEach(row => {
      const tr = document.createElement("tr");
      row.forEach(cell => {
        const td = document.createElement(cell.h !== undefined ? "th" : "td");
        if(cell.h !== undefined) td.innerHTML = cell.h;
        else if(cell.ans === undefined) td.innerHTML = cell.v;
        else {
          const b = document.createElement("button"); b.type = "button"; b.className = "gf-cell" + (cell.cycle ? " cyc" : "");
          const rec = { el:b, cell, val:"" };
          if(cell.cycle){
            let ci = -1;
            b.textContent = "؟";
            b.onclick = () => { ci = (ci+1) % cell.cycle.length; rec.val = cell.cycle[ci]; b.innerHTML = (cell.show||cell.cycle)[ci]; };
          } else {
            b.onclick = () => { active = rec; blanks.forEach(x => x.el.classList.toggle("active", x === rec)); };
          }
          blanks.push(rec); td.appendChild(b);
        }
        tr.appendChild(td);
      });
      tbl.appendChild(tr);
    });
    box.appendChild(tbl); wrap.appendChild(box);
  });
  const firstNum = blanks.find(b => !b.cell.cycle);
  if(firstNum){ active = firstNum; firstNum.el.classList.add("active"); }
  const pad = document.getElementById("gfPad");
  if(!firstNum) pad.style.display = "none";
  const keys = ["1","2","3","4","5","6","7","8","9","0"];
  if(r.neg !== false) keys.push("−");
  if(r.dec) keys.push(".");
  if(r.frac) keys.push("/");
  keys.push("⌫");
  keys.forEach(k => {
    const b = document.createElement("button"); b.type="button"; b.className="keypad-key"+(k==="⌫"?" kp-back":""); b.textContent=k; b.dataset.k=k;
    b.onclick = () => {
      if(!active) return;
      if(k === "⌫") active.val = active.val.slice(0,-1);
      else if(k === "−") active.val = active.val.startsWith("-") ? active.val.slice(1) : "-" + active.val;
      else if(active.val.length < 8) active.val += k;
      active.el.textContent = active.val;
    };
    pad.appendChild(b);
  });
  document.getElementById("gfCheck").onclick = () => {
    let allOk = true;
    blanks.forEach(b => {
      const ok = b.cell.cycle ? b.val === String(b.cell.ans) : (b.val !== "" && answerMatches(b.val, b.cell.ans));
      b.el.classList.toggle("wrong", !ok); if(!ok) allOk = false;
    });
    if(allOk) finalizeRoundSuccess(); else showMistakeFeedback();
  };
};

/* ---------------- 14. BUILDER: build an answer from token tiles ---------------- */
RENDERERS.builder = function(container, r){
  container.innerHTML = P(r, "ابنِ الإجابة بالضغط على البطاقات بالترتيب:", "Build the answer by tapping tiles in order:") + `
    ${r.visualHtml ? `<div class="kv-visual">${r.visualHtml}</div>` : ""}
    <div class="bd-line ${r.ltr?"ltr":""}" ${r.ltr?'dir="ltr"':""} id="bdLine"></div>
    <div class="bd-palette ${r.ltr?"ltr":""}" ${r.ltr?'dir="ltr"':""} id="bdPal"></div>
  ` + feedbackAreaHtml();
  renderHintRow(container, "builder", r);
  const line = document.getElementById("bdLine");
  const filled = Array.from({length:r.slots}).map(()=>null);
  const parts = [];
  if(r.prefix) line.insertAdjacentHTML("beforeend", `<span class="bd-fixed">${r.prefix}</span>`);
  for(let i=0;i<r.slots;i++){
    if(r.between && i>0) line.insertAdjacentHTML("beforeend", `<span class="bd-fixed">${r.between[i-1]||""}</span>`);
    const s = document.createElement("button"); s.type = "button"; s.className = "bd-slot"; s.dataset.s = i;
    s.onclick = () => { filled[i] = null; draw(); };
    line.appendChild(s); parts.push(s);
  }
  if(r.suffix) line.insertAdjacentHTML("beforeend", `<span class="bd-fixed">${r.suffix}</span>`);
  const pal = document.getElementById("bdPal");
  r.palette.forEach((tok, ti) => {
    const b = document.createElement("button"); b.type = "button"; b.className = "bd-tok"; b.innerHTML = tok; b.dataset.t = ti;
    b.onclick = () => { const k = filled.indexOf(null); if(k < 0) return; filled[k] = ti; draw(); };
    pal.appendChild(b);
  });
  function draw(){
    parts.forEach((s,i) => { s.innerHTML = filled[i] === null ? "" : r.palette[filled[i]]; s.classList.toggle("on", filled[i] !== null); });
    if(filled.every(x => x !== null)){
      const got = filled.map(t => r.palette[t]);
      const ok = r.answers.some(ans => ans.every((a,i) => a === got[i]));
      if(ok){ pal.querySelectorAll("button").forEach(b=>b.disabled=true); parts.forEach(b=>b.disabled=true); finalizeRoundSuccess(); }
      else { flash(line); showMistakeFeedback(); }
    }
  }
  draw();
};

/* ---------------- 15. FACTORTREE: split a number into prime factors ---------------- */
function isPrime(n){ if(n<2) return false; for(let i=2;i*i<=n;i++) if(n%i===0) return false; return true; }
RENDERERS.factortree = function(container, r){
  const root = { v:r.n, kids:null };
  container.innerHTML = P(r, `حلّل العدد ${L(r.n)} إلى عوامله الأولية: اضغط على أي عدد غير أولي لتقسيمه.`, `Break ${r.n} into prime factors: tap any non-prime number to split it.`) + `
    <div class="ft-tree" dir="ltr" id="ftTree"></div>
    <div class="ft-pal" dir="ltr" id="ftPal"></div>
    <div class="math-expr" dir="ltr" id="ftOut"></div>
  ` + feedbackAreaHtml();
  renderHintRow(container, "factortree", r);
  let sel = null;
  function leaves(n, out){ if(!n.kids) out.push(n.v); else n.kids.forEach(k => leaves(k, out)); return out; }
  function nodeHtml(n, path){
    const prime = isPrime(n.v);
    let h = `<div class="ft-node"><button type="button" class="ft-num${prime?" prime":""}${n.kids?" split":""}" data-path="${path}">${n.v}</button>`;
    if(n.kids) h += `<div class="ft-kids">${n.kids.map((k,i)=>nodeHtml(k, path+i)).join("")}</div>`;
    return h + `</div>`;
  }
  function get(path){ let n = root; for(const c of path.slice(1)) n = n.kids[Number(c)]; return n; }
  function draw(){
    document.getElementById("ftTree").innerHTML = nodeHtml(root, "r");
    document.querySelectorAll(".ft-num").forEach(b => b.onclick = () => {
      const n = get(b.dataset.path);
      if(n.kids) return;
      if(isPrime(n.v)){ showToast("هذا عدد أولي — لا يمكن تقسيمه!", "That's prime — it can't be split!"); return; }
      sel = n; showPal();
    });
    const lv = leaves(root, []).sort((a,b)=>a-b);
    document.getElementById("ftOut").textContent = `${r.n} = ${lv.join(" × ")}`;
    if(lv.every(isPrime)){ document.getElementById("ftPal").innerHTML = ""; finalizeRoundSuccess(); }
  }
  function showPal(){
    const pal = document.getElementById("ftPal"); pal.innerHTML = `<div class="ft-pal-lab">${sel.v} = ؟ <span class="en-badge">choose a split</span></div>`;
    for(let a=2; a*a<=sel.v; a++) if(sel.v % a === 0){
      const b = document.createElement("button"); b.type="button"; b.className="rule-op-btn"; b.textContent = `${a} × ${sel.v/a}`;
      b.onclick = () => { sel.kids = [{v:a,kids:null},{v:sel.v/a,kids:null}]; sel = null; pal.innerHTML = ""; draw(); };
      pal.appendChild(b);
    }
  }
  draw();
};

/* ---------------- 16. DECIMALSLIDER: move the decimal point (×10 / ÷10, scientific notation) ---------------- */
RENDERERS.decimalslider = function(container, r){
  const D = r.digits; // string of digits without point, e.g. "345"
  let e = r.e0;       // value = Number(D) × 10^e
  const moves0 = e;
  function valStr(ee){
    if(ee >= 0) return D + "0".repeat(ee);
    const k = -ee;
    const s = D.length > k ? D.slice(0, D.length-k) + "." + D.slice(D.length-k) : "0." + "0".repeat(k - D.length) + D;
    return s.replace(/(\.\d*?)0+$/,"$1").replace(/\.$/,"");
  }
  container.innerHTML = P(r, r.mode === "sci" ? "حرّك الفاصلة العشرية حتى يصبح العدد بين 1 و10، وراقب الأس:" : "حرّك الفاصلة العشرية لتحويل الوحدة:",
    r.mode === "sci" ? "Move the decimal point until the number is between 1 and 10, and watch the exponent:" : "Move the decimal point to convert the unit:") + `
    ${r.questionHtml ? `<div class="pv-target">${r.questionHtml}</div>` : ""}
    <div class="ds-num" dir="ltr" id="dsNum"></div>
    <div class="ds-info" dir="ltr" id="dsInfo"></div>
    <div class="nl-controls" dir="ltr">
      <button type="button" class="nl-arrow-btn wide" id="dsL">◀ ÷10</button>
      <button type="button" class="nl-arrow-btn wide" id="dsR">×10 ▶</button>
    </div>
    ${checkBtnHtml("dsCheck")}
  ` + feedbackAreaHtml();
  renderHintRow(container, "decimalslider", r);
  function draw(){
    const s = valStr(e);
    document.getElementById("dsNum").innerHTML = s.split("").map(ch => ch === "." ? `<span class="ds-pt">.</span>` : `<span class="ds-dg">${ch}</span>`).join("");
    const moved = e - moves0;
    if(r.mode === "sci"){
      const k = -moved;
      document.getElementById("dsInfo").innerHTML = `${r.original} = ${s} × 10<sup>${k}</sup>`;
    } else {
      document.getElementById("dsInfo").innerHTML = moved === 0 ? "" : moved > 0 ? `×${"10".padEnd(moved+2,"0").slice(0,moved+1)}` : `÷${"1"+"0".repeat(-moved)}`;
    }
  }
  draw();
  document.getElementById("dsL").onclick = () => { if(e - moves0 > -8){ e--; draw(); } };
  document.getElementById("dsR").onclick = () => { if(e - moves0 < 8){ e++; draw(); } };
  document.getElementById("dsCheck").onclick = () => {
    const v = Number(valStr(e));
    if(r.mode === "sci"){ if(v >= 1 && v < 10) finalizeRoundSuccess(); else showMistakeFeedback(); }
    else { if(Math.abs(v - r.target) < 1e-9 * Math.max(1, Math.abs(r.target))) finalizeRoundSuccess(); else showMistakeFeedback(); }
  };
};

/* ---------------- 17. LEVELER: move blocks between towers to find the mean ---------------- */
RENDERERS.leveler = function(container, r){
  const t = r.towers.slice();
  const mean = t.reduce((a,b)=>a+b,0)/t.length;
  let held = null, moves = 0, locked = false;
  container.innerHTML = P(r, "انقل المكعبات بين الأبراج حتى تتساوى كلها: اضغط على برج لتأخذ مكعبًا، ثم على برج آخر لتضعه.", "Move cubes between towers until they're all equal: tap a tower to take a cube, then another tower to drop it.") + `
    <div class="data-list" dir="ltr">${r.towers.join(" ، ")}</div>
    <div class="lv-row" dir="ltr" id="lvRow"></div>
    <div class="nl-step-count" id="lvMoves"></div>
    <div id="lvStage"></div>
  ` + feedbackAreaHtml();
  renderHintRow(container, "leveler", r);
  function draw(){
    const row = document.getElementById("lvRow"); row.innerHTML = "";
    t.forEach((h,i) => {
      const b = document.createElement("button"); b.type = "button"; b.className = "lv-tower" + (held === i ? " held" : ""); b.dataset.i = i;
      b.innerHTML = `<div class="lv-stack">${Array.from({length:h}).map(()=>`<span class="lv-cube c${i%6}"></span>`).join("")}</div><div class="lv-h">${h}</div>`;
      b.onclick = () => {
        if(locked) return;
        if(held === null){ if(t[i] > 0){ held = i; } }
        else if(held === i){ held = null; }
        else { t[held]--; t[i]++; held = null; moves++; }
        draw(); check();
      };
      row.appendChild(b);
    });
    document.getElementById("lvMoves").innerHTML = `النقلات: <span dir="ltr">${moves}</span> <span class="en-badge">moves</span>`;
  }
  function check(){
    if(!locked && t.every(h => h === t[0])){
      locked = true;
      document.getElementById("lvStage").innerHTML = stepLabel("الأبراج متساوية! ما المتوسط الحسابي؟", "Towers are level! What is the mean?") + kpHtml("L");
      mountKeypad("L", {}, v => { if(answerMatches(v, mean)) finalizeRoundSuccess(); else showMistakeFeedback(); });
    }
  }
  draw();
};

/* ---------------- 18. MATCHPAIRS: connect equivalent items ---------------- */
RENDERERS.matchpairs = function(container, r){
  container.innerHTML = P(r, "صِل كل بطاقة بما يساويها: اضغط على بطاقة من اليمين ثم على شريكتها من اليسار.", "Match each card with its partner: tap one on the right, then its match on the left.") + `
    <div class="mp-wrap"><div class="mp-col" id="mpL"></div><div class="mp-col" id="mpR"></div></div>
  ` + feedbackAreaHtml();
  renderHintRow(container, "matchpairs", r);
  let selL = null, selR = null, done = 0;
  const L0 = document.getElementById("mpL"), R0 = document.getElementById("mpR");
  r.left.forEach((h,i) => { const b = document.createElement("button"); b.type="button"; b.className="mp-card"+(r.ltr?" ltr":""); b.dataset.i=i; b.innerHTML=h; b.onclick=()=>{ if(b.disabled) return; L0.querySelectorAll(".mp-card").forEach(x=>x.classList.remove("sel")); b.classList.add("sel"); selL=i; tryM(); }; L0.appendChild(b); });
  r.right.forEach((h,j) => { const b = document.createElement("button"); b.type="button"; b.className="mp-card"+(r.ltr?" ltr":""); b.dataset.j=j; b.innerHTML=h; b.onclick=()=>{ if(b.disabled) return; R0.querySelectorAll(".mp-card").forEach(x=>x.classList.remove("sel")); b.classList.add("sel"); selR=j; tryM(); }; R0.appendChild(b); });
  function tryM(){
    if(selL === null || selR === null) return;
    const lb = L0.querySelector(`[data-i="${selL}"]`), rb = R0.querySelector(`[data-j="${selR}"]`);
    if(r.rightMatch[selR] === selL){
      lb.classList.remove("sel"); rb.classList.remove("sel");
      lb.classList.add("paired","p"+(done%6)); rb.classList.add("paired","p"+(done%6));
      lb.disabled = rb.disabled = true; done++;
      if(done === r.left.length) finalizeRoundSuccess();
    } else { flash(lb); flash(rb); lb.classList.remove("sel"); rb.classList.remove("sel"); showMistakeFeedback(); }
    selL = selR = null;
  }
};

/* ---------------- 19. GRAPHTAP: tap the right point(s) on a graph ---------------- */
RENDERERS.graphtap = function(container, r){
  const v = Object.assign({xmin:-6,xmax:6,ymin:-6,ymax:6}, r.view||{});
  const W = 320, H = 320, pad = 24;
  const cw = (W-2*pad)/(v.xmax-v.xmin), ch = (H-2*pad)/(v.ymax-v.ymin);
  const sx = x => pad + (x-v.xmin)*cw, sy = y => H - pad - (y-v.ymin)*ch;
  container.innerHTML = P(r, "اضغط على النقطة (أو النقاط) الصحيحة على الشبكة:", "Tap the correct point(s) on the grid:") + `
    ${r.exprHtml ? `<div class="math-expr" dir="ltr">${r.exprHtml}</div>` : ""}
    <div class="graph-wrap"><svg id="gtSvg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" class="graph-grid"></svg></div>
    ${r.legendHtml ? `<div class="gt-legend">${r.legendHtml}</div>` : ""}
    <div class="nl-step-count" id="gtLeft"></div>
    <div id="gtStage"></div>
  ` + feedbackAreaHtml();
  renderHintRow(container, "graphtap", r);
  let s = `<defs><clipPath id="gtClip"><rect x="${pad}" y="${pad}" width="${W-2*pad}" height="${H-2*pad}"/></clipPath></defs>`;
  for(let x=Math.ceil(v.xmin); x<=v.xmax; x++) s += `<line class="graph-gridline" x1="${sx(x)}" y1="${pad}" x2="${sx(x)}" y2="${H-pad}"/>`;
  for(let y=Math.ceil(v.ymin); y<=v.ymax; y++) s += `<line class="graph-gridline" x1="${pad}" y1="${sy(y)}" x2="${W-pad}" y2="${sy(y)}"/>`;
  s += `<line class="graph-axis" x1="${pad}" y1="${sy(0)}" x2="${W-pad}" y2="${sy(0)}"/><line class="graph-axis" x1="${sx(0)}" y1="${pad}" x2="${sx(0)}" y2="${H-pad}"/>`;
  const lx = Math.max(1, Math.ceil((v.xmax-v.xmin)/12)), ly = Math.max(1, Math.ceil((v.ymax-v.ymin)/12));
  for(let x=Math.ceil(v.xmin); x<=v.xmax; x++) if(x!==0 && x%lx===0) s += `<text class="graph-label" x="${sx(x)}" y="${sy(0)+14}" text-anchor="middle">${x}</text>`;
  for(let y=Math.ceil(v.ymin); y<=v.ymax; y++) if(y!==0 && y%ly===0) s += `<text class="graph-label" x="${sx(0)-6}" y="${sy(y)+4}" text-anchor="end">${y}</text>`;
  if(r.axisX) s += `<text class="graph-label ax" x="${W-pad+2}" y="${sy(0)-6}" text-anchor="end">${r.axisX}</text>`;
  if(r.axisY) s += `<text class="graph-label ax" x="${sx(0)+6}" y="${pad+10}">${r.axisY}</text>`;
  s += `<g clip-path="url(#gtClip)">`;
  (r.polys||[]).forEach(p => { s += `<polygon class="${p.cls||"gt-region"}" points="${p.pts.map(q=>sx(q[0])+","+sy(q[1])).join(" ")}"/>`; });
  (r.curves||[]).forEach(c => {
    const d = c.pts.map((q,i)=>(i?"L":"M")+sx(q[0]).toFixed(1)+","+sy(Math.max(v.ymin-3, Math.min(v.ymax+3, q[1]))).toFixed(1)).join(" ");
    s += `<path class="gt-curve ${c.cls||""}" d="${d}"/>`;
  });
  s += `</g>`;
  (r.marks||[]).forEach(m => { s += `<circle class="vis-pt" cx="${sx(m.x)}" cy="${sy(m.y)}" r="5"/>` + (m.label ? `<text class="vis-pt-label" x="${sx(m.x)+8}" y="${sy(m.y)-8}">${m.label}</text>` : ""); });
  for(let x=Math.ceil(v.xmin); x<=v.xmax; x++) for(let y=Math.ceil(v.ymin); y<=v.ymax; y++)
    s += `<circle class="graph-point-slot" data-x="${x}" data-y="${y}" cx="${sx(x)}" cy="${sy(y)}" r="${Math.min(6, cw/3, ch/3)}"/>`;
  const svg = document.getElementById("gtSvg"); svg.innerHTML = s;
  const got = new Set();
  const upd = () => document.getElementById("gtLeft").innerHTML = r.answers.length > 1 ? `<span dir="ltr">${got.size} / ${r.answers.length}</span>` : "";
  upd();
  svg.querySelectorAll(".graph-point-slot").forEach(c => c.addEventListener("click", () => {
    const x = Number(c.dataset.x), y = Number(c.dataset.y);
    const k = r.answers.findIndex(a => a.x === x && a.y === y);
    if(k < 0){ showMistakeFeedback(); return; }
    if(got.has(k)) return;
    got.add(k); c.classList.add("placed"); upd();
    if(got.size === r.answers.length){
      if(r.after){
        const a = r.after;
        document.getElementById("gtStage").innerHTML = stepLabel(a.ar, a.en) + kpHtml("T");
        mountKeypad("T", a.opts, val => { if(answerMatches(val, a.answer)) finalizeRoundSuccess(); else showMistakeFeedback(); });
      } else finalizeRoundSuccess();
    }
  }));
};

/* ---------------- 20. TRANSFORMER: translate / reflect / rotate a shape onto its image ---------------- */
function applyTransform(pts, op){
  switch(op){
    case "L": return pts.map(([x,y]) => [x-1,y]);
    case "R": return pts.map(([x,y]) => [x+1,y]);
    case "U": return pts.map(([x,y]) => [x,y+1]);
    case "D": return pts.map(([x,y]) => [x,y-1]);
    case "rx": return pts.map(([x,y]) => [x,-y]);
    case "ry": return pts.map(([x,y]) => [-x,y]);
    case "rot": return pts.map(([x,y]) => [-y,x]);
  }
  return pts;
}
RENDERERS.transformer = function(container, r){
  let cur = r.shape.map(p => p.slice());
  const v = {xmin:-7,xmax:7,ymin:-7,ymax:7};
  const allow = r.allow || ["L","R","U","D","rx","ry","rot"];
  const lab = { L:"◀", R:"▶", U:"▲", D:"▼", rx:"انعكاس حول محور السينات <span class='en-badge'>reflect in x-axis</span>", ry:"انعكاس حول محور الصادات <span class='en-badge'>reflect in y-axis</span>", rot:"دوران ربع دورة ↺ حول الأصل <span class='en-badge'>rotate 90° ↺ about O</span>" };
  container.innerHTML = P(r, "حرّك الشكل الأزرق حتى ينطبق على صورته الذهبية:", "Transform the blue shape until it lands on its gold image:") + `
    <div class="graph-wrap" id="tfWrap"></div>
    <div class="tf-btns" dir="ltr" id="tfBtns"></div>
    <div class="balance-history" id="tfHist"></div>
    ${checkBtnHtml("tfCheck")}
  ` + feedbackAreaHtml();
  renderHintRow(container, "transformer", r);
  const hist = [];
  function draw(){
    document.getElementById("tfWrap").innerHTML = VIS.grid(Object.assign({}, v, {W:320,H:320, polys:[{pts:r.target, cls:"tf-target"},{pts:cur, cls:"tf-shape"}]}));
    document.getElementById("tfHist").innerHTML = hist.join(" → ");
  }
  const btns = document.getElementById("tfBtns");
  allow.forEach(op => {
    const b = document.createElement("button"); b.type="button"; b.className = ["L","R","U","D"].includes(op) ? "nl-arrow-btn" : "rule-op-btn"; b.dataset.op = op; b.innerHTML = lab[op];
    const sym = {L:"←",R:"→",U:"↑",D:"↓",rx:"↕ x",ry:"↔ y",rot:"⟲ 90°"}[op];
    b.onclick = () => { cur = applyTransform(cur, op); hist.push(sym); draw(); };
    btns.appendChild(b);
  });
  const reset = document.createElement("button"); reset.type="button"; reset.className="rule-op-btn"; reset.innerHTML = "↺ من جديد <span class='en-badge'>reset</span>";
  reset.onclick = () => { cur = r.shape.map(p=>p.slice()); hist.length = 0; draw(); };
  btns.appendChild(reset);
  draw();
  document.getElementById("tfCheck").onclick = () => {
    const key = pts => pts.map(p => p.join(",")).sort().join("|");
    if(key(cur) === key(r.target)) finalizeRoundSuccess(); else showMistakeFeedback();
  };
};

/* ---------------- 21. INEQLINE: graph an inequality on a number line ---------------- */
RENDERERS.ineqline = function(container, r){
  const vals = []; for(let x=r.min; x<=r.max; x++) vals.push(x);
  const between = r.mode === "between";
  let p1 = null, p2 = null, c1 = false, c2 = false, dir = null, next = 1;
  container.innerHTML = P(r, "مثّل المتباينة: اضغط على النقطة، اختر دائرة مفتوحة أو مغلقة، ثم الاتجاه.", "Graph the inequality: tap the point, choose an open or closed circle, then the direction.") + `
    <div class="math-expr" dir="ltr">${r.exprHtml}</div>
    <div class="nl2" dir="ltr" id="iqNl">
      <div class="nl2-track"></div>
      <svg class="iq-over" id="iqOver"></svg>
      <div class="nl2-ticks" id="iqTicks"></div>
    </div>
    <div class="sl-ctrls" dir="ltr">
      <button type="button" class="rule-op-btn" id="iqC1">● / ○ ${between ? "(1)" : ""}</button>
      ${between ? `<button type="button" class="rule-op-btn" id="iqC2">● / ○ (2)</button>` : `<button type="button" class="nl-arrow-btn wide" id="iqLeft">◀</button><button type="button" class="nl-arrow-btn wide" id="iqRight">▶</button>`}
    </div>
    ${checkBtnHtml("iqCheck")}
  ` + feedbackAreaHtml();
  renderHintRow(container, "ineqline", r);
  const ticks = document.getElementById("iqTicks");
  vals.forEach(x => { const t = document.createElement("button"); t.type="button"; t.className="nl2-tick"; t.dataset.x = x; t.innerHTML = `<span class="nl2-mark"></span><span class="nl2-lab">${x}</span>`;
    t.onclick = () => { if(!between) p1 = x; else { if(next === 1){ p1 = x; next = 2; } else { p2 = x; next = 1; } } draw(); };
    ticks.appendChild(t); });
  function pos(x){ return (x - r.min)/(r.max - r.min)*100; }
  function draw(){
    const over = document.getElementById("iqOver");
    let s = "";
    const circ = (x, closed) => `<circle cx="${pos(x)}%" cy="14" r="8" class="iq-pt${closed?" closed":""}"/>`;
    if(!between){
      if(p1 !== null && dir) s += `<line class="iq-ray" x1="${pos(p1)}%" y1="14" x2="${dir>0?100:0}%" y2="14"/>`;
      if(p1 !== null) s += circ(p1, c1);
    } else {
      if(p1 !== null && p2 !== null) s += `<line class="iq-ray" x1="${pos(p1)}%" y1="14" x2="${pos(p2)}%" y2="14"/>`;
      if(p1 !== null) s += circ(p1, c1);
      if(p2 !== null) s += circ(p2, c2);
    }
    over.innerHTML = s;
    document.getElementById("iqC1").classList.toggle("active", c1);
    const b2 = document.getElementById("iqC2"); if(b2) b2.classList.toggle("active", c2);
    const L0 = document.getElementById("iqLeft"), R0 = document.getElementById("iqRight");
    if(L0){ L0.classList.toggle("active", dir === -1); R0.classList.toggle("active", dir === 1); }
  }
  document.getElementById("iqC1").onclick = () => { c1 = !c1; draw(); };
  const b2 = document.getElementById("iqC2"); if(b2) b2.onclick = () => { c2 = !c2; draw(); };
  const L0 = document.getElementById("iqLeft"); if(L0){ L0.onclick = () => { dir = -1; draw(); }; document.getElementById("iqRight").onclick = () => { dir = 1; draw(); }; }
  draw();
  document.getElementById("iqCheck").onclick = () => {
    let ok;
    if(!between) ok = p1 === r.p && c1 === r.closed && dir === r.dir;
    else {
      const [a, ca, b, cb] = p1 <= p2 ? [p1, c1, p2, c2] : [p2, c2, p1, c1];
      ok = a === r.p1 && b === r.p2 && ca === r.closed1 && cb === r.closed2;
    }
    if(ok) finalizeRoundSuccess(); else showMistakeFeedback();
  };
};

/* ---------------- 22. EQSYSTEM: eliminate a variable with row operations ---------------- */
RENDERERS.eqsystem = function(container, r){
  let e1 = r.e1.slice(), e2 = r.e2.slice();
  const fmt = e => `${coefX(e[0],"x")}${e[1]===0?"":(e[1]>0?" + ":" − ")+coefX(Math.abs(e[1]),"y")} = ${fmtNum(e[2])}`.replace(/^0x \+ /,"").replace(/^0x − /,"−");
  container.innerHTML = P(r, "استخدم أدوات الحذف لإزالة أحد المتغيرين، ثم أوجد x وy:", "Use the elimination tools to remove one variable, then find x and y:") + `
    <div class="es-box" dir="ltr">
      <div class="es-row"><span class="es-tag">①</span><span id="es1"></span></div>
      <div class="es-row"><span class="es-tag">②</span><span id="es2"></span></div>
      <div class="es-row res"><span class="es-tag">③</span><span id="es3">—</span></div>
    </div>
    <div class="sl-ctrls" dir="ltr" id="esTools"></div>
    ${stepLabel("x = ؟", "x = ?")}${kpHtml("X")}
    <div id="esY"></div>
  ` + feedbackAreaHtml();
  renderHintRow(container, "eqsystem", r);
  function draw(){ document.getElementById("es1").textContent = fmt(e1); document.getElementById("es2").textContent = fmt(e2); }
  draw();
  const tools = document.getElementById("esTools");
  const mk = (html, fn) => { const b = document.createElement("button"); b.type="button"; b.className="rule-op-btn"; b.innerHTML = html; b.onclick = fn; tools.appendChild(b); };
  [2,3,-1].forEach(k => { mk(`① × ${k}`, () => { e1 = e1.map(v=>v*k); draw(); }); mk(`② × ${k}`, () => { e2 = e2.map(v=>v*k); draw(); }); });
  mk("① + ②", () => { const s = e1.map((v,i)=>v+e2[i]); document.getElementById("es3").textContent = fmt(s); });
  mk("① − ②", () => { const s = e1.map((v,i)=>v-e2[i]); document.getElementById("es3").textContent = fmt(s); });
  mk("↺", () => { e1 = r.e1.slice(); e2 = r.e2.slice(); document.getElementById("es3").textContent = "—"; draw(); });
  mountKeypad("X", {allowNegative:true}, v => {
    if(answerMatches(v, r.x)){
      document.getElementById("esY").innerHTML = stepLabel("عوّض لإيجاد y = ؟", "Substitute to find y = ?") + kpHtml("Y");
      mountKeypad("Y", {allowNegative:true}, w => { if(answerMatches(w, r.y)) finalizeRoundSuccess(); else showMistakeFeedback(); });
      showToast("صحيح! الآن y.", "Correct! Now y.");
    } else showMistakeFeedback();
  });
};

CHAR_FOR_TYPE.count = "mahir"; CHAR_FOR_TYPE.sortbins = "mahir"; CHAR_FOR_TYPE.ordercards = "mahir";
CHAR_FOR_TYPE.placevalue = "marya"; CHAR_FOR_TYPE.numline = "mahir"; CHAR_FOR_TYPE.array = "marya";
CHAR_FOR_TYPE.barchart = "marya"; CHAR_FOR_TYPE.fraction = "marya"; CHAR_FOR_TYPE.keypadvisual = "maya";
CHAR_FOR_TYPE.columncalc = "maya"; CHAR_FOR_TYPE.slider = "marya"; CHAR_FOR_TYPE.anglelab = "maya";
CHAR_FOR_TYPE.gridfill = "maya"; CHAR_FOR_TYPE.builder = "marya"; CHAR_FOR_TYPE.factortree = "marya";
CHAR_FOR_TYPE.decimalslider = "marya"; CHAR_FOR_TYPE.leveler = "marya"; CHAR_FOR_TYPE.matchpairs = "mahir";
CHAR_FOR_TYPE.graphtap = "mahir"; CHAR_FOR_TYPE.transformer = "marya"; CHAR_FOR_TYPE.ineqline = "maya"; CHAR_FOR_TYPE.eqsystem = "maya";
