import React, { useState } from "react";
import axiosInstance from "./axiosConfig";
import Swal from "sweetalert2";

function EditInvoiceFom({ setShowEditInvoiceForm, invoice }) {
  const [formData, setFormData] = useState({
    id: invoice?.[0]?.id || "",
    invoice_no: invoice?.[0]?.invoice_no || "",
    customer_id: invoice?.[0]?.customer_id || "",
    customer_name: invoice?.[0]?.customer?.name || "",
    phone: invoice?.[0]?.customer?.phone || "",
    address: invoice?.[0]?.customer?.address || "",
    date: invoice?.[0]?.date?.slice(0, 10) || "",
    subtotal: invoice?.[0]?.subTotal || 0,
    discount: invoice?.[0]?.discount || 0,
    tax: invoice?.[0]?.tax || 0,
    grand_total: invoice?.[0]?.grand_total || 0,
    invoice_items: (invoice?.[0]?.invoice_items || []).map((i) => ({
      item: i.item || "",
      quantity: i.quantity || "",
      rate: i.rate || "",
      amount: i.total || 0,
    })),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.invoice_items];
    updatedItems[index][name] = value;

    // auto calculate amount = quantity * rate
    if (name === "quantity" || name === "rate") {
      const qty = parseFloat(updatedItems[index].quantity) || 0;
      const rate = parseFloat(updatedItems[index].rate) || 0;
      updatedItems[index].amount = qty * rate;
    }

    setFormData({ ...formData, invoice_items: updatedItems });
  };

  // add new row
  const addMoreItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { item: "", quantity: "", rate: "", amount: 0 },
      ],
    });
  };

  const clearForm = () => {
    setFormData((prev) => ({
      ...prev,
      customername: "",
      mobileno: "",
      address: "",
      fields: prev.fields.map(() => ({
        name: "",
        quantity: 0,
      })),
    }));
  };

  // delete item row
  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, invoice_items
      
      : updatedItems });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let formInfomation = {
      invoice_no: "INV001",
      customer_id: formData.customer_id,
      date: formData.date,
      subtotal: formData.subtotal,
      discount: formData.discount,
      tax: formData.tax,
      grand_total: formData.grand_total,
      invoice_items: [],
    };

    formData.invoice_items.map((field, index) => {
      formInfomation["invoice_items"][index] = {
        item: field.item,
        quantity: field.quantity,
        rate: field.rate,
        total: field.amount,
        // unit: ''
      };
    });

    axiosInstance
      .put(`/sales-invoices/${formData.id}`, formInfomation)
      .then((resp) => {
        console.log(resp);
        Swal.fire({
          title: "Success!",
          text: "Sales invoice is created",
          icon: "success",
          confirmButtonText: "OK",
          timer: 2000,
          timerProgressBar: true,
        });
        clearForm();
      })
      .catch((ex) => {
        console.error(ex);
      });

    console.log(formInfomation);
  };

  const subtotal = formData.invoice_items.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  return (
    // background overlay
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1050 }}
    >
      <div
        className="bg-white p-4 rounded-4 shadow-lg"
        style={{ width: "900px" }}
      >
        <h4 className="mb-3 text-center">Sales Invoice</h4>
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-6 mb-3">
              <label className="form-label">Customer Name</label>
              <input
                type="text"
                className="form-control"
                name="customername"
                value={formData.customer_name}
                onChange={handleChange}
                placeholder="Enter Customer Name"
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Mobile No.</label>
              <input
                type="tel"
                className="form-control"
                name="mobileno"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter Mobile No."
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Address</label>
              <input
                className="form-control"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter Address"
                required
              />
            </div>
          </div>

          {/* Item Table */}
          <div className="table-responsive">
            <table className="table table-bordered align-middle text-center">
              <thead className="table-light">
                <tr>
                  <th>SN</th>
                  <th>Item Description</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>Amount</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {formData.invoice_items.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <input
                        type="text"
                        name="item"
                        value={item.item}
                        onChange={(e) => handleItemChange(index, e)}
                        placeholder="Enter name"
                        className="form-control"
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="quantity"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, e)}
                        placeholder="Enter quantity"
                        className="form-control"
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="rate"
                        value={item.rate}
                        onChange={(e) => handleItemChange(index, e)}
                        placeholder="Enter rate"
                        className="form-control"
                        required
                      />
                    </td>
                    <td>{item.amount.toFixed(2)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => removeItem(index)}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div
              className="border border-dark border-dashed text-center py-2 cursor-pointer"
              onClick={addMoreItem}
              style={{ cursor: "pointer" }}
            >
              Add More
            </div>
          </div>

          <div className="mt-3 text-end">
            <strong>Grand Total: {invoice[0].grand_total}</strong>
          </div>

          <div className="d-flex justify-content-between mt-4">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowEditInvoiceForm(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-dark">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditInvoiceFom;
