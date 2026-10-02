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
   Grade 2 content (الصف الثاني الابتدائي) — first term
   =========================================================== */

const GRADE = {"progressKey": "mahaMathLabProgress_g2_v1", "ar": "الصف الثاني الابتدائي", "en": "Grade 2"};

/* Grade 2, term 1 chapters: القيمة المنزلية حتى 100 والأنماط · طرائق الجمع ·
   طرائق الطرح · تمثيل البيانات وقراءتها · جمع الأعداد المكوّنة من رقمين ·
   طرح الأعداد المكوّنة من رقمين */

const LEVEL_TITLES = [
  { min: 0,   ar: "مستكشف المئة", en: "Hundred Explorer" },
  { min: 60,  ar: "بنّاء العشرات", en: "Tens Builder" },
  { min: 150, ar: "صانع العشرة", en: "Ten Maker" },
  { min: 280, ar: "قارئ البيانات", en: "Data Reader" },
  { min: 450, ar: "بطل إعادة التجميع", en: "Regrouping Hero" },
  { min: 650, ar: "خبير الجمع والطرح", en: "Add & Subtract Expert" },
  { min: 900, ar: "خبير مختبر الرياضيات", en: "Math Lab Master" }
];

const MODULES = [
  {
    key: "place", titleAr: "محطة القيمة المنزلية حتى 100", titleEn: "Place Value to 100", emoji: "💯", color: "#7c5cf0",
    guideAr: "العشرات والآحاد ولوحة المئة!", guideEn: "Tens, ones, and the hundred board!",
    machines: [
      { key: "g2build", type: "placevalue", titleAr: "بنّاء الأعداد", titleEn: "Number Builder", emoji: "🧱", descAr: "كوّن العدد من عشرات وآحاد.", descEn: "Build the number from tens and ones." },
      { key: "g2board", type: "gridfill", titleAr: "لوحة المئة", titleEn: "Hundred Board", emoji: "🔟", descAr: "أكمل الأعداد الناقصة في لوحة المئة.", descEn: "Fill the missing numbers on the hundred board." },
      { key: "g2order", type: "ordercards", titleAr: "مرتّب الأعداد", titleEn: "Number Sorter", emoji: "📶", descAr: "قارن الأعداد ورتّبها.", descEn: "Compare and order numbers." }
    ]
  },
  {
    key: "strategies", titleAr: "محطة طرائق الجمع والطرح", titleEn: "Add & Subtract Strategies", emoji: "🧠", color: "#17b6a7",
    guideAr: "العدّ للأمام وللخلف، وتكوين عشرة، والعائلات!", guideEn: "Counting on and back, making ten, and fact families!",
    machines: [
      { key: "g2hop", type: "numline", titleAr: "قفزات للأمام وللخلف", titleEn: "Hop On, Hop Back", emoji: "🐸", descAr: "اجمع بالقفز للأمام، واطرح بالقفز للخلف.", descEn: "Add by hopping on, subtract by hopping back." },
      { key: "g2maketen", type: "keypadvisual", titleAr: "آلة تكوين العشرة", titleEn: "Make-a-Ten Machine", emoji: "🔟", descAr: "أكمل العشرة أولًا ثم اجمع الباقي.", descEn: "Complete ten first, then add the rest." },
      { key: "g2missing", type: "keypadvisual", titleAr: "العدد المفقود", titleEn: "Missing Number", emoji: "❓", descAr: "أوجد العدد المفقود باستخدام العلاقة بين الجمع والطرح.", descEn: "Find the missing number using addition and subtraction." },
      { key: "g2family", type: "matchpairs", titleAr: "عائلات الحقائق", titleEn: "Fact Families", emoji: "👨‍👩‍👧", descAr: "صِل كل جملة جمع بجملة الطرح المرتبطة بها.", descEn: "Match each addition fact to its related subtraction." }
    ]
  },
  {
    key: "data", titleAr: "محطة البيانات", titleEn: "Data Station", emoji: "📊", color: "#22d3ee",
    guideAr: "إشارات العدّ، والتمثيل بالصور وبالأعمدة!", guideEn: "Tally marks, picture graphs, and bar graphs!",
    machines: [
      { key: "g2tally", type: "barchart", titleAr: "من إشارات العدّ إلى الأعمدة", titleEn: "Tally to Bars", emoji: "📝", descAr: "مثّل جدول الإشارات بالأعمدة.", descEn: "Turn a tally chart into a bar graph." },
      { key: "g2picto", type: "keypadvisual", titleAr: "قارئ التمثيل بالصور", titleEn: "Picture Graph Reader", emoji: "🖼️", descAr: "اقرأ التمثيل بالصور وأجب.", descEn: "Read the picture graph and answer." },
      { key: "g2table", type: "barchart", titleAr: "بنّاء التمثيل بالأعمدة", titleEn: "Bar Graph Builder", emoji: "📊", descAr: "مثّل الجدول بالأعمدة ثم أجب عن سؤال.", descEn: "Graph the table, then answer a question." }
    ]
  },
  {
    key: "twodigit", titleAr: "محطة الأعداد ذات الرقمين", titleEn: "Two-Digit Station", emoji: "➕", color: "#ff6f6f",
    guideAr: "اجمع واطرح عموديًا مع إعادة التجميع!", guideEn: "Add and subtract in columns with regrouping!",
    machines: [
      { key: "g2add", type: "columncalc", titleAr: "آلة الجمع العمودي", titleEn: "Column Addition", emoji: "➕", descAr: "اجمع عددين من رقمين مع إعادة التجميع.", descEn: "Add two-digit numbers with regrouping." },
      { key: "g2sub", type: "columncalc", titleAr: "آلة الطرح العمودي", titleEn: "Column Subtraction", emoji: "➖", descAr: "اطرح عددين من رقمين.", descEn: "Subtract two-digit numbers." },
      { key: "g2add3", type: "columncalc", titleAr: "جمع ثلاثة أعداد", titleEn: "Add Three Numbers", emoji: "🔢", descAr: "اجمع ثلاثة أعداد من رقمين.", descEn: "Add three two-digit numbers." }
    ]
  },
  {
    key: "arena", titleAr: "ساحة التحدي", titleEn: "Challenge Arena", emoji: "🏆", color: "#f4c542",
    guideAr: "مزيج من كل الأجهزة!", guideEn: "A mix of every machine!",
    machines: [ { key: "mixed", titleAr: "التحدي الشامل", titleEn: "The Grand Challenge", emoji: "🎯", descAr: "مزيج من كل الأجهزة — أظهر إتقانك!", descEn: "A mix of every machine — show your mastery!" } ]
  }
];

const ARENA_POOL = ["g2build","g2board","g2order","g2hop","g2maketen","g2missing","g2family","g2picto","g2add","g2sub","g2add3"];

const GEN = {};

GEN.g2build = function(tier){
  tier = clampTier(tier);
  const n = tier===1 ? randInt(10,50) : randInt(21,99);
  const read = tier >= 2 && Math.random() < .35;
  const counts = [Math.floor(n/10), n%10];
  return { mode: read ? "read" : "build", target: n, counts,
    places: [{ar:"عشرات", en:"tens", val:10}, {ar:"آحاد", en:"ones", val:1}],
    ...H("الرقم الأيسر يخبرك بعدد العشرات، والأيمن بعدد الآحاد.", "The left digit is the tens, the right digit is the ones.",
         `${L(n)} = ${L(counts[0]*10)} + ${L(counts[1])}`, `${n} = ${counts[0]*10} + ${counts[1]}`,
         `عشرات: ${L(counts[0])}، آحاد: ${L(counts[1])}`, `tens: ${counts[0]}, ones: ${counts[1]}`) };
};
GEN.g2board = function(tier){
  tier = clampTier(tier);
  const r0 = randInt(0, 6), c0 = randInt(1, 6);
  const rows = 3, cols = 4;
  const blanksWanted = tier===1 ? 3 : tier===2 ? 5 : 7;
  const cells = [];
  for(let i=0;i<rows;i++) for(let j=0;j<cols;j++) cells.push([i,j]);
  const blankSet = new Set(shuffleArr(cells).slice(0, blanksWanted).map(([i,j])=>i+","+j));
  const grid = [];
  for(let i=0;i<rows;i++){
    const row = [];
    for(let j=0;j<cols;j++){ const v = (r0+i)*10 + c0 + j; row.push(blankSet.has(i+","+j) ? {ans:v} : {v:String(v)}); }
    grid.push(row);
  }
  return { blocks: [{rows: grid}], neg: false,
    promptAr: "أكمل جزء لوحة المئة: كل خانة لليمين تزيد 1، وكل خانة للأسفل تزيد 10.", promptEn: "Finish the hundred-board piece: one box right adds 1, one box down adds 10.",
    ...H("في لوحة المئة: لليمين +1، للأسفل +10.", "On the hundred board: right +1, down +10.",
         "استخدم العدد المجاور لكل خانة فارغة.", "Use the number next to each empty box.", "تحقق: كل صف يزيد 1، وكل عمود يزيد 10.", "Check: each row goes up by 1, each column by 10.") };
};
GEN.g2order = function(tier){
  tier = clampTier(tier);
  const n = tier===1 ? 3 : tier===2 ? 4 : 5;
  const nums = tier===3 ? (function(){ const t = randInt(2,8); return shuffleArr([t*10+randInt(0,9), t*10+randInt(0,9), (t+1)*10+randInt(0,9), t*10+randInt(0,9), (t-1)*10+randInt(0,9)]); })() : distinctInts(n, 10, 99);
  const vals = [...new Set(nums)].slice(0, n);
  while(vals.length < n){ const v = randInt(10,99); if(!vals.includes(v)) vals.push(v); }
  const desc = tier >= 2 && Math.random() < .4;
  return { cards: vals.map(v=>`<span dir="ltr">${v}</span>`), order: orderIdx(vals, desc), ltr: true,
    firstAr: desc ? "الأكبر" : "الأصغر", firstEn: desc ? "greatest" : "least", lastAr: desc ? "الأصغر" : "الأكبر", lastEn: desc ? "least" : "greatest",
    promptAr: desc ? "رتّب من الأكبر إلى الأصغر:" : "رتّب من الأصغر إلى الأكبر:", promptEn: desc ? "Order from greatest to least:" : "Order from least to greatest:",
    ...H("قارن العشرات أولًا.", "Compare the tens first.", "إذا تساوت العشرات، قارن الآحاد.", "If the tens are equal, compare the ones.", L(orderIdx(vals, desc).map(i=>vals[i]).join(" ، ")), orderIdx(vals, desc).map(i=>vals[i]).join(", ")) };
};
GEN.g2hop = function(tier){
  tier = clampTier(tier);
  const sub = tier >= 2 && Math.random() < .5;
  let a, b;
  if(sub){ a = randInt(8, 20); b = randInt(2, Math.min(tier===2?4:8, a)); }
  else { a = randInt(0, 14); b = randInt(1, Math.min(tier===1?3:tier===2?5:8, 20-a)); }
  const target = sub ? a-b : a+b;
  return { mode: "hop", min: 0, max: 20, step: 1, hop: 1, start: a, target, labelEvery: 2,
    showHtml: `<span dir="ltr">${a} ${sub?"−":"+"} ${b} = ?</span>`,
    promptAr: sub ? "ابدأ من العدد الأول واقفز للخلف (يسارًا)، ثم اضغط «هنا»:" : "ابدأ من العدد الأول واقفز للأمام (يمينًا)، ثم اضغط «هنا»:", promptEn: sub ? "Start at the first number and hop back (left), then press “Here”:" : "Start at the first number and hop on (right), then press “Here”:",
    ...H(sub ? "الطرح = العدّ للخلف." : "الجمع = العدّ للأمام.", sub ? "Subtracting = counting back." : "Adding = counting on.",
         `${L(b)} قفزات ${sub?"لليسار":"لليمين"} من ${L(a)}.`, `${b} hops ${sub?"left":"right"} from ${a}.`, L(`${a} ${sub?"−":"+"} ${b} = ${target}`), `${a} ${sub?"−":"+"} ${b} = ${target}`) };
};
GEN.g2maketen = function(tier){
  tier = clampTier(tier);
  const a = randInt(tier===1?7:6, 9), b = randInt(11-a, 9);
  const need = 10 - a;
  return { visualHtml: VIS.tenFrame(a, "🔴") + VIS.tenFrame(b, "🔵"),
    exprHtml: `${a} + ${b} = ?`,
    promptAr: "انقل بعض الأزرق لتكمل العشرة الأولى:", promptEn: "Move some blue to complete the first ten:",
    steps: [
      { ar: `كم نحتاج لنكمل ${L(a)} إلى 10؟`, en: `How many does ${a} need to make 10?`, answer: need },
      { ar: `كم يتبقى من ${L(b)}؟`, en: `How many are left from ${b}?`, answer: b - need },
      { ar: L(`10 + ${b-need} = ?`), en: "", answer: a + b }
    ],
    ...H("أكمل العشرة أولًا — الجمع مع 10 سهل!", "Make 10 first — adding to 10 is easy!",
         L(`${a} + ${need} = 10`), `${a} + ${need} = 10`, L(`${a} + ${b} = 10 + ${b-need} = ${a+b}`), `${a} + ${b} = 10 + ${b-need} = ${a+b}`) };
};
GEN.g2missing = function(tier){
  tier = clampTier(tier);
  const total = randInt(tier===1?6:10, tier===1?10:tier===2?18:20);
  const part = randInt(1, total-1);
  const kind = tier===1 ? 0 : randInt(0,2);
  let expr, ans, hAr, hEn;
  if(kind === 0){ expr = `${part} + ? = ${total}`; ans = total - part; hAr = `${L(total+" − "+part)}`; hEn = `${total} − ${part}`; }
  else if(kind === 1){ expr = `? + ${part} = ${total}`; ans = total - part; hAr = `${L(total+" − "+part)}`; hEn = `${total} − ${part}`; }
  else { expr = `${total} − ? = ${part}`; ans = total - part; hAr = `${L(total+" − "+part)}`; hEn = `${total} − ${part}`; }
  return { exprHtml: expr, answer: ans,
    visualHtml: `<div class="vis-group" style="max-width:320px">${"🟦".repeat(part)}${"⬜".repeat(total-part)}</div>`,
    promptAr: "ما العدد المفقود؟", promptEn: "What is the missing number?",
    ...H("الجمع والطرح عمليتان مترابطتان.", "Addition and subtraction are related.", `فكّر: ${hAr}`, `Think: ${hEn}`, `العدد المفقود ${L(ans)}`, `The missing number is ${ans}`) };
};
GEN.g2family = function(tier){
  tier = clampTier(tier);
  const n = tier===1 ? 3 : 4;
  const facts = [];
  const used = new Set();
  while(facts.length < n){
    const a = randInt(2,9), b = randInt(2,9), s = a+b;
    if(used.has(s)) continue; used.add(s);
    facts.push([`${a} + ${b} = ${s}`, `${s} − ${b} = ${a}`]);
  }
  return { ...pairsData(facts), ltr: true,
    promptAr: "صِل كل جملة جمع بجملة الطرح من نفس العائلة:", promptEn: "Match each addition fact with the subtraction fact from the same family:",
    ...H("عائلة الحقائق تستخدم الأعداد الثلاثة نفسها.", "A fact family uses the same three numbers.", "ابحث عن جملة طرح تبدأ بالمجموع.", "Find the subtraction that starts with the sum.", L(facts.map(f=>f[0]+" ↔ "+f[1]).join("   ")), facts.map(f=>f[0]+" ↔ "+f[1]).join("   ")) };
};

const G2_CATS = [
  [{ar:"تفاح",en:"apple",emoji:"🍎"},{ar:"موز",en:"banana",emoji:"🍌"},{ar:"عنب",en:"grapes",emoji:"🍇"},{ar:"برتقال",en:"orange",emoji:"🍊"}],
  [{ar:"قطط",en:"cats",emoji:"🐱"},{ar:"كلاب",en:"dogs",emoji:"🐶"},{ar:"عصافير",en:"birds",emoji:"🐦"},{ar:"أسماك",en:"fish",emoji:"🐟"}],
  [{ar:"كرة قدم",en:"football",emoji:"⚽"},{ar:"سباحة",en:"swimming",emoji:"🏊"},{ar:"جري",en:"running",emoji:"🏃"},{ar:"دراجة",en:"cycling",emoji:"🚴"}]
];
GEN.g2tally = function(tier){
  tier = clampTier(tier);
  const cats = randChoice(G2_CATS).slice(0, tier===1?3:4).map(c => Object.assign({}, c, {value: randInt(1, tier===1?6:9)}));
  const mx = cats.reduce((m,c,i)=> c.value > cats[m].value ? i : m, 0);
  const q = tier===1 ? null : { ar: `كم عدد ${cats[mx].ar}؟ (الأكثر)`, en: `How many ${cats[mx].en}? (the most)`, answer: cats[mx].value };
  return { cats, source: "tally", max: 10, step: 1, style: "bars", question: q,
    ...H("كل خط في إشارات العدّ = 1، والحزمة المشطوبة = 5.", "Each tally line = 1; a crossed bundle = 5.", "عُدّ الإشارات لكل صف، ثم ارفع العمود إلى ذلك العدد.", "Count each row's tallies, then raise the bar to that number.",
         cats.map(c=>`${c.ar}: ${L(c.value)}`).join("، "), cats.map(c=>`${c.en}: ${c.value}`).join(", ")) };
};
GEN.g2picto = function(tier){
  tier = clampTier(tier);
  const per = tier===1 ? 1 : 2;
  const cats = randChoice(G2_CATS).slice(0,3).map(c => Object.assign({}, c, {value: per*randInt(1, tier===1?6:5)}));
  const icon = "🙂";
  const rows = cats.map(c => `<tr><td>${c.emoji} ${c.ar}</td><td style="text-align:start;font-size:22px;letter-spacing:2px">${icon.repeat(c.value/per)}</td></tr>`).join("");
  const vis = `<table class="fn-table" style="max-width:420px;direction:rtl">${rows}</table><div class="pv-target" style="font-size:16px">المفتاح: ${icon} = ${L(per)} <span class="en-badge">Key: ${icon} = ${per}</span></div>`;
  let a = randInt(0,2), b; do { b = randInt(0,2); } while(b === a);
  if(cats[a].value < cats[b].value) [a,b] = [b,a];
  return { visualHtml: vis,
    promptAr: "اقرأ التمثيل بالصور (انتبه للمفتاح!):", promptEn: "Read the picture graph (watch the key!):",
    steps: [
      { ar: `كم عدد ${cats[a].ar}؟`, en: `How many ${cats[a].en}?`, answer: cats[a].value },
      { ar: `كم يزيد ${cats[a].ar} عن ${cats[b].ar}؟`, en: `How many more ${cats[a].en} than ${cats[b].en}?`, answer: cats[a].value - cats[b].value }
    ],
    ...H(per === 1 ? "كل صورة = 1." : "كل صورة تساوي 2 — عُدّ بالاثنينات.", per === 1 ? "Each picture = 1." : "Each picture = 2 — count by twos.",
         "لإيجاد «كم يزيد» اطرح العدد الأصغر من الأكبر.", "For “how many more”, subtract the smaller from the larger.",
         `${L(cats[a].value)} و ${L(cats[a].value - cats[b].value)}`, `${cats[a].value} and ${cats[a].value - cats[b].value}`) };
};
GEN.g2table = function(tier){
  tier = clampTier(tier);
  const cats = randChoice(G2_CATS).slice(0, 4).map(c => Object.assign({}, c, {value: randInt(1, 9)}));
  const tot = cats.reduce((s,c)=>s+c.value,0);
  return { cats, source: "table", max: 10, step: 1, style: "bars",
    question: { ar: "ما مجموع كل البيانات؟", en: "What is the total of all the data?", answer: tot },
    ...H("اجعل طول كل عمود مساويًا للعدد في الجدول.", "Make each bar as tall as the number in the table.", "للمجموع: اجمع كل الأعداد.", "For the total: add all the numbers.", `المجموع = ${L(tot)}`, `Total = ${tot}`) };
};
GEN.g2add = function(tier){
  tier = clampTier(tier);
  let a, b;
  if(tier===1){ a = randInt(10,60); b = randInt(10, 89-a); if((a%10)+(b%10) > 9) b -= (a%10)+(b%10)-9; }
  else { do { a = randInt(15,79); b = randInt(15, 99-a); } while((a%10)+(b%10) < 10); }
  if(b < 1) b = 11;
  return { nums: [a,b], op: "+", result: a+b,
    ...H("اجمع الآحاد أولًا.", "Add the ones first.", (a%10)+(b%10) > 9 ? "مجموع الآحاد أكبر من 9: اكتب الآحاد واحمل 1 إلى العشرات." : "لا يوجد حمل هنا.", (a%10)+(b%10) > 9 ? "Ones add to more than 9: write the ones and carry 1 ten." : "No carrying needed here.", L(`${a} + ${b} = ${a+b}`), `${a} + ${b} = ${a+b}`) };
};
GEN.g2sub = function(tier){
  tier = clampTier(tier);
  let a, b;
  if(tier===1){ a = randInt(40,99); b = randInt(10, a-10); if((b%10) > (a%10)) b -= (b%10)-(a%10); }
  else { do { a = randInt(30,99); b = randInt(11, a-5); } while((b%10) <= (a%10)); }
  return { nums: [a,b], op: "−", result: a-b,
    ...H("اطرح الآحاد أولًا.", "Subtract the ones first.", (b%10) > (a%10) ? "آحاد العدد الأعلى أقل: استلف عشرة (10 آحاد)." : "لا تحتاج إلى استلاف هنا.", (b%10) > (a%10) ? "Top ones are smaller: borrow a ten (10 ones)." : "No borrowing needed here.", L(`${a} − ${b} = ${a-b}`), `${a} − ${b} = ${a-b}`) };
};
GEN.g2add3 = function(tier){
  tier = clampTier(tier);
  const a = randInt(10, tier===1?30:40), b = randInt(10,30), c = randInt(tier===1?1:10, 25);
  return { nums: [a,b,c], op: "+", result: a+b+c,
    ...H("اجمع الآحاد الثلاثة معًا أولًا.", "Add all three ones digits first.", "ابحث عن عددين مجموعهما 10 لتسهيل الجمع.", "Look for two numbers that make 10 to make it easier.", L(`${a} + ${b} + ${c} = ${a+b+c}`), `${a} + ${b} + ${c} = ${a+b+c}`) };
};
