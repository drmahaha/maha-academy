/* ===========================================================
   Maha Academy — Content Data (Grade 1 English)
   Based on the "We Can 1" textbook (أول ابتدائي, term 1) — unit
   titles confirmed via a Saudi curriculum source:
     Unit 1  My Friends
     Unit 2  My Body
     Unit 3  My Family
     Unit 4  How Old Are You?
     Unit 5  What's This? What's That?
   Grade 1 students are early readers, so content stays very
   short (2-4 word sentences), leans on emoji pictures for every
   word, and uses the engine's audio "speak" feature heavily so
   pre-readers can hear a word before they have to recognize it.
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

/* ---------- GAME 1 : MY FRIENDS (Unit 1) ---------- */

const FRIENDS_VOCAB = [
  { id:"hello", en:"hello", ar:"مرحباً", emoji:"👋" },
  { id:"goodbye", en:"goodbye", ar:"مع السلامة", emoji:"🙋" },
  { id:"friend", en:"friend", ar:"صديق", emoji:"🧑‍🤝‍🧑" },
  { id:"name", en:"name", ar:"اسم", emoji:"🏷️" },
  { id:"please", en:"please", ar:"من فضلك", emoji:"🙏" },
  { id:"thankyou", en:"thank you", ar:"شكراً", emoji:"😊" },
  { id:"yes", en:"yes", ar:"نعم", emoji:"✅" },
  { id:"no", en:"no", ar:"لا", emoji:"❌" }
];

const GAME_FRIENDS = {
  id: "friends",
  emoji: "👋",
  titleEn: "My Friends",
  titleAr: "أصدقائي",
  character: "mahir",
  introEn: "Meet Mahir's friends and learn how to say hello!",
  introAr: "تعرّف على أصدقاء ماهر وتعلّم كيف تقول مرحباً!",
  activities: [
    {
      id:"vocab", type:"vocab", character:"mahir",
      tagEn:"Friend Words", tagAr:"كلمات الصداقة",
      instructionsEn:"Tap a word to hear it and see its meaning.",
      instructionsAr:"اضغط على الكلمة لسماعها ومعرفة معناها.",
      words: FRIENDS_VOCAB
    },
    {
      id:"teach", type:"teach", character:"maya",
      tagEn:"Say Hello!", tagAr:"قل مرحباً!",
      instructionsEn:"How do we say hello and goodbye?",
      instructionsAr:"كيف نقول مرحباً ومع السلامة؟",
      teachBlocks:[
        { pillEn:"Hello! I'm Mahir.",
          descEn:"We say this when we meet a friend for the first time.", descAr:"نقول هذا عندما نقابل صديقاً لأول مرة.",
          examples:[ { emoji:"👋", textEn:"Hello! I'm Maya." } ] },
        { pillEn:"Goodbye!", accent:true,
          descEn:"We say this when we leave a friend.", descAr:"نقول هذا عندما نودّع صديقاً.",
          examples:[ { emoji:"🙋", textEn:"Goodbye, friend!" } ] }
      ]
    },
    {
      id:"listen", type:"mcq", character:"marya", audio:true,
      tagEn:"Listen and Choose", tagAr:"استمع واختر",
      instructionsEn:"Listen, then choose the word you heard.",
      instructionsAr:"استمع، ثم اختر الكلمة التي سمعتها.",
      rounds:[
        { promptEn:"Which word did you hear?", promptAr:"ما الكلمة التي سمعتها؟", speak:"hello",
          options:["hello","goodbye","friend"], correct:"hello" },
        { promptEn:"Which word did you hear?", promptAr:"ما الكلمة التي سمعتها؟", speak:"please",
          options:["please","thank you","yes"], correct:"please" },
        { promptEn:"Which word did you hear?", promptAr:"ما الكلمة التي سمعتها؟", speak:"thank you",
          options:["thank you","goodbye","no"], correct:"thank you" },
        { promptEn:"Which word did you hear?", promptAr:"ما الكلمة التي سمعتها؟", speak:"friend",
          options:["friend","name","yes"], correct:"friend" },
        { promptEn:"Which word did you hear?", promptAr:"ما الكلمة التي سمعتها؟", speak:"goodbye",
          options:["goodbye","hello","please"], correct:"goodbye" }
      ]
    },
    {
      id:"match", type:"match", character:"marya",
      tagEn:"Match the Word", tagAr:"طابق الكلمة",
      instructionsEn:"Match the English word to the correct picture.",
      instructionsAr:"طابق الكلمة الإنجليزية مع الصورة الصحيحة.",
      rounds:[
        { pairs:["hello","goodbye","friend","name"].map(id=>{
            const w = FRIENDS_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) },
        { pairs:["please","thankyou","yes","no"].map(id=>{
            const w = FRIENDS_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) }
      ]
    },
    {
      id:"buildsentence", type:"order", character:"mahir", speakOnPlace:true,
      tagEn:"Build the Sentence", tagAr:"كوّن الجملة",
      instructionsEn:"Put the words in the correct order.",
      instructionsAr:"رتّب الكلمات بالترتيب الصحيح.",
      rounds:[
        { items:["Hello","I","am","Sara"].map((w,i)=>({id:"fr1_"+i, labelEn:w})) },
        { items:["This","is","my","friend"].map((w,i)=>({id:"fr2_"+i, labelEn:w})) },
        { items:["Thank","you","friend"].map((w,i)=>({id:"fr3_"+i, labelEn:w})) },
        { items:["Goodbye","see","you","soon"].map((w,i)=>({id:"fr4_"+i, labelEn:w})) }
      ]
    },
    {
      id:"challenge", type:"mcq", character:"malik",
      tagEn:"My Friends Challenge", tagAr:"تحدي أصدقائي",
      instructionsEn:"Choose the correct answer.",
      instructionsAr:"اختر الإجابة الصحيحة.",
      rounds:[
        { promptEn:"👋 What do you say when you meet a friend?", promptAr:"👋 ماذا تقول عندما تقابل صديقاً؟",
          options:["Hello","Goodbye","No"], correct:"Hello" },
        { promptEn:"🙋 What do you say when you leave?", promptAr:"🙋 ماذا تقول عندما تغادر؟",
          options:["Goodbye","Hello","Please"], correct:"Goodbye" },
        { promptEn:"🙏 What do you say when you want something politely?", promptAr:"🙏 ماذا تقول عندما تريد شيئاً بأدب؟",
          options:["Please","No","Name"], correct:"Please" },
        { promptEn:"😊 What do you say when someone gives you a gift?", promptAr:"😊 ماذا تقول عندما يعطيك أحد هدية؟",
          options:["Thank you","Goodbye","No"], correct:"Thank you" },
        { promptEn:"🧑‍🤝‍🧑 What do we call someone we like to play with?", promptAr:"🧑‍🤝‍🧑 ماذا نسمي شخصاً نحب اللعب معه؟",
          options:["a friend","a name","a friendly"], correct:"a friend" },
        { promptEn:"✅ Is this the word for 'yes'?", promptAr:"✅ هل هذه كلمة 'نعم'؟",
          options:["yes","no","please"], correct:"yes" }
      ]
    }
  ]
};

/* ---------- GAME 2 : MY BODY (Unit 2) ---------- */

const BODY_VOCAB = [
  { id:"head", en:"head", ar:"رأس", emoji:"🗣️" },
  { id:"eyes", en:"eyes", ar:"عينان", emoji:"👀" },
  { id:"nose", en:"nose", ar:"أنف", emoji:"👃" },
  { id:"mouth", en:"mouth", ar:"فم", emoji:"👄" },
  { id:"ears", en:"ears", ar:"أذنان", emoji:"👂" },
  { id:"hands", en:"hands", ar:"يدان", emoji:"🤲" },
  { id:"feet", en:"feet", ar:"قدمان", emoji:"🦶" },
  { id:"hair", en:"hair", ar:"شعر", emoji:"💇" }
];

const GAME_BODY = {
  id: "body",
  emoji: "🧍",
  titleEn: "My Body",
  titleAr: "جسمي",
  character: "maya",
  introEn: "Learn the parts of your body with Maya!",
  introAr: "تعلّم أجزاء جسمك مع مايا!",
  activities: [
    {
      id:"vocab", type:"vocab", character:"maya",
      tagEn:"Body Words", tagAr:"كلمات الجسم",
      instructionsEn:"Tap a word to hear it and see its meaning.",
      instructionsAr:"اضغط على الكلمة لسماعها ومعرفة معناها.",
      words: BODY_VOCAB
    },
    {
      id:"teach", type:"teach", character:"maya",
      tagEn:"Touch Your...", tagAr:"المس...",
      instructionsEn:"We use our body parts every day!",
      instructionsAr:"نستخدم أجزاء جسمنا كل يوم!",
      teachBlocks:[
        { pillEn:"Touch your head!",
          descEn:"We use this word for one body part.", descAr:"نستخدم هذه الكلمة لجزء واحد من الجسم.",
          examples:[ { emoji:"🗣️", textEn:"This is my head." } ] },
        { pillEn:"Touch your ears!", accent:true,
          descEn:"We use this word for two body parts (a pair).", descAr:"نستخدم هذه الكلمة لجزأين من الجسم (زوج).",
          examples:[ { emoji:"👂", textEn:"These are my ears." } ] }
      ]
    },
    {
      id:"seehear", type:"mcq", character:"mahir",
      tagEn:"What Do We Use?", tagAr:"ماذا نستخدم؟",
      instructionsEn:"Choose the correct body part.",
      instructionsAr:"اختر جزء الجسم الصحيح.",
      rounds:[
        { promptEn:"👀 What do you use to see?", promptAr:"👀 ماذا تستخدم لترى؟",
          options:["eyes","ears","nose"], correct:"eyes" },
        { promptEn:"👂 What do you use to hear?", promptAr:"👂 ماذا تستخدم لتسمع؟",
          options:["ears","eyes","mouth"], correct:"ears" },
        { promptEn:"👃 What do you use to smell?", promptAr:"👃 ماذا تستخدم لتشم؟",
          options:["nose","hands","feet"], correct:"nose" },
        { promptEn:"👄 What do you use to eat?", promptAr:"👄 ماذا تستخدم لتأكل؟",
          options:["mouth","hair","head"], correct:"mouth" },
        { promptEn:"🤲 What do you use to clap?", promptAr:"🤲 ماذا تستخدم لتصفق؟",
          options:["hands","feet","ears"], correct:"hands" },
        { promptEn:"🦶 What do you use to walk?", promptAr:"🦶 ماذا تستخدم لتمشي؟",
          options:["feet","hands","head"], correct:"feet" }
      ]
    },
    {
      id:"match", type:"match", character:"marya",
      tagEn:"Match the Body Part", tagAr:"طابق جزء الجسم",
      instructionsEn:"Match the English word to the correct picture.",
      instructionsAr:"طابق الكلمة الإنجليزية مع الصورة الصحيحة.",
      rounds:[
        { pairs:["head","eyes","nose","mouth"].map(id=>{
            const w = BODY_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) },
        { pairs:["ears","hands","feet","hair"].map(id=>{
            const w = BODY_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) }
      ]
    },
    {
      id:"buildsentence", type:"order", character:"maya", speakOnPlace:true,
      tagEn:"Build the Sentence", tagAr:"كوّن الجملة",
      instructionsEn:"Put the words in the correct order.",
      instructionsAr:"رتّب الكلمات بالترتيب الصحيح.",
      rounds:[
        { items:["Touch","your","head"].map((w,i)=>({id:"bd1_"+i, labelEn:w})) },
        { items:["Wash","your","hands"].map((w,i)=>({id:"bd2_"+i, labelEn:w})) },
        { items:["I","have","two","eyes"].map((w,i)=>({id:"bd3_"+i, labelEn:w})) },
        { items:["Clap","your","hands"].map((w,i)=>({id:"bd4_"+i, labelEn:w})) }
      ]
    },
    {
      id:"challenge", type:"mcq", character:"malik",
      tagEn:"My Body Challenge", tagAr:"تحدي جسمي",
      instructionsEn:"Choose the correct answer.",
      instructionsAr:"اختر الإجابة الصحيحة.",
      rounds:[
        { promptEn:"🗣️ What is on top of your body?", promptAr:"🗣️ ما الذي يعلو جسمك؟",
          options:["head","feet","hands"], correct:"head" },
        { promptEn:"💇 What grows on your head?", promptAr:"💇 ماذا ينمو على رأسك؟",
          options:["hair","eyes","nose"], correct:"hair" },
        { promptEn:"👀 How many eyes do you have?", promptAr:"👀 كم عيناً لديك؟",
          options:["two","one","three"], correct:"two" },
        { promptEn:"🤲 What do you use to clap and wave?", promptAr:"🤲 ماذا تستخدم للتصفيق والتلويح؟",
          options:["hands","feet","ears"], correct:"hands" },
        { promptEn:"👃 What is between your eyes and mouth?", promptAr:"👃 ما الذي بين عينيك وفمك؟",
          options:["nose","ears","hair"], correct:"nose" },
        { promptEn:"🦶 What do you use to walk and run?", promptAr:"🦶 ماذا تستخدم للمشي والجري؟",
          options:["feet","hands","head"], correct:"feet" }
      ]
    }
  ]
};

/* ---------- GAME 3 : MY FAMILY (Unit 3) ---------- */

const FAMILY_VOCAB = [
  { id:"mom", en:"mom", ar:"أم", emoji:"👩" },
  { id:"dad", en:"dad", ar:"أب", emoji:"👨" },
  { id:"sister", en:"sister", ar:"أخت", emoji:"👧" },
  { id:"brother", en:"brother", ar:"أخ", emoji:"👦" },
  { id:"baby", en:"baby", ar:"طفل رضيع", emoji:"👶" },
  { id:"grandma", en:"grandma", ar:"جدة", emoji:"👵" },
  { id:"grandpa", en:"grandpa", ar:"جد", emoji:"👴" },
  { id:"family", en:"family", ar:"عائلة", emoji:"👪" }
];

const GAME_FAMILY = {
  id: "family",
  emoji: "👪",
  titleEn: "My Family",
  titleAr: "عائلتي",
  character: "marya",
  introEn: "Meet Marya's family and learn family words!",
  introAr: "تعرّف على عائلة ماريا وتعلّم كلمات العائلة!",
  activities: [
    {
      id:"vocab", type:"vocab", character:"marya",
      tagEn:"Family Words", tagAr:"كلمات العائلة",
      instructionsEn:"Tap a word to hear it and see its meaning.",
      instructionsAr:"اضغط على الكلمة لسماعها ومعرفة معناها.",
      words: FAMILY_VOCAB
    },
    {
      id:"teach", type:"teach", character:"marya",
      tagEn:"This Is My...", tagAr:"هذا هو...",
      instructionsEn:"How do we introduce our family?",
      instructionsAr:"كيف نُعرّف بعائلتنا؟",
      teachBlocks:[
        { pillEn:"This is my mom.",
          descEn:"We say \"this is\" to introduce one person.", descAr:"نقول \"this is\" للتعريف بشخص واحد.",
          examples:[ { emoji:"👩", textEn:"This is my mom." } ] },
        { pillEn:"This is my family.", accent:true,
          descEn:"\"Family\" means all the people who live together and love each other.", descAr:"\"Family\" تعني كل الأشخاص الذين يعيشون معاً ويحبون بعضهم.",
          examples:[ { emoji:"👪", textEn:"I love my family." } ] }
      ]
    },
    {
      id:"whois", type:"mcq", character:"mahir",
      tagEn:"Who Is This?", tagAr:"من هذا؟",
      instructionsEn:"Choose the correct family word.",
      instructionsAr:"اختر كلمة العائلة الصحيحة.",
      rounds:[
        { promptEn:"👩 Who is this?", promptAr:"👩 من هذه؟",
          options:["mom","dad","sister"], correct:"mom" },
        { promptEn:"👨 Who is this?", promptAr:"👨 من هذا؟",
          options:["dad","mom","brother"], correct:"dad" },
        { promptEn:"👧 Who is this?", promptAr:"👧 من هذه؟",
          options:["sister","brother","baby"], correct:"sister" },
        { promptEn:"👦 Who is this?", promptAr:"👦 من هذا؟",
          options:["brother","sister","grandma"], correct:"brother" },
        { promptEn:"👵 Who is this?", promptAr:"👵 من هذه؟",
          options:["grandma","grandpa","mom"], correct:"grandma" },
        { promptEn:"👴 Who is this?", promptAr:"👴 من هذا؟",
          options:["grandpa","grandma","dad"], correct:"grandpa" }
      ]
    },
    {
      id:"match", type:"match", character:"marya",
      tagEn:"Match the Family Word", tagAr:"طابق كلمة العائلة",
      instructionsEn:"Match the English word to the correct picture.",
      instructionsAr:"طابق الكلمة الإنجليزية مع الصورة الصحيحة.",
      rounds:[
        { pairs:["mom","dad","sister","brother"].map(id=>{
            const w = FAMILY_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) },
        { pairs:["baby","grandma","grandpa","family"].map(id=>{
            const w = FAMILY_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) }
      ]
    },
    {
      id:"buildsentence", type:"order", character:"marya", speakOnPlace:true,
      tagEn:"Build the Sentence", tagAr:"كوّن الجملة",
      instructionsEn:"Put the words in the correct order.",
      instructionsAr:"رتّب الكلمات بالترتيب الصحيح.",
      rounds:[
        { items:["This","is","my","mom"].map((w,i)=>({id:"fm1_"+i, labelEn:w})) },
        { items:["This","is","my","dad"].map((w,i)=>({id:"fm2_"+i, labelEn:w})) },
        { items:["I","love","my","family"].map((w,i)=>({id:"fm3_"+i, labelEn:w})) },
        { items:["This","is","my","sister"].map((w,i)=>({id:"fm4_"+i, labelEn:w})) }
      ]
    },
    {
      id:"challenge", type:"mcq", character:"malik",
      tagEn:"My Family Challenge", tagAr:"تحدي عائلتي",
      instructionsEn:"Choose the correct answer.",
      instructionsAr:"اختر الإجابة الصحيحة.",
      rounds:[
        { promptEn:"👶 What do we call a very young child?", promptAr:"👶 ماذا نسمي طفلاً صغيراً جداً؟",
          options:["a baby","a grandpa","a dad"], correct:"a baby" },
        { promptEn:"👪 What do we call all the people who live together?", promptAr:"👪 ماذا نسمي كل الأشخاص الذين يعيشون معاً؟",
          options:["a family","a friend","a name"], correct:"a family" },
        { promptEn:"👵 Who is your mom's mom?", promptAr:"👵 من هي أم أمك؟",
          options:["grandma","sister","mom"], correct:"grandma" },
        { promptEn:"👴 Who is your dad's dad?", promptAr:"👴 من هو أب أبيك؟",
          options:["grandpa","brother","dad"], correct:"grandpa" },
        { promptEn:"👧 What do we call a girl in the family?", promptAr:"👧 ماذا نسمي فتاة في العائلة؟",
          options:["sister","brother","baby"], correct:"sister" },
        { promptEn:"👦 What do we call a boy in the family?", promptAr:"👦 ماذا نسمي فتى في العائلة؟",
          options:["brother","sister","grandma"], correct:"brother" }
      ]
    }
  ]
};

/* ---------- GAME 4 : HOW OLD ARE YOU? (Unit 4) ---------- */

const NUMBER_VOCAB = [
  { id:"one", en:"one", ar:"واحد", emoji:"1️⃣" },
  { id:"two", en:"two", ar:"اثنان", emoji:"2️⃣" },
  { id:"three", en:"three", ar:"ثلاثة", emoji:"3️⃣" },
  { id:"four", en:"four", ar:"أربعة", emoji:"4️⃣" },
  { id:"five", en:"five", ar:"خمسة", emoji:"5️⃣" },
  { id:"six", en:"six", ar:"ستة", emoji:"6️⃣" },
  { id:"seven", en:"seven", ar:"سبعة", emoji:"7️⃣" },
  { id:"eight", en:"eight", ar:"ثمانية", emoji:"8️⃣" },
  { id:"nine", en:"nine", ar:"تسعة", emoji:"9️⃣" },
  { id:"ten", en:"ten", ar:"عشرة", emoji:"🔟" }
];

const GAME_AGE = {
  id: "age",
  emoji: "🎂",
  titleEn: "How Old Are You?",
  titleAr: "كم عمرك؟",
  character: "mahir",
  introEn: "Count from one to ten and learn to talk about your age!",
  introAr: "عدّ من واحد إلى عشرة وتعلّم كيف تتحدث عن عمرك!",
  activities: [
    {
      id:"vocab", type:"vocab", character:"mahir",
      tagEn:"Number Words", tagAr:"كلمات الأعداد",
      instructionsEn:"Tap a number to hear it.",
      instructionsAr:"اضغط على العدد لسماعه.",
      words: NUMBER_VOCAB
    },
    {
      id:"teach", type:"teach", character:"maya",
      tagEn:"How Old Are You?", tagAr:"كم عمرك؟",
      instructionsEn:"How do we ask and answer about age?",
      instructionsAr:"كيف نسأل ونجيب عن العمر؟",
      teachBlocks:[
        { pillEn:"How old are you?",
          descEn:"We ask this to know someone's age.", descAr:"نسأل هذا لمعرفة عمر شخص.",
          examples:[ { emoji:"🎂", textEn:"How old are you?" } ] },
        { pillEn:"I am six years old.", accent:true,
          descEn:"We answer with \"I am ___ years old.\"", descAr:"نجيب بـ \"I am ___ years old.\"",
          examples:[ { emoji:"6️⃣", textEn:"I am six years old." } ] }
      ]
    },
    {
      id:"count", type:"mcq", character:"marya", visualKind:"count",
      tagEn:"Count and Choose", tagAr:"عدّ واختر",
      instructionsEn:"Count the pictures, then choose the number.",
      instructionsAr:"عدّ الصور، ثم اختر العدد.",
      rounds:[
        { emoji:"⭐", count:3, nounEn:"stars", nounAr:"نجمات", promptEn:"How many stars?", promptAr:"كم نجمة؟",
          options:["three","two","five"], correct:"three" },
        { emoji:"🍎", count:2, nounEn:"apples", nounAr:"تفاحات", promptEn:"How many apples?", promptAr:"كم تفاحة؟",
          options:["two","four","one"], correct:"two" },
        { emoji:"🐱", count:5, nounEn:"cats", nounAr:"قطط", promptEn:"How many cats?", promptAr:"كم قطة؟",
          options:["five","six","three"], correct:"five" },
        { emoji:"🎈", count:7, nounEn:"balloons", nounAr:"بالونات", promptEn:"How many balloons?", promptAr:"كم بالوناً؟",
          options:["seven","eight","six"], correct:"seven" },
        { emoji:"🚗", count:1, nounEn:"car", nounAr:"سيارة", promptEn:"How many cars?", promptAr:"كم سيارة؟",
          options:["one","two","ten"], correct:"one" },
        { emoji:"🌟", count:10, nounEn:"stars", nounAr:"نجمات", promptEn:"How many stars?", promptAr:"كم نجمة؟",
          options:["ten","nine","eight"], correct:"ten" }
      ]
    },
    {
      id:"match", type:"match", character:"marya",
      tagEn:"Match the Number", tagAr:"طابق العدد",
      instructionsEn:"Match the English word to the correct number.",
      instructionsAr:"طابق الكلمة الإنجليزية مع العدد الصحيح.",
      rounds:[
        { pairs:["one","two","three","four"].map(id=>{
            const w = NUMBER_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) },
        { pairs:["five","six","seven","eight"].map(id=>{
            const w = NUMBER_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) }
      ]
    },
    {
      id:"buildsentence", type:"order", character:"mahir", speakOnPlace:true,
      tagEn:"Build the Sentence", tagAr:"كوّن الجملة",
      instructionsEn:"Put the words in the correct order.",
      instructionsAr:"رتّب الكلمات بالترتيب الصحيح.",
      rounds:[
        { items:["How","old","are","you"].map((w,i)=>({id:"ag1_"+i, labelEn:w})) },
        { items:["I","am","six","years","old"].map((w,i)=>({id:"ag2_"+i, labelEn:w})) },
        { items:["I","am","seven","years","old"].map((w,i)=>({id:"ag3_"+i, labelEn:w})) },
        { items:["Count","to","ten"].map((w,i)=>({id:"ag4_"+i, labelEn:w})) }
      ]
    },
    {
      id:"challenge", type:"mcq", character:"malik",
      tagEn:"How Old Are You Challenge", tagAr:"تحدي كم عمرك",
      instructionsEn:"Choose the correct answer.",
      instructionsAr:"اختر الإجابة الصحيحة.",
      rounds:[
        { promptEn:"What comes after five?", promptAr:"ماذا يأتي بعد خمسة؟",
          options:["six","four","seven"], correct:"six" },
        { promptEn:"What comes before ten?", promptAr:"ماذا يأتي قبل عشرة؟",
          options:["nine","eight","one"], correct:"nine" },
        { promptEn:"🎂 What do we ask to know someone's age?", promptAr:"🎂 ماذا نسأل لمعرفة عمر شخص؟",
          options:["How old are you?","What is your name?","Where are you?"], correct:"How old are you?" },
        { promptEn:"What comes after two?", promptAr:"ماذا يأتي بعد اثنين؟",
          options:["three","one","four"], correct:"three" },
        { promptEn:"What comes before four?", promptAr:"ماذا يأتي قبل أربعة؟",
          options:["three","five","two"], correct:"three" },
        { promptEn:"What is the first number when we count?", promptAr:"ما أول عدد عندما نعدّ؟",
          options:["one","ten","zero"], correct:"one" }
      ]
    }
  ]
};

/* ---------- GAME 5 : WHAT'S THIS? WHAT'S THAT? (Unit 5) ---------- */

const OBJECTS_VOCAB = [
  { id:"book", en:"book", ar:"كتاب", emoji:"📖" },
  { id:"pencil", en:"pencil", ar:"قلم رصاص", emoji:"✏️" },
  { id:"bag", en:"bag", ar:"حقيبة", emoji:"🎒" },
  { id:"chair", en:"chair", ar:"كرسي", emoji:"🪑" },
  { id:"table", en:"table", ar:"طاولة", emoji:"🗄️" },
  { id:"pen", en:"pen", ar:"قلم حبر", emoji:"🖊️" },
  { id:"ruler", en:"ruler", ar:"مسطرة", emoji:"📏" },
  { id:"eraser", en:"eraser", ar:"ممحاة", emoji:"🧼" }
];

const GAME_OBJECTS = {
  id: "objects",
  emoji: "🎒",
  titleEn: "What's This? What's That?",
  titleAr: "ما هذا؟ ما ذلك؟",
  character: "maya",
  introEn: "Learn classroom objects and ask 'What's this?'",
  introAr: "تعلّم أدوات الفصل واسأل 'ما هذا؟'",
  activities: [
    {
      id:"vocab", type:"vocab", character:"maya",
      tagEn:"Classroom Words", tagAr:"كلمات الفصل",
      instructionsEn:"Tap a word to hear it and see its meaning.",
      instructionsAr:"اضغط على الكلمة لسماعها ومعرفة معناها.",
      words: OBJECTS_VOCAB
    },
    {
      id:"teach", type:"teach", character:"maya",
      tagEn:"This or That?", tagAr:"هذا أم ذلك؟",
      instructionsEn:"We use 'this' for near, and 'that' for far.",
      instructionsAr:"نستخدم 'this' للقريب، و'that' للبعيد.",
      teachBlocks:[
        { pillEn:"This is a book.",
          descEn:"We say \"this\" for something close to us.", descAr:"نقول \"this\" لشيء قريب منا.",
          examples:[ { emoji:"📖", textEn:"This is a book." } ] },
        { pillEn:"That is a chair.", accent:true,
          descEn:"We say \"that\" for something far from us.", descAr:"نقول \"that\" لشيء بعيد عنا.",
          examples:[ { emoji:"🪑", textEn:"That is a chair." } ] }
      ]
    },
    {
      id:"whatsthis", type:"mcq", character:"mahir",
      tagEn:"What's This?", tagAr:"ما هذا؟",
      instructionsEn:"Choose the correct object.",
      instructionsAr:"اختر الأداة الصحيحة.",
      rounds:[
        { promptEn:"📖 What's this?", promptAr:"📖 ما هذا؟",
          options:["a book","a bag","a pen"], correct:"a book" },
        { promptEn:"✏️ What's this?", promptAr:"✏️ ما هذا؟",
          options:["a pencil","a ruler","a chair"], correct:"a pencil" },
        { promptEn:"🎒 What's this?", promptAr:"🎒 ما هذا؟",
          options:["a bag","a table","a book"], correct:"a bag" },
        { promptEn:"🪑 What's that?", promptAr:"🪑 ما ذلك؟",
          options:["a chair","a pencil","an eraser"], correct:"a chair" },
        { promptEn:"📏 What's this?", promptAr:"📏 ما هذا؟",
          options:["a ruler","a pen","a bag"], correct:"a ruler" },
        { promptEn:"🧼 What's this?", promptAr:"🧼 ما هذا؟",
          options:["an eraser","a book","a table"], correct:"an eraser" }
      ]
    },
    {
      id:"match", type:"match", character:"marya",
      tagEn:"Match the Object", tagAr:"طابق الأداة",
      instructionsEn:"Match the English word to the correct picture.",
      instructionsAr:"طابق الكلمة الإنجليزية مع الصورة الصحيحة.",
      rounds:[
        { pairs:["book","pencil","bag","chair"].map(id=>{
            const w = OBJECTS_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) },
        { pairs:["table","pen","ruler","eraser"].map(id=>{
            const w = OBJECTS_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) }
      ]
    },
    {
      id:"buildsentence", type:"order", character:"maya", speakOnPlace:true,
      tagEn:"Build the Sentence", tagAr:"كوّن الجملة",
      instructionsEn:"Put the words in the correct order.",
      instructionsAr:"رتّب الكلمات بالترتيب الصحيح.",
      rounds:[
        { items:["This","is","a","book"].map((w,i)=>({id:"ob1_"+i, labelEn:w})) },
        { items:["That","is","a","chair"].map((w,i)=>({id:"ob2_"+i, labelEn:w})) },
        { items:["This","is","my","bag"].map((w,i)=>({id:"ob3_"+i, labelEn:w})) },
        { items:["What's","this"].map((w,i)=>({id:"ob4_"+i, labelEn:w})) }
      ]
    },
    {
      id:"challenge", type:"mcq", character:"malik",
      tagEn:"Classroom Challenge", tagAr:"تحدي الفصل",
      instructionsEn:"Choose the correct answer.",
      instructionsAr:"اختر الإجابة الصحيحة.",
      rounds:[
        { promptEn:"What word do we use for something near us?", promptAr:"ما الكلمة التي نستخدمها لشيء قريب منا؟",
          options:["this","that","those"], correct:"this" },
        { promptEn:"What word do we use for something far from us?", promptAr:"ما الكلمة التي نستخدمها لشيء بعيد عنا؟",
          options:["that","this","these"], correct:"that" },
        { promptEn:"✏️ What do we use to write in pencil?", promptAr:"✏️ ماذا نستخدم للكتابة بالرصاص؟",
          options:["a pencil","a ruler","an eraser"], correct:"a pencil" },
        { promptEn:"🧼 What do we use to remove pencil marks?", promptAr:"🧼 ماذا نستخدم لإزالة آثار القلم الرصاص؟",
          options:["an eraser","a pen","a book"], correct:"an eraser" },
        { promptEn:"🎒 What do we carry our books in?", promptAr:"🎒 بماذا نحمل كتبنا؟",
          options:["a bag","a chair","a table"], correct:"a bag" },
        { promptEn:"📏 What do we use to measure or draw a straight line?", promptAr:"📏 ماذا نستخدم للقياس أو رسم خط مستقيم؟",
          options:["a ruler","a pencil","a book"], correct:"a ruler" }
      ]
    }
  ]
};

const ALL_GAMES = [GAME_FRIENDS, GAME_BODY, GAME_FAMILY, GAME_AGE, GAME_OBJECTS];
