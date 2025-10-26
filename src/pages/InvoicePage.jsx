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
    <div className="flex">
      {/* Left Section */}
      <section className="leftContainer w-[68%]">
        <section className="invoiceHeader  px-2">
         <div className="flex items-center justify-between w-full py-2">
  
  <div className="flex items-center gap-3">
    <Link to="/invoices">
      <div className="w-8 h-8 rounded-xl border p-[3px] hover:bg-black border-gray-400 flex items-center justify-center transition">
        <IoChevronBackOutline className="text-gray-400 hover:text-white" />
      </div>
    </Link>

    <p className="text-2xl font-semibold pt-[14px] text-gray-800">
      | Order #{invoice.id || 89}
    </p>
  </div>

  {/* Right Side */}
  <div className="flex items-center gap-2 text-xs">
    <button
      onClick={handleDownloadPdf}
      className="border border-gray-500 flex items-center gap-1 p-1 px-2 rounded hover:bg-black hover:text-white transition"
    >
      <MdOutlineFileDownload className="text-base" />
      <span>Export</span>
    </button>

    <button
      onClick={handleDownloadPdf}
      className="border border-gray-500 flex items-center gap-1 p-1 px-2 rounded hover:bg-black hover:text-white transition"
    >
      <IoIosPrint className="text-base" />
      <span>Print</span>
    </button>
  </div>
</div>


          <div className="flex justify-between  text-sm">
            <div className="flex items-center flex-wrap gap-2">
              <p className="text-gray-500">
                Ordered <span className="text-gray-800">via Website</span>
              </p>
              <p>{currentDateTime.toLocaleString()}</p>
            <div className="flex">  <FiShoppingCart className="text-gray-400 mt-[3px]" />
              <p>Product</p></div>
             <div className="flex"><MdStore className="text-gray-400 mt-[3px]" />
              <p>Picked up in-store</p></div> 
            </div>
          </div>
        </section>

        {/* Invoice Content */}
        <div className="min-h-screen flex justify-center px-2">
          <div
            ref={printRef}
            className="w-full max-w-4xl bg-white rounded-lg overflow-hidden border-gray-100 border-2"
          >
            {/* Header */}
            <div className="p-6">
              <div className="mb-4 flex items-center gap-4">
                <img src={company} alt="Company Logo" className="h-18 w-18 object-cover" />
                <div>
                  <h2 className="text-xl font-semibold">My Company</h2>
                  <p>Phone: 123-456-7890</p>
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <div>
                  <h4>To:</h4>
                  <p>
                    <span className="font-semibold">{invoice.customer?.name}</span>
                    <br />
                    Address: {invoice.customer?.address}
                    <br />
                    Phone: {invoice.customer?.phone}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold">Invoice Details:</h4>
                  <p>
                   Invoice_no: {
                      invoice.invoice_no
                    }
                    <br />
                    Pan_no:
                    <br />
                    {currentDateTime.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Table */}
              <table className="w-full border border-gray-400 border-collapse mt-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-400 p-2 text-left">#</th>
                    <th className="border border-gray-400 p-2 text-left">Item</th>
                    <th className="border border-gray-400 p-2 text-center">Qty</th>
                    <th className="border border-gray-400 p-2 text-left">Rate</th>
                    <th className="border border-gray-400 p-2 text-left">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice?.invoice_items?.map((item, index) => {
                    const totalAmt = item.quantity * item.rate;
                    totalValueBeforeTax += totalAmt;
                    return (
                      <tr key={index}>
                        <td className="border border-gray-400 p-2 text-center">{index + 1}</td>
                        <td className="border border-gray-400 p-2">{item.item}</td>
                        <td className="border border-gray-400 p-2 text-center">{item.quantity}</td>
                        <td className="border border-gray-400 p-2 text-left">Rs {item.rate}</td>
                        <td className="border border-gray-400 p-2 text-left">
                          Rs {totalAmt.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td></td>
                    <td className="border p-2 border-gray-400" colSpan={3}>
                      Total
                    </td>
                    <td className="text-left p-2">Rs {totalValueBeforeTax.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>

              {/* Totals */}
              <div className="mt-6 flex justify-end">
                <div className="w-1/2">
                  <div className="flex justify-between py-1">
                    <span>Subtotal:</span>
                    <span>Rs {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Tax (10%):</span>
                    <span>Rs {tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1 font-semibold border-t border-gray-300 pt-2">
                    <span>Total:</span>
                    <span>Rs {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4">
              <div className="flex justify-between items-start">
                <p className="w-[65%] text-sm">
                  <span className="font-semibold text-md">Terms & Conditions:</span>
                  <br />
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Fugit iure, vel itaque aspernatur est hic quo libero!
                </p>
                <div className="text-center">
                  <div className="border w-[200px] mx-auto"></div>
                  <p className="text-xs mt-1">
                    <span className="font-semibold">Your Name & Signature</span>
                    <br />
                    Account Manager
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right Section */}
    <section className="rightContainer w-[35%] border-l border-gray-300 px-2 py-2">
  <div className="border border-dashed border-blue-300 rounded-md p-2 space-y-4">
    {/* Header */}
    <div>
      <p className="font-semibold text-lg mb-1">Invoice Details</p>
      <p className="text-gray-700">Azure Superstore</p>
    </div>

    {/* Location */}
    <div className="flex items-start gap-2 text-gray-500 text-sm border border-dashed border-gray-300 rounded-md p-2">
      <MdLocationOn className="text-gray-600 mt-1" />
      <div>
        <p>123 Anywhere in the world</p>
        <p>Lorem ipsum dolor sit amet</p>
      </div>
    </div>

    {/* Dates */}
    <div className="text-sm text-gray-700 space-y-1">
      <div className="flex justify-between">
        <span>Issue Date:</span>
        <span>{currentDateTime.toLocaleDateString()}</span>
      </div>
      <div className="flex justify-between">
        <span>Delivery Date:</span>
        <span>20 January 2025</span>
      </div>
    </div>

    {/* Totals */}
    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
      <span className="text-gray-800">Total:</span>
      <span className="font-semibold text-lg text-gray-900">Rs. 5000</span>
    </div>

    {/* Order Summary */}
    <div className="pt-2 border-t border-gray-200">
      <span className="font-semibold text-gray-800 block mb-2">
        Order Summary
      </span>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Sub Total:</span>
          <span>Rs. 5000</span>
        </div>
        <div className="flex justify-between">
          <span>Coupon Discount:</span>
          <span>8%</span>
        </div>
        <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-gray-200">
          <span>Total:</span>
          <span>Rs. 5000</span>
        </div>
      </div>
    </div>
  </div>
</section>

    </div>
  );
};

export default InvoicePage;
