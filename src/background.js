// loads when the browser loads
console.log('background.js');

//! SECOND STEP 
// Message received from main script
// When message is received a page-action is sent to the tab
chrome.runtime.onMessage.addListener((msg, sender) => {
    // First, validate the message's structure.
    if ((msg.from === 'main') && (msg.subject === 'showPageAction')) {
      // Enable the page-action for the requesting tab.
      chrome.pageAction.show(sender.tab.id);
    }
  });