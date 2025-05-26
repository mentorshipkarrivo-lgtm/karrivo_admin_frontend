import React, { useState } from "react";
import DashboardLayout from "../../Layout/DashboardLayout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Skeleton from "react-loading-skeleton";
import { Modal, Button } from "react-bootstrap";
import { useGetBusinessDetailsByDateMutation } from "../../features/getBusniessDetails/getBusinessDetailsApiSlice";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";

function GetBusinessDetails() {
  // Business data state - now handles array of users
  const [usersData, setUsersData] = useState([]);
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);
  const [dataFetched, setDataFetched] = useState(false);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("orders"); // "orders" or "walletTransactions"

  // Store form values for PDF export
  const [formValues, setFormValues] = useState({ fromDate: "", toDate: "" });

  // Use the API mutation
  const [getBusinessDetails, { isLoading }] =
    useGetBusinessDetailsByDateMutation();

  // Initial form values
  const initialValues = {
    fromDate: new Date().toISOString().split("T")[0], // Format as YYYY-MM-DD for HTML date input
    toDate: new Date().toISOString().split("T")[0], // Today's date
  };

  // Validation schema using Yup
  const validationSchema = Yup.object({
    fromDate: Yup.date()
      .required("From date is required")
      .max(Yup.ref("toDate"), "From date cannot be later than To date"),
    toDate: Yup.date()
      .required("To date is required")
      .min(Yup.ref("fromDate"), "To date cannot be earlier than From date"),
  });

  // Form submission handler
  const handleSubmit = async (values, { setSubmitting }) => {
    setDataFetched(false);
    setUsersData([]);
    setSelectedUserIndex(0);

    // Store form values for PDF export
    setFormValues({ fromDate: values.fromDate, toDate: values.toDate });

    try {
      // Make the POST request with just the date range
      const response = await getBusinessDetails({
        fromDate: values.fromDate,
        toDate: values.toDate,
      }).unwrap();

      // Update state with the response data
      if (response && response.data && Array.isArray(response.data)) {
        setUsersData(response.data);
        setDataFetched(true);
      }
    } catch (error) {
      console.error("Error fetching business data:", error);
      toast.error("Error fetching business data. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Get currently selected user data
  const getCurrentUserData = () => {
    if (usersData.length === 0) return null;
    return usersData[selectedUserIndex] || null;
  };

  // Handle view modal for orders or wallet transactions
  const handleViewDetails = (type) => {
    const userData = getCurrentUserData();
    if (!userData) return;

    setModalType(type);
    setShowModal(true);
  };

  // Function to format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Calculate total statistics across all users
  const getTotalStats = () => {
    if (usersData.length === 0)
      return {
        totalUsers: 0,
        totalCoins: 0,
        totalInvestments: 0,
        paymentModeStats: {},
      };

    // Calculate payment mode statistics
    const paymentModeStats = {};
    usersData.forEach((user) => {
      if (user.walletTransactions && user.walletTransactions.length > 0) {
        user.walletTransactions.forEach((transaction) => {
          const mode = transaction.paymentMode || "Unknown";
          if (!paymentModeStats[mode]) {
            paymentModeStats[mode] = {
              count: 0,
              amount: 0,
            };
          }
          paymentModeStats[mode].count += 1;
          paymentModeStats[mode].amount += transaction.transactionAmount || 0;
        });
      }
    });

    return {
      totalUsers: usersData.length,
      totalCoins: usersData.reduce(
        (sum, user) => sum + (user.user.totalOrderedCoins || 0),
        0
      ),
      totalInvestments: usersData.reduce(
        (sum, user) => sum + (user.user.totalInvestments || 0),
        0
      ),
      paymentModeStats,
    };
  };

  // PDF Export functionality
  const exportToPDF = () => {
    if (!dataFetched || usersData.length === 0) {
      toast.error("No data available to export. Please fetch data first.");
      return;
    }

    try {
      // Create a new PDF document
      const doc = new jsPDF();

      // Get total stats for the report
      const stats = getTotalStats();

      // Generate the PDF sections - Combined summary and payment on same page
      createCombinedSummarySection(
        doc,
        stats,
        formValues.fromDate,
        formValues.toDate
      );
      doc.addPage();

      createUsersOverviewSection(doc, usersData);
      doc.addPage();

      // Add ALL users' detailed information with orders and transactions
      createAllUsersDetailedSection(doc, usersData);

      // Generate PDF file
      const today = new Date().toISOString().slice(0, 10);
      doc.save(
        `Business_Report_${formValues.fromDate}_to_${formValues.toDate}_${today}.pdf`
      );

      toast.success("PDF download started successfully!");
    } catch (error) {
      console.error("PDF Generation Error:", error);
      toast.error("Error creating PDF. Please try again.");
    }
  };

  // PDF Helper Functions - Combined Summary and Payment Mode on same page
  const createCombinedSummarySection = (doc, stats, fromDate, toDate) => {
    // Title
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("JAIMAX BUSINESS REPORT", 105, 25, { align: "center" });

    // Date range
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `From ${formatDateForPDF(fromDate)} To ${formatDateForPDF(toDate)}`,
      105,
      35,
      { align: "center" }
    );
    doc.text(
      `Generated by Dev-Team on: ${new Date().toLocaleDateString()}`,
      105,
      40,
      {
        align: "center",
      }
    );

    // Business Summary
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text("JAIMAX BUSINESS SUMMARY", 20, 65);

    const summaryData = [
      ["Total Users", stats.totalUsers.toString()],
      ["Total Coins", stats.totalCoins.toLocaleString()],
      ["Total Investments", stats.totalInvestments.toLocaleString()],
    ];

    autoTable(doc, {
      startY: 75,
      head: [["Metric", "Value"]],
      body: summaryData,
      theme: "grid",
      styles: { fontSize: 12 },
      headStyles: { fillColor: [236, 102, 15], textColor: 255 },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      margin: { left: 20, right: 20 },
    });

    // Payment Mode Breakdown on same page
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text("PAYMENT MODE BREAKDOWN", 20, 140);

    if (Object.keys(stats.paymentModeStats).length === 0) {
      doc.setFontSize(12);
      doc.text("No payment data available", 20, 155);
      return;
    }

    const paymentData = Object.entries(stats.paymentModeStats).map(
      ([mode, stats]) => [
        mode,
        stats.count.toString(),
        stats.amount.toLocaleString(),
      ]
    );

    autoTable(doc, {
      startY: 150,
      head: [["Payment Mode", "Transactions", "Total Amount"]],
      body: paymentData,
      theme: "grid",
      styles: { fontSize: 12 },
      headStyles: { fillColor: [236, 102, 15], textColor: 255 },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      margin: { left: 20, right: 20 },
    });
  };

  const createUsersOverviewSection = (doc, usersData) => {
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text("USERS OVERVIEW", 20, 25);

    const userData = usersData.map((user, index) => [
      (index + 1).toString(),
      user.user.name,
      user.user.email,
      user.user.phone.toString(),
      user.user.totalOrderedCoins?.toLocaleString() || "0",
      user.user.totalInvestments?.toLocaleString() || "0",
      user.orders?.length.toString() || "0",
      user.walletTransactions?.length.toString() || "0",
    ]);

    autoTable(doc, {
      startY: 35,
      head: [
        [
          "S.No",
          "Name",
          "Email",
          "Phone",
          "Total Coins",
          "Investments",
          "Orders",
          "Transactions",
        ],
      ],
      body: userData,
      theme: "grid",
      styles: { fontSize: 7, cellPadding: 2 },
      headStyles: { fillColor: [236, 102, 15], textColor: 255, fontSize: 8 },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      margin: { left: 10, right: 10 },
      columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: 35 },
        2: { cellWidth: 45 },
        3: { cellWidth: 22 },
        4: { cellWidth: 22 },
        5: { cellWidth: 20 },
        6: { cellWidth: 15 },
        7: { cellWidth: 15 },
      },
    });
  };

  // New function to show ALL users with their orders and transactions (no duplicate info)
  const createAllUsersDetailedSection = (doc, usersData) => {
    let yPos = 20;

    usersData.forEach((userData, userIndex) => {
      // Check if we need a new page for each user
      if (yPos > 50 && userIndex > 0) {
        doc.addPage();
        yPos = 20;
      }

      // Show user info only once at the top
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(236, 102, 15);
      doc.text(`${userData.user.name}`, 20, yPos);
      yPos += 15;

      // User basic info (show only once)
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(40, 40, 40);
      doc.text(`Name: ${userData.user.name}`, 20, yPos);
      doc.text(`Username: ${userData.user.username}`, 20, yPos + 7);
      doc.text(`Email: ${userData.user.email}`, 20, yPos + 14);
      doc.text(`Phone: ${userData.user.phone}`, 20, yPos + 21);
      doc.text(
        `Total Coins: ${
          userData.user.totalOrderedCoins?.toLocaleString() || "0"
        }`,
        20,
        yPos + 28
      );
      doc.text(
        `Total Investments: ${
          userData.user.totalInvestments?.toLocaleString() || "0"
        }`,
        20,
        yPos + 35
      );
      yPos += 50;

      // Orders section (if user has orders)
      if (userData.orders && userData.orders.length > 0) {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(40, 40, 40);
        doc.text("Orders", 20, yPos);
        yPos += 10;

        // Orders summary stats
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Total Orders: ${userData.orders.length}`, 20, yPos);
        doc.text(
          `Total Tokens: ${
            userData.user.totalOrderedCoins?.toLocaleString() || "0"
          }`,
          100,
          yPos
        );
        yPos += 15;

        // Orders table
        const orderData = userData.orders.map((order, index) => [
          (index + 1).toString(),
          formatDateForPDF(order.createdAt),
          `${order.amount?.toLocaleString() || "0"} ${order.currency || "INR"}`,
          order.jaimax?.toLocaleString() || "0",
          order.status || "N/A",
        ]);

        autoTable(doc, {
          startY: yPos,
          head: [["S.No", "Date", "Amount", "JAIMAX Tokens", "Status"]],
          body: orderData,
          theme: "grid",
          styles: { fontSize: 9 },
          headStyles: { fillColor: [236, 102, 15], textColor: 255 },
          alternateRowStyles: { fillColor: [250, 250, 250] },
          margin: { left: 20, right: 20 },
        });

        yPos += orderData.length * 8 + 20;
      }

      // Wallet Transactions section (if user has transactions)
      if (
        userData.walletTransactions &&
        userData.walletTransactions.length > 0
      ) {
        // Check if we need a new page
        if (yPos > 180) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(40, 40, 40);
        doc.text("Wallet Transactions", 20, yPos);
        yPos += 10;

        // Transactions summary stats
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(
          `Total Transactions: ${userData.walletTransactions.length}`,
          20,
          yPos
        );
        doc.text(
          `Total Investment: ${
            userData.user.totalInvestments?.toLocaleString() || "0"
          }`,
          100,
          yPos
        );
        yPos += 15;

        // Wallet transactions table
        const transactionData = userData.walletTransactions.map(
          (transaction, index) => [
            (index + 1).toString(),
            formatDateForPDF(transaction.transactionDate),
            `${transaction.transactionAmount?.toLocaleString() || "0"} ${
              transaction.currency || "INR"
            }`,
            transaction.paymentMode || "N/A",
            transaction.transactionId || "N/A",
            transaction.transactionStatus || "N/A",
          ]
        );

        autoTable(doc, {
          startY: yPos,
          head: [
            [
              "S.NO",
              "Date",
              "Amount",
              "Payment Mode",
              "Transaction ID",
              "Status",
            ],
          ],
          body: transactionData,
          theme: "grid",
          styles: { fontSize: 8 },
          headStyles: { fillColor: [236, 102, 15], textColor: 255 },
          alternateRowStyles: { fillColor: [250, 250, 250] },
          margin: { left: 20, right: 20 },
        });

        yPos += transactionData.length * 8 + 20;
      }

      // Add some space between users
      yPos += 15;
    });
  };

  // Helper function to format date for PDF
  const formatDateForPDF = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const currentUserData = getCurrentUserData();
  const totalStats = getTotalStats();

  return (
    <DashboardLayout>
      <section className="profile_section py-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="my_total_team_data rounded-3 px-3 pb-0 py-4">
                <h1 className="mb-3">Get Business Details</h1>

                {/* Form */}
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, errors, touched }) => (
                    <Form>
                      <div className="row justify-content-center mb-3">
                        <div className="col-12 col-sm-4 col-md-3 mb-3">
                          <div className="form-group">
                            <label
                              htmlFor="fromDate"
                              className="form-label"
                              style={{ fontSize: "14px" }}
                            >
                              From Date
                            </label>
                            <Field
                              style={{
                                backgroundColor: "#1b232d",
                                padding: "8px 12px",
                                fontSize: "14px",
                                height: "38px",
                              }}
                              id="fromDate"
                              name="fromDate"
                              type="date"
                              className={`form-control form-control-sm ${
                                errors.fromDate && touched.fromDate
                                  ? "is-invalid"
                                  : ""
                              }`}
                            />
                            <ErrorMessage
                              name="fromDate"
                              component="div"
                              className="invalid-feedback"
                              style={{ fontSize: "12px" }}
                            />
                          </div>
                        </div>

                        <div className="col-12 col-sm-4 col-md-3 mb-3">
                          <div className="form-group">
                            <label
                              htmlFor="toDate"
                              className="form-label"
                              style={{ fontSize: "14px" }}
                            >
                              To Date
                            </label>
                            <Field
                              style={{
                                backgroundColor: "#1b232d",
                                padding: "8px 12px",
                                fontSize: "14px",
                                height: "38px",
                              }}
                              id="toDate"
                              name="toDate"
                              type="date"
                              className={`form-control form-control-sm ${
                                errors.toDate && touched.toDate
                                  ? "is-invalid"
                                  : ""
                              }`}
                            />
                            <ErrorMessage
                              name="toDate"
                              component="div"
                              className="invalid-feedback"
                              style={{ fontSize: "12px" }}
                            />
                          </div>
                        </div>

                        <div className="col-12 col-sm-4 col-md-3 mb-3 d-flex align-items-end">
                          <button
                            type="submit"
                            disabled={isSubmitting || isLoading}
                            className="btn btn-primary btn-sm w-100"
                            style={{
                              backgroundColor: "#ec660f",
                              border: "1px solid black",
                              transition: "all 0.3s ease",
                              padding: "8px 16px",
                              fontSize: "14px",
                              height: "38px",
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = "#d25400";
                              e.currentTarget.style.transform =
                                "translateY(-2px)";
                              e.currentTarget.style.boxShadow =
                                "0 4px 8px rgba(0, 0, 0, 0.2)";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = "#ec660f";
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          >
                            {isSubmitting || isLoading ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                  aria-hidden="true"
                                  style={{ width: "12px", height: "12px" }}
                                ></span>
                                Loading...
                              </>
                            ) : (
                              "Get Details"
                            )}
                          </button>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>

                {/* Total Statistics Summary */}
                {dataFetched && usersData.length > 0 && (
                  <div className="my-4">
                    <div
                      className="card"
                      style={{
                        backgroundColor: "#1b232d",
                        color: "#fff",
                        border: "1px solid #3a3a3a",
                      }}
                    >
                      <div
                        className="card-header py-3"
                        style={{ borderBottom: "1px solid #3a3a3a" }}
                      >
                        <h5 className="mb-0" style={{ color: "#ec660f" }}>
                          Business Summary
                        </h5>
                      </div>
                      <div className="card-body">
                        <div className="row text-center mb-4">
                          <div className="col-md-4">
                            <div
                              className="p-3 rounded"
                              style={{ backgroundColor: "#2e2e2e" }}
                            >
                              <h6 style={{ color: "#ec660f" }}>Total Users</h6>
                              <h4 className="mb-0">{totalStats.totalUsers}</h4>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div
                              className="p-3 rounded"
                              style={{ backgroundColor: "#2e2e2e" }}
                            >
                              <h6 style={{ color: "#ec660f" }}>Total Coins</h6>
                              <h4 className="mb-0">
                                {totalStats.totalCoins.toLocaleString()}
                              </h4>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div
                              className="p-3 rounded"
                              style={{ backgroundColor: "#2e2e2e" }}
                            >
                              <h6 style={{ color: "#ec660f" }}>
                                Total Investments
                              </h6>
                              <h4 className="mb-0">
                                ₹{totalStats.totalInvestments.toLocaleString()}
                              </h4>
                            </div>
                          </div>
                        </div>

                        {/* Payment Mode Statistics */}
                        {Object.keys(totalStats.paymentModeStats).length >
                          0 && (
                          <>
                            <div className="row">
                              <div className="col-12 d-flex justify-content-between align-items-center">
                                <h6
                                  style={{
                                    color: "#ec660f",
                                    marginBottom: "20px",
                                  }}
                                >
                                  Payment Mode Breakdown
                                </h6>
                                {/* PDF Export Button */}
                                <button
                                  onClick={exportToPDF}
                                  className="btn btn-sm mb-2"
                                  style={{
                                    backgroundColor: "#28a745",
                                    color: "white",
                                    border: "1px solid #28a745",
                                    borderRadius: "6px",
                                    padding: "8px 16px",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    transition: "all 0.3s ease",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                      "#218838";
                                    e.currentTarget.style.transform =
                                      "translateY(-1px)";
                                    e.currentTarget.style.boxShadow =
                                      "0 2px 4px rgba(0, 0, 0, 0.2)";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                      "#28a745";
                                    e.currentTarget.style.transform =
                                      "translateY(0)";
                                    e.currentTarget.style.boxShadow = "none";
                                  }}
                                >
                                  📄 Export PDF
                                </button>
                              </div>
                            </div>
                            <div className="row text-center">
                              {Object.entries(totalStats.paymentModeStats).map(
                                ([mode, stats], index) => (
                                  <div
                                    key={mode}
                                    className="col-md-4 col-sm-6 mb-3"
                                  >
                                    <div
                                      className="p-3 rounded"
                                      style={{
                                        backgroundColor: "#3a3a3a",
                                        border: "1px solid #4a4a4a",
                                        transition: "all 0.3s ease",
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor =
                                          "#4a4a4a";
                                        e.currentTarget.style.transform =
                                          "translateY(-2px)";
                                        e.currentTarget.style.boxShadow =
                                          "0 4px 8px rgba(0, 0, 0, 0.2)";
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor =
                                          "#3a3a3a";
                                        e.currentTarget.style.transform =
                                          "translateY(0)";
                                        e.currentTarget.style.boxShadow =
                                          "none";
                                      }}
                                    >
                                      <div
                                        style={{
                                          color: "#ec660f",
                                          fontWeight: "600",
                                          fontSize: "16px",
                                        }}
                                      >
                                        {mode}
                                      </div>
                                      <div className="mt-2">
                                        <div
                                          style={{
                                            fontSize: "14px",
                                            color: "#ccc",
                                          }}
                                        >
                                          Transactions:{" "}
                                          <strong>{stats.count}</strong>
                                        </div>
                                        <div
                                          style={{
                                            fontSize: "18px",
                                            fontWeight: "700",
                                            color: "#fff",
                                            marginTop: "5px",
                                          }}
                                        >
                                          ₹{stats.amount.toLocaleString()}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* User Selection Dropdown */}
                {dataFetched && usersData.length > 1 && (
                  <div className="my-4">
                    <div className="row justify-content-center">
                      <div className="col-12 col-md-6">
                        <div className="form-group">
                          <label htmlFor="userSelect" className="form-label">
                            Select User to View Details
                          </label>
                          <select
                            id="userSelect"
                            className="form-control"
                            style={{
                              backgroundColor: "#1b232d",
                              color: "#fff",
                            }}
                            value={selectedUserIndex}
                            onChange={(e) =>
                              setSelectedUserIndex(parseInt(e.target.value))
                            }
                          >
                            {usersData.map((userData, index) => (
                              <option key={index} value={index}>
                                {userData.user.name} ({userData.user.email})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Individual User Data */}
                {dataFetched && currentUserData && (
                  <div className="my-4">
                    <div
                      className="card"
                      style={{
                        backgroundColor: "#1b232d",
                        color: "#fff",
                        border: "1px solid #3a3a3a",
                      }}
                    >
                      <div
                        className="card-header py-3"
                        style={{ borderBottom: "1px solid #3a3a3a" }}
                      >
                        <h5 className="mb-0" style={{ color: "#ec660f" }}>
                          User Information
                        </h5>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <p>
                              <strong>Name:</strong> {currentUserData.user.name}
                            </p>
                            <p>
                              <strong>Email:</strong>{" "}
                              {currentUserData.user.email}
                            </p>
                            <p>
                              <strong>Phone:</strong>{" "}
                              {currentUserData.user.phone}
                            </p>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <strong>Username:</strong>{" "}
                              {currentUserData.user.username}
                            </p>
                            <p>
                              <strong>Total Coins:</strong>{" "}
                              {currentUserData.user.totalOrderedCoins?.toLocaleString() ||
                                "0"}
                            </p>
                            <p>
                              <strong>Total Investments:</strong> ₹
                              {currentUserData.user.totalInvestments?.toLocaleString() ||
                                "0"}
                            </p>
                          </div>
                        </div>

                        <div className="row mt-4">
                          <div className="col-md-6">
                            <div className="d-grid">
                              <button
                                className="btn btn-primary"
                                style={{
                                  backgroundColor: "#ec660f",
                                  border: "1px solid black",
                                  transition: "all 0.3s ease",
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "#d25400";
                                  e.currentTarget.style.transform =
                                    "translateY(-2px)";
                                  e.currentTarget.style.boxShadow =
                                    "0 4px 8px rgba(0, 0, 0, 0.2)";
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "#ec660f";
                                  e.currentTarget.style.transform =
                                    "translateY(0)";
                                  e.currentTarget.style.boxShadow = "none";
                                }}
                                onClick={() => handleViewDetails("orders")}
                                disabled={
                                  !currentUserData.orders ||
                                  currentUserData.orders.length === 0
                                }
                              >
                                View Orders (
                                {currentUserData.orders?.length || 0})
                              </button>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="d-grid">
                              <button
                                className="btn btn-primary"
                                style={{
                                  backgroundColor: "#2e2e2e",
                                  border: "1px solid #3a3a3a",
                                  transition: "all 0.3s ease",
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "#3a3a3a";
                                  e.currentTarget.style.transform =
                                    "translateY(-2px)";
                                  e.currentTarget.style.boxShadow =
                                    "0 4px 8px rgba(0, 0, 0, 0.2)";
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "#2e2e2e";
                                  e.currentTarget.style.transform =
                                    "translateY(0)";
                                  e.currentTarget.style.boxShadow = "none";
                                }}
                                onClick={() =>
                                  handleViewDetails("walletTransactions")
                                }
                                disabled={
                                  !currentUserData.walletTransactions ||
                                  currentUserData.walletTransactions.length ===
                                    0
                                }
                              >
                                View Wallet Transactions (
                                {currentUserData.walletTransactions?.length ||
                                  0}
                                )
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* No data message */}
                {dataFetched && usersData.length === 0 && (
                  <div className="alert alert-warning mt-4">
                    No data found for the selected date range
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal for Orders and Wallet Transactions */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        backdrop="static"
        keyboard={false}
        size="lg"
        centered
      >
        <Modal.Header
          style={{
            backgroundColor: "#1b242d",
            borderBottom: "1px solid #3a3a3a",
            color: "#ec660f",
          }}
        >
          <Modal.Title>
            {currentUserData?.user?.name}'s{" "}
            {modalType === "orders" ? "Orders" : "Wallet Transactions"}
          </Modal.Title>
          <button
            type="button"
            className="btn-close btn-close-white"
            aria-label="Close"
            onClick={() => setShowModal(false)}
          ></button>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#1b242d", color: "#fff" }}>
          {currentUserData && (
            <>
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="mb-3">
                    <strong>Name:</strong> {currentUserData.user.name}
                  </div>
                  <div className="mb-3">
                    <strong>Username:</strong> {currentUserData.user.username}
                  </div>
                  <div className="mb-3">
                    <strong>Email:</strong> {currentUserData.user.email}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <strong>Phone:</strong> {currentUserData.user.phone}
                  </div>
                  <div className="mb-3">
                    <strong>Total Coins:</strong>{" "}
                    {currentUserData.user.totalOrderedCoins?.toLocaleString() ||
                      "0"}
                  </div>
                  <div className="mb-3">
                    <strong>Total Investments:</strong> ₹
                    {currentUserData.user.totalInvestments?.toLocaleString() ||
                      "0"}
                  </div>
                </div>
              </div>

              {/* Orders Table */}
              {modalType === "orders" && currentUserData.orders && (
                <>
                  {/* Summary stats for orders */}
                  <div className="row mt-4 mb-4">
                    <div className="col-6">
                      <div
                        className="p-3 text-center rounded"
                        style={{ backgroundColor: "#2e2e2e" }}
                      >
                        <p
                          className="text-sm font-medium"
                          style={{ color: "#ec660f" }}
                        >
                          Total Orders
                        </p>
                        <p className="text-xl font-bold text-white">
                          {currentUserData.orders.length}
                        </p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div
                        className="p-3 text-center rounded"
                        style={{ backgroundColor: "#2e2e2e" }}
                      >
                        <p
                          className="text-sm font-medium"
                          style={{ color: "#ec660f" }}
                        >
                          Total Tokens
                        </p>
                        <p className="text-xl font-bold text-white">
                          {currentUserData.user.totalOrderedCoins?.toLocaleString() ||
                            "0"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Orders table */}
                  <div
                    style={{
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                      borderRadius: "8px",
                      overflow: "hidden",
                      marginTop: "16px",
                    }}
                  >
                    <table
                      style={{
                        backgroundColor: "#1e1e1e",
                        borderColor: "#3a3a3a",
                        borderCollapse: "collapse",
                        margin: "0",
                        width: "100%",
                        border: "1px solid #3a3a3a",
                      }}
                    >
                      <thead>
                        <tr
                          style={{
                            background:
                              "linear-gradient(45deg, #ec660f, #f07d2c)",
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                          }}
                        >
                          <th
                            style={{
                              color: "white",
                              fontWeight: "600",
                              borderColor: "#ec660f",
                              letterSpacing: "0.5px",
                              fontSize: "16px",
                              textTransform: "uppercase",
                              padding: "12px",
                              textAlign: "center",
                            }}
                          >
                            S.No
                          </th>
                          <th
                            style={{
                              color: "white",
                              fontWeight: "600",
                              borderColor: "#ec660f",
                              letterSpacing: "0.5px",
                              fontSize: "16px",
                              textTransform: "uppercase",
                              padding: "12px",
                              textAlign: "center",
                            }}
                          >
                            Date
                          </th>
                          <th
                            style={{
                              color: "white",
                              fontWeight: "600",
                              borderColor: "#ec660f",
                              letterSpacing: "0.5px",
                              fontSize: "16px",
                              textTransform: "uppercase",
                              padding: "12px",
                              textAlign: "center",
                            }}
                          >
                            Amount
                          </th>
                          <th
                            style={{
                              color: "white",
                              fontWeight: "600",
                              borderColor: "#ec660f",
                              letterSpacing: "0.5px",
                              fontSize: "16px",
                              textTransform: "uppercase",
                              padding: "12px",
                              textAlign: "center",
                            }}
                          >
                            JAIMAX Tokens
                          </th>
                          <th
                            style={{
                              color: "white",
                              fontWeight: "600",
                              borderColor: "#ec660f",
                              letterSpacing: "0.5px",
                              fontSize: "16px",
                              textTransform: "uppercase",
                              padding: "12px",
                              textAlign: "center",
                            }}
                          >
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentUserData.orders.map((item, index) => (
                          <tr
                            key={index}
                            style={{
                              backgroundColor:
                                index % 2 === 0 ? "#2e2e2e" : "#262626",
                              color: "#fff",
                              transition: "all 0.2s ease",
                              borderLeft: "3px solid transparent",
                              borderRight: "3px solid transparent",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#3a3a3a";
                              e.currentTarget.style.borderLeft =
                                "3px solid #ec660f";
                              e.currentTarget.style.borderRight =
                                "3px solid #ec660f";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                index % 2 === 0 ? "#2e2e2e" : "#262626";
                              e.currentTarget.style.borderLeft =
                                "3px solid transparent";
                              e.currentTarget.style.borderRight =
                                "3px solid transparent";
                            }}
                          >
                            <td
                              style={{
                                textAlign: "center",
                                padding: "12px",
                              }}
                            >
                              <span
                                style={{
                                  backgroundColor: "#ec660f",
                                  color: "white",
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                  padding: "6px 10px",
                                  borderRadius: "6px",
                                  minWidth: "30px",
                                  display: "inline-block",
                                }}
                              >
                                {index + 1}
                              </span>
                            </td>
                            <td
                              style={{
                                textAlign: "center",
                                padding: "12px",
                                fontSize: "15px",
                              }}
                            >
                              {formatDate(item.createdAt)}
                            </td>
                            <td
                              style={{
                                textAlign: "center",
                                padding: "12px",
                                fontSize: "15px",
                                fontWeight: "600",
                              }}
                            >
                              <span style={{ color: "#eaeaea" }}>
                                {(item.amount || 0).toLocaleString()}{" "}
                                <span>{item.currency}</span>
                              </span>
                            </td>
                            <td
                              style={{
                                textAlign: "center",
                                padding: "12px",
                                fontSize: "15px",
                                fontWeight: "600",
                              }}
                            >
                              {(item.jaimax || 0).toLocaleString()}
                            </td>
                            <td
                              style={{
                                textAlign: "center",
                                padding: "12px",
                                fontSize: "15px",
                              }}
                            >
                              <span
                                style={{
                                  backgroundColor:
                                    item.status === "Completed"
                                      ? "#198754"
                                      : "#ffc107",
                                  color:
                                    item.status === "Completed"
                                      ? "white"
                                      : "black",
                                  padding: "4px 8px",
                                  borderRadius: "4px",
                                  fontSize: "12px",
                                  fontWeight: "bold",
                                }}
                              >
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {!currentUserData.orders ||
                        currentUserData.orders.length === 0 ? (
                          <tr
                            style={{
                              backgroundColor: "#2e2e2e",
                            }}
                          >
                            <td
                              colSpan="5"
                              style={{
                                textAlign: "center",
                                padding: "16px",
                                color: "#999",
                                fontStyle: "italic",
                              }}
                            >
                              No order data available
                            </td>
                          </tr>
                        ) : null}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* Wallet Transactions Table */}
              {modalType === "walletTransactions" &&
                currentUserData.walletTransactions && (
                  <>
                    {/* Summary stats for wallet transactions */}
                    <div className="row mt-4 mb-4">
                      <div className="col-6">
                        <div
                          className="p-3 text-center rounded"
                          style={{ backgroundColor: "#2e2e2e" }}
                        >
                          <p
                            className="text-sm font-medium"
                            style={{ color: "#ec660f" }}
                          >
                            Total Transactions
                          </p>
                          <p className="text-xl font-bold text-white">
                            {currentUserData.walletTransactions.length}
                          </p>
                        </div>
                      </div>
                      <div className="col-6">
                        <div
                          className="p-3 text-center rounded"
                          style={{ backgroundColor: "#2e2e2e" }}
                        >
                          <p
                            className="text-sm font-medium"
                            style={{ color: "#ec660f" }}
                          >
                            Total Investment
                          </p>
                          <p className="text-xl font-bold text-white">
                            ₹
                            {currentUserData.user.totalInvestments?.toLocaleString() ||
                              "0"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Wallet transactions table */}
                    <div
                      style={{
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                        borderRadius: "8px",
                        overflow: "hidden",
                        marginTop: "16px",
                      }}
                    >
                      <table
                        style={{
                          backgroundColor: "#1e1e1e",
                          borderColor: "#3a3a3a",
                          borderCollapse: "collapse",
                          margin: "0",
                          width: "100%",
                          border: "1px solid #3a3a3a",
                        }}
                      >
                        <thead>
                          <tr
                            style={{
                              background:
                                "linear-gradient(45deg, #ec660f, #f07d2c)",
                              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                            }}
                          >
                            <th
                              style={{
                                color: "white",
                                fontWeight: "600",
                                borderColor: "#ec660f",
                                letterSpacing: "0.5px",
                                fontSize: "16px",
                                textTransform: "uppercase",
                                padding: "12px",
                                textAlign: "center",
                              }}
                            >
                              S.NO
                            </th>
                            <th
                              style={{
                                color: "white",
                                fontWeight: "600",
                                borderColor: "#ec660f",
                                letterSpacing: "0.5px",
                                fontSize: "16px",
                                textTransform: "uppercase",
                                padding: "12px",
                                textAlign: "center",
                              }}
                            >
                              Date
                            </th>
                            <th
                              style={{
                                color: "white",
                                fontWeight: "600",
                                borderColor: "#ec660f",
                                letterSpacing: "0.5px",
                                fontSize: "16px",
                                textTransform: "uppercase",
                                padding: "12px",
                                textAlign: "center",
                              }}
                            >
                              Amount
                            </th>
                            <th
                              style={{
                                color: "white",
                                fontWeight: "600",
                                borderColor: "#ec660f",
                                letterSpacing: "0.5px",
                                fontSize: "16px",
                                textTransform: "uppercase",
                                padding: "12px",
                                textAlign: "center",
                              }}
                            >
                              Payment Mode
                            </th>
                            <th
                              style={{
                                color: "white",
                                fontWeight: "600",
                                borderColor: "#ec660f",
                                letterSpacing: "0.5px",
                                fontSize: "16px",
                                textTransform: "uppercase",
                                padding: "12px",
                                textAlign: "center",
                              }}
                            >
                              Transaction ID
                            </th>
                            <th
                              style={{
                                color: "white",
                                fontWeight: "600",
                                borderColor: "#ec660f",
                                letterSpacing: "0.5px",
                                fontSize: "16px",
                                textTransform: "uppercase",
                                padding: "12px",
                                textAlign: "center",
                              }}
                            >
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentUserData.walletTransactions.map(
                            (item, index) => (
                              <tr
                                key={index}
                                style={{
                                  backgroundColor:
                                    index % 2 === 0 ? "#2e2e2e" : "#262626",
                                  color: "#fff",
                                  transition: "all 0.2s ease",
                                  borderLeft: "3px solid transparent",
                                  borderRight: "3px solid transparent",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "#3a3a3a";
                                  e.currentTarget.style.borderLeft =
                                    "3px solid #ec660f";
                                  e.currentTarget.style.borderRight =
                                    "3px solid #ec660f";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    index % 2 === 0 ? "#2e2e2e" : "#262626";
                                  e.currentTarget.style.borderLeft =
                                    "3px solid transparent";
                                  e.currentTarget.style.borderRight =
                                    "3px solid transparent";
                                }}
                              >
                                <td
                                  style={{
                                    textAlign: "center",
                                    padding: "12px",
                                  }}
                                >
                                  <span
                                    style={{
                                      backgroundColor: "#ec660f",
                                      color: "white",
                                      fontSize: "14px",
                                      fontWeight: "bold",
                                      padding: "6px 10px",
                                      borderRadius: "6px",
                                      minWidth: "30px",
                                      display: "inline-block",
                                    }}
                                  >
                                    {index + 1}
                                  </span>
                                </td>
                                <td
                                  style={{
                                    textAlign: "center",
                                    padding: "12px",
                                    fontSize: "15px",
                                  }}
                                >
                                  {formatDate(item.transactionDate)}
                                </td>
                                <td
                                  style={{
                                    textAlign: "center",
                                    padding: "12px",
                                    fontSize: "15px",
                                    fontWeight: "600",
                                  }}
                                >
                                  <span style={{ color: "#eaeaea" }}>
                                    {(
                                      item.transactionAmount || 0
                                    ).toLocaleString()}{" "}
                                    <span>{item.currency}</span>
                                  </span>
                                </td>
                                <td
                                  style={{
                                    textAlign: "center",
                                    padding: "12px",
                                    fontSize: "15px",
                                  }}
                                >
                                  {item.paymentMode}
                                </td>
                                <td
                                  style={{
                                    textAlign: "center",
                                    padding: "12px",
                                    fontSize: "15px",
                                  }}
                                >
                                  {item.transactionId}
                                </td>
                                <td
                                  style={{
                                    textAlign: "center",
                                    padding: "12px",
                                    fontSize: "15px",
                                  }}
                                >
                                  <span
                                    style={{
                                      backgroundColor:
                                        item.transactionStatus === "Completed"
                                          ? "#198754"
                                          : "#ffc107",
                                      color:
                                        item.transactionStatus === "Completed"
                                          ? "white"
                                          : "black",
                                      padding: "4px 8px",
                                      borderRadius: "4px",
                                      fontSize: "12px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {item.transactionStatus}
                                  </span>
                                </td>
                              </tr>
                            )
                          )}
                          {!currentUserData.walletTransactions ||
                          currentUserData.walletTransactions.length === 0 ? (
                            <tr
                              style={{
                                backgroundColor: "#2e2e2e",
                              }}
                            >
                              <td
                                colSpan="6"
                                style={{
                                  textAlign: "center",
                                  padding: "16px",
                                  color: "#999",
                                  fontStyle: "italic",
                                }}
                              >
                                No wallet transaction data available
                              </td>
                            </tr>
                          ) : null}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer
          style={{
            backgroundColor: "#1b242d",
            borderTop: "1px solid #3a3a3a",
          }}
        >
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
            style={{
              backgroundColor: "#2e2e2e",
              borderColor: "#3a3a3a",
            }}
          >
            Close
          </Button>
          {modalType === "orders" &&
            currentUserData?.walletTransactions?.length > 0 && (
              <Button
                variant="primary"
                onClick={() => setModalType("walletTransactions")}
                style={{
                  backgroundColor: "#ec660f",
                  borderColor: "#ec660f",
                }}
              >
                View Wallet Transactions
              </Button>
            )}
          {modalType === "walletTransactions" &&
            currentUserData?.orders?.length > 0 && (
              <Button
                variant="primary"
                onClick={() => setModalType("orders")}
                style={{
                  backgroundColor: "#ec660f",
                  borderColor: "#ec660f",
                }}
              >
                View Orders
              </Button>
            )}
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  );
}

export default GetBusinessDetails;



// import React, { useState } from "react";
// import DashboardLayout from "../../Layout/DashboardLayout";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import Skeleton from "react-loading-skeleton";
// import { Modal, Button } from "react-bootstrap";
// import { useGetBusinessDetailsByDateMutation } from "../../features/getBusniessDetails/getBusinessDetailsApiSlice";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import { toast } from "react-toastify";
// import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts\
// ';

// function GetBusinessDetails() {
//   // Business data state - now handles array of users
//   const [usersData, setUsersData] = useState([]);
//   const [selectedUserIndex, setSelectedUserIndex] = useState(0);
//   const [dataFetched, setDataFetched] = useState(false);

//   // Modal states
//   const [showModal, setShowModal] = useState(false);
//   const [modalType, setModalType] = useState("orders"); // "orders" or "walletTransactions"

//   // View state - analytics or details
//   const [currentView, setCurrentView] = useState("analytics"); // "analytics" or "details"

//   // Store form values for PDF export
//   const [formValues, setFormValues] = useState({ fromDate: "", toDate: "" });

//   // Use the API mutation
//   const [getBusinessDetails, { isLoading }] =
//     useGetBusinessDetailsByDateMutation();

//   // Initial form values
//   const initialValues = {
//     fromDate: new Date().toISOString().split("T")[0], // Format as YYYY-MM-DD for HTML date input
//     toDate: new Date().toISOString().split("T")[0], // Today's date
//   };

//   // Validation schema using Yup
//   const validationSchema = Yup.object({
//     fromDate: Yup.date()
//       .required("From date is required")
//       .max(Yup.ref("toDate"), "From date cannot be later than To date"),
//     toDate: Yup.date()
//       .required("To date is required")
//       .min(Yup.ref("fromDate"), "To date cannot be earlier than From date"),
//   });

//   // Form submission handler
//   const handleSubmit = async (values, { setSubmitting }) => {
//     setDataFetched(false);
//     setUsersData([]);
//     setSelectedUserIndex(0);

//     // Store form values for PDF export
//     setFormValues({ fromDate: values.fromDate, toDate: values.toDate });

//     try {
//       // Make the POST request with just the date range
//       const response = await getBusinessDetails({
//         fromDate: values.fromDate,
//         toDate: values.toDate,
//       }).unwrap();

//       // Update state with the response data
//       if (response && response.data && Array.isArray(response.data)) {
//         setUsersData(response.data);
//         setDataFetched(true);
//       }
//     } catch (error) {
//       console.error("Error fetching business data:", error);
//       toast.error("Error fetching business data. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Analytics helper functions
//   const getAnalyticsData = () => {
//     if (!usersData || usersData.length === 0) {
//       return {
//         totalUsers: 0,
//         totalCoins: 0,
//         totalInvestments: 0,
//         avgInvestmentPerUser: 0,
//         monthlyData: [],
//         paymentModeData: [],
//         dailyTransactions: []
//       };
//     }

//     const totalUsers = usersData.length;
//     const totalCoins = usersData.reduce((sum, user) => sum + (user.user.totalOrderedCoins || 0), 0);
//     const totalInvestments = usersData.reduce((sum, user) => sum + (user.user.totalInvestments || 0), 0);
//     const avgInvestmentPerUser = totalUsers > 0 ? totalInvestments / totalUsers : 0;

//     // Calculate payment mode statistics
//     const paymentModeStats = {};
//     usersData.forEach((user) => {
//       if (user.walletTransactions && user.walletTransactions.length > 0) {
//         user.walletTransactions.forEach((transaction) => {
//           const mode = transaction.paymentMode || "Unknown";
//           if (!paymentModeStats[mode]) {
//             paymentModeStats[mode] = {
//               count: 0,
//               amount: 0,
//             };
//           }
//           paymentModeStats[mode].count += 1;
//           paymentModeStats[mode].amount += transaction.transactionAmount || 0;
//         });
//       }
//     });

//     // Convert to chart data
//     const colors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5A2B'];
//     const paymentModeData = Object.entries(paymentModeStats).map(([mode, stats], index) => ({
//       name: mode,
//       value: stats.amount,
//       count: stats.count,
//       color: colors[index % colors.length]
//     }));

//     // Monthly data based on transactions
//     const monthlyStats = {};
//     usersData.forEach((user) => {
//       // Process orders
//       if (user.orders && user.orders.length > 0) {
//         user.orders.forEach((order) => {
//           const date = new Date(order.createdAt);
//           const monthKey = date.toLocaleString('default', { month: 'short' });
//           if (!monthlyStats[monthKey]) {
//             monthlyStats[monthKey] = { month: monthKey, investments: 0, coins: 0, users: new Set() };
//           }
//           monthlyStats[monthKey].investments += order.amount || 0;
//           monthlyStats[monthKey].coins += order.jaimax || 0;
//           monthlyStats[monthKey].users.add(user.user.email);
//         });
//       }
      
//       // Process wallet transactions
//       if (user.walletTransactions && user.walletTransactions.length > 0) {
//         user.walletTransactions.forEach((transaction) => {
//           const date = new Date(transaction.transactionDate);
//           const monthKey = date.toLocaleString('default', { month: 'short' });
//           if (!monthlyStats[monthKey]) {
//             monthlyStats[monthKey] = { month: monthKey, investments: 0, coins: 0, users: new Set() };
//           }
//           monthlyStats[monthKey].investments += transaction.transactionAmount || 0;
//           monthlyStats[monthKey].users.add(user.user.email);
//         });
//       }
//     });

//     const monthlyData = Object.values(monthlyStats).map(stat => ({
//       ...stat,
//       users: stat.users.size
//     }));

//     // Daily transaction trends (last 7 days simulation)
//     const dailyTransactions = [
//       { day: 'Mon', transactions: Math.floor(Math.random() * 10) + 5 },
//       { day: 'Tue', transactions: Math.floor(Math.random() * 10) + 8 },
//       { day: 'Wed', transactions: Math.floor(Math.random() * 10) + 12 },
//       { day: 'Thu', transactions: Math.floor(Math.random() * 10) + 7 },
//       { day: 'Fri', transactions: Math.floor(Math.random() * 10) + 15 },
//       { day: 'Sat', transactions: Math.floor(Math.random() * 10) + 6 },
//       { day: 'Sun', transactions: Math.floor(Math.random() * 10) + 4 }
//     ];

//     return {
//       totalUsers,
//       totalCoins,
//       totalInvestments,
//       avgInvestmentPerUser,
//       monthlyData,
//       paymentModeData,
//       dailyTransactions
//     };
//   };

//   // Analytics Dashboard Component
//   const AnalyticsDashboard = () => {
//     const analytics = getAnalyticsData();

//     if (!dataFetched || usersData.length === 0) {
//       return (
//         <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
//           <div className="text-center text-white">
//             <div className="spinner-border text-primary mb-3" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//             <h5>Please fetch business data first to view analytics</h5>
//             <p className="text-muted">Use the form above to get business details for selected date range</p>
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div style={{ 
//         background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
//         borderRadius: '20px',
//         padding: '30px',
//         color: 'white'
//       }}>
//         {/* Header */}
//         <div className="mb-4">
//           <h2 className="text-white mb-2" style={{ fontSize: '28px', fontWeight: 'bold' }}>
//             📊 Business Analytics Dashboard
//           </h2>
//           <p style={{ color: '#94a3b8' }}>
//             Monitor your business performance in real-time • Date Range: {formatDate(formValues.fromDate)} to {formatDate(formValues.toDate)}
//           </p>
//         </div>

//         {/* Top Metrics Cards */}
//         <div className="row g-4 mb-5">
//           {/* Total Users */}
//           <div className="col-lg-3 col-md-6">
//             <div style={{
//               background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
//               borderRadius: '16px',
//               padding: '24px',
//               boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
//               border: '1px solid rgba(255, 255, 255, 0.1)'
//             }}>
//               <div className="d-flex align-items-center justify-content-between mb-3">
//                 <div style={{
//                   background: 'rgba(255, 255, 255, 0.2)',
//                   padding: '12px',
//                   borderRadius: '12px'
//                 }}>
//                   <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
//                     <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
//                   </svg>
//                 </div>
//                 <div style={{ fontSize: '14px', opacity: 0.8 }}>
//                   {analytics.totalUsers > 0 ? '+' : ''}
//                 </div>
//               </div>
//               <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '4px' }}>
//                 {analytics.totalUsers.toLocaleString()}
//               </div>
//               <div style={{ fontSize: '14px', opacity: 0.8 }}>Total Users</div>
//             </div>
//           </div>

//           {/* Total Coins */}
//           <div className="col-lg-3 col-md-6">
//             <div style={{
//               background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
//               borderRadius: '16px',
//               padding: '24px',
//               boxShadow: '0 8px 32px rgba(6, 182, 212, 0.3)',
//               border: '1px solid rgba(255, 255, 255, 0.1)'
//             }}>
//               <div className="d-flex align-items-center justify-content-between mb-3">
//                 <div style={{
//                   background: 'rgba(255, 255, 255, 0.2)',
//                   padding: '12px',
//                   borderRadius: '12px'
//                 }}>
//                   <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 5a1 1 0 000 2h1a2 2 0 001.732 1H11a1 1 0 100-2H9.732A2 2 0 007 5z"/>
//                   </svg>
//                 </div>
//               </div>
//               <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '4px' }}>
//                 {analytics.totalCoins.toLocaleString()}
//               </div>
//               <div style={{ fontSize: '14px', opacity: 0.8 }}>Total Coins</div>
//             </div>
//           </div>

//           {/* Total Investments */}
//           <div className="col-lg-3 col-md-6">
//             <div style={{
//               background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
//               borderRadius: '16px',
//               padding: '24px',
//               boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
//               border: '1px solid rgba(255, 255, 255, 0.1)'
//             }}>
//               <div className="d-flex align-items-center justify-content-between mb-3">
//                 <div style={{
//                   background: 'rgba(255, 255, 255, 0.2)',
//                   padding: '12px',
//                   borderRadius: '12px'
//                 }}>
//                   <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
//                     <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
//                   </svg>
//                 </div>
//               </div>
//               <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '4px' }}>
//                 ₹{analytics.totalInvestments.toLocaleString()}
//               </div>
//               <div style={{ fontSize: '14px', opacity: 0.8 }}>Total Investments</div>
//             </div>
//           </div>

//           {/* Average Investment */}
//           <div className="col-lg-3 col-md-6">
//             <div style={{
//               background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
//               borderRadius: '16px',
//               padding: '24px',
//               boxShadow: '0 8px 32px rgba(245, 158, 11, 0.3)',
//               border: '1px solid rgba(255, 255, 255, 0.1)'
//             }}>
//               <div className="d-flex align-items-center justify-content-between mb-3">
//                 <div style={{
//                   background: 'rgba(255, 255, 255, 0.2)',
//                   padding: '12px',
//                   borderRadius: '12px'
//                 }}>
//                   <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
//                     <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
//                   </svg>
//                 </div>
//               </div>
//               <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '4px' }}>
//                 ₹{Math.round(analytics.avgInvestmentPerUser).toLocaleString()}
//               </div>
//               <div style={{ fontSize: '14px', opacity: 0.8 }}>Avg per User</div>
//             </div>
//           </div>
//         </div>

//         {/* Charts Grid */}
//         <div className="row g-4 mb-5">
//           {/* Monthly Trend Chart */}
//           <div className="col-lg-8">
//             <div style={{
//               background: 'rgba(255, 255, 255, 0.05)',
//               backdropFilter: 'blur(10px)',
//               borderRadius: '16px',
//               padding: '24px',
//               border: '1px solid rgba(255, 255, 255, 0.1)',
//               boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
//             }}>
//               <div className="d-flex align-items-center justify-content-between mb-4">
//                 <h5 style={{ color: 'white', fontSize: '20px', margin: 0 }}>Monthly Investment Trend</h5>
//                 <div className="d-flex align-items-center">
//                   <div className="d-flex align-items-center me-3">
//                     <div style={{
//                       width: '12px',
//                       height: '12px',
//                       background: '#06B6D4',
//                       borderRadius: '50%',
//                       marginRight: '8px'
//                     }}></div>
//                     <span style={{ fontSize: '14px', color: '#94a3b8' }}>Investments</span>
//                   </div>
//                 </div>
//               </div>
//               <div style={{ height: '300px' }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <AreaChart data={analytics.monthlyData}>
//                     <defs>
//                       <linearGradient id="investmentGradient" x1="0" y1="0" x2="0" y2="1">
//                         <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8}/>
//                         <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.1}/>
//                       </linearGradient>
//                     </defs>
//                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
//                     <XAxis dataKey="month" stroke="#E5E7EB" />
//                     <YAxis stroke="#E5E7EB" />
//                     <Tooltip 
//                       contentStyle={{
//                         backgroundColor: 'rgba(0,0,0,0.8)',
//                         border: '1px solid rgba(255,255,255,0.2)',
//                         borderRadius: '8px',
//                         color: 'white'
//                       }}
//                     />
//                     <Area 
//                       type="monotone" 
//                       dataKey="investments" 
//                       stroke="#06B6D4" 
//                       strokeWidth={3}
//                       fill="url(#investmentGradient)" 
//                     />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>

//           {/* Payment Mode Chart */}
//           <div className="col-lg-4">
//             <div style={{
//               background: 'rgba(255, 255, 255, 0.05)',
//               backdropFilter: 'blur(10px)',
//               borderRadius: '16px',
//               padding: '24px',
//               border: '1px solid rgba(255, 255, 255, 0.1)',
//               boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
//             }}>
//               <h5 style={{ color: 'white', fontSize: '20px', marginBottom: '24px' }}>Payment Methods</h5>
//               {analytics.paymentModeData.length > 0 ? (
//                 <>
//                   <div style={{ height: '200px' }}>
//                     <ResponsiveContainer width="100%" height="100%">
//                       <PieChart>
//                         <Pie
//                           data={analytics.paymentModeData}
//                           cx="50%"
//                           cy="50%"
//                           innerRadius={30}
//                           outerRadius={80}
//                           paddingAngle={5}
//                           dataKey="value"
//                         >
//                           {analytics.paymentModeData.map((entry, index) => (
//                             <Cell key={`cell-${index}`} fill={entry.color} />
//                           ))}
//                         </Pie>
//                         <Tooltip 
//                           contentStyle={{
//                             backgroundColor: 'rgba(0,0,0,0.8)',
//                             border: '1px solid rgba(255,255,255,0.2)',
//                             borderRadius: '8px',
//                             color: 'white'
//                           }}
//                         />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </div>
//                   <div className="mt-3">
//                     {analytics.paymentModeData.map((item, index) => (
//                       <div key={index} className="d-flex align-items-center justify-content-between mb-2">
//                         <div className="d-flex align-items-center">
//                           <div 
//                             style={{
//                               width: '12px',
//                               height: '12px',
//                               borderRadius: '50%',
//                               marginRight: '8px',
//                               backgroundColor: item.color
//                             }}
//                           ></div>
//                           <span style={{ fontSize: '14px', color: '#94a3b8' }}>{item.name}</span>
//                         </div>
//                         <span style={{ fontSize: '14px', color: 'white', fontWeight: '600' }}>
//                           ₹{item.value.toLocaleString()}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </>
//               ) : (
//                 <div className="text-center" style={{ color: '#94a3b8', padding: '40px 0' }}>
//                   <svg width="48" height="48" fill="currentColor" viewBox="0 0 20 20" style={{ margin: '0 auto 16px' }}>
//                     <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
//                   </svg>
//                   <p>No payment data available</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Bottom Row */}
//         <div className="row g-4">
//           {/* Monthly Users Bar Chart */}
//           <div className="col-lg-6">
//             <div style={{
//               background: 'rgba(255, 255, 255, 0.05)',
//               backdropFilter: 'blur(10px)',
//               borderRadius: '16px',
//               padding: '24px',
//               border: '1px solid rgba(255, 255, 255, 0.1)',
//               boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
//             }}>
//               <h5 style={{ color: 'white', fontSize: '20px', marginBottom: '24px' }}>Monthly User Activity</h5>
//               <div style={{ height: '250px' }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={analytics.monthlyData}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
//                     <XAxis dataKey="month" stroke="#E5E7EB" />
//                     <YAxis stroke="#E5E7EB" />
//                     <Tooltip 
//                       contentStyle={{
//                         backgroundColor: 'rgba(0,0,0,0.8)',
//                         border: '1px solid rgba(255,255,255,0.2)',
//                         borderRadius: '8px',
//                         color: 'white'
//                       }}
//                     />
//                     <Bar dataKey="users" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>

//           {/* Performance Metrics */}
//           <div className="col-lg-6">
//             <div style={{
//               background: 'rgba(255, 255, 255, 0.05)',
//               backdropFilter: 'blur(10px)',
//               borderRadius: '16px',
//               padding: '24px',
//               border: '1px solid rgba(255, 255, 255, 0.1)',
//               boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
//             }}>
//               <h5 style={{ color: 'white', fontSize: '20px', marginBottom: '24px' }}>Performance Metrics</h5>
              
//               {/* User Engagement */}
//               <div className="mb-4">
//                 <div className="d-flex justify-content-between align-items-center mb-2">
//                   <span style={{ fontSize: '14px', color: '#94a3b8' }}>User Engagement</span>
//                   <span style={{ fontSize: '14px', color: 'white', fontWeight: '600' }}>
//                     {analytics.totalUsers > 0 ? Math.min(Math.round((analytics.totalInvestments / analytics.totalUsers) / 1000 * 100), 100) : 0}%
//                   </span>
//                 </div>
//                 <div style={{
//                   width: '100%',
//                   height: '8px',
//                   background: 'rgba(255, 255, 255, 0.1)',
//                   borderRadius: '4px',
//                   overflow: 'hidden'
//                 }}>
//                   <div style={{
//                     width: `${analytics.totalUsers > 0 ? Math.min(Math.round((analytics.totalInvestments / analytics.totalUsers) / 1000 * 100), 100) : 0}%`,
//                     height: '100%',
//                     background: 'linear-gradient(90deg, #10B981, #059669)',
//                     borderRadius: '4px'
//                   }}></div>
//                 </div>
//               </div>

//               {/* Revenue Growth */}
//               <div className="mb-4">
//                 <div className="d-flex justify-content-between align-items-center mb-2">
//                   <span style={{ fontSize: '14px', color: '#94a3b8' }}>Revenue Growth</span>
//                   <span style={{ fontSize: '14px', color: 'white', fontWeight: '600' }}>
//                     {analytics.totalInvestments > 0 ? Math.min(Math.round(analytics.totalInvestments / 100000 * 100), 100) : 0}%
//                   </span>
//                 </div>
//                 <div style={{
//                   width: '100%',
//                   height: '8px',
//                   background: 'rgba(255, 255, 255, 0.1)',
//                   borderRadius: '4px',
//                   overflow: 'hidden'
//                 }}>
//                   <div style={{
//                     width: `${analytics.totalInvestments > 0 ? Math.min(Math.round(analytics.totalInvestments / 100000 * 100), 100) : 0}%`,
//                     height: '100%',
//                     background: 'linear-gradient(90deg, #06B6D4, #0891B2)',
//                     borderRadius: '4px'
//                   }}></div>
//                 </div>
//               </div>

//               {/* Platform Adoption */}
//               <div className="mb-4">
//                 <div className="d-flex justify-content-between align-items-center mb-2">
//                   <span style={{ fontSize: '14px', color: '#94a3b8' }}>Platform Adoption</span>
//                   <span style={{ fontSize: '14px', color: 'white', fontWeight: '600' }}>
//                     {analytics.totalUsers > 0 ? Math.min(analytics.totalUsers * 25, 100) : 0}%
//                   </span>
//                 </div>
//                 <div style={{
//                   width: '100%',
//                   height: '8px',
//                   background: 'rgba(255, 255, 255, 0.1)',
//                   borderRadius: '4px',
//                   overflow: 'hidden'
//                 }}>
//                   <div style={{
//                     width: `${analytics.totalUsers > 0 ? Math.min(analytics.totalUsers * 25, 100) : 0}%`,
//                     height: '100%',
//                     background: 'linear-gradient(90deg, #8B5CF6, #7C3AED)',
//                     borderRadius: '4px'
//                   }}></div>
//                 </div>
//               </div>

//               {/* Circular Progress - Overall Score */}
//               <div className="text-center mt-4">
//                 <div className="d-inline-block position-relative">
//                   <svg width="120" height="120" className="transform-rotate-minus-90">
//                     <circle
//                       cx="60"
//                       cy="60"
//                       r="45"
//                       stroke="rgba(255,255,255,0.1)"
//                       strokeWidth="8"
//                       fill="none"
//                     />
//                     <circle
//                       cx="60"
//                       cy="60"
//                       r="45"
//                       stroke="url(#circularGradient)"
//                       strokeWidth="8"
//                       fill="none"
//                       strokeLinecap="round"
//                       strokeDasharray={`${2 * Math.PI * 45 * 0.78} ${2 * Math.PI * 45}`}
//                     />
//                     <defs>
//                       <linearGradient id="circularGradient" x1="0%" y1="0%" x2="100%" y2="0%">
//                         <stop offset="0%" stopColor="#06B6D4" />
//                         <stop offset="100%" stopColor="#8B5CF6" />
//                       </linearGradient>
//                     </defs>
//                   </svg>
//                   <div className="position-absolute top-50 start-50 translate-middle text-center">
//                     <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
//                       {analytics.totalUsers > 0 ? Math.min(Math.round((analytics.totalInvestments / 100000) * 78), 100) : 0}%
//                     </div>
//                     <div style={{ fontSize: '12px', color: '#94a3b8' }}>Overall</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Get currently selected user data
//   const getCurrentUserData = () => {
//     if (usersData.length === 0) return null;
//     return usersData[selectedUserIndex] || null;
//   };

//   // Handle view modal for orders or wallet transactions
//   const handleViewDetails = (type) => {
//     const userData = getCurrentUserData();
//     if (!userData) return;

//     setModalType(type);
//     setShowModal(true);
//   };

//   // Function to format date for display
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   // Calculate total statistics across all users
//   const getTotalStats = () => {
//     if (usersData.length === 0)
//       return {
//         totalUsers: 0,
//         totalCoins: 0,
//         totalInvestments: 0,
//         paymentModeStats: {},
//       };

//     // Calculate payment mode statistics
//     const paymentModeStats = {};
//     usersData.forEach((user) => {
//       if (user.walletTransactions && user.walletTransactions.length > 0) {
//         user.walletTransactions.forEach((transaction) => {
//           const mode = transaction.paymentMode || "Unknown";
//           if (!paymentModeStats[mode]) {
//             paymentModeStats[mode] = {
//               count: 0,
//               amount: 0,
//             };
//           }
//           paymentModeStats[mode].count += 1;
//           paymentModeStats[mode].amount += transaction.transactionAmount || 0;
//         });
//       }
//     });

//     return {
//       totalUsers: usersData.length,
//       totalCoins: usersData.reduce(
//         (sum, user) => sum + (user.user.totalOrderedCoins || 0),
//         0
//       ),
//       totalInvestments: usersData.reduce(
//         (sum, user) => sum + (user.user.totalInvestments || 0),
//         0
//       ),
//       paymentModeStats,
//     };
//   };

//   // PDF Export functionality
//   const exportToPDF = () => {
//     if (!dataFetched || usersData.length === 0) {
//       toast.error("No data available to export. Please fetch data first.");
//       return;
//     }

//     try {
//       // Create a new PDF document
//       const doc = new jsPDF();

//       // Get total stats for the report
//       const stats = getTotalStats();

//       // Generate the PDF sections - Combined summary and payment on same page
//       createCombinedSummarySection(
//         doc,
//         stats,
//         formValues.fromDate,
//         formValues.toDate
//       );
//       doc.addPage();

//       createUsersOverviewSection(doc, usersData);
//       doc.addPage();

//       // Add ALL users' detailed information with orders and transactions
//       createAllUsersDetailedSection(doc, usersData);

//       // Generate PDF file
//       const today = new Date().toISOString().slice(0, 10);
//       doc.save(
//         `Business_Report_${formValues.fromDate}_to_${formValues.toDate}_${today}.pdf`
//       );

//       toast.success("PDF download started successfully!");
//     } catch (error) {
//       console.error("PDF Generation Error:", error);
//       toast.error("Error creating PDF. Please try again.");
//     }
//   };

//   // PDF Helper Functions - Combined Summary and Payment Mode on same page
//   const createCombinedSummarySection = (doc, stats, fromDate, toDate) => {
//     // Title
//     doc.setFontSize(20);
//     doc.setTextColor(40, 40, 40);
//     doc.text("JAIMAX BUSINESS REPORT", 105, 25, { align: "center" });

//     // Date range
//     doc.setFontSize(12);
//     doc.setTextColor(100, 100, 100);
//     doc.text(
//       `From ${formatDateForPDF(fromDate)} To ${formatDateForPDF(toDate)}`,
//       105,
//       35,
//       { align: "center" }
//     );
//     doc.text(
//       `Generated by Dev-Team on: ${new Date().toLocaleDateString()}`,
//       105,
//       40,
//       {
//         align: "center",
//       }
//     );

//     // Business Summary
//     doc.setFontSize(16);
//     doc.setTextColor(40, 40, 40);
//     doc.text("JAIMAX BUSINESS SUMMARY", 20, 65);

//     const summaryData = [
//       ["Total Users", stats.totalUsers.toString()],
//       ["Total Coins", stats.totalCoins.toLocaleString()],
//       ["Total Investments", stats.totalInvestments.toLocaleString()],
//     ];

//     autoTable(doc, {
//       startY: 75,
//       head: [["Metric", "Value"]],
//       body: summaryData,
//       theme: "grid",
//       styles: { fontSize: 12 },
//       headStyles: { fillColor: [236, 102, 15], textColor: 255 },
//       alternateRowStyles: { fillColor: [250, 250, 250] },
//       margin: { left: 20, right: 20 },
//     });

//     // Payment Mode Breakdown on same page
//     doc.setFontSize(16);
//     doc.setTextColor(40, 40, 40);
//     doc.text("PAYMENT MODE BREAKDOWN", 20, 140);

//     if (Object.keys(stats.paymentModeStats).length === 0) {
//       doc.setFontSize(12);
//       doc.text("No payment data available", 20, 155);
//       return;
//     }

//     const paymentData = Object.entries(stats.paymentModeStats).map(
//       ([mode, stats]) => [
//         mode,
//         stats.count.toString(),
//         stats.amount.toLocaleString(),
//       ]
//     );

//     autoTable(doc, {
//       startY: 150,
//       head: [["Payment Mode", "Transactions", "Total Amount"]],
//       body: paymentData,
//       theme: "grid",
//       styles: { fontSize: 12 },
//       headStyles: { fillColor: [236, 102, 15], textColor: 255 },
//       alternateRowStyles: { fillColor: [250, 250, 250] },
//       margin: { left: 20, right: 20 },
//     });
//   };

//   const createUsersOverviewSection = (doc, usersData) => {
//     doc.setFontSize(16);
//     doc.setTextColor(40, 40, 40);
//     doc.text("USERS OVERVIEW", 20, 25);

//     const userData = usersData.map((user, index) => [
//       (index + 1).toString(),
//       user.user.name,
//       user.user.email,
//       user.user.phone.toString(),
//       user.user.totalOrderedCoins?.toLocaleString() || "0",
//       user.user.totalInvestments?.toLocaleString() || "0",
//       user.orders?.length.toString() || "0",
//       user.walletTransactions?.length.toString() || "0",
//     ]);

//     autoTable(doc, {
//       startY: 35,
//       head: [
//         [
//           "S.No",
//           "Name",
//           "Email",
//           "Phone",
//           "Total Coins",
//           "Investments",
//           "Orders",
//           "Transactions",
//         ],
//       ],
//       body: userData,
//       theme: "grid",
//       styles: { fontSize: 7, cellPadding: 2 },
//       headStyles: { fillColor: [236, 102, 15], textColor: 255, fontSize: 8 },
//       alternateRowStyles: { fillColor: [250, 250, 250] },
//       margin: { left: 10, right: 10 },
//       columnStyles: {
//         0: { cellWidth: 12 },
//         1: { cellWidth: 35 },
//         2: { cellWidth: 45 },
//         3: { cellWidth: 22 },
//         4: { cellWidth: 22 },
//         5: { cellWidth: 20 },
//         6: { cellWidth: 15 },
//         7: { cellWidth: 15 },
//       },
//     });
//   };

//   // New function to show ALL users with their orders and transactions (no duplicate info)
//   const createAllUsersDetailedSection = (doc, usersData) => {
//     let yPos = 20;

//     usersData.forEach((userData, userIndex) => {
//       // Check if we need a new page for each user
//       if (yPos > 50 && userIndex > 0) {
//         doc.addPage();
//         yPos = 20;
//       }

//       // Show user info only once at the top
//       doc.setFontSize(14);
//       doc.setFont("helvetica", "bold");
//       doc.setTextColor(236, 102, 15);
//       doc.text(`${userData.user.name}`, 20, yPos);
//       yPos += 15;

//       // User basic info (show only once)
//       doc.setFontSize(11);
//       doc.setFont("helvetica", "normal");
//       doc.setTextColor(40, 40, 40);
//       doc.text(`Name: ${userData.user.name}`, 20, yPos);
//       doc.text(`Username: ${userData.user.username}`, 20, yPos + 7);
//       doc.text(`Email: ${userData.user.email}`, 20, yPos + 14);
//       doc.text(`Phone: ${userData.user.phone}`, 20, yPos + 21);
//       doc.text(
//         `Total Coins: ${
//           userData.user.totalOrderedCoins?.toLocaleString() || "0"
//         }`,
//         20,
//         yPos + 28
//       );
//       doc.text(
//         `Total Investments: ${
//           userData.user.totalInvestments?.toLocaleString() || "0"
//         }`,
//         20,
//         yPos + 35
//       );
//       yPos += 50;

//       // Orders section (if user has orders)
//       if (userData.orders && userData.orders.length > 0) {
//         doc.setFontSize(12);
//         doc.setFont("helvetica", "bold");
//         doc.setTextColor(40, 40, 40);
//         doc.text("Orders", 20, yPos);
//         yPos += 10;

//         // Orders summary stats
//         doc.setFontSize(10);
//         doc.setFont("helvetica", "normal");
//         doc.text(`Total Orders: ${userData.orders.length}`, 20, yPos);
//         doc.text(
//           `Total Tokens: ${
//             userData.user.totalOrderedCoins?.toLocaleString() || "0"
//           }`,
//           100,
//           yPos
//         );
//         yPos += 15;

//         // Orders table
//         const orderData = userData.orders.map((order, index) => [
//           (index + 1).toString(),
//           formatDateForPDF(order.createdAt),
//           `${order.amount?.toLocaleString() || "0"} ${order.currency || "INR"}`,
//           order.jaimax?.toLocaleString() || "0",
//           order.status || "N/A",
//         ]);

//         autoTable(doc, {
//           startY: yPos,
//           head: [["S.No", "Date", "Amount", "JAIMAX Tokens", "Status"]],
//           body: orderData,
//           theme: "grid",
//           styles: { fontSize: 9 },
//           headStyles: { fillColor: [236, 102, 15], textColor: 255 },
//           alternateRowStyles: { fillColor: [250, 250, 250] },
//           margin: { left: 20, right: 20 },
//         });

//         yPos += orderData.length * 8 + 20;
//       }

//       // Wallet Transactions section (if user has transactions)
//       if (
//         userData.walletTransactions &&
//         userData.walletTransactions.length > 0
//       ) {
//         // Check if we need a new page
//         if (yPos > 180) {
//           doc.addPage();
//           yPos = 20;
//         }

//         doc.setFontSize(12);
//         doc.setFont("helvetica", "bold");
//         doc.setTextColor(40, 40, 40);
//         doc.text("Wallet Transactions", 20, yPos);
//         yPos += 10;

//         // Transactions summary stats
//         doc.setFontSize(10);
//         doc.setFont("helvetica", "normal");
//         doc.text(
//           `Total Transactions: ${userData.walletTransactions.length}`,
//           20,
//           yPos
//         );
//         doc.text(
//           `Total Investment: ${
//             userData.user.totalInvestments?.toLocaleString() || "0"
//           }`,
//           100,
//           yPos
//         );
//         yPos += 15;

//         // Wallet transactions table
//         const transactionData = userData.walletTransactions.map(
//           (transaction, index) => [
//             (index + 1).toString(),
//             formatDateForPDF(transaction.transactionDate),
//             `${transaction.transactionAmount?.toLocaleString() || "0"} ${
//               transaction.currency || "INR"
//             }`,
//             transaction.paymentMode || "N/A",
//             transaction.transactionId || "N/A",
//             transaction.transactionStatus || "N/A",
//           ]
//         );

//         autoTable(doc, {
//           startY: yPos,
//           head: [
//             [
//               "S.NO",
//               "Date",
//               "Amount",
//               "Payment Mode",
//               "Transaction ID",
//               "Status",
//             ],
//           ],
//           body: transactionData,
//           theme: "grid",
//           styles: { fontSize: 8 },
//           headStyles: { fillColor: [236, 102, 15], textColor: 255 },
//           alternateRowStyles: { fillColor: [250, 250, 250] },
//           margin: { left: 20, right: 20 },
//         });

//         yPos += transactionData.length * 8 + 20;
//       }

//       // Add some space between users
//       yPos += 15;
//     });
//   };

//   // Helper function to format date for PDF
//   const formatDateForPDF = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//     });
//   };

//   const currentUserData = getCurrentUserData();
//   const totalStats = getTotalStats();

//   return (
//     <DashboardLayout>
//       <section className="profile_section py-4">
//         <div className="container-fluid">
//           <div className="row">
//             <div className="col-12">
//               <div className="my_total_team_data rounded-3 px-3 pb-0 py-4">
//                 <h1 className="mb-3">Get Business Details</h1>

//                 {/* View Toggle Buttons */}
//                 <div className="mb-4">
//                   <div className="btn-group" role="group">
//                     <button
//                       type="button"
//                       className={`btn ${
//                         currentView === "analytics" ? "btn-primary" : "btn-outline-primary"
//                       }`}
//                       style={{
//                         backgroundColor: currentView === "analytics" ? "#ec660f" : "transparent",
//                         borderColor: "#ec660f",
//                         color: currentView === "analytics" ? "white" : "#ec660f",
//                         fontWeight: "600",
//                         padding: "10px 20px",
//                         transition: "all 0.3s ease"
//                       }}
//                       onClick={() => setCurrentView("analytics")}
//                     >
//                       📊 Analytics Dashboard
//                     </button>
//                     <button
//                       type="button"
//                       className={`btn ${
//                         currentView === "details" ? "btn-primary" : "btn-outline-primary"
//                       }`}
//                       style={{
//                         backgroundColor: currentView === "details" ? "#ec660f" : "transparent",
//                         borderColor: "#ec660f",
//                         color: currentView === "details" ? "white" : "#ec660f",
//                         fontWeight: "600",
//                         padding: "10px 20px",
//                         transition: "all 0.3s ease"
//                       }}
//                       onClick={() => setCurrentView("details")}
//                     >
//                       📋 Business Details
//                     </button>
//                   </div>
//                 </div>

//                 {/* Form */}
//                 <Formik
//                   initialValues={initialValues}
//                   validationSchema={validationSchema}
//                   onSubmit={handleSubmit}
//                 >
//                   {({ isSubmitting, errors, touched }) => (
//                     <Form>
//                       <div className="row justify-content-center mb-3">
//                         <div className="col-12 col-sm-4 col-md-3 mb-3">
//                           <div className="form-group">
//                             <label
//                               htmlFor="fromDate"
//                               className="form-label"
//                               style={{ fontSize: "14px" }}
//                             >
//                               From Date
//                             </label>
//                             <Field
//                               style={{
//                                 backgroundColor: "#1b232d",
//                                 padding: "8px 12px",
//                                 fontSize: "14px",
//                                 height: "38px",
//                               }}
//                               id="fromDate"
//                               name="fromDate"
//                               type="date"
//                               className={`form-control form-control-sm ${
//                                 errors.fromDate && touched.fromDate
//                                   ? "is-invalid"
//                                   : ""
//                               }`}
//                             />
//                             <ErrorMessage
//                               name="fromDate"
//                               component="div"
//                               className="invalid-feedback"
//                               style={{ fontSize: "12px" }}
//                             />
//                           </div>
//                         </div>

//                         <div className="col-12 col-sm-4 col-md-3 mb-3">
//                           <div className="form-group">
//                             <label
//                               htmlFor="toDate"
//                               className="form-label"
//                               style={{ fontSize: "14px" }}
//                             >
//                               To Date
//                             </label>
//                             <Field
//                               style={{
//                                 backgroundColor: "#1b232d",
//                                 padding: "8px 12px",
//                                 fontSize: "14px",
//                                 height: "38px",
//                               }}
//                               id="toDate"
//                               name="toDate"
//                               type="date"
//                               className={`form-control form-control-sm ${
//                                 errors.toDate && touched.toDate
//                                   ? "is-invalid"
//                                   : ""
//                               }`}
//                             />
//                             <ErrorMessage
//                               name="toDate"
//                               component="div"
//                               className="invalid-feedback"
//                               style={{ fontSize: "12px" }}
//                             />
//                           </div>
//                         </div>

//                         <div className="col-12 col-sm-4 col-md-3 mb-3 d-flex align-items-end">
//                           <button
//                             type="submit"
//                             disabled={isSubmitting || isLoading}
//                             className="btn btn-primary btn-sm w-100"
//                             style={{
//                               backgroundColor: "#ec660f",
//                               border: "1px solid black",
//                               transition: "all 0.3s ease",
//                               padding: "8px 16px",
//                               fontSize: "14px",
//                               height: "38px",
//                             }}
//                             onMouseOver={(e) => {
//                               e.currentTarget.style.backgroundColor = "#d25400";
//                               e.currentTarget.style.transform =
//                                 "translateY(-2px)";
//                               e.currentTarget.style.boxShadow =
//                                 "0 4px 8px rgba(0, 0, 0, 0.2)";
//                             }}
//                             onMouseOut={(e) => {
//                               e.currentTarget.style.backgroundColor = "#ec660f";
//                               e.currentTarget.style.transform = "translateY(0)";
//                               e.currentTarget.style.boxShadow = "none";
//                             }}
//                           >
//                             {isSubmitting || isLoading ? (
//                               <>
//                                 <span
//                                   className="spinner-border spinner-border-sm me-2"
//                                   role="status"
//                                   aria-hidden="true"
//                                   style={{ width: "12px", height: "12px" }}
//                                 ></span>
//                                 Loading...
//                               </>
//                             ) : (
//                               "Get Details"
//                             )}
//                           </button>
//                         </div>
//                       </div>
//                     </Form>
//                   )}
//                 </Formik>

//                 {/* Conditional Rendering Based on Current View */}
//                 {currentView === "analytics" ? (
//                   <AnalyticsDashboard />
//                 ) : (
//                   <>
//                     {/* Total Statistics Summary */}
//                     {dataFetched && usersData.length > 0 && (
//                       <div className="my-4">
//                         <div
//                           className="card"
//                           style={{
//                             backgroundColor: "#1b232d",
//                             color: "#fff",
//                             border: "1px solid #3a3a3a",
//                           }}
//                         >
//                           <div
//                             className="card-header py-3"
//                             style={{ borderBottom: "1px solid #3a3a3a" }}
//                           >
//                             <h5 className="mb-0" style={{ color: "#ec660f" }}>
//                               Business Summary
//                             </h5>
//                           </div>
//                           <div className="card-body">
//                             <div className="row text-center mb-4">
//                               <div className="col-md-4">
//                                 <div
//                                   className="p-3 rounded"
//                                   style={{ backgroundColor: "#2e2e2e" }}
//                                 >
//                                   <h6 style={{ color: "#ec660f" }}>Total Users</h6>
//                                   <h4 className="mb-0">{totalStats.totalUsers}</h4>
//                                 </div>
//                               </div>
//                               <div className="col-md-4">
//                                 <div
//                                   className="p-3 rounded"
//                                   style={{ backgroundColor: "#2e2e2e" }}
//                                 >
//                                   <h6 style={{ color: "#ec660f" }}>Total Coins</h6>
//                                   <h4 className="mb-0">
//                                     {totalStats.totalCoins.toLocaleString()}
//                                   </h4>
//                                 </div>
//                               </div>
//                               <div className="col-md-4">
//                                 <div
//                                   className="p-3 rounded"
//                                   style={{ backgroundColor: "#2e2e2e" }}
//                                 >
//                                   <h6 style={{ color: "#ec660f" }}>
//                                     Total Investments
//                                   </h6>
//                                   <h4 className="mb-0">
//                                     ₹{totalStats.totalInvestments.toLocaleString()}
//                                   </h4>
//                                 </div>
//                               </div>
//                             </div>

//                             {/* Payment Mode Statistics */}
//                             {Object.keys(totalStats.paymentModeStats).length >
//                               0 && (
//                               <>
//                                 <div className="row">
//                                   <div className="col-12 d-flex justify-content-between align-items-center">
//                                     <h6
//                                       style={{
//                                         color: "#ec660f",
//                                         marginBottom: "20px",
//                                       }}
//                                     >
//                                       Payment Mode Breakdown
//                                     </h6>
//                                     {/* PDF Export Button */}
//                                     <button
//                                       onClick={exportToPDF}
//                                       className="btn btn-sm mb-2"
//                                       style={{
//                                         backgroundColor: "#28a745",
//                                         color: "white",
//                                         border: "1px solid #28a745",
//                                         borderRadius: "6px",
//                                         padding: "8px 16px",
//                                         fontSize: "12px",
//                                         fontWeight: "600",
//                                         transition: "all 0.3s ease",
//                                         display: "flex",
//                                         alignItems: "center",
//                                         gap: "6px",
//                                       }}
//                                       onMouseEnter={(e) => {
//                                         e.currentTarget.style.backgroundColor =
//                                           "#218838";
//                                         e.currentTarget.style.transform =
//                                           "translateY(-1px)";
//                                         e.currentTarget.style.boxShadow =
//                                           "0 2px 4px rgba(0, 0, 0, 0.2)";
//                                       }}
//                                       onMouseLeave={(e) => {
//                                         e.currentTarget.style.backgroundColor =
//                                           "#28a745";
//                                         e.currentTarget.style.transform =
//                                           "translateY(0)";
//                                         e.currentTarget.style.boxShadow = "none";
//                                       }}
//                                     >
//                                       📄 Export PDF
//                                     </button>
//                                   </div>
//                                 </div>
//                                 <div className="row text-center">
//                                   {Object.entries(totalStats.paymentModeStats).map(
//                                     ([mode, stats], index) => (
//                                       <div
//                                         key={mode}
//                                         className="col-md-4 col-sm-6 mb-3"
//                                       >
//                                         <div
//                                           className="p-3 rounded"
//                                           style={{
//                                             backgroundColor: "#3a3a3a",
//                                             border: "1px solid #4a4a4a",
//                                             transition: "all 0.3s ease",
//                                           }}
//                                           onMouseEnter={(e) => {
//                                             e.currentTarget.style.backgroundColor =
//                                               "#4a4a4a";
//                                             e.currentTarget.style.transform =
//                                               "translateY(-2px)";
//                                             e.currentTarget.style.boxShadow =
//                                               "0 4px 8px rgba(0, 0, 0, 0.2)";
//                                           }}
//                                           onMouseLeave={(e) => {
//                                             e.currentTarget.style.backgroundColor =
//                                               "#3a3a3a";
//                                             e.currentTarget.style.transform =
//                                               "translateY(0)";
//                                             e.currentTarget.style.boxShadow =
//                                               "none";
//                                           }}
//                                         >
//                                           <div
//                                             style={{
//                                               color: "#ec660f",
//                                               fontWeight: "600",
//                                               fontSize: "16px",
//                                             }}
//                                           >
//                                             {mode}
//                                           </div>
//                                           <div className="mt-2">
//                                             <div
//                                               style={{
//                                                 fontSize: "14px",
//                                                 color: "#ccc",
//                                               }}
//                                             >
//                                               Transactions:{" "}
//                                               <strong>{stats.count}</strong>
//                                             </div>
//                                             <div
//                                               style={{
//                                                 fontSize: "18px",
//                                                 fontWeight: "700",
//                                                 color: "#fff",
//                                                 marginTop: "5px",
//                                               }}
//                                             >
//                                               ₹{stats.amount.toLocaleString()}
//                                             </div>
//                                           </div>
//                                         </div>
//                                       </div>
//                                     )
//                                   )}
//                                 </div>
//                               </>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {/* User Selection Dropdown */}
//                     {dataFetched && usersData.length > 1 && (
//                       <div className="my-4">
//                         <div className="row justify-content-center">
//                           <div className="col-12 col-md-6">
//                             <div className="form-group">
//                               <label htmlFor="userSelect" className="form-label">
//                                 Select User to View Details
//                               </label>
//                               <select
//                                 id="userSelect"
//                                 className="form-control"
//                                 style={{
//                                   backgroundColor: "#1b232d",
//                                   color: "#fff",
//                                 }}
//                                 value={selectedUserIndex}
//                                 onChange={(e) =>
//                                   setSelectedUserIndex(parseInt(e.target.value))
//                                 }
//                               >
//                                 {usersData.map((userData, index) => (
//                                   <option key={index} value={index}>
//                                     {userData.user.name} ({userData.user.email})
//                                   </option>
//                                 ))}
//                               </select>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {/* Individual User Data */}
//                     {dataFetched && currentUserData && (
//                       <div className="my-4">
//                         <div
//                           className="card"
//                           style={{
//                             backgroundColor: "#1b232d",
//                             color: "#fff",
//                             border: "1px solid #3a3a3a",
//                           }}
//                         >
//                           <div
//                             className="card-header py-3"
//                             style={{ borderBottom: "1px solid #3a3a3a" }}
//                           >
//                             <h5 className="mb-0" style={{ color: "#ec660f" }}>
//                               User Information
//                             </h5>
//                           </div>
//                           <div className="card-body">
//                             <div className="row">
//                               <div className="col-md-6">
//                                 <p>
//                                   <strong>Name:</strong> {currentUserData.user.name}
//                                 </p>
//                                 <p>
//                                   <strong>Email:</strong>{" "}
//                                   {currentUserData.user.email}
//                                 </p>
//                                 <p>
//                                   <strong>Phone:</strong>{" "}
//                                   {currentUserData.user.phone}
//                                 </p>
//                               </div>
//                               <div className="col-md-6">
//                                 <p>
//                                   <strong>Username:</strong>{" "}
//                                   {currentUserData.user.username}
//                                 </p>
//                                 <p>
//                                   <strong>Total Coins:</strong>{" "}
//                                   {currentUserData.user.totalOrderedCoins?.toLocaleString() ||
//                                     "0"}
//                                 </p>
//                                 <p>
//                                   <strong>Total Investments:</strong> ₹
//                                   {currentUserData.user.totalInvestments?.toLocaleString() ||
//                                     "0"}
//                                 </p>
//                               </div>
//                             </div>

//                             <div className="row mt-4">
//                               <div className="col-md-6">
//                                 <div className="d-grid">
//                                   <button
//                                     className="btn btn-primary"
//                                     style={{
//                                       backgroundColor: "#ec660f",
//                                       border: "1px solid black",
//                                       transition: "all 0.3s ease",
//                                     }}
//                                     onMouseOver={(e) => {
//                                       e.currentTarget.style.backgroundColor =
//                                         "#d25400";
//                                       e.currentTarget.style.transform =
//                                         "translateY(-2px)";
//                                       e.currentTarget.style.boxShadow =
//                                         "0 4px 8px rgba(0, 0, 0, 0.2)";
//                                     }}
//                                     onMouseOut={(e) => {
//                                       e.currentTarget.style.backgroundColor =
//                                         "#ec660f";
//                                       e.currentTarget.style.transform =
//                                         "translateY(0)";
//                                       e.currentTarget.style.boxShadow = "none";
//                                     }}
//                                     onClick={() => handleViewDetails("orders")}
//                                     disabled={
//                                       !currentUserData.orders ||
//                                       currentUserData.orders.length === 0
//                                     }
//                                   >
//                                     View Orders (
//                                     {currentUserData.orders?.length || 0})
//                                   </button>
//                                 </div>
//                               </div>
//                               <div className="col-md-6">
//                                 <div className="d-grid">
//                                   <button
//                                     className="btn btn-primary"
//                                     style={{
//                                       backgroundColor: "#2e2e2e",
//                                       border: "1px solid #3a3a3a",
//                                       transition: "all 0.3s ease",
//                                     }}
//                                     onMouseOver={(e) => {
//                                       e.currentTarget.style.backgroundColor =
//                                         "#3a3a3a";
//                                       e.currentTarget.style.transform =
//                                         "translateY(-2px)";
//                                       e.currentTarget.style.boxShadow =
//                                         "0 4px 8px rgba(0, 0, 0, 0.2)";
//                                     }}
//                                     onMouseOut={(e) => {
//                                       e.currentTarget.style.backgroundColor =
//                                         "#2e2e2e";
//                                       e.currentTarget.style.transform =
//                                         "translateY(0)";
//                                       e.currentTarget.style.boxShadow = "none";
//                                     }}
//                                     onClick={() =>
//                                       handleViewDetails("walletTransactions")
//                                     }
//                                     disabled={
//                                       !currentUserData.walletTransactions ||
//                                       currentUserData.walletTransactions.length ===
//                                         0
//                                     }
//                                   >
//                                     View Wallet Transactions (
//                                     {currentUserData.walletTransactions?.length ||
//                                       0}
//                                     )
//                                   </button>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {/* No data message */}
//                     {dataFetched && usersData.length === 0 && (
//                       <div className="alert alert-warning mt-4">
//                         No data found for the selected date range
//                       </div>
//                     )}
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Modal for Orders and Wallet Transactions */}
//       <Modal
//         show={showModal}
//         onHide={() => setShowModal(false)}
//         backdrop="static"
//         keyboard={false}
//         size="lg"
//         centered
//       >
//         <Modal.Header
//           style={{
//             backgroundColor: "#1b242d",
//             borderBottom: "1px solid #3a3a3a",
//             color: "#ec660f",
//           }}
//         >
//           <Modal.Title>
//             {currentUserData?.user?.name}'s{" "}
//             {modalType === "orders" ? "Orders" : "Wallet Transactions"}
//           </Modal.Title>
//           <button
//             type="button"
//             className="btn-close btn-close-white"
//             aria-label="Close"
//             onClick={() => setShowModal(false)}
//           ></button>
//         </Modal.Header>
//         <Modal.Body style={{ backgroundColor: "#1b242d", color: "#fff" }}>
//           {currentUserData && (
//             <>
//               <div className="row mb-4">
//                 <div className="col-md-6">
//                   <div className="mb-3">
//                     <strong>Name:</strong> {currentUserData.user.name}
//                   </div>
//                   <div className="mb-3">
//                     <strong>Username:</strong> {currentUserData.user.username}
//                   </div>
//                   <div className="mb-3">
//                     <strong>Email:</strong> {currentUserData.user.email}
//                   </div>
//                 </div>
//                 <div className="col-md-6">
//                   <div className="mb-3">
//                     <strong>Phone:</strong> {currentUserData.user.phone}
//                   </div>
//                   <div className="mb-3">
//                     <strong>Total Coins:</strong>{" "}
//                     {currentUserData.user.totalOrderedCoins?.toLocaleString() ||
//                       "0"}
//                   </div>
//                   <div className="mb-3">
//                     <strong>Total Investments:</strong> ₹
//                     {currentUserData.user.totalInvestments?.toLocaleString() ||
//                       "0"}
//                   </div>
//                 </div>
//               </div>

//               {/* Orders Table */}
//               {modalType === "orders" && currentUserData.orders && (
//                 <>
//                   {/* Summary stats for orders */}
//                   <div className="row mt-4 mb-4">
//                     <div className="col-6">
//                       <div
//                         className="p-3 text-center rounded"
//                         style={{ backgroundColor: "#2e2e2e" }}
//                       >
//                         <p
//                           className="text-sm font-medium"
//                           style={{ color: "#ec660f" }}
//                         >
//                           Total Orders
//                         </p>
//                         <p className="text-xl font-bold text-white">
//                           {currentUserData.orders.length}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="col-6">
//                       <div
//                         className="p-3 text-center rounded"
//                         style={{ backgroundColor: "#2e2e2e" }}
//                       >
//                         <p
//                           className="text-sm font-medium"
//                           style={{ color: "#ec660f" }}
//                         >
//                           Total Tokens
//                         </p>
//                         <p className="text-xl font-bold text-white">
//                           {currentUserData.user.totalOrderedCoins?.toLocaleString() ||
//                             "0"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Orders table */}
//                   <div
//                     style={{
//                       boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
//                       borderRadius: "8px",
//                       overflow: "hidden",
//                       marginTop: "16px",
//                     }}
//                   >
//                     <table
//                       style={{
//                         backgroundColor: "#1e1e1e",
//                         borderColor: "#3a3a3a",
//                         borderCollapse: "collapse",
//                         margin: "0",
//                         width: "100%",
//                         border: "1px solid #3a3a3a",
//                       }}
//                     >
//                       <thead>
//                         <tr
//                           style={{
//                             background:
//                               "linear-gradient(45deg, #ec660f, #f07d2c)",
//                             boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
//                           }}
//                         >
//                           <th
//                             style={{
//                               color: "white",
//                               fontWeight: "600",
//                               borderColor: "#ec660f",
//                               letterSpacing: "0.5px",
//                               fontSize: "16px",
//                               textTransform: "uppercase",
//                               padding: "12px",
//                               textAlign: "center",
//                             }}
//                           >
//                             S.No
//                           </th>
//                           <th
//                             style={{
//                               color: "white",
//                               fontWeight: "600",
//                               borderColor: "#ec660f",
//                               letterSpacing: "0.5px",
//                               fontSize: "16px",
//                               textTransform: "uppercase",
//                               padding: "12px",
//                               textAlign: "center",
//                             }}
//                           >
//                             Date
//                           </th>
//                           <th
//                             style={{
//                               color: "white",
//                               fontWeight: "600",
//                               borderColor: "#ec660f",
//                               letterSpacing: "0.5px",
//                               fontSize: "16px",
//                               textTransform: "uppercase",
//                               padding: "12px",
//                               textAlign: "center",
//                             }}
//                           >
//                             Amount
//                           </th>
//                           <th
//                             style={{
//                               color: "white",
//                               fontWeight: "600",
//                               borderColor: "#ec660f",
//                               letterSpacing: "0.5px",
//                               fontSize: "16px",
//                               textTransform: "uppercase",
//                               padding: "12px",
//                               textAlign: "center",
//                             }}
//                           >
//                             JAIMAX Tokens
//                           </th>
//                           <th
//                             style={{
//                               color: "white",
//                               fontWeight: "600",
//                               borderColor: "#ec660f",
//                               letterSpacing: "0.5px",
//                               fontSize: "16px",
//                               textTransform: "uppercase",
//                               padding: "12px",
//                               textAlign: "center",
//                             }}
//                           >
//                             Status
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {currentUserData.orders.map((item, index) => (
//                           <tr
//                             key={index}
//                             style={{
//                               backgroundColor:
//                                 index % 2 === 0 ? "#2e2e2e" : "#262626",
//                               color: "#fff",
//                               transition: "all 0.2s ease",
//                               borderLeft: "3px solid transparent",
//                               borderRight: "3px solid transparent",
//                             }}
//                             onMouseEnter={(e) => {
//                               e.currentTarget.style.backgroundColor = "#3a3a3a";
//                               e.currentTarget.style.borderLeft =
//                                 "3px solid #ec660f";
//                               e.currentTarget.style.borderRight =
//                                 "3px solid #ec660f";
//                             }}
//                             onMouseLeave={(e) => {
//                               e.currentTarget.style.backgroundColor =
//                                 index % 2 === 0 ? "#2e2e2e" : "#262626";
//                               e.currentTarget.style.borderLeft =
//                                 "3px solid transparent";
//                               e.currentTarget.style.borderRight =
//                                 "3px solid transparent";
//                             }}
//                           >
//                             <td
//                               style={{
//                                 textAlign: "center",
//                                 padding: "12px",
//                               }}
//                             >
//                               <span
//                                 style={{
//                                   backgroundColor: "#ec660f",
//                                   color: "white",
//                                   fontSize: "14px",
//                                   fontWeight: "bold",
//                                   padding: "6px 10px",
//                                   borderRadius: "6px",
//                                   minWidth: "30px",
//                                   display: "inline-block",
//                                 }}
//                               >
//                                 {index + 1}
//                               </span>
//                             </td>
//                             <td
//                               style={{
//                                 textAlign: "center",
//                                 padding: "12px",
//                                 fontSize: "15px",
//                               }}
//                             >
//                               {formatDate(item.createdAt)}
//                             </td>
//                             <td
//                               style={{
//                                 textAlign: "center",
//                                 padding: "12px",
//                                 fontSize: "15px",
//                                 fontWeight: "600",
//                               }}
//                             >
//                               <span style={{ color: "#eaeaea" }}>
//                                 {(item.amount || 0).toLocaleString()}{" "}
//                                 <span>{item.currency}</span>
//                               </span>
//                             </td>
//                             <td
//                               style={{
//                                 textAlign: "center",
//                                 padding: "12px",
//                                 fontSize: "15px",
//                                 fontWeight: "600",
//                               }}
//                             >
//                               {(item.jaimax || 0).toLocaleString()}
//                             </td>
//                             <td
//                               style={{
//                                 textAlign: "center",
//                                 padding: "12px",
//                                 fontSize: "15px",
//                               }}
//                             >
//                               <span
//                                 style={{
//                                   backgroundColor:
//                                     item.status === "Completed"
//                                       ? "#198754"
//                                       : "#ffc107",
//                                   color:
//                                     item.status === "Completed"
//                                       ? "white"
//                                       : "black",
//                                   padding: "4px 8px",
//                                   borderRadius: "4px",
//                                   fontSize: "12px",
//                                   fontWeight: "bold",
//                                 }}
//                               >
//                                 {item.status}
//                               </span>
//                             </td>
//                           </tr>
//                         ))}
//                         {!currentUserData.orders ||
//                         currentUserData.orders.length === 0 ? (
//                           <tr
//                             style={{
//                               backgroundColor: "#2e2e2e",
//                             }}
//                           >
//                             <td
//                               colSpan="5"
//                               style={{
//                                 textAlign: "center",
//                                 padding: "16px",
//                                 color: "#999",
//                                 fontStyle: "italic",
//                               }}
//                             >
//                               No order data available
//                             </td>
//                           </tr>
//                         ) : null}
//                       </tbody>
//                     </table>
//                   </div>
//                 </>
//               )}

//               {/* Wallet Transactions Table */}
//               {modalType === "walletTransactions" &&
//                 currentUserData.walletTransactions && (
//                   <>
//                     {/* Summary stats for wallet transactions */}
//                     <div className="row mt-4 mb-4">
//                       <div className="col-6">
//                         <div
//                           className="p-3 text-center rounded"
//                           style={{ backgroundColor: "#2e2e2e" }}
//                         >
//                           <p
//                             className="text-sm font-medium"
//                             style={{ color: "#ec660f" }}
//                           >
//                             Total Transactions
//                           </p>
//                           <p className="text-xl font-bold text-white">
//                             {currentUserData.walletTransactions.length}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="col-6">
//                         <div
//                           className="p-3 text-center rounded"
//                           style={{ backgroundColor: "#2e2e2e" }}
//                         >
//                           <p
//                             className="text-sm font-medium"
//                             style={{ color: "#ec660f" }}
//                           >
//                             Total Investment
//                           </p>
//                           <p className="text-xl font-bold text-white">
//                             ₹
//                             {currentUserData.user.totalInvestments?.toLocaleString() ||
//                               "0"}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Wallet transactions table */}
//                     <div
//                       style={{
//                         boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
//                         borderRadius: "8px",
//                         overflow: "hidden",
//                         marginTop: "16px",
//                       }}
//                     >
//                       <table
//                         style={{
//                           backgroundColor: "#1e1e1e",
//                           borderColor: "#3a3a3a",
//                           borderCollapse: "collapse",
//                           margin: "0",
//                           width: "100%",
//                           border: "1px solid #3a3a3a",
//                         }}
//                       >
//                         <thead>
//                           <tr
//                             style={{
//                               background:
//                                 "linear-gradient(45deg, #ec660f, #f07d2c)",
//                               boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
//                             }}
//                           >
//                             <th
//                               style={{
//                                 color: "white",
//                                 fontWeight: "600",
//                                 borderColor: "#ec660f",
//                                 letterSpacing: "0.5px",
//                                 fontSize: "16px",
//                                 textTransform: "uppercase",
//                                 padding: "12px",
//                                 textAlign: "center",
//                               }}
//                             >
//                               S.NO
//                             </th>
//                             <th
//                               style={{
//                                 color: "white",
//                                 fontWeight: "600",
//                                 borderColor: "#ec660f",
//                                 letterSpacing: "0.5px",
//                                 fontSize: "16px",
//                                 textTransform: "uppercase",
//                                 padding: "12px",
//                                 textAlign: "center",
//                               }}
//                             >
//                               Date
//                             </th>
//                             <th
//                               style={{
//                                 color: "white",
//                                 fontWeight: "600",
//                                 borderColor: "#ec660f",
//                                 letterSpacing: "0.5px",
//                                 fontSize: "16px",
//                                 textTransform: "uppercase",
//                                 padding: "12px",
//                                 textAlign: "center",
//                               }}
//                             >
//                               Amount
//                             </th>
//                             <th
//                               style={{
//                                 color: "white",
//                                 fontWeight: "600",
//                                 borderColor: "#ec660f",
//                                 letterSpacing: "0.5px",
//                                 fontSize: "16px",
//                                 textTransform: "uppercase",
//                                 padding: "12px",
//                                 textAlign: "center",
//                               }}
//                             >
//                               Payment Mode
//                             </th>
//                             <th
//                               style={{
//                                 color: "white",
//                                 fontWeight: "600",
//                                 borderColor: "#ec660f",
//                                 letterSpacing: "0.5px",
//                                 fontSize: "16px",
//                                 textTransform: "uppercase",
//                                 padding: "12px",
//                                 textAlign: "center",
//                               }}
//                             >
//                               Transaction ID
//                             </th>
//                             <th
//                               style={{
//                                 color: "white",
//                                 fontWeight: "600",
//                                 borderColor: "#ec660f",
//                                 letterSpacing: "0.5px",
//                                 fontSize: "16px",
//                                 textTransform: "uppercase",
//                                 padding: "12px",
//                                 textAlign: "center",
//                               }}
//                             >
//                               Status
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {currentUserData.walletTransactions.map(
//                             (item, index) => (
//                               <tr
//                                 key={index}
//                                 style={{
//                                   backgroundColor:
//                                     index % 2 === 0 ? "#2e2e2e" : "#262626",
//                                   color: "#fff",
//                                   transition: "all 0.2s ease",
//                                   borderLeft: "3px solid transparent",
//                                   borderRight: "3px solid transparent",
//                                 }}
//                                 onMouseEnter={(e) => {
//                                   e.currentTarget.style.backgroundColor =
//                                     "#3a3a3a";
//                                   e.currentTarget.style.borderLeft =
//                                     "3px solid #ec660f";
//                                   e.currentTarget.style.borderRight =
//                                     "3px solid #ec660f";
//                                 }}
//                                 onMouseLeave={(e) => {
//                                   e.currentTarget.style.backgroundColor =
//                                     index % 2 === 0 ? "#2e2e2e" : "#262626";
//                                   e.currentTarget.style.borderLeft =
//                                     "3px solid transparent";
//                                   e.currentTarget.style.borderRight =
//                                     "3px solid transparent";
//                                 }}
//                               >
//                                 <td
//                                   style={{
//                                     textAlign: "center",
//                                     padding: "12px",
//                                   }}
//                                 >
//                                   <span
//                                     style={{
//                                       backgroundColor: "#ec660f",
//                                       color: "white",
//                                       fontSize: "14px",
//                                       fontWeight: "bold",
//                                       padding: "6px 10px",
//                                       borderRadius: "6px",
//                                       minWidth: "30px",
//                                       display: "inline-block",
//                                     }}
//                                   >
//                                     {index + 1}
//                                   </span>
//                                 </td>
//                                 <td
//                                   style={{
//                                     textAlign: "center",
//                                     padding: "12px",
//                                     fontSize: "15px",
//                                   }}
//                                 >
//                                   {formatDate(item.transactionDate)}
//                                 </td>
//                                 <td
//                                   style={{
//                                     textAlign: "center",
//                                     padding: "12px",
//                                     fontSize: "15px",
//                                     fontWeight: "600",
//                                   }}
//                                 >
//                                   <span style={{ color: "#eaeaea" }}>
//                                     {(
//                                       item.transactionAmount || 0
//                                     ).toLocaleString()}{" "}
//                                     <span>{item.currency}</span>
//                                   </span>
//                                 </td>
//                                 <td
//                                   style={{
//                                     textAlign: "center",
//                                     padding: "12px",
//                                     fontSize: "15px",
//                                   }}
//                                 >
//                                   {item.paymentMode}
//                                 </td>
//                                 <td
//                                   style={{
//                                     textAlign: "center",
//                                     padding: "12px",
//                                     fontSize: "15px",
//                                   }}
//                                 >
//                                   {item.transactionId}
//                                 </td>
//                                 <td
//                                   style={{
//                                     textAlign: "center",
//                                     padding: "12px",
//                                     fontSize: "15px",
//                                   }}
//                                 >
//                                   <span
//                                     style={{
//                                       backgroundColor:
//                                         item.transactionStatus === "Completed"
//                                           ? "#198754"
//                                           : "#ffc107",
//                                       color:
//                                         item.transactionStatus === "Completed"
//                                           ? "white"
//                                           : "black",
//                                       padding: "4px 8px",
//                                       borderRadius: "4px",
//                                       fontSize: "12px",
//                                       fontWeight: "bold",
//                                     }}
//                                   >
//                                     {item.transactionStatus}
//                                   </span>
//                                 </td>
//                               </tr>
//                             )
//                           )}
//                           {!currentUserData.walletTransactions ||
//                           currentUserData.walletTransactions.length === 0 ? (
//                             <tr
//                               style={{
//                                 backgroundColor: "#2e2e2e",
//                               }}
//                             >
//                               <td
//                                 colSpan="6"
//                                 style={{
//                                   textAlign: "center",
//                                   padding: "16px",
//                                   color: "#999",
//                                   fontStyle: "italic",
//                                 }}
//                               >
//                                 No wallet transaction data available
//                               </td>
//                             </tr>
//                           ) : null}
//                         </tbody>
//                       </table>
//                     </div>
//                   </>
//                 )}
//             </>
//           )}
//         </Modal.Body>
//         <Modal.Footer
//           style={{
//             backgroundColor: "#1b242d",
//             borderTop: "1px solid #3a3a3a",
//           }}
//         >
//           <Button
//             variant="secondary"
//             onClick={() => setShowModal(false)}
//             style={{
//               backgroundColor: "#2e2e2e",
//               borderColor: "#3a3a3a",
//             }}
//           >
//             Close
//           </Button>
//           {modalType === "orders" &&
//             currentUserData?.walletTransactions?.length > 0 && (
//               <Button
//                 variant="primary"
//                 onClick={() => setModalType("walletTransactions")}
//                 style={{
//                   backgroundColor: "#ec660f",
//                   borderColor: "#ec660f",
//                 }}
//               >
//                 View Wallet Transactions
//               </Button>
//             )}
//           {modalType === "walletTransactions" &&
//             currentUserData?.orders?.length > 0 && (
//               <Button
//                 variant="primary"
//                 onClick={() => setModalType("orders")}
//                 style={{
//                   backgroundColor: "#ec660f",
//                   borderColor: "#ec660f",
//                 }}
//               >
//                 View Orders
//               </Button>
//             )}
//         </Modal.Footer>
//       </Modal>
//     </DashboardLayout>
//   );
// }

// export default GetBusinessDetails;