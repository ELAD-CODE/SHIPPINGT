# CSV Import Template

This document describes the CSV template format for bulk importing shipment data.

## Overview

The CSV import feature allows you to upload multiple shipments at once, including support for sea shipments (containers and bills of lading).

## CSV Format

### Required Columns

- `tracking_number` - The tracking/reference number
- `shipment_type` - Type of shipment (see types below)
- `carrier` - Carrier/courier name (optional for auto-detection)
- `status` - Current status (optional)

### Optional Columns (General)

- `nickname` - Friendly name for the shipment
- `origin` - Origin location
- `destination` - Destination location
- `customer_name` - Customer/recipient name
- `customer_email` - Customer email
- `customer_phone` - Customer phone
- `notes` - Additional notes

### Sea Shipment Columns (Required if shipment_type=sea)

- `container_number` - ISO 6346 container number (e.g., MSCU1234567)
- `container_count` - Number of containers (default: 1)
- `vessel_name` - Vessel/ship name
- `voyage_number` - Voyage number
- `bl_number` - Bill of Lading number
- `bl_document_url` - URL to B/L document (optional)

## Shipment Types

| Type | Code | Description | Required Fields |
|------|------|-------------|----------------|
| Air Waybill | `air` or `awb` | Air freight shipments | tracking_number |
| Sea/Ocean | `sea` or `ocean` | Container/ocean freight | container_number, bl_number |
| Express | `express` | Courier shipments (DHL, FedEx, UPS) | tracking_number |
| Ground | `ground` | Ground/truck transportation | tracking_number |

## CSV Template

### Basic Template (Express/Air)

```csv
tracking_number,shipment_type,carrier,nickname,origin,destination,customer_name,customer_email,customer_phone,notes
1234567890,express,DHL,Laptop Shipment,Shanghai China,Tel Aviv Israel,John Doe,john@example.com,0501234567,Urgent delivery
ABCD12345678,awb,Lufthansa,Medical Supplies,Frankfurt Germany,Haifa Israel,Medical Center,contact@medical.com,0502345678,Temperature sensitive
```

### Sea Shipment Template

```csv
tracking_number,shipment_type,carrier,container_number,container_count,vessel_name,voyage_number,bl_number,bl_document_url,origin,destination,customer_name,notes
SEA2024001,sea,MAERSK,MSCU1234567,1,MSC MARIA,202W,MAEU123456789,https://example.com/bl.pdf,Shanghai China,Ashdod Israel,ABC Import Ltd,20ft container - electronics
SEA2024002,ocean,CMA CGM,COSU9876543,2,CMA CGM APOLLO,304E,CMAU987654321,https://example.com/bl2.pdf,Hamburg Germany,Haifa Israel,XYZ Logistics,2x40ft containers - machinery
```

### Complete Template (All Fields)

```csv
tracking_number,shipment_type,carrier,nickname,origin,destination,customer_name,customer_email,customer_phone,container_number,container_count,vessel_name,voyage_number,bl_number,bl_document_url,notes
1234567890,express,DHL,Laptop,Shanghai,Tel Aviv,John Doe,john@example.com,0501234567,,,,,,Urgent
SEA001,sea,MAERSK,Container #1,Shanghai,Ashdod,ABC Ltd,abc@example.com,0502345678,MSCU1234567,1,MSC MARIA,202W,MAEU123456789,https://bl.example.com,Electronics
157-12345678,awb,El Al Cargo,Medical,Frankfurt,Tel Aviv,Hospital,med@hospital.com,0503456789,,,,,,Temperature controlled
```

## Field Specifications

### tracking_number
- **Type:** String (required)
- **Max Length:** 50 characters
- **Format:** Alphanumeric, dashes, spaces allowed
- **Examples:** `1234567890`, `157-12345678`, `MAEU123456789`

### shipment_type
- **Type:** Enum (required)
- **Values:** `air`, `awb`, `sea`, `ocean`, `express`, `ground`
- **Default:** `express`

### carrier
- **Type:** String (optional)
- **Max Length:** 50 characters
- **Examples:** `DHL`, `FedEx`, `MAERSK`, `CMA CGM`, `El Al Cargo`
- **Note:** If omitted, system will attempt auto-detection

### container_number
- **Type:** String (required for sea shipments)
- **Format:** ISO 6346 (4 letters + 7 digits)
- **Validation:** Check digit validated
- **Examples:** `MSCU1234567`, `COSU9876543`, `TEMU4567890`

### container_count
- **Type:** Integer
- **Range:** 1-999
- **Default:** 1

### vessel_name
- **Type:** String (required for sea shipments)
- **Max Length:** 100 characters
- **Examples:** `MSC MARIA`, `CMA CGM APOLLO`, `MAERSK CHARLESTON`

### voyage_number
- **Type:** String (required for sea shipments)
- **Max Length:** 20 characters
- **Format:** Alphanumeric
- **Examples:** `202W`, `304E`, `V123`

### bl_number
- **Type:** String (required for sea shipments)
- **Max Length:** 50 characters
- **Format:** Carrier prefix + digits
- **Examples:** `MAEU123456789`, `CMAU987654321`, `COSU123456789`

### bl_document_url
- **Type:** URL (optional)
- **Format:** Valid HTTPS URL
- **Examples:** `https://example.com/documents/bl.pdf`

### customer_phone
- **Type:** String (optional)
- **Format:** Israeli phone number (050xxxxxxx) or international
- **Examples:** `0501234567`, `+972501234567`

### customer_email
- **Type:** Email (optional)
- **Validation:** Valid email format

## Import Process

### Step 1: Prepare CSV

1. Download the template (link in app)
2. Fill in your data
3. Save as CSV (UTF-8 encoding)

### Step 2: Validate

Check that:
- [ ] All required columns present
- [ ] No empty tracking numbers
- [ ] Sea shipments have container_number and bl_number
- [ ] Container numbers are valid ISO 6346 format
- [ ] Phone numbers are in valid format
- [ ] Email addresses are valid

### Step 3: Upload

1. Go to **Bulk Import** section
2. Click **Choose File**
3. Select your CSV file
4. Click **Import**
5. Review validation results

### Step 4: Review

- Check import summary
- Fix any errors reported
- Re-upload if needed

## Validation Rules

### Required Field Validation

```javascript
// All shipments
if (!tracking_number) {
  error("tracking_number is required");
}

// Sea shipments
if (shipment_type === 'sea' || shipment_type === 'ocean') {
  if (!container_number) {
    error("container_number is required for sea shipments");
  }
  if (!bl_number) {
    error("bl_number is required for sea shipments");
  }
}
```

### Format Validation

```javascript
// Container number (ISO 6346)
const containerRegex = /^[A-Z]{4}[0-9]{7}$/;
if (container_number && !containerRegex.test(container_number)) {
  error("Invalid container number format");
}

// Phone number (Israeli)
const phoneRegex = /^05\d{8}$/;
if (customer_phone && !phoneRegex.test(customer_phone.replace(/[-\s]/g, ''))) {
  warning("Phone number may be invalid");
}

// Email
if (customer_email && !isValidEmail(customer_email)) {
  error("Invalid email format");
}
```

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| Missing tracking_number | Column empty | Fill in tracking number |
| Invalid container_number | Wrong format | Use ISO 6346 format (ABCD1234567) |
| Missing bl_number | Sea shipment without B/L | Add bill of lading number |
| Duplicate tracking_number | Number already exists | Use unique numbers or update existing |
| Invalid shipment_type | Unknown type | Use: air, sea, express, ground |

### Error Response Format

```json
{
  "success": false,
  "errors": [
    {
      "row": 3,
      "field": "container_number",
      "value": "INVALID123",
      "message": "Invalid container number format (must be ISO 6346)"
    },
    {
      "row": 5,
      "field": "bl_number",
      "value": "",
      "message": "bl_number is required for sea shipments"
    }
  ],
  "imported": 8,
  "failed": 2,
  "total": 10
}
```

## Example Files

### Download Templates

- [Basic Template (CSV)](https://example.com/templates/basic.csv)
- [Sea Shipment Template (CSV)](https://example.com/templates/sea-shipment.csv)
- [Complete Template (CSV)](https://example.com/templates/complete.csv)

### Sample Data Files

- [Sample Express Shipments](https://example.com/samples/express-sample.csv)
- [Sample Sea Shipments](https://example.com/samples/sea-sample.csv)
- [Sample Mixed Shipments](https://example.com/samples/mixed-sample.csv)

## API Import

You can also import via API:

```bash
curl -X POST https://api.example.com/import/csv \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@shipments.csv"
```

Response:
```json
{
  "success": true,
  "imported": 45,
  "failed": 0,
  "total": 45,
  "errors": []
}
```

## Best Practices

### Data Quality

- ✅ Use consistent formatting
- ✅ Validate data before upload
- ✅ Use UTF-8 encoding
- ✅ Avoid special characters in IDs
- ✅ Include customer contact info
- ✅ Add notes for context

### Performance

- ✅ Limit to 1000 rows per file
- ✅ Split large imports
- ✅ Import during off-peak hours
- ✅ Monitor import status

### Security

- ✅ Don't include sensitive data in notes
- ✅ Use HTTPS for document URLs
- ✅ Verify B/L document authenticity
- ✅ Review data before final import

## Troubleshooting

### File Won't Upload

- Check file size (max 5MB)
- Verify CSV format (not Excel)
- Ensure UTF-8 encoding
- Remove special characters

### Validation Errors

- Review error messages
- Fix data in CSV
- Re-upload corrected file

### Import Hangs

- Reduce file size
- Check network connection
- Try again during off-peak

## Support

For CSV import issues:
- Email: support@example.com
- Phone: 052-842-0009
- Documentation: /docs/csv-import

---

**Last Updated:** 2026-01-22
