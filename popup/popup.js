// TODO(kklein): Eventually, it would be nice to have all storage
// writes in the background script. This could be achieved by
// sending a message from the popup button to the background
// script.

function updateVisibility(storageData) {
  chrome.storage.local.set({display: !storageData.display});
}

document.getElementById('show-btn').addEventListener('click',
    (e) => {
      chrome.storage.local.get(updateVisibility);
    },
);
