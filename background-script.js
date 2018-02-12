// Important note: Time spent is currently attributed to the week in which the
// presence on a website ends, i.e. independent of in which week the activity
// started.

// Idle timetout in seconds.
const IDLE_TIMEOUT = 120;
const DEFAULT_WAGE = 10;
const DEFAULT_WEBSITES = ["www.facebook.com"];


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
  const weekId = Utils.getWeekId(date);
  const defaultTimeCount = {};
  defaultTimeCount[weekId] = 0;
  chrome.storage.local.set({
    currentIsDesirable: true,
    display: true,
    timeCount:
        storageData.timeCount ? storageData.timeCount : defaultTimeCount,
    wage: storageData.wage ? storageData.wage : DEFAULT_WAGE,
    websites: storageData.websites ?
        storageData.websites : ["www.facebook.com"]
  });
}

function setState(urlIsDesirable, storageData) {
  const soFarIsDesirable = storageData.currentIsDesirable;
  const timeCount = storageData.timeCount;
  const startTime = storageData.startTime;
  const date = new Date();
  if (soFarIsDesirable && !urlIsDesirable) {
    chrome.storage.local.set(
        {currentIsDesirable: false, startTime: date.getTime()});
  } else if (!soFarIsDesirable && urlIsDesirable) {
    const weekId = Utils.getWeekId(date);
    const newTimeCount = timeCount;
    if (!newTimeCount[weekId]) {
      newTimeCount[weekId] = 0;
    }
    newTimeCount[weekId] += date.getTime() - startTime;
    chrome.storage.local.set(
        {currentIsDesirable: true, timeCount: newTimeCount});
  }
}

function updateState(tabData, storageData) {
  function isDesirable(url, websites) {
    const isWebsiteInUrl = (element) => url.includes(element);
    return !(websites.some(isWebsiteInUrl));
  }
  const urlIsDesirable = isDesirable(tabData[0].url, storageData.websites);
  setState(urlIsDesirable, storageData);
}

function finalizeState(storageData) {
  // We observe that we find ourselves in the same situation as if the user had
  // switched to a desirable website.
  setState(true, storageData);
}

function tabChangeListener() {
  const updateWithTab = (tabData) => {
    const updateWithStorage = (storageData) => {
      updateState(tabData, storageData);
    }
    chrome.storage.local.get(updateWithStorage);
  }
  chrome.tabs.query({currentWindow: true, active: true}, updateWithTab);
}

function windowRemovalListener() {
  chrome.storage.local.get(finalizeState);
}

function idleListener(idleState) {
  if (idleState == 'idle' || idleState == 'locked') {
    chrome.storage.local.get(finalizeState);
  } else {
    // Returning to activity after idle phase.
    tabChangeListener();
  }
}

chrome.storage.local.get(initializeState);
chrome.tabs.onActivated.addListener(tabChangeListener);
chrome.tabs.onUpdated.addListener(tabChangeListener);
// In order for this callback to be executed with a single window remaining,
// the background permission has to be granted. This is currently not supported
// by firefox.
//chrome.windows.onRemoved.addListener(windowRemovalListener);
chrome.idle.setDetectionInterval(IDLE_TIMEOUT);
chrome.idle.onStateChanged.addListener(idleListener);
