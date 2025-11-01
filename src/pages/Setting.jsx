import React from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import { IoCloudUploadOutline } from "react-icons/io5"; // icon for upload
import Nav from "react-bootstrap/Nav";
import { useState } from "react";
import { FaPlus, FaEdit } from "react-icons/fa";
import Createuser from "../ui/createuser";
import { Button } from "react-bootstrap";
// import Createuser from "../ui/Createuser";

export default function Setting() {
  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const tabs = [
    { key: "general", label: "General" },
    { key: "security", label: "Security" },
    { key: "business", label: "Your Business" },
    { key: "user", label: "User" },
    { key: "notifications", label: "Notifications" },
    { key: "preferences", label: "Preferences" },
  ];
  const [settings, setSettings] = useState({
    creativeEffects: true,
    productUpdates: true,
    discoverUpdates: true,
    researchSurveys: true,
  });
  const [users, setUsers] = useState([
    {
      firstName: "Samrat",
      lastName: "Hamal",
      email: "samrat@test.com",
      phone: "981239899",
      status: true,
    },
    {
      firstName: "Puja",
      lastName: "Dawadi",
      email: "puja@gmail.com",
      phone: "983758245",
      status: true,
    },
  ]);

  const toggleSetting = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const toggleStatus = (index) => {
    const updated = [...users];
    updated[index].status = !updated[index].status;
    setUsers(updated);
  };

  const [activeTheme, setActiveTheme] = useState("light");
  const themes = [
    {
      id: "light",
      name: "Light mode",
      color: "bg-gray-200",
      active: "bg-teal-700",
    },
    {
      id: "dark",
      name: "Dark mode",
      color: "bg-gray-900",
      active: "bg-teal-800",
    },
    {
      id: "red",
      name: "Red Mode",
      color: "bg-red-600",
      active: "bg-red-800",
    },
    {
      id: "custom",
      name: "Custom color",
      color: "bg-blue-600",
      active: "bg-blue-800",
    },
  ];

  return (
    <>
      {/* ===== Header Section ===== */}
      <div className="d-flex flex-wrap align-items-center justify-content-between bg-light text-dark p-3 rounded-3 border">
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-outline-secondary btn-sm p-1">
            <IoChevronBackOutline className="fs-5" />
          </button>
          <h5 className="mb-0">Create Product</h5>
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
                className={`px-0 pb-2 border-0 ${
                  activeTab === tab.key
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
              <div className="flex">
                <div>
                  <div className="mt-3">
                    <h5 className="ps-4">General</h5>
                  </div>

                  {/* ===== Profile Change Section ===== */}
                  <div className="d-flex align-items-center gap-3 mt-3 ps-4">
                    <div
                      className="position-relative"
                      style={{ width: "70px", height: "70px" }}
                    >
                      <img
                        src="https://via.placeholder.com/70" // replace with your profile image
                        alt="Profile"
                        className="rounded-circle border-2 border-white shadow-sm w-100 h-100 object-fit-cover"
                      />
                      <div
                        className="position-absolute top-50 start-50 translate-middle bg-dark bg-opacity-50 text-white rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "70px",
                          height: "70px",
                          cursor: "pointer",
                        }}
                      >
                        <IoCloudUploadOutline className="fs-3" />
                      </div>
                    </div>
                    <div>
                      <p className="mb-1 fw-semibold text-dark">
                        Change profile photo
                      </p>
                      <small className="text-muted">
                        Make sure the file is below 2 Mb
                      </small>
                    </div>
                  </div>

                  {/* ===== Main Form + Sidebar ===== */}

                  <div className="d-flex gap-4 mt-4">
                    {/* ===== Left Form Section ===== */}

                    <div className="flex-fill px-4">
                      {/* Company Info */}
                      <form className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Company Name{" "}
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Company Name"
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Email/Address{" "}
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Enter Email/Address"
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Phone Number{" "}
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Enter Phone Number"
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-semibold">Fax </label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Enter Fax"
                          />
                        </div>
                      </form>

                      {/* Address Section */}
                      <div className="mt-5">
                        <h5 className="mb-4 text-dark">Address</h5>
                        <form className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label fw-semibold">
                              Country{" "}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Country"
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-semibold">
                              City{" "}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter City"
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-semibold">
                              Street{" "}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Street"
                            />
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="card p-4 shadow-sm"
                  style={{ width: "600px", backgroundColor: "#f8f9fa" }}
                >
                  <h6 className="mb-3 text-secondary">Product Preview</h6>
                  <p className="text-muted">
                    Your product info preview will appear here.
                  </p>
                </div>
              </div>
            </>
          )}
          {activeTab === "security" && (
            <p className="text-muted">Security settings content here...</p>
          )}
          {activeTab === "user" && (
            <>
              <div className="container mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">User Management</h5>
                </div>

                {/* Top Controls */}
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <input
                    type="text"
                    placeholder="Search this table"
                    className="form-control w-25"
                  />
                  <div className="d-flex gap-2">
                    <div className="p-4">
                      <Button onClick={() => setShow(true)}>Create </Button>
                      <Createuser
                        show={show}
                        handleClose={() => setShow(false)}
                      />
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="table-responsive  rounded">
                  <table className="table table-bordered align-middle">
                    <thead className="table-light">
                      <tr
                        style={{
                          fontWeight: 600,
                          fontSize: "16px",
                          lineHeight: "19px",
                        }}
                      >
                        <td>First Name</td>
                        <td>Last Name</td>

                        <td>Email</td>
                        <td>Phone</td>
                        <td>Status</td>
                        <td>Action</td>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u, i) => (
                        <tr key={i}>
                          <td>{u.firstName}</td>
                          <td>{u.lastName}</td>

                          <td>{u.email}</td>
                          <td>{u.phone}</td>
                          <td>
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={u.status}
                                onChange={() => toggleStatus(i)}
                              />
                            </div>
                          </td>
                          <td>
                            <button className="btn btn-outline-success btn-sm">
                              <FaEdit />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === "business" && (
            <>
              <div className="flex">
                <div style={{ width: "80%" }}>
                  <div className="mt-3">
                    <h5 className="ps-4">Your Business</h5>
                  </div>
                  <div className="mt-3 ml-5" style={{ maxWidth: "600px" }}>
                    <div className="d-flex justify-content-between align-items-center mb-4  ">
                      <div className="mt-2 ">
                        <h6 className="fw-semibold mb-1 ">
                          Invoice No. starts with
                        </h6>
                      </div>
                      <input
                        type="text"
                        className="form-control w-50  "
                        placeholder=""
                        value="INVXXX"
                      />
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div>
                        <h6 className="fw-semibold mb-1">
                          Payment Receipt starts with
                        </h6>
                      </div>
                      <input
                        type="text"
                        className="form-control w-50 "
                        placeholder=""
                        value="RECXXX"
                      />
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div>
                        <h6 className="fw-semibold mb-1">Currency</h6>
                      </div>
                      <select className="form-select w-50">
                        <option value="">Select currency</option>
                        <option value="USD">USD – US Dollar</option>
                        <option value="EUR">EUR – Euro</option>
                        <option value="GBP">GBP – British Pound</option>
                        <option value="NPR">NPR – Nepalese Rupee</option>
                        <option value="INR">INR – Indian Rupee</option>
                      </select>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="fw-semibold mb-1">Language</h6>
                      </div>
                      <select className="form-select w-50">
                        <option value="">Select language</option>
                        <option value="en">English</option>
                        <option value="np">Nepali</option>
                        <option value="fr">French</option>
                        <option value="es">Spanish</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div
                  className="card p-4 shadow-sm"
                  style={{ width: "50%", backgroundColor: "#f8f9fa" }}
                >
                  <h6 className="mb-3 text-secondary">Product Preview</h6>
                  <p className="text-muted">
                    Your product info preview will appear here.
                  </p>
                </div>
              </div>
            </>
          )}

          {activeTab === "notifications" && (
            <>
              <div className="flex">
                <div>
                  <div className="mt-3">
                    <h5 className="ps-4">Notification</h5>
                  </div>

                  {/* Setting Item */}
                  {[
                    {
                      key: "Update Me On Invoice Updates",
                      title: "Update Me On Invoice Updates",
                      desc: "You will get notified on invoice create and update",
                    },
                    {
                      key: "When Payment Received",
                      title: "When Payment Received",
                      desc: "You will get notified when payment is received ",
                    },
                    {
                      key: "Customer Create",
                      title: "Customer Create",
                      desc: "You will get notified when customer is created",
                    },
                    {
                      key: "Record Deleted",
                      title: "Record Deleted",
                      desc: "You will get notified when customer is created",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="d-flex align-items-center justify-content-between  py-3"
                    >
                      {/* Toggle on left */}
                      <div className="form-check form-switch me-3 ml-5">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={settings[item.key]}
                          onChange={() => toggleSetting(item.key)}
                          style={{
                            width: "2.5rem",
                            height: "1.3rem",
                            cursor: "pointer",
                          }}
                        />
                      </div>

                      {/* Text content */}
                      <div className="flex-grow-1">
                        <p className="fw-semibold mb-0">{item.title}</p>
                        <small className="text-muted">{item.desc}</small>
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  className="card p-4 shadow-sm ml-100"
                  style={{ width: "600px", backgroundColor: "#f8f9fa" }}
                >
                  <h6 className="mb-3 text-secondary">Product Preview</h6>
                  <p className="text-muted">
                    Your product info preview will appear here.
                  </p>
                </div>
              </div>
            </>
          )}

          {activeTab === "preferences" && (
            <>
              <div>
                <div className="min-h-screen bg-white text-gray-900  ">
                  {/* Header
      <div className=" pb-1 mb-1 shadow-sm border-b border-gray-200">
        <h1 className="text-sm font-semibold">Preferences</h1>
        <p className="text-xs text-gray-500">
          Customize until it matches your workflows
        </p>
      </div> */}

                  {/* Select Theme */}
                  <div className="mb-10 px-4 ">
                    <h2 className="text-xs mb-3">Select Theme</h2>
                    <div className="flex gap-8">
                      {themes.map((theme) => (
                        <div
                          key={theme.id}
                          onClick={() => setActiveTheme(theme.id)}
                          className={`cursor-pointer border-4 rounded-xl overflow-hidden w-[220px] transition-all duration-300 ${
                            activeTheme === theme.id
                              ? "border-gray-800 shadow-lg"
                              : "border-gray-200"
                          }`}
                        >
                          {/* Preview */}
                          <div className={`h-[130px] flex`}>
                            <div className={`flex-1 ${theme.color}  `}>
                              <div className="flex flex-col space-y-4 my-3 px-1">
                                <div className="h-6 w-auto bg-white"></div>
                                <div className="h-6 w-auto bg-white"></div>
                                <div className="h-6 w-auto bg-white"></div>
                              </div>
                            </div>
                            <div className={`flex-[1.5] ${theme.active}`}>
                              <div className="flex flex-col space-y-4 my-3 px-1">
                                <div className="h-[104px] w-auto bg-white"></div>
                              </div>
                            </div>
                          </div>

                          {/* Label */}
                          <div className="py-3 text-center text-sm font-medium">
                            {theme.name}
                            {activeTheme === theme.id && (
                              <span className="text-xs ml-1 text-gray-500">
                                (Active)
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Settings */}
                  <div className="space-y-6 px-4">
                    <div>
                      <label className="block text-lg font-medium mb-2">
                        Time zone
                      </label>
                      <select className="w-full border rounded-lg p-2 text-sm text-gray-600">
                        <option>(UTC)_time.........</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-lg font-medium mb-2">
                        Language
                      </label>
                      <select className="w-full border rounded-lg p-2 text-sm text-gray-600">
                        <option>English (US)</option>
                        <option>English (UK)</option>
                        <option>Nepali (NP)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-lg font-medium mb-2">
                        Sidebar size
                      </label>
                      <select className="w-full border rounded-lg p-2 text-sm text-gray-600">
                        <option>small (12px)</option>
                        <option>medium (14px)</option>
                        <option>large (16px)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
