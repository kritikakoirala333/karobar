# Sales Invoice API Documentation

## Overview
The Sales Invoice API allows you to create, read, update, and delete sales invoices along with their associated invoice items. All operations are scoped to the authenticated user's organization.

## Base URL
```
http://localhost:8000/api/sales-invoices
```

## Authentication
All endpoints require JWT authentication. Include the Bearer token in the Authorization header:
```
Authorization: Bearer {your_token}
```

---

## Endpoints

### 1. Get All Sales Invoices
**GET** `/sales-invoices`

Retrieves a paginated list of all sales invoices from the authenticated user's organization.

**Headers:**
```
Authorization: Bearer {your_token}
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| customer_id | integer | Filter by customer ID |
| status | string | Filter by invoice status |
| payment_status | string | Filter by payment status |
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
        "invoice_no": "INV001",
        "customer_id": 1,
        "user_id": 1,
        "organization_id": 1,
        "date": "2025-10-16",
        "subtotal": 1000,
        "discount": 50,
        "shipping": 100,
        "tax": 100,
        "tax_type": "percentage",
        "discount_type": "percentage",
        "grand_total": "1150.00",
        "status": "pending",
        "payment_status": "unpaid",
        "note": "Sample invoice note",
        "created_at": "2025-10-17T08:00:00.000000Z",
        "updated_at": "2025-10-17T08:00:00.000000Z",
        "customer": {
          "id": 1,
          "name": "John Doe",
          "email": "john@example.com"
        },
        "user": {
          "id": 1,
          "name": "Niraj Bhandari",
          "email": "niraj@azure.com.np"
        },
        "organization": {
          "id": 1,
          "name": "TechVision Solutions"
        },
        "invoice_items": [
          {
            "id": 1,
            "sales_invoice_id": 1,
            "item": "Web Development",
            "quantity": 10,
            "rate": 100,
            "total": 1000,
            "discount": 0,
            "unit": "hours",
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
curl -X GET "http://localhost:8000/api/sales-invoices?status=pending" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 2. Get Single Sales Invoice
**GET** `/sales-invoices/{id}`

Retrieves details of a specific sales invoice with its items.

**Headers:**
```
Authorization: Bearer {your_token}
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Sales invoice ID |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "invoice_no": "INV001",
    "customer_id": 1,
    "user_id": 1,
    "organization_id": 1,
    "date": "2025-10-16",
    "subtotal": 1000,
    "discount": 50,
    "shipping": 100,
    "tax": 100,
    "tax_type": "percentage",
    "discount_type": "percentage",
    "grand_total": "1150.00",
    "status": "pending",
    "payment_status": "unpaid",
    "note": "Sample invoice note",
    "customer": {
      "id": 1,
      "name": "John Doe"
    },
    "invoice_items": [
      {
        "id": 1,
        "item": "Web Development",
        "quantity": 10,
        "rate": 100,
        "total": 1000
      }
    ]
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Sales invoice not found"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:8000/api/sales-invoices/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. Create Sales Invoice
**POST** `/sales-invoices`

Creates a new sales invoice with invoice items. The `user_id` and `organization_id` are automatically set from the authenticated user.

**Headers:**
```
Authorization: Bearer {your_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "invoice_no": "INV001",
  "customer_id": 1,
  "date": "2025-10-16",
  "subtotal": 1000,
  "discount": 50,
  "shipping": 100,
  "tax": 100,
  "tax_type": "percentage",
  "discount_type": "percentage",
  "grand_total": 1150,
  "status": "pending",
  "payment_status": "unpaid",
  "note": "Sample invoice note",
  "invoice_items": [
    {
      "item": "Web Development",
      "quantity": 10,
      "rate": 100,
      "total": 1000,
      "discount": 0,
      "unit": "hours",
      "inventory_id": null,
      "service_id": null,
      "note": "Development hours"
    },
    {
      "item": "Design Services",
      "quantity": 5,
      "rate": 80,
      "total": 400,
      "discount": 0,
      "unit": "hours",
      "inventory_id": null,
      "service_id": null,
      "note": "UI/UX Design"
    }
  ]
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| invoice_no | string | Yes | Unique invoice number |
| customer_id | integer | No | Customer ID (must exist in customers table) |
| date | date | No | Invoice date (defaults to current date) |
| subtotal | integer | No | Invoice subtotal before discounts/taxes |
| discount | integer | No | Discount amount or percentage |
| shipping | integer | No | Shipping charges |
| tax | integer | No | Tax amount or percentage |
| tax_type | string | No | "percentage" or "fixed" (default: "percentage") |
| discount_type | string | No | "percentage" or "fixed" (default: "percentage") |
| grand_total | numeric | No | Final invoice total |
| status | string | No | Invoice status (e.g., "pending", "completed") |
| payment_status | string | No | Payment status (e.g., "paid", "unpaid") |
| note | text | No | Additional notes |
| invoice_items | array | Yes | Array of invoice items (minimum 1 item) |

**Invoice Item Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| item | string | No | Item/service description |
| quantity | integer | No | Item quantity |
| rate | integer | No | Rate per unit |
| total | integer | No | Line item total |
| discount | integer | No | Line item discount |
| unit | string | No | Unit of measurement (e.g., "hours", "pieces") |
| inventory_id | integer | No | Reference to inventory item |
| service_id | integer | No | Reference to service |
| note | text | No | Line item notes |

**Success Response (201):**
```json
{
  "success": true,
  "message": "Sales invoice created successfully",
  "data": {
    "id": 1,
    "invoice_no": "INV001",
    "customer_id": 1,
    "user_id": 1,
    "organization_id": 1,
    "date": "2025-10-16",
    "grand_total": "1150.00",
    "status": "pending",
    "payment_status": "unpaid",
    "invoice_items": [
      {
        "id": 1,
        "item": "Web Development",
        "quantity": 10,
        "rate": 100,
        "total": 1000
      }
    ]
  }
}
```

**Error Response (422):**
```json
{
  "success": false,
  "errors": {
    "invoice_no": ["The invoice no has already been taken."],
    "invoice_items": ["The invoice items field is required."]
  }
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Failed to create sales invoice",
  "error": "Error message details"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/sales-invoices \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "invoice_no": "INV001",
    "customer_id": 1,
    "date": "2025-10-16",
    "subtotal": 1000,
    "discount": 50,
    "tax": 100,
    "grand_total": 1050,
    "status": "pending",
    "payment_status": "unpaid",
    "invoice_items": [
      {
        "item": "Web Development",
        "quantity": 10,
        "rate": 100,
        "total": 1000,
        "unit": "hours"
      }
    ]
  }'
```

---

### 4. Update Sales Invoice
**PUT** `/sales-invoices/{id}`

Updates an existing sales invoice. When `invoice_items` is provided, all existing items are deleted and replaced with the new items.

**Headers:**
```
Authorization: Bearer {your_token}
Content-Type: application/json
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Sales invoice ID |

**Request Body:**
```json
{
  "invoice_no": "INV001-UPDATED",
  "customer_id": 1,
  "date": "2025-10-17",
  "subtotal": 1500,
  "discount": 100,
  "shipping": 150,
  "tax": 150,
  "grand_total": 1700,
  "status": "completed",
  "payment_status": "paid",
  "note": "Updated invoice",
  "invoice_items": [
    {
      "item": "Web Development - Updated",
      "quantity": 15,
      "rate": 100,
      "total": 1500,
      "unit": "hours"
    }
  ]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Sales invoice updated successfully",
  "data": {
    "id": 1,
    "invoice_no": "INV001-UPDATED",
    "status": "completed",
    "payment_status": "paid",
    "grand_total": "1700.00",
    "invoice_items": [
      {
        "id": 2,
        "item": "Web Development - Updated",
        "quantity": 15,
        "rate": 100,
        "total": 1500
      }
    ]
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Sales invoice not found"
}
```

**Error Response (422):**
```json
{
  "success": false,
  "errors": {
    "invoice_no": ["The invoice no has already been taken."]
  }
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:8000/api/sales-invoices/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "payment_status": "paid"
  }'
```

---

### 5. Delete Sales Invoice
**DELETE** `/sales-invoices/{id}`

Deletes a sales invoice and all its associated invoice items.

**Headers:**
```
Authorization: Bearer {your_token}
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Sales invoice ID |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Sales invoice deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Sales invoice not found"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Failed to delete sales invoice",
  "error": "Error message details"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:8000/api/sales-invoices/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Important Notes

### Automatic Field Population
The following fields are automatically populated and should **not** be included in the request:
- `user_id` - Set to the authenticated user's ID
- `organization_id` - Set to the authenticated user's organization ID

For invoice items, the following are also auto-populated:
- `user_id` - Set to the authenticated user's ID
- `organization_id` - Set to the authenticated user's organization ID

### Organization Scope
All invoices are automatically scoped to the authenticated user's organization. Users can only:
- View invoices from their own organization
- Create invoices for their own organization
- Update/Delete invoices from their own organization

### Transaction Safety
All create, update, and delete operations are wrapped in database transactions to ensure data consistency. If any part of the operation fails, all changes are rolled back.

### Invoice Items
- When creating an invoice, at least 1 invoice item is required
- When updating an invoice with `invoice_items`, all existing items are **deleted and replaced**
- If you update an invoice without including `invoice_items`, the existing items remain unchanged

---

## Common Use Cases

### Creating a Simple Invoice
```bash
curl -X POST http://localhost:8000/api/sales-invoices \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "invoice_no": "INV-2025-001",
    "customer_id": 1,
    "date": "2025-10-17",
    "grand_total": 1000,
    "status": "pending",
    "payment_status": "unpaid",
    "invoice_items": [
      {
        "item": "Website Development",
        "quantity": 1,
        "rate": 1000,
        "total": 1000,
        "unit": "project"
      }
    ]
  }'
```

### Updating Invoice Status
```bash
curl -X PUT http://localhost:8000/api/sales-invoices/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "payment_status": "paid"
  }'
```

### Filtering Invoices by Customer
```bash
curl -X GET "http://localhost:8000/api/sales-invoices?customer_id=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Searching for an Invoice
```bash
curl -X GET "http://localhost:8000/api/sales-invoices?search=INV001" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Error Handling

All endpoints follow a consistent error response format:

**Validation Errors (422):**
```json
{
  "success": false,
  "errors": {
    "field_name": ["Error message"]
  }
}
```

**Not Found Errors (404):**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**Server Errors (500):**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

**Authentication Errors (401):**
```json
{
  "message": "Unauthenticated."
}
```

---

## Testing Workflow

1. **Login** to get JWT token:
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"niraj@azure.com.np","password":"password"}'
```

2. **Create a customer** (if needed):
```bash
curl -X POST http://localhost:8000/api/customers \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

3. **Create an invoice**:
```bash
curl -X POST http://localhost:8000/api/sales-invoices \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "invoice_no": "INV001",
    "customer_id": 1,
    "grand_total": 1000,
    "invoice_items": [{"item":"Service","quantity":1,"rate":1000,"total":1000}]
  }'
```

4. **List all invoices**:
```bash
curl -X GET http://localhost:8000/api/sales-invoices \
  -H "Authorization: Bearer YOUR_TOKEN"
```

5. **Update invoice status**:
```bash
curl -X PUT http://localhost:8000/api/sales-invoices/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"completed","payment_status":"paid"}'
```
