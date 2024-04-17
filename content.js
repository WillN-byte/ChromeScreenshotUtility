console.log("Content Script ran")

// need to send recieve a message to put the canvas on screen

// in the listener draw the canvas? 
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message);
    sendResponse({message : "Responed from content"}, function (response){console.log(response);});
});