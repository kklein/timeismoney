function saveOptions(e) {
  e.preventDefault();
  chrome.storage.local.set({
    wage: document.querySelector("#wage").value,
    websites: document.querySelector("#websites").value,
  });
  // Make options tab close after preference has been stored.
  chrome.tabs.getCurrent((tab) => chrome.tabs.remove(tab.id));
}

function loadOptions() {
  function setOptions(storageData) {
    document.querySelector("#wage").value = storageData.wage;
    document.querySelector("#websites").value = storageData.websites;
  }

  chrome.storage.local.get(setOptions);
}

document.addEventListener("DOMContentLoaded", loadOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
