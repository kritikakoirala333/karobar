import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineInventory } from "react-icons/md";

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
      const { nationalId, firstName, lastName, city, country, phone, email } = formData;
      if (!nationalId || !firstName || !lastName || !city || !country || !phone || !email) {
        alert("Please fill all personal details.");
        return false;
      }
    }

  if (step === 2) {
      if (!hasOrganization) return true;
      const { businessName, businessAddress, businessCountry, panNo } = formData;
      if (!businessName || !businessAddress || !businessCountry || !panNo) {
        alert("Please fill all organization fields.");
        return false;
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
      className="min-h-screen flex items-center justify-center text-[13px]"
    
    >

      <div className=" bg-white w-full h-[100vh]  shadow-xl flex overflow-hidden ">
        {/* Sidebar */}
        <div className="w-1/3 bg-[#ededed] p-5 flex flex-col justify-between">
  <div className="flex text-center justify-center">     
       <MdOutlineInventory className="text-5xl text-center text-black " />
          <p className="text-3xl font-semibold text-black text-center ">Invoicer</p>
          </div>
          <ul className="space-y-3 text-xl">
            {["Personal Details", "Organization Details", "Security & Verification", "Summary"].map(
              (label, index) => {
                const number = index + 1;
                const active = step === number;
                const completed = step > number;
                return (
                  <li
                    key={number}
                    onClick={() => handleSidebarClick(index)}
                    className={`flex items-center gap-2 cursor-pointer transition ${
                      active ? "text-black font-medium" : completed ? "text-[black]" : "text-gray-600"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs border transition ${
                        active
                          ? "bg-white text-black border-black"
                          : completed
                          ? "bg-[#080c0e95] text-white border-none"
                          : "border-[#000000]"
                      }`}
                    >
                      {completed ? "✓" : number}
                    </div>
                    {label}
                  </li>
                );
              }
            )}
          </ul>
          <Link to="/login" className="text-sm text-center text-blue-500 hover:underline">
            Already have an account? Log in
          </Link>
        </div>

        {/* Form Section */}
        <div className="flex-1 p-6 text-black overflow-y-auto px-[110px] " >
          {/* STEP 1 */}
          {step === 1 && (
            <div className="mt-[95px]">
               <h2 className="text-2xl font-semibold mb-1">
                Let's start <span className="text-gray-400"> with you</span> 👋
              </h2>
              <p className="text-gray-400">Let's set up your profile and import your Leads, if you have some.</p>
              <p className="text-sm font-semibold mb-3">YOUR PERSONAL DETAILS <span className="text-xl">👶</span>
</p>
              <div className="mb-3">
                <label className="block text-xs text-gray-600 mb-1">National Identity Number</label>
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

              <p className="text-sm font-semibold mb-2">YOUR ADDRESS 📍</p>
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

              <p className="text-sm font-semibold mb-2">CONTACT DETAILS 📞</p>
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
                <div
                  onClick={handleNext}
                  className="bg-gray-800 text-white px-4 py-1.5 rounded-2xl hover:bg-black transition-all cursor-pointer"
                >
                  Next
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className={`${hasOrganization? "mt-[130px]":"mt-[230px]"}`}>
              <h2 className="text-xl font-semibold mb-6 text-gray-800 ">Organization Details🏣</h2>
              {/* <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100"> */}
                <label className="flex items-center  text-sm text-gray-600 mb-2">
                  <input
                    type="checkbox"
                    checked={hasOrganization}
                    onChange={() => setHasOrganization(!hasOrganization)}
                    className="mt-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                 <span className="ml-2"> Do you have an organization?</span>
                </label>

                {hasOrganization && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Business Name</label>
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        placeholder="Enter business name"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Business Address</label>
                      <input
                        type="text"
                        name="businessAddress"
                        value={formData.businessAddress}
                        onChange={handleChange}
                        placeholder="Enter business address"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div className="flex gap-3">
                      <div className="w-1/2">
                        <label className="block text-xs text-gray-500 mb-1">Business Country</label>
                        <input
                          type="text"
                          name="businessCountry"
                          value={formData.businessCountry}
                          onChange={handleChange}
                          placeholder="Country"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div className="w-1/2">
                        <label className="block text-xs text-gray-500 mb-1">PAN Number</label>
                        <input
                          type="text"
                          name="panNo"
                          value={formData.panNo}
                          onChange={handleChange}
                          placeholder="PAN No."
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                     <button
                  onClick={handleBack}
                  className="text-blue-600 border border-blue-600 px-6 py-2 rounded-md hover:bg-blue-50"
                >
                  Back
                </button>
                  <div
                    onClick={handleNext}
                    className="bg-gray-800 cursor-pointer text-white px-6 py-2 rounded-2xl text-sm font-medium hover:bg-[black] transition-all duration-300"
                  >
                    {hasOrganization ? "Next" : "Skip"}
                  </div>
                </div>
              {/* </div> */}
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="mt-[160px]">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">Security & Verification 🔐</h2>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
                />
                
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
                />
                
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
                />
                <label className="flex items-center text-sm text-gray-600">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-gray-600 ml-2">I agree to the Terms & Privacy Policy</span>
                </label>
              </div>

            <div className="flex justify-between pt-4">
                     <button
                  onClick={handleBack}
                  className="text-blue-600 border border-blue-600 px-6 py-2 rounded-md hover:bg-blue-50"
                >
                  Back
                </button>
                  <div
                    onClick={handleNext}
                    className="bg-gray-800 cursor-pointer text-white px-6 py-2 rounded-2xl text-sm font-medium hover:bg-[black] transition-all duration-300"
                  >
                    Next
                  </div>
                </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className={`${hasOrganization? "mt-[125px]":"mt-[210px]"}`}>
              <h2 className="text-lg font-semibold mb-4 text-gray-700">Summary 📖</h2>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <strong>Name:</strong> {formData.firstName} {formData.lastName}
                </p>
                <p className="text-gray-600">
                  <strong>Email:</strong> {formData.email}
                </p>
                <p className="text-gray-600">
                  <strong>Phone:</strong> {formData.phone}
                </p>
                {hasOrganization && (
                  <p className="text-gray-600">
                    <strong>Business Name:</strong> {formData.businessName}
                  </p>
                )}
                
                {hasOrganization && (
                  <p className="text-gray-600">
                    <strong>Business sCountry:</strong> {formData.businessCountry}
                  </p>
                )}
                {hasOrganization && (
                  <p className="text-gray-600">
                    <strong>PAN No:</strong> {formData.panNo}
                  </p>
                )}
              </div>
           <div className="flex justify-between ">
                  <button
                  onClick={handleBack}
                  className="text-blue-600 border border-blue-600 px-6 py-2 rounded-md hover:bg-blue-50"
                >
                  Back
                </button>
                <div
                  onClick={handleNext}
                  className="bg-gray-800 text-white px-4 py-1.5 rounded-2xl hover:bg-black transition-all cursor-pointer"
                >
                  Submit
                </div>
            </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
