/* ===========================================================
   Maha Academy — Content Data (Grade 7 English)
   Based on McGraw-Hill "Super Goal 1" units:
     Unit 5  Families, Families        -> Family Tree Village
     Unit 6  Is There a View?          -> House & Home Street
     Unit 9  What Do You Do?           -> Job Junction
     Unit 11 What Time Do You Get Up?  -> Daily Routine Depot
     Unit 12 What Can You Do There?    -> Ability Island
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

/* ---------- GAME 1 : FAMILY TREE VILLAGE (Unit 5) ---------- */

const FAMILY_VOCAB = [
  { id:"father", en:"father", ar:"أب", emoji:"👨" },
  { id:"mother", en:"mother", ar:"أم", emoji:"👩" },
  { id:"brother", en:"brother", ar:"أخ", emoji:"👦" },
  { id:"sister", en:"sister", ar:"أخت", emoji:"👧" },
  { id:"grandfather", en:"grandfather", ar:"جد", emoji:"👴" },
  { id:"grandmother", en:"grandmother", ar:"جدة", emoji:"👵" },
  { id:"uncle", en:"uncle", ar:"عم", emoji:"🧔" },
  { id:"aunt", en:"aunt", ar:"عمة", emoji:"👩‍🦰" }
];

const GAME_FAMILY = {
  id: "family",
  emoji: "👪",
  titleEn: "Family Tree Village",
  titleAr: "قرية شجرة العائلة",
  character: "malik",
  introEn: "Meet the family and learn how to talk about them!",
  introAr: "تعرّف على العائلة وتعلّم كيف تتحدث عنها!",
  activities: [
    {
      id:"vocab", type:"vocab", character:"malik",
      tagEn:"Family Words", tagAr:"كلمات العائلة",
      instructionsEn:"Tap a word to hear it and see its meaning.",
      instructionsAr:"اضغط على الكلمة لسماعها ومعرفة معناها.",
      words: FAMILY_VOCAB
    },
    {
      id:"match", type:"match", character:"marya",
      tagEn:"Match the Family Member", tagAr:"طابق أفراد العائلة",
      instructionsEn:"Match the English word to the correct picture.",
      instructionsAr:"طابق الكلمة الإنجليزية مع الصورة الصحيحة.",
      rounds:[
        { pairs:["father","mother","brother","sister"].map(id=>{
            const w = FAMILY_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) },
        { pairs:["grandfather","grandmother","uncle","aunt"].map(id=>{
            const w = FAMILY_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) }
      ]
    },
    {
      id:"possessive", type:"mcq", character:"maya",
      tagEn:"Whose Is It?", tagAr:"لمن هذا؟",
      instructionsEn:"Choose the correct possessive word.",
      instructionsAr:"اختر كلمة الملكية الصحيحة.",
      rounds:[
        { promptEn:"This is Ali's book. It is ___ book.", promptAr:"هذا كتاب علي. إنه كتابه.",
          options:["his","her","my"], correct:"his" },
        { promptEn:"This is Sara's bag. It is ___ bag.", promptAr:"هذه حقيبة سارة. إنها حقيبتها.",
          options:["her","his","our"], correct:"her" },
        { promptEn:"This is my pencil. It is ___ pencil.", promptAr:"هذا قلمي. إنه قلمي.",
          options:["my","his","their"], correct:"my" },
        { promptEn:"These are the boys' shoes. They are ___ shoes.", promptAr:"هذه أحذية الأولاد. إنها أحذيتهم.",
          options:["their","her","your"], correct:"their" },
        { promptEn:"This is our house. It is ___ house.", promptAr:"هذا بيتنا. إنه بيتنا.",
          options:["our","my","his"], correct:"our" },
        { promptEn:"This is your pen. It is ___ pen.", promptAr:"هذا قلمك. إنه قلمك.",
          options:["your","her","their"], correct:"your" }
      ]
    },
    {
      id:"relationships", type:"mcq", character:"mahir",
      tagEn:"Family Relationships", tagAr:"صلة القرابة",
      instructionsEn:"Who is it?",
      instructionsAr:"من هو؟",
      rounds:[
        { promptEn:"My father's father is my ___.", promptAr:"أبو أبي هو ___.",
          options:["grandfather","uncle","brother"], correct:"grandfather" },
        { promptEn:"My mother's mother is my ___.", promptAr:"أم أمي هي ___.",
          options:["grandmother","aunt","sister"], correct:"grandmother" },
        { promptEn:"My father's brother is my ___.", promptAr:"أخو أبي هو ___.",
          options:["uncle","grandfather","father"], correct:"uncle" },
        { promptEn:"My mother's sister is my ___.", promptAr:"أخت أمي هي ___.",
          options:["aunt","grandmother","mother"], correct:"aunt" },
        { promptEn:"My mother's brother is my ___.", promptAr:"أخو أمي هو ___.",
          options:["uncle","aunt","brother"], correct:"uncle" },
        { promptEn:"My father's sister is my ___.", promptAr:"أخت أبي هي ___.",
          options:["aunt","uncle","sister"], correct:"aunt" }
      ]
    },
    {
      id:"challenge", type:"mcq", character:"malik",
      tagEn:"Family Challenge", tagAr:"تحدي العائلة",
      instructionsEn:"Choose the correct answer.",
      instructionsAr:"اختر الإجابة الصحيحة.",
      rounds:[
        { emoji:"👴", promptEn:"What do we call this person?", promptAr:"ماذا نسمي هذا الشخص؟",
          options:["grandfather","father","uncle"], correct:"grandfather" },
        { promptEn:"This is Noura's book. It is ___ book.", promptAr:"هذا كتاب نورة. إنه كتابها.",
          options:["her","his","my"], correct:"her" },
        { emoji:"👧", promptEn:"What do we call this person?", promptAr:"ماذا نسمي هذا الشخص؟",
          options:["sister","brother","mother"], correct:"sister" },
        { promptEn:"My father's mother is my ___.", promptAr:"أم أبي هي ___.",
          options:["grandmother","aunt","sister"], correct:"grandmother" },
        { promptEn:"This is our classroom. It is ___ classroom.", promptAr:"هذا صفنا. إنه صفنا.",
          options:["our","my","their"], correct:"our" },
        { emoji:"🧔", promptEn:"What do we call this person?", promptAr:"ماذا نسمي هذا الشخص؟",
          options:["uncle","grandfather","brother"], correct:"uncle" }
      ]
    }
  ]
};

/* ---------- GAME 2 : HOUSE & HOME STREET (Unit 6) ---------- */

const ROOM_VOCAB = [
  { id:"kitchen", en:"kitchen", ar:"مطبخ", emoji:"🍳" },
  { id:"bedroom", en:"bedroom", ar:"غرفة نوم", emoji:"🛏️" },
  { id:"bathroom", en:"bathroom", ar:"حمام", emoji:"🛁" },
  { id:"livingroom", en:"living room", ar:"غرفة معيشة", emoji:"🛋️" },
  { id:"diningroom", en:"dining room", ar:"غرفة طعام", emoji:"🍽️" },
  { id:"garden", en:"garden", ar:"حديقة", emoji:"🌳" },
  { id:"garage", en:"garage", ar:"كراج", emoji:"🚗" },
  { id:"roof", en:"roof", ar:"سطح", emoji:"🏠" }
];

const GAME_HOUSE = {
  id: "house",
  emoji: "🏠",
  titleEn: "House & Home Street",
  titleAr: "شارع البيت",
  character: "maya",
  introEn: "Explore the house and learn 'there is / there are'!",
  introAr: "استكشف البيت وتعلّم استخدام there is و there are!",
  activities: [
    {
      id:"vocab", type:"vocab", character:"maya",
      tagEn:"Room Words", tagAr:"كلمات الغرف",
      instructionsEn:"Tap a word to hear it and see its meaning.",
      instructionsAr:"اضغط على الكلمة لسماعها ومعرفة معناها.",
      words: ROOM_VOCAB
    },
    {
      id:"teach", type:"teach", character:"maya",
      tagEn:"There Is / There Are", tagAr:"There is و There are",
      instructionsEn:"How do we say something exists?",
      instructionsAr:"كيف نقول إن شيئًا ما موجود؟",
      teachBlocks:[
        { pillEn:"There is",
          descEn:"Use for ONE thing (singular).", descAr:"استخدمها لشيء واحد <strong>(مفرد)</strong>.",
          examples:[ { emoji:"🛏️", textEn:"There is a bed in the bedroom." } ] },
        { pillEn:"There are", accent:true,
          descEn:"Use for MORE than one thing (plural).", descAr:"استخدمها لأكثر من شيء واحد <strong>(جمع)</strong>.",
          examples:[ { emoji:"🪑🪑", textEn:"There are two chairs in the kitchen." } ] }
      ]
    },
    {
      id:"isare", type:"mcq", character:"marya",
      tagEn:"Is or Are?", tagAr:"is أم are؟",
      instructionsEn:"Look at the picture, then choose the correct word.",
      instructionsAr:"انظر إلى الصورة، ثم اختر الكلمة الصحيحة.",
      rounds:[
        { visualKind:"count", emoji:"🛏️", count:1, nounEn:"bed", nounAr:"سرير",
          promptEn:"There ___ a bed in the bedroom.", promptAr:"يوجد سرير في غرفة النوم.",
          options:["is","are"], correct:"is" },
        { visualKind:"count", emoji:"🪑", count:3, nounEn:"chairs", nounAr:"كراسي",
          promptEn:"There ___ three chairs in the kitchen.", promptAr:"توجد ثلاثة كراسي في المطبخ.",
          options:["is","are"], correct:"are" },
        { visualKind:"count", emoji:"🚿", count:1, nounEn:"shower", nounAr:"دُش",
          promptEn:"There ___ a shower in the bathroom.", promptAr:"يوجد دُش في الحمام.",
          options:["is","are"], correct:"is" },
        { visualKind:"count", emoji:"🌳", count:2, nounEn:"trees", nounAr:"أشجار",
          promptEn:"There ___ two trees in the garden.", promptAr:"توجد شجرتان في الحديقة.",
          options:["is","are"], correct:"are" },
        { visualKind:"count", emoji:"🚗", count:1, nounEn:"car", nounAr:"سيارة",
          promptEn:"There ___ a car in the garage.", promptAr:"توجد سيارة في الكراج.",
          options:["is","are"], correct:"is" },
        { visualKind:"count", emoji:"🖼️", count:4, nounEn:"pictures", nounAr:"صور",
          promptEn:"There ___ four pictures on the wall.", promptAr:"توجد أربع صور على الجدار.",
          options:["is","are"], correct:"are" }
      ]
    },
    {
      id:"prepositions", type:"mcq", character:"mahir",
      tagEn:"Where Is It?", tagAr:"أين هو؟",
      instructionsEn:"Choose the correct word.",
      instructionsAr:"اختر الكلمة الصحيحة.",
      rounds:[
        { emoji:"💡🪑", promptEn:"The lamp is ___ the table.", promptAr:"المصباح ___ الطاولة.",
          options:["on","in","under"], correct:"on" },
        { emoji:"👟🛏️", promptEn:"The shoes are ___ the bed.", promptAr:"الحذاء ___ السرير.",
          options:["under","on","between"], correct:"under" },
        { emoji:"📖🎒", promptEn:"The book is ___ the bag.", promptAr:"الكتاب ___ الحقيبة.",
          options:["in","on","under"], correct:"in" },
        { emoji:"🪑🪟", promptEn:"The chair is ___ the table and the window.", promptAr:"الكرسي ___ الطاولة والنافذة.",
          options:["between","in","on"], correct:"between" },
        { emoji:"🐱🛋️", promptEn:"The cat is ___ the sofa.", promptAr:"القط ___ الأريكة.",
          options:["under","between","on"], correct:"under" },
        { emoji:"🍽️🪑", promptEn:"The plate is ___ the table.", promptAr:"الطبق ___ الطاولة.",
          options:["on","under","between"], correct:"on" }
      ]
    },
    {
      id:"buildsentence", type:"order", character:"malik", orderMode:"words",
      tagEn:"Build the Sentence", tagAr:"كوّن الجملة",
      instructionsEn:"Drag the words into the correct order.",
      instructionsAr:"اسحب الكلمات بالترتيب الصحيح.",
      rounds:[
        { items:["There","is","a","bed","in","the","room"].map((w,i)=>({id:"bs1_"+i, labelEn:w})) },
        { items:["There","are","two","chairs","here"].map((w,i)=>({id:"bs2_"+i, labelEn:w})) },
        { items:["The","lamp","is","on","the","table"].map((w,i)=>({id:"bs3_"+i, labelEn:w})) },
        { items:["The","cat","is","under","the","chair"].map((w,i)=>({id:"bs4_"+i, labelEn:w})) }
      ]
    }
  ]
};

/* ---------- GAME 3 : JOB JUNCTION (Unit 9) ---------- */

const JOB_VOCAB = [
  { id:"teacher", en:"teacher", ar:"معلم", emoji:"👩‍🏫" },
  { id:"doctor", en:"doctor", ar:"طبيب", emoji:"👨‍⚕️" },
  { id:"engineer", en:"engineer", ar:"مهندس", emoji:"👷" },
  { id:"farmer", en:"farmer", ar:"مزارع", emoji:"👨‍🌾" },
  { id:"pilot", en:"pilot", ar:"طيار", emoji:"👨‍✈️" },
  { id:"nurse", en:"nurse", ar:"ممرضة", emoji:"👩‍⚕️" },
  { id:"police", en:"police officer", ar:"شرطي", emoji:"👮" },
  { id:"chef", en:"chef", ar:"طاهي", emoji:"👨‍🍳" }
];

const GAME_JOBS = {
  id: "jobs",
  emoji: "💼",
  titleEn: "Job Junction",
  titleAr: "مفترق الوظائف",
  character: "mahir",
  introEn: "Discover different jobs and what people do every day!",
  introAr: "اكتشف الوظائف المختلفة وماذا يفعل الناس كل يوم!",
  activities: [
    {
      id:"vocab", type:"vocab", character:"mahir",
      tagEn:"Job Words", tagAr:"كلمات الوظائف",
      instructionsEn:"Tap a word to hear it and see its meaning.",
      instructionsAr:"اضغط على الكلمة لسماعها ومعرفة معناها.",
      words: JOB_VOCAB
    },
    {
      id:"match", type:"match", character:"maya",
      tagEn:"Match the Job", tagAr:"طابق الوظيفة",
      instructionsEn:"Match the English word to the correct picture.",
      instructionsAr:"طابق الكلمة الإنجليزية مع الصورة الصحيحة.",
      rounds:[
        { pairs:["teacher","doctor","engineer","farmer"].map(id=>{
            const w = JOB_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) },
        { pairs:["pilot","nurse","police","chef"].map(id=>{
            const w = JOB_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) }
      ]
    },
    {
      id:"whatdoesdo", type:"mcq", character:"marya",
      tagEn:"What Does He/She Do?", tagAr:"ماذا يفعل؟",
      instructionsEn:"Choose the correct verb.",
      instructionsAr:"اختر الفعل الصحيح.",
      rounds:[
        { emoji:"👩‍🏫", promptEn:"A teacher ___ students.", promptAr:"المعلم ___ الطلاب.",
          options:["teaches","teach","teaching"], correct:"teaches" },
        { emoji:"👨‍⚕️", promptEn:"A doctor ___ sick people.", promptAr:"الطبيب ___ المرضى.",
          options:["treats","treat","treating"], correct:"treats" },
        { emoji:"👨‍🌾", promptEn:"A farmer ___ vegetables.", promptAr:"المزارع ___ الخضروات.",
          options:["grows","grow","growing"], correct:"grows" },
        { emoji:"👨‍✈️", promptEn:"A pilot ___ planes.", promptAr:"الطيار ___ الطائرات.",
          options:["flies","fly","flying"], correct:"flies" },
        { emoji:"👨‍🍳", promptEn:"A chef ___ food.", promptAr:"الطاهي ___ الطعام.",
          options:["cooks","cook","cooking"], correct:"cooks" },
        { emoji:"👮", promptEn:"A police officer ___ the city.", promptAr:"الشرطي ___ المدينة.",
          options:["protects","protect","protecting"], correct:"protects" }
      ]
    },
    {
      id:"workswhere", type:"mcq", character:"malik",
      tagEn:"Who Works Where?", tagAr:"من يعمل أين؟",
      instructionsEn:"Choose where this person works.",
      instructionsAr:"اختر أين يعمل هذا الشخص.",
      rounds:[
        { emoji:"👩‍🏫", promptEn:"A teacher works at a ___.", promptAr:"يعمل المعلم في ___.",
          options:["school","hospital","farm"], correct:"school" },
        { emoji:"👨‍⚕️", promptEn:"A doctor works at a ___.", promptAr:"يعمل الطبيب في ___.",
          options:["hospital","school","airport"], correct:"hospital" },
        { emoji:"👨‍🌾", promptEn:"A farmer works on a ___.", promptAr:"يعمل المزارع في ___.",
          options:["farm","hospital","airplane"], correct:"farm" },
        { emoji:"👨‍✈️", promptEn:"A pilot works on an ___.", promptAr:"يعمل الطيار في ___.",
          options:["airplane","farm","school"], correct:"airplane" },
        { emoji:"👨‍🍳", promptEn:"A chef works in a ___.", promptAr:"يعمل الطاهي في ___.",
          options:["restaurant","hospital","farm"], correct:"restaurant" },
        { emoji:"👮", promptEn:"A police officer works at a ___.", promptAr:"يعمل الشرطي في ___.",
          options:["police station","school","farm"], correct:"police station" }
      ]
    },
    {
      id:"challenge", type:"mcq", character:"mahir",
      tagEn:"Job Challenge", tagAr:"تحدي الوظائف",
      instructionsEn:"Choose the correct answer.",
      instructionsAr:"اختر الإجابة الصحيحة.",
      rounds:[
        { emoji:"👩‍🏫", promptEn:"What is her job?", promptAr:"ما وظيفتها؟",
          options:["teacher","doctor","nurse"], correct:"teacher" },
        { emoji:"👨‍⚕️", promptEn:"What is his job?", promptAr:"ما وظيفته؟",
          options:["doctor","engineer","pilot"], correct:"doctor" },
        { promptEn:"A nurse ___ patients in the hospital.", promptAr:"الممرضة ___ المرضى في المستشفى.",
          options:["helps","help","helping"], correct:"helps" },
        { promptEn:"An engineer ___ buildings.", promptAr:"المهندس ___ المباني.",
          options:["designs","design","designing"], correct:"designs" },
        { emoji:"👮", promptEn:"What is his job?", promptAr:"ما وظيفته؟",
          options:["police officer","farmer","chef"], correct:"police officer" },
        { emoji:"👨‍🍳", promptEn:"What is his job?", promptAr:"ما وظيفته؟",
          options:["chef","pilot","engineer"], correct:"chef" }
      ]
    }
  ]
};

/* ---------- GAME 4 : DAILY ROUTINE DEPOT (Unit 11) ---------- */

const ROUTINE_VOCAB = [
  { id:"wakeup", en:"wake up", ar:"يستيقظ", emoji:"⏰😴" },
  { id:"getup", en:"get up", ar:"ينهض", emoji:"🛏️⬆️" },
  { id:"getdressed", en:"get dressed", ar:"يرتدي ملابسه", emoji:"👕" },
  { id:"havebreakfast", en:"have breakfast", ar:"يتناول الفطور", emoji:"🍳" },
  { id:"brushteeth", en:"brush teeth", ar:"ينظف أسنانه", emoji:"🪥" },
  { id:"gotoschool", en:"go to school", ar:"يذهب إلى المدرسة", emoji:"🎒🏫" },
  { id:"dohomework", en:"do homework", ar:"يؤدي واجبه", emoji:"📝" },
  { id:"gotobed", en:"go to bed", ar:"يذهب إلى النوم", emoji:"🌙🛌" }
];

const GAME_ROUTINE = {
  id: "routine",
  emoji: "⏰",
  titleEn: "Daily Routine Depot",
  titleAr: "محطة الروتين اليومي",
  character: "marya",
  introEn: "Learn to talk about your day and tell the time!",
  introAr: "تعلّم كيف تتحدث عن يومك وتخبر بالوقت!",
  activities: [
    {
      id:"vocab", type:"vocab", character:"marya",
      tagEn:"Routine Words", tagAr:"كلمات الروتين",
      instructionsEn:"Tap a word to hear it and see its meaning.",
      instructionsAr:"اضغط على الكلمة لسماعها ومعرفة معناها.",
      words: ROUTINE_VOCAB
    },
    {
      id:"teach", type:"teach", character:"maya",
      tagEn:"Telling Time", tagAr:"إخبار الوقت",
      instructionsEn:"How do we say the time?",
      instructionsAr:"كيف نقول الوقت؟",
      teachBlocks:[
        { pillEn:"O'Clock",
          descEn:"Use o'clock for the exact hour.", descAr:"استخدمها عند الساعة بالضبط.",
          examples:[ { emoji:"🕖", textEn:"7:00 → seven o'clock" } ] },
        { pillEn:"Half Past",
          descEn:"Use half past for 30 minutes after the hour.", descAr:"استخدمها بعد نصف ساعة من الساعة.",
          examples:[ { emoji:"🕢", textEn:"7:30 → half past seven" } ] },
        { pillEn:"Quarter Past / To", accent:true,
          descEn:"Quarter past = 15 minutes after. Quarter to = 15 minutes before the next hour.", descAr:"quarter past = بعد ربع ساعة. quarter to = قبل ربع ساعة من الساعة التالية.",
          examples:[
            { emoji:"🕤", textEn:"7:15 → quarter past seven" },
            { emoji:"🕡", textEn:"6:45 → quarter to seven" }
          ] }
      ]
    },
    {
      id:"whattime", type:"mcq", character:"mahir",
      tagEn:"What Time Is It?", tagAr:"كم الساعة؟",
      instructionsEn:"Choose the correct time.",
      instructionsAr:"اختر الوقت الصحيح.",
      rounds:[
        { promptEn:"🕖  7:00", promptAr:"🕖  7:00",
          options:["seven o'clock","seven thirty","six o'clock"], correct:"seven o'clock" },
        { promptEn:"🕞  3:30", promptAr:"🕞  3:30",
          options:["half past three","half past four","three o'clock"], correct:"half past three" },
        { promptEn:"🕤  9:15", promptAr:"🕤  9:15",
          options:["quarter past nine","quarter to nine","nine o'clock"], correct:"quarter past nine" },
        { promptEn:"🕠  5:45", promptAr:"🕠  5:45",
          options:["quarter to six","quarter past six","six o'clock"], correct:"quarter to six" },
        { promptEn:"🕛  12:00", promptAr:"🕛  12:00",
          options:["twelve o'clock","twelve thirty","one o'clock"], correct:"twelve o'clock" },
        { promptEn:"🕣  8:30", promptAr:"🕣  8:30",
          options:["half past eight","half past nine","eight o'clock"], correct:"half past eight" }
      ]
    },
    {
      id:"frequency", type:"mcq", character:"malik",
      tagEn:"Always, Usually, Sometimes, Never", tagAr:"دائمًا، عادة، أحيانًا، أبدًا",
      instructionsEn:"Choose the correct frequency word.",
      instructionsAr:"اختر كلمة التكرار الصحيحة.",
      rounds:[
        { promptEn:"(100%) I ___ brush my teeth every morning.", promptAr:"(100%) أنا ___ أنظف أسناني كل صباح.",
          options:["always","never","sometimes"], correct:"always" },
        { promptEn:"(0%) She ___ eats candy for breakfast.", promptAr:"(0%) هي ___ تأكل الحلوى في الفطور.",
          options:["never","always","usually"], correct:"never" },
        { promptEn:"(50%) We ___ walk to school.", promptAr:"(50%) نحن ___ نمشي إلى المدرسة.",
          options:["sometimes","always","never"], correct:"sometimes" },
        { promptEn:"(90%) He ___ does his homework before dinner.", promptAr:"(90%) هو ___ يؤدي واجبه قبل العشاء.",
          options:["usually","never","sometimes"], correct:"usually" },
        { promptEn:"(100%) The sun ___ rises in the east.", promptAr:"(100%) الشمس ___ تشرق من الشرق.",
          options:["always","sometimes","never"], correct:"always" },
        { promptEn:"(10%) I ___ wake up late on school days.", promptAr:"(10%) أنا ___ أستيقظ متأخرًا في أيام المدرسة.",
          options:["sometimes","always","usually"], correct:"sometimes" }
      ]
    },
    {
      id:"myday", type:"order", character:"maya", speakOnPlace:true,
      tagEn:"My Morning", tagAr:"صباحي",
      instructionsEn:"Put the morning routine in the correct order.",
      instructionsAr:"رتّب روتين الصباح بالترتيب الصحيح.",
      rounds:[
        { items:["wakeup","getdressed","havebreakfast","gotoschool"].map((id,i)=>{
            const w = ROUTINE_VOCAB.find(v=>v.id===id); return {id:"my1_"+i, labelEn:w.en, labelAr:w.ar, emoji:w.emoji};
          }) },
        { items:["getup","brushteeth","dohomework","gotobed"].map((id,i)=>{
            const w = ROUTINE_VOCAB.find(v=>v.id===id); return {id:"my2_"+i, labelEn:w.en, labelAr:w.ar, emoji:w.emoji};
          }) }
      ]
    }
  ]
};

/* ---------- GAME 5 : ABILITY ISLAND (Unit 12) ---------- */

const PLACE_ACTIVITY = [
  { id:"pool", en:"pool", ar:"مسبح", emoji:"🏊" },
  { id:"library", en:"library", ar:"مكتبة", emoji:"📚" },
  { id:"park", en:"park", ar:"حديقة عامة", emoji:"🌳" },
  { id:"cinema", en:"cinema", ar:"سينما", emoji:"🎬" },
  { id:"zoo", en:"zoo", ar:"حديقة حيوان", emoji:"🦁" },
  { id:"supermarket", en:"supermarket", ar:"سوبر ماركت", emoji:"🛒" }
];

const GAME_ABILITY = {
  id: "ability",
  emoji: "🏝️",
  titleEn: "Ability Island",
  titleAr: "جزيرة القدرة",
  character: "maya",
  introEn: "Learn 'can' and 'can't' to talk about what people are able to do!",
  introAr: "تعلّم can و can't للحديث عمّا يستطيع الناس فعله!",
  activities: [
    {
      id:"teach", type:"teach", character:"mahir",
      tagEn:"Can / Can't", tagAr:"can و can't",
      instructionsEn:"How do we talk about ability?",
      instructionsAr:"كيف نتحدث عن القدرة على فعل شيء؟",
      teachBlocks:[
        { pillEn:"Can",
          descEn:"Use can to show someone IS able to do something.", descAr:"استخدمها عندما يستطيع أحد فعل شيء ما.",
          examples:[ { emoji:"🐦", textEn:"Birds can fly." } ] },
        { pillEn:"Can't", accent:true,
          descEn:"Use can't to show someone is NOT able to do something.", descAr:"استخدمها عندما لا يستطيع أحد فعل شيء ما.",
          examples:[ { emoji:"🐟", textEn:"Fish can't walk." } ] }
      ]
    },
    {
      id:"wherecan", type:"mcq", character:"maya",
      tagEn:"Where Can You...?", tagAr:"أين يمكنك...؟",
      instructionsEn:"Choose the correct place.",
      instructionsAr:"اختر المكان الصحيح.",
      rounds:[
        { emoji:"🏊", promptEn:"You can swim at the ___.", promptAr:"يمكنك السباحة في ال___.",
          options:["pool","library","bank"], correct:"pool" },
        { emoji:"📚", promptEn:"You can borrow books at the ___.", promptAr:"يمكنك استعارة الكتب من ال___.",
          options:["library","pool","bakery"], correct:"library" },
        { emoji:"🛒", promptEn:"You can buy food at the ___.", promptAr:"يمكنك شراء الطعام من ال___.",
          options:["supermarket","hospital","school"], correct:"supermarket" },
        { emoji:"🎬", promptEn:"You can watch a movie at the ___.", promptAr:"يمكنك مشاهدة فيلم في ال___.",
          options:["cinema","farm","bank"], correct:"cinema" },
        { emoji:"🌳", promptEn:"You can play soccer at the ___.", promptAr:"يمكنك لعب كرة القدم في ال___.",
          options:["park","hospital","library"], correct:"park" },
        { emoji:"🦁", promptEn:"You can see animals at the ___.", promptAr:"يمكنك رؤية الحيوانات في ال___.",
          options:["zoo","bank","cinema"], correct:"zoo" }
      ]
    },
    {
      id:"canorcant", type:"mcq", character:"marya",
      tagEn:"Can or Can't?", tagAr:"can أم can't؟",
      instructionsEn:"Choose can or can't.",
      instructionsAr:"اختر can أو can't.",
      rounds:[
        { emoji:"🐟", promptEn:"Fish ___ swim.", promptAr:"السمك ___ يسبح.",
          options:["can","can't"], correct:"can" },
        { emoji:"🐕", promptEn:"A dog ___ fly.", promptAr:"الكلب ___ يطير.",
          options:["can't","can"], correct:"can't" },
        { emoji:"🐦", promptEn:"Birds ___ fly.", promptAr:"الطيور ___ تطير.",
          options:["can","can't"], correct:"can" },
        { emoji:"🐱", promptEn:"A cat ___ speak English.", promptAr:"القط ___ يتحدث الإنجليزية.",
          options:["can't","can"], correct:"can't" },
        { emoji:"📚", promptEn:"You ___ read a book at the library.", promptAr:"أنت ___ تقرأ كتابًا في المكتبة.",
          options:["can","can't"], correct:"can" },
        { emoji:"🐠", promptEn:"A fish ___ walk on land.", promptAr:"السمكة ___ تمشي على الأرض.",
          options:["can't","can"], correct:"can't" }
      ]
    },
    {
      id:"matchplace", type:"match", character:"malik",
      tagEn:"Match Place to Activity", tagAr:"طابق المكان بالنشاط",
      instructionsEn:"Match the place to its picture.",
      instructionsAr:"طابق المكان بصورته.",
      rounds:[
        { pairs:["pool","library","park"].map(id=>{
            const w = PLACE_ACTIVITY.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) },
        { pairs:["cinema","zoo","supermarket"].map(id=>{
            const w = PLACE_ACTIVITY.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) }
      ]
    },
    {
      id:"challenge", type:"mcq", character:"mahir",
      tagEn:"Ability Challenge", tagAr:"تحدي القدرة",
      instructionsEn:"Choose the correct answer.",
      instructionsAr:"اختر الإجابة الصحيحة.",
      rounds:[
        { emoji:"🐘", promptEn:"An elephant ___ fly.", promptAr:"الفيل ___ يطير.",
          options:["can't","can"], correct:"can't" },
        { emoji:"📚", promptEn:"You can borrow books at the ___.", promptAr:"يمكنك استعارة الكتب من ال___.",
          options:["library","cinema","zoo"], correct:"library" },
        { emoji:"🐎", promptEn:"A horse ___ run fast.", promptAr:"الحصان ___ يجري بسرعة.",
          options:["can","can't"], correct:"can" },
        { emoji:"🏊", promptEn:"You can swim at the ___.", promptAr:"يمكنك السباحة في ال___.",
          options:["pool","bank","farm"], correct:"pool" },
        { emoji:"🐧", promptEn:"A penguin ___ fly, but it ___ swim.", promptAr:"البطريق لا يطير، لكنه يسبح.",
          options:["can't / can","can / can't"], correct:"can't / can" },
        { emoji:"🦁", promptEn:"You can see animals at the ___.", promptAr:"يمكنك رؤية الحيوانات في ال___.",
          options:["zoo","library","cinema"], correct:"zoo" }
      ]
    }
  ]
};

const ALL_GAMES = [GAME_FAMILY, GAME_HOUSE, GAME_JOBS, GAME_ROUTINE, GAME_ABILITY];
