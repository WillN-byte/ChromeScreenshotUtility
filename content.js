
// this function creates the canvas 
// and adds it to the DOM
function createCanvas(params) {
  // create it and set up the canvas on the webpage
  const canvas = document.createElement("canvas");
  canvas.id = "my-canvas";
  canvas.width = params.width;

    // ensure canvas is covering the entire website even parts
    // we are not able to see
    canvas.height = document.body.scrollHeight;

  // add the canvas over every element in the website
  // this prevents the user from interacting with the website
  canvas.style.top = "0px";
  canvas.style.position = "absolute";
  // so apperently stackoverflows topbar and left bar have a zindex that is greater than 999 so
  canvas.style.zIndex = 999999999999;
  canvas.setAttribute("data-html2canvas-ignore", "true");

  // add it to the website
  const body = document.getElementsByTagName("body")[0];
  body.appendChild(canvas);

  // sets the background color for canvas
  // to indicate to the user to select the region
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "rgba(250, 218, 221, 0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // canvas is now available
  // this allows the user to select a 
  // rectangular region for the screenshot
  drawRegion(canvas, params.isPaged);
}

// might run into an issue if we draw from the right
// allow the user to select the region
function drawRegion(canvas, isPaged) {
  let isdrawing = false;
  let ctx = canvas.getContext("2d");

  // this begins drawing the rectangle
  // sets the top left to x,y
  let x = 0;
  let y = 0;
  // the x,y coordinates become the rectangles
  // top left coordinates  
  canvas.onmousedown = (e) => {
    x = e.offsetX;
    y = e.offsetY;
    isdrawing = true;
  };

  // actually draw a rectangle
  let rectWidth = 0;
  let rectHeight = 0;
  canvas.onmousemove = (e) => {
    if (isdrawing === true) {
      console.log(x);
      console.log(y);
      // calculate the coordinates 
      rectWidth = e.offsetX - x;
      rectHeight = e.offsetY - y;

      // clear old rectangle 
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // refill the canvas
      ctx.fillStyle = "rgba(250, 218, 221, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // draw the new rectangle with the calculated width and height
      ctx.strokeRect(x, y, rectWidth, rectHeight);

      console.log(`Rectangle is ${rectWidth} ${rectHeight}`);
    }
  };

  // mouse is no longer moving so this is the final rectangle 
  canvas.onmouseup = (_) => {
    if (isdrawing === true) {
     
      // retrieve the content
      // and add special parameters
      html2canvas(document.body, {
        allowTaint: true,
        foreignObjectRendering: true,
      }).then(function (cropCanvas) {
        // create another canvas to extract
        // use the calulated values for the region
        // content from the main canvas
        let destCanvas = document.createElement("canvas");
        destCanvas.width = rectWidth;
        destCanvas.height = isPaged ? canvas.height : rectHeight;
        destCanvas.getContext("2d").drawImage(
          cropCanvas,
          x,
          (isPaged) ? 0 : y,
          rectWidth,
          (isPaged) ? canvas.height: rectHeight, 
          0,
          0,
          rectWidth,
          (isPaged) ? canvas.height : rectHeight
        );

        // ispaged is used to ensure we are taking a proper screenshot of the user specified region
        console.log(x);
        console.log(y);
        let dataURL = destCanvas.toDataURL("image/png", 1.0);
        // send to script to download the file
        chrome.runtime.sendMessage({ dataUrl: dataURL });
        console.log(dataURL);
        return true;
      });
      // remove the canvas
      // so the user can interact with the webpage
      canvas.parentNode.removeChild(canvas);
      isdrawing = false; // leave immideately
    }
  };
  return true;
}

// listen for specific messages
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if ((param = request.createCanvas)) {

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
};
