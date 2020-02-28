// Important note: Time spent is currently attributed to the week in which the
// presence on a website ends, i.e. independent of in which week the activity
// started.

// Idle timetout in seconds.
const DEFAULT_TIMEOUT = 6*60;
const SPINNING_PERIOD = 1000;
const DEFAULT_WAGE = 10;
const DEFAULT_WEBSITES = ['facebook.com', 'youtube.com', 'reddit.com'];

function initializeState(storageData) {
  const date = new Date();
  const weekId = Utils.getWeekId(date);
  const timeout = storageData.timeout ? storageData.timeout : DEFAULT_TIMEOUT;
  const defaultTimeCount = {};
  defaultTimeCount[weekId] = 0;
  chrome.storage.local.set({
    currentIsDesirable: true,
    display: true,
    active: true,
    timeCount:
        storageData.timeCount ? storageData.timeCount : defaultTimeCount,
    wage: storageData.wage ? storageData.wage : DEFAULT_WAGE,
    timeout: timeout,
    websites: storageData.websites ?
        storageData.websites : DEFAULT_WEBSITES,
  });
  chrome.idle.setDetectionInterval(timeout);
}

function updateDesirability(newUrl, storageData) {
  if (!storageData.websites || storageData.websites.length == 0) {
    return;
  }
  const urlIsDesirable = Utils.isDesirable(newUrl, storageData.websites);
  const soFarIsDesirable = storageData.currentIsDesirable;
  if (soFarIsDesirable && !urlIsDesirable) {
    chrome.storage.local.set({currentIsDesirable: false});
  } else if (!soFarIsDesirable && urlIsDesirable) {
    chrome.storage.local.set({currentIsDesirable: true});
  }
}

// This event only provides information about tabids. We need to explicitly
// query data on the url of the activated tab.
function tabActivatedListener() {
  const updateWithTab = (tabs) => {
    if (!tabs || !tabs[0] || !tabs[0].url) {
      return;
    }
    const startDesirabilityUpdate = (storageData) => {
      updateDesirability(tabs[0].url, storageData);
    };
    chrome.storage.local.get(startDesirabilityUpdate);
  };
  chrome.tabs.query({currentWindow: true, active: true}, updateWithTab);
}

function tabUpdatedListener(tabId, changeInfo, tab) {
  if (!tab || !tab.url) {
    return;
  }
  const startDesirabilityUpdate = (storageData) => {
    updateDesirability(tab.url, storageData);
  };
  chrome.storage.local.get(startDesirabilityUpdate);
}

function idleListener(idleState) {
  if (idleState == 'idle' || idleState == 'locked') {
    chrome.storage.local.set({active: false});
  } else {
    // Returning to activiy after idle phase.
    chrome.storage.local.set({active: true});
  }
}

chrome.storage.local.get(initializeState);
chrome.tabs.onActivated.addListener(tabActivatedListener);
chrome.tabs.onUpdated.addListener(tabUpdatedListener);
chrome.idle.onStateChanged.addListener(idleListener);

function updateCount(storageData) {
  if (storageData.currentIsDesirable || !storageData.active) {
    return;
  }
  const weekId = Utils.getWeekId(new Date());
  const timeCount = storageData.timeCount;
  let wastedTime = timeCount[weekId] ? timeCount[weekId] : 0;
  wastedTime += SPINNING_PERIOD;
  const newTimeCount = Object.assign({}, storageData.timeCount);
  newTimeCount[weekId] = wastedTime;
  chrome.storage.local.set({timeCount: newTimeCount});
}

setInterval(() => chrome.storage.local.get(updateCount),
    SPINNING_PERIOD);
