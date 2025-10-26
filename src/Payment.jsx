import React, { useState, useEffect } from "react";
import { salesInvoiceState } from "./store/salesInvoiceState";
import axiosInstance from "./axiosConfig";
import F1SoftLogo from "./assets/fonepay.png";

export default function Payment({ show, setShowPaymentSlide }) {
  const { salesInvoices } = salesInvoiceState();
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState("");
  const [paymentDescription, setPaymentDescription] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [paymentType, setPaymentType] = useState("Cash");
  const [showQR, setShowQR] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  // Search states
  const [customerSearch, setCustomerSearch] = useState("");
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showInvoiceDropdown, setShowInvoiceDropdown] = useState(false);

  // Additional fields
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentStatus, setPaymentStatus] = useState("Completed");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [checkNumber, setCheckNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [partialPayment, setPartialPayment] = useState(false);
  const [invoiceTotal, setInvoiceTotal] = useState("");
  const [dueAmount, setDueAmount] = useState("");

  useEffect(() => {
    axiosInstance
      .get("/customers")
      .then((response) => {
        setCustomers(response.data.data.data);
      })
      .catch((error) => {
        console.error("Error fetching customers:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedInvoice) {
      const invoice = salesInvoices.find((inv) => inv.id === selectedInvoice);
      if (invoice) {
        const total = invoice.total || invoice.amount || "";
        setInvoiceTotal(total);
        setTotalAmount(total);
        setDueAmount(total);
      }
    }
  }, [selectedInvoice, salesInvoices]);

  // Calculate due amount
  useEffect(() => {
    if (invoiceTotal && totalAmount) {
      const due = parseFloat(invoiceTotal) - parseFloat(totalAmount);
      setDueAmount(due > 0 ? due : 0);
    }
  }, [invoiceTotal, totalAmount]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const paymentData = {
      customerId: selectedCustomer,
      invoiceId: selectedInvoice,
      description: paymentDescription,
      amount: totalAmount,
      paymentType: paymentType,
      paymentDate: paymentDate,
      status: paymentStatus,
      referenceNumber: referenceNumber,
      receiptNumber: receiptNumber,
      transactionId: transactionId,
      checkNumber: checkNumber,
      bankName: bankName,
      accountNumber: accountNumber,
      notes: notes,
      partialPayment: partialPayment,
      dueAmount: dueAmount,
      createdAt: new Date().toISOString(),
    };
    console.log("Payment Data:", paymentData);
    // TODO: Submit payment data to API
    alert("Payment recorded successfully!");
    setShowPaymentSlide(false);
  };

  const paymentTypes = ["Cash", "Online", "Check", "eSewa", "Khalti", "Bank Transfer"];

  // Filter customers based on search
  const filteredCustomers = customers.filter((customer) => {
    const searchLower = customerSearch.toLowerCase();
    return (
      customer.name?.toLowerCase().includes(searchLower) ||
      customer.address?.toLowerCase().includes(searchLower) ||
      customer.phone?.toLowerCase().includes(searchLower)
    );
  });

  // Filter invoices based on search
  const filteredInvoices = salesInvoices.filter((invoice) => {
    const searchLower = invoiceSearch.toLowerCase();
    return (
      invoice.invoice_no?.toLowerCase().includes(searchLower) ||
      invoice.invoiceNumber?.toLowerCase().includes(searchLower) ||
      invoice.number?.toLowerCase().includes(searchLower)
    );
  });

  // Handle customer selection
  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer.id);
    setCustomerSearch(customer.name);
    setShowCustomerDropdown(false);
  };

  // Handle invoice selection
  const handleInvoiceSelect = (invoice) => {
    setSelectedInvoice(invoice.id);
    setInvoiceSearch(invoice.invoice_no || invoice.invoiceNumber || invoice.number);
    setShowInvoiceDropdown(false);
  };

  return (
    <div
      className={`fixed top-0 right-0 z-[100] h-screen w-1/2 bg-white shadow-2xl border-l border-gray-200 transform transition-transform duration-500 ease-in-out overflow-y-auto ${
        show ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom sticky-top bg-white">
        <h5 className="mb-0 fw-semibold" style={{ fontSize: "18px", color: "#1a1a1a" }}>Payment Record</h5>
        <button
          onClick={() => setShowPaymentSlide(false)}
          className="btn btn-link text-decoration-none p-0"
          style={{ color: "#0d6efd", fontSize: "14px", fontWeight: "500" }}
        >
          Close
        </button>
      </div>

      {/* Tabs */}
      <div className="border-bottom">
        <ul className="nav nav-tabs border-0 px-4">
          <li className="nav-item">
            <button
              className={`nav-link border-0 ${activeTab === "basic" ? "active" : ""}`}
              onClick={() => setActiveTab("basic")}
              style={{ fontSize: "13px", fontWeight: activeTab === "basic" ? "600" : "500" }}
            >
              Basic Details
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link border-0 ${activeTab === "advanced" ? "active" : ""}`}
              onClick={() => setActiveTab("advanced")}
              style={{ fontSize: "13px", fontWeight: activeTab === "advanced" ? "600" : "500" }}
            >
              Advanced <span className="badge bg-secondary" style={{ fontSize: "10px" }}>Optional</span>
            </button>
          </li>
        </ul>
      </div>

      {/* Form */}
      <div className="px-4 py-3">
        <form onSubmit={handleSubmit}>
          {activeTab === "basic" && (
            <>
              {/* Customer & Invoice Row */}
              <div className="row g-3 mb-3">
                {/* Customer Search */}
                <div className="col-md-6">
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: "500" }}>Customer</label>
                  <div className="position-relative">
                    <input
                      type="text"
                      value={customerSearch}
                      onChange={(e) => {
                        setCustomerSearch(e.target.value);
                        setShowCustomerDropdown(true);
                        if (e.target.value === "") {
                          setSelectedCustomer("");
                        }
                      }}
                      onFocus={() => setShowCustomerDropdown(true)}
                      placeholder="Search by name, phone, or address..."
                      className="form-control form-control-sm"
                      style={{ fontSize: "13px" }}
                    />
                    <i className="bi bi-search position-absolute" style={{ right: "10px", top: "50%", transform: "translateY(-50%)", color: "#6c757d", fontSize: "12px" }}></i>

                    {showCustomerDropdown && filteredCustomers.length > 0 && (
                      <div className="position-absolute w-100 bg-white border rounded shadow-sm mt-1" style={{ maxHeight: "200px", overflowY: "auto", zIndex: 1000 }}>
                        {filteredCustomers.map((customer) => (
                          <div
                            key={customer.id}
                            onClick={() => handleCustomerSelect(customer)}
                            className="p-2 cursor-pointer"
                            style={{ fontSize: "12px", cursor: "pointer", borderBottom: "1px solid #f0f0f0" }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = "#f8f9fa"}
                            onMouseLeave={(e) => e.target.style.backgroundColor = "white"}
                          >
                            <div className="fw-semibold">{customer.name}</div>
                            <small className="text-muted">
                              {customer.phone && `${customer.phone} • `}
                              {customer.address}
                            </small>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Invoice Search */}
                <div className="col-md-6">
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: "500" }}>Invoice</label>
                  <div className="position-relative">
                    <input
                      type="text"
                      value={invoiceSearch}
                      onChange={(e) => {
                        setInvoiceSearch(e.target.value);
                        setShowInvoiceDropdown(true);
                        if (e.target.value === "") {
                          setSelectedInvoice("");
                        }
                      }}
                      onFocus={() => setShowInvoiceDropdown(true)}
                      placeholder="Search by invoice number..."
                      className="form-control form-control-sm"
                      style={{ fontSize: "13px" }}
                    />
                    <i className="bi bi-search position-absolute" style={{ right: "10px", top: "50%", transform: "translateY(-50%)", color: "#6c757d", fontSize: "12px" }}></i>

                    {showInvoiceDropdown && filteredInvoices.length > 0 && (
                      <div className="position-absolute w-100 bg-white border rounded shadow-sm mt-1" style={{ maxHeight: "200px", overflowY: "auto", zIndex: 1000 }}>
                        {filteredInvoices.map((invoice) => (
                          <div
                            key={invoice.id}
                            onClick={() => handleInvoiceSelect(invoice)}
                            className="p-2 cursor-pointer"
                            style={{ fontSize: "12px", cursor: "pointer", borderBottom: "1px solid #f0f0f0" }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = "#f8f9fa"}
                            onMouseLeave={(e) => e.target.style.backgroundColor = "white"}
                          >
                            <div className="d-flex justify-content-between">
                              <span className="fw-semibold">{invoice.invoice_no || invoice.invoiceNumber || invoice.number}</span>
                              <span className="text-primary">Rs. {invoice.grand_total || invoice.total || 0}</span>
                            </div>
                            <small className="text-muted">
                              {invoice.date ? new Date(invoice.date).toLocaleDateString() : "N/A"}
                            </small>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Customer Info Card */}
              {selectedCustomer && (
                <div className="mb-3 p-3 border rounded bg-light">
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-person-circle me-2" style={{ fontSize: "20px" }}></i>
                    <h6 className="mb-0" style={{ fontSize: "14px", fontWeight: "600" }}>Customer Details</h6>
                  </div>
                  {(() => {
                    const customer = customers.find(c => c.id === selectedCustomer);
                    return customer ? (
                      <div style={{ fontSize: "12px" }}>
                        <div className="row g-2">
                          <div className="col-6">
                            <strong>Name:</strong> {customer.name}
                          </div>
                          <div className="col-6">
                            <strong>Phone:</strong> {customer.phone || "N/A"}
                          </div>
                          <div className="col-12">
                            <strong>Address:</strong> {customer.address || "N/A"}
                          </div>
                          {customer.email && (
                            <div className="col-12">
                              <strong>Email:</strong> {customer.email}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              {/* Invoice Info Card */}
              {selectedInvoice && (
                <div className="mb-3 p-3 border rounded bg-light">
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-file-earmark-text me-2" style={{ fontSize: "20px" }}></i>
                    <h6 className="mb-0" style={{ fontSize: "14px", fontWeight: "600" }}>Invoice Details</h6>
                  </div>
                  {(() => {
                    const invoice = salesInvoices.find(inv => inv.id === selectedInvoice);
                    return invoice ? (
                      <div style={{ fontSize: "12px" }}>
                        <div className="row g-2 mb-2">
                          <div className="col-6">
                            <strong>Invoice No:</strong> {invoice.invoice_no || invoice.invoiceNumber || "N/A"}
                          </div>
                          <div className="col-6">
                            <strong>Date:</strong> {invoice.date ? new Date(invoice.date).toLocaleDateString() : "N/A"}
                          </div>
                        </div>

                        <div className="border-top pt-2 mt-2">
                          <div className="d-flex justify-content-between mb-1">
                            <span className="text-muted">Subtotal:</span>
                            <span>Rs. {invoice.subtotal || 0}</span>
                          </div>
                          {invoice.discount > 0 && (
                            <div className="d-flex justify-content-between mb-1">
                              <span className="text-muted">Discount:</span>
                              <span className="text-danger">- Rs. {invoice.discount}</span>
                            </div>
                          )}
                          {invoice.tax > 0 && (
                            <div className="d-flex justify-content-between mb-1">
                              <span className="text-muted">Tax:</span>
                              <span>Rs. {invoice.tax}</span>
                            </div>
                          )}
                          <div className="d-flex justify-content-between border-top pt-1 mt-1">
                            <strong>Grand Total:</strong>
                            <strong className="text-primary">Rs. {invoice.grand_total || invoice.total || 0}</strong>
                          </div>
                        </div>

                        {invoice.invoice_items && invoice.invoice_items.length > 0 && (
                          <div className="border-top pt-2 mt-2">
                            <small className="text-muted d-block mb-2">Items ({invoice.invoice_items.length}):</small>
                            <div className="bg-white rounded p-2" style={{ maxHeight: "120px", overflowY: "auto" }}>
                              {invoice.invoice_items.map((item, idx) => (
                                <div key={idx} className="d-flex justify-content-between align-items-center mb-1 pb-1 border-bottom">
                                  <div>
                                    <div style={{ fontSize: "11px", fontWeight: "500" }}>{item.item || item.name}</div>
                                    <small className="text-muted">{item.quantity} × Rs. {item.rate}</small>
                                  </div>
                                  <span style={{ fontSize: "11px", fontWeight: "600" }}>Rs. {item.total}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              {/* Payment Date & Status */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: "500" }}>Payment Date</label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="form-control form-control-sm"
                    style={{ fontSize: "13px" }}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: "500" }}>Status</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="form-select form-select-sm"
                    style={{ fontSize: "13px" }}
                  >
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="mb-3">
                <label className="form-label" style={{ fontSize: "13px", fontWeight: "500" }}>Description</label>
                <textarea
                  value={paymentDescription}
                  onChange={(e) => setPaymentDescription(e.target.value)}
                  placeholder="What is this payment for?"
                  rows="2"
                  className="form-control form-control-sm"
                  style={{ fontSize: "13px" }}
                />
              </div>

              {/* Amount Details */}
              {invoiceTotal && (
                <div className="mb-3 p-2 bg-light rounded">
                  <div className="d-flex justify-content-between mb-1">
                    <small className="text-muted">Invoice Total:</small>
                    <small className="fw-semibold">Rs. {invoiceTotal}</small>
                  </div>
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="partialPayment"
                      checked={partialPayment}
                      onChange={(e) => setPartialPayment(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="partialPayment" style={{ fontSize: "12px" }}>
                      Partial Payment
                    </label>
                  </div>
                </div>
              )}

              {/* Amount */}
              <div className="mb-3">
                <label className="form-label" style={{ fontSize: "13px", fontWeight: "500" }}>Payment Amount</label>
                <input
                  type="number"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  className="form-control form-control-sm"
                  style={{ fontSize: "13px" }}
                />
                {dueAmount > 0 && partialPayment && (
                  <small className="text-danger">Due Amount: Rs. {dueAmount}</small>
                )}
              </div>

              {/* Payment Type */}
              <div className="mb-3">
                <label className="form-label" style={{ fontSize: "13px", fontWeight: "500" }}>Payment Method</label>
                <div className="d-flex flex-wrap gap-2">
                  {paymentTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setPaymentType(type)}
                      className={`btn btn-sm ${
                        paymentType === type ? "btn-dark" : "btn-outline-secondary"
                      }`}
                      style={{ fontSize: "12px", padding: "4px 12px" }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* QR Code */}
              {(paymentType === "eSewa" || paymentType === "Khalti" || paymentType === "Online") && (
                <div className="mb-3">
                  <button
                    type="button"
                    onClick={() => setShowQR(!showQR)}
                    className="btn btn-sm btn-outline-primary w-100"
                    style={{ fontSize: "13px" }}
                  >
                    {showQR ? "Hide QR Code" : "Show QR Code"}
                  </button>
                  {showQR && (
                    <div className="mt-3 p-3 bg-white rounded shadow-sm border-2 rounded text-center position-relative">
                      <div className="bg-white d-inline-flex align-items-center justify-content-center border" style={{ width: "150px", height: "150px", background:'url("/images/qr.png")', backgroundSize: "cover" }}>
                        {/* <span className="text-muted" style={{ fontSize: "12px" }}>QR Code</span> */}
                      </div>
                      <p className="mt-2 mb-0 text-muted" style={{ fontSize: "12px" }}>Scan to pay via {paymentType}</p>
                      <img src={F1SoftLogo} className="position-absolute " style={{width:"80px", left: "10px", bottom : "10px"}} alt="" />
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {activeTab === "advanced" && (
            <>
              {/* Reference Number & Receipt Number */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: "500" }}>
                    Reference Number <span className="text-muted">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    placeholder="REF-001"
                    className="form-control form-control-sm"
                    style={{ fontSize: "13px" }}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: "500" }}>
                    Receipt Number <span className="text-muted">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={receiptNumber}
                    onChange={(e) => setReceiptNumber(e.target.value)}
                    placeholder="RCP-001"
                    className="form-control form-control-sm"
                    style={{ fontSize: "13px" }}
                  />
                </div>
              </div>

              {/* Transaction ID (for Online/eSewa/Khalti) */}
              {(paymentType === "eSewa" || paymentType === "Khalti" || paymentType === "Online") && (
                <div className="mb-3">
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: "500" }}>
                    Transaction ID <span className="text-muted">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="TXN123456789"
                    className="form-control form-control-sm"
                    style={{ fontSize: "13px" }}
                  />
                </div>
              )}

              {/* Check Number (for Check) */}
              {paymentType === "Check" && (
                <div className="mb-3">
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: "500" }}>
                    Check Number <span className="text-muted">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={checkNumber}
                    onChange={(e) => setCheckNumber(e.target.value)}
                    placeholder="CHK-123456"
                    className="form-control form-control-sm"
                    style={{ fontSize: "13px" }}
                  />
                </div>
              )}

              {/* Bank Details (for Bank Transfer/Check) */}
              {(paymentType === "Bank Transfer" || paymentType === "Check") && (
                <>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label" style={{ fontSize: "13px", fontWeight: "500" }}>
                        Bank Name <span className="text-muted">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="Bank Name"
                        className="form-control form-control-sm"
                        style={{ fontSize: "13px" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" style={{ fontSize: "13px", fontWeight: "500" }}>
                        Account Number <span className="text-muted">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="XXXX-XXXX-XXXX"
                        className="form-control form-control-sm"
                        style={{ fontSize: "13px" }}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Notes */}
              <div className="mb-3">
                <label className="form-label" style={{ fontSize: "13px", fontWeight: "500" }}>
                  Additional Notes <span className="text-muted">(Optional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional information..."
                  rows="3"
                  className="form-control form-control-sm"
                  style={{ fontSize: "13px" }}
                />
              </div>

              {/* Info Box */}
              <div className="alert alert-info py-2" style={{ fontSize: "12px" }}>
                <i className="bi bi-info-circle me-2"></i>
                All fields in this section are optional and can be used for detailed record-keeping.
              </div>
            </>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-dark w-100 mt-3"
            style={{ fontSize: "14px", fontWeight: "500" }}
          >
            Record Payment
          </button>
        </form>
      </div>
    </div>
  );
}
