# Inventory Management API Documentation

## Overview
The Inventory Management API provides comprehensive inventory tracking with 3-level stock management (inventory → variation → batch). It supports CRUD operations for inventory items, variations, and real-time stock management with automatic ledger recording.

## Base URL
```
http://localhost:8000/api
```

## Authentication
All endpoints require JWT authentication. Include the Bearer token in the Authorization header:
```
Authorization: Bearer {your_token}
```

---

## Table of Contents
1. [Inventory CRUD](#inventory-crud)
2. [Variation CRUD](#variation-crud)
3. [Stock Management](#stock-management)
4. [Data Structures](#data-structures)
5. [Common Use Cases](#common-use-cases)
6. [Error Handling](#error-handling)

---

## Inventory CRUD

### 1. Get All Inventories
**GET** `/inventories`

Retrieves a paginated list of all inventory items with related data.

**Headers:**
```
Authorization: Bearer {your_token}
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| type | string | Filter by inventory type |
| category_id | integer | Filter by category ID |
| brand_id | integer | Filter by brand ID |
| unit_id | integer | Filter by unit ID |
| has_variations | boolean | Filter by variation flag (true/false) |
| has_batches | boolean | Filter by batch tracking flag (true/false) |
| stock_status | string | Filter by stock status: "in_stock", "out_of_stock", "low_stock" |
| low_stock_threshold | integer | Threshold for low_stock filter (required when stock_status=low_stock) |
| search | string | Search by name or QR code |
| per_page | integer | Items per page (default: 10, max: 100) |
| page | integer | Page number for pagination |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "name": "T-Shirt",
        "type": "product",
        "stock_quantity": 150,
        "default_price": 2000,
        "default_cost_price": 1200,
        "unit_id": 1,
        "category_id": 1,
        "brand_id": 1,
        "qr_code": "TSH-001",
        "has_variations": true,
        "has_batches": false,
        "note": "Cotton T-Shirt",
        "is_deleted": 0,
        "user_id": 1,
        "organization_id": 1,
        "created_at": "2025-10-28T08:00:00.000000Z",
        "updated_at": "2025-10-28T08:00:00.000000Z",
        "user": {
          "id": 1,
          "name": "Niraj Bhandari"
        },
        "organization": {
          "id": 1,
          "name": "TechVision Solutions"
        },
        "variations": [
          {
            "id": 1,
            "variation_type": "Size",
            "variation_value": "Medium",
            "variation_price": 2000,
            "stock_quantity": 100
          },
          {
            "id": 2,
            "variation_type": "Size",
            "variation_value": "Large",
            "variation_price": 2200,
            "stock_quantity": 50
          }
        ],
        "batches": []
      }
    ],
    "per_page": 10,
    "total": 1
  }
}
```

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/inventories?has_variations=true&per_page=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 2. Get Single Inventory
**GET** `/inventories/{id}`

Retrieves detailed information about a specific inventory item including all variations, batches, and recent stock records.

**Headers:**
```
Authorization: Bearer {your_token}
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Inventory ID |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "T-Shirt",
    "type": "product",
    "stock_quantity": 150,
    "default_price": 2000,
    "default_cost_price": 1200,
    "has_variations": true,
    "has_batches": false,
    "variations": [
      {
        "id": 1,
        "variation_type": "Size",
        "variation_value": "Medium",
        "variation_price": 2000,
        "stock_quantity": 100,
        "batch_tracking": false
      }
    ],
    "batches": [],
    "stock_records": [
      {
        "id": 1,
        "transaction_type": "purchase",
        "quantity": 100,
        "balance_after": 100,
        "note": "Initial stock",
        "created_at": "2025-10-28T08:00:00.000000Z"
      }
    ]
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Inventory item not found"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Unauthorized access to inventory item"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:8000/api/inventories/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. Create Inventory
**POST** `/inventories`

Creates a new inventory item. Supports nested creation of variations.

**Headers:**
```
Authorization: Bearer {your_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "T-Shirt",
  "type": "product",
  "stock_quantity": 0,
  "default_price": 2000,
  "default_cost_price": 1200,
  "unit_id": 1,
  "category_id": 1,
  "brand_id": 1,
  "qr_code": "TSH-001",
  "has_variations": true,
  "has_batches": false,
  "note": "Cotton T-Shirt",
  "variations": [
    {
      "variation_type": "Size",
      "variation_value": "Small",
      "variation_note": "Small size",
      "variation_price": 1800,
      "stock_quantity": 0,
      "batch_tracking": false
    },
    {
      "variation_type": "Size",
      "variation_value": "Medium",
      "variation_price": 2000,
      "stock_quantity": 0
    },
    {
      "variation_type": "Size",
      "variation_value": "Large",
      "variation_price": 2200,
      "stock_quantity": 0
    }
  ]
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Inventory item name (max 255 characters) |
| type | string | No | Inventory type (e.g., "product", "raw_material") |
| stock_quantity | integer | No | Initial stock quantity (default: 0) |
| default_price | integer | No | Default selling price |
| default_cost_price | integer | No | Default cost/purchase price |
| unit_id | integer | No | Reference to inventory_units table |
| category_id | integer | No | Reference to inventory_categories table |
| brand_id | integer | No | Reference to inventory_brands table |
| qr_code | string | No | QR code or barcode |
| has_variations | boolean | No | Whether item has variations (default: false) |
| has_batches | boolean | No | Whether item uses batch tracking (default: false) |
| note | text | No | Additional notes |
| variations | array | No | Array of variations (optional nested creation) |

**Variation Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| variation_type | string | Yes* | Type of variation (e.g., "Size", "Color") |
| variation_value | string | Yes* | Value (e.g., "Large", "Red") |
| variation_note | string | No | Additional notes for this variation |
| variation_price | integer | No | Price for this specific variation |
| stock_quantity | integer | No | Initial stock for this variation (default: 0) |
| batch_tracking | boolean | No | Whether this variation uses batches (default: false) |

*Required if variations array is provided

**Success Response (201):**
```json
{
  "success": true,
  "message": "Inventory item created successfully",
  "data": {
    "id": 1,
    "name": "T-Shirt",
    "type": "product",
    "stock_quantity": 0,
    "default_price": 2000,
    "has_variations": true,
    "variations": [
      {
        "id": 1,
        "variation_type": "Size",
        "variation_value": "Small",
        "variation_price": 1800
      },
      {
        "id": 2,
        "variation_type": "Size",
        "variation_value": "Medium",
        "variation_price": 2000
      },
      {
        "id": 3,
        "variation_type": "Size",
        "variation_value": "Large",
        "variation_price": 2200
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
    "name": ["The name field is required."],
    "variations.0.variation_value": ["The variation value field is required."]
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/inventories \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "T-Shirt",
    "type": "product",
    "default_price": 2000,
    "has_variations": true,
    "variations": [
      {
        "variation_type": "Size",
        "variation_value": "Medium",
        "variation_price": 2000
      }
    ]
  }'
```

---

### 4. Update Inventory
**PUT** `/inventories/{id}`

Updates an existing inventory item. Does not modify variations (use variation endpoints for that).

**Headers:**
```
Authorization: Bearer {your_token}
Content-Type: application/json
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Inventory ID |

**Request Body:**
```json
{
  "name": "T-Shirt Updated",
  "default_price": 2500,
  "default_cost_price": 1500,
  "note": "Premium cotton T-Shirt",
  "has_batches": true
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Inventory item updated successfully",
  "data": {
    "id": 1,
    "name": "T-Shirt Updated",
    "default_price": 2500,
    "default_cost_price": 1500,
    "has_batches": true,
    "note": "Premium cotton T-Shirt"
  }
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:8000/api/inventories/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "default_price": 2500,
    "note": "Premium cotton T-Shirt"
  }'
```

---

### 5. Delete Inventory
**DELETE** `/inventories/{id}`

Soft deletes an inventory item and all its related variations and batches.

**Headers:**
```
Authorization: Bearer {your_token}
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Inventory ID |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Inventory item deleted successfully"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:8000/api/inventories/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Variation CRUD

### 1. Get All Variations for Inventory
**GET** `/inventory-variations/inventory/{inventoryId}`

Retrieves all variations for a specific inventory item.

**Headers:**
```
Authorization: Bearer {your_token}
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| inventoryId | integer | Inventory ID |

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "inventory_id": 1,
      "variation_type": "Size",
      "variation_value": "Medium",
      "variation_note": null,
      "variation_price": 2000,
      "stock_quantity": 100,
      "batch_tracking": false,
      "note": null,
      "created_at": "2025-10-28T08:00:00.000000Z"
    },
    {
      "id": 2,
      "inventory_id": 1,
      "variation_type": "Size",
      "variation_value": "Large",
      "variation_price": 2200,
      "stock_quantity": 50,
      "batch_tracking": false,
      "created_at": "2025-10-28T08:00:00.000000Z"
    }
  ]
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:8000/api/inventory-variations/inventory/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 2. Create Variation
**POST** `/inventory-variations`

Creates a new variation for an inventory item.

**Headers:**
```
Authorization: Bearer {your_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "inventory_id": 1,
  "variation_type": "Color",
  "variation_value": "Blue",
  "variation_note": "Navy blue color",
  "variation_price": 2100,
  "stock_quantity": 0,
  "batch_tracking": false,
  "note": "New color variant"
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| inventory_id | integer | Yes | Inventory item ID (must exist) |
| variation_type | string | No | Type of variation (e.g., "Size", "Color") |
| variation_value | string | Yes | Value (e.g., "Large", "Red") |
| variation_note | string | No | Short note about variation |
| variation_price | integer | No | Price for this variation |
| stock_quantity | integer | No | Initial stock (default: 0) |
| batch_tracking | boolean | No | Enable batch tracking for this variation |
| note | text | No | Additional notes |

**Success Response (201):**
```json
{
  "success": true,
  "message": "Variation created successfully",
  "data": {
    "id": 3,
    "inventory_id": 1,
    "variation_type": "Color",
    "variation_value": "Blue",
    "variation_price": 2100,
    "stock_quantity": 0,
    "batch_tracking": false
  }
}
```

**Note:** When creating a variation, the parent inventory's `has_variations` flag is automatically set to `true`.

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/inventory-variations \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "inventory_id": 1,
    "variation_type": "Color",
    "variation_value": "Blue",
    "variation_price": 2100
  }'
```

---

### 3. Get Single Variation
**GET** `/inventory-variations/{id}`

Retrieves details of a specific variation.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "inventory_id": 1,
    "variation_type": "Size",
    "variation_value": "Medium",
    "variation_price": 2000,
    "stock_quantity": 100,
    "inventory": {
      "id": 1,
      "name": "T-Shirt"
    }
  }
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:8000/api/inventory-variations/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 4. Update Variation
**PUT** `/inventory-variations/{id}`

Updates an existing variation.

**Request Body:**
```json
{
  "variation_value": "Extra Large",
  "variation_price": 2400,
  "note": "Updated to XL size"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Variation updated successfully",
  "data": {
    "id": 1,
    "variation_value": "Extra Large",
    "variation_price": 2400
  }
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:8000/api/inventory-variations/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "variation_price": 2400
  }'
```

---

### 5. Delete Variation
**DELETE** `/inventory-variations/{id}`

Soft deletes a variation.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Variation deleted successfully"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:8000/api/inventory-variations/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Stock Management

### 1. Add Stock
**POST** `/inventory/{id}/stock/add`

Adds stock to an inventory item. Supports variation-level and batch-level stock addition. Automatically updates stock quantities and creates a stock record in the ledger.

**Headers:**
```
Authorization: Bearer {your_token}
Content-Type: application/json
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Inventory ID |

**Request Body:**
```json
{
  "variation_id": 1,
  "batch_id": null,
  "quantity": 100,
  "note": "Stock purchase from Supplier ABC",
  "related_invoice_id": null
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| variation_id | integer | No | Variation ID (if adding to specific variation) |
| batch_id | integer | No | Batch ID (if adding to specific batch) |
| quantity | integer | Yes | Quantity to add (must be >= 1) |
| note | text | No | Reason or note for stock addition |
| related_invoice_id | integer | No | Link to purchase invoice if applicable |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Stock added successfully",
  "data": {
    "inventory": {
      "id": 1,
      "name": "T-Shirt",
      "stock_quantity": 100
    },
    "variation": {
      "id": 1,
      "variation_value": "Medium",
      "stock_quantity": 100
    },
    "batch": null,
    "stock_record": {
      "id": 1,
      "inventory_id": 1,
      "variation_id": 1,
      "batch_id": null,
      "transaction_type": "purchase",
      "quantity": 100,
      "balance_after": 100,
      "note": "Stock purchase from Supplier ABC",
      "created_at": "2025-10-28T08:00:00.000000Z"
    },
    "old_stock": 0,
    "new_stock": 100,
    "quantity_added": 100
  }
}
```

**How It Works:**
1. Validates inventory, variation, and batch existence
2. Updates stock at all levels:
   - `inventory.stock_quantity` += quantity
   - `variation.stock_quantity` += quantity (if variation_id provided)
   - `batch.stock_quantity` += quantity (if batch_id provided)
3. Creates a stock record in `inventory_stock_records` table
4. Returns updated stock information

**Error Response (422):**
```json
{
  "success": false,
  "errors": {
    "quantity": ["The quantity must be at least 1."]
  }
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Failed to add stock",
  "error": "Variation not found"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/inventory/1/stock/add \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "variation_id": 1,
    "quantity": 100,
    "note": "Stock purchase from Supplier ABC"
  }'
```

---

### 2. Reduce Stock
**POST** `/inventory/{id}/stock/reduce`

Reduces stock from an inventory item. Supports variation-level and batch-level stock reduction. Validates stock availability before reducing.

**Headers:**
```
Authorization: Bearer {your_token}
Content-Type: application/json
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Inventory ID |

**Request Body:**
```json
{
  "variation_id": 1,
  "batch_id": null,
  "quantity": 5,
  "note": "Sale to Customer XYZ",
  "related_invoice_id": 123
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| variation_id | integer | No | Variation ID (if reducing from specific variation) |
| batch_id | integer | No | Batch ID (if reducing from specific batch) |
| quantity | integer | Yes | Quantity to reduce (must be >= 1) |
| note | text | No | Reason or note for stock reduction |
| related_invoice_id | integer | No | Link to sales invoice |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Stock reduced successfully",
  "data": {
    "inventory": {
      "id": 1,
      "name": "T-Shirt",
      "stock_quantity": 95
    },
    "variation": {
      "id": 1,
      "variation_value": "Medium",
      "stock_quantity": 95
    },
    "batch": null,
    "stock_record": {
      "id": 2,
      "inventory_id": 1,
      "variation_id": 1,
      "batch_id": null,
      "transaction_type": "sale",
      "quantity": -5,
      "balance_after": 95,
      "related_invoice_id": 123,
      "note": "Sale to Customer XYZ",
      "created_at": "2025-10-28T09:00:00.000000Z"
    },
    "old_stock": 100,
    "new_stock": 95,
    "quantity_reduced": 5
  }
}
```

**How It Works:**
1. Validates inventory, variation, and batch existence
2. **Validates stock availability** at each level:
   - Checks `inventory.stock_quantity` >= quantity
   - Checks `variation.stock_quantity` >= quantity (if variation_id provided)
   - Checks `batch.stock_quantity` >= quantity (if batch_id provided)
3. Reduces stock at all levels:
   - `inventory.stock_quantity` -= quantity
   - `variation.stock_quantity` -= quantity (if applicable)
   - `batch.stock_quantity` -= quantity (if applicable)
4. Creates a stock record with **negative quantity**
5. Returns updated stock information

**Error Response (500) - Insufficient Stock:**
```json
{
  "success": false,
  "message": "Failed to reduce stock",
  "error": "Insufficient stock. Available: 95, Requested: 100"
}
```

**Error Response (500) - Insufficient Variation Stock:**
```json
{
  "success": false,
  "message": "Failed to reduce stock",
  "error": "Insufficient variation stock. Available: 50, Requested: 60"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/inventory/1/stock/reduce \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "variation_id": 1,
    "quantity": 5,
    "related_invoice_id": 123,
    "note": "Sale to Customer XYZ"
  }'
```

---

### 3. Get Stock Balance
**GET** `/inventory/{id}/stock/balance`

Retrieves current stock balance for an inventory item. Can optionally get balance for specific variation or batch.

**Headers:**
```
Authorization: Bearer {your_token}
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Inventory ID |

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| variation_id | integer | Get stock for specific variation |
| batch_id | integer | Get stock for specific batch |

**Success Response (200) - Inventory Only:**
```json
{
  "success": true,
  "data": {
    "inventory_id": 1,
    "inventory_name": "T-Shirt",
    "inventory_stock": 150
  }
}
```

**Success Response (200) - With Variation:**
```json
{
  "success": true,
  "data": {
    "inventory_id": 1,
    "inventory_name": "T-Shirt",
    "inventory_stock": 150,
    "variation_id": 1,
    "variation_value": "Medium",
    "variation_stock": 95
  }
}
```

**Success Response (200) - With Variation and Batch:**
```json
{
  "success": true,
  "data": {
    "inventory_id": 1,
    "inventory_name": "T-Shirt",
    "inventory_stock": 150,
    "variation_id": 1,
    "variation_value": "Medium",
    "variation_stock": 95,
    "batch_id": 1,
    "batch_name": "BATCH-2025-001",
    "batch_stock": 50,
    "batch_expiry_date": "2025-12-31"
  }
}
```

**cURL Examples:**
```bash
# Get inventory stock only
curl -X GET http://localhost:8000/api/inventory/1/stock/balance \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get variation stock
curl -X GET "http://localhost:8000/api/inventory/1/stock/balance?variation_id=1" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get batch stock
curl -X GET "http://localhost:8000/api/inventory/1/stock/balance?variation_id=1&batch_id=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Data Structures

### Inventory Object
```json
{
  "id": 1,
  "name": "Product Name",
  "type": "product",
  "stock_quantity": 150,
  "default_price": 2000,
  "default_cost_price": 1200,
  "unit_id": 1,
  "category_id": 1,
  "brand_id": 1,
  "qr_code": "PRD-001",
  "has_variations": true,
  "has_batches": false,
  "note": "Product notes",
  "is_deleted": 0,
  "user_id": 1,
  "organization_id": 1,
  "created_at": "2025-10-28T08:00:00.000000Z",
  "updated_at": "2025-10-28T08:00:00.000000Z"
}
```

### Variation Object
```json
{
  "id": 1,
  "inventory_id": 1,
  "variation_type": "Size",
  "variation_value": "Medium",
  "variation_note": "Standard medium size",
  "variation_price": 2000,
  "stock_quantity": 100,
  "batch_tracking": false,
  "note": "Additional notes",
  "is_deleted": 0,
  "user_id": 1,
  "organization_id": 1,
  "created_at": "2025-10-28T08:00:00.000000Z",
  "updated_at": "2025-10-28T08:00:00.000000Z"
}
```

### Stock Record Object
```json
{
  "id": 1,
  "inventory_id": 1,
  "variation_id": 1,
  "batch_id": null,
  "transaction_type": "purchase",
  "quantity": 100,
  "balance_after": 100,
  "related_invoice_id": null,
  "note": "Stock purchase",
  "is_deleted": 0,
  "user_id": 1,
  "organization_id": 1,
  "created_at": "2025-10-28T08:00:00.000000Z",
  "updated_at": "2025-10-28T08:00:00.000000Z"
}
```

### Transaction Types
- `purchase` - Stock added via purchase
- `sale` - Stock reduced via sale
- `return` - Stock adjusted due to return
- `adjustment` - Manual stock adjustment

---

## Common Use Cases

### Use Case 1: Create Product with Variations
```bash
# Step 1: Create inventory with variations
curl -X POST http://localhost:8000/api/inventories \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium T-Shirt",
    "type": "product",
    "default_price": 2000,
    "category_id": 1,
    "has_variations": true,
    "variations": [
      {
        "variation_type": "Size",
        "variation_value": "Small",
        "variation_price": 1800
      },
      {
        "variation_type": "Size",
        "variation_value": "Medium",
        "variation_price": 2000
      },
      {
        "variation_type": "Size",
        "variation_value": "Large",
        "variation_price": 2200
      }
    ]
  }'
```

---

### Use Case 2: Purchase Stock (Add Stock)
```bash
# Add stock when purchasing from supplier
curl -X POST http://localhost:8000/api/inventory/1/stock/add \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "variation_id": 2,
    "quantity": 100,
    "note": "Purchase order #PO-2025-001 from Supplier ABC"
  }'
```

---

### Use Case 3: Sales Transaction (Reduce Stock)
```bash
# Step 1: Create sales invoice (using existing sales invoice API)
# Step 2: Reduce stock for sold items
curl -X POST http://localhost:8000/api/inventory/1/stock/reduce \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "variation_id": 2,
    "quantity": 5,
    "related_invoice_id": 123,
    "note": "Sale - Invoice #INV-2025-123"
  }'
```

---

### Use Case 4: Check Stock Before Sale
```bash
# Check available stock before creating invoice
curl -X GET "http://localhost:8000/api/inventory/1/stock/balance?variation_id=2" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Response will show current stock:
# {
#   "inventory_stock": 150,
#   "variation_stock": 95
# }
```

---

### Use Case 5: Add New Variation Later
```bash
# Add a new size variation to existing product
curl -X POST http://localhost:8000/api/inventory-variations \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "inventory_id": 1,
    "variation_type": "Size",
    "variation_value": "Extra Large",
    "variation_price": 2400,
    "stock_quantity": 0
  }'
```

---

### Use Case 6: Filter Low Stock Items
```bash
# Get all items with stock below 20
curl -X GET "http://localhost:8000/api/inventories?stock_status=low_stock&low_stock_threshold=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Use Case 7: Search Products
```bash
# Search by name or QR code
curl -X GET "http://localhost:8000/api/inventories?search=shirt" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Error Handling

All endpoints follow a consistent error response format:

### Validation Errors (422)
```json
{
  "success": false,
  "errors": {
    "field_name": ["Error message"],
    "another_field": ["Another error message"]
  }
}
```

### Not Found Errors (404)
```json
{
  "success": false,
  "message": "Inventory item not found"
}
```

### Unauthorized Access (403)
```json
{
  "success": false,
  "message": "Unauthorized access to inventory item"
}
```

### Server Errors (500)
```json
{
  "success": false,
  "message": "Failed to add stock",
  "error": "Detailed error message"
}
```

### Authentication Errors (401)
```json
{
  "message": "Unauthenticated."
}
```

---

## Important Notes

### 1. Stock Tracking Levels
The system supports 3-level stock tracking:
- **Inventory Level**: Total stock across all variations
- **Variation Level**: Stock per variation (e.g., Medium size)
- **Batch Level**: Stock per batch (e.g., specific production batch)

### 2. Stock Ledger
Every stock movement is recorded in `inventory_stock_records` table:
- `transaction_type`: purchase, sale, return, adjustment
- `quantity`: Positive for additions, negative for reductions
- `balance_after`: Stock balance after this transaction
- `related_invoice_id`: Links to sales/purchase invoices

### 3. Automatic Field Population
The following fields are automatically set and should **not** be included in requests:
- `user_id` - Set to authenticated user's ID
- `organization_id` - Set to authenticated user's organization ID
- `is_deleted` - Defaults to 0 (not deleted)
- `balance_after` - Calculated automatically in stock operations

### 4. Organization Scope
All inventory items are scoped to organizations. Users can only:
- View inventory from their own organization
- Create inventory for their own organization
- Update/Delete inventory from their own organization

### 5. Soft Delete
All delete operations are soft deletes (`is_deleted = 1`). Data is never permanently removed, allowing for:
- Historical tracking
- Data recovery if needed
- Audit trails

### 6. Stock Validation
When reducing stock, the system validates availability at each level:
- Inventory level must have sufficient stock
- Variation level must have sufficient stock (if variation_id provided)
- Batch level must have sufficient stock (if batch_id provided)

**Example Error Flow:**
```
Inventory stock: 100
Variation stock: 50
Requested: 60

❌ Error: "Insufficient variation stock. Available: 50, Requested: 60"
```

### 7. Transaction Safety
All stock operations use database transactions:
- If any part fails, all changes are rolled back
- Ensures data consistency across inventory, variations, batches, and stock records
- Prevents partial updates

### 8. Variation Pricing
- Each variation can have its own price (`variation_price`)
- If not specified, falls back to inventory's `default_price`
- Allows flexible pricing per size/color/variant

### 9. Batch Tracking
- Enable `batch_tracking` on variations to track batches
- Useful for products with expiry dates
- Each batch can have its own `expiry_date`

---

## Testing Workflow

### Complete Inventory Management Flow

#### 1. Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"niraj@azure.com.np","password":"password"}'
```

#### 2. Create Inventory with Variations
```bash
curl -X POST http://localhost:8000/api/inventories \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium T-Shirt",
    "type": "product",
    "default_price": 2000,
    "has_variations": true,
    "variations": [
      {"variation_type": "Size", "variation_value": "Small", "variation_price": 1800},
      {"variation_type": "Size", "variation_value": "Medium", "variation_price": 2000},
      {"variation_type": "Size", "variation_value": "Large", "variation_price": 2200}
    ]
  }'
```

#### 3. Add Stock (Purchase from Supplier)
```bash
curl -X POST http://localhost:8000/api/inventory/1/stock/add \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "variation_id": 2,
    "quantity": 100,
    "note": "Initial stock purchase"
  }'
```

#### 4. Check Stock Balance
```bash
curl -X GET "http://localhost:8000/api/inventory/1/stock/balance?variation_id=2" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### 5. Reduce Stock (Sale)
```bash
curl -X POST http://localhost:8000/api/inventory/1/stock/reduce \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "variation_id": 2,
    "quantity": 5,
    "note": "Sale to customer"
  }'
```

#### 6. View Inventory Details
```bash
curl -X GET http://localhost:8000/api/inventories/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### 7. List All Inventories
```bash
curl -X GET "http://localhost:8000/api/inventories?has_variations=true" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Integration with Sales Invoice

When creating a sales invoice with inventory items:

### Step 1: Validate Stock Availability
```bash
curl -X GET "http://localhost:8000/api/inventory/1/stock/balance?variation_id=2" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Step 2: Create Sales Invoice
```bash
curl -X POST http://localhost:8000/api/sales-invoices \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "invoice_no": "INV-2025-001",
    "customer_id": 1,
    "invoice_items": [
      {
        "inventory_id": 1,
        "item": "Premium T-Shirt - Medium",
        "quantity": 5,
        "rate": 2000,
        "total": 10000
      }
    ]
  }'
```

### Step 3: Reduce Stock
```bash
curl -X POST http://localhost:8000/api/inventory/1/stock/reduce \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "variation_id": 2,
    "quantity": 5,
    "related_invoice_id": 1,
    "note": "Sale - Invoice #INV-2025-001"
  }'
```

This creates an audit trail linking the stock movement to the sales invoice.

---

## Best Practices

1. **Always Check Stock Before Sale**
   - Use the balance endpoint before creating invoices
   - Prevents overselling

2. **Link Stock Movements to Invoices**
   - Use `related_invoice_id` when reducing stock for sales
   - Creates proper audit trail

3. **Use Variations for Product Variants**
   - Size, color, style, etc.
   - Each can have different prices and stock levels

4. **Monitor Low Stock**
   - Regularly check items with `stock_status=low_stock`
   - Set up reorder points

5. **Use Transactions**
   - The system uses database transactions automatically
   - Ensures data consistency

6. **Document Stock Movements**
   - Always include descriptive notes
   - Helps with inventory audits

7. **Organize with Categories and Brands**
   - Makes filtering and reporting easier
   - Better inventory organization

8. **Use QR Codes**
   - Assign unique QR codes to products
   - Enables quick lookup and barcode scanning

---

## Summary

The Inventory Management API provides:
- ✅ Full CRUD operations for inventory items
- ✅ Variation management with flexible pricing
- ✅ 3-level stock tracking (inventory → variation → batch)
- ✅ Real-time stock updates with validation
- ✅ Complete stock ledger with transaction history
- ✅ Organization-based data isolation
- ✅ Soft delete for all operations
- ✅ Integration-ready for sales invoices
- ✅ Comprehensive filtering and search
- ✅ Transaction safety with automatic rollback

For questions or issues, contact your system administrator.
