console.log("Content Script ran");

// need to send recieve a message to put the canvas on screen

// add function that creates the canvas
// the canvas needs to be created when paged region or region message is sent
// the only difference is that paged region uses the the entire documents height

function createCanvas(width, height) {
  const canvas = document.createElement("canvas");

  canvas.id = "my-canvas";
  canvas.width = width;
  canvas.height = height === null ? document.body.scrollHeight : height;
  canvas.style.top = '0px';
  canvas.style.position = "absolute";
  // so apperently stackoverflows topbar and left bar have a zindex that is greater than 999 so
  canvas.style.zIndex = 999999999999;  
  canvas.style.WebkitUserSelect = "none";
  canvas.style.userSelect = "none";
  const body = document.getElementsByTagName("body")[0];
  body.appendChild(canvas);
  canvas.tabIndex = "1";

  // Some optional drawings.
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "rgba(250, 218, 221, 0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let x = 0;
  let y = 0;
  let isdrawing = false;

  // this begins drawing the rectangle
  // sets the top left to x,y
  canvas.onmousedown = (e) => {
    x = e.offsetX;
    y = e.offsetY;
    isdrawing = true;
  };

  canvas.onmousemove = (e) => {
    if (isdrawing === true) {
      let rectWidth = e.offsetX - x;
      let rectHeight = e.offsetY - y;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeRect(x, y, rectWidth, rectHeight);

      console.log(`Rectangle is ${rectWidth} ${rectHeight}`);
    }
  };

  // mouse is no longer moving so this is the final
  canvas.onmouseup = (_) => {
    if (isdrawing === true) {
      x = 0;
      y = 0;
      isdrawing = false;
    }
  };
}

// in the listener draw the canvas?
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if ((param = request.createCanvas)) {
    // Your canvas creation logic here
    // Assuming canvas creation is successful

    createCanvas(param.width, param.height);
    //response should be the image?
    sendResponse({ message: "success" });
  }
  return true;
});
