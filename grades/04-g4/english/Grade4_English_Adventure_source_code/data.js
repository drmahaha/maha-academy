/* ============================================================
   Maha Academy — English Adventure — GRADE 4 (Top Goal 1, Term 1)
   1. Family Events · 2. Chores · 3. Stories · 4. After-School Fun
   ============================================================ */

function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

/* ============ GAME 1: FAMILY EVENTS ============ */
const FAMILY_VOCAB = [
  {
    "id": "wedding",
    "en": "wedding",
    "ar": "حفل زفاف",
    "emoji": "💍"
  },
  {
    "id": "graduation",
    "en": "graduation",
    "ar": "حفل تخرج",
    "emoji": "🎓"
  },
  {
    "id": "eid",
    "en": "Eid",
    "ar": "العيد",
    "emoji": "🌙"
  },
  {
    "id": "party",
    "en": "party",
    "ar": "حفلة",
    "emoji": "🎉"
  },
  {
    "id": "gift",
    "en": "gift",
    "ar": "هدية",
    "emoji": "🎁"
  },
  {
    "id": "cake",
    "en": "cake",
    "ar": "كعكة",
    "emoji": "🎂"
  },
  {
    "id": "cousin",
    "en": "cousin",
    "ar": "ابن العم / الخال",
    "emoji": "🧒"
  },
  {
    "id": "grandparents",
    "en": "grandparents",
    "ar": "الجد والجدة",
    "emoji": "👴"
  }
];

const GAME_FAMILY = {
  "id": "family",
  "emoji": "🎉",
  "titleEn": "Family Events",
  "titleAr": "مناسبات عائلية",
  "character": "mahir",
  "introEn": "Let's celebrate with the family!",
  "introAr": "لنحتفل مع العائلة!",
  "activities": [
    {
      "type": "vocab",
      "tagEn": "Event Words",
      "tagAr": "كلمات المناسبات",
      "instructionsEn": "Tap each card to hear the word.",
      "instructionsAr": "اضغط على كل بطاقة لسماع الكلمة.",
      "words": FAMILY_VOCAB
    },
    {
      "type": "teach",
      "tagEn": "Talking About Events",
      "tagAr": "الحديث عن المناسبات",
      "teachBlocks": [
        {
          "pillEn": "When is…?",
          "pillAr": "متى…؟",
          "descEn": "Ask about the time of an event.",
          "descAr": "اسأل عن موعد مناسبة.",
          "examples": [
            {
              "emoji": "💬",
              "textEn": "When is the party? — It's on Friday. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">متى الحفلة؟ — يوم الجمعة.</span>"
            },
            {
              "emoji": "💬",
              "textEn": "The wedding is in June. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">حفل الزفاف في يونيو.</span>"
            }
          ]
        },
        {
          "pillEn": "We are going to…",
          "pillAr": "سوف…",
          "descEn": "Talk about future plans.",
          "descAr": "تحدث عن خطط المستقبل.",
          "examples": [
            {
              "emoji": "💬",
              "textEn": "We are going to visit our grandparents. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">سنزور جدّينا.</span>"
            },
            {
              "emoji": "💬",
              "textEn": "I'm going to buy a gift. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">سأشتري هدية.</span>"
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
          "speak": "cousin",
          "audio": true,
          "options": [
            "graduation",
            "Eid",
            "cousin"
          ],
          "correct": "cousin"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "gift",
          "audio": true,
          "options": [
            "wedding",
            "cake",
            "gift"
          ],
          "correct": "gift"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "grandparents",
          "audio": true,
          "options": [
            "grandparents",
            "graduation",
            "gift"
          ],
          "correct": "grandparents"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "wedding",
          "audio": true,
          "options": [
            "wedding",
            "grandparents",
            "cousin"
          ],
          "correct": "wedding"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "graduation",
          "audio": true,
          "options": [
            "graduation",
            "grandparents",
            "cousin"
          ],
          "correct": "graduation"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "party",
          "audio": true,
          "options": [
            "party",
            "wedding",
            "Eid"
          ],
          "correct": "party"
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
              "id": "party",
              "labelEn": "party",
              "labelAr": "حفلة",
              "emoji": "🎉"
            },
            {
              "id": "grandparents",
              "labelEn": "grandparents",
              "labelAr": "الجد والجدة",
              "emoji": "👴"
            },
            {
              "id": "graduation",
              "labelEn": "graduation",
              "labelAr": "حفل تخرج",
              "emoji": "🎓"
            },
            {
              "id": "cake",
              "labelEn": "cake",
              "labelAr": "كعكة",
              "emoji": "🎂"
            }
          ]
        },
        {
          "pairs": [
            {
              "id": "cousin",
              "labelEn": "cousin",
              "labelAr": "ابن العم / الخال",
              "emoji": "🧒"
            },
            {
              "id": "gift",
              "labelEn": "gift",
              "labelAr": "هدية",
              "emoji": "🎁"
            },
            {
              "id": "wedding",
              "labelEn": "wedding",
              "labelAr": "حفل زفاف",
              "emoji": "💍"
            },
            {
              "id": "eid",
              "labelEn": "Eid",
              "labelAr": "العيد",
              "emoji": "🌙"
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
              "labelEn": "When"
            },
            {
              "id": "w1",
              "labelEn": "is"
            },
            {
              "id": "w2",
              "labelEn": "the"
            },
            {
              "id": "w3",
              "labelEn": "party"
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
              "labelEn": "are"
            },
            {
              "id": "w2",
              "labelEn": "going"
            },
            {
              "id": "w3",
              "labelEn": "to"
            },
            {
              "id": "w4",
              "labelEn": "visit"
            },
            {
              "id": "w5",
              "labelEn": "grandma"
            }
          ],
          "speakOnPlace": true
        },
        {
          "items": [
            {
              "id": "w0",
              "labelEn": "The"
            },
            {
              "id": "w1",
              "labelEn": "wedding"
            },
            {
              "id": "w2",
              "labelEn": "is"
            },
            {
              "id": "w3",
              "labelEn": "on"
            },
            {
              "id": "w4",
              "labelEn": "Friday"
            }
          ],
          "speakOnPlace": true
        },
        {
          "items": [
            {
              "id": "w0",
              "labelEn": "I'm"
            },
            {
              "id": "w1",
              "labelEn": "buying"
            },
            {
              "id": "w2",
              "labelEn": "a"
            },
            {
              "id": "w3",
              "labelEn": "gift"
            }
          ],
          "speakOnPlace": true
        }
      ]
    },
    {
      "type": "mcq",
      "tagEn": "Family Events Challenge",
      "tagAr": "تحدي مناسبات عائلية",
      "instructionsEn": "Choose the correct answer.",
      "instructionsAr": "اختر الإجابة الصحيحة.",
      "rounds": [
        {
          "promptEn": "🎓 My brother finished university. We go to his…",
          "promptAr": "🎓 أنهى أخي الجامعة. نذهب إلى…",
          "options": [
            "Eid",
            "wedding",
            "graduation"
          ],
          "correct": "graduation"
        },
        {
          "promptEn": "🌙 After Ramadan we celebrate…",
          "promptAr": "🌙 بعد رمضان نحتفل بـ…",
          "options": [
            "wedding",
            "graduation",
            "Eid"
          ],
          "correct": "Eid"
        },
        {
          "promptEn": "🎁 You give this to someone on a special day.",
          "promptAr": "🎁 تعطيه لشخص في يوم مميز.",
          "options": [
            "cousin",
            "gift",
            "cake"
          ],
          "correct": "gift"
        },
        {
          "promptEn": "👴 My father's parents are my…",
          "promptAr": "👴 والدا أبي هما…",
          "options": [
            "grandparents",
            "friends",
            "cousins"
          ],
          "correct": "grandparents"
        },
        {
          "promptEn": "❓ \"We ___ going to have a party.\"",
          "promptAr": "❓ \"سنقيم حفلة.\"",
          "options": [
            "is",
            "am",
            "are"
          ],
          "correct": "are"
        },
        {
          "promptEn": "❓ \"When is Eid?\" — \"It's ___ Tuesday.\"",
          "promptAr": "❓ \"متى العيد؟\" — \"يوم الثلاثاء.\"",
          "options": [
            "at",
            "in",
            "on"
          ],
          "correct": "on"
        }
      ]
    }
  ]
};

/* ============ GAME 2: CHORES ============ */
const CHORES_VOCAB = [
  {
    "id": "sweep_the_floor",
    "en": "sweep the floor",
    "ar": "أكنس الأرض",
    "emoji": "🧹"
  },
  {
    "id": "do_the_laundry",
    "en": "do the laundry",
    "ar": "أغسل الملابس",
    "emoji": "🧺"
  },
  {
    "id": "dust",
    "en": "dust",
    "ar": "أزيل الغبار",
    "emoji": "🪶"
  },
  {
    "id": "vacuum",
    "en": "vacuum",
    "ar": "أنظّف بالمكنسة الكهربائية",
    "emoji": "🔌"
  },
  {
    "id": "cook_dinner",
    "en": "cook dinner",
    "ar": "أطبخ العشاء",
    "emoji": "🍲"
  },
  {
    "id": "always",
    "en": "always",
    "ar": "دائمًا",
    "emoji": "💯"
  },
  {
    "id": "sometimes",
    "en": "sometimes",
    "ar": "أحيانًا",
    "emoji": "🔄"
  },
  {
    "id": "never",
    "en": "never",
    "ar": "أبدًا",
    "emoji": "🚫"
  }
];

const GAME_CHORES = {
  "id": "chores",
  "emoji": "🧺",
  "titleEn": "Chores",
  "titleAr": "الأعمال المنزلية",
  "character": "maya",
  "introEn": "How often do you help at home?",
  "introAr": "كم مرة تساعد في البيت؟",
  "activities": [
    {
      "type": "vocab",
      "tagEn": "Chore Words",
      "tagAr": "كلمات الأعمال المنزلية",
      "instructionsEn": "Tap each card to hear the word.",
      "instructionsAr": "اضغط على كل بطاقة لسماع الكلمة.",
      "words": CHORES_VOCAB
    },
    {
      "type": "teach",
      "tagEn": "How Often?",
      "tagAr": "كم مرة؟",
      "teachBlocks": [
        {
          "pillEn": "How often…?",
          "pillAr": "كم مرة…؟",
          "descEn": "Ask how often someone does something.",
          "descAr": "اسأل كم مرة يفعل شخص شيئًا.",
          "examples": [
            {
              "emoji": "💬",
              "textEn": "How often do you sweep the floor? — Every day. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">كم مرة تكنس الأرض؟ — كل يوم.</span>"
            },
            {
              "emoji": "💬",
              "textEn": "I always make my bed. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">أنا دائمًا أرتب سريري.</span>"
            }
          ]
        },
        {
          "pillEn": "always / sometimes / never",
          "pillAr": "دائمًا / أحيانًا / أبدًا",
          "descEn": "Frequency words go before the verb.",
          "descAr": "كلمات التكرار تأتي قبل الفعل.",
          "examples": [
            {
              "emoji": "💬",
              "textEn": "She sometimes cooks dinner. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">هي أحيانًا تطبخ العشاء.</span>"
            },
            {
              "emoji": "💬",
              "textEn": "He never does the laundry. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">هو لا يغسل الملابس أبدًا.</span>"
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
          "speak": "vacuum",
          "audio": true,
          "options": [
            "vacuum",
            "sweep the floor",
            "sometimes"
          ],
          "correct": "vacuum"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "sometimes",
          "audio": true,
          "options": [
            "sometimes",
            "dust",
            "vacuum"
          ],
          "correct": "sometimes"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "sweep the floor",
          "audio": true,
          "options": [
            "always",
            "never",
            "sweep the floor"
          ],
          "correct": "sweep the floor"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "always",
          "audio": true,
          "options": [
            "always",
            "vacuum",
            "never"
          ],
          "correct": "always"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "never",
          "audio": true,
          "options": [
            "always",
            "cook dinner",
            "never"
          ],
          "correct": "never"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "dust",
          "audio": true,
          "options": [
            "do the laundry",
            "sweep the floor",
            "dust"
          ],
          "correct": "dust"
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
              "id": "sometimes",
              "labelEn": "sometimes",
              "labelAr": "أحيانًا",
              "emoji": "🔄"
            },
            {
              "id": "always",
              "labelEn": "always",
              "labelAr": "دائمًا",
              "emoji": "💯"
            },
            {
              "id": "sweep_the_floor",
              "labelEn": "sweep the floor",
              "labelAr": "أكنس الأرض",
              "emoji": "🧹"
            },
            {
              "id": "vacuum",
              "labelEn": "vacuum",
              "labelAr": "أنظّف بالمكنسة الكهربائية",
              "emoji": "🔌"
            }
          ]
        },
        {
          "pairs": [
            {
              "id": "do_the_laundry",
              "labelEn": "do the laundry",
              "labelAr": "أغسل الملابس",
              "emoji": "🧺"
            },
            {
              "id": "never",
              "labelEn": "never",
              "labelAr": "أبدًا",
              "emoji": "🚫"
            },
            {
              "id": "dust",
              "labelEn": "dust",
              "labelAr": "أزيل الغبار",
              "emoji": "🪶"
            },
            {
              "id": "cook_dinner",
              "labelEn": "cook dinner",
              "labelAr": "أطبخ العشاء",
              "emoji": "🍲"
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
              "labelEn": "always"
            },
            {
              "id": "w2",
              "labelEn": "make"
            },
            {
              "id": "w3",
              "labelEn": "my"
            },
            {
              "id": "w4",
              "labelEn": "bed"
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
              "labelEn": "sometimes"
            },
            {
              "id": "w2",
              "labelEn": "cooks"
            },
            {
              "id": "w3",
              "labelEn": "dinner"
            }
          ],
          "speakOnPlace": true
        },
        {
          "items": [
            {
              "id": "w0",
              "labelEn": "How"
            },
            {
              "id": "w1",
              "labelEn": "often"
            },
            {
              "id": "w2",
              "labelEn": "do"
            },
            {
              "id": "w3",
              "labelEn": "you"
            },
            {
              "id": "w4",
              "labelEn": "dust"
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
              "labelEn": "never"
            },
            {
              "id": "w2",
              "labelEn": "sweeps"
            },
            {
              "id": "w3",
              "labelEn": "the"
            },
            {
              "id": "w4",
              "labelEn": "floor"
            }
          ],
          "speakOnPlace": true
        }
      ]
    },
    {
      "type": "mcq",
      "tagEn": "Chores Challenge",
      "tagAr": "تحدي الأعمال المنزلية",
      "instructionsEn": "Choose the correct answer.",
      "instructionsAr": "اختر الإجابة الصحيحة.",
      "rounds": [
        {
          "promptEn": "💯 Every day, with no exceptions:",
          "promptAr": "💯 كل يوم بلا استثناء:",
          "options": [
            "sometimes",
            "always",
            "never"
          ],
          "correct": "always"
        },
        {
          "promptEn": "🚫 Not one time:",
          "promptAr": "🚫 ولا مرة:",
          "options": [
            "always",
            "usually",
            "never"
          ],
          "correct": "never"
        },
        {
          "promptEn": "🧺 You wash clothes. You…",
          "promptAr": "🧺 تغسل الملابس. أنت…",
          "options": [
            "sweep the floor",
            "do the laundry",
            "dust"
          ],
          "correct": "do the laundry"
        },
        {
          "promptEn": "🔌 You clean the carpet with a machine. You…",
          "promptAr": "🔌 تنظف السجادة بآلة. أنت…",
          "options": [
            "vacuum",
            "cook dinner",
            "dust"
          ],
          "correct": "vacuum"
        },
        {
          "promptEn": "❓ \"She ___ helps her mother.\"",
          "promptAr": "❓ \"هي دائمًا تساعد أمها.\"",
          "options": [
            "every",
            "how",
            "always"
          ],
          "correct": "always"
        },
        {
          "promptEn": "❓ \"___ often do you cook?\"",
          "promptAr": "❓ \"كم مرة تطبخ؟\"",
          "options": [
            "What",
            "Who",
            "How"
          ],
          "correct": "How"
        }
      ]
    }
  ]
};

/* ============ GAME 3: STORIES ============ */
const STORIES_VOCAB = [
  {
    "id": "king",
    "en": "king",
    "ar": "ملك",
    "emoji": "🤴"
  },
  {
    "id": "castle",
    "en": "castle",
    "ar": "قلعة",
    "emoji": "🏰"
  },
  {
    "id": "dragon",
    "en": "dragon",
    "ar": "تنين",
    "emoji": "🐉"
  },
  {
    "id": "forest",
    "en": "forest",
    "ar": "غابة",
    "emoji": "🌲"
  },
  {
    "id": "brave",
    "en": "brave",
    "ar": "شجاع",
    "emoji": "🦸"
  },
  {
    "id": "happy_ending",
    "en": "happy ending",
    "ar": "نهاية سعيدة",
    "emoji": "😊"
  },
  {
    "id": "walked",
    "en": "walked",
    "ar": "مشى",
    "emoji": "🚶"
  },
  {
    "id": "found",
    "en": "found",
    "ar": "وجد",
    "emoji": "🔍"
  }
];

const GAME_STORIES = {
  "id": "stories",
  "emoji": "📖",
  "titleEn": "Stories",
  "titleAr": "القصص",
  "character": "marya",
  "introEn": "Once upon a time… let's read stories!",
  "introAr": "كان يا ما كان… لنقرأ القصص!",
  "activities": [
    {
      "type": "vocab",
      "tagEn": "Story Words",
      "tagAr": "كلمات القصص",
      "instructionsEn": "Tap each card to hear the word.",
      "instructionsAr": "اضغط على كل بطاقة لسماع الكلمة.",
      "words": STORIES_VOCAB
    },
    {
      "type": "teach",
      "tagEn": "Telling a Story",
      "tagAr": "سرد قصة",
      "teachBlocks": [
        {
          "pillEn": "Past tense (-ed)",
          "pillAr": "الماضي (-ed)",
          "descEn": "Add -ed to many verbs for the past.",
          "descAr": "أضف ed لكثير من الأفعال للماضي.",
          "examples": [
            {
              "emoji": "💬",
              "textEn": "He walked to the castle. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">مشى إلى القلعة.</span>"
            },
            {
              "emoji": "💬",
              "textEn": "They played in the forest. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">لعبوا في الغابة.</span>"
            }
          ]
        },
        {
          "pillEn": "Irregular past",
          "pillAr": "الماضي الشاذ",
          "descEn": "Some verbs change: find → found, go → went.",
          "descAr": "بعض الأفعال تتغير: find → found.",
          "examples": [
            {
              "emoji": "💬",
              "textEn": "The king found a map. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">وجد الملك خريطة.</span>"
            },
            {
              "emoji": "💬",
              "textEn": "The brave girl went into the forest. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">ذهبت الفتاة الشجاعة إلى الغابة.</span>"
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
          "speak": "brave",
          "audio": true,
          "options": [
            "forest",
            "dragon",
            "brave"
          ],
          "correct": "brave"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "happy ending",
          "audio": true,
          "options": [
            "happy ending",
            "king",
            "found"
          ],
          "correct": "happy ending"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "king",
          "audio": true,
          "options": [
            "king",
            "forest",
            "castle"
          ],
          "correct": "king"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "dragon",
          "audio": true,
          "options": [
            "brave",
            "happy ending",
            "dragon"
          ],
          "correct": "dragon"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "walked",
          "audio": true,
          "options": [
            "walked",
            "dragon",
            "forest"
          ],
          "correct": "walked"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "forest",
          "audio": true,
          "options": [
            "happy ending",
            "forest",
            "dragon"
          ],
          "correct": "forest"
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
              "id": "walked",
              "labelEn": "walked",
              "labelAr": "مشى",
              "emoji": "🚶"
            },
            {
              "id": "forest",
              "labelEn": "forest",
              "labelAr": "غابة",
              "emoji": "🌲"
            },
            {
              "id": "king",
              "labelEn": "king",
              "labelAr": "ملك",
              "emoji": "🤴"
            },
            {
              "id": "brave",
              "labelEn": "brave",
              "labelAr": "شجاع",
              "emoji": "🦸"
            }
          ]
        },
        {
          "pairs": [
            {
              "id": "found",
              "labelEn": "found",
              "labelAr": "وجد",
              "emoji": "🔍"
            },
            {
              "id": "castle",
              "labelEn": "castle",
              "labelAr": "قلعة",
              "emoji": "🏰"
            },
            {
              "id": "dragon",
              "labelEn": "dragon",
              "labelAr": "تنين",
              "emoji": "🐉"
            },
            {
              "id": "happy_ending",
              "labelEn": "happy ending",
              "labelAr": "نهاية سعيدة",
              "emoji": "😊"
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
              "labelEn": "Once"
            },
            {
              "id": "w1",
              "labelEn": "upon"
            },
            {
              "id": "w2",
              "labelEn": "a"
            },
            {
              "id": "w3",
              "labelEn": "time"
            }
          ],
          "speakOnPlace": true
        },
        {
          "items": [
            {
              "id": "w0",
              "labelEn": "The"
            },
            {
              "id": "w1",
              "labelEn": "king"
            },
            {
              "id": "w2",
              "labelEn": "lived"
            },
            {
              "id": "w3",
              "labelEn": "in"
            },
            {
              "id": "w4",
              "labelEn": "a"
            },
            {
              "id": "w5",
              "labelEn": "castle"
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
              "labelEn": "found"
            },
            {
              "id": "w2",
              "labelEn": "a"
            },
            {
              "id": "w3",
              "labelEn": "small"
            },
            {
              "id": "w4",
              "labelEn": "key"
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
              "labelEn": "walked"
            },
            {
              "id": "w2",
              "labelEn": "into"
            },
            {
              "id": "w3",
              "labelEn": "the"
            },
            {
              "id": "w4",
              "labelEn": "forest"
            }
          ],
          "speakOnPlace": true
        }
      ]
    },
    {
      "type": "mcq",
      "tagEn": "Stories Challenge",
      "tagAr": "تحدي القصص",
      "instructionsEn": "Choose the correct answer.",
      "instructionsAr": "اختر الإجابة الصحيحة.",
      "rounds": [
        {
          "promptEn": "❓ Past of \"walk\":",
          "promptAr": "❓ ماضي walk:",
          "options": [
            "walked",
            "walking",
            "walks"
          ],
          "correct": "walked"
        },
        {
          "promptEn": "❓ Past of \"go\":",
          "promptAr": "❓ ماضي go:",
          "options": [
            "goes",
            "went",
            "goed"
          ],
          "correct": "went"
        },
        {
          "promptEn": "❓ Past of \"find\":",
          "promptAr": "❓ ماضي find:",
          "options": [
            "finds",
            "found",
            "finded"
          ],
          "correct": "found"
        },
        {
          "promptEn": "🏰 A king lives in a…",
          "promptAr": "🏰 الملك يعيش في…",
          "options": [
            "castle",
            "cave",
            "forest"
          ],
          "correct": "castle"
        },
        {
          "promptEn": "🦸 Not afraid:",
          "promptAr": "🦸 غير خائف:",
          "options": [
            "sad",
            "tired",
            "brave"
          ],
          "correct": "brave"
        },
        {
          "promptEn": "📖 Many stories begin with…",
          "promptAr": "📖 تبدأ قصص كثيرة بـ…",
          "options": [
            "Good night",
            "Once upon a time",
            "See you later"
          ],
          "correct": "Once upon a time"
        }
      ]
    }
  ]
};

/* ============ GAME 4: AFTER-SCHOOL FUN ============ */
const FUN_VOCAB = [
  {
    "id": "draw_pictures",
    "en": "draw pictures",
    "ar": "أرسم صورًا",
    "emoji": "🎨"
  },
  {
    "id": "play_video_games",
    "en": "play video games",
    "ar": "ألعب ألعاب الفيديو",
    "emoji": "🎮"
  },
  {
    "id": "read_comics",
    "en": "read comics",
    "ar": "أقرأ القصص المصورة",
    "emoji": "📚"
  },
  {
    "id": "ride_my_bike",
    "en": "ride my bike",
    "ar": "أركب دراجتي",
    "emoji": "🚲"
  },
  {
    "id": "play_chess",
    "en": "play chess",
    "ar": "ألعب الشطرنج",
    "emoji": "♟️"
  },
  {
    "id": "visit_friends",
    "en": "visit friends",
    "ar": "أزور الأصدقاء",
    "emoji": "🧑‍🤝‍🧑"
  },
  {
    "id": "do_homework",
    "en": "do homework",
    "ar": "أحل الواجب",
    "emoji": "📝"
  },
  {
    "id": "bake_cookies",
    "en": "bake cookies",
    "ar": "أخبز البسكويت",
    "emoji": "🍪"
  }
];

const GAME_FUN = {
  "id": "fun",
  "emoji": "🎨",
  "titleEn": "After-School Fun",
  "titleAr": "متعة بعد المدرسة",
  "character": "malik",
  "introEn": "What do you do after school?",
  "introAr": "ماذا تفعل بعد المدرسة؟",
  "activities": [
    {
      "type": "vocab",
      "tagEn": "Activity Words",
      "tagAr": "كلمات الأنشطة",
      "instructionsEn": "Tap each card to hear the word.",
      "instructionsAr": "اضغط على كل بطاقة لسماع الكلمة.",
      "words": FUN_VOCAB
    },
    {
      "type": "teach",
      "tagEn": "Free-Time Talk",
      "tagAr": "الحديث عن وقت الفراغ",
      "teachBlocks": [
        {
          "pillEn": "What do you do after school?",
          "pillAr": "ماذا تفعل بعد المدرسة؟",
          "descEn": "Talk about your routine.",
          "descAr": "تحدث عن روتينك.",
          "examples": [
            {
              "emoji": "💬",
              "textEn": "I do my homework, then I draw pictures. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">أحل واجبي ثم أرسم.</span>"
            },
            {
              "emoji": "💬",
              "textEn": "On Monday I play chess. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">يوم الاثنين ألعب الشطرنج.</span>"
            }
          ]
        },
        {
          "pillEn": "likes / doesn't like",
          "pillAr": "يحب / لا يحب",
          "descEn": "Use -s with he and she.",
          "descAr": "أضف s مع he و she.",
          "examples": [
            {
              "emoji": "💬",
              "textEn": "He likes reading comics. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">هو يحب قراءة القصص المصورة.</span>"
            },
            {
              "emoji": "💬",
              "textEn": "She doesn't like video games. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">هي لا تحب ألعاب الفيديو.</span>"
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
          "speak": "bake cookies",
          "audio": true,
          "options": [
            "ride my bike",
            "bake cookies",
            "play video games"
          ],
          "correct": "bake cookies"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "draw pictures",
          "audio": true,
          "options": [
            "visit friends",
            "draw pictures",
            "read comics"
          ],
          "correct": "draw pictures"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "play chess",
          "audio": true,
          "options": [
            "bake cookies",
            "play chess",
            "read comics"
          ],
          "correct": "play chess"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "read comics",
          "audio": true,
          "options": [
            "read comics",
            "bake cookies",
            "draw pictures"
          ],
          "correct": "read comics"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "ride my bike",
          "audio": true,
          "options": [
            "ride my bike",
            "play chess",
            "visit friends"
          ],
          "correct": "ride my bike"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "visit friends",
          "audio": true,
          "options": [
            "play video games",
            "bake cookies",
            "visit friends"
          ],
          "correct": "visit friends"
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
              "id": "ride_my_bike",
              "labelEn": "ride my bike",
              "labelAr": "أركب دراجتي",
              "emoji": "🚲"
            },
            {
              "id": "play_chess",
              "labelEn": "play chess",
              "labelAr": "ألعب الشطرنج",
              "emoji": "♟️"
            },
            {
              "id": "visit_friends",
              "labelEn": "visit friends",
              "labelAr": "أزور الأصدقاء",
              "emoji": "🧑‍🤝‍🧑"
            },
            {
              "id": "play_video_games",
              "labelEn": "play video games",
              "labelAr": "ألعب ألعاب الفيديو",
              "emoji": "🎮"
            }
          ]
        },
        {
          "pairs": [
            {
              "id": "bake_cookies",
              "labelEn": "bake cookies",
              "labelAr": "أخبز البسكويت",
              "emoji": "🍪"
            },
            {
              "id": "do_homework",
              "labelEn": "do homework",
              "labelAr": "أحل الواجب",
              "emoji": "📝"
            },
            {
              "id": "read_comics",
              "labelEn": "read comics",
              "labelAr": "أقرأ القصص المصورة",
              "emoji": "📚"
            },
            {
              "id": "draw_pictures",
              "labelEn": "draw pictures",
              "labelAr": "أرسم صورًا",
              "emoji": "🎨"
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
              "labelEn": "do"
            },
            {
              "id": "w2",
              "labelEn": "my"
            },
            {
              "id": "w3",
              "labelEn": "homework"
            },
            {
              "id": "w4",
              "labelEn": "first"
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
              "labelEn": "likes"
            },
            {
              "id": "w2",
              "labelEn": "playing"
            },
            {
              "id": "w3",
              "labelEn": "chess"
            }
          ],
          "speakOnPlace": true
        },
        {
          "items": [
            {
              "id": "w0",
              "labelEn": "What"
            },
            {
              "id": "w1",
              "labelEn": "games"
            },
            {
              "id": "w2",
              "labelEn": "do"
            },
            {
              "id": "w3",
              "labelEn": "you"
            },
            {
              "id": "w4",
              "labelEn": "play"
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
              "labelEn": "rides"
            },
            {
              "id": "w2",
              "labelEn": "her"
            },
            {
              "id": "w3",
              "labelEn": "bike"
            }
          ],
          "speakOnPlace": true
        }
      ]
    },
    {
      "type": "mcq",
      "tagEn": "After-School Fun Challenge",
      "tagAr": "تحدي متعة بعد المدرسة",
      "instructionsEn": "Choose the correct answer.",
      "instructionsAr": "اختر الإجابة الصحيحة.",
      "rounds": [
        {
          "promptEn": "🎨 You use colors and paper. You…",
          "promptAr": "🎨 تستخدم الألوان والورق. أنت…",
          "options": [
            "play chess",
            "ride my bike",
            "draw pictures"
          ],
          "correct": "draw pictures"
        },
        {
          "promptEn": "♟️ A game with a king and a queen on a board:",
          "promptAr": "♟️ لعبة فيها ملك ووزير على لوحة:",
          "options": [
            "soccer",
            "chess",
            "comics"
          ],
          "correct": "chess"
        },
        {
          "promptEn": "🍪 You make cookies in the oven. You…",
          "promptAr": "🍪 تصنع البسكويت في الفرن. أنت…",
          "options": [
            "do homework",
            "visit friends",
            "bake cookies"
          ],
          "correct": "bake cookies"
        },
        {
          "promptEn": "❓ \"He ___ drawing.\"",
          "promptAr": "❓ \"هو يحب الرسم.\"",
          "options": [
            "liking",
            "like",
            "likes"
          ],
          "correct": "likes"
        },
        {
          "promptEn": "❓ \"She ___ like video games.\"",
          "promptAr": "❓ \"هي لا تحب ألعاب الفيديو.\"",
          "options": [
            "don't",
            "doesn't",
            "isn't"
          ],
          "correct": "doesn't"
        },
        {
          "promptEn": "📝 Before you play, you should…",
          "promptAr": "📝 قبل أن تلعب يجب أن…",
          "options": [
            "do homework",
            "play video games",
            "read comics"
          ],
          "correct": "do homework"
        }
      ]
    }
  ]
};

const ALL_GAMES = [GAME_FAMILY, GAME_CHORES, GAME_STORIES, GAME_FUN];
