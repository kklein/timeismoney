/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
  document.addEventListener("click", (e) => {

    function updateTime(storage) {
      const button = document.getElementById("popup-btn");
      if (button) {
        const wastedSeconds = Math.round(storage.timeCount / 60000 * 60);
        const wastedMoney =  wastedSeconds * storage.wage / 3600
        button.textContent = wastedMoney.toFixed(2).toString();
      }
    }

    const storagePromise = browser.storage.local.get();
    storagePromise.then(updateTime);
  });
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
browser.tabs.executeScript({file: "/content-script.js"}).then(listenForClicks);
