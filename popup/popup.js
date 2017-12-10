function displaySum(storage) {
  const button = document.getElementById("popup-btn");
  if (!button) {
    return;
  }
  // If current website is desirable, timeCount already stores the
  // sought-after value. If not, we need to add the difference between now
  // and start time.
  let wastedSeconds = 0;
  if (!storage.currentIsDesirable){
    const date = new Date();
    wastedSeconds += date.getTime() - storage.startTime;
  }
  wastedSeconds += storage.timeCount;
  // TODO(kkleindev): Isolate/modularize time conversion.
  wastedSeconds = Math.round(wastedSeconds / 60000 * 60);
  const wastedMoney =  wastedSeconds * storage.wage / 3600
  button.textContent = wastedMoney.toFixed(2).toString();
}

const storagePromise = browser.storage.local.get();
storagePromise.then(displaySum);
