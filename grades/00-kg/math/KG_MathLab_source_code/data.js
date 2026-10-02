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


/* ===========================================================
   Kindergarten content (رياض الأطفال) — first term
   =========================================================== */

const GRADE = {"progressKey": "mahaMathLabProgress_kg_v1", "ar": "رياض الأطفال", "en": "Kindergarten"};

/* Kindergarten has no separate math textbook in the Saudi system — the
   KG units build these early-math skills: counting 1–10, making sets,
   shapes & colors, comparing (more/less, big/small) and patterns. */

const LEVEL_TITLES = [
  { min: 0,   ar: "صديق الأرقام", en: "Number Friend" },
  { min: 40,  ar: "العدّاد الصغير", en: "Little Counter" },
  { min: 100, ar: "صائد الأشكال", en: "Shape Hunter" },
  { min: 180, ar: "بطل المقارنة", en: "Comparing Hero" },
  { min: 280, ar: "صانع الأنماط", en: "Pattern Maker" },
  { min: 400, ar: "نجم الرياضيات", en: "Math Star" },
  { min: 550, ar: "بطل مختبر الرياضيات", en: "Math Lab Champion" }
];

const MODULES = [
  {
    key: "count", titleAr: "ركن العدّ", titleEn: "Counting Corner", emoji: "🔢", color: "#7c5cf0",
    guideAr: "هيا نعدّ من 1 إلى 10!", guideEn: "Let's count from 1 to 10!",
    machines: [
      { key: "kgCount", type: "count", titleAr: "كم عددها؟", titleEn: "How Many?", emoji: "🍎", descAr: "اضغط على كل شيء لتعدّه.", descEn: "Tap each thing to count it." },
      { key: "kgMake", type: "count", titleAr: "إطار العشرة", titleEn: "Ten Frame", emoji: "🧺", descAr: "ضع العدد المطلوب في الإطار.", descEn: "Put the right number in the frame." },
      { key: "kgTrain", type: "ordercards", titleAr: "قطار الأرقام", titleEn: "Number Train", emoji: "🚂", descAr: "رتّب الأرقام في القطار.", descEn: "Put the numbers on the train in order." }
    ]
  },
  {
    key: "shapes", titleAr: "ركن الأشكال والألوان", titleEn: "Shapes & Colors Corner", emoji: "🔷", color: "#17b6a7",
    guideAr: "دائرة، مربع، مثلث… وألوان جميلة!", guideEn: "Circle, square, triangle… and lovely colors!",
    machines: [
      { key: "kgShapes", type: "sortbins", titleAr: "صندوق الأشكال", titleEn: "Shape Sorter", emoji: "🔺", descAr: "ضع كل شكل في صندوقه.", descEn: "Put each shape in its box." },
      { key: "kgColors", type: "sortbins", titleAr: "صندوق الألوان", titleEn: "Color Sorter", emoji: "🎨", descAr: "صنّف الأشياء حسب لونها.", descEn: "Sort things by color." },
      { key: "kgMatch", type: "matchpairs", titleAr: "أين شكلي؟", titleEn: "Find My Shape", emoji: "🔍", descAr: "صِل الشيء بشكله.", descEn: "Match each thing to its shape." }
    ]
  },
  {
    key: "compare", titleAr: "ركن المقارنة", titleEn: "Comparing Corner", emoji: "⚖️", color: "#22d3ee",
    guideAr: "أكثر أم أقل؟ كبير أم صغير؟", guideEn: "More or less? Big or small?",
    machines: [
      { key: "kgMore", type: "count", titleAr: "أكثر أم أقل؟", titleEn: "More or Fewer?", emoji: "🍭", descAr: "اختر المجموعة الأكثر أو الأقل.", descEn: "Pick the group with more or fewer." },
      { key: "kgSize", type: "sortbins", titleAr: "كبير وصغير", titleEn: "Big and Small", emoji: "🐘", descAr: "صنّف الأشياء: كبير أم صغير؟", descEn: "Sort things: big or small?" },
      { key: "kgLine", type: "ordercards", titleAr: "من الأصغر إلى الأكبر", titleEn: "Small to Big", emoji: "📏", descAr: "رتّب الأشياء حسب حجمها.", descEn: "Order things by size." }
    ]
  },
  {
    key: "patterns", titleAr: "ركن الأنماط", titleEn: "Patterns Corner", emoji: "🌈", color: "#ff6f6f",
    guideAr: "ماذا يأتي بعد ذلك؟", guideEn: "What comes next?",
    machines: [
      { key: "kgPattern", type: "builder", titleAr: "أكمل النمط", titleEn: "Finish the Pattern", emoji: "🟡", descAr: "ما الشكل التالي في النمط؟", descEn: "What comes next in the pattern?" },
      { key: "kgPattern2", type: "builder", titleAr: "صانع الأنماط", titleEn: "Pattern Builder", emoji: "🧩", descAr: "أكمل النمط بشكلين.", descEn: "Finish the pattern with two pieces." },
      { key: "kgHop", type: "numline", titleAr: "قفزات الضفدع", titleEn: "Frog Hops", emoji: "🐸", descAr: "اقفز على خط الأعداد حتى تصل.", descEn: "Hop along the number line to arrive." }
    ]
  },
  {
    key: "arena", titleAr: "ساحة التحدي", titleEn: "Challenge Arena", emoji: "🏆", color: "#f4c542",
    guideAr: "مزيج من كل الألعاب!", guideEn: "A mix of every game!",
    machines: [
      { key: "mixed", titleAr: "التحدي الكبير", titleEn: "The Big Challenge", emoji: "🎯", descAr: "مزيج من كل الأجهزة!", descEn: "A mix of every machine!" }
    ]
  }
];

const ARENA_POOL = ["kgCount","kgMake","kgTrain","kgShapes","kgColors","kgMore","kgSize","kgPattern","kgHop"];

const GEN = {};
const KG_OBJ = ["🍎","⭐","🐟","🎈","🚗","🌸","🐤","🍌","⚽","🧸"];

GEN.kgCount = function(tier){
  tier = clampTier(tier);
  const n = tier===1 ? randInt(1,5) : tier===2 ? randInt(3,8) : randInt(5,10);
  const emoji = randChoice(KG_OBJ);
  return { mode: "count", n, emoji, choices: tilesAround(n, 4, 1, 10),
    promptAr: "اضغط على كل شيء لتعدّه، ثم اختر العدد:", promptEn: "Tap each one to count it, then pick the number:",
    ...H("اضغط على كل واحدة مرة واحدة فقط.", "Tap each one only once.", "آخر رقم تقوله هو العدد كله.", "The last number you say is how many.", `العدد هو ${L(n)}`, `The number is ${n}`) };
};
GEN.kgMake = function(tier){
  tier = clampTier(tier);
  const n = tier===1 ? randInt(1,5) : tier===2 ? randInt(4,8) : randInt(6,10);
  return { mode: "make", n, emoji: randChoice(KG_OBJ), poolCount: Math.min(10, n + randInt(1,3)),
    ...H("ضع شيئًا واحدًا في كل مربع.", "Put one thing in each box.", "عُدّ المربعات الممتلئة.", "Count the full boxes.", `ضع ${L(n)} فقط`, `Put exactly ${n}`) };
};
GEN.kgTrain = function(tier){
  tier = clampTier(tier);
  const len = tier===1 ? 3 : tier===2 ? 4 : 5;
  const start = randInt(1, 10-len+1);
  const nums = Array.from({length:len}).map((_,i)=>start+i);
  const cards = shuffleArr(nums.map(n=>n));
  return { cards: cards.map(n=>`<span dir="ltr">🚃${n}</span>`), order: orderIdx(cards), ltr: false,
    firstAr: "الأول", firstEn: "first", lastAr: "الأخير", lastEn: "last",
    promptAr: "رتّب عربات القطار من الأصغر إلى الأكبر:", promptEn: "Put the train cars in order, smallest to biggest:",
    ...H("ابدأ بالعدد الأصغر.", "Start with the smallest number.", `ابدأ بـ ${L(start)} ثم العدد الذي بعده.`, `Start with ${start}, then the next number.`, L(nums.join(" ، ")), nums.join(", ")) };
};

const KG_SHAPES = [
  {html:"🔴", bin:0},{html:"🟠", bin:0},{html:"🔵", bin:0},{html:"⚪", bin:0},
  {html:"🟥", bin:1},{html:"🟦", bin:1},{html:"🟩", bin:1},{html:"🟨", bin:1},
  {html:"🔺", bin:2},{html:"<span style='color:#22d3ee'>▲</span>", bin:2},{html:"<span style='color:#a3e635'>▲</span>", bin:2},{html:"<span style='color:#f4c542'>▲</span>", bin:2}
];
GEN.kgShapes = function(tier){
  tier = clampTier(tier);
  const per = tier===1 ? 2 : 3;
  const items = shuffleArr([0,1,2].flatMap(b => shuffleArr(KG_SHAPES.filter(s=>s.bin===b)).slice(0,per)));
  return { items, bins: [ {ar:"دائرة", en:"circle", emoji:"⚪"}, {ar:"مربع", en:"square", emoji:"⬜"}, {ar:"مثلث", en:"triangle", emoji:"🔺"} ],
    ...H("انظر إلى الحواف: الدائرة مستديرة، والمربع له 4 أضلاع، والمثلث له 3.", "Look at the edges: a circle is round, a square has 4 sides, a triangle has 3.",
         "عُدّ الأضلاع لكل شكل.", "Count the sides of each shape.", "المستدير ← دائرة، 4 أضلاع ← مربع، 3 أضلاع ← مثلث.", "Round → circle, 4 sides → square, 3 sides → triangle.") };
};
const KG_COLORS = [
  [{h:"🍎"},{h:"🍓"},{h:"🌹"},{h:"🚒"},{h:"❤️"}],
  [{h:"🐳"},{h:"💙"},{h:"🧢"},{h:"🫐"},{h:"🔵"}],
  [{h:"🍌"},{h:"🌻"},{h:"⭐"},{h:"🐤"},{h:"💛"}],
  [{h:"🥒"},{h:"🐸"},{h:"🍀"},{h:"🥦"},{h:"💚"}]
];
GEN.kgColors = function(tier){
  tier = clampTier(tier);
  const nb = tier===1 ? 2 : tier===2 ? 3 : 4;
  const idx = shuffleArr([0,1,2,3]).slice(0,nb);
  const names = [{ar:"أحمر",en:"red",emoji:"🟥"},{ar:"أزرق",en:"blue",emoji:"🟦"},{ar:"أصفر",en:"yellow",emoji:"🟨"},{ar:"أخضر",en:"green",emoji:"🟩"}];
  const items = shuffleArr(idx.flatMap((c,bi) => shuffleArr(KG_COLORS[c]).slice(0,2).map(o=>({html:o.h, bin:bi}))));
  return { items, bins: idx.map(c=>names[c]),
    ...H("ما لون كل شيء؟", "What color is each thing?", "ضع كل شيء مع لونه.", "Put each thing with its color.", "التفاحة حمراء، والموز أصفر، والضفدع أخضر، والحوت أزرق.", "Apple red, banana yellow, frog green, whale blue.") };
};
GEN.kgMatch = function(tier){
  const all = [["🍕","🔺 مثلث"],["⚽","⚪ دائرة"],["🎁","⬜ مربع"],["🍪","⚪ دائرة "],["🧀","🔺 مثلث "],["🎲","⬜ مربع "]];
  const pick3 = [["🍕","🔺 مثلث"],["⚽","⚪ دائرة"],["🎁","⬜ مربع"]];
  const pairs = randChoice([pick3, [["🧀","🔺 مثلث"],["🍪","⚪ دائرة"],["🎲","⬜ مربع"]], [["⛺","🔺 مثلث"],["🌕","⚪ دائرة"],["🖼️","⬜ مربع"]]]);
  return { ...pairsData(pairs),
    promptAr: "صِل كل شيء بشكله: اضغط عليه ثم على شكله.", promptEn: "Match each thing to its shape: tap it, then its shape.",
    ...H("ما شكل كل شيء؟", "What shape is each thing?", "الكرة مستديرة، والهدية لها 4 أضلاع.", "The ball is round; the gift has 4 sides.", pairs.map(p=>p[0]+" ← "+p[1]).join("   "), pairs.map(p=>p[0]+" → "+p[1]).join("   ")) };
};

GEN.kgMore = function(tier){
  tier = clampTier(tier);
  let a, b;
  do { a = randInt(1, tier===1?5:10); b = randInt(1, tier===1?5:10); } while(Math.abs(a-b) < (tier===1?2:1));
  const ask = randChoice(["more","less"]);
  const e = randChoice(KG_OBJ);
  return { mode: "compare", a, b, ask, emojiA: e, emojiB: e,
    ...H("عُدّ كل مجموعة.", "Count each group.", `في المجموعة الأولى ${L(a)} وفي الثانية ${L(b)}.`, `The first group has ${a}, the second has ${b}.`,
         ask === "more" ? `الأكثر: ${L(Math.max(a,b))}` : `الأقل: ${L(Math.min(a,b))}`, ask === "more" ? `More: ${Math.max(a,b)}` : `Fewer: ${Math.min(a,b)}`) };
};
GEN.kgSize = function(tier){
  const big = ["🐘","🚌","🏠","🐳","🌳","🦒"], small = ["🐜","🐭","🔑","🐞","🍒","✏️"];
  const n = tier >= 2 ? 3 : 2;
  const items = shuffleArr([...shuffleArr(big).slice(0,n).map(h=>({html:h, bin:0})), ...shuffleArr(small).slice(0,n).map(h=>({html:h, bin:1}))]);
  return { items, bins: [{ar:"كبير", en:"big", emoji:"🔼"},{ar:"صغير", en:"small", emoji:"🔽"}],
    ...H("فكّر في حجم الشيء في الحقيقة.", "Think about how big it really is.", "الفيل أكبر منك، والنملة أصغر منك.", "An elephant is bigger than you; an ant is smaller.", "الفيل والحافلة والبيت كبيرة؛ النملة والفأر والمفتاح صغيرة.", "Elephant, bus, house are big; ant, mouse, key are small.") };
};
GEN.kgLine = function(tier){
  tier = clampTier(tier);
  const n = tier===1 ? 3 : 4;
  const e = randChoice(["⭐","🍎","🐟","🌸","⚽"]);
  const sizes = [18, 28, 40, 54].slice(0, n);
  const cards = shuffleArr(sizes);
  return { cards: cards.map(s => `<span style="font-size:${s}px;line-height:1">${e}</span>`), order: orderIdx(cards),
    firstAr: "الأصغر", firstEn: "smallest", lastAr: "الأكبر", lastEn: "biggest",
    promptAr: "رتّب من الأصغر إلى الأكبر:", promptEn: "Order from smallest to biggest:",
    ...H("ابحث عن الأصغر أولًا.", "Find the smallest first.", "ثم الذي أكبر منه قليلًا.", "Then the one a little bigger.", "الأصغر أولًا، والأكبر أخيرًا.", "Smallest first, biggest last.") };
};

const KG_PAT = [["🔴","🔵"],["⭐","🌙"],["🍎","🍌"],["🐱","🐶"],["🟩","🟨"]];
GEN.kgPattern = function(tier){
  tier = clampTier(tier);
  const [A,B] = randChoice(KG_PAT);
  let unit = tier===3 ? [A,B,B] : [A,B];
  const shown = []; const len = tier===1 ? 5 : 6;
  for(let i=0;i<len;i++) shown.push(unit[i % unit.length]);
  const ans = unit[len % unit.length];
  return { slots: 1, prefix: `<span style="font-size:30px;letter-spacing:4px">${shown.join(" ")}</span>`, palette: shuffleArr([A,B]), answers: [[ans]],
    promptAr: "ما الشكل التالي في النمط؟", promptEn: "What comes next in the pattern?", ltr: true,
    ...H("قل النمط بصوت عالٍ.", "Say the pattern out loud.", `النمط يتكرر: ${unit.join(" ")}`, `The pattern repeats: ${unit.join(" ")}`, `التالي: ${ans}`, `Next: ${ans}`) };
};
GEN.kgPattern2 = function(tier){
  tier = clampTier(tier);
  const trip = tier >= 2;
  const [A,B] = randChoice(KG_PAT);
  const C = randChoice(["💜","🟠","🔷","🍇"]);
  const unit = trip ? [A,B,C] : [A,B];
  const len = unit.length*2;
  const shown = Array.from({length:len}).map((_,i)=>unit[i%unit.length]);
  const ans = [unit[len%unit.length], unit[(len+1)%unit.length]];
  return { slots: 2, prefix: `<span style="font-size:28px;letter-spacing:4px">${shown.join(" ")}</span>`, palette: shuffleArr(unit), answers: [ans], ltr: true,
    promptAr: "أكمل النمط بشكلين:", promptEn: "Finish the pattern with two pieces:",
    ...H("ابحث عن الجزء الذي يتكرر.", "Find the part that repeats.", `الجزء المتكرر: ${unit.join(" ")}`, `Repeating part: ${unit.join(" ")}`, `${ans.join(" ")}`, `${ans.join(" ")}`) };
};
GEN.kgHop = function(tier){
  tier = clampTier(tier);
  const start = tier===1 ? 0 : randInt(0,4);
  const target = Math.min(10, start + randInt(2, tier===1?4:6));
  return { mode: "hop", min: 0, max: 10, step: 1, hop: 1, start, target, labelAll: true,
    showHtml: `<span dir="ltr">🐸 ${start} → 🪷 ${target}</span>`,
    promptAr: `الضفدع عند ${L(start)}. اقفز حتى تصل إلى ${L(target)}!`, promptEn: `The frog is at ${start}. Hop until you reach ${target}!`,
    ...H("كل قفزة = خطوة واحدة.", "Each hop = one step.", `عُدّ: ${L(start)}، ${L(start+1)}، …`, `Count: ${start}, ${start+1}, …`, `${L(target-start)} قفزات`, `${target-start} hops`) };
};
