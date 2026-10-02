/* ===========================================================
   Maha Academy — Content Data (Grade 11 English)
   Based on the "Traveller 3" modules (ثاني ثانوي):
     Module 1  Window on the World -> Window on the World
     Module 2  Heroes              -> Heroes
     Module 3  Work & Leisure      -> Work & Careers / Modal Mysteries
     Module 4  Planet Earth        -> Planet Earth
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

/* ---------- GAME 1 : WINDOW ON THE WORLD (Module 1) ---------- */

const WINDOW_VOCAB = [
  { id:"custom", en:"custom", ar:"عادة", emoji:"🎎" },
  { id:"tradition", en:"tradition", ar:"تقليد", emoji:"🏺" },
  { id:"greeting", en:"greeting", ar:"تحية", emoji:"🤝" },
  { id:"etiquette", en:"etiquette", ar:"آداب السلوك", emoji:"🎩" },
  { id:"heritage", en:"heritage", ar:"تراث", emoji:"🏛️" },
  { id:"global", en:"global", ar:"عالمي", emoji:"🌐" },
  { id:"diverse", en:"diverse", ar:"متنوع", emoji:"🌈" },
  { id:"homeland", en:"homeland", ar:"وطن", emoji:"🏠" }
];

const GAME_WINDOW = {
  id: "window",
  emoji: "🌍",
  titleEn: "Window on the World",
  titleAr: "نافذة على العالم",
  character: "mahir",
  introEn: "Explore cultures and customs, and learn to ask questions politely!",
  introAr: "استكشف الثقافات والعادات، وتعلّم كيف تسأل بأدب!",
  activities: [
    {
      id:"vocab", type:"vocab", character:"mahir",
      tagEn:"Culture Words", tagAr:"كلمات الثقافة",
      instructionsEn:"Tap a word to hear it and see its meaning.",
      instructionsAr:"اضغط على الكلمة لسماعها ومعرفة معناها.",
      words: WINDOW_VOCAB
    },
    {
      id:"teach", type:"teach", character:"maya",
      tagEn:"Direct vs. Indirect Questions", tagAr:"الأسئلة المباشرة وغير المباشرة",
      instructionsEn:"How do we ask a question politely?",
      instructionsAr:"كيف نطرح سؤالاً بأدب؟",
      teachBlocks:[
        { pillEn:"Direct Question",
          descEn:"We ask directly, with the question word first and the verb before the subject.", descAr:"نسأل مباشرة، بكلمة السؤال أولاً ثم الفعل قبل الفاعل.",
          examples:[ { emoji:"❓", textEn:"Where is the museum?" } ] },
        { pillEn:"Indirect Question", accent:true,
          descEn:"We ask politely inside another sentence. The word order stays like a normal statement — no question order.", descAr:"نسأل بأدب داخل جملة أخرى. يبقى ترتيب الكلمات كجملة عادية — بدون قلب.",
          examples:[ { emoji:"🙏", textEn:"Could you tell me where the museum is?" } ] }
      ]
    },
    {
      id:"askpolitely", type:"mcq", character:"mahir",
      tagEn:"Ask It Politely", tagAr:"اسأل بأدب",
      instructionsEn:"Choose the correct word to complete the polite question.",
      instructionsAr:"اختر الكلمة الصحيحة لإكمال السؤال المهذب.",
      rounds:[
        { promptEn:"Do you know ___ the bank opens?", promptAr:"هل تعرف متى يفتح البنك؟",
          options:["when","when does"], correct:"when" },
        { promptEn:"Could you tell me ___ this word means?", promptAr:"هل يمكنك أن تخبرني ماذا تعني هذه الكلمة؟",
          options:["what","what does"], correct:"what" },
        { promptEn:"I wonder ___ she is from.", promptAr:"أتساءل من أين هي.",
          options:["where","where is"], correct:"where" },
        { promptEn:"Do you know ___ time it is?", promptAr:"هل تعرف كم الساعة؟",
          options:["what","what is"], correct:"what" },
        { promptEn:"Can you tell me ___ the museum closes?", promptAr:"هل يمكنك إخباري متى يغلق المتحف؟",
          options:["when","when does"], correct:"when" },
        { promptEn:"I'd like to know ___ you are from.", promptAr:"أود أن أعرف من أين أنت.",
          options:["where","where are"], correct:"where" }
      ]
    },
    {
      id:"match", type:"match", character:"marya",
      tagEn:"Match the Culture Word", tagAr:"طابق كلمة الثقافة",
      instructionsEn:"Match the English word to the correct picture.",
      instructionsAr:"طابق الكلمة الإنجليزية مع الصورة الصحيحة.",
      rounds:[
        { pairs:["custom","tradition","greeting","etiquette"].map(id=>{
            const w = WINDOW_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) },
        { pairs:["heritage","global","diverse","homeland"].map(id=>{
            const w = WINDOW_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) }
      ]
    },
    {
      id:"buildquestion", type:"order", character:"marya", orderMode:"words",
      tagEn:"Build the Polite Question", tagAr:"كوّن السؤال المهذب",
      instructionsEn:"Drag the words into the correct order.",
      instructionsAr:"اسحب الكلمات بالترتيب الصحيح.",
      rounds:[
        { items:["Could","you","tell","me","where","the","bank","is"].map((w,i)=>({id:"wq1_"+i, labelEn:w})) },
        { items:["Do","you","know","what","time","it","is"].map((w,i)=>({id:"wq2_"+i, labelEn:w})) },
        { items:["I","wonder","why","he","is","late"].map((w,i)=>({id:"wq3_"+i, labelEn:w})) },
        { items:["Can","you","tell","me","how","much","it","costs"].map((w,i)=>({id:"wq4_"+i, labelEn:w})) }
      ]
    },
    {
      id:"challenge", type:"mcq", character:"malik",
      tagEn:"Window on the World Challenge", tagAr:"تحدي نافذة على العالم",
      instructionsEn:"Choose the correct answer.",
      instructionsAr:"اختر الإجابة الصحيحة.",
      rounds:[
        { promptEn:"I ___ live in a small village, but now I live in a city.", promptAr:"كنت أعيش في قرية صغيرة، لكن الآن أعيش في مدينة.",
          options:["used to","am used to"], correct:"used to" },
        { promptEn:"After three years here, I ___ the traffic now.", promptAr:"بعد ثلاث سنوات هنا، اعتدت على الازدحام الآن.",
          options:["am used to","used to"], correct:"am used to" },
        { promptEn:"Do you know ___ this custom started?", promptAr:"هل تعرف متى بدأ هذا التقليد؟",
          options:["when","when did"], correct:"when" },
        { emoji:"🤝", promptEn:"What do we call the way we say hello to someone?", promptAr:"ماذا نسمي طريقة إلقاء التحية على شخص؟",
          options:["a greeting","a custom","heritage"], correct:"a greeting" },
        { promptEn:"She ___ eat rice every day when she was a child.", promptAr:"كانت تأكل الأرز كل يوم عندما كانت طفلة.",
          options:["used to","is used to"], correct:"used to" },
        { emoji:"🌐", promptEn:"What do we call something that involves the whole world?", promptAr:"ماذا نسمي شيئًا يخص العالم كله؟",
          options:["global","diverse","homeland"], correct:"global" }
      ]
    }
  ]
};

/* ---------- GAME 2 : HEROES (Module 2) ---------- */

const HEROES_VOCAB = [
  { id:"earthquake", en:"earthquake", ar:"زلزال", emoji:"🏚️" },
  { id:"flood", en:"flood", ar:"فيضان", emoji:"🌊" },
  { id:"rescue", en:"rescue", ar:"إنقاذ", emoji:"🚁" },
  { id:"brave", en:"brave", ar:"شجاع", emoji:"🦁" },
  { id:"survivor", en:"survivor", ar:"ناجٍ", emoji:"🙌" },
  { id:"disaster", en:"disaster", ar:"كارثة", emoji:"⚠️" },
  { id:"volunteer", en:"volunteer", ar:"متطوع", emoji:"🙋" },
  { id:"courage", en:"courage", ar:"شجاعة", emoji:"💪" }
];

const GAME_HEROES = {
  id: "heroes",
  emoji: "🦸",
  titleEn: "Heroes",
  titleAr: "أبطال",
  character: "maya",
  introEn: "Meet everyday heroes and learn to describe them with relative clauses!",
  introAr: "تعرّف على أبطال الحياة اليومية وتعلّم وصفهم بجمل الوصل!",
  activities: [
    {
      id:"vocab", type:"vocab", character:"maya",
      tagEn:"Hero Words", tagAr:"كلمات الأبطال",
      instructionsEn:"Tap a word to hear it and see its meaning.",
      instructionsAr:"اضغط على الكلمة لسماعها ومعرفة معناها.",
      words: HEROES_VOCAB
    },
    {
      id:"teach", type:"teach", character:"mahir",
      tagEn:"Relative Clauses: who / which / that", tagAr:"جمل الوصل: who / which / that",
      instructionsEn:"How do we add extra information about a person or thing?",
      instructionsAr:"كيف نضيف معلومة إضافية عن شخص أو شيء؟",
      teachBlocks:[
        { pillEn:"WHO (for people)",
          descEn:"Use who to add information about a person.", descAr:"استخدم who لإضافة معلومة عن شخص.",
          examples:[ { emoji:"🦸", textEn:"The man who saved the child is a hero." } ] },
        { pillEn:"WHICH / THAT (for things)", accent:true,
          descEn:"Use which or that to add information about a thing.", descAr:"استخدم which أو that لإضافة معلومة عن شيء.",
          examples:[ { emoji:"🚁", textEn:"The helicopter that rescued them arrived fast." } ] }
      ]
    },
    {
      id:"relativepronoun", type:"mcq", character:"mahir",
      tagEn:"Choose the Relative Pronoun", tagAr:"اختر ضمير الوصل",
      instructionsEn:"Choose who or that.",
      instructionsAr:"اختر who أو that.",
      rounds:[
        { promptEn:"The firefighter ___ saved the family is a real hero.", promptAr:"رجل الإطفاء الذي أنقذ العائلة بطل حقيقي.",
          options:["who","that"], correct:"who" },
        { promptEn:"The flood ___ hit the village destroyed many homes.", promptAr:"الفيضان الذي ضرب القرية دمّر منازل كثيرة.",
          options:["that","who"], correct:"that" },
        { promptEn:"The volunteers ___ helped after the earthquake worked all night.", promptAr:"المتطوعون الذين ساعدوا بعد الزلزال عملوا طوال الليل.",
          options:["who","that"], correct:"who" },
        { promptEn:"The boat ___ rescued the survivors arrived just in time.", promptAr:"القارب الذي أنقذ الناجين وصل في الوقت المناسب.",
          options:["that","who"], correct:"that" },
        { promptEn:"The woman ___ called for help saved her neighbor's life.", promptAr:"المرأة التي اتصلت طلبًا للمساعدة أنقذت حياة جارتها.",
          options:["who","that"], correct:"who" },
        { promptEn:"The storm ___ hit the coast was the worst in years.", promptAr:"العاصفة التي ضربت الساحل كانت الأسوأ منذ سنوات.",
          options:["that","who"], correct:"that" }
      ]
    },
    {
      id:"duringthedisaster", type:"mcq", character:"marya",
      tagEn:"What Was Happening?", tagAr:"ماذا كان يحدث؟",
      instructionsEn:"Choose the correct verb form.",
      instructionsAr:"اختر صيغة الفعل الصحيحة.",
      rounds:[
        { promptEn:"The ground ___ when the earthquake started.", promptAr:"كانت الأرض تهتز عندما بدأ الزلزال.",
          options:["was shaking","shook"], correct:"was shaking" },
        { promptEn:"They ___ the rescue team when the water reached the door.", promptAr:"كانوا ينتظرون فريق الإنقاذ عندما وصل الماء إلى الباب.",
          options:["were waiting for","waited for"], correct:"were waiting for" },
        { promptEn:"A volunteer ___ the child while the storm continued.", promptAr:"أنقذ متطوع الطفل بينما استمرت العاصفة.",
          options:["rescued","was rescuing"], correct:"rescued" },
        { promptEn:"We ___ on the roof when the helicopter arrived.", promptAr:"كنا ننتظر على السطح عندما وصلت الطائرة المروحية.",
          options:["were waiting","waited"], correct:"were waiting" },
        { promptEn:"The survivor ___ for three days before help came.", promptAr:"صمد الناجي ثلاثة أيام قبل وصول المساعدة.",
          options:["survived","was surviving"], correct:"survived" },
        { promptEn:"Everyone ___ when the alarm suddenly rang.", promptAr:"كان الجميع نائمين عندما رنّ الجرس فجأة.",
          options:["was sleeping","slept"], correct:"was sleeping" }
      ]
    },
    {
      id:"match", type:"match", character:"marya",
      tagEn:"Match the Hero Word", tagAr:"طابق كلمة الأبطال",
      instructionsEn:"Match the English word to the correct picture.",
      instructionsAr:"طابق الكلمة الإنجليزية مع الصورة الصحيحة.",
      rounds:[
        { pairs:["earthquake","flood","rescue","brave"].map(id=>{
            const w = HEROES_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) },
        { pairs:["survivor","disaster","volunteer","courage"].map(id=>{
            const w = HEROES_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) }
      ]
    },
    {
      id:"challenge", type:"mcq", character:"malik",
      tagEn:"Heroes Challenge", tagAr:"تحدي الأبطال",
      instructionsEn:"Choose the correct answer.",
      instructionsAr:"اختر الإجابة الصحيحة.",
      rounds:[
        { promptEn:"The nurse ___ treated the survivors worked for two days straight.", promptAr:"الممرضة التي عالجت الناجين عملت يومين متواصلين.",
          options:["who","that"], correct:"who" },
        { emoji:"💪", promptEn:"What do we call the quality a hero shows when facing danger?", promptAr:"ماذا نسمي الصفة التي يظهرها البطل عند مواجهة الخطر؟",
          options:["courage","disaster","rescue"], correct:"courage" },
        { promptEn:"The bridge ___ collapsed was very old.", promptAr:"الجسر الذي انهار كان قديمًا جدًا.",
          options:["that","who"], correct:"that" },
        { emoji:"🙋", promptEn:"What do we call someone who helps without being paid?", promptAr:"ماذا نسمي شخصًا يساعد دون أن يتقاضى أجرًا؟",
          options:["a volunteer","a survivor","a suspect"], correct:"a volunteer" },
        { promptEn:"People ___ were trapped ___ waiting for rescue when help arrived.", promptAr:"كان الأشخاص المحاصرون ينتظرون الإنقاذ عندما وصلت المساعدة.",
          options:["were","was"], correct:"were" },
        { emoji:"🙌", promptEn:"What do we call someone who lived through a disaster?", promptAr:"ماذا نسمي شخصًا نجا من كارثة؟",
          options:["a survivor","a volunteer","a suspect"], correct:"a survivor" }
      ]
    }
  ]
};

/* ---------- GAME 3 : WORK & CAREERS (Module 3) ---------- */

const WORK_VOCAB = [
  { id:"resume", en:"résumé", ar:"سيرة ذاتية", emoji:"📄" },
  { id:"interview", en:"interview", ar:"مقابلة", emoji:"🎤" },
  { id:"employer", en:"employer", ar:"صاحب عمل", emoji:"👔" },
  { id:"qualification", en:"qualification", ar:"مؤهل", emoji:"🎓" },
  { id:"promotion", en:"promotion", ar:"ترقية", emoji:"📈" },
  { id:"salary", en:"salary", ar:"راتب", emoji:"💰" },
  { id:"colleague", en:"colleague", ar:"زميل", emoji:"🤝" },
  { id:"championship", en:"championship", ar:"بطولة", emoji:"🏆" }
];

const GAME_WORK = {
  id: "work",
  emoji: "💼",
  titleEn: "Work & Careers",
  titleAr: "العمل والمهن",
  character: "marya",
  introEn: "Get ready for job interviews and learn the present perfect tenses!",
  introAr: "استعد لمقابلات العمل وتعلّم أزمنة المضارع التام!",
  activities: [
    {
      id:"vocab", type:"vocab", character:"marya",
      tagEn:"Career Words", tagAr:"كلمات المهنة",
      instructionsEn:"Tap a word to hear it and see its meaning.",
      instructionsAr:"اضغط على الكلمة لسماعها ومعرفة معناها.",
      words: WORK_VOCAB
    },
    {
      id:"teach", type:"teach", character:"maya",
      tagEn:"Present Perfect Simple vs. Progressive", tagAr:"المضارع التام البسيط والمستمر",
      instructionsEn:"Both tenses connect the past to now — but they focus on different things.",
      instructionsAr:"كلا الزمنين يربط الماضي بالحاضر — لكن كل واحد يركّز على شيء مختلف.",
      teachBlocks:[
        { pillEn:"Present Perfect Simple",
          descEn:"Use for a completed action with a result now, or a life experience.", descAr:"نستخدمه لفعل مكتمل له نتيجة الآن، أو لتجربة حياتية.",
          examples:[ { emoji:"📄", textEn:"I have finished my résumé." } ] },
        { pillEn:"Present Perfect Progressive", accent:true,
          descEn:"Use for an action that started in the past and is still continuing — the focus is on duration.", descAr:"نستخدمه لفعل بدأ في الماضي وما زال مستمرًا — التركيز على المدة.",
          examples:[ { emoji:"⏳", textEn:"I have been working here for five years." } ] }
      ]
    },
    {
      id:"correctform", type:"mcq", character:"marya",
      tagEn:"Choose the Correct Form", tagAr:"اختر الصيغة الصحيحة",
      instructionsEn:"Choose the correct verb form.",
      instructionsAr:"اختر صيغة الفعل الصحيحة.",
      rounds:[
        { promptEn:"She ___ for this company for ten years.", promptAr:"هي تعمل في هذه الشركة منذ عشر سنوات.",
          options:["has worked","has been working"], correct:"has been working" },
        { promptEn:"I ___ my résumé — do you want to check it?", promptAr:"لقد أنهيت سيرتي الذاتية — هل تريد مراجعتها؟",
          options:["have finished","have been finishing"], correct:"have finished" },
        { promptEn:"He ___ for a new job since last month.", promptAr:"يبحث عن وظيفة جديدة منذ الشهر الماضي.",
          options:["has been looking","has looked"], correct:"has been looking" },
        { promptEn:"They ___ three job interviews this week already.", promptAr:"لقد أجروا بالفعل ثلاث مقابلات عمل هذا الأسبوع.",
          options:["have had","have been having"], correct:"have had" },
        { promptEn:"I ___ this report all morning — I'm almost done.", promptAr:"كنت أعمل على هذا التقرير طوال الصباح — كدت أنتهي.",
          options:["have been writing","have written"], correct:"have been writing" },
        { promptEn:"We ___ the new manager yet.", promptAr:"لم نقابل المدير الجديد بعد.",
          options:["haven't met","haven't been meeting"], correct:"haven't met" }
      ]
    },
    {
      id:"match", type:"match", character:"mahir",
      tagEn:"Match the Career Word", tagAr:"طابق كلمة المهنة",
      instructionsEn:"Match the English word to the correct picture.",
      instructionsAr:"طابق الكلمة الإنجليزية مع الصورة الصحيحة.",
      rounds:[
        { pairs:["resume","interview","employer","qualification"].map(id=>{
            const w = WORK_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) },
        { pairs:["promotion","salary","colleague","championship"].map(id=>{
            const w = WORK_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) }
      ]
    },
    {
      id:"buildsentence", type:"order", character:"malik", orderMode:"words",
      tagEn:"Build the Sentence", tagAr:"كوّن الجملة",
      instructionsEn:"Drag the words into the correct order.",
      instructionsAr:"اسحب الكلمات بالترتيب الصحيح.",
      rounds:[
        { items:["She","has","worked","here","for","two","years"].map((w,i)=>({id:"wk1_"+i, labelEn:w})) },
        { items:["I","have","just","finished","the","interview"].map((w,i)=>({id:"wk2_"+i, labelEn:w})) },
        { items:["He","has","been","studying","all","night"].map((w,i)=>({id:"wk3_"+i, labelEn:w})) },
        { items:["They","have","already","signed","the","contract"].map((w,i)=>({id:"wk4_"+i, labelEn:w})) }
      ]
    },
    {
      id:"challenge", type:"mcq", character:"malik",
      tagEn:"Work & Careers Challenge", tagAr:"تحدي العمل والمهن",
      instructionsEn:"Choose the correct answer.",
      instructionsAr:"اختر الإجابة الصحيحة.",
      rounds:[
        { emoji:"📈", promptEn:"What do we call moving up to a better job at the same company?", promptAr:"ماذا نسمي الانتقال إلى وظيفة أفضل في نفس الشركة؟",
          options:["a promotion","a salary","a résumé"], correct:"a promotion" },
        { promptEn:"I ___ for a job since I graduated three months ago.", promptAr:"أبحث عن وظيفة منذ تخرجي قبل ثلاثة أشهر.",
          options:["have been looking","have looked"], correct:"have been looking" },
        { emoji:"🎓", promptEn:"What do we call a certificate that shows you can do a job?", promptAr:"ماذا نسمي شهادة تُثبت أنك قادر على أداء وظيفة؟",
          options:["a qualification","a colleague","an employer"], correct:"a qualification" },
        { promptEn:"She ___ her degree last year, and now she has a great job.", promptAr:"حصلت على شهادتها العام الماضي، والآن لديها وظيفة رائعة.",
          options:["has finished","has been finishing"], correct:"has finished" },
        { emoji:"🤝", promptEn:"What do we call the person you work with every day?", promptAr:"ماذا نسمي الشخص الذي تعمل معه كل يوم؟",
          options:["a colleague","an employer","a survivor"], correct:"a colleague" },
        { promptEn:"He ___ this project for two months, and it's almost finished.", promptAr:"يعمل على هذا المشروع منذ شهرين، وقد أوشك على الانتهاء.",
          options:["has been working on","has worked on"], correct:"has been working on" }
      ]
    }
  ]
};

/* ---------- GAME 4 : MODAL MYSTERIES (Module 3) ---------- */

const MODAL_VOCAB = [
  { id:"clue", en:"clue", ar:"دليل", emoji:"🔍" },
  { id:"suspect", en:"suspect", ar:"مشتبه به", emoji:"🕵️" },
  { id:"evidence", en:"evidence", ar:"إثبات", emoji:"📋" },
  { id:"certain", en:"certain", ar:"متأكد", emoji:"✅" },
  { id:"possible", en:"possible", ar:"ممكن", emoji:"🤔" },
  { id:"unlikely", en:"unlikely", ar:"غير محتمل", emoji:"❌" },
  { id:"guess", en:"guess", ar:"يخمّن", emoji:"💭" },
  { id:"mystery", en:"mystery", ar:"لغز", emoji:"❓" }
];

const GAME_MODAL = {
  id: "modal",
  emoji: "🕵️",
  titleEn: "Modal Mysteries",
  titleAr: "ألغاز الأفعال الناقصة",
  character: "malik",
  introEn: "Solve mysteries using modals of obligation and deduction!",
  introAr: "حلّ الألغاز باستخدام أفعال الإلزام والاستنتاج الناقصة!",
  activities: [
    {
      id:"vocab", type:"vocab", character:"malik",
      tagEn:"Detective Words", tagAr:"كلمات التحري",
      instructionsEn:"Tap a word to hear it and see its meaning.",
      instructionsAr:"اضغط على الكلمة لسماعها ومعرفة معناها.",
      words: MODAL_VOCAB
    },
    {
      id:"teach", type:"teach", character:"maya",
      tagEn:"Obligation vs. Deduction", tagAr:"الإلزام والاستنتاج",
      instructionsEn:"Modal verbs can show necessity, or how sure we are about something.",
      instructionsAr:"يمكن للأفعال الناقصة أن تدل على الضرورة، أو على مدى تأكدنا من شيء.",
      teachBlocks:[
        { pillEn:"Obligation: must / have to / need to",
          descEn:"Use these to say something is necessary.", descAr:"نستخدمها لنقول إن شيئًا ضروري.",
          examples:[ { emoji:"📋", textEn:"You must show your ID at the door." } ] },
        { pillEn:"Deduction: must / might / can't", accent:true,
          descEn:"Use these to guess how sure we are about something.", descAr:"نستخدمها لتخمين مدى تأكدنا من شيء.",
          examples:[ { emoji:"🔍", textEn:"The lights are off — they must be asleep." } ] }
      ]
    },
    {
      id:"necessary", type:"mcq", character:"malik",
      tagEn:"Necessary or Not?", tagAr:"ضروري أم لا؟",
      instructionsEn:"Choose the correct modal verb.",
      instructionsAr:"اختر الفعل الناقص الصحيح.",
      rounds:[
        { promptEn:"Detectives ___ collect evidence carefully — it's the law.", promptAr:"يجب على المحققين جمع الأدلة بعناية — هذا هو القانون.",
          options:["must","don't have to"], correct:"must" },
        { promptEn:"You ___ pay to enter the museum — it's free today.", promptAr:"لا داعي أن تدفع لدخول المتحف — إنه مجاني اليوم.",
          options:["don't have to","must"], correct:"don't have to" },
        { promptEn:"We ___ find the missing clue before tomorrow.", promptAr:"نحتاج أن نجد الدليل المفقود قبل الغد.",
          options:["need to","needn't"], correct:"need to" },
        { promptEn:"You ___ better call the police right now.", promptAr:"من الأفضل أن تتصل بالشرطة الآن.",
          options:["had","would"], correct:"had" },
        { promptEn:"You ___ show your ID for a local bus — only for flights.", promptAr:"لا داعي أن تُظهر هويتك لحافلة محلية — فقط للرحلات الجوية.",
          options:["don't need to","mustn't"], correct:"don't need to" },
        { promptEn:"Witnesses ___ tell the truth in court.", promptAr:"يجب على الشهود قول الحقيقة في المحكمة.",
          options:["must","might"], correct:"must" }
      ]
    },
    {
      id:"howsure", type:"mcq", character:"mahir",
      tagEn:"How Sure Are You?", tagAr:"ما مدى تأكدك؟",
      instructionsEn:"Choose the modal that shows how certain we are.",
      instructionsAr:"اختر الفعل الناقص الذي يدل على درجة التأكد.",
      rounds:[
        { promptEn:"The lights are off and the car is gone — they ___ be home.", promptAr:"الأضواء مطفأة والسيارة غير موجودة — لا بد أنهم ليسوا في المنزل.",
          options:["can't","must"], correct:"can't" },
        { promptEn:"There's a light on inside — someone ___ be home.", promptAr:"هناك ضوء مضاء بالداخل — لا بد أن أحدًا في المنزل.",
          options:["must","can't"], correct:"must" },
        { promptEn:"He ___ be the thief — but we're not sure yet.", promptAr:"ربما يكون هو اللص — لكننا لسنا متأكدين بعد.",
          options:["might","can't"], correct:"might" },
        { promptEn:"The footprints are huge — it ___ be a small animal.", promptAr:"آثار الأقدام ضخمة — لا يمكن أن تكون لحيوان صغير.",
          options:["can't","must"], correct:"can't" },
        { promptEn:"She knows every detail of the crime — she ___ be the suspect.", promptAr:"تعرف كل تفاصيل الجريمة — لا بد أنها المشتبه بها.",
          options:["must","might"], correct:"must" },
        { promptEn:"It ___ be him — I'm not one hundred percent certain.", promptAr:"قد يكون هو — لست متأكدًا مئة بالمئة.",
          options:["might","must"], correct:"might" }
      ]
    },
    {
      id:"match", type:"match", character:"marya",
      tagEn:"Match the Detective Word", tagAr:"طابق كلمة التحري",
      instructionsEn:"Match the English word to the correct picture.",
      instructionsAr:"طابق الكلمة الإنجليزية مع الصورة الصحيحة.",
      rounds:[
        { pairs:["clue","suspect","evidence","certain"].map(id=>{
            const w = MODAL_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) },
        { pairs:["possible","unlikely","guess","mystery"].map(id=>{
            const w = MODAL_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) }
      ]
    },
    {
      id:"challenge", type:"mcq", character:"maya",
      tagEn:"Modal Mysteries Challenge", tagAr:"تحدي ألغاز الأفعال الناقصة",
      instructionsEn:"Choose the correct answer.",
      instructionsAr:"اختر الإجابة الصحيحة.",
      rounds:[
        { emoji:"🔍", promptEn:"What do we call a small piece of information that helps solve a mystery?", promptAr:"ماذا نسمي معلومة صغيرة تساعد في حل اللغز؟",
          options:["a clue","a suspect","evidence"], correct:"a clue" },
        { promptEn:"You ___ tell anyone about this — it's a secret investigation.", promptAr:"يجب ألا تخبر أحدًا بهذا — إنه تحقيق سري.",
          options:["mustn't","don't have to"], correct:"mustn't" },
        { emoji:"❌", promptEn:"What word means 'not likely to happen'?", promptAr:"ما الكلمة التي تعني 'غير محتمل الحدوث'؟",
          options:["unlikely","certain","possible"], correct:"unlikely" },
        { promptEn:"The door is locked from the inside — the thief ___ have left this way.", promptAr:"الباب مغلق من الداخل — لا يمكن أن يكون اللص قد خرج من هنا.",
          options:["can't","must"], correct:"can't" },
        { emoji:"🕵️", promptEn:"What do we call a person who might have committed a crime?", promptAr:"ماذا نسمي شخصًا قد يكون ارتكب جريمة؟",
          options:["a suspect","a survivor","a colleague"], correct:"a suspect" },
        { promptEn:"We ___ need more evidence before we accuse anyone.", promptAr:"نحتاج أدلة أكثر قبل أن نتهم أي شخص.",
          options:["need to","needn't"], correct:"need to" }
      ]
    }
  ]
};

/* ---------- GAME 5 : PLANET EARTH (Module 4) ---------- */

const PLANET_VOCAB = [
  { id:"rainforest", en:"rainforest", ar:"غابة مطيرة", emoji:"🌳" },
  { id:"glacier", en:"glacier", ar:"نهر جليدي", emoji:"🧊" },
  { id:"drought", en:"drought", ar:"جفاف", emoji:"🏜️" },
  { id:"renewable", en:"renewable", ar:"متجدد", emoji:"♻️" },
  { id:"pollution", en:"pollution", ar:"تلوث", emoji:"🏭" },
  { id:"ecosystem", en:"ecosystem", ar:"نظام بيئي", emoji:"🌱" },
  { id:"conserve", en:"conserve", ar:"يحافظ على", emoji:"🛡️" },
  { id:"wildlife", en:"wildlife", ar:"حياة برية", emoji:"🦌" }
];

const GAME_PLANET = {
  id: "planet",
  emoji: "🌎",
  titleEn: "Planet Earth",
  titleAr: "كوكب الأرض",
  character: "mahir",
  introEn: "Protect the planet and master conditional sentences!",
  introAr: "احمِ الكوكب وأتقن الجمل الشرطية!",
  activities: [
    {
      id:"vocab", type:"vocab", character:"mahir",
      tagEn:"Planet Words", tagAr:"كلمات الكوكب",
      instructionsEn:"Tap a word to hear it and see its meaning.",
      instructionsAr:"اضغط على الكلمة لسماعها ومعرفة معناها.",
      words: PLANET_VOCAB
    },
    {
      id:"teach", type:"teach", character:"maya",
      tagEn:"Conditionals: Type 1 & Type 2", tagAr:"الجمل الشرطية: النوع الأول والثاني",
      instructionsEn:"We use conditionals to talk about real and imagined situations.",
      instructionsAr:"نستخدم الجمل الشرطية للحديث عن مواقف حقيقية ومتخيلة.",
      teachBlocks:[
        { pillEn:"Type 1: Real possibility",
          descEn:"Use if + present simple, will + verb for things that can really happen.", descAr:"استخدم if + المضارع البسيط، will + الفعل للأشياء الممكنة فعلاً.",
          examples:[ { emoji:"🌱", textEn:"If we plant more trees, the air will be cleaner." } ] },
        { pillEn:"Type 2: Imagined situation", accent:true,
          descEn:"Use if + past simple, would + verb for something unreal, unlikely, or imagined.", descAr:"استخدم if + الماضي البسيط، would + الفعل لشيء غير حقيقي أو غير محتمل أو متخيل.",
          examples:[ { emoji:"🌍", textEn:"If everyone recycled, the planet would be healthier." } ] }
      ]
    },
    {
      id:"realorimagined", type:"mcq", character:"maya",
      tagEn:"Real or Imagined?", tagAr:"حقيقي أم متخيل؟",
      instructionsEn:"Choose the correct verb form.",
      instructionsAr:"اختر صيغة الفعل الصحيحة.",
      rounds:[
        { promptEn:"If we ___ water carefully, we will have enough during the drought.", promptAr:"إذا استخدمنا الماء بعناية، سيكون لدينا ما يكفي خلال الجفاف.",
          options:["use","used"], correct:"use" },
        { promptEn:"If everyone used solar power, pollution ___ decrease a lot.", promptAr:"لو استخدم الجميع الطاقة الشمسية، لانخفض التلوث كثيرًا.",
          options:["would","will"], correct:"would" },
        { promptEn:"If I ___ a scientist, I would study endangered wildlife.", promptAr:"لو كنت عالمًا، لدرست الحياة البرية المهددة بالانقراض.",
          options:["were","am"], correct:"were" },
        { promptEn:"If we protect the rainforest, it ___ absorb more carbon dioxide.", promptAr:"إذا حمينا الغابة المطيرة، فستمتص المزيد من ثاني أكسيد الكربون.",
          options:["will","would"], correct:"will" },
        { promptEn:"If glaciers ___ melting this fast, sea levels would rise even more.", promptAr:"لو استمرت الأنهار الجليدية في الذوبان بهذه السرعة، لارتفع مستوى البحر أكثر.",
          options:["kept","keep"], correct:"kept" },
        { promptEn:"If people recycle more, we ___ produce less waste.", promptAr:"إذا أعاد الناس تدوير أكثر، فسننتج نفايات أقل.",
          options:["will","would"], correct:"will" }
      ]
    },
    {
      id:"match", type:"match", character:"marya",
      tagEn:"Match the Planet Word", tagAr:"طابق كلمة الكوكب",
      instructionsEn:"Match the English word to the correct picture.",
      instructionsAr:"طابق الكلمة الإنجليزية مع الصورة الصحيحة.",
      rounds:[
        { pairs:["rainforest","glacier","drought","renewable"].map(id=>{
            const w = PLANET_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) },
        { pairs:["pollution","ecosystem","conserve","wildlife"].map(id=>{
            const w = PLANET_VOCAB.find(v=>v.id===id);
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
        { items:["If","we","recycle","we","will","help","the","planet"].map((w,i)=>({id:"pl1_"+i, labelEn:w})) },
        { items:["If","I","were","rich","I","would","protect","the","rainforest"].map((w,i)=>({id:"pl2_"+i, labelEn:w})) },
        { items:["We","conserve","water","before","the","drought","gets","worse"].map((w,i)=>({id:"pl3_"+i, labelEn:w})) },
        { items:["The","ecosystem","will","recover","if","we","act","now"].map((w,i)=>({id:"pl4_"+i, labelEn:w})) }
      ]
    },
    {
      id:"challenge", type:"mcq", character:"malik",
      tagEn:"Planet Earth Challenge", tagAr:"تحدي كوكب الأرض",
      instructionsEn:"Choose the correct answer.",
      instructionsAr:"اختر الإجابة الصحيحة.",
      rounds:[
        { promptEn:"Wait ___ the sun sets before you take the photo.", promptAr:"انتظر حتى تغرب الشمس قبل أن تلتقط الصورة.",
          options:["until","if"], correct:"until" },
        { emoji:"♻️", promptEn:"What do we call energy that never runs out, like solar or wind?", promptAr:"ماذا نسمي الطاقة التي لا تنفد، مثل الشمسية أو الرياح؟",
          options:["renewable","polluted","extinct"], correct:"renewable" },
        { promptEn:"If we don't act now, wildlife ___ disappear forever.", promptAr:"إذا لم نتصرف الآن، فستختفي الحياة البرية إلى الأبد.",
          options:["will","would"], correct:"will" },
        { emoji:"🌱", promptEn:"What do we call all the living things and their environment together?", promptAr:"ماذا نسمي جميع الكائنات الحية وبيئتها معًا؟",
          options:["an ecosystem","a drought","a glacier"], correct:"an ecosystem" },
        { promptEn:"Before you ___ the forest, learn about its animals.", promptAr:"قبل أن تزور الغابة، تعلّم عن حيواناتها.",
          options:["visit","will visit"], correct:"visit" },
        { emoji:"🛡️", promptEn:"What verb means 'to protect and save something for the future'?", promptAr:"ما الفعل الذي يعني 'يحمي ويحافظ على شيء للمستقبل'؟",
          options:["conserve","pollute","waste"], correct:"conserve" }
      ]
    }
  ]
};

const ALL_GAMES = [GAME_WINDOW, GAME_HEROES, GAME_WORK, GAME_MODAL, GAME_PLANET];
