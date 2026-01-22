import { NextRequest, NextResponse } from 'next/server';

/**
 * Shipments API Route
 * Handles CRUD operations for shipments with sea freight support
 */

// Validation helpers
function validateContainerNumber(containerNumber: string): boolean {
  // ISO 6346 format: 4 letters + 7 digits
  const regex = /^[A-Z]{4}[0-9]{7}$/;
  if (!regex.test(containerNumber)) {
    return false;
  }
  
  // Optional: Validate check digit (position 10)
  // This is a simplified check - full ISO 6346 validation is more complex
  return true;
}

function validateSeaShipment(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.containerNumber) {
    errors.push('container_number is required for sea shipments');
  } else if (!validateContainerNumber(data.containerNumber)) {
    errors.push('container_number must be in ISO 6346 format (e.g., MSCU1234567)');
  }
  
  if (!data.blNumber) {
    errors.push('bl_number (Bill of Lading) is required for sea shipments');
  }
  
  if (!data.vesselName) {
    errors.push('vessel_name is required for sea shipments');
  }
  
  if (!data.voyageNumber) {
    errors.push('voyage_number is required for sea shipments');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// POST /api/shipments - Create new shipment
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Basic validation
    if (!data.trackingNumber) {
      return NextResponse.json(
        { 
          success: false, 
          message_he: 'מספר מעקב חסר',
          message: 'tracking_number is required' 
        },
        { status: 400 }
      );
    }
    
    if (!data.shipmentType) {
      return NextResponse.json(
        { 
          success: false, 
          message_he: 'סוג משלוח חסר',
          message: 'shipment_type is required' 
        },
        { status: 400 }
      );
    }
    
    // Sea shipment specific validation
    if (data.shipmentType === 'sea' || data.shipmentType === 'ocean') {
      const validation = validateSeaShipment(data);
      if (!validation.valid) {
        return NextResponse.json(
          { 
            success: false, 
            message_he: 'שגיאה בולידציה למשלוח ימי',
            message: 'Sea shipment validation failed',
            errors: validation.errors 
          },
          { status: 400 }
        );
      }
    }
    
    // TODO: Save to database using Prisma
    // const shipment = await prisma.shipment.create({
    //   data: {
    //     trackingNumber: data.trackingNumber,
    //     shipmentType: data.shipmentType,
    //     carrier: data.carrier,
    //     status: data.status || 'pending',
    //     origin: data.origin,
    //     destination: data.destination,
    //     customerName: data.customerName,
    //     customerEmail: data.customerEmail,
    //     customerPhone: data.customerPhone,
    //     containerNumber: data.containerNumber,
    //     containerCount: data.containerCount || 1,
    //     vesselName: data.vesselName,
    //     voyageNumber: data.voyageNumber,
    //     blNumber: data.blNumber,
    //     blDocumentUrl: data.blDocumentUrl,
    //     notes: data.notes,
    //   }
    // });
    
    // Mock response for now
    return NextResponse.json({
      success: true,
      message_he: 'משלוח נוצר בהצלחה',
      message: 'Shipment created successfully',
      shipment: {
        id: 'mock-id-' + Date.now(),
        trackingNumber: data.trackingNumber,
        shipmentType: data.shipmentType,
        ...data
      }
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Error creating shipment:', error);
    return NextResponse.json(
      { 
        success: false, 
        message_he: 'שגיאה ביצירת משלוח',
        message: 'Failed to create shipment',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// GET /api/shipments?trackingNumber=XXX - Get shipment by tracking number
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const trackingNumber = searchParams.get('trackingNumber');
    
    if (!trackingNumber) {
      return NextResponse.json(
        { 
          success: false, 
          message_he: 'מספר מעקב חסר',
          message: 'tracking_number parameter is required' 
        },
        { status: 400 }
      );
    }
    
    // TODO: Fetch from database
    // const shipment = await prisma.shipment.findUnique({
    //   where: { trackingNumber }
    // });
    
    // Mock response
    return NextResponse.json({
      success: true,
      message_he: 'משלוח נמצא',
      message: 'Shipment found',
      shipment: {
        id: 'mock-id',
        trackingNumber,
        shipmentType: 'sea',
        carrier: 'MAERSK',
        status: 'in_transit',
        origin: 'Shanghai, China',
        destination: 'Ashdod, Israel',
        containerNumber: 'MSCU1234567',
        containerCount: 1,
        vesselName: 'MSC MARIA',
        voyageNumber: '202W',
        blNumber: 'MAEU123456789',
        createdAt: new Date().toISOString()
      }
    });
    
  } catch (error: any) {
    console.error('Error fetching shipment:', error);
    return NextResponse.json(
      { 
        success: false, 
        message_he: 'שגיאה בשליפת משלוח',
        message: 'Failed to fetch shipment',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// PUT /api/shipments - Update shipment
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    
    if (!data.trackingNumber) {
      return NextResponse.json(
        { 
          success: false, 
          message_he: 'מספר מעקב חסר',
          message: 'tracking_number is required' 
        },
        { status: 400 }
      );
    }
    
    // TODO: Update in database
    // const shipment = await prisma.shipment.update({
    //   where: { trackingNumber: data.trackingNumber },
    //   data: { ...data }
    // });
    
    return NextResponse.json({
      success: true,
      message_he: 'משלוח עודכן בהצלחה',
      message: 'Shipment updated successfully',
      shipment: { ...data }
    });
    
  } catch (error: any) {
    console.error('Error updating shipment:', error);
    return NextResponse.json(
      { 
        success: false, 
        message_he: 'שגיאה בעדכון משלוח',
        message: 'Failed to update shipment',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
