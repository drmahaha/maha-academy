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
   Grade 12 content (الصف الثالث الثانوي) — first term
   =========================================================== */

const GRADE = {"progressKey": "mahaMathLabProgress_g12_v1", "ar": "الصف الثالث الثانوي", "en": "Grade 12"};

/* Grade 12 (Math 3-1, tracks system), term 1 chapters: تحليل الدوال · العلاقات والدوال
   الأسية واللوغاريتمية · المتطابقات والمعادلات المثلثية · القطوع المخروطية */

const LEVEL_TITLES = [
  { min: 0,   ar: "محلل الدوال", en: "Function Analyst" },
  { min: 60,  ar: "صائد القيم القصوى", en: "Extrema Hunter" },
  { min: 150, ar: "خبير التحويلات", en: "Transformation Expert" },
  { min: 280, ar: "سيد اللوغاريتمات", en: "Logarithm Master" },
  { min: 450, ar: "مهندس المتطابقات", en: "Identity Engineer" },
  { min: 650, ar: "راسم القطوع", en: "Conic Sketcher" },
  { min: 900, ar: "خبير مختبر الرياضيات", en: "Math Lab Master" }
];

const MODULES = [
  {
    key: "analysis", titleAr: "مختبر تحليل الدوال", titleEn: "Function Analysis Lab", emoji: "📈", color: "#7c5cf0",
    guideAr: "التحويلات الهندسية، والقيم القصوى، ومتوسط معدل التغير، وتركيب الدوال!", guideEn: "Transformations, extrema, average rate of change, and composition!",
    machines: [
      { key: "g12parent", type: "slider", titleAr: "الدوال الرئيسية والتحويلات", titleEn: "Parent Functions & Transformations", emoji: "🎛️", descAr: "انقل الدالة الرئيسية ومدّدها لتطابق المنحنى.", descEn: "Shift and stretch the parent function to match." },
      { key: "g12extrema", type: "graphtap", titleAr: "صائد القيم القصوى", titleEn: "Extrema Hunter", emoji: "⛰️", descAr: "اضغط على القيم العظمى والصغرى المحلية.", descEn: "Tap the relative maxima and minima." },
      { key: "g12rate", type: "keypadvisual", titleAr: "متوسط معدل التغير", titleEn: "Average Rate of Change", emoji: "📐", descAr: "احسب ميل القاطع بين نقطتين.", descEn: "Find the secant slope between two points." },
      { key: "g12compose", type: "gridfill", titleAr: "تركيب الدوال", titleEn: "Composition of Functions", emoji: "⚙️", descAr: "احسب (f ∘ g)(x) و(g ∘ f)(x).", descEn: "Evaluate (f ∘ g)(x) and (g ∘ f)(x)." }
    ]
  },
  {
    key: "explog", titleAr: "مختبر الأسية واللوغاريتمية", titleEn: "Exponential & Log Lab", emoji: "🌱", color: "#17b6a7",
    guideAr: "الدوال الأسية، واللوغاريتمات وخصائصها، والمعادلات!", guideEn: "Exponential functions, logarithms and their properties, and equations!",
    machines: [
      { key: "g12exp", type: "slider", titleAr: "الدالة الأسية", titleEn: "Exponential Function", emoji: "🚀", descAr: "اضبط الأساس والإزاحة.", descEn: "Tune the base and the shifts." },
      { key: "g12logform", type: "matchpairs", titleAr: "الصورة الأسية ↔ اللوغاريتمية", titleEn: "Exponential ↔ Log Form", emoji: "🔁", descAr: "صِل الصورتين المتكافئتين.", descEn: "Match equivalent forms." },
      { key: "g12logval", type: "gridfill", titleAr: "حاسبة اللوغاريتمات", titleEn: "Log Evaluator", emoji: "🔢", descAr: "احسب قيم اللوغاريتمات ذهنيًا.", descEn: "Evaluate logarithms mentally." },
      { key: "g12logprop", type: "builder", titleAr: "خصائص اللوغاريتمات", titleEn: "Log Properties", emoji: "🧩", descAr: "طبّق خاصية الضرب أو القسمة أو القوة.", descEn: "Apply the product, quotient, or power rule." },
      { key: "g12expeq", type: "keypadvisual", titleAr: "المعادلات الأسية", titleEn: "Exponential Equations", emoji: "⚖️", descAr: "وحّد الأساسات ثم ساوِ الأسس.", descEn: "Match the bases, then set exponents equal." }
    ]
  },
  {
    key: "trig", titleAr: "مختبر المتطابقات المثلثية", titleEn: "Trig Identities Lab", emoji: "📐", color: "#22d3ee",
    guideAr: "القيم الخاصة، والمتطابقات، والمعادلات، والتمثيل البياني!", guideEn: "Special values, identities, equations, and graphs!",
    machines: [
      { key: "g12values", type: "gridfill", titleAr: "جدول القيم الخاصة", titleEn: "Special Values Table", emoji: "📋", descAr: "أكمل قيم sin وcos وtan للزوايا الخاصة.", descEn: "Fill sin, cos, tan for special angles." },
      { key: "g12ident", type: "matchpairs", titleAr: "مطابق المتطابقات", titleEn: "Identity Matcher", emoji: "🧠", descAr: "صِل كل عبارة بما يساويها.", descEn: "Match each expression with its equal." },
      { key: "g12wave", type: "slider", titleAr: "مولّد الموجات", titleEn: "Wave Generator", emoji: "〰️", descAr: "اضبط السعة والتردد.", descEn: "Tune the amplitude and frequency." },
      { key: "g12trigeq", type: "graphtap", titleAr: "حل المعادلات المثلثية", titleEn: "Solving Trig Equations", emoji: "🎯", descAr: "أوجد الحلول في فترة من الزوايا.", descEn: "Find the solutions in an interval." }
    ]
  },
  {
    key: "conics", titleAr: "مختبر القطوع المخروطية", titleEn: "Conic Sections Lab", emoji: "🪐", color: "#ff6f6f",
    guideAr: "القطع المكافئ، والدائرة، والقطع الناقص، والزائد!", guideEn: "Parabolas, circles, ellipses, and hyperbolas!",
    machines: [
      { key: "g12circle", type: "slider", titleAr: "راسم الدوائر", titleEn: "Circle Sketcher", emoji: "⭕", descAr: "حدّد المركز ونصف القطر.", descEn: "Set the center and radius." },
      { key: "g12parabola", type: "slider", titleAr: "راسم القطع المكافئ", titleEn: "Parabola Sketcher", emoji: "🥣", descAr: "حدّد الرأس والاتجاه.", descEn: "Set the vertex and direction." },
      { key: "g12ellipse", type: "slider", titleAr: "راسم القطع الناقص", titleEn: "Ellipse Sketcher", emoji: "🥚", descAr: "حدّد المركز وطولي المحورين.", descEn: "Set the center and axis lengths." },
      { key: "g12identify", type: "sortbins", titleAr: "مصنّف القطوع", titleEn: "Conic Identifier", emoji: "🗂️", descAr: "حدّد نوع القطع من معادلته.", descEn: "Identify the conic from its equation." }
    ]
  },
  {
    key: "arena", titleAr: "ساحة التحدي", titleEn: "Challenge Arena", emoji: "🏆", color: "#f4c542",
    guideAr: "مزيج من كل الأجهزة!", guideEn: "A mix of every machine!",
    machines: [ { key: "mixed", titleAr: "التحدي الشامل", titleEn: "The Grand Challenge", emoji: "🎯", descAr: "مزيج من كل الأجهزة — أظهر إتقانك!", descEn: "A mix of every machine — show your mastery!" } ]
  }
];

const ARENA_POOL = ["g12parent","g12extrema","g12rate","g12compose","g12exp","g12logform","g12logval","g12logprop","g12expeq","g12values","g12ident","g12wave","g12trigeq","g12circle","g12parabola","g12ellipse","g12identify"];

const GEN = {};
const LTR12 = s => `<span dir="ltr">${s}</span>`;

GEN.g12parent = function(tier){
  tier = clampTier(tier);
  const fam = randChoice(tier===1 ? ["quad","abs"] : ["quad","abs","sqrt"]);
  const a = randChoice(tier===1 ? [1,-1] : [1,-1,2,-2,0.5]);
  const h = randInt(-4,4), k = randInt(-4,4);
  return { fam, show: tier===3 ? "eq" : "graph", target:{a,h,k},
    params:[{k:"a",label:"a",min:-3,max:3,step:0.5,v0:1,skip:[0]},{k:"h",label:"h",min:-6,max:6,step:1,v0:0},{k:"k",label:"k",min:-6,max:6,step:1,v0:0}],
    view:{xmin:-7,xmax:7,ymin:-7,ymax:7},
    ...H("y = a·f(x − h) + k: انسحاب h أفقيًا وk رأسيًا، وa تمدد/انعكاس.", "y = a·f(x − h) + k: shift h horizontally and k vertically; a stretches/reflects.", "طابق الرأس (أو نقطة البداية) أولًا.", "Match the vertex (or starting point) first.", L(`a = ${a} , h = ${h} , k = ${k}`), `a = ${a}, h = ${h}, k = ${k}`) };
};
GEN.g12extrema = function(tier){
  // cubic with integer critical points p<q: f'(x) = 3c(x-p)(x-q)
  let p, q, c, f, ok;
  do {
    p = randInt(-3, 1); q = randInt(p+2, 4); c = randChoice([0.25, -0.25, 0.2, -0.2]);
    const k0 = randInt(-2, 2);
    f = x => c*(x*x*x - 1.5*(p+q)*x*x + 3*p*q*x);
    const shift = k0 - Math.round(f(p));
    const g = f; f = x => g(x) + shift;
    ok = Number.isInteger(Math.round(f(p)*1000)/1000) && Math.abs(f(p) - Math.round(f(p))) < 1e-9 && Math.abs(f(q) - Math.round(f(q))) < 1e-9 && Math.abs(f(p)) <= 6 && Math.abs(f(q)) <= 6;
  } while(!ok);
  const ans = [{x:p, y:Math.round(f(p))}, {x:q, y:Math.round(f(q))}];
  return { view:{xmin:-6,xmax:6,ymin:-7,ymax:7}, curves:[{pts: sampleFn(f, -6.5, 6.5, 300)}], answers: ans,
    promptAr: "اضغط على نقطتي القيمة العظمى المحلية والصغرى المحلية:", promptEn: "Tap the relative maximum and relative minimum points:",
    ...H("القيمة العظمى المحلية: قمة التل. الصغرى المحلية: قاع الوادي.", "Relative max: top of a hill. Relative min: bottom of a valley.", "عندها يتغير المنحنى من صاعد إلى هابط أو العكس.", "The curve switches between rising and falling there.", L(ans.map(a=>`(${a.x}, ${a.y})`).join(" , ")), ans.map(a=>`(${a.x}, ${a.y})`).join(", ")) };
};
GEN.g12rate = function(tier){
  tier = clampTier(tier);
  const a = randChoice([1,-1,0.5]), c = randInt(-3,3);
  const f = x => a*x*x + c;
  let x1, x2; do { x1 = randInt(-3,1); x2 = randInt(x1+1, 3); } while(false);
  const y1 = f(x1), y2 = f(x2);
  const rate = (y2-y1)/(x2-x1);
  return { visualHtml: VIS.grid({xmin:-5,xmax:5,ymin:-6,ymax:10,W:280,H:300, paths:[{pts:sampleFn(f,-5,5,120)}], segs:[{a:[x1,y1],b:[x2,y2],cls:"sl-target"}], pts:[{x:x1,y:y1},{x:x2,y:y2}]}),
    exprHtml: `f(x) = ${a===1?"":a===-1?"−":a}x² ${c<0?"−":"+"} ${Math.abs(c)} ,  [${x1}, ${x2}]`,
    promptAr: "احسب متوسط معدل التغير للدالة على الفترة:", promptEn: "Find the average rate of change on the interval:",
    steps: [ { ar: L(`f(${x2}) − f(${x1}) = ?`), en: "", answer: y2-y1, opts:{allowNegative:true, allowDecimal:true} },
             { ar: "متوسط معدل التغير = ؟", en: "Average rate of change = ?", answer: rate, opts:{allowNegative:true, allowDecimal:true, allowFraction:true} } ],
    ...H("متوسط معدل التغير = ميل القاطع الذهبي.", "Average rate of change = slope of the gold secant.", L(`(f(${x2}) − f(${x1})) ÷ (${x2} − ${x1})`), `(f(${x2}) − f(${x1})) ÷ (${x2} − ${x1})`, L(`${fmtNum(y2-y1)} ÷ ${x2-x1} = ${fmtNum(rate)}`), `${fmtNum(y2-y1)} ÷ ${x2-x1} = ${fmtNum(rate)}`) };
};
GEN.g12compose = function(tier){
  tier = clampTier(tier);
  const a = randInt(2,4), b = randInt(-4,4), c = randInt(-3,3);
  const f = x => a*x + b, g = x => x*x + c;
  const xs = distinctInts(3, -2, 3).sort((p,q)=>p-q);
  const rows = [[{h:"x"}, ...xs.map(x=>({h:String(x)}))], [{h:"g(x)"}, ...xs.map(x=>({ans:g(x)}))], [{h:"f(g(x))"}, ...xs.map(x=>({ans:f(g(x))}))]];
  if(tier >= 2) rows.push([{h:"g(f(x))"}, ...xs.map(x=>({ans:g(f(x))}))]);
  return { blocks:[{rows}],
    visualHtml: `<div class="math-expr" dir="ltr" style="font-size:20px">f(x) = ${a}x ${b<0?"−":"+"} ${Math.abs(b)} &nbsp;&nbsp; g(x) = x² ${c<0?"−":"+"} ${Math.abs(c)}</div>`,
    promptAr: "أكمل جدول تركيب الدالتين:", promptEn: "Complete the composition table:",
    ...H("(f ∘ g)(x) = f(g(x)): احسب الداخل أولًا.", "(f ∘ g)(x) = f(g(x)): compute the inside first.", "استخدم صف g(x) لتحسب f(g(x)).", "Use the g(x) row to compute f(g(x)).", L(`x = ${xs[0]}: g = ${g(xs[0])} , f(g) = ${f(g(xs[0]))}`), `x = ${xs[0]}: g = ${g(xs[0])}, f(g) = ${f(g(xs[0]))}`) };
};
GEN.g12exp = function(tier){
  tier = clampTier(tier);
  const b = randChoice([2,3,0.5]), h = tier===1 ? 0 : randInt(-3,3), k = randInt(-3,3);
  return { fam:"exp", show: tier===3 ? "eq" : "graph", target:{b,h,k},
    params:[{k:"b",label:"b",min:0.5,max:4,step:0.5,v0:1.5,skip:[1]},{k:"h",label:"h",min:-5,max:5,step:1,v0:0},{k:"k",label:"k",min:-5,max:5,step:1,v0:0}],
    view:{xmin:-6,xmax:6,ymin:-6,ymax:8},
    ...H("y = b^(x − h) + k: خط التقارب الأفقي y = k.", "y = b^(x − h) + k: horizontal asymptote y = k.", "b > 1 ← نمو، 0 < b < 1 ← اضمحلال.", "b > 1 → growth, 0 < b < 1 → decay.", L(`b = ${b} , h = ${h} , k = ${k}`), `b = ${b}, h = ${h}, k = ${k}`) };
};
GEN.g12logform = function(tier){
  const pool = [];
  const used = new Set();
  while(pool.length < 4){
    const b = randChoice([2,3,4,5,10]), e = randInt(tier===3?-2:0, 4);
    const key = b+"_"+e; if(used.has(key)) continue; used.add(key);
    const val = Math.pow(b, e);
    const vs = e < 0 ? `1/${Math.pow(b,-e)}` : String(val);
    pool.push([`${b}<sup>${e}</sup> = ${vs}`, `log<sub>${b}</sub> ${vs} = ${e}`]);
  }
  return { ...pairsData(pool), ltr: true,
    ...H("b^y = x تكافئ log_b x = y.", "b^y = x is the same as log_b x = y.", "الأساس يبقى أساسًا، والأس يصبح قيمة اللوغاريتم.", "The base stays the base; the exponent becomes the log's value.", "مثال: 2³ = 8 ⟷ log₂ 8 = 3", "Example: 2³ = 8 ⟷ log₂ 8 = 3") };
};
GEN.g12logval = function(tier){
  tier = clampTier(tier);
  const items = [];
  const used = new Set();
  while(items.length < 4){
    const b = randChoice([2,3,5,10]), e = randInt(tier===1?1:-2, tier===1?4:5);
    const k = b+"_"+e; if(used.has(k)) continue; used.add(k);
    const arg = e < 0 ? `1/${Math.pow(b,-e)}` : String(Math.pow(b,e));
    items.push([`log<sub>${b}</sub> ${arg}`, e]);
  }
  return { blocks: [{rows: [items.map(i=>({h:i[0]})), items.map(i=>({ans:i[1]}))]}],
    promptAr: "احسب قيمة كل لوغاريتم:", promptEn: "Evaluate each logarithm:",
    ...H("log_b x يسأل: ما الأس الذي نرفع إليه b لنحصل على x؟", "log_b x asks: what power of b gives x?", "الكسور مثل 1/8 تعطي أسًا سالبًا.", "Fractions like 1/8 give negative exponents.", L(items.map(i=>i[1]).join(" , ")), items.map(i=>i[1]).join(", ")) };
};
GEN.g12logprop = function(tier){
  tier = clampTier(tier);
  const b = randChoice([2,3,5]), m = randInt(2,9), n = randInt(2,9);
  const kinds = [
    { expr:`log<sub>${b}</sub> (${m} · ${n})`, ans:[`log<sub>${b}</sub> ${m}`,"+",`log<sub>${b}</sub> ${n}`], ar:"خاصية الضرب", en:"product rule" },
    { expr:`log<sub>${b}</sub> (${m} / ${n})`, ans:[`log<sub>${b}</sub> ${m}`,"−",`log<sub>${b}</sub> ${n}`], ar:"خاصية القسمة", en:"quotient rule" },
    { expr:`log<sub>${b}</sub> ${m}<sup>${n}</sup>`, ans:[`${n}`,"·",`log<sub>${b}</sub> ${m}`], ar:"خاصية القوة", en:"power rule" }
  ];
  const k = tier===1 ? kinds[0] : randChoice(kinds);
  const pal = shuffleArr([`log<sub>${b}</sub> ${m}`, `log<sub>${b}</sub> ${n}`, "+", "−", "·", `${n}`, `${m}`]);
  const alt = k.ans[1] === "+" ? [[k.ans[2], "+", k.ans[0]]] : [];
  return { slots:3, palette: [...new Set(pal)], answers:[k.ans, ...alt], ltr:true,
    prefix: `${k.expr} =`,
    promptAr: `افكّ اللوغاريتم باستخدام ${k.ar}:`, promptEn: `Expand the logarithm using the ${k.en}:`,
    ...H("لوغاريتم الضرب = مجموع اللوغاريتمات، القسمة = الفرق، القوة = الأس × اللوغاريتم.", "Log of a product = sum, quotient = difference, power = exponent × log.", k.ar, k.en, L(k.ans.join(" ").replace(/<[^>]+>/g,"")), k.ans.join(" ").replace(/<[^>]+>/g,"")) };
};
GEN.g12expeq = function(tier){
  tier = clampTier(tier);
  const b = randChoice([2,3]), p = randChoice([2,3]);
  const base2 = Math.pow(b, p);
  const x = randInt(-2, 4);
  const c = randInt(-3,3);
  // b^(p*? ) : equation: base2^(x) = b^(p*x)  →  b^(x + c) = base2^(?) : keep simple: b^(a*x + c) = base2^(something)
  const rhsExp = x + c; // (base2)^(rhsExp) = b^(p*(x+c))
  const lhsCoef = p; // b^(p x + p c)
  return { exprHtml: `${b}<sup>${lhsCoef}x ${p*c<0?"−":"+"} ${Math.abs(p*c)}</sup> = ${base2}<sup>${rhsExp}</sup>`.replace("+ 0",""),
    promptAr: "حلّ المعادلة الأسية بتوحيد الأساسات:", promptEn: "Solve by rewriting with the same base:",
    steps: [ { ar: `اكتب ${L(base2)} كقوة للعدد ${L(b)}: الأس = ؟`, en: `Write ${base2} as a power of ${b}: exponent = ?`, answer: p },
             { ar: "x = ؟", en: "", answer: x, opts:{allowNegative:true} } ],
    ...H("إذا تساوت الأساسات تتساوى الأسس.", "Equal bases → equal exponents.", L(`${base2} = ${b}^${p}`), `${base2} = ${b}^${p}`, L(`${p}x + ${p*c} = ${p*rhsExp} ⟹ x = ${x}`), `${p}x + ${p*c} = ${p*rhsExp} → x = ${x}`) };
};
GEN.g12values = function(tier){
  tier = clampTier(tier);
  const opts = ["0","1/2","√2/2","√3/2","1"];
  const angles = tier===1 ? [0,30,90] : [0,30,45,60,90];
  const sinV = {0:"0",30:"1/2",45:"√2/2",60:"√3/2",90:"1"};
  const cosV = {0:"1",30:"√3/2",45:"√2/2",60:"1/2",90:"0"};
  const hide = new Set(shuffleArr(angles.flatMap(a=>["s"+a,"c"+a])).slice(0, tier===1 ? 4 : tier===2 ? 6 : 10));
  const rows = [[{h:"θ"}, ...angles.map(a=>({h:a+"°"}))],
    [{h:"sin θ"}, ...angles.map(a=> hide.has("s"+a) ? {ans:sinV[a], cycle:opts} : {v:sinV[a]})],
    [{h:"cos θ"}, ...angles.map(a=> hide.has("c"+a) ? {ans:cosV[a], cycle:opts} : {v:cosV[a]})]];
  return { blocks:[{rows}],
    promptAr: "أكمل جدول القيم الخاصة: اضغط على الخانة لتبدّل بين القيم.", promptEn: "Complete the special-values table: tap a box to cycle through values.",
    ...H("sin يزيد من 0 إلى 1، وcos يتناقص من 1 إلى 0.", "sin rises from 0 to 1; cos falls from 1 to 0.", "sin 30° = cos 60° = 1/2، و sin 60° = cos 30° = √3/2.", "sin 30° = cos 60° = 1/2, and sin 60° = cos 30° = √3/2.", "sin: 0, 1/2, √2/2, √3/2, 1", "sin: 0, 1/2, √2/2, √3/2, 1") };
};
GEN.g12ident = function(tier){
  tier = clampTier(tier);
  const pool = [["sin²θ + cos²θ","1"],["tan θ","sin θ / cos θ"],["1 + tan²θ","sec²θ"],["sin 2θ","2 sin θ cos θ"],["cos²θ − sin²θ","cos 2θ"],["1 / cos θ","sec θ"],["sin(−θ)","−sin θ"],["cos(90° − θ)","sin θ"],["1 + cot²θ","csc²θ"]];
  const pick = shuffleArr(tier===1 ? pool.slice(0,6) : pool).slice(0,4);
  return { ...pairsData(pick), ltr: true,
    ...H("تذكّر المتطابقة الأساسية sin²θ + cos²θ = 1.", "Remember sin²θ + cos²θ = 1.", "اقسم عليها على cos²θ أو sin²θ لتحصل على متطابقات أخرى.", "Divide it by cos²θ or sin²θ to get others.", L(pick.map(p=>p[0]+" = "+p[1]).join("   ")), pick.map(p=>p[0]+" = "+p[1]).join("   ")) };
};
GEN.g12wave = function(tier){
  tier = clampTier(tier);
  const fam = randChoice(["sin","cos"]);
  const a = randChoice(tier===1 ? [1,2,3] : [-3,-2,-1,1,2,3]), b = randChoice(tier===1 ? [1] : [1,2,3]);
  return { fam, show: tier===3 ? "eq" : "graph", target:{a,b},
    params:[{k:"a",label:"a",min:-4,max:4,step:1,v0:1,skip:[0]},{k:"b",label:"b",min:1,max:4,step:1,v0:1}],
    view:{xmin:-360,xmax:360,ymin:-4,ymax:4,xstep:90,xlabelEvery:1},
    ...H(`y = a ${fam}(bx): السعة |a|، والدورة = 360° ÷ b.`, `y = a ${fam}(bx): amplitude |a|, period = 360° ÷ b.`, "اقرأ أعلى ارتفاع للموجة (السعة)، ثم عدد الدورات بين 0° و360°.", "Read the wave's height (amplitude), then how many cycles fit in 0°–360°.", L(`a = ${a} , b = ${b}`), `a = ${a}, b = ${b}`) };
};
GEN.g12trigeq = function(tier){
  // sin x = k or cos x = k on [0°, 360°]; x-axis grid in 30° steps (1 unit = 30°)
  const kinds = [ {fn:"sin", k:0.5, sol:[30,150], kt:"1/2"}, {fn:"cos", k:0.5, sol:[60,300], kt:"1/2"}, {fn:"sin", k:-0.5, sol:[210,330], kt:"−1/2"}, {fn:"cos", k:-0.5, sol:[120,240], kt:"−1/2"}, {fn:"sin", k:1, sol:[90], kt:"1"}, {fn:"cos", k:-1, sol:[180], kt:"−1"}, {fn:"sin", k:0, sol:[0,180,360], kt:"0"} ];
  const q = randChoice(kinds);
  const f = x => (q.fn === "sin" ? Math.sin : Math.cos)(x*30*Math.PI/180) * 2; // y scaled ×2 so ±1/2 → ±1
  const tickLabels = "";
  return { view:{xmin:0,xmax:12,ymin:-3,ymax:3}, curves:[{pts: sampleFn(f, 0, 12, 240)}, {pts: [[0, q.k*2],[12, q.k*2]], cls:"c"}],
    exprHtml: `${q.fn} x = ${q.kt} ,  0° ≤ x ≤ 360°`,
    legendHtml: LTR12("x-axis: 1 unit = 30° · y-axis: 1 unit = 1/2"),
    answers: q.sol.map(s=>({x:s/30, y:q.k*2})),
    promptAr: "اضغط على كل نقطة يتقاطع فيها المنحنى مع الخط الذهبي (كل وحدة أفقية = 30°):", promptEn: "Tap every point where the curve meets the gold line (each horizontal unit = 30°):",
    ...H("الحلول هي قيم x حيث يلتقي المنحنى بالخط y = k.", "Solutions are the x-values where the curve meets y = k.", `استخدم الزاوية المرجعية ثم الربع الصحيح.`, "Use the reference angle, then the right quadrants.", L(q.sol.map(s=>s+"°").join(" , ")), q.sol.map(s=>s+"°").join(", ")) };
};
GEN.g12circle = function(tier){
  tier = clampTier(tier);
  const h = randInt(-3,3), k = randInt(-3,3), r = randInt(1, tier===1?3:4);
  return { fam:"circle", show: tier===1 ? "graph" : "eq", target:{h,k,r},
    params:[{k:"h",label:"h",min:-6,max:6,step:1,v0:0},{k:"k",label:"k",min:-6,max:6,step:1,v0:0},{k:"r",label:"r",min:1,max:6,step:1,v0:1}],
    view:{xmin:-8,xmax:8,ymin:-8,ymax:8},
    ...H("(x − h)² + (y − k)² = r²: المركز (h, k) ونصف القطر r.", "(x − h)² + (y − k)² = r²: center (h, k), radius r.", "انتبه للإشارة: (x + 2) تعني h = −2. ونصف القطر = الجذر التربيعي للعدد في الطرف الأيمن.", "Watch the sign: (x + 2) means h = −2. The radius is the square root of the right side.", L(`h = ${h} , k = ${k} , r = ${r}`), `h = ${h}, k = ${k}, r = ${r}`) };
};
GEN.g12parabola = function(tier){
  tier = clampTier(tier);
  const horiz = tier >= 2 && Math.random() < .5;
  const a = randChoice([0.5,-0.5,1,-1]), h = randInt(-3,3), k = randInt(-3,3);
  return { fam: horiz ? "parabolaH" : "parabolaV", show: tier===3 ? "eq" : "graph", target:{a,h,k},
    params:[{k:"a",label:"a",min:-2,max:2,step:0.5,v0:1,skip:[0]},{k:"h",label:"h",min:-6,max:6,step:1,v0:0},{k:"k",label:"k",min:-6,max:6,step:1,v0:0}],
    view:{xmin:-8,xmax:8,ymin:-8,ymax:8},
    ...H(horiz ? "x = a(y − k)² + h يفتح يمينًا أو يسارًا." : "y = a(x − h)² + k يفتح لأعلى أو لأسفل.", horiz ? "x = a(y − k)² + h opens left or right." : "y = a(x − h)² + k opens up or down.", "الرأس (h, k)، وإشارة a تحدد الاتجاه.", "Vertex (h, k); the sign of a sets the direction.", L(`a = ${a} , h = ${h} , k = ${k}`), `a = ${a}, h = ${h}, k = ${k}`) };
};
GEN.g12ellipse = function(tier){
  tier = clampTier(tier);
  const h = randInt(-2,2), k = randInt(-2,2);
  let a, b; do { a = randInt(1,5); b = randInt(1,5); } while(a === b);
  return { fam:"ellipse", show: tier===1 ? "graph" : "eq", target:{h,k,a,b},
    params:[{k:"h",label:"h",min:-5,max:5,step:1,v0:0},{k:"k",label:"k",min:-5,max:5,step:1,v0:0},{k:"a",label:"a",min:1,max:6,step:1,v0:1},{k:"b",label:"b",min:1,max:6,step:1,v0:1}],
    view:{xmin:-8,xmax:8,ymin:-8,ymax:8},
    ...H("(x − h)²/a² + (y − k)²/b² = 1: a نصف المحور الأفقي، b نصف الرأسي.", "(x − h)²/a² + (y − k)²/b² = 1: a = horizontal semi-axis, b = vertical.", "خذ الجذر التربيعي للمقامين لتجد a وb.", "Take the square roots of the denominators to get a and b.", L(`h = ${h} , k = ${k} , a = ${a} , b = ${b}`), `h = ${h}, k = ${k}, a = ${a}, b = ${b}`) };
};
GEN.g12identify = function(tier){
  const c = () => randInt(2,9);
  const items = [
    { html: LTR12(`x² + y² = ${c()*c()}`), bin: 1 },
    { html: LTR12(`(x − ${c()})² + (y + 1)² = ${c()}`), bin: 1 },
    { html: LTR12(`y = ${c()}x² − 3`), bin: 0 },
    { html: LTR12(`x = −(y − 2)² + ${c()}`), bin: 0 },
    { html: LTR12(`x²/${randInt(9,16)} + y²/${randInt(2,6)} = 1`), bin: 2 },
    { html: LTR12(`${c()}x² + ${c()+10}y² = ${c()*10}`), bin: 2 },
    { html: LTR12(`x²/${c()} − y²/${c()} = 1`), bin: 3 },
    { html: LTR12(`y²/${c()} − x²/${c()} = 1`), bin: 3 }
  ];
  return { items: shuffleArr(items).slice(0, 6), bins: [{ar:"قطع مكافئ", en:"parabola"}, {ar:"دائرة", en:"circle"}, {ar:"قطع ناقص", en:"ellipse"}, {ar:"قطع زائد", en:"hyperbola"}],
    ...H("انظر إلى الحدين التربيعيين x² وy².", "Look at the squared terms x² and y².", "حد واحد تربيعي ← مكافئ. معاملان متساويان ← دائرة. مختلفان بنفس الإشارة ← ناقص. إشارتان مختلفتان ← زائد.", "One squared term → parabola. Equal coefficients → circle. Different, same sign → ellipse. Opposite signs → hyperbola.", "صنّف حسب الحدود التربيعية.", "Classify by the squared terms.") };
};
