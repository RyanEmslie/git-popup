console.log("This is Popup.js");
let domInfo;
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
  console.log(info);  
  console.log(info.accountInfo.length)
  console.log(info.accountInfo['aId'])
  if (info.containers.length > 1){
    document.getElementById('gtmWarningMessage').innerText ='**WARNING** Multiple GTM Containers Detected'
  }
  
  if ( info.numberPixels > 1 ){
    document.getElementById('feathrWarningMessage').innerText ='**WARNING** Multiple Feathr Super Pixels Detected'
  }
  
  domInfo = info;
  if (info.containers.length > 0) {
    for (var i = 0; i < info.containers.length; i++) {
      let doc = new DOMParser().parseFromString('<table class="table table-sm text-center secondaryColor1"><tbody><tr><td>' + info.containers[i] + '</td><td style="width:50px"><form><button data="'+ info.containers[i] +'"name="gtmCopy" ><i data="'+ info.containers[i] +'" name="gtmCopy" class="far fa-copy"></i></button></form></td><td style="width:50px"><form><button name="linkGTM"><i name="linkGTM"class="fas fa-external-link-alt"></i></button></form></td></tr></tbody></table>', 'text/html');
      let div = doc.body.firstChild;
      document.getElementById("gtmContainers").appendChild(div)
    }
  } else if (info.containers.length == 0){
    let doc = new DOMParser().parseFromString('<table class="table table-sm text-center table-danger"><tbody><tr><td>No GTM Containers Detected</td></tr></tbody></table>', 'text/html');
      let div = doc.body.firstChild;
      document.getElementById("gtmContainers").appendChild(div)
  }
  // ACCOUNT
  if (info.accountInfo['aId'] != 'No Feathr') {
      let doc = new DOMParser().parseFromString('<table class="table table-sm text-center secondaryColor1"><tbody><tr><td></td><td id="aId">' + info.accountInfo['aId'] + '</td><td style="width:50px"><form><button name="accountCopy"><i name="accountCopy" class="far fa-copy"></i></button></form></td><td style="width:50px"><form><button name="accountLink"><i name="accountLink"class="fas fa-external-link-alt"></i></button></form></td></tr></tbody></table>', 'text/html');
      let div = doc.body.firstChild;
      document.getElementById("accountContainers").appendChild(div)
  } else {
    let doc = new DOMParser().parseFromString('<table class="table table-sm text-center table-danger"><tbody><tr><td>No Feathr Account Detected</td></tr></tbody></table>', 'text/html');
      let div = doc.body.firstChild;
      document.getElementById("accountContainers").appendChild(div)
  }
}

// Event listener for clicks on HTML elements to copy text to clipboard
document.addEventListener("click", (e) => {
  e.preventDefault()
  console.log(e);
  if (e.target.attributes[0].textContent == 'accountCopy'){
    copyClick(domInfo.accountInfo.aId)
  }
  else if (e.target.attributes[0].textContent == 'accountLink') {
    window.open(`https://blackbox.feathr.co/v1/admin/accounts/${domInfo.accountInfo.aId}`)
    sendMessage('Link Opened in New Tab', 15000)
  } 
  else if (e.target.attributes[0].textContent == 'linkGTM') {
    window.open(`https://tagmanager.google.com/`)
    sendMessage('Link Opened in New Tab', 15000)
  } 
  else if (e.target.attributes[1].textContent == 'gtmCopy'){
    copyClick(e.target.attributes[0].textContent)
  }
});

const copyClick = (textToCopy) =>{
  var myTemporaryInputElement = document.createElement("input");
  myTemporaryInputElement.type = "text";
  myTemporaryInputElement.value = textToCopy;
  document.body.appendChild(myTemporaryInputElement);
  myTemporaryInputElement.select();
  document.execCommand("Copy");
  document.body.removeChild(myTemporaryInputElement);
  sendMessage('Copied to Clipboard')
}

const sendMessage = (message) =>{
  document.getElementById('message').innerText = message
  setTimeout(function(){ document.getElementById('message').innerText = ' ' }, 1500);
}
