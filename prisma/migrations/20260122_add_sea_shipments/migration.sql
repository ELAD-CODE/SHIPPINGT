-- Migration: Add Sea Shipments Support
-- Date: 2026-01-22
-- Description: Adds Shipment table with support for sea freight (containers & Bill of Lading)

-- Create Shipment table
CREATE TABLE "Shipment" (
    "id" TEXT NOT NULL,
    "trackingNumber" TEXT NOT NULL,
    "shipmentType" TEXT NOT NULL DEFAULT 'air',
    "carrier" TEXT,
    
    -- Origin and destination
    "origin" TEXT,
    "destination" TEXT,
    
    -- Customer details
    "customerName" TEXT,
    "customerEmail" TEXT,
    "customerPhone" TEXT,
    
    -- Cargo details
    "description" TEXT,
    "referenceNumber" TEXT,
    "notes" TEXT,
    
    -- Air shipment specific fields
    "awbNumber" TEXT,
    "airline" TEXT,
    "flightNumber" TEXT,
    
    -- Sea shipment specific fields (NEW)
    "containerNumber" TEXT,
    "containerCount" INTEGER,
    "blNumber" TEXT,
    "vesselName" TEXT,
    "voyageNumber" TEXT,
    "blDocumentUrl" TEXT,
    
    -- Status and tracking
    "status" TEXT,
    "lastUpdate" TIMESTAMP(3),
    "estimatedArrival" TIMESTAMP(3),
    "actualArrival" TIMESTAMP(3),
    
    -- Timestamps
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- Create unique index on tracking number
CREATE UNIQUE INDEX "Shipment_trackingNumber_key" ON "Shipment"("trackingNumber");

-- Create indexes for better query performance
CREATE INDEX "Shipment_trackingNumber_idx" ON "Shipment"("trackingNumber");
CREATE INDEX "Shipment_shipmentType_idx" ON "Shipment"("shipmentType");
CREATE INDEX "Shipment_status_idx" ON "Shipment"("status");
CREATE INDEX "Shipment_customerEmail_idx" ON "Shipment"("customerEmail");
CREATE INDEX "Shipment_containerNumber_idx" ON "Shipment"("containerNumber");
CREATE INDEX "Shipment_blNumber_idx" ON "Shipment"("blNumber");

-- Add comments for documentation
COMMENT ON TABLE "Shipment" IS 'Main shipment tracking table supporting both air and sea freight';
COMMENT ON COLUMN "Shipment"."shipmentType" IS 'Type of shipment: air or sea';
COMMENT ON COLUMN "Shipment"."containerNumber" IS 'ISO 6346 container number (for sea shipments)';
COMMENT ON COLUMN "Shipment"."blNumber" IS 'Bill of Lading number (for sea shipments)';
COMMENT ON COLUMN "Shipment"."vesselName" IS 'Name of the vessel/ship (for sea shipments)';
COMMENT ON COLUMN "Shipment"."voyageNumber" IS 'Voyage or rotation number (for sea shipments)';

-- Add check constraint for shipment type
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_shipmentType_check" 
    CHECK ("shipmentType" IN ('air', 'sea'));

-- Add check constraint: sea shipments must have container_number and bl_number
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_sea_required_fields" 
    CHECK (
        ("shipmentType" != 'sea') OR 
        ("containerNumber" IS NOT NULL AND "blNumber" IS NOT NULL)
    );

-- Migration verification query
-- SELECT 
--     COUNT(*) as total_shipments,
--     COUNT(*) FILTER (WHERE "shipmentType" = 'air') as air_shipments,
--     COUNT(*) FILTER (WHERE "shipmentType" = 'sea') as sea_shipments,
--     COUNT(*) FILTER (WHERE "containerNumber" IS NOT NULL) as with_container
-- FROM "Shipment";
