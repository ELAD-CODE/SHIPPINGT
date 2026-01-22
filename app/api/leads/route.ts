  import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, phone, email, trackingNumber, shipmentType, issue, notes } = body;

    // Validation
    if (!fullName || !phone || !trackingNumber) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields',
        message_he: 'חסרים שדות חובה'
      }, { status: 400 });
    }

    // ניקוי טלפון
    const cleanPhone = phone.replace(/[-\s]/g, '');

    // קביעת priority
    const priority = determinePriority(issue, shipmentType);

    // שמירת ליד
    const lead = await prisma.lead.create({
      data: {
        fullName,
        phone: cleanPhone,
        email: email || null,
        trackingNumber,
        shipmentType,
        issue: issue || 'general',
        notes: notes || null,
        priority,
        status: 'new'
      }
    });

    console.log(`[LEAD CREATED] ID: ${lead.id}, Name: ${fullName}, Phone: ${cleanPhone}`);

    // TODO: שליחת נוטיפיקציה (SMS/WhatsApp)

    return NextResponse.json({
      success: true,
      lead_id: lead.id,
      message_he: 'תודה! קיבלנו את הפרטים שלך ונחזור אליך בהקדם',
      expected_response: priority === 'critical' ? '30 דקות' : '1-2 שעות'
    });

  } catch (error: any) {
    console.error('[LEAD CREATION ERROR]', error);

    return NextResponse.json({
      success: false,
      error: error.message,
      message_he: 'שגיאה בשמירת הפרטים. אנא נסה שנית או התקשר ישירות.'
    }, { status: 500 });
  }
}

function determinePriority(issue: string, shipmentType: string): string {
  if (issue === 'urgent') return 'critical';
  if (issue === 'customs' && shipmentType === 'air_waybill') return 'high';
  if (issue === 'customs') return 'high';
  if (issue === 'documents') return 'high';
  return 'medium';
}
