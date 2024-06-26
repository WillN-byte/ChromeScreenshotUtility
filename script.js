// creates the right click menu items once 
chrome.runtime.onInstalled.addListener(function () {
  let root = chrome.contextMenus.create({
    title: "Take Screenshot",
    contexts: ["all"],
    id: "screenshot",
  });

  chrome.contextMenus.create({
    title: "Visible Webpage",
    contexts: ["all"],
    id: "visible",
    parentId: root,
  });

  chrome.contextMenus.create({
    title: "Paged Webpage",
    contexts: ["all"],
    id: "paged",
    parentId: root,
  });

  chrome.contextMenus.create({
    title: "Region",
    contexts: ["all"],
    id: "region",
    parentId: root,
  });

  chrome.contextMenus.create({
    title: "Paged Region",
    contexts: ["all"],
    id: "regionPaged",
    parentId: root,
  });
});

chrome.contextMenus.onClicked.addListener(menuClickListener);

function menuClickListener(data, tab) {
  console.log(tab);
  switch (data.menuItemId) {
    case "visible":
      visiblePage();
      break;
    case "paged":
      capturePage(tab);
      break;
    case "regionPaged":
      selectRegion(tab, true);
      break;
    case "region":
      selectRegion(tab, false);
      break;
    default:
      console.log(data.menuItemId);
      break;
  }

  console.log("pressed");
}

// generate a unique timestamp for the images
function getFileStamp() {
  let currentDate = new Date();
  let date =
    currentDate.getMonth() +
    1 +
    "-" +
    currentDate.getDate() +
    "-" +
    currentDate.getFullYear() +
    " " +
    (currentDate.getHours() +
      "" +
      currentDate.getMinutes() +
      "" +
      currentDate.getSeconds());
  console.log(date);
  return `screenshot ${date}.png`;
}

// we can only capture the current tab
// bc chrome provides an api for it
function visiblePage() {
  chrome.tabs.captureVisibleTab(
    null,
    { format: "png" },
    function (screenshotUrl) {
      chrome.downloads.download(
        { filename: getFileStamp(), url: screenshotUrl },
        function (id) {
          console.log("error" + id);
        }
      );
    }
  );
}


// Function to send a message to the content script
// this will take a paged screenshot
function capturePage(tab) {
  chrome.tabs.sendMessage(
    tab.id,
    {
      capturePageContent: {},
    },
    (response) => {
      if (response && response.message === "success2") {
        console.log("Success Canvas was created");
      } else {
        console.log("Something went wrong");
      }
    }
  );
}

// seems to not work on chrome:// sites
// here send a message so we can tell the content script to draw the canvas
function selectRegion(tab, paged) {
  chrome.tabs.sendMessage(
    tab.id,
    {
      createCanvas: { width: tab.width, isPaged: paged },
    },
    (response) => {
      if (response && response.message === "success") {
        console.log("Success Canvas was created");
      } else {
        console.log("Something went wrong");
      }
    }
  );
}


// Listen for messages from the content script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message && message.dataUrl) {
    // Handle the captured data URL
    let dataUrl = message.dataUrl;
    // Process or save the captured data as needed
    // For example, initiate a download of the captured image
    chrome.downloads.download(
      { filename: getFileStamp(), url: dataUrl },
      function (downloadId) {
        if (chrome.runtime.lastError) {
          console.error(
            "Error downloading image:",
            chrome.runtime.lastError.message
          );
        } else {
          console.log("Image downloaded successfully with ID:", downloadId);
        }
      }
    );
  }
});
