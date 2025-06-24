import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Modal, Button } from "react-bootstrap";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useGetUserBusinessDirectRefsMutation,
  useGetDetailedDirectChainUsersBusinessMutation,
} from "./getBusinessReportFromToApiSlice";

const DetailedBusinessPerformanceReport = () => {
  const [username, setUsername] = useState("");
  const [excludedDirectUsers, setExcludedDirectUsers] = useState([]);
  const [excludedChainUsers, setExcludedChainUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [activeTab, setActiveTab] = useState("direct");

  // Search states
  const [directSearchQuery, setDirectSearchQuery] = useState("");
  const [chainSearchQuery, setChainSearchQuery] = useState("");

  const [getRefs] = useGetUserBusinessDirectRefsMutation();
  const [getDetailedReport] = useGetDetailedDirectChainUsersBusinessMutation();

  // Toast configuration
  const toastConfig = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };

  // Reset all states when username changes
  const resetStates = () => {
    setUser(null);
    setExcludedDirectUsers([]);
    setExcludedChainUsers([]);
    setReportData(null);
    setShowReportModal(false);
    setActiveTab("direct");
    setDirectSearchQuery("");
    setChainSearchQuery("");
  };

  // Filter functions for search
  const filterReferralsData = (referralsData, searchQuery) => {
    if (!searchQuery.trim()) return referralsData;

    const query = searchQuery.toLowerCase().trim();
    return (
      referralsData?.filter(
        (user) =>
          user.name?.toLowerCase().includes(query) ||
          user.username?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query)
      ) || []
    );
  };

  // Get filtered referrals
  const filteredDirectReferrals = filterReferralsData(
    user?.directReferrals,
    directSearchQuery
  );
  const filteredChainReferrals = filterReferralsData(
    user?.chainReferrals,
    chainSearchQuery
  );

  // Form validation for report generation
  const reportFormik = useFormik({
    initialValues: {},
    onSubmit: async () => {
      await handleGenerateReport();
    },
  });

  const formik = useFormik({
    initialValues: {
      username: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        resetStates();
        setUsername(values.username);
        const res = await getRefs(values.username).unwrap();
        setUser(res.data);
        toast.success("User referrals fetched successfully!", toastConfig);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error(
          "Failed to fetch referrals data. Please try again.",
          toastConfig
        );
        resetStates();
      } finally {
        setLoading(false);
      }
    },
  });

  // Reset states when username input changes
  useEffect(() => {
    if (formik.values.username !== username) {
      resetStates();
    }
  }, [formik.values.username, username]);

  // Clear search when switching tabs
  useEffect(() => {
    if (activeTab === "direct") {
      setChainSearchQuery("");
    } else {
      setDirectSearchQuery("");
    }
  }, [activeTab]);

  const toggleExcludedDirect = (username) => {
    setExcludedDirectUsers((prev) =>
      prev.includes(username)
        ? prev.filter((u) => u !== username)
        : [...prev, username]
    );
  };

  const toggleExcludedChain = (username) => {
    setExcludedChainUsers((prev) =>
      prev.includes(username)
        ? prev.filter((u) => u !== username)
        : [...prev, username]
    );
  };

  const handleShowReport = () => {
    if (!user) return;
    setReportData(null);
    reportFormik.resetForm();
    setShowReportModal(true);
  };

  const handleGenerateReport = async () => {
    try {
      setLoading(true);

      const payload = {
        username: username,
        excludedDirectUsers: excludedDirectUsers || [],
        excludedChainUsers: excludedChainUsers || [],
      };

      console.log("Payload being sent:", payload);

      const response = await getDetailedReport(payload).unwrap();
      setReportData(response);
      console.log("Report data:", response);
      toast.success("Detailed report generated successfully!", toastConfig);
    } catch (error) {
      console.error("Report generation error:", error);
      toast.error(
        "Failed to generate detailed report. Please try again.",
        toastConfig
      );
    } finally {
      setLoading(false);
    }
  };

  const generateDetailedBusinessReportPdf = () => {
    if (!user || !reportData) return null;

    const doc = new jsPDF();
    let yPosition = 20;

    // Helper function to add new page if needed
    const checkAddPage = (requiredSpace = 20) => {
      if (yPosition + requiredSpace > doc.internal.pageSize.height - 20) {
        doc.addPage();
        yPosition = 20;
        return true;
      }
      return false;
    };

    // Header
    doc.setFontSize(18);
    doc.setTextColor(32, 147, 74);
    doc.text("DETAILED BUSINESS PERFORMANCE REPORT", 105, yPosition, {
      align: "center",
    });
    yPosition += 15;

    // User Information Section
    doc.setFontSize(14);
    doc.setTextColor(32, 147, 74);
    doc.text("USER INFORMATION", 20, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    const userInfo = [
      [`Name: ${user.name}`, `Phone: ${user.phone || "N/A"}`],
      [`Username: ${user.username}`, `Email: ${user.email}`],
    ];

    userInfo.forEach((row) => {
      checkAddPage();
      doc.text(row[0], 20, yPosition);
      doc.text(row[1], 105, yPosition);
      yPosition += 6;
    });

    yPosition += 10;

    // Report Details
    checkAddPage();
    doc.setFontSize(14);
    doc.setTextColor(32, 147, 74);
    doc.text("REPORT DETAILS", 20, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(
      `Generated on: ${new Date().toLocaleDateString("en-GB")}`,
      20,
      yPosition
    );
    yPosition += 15;

    // Direct Referrals Table
    if (reportData.data?.directUserBusinessPerformance?.length > 0) {
      checkAddPage(30);

      doc.setFontSize(14);
      doc.setTextColor(32, 147, 74);
      doc.text("DIRECT REFERRALS", 20, yPosition);
      yPosition += 10;

      const directTableColumns = [
        "S.No",
        "Name",
        "Username",
        "Email",
        "Phone",
        "DR",
        "CR",
        "TR",
      ];

      const directTableRows = reportData.data.directUserBusinessPerformance
        .filter((user) => !excludedDirectUsers.includes(user.username))
        .map((user, index) => [
          (index + 1).toString(),
          user.name || "N/A",
          user.username || "N/A",
          user.email || "N/A",
          user.phone?.toString() || "N/A",
          user.directRefs?.toString() || "0",
          user.chainRefs?.toString() || "0",
          user.totalRefs?.toString() || "0",
        ]);

      autoTable(doc, {
        head: [directTableColumns],
        body: directTableRows,
        startY: yPosition,
        theme: "striped",
        headStyles: {
          fillColor: [32, 147, 74],
          textColor: 255,
          fontSize: 8,
          fontStyle: "bold",
        },
        styles: {
          fontSize: 7,
          cellPadding: 2,
        },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 30 },
          2: { cellWidth: 30 },
          3: { cellWidth: 35 },
          4: { cellWidth: 25 },
          5: { cellWidth: 15 },
          6: { cellWidth: 15 },
          7: { cellWidth: 15 },
        },
        didDrawPage: function (data) {
          let str = "Page " + doc.internal.getNumberOfPages();
          doc.setFontSize(8);
          doc.setTextColor(100);
          doc.text(
            str,
            data.settings.margin.left,
            doc.internal.pageSize.height - 10
          );
        },
      });

      yPosition = doc.lastAutoTable.finalY + 15;
    }

    // Chain Referrals Table
    if (reportData.data?.chainUserBusinessPerformance?.length > 0) {
      checkAddPage(30);

      doc.setFontSize(14);
      doc.setTextColor(32, 147, 74);
      doc.text("CHAIN REFERRALS", 20, yPosition);
      yPosition += 10;

      const chainTableColumns = [
        "S.No",
        "Name",
        "Username",
        "Email",
        "Phone",
        "DR",
        "CR",
        "TR",
      ];

      const chainTableRows = reportData.data.chainUserBusinessPerformance
        .filter((user) => !excludedChainUsers.includes(user.username))
        .map((user, index) => [
          (index + 1).toString(),
          user.name || "N/A",
          user.username || "N/A",
          user.email || "N/A",
          user.phone?.toString() || "N/A",
          user.directRefs?.toString() || "0",
          user.chainRefs?.toString() || "0",
          user.totalRefs?.toString() || "0",
        ]);

      autoTable(doc, {
        head: [chainTableColumns],
        body: chainTableRows,
        startY: yPosition,
        theme: "striped",
        headStyles: {
          fillColor: [32, 147, 74],
          textColor: 255,
          fontSize: 8,
          fontStyle: "bold",
        },
        styles: {
          fontSize: 7,
          cellPadding: 2,
        },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 30 },
          2: { cellWidth: 30 },
          3: { cellWidth: 35 },
          4: { cellWidth: 25 },
          5: { cellWidth: 15 },
          6: { cellWidth: 15 },
          7: { cellWidth: 15 },
        },
        didDrawPage: function (data) {
          let str = "Page " + doc.internal.getNumberOfPages();
          doc.setFontSize(8);
          doc.setTextColor(100);
          doc.text(
            str,
            data.settings.margin.left,
            doc.internal.pageSize.height - 10
          );
        },
      });
    }

    // Summary Statistics
    yPosition = doc.lastAutoTable
      ? doc.lastAutoTable.finalY + 15
      : yPosition + 15;
    checkAddPage(40);

    doc.setFontSize(14);
    doc.setTextColor(32, 147, 74);
    doc.text("SUMMARY STATISTICS", 20, yPosition);
    yPosition += 10;

    const totalDirectUsers =
      reportData.data?.directUserBusinessPerformance?.filter(
        (user) => !excludedDirectUsers.includes(user.username)
      ).length || 0;

    const totalChainUsers =
      reportData.data?.chainUserBusinessPerformance?.filter(
        (user) => !excludedChainUsers.includes(user.username)
      ).length || 0;

    const totalDirectRefs =
      reportData.data?.directUserBusinessPerformance
        ?.filter((user) => !excludedDirectUsers.includes(user.username))
        ?.reduce((sum, user) => sum + (user.directRefs || 0), 0) || 0;

    const totalChainRefs =
      reportData.data?.chainUserBusinessPerformance
        ?.filter((user) => !excludedChainUsers.includes(user.username))
        ?.reduce((sum, user) => sum + (user.chainRefs || 0), 0) || 0;

    const summaryData = [
      ["Metric", "Count/Value"],
      ["Total Direct Referrals", totalDirectUsers.toString()],
      ["Total Chain Referrals", totalChainUsers.toString()],
      ["Total Direct Refs Count", totalDirectRefs.toString()],
      ["Total Chain Refs Count", totalChainRefs.toString()],
      ["Overall Total Users", (totalDirectUsers + totalChainUsers).toString()],
    ];

    autoTable(doc, {
      head: [summaryData[0]],
      body: summaryData.slice(1),
      startY: yPosition,
      theme: "striped",
      headStyles: {
        fillColor: [32, 147, 74],
        textColor: 255,
        fontSize: 10,
        fontStyle: "bold",
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 100 },
        1: { cellWidth: 50, halign: "right" },
      },
    });

    return doc;
  };

  const handlePdfGeneration = async () => {
    try {
      setPdfLoading(true);

      const pdfDoc = generateDetailedBusinessReportPdf();

      if (pdfDoc) {
        const filename = `detailed-business-performance-${user.name.replace(
          /\s+/g,
          "-"
        )}-${new Date().toISOString().split("T")[0]}.pdf`;
        pdfDoc.save(filename);

        toast.success(
          "PDF report generated and downloaded successfully!",
          toastConfig
        );
        setShowReportModal(false);
      } else {
        throw new Error("Failed to generate PDF content");
      }
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error(
        "Failed to generate PDF report. Please try again.",
        toastConfig
      );
    } finally {
      setPdfLoading(false);
    }
  };

  const renderSearchBar = (
    searchQuery,
    setSearchQuery,
    placeholder,
    totalCount,
    filteredCount
  ) => {
    return (
      <div className="mb-3">
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="position-relative">
              <input
                type="text"
                className="form-control"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  backgroundColor: "#1b232d",
                  color: "#fff",
                  border: "1px solid #3a3a3a",
                  paddingLeft: "15px",
                }}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="text-end">
              <span className="text-muted small">
                Showing {filteredCount} of {totalCount} users
                {searchQuery && filteredCount !== totalCount && (
                  <span className="text-warning ms-2">(filtered)</span>
                )}
              </span>
              {searchQuery && (
                <button
                  className="btn btn-sm btn-outline-secondary ms-2"
                  onClick={() => setSearchQuery("")}
                  style={{
                    color: "#6c757d",
                    borderColor: "#6c757d",
                    fontSize: "12px",
                    padding: "2px 8px",
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderReferralsTable = (referralsData, type) => {
    const isChain = type === "chain";
    const excludedList = isChain ? excludedChainUsers : excludedDirectUsers;
    const toggleFunction = isChain ? toggleExcludedChain : toggleExcludedDirect;

    return (
      <div className="table-responsive mt-4">
        <table className="table table-dark">
          <thead>
            <tr style={{ backgroundColor: "#2a2a2a" }}>
              <th
                style={{
                  backgroundColor: "#ec660f",
                  fontWeight: "600",
                  border: "1px solid #3a3a3a",
                }}
              >
                SNo
              </th>
              <th
                style={{
                  backgroundColor: "#ec660f",
                  fontWeight: "600",
                  border: "1px solid #3a3a3a",
                }}
              >
                Name
              </th>
              <th
                style={{
                  backgroundColor: "#ec660f",
                  fontWeight: "600",
                  border: "1px solid #3a3a3a",
                }}
              >
                Username
              </th>
              <th
                style={{
                  backgroundColor: "#ec660f",
                  fontWeight: "600",
                  border: "1px solid #3a3a3a",
                }}
                className="d-none d-md-table-cell"
              >
                Email
              </th>
              <th
                style={{
                  backgroundColor: "#ec660f",
                  fontWeight: "600",
                  border: "1px solid #3a3a3a",
                }}
                className="d-none d-lg-table-cell"
              >
                Phone{" "}
              </th>

              <th
                style={{
                  backgroundColor: "#ec660f",
                  fontWeight: "600",
                  border: "1px solid #3a3a3a",
                }}
              >
                Exclude?
              </th>
            </tr>
          </thead>
          <tbody>
            {referralsData?.map((user, index) => (
              <tr
                key={user.username}
                style={{
                  backgroundColor: excludedList.includes(user.username)
                    ? "rgba(108, 117, 125, 0.3)"
                    : "#1a1a1a",
                  opacity: excludedList.includes(user.username) ? 0.6 : 1,
                  transition: "all 0.3s ease",
                }}
              >
                <td
                  style={{
                    border: "1px solid #3a3a3a",
                    color: "#fff",
                  }}
                >
                  {index + 1}
                </td>
                <td
                  style={{
                    border: "1px solid #3a3a3a",
                    color: "#fff",
                  }}
                >
                  {user.name}
                </td>
                <td
                  style={{
                    border: "1px solid #3a3a3a",
                    color: "#fff",
                  }}
                >
                  {user.username}
                </td>
                <td
                  style={{
                    border: "1px solid #3a3a3a",
                    color: "#fff",
                  }}
                  className="d-none d-md-table-cell"
                >
                  {user.email}
                </td>
                <td
                  style={{
                    border: "1px solid #3a3a3a",
                    color: "#fff",
                  }}
                  className="d-none d-lg-table-cell"
                >
                  {user.phone}
                </td>
                <td style={{ border: "1px solid #3a3a3a" }}>
                  <input
                    type="checkbox"
                    checked={excludedList.includes(user.username)}
                    onChange={() => toggleFunction(user.username)}
                    style={{
                      transform: "scale(1.2)",
                      accentColor: "#ec660f",
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {referralsData?.length === 0 && (
          <div className="text-center text-muted py-4">
            No referrals found matching your search.
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="profile_section py-4">
      <div className="container-fluid">
        <div className="rounded-3 px-3 pb-4 py-4 bg-dark text-white">
          <h2 className="mb-4 text-center text-md-start">
            Detailed Business Performance Report
            {user && (
              <div className="text-warning fs-5 mt-2">Name: {user.name}</div>
            )}
          </h2>

          <form
            onSubmit={formik.handleSubmit}
            className="row g-3 align-items-end mb-4"
          >
            <div className="col-lg-4 col-md-6 col-12">
              <label className="form-label">Username</label>
              <input
                type="text"
                name="username"
                className="form-control"
                style={{
                  backgroundColor: "#1b232d",
                  color: "#fff",
                  border: "1px solid #3a3a3a",
                }}
                onChange={formik.handleChange}
                value={formik.values.username}
              />
              {formik.errors.username && (
                <div className="text-danger small mt-1">
                  {formik.errors.username}
                </div>
              )}
            </div>
            <div className="col-lg-2 col-md-3 col-12">
              <button
                className="btn btn-primary w-100"
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: "#ec660f",
                  border: "1px solid #ec660f",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#d25400";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 8px rgba(0, 0, 0, 0.2)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#ec660f";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {loading ? "Loading..." : "Fetch Referrals"}
              </button>
            </div>
          </form>

          {user && (
            <>
              {/* Tab Navigation Section */}
              <div className="mb-3">
                <div className="d-flex flex-column d-md-flex flex-md-row md-justify-content-start justify-content-between align-items-end mb-3">
                  <ul
                    className="nav nav-tabs mb-0"
                    style={{ borderBottom: "2px solid #3a3a3a" }}
                  >
                    <li className="nav-item">
                      <button
                        className={`nav-link ${
                          activeTab === "direct" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("direct")}
                        style={{
                          backgroundColor:
                            activeTab === "direct" ? "#ec660f" : "transparent",
                          color: activeTab === "direct" ? "#fff" : "#ec660f",
                          border: "1px solid #ec660f",
                          borderBottom:
                            activeTab === "direct"
                              ? "2px solid #ec660f"
                              : "1px solid #3a3a3a",
                          borderRadius: "0",
                        }}
                      >
                        Direct Referrals ({user.directReferrals?.length || 0})
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${
                          activeTab === "chain" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("chain")}
                        style={{
                          backgroundColor:
                            activeTab === "chain" ? "#ec660f" : "transparent",
                          color: activeTab === "chain" ? "#fff" : "#ec660f",
                          border: "1px solid #ec660f",
                          borderBottom:
                            activeTab === "chain"
                              ? "2px solid #ec660f"
                              : "1px solid #3a3a3a",
                          borderRadius: "0",
                        }}
                      >
                        Chain Referrals ({user.chainReferrals?.length || 0})
                      </button>
                    </li>
                  </ul>

                  {/* Generate Report Button */}
                  <button
                    className="btn btn-primary px-4 py-2 mt-2 mt-md-0 d-flex align-items-center justify-content-center"
                    onClick={handleShowReport}
                    style={{
                      backgroundColor: "#ec660f",
                      border: "1px solid #ec660f",
                      transition: "all 0.3s ease",
                      fontWeight: "600",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#d25400";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 8px rgba(0, 0, 0, 0.2)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "#ec660f";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    Generate Detailed Report
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="tab-content">
                {activeTab === "direct" && (
                  <div className="tab-pane show active">
                    {renderSearchBar(
                      directSearchQuery,
                      setDirectSearchQuery,
                      "Search direct referrals by name, username or email...",
                      user.directReferrals?.length || 0,
                      filteredDirectReferrals?.length || 0
                    )}
                    {renderReferralsTable(filteredDirectReferrals, "direct")}
                  </div>
                )}

                {activeTab === "chain" && (
                  <div className="tab-pane show active">
                    {renderSearchBar(
                      chainSearchQuery,
                      setChainSearchQuery,
                      "Search chain referrals by name, username or email...",
                      user.chainReferrals?.length || 0,
                      filteredChainReferrals?.length || 0
                    )}
                    {renderReferralsTable(filteredChainReferrals, "chain")}
                  </div>
                )}
              </div>

              {/* Summary of Excluded Users */}
              {(excludedDirectUsers.length > 0 ||
                excludedChainUsers.length > 0) && (
                <div className="mt-4">
                  <div
                    className="card"
                    style={{
                      backgroundColor: "#1b232d",
                      border: "1px solid #3a3a3a",
                    }}
                  >
                    <div
                      className="card-header"
                      style={{
                        backgroundColor: "#dc3545",
                        borderBottom: "1px solid #3a3a3a",
                      }}
                    >
                      <h6 className="mb-0 text-white">
                        Excluded Users Summary
                      </h6>
                    </div>
                    <div className="card-body text-white">
                      <div className="row">
                        {excludedDirectUsers.length > 0 && (
                          <div className="col-md-6">
                            <small className="text-muted">
                              Excluded Direct Referrals (
                              {excludedDirectUsers.length}):
                            </small>
                            <div className="mt-1">
                              {excludedDirectUsers.map((username) => (
                                <span
                                  key={username}
                                  className="badge bg-danger me-1 mb-1"
                                >
                                  {username}
                                  <button
                                    className="btn-close btn-close-white ms-2"
                                    style={{ fontSize: "10px" }}
                                    onClick={() =>
                                      toggleExcludedDirect(username)
                                    }
                                  ></button>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {excludedChainUsers.length > 0 && (
                          <div className="col-md-6">
                            <small className="text-muted">
                              Excluded Chain Referrals (
                              {excludedChainUsers.length}):
                            </small>
                            <div className="mt-1">
                              {excludedChainUsers.map((username) => (
                                <span
                                  key={username}
                                  className="badge bg-warning text-dark me-1 mb-1"
                                >
                                  {username}
                                  <button
                                    className="btn-close ms-2"
                                    style={{ fontSize: "10px" }}
                                    onClick={() =>
                                      toggleExcludedChain(username)
                                    }
                                  ></button>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Report Generation Modal */}
      <Modal
        show={showReportModal}
        onHide={() => setShowReportModal(false)}
        size="lg"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "#1b232d",
            borderBottom: "1px solid #3a3a3a",
          }}
        >
          <Modal.Title className="text-white">
            Generate Detailed Business Performance Report
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor: "#1b232d",
            color: "#fff",
          }}
        >
          <form onSubmit={reportFormik.handleSubmit}>
            {/* Excluded Users Preview */}
            {(excludedDirectUsers.length > 0 ||
              excludedChainUsers.length > 0) && (
              <div className="mb-3">
                <h6 className="text-warning">
                  Users to be excluded from report:
                </h6>
                <div className="row">
                  {excludedDirectUsers.length > 0 && (
                    <div className="col-md-6">
                      <small className="text-light">Direct Referrals:</small>
                      <div>
                        {excludedDirectUsers.map((username) => (
                          <span
                            key={username}
                            className="badge bg-danger me-1 mb-1"
                          >
                            {username}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {excludedChainUsers.length > 0 && (
                    <div className="col-md-6">
                      <small className="text-light">Chain Referrals:</small>
                      <div>
                        {excludedChainUsers.map((username) => (
                          <span
                            key={username}
                            className="badge bg-warning text-dark me-1 mb-1"
                          >
                            {username}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </form>
        </Modal.Body>
        <Modal.Footer
          style={{
            backgroundColor: "#1b232d",
            borderTop: "1px solid #3a3a3a",
          }}
        >
          <Button
            variant="secondary"
            onClick={() => setShowReportModal(false)}
            style={{
              backgroundColor: "#6c757d",
              border: "1px solid #6c757d",
            }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={reportFormik.handleSubmit}
            disabled={loading}
            style={{
              backgroundColor: "#ec660f",
              border: "1px solid #ec660f",
            }}
          >
            {loading ? "Generating..." : "Generate Report"}
          </Button>
          {reportData && (
            <Button
              variant="success"
              onClick={handlePdfGeneration}
              disabled={pdfLoading}
              style={{
                backgroundColor: "#20934a",
                border: "1px solid #20934a",
              }}
            >
              {pdfLoading ? "Generating PDF..." : "📄 Download PDF"}
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </section>
  );
};

export default DetailedBusinessPerformanceReport;
