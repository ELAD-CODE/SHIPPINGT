'use client';

import { ExternalLink, Building2, Ship, Package, Anchor, Newspaper } from 'lucide-react';

interface ResourceLink {
  name: string;
  url: string;
  description?: string;
}

interface ResourceCategory {
  title: string;
  icon: any;
  color: string;
  links: ResourceLink[];
}

export default function ResourcesPage() {
  const resources: ResourceCategory[] = [
    {
      title: 'גופים ממשלתיים',
      icon: Building2,
      color: 'blue',
      links: [
        {
          name: 'משרד הכלכלה',
          url: 'https://www.gov.il/he/departments/economy',
          description: 'מידע על יבוא, יצוא ורגולציה'
        },
        {
          name: 'רשות המכס - תס"ק',
          url: 'https://www.gov.il/he/departments/israel_tax_authority',
          description: 'מכס ישראל - מערכת תס"ק'
        },
        {
          name: 'מערכת תס"ק (שעם)',
          url: 'https://www.shaam.gov.il',
          description: 'מערכת ממוחשבת למכס'
        },
        {
          name: 'משרד התחבורה',
          url: 'https://www.gov.il/he/departments/ministry_of_transport',
          description: 'רגולציה ורישוי הובלות'
        }
      ]
    },
    {
      title: 'חברות שילוח בינלאומיות',
      icon: Ship,
      color: 'green',
      links: [
        {
          name: 'אוריאן (Oriyan)',
          url: 'https://www.oriyan.co.il',
          description: 'שילוח בינלאומי ולוגיסטיקה'
        },
        {
          name: 'DSV',
          url: 'https://www.il.dsv.com',
          description: 'שילוח אווירי וימי'
        },
        {
          name: 'אלדן (Alden)',
          url: 'https://www.alden.co.il',
          description: 'שילוח ולוגיסטיקה'
        },
        {
          name: 'ZIM',
          url: 'https://www.zim.com',
          description: 'חברת ספנות ישראלית'
        },
        {
          name: 'Maersk',
          url: 'https://www.maersk.com',
          description: 'ספנות בינלאומית'
        },
        {
          name: 'MSC',
          url: 'https://www.msc.com',
          description: 'ספנות containers'
        },
        {
          name: 'CMA CGM',
          url: 'https://www.cma-cgm.com',
          description: 'ספנות עולמית'
        },
        {
          name: 'DHL',
          url: 'https://www.dhl.com/il-he',
          description: 'שילוח מהיר בינלאומי'
        },
        {
          name: 'FedEx',
          url: 'https://www.fedex.com/il-he',
          description: 'שילוח אווירי מהיר'
        },
        {
          name: 'UPS',
          url: 'https://www.ups.com/il',
          description: 'שירותי שילוח גלובליים'
        }
      ]
    },
    {
      title: 'סוכנויות מכס ולוגיסטיקה',
      icon: Package,
      color: 'purple',
      links: [
        {
          name: 'קייזר (Kaiser)',
          url: 'https://www.kaiser.co.il',
          description: 'סוכנות מכס ושילוח'
        },
        {
          name: 'פרנק (Frank)',
          url: 'https://www.frank.co.il',
          description: 'שירותי מכס ולוגיסטיקה'
        },
        {
          name: 'ליפא מאיר',
          url: 'https://www.lipameir.co.il',
          description: 'סוכנות מכס'
        },
        {
          name: 'טבור (Tavor)',
          url: 'https://www.tavorlog.com',
          description: 'לוגיסטיקה ושילוח'
        },
        {
          name: 'דלק לוגיסטיקה',
          url: 'https://www.delek-motors.co.il',
          description: 'שירותי לוגיסטיקה'
        },
        {
          name: 'ליונוהיל (Lionwheel)',
          url: 'https://www.lionwheel.co.il',
          description: 'שילוח מהיר בישראל'
        }
      ]
    },
    {
      title: 'נמלים ותחנות',
      icon: Anchor,
      color: 'cyan',
      links: [
        {
          name: 'נמל אשדוד',
          url: 'https://www.ashdodport.co.il',
          description: 'הנמל הגדול בישראל'
        },
        {
          name: 'נמל חיפה',
          url: 'https://www.haifaport.co.il',
          description: 'נמל צפוני'
        },
        {
          name: 'נמל אילת',
          url: 'https://www.eilatport.co.il',
          description: 'נמל דרומי'
        },
        {
          name: 'רשות שדות התעופה',
          url: 'https://www.iaa.gov.il',
          description: 'שדה תעופה בן גוריון'
        },
        {
          name: 'אל על קרגו',
          url: 'https://www.elal.com/cargo',
          description: 'מטענים אוויריים'
        }
      ]
    },
    {
      title: 'חדשות ומידע',
      icon: Newspaper,
      color: 'orange',
      links: [
        {
          name: 'לשכת המסחר',
          url: 'https://www.chamber.org.il',
          description: 'חדשות עסקיות ויבוא-יצוא'
        },
        {
          name: 'התאחדות התעשיינים',
          url: 'https://www.industry.org.il',
          description: 'מידע עסקי ותעשייתי'
        },
        {
          name: 'איגוד היצואנים',
          url: 'https://www.export.gov.il',
          description: 'עזרה ליצואנים ישראליים'
        },
        {
          name: 'Globe - כלכליסט',
          url: 'https://www.globes.co.il/news/section/1486',
          description: 'חדשות סחר חוץ'
        },
        {
          name: 'דואר ישראל',
          url: 'https://www.israelpost.co.il',
          description: 'מעקב משלוחים דואר'
        }
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: { bg: string; icon: string; border: string } } = {
      blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-200' },
      green: { bg: 'bg-green-50', icon: 'text-green-600', border: 'border-green-200' },
      purple: { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-200' },
      cyan: { bg: 'bg-cyan-50', icon: 'text-cyan-600', border: 'border-cyan-200' },
      orange: { bg: 'bg-orange-50', icon: 'text-orange-600', border: 'border-orange-200' }
    };
    return colors[color];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            משאבים ליבוא ויצוא
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            כל הקישורים החשובים למקצועני הסחר הבינלאומי במקום אחד
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-12 max-w-6xl mx-auto">
          {resources.map((category, index) => {
            const Icon = category.icon;
            const colors = getColorClasses(category.color);

            return (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${colors.icon}`} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
                </div>

                {/* Links Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.links.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`card hover:scale-105 transition-transform duration-200 border-2 ${colors.border}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                            {link.name}
                            <ExternalLink className="w-4 h-4 text-gray-400" />
                          </h3>
                          {link.description && (
                            <p className="text-sm text-gray-600">{link.description}</p>
                          )}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="card max-w-2xl mx-auto bg-gradient-to-br from-blue-50 to-purple-50">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              חסר משהו?
            </h3>
            <p className="text-gray-600 mb-6">
              יש לך הצעה לקישור נוסף? נשמח לשמוע!
            </p>
            <a
              href="mailto:info@shippingt.com"
              className="btn-primary inline-block"
            >
              שלח הצעה
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
