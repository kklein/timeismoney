function displaySum(storageData) {
  const button = document.getElementById("popup-btn");
  if (!button) {
    return;
  }
  // If current website is desirable, timeCount already stores the
  // sought-after value. If not, we need to add the difference between now
  // and start time.
  let wastedSeconds = 0;
  if (!storageData.currentIsDesirable){
    const date = new Date();
    wastedSeconds += date.getTime() - storageData.startTime;
  }
  wastedSeconds += storageData.timeCount;
  // TODO(kkleindev): Isolate/modularize time conversion.
  wastedSeconds = Math.round(wastedSeconds / 60000 * 60);
  const wastedMoney =  wastedSeconds * storageData.wage / 3600
  button.textContent = wastedMoney.toFixed(2).toString();
}

chrome.storage.local.get(displaySum);
