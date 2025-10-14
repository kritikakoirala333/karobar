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

import Purchase from './pages/Purchase';


function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}

function MainApp() {
  const [showPaymentSlide, setShowPaymentSlide] = useState(false);

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
    axios
      .post(
        "http://192.168.1.11:8000/api/auth/me",
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
          setUserInfo(resp.data)
        } else {
          navigator("/signin");
        }
        setAuthCheck(false);
      });
  };

  useEffect(() => {
    checkLoginInfo();
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

  return (
    <>
      {/* Header */}
      <div
        className="container-fluid bg-white"
        style={{ height: "103px", position: "fixed", zIndex: 5000 }}
      >
        <header className="row m-0 py-2">
          <div className="col-3 d-flex align-items-center">
            <strong>ERM</strong>
          </div>
          <div className="col-6">
            <input type="text" placeholder="Search" className="form-control" />
          </div>
        </header>

        <div className="flex items-center justify-between pr-16 border-bottom">
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
            <Link to="/card" className="text-decoration-none">
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
        <div className="col-2 card vh-100 sidebar-links-wrapper">
          <div style={{ height: "110px" }}></div>
          <Link to={"/"}>
            <i className="bi bi-house"></i> <span>Dashboard</span>
          </Link>
          <Link>
            <i className="bi bi-box"></i> <span>Layouts</span>
          </Link>
          <Link to={"/invoices"}>
            <i className="bi bi-file"></i> <span>Invoices</span>
          </Link>
          <Link to={"/purchase"}>
            <i className="bi bi-app"></i> <span>Purchase</span>
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

            <Route authUser={userInfo} path="/" element={<Home />}></Route>
            <Route authUser={userInfo} path="/sales" element={<Sales />}></Route>
            <Route authUser={userInfo} path="/card" element={<CardPage />}></Route>
            <Route authUser={userInfo} path="/invoicepage/:id" element={<InvoicePage />}></Route>
            <Route authUser={userInfo} path="/invoices" element={<Invoices />} />
            <Route authUser={userInfo} path="/signin" element={<SignIn />} />
            <Route authUser={userInfo} path="/purchase" element={<Purchase />} />


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
