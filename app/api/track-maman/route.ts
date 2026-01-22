import { NextRequest, NextResponse } from 'next/server';

const MAMAN_API_BASE = 'https://mamanonline.wsfreeze.co.il/api/v1';
const TOKEN_EXPIRY = 25 * 60 * 1000; // 25 minutes

let cachedToken = { token: '', expiry: 0 };

async function getMamanToken() {
  if (cachedToken.token && Date.now() < cachedToken.expiry) {
    return cachedToken.token;
  }

  const username = process.env.MAMAN_USERNAME;
  const password = process.env.MAMAN_PASSWORD;

  if (!username || !password) {
    throw new Error('Maman API credentials not configured');
  }

  const response = await fetch(`${MAMAN_API_BASE}/Account/authenticate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userName: username,
      password: password,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to authenticate with Maman API');
  }

  const data = await response.json();
  cachedToken = {
    token: data.token,
    expiry: Date.now() + TOKEN_EXPIRY
  };

  return data.token;
}

export async function POST(request: NextRequest) {
  try {
    const { tracking_number } = await request.json();

    if (!tracking_number) {
      return NextResponse.json(
        { success: false, message_he: 'חסר מספר מעקב' },
        { status: 400 }
      );
    }

    const token = await getMamanToken();
    const response = await fetch(`${MAMAN_API_BASE}/Import/GetAWBStatus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ HABN: tracking_number }),
    });

    const data = await response.json();

    if (data.status !== 'Success') {
      return NextResponse.json({
        success: false,
        message_he: '❌ לא נמצא בממן'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message_he: '✅ נמצא בממן!',
      data: {
        tracking_number,
        status: data.data?.AWBStatus,
        weight: data.data?.DeclarationWeight,
        value: data.data?.DeclarationValue,
        import_date: data.data?.ImportFileDate,
        customs_date: data.data?.ClearanceDate
      }
    });

  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        message_he: 'שגיאה בחיפוש בממן',
        error: error.message 
      },
      { status: 500 }
    );
  }
}