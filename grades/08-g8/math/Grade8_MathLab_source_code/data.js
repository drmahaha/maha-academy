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
   Grade 8 content (الصف الثاني المتوسط) — first term
   =========================================================== */

const GRADE = {"progressKey": "mahaMathLabProgress_g8_v1", "ar": "الصف الثاني المتوسط", "en": "Grade 8"};

const LEVEL_TITLES = [
  { min: 0,   ar: "مستكشف الأعداد", en: "Number Explorer" },
  { min: 60,  ar: "مرتّب النسبيات", en: "Rational Organizer" },
  { min: 150, ar: "صائد الجذور", en: "Root Hunter" },
  { min: 280, ar: "مهندس فيثاغورس", en: "Pythagoras Engineer" },
  { min: 450, ar: "خبير التناسب", en: "Proportion Expert" },
  { min: 650, ar: "سيد التحويلات", en: "Transformation Master" },
  { min: 900, ar: "خبير مختبر الرياضيات", en: "Math Lab Master" }
];

const MODULES = [
  {
    key: "rational", titleAr: "مختبر الأعداد النسبية", titleEn: "Rational Numbers Lab", emoji: "🔢", color: "#7c5cf0",
    guideAr: "رتّب الأعداد النسبية، ضعها على خط الأعداد، واحسب بها!", guideEn: "Order rational numbers, place them on the line, and compute with them!",
    machines: [
      { key: "r8order", type: "ordercards", titleAr: "مرتّب الأعداد النسبية", titleEn: "Rational Sorter", emoji: "📶", descAr: "رتّب الكسور والأعداد العشرية من الأصغر إلى الأكبر.", descEn: "Order fractions and decimals from least to greatest." },
      { key: "r8line", type: "numline", titleAr: "خط الأعداد النسبية", titleEn: "Rational Number Line", emoji: "📍", descAr: "ضع العدد النسبي في مكانه الصحيح.", descEn: "Place the rational number exactly." },
      { key: "r8addsub", type: "keypadvisual", titleAr: "مختبر المقامات", titleEn: "Denominator Lab", emoji: "➕", descAr: "وحّد المقامات ثم اجمع أو اطرح.", descEn: "Find a common denominator, then add or subtract." },
      { key: "r8muldiv", type: "keypadvisual", titleAr: "آلة الضرب والقسمة", titleEn: "Multiply & Divide Machine", emoji: "✖️", descAr: "اضرب الكسور، أو اقسم بالضرب في المقلوب.", descEn: "Multiply fractions, or divide by multiplying by the reciprocal." },
      { key: "r8sci", type: "decimalslider", titleAr: "مكبّر الصيغة العلمية", titleEn: "Scientific Notation Zoom", emoji: "🔬", descAr: "حرّك الفاصلة لتكتب العدد بالصيغة العلمية.", descEn: "Slide the decimal point to write scientific notation." }
    ]
  },
  {
    key: "real", titleAr: "مختبر الأعداد الحقيقية", titleEn: "Real Numbers Lab", emoji: "√", color: "#17b6a7",
    guideAr: "المربعات، الجذور، وفيثاغورس — كلها هنا!", guideEn: "Squares, roots, and Pythagoras — all here!",
    machines: [
      { key: "r8square", type: "array", titleAr: "بنّاء المربعات", titleEn: "Square Builder", emoji: "🟩", descAr: "ابنِ مربعًا لتكتشف الجذر التربيعي.", descEn: "Build a square to discover the square root." },
      { key: "r8estimate", type: "numline", titleAr: "مقدّر الجذور", titleEn: "Root Estimator", emoji: "🎯", descAr: "قدّر الجذر التربيعي لأقرب عدد صحيح.", descEn: "Estimate a square root to the nearest integer." },
      { key: "r8classify", type: "sortbins", titleAr: "مصنّف الأعداد الحقيقية", titleEn: "Real Number Sorter", emoji: "🗂️", descAr: "نسبي أم غير نسبي؟", descEn: "Rational or irrational?" },
      { key: "r8pyth", type: "keypadvisual", titleAr: "مختبر فيثاغورس", titleEn: "Pythagoras Lab", emoji: "📐", descAr: "أوجد الضلع المجهول في المثلث القائم.", descEn: "Find the missing side of a right triangle." }
    ]
  },
  {
    key: "proportion", titleAr: "مختبر التناسب والنسبة المئوية", titleEn: "Proportion & Percent Lab", emoji: "⚖️", color: "#22d3ee",
    guideAr: "النسب المتكافئة، التناسب، والتشابه، والنسب المئوية!", guideEn: "Equivalent ratios, proportions, similarity, and percents!",
    machines: [
      { key: "ratiobuilder", titleAr: "بنّاء النسب", titleEn: "Ratio Builder", emoji: "🧪", descAr: "أكمل جدول النسب المتكافئة.", descEn: "Complete a table of equivalent ratios." },
      { key: "proportion", titleAr: "لوحة التناسب", titleEn: "Proportion Board", emoji: "🟰", descAr: "أوجد x في التناسب.", descEn: "Solve for x in a proportion." },
      { key: "r8similar", type: "keypadvisual", titleAr: "مكبّر الأشكال المتشابهة", titleEn: "Similar Shapes Zoom", emoji: "🔺", descAr: "استخدم معامل التشابه لإيجاد الضلع المجهول.", descEn: "Use the scale factor to find the missing side." },
      { key: "percent", titleAr: "سوق النسبة المئوية", titleEn: "Percentage Market", emoji: "🏷️", descAr: "احسب الخصم والسعر النهائي.", descEn: "Compute the discount and final price." }
    ]
  },
  {
    key: "geometry", titleAr: "مختبر الهندسة والتحويلات", titleEn: "Geometry & Transformations Lab", emoji: "📐", color: "#ff6f6f",
    guideAr: "الزوايا، المستقيمات المتوازية، والانسحاب والانعكاس والدوران!", guideEn: "Angles, parallel lines, and translations, reflections, rotations!",
    machines: [
      { key: "r8angmatch", type: "anglelab", titleAr: "كاشف الزوايا المتطابقة", titleEn: "Congruent Angle Finder", emoji: "🔍", descAr: "اضغط على كل الزوايا المتطابقة.", descEn: "Tap every congruent angle." },
      { key: "r8angfind", type: "anglelab", titleAr: "حاسبة الزوايا", titleEn: "Angle Calculator", emoji: "📏", descAr: "أوجد قياس الزاوية المجهولة.", descEn: "Find the unknown angle." },
      { key: "r8tri", type: "anglelab", titleAr: "مختبر زوايا المثلث", titleEn: "Triangle Angle Lab", emoji: "🔻", descAr: "مجموع زوايا المثلث 180°.", descEn: "Triangle angles add to 180°." },
      { key: "r8transform", type: "transformer", titleAr: "آلة التحويلات الهندسية", titleEn: "Transformation Machine", emoji: "🔄", descAr: "انسحاب، انعكاس، ودوران على المستوى الإحداثي.", descEn: "Translate, reflect, and rotate on the grid." }
    ]
  },
  {
    key: "arena", titleAr: "ساحة التحدي", titleEn: "Challenge Arena", emoji: "🏆", color: "#f4c542",
    guideAr: "مزيج من كل الأجهزة!", guideEn: "A mix of every machine!",
    machines: [
      { key: "mixed", titleAr: "التحدي الشامل", titleEn: "The Grand Challenge", emoji: "🎯", descAr: "مزيج من كل الأجهزة — أظهر إتقانك!", descEn: "A mix of every machine — show your mastery!" }
    ]
  }
];

const ARENA_POOL = ["r8order","r8line","r8addsub","r8muldiv","r8sci","r8square","r8estimate","r8classify","r8pyth","proportion","percent","r8similar","r8angfind","r8tri","r8transform"];

const GEN = {};

/* helpers for this grade */
function ratHtml(n, d){ // n/d (may be negative) as stacked fraction or integer
  const g = gcd(n,d); n/=g; d/=g;
  if(d === 1) return `<span dir="ltr">${n}</span>`;
  return `<span dir="ltr">${n<0?"−":""}${fracHtml(Math.abs(n), d)}</span>`;
}

GEN.r8order = function(tier){
  tier = clampTier(tier);
  const pool = [];
  const used = new Set();
  const count = tier===1 ? 4 : 5;
  let guard = 0;
  while(pool.length < count && guard++ < 200){
    const kind = randChoice(["frac","dec","int"]);
    let v, html;
    if(kind === "frac"){ const d = randChoice([2,3,4,5,8]); let n = randInt(1, d*2-1); if(tier===3 && Math.random()<.5) n = -n; if(n % d === 0) continue; v = n/d; html = ratHtml(n,d); }
    else if(kind === "dec"){ let x = randInt(1, 29)/10; if(tier>=2 && Math.random()<.4) x = -x; v = x; html = `<span dir="ltr">${fmtNum(x).replace("-","−")}</span>`; }
    else { v = randInt(tier===1?0:-3, 3); html = `<span dir="ltr">${String(v).replace("-","−")}</span>`; }
    const key = v.toFixed(4);
    if(used.has(key)) continue;
    used.add(key); pool.push({v, html});
  }
  const vals = pool.map(p=>p.v);
  return { cards: pool.map(p=>p.html), order: orderIdx(vals), ltr: true,
    firstAr: "الأصغر", firstEn: "least", lastAr: "الأكبر", lastEn: "greatest",
    promptAr: "رتّب الأعداد من الأصغر (1) إلى الأكبر:", promptEn: "Order the numbers from least (1) to greatest:",
    ...H("حوّل كل كسر إلى عدد عشري لتسهل المقارنة.", "Convert each fraction to a decimal to compare easily.",
         "الأعداد السالبة أصغر من الصفر، وكلما بعدت عن الصفر يسارًا صغرت.", "Negatives are less than zero; the farther left, the smaller.",
         "الترتيب: " + L(vals.slice().sort((a,b)=>a-b).map(x=>fmtNum(x,2)).join(" < ")), "Order: " + vals.slice().sort((a,b)=>a-b).map(x=>fmtNum(x,2)).join(" < ")) };
};

GEN.r8line = function(tier){
  tier = clampTier(tier);
  const den = tier === 3 ? randChoice([3,4]) : tier === 2 ? 4 : 2;
  const min = -2, max = 2;
  let n;
  do { n = randInt(min*den, max*den); } while(n % den === 0);
  if(tier === 1) n = Math.abs(n);
  return { min, max, step: 1/den, fmt: "frac", den, labelEvery: den, target: n/den, mode: "tap",
    showHtml: ratHtml(n, den),
    promptAr: "اضغط على موقع هذا العدد على خط الأعداد:", promptEn: "Tap where this number goes on the number line:",
    ...H(`كل وحدة مقسّمة إلى ${den} أجزاء متساوية.`, `Each unit is split into ${den} equal parts.`,
         n < 0 ? "العدد سالب: ابدأ من الصفر وتحرك يسارًا." : "العدد موجب: ابدأ من الصفر وتحرك يمينًا.", n < 0 ? "Negative: start at zero and move left." : "Positive: start at zero and move right.",
         `تحرك ${L(Math.abs(n))} جزءًا من الصفر.`, `Move ${Math.abs(n)} parts from zero.`) };
};

GEN.r8addsub = function(tier){
  tier = clampTier(tier);
  const dens = tier===1 ? [[2,4],[3,6],[2,6],[4,8]] : tier===2 ? [[2,3],[3,4],[4,6],[2,5]] : [[3,4],[4,5],[6,8],[3,5]];
  const [b,d] = randChoice(dens);
  const a = randInt(1,b-1), c = randInt(1,d-1);
  const op = tier === 1 ? "+" : randChoice(["+","-"]);
  const L0 = lcm(b,d);
  const num = op === "+" ? a*(L0/b) + c*(L0/d) : a*(L0/b) - c*(L0/d);
  return {
    exprHtml: `${fracHtml(a,b)} ${op==="+"?"+":"−"} ${fracHtml(c,d)} = ?`,
    promptAr: "وحّد المقامين أولًا، ثم احسب:", promptEn: "Make a common denominator first, then compute:",
    steps: [
      { ar: "ما المقام المشترك الأصغر (م.م.أ)؟", en: "What is the least common denominator?", answer: L0 },
      { ar: "اكتب الناتج (يمكنك كتابته ككسر مثل 5/6):", en: "Type the result (you can write a fraction like 5/6):", answer: fracStr(num, L0), opts: {allowFraction:true, allowNegative:true} }
    ],
    ...H("المقام المشترك الأصغر هو أصغر عدد يقبل القسمة على المقامين.", "The LCD is the smallest number both denominators divide into.",
         `${L(a+"/"+b)} = ${L((a*L0/b)+"/"+L0)} و ${L(c+"/"+d)} = ${L((c*L0/d)+"/"+L0)}`, `${a}/${b} = ${a*L0/b}/${L0} and ${c}/${d} = ${c*L0/d}/${L0}`,
         `الناتج = ${L(fracStr(num, L0))}`, `Result = ${fracStr(num, L0)}`) };
};

function areaModelSvg(a,b,c,d){
  const W = 180, H = 180, cw = W/b, rh = H/d;
  let s = `<svg width="${W+4}" height="${H+4}" viewBox="-2 -2 ${W+4} ${H+4}" style="background:rgba(255,255,255,.03);border-radius:8px">`;
  for(let i=0;i<b;i++) for(let j=0;j<d;j++){
    const inA = i < a, inC = j < c;
    const fill = inA && inC ? "rgba(244,197,66,.85)" : inA ? "rgba(34,211,238,.35)" : inC ? "rgba(155,130,245,.35)" : "none";
    s += `<rect x="${i*cw}" y="${j*rh}" width="${cw}" height="${rh}" fill="${fill}" stroke="#c7cdf0" stroke-width="1.5"/>`;
  }
  return s + `</svg>`;
}
GEN.r8muldiv = function(tier){
  tier = clampTier(tier);
  const b = randInt(2,6), d = randInt(2,6), a = randInt(1,b-1), c = randInt(1,d-1);
  const div = tier >= 2 && Math.random() < .55;
  if(!div){
    return {
      exprHtml: `${fracHtml(a,b)} × ${fracHtml(c,d)} = ?`,
      visualHtml: areaModelSvg(a,b,c,d),
      promptAr: "الجزء الذهبي في النموذج هو ناتج الضرب. اكتب الناتج (مثل 3/8):", promptEn: "The gold part of the model is the product. Type it (like 3/8):",
      answer: fracStr(a*c, b*d), opts: {allowFraction:true},
      ...H("اضرب البسطين معًا، والمقامين معًا.", "Multiply numerators together and denominators together.",
           `البسط: ${L(a+" × "+c)}، المقام: ${L(b+" × "+d)}`, `Numerator: ${a} × ${c}, denominator: ${b} × ${d}`,
           `الناتج = ${L(fracStr(a*c, b*d))}`, `Result = ${fracStr(a*c, b*d)}`) };
  }
  const neg = tier === 3 && Math.random() < .5;
  const res = fracStr((neg?-1:1)*a*d, b*c);
  return {
    exprHtml: `${neg?"−":""}${fracHtml(a,b)} ÷ ${fracHtml(c,d)} = ?`,
    promptAr: "القسمة على كسر = الضرب في مقلوبه:", promptEn: "Dividing by a fraction = multiplying by its reciprocal:",
    steps: [
      { ar: `ما مقلوب ${L(c+"/"+d)}؟`, en: `What is the reciprocal of ${c}/${d}?`, answer: fracStr(d, c), opts: {allowFraction:true} },
      { ar: "اكتب ناتج القسمة:", en: "Type the quotient:", answer: res, opts: {allowFraction:true, allowNegative:true} }
    ],
    ...H("اقلب الكسر الثاني (بدّل البسط والمقام) ثم اضرب.", "Flip the second fraction, then multiply.",
         `${L(fracStr(a,b)+" × "+d+"/"+c)}`, `${fracStr(a,b)} × ${d}/${c}`,
         `الناتج = ${L(fracStr((neg?-1:1)*a*d, b*c))}`, `Result = ${fracStr((neg?-1:1)*a*d, b*c)}`) };
};

GEN.r8sci = function(tier){
  tier = clampTier(tier);
  const big = tier === 1 || Math.random() < .55;
  const digits = String(randChoice([12, 25, 36, 45, 72, 305, 456, 81, 604, 9]));
  const k = big ? randInt(tier===1?2:3, tier===3?7:5) : -randInt(2, tier===3?6:4);
  // value = digits × 10^e0 so that value = mantissa × 10^k with mantissa in [1,10)
  const e0 = k - (digits.length - 1);
  const s = e0 >= 0 ? digits + "0".repeat(e0) : (function(){ const z = -e0; return digits.length > z ? digits.slice(0,digits.length-z)+"."+digits.slice(digits.length-z) : "0."+"0".repeat(z-digits.length)+digits; })();
  return { mode: "sci", digits, e0, original: s,
    questionHtml: `<span dir="ltr">${s}</span>`,
    ...H("في الصيغة العلمية: عدد بين 1 و10 مضروب في قوة للعدد 10.", "Scientific notation: a number from 1 to 10 times a power of 10.",
         big ? "حرّك الفاصلة يسارًا — كل حركة تزيد الأس بواحد." : "حرّك الفاصلة يمينًا — كل حركة تُنقص الأس بواحد.", big ? "Move the point left — each move adds 1 to the exponent." : "Move the point right — each move subtracts 1 from the exponent.",
         `${L(s)} = ${L(digits[0] + (digits.length>1 ? "." + digits.slice(1) : "") + " × 10^" + k)}`, `${s} = ${digits[0]}${digits.length>1?"."+digits.slice(1):""} × 10^${k}`) };
};

GEN.r8square = function(tier){
  tier = clampTier(tier);
  const s = tier===1 ? randInt(2,5) : tier===2 ? randInt(4,8) : randInt(7,11);
  return { mode: "square", n: s*s, maxRows: 12, maxCols: 12,
    ...H("المربع له عدد صفوف يساوي عدد أعمدته.", "A square has as many rows as columns.",
         "زِد طول الضلع حتى يصبح عدد المربعات الصغيرة مساويًا للمساحة.", "Grow the side until the small squares equal the area.",
         `${L(s+" × "+s+" = "+s*s)} ← ${L("√"+s*s+" = "+s)}`, `${s} × ${s} = ${s*s}, so √${s*s} = ${s}`) };
};

GEN.r8estimate = function(tier){
  tier = clampTier(tier);
  let n;
  do { n = randInt(tier===1?5:10, tier===1?40:tier===2?90:140); } while(Number.isInteger(Math.sqrt(n)));
  const t = Math.round(Math.sqrt(n));
  const lo = Math.floor(Math.sqrt(n));
  return { min: 0, max: 12, step: 1, target: t, mode: "tap", labelAll: true,
    showHtml: `<span dir="ltr">√${n} ≈ ?</span>`,
    promptAr: "اضغط على أقرب عدد صحيح للجذر التربيعي:", promptEn: "Tap the integer closest to the square root:",
    ...H("فكّر في المربعات الكاملة القريبة من العدد.", "Think of the perfect squares near the number.",
         `${L(lo+"² = "+lo*lo)} و ${L((lo+1)+"² = "+(lo+1)*(lo+1))} — أيهما أقرب إلى ${L(n)}؟`, `${lo}² = ${lo*lo} and ${lo+1}² = ${(lo+1)*(lo+1)} — which is closer to ${n}?`,
         `${L("√"+n+" ≈ "+t)}`, `√${n} ≈ ${t}`) };
};

GEN.r8classify = function(tier){
  const rational = ["√16","√49","0.25","2/3","−5","1.5","√81","0.333…","−7/2","√1"];
  const irrational = ["√2","√7","π","√10","√15","0.1010010001…","√3","√20"];
  const items = shuffleArr([...shuffleArr(rational).slice(0,4).map(h=>({html:h, bin:0, ltr:true})), ...shuffleArr(irrational).slice(0,4).map(h=>({html:h, bin:1, ltr:true}))]);
  return { items, bins: [ {ar:"نسبي", en:"Rational", emoji:"✅"}, {ar:"غير نسبي", en:"Irrational", emoji:"♾️"} ],
    ...H("العدد النسبي يمكن كتابته على صورة كسر a/b.", "A rational number can be written as a fraction a/b.",
         "جذر المربع الكامل (مثل √16 = 4) نسبي، والعشري الدوري نسبي. العشري غير المنتهي وغير الدوري غير نسبي.", "Roots of perfect squares (√16 = 4) and repeating decimals are rational; non-repeating endless decimals are not.",
         "√2 و√7 وπ أعداد غير نسبية.", "√2, √7 and π are irrational.") };
};

function rightTriSvg(a, b, labA, labB, labC){
  const sc = 150/Math.max(a,b);
  const W = a*sc, Hh = b*sc;
  const x0 = 40, y0 = 190;
  return `<svg width="${W+110}" height="220" viewBox="0 0 ${W+110} 220">
    <polygon points="${x0},${y0} ${x0+W},${y0} ${x0},${y0-Hh}" fill="rgba(34,211,238,.12)" stroke="#22d3ee" stroke-width="3"/>
    <rect x="${x0}" y="${y0-14}" width="14" height="14" fill="none" stroke="#f4c542" stroke-width="2"/>
    <text x="${x0+W/2}" y="${y0+20}" fill="#f4c542" font-family="Space Mono" font-weight="700" text-anchor="middle">${labA}</text>
    <text x="${x0-10}" y="${y0-Hh/2}" fill="#f4c542" font-family="Space Mono" font-weight="700" text-anchor="end">${labB}</text>
    <text x="${x0+W/2+14}" y="${y0-Hh/2-6}" fill="#9b82f5" font-family="Space Mono" font-weight="700">${labC}</text>
  </svg>`;
}
GEN.r8pyth = function(tier){
  tier = clampTier(tier);
  const triples = tier===1 ? [[3,4,5],[6,8,10]] : tier===2 ? [[5,12,13],[8,6,10],[9,12,15],[3,4,5]] : [[8,15,17],[7,24,25],[12,16,20],[5,12,13]];
  const [a,b,c] = randChoice(triples);
  const findLeg = tier >= 2 && Math.random() < .5;
  if(!findLeg){
    return { visualHtml: rightTriSvg(a,b,a,b,"c = ?"),
      promptAr: "أوجد طول الوتر c:", promptEn: "Find the hypotenuse c:",
      steps: [
        { ar: L("a² + b² = "+a+"² + "+b+"² = ?"), en: "", answer: a*a+b*b },
        { ar: "c = ؟ (الجذر التربيعي)", en: "c = ? (take the square root)", answer: c }
      ],
      ...H("في المثلث القائم: مربع الوتر = مجموع مربعي الضلعين الآخرين.", "In a right triangle: c² = a² + b².",
           `${L(a+"² = "+a*a)} و ${L(b+"² = "+b*b)}`, `${a}² = ${a*a} and ${b}² = ${b*b}`,
           `${L("c = √"+(a*a+b*b)+" = "+c)}`, `c = √${a*a+b*b} = ${c}`) };
  }
  return { visualHtml: rightTriSvg(a,b,a,"b = ?","c = "+c),
    promptAr: "أوجد طول الضلع المجهول b:", promptEn: "Find the missing leg b:",
    steps: [
      { ar: L("c² − a² = "+c+"² − "+a+"² = ?"), en: "", answer: c*c-a*a },
      { ar: "b = ؟", en: "b = ?", answer: b }
    ],
    ...H("الضلع = الجذر التربيعي لـ (مربع الوتر − مربع الضلع المعلوم).", "Leg = √(c² − known leg²).",
         `${L(c+"² = "+c*c)} و ${L(a+"² = "+a*a)}`, `${c}² = ${c*c} and ${a}² = ${a*a}`,
         `${L("b = √"+(c*c-a*a)+" = "+b)}`, `b = √${c*c-a*a} = ${b}`) };
};

GEN.ratiobuilder = BASE.ratiobuilder;
GEN.proportion = BASE.proportion;
GEN.percent = BASE.percent;

GEN.r8similar = function(tier){
  tier = clampTier(tier);
  const k = tier===1 ? 2 : randChoice([2,3,4]);
  const w = randInt(2,5), h = randInt(2,5);
  const askW = Math.random() < .5;
  const sc = 22;
  const rect = (x, ww, hh, lw, lh, col) => `<g><rect x="${x}" y="${170-hh*sc/ (k>2?1.6:1)}" width="${ww*sc/(k>2?1.6:1)}" height="${hh*sc/(k>2?1.6:1)}" fill="${col}" stroke="#c7cdf0" stroke-width="2"/>
     <text x="${x + ww*sc/(k>2?1.6:1)/2}" y="188" fill="#f4c542" font-family="Space Mono" font-weight="700" text-anchor="middle">${lw}</text>
     <text x="${x-6}" y="${170 - hh*sc/(k>2?1.6:1)/2}" fill="#f4c542" font-family="Space Mono" font-weight="700" text-anchor="end">${lh}</text></g>`;
  const x2 = 40 + w*sc/(k>2?1.6:1) + 50;
  const svg = `<svg width="${x2 + w*k*sc/(k>2?1.6:1) + 20}" height="200">` + rect(40, w, h, w, h, "rgba(34,211,238,.2)") + rect(x2, w*k, h*k, askW ? "?" : w*k, askW ? h*k : "?", "rgba(155,130,245,.25)") + `</svg>`;
  const ans = askW ? w*k : h*k;
  return { visualHtml: svg,
    promptAr: "المستطيلان متشابهان. أوجد الضلع المجهول:", promptEn: "The rectangles are similar. Find the missing side:",
    steps: [
      { ar: "ما معامل التشابه (من الصغير إلى الكبير)؟", en: "What is the scale factor (small → large)?", answer: k },
      { ar: "الضلع المجهول = ؟", en: "Missing side = ?", answer: ans }
    ],
    ...H("في الأشكال المتشابهة تتناسب الأضلاع المتناظرة.", "Corresponding sides of similar shapes are proportional.",
         askW ? `قسّم ارتفاع الكبير على ارتفاع الصغير: ${L(h*k+" ÷ "+h)}` : `قسّم عرض الكبير على عرض الصغير: ${L(w*k+" ÷ "+w)}`, askW ? `Divide big height by small height: ${h*k} ÷ ${h}` : `Divide big width by small width: ${w*k} ÷ ${w}`,
         `المعامل ${L(k)}، والضلع = ${L(ans)}`, `Factor ${k}, side = ${ans}`) };
};

GEN.r8angmatch = function(tier){
  const theta = randChoice([35,40,50,55,60,65,70,110,115,120,125,130]);
  const given = randInt(0,7);
  return { mode: "match", theta, given,
    ...H("الزوايا المتناظرة والمتبادلة داخليًا وخارجيًا والمتقابلة بالرأس متطابقة.", "Corresponding, alternate and vertical angles are congruent.",
         "عند كل نقطة تقاطع: الزاويتان المتقابلتان بالرأس متساويتان. ثم انقل النمط إلى نقطة التقاطع الأخرى.", "At each crossing, vertical angles match; then copy the pattern to the other crossing.",
         "هناك 4 زوايا بنفس القياس (بما فيها المعطاة).", "There are 4 angles with the same measure (including the given one).") };
};
GEN.r8angfind = function(tier){
  const theta = randChoice([35,40,50,55,60,65,70,110,115,120,125,130]);
  const given = randInt(0,7);
  let target; do { target = randInt(0,7); } while(target === given);
  const meas = [theta,180-theta,theta,180-theta,theta,180-theta,theta,180-theta];
  const same = meas[target] === meas[given];
  return { mode: "find", theta, given, target,
    ...H("إما أن تكون الزاويتان متطابقتين، أو متكاملتين (مجموعهما 180°).", "The two angles are either congruent or supplementary (sum 180°).",
         same ? "هاتان الزاويتان متطابقتان." : "هاتان الزاويتان متكاملتان: اطرح من 180°.", same ? "These angles are congruent." : "These angles are supplementary: subtract from 180°.",
         `القياس = ${L(meas[target]+"°")}`, `Measure = ${meas[target]}°`) };
};
GEN.r8tri = function(tier){
  tier = clampTier(tier);
  let A, B;
  do { A = randInt(3,14)*5; B = randInt(3,14)*5; } while(A + B > 150);
  const ext = tier >= 2 && Math.random() < .4;
  return { mode: ext ? "ext" : "tri", A, B,
    ...H(ext ? "الزاوية الخارجية = مجموع الزاويتين الداخليتين البعيدتين." : "مجموع زوايا المثلث = 180°.", ext ? "Exterior angle = sum of the two remote interior angles." : "The angles of a triangle add to 180°.",
         ext ? `اجمع ${L(A+"°")} و ${L((180-A-B)+"°")}` : `${L("180 − "+A+" − "+B)}`, ext ? `Add ${A}° and ${180-A-B}°` : `180 − ${A} − ${B}`,
         `الإجابة: ${L((ext ? 180-B : 180-A-B)+"°")}`, `Answer: ${ext ? 180-B : 180-A-B}°`) };
};

GEN.r8transform = function(tier){
  tier = clampTier(tier);
  const shapes = [ [[1,1],[3,1],[1,3]], [[1,1],[3,1],[3,2],[1,2]], [[0,1],[2,1],[2,3]], [[1,0],[3,0],[2,2]], [[1,1],[2,1],[2,3],[1,2]] ];
  const shape = randChoice(shapes);
  let ops;
  if(tier === 1) ops = [randChoice([["R","R","U"],["L","L","D"],["R","R","R"],["U","U","L"]])][0];
  else if(tier === 2) ops = [randChoice(["rx","ry"])];
  else ops = [randChoice(["rot","rx","ry"]), randChoice(["R","L","U","D"])];
  let target = shape;
  ops.forEach(o => target = applyTransform(target, o));
  const names = {L:"انسحاب لليسار", R:"انسحاب لليمين", U:"انسحاب للأعلى", D:"انسحاب للأسفل", rx:"انعكاس حول محور السينات", ry:"انعكاس حول محور الصادات", rot:"دوران ربع دورة عكس عقارب الساعة"};
  const namesEn = {L:"translate left", R:"translate right", U:"translate up", D:"translate down", rx:"reflect in the x-axis", ry:"reflect in the y-axis", rot:"rotate 90° counter-clockwise"};
  const uniq = [...new Set(ops)];
  return { shape, target, solution: ops,
    ...H("قارن موقع الشكل واتجاهه بصورته.", "Compare the shape's position and orientation with its image.",
         "هل الصورة مقلوبة؟ (انعكاس) هل هي مُدارة؟ (دوران) أم انتقلت فقط؟ (انسحاب)", "Is the image flipped (reflection), turned (rotation), or just slid (translation)?",
         uniq.map(o=>names[o]).join(" ثم "), uniq.map(o=>namesEn[o]).join(" then ")) };
};
