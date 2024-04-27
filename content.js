// add function that creates the canvas
// the canvas needs to be created when paged region or region message is sent
// the only difference is that paged region uses the the entire documents height

function createCanvas(params) {
  const canvas = document.createElement("canvas");

  canvas.id = "my-canvas";
  canvas.width = params.width;

  if (params.isPaged && params.height < document.body.scrollHeight) {
    canvas.height = document.body.scrollHeight;
  } else {
    canvas.height = params.height;
  }

  canvas.style.top = "0px";
  canvas.style.position = "absolute";
  // so apperently stackoverflows topbar and left bar have a zindex that is greater than 999 so
  canvas.style.zIndex = 999999999999;
  canvas.setAttribute("data-html2canvas-ignore", "true");

  const body = document.getElementsByTagName("body")[0];
  body.appendChild(canvas);

  // sets the background color for canvas
  // to indicate to the user to select the region
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "rgba(250, 218, 221, 0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // do an if else statement for
  // paged region will just be a line that converts to a rectangle
  drawRegion(canvas, params.isPaged);
}

function drawRegion(canvas, isPaged) {
  let isdrawing = false;
  let ctx = canvas.getContext("2d");

  // this begins drawing the rectangle
  // sets the top left to x,y
  let x = 0;
  let y = 0;
  canvas.onmousedown = (e) => {
    x = e.offsetX;
    y = e.offsetY;
    isdrawing = true;
  };

  let rectWidth = 0;
  let rectHeight = 0;
  canvas.onmousemove = (e) => {
    if (isdrawing === true) {
      console.log(x);
      console.log(y);
      rectWidth = e.offsetX - x;
      rectHeight = e.offsetY - y;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(250, 218, 221, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeRect(x, y, rectWidth, rectHeight);

      console.log(`Rectangle is ${rectWidth} ${rectHeight}`);
    }
  };
  // mouse is no longer moving so this is the final
  canvas.onmouseup = (e) => {
    if (isdrawing === true) {
      //ctx.drawImage(canvas, x, y, rectWidth, rectHeight, 0, 0);
      html2canvas(document.body, {
        allowTaint: true,
        foreignObjectRendering: true,
      }).then(function (cropCanvas) {
        let destCanvas = document.createElement("canvas");
        destCanvas.width = rectWidth;
        destCanvas.height = rectHeight;
        destCanvas.getContext("2d").drawImage(
          cropCanvas,
          x,
          y,
          rectWidth,
          rectHeight, // source rect with content to crop
          0,
          0,
          rectWidth,
          rectHeight
        );
        console.log(x);
        console.log(y);
        let dataURL = destCanvas.toDataURL("image/png", 1.0);
        chrome.runtime.sendMessage({ dataUrl: dataURL });
        console.log(dataURL);
        return true;
      });
      canvas.parentNode.removeChild(canvas);
      isdrawing = false; // leave immideately
    }
  };
  return true;
}

// in the listener draw the canvas?
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if ((param = request.createCanvas)) {
    // Your canvas creation logic here
    // Assuming canvas creation is successful

    createCanvas(param);
    //response should be the image?
    sendResponse({ message: "success" });
  }
  if (request.capturePageContent) {
    capturePageContent();
    sendResponse({ message: "success2" });
  }
  return true;
});

// Capture the entire page content
function capturePageContent() {
  // Create a canvas to capture the entire page
  let canvas = document.createElement("canvas");
  canvas.width = document.body.scrollWidth;
  canvas.height = document.body.scrollHeight;

  html2canvas(document.body, {
    allowTaint: true,
    foreignObjectRendering: true,
    useCors: true,
  }).then(function (canvas) {
    let dataURL = canvas.toDataURL("image/png", 1.0);
    chrome.runtime.sendMessage({ dataUrl: dataURL });
    console.log(dataURL);
    return true;
  });

  // Draw the entire page onto the canvas
  //ctx.drawWindow(window, 0, 0, canvas.width, canvas.height, "rgb(255,255,255)");

  // Convert the canvas content to a data URL

  // Send the captured data URL back to the background script
  // chrome.runtime.sendMessage({ dataUrl: dataUrl });
}
