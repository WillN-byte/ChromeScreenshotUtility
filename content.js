console.log('Content Script ran');

// need to send recieve a message to put the canvas on screen


// add function that creates the canvas
// the canvas needs to be created when paged region or region message is sent
// the only difference is that paged region uses the the entire documents height 

function createCanvas(width, height) {
    
    const canvas = document.createElement('canvas');

    canvas.id = 'my-canvas';
    canvas.width = width;
    canvas.height = (height === null) ? document.body.scrollHeight : height;
    canvas.style.top = '0px';
    canvas.style.position = 'absolute';
    canvas.style.zIndex = 999;

    const body = document.getElementsByTagName('body')[0];
    body.appendChild(canvas);

    // Some optional drawings.
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(250, 218, 221, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


// in the listener draw the canvas?
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if ((param = request.createCanvas)) {
    // Your canvas creation logic here
    // Assuming canvas creation is successful
    sendResponse({ message: 'success' });
    createCanvas(param.width, param.height);
    
  }
});
