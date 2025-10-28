import { useEffect, useState, useRef } from "react";
import { MdOutlineFileDownload, MdStore, MdLocationOn } from "react-icons/md";
import { IoIosPrint } from "react-icons/io";
import { IoChevronBackOutline } from "react-icons/io5";

import { db } from "../firebase";
import { getDoc, doc } from "firebase/firestore";
import company from "../assets/company.jpg";
import { jsPDF } from "jspdf";
import Swal from "sweetalert2";
import html2canvas from "html2canvas-pro";
import { useParams, Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import axiosInstance from "../axiosConfig";

const InvoicePage = () => {
  const [invoice, setInvoice] = useState({});
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const printRef = useRef(null);
  const { id } = useParams();
  const [currentDateTime] = useState(new Date());

  // ✅ Download as PDF
  const handleDownloadPdf = async () => {
    const element = printRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element);
      const data = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("invoice.pdf");

      Swal.fire({
        title: "Success!",
        text: "Your invoice PDF has been downloaded successfully.",
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      Swal.fire({
        title: "Oops!",
        text: "Something went wrong while downloading the PDF.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
      console.error("PDF generation error:", error);
    }
  };

  // ✅ Fetch Invoice
  useEffect(() => {
    axiosInstance
      .get(`/sales-invoices/${id}`)
      .then((resp) => {
        console.log("Fetched invoice:", resp.data.data);
        setInvoice(resp.data.data);
      })
      .catch((ex) => console.error(ex));
  }, [id]);

  let totalValueBeforeTax = 0;

  if (!invoice) return <p className="text-center mt-10">Loading invoice...</p>;

  return (
    <>
      {/* Header Section */}
      <div className="d-flex flex-wrap align-items-center justify-content-between bg-light text-dark p-3 rounded-3 border mb-4">
        <div className="d-flex align-items-center gap-3">
          <Link to="/invoices">
            <button className="btn btn-outline-secondary btn-sm p-1">
              <IoChevronBackOutline className="fs-5" />
            </button>
          </Link>
          <h5 className="mb-0">Invoice #{invoice.invoice_no || invoice.id}</h5>
        </div>
        <div className="d-flex gap-2">
          <button
            onClick={handleDownloadPdf}
            className="btn btn-outline-dark btn-sm d-flex align-items-center gap-1 px-2 py-1"
            style={{ fontSize: "0.875rem" }}
          >
            <MdOutlineFileDownload />
            Export
          </button>
          <button
            onClick={() => window.print()}
            className="btn btn-outline-dark btn-sm d-flex align-items-center gap-1 px-2 py-1"
            style={{ fontSize: "0.875rem" }}
          >
            <IoIosPrint />
            Print
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Section - Invoice Preview */}
        <div className="col-md-8">
          <div
            ref={printRef}
            className="card p-4"
          >
            {/* Company Header */}
            <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
              <img src={company} alt="Company Logo" className="rounded" style={{ width: "60px", height: "60px", objectFit: "cover" }} />
              <div>
                <h5 className="mb-1 fw-bold">My Company</h5>
                <p className="mb-0 text-muted small">Phone: 123-456-7890</p>
              </div>
            </div>

            {/* Bill To & Invoice Details */}
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <h6 className="text-secondary mb-2">Bill To:</h6>
                <p className="mb-1 fw-semibold">{invoice.customer?.name || "N/A"}</p>
                <p className="mb-0 small text-muted">
                  {invoice.customer?.address && (
                    <>
                      <i className="bi bi-geo-alt me-1"></i>
                      {invoice.customer.address}
                      <br />
                    </>
                  )}
                  {invoice.customer?.phone && (
                    <>
                      <i className="bi bi-telephone me-1"></i>
                      {invoice.customer.phone}
                    </>
                  )}
                </p>
              </div>

              <div className="col-md-6 text-md-end">
                <h6 className="text-secondary mb-2">Invoice Details:</h6>
                <p className="mb-1 small">
                  <span className="fw-semibold">Invoice No:</span> {invoice.invoice_no}
                </p>
                <p className="mb-1 small">
                  <span className="fw-semibold">Date:</span> {invoice.date ? new Date(invoice.date).toLocaleDateString() : currentDateTime.toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Items Table */}
            <div className="table-responsive mb-4">
              <table className="table table-sm table-bordered">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "5%" }} className="text-center">#</th>
                    <th style={{ width: "40%" }}>Item</th>
                    <th style={{ width: "15%" }} className="text-center">Qty</th>
                    <th style={{ width: "20%" }} className="text-end">Rate</th>
                    <th style={{ width: "20%" }} className="text-end">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice?.invoice_items?.map((item, index) => {
                    const totalAmt = item.quantity * item.rate;
                    totalValueBeforeTax += totalAmt;
                    return (
                      <tr key={index}>
                        <td className="text-center small">{index + 1}</td>
                        <td className="small">{item.item}</td>
                        <td className="text-center small">{item.quantity}</td>
                        <td className="text-end small">Rs {item.rate}</td>
                        <td className="text-end small">Rs {totalAmt.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="row justify-content-end">
              <div className="col-md-5">
                <div className="card bg-light border-0 p-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="small">Subtotal:</span>
                    <span className="small">Rs {parseFloat(invoice.subtotal || totalValueBeforeTax).toFixed(2)}</span>
                  </div>
                  {invoice.discount > 0 && (
                    <div className="d-flex justify-content-between mb-2">
                      <span className="small">Discount:</span>
                      <span className="small text-danger">- Rs {parseFloat(invoice.discount).toFixed(2)}</span>
                    </div>
                  )}
                  {invoice.tax > 0 && (
                    <div className="d-flex justify-content-between mb-2">
                      <span className="small">Tax:</span>
                      <span className="small">Rs {parseFloat(invoice.tax).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between border-top pt-2 mt-2">
                    <span className="fw-bold">Grand Total:</span>
                    <span className="fw-bold text-primary">Rs {parseFloat(invoice.grand_total || totalValueBeforeTax).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="row mt-4 pt-3 border-top">
              <div className="col-md-7">
                <h6 className="fw-semibold mb-2">Terms & Conditions:</h6>
                <p className="small text-muted">
                  Payment is due within 15 days. Please make checks payable to My Company.
                  Thank you for your business!
                </p>
              </div>
              <div className="col-md-5 text-end">
                <div className="border-bottom mb-2" style={{ width: "200px", marginLeft: "auto" }}></div>
                <p className="small mb-0 fw-semibold">Authorized Signature</p>
                <p className="small text-muted">Account Manager</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Summary */}
        <div className="col-md-4">
          <div className="card p-3" style={{ backgroundColor: "#f8f9fa" }}>
            <h6 className="mb-3 text-secondary">Invoice Summary</h6>

            {/* Customer Info */}
            <div className="mb-3">
              <label className="form-label fw-semibold small mb-1">Customer</label>
              <p className="small mb-0">{invoice.customer?.name || "N/A"}</p>
              {invoice.customer?.phone && (
                <p className="small text-muted mb-0">
                  <i className="bi bi-telephone me-1"></i>
                  {invoice.customer.phone}
                </p>
              )}
            </div>

            {/* Dates */}
            <div className="mb-3 pb-3 border-bottom">
              <div className="d-flex justify-content-between mb-2">
                <span className="small text-muted">Issue Date:</span>
                <span className="small fw-semibold">
                  {invoice.date ? new Date(invoice.date).toLocaleDateString() : currentDateTime.toLocaleDateString()}
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="small text-muted">Invoice No:</span>
                <span className="small fw-semibold">{invoice.invoice_no}</span>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="mb-3">
              <h6 className="mb-2 small fw-bold">Payment Summary</h6>
              <div className="d-flex justify-content-between mb-1">
                <span className="small">Subtotal:</span>
                <span className="small">Rs. {parseFloat(invoice.subtotal || 0).toFixed(2)}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="d-flex justify-content-between mb-1">
                  <span className="small">Discount:</span>
                  <span className="small text-danger">- Rs. {parseFloat(invoice.discount).toFixed(2)}</span>
                </div>
              )}
              {invoice.tax > 0 && (
                <div className="d-flex justify-content-between mb-1">
                  <span className="small">Tax:</span>
                  <span className="small">Rs. {parseFloat(invoice.tax).toFixed(2)}</span>
                </div>
              )}
              <div className="d-flex justify-content-between border-top pt-2 mt-2">
                <span className="fw-bold">Grand Total:</span>
                <span className="fw-bold text-primary">Rs. {parseFloat(invoice.grand_total || 0).toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Status */}
            {invoice.payment_status && (
              <div className="alert alert-info py-2 mb-0 small">
                <i className="bi bi-info-circle me-2"></i>
                Status: <span className="fw-semibold">{invoice.payment_status}</span>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="card p-3 mt-3">
            <h6 className="mb-3 text-secondary">Items ({invoice?.invoice_items?.length || 0})</h6>
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              {invoice?.invoice_items?.map((item, idx) => (
                <div key={idx} className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                  <div className="flex-fill">
                    <p className="mb-0 small fw-semibold">{item.item}</p>
                    <p className="mb-0 text-muted" style={{ fontSize: "0.75rem" }}>
                      {item.quantity} × Rs. {item.rate}
                    </p>
                  </div>
                  <span className="small fw-bold">Rs. {(item.quantity * item.rate).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoicePage;