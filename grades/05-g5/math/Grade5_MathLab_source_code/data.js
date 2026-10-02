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
   Grade 5 content (الصف الخامس الابتدائي) — first term
   =========================================================== */

const GRADE = {"progressKey": "mahaMathLabProgress_g5_v1", "ar": "الصف الخامس الابتدائي", "en": "Grade 5"};

/* Grade 5, term 1 chapters: القيمة المنزلية (حتى البلايين والأجزاء من ألف) · الجمع والطرح ·
   الضرب · القسمة · العبارات والمعادلات الجبرية · الكسور الاعتيادية */

const LEVEL_TITLES = [
  { min: 0,   ar: "مستكشف الكسور العشرية", en: "Decimal Explorer" },
  { min: 60,  ar: "مقرّب ماهر", en: "Skilled Rounder" },
  { min: 150, ar: "مهندس الضرب", en: "Multiplication Engineer" },
  { min: 280, ar: "بطل القسمة", en: "Division Hero" },
  { min: 450, ar: "بنّاء العبارات", en: "Expression Builder" },
  { min: 650, ar: "خبير الكسور", en: "Fraction Expert" },
  { min: 900, ar: "خبير مختبر الرياضيات", en: "Math Lab Master" }
];

const MODULES = [
  {
    key: "place", titleAr: "محطة القيمة المنزلية والكسور العشرية", titleEn: "Place Value & Decimals", emoji: "🔟", color: "#7c5cf0",
    guideAr: "الأجزاء من عشرة ومن مئة ومن ألف!", guideEn: "Tenths, hundredths, and thousandths!",
    machines: [
      { key: "g5dec", type: "placevalue", titleAr: "بنّاء الكسور العشرية", titleEn: "Decimal Builder", emoji: "🧱", descAr: "كوّن كسرًا عشريًا بالأقراص.", descEn: "Build a decimal with discs." },
      { key: "g5line", type: "numline", titleAr: "خط الكسور العشرية", titleEn: "Decimal Number Line", emoji: "📍", descAr: "ضع الكسر العشري على خط الأعداد.", descEn: "Place the decimal on the number line." },
      { key: "g5order", type: "ordercards", titleAr: "مرتّب الكسور العشرية", titleEn: "Decimal Sorter", emoji: "📶", descAr: "قارن الكسور العشرية ورتّبها.", descEn: "Compare and order decimals." }
    ]
  },
  {
    key: "ops", titleAr: "محطة الجمع والطرح والضرب", titleEn: "Add, Subtract & Multiply", emoji: "✖️", color: "#17b6a7",
    guideAr: "اجمع واطرح الكسور العشرية، واضرب بالتجزئة!", guideEn: "Add and subtract decimals, and multiply by splitting!",
    machines: [
      { key: "g5decadd", type: "columncalc", titleAr: "جمع وطرح الكسور العشرية", titleEn: "Decimal Add & Subtract", emoji: "➕", descAr: "رتّب الفواصل ثم احسب.", descEn: "Line up the points, then compute." },
      { key: "g5dist", type: "array", titleAr: "خاصية التوزيع", titleEn: "Distributive Property", emoji: "✂️", descAr: "جزّئ المصفوفة لتضرب ذهنيًا.", descEn: "Split the array to multiply mentally." },
      { key: "g5area", type: "gridfill", titleAr: "الضرب في عدد من رقمين", titleEn: "Multiply by Two Digits", emoji: "🟦", descAr: "استخدم نموذج المساحة.", descEn: "Use the area model." }
    ]
  },
  {
    key: "divalg", titleAr: "محطة القسمة والجبر", titleEn: "Division & Algebra", emoji: "➗", color: "#22d3ee",
    guideAr: "القسمة والباقي، والعبارات، وترتيب العمليات، والمعادلات!", guideEn: "Division and remainders, expressions, order of operations, and equations!",
    machines: [
      { key: "g5share", type: "keypadvisual", titleAr: "آلة التوزيع بالتساوي", titleEn: "Fair Share Machine", emoji: "🍬", descAr: "وزّع بالتساوي: ناتج القسمة والباقي.", descEn: "Share equally: quotient and remainder." },
      { key: "g5expr", type: "builder", titleAr: "مترجم العبارات", titleEn: "Expression Translator", emoji: "🔤", descAr: "حوّل الجملة إلى عبارة جبرية.", descEn: "Turn words into an algebraic expression." },
      { key: "orderops", titleAr: "معالج ترتيب العمليات", titleEn: "Order of Operations Processor", emoji: "🧮", descAr: "رتّب العمليات قبل أن تُحسب.", descEn: "Order the operations before computing." },
      { key: "balance", titleAr: "ميزان المعادلات", titleEn: "Equation Balance", emoji: "⚖️", descAr: "حلّ معادلات الجمع والطرح والضرب.", descEn: "Solve addition, subtraction and multiplication equations." }
    ]
  },
  {
    key: "fractions", titleAr: "محطة الكسور", titleEn: "Fractions Station", emoji: "🍕", color: "#ff6f6f",
    guideAr: "الكسور غير الفعلية، والأعداد الكسرية، والتقريب!", guideEn: "Improper fractions, mixed numbers, and rounding!",
    machines: [
      { key: "g5shade", type: "fraction", titleAr: "ملوّن الأعداد الكسرية", titleEn: "Mixed Number Painter", emoji: "🖌️", descAr: "لوّن الأجزاء لتمثّل العدد الكسري.", descEn: "Shade parts to show a mixed number." },
      { key: "g5read", type: "fraction", titleAr: "قارئ الكسور غير الفعلية", titleEn: "Improper Fraction Reader", emoji: "🔍", descAr: "اكتب الكسر الذي يمثله النموذج.", descEn: "Write the fraction the model shows." },
      { key: "g5fline", type: "numline", titleAr: "الكسور على خط الأعداد", titleEn: "Fractions on the Line", emoji: "📏", descAr: "ضع العدد الكسري على خط الأعداد.", descEn: "Place the mixed number on the line." },
      { key: "g5roundf", type: "sortbins", titleAr: "تقريب الكسور", titleEn: "Rounding Fractions", emoji: "🎯", descAr: "قريب من 0 أم من ½ أم من 1؟", descEn: "Close to 0, ½, or 1?" }
    ]
  },
  {
    key: "arena", titleAr: "ساحة التحدي", titleEn: "Challenge Arena", emoji: "🏆", color: "#f4c542",
    guideAr: "مزيج من كل الأجهزة!", guideEn: "A mix of every machine!",
    machines: [ { key: "mixed", titleAr: "التحدي الشامل", titleEn: "The Grand Challenge", emoji: "🎯", descAr: "مزيج من كل الأجهزة — أظهر إتقانك!", descEn: "A mix of every machine — show your mastery!" } ]
  }
];

const ARENA_POOL = ["g5dec","g5line","g5order","g5decadd","g5dist","g5area","g5share","g5expr","orderops","balance","g5shade","g5read","g5fline","g5roundf"];

const GEN = {};

GEN.g5dec = function(tier){
  tier = clampTier(tier);
  const places = [{ar:"آحاد", en:"ones", val:1}, {ar:"أجزاء من عشرة", en:"tenths", val:0.1}, {ar:"أجزاء من مئة", en:"hundredths", val:0.01}];
  if(tier === 3) places.push({ar:"أجزاء من ألف", en:"thousandths", val:0.001});
  if(tier >= 2) places.unshift({ar:"عشرات", en:"tens", val:10});
  const dp = tier===3 ? 3 : 2;
  const counts = places.map((p,i)=> i===0 ? randInt(1,9) : randInt(0,9));
  const target = Number(counts.reduce((s,c,i)=>s + c*places[i].val, 0).toFixed(dp));
  const read = Math.random() < .3;
  return { mode: read ? "read" : "build", target, counts, places, dp,
    ...H("كل رقم بعد الفاصلة يمثّل منزلة أصغر بعشر مرات.", "Each digit after the point is a place ten times smaller.", "الرقم الأول بعد الفاصلة = أجزاء من عشرة، والثاني = أجزاء من مئة.", "First digit after the point = tenths, second = hundredths.",
         places.map((p,i)=>`${p.ar}: ${L(counts[i])}`).join("، "), places.map((p,i)=>`${p.en}: ${counts[i]}`).join(", ")) };
};
GEN.g5line = function(tier){
  tier = clampTier(tier);
  if(tier === 1){ const t = randInt(1,9)/10; return { mode:"tap", min:0, max:1, step:0.1, dp:1, labelEvery:5, target:t, showHtml:`<span dir="ltr">${t}</span>`,
    ...H("المسافة من 0 إلى 1 مقسّمة إلى 10 أجزاء.", "0 to 1 is split into 10 parts.", `${L(t)} = ${L(Math.round(t*10))} أجزاء من عشرة`, `${t} = ${Math.round(t*10)} tenths`, `${L(Math.round(t*10))} خطوات من الصفر`, `${Math.round(t*10)} steps from zero`) }; }
  const a = randInt(0,8)/10;
  const t = Number((a + randInt(1,9)/100).toFixed(2));
  return { mode:"tap", min:a, max:Number((a+0.1).toFixed(1)), step:0.01, dp:2, labelEvery:5, target:t, showHtml:`<span dir="ltr">${t}</span>`,
    ...H("هذا الجزء من خط الأعداد مقسّم إلى أجزاء من مئة.", "This part of the line is split into hundredths.", `ابدأ من ${L(a)} وتحرك ${L(Math.round((t-a)*100))} خطوات.`, `Start at ${a} and move ${Math.round((t-a)*100)} steps.`, `${L(t)}`, `${t}`) };
};
GEN.g5order = function(tier){
  tier = clampTier(tier);
  const n = tier===1 ? 3 : 4;
  const set = new Set();
  const w = randInt(0,5);
  while(set.size < n){ const v = tier===1 ? w + randInt(1,9)/10 : tier===2 ? w + randInt(1,99)/100 : w + randInt(1,999)/1000; set.add(Number(v.toFixed(3))); }
  const vals = [...set];
  const trick = tier >= 2 ? vals.map(v => fmtNum(v, 3)) : vals.map(v=>fmtNum(v,1));
  return { cards: trick.map(t=>`<span dir="ltr">${t}</span>`), order: orderIdx(vals), ltr: true,
    firstAr: "الأصغر", firstEn: "least", lastAr: "الأكبر", lastEn: "greatest",
    promptAr: "رتّب الكسور العشرية من الأصغر إلى الأكبر:", promptEn: "Order the decimals from least to greatest:",
    ...H("الكسر العشري الأطول ليس بالضرورة الأكبر!", "A longer decimal isn't always bigger!", "أضف أصفارًا ليصبح لكل الأعداد عدد الأرقام نفسه بعد الفاصلة، ثم قارن.", "Add zeros so each has the same number of decimal places, then compare.", L(vals.slice().sort((a,b)=>a-b).map(v=>fmtNum(v,3)).join(" < ")), vals.slice().sort((a,b)=>a-b).map(v=>fmtNum(v,3)).join(" < ")) };
};
GEN.g5decadd = function(tier){
  tier = clampTier(tier);
  const dp = tier===1 ? 1 : 2;
  const sub = tier >= 2 && Math.random() < .5;
  let a = randInt(10*Math.pow(10,dp), 99*Math.pow(10,dp))/Math.pow(10,dp), b = randInt(1*Math.pow(10,dp), 60*Math.pow(10,dp))/Math.pow(10,dp);
  if(sub && b > a) [a,b] = [b,a];
  const res = Number((sub ? a-b : a+b).toFixed(dp));
  return { nums: [a,b], op: sub?"−":"+", result: res, dp,
    ...H("رتّب الفواصل العشرية فوق بعضها.", "Line up the decimal points.", "احسب كما في الأعداد الكلية، والفاصلة تبقى في مكانها.", "Compute like whole numbers; the point stays in place.", L(`${a} ${sub?"−":"+"} ${b} = ${res}`), `${a} ${sub?"−":"+"} ${b} = ${res}`) };
};
GEN.g5dist = function(tier){
  tier = clampTier(tier);
  const a = randInt(3, tier===1?5:9), b = randInt(11, 12), c = 10;
  return { mode: "split", a, b, c, maxRows: 10, maxCols: 12,
    promptAr: `${L(a+" × "+b)}: حرّك خط التقسيم ليصبح ${L(b)} = 10 + ${L(b-10)}`, promptEn: `${a} × ${b}: move the split line so ${b} = 10 + ${b-10}`,
    ...H("خاصية التوزيع: اضرب كل جزء ثم اجمع.", "Distributive property: multiply each part, then add.", L(`${a} × (10 + ${b-10})`), `${a} × (10 + ${b-10})`, L(`${a*10} + ${a*(b-10)} = ${a*b}`), `${a*10} + ${a*(b-10)} = ${a*b}`) };
};
GEN.g5area = function(tier){
  tier = clampTier(tier);
  const A = randInt(12, tier===1?29:tier===2?59:99), B = randInt(12, tier===1?19:tier===2?39:99);
  const at = Math.floor(A/10)*10, ao = A%10 || 1, bt = Math.floor(B/10)*10, bo = B%10 || 3;
  const a = at+ao, b = bt+bo;
  const rows = [[{h:"×"},{h:String(at)},{h:String(ao)}],[{h:String(bt)},{ans:bt*at},{ans:bt*ao}],[{h:String(bo)},{ans:bo*at},{ans:bo*ao}]];
  return { blocks: [{rows}, {op:"="}, {rows:[[{h:"المجموع"}],[{ans:a*b}]]}], neg: false,
    promptAr: `${L(a+" × "+b)}: أكمل نموذج المساحة ثم اجمع:`, promptEn: `${a} × ${b}: fill the area model, then add:`,
    ...H("جزّئ كل عدد إلى عشرات وآحاد.", "Split each number into tens and ones.", "كل خانة = رقم الصف × رقم العمود.", "Each box = row × column.", L(`${bt*at} + ${bt*ao} + ${bo*at} + ${bo*ao} = ${a*b}`), `${bt*at} + ${bt*ao} + ${bo*at} + ${bo*ao} = ${a*b}`) };
};
GEN.g5share = function(tier){
  tier = clampTier(tier);
  const d = randInt(2, tier===1?5:9);
  const q = randInt(2, tier===1?6:9);
  const r = tier===1 ? 0 : randInt(0, d-1);
  const n = d*q + r;
  const e = randChoice(["🍬","🍪","🎈","🍓","⭐"]);
  const vis = `<div class="vis-group" style="max-width:360px">${e.repeat(n)}</div><div style="flex-basis:100%;text-align:center;font-size:26px">⬇️</div>` +
    Array.from({length:d}).map(()=>`<div class="vis-group" style="min-width:60px;min-height:48px">👤</div>`).join("");
  return { visualHtml: vis, exprHtml: `${n} ÷ ${d} = ?`,
    promptAr: `وزّع ${L(n)} ${e} بالتساوي على ${L(d)} أشخاص:`, promptEn: `Share ${n} ${e} equally among ${d} people:`,
    steps: [
      { ar: "كم يأخذ كل شخص؟ (ناتج القسمة)", en: "How many does each get? (quotient)", answer: q },
      { ar: "كم يتبقى؟ (الباقي)", en: "How many are left? (remainder)", answer: r }
    ],
    ...H("القسمة = توزيع بالتساوي.", "Division = sharing equally.", `فكّر: ${L(d+" × ? ≤ "+n)}`, `Think: ${d} × ? ≤ ${n}`, L(`${n} = ${d} × ${q} + ${r}`), `${n} = ${d} × ${q} + ${r}`) };
};
GEN.g5expr = function(tier){
  tier = clampTier(tier);
  const k = randInt(2, 12);
  const forms = [
    { ar:`عدد مضافًا إليه ${L(k)}`, en:`a number plus ${k}`, ans:["n","+",String(k)] },
    { ar:`عدد مطروحًا منه ${L(k)}`, en:`a number minus ${k}`, ans:["n","−",String(k)] },
    { ar:`${L(k)} أمثال عدد`, en:`${k} times a number`, ans:[String(k),"×","n"] },
    { ar:`عدد مقسومًا على ${L(k)}`, en:`a number divided by ${k}`, ans:["n","÷",String(k)] },
    { ar:`${L(k)} أقل من عدد`, en:`${k} less than a number`, ans:["n","−",String(k)] }
  ];
  const f = tier===1 ? randChoice(forms.slice(0,2)) : randChoice(forms);
  const alt = f.ans[1] === "+" ? [[f.ans[2],"+","n"]] : f.ans[1] === "×" ? [["n","×",f.ans[0]]] : [];
  const pal = shuffleArr(["n", String(k), String(k+1), "+", "−", "×", "÷"]);
  return { slots: 3, palette: pal, answers: [f.ans, ...alt], ltr: true,
    promptAr: `اكتب عبارة جبرية لـ: «${f.ar}» (استخدم n للعدد المجهول)`, promptEn: `Write an expression for: “${f.en}” (use n for the unknown)`,
    ...H("حدّد العملية من الكلمات: «مضافًا» = +، «أمثال» = ×، «أقل من» = −.", "Find the operation in the words: plus = +, times = ×, less than = −.", "«أقل من عدد» تعني نبدأ بالعدد ثم نطرح.", "“less than a number” means start with the number, then subtract.", L(f.ans.join(" ")), f.ans.join(" ")) };
};
GEN.orderops = BASE.orderops;
GEN.balance = function(tier){
  tier = clampTier(tier);
  let a, b, x;
  if(tier === 1){ a = 1; x = randInt(2,15); b = randInt(1,10); }
  else if(tier === 2){ a = 1; x = randInt(5,20); b = -randInt(1, x-1); }
  else { a = randChoice([2,3,4,5]); x = randInt(2,10); b = 0; }
  const c = a*x + b;
  return { a0:a, b0:b, c0:c, x, hintAr: "طبّق العملية العكسية على الطرفين.", hintEn: "Apply the inverse operation to both sides." };
};
GEN.g5shade = function(tier){
  tier = clampTier(tier);
  const den = randChoice(tier===1 ? [2,4] : [3,4,5,6]);
  const w = randInt(1, tier===3?2:1);
  const r = randInt(1, den-1);
  const num = w*den + r;
  return { mode: "shade", shape: tier===3 ? "circle" : "bar", den, wholes: w+1, num,
    targetHtml: `<span dir="ltr">${w}${fracHtml(r, den)}</span>`,
    promptAr: "لوّن الأجزاء لتمثّل العدد الكسري:", promptEn: "Shade parts to show the mixed number:",
    ...H("العدد الكسري = أعداد كاملة + كسر.", "A mixed number = wholes + a fraction.", `لوّن ${L(w)} ${w===1?"شكلًا كاملًا":"شكلين كاملين"}، ثم ${L(r)} أجزاء من الشكل التالي.`, `Shade ${w} whole shape(s), then ${r} parts of the next.`, `${L(num)} جزءًا ملونًا = ${L(num+"/"+den)}`, `${num} shaded parts = ${num}/${den}`) };
};
GEN.g5read = function(tier){
  tier = clampTier(tier);
  const den = randChoice(tier===1 ? [2,3,4] : [3,4,5,6,8]);
  const wholes = tier===1 ? 1 : 2;
  const num = tier===1 ? randInt(1, den-1) : randInt(den+1, 2*den-1);
  return { mode: "read", shape: "bar", den, wholes, num,
    promptAr: "اكتب الكسر الذي يمثّله النموذج (كسر غير فعلي إذا لزم):", promptEn: "Write the fraction the model shows (improper if needed):",
    ...H("المقام = عدد الأجزاء في الشكل الواحد.", "Denominator = parts in ONE whole.", "البسط = كل الأجزاء الملونة في كل الأشكال.", "Numerator = all shaded parts in all shapes.", `${L(num+"/"+den)}`, `${num}/${den}`) };
};
GEN.g5fline = function(tier){
  tier = clampTier(tier);
  const den = randChoice(tier===1 ? [2,4] : [3,4,5]);
  let n; do { n = randInt(1, 3*den-1); } while(n % den === 0 || (tier===1 && n > 2*den));
  const w = Math.floor(n/den), r = n % den;
  return { mode: "tap", min: 0, max: 3, step: 1/den, fmt: "frac", den, mixed: true, labelEvery: den, target: n/den,
    showHtml: w ? `<span dir="ltr">${w}${fracHtml(r,den)}</span>` : fracHtml(r,den),
    ...H(`كل وحدة مقسّمة إلى ${L(den)} أجزاء.`, `Each unit has ${den} parts.`, w ? `اذهب إلى ${L(w)} ثم تقدّم ${L(r)} أجزاء.` : `تقدّم ${L(r)} أجزاء من الصفر.`, w ? `Go to ${w}, then ${r} more parts.` : `Move ${r} parts from zero.`, `${L(n+"/"+den)}`, `${n}/${den}`) };
};
GEN.g5roundf = function(tier){
  const zero = [["1/8"],["1/6"],["1/5"],["1/10"],["2/12"],["1/9"]], half = [["3/8"],["2/5"],["3/6"],["4/9"],["5/10"],["5/12"]], one = [["7/8"],["5/6"],["4/5"],["9/10"],["11/12"],["8/9"]];
  const toHtml = s => { const [n,d] = s.split("/"); return fracHtml(n,d); };
  const items = shuffleArr([
    ...shuffleArr(zero).slice(0,2).map(x=>({html:toHtml(x[0]), bin:0})),
    ...shuffleArr(half).slice(0,2).map(x=>({html:toHtml(x[0]), bin:1})),
    ...shuffleArr(one).slice(0,2).map(x=>({html:toHtml(x[0]), bin:2}))]);
  return { items, bins: [{ar:"قريب من 0", en:"about 0"}, {ar:"قريب من ½", en:"about ½"}, {ar:"قريب من 1", en:"about 1"}],
    ...H("قارن البسط بالمقام.", "Compare the numerator with the denominator.", "بسط صغير جدًا ← 0، بسط نصف المقام تقريبًا ← ½، بسط قريب من المقام ← 1.", "Tiny numerator → 0, about half the denominator → ½, close to the denominator → 1.", "مثال: 1/8 ≈ 0، 3/8 ≈ ½، 7/8 ≈ 1", "Example: 1/8 ≈ 0, 3/8 ≈ ½, 7/8 ≈ 1") };
};
