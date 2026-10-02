/* ===========================================================
   Maha Academy — App glue: init, navigation, settings
   =========================================================== */

function openSettings(){ document.getElementById('settingsModal').classList.add('show'); }
function closeSettings(){ document.getElementById('settingsModal').classList.remove('show'); }

function doResetProgress(){
  progress = defaultProgress();
  saveProgress();
  renderMap();
  updateTopbarStars();
  closeSettings();
  showToast('Progress reset! Start fresh. 🌟', 'تمت إعادة ضبط التقدم! ابدأ من جديد.');
}

function goHome(){ showScreen('splash'); }
function goMap(){ showScreen('map'); renderMap(); }

document.addEventListener('DOMContentLoaded', () => {
  updateTopbarStars();

  document.getElementById('startBtn').addEventListener('click', goMap);
  document.getElementById('logoHomeBtn').addEventListener('click', goHome);
  document.getElementById('mapBtnTop').addEventListener('click', goMap);
  document.getElementById('settingsBtn').addEventListener('click', openSettings);
  document.getElementById('closeSettingsBtn').addEventListener('click', closeSettings);
  document.getElementById('confirmResetBtn').addEventListener('click', doResetProgress);
  document.getElementById('settingsModal').addEventListener('click', (e) => {
    if(e.target.id === 'settingsModal') closeSettings();
  });
  document.getElementById('finalToMapBtn').addEventListener('click', goMap);
  document.getElementById('gameExitBtn').addEventListener('click', goMap);

  const arToggleOn = document.getElementById('arToggleOn');
  const arToggleOff = document.getElementById('arToggleOff');
  function setArabicVisible(visible){
    document.body.classList.toggle('ar-hidden', !visible);
    arToggleOn.classList.toggle('active', visible);
    arToggleOff.classList.toggle('active', !visible);
    try{ localStorage.setItem('mahaArabicVisible', visible ? '1' : '0'); }catch(e){}
  }
  let savedAr = '1';
  try{ savedAr = localStorage.getItem('mahaArabicVisible') || '1'; }catch(e){}
  setArabicVisible(savedAr !== '0');
  arToggleOn.addEventListener('click', () => setArabicVisible(true));
  arToggleOff.addEventListener('click', () => setArabicVisible(false));

  showScreen('splash');
});
