/**
 * קומפוננטת CTA (Call-To-Action)
 * המטרה: להפוך visitors ללידים!
 * מוצגת כשיש טריגרים רלוונטיים (במכס, הגיע לישראל וכו')
 */

import { 
  PhoneIcon, 
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/solid';
import type { CTABoxProps } from './types';

export default function CTABox({ triggers, onContactClick }: CTABoxProps) {
  if (!triggers || !triggers.show_cta) return null;

  const mainTrigger = triggers.triggers[0];

  // צבעים לפי דחיפות
  const getUrgencyStyle = (urgency: string): {
    bg: string;
    border: string;
    icon: string;
    pulse: string;
  } => {
    switch (urgency) {
      case 'critical':
        return {
          bg: 'bg-gradient-to-r from-red-500 to-red-600',
          border: 'border-red-300',
          icon: '🚨',
          pulse: 'animate-pulse'
        };
      case 'high':
        return {
          bg: 'bg-gradient-to-r from-orange-500 to-orange-600',
          border: 'border-orange-300',
          icon: '⚠️',
          pulse: ''
        };
      case 'medium':
        return {
          bg: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
          border: 'border-yellow-300',
          icon: '💡',
          pulse: ''
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
          border: 'border-blue-300',
          icon: 'ℹ️',
          pulse: ''
        };
    }
  };

  const style = getUrgencyStyle(triggers.urgency);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-white border-t border-gray-200">
      <div className={`
        ${style.bg} ${style.pulse}
        rounded-2xl p-8 text-white shadow-2xl
        transform transition-all duration-300 hover:scale-[1.02]
      `}>
        
        {/* כותרת */}
        <div className="flex items-start gap-4 mb-6">
          <div className="text-4xl">{style.icon}</div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">
              שים לב!
            </h3>
            <p className="text-lg text-white/90">
              {mainTrigger.message}
            </p>
          </div>
        </div>

        {/* כפתורי פעולה */}
        <div className="space-y-3 mb-6">
          {/* כפתור ראשי */}
          <button
            onClick={onContactClick}
            className="
              w-full bg-white text-gray-900 px-8 py-4 rounded-xl
              font-bold text-lg shadow-lg
              hover:shadow-xl transform hover:scale-[1.02]
              transition-all duration-200
              flex items-center justify-center gap-3
            "
          >
            <CheckBadgeIcon className="w-6 h-6 text-green-600" />
            {mainTrigger.cta}
          </button>

          {/* כפתורי קשר מהיר */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* טלפון */}
            <a
              href={`tel:${triggers.contact.phone}`}
              className="
                bg-white/10 hover:bg-white/20 backdrop-blur-sm
                px-6 py-3 rounded-xl font-semibold
                transition-all duration-200
                flex items-center justify-center gap-2
                border border-white/20
              "
            >
              <PhoneIcon className="w-5 h-5" />
              התקשר עכשיו
            </a>

            {/* WhatsApp */}
            <a
              href={triggers.contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="
                bg-white/10 hover:bg-white/20 backdrop-blur-sm
                px-6 py-3 rounded-xl font-semibold
                transition-all duration-200
                flex items-center justify-center gap-2
                border border-white/20
              "
            >
              <ChatBubbleLeftRightIcon className="w-5 h-5" />
              WhatsApp
            </a>
          </div>
        </div>

        {/* טריגרים נוספים */}
        {triggers.triggers.length > 1 && (
          <div className="border-t border-white/20 pt-6">
            <p className="font-semibold mb-3 text-white/90">
              נושאים נוספים שנוכל לעזור בהם:
            </p>
            <ul className="space-y-2">
              {triggers.triggers.slice(1).map((trigger, index) => (
                <li 
                  key={index}
                  className="flex items-start gap-2 text-white/90"
                >
                  <span className="text-white">•</span>
                  <span>{trigger.message}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* תגי אמון */}
        <div className="mt-6 pt-6 border-t border-white/20">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="font-bold text-2xl mb-1">7+</div>
              <div className="text-white/80">שנות ניסיון</div>
            </div>
            <div>
              <div className="font-bold text-2xl mb-1">✓</div>
              <div className="text-white/80">מומחה מוסמך</div>
            </div>
            <div>
              <div className="font-bold text-2xl mb-1">1000+</div>
              <div className="text-white/80">לקוחות מרוצים</div>
            </div>
          </div>
        </div>

        {/* אלעד גרינברג */}
        <div className="mt-6 text-center">
          <p className="text-white/90 text-sm">
            💼 <strong>אלעד גרינברג</strong> - סוכן מכס מוסמך
          </p>
          <p className="text-white/70 text-xs mt-1">
            מומחה בשחרור משלוחים בנתב&quot;ג ונמלי ישראל
          </p>
        </div>
      </div>

      {/* סעיף ביטחון/פרטיות */}
      <div className="mt-4 text-center text-xs text-gray-500">
        🔒 המידע שלך מאובטח ולא יועבר לצד שלישי
      </div>
    </div>
  );
}