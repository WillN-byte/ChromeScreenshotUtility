chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
    title: 'Take Screenshot',
    contexts: ['all'],
    id: 'Screenshot'
  });
});


chrome.contextMenus.onClicked.addListener(testClick);


function testClick(data, tab){
    console.log("pressed");
}
