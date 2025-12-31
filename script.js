document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('searchForm');
    const resultsDiv = document.getElementById('results');

    if (!form || !resultsDiv) return;

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const container = document.getElementById('container').value.trim();
        const bl = document.getElementById('bl').value.trim();
        const awb = document.getElementById('awb').value.trim();
        const company = document.getElementById('company').value.trim().toLowerCase();
        
        // נקה תוצאות קודמות
        resultsDiv.innerHTML = '';
        resultsDiv.classList.remove('show');
        
        // בדוק שהוזן לפחות מספר אחד
        if (!container && !bl && !awb) {
            resultsDiv.innerHTML = '<p style="color: #d9534f; font-weight: bold;">⚠️ נא להזין לפחות מספר אחד (קונטיינר, B/L או AWB).</p>';
            resultsDiv.classList.add('show');
            return;
        }
        
        // מיפוי חברות ל-URLs
        const trackingUrls = {
            'maersk': {
                name: 'Maersk',
                url: 'https://www.maersk.com/tracking/',
                types: ['container', 'bl']
            },
            'zim': {
                name: 'ZIM',
                url: 'https://www.zim.com/tools/track-a-shipment',
                types: ['container', 'bl']
            },
            'msc': {
                name: 'MSC',
                url: 'https://www.msc.com/en/track-a-shipment',
                types: ['container', 'bl']
            },
            'dhl': {
                name: 'DHL',
                url: 'https://www.dhl.com/il-en/home/tracking.html',
                types: ['awb']
            },
            'fedex': {
                name: 'FedEx',
                url: 'https://www.fedex.com/fedextrack/',
                types: ['awb']
            },
            'shaam': {
                name: 'תס"ק - מכס ישראל',
                url: 'https://www.shaam.gov.il',
                types: ['container', 'bl']
            },
            'ashdod': {
                name: 'נמל אשדוד',
                url: 'https://www.ashdodport.co.il',
                types: ['container']
            },
            'haifa': {
                name: 'נמל חיפה',
                url: 'https://www.haifaport.co.il',
                types: ['container']
            }
        };
        
        let links = '<h3>✅ קישורים למעקב אחר המשלוח:</h3><ul>';
        let foundResults = false;
        
        // אם נבחרה חברה ספציפית, השתמש רק בה
        const companies = company ? [company] : Object.keys(trackingUrls);
        
        companies.forEach(comp => {
            const companyData = trackingUrls[comp];
            if (!companyData) return;
            
            let trackingNumber = '';
            let trackingType = '';
            
            // בחר את המספר המתאים לפי סוג החברה
            if (container && companyData.types.includes('container')) {
                trackingNumber = container;
                trackingType = 'קונטיינר';
            } else if (bl && companyData.types.includes('bl')) {
                trackingNumber = bl;
                trackingType = 'B/L';
            } else if (awb && companyData.types.includes('awb')) {
                trackingNumber = awb;
                trackingType = 'AWB';
            }
            
            // אם יש מספר מעקב, הוסף קישור
            if (trackingNumber) {
                let fullUrl = companyData.url;
                
                // הוסף את מספר המעקב ל-URL בהתאם לחברה
                if (comp === 'maersk') {
                    fullUrl += trackingNumber;
                } else if (comp === 'zim') {
                    fullUrl += '?query=' + trackingNumber;
                } else if (comp === 'msc') {
                    fullUrl += '?agencyPath=isr';
                } else if (comp === 'dhl') {
                    fullUrl += '?tracking-id=' + trackingNumber;
                } else if (comp === 'fedex') {
                    fullUrl += '?trknbr=' + trackingNumber;
                }
                
                links += `
                    <li>
                        <a href="${fullUrl}" target="_blank" rel="noopener noreferrer">
                            🔗 <strong>${companyData.name}</strong><br>
                            <span style="font-size: 0.9em; color: #666;">מעקב ${trackingType}: ${trackingNumber}</span>
                        </a>
                    </li>
                `;
                foundResults = true;
            }
        });
        
        links += '</ul>';
        
        // הצג את התוצאות
        if (foundResults) {
            resultsDiv.innerHTML = links;
            resultsDiv.innerHTML += '<p style="margin-top: 20px; font-size: 0.95em; color: #666;">💡 <strong>טיפ:</strong> לחץ על הקישור כדי לעבור לאתר החברה ולראות את סטטוס המשלוח המעודכן.</p>';
        } else {
            resultsDiv.innerHTML = '<p style="color: #d9534f;">❌ לא נמצאו תוצאות מתאימות. אנא בדוק את הפרטים שהזנת ונסה שוב.</p>';
        }
        
        resultsDiv.classList.add('show');
        
        // גלול לתוצאות
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
});
