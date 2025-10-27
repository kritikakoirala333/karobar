import React, { useEffect } from "react";
import { db } from "./firebase";
import { getDocs, collection } from "firebase/firestore";
import { appBase } from "./store/appBase";
import { salesInvoiceState } from "./store/salesInvoiceState";
import PageWrapper from "./layouts/page-wrapper";
import { themeBase } from "./store/themeBase";
function Home() {
  // const { theme, setTheme } = appBase();
  const {theme, setTheme} = themeBase();
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

  const trailingElem = () => {
    return <button className="btn btn-primary btn-sm">Print</button>
  }

  return (
    <PageWrapper title="Home" trailing={trailingElem}>
      <div>
        <button onClick={() => {
          setTheme("blue")
        }}>Click</button>
        <h2>{theme}</h2>
        <span>{isLoading.toString()}</span>
        {salesInvoices.map((inv, index) => (
          <h2>{inv.invoice_no}</h2>
        ))}
      </div>
     </PageWrapper>
  );
}

export default Home;
