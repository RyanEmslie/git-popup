console.log("This is Popup.js");
// let domInfo;
//! Third step
//! When DOM of popup is loaded a message is sent to
//! content script asking for information.
// Once the DOM is ready...
// ...query for the active tab...
// ...and send a request for the DOM info...
// ...also specifying a callback to be called
//    from the receiving end (content script).
window.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true
    },
    tabs => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { from: "popup", subject: "DOMInfo" },
        setDOMInfo
      );
    }
  );
});

// Update the relevant fields with the new data.
const setDOMInfo = info => {
  if (info.accountInfo.length > 1) {
    document.getElementById("feathrWarningMessage").innerText =
      "**WARNING** Multiple Feathr Super Pixels Detected";
  }
  if (info.containers.length > 1) {
    document.getElementById("gtmWarningMessage").innerText =
      "**WARNING** Multiple GTM Containers Detected";
  }

  // ACCOUNT
  if (info.accountInfo[0] !== "No Feathr Super Pixel Detected") {
    for (var i = 0; i < info.accountInfo.length; i++) {
      let doc = new DOMParser().parseFromString(
        '<table class="table table-sm text-center secondaryColor1"><tbody><tr class="table-info"><td></td><td id="aId">' +
          info.accountInfo[i] +
          '</td><td style="width:50px"><form><button name="accountCopy" data="' +
          info.accountInfo[i] +
          '"><i name="accountCopy" data="' +
          info.accountInfo[i] +
          '" class="far fa-copy"></i></button></form></td><td style="width:50px"><form><button name="accountLink" data="' +
          info.accountInfo[i] +
          '"><i name="accountLink" data="' +
          info.accountInfo[i] +
          '"class="fas fa-external-link-alt"></i></button></form></td></tr></tbody></table>',
        "text/html"
      );
      let div = doc.body.firstChild;
      document.getElementById("accountContainers").appendChild(div);
    }
  } else {
    let doc = new DOMParser().parseFromString(
      '<table class="table table-sm text-center table-danger"><tbody><tr><td>' +
        info.accountInfo[0] +
        "</td></tr></tbody></table>",
      "text/html"
    );
    let div = doc.body.firstChild;
    document.getElementById("accountContainers").appendChild(div);
  }
  // CONTAINERS
  if (info.containers[0] !== "No GTM Containers Detected") {
    for (var i = 0; i < info.containers.length; i++) {
      let doc = new DOMParser().parseFromString(
        '<table class="table table-sm text-center secondaryColor1"><tbody><tr class="table-success"><td>' +
          info.containers[i] +
          '</td><td style="width:50px"><form><button data="' +
          info.containers[i] +
          '"name="gtmCopy" ><i data="' +
          info.containers[i] +
          '" name="gtmCopy" class="far fa-copy"></i></button></form></td><td style="width:50px"><form><button name="linkGTM"><i name="linkGTM"class="fas fa-external-link-alt"></i></button></form></td></tr></tbody></table>',
        "text/html"
      );
      let div = doc.body.firstChild;
      document.getElementById("gtmContainers").appendChild(div);
    }
  } else {
    let doc = new DOMParser().parseFromString(
      '<table class="table table-sm text-center table-danger"><tbody><tr><td>' +
        info.containers[0] +
        "</td></tr></tbody></table>",
      "text/html"
    );
    let div = doc.body.firstChild;
    document.getElementById("gtmContainers").appendChild(div);
  }
};

// Event listener for clicks on HTML elements to copy text to clipboard
document.addEventListener("click", e => {
  e.preventDefault();
  console.log(e);
  try{
  if (e.target.attributes[0].textContent == "accountCopy") {
    copyClick(e.target.attributes[1].textContent);
  } else if (e.target.attributes[0].textContent == "accountLink") {
    window.open(
      `https://glassbox.feathr.app/accounts/${e.target.attributes[1].textContent}/#users`
    );
    sendMessage("Link Opened in New Tab", 15000);
  } else if (e.target.attributes[0].textContent == "linkGTM") {
    window.open(`https://tagmanager.google.com/`);
    sendMessage("Link Opened in New Tab", 15000);
  } else if (e.target.attributes[1].textContent == "gtmCopy") {
    copyClick(e.target.attributes[0].textContent);
  } 
} catch(err){}
});

// Creates a temporary text node with text to be copied
// Selects text, copies text to clipboard, deletes temp text node
const copyClick = textToCopy => {
  var myTemporaryInputElement = document.createElement("input");
  myTemporaryInputElement.type = "text";
  myTemporaryInputElement.value = textToCopy;
  document.body.appendChild(myTemporaryInputElement);
  myTemporaryInputElement.select();
  document.execCommand("Copy");
  document.body.removeChild(myTemporaryInputElement);
  sendMessage("Copied to Clipboard");
};

// Displayes Messages on the bottom of popup html
const sendMessage = message => {
  document.getElementById("message").innerText = message;
  setTimeout(function() {
    document.getElementById("message").innerText = " ";
  }, 1500);
};
