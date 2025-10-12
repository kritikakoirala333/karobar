import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { getDoc, doc } from "firebase/firestore";

const InvoicePage = () => {
  const [invoice, setInvoice] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const docRef = doc(db, "invoices", "EWpRLl8LgENNvD4IKQip");
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          const data = snapshot.data();
          setInvoice(data);

          // Example price mapping (You can store prices in Firestore instead)
          const priceList = {
            Chair: 50,
            Table: 120,
            Laptop: 1000,
          };

          const calculatedSubtotal = data.fields.reduce((acc, item) => {
            const price = priceList[item.name] || 0;
            return acc + price * Number(item.quantity);
          }, 0);

          const calculatedTax = calculatedSubtotal * 0.1;
          const calculatedTotal = calculatedSubtotal + calculatedTax;

          setSubtotal(calculatedSubtotal);
          setTax(calculatedTax);
          setTotal(calculatedTotal);
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
      }
    };

    fetchInvoice();
  }, []);

  if (!invoice) return <p className="text-center mt-10">Loading invoice...</p>;

  return (
    
    <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-start bg-gradient-to-r from-blue-700 to-blue-400 text-white p-6">
          <div>
            <h1 className="text-2xl font-bold">COMPANY</h1>
            <p className="text-sm opacity-90">Company Tagline Here</p>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold">INVOICE</h2>
            <div className="text-sm mt-2 space-y-1">
              <p>Invoice Number: #12456</p>
              <p>Account No: 1234 5678 910</p>
              <p>Invoice Date: April 05, 2020</p>
            </div>
          </div>
        </div>

        {/* Invoice Info */}
        <div className="flex flex-col md:flex-row justify-between p-6 border-b border-gray-200 bg-blue-50">
          <div>
            <p className="font-semibold text-lg text-blue-600">INVOICE TO:</p>
            <p className="text-xl font-bold mt-1">{invoice.customername}</p>
            <p className="text-sm">Address: {invoice.address}</p>
            <p className="text-sm">Phone: {invoice.mobileno}</p>
            <p className="text-sm">Email: example@mail.com</p>
          </div>

          <div className="mt-6 md:mt-0">
            <p className="font-semibold text-lg text-blue-600">
              Payment Method
            </p>
            <p className="text-sm">Account No: 1234 5678 910</p>
            <p className="text-sm">Account Name: {invoice.customername}</p>
            <p className="text-sm">Branch Name: XYZ</p>
          </div>
        </div>

        {/* Table */}
        <div className="p-6">
          <div className="grid grid-cols-12 bg-blue-600 text-white font-semibold rounded-t-md">
            <div className="col-span-6 p-2 text-sm">ITEM DESCRIPTION</div>
            <div className="col-span-2 p-2 text-sm text-right">PRICE</div>
            <div className="col-span-2 p-2 text-sm text-center">QTY</div>
            <div className="col-span-2 p-2 text-sm text-right">TOTAL</div>
          </div>

          {invoice.fields && invoice.fields.length > 0 ? (
            invoice.fields.map((item, index) => {
              const priceList = {
                Chair: 50,
                Table: 120,
                Laptop: 1000,
              };
              const price = priceList[item.name] || 0;
              const total = price * Number(item.quantity);

              return (
                <div
                  key={index}
                  className={`grid grid-cols-12 text-sm ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } border-b border-gray-200`}
                >
                  <div className="col-span-6 p-2">{item.name}</div>
                  <div className="col-span-2 p-2 text-right">${price}</div>
                  <div className="col-span-2 p-2 text-center">
                    {item.quantity}
                  </div>
                  <div className="col-span-2 p-2 text-right">${total}</div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-500 py-6 border border-gray-200 rounded-b-md">
              No items found...
            </div>
          )}
        </div>

        {/* Totals */}
        <div className="p-6 flex justify-end bg-gray-50 border-t border-gray-200">
          <div className="w-full max-w-xs text-sm">
            <div className="flex justify-between py-1">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Discount:</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Tax (10%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold mt-2 text-blue-700">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
