function saveOptions(e) {
  e.preventDefault();
  browser.storage.local.set({
    wage: document.querySelector("#wage").value,
    websites: document.querySelector("#websites").value,
  });
}

function restoreOptions() {

  function setCurrentChoice(state) {
    document.querySelector("#wage").value = state.wage || "10";
    document.querySelector("#websites").value =
        state.websites || "www.facebook.com";
  }

  const getting = browser.storage.local.get();
  getting.then(setCurrentChoice);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
