console.log("Content Script ran")

// need to send recieve a message to put the canvas on screen

// in the listener draw the canvas? 
chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    // console.log(message);

    if (message.requested === 'createCanvas') {
        let canvasParams = message.requested;
        
        // create canvas here 
        // also send the screenshot?
        sendResponse({msg : "Created Canvas"}, function (response){console.log(response);});
    }
       
});