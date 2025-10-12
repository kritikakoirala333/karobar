import React from 'react'
import {db} from './firebase'
import { getDocs, collection } from 'firebase/firestore'
function Home() {

  function getData () {
      getDocs(collection(db, 'invoices')).then(resp => {
        for (let i = 0; i < resp.docs.length; i++) {
          const invoiceData = resp.docs[i];
          let invoiceInfo = invoiceData.data();
          invoiceInfo['id'] = invoiceData.id;
          console.log(invoiceInfo);
          
        }
      })
  }
  return (
    <div>
      <button onClick={getData}>Click</button>
    </div>
  )
}

export default Home
