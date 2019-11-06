// This is the content script for the webpage
console.log("GTM Check chrome extension is running!");

//! FIRST STEP
// Inform the background page that
// this tab should have a page-action.

chrome.runtime.sendMessage({
  from: "main",
  subject: "showPageAction"
});

//! FOURTH STEP
//! message from popup asking for information
// Listen for messages from the popup.
chrome.runtime.onMessage.addListener((msg, sender, response) => {
  // First, validate the message's structure.
  if (msg.from === "popup" && msg.subject === "DOMInfo") {
    // Collect the necessary data or DOM changes
    // var aId = document.querySelectorAll('img')[0].src.split('a_id=')[1].split('&')[0]
    // var fId = document.querySelectorAll('img')[0].src.split('f_id=')[1].split('&')[0]
    let GTMContainers = [];
    var gtmCheck = document.querySelectorAll("script");
    for (var i = 0; i < gtmCheck.length; i++) {
      if (gtmCheck[i].src.includes("gtm.js")) {
        GTMContainers.push(gtmCheck[i].src.split("=")[1]);
      }
    }
    const getAccount = () => {
      // var scripts = document.querySelectorAll("script");
      // for (var i = 0; i < scripts.length; i++) {
      //   if (scripts[i].outerHTML.includes("feathr(")) {
      //     var test = scripts[i].outerHTML
      //       .split('fly","')[1]
      //       .split('"')[0]
      //       .split('"')[0];
      //     return test;
      //   }
      // }
      var scripts = document.querySelectorAll("script");
      for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].innerText.includes("feathr(")) {
          return scripts[i].innerText.split('fly",')[1].split('"')[1];
        }
      }
    };
    console.log(getAccount());

    var domInfo = {
      aId: getAccount(),
      containers: GTMContainers
    };
    console.log(domInfo);
    //! FIFTH STEP
    //! sending response back to popup
    // Directly respond to the sender (popup),
    // through the specified callback.
    response(domInfo);
  }
});

// var test = document.querySelectorAll("img");
// for (var i = 0; i < test.length; i++) {
//   if (test[i].src.includes("polo")) {
//     console.log(test[i].src.split("a_id="[1]));
//   }
// }

// var scripts = document.querySelectorAll("script");
// for (var i = 0; i < scripts.length; i++) {
//   if (scripts[i].innerText.includes("feathr(")) {
//     console.log(scripts[i].innerText.split('fly",')[1].split('"')[1]);
//   }
// }
