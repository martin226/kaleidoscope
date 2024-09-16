(async () => {
  await chrome.contextMenus.removeAll();

  await chrome.contextMenus.create({
    id: 'scan',
    title: 'Scan',
    contexts: ['selection'],
  });

  function contextClick(info, tab) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'SCAN-SELECTION',
        selection: info.selectionText,
      });
    });
  }

  chrome.contextMenus.onClicked.addListener(contextClick);
})();
