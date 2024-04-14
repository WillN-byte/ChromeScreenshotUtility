chrome.runtime.onInstalled.addListener(function () {
    let root = chrome.contextMenus.create({
    title: 'Take Screenshot',
    contexts: ['all'],
    id: 'screenshot'
  });

  chrome.contextMenus.create({
    title: 'Single Webpage',
    contexts: ['all'],
    id: 'single',
    parentId: root,
  });

  chrome.contextMenus.create({
    title: 'Paged Webpage',
    contexts: ['all'],
    id: 'paged',
    parentId: root,
  });

  chrome.contextMenus.create({
    title: 'Region',
    contexts: ['all'],
    id: 'region',
    parentId: root,
  });

  chrome.contextMenus.create({
    title: 'Paged Region',
    contexts: ['all'],
    id: 'regionPaged',
    parentId: root,
  });

});


chrome.contextMenus.onClicked.addListener(testClick);


function testClick(data, tab){

  switch (data.menuItemId) {
    case 'single':
      singlePage();
      break;
    case 'region':
      selectRegion(tab);
      break;
    default:
      console.log(data.menuItemId);
      break;
  }
 
    console.log("pressed");
}

// don't hard code name; need a settings page
function singlePage() {
  chrome.tabs.captureVisibleTab(null, { format: "jpeg", quality: 100 }, function(screenshotUrl) {
    chrome.downloads.download({filename: "test.jpeg", url: screenshotUrl}, function(id){
      console.log("error" + id);
    });
});
}

function selectRegion(tab) {
  // chrome.desktopCapture.chooseDesktopMedia(["tab"], null, function(streamId) {
  //   if (streamId) {
  //     console.log("Success");
  //     var video = document.createElement("video");
  //     video.src = URL.createObjectURL(streamId);
  //     video.play();
  
  //     video.onloadedmetadata = function() {
  //       var canvas = document.createElement("canvas");
  //       canvas.width = video.videoWidth;
  //       canvas.height = video.videoHeight;
  //       canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
  
  //       var screenshotUrl = canvas.toDataURL("image/png");
  //       var image = new Image();
  //       image.src = screenshotUrl;
  //       document.body.appendChild(image);
  //     };
  //   }
  // });
}
