/* ===========================================================
   Maha Academy — Math Lab — Content data
   Module/machine registry + dynamic question generators.
   Unlike the Adventure games, rounds are GENERATED on the fly
   (not hand-authored) so every playthrough is different.
   =========================================================== */

const LEVEL_TITLES = [
  { min: 0,    ar: "مستكشف الرياضيات", en: "Mathematical Explorer" },
  { min: 60,   ar: "مكتشف الأنماط",     en: "Pattern Finder" },
  { min: 150,  ar: "بنّاء المعادلات",    en: "Equation Builder" },
  { min: 280,  ar: "استراتيجي الأعداد",  en: "Number Strategist" },
  { min: 450,  ar: "مهندس الدوال",       en: "Function Engineer" },
  { min: 650,  ar: "خبير النسب",         en: "Ratio Specialist" },
  { min: 900,  ar: "خبير مختبر الرياضيات", en: "Math Lab Master" }
];

function levelForXP(xp){
  let idx = 0;
  for(let i=0;i<LEVEL_TITLES.length;i++){ if(xp >= LEVEL_TITLES[i].min) idx = i; }
  return { num: idx+1, ...LEVEL_TITLES[idx] };
}

/* ---------- Modules & machines registry ---------- */

const MODULES = [
  {
    key: "algebra", titleAr: "مختبر الجبر", titleEn: "Algebra Lab", emoji: "🧪", color: "#7c5cf0",
    guideAr: "هنا تبني العبارات والمعادلات بنفسك، خطوة بخطوة!",
    guideEn: "Here you build expressions and equations yourself, step by step!",
    machines: [
      { key: "power", titleAr: "مولّد القوى", titleEn: "Power Generator", emoji: "🔋",
        descAr: "فعّل الضرب المتكرر لتكتشف ناتج القوة.", descEn: "Trigger repeated multiplication to reveal the power." },
      { key: "orderops", titleAr: "معالج ترتيب العمليات", titleEn: "Order of Operations Processor", emoji: "🧮",
        descAr: "رتّب العمليات بنفسك قبل أن تُحسب.", descEn: "Order the operations yourself before they're computed." },
      { key: "expreval", titleAr: "بانِي العبارات الجبرية", titleEn: "Expression Builder", emoji: "🔤",
        descAr: "اسمع الجملة، وابنِ العبارة الجبرية المطابقة.", descEn: "Hear the sentence, build the matching expression." },
      { key: "balance", titleAr: "غرفة موازين المعادلات", titleEn: "Equation Balance Chamber", emoji: "⚖️",
        descAr: "طبّق نفس العملية على الطرفين لتحل المعادلة.", descEn: "Apply the same operation to both sides to solve." }
    ]
  },
  {
    key: "integers", titleAr: "مفاعل الأعداد الصحيحة", titleEn: "Integer Reactor", emoji: "⚛️", color: "#17b6a7",
    guideAr: "الأزواج الصفرية، وخط الأعداد، وقواعد الإشارات — كلها هنا!",
    guideEn: "Zero pairs, the number line, and sign rules — all here!",
    machines: [
      { key: "numberline", titleAr: "خط الأعداد التفاعلي", titleEn: "Integer Number Line", emoji: "📍",
        descAr: "حرّك المؤشر بنفسك على خط الأعداد.", descEn: "Move the marker yourself along the number line." },
      { key: "absvalue", titleAr: "ماسح القيمة المطلقة", titleEn: "Absolute Value Scanner", emoji: "📏",
        descAr: "اكتشف مسافة العدد عن الصفر.", descEn: "Discover the number's distance from zero." },
      { key: "zeropairs", titleAr: "مفاعل الأزواج الصفرية", titleEn: "Zero-Pair Reactor", emoji: "♻️",
        descAr: "ألغِ الأزواج الموجبة والسالبة لتكتشف الناتج.", descEn: "Cancel positive/negative pairs to reveal the result." },
      { key: "signrules", titleAr: "مجمّع قواعد الإشارات", titleEn: "Sign Rule Combinator", emoji: "✖️",
        descAr: "اختر الإشارة أولًا، ثم احسب الناتج.", descEn: "Pick the sign first, then compute the value." }
    ]
  },
  {
    key: "functions", titleAr: "استوديو الدوال", titleEn: "Function Studio", emoji: "🧬", color: "#22d3ee",
    guideAr: "أدخل، شغّل، واكتشف القاعدة الخفية!",
    guideEn: "Input, run, and discover the hidden rule!",
    machines: [
      { key: "iomachine", titleAr: "آلة الإدخال والإخراج", titleEn: "Input/Output Machine", emoji: "🔄",
        descAr: "أدخل رقمًا وشاهد الآلة تعالجه.", descEn: "Enter a number and watch the machine process it." },
      { key: "rulefinder", titleAr: "كاشف القاعدة", titleEn: "Rule Finder", emoji: "🕵️",
        descAr: "ابنِ القاعدة الخفية من الجدول.", descEn: "Build the hidden rule from the table." },
      { key: "graphing", titleAr: "استوديو الرسم البياني", titleEn: "Graphing Studio", emoji: "📈",
        descAr: "ضع كل نقطة في مكانها الصحيح على الشبكة.", descEn: "Place each point in its correct spot on the grid." }
    ]
  },
  {
    key: "ratios", titleAr: "ورشة النسب", titleEn: "Ratio Workshop", emoji: "⚗️", color: "#f4c542",
    guideAr: "النسب، المعدلات، التناسب، والنسبة المئوية — بشكل عملي!",
    guideEn: "Ratios, rates, proportions, and percentages — hands-on!",
    machines: [
      { key: "ratiobuilder", titleAr: "بانِي النسب", titleEn: "Ratio Builder", emoji: "🧃",
        descAr: "حافظ على نفس النسبة وأنت تكبّر الكميات.", descEn: "Keep the same ratio as you scale the quantities up." },
      { key: "rategarage", titleAr: "كراج المعدلات", titleEn: "Rate Garage", emoji: "🚗",
        descAr: "احسب السرعة من المسافة والزمن.", descEn: "Compute speed from distance and time." },
      { key: "proportion", titleAr: "لوحة التناسب", titleEn: "Proportion Board", emoji: "➗",
        descAr: "أوجد القيمة المجهولة في التناسب.", descEn: "Find the unknown value in the proportion." },
      { key: "percent", titleAr: "سوق النسبة المئوية", titleEn: "Percentage Market", emoji: "🏪",
        descAr: "احسب الخصم والسعر النهائي.", descEn: "Compute the discount and the final price." }
    ]
  },
  {
    key: "arena", titleAr: "ساحة التحدي", titleEn: "Challenge Arena", emoji: "🏆", color: "#ff6f6f",
    guideAr: "تحدٍّ شامل يجمع كل ما تعلمته!",
    guideEn: "A combined challenge using everything you've learned!",
    machines: [
      { key: "mixed", titleAr: "التحدي الشامل: نواة الرياضيات", titleEn: "The Math Core Challenge", emoji: "🎯",
        descAr: "مزيج من كل الأجهزة — أظهر إتقانك!", descEn: "A mix of every machine — show your mastery!" }
    ]
  }
];

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

const GEN = {};

/* ---- Power Generator ---- */
GEN.power = function(tier){
  tier = clampTier(tier);
  const base = tier===1 ? randInt(2,5) : tier===2 ? randChoice([2,3,4,5,6,10]) : randChoice([2,3,4,5,6,7,10]);
  const exp = tier===1 ? randInt(2,3) : tier===2 ? randInt(2,4) : randInt(3,5);
  return { base, exp, correct: Math.pow(base, exp),
    hintAr: "اضرب الأساس في نفسه بعدد مرات يساوي الأس.", hintEn: "Multiply the base by itself as many times as the exponent." };
};

/* ---- Order of Operations Processor ---- */
GEN.orderops = function(tier){
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
GEN.expreval = function(tier){
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
GEN.balance = function(tier){
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
GEN.numberline = function(tier){
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
GEN.absvalue = function(tier){
  tier = clampTier(tier);
  const range = tier===1 ? 6 : tier===2 ? 9 : 12;
  let a = randInt(1, range) * randChoice([1,-1]);
  return { a, correct: Math.abs(a), min: -(range+2), max: range+2,
    hintAr: "القيمة المطلقة هي المسافة عن الصفر — احسبها بلا إشارة.", hintEn: "Absolute value is the distance from zero — always positive." };
};

/* ---- Zero-Pair Reactor ---- */
GEN.zeropairs = function(tier){
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
GEN.signrules = function(tier){
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
GEN.iomachine = function(tier){
  tier = clampTier(tier);
  const rule = buildLinearRule(tier);
  const sampleInput = randInt(1,6);
  const challengeInput = randInt(1,9);
  return { rule, stages: ruleToStages(rule), sampleInput, sampleOutput: applyRule(rule, sampleInput),
    challengeInput, challengeOutput: applyRule(rule, challengeInput),
    hintAr: "طبّق كل خطوة من القاعدة بالترتيب على الرقم المُدخل.", hintEn: "Apply each stage of the rule, in order, to the input." };
};

/* ---- Rule Finder ---- */
GEN.rulefinder = function(tier){
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
GEN.graphing = function(tier){
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
GEN.ratiobuilder = function(tier){
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
GEN.rategarage = function(tier){
  tier = clampTier(tier);
  const speed = tier===1 ? randChoice([20,30,40,50,60]) : tier===2 ? randChoice([35,45,55,65,75,85]) : randChoice([42,56,72,84,96,108]);
  const time = tier===1 ? randInt(1,4) : randInt(2,6);
  const distance = speed*time;
  return { distance, time, correct: speed, maxSpeed: 140,
    hintAr: "السرعة = المسافة ÷ الزمن.", hintEn: "Speed = distance ÷ time." };
};

/* ---- Proportion Board ---- */
GEN.proportion = function(tier){
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
GEN.percent = function(tier){
  tier = clampTier(tier);
  const item = randChoice(SHOP_ITEMS);
  const price = tier===1 ? randChoice([40,60,80,100,120]) : tier===2 ? randChoice([150,180,220,250,300]) : randChoice([225,275,340,360,420]);
  const pct = tier===1 ? randChoice([10,20,50]) : tier===2 ? randChoice([10,15,20,25,30]) : randChoice([15,20,25,30,35,40]);
  const discount = Math.round(price*pct/100);
  const final = price - discount;
  return { item, price, pct, discount, final,
    hintAr: "الخصم = السعر × (النسبة ÷ 100). السعر النهائي = السعر − الخصم.", hintEn: "Discount = price × (percent ÷ 100). Final price = price − discount." };
};
