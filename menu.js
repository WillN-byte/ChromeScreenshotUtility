chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
    title: 'Take Screenshot',
    contexts: ['all'],
    id: 'Screenshot'
  });
});


chrome.contextMenus.onClicked.addListener(testClick);


function testClick(data, tab){
  console.log(data);
  chrome.tabs.captureVisibleTab(null, { format: "jpeg", quality: 100 }, function(screenshotUrl) {
    chrome.downloads.download({filename: "test.jpeg", url: screenshotUrl}, function(id){
      console.log("error" + id);
    });
    console.log("ran here");
    // console.log(screenshotUrl);
  // var image = new Image();
  // image.src = screenshotUrl;
  // document.body.appendChild(image);
});
    console.log("pressed");
}
