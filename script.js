chrome.runtime.onInstalled.addListener(function () {
  let root = chrome.contextMenus.create({
    title: 'Take Screenshot',
    contexts: ['all'],
    id: 'screenshot',
  });

  chrome.contextMenus.create({
    title: 'Visible Webpage',
    contexts: ['all'],
    id: 'visible',
    parentId: root,
  });

  chrome.contextMenus.create({
    title: 'Paged Webpage',
    contexts: ['all'],
    id: 'paged',
    parentId: root,
  });

  chrome.contextMenus.create({
    title: 'Region',
    contexts: ['all'],
    id: 'region',
    parentId: root,
  });

  chrome.contextMenus.create({
    title: 'Paged Region',
    contexts: ['all'],
    id: 'regionPaged',
    parentId: root,
  });
});

chrome.contextMenus.onClicked.addListener(testClick);

function testClick(data, tab) {
  console.log(tab);
  switch (data.menuItemId) {
    case 'visible':
      visiblePage();
      break;
    case 'regionPaged':
      selectRegion(tab, false);
      break;
    case 'region':
      selectRegion(tab, true);
      break;
    default:
      console.log(data.menuItemId);
      break;
  }

  console.log('pressed');
}

function getFileStamp() {
  let currentDate = new Date();
  let date =
    (currentDate.getMonth() + 1) +
    '-' +
    currentDate.getDate() +
    '-' +
    currentDate.getFullYear() +
    ' ' +
    (currentDate.getHours() +
      '' +
      currentDate.getMinutes() +
      '' +
      currentDate.getSeconds());
  console.log(date);
  return `screenshot ${date}.png`;
}

// don't hard code name; need a settings page
function visiblePage() {
  chrome.tabs.captureVisibleTab(
    null,
    { format: 'png' },
    function (screenshotUrl) {
      chrome.downloads.download(
        { filename: getFileStamp(), url: screenshotUrl },
        function (id) {
          console.log('error' + id);
        }
      );
    }
  );
}

// seems to not work on chrome:// sites
// here send a message so we can tell the content script to draw the canvas
function selectRegion(tab, usetabHeight) {
  chrome.tabs.sendMessage(
    tab.id,
    {
      createCanvas: { width: tab.width, height: (usetabHeight) ? tab.height : null },
    },
    (response) => {
      if (response && response.message === 'success') {
        console.log('Success Canvas was created');
      } else {
        console.log('Something went wrong');
      }
    }
  );
}
