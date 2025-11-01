# Invoicer API Documentation Index

## Overview
This directory contains comprehensive API documentation for the Invoicer backend system, covering all modules including Sales, Purchases, Inventory, Customers, and Suppliers.

---

## Sales Module

### [Order API](./ORDER_API.md)
Complete documentation for managing customer orders:
- List orders with filtering and search
- Update order status (pending, confirmed, processing, shipped, delivered, cancelled)
- Update payment status (unpaid, paid, refunded)
- Order statistics and analytics
- Customer information management
- Organization-level data isolation

### [Customer API](./CUSTOMER_API.md)
Complete documentation for managing customers including:
- CRUD operations for customers
- Customer statistics and financial summaries
- Sales invoice and payment receipt relationships
- Organization-level filtering and search

### [Sales Invoice API](./SALES_INVOICE_API.md)
Documentation for sales invoice management:
- Creating invoices with multiple items
- Managing invoice status and payment tracking
- Discount, tax, and shipping calculations
- Automatic payment receipt creation

### [Payment Receipt API](./PAYMENT_RECEIPT_API.md)
Documentation for tracking customer payments:
- Recording payments against sales invoices
- Multiple payment methods support
- Automatic invoice payment status updates
- Soft delete for audit trails

---

## Purchase Module

### [Supplier API](./SUPPLIER_API.md)
Complete documentation for managing suppliers:
- CRUD operations for suppliers
- Supplier statistics and financial summaries
- Purchase invoice and payment receipt relationships
- Organization-level filtering and search

### [Purchase Invoice API](./PURCHASE_INVOICE_API.md)
Documentation for purchase invoice management:
- Creating invoices from suppliers with multiple items
- Managing invoice status and payment tracking
- Discount, tax, and shipping calculations
- Automatic payment receipt creation

### [Purchase Payment Receipt API](./PURCHASE_PAYMENT_RECEIPT_API.md)
Documentation for tracking supplier payments:
- Recording payments to suppliers
- Multiple payment methods support
- Automatic invoice payment status updates
- Soft delete for audit trails

### [Purchase System Overview](./PURCHASE_SYSTEM_README.md)
Comprehensive overview of the entire purchase system:
- System architecture and design
- Database schema and relationships
- Workflow examples
- Advanced features and best practices

---

## Inventory Module

### [Inventory API](./INVENTORY_API.md)
Complete documentation for inventory management:
- Product/service catalog management
- Inventory variations and SKUs
- Stock management (add/reduce/balance)
- Organization-level data isolation

---

## Ecommerce Module

### [Shop Customization API](./SHOP_CUSTOMIZATION_API.md)
Complete documentation for shop customization:
- Branding and appearance settings
- Logo and cover image management
- Social media integration
- Slider images configuration
- Theme color customization
- Shipping charge settings
- Organization-specific storefronts

---

## Quick Reference

### Base URLs
```
Orders:                   /api/orders
Customers:                /api/customers
Suppliers:                /api/suppliers
Sales Invoices:           /api/sales-invoices
Purchase Invoices:        /api/purchase-invoices
Payment Receipts:         /api/payment-receipts
Purchase Payment Receipts:/api/purchase-payment-receipts
Inventories:              /api/inventories
Shop Customization:       /api/shop-customization
```

### Authentication
All API endpoints (except auth) require JWT authentication:
```
Authorization: Bearer {your_token}
```

### Common Response Format
All endpoints follow a consistent response structure:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": { ... }
}
```

### Pagination
List endpoints return paginated results:
```json
{
  "current_page": 1,
  "data": [...],
  "per_page": 10,
  "total": 50,
  "last_page": 5
}
```

---

## Key Features Across All Modules

### 1. Organization-Level Data Isolation
- All data is automatically scoped to the authenticated user's organization
- Users can only view and manage data from their own organization
- Organization ID is automatically assigned on record creation

### 2. Transaction Safety
- All create, update, and delete operations use database transactions
- Automatic rollback on errors ensures data consistency
- No partial updates or orphaned records

### 3. Soft Delete (Where Applicable)
- Payment receipts use soft delete for audit trails
- Deleted records excluded from queries but preserved in database
- Enables historical reporting and recovery

### 4. Automatic Status Management
- Invoice payment status automatically calculated based on payment receipts
- Status updates on payment creation, update, or deletion
- Supports paid, unpaid, and partial payment statuses

### 5. Comprehensive Filtering & Search
- Query parameters for filtering by various criteria
- Full-text search across relevant fields
- Pagination for large datasets

### 6. Rich Relationships
- Eager loading of related data
- Comprehensive relationship mapping
- Nested data in responses for convenience

---

## Module Comparison

| Feature | Sales System | Purchase System |
|---------|--------------|-----------------|
| **Main Entity** | Customer | Supplier |
| **Invoice Type** | Sales Invoice | Purchase Invoice |
| **Invoice Items** | Sales Invoice Items | Purchase Invoice Items |
| **Payments** | Payment Receipts | Purchase Payment Receipts |
| **Purpose** | Revenue tracking | Expense tracking |
| **Payment Direction** | Money in | Money out |

Both systems share identical architecture, naming conventions, and functionality for consistency.

---

## Getting Started

1. **Authenticate**: Get JWT token via `/api/auth/login`
2. **Choose Module**: Select the module you want to work with
3. **Read Documentation**: Refer to the specific API documentation
4. **Make Requests**: Use the provided cURL examples or API clients
5. **Handle Responses**: Process responses according to the standard format

---

## Documentation Files

| File | Description | Size |
|------|-------------|------|
| ORDER_API.md | Order management API | 16KB |
| ORDER_SYSTEM_README.md | Order system overview | 9KB |
| CUSTOMER_API.md | Customer management API | 20KB |
| SUPPLIER_API.md | Supplier management API | 3.1KB |
| SALES_INVOICE_API.md | Sales invoice management | 14KB |
| PURCHASE_INVOICE_API.md | Purchase invoice management | 12KB |
| PAYMENT_RECEIPT_API.md | Customer payment tracking | 18KB |
| PURCHASE_PAYMENT_RECEIPT_API.md | Supplier payment tracking | 12KB |
| PURCHASE_SYSTEM_README.md | Purchase system overview | 11KB |
| INVENTORY_API.md | Inventory and stock management | 34KB |
| SHOP_CUSTOMIZATION_API.md | Shop customization and branding | 20KB |
| INDEX.md | This file | - |

---

## Support

For questions, issues, or feature requests:
- Review the relevant API documentation
- Check model files for relationship details
- Examine controller files for business logic
- Refer to migration files for database schema

---

**Last Updated**: October 30, 2025  
**API Version**: 1.0.0  
**Documentation Version**: 1.0.0
