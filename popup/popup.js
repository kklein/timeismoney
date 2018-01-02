function changeDisplayState(storageData) {
  console.log('set to:' + !storageData.display);
  chrome.storage.local.set({display: !storageData.display});
  chrome.tabs.query({}, tabs => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, {"message": "displaychange"});
    });
  });
}

function changeDisplay() {
  chrome.storage.local.get(changeDisplayState);
}

const button = document.getElementById("popup-btn");
button.addEventListener("click", changeDisplay);
