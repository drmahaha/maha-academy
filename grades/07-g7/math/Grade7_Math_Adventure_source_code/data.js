/* ===========================================================
   Maha Academy — Grade 7 Math Adventure — Content Data
   Saudi public school curriculum (الرياضيات 1 - أول متوسط)
   Arabic-primary throughout; English shown only as .en-badge.
   Activity types: terms, concept, mcq, keypad, numberline, match
   =========================================================== */

const ALL_GAMES = [

  /* ============================================================
     GAME 1 — أرض الأعداد الصحيحة (Integer Land)
     ============================================================ */
  {
    id: "g1-integers",
    titleAr: "أرض الأعداد الصحيحة",
    titleEn: "Integer Land",
    emoji: "🏔️",
    character: "mahir",
    activities: [
      {
        type: "terms",
        tagAr: "مفردات جديدة", tagEn: "New Words",
        instructionsAr: "تعرف على مفردات الأعداد الصحيحة! اضغط على كل بطاقة.",
        instructionsEn: "Learn integer vocabulary! Tap each card.",
        terms: [
          { emoji: "🔢", ar: "عدد صحيح", en: "Integer" },
          { emoji: "➕", ar: "عدد موجب", en: "Positive number" },
          { emoji: "➖", ar: "عدد سالب", en: "Negative number" },
          { emoji: "0️⃣", ar: "الصفر", en: "Zero" },
          { emoji: "📏", ar: "القيمة المطلقة", en: "Absolute value" },
          { emoji: "↔️", ar: "المسافة عن الصفر", en: "Distance from zero" }
        ]
      },
      {
        type: "concept",
        tagAr: "لنتعلم!", tagEn: "Let's Learn!",
        conceptBlocks: [
          {
            pillAr: "ما هو العدد الصحيح؟",
            descAr: "الأعداد الصحيحة تشمل الأعداد الموجبة والسالبة والصفر، بدون كسور.",
            descEn: "Integers include positive numbers, negative numbers, and zero — no fractions.",
            examples: [ { emoji: "", textAr: "..., -3, -2, -1, 0, 1, 2, 3, ...", ltr: true } ]
          },
          {
            pillAr: "القيمة المطلقة",
            descAr: "القيمة المطلقة لعدد هي مسافته عن الصفر على خط الأعداد، وهي دائمًا موجبة أو صفر.",
            descEn: "The absolute value of a number is its distance from zero — always positive or zero.",
            examples: [ { emoji: "", textAr: "|-5| = 5     و     |5| = 5", ltr: true } ],
            accent: true
          }
        ]
      },
      {
        type: "numberline",
        tagAr: "رتب على الخط", tagEn: "Place on the Line",
        instructionsAr: "اضغط على الرقم ثم اضغط على مكانه الصحيح على خط الأعداد!",
        instructionsEn: "Tap a number, then tap its correct spot on the number line!",
        rounds: [
          {
            min: -5, max: 5,
            items: [
              { id: "a", value: -3, labelAr: "-3" },
              { id: "b", value: 2, labelAr: "2" },
              { id: "c", value: -5, labelAr: "-5" },
              { id: "d", value: 4, labelAr: "4" }
            ],
            hintAr: "تحرك يسارًا للأعداد السالبة، ويمينًا للأعداد الموجبة.",
            hintEn: "Move left for negative numbers, right for positive numbers."
          },
          {
            min: -6, max: 6,
            items: [
              { id: "a", value: -6, labelAr: "-6" },
              { id: "b", value: 0, labelAr: "0" },
              { id: "c", value: 5, labelAr: "5" },
              { id: "d", value: -2, labelAr: "-2" }
            ]
          }
        ]
      },
      {
        type: "mcq",
        tagAr: "قارن الأعداد", tagEn: "Compare Integers",
        rounds: [
          { promptAr: "أي عدد أكبر؟", promptEn: "Which number is greater?", options: ["-3", "-8"], correct: "-3" },
          { promptAr: "أي عدد أصغر؟", promptEn: "Which number is smaller?", options: ["4", "-4"], correct: "-4" },
          { promptAr: "أي عدد يقع بين -5 و 0؟", promptEn: "Which number lies between -5 and 0?", options: ["-2", "3", "-7"], correct: "-2" },
          { promptAr: "ما ناتج |-7| ؟", promptEn: "What is |-7|?", expr: "|-7| = ?", options: ["7", "-7", "0"], correct: "7" }
        ]
      },
      {
        type: "keypad",
        tagAr: "اجمع واطرح", tagEn: "Add & Subtract",
        rounds: [
          { promptAr: "احسب:", expr: "-3 + 5 = ?", correct: 2, allowNegative: true, hintAr: "فكّر بخط الأعداد: ابدأ من -3 وتحرك 5 خطوات لليمين.", hintEn: "Think of the number line: start at -3 and move 5 steps right." },
          { promptAr: "احسب:", expr: "4 + (-9) = ?", correct: -5, allowNegative: true },
          { promptAr: "احسب:", expr: "-6 - (-2) = ?", correct: -4, allowNegative: true, hintAr: "طرح عدد سالب مثل جمع عدد موجب.", hintEn: "Subtracting a negative is like adding a positive." },
          { promptAr: "احسب:", expr: "-8 + (-3) = ?", correct: -11, allowNegative: true }
        ]
      }
    ]
  },

  /* ============================================================
     GAME 2 — برج القوى والأسس (Powers Tower)
     ============================================================ */
  {
    id: "g2-powers",
    titleAr: "برج القوى والأسس",
    titleEn: "Powers Tower",
    emoji: "🗼",
    character: "maya",
    activities: [
      {
        type: "terms",
        tagAr: "مفردات جديدة", tagEn: "New Words",
        instructionsAr: "تعرف على مفردات القوى والأسس!",
        instructionsEn: "Learn powers and exponents vocabulary!",
        terms: [
          { emoji: "🔟", ar: "الأساس", en: "Base" },
          { emoji: "⬆️", ar: "الأس", en: "Exponent" },
          { emoji: "✖️", ar: "القوة", en: "Power" },
          { emoji: "🔁", ar: "ترتيب العمليات", en: "Order of operations" }
        ]
      },
      {
        type: "concept",
        tagAr: "لنتعلم!", tagEn: "Let's Learn!",
        conceptBlocks: [
          {
            pillAr: "ما هي القوة؟",
            descAr: "القوة تعني ضرب العدد (الأساس) في نفسه عدة مرات، يحددها الأس.",
            descEn: "A power means multiplying the base by itself, as many times as the exponent shows.",
            examples: [ { emoji: "", textAr: "2³ = 2 × 2 × 2 = 8", ltr: true } ]
          },
          {
            pillAr: "ترتيب العمليات",
            descAr: "عند حل عبارة فيها عمليات متعددة: نحل الأقواس أولًا، ثم الأسس، ثم الضرب والقسمة، ثم الجمع والطرح.",
            descEn: "When solving an expression with several operations: parentheses first, then exponents, then multiplication/division, then addition/subtraction.",
            examples: [ { emoji: "", textAr: "( ) → xʸ → × ÷ → + −", ltr: true } ],
            accent: true
          }
        ]
      },
      {
        type: "mcq",
        tagAr: "احسب القوة", tagEn: "Evaluate the Power",
        rounds: [
          { promptAr: "ما ناتج هذه القوة؟", expr: "3² = ?", options: ["6", "9", "5"], correct: "9" },
          { promptAr: "ما ناتج هذه القوة؟", expr: "2⁴ = ?", options: ["8", "16", "6"], correct: "16" },
          { promptAr: "ما ناتج هذه القوة؟", expr: "5³ = ?", options: ["15", "125", "25"], correct: "125" },
          { promptAr: "أي عبارة تساوي 4 × 4 × 4؟", promptEn: "Which expression equals 4 × 4 × 4?", options: ["4³", "3⁴", "4×3"], correct: "4³" }
        ]
      },
      {
        type: "keypad",
        tagAr: "أدخل الناتج", tagEn: "Type the Answer",
        rounds: [
          { promptAr: "احسب:", expr: "2⁵ = ?", correct: 32, allowNegative: false },
          { promptAr: "احسب:", expr: "10² = ?", correct: 100, allowNegative: false },
          { promptAr: "احسب:", expr: "6² = ?", correct: 36, allowNegative: false },
          { promptAr: "احسب:", expr: "3³ = ?", correct: 27, allowNegative: false }
        ]
      },
      {
        type: "mcq",
        tagAr: "ترتيب العمليات", tagEn: "Order of Operations",
        rounds: [
          { promptAr: "ما ناتج هذه العبارة؟", expr: "3 + 2 × 4 = ?", options: ["20", "11", "24"], correct: "11" },
          { promptAr: "ما ناتج هذه العبارة؟", expr: "(3 + 2) × 4 = ?", options: ["20", "11", "9"], correct: "20" },
          { promptAr: "ما ناتج هذه العبارة؟", expr: "2³ + 5 = ?", options: ["13", "21", "11"], correct: "13" },
          { promptAr: "ما ناتج هذه العبارة؟", expr: "10 - 2 × 3 = ?", options: ["24", "4", "8"], correct: "4" }
        ]
      }
    ]
  },

  /* ============================================================
     GAME 3 — قرية العبارات الجبرية (Algebraic Expressions Village)
     ============================================================ */
  {
    id: "g3-expressions",
    titleAr: "قرية العبارات الجبرية",
    titleEn: "Algebraic Expressions Village",
    emoji: "🏘️",
    character: "marya",
    activities: [
      {
        type: "terms",
        tagAr: "مفردات جديدة", tagEn: "New Words",
        instructionsAr: "تعرف على مفردات الجبر!",
        instructionsEn: "Learn algebra vocabulary!",
        terms: [
          { emoji: "🔤", ar: "متغير", en: "Variable" },
          { emoji: "📐", ar: "عبارة جبرية", en: "Algebraic expression" },
          { emoji: "🔢", ar: "معامل", en: "Coefficient" },
          { emoji: "🧱", ar: "حد ثابت", en: "Constant term" }
        ]
      },
      {
        type: "concept",
        tagAr: "لنتعلم!", tagEn: "Let's Learn!",
        conceptBlocks: [
          {
            pillAr: "المتغيرات والعبارات الجبرية",
            descAr: "المتغير هو حرف يمثل عددًا غير معروف، والعبارة الجبرية تجمع بين أعداد ومتغيرات وعمليات حسابية.",
            descEn: "A variable is a letter that stands for an unknown number; an algebraic expression combines numbers, variables, and operations.",
            examples: [ { emoji: "", textAr: "3x + 5", ltr: true } ]
          },
          {
            pillAr: "خصائص الجبر",
            descAr: "الخاصية التبديلية تسمح بتبديل ترتيب الجمع أو الضرب، والخاصية التوزيعية تُوزّع الضرب على الجمع داخل الأقواس.",
            descEn: "The commutative property lets you swap order in addition/multiplication; the distributive property spreads multiplication over addition inside parentheses.",
            examples: [ { emoji: "", textAr: "a(b + c) = ab + ac", ltr: true } ],
            accent: true
          }
        ]
      },
      {
        type: "mcq",
        tagAr: "قيّم العبارة", tagEn: "Evaluate the Expression",
        rounds: [
          { promptAr: "إذا كان x = 4، فما قيمة هذه العبارة؟", expr: "x + 6 ,  x = 4", options: ["10", "24", "2"], correct: "10" },
          { promptAr: "إذا كان x = 3، فما قيمة هذه العبارة؟", expr: "5x ,  x = 3", options: ["8", "15", "53"], correct: "15" },
          { promptAr: "إذا كان x = 2، فما قيمة هذه العبارة؟", expr: "3x + 1 ,  x = 2", options: ["7", "6", "9"], correct: "7" },
          { promptAr: "إذا كان x = 5، فما قيمة هذه العبارة؟", expr: "2x - 4 ,  x = 5", options: ["6", "10", "14"], correct: "6" }
        ]
      },
      {
        type: "match",
        tagAr: "طابق الخصائص", tagEn: "Match the Properties",
        instructionsAr: "طابق كل خاصية جبرية بمثالها الصحيح!",
        instructionsEn: "Match each algebra property to its correct example!",
        rounds: [
          {
            pairs: [
              { id: "comm", labelAr: "الخاصية التبديلية", matchLabel: "3 + 5 = 5 + 3" },
              { id: "assoc", labelAr: "الخاصية التجميعية", matchLabel: "(2+3)+4 = 2+(3+4)" },
              { id: "dist", labelAr: "الخاصية التوزيعية", matchLabel: "2(x+3) = 2x+6" },
              { id: "ident", labelAr: "خاصية عنصر الجمع المحايد", matchLabel: "x + 0 = x" }
            ]
          }
        ]
      },
      {
        type: "keypad",
        tagAr: "أدخل القيمة", tagEn: "Type the Value",
        rounds: [
          { promptAr: "إذا كان x = 6، فاحسب:", expr: "x - 2 ,  x = 6", correct: 4 },
          { promptAr: "إذا كان x = 3، فاحسب:", expr: "4x ,  x = 3", correct: 12 },
          { promptAr: "إذا كان x = 7، فاحسب:", expr: "x + x ,  x = 7", correct: 14 },
          { promptAr: "إذا كان x = 2، فاحسب:", expr: "10 - 3x ,  x = 2", correct: 4 }
        ]
      }
    ]
  },

  /* ============================================================
     GAME 4 — نهر المعادلات (Equations River)
     ============================================================ */
  {
    id: "g4-equations",
    titleAr: "نهر المعادلات",
    titleEn: "Equations River",
    emoji: "🌊",
    character: "malik",
    activities: [
      {
        type: "terms",
        tagAr: "مفردات جديدة", tagEn: "New Words",
        instructionsAr: "تعرف على مفردات المعادلات!",
        instructionsEn: "Learn equations vocabulary!",
        terms: [
          { emoji: "⚖️", ar: "معادلة", en: "Equation" },
          { emoji: "🔓", ar: "حل المعادلة", en: "Solve the equation" },
          { emoji: "↔️", ar: "طرفا المعادلة", en: "Sides of the equation" },
          { emoji: "🔁", ar: "العملية العكسية", en: "Inverse operation" }
        ]
      },
      {
        type: "concept",
        tagAr: "لنتعلم!", tagEn: "Let's Learn!",
        conceptBlocks: [
          {
            pillAr: "حل المعادلات بخطوة واحدة",
            descAr: "لحل معادلة، نستخدم العملية العكسية على طرفي المعادلة معًا للحفاظ على توازنها.",
            descEn: "To solve an equation, apply the inverse operation to both sides to keep it balanced.",
            examples: [ { emoji: "", textAr: "x + 5 = 12   →   x = 12 - 5 = 7", ltr: true } ]
          },
          {
            pillAr: "معادلات بخطوتين",
            descAr: "في المعادلات ذات الخطوتين، نتخلص من الجمع أو الطرح أولًا، ثم من الضرب أو القسمة.",
            descEn: "In two-step equations, undo addition/subtraction first, then multiplication/division.",
            examples: [ { emoji: "", textAr: "2x + 3 = 11   →   2x = 8   →   x = 4", ltr: true } ],
            accent: true
          }
        ]
      },
      {
        type: "keypad",
        tagAr: "حل المعادلة", tagEn: "Solve for x",
        rounds: [
          { promptAr: "حل من أجل x:", expr: "x + 5 = 12", correct: 7, allowNegative: true },
          { promptAr: "حل من أجل x:", expr: "x - 4 = 9", correct: 13, allowNegative: true },
          { promptAr: "حل من أجل x:", expr: "x + 9 = 3", correct: -6, allowNegative: true, hintAr: "اطرح 9 من الطرفين.", hintEn: "Subtract 9 from both sides." },
          { promptAr: "حل من أجل x:", expr: "15 - x = 8", correct: 7, allowNegative: true }
        ]
      },
      {
        type: "keypad",
        tagAr: "حل المعادلة", tagEn: "Solve for x",
        rounds: [
          { promptAr: "حل من أجل x:", expr: "3x = 21", correct: 7, allowNegative: true },
          { promptAr: "حل من أجل x:", expr: "x ÷ 4 = 6", correct: 24, allowNegative: true },
          { promptAr: "حل من أجل x:", expr: "2x + 3 = 11", correct: 4, allowNegative: true, hintAr: "اطرح 3 أولًا، ثم اقسم على 2.", hintEn: "Subtract 3 first, then divide by 2." },
          { promptAr: "حل من أجل x:", expr: "5x - 4 = 16", correct: 4, allowNegative: true }
        ]
      },
      {
        type: "mcq",
        tagAr: "اكتب المعادلة", tagEn: "Write the Equation",
        rounds: [
          { promptAr: "أي معادلة تمثل: خمسة أمثال عدد x زائد 3 يساوي 18؟", promptEn: "Which equation represents: 5 times a number x, plus 3, equals 18?", options: ["5x + 3 = 18", "5x - 3 = 18", "3x + 5 = 18"], correct: "5x + 3 = 18" },
          { promptAr: "لدى سارة x من الريالات، وبعد إنفاق 10 ريالات أصبح لديها 25. أي معادلة صحيحة؟", promptEn: "Sara has x riyals; after spending 10, she has 25. Which equation is correct?", options: ["x - 10 = 25", "x + 10 = 25", "10 - x = 25"], correct: "x - 10 = 25" },
          { promptAr: "عدد مقسوم على 4 يساوي 9. أي معادلة صحيحة؟", promptEn: "A number divided by 4 equals 9. Which equation is correct?", options: ["x ÷ 4 = 9", "4 ÷ x = 9", "4x = 9"], correct: "x ÷ 4 = 9" },
          { promptAr: "ضعف عدد ناقص 6 يساوي 10. أي معادلة صحيحة؟", promptEn: "Twice a number, minus 6, equals 10. Which equation is correct?", options: ["2x - 6 = 10", "2x + 6 = 10", "x - 6 = 10×2"], correct: "2x - 6 = 10" }
        ]
      }
    ]
  },

  /* ============================================================
     GAME 5 — ميدان المحيط والمساحة (Perimeter & Area Field)
     ============================================================ */
  {
    id: "g5-perimeterarea",
    titleAr: "ميدان المحيط والمساحة",
    titleEn: "Perimeter & Area Field",
    emoji: "🌾",
    character: "mahir",
    activities: [
      {
        type: "terms",
        tagAr: "مفردات جديدة", tagEn: "New Words",
        instructionsAr: "تعرف على مفردات المحيط والمساحة!",
        instructionsEn: "Learn perimeter and area vocabulary!",
        terms: [
          { emoji: "📏", ar: "المحيط", en: "Perimeter" },
          { emoji: "🟩", ar: "المساحة", en: "Area" },
          { emoji: "⬛", ar: "مربع", en: "Square" },
          { emoji: "▭", ar: "مستطيل", en: "Rectangle" }
        ]
      },
      {
        type: "concept",
        tagAr: "لنتعلم!", tagEn: "Let's Learn!",
        conceptBlocks: [
          {
            pillAr: "محيط الأشكال",
            descAr: "المحيط هو طول الحدود الخارجية للشكل. للمستطيل: المحيط = 2×(الطول+العرض). للمربع: المحيط = 4×طول الضلع.",
            descEn: "Perimeter is the distance around a shape. Rectangle: P = 2×(length+width). Square: P = 4×side.",
            examples: [ { emoji: "", textAr: "طول = 6، عرض = 3  ←  المحيط = 2×(6+3) = 18", ltr: false } ]
          },
          {
            pillAr: "مساحة الأشكال",
            descAr: "المساحة تقيس السطح الداخلي للشكل. للمستطيل: المساحة = الطول × العرض. للمربع: المساحة = طول الضلع².",
            descEn: "Area measures the surface inside a shape. Rectangle: A = length×width. Square: A = side².",
            examples: [ { emoji: "", textAr: "طول = 6، عرض = 3  ←  المساحة = 6×3 = 18", ltr: false } ],
            accent: true
          }
        ]
      },
      {
        type: "keypad",
        tagAr: "احسب المحيط", tagEn: "Find the Perimeter",
        rounds: [
          { promptAr: "مستطيل طوله 8 سم وعرضه 5 سم. ما محيطه؟", expr: "P = 2 × (8 + 5)", correct: 26, allowNegative: false },
          { promptAr: "مربع طول ضلعه 7 سم. ما محيطه؟", expr: "P = 4 × 7", correct: 28, allowNegative: false },
          { promptAr: "مستطيل طوله 10 سم وعرضه 4 سم. ما محيطه؟", expr: "P = 2 × (10 + 4)", correct: 28, allowNegative: false },
          { promptAr: "مربع طول ضلعه 12 سم. ما محيطه؟", expr: "P = 4 × 12", correct: 48, allowNegative: false }
        ]
      },
      {
        type: "keypad",
        tagAr: "احسب المساحة", tagEn: "Find the Area",
        rounds: [
          { promptAr: "مستطيل طوله 9 سم وعرضه 4 سم. ما مساحته؟", expr: "A = 9 × 4", correct: 36, allowNegative: false },
          { promptAr: "مربع طول ضلعه 6 سم. ما مساحته؟", expr: "A = 6²", correct: 36, allowNegative: false },
          { promptAr: "مستطيل طوله 12 سم وعرضه 5 سم. ما مساحته؟", expr: "A = 12 × 5", correct: 60, allowNegative: false },
          { promptAr: "مربع طول ضلعه 9 سم. ما مساحته؟", expr: "A = 9²", correct: 81, allowNegative: false }
        ]
      },
      {
        type: "mcq",
        tagAr: "مسائل تطبيقية", tagEn: "Word Problems",
        rounds: [
          { promptAr: "أراد ماهر أن يسيّج حديقة مستطيلة طولها 15م وعرضها 10م. كم مترًا من السياج يحتاج؟", promptEn: "How much fence is needed for a 15m by 10m rectangular garden?", options: ["50 م", "150 م", "25 م"], correct: "50 م" },
          { promptAr: "غرفة مربعة طول ضلعها 5م. كم تحتاج من متر مربع من السجاد لتغطيتها؟", promptEn: "How many square meters of carpet cover a 5m square room?", options: ["20 م²", "25 م²", "10 م²"], correct: "25 م²" },
          { promptAr: "إذا تضاعف طول ضلع المربع، ماذا يحدث لمساحته؟", promptEn: "If a square's side doubles, what happens to its area?", options: ["تتضاعف (×2)", "تصبح 4 أضعاف (×4)", "تبقى كما هي"], correct: "تصبح 4 أضعاف (×4)" },
          { promptAr: "مستطيل مساحته 24 سم² وطوله 8 سم. ما عرضه؟", promptEn: "A rectangle has area 24 cm² and length 8 cm. What is its width?", options: ["3 سم", "4 سم", "16 سم"], correct: "3 سم" }
        ]
      }
    ]
  }

];
