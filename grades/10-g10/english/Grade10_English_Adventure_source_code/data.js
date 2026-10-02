/* ===========================================================
   Maha Academy — Content Data (Grade 10 English)
   Based on the "Traveller 1" modules (أول ثانوي, common year):
     Module 1  Youth Culture       -> Youth Culture
     Module 2  What an Experience! -> What an Experience!
     Module 3  Going Places        -> Going Places / Will vs Going To
     Module 4  Nowadays            -> Nowadays
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

/* ---------- GAME 1 : YOUTH CULTURE (Module 1) ---------- */

const YOUTH_VOCAB = [
  { id:"trend", en:"trend", ar:"اتجاه", emoji:"📈" },
  { id:"hangout", en:"hang out", ar:"يقضي الوقت مع الأصدقاء", emoji:"👫" },
  { id:"socialmedia", en:"social media", ar:"وسائل التواصل", emoji:"📱" },
  { id:"playlist", en:"playlist", ar:"قائمة تشغيل", emoji:"🎵" },
  { id:"influencer", en:"influencer", ar:"مؤثر", emoji:"🌟" },
  { id:"fashion", en:"fashion", ar:"أزياء", emoji:"👗" },
  { id:"hobby", en:"hobby", ar:"هواية", emoji:"🎨" },
  { id:"teenager", en:"teenager", ar:"مراهق", emoji:"🧑" }
];

const GAME_YOUTH = {
  id: "youth",
  emoji: "🎧",
  titleEn: "Youth Culture",
  titleAr: "ثقافة الشباب",
  character: "maya",
  introEn: "Talk about teen life and learn stative vs. action verbs!",
  introAr: "تحدث عن حياة المراهقين وتعلّم أفعال الحالة والفعل!",
  activities: [
    {
      id:"vocab", type:"vocab", character:"maya",
      tagEn:"Youth Culture Words", tagAr:"كلمات ثقافة الشباب",
      instructionsEn:"Tap a word to hear it and see its meaning.",
      instructionsAr:"اضغط على الكلمة لسماعها ومعرفة معناها.",
      words: YOUTH_VOCAB
    },
    {
      id:"teach", type:"teach", character:"maya",
      tagEn:"Stative vs. Action Verbs", tagAr:"أفعال الحالة والفعل",
      instructionsEn:"Some verbs describe a state, not an action.",
      instructionsAr:"بعض الأفعال تصف حالة، وليس فعلاً.",
      teachBlocks:[
        { pillEn:"Stative (like, want, know)",
          descEn:"These describe a state or feeling. We don't usually add -ing.", descAr:"تصف هذه حالة أو شعورًا. لا نضيف عادة -ing.",
          examples:[ { emoji:"🎵", textEn:"I like this song. (NOT: I am liking)" } ] },
        { pillEn:"Action (play, eat, study)", accent:true,
          descEn:"These describe something happening. We CAN add -ing.", descAr:"تصف هذه شيئًا يحدث. يمكننا إضافة -ing.",
          examples:[ { emoji:"🎮", textEn:"She is playing video games right now." } ] }
      ]
    },
    {
      id:"happeningnow", type:"mcq", character:"mahir",
      tagEn:"Is It Happening Now?", tagAr:"هل يحدث الآن؟",
      instructionsEn:"Choose the correct verb form.",
      instructionsAr:"اختر صيغة الفعل الصحيحة.",
      rounds:[
        { promptEn:"I ___ this song a lot.", promptAr:"أنا أحب هذه الأغنية كثيرًا.",
          options:["like","am liking"], correct:"like" },
        { promptEn:"She ___ her homework right now.", promptAr:"هي تقوم بواجبها الآن.",
          options:["is doing","does"], correct:"is doing" },
        { promptEn:"I ___ that influencer is very talented.", promptAr:"أعتقد أن ذلك المؤثر موهوب جدًا.",
          options:["think","am thinking"], correct:"think" },
        { promptEn:"They ___ out with their friends this afternoon.", promptAr:"هم يقضون الوقت مع أصدقائهم بعد الظهر.",
          options:["are hanging","hang"], correct:"are hanging" },
        { promptEn:"He ___ that new trend already.", promptAr:"هو يعرف ذلك الاتجاه الجديد بالفعل.",
          options:["knows","is knowing"], correct:"knows" },
        { promptEn:"We ___ a new playlist right now.", promptAr:"نحن نصنع قائمة تشغيل جديدة الآن.",
          options:["are making","make"], correct:"are making" }
      ]
    },
    {
      id:"match", type:"match", character:"marya",
      tagEn:"Match the Word", tagAr:"طابق الكلمة",
      instructionsEn:"Match the English word to the correct picture.",
      instructionsAr:"طابق الكلمة الإنجليزية مع الصورة الصحيحة.",
      rounds:[
        { pairs:["trend","hangout","socialmedia","playlist"].map(id=>{
            const w = YOUTH_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) },
        { pairs:["influencer","fashion","hobby","teenager"].map(id=>{
            const w = YOUTH_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) }
      ]
    },
    {
      id:"challenge", type:"mcq", character:"malik",
      tagEn:"Youth Culture Challenge", tagAr:"تحدي ثقافة الشباب",
      instructionsEn:"Choose the correct answer.",
      instructionsAr:"اختر الإجابة الصحيحة.",
      rounds:[
        { promptEn:"I ___ that this app is very useful.", promptAr:"أعتقد أن هذا التطبيق مفيد جدًا.",
          options:["believe","am believing"], correct:"believe" },
        { emoji:"🌟", promptEn:"What do we call this person?", promptAr:"ماذا نسمي هذا الشخص؟",
          options:["an influencer","a teenager","a hobby"], correct:"an influencer" },
        { promptEn:"She ___ her favorite show right now.", promptAr:"هي تشاهد برنامجها المفضل الآن.",
          options:["is watching","watches"], correct:"is watching" },
        { emoji:"🎨", promptEn:"What do we call something you enjoy doing in your free time?", promptAr:"ماذا نسمي شيئًا تستمتع بفعله في وقت فراغك؟",
          options:["a hobby","a trend","fashion"], correct:"a hobby" },
        { promptEn:"He ___ his friends want to go to the new cafe.", promptAr:"يعرف أن أصدقاءه يريدون الذهاب إلى المقهى الجديد.",
          options:["knows","is knowing"], correct:"knows" },
        { emoji:"👗", promptEn:"What do we call new styles of clothing?", promptAr:"ماذا نسمي أنماط الملابس الجديدة؟",
          options:["fashion","a hobby","social media"], correct:"fashion" }
      ]
    }
  ]
};

/* ---------- GAME 2 : WHAT AN EXPERIENCE! (Module 2) ---------- */

const EXPERIENCE_VOCAB = [
  { id:"amazing", en:"amazing", ar:"مذهل", emoji:"🤩" },
  { id:"terrifying", en:"terrifying", ar:"مرعب", emoji:"😱" },
  { id:"exhausting", en:"exhausting", ar:"مرهق", emoji:"😫" },
  { id:"thrilling", en:"thrilling", ar:"مثير", emoji:"🎢" },
  { id:"boring", en:"boring", ar:"مملّ", emoji:"🥱" },
  { id:"unforgettable", en:"unforgettable", ar:"لا يُنسى", emoji:"💫" },
  { id:"disappointing", en:"disappointing", ar:"مخيّب للآمال", emoji:"😞" },
  { id:"relaxing", en:"relaxing", ar:"مريح", emoji:"🧘" }
];

const GAME_EXPERIENCE = {
  id: "experience",
  emoji: "🎢",
  titleEn: "What an Experience!",
  titleAr: "يا لها من تجربة!",
  character: "mahir",
  introEn: "Tell exciting stories using the past simple and past continuous!",
  introAr: "احكِ قصصًا مثيرة باستخدام الماضي البسيط والماضي المستمر!",
  activities: [
    {
      id:"vocab", type:"vocab", character:"mahir",
      tagEn:"Experience Words", tagAr:"كلمات التجربة",
      instructionsEn:"Tap a word to hear it and see its meaning.",
      instructionsAr:"اضغط على الكلمة لسماعها ومعرفة معناها.",
      words: EXPERIENCE_VOCAB
    },
    {
      id:"teach", type:"teach", character:"maya",
      tagEn:"Past Simple vs. Past Continuous", tagAr:"الماضي البسيط والماضي المستمر",
      instructionsEn:"How do we tell a story with two things happening?",
      instructionsAr:"كيف نروي قصة فيها حدثان يحدثان معًا؟",
      teachBlocks:[
        { pillEn:"Was/Were + -ing",
          descEn:"Use the past continuous for the longer action in progress.", descAr:"استخدم الماضي المستمر للفعل الأطول الذي كان مستمرًا.",
          examples:[ { emoji:"🚶", textEn:"I was walking home..." } ] },
        { pillEn:"Simple Past interrupts", accent:true,
          descEn:"Use the simple past for the shorter action that interrupted it.", descAr:"استخدم الماضي البسيط للفعل الأقصر الذي قاطعه.",
          examples:[ { emoji:"🌧️", textEn:"...when it started to rain." } ] }
      ]
    },
    {
      id:"whathappened", type:"mcq", character:"marya",
      tagEn:"What Happened?", tagAr:"ماذا حدث؟",
      instructionsEn:"Choose the correct verb form.",
      instructionsAr:"اختر صيغة الفعل الصحيحة.",
      rounds:[
        { promptEn:"I ___ home when it started to rain.", promptAr:"كنت أمشي إلى البيت عندما بدأ المطر.",
          options:["was walking","walked"], correct:"was walking" },
        { promptEn:"While she ___, the phone rang.", promptAr:"بينما كانت تدرس، رنّ الهاتف.",
          options:["was studying","studied"], correct:"was studying" },
        { promptEn:"We ___ dinner when the lights went out.", promptAr:"كنا نأكل العشاء عندما انطفأت الأضواء.",
          options:["were eating","ate"], correct:"were eating" },
        { promptEn:"He ___ when he saw the amazing view.", promptAr:"توقف عندما رأى المنظر المذهل.",
          options:["stopped","was stopping"], correct:"stopped" },
        { promptEn:"They ___ on the beach when the storm began.", promptAr:"كانوا يلعبون على الشاطئ عندما بدأت العاصفة.",
          options:["were playing","played"], correct:"were playing" },
        { promptEn:"I ___ a strange noise while I was sleeping.", promptAr:"سمعت صوتًا غريبًا بينما كنت نائمًا.",
          options:["heard","was hearing"], correct:"heard" }
      ]
    },
    {
      id:"describe", type:"mcq", character:"malik",
      tagEn:"Describe the Experience", tagAr:"صف التجربة",
      instructionsEn:"Choose the best word.",
      instructionsAr:"اختر أفضل كلمة.",
      rounds:[
        { emoji:"🎢", promptEn:"The roller coaster ride was ___!", promptAr:"كانت رحلة الأفعوانية ___!",
          options:["thrilling","boring","relaxing"], correct:"thrilling" },
        { emoji:"😱", promptEn:"The horror movie was ___.", promptAr:"كان فيلم الرعب ___.",
          options:["terrifying","relaxing","boring"], correct:"terrifying" },
        { emoji:"🧘", promptEn:"The vacation at the beach was so ___.", promptAr:"كانت الإجازة على الشاطئ ___ جدًا.",
          options:["relaxing","exhausting","terrifying"], correct:"relaxing" },
        { emoji:"😫", promptEn:"After the long hike, I felt ___.", promptAr:"بعد المشي الطويل، شعرت بالإرهاق.",
          options:["exhausted","relaxed","bored"], correct:"exhausted" },
        { emoji:"😞", promptEn:"The game was cancelled — what a ___ day!", promptAr:"أُلغيت المباراة — يا له من يوم مخيّب للآمال!",
          options:["disappointing","amazing","thrilling"], correct:"disappointing" },
        { emoji:"💫", promptEn:"Our trip to the mountains was ___ — I'll never forget it.", promptAr:"كانت رحلتنا إلى الجبال لا تُنسى — لن أنساها أبدًا.",
          options:["unforgettable","boring","disappointing"], correct:"unforgettable" }
      ]
    },
    {
      id:"match", type:"match", character:"mahir",
      tagEn:"Match the Experience Word", tagAr:"طابق كلمة التجربة",
      instructionsEn:"Match the English word to the correct picture.",
      instructionsAr:"طابق الكلمة الإنجليزية مع الصورة الصحيحة.",
      rounds:[
        { pairs:["amazing","terrifying","exhausting","thrilling"].map(id=>{
            const w = EXPERIENCE_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) },
        { pairs:["boring","unforgettable","disappointing","relaxing"].map(id=>{
            const w = EXPERIENCE_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) }
      ]
    }
  ]
};

/* ---------- GAME 3 : GOING PLACES (Module 3) ---------- */

const TRAVEL_VOCAB = [
  { id:"airport", en:"airport", ar:"مطار", emoji:"🛫" },
  { id:"passport", en:"passport", ar:"جواز سفر", emoji:"📔" },
  { id:"luggage", en:"luggage", ar:"أمتعة", emoji:"🧳" },
  { id:"boardingpass", en:"boarding pass", ar:"بطاقة صعود الطائرة", emoji:"🎫" },
  { id:"delay", en:"delay", ar:"تأخير", emoji:"⏱️" },
  { id:"gate", en:"gate", ar:"بوابة", emoji:"🚪" },
  { id:"ticket", en:"ticket", ar:"تذكرة", emoji:"🎟️" },
  { id:"journey", en:"journey", ar:"رحلة", emoji:"🗺️" }
];

const GAME_TRAVEL = {
  id: "travel",
  emoji: "✈️",
  titleEn: "Going Places",
  titleAr: "في الطريق",
  character: "marya",
  introEn: "Learn the words you need at the airport!",
  introAr: "تعلّم الكلمات التي تحتاجها في المطار!",
  activities: [
    {
      id:"vocab", type:"vocab", character:"marya",
      tagEn:"Travel Words", tagAr:"كلمات السفر",
      instructionsEn:"Tap a word to hear it and see its meaning.",
      instructionsAr:"اضغط على الكلمة لسماعها ومعرفة معناها.",
      words: TRAVEL_VOCAB
    },
    {
      id:"match", type:"match", character:"mahir",
      tagEn:"Match the Travel Word", tagAr:"طابق كلمة السفر",
      instructionsEn:"Match the English word to the correct picture.",
      instructionsAr:"طابق الكلمة الإنجليزية مع الصورة الصحيحة.",
      rounds:[
        { pairs:["airport","passport","luggage","boardingpass"].map(id=>{
            const w = TRAVEL_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) },
        { pairs:["delay","gate","ticket","journey"].map(id=>{
            const w = TRAVEL_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) }
      ]
    },
    {
      id:"attheairport", type:"mcq", character:"maya",
      tagEn:"At the Airport", tagAr:"في المطار",
      instructionsEn:"Choose the correct word.",
      instructionsAr:"اختر الكلمة الصحيحة.",
      rounds:[
        { promptEn:"You need this to get on the plane, showing your seat number.", promptAr:"تحتاج هذا لتصعد الطائرة، وتُظهر رقم مقعدك.",
          options:["a boarding pass","a passport","luggage"], correct:"a boarding pass" },
        { promptEn:"You need this document to travel to another country.", promptAr:"تحتاج هذه الوثيقة للسفر إلى دولة أخرى.",
          options:["a passport","a ticket","a gate"], correct:"a passport" },
        { promptEn:"Your suitcases and bags are called your ___.", promptAr:"تُسمى حقائبك وأمتعتك ___.",
          options:["luggage","a journey","a delay"], correct:"luggage" },
        { promptEn:"The flight is late — there is a ___.", promptAr:"الرحلة متأخرة — هناك ___.",
          options:["delay","gate","ticket"], correct:"delay" },
        { promptEn:"You wait here before boarding the plane.", promptAr:"تنتظر هنا قبل صعود الطائرة.",
          options:["the gate","the luggage","the passport"], correct:"the gate" },
        { promptEn:"A long trip from one place to another is called a ___.", promptAr:"تُسمى الرحلة الطويلة من مكان إلى آخر ___.",
          options:["journey","delay","gate"], correct:"journey" }
      ]
    },
    {
      id:"challenge", type:"mcq", character:"malik",
      tagEn:"Travel Challenge", tagAr:"تحدي السفر",
      instructionsEn:"Choose the correct answer.",
      instructionsAr:"اختر الإجابة الصحيحة.",
      rounds:[
        { emoji:"🛫", promptEn:"Where do you check in for your flight?", promptAr:"أين تسجل دخولك لرحلتك؟",
          options:["the airport","the gate","the journey"], correct:"the airport" },
        { promptEn:"I bought my ___ online before the trip.", promptAr:"اشتريت تذكرتي عبر الإنترنت قبل الرحلة.",
          options:["ticket","gate","delay"], correct:"ticket" },
        { emoji:"🧳", promptEn:"What do we call your bags and suitcases?", promptAr:"ماذا نسمي حقائبك؟",
          options:["luggage","a passport","a ticket"], correct:"luggage" },
        { promptEn:"Our flight had a two-hour ___ because of the weather.", promptAr:"كان لرحلتنا تأخير لمدة ساعتين بسبب الطقس.",
          options:["delay","gate","journey"], correct:"delay" },
        { emoji:"📔", promptEn:"What do you show at passport control?", promptAr:"ماذا تُظهر عند مراقبة الجوازات؟",
          options:["your passport","your luggage","your gate"], correct:"your passport" },
        { promptEn:"Our ___ to Makkah took five hours by car.", promptAr:"استغرقت رحلتنا إلى مكة خمس ساعات بالسيارة.",
          options:["journey","gate","delay"], correct:"journey" }
      ]
    },
    {
      id:"buildsentence", type:"order", character:"mahir", orderMode:"words",
      tagEn:"Build the Sentence", tagAr:"كوّن الجملة",
      instructionsEn:"Drag the words into the correct order.",
      instructionsAr:"اسحب الكلمات بالترتيب الصحيح.",
      rounds:[
        { items:["I","need","my","passport","and","ticket"].map((w,i)=>({id:"gp1_"+i, labelEn:w})) },
        { items:["Our","flight","has","a","two","hour","delay"].map((w,i)=>({id:"gp2_"+i, labelEn:w})) },
        { items:["The","gate","closes","in","ten","minutes"].map((w,i)=>({id:"gp3_"+i, labelEn:w})) },
        { items:["She","packed","her","luggage","last","night"].map((w,i)=>({id:"gp4_"+i, labelEn:w})) }
      ]
    }
  ]
};

/* ---------- GAME 4 : WILL VS GOING TO (Module 3, future forms) ---------- */

const GAME_FUTURE = {
  id: "future",
  emoji: "🔮",
  titleEn: "Will vs. Going To",
  titleAr: "will أم going to؟",
  character: "malik",
  introEn: "Learn two ways to talk about the future!",
  introAr: "تعلّم طريقتين للحديث عن المستقبل!",
  activities: [
    {
      id:"teach", type:"teach", character:"maya",
      tagEn:"Will vs. Going To", tagAr:"will أم going to؟",
      instructionsEn:"How do we talk about the future?",
      instructionsAr:"كيف نتحدث عن المستقبل؟",
      teachBlocks:[
        { pillEn:"Going to",
          descEn:"Use going to for plans you already decided.", descAr:"استخدم going to للخطط التي قررتها بالفعل.",
          examples:[ { emoji:"🗓️", textEn:"I am going to visit my grandmother this weekend." } ] },
        { pillEn:"Will", accent:true,
          descEn:"Use will for predictions, or decisions made right now.", descAr:"استخدم will للتوقعات، أو للقرارات التي تُتخذ الآن.",
          examples:[ { emoji:"🌧️", textEn:"I think it will rain tomorrow." } ] }
      ]
    },
    {
      id:"planorprediction", type:"mcq", character:"mahir",
      tagEn:"Plan or Prediction?", tagAr:"خطة أم توقع؟",
      instructionsEn:"Choose the correct form.",
      instructionsAr:"اختر الصيغة الصحيحة.",
      rounds:[
        { promptEn:"I ___ visit my grandmother this weekend. (already planned)", promptAr:"سأزور جدتي في نهاية الأسبوع. (مخطط له مسبقًا)",
          options:["am going to","will"], correct:"am going to" },
        { promptEn:"I think it ___ rain tomorrow. (prediction)", promptAr:"أعتقد أنها ستمطر غدًا. (توقع)",
          options:["will","is going to"], correct:"will" },
        { promptEn:"We ___ travel to Jeddah next month. (already booked tickets)", promptAr:"سنسافر إلى جدة الشهر القادم. (حجزنا التذاكر بالفعل)",
          options:["are going to","will"], correct:"are going to" },
        { promptEn:"The phone is ringing — I ___ answer it. (decision now)", promptAr:"الهاتف يرن — سأرد عليه. (قرار الآن)",
          options:["will","am going to"], correct:"will" },
        { promptEn:"She ___ start a new job next week. (already arranged)", promptAr:"ستبدأ وظيفة جديدة الأسبوع القادم. (مرتّب بالفعل)",
          options:["is going to","will"], correct:"is going to" },
        { promptEn:"I'm thirsty — I ___ get some water. (decision now)", promptAr:"أنا عطشان — سأحضر بعض الماء. (قرار الآن)",
          options:["will","am going to"], correct:"will" }
      ]
    },
    {
      id:"morepractice", type:"mcq", character:"marya",
      tagEn:"Going To or Will?", tagAr:"going to أم will؟",
      instructionsEn:"Choose the correct form.",
      instructionsAr:"اختر الصيغة الصحيحة.",
      rounds:[
        { promptEn:"Look at those clouds — it ___ rain soon!", promptAr:"انظر إلى تلك الغيوم — ستمطر قريبًا!",
          options:["is going to","will"], correct:"is going to" },
        { promptEn:"I promise I ___ help you tomorrow.", promptAr:"أعدك أنني سأساعدك غدًا.",
          options:["will","am going to"], correct:"will" },
        { promptEn:"We have our tickets — we ___ fly to Makkah on Friday.", promptAr:"لدينا التذاكر — سنطير إلى مكة يوم الجمعة.",
          options:["are going to","will"], correct:"are going to" },
        { promptEn:"Maybe I ___ study medicine in the future.", promptAr:"ربما سأدرس الطب في المستقبل.",
          options:["will","am going to"], correct:"will" },
        { promptEn:"He has already packed his bags — he ___ leave tonight.", promptAr:"لقد حزم حقائبه بالفعل — سيغادر الليلة.",
          options:["is going to","will"], correct:"is going to" },
        { promptEn:"Don't worry, I ___ carry your luggage for you.", promptAr:"لا تقلق، سأحمل أمتعتك من أجلك.",
          options:["will","am going to"], correct:"will" }
      ]
    },
    {
      id:"buildsentence", type:"order", character:"malik", orderMode:"words",
      tagEn:"Build the Sentence", tagAr:"كوّن الجملة",
      instructionsEn:"Drag the words into the correct order.",
      instructionsAr:"اسحب الكلمات بالترتيب الصحيح.",
      rounds:[
        { items:["I","am","going","to","visit","Makkah"].map((w,i)=>({id:"fu1_"+i, labelEn:w})) },
        { items:["I","think","it","will","rain","tomorrow"].map((w,i)=>({id:"fu2_"+i, labelEn:w})) },
        { items:["We","are","going","to","travel","next","month"].map((w,i)=>({id:"fu3_"+i, labelEn:w})) },
        { items:["I","will","help","you","now"].map((w,i)=>({id:"fu4_"+i, labelEn:w})) }
      ]
    },
    {
      id:"challenge", type:"mcq", character:"maya",
      tagEn:"Future Challenge", tagAr:"تحدي المستقبل",
      instructionsEn:"Choose the correct answer.",
      instructionsAr:"اختر الإجابة الصحيحة.",
      rounds:[
        { promptEn:"I've already bought a ticket — I ___ go to the concert.", promptAr:"اشتريت تذكرة بالفعل — سأذهب إلى الحفلة.",
          options:["am going to","will"], correct:"am going to" },
        { promptEn:"The sky is very dark — I think it ___ storm.", promptAr:"السماء مظلمة جدًا — أعتقد أنها ستعصف.",
          options:["is going to","will"], correct:"is going to" },
        { promptEn:"I'm not sure yet, but maybe I ___ visit Japan someday.", promptAr:"لست متأكدًا بعد، لكن ربما سأزور اليابان يومًا ما.",
          options:["will","am going to"], correct:"will" },
        { promptEn:"She has her bags packed — she ___ leave in an hour.", promptAr:"حزمت حقائبها — ستغادر خلال ساعة.",
          options:["is going to","will"], correct:"is going to" },
        { promptEn:"The bell is ringing — I ___ answer the door.", promptAr:"الجرس يرن — سأفتح الباب.",
          options:["will","am going to"], correct:"will" },
        { promptEn:"They have booked the hotel — they ___ stay in Riyadh.", promptAr:"حجزوا الفندق — سيبقون في الرياض.",
          options:["are going to","will"], correct:"are going to" }
      ]
    }
  ]
};

/* ---------- GAME 5 : NOWADAYS (Module 4) ---------- */

const TECH_VOCAB = [
  { id:"smartphone", en:"smartphone", ar:"هاتف ذكي", emoji:"📱" },
  { id:"app", en:"app", ar:"تطبيق", emoji:"📲" },
  { id:"wifi", en:"wifi", ar:"واي فاي", emoji:"📶" },
  { id:"screen", en:"screen", ar:"شاشة", emoji:"🖥️" },
  { id:"download", en:"download", ar:"تحميل", emoji:"⬇️" },
  { id:"gadget", en:"gadget", ar:"جهاز إلكتروني", emoji:"⌚" },
  { id:"camera", en:"camera", ar:"كاميرا", emoji:"📷" },
  { id:"battery", en:"battery", ar:"بطارية", emoji:"🔋" }
];

const GAME_NOWADAYS = {
  id: "nowadays",
  emoji: "💻",
  titleEn: "Nowadays",
  titleAr: "في هذه الأيام",
  character: "malik",
  introEn: "Learn technology words and how to compare past and present!",
  introAr: "تعلّم كلمات التقنية وكيف تقارن بين الماضي والحاضر!",
  activities: [
    {
      id:"vocab", type:"vocab", character:"malik",
      tagEn:"Technology Words", tagAr:"كلمات التقنية",
      instructionsEn:"Tap a word to hear it and see its meaning.",
      instructionsAr:"اضغط على الكلمة لسماعها ومعرفة معناها.",
      words: TECH_VOCAB
    },
    {
      id:"teach", type:"teach", character:"maya",
      tagEn:"Used To", tagAr:"used to",
      instructionsEn:"How do we talk about past habits that are no longer true?",
      instructionsAr:"كيف نتحدث عن عادات ماضية لم تعد صحيحة؟",
      teachBlocks:[
        { pillEn:"Used to + verb",
          descEn:"Use used to for something that was true in the past, but isn't now.", descAr:"استخدم used to لشيء كان صحيحًا في الماضي، لكنه لم يعد كذلك.",
          examples:[ { emoji:"✉️", textEn:"People used to write letters. Now they send texts." } ] }
      ]
    },
    {
      id:"usedtoornot", type:"mcq", character:"mahir",
      tagEn:"Used To or Not?", tagAr:"used to أم لا؟",
      instructionsEn:"Choose the correct sentence.",
      instructionsAr:"اختر الجملة الصحيحة.",
      rounds:[
        { promptEn:"People ___ watch TV without a remote control.", promptAr:"كان الناس يشاهدون التلفاز بدون جهاز تحكم عن بعد.",
          options:["used to","use to"], correct:"used to" },
        { promptEn:"I ___ play outside every day, but now I use my phone a lot.", promptAr:"كنت ألعب في الخارج كل يوم، لكن الآن أستخدم هاتفي كثيرًا.",
          options:["used to","use to"], correct:"used to" },
        { promptEn:"We ___ have wifi at home, and we still do.", promptAr:"لدينا واي فاي في المنزل، وما زال لدينا.",
          options:["have","used to have"], correct:"have" },
        { promptEn:"My grandfather ___ send letters instead of emails.", promptAr:"كان جدي يرسل الرسائل بدلاً من البريد الإلكتروني.",
          options:["used to","uses to"], correct:"used to" },
        { promptEn:"Cameras ___ use film, but now most are digital.", promptAr:"كانت الكاميرات تستخدم الفيلم، لكن معظمها رقمي الآن.",
          options:["used to","use to"], correct:"used to" },
        { promptEn:"I ___ a smartphone now, and I use it every day.", promptAr:"لدي هاتف ذكي الآن، وأستخدمه كل يوم.",
          options:["have","used to have"], correct:"have" }
      ]
    },
    {
      id:"thenandnow", type:"mcq", character:"marya",
      tagEn:"Then and Now", tagAr:"قديمًا والآن",
      instructionsEn:"Choose the correct answer.",
      instructionsAr:"اختر الإجابة الصحيحة.",
      rounds:[
        { promptEn:"To find information, people ___ go to the library. Now they search online.", promptAr:"لإيجاد المعلومات، كان الناس يذهبون إلى المكتبة. الآن يبحثون عبر الإنترنت.",
          options:["used to","use to"], correct:"used to" },
        { promptEn:"You need ___ to connect your phone to the internet at home.", promptAr:"تحتاج الواي فاي لتوصيل هاتفك بالإنترنت في المنزل.",
          options:["wifi","a battery"], correct:"wifi" },
        { promptEn:"My phone's ___ is low — I need to charge it.", promptAr:"بطارية هاتفي منخفضة — أحتاج أن أشحنها.",
          options:["battery","screen"], correct:"battery" },
        { promptEn:"I need to ___ this app before I can use it.", promptAr:"أحتاج أن أحمّل هذا التطبيق قبل أن أستخدمه.",
          options:["download","screen"], correct:"download" },
        { promptEn:"A smartwatch is a small ___ you wear on your wrist.", promptAr:"الساعة الذكية جهاز صغير ترتديه على معصمك.",
          options:["gadget","camera"], correct:"gadget" },
        { promptEn:"I take photos with the ___ on my phone.", promptAr:"ألتقط الصور بكاميرا هاتفي.",
          options:["camera","screen"], correct:"camera" }
      ]
    },
    {
      id:"challenge", type:"mcq", character:"malik",
      tagEn:"Nowadays Challenge", tagAr:"تحدي هذه الأيام",
      instructionsEn:"Choose the correct answer.",
      instructionsAr:"اختر الإجابة الصحيحة.",
      rounds:[
        { promptEn:"People ___ write with pen and paper more than they do now.", promptAr:"كان الناس يكتبون بالقلم والورق أكثر مما يفعلون الآن.",
          options:["used to","use to"], correct:"used to" },
        { emoji:"🖥️", promptEn:"What do we call this part of a phone or computer?", promptAr:"ماذا نسمي هذا الجزء من الهاتف أو الكمبيوتر؟",
          options:["a screen","a battery","an app"], correct:"a screen" },
        { promptEn:"My phone ___ a lot of storage now.", promptAr:"هاتفي لديه الكثير من التخزين الآن.",
          options:["has","used to have"], correct:"has" },
        { emoji:"📲", promptEn:"What do we call a program you use on your phone?", promptAr:"ماذا نسمي برنامجًا تستخدمه على هاتفك؟",
          options:["an app","a battery","a gadget"], correct:"an app" },
        { promptEn:"We ___ use maps on paper — now we use GPS.", promptAr:"كنا نستخدم الخرائط الورقية — الآن نستخدم نظام تحديد المواقع.",
          options:["used to","use to"], correct:"used to" },
        { emoji:"🔋", promptEn:"What powers your phone?", promptAr:"ما الذي يشغّل هاتفك؟",
          options:["a battery","a screen","an app"], correct:"a battery" }
      ]
    }
  ]
};

const ALL_GAMES = [GAME_YOUTH, GAME_EXPERIENCE, GAME_TRAVEL, GAME_FUTURE, GAME_NOWADAYS];
