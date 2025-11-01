# Purchase Invoice API Documentation

## Overview
The Purchase Invoice API allows you to manage purchase invoices from suppliers. It supports creating invoices with multiple items, updating invoice details, tracking payment status, and automatically creating payment receipts. All operations are organization-scoped and support full CRUD operations.

## Base URL
```
http://localhost:8000/api/purchase-invoices
```

## Authentication
All endpoints require JWT authentication. Include the Bearer token in the Authorization header:
```
Authorization: Bearer {your_token}
```

---

## Endpoints

### 1. Get All Purchase Invoices
**GET** `/purchase-invoices`

Retrieves a paginated list of all purchase invoices with their associated supplier, items, user, and organization information. Only fetches invoices from the authenticated user's organization.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| supplier_id | integer | Filter by supplier ID |
| status | string | Filter by invoice status |
| payment_status | string | Filter by payment status ("paid", "unpaid", "partial") |
| search | string | Search by invoice number |
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
        "invoice_no": "PI-2025-001",
        "supplier_id": 1,
        "user_id": 1,
        "organization_id": 1,
        "date": "2025-10-30",
        "subtotal": 10000,
        "discount": 500,
        "shipping": 200,
        "tax": 1000,
        "tax_type": "percentage",
        "discount_type": "fixed",
        "grand_total": "10700.00",
        "status": "approved",
        "payment_status": "partial",
        "note": "Office supplies order",
        "created_at": "2025-10-30T14:00:00.000000Z",
        "updated_at": "2025-10-30T14:00:00.000000Z",
        "supplier": {
          "id": 1,
          "name": "ABC Suppliers Ltd",
          "email": "contact@abcsuppliers.com"
        },
        "invoice_items": [
          {
            "id": 1,
            "purchase_invoice_id": 1,
            "item": "Laptop Dell XPS 15",
            "quantity": 5,
            "rate": 2000,
            "total": 10000,
            "discount": 0,
            "unit": "pcs",
            "inventory_id": 10,
            "service_id": null,
            "note": null
          }
        ]
      }
    ],
    "per_page": 10,
    "total": 1
  }
}
```

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/purchase-invoices?supplier_id=1&payment_status=partial" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 2. Get Single Purchase Invoice
**GET** `/purchase-invoices/{id}`

Retrieves detailed information about a specific purchase invoice including all items and relationships.

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Purchase Invoice ID |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "invoice_no": "PI-2025-001",
    "supplier_id": 1,
    "user_id": 1,
    "organization_id": 1,
    "date": "2025-10-30",
    "subtotal": 10000,
    "discount": 500,
    "shipping": 200,
    "tax": 1000,
    "tax_type": "percentage",
    "discount_type": "fixed",
    "grand_total": "10700.00",
    "status": "approved",
    "payment_status": "partial",
    "note": "Office supplies order",
    "created_at": "2025-10-30T14:00:00.000000Z",
    "updated_at": "2025-10-30T14:00:00.000000Z",
    "supplier": {
      "id": 1,
      "name": "ABC Suppliers Ltd",
      "email": "contact@abcsuppliers.com"
    },
    "invoice_items": [
      {
        "id": 1,
        "purchase_invoice_id": 1,
        "item": "Laptop Dell XPS 15",
        "quantity": 5,
        "rate": 2000,
        "total": 10000,
        "discount": 0,
        "unit": "pcs",
        "inventory_id": 10,
        "service_id": null,
        "note": null
      }
    ]
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Purchase invoice not found"
}
```

---

### 3. Create New Purchase Invoice
**POST** `/purchase-invoices`

Creates a new purchase invoice with items. Optionally creates a payment receipt if `paid_amount` is provided.

**Request Body:**
```json
{
  "invoice_no": "PI-2025-001",
  "supplier_id": 1,
  "date": "2025-10-30",
  "subtotal": 10000,
  "discount": 500,
  "shipping": 200,
  "tax": 1000,
  "tax_type": "percentage",
  "discount_type": "fixed",
  "grand_total": 10700,
  "status": "approved",
  "payment_status": "unpaid",
  "note": "Office supplies order",
  "paid_amount": 5000,
  "invoice_items": [
    {
      "item": "Laptop Dell XPS 15",
      "quantity": 5,
      "rate": 2000,
      "total": 10000,
      "discount": 0,
      "unit": "pcs",
      "inventory_id": 10,
      "service_id": null,
      "note": null
    }
  ]
}
```

**Required Fields:**
| Field | Type | Description |
|-------|------|-------------|
| invoice_no | string | Invoice number (max 255 characters) |
| invoice_items | array | Array of invoice items (minimum 1 item) |

**Optional Fields:**
| Field | Type | Description | Default |
|-------|------|-------------|---------|
| supplier_id | integer | Supplier ID (must exist) | null |
| date | date | Invoice date | Current date |
| subtotal | integer | Subtotal amount | null |
| discount | integer | Discount amount/percentage | null |
| shipping | integer | Shipping cost | null |
| tax | integer | Tax amount/percentage | null |
| tax_type | string | "percentage" or "fixed" | "percentage" |
| discount_type | string | "percentage" or "fixed" | "percentage" |
| grand_total | numeric | Total amount | null |
| status | string | Invoice status | null |
| payment_status | string | Payment status | null |
| note | string | Additional notes | null |
| paid_amount | integer | Creates payment receipt | null |

**Invoice Item Fields:**
| Field | Type | Description |
|-------|------|-------------|
| item | string | Item description |
| quantity | integer | Quantity |
| rate | integer | Rate per unit |
| total | integer | Total amount |
| discount | integer | Discount amount |
| unit | string | Unit of measurement |
| inventory_id | integer | Link to inventory |
| service_id | integer | Link to service |
| note | string | Item notes |

**Success Response (201):**
```json
{
  "success": true,
  "message": "Purchase invoice created successfully",
  "data": {
    "id": 1,
    "invoice_no": "PI-2025-001",
    "supplier_id": 1,
    "grand_total": "10700.00",
    "payment_status": "partial",
    "invoice_items": [...]
  }
}
```

**Validation Error Response (422):**
```json
{
  "success": false,
  "errors": {
    "invoice_no": [
      "The invoice no field is required."
    ],
    "invoice_items": [
      "The invoice items field is required."
    ],
    "supplier_id": [
      "The selected supplier id is invalid."
    ]
  }
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Failed to create purchase invoice",
  "error": "Error details"
}
```

**cURL Example:**
```bash
curl -X POST "http://localhost:8000/api/purchase-invoices" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "invoice_no": "PI-2025-001",
    "supplier_id": 1,
    "date": "2025-10-30",
    "subtotal": 10000,
    "discount": 500,
    "grand_total": 10700,
    "status": "approved",
    "payment_status": "unpaid",
    "invoice_items": [
      {
        "item": "Laptop Dell XPS 15",
        "quantity": 5,
        "rate": 2000,
        "total": 10000,
        "unit": "pcs"
      }
    ]
  }'
```

---

### 4. Update Purchase Invoice
**PUT** `/purchase-invoices/{id}`

Updates an existing purchase invoice. If `invoice_items` is provided, all existing items are deleted and replaced with new items.

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Purchase Invoice ID |

**Request Body:**
```json
{
  "invoice_no": "PI-2025-001-UPDATED",
  "supplier_id": 1,
  "date": "2025-10-30",
  "subtotal": 12000,
  "discount": 600,
  "shipping": 200,
  "tax": 1200,
  "grand_total": 12800,
  "status": "approved",
  "payment_status": "partial",
  "note": "Updated office supplies order",
  "invoice_items": [
    {
      "item": "Laptop Dell XPS 15",
      "quantity": 6,
      "rate": 2000,
      "total": 12000,
      "unit": "pcs"
    }
  ]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Purchase invoice updated successfully",
  "data": {
    "id": 1,
    "invoice_no": "PI-2025-001-UPDATED",
    "grand_total": "12800.00"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Purchase invoice not found"
}
```

---

### 5. Delete Purchase Invoice
**DELETE** `/purchase-invoices/{id}`

Permanently deletes a purchase invoice and all its associated items. This operation uses database transactions to ensure data consistency.

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Purchase Invoice ID |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Purchase invoice deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Purchase invoice not found"
}
```

**cURL Example:**
```bash
curl -X DELETE "http://localhost:8000/api/purchase-invoices/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Features

### Transaction Safety
All create, update, and delete operations use database transactions (`DB::beginTransaction()`, `DB::commit()`, `DB::rollBack()`) to ensure data consistency. If any part of the operation fails, all changes are rolled back.

### Automatic Payment Receipt Creation
When creating a purchase invoice, if you provide a `paid_amount` in the request, the system automatically creates a purchase payment receipt linked to the invoice. The receipt will have:
- `receipt_no`: "PREC001" (default)
- `amount`: The provided paid_amount
- `purchase_invoice_id`: Link to the created invoice
- `supplier_id`: Same as invoice supplier
- `date`: Same as invoice date

### Organization Scoping
All queries automatically filter by the authenticated user's organization. Users can only view and manage purchase invoices from their own organization.

### Invoice Items Management
- When creating an invoice, all items in the `invoice_items` array are created
- When updating an invoice with `invoice_items`, existing items are deleted and replaced with new items
- When deleting an invoice, all associated items are also deleted (cascade delete)

---

## Payment Status Values

| Status | Description |
|--------|-------------|
| paid | Invoice is fully paid |
| unpaid | No payment has been made |
| partial | Invoice is partially paid |

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
  "message": "Purchase invoice not found"
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
  "message": "Failed to create/update/delete purchase invoice",
  "error": "Error details"
}
```

---

## Notes

- All timestamps are in UTC format
- Pagination returns 10 items per page by default
- The `user_id` and `organization_id` fields are automatically set from the authenticated user
- Tax and discount types must be either "percentage" or "fixed"
- Invoice items are required when creating an invoice (minimum 1 item)
- Updating with `invoice_items` performs a full replacement (deletes old, creates new)
- All currency amounts are stored as integers (smallest currency unit, e.g., cents)
