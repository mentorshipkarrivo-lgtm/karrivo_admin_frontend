import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardLayout from "../../Layout/DashboardLayout";
import {
  useGetInactiveUsersQuery,
  useGetUsersWithLessThanTenDirectRefsQuery,
  useGetUsersWithLessThan10AndGreaterThan25DirectRefsQuery,
} from "./reportsApiSlice";
import DetailedBusinessPerformanceReport from "../getBusinessReportFromTo/GetACustomReportOfUsers";

const MarketingReports = () => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [apiDataCache, setApiDataCache] = useState({
    inactive: null,
    lessThan10: null,
    lessThan25: null,
  });

  // RTK Query hooks - fetch data only once initially
  const {
    data: inactiveUsers,
    isLoading: inactiveLoading,
    isSuccess: inactiveSuccess,
  } = useGetInactiveUsersQuery();

  const {
    data: lessThan10Users,
    isLoading: lessThan10Loading,
    isSuccess: lessThan10Success,
  } = useGetUsersWithLessThanTenDirectRefsQuery();

  const {
    data: lessThan25Users,
    isLoading: lessThan25Loading,
    isSuccess: lessThan25Success,
  } = useGetUsersWithLessThan10AndGreaterThan25DirectRefsQuery();

  // Cache API responses when they're successfully loaded
  useEffect(() => {
    if (inactiveSuccess && inactiveUsers) {
      setApiDataCache((prev) => ({
        ...prev,
        inactive: inactiveUsers,
      }));
    }
  }, [inactiveSuccess, inactiveUsers]);

  useEffect(() => {
    if (lessThan10Success && lessThan10Users) {
      setApiDataCache((prev) => ({
        ...prev,
        lessThan10: lessThan10Users,
      }));
    }
  }, [lessThan10Success, lessThan10Users]);

  useEffect(() => {
    if (lessThan25Success && lessThan25Users) {
      setApiDataCache((prev) => ({
        ...prev,
        lessThan25: lessThan25Users,
      }));
    }
  }, [lessThan25Success, lessThan25Users]);

  // Toast configuration
  const toastConfig = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };

  // Report types configuration
  const reportTypes = {
    inactive: {
      title: "Inactive Users Report",
      description: "Comprehensive report of all inactive users in the system",
      data: apiDataCache.inactive?.data || [],
      loading: inactiveLoading,
      color: "red",
      bgColor: "#fd7e14",
      columns: ["S.No", "Username", "Name", "Email", "Phone", "Referred By"],
    },
    lessThan10: {
      title: "Users with less than 10 Direct Refs",
      description: "Report of users with less than 10 direct referrals",
      data: apiDataCache.lessThan10?.data || [],
      loading: lessThan10Loading,
      color: "orange",
      bgColor: "#fd7e14",
      columns: ["S.No", "Username", "Name", "Email", "Referal Count"], // Removed Phone and Referred By
    },
    lessThan25: {
      title: "Users with 10-25 Direct Refs",
      description: "Report of users with 10-25 direct referrals",
      data: apiDataCache.lessThan25?.data || [],
      loading: lessThan25Loading,
      color: "blue",
      bgColor: "#fd7e14",
      columns: ["S.No", "Username", "Name", "Email", "Referal Count"], // Removed Phone and Referred By
    },
  };

  const handleShowReport = async (reportType) => {
    try {
      setSelectedReportType(reportType);

      // Use cached data instead of refetching
      const cachedData = apiDataCache[reportType];
      const dataArray = cachedData?.data || [];

      if (!dataArray || dataArray.length === 0) {
        toast.error(
          "No data available for the selected report type.",
          toastConfig
        );
        return;
      }

      setReportData({
        data: dataArray,
        totalRecords: dataArray.length,
        generatedAt: new Date().toISOString(),
        apiMessage: cachedData?.message || "Data retrieved successfully",
      });

      setShowReportModal(true);
      toast.success("Report data loaded successfully!", toastConfig);
    } catch (error) {
      console.error("Report generation error:", error);
      toast.error("Failed to load report data. Please try again.", toastConfig);
    }
  };

  const generateMarketingReportPdf = () => {
    if (!reportData || !selectedReportType || !reportData.data) {
      console.error("Missing required data for PDF generation");
      return null;
    }

    const doc = new jsPDF();
    let yPosition = 20;
    const reportConfig = reportTypes[selectedReportType];

    // Ensure we have valid data
    const dataArray = Array.isArray(reportData.data) ? reportData.data : [];
    const totalRecords = reportData.totalRecords || dataArray.length || 0;

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
    doc.setTextColor(32, 147, 74); // #20934a
    doc.text("MARKETING REPORT", 105, yPosition, { align: "center" });
    yPosition += 15;

    // Report Type and Generation Info
    doc.setFontSize(14);
    doc.setTextColor(32, 147, 74);
    doc.text(reportConfig.title.toUpperCase(), 20, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(
      `Generated on: ${formatDate(reportData.generatedAt)}`,
      20,
      yPosition
    );
    yPosition += 8;
    doc.text(`Total Records: ${totalRecords}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Report Type: ${reportConfig.title}`, 20, yPosition);
    yPosition += 15;

    // Summary Section
    checkAddPage(30);
    doc.setFontSize(14);
    doc.setTextColor(32, 147, 74);
    doc.text("REPORT SUMMARY", 20, yPosition);
    yPosition += 10;

    const summaryData = [
      ["Metric", "Value"],
      ["Report Type", reportConfig.title || "N/A"],
      ["Total Users", totalRecords.toString()],
      ["Generated On", formatDate(reportData.generatedAt)],
      ["Generated By", "Admin Portal"],
      ["Status", "Current Data"],
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
        0: { cellWidth: 80 },
        1: { cellWidth: 80 },
      },
    });

    yPosition = doc.lastAutoTable.finalY + 15;

    // Detailed User Data
    if (dataArray && dataArray.length > 0) {
      checkAddPage(30);
      doc.setFontSize(14);
      doc.setTextColor(32, 147, 74);
      doc.text("DETAILED USER DATA", 20, yPosition);
      yPosition += 10;

      // Prepare table data based on report type
      const tableColumns = reportConfig.columns;
      const tableRows = [];

      dataArray.forEach((user, index) => {
        const row = [(index + 1).toString()]; // S.No

        // Add common fields
        row.push(user.username || "N/A"); // Username
        row.push(user.name || "N/A"); // Name
        row.push(user.email || "N/A"); // Email

        // Add conditional fields based on report type
        if (selectedReportType === "inactive") {
          row.push(user.phone ? user.phone.toString() : "N/A"); // Phone
          row.push(user.referenceId || "N/A"); // Referred By
        } else {
          //referal count
          row.push(user.refralslength ? user.refralslength.toString() : "0"); // Referal Count
        }
        // For lessThan10 and lessThan25, we don't add Phone and Referred By fields

        tableRows.push(row);
      });

      // Define column styles based on report type
      let columnStyles = {};
      if (selectedReportType === "inactive") {
        columnStyles = {
          0: { cellWidth: 15 }, // S.No
          1: { cellWidth: 30 }, // Username
          2: { cellWidth: 35 }, // Name
          3: { cellWidth: 40 }, // Email
          4: { cellWidth: 30 }, // Phone
          5: { cellWidth: 30 }, // Referred By
        };
      } else {
        // For lessThan10 and lessThan25 reports
        columnStyles = {
          0: { cellWidth: 20 }, // S.No
          1: { cellWidth: 35 }, // Username
          2: { cellWidth: 35 }, // Name
          3: { cellWidth: 50 }, // Email
          4: { cellWidth: 35 }, // Referal Count
        };
      }

      autoTable(doc, {
        head: [tableColumns],
        body: tableRows,
        startY: yPosition,
        theme: "striped",
        headStyles: {
          fillColor: [32, 147, 74],
          textColor: 255,
          fontSize: 9,
          fontStyle: "bold",
        },
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        columnStyles: columnStyles,
        didDrawPage: function (data) {
          // Add page numbers
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

    // Add report-specific insights
    if (dataArray.length > 0) {
      yPosition = doc.lastAutoTable.finalY + 15;
      checkAddPage(20);

      doc.setFontSize(14);
      doc.setTextColor(32, 147, 74);
      doc.text("INSIGHTS", 20, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      let insights = [];
      if (selectedReportType === "inactive") {
        insights = [
          `• Total inactive users identified: ${totalRecords}`,
          `• These users may require re-engagement campaigns`,
          `• Consider targeted marketing strategies to reactivate these users`,
        ];
      } else if (selectedReportType === "lessThan10") {
        insights = [
          `• ${totalRecords} users have less than 10 direct referrals`,
          `• These users may need additional support or incentives`,
          `• Consider providing referral training or bonus programs`,
        ];
      } else if (selectedReportType === "lessThan25") {
        insights = [
          `• ${totalRecords} users have between 10-25 direct referrals`,
          `• These users show moderate engagement levels`,
          `• Potential candidates for advanced training programs`,
        ];
      }

      insights.forEach((insight) => {
        checkAddPage(8);
        doc.text(insight, 20, yPosition);
        yPosition += 6;
      });
    }

    return doc;
  };

  const handlePdfGeneration = async () => {
    try {
      setPdfLoading(true);

      const pdfDoc = generateMarketingReportPdf();

      if (pdfDoc) {
        const reportConfig = reportTypes[selectedReportType];
        const timestamp = new Date().toISOString().split("T")[0];
        const filename = `${selectedReportType}-report-${timestamp}.pdf`;
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // DD/MM/YYYY format
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-GB"); // DD/MM/YYYY, HH:MM:SS format
  };

  return (
    <DashboardLayout>
      <section className="profile_section py-4">
        <div className="container-fluid">
          <div className="rounded-3 px-3 pb-4 py-4 bg-dark text-white">
            <h2 className="mb-4 text-center text-md-start">
              Marketing Reports Dashboard
            </h2>

            {/* Report Cards Grid */}
            <div className="row g-4 mb-4">
              {Object.entries(reportTypes).map(([key, config]) => (
                <div key={key} className="col-lg-4 col-md-6">
                  <div
                    className="card h-100"
                    style={{
                      backgroundColor: "#1b232d",
                      border: "1px solid #3a3a3a",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 16px rgba(0, 0, 0, 0.3)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div
                      className="card-header"
                      style={{
                        backgroundColor: config.bgColor,
                        borderBottom: "1px solid #3a3a3a",
                      }}
                    >
                      <h5 className="mb-0 text-white">{config.title}</h5>
                    </div>
                    <div className="card-body text-white d-flex flex-column">
                      <p className="text-muted mb-3 flex-grow-1">
                        {config.description}
                      </p>

                      {/* Stats */}
                      <div className="mb-3">
                        <div className="text-center">
                          <div
                            className="display-6 fw-bold mb-1"
                            style={{ color: config.bgColor }}
                          >
                            {config.loading ? (
                              <div
                                className="spinner-border spinner-border-sm"
                                role="status"
                              >
                                <span className="visually-hidden">
                                  Loading...
                                </span>
                              </div>
                            ) : (
                              config.data?.length || 0
                            )}
                          </div>
                          <small className="text-muted">Total Records</small>
                        </div>
                      </div>

                      {/* Download Button */}
                      <button
                        onClick={() => handleShowReport(key)}
                        disabled={
                          config.loading ||
                          !config.data ||
                          config.data.length === 0
                        }
                        className="btn btn-primary w-100"
                        style={{
                          backgroundColor: config.bgColor,
                          border: `1px solid ${config.bgColor}`,
                          transition: "all 0.3s ease",
                        }}
                        onMouseOver={(e) => {
                          if (!e.currentTarget.disabled) {
                            e.currentTarget.style.opacity = "0.8";
                          }
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.opacity = "1";
                        }}
                      >
                        {config.loading ? (
                          <span className="d-flex align-items-center justify-content-center">
                            <div
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                            Loading...
                          </span>
                        ) : (
                          "Generate Report PDF"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Overall Summary */}
            {/* <div className="mt-4">
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
                    backgroundColor: "#ec660f",
                    borderBottom: "1px solid #3a3a3a",
                  }}
                >
                  <h5 className="mb-0 text-white">Marketing Overview</h5>
                </div>
                <div className="card-body text-white">
                  <div className="row text-center">
                    <div className="col-md-3 mb-3">
                      <div className="text-danger fs-4 fw-bold">
                        {inactiveLoading
                          ? "..."
                          : apiDataCache.inactive?.data?.length || 0}
                      </div>
                      <small className="text-muted">Inactive Users</small>
                    </div>
                    <div className="col-md-3 mb-3">
                      <div className="text-warning fs-4 fw-bold">
                        {lessThan10Loading
                          ? "..."
                          : apiDataCache.lessThan10?.data?.length || 0}
                      </div>
                      <small className="text-muted">
                        Users with &lt;10 Refs
                      </small>
                    </div>
                    <div className="col-md-3 mb-3">
                      <div className="text-info fs-4 fw-bold">
                        {lessThan25Loading
                          ? "..."
                          : apiDataCache.lessThan25?.data?.length || 0}
                      </div>
                      <small className="text-muted">
                        Users with 10-25 Refs
                      </small>
                    </div>
                    <div className="col-md-3 mb-3">
                      <div className="text-success fs-4 fw-bold">
                        {inactiveLoading ||
                        lessThan10Loading ||
                        lessThan25Loading
                          ? "..."
                          : (apiDataCache.inactive?.data?.length || 0) +
                            (apiDataCache.lessThan10?.data?.length || 0) +
                            (apiDataCache.lessThan25?.data?.length || 0)}
                      </div>
                      <small className="text-muted">Total Records</small>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          <DetailedBusinessPerformanceReport />
        </div>
      </section>

      {/* Report Preview Modal */}
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
            {selectedReportType && reportTypes[selectedReportType].title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor: "#1b232d",
            color: "#fff",
          }}
        >
          {reportData && (
            <div>
              <h6 className="text-success mb-3">Report Ready for Download!</h6>

              {/* Report Summary */}
              <div
                className="card mb-4"
                style={{
                  backgroundColor: "#2e2e2e",
                  border: "1px solid #3a3a3a",
                }}
              >
                <div className="card-body">
                  <div className="row text-center">
                    <div className="col-md-4 mb-3">
                      <div className="text-light small">Total Records</div>
                      <div className="text-warning fw-bold fs-4">
                        {reportData.totalRecords}
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="text-light small">Report Type</div>
                      <div className="text-info fw-bold">
                        {selectedReportType &&
                          reportTypes[selectedReportType].title}
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="text-light small">Generated At</div>
                      <div className="text-success fw-bold">
                        {formatDateTime(reportData.generatedAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
              {pdfLoading ? (
                <span className="d-flex align-items-center">
                  <div
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  Generating PDF...
                </span>
              ) : (
                "📄 Download PDF Report"
              )}
            </Button>
          )}
        </Modal.Footer>
      </Modal>

    </DashboardLayout>
  );
};

export default MarketingReports;
