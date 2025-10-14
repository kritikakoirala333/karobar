import { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaFacebookF,
  FaTwitter,
} from "react-icons/fa";
import signIn from "./assets/signIn.png";
import axios from "axios";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("niraj@azure.com.np");
  const [password, setPassword] = useState("password");

  const handleLogin = (e) => {
    e.preventDefault();
    let sessionToken = localStorage.getItem("login_token");
    console.log("Session Token:", sessionToken)


    axios.post("http://192.168.1.11:8000/api/auth/login", {
      email: email,
      password: password,
    }).then(resp => {
        console.log(resp)
        localStorage.setItem("login_token", resp.data.access_token)
    });
    console.log(email, password);
  };

  return (
    <div className="px-[180px] signinImg   d-flex justify-content-between align-items-center vh-100 vw-100 bg-light">
      <div className="py-custom">
        <div className="text-6xl text-uppercase font-bold">Welcome Back !</div>
        <p className="w-[500px] mt-4 text-gray-600">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo
          deleniti saepe alias dicta dolores harum unde cupiditate optio quasi
          accusamus?
        </p>
        <img src={signIn} alt="" className="w-[400px]" />
      </div>
      <div
        className="card p-4 shadow"
        style={{ maxWidth: "440px", width: "100%" }}
      >
        <h3 className="text-center mb-4">Sign In</h3>

        <form onSubmit={handleLogin}>
          {/* Email Field */}
          <div className="mb-3 position-relative">
            <FaEnvelope
              className="position-absolute"
              style={{ top: "10px", left: "10px", color: "#6c757d" }}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="form-control ps-5"
            />
          </div>

          {/* Password Field */}
          <div className="mb-3 position-relative">
            <FaLock
              className="position-absolute"
              style={{ top: "10px", left: "10px", color: "#6c757d" }}
            />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="form-control ps-5"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                cursor: "pointer",
                color: "#6c757d",
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="rememberMe"
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Remember me
              </label>
            </div>
            <a href="#" className="text-decoration-none">
              Forgot password?
            </a>
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-3 mt-3">
            Sign In
          </button>
        </form>

        <div className="text-center mb-3">Or sign in with</div>

        <div className="d-flex justify-content-center gap-3">
          <button className="btn btn-outline-danger">
            <FaGoogle className=" " />
          </button>
          <button className="btn btn-outline-primary">
            <FaFacebookF className="" />
          </button>
          <button className="btn btn-outline-info">
            <FaTwitter className="" />
          </button>
        </div>
        <div className="text-center mt-3 ">
          By logging in, you agree to our <b>Terms of Service</b> and{" "}
          <b>Privacy Policy</b>.
        </div>
        <div className="text-center mt-3">
          Don't have an account?{" "}
          <a href="#" className="text-decoration-none">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
