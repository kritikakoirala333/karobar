import { useEffect, useState, useRef } from "react";
import { MdOutlineFileDownload, MdLocationOn } from "react-icons/md";
import { IoIosPrint } from "react-icons/io";
import { db } from "../firebase";
import { getDoc, doc } from "firebase/firestore";
import company from "../assets/company.jpg";
import { jsPDF } from "jspdf";
import Swal from "sweetalert2";
import { MdStore } from "react-icons/md";
import { IoChevronBackOutline } from "react-icons/io5";
import html2canvas from "html2canvas-pro"; // ✅ Import added
import { useParams, Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { MdLocationPin } from "react-icons/md";
import axiosInstance from "../axiosConfig";

const InvoicePage = () => {
  const [invoice, setInvoice] = useState({});
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const printRef = useRef(null);

  const { id } = useParams();

  const handleDownloadPdf = async () => {
    const element = printRef.current;
    if (!element) return;

    try {
      // ✅ Capture screen
      const canvas = await html2canvas(element);
      const data = canvas.toDataURL("image/png"); // ✅ Fixed method name



      // ✅ Create and save PDF
      const pdf = new jsPDF({
        orientation: "portrait", // ✅ Fixed spelling
        unit: "px",
        format: "a4",
      });

      // Get PDF page width
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
      // ❌ Show error alert if something goes wrong
      Swal.fire({
        title: "Oops!",
        text: "Something went wrong while downloading the PDF.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
      console.error("PDF generation error:", error);
    }
  };

  useEffect(() => {

    axiosInstance
      .get(`/sales-invoices/${id}`)
      .then((resp) => {
        setInvoice(resp.data.data);
      })
      .catch((ex) => console.error(ex));
  }, []);

  const [currentDateTime] = useState(new Date());
  let totalValueBeforeTax = 0;

  if (!invoice) return <p className="text-center mt-10">Loading invoice...</p>;

  return (
    <>
      <div className="flex">
        {/* Header Section */}
        <section className="leftContainer w-[70%]">
          <section className="invoiceHeader mt-3 px-2">
            <div className="flex items-center justify-between  ">
              <div className="cursor-pointer">
                <p className="text-2xl font-semibold mt-1 flex">
                  <Link to="/invoices">
                    {" "}
                    <div className="w-8 h-8 rounded-xl border-1 p-[3px] hover:bg-black border-gray-400 mr-2">
                      <IoChevronBackOutline className="text-gray-400 hover:text-white" />
                    </div>
                  </Link>
                  | Order #89
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs ">
                  <div
                    className="border border-gray-500 flex justify-center items-center cursor-pointer  gap-1 p-1 rounded hover:bg-black hover:text-white"
                    onClick={handleDownloadPdf}
                  >
                    <MdOutlineFileDownload className=" size-4 " />
                    <div className=""> Export</div>
                  </div>
                  <div className="border border-gray-500 flex justify-center cursor-pointer items-center gap-1 p-1 rounded hover:bg-black hover:text-white">
                    <IoIosPrint
                      onClick={handleDownloadPdf}
                      className=" size-4 cursor-pointer"
                    />
                    <div className=""> print</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <div>
                <div className="flex">
                  <p className="text-gray-500 text-sm">
                    Ordered{" "}
                    <span className="text-gray-800 my-2">Via Website</span>
                  </p>
                  <p className="ml-2 text-sm">
                    {" "}
                    {currentDateTime.toLocaleString()}
                  </p>
                  <p className="text-gray-400 pt-[4px]  ml-2">
                    <FiShoppingCart className="text-sm" />
                  </p>
                  <p className="text-sm">product</p>
                  <MdStore className="size-4 mt-[4px] ml-2 text-gray-400 text-sm" />
                  <p className="text-sm">pickedup up in-store</p>
                </div>
              </div>
            </div>
          </section>

          <div className="min-h-screen flex justify-center  px-2">
            <div
              ref={printRef}
              className="w-full  max-w-4xl bg-white rounded-lg overflow-hidden border-gray-100 border-2 "
            >
              {/* Header */}
              <div className="p-6">
                <div className="mb-4 flex items-center gap-4">
                  <img
                    src={company}
                    alt="Company Logo"
                    className="h-18 w-18 object-cover"
                  />
                  <div>
                    <h2 className="text-xl font-semibold">My Company</h2>
                    <p>Phone: 123-456-7890</p>
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <div>
                    <h4>To:</h4>
                    <p>
                      <span className="font-semibold ">
                        {invoice.customer?.name}
                      </span>
                      <br />
                      Address: {invoice.customer?.address}
                      <br />
                      Phone no: {invoice.customer?.phone}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold">Invoice Details:</h4>
                    <p>
                      No: {invoice.invoice_no}
                      <br />
                      Pan_no:
                      <br />
                      {currentDateTime.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Table */}
                <table className="w-full border border-gray-400 border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-400 p-2 text-left">
                        #
                      </th>
                      <th className="border border-gray-400 p-2 text-left">
                        Item
                      </th>
                      <th className="border border-gray-400 p-2 text-center">
                        Qty
                      </th>
                      <th className="border border-gray-400 p-2 text-left">
                        Rate
                      </th>
                      <th className="border border-gray-400 p-2 text-left">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice?.invoice_items?.map((item, index) => {
                      const totalAmt = item.quantity * item.rate;
                      totalValueBeforeTax += totalAmt;
                      return (
                        <tr key={index}>
                          <td className="border border-gray-400 p-2 text-center">
                            {index + 1}
                          </td>
                          <td className="border border-gray-400 p-2">
                            {item.item}
                          </td>
                          <td className="border border-gray-400 p-2 text-center">
                            {item.quantity}
                          </td>
                          <td className="border border-gray-400 p-2 text-left">
                            Rs {item.rate}
                          </td>
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
                      <td className="text-left p-2">
                        Rs {totalValueBeforeTax.toFixed(2)}
                      </td>
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
                  <p className="w-[70%] text-sm">
                    <span className="font-semibold text-md">
                      Terms & Conditions:
                    </span>
                    <br />
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Fugit iure, vel itaque aspernatur est hic quo libero!
                  </p>
                  <div className="text-center">
                    <div className="border-1 w-[200px]"></div>
                    <p className="text-xs">
                      <span className="font-semibold">
                        Your Name & Signature
                      </span>
                      <br />
                      Account Manager
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rightContainer w-[30%] border-l-1 border-gray-300">
          <div className="border border-dashed border-blue-300 rounded-md p-4 mb-4">
            <div>
              <h2 className="font-semibold text-lg mb-2">Invoice Details</h2>
              <h3 className="font-semibold text-base mb-2">Azure Superstore</h3>
              <div className="flex items-start gap-2 text-gray-500 text-sm border border-dashed border-gray-300 rounded-md p-2 mb-3">
                <MdLocationOn className="text-gray-600 mt-1" />
                <div>
                  <p>123 anyone in the wold</p>
                  <p>loreum ipsum dollar sit amet</p>
                </div>
              </div>
              <div className="text-sm text-gray-700 space-y-1">
                <div className="flex justify-between">
                  <span>Issue Date :</span>
                  <span>Rs. 5390</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Date:</span>
                  <span>20 January 2025</span>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="font-semibold text-gray-800 text-base">
                  Total:
                </span>
                <span className="font-bold text-xl text-gray-900">
                  Rs. 5000
                </span>
              </div>

              <div className="bg-white mt-3 rounded-xl">
                <table class="table table-bordered rounded-xl">
                  <thead>
                    <tr>
                      <th scope="col">OrderDetails</th>
                      <th scope="col">TotalPrice</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td scope="row">Taxable</td>
                      <td>Rs.2002</td>
                    </tr>
                    <tr>
                      <td scope="row">Additional Charge</td>
                      <td>Rs.200</td>
                    </tr>
                    <tr>
                      <td scope="row">Discout</td>
                      <td>Rs.293</td>
                    </tr>
                    <tr>
                      <td scope="row">SubTotal</td>
                      <td>Rs.1770</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-3  flex justify-end text-black">
                <div
                  onClick={handleDownloadPdf}
                  className="flex border-1 bg-white border-gray-400 p-2 rounded-2xl cursor-pointer"
                >
                  <MdOutlineFileDownload className=" size-4 mt-[3px] mr-1 " />
                  <div className="text-sm"> Export</div>
                </div>
                <div
                  onClick={handleDownloadPdf}
                  className="flex border-1 bg-white border-gray-400 ml-2 p-2 rounded-2xl cursor-pointer"
                >
                  <IoIosPrint className=" size-4 mt-[3px] mr-1 " />
                  <div className="text-sm"> print</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default InvoicePage;
