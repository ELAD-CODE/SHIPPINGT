# CSV Import Template for Sea Shipments

Guide for importing shipments (including sea/maritime shipments) via CSV format.

---

## Table of Contents

1. [Overview](#overview)
2. [CSV Format Specification](#csv-format-specification)
3. [Field Descriptions](#field-descriptions)
4. [Example Templates](#example-templates)
5. [Validation Rules](#validation-rules)
6. [Common Errors](#common-errors)

---

## Overview

The shipment tracking system supports bulk import of shipment data via CSV files. This includes:

- ✈️ **Air shipments** (AWB - Air Waybill)
- 🚢 **Sea shipments** (Container, B/L - Bill of Lading)
- 🚛 **Road shipments** (tracking numbers)

---

## CSV Format Specification

### Basic Requirements

- **Encoding**: UTF-8
- **Delimiter**: Comma (`,`)
- **Line ending**: `\n` or `\r\n`
- **Header row**: Required (first row must be column names)
- **Date format**: ISO 8601 (`YYYY-MM-DD`) or `DD/MM/YYYY`

### CSV Structure

```csv
tracking_number,shipment_type,carrier,origin,destination,container_number,vessel_name,voyage_number,bl_number,container_count,status,estimated_delivery
```

---

## Field Descriptions

### Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `tracking_number` | String | Unique tracking/reference number | `157-12345678`, `MAEU123456789` |
| `shipment_type` | Enum | Type of shipment | `air`, `sea`, `road` |

### Optional Common Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `carrier` | String | Carrier/shipping line name | `DHL`, `MAERSK`, `MSC` |
| `origin` | String | Origin port/city/country | `Shanghai, China`, `CNSHA` |
| `destination` | String | Destination port/city | `Ashdod Port, Israel`, `ILASH` |
| `status` | String | Current status | `in_transit`, `at_port`, `customs` |
| `estimated_delivery` | Date | Estimated arrival/delivery date | `2026-02-15` |

### Sea Shipment Specific Fields

| Field | Type | Description | Required For | Example |
|-------|------|-------------|--------------|---------|
| `container_number` | String | Container ID (ISO 6346) | Container tracking | `MSCU1234567` |
| `vessel_name` | String | Ship/vessel name | Sea shipments | `MAERSK SEALAND` |
| `voyage_number` | String | Voyage/sailing reference | Sea shipments | `V123W`, `2601E` |
| `bl_number` | String | Bill of Lading number | B/L tracking | `MAEU123456789` |
| `container_count` | Integer | Number of containers | Container shipments | `2`, `10` |
| `bl_document_url` | URL | Link to B/L document | Optional | `https://docs.example.com/bl.pdf` |

### Air Shipment Specific Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `awb_number` | String | Air Waybill number | `157-12345678` |
| `flight_number` | String | Flight reference | `LY008` |
| `airline` | String | Airline code or name | `EL AL`, `LY` |

---

## Example Templates

### Sea Shipment - Container

```csv
tracking_number,shipment_type,carrier,origin,destination,container_number,vessel_name,voyage_number,status,estimated_delivery
CONT001,sea,MAERSK,Shanghai Port,Ashdod Port,MSCU1234567,MAERSK SEALAND,V123W,in_transit,2026-02-15
CONT002,sea,MSC,Hong Kong,Haifa Port,MEDU7654321,MSC MEDITERRANEAN,2601E,at_port,2026-02-10
```

### Sea Shipment - Bill of Lading

```csv
tracking_number,shipment_type,carrier,origin,destination,bl_number,vessel_name,voyage_number,container_count,status
BL001,sea,MAERSK,CNSHA,ILASH,MAEU123456789,MAERSK ESSEX,V456N,2,in_transit
BL002,sea,CMA CGM,SGSIN,ILASH,CMDU987654321,CMA CGM TAGE,123S,5,customs
```

### Air Shipment - Air Waybill

```csv
tracking_number,shipment_type,carrier,origin,destination,awb_number,flight_number,status,estimated_delivery
AWB001,air,DHL,Frankfurt,Tel Aviv,157-12345678,LY1234,in_transit,2026-01-25
AWB002,air,FedEx,Memphis,Ben Gurion,074-98765432,FX5678,customs,2026-01-23
```

### Mixed Shipments

```csv
tracking_number,shipment_type,carrier,origin,destination,container_number,vessel_name,voyage_number,bl_number,container_count,awb_number,status
SHIP001,sea,MAERSK,CNSHA,ILASH,MSCU1234567,MAERSK LINE,V123,MAEU123456789,2,,in_transit
SHIP002,air,DHL,Frankfurt,Tel Aviv,,,,,157-12345678,delivered
SHIP003,sea,MSC,SGSIN,ILHFA,MEDU9876543,MSC OPERA,456E,MSCU987654321,1,,at_port
```

---

## Validation Rules

### General Rules

1. **Header row must match expected column names** (case-insensitive)
2. **tracking_number** must be unique per row
3. **shipment_type** must be one of: `air`, `sea`, `road`
4. **Dates** must be valid and in acceptable format
5. **Empty optional fields** can be left blank or omitted

### Shipment Type Specific Validation

#### For `shipment_type = "sea"`:

✅ **Valid if includes:**
- `container_number` (for container tracking), OR
- `bl_number` (for B/L tracking), OR
- Both

❌ **Invalid if:**
- Both `container_number` and `bl_number` are empty
- `container_number` doesn't match ISO 6346 format (`[A-Z]{4}\d{7}`)

#### For `shipment_type = "air"`:

✅ **Valid if includes:**
- `awb_number` or `tracking_number` in AWB format

❌ **Invalid if:**
- No valid AWB number provided

### Container Number Validation

Container numbers must follow **ISO 6346** standard:
- Format: `ABCD1234567`
- 4 letters (owner code) + 6 digits (serial) + 1 check digit

**Example validation:**
```
✅ MSCU1234567 (valid)
✅ TEMU9876543 (valid)
❌ MSC1234567 (missing 4th letter)
❌ MSCUABCDEFG (not numeric serial)
```

### Bill of Lading Validation

B/L numbers typically:
- Start with carrier code (e.g., MAEU, COSU, MSCU)
- Followed by 8-12 digits
- Format: `[A-Z]{4}\d{8,12}`

**Examples:**
```
✅ MAEU123456789
✅ COSU12345678
✅ MSCU123456789012
❌ MA123456 (too short)
```

---

## Common Errors

### Error: "Invalid shipment_type"

**Cause:** `shipment_type` column contains value other than `air`, `sea`, or `road`

**Fix:**
```csv
# ❌ Wrong
tracking_number,shipment_type,...
SHIP001,ocean,...

# ✅ Correct
tracking_number,shipment_type,...
SHIP001,sea,...
```

### Error: "Missing required fields for sea shipment"

**Cause:** `shipment_type=sea` but both `container_number` and `bl_number` are empty

**Fix:**
```csv
# ❌ Wrong
tracking_number,shipment_type,container_number,bl_number
SHIP001,sea,,

# ✅ Correct - at least one must be provided
tracking_number,shipment_type,container_number,bl_number
SHIP001,sea,MSCU1234567,
# OR
SHIP001,sea,,MAEU123456789
```

### Error: "Invalid container number format"

**Cause:** Container number doesn't follow ISO 6346 format

**Fix:**
```csv
# ❌ Wrong
container_number
MSC123456  (missing 4th letter and too short)

# ✅ Correct
container_number
MSCU1234567  (4 letters + 7 digits)
```

### Error: "Invalid date format"

**Cause:** Date not in recognized format

**Fix:**
```csv
# ❌ Wrong
estimated_delivery
15-02-2026
2026/02/15

# ✅ Correct
estimated_delivery
2026-02-15
15/02/2026
```

### Error: "Duplicate tracking_number"

**Cause:** Same tracking_number appears multiple times in CSV

**Fix:** Ensure each tracking_number is unique, or use different identifiers

---

## Downloading Templates

### Pre-made Templates

Download ready-to-use templates:

1. **Sea Container Template**: [container-import-template.csv](../templates/container-import-template.csv)
2. **Sea B/L Template**: [bl-import-template.csv](../templates/bl-import-template.csv)
3. **Air AWB Template**: [awb-import-template.csv](../templates/awb-import-template.csv)
4. **Mixed Shipments**: [mixed-import-template.csv](../templates/mixed-import-template.csv)

### Creating Your Own

**Minimal sea shipment CSV:**
```csv
tracking_number,shipment_type,container_number
CONT001,sea,MSCU1234567
```

**Complete sea shipment CSV:**
```csv
tracking_number,shipment_type,carrier,origin,destination,container_number,vessel_name,voyage_number,bl_number,container_count,status,estimated_delivery
CONT001,sea,MAERSK,Shanghai Port,Ashdod Port,MSCU1234567,MAERSK SEALAND,V123W,MAEU123456789,2,in_transit,2026-02-15
```

---

## Importing via API

### REST API Endpoint

```bash
POST /api/shipments/import
Content-Type: multipart/form-data

# Upload CSV file
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@shipments.csv" \
  https://api.shipmenttracking.net/api/shipments/import
```

### Response

```json
{
  "success": true,
  "imported": 45,
  "failed": 2,
  "errors": [
    {
      "row": 12,
      "tracking_number": "SHIP012",
      "error": "Invalid container number format"
    }
  ]
}
```

---

## Best Practices

### Do's ✅

- Use consistent date formats throughout file
- Include header row with exact column names
- Validate data before upload (use Excel/spreadsheet first)
- Test with small sample first (5-10 rows)
- Keep backup of original data
- Use UTF-8 encoding
- Trim whitespace from values

### Don'ts ❌

- Don't use Excel default encoding (use UTF-8)
- Don't include empty rows
- Don't use special characters in tracking numbers
- Don't mix date formats in same file
- Don't exceed 10,000 rows per file
- Don't include sensitive customer data

---

## Support

For CSV import issues:
1. Check validation errors in import response
2. Review this documentation
3. Test with provided templates
4. Contact support: support@shipmenttracking.net

---

**Last Updated:** January 2026
