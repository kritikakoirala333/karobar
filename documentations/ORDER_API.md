# Order Management API Documentation

This document provides detailed information about the Order Management API endpoints.

## Base URL
```
http://your-domain.com/api
```

## Authentication
All endpoints require API authentication (middleware: 'api').

---

## Endpoints

### 1. List Orders
Get a paginated list of all orders with filtering and sorting options.

**Endpoint:** `GET /api/orders`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `organization_id` | integer | No | Filter by organization ID |
| `status` | string | No | Filter by status (pending, confirmed, processing, shipped, delivered, cancelled) |
| `payment_status` | string | No | Filter by payment status (unpaid, paid, refunded) |
| `start_date` | date | No | Filter orders from this date (YYYY-MM-DD) |
| `end_date` | date | No | Filter orders until this date (YYYY-MM-DD) |
| `search` | string | No | Search by order number, customer name, or phone |
| `sort_by` | string | No | Sort field (default: created_at) |
| `sort_order` | string | No | Sort order: asc or desc (default: desc) |
| `per_page` | integer | No | Items per page (default: 15) |

**Example Request:**
```bash
curl -X GET "http://your-domain.com/api/orders?organization_id=1&status=pending&per_page=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "order_number": "ORD-6721A5B34F7D8",
      "organization_id": 1,
      "customer_name": "John Doe",
      "customer_phone": "+1234567890",
      "customer_address": "123 Main St, City, State 12345",
      "customer_email": "john@example.com",
      "billing_address": null,
      "billing_name": null,
      "billing_phone": null,
      "total_amount": 599900,
      "total_items": 3,
      "note": "Please deliver before 5 PM",
      "status": "pending",
      "payment_status": "unpaid",
      "payment_method": "Cash on Delivery",
      "confirmed_at": null,
      "delivered_at": null,
      "created_at": "2025-10-30T10:30:00.000000Z",
      "updated_at": "2025-10-30T10:30:00.000000Z",
      "organization": {
        "id": 1,
        "business_name": "My Shop"
      },
      "items": [
        {
          "id": 1,
          "order_id": 1,
          "inventory_id": 5,
          "product_name": "Wireless Bluetooth Headphones",
          "product_price": 5999,
          "quantity": 2,
          "subtotal": 11998,
          "product_sku": "SKU-001",
          "variation_id": null
        }
      ]
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 15,
    "total": 45,
    "last_page": 3
  }
}
```

---

### 2. Get Single Order
Retrieve detailed information about a specific order.

**Endpoint:** `GET /api/orders/{id}`

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Order ID |

**Example Request:**
```bash
curl -X GET "http://your-domain.com/api/orders/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "order_number": "ORD-6721A5B34F7D8",
    "organization_id": 1,
    "customer_name": "John Doe",
    "customer_phone": "+1234567890",
    "customer_address": "123 Main St, City, State 12345",
    "customer_email": "john@example.com",
    "billing_address": "456 Billing St, City, State 12345",
    "billing_name": "John Doe",
    "billing_phone": "+1234567890",
    "total_amount": 599900,
    "total_items": 3,
    "note": "Please deliver before 5 PM",
    "status": "confirmed",
    "payment_status": "paid",
    "payment_method": "UPI",
    "confirmed_at": "2025-10-30T11:00:00.000000Z",
    "delivered_at": null,
    "created_at": "2025-10-30T10:30:00.000000Z",
    "updated_at": "2025-10-30T11:00:00.000000Z",
    "organization": {
      "id": 1,
      "business_name": "My Shop"
    },
    "items": [
      {
        "id": 1,
        "order_id": 1,
        "inventory_id": 5,
        "product_name": "Wireless Bluetooth Headphones",
        "product_price": 5999,
        "quantity": 2,
        "subtotal": 11998,
        "product_sku": "SKU-001",
        "inventory": {
          "id": 5,
          "name": "Wireless Bluetooth Headphones",
          "default_price": 5999
        }
      }
    ]
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Order not found"
}
```

---

### 3. Update Order Status
Update the status of an order.

**Endpoint:** `PUT /api/orders/{id}/status`

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Order ID |

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | string | Yes | Order status: pending, confirmed, processing, shipped, delivered, cancelled |

**Example Request:**
```bash
curl -X PUT "http://your-domain.com/api/orders/1/status" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "confirmed"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "id": 1,
    "order_number": "ORD-6721A5B34F7D8",
    "status": "confirmed",
    "confirmed_at": "2025-10-30T11:00:00.000000Z",
    "created_at": "2025-10-30T10:30:00.000000Z",
    "updated_at": "2025-10-30T11:00:00.000000Z"
  }
}
```

**Validation Error (422):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "status": [
      "The selected status is invalid."
    ]
  }
}
```

**Notes:**
- When status is changed to "confirmed", `confirmed_at` timestamp is automatically set
- When status is changed to "delivered", `delivered_at` timestamp is automatically set

---

### 4. Update Payment Status
Update the payment status of an order.

**Endpoint:** `PUT /api/orders/{id}/payment-status`

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Order ID |

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `payment_status` | string | Yes | Payment status: unpaid, paid, refunded |

**Example Request:**
```bash
curl -X PUT "http://your-domain.com/api/orders/1/payment-status" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "payment_status": "paid"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Payment status updated successfully",
  "data": {
    "id": 1,
    "order_number": "ORD-6721A5B34F7D8",
    "payment_status": "paid",
    "created_at": "2025-10-30T10:30:00.000000Z",
    "updated_at": "2025-10-30T11:30:00.000000Z"
  }
}
```

**Validation Error (422):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "payment_status": [
      "The selected payment status is invalid."
    ]
  }
}
```

---

### 5. Update Order Details
Update order customer information and notes.

**Endpoint:** `PUT /api/orders/{id}`

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Order ID |

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `customer_name` | string | No | Customer name |
| `customer_phone` | string | No | Customer phone |
| `customer_address` | string | No | Customer address |
| `customer_email` | string | No | Customer email |
| `billing_address` | string | No | Billing address |
| `billing_name` | string | No | Billing name |
| `billing_phone` | string | No | Billing phone |
| `note` | string | No | Order notes |
| `payment_method` | string | No | Payment method |

**Example Request:**
```bash
curl -X PUT "http://your-domain.com/api/orders/1" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "John Updated Doe",
    "customer_email": "johnupdated@example.com",
    "note": "Updated delivery instructions"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Order updated successfully",
  "data": {
    "id": 1,
    "order_number": "ORD-6721A5B34F7D8",
    "customer_name": "John Updated Doe",
    "customer_email": "johnupdated@example.com",
    "note": "Updated delivery instructions",
    "created_at": "2025-10-30T10:30:00.000000Z",
    "updated_at": "2025-10-30T12:00:00.000000Z"
  }
}
```

---

### 6. Delete Order
Delete an order (only pending or cancelled orders can be deleted).

**Endpoint:** `DELETE /api/orders/{id}`

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Order ID |

**Example Request:**
```bash
curl -X DELETE "http://your-domain.com/api/orders/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Order deleted successfully"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Only pending or cancelled orders can be deleted"
}
```

---

### 7. Get Order Statistics
Get statistical data about orders.

**Endpoint:** `GET /api/orders/statistics`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `organization_id` | integer | No | Filter by organization ID |
| `start_date` | date | No | Filter from this date (YYYY-MM-DD) |
| `end_date` | date | No | Filter until this date (YYYY-MM-DD) |

**Example Request:**
```bash
curl -X GET "http://your-domain.com/api/orders/statistics?organization_id=1&start_date=2025-10-01&end_date=2025-10-31" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "total_orders": 145,
    "total_revenue": 8750000,
    "total_items_sold": 432,
    "by_status": {
      "pending": 23,
      "confirmed": 45,
      "processing": 12,
      "shipped": 30,
      "delivered": 32,
      "cancelled": 3
    },
    "by_payment_status": {
      "unpaid": 35,
      "paid": 108,
      "refunded": 2
    },
    "revenue_by_payment_status": {
      "unpaid": 2100000,
      "paid": 6500000,
      "refunded": 150000
    }
  }
}
```

---

## Status Values

### Order Status
- `pending` - Order is placed but not confirmed
- `confirmed` - Order is confirmed
- `processing` - Order is being prepared
- `shipped` - Order has been shipped
- `delivered` - Order has been delivered
- `cancelled` - Order is cancelled

### Payment Status
- `unpaid` - Payment not received
- `paid` - Payment received
- `refunded` - Payment refunded

---

## Data Types

### Price Amounts
All monetary amounts are stored in **cents** (integer).
- Example: ₹59.99 is stored as 5999
- To display: divide by 100

### Timestamps
All timestamps are in ISO 8601 format with timezone.
- Example: `2025-10-30T10:30:00.000000Z`

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 404 | Order not found |
| 422 | Validation error |
| 403 | Forbidden action |
| 500 | Server error |

---

## Notes

1. All orders are associated with an organization
2. Order items store product information at the time of order (snapshot)
3. `confirmed_at` and `delivered_at` timestamps are automatically set when status changes
4. Only pending or cancelled orders can be deleted
5. All responses include a `success` boolean field
6. Pagination is available on the list endpoint
7. Filtering can be combined (e.g., status + date range + organization)

---

## Examples

### Example 1: Get all pending orders for an organization
```bash
GET /api/orders?organization_id=1&status=pending&sort_order=asc
```

### Example 2: Mark order as paid
```bash
PUT /api/orders/5/payment-status
Body: { "payment_status": "paid" }
```

### Example 3: Update order status to shipped
```bash
PUT /api/orders/5/status
Body: { "status": "shipped" }
```

### Example 4: Get monthly statistics
```bash
GET /api/orders/statistics?organization_id=1&start_date=2025-10-01&end_date=2025-10-31
```

---

## Integration Guide

1. **List Orders**: Use for displaying order management dashboard
2. **Update Status**: Use for order workflow management
3. **Update Payment Status**: Use when payment is received/refunded
4. **Statistics**: Use for analytics and reporting
5. **Delete**: Use carefully - only for pending/cancelled orders

---

For more information, please contact the API development team.
