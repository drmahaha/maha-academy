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
   Grade 11 content (الصف الثاني الثانوي) — first term
   =========================================================== */

const GRADE = {"progressKey": "mahaMathLabProgress_g11_v1", "ar": "الصف الثاني الثانوي", "en": "Grade 11"};

/* Grade 11 (Math 2-1, tracks system), term 1 chapters: الدوال والمتباينات · المصفوفات ·
   كثيرات الحدود ودوالها · العلاقات والدوال العكسية والجذرية */

const LEVEL_TITLES = [
  { min: 0,   ar: "محلل الدوال", en: "Function Analyst" },
  { min: 60,  ar: "مخطط المتباينات", en: "Inequality Planner" },
  { min: 150, ar: "مهندس المصفوفات", en: "Matrix Engineer" },
  { min: 280, ar: "مستكشف الأعداد المركبة", en: "Complex Explorer" },
  { min: 450, ar: "سيد كثيرات الحدود", en: "Polynomial Master" },
  { min: 650, ar: "خبير الجذور", en: "Radical Expert" },
  { min: 900, ar: "خبير مختبر الرياضيات", en: "Math Lab Master" }
];

const MODULES = [
  {
    key: "funcineq", titleAr: "مختبر الدوال والمتباينات", titleEn: "Functions & Inequalities Lab", emoji: "📈", color: "#7c5cf0",
    guideAr: "الدوال الخاصة، ومتباينات المستوى، والبرمجة الخطية!", guideEn: "Special functions, inequalities in the plane, and linear programming!",
    machines: [
      { key: "g11sets", type: "sortbins", titleAr: "مصنّف الأعداد الحقيقية", titleEn: "Real Number Sets", emoji: "🗂️", descAr: "صنّف الأعداد حسب مجموعاتها.", descEn: "Sort numbers into their sets." },
      { key: "g11abs", type: "slider", titleAr: "دالة القيمة المطلقة", titleEn: "Absolute Value Function", emoji: "✔️", descAr: "حرّك رأس الدالة وافتح ذراعيها.", descEn: "Move the vertex and open the arms." },
      { key: "g11ineq", type: "slider", titleAr: "راسم المتباينات الخطية", titleEn: "Linear Inequality Grapher", emoji: "🎨", descAr: "ارسم الحد واختر التظليل.", descEn: "Draw the boundary and choose the shading." },
      { key: "g11lp", type: "graphtap", titleAr: "البرمجة الخطية", titleEn: "Linear Programming", emoji: "🏭", descAr: "أوجد الرأس الذي يعطي القيمة العظمى.", descEn: "Find the vertex giving the maximum." }
    ]
  },
  {
    key: "matrices", titleAr: "مختبر المصفوفات", titleEn: "Matrices Lab", emoji: "🔲", color: "#17b6a7",
    guideAr: "اجمع واطرح واضرب المصفوفات، واحسب المحددات!", guideEn: "Add, subtract, and multiply matrices, and compute determinants!",
    machines: [
      { key: "g11matadd", type: "gridfill", titleAr: "جمع وطرح المصفوفات", titleEn: "Add & Subtract Matrices", emoji: "➕", descAr: "اجمع أو اطرح العناصر المتناظرة.", descEn: "Add or subtract matching entries." },
      { key: "g11scalar", type: "gridfill", titleAr: "الضرب في عدد", titleEn: "Scalar Multiplication", emoji: "✖️", descAr: "اضرب كل عنصر في العدد.", descEn: "Multiply every entry by the number." },
      { key: "g11matmul", type: "gridfill", titleAr: "ضرب المصفوفات", titleEn: "Matrix Multiplication", emoji: "🧮", descAr: "صف × عمود لكل عنصر.", descEn: "Row × column for each entry." },
      { key: "g11det", type: "keypadvisual", titleAr: "المحددات", titleEn: "Determinants", emoji: "🔢", descAr: "احسب محدد مصفوفة 2×2.", descEn: "Find the determinant of a 2×2 matrix." }
    ]
  },
  {
    key: "poly", titleAr: "مختبر كثيرات الحدود", titleEn: "Polynomials Lab", emoji: "🌀", color: "#22d3ee",
    guideAr: "الأعداد المركبة، والمميز، والقسمة التركيبية، والأصفار!", guideEn: "Complex numbers, the discriminant, synthetic division, and zeros!",
    machines: [
      { key: "g11complex", type: "graphtap", titleAr: "المستوى المركب", titleEn: "The Complex Plane", emoji: "🌐", descAr: "مثّل العدد المركب في المستوى.", descEn: "Plot the complex number." },
      { key: "g11cops", type: "gridfill", titleAr: "العمليات على الأعداد المركبة", titleEn: "Complex Number Operations", emoji: "🧪", descAr: "اجمع واطرح واضرب الأعداد المركبة.", descEn: "Add, subtract, and multiply complex numbers." },
      { key: "g11disc", type: "keypadvisual", titleAr: "آلة المميز", titleEn: "Discriminant Machine", emoji: "🔍", descAr: "احسب المميز واعرف نوع الجذور.", descEn: "Find the discriminant and the kind of roots." },
      { key: "g11synth", type: "gridfill", titleAr: "القسمة التركيبية", titleEn: "Synthetic Division", emoji: "➗", descAr: "اقسم كثيرة الحدود على (x − r).", descEn: "Divide the polynomial by (x − r)." },
      { key: "g11zeros", type: "graphtap", titleAr: "صائد الأصفار", titleEn: "Zero Hunter", emoji: "🎯", descAr: "اضغط على كل أصفار الدالة.", descEn: "Tap every zero of the function." }
    ]
  },
  {
    key: "radical", titleAr: "مختبر الدوال العكسية والجذرية", titleEn: "Inverse & Radical Functions Lab", emoji: "√", color: "#ff6f6f",
    guideAr: "العمليات على الدوال، والدوال العكسية، والجذور، والأسس النسبية!", guideEn: "Operations on functions, inverses, radicals, and rational exponents!",
    machines: [
      { key: "g11fops", type: "gridfill", titleAr: "العمليات على الدوال", titleEn: "Operations on Functions", emoji: "⚙️", descAr: "احسب (f+g) و(f∘g) لقيم مختلفة.", descEn: "Evaluate (f+g) and (f∘g)." },
      { key: "g11inverse", type: "matchpairs", titleAr: "الدوال العكسية", titleEn: "Inverse Functions", emoji: "🔁", descAr: "صِل كل دالة بدالتها العكسية.", descEn: "Match each function with its inverse." },
      { key: "g11sqrt", type: "slider", titleAr: "دالة الجذر التربيعي", titleEn: "Square Root Function", emoji: "📉", descAr: "انقل وحوّل منحنى الجذر.", descEn: "Shift and stretch the root curve." },
      { key: "g11simplify", type: "gridfill", titleAr: "تبسيط الجذور", titleEn: "Simplifying Radicals", emoji: "✂️", descAr: "أخرج المربعات الكاملة من الجذر.", descEn: "Pull perfect squares out of the root." },
      { key: "g11ratexp", type: "matchpairs", titleAr: "الأسس النسبية", titleEn: "Rational Exponents", emoji: "🔣", descAr: "صِل الصورة الأسية بالصورة الجذرية.", descEn: "Match exponential and radical forms." }
    ]
  },
  {
    key: "arena", titleAr: "ساحة التحدي", titleEn: "Challenge Arena", emoji: "🏆", color: "#f4c542",
    guideAr: "مزيج من كل الأجهزة!", guideEn: "A mix of every machine!",
    machines: [ { key: "mixed", titleAr: "التحدي الشامل", titleEn: "The Grand Challenge", emoji: "🎯", descAr: "مزيج من كل الأجهزة — أظهر إتقانك!", descEn: "A mix of every machine — show your mastery!" } ]
  }
];

const ARENA_POOL = ["g11sets","g11abs","g11ineq","g11lp","g11matadd","g11scalar","g11matmul","g11det","g11complex","g11cops","g11disc","g11synth","g11zeros","g11fops","g11inverse","g11sqrt","g11simplify","g11ratexp"];

const GEN = {};
const LTR = s => `<span dir="ltr">${s}</span>`;
function mat(rows, blankFn){ return rows.map((row,i)=>row.map((v,j)=> blankFn && blankFn(i,j) ? {ans:v} : {v:String(v).replace("-","−")})); }
function cplx(a,b){ if(b === 0) return String(a); const bi = b === 1 ? "i" : b === -1 ? "−i" : `${Math.abs(b)}i`; if(a === 0) return b < 0 && b !== -1 ? `−${bi}` : bi; return `${a} ${b<0?"−":"+"} ${b===1||b===-1?"i":Math.abs(b)+"i"}`; }

GEN.g11sets = function(tier){
  const pool = [["7",0],["12",0],["0",1],["−4",2],["−15",2],["3/5",3],["−2.5",3],["0.333…",3],["√2",4],["π",4],["√11",4]];
  const items = shuffleArr(pool).slice(0,7).map(([h,b])=>({html:h, bin:b, ltr:true}));
  return { items, bins: [{ar:"طبيعية", en:"natural ℕ"}, {ar:"كلية (غير طبيعية)", en:"whole: 0"}, {ar:"صحيحة سالبة", en:"negative integers"}, {ar:"نسبية غير صحيحة", en:"rational, not integer"}, {ar:"غير نسبية", en:"irrational"}],
    promptAr: "ضع كل عدد في أدق مجموعة ينتمي إليها:", promptEn: "Put each number in its most specific set:",
    ...H("ℕ ⊂ W ⊂ ℤ ⊂ ℚ ⊂ ℝ", "ℕ ⊂ W ⊂ ℤ ⊂ ℚ ⊂ ℝ", "العدد النسبي يُكتب a/b، والعشري الدوري نسبي، والجذر غير الكامل غير نسبي.", "Rationals can be written a/b; repeating decimals are rational; non-perfect roots are irrational.", "0 كلي، −4 صحيح، 3/5 نسبي، √2 غير نسبي.", "0 whole, −4 integer, 3/5 rational, √2 irrational.") };
};
GEN.g11abs = function(tier){
  tier = clampTier(tier);
  const a = randChoice(tier===1 ? [1] : tier===2 ? [1,-1,2] : [-2,-1,1,2,0.5]);
  const h = randInt(-4,4), k = randInt(-3,3);
  return { fam:"abs", show: tier===3 ? "eq" : "graph", target:{a,h,k},
    params:[{k:"a",label:"a",min:-3,max:3,step:0.5,v0:1,skip:[0]},{k:"h",label:"h",min:-6,max:6,step:1,v0:0},{k:"k",label:"k",min:-6,max:6,step:1,v0:0}],
    view:{xmin:-7,xmax:7,ymin:-7,ymax:7},
    ...H("y = a|x − h| + k: الرأس (h, k).", "y = a|x − h| + k: vertex at (h, k).", "h ينقل أفقيًا، k ينقل رأسيًا، وa يحدد الاتساع والاتجاه.", "h shifts sideways, k up/down, a sets width and direction.", L(`a = ${a} , h = ${h} , k = ${k}`), `a = ${a}, h = ${h}, k = ${k}`) };
};
GEN.g11ineq = function(tier){
  tier = clampTier(tier);
  const m = randChoice([-2,-1,1,2,0.5,-0.5]), b = randInt(-3,3);
  const op = randChoice(["<","≤",">","≥"]);
  return { fam:"linear", show:"eq", target:{m,b}, ineq:{op},
    params:[{k:"m",label:"m",min:-4,max:4,step:0.5,v0:0},{k:"b",label:"b",min:-6,max:6,step:1,v0:0}],
    view:{xmin:-6,xmax:6,ymin:-6,ymax:6},
    ...H("ارسم الحد أولًا كمعادلة.", "Graph the boundary first as an equation.", "≤ أو ≥ ← خط متصل. < أو > ← متقطع. y > ← ظلّل فوق.", "≤ or ≥ → solid; < or > → dashed. y > → shade above.", `الحد ${L("y = "+m+"x "+(b<0?"− "+(-b):"+ "+b))} ، ${op==="<"||op===">" ? "متقطع" : "متصل"} ، ${op===">"||op==="≥" ? "فوق" : "تحت"}`, `boundary y = ${m}x + ${b}, ${op==="<"||op===">"?"dashed":"solid"}, shade ${op===">"||op==="≥"?"above":"below"}`) };
};
GEN.g11lp = function(tier){
  tier = clampTier(tier);
  // feasible region: x ≥ 0, y ≥ 0, x + y ≤ s, x ≤ p   → vertices (0,0),(p,0),(p,s-p),(0,s)
  const s = randInt(5,7), p = randInt(2, s-1);
  const V = [[0,0],[p,0],[p,s-p],[0,s]];
  let cx, cy, best;
  do { cx = randInt(1,5); cy = randInt(1,5); const vals = V.map(([x,y])=>cx*x+cy*y); const mx = Math.max(...vals); best = V.filter(([x,y])=>cx*x+cy*y===mx); } while(best.length !== 1);
  return { view:{xmin:-1,xmax:8,ymin:-1,ymax:8}, polys:[{pts:V}],
    exprHtml: `f(x, y) = ${cx}x + ${cy}y`,
    legendHtml: LTR(`x ≥ 0 , y ≥ 0 , x + y ≤ ${s} , x ≤ ${p}`),
    answers: [{x:best[0][0], y:best[0][1]}],
    after: { ar: "ما القيمة العظمى؟", en: "What is the maximum value?", answer: cx*best[0][0]+cy*best[0][1] },
    promptAr: "المنطقة الملونة هي منطقة الحلول الممكنة. اضغط على الرأس الذي يجعل f أكبر ما يمكن:", promptEn: "The shaded region is feasible. Tap the vertex that makes f as large as possible:",
    ...H("القيمة العظمى تقع دائمًا عند أحد رؤوس المنطقة.", "The maximum is always at a vertex of the region.", "عوّض كل رأس في f وقارن.", "Substitute each vertex into f and compare.", L(V.map(([x,y])=>`(${x},${y})→${cx*x+cy*y}`).join("  ")), V.map(([x,y])=>`(${x},${y})→${cx*x+cy*y}`).join("  ")) };
};
GEN.g11matadd = function(tier){
  tier = clampTier(tier);
  const n = tier===1 ? 2 : randChoice([2,3]), m = 2;
  const A = Array.from({length:m}).map(()=>Array.from({length:n}).map(()=>randInt(-6,9)));
  const B = Array.from({length:m}).map(()=>Array.from({length:n}).map(()=>randInt(-6,9)));
  const sub = tier >= 2 && Math.random() < .5;
  const C = A.map((r,i)=>r.map((v,j)=> sub ? v - B[i][j] : v + B[i][j]));
  return { blocks: [{bracket:true, rows: mat(A)}, {op: sub?"−":"+"}, {bracket:true, rows: mat(B)}, {op:"="}, {bracket:true, rows: mat(C, ()=>true)}],
    promptAr: sub ? "اطرح المصفوفتين: اطرح كل عنصر من العنصر المناظر له." : "اجمع المصفوفتين: اجمع كل عنصرين متناظرين.", promptEn: sub ? "Subtract: subtract matching entries." : "Add: add matching entries.",
    ...H("يمكن جمع أو طرح مصفوفتين لهما الرتبة نفسها فقط.", "Only matrices of the same size can be added or subtracted.", "كل عنصر في الناتج من الموقع نفسه في المصفوفتين.", "Each result entry comes from the same position in both.", `العنصر الأول: ${L(A[0][0]+(sub?" − ":" + ")+"("+B[0][0]+") = "+C[0][0])}`, `First entry: ${A[0][0]} ${sub?"−":"+"} (${B[0][0]}) = ${C[0][0]}`) };
};
GEN.g11scalar = function(tier){
  tier = clampTier(tier);
  const k = randChoice(tier===1 ? [2,3,4] : [-3,-2,2,3,5]);
  const A = Array.from({length:2}).map(()=>Array.from({length:tier===3?3:2}).map(()=>randInt(-5,8)));
  const C = A.map(r=>r.map(v=>k*v));
  return { blocks: [{rows:[[{h:String(k).replace("-","−")}]]}, {bracket:true, rows: mat(A)}, {op:"="}, {bracket:true, rows: mat(C, ()=>true)}],
    promptAr: `اضرب المصفوفة في ${L(k)}:`, promptEn: `Multiply the matrix by ${k}:`,
    ...H("اضرب كل عنصر في العدد.", "Multiply every entry by the number.", "انتبه لإشارات الأعداد السالبة.", "Watch the signs of negative numbers.", `العنصر الأول: ${L(k+" × "+A[0][0]+" = "+C[0][0])}`, `First: ${k} × ${A[0][0]} = ${C[0][0]}`) };
};
GEN.g11matmul = function(tier){
  tier = clampTier(tier);
  const r = tier===1 ? () => randInt(0,4) : () => randInt(-3,5);
  const A = [[r(),r()],[r(),r()]], B = tier===1 ? [[r()],[r()]] : [[r(),r()],[r(),r()]];
  const C = A.map(row => B[0].map((_,j)=> row[0]*B[0][j] + row[1]*B[1][j]));
  return { blocks: [{bracket:true, rows: mat(A)}, {op:"×"}, {bracket:true, rows: mat(B)}, {op:"="}, {bracket:true, rows: mat(C, ()=>true)}],
    promptAr: "اضرب المصفوفتين: كل عنصر = (صف من الأولى) × (عمود من الثانية).", promptEn: "Multiply: each entry = (row of the first) · (column of the second).",
    ...H("اضرب العناصر المتناظرة في الصف والعمود ثم اجمع.", "Multiply matching entries of the row and column, then add.", L(`c₁₁ = ${A[0][0]}×${B[0][0]} + ${A[0][1]}×${B[1][0]}`), `c₁₁ = ${A[0][0]}×${B[0][0]} + ${A[0][1]}×${B[1][0]}`, L(`c₁₁ = ${C[0][0]}`), `c₁₁ = ${C[0][0]}`) };
};
GEN.g11det = function(tier){
  tier = clampTier(tier);
  const r = () => randInt(tier===1?1:-5, tier===1?6:8);
  const a = r(), b = r(), c = r(), d = r();
  const matHtml = `<div class="gf-block bracket"><table class="gf-table mat" dir="ltr"><tr><td>${a}</td><td>${b}</td></tr><tr><td>${c}</td><td>${d}</td></tr></table></div>`;
  return { visualHtml: matHtml, exprHtml: `det = ad − bc`,
    promptAr: "احسب محدد المصفوفة:", promptEn: "Find the determinant:",
    steps: [ { ar: L("a × d = ?"), en: "", answer: a*d, opts:{allowNegative:true} }, { ar: L("b × c = ?"), en: "", answer: b*c, opts:{allowNegative:true} }, { ar: L("det = ad − bc = ?"), en: "", answer: a*d-b*c, opts:{allowNegative:true} } ],
    ...H("محدد المصفوفة 2×2 = حاصل ضرب القطر الرئيسي − حاصل ضرب القطر الآخر.", "2×2 determinant = main diagonal product − other diagonal product.", L(`${a}×${d} − ${b}×${c}`), `${a}×${d} − ${b}×${c}`, L(`= ${a*d-b*c}`), `= ${a*d-b*c}`) };
};
GEN.g11complex = function(tier){
  tier = clampTier(tier);
  const a = randInt(-5,5), b = randInt(-5,5) || 2;
  return { view:{xmin:-6,xmax:6,ymin:-6,ymax:6}, axisX:"Re", axisY:"Im",
    exprHtml: `z = ${cplx(a,b)}`, answers:[{x:a, y:b}],
    promptAr: "مثّل العدد المركب: المحور الأفقي للجزء الحقيقي، والرأسي للجزء التخيلي.", promptEn: "Plot the complex number: horizontal axis = real part, vertical = imaginary part.",
    ...H("z = a + bi يمثَّل بالنقطة (a, b).", "z = a + bi is the point (a, b).", `الجزء الحقيقي ${L(a)}، والتخيلي ${L(b)}.`, `Real part ${a}, imaginary part ${b}.`, L(`(${a}, ${b})`), `(${a}, ${b})`) };
};
GEN.g11cops = function(tier){
  tier = clampTier(tier);
  const a = randInt(-5,6), b = randInt(-5,6), c = randInt(-5,6), d = randInt(-5,6);
  const op = tier===1 ? "+" : tier===2 ? randChoice(["+","−"]) : "×";
  let re, im;
  if(op === "+"){ re = a+c; im = b+d; } else if(op === "−"){ re = a-c; im = b-d; } else { re = a*c - b*d; im = a*d + b*c; }
  return { blocks: [{rows:[[{v:`(${cplx(a,b)})`}]]}, {op}, {rows:[[{v:`(${cplx(c,d)})`}]]}, {op:"="}, {rows:[[{ans:re}],]}, {op:"+"}, {rows:[[{ans:im}]]}, {op:"i"}],
    promptAr: "احسب الناتج بالصورة a + bi (اكتب a ثم b):", promptEn: "Compute the result as a + bi (enter a, then b):",
    ...H(op==="×" ? "استخدم التوزيع وتذكّر أن i² = −1." : "اجمع أو اطرح الأجزاء الحقيقية معًا والتخيلية معًا.", op==="×" ? "Distribute and remember i² = −1." : "Combine real parts together and imaginary parts together.", op==="×" ? L(`(ac − bd) + (ad + bc)i`) : L(`(${a} ${op} ${c}) + (${b} ${op} ${d})i`), op==="×" ? "(ac − bd) + (ad + bc)i" : `(${a} ${op} ${c}) + (${b} ${op} ${d})i`, L(cplx(re,im)), cplx(re,im)) };
};
GEN.g11disc = function(tier){
  tier = clampTier(tier);
  const a = randChoice([1,1,2,-1,3]), b = randInt(-8,8);
  const want = randChoice(["pos","zero","neg"]);
  let c;
  if(want === "zero" && b % 2 === 0 && (b*b) % (4*Math.abs(a)) === 0) c = b*b/(4*a);
  else if(want === "neg") c = Math.floor(b*b/(4*a)) + (a>0 ? randInt(1,5) : -randInt(1,5));
  else c = Math.floor(b*b/(4*a)) - (a>0 ? randInt(1,6) : -randInt(1,6));
  const D = b*b - 4*a*c;
  const poly = `${a===1?"":a===-1?"−":a}x² ${b<0?"−":"+"} ${Math.abs(b)}x ${c<0?"−":"+"} ${Math.abs(c)} = 0`;
  return { exprHtml: poly,
    promptAr: "احسب المميز، ثم عدد الجذور الحقيقية:", promptEn: "Find the discriminant, then the number of real roots:",
    steps: [ { ar: L("Δ = b² − 4ac = ?"), en: "", answer: D, opts:{allowNegative:true} }, { ar: "كم جذرًا حقيقيًا للمعادلة؟", en: "How many real roots?", answer: D > 0 ? 2 : D === 0 ? 1 : 0 } ],
    ...H("المميز Δ = b² − 4ac.", "Discriminant Δ = b² − 4ac.", "Δ > 0 ← جذران حقيقيان، Δ = 0 ← جذر واحد مكرر، Δ < 0 ← لا جذور حقيقية (جذران مركبان).", "Δ > 0 → two real roots, Δ = 0 → one repeated, Δ < 0 → none real (two complex).", L(`Δ = ${b}² − 4(${a})(${c}) = ${D}`), `Δ = ${b}² − 4(${a})(${c}) = ${D}`) };
};
GEN.g11synth = function(tier){
  tier = clampTier(tier);
  const r = randInt(-3,3) || 2;
  const q = tier===1 ? [1, randInt(-4,4)] : [randChoice([1,2]), randInt(-4,4), randInt(-4,4)];
  const rem = tier===3 ? randInt(-5,5) : 0;
  // p(x) = (x - r) q(x) + rem
  const p = []; p.push(q[0]);
  for(let i=1;i<q.length;i++) p.push(q[i] - r*q[i-1]);
  p.push(rem - r*q[q.length-1]);
  const mid = [null]; for(let i=1;i<p.length;i++) mid.push(r*(i-1 < q.length ? q[i-1] : 0));
  const bottom = [...q, rem];
  const rows = [
    [{h:String(r).replace("-","−")}, ...p.map(v=>({v:String(v).replace("-","−")}))],
    [{h:""}, ...mid.map((v,i)=> i===0 ? {v:""} : {ans:v})],
    [{h:""}, ...bottom.map(v=>({ans:v}))]
  ];
  const terms = p.map((c,i)=>{ const e = p.length-1-i; if(c === 0) return ""; const ac = Math.abs(c), xs = e>1?"x"+(e===2?"²":"³"):e===1?"x":""; return `${c<0?"−":"+"} ${ac===1 && e>0 ? "" : ac}${xs}`; }).filter(Boolean).join(" ").replace(/^\+ /,"").replace(/^− /,"−");
  return { blocks:[{rows}],
    visualHtml: `<div class="math-expr" dir="ltr" style="font-size:22px">(${terms}) ÷ (x ${r<0?"+":"−"} ${Math.abs(r)})</div>`,
    promptAr: "أكمل جدول القسمة التركيبية (الصف الأخير = معاملات الناتج ثم الباقي):", promptEn: "Complete the synthetic division (last row = quotient coefficients, then the remainder):",
    ...H("أنزل المعامل الأول، ثم اضرب في r وأضف للعمود التالي.", "Bring down the first coefficient, multiply by r, add to the next column.", `r = ${L(r)}`, `r = ${r}`, `الناتج: ${L(q.join(" , "))} والباقي ${L(rem)}`, `Quotient coefficients: ${q.join(", ")}, remainder ${rem}`) };
};
GEN.g11zeros = function(tier){
  tier = clampTier(tier);
  const n = tier===1 ? 2 : 3;
  const zs = distinctInts(n, -4, 4).sort((a,b)=>a-b);
  const lead = randChoice([1,-1]) * (n===2 ? 0.5 : 0.15);
  const f = x => lead*zs.reduce((p,z)=>p*(x-z),1);
  const poly = zs.map(z=>`(x ${z<0?"+":"−"} ${Math.abs(z)})`).join("").replace(/\(x − 0\)/g,"x").replace(/\(x \+ 0\)/g,"x");
  return { view:{xmin:-6,xmax:6,ymin:-6,ymax:6}, curves:[{pts: sampleFn(f,-6.5,6.5,300)}], answers: zs.map(z=>({x:z,y:0})),
    exprHtml: tier===3 ? `f(x) = ${lead<0?"−":""}${Math.abs(lead)}${poly}` : "",
    promptAr: "اضغط على كل صفر للدالة (حيث يقطع المنحنى محور السينات):", promptEn: "Tap every zero of the function (where the curve crosses the x-axis):",
    ...H("الأصفار هي قيم x التي تجعل f(x) = 0.", "Zeros are the x-values where f(x) = 0.", `لكثيرة الحدود من الدرجة ${L(n)} ${L(n)} أصفار على الأكثر.`, `A degree-${n} polynomial has at most ${n} zeros.`, L(zs.join(" , ")), zs.join(", ")) };
};
GEN.g11fops = function(tier){
  tier = clampTier(tier);
  const a = randInt(1,4), b = randInt(-5,5), c = randInt(-3,3);
  const f = x => a*x + b, g = x => x*x + c;
  const xs = distinctInts(3, -2, 3).sort((p,q)=>p-q);
  const compose = tier >= 2;
  const rows = [[{h:"x"}, ...xs.map(x=>({h:String(x)}))],
    [{h:"f(x)"}, ...xs.map(x=>({v:String(f(x))}))],
    [{h:"g(x)"}, ...xs.map(x=>({v:String(g(x))}))],
    [{h:"(f + g)(x)"}, ...xs.map(x=>({ans:f(x)+g(x)}))]];
  if(compose) rows.push([{h:"(f ∘ g)(x)"}, ...xs.map(x=>({ans:f(g(x))}))]);
  return { blocks:[{rows}],
    visualHtml: `<div class="math-expr" dir="ltr" style="font-size:20px">f(x) = ${a===1?"":a}x ${b<0?"−":"+"} ${Math.abs(b)} &nbsp;&nbsp; g(x) = x² ${c<0?"−":"+"} ${Math.abs(c)}</div>`,
    promptAr: compose ? "أكمل الجدول: (f + g)(x) = f(x) + g(x)، و(f ∘ g)(x) = f(g(x))." : "أكمل الجدول: (f + g)(x) = f(x) + g(x).", promptEn: compose ? "Complete: (f + g)(x) = f(x) + g(x), and (f ∘ g)(x) = f(g(x))." : "Complete: (f + g)(x) = f(x) + g(x).",
    ...H("استخدم صفّي f(x) وg(x) الموجودين في الجدول.", "Use the f(x) and g(x) rows in the table.", "للتركيب: احسب g(x) أولًا، ثم عوّضه في f.", "For composition: compute g(x) first, then plug it into f.", L(`x = ${xs[0]}: f+g = ${f(xs[0])+g(xs[0])}` + (compose ? ` , f(g) = ${f(g(xs[0]))}` : "")), `x = ${xs[0]}: f+g = ${f(xs[0])+g(xs[0])}` + (compose ? `, f(g) = ${f(g(xs[0]))}` : "")) };
};
GEN.g11inverse = function(tier){
  const pool = [
    ["f(x) = x + 5", "f⁻¹(x) = x − 5"], ["f(x) = 3x", "f⁻¹(x) = x/3"], ["f(x) = 2x − 4", "f⁻¹(x) = (x + 4)/2"],
    ["f(x) = x³", "f⁻¹(x) = ∛x"], ["f(x) = x/5 + 1", "f⁻¹(x) = 5(x − 1)"], ["f(x) = 4 − x", "f⁻¹(x) = 4 − x "], ["f(x) = x − 7", "f⁻¹(x) = x + 7"]
  ];
  const pick = shuffleArr(pool).slice(0,4);
  return { ...pairsData(pick), ltr: true,
    ...H("الدالة العكسية تُلغي ما تفعله الدالة.", "The inverse undoes what the function does.", "بدّل x وy ثم حلّ لـ y.", "Swap x and y, then solve for y.", L(pick.map(p=>p[0]+" ↔ "+p[1]).join("   ")), pick.map(p=>p[0]+" ↔ "+p[1]).join("   ")) };
};
GEN.g11sqrt = function(tier){
  tier = clampTier(tier);
  const a = randChoice(tier===1 ? [1] : [1,2,-1]), h = randInt(-4,3), k = randInt(-3,3);
  return { fam:"sqrt", show: tier===3 ? "eq" : "graph", target:{a,h,k},
    params:[{k:"a",label:"a",min:-3,max:3,step:1,v0:1,skip:[0]},{k:"h",label:"h",min:-6,max:6,step:1,v0:0},{k:"k",label:"k",min:-6,max:6,step:1,v0:0}],
    view:{xmin:-7,xmax:7,ymin:-7,ymax:7},
    ...H("y = a√(x − h) + k تبدأ من النقطة (h, k).", "y = a√(x − h) + k starts at (h, k).", "طابق نقطة البداية أولًا، ثم الاتجاه والتمدد.", "Match the starting point first, then direction and stretch.", L(`a = ${a} , h = ${h} , k = ${k}`), `a = ${a}, h = ${h}, k = ${k}`) };
};
GEN.g11simplify = function(tier){
  tier = clampTier(tier);
  const outs = tier===1 ? [2,3] : [2,3,4,5,6];
  const ins = [2,3,5,6,7,10];
  const o = randChoice(outs), i = randChoice(ins);
  const n = o*o*i;
  return { blocks:[{rows:[[{v:`√${n}`}]]}, {op:"="}, {rows:[[{ans:o}]]}, {op:"√"}, {rows:[[{ans:i}]]}], neg:false,
    promptAr: "بسّط الجذر إلى الصورة a√b:", promptEn: "Simplify the radical to the form a√b:",
    ...H("ابحث عن أكبر مربع كامل يقسم العدد.", "Find the largest perfect square factor.", L(`${n} = ${o*o} × ${i}`), `${n} = ${o*o} × ${i}`, L(`√${n} = ${o}√${i}`), `√${n} = ${o}√${i}`) };
};
GEN.g11ratexp = function(tier){
  const pool = [["x^(1/2)","√x"],["x^(1/3)","∛x"],["x^(2/3)","∛(x²)"],["x^(3/2)","√(x³)"],["8^(1/3)","2"],["16^(1/2)","4"],["27^(2/3)","9"],["x^(-1/2)","1/√x"]];
  const pick = shuffleArr(pool).slice(0,4).map(([a,b])=>[a.replace(/\^\(([^)]*)\)/,"<sup>$1</sup>"), b]);
  return { ...pairsData(pick), ltr: true,
    ...H("x^(m/n) = الجذر النوني لـ x^m.", "x^(m/n) = the n-th root of x^m.", "المقام = دليل الجذر، والبسط = الأس.", "Denominator = root index, numerator = power.", "مثال: 27^(2/3) = (∛27)² = 9", "Example: 27^(2/3) = (∛27)² = 9") };
};
