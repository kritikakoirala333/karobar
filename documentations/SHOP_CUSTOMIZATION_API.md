# Shop Customization API Documentation

## Overview
Complete API for managing shop customization settings for subdomain-based ecommerce stores. Each organization can customize their storefront appearance, branding, social media links, and slider images.

---

## Base URL
```
/api/shop-customization
```

---

## Authentication
All endpoints require API authentication via JWT token or API middleware.

```
Authorization: Bearer {your_token}
```

---

## Endpoints

### 1. Get Shop Customization

Retrieve shop customization settings for a specific organization.

**Endpoint:** `GET /api/shop-customization`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| organization_id | integer | Yes | ID of the organization |

**Example Request:**
```bash
curl -X GET "http://invoicer-backend.test/api/shop-customization?organization_id=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "organization_id": 1,
    "shop_name": "TechStore Pro",
    "logo": "shop/logos/aBcDeF123.jpg",
    "address": "123 Main Street, City, State 12345",
    "phone": "+1234567890",
    "landline": "+1987654321",
    "cover": "shop/covers/XyZ789.jpg",
    "tagline": "Your Trusted Tech Partner",
    "theme_colour": "blue",
    "facebook_page": "https://facebook.com/techstore",
    "insta_page": "https://instagram.com/techstore",
    "tiktok": "https://tiktok.com/@techstore",
    "shipping_charge": 500,
    "slider_img_1": "shop/sliders/slider1.jpg",
    "slider_img_1_title": "Summer Sale",
    "slider_img_1_url": "https://example.com/summer-sale",
    "slider_img_2": "shop/sliders/slider2.jpg",
    "slider_img_2_title": "New Arrivals",
    "slider_img_2_url": "https://example.com/new-arrivals",
    "created_at": "2025-10-30T18:30:00.000000Z",
    "updated_at": "2025-10-30T18:30:00.000000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Shop customization not found for this organization"
}
```

**Error Response (422):**
```json
{
  "success": false,
  "message": "organization_id is required"
}
```

---

### 2. Create or Update Shop Customization

Create new or update existing shop customization settings.

**Endpoint:** `POST /api/shop-customization`

**Content-Type:** `multipart/form-data` (for file uploads)

**Request Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| organization_id | integer | Yes | ID of the organization |
| shop_name | string | Yes | Name of the shop (max 255) |
| logo | file | No | Logo image (jpg, png, gif, svg, max 2MB) |
| address | text | No | Shop address |
| phone | string | No | Contact phone (max 20) |
| landline | string | No | Landline number (max 20) |
| cover | file | No | Cover/banner image (jpg, png, gif, svg, max 2MB) |
| tagline | string | No | Shop tagline (max 255) |
| theme_colour | string | No | Theme color (default: blue, max 50) |
| facebook_page | url | No | Facebook page URL |
| insta_page | url | No | Instagram page URL |
| tiktok | url | No | TikTok profile URL |
| shipping_charge | integer | No | Shipping charge in cents |
| slider_img_1 | file | No | First slider image (jpg, png, gif, svg, max 2MB) |
| slider_img_1_title | string | No | First slider title (max 255) |
| slider_img_1_url | url | No | First slider link URL |
| slider_img_2 | file | No | Second slider image (jpg, png, gif, svg, max 2MB) |
| slider_img_2_title | string | No | Second slider title (max 255) |
| slider_img_2_url | url | No | Second slider link URL |

**Example Request:**
```bash
curl -X POST "http://invoicer-backend.test/api/shop-customization" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "organization_id=1" \
  -F "shop_name=TechStore Pro" \
  -F "logo=@/path/to/logo.jpg" \
  -F "address=123 Main Street, City, State 12345" \
  -F "phone=+1234567890" \
  -F "tagline=Your Trusted Tech Partner" \
  -F "theme_colour=blue" \
  -F "facebook_page=https://facebook.com/techstore" \
  -F "shipping_charge=500"
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Shop customization saved successfully",
  "data": {
    "id": 1,
    "organization_id": 1,
    "shop_name": "TechStore Pro",
    "logo": "shop/logos/aBcDeF123.jpg",
    "address": "123 Main Street, City, State 12345",
    "phone": "+1234567890",
    "theme_colour": "blue",
    "shipping_charge": 500,
    "created_at": "2025-10-30T18:30:00.000000Z",
    "updated_at": "2025-10-30T18:30:00.000000Z"
  }
}
```

**Validation Error Response (422):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "shop_name": ["The shop name field is required."],
    "logo": ["The logo must be an image.", "The logo must not be greater than 2048 kilobytes."],
    "facebook_page": ["The facebook page must be a valid URL."]
  }
}
```

---

### 3. Update Shop Customization

Update existing shop customization settings by ID.

**Endpoint:** `PUT /api/shop-customization/{id}`

**Content-Type:** `multipart/form-data` (for file uploads)

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | Shop customization ID |

**Request Parameters:** Same as Create endpoint (except organization_id cannot be changed)

**Note:** When uploading new images, old images are automatically deleted from storage.

**Example Request:**
```bash
curl -X PUT "http://invoicer-backend.test/api/shop-customization/1" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "shop_name=TechStore Pro Updated" \
  -F "tagline=New and Improved!" \
  -F "theme_colour=green" \
  -F "shipping_charge=750"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Shop customization updated successfully",
  "data": {
    "id": 1,
    "organization_id": 1,
    "shop_name": "TechStore Pro Updated",
    "tagline": "New and Improved!",
    "theme_colour": "green",
    "shipping_charge": 750,
    "updated_at": "2025-10-30T19:00:00.000000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Shop customization not found"
}
```

---

### 4. Delete Shop Customization

Delete shop customization and all associated uploaded images.

**Endpoint:** `DELETE /api/shop-customization/{id}`

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | Shop customization ID |

**Example Request:**
```bash
curl -X DELETE "http://invoicer-backend.test/api/shop-customization/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Shop customization deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Shop customization not found"
}
```

---

### 5. Delete Specific Image

Delete a specific image from shop customization without removing other data.

**Endpoint:** `DELETE /api/shop-customization/{id}/image/{imageField}`

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | Shop customization ID |
| imageField | string | Yes | Image field name: `logo`, `cover`, `slider_img_1`, or `slider_img_2` |

**Example Request:**
```bash
curl -X DELETE "http://invoicer-backend.test/api/shop-customization/1/image/logo" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Image deleted successfully",
  "data": {
    "id": 1,
    "organization_id": 1,
    "shop_name": "TechStore Pro",
    "logo": null,
    "updated_at": "2025-10-30T19:15:00.000000Z"
  }
}
```

**Error Response (422):**
```json
{
  "success": false,
  "message": "Invalid image field"
}
```

---

## Data Models

### ShopCustomization Schema

```php
{
  "id": "integer (primary key)",
  "organization_id": "integer (foreign key, unique)",
  "shop_name": "string (required)",
  "logo": "string (nullable, file path)",
  "address": "text (nullable)",
  "phone": "string (nullable)",
  "landline": "string (nullable)",
  "cover": "string (nullable, file path)",
  "tagline": "string (nullable)",
  "theme_colour": "string (default: blue)",
  "facebook_page": "string (nullable, URL)",
  "insta_page": "string (nullable, URL)",
  "tiktok": "string (nullable, URL)",
  "shipping_charge": "integer (nullable, in cents)",
  "slider_img_1": "string (nullable, file path)",
  "slider_img_1_title": "string (nullable)",
  "slider_img_1_url": "string (nullable, URL)",
  "slider_img_2": "string (nullable, file path)",
  "slider_img_2_title": "string (nullable)",
  "slider_img_2_url": "string (nullable, URL)",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

---

## Business Rules

1. **One Customization Per Organization**
   - Each organization can have only ONE customization record
   - Creating/updating is done via `updateOrCreate` method
   - `organization_id` has unique constraint in database

2. **File Storage**
   - All images stored in `storage/app/public/shop/` directory
   - Logos: `shop/logos/`
   - Covers: `shop/covers/`
   - Sliders: `shop/sliders/`
   - Old images automatically deleted on update/delete

3. **Image Validation**
   - Allowed formats: jpg, jpeg, png, gif, svg
   - Maximum size: 2MB (2048 KB)
   - Files validated on upload

4. **Pricing**
   - `shipping_charge` stored in cents (integer)
   - Example: $5.00 = 500 cents
   - Use `formatted_shipping_charge` attribute for display

5. **URL Validation**
   - Social media links and slider URLs must be valid URLs
   - Optional fields - can be null

6. **Theme Colors**
   - Default theme: `blue`
   - Customizable via `theme_colour` field
   - Can be used for frontend styling

---

## Frontend Integration

### Accessing Customization in Views

Shop customization is automatically loaded and passed to all subdomain views:

```php
// In blade templates
@if($customization)
    <h1>{{ $customization->shop_name }}</h1>

    @if($customization->logo)
        <img src="{{ asset('storage/' . $customization->logo) }}" alt="Logo">
    @endif

    <p>{{ $customization->tagline }}</p>

    @if($customization->shipping_charge)
        <p>Shipping: ₹{{ $customization->formatted_shipping_charge }}</p>
    @endif

    <!-- Social Media Links -->
    @if($customization->facebook_page)
        <a href="{{ $customization->facebook_page }}">Facebook</a>
    @endif
@endif
```

### Using Theme Colors

```php
<style>
    :root {
        --theme-color: {{ $customization->theme_colour ?? 'blue' }};
    }
</style>
```

### Slider Implementation

```php
@if($customization && $customization->slider_img_1)
    <div class="slider">
        <a href="{{ $customization->slider_img_1_url }}">
            <img src="{{ asset('storage/' . $customization->slider_img_1) }}"
                 alt="{{ $customization->slider_img_1_title }}">
            <h3>{{ $customization->slider_img_1_title }}</h3>
        </a>
    </div>
@endif
```

---

## Complete Integration Example

### Creating Shop Customization via API

```javascript
// JavaScript example with fetch API
const formData = new FormData();
formData.append('organization_id', 1);
formData.append('shop_name', 'My Awesome Shop');
formData.append('tagline', 'Quality Products at Best Prices');
formData.append('theme_colour', 'purple');
formData.append('phone', '+1234567890');
formData.append('address', '123 Main St, City, State 12345');
formData.append('shipping_charge', 500); // $5.00
formData.append('facebook_page', 'https://facebook.com/myshop');
formData.append('logo', logoFile); // File object from input

fetch('http://invoicer-backend.test/api/shop-customization', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer ' + token
    },
    body: formData
})
.then(response => response.json())
.then(data => {
    console.log('Success:', data);
})
.catch(error => {
    console.error('Error:', error);
});
```

### Updating Only Specific Fields

```bash
# Update only shop name and tagline
curl -X PUT "http://invoicer-backend.test/api/shop-customization/1" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "shop_name=Updated Shop Name" \
  -F "tagline=Updated Tagline"
```

---

## Error Handling

### Common Errors

**1. Missing organization_id (422)**
```json
{
  "success": false,
  "message": "organization_id is required"
}
```

**2. Invalid organization_id (422)**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "organization_id": ["The selected organization id is invalid."]
  }
}
```

**3. Image too large (422)**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "logo": ["The logo must not be greater than 2048 kilobytes."]
  }
}
```

**4. Invalid URL format (422)**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "facebook_page": ["The facebook page must be a valid URL."]
  }
}
```

**5. Customization not found (404)**
```json
{
  "success": false,
  "message": "Shop customization not found for this organization"
}
```

---

## Testing Checklist

### API Testing
- [ ] Create customization for new organization
- [ ] Upload all image types (logo, cover, sliders)
- [ ] Update existing customization
- [ ] Update with new images (verify old images deleted)
- [ ] Delete specific image fields
- [ ] Delete entire customization
- [ ] Test with invalid file types
- [ ] Test with files exceeding size limit
- [ ] Test with invalid URLs
- [ ] Test with missing required fields

### Frontend Testing
- [ ] Verify customization loads on subdomain homepage
- [ ] Check logo displays correctly
- [ ] Verify cover image shows
- [ ] Test slider functionality
- [ ] Check theme color application
- [ ] Verify social media links work
- [ ] Test shipping charge display
- [ ] Verify default values when customization doesn't exist

---

## Best Practices

1. **Image Optimization**
   - Compress images before upload
   - Recommended logo size: 200x80px
   - Recommended cover size: 1920x500px
   - Recommended slider size: 1200x400px

2. **Default Handling**
   - Always check if customization exists
   - Provide fallback values (organization name, default theme)
   - Handle null/empty fields gracefully

3. **Security**
   - Validate file types on both client and server
   - Use Laravel's storage disk for file management
   - Never expose full server paths in responses

4. **Performance**
   - Cache customization data per organization
   - Use eager loading when fetching with organization
   - Optimize images for web delivery

5. **User Experience**
   - Allow preview before saving
   - Show image dimensions requirements
   - Provide image cropping/resizing tools
   - Display upload progress for large files

---

## Support

For issues or questions:
- Review validation error messages carefully
- Check file size and format requirements
- Ensure URLs are properly formatted
- Verify organization_id is valid
- Check storage permissions for file uploads

---

**Last Updated**: October 30, 2025
**API Version**: 1.0.0
