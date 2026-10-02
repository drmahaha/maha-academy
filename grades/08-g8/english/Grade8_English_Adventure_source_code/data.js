/* ===========================================================
   Maha Academy — Content Data (Grade 8 English)
   Based on McGraw-Hill "Super Goal 2" units:
     Unit 3  Who's Who               -> Who's Who
     Unit 4  Favorite Pastimes       -> Favorite Pastimes
     Unit 8  What's Wrong?           -> What's Wrong?
     Unit 11 There's No Comparison   -> There's No Comparison
     Unit 16 Have You Ever...?       -> Have You Ever...?
   Keep all questions/content here, separate from the game engine,
   so games can be edited/expanded without touching game logic.
   =========================================================== */

function shuffle(arr){
  const a = arr.slice();
  for(let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i+1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------- GAME 1 : WHO'S WHO (Unit 3) ---------- */

const APPEARANCE_VOCAB = [
  { id:"tall", en:"tall", ar:"طويل", emoji:"🧍‍♂️⬆️" },
  { id:"short", en:"short", ar:"قصير", emoji:"🧍‍♂️⬇️" },
  { id:"curly", en:"curly hair", ar:"شعر مجعد", emoji:"👩‍🦱" },
  { id:"straight", en:"straight hair", ar:"شعر مستقيم", emoji:"👱" },
  { id:"glasses", en:"glasses", ar:"نظارة", emoji:"👓" },
  { id:"beard", en:"beard", ar:"لحية", emoji:"🧔" },
  { id:"young", en:"young", ar:"صغير السن", emoji:"👶" },
  { id:"old", en:"old", ar:"كبير السن", emoji:"👴" }
];

const GAME_WHOSWHO = {
  id: "whoswho",
  emoji: "👤",
  titleEn: "Who's Who",
  titleAr: "من هو؟",
  character: "maya",
  introEn: "Learn to describe what people look like!",
  introAr: "تعلّم كيف تصف شكل الأشخاص!",
  activities: [
    {
      id:"vocab", type:"vocab", character:"maya",
      tagEn:"Appearance Words", tagAr:"كلمات الشكل",
      instructionsEn:"Tap a word to hear it and see its meaning.",
      instructionsAr:"اضغط على الكلمة لسماعها ومعرفة معناها.",
      words: APPEARANCE_VOCAB
    },
    {
      id:"teach", type:"teach", character:"maya",
      tagEn:"Has or Is?", tagAr:"has أم is؟",
      instructionsEn:"How do we describe someone?",
      instructionsAr:"كيف نصف شخصًا ما؟",
      teachBlocks:[
        { pillEn:"Is",
          descEn:"Use is with an adjective (tall, short, young, old).", descAr:"استخدمها مع الصفة (طويل، قصير، صغير، كبير).",
          examples:[ { emoji:"🧍‍♂️⬆️", textEn:"He is tall." } ] },
        { pillEn:"Has", accent:true,
          descEn:"Use has with a feature (hair, a beard, glasses).", descAr:"استخدمها مع صفة جسدية (شعر، لحية، نظارة).",
          examples:[ { emoji:"🧔", textEn:"He has a beard." } ] }
      ]
    },
    {
      id:"match", type:"match", character:"marya",
      tagEn:"Match the Description", tagAr:"طابق الوصف",
      instructionsEn:"Match the English word to the correct picture.",
      instructionsAr:"طابق الكلمة الإنجليزية مع الصورة الصحيحة.",
      rounds:[
        { pairs:["tall","short","curly","straight"].map(id=>{
            const w = APPEARANCE_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) },
        { pairs:["glasses","beard","young","old"].map(id=>{
            const w = APPEARANCE_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) }
      ]
    },
    {
      id:"hasoris", type:"mcq", character:"malik",
      tagEn:"Has or Is?", tagAr:"has أم is؟",
      instructionsEn:"Choose the correct word.",
      instructionsAr:"اختر الكلمة الصحيحة.",
      rounds:[
        { promptEn:"She ___ curly hair.", promptAr:"لديها شعر مجعد.",
          options:["has","is"], correct:"has" },
        { promptEn:"He ___ tall.", promptAr:"هو طويل.",
          options:["is","has"], correct:"is" },
        { promptEn:"My grandfather ___ a beard.", promptAr:"جدي لديه لحية.",
          options:["has","is"], correct:"has" },
        { promptEn:"My sister ___ short.", promptAr:"أختي قصيرة.",
          options:["is","has"], correct:"is" },
        { promptEn:"My mother ___ straight hair.", promptAr:"أمي لديها شعر مستقيم.",
          options:["has","is"], correct:"has" },
        { promptEn:"My little brother ___ young.", promptAr:"أخي الصغير صغير السن.",
          options:["is","has"], correct:"is" }
      ]
    },
    {
      id:"challenge", type:"mcq", character:"mahir",
      tagEn:"Who's Who Challenge", tagAr:"تحدي من هو؟",
      instructionsEn:"Choose the correct answer.",
      instructionsAr:"اختر الإجابة الصحيحة.",
      rounds:[
        { emoji:"👓", promptEn:"He is wearing ___.", promptAr:"هو يرتدي ___.",
          options:["glasses","a beard","curly hair"], correct:"glasses" },
        { emoji:"👩‍🦱", promptEn:"She has ___ hair.", promptAr:"لديها شعر ___.",
          options:["curly","straight","short"], correct:"curly" },
        { emoji:"👴", promptEn:"What do we call this person?", promptAr:"ماذا نسمي هذا الشخص؟",
          options:["old","young","tall"], correct:"old" },
        { promptEn:"My uncle ___ a beard.", promptAr:"عمي لديه لحية.",
          options:["has","is"], correct:"has" },
        { emoji:"🧍‍♂️⬇️", promptEn:"He is ___.", promptAr:"هو ___.",
          options:["short","tall","old"], correct:"short" },
        { promptEn:"My baby cousin is very ___.", promptAr:"ابن عمي الرضيع صغير جدًا.",
          options:["young","old","tall"], correct:"young" }
      ]
    }
  ]
};

/* ---------- GAME 2 : FAVORITE PASTIMES (Unit 4) ---------- */

const HOBBY_VOCAB = [
  { id:"reading", en:"reading", ar:"القراءة", emoji:"📖" },
  { id:"swimming", en:"swimming", ar:"السباحة", emoji:"🏊" },
  { id:"painting", en:"painting", ar:"الرسم", emoji:"🎨" },
  { id:"cycling", en:"cycling", ar:"ركوب الدراجة", emoji:"🚴" },
  { id:"cooking", en:"cooking", ar:"الطبخ", emoji:"🍳" },
  { id:"dancing", en:"dancing", ar:"الرقص", emoji:"💃" },
  { id:"singing", en:"singing", ar:"الغناء", emoji:"🎤" },
  { id:"chess", en:"playing chess", ar:"لعب الشطرنج", emoji:"♟️" }
];

const GAME_PASTIMES = {
  id: "pastimes",
  emoji: "🎨",
  titleEn: "Favorite Pastimes",
  titleAr: "هوايات مفضلة",
  character: "marya",
  introEn: "Talk about the hobbies you like doing!",
  introAr: "تحدث عن الهوايات التي تحب ممارستها!",
  activities: [
    {
      id:"vocab", type:"vocab", character:"marya",
      tagEn:"Hobby Words", tagAr:"كلمات الهوايات",
      instructionsEn:"Tap a word to hear it and see its meaning.",
      instructionsAr:"اضغط على الكلمة لسماعها ومعرفة معناها.",
      words: HOBBY_VOCAB
    },
    {
      id:"teach", type:"teach", character:"maya",
      tagEn:"Like / Love / Enjoy + -ing", tagAr:"like / love / enjoy + ing",
      instructionsEn:"How do we talk about hobbies?",
      instructionsAr:"كيف نتحدث عن الهوايات؟",
      teachBlocks:[
        { pillEn:"Verb + -ing",
          descEn:"After like, love, or enjoy, add -ing to the verb.", descAr:"بعد like أو love أو enjoy، أضف -ing إلى الفعل.",
          examples:[
            { emoji:"🏊", textEn:"I like swimming." },
            { emoji:"🎨", textEn:"She loves painting." },
            { emoji:"📖", textEn:"He enjoys reading." }
          ] }
      ]
    },
    {
      id:"whatdo", type:"mcq", character:"mahir",
      tagEn:"What Do They Like Doing?", tagAr:"ماذا يحبون أن يفعلوا؟",
      instructionsEn:"Choose the correct hobby.",
      instructionsAr:"اختر الهواية الصحيحة.",
      rounds:[
        { emoji:"🏊", promptEn:"She likes ___.", promptAr:"هي تحب ___.",
          options:["swimming","cooking","singing"], correct:"swimming" },
        { emoji:"🎨", promptEn:"He loves ___.", promptAr:"هو يحب ___.",
          options:["painting","cycling","chess"], correct:"painting" },
        { emoji:"🚴", promptEn:"They enjoy ___.", promptAr:"هم يستمتعون بـ ___.",
          options:["cycling","dancing","reading"], correct:"cycling" },
        { emoji:"🍳", promptEn:"My mother likes ___.", promptAr:"أمي تحب ___.",
          options:["cooking","swimming","singing"], correct:"cooking" },
        { emoji:"💃", promptEn:"My sister loves ___.", promptAr:"أختي تحب ___.",
          options:["dancing","painting","chess"], correct:"dancing" },
        { emoji:"♟️", promptEn:"My grandfather enjoys ___.", promptAr:"جدي يستمتع بـ ___.",
          options:["playing chess","cycling","singing"], correct:"playing chess" }
      ]
    },
    {
      id:"match", type:"match", character:"malik",
      tagEn:"Match the Hobby", tagAr:"طابق الهواية",
      instructionsEn:"Match the English word to the correct picture.",
      instructionsAr:"طابق الكلمة الإنجليزية مع الصورة الصحيحة.",
      rounds:[
        { pairs:["reading","swimming","painting","cycling"].map(id=>{
            const w = HOBBY_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) },
        { pairs:["cooking","dancing","singing","chess"].map(id=>{
            const w = HOBBY_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) }
      ]
    },
    {
      id:"challenge", type:"mcq", character:"marya",
      tagEn:"Pastimes Challenge", tagAr:"تحدي الهوايات",
      instructionsEn:"Choose the correct answer.",
      instructionsAr:"اختر الإجابة الصحيحة.",
      rounds:[
        { emoji:"🎤", promptEn:"What is this hobby?", promptAr:"ما هذه الهواية؟",
          options:["singing","dancing","reading"], correct:"singing" },
        { promptEn:"I ___ reading books about space.", promptAr:"أنا أحب قراءة كتب عن الفضاء.",
          options:["like","likes","liking"], correct:"like" },
        { emoji:"📖", promptEn:"What is this hobby?", promptAr:"ما هذه الهواية؟",
          options:["reading","cooking","chess"], correct:"reading" },
        { promptEn:"She ___ swimming every summer.", promptAr:"هي تستمتع بالسباحة كل صيف.",
          options:["enjoys","enjoy","enjoying"], correct:"enjoys" },
        { emoji:"♟️", promptEn:"What is this hobby?", promptAr:"ما هذه الهواية؟",
          options:["playing chess","painting","cycling"], correct:"playing chess" },
        { emoji:"🚴", promptEn:"What is this hobby?", promptAr:"ما هذه الهواية؟",
          options:["cycling","dancing","swimming"], correct:"cycling" }
      ]
    }
  ]
};

/* ---------- GAME 3 : THERE'S NO COMPARISON (Unit 11) ---------- */

const GAME_COMPARE = {
  id: "compare",
  emoji: "⚖️",
  titleEn: "There's No Comparison",
  titleAr: "لا مجال للمقارنة",
  character: "mahir",
  introEn: "Learn to compare two things: bigger, taller, more expensive!",
  introAr: "تعلّم كيف تقارن بين شيئين: أكبر، أطول، وأغلى!",
  activities: [
    {
      id:"teach", type:"teach", character:"maya",
      tagEn:"Comparative Adjectives", tagAr:"صيغة المقارنة",
      instructionsEn:"How do we compare 2 things?",
      instructionsAr:"كيف نقارن بين شيئين؟",
      teachBlocks:[
        { pillEn:"Add -er + than",
          descEn:"For short words, add -er and use than.", descAr:"للكلمات القصيرة، أضف -er واستخدم than.",
          examples:[
            { emoji:"📏", textEn:"tall → taller than" },
            { emoji:"📦", textEn:"big → bigger than" }
          ] },
        { pillEn:"Use more + than", accent:true,
          descEn:"For longer words, use more before the word instead.", descAr:"للكلمات الأطول، استخدم more قبل الكلمة بدلاً من ذلك.",
          examples:[ { emoji:"💰", textEn:"expensive → more expensive than" } ] }
      ]
    },
    {
      id:"shortadj", type:"mcq", character:"mahir",
      tagEn:"Bigger, Taller, Faster...", tagAr:"أكبر، أطول، أسرع...",
      instructionsEn:"Choose the correct comparative word.",
      instructionsAr:"اختر كلمة المقارنة الصحيحة.",
      rounds:[
        { emoji:"🐘🐭", promptEn:"An elephant is ___ than a mouse.", promptAr:"الفيل ___ من الفأر.",
          options:["bigger","biggest","more big"], correct:"bigger" },
        { emoji:"🦒🐕", promptEn:"A giraffe is ___ than a dog.", promptAr:"الزرافة ___ من الكلب.",
          options:["taller","tallest","more tall"], correct:"taller" },
        { emoji:"🐆🐢", promptEn:"A cheetah is ___ than a turtle.", promptAr:"الفهد ___ من السلحفاة.",
          options:["faster","fastest","more fast"], correct:"faster" },
        { emoji:"🐜🐘", promptEn:"An ant is ___ than an elephant.", promptAr:"النملة ___ من الفيل.",
          options:["smaller","smallest","more small"], correct:"smaller" },
        { emoji:"🏔️🏞️", promptEn:"This mountain is ___ than that hill.", promptAr:"هذا الجبل ___ من ذلك التل.",
          options:["higher","highest","more high"], correct:"higher" },
        { emoji:"👴👦", promptEn:"My grandfather is ___ than me.", promptAr:"جدي ___ مني.",
          options:["older","oldest","more old"], correct:"older" }
      ]
    },
    {
      id:"longadj", type:"mcq", character:"marya",
      tagEn:"More Expensive, More Interesting...", tagAr:"أغلى، أكثر إثارة...",
      instructionsEn:"Choose the correct comparative phrase.",
      instructionsAr:"اختر عبارة المقارنة الصحيحة.",
      rounds:[
        { emoji:"🚗🚲", promptEn:"A car is ___ than a bicycle.", promptAr:"السيارة ___ من الدراجة.",
          options:["more expensive","expensiver","most expensive"], correct:"more expensive" },
        { emoji:"🎬📺", promptEn:"This movie is ___ than that show.", promptAr:"هذا الفيلم ___ من ذلك البرنامج.",
          options:["more interesting","interestinger","most interesting"], correct:"more interesting" },
        { emoji:"🧩🧩", promptEn:"Chess is ___ than checkers.", promptAr:"الشطرنج ___ من الداما.",
          options:["more difficult","difficulter","most difficult"], correct:"more difficult" },
        { emoji:"🏙️🏘️", promptEn:"Riyadh is ___ than a small town.", promptAr:"الرياض ___ من بلدة صغيرة.",
          options:["more modern","moderner","most modern"], correct:"more modern" },
        { emoji:"📚📱", promptEn:"That book is ___ than this game.", promptAr:"ذلك الكتاب ___ من هذه اللعبة.",
          options:["more boring","boringer","most boring"], correct:"more boring" },
        { emoji:"🥗🍔", promptEn:"A salad is ___ than a burger.", promptAr:"السلطة ___ من البرغر.",
          options:["more healthy","healthier","most healthy"], correct:"more healthy" }
      ]
    },
    {
      id:"comporsup", type:"mcq", character:"malik",
      tagEn:"Comparative or Superlative?", tagAr:"مقارنة أم تفضيل؟",
      instructionsEn:"Two things, or three or more? Choose the correct form.",
      instructionsAr:"شيئان أم ثلاثة أو أكثر؟ اختر الصيغة الصحيحة.",
      rounds:[
        { promptEn:"Ali is ___ than Omar. (2 boys)", promptAr:"علي ___ من عمر. (ولدان)",
          options:["taller","tallest"], correct:"taller" },
        { promptEn:"Ali is the ___ boy in the class. (many boys)", promptAr:"علي هو الولد ___ في الصف. (أولاد كثر)",
          options:["tallest","taller"], correct:"tallest" },
        { promptEn:"The blue whale is the ___ animal on Earth. (all animals)", promptAr:"الحوت الأزرق هو الحيوان ___ على الأرض.",
          options:["biggest","bigger"], correct:"biggest" },
        { promptEn:"My car is ___ than your car. (2 cars)", promptAr:"سيارتي ___ من سيارتك. (سيارتان)",
          options:["faster","fastest"], correct:"faster" },
        { promptEn:"This is the ___ question on the whole test. (all questions)", promptAr:"هذا هو السؤال ___ في كل الاختبار.",
          options:["easiest","easier"], correct:"easiest" },
        { promptEn:"Sara is ___ than her sister. (2 sisters)", promptAr:"سارة ___ من أختها. (أختان)",
          options:["shorter","shortest"], correct:"shorter" }
      ]
    },
    {
      id:"challenge", type:"mcq", character:"maya",
      tagEn:"Comparison Challenge", tagAr:"تحدي المقارنة",
      instructionsEn:"Choose the correct answer.",
      instructionsAr:"اختر الإجابة الصحيحة.",
      rounds:[
        { emoji:"🐋🐟", promptEn:"A whale is ___ than a fish.", promptAr:"الحوت ___ من السمكة.",
          options:["bigger","biggest","more big"], correct:"bigger" },
        { emoji:"💎🪨", promptEn:"A diamond is ___ than a rock.", promptAr:"الألماس ___ من الصخرة.",
          options:["more expensive","expensiver","most expensive"], correct:"more expensive" },
        { emoji:"🐢🐇", promptEn:"A rabbit is ___ than a turtle.", promptAr:"الأرنب ___ من السلحفاة.",
          options:["faster","fastest","more fast"], correct:"faster" },
        { promptEn:"This is the ___ mountain in the world. (all mountains)", promptAr:"هذا هو الجبل ___ في العالم.",
          options:["highest","higher"], correct:"highest" },
        { emoji:"🏠🏢", promptEn:"That building is ___ than my house.", promptAr:"ذلك المبنى ___ من بيتي.",
          options:["taller","tallest","more tall"], correct:"taller" },
        { emoji:"♟️🎮", promptEn:"Chess is ___ than most video games.", promptAr:"الشطرنج ___ من معظم ألعاب الفيديو.",
          options:["more difficult","difficulter","most difficult"], correct:"more difficult" }
      ]
    }
  ]
};

/* ---------- GAME 4 : WHAT'S WRONG? (Unit 8) ---------- */

const SYMPTOM_VOCAB = [
  { id:"headache", en:"headache", ar:"صداع", emoji:"🤕" },
  { id:"stomachache", en:"stomachache", ar:"ألم في المعدة", emoji:"🤢" },
  { id:"fever", en:"fever", ar:"حمى", emoji:"🤒" },
  { id:"cough", en:"cough", ar:"سعال", emoji:"😷" },
  { id:"sorethroat", en:"sore throat", ar:"التهاب الحلق", emoji:"😣" },
  { id:"toothache", en:"toothache", ar:"ألم في الأسنان", emoji:"🦷" },
  { id:"cold", en:"a cold", ar:"زكام", emoji:"🤧" },
  { id:"brokenarm", en:"a broken arm", ar:"ذراع مكسورة", emoji:"🦴" }
];

const GAME_WRONG = {
  id: "wrong",
  emoji: "🤒",
  titleEn: "What's Wrong?",
  titleAr: "ما المشكلة؟",
  character: "malik",
  introEn: "Learn to talk about how you feel and give advice!",
  introAr: "تعلّم كيف تتحدث عن شعورك وتقدّم النصيحة!",
  activities: [
    {
      id:"vocab", type:"vocab", character:"malik",
      tagEn:"Symptom Words", tagAr:"كلمات الأعراض",
      instructionsEn:"Tap a word to hear it and see its meaning.",
      instructionsAr:"اضغط على الكلمة لسماعها ومعرفة معناها.",
      words: SYMPTOM_VOCAB
    },
    {
      id:"teach", type:"teach", character:"maya",
      tagEn:"I Have a... / You Should...", tagAr:"I have a... / You should...",
      instructionsEn:"How do we talk about being sick, and give advice?",
      instructionsAr:"كيف نتحدث عن المرض ونقدّم النصيحة؟",
      teachBlocks:[
        { pillEn:"I have a...",
          descEn:"Use I have a/an + symptom to say how you feel.", descAr:"استخدم I have a/an + العرض لتقول كيف تشعر.",
          examples:[ { emoji:"🤕", textEn:"I have a headache." } ] },
        { pillEn:"You should...", accent:true,
          descEn:"Use you should + verb to give advice.", descAr:"استخدم you should + الفعل لتقديم النصيحة.",
          examples:[ { emoji:"😴", textEn:"You should rest." } ] }
      ]
    },
    {
      id:"whatswrong", type:"mcq", character:"mahir",
      tagEn:"What's Wrong With Them?", tagAr:"ما مشكلتهم؟",
      instructionsEn:"Choose the correct symptom.",
      instructionsAr:"اختر العرض الصحيح.",
      rounds:[
        { emoji:"🤕", promptEn:"What's wrong?", promptAr:"ما المشكلة؟",
          options:["a headache","a cold","a toothache"], correct:"a headache" },
        { emoji:"🤒", promptEn:"What's wrong?", promptAr:"ما المشكلة؟",
          options:["a fever","a cough","a stomachache"], correct:"a fever" },
        { emoji:"😷", promptEn:"What's wrong?", promptAr:"ما المشكلة؟",
          options:["a cough","a fever","a broken arm"], correct:"a cough" },
        { emoji:"🤢", promptEn:"What's wrong?", promptAr:"ما المشكلة؟",
          options:["a stomachache","a sore throat","a cold"], correct:"a stomachache" },
        { emoji:"🦷", promptEn:"What's wrong?", promptAr:"ما المشكلة؟",
          options:["a toothache","a headache","a fever"], correct:"a toothache" },
        { emoji:"🦴", promptEn:"What's wrong?", promptAr:"ما المشكلة؟",
          options:["a broken arm","a cold","a cough"], correct:"a broken arm" }
      ]
    },
    {
      id:"advice", type:"mcq", character:"marya",
      tagEn:"Give Advice", tagAr:"قدّم النصيحة",
      instructionsEn:"Choose the best advice.",
      instructionsAr:"اختر أفضل نصيحة.",
      rounds:[
        { promptEn:"I have a headache. You should ___.", promptAr:"لدي صداع. يجب أن ___.",
          options:["rest","run fast","eat candy"], correct:"rest" },
        { promptEn:"I have a fever. You should ___.", promptAr:"لدي حمى. يجب أن ___.",
          options:["see a doctor","go swimming","play outside"], correct:"see a doctor" },
        { promptEn:"I have a sore throat. You should ___.", promptAr:"لدي التهاب في الحلق. يجب أن ___.",
          options:["drink warm tea","eat ice cream","shout loudly"], correct:"drink warm tea" },
        { promptEn:"I have a toothache. You should ___.", promptAr:"لدي ألم في الأسنان. يجب أن ___.",
          options:["see a dentist","eat candy","drink cold water"], correct:"see a dentist" },
        { promptEn:"I have a cold. You should ___.", promptAr:"لدي زكام. يجب أن ___.",
          options:["drink water and rest","go swimming","stay up late"], correct:"drink water and rest" },
        { promptEn:"I have a stomachache. You should ___.", promptAr:"لدي ألم في المعدة. يجب أن ___.",
          options:["eat something light","eat a big meal","run a race"], correct:"eat something light" }
      ]
    },
    {
      id:"challenge", type:"mcq", character:"malik",
      tagEn:"Health Challenge", tagAr:"تحدي الصحة",
      instructionsEn:"Choose the correct answer.",
      instructionsAr:"اختر الإجابة الصحيحة.",
      rounds:[
        { promptEn:"I have a headache. I should ___.", promptAr:"لدي صداع. يجب أن ___.",
          options:["rest","run fast","eat candy"], correct:"rest" },
        { emoji:"🤧", promptEn:"What's wrong?", promptAr:"ما المشكلة؟",
          options:["a cold","a broken arm","a toothache"], correct:"a cold" },
        { promptEn:"You have a fever. You should ___.", promptAr:"لديك حمى. يجب أن ___.",
          options:["see a doctor","go to a party","play soccer"], correct:"see a doctor" },
        { emoji:"😣", promptEn:"What's wrong?", promptAr:"ما المشكلة؟",
          options:["a sore throat","a headache","a broken arm"], correct:"a sore throat" },
        { promptEn:"I fell and now I have ___.", promptAr:"سقطت والآن لدي ذراع مكسورة.",
          options:["a broken arm","a cold","a cough"], correct:"a broken arm" },
        { promptEn:"You have a cough. You should ___.", promptAr:"لديك سعال. يجب أن ___.",
          options:["drink warm tea","go swimming","shout loudly"], correct:"drink warm tea" }
      ]
    }
  ]
};

/* ---------- GAME 5 : HAVE YOU EVER...? (Unit 16) ---------- */

const EVER_VOCAB = [
  { id:"been", en:"been", ar:"ذهب / كان", emoji:"✈️" },
  { id:"seen", en:"seen", ar:"رأى", emoji:"👀" },
  { id:"eaten", en:"eaten", ar:"أكل", emoji:"🍽️" },
  { id:"tried", en:"tried", ar:"جرّب", emoji:"🎯" },
  { id:"visited", en:"visited", ar:"زار", emoji:"🗺️" },
  { id:"ridden", en:"ridden", ar:"ركب", emoji:"🐎" },
  { id:"won", en:"won", ar:"فاز", emoji:"🏆" },
  { id:"flown", en:"flown", ar:"طار", emoji:"🛫" }
];

const GAME_EVER = {
  id: "ever",
  emoji: "🌟",
  titleEn: "Have You Ever...?",
  titleAr: "هل سبق لك أن...؟",
  character: "mahir",
  introEn: "Learn to talk about life experiences!",
  introAr: "تعلّم كيف تتحدث عن تجارب حياتك!",
  activities: [
    {
      id:"vocab", type:"vocab", character:"mahir",
      tagEn:"Ever Verbs", tagAr:"أفعال التجربة",
      instructionsEn:"Tap a word to hear it and see its meaning.",
      instructionsAr:"اضغط على الكلمة لسماعها ومعرفة معناها.",
      words: EVER_VOCAB
    },
    {
      id:"teach", type:"teach", character:"maya",
      tagEn:"Have You Ever...?", tagAr:"Have you ever...?",
      instructionsEn:"How do we ask about life experiences?",
      instructionsAr:"كيف نسأل عن تجارب الحياة؟",
      teachBlocks:[
        { pillEn:"Have/Has + past participle",
          descEn:"Use have/has ever + the special past form of the verb to ask about experiences.", descAr:"استخدم have/has ever + الصيغة الخاصة للفعل في الماضي للسؤال عن التجارب.",
          examples:[
            { emoji:"👀", textEn:"Have you ever seen a lion?" },
            { emoji:"✈️", textEn:"She has never been to Japan." }
          ] }
      ]
    },
    {
      id:"complete", type:"mcq", character:"marya",
      tagEn:"Have You Ever...?", tagAr:"هل سبق لك أن...؟",
      instructionsEn:"Choose the correct word to complete the question.",
      instructionsAr:"اختر الكلمة الصحيحة لإكمال السؤال.",
      rounds:[
        { emoji:"👀", promptEn:"Have you ever ___ a lion?", promptAr:"هل سبق لك أن رأيت أسدًا؟",
          options:["seen","see","saw"], correct:"seen" },
        { emoji:"🍽️", promptEn:"Have you ever ___ sushi?", promptAr:"هل سبق لك أن أكلت السوشي؟",
          options:["eaten","eat","ate"], correct:"eaten" },
        { emoji:"✈️", promptEn:"Have you ever ___ to Egypt?", promptAr:"هل سبق لك أن ذهبت إلى مصر؟",
          options:["been","be","was"], correct:"been" },
        { emoji:"🐎", promptEn:"Have you ever ___ a horse?", promptAr:"هل سبق لك أن ركبت حصانًا؟",
          options:["ridden","ride","rode"], correct:"ridden" },
        { emoji:"🛫", promptEn:"Have you ever ___ in an airplane?", promptAr:"هل سبق لك أن طرت في طائرة؟",
          options:["flown","fly","flew"], correct:"flown" },
        { emoji:"🎯", promptEn:"Have you ever ___ a new sport?", promptAr:"هل سبق لك أن جرّبت رياضة جديدة؟",
          options:["tried","try","tries"], correct:"tried" }
      ]
    },
    {
      id:"challenge", type:"mcq", character:"malik",
      tagEn:"Ever Challenge", tagAr:"تحدي التجارب",
      instructionsEn:"Choose the correct answer.",
      instructionsAr:"اختر الإجابة الصحيحة.",
      rounds:[
        { emoji:"🗺️", promptEn:"Mahir has ___ Makkah many times.", promptAr:"زار ماهر مكة مرات عديدة.",
          options:["visited","visit","visits"], correct:"visited" },
        { emoji:"🏆", promptEn:"Maya has ___ first place in the race.", promptAr:"فازت مايا بالمركز الأول في السباق.",
          options:["won","win","wins"], correct:"won" },
        { promptEn:"Have you ever ___ a movie in the cinema?", promptAr:"هل سبق لك أن شاهدت فيلمًا في السينما؟",
          options:["seen","see","saw"], correct:"seen" },
        { promptEn:"She has never ___ camel milk.", promptAr:"لم تجرّب حليب الإبل من قبل.",
          options:["tried","try","tries"], correct:"tried" },
        { promptEn:"Malik has ___ to three different countries.", promptAr:"ذهب مالك إلى ثلاث دول مختلفة.",
          options:["been","go","went"], correct:"been" },
        { promptEn:"Have you ever ___ a bicycle race?", promptAr:"هل سبق لك أن فزت بسباق دراجات؟",
          options:["won","win","wins"], correct:"won" }
      ]
    },
    {
      id:"buildquestion", type:"order", character:"mahir", orderMode:"words",
      tagEn:"Build the Question", tagAr:"كوّن السؤال",
      instructionsEn:"Drag the words into the correct order.",
      instructionsAr:"اسحب الكلمات بالترتيب الصحيح.",
      rounds:[
        { items:["Have","you","ever","eaten","sushi"].map((w,i)=>({id:"bq1_"+i, labelEn:w})) },
        { items:["Have","you","ever","seen","a","lion"].map((w,i)=>({id:"bq2_"+i, labelEn:w})) },
        { items:["She","has","never","been","to","Japan"].map((w,i)=>({id:"bq3_"+i, labelEn:w})) },
        { items:["Have","you","ever","ridden","a","horse"].map((w,i)=>({id:"bq4_"+i, labelEn:w})) }
      ]
    }
  ]
};

const ALL_GAMES = [GAME_WHOSWHO, GAME_PASTIMES, GAME_COMPARE, GAME_WRONG, GAME_EVER];
