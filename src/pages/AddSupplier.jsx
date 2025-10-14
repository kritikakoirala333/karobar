import React, { useState } from 'react';
import { db } from '../firebase'
import { addDoc, collection } from 'firebase/firestore'

function AddSupplier({ setShowAddSupplierForm }) {
  // const [customerData, setCustomerData] = useState({
  //   customername: '',
  //   mobileno: '',
  //   address: '',
  // });
  const [formData, setFormData] = useState({
    suppliername: '',
    mobileno: '',
    address: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Supplier Added:', formData);
    alert('Supplier added successfully!');
    setShowAddSupplierForm(false) // close the popup after submission\


     addDoc(collection(db, 'suppliers'), formData)
  
        .then(resp => {
          console.log('DataAdded')
          clearForm()
        })
  };
 
  
  return (
    // background overlay
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}
    >
      {/* Popup box */}
      <div className="bg-white p-4 rounded-4 shadow-lg" style={{ width: '400px' }}>
        <h4 className="mb-3 text-center">Enter Supplier Details</h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Supplier Name</label>
            <input
              type="text"
              className="form-control"
              name="suppliername"
              value={formData.suppliername}
              onChange={handleChange}
              placeholder="Enter supplier name"
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
            <button type="button" className="btn btn-secondary" onClick={() => setShowAddSupplierForm(false)}>
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

export default AddSupplier;