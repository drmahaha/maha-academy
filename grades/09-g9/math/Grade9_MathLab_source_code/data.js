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
   Grade 9 content (الصف الثالث المتوسط) — first term
   =========================================================== */

const GRADE = {"progressKey": "mahaMathLabProgress_g9_v1", "ar": "الصف الثالث المتوسط", "en": "Grade 9"};

/* Grade 9 (3rd intermediate), term 1 chapters: المعادلات الخطية · العلاقات والدوال الخطية ·
   الدوال الخطية · المتباينات الخطية · أنظمة المعادلات الخطية */

const LEVEL_TITLES = [
  { min: 0,   ar: "حلّال المعادلات", en: "Equation Solver" },
  { min: 60,  ar: "محلل العلاقات", en: "Relation Analyst" },
  { min: 150, ar: "صائد الميل", en: "Slope Hunter" },
  { min: 280, ar: "راسم الدوال", en: "Function Grapher" },
  { min: 450, ar: "سيد المتباينات", en: "Inequality Master" },
  { min: 650, ar: "مهندس الأنظمة", en: "Systems Engineer" },
  { min: 900, ar: "خبير مختبر الرياضيات", en: "Math Lab Master" }
];

const MODULES = [
  {
    key: "equations", titleAr: "مختبر المعادلات", titleEn: "Equations Lab", emoji: "⚖️", color: "#7c5cf0",
    guideAr: "ترجم الجمل، وحلّ المعادلات متعددة الخطوات والقيمة المطلقة!", guideEn: "Translate sentences and solve multi-step and absolute-value equations!",
    machines: [
      { key: "g9translate", type: "builder", titleAr: "مترجم المعادلات", titleEn: "Equation Translator", emoji: "🔤", descAr: "حوّل الجملة إلى معادلة.", descEn: "Turn a sentence into an equation." },
      { key: "balance", titleAr: "غرفة موازين المعادلات", titleEn: "Equation Balance Chamber", emoji: "⚖️", descAr: "حلّ المعادلات متعددة الخطوات.", descEn: "Solve multi-step equations." },
      { key: "g9both", type: "keypadvisual", titleAr: "متغير في الطرفين", titleEn: "Variables on Both Sides", emoji: "↔️", descAr: "اجمع المتغيرات في طرف واحد ثم حلّ.", descEn: "Collect the variables on one side, then solve." },
      { key: "g9abs", type: "keypadvisual", titleAr: "معادلات القيمة المطلقة", titleEn: "Absolute Value Equations", emoji: "📏", descAr: "أوجد الحلّين.", descEn: "Find both solutions." }
    ]
  },
  {
    key: "relations", titleAr: "مختبر العلاقات والدوال", titleEn: "Relations & Functions Lab", emoji: "🧬", color: "#17b6a7",
    guideAr: "العلاقات والدوال، والتمثيل البياني، والمتتابعات الحسابية!", guideEn: "Relations, functions, graphs, and arithmetic sequences!",
    machines: [
      { key: "g9isfunc", type: "sortbins", titleAr: "كاشف الدوال", titleEn: "Function Detector", emoji: "🕵️", descAr: "هل العلاقة دالة؟", descEn: "Is the relation a function?" },
      { key: "graphing", titleAr: "استوديو التمثيل البياني", titleEn: "Graphing Studio", emoji: "📈", descAr: "مثّل الدالة الخطية بالنقاط.", descEn: "Plot the linear function's points." },
      { key: "g9zero", type: "graphtap", titleAr: "الحل بيانيًا", titleEn: "Solve Graphically", emoji: "🎯", descAr: "أوجد صفر الدالة من تمثيلها.", descEn: "Find the zero of the function from its graph." },
      { key: "g9seq", type: "gridfill", titleAr: "المتتابعات الحسابية", titleEn: "Arithmetic Sequences", emoji: "🔢", descAr: "أوجد أساس المتتابعة وأكمل حدودها.", descEn: "Find the common difference and extend." }
    ]
  },
  {
    key: "linear", titleAr: "مختبر الدوال الخطية", titleEn: "Linear Functions Lab", emoji: "📐", color: "#22d3ee",
    guideAr: "الميل، وصيغة الميل والمقطع، والمستقيمات المتوازية والمتعامدة!", guideEn: "Slope, slope-intercept form, and parallel and perpendicular lines!",
    machines: [
      { key: "g9slope", type: "keypadvisual", titleAr: "حاسبة الميل", titleEn: "Slope Calculator", emoji: "⛰️", descAr: "احسب الميل من نقطتين.", descEn: "Compute slope from two points." },
      { key: "g9slider", type: "slider", titleAr: "آلة y = mx + b", titleEn: "The y = mx + b Machine", emoji: "🎛️", descAr: "اضبط الميل والمقطع لتطابق المستقيم.", descEn: "Tune slope and intercept to match the line." },
      { key: "g9parallel", type: "sortbins", titleAr: "متوازية أم متعامدة؟", titleEn: "Parallel or Perpendicular?", emoji: "⊥", descAr: "صنّف أزواج المستقيمات.", descEn: "Classify pairs of lines." }
    ]
  },
  {
    key: "ineqsys", titleAr: "مختبر المتباينات والأنظمة", titleEn: "Inequalities & Systems Lab", emoji: "🧩", color: "#ff6f6f",
    guideAr: "مثّل المتباينات، وحلّ أنظمة المعادلات بيانيًا وبالحذف!", guideEn: "Graph inequalities and solve systems graphically and by elimination!",
    machines: [
      { key: "g9ineq", type: "ineqline", titleAr: "راسم المتباينات", titleEn: "Inequality Grapher", emoji: "↔️", descAr: "حلّ المتباينة ومثّلها على خط الأعداد.", descEn: "Solve and graph the inequality." },
      { key: "g9compound", type: "ineqline", titleAr: "المتباينات المركبة", titleEn: "Compound Inequalities", emoji: "🔗", descAr: "مثّل المتباينة المركبة.", descEn: "Graph the compound inequality." },
      { key: "g9sysgraph", type: "graphtap", titleAr: "نقطة التقاطع", titleEn: "Intersection Point", emoji: "✖️", descAr: "حلّ النظام بيانيًا.", descEn: "Solve the system graphically." },
      { key: "g9elim", type: "eqsystem", titleAr: "آلة الحذف", titleEn: "Elimination Machine", emoji: "🧹", descAr: "احذف متغيرًا ثم أوجد الحل.", descEn: "Eliminate a variable, then solve." }
    ]
  },
  {
    key: "arena", titleAr: "ساحة التحدي", titleEn: "Challenge Arena", emoji: "🏆", color: "#f4c542",
    guideAr: "مزيج من كل الأجهزة!", guideEn: "A mix of every machine!",
    machines: [ { key: "mixed", titleAr: "التحدي الشامل", titleEn: "The Grand Challenge", emoji: "🎯", descAr: "مزيج من كل الأجهزة — أظهر إتقانك!", descEn: "A mix of every machine — show your mastery!" } ]
  }
];

const ARENA_POOL = ["g9translate","balance","g9both","g9abs","g9isfunc","graphing","g9zero","g9seq","g9slope","g9slider","g9parallel","g9ineq","g9compound","g9sysgraph","g9elim"];

const GEN = {};
function lin(m, b){ // "3x + 2" style
  const mx = m === 1 ? "x" : m === -1 ? "−x" : `${String(m).replace("-","−")}x`;
  return b === 0 ? mx : `${mx} ${b>0?"+":"−"} ${Math.abs(b)}`;
}

GEN.g9translate = function(tier){
  tier = clampTier(tier);
  const a = randInt(2,9), b = randInt(2,20), c = randInt(10,60);
  const forms = [
    { ar:`مجموع عدد و ${L(b)} يساوي ${L(c)}`, en:`The sum of a number and ${b} is ${c}`, ans:["x","+",String(b),"=",String(c)], alt:[[String(b),"+","x","=",String(c)]] },
    { ar:`${L(a)} أمثال عدد يساوي ${L(c)}`, en:`${a} times a number equals ${c}`, ans:[String(a),"x","=",String(c)], alt:[] },
    { ar:`عدد مطروحًا منه ${L(b)} يساوي ${L(c)}`, en:`A number minus ${b} equals ${c}`, ans:["x","−",String(b),"=",String(c)], alt:[] },
    { ar:`${L(a)} أمثال عدد مضافًا إليها ${L(b)} يساوي ${L(c)}`, en:`${a} times a number, plus ${b}, equals ${c}`, ans:[String(a),"x","+",String(b),"=",String(c)], alt:[] }
  ];
  const f = tier===1 ? randChoice(forms.slice(0,3)) : randChoice(forms);
  const pal = shuffleArr([...new Set(["x", String(a), String(b), String(c), "+", "−", "=", "×"])]);
  return { slots: f.ans.length, palette: pal, answers: [f.ans, ...f.alt], ltr: true,
    promptAr: `اكتب معادلة للجملة: «${f.ar}»`, promptEn: `Write an equation for: “${f.en}”`,
    ...H("استخدم x للعدد المجهول.", "Use x for the unknown number.", "«يساوي» تعني =، و«أمثال» تعني الضرب.", "“is/equals” means =, “times” means multiply.", L(f.ans.join(" ")), f.ans.join(" ")) };
};
GEN.balance = BASE.balance;
GEN.g9both = function(tier){
  tier = clampTier(tier);
  let a, c, x, b, d;
  do { a = randInt(2,9); c = randInt(1,a-1); x = randInt(-6, 10); b = randInt(-10, 10); d = (a-c)*x + b; } while(b === d || (tier===1 && x < 0));
  return { exprHtml: `${lin(a,b)} = ${lin(c,d)}`,
    promptAr: "حلّ المعادلة خطوة بخطوة:", promptEn: "Solve the equation step by step:",
    steps: [
      { ar: `اطرح ${L(c+"x")} من الطرفين: معامل x الجديد = ؟`, en: `Subtract ${c}x from both sides: new coefficient of x = ?`, answer: a-c },
      { ar: "x = ؟", en: "", answer: x, opts: {allowNegative:true} }
    ],
    ...H("اجمع حدود x في طرف والأعداد في الطرف الآخر.", "Put the x terms on one side and the numbers on the other.", L(`${a-c}x = ${d-b}`), `${a-c}x = ${d-b}`, L(`x = ${x}`), `x = ${x}`) };
};
GEN.g9abs = function(tier){
  tier = clampTier(tier);
  const h = tier===1 ? 0 : randInt(-5, 6), k = randInt(1, 9);
  const s1 = h + k, s2 = h - k;
  const inner = h === 0 ? "x" : `x ${h>0?"−":"+"} ${Math.abs(h)}`;
  return { exprHtml: `|${inner}| = ${k}`,
    promptAr: "لمعادلة القيمة المطلقة حلّان. أوجد الأكبر ثم الأصغر:", promptEn: "An absolute-value equation has two solutions. Find the larger, then the smaller:",
    steps: [
      { ar: `الحل الأكبر (${L(inner+" = "+k)}):`, en: `Larger solution (${inner} = ${k}):`, answer: s1, opts:{allowNegative:true} },
      { ar: `الحل الأصغر (${L(inner+" = −"+k)}):`, en: `Smaller solution (${inner} = −${k}):`, answer: s2, opts:{allowNegative:true} }
    ],
    ...H("المسافة عن الصفر تساوي k في الاتجاهين.", "The distance from zero is k in both directions.", "حلّ معادلتين: الداخل = k، والداخل = −k.", "Solve two equations: inside = k and inside = −k.", L(`x = ${s1} , x = ${s2}`), `x = ${s1} or x = ${s2}`) };
};
function mappingHtml(pairs){
  return `<span dir="ltr" style="font-family:var(--font-mono);font-size:15px">{${pairs.map(p=>`(${p[0]}, ${p[1]})`).join(", ")}}</span>`;
}
GEN.g9isfunc = function(tier){
  const items = [];
  for(let i=0;i<3;i++){
    const xs = distinctInts(3, -3, 5), ys = xs.map(()=>randInt(-3,6));
    items.push({ html: mappingHtml(xs.map((x,j)=>[x, ys[j]])), bin: 0 });
  }
  for(let i=0;i<3;i++){
    const xs = distinctInts(2, -3, 5), x0 = xs[0];
    const pairs = shuffleArr([[x0, randInt(-3,2)], [x0, randInt(3,7)], [xs[1], randInt(-3,6)]]);
    items.push({ html: mappingHtml(pairs), bin: 1 });
  }
  return { items: shuffleArr(items).slice(0, tier >= 2 ? 6 : 4), bins: [{ar:"دالة", en:"function", emoji:"✅"}, {ar:"ليست دالة", en:"not a function", emoji:"❌"}],
    ...H("في الدالة: لكل مدخل (x) مخرج واحد فقط.", "In a function, each input (x) has exactly one output.", "ابحث عن قيمة x تتكرر مع قيمتي y مختلفتين.", "Look for an x that repeats with two different y values.", "إذا تكرر x بمخرجين مختلفين ← ليست دالة.", "A repeated x with different outputs → not a function.") };
};
GEN.graphing = BASE.graphing;
GEN.g9zero = function(tier){
  tier = clampTier(tier);
  let m, z; do { m = randChoice(tier===1 ? [1,2,-1,-2] : [1,2,3,-1,-2,-3]); z = randInt(-4, 4); } while(false);
  const b = -m*z;
  const pts = sampleFn(x => m*x + b, -7, 7, 2);
  return { view: {xmin:-6,xmax:6,ymin:-6,ymax:6}, curves: [{pts}],
    exprHtml: `${lin(m, b)} = 0`, answers: [{x:z, y:0}],
    promptAr: "حلّ المعادلة بيانيًا: اضغط على النقطة التي يقطع فيها المستقيم محور السينات.", promptEn: "Solve graphically: tap where the line crosses the x-axis.",
    after: { ar: "إذن x = ؟", en: "So x = ?", answer: z, opts:{allowNegative:true} },
    ...H("حل المعادلة = صفر الدالة = مقطع x.", "The solution = the zero = the x-intercept.", "ابحث عن النقطة التي تكون فيها y = 0.", "Find where y = 0.", L(`x = ${z}`), `x = ${z}`) };
};
GEN.g9seq = function(tier){
  tier = clampTier(tier);
  const d = randChoice(tier===1 ? [2,3,5,10] : [-4,-3,3,4,6,7,-5]);
  const a1 = randInt(-10, 15);
  const terms = Array.from({length:5}).map((_,i)=>a1+i*d);
  const n = randChoice([10, 12, 15, 20]);
  const blocks = [{ rows: [[{h:"n"}, ...terms.map((_,i)=>({h:String(i+1)}))], [{h:"aₙ"}, ...terms.map((t,i)=> i<2 ? {v:String(t)} : {ans:t})]] },
                  { rows: [[{h:"d"}, {h:`a<sub>${n}</sub>`}], [{ans:d}, {ans:a1+(n-1)*d}]] }];
  return { blocks,
    promptAr: `أكمل حدود المتتابعة الحسابية، ثم أوجد أساسها d والحد ${L("a"+n)}:`, promptEn: `Complete the arithmetic sequence, then find d and a${n}:`,
    ...H("الأساس d = الفرق بين أي حدين متتاليين.", "d = the difference between consecutive terms.", `aₙ = a₁ + (n − 1)d`, `aₙ = a₁ + (n − 1)d`, L(`d = ${d} , a${n} = ${a1} + ${n-1}×${d} = ${a1+(n-1)*d}`), `d = ${d}, a${n} = ${a1+(n-1)*d}`) };
};
GEN.g9slope = function(tier){
  tier = clampTier(tier);
  let x1,y1,x2,y2;
  do { x1 = randInt(-4,3); y1 = randInt(-4,4); x2 = randInt(x1+1, 5); y2 = randInt(-5,5); } while(y2 === y1 && tier > 1);
  const num = y2-y1, den = x2-x1;
  return { visualHtml: VIS.grid({xmin:-6,xmax:6,ymin:-6,ymax:6, W:280, H:280, segs:[{a:[x1,y1], b:[x2,y2]}], pts:[{x:x1,y:y1,label:"A"},{x:x2,y:y2,label:"B"}]}),
    exprHtml: `A(${x1}, ${y1})   B(${x2}, ${y2})`,
    promptAr: "احسب ميل المستقيم AB:", promptEn: "Find the slope of line AB:",
    steps: [
      { ar: "التغير الرأسي (y₂ − y₁):", en: "Rise (y₂ − y₁):", answer: num, opts:{allowNegative:true} },
      { ar: "التغير الأفقي (x₂ − x₁):", en: "Run (x₂ − x₁):", answer: den },
      { ar: "الميل m = ؟ (يمكن كتابته ككسر)", en: "Slope m = ? (a fraction is fine)", answer: fracStr(num, den), opts:{allowNegative:true, allowFraction:true} }
    ],
    ...H("الميل = التغير الرأسي ÷ التغير الأفقي.", "Slope = rise ÷ run.", L(`(${y2} − ${y1}) ÷ (${x2} − ${x1})`), `(${y2} − ${y1}) ÷ (${x2} − ${x1})`, L(`m = ${fracStr(num,den)}`), `m = ${fracStr(num,den)}`) };
};
GEN.g9slider = function(tier){
  tier = clampTier(tier);
  const m = randChoice(tier===1 ? [1,2,3,-1,-2] : [-3,-2,-1,1,2,3,0.5,-0.5]);
  const b = randInt(-4, 4);
  return { fam: "linear", show: tier===3 ? "eq" : "graph", target: {m, b},
    params: [ {k:"m", label:"m", min:-4, max:4, step:0.5, v0:0}, {k:"b", label:"b", min:-6, max:6, step:1, v0:0} ],
    view: {xmin:-6,xmax:6,ymin:-6,ymax:6},
    ...H("b = مقطع المحور y، وm = الميل.", "b = y-intercept, m = slope.", "اضبط b أولًا حتى يمر المستقيم بالنقطة الصحيحة على محور y، ثم اضبط الميل.", "Set b first so the line crosses the y-axis correctly, then set the slope.", L(`y = ${lin(m, b).replace("0.5x","0.5x")}`), `y = ${lin(m,b)}`) };
};
GEN.g9parallel = function(tier){
  const items = [];
  const mk = (m1, b1, m2, b2) => `<span dir="ltr" style="font-family:var(--font-mono);font-size:14px">y = ${lin(m1,b1)}<br>y = ${lin(m2,b2)}</span>`;
  for(let i=0;i<2;i++){ const m = randChoice([2,3,-1,-4,5]); items.push({html: mk(m, randInt(-5,0), m, randInt(1,6)), bin: 0}); }
  for(let i=0;i<2;i++){
    const m = randChoice([2,3,-2,4,-3]), b1 = randInt(-5,5);
    const pm = fracStr(-1, m).replace("-","−");
    items.push({html: `<span dir="ltr" style="font-family:var(--font-mono);font-size:14px">y = ${lin(m,b1)}<br>y = ${pm}x ${randChoice(["+ 1","− 2","+ 3"])}</span>`, bin: 1});
  }
  for(let i=0;i<2;i++){ const m1 = randChoice([2,3]); const m2 = randChoice([1,-1,5]); items.push({html: mk(m1, randInt(-4,4), m2, randInt(-4,4)), bin: 2}); }
  return { items: shuffleArr(items), bins: [{ar:"متوازيان", en:"parallel", emoji:"∥"}, {ar:"متعامدان", en:"perpendicular", emoji:"⊥"}, {ar:"غير ذلك", en:"neither", emoji:"✳️"}],
    ...H("قارن ميلي المستقيمين.", "Compare the two slopes.", "الميل نفسه ← متوازيان. حاصل ضرب الميلين = −1 ← متعامدان.", "Same slope → parallel. Slopes multiply to −1 → perpendicular.", "مثال: 2 و −1/2 متعامدان.", "Example: 2 and −1/2 are perpendicular.") };
};
GEN.g9ineq = function(tier){
  tier = clampTier(tier);
  const ops = ["<","≤",">","≥"];
  let op = randChoice(ops);
  const p = randInt(-5, 5);
  let exprHtml;
  if(tier === 1) exprHtml = `x ${op} ${p}`;
  else {
    let a = randInt(2,4); const neg = tier === 3 && Math.random() < .5;
    if(neg) a = -a;
    const b = randInt(-6, 6);
    const shown = neg ? {"<":">","≤":"≥",">":"<","≥":"≤"}[op] : op;
    exprHtml = `${lin(a, b)} ${shown} ${a*p + b}`;
  }
  const closed = op === "≤" || op === "≥", dir = (op === ">" || op === "≥") ? 1 : -1;
  return { mode: "single", min: -8, max: 8, p, closed, dir, exprHtml,
    ...H("حلّ المتباينة مثل المعادلة، ثم مثّلها.", "Solve like an equation, then graph.", tier===3 ? "إذا ضربت أو قسمت على عدد سالب اقلب رمز المتباينة!" : "≤ و≥ ← دائرة مغلقة، < و> ← دائرة مفتوحة.", tier===3 ? "Multiplying or dividing by a negative flips the sign!" : "≤ and ≥ → closed circle, < and > → open circle.", L(`x ${op} ${p}`), `x ${op} ${p}`) };
};
GEN.g9compound = function(tier){
  const p1 = randInt(-6, 1), p2 = randInt(p1+2, 7);
  const c1 = Math.random() < .5, c2 = Math.random() < .5;
  return { mode: "between", min: -8, max: 8, p1, p2, closed1: c1, closed2: c2,
    exprHtml: `${p1} ${c1?"≤":"<"} x ${c2?"≤":"<"} ${p2}`,
    promptAr: "مثّل المتباينة المركبة (و): اضغط الطرفين، ثم اختر نوع كل دائرة.", promptEn: "Graph the compound (and) inequality: tap both ends, then choose each circle.",
    ...H("«و» تعني الأعداد بين الطرفين.", "“and” means the numbers between the two ends.", "الطرف مع ≤ ← دائرة مغلقة (●)، ومع < ← مفتوحة (○).", "An end with ≤ → closed (●); with < → open (○).", `بين ${L(p1)} و ${L(p2)}`, `between ${p1} and ${p2}`) };
};
GEN.g9sysgraph = function(tier){
  tier = clampTier(tier);
  const x0 = randInt(-4,4), y0 = randInt(-4,4);
  let m1, m2; do { m1 = randChoice([-2,-1,1,2,3]); m2 = randChoice([-3,-1,0,1,2]); } while(m1 === m2);
  const b1 = y0 - m1*x0, b2 = y0 - m2*x0;
  return { view:{xmin:-6,xmax:6,ymin:-6,ymax:6}, curves: [{pts: sampleFn(x=>m1*x+b1, -7, 7, 2)}, {pts: sampleFn(x=>m2*x+b2, -7, 7, 2), cls:"b"}],
    legendHtml: `<span dir="ltr"><span style="color:var(--cyan-400)">y = ${lin(m1,b1)}</span> &nbsp; <span style="color:var(--purple-400)">y = ${lin(m2,b2)}</span></span>`,
    answers: [{x:x0, y:y0}],
    promptAr: "حلّ النظام بيانيًا: اضغط على نقطة تقاطع المستقيمين.", promptEn: "Solve the system graphically: tap the intersection point.",
    ...H("حل النظام هو النقطة المشتركة بين المستقيمين.", "The solution is the point both lines share.", "تتبّع المستقيمين حتى يلتقيا.", "Follow both lines until they meet.", L(`(${x0}, ${y0})`), `(${x0}, ${y0})`) };
};
GEN.g9elim = function(tier){
  tier = clampTier(tier);
  const x = randInt(-5,6), y = randInt(-5,6);
  let a1,b1,a2,b2;
  if(tier === 1){ a1 = randInt(1,4); b1 = randInt(1,4); a2 = randInt(1,4); b2 = -b1; }
  else if(tier === 2){ a1 = randInt(1,3); b1 = randInt(1,4); a2 = a1; b2 = randInt(-4,4); if(b2 === b1) b2 = b1 + 1; if(b2===0) b2 = -1; }
  else { a1 = randInt(1,3); b1 = randInt(2,4); a2 = randInt(1,3)*2; b2 = randInt(1,3); if(a1*b2 === a2*b1) b2++; }
  return { e1: [a1,b1,a1*x+b1*y], e2: [a2,b2,a2*x+b2*y], x, y,
    ...H("اجعل معامل أحد المتغيرين متعاكسًا أو متساويًا في المعادلتين، ثم اجمع أو اطرح.", "Make one variable's coefficients opposite or equal, then add or subtract.",
         tier===1 ? "معاملا y متعاكسان: اجمع المعادلتين." : tier===2 ? "معاملا x متساويان: اطرح المعادلتين." : "اضرب إحدى المعادلتين أولًا.", tier===1 ? "The y-coefficients are opposites: add the equations." : tier===2 ? "The x-coefficients are equal: subtract." : "Multiply one equation first.",
         L(`x = ${x} , y = ${y}`), `x = ${x}, y = ${y}`) };
};
