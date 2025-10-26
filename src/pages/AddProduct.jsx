import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";
import { FaFileDownload } from "react-icons/fa";
import { IoChevronBackOutline } from "react-icons/io5";

function AddProduct() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <>
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between bg-light text-dark p-3 rounded-3  border">
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-outline-secondary btn-sm p-1">
            <IoChevronBackOutline className="fs-5" />
          </button>
          <h5 className="mb-0">Create Product</h5>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary d-flex align-items-center gap-2">
            <FiUpload />
            Import
          </button>
          <button className="btn btn-outline-secondary d-flex align-items-center gap-2">
            <FaFileDownload />
            Export
          </button>
        </div>
      </div>


      {/* Form & Sidebar */}
      <div className="d-flex gap-4 mt-4">
        {/* Form Section */}
        <div className="card flex-fill p-4 ">
          <h6 className="mb-4 text-secondary">Product Details</h6>
          <form className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Name *</label>
              <input type="text" className="form-control" placeholder="Enter Product Name" />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Category *</label>
              <select className="form-select">
                <option>Choose Category</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Brand *</label>
              <select className="form-select">
                <option>Choose Brand</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Barcode Symbology *</label>
              <select className="form-select">
                <option>Choose Symbology</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Product Cost *</label>
              <input type="text" className="form-control" placeholder="Enter Product Cost" />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Product Price *</label>
              <input type="text" className="form-control" placeholder="Enter Product Price" />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Product Unit *</label>
              <select className="form-select">
                <option>Choose Product Unit</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Purchase Unit *</label>
              <select className="form-select">
                <option>Choose Purchase Unit</option>
              </select>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="card  p-3" style={{ width: "600px", backgroundColor: "#f8f9fa" }}>
          <h6 className="mb-3 text-secondary">Product Preview</h6>
          <p className="text-muted">Your product info preview will appear here.</p>
        </div>
      </div>

      {/* Extra Fields Toggle */}
      <div className="mt-3">
        <div className="d-flex align-items-center gap-3 mb-2">
          <h6 className="mb-0 text-secondary">View More</h6>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
            />
          </div>
        </div>

        {isChecked && (
          <div className="card p-3 border-top  shadow-sm">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Code Product *</label>
                <input type="text" className="form-control" placeholder="Enter Code Product" />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Additional Field 2</label>
                <input type="text" className="form-control" placeholder="Enter value 2" />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AddProduct;

