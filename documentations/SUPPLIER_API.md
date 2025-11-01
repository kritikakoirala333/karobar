# Supplier API Documentation

## Overview
The Supplier API allows you to create, read, update, and delete suppliers. The API provides comprehensive supplier information including all associated purchase invoices, purchase payment receipts, and financial statistics. All operations can be scoped to organizations.

## Base URL
```
http://localhost:8000/api/suppliers
```

## Authentication
Most endpoints require JWT authentication. Include the Bearer token in the Authorization header:
```
Authorization: Bearer {your_token}
```

---

## Endpoints

### 1. Get All Suppliers
**GET** `/suppliers`

Retrieves a paginated list of all suppliers with their associated organization and creator information.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| organization_id | integer | Filter by organization ID |
| type | string | Filter by supplier type ("person" or "company") |
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
        "name": "ABC Suppliers Ltd",
        "email": "contact@abcsuppliers.com",
        "phone": "+1234567890",
        "country": "USA",
        "address": "456 Industrial Ave, Chicago, IL 60601",
        "pan_vat": "VAT987654",
        "type": "company",
        "note": "Main supplier for electronics",
        "organization_id": 1,
        "created_by_user": 1,
        "created_at": "2025-10-30T13:35:00.000000Z",
        "updated_at": "2025-10-30T13:35:00.000000Z"
      }
    ],
    "per_page": 10,
    "total": 1
  }
}
```

---

### 2. Get Single Supplier
**GET** `/suppliers/{id}`

Retrieves comprehensive details of a specific supplier including all purchase invoices, purchase payment receipts, and financial statistics.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "ABC Suppliers Ltd",
    "email": "contact@abcsuppliers.com",
    "statistics": {
      "total_invoices": 1,
      "total_invoice_amount": 10700,
      "total_paid": 5000,
      "total_outstanding": 5700,
      "paid_invoices_count": 0,
      "unpaid_invoices_count": 0,
      "partial_invoices_count": 1,
      "total_payment_receipts": 1
    }
  }
}
```

---

### 3. Create New Supplier
**POST** `/suppliers`

**Request Body:**
```json
{
  "name": "ABC Suppliers Ltd",
  "email": "contact@abcsuppliers.com",
  "phone": "+1234567890",
  "country": "USA",
  "address": "456 Industrial Ave, Chicago, IL 60601",
  "pan_vat": "VAT987654",
  "type": "company",
  "note": "Main supplier for electronics",
  "organization_id": 1
}
```

**Required Fields:** name

---

### 4. Update Supplier
**PUT** `/suppliers/{id}`

Updates an existing supplier's information.

---

### 5. Delete Supplier
**DELETE** `/suppliers/{id}`

Permanently deletes a supplier from the system.

---

## Notes
- All timestamps are in UTC format
- Pagination returns 10 items per page by default
- Supplier types must be either "person" or "company"
- Search functionality searches across name, email, and phone fields
