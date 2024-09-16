let iframe;
let currentMessage;

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.parentNode.removeChild(sidebar);
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === 'SCAN-SELECTION') {
    currentMessage = message;

    if (iframe) {
      document.body.removeChild(iframe);
    }

    iframe = document.createElement('iframe');
    iframe.style.height = '100%';
    iframe.style.minWidth = '25%';
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.right = '0';
    iframe.style.zIndex = '2147483647';
    iframe.style.border = '0';
    iframe.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    iframe.src = chrome.runtime.getURL('popup.html');
    document.body.appendChild(iframe);
  }
});

window.addEventListener('message', (event) => {
  if (iframe && event.source === iframe.contentWindow) {
    if (event.data === 'CLOSE-SIDEBAR') {
      document.body.removeChild(iframe);
      iframe = null;
      window.removeEventListener('message', event);
    } else if (event.data === 'GET-SELECTION') {
      event.source.postMessage(currentMessage.selection, event.origin);
    }
  }
});
