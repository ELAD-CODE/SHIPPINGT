-- CreateEnum
CREATE TYPE "ShipmentType" AS ENUM ('AIR', 'SEA', 'ROAD', 'EXPRESS');

-- CreateTable: Shipment with full air and sea freight support
CREATE TABLE "Shipment" (
    "id" TEXT NOT NULL,
    "trackingNumber" TEXT NOT NULL,
    "shipmentType" "ShipmentType" NOT NULL DEFAULT 'EXPRESS',
    
    -- Customer Info
    "customerName" TEXT,
    "customerEmail" TEXT,
    "customerPhone" TEXT,
    
    -- Origin & Destination
    "originCountry" TEXT,
    "originPort" TEXT,
    "originAddress" TEXT,
    "destinationCountry" TEXT,
    "destinationPort" TEXT,
    "destinationAddress" TEXT,
    
    -- Air Freight Specific
    "airWaybillNumber" TEXT,
    "flightNumber" TEXT,
    "airline" TEXT,
    "aircraftType" TEXT,
    
    -- Sea Freight Specific
    "billOfLading" TEXT,
    "containerNumber" TEXT,
    "vesselName" TEXT,
    "voyageNumber" TEXT,
    "containerType" TEXT,
    "containerCount" INTEGER,
    
    -- Document Management
    "blDocumentUrl" TEXT,
    "invoiceUrl" TEXT,
    "packingListUrl" TEXT,
    "certificateUrl" TEXT,
    
    -- Cargo Details
    "cargoDescription" TEXT,
    "hsCode" TEXT,
    "weight" DOUBLE PRECISION,
    "volume" DOUBLE PRECISION,
    "quantity" INTEGER,
    "declaredValue" DOUBLE PRECISION,
    "currency" TEXT DEFAULT 'USD',
    
    -- Status & Timeline
    "status" TEXT NOT NULL DEFAULT 'booked',
    "statusHe" TEXT,
    "bookingDate" TIMESTAMP(3),
    "departureDate" TIMESTAMP(3),
    "arrivalDate" TIMESTAMP(3),
    "estimatedArrival" TIMESTAMP(3),
    "deliveryDate" TIMESTAMP(3),
    
    -- Customs & Clearance
    "customsStatus" TEXT,
    "customsDate" TIMESTAMP(3),
    "customsNotes" TEXT,
    "dutyPaid" BOOLEAN NOT NULL DEFAULT false,
    "dutyAmount" DOUBLE PRECISION,
    
    -- Tracking & External Data
    "carrier" TEXT,
    "carrierCode" TEXT,
    "externalTrackingData" JSONB,
    
    -- Internal Management
    "assignedTo" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "notes" TEXT,
    "tags" TEXT[],
    
    -- Relationships
    "leadId" TEXT,
    
    -- Timestamps
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_trackingNumber_key" ON "Shipment"("trackingNumber");
CREATE INDEX "Shipment_trackingNumber_idx" ON "Shipment"("trackingNumber");
CREATE INDEX "Shipment_shipmentType_idx" ON "Shipment"("shipmentType");
CREATE INDEX "Shipment_status_idx" ON "Shipment"("status");
CREATE INDEX "Shipment_customsStatus_idx" ON "Shipment"("customsStatus");
CREATE INDEX "Shipment_customerEmail_idx" ON "Shipment"("customerEmail");
CREATE INDEX "Shipment_billOfLading_idx" ON "Shipment"("billOfLading");
CREATE INDEX "Shipment_containerNumber_idx" ON "Shipment"("containerNumber");
CREATE INDEX "Shipment_airWaybillNumber_idx" ON "Shipment"("airWaybillNumber");
CREATE INDEX "Shipment_createdAt_idx" ON "Shipment"("createdAt");
CREATE INDEX "Shipment_departureDate_idx" ON "Shipment"("departureDate");
CREATE INDEX "Shipment_arrivalDate_idx" ON "Shipment"("arrivalDate");
