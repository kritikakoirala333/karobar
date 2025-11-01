# Payment Receipt API Documentation

## Overview
The Payment Receipt API allows you to create, read, update, and delete payment receipts. Payment receipts can be linked to sales invoices and automatically update the invoice's payment status. All operations are scoped to the authenticated user's organization.

## Base URL
```
http://localhost:8000/api/payment-receipts
```

## Authentication
All endpoints require JWT authentication. Include the Bearer token in the Authorization header:
```
Authorization: Bearer {your_token}
```

---

## Endpoints

### 1. Get All Payment Receipts
**GET** `/payment-receipts`

Retrieves a paginated list of all payment receipts from the authenticated user's organization.

**Headers:**
```
Authorization: Bearer {your_token}
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| customer_id | integer | Filter by customer ID |
| sales_invoice_id | integer | Filter by sales invoice ID |
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
        "receipt_no": "REC001",
        "amount": 5000,
        "title": "Payment for Invoice INV001",
        "sales_invoice_id": 1,
        "customer_id": 1,
        "user_id": 1,
        "organization_id": 1,
        "date": "2025-10-27",
        "note": "First payment installment",
        "payment_method": "cash",
        "is_deleted": 0,
        "created_at": "2025-10-27T08:00:00.000000Z",
        "updated_at": "2025-10-27T08:00:00.000000Z",
        "customer": {
          "id": 1,
          "name": "John Doe",
          "email": "john@example.com"
        },
        "sales_invoice": {
          "id": 1,
          "invoice_no": "INV001",
          "grand_total": "10000.00",
          "payment_status": "partial"
        },
        "user": {
          "id": 1,
          "name": "Niraj Bhandari",
          "email": "niraj@azure.com.np"
        },
        "organization": {
          "id": 1,
          "name": "TechVision Solutions"
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
curl -X GET "http://localhost:8000/api/payment-receipts?customer_id=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 2. Get Single Payment Receipt
**GET** `/payment-receipts/{id}`

Retrieves details of a specific payment receipt.

**Headers:**
```
Authorization: Bearer {your_token}
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Payment receipt ID |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "receipt_no": "REC001",
    "amount": 5000,
    "title": "Payment for Invoice INV001",
    "sales_invoice_id": 1,
    "customer_id": 1,
    "user_id": 1,
    "organization_id": 1,
    "date": "2025-10-27",
    "note": "First payment installment",
    "payment_method": "cash",
    "is_deleted": 0,
    "created_at": "2025-10-27T08:00:00.000000Z",
    "updated_at": "2025-10-27T08:00:00.000000Z",
    "customer": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "sales_invoice": {
      "id": 1,
      "invoice_no": "INV001",
      "grand_total": "10000.00",
      "payment_status": "partial"
    },
    "user": {
      "id": 1,
      "name": "Niraj Bhandari"
    },
    "organization": {
      "id": 1,
      "name": "TechVision Solutions"
    }
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Payment receipt not found"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:8000/api/payment-receipts/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. Create Payment Receipt
**POST** `/payment-receipts`

Creates a new payment receipt. The `user_id` and `organization_id` are automatically set from the authenticated user. If linked to a sales invoice, the invoice's payment status is automatically updated based on the total amount paid.

**Headers:**
```
Authorization: Bearer {your_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "receipt_no": "REC001",
  "amount": 5000,
  "title": "Payment for Invoice INV001",
  "sales_invoice_id": 1,
  "customer_id": 1,
  "date": "2025-10-27",
  "note": "First payment installment",
  "payment_method": "bank_transfer"
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| receipt_no | string | Yes | Unique receipt number (max 255 characters) |
| amount | integer | Yes | Payment amount (must be at least 1) |
| title | string | No | Receipt title or description (max 255 characters) |
| sales_invoice_id | integer | No | Sales invoice ID (must exist in sales_invoices table) |
| customer_id | integer | Yes | Customer ID (must exist in customers table) |
| date | date | No | Payment date (defaults to current date) |
| note | text | No | Additional notes about the payment |
| payment_method | string | No | Payment method: "cash", "check", "bank_transfer", "credit_card", "debit_card", "online", "other" (default: "cash") |

**Success Response (201):**
```json
{
  "success": true,
  "message": "Payment receipt created successfully",
  "data": {
    "id": 1,
    "receipt_no": "REC001",
    "amount": 5000,
    "title": "Payment for Invoice INV001",
    "sales_invoice_id": 1,
    "customer_id": 1,
    "user_id": 1,
    "organization_id": 1,
    "date": "2025-10-27",
    "note": "First payment installment",
    "payment_method": "bank_transfer",
    "is_deleted": 0,
    "created_at": "2025-10-27T08:00:00.000000Z",
    "updated_at": "2025-10-27T08:00:00.000000Z",
    "customer": {
      "id": 1,
      "name": "John Doe"
    },
    "sales_invoice": {
      "id": 1,
      "invoice_no": "INV001",
      "payment_status": "partial"
    }
  }
}
```

**Error Response (422):**
```json
{
  "success": false,
  "errors": {
    "receipt_no": ["The receipt no field is required."],
    "amount": ["The amount must be at least 1."],
    "customer_id": ["The customer id field is required."]
  }
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Failed to create payment receipt",
  "error": "Error message details"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/payment-receipts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "receipt_no": "REC001",
    "amount": 5000,
    "title": "Payment for Invoice INV001",
    "sales_invoice_id": 1,
    "customer_id": 1,
    "date": "2025-10-27",
    "payment_method": "bank_transfer",
    "note": "First payment installment"
  }'
```

---

### 4. Update Payment Receipt
**PUT** `/payment-receipts/{id}`

Updates an existing payment receipt. If the `sales_invoice_id` or `amount` is changed, the payment status of both the old and new invoices (if applicable) is automatically recalculated.

**Headers:**
```
Authorization: Bearer {your_token}
Content-Type: application/json
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Payment receipt ID |

**Request Body:**
```json
{
  "receipt_no": "REC001-UPDATED",
  "amount": 7500,
  "title": "Updated payment for Invoice INV001",
  "sales_invoice_id": 1,
  "customer_id": 1,
  "date": "2025-10-27",
  "note": "Updated payment amount",
  "payment_method": "credit_card"
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| receipt_no | string | Sometimes | Unique receipt number (max 255 characters) |
| amount | integer | Sometimes | Payment amount (must be at least 1) |
| title | string | No | Receipt title or description (max 255 characters) |
| sales_invoice_id | integer | No | Sales invoice ID (must exist in sales_invoices table) |
| customer_id | integer | Sometimes | Customer ID (must exist in customers table) |
| date | date | No | Payment date |
| note | text | No | Additional notes about the payment |
| payment_method | string | No | Payment method: "cash", "check", "bank_transfer", "credit_card", "debit_card", "online", "other" |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Payment receipt updated successfully",
  "data": {
    "id": 1,
    "receipt_no": "REC001-UPDATED",
    "amount": 7500,
    "title": "Updated payment for Invoice INV001",
    "sales_invoice_id": 1,
    "customer_id": 1,
    "user_id": 1,
    "organization_id": 1,
    "date": "2025-10-27",
    "note": "Updated payment amount",
    "payment_method": "credit_card",
    "is_deleted": 0,
    "customer": {
      "id": 1,
      "name": "John Doe"
    },
    "sales_invoice": {
      "id": 1,
      "invoice_no": "INV001",
      "payment_status": "partial"
    }
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Payment receipt not found"
}
```

**Error Response (422):**
```json
{
  "success": false,
  "errors": {
    "amount": ["The amount must be at least 1."]
  }
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:8000/api/payment-receipts/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 7500,
    "note": "Updated payment amount"
  }'
```

---

### 5. Delete Payment Receipt
**DELETE** `/payment-receipts/{id}`

Soft deletes a payment receipt by setting `is_deleted = 1`. If the receipt was linked to a sales invoice, the invoice's payment status is automatically recalculated.

**Headers:**
```
Authorization: Bearer {your_token}
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Payment receipt ID |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Payment receipt deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Payment receipt not found"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Failed to delete payment receipt",
  "error": "Error message details"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:8000/api/payment-receipts/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Important Notes

### Automatic Field Population
The following fields are automatically populated and should **not** be included in the request:
- `user_id` - Set to the authenticated user's ID
- `organization_id` - Set to the authenticated user's organization ID
- `is_deleted` - Defaults to 0 (not deleted)

### Organization Scope
All payment receipts are automatically scoped to the authenticated user's organization. Users can only:
- View payment receipts from their own organization
- Create payment receipts for their own organization
- Update/Delete payment receipts from their own organization

### Automatic Invoice Payment Status Updates
When a payment receipt is created, updated, or deleted and is linked to a sales invoice, the system automatically:
1. Calculates the total paid amount for that invoice (sum of all non-deleted payment receipts)
2. Updates the invoice's `payment_status` field:
   - `"paid"` - if total paid amount >= invoice grand_total
   - `"partial"` - if total paid amount > 0 but < invoice grand_total
   - `"unpaid"` - if total paid amount = 0

### Soft Delete Implementation
Payment receipts are not permanently deleted. Instead, the `is_deleted` flag is set to `1`. This allows:
- Historical tracking of all payments
- Proper recalculation of invoice payment status
- Ability to restore receipts if needed

### Payment Methods
The following payment methods are supported:
- `cash` (default)
- `check`
- `bank_transfer`
- `credit_card`
- `debit_card`
- `online`
- `other`

---

## Common Use Cases

### Recording a Cash Payment
```bash
curl -X POST http://localhost:8000/api/payment-receipts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "receipt_no": "REC-2025-001",
    "amount": 10000,
    "customer_id": 1,
    "payment_method": "cash",
    "date": "2025-10-27"
  }'
```

### Recording a Payment Against an Invoice
```bash
curl -X POST http://localhost:8000/api/payment-receipts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "receipt_no": "REC-2025-002",
    "amount": 5000,
    "customer_id": 1,
    "sales_invoice_id": 1,
    "payment_method": "bank_transfer",
    "title": "Partial payment for INV001",
    "note": "First installment of 2"
  }'
```

### Updating Payment Amount
```bash
curl -X PUT http://localhost:8000/api/payment-receipts/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 7500,
    "note": "Corrected payment amount"
  }'
```

### Getting All Receipts for a Customer
```bash
curl -X GET "http://localhost:8000/api/payment-receipts?customer_id=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Getting All Receipts for an Invoice
```bash
curl -X GET "http://localhost:8000/api/payment-receipts?sales_invoice_id=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Filtering by Payment Method
```bash
curl -X GET "http://localhost:8000/api/payment-receipts?payment_method=bank_transfer" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Searching by Receipt Number
```bash
curl -X GET "http://localhost:8000/api/payment-receipts?search=REC001" \
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
  "message": "Payment receipt not found"
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

### Complete Payment Receipt Flow

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

3. **Create an invoice** (if linking to an invoice):
```bash
curl -X POST http://localhost:8000/api/sales-invoices \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "invoice_no": "INV001",
    "customer_id": 1,
    "grand_total": 10000,
    "payment_status": "unpaid",
    "invoice_items": [{"item":"Service","quantity":1,"rate":10000,"total":10000}]
  }'
```

4. **Create a payment receipt**:
```bash
curl -X POST http://localhost:8000/api/payment-receipts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "receipt_no": "REC001",
    "amount": 5000,
    "customer_id": 1,
    "sales_invoice_id": 1,
    "payment_method": "bank_transfer"
  }'
```

5. **Verify invoice payment status** (should be "partial"):
```bash
curl -X GET http://localhost:8000/api/sales-invoices/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

6. **Create another payment receipt** to complete the payment:
```bash
curl -X POST http://localhost:8000/api/payment-receipts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "receipt_no": "REC002",
    "amount": 5000,
    "customer_id": 1,
    "sales_invoice_id": 1,
    "payment_method": "cash"
  }'
```

7. **Verify invoice payment status again** (should now be "paid"):
```bash
curl -X GET http://localhost:8000/api/sales-invoices/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

8. **List all payment receipts**:
```bash
curl -X GET http://localhost:8000/api/payment-receipts \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Payment Status Logic

### How Payment Status is Calculated

When a payment receipt is created, updated, or deleted, the system:

1. Finds all payment receipts linked to the invoice where `is_deleted = 0`
2. Sums up the `amount` field of all these receipts
3. Compares the total with the invoice's `grand_total`:
   - If `total_paid >= grand_total` → status = `"paid"`
   - If `total_paid > 0 AND total_paid < grand_total` → status = `"partial"`
   - If `total_paid = 0` → status = `"unpaid"`

### Example Scenario

**Invoice:** INV001 with `grand_total = 10,000`

**Payment Receipts:**
- REC001: 3,000 (paid via cash)
- REC002: 2,000 (paid via bank transfer)
- REC003: 5,000 (paid via credit card)

**Result:** Total paid = 10,000 → Invoice status = `"paid"`

**If REC003 is deleted:**
- Total paid = 5,000 → Invoice status changes to `"partial"`

---

## Integration with Sales Invoices

Payment receipts can optionally be linked to sales invoices. Benefits of linking:

1. **Automatic Status Updates:** Invoice payment status is automatically updated
2. **Payment Tracking:** Easily see all payments made against an invoice
3. **Financial Reporting:** Get accurate payment history per invoice
4. **Audit Trail:** Track when and how payments were received

### Creating Receipts Without Invoice Link

You can also create standalone payment receipts that are not linked to any invoice:

```bash
curl -X POST http://localhost:8000/api/payment-receipts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "receipt_no": "REC-ADVANCE-001",
    "amount": 5000,
    "customer_id": 1,
    "payment_method": "bank_transfer",
    "title": "Advance payment",
    "note": "Advance payment for future services"
  }'
```

This is useful for:
- Advance payments
- Deposits
- General customer payments not tied to a specific invoice

---

## Best Practices

1. **Unique Receipt Numbers:** Always use unique receipt numbers for tracking and accounting purposes

2. **Include Descriptive Titles:** Add a title to help identify the purpose of the payment

3. **Add Notes:** Use the note field to record additional context about the payment

4. **Link to Invoices:** When possible, link receipts to invoices for automatic payment tracking

5. **Specify Payment Method:** Always specify the payment method for accurate financial records

6. **Use Correct Dates:** Ensure the payment date reflects the actual date payment was received

7. **Verify Status Updates:** After creating/updating receipts, verify that invoice payment status updated correctly

8. **Handle Partial Payments:** When dealing with partial payments, create separate receipts for each payment received
