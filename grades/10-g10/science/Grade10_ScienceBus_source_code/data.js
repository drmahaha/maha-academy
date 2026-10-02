/* ===========================================================
   Maha Academy — Math Lab — shared data helpers
   (identical in every grade; the grade's own content follows
   further down in this file)
   =========================================================== */

function levelForXP(xp){
  let idx = 0;
  for(let i=0;i<LEVEL_TITLES.length;i++){ if(xp >= LEVEL_TITLES[i].min) idx = i; }
  return { num: idx+1, ...LEVEL_TITLES[idx] };
}
function gcd(a,b){ a=Math.abs(a); b=Math.abs(b); while(b){ [a,b]=[b,a%b]; } return a; }
function lcm(a,b){ return a/gcd(a,b)*b; }
/* hint helper: Think / Guide / Solution texts */
function H(tAr,tEn,gAr,gEn,sAr,sEn){ return {hintAr:tAr, hintEn:tEn, guideAr:gAr, guideEn:gEn, solAr:sAr, solEn:sEn}; }
function distinctInts(n,min,max){ const s=new Set(); let guard=0; while(s.size<n && guard++<500) s.add(randInt(min,max)); return [...s]; }
function tilesAround(n, count, min, max){ const s=new Set([n]); let g=0; while(s.size<count && g++<500){ const v=n+randInt(-3,3); if(v>=min && v<=max) s.add(v); } return [...s].sort((a,b)=>a-b); }
/* order list of indices by numeric value */
function orderIdx(values, desc){ return values.map((v,i)=>i).sort((a,b)=> desc ? values[b]-values[a] : values[a]-values[b]); }
/* shuffle a list of pairs into matchpairs data */
function pairsData(pairs){
  const left = pairs.map(p=>p[0]);
  const perm = shuffleArr(pairs.map((_,i)=>i));
  return { left, right: perm.map(i=>pairs[i][1]), rightMatch: perm };
}
function sampleFn(f, x0, x1, n){ const pts=[]; for(let i=0;i<=(n||200);i++){ const x=x0+(x1-x0)*i/(n||200); const y=f(x); if(Number.isFinite(y)) pts.push([x,y]); } return pts; }
function fracStr(n,d){ const g=gcd(n,d)||1; n/=g; d/=g; if(d<0){n=-n; d=-d;} return d===1 ? String(n) : n+"/"+d; }

function findModule(key){ return MODULES.find(m => m.key === key); }
function findMachine(modKey, machKey){ return findModule(modKey).machines.find(m => m.key === machKey); }

/* ---------- Helpers ---------- */
function randInt(min, max){ return Math.floor(Math.random()*(max-min+1))+min; }
function randChoice(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function clampTier(t){ return Math.max(1, Math.min(3, t)); }

/* ===========================================================
   Question generators — one per machine type.
   Each returns a plain data object the matching renderer in
   engine.js knows how to display and validate.
   =========================================================== */

const BASE = {};  /* reusable generators from the Grade 7 lab */

/* ---- Power Generator ---- */
BASE.power = function(tier){
  tier = clampTier(tier);
  const base = tier===1 ? randInt(2,5) : tier===2 ? randChoice([2,3,4,5,6,10]) : randChoice([2,3,4,5,6,7,10]);
  const exp = tier===1 ? randInt(2,3) : tier===2 ? randInt(2,4) : randInt(3,5);
  return { base, exp, correct: Math.pow(base, exp),
    hintAr: "اضرب الأساس في نفسه بعدد مرات يساوي الأس.", hintEn: "Multiply the base by itself as many times as the exponent." };
};

/* ---- Order of Operations Processor ---- */
BASE.orderops = function(tier){
  tier = clampTier(tier);
  const a = randInt(2,9), b = randInt(2,9), c = randInt(2,9);
  let pattern, tokens, correctOrder, result;
  if(tier <= 2){
    pattern = randChoice(["a+bxc","axb+c"]);
    if(pattern === "a+bxc"){
      tokens = [{t:"num",v:a},{t:"op",v:"+",id:0},{t:"num",v:b},{t:"op",v:"×",id:1},{t:"num",v:c}];
      correctOrder = [1,0];
      result = a + (b*c);
    } else {
      tokens = [{t:"num",v:a},{t:"op",v:"×",id:0},{t:"num",v:b},{t:"op",v:"+",id:1},{t:"num",v:c}];
      correctOrder = [0,1];
      result = (a*b) + c;
    }
  } else {
    // parenthesized: (a+b) x c  -- parentheses group always evaluates first
    tokens = [{t:"paren-open"},{t:"num",v:a},{t:"op",v:"+",id:0},{t:"num",v:b},{t:"paren-close"},{t:"op",v:"×",id:1},{t:"num",v:c}];
    correctOrder = [0,1];
    result = (a+b) * c;
  }
  return { tokens, correctOrder, result,
    hintAr: "الأقواس أولًا، ثم الضرب والقسمة، ثم الجمع والطرح.", hintEn: "Parentheses first, then × ÷, then + −." };
};

/* ---- Expression Builder ---- */
BASE.expreval = function(tier){
  tier = clampTier(tier);
  const coeff = randInt(2,9);
  const constant = randInt(1,12);
  const sign = randChoice(["+","-"]);
  const coeffOptions = new Set([coeff]);
  while(coeffOptions.size < 3) coeffOptions.add(randInt(2,9));
  const constOptions = new Set([constant]);
  while(constOptions.size < 3) constOptions.add(randInt(1,12));
  const phraseAr = sign === "+"
    ? `${L(coeff)} أمثال عدد مجهول (x)، زائد ${L(constant)}`
    : `${L(coeff)} أمثال عدد مجهول (x)، ناقص ${L(constant)}`;
  const phraseEn = sign === "+" ? `${coeff} times a number, plus ${constant}` : `${coeff} times a number, minus ${constant}`;
  return {
    coeff, constant, sign,
    coeffChoices: shuffleArr([...coeffOptions]),
    signChoices: shuffleArr(["+","-"]),
    constChoices: shuffleArr([...constOptions]),
    phraseAr, phraseEn,
    hintAr: "«أمثال» تعني الضرب في المتغير x؛ ثم أضف أو اطرح العدد الثابت.", hintEn: "\"Times\" means multiply by x; then add or subtract the constant."
  };
};
function arNum(n){ return String(n); }
function shuffleArr(a){ const arr=a.slice(); for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; } return arr; }

/* ---- Equation Balance Chamber ---- */
BASE.balance = function(tier){
  tier = clampTier(tier);
  let a, b, x, c;
  if(tier === 1){
    a = 1; x = randInt(2,15); b = randInt(1,10) * randChoice([1,-1]); c = a*x + b;
  } else if(tier === 2){
    a = randChoice([2,3,4,5]); x = randInt(2,10); b = 0; c = a*x;
  } else {
    a = randChoice([2,3,4,5]); x = randInt(2,10); b = randInt(1,10) * randChoice([1,-1]); c = a*x + b;
  }
  return { a0:a, b0:b, c0:c, x,
    hintAr: "طبّق العملية العكسية على الطرفين معًا للحفاظ على التوازن.", hintEn: "Apply the inverse operation to both sides to keep the balance." };
};

/* ---- Integer Number Line ---- */
BASE.numberline = function(tier){
  tier = clampTier(tier);
  const range = tier===1 ? 6 : tier===2 ? 8 : 10;
  const start = randInt(-range, range);
  let move = randInt(1, range);
  if(randChoice([true,false])) move = -move;
  let target = start + move;
  // keep target within visual bounds
  const bound = range + 2;
  if(target > bound || target < -bound){ move = -move; target = start + move; }
  return { start, move, target, min: -bound, max: bound,
    hintAr: move>0 ? "تحرك يمينًا بعدد الخطوات المطلوب." : "تحرك يسارًا بعدد الخطوات المطلوب.",
    hintEn: move>0 ? "Move right by the required number of steps." : "Move left by the required number of steps." };
};

/* ---- Absolute Value Scanner ---- */
BASE.absvalue = function(tier){
  tier = clampTier(tier);
  const range = tier===1 ? 6 : tier===2 ? 9 : 12;
  let a = randInt(1, range) * randChoice([1,-1]);
  return { a, correct: Math.abs(a), min: -(range+2), max: range+2,
    hintAr: "القيمة المطلقة هي المسافة عن الصفر — احسبها بلا إشارة.", hintEn: "Absolute value is the distance from zero — always positive." };
};

/* ---- Zero-Pair Reactor ---- */
BASE.zeropairs = function(tier){
  tier = clampTier(tier);
  const maxCount = tier===1 ? 6 : tier===2 ? 8 : 10;
  const isSubtraction = tier === 3 && randChoice([true,false]);
  let aRaw = randInt(1,maxCount) * randChoice([1,-1]);
  let bRaw = randInt(1,maxCount) * randChoice([1,-1]);
  let displayExpr, pos, neg, correct;
  if(isSubtraction){
    // a - b  =>  a + (-b)
    const effB = -bRaw;
    displayExpr = `${aRaw} - (${bRaw >= 0 ? bRaw : '('+bRaw+')'})`;
    pos = (aRaw>0?aRaw:0) + (effB>0?effB:0);
    neg = (aRaw<0?-aRaw:0) + (effB<0?-effB:0);
    correct = aRaw - bRaw;
  } else {
    displayExpr = `${aRaw} + (${bRaw})`;
    pos = (aRaw>0?aRaw:0) + (bRaw>0?bRaw:0);
    neg = (aRaw<0?-aRaw:0) + (bRaw<0?-bRaw:0);
    correct = aRaw + bRaw;
  }
  return { displayExpr, posCount: pos, negCount: neg, correct,
    hintAr: "كل زوج (موجب وسالب) يلغي بعضه ويعطي صفرًا — ما الذي يتبقى؟", hintEn: "Each (positive, negative) pair cancels to zero — what's left over?" };
};

/* ---- Sign Rule Combinator ---- */
BASE.signrules = function(tier){
  tier = clampTier(tier);
  const op = randChoice(["×","÷"]);
  let a, b, result;
  if(op === "×"){
    a = randInt(2, tier===1?6:tier===2?9:12) * randChoice([1,-1]);
    b = randInt(2, tier===1?6:tier===2?9:12) * randChoice([1,-1]);
    result = a*b;
  } else {
    b = randInt(2, tier===1?6:tier===2?9:12) * randChoice([1,-1]);
    const q = randInt(2, tier===1?6:tier===2?9:12) * randChoice([1,-1]);
    a = b*q;
    result = q;
  }
  const correctSign = result > 0 ? "+" : "-";
  return { a, b, op, result, correctSign, correctMag: Math.abs(result),
    hintAr: "إشارتان متشابهتان → الناتج موجب. إشارتان مختلفتان → الناتج سالب.", hintEn: "Same signs → positive result. Different signs → negative result." };
};

/* ---- Input/Output Machine ---- */
function buildLinearRule(tier){
  // m is always kept positive: the Rule Finder's operation palette only offers
  // a positive multiplier (1-9), so a negative m would be unbuildable there.
  const m = tier===1 ? randChoice([2,3]) : randChoice([2,3,4,5]);
  const b = tier===1 ? randInt(0,5) : randInt(-9,9);
  return { m, b };
}
function applyRule(rule, x){ return rule.m*x + rule.b; }
function ruleToStages(rule){
  const stages = [];
  if(rule.m !== 1) stages.push({ op: "×", val: rule.m });
  if(rule.b !== 0) stages.push({ op: rule.b>=0 ? "+" : "-", val: Math.abs(rule.b) });
  if(stages.length===0) stages.push({op:"+", val:0});
  return stages;
}
BASE.iomachine = function(tier){
  tier = clampTier(tier);
  const rule = buildLinearRule(tier);
  const sampleInput = randInt(1,6);
  const challengeInput = randInt(1,9);
  return { rule, stages: ruleToStages(rule), sampleInput, sampleOutput: applyRule(rule, sampleInput),
    challengeInput, challengeOutput: applyRule(rule, challengeInput),
    hintAr: "طبّق كل خطوة من القاعدة بالترتيب على الرقم المُدخل.", hintEn: "Apply each stage of the rule, in order, to the input." };
};

/* ---- Rule Finder ---- */
BASE.rulefinder = function(tier){
  tier = clampTier(tier);
  const rule = buildLinearRule(tier===3?3:tier);
  const inputs = [];
  while(inputs.length < 4){
    const v = randInt(1,9);
    if(!inputs.includes(v)) inputs.push(v);
  }
  inputs.sort((a,b)=>a-b);
  const pairs = inputs.map(x => ({ x, y: applyRule(rule, x) }));
  return { rule, pairs,
    hintAr: "قارن كيف يتغير الناتج عندما يزيد المدخل بمقدار واحد.", hintEn: "Compare how the output changes when the input increases by one." };
};

/* ---- Graphing Studio ---- */
BASE.graphing = function(tier){
  tier = clampTier(tier);
  const rule = buildLinearRule(tier===1?1:tier===2?2:2);
  const xs = tier===1 ? [1,2,3] : [1,2,3,4];
  const points = xs.map(x => ({ x, y: applyRule(rule, x) }));
  const ys = points.map(p=>p.y);
  const minY = Math.min(0, ...ys) - 1, maxY = Math.max(...ys) + 1;
  const minX = 0, maxX = Math.max(...xs) + 1;
  return { rule, points, minX, maxX, minY, maxY,
    hintAr: "انظر إلى قيمتي x وy لكل نقطة، وابحث عن مكانهما على المحورين.", hintEn: "Look at the x and y value for each point, and find them on the two axes." };
};

/* ---- Ratio Builder ---- */
const RATIO_CONTEXTS = [
  { a:2, b:1, unitAr:"كوب ماء", unitBAr:"كوب عصير", unitEn:"cup water", unitBEn:"cup juice", emojiA:"💧", emojiB:"🧃" },
  { a:3, b:2, unitAr:"كيلو طحين", unitBAr:"كيلو سكر", unitEn:"kg flour", unitBEn:"kg sugar", emojiA:"🌾", emojiB:"🍬" },
  { a:5, b:1, unitAr:"طالب", unitBAr:"معلم", unitEn:"student", unitBEn:"teacher", emojiA:"🧑‍🎓", emojiB:"🧑‍🏫" },
  { a:4, b:3, unitAr:"لتر بنزين", unitBAr:"كم مسافة (×10)", unitEn:"liter fuel", unitBEn:"×10 km", emojiA:"⛽", emojiB:"🛣️" }
];
BASE.ratiobuilder = function(tier){
  tier = clampTier(tier);
  const ctx = randChoice(RATIO_CONTEXTS);
  const maxMult = tier===1 ? 4 : tier===2 ? 6 : 8;
  const rowsCount = 3;
  const mults = new Set([1]);
  while(mults.size < rowsCount) mults.add(randInt(2,maxMult));
  const sortedMults = [...mults].sort((x,y)=>x-y);
  const rows = sortedMults.map((k,i) => ({ k, aVal: ctx.a*k, bVal: ctx.b*k, blank: i===0 ? null : randChoice(["a","b"]) }));
  return { ctx, rows,
    hintAr: "اضرب كلا طرفي النسبة في نفس العدد للحصول على نسبة مكافئة.", hintEn: "Multiply both sides of the ratio by the same number for an equivalent ratio." };
};

/* ---- Rate Garage ---- */
BASE.rategarage = function(tier){
  tier = clampTier(tier);
  const speed = tier===1 ? randChoice([20,30,40,50,60]) : tier===2 ? randChoice([35,45,55,65,75,85]) : randChoice([42,56,72,84,96,108]);
  const time = tier===1 ? randInt(1,4) : randInt(2,6);
  const distance = speed*time;
  return { distance, time, correct: speed, maxSpeed: 140,
    hintAr: "السرعة = المسافة ÷ الزمن.", hintEn: "Speed = distance ÷ time." };
};

/* ---- Proportion Board ---- */
BASE.proportion = function(tier){
  tier = clampTier(tier);
  const b = tier===1 ? randChoice([2,4,5]) : tier===2 ? randChoice([3,5,6,7]) : randChoice([4,6,7,8,9]);
  const k = tier===1 ? randInt(2,4) : tier===2 ? randInt(2,6) : randInt(3,8);
  const a = randInt(1, tier===1?6:9);
  const d = b*k;
  const x = a*k;
  return { a, b, d, x,
    hintAr: "أوجد عدد المرات التي كُبِّر بها الطرف الأيمن، وطبّقه على الطرف الأيسر.", hintEn: "Find how many times the right side was scaled, then apply it to the left." };
};

/* ---- Percentage Market ---- */
const SHOP_ITEMS = [
  { ar:"حقيبة مدرسية", en:"backpack", emoji:"🎒" },
  { ar:"سماعات", en:"headphones", emoji:"🎧" },
  { ar:"حذاء رياضي", en:"sneakers", emoji:"👟" },
  { ar:"كرة قدم", en:"football", emoji:"⚽" },
  { ar:"ساعة ذكية", en:"smartwatch", emoji:"⌚" }
];
BASE.percent = function(tier){
  tier = clampTier(tier);
  const item = randChoice(SHOP_ITEMS);
  const price = tier===1 ? randChoice([40,60,80,100,120]) : tier===2 ? randChoice([150,180,220,250,300]) : randChoice([225,275,340,360,420]);
  const pct = tier===1 ? randChoice([10,20,50]) : tier===2 ? randChoice([10,15,20,25,30]) : randChoice([15,20,25,30,35,40]);
  const discount = Math.round(price*pct/100);
  const final = price - discount;
  return { item, price, pct, discount, final,
    hintAr: "الخصم = السعر × (النسبة ÷ 100). السعر النهائي = السعر − الخصم.", hintEn: "Discount = price × (percent ÷ 100). Final price = price − discount." };
};

/* ---------- content helpers for language & science games ----------
   Every helper accepts `extra` with optional hint:[ar,en] and guide:[ar,en];
   the Solution tier is generated automatically from the round's content. */
function stripTags(h){ return String(h).replace(/<[^>]+>/g, "").trim(); }
function HX(obj, extra, solAr, solEn, guideAr, guideEn){
  extra = extra || {};
  const out = Object.assign(obj, extra);
  const h = extra.hint || ["فكّر جيدًا واقرأ بتمعّن.", "Think carefully and read closely."];
  const g = extra.guide || [guideAr, guideEn];
  out.hintAr = out.hintAr || h[0]; out.hintEn = out.hintEn || h[1];
  out.guideAr = out.guideAr || g[0]; out.guideEn = out.guideEn || g[1];
  out.solAr = out.solAr || solAr; out.solEn = out.solEn || solEn;
  delete out.hint; delete out.guide;
  return out;
}
function SORT(bins, pools, per, extra){
  const items = [];
  pools.forEach((pool,b) => shuffleArr(pool).slice(0, per).forEach(h => items.push(typeof h === "object" ? Object.assign({bin:b}, h) : {html:h, bin:b})));
  const sol = bins.map((b,bi) => `${b.ar}: ${items.filter(it=>it.bin===bi).map(it=>stripTags(it.html)).join("، ")}`).join(" | ");
  return HX({ items: shuffleArr(items), bins }, extra, sol, sol, "اقرأ كل بطاقة واسأل: إلى أي صندوق تنتمي؟", "Read each card and ask: which box does it belong to?");
}
function TF(trues, falses, per, extra){
  return SORT([{ar:"صواب", en:"true", emoji:"✅"}, {ar:"خطأ", en:"false", emoji:"❌"}], [trues, falses], per, extra);
}
function MATCH(pairs, n, extra){
  const pk = shuffleArr(pairs).slice(0, n || 4);
  const sol = pk.map(p => `${stripTags(p[0])} ↔ ${stripTags(p[1])}`).join(" · ");
  return HX(pairsData(pk), extra, sol, sol, "ابدأ بالزوج الذي أنت متأكد منه.", "Start with the pair you're sure about.");
}
function ORDER(seq, extra){
  const idx = shuffleArr(seq.map((_,i)=>i));
  const sol = seq.map(stripTags).join(" ← ");
  return HX({ cards: idx.map(i=>seq[i]), order: seq.map((_,k)=>idx.indexOf(k)) }, extra, sol, seq.map(stripTags).join(" → "), "ابحث عن الخطوة الأولى ثم التي تليها.", "Find the first step, then the next.");
}
function FILL(sentence, answer, distractors, extra){
  const [pre, post] = sentence.split("___");
  return HX({ slots:1, prefix: pre, suffix: post || "", palette: shuffleArr([answer, ...distractors]), answers: [[answer]] }, extra, `${pre}${answer}${post||""}`, `${pre}${answer}${post||""}`, "جرّب كل كلمة في الفراغ واقرأ الجملة كاملة.", "Try each word in the blank and read the whole sentence.");
}
function SENT(words, extra){
  return HX({ slots: words.length, palette: shuffleArr([...new Set(words)]), answers: [words] }, extra, words.join(" "), words.join(" "), "ابدأ بالكلمة التي تبدأ بها الجملة عادةً.", "Start with the word the sentence usually begins with.");
}
function WORDBUILD(letters, distract, extra){
  if(typeof letters === "string") letters = [...letters];
  return HX({ slots: letters.length, palette: shuffleArr([...new Set([...letters, ...(distract||[])])]), answers: [letters], joinPreview: true }, extra, letters.join(""), letters.join(""), "انطق الكلمة ببطء، واسمع كل صوت فيها.", "Say the word slowly and listen to each sound.");
}


window.THEME_TEXT = {"stationBtn": "🚌 الوجهة <span class=\"en-badge\">Stop</span>", "resetAr": "تمت إعادة ضبط رحلتك في حافلة العلوم! 🚌", "resetEn": "Your Science Bus progress has been reset!", "defaultLang": "ar+en"};
/* ===========================================================
   Theme hooks: حافلة العلوم (Science Bus)
   Each station (module) has vehicle: "space" | "nature" | "sea".
   Opening a station plays a short transformation of the bus.
   =========================================================== */
const SUB_SVG = `<svg viewBox="0 0 180 120"><rect x="84" y="18" width="10" height="26" rx="3" fill="#ffd23f"/><rect x="84" y="14" width="26" height="8" rx="3" fill="#ffd23f"/>
<ellipse cx="90" cy="70" rx="78" ry="34" fill="#ffd23f" stroke="#c98a00" stroke-width="4"/><rect x="62" y="30" width="46" height="22" rx="10" fill="#ffc21a" stroke="#c98a00" stroke-width="3"/>
<circle cx="60" cy="70" r="11" fill="#6fd3ff" stroke="#c98a00" stroke-width="3"/><circle cx="92" cy="70" r="11" fill="#6fd3ff" stroke="#c98a00" stroke-width="3"/><circle cx="124" cy="70" r="11" fill="#6fd3ff" stroke="#c98a00" stroke-width="3"/>
<path d="M12 70 L0 56 L0 84 Z" fill="#ff8a3d"/><circle cx="160" cy="58" r="4" fill="#bdefff"/><circle cx="168" cy="46" r="3" fill="#bdefff"/></svg>`;
const VEHICLES = {
  space:  { icon:"🚀", ar:"الحافلة تتحول إلى صاروخ! إلى الفضاء 🌌", en:"The bus becomes a rocket! To space!", tag:"فضاء · space" },
  nature: { icon:"🚙", ar:"الحافلة تتحول إلى سيارة مستكشف! إلى الطبيعة 🌿", en:"The bus becomes an explorer jeep! Into nature!", tag:"طبيعة · nature" },
  sea:    { icon:SUB_SVG, ar:"الحافلة تتحول إلى غوّاصة! إلى أعماق البحر 🌊", en:"The bus becomes a submarine! Into the sea!", tag:"بحر · sea" }
};
window.THEME_HOOKS = {
  decorateHubCard(card, mod){
    const v = VEHICLES[mod.vehicle]; if(!v) return;
    card.insertAdjacentHTML("afterbegin", `<span class="hc-veh">${v.icon}</span><span class="hc-veh-label">${v.tag}</span>`);
  },
  openModule(mod){
    const v = VEHICLES[mod.vehicle]; if(!v) return;
    const o = document.createElement("div"); o.className = "veh-overlay " + mod.vehicle;
    o.innerHTML = `<div class="veh-stage"><div class="veh-bus">🚌</div><div class="veh-spark">✨</div><div class="veh-new">${v.icon}</div></div>
      <div class="veh-caption">${v.ar}<span class="en-badge">${v.en}</span></div>`;
    const close = () => { if(o.parentNode) o.parentNode.removeChild(o); };
    o.onclick = close; setTimeout(close, 2300);
    document.body.appendChild(o);
  }
};

/* ===========================================================
   Science diagrams for the labeler machine (viewBox 400×300).
   Each returns spots in % of width/height.
   =========================================================== */
function svgWrap(inner){ return `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">${inner}</svg>`; }
const SCI_DIAGRAMS = {
  plant: () => ({ diagramHtml: svgWrap(`
      <rect x="0" y="210" width="400" height="90" fill="#6b4423"/>
      <path d="M200 210 C195 240 170 260 150 285 M200 215 C205 245 235 265 255 290 M200 212 L202 290" stroke="#e8d3a6" stroke-width="5" fill="none"/>
      <rect x="194" y="95" width="12" height="118" fill="#3f9b4a"/>
      <ellipse cx="160" cy="150" rx="42" ry="18" fill="#56c05f" transform="rotate(-25 160 150)"/>
      <ellipse cx="242" cy="130" rx="42" ry="18" fill="#56c05f" transform="rotate(25 242 130)"/>
      <circle cx="200" cy="70" r="16" fill="#ffd23f"/>
      ${[0,60,120,180,240,300].map(a=>`<ellipse cx="${200+Math.cos(a*Math.PI/180)*30}" cy="${70+Math.sin(a*Math.PI/180)*30}" rx="16" ry="11" fill="#ff7aa8" transform="rotate(${a} ${200+Math.cos(a*Math.PI/180)*30} ${70+Math.sin(a*Math.PI/180)*30})"/>`).join("")}
      <circle cx="265" cy="175" r="13" fill="#e8452c"/>`),
    spots: [ {x:50, y:23, label:"الزهرة"}, {x:36, y:52, label:"الورقة"}, {x:50, y:57, label:"الساق"}, {x:44, y:88, label:"الجذور"}, {x:66, y:58, label:"الثمرة"} ] }),
  animalCell: (plant) => ({ diagramHtml: svgWrap(`
      ${plant ? `<rect x="40" y="30" width="320" height="240" rx="18" fill="#2f7d3a" /><rect x="52" y="42" width="296" height="216" rx="14" fill="#bde8a0"/>` : `<ellipse cx="200" cy="150" rx="170" ry="120" fill="#ffc9a8" stroke="#e08a5a" stroke-width="6"/>`}
      <circle cx="200" cy="140" r="42" fill="#7b5cc4" stroke="#4d3591" stroke-width="4"/><circle cx="208" cy="132" r="12" fill="#3a2270"/>
      ${plant ? `<rect x="80" y="165" width="100" height="70" rx="30" fill="#9fd8ff" opacity=".9"/>` : ""}
      ${plant ? [ [290,80],[300,200],[110,90] ].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="22" ry="12" fill="#1e8a2e" stroke="#0d5a18" stroke-width="2"/>`).join("") : ""}
      <ellipse cx="${plant?300:290}" cy="${plant?130:190}" rx="20" ry="9" fill="#ff8a3d" stroke="#b5541b" stroke-width="2"/>`),
    spots: plant ? [ {x:50, y:47, label:"النواة"}, {x:32, y:67, label:"الفجوة"}, {x:73, y:67, label:"البلاستيدة الخضراء"}, {x:12, y:12, label:"الجدار الخلوي"}, {x:75, y:43, label:"الميتوكندريا"}, {x:62, y:88, label:"السيتوبلازم"} ]
                   : [ {x:50, y:47, label:"النواة"}, {x:10, y:50, label:"الغشاء البلازمي"}, {x:72, y:63, label:"الميتوكندريا"}, {x:30, y:70, label:"السيتوبلازم"} ] }),
  earthLayers: () => ({ diagramHtml: svgWrap(`
      <circle cx="200" cy="150" r="140" fill="#8b5a2b"/><circle cx="200" cy="150" r="128" fill="#e8742c"/>
      <circle cx="200" cy="150" r="78" fill="#f2b33d"/><circle cx="200" cy="150" r="38" fill="#fff0a8"/>
      <path d="M200 150 L340 150 A140 140 0 0 0 200 10 Z" fill="#07131f" opacity=".35"/>`),
    spots: [ {x:83, y:10, label:"القشرة"}, {x:75, y:30, label:"الستار (الوشاح)"}, {x:57, y:36, label:"اللب الخارجي"}, {x:50, y:50, label:"اللب الداخلي"} ] }),
  waterCycle: () => ({ diagramHtml: svgWrap(`
      <rect width="400" height="300" fill="#bfe7ff"/><circle cx="60" cy="50" r="30" fill="#ffd23f"/>
      <rect x="0" y="220" width="220" height="80" fill="#2c7fd6"/><path d="M220 300 L220 215 L290 150 L400 120 L400 300 Z" fill="#6b8f3a"/>
      <ellipse cx="260" cy="60" rx="60" ry="24" fill="#fff"/><ellipse cx="300" cy="55" rx="40" ry="20" fill="#fff"/>
      ${[0,1,2,3].map(i=>`<line x1="${270+i*18}" y1="90" x2="${262+i*18}" y2="115" stroke="#2c7fd6" stroke-width="4"/>`).join("")}
      ${[0,1,2].map(i=>`<path d="M${80+i*40} 210 q -8 -20 0 -40 q 8 -20 0 -40" stroke="#fff" stroke-width="3" fill="none" stroke-dasharray="6 5"/>`).join("")}
      <path d="M300 180 C280 210 250 220 225 230" stroke="#2c7fd6" stroke-width="6" fill="none"/>`),
    spots: [ {x:30, y:47, label:"التبخر"}, {x:70, y:20, label:"التكاثف"}, {x:72, y:35, label:"الهطول"}, {x:64, y:70, label:"الجريان والتجمع"} ] }),
  insect: () => ({ diagramHtml: svgWrap(`
      <ellipse cx="110" cy="150" rx="40" ry="34" fill="#b8541b"/><ellipse cx="190" cy="150" rx="44" ry="30" fill="#d9772c"/><ellipse cx="290" cy="150" rx="70" ry="38" fill="#e8952c"/>
      ${[0,1,2].map(i=>`<path d="M${170+i*20} 175 l -20 60 M${170+i*20} 125 l -20 -60" stroke="#5a2a0a" stroke-width="5"/>`).join("")}
      <path d="M85 125 C60 80 40 70 25 60 M95 122 C80 70 70 60 60 45" stroke="#5a2a0a" stroke-width="4" fill="none"/>
      <circle cx="96" cy="140" r="7" fill="#1a0f08"/>`),
    spots: [ {x:27, y:50, label:"الرأس"}, {x:47, y:50, label:"الصدر"}, {x:73, y:50, label:"البطن"}, {x:12, y:22, label:"قرن الاستشعار"}, {x:44, y:80, label:"الأرجل"} ] }),
  atom: () => ({ diagramHtml: svgWrap(`
      <ellipse cx="200" cy="150" rx="150" ry="55" fill="none" stroke="#5ee3c1" stroke-width="2.5"/>
      <ellipse cx="200" cy="150" rx="150" ry="55" fill="none" stroke="#5ee3c1" stroke-width="2.5" transform="rotate(60 200 150)"/>
      <ellipse cx="200" cy="150" rx="150" ry="55" fill="none" stroke="#5ee3c1" stroke-width="2.5" transform="rotate(-60 200 150)"/>
      <circle cx="190" cy="145" r="14" fill="#ff5a5a"/><circle cx="210" cy="148" r="14" fill="#9aa4b8"/><circle cx="198" cy="162" r="14" fill="#ff5a5a"/><circle cx="215" cy="130" r="14" fill="#9aa4b8"/>
      <circle cx="350" cy="150" r="9" fill="#4fd6ff"/><circle cx="125" cy="40" r="9" fill="#4fd6ff"/>`),
    spots: [ {x:50, y:40, label:"النواة"}, {x:47, y:53, label:"البروتون (+)"}, {x:56, y:46, label:"النيوترون"}, {x:88, y:50, label:"الإلكترون (−)"} ] }),
  volcano: () => ({ diagramHtml: svgWrap(`
      <rect width="400" height="300" fill="#2a1a2e"/><path d="M60 270 L170 90 L230 90 L340 270 Z" fill="#6b4a3a"/>
      <rect x="192" y="90" width="16" height="170" fill="#ff5a1f"/><ellipse cx="200" cy="270" rx="70" ry="22" fill="#ff5a1f"/>
      <path d="M180 88 C170 50 150 40 140 20 M220 88 C240 50 260 45 280 25" stroke="#9aa4b8" stroke-width="10" fill="none" opacity=".7"/>
      <path d="M230 120 C260 160 270 200 290 240" stroke="#ff5a1f" stroke-width="7" fill="none"/>`),
    spots: [ {x:50, y:28, label:"فوهة البركان"}, {x:50, y:62, label:"القصبة (المدخنة)"}, {x:50, y:90, label:"غرفة الصُّهارة"}, {x:70, y:67, label:"اللابة"}, {x:35, y:9, label:"الرماد والغازات"} ] }),
  heart: () => ({ diagramHtml: svgWrap(`
      <path d="M200 270 C60 190 50 90 120 60 C160 45 190 70 200 95 C210 70 240 45 280 60 C350 90 340 190 200 270 Z" fill="#d9434a" stroke="#8a1c24" stroke-width="5"/>
      <line x1="200" y1="100" x2="200" y2="255" stroke="#8a1c24" stroke-width="5"/><line x1="90" y1="150" x2="310" y2="150" stroke="#8a1c24" stroke-width="4"/>
      <rect x="150" y="20" width="22" height="55" rx="8" fill="#3a6fd8"/><rect x="225" y="15" width="26" height="60" rx="8" fill="#e8742c"/>`),
    spots: [ {x:36, y:38, label:"الأذين الأيمن"}, {x:64, y:38, label:"الأذين الأيسر"}, {x:38, y:65, label:"البطين الأيمن"}, {x:62, y:65, label:"البطين الأيسر"}, {x:40, y:12, label:"الوريد"}, {x:60, y:10, label:"الشريان الأبهر"} ] }),
  digestive: () => ({ diagramHtml: svgWrap(`
      <ellipse cx="200" cy="40" rx="34" ry="30" fill="#f3c9a0"/><rect x="194" y="68" width="12" height="70" fill="#e8a07a"/>
      <path d="M200 135 C260 130 270 185 220 190 C190 192 175 170 185 150 Z" fill="#e8742c"/>
      <path d="M140 200 h120 v20 h-110 v20 h110 v20 h-120" stroke="#d99a55" stroke-width="16" fill="none" stroke-linejoin="round"/>
      <path d="M120 195 v80 h160 v-80" stroke="#b86b3a" stroke-width="18" fill="none"/>
      <path d="M140 150 C120 130 140 110 175 125 L180 150 Z" fill="#8a3a2a"/>`),
    spots: [ {x:50, y:13, label:"الفم"}, {x:50, y:34, label:"المريء"}, {x:57, y:55, label:"المعدة"}, {x:39, y:44, label:"الكبد"}, {x:50, y:73, label:"الأمعاء الدقيقة"}, {x:31, y:83, label:"الأمعاء الغليظة"} ] }),
  solarSystem: (full) => ({ diagramHtml: svgWrap(`
      <rect width="400" height="300" fill="#07131f"/>
      ${[[30,30],[120,60],[200,20],[330,40],[260,260],[90,270],[170,250],[380,120],[60,210],[300,140]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.6" fill="#fff" opacity=".8"/>`).join("")}
      <circle cx="0" cy="150" r="60" fill="#ffb627"/><circle cx="0" cy="150" r="70" fill="#ffb627" opacity=".25"/>
      <circle cx="80" cy="110" r="5" fill="#a39b8f"/><circle cx="110" cy="190" r="8" fill="#e8c36a"/>
      <circle cx="150" cy="110" r="9" fill="#2c7fd6"/><path d="M144 107 q5 -4 9 1 q-3 5 -9 -1" fill="#56c05f"/>
      <circle cx="190" cy="190" r="7" fill="#d9542c"/>
      <circle cx="245" cy="110" r="24" fill="#d9a066"/><rect x="222" y="104" width="46" height="5" fill="#b5713a" opacity=".7"/><rect x="224" y="116" width="42" height="4" fill="#b5713a" opacity=".7"/>
      <ellipse cx="310" cy="190" rx="34" ry="8" fill="none" stroke="#e8d3a6" stroke-width="4"/><circle cx="310" cy="190" r="17" fill="#e8c36a"/>
      <circle cx="355" cy="110" r="12" fill="#8fe3f0"/><circle cx="385" cy="190" r="11" fill="#3a6fd8"/>`),
    spots: full ? [ {x:5, y:50, label:"الشمس"}, {x:20, y:37, label:"عطارد"}, {x:37.5, y:37, label:"الأرض"}, {x:47.5, y:63, label:"المريخ"}, {x:61, y:37, label:"المشتري"}, {x:77.5, y:63, label:"زحل"} ]
                : [ {x:5, y:50, label:"الشمس"}, {x:37.5, y:37, label:"الأرض"}, {x:61, y:37, label:"المشتري"}, {x:77.5, y:63, label:"زحل"} ] }),
  fish: () => ({ diagramHtml: svgWrap(`
      <rect width="400" height="300" fill="#0b3a5c"/>
      <path d="M300 150 L375 95 L360 150 L375 205 Z" fill="#f2a33a"/>
      <ellipse cx="190" cy="150" rx="125" ry="62" fill="#f7b84a"/>
      <path d="M170 90 C190 45 230 45 250 95 Z" fill="#f2a33a"/><path d="M190 205 C200 240 230 240 240 200 Z" fill="#f2a33a"/>
      ${[0,1,2,3,4].map(i=>`<path d="M${160+i*25} 130 q12 12 0 24" stroke="#d98a2a" stroke-width="3" fill="none"/>`).join("")}
      <path d="M110 110 C125 135 125 165 110 190" stroke="#b5541b" stroke-width="5" fill="none"/>
      <circle cx="90" cy="135" r="10" fill="#fff"/><circle cx="88" cy="135" r="5" fill="#1a0f08"/>`),
    spots: [ {x:22, y:45, label:"العين"}, {x:29, y:60, label:"الخياشيم"}, {x:52, y:22, label:"الزعنفة"}, {x:48, y:47, label:"الحراشف"}, {x:88, y:50, label:"الذيل"} ] }),
  atmosphere: () => ({ diagramHtml: svgWrap(`
      <rect x="0" y="0" width="400" height="50" fill="#0a0f2a"/><rect x="0" y="50" width="400" height="60" fill="#18285a"/>
      <rect x="0" y="110" width="400" height="60" fill="#2a4a8a"/><rect x="0" y="170" width="400" height="60" fill="#4f82c9"/>
      <rect x="0" y="195" width="400" height="8" fill="#9fd8ff" opacity=".6"/>
      <rect x="0" y="230" width="400" height="55" fill="#8fd0ff"/><rect x="0" y="285" width="400" height="15" fill="#3f9b4a"/>
      <ellipse cx="80" cy="255" rx="30" ry="10" fill="#fff"/><path d="M300 225 l8 -10 l8 10 z" fill="#ddd"/>`),
    spots: [ {x:50, y:86, label:"التروبوسفير"}, {x:50, y:62, label:"الستراتوسفير"}, {x:50, y:47, label:"الميزوسفير"}, {x:50, y:27, label:"الثرموسفير"}, {x:50, y:8, label:"الإكسوسفير"} ] }),
  oceanFloor: () => ({ diagramHtml: svgWrap(`
      <rect width="400" height="300" fill="#1d6fa8"/><rect width="400" height="40" fill="#8fd0ff"/>
      <path d="M0 80 L80 90 L120 200 L180 230 L240 230 L265 170 L275 158 L290 170 L310 230 L340 230 L355 292 L370 230 L400 225 L400 300 L0 300 Z" fill="#7a5a3a"/>
      <path d="M0 40 L0 80 L60 78" fill="#6b8f3a"/>`),
    spots: [ {x:10, y:28, label:"الرصيف القاري"}, {x:25, y:51, label:"المنحدر القاري"}, {x:52, y:72, label:"السهل السحيق"}, {x:69, y:48, label:"الحيد وسط المحيط"}, {x:89, y:88, label:"الأخدود"} ] })
};
function LABEL(name, arg, extra){
  const d = SCI_DIAGRAMS[name](arg);
  const sol = d.spots.map((s,i)=>`${i+1}- ${s.label}`).join("  ");
  return HX({ diagramHtml: d.diagramHtml, spots: d.spots, aspect: "4 / 3" }, extra, sol, sol, "ابدأ بالجزء الذي تعرفه جيدًا.", "Start with the part you know best.");
}
/* LABEL with only some of the diagram's parts (keep = array of labels, or a number = first N). */
function LABELSUB(name, arg, keep, extra){
  const d = SCI_DIAGRAMS[name](arg);
  const spots = typeof keep === "number" ? shuffleArr(d.spots).slice(0, keep) : d.spots.filter(s => keep.includes(s.label));
  const sol = spots.map((s,i)=>`${i+1}- ${s.label}`).join("  ");
  return HX({ diagramHtml: d.diagramHtml, spots, aspect: "4 / 3" }, extra, sol, sol, "ابدأ بالجزء الذي تعرفه جيدًا.", "Start with the part you know best.");
}
const SCI_LEVELS = [
  { min: 0,   ar: "راكب فضولي", en: "Curious Rider" },
  { min: 60,  ar: "مراقب الطبيعة", en: "Nature Watcher" },
  { min: 150, ar: "مستكشف البحار", en: "Sea Explorer" },
  { min: 280, ar: "رائد فضاء صغير", en: "Junior Astronaut" },
  { min: 450, ar: "عالِم التجارب", en: "Experiment Scientist" },
  { min: 650, ar: "قائد الحافلة", en: "Bus Captain" },
  { min: 900, ar: "خبير حافلة العلوم", en: "Science Bus Master" }
];
const SCI_ARENA = { key: "arena", titleAr: "رحلة التحدي", titleEn: "Challenge Trip", emoji: "🏆", color: "#ffd23f", guideAr: "محطات من كل الرحلات!", guideEn: "Stops from every trip!",
  machines: [ { key: "mixed", titleAr: "الرحلة الكبرى", titleEn: "The Grand Trip", emoji: "🎯", descAr: "مزيج من كل الوجهات — أظهر إتقانك!", descEn: "A mix of every stop — show your mastery!" } ] };

/* ===========================================================
   Grade 10 content (الصف الأول الثانوي) — first term
   =========================================================== */

const GRADE = {"progressKey": "mahaScienceBusProgress_g10_v1", "ar": "الصف الأول الثانوي", "en": "Grade 10"};

/* العلوم — الصف الأول الثانوي (الفصل الأول، مسارات): مقدمة في الكيمياء والمادة · تركيب الذرة ·
   التفاعلات الكيميائية والمول · علم الأحياء وتنوّع الحياة */
const LEVEL_TITLES = SCI_LEVELS;
const MODULES = [
  { key:"matter", vehicle:"nature", titleAr:"الكيمياء والمادة", titleEn:"Chemistry & Matter", emoji:"⚗️", color:"#7ab8ff",
    guideAr:"الكيمياء تدرس المادة وتغيّراتها!", guideEn:"Chemistry studies matter and its changes!",
    machines:[
      { key:"s10branch", type:"matchpairs", titleAr:"فروع الكيمياء", titleEn:"Branches of Chemistry", emoji:"🌿", descAr:"صِل الفرع بما يدرسه.", descEn:"Match branch to focus." },
      { key:"s10class", type:"sortbins", titleAr:"تصنيف المادة", titleEn:"Classifying Matter", emoji:"🗂️", descAr:"عنصر أم مركب أم مخلوط؟", descEn:"Element, compound or mixture?" },
      { key:"s10qq", type:"sortbins", titleAr:"بيانات نوعية أم كمية؟", titleEn:"Qualitative or Quantitative?", emoji:"📊", descAr:"صنّف الملاحظات.", descEn:"Sort observations." }
    ]},
  { key:"atom", vehicle:"space", titleAr:"تركيب الذرة", titleEn:"Atomic Structure", emoji:"⚛️", color:"#c38bff",
    guideAr:"الصاروخ يدخل الذرة ويدور مع الإلكترونات!", guideEn:"The rocket orbits with the electrons!",
    machines:[
      { key:"s10atom", type:"labeler", titleAr:"أجزاء الذرة", titleEn:"Parts of an Atom", emoji:"⚛️", descAr:"سمِّ الأجزاء.", descEn:"Label the parts." },
      { key:"s10particles", type:"matchpairs", titleAr:"الجسيمات وشحناتها", titleEn:"Particles & Charges", emoji:"➕", descAr:"صِل الجسيم بصفته.", descEn:"Match particle to property." },
      { key:"s10count", type:"builder", titleAr:"احسب النيوترونات", titleEn:"Count Neutrons", emoji:"🧮", descAr:"النيوترونات = العدد الكتلي − العدد الذري.", descEn:"Neutrons = mass − atomic number." }
    ]},
  { key:"reactions", vehicle:"space", titleAr:"التفاعلات والمول", titleEn:"Reactions & the Mole", emoji:"💥", color:"#ffd23f",
    guideAr:"وقود الصاروخ تفاعل كيميائي قوي!", guideEn:"Rocket fuel is a powerful chemical reaction!",
    machines:[
      { key:"s10rtype", type:"sortbins", titleAr:"أنواع التفاعلات", titleEn:"Reaction Types", emoji:"🔬", descAr:"تكوين أم تفكك أم إحلال أم احتراق؟", descEn:"Synthesis, decomposition, replacement, combustion?" },
      { key:"s10evidence", type:"sortbins", titleAr:"أدلة التفاعل", titleEn:"Evidence of Reaction", emoji:"🫧", descAr:"دليل على تفاعل كيميائي أم لا؟", descEn:"Evidence or not?" },
      { key:"s10molar", type:"builder", titleAr:"الكتلة المولية", titleEn:"Molar Mass", emoji:"⚖️", descAr:"احسب الكتلة المولية.", descEn:"Calculate molar mass." }
    ]},
  { key:"bio", vehicle:"sea", titleAr:"تنوّع الحياة", titleEn:"Diversity of Life", emoji:"🐙", color:"#4fd6ff",
    guideAr:"الغواصة تكتشف تنوّع الحياة في المحيط!", guideEn:"The submarine discovers ocean biodiversity!",
    machines:[
      { key:"s10taxa", type:"ordercards", titleAr:"مستويات التصنيف", titleEn:"Taxonomic Ranks", emoji:"🪜", descAr:"رتّب من الأعم إلى الأخص.", descEn:"Order broadest to narrowest." },
      { key:"s10kingdoms", type:"sortbins", titleAr:"الممالك", titleEn:"Kingdoms", emoji:"🗂️", descAr:"صنّف المخلوقات.", descEn:"Sort the organisms." },
      { key:"s10traits", type:"matchpairs", titleAr:"خصائص الحياة", titleEn:"Characteristics of Life", emoji:"🧬", descAr:"صِل الخاصية بمثالها.", descEn:"Match trait to example." }
    ]},
  SCI_ARENA
];
const ARENA_POOL = ["s10branch","s10class","s10qq","s10atom","s10particles","s10count","s10rtype","s10evidence","s10molar","s10taxa","s10kingdoms","s10traits"];
const GEN = {};
GEN.s10branch = t => MATCH([["الكيمياء العضوية","مركبات الكربون"],["الكيمياء غير العضوية","المواد التي لا تحتوي على الكربون غالبًا"],["الكيمياء الحيوية","العمليات في المخلوقات الحية"],["الكيمياء التحليلية","مكونات المواد وكمياتها"],["الكيمياء الفيزيائية","سلوك المادة والطاقة"]], clampTier(t)===1?3:4);
GEN.s10class = t => SORT([{ar:"عنصر",en:"element"},{ar:"مركب",en:"compound"},{ar:"مخلوط",en:"mixture"}],
  [["النحاس Cu","النيتروجين N₂","الكربون C"],["الماء H₂O","كلوريد الصوديوم NaCl","الجلوكوز C₆H₁₂O₆"],["الهواء","الفولاذ","ماء البحر"]], clampTier(t)>=2?2:1);
GEN.s10qq = t => SORT([{ar:"بيانات نوعية",en:"qualitative"},{ar:"بيانات كمية",en:"quantitative"}],
  [["المحلول أزرق اللون","للغاز رائحة نفّاذة","السطح لامع","تكوّن راسب أبيض"],["الكتلة 25 جرامًا","درجة الحرارة 80 °س","الحجم 50 مل","الزمن 3 دقائق"]], clampTier(t)+1);
GEN.s10atom = t => LABEL("atom", 0);
GEN.s10particles = t => MATCH([["البروتون","موجب الشحنة، في النواة"],["النيوترون","متعادل الشحنة، في النواة"],["الإلكترون","سالب الشحنة، حول النواة"],["العدد الذري","عدد البروتونات"],["العدد الكتلي","البروتونات + النيوترونات"]], clampTier(t)===1?3:4);
const S10_ATOMS = [["الكربون","C",6,12],["الأكسجين","O",8,16],["الصوديوم","Na",11,23],["المغنيسيوم","Mg",12,24],["الألومنيوم","Al",13,27],["الكلور","Cl",17,35],["الكالسيوم","Ca",20,40],["الحديد","Fe",26,56],["النيتروجين","N",7,14],["الفلور","F",9,19]];
GEN.s10count = t => { const a = randChoice(clampTier(t)===1 ? S10_ATOMS.slice(0,4) : S10_ATOMS); const n = a[3]-a[2];
  const ds = shuffleArr([...new Set([a[3], a[2], n+1, n-1, a[3]+a[2]])].filter(x=>x!==n)).slice(0,2);
  return FILL(`ذرة ${a[0]} (${a[1]}): العدد الذري = ${a[2]}، والعدد الكتلي = ${a[3]}. عدد النيوترونات = ___`, String(n), ds.map(String),
    {joinPreview:false, promptAr:"النيوترونات = العدد الكتلي − العدد الذري", hint:[`اطرح ${a[2]} من ${a[3]}.`, `Subtract ${a[2]} from ${a[3]}.`]}); };
GEN.s10rtype = t => SORT([{ar:"تكوين",en:"synthesis"},{ar:"تفكك",en:"decomposition"},{ar:"إحلال",en:"replacement"},{ar:"احتراق",en:"combustion"}],
  [["2H₂ + O₂ → 2H₂O","2Na + Cl₂ → 2NaCl"],["2H₂O → 2H₂ + O₂","CaCO₃ → CaO + CO₂"],["Zn + CuSO₄ → ZnSO₄ + Cu","Fe + CuCl₂ → FeCl₂ + Cu"],["CH₄ + 2O₂ → CO₂ + 2H₂O","C₃H₈ + 5O₂ → 3CO₂ + 4H₂O"]], clampTier(t)>=3?2:1,
  {hint:["التكوين: مادتان ← مادة واحدة. التفكك: مادة ← مادتان. الإحلال: عنصر يحل محل آخر. الاحتراق: تفاعل مع الأكسجين يطلق طاقة.","A+B→AB; AB→A+B; A+BC→AC+B; with O₂ releasing energy."]});
GEN.s10evidence = t => SORT([{ar:"دليل على تفاعل كيميائي",en:"evidence",emoji:"✅"},{ar:"ليس دليلًا",en:"not evidence",emoji:"❌"}],
  [["تصاعد فقاعات غاز","تغيّر اللون","تكوّن راسب","انطلاق حرارة وضوء"],["تغيّر شكل الورق بالقص","ذوبان السكر في الماء","انصهار الشمع","تبخّر الماء"]], clampTier(t)+1);
const S10_MOL = [["H₂O", "2×1 + 16", 18],["CO₂","12 + 2×16",44],["NaCl","23 + 35",58],["O₂","2×16",32],["CH₄","12 + 4×1",16],["NH₃","14 + 3×1",17],["CaO","40 + 16",56]];
GEN.s10molar = t => { const m = randChoice(clampTier(t)===1 ? S10_MOL.slice(0,4) : S10_MOL);
  const ds = shuffleArr([...new Set([m[2]+2, m[2]-2, m[2]+16, m[2]*2])].filter(x=>x!==m[2] && x>0)).slice(0,2);
  return FILL(`الكتلة المولية للمركب \u2066${m[0]}\u2069 تساوي ___ جم/مول`, String(m[2]), ds.map(String),
    {joinPreview:false, promptAr:"الكتل الذرية: \u2066H = 1, C = 12, N = 14, O = 16, Na = 23, Cl = 35, Ca = 40\u2069", hint:["\u2066"+m[1]+"\u2069", m[1]]}); };
GEN.s10taxa = t => ORDER(["المملكة","الشعبة","الطائفة","الرتبة","الفصيلة","الجنس","النوع"].slice(0, clampTier(t)===1?4:7), {firstAr:"الأعم", lastAr:"الأخص"});
GEN.s10kingdoms = t => SORT([{ar:"البدائيات (بكتيريا)",en:"bacteria"},{ar:"الطلائعيات",en:"protists"},{ar:"الفطريات",en:"fungi"},{ar:"الحيوانات",en:"animals"}],
  [["البكتيريا العصوية","البكتيريا الزرقاء"],["الأميبا","البراميسيوم","الطحالب البنية (عشب البحر)"],["الخميرة","عيش الغراب"],["المرجان","قنديل البحر","الأخطبوط"]], clampTier(t)>=3?2:1);
GEN.s10traits = t => MATCH([["التنظيم","تتكون المخلوقات من خلية أو أكثر"],["النمو والتكاثر","البذرة تصبح شجرة"],["الاستجابة","الأخطبوط يغيّر لونه عند الخطر"],["الاتزان الداخلي","التعرّق لخفض حرارة الجسم"],["استخدام الطاقة","الأسماك تتغذى لتحصل على الطاقة"]], clampTier(t)===1?3:4);
