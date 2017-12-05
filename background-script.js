function initializeState(values) {
  browser.storage.local.set({
    currentIsDesirable: true,
    timeCount: 0,
    // TODO(kkleindev): nicer constant declaration.
    wage: values.wage ? values.wage : 10,
    // TODO(kkleindev): nicer constant declaration.
    websites: values.websites ? values.websites : "www.facebook.com"
  });
}

function updateState(values) {

  function isDesirable(url, websites) {
    const isWebsiteInUrl = (element) => url.includes(element);
    return !(websites.split(" ").some(isWebsiteInUrl));
  }

  const url = values[0][0].url;
  const currentIsDesirable = values[1].currentIsDesirable;
  const timeCount = values[1].timeCount;
  const startTime = values[1].startTime;
  const urlIsDesirable = isDesirable(url, values[1].websites);
  const date = new Date();
  if (currentIsDesirable && !urlIsDesirable) {
    browser.storage.local.set({currentIsDesirable: false,
        timeCount: timeCount, startTime: date.getTime()});
    console.log("Started wasting.");
  } else if (!currentIsDesirable && urlIsDesirable) {
    const newTimeCount = timeCount + date.getTime() - startTime;
    browser.storage.local.set(
        {currentIsDesirable: true, timeCount: newTimeCount});
    console.log("Time wasted: " + Math.round(newTimeCount / 60000 * 60));
  }
}

function tabListener() {
  const tabsPromise = browser.tabs.query({currentWindow: true, active: true});
  const storagePromise = browser.storage.local.get();
  Promise.all([tabsPromise, storagePromise]).then(updateState);
}

const storagePromise = browser.storage.local.get();
storagePromise.then(initializeState);
browser.tabs.onActivated.addListener(tabListener);
browser.tabs.onUpdated.addListener(tabListener);
