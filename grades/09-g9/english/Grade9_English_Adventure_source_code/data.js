/* ===========================================================
   Maha Academy — Content Data (Grade 9 English)
   Based on McGraw-Hill "Super Goal 3" units:
     Unit 2  Life Stories               -> Life Stories
     Unit 4  What Do I Need to Buy?     -> What Do I Need to Buy?
     Unit 5  Since When?                -> Since When?
     Unit 9  All Kinds of People        -> All Kinds of People
     Unit 10 Who Used My Toothpaste?    -> Who Used My Toothpaste?
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

/* ---------- GAME 1 : ALL KINDS OF PEOPLE (Unit 9) ---------- */

const PERSONALITY_VOCAB = [
  { id:"kind", en:"kind", ar:"لطيف", emoji:"😊" },
  { id:"friendly", en:"friendly", ar:"ودود", emoji:"🤗" },
  { id:"shy", en:"shy", ar:"خجول", emoji:"😳" },
  { id:"honest", en:"honest", ar:"صادق", emoji:"🤝" },
  { id:"brave", en:"brave", ar:"شجاع", emoji:"🦁" },
  { id:"funny", en:"funny", ar:"مضحك", emoji:"😂" },
  { id:"lazy", en:"lazy", ar:"كسول", emoji:"😴" },
  { id:"hardworking", en:"hardworking", ar:"مجتهد", emoji:"💪" }
];

const GAME_PEOPLE = {
  id: "people",
  emoji: "🎭",
  titleEn: "All Kinds of People",
  titleAr: "كل أنواع الناس",
  character: "maya",
  introEn: "Learn to describe people's personalities!",
  introAr: "تعلّم كيف تصف شخصيات الناس!",
  activities: [
    {
      id:"vocab", type:"vocab", character:"maya",
      tagEn:"Personality Words", tagAr:"كلمات الشخصية",
      instructionsEn:"Tap a word to hear it and see its meaning.",
      instructionsAr:"اضغط على الكلمة لسماعها ومعرفة معناها.",
      words: PERSONALITY_VOCAB
    },
    {
      id:"teach", type:"teach", character:"maya",
      tagEn:"Personality Opposites", tagAr:"أضداد الشخصية",
      instructionsEn:"Many personality words have an opposite.",
      instructionsAr:"للعديد من كلمات الشخصية ضد.",
      teachBlocks:[
        { pillEn:"Brave ↔ Shy",
          descEn:"Brave means not afraid; shy means quiet around others.", descAr:"شجاع تعني غير خائف؛ خجول تعني هادئ أمام الآخرين.",
          examples:[ { emoji:"🦁😳", textEn:"He is brave, but his brother is shy." } ] },
        { pillEn:"Hardworking ↔ Lazy", accent:true,
          descEn:"Hardworking means working a lot; lazy means avoiding work.", descAr:"مجتهد تعني يعمل كثيرًا؛ كسول تعني يتجنب العمل.",
          examples:[ { emoji:"💪😴", textEn:"She is hardworking, not lazy." } ] }
      ]
    },
    {
      id:"match", type:"match", character:"marya",
      tagEn:"Match the Personality", tagAr:"طابق الشخصية",
      instructionsEn:"Match the English word to the correct picture.",
      instructionsAr:"طابق الكلمة الإنجليزية مع الصورة الصحيحة.",
      rounds:[
        { pairs:["kind","friendly","shy","honest"].map(id=>{
            const w = PERSONALITY_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) },
        { pairs:["brave","funny","lazy","hardworking"].map(id=>{
            const w = PERSONALITY_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) }
      ]
    },
    {
      id:"whoisit", type:"mcq", character:"mahir",
      tagEn:"Who Is It?", tagAr:"من هو؟",
      instructionsEn:"Choose the correct personality word.",
      instructionsAr:"اختر كلمة الشخصية الصحيحة.",
      rounds:[
        { promptEn:"She always helps her friends and tells the truth. She is ___.", promptAr:"هي دائمًا تساعد أصدقاءها وتقول الحقيقة. هي ___.",
          options:["honest","lazy","shy"], correct:"honest" },
        { promptEn:"He jumped into the water to save the cat. He is ___.", promptAr:"قفز في الماء لينقذ القطة. هو ___.",
          options:["brave","shy","lazy"], correct:"brave" },
        { promptEn:"She talks to everyone and smiles a lot. She is ___.", promptAr:"تتحدث مع الجميع وتبتسم كثيرًا. هي ___.",
          options:["friendly","shy","lazy"], correct:"friendly" },
        { promptEn:"He never wants to do his homework. He is ___.", promptAr:"لا يريد أبدًا أن يقوم بواجبه. هو ___.",
          options:["lazy","hardworking","brave"], correct:"lazy" },
        { promptEn:"She studies every day and finishes all her work. She is ___.", promptAr:"تدرس كل يوم وتنهي كل أعمالها. هي ___.",
          options:["hardworking","lazy","shy"], correct:"hardworking" },
        { promptEn:"He tells great jokes and makes everyone laugh. He is ___.", promptAr:"يروي نكاتًا رائعة ويجعل الجميع يضحك. هو ___.",
          options:["funny","shy","honest"], correct:"funny" }
      ]
    },
    {
      id:"challenge", type:"mcq", character:"malik",
      tagEn:"People Challenge", tagAr:"تحدي الناس",
      instructionsEn:"Choose the correct answer.",
      instructionsAr:"اختر الإجابة الصحيحة.",
      rounds:[
        { emoji:"😳", promptEn:"What do we call this personality?", promptAr:"ماذا نسمي هذه الشخصية؟",
          options:["shy","brave","funny"], correct:"shy" },
        { promptEn:"He never lies. He is very ___.", promptAr:"لا يكذب أبدًا. هو ___ جدًا.",
          options:["honest","lazy","shy"], correct:"honest" },
        { emoji:"💪", promptEn:"What do we call this personality?", promptAr:"ماذا نسمي هذه الشخصية؟",
          options:["hardworking","lazy","shy"], correct:"hardworking" },
        { promptEn:"She smiles and talks to new students. She is ___.", promptAr:"تبتسم وتتحدث مع الطلاب الجدد. هي ___.",
          options:["friendly","shy","lazy"], correct:"friendly" },
        { emoji:"🦁", promptEn:"What do we call this personality?", promptAr:"ماذا نسمي هذه الشخصية؟",
          options:["brave","shy","funny"], correct:"brave" },
        { promptEn:"He gave his lunch to a hungry friend. He is ___.", promptAr:"أعطى غداءه لصديق جائع. هو ___.",
          options:["kind","lazy","shy"], correct:"kind" }
      ]
    }
  ]
};

/* ---------- GAME 2 : SINCE WHEN? (Unit 5) ---------- */

const GAME_SINCE = {
  id: "since",
  emoji: "⏳",
  titleEn: "Since When?",
  titleAr: "منذ متى؟",
  character: "marya",
  introEn: "Learn to talk about how long something has been true!",
  introAr: "تعلّم كيف تتحدث عن المدة التي مضت على شيء ما!",
  activities: [
    {
      id:"teach", type:"teach", character:"maya",
      tagEn:"Since or For?", tagAr:"since أم for؟",
      instructionsEn:"How do we talk about duration?",
      instructionsAr:"كيف نتحدث عن المدة؟",
      teachBlocks:[
        { pillEn:"Since",
          descEn:"Use since + a starting POINT in time.", descAr:"استخدم since + نقطة بداية في الزمن.",
          examples:[ { emoji:"📅", textEn:"since 2020, since Monday, since I was young" } ] },
        { pillEn:"For", accent:true,
          descEn:"Use for + a LENGTH of time.", descAr:"استخدم for + مدة زمنية.",
          examples:[ { emoji:"⏱️", textEn:"for five years, for two hours, for a long time" } ] }
      ]
    },
    {
      id:"sinceorfor", type:"mcq", character:"mahir",
      tagEn:"Since or For?", tagAr:"since أم for؟",
      instructionsEn:"Choose the correct word.",
      instructionsAr:"اختر الكلمة الصحيحة.",
      rounds:[
        { promptEn:"I have lived here ___ 2020.", promptAr:"أعيش هنا منذ 2020.",
          options:["since","for"], correct:"since" },
        { promptEn:"She has studied English ___ three years.", promptAr:"تدرس الإنجليزية منذ ثلاث سنوات.",
          options:["for","since"], correct:"for" },
        { promptEn:"He has worked here ___ Sunday.", promptAr:"يعمل هنا منذ يوم الأحد.",
          options:["since","for"], correct:"since" },
        { promptEn:"We have known each other ___ ten years.", promptAr:"نعرف بعضنا منذ عشر سنوات.",
          options:["for","since"], correct:"for" },
        { promptEn:"They have lived in Riyadh ___ they got married.", promptAr:"يعيشون في الرياض منذ أن تزوجوا.",
          options:["since","for"], correct:"since" },
        { promptEn:"I have had this phone ___ two months.", promptAr:"أملك هذا الهاتف منذ شهرين.",
          options:["for","since"], correct:"for" }
      ]
    },
    {
      id:"howlong", type:"mcq", character:"marya",
      tagEn:"How Long Have You...?", tagAr:"منذ متى وأنت...؟",
      instructionsEn:"Choose the correct answer.",
      instructionsAr:"اختر الإجابة الصحيحة.",
      rounds:[
        { promptEn:"How long have you lived here? — I have lived here ___ five years.", promptAr:"منذ متى وأنت تعيش هنا؟ — أعيش هنا منذ خمس سنوات.",
          options:["for","since"], correct:"for" },
        { promptEn:"How long has she known him? — She has known him ___ they were kids.", promptAr:"منذ متى وهي تعرفه؟ — تعرفه منذ كانا طفلين.",
          options:["since","for"], correct:"since" },
        { promptEn:"How long have they studied here? — They have studied here ___ September.", promptAr:"منذ متى وهم يدرسون هنا؟ — يدرسون هنا منذ سبتمبر.",
          options:["since","for"], correct:"since" },
        { promptEn:"How long has he had this car? — He has had it ___ two years.", promptAr:"منذ متى ولديه هذه السيارة؟ — لديه إياها منذ سنتين.",
          options:["for","since"], correct:"for" },
        { promptEn:"How long have you been a teacher? — I have been a teacher ___ 2018.", promptAr:"منذ متى وأنت معلم؟ — أنا معلم منذ 2018.",
          options:["since","for"], correct:"since" },
        { promptEn:"How long has the shop been closed? — It has been closed ___ a week.", promptAr:"منذ متى والمحل مغلق؟ — مغلق منذ أسبوع.",
          options:["for","since"], correct:"for" }
      ]
    },
    {
      id:"buildsentence", type:"order", character:"malik", orderMode:"words",
      tagEn:"Build the Sentence", tagAr:"كوّن الجملة",
      instructionsEn:"Drag the words into the correct order.",
      instructionsAr:"اسحب الكلمات بالترتيب الصحيح.",
      rounds:[
        { items:["I","have","lived","here","since","2020"].map((w,i)=>({id:"ss1_"+i, labelEn:w})) },
        { items:["She","has","studied","English","for","three","years"].map((w,i)=>({id:"ss2_"+i, labelEn:w})) },
        { items:["We","have","known","each","other","for","years"].map((w,i)=>({id:"ss3_"+i, labelEn:w})) },
        { items:["He","has","worked","here","since","Monday"].map((w,i)=>({id:"ss4_"+i, labelEn:w})) }
      ]
    },
    {
      id:"challenge", type:"mcq", character:"mahir",
      tagEn:"Duration Challenge", tagAr:"تحدي المدة",
      instructionsEn:"Choose the correct answer.",
      instructionsAr:"اختر الإجابة الصحيحة.",
      rounds:[
        { promptEn:"My family has lived in this house ___ ten years.", promptAr:"عائلتي تعيش في هذا البيت منذ عشر سنوات.",
          options:["for","since"], correct:"for" },
        { promptEn:"I have known Sara ___ we were in Grade 1.", promptAr:"أعرف سارة منذ كنا في الصف الأول.",
          options:["since","for"], correct:"since" },
        { promptEn:"He has had his bike ___ his birthday.", promptAr:"لديه دراجته منذ عيد ميلاده.",
          options:["since","for"], correct:"since" },
        { promptEn:"They have been friends ___ a long time.", promptAr:"هما صديقان منذ وقت طويل.",
          options:["for","since"], correct:"for" },
        { promptEn:"She has been sick ___ Thursday.", promptAr:"هي مريضة منذ يوم الخميس.",
          options:["since","for"], correct:"since" },
        { promptEn:"We have waited ___ twenty minutes.", promptAr:"ننتظر منذ عشرين دقيقة.",
          options:["for","since"], correct:"for" }
      ]
    }
  ]
};

/* ---------- GAME 3 : WHO USED MY TOOTHPASTE? (Unit 10) ---------- */

const POSSESSIVE_PRONOUN_VOCAB = [
  { id:"mine", en:"mine", ar:"ملكي", emoji:"🙋‍♂️" },
  { id:"yours", en:"yours", ar:"ملكك", emoji:"🫵" },
  { id:"his", en:"his", ar:"ملكه", emoji:"👦" },
  { id:"hers", en:"hers", ar:"ملكها", emoji:"👧" },
  { id:"ours", en:"ours", ar:"ملكنا", emoji:"👨‍👩‍👧" },
  { id:"theirs", en:"theirs", ar:"ملكهم", emoji:"👥" }
];

const GAME_TOOTHPASTE = {
  id: "toothpaste",
  emoji: "🪥",
  titleEn: "Who Used My Toothpaste?",
  titleAr: "من استخدم معجون أسناني؟",
  character: "malik",
  introEn: "Solve the mystery and learn possessive pronouns!",
  introAr: "حلّ اللغز وتعلّم ضمائر الملكية!",
  activities: [
    {
      id:"teach", type:"teach", character:"maya",
      tagEn:"Possessive Pronouns", tagAr:"ضمائر الملكية",
      instructionsEn:"How do we say something belongs to someone, without repeating the noun?",
      instructionsAr:"كيف نقول إن شيئًا ملك لشخص، دون تكرار الاسم؟",
      teachBlocks:[
        { pillEn:"my book → mine",
          descEn:"A possessive pronoun replaces \"my/your/his + noun\".", descAr:"يحل ضمير الملكية محل \"my/your/his + الاسم\".",
          examples:[ { emoji:"📕", textEn:"This is my book. → This book is mine." } ] },
        { pillEn:"her bag → hers", accent:true,
          descEn:"Use it so you don't repeat the noun.", descAr:"استخدمه حتى لا تكرر الاسم.",
          examples:[ { emoji:"👜", textEn:"Is this her bag? → Is this bag hers?" } ] }
      ]
    },
    {
      id:"vocab", type:"vocab", character:"malik",
      tagEn:"Possessive Pronoun Words", tagAr:"كلمات ضمائر الملكية",
      instructionsEn:"Tap a word to hear it and see its meaning.",
      instructionsAr:"اضغط على الكلمة لسماعها ومعرفة معناها.",
      words: POSSESSIVE_PRONOUN_VOCAB
    },
    {
      id:"whoseisit", type:"mcq", character:"mahir",
      tagEn:"Whose Is It?", tagAr:"لمن هذا؟",
      instructionsEn:"Choose the correct possessive pronoun.",
      instructionsAr:"اختر ضمير الملكية الصحيح.",
      rounds:[
        { promptEn:"This is Mahir's bag. This bag is ___.", promptAr:"هذه حقيبة ماهر. هذه الحقيبة ملكه.",
          options:["his","hers","mine"], correct:"his" },
        { promptEn:"This is Maya's pencil. This pencil is ___.", promptAr:"هذا قلم مايا. هذا القلم ملكها.",
          options:["hers","his","yours"], correct:"hers" },
        { promptEn:"This is my toothpaste. This toothpaste is ___.", promptAr:"هذا معجون أسناني. هذا المعجون ملكي.",
          options:["mine","yours","ours"], correct:"mine" },
        { promptEn:"This is your book. This book is ___.", promptAr:"هذا كتابك. هذا الكتاب ملكك.",
          options:["yours","mine","theirs"], correct:"yours" },
        { promptEn:"This is our house. This house is ___.", promptAr:"هذا بيتنا. هذا البيت ملكنا.",
          options:["ours","theirs","mine"], correct:"ours" },
        { promptEn:"This is the boys' ball. This ball is ___.", promptAr:"هذه كرة الأولاد. هذه الكرة ملكهم.",
          options:["theirs","ours","his"], correct:"theirs" }
      ]
    },
    {
      id:"mystery", type:"mcq", character:"marya",
      tagEn:"Mystery Challenge", tagAr:"تحدي اللغز",
      instructionsEn:"Choose the correct answer.",
      instructionsAr:"اختر الإجابة الصحيحة.",
      rounds:[
        { promptEn:"Malik: \"Is this toothpaste yours?\" Marya: \"No, it's not ___. It's Maya's.\"", promptAr:"مالك: \"هل هذا معجون أسنانك؟\" ماريا: \"لا، ليس ___. إنه لمايا.\"",
          options:["mine","hers","yours"], correct:"mine" },
        { promptEn:"\"Whose toothpaste is this?\" \"It's ___ — I bought it yesterday.\"", promptAr:"\"لمن هذا المعجون؟\" \"إنه ___ — اشتريته أمس.\"",
          options:["mine","yours","his"], correct:"mine" },
        { promptEn:"\"Is this Mahir's toothbrush?\" \"Yes, it's ___.\"", promptAr:"\"هل هذه فرشاة أسنان ماهر؟\" \"نعم، إنها ___.\"",
          options:["his","hers","ours"], correct:"his" },
        { promptEn:"\"These towels are ___ — we bought them together.\"", promptAr:"\"هذه المناشف ___ — اشتريناها معًا.\"",
          options:["ours","mine","theirs"], correct:"ours" },
        { promptEn:"\"Whose shoes are these?\" \"They're ___ — I left them by the door.\"", promptAr:"\"لمن هذا الحذاء؟\" \"إنه ___ — تركته عند الباب.\"",
          options:["mine","yours","theirs"], correct:"mine" },
        { promptEn:"\"Are these Maya and Marya's cups?\" \"Yes, they're ___.\"", promptAr:"\"هل هذان كوبا مايا وماريا؟\" \"نعم، إنهما ___.\"",
          options:["theirs","ours","hers"], correct:"theirs" }
      ]
    },
    {
      id:"buildsentence", type:"order", character:"malik", orderMode:"words",
      tagEn:"Build the Sentence", tagAr:"كوّن الجملة",
      instructionsEn:"Drag the words into the correct order.",
      instructionsAr:"اسحب الكلمات بالترتيب الصحيح.",
      rounds:[
        { items:["This","toothpaste","is","mine"].map((w,i)=>({id:"ts1_"+i, labelEn:w})) },
        { items:["Is","this","bag","yours"].map((w,i)=>({id:"ts2_"+i, labelEn:w})) },
        { items:["That","book","is","hers"].map((w,i)=>({id:"ts3_"+i, labelEn:w})) },
        { items:["These","shoes","are","his"].map((w,i)=>({id:"ts4_"+i, labelEn:w})) }
      ]
    }
  ]
};

/* ---------- GAME 4 : LIFE STORIES (Unit 2) ---------- */

const LIFE_VOCAB = [
  { id:"wasborn", en:"was born", ar:"وُلِد", emoji:"👶" },
  { id:"grewup", en:"grew up", ar:"نشأ", emoji:"🌱" },
  { id:"moved", en:"moved", ar:"انتقل", emoji:"📦" },
  { id:"graduated", en:"graduated", ar:"تخرّج", emoji:"🎓" },
  { id:"gotajob", en:"got a job", ar:"حصل على وظيفة", emoji:"💼" },
  { id:"gotmarried", en:"got married", ar:"تزوّج", emoji:"💍" },
  { id:"traveled", en:"traveled", ar:"سافر", emoji:"✈️" },
  { id:"retired", en:"retired", ar:"تقاعد", emoji:"🏡" }
];

const GAME_LIFESTORIES = {
  id: "lifestories",
  emoji: "📖",
  titleEn: "Life Stories",
  titleAr: "قصص حياة",
  character: "mahir",
  introEn: "Learn to tell the story of someone's life!",
  introAr: "تعلّم كيف تروي قصة حياة شخص ما!",
  activities: [
    {
      id:"vocab", type:"vocab", character:"mahir",
      tagEn:"Life Story Words", tagAr:"كلمات قصة الحياة",
      instructionsEn:"Tap a word to hear it and see its meaning.",
      instructionsAr:"اضغط على الكلمة لسماعها ومعرفة معناها.",
      words: LIFE_VOCAB
    },
    {
      id:"match", type:"match", character:"maya",
      tagEn:"Match the Life Event", tagAr:"طابق حدث الحياة",
      instructionsEn:"Match the English word to the correct picture.",
      instructionsAr:"طابق الكلمة الإنجليزية مع الصورة الصحيحة.",
      rounds:[
        { pairs:["wasborn","grewup","moved","graduated"].map(id=>{
            const w = LIFE_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) },
        { pairs:["gotajob","gotmarried","traveled","retired"].map(id=>{
            const w = LIFE_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) }
      ]
    },
    {
      id:"complete", type:"mcq", character:"marya",
      tagEn:"Complete the Life Story", tagAr:"أكمل قصة الحياة",
      instructionsEn:"Choose the correct word.",
      instructionsAr:"اختر الكلمة الصحيحة.",
      rounds:[
        { promptEn:"She ___ in Jeddah in 2005.", promptAr:"وُلِدت في جدة عام 2005.",
          options:["was born","graduated","retired"], correct:"was born" },
        { promptEn:"He ___ in a small village.", promptAr:"نشأ في قرية صغيرة.",
          options:["grew up","got married","traveled"], correct:"grew up" },
        { promptEn:"They ___ to Riyadh when he was ten.", promptAr:"انتقلوا إلى الرياض عندما كان عمره عشر سنوات.",
          options:["moved","retired","graduated"], correct:"moved" },
        { promptEn:"She ___ from university last year.", promptAr:"تخرّجت من الجامعة العام الماضي.",
          options:["graduated","was born","moved"], correct:"graduated" },
        { promptEn:"He ___ at a hospital after finishing his studies.", promptAr:"حصل على وظيفة في مستشفى بعد إنهاء دراسته.",
          options:["got a job","got married","retired"], correct:"got a job" },
        { promptEn:"My grandfather ___ after working for 40 years.", promptAr:"تقاعد جدي بعد العمل لمدة 40 عامًا.",
          options:["retired","traveled","grew up"], correct:"retired" }
      ]
    },
    {
      id:"order", type:"order", character:"malik", speakOnPlace:true,
      tagEn:"Put the Life Story in Order", tagAr:"رتّب قصة الحياة",
      instructionsEn:"Put these life events in the correct order.",
      instructionsAr:"رتّب أحداث الحياة هذه بالترتيب الصحيح.",
      rounds:[
        { items:["wasborn","grewup","graduated","gotajob"].map((id,i)=>{
            const w = LIFE_VOCAB.find(v=>v.id===id); return {id:"lo1_"+i, labelEn:w.en, labelAr:w.ar, emoji:w.emoji};
          }) },
        { items:["gotmarried","traveled","gotajob","retired"].map((id,i)=>{
            const w = LIFE_VOCAB.find(v=>v.id===id); return {id:"lo2_"+i, labelEn:w.en, labelAr:w.ar, emoji:w.emoji};
          }) }
      ]
    },
    {
      id:"challenge", type:"mcq", character:"mahir",
      tagEn:"Life Stories Challenge", tagAr:"تحدي قصص الحياة",
      instructionsEn:"Choose the correct answer.",
      instructionsAr:"اختر الإجابة الصحيحة.",
      rounds:[
        { emoji:"🎓", promptEn:"What happened here?", promptAr:"ماذا حدث هنا؟",
          options:["graduated","was born","retired"], correct:"graduated" },
        { promptEn:"My parents ___ in 1995.", promptAr:"تزوّج والداي عام 1995.",
          options:["got married","graduated","moved"], correct:"got married" },
        { emoji:"✈️", promptEn:"What happened here?", promptAr:"ماذا حدث هنا؟",
          options:["traveled","retired","grew up"], correct:"traveled" },
        { promptEn:"She ___ up in a big city.", promptAr:"نشأت في مدينة كبيرة.",
          options:["grew","was born","graduated"], correct:"grew" },
        { emoji:"💼", promptEn:"What happened here?", promptAr:"ماذا حدث هنا؟",
          options:["got a job","retired","moved"], correct:"got a job" },
        { promptEn:"My grandmother ___ in 1950.", promptAr:"وُلِدت جدتي عام 1950.",
          options:["was born","retired","graduated"], correct:"was born" }
      ]
    }
  ]
};

/* ---------- GAME 5 : WHAT DO I NEED TO BUY? (Unit 4) ---------- */

const SHOPPING_VOCAB = [
  { id:"bread", en:"bread", ar:"خبز", emoji:"🍞" },
  { id:"milk", en:"milk", ar:"حليب", emoji:"🥛" },
  { id:"eggs", en:"eggs", ar:"بيض", emoji:"🥚" },
  { id:"rice", en:"rice", ar:"أرز", emoji:"🍚" },
  { id:"soap", en:"soap", ar:"صابون", emoji:"🧼" },
  { id:"toothpaste", en:"toothpaste", ar:"معجون أسنان", emoji:"🪥" },
  { id:"notebook", en:"notebook", ar:"دفتر", emoji:"📓" },
  { id:"batteries", en:"batteries", ar:"بطاريات", emoji:"🔋" }
];

const GAME_SHOPPING = {
  id: "shopping",
  emoji: "🛍️",
  titleEn: "What Do I Need to Buy?",
  titleAr: "ماذا أحتاج أن أشتري؟",
  character: "marya",
  introEn: "Learn shopping words and how to say what you need!",
  introAr: "تعلّم كلمات التسوق وكيف تقول ما تحتاجه!",
  activities: [
    {
      id:"vocab", type:"vocab", character:"marya",
      tagEn:"Shopping Words", tagAr:"كلمات التسوق",
      instructionsEn:"Tap a word to hear it and see its meaning.",
      instructionsAr:"اضغط على الكلمة لسماعها ومعرفة معناها.",
      words: SHOPPING_VOCAB
    },
    {
      id:"teach", type:"teach", character:"maya",
      tagEn:"Need to / Needs to", tagAr:"need to / needs to",
      instructionsEn:"How do we say what someone needs to do?",
      instructionsAr:"كيف نقول ما يحتاج شخص ما أن يفعله؟",
      teachBlocks:[
        { pillEn:"I/You/We/They + need to",
          descEn:"Use need to with I, you, we, they.", descAr:"استخدم need to مع I وyou وwe وthey.",
          examples:[ { emoji:"🍞", textEn:"I need to buy bread." } ] },
        { pillEn:"He/She/It + needs to", accent:true,
          descEn:"Add -s: needs to, with he, she, it.", descAr:"أضف -s: needs to، مع he وshe وit.",
          examples:[ { emoji:"🥛", textEn:"She needs to buy milk." } ] }
      ]
    },
    {
      id:"needorneeds", type:"mcq", character:"mahir",
      tagEn:"Need or Needs?", tagAr:"need أم needs؟",
      instructionsEn:"Choose the correct word.",
      instructionsAr:"اختر الكلمة الصحيحة.",
      rounds:[
        { promptEn:"I ___ to buy bread.", promptAr:"أحتاج أن أشتري خبزًا.",
          options:["need","needs"], correct:"need" },
        { promptEn:"She ___ to buy milk.", promptAr:"تحتاج أن تشتري حليبًا.",
          options:["needs","need"], correct:"needs" },
        { promptEn:"We ___ to buy eggs.", promptAr:"نحتاج أن نشتري بيضًا.",
          options:["need","needs"], correct:"need" },
        { promptEn:"He ___ to buy soap.", promptAr:"يحتاج أن يشتري صابونًا.",
          options:["needs","need"], correct:"needs" },
        { promptEn:"They ___ to buy rice.", promptAr:"يحتاجون أن يشتروا أرزًا.",
          options:["need","needs"], correct:"need" },
        { promptEn:"My mother ___ to buy toothpaste.", promptAr:"أمي تحتاج أن تشتري معجون أسنان.",
          options:["needs","need"], correct:"needs" }
      ]
    },
    {
      id:"whattobuy", type:"mcq", character:"malik",
      tagEn:"What Do They Need to Buy?", tagAr:"ماذا يحتاجون أن يشتروا؟",
      instructionsEn:"Choose the correct item.",
      instructionsAr:"اختر الشيء الصحيح.",
      rounds:[
        { promptEn:"My hands are dirty. I need to buy ___.", promptAr:"يداي متسختان. أحتاج أن أشتري ___.",
          options:["soap","rice","batteries"], correct:"soap" },
        { promptEn:"My toy stopped working. I need to buy ___.", promptAr:"توقفت لعبتي عن العمل. أحتاج أن أشتري ___.",
          options:["batteries","bread","eggs"], correct:"batteries" },
        { promptEn:"I want to make a cake. I need to buy ___.", promptAr:"أريد أن أصنع كعكة. أحتاج أن أشتري ___.",
          options:["eggs","soap","notebook"], correct:"eggs" },
        { promptEn:"My teeth need cleaning. I need to buy ___.", promptAr:"أسناني تحتاج تنظيفًا. أحتاج أن أشتري ___.",
          options:["toothpaste","milk","rice"], correct:"toothpaste" },
        { promptEn:"I want to write my homework. I need to buy ___.", promptAr:"أريد أن أكتب واجبي. أحتاج أن أشتري ___.",
          options:["a notebook","bread","soap"], correct:"a notebook" },
        { promptEn:"I want to make a sandwich. I need to buy ___.", promptAr:"أريد أن أصنع شطيرة. أحتاج أن أشتري ___.",
          options:["bread","batteries","a notebook"], correct:"bread" }
      ]
    },
    {
      id:"match", type:"match", character:"marya",
      tagEn:"Match the Shopping Item", tagAr:"طابق سلعة التسوق",
      instructionsEn:"Match the English word to the correct picture.",
      instructionsAr:"طابق الكلمة الإنجليزية مع الصورة الصحيحة.",
      rounds:[
        { pairs:["bread","milk","eggs","rice"].map(id=>{
            const w = SHOPPING_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) },
        { pairs:["soap","toothpaste","notebook","batteries"].map(id=>{
            const w = SHOPPING_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) }
      ]
    }
  ]
};

const ALL_GAMES = [GAME_PEOPLE, GAME_SINCE, GAME_TOOTHPASTE, GAME_LIFESTORIES, GAME_SHOPPING];
