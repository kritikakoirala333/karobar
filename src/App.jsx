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
import { FaCog } from "react-icons/fa";
import Setting from "./pages/Setting";
import Profile from "./pages/Profile";

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
  const [searchVal, setSearchVal] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const [userInfo, setUserInfo] = useState();
  const [authCheck, setAuthCheck] = useState(true);
  const location = useLocation(); // ✅ Now inside BrowserRouter
  const path = location.pathname;

  const navigator = useNavigate();

  const isSignInPage = path === "/signin";

  const paths = [
    { path: "/", searchPath: "dashboard" },
    { path: "/invoices", searchPath: "invoices" },
    { path: "/purchase", searchPath: "purchase invoice" },
    { path: "/card", searchPath: "sales invoice" },
    { path: "/customers", searchPath: "customers" },
    { path: "/suppliers", searchPath: "suppliers" },
    { path: "/inventory", searchPath: "inventory" },
    { path: "/addproduct", searchPath: "add product" },
  ];

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
          setUserInfo(resp.data);
        } else {
          navigator("/signin");
        }
        setAuthCheck(false);
      })
      .catch((ex) => {
        navigator("/signin");
        setAuthCheck(false);
      });
  };

  // useEffect(() => {
  //   checkLoginInfo();

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
        className="container-fluid bg-white"
        style={{ height: "103px", position: "fixed", zIndex: 1000 }}
      >
        <header className="flex justify-between pr-10 items-center m-0 py-2">
          <div className="col-3 d-flex align-items-center">
            <div className="text-3xl font-semibold">Invoicer</div>
          </div>
          <div className="col-6 relative">
            {/* INPUT WRAPPER */}
            <div className="relative">
              <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-lg " />
              <input
                type="text"
                placeholder="Search"
                className="pl-10 border-1 rounded-sm border-gray-500  pr-13 py-2 w-full"
                value={searchVal}
                onChange={handleSearch}
                onKeyDown={handleKeyDown}
              />
              <div
                className="absolute right-4 top-3 text-xl cursor-pointer"
                onClick={() => {setSearchVal(""); setSuggestions([])}}
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
                    <span>/</span>
                    <span className="">{item.searchPath}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-7 items-center">
            <div>
              <div
                onClick={toggleTheme}
                className={`bg-gray-300 w-[48px] h-[23px] rounded-xl transition-colors duration-300 cursor-pointer relative ${darkMode ? "bg-black" : "left-1"
                  }`}
              >
                <div
                  className={`bg-white w-[16px] rounded-full h-[17px] absolute top-[3px] transition-all duration-300 ${darkMode ? "right-1" : "left-1"
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
      <div className="row m-0 p-0 box ">
        {/* Sidebar */}
        <div className="col-2 card vh-100 sidebar-links-wrapper relative">
          <div style={{ height: "110px" }}></div>
          <div>
            <Link to={"/"}>
              <i className="bi bi-house text-lg"></i>{" "}
              <span className="fs-6">Dashboard</span>
            </Link>
            <Link>
              <i className="bi bi-columns-gap text-lg"></i>{" "}
              <span className="fs-6">Layouts</span>
            </Link>
            <Link to={"/invoices"}>
              <i className="bi bi-file text-lg"></i>{" "}
              <span className="fs-6">Invoices</span>
            </Link>
            <Link to={"/purchase"}>
              <i className="bi bi-bag"></i> <span className="fs-6">Purchase Invoice</span>
            </Link>
            <Link to={"/card"}>
              <i className="bi bi-app"></i> <span className="fs-6">Sales Invoice</span>
            </Link>

            <Link>
              {/* <i className="bi bi-map"></i> <span>Map</span> */}
              <i className="bi bi-app text-lg"></i>{" "}
              <span className="fs-6">Purchase</span>
            </Link>
            <Link to={"/customers"}>
              <i className="bi bi-app text-lg"></i>{" "}
              <span className="fs-6">Customers</span>
            </Link>
            <Link to={"/inventory"}>
              <i className="bi bi-map text-lg"></i>{" "}
              <span className="fs-6">Inventory</span>
            </Link>
            <Link>
              <i className="bi bi-house text-lg"></i>{" "}
              <span className="fs-6">Departments</span>
            </Link>
            <Link>
              <i className="bi bi-hourglass text-lg"></i>{" "}
              <span className="fs-6">History</span>
            </Link>


          </div>
          <div
            className="card  p-3 shadow"
            style={{
              width: "90%",
              position: "absolute",
              bottom: "10px",
              left: "5%",
              zIndex: 1000,
            }}
          >

            <ul className="list-group list-group-flush">
              <Link to={'profile'}><li className=" d-flex align-items-center gap-2  ">
                <FaUser />
                <span className="">Profile</span>
              </li></Link>
              <Link to={'setting'}><li className=" d-flex align-items-center gap-2">
                <FaCog />
                <span>Settings</span>
              </li></Link>
            </ul>
          </div>

        </div>


        {/* Main Content */}
        <div className="col-10 vh-100 bg-white" style={{ overflowY: "scroll" }}>
          <div style={{ height: "100px" }}></div>
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
            <Route  path="/signup" element={<SignUp />} />
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
              element={<AddProduct />}
            />
            <Route
              authUser={userInfo}
              path="/setting"
              element={<Setting />}
             />
              <Route
              authUser={userInfo}
              path="/profile"
              element={<Profile/>}
              >

            </Route>
          </Routes>
        </div>
      </div>
      <div
        /* Overlay container: always mounted so transitions can run */
        className={`fixed inset-0 z-[9999] flex justify-end transition-all duration-200 ${showPaymentSlide
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
          }`}
      >
        {/* backdrop (frosted glass) */}
        <div
          className={`absolute inset-0 backdrop-blur-md transition-opacity duration-200 ${showPaymentSlide
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
