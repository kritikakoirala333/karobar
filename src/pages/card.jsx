import React, { useEffect } from 'react'
import { db } from '../firebase'
import { addDoc, collection } from 'firebase/firestore'
import { useState } from 'react'


function CardPage() {

  const [formData, setFormData] = useState({
    customername: '',
    mobileno: '',
    address: '',
    fields: [
      {
        name: '',
        quantity: 0
      }
    ]
  });

  const handleAddField = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      fields: [
        ...prevFormData.fields,
        { name: '', quantity: 0 } // new field appended
      ]
    }));
  };


  const handleChange = (e, index) => {
    const { name, value } = e.target;

    console.log(name, value, e , index)
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
    addDoc(collection(db, 'products'), formData)
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
            <div className="col-md-4">

              <input
                type="text"
                name="customername"
                value={formData.customername}
                className='form-control p-3 border border-3 rounded-3'
                placeholder="Enter Customer Name"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">

              <input
                type="number"
                name="mobileno"
                value={formData.mobileno}
                className='form-control  p-3 border border-3 rounded-3'
                placeholder="Enter Mobile No."
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">

              <input
                type="text"
                name="address"
                value={formData.address}
                className='form-control  p-3 border border-3 rounded-3 '
                placeholder="Enter Address"
                onChange={handleChange}
              />
            </div>

          </div>

          <div className='card mt-4 p-2'>
            <div className='row' >
              <div className='col-md-2'>
                <p className='fs-6 fw-bold text-muted'>SN</p>
              </div>
              <div className='col-md-3'>
                <p className='fs-6 fw-bold text-muted'>Item Description</p>
              </div>
              <div className='col-md-3'>
                <p className='fs-6 fw-bold text-muted'>Qty</p>
              </div>
              <div className='col-md-3'>
                <p className='fs-6 fw-bold text-muted'>Rate</p>
              </div>
              <div className='col-md-1'>
                <p className='fs-6 fw-bold text-muted'>Amount</p>

              </div>

            </div>
            {formData.fields.map((field, index) => <>
              <div className='row' key={index} >
                <div className='col-md-2'>
                  <p className='fs-6 fw-bold text-muted'></p>
                </div>
                <div className='col-md-3'>
                  <input
                    type="text"
                    name="name"
                    value={field.name}
                    className='form-control  p-1 border border-2 rounded-3 '
                    placeholder="Enter Address"
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div className='col-md-3'>
                  <input
                    type="text"
                    name="quantity"
                    value={field.quantity}
                    className='form-control  p-1 border border-2 rounded-3 '
                    placeholder="Enter Address"
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div className='col-md-3'>
                  <p className='fs-6 fw-bold text-muted'>Rate</p>
                </div>
                <div className='col-md-1'>
                  <p className='fs-6 fw-bold text-muted'>Amount</p>

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
