const SPINNING_PERIOD = 2000;

function updateCounter(storageData) {
  if (!storageData.display) {
    return;
  }
  const weekId = Utils.getWeekId(new Date());
  const timeCount = storageData.timeCount;
  const wastedSeconds = timeCount[weekId] ? timeCount[weekId] : 0;
  const wastedMoney =
      Utils.getMonetaryValue(wastedSeconds, storageData.wage);
  const span = document.createElement('span');
  span.innerHTML = wastedMoney.toFixed(2).toString() + '$';

  const existingCounter = document.getElementById('tim_counter');
  if (!storageData.currentIsDesirable) {
    if (existingCounter) {
      while (existingCounter.firstChild) {
        existingCounter.removeChild(existingCounter.firstChild);
      }
      existingCounter.appendChild(span);
    } else {
      const elem = document.createElement('div');
      elem.setAttribute('id', 'tim_counter');
      elem.appendChild(span);
      document.body.appendChild(elem);
    }
  } else {
    if (existingCounter) {
      existingCounter.parentElement.removeChild(existingCounter);
    }
  }
}

// Initial execution.
chrome.storage.local.get(updateCounter);

// Spinning loop to update count.
const intervalID =
    setInterval(() => chrome.storage.local.get(updateCounter),
        SPINNING_PERIOD);