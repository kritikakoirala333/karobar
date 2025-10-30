import React, { use, useEffect } from "react";
import { useState } from "react";
import everestlogo from "../assets/everest-logo.png";
import centralfinancelogo from "../assets/central-finance-logo.jpeg";
import citizenbank from "../assets/citizen-bank.jpeg";
import garimabank from "../assets/garima-bank.png";
import bestfinance from "../assets/best-finance.webp";
import agriculturaldev from "../assets/agricultural-dev.jpg";
import globalime from "../assets/global-ime.png";
import himalayanbank from "../assets/himalayan-bank.jpeg";

export default function BankAdd({ show, handleClose,setBanks, banks }) {
  if (!show) return null; // Hide the modal when `show` is false

    const banksData = [
      { name: "Everest Bank Ltd.", logo: everestlogo },
      { name: "Central Finance Ltd.", logo: centralfinancelogo },
      { name: "Citizens Bank International Ltd.", logo: citizenbank },
      { name: "Garima Bikas Bank Ltd.", logo: garimabank },
      { name: "Best Finance Ltd.", logo: bestfinance },
      { name: "Agricultural Development Bank Ltd.", logo: agriculturaldev },
      { name: "Global IME Bank Ltd.", logo: globalime },
      { name: "Himalayan Bank Ltd.", logo: himalayanbank },
      { name: "Agricultural Development Bank Ltd.", logo: agriculturaldev },
    ];


  const [bank, setBank] = useState("");
  const [logo, setLogo] = useState("");
  const [display, setDisplay] = useState(false);
  const handleBankChange = (e) => {
    setBank(e.target.value);

    console.log("Name:", e.target.value);

    banksData.forEach((bank) =>{
      console.log(bank.name);
      if(bank.name === e.target.value){
        console.log("Logo",bank.logo);
        setLogo(bank.logo);
      }
    })
  };
  

  const hello = () => {
    console.log("clicked");
    handleClose();
    setDisplay(true);
    // console.log(display);

    const newBank = { name: bank, logo: logo };

   setBanks([...banks, newBank]); 

  }


  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content border-0">
          <div className="modal-body p-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-semibold mb-0">New Bank Account</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleClose}
              ></button>
            </div>

            {/* Select Bank */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Select Bank</label>
              <select className="form-select " value={bank} onChange={handleBankChange}>
                <option >Select Bank</option>
                <option  value="Everest Bank Ltd.">Everest Bank Ltd.</option>
                <option value="Central Finance Ltd.">Central Finance Ltd.</option>
                <option value="Citizens Bank International Ltd.">Citizens Bank International Ltd.</option>
                <option value="Garima Bikas Bank Ltd." >Garima Bikas Bank Ltd.</option>
                <option value="Best Finance Ltd.">Best Finance Ltd.</option>
                <option value="Agricultural Development Bank Ltd.">Agricultural Development Bank Ltd.</option>
                <option value="Global IME Bank Ltd.">Global IME Bank Ltd.</option>
                <option value="Himalayan Bank Ltd.">Himalayan Bank Ltd.</option>





              </select>
            </div>

            {/* Display Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Display Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Display Name"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
              />
            </div>

            {/* Bank Info */}
            <h6 className="text-muted fw-semibold mt-4 mb-2">Bank Info</h6>
            <div className="row">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Account Name</label>
                <input
                  type="text"
                  className="form-control"


                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Account Number</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Account Number"
                />
              </div>
              <div className="col-md-6 mt-3">
                <label className="form-label fw-semibold">Account Type</label>
                <select className="form-select">
                  <option>Select...</option>
                  <option>Saving</option>
                  <option>Current</option>
                </select>
              </div>
              <div className="col-md-6 mt-3">
                <label className="form-label fw-semibold">Currency Code</label>
                <select className="form-select">
                  <option>Nepalese Rupee</option>
                  <option>United States Dollar</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="mt-3 mb-4">
              <label className="form-label fw-semibold">Description</label>
              <textarea
                className="form-control"
                placeholder="Description..."
              ></textarea>
            </div>

            {/* Save Button */}
            <div className="text-end">
              <button onClick={hello} className="btn btn-success px-4 fw-semibold">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
