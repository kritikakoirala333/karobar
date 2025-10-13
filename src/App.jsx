import { useState } from "react";
import Sales from "./sales";
import Home from "./Home";
import CardPage from "./pages/card";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Invoices from "./Invoices";
import Payment from "./Payment";

function App() {
  const [showPaymentSlide, setShowPaymentSlide] = useState(false);

  return (
    <BrowserRouter>
      {/* Header */}
      <div
        className="container-fluid bg-white"
        style={{ height: "103px", position: "fixed", zIndex: 100 }}
      >
        <header className="row m-0 py-2">
          <div className="col-3 d-flex align-items-center">
            <strong>ERM</strong>
          </div>
          <div className="col-6">
            <input type="text" placeholder="Search" className="form-control" />
          </div>
          <div className="col-3"></div>
        </header>

        <div className="flex items-center justify-between pr-16">
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
          <div>
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
        <div className="col-2 card vh-100 sidebar-links-wrapper">
          <div style={{ height: "110px" }}></div>
          <Link to={"/"}>
            <i className="bi bi-house"></i> <span>Dashboard</span>
          </Link>
          <Link>
            <i className="bi bi-box"></i> <span>Layouts</span>
          </Link>
          <Link to={"/card"}>
            <i className="bi bi-file"></i> <span>Invoices</span>
          </Link>
          <Link>
            <i className="bi bi-app"></i> <span>Tables</span>
          </Link>
          <Link>
            <i className="bi bi-map"></i> <span>Map</span>
          </Link>
          <Link>
            <i className="bi bi-house"></i> <span>Departments</span>
          </Link>
          <Link>
            <i className="bi bi-hourglass"></i> <span>History</span>
          </Link>
        </div>

        {/* Main Content */}
        <div className="col-10 vh-100 bg-white" style={{ overflowY: "scroll" }}>
          <div style={{ height: "100px" }}></div>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/sales" element={<Sales />}></Route>
            <Route path="/card" element={<CardPage />}></Route>
            <Route path="/invoices" element={<Invoices />} />
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
            showPaymentSlide ? "bg-black/30 opacity-100" : "bg-transparent opacity-0"
          }`}
          onClick={() => setShowPaymentSlide(false)} // click outside to close
        />

        {/* Payment panel (slide-in) */}
        <Payment show={showPaymentSlide} setShowPaymentSlide={setShowPaymentSlide} />
      </div>
    </BrowserRouter>
  );
}

export default App;
