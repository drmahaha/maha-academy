/* ===========================================================
   Maha Academy — Grade 7 Social Studies Adventure — Content Data
   Saudi public school curriculum:
   الدراسات الاجتماعية والمواطنة — الصف الأول المتوسط (الفصل الدراسي الأول)
     الوحدة الأولى:  الكون والأرض
     الوحدة الثانية: الحضارات
     الوحدة الثالثة: التخطيط
     الوحدة الرابعة: العصر النبوي
   Arabic-primary throughout; English shown only as .en-badge.
   Activity types: terms, concept, mcq, keypad, numberline, match
   (numberline is used as an ordering line: planets from the Sun,
    planning steps, and a timeline in Hijri years)
   =========================================================== */

const ALL_GAMES = [

  /* ============================================================
     STATION 1 — الكون والأرض (The Universe and the Earth) — ماهر
     ============================================================ */
  {
    id: "s1-universe",
    titleAr: "رحلة الكون والأرض",
    titleEn: "The Universe & the Earth",
    emoji: "🌍",
    character: "mahir",
    activities: [
      {
        type: "terms",
        tagAr: "مفردات جديدة", tagEn: "New Words",
        instructionsAr: "تعرّف على مفردات الكون والأرض! اضغط على كل بطاقة.",
        instructionsEn: "Learn the words of the universe and the Earth! Tap each card.",
        terms: [
          { emoji: "🌌", ar: "المجرة", en: "Galaxy" },
          { emoji: "☀️", ar: "المجموعة الشمسية", en: "Solar system" },
          { emoji: "🪐", ar: "كوكب", en: "Planet" },
          { emoji: "🌙", ar: "القمر (تابع)", en: "Moon (satellite)" },
          { emoji: "🟰", ar: "خط الاستواء", en: "Equator" },
          { emoji: "↕️", ar: "خطوط الطول", en: "Longitude lines" },
          { emoji: "↔️", ar: "دوائر العرض", en: "Latitude lines" },
          { emoji: "🔄", ar: "دوران الأرض", en: "Earth's rotation" }
        ]
      },
      {
        type: "concept",
        tagAr: "لنتعلّم!", tagEn: "Let's Learn!",
        conceptBlocks: [
          {
            pillAr: "الأرض في المجموعة الشمسية",
            descAr: "تتكوّن المجموعة الشمسية من الشمس وثمانية كواكب تدور حولها. الأرض هي الكوكب الثالث بُعدًا عن الشمس، وهي الكوكب الوحيد المعروف بوجود الحياة عليه.",
            descEn: "The solar system is the Sun and eight planets. Earth is the third planet from the Sun.",
            examples: [ { emoji: "☀️ 🪐", textAr: "عطارد ← الزهرة ← الأرض ← المريخ ← المشتري ← زحل ← أورانوس ← نبتون" } ]
          },
          {
            pillAr: "شكل الأرض والخطوط الوهمية",
            descAr: "الأرض كروية الشكل، مفلطحة قليلًا عند القطبين. رسم العلماء عليها خطوطًا وهمية: دوائر العرض موازية لخط الاستواء (دائرة العرض صفر)، وخطوط الطول تمتد من القطب الشمالي إلى القطب الجنوبي، وخط الطول الرئيس هو خط غرينتش (صفر).",
            descEn: "Latitude lines are parallel to the Equator (0°). Longitude lines run pole to pole; Greenwich is 0°.",
            examples: [ { emoji: "🧭", textAr: "خطوط الطول: 360 خطًا — دوائر العرض: 180 دائرة (90 شمالًا و90 جنوبًا)" } ]
          },
          {
            pillAr: "حركتا الأرض",
            descAr: "تدور الأرض حول محورها مرة كل 24 ساعة فيحدث الليل والنهار، وتدور حول الشمس مرة كل 365 يومًا وربع اليوم تقريبًا فتحدث الفصول الأربعة.",
            descEn: "Rotation (24 hours) makes day and night. Revolution around the Sun (about 365¼ days) makes the four seasons.",
            examples: [ { emoji: "🌗", textAr: "حول المحور ← الليل والنهار" }, { emoji: "🍂", textAr: "حول الشمس ← الفصول الأربعة" } ],
            accent: true
          }
        ]
      },
      {
        type: "numberline",
        tagAr: "رتّب الكواكب", tagEn: "Order the Planets",
        instructionsAr: "اختر كوكبًا ثم ضعه على رقم ترتيبه من الشمس (1 هو الأقرب إلى الشمس).",
        instructionsEn: "Pick a planet, then put it on its order from the Sun (1 is the closest).",
        rounds: [
          { min: 1, max: 8,
            items: [
              { id: "mercury", value: 1, emoji: "🪨", labelAr: "عطارد" },
              { id: "venus", value: 2, emoji: "🟡", labelAr: "الزهرة" },
              { id: "earth", value: 3, emoji: "🌍", labelAr: "الأرض" },
              { id: "mars", value: 4, emoji: "🔴", labelAr: "المريخ" }
            ],
            hintAr: "عطارد هو الأقرب إلى الشمس، والأرض هي الكوكب الثالث.",
            hintEn: "Mercury is closest to the Sun; Earth is the third planet." },
          { min: 1, max: 8,
            items: [
              { id: "jupiter", value: 5, emoji: "🟠", labelAr: "المشتري" },
              { id: "saturn", value: 6, emoji: "🪐", labelAr: "زحل" },
              { id: "uranus", value: 7, emoji: "🔵", labelAr: "أورانوس" },
              { id: "neptune", value: 8, emoji: "🌀", labelAr: "نبتون" }
            ],
            hintAr: "بعد المريخ يأتي المشتري (5)، ونبتون هو الأبعد عن الشمس (8).",
            hintEn: "After Mars comes Jupiter (5); Neptune is the farthest (8)." }
        ]
      },
      {
        type: "mcq",
        tagAr: "اختر الإجابة", tagEn: "Choose the Answer",
        rounds: [
          { promptAr: "ما ترتيب كوكب الأرض بُعدًا عن الشمس؟", promptEn: "What is Earth's order from the Sun?", big: "☀️ 🌍",
            options: ["الأول", "الثالث", "الخامس"], correct: "الثالث",
            hintAr: "قبل الأرض كوكبان فقط: عطارد والزهرة.", hintEn: "Only two planets come before Earth." },
          { promptAr: "ما أكبر كواكب المجموعة الشمسية؟", promptEn: "Which is the largest planet?", big: "🪐",
            options: ["المشتري", "المريخ", "عطارد"], correct: "المشتري" },
          { promptAr: "ما سبب تعاقب الليل والنهار؟", promptEn: "What causes day and night?", big: "🌗",
            options: ["دوران الأرض حول محورها", "دوران الأرض حول الشمس", "دوران القمر حول الأرض"], correct: "دوران الأرض حول محورها",
            hintAr: "هذه الحركة تستغرق 24 ساعة.", hintEn: "This movement takes 24 hours." },
          { promptAr: "ما سبب حدوث الفصول الأربعة؟", promptEn: "What causes the four seasons?", big: "☀️🍂❄️🌸",
            options: ["دوران الأرض حول الشمس", "دوران الأرض حول محورها", "حركة الرياح"], correct: "دوران الأرض حول الشمس" },
          { promptAr: "ما أكبر دوائر العرض، ورقمها صفر؟", promptEn: "Which is the largest latitude line (0°)?", big: "🌐",
            options: ["خط الاستواء", "خط غرينتش", "مدار السرطان"], correct: "خط الاستواء",
            hintAr: "يقسم الأرض إلى نصف شمالي ونصف جنوبي.", hintEn: "It divides Earth into north and south halves." },
          { promptAr: "ما اسم خط الطول الرئيس (صفر)؟", promptEn: "What is the prime meridian (0°) called?", big: "🧭",
            options: ["خط غرينتش", "خط الاستواء", "مدار الجدي"], correct: "خط غرينتش" }
        ]
      },
      {
        type: "keypad",
        tagAr: "أرقام من الكون", tagEn: "Numbers of the Universe",
        rounds: [
          { promptAr: "كم عدد كواكب المجموعة الشمسية؟", promptEn: "How many planets are in the solar system?", big: "🪐", correct: 8, allowNegative: false,
            hintAr: "عطارد، الزهرة، الأرض، المريخ، المشتري، زحل، أورانوس، نبتون… عُدّها!", hintEn: "Count them!" },
          { promptAr: "كم ساعة تحتاج الأرض لتدور حول محورها دورة كاملة؟", promptEn: "How many hours for one rotation?", big: "🔄", correct: 24, allowNegative: false,
            hintAr: "هي عدد ساعات اليوم الواحد.", hintEn: "It's the number of hours in one day." },
          { promptAr: "كم يومًا (تقريبًا) تحتاج الأرض لتدور حول الشمس؟", promptEn: "About how many days for one revolution?", big: "☀️", correct: 365, allowNegative: false,
            hintAr: "هي عدد أيام السنة الميلادية.", hintEn: "It's the number of days in a year." },
          { promptAr: "كم عدد خطوط الطول؟", promptEn: "How many longitude lines are there?", big: "↕️", correct: 360, allowNegative: false,
            hintAr: "180 شرق غرينتش + 180 غربه.", hintEn: "180 east + 180 west." },
          { promptAr: "ما رقم دائرة العرض لخط الاستواء؟", promptEn: "What is the Equator's latitude?", big: "🟰", correct: 0, allowNegative: false,
            hintAr: "منه نبدأ العدّ شمالًا وجنوبًا.", hintEn: "We start counting from it." }
        ]
      },
      {
        type: "match",
        tagAr: "صِل بين المتشابهين", tagEn: "Match",
        matchDir: "rtl",
        instructionsAr: "اضغط على مصطلح من اليمين ثم على معناه من اليسار.",
        instructionsEn: "Tap a term, then tap its meaning.",
        rounds: [
          { pairs: [
            { id: "mer", labelAr: "عطارد", matchLabel: "أقرب كوكب إلى الشمس" },
            { id: "jup", labelAr: "المشتري", matchLabel: "أكبر كوكب" },
            { id: "sat", labelAr: "زحل", matchLabel: "كوكب الحلقات" },
            { id: "moon", labelAr: "القمر", matchLabel: "تابع يدور حول الأرض" }
          ], hintAr: "زحل مشهور بحلقاته الجميلة.", hintEn: "Saturn is famous for its rings." },
          { pairs: [
            { id: "eq", labelAr: "خط الاستواء", matchLabel: "دائرة العرض صفر" },
            { id: "gr", labelAr: "خط غرينتش", matchLabel: "خط الطول صفر" },
            { id: "rot", labelAr: "الدوران حول المحور", matchLabel: "الليل والنهار" },
            { id: "rev", labelAr: "الدوران حول الشمس", matchLabel: "الفصول الأربعة" }
          ] }
        ]
      },
      {
        type: "mcq",
        tagAr: "تحدّي سطح الأرض", tagEn: "Earth's Surface Challenge",
        rounds: [
          { promptAr: "ما أكبر قارات العالم مساحة؟", promptEn: "Which is the largest continent?", big: "🗺️",
            options: ["آسيا", "أفريقيا", "أوروبا"], correct: "آسيا" },
          { promptAr: "في أي قارة تقع المملكة العربية السعودية؟", promptEn: "Which continent is Saudi Arabia in?", big: "🇸🇦",
            options: ["آسيا", "أفريقيا", "أستراليا"], correct: "آسيا" },
          { promptAr: "ما أكبر محيطات العالم؟", promptEn: "Which is the largest ocean?", big: "🌊",
            options: ["المحيط الهادي", "المحيط الأطلسي", "المحيط الهندي"], correct: "المحيط الهادي" },
          { promptAr: "أيهما يغطي مساحة أكبر من سطح الأرض؟", promptEn: "Which covers more of Earth's surface?", big: "🌊 ⛰️",
            options: ["الماء", "اليابسة"], correct: "الماء",
            hintAr: "يغطي الماء نحو ثلاثة أرباع سطح الأرض.", hintEn: "Water covers about three quarters." },
          { promptAr: "كم عدد قارات العالم؟", promptEn: "How many continents are there?", big: "🌏",
            options: ["5", "7", "9"], correct: "7" }
        ]
      }
    ]
  },

  /* ============================================================
     STATION 2 — الحضارات (Civilizations) — مايا
     ============================================================ */
  {
    id: "s2-civilizations",
    titleAr: "مدينة الحضارات",
    titleEn: "City of Civilizations",
    emoji: "🏛️",
    character: "maya",
    activities: [
      {
        type: "terms",
        tagAr: "مفردات جديدة", tagEn: "New Words",
        instructionsAr: "تعرّفي على مفردات الحضارة! اضغط على كل بطاقة.",
        instructionsEn: "Learn the words of civilization! Tap each card.",
        terms: [
          { emoji: "🏛️", ar: "الحضارة", en: "Civilization" },
          { emoji: "🏺", ar: "الآثار", en: "Antiquities" },
          { emoji: "📜", ar: "الكتابة", en: "Writing" },
          { emoji: "🕌", ar: "الحضارة الإسلامية", en: "Islamic civilization" },
          { emoji: "🔬", ar: "العلوم والمعرفة", en: "Science & knowledge" },
          { emoji: "🕋", ar: "العمارة", en: "Architecture" },
          { emoji: "✒️", ar: "الخط العربي", en: "Arabic calligraphy" },
          { emoji: "🪙", ar: "الدينار والدرهم", en: "Dinar & dirham" }
        ]
      },
      {
        type: "concept",
        tagAr: "لنتعلّم!", tagEn: "Let's Learn!",
        conceptBlocks: [
          {
            pillAr: "ما الحضارة؟",
            descAr: "الحضارة هي كل ما يصنعه الإنسان من تقدّم في العلوم والعمارة والفنون والاقتصاد ونظام الحياة. ومن أقدم الحضارات: حضارة بلاد الرافدين، والحضارة المصرية القديمة، وحضارات الجزيرة العربية.",
            descEn: "Civilization is human progress in science, building, arts, economy and way of life.",
            examples: [ { emoji: "🏺", textAr: "الحِجر في العُلا: أول موقع سعودي في قائمة التراث العالمي" } ]
          },
          {
            pillAr: "الحضارة الإسلامية",
            descAr: "قامت الحضارة الإسلامية على القرآن الكريم والسنة النبوية، واهتمت بالعلم فبرز علماء كثيرون نفعوا البشرية.",
            descEn: "Islamic civilization was built on the Quran and Sunnah and valued knowledge.",
            examples: [
              { emoji: "🩺", textAr: "ابن سينا: الطب" },
              { emoji: "➗", textAr: "الخوارزمي: الجبر" },
              { emoji: "💡", textAr: "ابن الهيثم: الضوء والبصريات" },
              { emoji: "🗺️", textAr: "الإدريسي: الجغرافيا والخرائط" }
            ]
          },
          {
            pillAr: "العمارة والفنون والاقتصاد",
            descAr: "من سمات العمارة الإسلامية: القباب والمآذن والأقواس والزخارف النباتية والهندسية والخط العربي. ونشطت الزراعة والصناعة والتجارة، واستُخدم الدينار الذهبي والدرهم الفضي.",
            descEn: "Domes, minarets, arches, decoration and calligraphy; farming, industry, trade; gold dinar and silver dirham.",
            examples: [ { emoji: "🕌", textAr: "قبة + مئذنة + أقواس + زخرفة" } ],
            accent: true
          }
        ]
      },
      {
        type: "match",
        tagAr: "علماء المسلمين", tagEn: "Muslim Scholars",
        matchDir: "rtl",
        instructionsAr: "صِل كل عالم بالعلم الذي اشتهر به.",
        instructionsEn: "Match each scholar with his field.",
        rounds: [
          { pairs: [
            { id: "ibnsina", labelAr: "ابن سينا", matchLabel: "الطب 🩺" },
            { id: "khwar", labelAr: "الخوارزمي", matchLabel: "الجبر والرياضيات ➗" },
            { id: "haytham", labelAr: "ابن الهيثم", matchLabel: "الضوء والبصريات 💡" },
            { id: "idrisi", labelAr: "الإدريسي", matchLabel: "الجغرافيا والخرائط 🗺️" }
          ], hintAr: "كلمة «الخوارزميات» في الحاسب مأخوذة من اسم الخوارزمي.", hintEn: "The word 'algorithm' comes from al-Khwarizmi." },
          { pairs: [
            { id: "zahrawi", labelAr: "الزهراوي", matchLabel: "الجراحة وأدواتها 🔪" },
            { id: "dome", labelAr: "القبة", matchLabel: "سقف مستدير فوق المسجد" },
            { id: "minaret", labelAr: "المئذنة", matchLabel: "برج يُرفع منه الأذان" },
            { id: "dinar", labelAr: "الدينار", matchLabel: "عملة من الذهب" }
          ] }
        ]
      },
      {
        type: "mcq",
        tagAr: "اختر الإجابة", tagEn: "Choose the Answer",
        rounds: [
          { promptAr: "على أي شيء قامت الحضارة الإسلامية؟", promptEn: "What was Islamic civilization built on?", big: "📖",
            options: ["القرآن الكريم والسنة النبوية", "التجارة فقط", "الحروب"], correct: "القرآن الكريم والسنة النبوية" },
          { promptAr: "اشتهرت الحضارة المصرية القديمة بـ:", promptEn: "Ancient Egypt is famous for:", big: "🏜️",
            options: ["الأهرامات", "سور الصين", "برج إيفل"], correct: "الأهرامات" },
          { promptAr: "أين تقع الحِجر (مدائن صالح)؟", promptEn: "Where is Hegra (Mada'in Salih)?", big: "🏺",
            options: ["العُلا", "جدة", "الدمام"], correct: "العُلا",
            hintAr: "محافظة في منطقة المدينة المنورة مشهورة بآثارها.", hintEn: "A governorate in the Madinah region famous for heritage." },
          { promptAr: "أيّ مما يلي من سمات العمارة الإسلامية؟", promptEn: "Which is a feature of Islamic architecture?", big: "🕌",
            options: ["المآذن والقباب", "ناطحات السحاب الزجاجية", "الأكواخ الخشبية"], correct: "المآذن والقباب" },
          { promptAr: "الدرهم في الحضارة الإسلامية عملة مصنوعة من:", promptEn: "The dirham was made of:", big: "🪙",
            options: ["الفضة", "الذهب", "الورق"], correct: "الفضة",
            hintAr: "الدينار من الذهب، والدرهم من معدن آخر لامع.", hintEn: "The dinar was gold; the dirham another shiny metal." },
          { promptAr: "أيّ الأنشطة الاقتصادية نشط في الحضارة الإسلامية؟", promptEn: "Which economic activities flourished?", big: "🐪",
            options: ["الزراعة والصناعة والتجارة", "الزراعة فقط", "لا شيء"], correct: "الزراعة والصناعة والتجارة" }
        ]
      },
      {
        type: "mcq",
        tagAr: "تحدّي الحضارات", tagEn: "Civilizations Challenge",
        rounds: [
          { promptAr: "مَن العالِم المسلم الذي اشتهر بكتاب «القانون في الطب»؟", promptEn: "Who wrote 'The Canon of Medicine'?", big: "🩺",
            options: ["ابن سينا", "الإدريسي", "ابن الهيثم"], correct: "ابن سينا" },
          { promptAr: "مَن رسم خرائط دقيقة للعالم في الحضارة الإسلامية؟", promptEn: "Who drew accurate world maps?", big: "🗺️",
            options: ["الإدريسي", "الخوارزمي", "الزهراوي"], correct: "الإدريسي" },
          { promptAr: "دراسة الضوء وكيف نرى الأشياء ارتبطت بالعالِم:", promptEn: "The study of light is linked to:", big: "💡",
            options: ["ابن الهيثم", "ابن سينا", "الزهراوي"], correct: "ابن الهيثم" },
          { promptAr: "ما الفن الذي يزيّن المساجد بكتابة الآيات بأشكال جميلة؟", promptEn: "Which art decorates mosques with beautiful verses?", big: "✒️",
            options: ["الخط العربي", "الرسم الزيتي", "النحت"], correct: "الخط العربي" }
        ]
      }
    ]
  },

  /* ============================================================
     STATION 3 — التخطيط (Planning) — مالك
     ============================================================ */
  {
    id: "s3-planning",
    titleAr: "برج التخطيط",
    titleEn: "Planning Tower",
    emoji: "📋",
    character: "malik",
    activities: [
      {
        type: "terms",
        tagAr: "مفردات جديدة", tagEn: "New Words",
        instructionsAr: "تعرّف على مفردات التخطيط! اضغط على كل بطاقة.",
        instructionsEn: "Learn the words of planning! Tap each card.",
        terms: [
          { emoji: "📋", ar: "التخطيط", en: "Planning" },
          { emoji: "🎯", ar: "الهدف", en: "Goal" },
          { emoji: "🪜", ar: "الخطوات", en: "Steps" },
          { emoji: "🔝", ar: "الأولويات", en: "Priorities" },
          { emoji: "⏰", ar: "تنظيم الوقت", en: "Time management" },
          { emoji: "🗓️", ar: "الجدول", en: "Schedule" },
          { emoji: "🐢", ar: "التسويف", en: "Procrastination" },
          { emoji: "✅", ar: "التقويم", en: "Evaluation" }
        ]
      },
      {
        type: "concept",
        tagAr: "لنتعلّم!", tagEn: "Let's Learn!",
        conceptBlocks: [
          {
            pillAr: "ما التخطيط؟",
            descAr: "التخطيط هو تحديد الهدف، ثم وضع الخطوات والوسائل التي توصلنا إليه في وقت محدد. التخطيط يوفّر الوقت والجهد ويقلّل الأخطاء ويساعدنا على النجاح.",
            descEn: "Planning means setting a goal and the steps to reach it on time. It saves time and effort.",
            examples: [ { emoji: "🇸🇦", textAr: "رؤية المملكة 2030 مثال على التخطيط للمستقبل" } ]
          },
          {
            pillAr: "خطوات التخطيط",
            descAr: "١- تحديد الهدف  ٢- جمع المعلومات  ٣- وضع الخطة  ٤- التنفيذ  ٥- التقويم (هل وصلنا إلى الهدف؟).",
            descEn: "1 Set the goal  2 Gather information  3 Make the plan  4 Carry it out  5 Evaluate.",
            examples: [ { emoji: "🎯 ➜ 🔎 ➜ 📝 ➜ 🏃 ➜ ✅", textAr: "" } ]
          },
          {
            pillAr: "تنظيم الوقت",
            descAr: "الوقت نعمة من الله. ننظّمه بجدول يومي، ونبدأ بالأهم ثم المهم، ونتجنّب التسويف (تأجيل الأعمال بلا سبب) ومضيعات الوقت مثل الإفراط في استخدام الأجهزة.",
            descEn: "Use a daily schedule, do the most important first, and avoid procrastination.",
            examples: [ { emoji: "🗓️", textAr: "الأهم ← المهم ← الأقل أهمية" } ],
            accent: true
          }
        ]
      },
      {
        type: "numberline",
        tagAr: "رتّب خطوات التخطيط", tagEn: "Order the Planning Steps",
        instructionsAr: "ضع كل خطوة على رقمها الصحيح في خطوات التخطيط.",
        instructionsEn: "Put each step on its correct number.",
        rounds: [
          { min: 1, max: 5,
            items: [
              { id: "goal", value: 1, emoji: "🎯", labelAr: "تحديد الهدف" },
              { id: "info", value: 2, emoji: "🔎", labelAr: "جمع المعلومات" },
              { id: "plan", value: 3, emoji: "📝", labelAr: "وضع الخطة" },
              { id: "do", value: 4, emoji: "🏃", labelAr: "التنفيذ" },
              { id: "eval", value: 5, emoji: "✅", labelAr: "التقويم" }
            ],
            hintAr: "نبدأ دائمًا بتحديد الهدف، وننتهي بالتقويم.",
            hintEn: "Always start with the goal and end with evaluation." }
        ]
      },
      {
        type: "mcq",
        tagAr: "مواقف من الحياة", tagEn: "Real-Life Situations",
        rounds: [
          { promptAr: "ما أول خطوة في التخطيط؟", promptEn: "What is the first step of planning?", big: "🎯",
            options: ["تحديد الهدف", "التنفيذ", "التقويم"], correct: "تحديد الهدف" },
          { promptAr: "يؤجّل سعد واجباته دائمًا إلى آخر الليل بلا سبب. ماذا نسمّي ذلك؟", promptEn: "Saad always delays his homework. What is that?", big: "🐢",
            options: ["التسويف", "التخطيط", "التقويم"], correct: "التسويف" },
          { promptAr: "أيّ الهدفين أوضح وأفضل؟", promptEn: "Which goal is clearer?", big: "🎯",
            options: ["أحفظ 10 كلمات إنجليزية كل أسبوع لمدة شهر", "أريد أن أتحسّن"], correct: "أحفظ 10 كلمات إنجليزية كل أسبوع لمدة شهر",
            hintAr: "الهدف الجيد محدد، ويمكن قياسه، وله وقت.", hintEn: "A good goal is specific, measurable and timed." },
          { promptAr: "لدى ريم اختبار غدًا ومسلسل تريد مشاهدته. بماذا تبدأ؟", promptEn: "Reem has a test tomorrow and a show to watch. What first?", big: "📚📺",
            options: ["المذاكرة للاختبار", "مشاهدة المسلسل", "النوم مبكرًا دون مذاكرة"], correct: "المذاكرة للاختبار",
            hintAr: "نبدأ بالأهم ثم المهم.", hintEn: "Most important first." },
          { promptAr: "في أي خطوة نسأل: هل حققنا الهدف؟", promptEn: "In which step do we ask: did we reach the goal?", big: "✅",
            options: ["التقويم", "جمع المعلومات", "تحديد الهدف"], correct: "التقويم" },
          { promptAr: "ما فائدة التخطيط؟", promptEn: "What is a benefit of planning?", big: "💪",
            options: ["يوفّر الوقت والجهد", "يضيّع الوقت", "يزيد الأخطاء"], correct: "يوفّر الوقت والجهد" }
        ]
      },
      {
        type: "keypad",
        tagAr: "أرقام الوقت", tagEn: "Time Numbers",
        rounds: [
          { promptAr: "كم ساعة في اليوم؟", promptEn: "How many hours are in a day?", big: "⏰", correct: 24, allowNegative: false },
          { promptAr: "كم دقيقة في الساعة؟", promptEn: "How many minutes are in an hour?", big: "⏱️", correct: 60, allowNegative: false },
          { promptAr: "كم يومًا في الأسبوع؟", promptEn: "How many days are in a week?", big: "🗓️", correct: 7, allowNegative: false },
          { promptAr: "رؤية المملكة تخطيط لمستقبل الوطن حتى عام…؟", promptEn: "Saudi Vision plans for the year…?", big: "🇸🇦", correct: 2030, allowNegative: false,
            hintAr: "اسمها: رؤية المملكة ____", hintEn: "Its name: Saudi Vision ____" },
          { promptAr: "ذاكرت نورة 30 دقيقة كل يوم لمدة 4 أيام. كم دقيقة ذاكرت في المجموع؟", promptEn: "Noura studied 30 minutes a day for 4 days. Total minutes?", big: "📖", correct: 120, allowNegative: false,
            hintAr: "30 × 4", hintEn: "30 × 4" }
        ]
      },
      {
        type: "match",
        tagAr: "صِل بين المتشابهين", tagEn: "Match",
        matchDir: "rtl",
        instructionsAr: "صِل كل كلمة بمعناها.",
        instructionsEn: "Match each word with its meaning.",
        rounds: [
          { pairs: [
            { id: "goal", labelAr: "الهدف", matchLabel: "ما نريد الوصول إليه" },
            { id: "proc", labelAr: "التسويف", matchLabel: "تأجيل الأعمال بلا سبب" },
            { id: "prio", labelAr: "الأولويات", matchLabel: "ترتيب الأعمال من الأهم إلى الأقل أهمية" },
            { id: "eval", labelAr: "التقويم", matchLabel: "التأكد من تحقيق الهدف" }
          ] }
        ]
      }
    ]
  },

  /* ============================================================
     STATION 4 — العصر النبوي (The Prophet's Era ﷺ) — ماريا
     ============================================================ */
  {
    id: "s4-prophet-era",
    titleAr: "رحلة السيرة النبوية",
    titleEn: "The Prophet's Era (PBUH)",
    emoji: "🕌",
    character: "marya",
    activities: [
      {
        type: "terms",
        tagAr: "مفردات جديدة", tagEn: "New Words",
        instructionsAr: "تعرّفي على مفردات السيرة النبوية! اضغط على كل بطاقة.",
        instructionsEn: "Learn the words of the Prophet's biography! Tap each card.",
        terms: [
          { emoji: "🏜️", ar: "الجزيرة العربية", en: "Arabian Peninsula" },
          { emoji: "🐘", ar: "عام الفيل", en: "Year of the Elephant" },
          { emoji: "📖", ar: "البعثة والوحي", en: "Prophethood & revelation" },
          { emoji: "⛰️", ar: "غار حراء", en: "Cave of Hira" },
          { emoji: "🐪", ar: "الهجرة", en: "Hijrah (migration)" },
          { emoji: "🤝", ar: "المؤاخاة", en: "Brotherhood" },
          { emoji: "⚔️", ar: "الغزوة", en: "Battle (Ghazwa)" },
          { emoji: "🕋", ar: "حجة الوداع", en: "Farewell Pilgrimage" }
        ]
      },
      {
        type: "concept",
        tagAr: "لنتعلّم!", tagEn: "Let's Learn!",
        conceptBlocks: [
          {
            pillAr: "قبل البعثة",
            descAr: "وُلد النبي محمد ﷺ في مكة المكرمة عام الفيل، ونشأ يتيمًا فكفله جده عبدالمطلب ثم عمه أبو طالب. عمل في رعي الغنم والتجارة، وتزوّج خديجة رضي الله عنها وعمره 25 سنة، ولقّبه قومه «الصادق الأمين».",
            descEn: "Born in Makkah in the Year of the Elephant; known as 'the Truthful, the Trustworthy'.",
            examples: [ { emoji: "🐪", textAr: "رحلة الشتاء إلى اليمن، ورحلة الصيف إلى الشام" } ]
          },
          {
            pillAr: "البعثة والهجرة",
            descAr: "نزل الوحي على النبي ﷺ في غار حراء وعمره 40 سنة، وأول ما نزل: «اقرأ». دعا سرًّا 3 سنوات ثم جهرًا. وفي السنة الأولى للهجرة هاجر مع أبي بكر الصديق رضي الله عنه إلى المدينة، فبنى مسجد قباء ثم المسجد النبوي، وآخى بين المهاجرين والأنصار.",
            descEn: "Revelation came at age 40 in the Cave of Hira. In 1 AH he migrated to Madinah with Abu Bakr.",
            examples: [ { emoji: "⛰️", textAr: "مكث في غار ثور 3 ليالٍ أثناء الهجرة" } ]
          },
          {
            pillAr: "في المدينة",
            descAr: "من أحداث العصر النبوي: غزوة بدر (2هـ)، وغزوة أحد (3هـ)، وغزوة الخندق (5هـ)، وصلح الحديبية (6هـ)، وفتح مكة (8هـ)، وحجة الوداع (10هـ). وتوفي النبي ﷺ سنة 11هـ وعمره 63 سنة.",
            descEn: "Badr 2 AH, Uhud 3, Khandaq 5, Hudaybiyyah 6, Conquest of Makkah 8, Farewell Pilgrimage 10, his death 11 AH.",
            examples: [ { emoji: "📅", textAr: "1هـ ← 2هـ ← 3هـ ← 5هـ ← 6هـ ← 8هـ ← 10هـ ← 11هـ" } ],
            accent: true
          }
        ]
      },
      {
        type: "mcq",
        tagAr: "اختر الإجابة", tagEn: "Choose the Answer",
        rounds: [
          { promptAr: "في أي مدينة وُلد النبي محمد ﷺ؟", promptEn: "Where was the Prophet ﷺ born?", big: "🕋",
            options: ["مكة المكرمة", "المدينة المنورة", "الطائف"], correct: "مكة المكرمة" },
          { promptAr: "بماذا لقّب أهلُ مكة النبيَّ ﷺ قبل البعثة؟", promptEn: "What was his title before prophethood?", big: "⭐",
            options: ["الصادق الأمين", "التاجر الغني", "الفارس الشجاع"], correct: "الصادق الأمين" },
          { promptAr: "أين نزل الوحي أول مرة على النبي ﷺ؟", promptEn: "Where did the first revelation come?", big: "⛰️",
            options: ["غار حراء", "غار ثور", "جبل أحد"], correct: "غار حراء",
            hintAr: "غار ثور هو مكان الاختباء في الهجرة.", hintEn: "Thawr was the hiding place during the Hijrah." },
          { promptAr: "ما أول كلمة نزلت من القرآن الكريم؟", promptEn: "What was the first revealed word?", big: "📖",
            options: ["اقرأ", "قل", "الحمد"], correct: "اقرأ" },
          { promptAr: "مَن رافق النبي ﷺ في الهجرة إلى المدينة؟", promptEn: "Who accompanied him on the Hijrah?", big: "🐪",
            options: ["أبو بكر الصديق", "عمر بن الخطاب", "عثمان بن عفان"], correct: "أبو بكر الصديق" },
          { promptAr: "ما أول مسجد بُني في الإسلام؟", promptEn: "What was the first mosque in Islam?", big: "🕌",
            options: ["مسجد قباء", "المسجد النبوي", "المسجد الحرام"], correct: "مسجد قباء",
            hintAr: "بناه النبي ﷺ عند وصوله قرب المدينة قبل المسجد النبوي.", hintEn: "He built it on arrival, before the Prophet's Mosque." }
        ]
      },
      {
        type: "numberline",
        tagAr: "خط الزمن الهجري", tagEn: "Hijri Timeline",
        instructionsAr: "ضع كل حدث على سنته الهجرية في خط الزمن.",
        instructionsEn: "Put each event on its Hijri year.",
        rounds: [
          { min: 1, max: 11,
            items: [
              { id: "hijra", value: 1, emoji: "🐪", labelAr: "الهجرة" },
              { id: "badr", value: 2, emoji: "⚔️", labelAr: "غزوة بدر" },
              { id: "uhud", value: 3, emoji: "⛰️", labelAr: "غزوة أحد" },
              { id: "khandaq", value: 5, emoji: "🕳️", labelAr: "غزوة الخندق" }
            ],
            hintAr: "الهجرة في السنة 1، وبدر بعدها مباشرة، ثم أحد. والخندق في السنة 5.",
            hintEn: "Hijrah 1, then Badr, then Uhud. Khandaq is in year 5." },
          { min: 1, max: 11,
            items: [
              { id: "hudaybiyyah", value: 6, emoji: "📜", labelAr: "صلح الحديبية" },
              { id: "fath", value: 8, emoji: "🕋", labelAr: "فتح مكة" },
              { id: "wada", value: 10, emoji: "🤍", labelAr: "حجة الوداع" },
              { id: "wafat", value: 11, emoji: "🌙", labelAr: "وفاة النبي ﷺ" }
            ],
            hintAr: "الصلح (6) جاء قبل فتح مكة (8)، وتوفي النبي ﷺ في السنة التي تلي حجة الوداع.",
            hintEn: "The treaty (6) came before the conquest (8); his death came the year after the Farewell Pilgrimage." }
        ]
      },
      {
        type: "keypad",
        tagAr: "أرقام من السيرة", tagEn: "Numbers from the Seerah",
        rounds: [
          { promptAr: "كم كان عمر النبي ﷺ عندما نزل عليه الوحي؟", promptEn: "How old was he at the first revelation?", big: "📖", correct: 40, allowNegative: false },
          { promptAr: "كم كان عمر النبي ﷺ عندما تزوّج خديجة رضي الله عنها؟", promptEn: "How old was he when he married Khadijah?", big: "💍", correct: 25, allowNegative: false },
          { promptAr: "كم سنة استمرت الدعوة السرية؟", promptEn: "How many years was the secret call?", big: "🤫", correct: 3, allowNegative: false },
          { promptAr: "في أي سنة هجرية كانت غزوة بدر؟", promptEn: "In which Hijri year was Badr?", big: "⚔️", correct: 2, allowNegative: false },
          { promptAr: "كم كان عمر النبي ﷺ عند وفاته؟", promptEn: "How old was he when he passed away?", big: "🌙", correct: 63, allowNegative: false,
            hintAr: "40 سنة قبل البعثة + 23 سنة بعدها.", hintEn: "40 + 23" }
        ]
      },
      {
        type: "match",
        tagAr: "صِل بين المتشابهين", tagEn: "Match",
        matchDir: "rtl",
        instructionsAr: "صِل كل حدث أو شخص بما يناسبه.",
        instructionsEn: "Match each event or person with the right description.",
        rounds: [
          { pairs: [
            { id: "khandaq", labelAr: "غزوة الخندق", matchLabel: "حفر خندق بفكرة سلمان الفارسي" },
            { id: "badr", labelAr: "غزوة بدر", matchLabel: "أول انتصار كبير للمسلمين" },
            { id: "uhud", labelAr: "غزوة أحد", matchLabel: "جبل الرماة" },
            { id: "fath", labelAr: "فتح مكة", matchLabel: "دخول مكة وتطهير الكعبة من الأصنام" }
          ] },
          { pairs: [
            { id: "khadija", labelAr: "خديجة رضي الله عنها", matchLabel: "أول من أسلم من النساء" },
            { id: "abubakr", labelAr: "أبو بكر رضي الله عنه", matchLabel: "أول من أسلم من الرجال" },
            { id: "ansar", labelAr: "الأنصار", matchLabel: "أهل المدينة الذين نصروا النبي ﷺ" },
            { id: "muhajirun", labelAr: "المهاجرون", matchLabel: "المسلمون الذين هاجروا من مكة" }
          ] }
        ]
      },
      {
        type: "mcq",
        tagAr: "تحدّي الأخلاق النبوية", tagEn: "The Prophet's Character",
        rounds: [
          { promptAr: "أعاد النبي ﷺ الأمانات إلى أهلها قبل الهجرة. ما الصفة التي تظهر هنا؟", promptEn: "He returned trusts before the Hijrah. Which quality?", big: "🤲",
            options: ["الأمانة", "الغضب", "البخل"], correct: "الأمانة" },
          { promptAr: "عفا النبي ﷺ عن أهل مكة يوم الفتح مع أنهم آذوه كثيرًا. ما الصفة التي تظهر هنا؟", promptEn: "He forgave the people of Makkah. Which quality?", big: "🤍",
            options: ["العفو والرحمة", "الانتقام", "الكسل"], correct: "العفو والرحمة" },
          { promptAr: "كان النبي ﷺ يشارك أصحابه في العمل مثل بناء المسجد. ما الصفة التي تظهر هنا؟", promptEn: "He worked with his companions. Which quality?", big: "🧱",
            options: ["التواضع", "التكبّر", "التسويف"], correct: "التواضع" },
          { promptAr: "ما آخر حدث كبير قبل وفاة النبي ﷺ؟", promptEn: "What was the last major event before his death?", big: "🕋",
            options: ["حجة الوداع", "غزوة بدر", "الهجرة"], correct: "حجة الوداع" }
        ]
      }
    ]
  }
];
