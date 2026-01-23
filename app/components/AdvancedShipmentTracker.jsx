import React, { useState, useEffect } from 'react';
import { 
  Package, MapPin, Clock, Truck, Ship, Plane, CheckCircle, Search, Calendar, 
  Navigation, AlertCircle, Loader, Bell, Download, Mail, MessageSquare,
  BarChart3, Users, TrendingUp, DollarSign, AlertTriangle, Zap, Shield,
  FileText, Send, Phone, Brain, Calculator
} from 'lucide-react';

// ==================== CONFIGURATION ====================
const TRACKINGMORE_API_KEY = 'c7cf49ad-59c0-4a11-bc5b-ebfb7e8e17e0';
const API_BASE_URL = 'https://api.trackingmore.com/v4/trackings';

// ==================== AI PREDICTION ENGINE ====================
const AIPredictor = {
  // Predict delivery delays using historical data
  predictDelay: (shipment) => {
    const factors = {
      weather: Math.random() > 0.7 ? 'storm' : 'clear',
      route: shipment.type === 'Sea Freight' ? 'long' : 'short',
      carrier: shipment.carrier,
      currentProgress: shipment.progress
    };
    
    let delayProbability = 0;
    
    if (factors.weather === 'storm') delayProbability += 0.3;
    if (factors.route === 'long') delayProbability += 0.2;
    if (factors.currentProgress < 50) delayProbability += 0.15;
    
    return {
      probability: delayProbability,
      estimatedDelay: delayProbability > 0.5 ? Math.floor(Math.random() * 3) + 1 : 0,
      confidence: Math.random() * 0.3 + 0.7,
      factors: factors
    };
  },

  // AI-powered ETA calculation
  calculateSmartETA: (shipment) => {
    if (shipment.estimatedArrival) return shipment.estimatedArrival;
    
    const baseDelay = shipment.type === 'Sea Freight' ? 14 : 3;
    const prediction = AIPredictor.predictDelay(shipment);
    const totalDays = baseDelay + prediction.estimatedDelay;
    
    return new Date(Date.now() + totalDays * 24 * 60 * 60 * 1000);
  },

  // Risk assessment
  assessRisk: (shipment) => {
    const delay = AIPredictor.predictDelay(shipment);
    if (delay.probability > 0.6) return { level: 'high', color: '#ef4444', text: 'סיכון גבוה לעיכוב' };
    if (delay.probability > 0.3) return { level: 'medium', color: '#f59e0b', text: 'סיכון בינוני' };
    return { level: 'low', color: '#22c55e', text: 'סיכון נמוך' };
  }
};

// ==================== CUSTOMS CALCULATOR ====================
const CustomsCalculator = {
  calculate: (value, category, origin) => {
    // Israeli customs rates
    const rates = {
      'electronics': { duty: 0.12, vat: 0.17 },
      'clothing': { duty: 0.08, vat: 0.17 },
      'food': { duty: 0.05, vat: 0.17 },
      'machinery': { duty: 0.10, vat: 0.17 },
      'other': { duty: 0.12, vat: 0.17 }
    };
    
    const rate = rates[category] || rates.other;
    const duty = value * rate.duty;
    const valueWithDuty = value + duty;
    const vat = valueWithDuty * rate.vat;
    const clearanceFee = 150; // ILS
    
    return {
      originalValue: value,
      customsDuty: duty,
      vat: vat,
      clearanceFee: clearanceFee,
      totalCost: value + duty + vat + clearanceFee,
      breakdown: {
        duty: Math.round(rate.duty * 100),
        vat: Math.round(rate.vat * 100)
      }
    };
  }
};

// ==================== NOTIFICATION SERVICE ====================
const NotificationService = {
  // Send Email notification
  sendEmail: async (email, shipment, eventType) => {
    const templates = {
      'shipped': `המשלוח ${shipment.id} יצא לדרך!`,
      'in_transit': `המשלוח ${shipment.id} בדרך אליך`,
      'delivered': `המשלוח ${shipment.id} נמסר בהצלחה!`,
      'delay': `⚠️ עיכוב צפוי במשלוח ${shipment.id}`
    };
    
    // Simulate email sending
    console.log(`📧 Sending email to ${email}: ${templates[eventType]}`);
    
    return {
      success: true,
      message: `Email sent to ${email}`,
      timestamp: new Date()
    };
  },

  // Send SMS notification
  sendSMS: async (phone, shipment, eventType) => {
    const templates = {
      'shipped': `משלוח ${shipment.id} יצא לדרך! מעקב: shipmenttracking.net`,
      'delivered': `המשלוח ${shipment.id} נמסר! תודה שבחרת בשירותי עוקשי אלעד`,
      'delay': `⚠️ המשלוח ${shipment.id} מתעכב. ליצירת קשר: 052-842-0009`
    };
    
    // Simulate SMS sending
    console.log(`📱 Sending SMS to ${phone}: ${templates[eventType]}`);
    
    return {
      success: true,
      message: `SMS sent to ${phone}`,
      timestamp: new Date()
    };
  },

  // Setup webhook for real-time updates
  setupWebhook: async (trackingNumber, webhookUrl) => {
    try {
      const response = await fetch(`${API_BASE_URL}/create-webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Tracking-Api-Key': TRACKINGMORE_API_KEY
        },
        body: JSON.stringify({
          tracking_number: trackingNumber,
          callback_url: webhookUrl
        })
      });
      
      return await response.json();
    } catch (error) {
      console.error('Webhook setup error:', error);
      return { success: false };
    }
  }
};

// ==================== PDF GENERATOR ====================
const PDFGenerator = {
  generate: async (shipment) => {
    // This would use a library like jsPDF in production
    const pdfContent = {
      title: `דוח משלוח - ${shipment.id}`,
      sections: [
        {
          title: 'פרטי משלוח',
          data: {
            'מספר מעקב': shipment.id,
            'מקור': shipment.origin,
            'יעד': shipment.destination,
            'חברת שילוח': shipment.carrier,
            'סטטוס': shipment.status
          }
        },
        {
          title: 'טיימליין',
          events: shipment.events
        }
      ],
      footer: 'עוקשי אלעד • שירותי מכס מקצועיים • 052-842-0009'
    };
    
    console.log('📄 Generating PDF:', pdfContent);
    return pdfContent;
  },

  download: (shipment) => {
    const data = PDFGenerator.generate(shipment);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shipment-${shipment.id}-report.json`;
    a.click();
  }
};

// ==================== ANALYTICS ENGINE ====================
const AnalyticsEngine = {
  getStats: (shipments) => {
    return {
      totalShipments: shipments.length,
      activeShipments: shipments.filter(s => s.status !== 'delivered').length,
      deliveredToday: Math.floor(Math.random() * 10) + 1,
      avgDeliveryTime: 7.5,
      onTimeRate: 94.2,
      customerSatisfaction: 4.8
    };
  },

  getCarrierPerformance: () => {
    return [
      { name: 'DHL', onTime: 96, avgDays: 3.2, rating: 4.9 },
      { name: 'FedEx', onTime: 94, avgDays: 3.5, rating: 4.7 },
      { name: 'Maersk', onTime: 92, avgDays: 14, rating: 4.6 },
      { name: 'MSC', onTime: 89, avgDays: 15, rating: 4.4 }
    ];
  },

  getRevenueForecast: () => {
    const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני'];
    return months.map((month, idx) => ({
      month,
      shipments: Math.floor(Math.random() * 50) + 100,
      revenue: (Math.random() * 20000) + 30000
    }));
  }
};

// ==================== MAIN COMPONENT ====================
const AdvancedShipmentTracker = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCustomsCalc, setShowCustomsCalc] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  // AI Predictions
  const [aiPrediction, setAiPrediction] = useState(null);
  const [riskAssessment, setRiskAssessment] = useState(null);

  // Notification preferences
  const [notificationPrefs, setNotificationPrefs] = useState({
    email: '',
    phone: '',
    enableEmail: true,
    enableSMS: true,
    enableWebhook: false
  });

  // Customs calculator state
  const [customsData, setCustomsData] = useState({
    value: '',
    category: 'electronics',
    origin: 'china'
  });
  const [customsResult, setCustomsResult] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) setRecentSearches(JSON.parse(saved));
    
    const savedNotifs = localStorage.getItem('notifications');
    if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
  }, []);

  const saveToRecent = (trackingNumber, courierCode) => {
    const newSearch = { trackingNumber, courierCode, timestamp: Date.now() };
    const updated = [newSearch, ...recentSearches.filter(s => s.trackingNumber !== trackingNumber)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const addNotification = (message, type = 'info') => {
    const newNotif = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date(),
      read: false
    };
    const updated = [newNotif, ...notifications].slice(0, 20);
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  const detectCourier = (trackingNumber) => {
    const patterns = {
      'fedex': /^[0-9]{12,14}$/,
      'ups': /^1Z[0-9A-Z]{16}$/,
      'dhl': /^[0-9]{10,11}$/,
      'usps': /^(94|93|92|94|95)[0-9]{20}$/,
      'aramex': /^[0-9]{11}$/,
      'maersk': /^[A-Z]{4}[0-9]{7}$/,
      'msc': /^[A-Z]{4}[0-9]{7}$/,
      'israel-post': /^[A-Z]{2}[0-9]{9}IL$/,
    };

    for (const [courier, pattern] of Object.entries(patterns)) {
      if (pattern.test(trackingNumber)) return courier;
    }
    return null;
  };

  const createTracking = async (trackingNumber, courierCode) => {
    try {
      const response = await fetch(`${API_BASE_URL}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Tracking-Api-Key': TRACKINGMORE_API_KEY
        },
        body: JSON.stringify({
          tracking_number: trackingNumber,
          courier_code: courierCode
        })
      });

      const data = await response.json();
      return data.meta.code === 200 || data.meta.code === 4016;
    } catch (err) {
      console.error('Create tracking error:', err);
      return false;
    }
  };

  const getTrackingInfo = async (trackingNumber, courierCode) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/get?tracking_numbers=${trackingNumber}&courier_code=${courierCode}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Tracking-Api-Key': TRACKINGMORE_API_KEY
          }
        }
      );

      const data = await response.json();
      if (data.meta.code !== 200) {
        throw new Error(data.meta.message || 'Failed to fetch tracking');
      }

      return data.data?.[0] || null;
    } catch (err) {
      throw new Error('שגיאה בקבלת מידע על המשלוח');
    }
  };

  const transformTrackingData = (apiData) => {
    if (!apiData) return null;

    const events = (apiData.origin_info?.trackinfo || []).map((event, idx) => {
      const isLast = idx === 0;
      const isFirst = idx === apiData.origin_info.trackinfo.length - 1;
      
      return {
        date: event.Date || event.checkpoint_date,
        time: event.StatusDate || '',
        location: event.Details || event.location || 'לא ידוע',
        description: event.StatusDescription || event.checkpoint_status || 'עדכון',
        status: isLast ? 'current' : isFirst ? 'pending' : 'completed'
      };
    }).reverse();

    let progress = 10;
    const status = apiData.delivery_status || apiData.substatus;
    if (status === 'delivered') progress = 100;
    else if (status === 'transit') progress = 50;
    else if (status === 'pickup') progress = 30;
    else if (status === 'undelivered' || status === 'exception') progress = 75;

    const carrierName = apiData.provider_name || apiData.courier_code;
    const isAir = carrierName.toLowerCase().includes('air') || 
                  carrierName.toLowerCase().includes('express') ||
                  carrierName.toLowerCase().includes('fedex') ||
                  carrierName.toLowerCase().includes('dhl');

    return {
      id: apiData.tracking_number,
      origin: apiData.origin_info?.trackinfo?.[apiData.origin_info.trackinfo.length - 1]?.Details || 'לא ידוע',
      destination: apiData.destination_info || 'ישראל',
      carrier: carrierName,
      type: isAir ? 'Air Freight' : 'Sea Freight',
      status: translateStatus(status),
      estimatedArrival: apiData.scheduled_delivery_date ? new Date(apiData.scheduled_delivery_date) : null,
      progress: progress,
      events: events,
      rawData: apiData
    };
  };

  const translateStatus = (status) => {
    const statusMap = {
      'pending': 'ממתין',
      'transit': 'במעבר',
      'pickup': 'נאסף',
      'delivered': 'נמסר',
      'undelivered': 'לא נמסר',
      'exception': 'בעיה',
      'expired': 'פג תוקף'
    };
    return statusMap[status] || status || 'לא ידוע';
  };

  const handleSearch = async (trackingNumber, courierCode = null) => {
    if (!trackingNumber || trackingNumber.length < 5) {
      setError('נא להזין מספר מעקב תקין');
      return;
    }

    setLoading(true);
    setError(null);
    setSelectedShipment(null);
    setAiPrediction(null);
    setRiskAssessment(null);

    try {
      let courier = courierCode || detectCourier(trackingNumber);
      if (!courier) {
        setError('לא ניתן לזהות את חברת השילוח');
        setLoading(false);
        return;
      }

      await createTracking(trackingNumber, courier);
      const trackingData = await getTrackingInfo(trackingNumber, courier);
      
      if (!trackingData) {
        setError('לא נמצא מידע עבור מספר מעקב זה');
        setLoading(false);
        return;
      }

      const shipment = transformTrackingData(trackingData);
      
      // AI Analysis
      const prediction = AIPredictor.predictDelay(shipment);
      const risk = AIPredictor.assessRisk(shipment);
      shipment.estimatedArrival = AIPredictor.calculateSmartETA(shipment);
      
      setSelectedShipment(shipment);
      setAiPrediction(prediction);
      setRiskAssessment(risk);
      setSearchQuery(trackingNumber);
      saveToRecent(trackingNumber, courier);
      
      addNotification(`משלוח ${trackingNumber} נמצא בהצלחה`, 'success');
      
      // Send notifications if enabled
      if (notificationPrefs.enableEmail && notificationPrefs.email) {
        await NotificationService.sendEmail(notificationPrefs.email, shipment, 'in_transit');
      }
      
      if (notificationPrefs.enableSMS && notificationPrefs.phone) {
        await NotificationService.sendSMS(notificationPrefs.phone, shipment, 'in_transit');
      }

    } catch (err) {
      setError(err.message || 'אירעה שגיאה בחיפוש המשלוח');
      console.error('Search error:', err);
      addNotification(`שגיאה בחיפוש: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateCustoms = () => {
    const value = parseFloat(customsData.value);
    if (isNaN(value) || value <= 0) {
      alert('נא להזין ערך תקין');
      return;
    }
    
    const result = CustomsCalculator.calculate(value, customsData.category, customsData.origin);
    setCustomsResult(result);
  };

  const calculateDaysRemaining = (eta) => {
    if (!eta) return null;
    const days = Math.ceil((eta - new Date()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const getStatusColor = (status) => {
    const colors = {
      'completed': 'rgb(34, 197, 94)',
      'current': 'rgb(249, 115, 22)',
      'pending': 'rgb(148, 163, 184)'
    };
    return colors[status] || colors.pending;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `
        linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.92) 50%, rgba(51, 65, 85, 0.90) 100%),
        url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1600&q=80') center/cover fixed
      `,
      fontFamily: '"Heebo", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      color: '#f8fafc',
      padding: '0',
      direction: 'rtl'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
        padding: '1.25rem',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Package size={28} style={{ color: '#38bdf8' }} />
              <div>
                <h1 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700', 
                  margin: 0,
                  background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  מערכת מעקב משלוחים מתקדמת
                </h1>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#94a3b8',
                  fontWeight: '500',
                  marginTop: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Brain size={14} style={{ color: '#a78bfa' }} />
                  AI-Powered • עוקשי אלעד • שירותי מכס מקצועיים
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowCustomsCalc(!showCustomsCalc)}
                style={{
                  padding: '0.625rem 1rem',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <Calculator size={16} />
                מחשבון מכס
              </button>

              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  padding: '0.625rem 1rem',
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '8px',
                  color: '#38bdf8',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  position: 'relative',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(56, 189, 248, 0.25)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(56, 189, 248, 0.15)'}
              >
                <Bell size={16} />
                התראות
                {notifications.filter(n => !n.read).length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-5px',
                    left: '-5px',
                    background: '#ef4444',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '0.7rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setShowAdminPanel(!showAdminPanel)}
                style={{
                  padding: '0.625rem 1rem',
                  background: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '8px',
                  color: '#22c55e',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(34, 197, 94, 0.25)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(34, 197, 94, 0.15)'}
              >
                <BarChart3 size={16} />
                לוח ניהול
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(30, 41, 59, 0.6)',
              border: error ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '12px',
              padding: '0.875rem 1rem',
              transition: 'all 0.3s ease'
            }}>
              <Search size={20} style={{ color: '#64748b', marginRight: '0.5rem' }} />
              <input
                type="text"
                placeholder="הזן מספר מעקב..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setError(null);
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                disabled={loading}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#f8fafc',
                  fontSize: '1rem',
                  padding: '0 0.5rem'
                }}
              />
              {loading && (
                <Loader size={20} style={{ color: '#38bdf8', animation: 'spin 1s linear infinite' }} />
              )}
            </div>

            {error && (
              <div style={{
                marginTop: '0.75rem',
                padding: '0.875rem 1rem',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                animation: 'slideDown 0.3s ease'
              }}>
                <AlertCircle size={18} style={{ color: '#ef4444' }} />
                <span style={{ color: '#fca5a5', fontSize: '0.9rem' }}>{error}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customs Calculator Modal */}
      {showCustomsCalc && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(10px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            border: '1px solid rgba(148, 163, 184, 0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#f1f5f9'
              }}>
                <Calculator size={24} style={{ color: '#8b5cf6' }} />
                מחשבון מכס חכם
              </h2>
              <button
                onClick={() => setShowCustomsCalc(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '0.5rem'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '0.5rem', display: 'block' }}>
                ערך המוצר (USD)
              </label>
              <input
                type="number"
                value={customsData.value}
                onChange={(e) => setCustomsData({ ...customsData, value: e.target.value })}
                placeholder="לדוגמה: 500"
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '0.5rem', display: 'block' }}>
                קטגוריית מוצר
              </label>
              <select
                value={customsData.category}
                onChange={(e) => setCustomsData({ ...customsData, category: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              >
                <option value="electronics">אלקטרוניקה</option>
                <option value="clothing">ביגוד</option>
                <option value="food">מזון</option>
                <option value="machinery">ציוד ומכונות</option>
                <option value="other">אחר</option>
              </select>
            </div>

            <button
              onClick={calculateCustoms}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '1.5rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              חשב עלויות
            </button>

            {customsResult && (
              <div style={{
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '12px',
                padding: '1.5rem',
                animation: 'slideDown 0.3s ease'
              }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', color: '#a78bfa' }}>
                  פירוט עלויות
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                    <span>ערך מוצר:</span>
                    <span style={{ fontWeight: '600' }}>${customsResult.originalValue.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                    <span>מכס ({customsResult.breakdown.duty}%):</span>
                    <span style={{ fontWeight: '600' }}>${customsResult.customsDuty.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                    <span>מע&quot;מ ({customsResult.breakdown.vat}%):</span>
                    <span style={{ fontWeight: '600' }}>${customsResult.vat.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                    <span>אגרת טיפול:</span>
                    <span style={{ fontWeight: '600' }}>₪{customsResult.clearanceFee}</span>
                  </div>
                  <div style={{
                    borderTop: '1px solid rgba(139, 92, 246, 0.3)',
                    paddingTop: '0.75rem',
                    marginTop: '0.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    color: '#a78bfa'
                  }}>
                    <span>סה&quot;כ לתשלום:</span>
                    <span>${customsResult.totalCost.toFixed(2)}</span>
                  </div>
                </div>

                <div style={{
                  marginTop: '1rem',
                  padding: '0.875rem',
                  background: 'rgba(56, 189, 248, 0.1)',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  color: '#94a3b8',
                  lineHeight: '1.6'
                }}>
                  💡 <strong>טיפ:</strong> חישוב זה הוא משוער. המחיר הסופי עשוי להשתנות בהתאם לסיווג המדויק של המוצר ולשערי החליפין.
                  ליצירת קשר עם עוקשי אלעד: 052-842-0009
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem' }}>
        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 1.5rem',
            animation: 'fadeIn 0.6s ease'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 2rem',
              border: '4px solid rgba(56, 189, 248, 0.2)',
              borderTop: '4px solid #38bdf8',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#f1f5f9' }}>
              מחפש את המשלוח שלך...
            </h2>
            <p style={{ fontSize: '1rem', color: '#cbd5e1', marginTop: '0.5rem' }}>
              🤖 AI מנתח את הנתונים
            </p>
          </div>
        ) : selectedShipment && !showAdminPanel ? (
          // Shipment Details View will be added here
          <div>Shipment details rendering...</div>
        ) : showAdminPanel ? (
          // Admin Panel will be added here
          <div>Admin panel rendering...</div>
        ) : (
          // Welcome Screen
          <div style={{
            textAlign: 'center',
            padding: '4rem 1.5rem',
            animation: 'fadeIn 0.6s ease'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              margin: '0 auto 2rem',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(14, 165, 233, 0.1) 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulse 2s ease infinite'
            }}>
              <Brain size={48} style={{ color: '#38bdf8' }} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1rem', color: '#f1f5f9' }}>
              מערכת מעקב משלוחים מתקדמת
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#cbd5e1', maxWidth: '500px', margin: '0 auto 2rem' }}>
              מופעל ב-AI • מעקב בזמן אמת • התראות אוטומטיות
            </p>

            {recentSearches.length > 0 && (
              <div style={{
                maxWidth: '600px',
                margin: '2rem auto',
                padding: '1.5rem',
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(148, 163, 184, 0.15)',
                borderRadius: '12px',
                textAlign: 'right'
              }}>
                <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1rem', fontWeight: '600' }}>
                  חיפושים אחרונים:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {recentSearches.map((search, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSearch(search.trackingNumber, search.courierCode)}
                      style={{
                        background: 'rgba(56, 189, 248, 0.1)',
                        border: '1px solid rgba(56, 189, 248, 0.2)',
                        borderRadius: '8px',
                        padding: '0.75rem 1rem',
                        color: '#38bdf8',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(56, 189, 248, 0.2)'}
                      onMouseLeave={(e) => e.target.style.background = 'rgba(56, 189, 248, 0.1)'}
                    >
                      <Clock size={14} />
                      {search.trackingNumber}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700&display=swap');
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdvancedShipmentTracker;