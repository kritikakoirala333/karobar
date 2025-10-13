import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { getDocs, collection } from "firebase/firestore";
import { FiSearch } from "react-icons/fi";
import { FaTrashAlt } from "react-icons/fa";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchInvoices = async () => {
      const resp = await getDocs(collection(db, "invoices"));
      const data = resp.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setInvoices(data);
    };

    fetchInvoices();
  }, []);

  const getTotalQuantity = (fields = []) => {
    return fields.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
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

  const filteredInvoices = invoices.filter((inv) => {
    const term = searchTerm.toLowerCase();
    return (
      inv.customername?.toLowerCase().includes(term) ||
      inv.address?.toLowerCase().includes(term) ||
      inv.mobileno?.toLowerCase().includes(term) ||
      inv.number?.toString().includes(term)
    );
  });

  return (
    <div className="px-10 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Invoices</h2>
        <div
          onClick={() =>
            setViewMode((prev) => (prev === "grid" ? "table" : "grid"))
          }
          className={`relative w-38 h-10 flex items-center rounded-full cursor-pointer transition-colors duration-500 ${
            viewMode === "table" ? "bg-black" : "bg-black"
          }`}
        >
          {/* Sliding knob */}
          <span
            className={`absolute top-1 left-1 w-17 h-8 bg-white rounded-full shadow-md transform transition-transform duration-500 ease-in-out ${
              viewMode === "table"
                ? "translate-x-[100%] left-3"
                : "translate-x-0"
            }`}
          ></span>

          {/* Labels */}
          <span
            className={`z-10 w-1/2 text-center text-sm font-medium transition-colors duration-300 ${
              viewMode === "grid" ? "text-black" : "text-gray-300"
            }`}
          >
            Grid
          </span>
          <span
            className={`z-10 w-1/2 text-center text-sm font-medium transition-colors duration-300 ${
              viewMode === "table" ? "text-black" : "text-gray-300"
            }`}
          >
            Table
          </span>
        </div>
      </div>
      {/* 🔍 Search Bar */}
      <div className="relative w-full md:w-[300px] mb-10">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
        <input
          type="text"
          placeholder="Search invoices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-3 py-2 border-1 border-gray-400 rounded-md focus:outline-none focus:border-black  transition-all"
        />
      </div>

      {invoices.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredInvoices.map((invoice, index) => {
              const totalQty = getTotalQuantity(invoice.fields);
              const bgColor = colors[index % colors.length];
              return (
                <div
                  key={invoice.id}
                  className={`shadow-[0px_0px_5px_grey] cursor-pointer h-35 rounded-xl pl-[5px] ${bgColor}`}
                >
                  <div className="bg-white rounded-xl h-full py-3 px-4 flex justify-between">
                    <div className="flex flex-col justify-between">
                      <div>
                        <h5 className="font-semibold  text-lg">
                          {invoice.customername}
                        </h5>
                        <p>{invoice.address}</p>
                      </div>
                      <span className=" font-medium">
                        Total Quantity:{" "}
                        <span className="text-purple-700">{totalQty}</span>
                      </span>
                    </div>
                    <div className="text-right flex flex-col justify-between items-end">
                      <p className="text-sm">{invoice.mobileno}</p>
                      <span className="bg-red-400 p-2 rounded-md text-white text-xs">
                        <FaTrashAlt />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden transition-all duration-500 ease-in-out">
            <div className="max-h-100 overflow-y-auto">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-50 text-left text-sm font-semibold text-gray-600 sticky top-0 z-10">
                  <tr>
                    <th className="py-3 px-4 border-b">Number</th>
                    <th className="py-3 px-4 border-b ">Customer</th>
                    <th className="py-3 px-4 border-b">Date</th>
                    <th className="py-3 px-4 border-b">Address</th>
                    <th className="py-3 px-4 border-b">Mobile No.</th>
                    <th className="py-3 px-4 border-b">Status</th>
                    <th className="py-3 px-4 border-b">Total</th>
                    <th className="py-3 px-4 border-b">Quantity</th>
                  </tr>
                </thead>

                <tbody className="text-gray-700 text-sm">
                  {filteredInvoices.map((invoice, i) => {
                    const totalQty = getTotalQuantity(invoice.fields);
                    const status = randomStatus();
                    return (
                      <tr
                        key={invoice.id}
                        className="hover:bg-gray-50 cursor-pointer transition duration-200 ease-in-out"
                      >
                        <td className="py-3 px-4 border-b font-medium text-gray-800">
                          {invoice.number || `INV${1000 + i}`}
                        </td>

                        <td className="py-3 px-4 border-b flex items-center gap-3 ">
                          <img
                            src={invoice.avatar || "https://i.pravatar.cc/30"}
                            alt="Avatar"
                            className="w-8 h-8 rounded-full"
                          />
                          <span>{invoice.customername || "-"}</span>
                        </td>

                        <td className="py-3 px-4 border-b ">
                          {invoice.date || "27th Jul 2021"}
                        </td>

                        <td className="py-3 px-4 border-b ">
                          {invoice.address || "-"}
                        </td>

                        <td className="py-3 px-4 border-b ">
                          {invoice.mobileno || "-"}
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
                          {invoice.total ? `${invoice.total} US$` : "0.00 US$"}
                        </td>

                        <td className="py-3 px-4 border-b text-left">
                          {totalQty}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center px-4 py-3 bg-gray-50 rounded-b-xl text-sm text-gray-600">
              <p>Showing 10 of {invoices.length} results</p>
              <button className="text-purple-600 hover:text-purple-800 font-medium">
                Show More
              </button>
            </div>
          </div>
        )
      ) : (
        <p>No invoices found.</p>
      )}
    </div>
  );
}
