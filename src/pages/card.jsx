import React, { useEffect } from "react";
import { db } from "../firebase";
import { addDoc, getDocs, collection, doc } from "firebase/firestore";
import { useState } from "react";
import CustomerCard from "../ui/customer-card";
import CustomerForm from "./add-customer";
import axiosInstance from "../axiosConfig";
import Swal from "sweetalert2";

function CardPage() {
  const [selectedCustomer, setSelectedCustomer] = useState();
  const [showAddCustomerForm, setShowAddCustomerForm] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [paymentReceived, setPaymentReceived] = useState(false);

  console.log(showAddCustomerForm);

  const items = [
    { id: 1, name: "Notebook" },
    { id: 2, name: "T-shirt", variants: ["Small", "Medium", "Large"] },
    { id: 3, name: "Pen" },
    { id: 4, name: "Coffee", variants: ["Hot", "Cold", "Iced"] },
  ];

  const getCustomersFromFirebase = async () => {
    console.log("Fetch Info from API");
    axiosInstance.get("/customers").then((resp) => {
      // console.log(resp.data.data.data);
      setCustomerData(resp.data.data.data);
    });
  };
  const [customerData, setCustomerData] = useState([]);
  useEffect(() => {
    getCustomersFromFirebase();
  }, []);

  const handleCustomerSelection = (customerInfo) => {
    setSelectedCustomer(customerInfo);
    setFormData((prev) => ({
      ...prev,
      ["selectedCustomerName"]: customerInfo.customername, // overwrites only that key safely
      ["selectedCustomerId"]: customerInfo.id, // overwrites only that key safely
    }));
    console.log(customerInfo);
  };

  const [formData, setFormData] = useState({
    customername: "",
    mobileno: "",
    address: "",
    date: "",
    dueDate: "",
    referenceNo: "",
    notes: "",
    Discount: 0,
    Tax: 0,
    Shipping: 0,
    SubTotal: 0,
    GrandTotal: 0,
    InvoiceNo: "",
    PaidAmount: 0,
    paymentMethod: "cash",
    receiptNo: "",
    paymentNote: "",
    fields: [
      {
        sn: "",
        name: "",
        quantity: "",
        rate: "",
        amount: "",
      },
    ],
  });

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = formData.fields.reduce((sum, field) => {
      return (
        sum + (parseFloat(field.quantity) || 0) * (parseFloat(field.rate) || 0)
      );
    }, 0);

    const discount = parseFloat(formData.Discount) || 0;
    const shipping = parseFloat(formData.Shipping) || 0;
    const taxPercent = parseFloat(formData.Tax) || 0;

    const afterDiscount = subtotal - discount;
    const taxAmount = (afterDiscount * taxPercent) / 100;
    const grandTotal = afterDiscount + taxAmount + shipping;

    return {
      subtotal: subtotal.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
      remaining: paymentReceived
        ? (grandTotal - (parseFloat(formData.PaidAmount) || 0)).toFixed(2)
        : grandTotal.toFixed(2),
    };
  };

  const totals = calculateTotals();

  const handleCallbackFromCustomerCreation = (callbackCustomerInfo) => {
    console.log("Handling Callback", callbackCustomerInfo);
    getCustomersFromFirebase();
  };

  const handleAddField = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      fields: [
        ...prevFormData.fields,
        { sn: "", name: "", quantity: "", rate: "", amount: "" }, // new field appended
      ],
    }));
  };

  const handleRemoveField = (indexToRemove) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      fields: prevFormData.fields.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleFilter = (e) => {
    console.log("Handling Filters", e.target.value);

    const lowerSearch = e.target.value.toLowerCase();

    setFilteredCustomers(
      customerData.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerSearch) ||
          // || item.address.toLowerCase().includes(lowerSearch)
          item.phone.includes(lowerSearch)
      )
    );
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;

    // console.log(name, value, e, index)
    // if index is provided, we are editing a nested field
    if (index !== undefined) {
      setFormData((prev) => {
        const updatedFields = [...prev.fields];
        updatedFields[index] = {
          ...updatedFields[index],
          [name]: value,
        };
        return {
          ...prev,
          fields: updatedFields,
        };
      });
    } else {
      // otherwise, it's a top-level field
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const clearForm = () => {
    setFormData({
      customername: "",
      mobileno: "",
      address: "",
      date: "",
      dueDate: "",
      referenceNo: "",
      notes: "",
      Discount: 0,
      Tax: 0,
      Shipping: 0,
      SubTotal: 0,
      GrandTotal: 0,
      InvoiceNo: "",
      PaidAmount: 0,
      paymentMethod: "cash",
      receiptNo: "",
      paymentNote: "",
      fields: [
        {
          sn: "",
          name: "",
          quantity: "",
          rate: "",
          amount: "",
        },
      ],
    });
    setSelectedCustomer(null);
    setPaymentReceived(false);
  };

  function saveform() {
    // Validation
    if (!formData.selectedCustomerId) {
      Swal.fire({
        title: "Validation Error",
        text: "Please select a customer",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!formData.InvoiceNo) {
      Swal.fire({
        title: "Validation Error",
        text: "Please enter an invoice number",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!formData.date) {
      Swal.fire({
        title: "Validation Error",
        text: "Please select an invoice date",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    // Check if there are items
    const hasItems = formData.fields.some(
      (field) => field.name && field.quantity && field.rate
    );
    if (!hasItems) {
      Swal.fire({
        title: "Validation Error",
        text: "Please add at least one item to the invoice",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    // Calculate totals
    const calculatedTotals = calculateTotals();
    const grandTotal = parseFloat(calculatedTotals.grandTotal);

    // Validate payment amount if payment is received
    if (paymentReceived && parseFloat(formData.PaidAmount) > grandTotal) {
      Swal.fire({
        title: "Validation Error",
        text: "Paid amount cannot exceed the grand total",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    // Prepare invoice data
    let invoiceData = {
      invoice_no: formData.InvoiceNo,
      customer_id: formData.selectedCustomerId,
      date: formData.date,
      subtotal: parseFloat(calculatedTotals.subtotal),
      discount: parseFloat(formData.Discount) || 0,
      tax: parseFloat(formData.Tax) || 0,
      grand_total: grandTotal,
      invoice_items: [],
    };

    // Add items
    formData.fields.forEach((field, index) => {
      if (field.name && field.quantity && field.rate) {
        invoiceData.invoice_items.push({
          item: field.name,
          quantity: parseFloat(field.quantity),
          rate: parseFloat(field.rate),
          total: parseFloat(field.quantity) * parseFloat(field.rate),
        });
      }
    });

    // Show loading
    Swal.fire({
      title: "Saving...",
      text: "Please wait while we process your invoice",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // Create invoice first
    axiosInstance
      .post("/sales-invoices", invoiceData)
      .then((invoiceResp) => {
        console.log("Invoice created:", invoiceResp);
        const invoiceId = invoiceResp.data?.data?.id || invoiceResp.data?.id;

        // If payment is received, create payment receipt
        if (paymentReceived && parseFloat(formData.PaidAmount) > 0) {
          const paymentData = {
            receipt_no: formData.receiptNo || `REC-${formData.InvoiceNo}`,
            amount: parseFloat(formData.PaidAmount),
            title: `Payment for Invoice ${formData.InvoiceNo}`,
            sales_invoice_id: invoiceId,
            customer_id: formData.selectedCustomerId,
            date: formData.date,
            note: formData.paymentNote || "",
            payment_method: formData.paymentMethod,
          };

          return axiosInstance
            .post("/payment-receipts", paymentData)
            .then((paymentResp) => {
              console.log("Payment receipt created:", paymentResp);
              return { invoice: invoiceResp, payment: paymentResp };
            });
        }

        return { invoice: invoiceResp, payment: null };
      })
      .then((result) => {
        Swal.fire({
          title: "Success!",
          html:
            paymentReceived && result.payment
              ? `Sales invoice and payment receipt created successfully!<br><small>Invoice: ${formData.InvoiceNo}<br>Payment: ${formData.PaidAmount}</small>`
              : `Sales invoice created successfully!<br><small>Invoice: ${formData.InvoiceNo}</small>`,
          icon: "success",
          confirmButtonText: "OK",
          timer: 3000,
          timerProgressBar: true,
        });
        clearForm();
      })
      .catch((error) => {
        console.error("Error:", error);

        let errorMessage = "Failed to create invoice";

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
  }

  return (
    <>
      {/* Header Section */}
      <div className="d-flex flex-wrap align-items-center justify-content-between bg-light text-dark p-3 rounded-3 border mb-4">
        <div className="d-flex align-items-center gap-3">
          <h5 className="mb-0">Sales Return</h5>
        </div>
      </div>

      {/* Main Card */}
      <div className="card p-3">
        <div className="row g-3">
          {/* Left Column - Customer Details */}
          <div className="col-md-6 border-end">
            <h6 className="mb-3 text-secondary">Customer Information</h6>

            {/* Customer Search */}
            <div
              className="mb-3"
              style={{ display: selectedCustomer ? "none" : "block" }}
            >
              <label className="form-label fw-semibold small">
                Search Customer
              </label>
              <div className="position-relative">
                <input
                  type="text"
                  name="customername"
                  autoComplete="false"
                  aria-autocomplete="false"
                  value={formData.customername}
                  className="form-control"
                  placeholder="Type customer name to search..."
                  onChange={(e) => {
                    handleChange(e), handleFilter(e);
                  }}
                />
                <div
                  className={
                    formData.customername
                      ? "position-absolute w-100 p-2 bg-white shadow rounded-3 mt-1"
                      : "d-none"
                  }
                  style={{ zIndex: 100 }}
                >
                  {filteredCustomers.map((customerInfo) => (
                    <CustomerCard
                      key={customerInfo.name}
                      handler={handleCustomerSelection}
                      onClick={() => handleCustomerSelection(customerInfo)}
                      customerInfo={customerInfo}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowAddCustomerForm(true)}
                    className="add-more-btn form-control"
                  >
                    + Add New Customer
                  </button>
                </div>
              </div>
            </div>

            {/* Selected Customer Card */}
            <div style={{ display: !selectedCustomer ? "none" : "block" }}>
              <div className="card bg-white   border-2 shadow-sm border-dark rounded-3">
                <div className="card-body p-2">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <h6 className="mb-0 fw-bold text-dark small">
                        {selectedCustomer?.name}
                      </h6>
                      <span
                        className="badge bg-primary-subtle text-primary"
                        style={{ fontSize: "0.7rem" }}
                      >
                        Customer
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-dark py-1 px-2"
                      style={{ fontSize: "0.75rem" }}
                      onClick={() => setSelectedCustomer()}
                    >
                      Change
                    </button>
                  </div>

                  <div className="d-flex gap-3 mt-2">
                    <div className="d-flex align-items-start flex-fill">
                      <i
                        className="bi bi-geo-alt text-muted me-1"
                        style={{ fontSize: "0.85rem" }}
                      ></i>
                      <span className="small text-muted">
                        {selectedCustomer?.address || "N/A"}
                      </span>
                    </div>

                    <div className="d-flex align-items-start">
                      <i
                        className="bi bi-telephone text-muted me-1"
                        style={{ fontSize: "0.85rem" }}
                      ></i>
                      <span className="small text-muted">
                        {selectedCustomer?.mobileno || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Invoice Details */}
          <div className="col-md-6">
            <h6 className="mb-3 text-secondary">Invoice Details</h6>

            <div className="row g-2">
              <div className="col-6">
                <label className="form-label fw-semibold small mb-1">
                  Invoice No
                </label>
                <input
                  type="text"
                  name="InvoiceNo"
                  value={formData.InvoiceNo}
                  className="form-control form-control-sm"
                  placeholder="INV-0001"
                  onChange={handleChange}
                />
              </div>

              <div className="col-6">
                <label className="form-label fw-semibold small mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  className="form-control form-control-sm"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="mt-3">
          <div className="table-responsive">
            <table className="table table-sm">
              <thead>
                <tr className="text-muted small">
                  <th style={{ width: "5%" }}>SN</th>
                  <th style={{ width: "35%" }}>Item Description</th>
                  <th style={{ width: "15%" }}>Qty</th>
                  <th style={{ width: "15%" }}>Rate</th>
                  <th style={{ width: "20%" }}>Amount</th>
                  <th style={{ width: "5%" }}></th>
                </tr>
              </thead>
              <tbody>
                {formData.fields.map((field, index) => (
                  <tr key={index}>
                    <td className="align-middle small">{index + 1}</td>
                    <td className="relative">
                      <input
                        type="text"
                        name="name"
                        value={field.name}
                        className="form-control form-control-sm "
                        placeholder="Item name"
                        onChange={(e) => handleChange(e, index)}
                      />
                      {items.length > 0 && (
                        <div className="absolute left-0 right-0  mt-1 bg-white border border-gray-300 rounded-md shadow-md z-100">
                          {items.map((item, index) => (
                            <div
                              key={index}
                              className={`px-3 flex items-center gap-2 py-2 cursor-pointer`}
                            >
                              <div className="d-flex justify-content-start align-items-center gap-2 ">
                                <div
                                  className="cursor-pointer"
                                  style={{
                                    width: "45px",
                                    height: "45px",
                                    background: "rgba(0,0,0,0.1)",
                                    borderRadius: "10px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                ></div>
                                <div className="d-flex flex-column m-0 p-0 cursor-pointer">
                                  <h6 className="mb-0 capitalize  ">
                                    {item.name}
                                  </h6>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>

                    <td>
                      <input
                        type="number"
                        name="quantity"
                        value={field.quantity}
                        className="form-control form-control-sm"
                        placeholder="0"
                        onChange={(e) => handleChange(e, index)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="rate"
                        value={field.rate}
                        className="form-control form-control-sm"
                        placeholder="0.00"
                        onChange={(e) => handleChange(e, index)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="amount"
                        value={field.quantity * field.rate || ""}
                        className="form-control form-control-sm bg-light"
                        placeholder="0.00"
                        readOnly
                      />
                    </td>
                    <td className="align-middle">
                      <button
                        type="button"
                        className="btn btn-sm p-0 text-danger"
                        onClick={() => handleRemoveField(index)}
                      >
                        <i className="bi bi-x fs-5"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ADD FIELD */}
          <button className="add-more-btn w-100" onClick={handleAddField}>
            Add More Item
          </button>
        </div>

        {/* Payment Toggle */}
        <div className="mt-3 border-top pt-3">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="paymentReceivedToggle"
              checked={paymentReceived}
              onChange={(e) => setPaymentReceived(e.target.checked)}
            />
            <label
              className="form-check-label fw-semibold"
              htmlFor="paymentReceivedToggle"
            >
              Payment Received?
            </label>
          </div>
        </div>
      </div>
      {/* Footer with Totals */}
      <div className="d-flex gap-3 mt-3">
        {/* Actions */}
        <div className="flex-fill d-flex align-items-start">
          <button
            className="btn btn-primary px-4 py-2 rounded-3"
            onClick={saveform}
          >
            Save Invoice
          </button>
        </div>

        {/* Totals Card */}
        <div
          className="card p-3"
          style={{ width: "350px", backgroundColor: "#f8f9fa" }}
        >
          <div className="row g-2">
            <div className="col-6">
              <label className="form-label fw-semibold small mb-1">
                Discount
              </label>
              <input
                type="number"
                name="Discount"
                value={formData.Discount}
                className="form-control form-control-sm"
                placeholder="0.00"
                onChange={(e) => handleChange(e)}
              />
            </div>

            <div className="col-6">
              <label className="form-label fw-semibold small mb-1">
                Shipping
              </label>
              <input
                type="number"
                name="Shipping"
                value={formData.Shipping}
                className="form-control form-control-sm"
                placeholder="0.00"
                onChange={(e) => handleChange(e)}
              />
            </div>

            <div className="col-6">
              <label className="form-label fw-semibold small mb-1">
                Tax (%)
              </label>
              <input
                type="number"
                name="Tax"
                value={formData.Tax}
                className="form-control form-control-sm"
                placeholder="0"
                onChange={(e) => handleChange(e)}
              />
            </div>

            <div className="col-6">
              <label className="form-label fw-semibold small mb-1">
                Subtotal
              </label>
              <input
                type="number"
                value={totals.subtotal}
                className="form-control form-control-sm bg-white"
                readOnly
              />
            </div>

            <div className="col-12 border-top pt-2 mt-2">
              <label className="form-label fw-bold small mb-1">
                Grand Total
              </label>
              <input
                type="number"
                value={totals.grandTotal}
                className="form-control form-control-sm fw-bold bg-white"
                readOnly
                style={{ fontSize: "1rem" }}
              />
            </div>

            {/* Payment Section */}
            {paymentReceived && (
              <>
                <div className="col-12 border-top pt-2 mt-2">
                  <label className="form-label fw-semibold small mb-1">
                    Receipt No
                  </label>
                  <input
                    type="text"
                    name="receiptNo"
                    value={formData.receiptNo}
                    className="form-control form-control-sm"
                    placeholder={`REC-${formData.InvoiceNo || "001"}`}
                    onChange={(e) => handleChange(e)}
                  />
                </div>

                <div className="col-6">
                  <label className="form-label fw-semibold small mb-1 text-success">
                    Paid Amount
                  </label>
                  <input
                    type="number"
                    name="PaidAmount"
                    value={formData.PaidAmount}
                    className="form-control form-control-sm"
                    placeholder="0.00"
                    onChange={(e) => handleChange(e)}
                  />
                </div>

                <div className="col-6">
                  <label className="form-label fw-semibold small mb-1">
                    Payment Method
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    className="form-select form-select-sm"
                    onChange={(e) => handleChange(e)}
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

                <div className="col-12">
                  <label className="form-label fw-semibold small mb-1">
                    Payment Note
                  </label>
                  <textarea
                    name="paymentNote"
                    value={formData.paymentNote}
                    className="form-control form-control-sm"
                    rows="2"
                    placeholder="Add payment notes..."
                    onChange={(e) => handleChange(e)}
                  ></textarea>
                </div>

                <div className="col-12">
                  <label className="form-label fw-bold small mb-1 text-danger">
                    Remaining
                  </label>
                  <input
                    type="number"
                    value={totals.remaining}
                    className="form-control form-control-sm fw-bold bg-white"
                    readOnly
                    style={{ fontSize: "1rem" }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {showAddCustomerForm && (
        <CustomerForm
          setShowAddCustomerForm={setShowAddCustomerForm}
          handleCallbackFromCustomerCreation={
            handleCallbackFromCustomerCreation
          }
        />
      )}
    </>
  );
}

export default CardPage;
