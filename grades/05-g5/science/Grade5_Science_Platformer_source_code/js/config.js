/* =========================================================
   إعدادات اللعبة — عدّل هنا اسم المادة والصف وبيانات المعلم
   Game settings — edit subject, grade and teacher info here
   ========================================================= */
window.GAME_CONFIG = {
  subject: "العلوم",
  grade: "الصف الخامس الابتدائي",
  term: "الفصل الدراسي الأول",
  gameTitle: "مغامرة العلوم",

  // بيانات المعلم (اختياري) — اتركها فارغة لإخفائها تمامًا
  teacher: {
    name: "",        // مثال: "أ. سارة"
    instagram: ""    // مثال: "science_teacher" (بدون @)
  },

  // رابط الصفحة الرئيسية للأكاديمية (نسبةً لمكان ملف اللعبة)
  academyHomeUrl: "../../../index.html",

  // مفتاح حفظ التقدم في المتصفح (فريد لهذه اللعبة)
  storageKey: "mahaSciencePlatformer_g5_t1_v1",

  // نظام النقاط (ثابت لجميع المراحل)
  points: {
    coin: 10,
    correctAnswer: 50,
    stomp: 20,
    levelComplete: 300,
    perLifeLeft: 100
  },

  coinsPerQuestion: 5,
  startLives: 3,
  // عدد الأسئلة الأخرى التي يجب أن تمر قبل إعادة سؤال أُجيب عنه خطأ
  retryGapMin: 3,
  retryGapMax: 5
};
