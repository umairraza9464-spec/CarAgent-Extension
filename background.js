// Background Service Worker

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Car Agent Pro Extension installed!');
  
  // Set default storage values
  chrome.storage.local.get({entries: [], sheetId: ''}, (result) => {
    if(result.entries.length === 0) {
      console.log('Extension ready. No previous data.');
    }
  });
});

// Set up alarm to check for new entries periodically
chrome.alarms.create('checkNewEntries', {periodInMinutes: 5});

chrome.alarms.onAlarm.addListener((alarm) => {
  if(alarm.name === 'checkNewEntries') {
    chrome.storage.local.get({entries: []}, (result) => {
      if(result.entries.length > 0) {
        const lastEntry = result.entries[result.entries.length - 1];
        console.log('Latest entry:', lastEntry.name);
      }
    });
  }
});

// Listen for tab updates
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if(tab.url.includes('olx.in') || tab.url.includes('facebook.com')) {
      console.log('Active tab is from OLX or Facebook');
    }
  });
});

console.log('Car Agent Background Service Worker Ready');
