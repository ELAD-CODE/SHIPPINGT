```markdown
# CSV import template for shipments

Columns (header row):
shipment_id, shipment_type, reference_no, carrier, origin, destination, weight, dimensions, container_number, container_count, vessel_name, voyage_number, bl_number, bl_document_url, expected_arrival_date, notes

- shipment_type: air | sea | road
- For sea shipments include container_number(s), vessel_name, voyage_number and bl_number.
```