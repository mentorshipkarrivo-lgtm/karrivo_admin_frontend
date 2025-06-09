// import React, { useState, useEffect } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { Modal, Button } from "react-bootstrap";
// import { jsPDF } from "jspdf";
// import autoTable from "jspdf-autotable";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import DashboardLayout from "../../Layout/DashboardLayout";
// import {
//   useGetUserBusinessDirectRefsMutation,
//   useGetUserBusinessRefsExcludingMutation,
// } from "../getBusinessReportFromTo/getBusinessReportFromToApiSlice";

// const GetBusinessReportFromTo = () => {
//   const [username, setUsername] = useState("");
//   const [excludedUsernames, setExcludedUsernames] = useState([]);
//   const [excludedChainUsernames, setExcludedChainUsernames] = useState([]);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showReportModal, setShowReportModal] = useState(false);
//   const [pdfLoading, setPdfLoading] = useState(false);
//   const [reportData, setReportData] = useState(null);
//   const [activeTab, setActiveTab] = useState("direct"); // "direct" or "chain"
//   const [getRefs] = useGetUserBusinessDirectRefsMutation();
//   const [getReport] = useGetUserBusinessRefsExcludingMutation();

//   // Toast configuration
//   const toastConfig = {
//     position: "top-right",
//     autoClose: 3000,
//     hideProgressBar: false,
//     closeOnClick: true,
//     pauseOnHover: true,
//     draggable: true,
//   };

//   // Reset all states when username changes
//   const resetStates = () => {
//     setUser(null);
//     setExcludedUsernames([]);
//     setExcludedChainUsernames([]);
//     setReportData(null);
//     setShowReportModal(false);
//     setActiveTab("direct");
//   };

//   // Form validation for dates
//   const reportFormik = useFormik({
//     initialValues: {
//       fromDate: "",
//       toDate: "",
//     },
//     validationSchema: Yup.object({
//       fromDate: Yup.string().required("From date is required"),
//       toDate: Yup.string().required("To date is required"),
//     }),
//     onSubmit: async (values) => {
//       await handleGenerateReport(values);
//     },
//   });

//   const formik = useFormik({
//     initialValues: {
//       username: "",
//     },
//     validationSchema: Yup.object({
//       username: Yup.string().required("Username is required"),
//     }),
//     onSubmit: async (values) => {
//       try {
//         setLoading(true);

//         // Reset states when searching for new user
//         resetStates();

//         setUsername(values.username);
//         const res = await getRefs(values.username).unwrap();
//         setUser(res.data);
//         toast.success("User referrals fetched successfully!", toastConfig);
//       } catch (error) {
//         console.error("Fetch error:", error);
//         toast.error(
//           "Failed to fetch direct referrals. Please try again.",
//           toastConfig
//         );
//         // Reset states on error as well
//         resetStates();
//       } finally {
//         setLoading(false);
//       }
//     },
//   });

//   // Reset states when username input changes
//   useEffect(() => {
//     if (formik.values.username !== username) {
//       resetStates();
//     }
//   }, [formik.values.username, username]);

//   const toggleExcluded = (username) => {
//     setExcludedUsernames((prev) =>
//       prev.includes(username)
//         ? prev.filter((u) => u !== username)
//         : [...prev, username]
//     );
//   };

//   const toggleExcludedChain = (username) => {
//     setExcludedChainUsernames((prev) =>
//       prev.includes(username)
//         ? prev.filter((u) => u !== username)
//         : [...prev, username]
//     );
//   };

//   const handleShowReport = () => {
//     if (!user) return;
//     // Reset report data when opening modal for new report
//     setReportData(null);
//     reportFormik.resetForm();
//     setShowReportModal(true);
//   };

//   const handleGenerateReport = async (values) => {
//     try {
//       setLoading(true);

//       const payload = {
//         username: username,
//         excludedDirectRefs: excludedUsernames || [],
//         excludedChainRefs: excludedChainUsernames || [],
//         fromDate: values.fromDate,
//         toDate: values.toDate,
//       };
//       console.log("Full payload object:", payload);
//       console.log("excludedChainUsernames state:", excludedChainUsernames);
//       console.log("excludedUsernames state:", excludedUsernames);
//       console.log("Payload keys:", Object.keys(payload));
//       console.log("Payload excludedChainRefs:", payload.excludedChainRefs);

//       console.log("Payload being sent:", payload);

//       const response = await getReport(payload).unwrap();

//       setReportData(response);
//       console.log("Report data:", response);
//       toast.success("Report generated successfully!", toastConfig);
//     } catch (error) {
//       console.error("Report generation error:", error);
//       toast.error("Failed to generate report. Please try again.", toastConfig);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const generateBusinessReportPdf = () => {
//     if (!user || !reportData) return null;

//     const doc = new jsPDF();
//     let yPosition = 20;

//     // Helper function to add new page if needed
//     const checkAddPage = (requiredSpace = 20) => {
//       if (yPosition + requiredSpace > doc.internal.pageSize.height - 20) {
//         doc.addPage();
//         yPosition = 20;
//         return true;
//       }
//       return false;
//     };

//     // Header
//     doc.setFontSize(18);
//     doc.setTextColor(32, 147, 74); // #20934a
//     doc.text("BUSINESS REPORT", 105, yPosition, { align: "center" });
//     yPosition += 15;

//     // User Information Section
//     doc.setFontSize(14);
//     doc.setTextColor(32, 147, 74); // #20934a
//     doc.text("USER INFORMATION", 20, yPosition);
//     yPosition += 10;

//     doc.setFontSize(10);
//     doc.setTextColor(0, 0, 0);

//     const userInfo = [
//       [`Name: ${user.name}`, `Email: ${user.email}`],
//       [
//         `Phone: ${user.phone}`,
//         `TotalBusiness: ${reportData.data.totalBusiness}`,
//       ],
//     ];

//     userInfo.forEach((row) => {
//       checkAddPage();
//       doc.text(row[0], 20, yPosition);
//       doc.text(row[1], 105, yPosition);
//       yPosition += 6;
//     });

//     yPosition += 5;

//     // Business Summary Section (only if values exist)
//     if (shouldShowBusinessSummary(user)) {
//       checkAddPage(30);
//       doc.setFontSize(14);
//       doc.setTextColor(32, 147, 74); // #20934a
//       doc.text("BUSINESS SUMMARY", 20, yPosition);
//       yPosition += 10;

//       const businessData = [
//         ["Metric", "Amount (INR)"],
//         ["Direct Business", formatCurrency(user.directuserbisness || 0)],
//         ["Chain Business", formatCurrency(user.chainUserBusiness || 0)],
//         ["Total Business", formatCurrency(user.totalBusiness || 0)],
//       ];

//       autoTable(doc, {
//         head: [businessData[0]],
//         body: businessData.slice(1),
//         startY: yPosition,
//         theme: "striped",
//         headStyles: {
//           fillColor: [32, 147, 74], // #20934a
//           textColor: 255,
//           fontSize: 10,
//           fontStyle: "bold",
//         },
//         styles: {
//           fontSize: 9,
//           cellPadding: 3,
//         },
//         columnStyles: {
//           0: { cellWidth: 60 },
//           1: { cellWidth: 80, halign: "right" },
//         },
//       });

//       yPosition = doc.lastAutoTable.finalY + 10;
//     }

//     // Report Period
//     checkAddPage();
//     doc.setFontSize(14);
//     doc.setTextColor(32, 147, 74); // #20934a
//     doc.text("REPORT PERIOD", 20, yPosition);
//     yPosition += 8;

//     doc.setFontSize(10);
//     doc.setTextColor(0, 0, 0);
//     doc.text(
//       `From: ${formatDate(reportFormik.values.fromDate)} | To: ${formatDate(
//         reportFormik.values.toDate
//       )}`,
//       20,
//       yPosition
//     );
//     yPosition += 10;

//     // Report Details Section
//     checkAddPage();
//     doc.setFontSize(14);
//     doc.setTextColor(32, 147, 74); // #20934a
//     doc.text("REPORT DETAILS", 20, yPosition);
//     yPosition += 10;

//     const reportDetails = [
//       ["Metric", "Value"],
//       ["Direct User Business", reportData?.data.directuserbisness || 0],
//       ["Chain User Business", reportData?.data.chainUserBusiness || 0],
//       ["Total Business", reportData?.data.totalBusiness || 0],
//     ];

//     autoTable(doc, {
//       head: [reportDetails[0]],
//       body: reportDetails.slice(1),
//       startY: yPosition,
//       theme: "striped",
//       headStyles: {
//         fillColor: [32, 147, 74], // #20934a
//         textColor: 255,
//         fontSize: 10,
//         fontStyle: "bold",
//       },
//       styles: {
//         fontSize: 9,
//         cellPadding: 3,
//       },
//       columnStyles: {
//         0: { cellWidth: 80 },
//         1: { cellWidth: 80 },
//       },
//     });

//     // Direct Referrals Business Details (if available)
//     if (reportData.data?.directReferralsBusiness?.details?.length > 0) {
//       yPosition = doc.lastAutoTable.finalY + 15;
//       checkAddPage(30);

//       doc.setFontSize(14);
//       doc.setTextColor(32, 147, 74); // #20934a
//       doc.text("DIRECT REFERRALS BUSINESS DETAILS", 20, yPosition);
//       yPosition += 10;

//       const tableColumns = [
//         "S.No",
//         "Name",
//         "Username",
//         "Email",
//         "Phone",
//         "Amounts",
//         "Invests",
//       ];
//       const tableRows = [];

//       reportData.data.directReferralsBusiness.details.forEach(
//         (referral, index) => {
//           tableRows.push([
//             (index + 1).toString(), // S.No
//             referral.name,
//             referral.username,
//             referral.email,
//             referral.phone,
//             referral.totalBusiness,
//             referral.transactionCount.toString(),
//           ]);
//         }
//       );

//       autoTable(doc, {
//         head: [tableColumns],
//         body: tableRows,
//         startY: yPosition,
//         theme: "striped",
//         headStyles: {
//           fillColor: [32, 147, 74], // #20934a
//           textColor: 255,
//           fontSize: 9,
//           fontStyle: "bold",
//         },
//         styles: {
//           fontSize: 8,
//           cellPadding: 2,
//         },
//         columnStyles: {
//           0: { cellWidth: 15 }, // S.No
//           1: { cellWidth: 25 }, // Name
//           2: { cellWidth: 25 }, // Username
//           3: { cellWidth: 45 }, // Email
//           4: { cellWidth: 25 }, // Phone
//           5: { cellWidth: 25 }, // Business
//           6: { cellWidth: 15 }, // Transactions
//         },
//         didDrawPage: function (data) {
//           // Add page numbers
//           let str = "Page " + doc.internal.getNumberOfPages();
//           doc.setFontSize(8);
//           doc.setTextColor(100);
//           doc.text(
//             str,
//             data.settings.margin.left,
//             doc.internal.pageSize.height - 10
//           );
//         },
//       });
//     }

//     // Chain Referrals Business Details (if available)
//     if (reportData.data?.chainReferralsBusiness?.details?.length > 0) {
//       yPosition = doc.lastAutoTable.finalY + 15;
//       checkAddPage(30);

//       doc.setFontSize(14);
//       doc.setTextColor(32, 147, 74); // #20934a
//       doc.text("CHAIN REFERRALS BUSINESS DETAILS", 20, yPosition);
//       yPosition += 10;

//       const chainTableColumns = [
//         "S.No",
//         "Name",
//         "Username",
//         "Email",
//         "Phone",
//         "Amounts",
//         "Invests",
//       ];
//       const chainTableRows = [];

//       reportData.data.chainReferralsBusiness.details.forEach(
//         (referral, index) => {
//           chainTableRows.push([
//             (index + 1).toString(), // S.No
//             referral.name,
//             referral.username,
//             referral.email,
//             referral.phone,
//             referral.totalBusiness,
//             referral.transactionCount.toString(),
//           ]);
//         }
//       );

//       autoTable(doc, {
//         head: [chainTableColumns],
//         body: chainTableRows,
//         startY: yPosition,
//         theme: "striped",
//         headStyles: {
//           fillColor: [32, 147, 74], // #20934a
//           textColor: 255,
//           fontSize: 9,
//           fontStyle: "bold",
//         },
//         styles: {
//           fontSize: 8,
//           cellPadding: 2,
//         },
//         columnStyles: {
//           0: { cellWidth: 15 }, // S.No
//           1: { cellWidth: 22 }, // Name
//           2: { cellWidth: 22 }, // Username
//           3: { cellWidth: 45 }, // Email
//           4: { cellWidth: 25 }, // Phone
//           5: { cellWidth: 25 }, // Business
//           6: { cellWidth: 15 }, // Transactions
//         },
//         didDrawPage: function (data) {
//           let str = "Page " + doc.internal.getNumberOfPages();
//           doc.setFontSize(8);
//           doc.setTextColor(100);
//           doc.text(
//             str,
//             data.settings.margin.left,
//             doc.internal.pageSize.height - 10
//           );
//         },
//       });
//     }

//     return doc;
//   };

//   const handlePdfGeneration = async () => {
//     try {
//       setPdfLoading(true);

//       // Generate PDF
//       const pdfDoc = generateBusinessReportPdf();

//       if (pdfDoc) {
//         // Save the PDF with a descriptive filename
//         const filename = `business-report-${user.name.replace(
//           /\s+/g,
//           "-"
//         )}-${formatDate(reportFormik.values.fromDate)}-to-${formatDate(
//           reportFormik.values.toDate
//         )}.pdf`;
//         pdfDoc.save(filename);

//         toast.success(
//           "PDF report generated and downloaded successfully!",
//           toastConfig
//         );
//         setShowReportModal(false);
//       } else {
//         throw new Error("Failed to generate PDF content");
//       }
//     } catch (error) {
//       console.error("PDF generation error:", error);
//       toast.error(
//         "Failed to generate PDF report. Please try again.",
//         toastConfig
//       );
//     } finally {
//       setPdfLoading(false);
//     }
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       minimumFractionDigits: 0,
//     }).format(amount);
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-IN");
//   };

//   // Helper function to check if business data should be displayed
//   const shouldShowBusinessSummary = (user) => {
//     if (!user) return false;
//     return (
//       user.directuserbisness > 0 ||
//       user.chainUserBusiness > 0 ||
//       user.totalBusiness > 0
//     );
//   };

//   const renderTable = (referrals, type) => {
//     const isChain = type === "chain";
//     const excludedList = isChain ? excludedChainUsernames : excludedUsernames;
//     const toggleFunction = isChain ? toggleExcludedChain : toggleExcluded;

//     return (
//       <div className="table-responsive mt-4">
//         <table className="table table-dark">
//           <thead>
//             <tr style={{ backgroundColor: "#2a2a2a" }}>
//               <th
//                 style={{
//                   backgroundColor: "#ec660f",
//                   fontWeight: "600",
//                   border: "1px solid #3a3a3a",
//                 }}
//               >
//                 SNo
//               </th>
//               <th
//                 style={{
//                   backgroundColor: "#ec660f",
//                   fontWeight: "600",
//                   border: "1px solid #3a3a3a",
//                 }}
//               >
//                 Username
//               </th>
//               <th
//                 style={{
//                   backgroundColor: "#ec660f",
//                   fontWeight: "600",
//                   border: "1px solid #3a3a3a",
//                 }}
//                 className="d-none d-md-table-cell"
//               >
//                 Name
//               </th>
//               <th
//                 style={{
//                   backgroundColor: "#ec660f",
//                   fontWeight: "600",
//                   border: "1px solid #3a3a3a",
//                 }}
//                 className="d-none d-lg-table-cell"
//               >
//                 Email
//               </th>
//               <th
//                 style={{
//                   backgroundColor: "#ec660f",
//                   fontWeight: "600",
//                   border: "1px solid #3a3a3a",
//                 }}
//               >
//                 Exclude?
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {referrals?.map((ref, index) => (
//               <tr
//                 key={ref._id}
//                 style={{
//                   backgroundColor: excludedList.includes(ref.username)
//                     ? "rgba(108, 117, 125, 0.3)"
//                     : "#1a1a1a",
//                   opacity: excludedList.includes(ref.username) ? 0.6 : 1,
//                   transition: "all 0.3s ease",
//                 }}
//               >
//                 <td
//                   style={{
//                     border: "1px solid #3a3a3a",
//                     color: "#fff",
//                   }}
//                 >
//                   {index + 1}
//                 </td>
//                 <td
//                   style={{
//                     border: "1px solid #3a3a3a",
//                     color: "#fff",
//                   }}
//                 >
//                   {ref.username}
//                 </td>
//                 <td
//                   style={{
//                     border: "1px solid #3a3a3a",
//                     color: "#fff",
//                   }}
//                   className="d-none d-md-table-cell"
//                 >
//                   {ref.name}
//                 </td>
//                 <td
//                   style={{
//                     border: "1px solid #3a3a3a",
//                     color: "#fff",
//                   }}
//                   className="d-none d-lg-table-cell"
//                 >
//                   {ref.email}
//                 </td>
//                 <td style={{ border: "1px solid #3a3a3a" }}>
//                   <input
//                     type="checkbox"
//                     checked={excludedList.includes(ref.username)}
//                     onChange={() => toggleFunction(ref.username)}
//                     style={{
//                       transform: "scale(1.2)",
//                       accentColor: "#ec660f",
//                     }}
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   return (
//     <DashboardLayout>
//       <section className="profile_section py-4">
//         <div className="container-fluid">
//           <div className="rounded-3 px-3 pb-4 py-4 bg-dark text-white">
//             <h2 className="mb-4 text-center text-md-start">
//               User Business Report - Excluding Selected Direct & Chain Referrals
//             </h2>

//             <form
//               onSubmit={formik.handleSubmit}
//               className="row g-3 align-items-end mb-4"
//             >
//               <div className="col-lg-4 col-md-6 col-12">
//                 <label className="form-label">Username</label>
//                 <input
//                   type="text"
//                   name="username"
//                   className="form-control"
//                   style={{
//                     backgroundColor: "#1b232d",
//                     color: "#fff",
//                     border: "1px solid #3a3a3a",
//                   }}
//                   onChange={formik.handleChange}
//                   value={formik.values.username}
//                 />
//                 {formik.errors.username && (
//                   <div className="text-danger small mt-1">
//                     {formik.errors.username}
//                   </div>
//                 )}
//               </div>
//               <div className="col-lg-2 col-md-3 col-12">
//                 <button
//                   className="btn btn-primary w-100"
//                   type="submit"
//                   disabled={loading}
//                   style={{
//                     backgroundColor: "#ec660f",
//                     border: "1px solid #ec660f",
//                     transition: "all 0.3s ease",
//                   }}
//                   onMouseOver={(e) => {
//                     e.currentTarget.style.backgroundColor = "#d25400";
//                     e.currentTarget.style.transform = "translateY(-2px)";
//                     e.currentTarget.style.boxShadow =
//                       "0 4px 8px rgba(0, 0, 0, 0.2)";
//                   }}
//                   onMouseOut={(e) => {
//                     e.currentTarget.style.backgroundColor = "#ec660f";
//                     e.currentTarget.style.transform = "translateY(0)";
//                     e.currentTarget.style.boxShadow = "none";
//                   }}
//                 >
//                   {loading ? "Loading..." : "Fetch Referrals"}
//                 </button>
//               </div>
//             </form>

//             {user && (
//               <>
//                 {user && shouldShowBusinessSummary(user) && (
//                   <>
//                     {/* User Business Summary */}
//                     <div className="mb-4">
//                       <div
//                         className="card"
//                         style={{
//                           backgroundColor: "#1b232d",
//                           border: "1px solid #3a3a3a",
//                         }}
//                       >
//                         <div
//                           className="card-header"
//                           style={{
//                             backgroundColor: "#ec660f",
//                             borderBottom: "1px solid #3a3a3a",
//                           }}
//                         >
//                           <h5 className="mb-0 text-white">
//                             Business Summary - {user.name}
//                           </h5>
//                         </div>
//                         <div className="card-body text-white">
//                           <div className="row">
//                             <div className="col-md-4 mb-2">
//                               <small className="text-muted">Email:</small>
//                               <div>{user.email}</div>
//                             </div>
//                             <div className="col-md-4 mb-2">
//                               <small className="text-muted">Phone:</small>
//                               <div>{user.phone}</div>
//                             </div>
//                             <div className="col-md-4 mb-2">
//                               <small className="text-muted">
//                                 Direct Business:
//                               </small>
//                               <div className="text-success fw-bold">
//                                 {formatCurrency(user.directuserbisness || 0)}
//                               </div>
//                             </div>
//                             <div className="col-md-4 mb-2">
//                               <small className="text-muted">
//                                 Chain Business:
//                               </small>
//                               <div className="text-info fw-bold">
//                                 {formatCurrency(user.chainUserBusiness || 0)}
//                               </div>
//                             </div>
//                             <div className="col-md-4 mb-2">
//                               <small className="text-muted">
//                                 Total Business:
//                               </small>
//                               <div className="text-warning fw-bold">
//                                 {formatCurrency(user.totalBusiness || 0)}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </>
//                 )}

//                 {/* Tab Navigation Section */}
//                 <div className="mb-3">
//                   <div className="d-flex justify-content-between align-items-end mb-3">
//                     <ul
//                       className="nav nav-tabs mb-0"
//                       style={{ borderBottom: "2px solid #3a3a3a" }}
//                     >
//                       <li className="nav-item">
//                         <button
//                           className={`nav-link ${
//                             activeTab === "direct" ? "active" : ""
//                           }`}
//                           onClick={() => setActiveTab("direct")}
//                           style={{
//                             backgroundColor:
//                               activeTab === "direct"
//                                 ? "#ec660f"
//                                 : "transparent",
//                             color: activeTab === "direct" ? "#fff" : "#ec660f",
//                             border: "1px solid #ec660f",
//                             borderBottom:
//                               activeTab === "direct"
//                                 ? "2px solid #ec660f"
//                                 : "1px solid #3a3a3a",
//                             borderRadius: "0",
//                           }}
//                         >
//                           Direct Referrals ({user.directReferrals?.length || 0})
//                         </button>
//                       </li>
//                       <li className="nav-item">
//                         <button
//                           className={`nav-link ${
//                             activeTab === "chain" ? "active" : ""
//                           }`}
//                           onClick={() => setActiveTab("chain")}
//                           style={{
//                             backgroundColor:
//                               activeTab === "chain" ? "#ec660f" : "transparent",
//                             color: activeTab === "chain" ? "#fff" : "#ec660f",
//                             border: "1px solid #ec660f",
//                             borderBottom:
//                               activeTab === "chain"
//                                 ? "2px solid #ec660f"
//                                 : "1px solid #3a3a3a",
//                             borderRadius: "0",
//                           }}
//                         >
//                           Chain Referrals ({user.chainReferrals?.length || 0})
//                         </button>
//                       </li>
//                     </ul>

//                     {/* Generate Report Button */}
//                     <button
//                       className="btn btn-primary px-4 py-2"
//                       onClick={handleShowReport}
//                       style={{
//                         backgroundColor: "#ec660f",
//                         border: "1px solid #ec660f",
//                         transition: "all 0.3s ease",
//                         fontWeight: "600",
//                         marginBottom: "2px", // Align with tab bottom
//                       }}
//                       onMouseOver={(e) => {
//                         e.currentTarget.style.backgroundColor = "#d25400";
//                         e.currentTarget.style.transform = "translateY(-2px)";
//                         e.currentTarget.style.boxShadow =
//                           "0 4px 8px rgba(0, 0, 0, 0.2)";
//                       }}
//                       onMouseOut={(e) => {
//                         e.currentTarget.style.backgroundColor = "#ec660f";
//                         e.currentTarget.style.transform = "translateY(0)";
//                         e.currentTarget.style.boxShadow = "none";
//                       }}
//                     >
//                       Generate Report & PDF
//                     </button>
//                   </div>
//                 </div>

//                 {/* Tab Content */}
//                 <div className="tab-content">
//                   {activeTab === "direct" && (
//                     <div className="tab-pane active">
//                       <h5 className="text-white mb-3">
//                         <span style={{ color: "#ec660f" }}>
//                           Direct Referrals
//                         </span>{" "}
//                         - Select users to exclude from report
//                       </h5>
//                       {user.directReferrals?.length > 0 ? (
//                         renderTable(user.directReferrals, "direct")
//                       ) : (
//                         <div className="text-center text-muted py-4">
//                           No direct referrals found
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {activeTab === "chain" && (
//                     <div className="tab-pane active">
//                       <h5 className="text-white mb-3">
//                         <span style={{ color: "#ec660f" }}>
//                           Chain Referrals
//                         </span>{" "}
//                         - Select users to exclude from report
//                       </h5>
//                       {user.chainReferrals?.length > 0 ? (
//                         renderTable(user.chainReferrals, "chain")
//                       ) : (
//                         <div className="text-center text-muted py-4">
//                           No chain referrals found
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//                 {/*
//                 <div className="d-flex justify-content-center justify-content-md-end mt-4">
//                   <button
//                     className="btn btn-primary px-4 py-2"
//                     onClick={handleShowReport}
//                     style={{
//                       backgroundColor: "#ec660f",
//                       border: "1px solid #ec660f",
//                       transition: "all 0.3s ease",
//                       fontWeight: "600",
//                     }}
//                     onMouseOver={(e) => {
//                       e.currentTarget.style.backgroundColor = "#d25400";
//                       e.currentTarget.style.transform = "translateY(-2px)";
//                       e.currentTarget.style.boxShadow =
//                         "0 4px 8px rgba(0, 0, 0, 0.2)";
//                     }}
//                     onMouseOut={(e) => {
//                       e.currentTarget.style.backgroundColor = "#ec660f";
//                       e.currentTarget.style.transform = "translateY(0)";
//                       e.currentTarget.style.boxShadow = "none";
//                     }}
//                   >
//                     Generate Report & PDF
//                   </button>
//                 </div> */}

//                 {/* Excluded Users Summary */}
//                 {(excludedUsernames.length > 0 ||
//                   excludedChainUsernames.length > 0) && (
//                   <div className="mt-4">
//                     <div
//                       className="card"
//                       style={{
//                         backgroundColor: "#1b232d",
//                         color: "#fff",
//                         border: "1px solid #3a3a3a",
//                       }}
//                     >
//                       <div
//                         className="card-header py-3"
//                         style={{ borderBottom: "1px solid #3a3a3a" }}
//                       >
//                         <h6 className="mb-0" style={{ color: "#ec660f" }}>
//                           Excluded Users Summary
//                         </h6>
//                       </div>
//                       <div className="card-body">
//                         {excludedUsernames.length > 0 && (
//                           <div className="mb-3">
//                             <h6 className="text-white mb-2">
//                               Direct Referrals ({excludedUsernames.length})
//                             </h6>
//                             <div className="d-flex flex-wrap gap-2">
//                               {excludedUsernames.map((username, index) => (
//                                 <span
//                                   key={index}
//                                   className="badge"
//                                   style={{
//                                     backgroundColor: "rgba(220, 53, 69, 0.2)",
//                                     color: "#dc3545",
//                                     border: "1px solid #dc3545",
//                                     padding: "6px 12px",
//                                     fontSize: "12px",
//                                   }}
//                                 >
//                                   {username}
//                                 </span>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                         {excludedChainUsernames.length > 0 && (
//                           <div className="mb-3">
//                             <h6 className="text-white mb-2">
//                               Chain Referrals ({excludedChainUsernames.length})
//                             </h6>
//                             <div className="d-flex flex-wrap gap-2">
//                               {excludedChainUsernames.map((username, index) => (
//                                 <span
//                                   key={index}
//                                   className="badge"
//                                   style={{
//                                     backgroundColor: "rgba(255, 193, 7, 0.2)",
//                                     color: "#ffc107",
//                                     border: "1px solid #ffc107",
//                                     padding: "6px 12px",
//                                     fontSize: "12px",
//                                   }}
//                                 >
//                                   {username}
//                                 </span>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Single Report Generation Modal */}
//       <Modal
//         show={showReportModal}
//         onHide={() => setShowReportModal(false)}
//         size="lg"
//         centered
//         style={{ zIndex: 1050 }}
//       >
//         <Modal.Header
//           closeButton
//           style={{
//             backgroundColor: "#1b242d",
//             borderBottom: "1px solid #3a3a3a",
//             color: "#fff",
//           }}
//         >
//           <Modal.Title style={{ color: "#ec660f" }}>
//             Generate Business Report & PDF
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body style={{ backgroundColor: "#1b242d", color: "#fff" }}>
//           {user && (
//             <>
//               {/* User Business Summary in Modal */}
//               {shouldShowBusinessSummary(user) && (
//                 <div className="mb-4">
//                   <h6 style={{ color: "#ec660f" }}>User Business Summary</h6>
//                   <div className="row g-3">
//                     <div className="col-md-4">
//                       <div
//                         className="p-3 rounded"
//                         style={{
//                           backgroundColor: "#2e2e2e",
//                           border: "1px solid #3a3a3a",
//                         }}
//                       >
//                         <div className="text-center">
//                           <div className="h5 text-white mb-1">{user.name}</div>
//                           <div className="small text-muted">{user.email}</div>
//                           <div className="small text-muted">{user.phone}</div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="col-md-8">
//                       <div className="row g-2">
//                         <div className="col-4">
//                           <div
//                             className="p-2 rounded text-center"
//                             style={{
//                               backgroundColor: "rgba(40, 167, 69, 0.1)",
//                               border: "1px solid #28a745",
//                             }}
//                           >
//                             <div className="small text-muted">
//                               Direct Business
//                             </div>
//                             <div className="fw-bold text-success">
//                               {formatCurrency(user.directuserbisness || 0)}
//                             </div>
//                           </div>
//                         </div>
//                         <div className="col-4">
//                           <div
//                             className="p-2 rounded text-center"
//                             style={{
//                               backgroundColor: "rgba(23, 162, 184, 0.1)",
//                               border: "1px solid #17a2b8",
//                             }}
//                           >
//                             <div className="small text-muted">
//                               Chain Business
//                             </div>
//                             <div className="fw-bold text-info">
//                               {formatCurrency(user.chainUserBusiness || 0)}
//                             </div>
//                           </div>
//                         </div>
//                         <div className="col-4">
//                           <div
//                             className="p-2 rounded text-center"
//                             style={{
//                               backgroundColor: "rgba(255, 193, 7, 0.1)",
//                               border: "1px solid #ffc107",
//                             }}
//                           >
//                             <div className="small text-muted">
//                               Total Business
//                             </div>
//                             <div className="fw-bold text-warning">
//                               {formatCurrency(user.totalBusiness || 0)}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Excluded Users Summary in Modal */}
//               {(excludedUsernames.length > 0 ||
//                 excludedChainUsernames.length > 0) && (
//                 <div className="mb-4">
//                   <h6 style={{ color: "#ec660f" }}>Excluded Users Summary</h6>
//                   <div
//                     className="p-3 rounded"
//                     style={{
//                       backgroundColor: "#2e2e2e",
//                       border: "1px solid #3a3a3a",
//                       maxHeight: "150px",
//                       overflowY: "auto",
//                     }}
//                   >
//                     {excludedUsernames.length > 0 && (
//                       <div className="mb-3">
//                         <div className="small text-muted mb-1">
//                           Direct Referrals ({excludedUsernames.length})
//                         </div>
//                         <div className="d-flex flex-wrap gap-1">
//                           {excludedUsernames.map((username, index) => (
//                             <span
//                               key={index}
//                               className="badge"
//                               style={{
//                                 backgroundColor: "rgba(220, 53, 69, 0.3)",
//                                 color: "#dc3545",
//                                 border: "1px solid rgba(220, 53, 69, 0.5)",
//                                 padding: "3px 6px",
//                                 fontSize: "10px",
//                               }}
//                             >
//                               {username}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                     {excludedChainUsernames.length > 0 && (
//                       <div>
//                         <div className="small text-muted mb-1">
//                           Chain Referrals ({excludedChainUsernames.length})
//                         </div>
//                         <div className="d-flex flex-wrap gap-1">
//                           {excludedChainUsernames.map((username, index) => (
//                             <span
//                               key={index}
//                               className="badge"
//                               style={{
//                                 backgroundColor: "rgba(255, 193, 7, 0.3)",
//                                 color: "#ffc107",
//                                 border: "1px solid rgba(255, 193, 7, 0.5)",
//                                 padding: "3px 6px",
//                                 fontSize: "10px",
//                               }}
//                             >
//                               {username}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Date Range Selection */}
//               <div className="mb-4">
//                 <h6 style={{ color: "#ec660f" }}>
//                   Select Date Range for Report
//                 </h6>
//                 <form onSubmit={reportFormik.handleSubmit}>
//                   <div className="row g-3">
//                     <div className="col-12 col-md-6">
//                       <label htmlFor="fromDate" className="form-label">
//                         From Date
//                       </label>
//                       <input
//                         type="date"
//                         id="fromDate"
//                         name="fromDate"
//                         className={`form-control ${
//                           reportFormik.errors.fromDate &&
//                           reportFormik.touched.fromDate
//                             ? "is-invalid"
//                             : ""
//                         }`}
//                         style={{
//                           backgroundColor: "#2e2e2e",
//                           color: "#fff",
//                           border: "1px solid #3a3a3a",
//                         }}
//                         onChange={reportFormik.handleChange}
//                         value={reportFormik.values.fromDate}
//                       />
//                       {reportFormik.errors.fromDate &&
//                         reportFormik.touched.fromDate && (
//                           <div className="invalid-feedback">
//                             {reportFormik.errors.fromDate}
//                           </div>
//                         )}
//                     </div>
//                     <div className="col-12 col-md-6">
//                       <label htmlFor="toDate" className="form-label">
//                         To Date
//                       </label>
//                       <input
//                         type="date"
//                         id="toDate"
//                         name="toDate"
//                         className={`form-control ${
//                           reportFormik.errors.toDate &&
//                           reportFormik.touched.toDate
//                             ? "is-invalid"
//                             : ""
//                         }`}
//                         style={{
//                           backgroundColor: "#2e2e2e",
//                           color: "#fff",
//                           border: "1px solid #3a3a3a",
//                         }}
//                         onChange={reportFormik.handleChange}
//                         value={reportFormik.values.toDate}
//                       />
//                       {reportFormik.errors.toDate &&
//                         reportFormik.touched.toDate && (
//                           <div className="invalid-feedback">
//                             {reportFormik.errors.toDate}
//                           </div>
//                         )}
//                     </div>
//                   </div>
//                 </form>
//               </div>

//               {/* Report Data Display */}
//               {reportData && (
//                 <div className="mb-4">
//                   <h6 style={{ color: "#28a745" }}>
//                     ✅ Report Generated Successfully
//                   </h6>
//                   <div
//                     className="p-3 rounded"
//                     style={{
//                       backgroundColor: "rgba(40, 167, 69, 0.1)",
//                       border: "1px solid #28a745",
//                     }}
//                   >
//                     <div className="small text-muted">
//                       Report Period: {formatDate(reportFormik.values.fromDate)}{" "}
//                       to {formatDate(reportFormik.values.toDate)}
//                     </div>
//                     <div className="small text-success mt-1">
//                       Ready for PDF generation with compact formatting
//                     </div>
//                   </div>
//                 </div>
//               )}
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
//             onClick={() => setShowReportModal(false)}
//             style={{
//               backgroundColor: "#2e2e2e",
//               borderColor: "#3a3a3a",
//             }}
//           >
//             Close
//           </Button>
//           <Button
//             variant="primary"
//             onClick={reportFormik.handleSubmit}
//             disabled={loading}
//             style={{
//               backgroundColor: "#ec660f",
//               borderColor: "#ec660f",
//               display: "flex",
//               alignItems: "center",
//               gap: "6px",
//             }}
//           >
//             {loading ? (
//               <>
//                 <span
//                   className="spinner-border spinner-border-sm"
//                   role="status"
//                   aria-hidden="true"
//                   style={{ width: "12px", height: "12px" }}
//                 ></span>
//                 Generating...
//               </>
//             ) : (
//               <>📊 Generate Report</>
//             )}
//           </Button>
//           {reportData && (
//             <Button
//               variant="success"
//               onClick={handlePdfGeneration}
//               disabled={pdfLoading}
//               style={{
//                 backgroundColor: "#28a745",
//                 borderColor: "#28a745",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "6px",
//               }}
//             >
//               {pdfLoading ? (
//                 <>
//                   <span
//                     className="spinner-border spinner-border-sm"
//                     role="status"
//                     aria-hidden="true"
//                     style={{ width: "12px", height: "12px" }}
//                   ></span>
//                   Generating PDF...
//                 </>
//               ) : (
//                 <>📄 Export Compact PDF</>
//               )}
//             </Button>
//           )}
//         </Modal.Footer>
//       </Modal>

//       {/* Toast Container */}
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="dark"
//         style={{ zIndex: 9999 }}
//       />
//     </DashboardLayout>
//   );
// };

// export default GetBusinessReportFromTo;

// import React, { useState, useEffect } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { Modal, Button } from "react-bootstrap";
// import { jsPDF } from "jspdf";
// import autoTable from "jspdf-autotable";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import DashboardLayout from "../../Layout/DashboardLayout";
// import {
//   useGetUserBusinessDirectRefsMutation,
//   useGetUserBusinessRefsExcludingMutation,
// } from "../getBusinessReportFromTo/getBusinessReportFromToApiSlice";

// const GetBusinessReportFromTo = () => {
//   const [username, setUsername] = useState("");
//   const [excludedUsernames, setExcludedUsernames] = useState([]);
//   const [excludedChainUsernames, setExcludedChainUsernames] = useState([]);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showReportModal, setShowReportModal] = useState(false);
//   const [pdfLoading, setPdfLoading] = useState(false);
//   const [reportData, setReportData] = useState(null);
//   const [activeTab, setActiveTab] = useState("direct"); // "direct" or "chain"

//   // Search states
//   const [directSearchQuery, setDirectSearchQuery] = useState("");
//   const [chainSearchQuery, setChainSearchQuery] = useState("");

//   const [getRefs] = useGetUserBusinessDirectRefsMutation();
//   const [getReport] = useGetUserBusinessRefsExcludingMutation();

//   // Toast configuration
//   const toastConfig = {
//     position: "top-right",
//     autoClose: 3000,
//     hideProgressBar: false,
//     closeOnClick: true,
//     pauseOnHover: true,
//     draggable: true,
//   };

//   // Reset all states when username changes
//   const resetStates = () => {
//     setUser(null);
//     setExcludedUsernames([]);
//     setExcludedChainUsernames([]);
//     setReportData(null);
//     setShowReportModal(false);
//     setActiveTab("direct");
//     setDirectSearchQuery("");
//     setChainSearchQuery("");
//   };

//   // Filter functions for search
//   const filterReferrals = (referrals, searchQuery) => {
//     if (!searchQuery.trim()) return referrals;

//     const query = searchQuery.toLowerCase().trim();
//     return (
//       referrals?.filter(
//         (referral) =>
//           referral.name?.toLowerCase().includes(query) ||
//           referral.username?.toLowerCase().includes(query)
//       ) || []
//     );
//   };

//   // Get filtered referrals
//   const filteredDirectReferrals = filterReferrals(
//     user?.directReferrals,
//     directSearchQuery
//   );
//   const filteredChainReferrals = filterReferrals(
//     user?.chainReferrals,
//     chainSearchQuery
//   );

//   // Form validation for dates
//   const reportFormik = useFormik({
//     initialValues: {
//       fromDate: "",
//       toDate: "",
//     },
//     validationSchema: Yup.object({
//       fromDate: Yup.string().required("From date is required"),
//       toDate: Yup.string().required("To date is required"),
//     }),
//     onSubmit: async (values) => {
//       await handleGenerateReport(values);
//     },
//   });

//   const formik = useFormik({
//     initialValues: {
//       username: "",
//     },
//     validationSchema: Yup.object({
//       username: Yup.string().required("Username is required"),
//     }),
//     onSubmit: async (values) => {
//       try {
//         setLoading(true);

//         // Reset states when searching for new user
//         resetStates();

//         setUsername(values.username);
//         const res = await getRefs(values.username).unwrap();
//         setUser(res.data);
//         toast.success("User referrals fetched successfully!", toastConfig);
//       } catch (error) {
//         console.error("Fetch error:", error);
//         toast.error(
//           "Failed to fetch direct referrals. Please try again.",
//           toastConfig
//         );
//         // Reset states on error as well
//         resetStates();
//       } finally {
//         setLoading(false);
//       }
//     },
//   });

//   // Reset states when username input changes
//   useEffect(() => {
//     if (formik.values.username !== username) {
//       resetStates();
//     }
//   }, [formik.values.username, username]);

//   // Clear search when switching tabs
//   useEffect(() => {
//     if (activeTab === "direct") {
//       setChainSearchQuery("");
//     } else {
//       setDirectSearchQuery("");
//     }
//   }, [activeTab]);

//   const toggleExcluded = (username) => {
//     setExcludedUsernames((prev) =>
//       prev.includes(username)
//         ? prev.filter((u) => u !== username)
//         : [...prev, username]
//     );
//   };

//   const toggleExcludedChain = (username) => {
//     setExcludedChainUsernames((prev) =>
//       prev.includes(username)
//         ? prev.filter((u) => u !== username)
//         : [...prev, username]
//     );
//   };

//   const handleShowReport = () => {
//     if (!user) return;
//     // Reset report data when opening modal for new report
//     setReportData(null);
//     reportFormik.resetForm();
//     setShowReportModal(true);
//   };

//   const handleGenerateReport = async (values) => {
//     try {
//       setLoading(true);

//       const payload = {
//         username: username,
//         excludedDirectRefs: excludedUsernames || [],
//         excludedChainRefs: excludedChainUsernames || [],
//         fromDate: values.fromDate,
//         toDate: values.toDate,
//       };
//       console.log("Full payload object:", payload);
//       console.log("excludedChainUsernames state:", excludedChainUsernames);
//       console.log("excludedUsernames state:", excludedUsernames);
//       console.log("Payload keys:", Object.keys(payload));
//       console.log("Payload excludedChainRefs:", payload.excludedChainRefs);

//       console.log("Payload being sent:", payload);

//       const response = await getReport(payload).unwrap();

//       setReportData(response);
//       console.log("Report data:", response);
//       toast.success("Report generated successfully!", toastConfig);
//     } catch (error) {
//       console.error("Report generation error:", error);
//       toast.error("Failed to generate report. Please try again.", toastConfig);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const generateBusinessReportPdf = () => {
//     if (!user || !reportData) return null;

//     const doc = new jsPDF();
//     let yPosition = 20;

//     // Helper function to add new page if needed
//     const checkAddPage = (requiredSpace = 20) => {
//       if (yPosition + requiredSpace > doc.internal.pageSize.height - 20) {
//         doc.addPage();
//         yPosition = 20;
//         return true;
//       }
//       return false;
//     };

//     // Header
//     doc.setFontSize(18);
//     doc.setTextColor(32, 147, 74); // #20934a
//     doc.text("BUSINESS REPORT", 105, yPosition, { align: "center" });
//     yPosition += 15;

//     // User Information Section
//     doc.setFontSize(14);
//     doc.setTextColor(32, 147, 74); // #20934a
//     doc.text("USER INFORMATION", 20, yPosition);
//     yPosition += 10;

//     doc.setFontSize(10);
//     doc.setTextColor(0, 0, 0);

//     const userInfo = [
//       [`Name: ${user.name}`, `Email: ${user.email}`],
//       [
//         `Phone: ${user.phone}`,
//         `TotalBusiness: ${reportData.data.totalBusiness}`,
//       ],
//     ];

//     userInfo.forEach((row) => {
//       checkAddPage();
//       doc.text(row[0], 20, yPosition);
//       doc.text(row[1], 105, yPosition);
//       yPosition += 6;
//     });

//     yPosition += 5;

//     // Business Summary Section (only if values exist)
//     if (shouldShowBusinessSummary(user)) {
//       checkAddPage(30);
//       doc.setFontSize(14);
//       doc.setTextColor(32, 147, 74); // #20934a
//       doc.text("BUSINESS SUMMARY", 20, yPosition);
//       yPosition += 10;

//       const businessData = [
//         ["Metric", "Amount (INR)"],
//         ["Direct Business", formatCurrency(user.directuserbisness || 0)],
//         ["Chain Business", formatCurrency(user.chainUserBusiness || 0)],
//         ["Total Business", formatCurrency(user.totalBusiness || 0)],
//       ];

//       autoTable(doc, {
//         head: [businessData[0]],
//         body: businessData.slice(1),
//         startY: yPosition,
//         theme: "striped",
//         headStyles: {
//           fillColor: [32, 147, 74], // #20934a
//           textColor: 255,
//           fontSize: 10,
//           fontStyle: "bold",
//         },
//         styles: {
//           fontSize: 9,
//           cellPadding: 3,
//         },
//         columnStyles: {
//           0: { cellWidth: 60 },
//           1: { cellWidth: 80, halign: "right" },
//         },
//       });

//       yPosition = doc.lastAutoTable.finalY + 10;
//     }

//     // Report Period
//     checkAddPage();
//     doc.setFontSize(14);
//     doc.setTextColor(32, 147, 74); // #20934a
//     doc.text("REPORT PERIOD", 20, yPosition);
//     yPosition += 8;

//     doc.setFontSize(10);
//     doc.setTextColor(0, 0, 0);
//     doc.text(
//       `From: ${formatDate(reportFormik.values.fromDate)} | To: ${formatDate(
//         reportFormik.values.toDate
//       )}`,
//       20,
//       yPosition
//     );
//     yPosition += 10;

//     // Report Details Section
//     checkAddPage();
//     doc.setFontSize(14);
//     doc.setTextColor(32, 147, 74); // #20934a
//     doc.text("REPORT DETAILS", 20, yPosition);
//     yPosition += 10;

//     const reportDetails = [
//       ["Metric", "Value"],
//       ["Direct User Business", reportData?.data.directuserbisness || 0],
//       ["Chain User Business", reportData?.data.chainUserBusiness || 0],
//       ["Total Business", reportData?.data.totalBusiness || 0],
//     ];

//     autoTable(doc, {
//       head: [reportDetails[0]],
//       body: reportDetails.slice(1),
//       startY: yPosition,
//       theme: "striped",
//       headStyles: {
//         fillColor: [32, 147, 74], // #20934a
//         textColor: 255,
//         fontSize: 10,
//         fontStyle: "bold",
//       },
//       styles: {
//         fontSize: 9,
//         cellPadding: 3,
//       },
//       columnStyles: {
//         0: { cellWidth: 80 },
//         1: { cellWidth: 80 },
//       },
//     });

//     // Direct Referrals Business Details (if available)
//     if (reportData.data?.directReferralsBusiness?.details?.length > 0) {
//       yPosition = doc.lastAutoTable.finalY + 15;
//       checkAddPage(30);

//       doc.setFontSize(14);
//       doc.setTextColor(32, 147, 74); // #20934a
//       doc.text("DIRECT REFERRALS BUSINESS DETAILS", 20, yPosition);
//       yPosition += 10;

//       const tableColumns = [
//         "S.No",
//         "Name",
//         "Username",
//         "Email",
//         "Phone",
//         "Amounts",
//         "Invests",
//       ];
//       const tableRows = [];

//       reportData.data.directReferralsBusiness.details.forEach(
//         (referral, index) => {
//           tableRows.push([
//             (index + 1).toString(), // S.No
//             referral.name,
//             referral.username,
//             referral.email,
//             referral.phone,
//             referral.totalBusiness,
//             referral.transactionCount.toString(),
//           ]);
//         }
//       );

//       autoTable(doc, {
//         head: [tableColumns],
//         body: tableRows,
//         startY: yPosition,
//         theme: "striped",
//         headStyles: {
//           fillColor: [32, 147, 74], // #20934a
//           textColor: 255,
//           fontSize: 9,
//           fontStyle: "bold",
//         },
//         styles: {
//           fontSize: 8,
//           cellPadding: 2,
//         },
//         columnStyles: {
//           0: { cellWidth: 15 }, // S.No
//           1: { cellWidth: 25 }, // Name
//           2: { cellWidth: 25 }, // Username
//           3: { cellWidth: 45 }, // Email
//           4: { cellWidth: 25 }, // Phone
//           5: { cellWidth: 25 }, // Business
//           6: { cellWidth: 15 }, // Transactions
//         },
//         didDrawPage: function (data) {
//           // Add page numbers
//           let str = "Page " + doc.internal.getNumberOfPages();
//           doc.setFontSize(8);
//           doc.setTextColor(100);
//           doc.text(
//             str,
//             data.settings.margin.left,
//             doc.internal.pageSize.height - 10
//           );
//         },
//       });
//     }

//     // Chain Referrals Business Details (if available)
//     if (reportData.data?.chainReferralsBusiness?.details?.length > 0) {
//       yPosition = doc.lastAutoTable.finalY + 15;
//       checkAddPage(30);

//       doc.setFontSize(14);
//       doc.setTextColor(32, 147, 74); // #20934a
//       doc.text("CHAIN REFERRALS BUSINESS DETAILS", 20, yPosition);
//       yPosition += 10;

//       const chainTableColumns = [
//         "S.No",
//         "Name",
//         "Username",
//         "Email",
//         "Phone",
//         "Amounts",
//         "Invests",
//       ];
//       const chainTableRows = [];

//       reportData.data.chainReferralsBusiness.details.forEach(
//         (referral, index) => {
//           chainTableRows.push([
//             (index + 1).toString(), // S.No
//             referral.name,
//             referral.username,
//             referral.email,
//             referral.phone,
//             referral.totalBusiness,
//             referral.transactionCount.toString(),
//           ]);
//         }
//       );

//       autoTable(doc, {
//         head: [chainTableColumns],
//         body: chainTableRows,
//         startY: yPosition,
//         theme: "striped",
//         headStyles: {
//           fillColor: [32, 147, 74], // #20934a
//           textColor: 255,
//           fontSize: 9,
//           fontStyle: "bold",
//         },
//         styles: {
//           fontSize: 8,
//           cellPadding: 2,
//         },
//         columnStyles: {
//           0: { cellWidth: 15 }, // S.No
//           1: { cellWidth: 22 }, // Name
//           2: { cellWidth: 22 }, // Username
//           3: { cellWidth: 45 }, // Email
//           4: { cellWidth: 25 }, // Phone
//           5: { cellWidth: 25 }, // Business
//           6: { cellWidth: 15 }, // Transactions
//         },
//         didDrawPage: function (data) {
//           let str = "Page " + doc.internal.getNumberOfPages();
//           doc.setFontSize(8);
//           doc.setTextColor(100);
//           doc.text(
//             str,
//             data.settings.margin.left,
//             doc.internal.pageSize.height - 10
//           );
//         },
//       });
//     }

//     return doc;
//   };

//   const handlePdfGeneration = async () => {
//     try {
//       setPdfLoading(true);

//       // Generate PDF
//       const pdfDoc = generateBusinessReportPdf();

//       if (pdfDoc) {
//         // Save the PDF with a descriptive filename
//         const filename = `business-report-${user.name.replace(
//           /\s+/g,
//           "-"
//         )}-${formatDate(reportFormik.values.fromDate)}-to-${formatDate(
//           reportFormik.values.toDate
//         )}.pdf`;
//         pdfDoc.save(filename);

//         toast.success(
//           "PDF report generated and downloaded successfully!",
//           toastConfig
//         );
//         setShowReportModal(false);
//       } else {
//         throw new Error("Failed to generate PDF content");
//       }
//     } catch (error) {
//       console.error("PDF generation error:", error);
//       toast.error(
//         "Failed to generate PDF report. Please try again.",
//         toastConfig
//       );
//     } finally {
//       setPdfLoading(false);
//     }
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       minimumFractionDigits: 0,
//     }).format(amount);
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-IN");
//   };

//   // Helper function to check if business data should be displayed
//   const shouldShowBusinessSummary = (user) => {
//     if (!user) return false;
//     return (
//       user.directuserbisness > 0 ||
//       user.chainUserBusiness > 0 ||
//       user.totalBusiness > 0
//     );
//   };

//   const renderSearchBar = (
//     searchQuery,
//     setSearchQuery,
//     placeholder,
//     totalCount,
//     filteredCount
//   ) => {
//     return (
//       <div className="mb-3">
//         <div className="row align-items-center">
//           <div className="col-md-6">
//             <div className="position-relative">
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder={placeholder}
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 style={{
//                   // backgroundColor: "#2e2e2e",
//                   // color: "#fff",
//                   border: "1px solid #3a3a3a",
//                   paddingLeft: "40px",
//                 }}
//               />
//               <div
//                 className="position-absolute"
//                 style={{
//                   left: "12px",
//                   top: "50%",
//                   transform: "translateY(-50%)",
//                   color: "#6c757d",
//                 }}
//               ></div>
//             </div>
//           </div>
//           <div className="col-md-6">
//             <div className="text-end">
//               <span className="text-muted small">
//                 Showing {filteredCount} of {totalCount} referrals
//                 {searchQuery && filteredCount !== totalCount && (
//                   <span className="text-warning ms-2">(filtered)</span>
//                 )}
//               </span>
//               {searchQuery && (
//                 <button
//                   className="btn btn-sm btn-outline-secondary ms-2"
//                   onClick={() => setSearchQuery("")}
//                   style={{
//                     color: "#6c757d",
//                     borderColor: "#6c757d",
//                     fontSize: "12px",
//                     padding: "2px 8px",
//                   }}
//                 >
//                   Clear
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderTable = (referrals, type) => {
//     const isChain = type === "chain";
//     const excludedList = isChain ? excludedChainUsernames : excludedUsernames;
//     const toggleFunction = isChain ? toggleExcludedChain : toggleExcluded;

//     return (
//       <div className="table-responsive mt-4">
//         <table className="table table-dark">
//           <thead>
//             <tr style={{ backgroundColor: "#2a2a2a" }}>
//               <th
//                 style={{
//                   backgroundColor: "#ec660f",
//                   fontWeight: "600",
//                   border: "1px solid #3a3a3a",
//                 }}
//               >
//                 SNo
//               </th>
//               <th
//                 style={{
//                   backgroundColor: "#ec660f",
//                   fontWeight: "600",
//                   border: "1px solid #3a3a3a",
//                 }}
//               >
//                 Username
//               </th>
//               <th
//                 style={{
//                   backgroundColor: "#ec660f",
//                   fontWeight: "600",
//                   border: "1px solid #3a3a3a",
//                 }}
//                 className="d-none d-md-table-cell"
//               >
//                 Name
//               </th>
//               <th
//                 style={{
//                   backgroundColor: "#ec660f",
//                   fontWeight: "600",
//                   border: "1px solid #3a3a3a",
//                 }}
//                 className="d-none d-lg-table-cell"
//               >
//                 Email
//               </th>
//               <th
//                 style={{
//                   backgroundColor: "#ec660f",
//                   fontWeight: "600",
//                   border: "1px solid #3a3a3a",
//                 }}
//               >
//                 Exclude?
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {referrals?.map((ref, index) => (
//               <tr
//                 key={ref._id}
//                 style={{
//                   backgroundColor: excludedList.includes(ref.username)
//                     ? "rgba(108, 117, 125, 0.3)"
//                     : "#1a1a1a",
//                   opacity: excludedList.includes(ref.username) ? 0.6 : 1,
//                   transition: "all 0.3s ease",
//                 }}
//               >
//                 <td
//                   style={{
//                     border: "1px solid #3a3a3a",
//                     color: "#fff",
//                   }}
//                 >
//                   {index + 1}
//                 </td>
//                 <td
//                   style={{
//                     border: "1px solid #3a3a3a",
//                     color: "#fff",
//                   }}
//                 >
//                   {ref.username}
//                 </td>
//                 <td
//                   style={{
//                     border: "1px solid #3a3a3a",
//                     color: "#fff",
//                   }}
//                   className="d-none d-md-table-cell"
//                 >
//                   {ref.name}
//                 </td>
//                 <td
//                   style={{
//                     border: "1px solid #3a3a3a",
//                     color: "#fff",
//                   }}
//                   className="d-none d-lg-table-cell"
//                 >
//                   {ref.email}
//                 </td>
//                 <td style={{ border: "1px solid #3a3a3a" }}>
//                   <input
//                     type="checkbox"
//                     checked={excludedList.includes(ref.username)}
//                     onChange={() => toggleFunction(ref.username)}
//                     style={{
//                       transform: "scale(1.2)",
//                       accentColor: "#ec660f",
//                     }}
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         {referrals?.length === 0 && (
//           <div className="text-center text-muted py-4">
//             No referrals found matching your search.
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <DashboardLayout>
//       <section className="profile_section py-4">
//         <div className="container-fluid">
//           <div className="rounded-3 px-3 pb-4 py-4 bg-dark text-white">
//             <h2 className="mb-4 text-center text-md-start">
//               User Business Report - Excluding Selected Direct & Chain Referrals
//             </h2>

//             <form
//               onSubmit={formik.handleSubmit}
//               className="row g-3 align-items-end mb-4"
//             >
//               <div className="col-lg-4 col-md-6 col-12">
//                 <label className="form-label">Username</label>
//                 <input
//                   type="text"
//                   name="username"
//                   className="form-control"
//                   style={{
//                     backgroundColor: "#1b232d",
//                     color: "#fff",
//                     border: "1px solid #3a3a3a",
//                   }}
//                   onChange={formik.handleChange}
//                   value={formik.values.username}
//                 />
//                 {formik.errors.username && (
//                   <div className="text-danger small mt-1">
//                     {formik.errors.username}
//                   </div>
//                 )}
//               </div>
//               <div className="col-lg-2 col-md-3 col-12">
//                 <button
//                   className="btn btn-primary w-100"
//                   type="submit"
//                   disabled={loading}
//                   style={{
//                     backgroundColor: "#ec660f",
//                     border: "1px solid #ec660f",
//                     transition: "all 0.3s ease",
//                   }}
//                   onMouseOver={(e) => {
//                     e.currentTarget.style.backgroundColor = "#d25400";
//                     e.currentTarget.style.transform = "translateY(-2px)";
//                     e.currentTarget.style.boxShadow =
//                       "0 4px 8px rgba(0, 0, 0, 0.2)";
//                   }}
//                   onMouseOut={(e) => {
//                     e.currentTarget.style.backgroundColor = "#ec660f";
//                     e.currentTarget.style.transform = "translateY(0)";
//                     e.currentTarget.style.boxShadow = "none";
//                   }}
//                 >
//                   {loading ? "Loading..." : "Fetch Referrals"}
//                 </button>
//               </div>
//             </form>

//             {user && (
//               <>
//                 {user && shouldShowBusinessSummary(user) && (
//                   <>
//                     {/* User Business Summary */}
//                     <div className="mb-4">
//                       <div
//                         className="card"
//                         style={{
//                           backgroundColor: "#1b232d",
//                           border: "1px solid #3a3a3a",
//                         }}
//                       >
//                         <div
//                           className="card-header"
//                           style={{
//                             backgroundColor: "#ec660f",
//                             borderBottom: "1px solid #3a3a3a",
//                           }}
//                         >
//                           <h5 className="mb-0 text-white">
//                             Business Summary - {user.name}
//                           </h5>
//                         </div>
//                         <div className="card-body text-white">
//                           <div className="row">
//                             <div className="col-md-4 mb-2">
//                               <small className="text-muted">Email:</small>
//                               <div>{user.email}</div>
//                             </div>
//                             <div className="col-md-4 mb-2">
//                               <small className="text-muted">Phone:</small>
//                               <div>{user.phone}</div>
//                             </div>
//                             <div className="col-md-4 mb-2">
//                               <small className="text-muted">
//                                 Direct Business:
//                               </small>
//                               <div className="text-success fw-bold">
//                                 {formatCurrency(user.directuserbisness || 0)}
//                               </div>
//                             </div>
//                             <div className="col-md-4 mb-2">
//                               <small className="text-muted">
//                                 Chain Business:
//                               </small>
//                               <div className="text-info fw-bold">
//                                 {formatCurrency(user.chainUserBusiness || 0)}
//                               </div>
//                             </div>
//                             <div className="col-md-4 mb-2">
//                               <small className="text-muted">
//                                 Total Business:
//                               </small>
//                               <div className="text-warning fw-bold">
//                                 {formatCurrency(user.totalBusiness || 0)}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </>
//                 )}

//                 {/* Tab Navigation Section */}
//                 <div className="mb-3">
//                   <div className="d-flex flex-column d-md-flex flex-md-row  md-justify-content-start justify-content-between align-items-end mb-3">
//                     <ul
//                       className="nav nav-tabs mb-0"
//                       style={{ borderBottom: "2px solid #3a3a3a" }}
//                     >
//                       <li className="nav-item">
//                         <button
//                           className={`nav-link ${
//                             activeTab === "direct" ? "active" : ""
//                           }`}
//                           onClick={() => setActiveTab("direct")}
//                           style={{
//                             backgroundColor:
//                               activeTab === "direct"
//                                 ? "#ec660f"
//                                 : "transparent",
//                             color: activeTab === "direct" ? "#fff" : "#ec660f",
//                             border: "1px solid #ec660f",
//                             borderBottom:
//                               activeTab === "direct"
//                                 ? "2px solid #ec660f"
//                                 : "1px solid #3a3a3a",
//                             borderRadius: "0",
//                           }}
//                         >
//                           Direct Referrals ({user.directReferrals?.length || 0})
//                         </button>
//                       </li>
//                       <li className="nav-item">
//                         <button
//                           className={`nav-link ${
//                             activeTab === "chain" ? "active" : ""
//                           }`}
//                           onClick={() => setActiveTab("chain")}
//                           style={{
//                             backgroundColor:
//                               activeTab === "chain" ? "#ec660f" : "transparent",
//                             color: activeTab === "chain" ? "#fff" : "#ec660f",
//                             border: "1px solid #ec660f",
//                             borderBottom:
//                               activeTab === "chain"
//                                 ? "2px solid #ec660f"
//                                 : "1px solid #3a3a3a",
//                             borderRadius: "0",
//                           }}
//                         >
//                           Chain Referrals ({user.chainReferrals?.length || 0})
//                         </button>
//                       </li>
//                     </ul>

//                     {/* Generate Report Button */}
//                     <button
//                       className="btn btn-primary px-4 py-2 mt-2 mt-md-0 d-flex align-items-center justify-content-center"
//                       onClick={handleShowReport}
//                       style={{
//                         backgroundColor: "#ec660f",
//                         border: "1px solid #ec660f",
//                         transition: "all 0.3s ease",
//                         fontWeight: "600",
//                       }}
//                       onMouseOver={(e) => {
//                         e.currentTarget.style.backgroundColor = "#d25400";
//                         e.currentTarget.style.transform = "translateY(-2px)";
//                         e.currentTarget.style.boxShadow =
//                           "0 4px 8px rgba(0, 0, 0, 0.2)";
//                       }}
//                       onMouseOut={(e) => {
//                         e.currentTarget.style.backgroundColor = "#ec660f";
//                         e.currentTarget.style.transform = "translateY(0)";
//                         e.currentTarget.style.boxShadow = "none";
//                       }}
//                     >
//                       Generate Report
//                     </button>
//                   </div>
//                 </div>

//                 {/* Tab Content */}
//                 <div className="tab-content">
//                   {activeTab === "direct" && (
//                     <div className="tab-pane show active">
//                       {renderSearchBar(
//                         directSearchQuery,
//                         setDirectSearchQuery,
//                         "Search direct referrals by name or username...",
//                         user.directReferrals?.length || 0,
//                         filteredDirectReferrals?.length || 0
//                       )}
//                       {renderTable(filteredDirectReferrals, "direct")}
//                     </div>
//                   )}

//                   {activeTab === "chain" && (
//                     <div className="tab-pane show active">
//                       {renderSearchBar(
//                         chainSearchQuery,
//                         setChainSearchQuery,
//                         "Search chain referrals by name or username...",
//                         user.chainReferrals?.length || 0,
//                         filteredChainReferrals?.length || 0
//                       )}
//                       {renderTable(filteredChainReferrals, "chain")}
//                     </div>
//                   )}
//                 </div>

//                 {/* Summary of Excluded Users */}
//                 {(excludedUsernames.length > 0 ||
//                   excludedChainUsernames.length > 0) && (
//                   <div className="mt-4">
//                     <div
//                       className="card"
//                       style={{
//                         backgroundColor: "#1b232d",
//                         border: "1px solid #3a3a3a",
//                       }}
//                     >
//                       <div
//                         className="card-header"
//                         style={{
//                           backgroundColor: "#dc3545",
//                           borderBottom: "1px solid #3a3a3a",
//                         }}
//                       >
//                         <h6 className="mb-0 text-white">
//                           Excluded Users Summary
//                         </h6>
//                       </div>
//                       <div className="card-body text-white">
//                         <div className="row">
//                           {excludedUsernames.length > 0 && (
//                             <div className="col-md-6">
//                               <small className="text-muted">
//                                 Excluded Direct Referrals (
//                                 {excludedUsernames.length}):
//                               </small>
//                               <div className="mt-1">
//                                 {excludedUsernames.map((username, index) => (
//                                   <span
//                                     key={username}
//                                     className="badge bg-danger me-1 mb-1"
//                                   >
//                                     {username}
//                                     <button
//                                       className="btn-close btn-close-white ms-2"
//                                       style={{ fontSize: "10px" }}
//                                       onClick={() => toggleExcluded(username)}
//                                     ></button>
//                                   </span>
//                                 ))}
//                               </div>
//                             </div>
//                           )}
//                           {excludedChainUsernames.length > 0 && (
//                             <div className="col-md-6">
//                               <small className="text-muted">
//                                 Excluded Chain Referrals (
//                                 {excludedChainUsernames.length}):
//                               </small>
//                               <div className="mt-1">
//                                 {excludedChainUsernames.map(
//                                   (username, index) => (
//                                     <span
//                                       key={username}
//                                       className="badge bg-warning text-dark me-1 mb-1"
//                                     >
//                                       {username}
//                                       <button
//                                         className="btn-close ms-2"
//                                         style={{ fontSize: "10px" }}
//                                         onClick={() =>
//                                           toggleExcludedChain(username)
//                                         }
//                                       ></button>
//                                     </span>
//                                   )
//                                 )}
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Report Generation Modal */}
//       <Modal
//         show={showReportModal}
//         onHide={() => setShowReportModal(false)}
//         size="lg"
//         backdrop="static"
//         keyboard={false}
//       >
//         <Modal.Header
//           closeButton
//           style={{
//             backgroundColor: "#1b232d",
//             borderBottom: "1px solid #3a3a3a",
//           }}
//         >
//           <Modal.Title className="text-white">
//             Generate Business Report
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body
//           style={{
//             backgroundColor: "#1b232d",
//             color: "#fff",
//           }}
//         >
//           <form onSubmit={reportFormik.handleSubmit}>
//             <div className="row">
//               <div className="col-md-6 mb-3">
//                 <label className="form-label">From Date</label>
//                 <input
//                   type="date"
//                   name="fromDate"
//                   className="form-control"
//                   style={{
//                     backgroundColor: "#2e2e2e",
//                     color: "#fff",
//                     border: "1px solid #3a3a3a",
//                   }}
//                   onChange={reportFormik.handleChange}
//                   value={reportFormik.values.fromDate}
//                 />
//                 {reportFormik.errors.fromDate && (
//                   <div className="text-danger small mt-1">
//                     {reportFormik.errors.fromDate}
//                   </div>
//                 )}
//               </div>
//               <div className="col-md-6 mb-3">
//                 <label className="form-label">To Date</label>
//                 <input
//                   type="date"
//                   name="toDate"
//                   className="form-control"
//                   style={{
//                     backgroundColor: "#2e2e2e",
//                     color: "#fff",
//                     border: "1px solid #3a3a3a",
//                   }}
//                   onChange={reportFormik.handleChange}
//                   value={reportFormik.values.toDate}
//                 />
//                 {reportFormik.errors.toDate && (
//                   <div className="text-danger small mt-1">
//                     {reportFormik.errors.toDate}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Excluded Users Preview */}
//             {(excludedUsernames.length > 0 ||
//               excludedChainUsernames.length > 0) && (
//               <div className="mb-3">
//                 <h6 className="text-warning">
//                   Users to be excluded from report:
//                 </h6>
//                 <div className="row">
//                   {excludedUsernames.length > 0 && (
//                     <div className="col-md-6">
//                       <small className="text-ligth">Direct Referrals:</small>
//                       <div>
//                         {excludedUsernames.map((username) => (
//                           <span
//                             key={username}
//                             className="badge bg-danger me-1 mb-1"
//                           >
//                             {username}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                   {excludedChainUsernames.length > 0 && (
//                     <div className="col-md-6">
//                       <small className="text-ligth">Chain Referrals:</small>
//                       <div>
//                         {excludedChainUsernames.map((username) => (
//                           <span
//                             key={username}
//                             className="badge bg-warning text-dark me-1 mb-1"
//                           >
//                             {username}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Report Data Display */}
//             {reportData && (
//               <div className="mt-4">
//                 <h6 className="text-success">Report Generated Successfully!</h6>
//                 <div className="row">
//                   <div className="col-md-4">
//                     <div className="text-center">
//                       <div className="text-light small">Direct Business</div>
//                       <div className="text-success fw-bold">
//                         {formatCurrency(
//                           reportData.data?.directuserbisness || 0
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-md-4">
//                     <div className="text-center">
//                       <div className="text-light small">Chain Business</div>
//                       <div className="text-info fw-bold">
//                         {formatCurrency(
//                           reportData.data?.chainUserBusiness || 0
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-md-4">
//                     <div className="text-center">
//                       <div className="text-light small">Total Business</div>
//                       <div className="text-warning fw-bold">
//                         {formatCurrency(reportData.data?.totalBusiness || 0)}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </form>
//         </Modal.Body>
//         <Modal.Footer
//           style={{
//             backgroundColor: "#1b232d",
//             borderTop: "1px solid #3a3a3a",
//           }}
//         >
//           <Button
//             variant="secondary"
//             onClick={() => setShowReportModal(false)}
//             style={{
//               backgroundColor: "#6c757d",
//               border: "1px solid #6c757d",
//             }}
//           >
//             Close
//           </Button>
//           <Button
//             variant="primary"
//             onClick={reportFormik.handleSubmit}
//             disabled={loading}
//             style={{
//               backgroundColor: "#ec660f",
//               border: "1px solid #ec660f",
//             }}
//           >
//             {loading ? "Generating..." : "Generate Report"}
//           </Button>
//           {reportData && (
//             <Button
//               variant="success"
//               onClick={handlePdfGeneration}
//               disabled={pdfLoading}
//               style={{
//                 backgroundColor: "#20934a",
//                 border: "1px solid #20934a",
//               }}
//             >
//               {pdfLoading ? "Generating PDF..." : "📄 Download PDF"}
//             </Button>
//           )}
//         </Modal.Footer>
//       </Modal>

//       <ToastContainer />
//     </DashboardLayout>
//   );
// };

// export default GetBusinessReportFromTo;

import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Modal, Button } from "react-bootstrap";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardLayout from "../../Layout/DashboardLayout";
import {
  useGetUserBusinessDirectRefsMutation,
  useGetUserBusinessRefsExcludingMutation,
} from "../getBusinessReportFromTo/getBusinessReportFromToApiSlice";

const GetBusinessReportFromTo = () => {
  const [username, setUsername] = useState("");
  const [excludedUsernames, setExcludedUsernames] = useState([]);
  const [excludedChainUsernames, setExcludedChainUsernames] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [activeTab, setActiveTab] = useState("direct"); // "direct" or "chain"

  // Search states
  const [directSearchQuery, setDirectSearchQuery] = useState("");
  const [chainSearchQuery, setChainSearchQuery] = useState("");

  const [getRefs] = useGetUserBusinessDirectRefsMutation();
  const [getReport] = useGetUserBusinessRefsExcludingMutation();

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
    setExcludedUsernames([]);
    setExcludedChainUsernames([]);
    setReportData(null);
    setShowReportModal(false);
    setActiveTab("direct");
    setDirectSearchQuery("");
    setChainSearchQuery("");
  };

  // Filter functions for search
  const filterReferrals = (referrals, searchQuery) => {
    if (!searchQuery.trim()) return referrals;

    const query = searchQuery.toLowerCase().trim();
    return (
      referrals?.filter(
        (referral) =>
          referral.name?.toLowerCase().includes(query) ||
          referral.username?.toLowerCase().includes(query)
      ) || []
    );
  };

  // Get filtered referrals
  const filteredDirectReferrals = filterReferrals(
    user?.directReferrals,
    directSearchQuery
  );
  const filteredChainReferrals = filterReferrals(
    user?.chainReferrals,
    chainSearchQuery
  );

  // Form validation for dates
  const reportFormik = useFormik({
    initialValues: {
      fromDate: "",
      toDate: "",
    },
    validationSchema: Yup.object({
      fromDate: Yup.string().required("From date is required"),
      toDate: Yup.string().required("To date is required"),
    }),
    onSubmit: async (values) => {
      await handleGenerateReport(values);
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

        // Reset states when searching for new user
        resetStates();

        setUsername(values.username);
        const res = await getRefs(values.username).unwrap();
        setUser(res.data);
        toast.success("User referrals fetched successfully!", toastConfig);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error(
          "Failed to fetch direct referrals. Please try again.",
          toastConfig
        );
        // Reset states on error as well
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

  const toggleExcluded = (username) => {
    setExcludedUsernames((prev) =>
      prev.includes(username)
        ? prev.filter((u) => u !== username)
        : [...prev, username]
    );
  };

  const toggleExcludedChain = (username) => {
    setExcludedChainUsernames((prev) =>
      prev.includes(username)
        ? prev.filter((u) => u !== username)
        : [...prev, username]
    );
  };

  const handleShowReport = () => {
    if (!user) return;
    // Reset report data when opening modal for new report
    setReportData(null);
    reportFormik.resetForm();
    setShowReportModal(true);
  };

  const handleGenerateReport = async (values) => {
    try {
      setLoading(true);

      const payload = {
        username: username,
        excludedDirectRefs: excludedUsernames || [],
        excludedChainRefs: excludedChainUsernames || [],
        fromDate: values.fromDate,
        toDate: values.toDate,
      };
      console.log("Full payload object:", payload);
      console.log("excludedChainUsernames state:", excludedChainUsernames);
      console.log("excludedUsernames state:", excludedUsernames);
      console.log("Payload keys:", Object.keys(payload));
      console.log("Payload excludedChainRefs:", payload.excludedChainRefs);

      console.log("Payload being sent:", payload);

      const response = await getReport(payload).unwrap();

      setReportData(response);
      console.log("Report data:", response);
      toast.success("Report generated successfully!", toastConfig);
    } catch (error) {
      console.error("Report generation error:", error);
      toast.error("Failed to generate report. Please try again.", toastConfig);
    } finally {
      setLoading(false);
    }
  };

  const generateBusinessReportPdf = () => {
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
    doc.setTextColor(32, 147, 74); // #20934a
    doc.text("BUSINESS REPORT", 105, yPosition, { align: "center" });
    yPosition += 15;

    // User Information Section
    doc.setFontSize(14);
    doc.setTextColor(32, 147, 74); // #20934a
    doc.text("USER INFORMATION", 20, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    const userInfo = [
      [`Name: ${user.name}`, `Phone: ${user.phone || "N/A"}`],
      [
        `Total Business: ${reportData.data.totalBusiness}`,
        `Email: ${user.email}`,
      ],
    ];

    userInfo.forEach((row) => {
      checkAddPage();
      doc.text(row[0], 20, yPosition);
      doc.text(row[1], 105, yPosition);
      yPosition += 6;
    });

    yPosition += 5;

    // Business Summary Section (only if values exist)
    if (shouldShowBusinessSummary(user)) {
      checkAddPage(30);
      doc.setFontSize(14);
      doc.setTextColor(32, 147, 74); // #20934a
      doc.text("BUSINESS SUMMARY", 20, yPosition);
      yPosition += 10;

      const businessData = [
        ["Metric", "Amount (INR)"],
        ["Direct Business", formatCurrency(user.directuserbisness || 0)],
        ["Chain Business", formatCurrency(user.chainUserBusiness || 0)],
        ["Total Business", formatCurrency(user.totalBusiness || 0)],
      ];

      autoTable(doc, {
        head: [businessData[0]],
        body: businessData.slice(1),
        startY: yPosition,
        theme: "striped",
        headStyles: {
          fillColor: [32, 147, 74], // #20934a
          textColor: 255,
          fontSize: 10,
          fontStyle: "bold",
        },
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
        columnStyles: {
          0: { cellWidth: 60 },
          1: { cellWidth: 80, halign: "right" },
        },
      });

      yPosition = doc.lastAutoTable.finalY + 10;
    }

    // Report Period
    checkAddPage();
    doc.setFontSize(14);
    doc.setTextColor(32, 147, 74); // #20934a
    doc.text("REPORT PERIOD", 20, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(
      `From: ${formatDate(reportFormik.values.fromDate)} | To: ${formatDate(
        reportFormik.values.toDate
      )}`,
      20,
      yPosition
    );
    yPosition += 10;

    // Report Details Section
    checkAddPage();
    doc.setFontSize(14);
    doc.setTextColor(32, 147, 74); // #20934a
    doc.text("REPORT DETAILS", 20, yPosition);
    yPosition += 10;

    const reportDetails = [
      ["Metric", "Value"],
      ["Direct User Business", reportData?.data.directuserbisness || 0],
      ["Chain User Business", reportData?.data.chainUserBusiness || 0],
      ["Total Business", reportData?.data.totalBusiness || 0],
    ];

    autoTable(doc, {
      head: [reportDetails[0]],
      body: reportDetails.slice(1),
      startY: yPosition,
      theme: "striped",
      headStyles: {
        fillColor: [32, 147, 74], // #20934a
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

    // Direct Referrals Business Details (if available)
    if (reportData.data?.directReferralsBusiness?.details?.length > 0) {
      yPosition = doc.lastAutoTable.finalY + 15;
      checkAddPage(30);

      doc.setFontSize(14);
      doc.setTextColor(32, 147, 74); // #20934a
      doc.text("DIRECT REFERRALS BUSINESS DETAILS", 20, yPosition);
      yPosition += 10;

      const tableColumns = [
        "S.No",
        "Name",
        "Username",
        "Transaction Amount",
        "Payment Mode",
        "Transaction Date",
        "Invests",
      ];
      const tableRows = [];

      reportData.data.directReferralsBusiness.details.forEach(
        (referral, index) => {
          if (referral.transactions && referral.transactions.length > 0) {
            // Show all transactions for each user
            referral.transactions.forEach((transaction, transIndex) => {
              tableRows.push([
                transIndex === 0 ? (index + 1).toString() : "", // S.No only for first transaction
                transIndex === 0 ? referral.name : "", // Name only for first transaction
                transIndex === 0 ? referral.username : "", // Username only for first transaction
                transaction.transactionAmount || "N/A",
                transaction.paymentMode || "UPI",
                transaction.transactionDate
                  ? formatDate(transaction.transactionDate)
                  : "N/A",
                transIndex === 0 ? referral.transactionCount.toString() : "", // Transaction count only for first transaction
              ]);
            });
          } else {
            // If no transactions, show user info with N/A values
            tableRows.push([
              (index + 1).toString(),
              referral.name,
              referral.username,
              "N/A",
              "UPI",
              "N/A",
              referral.transactionCount.toString(),
            ]);
          }
        }
      );

      autoTable(doc, {
        head: [tableColumns],
        body: tableRows,
        startY: yPosition,
        theme: "striped",
        headStyles: {
          fillColor: [32, 147, 74], // #20934a
          textColor: 255,
          fontSize: 9,
          fontStyle: "bold",
        },
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        columnStyles: {
          0: { cellWidth: 15 }, // S.No
          1: { cellWidth: 30 }, // Name
          2: { cellWidth: 30 }, // Username
          3: { cellWidth: 30 }, // Transaction Amount
          4: { cellWidth: 25 }, // Payment Mode
          5: { cellWidth: 30 }, // Transaction Date
          6: { cellWidth: 15 }, // Transactions
        },
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

    // Chain Referrals Business Details (if available)
    if (reportData.data?.chainReferralsBusiness?.details?.length > 0) {
      yPosition = doc.lastAutoTable.finalY + 15;
      checkAddPage(30);

      doc.setFontSize(14);
      doc.setTextColor(32, 147, 74); // #20934a
      doc.text("CHAIN REFERRALS BUSINESS DETAILS", 20, yPosition);
      yPosition += 10;

      const chainTableColumns = [
        "S.No",
        "Name",
        "Username",
        "Transaction Amount",
        "Payment Mode",
        "Transaction Date",
        "Invests",
      ];
      const chainTableRows = [];

      reportData.data.chainReferralsBusiness.details.forEach(
        (referral, index) => {
          if (referral.transactions && referral.transactions.length > 0) {
            // Show all transactions for each user
            referral.transactions.forEach((transaction, transIndex) => {
              chainTableRows.push([
                transIndex === 0 ? (index + 1).toString() : "", // S.No only for first transaction
                transIndex === 0 ? referral.name : "", // Name only for first transaction
                transIndex === 0 ? referral.username : "", // Username only for first transaction
                transaction.transactionAmount || "N/A",
                transaction.paymentMode || "UPI",
                transaction.transactionDate
                  ? formatDate(transaction.transactionDate)
                  : "N/A",
                transIndex === 0 ? referral.transactionCount.toString() : "", // Transaction count only for first transaction
              ]);
            });
          } else {
            // If no transactions, show user info with N/A values
            chainTableRows.push([
              (index + 1).toString(),
              referral.name,
              referral.username,
              "N/A",
              "UPI",
              "N/A",
              referral.transactionCount.toString(),
            ]);
          }
        }
      );

      autoTable(doc, {
        head: [chainTableColumns],
        body: chainTableRows,
        startY: yPosition,
        theme: "striped",
        headStyles: {
          fillColor: [32, 147, 74], // #20934a
          textColor: 255,
          fontSize: 9,
          fontStyle: "bold",
        },
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        columnStyles: {
          0: { cellWidth: 15 }, // S.No
          1: { cellWidth: 30 }, // Name
          2: { cellWidth: 30 }, // Username
          3: { cellWidth: 30 }, // Transaction Amount
          4: { cellWidth: 25 }, // Payment Mode
          5: { cellWidth: 30 }, // Transaction Date
          6: { cellWidth: 15 }, // Transactions
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

    return doc;
  };

  const handlePdfGeneration = async () => {
    try {
      setPdfLoading(true);

      // Generate PDF
      const pdfDoc = generateBusinessReportPdf();

      if (pdfDoc) {
        // Save the PDF with a descriptive filename
        const filename = `business-report-${user.name.replace(
          /\s+/g,
          "-"
        )}-${formatDate(reportFormik.values.fromDate)}-to-${formatDate(
          reportFormik.values.toDate
        )}.pdf`;
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN");
  };

  // Helper function to check if business data should be displayed
  const shouldShowBusinessSummary = (user) => {
    if (!user) return false;
    return (
      user.directuserbisness > 0 ||
      user.chainUserBusiness > 0 ||
      user.totalBusiness > 0
    );
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
                  // backgroundColor: "#2e2e2e",
                  // color: "#fff",
                  border: "1px solid #3a3a3a",
                  paddingLeft: "40px",
                }}
              />
              <div
                className="position-absolute"
                style={{
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#6c757d",
                }}
              ></div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="text-end">
              <span className="text-muted small">
                Showing {filteredCount} of {totalCount} referrals
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

  const renderTable = (referrals, type) => {
    const isChain = type === "chain";
    const excludedList = isChain ? excludedChainUsernames : excludedUsernames;
    const toggleFunction = isChain ? toggleExcludedChain : toggleExcluded;

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
                Name
              </th>
              <th
                style={{
                  backgroundColor: "#ec660f",
                  fontWeight: "600",
                  border: "1px solid #3a3a3a",
                }}
                className="d-none d-lg-table-cell"
              >
                Email
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
            {referrals?.map((ref, index) => (
              <tr
                key={ref._id}
                style={{
                  backgroundColor: excludedList.includes(ref.username)
                    ? "rgba(108, 117, 125, 0.3)"
                    : "#1a1a1a",
                  opacity: excludedList.includes(ref.username) ? 0.6 : 1,
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
                  {ref.username}
                </td>
                <td
                  style={{
                    border: "1px solid #3a3a3a",
                    color: "#fff",
                  }}
                  className="d-none d-md-table-cell"
                >
                  {ref.name}
                </td>
                <td
                  style={{
                    border: "1px solid #3a3a3a",
                    color: "#fff",
                  }}
                  className="d-none d-lg-table-cell"
                >
                  {ref.email}
                </td>
                <td style={{ border: "1px solid #3a3a3a" }}>
                  <input
                    type="checkbox"
                    checked={excludedList.includes(ref.username)}
                    onChange={() => toggleFunction(ref.username)}
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
        {referrals?.length === 0 && (
          <div className="text-center text-muted py-4">
            No referrals found matching your search.
          </div>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <section className="profile_section py-4">
        <div className="container-fluid">
          <div className="rounded-3 px-3 pb-4 py-4 bg-dark text-white">
            <h2 className="mb-4 text-center text-md-start">
              User Business Report
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
                {user && shouldShowBusinessSummary(user) && (
                  <>
                    {/* User Business Summary */}
                    <div className="mb-4">
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
                          <h5 className="mb-0 text-white">
                            Business Summary - {user.name}
                          </h5>
                        </div>
                        <div className="card-body text-white">
                          <div className="row">
                            <div className="col-md-3 mb-2">
                              <small className="text-muted">Username:</small>
                              <div>{user.username}</div>
                            </div>
                            <div className="col-md-3 mb-2">
                              <small className="text-muted">Email:</small>
                              <div>{user.email}</div>
                            </div>
                            <div className="col-md-3 mb-2">
                              <small className="text-muted">Phone:</small>
                              <div>{user.phone}</div>
                            </div>
                            <div className="col-md-3 mb-2">
                              <small className="text-muted">
                                Direct Business:
                              </small>
                              <div className="text-success fw-bold">
                                {formatCurrency(user.directuserbisness || 0)}
                              </div>
                            </div>
                            <div className="col-md-3 mb-2">
                              <small className="text-muted">
                                Chain Business:
                              </small>
                              <div className="text-info fw-bold">
                                {formatCurrency(user.chainUserBusiness || 0)}
                              </div>
                            </div>
                            <div className="col-md-3 mb-2">
                              <small className="text-muted">
                                Total Business:
                              </small>
                              <div className="text-warning fw-bold">
                                {formatCurrency(user.totalBusiness || 0)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Tab Navigation Section */}
                <div className="mb-3">
                  <div className="d-flex flex-column d-md-flex flex-md-row  md-justify-content-start justify-content-between align-items-end mb-3">
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
                              activeTab === "direct"
                                ? "#ec660f"
                                : "transparent",
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
                      Generate Report
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
                        "Search direct referrals by name or username...",
                        user.directReferral?.length || 0,
                        filteredDirectReferrals?.length || 0
                      )}
                      {renderTable(filteredDirectReferrals, "direct")}
                    </div>
                  )}

                  {activeTab === "chain" && (
                    <div className="tab-pane show active">
                      {renderSearchBar(
                        chainSearchQuery,
                        setChainSearchQuery,
                        "Search chain referrals by name or username...",
                        user.chainReferrals?.length || 0,
                        filteredChainReferrals?.length || 0
                      )}
                      {renderTable(filteredChainReferrals, "chain")}
                    </div>
                  )}
                </div>

                {/* Summary of Excluded Users */}
                {(excludedUsernames.length > 0 ||
                  excludedChainUsernames.length > 0) && (
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
                          {excludedUsernames.length > 0 && (
                            <div className="col-md-6">
                              <small className="text-muted">
                                Excluded Direct Referrals (
                                {excludedUsernames.length}):
                              </small>
                              <div className="mt-1">
                                {excludedUsernames.map((username, index) => (
                                  <span
                                    key={username}
                                    className="badge bg-danger me-1 mb-1"
                                  >
                                    {username}
                                    <button
                                      className="btn-close btn-close-white ms-2"
                                      style={{ fontSize: "10px" }}
                                      onClick={() => toggleExcluded(username)}
                                    ></button>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {excludedChainUsernames.length > 0 && (
                            <div className="col-md-6">
                              <small className="text-muted">
                                Excluded Chain Referrals (
                                {excludedChainUsernames.length}):
                              </small>
                              <div className="mt-1">
                                {excludedChainUsernames.map(
                                  (username, index) => (
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
                                  )
                                )}
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
      </section>

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
            Generate Business Report
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor: "#1b232d",
            color: "#fff",
          }}
        >
          <form onSubmit={reportFormik.handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">From Date</label>
                <input
                  type="date"
                  name="fromDate"
                  className="form-control"
                  style={{
                    backgroundColor: "#2e2e2e",
                    color: "#fff",
                    border: "1px solid #3a3a3a",
                  }}
                  onChange={reportFormik.handleChange}
                  value={reportFormik.values.fromDate}
                />
                {reportFormik.errors.fromDate && (
                  <div className="text-danger small mt-1">
                    {reportFormik.errors.fromDate}
                  </div>
                )}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">To Date</label>
                <input
                  type="date"
                  name="toDate"
                  className="form-control"
                  style={{
                    backgroundColor: "#2e2e2e",
                    color: "#fff",
                    border: "1px solid #3a3a3a",
                  }}
                  onChange={reportFormik.handleChange}
                  value={reportFormik.values.toDate}
                />
                {reportFormik.errors.toDate && (
                  <div className="text-danger small mt-1">
                    {reportFormik.errors.toDate}
                  </div>
                )}
              </div>
            </div>

            {/* Excluded Users Preview */}
            {(excludedUsernames.length > 0 ||
              excludedChainUsernames.length > 0) && (
              <div className="mb-3">
                <h6 className="text-warning">
                  Users to be excluded from report:
                </h6>
                <div className="row">
                  {excludedUsernames.length > 0 && (
                    <div className="col-md-6">
                      <small className="text-ligth">Direct Referrals:</small>
                      <div>
                        {excludedUsernames.map((username) => (
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
                  {excludedChainUsernames.length > 0 && (
                    <div className="col-md-6">
                      <small className="text-ligth">Chain Referrals:</small>
                      <div>
                        {excludedChainUsernames.map((username) => (
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

            {/* Report Data Display */}
            {reportData && (
              <div className="mt-4">
                <h6 className="text-success">Report Generated Successfully!</h6>
                <div className="row">
                  <div className="col-md-4">
                    <div className="text-center">
                      <div className="text-light small">Direct Business</div>
                      <div className="text-success fw-bold">
                        {formatCurrency(
                          reportData.data?.directuserbisness || 0
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-center">
                      <div className="text-light small">Chain Business</div>
                      <div className="text-info fw-bold">
                        {formatCurrency(
                          reportData.data?.chainUserBusiness || 0
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-center">
                      <div className="text-light small">Total Business</div>
                      <div className="text-warning fw-bold">
                        {formatCurrency(reportData.data?.totalBusiness || 0)}
                      </div>
                    </div>
                  </div>
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
    </DashboardLayout>
  );
};

export default GetBusinessReportFromTo;
