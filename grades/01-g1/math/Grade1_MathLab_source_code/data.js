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
   Grade 1 content (الصف الأول الابتدائي) — first term
   =========================================================== */

const GRADE = {"progressKey": "mahaMathLabProgress_g1_v1", "ar": "الصف الأول الابتدائي", "en": "Grade 1"};

/* Grade 1, term 1 chapters: المقارنة والتصنيف · الأعداد حتى 5 · الموقع والنمط ·
   الأعداد حتى 10 · الأعداد حتى 20 · الجمع */

const LEVEL_TITLES = [
  { min: 0,   ar: "مستكشف الأعداد", en: "Number Explorer" },
  { min: 50,  ar: "خبير التصنيف", en: "Sorting Expert" },
  { min: 120, ar: "عدّاد العشرات", en: "Ten Counter" },
  { min: 220, ar: "صانع الأنماط", en: "Pattern Maker" },
  { min: 350, ar: "بطل الجمع", en: "Addition Hero" },
  { min: 500, ar: "نجم الأعداد", en: "Number Star" },
  { min: 700, ar: "خبير مختبر الرياضيات", en: "Math Lab Master" }
];

const MODULES = [
  {
    key: "classify", titleAr: "محطة المقارنة والتصنيف", titleEn: "Compare & Sort Station", emoji: "🗂️", color: "#7c5cf0",
    guideAr: "قارن الأشياء وصنّفها حسب الشكل واللون والحجم!", guideEn: "Compare things and sort them by shape, color, and size!",
    machines: [
      { key: "g1sort", type: "sortbins", titleAr: "آلة التصنيف", titleEn: "Sorting Machine", emoji: "🧺", descAr: "صنّف الأشياء في مجموعات.", descEn: "Sort things into groups." },
      { key: "g1more", type: "count", titleAr: "ميزان أكثر وأقل", titleEn: "More-or-Fewer Scale", emoji: "⚖️", descAr: "أيّ مجموعة أكثر؟ أيّها أقل؟", descEn: "Which group has more? Fewer?" },
      { key: "g1size", type: "ordercards", titleAr: "مرتّب الأطوال", titleEn: "Length Sorter", emoji: "📏", descAr: "رتّب من الأقصر إلى الأطول.", descEn: "Order from shortest to longest." }
    ]
  },
  {
    key: "to10", titleAr: "محطة الأعداد حتى 10", titleEn: "Numbers to 10 Station", emoji: "🔟", color: "#17b6a7",
    guideAr: "عُدّ، وكوّن المجموعات، ورتّب الأعداد!", guideEn: "Count, make sets, and order numbers!",
    machines: [
      { key: "g1count", type: "count", titleAr: "العدّاد", titleEn: "The Counter", emoji: "🔢", descAr: "عُدّ الأشياء واختر العدد.", descEn: "Count the things and pick the number." },
      { key: "g1frame", type: "count", titleAr: "إطار العشرة", titleEn: "Ten Frame", emoji: "🟩", descAr: "املأ إطار العشرة بالعدد المطلوب.", descEn: "Fill the ten frame with the number." },
      { key: "g1order", type: "ordercards", titleAr: "قطار الأعداد", titleEn: "Number Train", emoji: "🚂", descAr: "رتّب الأعداد من 0 إلى 10.", descEn: "Order numbers from 0 to 10." }
    ]
  },
  {
    key: "to20", titleAr: "محطة الأعداد حتى 20 والأنماط", titleEn: "Numbers to 20 & Patterns", emoji: "🧩", color: "#22d3ee",
    guideAr: "عشرة وآحاد، وخط الأعداد، والأنماط!", guideEn: "Tens and ones, the number line, and patterns!",
    machines: [
      { key: "g1tens", type: "placevalue", titleAr: "بنّاء العشرات والآحاد", titleEn: "Tens & Ones Builder", emoji: "🧱", descAr: "كوّن العدد من عشرة وآحاد.", descEn: "Build the number from tens and ones." },
      { key: "g1line", type: "numline", titleAr: "خط الأعداد حتى 20", titleEn: "Number Line to 20", emoji: "📍", descAr: "ضع العدد في مكانه على خط الأعداد.", descEn: "Place the number on the line." },
      { key: "g1pattern", type: "builder", titleAr: "آلة الأنماط", titleEn: "Pattern Machine", emoji: "🌈", descAr: "أكمل النمط.", descEn: "Finish the pattern." }
    ]
  },
  {
    key: "add", titleAr: "محطة الجمع", titleEn: "Addition Station", emoji: "➕", color: "#ff6f6f",
    guideAr: "اجمع بالعدّ، وبالقفز على خط الأعداد، وبالمجموعات!", guideEn: "Add by counting, hopping on the number line, and joining groups!",
    machines: [
      { key: "g1join", type: "keypadvisual", titleAr: "ضمّ المجموعات", titleEn: "Join the Groups", emoji: "🍎", descAr: "اجمع مجموعتين واكتب الناتج.", descEn: "Join two groups and write the total." },
      { key: "g1hop", type: "numline", titleAr: "قفزات الجمع", titleEn: "Addition Hops", emoji: "🐸", descAr: "ابدأ من العدد الأول واقفز للأمام.", descEn: "Start at the first number and hop forward." },
      { key: "g1facts", type: "matchpairs", titleAr: "حقائق الجمع", titleEn: "Addition Facts", emoji: "🧠", descAr: "صِل كل جملة جمع بناتجها.", descEn: "Match each sum to its answer." }
    ]
  },
  {
    key: "arena", titleAr: "ساحة التحدي", titleEn: "Challenge Arena", emoji: "🏆", color: "#f4c542",
    guideAr: "مزيج من كل الأجهزة!", guideEn: "A mix of every machine!",
    machines: [ { key: "mixed", titleAr: "التحدي الشامل", titleEn: "The Grand Challenge", emoji: "🎯", descAr: "مزيج من كل الأجهزة — أظهر إتقانك!", descEn: "A mix of every machine — show your mastery!" } ]
  }
];

const ARENA_POOL = ["g1sort","g1more","g1count","g1frame","g1order","g1tens","g1line","g1pattern","g1join","g1hop","g1facts"];

const GEN = {};
const G1_OBJ = ["🍎","⭐","🐟","🎈","🚗","🌸","🐤","🍌","⚽","🧸","🍩","🐞"];

GEN.g1sort = function(tier){
  tier = clampTier(tier);
  const sets = [
    { bins:[{ar:"حيوانات",en:"animals",emoji:"🐾"},{ar:"فواكه",en:"fruits",emoji:"🍇"}], a:["🐶","🐱","🐰","🐴","🐑","🐫"], b:["🍎","🍌","🍇","🍊","🍉","🍓"] },
    { bins:[{ar:"تطير",en:"flies",emoji:"☁️"},{ar:"تسبح",en:"swims",emoji:"🌊"}], a:["🐦","🦅","🦋","🐝","✈️","🦉"], b:["🐟","🐬","🐙","🦈","🐠","🐳"] },
    { bins:[{ar:"دائري",en:"round",emoji:"⚪"},{ar:"له زوايا",en:"has corners",emoji:"⬜"}], a:["⚽","🍪","🌕","🍩","🏀","🔴"], b:["🎁","📦","🟦","📕","🟥","🔺"] }
  ];
  const s = randChoice(sets);
  const n = tier===1 ? 2 : 3;
  const items = shuffleArr([...shuffleArr(s.a).slice(0,n).map(h=>({html:h,bin:0})), ...shuffleArr(s.b).slice(0,n).map(h=>({html:h,bin:1}))]);
  return { items, bins: s.bins,
    ...H("ما الشيء المشترك بين أشياء كل صندوق؟", "What do the things in each box have in common?", "انظر إلى كل شيء واسأل: إلى أي مجموعة ينتمي؟", "Look at each thing and ask: which group does it belong to?", "صنّف حسب اسم الصندوق.", "Sort by the name on each box.") };
};
GEN.g1more = function(tier){
  tier = clampTier(tier);
  let a,b; do { a = randInt(1, tier===1?5:10); b = randInt(1, tier===1?5:10); } while(a === b);
  const ask = randChoice(["more","less"]);
  return { mode: "compare", a, b, ask, emojiA: randChoice(G1_OBJ), emojiB: randChoice(G1_OBJ),
    ...H("عُدّ كل مجموعة.", "Count each group.", `${L(a)} و ${L(b)}`, `${a} and ${b}`, ask==="more" ? `${L(Math.max(a,b))} أكثر` : `${L(Math.min(a,b))} أقل`, ask==="more" ? `${Math.max(a,b)} is more` : `${Math.min(a,b)} is fewer`) };
};
GEN.g1size = function(tier){
  tier = clampTier(tier);
  const n = tier===1 ? 3 : 4;
  const lens = shuffleArr([2,3,4,5,6,7].slice(0,n+1)).slice(0,n);
  const col = randChoice(["#22d3ee","#f4c542","#9b82f5","#a3e635"]);
  return { cards: lens.map(l => `<span style="display:inline-block;height:14px;width:${l*18}px;background:${col};border-radius:7px"></span>`), order: orderIdx(lens),
    firstAr: "الأقصر", firstEn: "shortest", lastAr: "الأطول", lastEn: "longest",
    promptAr: "رتّب الأشرطة من الأقصر إلى الأطول:", promptEn: "Order the strips from shortest to longest:",
    ...H("قارن كل شريطين معًا.", "Compare two strips at a time.", "ابدأ بأقصر شريط.", "Start with the shortest strip.", "من الأقصر إلى الأطول.", "Shortest to longest.") };
};
GEN.g1count = function(tier){
  tier = clampTier(tier);
  const n = tier===1 ? randInt(1,5) : tier===2 ? randInt(4,8) : randInt(6,10);
  return { mode: "count", n, emoji: randChoice(G1_OBJ), choices: tilesAround(n, 4, 0, 10),
    ...H("اضغط على كل شيء مرة واحدة.", "Tap each one once.", "آخر عدد تقوله هو الجواب.", "The last number you say is the answer.", `${L(n)}`, `${n}`) };
};
GEN.g1frame = function(tier){
  tier = clampTier(tier);
  const n = tier===1 ? randInt(3,6) : tier===2 ? randInt(5,10) : randInt(11,17);
  return { mode: "make", n, emoji: randChoice(G1_OBJ), poolCount: Math.min(20, n + randInt(1,3)),
    ...H("شيء واحد في كل مربع.", "One thing in each box.", n > 10 ? "املأ إطار العشرة الأول كله، ثم أكمل في الثاني." : "املأ الصف الأول (5) ثم أكمل.", n > 10 ? "Fill the first ten frame, then continue in the second." : "Fill the top row (5), then continue.", `${L(n)}`, `${n}`) };
};
GEN.g1order = function(tier){
  tier = clampTier(tier);
  const n = tier===1 ? 4 : 5;
  const nums = distinctInts(n, 0, 10);
  return { cards: nums.map(v => `<span dir="ltr">${v}</span>`), order: orderIdx(nums), ltr: true,
    firstAr: "الأصغر", firstEn: "least", lastAr: "الأكبر", lastEn: "greatest",
    promptAr: "رتّب الأعداد من الأصغر إلى الأكبر:", promptEn: "Order the numbers from least to greatest:",
    ...H("أيّ عدد يأتي أولًا عندما نعدّ؟", "Which comes first when we count?", "عُدّ من 0 وابحث عن الأعداد بالترتيب.", "Count from 0 and find the numbers in order.", L(nums.slice().sort((a,b)=>a-b).join(" ، ")), nums.slice().sort((a,b)=>a-b).join(", ")) };
};
GEN.g1tens = function(tier){
  tier = clampTier(tier);
  const n = tier===1 ? randInt(10,15) : tier===2 ? randInt(11,20) : randInt(11,20);
  const read = tier === 3 && Math.random() < .5;
  const counts = [Math.floor(n/10), n%10];
  return { mode: read ? "read" : "build", target: n, counts,
    places: [{ar:"عشرات", en:"tens", val:10}, {ar:"آحاد", en:"ones", val:1}],
    ...H("كل قرص «10» يساوي عشرة آحاد.", "Each “10” disc equals ten ones.", `${L(n)} = ${L(counts[0])} عشرة و ${L(counts[1])} آحاد`, `${n} = ${counts[0]} ten and ${counts[1]} ones`, `عشرات: ${L(counts[0])}، آحاد: ${L(counts[1])}`, `tens: ${counts[0]}, ones: ${counts[1]}`) };
};
GEN.g1line = function(tier){
  tier = clampTier(tier);
  const target = tier===1 ? randInt(1,10) : randInt(5,20);
  return { mode: "tap", min: 0, max: 20, step: 1, labelEvery: tier===3 ? 10 : 5, target,
    showHtml: `<span dir="ltr">${target}</span>`,
    ...H("خط الأعداد يبدأ من 0 ويزيد نحو اليمين.", "The number line starts at 0 and grows to the right.", `ابدأ من أقرب عدد مكتوب وعُدّ الخطوط.`, `Start from the nearest labeled number and count the marks.`, `العدد ${L(target)}`, `Number ${target}`) };
};
GEN.g1pattern = function(tier){
  tier = clampTier(tier);
  if(tier === 3){
    const step = randChoice([1,2,5]); const start = randInt(0,5);
    const seq = Array.from({length:6}).map((_,i)=>start+i*step);
    const ans = [String(seq[4]), String(seq[5])];
    const pal = shuffleArr([...new Set([ans[0], ans[1], String(seq[5]+step), String(seq[3]+1)])]);
    return { slots: 2, prefix: `<span dir="ltr">${seq.slice(0,4).join(" ، ")} ،</span>`, between: ["،"], palette: pal, answers: [ans], ltr: true,
      promptAr: "أكمل نمط الأعداد:", promptEn: "Finish the number pattern:",
      ...H("كم يزيد كل عدد عن الذي قبله؟", "How much does each number grow?", `النمط يزيد ${L(step)} كل مرة.`, `The pattern adds ${step} each time.`, L(ans.join(" ، ")), ans.join(", ")) };
  }
  const sets = [["🔴","🔵"],["⭐","🌙"],["🍎","🍌"],["🟩","🟨"]];
  const [A,B] = randChoice(sets); const C = "💜";
  const unit = tier===1 ? [A,B] : randChoice([[A,A,B],[A,B,B],[A,B,C]]);
  const shown = Array.from({length:unit.length*2}).map((_,i)=>unit[i%unit.length]);
  const ans = [unit[0], unit[1]];
  return { slots: 2, prefix: `<span style="font-size:28px;letter-spacing:3px">${shown.join(" ")}</span>`, palette: shuffleArr([...new Set(unit)]), answers: [ans], ltr: true,
    promptAr: "أكمل النمط بشكلين:", promptEn: "Finish the pattern with two pieces:",
    ...H("ما الجزء الذي يتكرر؟", "What part repeats?", `الجزء المتكرر: ${unit.join(" ")}`, `Repeating part: ${unit.join(" ")}`, ans.join(" "), ans.join(" ")) };
};
GEN.g1join = function(tier){
  tier = clampTier(tier);
  const a = randInt(1, tier===1?4:tier===2?6:9), b = randInt(1, tier===1?4:tier===2?5:9);
  const e1 = randChoice(G1_OBJ);
  return { visualHtml: `<div class="vis-group">${e1.repeat(a)}</div><div style="font-size:30px;align-self:center">➕</div><div class="vis-group">${e1.repeat(b)}</div>`,
    exprHtml: `${a} + ${b} = ?`, answer: a+b,
    promptAr: "اجمع المجموعتين. كم المجموع؟", promptEn: "Join the two groups. How many altogether?",
    ...H("عُدّ المجموعة الأولى، ثم أكمل العدّ في الثانية.", "Count the first group, then keep counting the second.", `ابدأ من ${L(a)} وعُدّ ${L(b)} للأمام.`, `Start at ${a} and count on ${b}.`, L(`${a} + ${b} = ${a+b}`), `${a} + ${b} = ${a+b}`) };
};
GEN.g1hop = function(tier){
  tier = clampTier(tier);
  const a = randInt(0, tier===1?5:10), b = randInt(1, tier===1?4:tier===2?6:9);
  const max = tier===1 ? 10 : 20;
  const target = Math.min(max, a+b);
  return { mode: "hop", min: 0, max, step: 1, hop: 1, start: a, target, labelEvery: max===10?1:2,
    showHtml: `<span dir="ltr">${a} + ${target-a} = ?</span>`,
    promptAr: "ابدأ من العدد الأول، واقفز بعدد العدد الثاني، ثم اضغط «هنا»:", promptEn: "Start at the first number, hop the second number of times, then press “Here”:",
    ...H("الجمع يعني التحرك للأمام (لليمين).", "Adding means moving forward (right).", `اقفز ${L(target-a)} قفزات من ${L(a)}.`, `Hop ${target-a} times from ${a}.`, L(`${a} + ${target-a} = ${target}`), `${a} + ${target-a} = ${target}`) };
};
GEN.g1facts = function(tier){
  tier = clampTier(tier);
  const max = tier===1 ? 6 : tier===2 ? 10 : 18;
  const sums = distinctInts(4, 2, max);
  const pairs = sums.map(s => { const a = randInt(Math.max(0, s-9), Math.min(9, s)); return [`${a} + ${s-a}`, String(s)]; });
  return { ...pairsData(pairs), ltr: true,
    ...H("احسب كل جملة جمع أولًا.", "Work out each sum first.", "استخدم أصابعك أو العدّ للأمام.", "Use your fingers or count on.", L(pairs.map(p=>p[0]+" = "+p[1]).join("   ")), pairs.map(p=>p[0]+" = "+p[1]).join("   ")) };
};
