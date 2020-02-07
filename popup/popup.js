const button = document.getElementById('popup-btn');
button.addEventListener('click',
    () => chrome.runtime.sendMessage(
        {'greeting': 'hello'}));
