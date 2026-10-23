"""
اختبار شامل للعبة في متصفح حقيقي (Playwright).
التشغيل: python3 -m http.server 8765  (من مجلد اللعبة)  ثم  python3 tests/e2e_test.py
"""
import asyncio, json, sys
from playwright.async_api import async_playwright

import os
URL = os.environ.get("GAME_URL", "http://localhost:8765/index.html")
results = []

def rec(name, ok, detail=""):
    results.append((name, ok, detail))
    print(("  ✔ " if ok else "  ✗ ") + name + (("  — " + detail) if detail else ""))

async def wait_state(pg, st, ms=4000):
    for _ in range(ms // 50):
        if await pg.evaluate("Game.state") == st: return True
        await pg.wait_for_timeout(50)
    return False

async def current_q(pg):
    return await pg.evaluate("Game.session.current ? Game.session.current.q : null")

async def click_answer(pg, correct):
    q = await current_q(pg)
    if q["type"] == "tf":
        label = "صح ✓" if (q["answer"] == correct) else "خطأ ✗"
        await pg.click(f".q-opt:has-text('{label}')")
    else:
        target = q["options"][q["answer"]] if correct else q["options"][(q["answer"] + 1) % 4]
        btns = pg.locator(".q-opt")
        n = await btns.count()
        for i in range(n):
            t = (await btns.nth(i).inner_text()).split("\n")[-1].strip()
            if t == target:
                await btns.nth(i).click(); break
    return q

async def close_q(pg):
    await pg.click(".q-continue")
    await pg.wait_for_timeout(120)

async def start_lesson(pg, idx=0):
    await pg.evaluate(f"UI.startLesson({idx})")
    await wait_state(pg, "play")
    await pg.wait_for_timeout(200)

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport={"width": 1280, "height": 720})
        pg = await ctx.new_page()
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.on("console", lambda m: m.type == "error" and errs.append(m.text))
        await pg.goto(URL); await pg.wait_for_timeout(600)

        # اختيار الشخصية إلزامي قبل البدء
        await pg.click("#btn-play")
        dis = await pg.is_disabled("#btn-confirm-char")
        await pg.click(".char-card[data-id=marya]")
        rec("زر «تأكيد الشخصية والبدء» معطّل حتى يُختار شخص", dis and not await pg.is_disabled("#btn-confirm-char"))
        await pg.click("#btn-confirm-char")
        rec("حفظ الشخصية المختارة", await pg.evaluate("Progress.get().character") == "marya")

        # الدرس صاحب أكبر بنك لاختبار منطق الأسئلة، والذي يليه لاختبار الأرواح
        sizes = await pg.evaluate("LESSONS.map(l => (QUESTION_BANKS[l.id] || []).length)")
        ids = await pg.evaluate("LESSONS.map(l => l.id)")
        order = sorted(range(len(sizes)), key=lambda i: -sizes[i])
        BIG, SEC = order[0], (order[1] if len(order) > 1 else order[0])
        BIG_ID, SEC_ID = ids[BIG], ids[SEC]
        await start_lesson(pg, BIG)
        lives0 = await pg.evaluate("Game.lives")
        rec("تبدأ المرحلة بـ 3 أرواح", lives0 == 3)

        # الحالة 1: 5 ذهبيات = سؤال واحد، وكل شيء متوقف
        await pg.evaluate("Game._test.giveCoins(4)")
        st4 = await pg.evaluate("Game.state")
        await pg.evaluate("Game._test.giveCoins(1)")
        shown = await pg.is_visible("#modal-question")
        asked = await pg.evaluate("Game.session.stats.asked")
        ex = await pg.evaluate("[Game.player.x, Game.L.enemies.filter(e=>e.alive).map(e=>e.x+','+e.y).join('|')]")
        await pg.keyboard.down("ArrowRight"); await pg.wait_for_timeout(500); await pg.keyboard.up("ArrowRight")
        ex2 = await pg.evaluate("[Game.player.x, Game.L.enemies.filter(e=>e.alive).map(e=>e.x+','+e.y).join('|')]")
        rec("الحالة 1: 4 ذهبيات بلا سؤال، و5 ذهبيات = سؤال واحد فقط", st4 == "play" and shown and asked == 1)
        rec("أثناء السؤال: الشخصية والأعداء متوقفون", ex == ex2, f"{ex[0]:.1f}->{ex2[0]:.1f}")

        # منع النقر المزدوج + الحالة 2: إجابة صحيحة
        q1 = await current_q(pg)
        await pg.evaluate("""() => { const b=[...document.querySelectorAll('.q-opt')]; window.__clicks=b.length; }""")
        q = await click_answer(pg, True)
        # نقرة ثانية على زر آخر (يجب تجاهلها)
        await pg.locator(".q-opt").nth(1).click(force=True)
        st = await pg.evaluate("Game.session.stats")
        lives = await pg.evaluate("Game.lives")
        rec("منع احتساب الإجابة مرتين", st["correct"] + st["wrong"] == 1, json.dumps(st))
        rec("الحالة 2: الإجابة الصحيحة لا تخصم روحًا", lives == 3)
        await close_q(pg)
        rec("بعد الإغلاق يُستأنف اللعب", await pg.evaluate("Game.state") == "play")
        correct_ids = {q1["id"]}

        # الحالة 3: إجابة خاطئة
        await pg.evaluate("Game._test.giveCoins(5)")
        qw = await current_q(pg)
        await click_answer(pg, False)
        fb = await pg.inner_text(".q-feedback")
        has_ok_mark = await pg.locator(".q-opt.picked-ok").count()
        reveal = False
        if qw["type"] == "mcq":
            reveal = qw["options"][qw["answer"]] in fb
        rec("الحالة 3: الإجابة الخاطئة تخصم روحًا واحدة فقط", await pg.evaluate("Game.lives") == 2)
        rec("الحالة 3: لا تُعرض الإجابة الصحيحة ولا تُلوَّن", has_ok_mark == 0 and not reveal and "حاول مرة أخرى عندما يظهر السؤال لاحقًا" in fb)
        await close_q(pg)
        await pg.wait_for_timeout(700)
        rec("الحالة 3: لا يظهر سؤال إضافي فورًا بعد الخطأ", not await pg.is_visible("#modal-question") and await pg.evaluate("Game.state") == "play" and await pg.evaluate("Game.session.stats.asked") == 2)

        # الحالة 4: عودة السؤال الخاطئ بعد 3–5 أسئلة + الحالة 2 (عدم تكرار الصحيح) + الحالة 8
        between, back, lesson_ok, repeat_correct = 0, False, True, False
        for _ in range(8):
            await pg.evaluate("Game._test.giveCoins(5)")
            if not await pg.is_visible("#modal-question"): continue
            qq = await current_q(pg)
            lesson_ok = lesson_ok and qq["id"].startswith(BIG_ID + "-")
            if qq["id"] in correct_ids: repeat_correct = True
            if qq["id"] == qw["id"]:
                back = True; await click_answer(pg, True); await close_q(pg); correct_ids.add(qq["id"]); break
            between += 1
            await click_answer(pg, True); await close_q(pg); correct_ids.add(qq["id"])
        if sizes[BIG] >= 6:
            rec("الحالة 4: السؤال الخاطئ يعود بعد 3–5 أسئلة أخرى", back and 3 <= between <= 5, f"عاد بعد {between}")
        else:
            rec("الحالة 4: (البنك أقل من 6 أسئلة — يغطيها اختبار المنطق)", back, f"عاد بعد {between}")

        # استمر حتى نهاية البنك للتحقق من عدم التكرار
        for _ in range(30):
            await pg.evaluate("Game._test.giveCoins(5)")
            if not await pg.is_visible("#modal-question"): break
            qq = await current_q(pg)
            lesson_ok = lesson_ok and qq["id"].startswith(BIG_ID + "-")
            if qq["id"] in correct_ids: repeat_correct = True
            correct_ids.add(qq["id"]); await click_answer(pg, True); await close_q(pg)
        rec("الحالة 2: لا يتكرر سؤال أُجيب صحيحًا خلال المرحلة", not repeat_correct and await pg.evaluate("Game.session.allCorrect()"))
        rec("الحالة 8: جميع الأسئلة من بنك الدرس نفسه فقط", lesson_ok)
        toast = await pg.inner_text("#toast")
        rec("بعد إنهاء البنك يستمر اللعب دون تكرار", await pg.evaluate("Game.state") == "play" and "جميع أسئلة" in toast, toast)

        # الحالة 5: السقوط في حفرة → روح + سؤال + نقطة الحفظ
        await start_lesson(pg, SEC)
        cp = await pg.evaluate("(()=>{const c=Game.L.checkpoints[0]; Game._test.teleport(c.tx+1); return c.x;})()")
        await pg.wait_for_timeout(400)
        active = await pg.evaluate("Game.L.checkpoints[0].active")
        await pg.evaluate("Game._test.teleport(Game.L.checkpoints[0].tx + 12)")
        await pg.wait_for_timeout(200)
        await pg.evaluate("Game._test.fall()")
        okq = await wait_state(pg, "question", 3000)
        rec("الحالة 5: السقوط يخصم روحًا ويُظهر سؤالًا", okq and await pg.evaluate("Game.lives") == 2 and await pg.evaluate("Game.session.stats.asked") == 1)
        await click_answer(pg, True); await close_q(pg)
        await pg.wait_for_timeout(150)
        px = await pg.evaluate("Game.player.x")
        rec("الحالة 5: العودة لآخر نقطة حفظ وليس بداية المرحلة", active and abs(px - (cp - 8)) < 40, f"x={px:.0f}, checkpoint={cp}")

        # الحالة 6: الاصطدام بعدو → روح + سؤال واحد
        await pg.wait_for_timeout(1700)  # انتهاء الحماية المؤقتة
        a0 = await pg.evaluate("Game.session.stats.asked")
        await pg.evaluate("Game._test.hitEnemy()")
        okq = await wait_state(pg, "question", 3000)
        a1 = await pg.evaluate("Game.session.stats.asked")
        rec("الحالة 6: الاصطدام بعدو يخصم روحًا ويُظهر سؤالًا واحدًا", okq and await pg.evaluate("Game.lives") == 1 and a1 - a0 == 1)
        # الحالة 9: رقم الصفحة
        card_txt = await pg.inner_text(".q-card")
        rec("الحالة 9 (بطلب المعلمة): بطاقة السؤال لا تعرض المصدر ولا رقم الصفحة", "المصدر" not in card_txt and "رقم الصفحة" not in card_txt)
        # إجابة خاطئة أثناء سؤال خسارة الروح: روح واحدة فقط ولا حلقة أسئلة
        await click_answer(pg, False)
        await close_q(pg)
        # الحالة 7: نفاد الأرواح
        res_vis = await pg.is_visible("#modal-result")
        title = await pg.inner_text(".result-title") if res_vis else ""
        actions = await pg.inner_text(".result-actions") if res_vis else ""
        grid = await pg.inner_text(".result-grid") if res_vis else ""
        rec("الحالة 7: صفر أرواح → شاشة انتهاء المحاولة وخيار الإعادة", res_vis and "انتهت المحاولة" in title and "إعادة المحاولة" in actions)
        rec("شاشة النهاية تعرض الذهب والأسئلة والصحيحة والخاطئة", all(k in grid for k in ["الذهب", "الأسئلة", "الصحيحة", "الخاطئة"]))
        rec("لا حلقة أسئلة بعد خطأ في سؤال خسارة الروح", await pg.evaluate("Game.session.stats.asked") == a1)

        # الحالة 10: إعادة المرحلة = جلسة أسئلة جديدة
        await pg.click(".result-actions .btn >> nth=0")
        await wait_state(pg, "play")
        s = await pg.evaluate("[Game.lives, Game.coins, Game.session.stats.asked, Game.session.remaining(), Game.session.size()]")
        rec("الحالة 10: إعادة المرحلة تبدأ جلسة جديدة بـ 3 أرواح والبنك كاملًا", s[0] == 3 and s[1] == 0 and s[2] == 0 and s[3] == s[4], str(s))

        # إنهاء المرحلة
        await pg.evaluate("Game._test.toGoal()")
        await pg.keyboard.down("ArrowRight")
        okw = await wait_state(pg, "complete", 7000)
        await pg.keyboard.up("ArrowRight")
        await pg.wait_for_timeout(200)
        g = await pg.inner_text(".result-grid") if await pg.is_visible("#modal-result") else ""
        acts = await pg.inner_text(".result-actions")
        rec("الوصول للنهاية يعرض شاشة النتائج الكاملة", okw and all(k in g for k in ["النقاط", "الذهب", "الأسئلة", "الصحيحة", "الخاطئة", "النسبة", "الأرواح المتبقية"]), "okw=%s | %s" % (okw, g.replace("\n"," ")))
        rec("خيارات: المرحلة التالية / إعادة المرحلة / قائمة الدروس", all(k in acts for k in ["المرحلة التالية", "إعادة المرحلة", "قائمة الدروس"]))
        prog = await pg.evaluate("JSON.parse(localStorage.getItem(GAME_CONFIG.storageKey))")
        rec("حفظ التقدم محليًا (المرحلة المكتملة، أعلى نتيجة، آخر مرحلة)", prog["lessons"][SEC_ID]["completed"] and prog["highScore"] > 0 and prog["lastLesson"] == SEC_ID)

        # الصوت
        await pg.click(".result-actions .btn:has-text('قائمة الدروس')")
        await pg.click("#screen-lessons .sound-btn")
        muted = await pg.evaluate("localStorage.getItem('mahaSciencePlatformer_muted')")
        await pg.click("#screen-lessons .sound-btn")
        rec("زر تشغيل/كتم الصوت يعمل ويُحفظ", muted == "1" and await pg.evaluate("Sound.isMuted()") is False)

        # تغيير الشخصية دون فقدان التقدم
        await pg.click("#lessons-char"); await pg.click(".char-card[data-id=malik]"); await pg.click("#btn-confirm-char")
        prog2 = await pg.evaluate("Progress.get()")
        rec("تغيير الشخصية لا يمحو التقدم", prog2["character"] == "malik" and prog2["lessons"][SEC_ID]["completed"])

        # فصل البنوك: كل مرحلة تستخدم بنكها
        sep = True
        for i in range(len(ids)):
            if not sizes[i]: continue
            await pg.evaluate(f"UI.startLesson({i})"); await wait_state(pg, "play")
            ids = await pg.evaluate("Game.session.items.map(it=>it.q.id)")
            lid = await pg.evaluate("Game.lesson.id")
            sep = sep and all(x.startswith(lid + "-") for x in ids) and len(ids) > 0
        rec("لكل مرحلة بنك أسئلة مستقل (%d مرحلة)" % len(ids), sep)

        await pg.evaluate("UI.show('lessons')")
        rec("لا أخطاء في وحدة التحكم (سطح المكتب)", not errs, "; ".join(errs[:3]))

        # ===== الجوال (لمس) =====
        m = await b.new_context(viewport={"width": 844, "height": 390}, has_touch=True, is_mobile=True, device_scale_factor=2)
        mp = await m.new_page(); merrs = []
        mp.on("pageerror", lambda e: merrs.append(str(e)))
        await mp.goto(URL); await mp.wait_for_timeout(500)
        await mp.evaluate("Progress.setCharacter('maya')")
        await mp.evaluate(f"UI.startLesson({BIG})"); await mp.wait_for_timeout(500)
        vis = await mp.is_visible(".tc-btn[data-key=right]")
        x0 = await mp.evaluate("Game.player.x")
        box = await mp.locator(".tc-btn[data-key=right]").bounding_box()
        cdp = await m.new_cdp_session(mp)
        pt = {"x": box["x"] + box["width"] / 2, "y": box["y"] + box["height"] / 2, "id": 1}
        await cdp.send("Input.dispatchTouchEvent", {"type": "touchStart", "touchPoints": [pt]})
        await mp.wait_for_timeout(700)
        await cdp.send("Input.dispatchTouchEvent", {"type": "touchEnd", "touchPoints": []})
        x1 = await mp.evaluate("Game.player.x")
        jb = await mp.locator(".tc-btn[data-key=jump]").bounding_box()
        y0 = await mp.evaluate("Game.player.y")
        await cdp.send("Input.dispatchTouchEvent", {"type": "touchStart", "touchPoints": [{"x": jb["x"] + 40, "y": jb["y"] + 40, "id": 2}]})
        await mp.wait_for_timeout(180)
        y1 = await mp.evaluate("Game.player.y")
        await cdp.send("Input.dispatchTouchEvent", {"type": "touchEnd", "touchPoints": []})
        rec("الجوال: أزرار اللمس ظاهرة وتحرّك الشخصية وتقفز", vis and x1 > x0 + 40 and y1 < y0 - 20, f"dx={x1-x0:.0f}, dy={y1-y0:.0f}")
        await mp.screenshot(path="/tmp/claude-0/-home-claude/bf04bfaf-5323-53ec-a042-1f8041263ba1/scratchpad/m_game.png")
        await mp.evaluate("Game._test.giveCoins(5)"); await mp.wait_for_timeout(250)
        await mp.screenshot(path="/tmp/claude-0/-home-claude/bf04bfaf-5323-53ec-a042-1f8041263ba1/scratchpad/m_q.png")
        # هل نافذة السؤال داخل الشاشة بالكامل وقابلة للتمرير؟
        fits = await mp.evaluate("(()=>{const r=document.querySelector('.q-card').getBoundingClientRect(); const m=document.querySelector('#modal-question'); return r.width<=innerWidth && (r.bottom<=innerHeight || m.scrollHeight>m.clientHeight);})()")
        rec("الجوال الأفقي: نافذة السؤال تظهر كاملة", fits)
        # عمودي
        await mp.set_viewport_size({"width": 390, "height": 844}); await mp.wait_for_timeout(300)
        await mp.screenshot(path="/tmp/claude-0/-home-claude/bf04bfaf-5323-53ec-a042-1f8041263ba1/scratchpad/p_q.png")
        await click_answer(mp, True); await close_q(mp); await mp.wait_for_timeout(200)
        await mp.screenshot(path="/tmp/claude-0/-home-claude/bf04bfaf-5323-53ec-a042-1f8041263ba1/scratchpad/p_game.png")
        hscroll = await mp.evaluate("document.documentElement.scrollWidth > innerWidth")
        rec("الجوال العمودي: لا تمرير أفقي والسؤال يعمل", not hscroll)
        # آيباد
        await mp.set_viewport_size({"width": 1024, "height": 768}); await mp.wait_for_timeout(300)
        await mp.screenshot(path="/tmp/claude-0/-home-claude/bf04bfaf-5323-53ec-a042-1f8041263ba1/scratchpad/ipad_game.png")
        rec("لا أخطاء في وحدة التحكم (الجوال)", not merrs, "; ".join(merrs[:3]))
        await b.close()

    fails = [r for r in results if not r[1]]
    print(f"\nالنتيجة: {len(results)-len(fails)} نجح، {len(fails)} فشل")
    with open("/tmp/claude-0/-home-claude/bf04bfaf-5323-53ec-a042-1f8041263ba1/scratchpad/e2e.json", "w") as f:
        json.dump(results, f, ensure_ascii=False)
    sys.exit(1 if fails else 0)

asyncio.run(main())
