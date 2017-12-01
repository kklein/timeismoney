function updateState(values) {

  function isDesirable(url, websites) {
    const foo = (element) => url.includes(element);
    return !(websites.split(" ").some(foo));
  }

  const url = values[0][0].url;
  const currentIsDesirable = values[1].currentIsDesirable;
  const timeCount = values[1].timeCount;
  const startTime = values[1].startTime;
  const urlIsDesirable = isDesirable(url, values[1].websites);
  if (currentIsDesirable == "desirable" && !urlIsDesirable) {
    const d = new Date();
    browser.storage.local.set({currentIsDesirable: "undesirable",
        timeCount: timeCount, startTime: d.getTime()});
    console.log("Started wasting.");
  } else if (currentIsDesirable == "undesirable" && urlIsDesirable) {
    const d = new Date();
    const newTimeCount = timeCount + d.getTime() - startTime;
    browser.storage.local.set(
        {currentIsDesirable: "desirable", timeCount: newTimeCount});
    console.log("Time wasted: " + Math.round(newTimeCount / 60000 * 60));
  }
}

function listener() {
  const tabsPromise = browser.tabs.query({currentWindow: true, active: true});
  const storagePromise = browser.storage.local.get();
  Promise.all([tabsPromise, storagePromise]).then(updateState);
}

browser.storage.local.set({currentIsDesirable: "desirable", timeCount: 0});
browser.tabs.onActivated.addListener(listener);
browser.tabs.onUpdated.addListener(listener);
