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

function initializeState(storageData) {
  const date = new Date();
  const weekId = getWeekId(date);
  const defaultTimeCount = {};
  defaultTimeCount[weekId] = 0;
  chrome.storage.local.set({
    currentIsDesirable: true,
    timeCount:
        storageData.timeCount ? storageData.timeCount : defaultTimeCount,
    // TODO(kkleindev): nicer constant declaration.
    wage: storageData.wage ? storageData.wage : 10,
    // TODO(kkleindev): nicer constant declaration.
    websites: storageData.websites ?
        storageData.websites : ["www.facebook.com"]
  });
}

function updateState(tabData, storageData) {
  function isDesirable(url, websites) {
    const isWebsiteInUrl = (element) => url.includes(element);
    return !(websites.some(isWebsiteInUrl));
  }
  const url = tabData[0].url;
  const currentIsDesirable = storageData.currentIsDesirable;
  const timeCount = storageData.timeCount;
  const startTime = storageData.startTime;
  const urlIsDesirable = isDesirable(url, storageData.websites);
  const date = new Date();
  if (currentIsDesirable && !urlIsDesirable) {
    chrome.storage.local.set(
        {currentIsDesirable: false, startTime: date.getTime()});
  } else if (!currentIsDesirable && urlIsDesirable) {
    const weekId = getWeekId(date);
    const newTimeCount = timeCount;
    newTimeCount[weekId] += date.getTime() - startTime;
    chrome.storage.local.set(
        {currentIsDesirable: true, timeCount: newTimeCount});
  }
}

function finalizeState(storageData) {
  const date = new Date();
  if (!storageData.currentIsDesirable) {
    const timeCount = storageData.timeCount;
    const startTime = storageData.startTime;
    const weekId = getWeekId(date);
    const newTimeCount = timeCount;
    timeCount[weekId] += date.getTime() - startTime;
    chrome.storage.local.set(
        {currentIsDesirable: true, timeCount: newTimeCount});
    console.log('stopped counting.');
  }
}

function tabListener() {
  const updateWithTab = (tabData) => {
    const updateWithStorage = (storageData) => {
      updateState(tabData, storageData);
    }
    chrome.storage.local.get(updateWithStorage);
  }
  chrome.tabs.query({currentWindow: true, active: true}, updateWithTab);
}

function windowListener() {
  chrome.storage.local.get(finalizeState);
}

chrome.storage.local.get(initializeState);
chrome.tabs.onActivated.addListener(tabListener);
chrome.tabs.onUpdated.addListener(tabListener);
chrome.windows.onRemoved.addListener(windowListener)
