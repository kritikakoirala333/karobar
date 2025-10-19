import React from "react";
import { FaSearch } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { IoFilterSharp } from "react-icons/io5";
import { FiUpload } from "react-icons/fi";
import { FaFileDownload } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { Link } from "react-router-dom";




function Inventory() {
  const products = [
    {
      name: "PixelMate",
      category: "Electronics",
      sku: "AFZM647",
      incoming: 478,
      stock: 595,
      status: "In stock",
      price: "$4347",
      image: "https://via.placeholder.com/40",
    },
    {
      name: "FusionLink",
      category: "Electronics",
      sku: "AFZM622",
      incoming: 418,
      stock: 761,
      status: "In stock",
      price: "$5347",
      image: "https://via.placeholder.com/40",
    },
    {
      name: "VelvetAura",
      category: "Apparel",
      sku: "AFZM655",
      incoming: 471,
      stock: 765,
      status: "Out of stock",
      price: "$2347",
      image: "https://via.placeholder.com/40",
    },
    {
      name: "UrbanFlex Sneakers",
      category: "Apparel",
      sku: "AFZM653",
      incoming: 178,
      stock: 65,
      status: "Low stock",
      price: "$9347",
      image: "https://via.placeholder.com/40",
    },
    {
      name: "SilkSage Wrap",
      category: "Wellness",
      sku: "AFZM699",
      incoming: 473,
      stock: 165,
      status: "In stock",
      price: "$4347",
      image: "https://via.placeholder.com/40",
    },
  ];
  const getStatusColor = (status) => {
    switch (status) {
      case "In stock":
        return "bg-green-100 text-green-700";
      case "Low stock":
        return "bg-yellow-100 text-yellow-700";
      case "Out of stock":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };



  return (
    <>
    <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3">
      <div>
        <h3>Inventory</h3>
      </div>
      <div  className="flex items-center gap-2">
         <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-3 text-gray-700 hover:bg-gray-50 transition">
        <FiUpload className="w-4 h-4" />
        <span>Import</span>
      </button>
       <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-3 text-gray-700 hover:bg-gray-50 transition">
        <FaFileDownload className="w-4 h-4" />
        <span>Export</span>
      </button>
      <Link to={"/addproduct"} ><button className="flex items-center gap-2 px-3 py-2 rounded-3 text-white bg-violet-600 hover:bg-violet-700 transition">
        <GoPlus className="w-4 h-4" />
        <span>Add Product</span>
      </button></Link>

      </div>

    </div>
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl shadow-sm">

        {/* Search Box */}
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            <FaCalendarAlt className="w-4 h-4 text-gray-500" />

            <span>12 Sep - 28 Oct 2024</span>
          </button>

          {/* Dropdowns */}
          <select className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none hover:bg-gray-50">
            <option>Amount Status</option>
            <option>Paid</option>
            <option>Pending</option>
          </select>

          <select className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none hover:bg-gray-50">

            <option>Active</option>
            <option>Inactive</option>
          </select>

          {/* Filter Button */}
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <IoFilterSharp className="w-4 h-4 text-gray-600" />
            <span>Filter</span>
          </button>
        </div>

        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-500 sticky top-0 z-10">
            <tr>
              <td className="py-3 px-2"><input type="checkbox" /></td>

              <th className="py-3 px-4 border-b">Product Name</th>
              <th className="py-3 px-4 border-b ">Category</th>
              <th className="py-3 px-4 border-b">SKU</th>
              <th className="py-3 px-4 border-b">Incoming</th>
              <th className="py-3 px-4 border-b">Stock</th>
              <th className="py-3 px-4 border-b">Status</th>
              <th className="py-3 px-4 border-b">Price</th>
              <th className="py-3 px-4 border-b">Action</th>

            </tr>
          </thead>
          <tbody>
            {products.map((item, i) => (
              <tr>
                <td className="py-3 px-2"><input type="checkbox" /></td>
                <td className="py-3 px-4 flex items-center gap-3">
                  <img
                    src={item.image}

                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <td className="text-gray-600">{item.name}</td>
                </td>
                <td className="py-3 px-4 text-gray-600">{item.category}</td>
                <td className="py-3 px-4 text-gray-600">{item.sku}</td>
                <td className="py-3 px-4 text-gray-600">{item.incoming}</td>
                <td className="py-3 px-4 text-gray-600">{item.stock}</td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      item.status
                    )}`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current"></span>
                    {item.status}
                  </span>
                </td>
                <td className="py-3 px-4 font-medium text-gray-600">{item.price}</td>
              </tr>
            ))}
          </tbody>


        </table>
      </div>
    </>
  );

}


export default Inventory
