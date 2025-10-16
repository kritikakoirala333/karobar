import React, { useState } from "react";
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import axiosInstance from "../axiosConfig";

function CustomerForm({ setShowAddCustomerForm, handleCallbackFromCustomerCreation }) {
  // const [customerData, setCustomerData] = useState({
  //   customername: '',
  //   mobileno: '',
  //   address: '',
  // });
  const [formData, setFormData] = useState({
    customername: "",
    mobileno: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Customer Added:", formData);
    alert("Customer added successfully!");
    setShowAddCustomerForm(false); // close the popup after submission\


// <<<<<<< HEAD

//     addDoc(collection(db, 'customers'), formData)

//       .then(resp => {
//         console.log('DataAdded')
//         clearForm()
//       })
//   };


// =======
    axiosInstance.post("/customers", {
      name : formData.customername,
      address : formData.address,
      phone : formData.mobileno,
      organization_id : 1
    }).then(resp => {

      handleCallbackFromCustomerCreation(resp.data)
    })

    // addDoc(collection(db, "customers"), formData).then((resp) => {
    //   console.log("DataAdded");
    //   clearForm();
    // });
  };

  return (
    // background overlay
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1050 }}
    >
      {/* Popup box */}
      <div
        className="bg-white p-4 rounded-4 shadow-lg"
        style={{ width: "400px" }}
      >
        <h4 className="mb-3 text-center">Enter Customer Details</h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Customer Name</label>
            <input
              type="text"
              className="form-control"
              name="customername"
              value={formData.customername}
              onChange={handleChange}
              placeholder="Enter customer name"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mobile Number</label>
            <input
              type="tel"
              className="form-control"
              name="mobileno"
              value={formData.mobileno}
              onChange={handleChange}
              placeholder="Enter mobile number"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Address</label>
            <input
              className="form-control"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
              required
            />
          </div>

          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowAddCustomerForm(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CustomerForm;
