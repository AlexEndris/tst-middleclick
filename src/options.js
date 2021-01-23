function saveOptions(e) {
  browser.storage.sync.set({
    closeActive: document.querySelector("#closeActive").checked,
    restoreGloballyRecent: document.querySelector("#restoreGloballyRecent").checked
  });
  e.preventDefault();
}

function restoreOptions() {
  let gettingItem = browser.storage.sync.get('closeActive');
  gettingItem.then((res) => {
    document.querySelector("#closeActive").checked = res.closeActive || false;
    document.querySelector("#restoreGloballyRecent").checked = res.restoreGloballyRecent || false;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);