import React, { useState } from 'react';
import axiosInstance from '../axiosConfig';
import Swal from 'sweetalert2';

function AddSupplier({ setShowAddSupplierForm, handleCallbackFromSupplierCreation }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
    country: '',
    pan_vat: '',
    type: 'company',
    note: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Show loading
    Swal.fire({
      title: 'Saving...',
      text: 'Please wait while we add the supplier',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    axiosInstance.post('/suppliers', {
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      email: formData.email,
      country: formData.country,
      pan_vat: formData.pan_vat,
      type: formData.type,
      note: formData.note,
      organization_id: 1
    })
    .then(resp => {
      console.log('Supplier created:', resp.data);
      Swal.fire({
        title: 'Success!',
        text: 'Supplier added successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 2000,
        timerProgressBar: true,
      });
      setShowAddSupplierForm(false);
      if (handleCallbackFromSupplierCreation) {
        handleCallbackFromSupplierCreation(resp.data);
      }
    })
    .catch(error => {
      console.error('Error:', error);

      let errorMessage = 'Failed to add supplier';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        errorMessage = Object.values(errors).flat().join(', ');
      } else if (error.message) {
        errorMessage = error.message;
      }

      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    });
  };
 
  
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}
    >
      <div className="bg-white p-4 rounded-4 shadow-lg" style={{ width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h4 className="mb-3 text-center">Enter Supplier Details</h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Supplier Name *</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter supplier name"
              required
            />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Phone</label>
              <input
                type="tel"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Address</label>
            <input
              className="form-control"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
            />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Country</label>
              <input
                type="text"
                className="form-control"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Enter country"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">PAN/VAT</label>
              <input
                type="text"
                className="form-control"
                name="pan_vat"
                value={formData.pan_vat}
                onChange={handleChange}
                placeholder="Enter PAN/VAT number"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Type</label>
            <select
              className="form-select"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="company">Company</option>
              <option value="person">Person</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Note</label>
            <textarea
              className="form-control"
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Add any notes..."
              rows="2"
            />
          </div>

          <div className="d-flex justify-content-between">
            <button type="button" className="btn btn-secondary" onClick={() => setShowAddSupplierForm(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Supplier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSupplier;