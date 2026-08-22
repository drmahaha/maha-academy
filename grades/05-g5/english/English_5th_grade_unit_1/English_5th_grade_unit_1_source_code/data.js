/* ===========================================================
   Maha Academy — Content Data
   Keep all questions/content here, separate from the game engine,
   so games can be edited/expanded without touching game logic.
   =========================================================== */

/* ---------- Helpers ---------- */

const ONES_WORDS = ["","one","two","three","four","five","six","seven","eight","nine",
  "ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
const TENS_WORDS = ["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];

function numberToWords(n){
  if(n === 0) return "zero";
  if(n === 1000) return "one thousand";
  let num = n, str = "";
  if(num >= 100){
    str += ONES_WORDS[Math.floor(num/100)] + " hundred";
    num %= 100;
    if(num > 0) str += " ";
  }
  if(num >= 20){
    str += TENS_WORDS[Math.floor(num/10)];
    if(num % 10 > 0) str += "-" + ONES_WORDS[num % 10];
  } else if(num > 0){
    str += ONES_WORDS[num];
  }
  return str;
}

function shuffle(arr){
  const a = arr.slice();
  for(let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i+1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------- Months ---------- */

const MONTHS_EN = ["January","February","March","April","May","June",
  "July","August","September","October","November","December"];
const MONTHS_AR = {
  January:"يناير", February:"فبراير", March:"مارس", April:"أبريل",
  May:"مايو", June:"يونيو", July:"يوليو", August:"أغسطس",
  September:"سبتمبر", October:"أكتوبر", November:"نوفمبر", December:"ديسمبر"
};
const MONTH_EMOJI = {
  January:"❄️", February:"💕", March:"🌷", April:"🌧️", May:"🌸", June:"☀️",
  July:"🏖️", August:"🌻", September:"🎒", October:"🍂", November:"🍁", December:"🎄"
};

/* ---------- GAME 1 : MONTH MOUNTAIN ---------- */

const GAME_MONTHS = {
  id: "months",
  emoji: "🏔️",
  titleEn: "Month Mountain",
  titleAr: "جبل الشهور",
  character: "mahir",
  introEn: "Climb the mountain and learn the months of the year!",
  introAr: "تسلّق الجبل وتعلّم أشهر السنة!",
  activities: [
    {
      id:"explorer", type:"order", character:"mahir", speakOnPlace:true,
      tagEn:"Month Explorer", tagAr:"مستكشف الشهور",
      instructionsEn:"Put the months in the correct order.",
      instructionsAr:"رتّب الأشهر بالترتيب الصحيح.",
      rounds:[
        { items: MONTHS_EN.map((m,i)=>({id:"m"+i, labelEn:m, labelAr:MONTHS_AR[m], emoji:MONTH_EMOJI[m]})),
          hintEn:"Think about which month starts the year.", hintAr:"فكر: أي شهر يبدأ السنة؟" }
      ]
    },
    {
      id:"beforeafter", type:"mcq", character:"maya",
      tagEn:"Before and After", tagAr:"قبل وبعد",
      instructionsEn:"Choose the correct month.",
      instructionsAr:"اختر الشهر الصحيح.",
      rounds:[
        { promptEn:"What month comes after March?", promptAr:"ما الشهر الذي يأتي بعد مارس؟",
          options:["April","February","May"], correct:"April" },
        { promptEn:"What month comes before August?", promptAr:"ما الشهر الذي يأتي قبل أغسطس؟",
          options:["June","July","September"], correct:"July" },
        { promptEn:"What month comes after October?", promptAr:"ما الشهر الذي يأتي بعد أكتوبر؟",
          options:["November","September","December"], correct:"November" },
        { promptEn:"What month comes before January?", promptAr:"ما الشهر الذي يأتي قبل يناير؟",
          options:["November","December","February"], correct:"December" },
        { promptEn:"What month comes after June?", promptAr:"ما الشهر الذي يأتي بعد يونيو؟",
          options:["July","May","August"], correct:"July" },
        { promptEn:"What month comes before May?", promptAr:"ما الشهر الذي يأتي قبل مايو؟",
          options:["March","April","June"], correct:"April" }
      ]
    },
    {
      id:"listen", type:"mcq", character:"marya", audio:true,
      tagEn:"Listen and Choose", tagAr:"استمع واختر",
      instructionsEn:"Listen, then choose the month you heard.",
      instructionsAr:"استمع، ثم اختر الشهر الذي سمعته.",
      rounds:[
        { promptEn:"Which month did you hear?", promptAr:"ما الشهر الذي سمعته؟", speak:"September",
          options:["September","November","October"], correct:"September" },
        { promptEn:"Which month did you hear?", promptAr:"ما الشهر الذي سمعته؟", speak:"February",
          options:["February","December","June"], correct:"February" },
        { promptEn:"Which month did you hear?", promptAr:"ما الشهر الذي سمعته؟", speak:"July",
          options:["July","June","January"], correct:"July" },
        { promptEn:"Which month did you hear?", promptAr:"ما الشهر الذي سمعته؟", speak:"April",
          options:["April","August","May"], correct:"April" },
        { promptEn:"Which month did you hear?", promptAr:"ما الشهر الذي سمعته؟", speak:"November",
          options:["November","December","October"], correct:"November" }
      ]
    },
    {
      id:"challenge", type:"order", character:"mahir", speakOnPlace:true,
      tagEn:"Month Challenge", tagAr:"تحدي الشهور",
      instructionsEn:"Put these months back in order!",
      instructionsAr:"أعد ترتيب هذه الأشهر!",
      rounds:[
        { items:["March","April","May","June"].map((m,i)=>({id:"c1_"+i, labelEn:m, labelAr:MONTHS_AR[m], emoji:MONTH_EMOJI[m]})) },
        { items:["July","August","September","October"].map((m,i)=>({id:"c2_"+i, labelEn:m, labelAr:MONTHS_AR[m], emoji:MONTH_EMOJI[m]})) },
        { items:["October","November","December","January"].map((m,i)=>({id:"c3_"+i, labelEn:m, labelAr:MONTHS_AR[m], emoji:MONTH_EMOJI[m]})) }
      ]
    }
  ]
};

/* ---------- GAME 2 : MEASUREMENT VALLEY ---------- */

const GAME_MEASURE = {
  id:"measure",
  emoji:"📏",
  titleEn:"Measurement Valley",
  titleAr:"وادي القياس",
  character:"maya",
  introEn:"Learn to ask How many...? and How long...?",
  introAr:"تعلّم كيف تسأل: كم العدد؟ وكم الطول؟",
  activities:[
    {
      id:"teach", type:"teach", character:"maya",
      tagEn:"Learn With Maya", tagAr:"تعلّم مع مايا",
      instructionsEn:"How many? or How long?",
      instructionsAr:"كم العدد؟ أم كم الطول؟",
      teachBlocks:[
        { pillEn:"How many...?",
          descEn:"Ask this for things you can count.", descAr:"اسأل بهذا عن <strong>أشياء يمكن عدّها</strong>.",
          examples:[ { emoji:"🍎🍎🍎🍎", textEn:"How many apples? → 4 apples" } ] },
        { pillEn:"How long...?", accent:true,
          descEn:"Ask this for length, or for time.", descAr:"اسأل بهذا <strong>عن الطول، أو عن الوقت</strong>.",
          examples:[
            { emoji:"✏️", textEn:"How long is the pencil? → 14 cm" },
            { emoji:"🎬", textEn:"How long is the movie? → 2 hours" }
          ] }
      ]
    },
    {
      id:"howmany", type:"mcq", character:"marya",
      tagEn:"Which Question Fits?", tagAr:"أي سؤال يناسب؟",
      instructionsEn:"Look at the picture, then choose the correct question word.",
      instructionsAr:"انظر إلى الصورة، ثم اختر أداة السؤال الصحيحة.",
      rounds:[
        { visualKind:"count", emoji:"🍎", count:4, nounEn:"apples", nounAr:"تفاحات",
          promptEn:"_____ apples are on the table?", promptAr:"_____ تفاحة على الطاولة؟",
          options:["How many","How long"], correct:"How many" },
        { visualKind:"ruler", itemEn:"pencil", itemAr:"القلم", emoji:"✏️", widthPct:47,
          promptEn:"_____ is your pencil?", promptAr:"_____ قلمك؟",
          options:["How many","How long"], correct:"How long" },
        { visualKind:"count", emoji:"📚", count:6, nounEn:"books", nounAr:"كتب",
          promptEn:"_____ books does Sara have?", promptAr:"_____ كتابًا لدى سارة؟",
          options:["How many","How long"], correct:"How many" },
        { visualKind:"ruler", itemEn:"rope", itemAr:"الحبل", emoji:"🪢", widthPct:70,
          promptEn:"_____ is the rope?", promptAr:"_____ طول الحبل؟",
          options:["How many","How long"], correct:"How long" },
        { visualKind:"count", emoji:"🐱", count:5, nounEn:"cats", nounAr:"قطط",
          promptEn:"_____ cats are playing in the garden?", promptAr:"_____ قطة تلعب في الحديقة؟",
          options:["How many","How long"], correct:"How many" },
        { visualKind:"count", emoji:"⭐", count:7, nounEn:"stars", nounAr:"نجوم",
          promptEn:"_____ stars can you see tonight?", promptAr:"_____ نجمة يمكنك رؤيتها الليلة؟",
          options:["How many","How long"], correct:"How many" }
      ]
    },
    {
      id:"howlong", type:"mcq", character:"maya",
      tagEn:"How Long or How Many?", tagAr:"كم الطول أم كم العدد؟",
      instructionsEn:"Remember: How long? can ask about length OR about time!",
      instructionsAr:"تذكّر: يمكن أن يُستخدم كم الطول؟ للسؤال عن الطول أو عن الوقت!",
      rounds:[
        { visualKind:"duration", emoji:"🎬", itemEn:"the movie", itemAr:"الفيلم",
          promptEn:"_____ is the movie?", promptAr:"_____ يستغرق الفيلم؟",
          options:["How many","How long"], correct:"How long" },
        { visualKind:"count", emoji:"🎈", count:8, nounEn:"balloons", nounAr:"بالونات",
          promptEn:"_____ balloons are at the party?", promptAr:"_____ بالونًا في الحفلة؟",
          options:["How many","How long"], correct:"How many" },
        { visualKind:"duration", emoji:"🚗", itemEn:"the trip to Riyadh", itemAr:"الرحلة إلى الرياض",
          promptEn:"_____ is the trip to Riyadh?", promptAr:"_____ تستغرق الرحلة إلى الرياض؟",
          options:["How many","How long"], correct:"How long" },
        { visualKind:"count", emoji:"✏️", count:3, nounEn:"pencils", nounAr:"أقلام",
          promptEn:"_____ pencils are in your bag?", promptAr:"_____ قلمًا في حقيبتك؟",
          options:["How many","How long"], correct:"How many" }
      ]
    }
  ]
};

/* ---------- GAME 3 : NUMBER KINGDOM ---------- */

const GAME_NUMBERS = {
  id:"numbers",
  emoji:"🔢",
  titleEn:"Number Kingdom",
  titleAr:"مملكة الأرقام",
  character:"marya",
  introEn:"Read and build numbers from 0 to 1000!",
  introAr:"اقرأ الأرقام وابنِها من 0 إلى 1000!",
  activities:[
    {
      id:"explorer", type:"mcq", character:"maya", visualKind:"bignum",
      tagEn:"Number Explorer (1-20)", tagAr:"مستكشف الأرقام (1-20)",
      instructionsEn:"What number is this?",
      instructionsAr:"ما هذا الرقم؟",
      rounds:[
        { num:5, distractors:[15,50] },
        { num:8, distractors:[18,80] },
        { num:11, distractors:[1,21] },
        { num:14, distractors:[40,4] },
        { num:17, distractors:[70,7] },
        { num:20, distractors:[12,2] }
      ].map(r=>({
        num:r.num, promptEn:"What number is this?", promptAr:"ما هذا الرقم؟",
        options: shuffle([numberToWords(r.num), ...r.distractors.map(numberToWords)]),
        correct: numberToWords(r.num)
      }))
    },
    {
      id:"readingRule", type:"teach", character:"maya",
      tagEn:"Reading Big Numbers", tagAr:"قراءة الأرقام الكبيرة",
      instructionsEn:"How do we read numbers 21 and up?",
      instructionsAr:"كيف نقرأ الأرقام من 21 وما فوق؟",
      teachBlocks:[
        { pillEn:"Read Left to Right",
          descEn:"Read the number from left to right.", descAr:"اقرأ الرقم من اليسار إلى اليمين.",
          arrowDemo:{ num:"21", word:"twenty-one" } }
      ]
    },
    {
      id:"buildOrder", type:"order", character:"mahir", speakOnPlace:true,
      tagEn:"Read It in Order", tagAr:"اقرأها بالترتيب",
      instructionsEn:"Drag the words into order, left to right.",
      instructionsAr:"اسحب الكلمات بالترتيب، من اليسار إلى اليمين.",
      rounds:[
        { num:21, words:["Twenty","One"] },
        { num:34, words:["Thirty","Four"] },
        { num:58, words:["Fifty","Eight"] },
        { num:76, words:["Seventy","Six"] },
        { num:45, words:["Forty","Five"] }
      ].map((r,ri)=>({
        storyEn:"Number: "+r.num, storyAr:"الرقم: "+r.num, storyBig:true,
        items: r.words.map((w,i)=>({id:"bo"+ri+"_"+i, labelEn:w}))
      }))
    },
    {
      id:"build", type:"build", character:"marya",
      tagEn:"Build the Number", tagAr:"ابنِ الرقم",
      instructionsEn:"Choose hundreds, tens, and ones to build the number.",
      instructionsAr:"اختر المئات والعشرات والآحاد لتبني الرقم.",
      rounds:[125,347,508,730].map(n=>{
        const h = Math.floor(n/100)*100, t = Math.floor((n%100)/10)*10, o = n%10;
        function pickOptions(correct, pool){
          const distractors = shuffle(pool.filter(v=>v!==correct)).slice(0,3);
          return shuffle([correct, ...distractors]);
        }
        return {
          target:n,
          hundredsOptions: pickOptions(h, [0,100,200,300,400,500,600,700,800]),
          correctHundreds:h,
          tensOptions: pickOptions(t, [0,10,20,30,40,50,60,70,80,90]),
          correctTens:t,
          onesOptions: pickOptions(o, [0,1,2,3,4,5,6,7,8,9]),
          correctOnes:o
        };
      })
    },
    {
      id:"listen", type:"mcq", character:"mahir", audio:true, visualKind:"digits",
      tagEn:"Listen and Choose", tagAr:"استمع واختر",
      instructionsEn:"Listen to the number, then choose it.",
      instructionsAr:"استمع إلى الرقم، ثم اختره.",
      rounds:[
        { speak:numberToWords(625), promptEn:"Which number did you hear?", promptAr:"ما الرقم الذي سمعته؟",
          options:["625","652","265"], correct:"625" },
        { speak:numberToWords(148), promptEn:"Which number did you hear?", promptAr:"ما الرقم الذي سمعته؟",
          options:["148","184","418"], correct:"148" },
        { speak:numberToWords(903), promptEn:"Which number did you hear?", promptAr:"ما الرقم الذي سمعته؟",
          options:["903","930","309"], correct:"903" },
        { speak:numberToWords(276), promptEn:"Which number did you hear?", promptAr:"ما الرقم الذي سمعته؟",
          options:["276","267","726"], correct:"276" },
        { speak:numberToWords(540), promptEn:"Which number did you hear?", promptAr:"ما الرقم الذي سمعته؟",
          options:["540","504","450"], correct:"540" },
        { speak:numberToWords(999), promptEn:"Which number did you hear?", promptAr:"ما الرقم الذي سمعته؟",
          options:["999","909","990"], correct:"999" }
      ]
    },
    {
      id:"challenge", type:"mcq", character:"mahir",
      tagEn:"Number Challenge", tagAr:"تحدي الأرقام",
      instructionsEn:"Choose the correct answer.",
      instructionsAr:"اختر الإجابة الصحيحة.",
      rounds:[
        { promptEn:"What number comes after 99?", promptAr:"ما الرقم الذي يأتي بعد 99؟",
          options:["98","100","101"], correct:"100" },
        { promptEn:"What number comes before 200?", promptAr:"ما الرقم الذي يأتي قبل 200؟",
          options:["199","201","198"], correct:"199" },
        { promptEn:"What number comes before 500?", promptAr:"ما الرقم الذي يأتي قبل 500؟",
          options:["498","499","501"], correct:"499" },
        { promptEn:"What number comes after 799?", promptAr:"ما الرقم الذي يأتي بعد 799؟",
          options:["798","800","801"], correct:"800" },
        { promptEn:"What number comes before 1000?", promptAr:"ما الرقم الذي يأتي قبل 1000؟",
          options:["998","999","1000"], correct:"999" }
      ]
    }
  ]
};

/* ---------- GAME 4 : YESTERDAY'S ADVENTURE ---------- */

const PAST_VOCAB = [
  { id:"wokeup", en:"woke up", ar:"استيقظ", emoji:"⏰😴" },
  { id:"ate", en:"ate", ar:"أكل", emoji:"🍽️😋" },
  { id:"drank", en:"drank", ar:"شرب", emoji:"🥤" },
  { id:"did", en:"did", ar:"فعل", emoji:"📝✅" },
  { id:"went", en:"went", ar:"ذهب", emoji:"🚶‍♂️🏫" },
  { id:"saw", en:"saw", ar:"رأى", emoji:"👀🐦" },
  { id:"met", en:"met", ar:"قابل", emoji:"🤝😊" },
  { id:"relaxed", en:"relaxed", ar:"استرخى", emoji:"🛋️😌" },
  { id:"read", en:"read", ar:"قرأ", emoji:"📖" },
  { id:"fell", en:"fell", ar:"سقط", emoji:"🤕⬇️" }
];

const GAME_PAST = {
  id:"past",
  emoji:"🌙",
  titleEn:"Yesterday's Adventure",
  titleAr:"مغامرة الأمس",
  character:"malik",
  introEn:"Learn ten words to talk about yesterday!",
  introAr:"تعلّم عشر كلمات للحديث عن الأمس!",
  activities:[
    {
      id:"vocab", type:"vocab", character:"malik",
      tagEn:"Yesterday Words", tagAr:"كلمات الأمس",
      instructionsEn:"Tap a word to hear it and see its meaning.",
      instructionsAr:"اضغط على الكلمة لسماعها ومعرفة معناها.",
      words: PAST_VOCAB
    },
    {
      id:"match", type:"match", character:"marya",
      tagEn:"Match It", tagAr:"طابق الكلمة",
      instructionsEn:"Match the English word to the correct picture.",
      instructionsAr:"طابق الكلمة الإنجليزية مع الصورة الصحيحة.",
      rounds:[
        { pairs:["wokeup","ate","drank","went","read"].map(id=>{
            const w = PAST_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) },
        { pairs:["did","saw","met","relaxed","fell"].map(id=>{
            const w = PAST_VOCAB.find(v=>v.id===id);
            return { id:w.id, labelEn:w.en, labelAr:w.ar, emoji:w.emoji };
          }) }
      ]
    },
    {
      id:"whathappened", type:"mcq", character:"mahir", visualKind:"story",
      tagEn:"What Happened?", tagAr:"ماذا حدث؟",
      instructionsEn:"Look at the story, then answer.",
      instructionsAr:"انظر إلى القصة، ثم أجب.",
      rounds:[
        { story:["😴⏰","🍽️","🚶‍♂️🌳"], storyEn:"Mahir wakes up. Then he eats breakfast. Then he goes outside.",
          promptEn:"What did Mahir do first?", promptAr:"ماذا فعل ماهر أولاً؟",
          options:["woke up","ate","went"], correct:"woke up" },
        { story:["😴⏰","🍽️","🚶‍♂️🌳"], storyEn:"Mahir wakes up. Then he eats breakfast. Then he goes outside.",
          promptEn:"What did Mahir do next, after he woke up?", promptAr:"ماذا فعل ماهر بعد أن استيقظ؟",
          options:["went","ate","saw"], correct:"ate" },
        { story:["😴⏰","🍽️","🚶‍♂️🌳"], storyEn:"Mahir wakes up. Then he eats breakfast. Then he goes outside.",
          promptEn:"What did Mahir do last?", promptAr:"ماذا فعل ماهر أخيرًا؟",
          options:["woke up","went","drank"], correct:"went" }
      ]
    },
    {
      id:"complete", type:"mcq", character:"maya",
      tagEn:"Complete the Sentence", tagAr:"أكمل الجملة",
      instructionsEn:"Choose the correct word.",
      instructionsAr:"اختر الكلمة الصحيحة.",
      rounds:[
        { promptEn:"Yesterday, Mahir ______ to school.", promptAr:"أمس، ذهب ماهر إلى المدرسة.",
          options:["went","ate","drank"], correct:"went" },
        { promptEn:"Maya ______ a book yesterday.", promptAr:"قرأت مايا كتابًا أمس.",
          options:["read","saw","fell"], correct:"read" },
        { promptEn:"Marya ______ her homework.", promptAr:"قامت ماريا بواجبها.",
          options:["did","met","relaxed"], correct:"did" },
        { promptEn:"Malik ______ his friend at the park.", promptAr:"قابل مالك صديقه في الحديقة.",
          options:["met","saw","drank"], correct:"met" },
        { promptEn:"I ______ water because I was thirsty.", promptAr:"شربتُ الماء لأنني كنت عطشانًا.",
          options:["drank","fell","woke up"], correct:"drank" },
        { promptEn:"The cat ______ off the chair.", promptAr:"سقطت القطة من الكرسي.",
          options:["fell","relaxed","ate"], correct:"fell" }
      ]
    },
    {
      id:"storyorder", type:"order", character:"malik", orderMode:"words",
      tagEn:"Story in Order", tagAr:"رتّب القصة",
      instructionsEn:"Put the story events in the correct order.",
      instructionsAr:"رتّب أحداث القصة بالترتيب الصحيح.",
      rounds:[
        { storyEn:"Yesterday, Mahir woke up. Then he ate breakfast. Then he went to the park. Then he saw a bird.",
          storyAr:"أمس، استيقظ ماهر. ثم أكل الفطور. ثم ذهب إلى الحديقة. ثم رأى عصفورًا.",
          items:["wokeup","ate","went","saw"].map((id,i)=>{
            const w = PAST_VOCAB.find(v=>v.id===id); return {id:"s1_"+i, labelEn:w.en, labelAr:w.ar, emoji:w.emoji, key:id};
          }) },
        { storyEn:"Yesterday, Maya met her friend. Then they relaxed together. Then Maya read a story. At the end, her book fell.",
          storyAr:"أمس، قابلت مايا صديقتها. ثم استرختا معًا. ثم قرأت مايا قصة. وفي النهاية سقط كتابها.",
          items:["met","relaxed","read","fell"].map((id,i)=>{
            const w = PAST_VOCAB.find(v=>v.id===id); return {id:"s2_"+i, labelEn:w.en, labelAr:w.ar, emoji:w.emoji, key:id};
          }) }
      ]
    },
    {
      id:"listen", type:"mcq", character:"marya", audio:true,
      tagEn:"Listen and Choose", tagAr:"استمع واختر",
      instructionsEn:"Listen to the word, then choose it.",
      instructionsAr:"استمع إلى الكلمة، ثم اخترها.",
      rounds:["wokeup","ate","drank","did","saw","fell"].map(id=>{
        const w = PAST_VOCAB.find(v=>v.id===id);
        const distractors = shuffle(PAST_VOCAB.filter(v=>v.id!==id)).slice(0,2).map(v=>v.en);
        return {
          speak:w.en, promptEn:"Which word did you hear?", promptAr:"ما الكلمة التي سمعتها؟",
          options: shuffle([w.en, ...distractors]), correct:w.en
        };
      })
    }
  ]
};

/* ---------- GAME 5 : SUPERLATIVE SUMMIT ---------- */

const GAME_SUPER = {
  id:"super",
  emoji:"🏆",
  titleEn:"Superlative Summit",
  titleAr:"قمة التفضيل",
  character:"marya",
  introEn:"Learn to build superlatives: tallest, biggest, and more!",
  introAr:"تعلّم صيغة التفضيل: الأطول، الأكبر، والمزيد!",
  activities:[
    {
      id:"teach", type:"teach", character:"maya",
      tagEn:"Learn Superlatives", tagAr:"تعلّم صيغة التفضيل",
      instructionsEn:"How do we compare 3 or more things?",
      instructionsAr:"كيف نقارن بين 3 أشياء أو أكثر؟",
      teachBlocks:[
        { pillEn:"Add -est",
          descEn:"Add -est to the end of the word.", descAr:"<strong>أضف -est إلى نهاية الكلمة</strong>.",
          examples:[
            { emoji:"📏", textEn:"tall → tallest" },
            { emoji:"📦", textEn:"big → biggest" }
          ] },
        { pillEn:"Use most", accent:true,
          descEn:"For longer words, use most before the word instead.", descAr:"<strong>للكلمات الأطول، استخدم most</strong> قبل الكلمة بدلاً من ذلك.",
          examples:[
            { emoji:"🧩", textEn:"difficult → most difficult" }
          ] }
      ]
    },
    {
      id:"tallest", type:"mcq", character:"mahir", visualKind:"adjective",
      tagEn:"Tallest", tagAr:"الأطول",
      instructionsEn:"Choose the correct word to finish the sentence.",
      instructionsAr:"اختر الكلمة الصحيحة لإكمال الجملة.",
      rounds:[
        { emoji:"🧍", baseWordEn:"tall", baseWordAr:"طويل",
          promptEn:"Ali is the _____ boy in the class.", promptAr:"علي هو الولد _____ في الصف.",
          options:["tallest","taller","more tall"], correct:"tallest" },
        { emoji:"🏢", baseWordEn:"tall", baseWordAr:"طويل",
          promptEn:"This is the _____ building in the city.", promptAr:"هذا هو المبنى _____ في المدينة.",
          options:["tallest","taller","tall"], correct:"tallest" }
      ]
    },
    {
      id:"biggest", type:"mcq", character:"maya", visualKind:"adjective",
      tagEn:"Biggest", tagAr:"الأكبر",
      instructionsEn:"Choose the correct word to finish the sentence.",
      instructionsAr:"اختر الكلمة الصحيحة لإكمال الجملة.",
      rounds:[
        { emoji:"🐘", baseWordEn:"big", baseWordAr:"كبير",
          promptEn:"The elephant is the _____ animal at the zoo.", promptAr:"الفيل هو الحيوان _____ في حديقة الحيوان.",
          options:["biggest","bigest","more big"], correct:"biggest" },
        { emoji:"🏠", baseWordEn:"big", baseWordAr:"كبير",
          promptEn:"That is the _____ house on our street.", promptAr:"هذا هو المنزل _____ في شارعنا.",
          options:["biggest","bigest","bigger"], correct:"biggest" }
      ]
    },
    {
      id:"longest", type:"mcq", character:"marya", visualKind:"adjective",
      tagEn:"Longest", tagAr:"الأطول",
      instructionsEn:"Choose the correct word to finish the sentence.",
      instructionsAr:"اختر الكلمة الصحيحة لإكمال الجملة.",
      rounds:[
        { emoji:"🏞️", baseWordEn:"long", baseWordAr:"طويل",
          promptEn:"The Nile is the _____ river in Africa.", promptAr:"النيل هو النهر _____ في أفريقيا.",
          options:["longest","longer","more long"], correct:"longest" },
        { emoji:"🐍", baseWordEn:"long", baseWordAr:"طويل",
          promptEn:"That snake is the _____ one at the zoo.", promptAr:"ذلك الثعبان هو _____ واحد في حديقة الحيوان.",
          options:["longest","longer","long"], correct:"longest" }
      ]
    },
    {
      id:"easiest", type:"mcq", character:"maya", visualKind:"adjective",
      tagEn:"Easiest", tagAr:"الأسهل",
      instructionsEn:"Choose the correct word to finish the sentence.",
      instructionsAr:"اختر الكلمة الصحيحة لإكمال الجملة.",
      rounds:[
        { emoji:"📝", baseWordEn:"easy", baseWordAr:"سهل",
          promptEn:"That was the _____ question on the test.", promptAr:"كان ذلك السؤال _____ في الاختبار.",
          options:["easiest","easyest","more easy"], correct:"easiest" },
        { emoji:"🧹", baseWordEn:"easy", baseWordAr:"سهل",
          promptEn:"Cleaning my room is the _____ chore.", promptAr:"تنظيف غرفتي هو المهمة _____.",
          options:["easiest","easyest","easier"], correct:"easiest" }
      ]
    },
    {
      id:"hardest", type:"mcq", character:"mahir", visualKind:"adjective",
      tagEn:"Most Difficult", tagAr:"الأصعب",
      instructionsEn:"Choose the correct word to finish the sentence.",
      instructionsAr:"اختر الكلمة الصحيحة لإكمال الجملة.",
      rounds:[
        { emoji:"🧩", baseWordEn:"difficult", baseWordAr:"صعب",
          promptEn:"This is the _____ puzzle I have ever seen.", promptAr:"هذا هو اللغز _____ الذي رأيته على الإطلاق.",
          options:["most difficult","difficultest","more difficult"], correct:"most difficult" },
        { emoji:"📐", baseWordEn:"difficult", baseWordAr:"صعب",
          promptEn:"Math is the _____ subject for me.", promptAr:"الرياضيات هي المادة _____ بالنسبة لي.",
          options:["most difficult","difficultest","difficulter"], correct:"most difficult" }
      ]
    },
    {
      id:"funniest", type:"mcq", character:"malik", visualKind:"adjective",
      tagEn:"Funniest", tagAr:"الأكثر إضحاكًا",
      instructionsEn:"Choose the correct word to finish the sentence.",
      instructionsAr:"اختر الكلمة الصحيحة لإكمال الجملة.",
      rounds:[
        { emoji:"🤡", baseWordEn:"funny", baseWordAr:"مضحك",
          promptEn:"That was the _____ joke I ever heard!", promptAr:"كانت تلك أكثر نكتة _____ سمعتها!",
          options:["funniest","funnyest","most funny"], correct:"funniest" },
        { emoji:"🎬", baseWordEn:"funny", baseWordAr:"مضحك",
          promptEn:"This is the _____ movie in the world!", promptAr:"هذا هو الفيلم _____ في العالم!",
          options:["funniest","funnyest","funnier"], correct:"funniest" }
      ]
    },
    {
      id:"challenge", type:"mcq", character:"malik", visualKind:"adjective",
      tagEn:"Superlative Challenge", tagAr:"تحدي التفضيل",
      instructionsEn:"Choose the correct superlative word.",
      instructionsAr:"اختر كلمة التفضيل الصحيحة.",
      rounds:[
        { emoji:"🧍", baseWordEn:"tall", baseWordAr:"طويل",
          promptEn:"Omar is the _____ boy in the school.", promptAr:"عمر هو الولد _____ في المدرسة.",
          options:["tallest","taller","more tall"], correct:"tallest" },
        { emoji:"🐋", baseWordEn:"big", baseWordAr:"كبير",
          promptEn:"The blue whale is the _____ animal on Earth.", promptAr:"الحوت الأزرق هو الحيوان _____ على الأرض.",
          options:["biggest","bigest","more big"], correct:"biggest" },
        { emoji:"🛣️", baseWordEn:"long", baseWordAr:"طويل",
          promptEn:"This is the _____ road in the city.", promptAr:"هذا هو الطريق _____ في المدينة.",
          options:["longest","longer","more long"], correct:"longest" },
        { emoji:"🎮", baseWordEn:"easy", baseWordAr:"سهل",
          promptEn:"That was the _____ game we played.", promptAr:"كانت تلك اللعبة _____ التي لعبناها.",
          options:["easiest","easyest","more easy"], correct:"easiest" },
        { emoji:"♟️", baseWordEn:"difficult", baseWordAr:"صعب",
          promptEn:"Chess is the _____ game to learn.", promptAr:"الشطرنج هي اللعبة _____ لتعلّمها.",
          options:["most difficult","difficultest","difficulter"], correct:"most difficult" },
        { emoji:"😂", baseWordEn:"funny", baseWordAr:"مضحك",
          promptEn:"He told the _____ story in class!", promptAr:"روى القصة _____ في الصف!",
          options:["funniest","funnyest","most funny"], correct:"funniest" }
      ]
    }
  ]
};

const ALL_GAMES = [GAME_MONTHS, GAME_MEASURE, GAME_NUMBERS, GAME_PAST, GAME_SUPER];
