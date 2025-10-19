import React, { useState } from 'react'
import { FiUpload } from "react-icons/fi";
import { FaFileDownload } from "react-icons/fa";
import { IoChevronBackOutline } from "react-icons/io5"



function AddProduct() {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };



  return (
    <>
      <div className="d-flex flex-wrap align-items-center justify-between gap-3 bg-white p-3 ">
        <div className='flex gap-4'>
          <div className="d-flex align-items-center gap-3  pb-2">
            <button className="p-1  transition border-1 border-gray-300 rounded ">
              <IoChevronBackOutline className="text-gray-700 text-xl" />
            </button>
          </div>
          <h5 className="text-black text-l">Create Product</h5>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-3 text-gray-700 hover:bg-gray-50 transition">
            <FiUpload className="w-4 h-4" />
            <span>Import</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-3 text-gray-700 hover:bg-gray-50 transition">
            <FaFileDownload className="w-4 h-4" />
            <span>Export</span>
          </button>

        </div>

      </div>

      <div class="container mt-4 flex gap-10">
        <form class="grid grid-cols-2 w-[660px] gap-4">


          <div class="">
            <label class="form-label fw-semibold">Name <span class="text-danger">*</span></label>
            <input type="text" class="form-control" placeholder="Enter Name Product" />
          </div>


          <div class="">
            <label class="form-label fw-semibold">Category <span class="text-danger">*</span></label>
            <select class="form-select">
              <option>Choose Category</option>
            </select>
          </div>


          <div class="">
            <label class="form-label fw-semibold">Brand</label>
            <select class="form-select">
              <option>Choose Brand</option>
            </select>
          </div>


          <div class="">
            <label class="form-label fw-semibold">Barcode Symbology <span class="text-danger">*</span></label>
            <select class="form-select">
              <option>Choose symbology</option>
            </select>
          </div>


          <div class="">
            <label class="form-label fw-semibold">Product Cost <span class="text-danger">*</span></label>
            <input type="text" class="form-control" placeholder="Enter Product Cost" />
          </div>


          <div class="">
            <label class="form-label fw-semibold">Product Price <span class="text-danger">*</span></label>
            <input type="text" class="form-control" placeholder="Enter Product Price" />
          </div>


          <div class="">
            <label class="form-label fw-semibold">Product Unit <span class="text-danger">*</span></label>
            <select class="form-select">
              <option>Choose Product Unit</option>
            </select>
          </div>


          <div class="">
            <label class="form-label fw-semibold">Purchase Unit <span class="text-danger">*</span></label>
            <select class="form-select">
              <option>Choose Purchase Unit</option>
            </select>
          </div>


        </form>

        <div className='card' style={{width:"40%"}}>
          ksjsdhdh
        </div>

      </div>
      <div className="container">

        <div className='d-flex align-items-center gap-3 mt-4'>
          <h4>View more</h4>
          <label>
            
            <input 
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            
            />
            
          </label>
        </div>
        


       {isChecked &&(
         <div id="extraFields" className="border rounded-3 p-3 bg-light">
          <div class="row g-3 ">
            <div className="col-md-6">
              <label class="form-label fw-semibold">Code Product <span class="text-danger">*</span></label>
              <input type="text" class="form-control" placeholder="Enter Code Product" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Additional Field 2</label>
              <input type="text" className="form-control" placeholder="Enter value 2" />
            </div>
          </div>
        </div>
       )}
      </div>






    </>
  )
}

export default AddProduct
