import React, { use, useEffect, useState } from "react";
import { db } from "./firebase";
import { getDocs, collection } from "firebase/firestore";
import { FiSearch } from "react-icons/fi";
import { FaTrashAlt } from "react-icons/fa";
import { RiFileEditFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import EditForm from "./pages/EditCustomer";
import axiosInstance from "./axiosConfig";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/customers")
      .then((response) => {
        console.log("Response data : ", response.data.data.data);
        setCustomers(response.data.data.data); // Store the fetched data
      })
      .catch((error) => {
        console.error("Error fetching customers:", error);
      });
  }, []);

  // useEffect(() => {
  //   const fetchInvoices = async () => {
  //     const resp = await getDocs(collection(db, "customers"));
  //     const data = resp.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     setCustomers(data);
  //   };

  //   fetchInvoices();
  // }, []);

  const colors = [
    "bg-purple-300",
    "bg-blue-300",
    "bg-pink-300",
    "bg-green-300",
    "bg-orange-300",
  ];

  const filteredCustomers = customers.filter((inv) => {
    const term = searchTerm.toLowerCase();
    return (
      inv.name?.toLowerCase().includes(term) ||
      inv.address?.toLowerCase().includes(term) ||
      inv.phone?.toLowerCase().includes(term) 
    );
  });

  console.log(customers);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    setCustomers(invoices.filter((inv) => inv.id !== deleteId));
    setShowConfirm(false);
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setDeleteId(null);
  };

  const Edit = (customerId) => {
    setShowEditForm(true);
    setSelectedCustomer(customers.filter((customer) => customer.id === customerId))
  };

  return (
    <div className="px-10 pt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className=" font-semibold">Customers</h3>
        {/* 🔍 Search Bar */}

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
      <div className="flex mb-8 justify-between ">
        <div className="relative w-full md:w-[320px]">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-[6px] text-sm border-1 border-gray-400 rounded-md focus:outline-none focus:border-black  transition-all"
          />
        </div>
        <div className="flex gap-8">
          <div className="bg-black text-white px-3 py-[6px] rounded-sm cursor-pointer">
            This year
          </div>
          <div className="bg-black text-white px-3 py-[6px] rounded-sm cursor-pointer">
            This month
          </div>
          <div className="bg-black text-white px-3 py-[6px] rounded-sm cursor-pointer">
            This day
          </div>
        </div>
      </div>

      {customers.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredCustomers.map((customer, index) => {
              const bgColor = colors[index % colors.length];
              return (
                <Link className="text-decoration-none text-black">
                  <div
                    key={customer.id}
                    className={`shadow-[0px_0px_5px_grey] cursor-pointer h-35 rounded-xl pl-[5px] ${bgColor}`}
                  >
                    <div className="bg-white rounded-xl h-full py-3 px-4 flex justify-between">
                      <div className="flex flex-col justify-between">
                        <div>
                          <h5 className="font-semibold  text-lg">
                            {customer.name}
                          </h5>
                          <p>{customer.address}</p>
                        </div>
                      </div>
                      <div className="text-right flex flex-col justify-between items-end">
                        <p className="text-sm">{customer.phone}</p>

                        <div className="flex gap-2">
                          <span
                            onClick={(e) => {
                              e.preventDefault(); // Prevent Link navigation
                              e.stopPropagation(); // Stop event bubbling
                              Edit(customer.id);
                            }}
                            className="bg-blue-400 z-100 p-2 rounded-md text-white text-sm cursor-pointer"
                          >
                            <RiFileEditFill />
                          </span>
                          <span
                            onClick={(e) => {
                              e.preventDefault(); // Prevent Link navigation
                              e.stopPropagation(); // Stop event bubbling
                              handleDeleteClick(customer.id);
                            }}
                            className="bg-red-400 z-100 p-2 rounded-md text-white text-xs cursor-pointer"
                          >
                            <FaTrashAlt />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-gray-100 overflow-hidden transition-all duration-500 ease-in-out">
            <div className="max-h-94 overflow-y-auto">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-700 text-left text-sm font-semibold text-white sticky top-0 z-10">
                  <tr>
                    <th className="py-3 px-4 border-b">Number</th>
                    <th className="py-3 px-4 border-b ">Customer</th>
                    <th className="py-3 px-4 border-b">Date</th>
                    <th className="py-3 px-4 border-b">Address</th>
                    <th className="py-3 px-4 border-b">Mobile No.</th>
                    <th className="py-3 px-4 border-b text-center">Delete</th>
                  </tr>
                </thead>

                <tbody className="text-gray-700 text-sm">
                  {filteredCustomers
                    .slice(0, visibleCount)
                    .map((customer, i) => {
                      return (
                        <tr
                          key={customer.id}
                          className="hover:bg-gray-50 cursor-pointer transition duration-200 ease-in-out"
                        >
                          <td className="py-3 px-4 border-b font-medium text-gray-800">
                            {customer.number || `INV${1000 + i}`}
                          </td>

                          <td className="py-3 px-4 border-b flex items-center gap-3 ">
                            <img
                              src={
                                customer.avatar || "https://i.pravatar.cc/30"
                              }
                              alt="Avatar"
                              className="w-8 h-8 rounded-full"
                            />
                            <span>{customer.customername || "-"}</span>
                          </td>

                          <td className="py-3 px-4 border-b ">
                            {customer.date || "27th Jul 2021"}
                          </td>

                          <td className="py-3 px-4 border-b ">
                            {customer.address || "-"}
                          </td>

                          <td className="py-3 px-4 border-b ">
                            {customer.mobileno || "-"}
                          </td>

                          <td className="py-3 px-4 border-b text-center">
                            <span
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent Link navigation
                                handleDeleteClick(customer.id);
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
                Showing {Math.min(visibleCount, filteredCustomers.length)} of{" "}
                {filteredCustomers.length} results
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
                onClick={confirmDelete}
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
      {showEditForm && (
        <EditForm setShowEditForm={setShowEditForm} customer={selectedCustomer} />
      )}
    </div>
  );
}
