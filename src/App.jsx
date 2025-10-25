import { useEffect, useState } from "react";
import Sales from "./sales";
import Home from "./Home";
import CardPage from "./pages/card";
import "bootstrap/dist/css/bootstrap.min.css";
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

function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}

function MainApp() {
  const [showPaymentSlide, setShowPaymentSlide] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [invoicesOpen, setInvoicesOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [customersOpen, setCustomersOpen] = useState(false);

  const [userInfo, setUserInfo] = useState();
  const navigator = useNavigate();
  const [authCheck, setAuthCheck] = useState(true);
  const location = useLocation(); // ✅ Now inside BrowserRouter
  const path = location.pathname;

  const isSignInPage = path === "/signin";

  const checkLoginInfo = () => {
    console.log("Checking for Login Session");
    let sessionToken = localStorage.getItem("login_token");
    console.log("Session Token:", sessionToken);
    axiosInstance
      .post(
        "/auth/me",
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((resp) => {
        if (resp.data.name) {
          console.log(resp);
          setUserInfo(resp.data);
        } else {
          navigator("/signin");
        }
        setAuthCheck(false);
      }).catch(ex => {
        navigator("/signin");
        setAuthCheck(false);

      });
  };

  useEffect(() => {
    checkLoginInfo();

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  if (authCheck)
    return (
      <>
        <h2>Wait I am Checking</h2>
      </>
    );

  if (isSignInPage) {
    return <SignIn />;
  }

  const toggleTheme = () => {
    if (darkMode) {
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  return (
    <>
      {/* Header */}
      <div
        className="container-fluid bg-white"
        style={{ height: "103px", position: "fixed", zIndex: 1000 }}
      >
        <header className="flex justify-between pr-10 items-center m-0 py-2">
          <div className="col-3 d-flex align-items-center">
            <div className="text-3xl font-semibold">Invoicer</div>
          </div>
          <div className="col-6">
            <input type="text" placeholder="Search" className="form-control" />
          </div>
          <div className="flex gap-7 items-center">
            <div>
              <div
                onClick={toggleTheme}
                className={`bg-gray-300 w-[48px] h-[23px] rounded-xl transition-colors duration-300 cursor-pointer relative ${
                  darkMode ? "bg-black" : "left-1"
                }`}
              >
                <div
                  className={`bg-white w-[16px] rounded-full h-[17px] absolute top-[3px] transition-all duration-300 ${
                    darkMode ? "right-1" : "left-1"
                  }`}
                >
                  {""}
                </div>
              </div>
            </div>
            <IoSettingsOutline className="text-2xl" />
            <FaBell className="text-2xl text-gray-500" />
            <img src={company} alt="" className="w-8 h-8 rounded-full" />
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
            <Link to="" className="text-decoration-none">
              <div className="border-2 text-black  px-3 py-1 rounded-md text-semibold cursor-pointer">
                {" "}
                <span className="pr-2 ">+</span> Create Customer
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
        <div className="col-2 vh-100 bg-white border-end" style={{ paddingTop: "110px", overflowY: "auto" }}>
          {/* Dashboard */}
          <Link
            to="/"
            className="d-flex align-items-center gap-2 px-3 py-2 text-decoration-none position-relative"
            style={{
              backgroundColor: path === "/" ? "#f8f9fa" : "transparent",
              color: path === "/" ? "#000" : "#000",
              fontSize: "14px",
              borderLeft: path === "/" ? "3px solid #0d6efd" : "3px solid transparent"
            }}
          >
            <i className="bi bi-house" style={{ fontSize: "14px" }}></i>
            <span className={path === "/" ? "fw-semibold" : ""}>Dashboard</span>
          </Link>

          {/* Sales Section */}
          <div className="mb-2 mt-3">
            <div className="px-3 py-1">
              <span className="" style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: "600" }}>Sales</span>
            </div>
            <div>
              {/* Invoices with submenu */}
              <div>
                <div
                  className="d-flex align-items-center justify-content-between px-3 py-2 cursor-pointer"
                  onClick={() => setInvoicesOpen(!invoicesOpen)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex align-items-center gap-2 " style={{ fontSize: "14px" }}>
                    <i className="bi bi-file-earmark-text" style={{ fontSize: "14px" }}></i>
                    <span>Invoices</span>
                  </div>
                  <i className={`bi bi-chevron-${invoicesOpen ? 'down' : 'right'} `} style={{ fontSize: "11px" }}></i>
                </div>
                {invoicesOpen && (
                  <div className="ps-4">
                    <Link
                      to="/invoices"
                      className="d-flex align-items-center gap-2 px-3 py-1 text-decoration-none position-relative"
                      style={{
                        fontSize: "13px",
                        color: path === "/invoices" ? "#000" : "#000",
                        backgroundColor: path === "/invoices" ? "#f8f9fa" : "transparent",
                        borderLeft: path === "/invoices" ? "3px solid #0d6efd" : "3px solid transparent"
                      }}
                    >
                      <i className="bi bi-list-ul" style={{ fontSize: "12px" }}></i>
                      <span className={path === "/invoices" ? "fw-semibold" : ""}>All Invoices</span>
                    </Link>
                    <Link
                      to="/card"
                      className="d-flex align-items-center gap-2 px-3 py-1 text-decoration-none position-relative"
                      style={{
                        fontSize: "13px",
                        color: path === "/card" ? "#000" : "#000",
                        backgroundColor: path === "/card" ? "#f8f9fa" : "transparent",
                        borderLeft: path === "/card" ? "3px solid #0d6efd" : "3px solid transparent"
                      }}
                    >
                      <i className="bi bi-plus-circle" style={{ fontSize: "12px" }}></i>
                      <span className={path === "/card" ? "fw-semibold" : ""}>Create Invoice</span>
                    </Link>
                    <Link
                      to="/invoices/reports"
                      className="d-flex align-items-center gap-2 px-3 py-1 text-decoration-none position-relative"
                      style={{
                        fontSize: "13px",
                        color: path === "/invoices/reports" ? "#000" : "#000",
                        backgroundColor: path === "/invoices/reports" ? "#f8f9fa" : "transparent",
                        borderLeft: path === "/invoices/reports" ? "3px solid #0d6efd" : "3px solid transparent"
                      }}
                    >
                      <i className="bi bi-graph-up" style={{ fontSize: "12px" }}></i>
                      <span className={path === "/invoices/reports" ? "fw-semibold" : ""}>Reports</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Customers with submenu */}
              <div>
                <div
                  className="d-flex align-items-center justify-content-between px-3 py-2 cursor-pointer"
                  onClick={() => setCustomersOpen(!customersOpen)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex align-items-center gap-2 " style={{ fontSize: "14px" }}>
                    <i className="bi bi-people" style={{ fontSize: "14px" }}></i>
                    <span>Customers</span>
                  </div>
                  <i className={`bi bi-chevron-${customersOpen ? 'down' : 'right'} `} style={{ fontSize: "11px" }}></i>
                </div>
                {customersOpen && (
                  <div className="ps-4">
                    <Link
                      to="/customers"
                      className="d-flex align-items-center gap-2 px-3 py-1 text-decoration-none position-relative"
                      style={{
                        fontSize: "13px",
                        color: path === "/customers" ? "#000" : "#000",
                        backgroundColor: path === "/customers" ? "#f8f9fa" : "transparent",
                        borderLeft: path === "/customers" ? "3px solid #0d6efd" : "3px solid transparent"
                      }}
                    >
                      <i className="bi bi-list-ul" style={{ fontSize: "12px" }}></i>
                      <span className={path === "/customers" ? "fw-semibold" : ""}>All Customers</span>
                    </Link>
                    <Link
                      to="/customers/create"
                      className="d-flex align-items-center gap-2 px-3 py-1 text-decoration-none position-relative"
                      style={{
                        fontSize: "13px",
                        color: path === "/customers/create" ? "#000" : "#000",
                        backgroundColor: path === "/customers/create" ? "#f8f9fa" : "transparent",
                        borderLeft: path === "/customers/create" ? "3px solid #0d6efd" : "3px solid transparent"
                      }}
                    >
                      <i className="bi bi-plus-circle" style={{ fontSize: "12px" }}></i>
                      <span className={path === "/customers/create" ? "fw-semibold" : ""}>Add Customer</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Payment */}
              <Link
                to="/payment"
                className="d-flex align-items-center gap-2 px-3 py-2 text-decoration-none position-relative"
                style={{
                  fontSize: "14px",
                  color: path === "/payment" ? "#000" : "#000",
                  backgroundColor: path === "/payment" ? "#f8f9fa" : "transparent",
                  borderLeft: path === "/payment" ? "3px solid #0d6efd" : "3px solid transparent"
                }}
              >
                <i className="bi bi-credit-card" style={{ fontSize: "14px" }}></i>
                <span className={path === "/payment" ? "fw-semibold" : ""}>Payments</span>
              </Link>
            </div>
          </div>

          {/* Inventory Section */}
          <div className="mb-2">
            <div className="px-3 py-1">
              <span className="" style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: "600" }}>Inventory</span>
            </div>
            <div>
              {/* Inventory with submenu */}
              <div>
                <div
                  className="d-flex align-items-center justify-content-between px-3 py-2 cursor-pointer"
                  onClick={() => setInventoryOpen(!inventoryOpen)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex align-items-center gap-2 " style={{ fontSize: "14px" }}>
                    <i className="bi bi-box-seam" style={{ fontSize: "14px" }}></i>
                    <span>Products</span>
                  </div>
                  <i className={`bi bi-chevron-${inventoryOpen ? 'down' : 'right'} `} style={{ fontSize: "11px" }}></i>
                </div>
                {inventoryOpen && (
                  <div className="ps-4">
                    <Link
                      to="/inventory"
                      className="d-flex align-items-center gap-2 px-3 py-1 text-decoration-none position-relative"
                      style={{
                        fontSize: "13px",
                        color: path === "/inventory" ? "#000" : "#000",
                        backgroundColor: path === "/inventory" ? "#f8f9fa" : "transparent",
                        borderLeft: path === "/inventory" ? "3px solid #0d6efd" : "3px solid transparent"
                      }}
                    >
                      <i className="bi bi-list-ul" style={{ fontSize: "12px" }}></i>
                      <span className={path === "/inventory" ? "fw-semibold" : ""}>All Products</span>
                    </Link>
                    <Link
                      to="/addproduct"
                      className="d-flex align-items-center gap-2 px-3 py-1 text-decoration-none position-relative"
                      style={{
                        fontSize: "13px",
                        color: path === "/addproduct" ? "#000" : "#000",
                        backgroundColor: path === "/addproduct" ? "#f8f9fa" : "transparent",
                        borderLeft: path === "/addproduct" ? "3px solid #0d6efd" : "3px solid transparent"
                      }}
                    >
                      <i className="bi bi-plus-circle" style={{ fontSize: "12px" }}></i>
                      <span className={path === "/addproduct" ? "fw-semibold" : ""}>Add Product</span>
                    </Link>
                    <Link
                      to="/inventory/reports"
                      className="d-flex align-items-center gap-2 px-3 py-1 text-decoration-none position-relative"
                      style={{
                        fontSize: "13px",
                        color: path === "/inventory/reports" ? "#000" : "#000",
                        backgroundColor: path === "/inventory/reports" ? "#f8f9fa" : "transparent",
                        borderLeft: path === "/inventory/reports" ? "3px solid #0d6efd" : "3px solid transparent"
                      }}
                    >
                      <i className="bi bi-graph-up" style={{ fontSize: "12px" }}></i>
                      <span className={path === "/inventory/reports" ? "fw-semibold" : ""}>Stock Reports</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Purchase */}
              <Link
                to="/purchase"
                className="d-flex align-items-center gap-2 px-3 py-2 text-decoration-none position-relative"
                style={{
                  fontSize: "14px",
                  color: path === "/purchase" ? "#000" : "#000",
                  backgroundColor: path === "/purchase" ? "#f8f9fa" : "transparent",
                  borderLeft: path === "/purchase" ? "3px solid #0d6efd" : "3px solid transparent"
                }}
              >
                <i className="bi bi-bag" style={{ fontSize: "14px" }}></i>
                <span className={path === "/purchase" ? "fw-semibold" : ""}>Purchases</span>
              </Link>
            </div>
          </div>

          {/* Settings & Profile Section */}
          <div className="mb-2 mt-4 border-top pt-3">
            <Link
              to="/settings"
              className="d-flex align-items-center gap-2 px-3 py-2 text-decoration-none position-relative"
              style={{
                fontSize: "14px",
                color: path === "/settings" ? "#000" : "#000",
                backgroundColor: path === "/settings" ? "#f8f9fa" : "transparent",
                borderLeft: path === "/settings" ? "3px solid #0d6efd" : "3px solid transparent"
              }}
            >
              <i className="bi bi-gear" style={{ fontSize: "14px" }}></i>
              <span className={path === "/settings" ? "fw-semibold" : ""}>Settings</span>
            </Link>
            <Link
              to="/profile"
              className="d-flex align-items-center gap-2 px-3 py-2 text-decoration-none position-relative"
              style={{
                fontSize: "14px",
                color: path === "/profile" ? "#000" : "#000",
                backgroundColor: path === "/profile" ? "#f8f9fa" : "transparent",
                borderLeft: path === "/profile" ? "3px solid #0d6efd" : "3px solid transparent"
              }}
            >
              <i className="bi bi-person-circle" style={{ fontSize: "14px" }}></i>
              <span className={path === "/profile" ? "fw-semibold" : ""}>Profile</span>
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
            <Route authUser={userInfo} path="/signin" element={<SignIn />} />
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
              path="/customers"
              element={<Customers />}
            />
            <Route 
            authUser={userInfo}
            path="/addproduct"
            element={<AddProduct/>}
            >
              
            </Route>
          </Routes>
        </div>
      </div>
      <div
        /* Overlay container: always mounted so transitions can run */
        className={`fixed inset-0 z-[9999] flex justify-end transition-all duration-200 ${
          showPaymentSlide
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* backdrop (frosted glass) */}
        <div
          className={`absolute inset-0 backdrop-blur-md transition-opacity duration-200 ${
            showPaymentSlide
              ? "bg-black/30 opacity-100"
              : "bg-transparent opacity-0"
          }`}
          onClick={() => setShowPaymentSlide(false)} // click outside to close
        />

        {/* Payment panel (slide-in) */}
        <Payment
          show={showPaymentSlide}
          setShowPaymentSlide={setShowPaymentSlide}
        />
      </div>
    </>
  );
}

export default App;
