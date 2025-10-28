

import React from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import { IoCloudUploadOutline } from "react-icons/io5"; // icon for upload
import Nav from 'react-bootstrap/Nav';
import { useState } from "react";

export default function Setting() {
  const [activeTab, setActiveTab] = useState("general");
  const tabs = [
    { key: "general", label: "General" },
    { key: "security", label: "Security" },
    { key: "team", label: "Members & Team" },
    { key: "notifications", label: "Notifications" },
  ];

  return (
    <>


      {/* ===== Header Section ===== */}
      <div className="d-flex flex-wrap align-items-center justify-content-between bg-light text-dark p-3 rounded-3 border">
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-outline-secondary btn-sm p-1">
            <IoChevronBackOutline className="fs-5" />
          </button>
          <h5 className="mb-0">Settings</h5>
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-primary px-4 py-2 rounded-3">
            Save Changes
          </button>
          <button className="btn btn-outline-secondary px-4 py-2 rounded-3">
            Cancel
          </button>
        </div>
      </div>
      <div className="mt-3 border-bottom">
        <Nav
          variant="tabs"
          className="border-0 gap-3"
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
        >
          {tabs.map((tab) => (
            <Nav.Item key={tab.key}>
              <Nav.Link
                eventKey={tab.key}
                className={`px-0 pb-2 border-0 ${activeTab === tab.key
                  ? "text-dark fw-semibold border-bottom border-2 border-dark"
                  : "text-secondary"
                  }`}
                style={{
                  background: "transparent",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                {tab.label}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>

        {/* Tab content */}
        <div className="mt-4">
          {activeTab === "general" && (
            <>
              <div className="d-flex gap-4">
                <div className="card flex-fill p-4">
                  <h6 className="mb-4 text-secondary">General Settings</h6>

                  {/* ===== Profile Change Section ===== */}
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="position-relative" style={{ width: "70px", height: "70px" }}>
                      <img
                        src="https://via.placeholder.com/70"
                        alt="Profile"
                        className="rounded-circle border border-2 shadow-sm w-100 h-100 object-fit-cover"
                      />
                      <div
                        className="position-absolute top-50 start-50 translate-middle bg-dark bg-opacity-50 text-white rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: "70px", height: "70px", cursor: "pointer" }}
                      >
                        <IoCloudUploadOutline className="fs-3" />
                      </div>
                    </div>
                    <div>
                      <p className="mb-1 fw-semibold text-dark">Change profile photo</p>
                      <small className="text-muted">Make sure the file is below 2 Mb</small>
                    </div>
                  </div>

                  {/* Company Info */}
                  <form className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Company Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Company Name"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter Email Address"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Phone Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="Enter Phone Number"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Fax</label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="Enter Fax"
                      />
                    </div>

                    {/* Address Section */}
                    <div className="col-12 mt-4">
                      <h6 className="mb-3 text-secondary">Address Information</h6>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Country</label>
                      <input type="text" className="form-control" placeholder="Enter Country" />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">City</label>
                      <input type="text" className="form-control" placeholder="Enter City" />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Street</label>
                      <input type="text" className="form-control" placeholder="Enter Street" />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Postal Code</label>
                      <input type="text" className="form-control" placeholder="Enter Postal Code" />
                    </div>
                  </form>
                </div>

                {/* Preview Sidebar */}
                <div className="card p-3" style={{ width: "400px", backgroundColor: "#f8f9fa" }}>
                  <h6 className="mb-3 text-secondary">Preview</h6>
                  <p className="text-muted">Your settings preview will appear here.</p>
                </div>
              </div>
            </>
          )}
          {activeTab === "security" && (
            <div className="card p-4">
              <h6 className="mb-4 text-secondary">Security Settings</h6>
              <form className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Current Password</label>
                  <input type="password" className="form-control" placeholder="Enter Current Password" />
                </div>
                <div className="col-md-6"></div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">New Password</label>
                  <input type="password" className="form-control" placeholder="Enter New Password" />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Confirm Password</label>
                  <input type="password" className="form-control" placeholder="Confirm New Password" />
                </div>
              </form>
            </div>
          )}
          {activeTab === "team" && (
            <div className="card p-4">
              <h6 className="mb-4 text-secondary">Members & Team</h6>
              <p className="text-muted">Team management content here...</p>
            </div>
          )}
          {activeTab === "notifications" && (
            <div className="card p-4">
              <h6 className="mb-4 text-secondary">Notification Preferences</h6>
              <p className="text-muted">Notification settings content here...</p>
            </div>
          )}
        </div>
      </div>






    </>
  );
}

