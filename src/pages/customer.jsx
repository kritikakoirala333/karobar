import React from 'react'
import { db } from '../firebase'
import { addDoc, getDocs, collection, doc } from 'firebase/firestore'




function customer() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const getCustomersFromFirebase = async () => {
      const resp = await getDocs(collection(db, "customers"));
      const data = resp.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCustomers(data);
    }
    getCustomersFromFirebase();

  }, [])


  {
    customers.map((customer, index) => {
      return (
        <div>
          {customer.customername}
        </div>
      )
    })
  }

}

export default customer

