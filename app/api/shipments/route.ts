import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { 
  CreateShipmentRequest, 
  ShipmentResponse, 
  ShipmentsListResponse,
  ValidationError,
  Shipment
} from '@/types/shipment';

// Helper function to convert Prisma shipment to API Shipment type
function toShipmentType(prismaShipment: any): Shipment {
  return {
    ...prismaShipment,
    createdAt: prismaShipment.createdAt.toISOString(),
    updatedAt: prismaShipment.updatedAt.toISOString(),
    lastUpdate: prismaShipment.lastUpdate?.toISOString(),
    estimatedArrival: prismaShipment.estimatedArrival?.toISOString(),
    actualArrival: prismaShipment.actualArrival?.toISOString(),
  } as Shipment;
}

/**
 * GET /api/shipments
 * List all shipments with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const perPage = parseInt(searchParams.get('perPage') || '20', 10);
    const shipmentType = searchParams.get('shipmentType');
    const status = searchParams.get('status');
    const customerEmail = searchParams.get('customerEmail');

    // Build where clause
    const where: Prisma.ShipmentWhereInput = {};
    if (shipmentType && (shipmentType === 'air' || shipmentType === 'sea')) {
      where.shipmentType = shipmentType;
    }
    if (status) {
      where.status = status;
    }
    if (customerEmail) {
      where.customerEmail = customerEmail;
    }

    // Get total count
    const total = await prisma.shipment.count({ where });

    // Get shipments with pagination
    const shipments = await prisma.shipment.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: 'desc' },
    });

    const response: ShipmentsListResponse = {
      success: true,
      data: {
        shipments: shipments.map(toShipmentType),
        total,
        page,
        perPage,
      },
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error fetching shipments:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch shipments',
        message_he: 'שגיאה בטעינת המשלוחים',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/shipments
 * Create a new shipment
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateShipmentRequest = await request.json();

    // Validate required fields
    const errors = validateShipment(body);
    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          message_he: 'שגיאת תיקוף',
          errors,
        },
        { status: 400 }
      );
    }

    // Check if tracking number already exists
    const existing = await prisma.shipment.findUnique({
      where: { trackingNumber: body.trackingNumber },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: 'Tracking number already exists',
          message_he: 'מספר מעקב כבר קיים במערכת',
        },
        { status: 409 }
      );
    }

    // Create shipment
    const shipment = await prisma.shipment.create({
      data: {
        trackingNumber: body.trackingNumber,
        shipmentType: body.shipmentType,
        carrier: body.carrier,
        origin: body.origin,
        destination: body.destination,
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone,
        description: body.description,
        referenceNumber: body.referenceNumber,
        notes: body.notes,
        
        // Air specific
        awbNumber: body.awbNumber,
        airline: body.airline,
        flightNumber: body.flightNumber,
        
        // Sea specific
        containerNumber: body.containerNumber,
        containerCount: body.containerCount,
        blNumber: body.blNumber,
        vesselName: body.vesselName,
        voyageNumber: body.voyageNumber,
        blDocumentUrl: body.blDocumentUrl,
        
        status: 'pending',
      },
    });

    const response: ShipmentResponse = {
      success: true,
      message: 'Shipment created successfully',
      message_he: 'המשלוח נוסף בהצלחה',
      data: toShipmentType(shipment),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error('Error creating shipment:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create shipment',
        message_he: 'שגיאה ביצירת משלוח',
      },
      { status: 500 }
    );
  }
}

/**
 * Validate shipment data
 */
function validateShipment(data: CreateShipmentRequest): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required fields
  if (!data.trackingNumber || data.trackingNumber.trim() === '') {
    errors.push({
      field: 'trackingNumber',
      message: 'Tracking number is required',
      message_he: 'מספר מעקב חובה',
    });
  }

  if (!data.shipmentType || !['air', 'sea'].includes(data.shipmentType)) {
    errors.push({
      field: 'shipmentType',
      message: 'Shipment type must be "air" or "sea"',
      message_he: 'סוג משלוח חייב להיות "air" או "sea"',
    });
  }

  // Sea shipment specific validation
  if (data.shipmentType === 'sea') {
    if (!data.containerNumber || data.containerNumber.trim() === '') {
      errors.push({
        field: 'containerNumber',
        message: 'Container number is required for sea shipments',
        message_he: 'מספר מכולה חובה למשלוחים ימיים',
      });
    } else {
      // Validate container number format (ISO 6346)
      const containerRegex = /^[A-Z]{4}\d{6}\d{1}$/;
      if (!containerRegex.test(data.containerNumber.replace(/[\s-]/g, '').toUpperCase())) {
        errors.push({
          field: 'containerNumber',
          message: 'Invalid container number format (expected: ABCD1234567)',
          message_he: 'פורמט מספר מכולה לא תקין (נדרש: ABCD1234567)',
        });
      }
    }

    if (!data.blNumber || data.blNumber.trim() === '') {
      errors.push({
        field: 'blNumber',
        message: 'Bill of Lading number is required for sea shipments',
        message_he: 'מספר שטר מטען (B/L) חובה למשלוחים ימיים',
      });
    }
  }

  // Validate email if provided
  if (data.customerEmail && !isValidEmail(data.customerEmail)) {
    errors.push({
      field: 'customerEmail',
      message: 'Invalid email format',
      message_he: 'פורמט אימייל לא תקין',
    });
  }

  // Validate container count if provided
  if (data.containerCount !== undefined) {
    if (data.containerCount < 1 || data.containerCount > 100) {
      errors.push({
        field: 'containerCount',
        message: 'Container count must be between 1 and 100',
        message_he: 'מספר מכולות חייב להיות בין 1 ל-100',
      });
    }
  }

  return errors;
}

/**
 * Simple email validation
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
