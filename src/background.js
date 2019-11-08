// loads when the browser loads
console.log('background.js');

//! SECOND STEP 
// Message received from content script
// When message is received a page-action is sent to the tab
// First, validate the message's structure.
// Enable the page-action for the requesting tab.
// Currently the pageAction.show matches <all urls>
chrome.runtime.onMessage.addListener((msg, sender) => {
    if ((msg.from === 'content') && (msg.subject === 'showPageAction')) {
      chrome.pageAction.show(sender.tab.id);
    }
  });