ALTER TABLE shipments
  ADD COLUMN shipment_type VARCHAR(10) NOT NULL DEFAULT 'air',
  ADD COLUMN container_number VARCHAR(128),
  ADD COLUMN container_count INTEGER DEFAULT 0,
  ADD COLUMN vessel_name VARCHAR(256),
  ADD COLUMN voyage_number VARCHAR(128),
  ADD COLUMN bl_number VARCHAR(128),
  ADD COLUMN bl_document_url TEXT;