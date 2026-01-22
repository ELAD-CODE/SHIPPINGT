# CSV Import Template for Sea Shipments

This document describes the CSV format for bulk importing shipments, including both air and sea freight.

## 📋 Overview

Use this CSV template to import multiple shipments at once. The system supports:
- ✈️ Air freight (Express, Air Cargo)
- 🚢 Sea freight (Containers, LCL)
- 🚛 Road freight (Trucks)

## 📄 CSV Format

### Basic Structure

```csv
trackingNumber,shipmentType,customerName,customerEmail,customerPhone,originCountry,destinationCountry,status
```

### Full Template with All Fields

Download the template: `shipment-import-template.csv`

Or copy this structure:

```csv
trackingNumber,shipmentType,customerName,customerEmail,customerPhone,originCountry,originPort,destinationCountry,destinationPort,airWaybillNumber,billOfLading,containerNumber,vesselName,voyageNumber,containerType,containerCount,cargoDescription,weight,volume,quantity,declaredValue,currency,status
```

## 📊 Field Descriptions

### Required Fields

| Field | Description | Example | Notes |
|-------|-------------|---------|-------|
| `trackingNumber` | Unique tracking number | `MAEU123456789` | Must be unique |
| `shipmentType` | Type of shipment | `SEA`, `AIR`, `EXPRESS`, `ROAD` | Enum value |
| `status` | Current status | `booked`, `in_transit`, `delivered` | Default: `booked` |

### Customer Information (Recommended)

| Field | Description | Example |
|-------|-------------|---------|
| `customerName` | Full name | `John Doe` |
| `customerEmail` | Email address | `john@example.com` |
| `customerPhone` | Phone number | `+972501234567` |

### Origin & Destination

| Field | Description | Example | Notes |
|-------|-------------|---------|-------|
| `originCountry` | Origin country code | `CN` | ISO 3166-1 alpha-2 |
| `originPort` | Origin port/airport | `CNSHA` | Port code |
| `originAddress` | Full origin address | `123 Main St, Shanghai` | |
| `destinationCountry` | Destination country | `IL` | Israel |
| `destinationPort` | Destination port | `ILHFA` | Haifa port |
| `destinationAddress` | Delivery address | `456 Ben Gurion, Tel Aviv` | |

### Air Freight Specific Fields

Use these fields when `shipmentType = AIR` or `EXPRESS`:

| Field | Description | Example |
|-------|-------------|---------|
| `airWaybillNumber` | AWB number | `157-12345678` |
| `flightNumber` | Flight number | `LY008` |
| `airline` | Airline name | `El Al` |
| `aircraftType` | Aircraft model | `Boeing 777` |

### Sea Freight Specific Fields

Use these fields when `shipmentType = SEA`:

| Field | Description | Example | Notes |
|-------|-------------|---------|-------|
| `billOfLading` | B/L number | `MAEU123456789` | Required for sea |
| `containerNumber` | Container number | `MSCU1234567` | ISO 6346 format |
| `vesselName` | Ship name | `MSC ISTANBUL` | |
| `voyageNumber` | Voyage number | `026W` | |
| `containerType` | Container size | `40HC` | 20ft, 40ft, 40HC, etc. |
| `containerCount` | Number of containers | `2` | Default: 1 |

### Cargo Details

| Field | Description | Example | Notes |
|-------|-------------|---------|-------|
| `cargoDescription` | Description of goods | `Electronic components` | |
| `hsCode` | HS Code | `8542.39` | Harmonized System |
| `weight` | Weight in kg | `1500.5` | Decimal allowed |
| `volume` | Volume in m³ | `25.8` | Cubic meters |
| `quantity` | Number of pieces | `100` | Integer |
| `declaredValue` | Customs value | `15000.00` | |
| `currency` | Currency code | `USD` | ISO 4217 |

### Status Values

Common status values:

- `booked` - Shipment booked
- `in_transit` - In transit
- `at_port` - Arrived at port
- `customs` - In customs clearance
- `cleared` - Customs cleared
- `out_for_delivery` - Out for delivery
- `delivered` - Delivered
- `delayed` - Delayed
- `cancelled` - Cancelled

## 📝 Example CSV Files

### Example 1: Sea Freight (FCL - Full Container Load)

```csv
trackingNumber,shipmentType,customerName,customerEmail,originCountry,destinationCountry,billOfLading,containerNumber,vesselName,voyageNumber,containerType,containerCount,weight,volume,status
MAEU123456789,SEA,ABC Trading Ltd,info@abctrading.com,CN,IL,MAEU123456789,MSCU1234567,MSC ISTANBUL,026W,40HC,1,18000,67.5,in_transit
COSU987654321,SEA,XYZ Imports,orders@xyzimports.com,US,IL,COSU987654321,TEMU9876543,COSCO HARMONY,045E,20ft,2,8500,33.2,at_port
```

### Example 2: Air Freight

```csv
trackingNumber,shipmentType,customerName,customerEmail,originCountry,destinationCountry,airWaybillNumber,airline,weight,status
157-12345678,AIR,Fast Shipping Co,contact@fastship.com,US,IL,157-12345678,El Al,250.5,customs
074-98765432,AIR,Quick Imports,info@quickimports.co.il,DE,IL,074-98765432,Lufthansa,180.2,delivered
```

### Example 3: Express Courier

```csv
trackingNumber,shipmentType,customerName,customerEmail,originCountry,destinationCountry,weight,status
1234567890,EXPRESS,John Smith,john@example.com,US,IL,5.5,in_transit
9876543210,EXPRESS,Sarah Cohen,sarah@example.co.il,GB,IL,2.3,delivered
```

## 🔧 Import Process

### Step 1: Prepare CSV File

1. Download the template
2. Fill in your data
3. Ensure required fields are present
4. Validate data types (numbers, dates, etc.)
5. Save as UTF-8 CSV

### Step 2: Validate Before Import

Check for:
- ✅ No duplicate tracking numbers
- ✅ Valid shipment types (AIR, SEA, ROAD, EXPRESS)
- ✅ Valid country codes (ISO 3166-1)
- ✅ Proper date formats (YYYY-MM-DD)
- ✅ Numeric fields contain only numbers
- ✅ Email addresses are valid

### Step 3: Import via API or Admin Panel

**Option A: API Import** (programmatic)

```bash
curl -X POST https://api.shipment-tracking.com/api/shipments/bulk-import \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@shipments.csv"
```

**Option B: Admin Panel** (manual)

1. Log in to admin panel
2. Go to **Shipments → Import**
3. Upload CSV file
4. Review preview
5. Click **Import**

### Step 4: Review Import Results

The system will provide:
- ✅ Number of rows processed
- ✅ Number of successful imports
- ❌ List of errors (with row numbers)
- ⚠️ Warnings (e.g., missing optional fields)

## ⚠️ Common Import Errors

### Error: "Duplicate tracking number"

**Cause**: Tracking number already exists in database

**Solution**: Use a different tracking number or update existing record

### Error: "Invalid shipment type"

**Cause**: `shipmentType` is not one of: AIR, SEA, ROAD, EXPRESS

**Solution**: Check spelling and use correct enum value

### Error: "Invalid country code"

**Cause**: Country code is not ISO 3166-1 alpha-2 format

**Solution**: Use 2-letter codes (e.g., `IL` not `Israel`)

### Error: "Missing required field"

**Cause**: Required field is empty

**Solution**: Fill in all required fields (trackingNumber, shipmentType, status)

### Error: "Invalid number format"

**Cause**: Non-numeric value in numeric field

**Solution**: Check weight, volume, quantity, declaredValue fields

## 🔍 Data Validation Rules

### Container Number Validation

Container numbers must follow ISO 6346 format:
- 4 letters (owner code)
- 6 digits
- 1 check digit

Example: `MSCU1234567`

The system validates the check digit automatically.

### Bill of Lading Format

Common formats:
- **MAERSK**: `MAEU` + 9-10 digits
- **MSC**: `MSC` + 9-10 digits
- **COSCO**: `COSU` + 9-10 digits
- **CMA CGM**: `CMDU` + 9-10 digits

### Air Waybill Format

Format: `XXX-XXXXXXXX`
- 3-digit airline prefix
- Hyphen (optional)
- 8-digit serial number

Example: `157-12345678`

## 📊 CSV Import Best Practices

### DO

✅ Use UTF-8 encoding
✅ Include header row
✅ Quote fields containing commas
✅ Test with small batch first (10-20 rows)
✅ Keep a backup of original data
✅ Validate data before importing

### DON'T

❌ Use Excel date formats (use YYYY-MM-DD)
❌ Include formulas in cells
❌ Mix shipment types in one import
❌ Leave required fields empty
❌ Use special characters in IDs
❌ Import without validation

## 🔐 Security Notes

- Never include sensitive data in CSV files
- Don't share CSV files via email
- Store import files securely
- Delete CSV files after import
- Use HTTPS for uploads

## 📞 Support

For import issues:
- Check error messages carefully
- Validate CSV format
- Test with smaller batch
- Contact support: support@shipment-tracking.com

## 📚 Additional Resources

- [ISO 3166-1 Country Codes](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)
- [ISO 6346 Container Numbers](https://en.wikipedia.org/wiki/ISO_6346)
- [HS Code Lookup](https://www.trade.gov/harmonized-system-hs-codes)
- [Port Codes Database](https://www.searates.com/reference/portcodes/)

---

**Last Updated**: 2026-01-22  
**Template Version**: 1.0
