function getWeekId(date) {
    const dateCopy = new Date(date.valueOf());
    // ISO weeks start on Mondays.
    const dayNumber = (date.getDay() + 6) % 7;
    // Set the target to the Thursday of this week so the
    // target date is in the right year.
    dateCopy.setDate(dateCopy.getDate() - dayNumber + 3);
    // ISO 8601: Week 1 iff January 4th in it.
    const dateJan4 = new Date(dateCopy.getFullYear(), 0, 4);
    // Number of days between target date and january 4th
    const dayDiff = (dateCopy - dateJan4) / 86400000;
    // Calculate week number: Week 1 (january 4th) plus the
    // number of weeks between target date and january 4th
    const weekId = dateCopy.getFullYear().toString() +
        (1 + Math.ceil(dayDiff / 7)).toString();
    return parseInt(weekId);
}

function updateDisplay(storageData) {
  let wastedSeconds = 0;
  const date = new Date();
  if (!storageData.currentIsDesirable){
    wastedSeconds += date.getTime() - storageData.startTime;
  }
  const weekId = getWeekId(date);
  const timeCount = storageData.timeCount;
  wastedSeconds += timeCount[weekId] ? timeCount[weekId] : 0;
  // TODO(kkleindev): Isolate/modularize time conversion.
  wastedSeconds = Math.round(wastedSeconds / 60000 * 60);
  const wastedMoney =  wastedSeconds * storageData.wage / 3600;

  const span = document.createElement('span');
  span.innerHTML = wastedMoney.toFixed(2).toString() + '$';

  const existingCounter = document.getElementById('tim_counter');
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
}

chrome.storage.local.get(updateDisplay);
const intervalID =
    setInterval(() => chrome.storage.local.get(updateDisplay), 10000);
