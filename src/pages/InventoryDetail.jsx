import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";
import { getInventoryById, deleteInventory } from "../services/inventoryService";
import StockModal from "../components/StockModal";

function InventoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockModalType, setStockModalType] = useState("");

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const response = await getInventoryById(id);
      if (response.data.success) {
        setProduct(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      alert("Failed to load product details");
      navigate("/inventory");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteInventory(id);
      alert("Product deleted successfully");
      navigate("/inventory");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  const openStockModal = (type) => {
    setStockModalType(type);
    setShowStockModal(true);
  };

  const getStockStatus = (stockQuantity) => {
    if (stockQuantity === 0) return { text: "Out of stock", color: "danger" };
    if (stockQuantity < 20) return { text: "Low stock", color: "warning" };
    return { text: "In stock", color: "success" };
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center p-5">
        <p>Product not found</p>
        <button className="btn btn-primary" onClick={() => navigate("/inventory")}>
          Back to Inventory
        </button>
      </div>
    );
  }

  const stockStatus = getStockStatus(product.stock_quantity);

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
          <h5 className="mb-0">{product.name}</h5>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-success btn-sm d-flex align-items-center gap-1"
            onClick={() => openStockModal("add")}
          >
            <i className="bi bi-plus-lg"></i>
            <span>Add</span>
          </button>
          <button
            className="btn btn-danger btn-sm d-flex align-items-center gap-1"
            onClick={() => openStockModal("reduce")}
          >
            <i className="bi bi-dash-lg"></i>
            <span>Reduce</span>
          </button>
          <Link to={`/inventory/${id}/edit`}>
            <button className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1">
              <i className="bi bi-pencil"></i>
              <span>Edit</span>
            </button>
          </Link>
          <button
            className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
            onClick={handleDelete}
          >
            <i className="bi bi-trash"></i>
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="row g-3">
        {/* Left Column - Main Details */}
        <div className="col-lg-8">
          {/* Stock Overview Card */}
          <div className="card mb-4 p-4">
            <div className="row g-4">
              <div className="col-md-4">
                <div className="d-flex align-items-center justify-content-center bg-light rounded p-4">
                  <i className="bi bi-box-seam text-secondary" style={{ fontSize: "72px" }}></i>
                </div>
              </div>
              <div className="col-md-8">
                <h4 className="fw-semibold mb-3">{product.name}</h4>
                <div className="d-flex gap-2 mb-3">
                  <span className="badge bg-light text-dark border">{product.type || "product"}</span>
                  <span className={`badge bg-${stockStatus.color} bg-opacity-10 text-${stockStatus.color}`}>
                    ● {stockStatus.text}
                  </span>
                  {product.has_variations && (
                    <span className="badge bg-primary bg-opacity-10 text-primary">
                      <i className="bi bi-check-circle me-1"></i>
                      {product.variations?.length || 0} Variations
                    </span>
                  )}
                </div>
                <div className="row g-3">
                  <div className="col-6">
                    <label className="text-muted small">Current Stock</label>
                    <div className="fs-4 fw-bold">{product.stock_quantity || 0}</div>
                  </div>
                  <div className="col-6">
                    <label className="text-muted small">Selling Price</label>
                    <div className="fs-4 fw-bold text-success">
                      Rs. {product.default_price?.toLocaleString() || 0}
                    </div>
                  </div>
                  <div className="col-6">
                    <label className="text-muted small">Cost Price</label>
                    <div className="fs-5 fw-semibold">
                      Rs. {product.default_cost_price?.toLocaleString() || 0}
                    </div>
                  </div>
                  <div className="col-6">
                    <label className="text-muted small">Profit Margin</label>
                    <div className="fs-5 fw-semibold text-primary">
                      {product.default_price && product.default_cost_price
                        ? `${(
                            ((product.default_price - product.default_cost_price) /
                              product.default_cost_price) *
                            100
                          ).toFixed(1)}%`
                        : "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "details" ? "active" : ""}`}
                onClick={() => setActiveTab("details")}
              >
                Details
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "variations" ? "active" : ""}`}
                onClick={() => setActiveTab("variations")}
              >
                Variations ({product.variations?.length || 0})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "stock_records" ? "active" : ""}`}
                onClick={() => setActiveTab("stock_records")}
              >
                Stock History
              </button>
            </li>
          </ul>

          {/* Tab Content */}
          <div className="card p-4">
            {activeTab === "details" && (
              <div>
                <h6 className="mb-3 text-secondary">Product Information</h6>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="text-muted small">Product Name</label>
                    <div className="fw-semibold">{product.name}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="text-muted small">Type</label>
                    <div className="fw-semibold">{product.type || "-"}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="text-muted small">QR Code / Barcode</label>
                    <div className="fw-semibold">{product.qr_code || "-"}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="text-muted small">Unit ID</label>
                    <div className="fw-semibold">{product.unit_id || "-"}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="text-muted small">Category ID</label>
                    <div className="fw-semibold">{product.category_id || "-"}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="text-muted small">Brand ID</label>
                    <div className="fw-semibold">{product.brand_id || "-"}</div>
                  </div>
                  <div className="col-12">
                    <label className="text-muted small">Notes</label>
                    <div className="fw-semibold">{product.note || "-"}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="text-muted small">Has Variations</label>
                    <div className="fw-semibold">
                      {product.has_variations ? (
                        <span className="text-success">
                          <i className="bi bi-check-circle me-1"></i>Yes
                        </span>
                      ) : (
                        <span className="text-muted">No</span>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="text-muted small">Batch Tracking</label>
                    <div className="fw-semibold">
                      {product.has_batches ? (
                        <span className="text-success">
                          <i className="bi bi-check-circle me-1"></i>Enabled
                        </span>
                      ) : (
                        <span className="text-muted">Disabled</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "variations" && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0 text-secondary">Product Variations</h6>
                  <Link to={`/inventory/${id}/variations/add`}>
                    <button className="btn btn-sm btn-primary">
                      <i className="bi bi-plus-lg me-1"></i>
                      Add Variation
                    </button>
                  </Link>
                </div>
                {product.variations && product.variations.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>Value</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>Batch Tracking</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.variations.map((variation) => (
                          <tr key={variation.id}>
                            <td>{variation.variation_type || "-"}</td>
                            <td className="fw-semibold">{variation.variation_value}</td>
                            <td>Rs. {variation.variation_price?.toLocaleString() || 0}</td>
                            <td className="fw-semibold">{variation.stock_quantity || 0}</td>
                            <td>
                              {variation.batch_tracking ? (
                                <span className="badge bg-info">Yes</span>
                              ) : (
                                <span className="badge bg-secondary">No</span>
                              )}
                            </td>
                            <td>
                              <button className="btn btn-sm btn-outline-secondary">
                                <i className="bi bi-pencil"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center text-muted py-4">
                    <p>No variations found</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "stock_records" && (
              <div>
                <h6 className="mb-3 text-secondary">Stock Movement History</h6>
                {product.stock_records && product.stock_records.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Type</th>
                          <th>Quantity</th>
                          <th>Balance After</th>
                          <th>Note</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.stock_records.map((record) => (
                          <tr key={record.id}>
                            <td>{new Date(record.created_at).toLocaleDateString()}</td>
                            <td>
                              <span
                                className={`badge ${
                                  record.transaction_type === "purchase"
                                    ? "bg-success"
                                    : "bg-danger"
                                }`}
                              >
                                {record.transaction_type}
                              </span>
                            </td>
                            <td
                              className={
                                record.quantity > 0 ? "text-success fw-bold" : "text-danger fw-bold"
                              }
                            >
                              {record.quantity > 0 ? "+" : ""}
                              {record.quantity}
                            </td>
                            <td className="fw-semibold">{record.balance_after}</td>
                            <td className="text-muted">{record.note || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center text-muted py-4">
                    <p>No stock records found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Quick Stats */}
        <div className="col-lg-4">
          <div className="card p-3 mb-3 bg-light">
            <h6 className="mb-3 text-secondary">Quick Actions</h6>
            <div className="d-grid gap-2">
              <button
                className="btn btn-success"
                onClick={() => openStockModal("add")}
              >
                <i className="bi bi-plus-lg me-2"></i>
                Add Stock
              </button>
              <button
                className="btn btn-danger"
                onClick={() => openStockModal("reduce")}
              >
                <i className="bi bi-dash-lg me-2"></i>
                Reduce Stock
              </button>
              <Link to={`/inventory/${id}/edit`}>
                <button className="btn btn-outline-primary w-100">
                  <i className="bi bi-pencil me-2"></i>
                  Edit Product
                </button>
              </Link>
            </div>
          </div>

          <div className="card p-3">
            <h6 className="mb-3 text-secondary">Metadata</h6>
            <div className="small">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Created:</span>
                <span className="fw-semibold">
                  {new Date(product.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Updated:</span>
                <span className="fw-semibold">
                  {new Date(product.updated_at).toLocaleDateString()}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Created By:</span>
                <span className="fw-semibold">{product.user?.name || "N/A"}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Organization:</span>
                <span className="fw-semibold">{product.organization?.name || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Modal */}
      <StockModal
        show={showStockModal}
        onClose={() => setShowStockModal(false)}
        inventoryId={id}
        type={stockModalType}
        variations={product.variations}
        onSuccess={fetchProductDetails}
      />
    </>
  );
}

export default InventoryDetail;
