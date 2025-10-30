import { useEffect, useState } from "react";
import Sales from "./sales";
import Home from "./Home";
import CardPage from "./pages/card";
import "bootstrap/dist/css/bootstrap.min.css";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
import { FaGoogleDrive } from "react-icons/fa";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import InvoicePage from "./pages/InvoicePage";
import Invoices from "./Invoices";
import Payment from "./Payment";
import SignIn from "./SignIn";
import axios from "axios";
import company from "./assets/company.jpg";

import Purchase from "./pages/Purchase";
import Inventory from "./pages/Inventory";
import Customers from "./Customers";
import { IoSettingsOutline } from "react-icons/io5";
import { FaBell } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { IoSunny } from "react-icons/io5";
import { IoMoon } from "react-icons/io5";
import axiosInstance from "./axiosConfig";
import AddProduct from "./pages/AddProduct";
import { appBase } from "./store/appBase";
import { salesInvoiceState } from "./store/salesInvoiceState";
import { themeBase } from "./store/themeBase";
import Setting from "./pages/Setting";
import SignUp from "./Auth/Signup.jsx";
import CustomerLedger from "./pages/CustomerLedger";
import InventoryDetail from "./pages/InventoryDetail";
import Drive from "./Drive";
import FileSidebar from "./FileSidebar";
import BankManagement from "./pages/BankManagement";
import BankAdd from "./ui/BankAdd";
import DisplayBank from "./ui/DisplayBank";

function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}

function MainApp() {
  // const {theme, setTheme} = appBase();
  const { theme } = themeBase();

  // FETCHING DATAS FOR INITIAL LOAD
  const { fetchSalesInvoices } = salesInvoiceState();

  const [showPaymentSlide, setShowPaymentSlide] = useState(false);
  const [showFileSidebar, setShowFileSidebar] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [invoicesOpen, setInvoicesOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [customersOpen, setCustomersOpen] = useState(false);

  const [userInfo, setUserInfo] = useState();

  const [searchVal, setSearchVal] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const paths = [
    { path: "/", searchPath: "dashboard" },
    { title:"Invoices", path: "/invoices", searchPath: "invoices", desc:"Search invoices by clicking here" },
    {title:"Invoices", path:"/card", searchPath:"create invoice", desc:"Create a brand new invoices by clicking here"},
    {title:"Invoices" ,path:"/invoices/reports", searchPath:"reports", desc:"See the reports of invoices by clicking here"},
    {title:"Purchase", path: "/purchase", searchPath: "purchase invoice", desc:"Create a brand new pruchase invoices by clicking here"},
    {title:"Customers", path: "/customers", searchPath: "customers", desc:"See all the customers by clicking here" },
    {title:"Customers", path:"/customers/create", searchPath:"add customers", desc:"Add new customers by clicking here"},
    {title:"Payment",path:"/payment", searchPath:"payment", desc:""},
    {title:"", path: "/suppliers", searchPath: "suppliers", desc:"" },
    {title:"Inventory", path: "/inventory", searchPath: "inventory", desc:"See all the products by clicking here" },
    {title:"Inventory", path:"/inventory/reports", searchPath:"stock reports", desc:"See the inventory reports by clicking here"},
    {title:"Inventory", path: "/addproduct", searchPath: "add product", desc:"Create a new products by clicking here " },
    {title:"Bank Management", path:"/bankmanagement", searchPath:"bank management", desc:"See the banks details by clcking here"},
    {title:"Settings", path:"/settings", searchPath:"settings", desc:"See the setting "},
    {title:"Profile", path:"profile", searchPath:"profile", desc:"See the profile"},
  ];

  const navigator = useNavigate();
  const [authCheck, setAuthCheck] = useState(true);
  const location = useLocation(); // ✅ Now inside BrowserRouter
  const path = location.pathname;

  const isSignInPage = path === "/signup";

  // const checkLoginInfo = () => {
  //   console.log("Checking for Login Session");
  //   let sessionToken = localStorage.getItem("login_token");
  //   console.log("Session Token:", sessionToken);
  //   axiosInstance
  //     .post(
  //       "/auth/me",
  //       {},
  //       {
  //         headers: {
  //           Authorization: `Bearer ${sessionToken}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     )
  //     .then((resp) => {
  //       if (resp.data.name) {
  //         console.log(resp);
  //         setUserInfo(resp.data);
  //       } else {
  //         navigator("/signin");
  //       }
  //       setAuthCheck(false);
  //     })
  //     .catch((ex) => {
  //       navigator("/signin");
  //       setAuthCheck(false);
  //     });
  // };

  // useEffect(() => {
  //   checkLoginInfo();
  //   // CALLING THOSE STATES
  //   fetchSalesInvoices();

  //   const savedTheme = localStorage.getItem("theme");
  //   if (savedTheme === "dark") {
  //     setDarkMode(true);
  //     document.documentElement.classList.add("dark");
  //   } else {
  //     setDarkMode(false);
  //     document.documentElement.classList.remove("dark");
  //   }
  // }, []);

  // if (authCheck)
  //   return (
  //     <>
  //       <h2>Wait I am Checking</h2>
  //     </>
  //   );

  if (isSignInPage) {
    return <SignUp />;
  }

  // const toggleTheme = () => {
  //   if (darkMode) {
  //     localStorage.setItem("theme", "light");
  //     setDarkMode(false);
  //   } else {
  //     localStorage.setItem("theme", "dark");
  //     setDarkMode(true);
  //   }
  // };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchVal(value);
    if (value.trim() === "") {
      setSuggestions([]);
    } else {
      const filtered = paths.filter((p) =>
        p.searchPath.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setActiveIndex(0);
    }
  };

  const handleSuggestionClick = (item) => {
    setSearchVal(item.searchPath);
    setSuggestions([]);
    console.log(item.path);
    navigator(item.path);
  };

  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev === 0 ? suggestions.length - 1 : prev - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = suggestions[activeIndex];
      if (selected) {
        w;
        setSearchVal(selected.searchPath);
        setSuggestions([]);
        navigator(selected.path);
      }
    }
  };


  return (
    <>
      {/* Header */}
      <div
        className="bg-white container-xxl "
        style={{
          height: "103px",
          position: "fixed",
          zIndex: 1000,
          width: "100%",
        }}
      >
        <header
          className="d-flex justify-content-between align-items-center px-0 m-0"
          style={{ height: "55px" }}
        >
          {/* Logo Section */}
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <div
                style={{
                  backgroundColor: "#1a1a1a",
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i
                  className="bi bi-receipt-cutoff text-white"
                  style={{ fontSize: "20px" }}
                ></i>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#1a1a1a",
                    letterSpacing: "-0.5px",
                    lineHeight: "1",
                  }}
                >
                  Alphid - <span style={{ fontWeight: "light" }}>EMS</span>
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#6b7280",
                    letterSpacing: "0.3px",
                  }}
                >
                  Business Management
                </div>
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div style={{ flex: "0 1 480px" }}>
            <div className="position-relative">
              <i
                className="bi bi-search position-absolute"
                style={{
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                  fontSize: "15px",
                }}
              ></i>
              <div className="relative">
                {/* INPUT WRAPPER */}
                <div className="relative">
                  <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-lg " />
                  <input
                    type="text"
                    placeholder="Search invoices, customers, products..."
                    className="form-control"
                    style={{
                      paddingLeft: "42px",
                      paddingRight: "42px",
                      height: "42px",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      fontSize: "14px",
                      width: "100%",
                      backgroundColor: "#f9fafb",
                      transition: "all 0.2s",
                    }}
                    value={searchVal}
                    onChange={handleSearch}
                    onKeyDown={handleKeyDown}
                    onFocus={(e) => {
                      e.target.style.backgroundColor = "#ffffff";
                      e.target.style.borderColor = "#1a1a1a";
                    }}
                    onBlur={(e) => {
                      e.target.style.backgroundColor = "#f9fafb";
                      e.target.style.borderColor = "#e5e7eb";
                    }}
                  />
                  {/* <input
                    type="text"
                    placeholder="Search"
                    className="pl-10 border-1 rounded-sm border-gray-500  pr-13 py-2 w-full"
                    value={searchVal}
                    onChange={handleSearch}
                    onKeyDown={handleKeyDown}
                  /> */}
                  <div
                    className="absolute right-4 top-3 text-xl cursor-pointer"
                    onClick={() => {
                      setSearchVal("");
                      setSuggestions([]);
                    }}
                  >
                    <IoClose />
                  </div>
                </div>

                {/* DROPDOWN SUGGESTION BOX */}
                {suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-md z-50">
                    {suggestions.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => handleSuggestionClick(item)}
                        className={`px-3 flex items-center gap-2 py-2 cursor-pointer ${
                          index === activeIndex
                            ? "bg-gray-200 text-black"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {/* <HiMagnifyingGlass className="text-gray-500" /> */}
                        {/* <span>/</span>
                        <span className="">{item.searchPath}</span> */}
                        <div className="d-flex justify-content-start align-items-center gap-2 ">
                          <div
                            className="cursor-pointer"
                            style={{
                              width: "45px",
                              height: "45px",
                              background: "rgba(0,0,0,0.1)",
                              borderRadius: "10px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <i className="bi bi-slash"></i>
                          </div>
                          <div className="d-flex flex-column m-0 p-0 cursor-pointer">
                            <h6 className="mb-0 capitalize  ">
                              {item.searchPath}
                            </h6>
                            <small className="text-muted">
                              Here is the path for - {item.searchPath}
                            </small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* <input
                type="text"
                placeholder="Search invoices, customers, products..."
                className="form-control"
                style={{
                  paddingLeft: "42px",
                  paddingRight: "42px",
                  height: "42px",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  fontSize: "14px",
                  backgroundColor: "#f9fafb",
                  transition: "all 0.2s",
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = "#ffffff";
                  e.target.style.borderColor = "#1a1a1a";
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = "#f9fafb";
                  e.target.style.borderColor = "#e5e7eb";
                }}
              /> */}
              <div
                className="position-absolute d-flex align-items-center gap-1"
                style={{
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "11px",
                  color: "#9ca3af",
                  backgroundColor: "#e5e7eb",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontWeight: "500",
                }}
              >
                <span>⌘</span>
                <span>K</span>
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="d-flex align-items-center gap-4">
            {/* Theme Toggle */}
            <div
              onClick={toggleTheme}
              className="position-relative d-flex align-items-center"
              style={{
                backgroundColor: darkMode ? "#1a1a1a" : "#e5e7eb",
                width: "52px",
                height: "26px",
                borderRadius: "13px",
                cursor: "pointer",
                transition: "background-color 0.3s",
                border: darkMode
                  ? "1px solid #4b5563"
                  : "1px solid transparent",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "white",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                  transition: "transform 0.3s",
                  transform: darkMode ? "translateX(28px)" : "translateX(3px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {darkMode ? (
                  <IoMoon style={{ fontSize: "11px", color: "#1a1a1a" }} />
                ) : (
                  <IoSunny style={{ fontSize: "11px", color: "#f59e0b" }} />
                )}
              </div>
            </div>

            {/* Vertical Divider */}
            <div
              style={{
                width: "1px",
                height: "28px",
                backgroundColor: "#e5e7eb",
              }}
            ></div>

            {/* Settings Icon */}
            <Link to="/settings" className="text-decoration-none">
              <div
                className="position-relative"
                style={{ cursor: "pointer", padding: "6px" }}
              >
                <IoSettingsOutline
                  style={{ fontSize: "22px", color: "#4b5563" }}
                />
              </div>
            </Link>

            {/* Notifications */}
            <div
              className="position-relative"
              style={{ cursor: "pointer", padding: "6px" }}
            >
              <FaBell style={{ fontSize: "20px", color: "#4b5563" }} />
              <span
                style={{
                  position: "absolute",
                  top: "2px",
                  right: "2px",
                  backgroundColor: "#1a1a1a",
                  color: "white",
                  borderRadius: "50%",
                  width: "18px",
                  height: "18px",
                  fontSize: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  border: "2px solid white",
                }}
              >
                3
              </span>
            </div>

            {/* User Profile */}
            <div
              className="d-flex align-items-center gap-2 ps-3"
              style={{ cursor: "pointer", borderLeft: "1px solid #e5e7eb" }}
            >
              <img
                src={company}
                alt="User"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "2px solid #e5e7eb",
                  objectFit: "cover",
                }}
              />
              <div className="d-none d-lg-block">
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#1a1a1a",
                    lineHeight: "1.2",
                  }}
                >
                  {userInfo?.name || "Admin User"}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#6b7280",
                    lineHeight: "1.2",
                  }}
                >
                  Administrator
                </div>
              </div>
              <i
                className="bi bi-chevron-down"
                style={{
                  fontSize: "11px",
                  color: "#9ca3af",
                  marginLeft: "4px",
                }}
              ></i>
            </div>
          </div>
        </header>

        <div className="flex items-center justify-between pr-10 border-bottom">
          <header className="m-0 py-2 d-flex gap-2 border-bottom">
            <Link to="/product">
              {" "}
              <button className="btn btn-primary btn-sm">
                <i className="bi bi-plus"></i> Products
              </button>
            </Link>
            <Link to="/order">
              {" "}
              <button className="btn btn-primary btn-sm">
                <i className="bi bi-plus"></i> Order
              </button>
            </Link>
            <button className="btn btn-primary btn-sm">Reports</button>
            <button className="btn btn-primary btn-sm">Settings</button>
          </header>
          <div className="flex gap-6">
            <div
              onClick={() => setShowFileSidebar(true)}
              className="border-2 px-3 py-1 rounded-md text-semibold cursor-pointer"
            >
              {" "}
              <span className="pr-2">+</span> Sidebar
            </div>
            <Link to="/card" className="text-decoration-none">
              <div className="border-2 text-black  px-3 py-1 rounded-md text-semibold cursor-pointer">
                {" "}
                <span className="pr-2 ">+</span> Create Invoice
              </div>
            </Link>
            <div
              onClick={() => setShowPaymentSlide(true)}
              className="border-2 px-3 py-1 rounded-md text-semibold cursor-pointer"
            >
              {" "}
              <span className="pr-2">+</span> Create Payment
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar + Main */}
      <div className="row m-0 p-0 box">
        {/* Sidebar */}
        <div
          className="col-2 vh-100 bg-white border-end"
          style={{ paddingTop: "110px", overflowY: "auto" }}
        >
          {/* Dashboard */}
          <Link
            to="/"
            className={`sidebar-menu-item d-flex align-items-center gap-2 px-3 py-2  ${
              path === "/" ? "active" : ""
            }`}
          >
            <i className="bi bi-house sidebar-icon"></i>
            <span>Dashboard</span>
          </Link>

          {/* Sales Section */}
          <div className="mb-2 mt-3">
            <div className="px-3 py-1">
              <span className="sidebar-section-header">Sales</span>
            </div>
            <div>
              {/* Invoices with submenu */}
              <div>
                <div
                  className="sidebar-toggle d-flex align-items-center justify-content-between px-3 py-2"
                  onClick={() => setInvoicesOpen(!invoicesOpen)}
                >
                  <div className="d-flex align-items-center gap-2 fw-semibold">
                    <i className="bi bi-file-earmark-text sidebar-icon"></i>
                    <span style={{ fontSize: "14px" }}>Invoices</span>
                  </div>
                  <i
                    className={`bi bi-chevron-${
                      invoicesOpen ? "down" : "right"
                    } sidebar-chevron`}
                  ></i>
                </div>
                {invoicesOpen && (
                  <div className="ps-4">
                    <Link
                      to="/invoices"
                      className={`sidebar-submenu-item d-flex align-items-center gap-2 px-3 py-1 ${
                        path === "/invoices" ? "active" : ""
                      }`}
                    >
                      <i className="bi bi-list-ul sidebar-icon-sm"></i>
                      <span>All Invoices</span>
                    </Link>
                    <Link
                      to="/card"
                      className={`sidebar-submenu-item d-flex align-items-center gap-2 px-3 py-1 ${
                        path === "/card" ? "active" : ""
                      }`}
                    >
                      <i className="bi bi-plus-circle sidebar-icon-sm"></i>
                      <span>Create Invoice</span>
                    </Link>
                    <Link
                      to="/invoices/reports"
                      className={`sidebar-submenu-item d-flex align-items-center gap-2 px-3 py-1 ${
                        path === "/invoices/reports" ? "active" : ""
                      }`}
                    >
                      <i className="bi bi-graph-up sidebar-icon-sm"></i>
                      <span>Reports</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Customers with submenu */}
              <div>
                <div
                  className="sidebar-toggle d-flex align-items-center justify-content-between px-3 py-2"
                  onClick={() => setCustomersOpen(!customersOpen)}
                >
                  <div className="d-flex align-items-center gap-2 fw-semibold">
                    <i className="bi bi-people sidebar-icon"></i>
                    <span style={{ fontSize: "14px" }}>Customers</span>
                  </div>
                  <i
                    className={`bi bi-chevron-${
                      customersOpen ? "down" : "right"
                    } sidebar-chevron`}
                  ></i>
                </div>
                {customersOpen && (
                  <div className="ps-4">
                    <Link
                      to="/customers"
                      className={`sidebar-submenu-item d-flex align-items-center gap-2 px-3 py-1 ${
                        path === "/customers" ? "active" : ""
                      }`}
                    >
                      <i className="bi bi-list-ul sidebar-icon-sm"></i>
                      <span>All Customers</span>
                    </Link>
                    <Link
                      to="/customers/create"
                      className={`sidebar-submenu-item d-flex align-items-center gap-2 px-3 py-1 ${
                        path === "/customers/create" ? "active" : ""
                      }`}
                    >
                      <i className="bi bi-plus-circle sidebar-icon-sm"></i>
                      <span>Add Customer</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Payment */}
              <Link
                to="/payment"
                className={`sidebar-menu-item d-flex align-items-center gap-2 px-3 py-2 ${
                  path === "/payment" ? "active" : ""
                }`}
              >
                <i className="bi bi-credit-card sidebar-icon"></i>
                <span>Payments</span>
              </Link>
            </div>
          </div>

          {/* Inventory Section */}
          <div className="mb-2">
            <div className="px-3 py-1">
              <span className="sidebar-section-header">Inventory</span>
            </div>
            <div>
              {/* Inventory with submenu */}
              <div>
                <div
                  className="sidebar-toggle d-flex align-items-center justify-content-between px-3 py-2"
                  onClick={() => setInventoryOpen(!inventoryOpen)}
                >
                  <div className="d-flex align-items-center gap-2 fw-semibold">
                    <i className="bi bi-box-seam sidebar-icon"></i>
                    <span style={{ fontSize: "14px" }}>Products</span>
                  </div>
                  <i
                    className={`bi bi-chevron-${
                      inventoryOpen ? "down" : "right"
                    } sidebar-chevron`}
                  ></i>
                </div>
                {inventoryOpen && (
                  <div className="ps-4">
                    <Link
                      to="/inventory"
                      className={`sidebar-submenu-item d-flex align-items-center gap-2 px-3 py-1 ${
                        path === "/inventory" ? "active" : ""
                      }`}
                    >
                      <i className="bi bi-list-ul sidebar-icon-sm"></i>
                      <span>All Products</span>
                    </Link>
                    <Link
                      to="/addproduct"
                      className={`sidebar-submenu-item d-flex align-items-center gap-2 px-3 py-1 ${
                        path === "/addproduct" ? "active" : ""
                      }`}
                    >
                      <i className="bi bi-plus-circle sidebar-icon-sm"></i>
                      <span>Add Product</span>
                    </Link>
                    <Link
                      to="/inventory/reports"
                      className={`sidebar-submenu-item d-flex align-items-center gap-2 px-3 py-1 ${
                        path === "/inventory/reports" ? "active" : ""
                      }`}
                    >
                      <i className="bi bi-graph-up sidebar-icon-sm"></i>
                      <span>Stock Reports</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Purchase */}
              <Link
                to="/purchase"
                className={`sidebar-menu-item d-flex align-items-center gap-2 px-3 py-2 ${
                  path === "/purchase" ? "active" : ""
                }`}
              >
                <i className="bi bi-bag sidebar-icon"></i>
                <span>Purchases</span>
              </Link>
              <Link
                to="/drive"
                className={`sidebar-menu-item d-flex align-items-center gap-2 px-3 py-2 ${
                  path === "/drive" ? "active" : ""
                }`}
              >
                <FaGoogleDrive />
                <span>Drive</span>
              </Link>
               <Link
                to="/bankmanagement"
                className={`sidebar-menu-item d-flex align-items-center gap-2 px-3 py-2 ${
                  path === "/bankmanagement" ? "active" : ""
                }`}
              >
                <i class="bi bi-bank"></i>
                <span>Bank Management</span>
              </Link>

            </div>
          </div>

          {/* Settings & Profile Section */}
          <div className="mb-2 mt-4 border-top pt-3">
            <Link
              to="/settings"
              className={`sidebar-menu-item d-flex align-items-center gap-2 px-3 py-2 ${
                path === "/settings" ? "active" : ""
              }`}
            >
              <i className="bi bi-gear sidebar-icon"></i>
              <span>Settings</span>
            </Link>
            <Link
              to="/profile"
              className={`sidebar-menu-item d-flex align-items-center gap-2 px-3 py-2 ${
                path === "/profile" ? "active" : ""
              }`}
            >
              <i className="bi bi-person-circle sidebar-icon"></i>
              <span>Profile</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-10 vh-100 bg-white" style={{ overflowY: "scroll" }}>
          <div style={{ height: "110px" }}></div>
          <Routes>
            <Route authUser={userInfo} path="/" element={<Home />}></Route>
            <Route
              authUser={userInfo}
              path="/sales"
              element={<Sales />}
            ></Route>
            <Route
              authUser={userInfo}
              path="/card"
              element={<CardPage />}
            ></Route>
            <Route
              authUser={userInfo}
              path="/invoicepage/:id"
              element={<InvoicePage />}
            ></Route>
            <Route
              authUser={userInfo}
              path="/invoices"
              element={<Invoices />}
            />
            {/* <Route authUser={userInfo} path="/signin" element={<SignIn />} /> */}
            <Route authUser={userInfo} path="/signup" element={<SignUp />} />
          
            <Route
              authUser={userInfo}
              path="/purchase"
              element={<Purchase />}
            />
            <Route
              authUser={userInfo}
              path="/inventory"
              element={<Inventory />}
            />
            <Route
              authUser={userInfo}
              path="/inventory/:id"
              element={<InventoryDetail />}
            />
            <Route
              authUser={userInfo}
              path="/customers"
              element={<Customers />}
            />
            <Route
              authUser={userInfo}
              path="/addproduct"
              element={<AddProduct />}
            ></Route>
            <Route
              authUser={userInfo}
              path="/settings"
              element={<Setting />}
            ></Route>
            <Route authUser={userInfo} path="/drive" element={<Drive />} />
            <Route
            authUser={userInfo}
            path="/bankmanagement"
            element={<BankManagement/>}
            />
            <Route
            authUser={userInfo}
            path="/bankadd"
            element={<BankAdd/>}
            />
            <Route 
            authUser={userInfo}
            path="displaybank"
            element={<DisplayBank/>}
            />

            

            

            

            <Route
              authUser={userInfo}
              path="/customer-ledger/:id"
              element={<CustomerLedger />}
            />
          </Routes>
        </div>
      </div>
      <div
        /* Overlay container: always mounted so transitions can run */
        className={`fixed inset-0 z-[9999] flex justify-end transition-all duration-200 ${
          showPaymentSlide || showFileSidebar
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* backdrop (frosted glass) */}
        <div
          className={`absolute inset-0 backdrop-blur-none cursor-pointer transition-opacity duration-200 ${
            showPaymentSlide || showFileSidebar
              ? "bg-black/60 opacity-100"
              : "bg-transparent opacity-0"
          }`}
          onClick={() => {setShowPaymentSlide(false); setShowFileSidebar(false)}} // click outside to close
        />

        {/* Payment panel (slide-in) */}
        {showPaymentSlide && (
          <Payment
          show={showPaymentSlide}
          setShowPaymentSlide={setShowPaymentSlide}
        />
        )}

        {showFileSidebar && (
          <FileSidebar
          show={showFileSidebar}
          setShowFileSidebar={setShowFileSidebar}
        />
        )}
      </div>
    </>
  );
}

export default App;
