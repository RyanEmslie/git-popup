console.log("This is Popup.js");

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
  if (info.containers.length > 0) {
    for (var i = 0; i < info.containers.length; i++) {
      let doc = new DOMParser().parseFromString('<table class="table table-sm text-center"><tbody><tr><td class="table-success">' +               info.containers[i] + '</td><td class="table-success"><i class="far fa-copy"></i></td></tr></tbody></table>', 'text/html');
      let div = doc.body.firstChild;
      document.getElementById("gtmContainers").appendChild(div)
    }
  } else if (info.containers.length == 0){
    let doc = new DOMParser().parseFromString('<table class="table table-sm text-center"><tbody><tr><td class="table-danger">No GTM containers detected</td></tr></tbody></table>', 'text/html');
      let div = doc.body.firstChild;
      document.getElementById("gtmContainers").appendChild(div)
  }
  document.getElementById('aId').textContent = info.accountInfo.aId
  document.getElementById('fId').textContent = info.accountInfo.fId
};


// Create GTM container elements


// Event listener for clicks on HTML elements to copy text to clipboard
document.addEventListener("click", e => {
  console.log(e)
  if (e.target.className == 'far fa-copy'){
  var textToCopy = e.target.parentElement.previousElementSibling.innerText;

  var myTemporaryInputElement = document.createElement("input");
  myTemporaryInputElement.type = "text";
  myTemporaryInputElement.value = textToCopy;

  document.body.appendChild(myTemporaryInputElement);

  myTemporaryInputElement.select();
  document.execCommand("Copy");

  document.body.removeChild(myTemporaryInputElement);
  console.log('Copied to Clipboard')
  } else {
    console.log(e.srcElement.className)
  }
  
  // if (e.srcElement.tagName == 'I'){console.log('I am the icon');
  // } else {console.log(e.srcElement.className)}
  
  

  // $(".toast").toast("show");
});
