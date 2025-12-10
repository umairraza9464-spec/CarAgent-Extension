// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabName = btn.getAttribute('data-tab');
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    btn.classList.add('active');
  });
});

// Extract from chat
document.getElementById('extractBtn')?.addEventListener('click', () => {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, {action: 'extractData'}, response => {
      if(response && (response.name || response.mobile)) {
        document.getElementById('e_name').value = response.name || '';
        document.getElementById('e_mobile').value = response.mobile || '';
        document.getElementById('e_carModel').value = response.carModel || '';
        document.getElementById('e_regNo').value = response.regNo || '';
        document.getElementById('extractForm').classList.remove('hidden');
        showStatus('✅ Data extracted!', 'success');
      } else {
        showStatus('❌ No data found', 'error');
      }
    }).catch(() => showStatus('❌ Error extracting', 'error'));
  });
});

// Save extracted data
document.getElementById('e_saveBtn')?.addEventListener('click', () => {
  saveData({
    name: document.getElementById('e_name').value,
    mobile: document.getElementById('e_mobile').value,
    carModel: document.getElementById('e_carModel').value,
    regNo: document.getElementById('e_regNo').value,
    variant: document.getElementById('e_variant').value,
    year: document.getElementById('e_year').value,
    km: document.getElementById('e_km').value,
    address: document.getElementById('e_address').value,
    followUp: 'Pending',
    date: new Date().toLocaleDateString('hi-IN')
  });
});

// Manual submit
document.getElementById('m_submitBtn')?.addEventListener('click', () => {
  const name = document.getElementById('m_name').value.trim();
  const mobile = document.getElementById('m_mobile').value.trim();
  const carModel = document.getElementById('m_carModel').value.trim();
  
  if(!name || !mobile || !carModel) {
    showStatus('❌ Name, Mobile, Car Model जरूरी हैं!', 'error');
    return;
  }
  if(mobile.length !== 10) {
    showStatus('❌ Mobile 10 digit होना चाहिए!', 'error');
    return;
  }
  
  saveData({
    name,
    mobile,
    carModel,
    regNo: document.getElementById('m_regNo').value.trim(),
    variant: document.getElementById('m_variant').value.trim(),
    year: document.getElementById('m_year').value.trim(),
    km: document.getElementById('m_km').value.trim(),
    address: document.getElementById('m_address').value.trim(),
    followUp: document.getElementById('m_followUp').value,
    date: new Date().toLocaleDateString('hi-IN')
  });
  
  // Clear form
  ['m_name', 'm_mobile', 'm_carModel', 'm_regNo', 'm_variant', 'm_year', 'm_km', 'm_address'].forEach(id => {
    document.getElementById(id).value = '';
  });
});

// Save data
function saveData(data) {
  chrome.storage.local.get({entries: []}, result => {
    result.entries.push(data);
    chrome.storage.local.set({entries: result.entries}, () => {
      showStatus('✅ Customer saved!', 'success');
      loadData();
      document.getElementById('extractForm').classList.add('hidden');
    });
  });
}

// Load data
function loadData() {
  chrome.storage.local.get({entries: []}, result => {
    const list = document.getElementById('dataList');
    if(result.entries.length === 0) {
      list.innerHTML = '<p style="color:#999">No data</p>';
      return;
    }
    list.innerHTML = result.entries.slice(-10).reverse().map(item => 
      `<div class="data-item"><strong>${item.name}</strong> - ${item.mobile} - ${item.carModel}</div>`
    ).join('');
  });
}

// Show status
function showStatus(msg, type) {
  const status = document.getElementById('status');
  status.textContent = msg;
  status.className = 'status ' + type;
  status.classList.remove('hidden');
  setTimeout(() => status.classList.add('hidden'), 3000);
}

// Save settings
document.getElementById('saveSettingsBtn')?.addEventListener('click', () => {
  const sheetId = document.getElementById('sheetId').value.trim();
  if(sheetId) {
    chrome.storage.local.set({sheetId}, () => alert('✅ Settings saved!'));
  } else {
    alert('❌ Sheet ID required!');
  }
});

// Export CSV
document.getElementById('exportBtn')?.addEventListener('click', () => {
  chrome.storage.local.get({entries: []}, result => {
    if(result.entries.length === 0) {
      alert('❌ No data to export!');
      return;
    }
    let csv = 'Date,Name,Mobile,Reg No,Car Model,Variant,Year,KM,Address,Follow Up\n';
    result.entries.forEach(item => {
      csv += `${item.date},"${item.name}","${item.mobile}","${item.regNo}","${item.carModel}","${item.variant}",${item.year},${item.km},"${item.address}",${item.followUp}\n`;
    });
    const blob = new Blob([csv], {type: 'text/csv'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'car-data.csv';
    a.click();
  });
});

// Clear data
document.getElementById('clearBtn')?.addEventListener('click', () => {
  if(confirm('Bilkul delete kar dun? Wapas nahi milega!')) {
    chrome.storage.local.set({entries: []}, () => {
      loadData();
      alert('✅ Data cleared!');
    });
  }
});

// Cancel buttons
document.getElementById('e_cancelBtn')?.addEventListener('click', () => {
  document.getElementById('extractForm').classList.add('hidden');
});

// Load data on startup
loadData();
