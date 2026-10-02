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
   Grade 3 content (الصف الثالث الابتدائي) — first term
   =========================================================== */

const GRADE = {"progressKey": "mahaMathLabProgress_g3_v1", "ar": "الصف الثالث الابتدائي", "en": "Grade 3"};

/* Grade 3, term 1 chapters: القيمة المنزلية · الجمع · الطرح · الضرب (1) · الضرب (2) */

const LEVEL_TITLES = [
  { min: 0,   ar: "مستكشف المنازل", en: "Place Explorer" },
  { min: 60,  ar: "مقرّب الأعداد", en: "Rounding Scout" },
  { min: 150, ar: "بطل الجمع", en: "Addition Hero" },
  { min: 280, ar: "بطل الطرح", en: "Subtraction Hero" },
  { min: 450, ar: "بنّاء المصفوفات", en: "Array Builder" },
  { min: 650, ar: "خبير جدول الضرب", en: "Times-Table Expert" },
  { min: 900, ar: "خبير مختبر الرياضيات", en: "Math Lab Master" }
];

const MODULES = [
  {
    key: "place", titleAr: "محطة القيمة المنزلية", titleEn: "Place Value Station", emoji: "🏠", color: "#7c5cf0",
    guideAr: "الآلاف والمئات والعشرات والآحاد، والتقريب!", guideEn: "Thousands, hundreds, tens, ones, and rounding!",
    machines: [
      { key: "g3build", type: "placevalue", titleAr: "بنّاء الأعداد", titleEn: "Number Builder", emoji: "🧱", descAr: "كوّن عددًا حتى 9999.", descEn: "Build a number up to 9999." },
      { key: "g3round", type: "numline", titleAr: "آلة التقريب", titleEn: "Rounding Machine", emoji: "🎯", descAr: "قرّب العدد إلى أقرب عشرة أو مئة.", descEn: "Round to the nearest ten or hundred." },
      { key: "g3order", type: "ordercards", titleAr: "مرتّب الأعداد", titleEn: "Number Sorter", emoji: "📶", descAr: "قارن الأعداد ورتّبها.", descEn: "Compare and order numbers." }
    ]
  },
  {
    key: "addsub", titleAr: "محطة الجمع والطرح", titleEn: "Add & Subtract Station", emoji: "➕", color: "#17b6a7",
    guideAr: "اجمع واطرح أعدادًا من ثلاثة وأربعة أرقام!", guideEn: "Add and subtract three- and four-digit numbers!",
    machines: [
      { key: "g3add", type: "columncalc", titleAr: "آلة الجمع", titleEn: "Addition Machine", emoji: "➕", descAr: "اجمع عموديًا مع إعادة التجميع.", descEn: "Add in columns with regrouping." },
      { key: "g3sub", type: "columncalc", titleAr: "آلة الطرح", titleEn: "Subtraction Machine", emoji: "➖", descAr: "اطرح عموديًا مع إعادة التجميع.", descEn: "Subtract in columns with regrouping." },
      { key: "g3mental", type: "numline", titleAr: "القفز بالمئات والعشرات", titleEn: "Hundreds & Tens Hops", emoji: "🐸", descAr: "اجمع ذهنيًا بالقفز بالعشرات أو المئات.", descEn: "Add mentally by hopping tens or hundreds." }
    ]
  },
  {
    key: "mult1", titleAr: "محطة الضرب (1)", titleEn: "Multiplication Station 1", emoji: "✖️", color: "#22d3ee",
    guideAr: "المجموعات المتساوية، والمصفوفات، والجمع المتكرر!", guideEn: "Equal groups, arrays, and repeated addition!",
    machines: [
      { key: "g3groups", type: "keypadvisual", titleAr: "المجموعات المتساوية", titleEn: "Equal Groups", emoji: "🧺", descAr: "كم مجموعة؟ كم في كل مجموعة؟ كم الكل؟", descEn: "How many groups? How many in each? How many in all?" },
      { key: "g3array", type: "array", titleAr: "بنّاء المصفوفات", titleEn: "Array Builder", emoji: "🔲", descAr: "ابنِ المصفوفة لتجد ناتج الضرب.", descEn: "Build the array to find the product." },
      { key: "g3skip", type: "numline", titleAr: "العدّ القفزي", titleEn: "Skip Counting", emoji: "🦘", descAr: "اضرب بالقفز المتساوي على خط الأعداد.", descEn: "Multiply by equal jumps on the number line." }
    ]
  },
  {
    key: "mult2", titleAr: "محطة الضرب (2)", titleEn: "Multiplication Station 2", emoji: "🧠", color: "#ff6f6f",
    guideAr: "حقائق الضرب، وتجزئة العدد، وأنماط جدول الضرب!", guideEn: "Multiplication facts, splitting numbers, and table patterns!",
    machines: [
      { key: "g3facts", type: "matchpairs", titleAr: "حقائق الضرب", titleEn: "Multiplication Facts", emoji: "🎴", descAr: "صِل كل جملة ضرب بناتجها.", descEn: "Match each fact to its product." },
      { key: "g3split", type: "array", titleAr: "مقسّم المصفوفة", titleEn: "Array Splitter", emoji: "✂️", descAr: "جزّئ المصفوفة لتضرب بسهولة.", descEn: "Split the array to multiply easily." },
      { key: "g3table", type: "gridfill", titleAr: "جدول الضرب", titleEn: "Times Table", emoji: "📋", descAr: "أكمل جزءًا من جدول الضرب.", descEn: "Fill part of the times table." }
    ]
  },
  {
    key: "arena", titleAr: "ساحة التحدي", titleEn: "Challenge Arena", emoji: "🏆", color: "#f4c542",
    guideAr: "مزيج من كل الأجهزة!", guideEn: "A mix of every machine!",
    machines: [ { key: "mixed", titleAr: "التحدي الشامل", titleEn: "The Grand Challenge", emoji: "🎯", descAr: "مزيج من كل الأجهزة — أظهر إتقانك!", descEn: "A mix of every machine — show your mastery!" } ]
  }
];

const ARENA_POOL = ["g3build","g3round","g3order","g3add","g3sub","g3mental","g3groups","g3array","g3skip","g3facts","g3split","g3table"];

const GEN = {};
const PV4 = [{ar:"آلاف", en:"thousands", val:1000}, {ar:"مئات", en:"hundreds", val:100}, {ar:"عشرات", en:"tens", val:10}, {ar:"آحاد", en:"ones", val:1}];
const AR_UNITS = ["", "واحد","اثنان","ثلاثة","أربعة","خمسة","ستة","سبعة","ثمانية","تسعة"];

GEN.g3build = function(tier){
  tier = clampTier(tier);
  const n = tier===1 ? randInt(100,999) : randInt(1000,9999);
  const d = String(n).padStart(4,"0").split("").map(Number);
  const read = tier === 3 && Math.random() < .5;
  const expanded = d.map((x,i)=>x*PV4[i].val).filter(x=>x).join(" + ");
  return { mode: read ? "read" : "build", target: n, counts: d, places: PV4,
    targetHtml: tier === 2 ? `<span dir="ltr">${expanded}</span><span class="en-badge">expanded form</span>` : undefined,
    ...H("كل رقم يخبرك بعدد الأقراص في منزلته.", "Each digit tells you how many discs go in its place.", `${L(n)} = ${L(expanded)}`, `${n} = ${expanded}`,
         PV4.map((p,i)=>`${p.ar}: ${L(d[i])}`).join("، "), PV4.map((p,i)=>`${p.en}: ${d[i]}`).join(", ")) };
};
GEN.g3round = function(tier){
  tier = clampTier(tier);
  const toHundred = tier === 3 || (tier === 2 && Math.random() < .5);
  if(!toHundred){
    const base = randInt(1, 9)*10 + (tier===1 ? 0 : randInt(0,8)*100);
    let n; do { n = base + randInt(1,9); } while(n % 10 === 5 && tier === 1);
    const lo = Math.floor(n/10)*10, t = Math.round(n/10)*10;
    return { mode: "tap", min: lo, max: lo+10, step: 1, labelEvery: 10, target: t, marker: n, markerLabel: String(n),
      showHtml: `<span dir="ltr">${n} → ?</span><span class="en-badge">nearest ten</span>`,
      promptAr: `قرّب ${L(n)} إلى أقرب عشرة: اضغط على العشرة الأقرب.`, promptEn: `Round ${n} to the nearest ten: tap the closer ten.`,
      ...H("انظر إلى رقم الآحاد.", "Look at the ones digit.", "إذا كان الآحاد 5 أو أكثر نقرّب للأعلى، وإلا للأسفل.", "5 or more rounds up; less rounds down.", `${L(n)} ← ${L(t)}`, `${n} → ${t}`) };
  }
  const h = randInt(1, 9)*100 + (tier===3 ? randInt(1,8)*1000 : 0);
  const n = h + randInt(1, 99);
  const lo = Math.floor(n/100)*100, t = Math.round(n/100)*100;
  return { mode: "tap", min: lo, max: lo+100, step: 10, labelEvery: 5, target: t, marker: n, markerLabel: String(n),
    showHtml: `<span dir="ltr">${n} → ?</span><span class="en-badge">nearest hundred</span>`,
    promptAr: `قرّب ${L(n)} إلى أقرب مئة: اضغط على المئة الأقرب.`, promptEn: `Round ${n} to the nearest hundred: tap the closer hundred.`,
    ...H("انظر إلى رقم العشرات.", "Look at the tens digit.", "إذا كانت العشرات 5 أو أكثر نقرّب للأعلى.", "Tens of 5 or more round up.", `${L(n)} ← ${L(t)}`, `${n} → ${t}`) };
};
GEN.g3order = function(tier){
  tier = clampTier(tier);
  const n = tier===1 ? 3 : 4;
  const base = randInt(1,8)*1000;
  const vals = tier===1 ? distinctInts(n, 100, 999) : distinctInts(n, base, base+999).map((v,i)=> i===0 && tier===3 ? v + 1000 : v);
  const desc = Math.random() < .35;
  return { cards: vals.map(v=>`<span dir="ltr">${v}</span>`), order: orderIdx(vals, desc), ltr: true,
    firstAr: desc?"الأكبر":"الأصغر", firstEn: desc?"greatest":"least", lastAr: desc?"الأصغر":"الأكبر", lastEn: desc?"least":"greatest",
    promptAr: desc ? "رتّب من الأكبر إلى الأصغر:" : "رتّب من الأصغر إلى الأكبر:", promptEn: desc ? "Order from greatest to least:" : "Order from least to greatest:",
    ...H("قارن من اليسار: الآلاف ثم المئات ثم العشرات.", "Compare from the left: thousands, then hundreds, then tens.", "إذا تساوت منزلة، انتقل إلى المنزلة التالية.", "If a place is equal, move to the next place.", L(orderIdx(vals,desc).map(i=>vals[i]).join(" ، ")), orderIdx(vals,desc).map(i=>vals[i]).join(", ")) };
};
GEN.g3add = function(tier){
  tier = clampTier(tier);
  const a = tier===1 ? randInt(100,499) : tier===2 ? randInt(150,899) : randInt(1000,6999);
  const b = tier===1 ? randInt(100,499) : tier===2 ? randInt(150,899) : randInt(500,2999);
  return { nums: [a,b], op: "+", result: a+b,
    ...H("ابدأ من الآحاد وتحرك يسارًا.", "Start with the ones and move left.", "إذا زاد مجموع منزلة عن 9، احمل 1 إلى المنزلة التالية.", "If a place adds to more than 9, carry 1 to the next place.", L(`${a} + ${b} = ${a+b}`), `${a} + ${b} = ${a+b}`) };
};
GEN.g3sub = function(tier){
  tier = clampTier(tier);
  let a, b;
  if(tier===1){ a = randInt(500,999); b = randInt(100, a-100); }
  else if(tier===2){ a = randInt(300,999); b = randInt(120, a-20); }
  else { a = randInt(2000,9000); b = randInt(500, a-300); if(Math.random()<.4) a = Math.round(a/100)*100; }
  return { nums: [a,b], op: "−", result: a-b,
    ...H("ابدأ من الآحاد.", "Start with the ones.", "إذا كان الرقم العلوي أصغر، استلف من المنزلة التالية.", "If the top digit is smaller, borrow from the next place.", L(`${a} − ${b} = ${a-b}`), `${a} − ${b} = ${a-b}`) };
};
GEN.g3mental = function(tier){
  tier = clampTier(tier);
  const byHundred = tier === 3 || (tier === 2 && Math.random() < .5);
  const step = byHundred ? 100 : 10;
  const k = randInt(2, 5);
  const start = byHundred ? randInt(1,4)*100 : randInt(1,4)*10;
  const target = start + k*step;
  return { mode: "hop", min: 0, max: step*10, step: step, hop: step, start, target, labelEvery: 2,
    showHtml: `<span dir="ltr">${start} + ${k*step} = ?</span>`,
    promptAr: `اقفز بـ ${L(step)} في كل مرة، ثم اضغط «هنا»:`, promptEn: `Hop by ${step} each time, then press “Here”:`,
    ...H(`${L(k*step)} = ${L(k)} قفزات من ${L(step)}`, `${k*step} = ${k} hops of ${step}`, `ابدأ من ${L(start)}.`, `Start at ${start}.`, L(`${start} + ${k*step} = ${target}`), `${start} + ${k*step} = ${target}`) };
};
GEN.g3groups = function(tier){
  tier = clampTier(tier);
  const g = randInt(2, tier===1?4:6), per = randInt(2, tier===1?5:tier===2?6:9);
  const e = randChoice(["🍪","🍎","⭐","🐟","🌸","⚽"]);
  return { visualHtml: VIS.groups(g, per, e),
    promptAr: "انظر إلى المجموعات المتساوية:", promptEn: "Look at the equal groups:",
    steps: [
      { ar: "كم عدد المجموعات؟", en: "How many groups?", answer: g },
      { ar: "كم في كل مجموعة؟", en: "How many in each group?", answer: per },
      { ar: L(`${g} × ${per} = ?`), en: "", answer: g*per }
    ],
    ...H("الضرب = جمع مجموعات متساوية.", "Multiplication = adding equal groups.", L(Array.from({length:g}).map(()=>per).join(" + ")), Array.from({length:g}).map(()=>per).join(" + "), L(`${g} × ${per} = ${g*per}`), `${g} × ${per} = ${g*per}`) };
};
GEN.g3array = function(tier){
  tier = clampTier(tier);
  const a = randInt(2, tier===1?4:tier===2?6:9), b = randInt(2, tier===1?5:tier===2?7:9);
  return { mode: "build", a, b, maxRows: 10, maxCols: 10,
    ...H("الصفوف أفقية، والأعمدة رأسية.", "Rows go across, columns go down.", `اجعل ${L(a)} صفوف في كل صف ${L(b)}.`, `Make ${a} rows with ${b} in each.`, L(`${a} × ${b} = ${a*b}`), `${a} × ${b} = ${a*b}`) };
};
GEN.g3skip = function(tier){
  tier = clampTier(tier);
  const f = tier===1 ? randChoice([2,5,10]) : tier===2 ? randChoice([2,3,4,5]) : randChoice([3,4,6]);
  const k = randInt(2, Math.floor(40/f) > 8 ? 8 : Math.floor(40/f));
  return { mode: "hop", min: 0, max: f*Math.min(10, k+2), step: f, hop: f, start: 0, target: f*k, labelEvery: 1,
    showHtml: `<span dir="ltr">${k} × ${f} = ?</span>`,
    promptAr: `ابدأ من 0 واقفز ${L(k)} قفزات، كل قفزة ${L(f)}:`, promptEn: `Start at 0 and make ${k} jumps of ${f}:`,
    ...H("كل قفزة تضيف العدد نفسه.", "Each jump adds the same number.", `عُدّ: ${L(Array.from({length:Math.min(k,4)}).map((_,i)=>f*(i+1)).join("، "))}…`, `Count: ${Array.from({length:Math.min(k,4)}).map((_,i)=>f*(i+1)).join(", ")}…`, L(`${k} × ${f} = ${f*k}`), `${k} × ${f} = ${f*k}`) };
};
GEN.g3facts = function(tier){
  tier = clampTier(tier);
  const maxF = tier===1 ? 5 : tier===2 ? 7 : 9;
  const prods = new Set(); const pairs = [];
  while(pairs.length < 4){ const a = randInt(2,maxF), b = randInt(2,maxF); if(prods.has(a*b)) continue; prods.add(a*b); pairs.push([`${a} × ${b}`, String(a*b)]); }
  return { ...pairsData(pairs), ltr: true,
    ...H("استخدم الجمع المتكرر أو العدّ القفزي.", "Use repeated addition or skip counting.", "ابدأ بالحقائق التي تعرفها جيدًا.", "Start with the facts you know best.", L(pairs.map(p=>p[0]+" = "+p[1]).join("   ")), pairs.map(p=>p[0]+" = "+p[1]).join("   ")) };
};
GEN.g3split = function(tier){
  tier = clampTier(tier);
  const a = randInt(3, tier===1?5:8), b = randInt(6, 9), c = 5;
  return { mode: "split", a, b, c, maxRows: 10, maxCols: 10,
    ...H("قسّم العدد الكبير إلى 5 + الباقي.", "Split the big number into 5 + the rest.", `${L(b)} = 5 + ${L(b-5)}`, `${b} = 5 + ${b-5}`, L(`${a} × ${b} = ${a*5} + ${a*(b-5)} = ${a*b}`), `${a} × ${b} = ${a*5} + ${a*(b-5)} = ${a*b}`) };
};
GEN.g3table = function(tier){
  tier = clampTier(tier);
  const rows = shuffleArr([2,3,4,5,6,7,8,9]).slice(0,3).sort((x,y)=>x-y);
  const c0 = randInt(1, tier===1?3:5);
  const cols = [c0, c0+1, c0+2, c0+3];
  const blanks = tier===1 ? 4 : tier===2 ? 6 : 8;
  const cells = shuffleArr(rows.flatMap((r,i)=>cols.map((c,j)=>i+","+j))).slice(0, blanks);
  const set = new Set(cells);
  const grid = [[{h:"×"}, ...cols.map(c=>({h:String(c)}))], ...rows.map((r,i)=>[{h:String(r)}, ...cols.map((c,j)=> set.has(i+","+j) ? {ans:r*c} : {v:String(r*c)})])];
  return { blocks: [{rows: grid}], neg: false,
    promptAr: "أكمل جدول الضرب: اضرب رقم الصف في رقم العمود.", promptEn: "Fill the times table: multiply the row number by the column number.",
    ...H("كل خانة = رقم الصف × رقم العمود.", "Each box = row × column.", "في كل صف يزيد الناتج بمقدار رقم الصف.", "Along a row, the product grows by the row number.", "تحقق من كل خانة بالعدّ القفزي.", "Check each box by skip counting.") };
};
