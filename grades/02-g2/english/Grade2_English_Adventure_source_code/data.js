/* ============================================================
   Maha Academy — English Adventure — GRADE 2 (We Can 2, Term 1)
   3 units confirmed via Saudi curriculum sources (mnhaji.com):
   1. Feelings  2. Things We Wear  3. Things We Do
   ============================================================ */

function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

/* ============================================================
   GAME 1: FEELINGS
   ============================================================ */
const FEELINGS_VOCAB = [
  { id:"happy", en:"happy", ar:"سعيد", emoji:"😊" },
  { id:"sad", en:"sad", ar:"حزين", emoji:"😢" },
  { id:"angry", en:"angry", ar:"غاضب", emoji:"😠" },
  { id:"scared", en:"scared", ar:"خائف", emoji:"😨" },
  { id:"tired", en:"tired", ar:"متعب", emoji:"😴" },
  { id:"hungry", en:"hungry", ar:"جائع", emoji:"🍽️" },
  { id:"thirsty", en:"thirsty", ar:"عطشان", emoji:"🥤" },
  { id:"sick", en:"sick", ar:"مريض", emoji:"🤒" }
];

const GAME_FEELINGS = {
  id:"feelings", emoji:"😊", titleEn:"Feelings", titleAr:"المشاعر",
  character:"mahir",
  introEn:"How do you feel today? Let's learn feeling words!",
  introAr:"كيف تشعر اليوم؟ لنتعلم كلمات المشاعر!",
  activities:[
    { type:"vocab", tagEn:"Feeling Words", tagAr:"كلمات المشاعر",
      instructionsEn:"Tap each card to hear the word.",
      instructionsAr:"اضغط على كل بطاقة لسماع الكلمة.",
      words: FEELINGS_VOCAB },

    { type:"teach", tagEn:"How Do You Feel?", tagAr:"كيف تشعر؟",
      teachBlocks:[
        { pillEn:"I feel...", pillAr:"أشعر بـ...",
          descEn:"Use \"I feel\" to say how you feel.", descAr:"استخدم \"أشعر بـ\" لتقول كيف تشعر.",
          examples:[
            { en:"I feel happy.", ar:"أشعر بالسعادة." },
            { en:"I feel tired.", ar:"أشعر بالتعب." }
          ]},
        { pillEn:"How do you feel?", pillAr:"كيف تشعر؟",
          descEn:"Ask a friend how they feel.", descAr:"اسأل صديقك كيف يشعر.",
          examples:[
            { en:"How do you feel? — I feel happy.", ar:"كيف تشعر؟ — أشعر بالسعادة." },
            { en:"She feels sad.", ar:"هي تشعر بالحزن." }
          ]}
      ]},

    { type:"mcq", tagEn:"Listen and Choose", tagAr:"استمع واختر",
      instructionsEn:"Listen and pick the word you hear.",
      instructionsAr:"استمع واختر الكلمة التي سمعتها.",
      rounds:[
        { promptEn:"Which word did you hear?", promptAr:"ما الكلمة التي سمعتها؟", speak:"happy", audio:true,
          options:["happy","sad","angry"], correct:"happy" },
        { promptEn:"Which word did you hear?", promptAr:"ما الكلمة التي سمعتها؟", speak:"sad", audio:true,
          options:["sad","tired","scared"], correct:"sad" },
        { promptEn:"Which word did you hear?", promptAr:"ما الكلمة التي سمعتها؟", speak:"angry", audio:true,
          options:["angry","happy","sick"], correct:"angry" },
        { promptEn:"Which word did you hear?", promptAr:"ما الكلمة التي سمعتها؟", speak:"scared", audio:true,
          options:["scared","hungry","thirsty"], correct:"scared" },
        { promptEn:"Which word did you hear?", promptAr:"ما الكلمة التي سمعتها؟", speak:"hungry", audio:true,
          options:["hungry","thirsty","tired"], correct:"hungry" },
        { promptEn:"Which word did you hear?", promptAr:"ما الكلمة التي سمعتها؟", speak:"sick", audio:true,
          options:["sick","sad","angry"], correct:"sick" }
      ]},

    { type:"match", tagEn:"Match the Feeling", tagAr:"طابق الشعور",
      instructionsEn:"Match each word to its picture.",
      instructionsAr:"طابق كل كلمة مع صورتها.",
      rounds:[
        { pairs:[
          { id:"happy", labelEn:"happy", labelAr:"سعيد", emoji:"😊" },
          { id:"sad", labelEn:"sad", labelAr:"حزين", emoji:"😢" },
          { id:"angry", labelEn:"angry", labelAr:"غاضب", emoji:"😠" },
          { id:"tired", labelEn:"tired", labelAr:"متعب", emoji:"😴" }
        ]},
        { pairs:[
          { id:"scared", labelEn:"scared", labelAr:"خائف", emoji:"😨" },
          { id:"hungry", labelEn:"hungry", labelAr:"جائع", emoji:"🍽️" },
          { id:"thirsty", labelEn:"thirsty", labelAr:"عطشان", emoji:"🥤" },
          { id:"sick", labelEn:"sick", labelAr:"مريض", emoji:"🤒" }
        ]}
      ]},

    { type:"order", tagEn:"Build the Sentence", tagAr:"كوّن الجملة",
      instructionsEn:"Tap the words in the correct order.",
      instructionsAr:"اضغط على الكلمات بالترتيب الصحيح.",
      rounds:[
        { items:[{id:"i",labelEn:"I"},{id:"feel",labelEn:"feel"},{id:"happy",labelEn:"happy"}], speakOnPlace:true },
        { items:[{id:"i2",labelEn:"I"},{id:"feel2",labelEn:"feel"},{id:"tired",labelEn:"tired"}], speakOnPlace:true },
        { items:[{id:"she",labelEn:"She"},{id:"feels",labelEn:"feels"},{id:"sad",labelEn:"sad"}], speakOnPlace:true },
        { items:[{id:"how",labelEn:"How"},{id:"do",labelEn:"do"},{id:"you",labelEn:"you"},{id:"feel",labelEn:"feel"}], speakOnPlace:true }
      ]},

    { type:"mcq", tagEn:"My Feelings Challenge", tagAr:"تحدي مشاعري",
      instructionsEn:"Choose the correct feeling.",
      instructionsAr:"اختر الشعور الصحيح.",
      rounds:[
        { promptEn:"🎁 How do you feel when you get a gift?", promptAr:"🎁 كيف تشعر عندما تحصل على هدية؟",
          options:["happy","sad","angry"], correct:"happy" },
        { promptEn:"💔 How do you feel when you lose your toy?", promptAr:"💔 كيف تشعر عندما تفقد لعبتك؟",
          options:["sad","happy","tired"], correct:"sad" },
        { promptEn:"🕷️ How do you feel when you see a spider?", promptAr:"🕷️ كيف تشعر عندما ترى عنكبوتًا؟",
          options:["scared","hungry","angry"], correct:"scared" },
        { promptEn:"🌙 It's very late at night. How do you feel?", promptAr:"🌙 الوقت متأخر جدًا في الليل. كيف تشعر؟",
          options:["tired","thirsty","happy"], correct:"tired" },
        { promptEn:"🍕 You haven't eaten all day. How do you feel?", promptAr:"🍕 لم تأكل طوال اليوم. كيف تشعر؟",
          options:["hungry","sick","angry"], correct:"hungry" },
        { promptEn:"🤒 You have a fever. How do you feel?", promptAr:"🤒 لديك حمى. كيف تشعر؟",
          options:["sick","happy","thirsty"], correct:"sick" }
      ]}
  ]
};

/* ============================================================
   GAME 2: THINGS WE WEAR
   ============================================================ */
const CLOTHES_VOCAB = [
  { id:"shirt", en:"shirt", ar:"قميص", emoji:"👕" },
  { id:"pants", en:"pants", ar:"بنطال", emoji:"👖" },
  { id:"dress", en:"dress", ar:"فستان", emoji:"👗" },
  { id:"shoes", en:"shoes", ar:"حذاء", emoji:"👟" },
  { id:"socks", en:"socks", ar:"جوارب", emoji:"🧦" },
  { id:"hat", en:"hat", ar:"قبعة", emoji:"🧢" },
  { id:"jacket", en:"jacket", ar:"سترة", emoji:"🧥" },
  { id:"scarf", en:"scarf", ar:"وشاح", emoji:"🧣" }
];

const GAME_CLOTHES = {
  id:"clothes", emoji:"👕", titleEn:"Things We Wear", titleAr:"الأشياء التي نرتديها",
  character:"maya",
  introEn:"What are you wearing today? Let's learn clothes words!",
  introAr:"ماذا ترتدي اليوم؟ لنتعلم كلمات الملابس!",
  activities:[
    { type:"vocab", tagEn:"Clothes Words", tagAr:"كلمات الملابس",
      instructionsEn:"Tap each card to hear the word.",
      instructionsAr:"اضغط على كل بطاقة لسماع الكلمة.",
      words: CLOTHES_VOCAB },

    { type:"teach", tagEn:"I Am Wearing...", tagAr:"أنا أرتدي...",
      teachBlocks:[
        { pillEn:"I am wearing...", pillAr:"أنا أرتدي...",
          descEn:"Use \"I am wearing\" to say what you have on.", descAr:"استخدم \"أنا أرتدي\" لتقول ماذا تلبس.",
          examples:[
            { en:"I am wearing a hat.", ar:"أنا أرتدي قبعة." },
            { en:"I am wearing shoes.", ar:"أنا أرتدي حذاءً." }
          ]},
        { pillEn:"She is wearing...", pillAr:"هي ترتدي...",
          descEn:"Use \"is wearing\" for he/she.", descAr:"استخدم \"يرتدي/ترتدي\" لـ هو/هي.",
          examples:[
            { en:"She is wearing a dress.", ar:"هي ترتدي فستانًا." },
            { en:"He is wearing a jacket.", ar:"هو يرتدي سترة." }
          ]}
      ]},

    { type:"mcq", tagEn:"Listen and Choose", tagAr:"استمع واختر",
      instructionsEn:"Listen and pick the word you hear.",
      instructionsAr:"استمع واختر الكلمة التي سمعتها.",
      rounds:[
        { promptEn:"Which word did you hear?", promptAr:"ما الكلمة التي سمعتها؟", speak:"shirt", audio:true,
          options:["shirt","pants","dress"], correct:"shirt" },
        { promptEn:"Which word did you hear?", promptAr:"ما الكلمة التي سمعتها؟", speak:"shoes", audio:true,
          options:["shoes","socks","hat"], correct:"shoes" },
        { promptEn:"Which word did you hear?", promptAr:"ما الكلمة التي سمعتها؟", speak:"dress", audio:true,
          options:["dress","jacket","scarf"], correct:"dress" },
        { promptEn:"Which word did you hear?", promptAr:"ما الكلمة التي سمعتها؟", speak:"socks", audio:true,
          options:["socks","shoes","pants"], correct:"socks" },
        { promptEn:"Which word did you hear?", promptAr:"ما الكلمة التي سمعتها؟", speak:"jacket", audio:true,
          options:["jacket","hat","scarf"], correct:"jacket" },
        { promptEn:"Which word did you hear?", promptAr:"ما الكلمة التي سمعتها؟", speak:"scarf", audio:true,
          options:["scarf","shirt","socks"], correct:"scarf" }
      ]},

    { type:"match", tagEn:"Match the Clothes", tagAr:"طابق الملابس",
      instructionsEn:"Match each word to its picture.",
      instructionsAr:"طابق كل كلمة مع صورتها.",
      rounds:[
        { pairs:[
          { id:"shirt", labelEn:"shirt", labelAr:"قميص", emoji:"👕" },
          { id:"pants", labelEn:"pants", labelAr:"بنطال", emoji:"👖" },
          { id:"dress", labelEn:"dress", labelAr:"فستان", emoji:"👗" },
          { id:"shoes", labelEn:"shoes", labelAr:"حذاء", emoji:"👟" }
        ]},
        { pairs:[
          { id:"socks", labelEn:"socks", labelAr:"جوارب", emoji:"🧦" },
          { id:"hat", labelEn:"hat", labelAr:"قبعة", emoji:"🧢" },
          { id:"jacket", labelEn:"jacket", labelAr:"سترة", emoji:"🧥" },
          { id:"scarf", labelEn:"scarf", labelAr:"وشاح", emoji:"🧣" }
        ]}
      ]},

    { type:"order", tagEn:"Build the Sentence", tagAr:"كوّن الجملة",
      instructionsEn:"Tap the words in the correct order.",
      instructionsAr:"اضغط على الكلمات بالترتيب الصحيح.",
      rounds:[
        { items:[{id:"i",labelEn:"I"},{id:"wear",labelEn:"wear"},{id:"a",labelEn:"a"},{id:"hat",labelEn:"hat"}], speakOnPlace:true },
        { items:[{id:"i2",labelEn:"I"},{id:"wear2",labelEn:"wear"},{id:"shoes",labelEn:"shoes"}], speakOnPlace:true },
        { items:[{id:"she",labelEn:"She"},{id:"wears",labelEn:"wears"},{id:"a",labelEn:"a"},{id:"dress",labelEn:"dress"}], speakOnPlace:true },
        { items:[{id:"he",labelEn:"He"},{id:"wears",labelEn:"wears"},{id:"a",labelEn:"a"},{id:"jacket",labelEn:"jacket"}], speakOnPlace:true }
      ]},

    { type:"mcq", tagEn:"Weather Wear Challenge", tagAr:"تحدي ملابس الطقس",
      instructionsEn:"Choose the correct clothes.",
      instructionsAr:"اختر الملابس الصحيحة.",
      rounds:[
        { promptEn:"🥶 It's cold outside. What do you wear?", promptAr:"🥶 الجو بارد بالخارج. ماذا ترتدي؟",
          options:["a jacket","a dress","shoes"], correct:"a jacket" },
        { promptEn:"☀️ It's sunny. What do you wear on your head?", promptAr:"☀️ الجو مشمس. ماذا ترتدي على رأسك؟",
          options:["a hat","socks","a scarf"], correct:"a hat" },
        { promptEn:"👣 What do you wear on your feet?", promptAr:"👣 ماذا ترتدي على قدميك؟",
          options:["shoes","a shirt","a hat"], correct:"shoes" },
        { promptEn:"🧦 What do you wear under your shoes?", promptAr:"🧦 ماذا ترتدي تحت حذائك؟",
          options:["socks","a scarf","pants"], correct:"socks" },
        { promptEn:"🎉 A girl is going to a party. What might she wear?", promptAr:"🎉 فتاة ذاهبة إلى حفلة. ماذا قد ترتدي؟",
          options:["a dress","pants","a jacket"], correct:"a dress" },
        { promptEn:"❄️ It's snowing! What do you wear around your neck?", promptAr:"❄️ إنها تثلج! ماذا ترتدي حول رقبتك؟",
          options:["a scarf","socks","shoes"], correct:"a scarf" }
      ]}
  ]
};

/* ============================================================
   GAME 3: THINGS WE DO
   ============================================================ */
const ACTIONS_VOCAB = [
  { id:"run", en:"run", ar:"يركض", emoji:"🏃" },
  { id:"jump", en:"jump", ar:"يقفز", emoji:"🤸" },
  { id:"swim", en:"swim", ar:"يسبح", emoji:"🏊" },
  { id:"read", en:"read", ar:"يقرأ", emoji:"📖" },
  { id:"eat", en:"eat", ar:"يأكل", emoji:"🍽️" },
  { id:"sleep", en:"sleep", ar:"ينام", emoji:"😴" },
  { id:"dance", en:"dance", ar:"يرقص", emoji:"💃" },
  { id:"sing", en:"sing", ar:"يغني", emoji:"🎤" }
];

const GAME_ACTIONS = {
  id:"actions", emoji:"🏃", titleEn:"Things We Do", titleAr:"الأشياء التي نقوم بها",
  character:"marya",
  introEn:"What can you do? Let's learn action words!",
  introAr:"ماذا يمكنك أن تفعل؟ لنتعلم كلمات الأفعال!",
  activities:[
    { type:"vocab", tagEn:"Action Words", tagAr:"كلمات الأفعال",
      instructionsEn:"Tap each card to hear the word.",
      instructionsAr:"اضغط على كل بطاقة لسماع الكلمة.",
      words: ACTIONS_VOCAB },

    { type:"teach", tagEn:"I Can...", tagAr:"أنا أستطيع...",
      teachBlocks:[
        { pillEn:"I can...", pillAr:"أنا أستطيع...",
          descEn:"Use \"I can\" to say what you are able to do.", descAr:"استخدم \"أنا أستطيع\" لتقول ما يمكنك فعله.",
          examples:[
            { en:"I can swim.", ar:"أنا أستطيع السباحة." },
            { en:"I can sing.", ar:"أنا أستطيع الغناء." }
          ]},
        { pillEn:"She can...", pillAr:"هي تستطيع...",
          descEn:"Use \"can\" the same way for everyone — it never changes!", descAr:"استخدم \"can\" بنفس الطريقة للجميع — لا تتغير أبدًا!",
          examples:[
            { en:"She can dance.", ar:"هي تستطيع الرقص." },
            { en:"He can jump.", ar:"هو يستطيع القفز." }
          ]}
      ]},

    { type:"mcq", tagEn:"Listen and Choose", tagAr:"استمع واختر",
      instructionsEn:"Listen and pick the word you hear.",
      instructionsAr:"استمع واختر الكلمة التي سمعتها.",
      rounds:[
        { promptEn:"Which word did you hear?", promptAr:"ما الكلمة التي سمعتها؟", speak:"run", audio:true,
          options:["run","jump","swim"], correct:"run" },
        { promptEn:"Which word did you hear?", promptAr:"ما الكلمة التي سمعتها؟", speak:"swim", audio:true,
          options:["swim","read","eat"], correct:"swim" },
        { promptEn:"Which word did you hear?", promptAr:"ما الكلمة التي سمعتها؟", speak:"read", audio:true,
          options:["read","sleep","sing"], correct:"read" },
        { promptEn:"Which word did you hear?", promptAr:"ما الكلمة التي سمعتها؟", speak:"eat", audio:true,
          options:["eat","dance","jump"], correct:"eat" },
        { promptEn:"Which word did you hear?", promptAr:"ما الكلمة التي سمعتها؟", speak:"dance", audio:true,
          options:["dance","sing","run"], correct:"dance" },
        { promptEn:"Which word did you hear?", promptAr:"ما الكلمة التي سمعتها؟", speak:"sing", audio:true,
          options:["sing","sleep","swim"], correct:"sing" }
      ]},

    { type:"match", tagEn:"Match the Action", tagAr:"طابق الفعل",
      instructionsEn:"Match each word to its picture.",
      instructionsAr:"طابق كل كلمة مع صورتها.",
      rounds:[
        { pairs:[
          { id:"run", labelEn:"run", labelAr:"يركض", emoji:"🏃" },
          { id:"jump", labelEn:"jump", labelAr:"يقفز", emoji:"🤸" },
          { id:"swim", labelEn:"swim", labelAr:"يسبح", emoji:"🏊" },
          { id:"read", labelEn:"read", labelAr:"يقرأ", emoji:"📖" }
        ]},
        { pairs:[
          { id:"eat", labelEn:"eat", labelAr:"يأكل", emoji:"🍽️" },
          { id:"sleep", labelEn:"sleep", labelAr:"ينام", emoji:"😴" },
          { id:"dance", labelEn:"dance", labelAr:"يرقص", emoji:"💃" },
          { id:"sing", labelEn:"sing", labelAr:"يغني", emoji:"🎤" }
        ]}
      ]},

    { type:"order", tagEn:"Build the Sentence", tagAr:"كوّن الجملة",
      instructionsEn:"Tap the words in the correct order.",
      instructionsAr:"اضغط على الكلمات بالترتيب الصحيح.",
      rounds:[
        { items:[{id:"i",labelEn:"I"},{id:"can",labelEn:"can"},{id:"swim",labelEn:"swim"}], speakOnPlace:true },
        { items:[{id:"i2",labelEn:"I"},{id:"can2",labelEn:"can"},{id:"sing",labelEn:"sing"}], speakOnPlace:true },
        { items:[{id:"she",labelEn:"She"},{id:"can3",labelEn:"can"},{id:"dance",labelEn:"dance"}], speakOnPlace:true },
        { items:[{id:"he",labelEn:"He"},{id:"can4",labelEn:"can"},{id:"jump",labelEn:"jump"}], speakOnPlace:true }
      ]},

    { type:"mcq", tagEn:"Action Challenge", tagAr:"تحدي الأفعال",
      instructionsEn:"Choose the correct action.",
      instructionsAr:"اختر الفعل الصحيح.",
      rounds:[
        { promptEn:"🏊 What do you do in a pool?", promptAr:"🏊 ماذا تفعل في المسبح؟",
          options:["swim","run","read"], correct:"swim" },
        { promptEn:"📖 What do you do with a book?", promptAr:"📖 ماذا تفعل بالكتاب؟",
          options:["read","eat","sleep"], correct:"read" },
        { promptEn:"😴 What do you do at night in your bed?", promptAr:"😴 ماذا تفعل ليلًا في سريرك؟",
          options:["sleep","dance","run"], correct:"sleep" },
        { promptEn:"🎤 What do you do with your voice at a party?", promptAr:"🎤 ماذا تفعل بصوتك في الحفلة؟",
          options:["sing","read","eat"], correct:"sing" },
        { promptEn:"🍕 What do you do with pizza?", promptAr:"🍕 ماذا تفعل بالبيتزا؟",
          options:["eat","swim","jump"], correct:"eat" },
        { promptEn:"🎶 What do you do to music at a party?", promptAr:"🎶 ماذا تفعل على الموسيقى في الحفلة؟",
          options:["dance","sleep","read"], correct:"dance" }
      ]}
  ]
};

const ALL_GAMES = [GAME_FEELINGS, GAME_CLOTHES, GAME_ACTIONS];
