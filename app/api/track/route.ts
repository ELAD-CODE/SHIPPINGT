export async function GET() {
  return Response.json({
    success: true,
    message_he: 'Track API is working! ✅'
  });
}

export async function POST(req: Request) {
  try {
    const { tracking_number } = await req.json();

    if (!tracking_number) {
      return Response.json(
        { success: false, message_he: '❌ חסר מספר מעקב' },
        { status: 400 }
      );
    }

    // Return mock response with test data
    return Response.json(getMockResponse(tracking_number), { status: 200 });
  } catch (error: any) {
    console.error('API Error:', error);
    return Response.json(
      { success: false, message_he: '❌ שגיאה בעיבוד', error: error.message },
      { status: 500 }
    );
  }
}

function getMockResponse(trackingNumber: string) {
  return {
    success: true,
    message_he: '✅ משלוח נמצא (נתונים לדוגמה)',
    tracking_number: trackingNumber,
    courier: 'DHL',
    courier_name: 'DHL Express',
    status: 'in_transit',
    status_he: 'בדרך',
    origin: 'Shanghai, China',
    destination: 'Tel Aviv, Israel',
    origin_country: 'CN',
    destination_country: 'IL',
    last_update: new Date().toISOString(),
    last_update_he: 'עכשיו',
    note: '📌 זהו משלוח לדוגמה. להשתמוש בתוך ממשק בדיקה בלבד.'
  };
}