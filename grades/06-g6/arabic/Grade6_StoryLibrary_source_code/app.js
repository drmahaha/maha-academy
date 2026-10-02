/* ===========================================================
   Maha Academy — Math Lab — App glue: init, navigation, settings
   =========================================================== */

function openSettings(){ document.getElementById("settingsModal").classList.add("show"); }
function closeSettings(){ document.getElementById("settingsModal").classList.remove("show"); }

function doResetProgress(){
  progress = defaultProgress();
  saveProgress();
  renderHub();
  closeSettings();
  showScreen("hub");
  showToast((window.THEME_TEXT && THEME_TEXT.resetAr) || "تمت إعادة ضبط تقدمك في المختبر! ⚡", (window.THEME_TEXT && THEME_TEXT.resetEn) || "Your lab progress has been reset!");
}

function goWelcome(){ showScreen("welcome"); }
function goHub(){ document.body.dataset.veh = ""; showScreen("hub"); renderHub(); }

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("startBtn").addEventListener("click", goHub);
  document.getElementById("logoHomeBtn").addEventListener("click", goWelcome);
  document.getElementById("homeBtn").addEventListener("click", goWelcome);
  document.getElementById("labBtnTop").addEventListener("click", goHub);
  document.getElementById("settingsBtn").addEventListener("click", openSettings);
  document.getElementById("closeSettingsBtn").addEventListener("click", closeSettings);
  document.getElementById("confirmResetBtn").addEventListener("click", doResetProgress);
  document.getElementById("settingsModal").addEventListener("click", (e) => {
    if(e.target.id === "settingsModal") closeSettings();
  });
  document.getElementById("moduleBackBtn").addEventListener("click", goHub);
  document.getElementById("progressBackBtn").addEventListener("click", goHub);
  document.getElementById("activityBackBtn").addEventListener("click", () => {
    if(session) openModule(session.modKey, true); else goHub();
  });

  const enToggleOn = document.getElementById("enToggleOn");
  const enToggleOff = document.getElementById("enToggleOff");
  function setEnglishVisible(visible){
    document.body.classList.toggle("en-hidden", !visible);
    enToggleOn.classList.toggle("active", visible);
    enToggleOff.classList.toggle("active", !visible);
    progress.lang = visible ? "ar+en" : "ar";
    saveProgress();
  }
  setEnglishVisible((progress.lang || (window.THEME_TEXT && THEME_TEXT.defaultLang) || "ar+en") !== "ar");
  enToggleOn.addEventListener("click", () => setEnglishVisible(true));
  enToggleOff.addEventListener("click", () => setEnglishVisible(false));

  updateTopbar();
  showScreen("welcome");
});
