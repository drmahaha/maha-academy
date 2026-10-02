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

/* ---------- content helpers for language & science games ----------
   Every helper accepts `extra` with optional hint:[ar,en] and guide:[ar,en];
   the Solution tier is generated automatically from the round's content. */
function stripTags(h){ return String(h).replace(/<[^>]+>/g, "").trim(); }
function HX(obj, extra, solAr, solEn, guideAr, guideEn){
  extra = extra || {};
  const out = Object.assign(obj, extra);
  const h = extra.hint || ["فكّر جيدًا واقرأ بتمعّن.", "Think carefully and read closely."];
  const g = extra.guide || [guideAr, guideEn];
  out.hintAr = out.hintAr || h[0]; out.hintEn = out.hintEn || h[1];
  out.guideAr = out.guideAr || g[0]; out.guideEn = out.guideEn || g[1];
  out.solAr = out.solAr || solAr; out.solEn = out.solEn || solEn;
  delete out.hint; delete out.guide;
  return out;
}
function SORT(bins, pools, per, extra){
  const items = [];
  pools.forEach((pool,b) => shuffleArr(pool).slice(0, per).forEach(h => items.push(typeof h === "object" ? Object.assign({bin:b}, h) : {html:h, bin:b})));
  const sol = bins.map((b,bi) => `${b.ar}: ${items.filter(it=>it.bin===bi).map(it=>stripTags(it.html)).join("، ")}`).join(" | ");
  return HX({ items: shuffleArr(items), bins }, extra, sol, sol, "اقرأ كل بطاقة واسأل: إلى أي صندوق تنتمي؟", "Read each card and ask: which box does it belong to?");
}
function TF(trues, falses, per, extra){
  return SORT([{ar:"صواب", en:"true", emoji:"✅"}, {ar:"خطأ", en:"false", emoji:"❌"}], [trues, falses], per, extra);
}
function MATCH(pairs, n, extra){
  const pk = shuffleArr(pairs).slice(0, n || 4);
  const sol = pk.map(p => `${stripTags(p[0])} ↔ ${stripTags(p[1])}`).join(" · ");
  return HX(pairsData(pk), extra, sol, sol, "ابدأ بالزوج الذي أنت متأكد منه.", "Start with the pair you're sure about.");
}
function ORDER(seq, extra){
  const idx = shuffleArr(seq.map((_,i)=>i));
  const sol = seq.map(stripTags).join(" ← ");
  return HX({ cards: idx.map(i=>seq[i]), order: seq.map((_,k)=>idx.indexOf(k)) }, extra, sol, seq.map(stripTags).join(" → "), "ابحث عن الخطوة الأولى ثم التي تليها.", "Find the first step, then the next.");
}
function FILL(sentence, answer, distractors, extra){
  const [pre, post] = sentence.split("___");
  return HX({ slots:1, prefix: pre, suffix: post || "", palette: shuffleArr([answer, ...distractors]), answers: [[answer]] }, extra, `${pre}${answer}${post||""}`, `${pre}${answer}${post||""}`, "جرّب كل كلمة في الفراغ واقرأ الجملة كاملة.", "Try each word in the blank and read the whole sentence.");
}
function SENT(words, extra){
  return HX({ slots: words.length, palette: shuffleArr([...new Set(words)]), answers: [words] }, extra, words.join(" "), words.join(" "), "ابدأ بالكلمة التي تبدأ بها الجملة عادةً.", "Start with the word the sentence usually begins with.");
}
function WORDBUILD(letters, distract, extra){
  if(typeof letters === "string") letters = [...letters];
  return HX({ slots: letters.length, palette: shuffleArr([...new Set([...letters, ...(distract||[])])]), answers: [letters], joinPreview: true }, extra, letters.join(""), letters.join(""), "انطق الكلمة ببطء، واسمع كل صوت فيها.", "Say the word slowly and listen to each sound.");
}


window.THEME_TEXT = {"stationBtn": "📖 الكتاب <span class=\"en-badge\">Book</span>", "resetAr": "تمت إعادة ضبط تقدمك في المكتبة! 📚", "resetEn": "Your library progress has been reset!", "defaultLang": "ar"};
/* Theme hooks: مكتبة الحكايات (Story Library) */
window.THEME_HOOKS = {
  decorateHubCard(card, mod){ if(mod.bookNo) card.insertAdjacentHTML("afterbegin", `<span class="hc-book-tag">الكتاب ${mod.bookNo}</span>`); }
};
/* Arabic helpers: split a vowelled word into letters+marks for the tashkeel machine */
const AR_MARKS = /[ً-ْ]/;
function arLetters(word){
  const out = [];
  for(const ch of word){ if(AR_MARKS.test(ch) && out.length) out[out.length-1].m += ch; else out.push({ch, m:""}); }
  return out;
}
/* TASH("كَتَبَ", k): make k letters (that carry a simple haraka) into targets */
function TASH(word, k, extra){
  const simple = ["َ","ُ","ِ","ْ"];
  const L0 = arLetters(word);
  const cand = L0.map((l,i)=>i).filter(i => simple.includes(L0[i].m));
  const pick = new Set(shuffleArr(cand).slice(0, Math.min(k || cand.length, cand.length)));
  return HX({ letters: L0.map((l,i) => pick.has(i) ? {ch:l.ch, target:l.m} : {ch:l.ch, fixed:l.m}), say: word }, extra, word, word, "اقرأ الكلمة بصوت مرتفع: الفتحة (اَ)، الضمة (اُ)، الكسرة (اِ)، السكون (بلا حركة).", "Read aloud: fatha (a), damma (u), kasra (i), sukun (no vowel).");
}

const AR_LEVELS = [
  { min: 0,   ar: "قارئ صغير", en: "Little Reader" },
  { min: 60,  ar: "صديق الكتب", en: "Book Friend" },
  { min: 150, ar: "راوي الحكايات", en: "Storyteller" },
  { min: 280, ar: "فارس الحروف", en: "Knight of Letters" },
  { min: 450, ar: "أديب المكتبة", en: "Library Writer" },
  { min: 650, ar: "حارس الفصاحة", en: "Guardian of Eloquence" },
  { min: 900, ar: "أمين مكتبة الحكايات", en: "Story Library Master" }
];
const AR_ARENA = { key: "arena", titleAr: "تحدي المكتبة", titleEn: "Library Challenge", emoji: "🏆", color: "#c8962e", guideAr: "فصول من كل الكتب!", guideEn: "Chapters from every book!",
  machines: [ { key: "mixed", titleAr: "التحدي الكبير", titleEn: "The Grand Challenge", emoji: "🎯", descAr: "فصول مختارة من كل الكتب — أظهر إتقانك!", descEn: "Chapters from every book — show your mastery!" } ] };

/* ===========================================================
   Grade 5 content (الصف الخامس الابتدائي) — first term
   =========================================================== */

const GRADE = {"progressKey": "mahaStoryLibraryProgress_g5_v1", "ar": "الصف الخامس الابتدائي", "en": "Grade 5"};

/* لغتي الجميلة — الصف الخامس، الفصل الأول. علامات رفع الفاعل، الأفعال الخمسة، جمع المذكر السالم،
   المثنى، الهمزة المتوسطة على الألف، القصة (قصة الدب)، المعجم والمعنى. */
const LEVEL_TITLES = AR_LEVELS;
const P5_BEAR = "خرج صديقان في رحلة إلى الغابة، فظهر لهما دبٌّ كبير. أسرع أحدهما وصعد شجرةً ونسي صاحبه، أما الآخر فاستلقى على الأرض وحبس أنفاسه. شمّه الدبُّ ثم انصرف. نزل الأول وسأل: «ماذا همس لك الدب؟» فقال: «قال لي: لا تصاحبْ مَن يتركك وقت الشدة».";
const MODULES = [
  { key:"story", bookNo:1, titleAr:"حكاية الدب والصديقين", titleEn:"The Bear & Two Friends", emoji:"🐻", color:"#b5542f", guideAr:"نقرأ القصة ونفهم عبرتها", guideEn:"Read the story and its lesson",
    machines:[
      { key:"a5events", type:"ordercards", titleAr:"أحداث القصة", titleEn:"Story Events", emoji:"🎬", descAr:"رتّب أحداث القصة.", descEn:"Order the events." },
      { key:"a5elements", type:"matchpairs", titleAr:"عناصر القصة", titleEn:"Story Elements", emoji:"🧭", descAr:"صِل العنصر بما يناسبه من القصة.", descEn:"Match story elements." },
      { key:"a5moral", type:"sortbins", titleAr:"عبرة القصة", titleEn:"The Lesson", emoji:"💡", descAr:"ما الذي نتعلمه؟", descEn:"What do we learn?" }
    ]},
  { key:"fael", bookNo:2, titleAr:"علامات رفع الفاعل", titleEn:"Marks of the Doer", emoji:"🎯", color:"#2e7d4f", guideAr:"الضمة، والألف، والواو", guideEn:"Damma, alif and waw",
    machines:[
      { key:"a5mark", type:"sortbins", titleAr:"بماذا رُفع الفاعل؟", titleEn:"How Is the Doer Marked?", emoji:"🔍", descAr:"ضمة أم ألف أم واو؟", descEn:"Damma, alif or waw?" },
      { key:"a5fill", type:"builder", titleAr:"أكمل بالفاعل", titleEn:"Fill the Doer", emoji:"✏️", descAr:"اختر الفاعل الصحيح.", descEn:"Pick the correct doer." },
      { key:"a5nums", type:"matchpairs", titleAr:"المثنى وجمع المذكر السالم", titleEn:"Dual & Sound Plural", emoji:"👬", descAr:"صِل المفرد بمثناه أو جمعه.", descEn:"Match singular to dual or plural." }
    ]},
  { key:"verbs5", bookNo:3, titleAr:"الأفعال الخمسة", titleEn:"The Five Verbs", emoji:"5️⃣", color:"#6b3fa0", guideAr:"يفعلان، تفعلان، يفعلون، تفعلون، تفعلين", guideEn:"The five verb forms",
    machines:[
      { key:"a5is5", type:"sortbins", titleAr:"من الأفعال الخمسة؟", titleEn:"Five Verbs or Not?", emoji:"🔎", descAr:"صنّف الأفعال.", descEn:"Sort the verbs." },
      { key:"a5match5", type:"matchpairs", titleAr:"الفعل وفاعله", titleEn:"Verb & Pronoun", emoji:"🔗", descAr:"صِل الفعل بالضمير المناسب.", descEn:"Match verb to pronoun." },
      { key:"a5sent", type:"builder", titleAr:"أكوّن جملة", titleEn:"Build a Sentence", emoji:"🧩", descAr:"رتّب الكلمات.", descEn:"Order the words." }
    ]},
  { key:"spell", bookNo:4, titleAr:"الإملاء والمعجم", titleEn:"Spelling & Dictionary", emoji:"✍️", color:"#1f6f9c", guideAr:"الهمزة المتوسطة على الألف، والكشف في المعجم", guideEn:"Medial hamza, dictionary",
    machines:[
      { key:"a5hamza", type:"sortbins", titleAr:"الهمزة المتوسطة على الألف", titleEn:"Medial Hamza on Alif", emoji:"أ", descAr:"لماذا كُتبت على الألف؟", descEn:"Why is it on alif?" },
      { key:"a5root", type:"matchpairs", titleAr:"جذر الكلمة", titleEn:"Word Roots", emoji:"🌳", descAr:"صِل الكلمة بجذرها للكشف في المعجم.", descEn:"Match each word to its root." },
      { key:"a5order", type:"ordercards", titleAr:"الترتيب الهجائي", titleEn:"Alphabetical Order", emoji:"🔠", descAr:"رتّب الكلمات هجائيًا.", descEn:"Alphabetize the words." }
    ]},
  AR_ARENA
];
const ARENA_POOL = ["a5events","a5elements","a5moral","a5mark","a5fill","a5nums","a5is5","a5match5","a5sent","a5hamza","a5root","a5order"];
const GEN = {};
const PB = {passageTitle:"الدب والصديقان", passageHtml:P5_BEAR, say:P5_BEAR};
GEN.a5events = t => ORDER(["خرج صديقان إلى الغابة.","ظهر لهما دب كبير.","صعد أحدهما شجرة.","استلقى الآخر على الأرض.","انصرف الدب.","سأل الأول صاحبه عما همس به الدب."].slice(0, clampTier(t)===1?4:6), Object.assign({firstAr:"أولًا", lastAr:"أخيرًا"}, PB));
GEN.a5elements = t => MATCH([["المكان","الغابة"],["الشخصيات","صديقان والدب"],["المشكلة","ظهور الدب"],["الحل","التظاهر بالموت"],["العبرة","الصديق الحقيقي لا يترك صاحبه"]], clampTier(t)===1?3:4, PB);
GEN.a5moral = t => TF(["الصديق الحقيقي يقف معك وقت الشدة.","يجب أن نختار أصدقاءنا بعناية.","الهدوء يساعد في المواقف الصعبة."],["يجب أن تترك صديقك إذا خفت.","الدب همس فعلًا في أذن الصديق.","القصة تدعو إلى الأنانية."], clampTier(t)>=2?3:2, Object.assign({promptAr:"ما الذي تعلّمه القصة؟ صنّف الجمل:"}, PB));
GEN.a5mark = t => SORT([{ar:"مرفوع بالضمة",en:"damma"},{ar:"مرفوع بالألف (مثنى)",en:"alif"},{ar:"مرفوع بالواو (جمع مذكر سالم)",en:"waw"}],
  [["نجحَ <b>الطالبُ</b>.","حضرَ <b>المعلمُ</b>.","فازَ <b>الفريقُ</b>."],["نجحَ <b>الطالبانِ</b>.","حضرَ <b>المعلمانِ</b>.","فازَ <b>اللاعبانِ</b>."],["نجحَ <b>الطالبونَ</b>.","حضرَ <b>المعلمونَ</b>.","فازَ <b>اللاعبونَ</b>."]], clampTier(t)>=2?2:1,
  {hint:["المفرد يُرفع بالضمة، والمثنى بالألف، وجمع المذكر السالم بالواو.","Singular: damma; dual: alif; sound masculine plural: waw."]});
GEN.a5fill = t => { const q = randChoice([["فازَ ___ في المسابقة. (مثنى)","اللاعبانِ",["اللاعبينِ","اللاعبونَ"]],["حضرَ ___ إلى الحفل. (جمع)","المهندسونَ",["المهندسينَ","المهندسانِ"]],["اجتهدَ ___ في الدرس. (مثنى)","الطالبانِ",["الطالبينِ","الطالبونَ"]]]);
  return FILL(q[0], q[1], q[2], {promptAr:"اختر الفاعل المرفوع بالعلامة الصحيحة:"}); };
GEN.a5nums = t => MATCH([["معلم (جمع)","معلمون"],["مهندس (مثنى)","مهندسان"],["لاعب (جمع)","لاعبون"],["كاتب (مثنى)","كاتبان"],["مسافر (جمع)","مسافرون"],["طبيب (مثنى)","طبيبان"]], clampTier(t)===1?3:4);
GEN.a5is5 = t => SORT([{ar:"من الأفعال الخمسة",en:"five verbs"},{ar:"ليس منها",en:"not"}],
  [["يلعبان","تكتبون","يقرؤون","تدرسين","تسافران"],["يلعب","كتبوا","اقرأ","تدرس","سافر"]], clampTier(t)+1,
  {hint:["الأفعال الخمسة: كل مضارع اتصلت به ألف الاثنين أو واو الجماعة أو ياء المخاطبة.","Present verbs ending in -aan, -uun or -iin."]});
GEN.a5match5 = t => MATCH([["هما","يكتبان"],["أنتما","تكتبان"],["هم","يكتبون"],["أنتم","تكتبون"],["أنتِ","تكتبين"]], clampTier(t)===1?3:5);
const S5 = [["الطالبان","يكتبان","الدرس"],["أنتم","تحافظون","على","النظافة"],["أنتِ","تقرئين","القصة"],["اللاعبون","يتدربون","كل","يوم"]];
GEN.a5sent = t => SENT(randChoice(S5));
GEN.a5hamza = t => SORT([{ar:"لأن ما قبلها مفتوح",en:"fatha before"},{ar:"لأنها مفتوحة وما قبلها ساكن",en:"fatha, sukun before"}],
  [["سأل","رأس","تأخّر","مأمون"],["يسأل","مسألة","هيأة","المرأة"]], clampTier(t)>=2?3:2,
  {hint:["تُكتب الهمزة المتوسطة على الألف إذا كانت أقوى الحركتين الفتحة.","Medial hamza sits on alif when fatha is the strongest vowel."]});
GEN.a5root = t => MATCH([["مكتبة","ك ت ب"],["مدرسة","د ر س"],["استخراج","خ ر ج"],["مسافر","س ف ر"],["معلومات","ع ل م"],["مصاحبة","ص ح ب"]], clampTier(t)===1?3:4, {hint:["احذف الحروف الزائدة وارجع إلى الماضي.","Remove the extra letters and go back to the past verb."]});
GEN.a5order = t => { const words = shuffleArr(["أسد","بحر","تمر","جبل","حديقة","دب","رحلة","شجرة","غابة","قمر"]).slice(0, clampTier(t)===1?3:clampTier(t)===2?4:5);
  const ALPH = "ابتثجحخدذرزسشصضطظعغفقكلمنهوي";
  words.sort((a,b)=>ALPH.indexOf(a.replace("أ","ا")[0]) - ALPH.indexOf(b.replace("أ","ا")[0]));
  return ORDER(words, {firstAr:"أولًا", lastAr:"أخيرًا", hint:["رتّب حسب الحرف الأول: أ ب ت ث…","Sort by first letter."]}); };
