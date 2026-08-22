/* ===========================================================
   Maha Academy — Game Engine
   Generic, reusable rendering + scoring logic for every activity
   type (mcq, order, build, match, compare, teach, vocab).
   Content lives in data.js; this file only knows how to run it.
   =========================================================== */

/* ---------- Character metadata ---------- */

const CHAR_IMG = { mahir: MAHIR_IMG, maya: MAYA_IMG, marya: MARYA_IMG, malik: MALIK_IMG };
const CHAR_NAME_EN = {
  mahir: "Mahir the Adventurer", maya: "Maya the Smart",
  marya: "Marya the Maker", malik: "Malik the Motivator"
};
const CHAR_NAME_AR = {
  mahir: "ماهر المغامر", maya: "مايا الذكية",
  marya: "ماريا الصانعة", malik: "مالك المحفّز"
};
const CHAR_THEME_EN = { mahir:"Explore", maya:"Think", marya:"Build", malik:"Keep Going" };
const CHAR_THEME_AR = { mahir:"اكتشف", maya:"فكّر", marya:"اصنع", malik:"استمر" };

const GOOD_MSGS = [
  {en:"Excellent!", ar:"ممتاز!"},
  {en:"Great job!", ar:"أحسنت!"},
  {en:"Amazing!", ar:"رائع!"},
  {en:"Well done!", ar:"أحسنت صنعًا!"},
  {en:"Super!", ar:"رائع جدًا!"}
];
const TRY_MSGS = [
  {en:"Try again!", ar:"حاول مرة أخرى!"},
  {en:"You can do it!", ar:"أنت تستطيع!"},
  {en:"Almost!", ar:"اقتربت!"},
  {en:"Keep going!", ar:"واصل المحاولة!"}
];

const DEFAULT_HINTS = {
  mcq: {en:"Think carefully and choose the best answer.", ar:"فكر جيدًا واختر أفضل إجابة."},
  order: {en:"Think about what comes first.", ar:"فكر بما يأتي أولاً."},
  match: {en:"Look at the picture carefully.", ar:"انظر إلى الصورة جيدًا."},
  build: {en:"Look at the hundreds, tens, and ones.", ar:"انظر إلى المئات والعشرات والآحاد."},
  compare: {en:"Look closely and compare!", ar:"انظر جيدًا وقارن!"}
};

function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

/* ---------- Progress storage ---------- */

const PROGRESS_KEY = "mahaAcademyProgress_v1";

function defaultProgress(){
  const unlocked = {}, stars = {}, completed = {};
  ALL_GAMES.forEach((g,i)=>{ unlocked[g.id] = (i===0); stars[g.id]=0; completed[g.id]=false; });
  return { unlocked, stars, completed };
}

function loadProgress(){
  try{
    const raw = localStorage.getItem(PROGRESS_KEY);
    if(!raw) return defaultProgress();
    const parsed = JSON.parse(raw);
    const base = defaultProgress();
    return {
      unlocked: Object.assign(base.unlocked, parsed.unlocked||{}),
      stars: Object.assign(base.stars, parsed.stars||{}),
      completed: Object.assign(base.completed, parsed.completed||{})
    };
  }catch(e){ return defaultProgress(); }
}

function saveProgress(){
  try{ localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)); }catch(e){ /* ignore */ }
}

let progress = loadProgress();
let session = null;

/* ---------- Audio ---------- */

function speak(text, lang, opts){
  if(!('speechSynthesis' in window) || !text) return;
  try{
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang || 'en-US';
    u.rate = (opts && opts.rate) || 0.82;
    u.pitch = (opts && opts.pitch) || 1.03;
    window.speechSynthesis.speak(u);
  }catch(e){ /* speech not supported — fail silently */ }
}

/* A brighter, more playful reading used for quick "tap to hear" moments
   (e.g. placing a month chip) — same voice, a little more energy. */
function speakPlayful(text, lang){
  speak(text, lang, { rate: 0.95, pitch: 1.28 });
}

/* ---------- Screen management ---------- */

function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  const el = document.getElementById('screen-'+id);
  if(el) el.classList.add('active');
  window.scrollTo({top:0, behavior:'smooth'});
}

let toastTimer = null;
function showToast(en, ar){
  const t = document.getElementById('toast');
  if(!t) return;
  t.innerHTML = en + (ar ? ` <span class="ar-text">${ar}</span>` : '');
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove('show'), 2600);
}

function updateTopbarStars(){
  const total = Object.values(progress.stars).reduce((a,b)=>a+b,0);
  const el = document.getElementById('topbarStars');
  if(el) el.textContent = `⭐ ${total}`;
}

/* ---------- Confetti ---------- */

function spawnConfetti(n){
  const layer = document.getElementById('confettiLayer');
  if(!layer) return;
  const colors = ['#f4c542','#8b5cf6','#20c4b0','#ff6f61','#3aa6ff','#e2ab2e'];
  for(let i=0;i<n;i++){
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left = (Math.random()*100)+'vw';
    el.style.background = colors[Math.floor(Math.random()*colors.length)];
    el.style.animationDuration = (2 + Math.random()*1.6)+'s';
    el.style.transform = `rotate(${Math.random()*360}deg)`;
    layer.appendChild(el);
    setTimeout(()=>el.remove(), 4200);
  }
}

/* ---------- Adventure Map ---------- */

function firstIncompleteIndex(){
  for(let i=0;i<ALL_GAMES.length;i++){
    if(progress.unlocked[ALL_GAMES[i].id] && !progress.completed[ALL_GAMES[i].id]) return i;
  }
  return -1;
}

function renderMiniStars(n){
  let s = '';
  for(let i=1;i<=3;i++) s += (i<=n ? '⭐' : '☆');
  return s;
}

/* Vertical winding path: one round station button per game, stacked top to
   bottom and alternating left/right, connected by a dashed trail. Replaces
   the old illustrated map + percent-positioned hotspots, which shrank to
   unusably small tap targets on phones since it was one wide fixed-ratio
   image. This layout scales naturally at any screen size. */
function renderMap(){
  const track = document.getElementById('pathTrack');
  if(!track) return;
  track.innerHTML = '';
  const curIdx = firstIncompleteIndex();
  ALL_GAMES.forEach((game, idx)=>{
    const unlocked = !!progress.unlocked[game.id];
    const completed = !!progress.completed[game.id];
    const stars = progress.stars[game.id] || 0;
    const isCurrent = idx === curIdx;

    const node = document.createElement('div');
    node.className = 'path-node ' + (idx % 2 === 0 ? 'side-a' : 'side-b');

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'path-node-btn ' +
      (unlocked ? 'unlocked' : 'locked') +
      (isCurrent ? ' current' : '') +
      (completed ? ' completed' : '');
    btn.setAttribute('aria-label', game.titleEn + ' - ' + game.titleAr);
    btn.innerHTML = `<span class="path-node-emoji">${unlocked ? game.emoji : '🔒'}</span>` +
      (completed ? `<span class="path-node-stars">${renderMiniStars(stars)}</span>` : '');
    btn.onclick = () => {
      if(unlocked) startGame(game.id);
      else showToast('Finish the previous adventure to unlock this! 🔒', 'أكمل المغامرة السابقة لفتح هذه المرحلة!');
    };

    const label = document.createElement('div');
    label.className = 'path-node-label';
    label.innerHTML = `${game.titleEn}<span class="ar-text">${game.titleAr}</span>`;

    node.appendChild(btn);
    node.appendChild(label);
    track.appendChild(node);
  });
  updateTotalStarsBar();
  updateTopbarStars();
}

function updateTotalStarsBar(){
  const total = Object.values(progress.stars).reduce((a,b)=>a+b,0);
  const max = ALL_GAMES.length * 3;
  const fill = document.getElementById('totalStarsFill');
  const label = document.getElementById('totalStarsLabel');
  if(fill) fill.style.width = Math.round((total/max)*100) + '%';
  if(label) label.textContent = `${total} / ${max} ⭐`;
}

/* ---------- Game session ---------- */

function startGame(gameId){
  session = { gameId, activityIdx:0, roundIdx:0, totalRounds:0, correctFirstTry:0, hadMistake:false };
  showScreen('game');
  renderActivity();
}

function activityRoundsCount(activity){
  if(activity.type === 'teach' || activity.type === 'vocab') return 1;
  return activity.rounds.length;
}

function updateGameHeader(game){
  document.getElementById('gameHeaderEmoji').textContent = game.emoji;
  document.getElementById('gameHeaderTitleEn').textContent = game.titleEn;
  document.getElementById('gameHeaderTitleAr').textContent = game.titleAr;
  const dotsEl = document.getElementById('activityDots');
  dotsEl.innerHTML = game.activities.map((a,i)=>{
    let cls = 'dot';
    if(i < session.activityIdx) cls += ' done';
    else if(i === session.activityIdx) cls += ' active';
    return `<span class="${cls}" title="${a.tagEn}"></span>`;
  }).join('');
}

function renderActivity(){
  const game = ALL_GAMES.find(g => g.id === session.gameId);
  const activity = game.activities[session.activityIdx];
  session.hadMistake = false;
  updateGameHeader(game);
  const card = document.getElementById('activityCard');
  const roundsCount = activityRoundsCount(activity);
  const roundLabel = (activity.type==='teach' || activity.type==='vocab') ? '' :
    `<span class="tag" style="background:#fff4d6;color:#7a5300;">Round ${session.roundIdx+1} / ${roundsCount}</span>`;
  card.innerHTML = `
    <div class="activity-kicker">
      <span class="tag">${activity.tagEn} <span class="ar-text">${activity.tagAr||''}</span></span>
      ${roundLabel}
    </div>
    <div id="activityBody"></div>
  `;
  const body = document.getElementById('activityBody');
  switch(activity.type){
    case 'mcq': renderMCQ(game, activity, activity.rounds[session.roundIdx], body); break;
    case 'order': renderOrder(game, activity, activity.rounds[session.roundIdx], body); break;
    case 'build': renderBuild(game, activity, activity.rounds[session.roundIdx], body); break;
    case 'match': renderMatch(game, activity, activity.rounds[session.roundIdx], body); break;
    case 'compare': renderCompare(game, activity, activity.rounds[session.roundIdx], body); break;
    case 'teach': renderTeach(game, activity, body); break;
    case 'vocab': renderVocab(game, activity, body); break;
  }
}

function advanceRound(){
  const game = ALL_GAMES.find(g => g.id === session.gameId);
  const activity = game.activities[session.activityIdx];
  const roundsCount = activityRoundsCount(activity);
  session.roundIdx++;
  if(session.roundIdx >= roundsCount){
    session.activityIdx++;
    session.roundIdx = 0;
    if(session.activityIdx >= game.activities.length){
      finishGame();
      return;
    }
  }
  renderActivity();
}

function finalizeRoundSuccess(){
  const game = ALL_GAMES.find(g => g.id === session.gameId);
  const activity = game.activities[session.activityIdx];
  session.totalRounds++;
  if(!session.hadMistake) session.correctFirstTry++;
  showSuccessFeedback(game, activity);
}

function showSuccessFeedback(game, activity){
  const msg = pick(GOOD_MSGS);
  const charKey = activity.character || game.character;
  const area = document.getElementById('feedbackArea');
  const actions = document.getElementById('actionRow');
  if(area) area.innerHTML = `
    <div class="feedback-banner good">
      <img src="${CHAR_IMG[charKey]}" alt="${CHAR_NAME_EN[charKey]}">
      <div>${msg.en}<span class="ar-text">${msg.ar}</span></div>
    </div>`;
  if(actions) actions.innerHTML = `<button class="btn btn-primary" id="nextBtn">Next ▶ <span class="ar-text">التالي</span></button>`;
  const nextBtn = document.getElementById('nextBtn');
  if(nextBtn) nextBtn.onclick = () => advanceRound();
}

function showMistakeFeedback(){
  session.hadMistake = true;
  const msg = pick(TRY_MSGS);
  const area = document.getElementById('feedbackArea');
  if(area) area.innerHTML = `
    <div class="feedback-banner retry">
      <img src="${MALIK_IMG}" alt="Malik">
      <div>${msg.en}<span class="ar-text">${msg.ar}</span></div>
    </div>`;
}

function renderHintBox(en, ar, visualEl){
  const box = document.getElementById('hintBox');
  if(!box) return;
  box.innerHTML = `💡 ${en}<span class="ar-text">${ar}</span>`;
  box.classList.add('show');
  if(visualEl){
    visualEl.classList.add('hint-active');
    setTimeout(()=>visualEl && visualEl.classList.remove('hint-active'), 2200);
  }
}

function showHint(round, activity, visualEl){
  const fallback = DEFAULT_HINTS[activity.type] || {en:"Think carefully!", ar:"فكر جيدًا!"};
  const en = (round && round.hintEn) || fallback.en;
  const ar = (round && round.hintAr) || fallback.ar;
  renderHintBox(en, ar, visualEl);
}

/* Order activities (Month Explorer, Month Challenge, Number Order, Story in
   Order) place several items in one round, so a single static hint only
   ever helps with the first item. Instead, look at what's already correctly
   placed and give a hint about the very next item that's needed. */
function showOrderHint(activity, round, items, target, placed, visualEl){
  const findItem = id => items.find(it => it.id === id);
  // First empty slot, or if everything's filled but something's wrong, the
  // first slot that doesn't match the target order yet.
  let idx = placed.findIndex(id => id === null);
  if(idx === -1) idx = placed.findIndex((id, i) => id !== target[i]);
  if(idx === -1) idx = 0;

  if(idx === 0){
    const fallback = DEFAULT_HINTS.order;
    const en = (round && round.hintEn) || fallback.en;
    const ar = (round && round.hintAr) || fallback.ar;
    renderHintBox(en, ar, visualEl);
    return;
  }

  const prevItem = findItem(target[idx-1]);
  const prevEn = prevItem ? prevItem.labelEn : '';
  const prevAr = prevItem ? (prevItem.labelAr || prevItem.labelEn) : '';

  let en, ar;
  if(activity.orderMode === 'words'){
    en = `What happened right after "${prevEn}"?`;
    ar = `ماذا حدث بعد "${prevAr}" مباشرة؟`;
  } else {
    en = `What comes right after ${prevEn}?`;
    ar = `ما الذي يأتي بعد ${prevAr} مباشرة؟`;
  }
  renderHintBox(en, ar, visualEl);
}

function finishGame(){
  const game = ALL_GAMES.find(g => g.id === session.gameId);
  const idx = ALL_GAMES.findIndex(g => g.id === game.id);
  const ratio = session.totalRounds ? (session.correctFirstTry / session.totalRounds) : 1;
  const stars = ratio >= 0.85 ? 3 : (ratio >= 0.55 ? 2 : 1);
  progress.stars[game.id] = Math.max(progress.stars[game.id]||0, stars);
  progress.completed[game.id] = true;
  if(idx < ALL_GAMES.length - 1){
    progress.unlocked[ALL_GAMES[idx+1].id] = true;
  }
  saveProgress();
  renderEndScreen(game, stars, session.totalRounds, session.correctFirstTry, idx);
}

/* ---------- End of game & final screens ---------- */

function renderEndScreen(game, stars, total, correct, idx){
  showScreen('gameEnd');
  const wrap = document.getElementById('gameEndContent');
  const charKey = game.character;
  const msg = stars === 3 ? {en:"Amazing! You are shining bright!", ar:"رائع! أنت متألق!"} :
              stars === 2 ? {en:"Great job! Keep practicing to shine even more!", ar:"عمل رائع! واصل التدريب لتتألق أكثر!"} :
              {en:"Good try! Practice makes perfect!", ar:"محاولة جيدة! التدريب يصنع الإتقان!"};
  const isLast = idx === ALL_GAMES.length - 1;
  wrap.innerHTML = `
    <div class="end-card">
      <div class="char-celebrate"><img src="${CHAR_IMG[charKey]}" alt="${CHAR_NAME_EN[charKey]}"></div>
      <h2>${game.titleEn}</h2>
      <div class="ar-text">${game.titleAr}</div>
      <div class="stars-display">${[1,2,3].map(i=>`<span class="star ${i<=stars?'lit':''}">⭐</span>`).join('')}</div>
      <div class="end-stats">
        <div class="end-stat"><div class="num">${total}</div><div class="lbl">Questions <span class="ar-text">أسئلة</span></div></div>
        <div class="end-stat"><div class="num">${correct}</div><div class="lbl">First Try <span class="ar-text">من أول مرة</span></div></div>
        <div class="end-stat"><div class="num">${stars}</div><div class="lbl">Stars <span class="ar-text">نجوم</span></div></div>
      </div>
      <p class="end-msg">${msg.en}<span class="ar-text" style="display:block;">${msg.ar}</span></p>
      <div class="action-row">
        <button class="btn btn-secondary" id="playAgainBtn">↺ Play Again <span class="ar-text">إعادة اللعب</span></button>
        <button class="btn btn-primary" id="nextAdvBtn">${isLast ? '🏆 My Trophy' : 'Next Adventure ▶'} <span class="ar-text">${isLast ? 'جائزتي' : 'المغامرة التالية'}</span></button>
        <button class="btn btn-secondary" id="toMapBtn">🗺️ Map <span class="ar-text">الخريطة</span></button>
      </div>
    </div>`;
  document.getElementById('playAgainBtn').onclick = () => startGame(game.id);
  document.getElementById('nextAdvBtn').onclick = () => {
    if(isLast) renderFinalScreen();
    else startGame(ALL_GAMES[idx+1].id);
  };
  document.getElementById('toMapBtn').onclick = () => { showScreen('map'); renderMap(); };
  spawnConfetti(26);
  updateTopbarStars();
}

function renderFinalScreen(){
  showScreen('final');
  const total = Object.values(progress.stars).reduce((a,b)=>a+b,0);
  const max = ALL_GAMES.length * 3;
  const el = document.getElementById('finalStars');
  if(el) el.textContent = '⭐'.repeat(total) + '☆'.repeat(Math.max(0, max-total));
  spawnConfetti(70);
  updateTopbarStars();
}

/* ===========================================================
   Activity renderers
   =========================================================== */

/* ---- MCQ ---- */

function renderMCQ(game, activity, round, container){
  const charKey = activity.character || game.character;
  container.innerHTML = `
    <div class="question-row">
      <div class="character-bubble">
        <img src="${CHAR_IMG[charKey]}" alt="${CHAR_NAME_EN[charKey]}">
        <div class="speech-bubble">
          <p class="q-en">${round.promptEn}</p>
          <p class="q-ar ar-text">${round.promptAr||''}</p>
        </div>
      </div>
      <button class="speak-btn" id="speakPromptBtn" title="Listen" aria-label="Listen">🔊</button>
    </div>
    <div class="visual-stage" id="visualStage"></div>
    <div class="options-grid cols-3" id="optionsGrid"></div>
    <div class="hint-box" id="hintBox"></div>
    <div id="feedbackArea"></div>
    <div class="action-row" id="actionRow">
      <button class="btn btn-hint" id="hintBtn">💡 Hint <span class="ar-text">تلميح</span></button>
    </div>
  `;
  renderVisualStage(activity, round, document.getElementById('visualStage'));
  document.getElementById('speakPromptBtn').onclick = () => speak(round.speak || round.promptEn, 'en-US');
  if(activity.audio && round.speak){
    setTimeout(() => speak(round.speak, 'en-US'), 450);
  }
  const grid = document.getElementById('optionsGrid');
  if(round.options.length > 4) grid.classList.remove('cols-3');
  shuffle(round.options).forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span>`;
    btn.onclick = () => {
      const allBtns = grid.querySelectorAll('.option-btn');
      if(opt === round.correct){
        allBtns.forEach(b => b.disabled = true);
        btn.classList.add('correct');
        finalizeRoundSuccess();
      } else {
        btn.classList.add('incorrect');
        btn.disabled = true;
        showMistakeFeedback();
      }
    };
    grid.appendChild(btn);
  });
  document.getElementById('hintBtn').onclick = () => showHint(round, activity, document.getElementById('visualStage'));
}

function renderVisualStage(activity, round, el){
  const kind = round.visualKind || activity.visualKind;
  if(kind === 'count'){
    el.innerHTML = `<div><div class="count-objects">${round.emoji.repeat(round.count)}</div><div class="small-note">${round.nounEn} <span class="ar-text">${round.nounAr}</span></div></div>`;
  } else if(kind === 'ruler'){
    el.innerHTML = `
      <div class="ruler-wrap">
        <div class="ruler-item-emoji">${round.emoji} ${round.itemEn} <span class="ar-text">${round.itemAr}</span></div>
        <div class="ruler-bar"><div class="ruler-fill" style="width:${round.widthPct}%;"></div></div>
      </div>`;
  } else if(kind === 'duration'){
    el.innerHTML = `
      <div class="ruler-wrap">
        <div class="ruler-item-emoji">${round.emoji} ${round.itemEn} <span class="ar-text">${round.itemAr}</span></div>
        <div class="small-note">⏱️ Time <span class="ar-text">⏱️ الوقت</span></div>
      </div>`;
  } else if(kind === 'adjective'){
    el.innerHTML = `
      <div style="text-align:center;">
        <div style="font-size:56px;line-height:1;">${round.emoji}</div>
        <div style="font-size:22px;font-weight:900;color:var(--purple-700);margin-top:8px;">${round.baseWordEn} <span class="ar-text">${round.baseWordAr}</span></div>
      </div>`;
  } else if(kind === 'bignum'){
    el.innerHTML = `<div class="big-number">${round.num}</div>`;
  } else if(kind === 'digits'){
    el.innerHTML = `<div class="big-number" style="font-size:clamp(30px,6vw,50px);">🔊</div><div class="small-note">Tap the speaker to listen again <span class="ar-text">اضغط على السماعة للاستماع مرة أخرى</span></div>`;
  } else if(kind === 'story'){
    el.innerHTML = `<div class="story-strip">${round.story.map(s=>`<div class="story-frame">${s}</div>`).join('')}</div><div class="story-caption">${round.storyEn}</div>`;
  } else {
    el.remove();
  }
}

/* ---- ORDER (drag + tap) ---- */

function renderOrder(game, activity, round, container){
  const charKey = activity.character || game.character;
  const items = round.items;
  const target = items.map(i => i.id);
  let pool = shuffle(items);
  if(items.length > 1){
    let tries = 0;
    while(pool.map(i=>i.id).join() === target.join() && tries < 6){ pool = shuffle(items); tries++; }
  }
  const placed = new Array(items.length).fill(null);
  container.innerHTML = `
    <div class="question-row">
      <div class="character-bubble">
        <img src="${CHAR_IMG[charKey]}" alt="${CHAR_NAME_EN[charKey]}">
        <div class="speech-bubble">
          <p class="q-en">${activity.instructionsEn}</p>
          <p class="q-ar ar-text">${activity.instructionsAr||''}</p>
          ${round.storyEn ? (round.storyBig
            ? `<p class="q-en" style="font-size:26px;font-weight:900;margin-top:10px;">${round.storyEn}</p><p class="q-ar ar-text" style="font-size:20px;font-weight:800;">${round.storyAr||''}</p>`
            : `<p class="q-en" style="font-size:13.5px;font-weight:700;margin-top:8px;">${round.storyEn}</p><p class="q-ar ar-text" style="font-size:12px;">${round.storyAr||''}</p>`) : ''}
        </div>
      </div>
    </div>
    <div class="order-slots" id="orderSlots"></div>
    <div class="order-pool" id="orderPool"></div>
    <div class="hint-box" id="hintBox"></div>
    <div id="feedbackArea"></div>
    <div class="action-row" id="actionRow">
      <button class="btn btn-secondary" id="resetOrderBtn">↺ Reset <span class="ar-text">إعادة</span></button>
      <button class="btn btn-hint" id="hintBtn">💡 Hint <span class="ar-text">تلميح</span></button>
      <button class="btn btn-primary" id="checkOrderBtn" disabled>✓ Check <span class="ar-text">تحقق</span></button>
    </div>
  `;
  const slotsEl = document.getElementById('orderSlots');
  const poolEl = document.getElementById('orderPool');
  items.forEach((it, idx) => {
    const slot = document.createElement('div');
    slot.className = 'slot';
    slot.dataset.index = idx;
    slot.innerHTML = `<span class="slot-index">${idx+1}</span>`;
    slotsEl.appendChild(slot);
  });
  function chipLabel(it){
    return it.emoji ? `${it.emoji}<br>${it.labelEn}` : it.labelEn;
  }
  function updateCheckBtn(){
    document.getElementById('checkOrderBtn').disabled = !placed.every(p => p !== null);
  }
  pool.forEach(it => {
    const chip = document.createElement('div');
    chip.className = 'drag-chip';
    chip.dataset.id = it.id;
    chip.dataset.label = it.labelEn;
    chip.innerHTML = chipLabel(it);
    poolEl.appendChild(chip);
    setupChipInteraction(chip, slotsEl, poolEl, placed, updateCheckBtn, activity);
  });
  document.getElementById('resetOrderBtn').onclick = () => {
    Array.from(slotsEl.children).forEach((slot, idx) => {
      const chip = slot.querySelector('.drag-chip');
      if(chip){ poolEl.appendChild(chip); chip.classList.remove('placed'); placed[idx] = null; }
      slot.classList.remove('filled','correct-slot','incorrect-slot');
    });
    updateCheckBtn();
  };
  document.getElementById('checkOrderBtn').onclick = () => {
    let allCorrect = true;
    Array.from(slotsEl.children).forEach((slot, idx) => {
      const chip = slot.querySelector('.drag-chip');
      const ok = chip && chip.dataset.id === target[idx];
      slot.classList.toggle('correct-slot', !!ok);
      slot.classList.toggle('incorrect-slot', !ok);
      if(!ok) allCorrect = false;
    });
    if(allCorrect){
      document.getElementById('checkOrderBtn').disabled = true;
      finalizeRoundSuccess();
    } else {
      showMistakeFeedback();
    }
  };
  document.getElementById('hintBtn').onclick = () => showOrderHint(activity, round, items, target, placed, slotsEl);
}

function setupChipInteraction(chip, slotsEl, poolEl, placed, onChange, activity){
  function findSlotIndex(el){
    const slot = el && el.closest ? el.closest('.slot') : null;
    return (slot && slotsEl.contains(slot)) ? Number(slot.dataset.index) : -1;
  }
  function placeInSlot(idx){
    const slot = slotsEl.children[idx];
    const existing = slot.querySelector('.drag-chip');
    if(existing && existing !== chip){
      poolEl.appendChild(existing);
      existing.classList.remove('placed');
      const exIdx = placed.indexOf(existing.dataset.id);
      if(exIdx > -1) placed[exIdx] = null;
    }
    const oldIdx = placed.findIndex(id => id === chip.dataset.id);
    if(oldIdx > -1){
      placed[oldIdx] = null;
      slotsEl.children[oldIdx].classList.remove('filled');
    }
    slot.appendChild(chip);
    chip.classList.add('placed');
    placed[idx] = chip.dataset.id;
    slot.classList.add('filled');
    slot.classList.remove('correct-slot','incorrect-slot');
    if(activity && activity.speakOnPlace && chip.dataset.label){
      speakPlayful(chip.dataset.label, 'en-US');
    }
    onChange();
  }
  function returnToPool(){
    const oldIdx = placed.findIndex(id => id === chip.dataset.id);
    if(oldIdx > -1){
      placed[oldIdx] = null;
      slotsEl.children[oldIdx].classList.remove('filled','correct-slot','incorrect-slot');
    }
    poolEl.appendChild(chip);
    chip.classList.remove('placed');
    onChange();
  }
  chip.addEventListener('pointerdown', e => {
    e.preventDefault();
    const startX = e.clientX, startY = e.clientY;
    let dragging = false;
    chip.setPointerCapture(e.pointerId);
    const originParent = chip.parentElement;
    const rect = chip.getBoundingClientRect();
    const offsetX = e.clientX - rect.left, offsetY = e.clientY - rect.top;
    const startWidth = rect.width;

    function move(ev){
      const dx = ev.clientX - startX, dy = ev.clientY - startY;
      if(!dragging && Math.hypot(dx,dy) > 6){
        dragging = true;
        chip.classList.add('dragging');
        chip.style.position = 'fixed';
        chip.style.width = startWidth + 'px';
        document.body.appendChild(chip);
      }
      if(dragging){
        chip.style.left = (ev.clientX - offsetX) + 'px';
        chip.style.top = (ev.clientY - offsetY) + 'px';
      }
    }
    function up(ev){
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      try{ chip.releasePointerCapture(e.pointerId); }catch(err){}
      if(dragging){
        chip.classList.remove('dragging');
        chip.style.position = '';
        chip.style.left = '';
        chip.style.top = '';
        chip.style.width = '';
        chip.style.visibility = 'hidden';
        const el = document.elementFromPoint(ev.clientX, ev.clientY);
        chip.style.visibility = '';
        const slotIdx = findSlotIndex(el);
        if(slotIdx > -1){
          placeInSlot(slotIdx);
        } else if(el && (el === poolEl || poolEl.contains(el))){
          returnToPool();
        } else {
          originParent.appendChild(chip);
        }
      } else {
        if(poolEl.contains(chip)){
          const emptyIdx = placed.findIndex(p => p === null);
          if(emptyIdx > -1) placeInSlot(emptyIdx);
        } else {
          returnToPool();
        }
      }
    }
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  });
}

/* ---- MATCH ---- */

function renderMatch(game, activity, round, container){
  const charKey = activity.character || game.character;
  const leftItems = shuffle(round.pairs.map(p => ({id:p.id, label:p.labelEn})));
  const rightItems = shuffle(round.pairs.map(p => ({id:p.id, emoji:p.emoji})));
  container.innerHTML = `
    <div class="question-row">
      <div class="character-bubble">
        <img src="${CHAR_IMG[charKey]}" alt="${CHAR_NAME_EN[charKey]}">
        <div class="speech-bubble">
          <p class="q-en">${activity.instructionsEn}</p>
          <p class="q-ar ar-text">${activity.instructionsAr||''}</p>
        </div>
      </div>
    </div>
    <div class="match-wrap">
      <div class="match-col" id="matchLeft"></div>
      <div class="match-col" id="matchRight"></div>
    </div>
    <div class="hint-box" id="hintBox"></div>
    <div id="feedbackArea"></div>
    <div class="action-row" id="actionRow">
      <button class="btn btn-hint" id="hintBtn">💡 Hint <span class="ar-text">تلميح</span></button>
    </div>
  `;
  const leftCol = document.getElementById('matchLeft');
  const rightCol = document.getElementById('matchRight');
  leftItems.forEach(it => {
    const el = document.createElement('button');
    el.className = 'match-item';
    el.textContent = it.label;
    el.dataset.id = it.id;
    el.dataset.side = 'left';
    leftCol.appendChild(el);
  });
  rightItems.forEach(it => {
    const el = document.createElement('button');
    el.className = 'match-item emoji-item';
    el.textContent = it.emoji;
    el.dataset.id = it.id;
    el.dataset.side = 'right';
    rightCol.appendChild(el);
  });
  let selectedLeft = null, matchedCount = 0;
  function clickHandler(e){
    const el = e.currentTarget;
    if(el.classList.contains('matched')) return;
    if(el.dataset.side === 'left'){
      if(selectedLeft) selectedLeft.classList.remove('selected');
      selectedLeft = el;
      el.classList.add('selected');
    } else {
      if(!selectedLeft) return;
      if(selectedLeft.dataset.id === el.dataset.id){
        selectedLeft.classList.add('matched');
        selectedLeft.classList.remove('selected');
        el.classList.add('matched');
        selectedLeft.disabled = true;
        el.disabled = true;
        selectedLeft = null;
        matchedCount++;
        if(matchedCount === round.pairs.length){
          finalizeRoundSuccess();
        }
      } else {
        const leftRef = selectedLeft;
        el.classList.add('wrong-flash');
        leftRef.classList.add('wrong-flash');
        showMistakeFeedback();
        setTimeout(() => {
          el.classList.remove('wrong-flash');
          leftRef.classList.remove('wrong-flash','selected');
        }, 500);
        selectedLeft = null;
      }
    }
  }
  [...leftCol.children, ...rightCol.children].forEach(el => el.addEventListener('click', clickHandler));
  document.getElementById('hintBtn').onclick = () => showHint(round, activity, leftCol);
}

/* ---- BUILD (number builder) ---- */

function renderBuild(game, activity, round, container){
  const charKey = activity.character || game.character;
  container.innerHTML = `
    <div class="question-row">
      <div class="character-bubble">
        <img src="${CHAR_IMG[charKey]}" alt="${CHAR_NAME_EN[charKey]}">
        <div class="speech-bubble">
          <p class="q-en">${activity.instructionsEn}</p>
          <p class="q-ar ar-text">${activity.instructionsAr||''}</p>
        </div>
      </div>
    </div>
    <div class="builder-target-row">
      <div class="builder-target">${round.target}</div>
      <button class="speak-btn" id="speakTargetBtn" title="Listen" aria-label="Listen">🔊</button>
    </div>
    <div class="builder-groups">
      <div class="builder-group"><h4>Hundreds <span class="ar-text">مئات</span></h4><div class="builder-choices" id="bh"></div></div>
      <div class="builder-group"><h4>Tens <span class="ar-text">عشرات</span></h4><div class="builder-choices" id="bt"></div></div>
      <div class="builder-group"><h4>Ones <span class="ar-text">آحاد</span></h4><div class="builder-choices" id="bo"></div></div>
    </div>
    <div class="builder-sum" id="builderSum"></div>
    <div class="builder-words" id="builderWords"></div>
    <div class="hint-box" id="hintBox"></div>
    <div id="feedbackArea"></div>
    <div class="action-row" id="actionRow">
      <button class="btn btn-hint" id="hintBtn">💡 Hint <span class="ar-text">تلميح</span></button>
      <button class="btn btn-primary" id="checkBuildBtn">✓ Check <span class="ar-text">تحقق</span></button>
    </div>
  `;
  const sel = { hundreds:null, tens:null, ones:null };
  function renderGroup(id, options, part){
    const el = document.getElementById(id);
    options.forEach(v => {
      const chip = document.createElement('button');
      chip.className = 'builder-chip';
      chip.textContent = v;
      chip.onclick = () => {
        Array.from(el.children).forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        sel[part] = v;
        updateSum();
      };
      el.appendChild(chip);
    });
  }
  renderGroup('bh', round.hundredsOptions, 'hundreds');
  renderGroup('bt', round.tensOptions, 'tens');
  renderGroup('bo', round.onesOptions, 'ones');
  document.getElementById('speakTargetBtn').onclick = () => speak(numberToWords(round.target), 'en-US');
  setTimeout(() => speak(numberToWords(round.target), 'en-US'), 450);
  function updateSum(){
    const ready = sel.hundreds !== null && sel.tens !== null && sel.ones !== null;
    const h = sel.hundreds!==null ? sel.hundreds : '?';
    const t = sel.tens!==null ? sel.tens : '?';
    const o = sel.ones!==null ? sel.ones : '?';
    document.getElementById('builderSum').innerHTML = `${h} + ${t} + ${o} = <b>${ready ? (sel.hundreds+sel.tens+sel.ones) : '?'}</b>`;
  }
  updateSum();
  document.getElementById('checkBuildBtn').onclick = () => {
    if(sel.hundreds === null || sel.tens === null || sel.ones === null){
      showMistakeFeedback();
      return;
    }
    const total = sel.hundreds + sel.tens + sel.ones;
    if(total === round.target){
      document.getElementById('builderWords').textContent = numberToWords(round.target);
      finalizeRoundSuccess();
    } else {
      showMistakeFeedback();
    }
  };
  document.getElementById('hintBtn').onclick = () => showHint(round, activity, document.getElementById('builderTarget'));
}

/* ---- COMPARE (superlatives) ---- */

function renderCompareStage(item, kind){
  if(kind === 'sizeBox'){
    const s = Math.max(32, item.value);
    return `<div class="stage"><div class="size-box" style="width:${s}px;height:${s}px;font-size:${Math.round(s*0.5)}px;">${item.emoji}</div></div>`;
  }
  if(kind === 'lengthBar'){
    const w = Math.max(30, item.value);
    return `<div class="stage"><div class="length-bar-wrap"><span style="font-size:20px;">${item.emoji}</span><div class="length-bar" style="width:${w}px;"></div></div></div>`;
  }
  if(kind === 'difficultyMeter'){
    let segs = '';
    for(let i=1;i<=3;i++) segs += `<div class="diff-seg ${i<=item.value?'filled':''}"></div>`;
    return `<div class="stage"><div><div style="font-size:36px;text-align:center;">${item.emoji}</div><div class="diff-meter">${segs}</div></div></div>`;
  }
  if(kind === 'laughMeter'){
    let icons = '';
    for(let i=1;i<=3;i++) icons += `<span class="laugh-icon ${i<=item.value?'filled':''}">😂</span>`;
    return `<div class="stage"><div><div style="font-size:36px;text-align:center;">${item.emoji}</div><div class="laugh-meter">${icons}</div></div></div>`;
  }
  const s = Math.max(24, item.value);
  return `<div class="stage"><span class="person-emoji" style="font-size:${s}px;">${item.emoji}</span></div>`;
}

function renderCompare(game, activity, round, container){
  const charKey = activity.character || game.character;
  const visualKind = round.visualKind || activity.visualKind;
  container.innerHTML = `
    <div class="question-row">
      <div class="character-bubble">
        <img src="${CHAR_IMG[charKey]}" alt="${CHAR_NAME_EN[charKey]}">
        <div class="speech-bubble">
          <p class="q-en">${round.promptEn}</p>
          <p class="q-ar ar-text">${round.promptAr||''}</p>
        </div>
      </div>
      <button class="speak-btn" id="speakPromptBtn" title="Listen">🔊</button>
    </div>
    <div class="compare-grid" id="compareGrid"></div>
    <div class="hint-box" id="hintBox"></div>
    <div id="feedbackArea"></div>
    <div class="action-row" id="actionRow">
      <button class="btn btn-hint" id="hintBtn">💡 Hint <span class="ar-text">تلميح</span></button>
    </div>
  `;
  document.getElementById('speakPromptBtn').onclick = () => speak(round.promptEn, 'en-US');
  const grid = document.getElementById('compareGrid');
  round.items.forEach(item => {
    const card = document.createElement('button');
    card.className = 'compare-card';
    card.innerHTML = renderCompareStage(item, visualKind) +
      `<div class="cc-label">${item.label}${item.labelAr ? `<span class="ar-text">${item.labelAr}</span>` : ''}</div>`;
    card.onclick = () => {
      const allCards = grid.querySelectorAll('.compare-card');
      if(item.id === round.correct){
        allCards.forEach(c => c.disabled = true);
        card.classList.add('correct');
        finalizeRoundSuccess();
      } else {
        card.classList.add('incorrect');
        card.disabled = true;
        showMistakeFeedback();
      }
    };
    grid.appendChild(card);
  });
  document.getElementById('hintBtn').onclick = () => showHint(round, activity, grid);
}

/* ---- TEACH (short teaching moment) ---- */

function renderTeach(game, activity, container){
  const charKey = activity.character || game.character;
  const blocks = activity.teachBlocks || [];
  const blocksHtml = blocks.map((b, i) => `
        <div class="teach-row${b.accent ? ' long' : ''}"${i > 0 ? ' style="margin-top:18px;"' : ''}><span class="pill">${b.pillEn}</span></div>
        <div class="teach-desc${b.accent ? ' long' : ''}">${b.descEn} <span class="ar-text">${b.descAr}</span></div>
        ${(b.examples||[]).map(ex => `<div style="font-size:23px;margin-top:6px;">${ex.emoji} <span style="font-size:16px;font-weight:800;color:var(--ink-500);">${ex.textEn}</span></div>`).join('')}
        ${b.arrowDemo ? `<div class="number-read-demo"><div class="num">${b.arrowDemo.num}</div><div class="arrow">➜</div><div class="word">${b.arrowDemo.word}</div></div>` : ''}
  `).join('');
  container.innerHTML = `
    <div class="teach-panel">
      <img src="${CHAR_IMG[charKey]}" alt="${CHAR_NAME_EN[charKey]}">
      <div class="teach-col">
        ${blocksHtml}
      </div>
    </div>
    <div class="action-row">
      <button class="btn btn-primary" id="teachContinueBtn">Continue ▶ <span class="ar-text">التالي</span></button>
    </div>
  `;
  document.getElementById('teachContinueBtn').onclick = () => {
    session.totalRounds++;
    session.correctFirstTry++;
    advanceRound();
  };
}

/* ---- VOCAB (word intro grid) ---- */

function renderVocab(game, activity, container){
  const charKey = activity.character || game.character;
  container.innerHTML = `
    <div class="question-row">
      <div class="character-bubble">
        <img src="${CHAR_IMG[charKey]}" alt="${CHAR_NAME_EN[charKey]}">
        <div class="speech-bubble">
          <p class="q-en">${activity.instructionsEn}</p>
          <p class="q-ar ar-text">${activity.instructionsAr||''}</p>
        </div>
      </div>
    </div>
    <div class="vocab-grid" id="vocabGrid"></div>
    <div class="action-row">
      <button class="btn btn-primary" id="vocabContinueBtn">Continue ▶ <span class="ar-text">التالي</span></button>
    </div>
  `;
  const grid = document.getElementById('vocabGrid');
  activity.words.forEach(w => {
    const card = document.createElement('div');
    card.className = 'vocab-card';
    card.innerHTML = `
      <div class="vc-emoji">${w.emoji}</div>
      <div class="vc-word">${w.en}</div>
      <div class="vc-ar ar-text">${w.ar}</div>
      <div class="vc-btns"><button class="speak-btn small-speak" title="Listen">🔊</button></div>
    `;
    card.querySelector('.small-speak').onclick = (e) => { e.stopPropagation(); speak(w.en, 'en-US'); };
    card.onclick = () => card.classList.toggle('revealed');
    grid.appendChild(card);
  });
  document.getElementById('vocabContinueBtn').onclick = () => {
    session.totalRounds++;
    session.correctFirstTry++;
    advanceRound();
  };
}
