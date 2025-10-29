import React, { useState } from "react";
import BankAdd from "../ui/BankAdd";
import DisplayBank from "../ui/DisplayBank";

export default function BankManagement() {
  const [show, setShow] = useState(false);
  const [showBankMngmt, setshowBankMngmt] = useState(false);

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
      <div  style={{ display: !showBankMngmt ? '' : 'none' }} className="mt-3 border rounded p-5 bg-white">
        <h5 className="mb-0 text-muted text-center">
          No Bank Accounts Are Added
        </h5>
      </div>

      {/* Modal */}
      <BankAdd show={show} handleClose={() => {
        setShow(false);
        setshowBankMngmt(true);
      }} />


      <div style={{ display: showBankMngmt ? 'flex' : 'none' }}>
        <DisplayBank ></DisplayBank>

      </div>
    </>
  );
}

