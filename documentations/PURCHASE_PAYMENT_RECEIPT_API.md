# Purchase Payment Receipt API Documentation

## Overview
The Purchase Payment Receipt API allows you to manage payment receipts for purchase invoices. It tracks payments made to suppliers, automatically updates purchase invoice payment status, and supports soft deletion. All operations are organization-scoped with full CRUD capabilities.

## Base URL
```
http://localhost:8000/api/purchase-payment-receipts
```

## Authentication
All endpoints require JWT authentication. Include the Bearer token in the Authorization header:
```
Authorization: Bearer {your_token}
```

---

## Endpoints

### 1. Get All Purchase Payment Receipts
**GET** `/purchase-payment-receipts`

Retrieves a paginated list of all purchase payment receipts with their associated supplier, purchase invoice, user, and organization information. Only fetches non-deleted receipts from the authenticated user's organization.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| supplier_id | integer | Filter by supplier ID |
| purchase_invoice_id | integer | Filter by purchase invoice ID |
| payment_method | string | Filter by payment method |
| search | string | Search by receipt number |
| page | integer | Page number for pagination (default: 1) |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "receipt_no": "PREC-2025-001",
        "amount": 5000,
        "title": "Partial payment for PI-2025-001",
        "purchase_invoice_id": 1,
        "supplier_id": 1,
        "user_id": 1,
        "organization_id": 1,
        "date": "2025-10-30",
        "note": "Bank transfer",
        "payment_method": "bank_transfer",
        "is_deleted": 0,
        "created_at": "2025-10-30T14:30:00.000000Z",
        "updated_at": "2025-10-30T14:30:00.000000Z",
        "supplier": {
          "id": 1,
          "name": "ABC Suppliers Ltd",
          "email": "contact@abcsuppliers.com"
        },
        "purchase_invoice": {
          "id": 1,
          "invoice_no": "PI-2025-001",
          "grand_total": "10700.00",
          "payment_status": "partial"
        }
      }
    ],
    "per_page": 10,
    "total": 1
  }
}
```

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/purchase-payment-receipts?supplier_id=1&payment_method=bank_transfer" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 2. Get Single Purchase Payment Receipt
**GET** `/purchase-payment-receipts/{id}`

Retrieves detailed information about a specific purchase payment receipt. Only returns non-deleted receipts.

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Purchase Payment Receipt ID |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "receipt_no": "PREC-2025-001",
    "amount": 5000,
    "title": "Partial payment for PI-2025-001",
    "purchase_invoice_id": 1,
    "supplier_id": 1,
    "user_id": 1,
    "organization_id": 1,
    "date": "2025-10-30",
    "note": "Bank transfer",
    "payment_method": "bank_transfer",
    "is_deleted": 0,
    "created_at": "2025-10-30T14:30:00.000000Z",
    "updated_at": "2025-10-30T14:30:00.000000Z",
    "supplier": {
      "id": 1,
      "name": "ABC Suppliers Ltd",
      "email": "contact@abcsuppliers.com"
    },
    "purchase_invoice": {
      "id": 1,
      "invoice_no": "PI-2025-001",
      "grand_total": "10700.00",
      "payment_status": "partial"
    }
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Purchase payment receipt not found"
}
```

---

### 3. Create New Purchase Payment Receipt
**POST** `/purchase-payment-receipts`

Creates a new purchase payment receipt. If linked to a purchase invoice, automatically updates the invoice's payment status based on total paid amount.

**Request Body:**
```json
{
  "receipt_no": "PREC-2025-001",
  "amount": 5000,
  "title": "Partial payment for PI-2025-001",
  "purchase_invoice_id": 1,
  "supplier_id": 1,
  "date": "2025-10-30",
  "note": "Bank transfer payment",
  "payment_method": "bank_transfer"
}
```

**Required Fields:**
| Field | Type | Description |
|-------|------|-------------|
| receipt_no | string | Receipt number (max 255 characters) |
| amount | integer | Payment amount (minimum 1) |
| supplier_id | integer | Supplier ID (must exist in suppliers table) |

**Optional Fields:**
| Field | Type | Description | Default |
|-------|------|-------------|---------|
| title | string | Receipt title (max 255 characters) | null |
| purchase_invoice_id | integer | Purchase Invoice ID (must exist) | null |
| date | date | Payment date | Current date |
| note | string | Additional notes | null |
| payment_method | string | Payment method (see options below) | "cash" |

**Payment Method Options:**
- `cash`
- `check`
- `bank_transfer`
- `credit_card`
- `debit_card`
- `online`
- `other`

**Success Response (201):**
```json
{
  "success": true,
  "message": "Purchase payment receipt created successfully",
  "data": {
    "id": 1,
    "receipt_no": "PREC-2025-001",
    "amount": 5000,
    "title": "Partial payment for PI-2025-001",
    "purchase_invoice_id": 1,
    "supplier_id": 1,
    "payment_method": "bank_transfer",
    "supplier": {
      "id": 1,
      "name": "ABC Suppliers Ltd"
    },
    "purchase_invoice": {
      "id": 1,
      "invoice_no": "PI-2025-001",
      "payment_status": "partial"
    }
  }
}
```

**Validation Error Response (422):**
```json
{
  "success": false,
  "errors": {
    "receipt_no": [
      "The receipt no field is required."
    ],
    "amount": [
      "The amount must be at least 1."
    ],
    "supplier_id": [
      "The selected supplier id is invalid."
    ],
    "payment_method": [
      "The selected payment method is invalid."
    ]
  }
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Failed to create purchase payment receipt",
  "error": "Error details"
}
```

**cURL Example:**
```bash
curl -X POST "http://localhost:8000/api/purchase-payment-receipts" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "receipt_no": "PREC-2025-001",
    "amount": 5000,
    "title": "Partial payment for PI-2025-001",
    "purchase_invoice_id": 1,
    "supplier_id": 1,
    "date": "2025-10-30",
    "payment_method": "bank_transfer",
    "note": "Bank transfer payment"
  }'
```

---

### 4. Update Purchase Payment Receipt
**PUT** `/purchase-payment-receipts/{id}`

Updates an existing purchase payment receipt. If the linked invoice changes or the amount changes, automatically recalculates and updates payment status for both old and new invoices.

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Purchase Payment Receipt ID |

**Request Body:**
```json
{
  "receipt_no": "PREC-2025-001-UPDATED",
  "amount": 6000,
  "title": "Updated payment amount",
  "purchase_invoice_id": 1,
  "supplier_id": 1,
  "date": "2025-10-30",
  "note": "Updated bank transfer payment",
  "payment_method": "bank_transfer"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Purchase payment receipt updated successfully",
  "data": {
    "id": 1,
    "receipt_no": "PREC-2025-001-UPDATED",
    "amount": 6000,
    "supplier": {
      "id": 1,
      "name": "ABC Suppliers Ltd"
    },
    "purchase_invoice": {
      "id": 1,
      "invoice_no": "PI-2025-001",
      "payment_status": "partial"
    }
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Purchase payment receipt not found"
}
```

---

### 5. Delete Purchase Payment Receipt (Soft Delete)
**DELETE** `/purchase-payment-receipts/{id}`

Soft deletes a purchase payment receipt by setting `is_deleted` to 1. If linked to a purchase invoice, automatically recalculates and updates the invoice's payment status based on remaining active receipts.

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Purchase Payment Receipt ID |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Purchase payment receipt deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Purchase payment receipt not found"
}
```

**cURL Example:**
```bash
curl -X DELETE "http://localhost:8000/api/purchase-payment-receipts/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Features

### Automatic Payment Status Updates

When a purchase payment receipt is created, updated, or deleted, the system automatically:

1. **Calculates Total Paid Amount**: Sums all active (non-deleted) payment receipts for the linked purchase invoice
2. **Updates Invoice Payment Status**:
   - `paid`: Total paid >= Invoice grand total
   - `partial`: Total paid > 0 but < Invoice grand total
   - `unpaid`: Total paid = 0

### Smart Update Logic

When updating a payment receipt:
- If the `purchase_invoice_id` changes, both the old and new invoices' payment statuses are recalculated
- If the `amount` changes, the linked invoice's payment status is recalculated
- All calculations consider only active (non-deleted) payment receipts

### Soft Delete

Delete operations use soft delete (sets `is_deleted = 1`) instead of permanently removing records. This:
- Preserves historical data
- Allows for audit trails
- Enables potential recovery
- Automatically recalculates invoice payment status excluding deleted receipts

### Organization Scoping

All queries automatically filter by:
- The authenticated user's organization
- Non-deleted receipts (`is_deleted = 0`)

Users can only view and manage purchase payment receipts from their own organization.

---

## Payment Method Options

| Value | Description |
|-------|-------------|
| cash | Cash payment |
| check | Check/Cheque payment |
| bank_transfer | Bank transfer |
| credit_card | Credit card |
| debit_card | Debit card |
| online | Online payment |
| other | Other payment methods |

---

## Error Handling

All endpoints follow consistent error response formats:

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Unauthenticated"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Purchase payment receipt not found"
}
```

**422 Validation Error:**
```json
{
  "success": false,
  "errors": {
    "field_name": [
      "Error message"
    ]
  }
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Failed to create/update/delete purchase payment receipt",
  "error": "Error details"
}
```

---

## Use Cases

### Scenario 1: Recording a Partial Payment

A supplier invoice of $10,000 is created. You pay $3,000 as the first installment:

```bash
POST /api/purchase-payment-receipts
{
  "receipt_no": "PREC-001",
  "amount": 3000,
  "purchase_invoice_id": 1,
  "supplier_id": 1,
  "payment_method": "bank_transfer"
}
```

Result: Invoice payment_status automatically updates to "partial"

### Scenario 2: Completing Payment

Later, you pay the remaining $7,000:

```bash
POST /api/purchase-payment-receipts
{
  "receipt_no": "PREC-002",
  "amount": 7000,
  "purchase_invoice_id": 1,
  "supplier_id": 1,
  "payment_method": "bank_transfer"
}
```

Result: Invoice payment_status automatically updates to "paid"

### Scenario 3: Correcting a Payment Amount

You need to correct the first payment to $3,500:

```bash
PUT /api/purchase-payment-receipts/1
{
  "amount": 3500
}
```

Result: Invoice payment_status recalculates based on new total ($3,500 + $7,000 = $10,500)

### Scenario 4: Canceling a Payment

You need to cancel the second payment:

```bash
DELETE /api/purchase-payment-receipts/2
```

Result: Invoice payment_status updates back to "partial" (only $3,500 paid)

---

## Notes

- All timestamps are in UTC format
- Pagination returns 10 items per page by default
- The `user_id` and `organization_id` fields are automatically set from the authenticated user
- The `is_deleted` flag defaults to 0 (active)
- Soft deleted receipts are excluded from all list queries
- Payment status calculations only consider active (non-deleted) receipts
- Amount must be a positive integer (smallest currency unit, e.g., cents)
- Date defaults to current date if not provided
- Payment method defaults to "cash" if not provided
