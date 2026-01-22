-- CreateEnum for ShipmentType
CREATE TYPE "ShipmentType" AS ENUM ('air', 'sea', 'road');

-- CreateTable: Shipment with full sea and air shipment support
CREATE TABLE "Shipment" (
    "id" TEXT NOT NULL,
    "trackingNumber" TEXT NOT NULL,
    "referenceNumber" TEXT,
    "shipmentType" "ShipmentType" NOT NULL,
    "carrier" TEXT,
    "carrierCode" TEXT,
    "originCountry" TEXT,
    "originCity" TEXT,
    "originPort" TEXT,
    "destinationCountry" TEXT,
    "destinationCity" TEXT,
    "destinationPort" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "statusHe" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "estimatedDelivery" TIMESTAMP(3),
    "actualDelivery" TIMESTAMP(3),
    
    -- Sea shipment fields
    "containerNumber" TEXT,
    "containerType" TEXT,
    "containerCount" INTEGER,
    "vesselName" TEXT,
    "vesselIMO" TEXT,
    "voyageNumber" TEXT,
    "blNumber" TEXT,
    "blType" TEXT,
    "blDocumentUrl" TEXT,
    "portOfLoading" TEXT,
    "portOfDischarge" TEXT,
    "etd" TIMESTAMP(3),
    "atd" TIMESTAMP(3),
    "eta" TIMESTAMP(3),
    "ata" TIMESTAMP(3),
    
    -- Air shipment fields
    "awbNumber" TEXT,
    "awbPrefix" TEXT,
    "flightNumber" TEXT,
    "flightDate" TIMESTAMP(3),
    "airline" TEXT,
    "airlineCode" TEXT,
    
    -- General fields
    "weight" DOUBLE PRECISION,
    "volume" DOUBLE PRECISION,
    "pieces" INTEGER,
    "declaredValue" DOUBLE PRECISION,
    "currency" TEXT,
    "invoiceUrl" TEXT,
    "packingListUrl" TEXT,
    "customsStatus" TEXT,
    "customsDate" TIMESTAMP(3),
    "customsReference" TEXT,
    "notes" TEXT,
    "specialInstructions" TEXT,
    "incoterm" TEXT,
    "trackingData" JSONB,
    "lastTracked" TIMESTAMP(3),
    "userId" TEXT,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_trackingNumber_key" ON "Shipment"("trackingNumber");

-- CreateIndex
CREATE INDEX "Shipment_trackingNumber_idx" ON "Shipment"("trackingNumber");

-- CreateIndex
CREATE INDEX "Shipment_shipmentType_idx" ON "Shipment"("shipmentType");

-- CreateIndex
CREATE INDEX "Shipment_status_idx" ON "Shipment"("status");

-- CreateIndex
CREATE INDEX "Shipment_containerNumber_idx" ON "Shipment"("containerNumber");

-- CreateIndex
CREATE INDEX "Shipment_blNumber_idx" ON "Shipment"("blNumber");

-- CreateIndex
CREATE INDEX "Shipment_awbNumber_idx" ON "Shipment"("awbNumber");

-- CreateIndex
CREATE INDEX "Shipment_estimatedDelivery_idx" ON "Shipment"("estimatedDelivery");

-- CreateIndex
CREATE INDEX "Shipment_createdAt_idx" ON "Shipment"("createdAt");

-- Add comment to table
COMMENT ON TABLE "Shipment" IS 'Shipment tracking with support for air (AWB), sea (container/B/L), and road shipments';

-- Add comments to critical columns
COMMENT ON COLUMN "Shipment"."shipmentType" IS 'Type of shipment: air, sea, or road';
COMMENT ON COLUMN "Shipment"."containerNumber" IS 'ISO 6346 container number (e.g., MSCU1234567) - for sea shipments';
COMMENT ON COLUMN "Shipment"."blNumber" IS 'Bill of Lading number - for sea shipments';
COMMENT ON COLUMN "Shipment"."awbNumber" IS 'Air Waybill number (e.g., 157-12345678) - for air shipments';
COMMENT ON COLUMN "Shipment"."vesselName" IS 'Name of vessel/ship - for sea shipments';
COMMENT ON COLUMN "Shipment"."voyageNumber" IS 'Voyage/sailing reference - for sea shipments';
