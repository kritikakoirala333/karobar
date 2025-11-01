# Customer API Documentation

## Overview
The Customer API allows you to create, read, update, and delete customers. The API provides comprehensive customer information including all associated sales invoices, payment receipts, and financial statistics. All operations can be scoped to organizations.

## Base URL
```
http://localhost:8000/api/customers
```

## Authentication
Most endpoints require JWT authentication. Include the Bearer token in the Authorization header:
```
Authorization: Bearer {your_token}
```

---

## Endpoints

### 1. Get All Customers
**GET** `/customers`

Retrieves a paginated list of all customers with their associated organization and creator information.

**Headers:**
```
Authorization: Bearer {your_token}
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| organization_id | integer | Filter by organization ID |
| type | string | Filter by customer type ("person" or "company") |
| search | string | Search by name, email, or phone |
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
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "country": "USA",
        "address": "123 Main St, New York, NY 10001",
        "pan_vat": "PAN123456",
        "type": "person",
        "note": "VIP customer",
        "organization_id": 1,
        "created_by_user": 1,
        "created_at": "2025-10-27T08:00:00.000000Z",
        "updated_at": "2025-10-27T08:00:00.000000Z",
        "organization": {
          "id": 1,
          "name": "TechVision Solutions"
        },
        "creator": {
          "id": 1,
          "name": "Niraj Bhandari",
          "email": "niraj@azure.com.np"
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
curl -X GET "http://localhost:8000/api/customers?search=John" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 2. Get Single Customer (with Complete Details)
**GET** `/customers/{id}`

Retrieves comprehensive details of a specific customer including:
- Customer information
- All sales invoices with their items
- All payment receipts
- Financial statistics and summaries

This is the primary endpoint for viewing complete customer information.

**Headers:**
```
Authorization: Bearer {your_token}
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Customer ID |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "country": "USA",
    "address": "123 Main St, New York, NY 10001",
    "pan_vat": "PAN123456",
    "type": "person",
    "note": "VIP customer",
    "organization_id": 1,
    "created_by_user": 1,
    "created_at": "2025-10-27T08:00:00.000000Z",
    "updated_at": "2025-10-27T08:00:00.000000Z",
    "organization": {
      "id": 1,
      "name": "TechVision Solutions",
      "email": "info@techvision.com"
    },
    "creator": {
      "id": 1,
      "name": "Niraj Bhandari",
      "email": "niraj@azure.com.np"
    },
    "sales_invoices": [
      {
        "id": 1,
        "invoice_no": "INV001",
        "customer_id": 1,
        "user_id": 1,
        "organization_id": 1,
        "date": "2025-10-20",
        "subtotal": 10000,
        "discount": 0,
        "shipping": 0,
        "tax": 1000,
        "tax_type": "percentage",
        "discount_type": "percentage",
        "grand_total": "11000.00",
        "status": "completed",
        "payment_status": "partial",
        "note": "Web development project",
        "created_at": "2025-10-20T08:00:00.000000Z",
        "updated_at": "2025-10-27T08:00:00.000000Z",
        "invoice_items": [
          {
            "id": 1,
            "sales_invoice_id": 1,
            "item": "Web Development",
            "quantity": 100,
            "rate": 100,
            "total": 10000,
            "discount": 0,
            "unit": "hours",
            "note": "Frontend and Backend Development"
          }
        ]
      },
      {
        "id": 2,
        "invoice_no": "INV002",
        "customer_id": 1,
        "date": "2025-10-25",
        "grand_total": "5000.00",
        "payment_status": "paid",
        "invoice_items": [
          {
            "id": 2,
            "item": "Consulting Services",
            "quantity": 10,
            "rate": 500,
            "total": 5000
          }
        ]
      }
    ],
    "payment_receipts": [
      {
        "id": 1,
        "receipt_no": "REC001",
        "amount": 5000,
        "title": "Partial payment for INV001",
        "sales_invoice_id": 1,
        "customer_id": 1,
        "user_id": 1,
        "organization_id": 1,
        "date": "2025-10-22",
        "note": "First installment",
        "payment_method": "bank_transfer",
        "is_deleted": 0,
        "created_at": "2025-10-22T08:00:00.000000Z",
        "updated_at": "2025-10-22T08:00:00.000000Z",
        "sales_invoice": {
          "id": 1,
          "invoice_no": "INV001",
          "grand_total": "11000.00",
          "payment_status": "partial"
        }
      },
      {
        "id": 2,
        "receipt_no": "REC002",
        "amount": 5000,
        "title": "Full payment for INV002",
        "sales_invoice_id": 2,
        "customer_id": 1,
        "date": "2025-10-25",
        "payment_method": "cash",
        "sales_invoice": {
          "id": 2,
          "invoice_no": "INV002",
          "grand_total": "5000.00",
          "payment_status": "paid"
        }
      }
    ],
    "statistics": {
      "total_invoices": 2,
      "total_invoice_amount": 16000,
      "total_paid": 10000,
      "total_outstanding": 6000,
      "paid_invoices_count": 1,
      "unpaid_invoices_count": 0,
      "partial_invoices_count": 1,
      "total_payment_receipts": 2
    }
  }
}
```

**Statistics Explained:**

| Field | Description |
|-------|-------------|
| total_invoices | Total number of invoices created for this customer |
| total_invoice_amount | Sum of all invoice grand_total amounts |
| total_paid | Sum of all payment receipt amounts (excluding deleted receipts) |
| total_outstanding | Amount still owed (total_invoice_amount - total_paid) |
| paid_invoices_count | Number of invoices with payment_status = "paid" |
| unpaid_invoices_count | Number of invoices with payment_status = "unpaid" |
| partial_invoices_count | Number of invoices with payment_status = "partial" |
| total_payment_receipts | Total number of payment receipts recorded |

**Error Response (404):**
```json
{
  "success": false,
  "message": "Customer not found"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:8000/api/customers/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. Create Customer
**POST** `/customers`

Creates a new customer. The `created_by_user` is automatically set from the authenticated user.

**Headers:**
```
Authorization: Bearer {your_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "country": "USA",
  "address": "123 Main St, New York, NY 10001",
  "pan_vat": "PAN123456",
  "type": "person",
  "note": "VIP customer",
  "organization_id": 1
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Customer name (max 255 characters) |
| email | string | No | Customer email address (must be valid email format) |
| phone | string | No | Customer phone number (max 255 characters) |
| country | string | No | Customer country (max 255 characters) |
| address | string | No | Customer address (max 255 characters) |
| pan_vat | string | No | PAN/VAT number (max 255 characters) |
| type | string | No | Customer type: "person" or "company" (default: "person") |
| note | string | No | Additional notes (max 255 characters) |
| organization_id | integer | No | Organization ID (must exist in organizations table) |

**Success Response (201):**
```json
{
  "success": true,
  "message": "Customer created successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "country": "USA",
    "address": "123 Main St, New York, NY 10001",
    "pan_vat": "PAN123456",
    "type": "person",
    "note": "VIP customer",
    "organization_id": 1,
    "created_by_user": 1,
    "created_at": "2025-10-27T08:00:00.000000Z",
    "updated_at": "2025-10-27T08:00:00.000000Z",
    "organization": {
      "id": 1,
      "name": "TechVision Solutions"
    },
    "creator": {
      "id": 1,
      "name": "Niraj Bhandari"
    }
  }
}
```

**Error Response (422):**
```json
{
  "success": false,
  "errors": {
    "name": ["The name field is required."],
    "email": ["The email must be a valid email address."],
    "type": ["The selected type is invalid."]
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/customers \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "country": "USA",
    "address": "123 Main St, New York, NY 10001",
    "type": "person"
  }'
```

---

### 4. Update Customer
**PUT** `/customers/{id}`

Updates an existing customer's information.

**Headers:**
```
Authorization: Bearer {your_token}
Content-Type: application/json
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Customer ID |

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "phone": "+1987654321",
  "country": "Canada",
  "address": "456 Oak Ave, Toronto, ON M5H 2N2",
  "pan_vat": "PAN654321",
  "type": "company",
  "note": "Premium customer - updated",
  "organization_id": 1
}
```

**Field Descriptions:**

All fields are optional. Only include the fields you want to update.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Sometimes | Customer name (max 255 characters) - required if provided |
| email | string | No | Customer email address (must be valid email format) |
| phone | string | No | Customer phone number (max 255 characters) |
| country | string | No | Customer country (max 255 characters) |
| address | string | No | Customer address (max 255 characters) |
| pan_vat | string | No | PAN/VAT number (max 255 characters) |
| type | string | No | Customer type: "person" or "company" |
| note | string | No | Additional notes (max 255 characters) |
| organization_id | integer | No | Organization ID (must exist in organizations table) |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Customer updated successfully",
  "data": {
    "id": 1,
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "phone": "+1987654321",
    "country": "Canada",
    "address": "456 Oak Ave, Toronto, ON M5H 2N2",
    "pan_vat": "PAN654321",
    "type": "company",
    "note": "Premium customer - updated",
    "organization_id": 1,
    "created_by_user": 1,
    "updated_at": "2025-10-27T09:00:00.000000Z",
    "organization": {
      "id": 1,
      "name": "TechVision Solutions"
    },
    "creator": {
      "id": 1,
      "name": "Niraj Bhandari"
    }
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Customer not found"
}
```

**Error Response (422):**
```json
{
  "success": false,
  "errors": {
    "email": ["The email must be a valid email address."],
    "type": ["The selected type is invalid."]
  }
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:8000/api/customers/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe Updated",
    "phone": "+1987654321"
  }'
```

---

### 5. Delete Customer
**DELETE** `/customers/{id}`

Deletes a customer from the system. This is a hard delete operation.

**Important:** Deleting a customer may affect related invoices and payment receipts depending on your database constraints.

**Headers:**
```
Authorization: Bearer {your_token}
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Customer ID |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Customer deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Customer not found"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:8000/api/customers/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Important Notes

### Automatic Field Population
The following field is automatically populated and should **not** be included in the request:
- `created_by_user` - Set to the authenticated user's ID

### Customer Types
Two customer types are supported:
- `"person"` - Individual customer (default)
- `"company"` - Business/corporate customer

### Relationships Loaded

**For Index (List All):**
- `organization` - The organization the customer belongs to
- `creator` - The user who created the customer record

**For Show (Single Customer):**
- `organization` - The organization the customer belongs to
- `creator` - The user who created the customer record
- `salesInvoices` - All sales invoices with their line items (ordered by most recent)
- `paymentReceipts` - All non-deleted payment receipts (ordered by most recent)
- `statistics` - Calculated financial statistics

### Search Functionality
The search parameter performs a fuzzy search across three fields:
- Customer name
- Customer email
- Customer phone number

Example: `?search=john` will match "John Doe", "john@example.com", or "+1234567890"

---

## Common Use Cases

### Creating a Person Customer
```bash
curl -X POST http://localhost:8000/api/customers \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1555123456",
    "type": "person"
  }'
```

### Creating a Company Customer
```bash
curl -X POST http://localhost:8000/api/customers \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Corporation",
    "email": "contact@acme.com",
    "phone": "+1555999888",
    "country": "USA",
    "address": "100 Business Park, Suite 200",
    "pan_vat": "VAT123456789",
    "type": "company",
    "note": "Major client - 5 year contract"
  }'
```

### Getting Complete Customer Financial Overview
```bash
# This shows all invoices, payments, and statistics
curl -X GET http://localhost:8000/api/customers/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Filtering Customers by Organization
```bash
curl -X GET "http://localhost:8000/api/customers?organization_id=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Filtering Customers by Type
```bash
curl -X GET "http://localhost:8000/api/customers?type=company" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Searching for Customers
```bash
# Search by name, email, or phone
curl -X GET "http://localhost:8000/api/customers?search=john" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Updating Customer Email Only
```bash
curl -X PUT http://localhost:8000/api/customers/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newemail@example.com"
  }'
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
  "message": "Customer not found"
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

### Complete Customer Management Flow

1. **Login** to get JWT token:
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"niraj@azure.com.np","password":"password"}'
```

2. **Create a customer**:
```bash
curl -X POST http://localhost:8000/api/customers \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "type": "person"
  }'
```

3. **Create an invoice for the customer**:
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

4. **Record a payment receipt**:
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

5. **Get complete customer overview** (with invoices, payments, and statistics):
```bash
curl -X GET http://localhost:8000/api/customers/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

This will return:
- Customer details
- All invoices with items
- All payment receipts
- Financial statistics showing total invoiced, paid, and outstanding amounts

6. **List all customers**:
```bash
curl -X GET http://localhost:8000/api/customers \
  -H "Authorization: Bearer YOUR_TOKEN"
```

7. **Update customer information**:
```bash
curl -X PUT http://localhost:8000/api/customers/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "note": "Premium customer - updated status"
  }'
```

---

## Customer Statistics Details

When fetching a single customer (`GET /customers/{id}`), the response includes a `statistics` object with comprehensive financial information:

### Statistics Object Structure

```json
"statistics": {
  "total_invoices": 5,
  "total_invoice_amount": 50000,
  "total_paid": 35000,
  "total_outstanding": 15000,
  "paid_invoices_count": 2,
  "unpaid_invoices_count": 1,
  "partial_invoices_count": 2,
  "total_payment_receipts": 7
}
```

### Use Cases for Statistics

**1. Customer Credit Assessment**
```javascript
// Check if customer has outstanding balance
if (statistics.total_outstanding > 0) {
  // Customer has unpaid invoices
}
```

**2. Payment Tracking**
```javascript
// Calculate payment completion percentage
const paymentPercentage = (statistics.total_paid / statistics.total_invoice_amount) * 100;
```

**3. Customer Segmentation**
```javascript
// Identify high-value customers
if (statistics.total_invoice_amount > 100000) {
  // Mark as premium customer
}
```

**4. Collections Management**
```javascript
// Find customers with partial payments
if (statistics.partial_invoices_count > 0) {
  // Follow up on partial payments
}
```

---

## Data Relationships

### Customer has many:
- **Sales Invoices** - All invoices created for this customer
  - Each invoice includes its line items
- **Payment Receipts** - All payment records for this customer
  - Each receipt may link to a specific invoice

### Customer belongs to:
- **Organization** - The organization managing this customer
- **Creator (User)** - The user who created the customer record

---

## Best Practices

1. **Always Use GET /customers/{id} for Complete Information**
   - Use this endpoint when you need to see the full customer picture
   - Includes all invoices, payments, and financial statistics

2. **Use Search for Quick Lookups**
   - The search parameter is optimized for finding customers quickly
   - Searches across name, email, and phone simultaneously

3. **Filter by Organization**
   - When managing multiple organizations, always filter by organization_id
   - Ensures data isolation between different businesses

4. **Track Customer Type**
   - Use "person" for individuals
   - Use "company" for businesses
   - This helps with reporting and segmentation

5. **Leverage Statistics**
   - Use the statistics object to make business decisions
   - Monitor outstanding balances
   - Track payment patterns

6. **Include Descriptive Notes**
   - Use the note field to record important customer information
   - Track special requirements or preferences

7. **Keep Contact Information Updated**
   - Regularly verify email and phone numbers
   - Ensure reliable communication channels

8. **Monitor Outstanding Balances**
   - Regularly check `total_outstanding` in statistics
   - Follow up on partial payments promptly
