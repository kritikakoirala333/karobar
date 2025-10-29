import React, { useState } from "react";
import { addStock, reduceStock } from "../services/inventoryService";

function StockModal({ show, onClose, inventoryId, type, variations, onSuccess }) {
  const [formData, setFormData] = useState({
    variation_id: "",
    batch_id: "",
    quantity: "",
    note: "",
    related_invoice_id: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        quantity: parseInt(formData.quantity),
        variation_id: formData.variation_id ? parseInt(formData.variation_id) : null,
        related_invoice_id: formData.related_invoice_id
          ? parseInt(formData.related_invoice_id)
          : null,
      };

      const response =
        type === "add"
          ? await addStock(inventoryId, payload)
          : await reduceStock(inventoryId, payload);

      if (response.data.success) {
        alert(
          type === "add"
            ? "Stock added successfully!"
            : "Stock reduced successfully!"
        );
        onSuccess();
        onClose();
        setFormData({
          variation_id: "",
          batch_id: "",
          quantity: "",
          note: "",
          related_invoice_id: "",
        });
      }
    } catch (error) {
      console.error("Error managing stock:", error);
      alert(error.response?.data?.message || error.response?.data?.error || "Failed to manage stock");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1050 }}
      onClick={onClose}
    >
      <div
        className="bg-white p-4 rounded-4 shadow-lg"
        style={{ width: "500px", maxHeight: "90vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0">
            {type === "add" ? "Add Stock" : "Reduce Stock"}
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
          ></button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Variation Selection */}
          {variations && variations.length > 0 && (
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Variation (Optional)
              </label>
              <select
                className="form-select"
                value={formData.variation_id}
                onChange={(e) =>
                  setFormData({ ...formData, variation_id: e.target.value })
                }
              >
                <option value="">None (Update inventory level only)</option>
                {variations.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.variation_type}: {v.variation_value} (Stock: {v.stock_quantity})
                  </option>
                ))}
              </select>
              <small className="text-muted">
                Select a variation to update its stock, or leave blank to update only the main inventory stock.
              </small>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Quantity <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              className="form-control"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              placeholder="Enter quantity"
              min="1"
              required
            />
          </div>

          {/* Related Invoice */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Related Invoice ID (Optional)
            </label>
            <input
              type="number"
              className="form-control"
              value={formData.related_invoice_id}
              onChange={(e) =>
                setFormData({ ...formData, related_invoice_id: e.target.value })
              }
              placeholder="Invoice ID (if applicable)"
            />
          </div>

          {/* Note */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Note</label>
            <textarea
              className="form-control"
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
              rows="3"
              placeholder="Enter note or reason for stock change..."
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary flex-fill"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn ${
                type === "add" ? "btn-success" : "btn-danger"
              } flex-fill`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Processing...
                </>
              ) : (
                <>
                  <i className={`bi bi-${type === "add" ? "plus" : "dash"}-lg me-2`}></i>
                  {type === "add" ? "Add Stock" : "Reduce Stock"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StockModal;
