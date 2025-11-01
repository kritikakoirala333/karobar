import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FaTrashAlt, FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import { RiFileEditFill } from "react-icons/ri";
import { BsFileEarmarkBarGraphFill } from "react-icons/bs";
import { MdArrowDropDown } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { RiSortAlphabetDesc } from "react-icons/ri";
import Swal from "sweetalert2";

export default function PurchaseInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [viewMode, setViewMode] = useState("table"); // 'grid' or 'table'
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);

  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [showSortByFilter, setShowSortByFilter] = useState(false);
  const [selectedSortBy, setSelectedSortBy] = useState("");

  const navigate = useNavigate();

  const fetchPurchaseInvoices = () => {
    axiosInstance
      .get("/purchase-invoices")
      .then((resp) => {
        console.log("Purchase Invoices:", resp.data);
        setInvoices(resp.data.data.data);
      })
      .catch((ex) => {
        console.error("Error fetching purchase invoices:", ex);
        Swal.fire({
          title: "Error!",
          text: "Failed to load purchase invoices",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  useEffect(() => {
    fetchPurchaseInvoices();
  }, []);

  const getTotalQuantity = (invoice_items = []) => {
    return invoice_items.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    );
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "unpaid":
        return "bg-red-100 text-red-700";
      case "partial":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const filteredInvoices = invoices
    .filter((inv) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        inv.supplier?.name?.toLowerCase().includes(term) ||
        inv.supplier?.phone?.toLowerCase().includes(term) ||
        inv.invoice_no?.toString().includes(term);

      const matchesStatus =
        !selectedStatus || inv.payment_status === selectedStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (selectedSortBy === "Supplier Name") {
        return (a.supplier?.name || "").localeCompare(b.supplier?.name || "");
      } else if (selectedSortBy === "Total Amount") {
        return (a.grand_total || 0) - (b.grand_total || 0);
      } else if (selectedSortBy === "Quantity") {
        const totalA = getTotalQuantity(a.invoice_items);
        const totalB = getTotalQuantity(b.invoice_items);
        return totalA - totalB;
      } else if (selectedSortBy === "Date") {
        return new Date(a.date) - new Date(b.date);
      }
      return 0;
    });

  const handleDeleteClick = (invoice) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete purchase invoice ${invoice.invoice_no}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        confirmDelete(invoice.id);
      }
    });
  };

  const confirmDelete = (id) => {
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
      .then((resp) => {
        Swal.fire({
          title: "Deleted!",
          text: "Purchase invoice has been deleted",
          icon: "success",
          confirmButtonText: "OK",
          timer: 2000,
        });
        fetchPurchaseInvoices();
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
  };

  const getDate = (date) => {
    if (!date) return "-";
    return date.slice(0, 10);
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
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Purchase Invoices</h3>

        {/* Search Bar */}
        <div className="relative w-full md:w-[320px]">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm" />
          <input
            type="text"
            placeholder="Search purchase invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-[6px] text-sm border-1 border-gray-400 rounded-md focus:outline-none focus:border-black transition-all"
          />
        </div>

        {/* Create Button */}
        <Link to="/purchase" className="text-decoration-none">
          <button className="btn btn-primary btn-sm px-4">
            <i className="bi bi-plus-circle me-2"></i>
            Create Purchase Invoice
          </button>
        </Link>

        {/* View Mode Toggle */}
        <div
          onClick={() =>
            setViewMode((prev) => (prev === "table" ? "grid" : "table"))
          }
          className={`relative w-38 h-10 flex items-center rounded-full cursor-pointer transition-colors duration-500 bg-black`}
        >
          <span
            className={`absolute top-1 left-1 w-17 h-8 bg-white rounded-full shadow-md transform transition-transform duration-500 ease-in-out ${
              viewMode === "grid" ? "translate-x-[100%] left-3" : "translate-x-0"
            }`}
          ></span>

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

      {/* Filters */}
      <div className="flex mb-3 justify-between items-center">
        <div className="flex gap-3">
          {/* Sort By Filter */}
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

                <div className="flex mb-3 border rounded-md overflow-hidden text-sm font-medium">
                  <button className="w-1/2 bg-gray-200 py-1 text-black">
                    Include
                  </button>
                  <button className="w-1/2 py-1 hover:bg-gray-100">
                    Exclude
                  </button>
                </div>

                {["Supplier Name", "Total Amount", "Quantity", "Date"].map(
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

          {/* Payment Status Filter */}
          <div
            className="bg-black status-filter text-white flex items-center gap-2 px-3 py-[5px] rounded-sm cursor-pointer relative"
            onClick={() => {
              setShowStatusFilter(!showStatusFilter);
              setShowSortByFilter(false);
            }}
          >
            <BsFileEarmarkBarGraphFill />
            Payment Status
            <MdArrowDropDown />
            {showStatusFilter && (
              <div className="absolute top-[110%] text-black left-0 w-70 bg-white rounded-xl shadow-lg border p-3 z-50">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-gray-800 text-sm">
                    Payment Status
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

                <div className="flex mb-3 border rounded-md overflow-hidden text-sm font-medium">
                  <button className="w-1/2 bg-gray-200 py-1 text-black">
                    Include
                  </button>
                  <button className="w-1/2 py-1 hover:bg-gray-100">
                    Exclude
                  </button>
                </div>

                {["Paid", "Unpaid", "Partial"].map((status) => (
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
        </div>
      </div>

      {/* Table/Grid View */}
      {invoices.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-3 pb-5">
            {filteredInvoices.slice(0, visibleCount).map((invoice) => {
              const totalQty = getTotalQuantity(invoice.invoice_items);
              return (
                <div
                  key={invoice.id}
                  className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer rounded-lg bg-white p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-3">
                      <div className="text-white bg-black h-12 w-12 capitalize flex justify-center items-center font-bold rounded-md">
                        {invoice.supplier?.name?.slice(0, 1) || "S"}
                      </div>
                      <div>
                        <p className="font-bold text-lg capitalize mb-0">
                          {invoice.supplier?.name || "Unknown Supplier"}
                        </p>
                        <p className="text-sm text-gray-600 mb-0">
                          Invoice: {invoice.invoice_no}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusBadge(
                        invoice.payment_status
                      )}`}
                    >
                      {invoice.payment_status
                        ? invoice.payment_status.charAt(0).toUpperCase() +
                          invoice.payment_status.slice(1)
                        : "Unpaid"}
                    </span>
                  </div>

                  <div className="py-2 border-b border-gray-200 mb-2">
                    <div className="text-gray-600 text-sm">
                      {getDate(invoice.date)}
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Items:</span>
                      <span className="font-medium">
                        {invoice.invoice_items?.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Quantity:</span>
                      <span className="font-medium">{totalQty}</span>
                    </div>
                  </div>

                  <div className="border-t pt-3 border-gray-200">
                    <div className="flex justify-between font-semibold text-lg mb-3">
                      <p className="mb-0">Total</p>
                      <p className="mb-0">Rs. {invoice.grand_total || "0.00"}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/purchase-invoice/${invoice.id}`)}
                        className="btn btn-outline-dark btn-sm flex-1"
                      >
                        <FaEye className="me-1" />
                        View
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(invoice);
                        }}
                        className="btn btn-outline-danger btn-sm"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
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
                    <th className="py-3 px-4 border-b">Invoice No</th>
                    <th className="py-3 px-4 border-b">Supplier</th>
                    <th className="py-3 px-4 border-b">Date</th>
                    <th className="py-3 px-4 border-b">Phone</th>
                    <th className="py-3 px-4 border-b">Payment Status</th>
                    <th className="py-3 px-4 border-b">Total</th>
                    <th className="py-3 px-4 border-b">Quantity</th>
                    <th className="py-3 px-4 border-b text-center">Action</th>
                  </tr>
                </thead>

                <tbody className="text-gray-700 text-sm">
                  {filteredInvoices.slice(0, visibleCount).map((invoice) => {
                    const totalQty = getTotalQuantity(invoice.invoice_items);
                    return (
                      <tr
                        key={invoice.id}
                        onClick={() => navigate(`/purchase-invoice/${invoice.id}`)}
                        className="hover:bg-gray-50 cursor-pointer transition duration-200 ease-in-out"
                      >
                        <td className="py-3 px-4 border-b font-medium text-gray-800">
                          {invoice.invoice_no || "-"}
                        </td>

                        <td className="py-3 px-4 border-b">
                          <span className="capitalize font-bold">
                            {invoice.supplier?.name || "Unknown"}
                          </span>
                        </td>

                        <td className="py-3 px-4 border-b">
                          {getDate(invoice.date)}
                        </td>

                        <td className="py-3 px-4 border-b">
                          {invoice.supplier?.phone || "-"}
                        </td>

                        <td className="py-3 px-4 border-b">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusBadge(
                              invoice.payment_status
                            )}`}
                          >
                            {invoice.payment_status
                              ? invoice.payment_status.charAt(0).toUpperCase() +
                                invoice.payment_status.slice(1)
                              : "Unpaid"}
                          </span>
                        </td>

                        <td className="py-3 px-4 border-b text-left">
                          {invoice.grand_total
                            ? `Rs. ${invoice.grand_total}`
                            : "Rs. 0.00"}
                        </td>

                        <td className="py-3 px-4 border-b text-left">
                          {totalQty}
                        </td>

                        <td className="py-3 px-4 border-b text-center flex items-center gap-2 justify-center">
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/purchase-invoice/${invoice.id}`);
                            }}
                            className="bg-blue-400 p-2 rounded-md text-white text-xs cursor-pointer inline-flex items-center justify-center"
                            title="View"
                          >
                            <FaEye />
                          </span>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(invoice);
                            }}
                            className="bg-red-400 p-2 rounded-md text-white text-xs cursor-pointer inline-flex items-center justify-center"
                            title="Delete"
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
              {visibleCount < filteredInvoices.length && (
                <button
                  onClick={() => setVisibleCount((prev) => prev + 10)}
                  className="text-purple-600 hover:text-purple-800 font-medium"
                >
                  Show More
                </button>
              )}
            </div>
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <i className="bi bi-inbox fs-1 text-muted"></i>
          <p className="text-muted mt-3">No purchase invoices found.</p>
          <Link to="/purchase" className="btn btn-primary mt-2">
            <i className="bi bi-plus-circle me-2"></i>
            Create Your First Purchase Invoice
          </Link>
        </div>
      )}
    </div>
  );
}
