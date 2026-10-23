/* اختبار منطق الأسئلة — شغّله بـ: node tests/question_logic.test.js */
"use strict";
const assert = require("assert");
const path = require("path");
global.window = global;
require(path.join(__dirname, "../js/data/lessons.js"));
require(path.join(__dirname, "../js/data/questions.js"));
const QS = require(path.join(__dirname, "../js/questions.js"));

let pass = 0, fail = 0;
function test(name, fn) { try { fn(); pass++; console.log("  ✔ " + name); } catch (e) { fail++; console.log("  ✗ " + name + "\n     " + e.message); } }
function bank(n) { const b = []; for (let i = 0; i < n; i++) b.push({ id: "Q" + i, type: i % 2 ? "tf" : "mcq", text: "q" + i, options: ["a", "b", "c", "d"], answer: i % 2 ? true : 0 }); return b; }
function right(q) { return q.answer; }
function wrong(q) { return q.type === "tf" ? !q.answer : (q.answer + 1) % 4; }

console.log("منطق الأسئلة:");

test("السؤال المُجاب صحيحًا لا يعود خلال الجلسة (1000 محاولة عشوائية)", () => {
  for (let run = 0; run < 1000; run++) {
    const s = new QS(bank(8));
    const done = new Set();
    for (let k = 0; k < 40; k++) {
      const q = s.next(); if (!q) continue;
      assert(!done.has(q.id), "تكرر سؤال صحيح: " + q.id);
      if (Math.random() < 0.6) { s.answer(right(q)); done.add(q.id); } else s.answer(wrong(q));
    }
  }
});

test("السؤال الخاطئ يعود بعد 3–5 أسئلة/فرص أخرى، وليس مباشرة", () => {
  const gaps = new Set();
  for (let run = 0; run < 2000; run++) {
    const s = new QS(bank(10));
    const first = s.next(); s.answer(wrong(first));
    let between = 0, back = false;
    for (let k = 0; k < 20; k++) {
      const q = s.next();
      if (q && q.id === first.id) { back = true; break; }
      between++;
      if (q) s.answer(right(q));
    }
    assert(back, "لم يعد السؤال الخاطئ");
    assert(between >= 3 && between <= 5, "الفاصل خارج 3–5: " + between);
    gaps.add(between);
  }
  assert.deepStrictEqual([...gaps].sort(), [3, 4, 5], "يجب أن يكون الفاصل متغيرًا (3 و4 و5)");
});

test("عند عدم وجود أسئلة أخرى، لا يعود السؤال الخاطئ مباشرة (ينتظر 3–5 فرص)", () => {
  const s = new QS(bank(1));
  const q = s.next(); s.answer(wrong(q));
  assert.strictEqual(s.next(), null); assert.strictEqual(s.next(), null); assert.strictEqual(s.next(), null);
  let n = 3, got = null;
  while (n < 6 && !(got = s.next())) n++;
  assert(got && got.id === q.id && n >= 3 && n <= 5, "عاد بعد " + n);
});

test("بعد الإجابة الصحيحة عن كل البنك لا تتكرر الأسئلة (next = null)", () => {
  const s = new QS(bank(5));
  for (let k = 0; k < 5; k++) { const q = s.next(); s.answer(right(q)); }
  assert(s.allCorrect());
  for (let k = 0; k < 10; k++) assert.strictEqual(s.next(), null);
});

test("منع احتساب الإجابة مرتين (answer الثانية = null)", () => {
  const s = new QS(bank(3)); const q = s.next();
  assert.strictEqual(s.answer(right(q)), true);
  assert.strictEqual(s.answer(right(q)), null);
  assert.strictEqual(s.stats.correct, 1);
});

test("تجنّب تكرار النوع نفسه متتاليًا عند توفر نوع آخر", () => {
  const s = new QS(bank(10)); let last = null;
  for (let k = 0; k < 10; k++) { const q = s.next(); if (last && k < 8) assert.notStrictEqual(q.type, last); last = q.type; s.answer(right(q)); }
});

test("إعادة تشغيل المرحلة = جلسة جديدة تبدأ البنك من جديد", () => {
  const b = bank(3);
  const s1 = new QS(b); for (let k = 0; k < 3; k++) { const q = s1.next(); s1.answer(right(q)); }
  assert.strictEqual(s1.next(), null);
  const s2 = new QS(b); assert(s2.next() !== null);
  assert.strictEqual(s2.remaining(), 3);
});

console.log("بنوك الأسئلة:");
test("لكل درس بنك مستقل، ولا يتكرر معرّف سؤال بين البنوك", () => {
  const ids = new Set();
  LESSONS.forEach(l => {
    const b = QUESTION_BANKS[l.id]; assert(Array.isArray(b), "لا يوجد بنك للدرس " + l.id);
    b.forEach(q => { assert(!ids.has(q.id), "معرّف مكرر " + q.id); ids.add(q.id); assert(q.id.startsWith(l.id + "-"), q.id + " ليس من " + l.id); });
  });
});
test("سلامة صيغة الأسئلة (4 خيارات، إجابة واحدة صالحة، مصدر معروف)", () => {
  Object.values(QUESTION_BANKS).flat().forEach(q => {
    assert(q.text && q.text.trim().length > 3, q.id + " نص فارغ");
    assert(SOURCES[q.src], q.id + " مصدر غير معروف");
    assert(["منهجي", "واجباتي", "كتبي", "ملف مرفق"].includes(SOURCES[q.src].site), q.id + " موقع غير مسموح");
    assert(q.page === null || Number.isInteger(q.page), q.id + " رقم صفحة غير صالح");
    if (q.type === "mcq") {
      assert.strictEqual(q.options.length, 4, q.id + " ليس 4 خيارات");
      assert(q.options.every(o => o && o.trim()), q.id + " خيار فارغ");
      assert.strictEqual(new Set(q.options).size, 4, q.id + " خيارات مكررة");
      assert(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4, q.id + " إجابة غير صالحة");
    } else {
      assert.strictEqual(q.type, "tf", q.id + " نوع غير معروف");
      assert(typeof q.answer === "boolean", q.id + " إجابة صح/خطأ غير صالحة");
    }
  });
});
test("لا يوجد سؤالان بالنص نفسه", () => {
  const seen = new Set();
  Object.values(QUESTION_BANKS).flat().forEach(q => { const k = q.text.replace(/\s+/g, ""); assert(!seen.has(k), "نص مكرر: " + q.id); seen.add(k); });
});

const total = Object.values(QUESTION_BANKS).flat().length;
console.log(`\nعدد الأسئلة: ${total}  |  ` + LESSONS.map(l => l.id + ":" + QUESTION_BANKS[l.id].length).join(" "));
console.log(`النتيجة: ${pass} نجح، ${fail} فشل`);
process.exit(fail ? 1 : 0);
