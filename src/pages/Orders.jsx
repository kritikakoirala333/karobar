import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FaTrashAlt, FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import { RiFileEditFill } from "react-icons/ri";
import { BsFileEarmarkBarGraphFill } from "react-icons/bs";
import { MdArrowDropDown } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { RiSortAlphabetDesc } from "react-icons/ri";
import Swal from "sweetalert2";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [viewMode, setViewMode] = useState("table"); // 'grid' or 'table'
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);

  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [showPaymentFilter, setShowPaymentFilter] = useState(false);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("");

  const [showSortByFilter, setShowSortByFilter] = useState(false);
  const [selectedSortBy, setSelectedSortBy] = useState("");

  const navigate = useNavigate();

  const fetchOrders = () => {
    axiosInstance
      .get("/orders")
      .then((resp) => {
        console.log("Orders:", resp.data);
        setOrders(resp.data.data.data || resp.data.data);
      })
      .catch((ex) => {
        console.error("Error fetching orders:", ex);
        Swal.fire({
          title: "Error!",
          text: "Failed to load orders",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getOrderStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "processing":
        return "bg-purple-100 text-purple-700";
      case "shipped":
        return "bg-indigo-100 text-indigo-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "unpaid":
        return "bg-red-100 text-red-700";
      case "refunded":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const filteredOrders = orders
    .filter((order) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        order.customer_name?.toLowerCase().includes(term) ||
        order.customer_phone?.toLowerCase().includes(term) ||
        order.order_number?.toLowerCase().includes(term);

      const matchesStatus =
        !selectedStatus || order.status === selectedStatus.toLowerCase();

      const matchesPaymentStatus =
        !selectedPaymentStatus ||
        order.payment_status === selectedPaymentStatus.toLowerCase();

      return matchesSearch && matchesStatus && matchesPaymentStatus;
    })
    .sort((a, b) => {
      if (selectedSortBy === "Customer Name") {
        return (a.customer_name || "").localeCompare(b.customer_name || "");
      } else if (selectedSortBy === "Total Amount") {
        return (a.total_amount || 0) - (b.total_amount || 0);
      } else if (selectedSortBy === "Items") {
        return (a.total_items || 0) - (b.total_items || 0);
      } else if (selectedSortBy === "Date") {
        return new Date(a.created_at) - new Date(b.created_at);
      }
      return 0;
    });

  const handleDeleteClick = (order) => {
    if (order.status !== "pending" && order.status !== "cancelled") {
      Swal.fire({
        title: "Cannot Delete",
        text: "Only pending or cancelled orders can be deleted",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete order ${order.order_number}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosInstance
          .delete(`/orders/${order.id}`)
          .then(() => {
            Swal.fire("Deleted!", "Order has been deleted.", "success");
            fetchOrders();
          })
          .catch((ex) => {
            console.error("Error deleting order:", ex);
            Swal.fire({
              title: "Error!",
              text: ex.response?.data?.message || "Failed to delete order",
              icon: "error",
              confirmButtonText: "OK",
            });
          });
      }
    });
  };

  const formatAmount = (amount) => {
    return `Rs. ${(amount / 100).toFixed(2)}`;
  };

  return (
    <div className="container-xxl p-4">
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between bg-light text-dark p-3 rounded-3 border">
        <div className="d-flex align-items-center gap-3">
          <h5 className="mb-0 fw-semibold">Orders Management</h5>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => navigate("/create-order")}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Create Order
          </button>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={fetchOrders}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="card p-3 mt-3">
        <div className="row g-3 align-items-center">
          {/* Search */}
          <div className="col-md-4">
            <div className="position-relative">
              <FiSearch
                className="position-absolute"
                style={{ left: "10px", top: "50%", transform: "translateY(-50%)" }}
              />
              <input
                type="text"
                className="form-control ps-5"
                placeholder="Search by order number, customer name, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Order Status Filter */}
          <div className="col-md-2 position-relative">
            <button
              className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-between"
              onClick={() => setShowStatusFilter(!showStatusFilter)}
            >
              <span>{selectedStatus || "Order Status"}</span>
              <MdArrowDropDown />
            </button>
            {showStatusFilter && (
              <div
                className="position-absolute bg-white border rounded shadow-sm mt-1 w-100"
                style={{ zIndex: 10 }}
              >
                {["", "Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"].map(
                  (status) => (
                    <div
                      key={status}
                      className="px-3 py-2 cursor-pointer hover:bg-light"
                      onClick={() => {
                        setSelectedStatus(status);
                        setShowStatusFilter(false);
                      }}
                    >
                      {status || "All"}
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Payment Status Filter */}
          <div className="col-md-2 position-relative">
            <button
              className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-between"
              onClick={() => setShowPaymentFilter(!showPaymentFilter)}
            >
              <span>{selectedPaymentStatus || "Payment Status"}</span>
              <MdArrowDropDown />
            </button>
            {showPaymentFilter && (
              <div
                className="position-absolute bg-white border rounded shadow-sm mt-1 w-100"
                style={{ zIndex: 10 }}
              >
                {["", "Paid", "Unpaid", "Refunded"].map((status) => (
                  <div
                    key={status}
                    className="px-3 py-2 cursor-pointer hover:bg-light"
                    onClick={() => {
                      setSelectedPaymentStatus(status);
                      setShowPaymentFilter(false);
                    }}
                  >
                    {status || "All"}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sort By */}
          <div className="col-md-2 position-relative">
            <button
              className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-between"
              onClick={() => setShowSortByFilter(!showSortByFilter)}
            >
              <RiSortAlphabetDesc className="me-2" />
              <span>{selectedSortBy || "Sort By"}</span>
              <MdArrowDropDown />
            </button>
            {showSortByFilter && (
              <div
                className="position-absolute bg-white border rounded shadow-sm mt-1 w-100"
                style={{ zIndex: 10 }}
              >
                {["", "Customer Name", "Total Amount", "Items", "Date"].map((sort) => (
                  <div
                    key={sort}
                    className="px-3 py-2 cursor-pointer hover:bg-light"
                    onClick={() => {
                      setSelectedSortBy(sort);
                      setShowSortByFilter(false);
                    }}
                  >
                    {sort || "None"}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="col-md-2">
            <div className="btn-group w-100">
              <button
                className={`btn ${
                  viewMode === "table" ? "btn-primary" : "btn-outline-secondary"
                }`}
                onClick={() => setViewMode("table")}
              >
                <i className="bi bi-table"></i>
              </button>
              <button
                className={`btn ${
                  viewMode === "grid" ? "btn-primary" : "btn-outline-secondary"
                }`}
                onClick={() => setViewMode("grid")}
              >
                <i className="bi bi-grid-3x3-gap"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List/Grid */}
      <div className="mt-3">
        {viewMode === "table" ? (
          <div className="card">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Items</th>
                    <th>Total Amount</th>
                    <th>Order Status</th>
                    <th>Payment Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.slice(0, visibleCount).map((order) => (
                    <tr key={order.id}>
                      <td className="fw-semibold">{order.order_number}</td>
                      <td>{order.customer_name}</td>
                      <td>{order.customer_phone}</td>
                      <td>{order.total_items}</td>
                      <td className="fw-semibold">{formatAmount(order.total_amount)}</td>
                      <td>
                        <span
                          className={`badge ${getOrderStatusBadge(
                            order.status
                          )} text-capitalize`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${getPaymentStatusBadge(
                            order.payment_status
                          )} text-capitalize`}
                        >
                          {order.payment_status}
                        </span>
                      </td>
                      <td>{new Date(order.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => navigate(`/order/${order.id}`)}
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteClick(order)}
                            title="Delete Order"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="row g-3">
            {filteredOrders.slice(0, visibleCount).map((order) => (
              <div key={order.id} className="col-md-6 col-lg-4">
                <div className="card p-3 h-100">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="fw-bold mb-0">{order.order_number}</h6>
                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => navigate(`/order/${order.id}`)}
                      >
                        <FaEye />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteClick(order)}
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                  <div className="mb-2">
                    <small className="text-muted">Customer</small>
                    <div className="fw-semibold">{order.customer_name}</div>
                    <div className="text-muted small">{order.customer_phone}</div>
                  </div>
                  <div className="mb-2">
                    <div className="d-flex justify-content-between">
                      <span className="text-muted small">Items:</span>
                      <span className="fw-semibold">{order.total_items}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted small">Total:</span>
                      <span className="fw-bold">{formatAmount(order.total_amount)}</span>
                    </div>
                  </div>
                  <div className="d-flex gap-2 mb-2">
                    <span
                      className={`badge ${getOrderStatusBadge(
                        order.status
                      )} text-capitalize`}
                    >
                      {order.status}
                    </span>
                    <span
                      className={`badge ${getPaymentStatusBadge(
                        order.payment_status
                      )} text-capitalize`}
                    >
                      {order.payment_status}
                    </span>
                  </div>
                  <div className="text-muted small">
                    <i className="bi bi-calendar me-1"></i>
                    {new Date(order.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {filteredOrders.length > visibleCount && (
          <div className="text-center mt-3">
            <button
              className="btn btn-outline-secondary"
              onClick={() => setVisibleCount((prev) => prev + 10)}
            >
              Load More ({filteredOrders.length - visibleCount} remaining)
            </button>
          </div>
        )}

        {/* No Results */}
        {filteredOrders.length === 0 && (
          <div className="card p-5 text-center">
            <i className="bi bi-inbox fs-1 text-muted"></i>
            <p className="text-muted mt-3">No orders found</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="row g-3 mt-3">
        <div className="col-md-3">
          <div className="card p-3 bg-light">
            <div className="text-muted small">Total Orders</div>
            <div className="fs-4 fw-bold">{filteredOrders.length}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 bg-light">
            <div className="text-muted small">Total Revenue</div>
            <div className="fs-4 fw-bold">
              {formatAmount(
                filteredOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
              )}
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 bg-light">
            <div className="text-muted small">Pending Orders</div>
            <div className="fs-4 fw-bold">
              {filteredOrders.filter((o) => o.status === "pending").length}
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 bg-light">
            <div className="text-muted small">Delivered Orders</div>
            <div className="fs-4 fw-bold">
              {filteredOrders.filter((o) => o.status === "delivered").length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
