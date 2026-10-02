/* ===========================================================
   Maha Academy — Game Engine (Arabic-primary), Social Studies copy
   Generic, reusable rendering + scoring logic for every math
   activity type (concept, terms, mcq, keypad, numberline, match).
   Content lives in data.js; this file only knows how to run it.
   Text is Arabic-primary: every prompt/label is written in Arabic
   first, with an optional English math-term badge (.en-badge)
   shown alongside — hideable via the AR/AR+EN toggle in app.js.
   =========================================================== */

/* ---------- Character metadata ---------- */

const CHAR_IMG = { mahir: MAHIR_IMG, maya: MAYA_IMG, marya: MARYA_IMG, malik: MALIK_IMG };
const CHAR_NAME_AR = {
  mahir: "ماهر المغامر", maya: "مايا الذكية",
  marya: "ماريا الصانعة", malik: "مالك المحفّز"
};
const CHAR_NAME_EN = {
  mahir: "Mahir the Adventurer", maya: "Maya the Smart",
  marya: "Marya the Maker", malik: "Malik the Motivator"
};

const GOOD_MSGS = [
  {ar:"ممتاز!", en:"Excellent!"},
  {ar:"أحسنت!", en:"Great job!"},
  {ar:"رائع!", en:"Amazing!"},
  {ar:"أحسنت صنعًا!", en:"Well done!"},
  {ar:"رائع جدًا!", en:"Super!"}
];
const TRY_MSGS = [
  {ar:"حاول مرة أخرى!", en:"Try again!"},
  {ar:"أنت تستطيع!", en:"You can do it!"},
  {ar:"اقتربت!", en:"Almost!"},
  {ar:"واصل المحاولة!", en:"Keep going!"}
];

const DEFAULT_HINTS = {
  mcq: {ar:"فكر جيدًا واختر أفضل إجابة.", en:"Think carefully and choose the best answer."},
  keypad: {ar:"اكتب الرقم باستخدام لوحة المفاتيح.", en:"Type the number using the keypad."},
  numberline: {ar:"انظر إلى الأرقام على الخط جيدًا.", en:"Look at the numbers on the line carefully."},
  match: {ar:"فكر في القيمة المكافئة.", en:"Think about the equivalent value."}
};

function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function shuffle(arr){
  const a = arr.slice();
  for(let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i+1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------- Progress storage ---------- */

const PROGRESS_KEY = "mahaAcademyProgress_g7social_v1";

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

function speak(text, lang){
  if(!('speechSynthesis' in window) || !text) return;
  try{
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang || 'ar-SA';
    u.rate = 0.85;
    u.pitch = 1.0;
    window.speechSynthesis.speak(u);
  }catch(e){ /* speech not supported — fail silently */ }
}

/* ---------- Screen management ---------- */

function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  const el = document.getElementById('screen-'+id);
  if(el) el.classList.add('active');
  window.scrollTo({top:0, behavior:'smooth'});
}

let toastTimer = null;
function showToast(ar, en){
  const t = document.getElementById('toast');
  if(!t) return;
  t.innerHTML = ar + (en ? ` <span class="en-badge">${en}</span>` : '');
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
    btn.setAttribute('aria-label', game.titleAr + ' - ' + game.titleEn);
    btn.innerHTML = `<span class="path-node-emoji">${unlocked ? game.emoji : '🔒'}</span>` +
      (completed ? `<span class="path-node-stars">${renderMiniStars(stars)}</span>` : '');
    btn.onclick = () => {
      if(unlocked) startGame(game.id);
      else showToast('أكمل المغامرة السابقة لفتح هذه المرحلة! 🔒', 'Finish the previous adventure to unlock this!');
    };

    const label = document.createElement('div');
    label.className = 'path-node-label';
    label.innerHTML = `${game.titleAr}<span class="en-badge">${game.titleEn}</span>`;

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
  if(activity.type === 'concept' || activity.type === 'terms') return 1;
  return activity.rounds.length;
}

function updateGameHeader(game){
  document.getElementById('gameHeaderEmoji').textContent = game.emoji;
  document.getElementById('gameHeaderTitleAr').textContent = game.titleAr;
  document.getElementById('gameHeaderTitleEn').textContent = game.titleEn;
  const dotsEl = document.getElementById('activityDots');
  dotsEl.innerHTML = game.activities.map((a,i)=>{
    let cls = 'dot';
    if(i < session.activityIdx) cls += ' done';
    else if(i === session.activityIdx) cls += ' active';
    return `<span class="${cls}" title="${a.tagAr}"></span>`;
  }).join('');
}

function renderActivity(){
  const game = ALL_GAMES.find(g => g.id === session.gameId);
  const activity = game.activities[session.activityIdx];
  session.hadMistake = false;
  updateGameHeader(game);
  const card = document.getElementById('activityCard');
  const roundsCount = activityRoundsCount(activity);
  const roundLabel = (activity.type==='concept' || activity.type==='terms') ? '' :
    `<span class="tag" style="background:#fff4d6;color:#7a5300;">جولة ${session.roundIdx+1} / ${roundsCount}</span>`;
  card.innerHTML = `
    <div class="activity-kicker">
      <span class="tag">${activity.tagAr} <span class="en-badge">${activity.tagEn||''}</span></span>
      ${roundLabel}
    </div>
    <div id="activityBody"></div>
  `;
  const body = document.getElementById('activityBody');
  switch(activity.type){
    case 'mcq': renderMCQ(game, activity, activity.rounds[session.roundIdx], body); break;
    case 'keypad': renderKeypad(game, activity, activity.rounds[session.roundIdx], body); break;
    case 'numberline': renderNumberline(game, activity, activity.rounds[session.roundIdx], body); break;
    case 'match': renderMatch(game, activity, activity.rounds[session.roundIdx], body); break;
    case 'concept': renderConcept(game, activity, body); break;
    case 'terms': renderTerms(game, activity, body); break;
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
      <img src="${CHAR_IMG[charKey]}" alt="${CHAR_NAME_AR[charKey]}">
      <div>${msg.ar}<span class="en-badge">${msg.en}</span></div>
    </div>`;
  if(actions) actions.innerHTML = `<button class="btn btn-primary" id="nextBtn">التالي ▶ <span class="en-badge">Next</span></button>`;
  const nextBtn = document.getElementById('nextBtn');
  if(nextBtn) nextBtn.onclick = () => advanceRound();
}

function showMistakeFeedback(){
  session.hadMistake = true;
  const msg = pick(TRY_MSGS);
  const area = document.getElementById('feedbackArea');
  if(area) area.innerHTML = `
    <div class="feedback-banner retry">
      <img src="${MALIK_IMG}" alt="مالك">
      <div>${msg.ar}<span class="en-badge">${msg.en}</span></div>
    </div>`;
}

function renderHintBox(ar, en, visualEl){
  const box = document.getElementById('hintBox');
  if(!box) return;
  box.innerHTML = `💡 ${ar}<span class="en-badge">${en}</span>`;
  box.classList.add('show');
  if(visualEl){
    visualEl.classList.add('hint-active');
    setTimeout(()=>visualEl && visualEl.classList.remove('hint-active'), 2200);
  }
}

function showHint(round, activity, visualEl){
  const fallback = DEFAULT_HINTS[activity.type] || {ar:"فكر جيدًا!", en:"Think carefully!"};
  const ar = (round && round.hintAr) || fallback.ar;
  const en = (round && round.hintEn) || fallback.en;
  renderHintBox(ar, en, visualEl);
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
  const msg = stars === 3 ? {ar:"رائع! أنت متألق!", en:"Amazing! You are shining bright!"} :
              stars === 2 ? {ar:"عمل رائع! واصل التدريب لتتألق أكثر!", en:"Great job! Keep practicing to shine even more!"} :
              {ar:"محاولة جيدة! التدريب يصنع الإتقان!", en:"Good try! Practice makes perfect!"};
  const isLast = idx === ALL_GAMES.length - 1;
  wrap.innerHTML = `
    <div class="end-card">
      <div class="char-celebrate"><img src="${CHAR_IMG[charKey]}" alt="${CHAR_NAME_AR[charKey]}"></div>
      <h2>${game.titleAr}</h2>
      <div class="en-badge">${game.titleEn}</div>
      <div class="stars-display">${[1,2,3].map(i=>`<span class="star ${i<=stars?'lit':''}">⭐</span>`).join('')}</div>
      <div class="end-stats">
        <div class="end-stat"><div class="num">${total}</div><div class="lbl">أسئلة <span class="en-badge">Questions</span></div></div>
        <div class="end-stat"><div class="num">${correct}</div><div class="lbl">من أول مرة <span class="en-badge">First Try</span></div></div>
        <div class="end-stat"><div class="num">${stars}</div><div class="lbl">نجوم <span class="en-badge">Stars</span></div></div>
      </div>
      <p class="end-msg">${msg.ar}<span class="en-badge" style="display:block;">${msg.en}</span></p>
      <div class="action-row">
        <button class="btn btn-secondary" id="playAgainBtn">↺ إعادة اللعب <span class="en-badge">Play Again</span></button>
        <button class="btn btn-primary" id="nextAdvBtn">${isLast ? '🏆 جائزتي' : 'المغامرة التالية ▶'} <span class="en-badge">${isLast ? 'My Trophy' : 'Next Adventure'}</span></button>
        <button class="btn btn-secondary" id="toMapBtn">🗺️ الخريطة <span class="en-badge">Map</span></button>
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
        <img src="${CHAR_IMG[charKey]}" alt="${CHAR_NAME_AR[charKey]}">
        <div class="speech-bubble">
          <p class="q-ar">${round.promptAr}</p>
          <p class="q-en en-badge">${round.promptEn||''}</p>
        </div>
      </div>
      <button class="speak-btn" id="speakPromptBtn" title="استمع" aria-label="استمع">🔊</button>
    </div>
    <div class="visual-stage" id="visualStage"></div>
    <div class="options-grid cols-3" id="optionsGrid"></div>
    <div class="hint-box" id="hintBox"></div>
    <div id="feedbackArea"></div>
    <div class="action-row" id="actionRow">
      <button class="btn btn-hint" id="hintBtn">💡 تلميح <span class="en-badge">Hint</span></button>
    </div>
  `;
  renderVisualStage(round, document.getElementById('visualStage'));
  document.getElementById('speakPromptBtn').onclick = () => speak(round.promptAr, 'ar-SA');
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

function renderVisualStage(round, el){
  if(round.expr){
    el.innerHTML = `<div class="math-expr">${round.expr}</div>`;
  } else if(round.big){
    el.innerHTML = `<div class="count-objects">${round.big}</div>`;
  } else if(round.emoji && round.count){
    el.innerHTML = `<div class="count-objects">${round.emoji.repeat(round.count)}</div>`;
  } else {
    el.remove();
  }
}

/* ---- KEYPAD (numeric entry) ---- */

function renderKeypad(game, activity, round, container){
  const charKey = activity.character || game.character;
  container.innerHTML = `
    <div class="question-row">
      <div class="character-bubble">
        <img src="${CHAR_IMG[charKey]}" alt="${CHAR_NAME_AR[charKey]}">
        <div class="speech-bubble">
          <p class="q-ar">${round.promptAr}</p>
          <p class="q-en en-badge">${round.promptEn||''}</p>
        </div>
      </div>
      <button class="speak-btn" id="speakPromptBtn" title="استمع" aria-label="استمع">🔊</button>
    </div>
    <div class="visual-stage" id="visualStage"></div>
    <div class="keypad-display" id="keypadDisplay"><span class="kp-cursor">|</span></div>
    <div class="keypad-grid" id="keypadGrid"></div>
    <div class="hint-box" id="hintBox"></div>
    <div id="feedbackArea"></div>
    <div class="action-row" id="actionRow">
      <button class="btn btn-hint" id="hintBtn">💡 تلميح <span class="en-badge">Hint</span></button>
      <button class="btn btn-primary" id="checkKeypadBtn">✓ تحقق <span class="en-badge">Check</span></button>
    </div>
  `;
  renderVisualStage(round, document.getElementById('visualStage'));
  document.getElementById('speakPromptBtn').onclick = () => speak(round.promptAr, 'ar-SA');
  let value = '';
  const allowNeg = round.allowNegative !== false;
  const allowDecimal = !!round.allowDecimal;
  const display = document.getElementById('keypadDisplay');
  function renderDisplay(){
    display.innerHTML = (value === '' ? '<span class="kp-placeholder">؟</span>' : `<span dir="ltr" class="kp-value">${value}</span>`) + '<span class="kp-cursor">|</span>';
  }
  const keys = ['7','8','9','4','5','6','1','2','3','+/-','0','⌫'];
  const grid = document.getElementById('keypadGrid');
  keys.forEach(k => {
    if(k === '+/-' && !allowNeg) return;
    const btn = document.createElement('button');
    btn.className = 'keypad-key' + (k === '⌫' ? ' kp-back' : '') + (k === '+/-' ? ' kp-sign' : '');
    btn.textContent = k;
    btn.type = 'button';
    btn.onclick = () => {
      if(k === '⌫'){ value = value.slice(0, -1); }
      else if(k === '+/-'){ value = value.startsWith('-') ? value.slice(1) : (value ? '-'+value : '-'); }
      else { value += k; }
      renderDisplay();
    };
    grid.appendChild(btn);
  });
  if(allowDecimal){
    const dotBtn = document.createElement('button');
    dotBtn.className = 'keypad-key';
    dotBtn.textContent = '.';
    dotBtn.type = 'button';
    dotBtn.onclick = () => { if(!value.includes('.')) value += '.'; renderDisplay(); };
    grid.appendChild(dotBtn);
  }
  renderDisplay();
  document.getElementById('checkKeypadBtn').onclick = () => {
    const normalized = value.replace(/^\+/, '');
    if(normalized !== '' && Number(normalized) === Number(round.correct)){
      finalizeRoundSuccess();
    } else {
      showMistakeFeedback();
    }
  };
  document.getElementById('hintBtn').onclick = () => showHint(round, activity, document.getElementById('visualStage'));
}

/* ---- NUMBER LINE (tap chip, then tap correct tick) ---- */

function renderNumberline(game, activity, round, container){
  const charKey = activity.character || game.character;
  container.innerHTML = `
    <div class="question-row">
      <div class="character-bubble">
        <img src="${CHAR_IMG[charKey]}" alt="${CHAR_NAME_AR[charKey]}">
        <div class="speech-bubble">
          <p class="q-ar">${activity.instructionsAr}</p>
          <p class="q-en en-badge">${activity.instructionsEn||''}</p>
        </div>
      </div>
    </div>
    <div class="numberline-wrap" id="numberlineWrap" dir="ltr"></div>
    <div class="numberline-pool" id="numberlinePool"></div>
    <div class="hint-box" id="hintBox"></div>
    <div id="feedbackArea"></div>
    <div class="action-row" id="actionRow">
      <button class="btn btn-hint" id="hintBtn">💡 تلميح <span class="en-badge">Hint</span></button>
    </div>
  `;
  const min = round.min, max = round.max;
  const wrap = document.getElementById('numberlineWrap');
  const line = document.createElement('div');
  line.className = 'numberline-track';
  wrap.appendChild(line);
  const tickEls = {};
  for(let v = min; v <= max; v++){
    const tick = document.createElement('div');
    tick.className = 'numberline-tick';
    tick.dataset.value = v;
    tick.innerHTML = `<div class="nl-tick-mark"></div><div class="nl-tick-label">${v}</div><div class="nl-tick-slot"></div>`;
    wrap.appendChild(tick);
    tickEls[v] = tick;
  }
  const poolEl = document.getElementById('numberlinePool');
  let selectedChip = null;
  let placedCount = 0;
  const items = round.items;
  shuffle(items).forEach(it => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'nl-chip';
    chip.dataset.id = it.id;
    chip.dataset.value = it.value;
    chip.innerHTML = `${it.emoji ? it.emoji+'<br>' : ''}${it.labelAr || it.value}`;
    chip.onclick = () => {
      if(chip.disabled) return;
      if(selectedChip) selectedChip.classList.remove('selected');
      selectedChip = chip;
      chip.classList.add('selected');
    };
    poolEl.appendChild(chip);
  });
  Object.values(tickEls).forEach(tick => {
    tick.querySelector('.nl-tick-slot').addEventListener('click', () => {
      if(!selectedChip) return;
      const tickValue = Number(tick.dataset.value);
      if(Number(selectedChip.dataset.value) === tickValue){
        const slot = tick.querySelector('.nl-tick-slot');
        slot.innerHTML = selectedChip.innerHTML;
        slot.classList.add('filled');
        selectedChip.remove();
        selectedChip = null;
        placedCount++;
        if(placedCount === items.length){
          finalizeRoundSuccess();
        }
      } else {
        tick.classList.add('wrong-flash');
        showMistakeFeedback();
        setTimeout(()=>tick.classList.remove('wrong-flash'), 500);
      }
    });
  });
  document.getElementById('hintBtn').onclick = () => showHint(round, activity, wrap);
}

/* ---- MATCH ---- */

function renderMatch(game, activity, round, container){
  const charKey = activity.character || game.character;
  const leftItems = shuffle(round.pairs.map(p => ({id:p.id, label:p.labelAr})));
  const rightItems = shuffle(round.pairs.map(p => ({id:p.id, label:p.matchLabel})));
  container.innerHTML = `
    <div class="question-row">
      <div class="character-bubble">
        <img src="${CHAR_IMG[charKey]}" alt="${CHAR_NAME_AR[charKey]}">
        <div class="speech-bubble">
          <p class="q-ar">${activity.instructionsAr}</p>
          <p class="q-en en-badge">${activity.instructionsEn||''}</p>
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
      <button class="btn btn-hint" id="hintBtn">💡 تلميح <span class="en-badge">Hint</span></button>
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
    el.className = 'match-item';
    el.setAttribute('dir', round.matchDir || activity.matchDir || 'ltr');
    el.textContent = it.label;
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

/* ---- CONCEPT (short teaching moment) ---- */

function renderConcept(game, activity, container){
  const charKey = activity.character || game.character;
  const blocks = activity.conceptBlocks || [];
  const blocksHtml = blocks.map((b, i) => `
        <div class="teach-row${b.accent ? ' long' : ''}"${i > 0 ? ' style="margin-top:18px;"' : ''}><span class="pill">${b.pillAr}</span></div>
        <div class="teach-desc${b.accent ? ' long' : ''}">${b.descAr} <span class="en-badge">${b.descEn||''}</span></div>
        ${(b.examples||[]).map(ex => `<div style="font-size:23px;margin-top:6px;">${ex.emoji||''} <span style="font-size:17px;font-weight:800;color:var(--ink-500);" dir="${ex.ltr ? 'ltr' : 'rtl'}">${ex.textAr}</span></div>`).join('')}
  `).join('');
  container.innerHTML = `
    <div class="teach-panel">
      <img src="${CHAR_IMG[charKey]}" alt="${CHAR_NAME_AR[charKey]}">
      <div class="teach-col">
        ${blocksHtml}
      </div>
    </div>
    <div class="action-row">
      <button class="btn btn-primary" id="conceptContinueBtn">التالي ▶ <span class="en-badge">Continue</span></button>
    </div>
  `;
  document.getElementById('conceptContinueBtn').onclick = () => {
    session.totalRounds++;
    session.correctFirstTry++;
    advanceRound();
  };
}

/* ---- TERMS (key vocabulary intro grid) ---- */

function renderTerms(game, activity, container){
  const charKey = activity.character || game.character;
  container.innerHTML = `
    <div class="question-row">
      <div class="character-bubble">
        <img src="${CHAR_IMG[charKey]}" alt="${CHAR_NAME_AR[charKey]}">
        <div class="speech-bubble">
          <p class="q-ar">${activity.instructionsAr}</p>
          <p class="q-en en-badge">${activity.instructionsEn||''}</p>
        </div>
      </div>
    </div>
    <div class="vocab-grid" id="termsGrid"></div>
    <div class="action-row">
      <button class="btn btn-primary" id="termsContinueBtn">التالي ▶ <span class="en-badge">Continue</span></button>
    </div>
  `;
  const grid = document.getElementById('termsGrid');
  activity.terms.forEach(w => {
    const card = document.createElement('div');
    card.className = 'vocab-card';
    card.innerHTML = `
      <div class="vc-emoji">${w.emoji}</div>
      <div class="vc-word">${w.ar}</div>
      <div class="vc-ar en-badge">${w.en}</div>
      <div class="vc-btns"><button class="speak-btn small-speak" title="استمع">🔊</button></div>
    `;
    card.querySelector('.small-speak').onclick = (e) => { e.stopPropagation(); speak(w.ar, 'ar-SA'); };
    card.onclick = () => card.classList.toggle('revealed');
    grid.appendChild(card);
  });
  document.getElementById('termsContinueBtn').onclick = () => {
    session.totalRounds++;
    session.correctFirstTry++;
    advanceRound();
  };
}
