import React, { useState, useEffect } from "react";
import { FaSearch, FaCalendarAlt, FaFileDownload } from "react-icons/fa";
import { IoFilterSharp } from "react-icons/io5";
import { FiUpload } from "react-icons/fi";
import { GoPlus } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";
import { getAllInventories } from "../services/inventoryService";




function Inventory() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    stock_status: "",
    has_variations: "",
    per_page: 20,
    page: 1,
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    per_page: 20,
  });

  const fetchInventories = async () => {
    setLoading(true);
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "")
      );
      const response = await getAllInventories(cleanFilters);
      if (response.data.success) {
        setProducts(response.data.data.data || []);
        setPagination({
          current_page: response.data.data.current_page,
          total: response.data.data.total,
          per_page: response.data.data.per_page,
        });
      }
    } catch (error) {
      console.error("Error fetching inventories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventories();
  }, [filters.page]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filters.page === 1) {
        fetchInventories();
      } else {
        setFilters({ ...filters, page: 1 });
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [filters.search]);

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const applyFilters = () => {
    fetchInventories();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "In stock":
        return "bg-success bg-opacity-10 text-success";
      case "Low stock":
        return "bg-warning bg-opacity-10 text-warning";
      case "Out of stock":
        return "bg-danger bg-opacity-10 text-danger";
      default:
        return "bg-secondary bg-opacity-10 text-secondary";
    }
  };

  const getStockStatus = (stockQuantity) => {
    if (stockQuantity === 0) return "Out of stock";
    if (stockQuantity < 20) return "Low stock";
    return "In stock";
  };

  const handleRowClick = (id) => {
    navigate(`/inventory/${id}`);
  };



  return (
    <>
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 bg-white p-2 mb-2 border-bottom">
        <h5 className="mb-0 fw-semibold">Inventory</h5>
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
            <FiUpload style={{ fontSize: "14px" }} />
            <span>Import</span>
          </button>
          <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
            <FaFileDownload style={{ fontSize: "14px" }} />
            <span>Export</span>
          </button>
          <Link to="/addproduct">
            <button className="btn btn-primary btn-sm d-flex align-items-center gap-1">
              <GoPlus style={{ fontSize: "16px" }} />
              <span>Add Product</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-2 border-bottom mb-2">
        <div className="row g-2 align-items-end">
          <div className="col-md-4">
            <div className="position-relative">
              <input
                type="text"
                placeholder="Search by name or QR code..."
                className="form-control form-control-sm ps-4"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
              <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" style={{ fontSize: "12px" }} />
            </div>
          </div>
          <div className="col-md-2">
            <select
              className="form-select form-select-sm"
              value={filters.stock_status}
              onChange={(e) => handleFilterChange("stock_status", e.target.value)}
            >
              <option value="">Stock Status</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
          <div className="col-md-2">
            <select
              className="form-select form-select-sm"
              value={filters.has_variations}
              onChange={(e) => handleFilterChange("has_variations", e.target.value)}
            >
              <option value="">Variations</option>
              <option value="true">Has Variations</option>
              <option value="false">No Variations</option>
            </select>
          </div>
          <div className="col-md-2">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Type"
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-primary btn-sm w-100 d-flex align-items-center justify-content-center gap-1"
              onClick={applyFilters}
            >
              <IoFilterSharp />
              <span>Apply</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border">
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border spinner-border-sm text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted mb-2">No products found</p>
            <Link to="/addproduct">
              <button className="btn btn-primary btn-sm">Add Your First Product</button>
            </Link>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-hover table-sm mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="py-2 px-3 border-bottom" style={{ fontSize: "13px" }}>
                      <input type="checkbox" className="form-check-input" />
                    </th>
                    <th className="py-2 px-3 border-bottom fw-semibold" style={{ fontSize: "13px" }}>Product Name</th>
                    <th className="py-2 px-3 border-bottom fw-semibold" style={{ fontSize: "13px" }}>Type</th>
                    <th className="py-2 px-3 border-bottom fw-semibold" style={{ fontSize: "13px" }}>SKU/QR</th>
                    <th className="py-2 px-3 border-bottom fw-semibold" style={{ fontSize: "13px" }}>Stock</th>
                    <th className="py-2 px-3 border-bottom fw-semibold" style={{ fontSize: "13px" }}>Variations</th>
                    <th className="py-2 px-3 border-bottom fw-semibold" style={{ fontSize: "13px" }}>Status</th>
                    <th className="py-2 px-3 border-bottom fw-semibold" style={{ fontSize: "13px" }}>Price</th>
                    <th className="py-2 px-3 border-bottom fw-semibold" style={{ fontSize: "13px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => handleRowClick(item.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td className="py-2 px-3" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" className="form-check-input" />
                      </td>
                      <td className="py-2 px-3">
                        <div className="d-flex align-items-center gap-2">
                          <div className="bg-light d-flex align-items-center justify-content-center rounded" style={{ width: "32px", height: "32px" }}>
                            <i className="bi bi-box-seam text-secondary" style={{ fontSize: "14px" }}></i>
                          </div>
                          <div>
                            <div className="fw-semibold" style={{ fontSize: "13px" }}>{item.name}</div>
                            {item.note && <small className="text-muted" style={{ fontSize: "11px" }}>{item.note.substring(0, 25)}</small>}
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <span className="badge bg-light text-dark border" style={{ fontSize: "11px" }}>{item.type || "N/A"}</span>
                      </td>
                      <td className="py-2 px-3 text-muted" style={{ fontSize: "13px" }}>{item.qr_code || "-"}</td>
                      <td className="py-2 px-3 fw-semibold" style={{ fontSize: "13px" }}>{item.stock_quantity || 0}</td>
                      <td className="py-2 px-3">
                        {item.has_variations ? (
                          <span className="badge bg-primary bg-opacity-10 text-primary" style={{ fontSize: "11px" }}>
                            <i className="bi bi-check-circle me-1"></i>{item.variations?.length || 0}
                          </span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td className="py-2 px-3">
                        <span className={`badge ${getStatusColor(getStockStatus(item.stock_quantity))} px-2 py-1`} style={{ fontSize: "11px" }}>
                          <span className="me-1">●</span>
                          {getStockStatus(item.stock_quantity)}
                        </span>
                      </td>
                      <td className="py-2 px-3 fw-semibold" style={{ fontSize: "13px" }}>Rs. {item.default_price?.toLocaleString() || 0}</td>
                      <td className="py-2 px-3" onClick={(e) => e.stopPropagation()}>
                        <div className="dropdown">
                          <button className="btn btn-sm btn-outline-secondary py-0 px-1" type="button" data-bs-toggle="dropdown">
                            <i className="bi bi-three-dots-vertical"></i>
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                              <Link className="dropdown-item" to={`/inventory/${item.id}`}>
                                <i className="bi bi-eye me-2"></i>View
                              </Link>
                            </li>
                            <li>
                              <Link className="dropdown-item" to={`/inventory/${item.id}/edit`}>
                                <i className="bi bi-pencil me-2"></i>Edit
                              </Link>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                              <button className="dropdown-item text-danger">
                                <i className="bi bi-trash me-2"></i>Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center p-2 border-top">
              <small className="text-muted">
                Showing {products.length} of {pagination.total} products
              </small>
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${pagination.current_page === 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => handleFilterChange("page", pagination.current_page - 1)}>
                      Previous
                    </button>
                  </li>
                  <li className="page-item active">
                    <span className="page-link">{pagination.current_page}</span>
                  </li>
                  <li className={`page-item ${pagination.current_page * pagination.per_page >= pagination.total ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => handleFilterChange("page", pagination.current_page + 1)}>
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </>
        )}
      </div>
    </>
  );

}


export default Inventory
