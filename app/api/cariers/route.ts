// להורדת רשימת כל ה-carriers (cache it)
export async function GET() {
  const response = await fetch('https://api.trackingmore.com/v2/carriers', {
    headers: {
      'Trackingmore-Api-Key': process.env.TRACKING_MORE_API_KEY || '',
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  return Response.json(data);
}