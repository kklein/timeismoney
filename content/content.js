const INTERVAL_DURATION = 10000;

function updateDisplay(storageData) {
  let wastedSeconds = 0;
  const date = new Date();
  if (!storageData.currentIsDesirable){
    wastedSeconds += date.getTime() - storageData.startTime;
  }
  const weekId = Utils.getWeekId(date);
  const timeCount = storageData.timeCount;
  wastedSeconds += timeCount[weekId] ? timeCount[weekId] : 0;

  const wastedMoney =
      Utils.getMonetaryValue(wastedSeconds, storageData.wage);

  // TODO(kkleindev): Make this spinning loop read-only. This is a fix
  // intended for temporary use. It makes up for the malfunction
  // of window closing event listeners.
  if (!storageData.currentIsDesirable) {
    const newTimeCount = Object.assign({}, storageData.timeCount);
    newTimeCount[weekId] = wastedSeconds;
    chrome.storage.local.set({
      startTime: date.getTime(),
      timeCount: newTimeCount
    });
  }

  const span = document.createElement('span');
  span.innerHTML = wastedMoney.toFixed(2).toString() + '$';

  const existingCounter = document.getElementById('tim_counter');
  if (storageData.display) {
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

chrome.storage.local.get(updateDisplay);

chrome.runtime.onMessage.addListener(message => {
  chrome.storage.local.get(updateDisplay);
});

const intervalID =
    setInterval(() => chrome.storage.local.get(updateDisplay),
    INTERVAL_DURATION);
