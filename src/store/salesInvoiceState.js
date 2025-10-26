import { create } from "zustand";
import axiosInstance from "../axiosConfig";

export const salesInvoiceState = create((set) => ({
  isLoading: true,
  salesInvoices: [],

  //   setLoading: () => set((state) => (isLoading = !state.isLoading)),

  fetchSalesInvoices: async () => {
    await axiosInstance
      .get("/sales-invoices")
      .then((resp) => {
        // setInvoices(resp.data.data.data);
        set({ salesInvoices: resp.data.data.data });
      })
      .catch((ex) => console.error(ex));
    set({ isLoading: false });
  },
  addSalesInvoices: (invoiceData) =>
    set((state) => ({ salesInvoices: [...state.salesInvoices, invoiceData] })),

  setSalesInvoices: (invoiceData) => set({ salesInvoices: salesInvoices }),
}));
