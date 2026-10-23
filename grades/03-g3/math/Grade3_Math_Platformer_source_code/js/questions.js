/* =========================================================
   QuestionSession — إدارة أسئلة مرحلة واحدة خلال جلسة لعب واحدة
   ---------------------------------------------------------
   • يستخدم بنك المرحلة الحالية فقط.
   • السؤال المُجاب صحيحًا لا يعود خلال الجلسة.
   • السؤال المُجاب خطأ ينتظر مرور 3–5 أسئلة أخرى (عدد عشوائي) ثم يعود.
   • لا يتكرر نوع السؤال نفسه متتاليًا قدر الإمكان.
   • إعادة تشغيل المرحلة = جلسة جديدة (new QuestionSession).
   ========================================================= */
(function (root) {
  "use strict";

  function QuestionSession(bank, opts) {
    opts = opts || {};
    this.rng = opts.rng || Math.random;
    this.gapMin = opts.gapMin != null ? opts.gapMin : 3;
    this.gapMax = opts.gapMax != null ? opts.gapMax : 5;
    this.lessonId = opts.lessonId || null;
    // نسخة داخلية مع حالة كل سؤال (لا نعدّل البنك الأصلي)
    this.items = (bank || []).map(function (q) {
      return {
        q: q,
        status: "new",        // new | correct | waiting
        shown: 0,             // عدد مرات الظهور
        wrong: 0,             // عدد مرات الخطأ
        waiting: false,       // هل ينتظر إعادة الظهور؟
        availableAt: 0        // يُسمح بظهوره عندما يصل العدّاد إلى هذه القيمة
      };
    });
    this.tick = 0;            // عدد «الفرص» التي مرّت (أسئلة معروضة أو فرص بلا سؤال)
    this.lastType = null;
    this.current = null;
    this.stats = { asked: 0, correct: 0, wrong: 0 };
  }

  QuestionSession.prototype.size = function () { return this.items.length; };

  QuestionSession.prototype.remaining = function () {
    return this.items.filter(function (it) { return it.status !== "correct"; }).length;
  };

  QuestionSession.prototype.allCorrect = function () {
    return this.items.length > 0 && this.remaining() === 0;
  };

  QuestionSession.prototype._pick = function (list) {
    if (!list.length) return null;
    var self = this;
    // تجنّب تكرار النوع نفسه إن أمكن
    var diff = list.filter(function (it) { return it.q.type !== self.lastType; });
    var pool = diff.length ? diff : list;
    return pool[Math.floor(this.rng() * pool.length)];
  };

  /* يُرجع السؤال التالي أو null إذا لا يوجد سؤال مسموح الآن */
  QuestionSession.prototype.next = function () {
    if (this.current) return this.current.q; // سؤال معروض بالفعل ولم يُجب عنه
    var t = this.tick;
    var due = this.items.filter(function (it) { return it.status === "waiting" && it.availableAt <= t; });
    var fresh = this.items.filter(function (it) { return it.status === "new"; });

    var chosen = null;
    if (due.length) {
      // أعِد السؤال المستحق (أقدمها استحقاقًا أولًا) — يحقق شرط العودة خلال 3–5 أسئلة
      due.sort(function (a, b) { return a.availableAt - b.availableAt; });
      var earliest = due[0].availableAt;
      chosen = this._pick(due.filter(function (it) { return it.availableAt === earliest; }));
    } else if (fresh.length) {
      chosen = this._pick(fresh);
    }

    if (!chosen) {
      // لا يوجد سؤال جديد ولا سؤال مستحق: تُحتسب فرصة بلا سؤال
      // (حتى لا يعود السؤال الخاطئ مباشرة عند عدم وجود أسئلة أخرى)
      this.tick++;
      return null;
    }
    chosen.shown++;
    this.current = chosen;
    this.lastType = chosen.q.type;
    this.stats.asked++;
    return chosen.q;
  };

  QuestionSession.prototype.isCorrect = function (q, response) {
    if (q.type === "tf") return response === q.answer;
    return response === q.answer;
  };

  /* response: رقم الخيار الأصلي (mcq) أو true/false (tf) */
  QuestionSession.prototype.answer = function (response) {
    var it = this.current;
    if (!it) return null; // حماية من النقر المزدوج
    this.current = null;
    this.tick++;
    var ok = this.isCorrect(it.q, response);
    if (ok) {
      it.status = "correct";
      it.waiting = false;
      this.stats.correct++;
    } else {
      it.status = "waiting";
      it.waiting = true;
      it.wrong++;
      var gap = this.gapMin + Math.floor(this.rng() * (this.gapMax - this.gapMin + 1));
      // يجب أن يمر "gap" من الأسئلة/الفرص الأخرى قبل عودته
      it.availableAt = this.tick + gap;
      this.stats.wrong++;
    }
    return ok;
  };

  /* لقطة من الحالة الداخلية (للاختبار والتقرير) */
  QuestionSession.prototype.debugState = function () {
    var self = this;
    return this.items.map(function (it) {
      return { id: it.q.id, status: it.status, shown: it.shown, wrong: it.wrong,
               waiting: it.waiting, availableAt: it.availableAt, tick: self.tick };
    });
  };

  root.QuestionSession = QuestionSession;
  if (typeof module !== "undefined" && module.exports) module.exports = QuestionSession;
})(typeof window !== "undefined" ? window : globalThis);
