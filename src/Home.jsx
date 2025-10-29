import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "./layouts/page-wrapper";
import axiosInstance from "./axiosConfig";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import {
  IoReceiptOutline,
  IoWalletOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import { BiTrendingUp } from "react-icons/bi";
import { FaFolder } from "react-icons/fa";
import Folders from "./Folders";

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalInvoices: 0,
    totalRevenue: 0,
    totalPaid: 0,
    totalOutstanding: 0,
    totalCustomers: 0,
    recentInvoices: [],
    recentPayments: [],
    topCustomers: [],
    invoiceStats: {
      paid: 0,
      partial: 0,
      unpaid: 0,
    },
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [invoicesRes, customersRes, paymentsRes] = await Promise.all([
        axiosInstance.get("/sales-invoices"),
        axiosInstance.get("/customers"),
        axiosInstance.get("/payment-receipts"),
      ]);

      const invoices = invoicesRes.data.data.data || [];
      const customers = customersRes.data.data.data || [];
      const payments = paymentsRes.data.data.data || [];

      // Calculate statistics
      const totalRevenue = invoices.reduce(
        (sum, inv) => sum + parseFloat(inv.grand_total || 0),
        0
      );
      const totalPaid = payments.reduce(
        (sum, pay) => sum + parseFloat(pay.amount || 0),
        0
      );
      const totalOutstanding = totalRevenue - totalPaid;

      const paidCount = invoices.filter(
        (inv) => inv.payment_status === "paid"
      ).length;
      const partialCount = invoices.filter(
        (inv) => inv.payment_status === "partial"
      ).length;
      const unpaidCount = invoices.filter(
        (inv) => inv.payment_status === "unpaid"
      ).length;

      // Get recent invoices (last 5)
      const recentInvoices = invoices
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);

      // Get recent payments (last 5)
      const recentPayments = payments
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);

      // Calculate top customers by total invoice amount
      const customerInvoiceMap = {};
      invoices.forEach((inv) => {
        const customerId = inv.customer_id;
        if (!customerInvoiceMap[customerId]) {
          customerInvoiceMap[customerId] = {
            total: 0,
            count: 0,
            customer: customers.find((c) => c.id === customerId),
          };
        }
        customerInvoiceMap[customerId].total += parseFloat(
          inv.grand_total || 0
        );
        customerInvoiceMap[customerId].count += 1;
      });

      const topCustomers = Object.values(customerInvoiceMap)
        .filter((c) => c.customer)
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);

      setDashboardData({
        totalInvoices: invoices.length,
        totalRevenue,
        totalPaid,
        totalOutstanding,
        totalCustomers: customers.length,
        recentInvoices,
        recentPayments,
        topCustomers,
        invoiceStats: {
          paid: paidCount,
          partial: partialCount,
          unpaid: unpaidCount,
        },
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageWrapper title="Dashboard">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "400px" }}
        >
          <div className="spinner-border text-dark" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Dashboard">
      <div>
        {/* Statistics Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card rounded-1 shadow-none  border-1">
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <small
                      className="text-muted d-block mb-1"
                      style={{ fontSize: "11px" }}
                    >
                      TOTAL REVENUE
                    </small>
                    <h4 className="mb-0 fw-light">
                      Rs. {dashboardData.totalRevenue.toFixed(2)}
                    </h4>
                  </div>
                  <div className="bg-dark rounded p-2">
                    <BiTrendingUp
                      className="text-white"
                      style={{ fontSize: "24px" }}
                    />
                  </div>
                </div>
                <div
                  className="d-flex align-items-center gap-1"
                  style={{ fontSize: "12px" }}
                >
                  <span className="text-success d-flex align-items-center gap-1">
                    <FaArrowUp style={{ fontSize: "10px" }} />
                    <span className="fw-semibold">
                      {dashboardData.totalInvoices}
                    </span>
                  </span>
                  <span className="text-muted">total invoices</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card rounded-1 shadow-none  border-1">
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <small
                      className="text-muted d-block mb-1"
                      style={{ fontSize: "11px" }}
                    >
                      TOTAL PAID
                    </small>
                    <h4 className="mb-0 fw-light text-success">
                      Rs. {dashboardData.totalPaid.toFixed(2)}
                    </h4>
                  </div>
                  <div className="bg-dark rounded p-2">
                    <IoWalletOutline
                      className="text-white"
                      style={{ fontSize: "24px" }}
                    />
                  </div>
                </div>
                <div
                  className="d-flex align-items-center gap-1"
                  style={{ fontSize: "12px" }}
                >
                  <span className="text-success d-flex align-items-center gap-1">
                    <FaArrowUp style={{ fontSize: "10px" }} />
                    <span className="fw-semibold">
                      {dashboardData.recentPayments.length}
                    </span>
                  </span>
                  <span className="text-muted">recent payments</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card rounded-1 shadow-none border-1">
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <small
                      className="text-muted d-block mb-1"
                      style={{ fontSize: "11px" }}
                    >
                      OUTSTANDING
                    </small>
                    <h4
                      className={`mb-0 fw-light ${
                        dashboardData.totalOutstanding > 0
                          ? "text-danger"
                          : "text-dark"
                      }`}
                    >
                      Rs. {dashboardData.totalOutstanding.toFixed(2)}
                    </h4>
                  </div>
                  <div
                    className={`${
                      dashboardData.totalOutstanding > 0 ? "bg-dark" : "bg-dark"
                    } rounded p-2`}
                  >
                    <IoReceiptOutline
                      className="text-white"
                      style={{ fontSize: "24px" }}
                    />
                  </div>
                </div>
                <div
                  className="d-flex align-items-center gap-1"
                  style={{ fontSize: "12px" }}
                >
                  <span className="text-danger d-flex align-items-center gap-1">
                    <FaArrowDown style={{ fontSize: "10px" }} />
                    <span className="fw-semibold">
                      {dashboardData.invoiceStats.unpaid +
                        dashboardData.invoiceStats.partial}
                    </span>
                  </span>
                  <span className="text-muted">pending invoices</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card rounded-1 shadow-none  border-1">
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <small
                      className="text-muted d-block mb-1"
                      style={{ fontSize: "11px" }}
                    >
                      TOTAL CUSTOMERS
                    </small>
                    <h4 className="mb-0 fw-light">
                      {dashboardData.totalCustomers}
                    </h4>
                  </div>
                  <div className="bg-dark rounded p-2">
                    <IoPeopleOutline
                      className="text-white"
                      style={{ fontSize: "24px" }}
                    />
                  </div>
                </div>
                <div
                  className="d-flex align-items-center gap-1"
                  style={{ fontSize: "12px" }}
                >
                  <span className="text-success d-flex align-items-center gap-1">
                    <FaArrowUp style={{ fontSize: "10px" }} />
                    <span className="fw-semibold">
                      {dashboardData.topCustomers.length}
                    </span>
                  </span>
                  <span className="text-muted">active customers</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Status Overview */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card rounded-1 shadow-none  border-1">
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small
                      className="text-muted d-block mb-1"
                      style={{ fontSize: "11px" }}
                    >
                      PAID INVOICES
                    </small>
                    <h5 className="mb-0 fw-bold text-success">
                      {dashboardData.invoiceStats.paid}
                    </h5>
                  </div>
                  <span
                    className="badge bg-success"
                    style={{ fontSize: "11px" }}
                  >
                    {dashboardData.totalInvoices > 0
                      ? (
                          (dashboardData.invoiceStats.paid /
                            dashboardData.totalInvoices) *
                          100
                        ).toFixed(0)
                      : 0}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card rounded-1 shadow-none  border-1">
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small
                      className="text-muted d-block mb-1"
                      style={{ fontSize: "11px" }}
                    >
                      PARTIAL PAID
                    </small>
                    <h5 className="mb-0 fw-bold text-warning">
                      {dashboardData.invoiceStats.partial}
                    </h5>
                  </div>
                  <span
                    className="badge bg-warning"
                    style={{ fontSize: "11px" }}
                  >
                    {dashboardData.totalInvoices > 0
                      ? (
                          (dashboardData.invoiceStats.partial /
                            dashboardData.totalInvoices) *
                          100
                        ).toFixed(0)
                      : 0}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card rounded-1 shadow-none  border-1">
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small
                      className="text-muted d-block mb-1"
                      style={{ fontSize: "11px" }}
                    >
                      UNPAID INVOICES
                    </small>
                    <h5 className="mb-0 fw-bold text-danger">
                      {dashboardData.invoiceStats.unpaid}
                    </h5>
                  </div>
                  <span
                    className="badge bg-danger"
                    style={{ fontSize: "11px" }}
                  >
                    {dashboardData.totalInvoices > 0
                      ? (
                          (dashboardData.invoiceStats.unpaid /
                            dashboardData.totalInvoices) *
                          100
                        ).toFixed(0)
                      : 0}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

       

        {/* Recent Invoices & Top Customers */}
        <div className="row g-3 mb-4">
          <div className="col-lg-8">
            <div
              className="card shadow-none rounded-1"
              style={{ border: "1px solid #e0e0e0" }}
            >
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6
                    className="mb-0 text-secondary"
                    style={{ fontSize: "13px" }}
                  >
                    RECENT INVOICES
                  </h6>
                  <button
                    onClick={() => navigate("/invoices")}
                    className="btn btn-outline-dark btn-sm"
                    style={{ fontSize: "12px" }}
                  >
                    View All
                  </button>
                </div>

                {dashboardData.recentInvoices.length > 0 ? (
                  <div className="table-responsive">
                    <table
                      className="table table-hover mb-0"
                      style={{ fontSize: "12px" }}
                    >
                      <thead style={{ backgroundColor: "#fafafa" }}>
                        <tr>
                          <th className="py-2">Invoice No</th>
                          <th className="py-2">Date</th>
                          <th className="py-2">Customer</th>
                          <th className="py-2 text-end">Amount</th>
                          <th className="py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData.recentInvoices.map((invoice) => (
                          <tr
                            key={invoice.id}
                            style={{
                              borderBottom: "1px solid #f0f0f0",
                              cursor: "pointer",
                            }}
                            onClick={() => navigate(`/invoices`)}
                          >
                            <td className="py-2 fw-semibold">
                              {invoice.invoice_no}
                            </td>
                            <td className="py-2 text-muted">
                              {new Date(invoice.date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </td>
                            <td className="py-2">
                              {invoice.customer?.name ||
                                `Customer #${invoice.customer_id}`}
                            </td>
                            <td className="py-2 text-end fw-bold">
                              Rs. {parseFloat(invoice.grand_total).toFixed(2)}
                            </td>
                            <td className="py-2">
                              <span
                                className={`badge ${
                                  invoice.payment_status === "paid"
                                    ? "bg-success"
                                    : invoice.payment_status === "partial"
                                    ? "bg-warning"
                                    : "bg-danger"
                                }`}
                                style={{ fontSize: "10px" }}
                              >
                                {invoice.payment_status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted mb-0" style={{ fontSize: "12px" }}>
                      No invoices found
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div
              className="card shadow-none rounded-1"
              style={{ border: "1px solid #e0e0e0" }}
            >
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6
                    className="mb-0 text-secondary"
                    style={{ fontSize: "13px" }}
                  >
                    TOP CUSTOMERS
                  </h6>
                  <button
                    onClick={() => navigate("/customers")}
                    className="btn btn-outline-dark btn-sm"
                    style={{ fontSize: "12px" }}
                  >
                    View All
                  </button>
                </div>

                {dashboardData.topCustomers.length > 0 ? (
                  <div className="d-flex flex-column gap-2">
                    {dashboardData.topCustomers.map((customerData, index) => (
                      <div
                        key={customerData.customer.id}
                        className="d-flex justify-content-between align-items-center p-2 border rounded"
                        style={{ fontSize: "12px", cursor: "pointer" }}
                        onClick={() =>
                          navigate(
                            `/customer-ledger/${customerData.customer.id}`
                          )
                        }
                      >
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="bg-dark text-white rounded d-flex align-items-center justify-content-center fw-bold"
                            style={{
                              width: "28px",
                              height: "28px",
                              fontSize: "11px",
                            }}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <div className="fw-semibold">
                              {customerData.customer.name}
                            </div>
                            <small
                              className="text-muted"
                              style={{ fontSize: "10px" }}
                            >
                              {customerData.count} invoice
                              {customerData.count > 1 ? "s" : ""}
                            </small>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold">
                            Rs. {customerData.total.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted mb-0" style={{ fontSize: "12px" }}>
                      No customers found
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Payments */}
        <div
          className="card shadow-none rounded-1"
          style={{ border: "1px solid #e0e0e0" }}
        >
          <div className="card-body p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0 text-secondary" style={{ fontSize: "13px" }}>
                RECENT PAYMENTS
              </h6>
              <button
                onClick={() => navigate("/payment")}
                className="btn btn-outline-dark btn-sm"
                style={{ fontSize: "12px" }}
              >
                View All
              </button>
            </div>

            {dashboardData.recentPayments.length > 0 ? (
              <div className="row g-2">
                {dashboardData.recentPayments.map((payment) => (
                  <div key={payment.id} className="col-md-3">
                    <div
                      className="card border-2 rounded-1 border-success"
                      style={{ fontSize: "12px" }}
                    >
                      <div className="card-body p-2">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <strong>{payment.receipt_no}</strong>
                            <div
                              className="text-muted"
                              style={{ fontSize: "11px" }}
                            >
                              {new Date(payment.date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </div>
                          </div>
                          <div className="fw-bold text-success">
                            Rs. {parseFloat(payment.amount).toFixed(2)}
                          </div>
                        </div>
                        <div
                          className="text-muted mb-1"
                          style={{ fontSize: "11px" }}
                        >
                          {payment.title}
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span
                            className="badge bg-success"
                            style={{ fontSize: "9px" }}
                          >
                            {payment.payment_method}
                          </span>
                          {payment.customer && (
                            <span
                              className="text-muted"
                              style={{ fontSize: "10px" }}
                            >
                              {payment.customer.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted mb-0" style={{ fontSize: "12px" }}>
                  No payments found
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Home;
