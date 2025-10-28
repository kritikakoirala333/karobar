import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FaTrashAlt } from "react-icons/fa";
import { RiFileEditFill } from "react-icons/ri";
import { IoChevronBackOutline } from "react-icons/io5";
import { BsGrid3X3Gap, BsTable } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import EditForm from "./pages/EditCustomer";
import axiosInstance from "./axiosConfig";
import Swal from "sweetalert2";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [viewMode, setViewMode] = useState("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    // Set first customer as default selected
    if (customers.length > 0 && !selectedCustomer) {
      setSelectedCustomer(customers[0]);
    }
  }, [customers]);

  const fetchCustomers = () => {
    axiosInstance
      .get("/customers")
      .then((response) => {
        setCustomers(response.data.data.data);
      })
      .catch((error) => {
        console.error("Error fetching customers:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to fetch customers",
          icon: "error",
          confirmButtonText: "OK"
        });
      });
  };

  const filteredCustomers = customers.filter((customer) => {
    const term = searchTerm.toLowerCase();
    return (
      customer.name?.toLowerCase().includes(term) ||
      customer.address?.toLowerCase().includes(term) ||
      customer.phone?.toLowerCase().includes(term) ||
      customer.email?.toLowerCase().includes(term)
    );
  });

  const handleDeleteClick = (customer) => {
    Swal.fire({
      title: "Delete Customer?",
      text: `Are you sure you want to delete ${customer.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Customer has been deleted.",
          icon: "success",
          timer: 2000,
          timerProgressBar: true
        });
        setCustomers(customers.filter((c) => c.id !== customer.id));
      }
    });
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setShowEditForm(true);
  };

  const handleRowClick = (customer) => {
    // Navigate to customer detail page
    // navigate(`/customers/${customer.id}`);
    setSelectedCustomer(customer);
  };

  return (
    <div>
      {/* Header Section */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center" style={{ width: "32px", height: "32px" }}>
            <IoChevronBackOutline style={{ fontSize: "16px" }} />
          </button>
          <h5 className="mb-0 fw-bold">Customers</h5>
          <span className="badge rounded-circle bg-dark d-flex align-items-center justify-content-center" style={{ width: "24px", height: "24px", fontSize: "11px" }}>
            {customers.length}
          </span>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <div className="position-relative">
            <FiSearch className="position-absolute" style={{ left: "10px", top: "50%", transform: "translateY(-50%)", color: "#999", fontSize: "14px" }} />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control form-control-sm ps-4"
              style={{ width: "240px", fontSize: "13px", height: "32px" }}
            />
          </div>
          <div className="btn-group">
            <button
              className={`btn btn-sm d-flex align-items-center gap-1 ${viewMode === "table" ? "btn-dark" : "btn-outline-dark"}`}
              onClick={() => setViewMode("table")}
              style={{ fontSize: "13px", padding: "4px 12px" }}
            >
              <BsTable style={{ fontSize: "14px" }} />
              Table
            </button>
            <button
              className={`btn btn-sm d-flex align-items-center gap-1 ${viewMode === "grid" ? "btn-dark" : "btn-outline-dark"}`}
              onClick={() => setViewMode("grid")}
              style={{ fontSize: "13px", padding: "4px 12px" }}
            >
              <BsGrid3X3Gap style={{ fontSize: "14px" }} />
              Grid
            </button>
          </div>
          <Link to="/add-customer" className="btn btn-dark btn-sm" style={{ fontSize: "13px", padding: "4px 14px" }}>
            + Add
          </Link>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="row g-3">
        {/* Left: Table/Grid View */}
        <div className="col-lg-8">
          {customers.length > 0 ? (
            viewMode === "table" ? (
              /* Table View */
              <div className="card rounded-0 shadow-none" style={{ border: "1px solid #e0e0e0" }}>
                <div style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
                  <table className="table table-hover mb-0" style={{ fontSize: "13px" }}>
                    <thead style={{ backgroundColor: "#fafafa", borderBottom: "2px solid #e0e0e0", position: "sticky", top: 0, zIndex: 10 }}>
                      <tr>
                        <th className="fw-bold py-2 ps-3" style={{ width: "3%" }}>#</th>
                        <th className="fw-bold py-2" style={{ width: "22%" }}>Customer</th>
                        <th className="fw-bold py-2" style={{ width: "16%" }}>Contact</th>
                        <th className="fw-bold py-2" style={{ width: "18%" }}>Location</th>
                        <th className="fw-bold py-2" style={{ width: "10%" }}>Added</th>
                        <th className="fw-bold py-2 text-end" style={{ width: "10%" }}>Balance</th>
                        <th className="fw-bold py-2" style={{ width: "8%" }}>Status</th>
                        <th className="fw-bold py-2 text-center pe-3" style={{ width: "8%" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map((customer, index) => (
                        <tr
                          key={customer.id}
                          style={{ borderBottom: "1px solid #f0f0f0", cursor: "pointer" }}
                          onClick={() => handleRowClick(customer)}
                          className={selectedCustomer?.id === customer.id ? "table-active" : ""}
                        >
                          <td className="text-muted ps-3 py-2">{index + 1}</td>
                          <td className="py-2">
                            <div>
                              <div className="fw-semibold text-dark">{customer.name}</div>
                              <small className="text-muted" style={{ fontSize: "11px" }}>ID: #{customer.id}</small>
                            </div>
                          </td>
                          <td className="py-2" style={{ fontSize: "12px", whiteSpace:'nowrap', overflow:'clip', textOverflow:'ellipsis' }}>
                            <div className="mb-1">
                              <i className="bi bi-telephone-fill me-1" style={{ fontSize: "10px" }}></i>
                              {customer.phone || "N/A"}
                            </div>
                            {customer.email && (
                              <div className="text-muted" style={{ fontSize: "11px" }}>
                                <i className="bi bi-envelope-fill me-1" style={{ fontSize: "10px" }}></i>
                                {customer.email}
                              </div>
                            )}
                          </td>
                          <td className="py-2 text-muted" style={{ fontSize: "12px" }}>
                            <i className="bi bi-geo-alt-fill me-1" style={{ fontSize: "10px" }}></i>
                            {customer.address || "N/A"}
                          </td>
                          <td className="py-2 text-muted" style={{ fontSize: "12px" }}>
                            {customer.created_at ? new Date(customer.created_at).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : "N/A"}
                          </td>
                          <td className="py-2 text-end fw-bold" style={{ fontSize: "12px" }}>
                            Rs. 0.00
                          </td>
                          <td className="py-2">
                            <span className="badge bg-dark rounded-pill" style={{ fontSize: "10px", padding: "3px 8px" }}>
                              Active
                            </span>
                          </td>
                          <td className="py-2 text-center pe-3">
                            <div className="d-flex gap-1 justify-content-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(customer);
                                }}
                                className="btn btn-sm btn-outline-dark p-0 d-flex align-items-center justify-content-center"
                                style={{ width: "24px", height: "24px" }}
                                title="Edit"
                              >
                                <RiFileEditFill style={{ fontSize: "11px" }} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClick(customer);
                                }}
                                className="btn btn-sm btn-outline-dark p-0 d-flex align-items-center justify-content-center"
                                style={{ width: "24px", height: "24px" }}
                                title="Delete"
                              >
                                <FaTrashAlt style={{ fontSize: "10px" }} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="py-2 px-3 border-top" style={{ backgroundColor: "#fafafa", fontSize: "12px" }}>
                  <span className="text-muted">
                    Showing {filteredCustomers.length} of {customers.length} customers
                  </span>
                </div>
              </div>
            ) : (
              /* Grid View */
              <div className="row g-2" style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
                {filteredCustomers.map((customer, index) => (
                  <div key={customer.id} className="col-md-4">
                    <div
                      className={`card rounded-0 h-100 shadow-sm ${selectedCustomer?.id === customer.id ? 'border-dark' : ''}`}
                      style={{ border: "1px solid #e0e0e0", cursor: "pointer" }}
                      onClick={() => handleRowClick(customer)}
                    >
                      <div className="card-body p-2">
                        <div className="mb-2">
                          <h6 className="mb-0 fw-bold" style={{ fontSize: "13px" }}>{customer.name}</h6>
                          <small className="text-muted" style={{ fontSize: "10px" }}>ID: #{customer.id}</small>
                        </div>

                        <div className="mb-2 pb-2 border-bottom" style={{ fontSize: "11px" }}>
                          <div className="mb-1">
                            <i className="bi bi-telephone-fill me-1 text-muted" style={{ fontSize: "10px" }}></i>
                            {customer.phone || "N/A"}
                          </div>
                          <div className="text-muted">
                            <i className="bi bi-geo-alt-fill me-1" style={{ fontSize: "10px" }}></i>
                            {customer.address || "N/A"}
                          </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div>
                            <small className="text-muted d-block" style={{ fontSize: "10px" }}>Balance</small>
                            <span className="fw-bold" style={{ fontSize: "12px" }}>Rs. 0.00</span>
                          </div>
                          <span className="badge bg-dark rounded-pill" style={{ fontSize: "9px", padding: "3px 8px" }}>
                            Active
                          </span>
                        </div>

                        <div className="d-flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(customer);
                            }}
                            className="btn btn-sm btn-outline-dark flex-fill"
                            style={{ fontSize: "11px", padding: "3px" }}
                          >
                            <RiFileEditFill />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(customer);
                            }}
                            className="btn btn-sm btn-outline-dark flex-fill"
                            style={{ fontSize: "11px", padding: "3px" }}
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="card shadow-sm text-center p-5" style={{ border: "1px solid #e0e0e0" }}>
              <p className="text-muted mb-0">No customers found</p>
            </div>
          )}
        </div>

        {/* Right: Detail Sidebar */}
        <div className="col-lg-4">
          {selectedCustomer ? (
            <div className="card rounded-0 shadow-none" style={{ border: "1px solid #e0e0e0" }}>
              <div className="card-body p-3">
                <div className="mb-3 pb-3 border-bottom">
                  <h6 className="mb-0 fw-bold" style={{ fontSize: "14px" }}>{selectedCustomer.name}</h6>
                  <small className="text-muted" style={{ fontSize: "11px" }}>Customer ID: #{selectedCustomer.id}</small>
                </div>

                <div style={{ fontSize: "12px" }}>
                  <div className="mb-3">
                    <label className="text-muted d-block mb-1" style={{ fontSize: "11px" }}>CONTACT INFORMATION</label>
                    <div className="mb-2">
                      <i className="bi bi-telephone-fill me-2"></i>
                      <span>{selectedCustomer.phone || "N/A"}</span>
                    </div>
                    {selectedCustomer.email && (
                      <div className="mb-2">
                        <i className="bi bi-envelope-fill me-2"></i>
                        <span>{selectedCustomer.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="text-muted d-block mb-1" style={{ fontSize: "11px" }}>ADDRESS</label>
                    <div>
                      <i className="bi bi-geo-alt-fill me-2"></i>
                      <span>{selectedCustomer.address || "N/A"}</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="text-muted d-block mb-1" style={{ fontSize: "11px" }}>FINANCIAL</label>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Balance Due:</span>
                      <span className="fw-bold">Rs. 0.00</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Total Invoices:</span>
                      <span className="fw-bold">0</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="text-muted d-block mb-1" style={{ fontSize: "11px" }}>STATUS</label>
                    <span className="badge bg-dark w-100" style={{ fontSize: "11px", padding: "5px" }}>Active</span>
                  </div>

                  <div>
                    <label className="text-muted d-block mb-1" style={{ fontSize: "11px" }}>JOINED DATE</label>
                    <span>{selectedCustomer.created_at ? new Date(selectedCustomer.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "N/A"}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-top">
                  <button
                    onClick={() => navigate(`/customer-ledger/${selectedCustomer.id}`)}
                    className="btn btn-dark btn-sm w-100 mb-2"
                    style={{ fontSize: "12px" }}
                  >
                    <i className="bi bi-receipt me-1"></i>
                    View Ledger
                  </button>
                  <button
                    onClick={() => handleEdit(selectedCustomer)}
                    className="btn btn-outline-dark btn-sm w-100 mb-2"
                    style={{ fontSize: "12px" }}
                  >
                    <RiFileEditFill className="me-1" />
                    Edit Customer
                  </button>
                  <button
                    onClick={() => handleDeleteClick(selectedCustomer)}
                    className="btn btn-outline-dark btn-sm w-100"
                    style={{ fontSize: "12px" }}
                  >
                    <FaTrashAlt className="me-1" />
                    Delete Customer
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card shadow-sm text-center p-4" style={{ border: "1px solid #e0e0e0" }}>
              <p className="text-muted mb-0" style={{ fontSize: "12px" }}>No customer selected</p>
            </div>
          )}
        </div>
      </div>

      {showEditForm && (
        <EditForm setShowEditForm={setShowEditForm} customer={selectedCustomer} />
      )}
    </div>
  );
}
