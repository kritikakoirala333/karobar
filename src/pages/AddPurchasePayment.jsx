import React, { useState } from "react";
import axiosInstance from "../axiosConfig";
import Swal from "sweetalert2";

function AddPurchasePayment({ invoice, setShowAddPayment, onPaymentAdded }) {
  const [formData, setFormData] = useState({
    receipt_no: `PREC-${invoice.invoice_no}`,
    amount: "",
    payment_method: "cash",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const calculateRemaining = () => {
    const grandTotal = parseFloat(invoice.grand_total || 0);
    return grandTotal;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const remaining = calculateRemaining();
    const paymentAmount = parseFloat(formData.amount);

    // Validation
    if (!formData.receipt_no) {
      Swal.fire({
        title: "Validation Error",
        text: "Please enter a receipt number",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!formData.amount || paymentAmount <= 0) {
      Swal.fire({
        title: "Validation Error",
        text: "Please enter a valid payment amount",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (paymentAmount > remaining) {
      Swal.fire({
        title: "Validation Error",
        text: `Payment amount cannot exceed the remaining balance (Rs. ${remaining.toFixed(
          2
        )})`,
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    // Show loading
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we record the payment",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // Create payment receipt
    axiosInstance
      .post("/purchase-payment-receipts", {
        receipt_no: formData.receipt_no,
        amount: paymentAmount,
        title: `Payment for Purchase Invoice ${invoice.invoice_no}`,
        purchase_invoice_id: invoice.id,
        supplier_id: invoice.supplier_id,
        date: formData.date,
        note: formData.note,
        payment_method: formData.payment_method,
      })
      .then((resp) => {
        console.log("Payment receipt created:", resp.data);
        Swal.fire({
          title: "Success!",
          text: "Payment receipt created successfully!",
          icon: "success",
          confirmButtonText: "OK",
          timer: 2000,
          timerProgressBar: true,
        });
        setShowAddPayment(false);
        if (onPaymentAdded) {
          onPaymentAdded();
        }
      })
      .catch((error) => {
        console.error("Error:", error);

        let errorMessage = "Failed to create payment receipt";
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.data?.errors) {
          const errors = error.response.data.errors;
          errorMessage = Object.values(errors).flat().join(", ");
        } else if (error.message) {
          errorMessage = error.message;
        }

        Swal.fire({
          title: "Error!",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1050 }}
    >
      <div
        className="bg-white p-4 rounded-4 shadow-lg"
        style={{ width: "500px", maxHeight: "90vh", overflowY: "auto" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Add Payment</h4>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowAddPayment(false)}
          ></button>
        </div>

        {/* Invoice Info */}
        <div className="alert alert-info mb-3">
          <div className="d-flex justify-content-between">
            <div>
              <strong>Invoice:</strong> {invoice.invoice_no}
            </div>
            <div>
              <strong>Supplier:</strong> {invoice.supplier?.name}
            </div>
          </div>
          <div className="d-flex justify-content-between mt-2">
            <div>
              <strong>Total:</strong> Rs. {invoice.grand_total}
            </div>
            <div className="text-danger">
              <strong>Remaining:</strong> Rs. {calculateRemaining().toFixed(2)}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Receipt Number *</label>
            <input
              type="text"
              className="form-control"
              name="receipt_no"
              value={formData.receipt_no}
              onChange={handleChange}
              placeholder="PREC-001"
              required
            />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Amount *</label>
              <input
                type="number"
                className="form-control"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                max={calculateRemaining()}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Date *</label>
              <input
                type="date"
                className="form-control"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Payment Method *</label>
            <select
              className="form-select"
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              required
            >
              <option value="cash">Cash</option>
              <option value="check">Check</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="online">Online</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Note</label>
            <textarea
              className="form-control"
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Add any notes about this payment..."
              rows="3"
            />
          </div>

          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowAddPayment(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-success">
              <i className="bi bi-check-circle me-2"></i>
              Record Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPurchasePayment;
