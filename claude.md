# Karobar App - Design System & Patterns

## Core Design Philosophy
Clean, minimal, professional business management interface using Bootstrap 5 with custom styling.

## Color Palette
- **Primary**: `#0d6efd` (Bootstrap Blue)
- **Background Light**: `#f8f9fa`
- **Text Primary**: `#000` (Black)
- **Text Secondary**: `#6c757d` (Gray)
- **Text Muted**: `text-muted` class
- **Border**: `border` (Bootstrap default)
- **Active State**: Blue left border (`border-left-color: #0d6efd`)

## Typography
- **Headings**: `fs-5`, `fs-6` with `fw-semibold` or `fw-bold`
- **Body Text**: Default Bootstrap sizing
- **Labels**: `form-label fw-semibold`
- **Section Headers**: `text-secondary` with `mb-3` or `mb-4`

## Layout Patterns

### 1. Page Header Pattern
```jsx
<div className="d-flex flex-wrap align-items-center justify-content-between bg-light text-dark p-3 rounded-3 border">
  <div className="d-flex align-items-center gap-3">
    <button className="btn btn-outline-secondary btn-sm p-1">
      <IoChevronBackOutline className="fs-5" />
    </button>
    <h5 className="mb-0">Page Title</h5>
  </div>
  <div className="d-flex gap-2">
    <button className="btn btn-outline-secondary">Action</button>
  </div>
</div>
```

### 2. Card Pattern
```jsx
<div className="card p-3" or "card p-4">
  <h6 className="mb-3 text-secondary">Card Title</h6>
  {/* Content */}
</div>
```

### 3. Form Layout (Two Column)
```jsx
<form className="row g-3">
  <div className="col-md-6">
    <label className="form-label fw-semibold">Label *</label>
    <input type="text" className="form-control" placeholder="Enter..." />
  </div>
</form>
```

### 4. Main Content + Sidebar Layout
```jsx
<div className="d-flex gap-4 mt-4">
  <div className="card flex-fill p-4">
    {/* Main content */}
  </div>
  <div className="card p-3" style={{ width: "600px", backgroundColor: "#f8f9fa" }}>
    {/* Sidebar/Preview */}
  </div>
</div>
```

## Component Patterns

### Input Fields
- **Text Input**: `form-control p-2 border-2 rounded-3`
- **Select**: `form-select` (Bootstrap default)
- **Small Input**: `form-control form-control-sm border-2 rounded-3`
- **Labels**: `form-label fw-semibold`

### Buttons
- **Primary Action**: `btn btn-primary px-4 py-2 rounded-3`
- **Secondary Action**: `btn btn-outline-secondary`
- **Small Button**: `btn btn-outline-secondary btn-sm p-1`
- **Dashed Add Button**: `.add-more-btn` (custom class)

### Navigation Tabs
```jsx
<Nav variant="tabs" className="border-0 gap-3" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
  <Nav.Item key={tab.key}>
    <Nav.Link
      eventKey={tab.key}
      className={`px-0 pb-2 border-0 ${
        activeTab === tab.key
          ? "text-dark fw-semibold border-bottom border-2 border-dark"
          : "text-secondary"
      }`}
      style={{ background: "transparent", fontSize: "16px", fontWeight: "600" }}
    >
      {tab.label}
    </Nav.Link>
  </Nav.Item>
</Nav>
```

### Customer/Entity Cards
```jsx
<div className="row m-0 bg-light rounded border p-2">
  <div className="col-11">
    <span className="fw-semibold">Name</span><br />
    <span className="fw-normal">Details</span>
  </div>
  <div className="col-1">
    <button><i className="bi bi-x"></i></button>
  </div>
</div>
```

### Modal/Popup Pattern
```jsx
<div
  className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
  style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1050 }}
>
  <div className="bg-white p-4 rounded-4 shadow-lg" style={{ width: "400px" }}>
    {/* Content */}
  </div>
</div>
```

## Spacing System
- **Section Spacing**: `mt-3`, `mt-4`, `mb-3`, `mb-4`
- **Component Gaps**: `gap-2`, `gap-3`, `gap-4`
- **Padding**: `p-2`, `p-3`, `p-4`
- **Form Spacing**: `row g-3` for form layouts

## Border & Shadow
- **Standard Border**: `border`
- **Bottom Border**: `border-bottom`
- **Rounded Corners**: `rounded-3`, `rounded-4`
- **Shadow**: `shadow-sm`, `shadow-lg`

## Icons
- **React Icons**:
  - `react-icons/io5` - Chevron, Cloud Upload
  - `react-icons/fi` - Upload
  - `react-icons/fa` - Download
- **Bootstrap Icons**: `bi bi-x` for close buttons
- **Icon Size**: `fs-3`, `fs-5` classes

## Sidebar Patterns
Custom classes defined in `index.css`:
- `.sidebar-menu-item` - Main menu items
- `.sidebar-submenu-item` - Nested menu items
- `.sidebar-section-header` - Section headers
- Active state with blue left border

## Custom Classes

### Add More Button
```css
.add-more-btn {
  margin-top: 20px;
  border: 2px dashed black;
  background-color: transparent;
  border-radius: 3px;
  padding: 10px;
}
.add-more-btn:hover {
  background-color: #f4f4f4 !important;
}
```

### Customer Card Hover
```css
.customerCard:hover {
  background-color: #f4f4f4;
}
```

## Best Practices
1. Use Bootstrap utility classes for spacing and layout
2. Maintain consistent `rounded-3` for most elements
3. Use `bg-light` (#f8f9fa) for subtle backgrounds
4. Keep borders subtle with default Bootstrap border
5. Use `fw-semibold` for labels and important text
6. Use `text-secondary` for section headers
7. Maintain consistent gap spacing (gap-2, gap-3, gap-4)
8. Use `d-flex` with `gap-*` instead of margin for spacing between elements

## Form Validation
- Required fields marked with `*` in label
- Use `required` attribute on form inputs

## Responsive Design
- Use Bootstrap grid: `col-md-6` for two-column layouts
- Use `flex-wrap` on headers for mobile responsiveness
- Stack elements vertically on smaller screens with Bootstrap grid
