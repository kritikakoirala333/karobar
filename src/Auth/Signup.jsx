import React, { useState } from "react";
import signBG from "../assets/signup_bg.jpg";

export default function Signup() {
  const [step, setStep] = useState(1);
  const [hasOrganization, setHasOrganization] = useState(false);
  const [formData, setFormData] = useState({
    nationalId: "",
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    country: "",
    phone: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    businessAddress: "",
    businessCountry: "",
    panNo: "",
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleNext = () => {
    if (validateStep()) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSidebarClick = (index) => {
    if (index + 1 <= step) setStep(index + 1);
  };

  const validateStep = () => {
    if (step === 1) {
      const { nationalId, firstName, lastName, city, country, phone, email } =
        formData;
      if (
        !nationalId ||
        !firstName ||
        !lastName ||
        !city ||
        !country ||
        !phone ||
        !email
      ) {
        alert("Please fill all personal details.");
        return false;
      }

      if (hasOrganization) {
        const { businessName, businessAddress, businessCountry, panNo } =
          formData;
        if (!businessName || !businessAddress || !businessCountry || !panNo) {
          alert("Please fill all organization fields.");
          return false;
        }
      }
    }

    if (step === 3) {
      const { username, password, confirmPassword, agreeTerms } = formData;
      if (!username || !password || !confirmPassword) {
        alert("Please fill all account fields.");
        return false;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return false;
      }
      if (!agreeTerms) {
        alert("You must agree to the Terms & Privacy Policy.");
        return false;
      }
    }

    return true;
  };

  return (
    <div
  
    >
      <div className=""></div>

      <div className=" w-full h-[100vh] rounded-xl shadow-xl flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-1/3 bg-gradient-to-b  from-[#1a3d6b] to-[#274a80] p-5">
          <div className="text-lg font-semibold text-white mb-8 text-center">
            Invoicer
          </div>
          <ul className="space-y-4">
            {[
              "Personal Details",
              "Organization Details",
              "Security & Verification",
              "Summary",
            ].map((label, index) => {
              const number = index + 1;
              const active = step === number;
              const completed = step > number;
              return (
                <li
                  key={number}
                  onClick={() => handleSidebarClick(index)}
                  className={`flex items-center gap-2 cursor-pointer transition ${
                    active
                      ? "text-white font-medium"
                      : completed
                      ? "text-[#A8E6FF]"
                      : "text-[#7ba0d6]"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs border transition ${
                      active
                        ? "bg-white text-[#1a3d6b] border-white"
                        : completed
                        ? "bg-[#A8E6FF] text-[#1a3d6b] border-none"
                        : "border-[#88aee0]"
                    }`}
                  >
                    {completed ? "✓" : number}
                  </div>
                  {label}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Form Section */}
        <div className="flex-1 p-6 text-[#1a3d6b] overflow-y-auto">
          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <p className="text-sm font-semibold mb-3">
                YOUR PERSONAL DETAILS
              </p>
              <div className="mb-3">
                <label className="block text-xs text-gray-600 mb-1">
                  National Identity Number
                </label>
                <input
                  type="text"
                  name="nationalId"
                  value={formData.nationalId}
                  onChange={handleChange}
                  placeholder="01010102302"
                  className="w-full border border-[#a8bde2] bg-white/80 text-[#1a3d6b] rounded-md px-2 py-1.5 focus:ring-2 focus:ring-[#2563eb] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="border border-[#a8bde2] bg-white/80 text-[#1a3d6b] rounded-md px-2 py-1.5 focus:ring-2 focus:ring-[#2563eb] focus:outline-none"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="border border-[#a8bde2] bg-white/80 text-[#1a3d6b] rounded-md px-2 py-1.5 focus:ring-2 focus:ring-[#2563eb] focus:outline-none"
                />
              </div>

              <p className="text-sm font-semibold mb-2">YOUR ADDRESS</p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="Street Address"
                  className="col-span-2 border border-[#a8bde2] bg-white/80 rounded-md px-2 py-1.5 focus:ring-2 focus:ring-[#2563eb] focus:outline-none"
                />
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="border border-[#a8bde2] bg-white/80 rounded-md px-2 py-1.5 focus:ring-2 focus:ring-[#2563eb] focus:outline-none"
                />
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="col-span-2 border border-[#a8bde2] bg-white/80 text-[#1a3d6b] rounded-md px-2 py-1.5 focus:ring-2 focus:ring-[#2563eb] focus:outline-none"
                >
                  <option value="">Select Country</option>
                  <option value="Nepal">Nepal</option>
                  <option value="Norway">Norway</option>
                  <option value="USA">USA</option>
                </select>
              </div>

              <p className="text-sm font-semibold mb-2">CONTACT DETAILS</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="border border-[#a8bde2] bg-white/80 rounded-md px-2 py-1.5 focus:ring-2 focus:ring-[#2563eb] focus:outline-none"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="border border-[#a8bde2] bg-white/80 rounded-md px-2 py-1.5 focus:ring-2 focus:ring-[#2563eb] focus:outline-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  className="bg-[#2563eb] text-white px-4 py-1.5 rounded-md hover:bg-[#1d4ed8] transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Organization Details
              </h2>
              <div className="">
                <div className="rounded-lg p-4 shadow-sm border border-gray-100">
                  <label className="flex items-center text-sm text-gray-600 ">
                    <input
                      type="checkbox"
                      checked={hasOrganization}
                      onChange={() => setHasOrganization(!hasOrganization)}
                      className="mr-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 "> Do you have an organization?</span>
                  </label>
                </div>

                {hasOrganization && (
                  <div className="space-y-4 mt-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Business Name
                      </label>
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        placeholder="Enter business name"
                        className="w-full bg-white border  border-gray-300 rounded-md px-3 py-2 text-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Business Address
                      </label>
                      <input
                        type="text"
                        name="businessAddress"
                        value={formData.businessAddress}
                        onChange={handleChange}
                        placeholder="Enter business address"
                        className="w-full border bg-white border-gray-300 rounded-md px-3 py-2 text-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div className="flex gap-3">
                      <div className="w-1/2">
                        <label className="block text-xs text-gray-500 mb-1">
                          Business Country
                        </label>
                        <input
                          type="text"
                          name="businessCountry"
                          value={formData.businessCountry}
                          onChange={handleChange}
                          placeholder="Country"
                          className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div className="w-1/2">
                        <label className="block text-xs text-gray-500 mb-1">
                          PAN Number
                        </label>
                        <input
                          type="text"
                          name="panNo"
                          value={formData.panNo}
                          onChange={handleChange}
                          placeholder="PAN No."
                          className="w-full bg-white border  border-gray-300 rounded-md px-3 py-2 text-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-between pt-4">
                <button
                  onClick={handleBack}
                  className="text-blue-600 border border-blue-600 px-6 py-2 rounded-md hover:bg-blue-50"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="bg-[#2563eb] text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-[#1d4ed8] transition-all duration-300"
                >
                  {hasOrganization ? "Next" : "Skip"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Security & Verification
              </h2>
              <div className="space-y-3">
                <label
                  htmlFor="username"
                  className="block text-xs text-gray-700 mb-1"
                >
                  Username:
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="w-full border bg-white border-gray-300 rounded-md px-3 py-2 text-gray-500"
                />
                <label
                  htmlFor="password"
                  className="block text-xs text-gray-700 mb-1"
                >
                  Password:
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full border bg-white border-gray-300 rounded-md px-3 py-2 text-gray-500"
                />
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs text-gray-700 mb-1"
                >
                  Confirm Password:
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="w-full border bg-white border-gray-300 rounded-md px-3 py-2 text-gray-500"
                />
                <div className="flex items-center text-sm text-gray-700 mt-3">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className=""
                  />
                  <label className="ml-2 ">
                    {" "}
                    I agree to the Terms & Privacy Policy
                  </label>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={handleBack}
                  className="text-blue-600 border border-blue-600 px-6 py-2 rounded-md hover:bg-blue-50"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Summary
              </h2>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <strong>Name:</strong> {formData.firstName}{" "}
                  {formData.lastName}
                </p>
                <p className="text-gray-600">
                  <strong>Email:</strong> {formData.email}
                </p>
                <p className="text-gray-600">
                  <strong>Phone:</strong> {formData.phone}
                </p>
                {hasOrganization && (
                  <p className="text-gray-600">
                    <strong>PAN No:</strong> {formData.panNo}
                  </p>
                )}
              </div>
              <div className="flex justify-end">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-2xl hover:bg-blue-700">
                  Finish
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
