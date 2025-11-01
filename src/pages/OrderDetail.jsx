import { useEffect, useState } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import { MdOutlineFileDownload } from "react-icons/md";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import Swal from "sweetalert2";

const OrderDetail = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingStatus, setEditingStatus] = useState(false);
  const [editingPaymentStatus, setEditingPaymentStatus] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch Order Details
  const fetchOrderDetails = () => {
    setLoading(true);
    axiosInstance
      .get(`/orders/${id}`)
      .then((resp) => {
        console.log("Fetched order:", resp.data.data);
        setOrder(resp.data.data);
        setLoading(false);
      })
      .catch((ex) => {
        console.error("Error fetching order:", ex);
        Swal.fire({
          title: "Error!",
          text: "Failed to load order",
          icon: "error",
          confirmButtonText: "OK",
        });
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const handleDeleteOrder = () => {
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
      text: `Do you want to delete order ${order.order_number}? This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleting...",
          text: "Please wait",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        axiosInstance
          .delete(`/orders/${id}`)
          .then(() => {
            Swal.fire({
              title: "Deleted!",
              text: "Order has been deleted",
              icon: "success",
              confirmButtonText: "OK",
              timer: 2000,
            });
            navigate("/orders");
          })
          .catch((ex) => {
            console.error(ex);
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

  const handleUpdateOrderStatus = (newStatus) => {
    axiosInstance
      .put(`/orders/${id}/status`, { status: newStatus })
      .then((resp) => {
        Swal.fire({
          title: "Success!",
          text: "Order status updated successfully",
          icon: "success",
          timer: 1500,
        });
        setOrder({ ...order, status: newStatus });
        setEditingStatus(false);
        fetchOrderDetails();
      })
      .catch((ex) => {
        console.error(ex);
        Swal.fire({
          title: "Error!",
          text: "Failed to update order status",
          icon: "error",
        });
      });
  };

  const handleUpdatePaymentStatus = (newStatus) => {
    axiosInstance
      .put(`/orders/${id}/payment-status`, { payment_status: newStatus })
      .then((resp) => {
        Swal.fire({
          title: "Success!",
          text: "Payment status updated successfully",
          icon: "success",
          timer: 1500,
        });
        setOrder({ ...order, payment_status: newStatus });
        setEditingPaymentStatus(false);
        fetchOrderDetails();
      })
      .catch((ex) => {
        console.error(ex);
        Swal.fire({
          title: "Error!",
          text: "Failed to update payment status",
          icon: "error",
        });
      });
  };

  const getOrderStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return "bg-warning text-dark";
      case "confirmed":
        return "bg-info text-white";
      case "processing":
        return "bg-primary text-white";
      case "shipped":
        return "bg-secondary text-white";
      case "delivered":
        return "bg-success text-white";
      case "cancelled":
        return "bg-danger text-white";
      default:
        return "bg-secondary text-white";
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return "bg-success text-white";
      case "unpaid":
        return "bg-danger text-white";
      case "refunded":
        return "bg-warning text-dark";
      default:
        return "bg-secondary text-white";
    }
  };

  const formatAmount = (amount) => {
    return `Rs. ${(amount / 100).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="container-xxl p-4">
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-xxl p-4">
        <div className="card p-5 text-center">
          <i className="bi bi-inbox fs-1 text-muted"></i>
          <p className="text-muted mt-3">Order not found</p>
        </div>
      </div>
    );
  }

  const orderStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
  const paymentStatuses = ["unpaid", "paid", "refunded"];

  return (
    <div className="container-xxl p-4">
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between bg-light text-dark p-3 rounded-3 border">
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-outline-secondary btn-sm p-1"
            onClick={() => navigate("/orders")}
          >
            <IoChevronBackOutline className="fs-5" />
          </button>
          <div>
            <h5 className="mb-0 fw-semibold">Order Details</h5>
            <small className="text-muted">{order.order_number}</small>
          </div>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm">
            <MdOutlineFileDownload className="me-1" />
            Download
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleDeleteOrder}
          >
            <i className="bi bi-trash me-1"></i>
            Delete
          </button>
        </div>
      </div>

      <div className="row mt-4 g-4">
        {/* Main Content */}
        <div className="col-lg-8">
          {/* Customer Information */}
          <div className="card p-4 mb-3">
            <h6 className="mb-3 text-secondary">Customer Information</h6>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Customer Name</label>
                <div className="border rounded p-2 bg-light">
                  {order.customer_name}
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Phone</label>
                <div className="border rounded p-2 bg-light">
                  {order.customer_phone}
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Email</label>
                <div className="border rounded p-2 bg-light">
                  {order.customer_email || "N/A"}
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Payment Method</label>
                <div className="border rounded p-2 bg-light">
                  {order.payment_method || "N/A"}
                </div>
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">Delivery Address</label>
                <div className="border rounded p-2 bg-light">
                  {order.customer_address}
                </div>
              </div>
              {order.billing_address && (
                <div className="col-12">
                  <label className="form-label fw-semibold">Billing Address</label>
                  <div className="border rounded p-2 bg-light">
                    {order.billing_address}
                    {order.billing_name && (
                      <div className="mt-1 small">
                        <strong>Name:</strong> {order.billing_name}
                        {order.billing_phone && ` | Phone: ${order.billing_phone}`}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {order.note && (
                <div className="col-12">
                  <label className="form-label fw-semibold">Order Notes</label>
                  <div className="border rounded p-2 bg-light">
                    {order.note}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="card p-4">
            <h6 className="mb-3 text-secondary">Order Items</h6>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="bg-light">
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item, index) => (
                    <tr key={index}>
                      <td className="fw-semibold">{item.product_name}</td>
                      <td className="text-muted">{item.product_sku || "N/A"}</td>
                      <td>{formatAmount(item.product_price)}</td>
                      <td>{item.quantity}</td>
                      <td className="fw-semibold">{formatAmount(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-top">
                  <tr>
                    <td colSpan="3" className="text-end fw-semibold">
                      Total Items:
                    </td>
                    <td className="fw-bold">{order.total_items}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colSpan="4" className="text-end fw-semibold">
                      Grand Total:
                    </td>
                    <td className="fw-bold fs-5">{formatAmount(order.total_amount)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          {/* Order Status */}
          <div className="card p-3 mb-3" style={{ backgroundColor: "#f8f9fa" }}>
            <h6 className="mb-3 text-secondary">Order Status</h6>
            <div className="mb-3">
              <label className="form-label fw-semibold">Current Status</label>
              {editingStatus ? (
                <div>
                  <select
                    className="form-select mb-2"
                    value={order.status}
                    onChange={(e) => handleUpdateOrderStatus(e.target.value)}
                  >
                    {orderStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => setEditingStatus(false)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="d-flex justify-content-between align-items-center">
                  <span
                    className={`badge ${getOrderStatusBadge(order.status)} text-capitalize`}
                    style={{ fontSize: "14px", padding: "8px 12px" }}
                  >
                    {order.status}
                  </span>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setEditingStatus(true)}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Payment Status</label>
              {editingPaymentStatus ? (
                <div>
                  <select
                    className="form-select mb-2"
                    value={order.payment_status}
                    onChange={(e) => handleUpdatePaymentStatus(e.target.value)}
                  >
                    {paymentStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => setEditingPaymentStatus(false)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="d-flex justify-content-between align-items-center">
                  <span
                    className={`badge ${getPaymentStatusBadge(
                      order.payment_status
                    )} text-capitalize`}
                    style={{ fontSize: "14px", padding: "8px 12px" }}
                  >
                    {order.payment_status}
                  </span>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setEditingPaymentStatus(true)}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                </div>
              )}
            </div>

            {order.confirmed_at && (
              <div className="mb-2">
                <small className="text-muted">Confirmed at:</small>
                <div className="small">
                  {new Date(order.confirmed_at).toLocaleString()}
                </div>
              </div>
            )}
            {order.delivered_at && (
              <div className="mb-2">
                <small className="text-muted">Delivered at:</small>
                <div className="small">
                  {new Date(order.delivered_at).toLocaleString()}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="card p-3 mb-3">
            <h6 className="mb-3 text-secondary">Order Summary</h6>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Order Number:</span>
              <span className="fw-semibold">{order.order_number}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Order Date:</span>
              <span>{new Date(order.created_at).toLocaleDateString()}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Total Items:</span>
              <span className="fw-semibold">{order.total_items}</span>
            </div>
            <div className="d-flex justify-content-between mb-2 border-top pt-2">
              <span className="fw-bold">Grand Total:</span>
              <span className="fw-bold fs-5">{formatAmount(order.total_amount)}</span>
            </div>
          </div>

          {/* Organization Info */}
          {order.organization && (
            <div className="card p-3">
              <h6 className="mb-3 text-secondary">Organization</h6>
              <div className="text-muted small">
                {order.organization.business_name}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
