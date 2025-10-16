import React, { useEffect } from "react";
import { db } from "../firebase";
import { addDoc, getDocs, collection, doc } from "firebase/firestore";
import { useState } from "react";
import CustomerCard from "../ui/customer-card";
import CustomerForm from "./add-customer";
import axiosInstance from "../axiosConfig";

function CardPage() {
  const [selectedCustomer, setSelectedCustomer] = useState();
  const [showAddCustomerForm, setShowAddCustomerForm] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  console.log(showAddCustomerForm);

  const getCustomersFromFirebase = async () => {
    console.log("Fetch Info from API");
    axiosInstance.get("/customers").then((resp) => {
      // console.log(resp.data.data.data);
      setCustomerData(resp.data.data.data);
    });
  };
  const [customerData, setCustomerData] = useState([]);
  useEffect(() => {
    getCustomersFromFirebase();
  }, []);

  const handleCustomerSelection = (customerInfo) => {
    setSelectedCustomer(customerInfo);
    setFormData((prev) => ({
      ...prev,
      ["selectedCustomerName"]: customerInfo.customername, // overwrites only that key safely
      ["selectedCustomerId"]: customerInfo.id, // overwrites only that key safely
    }));
    console.log(customerInfo);
  };

  const [formData, setFormData] = useState({
    customername: "",
    mobileno: "",
    address: "",
    date: "",
    Discount: "",
    Tax: "",
    Shipping: "",
    SubTotal: "",
    GrandTotal: "",
    InvoiceNo: "",
    fields: [
      {
        sn: "",
        name: "",
        quantity: "",
        rate: "",
        amount: "",
      },
    ],
  });

  const handleCallbackFromCustomerCreation = (callbackCustomerInfo) => {
    console.log("Handling Callback", callbackCustomerInfo);
    getCustomersFromFirebase();
  };

  const handleAddField = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      fields: [
        ...prevFormData.fields,
        { sn: "", name: "", quantity: "", rate: "", amount: "" }, // new field appended
      ],
    }));
  };

  const handleRemoveField = (indexToRemove) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      fields: prevFormData.fields.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleFilter = (e) => {
    console.log("Handling Filters", e.target.value);

    const lowerSearch = e.target.value.toLowerCase();

    setFilteredCustomers(
      customerData.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerSearch) ||
          item.address.toLowerCase().includes(lowerSearch) ||
          item.phone.includes(lowerSearch)
      )
    );
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;

    // console.log(name, value, e, index)
    // if index is provided, we are editing a nested field
    if (index !== undefined) {
      setFormData((prev) => {
        const updatedFields = [...prev.fields];
        updatedFields[index] = {
          ...updatedFields[index],
          [name]: value,
        };
        return {
          ...prev,
          fields: updatedFields,
        };
      });
    } else {
      // otherwise, it's a top-level field
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const clearForm = () => {
    const cleared = Object.keys(formData).reduce((acc, key) => {
      acc[key] = "";
      return acc;
    }, {});
    setFormData(cleared);
  };

  function saveform() {
    console.log(formData);




    console.log(formData)


    // let formInfomation = {
    //   invoice_no : 'INV001',
    //   customer_id : selectedCustomer.
    // }

    // addDoc(collection(db, 'invoices'), formData)

    //   .then(resp => {
    //     console.log('DataAdded')
    //     clearForm()
    //   })
  }

  return (
    <>
      <div className="container p-2">
        <div className="card p-3 ">
          <div className="d-flex justify-content-between p-3 border-bottom ">
            <div className="fw-bold fs-5">Sales Return</div>
            <div className="fw-bold fs-5">Invoice No:</div>
            <div className="fw-bold fs-5">Date:</div>
          </div>

          <div className="row m-0 p-0 col-12 mt-4">
            <div className="col-md-6 border-end">
              {/* {selectedCustomer ? selectedCustomer.name : 'No Customer'} */}
              <div
                className="mb-3 position-relative"
                style={{ display: selectedCustomer ? "none" : "block" }}
              >
                <input
                  type="text"
                  name="customername"
                  value={formData.customername}
                  className="form-control p-2 border border-2 rounded-3"
                  placeholder="Enter Customer Name"
                  onChange={(e) => {
                    handleChange(e), handleFilter(e);
                  }}
                />
                <div
                  className={
                    formData.customername
                      ? "col-12 position-absolute p-2 bg-white shadow "
                      : "col-12 position-absolute bg-white shadow d-none"
                  }
                  style={{ zIndex: 100 }}
                >
                  {filteredCustomers.map((customerInfo) => (
                    <CustomerCard
                      key={customerInfo.name}
                      handler={handleCustomerSelection}
                      onClick={() => handleCustomerSelection(customerInfo)}
                      customerInfo={customerInfo}
                    />
                  ))}
                  <button
                    onClick={() => setShowAddCustomerForm(true)}
                    className="add-more-btn form-control"
                  >
                    Add Customer
                  </button>
                </div>
              </div>
              <div
                className="mb-3"
                style={{ display: !selectedCustomer ? "none" : "block" }}
              >
                <div className="row m-0 p-0 bg-light rounded border p-2">
                  <div className="col-11">
                    <span className="fw-semibold">
                      Customer Name : {selectedCustomer?.customername}
                    </span>
                    <br />
                    <span className="fw-normal">
                      {selectedCustomer?.address},{" "}
                      <span className="px-1"></span>
                      {selectedCustomer?.mobileno}
                    </span>
                  </div>
                  <div className="col-1">
                    <button onClick={() => setSelectedCustomer()}>
                      <i className="bi bi-x"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  name="mobileno"
                  value={formData.mobileno}
                  className="form-control  p-2 border border-2 rounded-3"
                  placeholder="Enter Mobile No."
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  className="form-control  p-2 border border-2 rounded-3 "
                  placeholder="Enter Address"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3 d-flex align-items-center">
                <div className="text-dark fs-6 me-2">Date:</div>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  className="form-control  p-2 border border-2 rounded-3 "
                  placeholder="Enter Date"
                  onChange={handleChange}
                />
              </div>

              <div className="d-flex align-items-center">
                <div>
                  <p className="text-dark fs-6 mb-0 me-2 ">Invoice No-</p>
                </div>
                <div>
                  <input
                    type="text"
                    name="InvoiceNo"
                    value={formData.InvoiceNo}
                    className="form-control  p-2 border border-2 rounded-3"
                    placeholder="Enter InvoiceNo."
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card mt-4 p-3">
            <div className="row">
              <div className="col-md-1">
                <p className="fs-6 fw-bold text-muted">SN</p>
              </div>
              <div className="col-md-3">
                <p className="fs-6 fw-bold text-muted">Item Description</p>
              </div>
              <div className="col-md-3">
                <p className="fs-6 fw-bold text-muted">Qty</p>
              </div>
              <div className="col-md-2">
                <p className="fs-6 fw-bold text-muted">Rate</p>
              </div>
              <div className="col-md-2">
                <p className="fs-6 fw-bold text-muted">Amount</p>
              </div>
              <div className="col-md-1"></div>
            </div>
            {formData.fields.map((field, index) => (
              <>
                <div className="row mb-2" key={index}>
                  <div className="col-md-1">
                    <p>{index + 1}</p>
                  </div>

                  <div className="col-md-3">
                    <input
                      type="text"
                      name="name"
                      value={field.name}
                      className="form-control  p-1 border border-2 rounded-3 "
                      placeholder="Enter name"
                      onChange={(e) => handleChange(e, index)}
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="number"
                      name="quantity"
                      value={field.quantity}
                      className="form-control  p-1 border border-2 rounded-3 "
                      placeholder="Enter quantity"
                      onChange={(e) => handleChange(e, index)}
                    />
                  </div>
                  <div className="col-md-2">
                    <input
                      type="text"
                      name="rate"
                      value={field.rate}
                      className="form-control p-1 border border-2 rounded-3"
                      placeholder="Enter rate"
                      onChange={(e) => handleChange(e, index)}
                    />
                  </div>
                  <div className="col-md-2">
                    <input
                      type="text"
                      name="amount"
                      value={field.quantity * field.rate}
                      className="form-control p-1 border border-2 rounded-3"
                      placeholder="Enter amount"
                      onChange={(e) => handleChange(e, index)}
                    />
                  </div>
                  <div className="col-md-1">
                    <button
                      type="button"
                      className="btn btn-danger btn-sm "
                      onChange={(e) => handleChange(e, index)}
                      onClick={() => handleRemoveField(index)}
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  </div>
                </div>
              </>
            ))}
          </div>
          {/* ADD FIELD */}
          <button className="add-more-btn" onClick={handleAddField}>
            Add More
          </button>
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-start mt-4">
        <div>
          <button
            className="btn btn-primary px-4 py-2 rounded-3 shadow-sm"
            onClick={saveform}
          >
            Save
          </button>
        </div>

        <div className="p-3 rounded-3 bg-light" style={{ minWidth: "280px" }}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <p className="text-dark fs-6 mb-0 me-2">SubTotal:</p>
            <input
              type="number"
              name="subtotal"
              // value={field.quantity * field.rate}
              className="form-control form-control-sm border border-2 rounded-3"
              placeholder="0.00"
              onChange={(e) => handleChange(e)}
            ></input>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-2 border-top pt-2">
            <p className="text-dark fs-6 mb-0 me-2">Discount:</p>
            <input
              type="number"
              name="discount"
              // value={field.quantity * field.rate}
              className="form-control  form-control-sm border border-2 rounded-3"
              placeholder="0"
              onChange={(e) => handleChange(e)}
            ></input>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-2">
            <p className="text-dark fs-6 mb-0 me-2">Shipping:</p>
            <input
              type="number"
              name="shipping"
              // value={field.quantity * field.rate}
              className="form-control  border border-1 rounded-3"
              placeholder="0"
              onChange={(e) => handleChange(e)}
            ></input>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-2">
            <p className="text-dark fs-6 mb-0 me-2">Tax:</p>
            <input
              type="number"
              name="tax"
              className="form-control form-control-sm border border-2 rounded-3 text-end w-50"
              placeholder="10%"
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="d-flex justify-content-between align-items-center border-top pt-3">
            <p className="text-dark fs-5 fw-semibold mb-0">GrandTotal:</p>
            <input
              type="number"
              name="grandtotal"
              // value={field.quantity * field.rate}
              className="form-control form-control-sm border-0 bg-transparent fw-bold text-end w-50  rounded-3"
              placeholder="0.00"
              onChange={(e) => handleChange(e)}
            ></input>
          </div>
        </div>
      </div>

      {showAddCustomerForm && (
        <CustomerForm
          setShowAddCustomerForm={setShowAddCustomerForm}
          handleCallbackFromCustomerCreation={
            handleCallbackFromCustomerCreation
          }
        />
      )}
    </>
  );
}

export default CardPage;
