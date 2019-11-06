console.log("This is Popup.js");

//! Third step
//! When DOM of popup is loaded a message is sent to
//! content script asking for information.
// Once the DOM is ready...
window.addEventListener("DOMContentLoaded", () => {
  // ...query for the active tab...
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true
    },
    tabs => {
      // ...and send a request for the DOM info...
      chrome.tabs.sendMessage(
        tabs[0].id,
        { from: "popup", subject: "DOMInfo" },
        // ...also specifying a callback to be called
        //    from the receiving end (content script).
        setDOMInfo
      );
    }
  );
});

// Update the relevant fields with the new data.
const setDOMInfo = info => {
  console.log(info)
  let gtmContArr = info.containers;
  document.getElementById('aId').innerText = info.aId
  // document.getElementById('fId').innerText = info.fId
  if (gtmContArr.length > 0) {
    for (var i = 0; i < gtmContArr.length; i++) {
      var node = document.createElement("A");
      node.setAttribute(
        "class",
        "list-group-item list-group-item-action list-group-item-success"
      );
      node.setAttribute("href", "#");
      var textnode = document.createTextNode(gtmContArr[i]);
      node.appendChild(textnode);
      document.getElementById("listGroup").appendChild(node);
    }
  } else {
    var node = document.createElement("A");
    node.setAttribute(
      "class",
      "list-group-item list-group-item-action list-group-item-danger"
    );
    node.setAttribute("href", "#");
    var textnode = document.createTextNode("No GTM container detected");
    node.appendChild(textnode);
    document.getElementById("listGroup").appendChild(node);
  }
};

document.getElementById("listGroup").addEventListener("click", e => {
  var textToCopy = e.target.innerText;

  var myTemporaryInputElement = document.createElement("input");
  myTemporaryInputElement.type = "text";
  myTemporaryInputElement.value = textToCopy;

  document.body.appendChild(myTemporaryInputElement);

  myTemporaryInputElement.select();
  document.execCommand("Copy");

  document.body.removeChild(myTemporaryInputElement);

  $(".toast").toast("show");
});
