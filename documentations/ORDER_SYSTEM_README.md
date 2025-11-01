# Order Management System

## Overview
Complete ecommerce order management system with customer-facing subdomain interface and robust API for order processing and management.

## System Components

### 1. Customer-Facing Frontend (Subdomain-based)
- **Ecommerce Storefront**: Browse products by category/brand
- **Shopping Cart**: Session-based cart with AJAX operations
- **Checkout**: Customer information collection with optional billing address
- **Order Confirmation**: Complete order details with print functionality

### 2. Backend API
- **Order Listing**: Advanced filtering, search, and pagination
- **Status Management**: Update order and payment statuses
- **Statistics**: Analytics and reporting
- **CRUD Operations**: Full order lifecycle management

## Database Schema

### Orders Table
```
- id (primary key)
- order_number (unique, auto-generated)
- organization_id (foreign key to organizations)
- customer_name (required)
- customer_phone (required)
- customer_address (required)
- customer_email (optional)
- billing_address (optional)
- billing_name (optional)
- billing_phone (optional)
- total_amount (in cents)
- total_items
- note (optional)
- status (enum: pending, confirmed, processing, shipped, delivered, cancelled)
- payment_status (enum: unpaid, paid, refunded)
- payment_method
- confirmed_at (auto-set when status = confirmed)
- delivered_at (auto-set when status = delivered)
- created_at
- updated_at
```

### Order Items Table
```
- id (primary key)
- order_id (foreign key to orders)
- inventory_id (foreign key to inventories)
- product_name (snapshot)
- product_price (snapshot, in cents)
- quantity
- subtotal (in cents)
- product_sku (optional)
- variation_id (optional, foreign key to inventory_variations)
- created_at
- updated_at
```

## Features

### Customer Features (Subdomain Frontend)
1. **Product Browsing**
   - Filter by category and brand
   - Search functionality
   - Product detail views

2. **Shopping Cart**
   - Add/remove items
   - Update quantities
   - Real-time total calculations
   - Session persistence

3. **Checkout Process**
   - Customer information form
   - Optional billing address (checkbox toggle)
   - Payment method selection
   - Order notes

4. **Order Confirmation**
   - Unique order number
   - Complete order summary
   - Customer details
   - Print functionality

### Admin Features (API)
1. **Order Management**
   - List all orders
   - Filter by status, payment status, date range
   - Search by order number, customer name/phone
   - Sort and paginate results

2. **Status Updates**
   - Update order status
   - Update payment status
   - Automatic timestamp tracking

3. **Analytics**
   - Total orders and revenue
   - Breakdown by status
   - Payment statistics
   - Custom date ranges

4. **Customer Management**
   - Update customer information
   - Update delivery/billing addresses
   - Add/update order notes

## API Endpoints

### Order Management
```
GET    /api/orders                      - List orders with filters
GET    /api/orders/{id}                - Get order details
GET    /api/orders/statistics          - Get order statistics
PUT    /api/orders/{id}                - Update order information
PUT    /api/orders/{id}/status         - Update order status
PUT    /api/orders/{id}/payment-status - Update payment status
DELETE /api/orders/{id}                - Delete order (pending/cancelled only)
```

### Frontend Routes
```
GET  /{subdomain}/                        - Homepage
GET  /{subdomain}/products                - Product listing
GET  /{subdomain}/product/{id}            - Product details
GET  /{subdomain}/cart                    - View cart
POST /{subdomain}/cart/add                - Add to cart
POST /{subdomain}/cart/update             - Update cart
POST /{subdomain}/cart/remove             - Remove from cart
GET  /{subdomain}/checkout                - Checkout page
POST /{subdomain}/place-order             - Place order
GET  /{subdomain}/order-confirmation/{id} - Order confirmation
```

## Order Status Workflow

### Order Status Flow
```
pending → confirmed → processing → shipped → delivered
   ↓
cancelled (can happen at any stage)
```

### Payment Status Flow
```
unpaid → paid
   ↓
refunded (from paid state)
```

## Data Handling

### Price Storage
All monetary values are stored in **cents** (integer):
- ₹59.99 = 5999 cents
- Display: divide by 100

### Order Number Generation
- Format: `ORD-{UNIQUE_ID}`
- Example: `ORD-6721A5B34F7D8`
- Automatically generated on order creation
- Unique constraint enforced

### Product Snapshots
Order items store product information at time of order:
- Product name, price, SKU
- Ensures historical accuracy
- Independent of future product changes

## Security & Data Isolation

### Organization-Level Isolation
- All orders belong to an organization
- Customers can only see their organization's products
- API filters by organization automatically

### Session-Based Cart
- No user authentication required for shopping
- Cart persists in session
- Cleared after successful order

### Validation
- Required fields enforced
- Email validation (when provided)
- Payment status and order status validation
- Only pending/cancelled orders can be deleted

## Integration Examples

### 1. Place an Order (Customer Flow)
```
1. Browse products → Add to cart
2. View cart → Adjust quantities
3. Proceed to checkout
4. Fill customer information
5. Optionally add billing address
6. Select payment method
7. Place order
8. View confirmation
```

### 2. Process Order (Admin via API)
```
1. List pending orders: GET /api/orders?status=pending
2. View order details: GET /api/orders/123
3. Confirm order: PUT /api/orders/123/status (status: confirmed)
4. Mark as processing: PUT /api/orders/123/status (status: processing)
5. Update to shipped: PUT /api/orders/123/status (status: shipped)
6. Mark payment as paid: PUT /api/orders/123/payment-status (payment_status: paid)
7. Mark as delivered: PUT /api/orders/123/status (status: delivered)
```

### 3. Get Statistics
```
GET /api/orders/statistics?organization_id=1&start_date=2025-10-01&end_date=2025-10-31

Response:
- Total orders: 145
- Total revenue: ₹87,500.00
- By status breakdown
- By payment status breakdown
- Revenue by payment status
```

## Best Practices

### For Frontend Development
1. Always validate cart before checkout
2. Handle AJAX errors gracefully
3. Show loading states during operations
4. Update cart badge in real-time
5. Clear cart after successful order

### For API Integration
1. Filter by organization_id for multi-tenant systems
2. Use pagination for large datasets
3. Implement proper error handling
4. Cache statistics when possible
5. Use date ranges for performance

### For Order Management
1. Confirm orders before processing
2. Update payment status independently
3. Add notes for special instructions
4. Only delete pending/cancelled orders
5. Track timestamps for audit trail

## Testing Checklist

### Frontend Testing
- [ ] Add products to cart
- [ ] Update cart quantities
- [ ] Remove items from cart
- [ ] Proceed to checkout with empty cart (should fail)
- [ ] Submit order without required fields (should fail)
- [ ] Submit valid order
- [ ] View order confirmation
- [ ] Print order

### API Testing
- [ ] List orders with different filters
- [ ] Get single order details
- [ ] Update order status
- [ ] Update payment status
- [ ] Update customer information
- [ ] Delete pending order
- [ ] Try to delete confirmed order (should fail)
- [ ] Get statistics

## Troubleshooting

### Cart Issues
- **Cart not persisting**: Check session configuration
- **Items disappearing**: Verify session lifetime
- **Quantity not updating**: Check AJAX endpoint and CSRF token

### Order Issues
- **Order not creating**: Validate all required fields
- **Items missing**: Check cart data before order creation
- **Wrong total**: Verify price calculations (cents vs dollars)

### API Issues
- **No orders returned**: Check organization_id filter
- **Status update fails**: Verify allowed status values
- **Can't delete order**: Only pending/cancelled orders can be deleted

## Performance Optimization

### Database Queries
- Use eager loading for relationships
- Index frequently filtered columns (status, organization_id)
- Paginate large result sets
- Cache statistics queries

### Frontend Performance
- Minimize AJAX requests
- Debounce cart updates
- Use local storage for cart backup
- Optimize images

## Future Enhancements

### Potential Features
- Email notifications on order status change
- SMS notifications
- Order tracking page
- Customer accounts and order history
- Wishlist functionality
- Multiple shipping addresses
- Discount codes/coupons
- Inventory stock reduction on order
- Automatic invoice generation
- Payment gateway integration

---

**System Version**: 1.0.0  
**Last Updated**: October 30, 2025  
**Documentation**: See ORDER_API.md for complete API reference
