import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  const apiKey = process.env.TRACKINGMORE_API_KEY;
  const awbNumber = '700-13951545';

  if (!apiKey) {
    return NextResponse.json({ error: 'No API Key' });
  }

  const results: any = {
    awb_number: awbNumber,
    tests: []
  };

  // Test 1: Detect
  try {
    const detectResponse = await axios.post(
      'https://api.trackingmore.com/v3/trackings/detect',
      { tracking_number: awbNumber },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Tracking-Api-Key': apiKey
        }
      }
    );
    results.tests.push({
      name: 'Detect v3',
      success: true,
      data: detectResponse.data
    });
  } catch (error: any) {
    results.tests.push({
      name: 'Detect v3',
      success: false,
      error: error.response?.data || error.message
    });
  }

  // Test 2: Try with common airline codes
  const airlineCodes = ['air-freight', 'ana', 'asiana', 'fedex', 'dhl', 'ups'];
  
  for (const code of airlineCodes) {
    try {
      const response = await axios.get(
        `https://api.trackingmore.com/v3/trackings/get?tracking_numbers=${awbNumber}&carrier_code=${code}`,
        {
          headers: {
            'Accept': 'application/json',
            'Tracking-Api-Key': apiKey
          }
        }
      );
      
      if (response.data?.data?.[0]) {
        results.tests.push({
          name: `Get with ${code}`,
          success: true,
          data: response.data
        });
      }
    } catch (error: any) {
      // Silent fail
    }
  }

  return NextResponse.json(results);
}