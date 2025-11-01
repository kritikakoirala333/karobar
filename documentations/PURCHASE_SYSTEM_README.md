# Purchase Invoice System Documentation

## Overview

The Purchase Invoice System is a complete invoicing and payment tracking solution for managing purchases from suppliers. It mirrors the Sales Invoice System architecture and provides full CRUD operations for suppliers, purchase invoices, and payment receipts.

## System Architecture

```
┌─────────────┐
│  Suppliers  │
└──────┬──────┘
       │
       │ has many
       ▼
┌──────────────────┐
│ Purchase Invoices│◄──┐
└──────┬───────────┘   │
       │               │
       │ has many      │ belongs to
       ▼               │
┌──────────────────────┐
│Purchase Invoice Items│
└──────────────────────┘

┌──────────────────────────┐
│Purchase Payment Receipts │───┐
└──────────────────────────┘   │
       │                       │
       │ belongs to            │ belongs to
       └───────────────────────┘
```

## Key Features

### 1. **Supplier Management**
- Full CRUD operations for suppliers
- Support for both individual and company suppliers
- Comprehensive statistics (total invoices, payments, outstanding amounts)
- Organization-level isolation
- Search across name, email, and phone

### 2. **Purchase Invoice Management**
- Create invoices with multiple line items
- Support for discounts (percentage or fixed)
- Support for shipping costs
- Support for taxes (percentage or fixed)
- Transaction-safe operations
- Automatic payment receipt creation on invoice creation
- Organization-level data isolation

### 3. **Purchase Payment Receipt Management**
- Track payments to suppliers
- Multiple payment methods (cash, check, bank transfer, credit card, etc.)
- Soft delete for audit trails
- Automatic invoice payment status updates
- Smart recalculation on amount or invoice changes

### 4. **Automatic Payment Status Tracking**
The system automatically calculates and updates invoice payment status:
- **Paid**: Total paid amount >= Invoice grand total
- **Partial**: Total paid amount > 0 but < Invoice grand total
- **Unpaid**: Total paid amount = 0

### 5. **Security & Data Isolation**
- JWT authentication on all endpoints
- Organization-level data isolation
- Automatic user and organization assignment
- Only view/manage data from your own organization

## Database Schema

### Suppliers Table
```sql
- id (primary key)
- name (required)
- email
- phone
- country
- address
- pan_vat
- type (person/company)
- note
- organization_id
- created_by_user
- timestamps
```

### Purchase Invoices Table
```sql
- id (primary key)
- invoice_no (required)
- supplier_id
- user_id
- organization_id
- date
- subtotal
- discount
- shipping
- tax
- tax_type (percentage/fixed)
- discount_type (percentage/fixed)
- grand_total
- status
- payment_status
- note
- timestamps
```

### Purchase Invoice Items Table
```sql
- id (primary key)
- purchase_invoice_id (foreign key)
- user_id
- organization_id
- item
- quantity
- rate
- total
- discount
- unit
- inventory_id
- service_id
- note
- timestamps
```

### Purchase Payment Receipts Table
```sql
- id (primary key)
- receipt_no (required)
- amount (required)
- title
- purchase_invoice_id
- supplier_id (required)
- user_id
- organization_id
- date
- note
- payment_method
- is_deleted (soft delete flag)
- timestamps
```

## API Endpoints

### Suppliers
```
GET    /api/suppliers              - List all suppliers
GET    /api/suppliers/{id}         - Get supplier details with statistics
POST   /api/suppliers              - Create new supplier
PUT    /api/suppliers/{id}         - Update supplier
DELETE /api/suppliers/{id}         - Delete supplier
```

### Purchase Invoices
```
GET    /api/purchase-invoices           - List all purchase invoices
GET    /api/purchase-invoices/{id}      - Get invoice details
POST   /api/purchase-invoices           - Create new invoice
PUT    /api/purchase-invoices/{id}      - Update invoice
DELETE /api/purchase-invoices/{id}      - Delete invoice
```

### Purchase Payment Receipts
```
GET    /api/purchase-payment-receipts           - List all payment receipts
GET    /api/purchase-payment-receipts/{id}      - Get receipt details
POST   /api/purchase-payment-receipts           - Create new receipt
PUT    /api/purchase-payment-receipts/{id}      - Update receipt
DELETE /api/purchase-payment-receipts/{id}      - Delete receipt (soft delete)
```

## Models & Relationships

### Supplier Model
**Location**: `app/Models/Supplier.php`

**Relationships**:
- `belongsTo` Organization
- `belongsTo` User (creator)
- `hasMany` PurchaseInvoice
- `hasMany` PurchasePaymentReceipt

### PurchaseInvoice Model
**Location**: `app/Models/PurchaseInvoice.php`

**Relationships**:
- `belongsTo` Supplier
- `belongsTo` User
- `belongsTo` Organization
- `hasMany` PurchaseInvoiceItem

### PurchaseInvoiceItem Model
**Location**: `app/Models/PurchaseInvoiceItem.php`

**Relationships**:
- `belongsTo` PurchaseInvoice
- `belongsTo` User
- `belongsTo` Organization

### PurchasePaymentReceipt Model
**Location**: `app/Models/PurchasePaymentReceipt.php`

**Relationships**:
- `belongsTo` Supplier
- `belongsTo` PurchaseInvoice
- `belongsTo` User
- `belongsTo` Organization

## Controllers

### SupplierController
**Location**: `app/Http/Controllers/SupplierController.php`

**Methods**:
- `index()` - List suppliers with filtering and pagination
- `store()` - Create new supplier
- `show()` - Get supplier with complete details and statistics
- `update()` - Update supplier information
- `destroy()` - Delete supplier

### PurchaseInvoiceController
**Location**: `app/Http/Controllers/PurchaseInvoiceController.php`

**Methods**:
- `index()` - List purchase invoices with filtering
- `store()` - Create invoice with items and optional payment
- `show()` - Get invoice with all items
- `update()` - Update invoice and replace items
- `destroy()` - Delete invoice and all items

### PurchasePaymentReceiptController
**Location**: `app/Http/Controllers/PurchasePaymentReceiptController.php`

**Methods**:
- `index()` - List payment receipts with filtering
- `store()` - Create receipt and update invoice status
- `show()` - Get receipt details
- `update()` - Update receipt and recalculate invoice status
- `destroy()` - Soft delete receipt and recalculate invoice status

## Workflow Examples

### Creating a Complete Purchase Flow

**Step 1: Create a Supplier**
```bash
POST /api/suppliers
{
  "name": "ABC Suppliers Ltd",
  "email": "contact@abcsuppliers.com",
  "type": "company"
}
```

**Step 2: Create Purchase Invoice with Payment**
```bash
POST /api/purchase-invoices
{
  "invoice_no": "PI-2025-001",
  "supplier_id": 1,
  "grand_total": 10000,
  "paid_amount": 3000,
  "invoice_items": [
    {
      "item": "Laptops",
      "quantity": 10,
      "rate": 1000,
      "total": 10000
    }
  ]
}
```
*This automatically creates a payment receipt for $3,000 and sets invoice status to "partial"*

**Step 3: Record Additional Payment**
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
*This automatically updates the invoice status to "paid"*

**Step 4: View Supplier Summary**
```bash
GET /api/suppliers/1
```
*Returns complete supplier information with all invoices, payments, and financial statistics*

## Advanced Features

### Transaction Safety
All create, update, and delete operations use database transactions to ensure data consistency. If any part of an operation fails, all changes are automatically rolled back.

### Smart Payment Status Management
The system intelligently manages payment status across operations:
- Creating a payment receipt updates the linked invoice
- Updating a payment amount recalculates status
- Changing the linked invoice updates both old and new invoices
- Deleting a receipt recalculates the invoice status

### Soft Delete for Audit Trails
Payment receipts use soft delete (`is_deleted = 1`) instead of permanent deletion:
- Preserves historical data
- Enables audit trails
- Allows potential recovery
- Excluded from active queries

### Organization Data Isolation
All operations automatically filter by the authenticated user's organization:
- Users only see data from their organization
- Cannot access or modify other organizations' data
- Organization ID automatically assigned on creation

## Filter & Search Capabilities

### Supplier Filters
- `organization_id` - Filter by organization
- `type` - Filter by supplier type (person/company)
- `search` - Search name, email, phone

### Purchase Invoice Filters
- `supplier_id` - Filter by supplier
- `status` - Filter by invoice status
- `payment_status` - Filter by payment status
- `search` - Search by invoice number

### Payment Receipt Filters
- `supplier_id` - Filter by supplier
- `purchase_invoice_id` - Filter by invoice
- `payment_method` - Filter by payment method
- `search` - Search by receipt number

## Files Created

### Migrations
- `2025_10_30_133517_create_suppliers_table.php`
- `2025_10_30_133628_create_purchase_invoices_table.php`
- `2025_10_30_133738_create_purchase_invoice_items_table.php`
- `2025_10_30_133816_create_purchase_payment_receipts_table.php`

### Models
- `app/Models/Supplier.php`
- `app/Models/PurchaseInvoice.php`
- `app/Models/PurchaseInvoiceItem.php`
- `app/Models/PurchasePaymentReceipt.php`

### Controllers
- `app/Http/Controllers/SupplierController.php`
- `app/Http/Controllers/PurchaseInvoiceController.php`
- `app/Http/Controllers/PurchasePaymentReceiptController.php`

### Routes
- Updated `routes/api.php` with all purchase system endpoints

### Documentation
- `documentations/SUPPLIER_API.md`
- `documentations/PURCHASE_INVOICE_API.md`
- `documentations/PURCHASE_PAYMENT_RECEIPT_API.md`
- `documentations/PURCHASE_SYSTEM_README.md`

## Testing

All endpoints can be tested using the provided cURL examples in each API documentation file, or using tools like Postman or Insomnia.

### Example Test Flow
1. Authenticate to get JWT token
2. Create a supplier
3. Create a purchase invoice with items
4. Record payment receipts
5. View supplier statistics
6. Update invoice or payments
7. Verify automatic status updates

## Comparison with Sales System

| Feature | Sales System | Purchase System |
|---------|--------------|-----------------|
| Main Entity | Customer | Supplier |
| Invoice Type | Sales Invoice | Purchase Invoice |
| Invoice Items | Sales Invoice Items | Purchase Invoice Items |
| Payment Receipts | Payment Receipts | Purchase Payment Receipts |
| Purpose | Track sales to customers | Track purchases from suppliers |

The Purchase System uses identical architecture, naming conventions, and functionality as the Sales System for consistency and ease of use.

## Support & Maintenance

For issues, questions, or feature requests related to the Purchase Invoice System, please refer to:
- API documentation files in the `documentations/` folder
- Model files for relationship details
- Controller files for business logic
- Migration files for database schema

---

**Version**: 1.0.0  
**Created**: October 30, 2025  
**Last Updated**: October 30, 2025
