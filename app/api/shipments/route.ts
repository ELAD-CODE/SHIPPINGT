import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, ShipmentType } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Validation for sea shipments
 * Must have at least one of: containerNumber or blNumber
 */
function validateSeaShipment(data: any): { valid: boolean; error?: string } {
  if (data.shipmentType === 'sea') {
    if (!data.containerNumber && !data.blNumber) {
      return {
        valid: false,
        error: 'Sea shipments must include either container_number or bl_number'
      };
    }
    
    // Validate container number format (ISO 6346)
    if (data.containerNumber) {
      const containerRegex = /^[A-Z]{4}\d{7}$/;
      if (!containerRegex.test(data.containerNumber)) {
        return {
          valid: false,
          error: 'Invalid container number format. Must be 4 letters + 7 digits (ISO 6346)'
        };
      }
    }
    
    // Validate B/L number format
    if (data.blNumber) {
      const blRegex = /^[A-Z]{4}\d{8,12}$/;
      if (!blRegex.test(data.blNumber)) {
        return {
          valid: false,
          error: 'Invalid B/L number format. Must be 4 letters + 8-12 digits'
        };
      }
    }
  }
  
  return { valid: true };
}

/**
 * Validation for air shipments
 * Must have awbNumber
 */
function validateAirShipment(data: any): { valid: boolean; error?: string } {
  if (data.shipmentType === 'air') {
    if (!data.awbNumber && !data.trackingNumber) {
      return {
        valid: false,
        error: 'Air shipments must include awb_number or tracking_number'
      };
    }
    
    // Validate AWB format (XXX-XXXXXXXX)
    if (data.awbNumber) {
      const awbRegex = /^\d{3}-?\d{8}$/;
      if (!awbRegex.test(data.awbNumber)) {
        return {
          valid: false,
          error: 'Invalid AWB number format. Must be XXX-XXXXXXXX'
        };
      }
    }
  }
  
  return { valid: true };
}

/**
 * GET /api/shipments - List all shipments
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shipmentType = searchParams.get('type');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    const skip = (page - 1) * limit;
    
    const where: any = {};
    if (shipmentType) where.shipmentType = shipmentType;
    if (status) where.status = status;
    
    const shipments = await prisma.shipment.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    });
    
    const total = await prisma.shipment.count({ where });
    
    return NextResponse.json({
      success: true,
      data: shipments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('GET /api/shipments error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/shipments - Create new shipment
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.trackingNumber) {
      return NextResponse.json(
        { success: false, error: 'tracking_number is required' },
        { status: 400 }
      );
    }
    
    if (!body.shipmentType) {
      return NextResponse.json(
        { success: false, error: 'shipment_type is required' },
        { status: 400 }
      );
    }
    
    // Validate shipment type
    const validTypes: ShipmentType[] = ['air', 'sea', 'road'];
    if (!validTypes.includes(body.shipmentType)) {
      return NextResponse.json(
        { success: false, error: 'shipment_type must be one of: air, sea, road' },
        { status: 400 }
      );
    }
    
    // Type-specific validation
    if (body.shipmentType === 'sea') {
      const validation = validateSeaShipment(body);
      if (!validation.valid) {
        return NextResponse.json(
          { success: false, error: validation.error },
          { status: 400 }
        );
      }
    }
    
    if (body.shipmentType === 'air') {
      const validation = validateAirShipment(body);
      if (!validation.valid) {
        return NextResponse.json(
          { success: false, error: validation.error },
          { status: 400 }
        );
      }
    }
    
    // Check if tracking number already exists
    const existing = await prisma.shipment.findUnique({
      where: { trackingNumber: body.trackingNumber }
    });
    
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Shipment with this tracking number already exists' },
        { status: 409 }
      );
    }
    
    // Create shipment
    const shipment = await prisma.shipment.create({
      data: {
        trackingNumber: body.trackingNumber,
        referenceNumber: body.referenceNumber,
        shipmentType: body.shipmentType,
        carrier: body.carrier,
        carrierCode: body.carrierCode,
        
        originCountry: body.originCountry,
        originCity: body.originCity,
        originPort: body.originPort,
        destinationCountry: body.destinationCountry,
        destinationCity: body.destinationCity,
        destinationPort: body.destinationPort,
        
        status: body.status || 'pending',
        statusHe: body.statusHe,
        
        estimatedDelivery: body.estimatedDelivery ? new Date(body.estimatedDelivery) : undefined,
        
        // Sea shipment fields
        containerNumber: body.containerNumber,
        containerType: body.containerType,
        containerCount: body.containerCount,
        vesselName: body.vesselName,
        vesselIMO: body.vesselIMO,
        voyageNumber: body.voyageNumber,
        blNumber: body.blNumber,
        blType: body.blType,
        blDocumentUrl: body.blDocumentUrl,
        portOfLoading: body.portOfLoading,
        portOfDischarge: body.portOfDischarge,
        etd: body.etd ? new Date(body.etd) : undefined,
        atd: body.atd ? new Date(body.atd) : undefined,
        eta: body.eta ? new Date(body.eta) : undefined,
        ata: body.ata ? new Date(body.ata) : undefined,
        
        // Air shipment fields
        awbNumber: body.awbNumber,
        awbPrefix: body.awbPrefix,
        flightNumber: body.flightNumber,
        flightDate: body.flightDate ? new Date(body.flightDate) : undefined,
        airline: body.airline,
        airlineCode: body.airlineCode,
        
        // General fields
        weight: body.weight,
        volume: body.volume,
        pieces: body.pieces,
        declaredValue: body.declaredValue,
        currency: body.currency,
        invoiceUrl: body.invoiceUrl,
        packingListUrl: body.packingListUrl,
        customsStatus: body.customsStatus,
        customsDate: body.customsDate ? new Date(body.customsDate) : undefined,
        customsReference: body.customsReference,
        notes: body.notes,
        specialInstructions: body.specialInstructions,
        incoterm: body.incoterm,
        trackingData: body.trackingData,
        userId: body.userId,
      }
    });
    
    return NextResponse.json({
      success: true,
      data: shipment,
      message: 'Shipment created successfully'
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('POST /api/shipments error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
