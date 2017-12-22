function saveOptions(e) {
  e.preventDefault();
  chrome.storage.local.set({
    wage: document.querySelector("#wage").value,
    websites: document.querySelector("#websites-text").value
        .replace(/\n+/g, " ").replace(/\ +/g, " ").trim().split(" "),
  });
  // Firefox: Make options tab close after preference has been stored.
  chrome.tabs.getCurrent((tab) => chrome.tabs.remove(tab.id));
  // Chrome: Make options window close.
  window.close();
}

function loadOptions() {
  function setOptions(storageData) {
    document.querySelector("#wage").value = storageData.wage;
    document.querySelector("#websites-text").value =
        storageData.websites.reduce((a, b) => a + "\n" + b);
  }
  chrome.storage.local.get(setOptions);
}

document.addEventListener("DOMContentLoaded", loadOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
