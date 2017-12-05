function saveOptions(e) {
  e.preventDefault();
  browser.storage.local.set({
    wage: document.querySelector("#wage").value,
    websites: document.querySelector("#websites").value,
  });
}

function loadOptions() {
  function setOptions(state) {
    document.querySelector("#wage").value = state.wage;
    document.querySelector("#websites").value = state.websites
  }

  const storagePromise = browser.storage.local.get();
  storagePromise.then(setOptions);
}

document.addEventListener("DOMContentLoaded", loadOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
