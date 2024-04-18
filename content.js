console.log("Content Script ran")

// need to send recieve a message to put the canvas on screen

// in the listener draw the canvas? 
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.createCanvas) {
      // Your canvas creation logic here
      // Assuming canvas creation is successful
      sendResponse({ message: 'success' });
    }
  });

