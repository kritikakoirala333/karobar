

import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

// ✅ Import all logos (ensure they exist in src/assets/)
import everestlogo from "../assets/everest-logo.png";
import centralfinancelogo from "../assets/central-finance-logo.jpeg";
import citizenbank from "../assets/citizen-bank.jpeg";
import garimabank from "../assets/garima-bank.png";
import bestfinance from "../assets/best-finance.webp";
import agriculturaldev from "../assets/agricultural-dev.jpg";
import globalime from "../assets/global-ime.png";
import himalayanbank from "../assets/himalayan-bank.jpeg";

function DisplayBank() {
  // ✅ List of all bank cards
  const banks = [
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

  return (
    <div className="container-fluid m-0 p-0">
      <div className="row m-0 p-0">
        {banks.map((bank, index) => (
          <div className="col-12 col-md-4" key={index}>
            <div
              className="card p-3 mt-4"
              style={{
                backgroundColor: "#f1f5f9",
                borderRadius: "8px",
              }}
            >
              <div className="d-flex align-items-center mb-4">
                {/* Bank Logo */}
                <img
                  src={bank.logo}
                  alt={`${bank.name} Logo`}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginRight: "20px",
                  }}
                />

                {/* Bank Name */}
                <h6 className="mb-0 fw-semibold flex-grow-1">{bank.name}</h6>

                {/* Menu Icon */}
                <div className="ms-auto" style={{ cursor: "pointer" }}>
                  <BsThreeDotsVertical size={18} color="#000" />
                </div>
              </div>

              {/* Amount */}
              <div className="fs-5 fw-normal">NPR 0.00</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DisplayBank;



