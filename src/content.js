// This is the content script for the webpage
console.log("GTM Check chrome extension is running!");

//! FIRST STEP
// Inform the background page that
// this tab should have a page-action.
// Use the chrome.runtime API to retrieve the background page, return details about the manifest, and listen for and respond to events in the app or extension lifecycle.
chrome.runtime.sendMessage({
  from: "content",
  subject: "showPageAction"
});

//! FOURTH STEP
//! message from popup asking for information
// Listen for messages from the popup.
// First, validate the message's structure.
// Collect the necessary data or DOM changes
//! FIFTH STEP
//! sending response back to popup
// Directly respond to the sender (popup),
// through the specified callback.
chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if (msg.from === "popup" && msg.subject === "DOMInfo") {
    var domInfo = {
      accountInfo: getAccount(),
      containers: getContainers()
    };
    response(domInfo);
  }
});

const getAccount = () => {
  let accountInfo = {};
  
  let tempA = document
  .querySelector('img[src*="crumb"]')
  if (!tempA){
    accountInfo.aId = 'No Feathr'
  } else {
  let tempAstr = tempA.src.split("a_id=")[1]
  .split("&")[0]
  accountInfo.aId = tempAstr
  }
  
  let tempF = document
  .querySelector('img[src*="crumb"]')
  if(!tempF){
    accountInfo.fId = 'No Feathr'
  } else {
  let tempFstr = tempF.src.split("f_id=")[1]
  .split("&")[0];
  accountInfo.fId = tempFstr
  }
  return accountInfo;
};

const getContainers = () => {
  let GTMContainers = [];
  var gtmCheck = document.querySelectorAll("script");
  for (var i = 0; i < gtmCheck.length; i++) {
    if (gtmCheck[i].src.includes("gtm.js")) {
      GTMContainers.push(gtmCheck[i].src.split("=")[1]);
    }
  }

  return GTMContainers;
};
