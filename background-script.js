function initializeState(storageData) {
  chrome.storage.local.set({
    currentIsDesirable: true,
    timeCount: storageData.timeCount ? storageData.timeCount : 0,
    // TODO(kkleindev): nicer constant declaration.
    wage: storageData.wage ? storageData.wage : 10,
    // TODO(kkleindev): nicer constant declaration.
    websites: storageData.websites ? storageData.websites : "www.facebook.com"
  });
}

function updateState(tabData, storageData) {
  function isDesirable(url, websites) {
    const isWebsiteInUrl = (element) => url.includes(element);
    return !(websites.split(" ").some(isWebsiteInUrl));
  }
  const url = tabData[0].url;
  const currentIsDesirable = storageData.currentIsDesirable;
  const timeCount = storageData.timeCount;
  const startTime = storageData.startTime;
  const urlIsDesirable = isDesirable(url, storageData.websites);
  const date = new Date();
  if (currentIsDesirable && !urlIsDesirable) {
    chrome.storage.local.set({currentIsDesirable: false,
        timeCount: timeCount, startTime: date.getTime()});
  } else if (!currentIsDesirable && urlIsDesirable) {
    const newTimeCount = timeCount + date.getTime() - startTime;
    chrome.storage.local.set(
        {currentIsDesirable: true, timeCount: newTimeCount});
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

chrome.storage.local.get(initializeState);
chrome.tabs.onActivated.addListener(tabListener);
chrome.tabs.onUpdated.addListener(tabListener);
