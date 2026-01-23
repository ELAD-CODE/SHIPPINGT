-- CreateTable
CREATE TABLE "Shipment" (
    "id" TEXT NOT NULL,
    "trackingNumber" TEXT NOT NULL,
    "shipmentType" TEXT NOT NULL,
    "carrier" TEXT,
    "status" TEXT,
    "origin" TEXT,
    "destination" TEXT,
    "originCountry" TEXT,
    "destinationCountry" TEXT,
    "customerName" TEXT,
    "customerEmail" TEXT,
    "customerPhone" TEXT,
    "containerNumber" TEXT,
    "containerCount" INTEGER DEFAULT 1,
    "vesselName" TEXT,
    "voyageNumber" TEXT,
    "blNumber" TEXT,
    "blDocumentUrl" TEXT,
    "awbNumber" TEXT,
    "flightNumber" TEXT,
    "nickname" TEXT,
    "notes" TEXT,
    "estimatedArrival" TIMESTAMP(3),
    "actualArrival" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
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
CREATE INDEX "Shipment_createdAt_idx" ON "Shipment"("createdAt");
