import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { getDocs, collection } from "firebase/firestore";
import { FiSearch } from "react-icons/fi";
import { FaTrashAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "./axiosConfig";
import { RiFileEditFill } from "react-icons/ri";
import EditInvoiceFom from "./EditInvoiceFom";
import { BsFileEarmarkBarGraphFill } from "react-icons/bs";
import { MdArrowDropDown } from "react-icons/md";
import { ImStopwatch } from "react-icons/im";
import { FaCalendarAlt } from "react-icons/fa";
import { RiSortAlphabetDesc } from "react-icons/ri";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [viewMode, setViewMode] = useState("table"); // 'grid' or 'table'
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const [showEditInvoiceForm, setShowEditInvoiceForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState("");

  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [showSortByFilter, setShowSortByFilter] = useState(false);
  const [selectedSortBy, setSelectedSortBy] = useState("");

  const navigate = useNavigate();

  const fetchInvoices = () => {
    axiosInstance
      .get("/sales-invoices")
      .then((resp) => {
        setInvoices(resp.data.data.data);
      })
      .catch((ex) => console.error(ex));
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const getTotalQuantity = (invoice_items = []) => {
    return invoice_items.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    );
  };

  // Define background colors for grid cards
  const colors = [
    "bg-purple-300",
    "bg-blue-300",
    "bg-pink-300",
    "bg-green-300",
    "bg-orange-300",
  ];

  // Define possible statuses
  const statuses = ["Paid", "Draft", "Overdue", "Pending"];

  // Function to get a random status
  const randomStatus = () =>
    statuses[Math.floor(Math.random() * statuses.length)];

  const filteredInvoices = invoices
    .filter((inv) => {
      const term = searchTerm.toLowerCase();
      return (
        inv.customer.name?.toLowerCase().includes(term) ||
        inv.customer.address?.toLowerCase().includes(term) ||
        inv.customer.phone?.toLowerCase().includes(term) ||
        inv.invoice_no?.toString().includes(term)
      );
    })
    .sort((a, b) => {
      if (selectedSortBy === "Customer Name") {
        return a.customer.name.localeCompare(b.customer.name);
      } else if (selectedSortBy === "Address") {
        return a.customer.address.localeCompare(b.customer.address);
      } else if (selectedSortBy === "Total Amount") {
        return (a.grand_total || 0) - (b.grand_total || 0);
      } else if (selectedSortBy === "Quantity") {
        const totalA = getTotalQuantity(a.invoice_items);
        const totalB = getTotalQuantity(b.invoice_items);
        return totalA - totalB;
      }
      return 0;
    });

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = (e, id) => {
    e.preventDefault();

    axiosInstance
      .delete(`/sales-invoices/${id}`)
      .then((resp) => {
        fetchInvoices();
        setShowConfirm(false);
        setDeleteId(null);
      })
      .catch((ex) => {
        console.error(ex);
      });
  };

  const cancelDelete = (id) => {
    setShowConfirm(false);
    setDeleteId(null);
  };

  const getDate = (date) => {
    return date.slice(0, 10);
  };

  const EditIncoice = (invoiceId) => {
    setShowEditInvoiceForm(true);
    setSelectedInvoice(invoices.filter((invoice) => invoice.id === invoiceId));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".status-filter")) {
        setShowStatusFilter(false);
        setShowSortByFilter(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="px-2 pt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className=" font-semibold">Invoices</h3>
        {/* 🔍 Search Bar */}
        <div className="relative w-full md:w-[320px]">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm" />
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-[6px] text-sm border-1 border-gray-400 rounded-md focus:outline-none focus:border-black  transition-all"
          />
        </div>
        <div className="border-1 flex items-center gap-8 px-8 py-[6px] rounded-md border-gray-400">
          <select
            name=""
            id=""
            className="outline-none cursor-pointer text-gray-600"
          >
            <option value="">Sort By</option>
            <option value="address">Address</option>
            <option value="customer">Customer</option>
          </select>

          <div className="hover:text-blue-400 cursor-pointer text-gray-600">
            Pending
          </div>
          <div className="hover:text-blue-400 cursor-pointer text-gray-600">
            Paid
          </div>
          <div className="hover:text-blue-400 cursor-pointer text-gray-600">
            Delete
          </div>
        </div>

        <div
          onClick={() =>
            setViewMode((prev) => (prev === "table" ? "grid" : "table"))
          }
          className={`relative w-38 h-10 flex items-center rounded-full cursor-pointer transition-colors duration-500 ${
            viewMode === "table" ? "bg-black" : "bg-black"
          }`}
        >
          {/* Sliding knob */}
          <span
            className={`absolute top-1 left-1 w-17 h-8 bg-white rounded-full shadow-md transform transition-transform duration-500 ease-in-out ${
              viewMode === "grid"
                ? "translate-x-[100%] left-3"
                : "translate-x-0"
            }`}
          ></span>

          {/* Labels */}
          <span
            className={`z-10 w-1/2 text-center text-sm font-medium transition-colors duration-300 ${
              viewMode === "grid" ? "text-gray-300" : "text-black"
            }`}
          >
            Table
          </span>
          <span
            className={`z-10 w-1/2 text-center text-sm font-medium transition-colors duration-300 ${
              viewMode === "table" ? "text-gray-300" : "text-black"
            }`}
          >
            Grid
          </span>
        </div>
      </div>
      <div className="flex mb-3 justify-between items-center">
        <div className="flex gap-3">
          <div
            onClick={() => {
              setShowSortByFilter(!showSortByFilter);
              setShowStatusFilter(false);
            }}
            className="bg-black status-filter text-white flex items-center gap-2 px-3 py-[5px] rounded-sm cursor-pointer relative"
          >
            <RiSortAlphabetDesc />
            Sort By
            <MdArrowDropDown />
            {showSortByFilter && (
              <div className="absolute top-[110%] text-black left-0 w-70 bg-white rounded-xl shadow-lg border p-3 z-50">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-gray-800 text-sm">
                    Sort By
                  </h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSortBy("");
                    }}
                    className="text-blue-500 text-xs font-medium"
                  >
                    Clear
                  </button>
                </div>

                {/* Include / Exclude Tabs */}
                <div className="flex mb-3 border rounded-md overflow-hidden text-sm font-medium">
                  <button className="w-1/2 bg-gray-200 py-1 text-black">
                    Include
                  </button>
                  <button className="w-1/2 py-1 hover:bg-gray-100">
                    Exclude
                  </button>
                </div>
                {["Customer Name", "Address", "Total Amount", "Quantity"].map(
                  (sortBy) => (
                    <div
                      key={sortBy}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSortBy(sortBy);
                      }}
                      className={`px-3 py-2 rounded-md cursor-pointer text-sm mb-1 flex justify-between items-center ${
                        selectedSortBy === sortBy
                          ? "bg-black text-white font-medium"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {sortBy}
                      {selectedSortBy === sortBy && (
                        <span className="text-white font-bold text-lg">✓</span>
                      )}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
          <div
            className="bg-black status-filter text-white flex items-center gap-2 px-3 py-[5px] rounded-sm cursor-pointer relative"
            onClick={() => {
              setShowStatusFilter(!showStatusFilter);
              setShowSortByFilter(false);
            }}
          >
            <BsFileEarmarkBarGraphFill />
            Status
            <MdArrowDropDown />
            {showStatusFilter && (
              <div className="absolute top-[110%] text-black left-0 w-70 bg-white rounded-xl shadow-lg border p-3 z-50">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-gray-800 text-sm">
                    Status
                  </h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStatus("");
                    }}
                    className="text-blue-500 text-xs font-medium"
                  >
                    Clear
                  </button>
                </div>

                {/* Include / Exclude Tabs */}
                <div className="flex mb-3 border rounded-md overflow-hidden text-sm font-medium">
                  <button className="w-1/2 bg-gray-200 py-1 text-black">
                    Include
                  </button>
                  <button className="w-1/2 py-1 hover:bg-gray-100">
                    Exclude
                  </button>
                </div>

                {/* Status Options */}
                {["Pending", "Processing", "Paid", "Error"].map((status) => (
                  <div
                    key={status}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStatus(status);
                    }}
                    className={`px-3 py-2 rounded-md cursor-pointer text-sm mb-1 flex justify-between items-center ${
                      selectedStatus === status
                        ? "bg-black text-white font-medium"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {status}
                    {selectedStatus === status && (
                      <span className="text-white font-bold text-lg">✓</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-black text-white flex items-center gap-2 px-3 py-[5px] rounded-sm cursor-pointer">
            <FaCalendarAlt />
            Calendar
            <MdArrowDropDown />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <div className="bg-black text-white px-3 py-[5px] rounded-sm cursor-pointer">
            This year
          </div>
          <div className="bg-black text-white px-3 py-[5px] rounded-sm cursor-pointer">
            This month
          </div>
          <div className="bg-black text-white px-3 py-[5px] rounded-sm cursor-pointer">
            This day
          </div>
        </div>
      </div>

      {invoices.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 pt-3 pb-5">
            {filteredInvoices.map((invoice, index) => {
              const totalQty = getTotalQuantity(invoice.invoice_items);
              const status = randomStatus();
              return (
                <div
                  key={invoice.id}
                  className={`shadow-[0px_0px_5px_grey] cursor-pointer rounded-xl`}
                >
                  <div className="bg-white rounded-xl py-3 px-4 flex justify-between">
                    {/* Left section wrapped in Link */}

                    <div>
                      <div className="flex justify-between">
                        <div className="flex gap-3">
                          <div className="text-white bg-black h-12 w-12 capitalize flex justify-center items-center font-bold rounded-md">
                            {invoice.customer.name.slice(0, 1)}
                          </div>
                          <div>
                            <p className="font-bold text-xl capitalize mb-0">
                              {invoice.customer.name}
                            </p>
                            <p className="text-sm mb-0">
                              Invoice: {invoice.invoice_no}
                            </p>
                          </div>
                        </div>
                        <div>
                          <div
                            className={`px-3 py-1 text-xs font-medium flex gap-1 items-center rounded-full ${
                              status === "Paid"
                                ? "bg-green-100 text-green-700"
                                : status === "Draft"
                                ? "bg-gray-200 text-gray-700"
                                : status === "Overdue"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            <ImStopwatch />
                            {status}
                          </div>
                        </div>
                      </div>
                      <div className=" py-3 border-b-2 border-gray-100 flex justify-between">
                        <div className="text-gray-500 text-sm">
                          Wed, July 12, 2023
                        </div>
                        <div className="text-gray-500 text-sm">06:45 PM</div>
                      </div>
                      <div>
                        <table className="table-fixed w-full border-collapse">
                          <thead>
                            <tr>
                              <th className="pt-3 pb-2 w-1/3 text-left">
                                Items
                              </th>
                              <th className="pt-3 pb-2 w-1/3 text-center">
                                Qty
                              </th>
                              <th className="pt-3 pb-2 flex justify-end">
                                Price
                              </th>
                            </tr>
                            {invoice?.invoice_items
                              ?.slice(0, 2)
                              .map((item, index) => {
                                const totalAmt = item.quantity * item.rate;
                                return (
                                  <tr key={index}>
                                    <td className="py-2 capitalize w-1/3 text-left">
                                      {item.item}
                                    </td>
                                    <td className="py-2 w-1/3 text-center">
                                      {item.quantity}
                                    </td>
                                    <td className="py-2 w-1/3 text-right">
                                      {item.rate}
                                    </td>
                                  </tr>
                                );
                              })}
                          </thead>
                        </table>
                      </div>
                      <div className="border-t-2 mt-2 pt-3 pb-2 border-gray-100">
                        <div className="flex justify-between font-semibold text-lg">
                          <p>Total</p>
                          <p>$87.75</p>
                        </div>
                        <div className="flex justify-between">
                          <Link
                            to={`/invoicepage/${invoice.id}`}
                            className="text-decoration-none text-black"
                          >
                            <div className="border-2 border-black hover:bg-gray-100 rounded-sm px-6 py-1">
                              See Details
                            </div>
                          </Link>
                          <div className="bg-gray-900 px-6 py-1 hover:bg-gray-700 text-white rounded-sm">
                            Pay Bills
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right section with actions (not inside Link) */}
                    {/* <div className="text-right flex flex-col justify-between items-end ml-4">
                      <p className="text-sm">{invoice.customer.phone}</p>
                      <div className="flex gap-2">
                        <span
                          onClick={() => EditIncoice(invoice.id)}
                          className="bg-blue-400 p-2 rounded-md text-white text-xs cursor-pointer inline-flex items-center justify-center"
                        >
                          <RiFileEditFill />
                        </span>
                        <span
                          onClick={() => handleDeleteClick(invoice.id)}
                          className="bg-red-400 p-2 rounded-md text-white text-xs cursor-pointer"
                        >
                          <FaTrashAlt />
                        </span>
                      </div>
                    </div> */}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-gray-100 overflow-hidden transition-all duration-500 ease-in-out mb-5 mt-4">
            <div className="max-h-94 overflow-y-auto">
              <table className="min-w-full border-collapse">
                <thead className="bg-black text-left text-sm font-semibold text-white sticky top-0 z-10">
                  <tr>
                    <th className="py-3 px-4 border-b">Number</th>
                    <th className="py-3 px-4 border-b ">Customer</th>
                    <th className="py-3 px-4 border-b">Date</th>
                    <th className="py-3 px-4 border-b">Address</th>
                    <th className="py-3 px-4 border-b">Mobile No.</th>
                    <th className="py-3 px-4 border-b">Status</th>
                    <th className="py-3 px-4 border-b">Total</th>
                    <th className="py-3 px-4 border-b">Quantity</th>
                    <th className="py-3 px-4 border-b text-center">Action</th>
                  </tr>
                </thead>

                <tbody className="text-gray-700 text-sm">
                  {filteredInvoices.slice(0, visibleCount).map((invoice, i) => {
                    const totalQty = getTotalQuantity(invoice.invoice_items);
                    const status = randomStatus();
                    return (
                      <tr
                        key={invoice.id}
                        onClick={() => navigate(`/invoicepage/${invoice.id}`)}
                        className="hover:bg-gray-50 cursor-pointer transition duration-200 ease-in-out"
                      >
                        <td className="py-3 px-4 border-b font-medium text-gray-800">
                          {invoice.invoice_no || `INV${1000 + i}`}
                        </td>

                        <td className="py-3 px-4 border-b flex items-center gap-3 ">
                          <span className="capitalize font-bold">
                            {invoice.customer.name || "-"}
                          </span>
                        </td>

                        <td className="py-3 px-4 border-b ">
                          {getDate(invoice.date) || "-"}
                        </td>

                        <td className="py-3 px-4 border-b ">
                          {invoice.customer.address || "-"}
                        </td>

                        <td className="py-3 px-4 border-b ">
                          {invoice.customer.phone || "-"}
                        </td>

                        <td className="py-3 px-4 border-b">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              status === "Paid"
                                ? "bg-green-100 text-green-700"
                                : status === "Draft"
                                ? "bg-gray-200 text-gray-700"
                                : status === "Overdue"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {status}
                          </span>
                        </td>

                        <td className="py-3 px-4 border-b text-left">
                          {invoice.grand_total
                            ? `${invoice.grand_total} US$`
                            : "0.00 US$"}
                        </td>

                        <td className="py-3 px-4 border-b text-left">
                          {totalQty}
                        </td>
                        <td className="py-3 px-4 border-b text-center flex  items-center gap-2">
                          <span
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent Link navigation
                              EditIncoice(invoice.id);
                            }}
                            className="bg-blue-400 p-2 rounded-md text-white text-xs cursor-pointer inline-flex items-center justify-center"
                          >
                            {" "}
                            <RiFileEditFill />
                          </span>
                          <span
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent Link navigation
                              handleDeleteClick(invoice.id);
                            }}
                            className="bg-red-400 p-2 rounded-md text-white text-xs cursor-pointer inline-flex items-center justify-center"
                          >
                            <FaTrashAlt />
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center px-4 py-3 bg-gray-50 rounded-b-xl text-sm text-gray-600">
              <p>
                Showing {Math.min(visibleCount, filteredInvoices.length)} of{" "}
                {filteredInvoices.length} results
              </p>
              <button
                onClick={() => setVisibleCount((prev) => prev + 10)}
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                Show More
              </button>
            </div>
          </div>
        )
      ) : (
        <p>No invoices found.</p>
      )}
      {showConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-md bg-white/20">
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-[0px_0px_15px_gray] text-center w-[90%] sm:w-[400px]">
            <h5 className="text-lg font-semibold mb-4 text-gray-800">
              Are you sure you want to delete this invoice?
            </h5>
            <div className="flex justify-center gap-5 mt-5">
              <div
                onClick={(e) => confirmDelete(e, deleteId)}
                className="bg-red-500 text-white cursor-pointer px-5 rounded-md py-2 hover:bg-red-600 transition-all"
              >
                OK
              </div>
              <div
                onClick={cancelDelete}
                className="bg-gray-300 px-5 py-2 cursor-pointer rounded-md hover:bg-gray-400 transition-all"
              >
                Cancel
              </div>
            </div>
          </div>
        </div>
      )}
      {showEditInvoiceForm && (
        <EditInvoiceFom
          setShowEditInvoiceForm={setShowEditInvoiceForm}
          invoice={selectedInvoice}
          fetchInvoices={fetchInvoices}
        />
      )}
    </div>
  );
}
