console.log('Content Script ran');

// need to send recieve a message to put the canvas on screen

// in the listener draw the canvas?
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if ((param = request.createCanvas)) {
    // Your canvas creation logic here
    // Assuming canvas creation is successful
    sendResponse({ message: 'success' });
    const canvas = document.createElement('canvas');

    canvas.id = 'my-canvas';
    canvas.width = param.width;
    canvas.height = document.body.scrollHeight;
    canvas.style.top = '0px';
    canvas.style.position = 'absolute';
    canvas.style.zIndex = 999;

    const body = document.getElementsByTagName('body')[0];
    body.appendChild(canvas);

    // Some optional drawings.
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(250, 218, 221, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
    // ctx.fillRect(150, 150, 200, 200);
    // ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
    // ctx.fillRect(200, 50, 200, 200);
  }
});
