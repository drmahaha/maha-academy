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
   Grade 10 content (الصف الأول الثانوي) — first term
   =========================================================== */

const GRADE = {"progressKey": "mahaMathLabProgress_g10_v1", "ar": "الصف الأول الثانوي", "en": "Grade 10"};

/* Grade 10 (Math 1-1, tracks system), term 1 chapters: التبرير والبرهان ·
   التوازي والتعامد · المثلثات المتطابقة · العلاقات في المثلث */

const LEVEL_TITLES = [
  { min: 0,   ar: "صاحب التخمين", en: "Conjecture Maker" },
  { min: 60,  ar: "المنطقي", en: "Logician" },
  { min: 150, ar: "كاتب البراهين", en: "Proof Writer" },
  { min: 280, ar: "خبير التوازي", en: "Parallel Lines Expert" },
  { min: 450, ar: "محقق التطابق", en: "Congruence Detective" },
  { min: 650, ar: "مهندس المثلثات", en: "Triangle Engineer" },
  { min: 900, ar: "خبير مختبر الرياضيات", en: "Math Lab Master" }
];

const MODULES = [
  {
    key: "reason", titleAr: "مختبر التبرير والبرهان", titleEn: "Reasoning & Proof Lab", emoji: "🧠", color: "#7c5cf0",
    guideAr: "التخمين، والمنطق، والعبارات الشرطية، والبرهان الجبري!", guideEn: "Conjectures, logic, conditional statements, and algebraic proof!",
    machines: [
      { key: "g10conj", type: "gridfill", titleAr: "آلة التخمين", titleEn: "Conjecture Machine", emoji: "🔮", descAr: "لاحظ النمط وخمّن الحدود التالية.", descEn: "Spot the pattern and conjecture what's next." },
      { key: "g10truth", type: "gridfill", titleAr: "جدول الصواب", titleEn: "Truth Table", emoji: "✅", descAr: "أكمل جدول الصواب للعبارات المركبة.", descEn: "Complete the truth table for compound statements." },
      { key: "g10cond", type: "builder", titleAr: "مصنع العبارات الشرطية", titleEn: "Conditional Factory", emoji: "🏭", descAr: "كوّن العكس والمعكوس والمعاكس الإيجابي.", descEn: "Form the converse, inverse, and contrapositive." },
      { key: "g10proof", type: "ordercards", titleAr: "مرتّب البرهان الجبري", titleEn: "Algebraic Proof Sorter", emoji: "📜", descAr: "رتّب خطوات البرهان مع مبرراتها.", descEn: "Order the proof steps with their reasons." }
    ]
  },
  {
    key: "parallel", titleAr: "مختبر التوازي والتعامد", titleEn: "Parallel & Perpendicular Lab", emoji: "∥", color: "#17b6a7",
    guideAr: "الزوايا والقاطع، والميل، وصيغ معادلة المستقيم!", guideEn: "Angles and transversals, slope, and forms of a line!",
    machines: [
      { key: "g10angmatch", type: "anglelab", titleAr: "كاشف الزوايا المتطابقة", titleEn: "Congruent Angle Finder", emoji: "🔍", descAr: "اضغط على كل الزوايا المتطابقة.", descEn: "Tap every congruent angle." },
      { key: "g10angfind", type: "anglelab", titleAr: "حاسبة الزوايا", titleEn: "Angle Calculator", emoji: "📏", descAr: "استخدم علاقات الزوايا لإيجاد القياس.", descEn: "Use angle relationships to find the measure." },
      { key: "g10slope", type: "keypadvisual", titleAr: "حاسبة الميل", titleEn: "Slope Calculator", emoji: "⛰️", descAr: "احسب الميل من نقطتين.", descEn: "Compute the slope from two points." },
      { key: "g10forms", type: "slider", titleAr: "صيغ معادلة المستقيم", titleEn: "Forms of a Line", emoji: "🎛️", descAr: "ارسم المستقيم من معادلته.", descEn: "Graph the line from its equation." }
    ]
  },
  {
    key: "congruent", titleAr: "مختبر المثلثات المتطابقة", titleEn: "Congruent Triangles Lab", emoji: "🔺", color: "#22d3ee",
    guideAr: "صنّف المثلثات، وزواياها، وحالات التطابق!", guideEn: "Classify triangles, their angles, and congruence postulates!",
    machines: [
      { key: "g10byangles", type: "sortbins", titleAr: "تصنيف حسب الزوايا", titleEn: "Classify by Angles", emoji: "📐", descAr: "حاد أم قائم أم منفرج؟", descEn: "Acute, right, or obtuse?" },
      { key: "g10bysides", type: "sortbins", titleAr: "تصنيف حسب الأضلاع", titleEn: "Classify by Sides", emoji: "📏", descAr: "مختلف أم متطابق الضلعين أم الأضلاع؟", descEn: "Scalene, isosceles, or equilateral?" },
      { key: "g10tri", type: "anglelab", titleAr: "زوايا المثلث", titleEn: "Triangle Angles", emoji: "🔻", descAr: "الزوايا الداخلية والخارجية.", descEn: "Interior and exterior angles." },
      { key: "g10cong", type: "sortbins", titleAr: "حالات التطابق", titleEn: "Congruence Postulates", emoji: "🟰", descAr: "SSS أم SAS أم ASA أم AAS؟", descEn: "SSS, SAS, ASA, or AAS?" }
    ]
  },
  {
    key: "relations", titleAr: "مختبر العلاقات في المثلث", titleEn: "Triangle Relationships Lab", emoji: "🔷", color: "#ff6f6f",
    guideAr: "متباينة المثلث، والأضلاع والزوايا، والقطع المتوسطة!", guideEn: "The triangle inequality, sides vs angles, and medians!",
    machines: [
      { key: "g10ineq", type: "sortbins", titleAr: "متباينة المثلث", titleEn: "Triangle Inequality", emoji: "📦", descAr: "هل تكوّن الأطوال مثلثًا؟", descEn: "Can these lengths form a triangle?" },
      { key: "g10order", type: "ordercards", titleAr: "الأضلاع والزوايا", titleEn: "Sides and Angles", emoji: "↕️", descAr: "رتّب الأضلاع حسب الزوايا المقابلة.", descEn: "Order sides by their opposite angles." },
      { key: "g10centroid", type: "graphtap", titleAr: "مركز المثلث", titleEn: "Centroid Finder", emoji: "🎯", descAr: "أوجد نقطة تقاطع القطع المتوسطة.", descEn: "Find where the medians meet." }
    ]
  },
  {
    key: "arena", titleAr: "ساحة التحدي", titleEn: "Challenge Arena", emoji: "🏆", color: "#f4c542",
    guideAr: "مزيج من كل الأجهزة!", guideEn: "A mix of every machine!",
    machines: [ { key: "mixed", titleAr: "التحدي الشامل", titleEn: "The Grand Challenge", emoji: "🎯", descAr: "مزيج من كل الأجهزة — أظهر إتقانك!", descEn: "A mix of every machine — show your mastery!" } ]
  }
];

const ARENA_POOL = ["g10conj","g10truth","g10cond","g10proof","g10angmatch","g10angfind","g10slope","g10forms","g10byangles","g10bysides","g10tri","g10cong","g10ineq","g10order","g10centroid"];

const GEN = {};
function lin10(m, b){ const mx = m === 1 ? "x" : m === -1 ? "−x" : `${String(m).replace("-","−")}x`; return b === 0 ? mx : `${mx} ${b>0?"+":"−"} ${Math.abs(b)}`; }

GEN.g10conj = function(tier){
  tier = clampTier(tier);
  const kinds = [
    () => { const a = randInt(1,5), d = randInt(2,6); return {t: Array.from({length:6}).map((_,i)=>a+i*d), ar:`أضف ${L(d)}`, en:`add ${d}`}; },
    () => { const a = randInt(1,3), r = randChoice([2,3]); return {t: Array.from({length:6}).map((_,i)=>a*Math.pow(r,i)), ar:`اضرب في ${L(r)}`, en:`multiply by ${r}`}; },
    () => ({t: [1,4,9,16,25,36], ar:"مربعات الأعداد", en:"perfect squares"}),
    () => { const a = randInt(1,4); const t=[a]; for(let i=1;i<6;i++) t.push(t[i-1]+i); return {t, ar:"الفرق يزيد 1 كل مرة", en:"the difference grows by 1"}; }
  ];
  const k = tier===1 ? kinds[randInt(0,1)]() : randChoice(kinds)();
  const row = k.t.map((v,i)=> i >= 4 ? {ans:v} : {v:String(v)});
  return { blocks:[{rows:[row]}], neg:false,
    promptAr: "التبرير الاستقرائي: لاحظ النمط، وخمّن الحدين التاليين:", promptEn: "Inductive reasoning: study the pattern and conjecture the next two terms:",
    ...H("قارن الحدود المتتالية: فرق؟ نسبة؟ مربعات؟", "Compare consecutive terms: difference? ratio? squares?", `القاعدة: ${k.ar}`, `Rule: ${k.en}`, L(k.t.join(" ، ")), k.t.join(", ")) };
};
GEN.g10truth = function(tier){
  tier = clampTier(tier);
  const T = "T", F = "F";
  const rows = [[T,T],[T,F],[F,T],[F,F]];
  const colsAll = [
    {h:"~p", f:(p,q)=>!p}, {h:"p ∧ q", f:(p,q)=>p&&q}, {h:"p ∨ q", f:(p,q)=>p||q}, {h:"p → q", f:(p,q)=>!p||q}, {h:"~q", f:(p,q)=>!q}
  ];
  const cols = tier===1 ? [colsAll[0], colsAll[1]] : tier===2 ? [colsAll[1], colsAll[2]] : [colsAll[2], colsAll[3]];
  const show = ["ص (T)","خ (F)"];
  const grid = [[{h:"p"},{h:"q"}, ...cols.map(c=>({h:c.h}))],
    ...rows.map(([p,q]) => [{v:p===T?"ص":"خ"},{v:q===T?"ص":"خ"}, ...cols.map(c => ({ans: c.f(p===T,q===T) ? "T" : "F", cycle:["T","F"], show}))])];
  return { blocks:[{rows:grid}],
    promptAr: "أكمل جدول الصواب: اضغط على الخانة لتبدّل بين ص (صائبة) وخ (خاطئة).", promptEn: "Complete the truth table: tap a box to switch between T (true) and F (false).",
    ...H("∧ (و): صائبة فقط إذا كانت العبارتان صائبتين. ∨ (أو): خاطئة فقط إذا كانتا خاطئتين.", "∧ (and): true only if both are true. ∨ (or): false only if both are false.", "p → q خاطئة فقط عندما p صائبة وq خاطئة. ~p عكس p.", "p → q is false only when p is true and q is false. ~p flips p.", "تحقق من كل صف على حدة.", "Check each row separately.") };
};
const G10_CONDS = [
  { p:"الشكل مربع", q:"له أربعة أضلاع", np:"الشكل ليس مربعًا", nq:"ليس له أربعة أضلاع" },
  { p:"الزاوية قائمة", q:"قياسها 90°", np:"الزاوية ليست قائمة", nq:"قياسها ليس 90°" },
  { p:"العدد يقبل القسمة على 4", q:"هو عدد زوجي", np:"العدد لا يقبل القسمة على 4", nq:"ليس عددًا زوجيًا" },
  { p:"اليوم جمعة", q:"لا توجد مدرسة", np:"اليوم ليس جمعة", nq:"توجد مدرسة" }
];
GEN.g10cond = function(tier){
  tier = clampTier(tier);
  const c = randChoice(G10_CONDS);
  const kinds = [
    { ar:"العكس", en:"converse", ans:[c.q, c.p] },
    { ar:"المعكوس", en:"inverse", ans:[c.np, c.nq] },
    { ar:"المعاكس الإيجابي", en:"contrapositive", ans:[c.nq, c.np] }
  ];
  const k = tier===1 ? kinds[0] : tier===2 ? randChoice(kinds.slice(0,2)) : randChoice(kinds);
  return { slots: 2, prefix: "إذا", between: ["فإن"], palette: shuffleArr([c.p, c.q, c.np, c.nq]), answers: [k.ans],
    visualHtml: `<div class="pv-target" style="font-size:18px">العبارة الشرطية: إذا ${c.p} فإن ${c.q}.</div>`,
    promptAr: `كوّن ${k.ar} للعبارة الشرطية:`, promptEn: `Form the ${k.en} of the conditional:`,
    ...H("العكس: بدّل الفرض والنتيجة. المعكوس: انفِ الاثنين. المعاكس الإيجابي: بدّل وانفِ.", "Converse: swap. Inverse: negate both. Contrapositive: swap and negate.", `${k.ar}: ${k.ar==="العكس"?"بدّل":"استخدم النفي"}`, `${k.en}`, `إذا ${k.ans[0]} فإن ${k.ans[1]}`, `If ${k.ans[0]} then ${k.ans[1]}`) };
};
GEN.g10proof = function(tier){
  tier = clampTier(tier);
  const a = randInt(2,6), b = randInt(1,9), x = randInt(2,9), c = a*x + b;
  const steps = [
    `<span dir="ltr">${a}x + ${b} = ${c}</span> <small>(معطى)</small>`,
    `<span dir="ltr">${a}x = ${c-b}</span> <small>(خاصية الطرح للمساواة)</small>`,
    `<span dir="ltr">x = ${x}</span> <small>(خاصية القسمة للمساواة)</small>`
  ];
  if(tier >= 2) steps.splice(1, 0, `<span dir="ltr">${a}x + ${b} − ${b} = ${c} − ${b}</span> <small>(اطرح ${b} من الطرفين)</small>`);
  const idx = shuffleArr(steps.map((_,i)=>i));
  return { cards: idx.map(i=>steps[i]), order: idx.map((_,k)=>idx.indexOf(k)),
    firstAr: "الخطوة الأولى", firstEn: "first step", lastAr: "النتيجة", lastEn: "conclusion",
    promptAr: `رتّب خطوات البرهان الجبري لإثبات أن ${L("x = "+x)}:`, promptEn: `Order the steps of the algebraic proof that x = ${x}:`,
    ...H("يبدأ البرهان دائمًا بالمعطى.", "A proof always starts with the given.", "كل خطوة تنتج من التي قبلها بخاصية واحدة.", "Each step follows from the previous one by one property.", "المعطى ← الطرح ← القسمة.", "Given → subtraction → division.") };
};
GEN.g10angmatch = function(tier){
  const theta = randChoice([35,40,50,55,60,65,70,75,105,110,115,120,125,130,140]);
  return { mode: "match", theta, given: randInt(0,7),
    ...H("المتناظرة، والمتبادلة داخليًا وخارجيًا، والمتقابلة بالرأس متطابقة.", "Corresponding, alternate interior/exterior, and vertical angles are congruent.", "كل زاوية تطابق 3 زوايا أخرى.", "Each angle matches 3 others.", "4 زوايا حادة متطابقة و4 منفرجة متطابقة.", "4 congruent acute angles and 4 congruent obtuse angles.") };
};
GEN.g10angfind = function(tier){
  const theta = randChoice([35,40,50,55,60,65,70,75,105,110,115,120,125,130,140]);
  const given = randInt(0,7); let target; do { target = randInt(0,7); } while(target === given);
  const meas = [theta,180-theta,theta,180-theta,theta,180-theta,theta,180-theta];
  return { mode: "find", theta, given, target,
    ...H("إذا لم تكونا متطابقتين فهما متكاملتان.", "If they aren't congruent, they're supplementary.", meas[target]===meas[given] ? "هاتان متطابقتان." : "هاتان متكاملتان: 180° − الزاوية المعطاة.", meas[target]===meas[given] ? "These are congruent." : "These are supplementary: 180° − the given angle.", `${L(meas[target]+"°")}`, `${meas[target]}°`) };
};
GEN.g10slope = function(tier){
  tier = clampTier(tier);
  let x1,y1,x2,y2; do { x1 = randInt(-5,2); y1 = randInt(-5,5); x2 = randInt(x1+1,5); y2 = randInt(-5,5); } while(y1 === y2);
  const num = y2-y1, den = x2-x1;
  return { visualHtml: VIS.grid({xmin:-6,xmax:6,ymin:-6,ymax:6,W:280,H:280,segs:[{a:[x1,y1],b:[x2,y2]}],pts:[{x:x1,y:y1,label:"A"},{x:x2,y:y2,label:"B"}]}),
    exprHtml: `A(${x1}, ${y1})  B(${x2}, ${y2})`, answer: fracStr(num,den), opts:{allowNegative:true, allowFraction:true},
    promptAr: "احسب ميل المستقيم AB (اكتبه ككسر إذا لزم):", promptEn: "Find the slope of AB (a fraction if needed):",
    ...H("m = (y₂ − y₁) ÷ (x₂ − x₁)", "m = (y₂ − y₁) ÷ (x₂ − x₁)", L(`(${y2} − ${y1}) ÷ (${x2} − ${x1}) = ${num} ÷ ${den}`), `(${y2} − ${y1}) ÷ (${x2} − ${x1}) = ${num} ÷ ${den}`, L(`m = ${fracStr(num,den)}`), `m = ${fracStr(num,den)}`) };
};
GEN.g10forms = function(tier){
  tier = clampTier(tier);
  const m = randChoice([-3,-2,-1,1,2,3,0.5,-0.5]), b = randInt(-4,4);
  return { fam:"linear", show:"eq", target:{m,b},
    params: [ {k:"m", label:"m", min:-4, max:4, step:0.5, v0:0}, {k:"b", label:"b", min:-6, max:6, step:1, v0:0} ],
    view: {xmin:-6,xmax:6,ymin:-6,ymax:6},
    ...H("صيغة الميل والمقطع: y = mx + b.", "Slope-intercept form: y = mx + b.", "b هو مقطع y، وm يحدد الانحدار.", "b is the y-intercept; m sets the steepness.", L(`m = ${m} , b = ${b}`), `m = ${m}, b = ${b}`) };
};
GEN.g10byangles = function(tier){
  const items = [];
  const mk = (a,b) => `<span dir="ltr">${a}°, ${b}°, ${180-a-b}°</span>`;
  for(let i=0;i<2;i++){ let a,b; do { a = randInt(40,85); b = randInt(40,85); } while(180-a-b >= 90 || 180-a-b <= 0); items.push({html: mk(a,b), bin:0}); }
  for(let i=0;i<2;i++){ const a = randInt(20,70); items.push({html: `<span dir="ltr">90°, ${a}°, ${90-a}°</span>`, bin:1}); }
  for(let i=0;i<2;i++){ const a = randInt(95,140), b = randInt(10, 170-a-10); items.push({html: mk(a,b), bin:2}); }
  return { items: shuffleArr(items), bins: [{ar:"حاد الزوايا", en:"acute"}, {ar:"قائم الزاوية", en:"right"}, {ar:"منفرج الزاوية", en:"obtuse"}],
    ...H("انظر إلى أكبر زاوية في المثلث.", "Look at the largest angle.", "أكبر زاوية < 90° ← حاد، = 90° ← قائم، > 90° ← منفرج.", "Largest < 90° → acute, = 90° → right, > 90° → obtuse.", "صنّف حسب أكبر زاوية.", "Classify by the largest angle.") };
};
GEN.g10bysides = function(tier){
  const items = [];
  for(let i=0;i<2;i++){ const s = distinctInts(3, 3, 12).sort((a,b)=>a-b); if(s[0]+s[1] <= s[2]) s[2] = s[0]+s[1]-1; items.push({html:`<span dir="ltr">${s.join(", ")}</span>`, bin:0}); }
  for(let i=0;i<2;i++){ const a = randInt(4,10); let b; do { b = randInt(2, 2*a-1); } while(b === a); items.push({html:`<span dir="ltr">${shuffleArr([a,a,b]).join(", ")}</span>`, bin:1}); }
  for(let i=0;i<2;i++){ const a = randInt(3,12); items.push({html:`<span dir="ltr">${a}, ${a}, ${a}</span>`, bin:2}); }
  return { items: shuffleArr(items), bins: [{ar:"مختلف الأضلاع", en:"scalene"}, {ar:"متطابق الضلعين", en:"isosceles"}, {ar:"متطابق الأضلاع", en:"equilateral"}],
    ...H("قارن أطوال الأضلاع الثلاثة.", "Compare the three side lengths.", "لا تساوٍ ← مختلف، ضلعان متساويان ← متطابق الضلعين، الثلاثة ← متطابق الأضلاع.", "None equal → scalene, two → isosceles, three → equilateral.", "صنّف حسب عدد الأضلاع المتساوية.", "Classify by how many sides are equal.") };
};
GEN.g10tri = function(tier){
  tier = clampTier(tier);
  let A, B; do { A = randInt(4,16)*5; B = randInt(4,16)*5; } while(A + B > 150);
  const ext = tier >= 2 && Math.random() < .5;
  return { mode: ext ? "ext" : "tri", A, B,
    ...H(ext ? "الزاوية الخارجية = مجموع الزاويتين الداخليتين البعيدتين." : "مجموع الزوايا الداخلية = 180°.", ext ? "Exterior angle = sum of the remote interior angles." : "Interior angles sum to 180°.", ext ? L(`${A} + ${180-A-B}`) : L(`180 − ${A} − ${B}`), ext ? `${A} + ${180-A-B}` : `180 − ${A} − ${B}`, `${L((ext?180-B:180-A-B)+"°")}`, `${ext?180-B:180-A-B}°`) };
};
function congSvg(kind){
  // triangle A(20,150) B(170,150) C(70,40); marks per postulate
  const P = [[20,150],[170,150],[70,40]];
  const draw = (dx, flip) => {
    const Q = P.map(([x,y]) => [dx + (flip ? 190 - x : x), y]);
    let s = `<polygon points="${Q.map(q=>q.join(",")).join(" ")}" fill="rgba(34,211,238,.12)" stroke="#22d3ee" stroke-width="2.5"/>`;
    const tick = (i,j,n) => { const [x1,y1]=Q[i],[x2,y2]=Q[j]; const mx=(x1+x2)/2, my=(y1+y2)/2; const dx2=x2-x1, dy2=y2-y1, L2=Math.hypot(dx2,dy2); const nx=-dy2/L2*7, ny=dx2/L2*7; let t=""; for(let k=0;k<n;k++){ const o=(k-(n-1)/2)*6; const ox=dx2/L2*o, oy=dy2/L2*o; t+=`<line x1="${mx+ox-nx}" y1="${my+oy-ny}" x2="${mx+ox+nx}" y2="${my+oy+ny}" stroke="#f4c542" stroke-width="2.5"/>`; } return t; };
    const arc = (i,n) => { const [x,y]=Q[i]; const [st, sw] = angleStart(Q,i); let t=""; for(let k=0;k<n;k++){ const rr = 16+k*5; t+=`<circle cx="${x}" cy="${y}" r="${rr}" fill="none" stroke="#f472b6" stroke-width="2.5" stroke-dasharray="${(rr*sw*Math.PI/180).toFixed(1)} 999" transform="rotate(${st.toFixed(1)} ${x} ${y})"/>`; } return t; };
    const marks = {
      SSS: tick(0,1,1)+tick(1,2,2)+tick(2,0,3),
      SAS: tick(0,1,1)+tick(0,2,2)+arc(0,1),
      ASA: arc(0,1)+arc(1,2)+tick(0,1,1),
      AAS: arc(0,1)+arc(1,2)+tick(1,2,1)
    }[kind];
    return s + marks;
  };
  return `<svg width="400" height="170" viewBox="0 0 400 170">${draw(0,false)}${draw(205,true)}</svg>`;
}
function angleStart(Q, i){
  const [x,y] = Q[i], a = Q[(i+1)%3], b = Q[(i+2)%3];
  const a1 = Math.atan2(a[1]-y, a[0]-x)*180/Math.PI, a2 = Math.atan2(b[1]-y, b[0]-x)*180/Math.PI;
  let d = a2 - a1; while(d < -180) d += 360; while(d > 180) d -= 360;
  return d > 0 ? [a1, d] : [a2, -d];
}
GEN.g10cong = function(tier){
  const kinds = shuffleArr(["SSS","SAS","ASA","AAS"]);
  const items = kinds.slice(0, tier===1 ? 2 : 4).map((k,i) => ({ html: `<div style="transform:scale(.62);transform-origin:center;margin:-30px -70px">${congSvg(k)}</div>`, bin: ["SSS","SAS","ASA","AAS"].indexOf(k) }));
  return { items, bins: [{ar:"SSS", en:"3 sides"}, {ar:"SAS", en:"side-angle-side"}, {ar:"ASA", en:"angle-side-angle"}, {ar:"AAS", en:"angle-angle-side"}],
    promptAr: "العلامات تبيّن الأجزاء المتطابقة. اختر حالة التطابق المناسبة لكل زوج:", promptEn: "Marks show the congruent parts. Pick the congruence postulate for each pair:",
    ...H("الخطوط الصغيرة = أضلاع متطابقة، والأقواس = زوايا متطابقة.", "Tick marks = congruent sides; arcs = congruent angles.", "SAS: الزاوية بين الضلعين. ASA: الضلع بين الزاويتين. AAS: الضلع ليس بين الزاويتين.", "SAS: angle between the sides. ASA: side between the angles. AAS: side not between them.", "عُدّ الأضلاع والزوايا المعلَّمة ثم انظر إلى موقعها.", "Count the marked sides and angles, then check their positions.") };
};
GEN.g10ineq = function(tier){
  const items = [];
  for(let i=0;i<3;i++){ const a = randInt(3,10), b = randInt(3,10), c = randInt(Math.abs(a-b)+1, a+b-1); items.push({html:`<span dir="ltr">${a}, ${b}, ${c}</span>`, bin:0}); }
  for(let i=0;i<3;i++){ const a = randInt(2,7), b = randInt(2,7), c = a + b + randInt(0,4); items.push({html:`<span dir="ltr">${shuffleArr([a,b,c]).join(", ")}</span>`, bin:1}); }
  return { items: shuffleArr(items), bins: [{ar:"تكوّن مثلثًا", en:"forms a triangle", emoji:"🔺"}, {ar:"لا تكوّن مثلثًا", en:"no triangle", emoji:"🚫"}],
    ...H("مجموع أي ضلعين يجب أن يكون أكبر من الضلع الثالث.", "Any two sides must add to more than the third.", "يكفي أن تتحقق: مجموع أصغر ضلعين > أكبر ضلع.", "Just check: the two shortest add to more than the longest.", "إذا كان مجموع الأصغرين ≤ الأكبر ← لا يوجد مثلث.", "If the two shortest add to ≤ the longest → no triangle.") };
};
GEN.g10order = function(tier){
  let A, B; do { A = randInt(30,100); B = randInt(30,100); } while(A === B || A + B >= 170 || 180-A-B === A || 180-A-B === B);
  const C = 180 - A - B;
  // side opposite A is BC, opposite B is AC, opposite C is AB
  const sides = [{n:"BC", ang:A}, {n:"AC", ang:B}, {n:"AB", ang:C}];
  const tri = `<svg width="280" height="170" viewBox="0 0 280 170"><polygon points="20,150 260,150 110,25" fill="rgba(34,211,238,.1)" stroke="#22d3ee" stroke-width="2.5"/>
    <text x="8" y="165" fill="#eef1ff" font-weight="800">A</text><text x="262" y="165" fill="#eef1ff" font-weight="800">B</text><text x="104" y="18" fill="#eef1ff" font-weight="800">C</text>
    <text x="48" y="142" fill="#f4c542" font-family="Space Mono" font-weight="700">${A}°</text><text x="205" y="142" fill="#f4c542" font-family="Space Mono" font-weight="700">${B}°</text><text x="98" y="52" fill="#f4c542" font-family="Space Mono" font-weight="700">${C}°</text></svg>`;
  const vals = sides.map(s=>s.ang);
  return { cards: sides.map(s=>`<span dir="ltr">${s.n}</span>`), order: orderIdx(vals), ltr: true,
    firstAr: "الأقصر", firstEn: "shortest", lastAr: "الأطول", lastEn: "longest",
    promptAr: "الرسم ليس بمقياس. رتّب الأضلاع من الأقصر إلى الأطول:", promptEn: "Not drawn to scale. Order the sides from shortest to longest:",
    beforeHtml: tri,
    ...H("الضلع الأطول يقابل الزاوية الأكبر.", "The longest side is opposite the largest angle.", "الضلع BC يقابل A، وAC يقابل B، وAB يقابل C.", "BC is opposite A, AC opposite B, AB opposite C.", orderIdx(vals).map(i=>sides[i].n).join(" < "), orderIdx(vals).map(i=>sides[i].n).join(" < ")) };
};
GEN.g10centroid = function(tier){
  let P; do { const G = [randInt(-2,2), randInt(-2,2)]; const a = [randInt(-5,5), randInt(-5,5)], b = [randInt(-5,5), randInt(-5,5)]; const c = [3*G[0]-a[0]-b[0], 3*G[1]-a[1]-b[1]]; P = {a,b,c,G}; } while(Math.abs(P.c[0])>5 || Math.abs(P.c[1])>5 || Math.abs((P.b[0]-P.a[0])*(P.c[1]-P.a[1]) - (P.b[1]-P.a[1])*(P.c[0]-P.a[0])) < 12);
  const {a,b,c,G} = P;
  return { view:{xmin:-6,xmax:6,ymin:-6,ymax:6}, polys:[{pts:[a,b,c]}], marks:[{x:a[0],y:a[1],label:"A"},{x:b[0],y:b[1],label:"B"},{x:c[0],y:c[1],label:"C"}],
    exprHtml: `A(${a[0]}, ${a[1]})  B(${b[0]}, ${b[1]})  C(${c[0]}, ${c[1]})`, answers:[{x:G[0], y:G[1]}],
    promptAr: "اضغط على مركز المثلث (نقطة تقاطع القطع المتوسطة):", promptEn: "Tap the centroid (where the medians meet):",
    ...H("إحداثيا المركز = متوسط إحداثيات الرؤوس الثلاثة.", "Centroid = average of the three vertices.", L(`x = (${a[0]} + ${b[0]} + ${c[0]}) ÷ 3`), `x = (${a[0]} + ${b[0]} + ${c[0]}) ÷ 3`, L(`(${G[0]}, ${G[1]})`), `(${G[0]}, ${G[1]})`) };
};
