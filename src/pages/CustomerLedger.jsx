import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";
import { RiFileEditFill } from "react-icons/ri";
import { FaPrint } from "react-icons/fa";
import axiosInstance from "../axiosConfig";
import Swal from "sweetalert2";

export default function CustomerLedger() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef();

  useEffect(() => {
    fetchCustomerData();
  }, [id]);

  const fetchCustomerData = async () => {
    try {
      const response = await axiosInstance.get(`/customers/${id}`);
      setCustomer(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching customer data:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch customer data",
        icon: "error",
        confirmButtonText: "OK"
      });
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center p-5">
        <p className="text-muted">Customer not found</p>
        <button onClick={() => navigate("/customers")} className="btn btn-dark btn-sm">
          Back to Customers
        </button>
      </div>
    );
  }

  const statistics = customer.statistics || {};
  const salesInvoices = customer.sales_invoices || [];
  const paymentReceipts = customer.payment_receipts || [];

  // Create combined transactions array sorted by date
  const allTransactions = [
    ...salesInvoices.map(inv => ({
      id: `inv-${inv.id}`,
      date: inv.date,
      type: 'invoice',
      reference: inv.invoice_no,
      description: inv.note || 'Sales Invoice',
      debit: parseFloat(inv.grand_total || 0),
      credit: 0,
      relatedData: inv
    })),
    ...paymentReceipts.map(pay => ({
      id: `pay-${pay.id}`,
      date: pay.date,
      type: 'payment',
      reference: pay.receipt_no,
      description: pay.title || 'Payment Receipt',
      debit: 0,
      credit: parseFloat(pay.amount || 0),
      relatedData: pay
    }))
  ].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Calculate running balance
  let runningBalance = 0;
  const transactionsWithBalance = allTransactions.map(transaction => {
    runningBalance += transaction.debit - transaction.credit;
    return {
      ...transaction,
      balance: runningBalance
    };
  });

  return (
    <div>
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .print-section {
            page-break-after: always;
          }
          @page {
            size: A4;
            margin: 1cm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>

      {/* Header - No Print */}
      <div className="d-flex align-items-center justify-content-between mb-3 no-print">
        <div className="d-flex align-items-center gap-2">
          <button
            onClick={() => navigate("/customers")}
            className="btn btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center"
            style={{ width: "32px", height: "32px" }}
          >
            <IoChevronBackOutline style={{ fontSize: "16px" }} />
          </button>
          <div>
            <h5 className="mb-0 fw-bold">{customer.name}</h5>
            <small className="text-muted" style={{ fontSize: "12px" }}>Customer Ledger</small>
          </div>
        </div>
        <div className="d-flex gap-2">
          <button
            onClick={handlePrint}
            className="btn btn-dark btn-sm"
            style={{ fontSize: "13px" }}
          >
            <FaPrint className="me-1" />
            Print Report
          </button>
          <button
            onClick={() => navigate(`/customers`)}
            className="btn btn-outline-dark btn-sm"
            style={{ fontSize: "13px" }}
          >
            <RiFileEditFill className="me-1" />
            Edit Customer
          </button>
        </div>
      </div>

      {/* Customer Summary Cards - No Print */}
      <div className="row g-3 mb-3 no-print">
        <div className="col-md-3">
          <div className="card rounded-1 border shadow-none ">
            <div className="card-body p-3">
              <small className="text-muted d-block mb-1" style={{ fontSize: "11px" }}>TOTAL INVOICED</small>
              <h5 className="mb-0 fw-normal">Rs. {(statistics.total_invoice_amount || 0).toFixed(2)}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card rounded-1 border shadow-none ">
            <div className="card-body p-3">
              <small className="text-muted d-block mb-1" style={{ fontSize: "11px" }}>TOTAL PAID</small>
              <h5 className="mb-0 fw-normal text-success">Rs. {(statistics.total_paid || 0).toFixed(2)}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card rounded-1 border shadow-none ">
            <div className="card-body p-3">
              <small className="text-muted d-block mb-1" style={{ fontSize: "11px" }}>OUTSTANDING</small>
              <h5 className={`mb-0 fw-normal ${(statistics.total_outstanding || 0) > 0 ? 'text-danger' : 'text-dark'}`}>
                Rs. {(statistics.total_outstanding || 0).toFixed(2)}
              </h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card rounded-1 border shadow-none ">
            <div className="card-body p-3">
              <small className="text-muted d-block mb-1" style={{ fontSize: "11px" }}>TOTAL INVOICES</small>
              <h5 className="mb-0 fw-normal">{statistics.total_invoices || 0}</h5>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Details Card - No Print */}
      <div className="card rounded-1 border shadow-none  mb-3 no-print" style={{ border: "1px solid #e0e0e0" }}>
        <div className="card-body p-3">
          <h6 className="mb-3 text-secondary" style={{ fontSize: "13px" }}>CUSTOMER INFORMATION</h6>
          <div className="row g-3" style={{ fontSize: "13px" }}>
            <div className="col-md-2">
              <label className="text-muted d-block mb-1" style={{ fontSize: "11px" }}>CUSTOMER ID</label>
              <div className="fw-semibold">#{customer.id}</div>
            </div>
            <div className="col-md-2">
              <label className="text-muted d-block mb-1" style={{ fontSize: "11px" }}>TYPE</label>
              <div className="text-capitalize">{customer.type || "N/A"}</div>
            </div>
            <div className="col-md-2">
              <label className="text-muted d-block mb-1" style={{ fontSize: "11px" }}>PHONE</label>
              <div>
                <i className="bi bi-telephone-fill me-2"></i>
                {customer.phone || "N/A"}
              </div>
            </div>
            <div className="col-md-3">
              <label className="text-muted d-block mb-1" style={{ fontSize: "11px" }}>EMAIL</label>
              <div>
                <i className="bi bi-envelope-fill me-2"></i>
                {customer.email || "N/A"}
              </div>
            </div>
            <div className="col-md-3">
              <label className="text-muted d-block mb-1" style={{ fontSize: "11px" }}>PAN/VAT</label>
              <div>{customer.pan_vat || "N/A"}</div>
            </div>
            <div className="col-md-6">
              <label className="text-muted d-block mb-1" style={{ fontSize: "11px" }}>ADDRESS</label>
              <div>
                <i className="bi bi-geo-alt-fill me-2"></i>
                {customer.address || "N/A"}
              </div>
            </div>
            <div className="col-md-3">
              <label className="text-muted d-block mb-1" style={{ fontSize: "11px" }}>COUNTRY</label>
              <div>{customer.country || "N/A"}</div>
            </div>
            <div className="col-md-3">
              <label className="text-muted d-block mb-1" style={{ fontSize: "11px" }}>JOINED DATE</label>
              <div>{customer.created_at ? new Date(customer.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "N/A"}</div>
            </div>
          </div>
          {customer.note && (
            <div className="mt-3 pt-3 border-top">
              <label className="text-muted d-block mb-1" style={{ fontSize: "11px" }}>NOTES</label>
              <div style={{ fontSize: "13px" }}>{customer.note}</div>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Statistics - No Print */}
      <div className="row g-3 mb-3 no-print">
        <div className="col-md-4">
          <div className="card rounded-1 border shadow-none ">
            <div className="card-body p-3">
              <small className="text-muted d-block mb-1" style={{ fontSize: "11px" }}>PAID INVOICES</small>
              <h6 className="mb-0 fw-bold text-success">{statistics.paid_invoices_count || 0}</h6>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card rounded-1 border shadow-none ">
            <div className="card-body p-3">
              <small className="text-muted d-block mb-1" style={{ fontSize: "11px" }}>PARTIAL PAID</small>
              <h6 className="mb-0 fw-bold text-warning">{statistics.partial_invoices_count || 0}</h6>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card rounded-1 border shadow-none ">
            <div className="card-body p-3">
              <small className="text-muted d-block mb-1" style={{ fontSize: "11px" }}>UNPAID INVOICES</small>
              <h6 className="mb-0 fw-bold text-danger">{statistics.unpaid_invoices_count || 0}</h6>
            </div>
          </div>
        </div>
      </div>

      {/* Print-Friendly Tally-Style Ledger Report */}
      <div className="print-section" ref={printRef}>
        {/* Print Header */}
        <div className="d-none d-print-block text-center mb-4">
          <h4 className="mb-1 fw-bold">{customer.organization?.name || "Organization Name"}</h4>
          <p className="mb-1" style={{ fontSize: "12px" }}>{customer.organization?.email || ""}</p>
          <h5 className="mb-3 mt-3 fw-bold">Customer Ledger Account</h5>
          <div className="row" style={{ fontSize: "12px" }}>
            <div className="col-6 text-start">
              <strong>Customer:</strong> {customer.name}
            </div>
            <div className="col-6 text-end">
              <strong>Date:</strong> {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
          <hr />
        </div>

        {/* Tally-Style Debit/Credit Report */}
        <div className="card rounded-1 border shadow-none " style={{ border: "1px solid #000" }}>
          <div className="card-body p-0">
            <table className="table table-bordered mb-0" style={{ fontSize: "12px", border: "1px solid #000" }}>
              <thead style={{ backgroundColor: "#f0f0f0" }}>
                <tr>
                  <th colSpan="4" className="text-center fw-bold py-2" style={{ borderBottom: "2px solid #000" }}>
                    DEBIT
                  </th>
                  <th colSpan="4" className="text-center fw-bold py-2" style={{ borderBottom: "2px solid #000", borderLeft: "2px solid #000" }}>
                    CREDIT
                  </th>
                </tr>
                <tr style={{ backgroundColor: "#f8f9fa" }}>
                  <th className="py-2 px-2" style={{ width: "10%" }}>Date</th>
                  <th className="py-2 px-2" style={{ width: "15%" }}>Reference</th>
                  <th className="py-2 px-2" style={{ width: "15%" }}>Particulars</th>
                  <th className="py-2 px-2 text-end" style={{ width: "10%" }}>Amount</th>
                  <th className="py-2 px-2" style={{ width: "10%", borderLeft: "2px solid #000" }}>Date</th>
                  <th className="py-2 px-2" style={{ width: "15%" }}>Reference</th>
                  <th className="py-2 px-2" style={{ width: "15%" }}>Particulars</th>
                  <th className="py-2 px-2 text-end" style={{ width: "10%" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const debits = allTransactions.filter(t => t.debit > 0);
                  const credits = allTransactions.filter(t => t.credit > 0);
                  const maxRows = Math.max(debits.length, credits.length);
                  const rows = [];

                  for (let i = 0; i < maxRows; i++) {
                    const debit = debits[i];
                    const credit = credits[i];

                    rows.push(
                      <tr key={i} style={{ borderTop: "1px solid #dee2e6" }}>
                        {/* Debit Side */}
                        <td className="py-2 px-2">{debit ? new Date(debit.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }) : ''}</td>
                        <td className="py-2 px-2">{debit?.reference || ''}</td>
                        <td className="py-2 px-2">{debit?.description || ''}</td>
                        <td className="py-2 px-2 text-end">{debit ? `Rs. ${debit.debit.toFixed(2)}` : ''}</td>

                        {/* Credit Side */}
                        <td className="py-2 px-2" style={{ borderLeft: "2px solid #000" }}>{credit ? new Date(credit.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }) : ''}</td>
                        <td className="py-2 px-2">{credit?.reference || ''}</td>
                        <td className="py-2 px-2">{credit?.description || ''}</td>
                        <td className="py-2 px-2 text-end">{credit ? `Rs. ${credit.credit.toFixed(2)}` : ''}</td>
                      </tr>
                    );
                  }

                  return rows;
                })()}

                {/* Totals Row */}
                <tr style={{ backgroundColor: "#f0f0f0", fontWeight: "bold", borderTop: "2px solid #000" }}>
                  <td colSpan="3" className="py-2 px-2 text-end">TOTAL:</td>
                  <td className="py-2 px-2 text-end">Rs. {(statistics.total_invoice_amount || 0).toFixed(2)}</td>
                  <td colSpan="3" className="py-2 px-2 text-end" style={{ borderLeft: "2px solid #000" }}>TOTAL:</td>
                  <td className="py-2 px-2 text-end">Rs. {(statistics.total_paid || 0).toFixed(2)}</td>
                </tr>

                {/* Balance Row */}
                <tr style={{ backgroundColor: "#fff", fontWeight: "bold" }}>
                  <td colSpan="3" className="py-2 px-2 text-end">CLOSING BALANCE:</td>
                  <td className="py-2 px-2 text-end text-danger">
                    {(statistics.total_outstanding || 0) > 0 ? `Rs. ${(statistics.total_outstanding || 0).toFixed(2)}` : '-'}
                  </td>
                  <td colSpan="4" className="py-2 px-2" style={{ borderLeft: "2px solid #000" }}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Print Footer */}
        <div className="d-none d-print-block mt-4 pt-3 border-top">
          <div className="row" style={{ fontSize: "11px" }}>
            <div className="col-6">
              <p className="mb-0"><strong>Prepared By:</strong> {customer.creator?.name || "N/A"}</p>
            </div>
            <div className="col-6 text-end">
              <p className="mb-0"><strong>Print Date:</strong> {new Date().toLocaleString('en-US')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Transaction List - Screen Only */}
      <div className="card rounded-1 border shadow-none  mt-3 no-print" style={{ border: "1px solid #e0e0e0" }}>
        <div className="card-body p-3">
          <h6 className="mb-3 text-secondary" style={{ fontSize: "13px" }}>DETAILED TRANSACTION HISTORY</h6>

          {transactionsWithBalance.length > 0 ? (
            <div style={{ maxHeight: "500px", overflowY: "auto" }}>
              <table className="table table-hover mb-0" style={{ fontSize: "12px" }}>
                <thead style={{ backgroundColor: "#fafafa", position: "sticky", top: 0, zIndex: 10 }}>
                  <tr>
                    <th className="py-2">Date</th>
                    <th className="py-2">Type</th>
                    <th className="py-2">Reference</th>
                    <th className="py-2">Description</th>
                    <th className="py-2 text-end">Debit</th>
                    <th className="py-2 text-end">Credit</th>
                    <th className="py-2 text-end">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionsWithBalance.map((transaction) => (
                    <tr key={transaction.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td className="py-2">
                        {new Date(transaction.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                      </td>
                      <td className="py-2">
                        <span className={`badge ${transaction.type === 'invoice' ? 'bg-dark' : 'bg-success'}`} style={{ fontSize: "10px" }}>
                          {transaction.type === 'invoice' ? 'Invoice' : 'Payment'}
                        </span>
                      </td>
                      <td className="py-2 text-muted">{transaction.reference}</td>
                      <td className="py-2">{transaction.description}</td>
                      <td className="py-2 text-end">
                        {transaction.debit > 0 ? `Rs. ${transaction.debit.toFixed(2)}` : '-'}
                      </td>
                      <td className="py-2 text-end text-success">
                        {transaction.credit > 0 ? `Rs. ${transaction.credit.toFixed(2)}` : '-'}
                      </td>
                      <td className="py-2 text-end fw-bold">
                        Rs. {transaction.balance.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-inbox text-muted" style={{ fontSize: "48px" }}></i>
              <p className="text-muted mt-3 mb-0" style={{ fontSize: "13px" }}>No transactions found</p>
            </div>
          )}
        </div>
      </div>

      {/* Sales Invoices Details - Screen Only */}
      {salesInvoices.length > 0 && (
        <div className="card rounded-1 border shadow-none  mt-3 no-print" style={{ border: "1px solid #e0e0e0" }}>
          <div className="card-body p-3">
            <h6 className="mb-3 text-secondary" style={{ fontSize: "13px" }}>SALES INVOICES</h6>
            <div className="row g-2">
              {salesInvoices.map((invoice) => (
                <div key={invoice.id} className="col-md-3">
                  <div className="card rounded-1 border-primary border-2 shadow-none " style={{ fontSize: "12px", borderColor:'blue !important' }}>
                    <div className="card-body p-2">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <strong>{invoice.invoice_no}</strong>
                          <div className="text-muted" style={{ fontSize: "11px" }}>
                            {new Date(invoice.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold">Rs. {parseFloat(invoice.grand_total).toFixed(2)}</div>
                          <span className={`badge ${invoice.payment_status === 'paid' ? 'bg-success' : invoice.payment_status === 'partial' ? 'bg-warning' : 'bg-danger'}`} style={{ fontSize: "9px" }}>
                            {invoice.payment_status}
                          </span>
                        </div>
                      </div>
                      {invoice.note && (
                        <div className="text-muted mb-2" style={{ fontSize: "11px" }}>{invoice.note}</div>
                      )}
                      {invoice.invoice_items && invoice.invoice_items.length > 0 && (
                        <div className="border-top pt-2 mt-2">
                          <small className="text-muted d-block mb-1" style={{ fontSize: "10px" }}>ITEMS:</small>
                          {invoice.invoice_items.map((item, idx) => (
                            <div key={idx} className="d-flex justify-content-between" style={{ fontSize: "11px" }}>
                              <span>{item.item} ({item.quantity} {item.unit})</span>
                              <span>Rs. {parseFloat(item.total).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payment Receipts Details - Screen Only */}
      {paymentReceipts.length > 0 && (
        <div className="card rounded-1 border shadow-none  mt-3 no-print" style={{ border: "1px solid #e0e0e0" }}>
          <div className="card-body p-3">
            <h6 className="mb-3 text-secondary" style={{ fontSize: "13px" }}>PAYMENT RECEIPTS</h6>
            <div className="row g-2">
              {paymentReceipts.map((payment) => (
                <div key={payment.id} className="col-md-3">
                  <div className="card rounded-1 border shadow-none border-2 border-success" style={{ fontSize: "12px" }}>
                    <div className="card-body p-2">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <strong>{payment.receipt_no}</strong>
                          <div className="text-muted" style={{ fontSize: "11px" }}>
                            {new Date(payment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                        <div className="fw-bold text-success">Rs. {parseFloat(payment.amount).toFixed(2)}</div>
                      </div>
                      <div className="text-muted mb-1" style={{ fontSize: "11px" }}>{payment.title}</div>
                      <div className="d-flex justify-content-between" style={{ fontSize: "11px" }}>
                        <span className="badge bg-success" style={{ fontSize: "9px" }}>{payment.payment_method}</span>
                        {payment.sales_invoice && (
                          <span className="text-muted">Invoice: {payment.sales_invoice.invoice_no}</span>
                        )}
                      </div>
                      {payment.note && (
                        <div className="text-muted mt-2 pt-2 border-top" style={{ fontSize: "10px" }}>{payment.note}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
