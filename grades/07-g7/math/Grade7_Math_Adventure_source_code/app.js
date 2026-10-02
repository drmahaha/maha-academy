/* ===========================================================
   Maha Academy — Math App glue: init, navigation, settings
   =========================================================== */

function openSettings(){ document.getElementById('settingsModal').classList.add('show'); }
function closeSettings(){ document.getElementById('settingsModal').classList.remove('show'); }

function doResetProgress(){
  progress = defaultProgress();
  saveProgress();
  renderMap();
  updateTopbarStars();
  closeSettings();
  showToast('تمت إعادة ضبط التقدم! ابدأ من جديد. 🌟', 'Progress reset! Start fresh.');
}

function goHome(){ showScreen('splash'); }
function goMap(){ showScreen('map'); renderMap(); }

document.addEventListener('DOMContentLoaded', () => {
  updateTopbarStars();

  document.getElementById('startBtn').addEventListener('click', goMap);
  document.getElementById('logoHomeBtn').addEventListener('click', goHome);
  document.getElementById('homeBtn').addEventListener('click', goMap);
  document.getElementById('settingsBtn').addEventListener('click', openSettings);
  document.getElementById('closeSettingsBtn').addEventListener('click', closeSettings);
  document.getElementById('confirmResetBtn').addEventListener('click', doResetProgress);
  document.getElementById('settingsModal').addEventListener('click', (e) => {
    if(e.target.id === 'settingsModal') closeSettings();
  });
  document.getElementById('finalToMapBtn').addEventListener('click', goMap);
  document.getElementById('gameExitBtn').addEventListener('click', goMap);

  const enToggleOn = document.getElementById('enToggleOn');
  const enToggleOff = document.getElementById('enToggleOff');
  function setEnglishVisible(visible){
    document.body.classList.toggle('en-hidden', !visible);
    enToggleOn.classList.toggle('active', visible);
    enToggleOff.classList.toggle('active', !visible);
    try{ localStorage.setItem('mahaMathEnglishVisible', visible ? '1' : '0'); }catch(e){}
  }
  let savedEn = '1';
  try{ savedEn = localStorage.getItem('mahaMathEnglishVisible') || '1'; }catch(e){}
  setEnglishVisible(savedEn !== '0');
  enToggleOn.addEventListener('click', () => setEnglishVisible(true));
  enToggleOff.addEventListener('click', () => setEnglishVisible(false));

  showScreen('splash');
});
