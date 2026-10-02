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
   Grade 4 content (الصف الرابع الابتدائي) — first term
   =========================================================== */

const GRADE = {"progressKey": "mahaMathLabProgress_g4_v1", "ar": "الصف الرابع الابتدائي", "en": "Grade 4"};

/* Grade 4, term 1 chapters: القيمة المنزلية · الجمع والطرح · تنظيم البيانات وعرضها
   وتفسيرها · الأنماط والجبر · الضرب في عدد من رقم واحد · الضرب في عدد من رقمين */

const LEVEL_TITLES = [
  { min: 0,   ar: "مستكشف الآلاف", en: "Thousands Explorer" },
  { min: 60,  ar: "مقدّر ذكي", en: "Smart Estimator" },
  { min: 150, ar: "محلل البيانات", en: "Data Analyst" },
  { min: 280, ar: "كاشف القواعد", en: "Rule Detective" },
  { min: 450, ar: "مهندس الضرب", en: "Multiplication Engineer" },
  { min: 650, ar: "خبير النماذج", en: "Area Model Expert" },
  { min: 900, ar: "خبير مختبر الرياضيات", en: "Math Lab Master" }
];

const MODULES = [
  {
    key: "place", titleAr: "محطة القيمة المنزلية", titleEn: "Place Value Station", emoji: "🏛️", color: "#7c5cf0",
    guideAr: "أعداد حتى مئات الألوف: كوّنها وقرّبها ورتّبها!", guideEn: "Numbers to hundred thousands: build, round, and order them!",
    machines: [
      { key: "g4build", type: "placevalue", titleAr: "بنّاء الأعداد الكبيرة", titleEn: "Big Number Builder", emoji: "🧱", descAr: "كوّن أعدادًا حتى 999999.", descEn: "Build numbers up to 999,999." },
      { key: "g4round", type: "numline", titleAr: "آلة التقريب", titleEn: "Rounding Machine", emoji: "🎯", descAr: "قرّب إلى أقرب ألف أو مئة.", descEn: "Round to the nearest thousand or hundred." },
      { key: "g4order", type: "ordercards", titleAr: "مرتّب الأعداد", titleEn: "Number Sorter", emoji: "📶", descAr: "قارن الأعداد الكبيرة ورتّبها.", descEn: "Compare and order big numbers." }
    ]
  },
  {
    key: "addsub", titleAr: "محطة الجمع والطرح", titleEn: "Add & Subtract Station", emoji: "➕", color: "#17b6a7",
    guideAr: "اجمع واطرح، وقدّر أولًا لتتحقق!", guideEn: "Add and subtract — estimate first to check!",
    machines: [
      { key: "g4add", type: "columncalc", titleAr: "آلة الجمع", titleEn: "Addition Machine", emoji: "➕", descAr: "اجمع أعدادًا كبيرة عموديًا.", descEn: "Add big numbers in columns." },
      { key: "g4sub", type: "columncalc", titleAr: "آلة الطرح", titleEn: "Subtraction Machine", emoji: "➖", descAr: "اطرح أعدادًا كبيرة عموديًا.", descEn: "Subtract big numbers in columns." },
      { key: "g4estimate", type: "keypadvisual", titleAr: "المقدّر", titleEn: "The Estimator", emoji: "🔮", descAr: "قرّب كل عدد ثم قدّر الناتج.", descEn: "Round each number, then estimate." }
    ]
  },
  {
    key: "dataalg", titleAr: "محطة البيانات والأنماط", titleEn: "Data & Patterns Station", emoji: "📊", color: "#22d3ee",
    guideAr: "مثّل البيانات، واكتشف القواعد والأنماط!", guideEn: "Graph data, and discover rules and patterns!",
    machines: [
      { key: "g4bars", type: "barchart", titleAr: "استوديو الأعمدة", titleEn: "Bar Graph Studio", emoji: "📊", descAr: "مثّل البيانات بمقياس 2 ثم أجب.", descEn: "Graph with a scale of 2, then answer." },
      { key: "g4rule", type: "gridfill", titleAr: "جدول الدالة", titleEn: "Function Table", emoji: "🔄", descAr: "طبّق القاعدة وأكمل الجدول.", descEn: "Apply the rule and complete the table." },
      { key: "g4seq", type: "gridfill", titleAr: "آلة الأنماط العددية", titleEn: "Number Pattern Machine", emoji: "🔢", descAr: "اكتشف النمط وأكمل الحدود.", descEn: "Find the pattern and extend it." }
    ]
  },
  {
    key: "mult", titleAr: "محطة الضرب", titleEn: "Multiplication Station", emoji: "✖️", color: "#ff6f6f",
    guideAr: "اضرب في رقم واحد وفي رقمين!", guideEn: "Multiply by one digit and by two digits!",
    machines: [
      { key: "g4mul1", type: "columncalc", titleAr: "الضرب في رقم واحد", titleEn: "Multiply by 1 Digit", emoji: "✖️", descAr: "اضرب عموديًا مع الحمل.", descEn: "Multiply in columns with carrying." },
      { key: "g4area", type: "gridfill", titleAr: "نموذج المساحة", titleEn: "Area Model", emoji: "🟦", descAr: "جزّئ العددين واضرب كل جزء.", descEn: "Split both numbers and multiply each part." },
      { key: "g4tens", type: "matchpairs", titleAr: "أنماط الضرب في 10 و100", titleEn: "×10 and ×100 Patterns", emoji: "🔟", descAr: "استخدم الحقائق الأساسية مع الأصفار.", descEn: "Use basic facts with zeros." }
    ]
  },
  {
    key: "arena", titleAr: "ساحة التحدي", titleEn: "Challenge Arena", emoji: "🏆", color: "#f4c542",
    guideAr: "مزيج من كل الأجهزة!", guideEn: "A mix of every machine!",
    machines: [ { key: "mixed", titleAr: "التحدي الشامل", titleEn: "The Grand Challenge", emoji: "🎯", descAr: "مزيج من كل الأجهزة — أظهر إتقانك!", descEn: "A mix of every machine — show your mastery!" } ]
  }
];

const ARENA_POOL = ["g4build","g4round","g4order","g4add","g4sub","g4estimate","g4rule","g4seq","g4mul1","g4area","g4tens"];

const GEN = {};
const PV6 = [{ar:"مئات الألوف", en:"hundred thousands", val:100000, label:"100000"}, {ar:"عشرات الألوف", en:"ten thousands", val:10000, label:"10000"}, {ar:"آلاف", en:"thousands", val:1000}, {ar:"مئات", en:"hundreds", val:100}, {ar:"عشرات", en:"tens", val:10}, {ar:"آحاد", en:"ones", val:1}];

GEN.g4build = function(tier){
  tier = clampTier(tier);
  const places = tier===1 ? PV6.slice(2) : tier===2 ? PV6.slice(1) : PV6;
  const n = randInt(Math.pow(10, places.length-1), Math.pow(10, places.length)-1);
  const d = String(n).split("").map(Number);
  const read = tier >= 2 && Math.random() < .35;
  return { mode: read ? "read" : "build", target: n, counts: d, places,
    targetHtml: `<span dir="ltr">${n.toLocaleString("en-US")}</span>`,
    ...H("كل منزلة أكبر بعشر مرات من التي على يمينها.", "Each place is ten times the place to its right.", "اقرأ الأرقام من اليسار: كل رقم = عدد الأقراص في منزلته.", "Read the digits from the left: each digit = discs in its place.",
         places.map((p,i)=>`${p.ar}: ${L(d[i])}`).join("، "), places.map((p,i)=>`${p.en}: ${d[i]}`).join(", ")) };
};
GEN.g4round = function(tier){
  tier = clampTier(tier);
  const toThousand = tier >= 2;
  const step = toThousand ? 100 : 10, big = toThousand ? 1000 : 100;
  const lo = randInt(tier===3?10:1, tier===3?98:9)*big;
  let n = lo + randInt(1, big/step - 1)*step + (toThousand ? 0 : 0);
  if(tier === 3) n += randInt(1,9)*(step/10);
  const t = Math.round(n/big)*big;
  return { mode: "tap", min: lo, max: lo+big, step, labelEvery: 5, target: t, marker: n, markerLabel: n.toLocaleString("en-US"),
    showHtml: `<span dir="ltr">${n.toLocaleString("en-US")} → ?</span><span class="en-badge">nearest ${toThousand?"thousand":"hundred"}</span>`,
    promptAr: `قرّب إلى أقرب ${toThousand?"ألف":"مئة"}: اضغط على الأقرب.`, promptEn: `Round to the nearest ${toThousand?"thousand":"hundred"}: tap the closer one.`,
    ...H(`انظر إلى رقم ${toThousand?"المئات":"العشرات"}.`, `Look at the ${toThousand?"hundreds":"tens"} digit.`, "5 أو أكثر ← نقرّب للأعلى.", "5 or more → round up.", `${L(n)} ← ${L(t)}`, `${n} → ${t}`) };
};
GEN.g4order = function(tier){
  tier = clampTier(tier);
  const digits = tier===1 ? 4 : tier===2 ? 5 : 6;
  const base = randInt(1,8)*Math.pow(10,digits-1);
  const vals = distinctInts(4, base, base + Math.pow(10,digits-1) - 1);
  if(tier === 3) vals[0] = vals[0] + Math.pow(10, digits-1);
  const desc = Math.random() < .4;
  return { cards: vals.map(v=>`<span dir="ltr">${v.toLocaleString("en-US")}</span>`), order: orderIdx(vals, desc), ltr: true,
    firstAr: desc?"الأكبر":"الأصغر", firstEn: desc?"greatest":"least", lastAr: desc?"الأصغر":"الأكبر", lastEn: desc?"least":"greatest",
    promptAr: desc ? "رتّب من الأكبر إلى الأصغر:" : "رتّب من الأصغر إلى الأكبر:", promptEn: desc ? "Order from greatest to least:" : "Order from least to greatest:",
    ...H("قارن المنازل من اليسار.", "Compare places from the left.", "أول منزلة تختلف تحدد الأكبر.", "The first place that differs decides.", L(orderIdx(vals,desc).map(i=>vals[i]).join(" ، ")), orderIdx(vals,desc).map(i=>vals[i]).join(", ")) };
};
GEN.g4add = function(tier){
  tier = clampTier(tier);
  const a = tier===1 ? randInt(1000,4999) : randInt(10000, 59999), b = tier===1 ? randInt(1000,4999) : randInt(5000, 39999);
  return { nums: [a,b], op: "+", result: a+b,
    ...H("رتّب المنازل بعضها تحت بعض، وابدأ بالآحاد.", "Line up the places and start with the ones.", "احمل عندما يزيد مجموع المنزلة عن 9.", "Carry when a place adds to more than 9.", L(`${a} + ${b} = ${a+b}`), `${a} + ${b} = ${a+b}`) };
};
GEN.g4sub = function(tier){
  tier = clampTier(tier);
  let a = tier===1 ? randInt(3000,9999) : randInt(20000, 90000), b = tier===1 ? randInt(1000, a-500) : randInt(5000, a-1000);
  if(tier === 3) a = Math.round(a/1000)*1000;
  if(b >= a) b = a - 1234;
  return { nums: [a,b], op: "−", result: a-b,
    ...H("ابدأ بالآحاد.", "Start with the ones.", tier===3 ? "عند الاستلاف عبر الأصفار: استلف من أول منزلة غير صفرية." : "استلف عندما يكون الرقم العلوي أصغر.", tier===3 ? "Borrowing across zeros: borrow from the first nonzero place." : "Borrow when the top digit is smaller.", L(`${a} − ${b} = ${a-b}`), `${a} − ${b} = ${a-b}`) };
};
GEN.g4estimate = function(tier){
  tier = clampTier(tier);
  const big = tier===1 ? 100 : 1000;
  const a = randInt(tier===1?110:1100, tier===1?890:8900), b = randInt(tier===1?110:1100, tier===1?890:8900);
  const sub = tier >= 2 && Math.random() < .5 && a !== b;
  const [x,y] = sub && a < b ? [b,a] : [a,b];
  const rx = Math.round(x/big)*big, ry = Math.round(y/big)*big;
  return { exprHtml: `${x} ${sub?"−":"+"} ${y} ≈ ?`,
    promptAr: `قدّر الناتج بتقريب كل عدد إلى أقرب ${big===100?"مئة":"ألف"}:`, promptEn: `Estimate by rounding each number to the nearest ${big===100?"hundred":"thousand"}:`,
    steps: [
      { ar: `قرّب ${L(x)}`, en: `Round ${x}`, answer: rx },
      { ar: `قرّب ${L(y)}`, en: `Round ${y}`, answer: ry },
      { ar: "الناتج التقديري", en: "Estimate", answer: sub ? rx-ry : rx+ry }
    ],
    ...H("التقريب يجعل الحساب الذهني أسهل.", "Rounding makes mental math easier.", `${L(x)} ← ${L(rx)} ، ${L(y)} ← ${L(ry)}`, `${x} → ${rx}, ${y} → ${ry}`, L(`${rx} ${sub?"−":"+"} ${ry} = ${sub?rx-ry:rx+ry}`), `${rx} ${sub?"−":"+"} ${ry} = ${sub?rx-ry:rx+ry}`) };
};
const G4_CATS = [
  [{ar:"الرياضيات",en:"math",emoji:"🔢"},{ar:"العلوم",en:"science",emoji:"🔬"},{ar:"الرسم",en:"art",emoji:"🎨"},{ar:"الرياضة",en:"sports",emoji:"⚽"}],
  [{ar:"السبت",en:"Sat",emoji:"📅"},{ar:"الأحد",en:"Sun",emoji:"📅"},{ar:"الاثنين",en:"Mon",emoji:"📅"},{ar:"الثلاثاء",en:"Tue",emoji:"📅"}],
  [{ar:"جدة",en:"Jeddah",emoji:"🌊"},{ar:"الرياض",en:"Riyadh",emoji:"🏙️"},{ar:"أبها",en:"Abha",emoji:"⛰️"},{ar:"الدمام",en:"Dammam",emoji:"🌴"}]
];
GEN.g4bars = function(tier){
  tier = clampTier(tier);
  const cats = randChoice(G4_CATS).map(c => Object.assign({}, c, {value: 2*randInt(1, tier===1?6:10)}));
  let a = 0, b = 1;
  cats.forEach((c,i)=>{ if(c.value > cats[a].value) a = i; });
  cats.forEach((c,i)=>{ if(c.value < cats[b].value || b === a) b = i; });
  if(a === b) b = (a+1)%cats.length;
  return { cats, source: "table", max: 20, step: 2, style: "bars",
    question: { ar: `كم يزيد ${cats[a].ar} عن ${cats[b].ar}؟`, en: `How many more for ${cats[a].en} than ${cats[b].en}?`, answer: cats[a].value - cats[b].value },
    ...H("كل ضغطة + ترفع العمود 2 (مقياس الرسم = 2).", "Each + raises the bar by 2 (scale = 2).", "لـ «كم يزيد» اطرح القيمتين.", "For “how many more”, subtract the two values.", `${L(cats[a].value+" − "+cats[b].value+" = "+(cats[a].value-cats[b].value))}`, `${cats[a].value} − ${cats[b].value} = ${cats[a].value-cats[b].value}`) };
};
GEN.g4rule = function(tier){
  tier = clampTier(tier);
  const ops = tier===1 ? [["+", randInt(3,15)],["×", randInt(2,5)]] : tier===2 ? [["×", randInt(3,9)],["−", randInt(2,9)]] : [["×", randInt(2,6)]];
  const [op, k] = randChoice(ops);
  const b2 = tier===3 ? randInt(1,9) : 0;
  const f = x => op==="+" ? x+k : op==="−" ? x-k : x*k + b2;
  const xs = distinctInts(4, op==="−" ? k+1 : 1, 12).sort((a,b)=>a-b);
  const ruleTxt = tier===3 ? `× ${k} + ${b2}` : `${op} ${k}`;
  const missIn = tier === 3 ? randInt(0,3) : -1;
  const rows = [[{h:"المدخل"}, ...xs.map((x,i)=> i===missIn ? {ans:x} : {v:String(x)})], [{h:"المخرج"}, ...xs.map((x,i)=> i===missIn ? {v:String(f(x))} : (i===0 && tier===1 ? {v:String(f(x))} : {ans:f(x)}))]];
  return { blocks: [{rows}], neg: false,
    visualHtml: `<div class="fn-machine" dir="ltr"><div class="fn-box"><div class="fn-label">Input</div><div class="fn-value">x</div></div><div class="fn-arrow">→</div><div class="fn-box" style="border-color:var(--gold-500)"><div class="fn-label">Rule</div><div class="fn-value" style="font-size:18px">${ruleTxt}</div></div><div class="fn-arrow">→</div><div class="fn-box"><div class="fn-label">Output</div><div class="fn-value">y</div></div></div>`,
    promptAr: "طبّق القاعدة على كل مدخل وأكمل الجدول:", promptEn: "Apply the rule to each input and complete the table:",
    ...H("المخرج = المدخل بعد تطبيق القاعدة.", "Output = input after applying the rule.", tier===3 ? "للمدخل المفقود: اعكس القاعدة (اطرح ثم اقسم)." : `مثال: ${L(xs[0]+" "+ruleTxt+" = "+f(xs[0]))}`, tier===3 ? "For a missing input, undo the rule (subtract, then divide)." : `Example: ${xs[0]} ${ruleTxt} = ${f(xs[0])}`,
         L(xs.map(x=>x+"→"+f(x)).join("  ")), xs.map(x=>x+"→"+f(x)).join("  ")) };
};
GEN.g4seq = function(tier){
  tier = clampTier(tier);
  let terms, ruleAr, ruleEn;
  if(tier === 3 && Math.random() < .5){ const r = randChoice([2,3]); const a = randInt(1,4); terms = Array.from({length:6}).map((_,i)=>a*Math.pow(r,i)); ruleAr = `اضرب في ${L(r)}`; ruleEn = `multiply by ${r}`; }
  else { const d = tier===1 ? randChoice([2,5,10]) : randChoice([3,4,6,7,9,25]) * (Math.random()<.3?-1:1); const a = d < 0 ? randInt(-d*5+1, -d*5+40) : randInt(1,20); terms = Array.from({length:6}).map((_,i)=>a+i*d); ruleAr = d>0 ? `أضف ${L(d)}` : `اطرح ${L(-d)}`; ruleEn = d>0 ? `add ${d}` : `subtract ${-d}`; }
  const blanks = tier===1 ? [4,5] : tier===2 ? [2,5] : [1,4,5];
  const row = terms.map((t,i)=> blanks.includes(i) ? {ans:t} : {v:String(t)});
  return { blocks: [{rows:[row]}], neg: false,
    promptAr: "اكتشف القاعدة وأكمل النمط:", promptEn: "Find the rule and complete the pattern:",
    ...H("قارن كل حد بالحد الذي قبله.", "Compare each term with the one before.", `القاعدة: ${ruleAr}`, `Rule: ${ruleEn}`, L(terms.join(" ، ")), terms.join(", ")) };
};
GEN.g4mul1 = function(tier){
  tier = clampTier(tier);
  const a = tier===1 ? randInt(12,49) : tier===2 ? randInt(102,499) : randInt(1002, 4999), b = randInt(tier===1?2:3, 9);
  return { nums: [a,b], op: "×", result: a*b,
    ...H("اضرب كل منزلة في العدد، مبتدئًا بالآحاد.", "Multiply each place by the number, starting with the ones.", "اكتب رقم الآحاد من الناتج واحمل العشرات إلى المنزلة التالية.", "Write the ones digit and carry the tens to the next place.", L(`${a} × ${b} = ${a*b}`), `${a} × ${b} = ${a*b}`) };
};
GEN.g4area = function(tier){
  tier = clampTier(tier);
  if(tier === 1){
    const a = randInt(12,89), b = randInt(3,9);
    const t = Math.floor(a/10)*10, o = a%10;
    const rows = [[{h:"×"},{h:String(t)},{h:String(o)}],[{h:String(b)},{ans:b*t},{ans:b*o}]];
    return { blocks: [{rows}, {op:"="}, {rows:[[{h:"المجموع"}],[{ans:a*b}]]}], neg: false,
      promptAr: `${L(a+" × "+b)}: جزّئ ${L(a)} إلى ${L(t)} + ${L(o)} واضرب كل جزء، ثم اجمع:`, promptEn: `${a} × ${b}: split ${a} into ${t} + ${o}, multiply each part, then add:`,
      ...H("اضرب كل جزء في العدد.", "Multiply each part by the number.", L(`${b}×${t} = ${b*t} , ${b}×${o} = ${b*o}`), `${b}×${t} = ${b*t}, ${b}×${o} = ${b*o}`, L(`${b*t} + ${b*o} = ${a*b}`), `${b*t} + ${b*o} = ${a*b}`) };
  }
  const a = randInt(12, tier===2?39:89), b = randInt(12, tier===2?29:79);
  const at = Math.floor(a/10)*10, ao = a%10 || 1, bt = Math.floor(b/10)*10, bo = b%10 || 2;
  const A = at+ao, B = bt+bo;
  const rows = [[{h:"×"},{h:String(at)},{h:String(ao)}],[{h:String(bt)},{ans:bt*at},{ans:bt*ao}],[{h:String(bo)},{ans:bo*at},{ans:bo*ao}]];
  return { blocks: [{rows}, {op:"="}, {rows:[[{h:"المجموع"}],[{ans:A*B}]]}], neg: false,
    promptAr: `${L(A+" × "+B)}: أكمل نموذج المساحة ثم اجمع النواتج الأربعة:`, promptEn: `${A} × ${B}: fill the area model, then add the four products:`,
    ...H("كل خانة = رقم الصف × رقم العمود.", "Each box = row × column.", L(`${bt}×${at} , ${bt}×${ao} , ${bo}×${at} , ${bo}×${ao}`), `${bt}×${at}, ${bt}×${ao}, ${bo}×${at}, ${bo}×${ao}`, L(`${bt*at} + ${bt*ao} + ${bo*at} + ${bo*ao} = ${A*B}`), `${bt*at} + ${bt*ao} + ${bo*at} + ${bo*ao} = ${A*B}`) };
};
GEN.g4tens = function(tier){
  tier = clampTier(tier);
  const pairs = []; const seen = new Set();
  while(pairs.length < 4){
    const a = randInt(2,9), b = randInt(2,9), z = tier===1 ? 1 : randInt(1, tier===2?2:3);
    const big = b*Math.pow(10,z);
    const prod = a*big;
    if(seen.has(prod)) continue; seen.add(prod);
    pairs.push([`${a} × ${big}`, String(prod)]);
  }
  return { ...pairsData(pairs), ltr: true,
    ...H("اضرب الأرقام غير الصفرية، ثم أضف الأصفار.", "Multiply the non-zero digits, then attach the zeros.", "مثال: 3 × 400: 3 × 4 = 12، ثم أضف صفرين = 1200.", "Example: 3 × 400: 3 × 4 = 12, add two zeros = 1200.", L(pairs.map(p=>p[0]+" = "+p[1]).join("   ")), pairs.map(p=>p[0]+" = "+p[1]).join("   ")) };
};
