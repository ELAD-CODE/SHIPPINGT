# CSV Import Template for Shipments

This document describes the CSV format for bulk importing shipments, including support for sea shipments (containers & Bill of Lading).

## Overview

The CSV import feature allows you to upload multiple shipments at once. This is useful for:
- Importing historical shipment data
- Bulk tracking setup
- Integration with warehouse management systems
- Migrating from other tracking systems

## CSV Format Specifications

### File Requirements

- **Format:** UTF-8 encoded CSV
- **Delimiter:** Comma (`,`)
- **Text Qualifier:** Double quotes (`"`) for fields containing commas
- **Line Ending:** LF (`\n`) or CRLF (`\r\n`)
- **Header Row:** Required (first row)
- **Max File Size:** 10 MB
- **Max Rows:** 10,000 shipments per file

### Required Columns

| Column Name | Type | Description | Example |
|------------|------|-------------|---------|
| `tracking_number` | String | Primary tracking identifier | `MAEU123456789` |
| `shipment_type` | Enum | Type of shipment | `air`, `sea` |

### Optional Columns (All Shipments)

| Column Name | Type | Description | Example |
|------------|------|-------------|---------|
| `carrier` | String | Carrier/shipping line name | `Maersk Line` |
| `origin` | String | Origin port/city | `Shanghai, China` |
| `destination` | String | Destination port/city | `Ashdod, Israel` |
| `customer_name` | String | Customer/consignee name | `ABC Trading Ltd` |
| `customer_email` | Email | Customer email for notifications | `customer@example.com` |
| `customer_phone` | String | Customer phone number | `+972-52-842-0009` |
| `description` | String | Cargo description | `Electronics` |
| `reference_number` | String | Internal reference | `PO-2024-001` |
| `notes` | Text | Additional notes | `Urgent delivery` |

### Sea Shipment Specific Columns

When `shipment_type` is `sea`, these additional fields are available:

| Column Name | Type | Required | Description | Example |
|------------|------|----------|-------------|---------|
| `container_number` | String | Yes* | ISO container number | `MSCU1234567` |
| `container_count` | Integer | No | Number of containers | `2` |
| `bl_number` | String | Yes* | Bill of Lading number | `MAEU123456789` |
| `vessel_name` | String | No | Vessel name | `MSC OSCAR` |
| `voyage_number` | String | No | Voyage/rotation number | `026W` |
| `bl_document_url` | URL | No | Link to B/L document | `https://s3.../bl.pdf` |

*Required for sea shipments

### Air Shipment Specific Columns

When `shipment_type` is `air`:

| Column Name | Type | Description | Example |
|------------|------|-------------|---------|
| `awb_number` | String | Air Waybill number | `157-12345678` |
| `airline` | String | Airline name | `Emirates` |
| `flight_number` | String | Flight number | `EK932` |

## CSV Template

### Template for Air Shipments

```csv
tracking_number,shipment_type,carrier,origin,destination,customer_name,customer_email,customer_phone,awb_number,airline,description,reference_number,notes
157-12345678,air,Emirates,Dubai,Tel Aviv,John Doe,john@example.com,+972-52-123-4567,157-12345678,Emirates,Documents,REF001,Urgent
074-98765432,air,KLM,Amsterdam,Tel Aviv,Jane Smith,jane@example.com,+972-54-987-6543,074-98765432,KLM,Electronics,REF002,Handle with care
```

### Template for Sea Shipments

```csv
tracking_number,shipment_type,carrier,origin,destination,customer_name,customer_email,customer_phone,container_number,container_count,bl_number,vessel_name,voyage_number,description,reference_number,notes
MAEU123456789,sea,Maersk Line,Shanghai,Ashdod,ABC Trading,abc@example.com,+972-52-111-2222,MSCU1234567,2,MAEU123456789,MSC OSCAR,026W,Furniture,PO-2024-001,Check customs
COSU987654321,sea,COSCO,Shenzhen,Haifa,XYZ Imports,xyz@example.com,+972-53-333-4444,CSNU9876543,1,COSU987654321,COSCO SHIPPING UNIVERSE,045E,Electronics,PO-2024-002,Temperature controlled
HLCU456789012,sea,Hapag-Lloyd,Hamburg,Ashdod,Global Logistics,info@global.co.il,+972-54-555-6666,HLCU4567890,3,HLCU456789012,BUDAPEST EXPRESS,112N,Machinery,PO-2024-003,Oversized cargo
```

### Mixed Shipments Template

```csv
tracking_number,shipment_type,carrier,origin,destination,customer_name,customer_email,customer_phone,container_number,container_count,bl_number,vessel_name,voyage_number,awb_number,airline,description,reference_number,notes
MAEU123456789,sea,Maersk,Shanghai,Ashdod,ABC Ltd,abc@mail.com,+972-52-111-2222,MSCU1234567,1,MAEU123456789,MSC OSCAR,026W,,,Furniture,PO-001,Sea freight
157-12345678,air,Emirates,Dubai,Tel Aviv,XYZ Corp,xyz@mail.com,+972-53-222-3333,,,,,157-12345678,Emirates,Documents,PO-002,Air freight
1234567890,air,DHL,London,Tel Aviv,Global Inc,info@global.com,+972-54-333-4444,,,,,1234567890,DHL Express,Samples,PO-003,Express delivery
```

## Validation Rules

### General Rules

1. **tracking_number**
   - Must not be empty
   - Must be unique in the file
   - Maximum 50 characters
   - Alphanumeric with hyphens allowed

2. **shipment_type**
   - Required
   - Must be one of: `air`, `sea`
   - Case-insensitive (will be normalized)

3. **Email addresses**
   - Must be valid email format
   - Example: `user@domain.com`

4. **Phone numbers**
   - International format recommended
   - Example: `+972-52-842-0009`

### Sea Shipment Validation

1. **container_number**
   - Required when `shipment_type = sea`
   - Must match ISO 6346 format: 4 letters + 6 digits + 1 check digit
   - Example: `MSCU1234567`
   - Check digit will be validated

2. **bl_number**
   - Required when `shipment_type = sea`
   - Typically 4 letters + 8-12 digits
   - Example: `MAEU123456789`

3. **container_count**
   - Optional
   - Integer between 1 and 100
   - Default: 1 if not provided

4. **vessel_name**
   - Optional
   - Maximum 100 characters
   - Example: `MSC OSCAR`

5. **voyage_number**
   - Optional
   - Maximum 20 characters
   - Example: `026W`, `045E`, `112N`

### Air Shipment Validation

1. **awb_number**
   - Recommended for air shipments
   - Format: 3 digits + hyphen + 8 digits
   - Example: `157-12345678`
   - Will be validated against airline prefix

## Error Handling

### Import Process

1. **Validation Phase**
   - File is parsed and validated
   - All errors are collected
   - No data is saved if any row has errors

2. **Error Report**
   - Shows row number and column with error
   - Provides clear error message
   - Suggests fixes

3. **Partial Success**
   - Not supported - all or nothing
   - Fix errors and re-upload

### Common Errors

| Error Code | Description | Solution |
|-----------|-------------|----------|
| `MISSING_REQUIRED_FIELD` | Required column is empty | Fill in the missing value |
| `INVALID_SHIPMENT_TYPE` | Invalid shipment type | Use `air` or `sea` |
| `INVALID_CONTAINER_NUMBER` | Container number format invalid | Check ISO 6346 format |
| `INVALID_BL_NUMBER` | B/L number missing for sea shipment | Provide B/L number |
| `DUPLICATE_TRACKING_NUMBER` | Tracking number appears twice | Remove duplicate |
| `INVALID_EMAIL` | Email format invalid | Check email format |
| `INVALID_PHONE` | Phone format invalid | Use international format |
| `CONTAINER_CHECK_DIGIT` | Check digit doesn't match | Verify container number |

## Usage Examples

### Example 1: Import Sea Shipments Only

```csv
tracking_number,shipment_type,carrier,container_number,bl_number,vessel_name,customer_name,customer_email
MAEU111111111,sea,Maersk,MSCU1111111,MAEU111111111,MSC SOFIA,Company A,companya@example.com
COSU222222222,sea,COSCO,CSNU2222222,COSU222222222,COSCO GLORY,Company B,companyb@example.com
HLCU333333333,sea,Hapag-Lloyd,HLCU3333333,HLCU333333333,BUDAPEST EXPRESS,Company C,companyc@example.com
```

### Example 2: Import with Optional Fields

```csv
tracking_number,shipment_type,carrier,container_number,bl_number,container_count,origin,destination,description,reference_number
MAEU123456789,sea,Maersk,MSCU1234567,MAEU123456789,2,Shanghai,Ashdod,Electronics,PO-2024-100
MAEU987654321,sea,Maersk,MSCU9876543,MAEU987654321,1,Ningbo,Haifa,Furniture,PO-2024-101
```

### Example 3: Import with All Fields

```csv
tracking_number,shipment_type,carrier,origin,destination,customer_name,customer_email,customer_phone,container_number,container_count,bl_number,vessel_name,voyage_number,bl_document_url,description,reference_number,notes
MAEU123456789,sea,Maersk Line,Shanghai,Ashdod Port,ABC Trading Ltd,contact@abctrading.com,+972-52-842-0009,MSCU1234567,2,MAEU123456789,MSC OSCAR,026W,https://s3.amazonaws.com/docs/bl_123.pdf,Furniture and Home Goods,PO-2024-001,Temperature controlled containers. Customs clearance required.
```

## API Integration

You can also import via API:

```bash
# Upload CSV file
curl -X POST https://yourapp.com/api/shipments/import \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@shipments.csv"

# Response
{
  "success": true,
  "imported": 150,
  "failed": 0,
  "errors": []
}
```

## Best Practices

1. **Test with Small Files First**
   - Start with 5-10 rows
   - Verify format is correct
   - Then upload larger files

2. **Use Excel for Editing**
   - Easier than text editor
   - Save as "CSV UTF-8"
   - Check preview before upload

3. **Validate Tracking Numbers**
   - Verify with carrier first
   - Check format matches examples
   - Ensure no duplicates

4. **Keep Backup**
   - Save original file
   - Keep error reports
   - Document any manual fixes

5. **Use Reference Numbers**
   - Link to your internal system
   - Makes tracking easier
   - Useful for reports

## Downloadable Templates

Templates are available in the application:

1. Go to **Shipments → Import**
2. Click **Download CSV Template**
3. Choose: **Air Shipments**, **Sea Shipments**, or **Mixed**

Or download from repository:
- `templates/csv/air_shipments_template.csv`
- `templates/csv/sea_shipments_template.csv`
- `templates/csv/mixed_shipments_template.csv`

## Support

For issues with CSV import:
- Check error messages in import results
- Review this documentation
- Contact support: +972-52-842-0009
- Email: support@shipmenttracking.co.il

---

**Last updated:** 2026-01-22
**Template version:** 2.0
