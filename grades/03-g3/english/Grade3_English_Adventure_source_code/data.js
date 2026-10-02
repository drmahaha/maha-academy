/* ============================================================
   Maha Academy — English Adventure — GRADE 3 (We Can 3, Term 1)
   1. Nice to Meet You · 2. Sea Animals · 3. Sports and Activities · 4. Chores · 5. Yesterday and Today · 6. Jobs
   ============================================================ */

function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

/* ============ GAME 1: NICE TO MEET YOU ============ */
const MEET_VOCAB = [
  {
    "id": "hello",
    "en": "hello",
    "ar": "مرحبًا",
    "emoji": "👋"
  },
  {
    "id": "goodbye",
    "en": "goodbye",
    "ar": "مع السلامة",
    "emoji": "🙋"
  },
  {
    "id": "name",
    "en": "name",
    "ar": "اسم",
    "emoji": "📛"
  },
  {
    "id": "friend",
    "en": "friend",
    "ar": "صديق",
    "emoji": "🧑‍🤝‍🧑"
  },
  {
    "id": "teacher",
    "en": "teacher",
    "ar": "معلم",
    "emoji": "👩‍🏫"
  },
  {
    "id": "classmate",
    "en": "classmate",
    "ar": "زميل الصف",
    "emoji": "🧒"
  },
  {
    "id": "nice",
    "en": "nice",
    "ar": "لطيف",
    "emoji": "😊"
  },
  {
    "id": "meet",
    "en": "meet",
    "ar": "يقابل",
    "emoji": "🤝"
  }
];

const GAME_MEET = {
  "id": "meet",
  "emoji": "👋",
  "titleEn": "Nice to Meet You",
  "titleAr": "تشرفت بمعرفتك",
  "character": "mahir",
  "introEn": "Let's say hello and meet new friends!",
  "introAr": "لنُلقِ التحية ونتعرّف على أصدقاء جدد!",
  "activities": [
    {
      "type": "vocab",
      "tagEn": "Greeting Words",
      "tagAr": "كلمات التحية",
      "instructionsEn": "Tap each card to hear the word.",
      "instructionsAr": "اضغط على كل بطاقة لسماع الكلمة.",
      "words": MEET_VOCAB
    },
    {
      "type": "teach",
      "tagEn": "Meeting People",
      "tagAr": "التعارف",
      "teachBlocks": [
        {
          "pillEn": "What's your name?",
          "pillAr": "ما اسمك؟",
          "descEn": "Ask someone's name.",
          "descAr": "اسأل عن اسم شخص.",
          "examples": [
            {
              "emoji": "💬",
              "textEn": "What's your name? — My name is Sara. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">ما اسمك؟ — اسمي سارة.</span>"
            },
            {
              "emoji": "💬",
              "textEn": "What's his name? — His name is Ali. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">ما اسمه؟ — اسمه علي.</span>"
            }
          ]
        },
        {
          "pillEn": "Nice to meet you.",
          "pillAr": "تشرفت بمعرفتك.",
          "descEn": "Say this when you meet someone new.",
          "descAr": "قلها عندما تقابل شخصًا جديدًا.",
          "examples": [
            {
              "emoji": "💬",
              "textEn": "Nice to meet you, too! <span class=\"ar-text\" style=\"display:block;font-size:14px;\">وأنا أيضًا تشرفت بمعرفتك!</span>"
            },
            {
              "emoji": "💬",
              "textEn": "This is my friend, Huda. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">هذه صديقتي هدى.</span>"
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
          "speak": "name",
          "audio": true,
          "options": [
            "meet",
            "classmate",
            "name"
          ],
          "correct": "name"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "classmate",
          "audio": true,
          "options": [
            "classmate",
            "teacher",
            "nice"
          ],
          "correct": "classmate"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "goodbye",
          "audio": true,
          "options": [
            "friend",
            "goodbye",
            "nice"
          ],
          "correct": "goodbye"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "meet",
          "audio": true,
          "options": [
            "meet",
            "friend",
            "name"
          ],
          "correct": "meet"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "friend",
          "audio": true,
          "options": [
            "friend",
            "hello",
            "nice"
          ],
          "correct": "friend"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "teacher",
          "audio": true,
          "options": [
            "name",
            "teacher",
            "meet"
          ],
          "correct": "teacher"
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
              "id": "meet",
              "labelEn": "meet",
              "labelAr": "يقابل",
              "emoji": "🤝"
            },
            {
              "id": "friend",
              "labelEn": "friend",
              "labelAr": "صديق",
              "emoji": "🧑‍🤝‍🧑"
            },
            {
              "id": "classmate",
              "labelEn": "classmate",
              "labelAr": "زميل الصف",
              "emoji": "🧒"
            },
            {
              "id": "teacher",
              "labelEn": "teacher",
              "labelAr": "معلم",
              "emoji": "👩‍🏫"
            }
          ]
        },
        {
          "pairs": [
            {
              "id": "name",
              "labelEn": "name",
              "labelAr": "اسم",
              "emoji": "📛"
            },
            {
              "id": "hello",
              "labelEn": "hello",
              "labelAr": "مرحبًا",
              "emoji": "👋"
            },
            {
              "id": "nice",
              "labelEn": "nice",
              "labelAr": "لطيف",
              "emoji": "😊"
            },
            {
              "id": "goodbye",
              "labelEn": "goodbye",
              "labelAr": "مع السلامة",
              "emoji": "🙋"
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
              "labelEn": "My"
            },
            {
              "id": "w1",
              "labelEn": "name"
            },
            {
              "id": "w2",
              "labelEn": "is"
            },
            {
              "id": "w3",
              "labelEn": "Ali"
            }
          ],
          "speakOnPlace": true
        },
        {
          "items": [
            {
              "id": "w0",
              "labelEn": "Nice"
            },
            {
              "id": "w1",
              "labelEn": "to"
            },
            {
              "id": "w2",
              "labelEn": "meet"
            },
            {
              "id": "w3",
              "labelEn": "you"
            }
          ],
          "speakOnPlace": true
        },
        {
          "items": [
            {
              "id": "w0",
              "labelEn": "This"
            },
            {
              "id": "w1",
              "labelEn": "is"
            },
            {
              "id": "w2",
              "labelEn": "my"
            },
            {
              "id": "w3",
              "labelEn": "friend"
            }
          ],
          "speakOnPlace": true
        },
        {
          "items": [
            {
              "id": "w0",
              "labelEn": "What's"
            },
            {
              "id": "w1",
              "labelEn": "your"
            },
            {
              "id": "w2",
              "labelEn": "name"
            }
          ],
          "speakOnPlace": true
        }
      ]
    },
    {
      "type": "mcq",
      "tagEn": "Nice to Meet You Challenge",
      "tagAr": "تحدي تشرفت بمعرفتك",
      "instructionsEn": "Choose the correct answer.",
      "instructionsAr": "اختر الإجابة الصحيحة.",
      "rounds": [
        {
          "promptEn": "👋 You meet a new classmate. You say…",
          "promptAr": "👋 قابلت زميلًا جديدًا. تقول…",
          "options": [
            "Nice to meet you!",
            "Good night!",
            "I'm hungry!"
          ],
          "correct": "Nice to meet you!"
        },
        {
          "promptEn": "❓ How do you ask about a name?",
          "promptAr": "❓ كيف تسأل عن الاسم؟",
          "options": [
            "Where is it?",
            "How old are you?",
            "What's your name?"
          ],
          "correct": "What's your name?"
        },
        {
          "promptEn": "🙋 You leave school. You say…",
          "promptAr": "🙋 تغادر المدرسة. تقول…",
          "options": [
            "Thank you!",
            "Hello!",
            "Goodbye!"
          ],
          "correct": "Goodbye!"
        },
        {
          "promptEn": "👩‍🏫 She teaches our class. She is our…",
          "promptAr": "👩‍🏫 هي تدرّس فصلنا. هي…",
          "options": [
            "sister",
            "teacher",
            "friend"
          ],
          "correct": "teacher"
        },
        {
          "promptEn": "📛 \"My ___ is Omar.\"",
          "promptAr": "📛 \"___ عمر.\"",
          "options": [
            "name",
            "meet",
            "friend"
          ],
          "correct": "name"
        },
        {
          "promptEn": "🧒 \"This is ___ friend, Adel.\"",
          "promptAr": "🧒 \"هذا صديقي عادل.\"",
          "options": [
            "my",
            "I",
            "me"
          ],
          "correct": "my"
        }
      ]
    }
  ]
};

/* ============ GAME 2: SEA ANIMALS ============ */
const SEA_VOCAB = [
  {
    "id": "fish",
    "en": "fish",
    "ar": "سمكة",
    "emoji": "🐟"
  },
  {
    "id": "shark",
    "en": "shark",
    "ar": "قرش",
    "emoji": "🦈"
  },
  {
    "id": "whale",
    "en": "whale",
    "ar": "حوت",
    "emoji": "🐋"
  },
  {
    "id": "dolphin",
    "en": "dolphin",
    "ar": "دلفين",
    "emoji": "🐬"
  },
  {
    "id": "octopus",
    "en": "octopus",
    "ar": "أخطبوط",
    "emoji": "🐙"
  },
  {
    "id": "crab",
    "en": "crab",
    "ar": "سلطعون",
    "emoji": "🦀"
  },
  {
    "id": "turtle",
    "en": "turtle",
    "ar": "سلحفاة",
    "emoji": "🐢"
  },
  {
    "id": "starfish",
    "en": "starfish",
    "ar": "نجم البحر",
    "emoji": "⭐"
  }
];

const GAME_SEA = {
  "id": "sea",
  "emoji": "🐠",
  "titleEn": "Sea Animals",
  "titleAr": "حيوانات البحر",
  "character": "maya",
  "introEn": "Let's dive and meet the sea animals!",
  "introAr": "لنغُص ونتعرّف على حيوانات البحر!",
  "activities": [
    {
      "type": "vocab",
      "tagEn": "Sea Animal Words",
      "tagAr": "كلمات حيوانات البحر",
      "instructionsEn": "Tap each card to hear the word.",
      "instructionsAr": "اضغط على كل بطاقة لسماع الكلمة.",
      "words": SEA_VOCAB
    },
    {
      "type": "teach",
      "tagEn": "Describing Animals",
      "tagAr": "وصف الحيوانات",
      "teachBlocks": [
        {
          "pillEn": "It's a…",
          "pillAr": "إنه…",
          "descEn": "Name an animal.",
          "descAr": "سمِّ حيوانًا.",
          "examples": [
            {
              "emoji": "💬",
              "textEn": "What's this? — It's a shark. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">ما هذا؟ — إنه قرش.</span>"
            },
            {
              "emoji": "💬",
              "textEn": "It's a big whale. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">إنه حوت كبير.</span>"
            }
          ]
        },
        {
          "pillEn": "It can…",
          "pillAr": "يستطيع أن…",
          "descEn": "Say what an animal can do.",
          "descAr": "قل ما يستطيع الحيوان فعله.",
          "examples": [
            {
              "emoji": "💬",
              "textEn": "A dolphin can jump. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">الدلفين يستطيع أن يقفز.</span>"
            },
            {
              "emoji": "💬",
              "textEn": "A crab can't fly. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">السلطعون لا يستطيع أن يطير.</span>"
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
          "speak": "turtle",
          "audio": true,
          "options": [
            "starfish",
            "turtle",
            "crab"
          ],
          "correct": "turtle"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "shark",
          "audio": true,
          "options": [
            "fish",
            "whale",
            "shark"
          ],
          "correct": "shark"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "crab",
          "audio": true,
          "options": [
            "starfish",
            "whale",
            "crab"
          ],
          "correct": "crab"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "fish",
          "audio": true,
          "options": [
            "dolphin",
            "fish",
            "octopus"
          ],
          "correct": "fish"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "octopus",
          "audio": true,
          "options": [
            "octopus",
            "starfish",
            "shark"
          ],
          "correct": "octopus"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "starfish",
          "audio": true,
          "options": [
            "starfish",
            "octopus",
            "dolphin"
          ],
          "correct": "starfish"
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
              "id": "crab",
              "labelEn": "crab",
              "labelAr": "سلطعون",
              "emoji": "🦀"
            },
            {
              "id": "shark",
              "labelEn": "shark",
              "labelAr": "قرش",
              "emoji": "🦈"
            },
            {
              "id": "octopus",
              "labelEn": "octopus",
              "labelAr": "أخطبوط",
              "emoji": "🐙"
            },
            {
              "id": "fish",
              "labelEn": "fish",
              "labelAr": "سمكة",
              "emoji": "🐟"
            }
          ]
        },
        {
          "pairs": [
            {
              "id": "dolphin",
              "labelEn": "dolphin",
              "labelAr": "دلفين",
              "emoji": "🐬"
            },
            {
              "id": "whale",
              "labelEn": "whale",
              "labelAr": "حوت",
              "emoji": "🐋"
            },
            {
              "id": "turtle",
              "labelEn": "turtle",
              "labelAr": "سلحفاة",
              "emoji": "🐢"
            },
            {
              "id": "starfish",
              "labelEn": "starfish",
              "labelAr": "نجم البحر",
              "emoji": "⭐"
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
              "labelEn": "It's"
            },
            {
              "id": "w1",
              "labelEn": "a"
            },
            {
              "id": "w2",
              "labelEn": "big"
            },
            {
              "id": "w3",
              "labelEn": "whale"
            }
          ],
          "speakOnPlace": true
        },
        {
          "items": [
            {
              "id": "w0",
              "labelEn": "A"
            },
            {
              "id": "w1",
              "labelEn": "dolphin"
            },
            {
              "id": "w2",
              "labelEn": "can"
            },
            {
              "id": "w3",
              "labelEn": "jump"
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
              "labelEn": "octopus"
            },
            {
              "id": "w2",
              "labelEn": "has"
            },
            {
              "id": "w3",
              "labelEn": "eight"
            },
            {
              "id": "w4",
              "labelEn": "arms"
            }
          ],
          "speakOnPlace": true
        },
        {
          "items": [
            {
              "id": "w0",
              "labelEn": "Sharks"
            },
            {
              "id": "w1",
              "labelEn": "can"
            },
            {
              "id": "w2",
              "labelEn": "swim"
            },
            {
              "id": "w3",
              "labelEn": "fast"
            }
          ],
          "speakOnPlace": true
        }
      ]
    },
    {
      "type": "mcq",
      "tagEn": "Sea Animals Challenge",
      "tagAr": "تحدي حيوانات البحر",
      "instructionsEn": "Choose the correct answer.",
      "instructionsAr": "اختر الإجابة الصحيحة.",
      "rounds": [
        {
          "promptEn": "🐙 This animal has eight arms.",
          "promptAr": "🐙 هذا الحيوان له ثماني أذرع.",
          "options": [
            "octopus",
            "fish",
            "crab"
          ],
          "correct": "octopus"
        },
        {
          "promptEn": "🐋 The biggest sea animal is the…",
          "promptAr": "🐋 أكبر حيوانات البحر هو…",
          "options": [
            "crab",
            "whale",
            "starfish"
          ],
          "correct": "whale"
        },
        {
          "promptEn": "🦀 It walks sideways.",
          "promptAr": "🦀 يمشي على جانبه.",
          "options": [
            "dolphin",
            "crab",
            "shark"
          ],
          "correct": "crab"
        },
        {
          "promptEn": "⭐ It looks like a star.",
          "promptAr": "⭐ يشبه النجمة.",
          "options": [
            "whale",
            "turtle",
            "starfish"
          ],
          "correct": "starfish"
        },
        {
          "promptEn": "🐢 It has a hard shell.",
          "promptAr": "🐢 له صدفة صلبة.",
          "options": [
            "turtle",
            "octopus",
            "fish"
          ],
          "correct": "turtle"
        },
        {
          "promptEn": "🦈 It has many sharp teeth.",
          "promptAr": "🦈 له أسنان حادة كثيرة.",
          "options": [
            "starfish",
            "shark",
            "turtle"
          ],
          "correct": "shark"
        }
      ]
    }
  ]
};

/* ============ GAME 3: SPORTS AND ACTIVITIES ============ */
const SPORTS_VOCAB = [
  {
    "id": "soccer",
    "en": "soccer",
    "ar": "كرة القدم",
    "emoji": "⚽"
  },
  {
    "id": "basketball",
    "en": "basketball",
    "ar": "كرة السلة",
    "emoji": "🏀"
  },
  {
    "id": "swimming",
    "en": "swimming",
    "ar": "السباحة",
    "emoji": "🏊"
  },
  {
    "id": "running",
    "en": "running",
    "ar": "الجري",
    "emoji": "🏃"
  },
  {
    "id": "tennis",
    "en": "tennis",
    "ar": "التنس",
    "emoji": "🎾"
  },
  {
    "id": "cycling",
    "en": "cycling",
    "ar": "ركوب الدراجة",
    "emoji": "🚴"
  },
  {
    "id": "volleyball",
    "en": "volleyball",
    "ar": "الكرة الطائرة",
    "emoji": "🏐"
  },
  {
    "id": "karate",
    "en": "karate",
    "ar": "الكاراتيه",
    "emoji": "🥋"
  }
];

const GAME_SPORTS = {
  "id": "sports",
  "emoji": "⚽",
  "titleEn": "Sports and Activities",
  "titleAr": "الرياضات والأنشطة",
  "character": "marya",
  "introEn": "What do you like to do? Let's play!",
  "introAr": "ماذا تحب أن تفعل؟ لنلعب!",
  "activities": [
    {
      "type": "vocab",
      "tagEn": "Sport Words",
      "tagAr": "كلمات الرياضة",
      "instructionsEn": "Tap each card to hear the word.",
      "instructionsAr": "اضغط على كل بطاقة لسماع الكلمة.",
      "words": SPORTS_VOCAB
    },
    {
      "type": "teach",
      "tagEn": "I like / I can",
      "tagAr": "أحب / أستطيع",
      "teachBlocks": [
        {
          "pillEn": "I like…",
          "pillAr": "أحب…",
          "descEn": "Say what you like.",
          "descAr": "قل ما تحبه.",
          "examples": [
            {
              "emoji": "💬",
              "textEn": "I like soccer. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">أحب كرة القدم.</span>"
            },
            {
              "emoji": "💬",
              "textEn": "Do you like tennis? — Yes, I do. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">هل تحب التنس؟ — نعم.</span>"
            }
          ]
        },
        {
          "pillEn": "I can… / I can't…",
          "pillAr": "أستطيع… / لا أستطيع…",
          "descEn": "Say what you can do.",
          "descAr": "قل ما تستطيع فعله.",
          "examples": [
            {
              "emoji": "💬",
              "textEn": "I can swim. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">أستطيع السباحة.</span>"
            },
            {
              "emoji": "💬",
              "textEn": "I can't play tennis. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">لا أستطيع لعب التنس.</span>"
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
          "speak": "karate",
          "audio": true,
          "options": [
            "karate",
            "soccer",
            "tennis"
          ],
          "correct": "karate"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "cycling",
          "audio": true,
          "options": [
            "cycling",
            "swimming",
            "running"
          ],
          "correct": "cycling"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "tennis",
          "audio": true,
          "options": [
            "tennis",
            "swimming",
            "running"
          ],
          "correct": "tennis"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "running",
          "audio": true,
          "options": [
            "running",
            "soccer",
            "tennis"
          ],
          "correct": "running"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "soccer",
          "audio": true,
          "options": [
            "karate",
            "running",
            "soccer"
          ],
          "correct": "soccer"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "swimming",
          "audio": true,
          "options": [
            "swimming",
            "volleyball",
            "basketball"
          ],
          "correct": "swimming"
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
              "id": "soccer",
              "labelEn": "soccer",
              "labelAr": "كرة القدم",
              "emoji": "⚽"
            },
            {
              "id": "tennis",
              "labelEn": "tennis",
              "labelAr": "التنس",
              "emoji": "🎾"
            },
            {
              "id": "basketball",
              "labelEn": "basketball",
              "labelAr": "كرة السلة",
              "emoji": "🏀"
            },
            {
              "id": "running",
              "labelEn": "running",
              "labelAr": "الجري",
              "emoji": "🏃"
            }
          ]
        },
        {
          "pairs": [
            {
              "id": "karate",
              "labelEn": "karate",
              "labelAr": "الكاراتيه",
              "emoji": "🥋"
            },
            {
              "id": "cycling",
              "labelEn": "cycling",
              "labelAr": "ركوب الدراجة",
              "emoji": "🚴"
            },
            {
              "id": "volleyball",
              "labelEn": "volleyball",
              "labelAr": "الكرة الطائرة",
              "emoji": "🏐"
            },
            {
              "id": "swimming",
              "labelEn": "swimming",
              "labelAr": "السباحة",
              "emoji": "🏊"
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
              "labelEn": "like"
            },
            {
              "id": "w2",
              "labelEn": "playing"
            },
            {
              "id": "w3",
              "labelEn": "soccer"
            }
          ],
          "speakOnPlace": true
        },
        {
          "items": [
            {
              "id": "w0",
              "labelEn": "Can"
            },
            {
              "id": "w1",
              "labelEn": "you"
            },
            {
              "id": "w2",
              "labelEn": "swim"
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
              "labelEn": "can"
            },
            {
              "id": "w2",
              "labelEn": "ride"
            },
            {
              "id": "w3",
              "labelEn": "a"
            },
            {
              "id": "w4",
              "labelEn": "bike"
            }
          ],
          "speakOnPlace": true
        },
        {
          "items": [
            {
              "id": "w0",
              "labelEn": "Do"
            },
            {
              "id": "w1",
              "labelEn": "you"
            },
            {
              "id": "w2",
              "labelEn": "like"
            },
            {
              "id": "w3",
              "labelEn": "tennis"
            }
          ],
          "speakOnPlace": true
        }
      ]
    },
    {
      "type": "mcq",
      "tagEn": "Sports and Activities Challenge",
      "tagAr": "تحدي الرياضات والأنشطة",
      "instructionsEn": "Choose the correct answer.",
      "instructionsAr": "اختر الإجابة الصحيحة.",
      "rounds": [
        {
          "promptEn": "🏀 You bounce a ball and shoot it into a hoop.",
          "promptAr": "🏀 تنطط الكرة وترميها في السلة.",
          "options": [
            "basketball",
            "swimming",
            "karate"
          ],
          "correct": "basketball"
        },
        {
          "promptEn": "🏊 You do this in a pool.",
          "promptAr": "🏊 تفعل هذا في المسبح.",
          "options": [
            "cycling",
            "swimming",
            "tennis"
          ],
          "correct": "swimming"
        },
        {
          "promptEn": "⚽ You kick the ball into the goal.",
          "promptAr": "⚽ تركل الكرة في المرمى.",
          "options": [
            "volleyball",
            "soccer",
            "running"
          ],
          "correct": "soccer"
        },
        {
          "promptEn": "🚴 You ride a bike.",
          "promptAr": "🚴 تركب الدراجة.",
          "options": [
            "swimming",
            "karate",
            "cycling"
          ],
          "correct": "cycling"
        },
        {
          "promptEn": "❓ \"Do you like soccer?\" — \"Yes, I ___.\"",
          "promptAr": "❓ \"هل تحب كرة القدم؟\" — \"نعم.\"",
          "options": [
            "can",
            "am",
            "do"
          ],
          "correct": "do"
        },
        {
          "promptEn": "❓ \"Can you swim?\" — \"No, I ___.\"",
          "promptAr": "❓ \"هل تستطيع السباحة؟\" — \"لا.\"",
          "options": [
            "don't",
            "can't",
            "am not"
          ],
          "correct": "can't"
        }
      ]
    }
  ]
};

/* ============ GAME 4: CHORES ============ */
const CHORES_VOCAB = [
  {
    "id": "clean_my_room",
    "en": "clean my room",
    "ar": "أنظّف غرفتي",
    "emoji": "🧹"
  },
  {
    "id": "make_my_bed",
    "en": "make my bed",
    "ar": "أرتّب سريري",
    "emoji": "🛏️"
  },
  {
    "id": "wash_the_dishes",
    "en": "wash the dishes",
    "ar": "أغسل الصحون",
    "emoji": "🍽️"
  },
  {
    "id": "feed_the_cat",
    "en": "feed the cat",
    "ar": "أطعم القطة",
    "emoji": "🐈"
  },
  {
    "id": "water_the_plants",
    "en": "water the plants",
    "ar": "أسقي النباتات",
    "emoji": "🪴"
  },
  {
    "id": "take_out_the_trash",
    "en": "take out the trash",
    "ar": "أُخرج القمامة",
    "emoji": "🗑️"
  },
  {
    "id": "set_the_table",
    "en": "set the table",
    "ar": "أجهّز المائدة",
    "emoji": "🍴"
  },
  {
    "id": "fold_the_clothes",
    "en": "fold the clothes",
    "ar": "أطوي الملابس",
    "emoji": "👕"
  }
];

const GAME_CHORES = {
  "id": "chores",
  "emoji": "🧹",
  "titleEn": "Chores",
  "titleAr": "الأعمال المنزلية",
  "character": "malik",
  "introEn": "Let's help at home!",
  "introAr": "لنساعد في البيت!",
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
      "tagEn": "Helping at Home",
      "tagAr": "المساعدة في البيت",
      "teachBlocks": [
        {
          "pillEn": "I have to…",
          "pillAr": "يجب عليّ أن…",
          "descEn": "Talk about your chores.",
          "descAr": "تحدث عن أعمالك المنزلية.",
          "examples": [
            {
              "emoji": "💬",
              "textEn": "I have to clean my room. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">يجب أن أنظف غرفتي.</span>"
            },
            {
              "emoji": "💬",
              "textEn": "He has to feed the cat. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">يجب عليه أن يطعم القطة.</span>"
            }
          ]
        },
        {
          "pillEn": "Do you…?",
          "pillAr": "هل…؟",
          "descEn": "Ask about chores.",
          "descAr": "اسأل عن الأعمال المنزلية.",
          "examples": [
            {
              "emoji": "💬",
              "textEn": "Do you make your bed? — Yes, I do. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">هل ترتب سريرك؟ — نعم.</span>"
            },
            {
              "emoji": "💬",
              "textEn": "Does she wash the dishes? — No, she doesn't. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">هل تغسل الصحون؟ — لا.</span>"
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
          "speak": "make my bed",
          "audio": true,
          "options": [
            "make my bed",
            "set the table",
            "clean my room"
          ],
          "correct": "make my bed"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "fold the clothes",
          "audio": true,
          "options": [
            "take out the trash",
            "fold the clothes",
            "water the plants"
          ],
          "correct": "fold the clothes"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "set the table",
          "audio": true,
          "options": [
            "make my bed",
            "set the table",
            "fold the clothes"
          ],
          "correct": "set the table"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "take out the trash",
          "audio": true,
          "options": [
            "make my bed",
            "take out the trash",
            "clean my room"
          ],
          "correct": "take out the trash"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "clean my room",
          "audio": true,
          "options": [
            "fold the clothes",
            "clean my room",
            "make my bed"
          ],
          "correct": "clean my room"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "feed the cat",
          "audio": true,
          "options": [
            "fold the clothes",
            "take out the trash",
            "feed the cat"
          ],
          "correct": "feed the cat"
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
              "id": "make_my_bed",
              "labelEn": "make my bed",
              "labelAr": "أرتّب سريري",
              "emoji": "🛏️"
            },
            {
              "id": "water_the_plants",
              "labelEn": "water the plants",
              "labelAr": "أسقي النباتات",
              "emoji": "🪴"
            },
            {
              "id": "fold_the_clothes",
              "labelEn": "fold the clothes",
              "labelAr": "أطوي الملابس",
              "emoji": "👕"
            },
            {
              "id": "set_the_table",
              "labelEn": "set the table",
              "labelAr": "أجهّز المائدة",
              "emoji": "🍴"
            }
          ]
        },
        {
          "pairs": [
            {
              "id": "feed_the_cat",
              "labelEn": "feed the cat",
              "labelAr": "أطعم القطة",
              "emoji": "🐈"
            },
            {
              "id": "clean_my_room",
              "labelEn": "clean my room",
              "labelAr": "أنظّف غرفتي",
              "emoji": "🧹"
            },
            {
              "id": "wash_the_dishes",
              "labelEn": "wash the dishes",
              "labelAr": "أغسل الصحون",
              "emoji": "🍽️"
            },
            {
              "id": "take_out_the_trash",
              "labelEn": "take out the trash",
              "labelAr": "أُخرج القمامة",
              "emoji": "🗑️"
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
              "labelEn": "have"
            },
            {
              "id": "w2",
              "labelEn": "to"
            },
            {
              "id": "w3",
              "labelEn": "clean"
            },
            {
              "id": "w4",
              "labelEn": "my"
            },
            {
              "id": "w5",
              "labelEn": "room"
            }
          ],
          "speakOnPlace": true
        },
        {
          "items": [
            {
              "id": "w0",
              "labelEn": "Do"
            },
            {
              "id": "w1",
              "labelEn": "you"
            },
            {
              "id": "w2",
              "labelEn": "make"
            },
            {
              "id": "w3",
              "labelEn": "your"
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
              "labelEn": "waters"
            },
            {
              "id": "w2",
              "labelEn": "the"
            },
            {
              "id": "w3",
              "labelEn": "plants"
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
              "labelEn": "has"
            },
            {
              "id": "w2",
              "labelEn": "to"
            },
            {
              "id": "w3",
              "labelEn": "feed"
            },
            {
              "id": "w4",
              "labelEn": "the"
            },
            {
              "id": "w5",
              "labelEn": "cat"
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
          "promptEn": "🍽️ After dinner, I…",
          "promptAr": "🍽️ بعد العشاء، أنا…",
          "options": [
            "feed the cat",
            "make my bed",
            "wash the dishes"
          ],
          "correct": "wash the dishes"
        },
        {
          "promptEn": "🛏️ In the morning, I…",
          "promptAr": "🛏️ في الصباح، أنا…",
          "options": [
            "make my bed",
            "take out the trash",
            "set the table"
          ],
          "correct": "make my bed"
        },
        {
          "promptEn": "🪴 The plants are dry. I…",
          "promptAr": "🪴 النباتات جافة. أنا…",
          "options": [
            "clean my room",
            "water the plants",
            "fold the clothes"
          ],
          "correct": "water the plants"
        },
        {
          "promptEn": "🐈 The cat is hungry. I…",
          "promptAr": "🐈 القطة جائعة. أنا…",
          "options": [
            "feed the cat",
            "wash the dishes",
            "make my bed"
          ],
          "correct": "feed the cat"
        },
        {
          "promptEn": "❓ \"She ___ to clean her room.\"",
          "promptAr": "❓ \"يجب عليها أن تنظف غرفتها.\"",
          "options": [
            "having",
            "have",
            "has"
          ],
          "correct": "has"
        },
        {
          "promptEn": "❓ \"Do you set the table?\" — \"Yes, I ___.\"",
          "promptAr": "❓ \"هل تجهز المائدة؟\" — \"نعم.\"",
          "options": [
            "do",
            "am",
            "does"
          ],
          "correct": "do"
        }
      ]
    }
  ]
};

/* ============ GAME 5: YESTERDAY AND TODAY ============ */
const YESTERDAY_VOCAB = [
  {
    "id": "yesterday",
    "en": "yesterday",
    "ar": "أمس",
    "emoji": "⏪"
  },
  {
    "id": "today",
    "en": "today",
    "ar": "اليوم",
    "emoji": "📅"
  },
  {
    "id": "school",
    "en": "school",
    "ar": "المدرسة",
    "emoji": "🏫"
  },
  {
    "id": "park",
    "en": "park",
    "ar": "الحديقة",
    "emoji": "🌳"
  },
  {
    "id": "zoo",
    "en": "zoo",
    "ar": "حديقة الحيوان",
    "emoji": "🦁"
  },
  {
    "id": "library",
    "en": "library",
    "ar": "المكتبة",
    "emoji": "📚"
  },
  {
    "id": "beach",
    "en": "beach",
    "ar": "الشاطئ",
    "emoji": "🏖️"
  },
  {
    "id": "home",
    "en": "home",
    "ar": "البيت",
    "emoji": "🏠"
  }
];

const GAME_YESTERDAY = {
  "id": "yesterday",
  "emoji": "📅",
  "titleEn": "Yesterday and Today",
  "titleAr": "الأمس واليوم",
  "character": "mahir",
  "introEn": "Where were you yesterday? Let's talk about the past!",
  "introAr": "أين كنت بالأمس؟ لنتحدث عن الماضي!",
  "activities": [
    {
      "type": "vocab",
      "tagEn": "Time & Place Words",
      "tagAr": "كلمات الزمان والمكان",
      "instructionsEn": "Tap each card to hear the word.",
      "instructionsAr": "اضغط على كل بطاقة لسماع الكلمة.",
      "words": YESTERDAY_VOCAB
    },
    {
      "type": "teach",
      "tagEn": "was / were",
      "tagAr": "كان / كانوا",
      "teachBlocks": [
        {
          "pillEn": "I was… / He was…",
          "pillAr": "كنتُ… / كان…",
          "descEn": "Use 'was' with I, he, she, it.",
          "descAr": "استخدم was مع I, he, she, it.",
          "examples": [
            {
              "emoji": "💬",
              "textEn": "I was at the park yesterday. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">كنتُ في الحديقة أمس.</span>"
            },
            {
              "emoji": "💬",
              "textEn": "She was at school. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">كانت في المدرسة.</span>"
            }
          ]
        },
        {
          "pillEn": "We were… / They were…",
          "pillAr": "كنّا… / كانوا…",
          "descEn": "Use 'were' with we, you, they.",
          "descAr": "استخدم were مع we, you, they.",
          "examples": [
            {
              "emoji": "💬",
              "textEn": "They were at the zoo. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">كانوا في حديقة الحيوان.</span>"
            },
            {
              "emoji": "💬",
              "textEn": "Where were you? — I was at home. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">أين كنت؟ — كنت في البيت.</span>"
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
          "speak": "home",
          "audio": true,
          "options": [
            "yesterday",
            "school",
            "home"
          ],
          "correct": "home"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "school",
          "audio": true,
          "options": [
            "today",
            "library",
            "school"
          ],
          "correct": "school"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "today",
          "audio": true,
          "options": [
            "today",
            "zoo",
            "library"
          ],
          "correct": "today"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "yesterday",
          "audio": true,
          "options": [
            "beach",
            "home",
            "yesterday"
          ],
          "correct": "yesterday"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "library",
          "audio": true,
          "options": [
            "yesterday",
            "home",
            "library"
          ],
          "correct": "library"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "zoo",
          "audio": true,
          "options": [
            "zoo",
            "today",
            "school"
          ],
          "correct": "zoo"
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
              "id": "library",
              "labelEn": "library",
              "labelAr": "المكتبة",
              "emoji": "📚"
            },
            {
              "id": "beach",
              "labelEn": "beach",
              "labelAr": "الشاطئ",
              "emoji": "🏖️"
            },
            {
              "id": "today",
              "labelEn": "today",
              "labelAr": "اليوم",
              "emoji": "📅"
            },
            {
              "id": "home",
              "labelEn": "home",
              "labelAr": "البيت",
              "emoji": "🏠"
            }
          ]
        },
        {
          "pairs": [
            {
              "id": "yesterday",
              "labelEn": "yesterday",
              "labelAr": "أمس",
              "emoji": "⏪"
            },
            {
              "id": "zoo",
              "labelEn": "zoo",
              "labelAr": "حديقة الحيوان",
              "emoji": "🦁"
            },
            {
              "id": "school",
              "labelEn": "school",
              "labelAr": "المدرسة",
              "emoji": "🏫"
            },
            {
              "id": "park",
              "labelEn": "park",
              "labelAr": "الحديقة",
              "emoji": "🌳"
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
              "labelEn": "was"
            },
            {
              "id": "w2",
              "labelEn": "at"
            },
            {
              "id": "w3",
              "labelEn": "the"
            },
            {
              "id": "w4",
              "labelEn": "park"
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
              "labelEn": "were"
            },
            {
              "id": "w2",
              "labelEn": "at"
            },
            {
              "id": "w3",
              "labelEn": "the"
            },
            {
              "id": "w4",
              "labelEn": "zoo"
            }
          ],
          "speakOnPlace": true
        },
        {
          "items": [
            {
              "id": "w0",
              "labelEn": "Where"
            },
            {
              "id": "w1",
              "labelEn": "were"
            },
            {
              "id": "w2",
              "labelEn": "you"
            },
            {
              "id": "w3",
              "labelEn": "yesterday"
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
              "labelEn": "was"
            },
            {
              "id": "w2",
              "labelEn": "at"
            },
            {
              "id": "w3",
              "labelEn": "home"
            }
          ],
          "speakOnPlace": true
        }
      ]
    },
    {
      "type": "mcq",
      "tagEn": "Yesterday and Today Challenge",
      "tagAr": "تحدي الأمس واليوم",
      "instructionsEn": "Choose the correct answer.",
      "instructionsAr": "اختر الإجابة الصحيحة.",
      "rounds": [
        {
          "promptEn": "❓ \"I ___ at the beach yesterday.\"",
          "promptAr": "❓ \"كنتُ على الشاطئ أمس.\"",
          "options": [
            "was",
            "were",
            "am"
          ],
          "correct": "was"
        },
        {
          "promptEn": "❓ \"They ___ at the library.\"",
          "promptAr": "❓ \"كانوا في المكتبة.\"",
          "options": [
            "were",
            "was",
            "is"
          ],
          "correct": "were"
        },
        {
          "promptEn": "🦁 We saw lions and giraffes. We were at the…",
          "promptAr": "🦁 رأينا الأسود والزرافات. كنا في…",
          "options": [
            "library",
            "school",
            "zoo"
          ],
          "correct": "zoo"
        },
        {
          "promptEn": "📚 He read books. He was at the…",
          "promptAr": "📚 قرأ كتبًا. كان في…",
          "options": [
            "park",
            "library",
            "beach"
          ],
          "correct": "library"
        },
        {
          "promptEn": "🏖️ We swam in the sea. We were at the…",
          "promptAr": "🏖️ سبحنا في البحر. كنا على…",
          "options": [
            "zoo",
            "beach",
            "home"
          ],
          "correct": "beach"
        },
        {
          "promptEn": "⏪ The day before today is…",
          "promptAr": "⏪ اليوم الذي قبل اليوم هو…",
          "options": [
            "today",
            "yesterday",
            "tomorrow"
          ],
          "correct": "yesterday"
        }
      ]
    }
  ]
};

/* ============ GAME 6: JOBS ============ */
const JOBS_VOCAB = [
  {
    "id": "doctor",
    "en": "doctor",
    "ar": "طبيب",
    "emoji": "👨‍⚕️"
  },
  {
    "id": "teacher",
    "en": "teacher",
    "ar": "معلم",
    "emoji": "👩‍🏫"
  },
  {
    "id": "pilot",
    "en": "pilot",
    "ar": "طيار",
    "emoji": "👨‍✈️"
  },
  {
    "id": "farmer",
    "en": "farmer",
    "ar": "مزارع",
    "emoji": "👨‍🌾"
  },
  {
    "id": "chef",
    "en": "chef",
    "ar": "طاهٍ",
    "emoji": "👨‍🍳"
  },
  {
    "id": "police_officer",
    "en": "police officer",
    "ar": "شرطي",
    "emoji": "👮"
  },
  {
    "id": "firefighter",
    "en": "firefighter",
    "ar": "رجل إطفاء",
    "emoji": "👨‍🚒"
  },
  {
    "id": "engineer",
    "en": "engineer",
    "ar": "مهندس",
    "emoji": "👷"
  }
];

const GAME_JOBS = {
  "id": "jobs",
  "emoji": "👨‍⚕️",
  "titleEn": "Jobs",
  "titleAr": "المهن",
  "character": "maya",
  "introEn": "What do you want to be? Let's learn about jobs!",
  "introAr": "ماذا تريد أن تصبح؟ لنتعرف على المهن!",
  "activities": [
    {
      "type": "vocab",
      "tagEn": "Job Words",
      "tagAr": "كلمات المهن",
      "instructionsEn": "Tap each card to hear the word.",
      "instructionsAr": "اضغط على كل بطاقة لسماع الكلمة.",
      "words": JOBS_VOCAB
    },
    {
      "type": "teach",
      "tagEn": "Talking About Jobs",
      "tagAr": "الحديث عن المهن",
      "teachBlocks": [
        {
          "pillEn": "He's a… / She's a…",
          "pillAr": "هو… / هي…",
          "descEn": "Say someone's job.",
          "descAr": "قل مهنة شخص.",
          "examples": [
            {
              "emoji": "💬",
              "textEn": "He's a doctor. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">هو طبيب.</span>"
            },
            {
              "emoji": "💬",
              "textEn": "What does she do? — She's a pilot. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">ماذا تعمل؟ — هي طيارة.</span>"
            }
          ]
        },
        {
          "pillEn": "I want to be a…",
          "pillAr": "أريد أن أصبح…",
          "descEn": "Say what you want to be.",
          "descAr": "قل ماذا تريد أن تصبح.",
          "examples": [
            {
              "emoji": "💬",
              "textEn": "I want to be an engineer. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">أريد أن أصبح مهندسًا.</span>"
            },
            {
              "emoji": "💬",
              "textEn": "A farmer works on a farm. <span class=\"ar-text\" style=\"display:block;font-size:14px;\">المزارع يعمل في المزرعة.</span>"
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
          "speak": "teacher",
          "audio": true,
          "options": [
            "engineer",
            "chef",
            "teacher"
          ],
          "correct": "teacher"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "firefighter",
          "audio": true,
          "options": [
            "police officer",
            "firefighter",
            "teacher"
          ],
          "correct": "firefighter"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "engineer",
          "audio": true,
          "options": [
            "firefighter",
            "engineer",
            "farmer"
          ],
          "correct": "engineer"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "farmer",
          "audio": true,
          "options": [
            "police officer",
            "farmer",
            "engineer"
          ],
          "correct": "farmer"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "pilot",
          "audio": true,
          "options": [
            "pilot",
            "teacher",
            "engineer"
          ],
          "correct": "pilot"
        },
        {
          "promptEn": "Which word did you hear?",
          "promptAr": "ما الكلمة التي سمعتها؟",
          "speak": "doctor",
          "audio": true,
          "options": [
            "doctor",
            "firefighter",
            "farmer"
          ],
          "correct": "doctor"
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
              "id": "doctor",
              "labelEn": "doctor",
              "labelAr": "طبيب",
              "emoji": "👨‍⚕️"
            },
            {
              "id": "pilot",
              "labelEn": "pilot",
              "labelAr": "طيار",
              "emoji": "👨‍✈️"
            },
            {
              "id": "engineer",
              "labelEn": "engineer",
              "labelAr": "مهندس",
              "emoji": "👷"
            },
            {
              "id": "police_officer",
              "labelEn": "police officer",
              "labelAr": "شرطي",
              "emoji": "👮"
            }
          ]
        },
        {
          "pairs": [
            {
              "id": "farmer",
              "labelEn": "farmer",
              "labelAr": "مزارع",
              "emoji": "👨‍🌾"
            },
            {
              "id": "chef",
              "labelEn": "chef",
              "labelAr": "طاهٍ",
              "emoji": "👨‍🍳"
            },
            {
              "id": "teacher",
              "labelEn": "teacher",
              "labelAr": "معلم",
              "emoji": "👩‍🏫"
            },
            {
              "id": "firefighter",
              "labelEn": "firefighter",
              "labelAr": "رجل إطفاء",
              "emoji": "👨‍🚒"
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
              "labelEn": "He"
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
              "labelEn": "doctor"
            }
          ],
          "speakOnPlace": true
        },
        {
          "items": [
            {
              "id": "w0",
              "labelEn": "I"
            },
            {
              "id": "w1",
              "labelEn": "want"
            },
            {
              "id": "w2",
              "labelEn": "to"
            },
            {
              "id": "w3",
              "labelEn": "be"
            },
            {
              "id": "w4",
              "labelEn": "a"
            },
            {
              "id": "w5",
              "labelEn": "pilot"
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
              "labelEn": "does"
            },
            {
              "id": "w2",
              "labelEn": "she"
            },
            {
              "id": "w3",
              "labelEn": "do"
            }
          ],
          "speakOnPlace": true
        },
        {
          "items": [
            {
              "id": "w0",
              "labelEn": "A"
            },
            {
              "id": "w1",
              "labelEn": "chef"
            },
            {
              "id": "w2",
              "labelEn": "cooks"
            },
            {
              "id": "w3",
              "labelEn": "food"
            }
          ],
          "speakOnPlace": true
        }
      ]
    },
    {
      "type": "mcq",
      "tagEn": "Jobs Challenge",
      "tagAr": "تحدي المهن",
      "instructionsEn": "Choose the correct answer.",
      "instructionsAr": "اختر الإجابة الصحيحة.",
      "rounds": [
        {
          "promptEn": "🏥 Who works in a hospital?",
          "promptAr": "🏥 من يعمل في المستشفى؟",
          "options": [
            "pilot",
            "farmer",
            "doctor"
          ],
          "correct": "doctor"
        },
        {
          "promptEn": "✈️ Who flies a plane?",
          "promptAr": "✈️ من يقود الطائرة؟",
          "options": [
            "teacher",
            "pilot",
            "chef"
          ],
          "correct": "pilot"
        },
        {
          "promptEn": "🍳 Who cooks food in a restaurant?",
          "promptAr": "🍳 من يطبخ الطعام في المطعم؟",
          "options": [
            "police officer",
            "chef",
            "engineer"
          ],
          "correct": "chef"
        },
        {
          "promptEn": "🔥 Who puts out fires?",
          "promptAr": "🔥 من يطفئ الحرائق؟",
          "options": [
            "doctor",
            "farmer",
            "firefighter"
          ],
          "correct": "firefighter"
        },
        {
          "promptEn": "🌾 Who grows vegetables on a farm?",
          "promptAr": "🌾 من يزرع الخضروات في المزرعة؟",
          "options": [
            "pilot",
            "teacher",
            "farmer"
          ],
          "correct": "farmer"
        },
        {
          "promptEn": "❓ \"I want ___ be a teacher.\"",
          "promptAr": "❓ \"أريد أن أصبح معلمًا.\"",
          "options": [
            "to",
            "at",
            "for"
          ],
          "correct": "to"
        }
      ]
    }
  ]
};

const ALL_GAMES = [GAME_MEET, GAME_SEA, GAME_SPORTS, GAME_CHORES, GAME_YESTERDAY, GAME_JOBS];
