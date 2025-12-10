// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.action === 'extractData') {
    const pageText = document.body.innerText.toLowerCase();
    const htmlText = document.body.innerText;
    
    // Extract name
    let name = '';
    const namePatterns = [/(?:name|customer|(?:\u0938\u0902\u0926\u0947\u0938))[:\s]*([a-zA-Z\s]+)(?=\n|$)/i];
    namePatterns.forEach(pattern => {
      const match = htmlText.match(pattern);
      if(match) name = match[1].trim();
    });
    
    // Extract mobile (10 digit)
    let mobile = '';
    const mobileMatch = htmlText.match(/(\d{10})/);  
    if(mobileMatch) mobile = mobileMatch[0];
    
    // Extract car model
    let carModel = '';
    const carPatterns = /maruti|hyundai|honda|tata|mahindra|ford|kia|skoda|vw|renault|citroen|jeep|swift|creta|i20|city|xuv|nexon|ertiga|innova|fortuner|verna|vitara|alto|wr-v|helix|baleno|s-cross|ascender/i;
    const carMatch = htmlText.match(carPatterns);
    if(carMatch) carModel = carMatch[0];
    
    // Extract registration number
    let regNo = '';
    const regPattern = /[A-Z]{2}\s?\d{2}\s?[A-Z]{2}\s?\d{4}/;
    const regMatch = htmlText.match(regPattern);
    if(regMatch) regNo = regMatch[0];
    
    sendResponse({
      name: name || '',
      mobile: mobile || '',
      carModel: carModel || '',
      regNo: regNo || ''
    });
  }
});

console.log('Car Agent Content Script Loaded');
