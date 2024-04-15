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
  console.log(tab);
  switch (data.menuItemId) {
    case 'single':
      singlePage();
      break;
    case 'region':
      selectRegion();
      break;
    default:
      console.log(data.menuItemId);
      break;
  }
 
    console.log("pressed");
}

// don't hard code name; need a settings page
function singlePage() {
  let currentDate = new Date();

  let date = (currentDate.getMonth() + 1) + 
    "-" + (currentDate.getDate()) + "-" + (currentDate.getFullYear()) 
      + " " + (currentDate.getHours() + "" + (currentDate.getMinutes())
      + "" + (currentDate.getSeconds()));
  console.log(date);
  chrome.tabs.captureVisibleTab(null, { format: "png" }, function(screenshotUrl) {
    chrome.downloads.download({filename: `screenshot ${date}.png`, url: screenshotUrl}, function(id){
      console.log("error" + id);
    });
});
}

// here send a message so we can tell the content script to draw the canvas 
function selectRegion() {
    

  // chrome.desktopCapture.chooseDesktopMedia(["tab"], tab, function(streamId) {
  //   if (streamId) {
  //     console.log("Success");
  //     // var video = document.createElement("video");
  //     // video.src = URL.createObjectURL(streamId);
  //     // video.play();
  
  //     // video.onloadedmetadata = function() {
  //     //   var canvas = document.createElement("canvas");
  //     //   canvas.width = video.videoWidth;
  //     //   canvas.height = video.videoHeight;
  //     //   canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
  
  //     //   var screenshotUrl = canvas.toDataURL("image/png");
  //     //   var image = new Image();
  //     //   image.src = screenshotUrl;
  //     //   document.body.appendChild(image);
  //     // };
  //   }
  // });
}
