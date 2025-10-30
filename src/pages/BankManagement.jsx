import React, { useState } from "react";
import BankAdd from "../ui/BankAdd";
import DisplayBank from "../ui/DisplayBank";
import everestlogo from "../assets/everest-logo.png";
import centralfinancelogo from "../assets/central-finance-logo.jpeg";
import citizenbank from "../assets/citizen-bank.jpeg";
import garimabank from "../assets/garima-bank.png";
import bestfinance from "../assets/best-finance.webp";
import agriculturaldev from "../assets/agricultural-dev.jpg";
import globalime from "../assets/global-ime.png";
import himalayanbank from "../assets/himalayan-bank.jpeg";

export default function BankManagement() {
  const [show, setShow] = useState(false);
  const [showBankMngmt, setshowBankMngmt] = useState(false);

  const [banks, setBanks] = useState([
  ]);

  return (
    <>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center border-bottom bg-white py-2 px-3">
        <h5 className="mb-0 fw-semibold text-dark" style={{ fontSize: "16px" }}>
          Bank Accounts
        </h5>
        <button
          onClick={() => setShow(true)}
          className="btn btn-success fw-semibold px-3"
          style={{ fontSize: "16px" }}
        >
          + ADD NEW
        </button>
      </div>

      {/* Empty State */}
      <div style={{ display: !showBankMngmt ? '' : 'none' }} className="mt-3 border rounded p-5 bg-white">
        <h5 className="mb-0 text-muted text-center">
          No Bank Accounts Are Added
        </h5>
      </div>

      {/* Modal */}
      <BankAdd show={show} handleClose={() => {
        setShow(false);
        setshowBankMngmt(true);
      }} setBanks={setBanks} banks={banks} />


      <div style={{ display: showBankMngmt ? 'flex' : 'none' }}>
        <DisplayBank banks={banks}></DisplayBank>

      </div>
    </>
  );
}

