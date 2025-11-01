import { useEffect, useState } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import { MdOutlineFileDownload } from "react-icons/md";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import Swal from "sweetalert2";
import AddPurchasePayment from "./AddPurchasePayment";

const PurchaseInvoiceDetail = () => {
  const [invoice, setInvoice] = useState(null);
  const [paymentReceipts, setPaymentReceipts] = useState([]);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch Invoice Details
  const fetchInvoiceDetails = () => {
    setLoading(true);
    axiosInstance
      .get(`/purchase-invoices/${id}`)
      .then((resp) => {
        console.log("Fetched purchase invoice:", resp.data.data);
        setInvoice(resp.data.data);
        setLoading(false);
      })
      .catch((ex) => {
        console.error("Error fetching invoice:", ex);
        Swal.fire({
          title: "Error!",
          text: "Failed to load purchase invoice",
          icon: "error",
          confirmButtonText: "OK",
        });
        setLoading(false);
      });
  };

  // Fetch Payment Receipts
  const fetchPaymentReceipts = () => {
    axiosInstance
      .get(`/purchase-payment-receipts?purchase_invoice_id=${id}`)
      .then((resp) => {
        console.log("Fetched payment receipts:", resp.data.data);
        setPaymentReceipts(resp.data.data.data || []);
      })
      .catch((ex) => {
        console.error("Error fetching payments:", ex);
      });
  };

  useEffect(() => {
    fetchInvoiceDetails();
    fetchPaymentReceipts();
  }, [id]);

  const handleDeleteInvoice = () => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete purchase invoice ${invoice.invoice_no}? This action cannot be undone!`,
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
          .delete(`/purchase-invoices/${id}`)
          .then(() => {
            Swal.fire({
              title: "Deleted!",
              text: "Purchase invoice has been deleted",
              icon: "success",
              confirmButtonText: "OK",
              timer: 2000,
            });
            navigate("/purchase-invoices");
          })
          .catch((ex) => {
            console.error(ex);
            Swal.fire({
              title: "Error!",
              text: "Failed to delete purchase invoice",
              icon: "error",
              confirmButtonText: "OK",
            });
          });
      }
    });
  };

  const handleDeletePayment = (receiptId, receiptNo) => {
    Swal.fire({
      title: "Delete Payment?",
      text: `Do you want to delete payment receipt ${receiptNo}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosInstance
          .delete(`/purchase-payment-receipts/${receiptId}`)
          .then(() => {
            Swal.fire({
              title: "Deleted!",
              text: "Payment receipt has been deleted",
              icon: "success",
              timer: 2000,
            });
            fetchInvoiceDetails(); // Refresh to update payment status
            fetchPaymentReceipts();
          })
          .catch((ex) => {
            console.error(ex);
            Swal.fire({
              title: "Error!",
              text: "Failed to delete payment receipt",
              icon: "error",
            });
          });
      }
    });
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return "bg-success text-white";
      case "unpaid":
        return "bg-danger text-white";
      case "partial":
        return "bg-warning text-dark";
      default:
        return "bg-secondary text-white";
    }
  };

  const calculateTotalPaid = () => {
    return paymentReceipts.reduce(
      (sum, receipt) => sum + parseFloat(receipt.amount || 0),
      0
    );
  };

  const calculateRemaining = () => {
    const total = parseFloat(invoice?.grand_total || 0);
    const paid = calculateTotalPaid();
    return total - paid;
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading invoice details...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-exclamation-triangle fs-1 text-warning"></i>
        <p className="mt-3">Invoice not found</p>
        <Link to="/purchase-invoices" className="btn btn-primary">
          Back to Invoices
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Header Section */}
      <div className="d-flex flex-wrap align-items-center justify-content-between bg-light text-dark p-3 rounded-3 border mb-4">
        <div className="d-flex align-items-center gap-3">
          <Link to="/purchase-invoices">
            <button className="btn btn-outline-secondary btn-sm p-1">
              <IoChevronBackOutline className="fs-5" />
            </button>
          </Link>
          <h5 className="mb-0">Purchase Invoice #{invoice.invoice_no}</h5>
          <span
            className={`badge ${getPaymentStatusBadge(invoice.payment_status)}`}
          >
            {invoice.payment_status
              ? invoice.payment_status.charAt(0).toUpperCase() +
                invoice.payment_status.slice(1)
              : "Unpaid"}
          </span>
        </div>
        <div className="d-flex gap-2">
          <button
            onClick={() => setShowAddPayment(true)}
            className="btn btn-success btn-sm"
            disabled={invoice.payment_status === "paid"}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add Payment
          </button>
          <button
            onClick={handleDeleteInvoice}
            className="btn btn-outline-danger btn-sm"
          >
            <i className="bi bi-trash me-2"></i>
            Delete
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="row g-4">
        {/* Left Column - Invoice Details */}
        <div className="col-lg-8">
          {/* Supplier Info Card */}
          <div className="card mb-4">
            <div className="card-body">
              <h6 className="text-secondary mb-3">Supplier Information</h6>
              <div className="row">
                <div className="col-md-6">
                  <p className="mb-2">
                    <strong>Name:</strong> {invoice.supplier?.name || "N/A"}
                  </p>
                  <p className="mb-2">
                    <strong>Email:</strong> {invoice.supplier?.email || "N/A"}
                  </p>
                </div>
                <div className="col-md-6">
                  <p className="mb-2">
                    <strong>Phone:</strong> {invoice.supplier?.phone || "N/A"}
                  </p>
                  <p className="mb-2">
                    <strong>Address:</strong>{" "}
                    {invoice.supplier?.address || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="card mb-4">
            <div className="card-body">
              <h6 className="text-secondary mb-3">Invoice Items</h6>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Item</th>
                      <th className="text-end">Quantity</th>
                      <th className="text-end">Rate</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.invoice_items?.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <strong>{item.item}</strong>
                          {item.note && (
                            <small className="d-block text-muted">
                              {item.note}
                            </small>
                          )}
                        </td>
                        <td className="text-end">
                          {item.quantity} {item.unit || ""}
                        </td>
                        <td className="text-end">Rs. {item.rate}</td>
                        <td className="text-end">
                          <strong>Rs. {item.total}</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="text-secondary mb-0">Payment History</h6>
                <button
                  onClick={() => setShowAddPayment(true)}
                  className="btn btn-sm btn-outline-success"
                  disabled={invoice.payment_status === "paid"}
                >
                  <i className="bi bi-plus-circle me-1"></i>
                  Add Payment
                </button>
              </div>

              {paymentReceipts.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead className="table-light">
                      <tr>
                        <th>Receipt No</th>
                        <th>Date</th>
                        <th>Method</th>
                        <th className="text-end">Amount</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentReceipts.map((receipt) => (
                        <tr key={receipt.id}>
                          <td>
                            <strong>{receipt.receipt_no}</strong>
                            {receipt.note && (
                              <small className="d-block text-muted">
                                {receipt.note}
                              </small>
                            )}
                          </td>
                          <td>{receipt.date?.slice(0, 10) || "N/A"}</td>
                          <td>
                            <span className="badge bg-light text-dark">
                              {receipt.payment_method || "N/A"}
                            </span>
                          </td>
                          <td className="text-end">
                            <strong>Rs. {receipt.amount}</strong>
                          </td>
                          <td className="text-center">
                            <button
                              onClick={() =>
                                handleDeletePayment(
                                  receipt.id,
                                  receipt.receipt_no
                                )
                              }
                              className="btn btn-sm btn-outline-danger"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4 text-muted">
                  <i className="bi bi-receipt fs-3"></i>
                  <p className="mb-0 mt-2">No payments recorded yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Summary */}
        <div className="col-lg-4">
          {/* Invoice Summary */}
          <div className="card mb-4" style={{ backgroundColor: "#f8f9fa" }}>
            <div className="card-body">
              <h6 className="text-secondary mb-3">Invoice Summary</h6>

              <div className="d-flex justify-content-between mb-2">
                <span>Invoice No:</span>
                <strong>{invoice.invoice_no}</strong>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Date:</span>
                <strong>{invoice.date?.slice(0, 10) || "N/A"}</strong>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Status:</span>
                <span
                  className={`badge ${getPaymentStatusBadge(
                    invoice.payment_status
                  )}`}
                >
                  {invoice.payment_status
                    ? invoice.payment_status.charAt(0).toUpperCase() +
                      invoice.payment_status.slice(1)
                    : "Unpaid"}
                </span>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>Rs. {invoice.subtotal || 0}</span>
              </div>

              {invoice.discount > 0 && (
                <div className="d-flex justify-content-between mb-2 text-danger">
                  <span>Discount:</span>
                  <span>- Rs. {invoice.discount}</span>
                </div>
              )}

              {invoice.tax > 0 && (
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax:</span>
                  <span>Rs. {invoice.tax}</span>
                </div>
              )}

              {invoice.shipping > 0 && (
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <span>Rs. {invoice.shipping}</span>
                </div>
              )}

              <hr />

              <div className="d-flex justify-content-between mb-3">
                <strong className="fs-5">Grand Total:</strong>
                <strong className="fs-5">
                  Rs. {invoice.grand_total || 0}
                </strong>
              </div>

              <div className="d-flex justify-content-between mb-2 text-success">
                <span>Total Paid:</span>
                <strong>Rs. {calculateTotalPaid().toFixed(2)}</strong>
              </div>

              <div className="d-flex justify-content-between">
                <span className="text-danger">
                  <strong>Remaining:</strong>
                </span>
                <strong className="text-danger">
                  Rs. {calculateRemaining().toFixed(2)}
                </strong>
              </div>

              {invoice.note && (
                <>
                  <hr />
                  <div>
                    <small className="text-muted">Note:</small>
                    <p className="mb-0 small">{invoice.note}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Payment Modal */}
      {showAddPayment && (
        <AddPurchasePayment
          invoice={invoice}
          setShowAddPayment={setShowAddPayment}
          onPaymentAdded={() => {
            fetchInvoiceDetails();
            fetchPaymentReceipts();
          }}
        />
      )}
    </>
  );
};

export default PurchaseInvoiceDetail;
