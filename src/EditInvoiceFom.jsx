import React, { useState } from "react";

function EditInvoiceFom({ setShowEditInvoiceForm, invoice }) {
  const [formData, setFormData] = useState({
    invoice_no: invoice[0].invoice_no,
    phone: invoice[0].customer.phone,
    address: invoice[0].customer.address,
    date: invoice[0].date.slice(0, 10),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Edit Details:", formData);
    alert("Customer data edit successfully!");
    setShowAddCustomerForm(false); // close the popup after submission\

    addDoc(collection(db, "customers"), formData).then((resp) => {
      console.log("DataAdded");
      clearForm();
    });
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
        <h4 className="mb-3 text-center">Edit Invoice Details</h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Inovice Number</label>
            <input
              type="text"
              className="form-control"
              name="invoice_no"
              value={formData.invoice_no}
              onChange={handleChange}
              placeholder="Enter invoice number"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mobile Number</label>
            <input
              type="tel"
              className="form-control"
              name="phone"
              value={formData.phone}
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
          <div className="mb-3">
            <label className="form-label">Date</label>
            <input
              className="form-control"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              placeholder="Enter address"
              required
            />
          </div>

          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowEditInvoiceForm(false)}
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

export default EditInvoiceFom;
