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
   Grade 6 content (الصف السادس الابتدائي) — first term
   =========================================================== */

const GRADE = {"progressKey": "mahaMathLabProgress_g6_v1", "ar": "الصف السادس الابتدائي", "en": "Grade 6"};

/* Grade 6, term 1 chapters: الجبر: الأنماط العددية والدوال · الإحصاء والتمثيلات البيانية ·
   العمليات على الكسور العشرية · الكسور الاعتيادية والعشرية · القياس: الطول والكتلة والسعة */

const LEVEL_TITLES = [
  { min: 0,   ar: "مستكشف العوامل", en: "Factor Explorer" },
  { min: 60,  ar: "سيد الأسس", en: "Exponent Master" },
  { min: 150, ar: "محلل البيانات", en: "Data Analyst" },
  { min: 280, ar: "مهندس الكسور العشرية", en: "Decimal Engineer" },
  { min: 450, ar: "مبسّط الكسور", en: "Fraction Simplifier" },
  { min: 650, ar: "خبير التحويلات", en: "Conversion Expert" },
  { min: 900, ar: "خبير مختبر الرياضيات", en: "Math Lab Master" }
];

const MODULES = [
  {
    key: "algebra", titleAr: "مختبر الجبر", titleEn: "Algebra Lab", emoji: "🧪", color: "#7c5cf0",
    guideAr: "العوامل الأولية، والقوى، وترتيب العمليات، والدوال!", guideEn: "Prime factors, powers, order of operations, and functions!",
    machines: [
      { key: "g6tree", type: "factortree", titleAr: "شجرة العوامل", titleEn: "Factor Tree", emoji: "🌳", descAr: "حلّل العدد إلى عوامله الأولية.", descEn: "Break a number into prime factors." },
      { key: "power", titleAr: "مولّد القوى", titleEn: "Power Generator", emoji: "🔋", descAr: "فعّل الضرب المتكرر لتكتشف ناتج القوة.", descEn: "Trigger repeated multiplication to find the power." },
      { key: "orderops", titleAr: "معالج ترتيب العمليات", titleEn: "Order of Operations Processor", emoji: "🧮", descAr: "رتّب العمليات قبل أن تُحسب.", descEn: "Order the operations before computing." },
      { key: "rulefinder", titleAr: "كاشف قاعدة الدالة", titleEn: "Function Rule Finder", emoji: "🕵️", descAr: "ابنِ قاعدة الدالة من الجدول.", descEn: "Build the function rule from the table." }
    ]
  },
  {
    key: "stats", titleAr: "مختبر الإحصاء", titleEn: "Statistics Lab", emoji: "📊", color: "#17b6a7",
    guideAr: "مثّل البيانات، وأوجد المتوسط والوسيط والمدى!", guideEn: "Graph data and find the mean, median, and range!",
    machines: [
      { key: "g6bars", type: "barchart", titleAr: "استوديو الأعمدة", titleEn: "Bar Graph Studio", emoji: "📊", descAr: "مثّل البيانات بالأعمدة.", descEn: "Show data as a bar graph." },
      { key: "g6dots", type: "barchart", titleAr: "التمثيل بالنقاط", titleEn: "Dot Plot", emoji: "⚫", descAr: "مثّل البيانات بالنقاط ثم أوجد المنوال.", descEn: "Make a dot plot, then find the mode." },
      { key: "g6mean", type: "leveler", titleAr: "آلة المتوسط الحسابي", titleEn: "Mean Machine", emoji: "🏗️", descAr: "سوِّ الأبراج لتجد المتوسط.", descEn: "Level the towers to find the mean." },
      { key: "g6median", type: "ordercards", titleAr: "كاشف الوسيط", titleEn: "Median Finder", emoji: "🎯", descAr: "رتّب البيانات ثم أوجد الوسيط.", descEn: "Order the data, then find the median." }
    ]
  },
  {
    key: "decimals", titleAr: "مختبر الكسور العشرية", titleEn: "Decimals Lab", emoji: "🔟", color: "#22d3ee",
    guideAr: "قرّب واجمع واضرب واقسم الكسور العشرية!", guideEn: "Round, add, multiply, and divide decimals!",
    machines: [
      { key: "g6round", type: "numline", titleAr: "مقرّب الكسور العشرية", titleEn: "Decimal Rounder", emoji: "🎯", descAr: "قرّب إلى أقرب جزء من عشرة.", descEn: "Round to the nearest tenth." },
      { key: "g6decadd", type: "columncalc", titleAr: "جمع وطرح الكسور العشرية", titleEn: "Decimal Add & Subtract", emoji: "➕", descAr: "رتّب الفواصل واحسب.", descEn: "Line up the points and compute." },
      { key: "g6decmul", type: "keypadvisual", titleAr: "شبكة ضرب الكسور العشرية", titleEn: "Decimal Multiplication Grid", emoji: "🟨", descAr: "استخدم شبكة المئة لضرب الكسور العشرية.", descEn: "Use a hundred grid to multiply decimals." },
      { key: "g6decdiv", type: "decimalslider", titleAr: "الضرب والقسمة على 10 و100", titleEn: "× and ÷ by 10 and 100", emoji: "↔️", descAr: "حرّك الفاصلة للضرب أو القسمة.", descEn: "Slide the point to multiply or divide." }
    ]
  },
  {
    key: "fracmeas", titleAr: "مختبر الكسور والقياس", titleEn: "Fractions & Measurement Lab", emoji: "📏", color: "#ff6f6f",
    guideAr: "بسّط الكسور، وحوّل بين الكسور والعشرية، وحوّل الوحدات!", guideEn: "Simplify fractions, convert fractions ↔ decimals, and convert units!",
    machines: [
      { key: "g6simplify", type: "fraction", titleAr: "مبسّط الكسور", titleEn: "Fraction Simplifier", emoji: "✂️", descAr: "اكتب الكسر في أبسط صورة.", descEn: "Write the fraction in simplest form." },
      { key: "g6gcf", type: "gridfill", titleAr: "القاسم والمضاعف", titleEn: "GCF & LCM", emoji: "🔗", descAr: "أوجد (ق.م.أ) و(م.م.أ).", descEn: "Find the GCF and LCM." },
      { key: "g6fracdec", type: "matchpairs", titleAr: "كسور ↔ كسور عشرية", titleEn: "Fractions ↔ Decimals", emoji: "🔄", descAr: "صِل الكسر بالكسر العشري المساوي له.", descEn: "Match each fraction to its decimal." },
      { key: "g6metric", type: "decimalslider", titleAr: "محوّل الوحدات المترية", titleEn: "Metric Converter", emoji: "📐", descAr: "حوّل بين الوحدات بتحريك الفاصلة.", descEn: "Convert units by sliding the point." }
    ]
  },
  {
    key: "arena", titleAr: "ساحة التحدي", titleEn: "Challenge Arena", emoji: "🏆", color: "#f4c542",
    guideAr: "مزيج من كل الأجهزة!", guideEn: "A mix of every machine!",
    machines: [ { key: "mixed", titleAr: "التحدي الشامل", titleEn: "The Grand Challenge", emoji: "🎯", descAr: "مزيج من كل الأجهزة — أظهر إتقانك!", descEn: "A mix of every machine — show your mastery!" } ]
  }
];

const ARENA_POOL = ["g6tree","power","orderops","rulefinder","g6mean","g6median","g6round","g6decadd","g6decmul","g6decdiv","g6simplify","g6gcf","g6fracdec","g6metric"];

const GEN = {};

GEN.g6tree = function(tier){
  tier = clampTier(tier);
  const pool = tier===1 ? [12,18,20,28,30,45,50] : tier===2 ? [36,40,48,54,60,72,84,90] : [96,108,120,126,144,150,168,180];
  const n = randChoice(pool);
  const f = []; let m = n; for(let p=2; p<=m; p++) while(m%p===0){ f.push(p); m/=p; }
  return { n,
    ...H("العدد الأولي له عاملان فقط: 1 والعدد نفسه.", "A prime has exactly two factors: 1 and itself.", "ابدأ بأصغر عدد أولي يقسم العدد (2، 3، 5…).", "Start with the smallest prime that divides it (2, 3, 5…).", L(`${n} = ${f.join(" × ")}`), `${n} = ${f.join(" × ")}`) };
};
GEN.power = BASE.power;
GEN.orderops = BASE.orderops;
GEN.rulefinder = function(tier){
  const r = BASE.rulefinder(Math.min(2, clampTier(tier)));
  return r;
};

const G6_CATS = [
  [{ar:"كرة القدم",en:"football",emoji:"⚽"},{ar:"السباحة",en:"swimming",emoji:"🏊"},{ar:"السلة",en:"basketball",emoji:"🏀"},{ar:"الجري",en:"running",emoji:"🏃"}],
  [{ar:"قصص",en:"stories",emoji:"📖"},{ar:"علوم",en:"science",emoji:"🔬"},{ar:"تاريخ",en:"history",emoji:"🏛️"},{ar:"شعر",en:"poetry",emoji:"✒️"}]
];
GEN.g6bars = function(tier){
  tier = clampTier(tier);
  const step = tier===1 ? 2 : 5;
  const cats = randChoice(G6_CATS).map(c => Object.assign({}, c, {value: step*randInt(1, tier===1?8:8)}));
  const tot = cats.reduce((s,c)=>s+c.value,0);
  return { cats, source: "table", max: step*8, step, style: "bars",
    question: { ar: "ما مجموع كل الأصوات؟", en: "What is the total of all the votes?", answer: tot },
    ...H(`كل ضغطة = ${L(step)} (مقياس الرسم).`, `Each press = ${step} (the scale).`, "اجعل طول كل عمود يطابق الجدول.", "Match each bar to the table.", `المجموع = ${L(tot)}`, `Total = ${tot}`) };
};
GEN.g6dots = function(tier){
  tier = clampTier(tier);
  const xs = [1,2,3,4,5];
  let counts;
  do { counts = xs.map(()=>randInt(0, tier===1?3:5)); } while(counts.filter(c=>c===Math.max(...counts)).length > 1 || counts.reduce((a,b)=>a+b,0) < 5);
  const list = shuffleArr(xs.flatMap((x,i)=>Array.from({length:counts[i]}).map(()=>x)));
  const mode = xs[counts.indexOf(Math.max(...counts))];
  return { cats: xs.map((x,i)=>({ar:String(x), en:String(x), value: counts[i]})), source: "list", list, max: 6, step: 1, style: "dots",
    question: { ar: "ما المنوال (القيمة الأكثر تكرارًا)؟", en: "What is the mode (most frequent value)?", answer: mode },
    promptAr: "عدد الكتب التي قرأها كل طالب. مثّلها بالنقاط:", promptEn: "Books each student read. Make a dot plot:",
    ...H("لكل قيمة في القائمة ضع نقطة فوق العدد نفسه.", "For each value in the list, put a dot above that number.", "عُدّ كم مرة يظهر كل عدد.", "Count how many times each number appears.", `المنوال = ${L(mode)}`, `Mode = ${mode}`) };
};
GEN.g6mean = function(tier){
  tier = clampTier(tier);
  const n = tier===1 ? 3 : tier===2 ? 4 : 5;
  const mean = randInt(3, 7);
  let towers;
  do { towers = Array.from({length:n}).map(()=>randInt(1, 10)); const s = towers.reduce((a,b)=>a+b,0); const diff = mean*n - s; towers[0] += diff; } while(towers.some(t=>t<1 || t>11) || towers.every(t=>t===mean));
  return { towers,
    ...H("المتوسط = المجموع ÷ عدد القيم.", "Mean = total ÷ number of values.", "انقل المكعبات من الأبراج الطويلة إلى القصيرة.", "Move cubes from tall towers to short ones.", L(`(${towers.join(" + ")}) ÷ ${n} = ${mean}`), `(${towers.join(" + ")}) ÷ ${n} = ${mean}`) };
};
GEN.g6median = function(tier){
  tier = clampTier(tier);
  const n = tier===3 ? 6 : 5;
  const vals = distinctInts(n, 10, 60);
  const sorted = vals.slice().sort((a,b)=>a-b);
  const med = n%2 ? sorted[(n-1)/2] : (sorted[n/2-1]+sorted[n/2])/2;
  return { cards: vals.map(v=>`<span dir="ltr">${v}</span>`), order: orderIdx(vals), ltr: true,
    firstAr: "الأصغر", firstEn: "least", lastAr: "الأكبر", lastEn: "greatest",
    promptAr: "رتّب البيانات من الأصغر إلى الأكبر:", promptEn: "Order the data from least to greatest:",
    after: { ar: n%2 ? "ما الوسيط (القيمة في المنتصف)؟" : "ما الوسيط؟ (متوسط القيمتين في المنتصف)", en: n%2 ? "What is the median (the middle value)?" : "What is the median? (mean of the two middle values)", answer: med, opts:{allowDecimal:true} },
    ...H("الوسيط هو القيمة في منتصف البيانات المرتّبة.", "The median is the middle of the ordered data.", n%2 ? "مع 5 قيم: الوسيط هو الثالثة." : "مع 6 قيم: اجمع الثالثة والرابعة واقسم على 2.", n%2 ? "With 5 values, the median is the 3rd." : "With 6 values: add the 3rd and 4th, divide by 2.", `الوسيط = ${L(med)}`, `Median = ${med}`) };
};
GEN.g6round = function(tier){
  tier = clampTier(tier);
  const w = randInt(0, 9);
  const t0 = randInt(0, 9);
  let hund; do { hund = randInt(1,9); } while(tier===1 && hund === 5);
  const n = Number((w + t0/10 + hund/100).toFixed(2));
  const lo = Number((w + t0/10).toFixed(1));
  const t = Number((Math.round(n*10)/10).toFixed(1));
  return { mode: "tap", min: lo, max: Number((lo+0.1).toFixed(1)), step: 0.01, dp: 2, labelEvery: 10, target: t, marker: n, markerLabel: String(n),
    showHtml: `<span dir="ltr">${n} → ?</span><span class="en-badge">nearest tenth</span>`,
    promptAr: `قرّب ${L(n)} إلى أقرب جزء من عشرة: اضغط على الطرف الأقرب.`, promptEn: `Round ${n} to the nearest tenth: tap the closer end.`,
    ...H("انظر إلى رقم أجزاء المئة.", "Look at the hundredths digit.", "5 أو أكثر ← للأعلى، أقل من 5 ← للأسفل.", "5 or more → up; less than 5 → down.", `${L(n)} ← ${L(fmtNum(t,1))}`, `${n} → ${fmtNum(t,1)}`) };
};
GEN.g6decadd = function(tier){
  tier = clampTier(tier);
  const sub = Math.random() < .5;
  const d1 = tier===1 ? 1 : 2;
  let a = randInt(100, 9999)/Math.pow(10, d1), b = randInt(10, 999)/Math.pow(10, tier===3 ? 1 : d1);
  if(sub && b > a) [a,b] = [b,a];
  const dp = 2;
  const res = Number((sub ? a-b : a+b).toFixed(dp));
  return { nums: [a,b], op: sub?"−":"+", result: res, dp,
    ...H("رتّب الفواصل، وأضف أصفارًا إذا لزم.", "Line up the points; add zeros if needed.", "احسب كما في الأعداد الكلية.", "Compute like whole numbers.", L(`${a} ${sub?"−":"+"} ${b} = ${res}`), `${a} ${sub?"−":"+"} ${b} = ${res}`) };
};
function hundredGridSvg(a, b){ // a, b in tenths: a columns shaded, b rows shaded
  const S = 18; let s = `<svg width="${S*10+4}" height="${S*10+4}" viewBox="-2 -2 ${S*10+4} ${S*10+4}">`;
  for(let i=0;i<10;i++) for(let j=0;j<10;j++){
    const inA = i < a, inB = j < b;
    const fill = inA && inB ? "rgba(244,197,66,.9)" : inA ? "rgba(34,211,238,.3)" : inB ? "rgba(155,130,245,.3)" : "none";
    s += `<rect x="${i*S}" y="${j*S}" width="${S}" height="${S}" fill="${fill}" stroke="#8b93c7" stroke-width="1"/>`;
  }
  return s + `</svg>`;
}
GEN.g6decmul = function(tier){
  tier = clampTier(tier);
  if(tier === 3){
    const a = randInt(11, 49)/10, b = randInt(2, 9);
    const res = Number((a*b).toFixed(1));
    return { exprHtml: `${a} × ${b} = ?`, answer: res, opts: {allowDecimal:true},
      promptAr: "اضرب كأعداد كلية، ثم ضع الفاصلة:", promptEn: "Multiply as whole numbers, then place the point:",
      steps: [ { ar: L(`${Math.round(a*10)} × ${b} = ?`), en: "", answer: Math.round(a*10)*b }, { ar: "الآن ضع الفاصلة (رقم واحد بعدها):", en: "Now place the point (one digit after it):", answer: res, opts:{allowDecimal:true} } ],
      ...H("عدد الأرقام بعد الفاصلة في الناتج = مجموعها في العاملين.", "Decimal places in the answer = total decimal places in the factors.", L(`${Math.round(a*10)} × ${b} = ${Math.round(a*10)*b}`), `${Math.round(a*10)} × ${b} = ${Math.round(a*10)*b}`, L(`${a} × ${b} = ${res}`), `${a} × ${b} = ${res}`) };
  }
  const a = randInt(1,9), b = randInt(1,9);
  return { visualHtml: hundredGridSvg(a,b), exprHtml: `0.${a} × 0.${b} = ?`, answer: Number((a*b/100).toFixed(2)), opts: {allowDecimal:true},
    promptAr: "المربعات الذهبية (منطقة التداخل) هي ناتج الضرب. كل مربع صغير = 0.01:", promptEn: "The gold squares (the overlap) are the product. Each small square = 0.01:",
    ...H("عُدّ المربعات الذهبية.", "Count the gold squares.", `${L(a+" × "+b+" = "+a*b)} مربعًا صغيرًا`, `${a} × ${b} = ${a*b} small squares`, L(`0.${a} × 0.${b} = ${fmtNum(a*b/100,2)}`), `0.${a} × 0.${b} = ${fmtNum(a*b/100,2)}`) };
};
GEN.g6decdiv = function(tier){
  tier = clampTier(tier);
  const digits = String(randChoice([35, 472, 128, 9, 64, 305, 1256]));
  const e0 = -randInt(0, Math.min(2, digits.length-1));
  const k = randChoice(tier===1 ? [1] : [1,2,3]);
  const mul = Math.random() < .5;
  const v0 = Number(digits)*Math.pow(10, e0);
  const target = Number((mul ? v0*Math.pow(10,k) : v0/Math.pow(10,k)).toFixed(8));
  const f = Math.pow(10,k);
  return { mode: "convert", digits, e0, target,
    questionHtml: `<span dir="ltr">${fmtNum(v0,6)} ${mul?"×":"÷"} ${f} = ?</span>`,
    promptAr: "حرّك الفاصلة العشرية لتحسب:", promptEn: "Slide the decimal point to compute:",
    ...H(`${mul?"الضرب":"القسمة"} على ${L(f)} ينقل الفاصلة ${L(k)} ${k===1?"منزلة":"منازل"}.`, `${mul?"Multiplying":"Dividing"} by ${f} moves the point ${k} place(s).`, mul ? "الضرب ← الفاصلة تتحرك لليمين (العدد يكبر)." : "القسمة ← الفاصلة تتحرك لليسار (العدد يصغر).", mul ? "Multiply → the point moves right (bigger)." : "Divide → the point moves left (smaller).", L(`${fmtNum(v0,6)} ${mul?"×":"÷"} ${f} = ${fmtNum(target,8)}`), `${fmtNum(v0,6)} ${mul?"×":"÷"} ${f} = ${fmtNum(target,8)}`) };
};
GEN.g6simplify = function(tier){
  tier = clampTier(tier);
  const b0 = randChoice(tier===1 ? [2,3,4] : [2,3,4,5]);
  let a0; do { a0 = randInt(1, b0-1); } while(gcd(a0,b0) !== 1);
  const k = randChoice(tier===1 ? [2] : [2,3]);
  const a = a0*k, b = b0*k;
  return { mode: "equiv", a, b, targetDen: b0, startDen: b, shape: tier===3 ? "circle" : "bar",
    promptAr: `بسّط ${L(a+"/"+b)} إلى أبسط صورة: غيّر عدد الأجزاء إلى ${L(b0)} ثم لوّن نفس المساحة.`, promptEn: `Simplify ${a}/${b}: change the parts to ${b0}, then shade the same amount.`,
    ...H("أبسط صورة: لا يوجد عامل مشترك بين البسط والمقام غير 1.", "Simplest form: numerator and denominator share no factor but 1.", `اقسم البسط والمقام على ${L(k)}.`, `Divide top and bottom by ${k}.`, L(`${a}/${b} = ${a0}/${b0}`), `${a}/${b} = ${a0}/${b0}`) };
};
GEN.g6gcf = function(tier){
  tier = clampTier(tier);
  const g = randInt(2, tier===1?4:6);
  let p, q; do { p = randInt(1,5); q = randInt(2,6); } while(gcd(p,q) !== 1 || p === q);
  const a = g*p, b = g*q;
  const multsA = [1,2,3,4,5,6].map(i=>a*i), multsB = [1,2,3,4,5,6].map(i=>b*i);
  const L0 = lcm(a,b);
  const rows = [[{h:String(a)}, ...multsA.map((m,i)=> i<2 ? {v:String(m)} : {ans:m})], [{h:String(b)}, ...multsB.map((m,i)=> i<2 ? {v:String(m)} : {ans:m})]];
  return { blocks: [{label:"المضاعفات / multiples", rows}, {op:"→"}, {rows:[[{h:"ق.م.أ GCF"},{h:"م.م.أ LCM"}],[{ans:g},{ans:L0}]]}], neg: false,
    promptAr: `أكمل مضاعفات ${L(a)} و${L(b)}، ثم أوجد القاسم المشترك الأكبر والمضاعف المشترك الأصغر:`, promptEn: `Complete the multiples of ${a} and ${b}, then find the GCF and LCM:`,
    ...H("م.م.أ = أول مضاعف مشترك. ق.م.أ = أكبر عدد يقسم العددين.", "LCM = first common multiple. GCF = largest number dividing both.", `عوامل ${L(a)}: ${L(Array.from({length:a}).map((_,i)=>i+1).filter(d=>a%d===0).join(","))}`, `Factors of ${a}: ${Array.from({length:a}).map((_,i)=>i+1).filter(d=>a%d===0).join(",")}`, `ق.م.أ = ${L(g)} ، م.م.أ = ${L(L0)}`, `GCF = ${g}, LCM = ${L0}`) };
};
GEN.g6fracdec = function(tier){
  tier = clampTier(tier);
  const pool = tier===1 ? [[1,2],[1,4],[3,4],[1,5],[2,5],[1,10]] : [[1,4],[3,4],[3,5],[4,5],[1,8],[3,8],[7,10],[3,20],[9,25],[1,20]];
  const pick = shuffleArr(pool).slice(0,4);
  const pairs = pick.map(([n,d]) => [fracHtml(n,d), `<span dir="ltr">${fmtNum(n/d,3)}</span>`]);
  return { ...pairsData(pairs),
    ...H("اجعل المقام 10 أو 100 أو 1000 ثم اكتبه عشريًا.", "Make the denominator 10, 100, or 1000, then write it as a decimal.", "أو اقسم البسط على المقام.", "Or divide the numerator by the denominator.", L(pick.map(([n,d])=>`${n}/${d}=${fmtNum(n/d,3)}`).join("  ")), pick.map(([n,d])=>`${n}/${d}=${fmtNum(n/d,3)}`).join("  ")) };
};
GEN.g6metric = function(tier){
  tier = clampTier(tier);
  const convs = [
    {fromAr:"م", toAr:"سم", from:"m", to:"cm", k:2}, {fromAr:"سم", toAr:"م", from:"cm", to:"m", k:-2},
    {fromAr:"كم", toAr:"م", from:"km", to:"m", k:3}, {fromAr:"م", toAr:"كم", from:"m", to:"km", k:-3},
    {fromAr:"كجم", toAr:"جم", from:"kg", to:"g", k:3}, {fromAr:"جم", toAr:"كجم", from:"g", to:"kg", k:-3},
    {fromAr:"لتر", toAr:"مل", from:"L", to:"mL", k:3}, {fromAr:"مل", toAr:"لتر", from:"mL", to:"L", k:-3},
    {fromAr:"سم", toAr:"مم", from:"cm", to:"mm", k:1}, {fromAr:"مم", toAr:"سم", from:"mm", to:"cm", k:-1}
  ];
  const c = randChoice(tier===1 ? convs.filter(x=>Math.abs(x.k)<=2) : convs);
  const digits = String(randChoice([25, 4, 125, 36, 7, 450, 1500, 85]));
  const e0 = c.k > 0 ? -randInt(0, Math.min(2, digits.length-1)) : 0;
  const v0 = Number(digits)*Math.pow(10, e0);
  const target = Number((v0*Math.pow(10, c.k)).toFixed(8));
  return { mode: "convert", digits, e0, target,
    questionHtml: `<span dir="ltr">${fmtNum(v0,6)} ${c.from} = ? ${c.to}</span><span class="en-badge">${fmtNum(v0,6)} ${c.fromAr} = ؟ ${c.toAr}</span>`,
    promptAr: "حوّل الوحدة بتحريك الفاصلة العشرية:", promptEn: "Convert the unit by sliding the decimal point:",
    ...H("من وحدة كبيرة إلى صغيرة ← نضرب (العدد يكبر). من صغيرة إلى كبيرة ← نقسم.", "Big unit → small unit: multiply. Small → big: divide.", `${c.k>0?"اضرب":"اقسم"} على ${L(Math.pow(10, Math.abs(c.k)))}`, `${c.k>0?"Multiply":"Divide"} by ${Math.pow(10, Math.abs(c.k))}`, L(`${fmtNum(v0,6)} ${c.from} = ${fmtNum(target,8)} ${c.to}`), `${fmtNum(v0,6)} ${c.from} = ${fmtNum(target,8)} ${c.to}`) };
};
