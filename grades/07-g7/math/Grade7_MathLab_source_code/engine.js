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

const CHAR_FOR_MACHINE = {
  power:"maya", orderops:"mahir", expreval:"marya", balance:"marya",
  numberline:"mahir", absvalue:"maya", zeropairs:"marya", signrules:"maya",
  iomachine:"marya", rulefinder:"mahir", graphing:"marya",
  ratiobuilder:"marya", rategarage:"maya", proportion:"maya", percent:"maya"
};

const ARENA_POOL = ["power","orderops","balance","numberline","zeropairs","signrules","iomachine","proportion","percent"];

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
const PROGRESS_KEY = "mahaMathLabProgress_g7_v1";

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
    session.currentMachKey = pick(ARENA_POOL);
  }
  session.round = GEN[session.currentMachKey](session.tier);
  updateActivityHeader();
  const card = document.getElementById("activityCard");
  card.innerHTML = `<div id="machineBody"></div>`;
  const body = document.getElementById("machineBody");
  RENDERERS[session.currentMachKey](body, session.round);
}

function charRow(machKey, promptAr, promptEn){
  const charKey = CHAR_FOR_MACHINE[machKey] || "maya";
  return `
    <div class="char-row">
      <img src="${CHAR_IMG[charKey]}" alt="${CHAR_NAME_AR[charKey]}">
      <div class="speech"><p>${promptAr}</p><p class="en-badge">${promptEn||""}</p></div>
    </div>`;
}

function hintTiers(machKey, round){
  const r = round;
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
  const charKey = CHAR_FOR_MACHINE[session.currentMachKey] || "maya";
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
function buildKeypad(displayEl, gridEl, opts, onCheck){
  let value = "";
  const allowNeg = !!opts.allowNegative;
  function renderDisplay(){
    displayEl.innerHTML = (value === "" ? '<span class="kp-placeholder">؟</span>' : `<span dir="ltr">${value}</span>`) + '<span class="kp-cursor">|</span>';
  }
  const keys = ["7","8","9","4","5","6","1","2","3","+/-","0","⌫"];
  keys.forEach(k => {
    if(k === "+/-" && !allowNeg) return;
    const btn = document.createElement("button");
    btn.className = "keypad-key" + (k==="⌫"?" kp-back":"") + (k==="+/-"?" kp-sign":"");
    btn.type = "button"; btn.textContent = k;
    btn.onclick = () => {
      if(k === "⌫") value = value.slice(0,-1);
      else if(k === "+/-") value = value.startsWith("-") ? value.slice(1) : (value?"-"+value:"-");
      else value += k;
      renderDisplay();
    };
    gridEl.appendChild(btn);
  });
  renderDisplay();
  const checkBtn = document.createElement("button");
  checkBtn.className = "btn btn-primary"; checkBtn.type = "button"; checkBtn.style.gridColumn = "1 / -1"; checkBtn.style.marginTop="8px";
  checkBtn.innerHTML = '✓ تحقق <span class="en-badge">Check</span>';
  checkBtn.onclick = () => { if(value !== "") onCheck(value); };
  gridEl.parentElement.insertBefore(checkBtn, gridEl.nextSibling);
}
