import React, { useEffect } from 'react'
import { db } from '../firebase'
import { addDoc, collection } from 'firebase/firestore'
import { useState } from 'react'


function CardPage() {

  const [formData, setFormData] = useState({
    customername: '',
    mobileno: '',
    address: '',
    date:'',
    fields: [
      {
        sn: '',
        name: '',
        quantity: '',
        rate: '',
        amount: '',

      }
    ]
  });

  const handleAddField = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      fields: [
        ...prevFormData.fields,
        { sn: '', name: '', quantity: '', rate: '', amount: '' } // new field appended
      ]
    }));
  };

  const handleRemoveField = (indexToRemove) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      fields: prevFormData.fields.filter((_, index) => index !== indexToRemove),
    }));
  };



  const handleChange = (e, index) => {
    const { name, value } = e.target;

    console.log(name, value, e, index)
    // if index is provided, we are editing a nested field
    if (index !== undefined) {
      setFormData(prev => {
        const updatedFields = [...prev.fields];
        updatedFields[index] = {
          ...updatedFields[index],
          [name]: value
        };
        return {
          ...prev,
          fields: updatedFields
        };
      });
    } else {
      // otherwise, it's a top-level field
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };


  const clearForm = () => {
    const cleared = Object.keys(formData).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {});
    setFormData(cleared);
  };

  function saveform() {





    addDoc(collection(db, 'invoices'), formData)
      .then(resp => {
        console.log('DataAdded')
        clearForm()
      })
  }

  //   useEffect(() =>{
  //     let key = prompt("Enter key u want to set")
  // let value = prompt("Enter value u want to set")

  // localStorage.setItem(key,value)

  // console.log(`The value at ${key} is ${localStorage.getItem(key)}`)

  //   },[])





  return (
    <>
      <div className='container p-2'>
        <div className='card p-3 '>
          <div className='d-flex justify-content-between p-3 border-bottom '>
            <div className='fw-bold fs-5'>Sales Return</div>
            <div className='fw-bold fs-5'>Invoice No:</div>
            <div className='fw-bold fs-5'>Date:</div>
          </div>




          <div className="row m-0 p-0 col-12 mt-4">
            <div className="col-md-3">

              <input
                type="text"
                name="customername"
                value={formData.customername}
                className='form-control p-3 border border-3 rounded-3'
                placeholder="Enter Customer Name"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3">

              <input
                type="number"
                name="mobileno"
                value={formData.mobileno}
                className='form-control  p-3 border border-3 rounded-3'
                placeholder="Enter Mobile No."
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3">

              <input
                type="text"
                name="address"
                value={formData.address}
                className='form-control  p-3 border border-3 rounded-3 '
                placeholder="Enter Address"
                onChange={handleChange}
              />
            </div>
             <div className="col-md-3">

              <input
                type="date"
                name="date"
                value={formData.date}
                className='form-control  p-3 border border-3 rounded-3 '
                placeholder="Enter Date"
                onChange={handleChange}
              />
            </div>


          </div>

          <div className='card mt-4 p-2'>
            <div className='row' >
              <div className='col-md-1'>
                <p className='fs-6 fw-bold text-muted'>SN</p>
              </div>
              <div className='col-md-3'>
                <p className='fs-6 fw-bold text-muted'>Item Description</p>
              </div>
              <div className='col-md-3'>
                <p className='fs-6 fw-bold text-muted'>Qty</p>
              </div>
              <div className='col-md-2'>
                <p className='fs-6 fw-bold text-muted'>Rate</p>
              </div>
              <div className='col-md-2'>
                <p className='fs-6 fw-bold text-muted'>Amount</p>

              </div>
              <div className='col-md-1'>

              </div>
             


            </div>
            {formData.fields.map((field, index) => <>
              <div className='row mb-2' key={index} >
                <div className='col-md-1'>
                  <p>{index + 1}</p>
                </div>


                <div className='col-md-3'>
                  <input
                    type="text"
                    name="name"
                    value={field.name}
                    className='form-control  p-1 border border-2 rounded-3 '
                    placeholder="Enter name"
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div className='col-md-3'>
                  <input
                    type="number"
                    name="quantity"
                    value={field.quantity}
                    className='form-control  p-1 border border-2 rounded-3 '
                    placeholder="Enter quantity"
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div className='col-md-2'>
                  <input
                    type="text"
                    name="rate"
                    value={field.rate}
                    className='form-control p-1 border border-2 rounded-3'
                    placeholder="Enter rate"
                    onChange={(e) => handleChange(e, index)}
                  />


                </div>
                <div className='col-md-2'>
                  <input
                    type="text"
                    name="amount"
                    value={field.amount}
                    className='form-control p-1 border border-2 rounded-3'
                    placeholder="Enter amount"
                    onChange={(e) => handleChange(e, index)}
                  />

                </div>
                <div className='col-md-1'>
                 
                  <button
                    type="button"
                    className="btn btn-danger btn-sm "
                     onChange={(e) => handleChange(e, index)}
                    onClick={() => handleRemoveField(index)}
                  >
                    <i className='bi bi-x'></i>
                  </button>

                </div>

              </div>
            </>)}

          </div>
          {/* ADD FIELD */}
          <button onClick={handleAddField}>Add More</button>


        </div>
      </div>
      <button className='btn btn-primary px-4 py-2 rounded-3' onClick={saveform}>Save</button>


    </>
  )
}

export default CardPage
