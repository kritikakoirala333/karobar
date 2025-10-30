import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";
import { FaFileDownload } from "react-icons/fa";
import { IoChevronBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { createInventory } from "../services/inventoryService";

function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "product",
    default_price: "",
    default_cost_price: "",
    unit_id: "",
    category_id: "",
    brand_id: "",
    qr_code: "",
    has_variations: false,
    has_batches: false,
    note: "",
  });

  const [variations, setVariations] = useState([
    {
      variation_type: "",
      variation_value: "",
      variation_note: "",
      variation_price: "",
      stock_quantity: 0,
      batch_tracking: false,
    },
  ]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleVariationChange = (index, field, value) => {
    const updatedVariations = [...variations];
    updatedVariations[index][field] = value;
    setVariations(updatedVariations);
  };

  const addVariation = () => {
    setVariations([
      ...variations,
      {
        variation_type: "",
        variation_value: "",
        variation_note: "",
        variation_price: "",
        stock_quantity: 0,
        batch_tracking: false,
      },
    ]);
  };

  const removeVariation = (index) => {
    const updatedVariations = variations.filter((_, i) => i !== index);
    setVariations(updatedVariations);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        default_price: formData.default_price ? parseInt(formData.default_price) : null,
        default_cost_price: formData.default_cost_price
          ? parseInt(formData.default_cost_price)
          : null,
      };

      if (formData.has_variations && variations.length > 0) {
        const validVariations = variations.filter(
          (v) => v.variation_type && v.variation_value
        );
        if (validVariations.length > 0) {
          payload.variations = validVariations.map((v) => ({
            ...v,
            variation_price: v.variation_price ? parseInt(v.variation_price) : null,
            stock_quantity: v.stock_quantity ? parseInt(v.stock_quantity) : 0,
          }));
        }
      }

      const response = await createInventory(payload);

      if (response.data.success) {
        alert("Product created successfully!");
        navigate("/inventory");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      alert(error.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between bg-white p-2 border-bottom mb-2">
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-outline-secondary btn-sm p-1"
            onClick={() => navigate("/inventory")}
          >
            <IoChevronBackOutline style={{ fontSize: "18px" }} />
          </button>
          <h5 className="mb-0">Create Product</h5>
        </div>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => navigate("/inventory")}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="product-form"
            className="btn btn-primary btn-sm d-flex align-items-center gap-1"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm"></span>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <i className="bi bi-check-lg"></i>
                <span>Save</span>
              </>
            )}
          </button>
        </div>
      </div>

      <form id="product-form" onSubmit={handleSubmit}>
        {/* Form & Sidebar */}
        <div className="d-flex gap-3">
          {/* Form Section */}
          <div className="card flex-fill p-3">
            <h6 className="mb-3 text-secondary">Product Details</h6>
            <div className="row g-2">
              <div className="col-md-6">
                <label className="form-label fw-semibold small">Product Name *</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter Product Name"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold small">Type</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  placeholder="e.g., product"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold small">Selling Price (Rs.)</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  name="default_price"
                  value={formData.default_price}
                  onChange={handleInputChange}
                  placeholder="Selling Price"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold small">Cost Price (Rs.)</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  name="default_cost_price"
                  value={formData.default_cost_price}
                  onChange={handleInputChange}
                  placeholder="Cost Price"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold small">QR Code / Barcode</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  name="qr_code"
                  value={formData.qr_code}
                  onChange={handleInputChange}
                  placeholder="QR Code"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold small">Unit ID</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  name="unit_id"
                  value={formData.unit_id}
                  onChange={handleInputChange}
                  placeholder="Unit ID"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold small">Category ID</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  placeholder="Category ID"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold small">Brand ID</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  name="brand_id"
                  value={formData.brand_id}
                  onChange={handleInputChange}
                  placeholder="Brand ID"
                />
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold small">Notes</label>
                <textarea
                  className="form-control form-control-sm"
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Enter additional notes..."
                ></textarea>
              </div>

              <div className="col-12">
                <div className="d-flex gap-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="has_variations"
                      checked={formData.has_variations}
                      onChange={handleInputChange}
                      id="hasVariations"
                    />
                    <label className="form-check-label fw-semibold" htmlFor="hasVariations">
                      Has Variations (Size, Color, etc.)
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="has_batches"
                      checked={formData.has_batches}
                      onChange={handleInputChange}
                      id="hasBatches"
                    />
                    <label className="form-check-label fw-semibold" htmlFor="hasBatches">
                      Track Batches
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Variations Section */}
            {formData.has_variations && (
              <div className="mt-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0 text-secondary small">Product Variations</h6>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary py-0"
                    onClick={addVariation}
                  >
                    <i className="bi bi-plus-lg me-1"></i>
                    Add
                  </button>
                </div>

                {variations.map((variation, index) => (
                  <div key={index} className="card p-2 mb-2 bg-light border">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <small className="fw-semibold">Variation {index + 1}</small>
                      {variations.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger py-0 px-1"
                          onClick={() => removeVariation(index)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      )}
                    </div>

                    <div className="row g-2">
                      <div className="col-md-3">
                        <label className="form-label fw-semibold small mb-1">Type</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={variation.variation_type}
                          onChange={(e) =>
                            handleVariationChange(index, "variation_type", e.target.value)
                          }
                          placeholder="Size"
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label fw-semibold small mb-1">Value *</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={variation.variation_value}
                          onChange={(e) =>
                            handleVariationChange(index, "variation_value", e.target.value)
                          }
                          placeholder="Large"
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label fw-semibold small mb-1">Price</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={variation.variation_price}
                          onChange={(e) =>
                            handleVariationChange(index, "variation_price", e.target.value)
                          }
                          placeholder="0"
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label fw-semibold small mb-1">Stock</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={variation.stock_quantity}
                          onChange={(e) =>
                            handleVariationChange(index, "stock_quantity", e.target.value)
                          }
                          placeholder="0"
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold small mb-1">Note</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={variation.variation_note}
                          onChange={(e) =>
                            handleVariationChange(index, "variation_note", e.target.value)
                          }
                          placeholder="Optional"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Preview */}
          <div className="card p-2" style={{ width: "300px", backgroundColor: "#f8f9fa" }}>
            <h6 className="mb-2 text-secondary small">Preview</h6>
            <div className="border rounded p-2 bg-white">
              <div className="d-flex align-items-center justify-content-center bg-light rounded mb-2" style={{ height: "80px" }}>
                <i className="bi bi-image text-secondary" style={{ fontSize: "32px" }}></i>
              </div>
              <h6 className="fw-semibold small">{formData.name || "Product Name"}</h6>
              <p className="text-muted mb-2" style={{ fontSize: "11px" }}>
                {formData.type || "product"}
              </p>
              <div className="d-flex justify-content-between mb-1">
                <small className="text-muted">Price:</small>
                <small className="fw-semibold">Rs. {formData.default_price || "0"}</small>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <small className="text-muted">Cost:</small>
                <small className="fw-semibold">Rs. {formData.default_cost_price || "0"}</small>
              </div>
              {formData.has_variations && (
                <div className="mt-2">
                  <span className="badge bg-primary" style={{ fontSize: "10px" }}>
                    <i className="bi bi-check-circle me-1"></i>
                    {variations.length} Variation{variations.length !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
              {formData.has_batches && (
                <div className="mt-2">
                  <span className="badge bg-info" style={{ fontSize: "10px" }}>
                    <i className="bi bi-boxes me-1"></i>
                    Batch Tracking
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default AddProduct;
