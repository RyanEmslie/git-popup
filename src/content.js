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

const getContainers = () => {
  var [...gtmCheck] = document.querySelectorAll("script");
  var containers = gtmCheck
    .filter(gtm => gtm.src.includes("GTM"))
    .map(gtm => {
      return gtm.src.split("=")[1];
    });
  if (containers.length == 0) {
    return ["No GTM Containers Detected"];
  } else {
    return containers;
  }
};

const getAccount = () => {
  const [...accounts] = document.querySelectorAll('img[src*="crumb"]');
  if (accounts.length == 0) {
    return ["No Feathr Super Pixel Detected"];
  } else {
    const feathrAccounts = accounts.map(account => {
      return account.src.split("a_id=")[1].split("&")[0];
    });
    let unique = new Set(feathrAccounts);
    return [...unique];
  }
};
