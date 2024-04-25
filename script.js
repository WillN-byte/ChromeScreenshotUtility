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

chrome.contextMenus.onClicked.addListener(testClick);

function testClick(data, tab) {
  console.log(tab);
  switch (data.menuItemId) {
    case "visible":
      visiblePage();
      break;
    case "paged":
      captureAndStitch();
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

// don't hard code name; need a settings page
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

function wholePage() {
  chrome.tabs.captureVisibleTab(null, { format: "png" }, function (dataUrl) {
    var canvas = this.createElement("canvas");
    canvas.width = img.width;
    canvas.height = this.body.scrollHeight;
    var ctx = canvas.getContext("2d");
    var img = document.createElement("img");
    img.src = dataUrl;
    img.onload = function () {
      ctx.drawImage(img, 0, 0, img.width, img.height);
      chrome.tabs.executeScript(
        null,
        { code: "window.scrollTo(0, document.body.scrollHeight)" },
        function () {
          setTimeout(function () {
            chrome.tabs.captureVisibleTab(
              null,
              { format: "png" },
              function (dataUrl) {
                var img2 = new document.createElement("img");
                img2.src = dataUrl;
                img2.onload = function () {
                  ctx.drawImage(img2, 0, img.height, img2.width, img2.height);
                  var finalDataUrl = canvas.toDataURL("image/png");
                  // Use finalDataUrl as needed
                  console.log(finalDataUrl);
                };
              }
            );
          }, 500);
        }
      );
    };
  });
}

// seems to not work on chrome:// sites
// here send a message so we can tell the content script to draw the canvas
function selectRegion(tab, paged) {
  chrome.tabs.sendMessage(
    tab.id,
    {
      createCanvas: { width: tab.width, height: tab.height, isPaged: paged },
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

function captureAndStitch() {
  chrome.tabs.captureVisibleTab(
    null,
    { format: "png" },
    function (firstDataUrl) {
      var img = new Image();
      img.src = firstDataUrl;
      img.onload = function () {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = document.body.scrollHeight;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // Function to capture and stitch additional screenshots
        function captureAndStitchRecursive(scrollPosition) {
          chrome.tabs.executeScript(
            null,
            { code: "window.scrollTo(0, " + scrollPosition + ")" },
            function () {
              setTimeout(function () {
                chrome.tabs.captureVisibleTab(
                  null,
                  { format: "png" },
                  function (dataUrl) {
                    var img = new Image();
                    img.src = dataUrl;
                    img.onload = function () {
                      ctx.drawImage(
                        img,
                        0,
                        scrollPosition,
                        img.width,
                        img.height
                      );
                      if (scrollPosition < document.body.scrollHeight) {
                        captureAndStitchRecursive(scrollPosition + img.height);
                      } else {
                        var finalDataUrl = canvas.toDataURL("image/png");
                        // Download the stitched image
                        chrome.downloads.download(
                          { filename: "stitched_image.png", url: finalDataUrl },
                          function (downloadId) {
                            if (chrome.runtime.lastError) {
                              console.error(
                                "Error downloading image:",
                                chrome.runtime.lastError.message
                              );
                            } else {
                              console.log(
                                "Image downloaded successfully with ID:",
                                downloadId
                              );
                            }
                          }
                        );
                      }
                    };
                  }
                );
              }, 500);
            }
          );
        }

        // Start capturing and stitching additional screenshots
        captureAndStitchRecursive(img.height);
      };
    }
  );
}
