const SPINNING_PERIOD = 1000;

function removeExistingCounter() {
  const existingCounter = document.getElementById('tim_counter');
  if (existingCounter) {
    existingCounter.parentNode.removeChild(existingCounter);
  }
}

function getWastedMoney(storageData) {
  const weekId = Utils.getWeekId(new Date());
  const timeCount = storageData.timeCount;
  const wastedSeconds = timeCount[weekId] ? timeCount[weekId] : 0;
  return Utils.getMonetaryValue(wastedSeconds, storageData.wage);
}

function getHtmlSpan(wastedMoney) {
  const span = document.createElement('span');
  span.innerHTML = wastedMoney.toFixed(2).toString() + '$';
  return span;
}

function createHTMLCounterElement(span) {
  const elem = document.createElement('div');
  elem.setAttribute('id', 'tim_counter');
  elem.appendChild(span);
  document.body.appendChild(elem);
}

function updateCounter(storageData) {
  removeExistingCounter();
  if (!storageData.display || storageData.currentIsDesirable) {
    return;
  }
  createHTMLCounterElement(
      getHtmlSpan(
          getWastedMoney(storageData)));
}

// Initial execution.
chrome.storage.local.get(updateCounter);

// Spinning loop to update count.
setInterval(() => chrome.storage.local.get(updateCounter),
    SPINNING_PERIOD);
