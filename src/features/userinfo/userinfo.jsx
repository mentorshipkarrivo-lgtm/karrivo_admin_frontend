// // import React from "react";
// // import DashboardLayout from "../../Layout/DashboardLayout";
// // import { useFormik } from "formik";

// // import * as Yup from "yup";
// // const userinfo = () => {
// //   const formik = useFormik({
// //     initialValues: {
// //       username: "",
// //     },
// //     validationSchema: Yup.object({
// //       username: Yup.string().required("Username is required"),
// //     }),
// //     onSubmit: (values) => {
// //       console.log(values);
// //     },
// //   });
// //   return (
// //     <>
// //       <DashboardLayout>
// //         <section className=" py-4">
// //           <section className=" py-4 h-100">
// //             <div className="">
// //               <div className="row">
// //                 <div className="col-12">
// //                   <div className="my_total_team_data h-100 rounded-3 px-3 pb-0 py-4">
// //                     <div>
// //                       <div className="row">
// //                         <div className="col-12">
// //                           <div className="user_heading mb-4">
// //                             <h1>User Information</h1>
// //                           </div>

// //                           <div
// //                             style={{
// //                               margin: "0 auto",
// //                               maxWidth: "fit-content",
// //                             }}
// //                           >
// //                             <form
// //                               onSubmit={formik.handleSubmit}
// //                               className="d-flex"
// //                             >
// //                               <div className="">
// //                                 <label
// //                                   htmlFor="username"
// //                                   className="form-label"
// //                                 >
// //                                   Username <span className="error">*</span>
// //                                 </label>
// //                                 <input
// //                                   type="text"
// //                                   id="username"
// //                                   name="username"
// //                                   className="form-control shadow-none bg-transparent text-white w-50"
// //                                   value={formik.values.username}
// //                                   onChange={formik.handleChange}
// //                                   onBlur={formik.handleBlur}
// //                                   style={{
// //                                     width: "300px",
// //                                   }}
// //                                 />

// //                                 {formik.touched.username &&
// //                                   formik.errors.username && (
// //                                     <div className="error">
// //                                       {formik.errors.username}
// //                                     </div>
// //                                   )}
// //                               </div>
// //                               <button type="submit">Submit</button>
// //                             </form>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     </div>
// //                     <div className="table_data table-responsive">
// //                       <table className="table ">
// //                         <thead>
// //                           <tr>
// //                             <th scope="col">S.No</th>
// //                             <th scope="col">Name</th>
// //                             <th scope="col">username</th>
// //                             <th scope="col">email</th>
// //                             <th scope="col">Phone Number</th>
// //                             <th scope="col">Referred By</th>
// //                           </tr>
// //                         </thead>
// //                       </table>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </section>
// //         </section>
// //       </DashboardLayout>
// //     </>
// //   );
// // };

// // export default userinfo;
// import React, { useState, useEffect } from "react";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import { Calendar, DollarSign, Tag } from "lucide-react";
// import DashboardLayout from "../../Layout/DashboardLayout";
// import { useGetUserInfoQuery } from "./userinfoApiSlice";
// import { toast } from "react-toastify";

// function buildReferralMap(users) {
//   const map = new Map();
//   users.forEach((user) => {
//     if (user.isActive) {
//       if (!map.has(user.referenceId)) {
//         map.set(user.referenceId, []);
//       }
//       map.get(user.referenceId).push(user);
//     }
//   });
//   return map;
// }

// const Userinfo = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [referrals, setReferrals] = useState([]);
//   const [refType, setRefType] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [userDetails, setUserDetails] = useState(null);

//   // Use the API query hook with skip parameter
//   const {
//     data: userData,
//     error,
//     isLoading,
//     refetch,
//   } = useGetUserInfoQuery(searchTerm, {
//     skip: !searchTerm.trim(),
//   });
//   console.log(userData, "userData");
//   const clearAll = () => {
//     setReferrals([]);
//     setUserDetails(null);
//     setRefType("");
//   };

//   const handleDirectSearch = () => {
//     if (!searchTerm.trim()) {
//       toast("Please enter a Reference ID");
//       return;
//     }

//     setLoading(true);
//     clearAll();

//     // Trigger API call with current searchTerm
//     refetch().then(() => {
//       setRefType("direct");
//       setLoading(false);
//     });
//   };

//   const handleChainSearch = () => {
//     if (!searchTerm.trim()) {
//       toast("Please enter a Reference ID");
//       return;
//     }

//     setLoading(true);
//     clearAll();

//     // Trigger API call with current searchTerm
//     refetch().then(() => {
//       setRefType("chain");
//       setLoading(false);
//     });
//   };

//   const handleShowUserDetails = () => {
//     if (!searchTerm.trim()) {
//       toast("Please enter a Reference ID");
//       return;
//     }

//     setLoading(true);
//     clearAll();

//     // Refresh data from API
//     refetch().then(() => {
//       // User details will be updated from the useEffect
//       setLoading(false);
//     });
//   };

//   // Handle API response - process data when it changes
//   useEffect(() => {
//     if (userData) {
//       // Check for token expiration error
//       if (
//         userData.status_code === 408 &&
//         userData.message?.includes("Token expired")
//       ) {
//         toast("Session expired. Please login again.");
//         // Redirect to login page
//         // window.location.href = "/login";
//         return;
//       }

//       // If data is successfully retrieved
//       if (userData.success === 1 && userData.data) {
//         // Get the response data structure based on your description
//         const { directReferrals = [], chainReferrals = [] } = userData.data;

//         // Update referrals based on the selected type
//         if (refType === "direct") {
//           setReferrals(directReferrals);
//         } else if (refType === "chain") {
//           setReferrals(chainReferrals);
//         }

//         // If we're showing user details
//         if (!refType) {
//           // Find the user in directReferrals or calculate from the response
//           const foundUser = userData.data.user || {};

//           if (foundUser) {
//             setUserDetails({
//               ...foundUser,
//               directCount: directReferrals.length,
//               chainCount: chainReferrals.length,
//             });
//           } else {
//             toast("User not found!");
//           }
//         }
//       }
//     }
//   }, [userData, refType]);

//   const exportToExcel = () => {
//     if (!searchTerm.trim()) {
//       toast("Please enter a Reference ID");
//       return;
//     }

//     setLoading(true);

//     // Refresh data from API if needed
//     refetch().then(() => {
//       if (!userData || !userData.data) {
//         toast("No user data available");
//         setLoading(false);
//         return;
//       }

//       const { directReferrals = [], chainReferrals = [], user } = userData.data;

//       if (!user) {
//         toast("User not found!");
//         setLoading(false);
//         return;
//       }

//       const dataToExport = [];

//       dataToExport.push({
//         Name: user.name,
//         Username: user.username,
//         Phone: `${user.phone}`,
//         Email: user.email,
//         ReferralBonus: user.referenceInr,
//         DirectReferralsCount: directReferrals.length,
//         ChainReferralsCount: chainReferrals.length,
//       });

//       dataToExport.push({ Section: "" });
//       dataToExport.push({ Section: "Direct Referrals" });

//       dataToExport.push({
//         Name: "Name",
//         Username: "Username",
//         Phone: "Phone",
//         Email: "Email",
//         ReferralBonus: "Referral Bonus",
//         ReferredBy: "Referred By",
//         DirectReferalsCount: "DirectReferalsCount",
//       });

//       directReferrals.forEach((user) => {
//         dataToExport.push({
//           Name: user.name,
//           Username: user.username,
//           Phone: `${user.phone}`,
//           Email: user.email,
//           ReferralBonus: user.referenceInr,
//           ReferredBy: user.referenceId,
//           DirectReferalsCount: user.referenceCount,
//         });
//       });

//       dataToExport.push({ Section: "" });
//       dataToExport.push({ Section: "Chain Referrals" });

//       dataToExport.push({
//         Name: "Name",
//         Username: "Username",
//         Phone: "Phone",
//         Email: "Email",
//         ReferralBonus: "Referral Bonus",
//         ReferredBy: "Referred By",
//         DirectReferalsCount: "DirectReferalsCount",
//       });

//       chainReferrals.forEach((user) => {
//         dataToExport.push({
//           Name: user.name,
//           Username: user.username,
//           Phone: `${user.phone}`,
//           Email: user.email,
//           ReferralBonus: user.referenceInr,
//           ReferredBy: user.referenceId,
//           DirectReferalsCount: user.referenceCount,
//         });
//       });

//       const worksheet = XLSX.utils.json_to_sheet(dataToExport);
//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Referrals");

//       const excelBuffer = XLSX.write(workbook, {
//         bookType: "xlsx",
//         type: "array",
//       });
//       const data = new Blob([excelBuffer], {
//         type: "application/octet-stream",
//       });

//       const today = new Date().toISOString().slice(0, 10);
//       saveAs(data, `${user.name}_referrals_${today}.xlsx`);

//       setLoading(false);
//       toast("Download started successfully!");
//     });
//   };

//   // Display API loading state
//   const isPageLoading = loading || isLoading;

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   return (
//     <DashboardLayout>
//       <div
//         className="profile_section py-4"
//         style={{
//           backgroundColor: "#1b232d",
//           borderRadius: "5px",
//           overflow: "hidden",
//           marginRight: "10px",
//           marginLeft: "10px",
//         }}
//       >
//         <div className="container-fluid ">
//           <div className="container">
//             <div className=" rounded-3 p-3">
//               <div className="row justify-content-center">
//                 <div className="col-auto">
//                   <input
//                     type="text"
//                     placeholder="Enter Reference ID"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="form-control mb-3"
//                     style={{ maxWidth: "300px", textAlign: "center" }}
//                   />
//                 </div>
//               </div>
//               <div className="d-flex justify-content-center gap-3 flex-wrap">
//                 <button
//                   onClick={handleDirectSearch}
//                   className="btn text-white"
//                   style={{ backgroundColor: "#ec660f" }}
//                   disabled={isPageLoading}
//                 >
//                   Show Direct Referrals
//                 </button>
//                 <button
//                   onClick={handleChainSearch}
//                   className="btn text-white"
//                   style={{ backgroundColor: "#ec660f" }}
//                   disabled={isPageLoading}
//                 >
//                   Show Chain Referrals
//                 </button>
//                 <button
//                   onClick={handleShowUserDetails}
//                   className="btn text-white"
//                   style={{ backgroundColor: "#ec660f" }}
//                   disabled={isPageLoading}
//                 >
//                   Show Details
//                 </button>
//                 <button
//                   onClick={exportToExcel}
//                   className="btn text-white"
//                   style={{ backgroundColor: "#ec660f" }}
//                   disabled={isPageLoading}
//                 >
//                   Download XLSX
//                 </button>
//               </div>

//               {/* Display API error message */}
//               {error && (
//                 <div className="alert alert-danger mt-3 text-center">
//                   Error loading data. Please try again.
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="container" style={{ backgroundColor: "#1b242d" }}>
//           {isPageLoading ? (
//             <div
//               className="d-flex justify-content-center align-items-center"
//               style={{ height: "240px" }}
//             >
//               <div className="spinner-border text-warning" role="status">
//                 <span className="visually-hidden">Loading...</span>
//               </div>
//             </div>
//           ) : (
//             <>
//               {userDetails && (
//                 <div className="d-flex justify-content-center">
//                   <div
//                     className="alert alert-info mt-4 p-4 w-100"
//                     style={{
//                       backgroundColor: "#1b242d",
//                       color: "#fff",
//                       maxWidth: "500px",
//                     }}
//                   >
//                     <h4
//                       className="text-center mb-4"
//                       style={{ color: "#ec660f" }}
//                     >
//                       User Details
//                     </h4>
//                     <ul className="list-unstyled mb-0">
//                       <li className="mb-2">
//                         <strong>Name:</strong> {userDetails.name}
//                       </li>
//                       <li className="mb-2">
//                         <strong>Username :</strong> {userDetails.username}
//                       </li>
//                       <li className="mb-2">
//                         <strong>Phone :</strong> {userDetails.phone}
//                       </li>
//                       <li className="mb-2">
//                         <strong>Email :</strong> {userDetails.email}
//                       </li>
//                       <li className="mb-2">
//                         <strong>Referral Bonus :</strong> ₹
//                         {userDetails.referenceInr}
//                       </li>
//                       <li className="mb-2">
//                         <strong>Direct Referrals :</strong>{" "}
//                         {userDetails.directCount}
//                       </li>
//                       <li>
//                         <strong>Chain Referrals :</strong>{" "}
//                         {userDetails.chainCount}
//                       </li>
//                     </ul>
//                     <p
//                       className="text-center mt-2 text-xl font-medium"
//                       style={{ color: "#ec660f" }}
//                     >
//                       First Three Purchases
//                     </p>

//                     {/* Summary stats */}
//                     <div className="row mt-4 mb-6">
//                       <div className="col-6">
//                         <div
//                           className="p-3 text-center rounded"
//                           style={{ backgroundColor: "#2e2e2e" }}
//                         >
//                           <p
//                             className="text-sm font-medium"
//                             style={{ color: "#ec660f" }}
//                           >
//                             Total Amount
//                           </p>
//                           <p className="text-xl font-bold text-white">
//                             {userDetails.firstThreePurchases
//                               .reduce(
//                                 (sum, purchase) => sum + purchase.amount,
//                                 0
//                               )
//                               .toLocaleString()}{" "}
//                             INR
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
//                             Total Tokens
//                           </p>
//                           <p className="text-xl font-bold text-white">
//                             {userDetails.firstThreePurchases
//                               .reduce(
//                                 (sum, purchase) => sum + purchase.jaimax,
//                                 0
//                               )
//                               .toLocaleString()}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Table - Updated styling to match the cards */}
//                     <div className="table-responsive mt-4">
//                       <table
//                         className="table table-bordered"
//                         style={{
//                           backgroundColor: "#2e2e2e",
//                           borderColor: "#3a3a3a",
//                         }}
//                       >
//                         <thead style={{ backgroundColor: "#ec660f" }}>
//                           <tr className="text-light">
//                             <th className="text-center p-2">Purchase</th>
//                             <th className="text-center p-2">Date</th>
//                             <th className="text-center p-2">Amount</th>
//                             <th className="text-center p-2">JAIMAX Tokens</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {userDetails.firstThreePurchases?.map(
//                             (purchase, index) => (
//                               <tr
//                                 key={index}
//                                 style={{
//                                   backgroundColor: "#2e2e2e",
//                                   color: "#fff",
//                                 }}
//                               >
//                                 <td className="p-2 text-center">
//                                   <span className="text-uppercase">
//                                     {index + 1}
//                                   </span>
//                                 </td>
//                                 <td className="p-2 text-center">
//                                   {formatDate(purchase.createdAt)}
//                                 </td>
//                                 <td className="p-2 text-center">
//                                   {purchase.amount.toLocaleString()}{" "}
//                                   {purchase.currency}
//                                 </td>
//                                 <td className="p-2 text-center">
//                                   {purchase.jaimax.toLocaleString()}
//                                 </td>
//                               </tr>
//                             )
//                           )}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {referrals.length > 0 && (
//                 <div className="table-responsive p-3">
//                   <table
//                     className="table table-bordered table-dark"
//                     style={{ backgroundColor: "#1b242d" }}
//                   >
//                     <thead style={{ backgroundColor: "#ec660f" }}>
//                       <tr className="text-light">
//                         <th
//                           className="text-center p-3"
//                           style={{ backgroundColor: "#ec660f" }}
//                         >
//                           S.No
//                         </th>
//                         <th
//                           className="text-center p-3"
//                           style={{ backgroundColor: "#ec660f" }}
//                         >
//                           Name
//                         </th>
//                         {refType === "direct" && (
//                           <th
//                             className="text-center p-3"
//                             style={{ backgroundColor: "#ec660f" }}
//                           >
//                             Username
//                           </th>
//                         )}
//                         <th
//                           className="text-center p-3"
//                           style={{ backgroundColor: "#ec660f" }}
//                         >
//                           Phone
//                         </th>
//                         <th
//                           className="text-center p-3"
//                           style={{ backgroundColor: "#ec660f" }}
//                         >
//                           Email
//                         </th>
//                         <th
//                           className="text-center p-3"
//                           style={{ backgroundColor: "#ec660f" }}
//                         >
//                           Referral Bonus
//                         </th>
//                         <th
//                           className="text-center p-3"
//                           style={{ backgroundColor: "#ec660f" }}
//                         >
//                           Username
//                         </th>
//                         <th
//                           className="text-center p-3"
//                           style={{ backgroundColor: "#ec660f" }}
//                         >
//                           Ditrect Refreals
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {referrals.map((user, index) => (
//                         <tr
//                           key={index}
//                           style={{ backgroundColor: "#2e2e2e", color: "#fff" }}
//                           onMouseEnter={(e) =>
//                             (e.currentTarget.style.backgroundColor = "#444")
//                           }
//                           onMouseLeave={(e) =>
//                             (e.currentTarget.style.backgroundColor = "#2e2e2e")
//                           }
//                         >
//                           <td className="text-center p-3">{index + 1}</td>
//                           <td className="p-3">{user.name}</td>
//                           {refType === "direct" && (
//                             <td className="p-3">{user.username}</td>
//                           )}
//                           <td className="p-3">{user.phone}</td>
//                           <td className="p-3">{user.email}</td>
//                           <td className="p-3">{user.referenceInr}</td>
//                           <td className="p-3">{user.username}</td>
//                           <td className="p-3">{user.referenceCount}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default Userinfo;

// import React, { useState, useEffect } from "react";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import { Calendar, DollarSign, Tag } from "lucide-react";
// import DashboardLayout from "../../Layout/DashboardLayout";
// import { useGetUserInfoQuery } from "./userinfoApiSlice";
// import { toast } from "react-toastify";
// import "./userinfopurchasemodal.css";
// import { Modal, Button } from "react-bootstrap";

// function buildReferralMap(users) {
//   const map = new Map();
//   users.forEach((user) => {
//     if (user.isActive) {
//       if (!map.has(user.referenceId)) {
//         map.set(user.referenceId, []);
//       }
//       map.get(user.referenceId).push(user);
//     }
//   });
//   return map;
// }

// const Userinfo = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [referrals, setReferrals] = useState([]);
//   const [refType, setRefType] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [userDetails, setUserDetails] = useState(null);

//   // Modal state
//   const [showModal, setShowModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);

//   // Use the API query hook with skip parameter
//   const {
//     data: userData,
//     error,
//     isLoading,
//     refetch,
//   } = useGetUserInfoQuery(searchTerm, {
//     skip: !searchTerm.trim(),
//   });
//   console.log(userData, "userData");
//   const clearAll = () => {
//     setReferrals([]);
//     setUserDetails(null);
//     setRefType("");
//   };

//   // Function to show user details in modal
//   const showUserPurchases = (user) => {
//     setSelectedUser(user);
//     setShowModal(true);
//   };

//   const handleDirectSearch = () => {
//     if (!searchTerm.trim()) {
//       toast("Please enter a Reference ID");
//       return;
//     }

//     setLoading(true);
//     clearAll();

//     // Trigger API call with current searchTerm
//     refetch().then(() => {
//       setRefType("direct");
//       setLoading(false);
//     });
//   };

//   const handleChainSearch = () => {
//     if (!searchTerm.trim()) {
//       toast("Please enter a Reference ID");
//       return;
//     }

//     setLoading(true);
//     clearAll();

//     // Trigger API call with current searchTerm
//     refetch().then(() => {
//       setRefType("chain");
//       setLoading(false);
//     });
//   };

//   const handleShowUserDetails = () => {
//     if (!searchTerm.trim()) {
//       toast("Please enter a Reference ID");
//       return;
//     }

//     setLoading(true);
//     clearAll();

//     // Refresh data from API
//     refetch().then(() => {
//       // User details will be updated from the useEffect
//       setLoading(false);
//     });
//   };

//   // Handle API response - process data when it changes
//   useEffect(() => {
//     if (userData) {
//       // Check for token expiration error
//       if (
//         userData.status_code === 408 &&
//         userData.message?.includes("Token expired")
//       ) {
//         toast("Session expired. Please login again.");
//         // Redirect to login page
//         // window.location.href = "/login";
//         return;
//       }

//       // If data is successfully retrieved
//       if (userData.success === 1 && userData.data) {
//         // Get the response data structure based on your description
//         const { directReferrals = [], chainReferrals = [] } = userData.data;

//         // Update referrals based on the selected type
//         if (refType === "direct") {
//           // Make sure to include purchase information for each referral if available
//           setReferrals(
//             directReferrals.map((referral) => ({
//               ...referral,
//               // Ensure firstThreePurchases exists with default empty array if not present
//               firstThreePurchases: referral.firstThreePurchases || [],
//             }))
//           );
//         } else if (refType === "chain") {
//           setReferrals(
//             chainReferrals.map((referral) => ({
//               ...referral,
//               // Ensure firstThreePurchases exists with default empty array if not present
//               firstThreePurchases: referral.firstThreePurchases || [],
//             }))
//           );
//         }

//         // If we're showing user details
//         if (!refType) {
//           // Find the user in directReferrals or calculate from the response
//           const foundUser = userData.data.user || {};

//           if (foundUser) {
//             setUserDetails({
//               ...foundUser,
//               directCount: directReferrals.length,
//               chainCount: chainReferrals.length,
//               // Ensure firstThreePurchases exists with default empty array if not present
//               firstThreePurchases: foundUser.firstThreePurchases || [],
//             });
//           } else {
//             toast("User not found!");
//           }
//         }
//       }
//     }
//   }, [userData, refType]);

//   // const exportToExcel = () => {
//   //   if (!searchTerm.trim()) {
//   //     toast("Please enter a Reference ID");
//   //     return;
//   //   }

//   //   setLoading(true);

//   //   // Refresh data from API if needed
//   //   refetch().then(() => {
//   //     if (!userData || !userData.data) {
//   //       toast("No user data available");
//   //       setLoading(false);
//   //       return;
//   //     }

//   //     const { directReferrals = [], chainReferrals = [], user } = userData.data;

//   //     if (!user) {
//   //       toast("User not found!");
//   //       setLoading(false);
//   //       return;
//   //     }

//   //     const dataToExport = [];

//   //     dataToExport.push({
//   //       Name: user.name,
//   //       Username: user.username,
//   //       Phone: `${user.phone}`,
//   //       Email: user.email,
//   //       ReferralBonus: user.referenceInr,
//   //       DirectReferralsCount: directReferrals.length,
//   //       ChainReferralsCount: chainReferrals.length,
//   //     });

//   //     // Add user purchases
//   //     if (user.firstThreePurchases && user.firstThreePurchases.length > 0) {
//   //       dataToExport.push({ Section: "Main User Purchases" });

//   //       dataToExport.push({
//   //         Purchase: "#",
//   //         Date: "Date",
//   //         Amount: "Amount",
//   //         Currency: "Currency",
//   //         JAIMAXTokens: "JAIMAX Tokens",
//   //       });

//   //       user.firstThreePurchases.forEach((purchase, index) => {
//   //         dataToExport.push({
//   //           Purchase: index + 1,
//   //           Date: formatDate(purchase.createdAt),
//   //           Amount: purchase.amount,
//   //           Currency: purchase.currency,
//   //           JAIMAXTokens: purchase.jaimax,
//   //         });
//   //       });
//   //     }

//   //     dataToExport.push({ Section: "" });
//   //     dataToExport.push({ Section: "Direct Referrals" });

//   //     dataToExport.push({
//   //       Name: "Name",
//   //       Username: "Username",
//   //       Phone: "Phone",
//   //       Email: "Email",
//   //       ReferralBonus: "Referral Bonus",
//   //       ReferredBy: "Referred By",
//   //       DirectReferalsCount: "DirectReferalsCount",
//   //     });

//   //     directReferrals.forEach((user) => {
//   //       dataToExport.push({
//   //         Name: user.name,
//   //         Username: user.username,
//   //         Phone: `${user.phone}`,
//   //         Email: user.email,
//   //         ReferralBonus: user.referenceInr,
//   //         ReferredBy: user.referenceId,
//   //         DirectReferalsCount: user.referenceCount,
//   //       });

//   //       // Add purchases for this direct referral if available
//   //       if (user.firstThreePurchases && user.firstThreePurchases.length > 0) {
//   //         dataToExport.push({ Section: `${user.name}'s Purchases` });

//   //         dataToExport.push({
//   //           Purchase: "#",
//   //           Date: "Date",
//   //           Amount: "Amount",
//   //           Currency: "Currency",
//   //           JAIMAXTokens: "JAIMAX Tokens",
//   //         });

//   //         user.firstThreePurchases.forEach((purchase, index) => {
//   //           dataToExport.push({
//   //             Purchase: index + 1,
//   //             Date: formatDate(purchase.createdAt),
//   //             Amount: purchase.amount,
//   //             Currency: purchase.currency,
//   //             JAIMAXTokens: purchase.jaimax,
//   //           });
//   //         });

//   //         dataToExport.push({ Section: "" });
//   //       }
//   //     });

//   //     dataToExport.push({ Section: "" });
//   //     dataToExport.push({ Section: "Chain Referrals" });

//   //     dataToExport.push({
//   //       Name: "Name",
//   //       Username: "Username",
//   //       Phone: "Phone",
//   //       Email: "Email",
//   //       ReferralBonus: "Referral Bonus",
//   //       ReferredBy: "Referred By",
//   //       DirectReferalsCount: "DirectReferalsCount",
//   //     });

//   //     chainReferrals.forEach((user) => {
//   //       dataToExport.push({
//   //         Name: user.name,
//   //         Username: user.username,
//   //         Phone: `${user.phone}`,
//   //         Email: user.email,
//   //         ReferralBonus: user.referenceInr,
//   //         ReferredBy: user.referenceId,
//   //         DirectReferalsCount: user.referenceCount,
//   //       });

//   //       // Add purchases for this chain referral if available
//   //       if (user.firstThreePurchases && user.firstThreePurchases.length > 0) {
//   //         dataToExport.push({ Section: `${user.name}'s Purchases` });

//   //         dataToExport.push({
//   //           Purchase: "#",
//   //           Date: "Date",
//   //           Amount: "Amount",
//   //           Currency: "Currency",
//   //           JAIMAXTokens: "JAIMAX Tokens",
//   //         });

//   //         user.firstThreePurchases.forEach((purchase, index) => {
//   //           dataToExport.push({
//   //             Purchase: index + 1,
//   //             Date: formatDate(purchase.createdAt),
//   //             Amount: purchase.amount,
//   //             Currency: purchase.currency,
//   //             JAIMAXTokens: purchase.jaimax,
//   //           });
//   //         });

//   //         dataToExport.push({ Section: "" });
//   //       }
//   //     });

//   //     const worksheet = XLSX.utils.json_to_sheet(dataToExport);
//   //     const workbook = XLSX.utils.book_new();
//   //     XLSX.utils.book_append_sheet(workbook, worksheet, "Referrals");

//   //     const excelBuffer = XLSX.write(workbook, {
//   //       bookType: "xlsx",
//   //       type: "array",
//   //     });
//   //     const data = new Blob([excelBuffer], {
//   //       type: "application/octet-stream",
//   //     });

//   //     const today = new Date().toISOString().slice(0, 10);
//   //     saveAs(data, `${user.name}_referrals_${today}.xlsx`);

//   //     setLoading(false);
//   //     toast("Download started successfully!");
//   //   });
//   // };

//   const exportToExcel = () => {
//     if (!searchTerm.trim()) {
//       toast("Please enter a Reference ID");
//       return;
//     }

//     setLoading(true);

//     // Refresh data from API
//     refetch().then(() => {
//       if (!userData || !userData.data) {
//         toast("No user data available");
//         setLoading(false);
//         return;
//       }

//       const { directReferrals = [], chainReferrals = [], user } = userData.data;

//       if (!user) {
//         toast("User not found!");
//         setLoading(false);
//         return;
//       }

//       // Create a new workbook
//       const workbook = XLSX.utils.book_new();

//       // ================ SUMMARY SHEET ================
//       createSummaryWorksheet(workbook, user, directReferrals, chainReferrals);

//       // ================ USER DETAILS SHEET ================
//       createUserDetailsWorksheet(workbook, user);

//       // ================ DIRECT REFERRALS SHEET ================
//       createDirectReferralsWorksheet(workbook, directReferrals);

//       // ================ CHAIN REFERRALS SHEET ================
//       createChainReferralsWorksheet(workbook, chainReferrals);

//       // Generate Excel file
//       const excelBuffer = XLSX.write(workbook, {
//         bookType: "xlsx",
//         type: "array",
//       });

//       const data = new Blob([excelBuffer], {
//         type: "application/octet-stream",
//       });

//       const today = new Date().toISOString().slice(0, 10);
//       saveAs(data, `${user.name}_referrals_${today}.xlsx`);

//       setLoading(false);
//       toast("Download started successfully!");
//     });
//   };

//   // Helper function to create the Summary worksheet
//   const createSummaryWorksheet = (
//     workbook,
//     user,
//     directReferrals,
//     chainReferrals
//   ) => {
//     // Create summary data
//     const summaryData = [
//       ["Referral Report", "", "", ""],
//       ["Generated On", new Date().toLocaleString(), "", ""],
//       ["", "", "", ""],
//       ["User Information", "", "", ""],
//       ["Name", user.name, "", ""],
//       ["Username", user.username, "", ""],
//       ["Phone", `${user.phone}`, "", ""],
//       ["Email", user.email, "", ""],
//       ["Referral Bonus", user.referenceInr, "", ""],
//       ["", "", "", ""],
//       ["Referral Statistics", "", "", ""],
//       ["Direct Referrals", directReferrals.length, "", ""],
//       ["Chain Referrals", chainReferrals.length, "", ""],
//       [
//         "Total Referrals",
//         directReferrals.length + chainReferrals.length,
//         "",
//         "",
//       ],
//     ];

//     // Convert to worksheet
//     const worksheet = XLSX.utils.aoa_to_sheet(summaryData);

//     // Apply styling
//     applyStyles(worksheet, {
//       // Style headers
//       "!merges": [{ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }],
//       // Set column widths
//       "!cols": [{ wch: 20 }, { wch: 30 }, { wch: 15 }, { wch: 15 }],
//     });

//     // Bold specific rows (titles)
//     ["A1", "A4", "A11"].forEach((cell) => {
//       if (!worksheet[cell]) worksheet[cell] = {};
//       worksheet[cell].s = { font: { bold: true, sz: 14 } };
//     });

//     // Add worksheet to workbook
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Summary");
//   };

//   // Helper function to create the User Details worksheet
//   const createUserDetailsWorksheet = (workbook, user) => {
//     // User basic information
//     const userInfoRows = [
//       ["User Details", "", "", "", ""],
//       ["Name", user.name, "", "", ""],
//       ["Username", user.username, "", "", ""],
//       ["Phone", `${user.phone}`, "", "", ""],
//       ["Email", user.email, "", "", ""],
//       ["Referral Bonus", user.referenceInr, "", "", ""],
//       ["", "", "", "", ""],
//     ];

//     // Add purchases section if available
//     if (user.firstThreePurchases && user.firstThreePurchases.length > 0) {
//       userInfoRows.push(["Purchase History", "", "", "", ""]);
//       userInfoRows.push(["#", "Date", "Amount", "Currency", "JAIMAX Tokens"]);

//       user.firstThreePurchases.forEach((purchase, index) => {
//         userInfoRows.push([
//           index + 1,
//           formatDate(purchase.createdAt),
//           purchase.amount,
//           purchase.currency,
//           purchase.jaimax,
//         ]);
//       });
//     }

//     // Convert to worksheet
//     const worksheet = XLSX.utils.aoa_to_sheet(userInfoRows);

//     // Apply styling
//     applyStyles(worksheet, {
//       "!merges": [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }],
//       "!cols": [
//         { wch: 15 },
//         { wch: 25 },
//         { wch: 15 },
//         { wch: 15 },
//         { wch: 15 },
//       ],
//     });

//     // Bold titles and headers
//     ["A1", "A8"].forEach((cell) => {
//       if (!worksheet[cell]) worksheet[cell] = {};
//       worksheet[cell].s = { font: { bold: true, sz: 14 } };
//     });

//     if (user.firstThreePurchases && user.firstThreePurchases.length > 0) {
//       // Style purchase table headers
//       ["A9", "B9", "C9", "D9", "E9"].forEach((cell) => {
//         if (!worksheet[cell]) worksheet[cell] = {};
//         worksheet[cell].s = {
//           font: { bold: true },
//           fill: { fgColor: { rgb: "EEEEEE" } },
//         };
//       });
//     }

//     // Add worksheet to workbook
//     XLSX.utils.book_append_sheet(workbook, worksheet, "User Details");
//   };

//   // Helper function to create the Direct Referrals worksheet
//   const createDirectReferralsWorksheet = (workbook, directReferrals) => {
//     if (!directReferrals.length) {
//       // Create empty worksheet if no direct referrals
//       const worksheet = XLSX.utils.aoa_to_sheet([
//         ["No Direct Referrals Found"],
//       ]);
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Direct Referrals");
//       return;
//     }

//     // Create header row
//     const directRefData = [
//       ["Direct Referrals", "", "", "", "", "", ""],
//       [
//         "Name",
//         "Username",
//         "Phone",
//         "Email",
//         "Referral Bonus",
//         "Referred By",
//         "Direct Referrals Count",
//       ],
//     ];

//     // Add data rows for each direct referral
//     directReferrals.forEach((refUser) => {
//       directRefData.push([
//         refUser.name,
//         refUser.username,
//         `${refUser.phone}`,
//         refUser.email,
//         refUser.referenceInr,
//         refUser.referenceId,
//         refUser.referenceCount,
//       ]);

//       // Add purchases if available
//       if (
//         refUser.firstThreePurchases &&
//         refUser.firstThreePurchases.length > 0
//       ) {
//         directRefData.push(["", "", "", "", "", "", ""]);
//         directRefData.push([
//           `${refUser.name}'s Purchases:`,
//           "",
//           "",
//           "",
//           "",
//           "",
//           "",
//         ]);
//         directRefData.push([
//           "#",
//           "Date",
//           "Amount",
//           "Currency",
//           "JAIMAX Tokens",
//           "",
//           "",
//         ]);

//         refUser.firstThreePurchases.forEach((purchase, index) => {
//           directRefData.push([
//             index + 1,
//             formatDate(purchase.createdAt),
//             purchase.amount,
//             purchase.currency,
//             purchase.jaimax,
//             "",
//             "",
//           ]);
//         });

//         directRefData.push(["", "", "", "", "", "", ""]);
//       }
//     });

//     // Convert to worksheet
//     const worksheet = XLSX.utils.aoa_to_sheet(directRefData);

//     // Apply styling
//     applyStyles(worksheet, {
//       "!merges": [{ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }],
//       "!cols": [
//         { wch: 20 },
//         { wch: 20 },
//         { wch: 15 },
//         { wch: 25 },
//         { wch: 15 },
//         { wch: 20 },
//         { wch: 20 },
//       ],
//     });

//     // Bold headers
//     ["A1", "A2", "B2", "C2", "D2", "E2", "F2", "G2"].forEach((cell) => {
//       if (!worksheet[cell]) worksheet[cell] = {};
//       worksheet[cell].s = { font: { bold: true } };
//     });

//     // Add table styling
//     worksheet["A1"].s = { font: { bold: true, sz: 14 } };

//     // Add worksheet to workbook
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Direct Referrals");
//   };

//   // Helper function to create the Chain Referrals worksheet
//   const createChainReferralsWorksheet = (workbook, chainReferrals) => {
//     if (!chainReferrals.length) {
//       // Create empty worksheet if no chain referrals
//       const worksheet = XLSX.utils.aoa_to_sheet([["No Chain Referrals Found"]]);
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Chain Referrals");
//       return;
//     }

//     // Create header row
//     const chainRefData = [
//       ["Chain Referrals", "", "", "", "", "", ""],
//       [
//         "Name",
//         "Username",
//         "Phone",
//         "Email",
//         "Referral Bonus",
//         "Referred By",
//         "Direct Referrals Count",
//       ],
//     ];

//     // Add data rows for each chain referral
//     chainReferrals.forEach((refUser) => {
//       chainRefData.push([
//         refUser.name,
//         refUser.username,
//         `${refUser.phone}`,
//         refUser.email,
//         refUser.referenceInr,
//         refUser.referenceId,
//         refUser.referenceCount,
//       ]);

//       // Add purchases if available
//       if (
//         refUser.firstThreePurchases &&
//         refUser.firstThreePurchases.length > 0
//       ) {
//         chainRefData.push(["", "", "", "", "", "", ""]);
//         chainRefData.push([
//           `${refUser.name}'s Purchases:`,
//           "",
//           "",
//           "",
//           "",
//           "",
//           "",
//         ]);
//         chainRefData.push([
//           "#",
//           "Date",
//           "Amount",
//           "Currency",
//           "JAIMAX Tokens",
//           "",
//           "",
//         ]);

//         refUser.firstThreePurchases.forEach((purchase, index) => {
//           chainRefData.push([
//             index + 1,
//             formatDate(purchase.createdAt),
//             purchase.amount,
//             purchase.currency,
//             purchase.jaimax,
//             "",
//             "",
//           ]);
//         });

//         chainRefData.push(["", "", "", "", "", "", ""]);
//       }
//     });

//     // Convert to worksheet
//     const worksheet = XLSX.utils.aoa_to_sheet(chainRefData);

//     // Apply styling
//     applyStyles(worksheet, {
//       "!merges": [{ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }],
//       "!cols": [
//         { wch: 20 },
//         { wch: 20 },
//         { wch: 15 },
//         { wch: 25 },
//         { wch: 15 },
//         { wch: 20 },
//         { wch: 20 },
//       ],
//     });

//     // Bold headers
//     ["A1", "A2", "B2", "C2", "D2", "E2", "F2", "G2"].forEach((cell) => {
//       if (!worksheet[cell]) worksheet[cell] = {};
//       worksheet[cell].s = { font: { bold: true } };
//     });

//     // Add table styling
//     worksheet["A1"].s = { font: { bold: true, sz: 14 } };

//     // Add worksheet to workbook
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Chain Referrals");
//   };

//   // Helper function to apply styles to worksheet
//   const applyStyles = (worksheet, styles) => {
//     // Apply all styles from the styles object
//     Object.keys(styles).forEach((key) => {
//       worksheet[key] = styles[key];
//     });

//     // Optional: add default styling for the whole sheet
//     if (!worksheet["!cols"]) worksheet["!cols"] = [];
//     if (!worksheet["!rows"]) worksheet["!rows"] = [];
//   };

//   // Display API loading state
//   const isPageLoading = loading || isLoading;

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   return (
//     <DashboardLayout>
//       <div
//         className="profile_section py-4"
//         style={{
//           backgroundColor: "#1b232d",
//           borderRadius: "5px",
//           overflow: "hidden",
//           marginRight: "10px",
//           marginLeft: "10px",
//         }}
//       >
//         <div className="container-fluid ">
//           <div className="container">
//             <div className=" rounded-3 p-3">
//               <div className="row justify-content-center">
//                 <div className="col-auto">
//                   <input
//                     type="text"
//                     placeholder="Enter Reference ID"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="form-control mb-3"
//                     style={{ maxWidth: "300px", textAlign: "center" }}
//                   />
//                 </div>
//               </div>
//               <div className="d-flex justify-content-center gap-3 flex-wrap">
//                 <button
//                   onClick={handleDirectSearch}
//                   className="btn text-white"
//                   style={{ backgroundColor: "#ec660f" }}
//                   disabled={isPageLoading}
//                 >
//                   Show Direct Referrals
//                 </button>
//                 <button
//                   onClick={handleChainSearch}
//                   className="btn text-white"
//                   style={{ backgroundColor: "#ec660f" }}
//                   disabled={isPageLoading}
//                 >
//                   Show Chain Referrals
//                 </button>
//                 <button
//                   onClick={handleShowUserDetails}
//                   className="btn text-white"
//                   style={{ backgroundColor: "#ec660f" }}
//                   disabled={isPageLoading}
//                 >
//                   Show Details
//                 </button>
//                 <button
//                   onClick={exportToExcel}
//                   className="btn text-white"
//                   style={{ backgroundColor: "#ec660f" }}
//                   disabled={isPageLoading}
//                 >
//                   Download XLSX
//                 </button>
//               </div>

//               {/* Display API error message */}
//               {error && (
//                 <div className="alert alert-danger mt-3 text-center">
//                   Error loading data. Please try again.
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="container" style={{ backgroundColor: "#1b242d" }}>
//           {isPageLoading ? (
//             <div
//               className="d-flex justify-content-center align-items-center"
//               style={{ height: "240px" }}
//             >
//               <div className="spinner-border text-warning" role="status">
//                 <span className="visually-hidden">Loading...</span>
//               </div>
//             </div>
//           ) : (
//             <>
//               {/* User Details Section */}
//               {userDetails && (
//                 <div className="d-flex justify-content-center">
//                   <div
//                     className="alert alert-info mt-4 p-4 w-100"
//                     style={{
//                       backgroundColor: "#1b232d",
//                       color: "#fff",
//                       maxWidth: "500px",
//                     }}
//                   >
//                     <h4
//                       className="text-center mb-4"
//                       style={{ color: "#ec660f" }}
//                     >
//                       User Details
//                     </h4>
//                     <ul className="list-unstyled mb-0">
//                       <li className="mb-2">
//                         <strong>Name:</strong> {userDetails.name}
//                       </li>
//                       <li className="mb-2">
//                         <strong>Username:</strong> {userDetails.username}
//                       </li>
//                       <li className="mb-2">
//                         <strong>Phone:</strong> {userDetails.phone}
//                       </li>
//                       <li className="mb-2">
//                         <strong>Email:</strong> {userDetails.email}
//                       </li>
//                       <li className="mb-2">
//                         <strong>Referral Bonus:</strong> ₹
//                         {userDetails.referenceInr}
//                       </li>
//                       <li className="mb-2">
//                         <strong>Direct Referrals:</strong>{" "}
//                         {userDetails.directCount}
//                       </li>
//                       <li>
//                         <strong>Chain Referrals:</strong>{" "}
//                         {userDetails.chainCount}
//                       </li>
//                     </ul>
//                     <p
//                       className="text-center mt-2 text-xl font-medium"
//                       style={{ color: "#ec660f" }}
//                     >
//                       First Three Purchases
//                     </p>

//                     {/* Summary stats */}
//                     <div className="row mt-4 mb-6">
//                       <div className="col-6">
//                         <div
//                           className="p-3 text-center rounded"
//                           style={{ backgroundColor: "#2e2e2e" }}
//                         >
//                           <p
//                             className="text-sm font-medium"
//                             style={{ color: "#ec660f" }}
//                           >
//                             Total Amount
//                           </p>
//                           <p className="text-xl font-bold text-white">
//                             {userDetails.firstThreePurchases
//                               .reduce(
//                                 (sum, purchase) => sum + purchase.amount,
//                                 0
//                               )
//                               .toLocaleString()}{" "}
//                             INR
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
//                             Total Tokens
//                           </p>
//                           <p className="text-xl font-bold text-white">
//                             {userDetails.firstThreePurchases
//                               .reduce(
//                                 (sum, purchase) => sum + purchase.jaimax,
//                                 0
//                               )
//                               .toLocaleString()}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Table */}

//                     <div className="table-responsive  mt-4">
//                       <table
//                         style={{
//                           backgroundColor: "#2e2e2e",
//                           border: "2px solid #3a3a3a",
//                           borderRadius: "10px",
//                           borderCollapse: "separate",
//                           borderSpacing: 0,
//                           overflow: "hidden",
//                           width: "100%",
//                         }}
//                       >
//                         <thead
//                           style={{
//                             backgroundColor: "#ec660f",
//                             borderTopLeftRadius: "10px",
//                             borderTopRightRadius: "10px",
//                           }}
//                         >
//                           <tr className="text-light">
//                             <th
//                               className="text-center p-2"
//                               style={{
//                                 borderTopLeftRadius: "8px",
//                               }}
//                             >
//                               Purchase
//                             </th>
//                             <th className="text-center p-2">Date</th>
//                             <th className="text-center p-2">Amount</th>
//                             <th
//                               className="text-center p-2"
//                               style={{
//                                 borderTopRightRadius: "8px",
//                               }}
//                             >
//                               JAIMAX Tokens
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {userDetails.firstThreePurchases?.map(
//                             (purchase, index) => (
//                               <tr
//                                 key={index}
//                                 style={{
//                                   backgroundColor: "#2e2e2e",
//                                   color: "#fff",
//                                 }}
//                               >
//                                 <td className="p-2 text-center">
//                                   <span className="text-uppercase">
//                                     {index + 1}
//                                   </span>
//                                 </td>
//                                 <td className="p-2 text-center">
//                                   {formatDate(purchase.createdAt)}
//                                 </td>
//                                 <td className="p-2 text-center">
//                                   {purchase.amount.toLocaleString()}{" "}
//                                   {purchase.currency}
//                                 </td>
//                                 <td className="p-2 text-center">
//                                   {purchase.jaimax.toLocaleString()}
//                                 </td>
//                               </tr>
//                             )
//                           )}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Direct Referrals Table */}
//               {refType === "direct" && referrals.length > 0 && (
//                 <div className="table-responsive p-3">
//                   <h4 className="text-center mb-4" style={{ color: "#ec660f" }}>
//                     Direct Referrals
//                   </h4>
//                   <table className="table table-bordered table-dark">
//                     <thead style={{ backgroundColor: "#ec660f" }}>
//                       <tr className="text-light">
//                         <th className="text-center p-3">S.No</th>
//                         <th className="text-center p-3">Name</th>
//                         <th className="text-center p-3">Username</th>
//                         <th className="text-center p-3">Phone</th>
//                         <th className="text-center p-3">Email</th>
//                         <th className="text-center p-3">Referral Bonus</th>
//                         <th className="text-center p-3">Direct Referrals</th>
//                         <th className="text-center p-3">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {referrals.map((user, index) => (
//                         <tr
//                           key={index}
//                           style={{ backgroundColor: "#2e2e2e", color: "#fff" }}
//                           onMouseEnter={(e) =>
//                             (e.currentTarget.style.backgroundColor = "#444")
//                           }
//                           onMouseLeave={(e) =>
//                             (e.currentTarget.style.backgroundColor = "#2e2e2e")
//                           }
//                         >
//                           <td className="text-center p-3">{index + 1}</td>
//                           <td className="p-3">{user.name}</td>
//                           <td className="p-3">{user.username}</td>
//                           <td className="p-3">{user.phone}</td>
//                           <td className="p-3">{user.email}</td>
//                           <td className="p-3">₹{user.referenceInr}</td>
//                           <td className="p-3 text-center">
//                             {user.referenceCount}
//                           </td>
//                           <td className="p-3 text-center">
//                             <button
//                               className="btn btn-sm"
//                               style={{
//                                 backgroundColor: "#ec660f",
//                                 color: "white",
//                               }}
//                               onClick={() => showUserPurchases(user)}
//                               disabled={
//                                 !user.firstThreePurchases ||
//                                 user.firstThreePurchases.length === 0
//                               }
//                             >
//                               View Purchases
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}

//               {/* Chain Referrals Table */}
//               {refType === "chain" && referrals.length > 0 && (
//                 <div className="table-responsive p-3">
//                   <h4 className="text-center mb-4" style={{ color: "#ec660f" }}>
//                     Chain Referrals
//                   </h4>
//                   <table
//                     className="table table-bordered table-dark"
//                     style={{ backgroundColor: "#1b242d" }}
//                   >
//                     <thead style={{ backgroundColor: "#ec660f" }}>
//                       <tr className="text-light">
//                         <th className="text-center p-3">S.No</th>
//                         <th className="text-center p-3">Name</th>
//                         <th className="text-center p-3">Username</th>
//                         <th className="text-center p-3">Phone</th>
//                         <th className="text-center p-3">Email</th>
//                         <th className="text-center p-3">Referral Bonus</th>
//                         <th className="text-center p-3">Chain Referrals</th>
//                         <th className="text-center p-3">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {referrals.map((user, index) => (
//                         <tr
//                           key={index}
//                           style={{ backgroundColor: "#2e2e2e", color: "#fff" }}
//                           onMouseEnter={(e) =>
//                             (e.currentTarget.style.backgroundColor = "#444")
//                           }
//                           onMouseLeave={(e) =>
//                             (e.currentTarget.style.backgroundColor = "#2e2e2e")
//                           }
//                         >
//                           <td className="text-center p-3">{index + 1}</td>
//                           <td className="p-3">{user.name}</td>
//                           <td className="p-3">{user.username}</td>
//                           <td className="p-3">{user.phone}</td>
//                           <td className="p-3">{user.email}</td>
//                           <td className="p-3">₹{user.referenceInr}</td>
//                           <td className="p-3 text-center">
//                             {user.referenceCount}
//                           </td>
//                           <td className="p-3 text-center">
//                             <button
//                               className="btn btn-sm"
//                               style={{
//                                 backgroundColor: "#ec660f",
//                                 color: "white",
//                               }}
//                               onClick={() => showUserPurchases(user)}
//                               disabled={
//                                 !user.firstThreePurchases ||
//                                 user.firstThreePurchases.length === 0
//                               }
//                             >
//                               View Purchases
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}

//               {/* Modal for displaying user purchases */}
//               <Modal
//                 show={showModal}
//                 onHide={() => setShowModal(false)}
//                 backdrop="static"
//                 keyboard={false}
//                 size="lg"
//                 centered
//               >
//                 <Modal.Header
//                   style={{
//                     backgroundColor: "#1b242d",
//                     borderBottom: "1px solid #3a3a3a",
//                     color: "#ec660f",
//                   }}
//                 >
//                   <Modal.Title>
//                     {selectedUser?.name}'s First Three Purchases
//                   </Modal.Title>
//                   <button
//                     type="button"
//                     className="btn-close btn-close-white"
//                     aria-label="Close"
//                     onClick={() => setShowModal(false)}
//                   ></button>
//                 </Modal.Header>
//                 <Modal.Body
//                   style={{ backgroundColor: "#1b242d", color: "#fff" }}
//                 >
//                   {selectedUser && (
//                     <>
//                       <div className="row mb-4">
//                         <div className="col-md-6">
//                           <div className="mb-3">
//                             <strong>Name:</strong> {selectedUser.name}
//                           </div>
//                           <div className="mb-3">
//                             <strong>Username:</strong> {selectedUser.username}
//                           </div>
//                           <div className="mb-3">
//                             <strong>Email:</strong> {selectedUser.email}
//                           </div>
//                         </div>
//                         <div className="col-md-6">
//                           <div className="mb-3">
//                             <strong>Phone:</strong> {selectedUser.phone}
//                           </div>
//                           <div className="mb-3">
//                             <strong>Referral Bonus:</strong> ₹
//                             {selectedUser.referenceInr}
//                           </div>
//                           <div className="mb-3">
//                             <strong>Direct Referrals:</strong>{" "}
//                             {selectedUser.referenceCount}
//                           </div>
//                         </div>
//                       </div>

//                       {/* Summary stats */}
//                       <div className="row mt-4 mb-4">
//                         <div className="col-6">
//                           <div
//                             className="p-3 text-center rounded"
//                             style={{ backgroundColor: "#2e2e2e" }}
//                           >
//                             <p
//                               className="text-sm font-medium"
//                               style={{ color: "#ec660f" }}
//                             >
//                               Total Amount
//                             </p>
//                             <p className="text-xl font-bold text-white">
//                               {selectedUser.firstThreePurchases
//                                 .reduce(
//                                   (sum, purchase) => sum + purchase.amount,
//                                   0
//                                 )
//                                 .toLocaleString()}{" "}
//                               INR
//                             </p>
//                           </div>
//                         </div>
//                         <div className="col-6">
//                           <div
//                             className="p-3 text-center rounded"
//                             style={{ backgroundColor: "#2e2e2e" }}
//                           >
//                             <p
//                               className="text-sm font-medium"
//                               style={{ color: "#ec660f" }}
//                             >
//                               Total Tokens
//                             </p>
//                             <p className="text-xl font-bold text-white">
//                               {selectedUser.firstThreePurchases
//                                 .reduce(
//                                   (sum, purchase) => sum + purchase.jaimax,
//                                   0
//                                 )
//                                 .toLocaleString()}
//                             </p>
//                           </div>
//                         </div>
//                       </div>

//                       <div
//                         style={{
//                           boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
//                           borderRadius: "8px",
//                           overflow: "hidden",
//                           marginTop: "16px",
//                         }}
//                       >
//                         <table
//                           style={{
//                             backgroundColor: "#1e1e1e",
//                             borderColor: "#3a3a3a",
//                             borderCollapse: "collapse",
//                             margin: "0",
//                             width: "100%",
//                             border: "1px solid #3a3a3a",
//                           }}
//                         >
//                           <thead>
//                             <tr
//                               style={{
//                                 background:
//                                   "linear-gradient(45deg, #ec660f, #f07d2c)",
//                                 boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
//                               }}
//                             >
//                               <th
//                                 style={{
//                                   color: "white",
//                                   fontWeight: "600",
//                                   borderColor: "#ec660f",
//                                   letterSpacing: "0.5px",
//                                   fontSize: "16px",
//                                   textTransform: "uppercase",
//                                   padding: "12px",
//                                   textAlign: "center",
//                                 }}
//                               >
//                                 Purchase
//                               </th>
//                               <th
//                                 style={{
//                                   color: "white",
//                                   fontWeight: "600",
//                                   borderColor: "#ec660f",
//                                   letterSpacing: "0.5px",
//                                   fontSize: "16px",
//                                   textTransform: "uppercase",
//                                   padding: "12px",
//                                   textAlign: "center",
//                                 }}
//                               >
//                                 Date
//                               </th>
//                               <th
//                                 style={{
//                                   color: "white",
//                                   fontWeight: "600",
//                                   borderColor: "#ec660f",
//                                   letterSpacing: "0.5px",
//                                   fontSize: "16px",
//                                   textTransform: "uppercase",
//                                   padding: "12px",
//                                   textAlign: "center",
//                                 }}
//                               >
//                                 Amount
//                               </th>
//                               <th
//                                 style={{
//                                   color: "white",
//                                   fontWeight: "600",
//                                   borderColor: "#ec660f",
//                                   letterSpacing: "0.5px",
//                                   fontSize: "16px",
//                                   textTransform: "uppercase",
//                                   padding: "12px",
//                                   textAlign: "center",
//                                 }}
//                               >
//                                 JAIMAX Tokens
//                               </th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {selectedUser.firstThreePurchases?.map(
//                               (purchase, index) => (
//                                 <tr
//                                   key={index}
//                                   style={{
//                                     backgroundColor:
//                                       index % 2 === 0 ? "#2e2e2e" : "#262626",
//                                     color: "#fff",
//                                     transition: "all 0.2s ease",
//                                     borderLeft: "3px solid transparent",
//                                     borderRight: "3px solid transparent",
//                                   }}
//                                   onMouseEnter={(e) => {
//                                     e.currentTarget.style.backgroundColor =
//                                       "#3a3a3a";
//                                     e.currentTarget.style.borderLeft =
//                                       "3px solid #ec660f";
//                                     e.currentTarget.style.borderRight =
//                                       "3px solid #ec660f";
//                                   }}
//                                   onMouseLeave={(e) => {
//                                     e.currentTarget.style.backgroundColor =
//                                       index % 2 === 0 ? "#2e2e2e" : "#262626";
//                                     e.currentTarget.style.borderLeft =
//                                       "3px solid transparent";
//                                     e.currentTarget.style.borderRight =
//                                       "3px solid transparent";
//                                   }}
//                                 >
//                                   <td
//                                     style={{
//                                       textAlign: "center",
//                                       padding: "12px",
//                                     }}
//                                   >
//                                     <span
//                                       style={{
//                                         backgroundColor: "#ec660f",
//                                         color: "white",
//                                         fontSize: "14px",
//                                         fontWeight: "bold",
//                                         padding: "6px 10px",
//                                         borderRadius: "6px",
//                                         minWidth: "30px",
//                                         display: "inline-block",
//                                       }}
//                                     >
//                                       {index + 1}
//                                     </span>
//                                   </td>
//                                   <td
//                                     style={{
//                                       textAlign: "center",
//                                       padding: "12px",
//                                       fontSize: "15px",
//                                     }}
//                                   >
//                                     {formatDate(purchase.createdAt)}
//                                   </td>
//                                   <td
//                                     style={{
//                                       textAlign: "center",
//                                       padding: "12px",
//                                       fontSize: "15px",
//                                       fontWeight: "600",
//                                     }}
//                                   >
//                                     <span style={{ color: "#eaeaea" }}>
//                                       {purchase.amount.toLocaleString()}{" "}
//                                       <span>{purchase.currency}</span>
//                                     </span>
//                                   </td>
//                                   <td
//                                     style={{
//                                       textAlign: "center",
//                                       padding: "12px",
//                                       fontSize: "15px",
//                                       fontWeight: "600",
//                                       // color: "#f07d2c",
//                                     }}
//                                   >
//                                     {purchase.jaimax.toLocaleString()}{" "}
//                                     <span>Tokens</span>
//                                   </td>
//                                 </tr>
//                               )
//                             )}
//                             {selectedUser.firstThreePurchases?.length === 0 && (
//                               <tr
//                                 style={{
//                                   backgroundColor: "#2e2e2e",
//                                 }}
//                               >
//                                 <td
//                                   colSpan="4"
//                                   style={{
//                                     textAlign: "center",
//                                     padding: "16px",
//                                     color: "#999",
//                                     fontStyle: "italic",
//                                   }}
//                                 >
//                                   No purchase data available
//                                 </td>
//                               </tr>
//                             )}
//                           </tbody>
//                         </table>
//                       </div>
//                     </>
//                   )}
//                 </Modal.Body>
//                 <Modal.Footer
//                   style={{
//                     backgroundColor: "#1b242d",
//                     borderTop: "1px solid #3a3a3a",
//                   }}
//                 >
//                   <Button
//                     variant="secondary"
//                     onClick={() => setShowModal(false)}
//                     style={{
//                       backgroundColor: "#2e2e2e",
//                       borderColor: "#3a3a3a",
//                     }}
//                   >
//                     Close
//                   </Button>
//                 </Modal.Footer>
//               </Modal>
//             </>
//           )}
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default Userinfo;

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FileText, File, Download, FileDown } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import DashboardLayout from "../../Layout/DashboardLayout";
import { useGetUserInfoQuery } from "./userinfoApiSlice";
import { toast } from "react-toastify";
import "./userinfopurchasemodal.css";
import { Modal, Button } from "react-bootstrap";
import Edituser from "./EditableUser";
function buildReferralMap(users) {
  const map = new Map();
  users.forEach((user) => {
    if (user.isActive) {
      if (!map.has(user.referenceId)) {
        map.set(user.referenceId, []);
      }
      map.get(user.referenceId).push(user);
    }
  });
  return map;
}

const Userinfo = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [referrals, setReferrals] = useState([]);
  const [refType, setRefType] = useState("");
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);


  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(""); // "purchases" or "investments"

  // Use the API query hook with skip parameter
  const {
    data: userData,
    error,
    isLoading,
    refetch,
  } = useGetUserInfoQuery(searchTerm, {
    skip: !searchTerm.trim(),
  });
  console.log(userData?.data?.user, "userData");
  const clearAll = () => {
    setReferrals([]);
    setUserDetails(null);
    setRefType("");
  };

  // Function to show user purchases in modal
  const showUserPurchases = (user) => {
    setSelectedUser(user);
    setModalType("purchases");
    setShowModal(true);
  };

  // Function to show user investments in modal
  const showUserInvestments = (user) => {
    setSelectedUser(user);
    setModalType("investments");
    setShowModal(true);
  };

  const handleDirectSearch = () => {
    if (!searchTerm.trim()) {
      toast("Please enter a Reference ID");
      return;
    }

    setLoading(true);
    clearAll();

    // Trigger API call with current searchTerm
    refetch().then(() => {
      setRefType("direct");
      setLoading(false);
    });
  };

  const handleChainSearch = () => {
    if (!searchTerm.trim()) {
      toast("Please enter a Reference ID");
      return;
    }

    setLoading(true);
    clearAll();

    // Trigger API call with current searchTerm
    refetch().then(() => {
      setRefType("chain");
      setLoading(false);
    });
  };

  const handleShowUserDetails = () => {
    if (!searchTerm.trim()) {
      toast("Please enter a Reference ID");
      return;
    }

    setLoading(true);
    clearAll();

    // Refresh data from API
    refetch().then(() => {
      // User details will be updated from the useEffect
      setLoading(false);
    });
  };

  // Handle API response - process data when it changes
  useEffect(() => {
    if (userData) {
      // Check for token expiration error
      if (
        userData.status_code === 408 &&
        userData.message?.includes("Token expired")
      ) {
        toast("Session expired. Please login again.");
        // Redirect to login page
        // window.location.href = "/login";
        return;
      }

      // If data is successfully retrieved
      if (userData.success === 1 && userData.data) {
        // Get the response data structure based on your description
        const { directReferrals = [], chainReferrals = [] } = userData.data;

        // Update referrals based on the selected type
        if (refType === "direct") {
          // Make sure to include purchase information for each referral if available
          setReferrals(
            directReferrals.map((referral) => ({
              ...referral,
              // Ensure firstThreePurchases and firstThreeInvestments exist with default empty array if not present
              firstThreePurchases: referral.firstThreePurchases || [],
              firstThreeInvestments: referral.firstThreeInvestments || [],
            }))
          );
        } else if (refType === "chain") {
          setReferrals(
            chainReferrals.map((referral) => ({
              ...referral,
              // Ensure firstThreePurchases and firstThreeInvestments exist with default empty array if not present
              firstThreePurchases: referral.firstThreePurchases || [],
              firstThreeInvestments: referral.firstThreeInvestments || [],
            }))
          );
        }

        // If we're showing user details
        if (!refType) {
          // Find the user in directReferrals or calculate from the response
          const foundUser = userData.data.user || {};

          if (foundUser) {
            setUserDetails({
              ...foundUser,
              directCount: directReferrals.length,
              chainCount: chainReferrals.length,
              // Ensure firstThreePurchases and firstThreeInvestments exist with default empty array if not present
              firstThreePurchases: foundUser.firstThreePurchases || [],
              firstThreeInvestments: foundUser.firstThreeInvestments || [],
            });
          } else {
            toast("User not found!");
          }
        }
      }
    }
  }, [userData, refType]);

  // Function to export data to PDF
  const exportToPDF = () => {
    if (!searchTerm.trim()) {
      toast("Please enter a Reference ID");
      return;
    }

    setLoading(true);

    // Refresh data from API
    refetch().then(() => {
      if (!userData || !userData.data) {
        toast("No user data available");
        setLoading(false);
        return;
      }

      const { directReferrals = [], chainReferrals = [], user } = userData.data;

      if (!user) {
        toast("User not found!");
        setLoading(false);
        return;
      }

      try {
        // Create a new PDF document
        const doc = new jsPDF();

        // Generate the PDF with all sections
        createSummarySection(doc, user, directReferrals, chainReferrals);
        doc.addPage();

        createUserDetailsSection(doc, user);
        doc.addPage();

        createDirectReferralsSection(doc, directReferrals);
        doc.addPage();

        createChainReferralsSection(doc, chainReferrals);

        // Generate PDF file
        const today = new Date().toISOString().slice(0, 10);
        doc.save(`${user.name}_referrals_${today}.pdf`);

        setLoading(false);
        toast("PDF download started successfully!");
      } catch (error) {
        console.error("PDF Generation Error:", error);
        toast("Error creating PDF. Please try again.");
        setLoading(false);
      }
    });
  };

  // Helper function to create the Summary section
  const createSummarySection = (doc, user, directReferrals, chainReferrals) => {
    // Calculate totals
    let totalInvestmentAmount = 0;
    let totalTokens = 0;

    // Calculate user's investments and tokens
    if (user.firstThreeInvestments) {
      user.firstThreeInvestments.forEach((investment) => {
        if (investment.transactionAmount) {
          totalInvestmentAmount +=
            parseFloat(investment.transactionAmount) || 0;
        }
      });
    }

    if (user.firstThreePurchases) {
      user.firstThreePurchases.forEach((purchase) => {
        if (purchase.jaimax) {
          totalTokens += parseFloat(purchase.jaimax) || 0;
        }
      });
    }

    // Calculate direct referrals' investments and tokens
    directReferrals.forEach((refUser) => {
      if (refUser.firstThreeInvestments) {
        refUser.firstThreeInvestments.forEach((investment) => {
          if (investment.transactionAmount) {
            totalInvestmentAmount +=
              parseFloat(investment.transactionAmount) || 0;
          }
        });
      }

      if (refUser.firstThreePurchases) {
        refUser.firstThreePurchases.forEach((purchase) => {
          if (purchase.jaimax) {
            totalTokens += parseFloat(purchase.jaimax) || 0;
          }
        });
      }
    });

    // Calculate chain referrals' investments and tokens
    chainReferrals.forEach((refUser) => {
      if (refUser.firstThreeInvestments) {
        refUser.firstThreeInvestments.forEach((investment) => {
          if (investment.transactionAmount) {
            totalInvestmentAmount +=
              parseFloat(investment.transactionAmount) || 0;
          }
        });
      }

      if (refUser.firstThreePurchases) {
        refUser.firstThreePurchases.forEach((purchase) => {
          if (purchase.jaimax) {
            totalTokens += parseFloat(purchase.jaimax) || 0;
          }
        });
      }
    });

    // Add title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Referral Report", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated On: ${new Date().toLocaleString()}`, 105, 30, {
      align: "center",
    });

    // User Information
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("User Information", 20, 45);

    // User info table data
    const userInfo = [
      ["Name", user.name],
      ["Username", user.username],
      ["Phone", `${user.phone}`],
      ["Email", user.email],
      ["Referral Bonus", user.referenceInr],
      ["SuperBonus", user.super_bonus],
    ];

    // Create user info table
    autoTable(doc, {
      startY: 50,
      head: [],
      body: userInfo,
      theme: "plain",
      styles: { cellPadding: 1 },
      columnStyles: {
        0: { cellWidth: 40, fontStyle: "bold" },
        1: { cellWidth: 100 },
      },
    });

    // Referral Statistics
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Referral Statistics", 20, 90);

    // Referral stats table data
    const referralStats = [
      ["Direct Referrals", directReferrals.length],
      ["Chain Referrals", chainReferrals.length],
      ["Total Referrals", directReferrals.length + chainReferrals.length],
      ["Total Investment Amount", totalInvestmentAmount.toFixed(2)],
      ["Total JAIMAX Tokens", totalTokens.toFixed(2)],
    ];

    // Create referral stats table
    autoTable(doc, {
      startY: 95,
      head: [],
      body: referralStats,
      theme: "plain",
      styles: { cellPadding: 1 },
      columnStyles: {
        0: { cellWidth: 40, fontStyle: "bold" },
        1: { cellWidth: 100 },
      },
      didDrawCell: (data) => {
        // Add bold style to total rows
        if (data.row.index === 4 || data.row.index === 5) {
          doc.setFont("helvetica", "bold");
          doc.setTextColor(0, 0, 0);
        }
      },
    });
  };

  // Helper function to create the User Details section
  const createUserDetailsSection = (doc, user) => {
    // Starting Y position
    let yPos = 20;

    // Calculate user totals
    let userInvestmentTotal = 0;
    let userTokensTotal = 0;

    if (user.firstThreeInvestments) {
      user.firstThreeInvestments.forEach((investment) => {
        if (investment.transactionAmount) {
          userInvestmentTotal += parseFloat(investment.transactionAmount) || 0;
        }
      });
    }

    if (user.firstThreePurchases) {
      user.firstThreePurchases.forEach((purchase) => {
        if (purchase.jaimax) {
          userTokensTotal += parseFloat(purchase.jaimax) || 0;
        }
      });
    }

    // Add title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("User Details", 105, yPos, { align: "center" });
    yPos += 20;

    // User basic information
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    const userInfo = [
      ["Name", user.name],
      ["Username", user.username],
      ["Phone", `${user.phone}`],
      ["Email", user.email],
      ["Referral Bonus", user.referenceInr],
      ["Total Investment", userInvestmentTotal.toFixed(2)],
      ["Total JAIMAX Tokens", userTokensTotal.toFixed(2)],
    ];

    // Create table for user info
    autoTable(doc, {
      startY: yPos,
      head: [],
      body: userInfo,
      theme: "plain",
      styles: { cellPadding: 1 },
      columnStyles: {
        0: { cellWidth: 40, fontStyle: "bold" },
        1: { cellWidth: 100 },
      },
      didDrawCell: (data) => {
        // Add bold style to total rows
        if (data.row.index === 5 || data.row.index === 6) {
          doc.setFont("helvetica", "bold");
          doc.setTextColor(0, 0, 0);
        }
      },
    });

    // Update Y position (rough estimate for table height)
    yPos += userInfo.length * 10 + 20;

    // Add investments section if available
    if (user.firstThreeInvestments && user.firstThreeInvestments.length > 0) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Investment History", 20, yPos);
      yPos += 10;

      const investmentHeaders = [
        "#",
        "Date",
        "Amount",
        "Currency",
        "Payment Mode",
        "Transaction ID",
      ];

      const investmentData = user.firstThreeInvestments.map(
        (investment, index) => [
          index + 1,
          formatDate(investment.transactionDate),
          investment.transactionAmount,
          investment.currency,
          investment.paymentMode,
          investment.transactionId,
        ]
      );

      // Add a total row
      investmentData.push([
        "",
        "TOTAL",
        userInvestmentTotal.toFixed(2),
        user.firstThreeInvestments[0]?.currency || "",
        "",
        "",
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [investmentHeaders],
        body: investmentData,
        theme: "grid",
        headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0] },
        willDrawCell: (data) => {
          // Add bold style to total row
          if (data.row.index === investmentData.length - 1) {
            doc.setFont("helvetica", "bold");
          }
        },
      });

      // Update Y position (rough estimate for table height)
      yPos += investmentData.length * 10 + 20;
    }

    // Add purchases section if available
    if (user.firstThreePurchases && user.firstThreePurchases.length > 0) {
      // Check if we need a new page
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Purchase History", 20, yPos);
      yPos += 10;

      const purchaseHeaders = [
        "#",
        "Date",
        "Amount",
        "Currency",
        "JAIMAX Tokens",
      ];

      const purchaseData = user.firstThreePurchases.map((purchase, index) => [
        index + 1,
        formatDate(purchase.createdAt),
        purchase.amount,
        purchase.currency,
        purchase.jaimax,
      ]);

      // Add a total row
      purchaseData.push([
        "",
        "TOTAL",
        user.firstThreePurchases
          .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0)
          .toFixed(2),
        user.firstThreePurchases[0]?.currency || "",
        userTokensTotal.toFixed(2),
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [purchaseHeaders],
        body: purchaseData,
        theme: "grid",
        headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0] },
        willDrawCell: (data) => {
          // Add bold style to total row
          if (data.row.index === purchaseData.length - 1) {
            doc.setFont("helvetica", "bold");
          }
        },
      });
    }
  };

  // Helper function to create the Direct Referrals section
  const createDirectReferralsSection = (doc, directReferrals) => {
    // Starting Y position
    let yPos = 20;

    // Calculate totals
    let totalDirectInvestment = 0;
    let totalDirectTokens = 0;

    directReferrals.forEach((refUser) => {
      if (refUser.firstThreeInvestments) {
        refUser.firstThreeInvestments.forEach((investment) => {
          if (investment.transactionAmount) {
            totalDirectInvestment +=
              parseFloat(investment.transactionAmount) || 0;
          }
        });
      }

      if (refUser.firstThreePurchases) {
        refUser.firstThreePurchases.forEach((purchase) => {
          if (purchase.jaimax) {
            totalDirectTokens += parseFloat(purchase.jaimax) || 0;
          }
        });
      }
    });

    // Add title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Direct Referrals", 105, yPos, { align: "center" });
    yPos += 20;

    // Add totals before the table
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Direct Referrals: ${directReferrals.length}`, 20, yPos);
    yPos += 7;
    doc.text(
      `Total Investment Amount: ${totalDirectInvestment.toFixed(2)}`,
      20,
      yPos
    );
    yPos += 7;
    doc.text(`Total JAIMAX Tokens: ${totalDirectTokens.toFixed(2)}`, 20, yPos);
    yPos += 15;

    if (!directReferrals.length) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("No Direct Referrals Found", 105, yPos + 20, {
        align: "center",
      });
      return;
    }

    const directRefHeaders = [
      "Name",
      "Username",
      "Phone",
      "Email",
      "Referral Bonus",
      "Referred By",
      "Direct Referrals Count",
    ];

    const directRefData = directReferrals.map((refUser) => [
      refUser.name,
      refUser.username,
      `${refUser.phone}`,
      refUser.email,
      refUser.referenceInr,
      refUser.referenceId,
      refUser.referenceCount,
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [directRefHeaders],
      body: directRefData,
      theme: "grid",
      headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0] },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 35 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 },
        6: { cellWidth: 25 },
      },
      styles: { fontSize: 8 },
    });

    // Update Y position (rough estimate for table height)
    yPos += directRefData.length * 10 + 20;

    // Add details for each direct referral
    directReferrals.forEach((refUser, userIndex) => {
      // Calculate user totals
      let userInvestmentTotal = 0;
      let userTokensTotal = 0;

      if (refUser.firstThreeInvestments) {
        refUser.firstThreeInvestments.forEach((investment) => {
          if (investment.transactionAmount) {
            userInvestmentTotal +=
              parseFloat(investment.transactionAmount) || 0;
          }
        });
      }

      if (refUser.firstThreePurchases) {
        refUser.firstThreePurchases.forEach((purchase) => {
          if (purchase.jaimax) {
            userTokensTotal += parseFloat(purchase.jaimax) || 0;
          }
        });
      }

      // Add investments if available
      if (
        refUser.firstThreeInvestments &&
        refUser.firstThreeInvestments.length > 0
      ) {
        // Check if we need a new page
        if (yPos > 240) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`${refUser.name}'s Investments:`, 20, yPos);
        yPos += 10;

        const investmentHeaders = [
          "#",
          "Date",
          "Amount",
          "Currency",
          "Payment Mode",
          "Transaction ID",
          "Status",
        ];

        const investmentData = refUser.firstThreeInvestments.map(
          (investment, index) => [
            index + 1,
            formatDate(investment.transactionDate),
            investment.transactionAmount,
            investment.currency,
            investment.paymentMode,
            investment.transactionId,
            investment.transactionStatus,
          ]
        );

        // Add a total row
        investmentData.push([
          "",
          "TOTAL",
          userInvestmentTotal.toFixed(2),
          refUser.firstThreeInvestments[0]?.currency || "",
          "",
          "",
          "",
        ]);

        autoTable(doc, {
          startY: yPos,
          head: [investmentHeaders],
          body: investmentData,
          theme: "grid",
          headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
          styles: { fontSize: 8 },
          willDrawCell: (data) => {
            // Add bold style to total row
            if (data.row.index === investmentData.length - 1) {
              doc.setFont("helvetica", "bold");
            }
          },
        });

        // Update Y position (rough estimate for table height)
        yPos += investmentData.length * 10 + 20;
      }

      // Add purchases if available
      if (
        refUser.firstThreePurchases &&
        refUser.firstThreePurchases.length > 0
      ) {
        // Check if we need a new page
        if (yPos > 240) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`${refUser.name}'s Purchases:`, 20, yPos);
        yPos += 10;

        const purchaseHeaders = [
          "#",
          "Date",
          "Amount",
          "Currency",
          "JAIMAX Tokens",
        ];

        const purchaseData = refUser.firstThreePurchases.map(
          (purchase, index) => [
            index + 1,
            formatDate(purchase.createdAt),
            purchase.amount,
            purchase.currency,
            purchase.jaimax,
          ]
        );

        // Add a total row
        purchaseData.push([
          "",
          "TOTAL",
          refUser.firstThreePurchases
            .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0)
            .toFixed(2),
          refUser.firstThreePurchases[0]?.currency || "",
          userTokensTotal.toFixed(2),
        ]);

        autoTable(doc, {
          startY: yPos,
          head: [purchaseHeaders],
          body: purchaseData,
          theme: "grid",
          headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
          styles: { fontSize: 8 },
          willDrawCell: (data) => {
            // Add bold style to total row
            if (data.row.index === purchaseData.length - 1) {
              doc.setFont("helvetica", "bold");
            }
          },
        });

        // Update Y position (rough estimate for table height)
        yPos += purchaseData.length * 10 + 20;
      }

      // Add extra space between users
      yPos += 5;

      // Add a new page if we're at the end of the current page and there are more users
      if (yPos > 250 && userIndex < directReferrals.length - 1) {
        doc.addPage();
        yPos = 20;
      }
    });
  };

  // Helper function to create the Chain Referrals section
  const createChainReferralsSection = (doc, chainReferrals) => {
    // Starting Y position
    let yPos = 20;

    // Calculate totals
    let totalChainInvestment = 0;
    let totalChainTokens = 0;

    chainReferrals.forEach((refUser) => {
      if (refUser.firstThreeInvestments) {
        refUser.firstThreeInvestments.forEach((investment) => {
          if (investment.transactionAmount) {
            totalChainInvestment +=
              parseFloat(investment.transactionAmount) || 0;
          }
        });
      }

      if (refUser.firstThreePurchases) {
        refUser.firstThreePurchases.forEach((purchase) => {
          if (purchase.jaimax) {
            totalChainTokens += parseFloat(purchase.jaimax) || 0;
          }
        });
      }
    });

    // Add title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Chain Referrals", 105, yPos, { align: "center" });
    yPos += 20;

    // Add totals before the table
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Chain Referrals: ${chainReferrals.length}`, 20, yPos);
    yPos += 7;
    doc.text(
      `Total Investment Amount: ${totalChainInvestment.toFixed(2)}`,
      20,
      yPos
    );
    yPos += 7;
    doc.text(`Total JAIMAX Tokens: ${totalChainTokens.toFixed(2)}`, 20, yPos);
    yPos += 15;

    if (!chainReferrals.length) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("No Chain Referrals Found", 105, yPos + 20, { align: "center" });
      return;
    }

    const chainRefHeaders = [
      "Name",
      "Username",
      "Phone",
      "Email",
      "Referral Bonus",
      "Referred By",
      "Direct Referrals Count",
    ];

    const chainRefData = chainReferrals.map((refUser) => [
      refUser.name,
      refUser.username,
      `${refUser.phone}`,
      refUser.email,
      refUser.referenceInr,
      refUser.referenceId,
      refUser.referenceCount,
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [chainRefHeaders],
      body: chainRefData,
      theme: "grid",
      headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0] },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 35 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 },
        6: { cellWidth: 25 },
      },
      styles: { fontSize: 8 },
    });

    // Update Y position (rough estimate for table height)
    yPos += chainRefData.length * 10 + 20;

    // Add details for each chain referral
    chainReferrals.forEach((refUser, userIndex) => {
      // Calculate user totals
      let userInvestmentTotal = 0;
      let userTokensTotal = 0;

      if (refUser.firstThreeInvestments) {
        refUser.firstThreeInvestments.forEach((investment) => {
          if (investment.transactionAmount) {
            userInvestmentTotal +=
              parseFloat(investment.transactionAmount) || 0;
          }
        });
      }

      if (refUser.firstThreePurchases) {
        refUser.firstThreePurchases.forEach((purchase) => {
          if (purchase.jaimax) {
            userTokensTotal += parseFloat(purchase.jaimax) || 0;
          }
        });
      }

      // Add investments if available
      if (
        refUser.firstThreeInvestments &&
        refUser.firstThreeInvestments.length > 0
      ) {
        // Check if we need a new page
        if (yPos > 240) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`${refUser.name}'s Investments:`, 20, yPos);
        yPos += 10;

        const investmentHeaders = [
          "#",
          "Date",
          "Amount",
          "Currency",
          "Payment Mode",
          "Transaction ID",
          "Status",
        ];

        const investmentData = refUser.firstThreeInvestments.map(
          (investment, index) => [
            index + 1,
            formatDate(investment.transactionDate),
            investment.transactionAmount,
            investment.currency,
            investment.paymentMode,
            investment.transactionId,
            investment.transactionStatus,
          ]
        );

        // Add a total row
        investmentData.push([
          "",
          "TOTAL",
          userInvestmentTotal.toFixed(2),
          refUser.firstThreeInvestments[0]?.currency || "",
          "",
          "",
          "",
        ]);

        autoTable(doc, {
          startY: yPos,
          head: [investmentHeaders],
          body: investmentData,
          theme: "grid",
          headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
          styles: { fontSize: 8 },
          willDrawCell: (data) => {
            // Add bold style to total row
            if (data.row.index === investmentData.length - 1) {
              doc.setFont("helvetica", "bold");
            }
          },
        });

        // Update Y position (rough estimate for table height)
        yPos += investmentData.length * 10 + 20;
      }

      // Add purchases if available
      if (
        refUser.firstThreePurchases &&
        refUser.firstThreePurchases.length > 0
      ) {
        // Check if we need a new page
        if (yPos > 240) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`${refUser.name}'s Purchases:`, 20, yPos);
        yPos += 10;

        const purchaseHeaders = [
          "#",
          "Date",
          "Amount",
          "Currency",
          "JAIMAX Tokens",
        ];

        const purchaseData = refUser.firstThreePurchases.map(
          (purchase, index) => [
            index + 1,
            formatDate(purchase.createdAt),
            purchase.amount,
            purchase.currency,
            purchase.jaimax,
          ]
        );

        // Add a total row
        purchaseData.push([
          "",
          "TOTAL",
          refUser.firstThreePurchases
            .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0)
            .toFixed(2),
          refUser.firstThreePurchases[0]?.currency || "",
          userTokensTotal.toFixed(2),
        ]);

        autoTable(doc, {
          startY: yPos,
          head: [purchaseHeaders],
          body: purchaseData,
          theme: "grid",
          headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
          styles: { fontSize: 8 },
          willDrawCell: (data) => {
            // Add bold style to total row
            if (data.row.index === purchaseData.length - 1) {
              doc.setFont("helvetica", "bold");
            }
          },
        });

        // Update Y position (rough estimate for table height)
        yPos += purchaseData.length * 10 + 20;
      }

      // Add extra space between users
      yPos += 5;

      // Add a new page if we're at the end of the current page and there are more users
      if (yPos > 250 && userIndex < chainReferrals.length - 1) {
        doc.addPage();
        yPos = 20;
      }
    });
  };

  //   // Display API loading state
  const isPageLoading = loading || isLoading;

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <DashboardLayout>
      <div
        className="profile_section py-4"
        style={{
          backgroundColor: "#1b232d",
          borderRadius: "5px",
          overflow: "hidden",
          marginRight: "10px",
          marginLeft: "10px",
        }}
      >
        <div className="container-fluid ">
          <div className="container">
            <div className=" rounded-3 p-3">
              <div className="row justify-content-center">
                <div className="col-auto">
                  <input
                    type="text"
                    placeholder="Enter Reference ID"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control mb-3"
                    style={{ maxWidth: "300px", textAlign: "center" }}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <button
                  onClick={handleDirectSearch}
                  className="btn text-white"
                  style={{ backgroundColor: "#ec660f" }}
                  disabled={isPageLoading}
                >
                  Show Direct Referrals
                </button>
                <button
                  onClick={handleChainSearch}
                  className="btn text-white"
                  style={{ backgroundColor: "#ec660f" }}
                  disabled={isPageLoading}
                >
                  Show Chain Referrals
                </button>
                <button
                  onClick={handleShowUserDetails}
                  className="btn text-white"
                  style={{ backgroundColor: "#ec660f" }}
                  disabled={isPageLoading}
                >
                  Show Details
                </button>
                <button
                  onClick={exportToPDF}
                  disabled={loading}
                  className="btn text-white"
                  style={{ backgroundColor: "#ec660f" }}
                // className="flex items-center gap-2"
                >
                  {loading ? (
                    "Generating PDF..."
                  ) : (
                    <>
                      <FileText size={18} /> Export to PDF
                    </>
                  )}
                </button>
              </div>

              {/* Display API error message */}
              {error && (
                <div className="alert alert-danger mt-3 text-center">
                  Error loading data. Please try again.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="container" style={{ backgroundColor: "#1b242d" }}>
          {isPageLoading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "240px" }}
            >
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              {/* User Details Section */}
              {userDetails && (
                <div className="d-flex justify-content-center">
                  <div
                    className="alert alert-info mt-4 p-4 w-100"
                    style={{
                      backgroundColor: "#1b232d",
                      color: "#fff",
                      maxWidth: "800px",
                    }}
                  >
                    <h4
                      className="text-center mb-4"
                      style={{ color: "#ec660f" }}
                    >
                      User Details
                    </h4>
                    <h4
                      className="text-center mb-4"
                      onClick={() => setShowEditModal(true)}
                      style={{
                        fontSize:'20px',
                        color: "#f3f3f3",
                        position: 'absolute',
                        right: '10px',
                        top: '10px',
                        backgroundColor: '#ec660f',
                        padding: '5px',
                        borderRadius: '10px',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </h4>
                    <Modal
                      show={showEditModal}
                      onHide={() => setShowEditModal(false)}
                      centered
                      size="lg"
                    >
                      <Modal.Header
                        closeButton
                        style={{
                          backgroundColor: "#1b232d",
                          color: "#fff",
                          borderBottom: "1px solid #1b242d"
                        }}
                      >
                      
                      </Modal.Header>
                      <Modal.Body
                        style={{
                          backgroundColor: "#1b242d",
                          color: "#fff"
                        }}
                      >
                        <Edituser user={userData?.data?.user} />
                      </Modal.Body>
                    </Modal>
                    <ul className="list-unstyled mb-0">
                      <li className="mb-2">
                        <strong>Name:</strong> {userDetails.name}
                      </li>
                      <li className="mb-2">
                        <strong>Username:</strong> {userDetails.username}
                      </li>
                      <li className="mb-2">
                        <strong>Phone:</strong> {userDetails.phone}
                      </li>
                      <li className="mb-2">
                        <strong>Email:</strong> {userDetails.email}
                      </li>
                      <li className="mb-2">
                        <strong>Referral Bonus:</strong> ₹
                        {userDetails.referenceInr}
                      </li>
                      <li className="mb-2">
                        <strong>Direct Referrals:</strong>{" "}
                        {userDetails.directCount}
                      </li>
                      <li>
                        <strong>Chain Referrals:</strong>{" "}
                        {userDetails.chainCount}
                      </li>
                      <li>
                        <strong>Super Bonus:</strong>{" "}
                        {userDetails.super_bonus || "N/A"}
                      </li>
                    </ul>

                    {/* First Three Investments */}
                    {userDetails &&
                      userDetails.firstThreeInvestments &&
                      userDetails.firstThreeInvestments.length > 0 && (
                        <>
                          <p
                            className="text-center mt-4 text-xl font-medium"
                            style={{ color: "#ec660f" }}
                          >
                            First Three Investments
                          </p>

                          {/* Summary stats for investments */}
                          <div className="row mt-4 mb-6">
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
                                  {userDetails &&
                                    userDetails.firstThreeInvestments
                                      .reduce(
                                        (sum, item) =>
                                          sum + (item.transactionAmount || 0),
                                        0
                                      )
                                      .toLocaleString()}{" "}
                                  INR
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
                                  Payment Methods
                                </p>
                                <p className="text-xl font-bold text-white">
                                  {(userDetails &&
                                    userDetails.firstThreeInvestments &&
                                    Array.from(
                                      new Set(
                                        userDetails.firstThreeInvestments.map(
                                          (item) => item.paymentMode
                                        )
                                      )
                                    ).join(", ")) ||
                                    "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Investments Table */}
                          <div className="table-responsive mt-4">
                            <table
                              style={{
                                backgroundColor: "#2e2e2e",
                                border: "2px solid #3a3a3a",
                                borderRadius: "10px",
                                borderCollapse: "separate",
                                borderSpacing: 0,
                                overflow: "hidden",
                                width: "100%",
                              }}
                            >
                              <thead
                                style={{
                                  backgroundColor: "#ec660f",
                                  borderTopLeftRadius: "10px",
                                  borderTopRightRadius: "10px",
                                }}
                              >
                                <tr className="text-light">
                                  <th
                                    className="text-center p-2"
                                    style={{
                                      borderTopLeftRadius: "8px",
                                    }}
                                  >
                                    S.No
                                  </th>
                                  <th className="text-center p-2">Date</th>
                                  <th className="text-center p-2">Amount</th>
                                  <th className="text-center p-2">
                                    Payment Mode
                                  </th>
                                  <th
                                    className="text-center p-2"
                                    style={{
                                      borderTopRightRadius: "8px",
                                    }}
                                  >
                                    Transaction ID
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {userDetails.firstThreeInvestments?.map(
                                  (item, index) => (
                                    <tr
                                      key={index}
                                      style={{
                                        backgroundColor: "#2e2e2e",
                                        color: "#fff",
                                      }}
                                    >
                                      <td className="p-2 text-center">
                                        <span className="text-uppercase">
                                          {index + 1}
                                        </span>
                                      </td>
                                      <td className="p-2 text-center">
                                        {formatDate(item.transactionDate)}
                                      </td>
                                      <td className="p-2 text-center">
                                        {(
                                          item.transactionAmount || 0
                                        ).toLocaleString()}{" "}
                                        {item.currency}
                                      </td>
                                      <td className="p-2 text-center">
                                        {item.paymentMode}
                                      </td>
                                      <td className="p-2 text-center">
                                        {item.transactionId}
                                      </td>
                                    </tr>
                                  )
                                )}
                                {!userDetails.firstThreeInvestments ||
                                  (userDetails.firstThreeInvestments.length ===
                                    0 && (
                                      <tr>
                                        <td
                                          colSpan="5"
                                          className="text-center p-3"
                                        >
                                          No investment data available
                                        </td>
                                      </tr>
                                    ))}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}

                    {/* First Three Purchases */}
                    {userDetails &&
                      userDetails.firstThreePurchases &&
                      userDetails.firstThreePurchases.length > 0 && (
                        <>
                          <p
                            className="text-center mt-4 text-xl font-medium"
                            style={{ color: "#ec660f" }}
                          >
                            First Three Purchases
                          </p>

                          {/* Summary stats for purchases */}
                          <div className="row mt-4 mb-6">
                            <div className="col-6">
                              <div
                                className="p-3 text-center rounded"
                                style={{ backgroundColor: "#2e2e2e" }}
                              >
                                <p
                                  className="text-sm font-medium"
                                  style={{ color: "#ec660f" }}
                                >
                                  Total Amount
                                </p>
                                <p className="text-xl font-bold text-white">
                                  {userDetails &&
                                    userDetails.firstThreePurchases
                                      .reduce(
                                        (sum, item) => sum + (item.amount || 0),
                                        0
                                      )
                                      .toLocaleString()}{" "}
                                  INR
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
                                  {userDetails &&
                                    userDetails.firstThreePurchases
                                      .reduce(
                                        (sum, item) => sum + (item.jaimax || 0),
                                        0
                                      )
                                      .toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Table */}
                          <div className="table-responsive mt-4">
                            <table
                              style={{
                                backgroundColor: "#2e2e2e",
                                border: "2px solid #3a3a3a",
                                borderRadius: "10px",
                                borderCollapse: "separate",
                                borderSpacing: 0,
                                overflow: "hidden",
                                width: "100%",
                              }}
                            >
                              <thead
                                style={{
                                  backgroundColor: "#ec660f",
                                  borderTopLeftRadius: "10px",
                                  borderTopRightRadius: "10px",
                                }}
                              >
                                <tr className="text-light">
                                  <th
                                    className="text-center p-2"
                                    style={{
                                      borderTopLeftRadius: "8px",
                                    }}
                                  >
                                    Purchase
                                  </th>
                                  <th className="text-center p-2">Date</th>
                                  <th className="text-center p-2">Amount</th>
                                  <th
                                    className="text-center p-2"
                                    style={{
                                      borderTopRightRadius: "8px",
                                    }}
                                  >
                                    JAIMAX Tokens
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {userDetails.firstThreePurchases?.map(
                                  (item, index) => (
                                    <tr
                                      key={index}
                                      style={{
                                        backgroundColor: "#2e2e2e",
                                        color: "#fff",
                                      }}
                                    >
                                      <td className="p-2 text-center">
                                        <span className="text-uppercase">
                                          {index + 1}
                                        </span>
                                      </td>
                                      <td className="p-2 text-center">
                                        {formatDate(item.createdAt)}
                                      </td>
                                      <td className="p-2 text-center">
                                        {(item.amount || 0).toLocaleString()}{" "}
                                        {item.currency}
                                      </td>
                                      <td className="p-2 text-center">
                                        {(item.jaimax || 0).toLocaleString()}
                                      </td>
                                    </tr>
                                  )
                                )}
                                {!userDetails.firstThreePurchases ||
                                  (userDetails.firstThreePurchases.length ===
                                    0 && (
                                      <tr>
                                        <td
                                          colSpan="4"
                                          className="text-center p-3"
                                        >
                                          No purchase data available
                                        </td>
                                      </tr>
                                    ))}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}
                  </div>
                </div>
              )}

              {/* Direct Referrals Table */}
              {refType === "direct" && referrals.length > 0 && (
                <div className="table-responsive p-3">
                  <h4 className="text-center mb-4" style={{ color: "#ec660f" }}>
                    Direct Referrals
                  </h4>
                  <table className="table table-bordered table-dark">
                    <thead style={{ backgroundColor: "#ec660f" }}>
                      <tr className="text-light">
                        <th className="text-center p-3">S.No</th>
                        <th className="text-center p-3">Name</th>
                        <th className="text-center p-3">Username</th>
                        <th className="text-center p-3">Phone</th>
                        <th className="text-center p-3">Email</th>
                        <th className="text-center p-3">Referral Bonus</th>
                        <th className="text-center p-3">Direct Referrals</th>
                        <th className="text-center p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referrals.map((user, index) => (
                        <tr
                          key={index}
                          style={{ backgroundColor: "#2e2e2e", color: "#fff" }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#444")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#2e2e2e")
                          }
                        >
                          <td className="text-center p-3">{index + 1}</td>
                          <td className="p-3">{user.name}</td>
                          <td className="p-3">{user.username}</td>
                          <td className="p-3">{user.phone}</td>
                          <td className="p-3">{user.email}</td>
                          <td className="p-3">₹{user.referenceInr}</td>
                          <td className="p-3 text-center">
                            {user.referenceCount}
                          </td>
                          <td className="p-3 text-center d-flex gap-2 justify-content-center">
                            <button
                              className="btn btn-sm"
                              style={{
                                backgroundColor: "#ec660f",
                                color: "white",
                              }}
                              onClick={() => showUserPurchases(user)}
                              disabled={
                                !user.firstThreePurchases ||
                                user.firstThreePurchases.length === 0
                              }
                            >
                              Purchases
                            </button>
                            <button
                              className="btn btn-sm"
                              style={{
                                backgroundColor: "#ec660f",
                                color: "white",
                              }}
                              onClick={() => showUserInvestments(user)}
                              disabled={
                                !user.firstThreeInvestments ||
                                user.firstThreeInvestments.length === 0
                              }
                            >
                              Investments
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Chain Referrals Table */}
              {refType === "chain" && referrals.length > 0 && (
                <div className="table-responsive p-3">
                  <h4 className="text-center mb-4" style={{ color: "#ec660f" }}>
                    Chain Referrals
                  </h4>
                  <table
                    className="table table-bordered table-dark"
                    style={{ backgroundColor: "#1b242d" }}
                  >
                    <thead style={{ backgroundColor: "#ec660f" }}>
                      <tr className="text-light">
                        <th className="text-center p-3">S.No</th>
                        <th className="text-center p-3">Name</th>
                        <th className="text-center p-3">Username</th>
                        <th className="text-center p-3">Phone</th>
                        <th className="text-center p-3">Email</th>
                        <th className="text-center p-3">Referral Bonus</th>
                        <th className="text-center p-3">Chain Referrals</th>
                        <th className="text-center p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referrals.map((user, index) => (
                        <tr
                          key={index}
                          style={{ backgroundColor: "#2e2e2e", color: "#fff" }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#444")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#2e2e2e")
                          }
                        >
                          <td className="text-center p-3">{index + 1}</td>
                          <td className="p-3">{user.name}</td>
                          <td className="p-3">{user.username}</td>
                          <td className="p-3">{user.phone}</td>
                          <td className="p-3">{user.email}</td>
                          <td className="p-3">₹{user.referenceInr}</td>
                          <td className="p-3 text-center">
                            {user.referenceCount}
                          </td>
                          <td className="p-3 text-center d-flex gap-2 justify-content-center">
                            <button
                              className="btn btn-sm"
                              style={{
                                backgroundColor: "#ec660f",
                                color: "white",
                              }}
                              onClick={() => showUserPurchases(user)}
                              disabled={
                                !user.firstThreePurchases ||
                                user.firstThreePurchases.length === 0
                              }
                            >
                              Purchases
                            </button>
                            <button
                              className="btn btn-sm"
                              style={{
                                backgroundColor: "#ec660f",
                                color: "white",
                              }}
                              onClick={() => showUserInvestments(user)}
                              disabled={
                                !user.firstThreeInvestments ||
                                user.firstThreeInvestments.length === 0
                              }
                            >
                              Investments
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Modal for displaying user purchases or investments */}
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
                    {selectedUser?.name}'s{" "}
                    {modalType === "purchases"
                      ? "First Three Purchases"
                      : "First Three Investments"}
                  </Modal.Title>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    aria-label="Close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </Modal.Header>
                <Modal.Body
                  style={{ backgroundColor: "#1b242d", color: "#fff" }}
                >
                  {selectedUser && (
                    <>
                      <div className="row mb-4">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <strong>Name:</strong> {selectedUser.name}
                          </div>
                          <div className="mb-3">
                            <strong>Username:</strong> {selectedUser.username}
                          </div>
                          <div className="mb-3">
                            <strong>Email:</strong> {selectedUser.email}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <strong>Phone:</strong> {selectedUser.phone}
                          </div>
                          <div className="mb-3">
                            <strong>Referral Bonus:</strong> ₹
                            {selectedUser.referenceInr}
                          </div>
                          <div className="mb-3">
                            <strong>Direct Referrals:</strong>{" "}
                            {selectedUser.referenceCount}
                          </div>
                        </div>
                      </div>

                      {/* Show either Purchases or Investments based on modalType */}
                      {modalType === "purchases" &&
                        selectedUser.firstThreePurchases && (
                          <>
                            {/* Summary stats for purchases */}
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
                                    Total Amount
                                  </p>
                                  <p className="text-xl font-bold text-white">
                                    {selectedUser.firstThreePurchases
                                      .reduce(
                                        (sum, item) => sum + (item.amount || 0),
                                        0
                                      )
                                      .toLocaleString()}{" "}
                                    INR
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
                                    {selectedUser.firstThreePurchases
                                      .reduce(
                                        (sum, item) => sum + (item.jaimax || 0),
                                        0
                                      )
                                      .toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Purchases table */}
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
                                      Purchase
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
                                  </tr>
                                </thead>
                                <tbody>
                                  {selectedUser.firstThreePurchases?.map(
                                    (item, index) => (
                                      <tr
                                        key={index}
                                        style={{
                                          backgroundColor:
                                            index % 2 === 0
                                              ? "#2e2e2e"
                                              : "#262626",
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
                                            index % 2 === 0
                                              ? "#2e2e2e"
                                              : "#262626";
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
                                            {(
                                              item.amount || 0
                                            ).toLocaleString()}{" "}
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
                                          {(item.jaimax || 0).toLocaleString()}{" "}
                                          <span>Tokens</span>
                                        </td>
                                      </tr>
                                    )
                                  )}
                                  {!selectedUser.firstThreePurchases ||
                                    selectedUser.firstThreePurchases.length ===
                                    0 ? (
                                    <tr
                                      style={{
                                        backgroundColor: "#2e2e2e",
                                      }}
                                    >
                                      <td
                                        colSpan="4"
                                        style={{
                                          textAlign: "center",
                                          padding: "16px",
                                          color: "#999",
                                          fontStyle: "italic",
                                        }}
                                      >
                                        No purchase data available
                                      </td>
                                    </tr>
                                  ) : null}
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}

                      {/* Investments section shown when modalType is "investments" */}
                      {modalType === "investments" &&
                        selectedUser.firstThreeInvestments && (
                          <>
                            {/* Summary stats for investments */}
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
                                    Total Investment
                                  </p>
                                  <p className="text-xl font-bold text-white">
                                    {selectedUser &&
                                      selectedUser.firstThreeInvestments
                                        .reduce(
                                          (sum, item) =>
                                            sum + (item.transactionAmount || 0),
                                          0
                                        )
                                        .toLocaleString()}{" "}
                                    INR
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
                                    Payment Methods
                                  </p>
                                  <p className="text-xl font-bold text-white">
                                    {(selectedUser &&
                                      selectedUser.firstThreeInvestments &&
                                      Array.from(
                                        new Set(
                                          selectedUser.firstThreeInvestments.map(
                                            (item) => item.paymentMode
                                          )
                                        )
                                      ).join(", ")) ||
                                      "N/A"}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Investments table */}
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
                                  </tr>
                                </thead>
                                <tbody>
                                  {selectedUser.firstThreeInvestments?.map(
                                    (item, index) => (
                                      <tr
                                        key={index}
                                        style={{
                                          backgroundColor:
                                            index % 2 === 0
                                              ? "#2e2e2e"
                                              : "#262626",
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
                                            index % 2 === 0
                                              ? "#2e2e2e"
                                              : "#262626";
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
                                      </tr>
                                    )
                                  )}
                                  {!selectedUser.firstThreeInvestments ||
                                    selectedUser.firstThreeInvestments.length ===
                                    0 ? (
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
                                        No investment data available
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
                </Modal.Footer>
              </Modal>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Userinfo;
