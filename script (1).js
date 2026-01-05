// script-api.js
// JavaScript לחיבור עם TrackingMore API דרך Vercel Function

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('searchForm');
    const loadingDiv = document.getElementById('loading');
    const resultsDiv = document.getElementById('results');

    if (!form) return;

    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const trackingNumber = document.getElementById('trackingNumber').value.trim();
        const carrier = document.getElementById('carrier').value;
        
        if (!trackingNumber) {
            showError('נא להזין מספר מעקב');
            return;
        }
        
        // הצג loading
        loadingDiv.style.display = 'block';
        resultsDiv.innerHTML = '';
        resultsDiv.classList.remove('show');
        
        try {
            // קריאה ל-API דרך Vercel Function
            // שנה את ה-URL הזה לכתובת ה-Vercel שלך אחרי deployment
            const apiUrl = `/api/track?trackingNumber=${encodeURIComponent(trackingNumber)}${carrier ? `&carrier=${carrier}` : ''}`;
            
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            // הסתר loading
            loadingDiv.style.display = 'none';
            
            if (data.success) {
                displayTrackingResults(data);
            } else {
                showError(data.error || 'לא נמצא מידע עבור מספר מעקב זה');
            }
            
        } catch (error) {
            loadingDiv.style.display = 'none';
            console.error('Error:', error);
            showError('שגיאה בחיבור לשרת. אנא נסה שוב מאוחר יותר.');
        }
    });
});

function displayTrackingResults(data) {
    const resultsDiv = document.getElementById('results');
    
    let html = `
        <div class="tracking-result-card">
            <div class="result-header">
                <h3>📦 פרטי משלוח</h3>
                <span class="carrier-badge">${data.carrier.name}</span>
            </div>
            
            <div class="result-body">
                <div class="info-row">
                    <span class="label">מספר מעקב:</span>
                    <span class="value"><strong>${data.tracking_number}</strong></span>
                </div>
                
                <div class="info-row status-row">
                    <span class="label">סטטוס:</span>
                    <span class="value status-badge">${data.status.text}</span>
                </div>
    `;
    
    // נמל/עיר מוצא
    if (data.origin) {
        html += `
                <div class="info-row">
                    <span class="label">מוצא:</span>
                    <span class="value">🌍 ${data.origin.city || data.origin.country}</span>
                </div>
        `;
    }
    
    // נמל/עיר יעד
    if (data.destination) {
        html += `
                <div class="info-row">
                    <span class="label">יעד:</span>
                    <span class="value">🎯 ${data.destination.city || data.destination.country}</span>
                </div>
        `;
    }
    
    // זמן הגעה משוער
    if (data.estimated_delivery) {
        html += `
                <div class="info-row highlight">
                    <span class="label">הגעה משוערת:</span>
                    <span class="value">📅 ${formatDate(data.estimated_delivery)}</span>
                </div>
        `;
    }
    
    // ימים מאז משלוח
    if (data.days_after_shipping !== undefined) {
        html += `
                <div class="info-row">
                    <span class="label">ימים מאז משלוח:</span>
                    <span class="value">⏰ ${data.days_after_shipping} ימים</span>
                </div>
        `;
    }
    
    html += `
            </div>
    `;
    
    // היסטוריית אירועים
    if (data.events && data.events.length > 0) {
        html += `
            <div class="events-section">
                <h4>📜 היסטוריית משלוח:</h4>
                <div class="timeline">
        `;
        
        data.events.forEach((event, index) => {
            const isLatest = index === 0;
            html += `
                <div class="timeline-item ${isLatest ? 'latest' : ''}">
                    <div class="timeline-marker"></div>
                    <div class="timeline-content">
                        <div class="timeline-date">${formatDateTime(event.date || event.checkpoint_date)}</div>
                        <div class="timeline-status">${event.status}</div>
                        ${event.location ? `<div class="timeline-location">📍 ${event.location}</div>` : ''}
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    // קישורים נוספים
    html += `
            <div class="additional-links">
                <h4>🔗 מידע נוסף:</h4>
                <div class="links-row">
                    <a href="https://www.shaam.gov.il" target="_blank" class="external-link">
                        🏛️ בדוק במכס (תס"ק)
                    </a>
    `;
    
    // קישור לחברת הספנות
    const carrierLinks = {
        'zim': 'https://www.zim.com/tools/track-a-shipment',
        'maersk': 'https://www.maersk.com/tracking/',
        'msc': 'https://www.msc.com/en/track-a-shipment',
        'israel-post': 'https://www.israelpost.co.il/%D7%A9%D7%99%D7%A8%D7%95%D7%AA%D7%99%D7%9D/%D7%9E%D7%A2%D7%A7%D7%91%D7%99%D7%9D/',
        'dhl': 'https://www.dhl.com/il-en/home/tracking.html',
        'fedex': 'https://www.fedex.com/en-il/tracking.html'
    };
    
    const carrierLink = carrierLinks[data.carrier.code];
    if (carrierLink) {
        html += `
                    <a href="${carrierLink}" target="_blank" class="external-link">
                        🌐 פרטים באתר ${data.carrier.name}
                    </a>
        `;
    }
    
    html += `
                </div>
            </div>
        </div>
    `;
    
    resultsDiv.innerHTML = html;
    resultsDiv.classList.add('show');
    
    // גלילה לתוצאות
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showError(message) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <div class="error-message">
            <div class="error-icon">⚠️</div>
            <h3>שגיאה</h3>
            <p>${message}</p>
            <button onclick="document.getElementById('trackingNumber').focus()" class="retry-btn">
                נסה שוב
            </button>
        </div>
    `;
    resultsDiv.classList.add('show');
}

function formatDate(dateString) {
    if (!dateString) return 'לא זמין';
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatDateTime(dateString) {
    if (!dateString) return 'לא זמין';
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}
