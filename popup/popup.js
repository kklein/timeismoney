// Courtesy: https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php/6117889#6117889

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

function displaySum(storageData) {
  const button = document.getElementById("popup-btn");
  if (!button) {
    return;
  }
  // If current website is desirable, timeCount already stores the
  // sought-after value. If not, we need to add the difference between now
  // and start time.
  let wastedSeconds = 0;
  const date = new Date();
  if (!storageData.currentIsDesirable){
    wastedSeconds += date.getTime() - storageData.startTime;
  }
  wastedSeconds += storageData.timeCount[getWeekId(date)];
  // TODO(kkleindev): Isolate/modularize time conversion.
  wastedSeconds = Math.round(wastedSeconds / 60000 * 60);
  const wastedMoney =  wastedSeconds * storageData.wage / 3600
  button.textContent = wastedMoney.toFixed(2).toString();
}

chrome.storage.local.get(displaySum);
