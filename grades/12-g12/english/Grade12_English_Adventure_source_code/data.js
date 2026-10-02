/* ===========================================================
   Maha Academy — Content Data (Grade 12 English)
   Based on the "Traveller 5" modules (ثالث ثانوي, term 1):
     Module 1  All Over the World -> On Holiday / The Place to Be
     Module 2  Beyond Limits      -> Crime and Punishment / Adventure
     Module 3  What the Future Holds -> Future & Environment
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

/* ---------- GAME 1 : ON HOLIDAY (Module 1, Unit 1) ---------- */

const HOLIDAY_VOCAB = [
  { id:"destination", en:"destination", ar:"وجهة", emoji:"📍" },
  { id:"itinerary", en:"itinerary", ar:"برنامج الرحلة", emoji:"🗒️" },
  { id:"souvenir", en:"souvenir", ar:"تذكار", emoji:"🎁" },
  { id:"excursion", en:"excursion", ar:"رحلة قصيرة", emoji:"🚶" },
  { id:"resort", en:"resort", ar:"منتجع", emoji:"🏖️" },
  { id:"sightseeing", en:"sightseeing", ar:"التجول لمشاهدة المعالم", emoji:"📸" },
  { id:"accommodation", en:"accommodation", ar:"سكن/إقامة", emoji:"🏨" },
  { id:"landmark", en:"landmark", ar:"معلم بارز", emoji:"🗽" }
];

const GAME_HOLIDAY = {
  id: "holiday",
  emoji: "✈️",
  titleEn: "On Holiday",
  titleAr: "في عطلة",
  character: "mahir",
  introEn: "Plan the perfect trip and learn how to talk about amounts!",
  introAr: "خطط لرحلة مثالية وتعلّم كيف تتحدث عن الكميات!",
  activities: [
    {
      id:"vocab", type:"vocab", character:"mahir",
      tagEn:"Holiday Words", tagAr:"كلمات العطلة",
      instructionsEn:"Tap a word to hear it and see its meaning.",
      instructionsAr:"اضغط على الكلمة لسماعها ومعرفة معناها.",
      words: HOLIDAY_VOCAB
    },
    {
      id:"teach", type:"teach", character:"maya",
      tagEn:"Nouns & Quantifiers", tagAr:"الأسماء وكلمات الكمية",
      instructionsEn:"How do we talk about amounts of things?",
      instructionsAr:"كيف نتحدث عن كميات الأشياء؟",
      teachBlocks:[
        { pillEn:"Countable: many / a few / several",
          descEn:"Use these with countable nouns (things you can count one by one).", descAr:"استخدمها مع الأسماء القابلة للعد (أشياء يمكن عدّها واحدة واحدة).",
          examples:[ { emoji:"🎁", textEn:"I bought a few souvenirs." } ] },
        { pillEn:"Uncountable: much / a little / a great deal of", accent:true,
          descEn:"Use these with uncountable nouns (things you can't count one by one).", descAr:"استخدمها مع الأسماء غير القابلة للعد (أشياء لا يمكن عدّها).",
          examples:[ { emoji:"🧳", textEn:"I don't have much luggage this time." } ] }
      ]
    },
    {
      id:"quantifiers", type:"mcq", character:"mahir",
      tagEn:"Choose the Right Quantifier", tagAr:"اختر كلمة الكمية الصحيحة",
      instructionsEn:"Choose the correct word.",
      instructionsAr:"اختر الكلمة الصحيحة.",
      rounds:[
        { promptEn:"We only have ___ time before the flight — let's hurry!", promptAr:"لدينا وقت قليل فقط قبل الرحلة — لنسرع!",
          options:["a little","a few"], correct:"a little" },
        { promptEn:"I bought ___ souvenirs for my family.", promptAr:"اشتريت بضعة تذكارات لعائلتي.",
          options:["a few","a little"], correct:"a few" },
        { promptEn:"How ___ money did you spend on the trip?", promptAr:"كم من المال أنفقت في الرحلة؟",
          options:["much","many"], correct:"much" },
        { promptEn:"How ___ excursions are included in the package?", promptAr:"كم عدد الرحلات القصيرة المشمولة في الباقة؟",
          options:["many","much"], correct:"many" },
        { promptEn:"There isn't ___ accommodation left in this resort.", promptAr:"لم يتبقَّ سكن كافٍ في هذا المنتجع.",
          options:["much","many"], correct:"much" },
        { promptEn:"We visited ___ landmarks during our trip.", promptAr:"زرنا عدة معالم بارزة خلال رحلتنا.",
          options:["several","much"], correct:"several" }
      ]
    },
    {
      id:"match", type:"match", character:"marya",
      tagEn:"Match the Holiday Word", tagAr:"طابق كلمة العطلة",
      instructionsEn:"Match the English word to the correct picture.",
      instructionsAr:"طابق الكلمة الإنجليزية مع الصورة الصحيحة.",
      rounds:[
        { pairs:["destination","itinerary","souvenir","excursion"].map(id=>{
            const w = HOLIDAY_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) },
        { pairs:["resort","sightseeing","accommodation","landmark"].map(id=>{
            const w = HOLIDAY_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) }
      ]
    },
    {
      id:"buildsentence", type:"order", character:"marya", orderMode:"words",
      tagEn:"Build the Sentence", tagAr:"كوّن الجملة",
      instructionsEn:"Drag the words into the correct order.",
      instructionsAr:"اسحب الكلمات بالترتيب الصحيح.",
      rounds:[
        { items:["We","booked","a","resort","near","the","beach"].map((w,i)=>({id:"hol1_"+i, labelEn:w})) },
        { items:["I","don't","have","much","time","today"].map((w,i)=>({id:"hol2_"+i, labelEn:w})) },
        { items:["She","bought","a","few","souvenirs","yesterday"].map((w,i)=>({id:"hol3_"+i, labelEn:w})) },
        { items:["We","visited","several","landmarks","last","week"].map((w,i)=>({id:"hol4_"+i, labelEn:w})) }
      ]
    },
    {
      id:"challenge", type:"mcq", character:"malik",
      tagEn:"On Holiday Challenge", tagAr:"تحدي العطلة",
      instructionsEn:"Choose the correct answer.",
      instructionsAr:"اختر الإجابة الصحيحة.",
      rounds:[
        { emoji:"📸", promptEn:"What do we call visiting famous places in a city?", promptAr:"ماذا نسمي زيارة الأماكن المشهورة في المدينة؟",
          options:["sightseeing","accommodation","an itinerary"], correct:"sightseeing" },
        { promptEn:"How ___ countries have you visited?", promptAr:"كم دولة زرتها؟",
          options:["many","much"], correct:"many" },
        { emoji:"🗒️", promptEn:"What do we call the detailed plan for a trip?", promptAr:"ماذا نسمي الخطة التفصيلية للرحلة؟",
          options:["an itinerary","a landmark","a destination"], correct:"an itinerary" },
        { promptEn:"We didn't have ___ information about the hotel before we booked it.", promptAr:"لم يكن لدينا معلومات كافية عن الفندق قبل أن نحجزه.",
          options:["much","many"], correct:"much" },
        { emoji:"🏨", promptEn:"What do we call the place where you stay during a trip?", promptAr:"ماذا نسمي المكان الذي تقيم فيه أثناء الرحلة؟",
          options:["accommodation","a souvenir","a destination"], correct:"accommodation" },
        { promptEn:"I only packed ___ clothes for the short trip.", promptAr:"لم أحزم سوى بضع قطع ملابس للرحلة القصيرة.",
          options:["a few","a little"], correct:"a few" }
      ]
    }
  ]
};

/* ---------- GAME 2 : THE PLACE TO BE (Module 1, Unit 2) ---------- */

const PLACE_VOCAB = [
  { id:"crowded", en:"crowded", ar:"مزدحم", emoji:"🚶‍♂️" },
  { id:"peaceful", en:"peaceful", ar:"هادئ", emoji:"🕊️" },
  { id:"breathtaking", en:"breathtaking", ar:"خلّاب", emoji:"😮" },
  { id:"foggy", en:"foggy", ar:"ضبابي", emoji:"🌫️" },
  { id:"picturesque", en:"picturesque", ar:"بديع المنظر", emoji:"🖼️" },
  { id:"remote", en:"remote", ar:"نائي", emoji:"🏝️" },
  { id:"vibrant", en:"vibrant", ar:"نابض بالحياة", emoji:"🎉" },
  { id:"humid", en:"humid", ar:"رطب", emoji:"💧" }
];

const GAME_PLACE = {
  id: "place",
  emoji: "🏙️",
  titleEn: "The Place to Be",
  titleAr: "المكان الذي تريده",
  character: "maya",
  introEn: "Describe amazing places and learn about articles!",
  introAr: "صف أماكن رائعة وتعلّم عن أدوات التعريف والتنكير!",
  activities: [
    {
      id:"vocab", type:"vocab", character:"maya",
      tagEn:"Place & Weather Words", tagAr:"كلمات المكان والطقس",
      instructionsEn:"Tap a word to hear it and see its meaning.",
      instructionsAr:"اضغط على الكلمة لسماعها ومعرفة معناها.",
      words: PLACE_VOCAB
    },
    {
      id:"teach", type:"teach", character:"mahir",
      tagEn:"Articles: a / an / the / (no article)", tagAr:"أدوات التعريف والتنكير",
      instructionsEn:"When do we use a, an, the, or nothing at all?",
      instructionsAr:"متى نستخدم a أو an أو the أو لا شيء؟",
      teachBlocks:[
        { pillEn:"A / AN — one of many",
          descEn:"Use a/an the first time we mention something, or to talk about one of many.", descAr:"نستخدم a/an عند ذكر شيء لأول مرة، أو للحديث عن واحد من كثيرين.",
          examples:[ { emoji:"🏝️", textEn:"We stayed at a remote island resort." } ] },
        { pillEn:"THE — something specific", accent:true,
          descEn:"Use the when both speakers know exactly which one we mean.", descAr:"نستخدم the عندما يعرف المتحدثان بالضبط أي واحد نقصد.",
          examples:[ { emoji:"🌇", textEn:"The view from our room was breathtaking." } ] }
      ]
    },
    {
      id:"choosearticle", type:"mcq", character:"maya",
      tagEn:"Choose the Right Article", tagAr:"اختر أداة التعريف الصحيحة",
      instructionsEn:"Choose a, an, the, or no article.",
      instructionsAr:"اختر a أو an أو the أو بلا أداة.",
      rounds:[
        { promptEn:"We climbed ___ highest mountain in the region.", promptAr:"تسلقنا أعلى جبل في المنطقة.",
          options:["the","a"], correct:"the" },
        { promptEn:"She wants to visit ___ picturesque village in the mountains.", promptAr:"تريد زيارة قرية بديعة المنظر في الجبال.",
          options:["a","the"], correct:"a" },
        { promptEn:"___ Nile is the longest river in Africa.", promptAr:"نهر النيل هو أطول نهر في أفريقيا.",
          options:["The","A"], correct:"The" },
        { promptEn:"It's ___ humid day today.", promptAr:"إنه يوم رطب اليوم.",
          options:["a","the"], correct:"a" },
        { promptEn:"This is ___ most peaceful place I have ever visited.", promptAr:"هذا هو أكثر مكان هادئ زرته على الإطلاق.",
          options:["the","a"], correct:"the" },
        { promptEn:"___ hotel we stayed at had a breathtaking view.", promptAr:"الفندق الذي أقمنا فيه كان له منظر خلّاب.",
          options:["The","A"], correct:"The" }
      ]
    },
    {
      id:"match", type:"match", character:"marya",
      tagEn:"Match the Place Word", tagAr:"طابق كلمة المكان",
      instructionsEn:"Match the English word to the correct picture.",
      instructionsAr:"طابق الكلمة الإنجليزية مع الصورة الصحيحة.",
      rounds:[
        { pairs:["crowded","peaceful","breathtaking","foggy"].map(id=>{
            const w = PLACE_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) },
        { pairs:["picturesque","remote","vibrant","humid"].map(id=>{
            const w = PLACE_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) }
      ]
    },
    {
      id:"challenge", type:"mcq", character:"malik",
      tagEn:"The Place to Be Challenge", tagAr:"تحدي المكان الذي تريده",
      instructionsEn:"Choose the correct answer.",
      instructionsAr:"اختر الإجابة الصحيحة.",
      rounds:[
        { emoji:"🎉", promptEn:"What word describes a lively, colorful city full of energy?", promptAr:"ما الكلمة التي تصف مدينة نابضة بالحياة ومليئة بالطاقة؟",
          options:["vibrant","foggy","remote"], correct:"vibrant" },
        { promptEn:"We have already visited ___ pyramids of Giza.", promptAr:"لقد زرنا أهرامات الجيزة بالفعل.",
          options:["the","a"], correct:"the" },
        { emoji:"🏝️", promptEn:"What word describes a place that is far away and hard to reach?", promptAr:"ما الكلمة التي تصف مكانًا بعيدًا ويصعب الوصول إليه؟",
          options:["remote","crowded","vibrant"], correct:"remote" },
        { promptEn:"We have visited ___ Netherlands twice this year.", promptAr:"زرنا هولندا مرتين هذا العام.",
          options:["the","a"], correct:"the" },
        { emoji:"🌫️", promptEn:"What word describes weather with thick mist that's hard to see through?", promptAr:"ما الكلمة التي تصف طقسًا فيه ضباب كثيف يصعب الرؤية خلاله؟",
          options:["foggy","humid","picturesque"], correct:"foggy" },
        { emoji:"🖼️", promptEn:"What word describes a view so pretty it looks like a painting?", promptAr:"ما الكلمة التي تصف منظرًا جميلًا جدًا كأنه لوحة؟",
          options:["picturesque","crowded","peaceful"], correct:"picturesque" }
      ]
    }
  ]
};

/* ---------- GAME 3 : CRIME AND PUNISHMENT (Module 2, Unit 3) ---------- */

const CRIME_VOCAB = [
  { id:"thief", en:"thief", ar:"لص", emoji:"🥷" },
  { id:"witness", en:"witness", ar:"شاهد", emoji:"👀" },
  { id:"guilty", en:"guilty", ar:"مذنب", emoji:"⚖️" },
  { id:"arrest", en:"arrest", ar:"يعتقل", emoji:"🚓" },
  { id:"sentence", en:"sentence", ar:"حكم قضائي", emoji:"🔨" },
  { id:"victim", en:"victim", ar:"ضحية", emoji:"😟" },
  { id:"court", en:"court", ar:"محكمة", emoji:"🏛️" },
  { id:"steal", en:"steal", ar:"يسرق", emoji:"🫳" }
];

const GAME_CRIME = {
  id: "crime",
  emoji: "🚨",
  titleEn: "Crime and Punishment",
  titleAr: "الجريمة والعقاب",
  character: "marya",
  introEn: "Investigate a case and learn to make comparisons!",
  introAr: "حقق في قضية وتعلّم كيف تقارن!",
  activities: [
    {
      id:"vocab", type:"vocab", character:"marya",
      tagEn:"Crime Words", tagAr:"كلمات الجريمة",
      instructionsEn:"Tap a word to hear it and see its meaning.",
      instructionsAr:"اضغط على الكلمة لسماعها ومعرفة معناها.",
      words: CRIME_VOCAB
    },
    {
      id:"teach", type:"teach", character:"maya",
      tagEn:"Comparisons", tagAr:"المقارنات",
      instructionsEn:"How do we compare two or more things?",
      instructionsAr:"كيف نقارن بين شيئين أو أكثر؟",
      teachBlocks:[
        { pillEn:"as...as (equal)",
          descEn:"Use as + adjective + as to say two things are equal.", descAr:"استخدم as + صفة + as للقول إن شيئين متساويان.",
          examples:[ { emoji:"⚖️", textEn:"This case is as serious as the last one." } ] },
        { pillEn:"less / the least", accent:true,
          descEn:"Use less...than and the least to compare downward.", descAr:"استخدم less...than و the least للمقارنة نحو الأقل.",
          examples:[ { emoji:"🔨", textEn:"His sentence was less severe than expected." } ] }
      ]
    },
    {
      id:"comparisons", type:"mcq", character:"marya",
      tagEn:"Compare It", tagAr:"قارن",
      instructionsEn:"Choose the correct comparison.",
      instructionsAr:"اختر المقارنة الصحيحة.",
      rounds:[
        { promptEn:"This crime was ___ serious as the one last month.", promptAr:"كانت هذه الجريمة خطيرة بقدر تلك التي حدثت الشهر الماضي.",
          options:["as","less"], correct:"as" },
        { promptEn:"The second witness was ___ confident than the first.", promptAr:"كان الشاهد الثاني أقل ثقة من الأول.",
          options:["less","as"], correct:"less" },
        { promptEn:"Of all the suspects, he seemed ___ likely to be guilty.", promptAr:"من بين كل المشتبه بهم، بدا الأقل احتمالًا أن يكون مذنبًا.",
          options:["the least","less"], correct:"the least" },
        { promptEn:"Her testimony was not ___ clear as the officer's report.", promptAr:"لم تكن شهادتها واضحة بقدر تقرير الضابط.",
          options:["as","less"], correct:"as" },
        { promptEn:"This is ___ dangerous neighborhood in the city.", promptAr:"هذا هو أقل حي خطورة في المدينة.",
          options:["the least","as"], correct:"the least" },
        { promptEn:"The trial took ___ time than everyone expected.", promptAr:"استغرقت المحاكمة وقتًا أقل مما توقع الجميع.",
          options:["less","as"], correct:"less" }
      ]
    },
    {
      id:"match", type:"match", character:"mahir",
      tagEn:"Match the Crime Word", tagAr:"طابق كلمة الجريمة",
      instructionsEn:"Match the English word to the correct picture.",
      instructionsAr:"طابق الكلمة الإنجليزية مع الصورة الصحيحة.",
      rounds:[
        { pairs:["thief","witness","guilty","arrest"].map(id=>{
            const w = CRIME_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) },
        { pairs:["sentence","victim","court","steal"].map(id=>{
            const w = CRIME_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) }
      ]
    },
    {
      id:"whathappened", type:"mcq", character:"malik",
      tagEn:"What Was Happening?", tagAr:"ماذا كان يحدث؟",
      instructionsEn:"Choose the correct verb form.",
      instructionsAr:"اختر صيغة الفعل الصحيحة.",
      rounds:[
        { promptEn:"The thief ___ through the window when the alarm went off.", promptAr:"كان اللص يتسلل عبر النافذة عندما انطلق الإنذار.",
          options:["was climbing","climbed"], correct:"was climbing" },
        { promptEn:"The police ___ the suspect near the store.", promptAr:"اعتقلت الشرطة المشتبه به بالقرب من المتجر.",
          options:["arrested","were arresting"], correct:"arrested" },
        { promptEn:"The witness ___ television when she heard the noise outside.", promptAr:"كانت الشاهدة تشاهد التلفاز عندما سمعت الضجيج بالخارج.",
          options:["was watching","watched"], correct:"was watching" },
        { promptEn:"The judge ___ him to six months in prison.", promptAr:"حكم عليه القاضي بالسجن ستة أشهر.",
          options:["sentenced","was sentencing"], correct:"sentenced" },
        { promptEn:"While the guard ___, the thief stole the painting.", promptAr:"بينما كان الحارس نائمًا، سرق اللص اللوحة.",
          options:["was sleeping","slept"], correct:"was sleeping" },
        { promptEn:"The court ___ the case for three days last week.", promptAr:"نظرت المحكمة في القضية لمدة ثلاثة أيام الأسبوع الماضي.",
          options:["heard","was hearing"], correct:"heard" }
      ]
    },
    {
      id:"challenge", type:"mcq", character:"maya",
      tagEn:"Crime and Punishment Challenge", tagAr:"تحدي الجريمة والعقاب",
      instructionsEn:"Choose the correct answer.",
      instructionsAr:"اختر الإجابة الصحيحة.",
      rounds:[
        { emoji:"👀", promptEn:"What do we call someone who saw a crime happen?", promptAr:"ماذا نسمي شخصًا رأى الجريمة تحدث؟",
          options:["a witness","a victim","a thief"], correct:"a witness" },
        { promptEn:"The two robberies were ___ similar as each other.", promptAr:"كانت السرقتان متشابهتين بقدر واحدة للأخرى.",
          options:["as","less"], correct:"as" },
        { emoji:"😟", promptEn:"What do we call the person a crime happens to?", promptAr:"ماذا نسمي الشخص الذي تقع عليه الجريمة؟",
          options:["the victim","the witness","the judge"], correct:"the victim" },
        { promptEn:"This was ___ complicated case the detective had ever handled.", promptAr:"كانت هذه أقل قضية تعقيدًا تعامل معها المحقق.",
          options:["the least","less"], correct:"the least" },
        { emoji:"🏛️", promptEn:"What do we call the place where a trial happens?", promptAr:"ماذا نسمي المكان الذي تُعقد فيه المحاكمة؟",
          options:["a court","a station","a prison"], correct:"a court" },
        { promptEn:"He was found ___ and sent to prison.", promptAr:"وُجد مذنبًا وأُرسل إلى السجن.",
          options:["guilty","innocent"], correct:"guilty" }
      ]
    }
  ]
};

/* ---------- GAME 4 : ADVENTURE (Module 2, Unit 4) ---------- */

const ADVENTURE_VOCAB = [
  { id:"exhausted", en:"exhausted", ar:"منهك", emoji:"😩" },
  { id:"terrified", en:"terrified", ar:"مرعوب", emoji:"😨" },
  { id:"furious", en:"furious", ar:"غاضب جدًا", emoji:"😡" },
  { id:"delighted", en:"delighted", ar:"مسرور جدًا", emoji:"😄" },
  { id:"starving", en:"starving", ar:"جائع جدًا", emoji:"🍽️" },
  { id:"freezing", en:"freezing", ar:"متجمد من البرد", emoji:"🥶" },
  { id:"thrilled", en:"thrilled", ar:"متحمس جدًا", emoji:"🤩" },
  { id:"astonished", en:"astonished", ar:"مندهش جدًا", emoji:"😲" }
];

const GAME_ADVENTURE = {
  id: "adventure",
  emoji: "🏔️",
  titleEn: "Adventure",
  titleAr: "مغامرة",
  character: "malik",
  introEn: "Go on a wild adventure and master the past perfect!",
  introAr: "انطلق في مغامرة برية وأتقن الماضي التام!",
  activities: [
    {
      id:"vocab", type:"vocab", character:"malik",
      tagEn:"Strong Feeling Words", tagAr:"كلمات المشاعر القوية",
      instructionsEn:"Tap a word to hear it and see its meaning.",
      instructionsAr:"اضغط على الكلمة لسماعها ومعرفة معناها.",
      words: ADVENTURE_VOCAB
    },
    {
      id:"teach", type:"teach", character:"maya",
      tagEn:"Past Perfect & Was/Were Going To", tagAr:"الماضي التام و was/were going to",
      instructionsEn:"How do we talk about something that happened before another past event?",
      instructionsAr:"كيف نتحدث عن شيء حدث قبل حدث آخر في الماضي؟",
      teachBlocks:[
        { pillEn:"Past Perfect: had + past participle",
          descEn:"Use this for an action that finished before another past action.", descAr:"استخدمه لفعل انتهى قبل فعل آخر في الماضي.",
          examples:[ { emoji:"🏔️", textEn:"We had already climbed the peak when the storm arrived." } ] },
        { pillEn:"Was/Were going to", accent:true,
          descEn:"Use this for a past plan that didn't happen.", descAr:"استخدمه لخطة في الماضي لم تتحقق.",
          examples:[ { emoji:"🎒", textEn:"I was going to camp outside, but it rained." } ] }
      ]
    },
    {
      id:"pastperfect", type:"mcq", character:"malik",
      tagEn:"Before or After?", tagAr:"قبل أم بعد؟",
      instructionsEn:"Choose the correct verb form.",
      instructionsAr:"اختر صيغة الفعل الصحيحة.",
      rounds:[
        { promptEn:"By the time we reached the camp, the sun ___.", promptAr:"بحلول وقت وصولنا إلى المخيم، كانت الشمس قد غربت.",
          options:["had set","set"], correct:"had set" },
        { promptEn:"I ___ to go rock climbing, but I changed my mind.", promptAr:"كنت سأذهب لتسلق الصخور، لكنني غيّرت رأيي.",
          options:["was going","went"], correct:"was going" },
        { promptEn:"She was exhausted because she ___ for six hours already.", promptAr:"كانت منهكة لأنها كانت تمشي بالفعل لمدة ست ساعات.",
          options:["had been hiking","hiked"], correct:"had been hiking" },
        { promptEn:"We ___ to cross the river before it started flooding.", promptAr:"كنا سنعبر النهر قبل أن يبدأ بالفيضان.",
          options:["were going","went"], correct:"were going" },
        { promptEn:"By the time help arrived, the hikers ___ down the mountain.", promptAr:"بحلول وصول المساعدة، كان المتسلقون قد نزلوا الجبل.",
          options:["had climbed","climbed"], correct:"had climbed" },
        { promptEn:"He ___ starving because he hadn't eaten all day.", promptAr:"كان يشعر بجوع شديد لأنه لم يأكل طوال اليوم.",
          options:["felt","was feeling"], correct:"felt" }
      ]
    },
    {
      id:"match", type:"match", character:"marya",
      tagEn:"Match the Feeling Word", tagAr:"طابق كلمة الشعور",
      instructionsEn:"Match the English word to the correct picture.",
      instructionsAr:"طابق الكلمة الإنجليزية مع الصورة الصحيحة.",
      rounds:[
        { pairs:["exhausted","terrified","furious","delighted"].map(id=>{
            const w = ADVENTURE_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) },
        { pairs:["starving","freezing","thrilled","astonished"].map(id=>{
            const w = ADVENTURE_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) }
      ]
    },
    {
      id:"challenge", type:"mcq", character:"mahir",
      tagEn:"Adventure Challenge", tagAr:"تحدي المغامرة",
      instructionsEn:"Choose the correct answer.",
      instructionsAr:"اختر الإجابة الصحيحة.",
      rounds:[
        { emoji:"🥶", promptEn:"What do we call feeling extremely cold?", promptAr:"ماذا نسمي الشعور بالبرد الشديد؟",
          options:["freezing","starving","furious"], correct:"freezing" },
        { promptEn:"By midnight, we ___ over twenty kilometers.", promptAr:"بحلول منتصف الليل، كنا قد قطعنا أكثر من عشرين كيلومترًا.",
          options:["had walked","walked"], correct:"had walked" },
        { emoji:"😨", promptEn:"What do we call feeling extremely afraid?", promptAr:"ماذا نسمي الشعور بخوف شديد؟",
          options:["terrified","delighted","thrilled"], correct:"terrified" },
        { promptEn:"We ___ to reach the summit before noon, but the weather changed our plan.", promptAr:"كنا سنصل إلى القمة قبل الظهر، لكن الطقس غيّر خطتنا.",
          options:["were going","went"], correct:"were going" },
        { emoji:"🤩", promptEn:"What do we call feeling extremely excited?", promptAr:"ماذا نسمي الشعور بحماس شديد؟",
          options:["thrilled","exhausted","furious"], correct:"thrilled" },
        { promptEn:"She ___ never seen such a beautiful view before that trip.", promptAr:"لم تكن قد رأت من قبل منظرًا بهذا الجمال قبل تلك الرحلة.",
          options:["had","has"], correct:"had" }
      ]
    }
  ]
};

/* ---------- GAME 5 : FUTURE & ENVIRONMENT (Module 3, Units 5-6) ---------- */

const FUTURE_VOCAB = [
  { id:"sustainable", en:"sustainable", ar:"مستدام", emoji:"🌿" },
  { id:"urban", en:"urban", ar:"حضري", emoji:"🏙️" },
  { id:"generation", en:"generation", ar:"جيل", emoji:"👨‍👩‍👧‍👦" },
  { id:"community", en:"community", ar:"مجتمع", emoji:"🤝" },
  { id:"lifestyle", en:"lifestyle", ar:"نمط حياة", emoji:"🧘" },
  { id:"consumption", en:"consumption", ar:"استهلاك", emoji:"🛒" },
  { id:"footprint", en:"carbon footprint", ar:"البصمة الكربونية", emoji:"👣" },
  { id:"resource", en:"resource", ar:"مورد", emoji:"⛏️" }
];

const GAME_FUTURE = {
  id: "future",
  emoji: "🌐",
  titleEn: "Future & Environment",
  titleAr: "المستقبل والبيئة",
  character: "maya",
  introEn: "Imagine the future and learn to give advice and predictions!",
  introAr: "تخيّل المستقبل وتعلّم كيف تقدّم النصيحة والتوقعات!",
  activities: [
    {
      id:"vocab", type:"vocab", character:"maya",
      tagEn:"Future & Environment Words", tagAr:"كلمات المستقبل والبيئة",
      instructionsEn:"Tap a word to hear it and see its meaning.",
      instructionsAr:"اضغط على الكلمة لسماعها ومعرفة معناها.",
      words: FUTURE_VOCAB
    },
    {
      id:"teach", type:"teach", character:"mahir",
      tagEn:"Modals of Advice & Obligation", tagAr:"أفعال النصيحة والإلزام الناقصة",
      instructionsEn:"How do we give advice or say something is a good idea?",
      instructionsAr:"كيف نقدّم نصيحة أو نقول إن شيئًا فكرة جيدة؟",
      teachBlocks:[
        { pillEn:"should / ought to — advice",
          descEn:"Use these to give advice or recommendations.", descAr:"استخدمها لتقديم نصيحة أو توصية.",
          examples:[ { emoji:"🌿", textEn:"We should live a more sustainable lifestyle." } ] },
        { pillEn:"had better — strong advice", accent:true,
          descEn:"Use this for strong advice, especially with a warning of a bad result.", descAr:"استخدمه لنصيحة قوية، خاصة مع تحذير من نتيجة سيئة.",
          examples:[ { emoji:"⛏️", textEn:"We had better use our resources wisely, or they will run out." } ] }
      ]
    },
    {
      id:"advice", type:"mcq", character:"maya",
      tagEn:"Give the Advice", tagAr:"قدّم النصيحة",
      instructionsEn:"Choose the correct modal verb.",
      instructionsAr:"اختر الفعل الناقص الصحيح.",
      rounds:[
        { promptEn:"We ___ reduce our consumption to protect the planet.", promptAr:"ينبغي لنا تقليل استهلاكنا لحماية الكوكب.",
          options:["should","must"], correct:"should" },
        { promptEn:"Cities ___ better public transport to reduce traffic.", promptAr:"يجب على المدن أن توفر مواصلات عامة أفضل لتقليل الازدحام.",
          options:["ought to have","should has"], correct:"ought to have" },
        { promptEn:"You ___ hurry, or you'll miss the community meeting.", promptAr:"من الأفضل أن تسرع، وإلا ستفوت اجتماع المجتمع.",
          options:["had better","should to"], correct:"had better" },
        { promptEn:"Future generations ___ inherit a healthier planet.", promptAr:"ينبغي أن ترث الأجيال القادمة كوكبًا أكثر صحة.",
          options:["should","must to"], correct:"should" },
        { promptEn:"We ___ reduce our carbon footprint before it's too late.", promptAr:"من الأفضل أن نقلل بصمتنا الكربونية قبل فوات الأوان.",
          options:["had better","should to"], correct:"had better" },
        { promptEn:"Governments ___ invest more in renewable resources.", promptAr:"ينبغي على الحكومات أن تستثمر أكثر في الموارد المتجددة.",
          options:["ought to","must to"], correct:"ought to" }
      ]
    },
    {
      id:"match", type:"match", character:"marya",
      tagEn:"Match the Word", tagAr:"طابق الكلمة",
      instructionsEn:"Match the English word to the correct picture.",
      instructionsAr:"طابق الكلمة الإنجليزية مع الصورة الصحيحة.",
      rounds:[
        { pairs:["sustainable","urban","generation","community"].map(id=>{
            const w = FUTURE_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) },
        { pairs:["lifestyle","consumption","footprint","resource"].map(id=>{
            const w = FUTURE_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) }
      ]
    },
    {
      id:"buildsentence", type:"order", character:"marya", orderMode:"words",
      tagEn:"Build the Sentence", tagAr:"كوّن الجملة",
      instructionsEn:"Drag the words into the correct order.",
      instructionsAr:"اسحب الكلمات بالترتيب الصحيح.",
      rounds:[
        { items:["If","we","waste","resources","they","will","run","out"].map((w,i)=>({id:"fut1_"+i, labelEn:w})) },
        { items:["We","should","reduce","our","carbon","footprint"].map((w,i)=>({id:"fut2_"+i, labelEn:w})) },
        { items:["If","cities","grew","cleaner","life","would","improve"].map((w,i)=>({id:"fut3_"+i, labelEn:w})) },
        { items:["Every","generation","must","protect","the","community"].map((w,i)=>({id:"fut4_"+i, labelEn:w})) }
      ]
    },
    {
      id:"challenge", type:"mcq", character:"malik",
      tagEn:"Future & Environment Challenge", tagAr:"تحدي المستقبل والبيئة",
      instructionsEn:"Choose the correct answer.",
      instructionsAr:"اختر الإجابة الصحيحة.",
      rounds:[
        { promptEn:"If everyone reduced water waste, the shortage ___ end.", promptAr:"لو قلّل الجميع من هدر الماء، لانتهت الأزمة.",
          options:["would","will"], correct:"would" },
        { emoji:"🌿", promptEn:"What word describes a way of living that doesn't harm the environment?", promptAr:"ما الكلمة التي تصف طريقة عيش لا تضر بالبيئة؟",
          options:["sustainable","urban","crowded"], correct:"sustainable" },
        { promptEn:"If we don't act now, the situation ___ get worse.", promptAr:"إذا لم نتصرف الآن، فسيزداد الوضع سوءًا.",
          options:["will","would"], correct:"will" },
        { emoji:"🏙️", promptEn:"What word describes something related to cities?", promptAr:"ما الكلمة التي تصف شيئًا متعلقًا بالمدن؟",
          options:["urban","rural","remote"], correct:"urban" },
        { promptEn:"If people worked together, the ___ would be stronger.", promptAr:"لو عمل الناس معًا، لكان المجتمع أقوى.",
          options:["community","consumption"], correct:"community" },
        { promptEn:"We ___ better start recycling now, before it's too late.", promptAr:"من الأفضل أن نبدأ إعادة التدوير الآن، قبل فوات الأوان.",
          options:["had","should to"], correct:"had" }
      ]
    }
  ]
};

const ALL_GAMES = [GAME_HOLIDAY, GAME_PLACE, GAME_CRIME, GAME_ADVENTURE, GAME_FUTURE];
