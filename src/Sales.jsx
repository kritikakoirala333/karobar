import React from 'react'
import  { useEffect, useState } from 'react'
import { db } from './firebase'
import { collection, getDocs } from 'firebase/firestore'




function Sales() {
  const [salesData, setSales] = useState([]);

  function getSalesInfo() {
    // getDocs(collection(db, 'sales')).then(resp => {
    //   const tempData = resp.docs.map(doc => ({
    //     id: doc.id,
    //     ...doc.data()
    //   }));
    //   setSales(tempData);
    // });

    add
  }
  useEffect(getSalesInfo, [])

  return (
    <>
      <div className='container'>
        <div className='py-3'>
          <div className='card rounded'>
            <div className='row'>
              <div className='col-lg-3'>
                <div className='p-3 d-flex'>
                  <h3 className='bg-primary px-4 py-4 justify-content-center rounded text-white'>Sales</h3>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </>
  )
}
export default Sales
