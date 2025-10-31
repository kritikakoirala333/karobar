import React from "react";
import { FaEdit } from "react-icons/fa";
import { IoChevronBackOutline } from "react-icons/io5";

function Profile() {
  return (
    <>
      {/* ===== Header Bar ===== */}
      <div className="d-flex flex-wrap align-items-center justify-content-between bg-light text-dark p-3 rounded-3 border mb-4">
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-outline-secondary btn-sm p-1">
            <IoChevronBackOutline className="fs-5" />
          </button>
          <h5 className="mb-0">Create Profile</h5>
        </div>

        <div className="d-flex gap-3">
          <button className="btn btn-outline-secondary d-flex align-items-center gap-2 px-4">
            Save
          </button>
          <button className="btn btn-outline-secondary d-flex align-items-center gap-2 px-4">
            Cancel
          </button>
        </div>
      </div>

      {/* ===== Profile Card ===== */}
      <div className="card shadow-sm border-0 p-4 rounded-3">
        {/* ===== Profile Header ===== */}
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h5 className="fw-semibold mb-1">Profile Information</h5>
          </div>
          <button className="btn btn-primary btn-sm d-flex align-items-center gap-2 px-3 py-2">
            <FaEdit />
            Edit
          </button>
        </div>

        {/* ===== Profile Overview ===== */}
        <div className="d-flex align-items-center gap-3 border-bottom pb-3 mb-4">
          <img
            src="https://via.placeholder.com/80"
            alt="Profile"
            className="rounded-circle border shadow-sm"
            width="80"
            height="80"
          />
          <div>
            <h6 className="mb-0 fw-semibold">Kritika Koirala</h6>
            <p className="text-muted mb-0">Customer Service Manager</p>
          </div>
        </div>

        {/* ===== Personal Details ===== */}
        <div className="mb-4">
          <h6 className="fw-semibold mb-3 text-dark">Personal Details</h6>
          <form className="row g-3">
            <div className="col-md-6">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter First Name"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Last Name"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email address"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Phone</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter phone number"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                className="form-control"
                placeholder="Enter date of birth"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Gender</label>
              <select className="form-select">
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </form>
        </div>

        {/* ===== Address Section ===== */}
        <div className="border-top pt-3">
          <h6 className="fw-semibold mb-3 text-dark">Address</h6>
          <form className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Country</label>
              <input type="text" className="form-control" placeholder="Enter Country" />
            </div>

            <div className="col-md-6">
              <label className="form-label">City / State</label>
              <input type="text" className="form-control" placeholder="Enter City or State" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Profile;


