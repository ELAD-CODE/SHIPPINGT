/**
 * טופס לכידת לידים
 * המטרה: לקבל פרטים מלקוחות פוטנציאליים
 */

import { useState } from 'react';
import { 
  UserIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import type { LeadFormProps, LeadFormData } from './types';

export default function LeadForm({ trackingNumber, shipmentType, onSubmit, onCancel }: LeadFormProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    fullName: '',
    phone: '',
    email: '',
    issue: 'customs', // ברירת מחדל
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // אופציות לבעיות
  const issueOptions = [
    { value: 'customs', label: '🔒 שחרור ממכס', description: 'עזרה בשחרור הסחורה ממכס' },
    { value: 'documents', label: '📋 השלמת מסמכים', description: 'עזרה במילוי והשלמת מסמכים' },
    { value: 'cost_inquiry', label: '💰 שאלות על עלויות', description: 'הבנת עלויות ודמי טיפול' },
    { value: 'urgent', label: '⚡ טיפול דחוף', description: 'זקוק לטיפול מהיר במשלוח' },
    { value: 'general', label: '💬 ייעוץ כללי', description: 'שאלות ויעוץ כללי' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // נקה שגיאה אם יש
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'שם מלא הוא שדה חובה';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'מספר טלפון הוא שדה חובה';
    } else if (!/^05\d{8}$/.test(formData.phone.replace(/[-\s]/g, ''))) {
      newErrors.phone = 'מספר טלפון לא תקין (דוגמה: 0501234567)';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'כתובת אימייל לא תקינה';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);

    try {
      // שליחה ל-API
      const response = await fetch('/api/leads/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          trackingNumber,
          shipmentType
        })
      });

      if (response.ok) {
        // הצלחה!
        onSubmit(formData);
        
        // הודעת הצלחה
        alert('✅ תודה! קיבלנו את הפרטים שלך ונחזור אליך בהקדם!');
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Error submitting lead:', error);
      alert('❌ אופס! משהו השתבש. אנא נסה שוב או התקשר ישירות.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 relative">
      {/* כפתור סגירה */}
      {onCancel && (
        <button
          onClick={onCancel}
          className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      )}

      {/* כותרת */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          💬 בוא נדבר!
        </h3>
        <p className="text-gray-600">
          השאר פרטים ואנחנו נחזור אליך תוך שעה (בימי עבודה)
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* שם מלא */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            שם מלא <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="איך לפנות אליך?"
              className={`
                w-full px-4 py-3 pr-11 rounded-lg border
                ${errors.fullName ? 'border-red-500' : 'border-gray-300'}
                focus:outline-none focus:ring-2 focus:ring-blue-500
                text-right
              `}
            />
            <UserIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
          )}
        </div>

        {/* טלפון */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            מספר טלפון <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="050-1234567"
              dir="ltr"
              className={`
                w-full px-4 py-3 pr-11 rounded-lg border
                ${errors.phone ? 'border-red-500' : 'border-gray-300'}
                focus:outline-none focus:ring-2 focus:ring-blue-500
              `}
            />
            <PhoneIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
          )}
        </div>

        {/* אימייל (אופציונלי) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            אימייל (אופציונלי)
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              dir="ltr"
              className={`
                w-full px-4 py-3 pr-11 rounded-lg border
                ${errors.email ? 'border-red-500' : 'border-gray-300'}
                focus:outline-none focus:ring-2 focus:ring-blue-500
              `}
            />
            <EnvelopeIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* סוג הבעיה */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            במה נוכל לעזור?
          </label>
          <div className="space-y-2">
            {issueOptions.map(option => (
              <label
                key={option.value}
                className={`
                  block p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${formData.issue === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 bg-white'
                  }
                `}
              >
                <input
                  type="radio"
                  name="issue"
                  value={option.value}
                  checked={formData.issue === option.value}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{option.label.split(' ')[0]}</span>
                  <div className="flex-1 text-right">
                    <div className="font-semibold text-gray-900">
                      {option.label.substring(2)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {option.description}
                    </div>
                  </div>
                  {formData.issue === option.value && (
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* הערות נוספות */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            הערות נוספות (אופציונלי)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="משהו נוסף שכדאי שנדע?"
            rows={3}
            className="
              w-full px-4 py-3 rounded-lg border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-blue-500
              resize-none text-right
            "
          />
        </div>

        {/* כפתורים */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className={`
              flex-1 py-4 rounded-xl font-semibold text-lg
              transition-all duration-200 transform
              ${submitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98]'
              }
              text-white shadow-lg hover:shadow-xl
              flex items-center justify-center gap-2
            `}
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                שולח...
              </>
            ) : (
              <>
                ✓ שלח פרטים
              </>
            )}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="
                px-6 py-4 rounded-xl font-semibold
                bg-gray-100 hover:bg-gray-200 text-gray-700
                transition-colors
              "
            >
              ביטול
            </button>
          )}
        </div>
      </form>

      {/* פרטי המשלוח */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
        <p><strong>משלוח:</strong> {trackingNumber}</p>
        {shipmentType && (
          <p><strong>סוג:</strong> {shipmentType}</p>
        )}
      </div>
    </div>
  );
}
