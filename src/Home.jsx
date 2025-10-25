import React, { useEffect } from "react";
import { db } from "./firebase";
import { getDocs, collection } from "firebase/firestore";
import { appBase } from "./store/appBase";
import { salesInvoiceState } from "./store/salesInvoiceState";
function Home() {
  const { theme, setTheme } = appBase();
  const { salesInvoices, isLoading } = salesInvoiceState();

  function getData() {
    getDocs(collection(db, "invoices")).then((resp) => {
      for (let i = 0; i < resp.docs.length; i++) {
        const invoiceData = resp.docs[i];
        let invoiceInfo = invoiceData.data();
        invoiceInfo["id"] = invoiceData.id;
        console.log(invoiceInfo);
      }
    });
  }

  return (
    <div>
      <button onClick={getData}>Click</button>
      <h2>{theme}</h2>
      <span>{isLoading.toString()}</span>
      {salesInvoices.map((inv, index) => (
        <h2>{inv.invoice_no}</h2>
      ))}
    </div>
  );
}

export default Home;
