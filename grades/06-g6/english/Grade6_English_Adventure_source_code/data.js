/* ============================================================
   Maha Academy — English Adventure — GRADE 6 (Top Goal 3, Term 1)
   1. Personal Interests · 2. House Designs · 3. Job Paths · 4. Glorious Food
   ============================================================ */

function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

/* ============ GAME 1: PERSONAL INTERESTS ============ */
const INTERESTS_VOCAB = [
  {
    "id": "photography",
    "en": "photography",
    "ar": "التصوير",
    "emoji": "📷"
  },
  {
    "id": "coding",
    "en": "coding",
    "ar": "البرمجة",
    "emoji": "💻"
  },
  {
    "id": "collecting_stamps",
    "en": "collecting stamps",
    "ar": "جمع الطوابع",
    "emoji": "📮"
  },
  {
    "id": "gardening",
    "en": "gardening",
    "ar": "البستنة",
    "emoji": "🌻"
  },
  {
    "id": "astronomy",
    "en": "astronomy",
    "ar": "علم الفلك",
    "emoji": "🔭"
  },
  {
    "id": "calligraphy",
    "en": "calligraphy",
    "ar": "الخط العربي",
    "emoji": "🖋️"
  },
  {
    "id": "robotics",
    "en": "robotics",
    "ar": "الروبوتات",
    "emoji": "🤖"
  },
  {
    "id": "hiking",
    "en": "hiking",
    "ar": "المشي في الطبيعة",
    "emoji": "🥾"
  }
];

const GAME_INTERESTS = {
  "id": "interests",
  "emoji": "🎯",
  "titleEn": "Personal Interests",
  "titleAr": "الاهتمامات الشخصية",
  "character": "mahir",
  "introEn": "What are you interested in?",
  "introAr": "ما الذي يهمّك؟",
  "activities": [
    {
      "type": "vocab",
      "tagEn": "Interest Words",
      "tagAr": "كلمات الاهتمامات",
      "instructionsEn": "Tap each card to hear the word.",
      "instructionsAr": "اضغط على كل بطاقة لسماع الكلمة.",
      "words": INTERESTS_VOCAB
    },
    {
      "type": "teach",
      "tagEn": "Talking About Interests",
      "tagAr": "الحديث عن الاهتمامات",
      "teachBlocks": [
        {
          "pillEn": "be interested in / be good at",
          "pillAr": "مهتم بـ / ماهر في",
          "descEn": "Use -ing after in / at.",
          "descAr": "استخدم ing بعد in و at.",
          "examples": [
            {
              "emoji": "💬",
              "textEn": "I'm interested in coding. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">أنا مهتم بالبرمجة.</span>"
            },
            {
              "emoji": "💬",
              "textEn": "She's good at calligraphy. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">هي ماهرة في الخط.</span>"
            }
          ]
        },
        {
          "pillEn": "enjoy / love + -ing",
          "pillAr": "يستمتع / يحب + ing",
          "descEn": "Use -ing after enjoy and love.",
          "descAr": "استخدم ing بعد enjoy و love.",
          "examples": [
            {
              "emoji": "💬",
              "textEn": "He enjoys taking photos. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">يستمتع بالتقاط الصور.</span>"
            },
            {
              "emoji": "💬",
              "textEn": "We love hiking in the mountains. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">نحب المشي في الجبال.</span>"
            }
          ]
        }
      ]
    },
    {
      "type": "mcq",
      "tagEn": "Listen and Choose",
      "tagAr": "استمع واختر",
      "instructionsEn": "Listen and pick the word you hear.",
      "instructionsAr": "استمع واختر الكلمة التي سمعتها.",
      "rounds": [
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "coding",
          "audio": true,
          "options": [
            "calligraphy",
            "gardening",
            "coding"
          ],
          "correct": "coding"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "collecting stamps",
          "audio": true,
          "options": [
            "coding",
            "collecting stamps",
            "astronomy"
          ],
          "correct": "collecting stamps"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "gardening",
          "audio": true,
          "options": [
            "robotics",
            "hiking",
            "gardening"
          ],
          "correct": "gardening"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "hiking",
          "audio": true,
          "options": [
            "hiking",
            "coding",
            "calligraphy"
          ],
          "correct": "hiking"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "calligraphy",
          "audio": true,
          "options": [
            "robotics",
            "astronomy",
            "calligraphy"
          ],
          "correct": "calligraphy"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "astronomy",
          "audio": true,
          "options": [
            "gardening",
            "hiking",
            "astronomy"
          ],
          "correct": "astronomy"
        }
      ]
    },
    {
      "type": "match",
      "tagEn": "Match the Words",
      "tagAr": "طابق الكلمات",
      "instructionsEn": "Match each word to its picture.",
      "instructionsAr": "طابق كل كلمة مع صورتها.",
      "rounds": [
        {
          "pairs": [
            {
              "id": "astronomy",
              "labelEn": "astronomy",
              "labelAr": "علم الفلك",
              "emoji": "🔭"
            },
            {
              "id": "robotics",
              "labelEn": "robotics",
              "labelAr": "الروبوتات",
              "emoji": "🤖"
            },
            {
              "id": "collecting_stamps",
              "labelEn": "collecting stamps",
              "labelAr": "جمع الطوابع",
              "emoji": "📮"
            },
            {
              "id": "gardening",
              "labelEn": "gardening",
              "labelAr": "البستنة",
              "emoji": "🌻"
            }
          ]
        },
        {
          "pairs": [
            {
              "id": "coding",
              "labelEn": "coding",
              "labelAr": "البرمجة",
              "emoji": "💻"
            },
            {
              "id": "calligraphy",
              "labelEn": "calligraphy",
              "labelAr": "الخط العربي",
              "emoji": "🖋️"
            },
            {
              "id": "hiking",
              "labelEn": "hiking",
              "labelAr": "المشي في الطبيعة",
              "emoji": "🥾"
            },
            {
              "id": "photography",
              "labelEn": "photography",
              "labelAr": "التصوير",
              "emoji": "📷"
            }
          ]
        }
      ]
    },
    {
      "type": "order",
      "tagEn": "Build the Sentence",
      "tagAr": "كوّن الجملة",
      "instructionsEn": "Tap the words in the correct order.",
      "instructionsAr": "اضغط على الكلمات بالترتيب الصحيح.",
      "speakOnPlace": true,
      "rounds": [
        {
          "items": [
            {
              "id": "w0",
              "labelEn": "I'm"
            },
            {
              "id": "w1",
              "labelEn": "interested"
            },
            {
              "id": "w2",
              "labelEn": "in"
            },
            {
              "id": "w3",
              "labelEn": "astronomy"
            }
          ],
          "speakOnPlace": true
        },
        {
          "items": [
            {
              "id": "w0",
              "labelEn": "She"
            },
            {
              "id": "w1",
              "labelEn": "is"
            },
            {
              "id": "w2",
              "labelEn": "good"
            },
            {
              "id": "w3",
              "labelEn": "at"
            },
            {
              "id": "w4",
              "labelEn": "coding"
            }
          ],
          "speakOnPlace": true
        },
        {
          "items": [
            {
              "id": "w0",
              "labelEn": "He"
            },
            {
              "id": "w1",
              "labelEn": "enjoys"
            },
            {
              "id": "w2",
              "labelEn": "taking"
            },
            {
              "id": "w3",
              "labelEn": "photos"
            }
          ],
          "speakOnPlace": true
        },
        {
          "items": [
            {
              "id": "w0",
              "labelEn": "We"
            },
            {
              "id": "w1",
              "labelEn": "love"
            },
            {
              "id": "w2",
              "labelEn": "hiking"
            }
          ],
          "speakOnPlace": true
        }
      ]
    },
    {
      "type": "mcq",
      "tagEn": "Personal Interests Challenge",
      "tagAr": "تحدي الاهتمامات الشخصية",
      "instructionsEn": "Choose the correct answer.",
      "instructionsAr": "اختر الإجابة الصحيحة.",
      "rounds": [
        {
          "promptEn": "🔭 The study of stars and planets:",
          "promptAr": "🔭 دراسة النجوم والكواكب:",
          "options": [
            "astronomy",
            "gardening",
            "coding"
          ],
          "correct": "astronomy"
        },
        {
          "promptEn": "💻 Writing programs for computers:",
          "promptAr": "💻 كتابة برامج للحاسوب:",
          "options": [
            "coding",
            "hiking",
            "calligraphy"
          ],
          "correct": "coding"
        },
        {
          "promptEn": "🖋️ The art of beautiful handwriting:",
          "promptAr": "🖋️ فن الكتابة الجميلة:",
          "options": [
            "photography",
            "calligraphy",
            "robotics"
          ],
          "correct": "calligraphy"
        },
        {
          "promptEn": "❓ \"I'm interested ___ robotics.\"",
          "promptAr": "❓ \"أنا مهتم بالروبوتات.\"",
          "options": [
            "on",
            "in",
            "at"
          ],
          "correct": "in"
        },
        {
          "promptEn": "❓ \"She's good ___ drawing.\"",
          "promptAr": "❓ \"هي ماهرة في الرسم.\"",
          "options": [
            "of",
            "in",
            "at"
          ],
          "correct": "at"
        },
        {
          "promptEn": "❓ \"He enjoys ___ stamps.\"",
          "promptAr": "❓ \"يستمتع بجمع الطوابع.\"",
          "options": [
            "collecting",
            "collect",
            "to collects"
          ],
          "correct": "collecting"
        }
      ]
    }
  ]
};

/* ============ GAME 2: HOUSE DESIGNS ============ */
const HOUSES_VOCAB = [
  {
    "id": "apartment",
    "en": "apartment",
    "ar": "شقة",
    "emoji": "🏢"
  },
  {
    "id": "villa",
    "en": "villa",
    "ar": "فيلا",
    "emoji": "🏡"
  },
  {
    "id": "balcony",
    "en": "balcony",
    "ar": "شرفة",
    "emoji": "🌇"
  },
  {
    "id": "garden",
    "en": "garden",
    "ar": "حديقة",
    "emoji": "🌳"
  },
  {
    "id": "stairs",
    "en": "stairs",
    "ar": "درج",
    "emoji": "🪜"
  },
  {
    "id": "roof",
    "en": "roof",
    "ar": "سطح",
    "emoji": "🏠"
  },
  {
    "id": "spacious",
    "en": "spacious",
    "ar": "واسع",
    "emoji": "↔️"
  },
  {
    "id": "modern",
    "en": "modern",
    "ar": "حديث",
    "emoji": "✨"
  }
];

const GAME_HOUSES = {
  "id": "houses",
  "emoji": "🏡",
  "titleEn": "House Designs",
  "titleAr": "تصاميم المنازل",
  "character": "maya",
  "introEn": "Let's design our dream house!",
  "introAr": "لنصمّم بيت أحلامنا!",
  "activities": [
    {
      "type": "vocab",
      "tagEn": "House Words",
      "tagAr": "كلمات المنزل",
      "instructionsEn": "Tap each card to hear the word.",
      "instructionsAr": "اضغط على كل بطاقة لسماع الكلمة.",
      "words": HOUSES_VOCAB
    },
    {
      "type": "teach",
      "tagEn": "Comparing Houses",
      "tagAr": "مقارنة المنازل",
      "teachBlocks": [
        {
          "pillEn": "Comparatives",
          "pillAr": "صيغة المقارنة",
          "descEn": "Short adjectives + -er; long ones: more…",
          "descAr": "الصفات القصيرة + er، والطويلة: more",
          "examples": [
            {
              "emoji": "💬",
              "textEn": "A villa is bigger than an apartment. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">الفيلا أكبر من الشقة.</span>"
            },
            {
              "emoji": "💬",
              "textEn": "This house is more modern than that one. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">هذا البيت أحدث من ذلك.</span>"
            }
          ]
        },
        {
          "pillEn": "There is / There are",
          "pillAr": "يوجد",
          "descEn": "Describe what's in a house.",
          "descAr": "صف ما في البيت.",
          "examples": [
            {
              "emoji": "💬",
              "textEn": "There is a balcony on the second floor. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">توجد شرفة في الطابق الثاني.</span>"
            },
            {
              "emoji": "💬",
              "textEn": "There are three bedrooms. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">توجد ثلاث غرف نوم.</span>"
            }
          ]
        }
      ]
    },
    {
      "type": "mcq",
      "tagEn": "Listen and Choose",
      "tagAr": "استمع واختر",
      "instructionsEn": "Listen and pick the word you hear.",
      "instructionsAr": "استمع واختر الكلمة التي سمعتها.",
      "rounds": [
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "spacious",
          "audio": true,
          "options": [
            "stairs",
            "apartment",
            "spacious"
          ],
          "correct": "spacious"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "apartment",
          "audio": true,
          "options": [
            "roof",
            "apartment",
            "stairs"
          ],
          "correct": "apartment"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "balcony",
          "audio": true,
          "options": [
            "spacious",
            "balcony",
            "stairs"
          ],
          "correct": "balcony"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "modern",
          "audio": true,
          "options": [
            "modern",
            "stairs",
            "roof"
          ],
          "correct": "modern"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "garden",
          "audio": true,
          "options": [
            "balcony",
            "garden",
            "stairs"
          ],
          "correct": "garden"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "villa",
          "audio": true,
          "options": [
            "villa",
            "apartment",
            "balcony"
          ],
          "correct": "villa"
        }
      ]
    },
    {
      "type": "match",
      "tagEn": "Match the Words",
      "tagAr": "طابق الكلمات",
      "instructionsEn": "Match each word to its picture.",
      "instructionsAr": "طابق كل كلمة مع صورتها.",
      "rounds": [
        {
          "pairs": [
            {
              "id": "stairs",
              "labelEn": "stairs",
              "labelAr": "درج",
              "emoji": "🪜"
            },
            {
              "id": "modern",
              "labelEn": "modern",
              "labelAr": "حديث",
              "emoji": "✨"
            },
            {
              "id": "villa",
              "labelEn": "villa",
              "labelAr": "فيلا",
              "emoji": "🏡"
            },
            {
              "id": "roof",
              "labelEn": "roof",
              "labelAr": "سطح",
              "emoji": "🏠"
            }
          ]
        },
        {
          "pairs": [
            {
              "id": "spacious",
              "labelEn": "spacious",
              "labelAr": "واسع",
              "emoji": "↔️"
            },
            {
              "id": "garden",
              "labelEn": "garden",
              "labelAr": "حديقة",
              "emoji": "🌳"
            },
            {
              "id": "balcony",
              "labelEn": "balcony",
              "labelAr": "شرفة",
              "emoji": "🌇"
            },
            {
              "id": "apartment",
              "labelEn": "apartment",
              "labelAr": "شقة",
              "emoji": "🏢"
            }
          ]
        }
      ]
    },
    {
      "type": "order",
      "tagEn": "Build the Sentence",
      "tagAr": "كوّن الجملة",
      "instructionsEn": "Tap the words in the correct order.",
      "instructionsAr": "اضغط على الكلمات بالترتيب الصحيح.",
      "speakOnPlace": true,
      "rounds": [
        {
          "items": [
            {
              "id": "w0",
              "labelEn": "A"
            },
            {
              "id": "w1",
              "labelEn": "villa"
            },
            {
              "id": "w2",
              "labelEn": "is"
            },
            {
              "id": "w3",
              "labelEn": "bigger"
            },
            {
              "id": "w4",
              "labelEn": "than"
            },
            {
              "id": "w5",
              "labelEn": "an"
            },
            {
              "id": "w6",
              "labelEn": "apartment"
            }
          ],
          "speakOnPlace": true
        },
        {
          "items": [
            {
              "id": "w0",
              "labelEn": "There"
            },
            {
              "id": "w1",
              "labelEn": "is"
            },
            {
              "id": "w2",
              "labelEn": "a"
            },
            {
              "id": "w3",
              "labelEn": "big"
            },
            {
              "id": "w4",
              "labelEn": "garden"
            }
          ],
          "speakOnPlace": true
        },
        {
          "items": [
            {
              "id": "w0",
              "labelEn": "My"
            },
            {
              "id": "w1",
              "labelEn": "room"
            },
            {
              "id": "w2",
              "labelEn": "is"
            },
            {
              "id": "w3",
              "labelEn": "more"
            },
            {
              "id": "w4",
              "labelEn": "spacious"
            }
          ],
          "speakOnPlace": true
        },
        {
          "items": [
            {
              "id": "w0",
              "labelEn": "There"
            },
            {
              "id": "w1",
              "labelEn": "are"
            },
            {
              "id": "w2",
              "labelEn": "two"
            },
            {
              "id": "w3",
              "labelEn": "balconies"
            }
          ],
          "speakOnPlace": true
        }
      ]
    },
    {
      "type": "mcq",
      "tagEn": "House Designs Challenge",
      "tagAr": "تحدي تصاميم المنازل",
      "instructionsEn": "Choose the correct answer.",
      "instructionsAr": "اختر الإجابة الصحيحة.",
      "rounds": [
        {
          "promptEn": "❓ \"A villa is ___ than a tent.\"",
          "promptAr": "❓ \"الفيلا أكبر من الخيمة.\"",
          "options": [
            "big",
            "bigger",
            "biggest"
          ],
          "correct": "bigger"
        },
        {
          "promptEn": "❓ \"This design is ___ modern than the old one.\"",
          "promptAr": "❓ \"هذا التصميم أحدث من القديم.\"",
          "options": [
            "more",
            "most",
            "much"
          ],
          "correct": "more"
        },
        {
          "promptEn": "❓ \"There ___ four rooms.\"",
          "promptAr": "❓ \"توجد أربع غرف.\"",
          "options": [
            "be",
            "are",
            "is"
          ],
          "correct": "are"
        },
        {
          "promptEn": "🪜 You use them to go upstairs.",
          "promptAr": "🪜 تستخدمه للصعود للأعلى.",
          "options": [
            "garden",
            "stairs",
            "roof"
          ],
          "correct": "stairs"
        },
        {
          "promptEn": "🏢 A home inside a tall building:",
          "promptAr": "🏢 منزل داخل مبنى طويل:",
          "options": [
            "garden",
            "apartment",
            "villa"
          ],
          "correct": "apartment"
        },
        {
          "promptEn": "↔️ Big with lots of room:",
          "promptAr": "↔️ كبير وفيه مساحة كثيرة:",
          "options": [
            "small",
            "modern",
            "spacious"
          ],
          "correct": "spacious"
        }
      ]
    }
  ]
};

/* ============ GAME 3: JOB PATHS ============ */
const JOBS_VOCAB = [
  {
    "id": "scientist",
    "en": "scientist",
    "ar": "عالِم",
    "emoji": "🔬"
  },
  {
    "id": "architect",
    "en": "architect",
    "ar": "مهندس معماري",
    "emoji": "📐"
  },
  {
    "id": "programmer",
    "en": "programmer",
    "ar": "مبرمج",
    "emoji": "👩‍💻"
  },
  {
    "id": "pharmacist",
    "en": "pharmacist",
    "ar": "صيدلي",
    "emoji": "💊"
  },
  {
    "id": "astronaut",
    "en": "astronaut",
    "ar": "رائد فضاء",
    "emoji": "👨‍🚀"
  },
  {
    "id": "journalist",
    "en": "journalist",
    "ar": "صحفي",
    "emoji": "📰"
  },
  {
    "id": "vet",
    "en": "vet",
    "ar": "طبيب بيطري",
    "emoji": "🐾"
  },
  {
    "id": "pilot",
    "en": "pilot",
    "ar": "طيار",
    "emoji": "✈️"
  }
];

const GAME_JOBS = {
  "id": "jobs",
  "emoji": "💼",
  "titleEn": "Job Paths",
  "titleAr": "المسارات المهنية",
  "character": "marya",
  "introEn": "What will you be in the future?",
  "introAr": "ماذا ستصبح في المستقبل؟",
  "activities": [
    {
      "type": "vocab",
      "tagEn": "Career Words",
      "tagAr": "كلمات المهن",
      "instructionsEn": "Tap each card to hear the word.",
      "instructionsAr": "اضغط على كل بطاقة لسماع الكلمة.",
      "words": JOBS_VOCAB
    },
    {
      "type": "teach",
      "tagEn": "Future Plans",
      "tagAr": "خطط المستقبل",
      "teachBlocks": [
        {
          "pillEn": "will + verb",
          "pillAr": "will + فعل",
          "descEn": "Talk about the future.",
          "descAr": "تحدث عن المستقبل.",
          "examples": [
            {
              "emoji": "💬",
              "textEn": "I will be a scientist. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">سأصبح عالِمًا.</span>"
            },
            {
              "emoji": "💬",
              "textEn": "She will study architecture. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">ستدرس الهندسة المعمارية.</span>"
            }
          ]
        },
        {
          "pillEn": "want to / would like to",
          "pillAr": "أريد أن / أود أن",
          "descEn": "Say your wishes politely.",
          "descAr": "عبّر عن رغبتك بأدب.",
          "examples": [
            {
              "emoji": "💬",
              "textEn": "I would like to be a vet. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">أود أن أصبح طبيبًا بيطريًا.</span>"
            },
            {
              "emoji": "💬",
              "textEn": "He wants to work in space. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">يريد أن يعمل في الفضاء.</span>"
            }
          ]
        }
      ]
    },
    {
      "type": "mcq",
      "tagEn": "Listen and Choose",
      "tagAr": "استمع واختر",
      "instructionsEn": "Listen and pick the word you hear.",
      "instructionsAr": "استمع واختر الكلمة التي سمعتها.",
      "rounds": [
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "scientist",
          "audio": true,
          "options": [
            "journalist",
            "scientist",
            "architect"
          ],
          "correct": "scientist"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "architect",
          "audio": true,
          "options": [
            "architect",
            "scientist",
            "journalist"
          ],
          "correct": "architect"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "vet",
          "audio": true,
          "options": [
            "astronaut",
            "pilot",
            "vet"
          ],
          "correct": "vet"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "astronaut",
          "audio": true,
          "options": [
            "scientist",
            "astronaut",
            "vet"
          ],
          "correct": "astronaut"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "journalist",
          "audio": true,
          "options": [
            "journalist",
            "astronaut",
            "architect"
          ],
          "correct": "journalist"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "programmer",
          "audio": true,
          "options": [
            "journalist",
            "architect",
            "programmer"
          ],
          "correct": "programmer"
        }
      ]
    },
    {
      "type": "match",
      "tagEn": "Match the Words",
      "tagAr": "طابق الكلمات",
      "instructionsEn": "Match each word to its picture.",
      "instructionsAr": "طابق كل كلمة مع صورتها.",
      "rounds": [
        {
          "pairs": [
            {
              "id": "astronaut",
              "labelEn": "astronaut",
              "labelAr": "رائد فضاء",
              "emoji": "👨‍🚀"
            },
            {
              "id": "pilot",
              "labelEn": "pilot",
              "labelAr": "طيار",
              "emoji": "✈️"
            },
            {
              "id": "scientist",
              "labelEn": "scientist",
              "labelAr": "عالِم",
              "emoji": "🔬"
            },
            {
              "id": "pharmacist",
              "labelEn": "pharmacist",
              "labelAr": "صيدلي",
              "emoji": "💊"
            }
          ]
        },
        {
          "pairs": [
            {
              "id": "programmer",
              "labelEn": "programmer",
              "labelAr": "مبرمج",
              "emoji": "👩‍💻"
            },
            {
              "id": "architect",
              "labelEn": "architect",
              "labelAr": "مهندس معماري",
              "emoji": "📐"
            },
            {
              "id": "journalist",
              "labelEn": "journalist",
              "labelAr": "صحفي",
              "emoji": "📰"
            },
            {
              "id": "vet",
              "labelEn": "vet",
              "labelAr": "طبيب بيطري",
              "emoji": "🐾"
            }
          ]
        }
      ]
    },
    {
      "type": "order",
      "tagEn": "Build the Sentence",
      "tagAr": "كوّن الجملة",
      "instructionsEn": "Tap the words in the correct order.",
      "instructionsAr": "اضغط على الكلمات بالترتيب الصحيح.",
      "speakOnPlace": true,
      "rounds": [
        {
          "items": [
            {
              "id": "w0",
              "labelEn": "I"
            },
            {
              "id": "w1",
              "labelEn": "will"
            },
            {
              "id": "w2",
              "labelEn": "be"
            },
            {
              "id": "w3",
              "labelEn": "an"
            },
            {
              "id": "w4",
              "labelEn": "architect"
            }
          ],
          "speakOnPlace": true
        },
        {
          "items": [
            {
              "id": "w0",
              "labelEn": "She"
            },
            {
              "id": "w1",
              "labelEn": "would"
            },
            {
              "id": "w2",
              "labelEn": "like"
            },
            {
              "id": "w3",
              "labelEn": "to"
            },
            {
              "id": "w4",
              "labelEn": "be"
            },
            {
              "id": "w5",
              "labelEn": "a"
            },
            {
              "id": "w6",
              "labelEn": "vet"
            }
          ],
          "speakOnPlace": true
        },
        {
          "items": [
            {
              "id": "w0",
              "labelEn": "He"
            },
            {
              "id": "w1",
              "labelEn": "wants"
            },
            {
              "id": "w2",
              "labelEn": "to"
            },
            {
              "id": "w3",
              "labelEn": "study"
            },
            {
              "id": "w4",
              "labelEn": "science"
            }
          ],
          "speakOnPlace": true
        },
        {
          "items": [
            {
              "id": "w0",
              "labelEn": "They"
            },
            {
              "id": "w1",
              "labelEn": "will"
            },
            {
              "id": "w2",
              "labelEn": "work"
            },
            {
              "id": "w3",
              "labelEn": "hard"
            }
          ],
          "speakOnPlace": true
        }
      ]
    },
    {
      "type": "mcq",
      "tagEn": "Job Paths Challenge",
      "tagAr": "تحدي المسارات المهنية",
      "instructionsEn": "Choose the correct answer.",
      "instructionsAr": "اختر الإجابة الصحيحة.",
      "rounds": [
        {
          "promptEn": "👨‍🚀 This person travels to space.",
          "promptAr": "👨‍🚀 هذا الشخص يسافر إلى الفضاء.",
          "options": [
            "pharmacist",
            "journalist",
            "astronaut"
          ],
          "correct": "astronaut"
        },
        {
          "promptEn": "🐾 This doctor treats animals.",
          "promptAr": "🐾 هذا الطبيب يعالج الحيوانات.",
          "options": [
            "architect",
            "programmer",
            "vet"
          ],
          "correct": "vet"
        },
        {
          "promptEn": "📐 This person designs buildings.",
          "promptAr": "📐 هذا الشخص يصمم المباني.",
          "options": [
            "pilot",
            "architect",
            "vet"
          ],
          "correct": "architect"
        },
        {
          "promptEn": "💊 This person gives you medicine at a pharmacy.",
          "promptAr": "💊 هذا الشخص يعطيك الدواء في الصيدلية.",
          "options": [
            "scientist",
            "pharmacist",
            "journalist"
          ],
          "correct": "pharmacist"
        },
        {
          "promptEn": "❓ \"I ___ be a pilot one day.\"",
          "promptAr": "❓ \"سأصبح طيارًا يومًا ما.\"",
          "options": [
            "am",
            "was",
            "will"
          ],
          "correct": "will"
        },
        {
          "promptEn": "❓ \"She would like ___ be a journalist.\"",
          "promptAr": "❓ \"تود أن تصبح صحفية.\"",
          "options": [
            "at",
            "for",
            "to"
          ],
          "correct": "to"
        }
      ]
    }
  ]
};

/* ============ GAME 4: GLORIOUS FOOD ============ */
const FOOD_VOCAB = [
  {
    "id": "kabsa",
    "en": "kabsa",
    "ar": "كبسة",
    "emoji": "🍛"
  },
  {
    "id": "dates",
    "en": "dates",
    "ar": "تمر",
    "emoji": "🌴"
  },
  {
    "id": "honey",
    "en": "honey",
    "ar": "عسل",
    "emoji": "🍯"
  },
  {
    "id": "rice",
    "en": "rice",
    "ar": "أرز",
    "emoji": "🍚"
  },
  {
    "id": "spicy",
    "en": "spicy",
    "ar": "حار",
    "emoji": "🌶️"
  },
  {
    "id": "sweet",
    "en": "sweet",
    "ar": "حلو",
    "emoji": "🍬"
  },
  {
    "id": "delicious",
    "en": "delicious",
    "ar": "لذيذ",
    "emoji": "😋"
  },
  {
    "id": "recipe",
    "en": "recipe",
    "ar": "وصفة",
    "emoji": "📜"
  }
];

const GAME_FOOD = {
  "id": "food",
  "emoji": "🍽️",
  "titleEn": "Glorious Food",
  "titleAr": "الطعام الشهي",
  "character": "malik",
  "introEn": "Let's cook and taste delicious food!",
  "introAr": "لنطبخ ونتذوق طعامًا لذيذًا!",
  "activities": [
    {
      "type": "vocab",
      "tagEn": "Food Words",
      "tagAr": "كلمات الطعام",
      "instructionsEn": "Tap each card to hear the word.",
      "instructionsAr": "اضغط على كل بطاقة لسماع الكلمة.",
      "words": FOOD_VOCAB
    },
    {
      "type": "teach",
      "tagEn": "Countable & Uncountable",
      "tagAr": "المعدود وغير المعدود",
      "teachBlocks": [
        {
          "pillEn": "How much / How many",
          "pillAr": "كم (غير معدود / معدود)",
          "descEn": "How much + uncountable; How many + countable.",
          "descAr": "How much للأشياء غير المعدودة و How many للمعدودة.",
          "examples": [
            {
              "emoji": "💬",
              "textEn": "How much rice do we need? <span class=\"ar-text\" style=\"display:block;font-size:14px;\">كم نحتاج من الأرز؟</span>"
            },
            {
              "emoji": "💬",
              "textEn": "How many dates are there? <span class=\"ar-text\" style=\"display:block;font-size:14px;\">كم تمرة يوجد؟</span>"
            }
          ]
        },
        {
          "pillEn": "some / any",
          "pillAr": "بعض / أي",
          "descEn": "Use some in positive, any in questions and negatives.",
          "descAr": "some في الإثبات و any في السؤال والنفي.",
          "examples": [
            {
              "emoji": "💬",
              "textEn": "There is some honey. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">يوجد بعض العسل.</span>"
            },
            {
              "emoji": "💬",
              "textEn": "Are there any tomatoes? <span class=\"ar-text\" style=\"display:block;font-size:14px;\">هل يوجد أي طماطم؟</span>"
            }
          ]
        }
      ]
    },
    {
      "type": "mcq",
      "tagEn": "Listen and Choose",
      "tagAr": "استمع واختر",
      "instructionsEn": "Listen and pick the word you hear.",
      "instructionsAr": "استمع واختر الكلمة التي سمعتها.",
      "rounds": [
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "dates",
          "audio": true,
          "options": [
            "dates",
            "recipe",
            "sweet"
          ],
          "correct": "dates"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "spicy",
          "audio": true,
          "options": [
            "recipe",
            "spicy",
            "dates"
          ],
          "correct": "spicy"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "delicious",
          "audio": true,
          "options": [
            "delicious",
            "recipe",
            "honey"
          ],
          "correct": "delicious"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "recipe",
          "audio": true,
          "options": [
            "honey",
            "recipe",
            "kabsa"
          ],
          "correct": "recipe"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "honey",
          "audio": true,
          "options": [
            "honey",
            "delicious",
            "spicy"
          ],
          "correct": "honey"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "rice",
          "audio": true,
          "options": [
            "sweet",
            "delicious",
            "rice"
          ],
          "correct": "rice"
        }
      ]
    },
    {
      "type": "match",
      "tagEn": "Match the Words",
      "tagAr": "طابق الكلمات",
      "instructionsEn": "Match each word to its picture.",
      "instructionsAr": "طابق كل كلمة مع صورتها.",
      "rounds": [
        {
          "pairs": [
            {
              "id": "spicy",
              "labelEn": "spicy",
              "labelAr": "حار",
              "emoji": "🌶️"
            },
            {
              "id": "kabsa",
              "labelEn": "kabsa",
              "labelAr": "كبسة",
              "emoji": "🍛"
            },
            {
              "id": "delicious",
              "labelEn": "delicious",
              "labelAr": "لذيذ",
              "emoji": "😋"
            },
            {
              "id": "honey",
              "labelEn": "honey",
              "labelAr": "عسل",
              "emoji": "🍯"
            }
          ]
        },
        {
          "pairs": [
            {
              "id": "recipe",
              "labelEn": "recipe",
              "labelAr": "وصفة",
              "emoji": "📜"
            },
            {
              "id": "sweet",
              "labelEn": "sweet",
              "labelAr": "حلو",
              "emoji": "🍬"
            },
            {
              "id": "dates",
              "labelEn": "dates",
              "labelAr": "تمر",
              "emoji": "🌴"
            },
            {
              "id": "rice",
              "labelEn": "rice",
              "labelAr": "أرز",
              "emoji": "🍚"
            }
          ]
        }
      ]
    },
    {
      "type": "order",
      "tagEn": "Build the Sentence",
      "tagAr": "كوّن الجملة",
      "instructionsEn": "Tap the words in the correct order.",
      "instructionsAr": "اضغط على الكلمات بالترتيب الصحيح.",
      "speakOnPlace": true,
      "rounds": [
        {
          "items": [
            {
              "id": "w0",
              "labelEn": "How"
            },
            {
              "id": "w1",
              "labelEn": "much"
            },
            {
              "id": "w2",
              "labelEn": "rice"
            },
            {
              "id": "w3",
              "labelEn": "do"
            },
            {
              "id": "w4",
              "labelEn": "we"
            },
            {
              "id": "w5",
              "labelEn": "need"
            }
          ],
          "speakOnPlace": true
        },
        {
          "items": [
            {
              "id": "w0",
              "labelEn": "Kabsa"
            },
            {
              "id": "w1",
              "labelEn": "is"
            },
            {
              "id": "w2",
              "labelEn": "delicious"
            }
          ],
          "speakOnPlace": true
        },
        {
          "items": [
            {
              "id": "w0",
              "labelEn": "There"
            },
            {
              "id": "w1",
              "labelEn": "is"
            },
            {
              "id": "w2",
              "labelEn": "some"
            },
            {
              "id": "w3",
              "labelEn": "honey"
            }
          ],
          "speakOnPlace": true
        },
        {
          "items": [
            {
              "id": "w0",
              "labelEn": "Are"
            },
            {
              "id": "w1",
              "labelEn": "there"
            },
            {
              "id": "w2",
              "labelEn": "any"
            },
            {
              "id": "w3",
              "labelEn": "dates"
            }
          ],
          "speakOnPlace": true
        }
      ]
    },
    {
      "type": "mcq",
      "tagEn": "Glorious Food Challenge",
      "tagAr": "تحدي الطعام الشهي",
      "instructionsEn": "Choose the correct answer.",
      "instructionsAr": "اختر الإجابة الصحيحة.",
      "rounds": [
        {
          "promptEn": "❓ \"How ___ sugar do you want?\"",
          "promptAr": "❓ \"كم تريد من السكر؟\"",
          "options": [
            "much",
            "many",
            "any"
          ],
          "correct": "much"
        },
        {
          "promptEn": "❓ \"How ___ eggs are there?\"",
          "promptAr": "❓ \"كم بيضة يوجد؟\"",
          "options": [
            "much",
            "some",
            "many"
          ],
          "correct": "many"
        },
        {
          "promptEn": "❓ \"Is there ___ milk?\"",
          "promptAr": "❓ \"هل يوجد حليب؟\"",
          "options": [
            "a",
            "any",
            "many"
          ],
          "correct": "any"
        },
        {
          "promptEn": "🌶️ Food with a lot of hot pepper is…",
          "promptAr": "🌶️ الطعام الذي فيه فلفل حار كثير…",
          "options": [
            "spicy",
            "salty",
            "sweet"
          ],
          "correct": "spicy"
        },
        {
          "promptEn": "📜 Instructions for cooking a dish:",
          "promptAr": "📜 تعليمات طبخ طبق:",
          "options": [
            "menu",
            "recipe",
            "kitchen"
          ],
          "correct": "recipe"
        },
        {
          "promptEn": "🍛 A famous Saudi rice dish:",
          "promptAr": "🍛 طبق أرز سعودي مشهور:",
          "options": [
            "pizza",
            "sushi",
            "kabsa"
          ],
          "correct": "kabsa"
        }
      ]
    }
  ]
};

const ALL_GAMES = [GAME_INTERESTS, GAME_HOUSES, GAME_JOBS, GAME_FOOD];
