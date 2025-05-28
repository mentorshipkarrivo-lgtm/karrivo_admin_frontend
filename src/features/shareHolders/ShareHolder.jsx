// src/features/shareHolders/ShareHolder.jsx
// import React, { useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { useGetShareHoldersQuery } from "./shareHoldersApiSlice";
// import DashboardLayout from "../../Layout/DashboardLayout";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";

// function getPhone(phone) {
//   if (typeof phone === "object" && phone?.$numberLong) {
//     return phone.$numberLong;
//   }
//   return phone || "N/A";
// }

// const ShareHolderDashboard = () => {
//   const [currentPage, setCurrentPage] = useState(1);

//   // Using the RTK Query hook instead of axios
//   const {
//     data: shareHoldersData,
//     isLoading,
//     error,
//   } = useGetShareHoldersQuery(currentPage);

//   // Extract users and pagination from the response
//   const users = shareHoldersData?.data?.data || [];
//   const pagination = shareHoldersData?.data?.pagination || {};

//   // Handle page changes
//   const handlePageChange = (page) => {
//     setCurrentPage(page);

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   // Get the logged in user from local storage
//   const loggedInUsername = localStorage.getItem("username");
//   const currentUser = users.find((u) => u.username === loggedInUsername);

//   // Notification for eligibility
//   useEffect(() => {
//     if (currentUser && currentUser.isEligibleForShareHolder) {
//       alert(
//         `🎉 Congratulations ${currentUser.username}! You are now eligible to be a shareholder!`
//       );
//     }
//   }, [currentUser]);

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
//         <div className="container-fluid">
//           <div className="container">
//             <div className="rounded-3 py-3">
//               <h4 className="text-center fw-bold" style={{ color: "#ec660f" }}>
//                 Shareholder Eligibility Dashboard
//               </h4>
//             </div>
//           </div>
//         </div>

//         <div className="container">
//           <div className="table_data table-responsive p-3">
//             <table
//               className="table table-dark"
//               style={{
//                 backgroundColor: "#1b242d",
//                 border: "1px solid #303f50",
//               }}
//             >
//               <thead style={{ backgroundColor: "#ec660f" }}>
//                 <tr className="text-light">
//                   <th
//                     className="text-center p-3"
//                     style={{ backgroundColor: "#ec660f" }}
//                   >
//                     S/N
//                   </th>
//                   <th
//                     className="text-center p-3"
//                     style={{ backgroundColor: "#ec660f" }}
//                   >
//                     Username
//                   </th>
//                   <th
//                     className="text-center p-3"
//                     style={{ backgroundColor: "#ec660f" }}
//                   >
//                     Full Name
//                   </th>
//                   <th
//                     className="text-center p-3"
//                     style={{ backgroundColor: "#ec660f" }}
//                   >
//                     Progress
//                   </th>
//                   <th
//                     className="text-center p-3"
//                     style={{ backgroundColor: "#ec660f" }}
//                   >
//                     Direct Referrals
//                   </th>
//                   <th
//                     className="text-center p-3"
//                     style={{ backgroundColor: "#ec660f" }}
//                   >
//                     Email
//                   </th>
//                   <th
//                     className="text-center p-3"
//                     style={{ backgroundColor: "#ec660f" }}
//                   >
//                     Phone
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {isLoading ? (
//                   <>
//                     {[...Array(10)].map((_, i) => (
//                       <tr key={i}>
//                         <td className="p-3">
//                           <Skeleton height={24} />
//                         </td>
//                         <td className="p-3">
//                           <Skeleton height={24} />
//                         </td>
//                         <td className="p-3">
//                           <Skeleton height={24} />
//                         </td>
//                         <td className="p-3" style={{ minWidth: "200px" }}>
//                           <Skeleton height={24} />
//                         </td>
//                         <td className="p-3">
//                           <Skeleton height={24} />
//                         </td>
//                         <td className="p-3">
//                           <Skeleton height={24} />
//                         </td>
//                         <td className="p-3">
//                           <Skeleton height={24} />
//                         </td>
//                       </tr>
//                     ))}
//                   </>
//                 ) : error ? (
//                   <tr>
//                     <td colSpan="7" className="text-center">
//                       <div className="alert alert-danger">{error}</div>
//                     </td>
//                   </tr>
//                 ) : users.length === 0 ? (
//                   <tr>
//                     <td colSpan="7" className="text-center">
//                       No data found
//                     </td>
//                   </tr>
//                 ) : (
//                   users.map((user, index) => {
//                     const startingIndex =
//                       (pagination.currentPage - 1) * pagination.perPage;
//                     return (
//                       <tr key={user.username}>
//                         <td className="text-center p-3">
//                           {startingIndex + index + 1}
//                         </td>
//                         <td className="text-center p-3">{user.username}</td>
//                         <td className="text-center p-3">
//                           {user.name || "N/A"}
//                         </td>
//                         <td
//                           className="text-center p-3"
//                           style={{ minWidth: "200px" }}
//                         >
//                           <div
//                             className="progress"
//                             style={{
//                               height: "24px",
//                               borderRadius: "50px",
//                               overflow: "hidden",
//                               boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.2)",
//                               position: "relative",
//                             }}
//                           >
//                             <div
//                               className="progress-bar"
//                               role="progressbar"
//                               style={{
//                                 width: `${user.eligibilityPercentage}%`,
//                                 borderRadius: "50px",
//                                 fontWeight: "bold",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 backgroundColor: user.isEligibleForShareHolder
//                                   ? "#28a745"
//                                   : "#ec660f",
//                               }}
//                               aria-valuenow={user.eligibilityPercentage}
//                               aria-valuemin="0"
//                               aria-valuemax="100"
//                             ></div>
//                             <span
//                               style={{
//                                 position: "absolute",
//                                 left: "50%",
//                                 top: "50%",
//                                 transform: "translate(-50%, -50%)",
//                                 color: "#ec660f",
//                                 fontWeight: "bold",
//                               }}
//                             >
//                               {user.progressStatus}
//                             </span>
//                           </div>
//                         </td>
//                         <td className="text-center p-3">
//                           {user.directReferrals}
//                         </td>
//                         <td className="text-center p-3">{user.email}</td>
//                         <td className="text-center p-3">
//                           {getPhone(user.phone)}
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination controls - only show when not loading and has data */}
//           {!isLoading && !error && pagination && pagination.totalPages > 1 && (
//             <div className="d-flex justify-content-center my-4">
//               <nav aria-label="Shareholders pagination">
//                 <ul className="pagination">
//                   <li
//                     className={`page-item ${
//                       !pagination.hasPrevPage ? "disabled" : ""
//                     }`}
//                   >
//                     <button
//                       className="page-link"
//                       onClick={() =>
//                         handlePageChange(pagination.currentPage - 1)
//                       }
//                       disabled={!pagination.hasPrevPage}
//                       style={{
//                         backgroundColor: "#2e2e2e",
//                         color: "#ec660f",
//                         borderColor: "#444",
//                       }}
//                     >
//                       Previous
//                     </button>
//                   </li>

//                   {Array.from(
//                     { length: Math.min(5, pagination.totalPages) },
//                     (_, i) => {
//                       // Calculate which page numbers to show
//                       let pageNum;
//                       if (pagination.totalPages <= 5) {
//                         pageNum = i + 1;
//                       } else if (pagination.currentPage <= 3) {
//                         pageNum = i + 1;
//                       } else if (
//                         pagination.currentPage >=
//                         pagination.totalPages - 2
//                       ) {
//                         pageNum = pagination.totalPages - 4 + i;
//                       } else {
//                         pageNum = pagination.currentPage - 2 + i;
//                       }

//                       return (
//                         <li
//                           key={pageNum}
//                           className={`page-item ${
//                             pageNum === pagination.currentPage ? "active" : ""
//                           }`}
//                         >
//                           <button
//                             className="page-link"
//                             onClick={() => handlePageChange(pageNum)}
//                             style={{
//                               backgroundColor:
//                                 pageNum === pagination.currentPage
//                                   ? "#ec660f"
//                                   : "#2e2e2e",
//                               color:
//                                 pageNum === pagination.currentPage
//                                   ? "#fff"
//                                   : "#ec660f",
//                               borderColor: "#444",
//                             }}
//                           >
//                             {pageNum}
//                           </button>
//                         </li>
//                       );
//                     }
//                   )}

//                   <li
//                     className={`page-item ${
//                       !pagination.hasNextPage ? "disabled" : ""
//                     }`}
//                   >
//                     <button
//                       className="page-link"
//                       onClick={() =>
//                         handlePageChange(pagination.currentPage + 1)
//                       }
//                       disabled={!pagination.hasNextPage}
//                       style={{
//                         backgroundColor: "#2e2e2e",
//                         color: "#ec660f",
//                         borderColor: "#444",
//                       }}
//                     >
//                       Next
//                     </button>
//                   </li>
//                 </ul>
//               </nav>
//             </div>
//           )}

//           {/* User Details Panel - Shows detailed information for qualified members */}
//           {!isLoading &&
//             !error &&
//             currentUser &&
//             currentUser.qualifiedMembersList &&
//             currentUser.qualifiedMembersList.length > 0 && (
//               <div
//                 className="container mt-4"
//                 style={{ backgroundColor: "#1b242d" }}
//               >
//                 <div className="rounded-3 p-3">
//                   <h5 className="fw-bold py-2" style={{ color: "#ec660f" }}>
//                     Your Qualified Team Members (
//                     {currentUser.qualifiedMembersList.length})
//                   </h5>
//                   <div className="table-responsive">
//                     <table className="table table-bordered table-dark">
//                       <thead style={{ backgroundColor: "#ec660f" }}>
//                         <tr className="text-light">
//                           <th className="text-center p-2">Username</th>
//                           <th className="text-center p-2">Direct Referrals</th>
//                           <th className="text-center p-2">Chain Referrals</th>
//                           <th className="text-center p-2">Total Referrals</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {currentUser.qualifiedMembersList.map((member) => (
//                           <tr
//                             key={member.username}
//                             style={{ backgroundColor: "#2e2e2e" }}
//                           >
//                             <td className="p-2">{member.username}</td>
//                             <td className="text-center p-2">
//                               {member.directReferrals}
//                             </td>
//                             <td className="text-center p-2">
//                               {member.chainReferrals}
//                             </td>
//                             <td className="text-center p-2">
//                               {member.totalReferrals}
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             )}
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default ShareHolderDashboard;

// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { useGetShareHoldersQuery } from "./shareHoldersApiSlice";
// import DashboardLayout from "../../Layout/DashboardLayout";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";

// // Utility functions moved outside component to prevent recreation
// function getPhone(phone) {
//   if (typeof phone === "object" && phone?.$numberLong) {
//     return phone.$numberLong;
//   }
//   return phone || "N/A";
// }

// const ShareHolderDashboard = () => {
//   const [currentPage, setCurrentPage] = useState(1);

//   // Using the RTK Query hook with optimized response handling
//   const {
//     data: shareHoldersData,
//     isLoading,
//     error,
//     isFetching,
//   } = useGetShareHoldersQuery(currentPage, {
//     pollingInterval: 60000,
//     refetchOnMountOrArgChange: true,
//     skipPollingIfPageIsInBackground: true,
//   });
//   //   console.log("ShareHoldersData", shareHoldersData);

//   // Extract users and pagination from the response using useMemo with better error handling
//   const { users, pagination } = useMemo(() => {
//     try {
//       if (!shareHoldersData?.data) {
//         return { users: [], pagination: {} };
//       }
//       return {
//         users: Array.isArray(shareHoldersData.data.data)
//           ? shareHoldersData.data.data
//           : [],
//         pagination: shareHoldersData.data.pagination || {},
//       };
//     } catch (e) {
//       console.error("Error parsing shareHolders data:", e);
//       return { users: [], pagination: {} };
//     }
//   }, [shareHoldersData]);

//   // Handle page changes with useCallback + debounce pattern
//   const handlePageChange = useCallback(
//     (page) => {
//       // Don't update if already fetching or if same page
//       if (isFetching || page === currentPage) return;

//       setCurrentPage(page);

//       window.scrollTo({
//         top: 0,
//         behavior: "smooth",
//       });
//     },
//     [currentPage, isFetching]
//   );

//   // Get the logged in user from local storage using useMemo with caching strategy
//   const currentUser = useMemo(() => {
//     const loggedInUsername = localStorage.getItem("username");
//     if (!loggedInUsername || !users.length) return null;

//     return users.find((u) => u.username === loggedInUsername) || null;
//   }, [users]);

//   // Notification for eligibility - using useEffect with proper cleanup
//   useEffect(() => {
//     let alertTimeout;

//     if (currentUser && currentUser.isEligibleForShareHolder) {
//       // Delay alert to ensure smooth rendering
//       alertTimeout = setTimeout(() => {
//         alert(
//           `🎉 Congratulations ${currentUser.username}! You are now eligible to be a shareholder!`
//         );
//       }, 500);
//     }

//     // Clean up timeout on unmount
//     return () => {
//       if (alertTimeout) clearTimeout(alertTimeout);
//     };
//   }, [currentUser]);

//   // No longer need this function since we're handling errors directly in the img tag
//   // and we don't have a default image path anymore

//   // Function to get profile display (image or emoji)
//   const getProfileDisplay = (user) => {
//     if (user.isEligibleForShareHolder && user.profileImage) {
//       // Return image from backend for eligible shareholders
//       return (
//         <img
//           src={user.profileImage}
//           alt={`${user.username}'s profile`}
//           className="rounded-circle"
//           style={{ width: "40px", height: "40px", objectFit: "cover" }}
//           onError={(e) => {
//             e.target.onerror = null;
//             e.target.style.display = "none";
//             e.target.parentNode.innerHTML = `<div style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background-color: #28a745; color: white; border-radius: 50%; font-size: 20px;">${DEFAULT_PROFILE}</div>`;
//           }}
//         />
//       );
//     } else {
//       // Return emoji for all non-eligible users (gray for normal, green for eligible)
//       return (
//         <div
//           style={{
//             width: "40px",
//             height: "40px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             backgroundColor: user.isEligibleForShareHolder
//               ? "#28a745"
//               : "#2e2e2e",
//             color: user.isEligibleForShareHolder ? "white" : "#aaa",
//             borderRadius: "50%",
//             fontSize: "20px",
//           }}
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="#ffffff"
//             stroke-width="2"
//             stroke-linecap="round"
//             stroke-linejoin="round"
//             class="lucide lucide-user-round-icon lucide-user-round"
//           >
//             <circle cx="12" cy="8" r="5" />
//             <path d="M20 21a8 8 0 0 0-16 0" />
//           </svg>
//         </div>
//       );
//     }
//   };

//   // 1. Table content with conditional rendering and profile images
//   const tableContent = useMemo(() => {
//     if (isLoading) {
//       return [...Array(10)].map((_, i) => (
//         <tr key={i}>
//           {[...Array(8)].map((_, cellIndex) => (
//             <td
//               key={`cell-${i}-${cellIndex}`}
//               className="p-3"
//               style={cellIndex === 4 ? { minWidth: "200px" } : {}}
//             >
//               <Skeleton height={24} />
//             </td>
//           ))}
//         </tr>
//       ));
//     }

//     if (error) {
//       return (
//         <tr>
//           <td colSpan="8" className="text-center">
//             <div className="alert alert-danger">{error.toString()}</div>
//           </td>
//         </tr>
//       );
//     }

//     if (!users.length) {
//       return (
//         <tr>
//           <td colSpan="8" className="text-center">
//             No data found
//           </td>
//         </tr>
//       );
//     }

//     const startingIndex =
//       (pagination.currentPage - 1) * (pagination.perPage || 10);

//     return users.map((user, index) => (
//       <tr key={user.username || index}>
//         <td className="text-center p-3">{startingIndex + index + 1}</td>
//         <td className="text-center p-3">{getProfileDisplay(user)}</td>
//         <td className="text-center p-3">{user.username}</td>
//         <td className="text-center p-3">{user.name || "N/A"}</td>
//         <td className="text-center p-3" style={{ minWidth: "200px" }}>
//           <div
//             className="progress"
//             style={{
//               height: "24px",
//               borderRadius: "50px",
//               overflow: "hidden",
//               boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.2)",
//               position: "relative",
//             }}
//           >
//             <div
//               className="progress-bar"
//               role="progressbar"
//               style={{
//                 width: `${user.eligibilityPercentage || 0}%`,
//                 borderRadius: "50px",
//                 fontWeight: "bold",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 backgroundColor: user.isEligibleForShareHolder
//                   ? "#28a745"
//                   : "#ec660f",
//               }}
//               aria-valuenow={user.eligibilityPercentage || 0}
//               aria-valuemin="0"
//               aria-valuemax="100"
//             ></div>
//             <span
//               style={{
//                 position: "absolute",
//                 left: "50%",
//                 top: "50%",
//                 transform: "translate(-50%, -50%)",
//                 color: "#ec660f",
//                 fontWeight: "bold",
//               }}
//             >
//               {user.progressStatus || `${user.eligibilityPercentage || 0}%`}
//             </span>
//           </div>
//         </td>
//         <td className="text-center p-3">{user.directReferrals || 0}</td>
//         <td className="text-center p-3">{user.email || "N/A"}</td>
//         <td className="text-center p-3">{getPhone(user.phone)}</td>
//       </tr>
//     ));
//   }, [users, pagination.currentPage, pagination.perPage, isLoading, error]);

//   // 2. Pagination component
//   const paginationComponent = useMemo(() => {
//     if (
//       isLoading ||
//       isFetching ||
//       error ||
//       !pagination ||
//       !pagination.totalPages ||
//       pagination.totalPages <= 1
//     ) {
//       return null;
//     }

//     return (
//       <div className="d-flex justify-content-center my-4">
//         <nav aria-label="Shareholders pagination">
//           <ul className="pagination">
//             <li
//               className={`page-item ${
//                 !pagination.hasPrevPage ? "disabled" : ""
//               }`}
//             >
//               <button
//                 className="page-link"
//                 onClick={() => handlePageChange(pagination.currentPage - 1)}
//                 disabled={!pagination.hasPrevPage || isFetching}
//                 style={{
//                   backgroundColor: "#2e2e2e",
//                   color: "#ec660f",
//                   borderColor: "#444",
//                 }}
//               >
//                 Previous
//               </button>
//             </li>

//             {Array.from(
//               { length: Math.min(5, pagination.totalPages) },
//               (_, i) => {
//                 // Calculate which page numbers to show
//                 let pageNum;
//                 if (pagination.totalPages <= 5) {
//                   pageNum = i + 1;
//                 } else if (pagination.currentPage <= 3) {
//                   pageNum = i + 1;
//                 } else if (
//                   pagination.currentPage >=
//                   pagination.totalPages - 2
//                 ) {
//                   pageNum = pagination.totalPages - 4 + i;
//                 } else {
//                   pageNum = pagination.currentPage - 2 + i;
//                 }

//                 return (
//                   <li
//                     key={pageNum}
//                     className={`page-item ${
//                       pageNum === pagination.currentPage ? "active" : ""
//                     }`}
//                   >
//                     <button
//                       className="page-link"
//                       onClick={() => handlePageChange(pageNum)}
//                       disabled={isFetching}
//                       style={{
//                         backgroundColor:
//                           pageNum === pagination.currentPage
//                             ? "#ec660f"
//                             : "#2e2e2e",
//                         color:
//                           pageNum === pagination.currentPage
//                             ? "#fff"
//                             : "#ec660f",
//                         borderColor: "#444",
//                       }}
//                     >
//                       {pageNum}
//                     </button>
//                   </li>
//                 );
//               }
//             )}

//             <li
//               className={`page-item ${
//                 !pagination.hasNextPage ? "disabled" : ""
//               }`}
//             >
//               <button
//                 className="page-link"
//                 onClick={() => handlePageChange(pagination.currentPage + 1)}
//                 disabled={!pagination.hasNextPage || isFetching}
//                 style={{
//                   backgroundColor: "#2e2e2e",
//                   color: "#ec660f",
//                   borderColor: "#444",
//                 }}
//               >
//                 Next
//               </button>
//             </li>
//           </ul>
//         </nav>
//       </div>
//     );
//   }, [pagination, handlePageChange, isLoading, isFetching, error]);

//   const loadingIndicator = useMemo(() => {
//     if (!isFetching || isLoading) return null; // Only show when fetching but not initial load

//     return (
//       <div>
//         <div
//           class="spinner-border spinner-border-sm me-2 position-fixed top-50 start-50 translate-middle"
//           role="status"
//         >
//           <span class="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }, [isFetching, isLoading]);

//   return (
//     <DashboardLayout>
//       {/* {loadingIndicator} */}
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
//         <div className="container-fluid">
//           <div className="container">
//             <div className="rounded-3 py-3">
//               <h4 className="text-center fw-bold" style={{ color: "#ec660f" }}>
//                 Shareholder Eligibility Dashboard
//               </h4>
//             </div>
//           </div>
//         </div>

//         <div className="container">
//           <div className="table_data table-responsive p-3">
//             <table
//               className="table table-dark"
//               style={{
//                 backgroundColor: "#1b242d",
//                 border: "1px solid #303f50",
//               }}
//             >
//               <thead style={{ backgroundColor: "#ec660f" }}>
//                 <tr className="text-light">
//                   <th
//                     className="text-center p-3"
//                     style={{ backgroundColor: "#ec660f" }}
//                   >
//                     S/N
//                   </th>
//                   <th
//                     className="text-center p-3"
//                     style={{ backgroundColor: "#ec660f" }}
//                   >
//                     Profile
//                   </th>
//                   <th
//                     className="text-center p-3"
//                     style={{ backgroundColor: "#ec660f" }}
//                   >
//                     Username
//                   </th>
//                   <th
//                     className="text-center p-3"
//                     style={{ backgroundColor: "#ec660f" }}
//                   >
//                     Full Name
//                   </th>
//                   <th
//                     className="text-center p-3"
//                     style={{ backgroundColor: "#ec660f" }}
//                   >
//                     Progress
//                   </th>
//                   <th
//                     className="text-center p-3"
//                     style={{ backgroundColor: "#ec660f" }}
//                   >
//                     Direct Referrals
//                   </th>
//                   <th
//                     className="text-center p-3"
//                     style={{ backgroundColor: "#ec660f" }}
//                   >
//                     Email
//                   </th>
//                   <th
//                     className="text-center p-3"
//                     style={{ backgroundColor: "#ec660f" }}
//                   >
//                     Phone
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loadingIndicator}
//                 {tableContent}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination controls */}
//           {paginationComponent}
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default ShareHolderDashboard;

// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { useGetShareHoldersQuery } from "./shareHoldersApiSlice";
// import DashboardLayout from "../../Layout/DashboardLayout";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";

// // Utility functions moved outside component to prevent recreation
// function getPhone(phone) {
//   if (typeof phone === "object" && phone?.$numberLong) {
//     return phone.$numberLong;
//   }
//   return phone || "N/A";
// }

// const ShareHolderDashboard = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isNavigating, setIsNavigating] = useState(false); // New state for page navigation

//   // Using the RTK Query hook with optimized response handling
//   const {
//     data: shareHoldersData,
//     isLoading,
//     error,
//     isFetching,
//   } = useGetShareHoldersQuery(currentPage, {
//     pollingInterval: 60000,
//     refetchOnMountOrArgChange: true,
//     skipPollingIfPageIsInBackground: true,
//   });
//   //   console.log("ShareHoldersData", shareHoldersData);

//   // Extract users and pagination from the response using useMemo with better error handling
//   const { users, pagination } = useMemo(() => {
//     try {
//       if (!shareHoldersData?.data) {
//         return { users: [], pagination: {} };
//       }
//       return {
//         users: Array.isArray(shareHoldersData.data.data)
//           ? shareHoldersData.data.data
//           : [],
//         pagination: shareHoldersData.data.pagination || {},
//       };
//     } catch (e) {
//       console.error("Error parsing shareHolders data:", e);
//       return { users: [], pagination: {} };
//     }
//   }, [shareHoldersData]);

//   // Handle page changes with useCallback + debounce pattern
//   const handlePageChange = useCallback(
//     (page) => {
//       // Don't update if already fetching or if same page
//       if (isFetching || page === currentPage) return;

//       // Set navigating to true to show the full-screen loader
//       setIsNavigating(true);
//       setCurrentPage(page);

//       window.scrollTo({
//         top: 0,
//         behavior: "smooth",
//       });
//     },
//     [currentPage, isFetching]
//   );

//   // Effect to handle when data fetching is complete
//   useEffect(() => {
//     if (!isLoading && !isFetching && isNavigating) {
//       setIsNavigating(false);
//     }
//   }, [isLoading, isFetching, isNavigating]);

//   // Get the logged in user from local storage using useMemo with caching strategy
//   const currentUser = useMemo(() => {
//     const loggedInUsername = localStorage.getItem("username");
//     if (!loggedInUsername || !users.length) return null;

//     return users.find((u) => u.username === loggedInUsername) || null;
//   }, [users]);

//   // Function to get profile display (image or emoji)
//   const getProfileDisplay = (user) => {
//     if (user.isEligibleForShareHolder && user.profileImage) {
//       // Return image from backend for eligible shareholders
//       return (
//         <img
//           src={user.profileImage}
//           alt={`${user.username}'s profile`}
//           className="rounded-circle"
//           style={{ width: "40px", height: "40px", objectFit: "cover" }}
//           onError={(e) => {
//             e.target.onerror = null;
//             e.target.style.display = "none";
//             e.target.parentNode.innerHTML = `<div style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background-color: #28a745; color: white; border-radius: 50%; font-size: 20px;">${DEFAULT_PROFILE}</div>`;
//           }}
//         />
//       );
//     } else {
//       // Return emoji for all non-eligible users (gray for normal, green for eligible)
//       return (
//         <div
//           style={{
//             width: "40px",
//             height: "40px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             backgroundColor: user.isEligibleForShareHolder
//               ? "#28a745"
//               : "#2e2e2e",
//             color: user.isEligibleForShareHolder ? "white" : "#aaa",
//             borderRadius: "50%",
//             fontSize: "20px",
//           }}
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="#ffffff"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             className="lucide lucide-user-round-icon lucide-user-round"
//           >
//             <circle cx="12" cy="8" r="5" />
//             <path d="M20 21a8 8 0 0 0-16 0" />
//           </svg>
//         </div>
//       );
//     }
//   };

//   // 1. Table content with conditional rendering and profile images
//   const tableContent = useMemo(() => {
//     if (isLoading) {
//       return [...Array(10)].map((_, i) => (
//         <tr key={i}>
//           {[...Array(8)].map((_, cellIndex) => (
//             <td
//               key={`cell-${i}-${cellIndex}`}
//               className="p-3"
//               style={cellIndex === 4 ? { minWidth: "200px" } : {}}
//             >
//               <Skeleton height={24} />
//             </td>
//           ))}
//         </tr>
//       ));
//     }

//     if (error) {
//       const errorMessage =
//         error.message || error.error || JSON.stringify(error);
//       return (
//         <tr>
//           <td colSpan="8" className="text-center">
//             <div className="alert alert-danger">{errorMessage}</div>
//           </td>
//         </tr>
//       );
//     }

//     if (!users.length) {
//       return (
//         <tr>
//           <td colSpan="8" className="text-center">
//             No data found
//           </td>
//         </tr>
//       );
//     }

//     const startingIndex =
//       (pagination.currentPage - 1) * (pagination.perPage || 10);

//     return users.map((user, index) => (
//       <tr key={user.username || index}>
//         <td className="text-center p-3">{startingIndex + index + 1}</td>
//         <td className="text-center p-3">{getProfileDisplay(user)}</td>
//         <td className="text-center p-3">{user.username}</td>
//         <td className="text-center p-3">{user.name || "N/A"}</td>
//         <td className="text-center p-3" style={{ minWidth: "200px" }}>
//           <div
//             className="progress"
//             style={{
//               height: "24px",
//               borderRadius: "50px",
//               overflow: "hidden",
//               boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.2)",
//               position: "relative",
//             }}
//           >
//             <div
//               className="progress-bar"
//               role="progressbar"
//               style={{
//                 width: `${user.eligibilityPercentage || 0}%`,
//                 borderRadius: "50px",
//                 fontWeight: "bold",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 backgroundColor: user.isEligibleForShareHolder
//                   ? "#28a745"
//                   : "#ec660f",
//               }}
//               aria-valuenow={user.eligibilityPercentage || 0}
//               aria-valuemin="0"
//               aria-valuemax="100"
//             ></div>
//             <span
//               style={{
//                 position: "absolute",
//                 left: "50%",
//                 top: "50%",
//                 transform: "translate(-50%, -50%)",
//                 color: "#ec660f",
//                 fontWeight: "bold",
//               }}
//             >
//               {user.progressStatus || `${user.eligibilityPercentage || 0}%`}
//             </span>
//           </div>
//         </td>
//         <td className="text-center p-3">{user.directReferrals || 0}</td>
//         <td className="text-center p-3">{user.email || "N/A"}</td>
//         <td className="text-center p-3">{getPhone(user.phone)}</td>
//       </tr>
//     ));
//   }, [users, pagination.currentPage, pagination.perPage, isLoading, error]);

//   // 2. Pagination component
//   const paginationComponent = useMemo(() => {
//     if (
//       isLoading ||
//       isFetching ||
//       error ||
//       !pagination ||
//       !pagination.totalPages ||
//       pagination.totalPages <= 1
//     ) {
//       return null;
//     }

//     return (
//       <div className="d-flex justify-content-center my-4">
//         <nav aria-label="Shareholders pagination">
//           <ul className="pagination">
//             <li
//               className={`page-item ${
//                 !pagination.hasPrevPage ? "disabled" : ""
//               }`}
//             >
//               <button
//                 className="page-link"
//                 onClick={() => handlePageChange(pagination.currentPage - 1)}
//                 disabled={!pagination.hasPrevPage || isFetching}
//                 style={{
//                   backgroundColor: "#2e2e2e",
//                   color: "#ec660f",
//                   borderColor: "#444",
//                 }}
//               >
//                 Previous
//               </button>
//             </li>

//             {Array.from(
//               { length: Math.min(5, pagination.totalPages) },
//               (_, i) => {
//                 // Calculate which page numbers to show
//                 let pageNum;
//                 if (pagination.totalPages <= 5) {
//                   pageNum = i + 1;
//                 } else if (pagination.currentPage <= 3) {
//                   pageNum = i + 1;
//                 } else if (
//                   pagination.currentPage >=
//                   pagination.totalPages - 2
//                 ) {
//                   pageNum = pagination.totalPages - 4 + i;
//                 } else {
//                   pageNum = pagination.currentPage - 2 + i;
//                 }

//                 return (
//                   <li
//                     key={pageNum}
//                     className={`page-item ${
//                       pageNum === pagination.currentPage ? "active" : ""
//                     }`}
//                   >
//                     <button
//                       className="page-link"
//                       onClick={() => handlePageChange(pageNum)}
//                       disabled={isFetching}
//                       style={{
//                         backgroundColor:
//                           pageNum === pagination.currentPage
//                             ? "#ec660f"
//                             : "#2e2e2e",
//                         color:
//                           pageNum === pagination.currentPage
//                             ? "#fff"
//                             : "#ec660f",
//                         borderColor: "#444",
//                       }}
//                     >
//                       {pageNum}
//                     </button>
//                   </li>
//                 );
//               }
//             )}

//             <li
//               className={`page-item ${
//                 !pagination.hasNextPage ? "disabled" : ""
//               }`}
//             >
//               <button
//                 className="page-link"
//                 onClick={() => handlePageChange(pagination.currentPage + 1)}
//                 disabled={!pagination.hasNextPage || isFetching}
//                 style={{
//                   backgroundColor: "#2e2e2e",
//                   color: "#ec660f",
//                   borderColor: "#444",
//                 }}
//               >
//                 Next
//               </button>
//             </li>
//           </ul>
//         </nav>
//       </div>
//     );
//   }, [pagination, handlePageChange, isLoading, isFetching, error]);

//   // Full-screen loader component
//   const fullScreenLoader = useMemo(() => {
//     if (!isNavigating) return null;

//     return (
//       <div
//         className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50"
//         style={{ zIndex: 9999 }}
//       >
//         <div className="spinner-border text-light" role="status">
//           {/* <span className="visually-hidden">Loading...</span> */}
//         </div>
//       </div>
//     );
//   }, [isNavigating]);

//   return (
//     <DashboardLayout>
//       {fullScreenLoader}
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
//         <div className="container-fluid">
//           <div className="container">
//             <div className="rounded-3 py-3">
//               <h4 className="text-center fw-bold" style={{ color: "#ec660f" }}>
//                 Shareholder Eligibility Dashboard
//               </h4>
//             </div>
//           </div>
//         </div>

//         <div className="container">
//           <div className="table_data table-responsive p-3">
//             <table
//               className="table table-dark"
//               style={{
//                 backgroundColor: "#1b242d",
//                 border: "1px solid #303f50",
//               }}
//             >
//               <thead style={{ backgroundColor: "#ec660f" }}>
//                 <tr className="text-light">
//                   <th
//                     className="text-center p-3"
//                     style={{ backgroundColor: "#ec660f" }}
//                   >
//                     S/N
//                   </th>
//                   <th
//                     className="text-center p-3"
//                     style={{ backgroundColor: "#ec660f" }}
//                   >
//                     Profile
//                   </th>
//                   <th
//                     className="text-center p-3"
//                     style={{ backgroundColor: "#ec660f" }}
//                   >
//                     Username
//                   </th>
//                   <th
//                     className="text-center p-3"
//                     style={{ backgroundColor: "#ec660f" }}
//                   >
//                     Full Name
//                   </th>
//                   <th
//                     className="text-center p-3"
//                     style={{ backgroundColor: "#ec660f" }}
//                   >
//                     Progress
//                   </th>
//                   <th
//                     className="text-center p-3"
//                     style={{ backgroundColor: "#ec660f" }}
//                   >
//                     Direct Referrals
//                   </th>
//                   <th
//                     className="text-center p-3"
//                     style={{ backgroundColor: "#ec660f" }}
//                   >
//                     Email
//                   </th>
//                   <th
//                     className="text-center p-3"
//                     style={{ backgroundColor: "#ec660f" }}
//                   >
//                     Phone
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>{tableContent}</tbody>
//             </table>
//           </div>

//           {/* Pagination controls */}
//           {paginationComponent}
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default ShareHolderDashboard;

import React, { useState, useEffect, useMemo, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useGetShareHoldersQuery } from "./shareHoldersApiSlice";
import DashboardLayout from "../../Layout/DashboardLayout";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Icon } from "@iconify/react/dist/iconify.js";
// import Modals from "../../components/Modals";
import { Button, Modal } from "react-bootstrap";
import { CheckCircle, XCircle, Hourglass } from "lucide-react";

// Utility functions moved outside component to prevent recreation
function getPhone(phone) {
  if (typeof phone === "object" && phone?.$numberLong) {
    return phone.$numberLong;
  }
  return phone || "N/A";
}

const ShareHolderDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isNavigating, setIsNavigating] = useState(false); // State for page navigation
  const [searchTerm, setSearchTerm] = useState(""); // New state for search functionality
  const [filteredUsers, setFilteredUsers] = useState([]); // State to store filtered users
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [qualifiedMembers, setQualifiedMembers] = useState([]);
  const [selectedUsername, setSelectedUsername] = useState(null);
  const handleShowUserDetails = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  // Using the RTK Query hook with optimized response handling
  const {
    data: shareHoldersData,
    isLoading,
    error,
    isFetching,
  } = useGetShareHoldersQuery(currentPage, {
    pollingInterval: 60000,
    refetchOnMountOrArgChange: true,
    skipPollingIfPageIsInBackground: true,
  });

  // Extract users and pagination from the response using useMemo with better error handling
  const { users, pagination } = useMemo(() => {
    try {
      if (!shareHoldersData?.data) {
        return { users: [], pagination: {} };
      }
      return {
        users: Array.isArray(shareHoldersData.data.data)
          ? shareHoldersData.data.data
          : [],
        pagination: shareHoldersData.data.pagination || {},
      };
    } catch (e) {
      console.error("Error parsing shareHolders data:", e);
      return { users: [], pagination: {} };
    }
  }, [shareHoldersData]);

  // Filter users based on search term
  useEffect(() => {
    if (!users.length || !searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }

    const lowercaseSearchTerm = searchTerm.toLowerCase().trim();
    const filtered = users.filter(
      (user) =>
        (user.username &&
          user.username.toLowerCase().includes(lowercaseSearchTerm)) ||
        (user.name && user.name.toLowerCase().includes(lowercaseSearchTerm)) ||
        (user.email && user.email.toLowerCase().includes(lowercaseSearchTerm))
    );

    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  // Handle search input changes
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // Reset search
  const handleResetSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  // Handle page changes with useCallback + debounce pattern
  const handlePageChange = useCallback(
    (page) => {
      // Don't update if already fetching or if same page
      if (isFetching || page === currentPage) return;

      // Reset search when changing pages
      setSearchTerm("");

      // Set navigating to true to show the full-screen loader
      setIsNavigating(true);
      setCurrentPage(page);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    [currentPage, isFetching]
  );

  // Effect to handle when data fetching is complete
  useEffect(() => {
    if (!isLoading && !isFetching && isNavigating) {
      setIsNavigating(false);
    }
  }, [isLoading, isFetching, isNavigating]);

  // Get the logged in user from local storage using useMemo with caching strategy
  const currentUser = useMemo(() => {
    const loggedInUsername = localStorage.getItem("username");
    if (!loggedInUsername || !users.length) return null;

    return users.find((u) => u.username === loggedInUsername) || null;
  }, [users]);

  // Function to get profile display (image or emoji)
  const getProfileDisplay = (user) => {
    if (user.isEligibleForShareHolder && user.profileImage) {
      // Return image from backend for eligible shareholders
      return (
        <img
          src={user.profileImage}
          alt={`${user.username}'s profile`}
          className="rounded-circle"
          style={{ width: "40px", height: "40px", objectFit: "cover" }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = "none";
            e.target.parentNode.innerHTML = `<div style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background-color: #28a745; color: white; border-radius: 50%; font-size: 20px;">${DEFAULT_PROFILE}</div>`;
          }}
        />
      );
    } else {
      // Return emoji for all non-eligible users (gray for normal, green for eligible)
      return (
        <div
          style={{
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: user.isEligibleForShareHolder
              ? "#28a745"
              : "#2e2e2e",
            color: user.isEligibleForShareHolder ? "white" : "#aaa",
            borderRadius: "50%",
            fontSize: "20px",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-user-round-icon lucide-user-round"
          >
            <circle cx="12" cy="8" r="5" />
            <path d="M20 21a8 8 0 0 0-16 0" />
          </svg>
        </div>
      );
    }
  };

  // 1. Table content with conditional rendering and profile images
  const tableContent = useMemo(() => {
    if (isLoading) {
      return [...Array(10)].map((_, i) => (
        <tr key={i}>
          {[...Array(9)].map((_, cellIndex) => (
            <td
              key={`cell-${i}-${cellIndex}`}
              className="p-3"
              style={cellIndex === 4 ? { minWidth: "200px" } : {}}
            >
              <Skeleton height={24} />
            </td>
          ))}
        </tr>
      ));
    }

    // if (error) {
    //   const errorMessage =
    //     error.message || error.error || JSON.stringify(error);
    //   return (
    //     <tr>
    //       <td colSpan="8" className="text-center">
    //         <div className="alert alert-danger">{errorMessage}</div>
    //       </td>
    //     </tr>
    //   );
    // }

    // If no users after filtering
    if (!filteredUsers.length) {
      return (
        <tr>
          <td colSpan="8" className="text-center">
            {searchTerm ? "No results found for your search" : "No data found"}
          </td>
        </tr>
      );
    }

    const startingIndex =
      (pagination.currentPage - 1) * (pagination.perPage || 10);

    // Use filtered users when search term exists, otherwise use all users
    const usersToDisplay = filteredUsers;

    const handleShowUserDetails = (username) => {
      const user = usersToDisplay.find((u) => u.username === username);

      if (
        user &&
        Array.isArray(user.qualifiedMembersList) &&
        user.qualifiedMembersList.length > 0
      ) {
        setQualifiedMembers(user.qualifiedMembersList);
        setSelectedUsername(username);
      } else {
        setQualifiedMembers([]);
        setSelectedUsername(username);
      }

      setShowModal(true);
    };

    return usersToDisplay.map((user, index) => (
      <tr key={user.username || index}>
        <td className="text-center p-3">
          {searchTerm ? index + 1 : startingIndex + index + 1}
        </td>
        <td className="text-center p-3">{getProfileDisplay(user)}</td>
        <td className="text-center p-3">{user.username}</td>
        <td className="text-center p-3">{user.name || "N/A"}</td>
        <td className="text-center p-3" style={{ minWidth: "200px" }}>
          <div
            className="progress"
            style={{
              height: "24px",
              borderRadius: "50px",
              overflow: "hidden",
              boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.2)",
              position: "relative",
            }}
          >
            <div
              className="progress-bar"
              role="progressbar"
              style={{
                width: `${user.eligibilityPercentage || 0}%`,
                borderRadius: "50px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: user.isEligibleForShareHolder
                  ? "#28a745"
                  : "#ec660f",
              }}
              aria-valuenow={user.eligibilityPercentage || 0}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
            <span
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                color: "#ec660f",
                fontWeight: "bold",
              }}
            >
              {user.progressStatus || `${user.eligibilityPercentage || 0}%`}
            </span>
          </div>
        </td>
        <td className="text-center p-3">{user.directReferrals || 0}</td>
        <td className="text-center p-3">{user.chainReferrals || 0}</td>
        <td className="text-center p-3">{user.totalTeam || 0}</td>
        <td className="text-center p-3">
          {/* <Icon
                                                      icon="raphael:view"
                                                      width="24"
                                                      height="24"
                                                      style={{ color: "white" }}
                                                    /> */}

          <button
            onClick={() => {
              handleShowUserDetails(user.username);
            }}
            disabled={
              !Array.isArray(user.qualifiedMembersList) ||
              user.qualifiedMembersList.length === 0
            }
            className="btn text-white"
            style={{ backgroundColor: "#ec660f" }}
          >
            View
          </button>
        </td>
        {/* <td className="text-center p-3">{user.email || "N/A"}</td>
        <td className="text-center p-3">{getPhone(user.phone)}</td> */}
      </tr>
    ));
  }, [
    filteredUsers,
    pagination.currentPage,
    pagination.perPage,
    isLoading,
    error,
    searchTerm,
  ]);

  // 2. Pagination component - Hide when searching
  const paginationComponent = useMemo(() => {
    if (
      isLoading ||
      isFetching ||
      error ||
      !pagination ||
      !pagination.totalPages ||
      pagination.totalPages <= 1 ||
      searchTerm // Hide pagination when searching
    ) {
      return null;
    }

    return (
      <div className="d-flex justify-content-center my-4">
        <nav aria-label="Shareholders pagination">
          <ul className="pagination">
            <li
              className={`page-item ${
                !pagination.hasPrevPage ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage || isFetching}
                style={{
                  backgroundColor: "#2e2e2e",
                  color: "#ec660f",
                  borderColor: "#444",
                }}
              >
                Previous
              </button>
            </li>

            {Array.from(
              { length: Math.min(5, pagination.totalPages) },
              (_, i) => {
                // Calculate which page numbers to show
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.currentPage <= 3) {
                  pageNum = i + 1;
                } else if (
                  pagination.currentPage >=
                  pagination.totalPages - 2
                ) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.currentPage - 2 + i;
                }

                return (
                  <li
                    key={pageNum}
                    className={`page-item ${
                      pageNum === pagination.currentPage ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pageNum)}
                      disabled={isFetching}
                      style={{
                        backgroundColor:
                          pageNum === pagination.currentPage
                            ? "#ec660f"
                            : "#2e2e2e",
                        color:
                          pageNum === pagination.currentPage
                            ? "#fff"
                            : "#ec660f",
                        borderColor: "#444",
                      }}
                    >
                      {pageNum}
                    </button>
                  </li>
                );
              }
            )}

            <li
              className={`page-item ${
                !pagination.hasNextPage ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage || isFetching}
                style={{
                  backgroundColor: "#2e2e2e",
                  color: "#ec660f",
                  borderColor: "#444",
                }}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    );
  }, [pagination, handlePageChange, isLoading, isFetching, error, searchTerm]);

  // Full-screen loader component
  const fullScreenLoader = useMemo(() => {
    if (!isNavigating) return null;

    return (
      <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50"
        style={{ zIndex: 9999 }}
      >
        <div className="spinner-border text-light" role="status">
          {/* <span className="visually-hidden">Loading...</span> */}
        </div>
      </div>
    );
  }, [isNavigating]);

  // Search component
  const searchComponent = useMemo(() => {
    return (
      <div className="row mb-4">
        <div className="col-md-6 offset-md-3">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search by username, name, email...."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                // backgroundColor: "#2e2e2e",
                // color: "#fff",
                borderColor: "#444",
              }}
            />
            {searchTerm && (
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={handleResetSearch}
                style={{
                  backgroundColor: "#2e2e2e",
                  color: "#fff",
                  borderColor: "#444",
                }}
              >
                Clear
              </button>
            )}
          </div>
          {searchTerm && (
            <div className="text-center mt-2 text-light">
              Found {filteredUsers.length} results
            </div>
          )}
        </div>
      </div>
    );
  }, [searchTerm, handleSearchChange, handleResetSearch, filteredUsers.length]);

  return (
    <DashboardLayout>
      {fullScreenLoader}
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
        <div className="container-fluid">
          <div className="container">
            <div className="rounded-3 py-3">
              <h4 className="text-center fw-bold" style={{ color: "#ec660f" }}>
                Shareholder Eligibility Dashboard
              </h4>
            </div>
          </div>
        </div>

        <div className="container">
          {/* Search component */}
          {/* {!isLoading && searchComponent} */}

          <div className="table_data table-responsive p-3">
            <table
              className="table table-dark"
              style={{
                backgroundColor: "#1b242d",
                border: "1px solid #303f50",
              }}
            >
              <thead style={{ backgroundColor: "#ec660f" }}>
                <tr className="text-light">
                  <th
                    className="text-center p-3"
                    style={{ backgroundColor: "#ec660f" }}
                  >
                    S.No
                  </th>
                  <th
                    className="text-center p-3"
                    style={{ backgroundColor: "#ec660f" }}
                  >
                    Profile
                  </th>
                  <th
                    className="text-center p-3"
                    style={{ backgroundColor: "#ec660f" }}
                  >
                    Username
                  </th>
                  <th
                    className="text-center p-3"
                    style={{ backgroundColor: "#ec660f" }}
                  >
                    Full Name
                  </th>
                  <th
                    className="text-center p-3"
                    style={{ backgroundColor: "#ec660f" }}
                  >
                    Progress
                  </th>
                  <th
                    className="text-center p-3"
                    style={{ backgroundColor: "#ec660f" }}
                  >
                    Direct Referals
                  </th>
                  <th
                    className="text-center p-3"
                    style={{ backgroundColor: "#ec660f" }}
                  >
                    Chain referals
                  </th>
                  <th
                    className="text-center p-3"
                    style={{ backgroundColor: "#ec660f" }}
                  >
                    Total Referals
                  </th>
                  <th
                    className="text-center p-3"
                    style={{ backgroundColor: "#ec660f" }}
                  >
                    Qualified List
                  </th>
                  {/* <th
                    className="text-center p-3"
                    style={{ backgroundColor: "#ec660f" }}
                  >
                    Email
                  </th>
                 <th
                    className="text-center p-3"
                    style={{ backgroundColor: "#ec660f" }}
                  >
                    Phone
                  </th> */}
                </tr>
              </thead>
              <tbody>{tableContent}</tbody>
            </table>
          </div>

          {showModal && (
            <Modal
              show={showModal}
              onHide={() => setShowModal(false)}
              size="xl"
              centered
              className="support_modal"
            >
              <Modal.Header closeButton>
                <Modal.Title>Qualified Members</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="table-responsive">
                  <table
                    className="table  "
                    style={{
                      backgroundColor: "#1b242d",
                      border: "1px solid #303f50",
                    }}
                  >
                    <thead>
                      <tr className="text-white">
                        <th
                          className="text-center text-white p-3"
                          style={{ backgroundColor: "#ec660f" }}
                        >
                          sno
                        </th>
                        <th
                          className="text-center text-white p-3"
                          style={{ backgroundColor: "#ec660f" }}
                        >
                          Username
                        </th>
                        <th
                          className="text-center text-white p-3"
                          style={{ backgroundColor: "#ec660f" }}
                        >
                          Name
                        </th>
                        <th
                          className="text-center text-white p-3"
                          style={{ backgroundColor: "#ec660f" }}
                        >
                          Email
                        </th>
                        <th
                          className="text-center text-white p-3"
                          style={{ backgroundColor: "#ec660f" }}
                        >
                          Phone
                        </th>
                        <th
                          className="text-center text-white p-3"
                          style={{ backgroundColor: "#ec660f" }}
                        >
                          DR
                        </th>
                        <th
                          className="text-center text-white p-3"
                          style={{ backgroundColor: "#ec660f" }}
                        >
                          CR
                        </th>
                        <th
                          className="text-center text-white p-3"
                          style={{ backgroundColor: "#ec660f" }}
                        >
                          TR
                        </th>
                        <th
                          className="text-center text-white p-3"
                          style={{ backgroundColor: "#ec660f" }}
                        >
                          TASK COMP
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {qualifiedMembers.length > 0 ? (
                        qualifiedMembers.map((member, index) => (
                          <tr key={member.username || index}>
                            <td
                              className="text-center text-white p-3"
                              style={{
                                backgroundColor: "#1b242d",
                                border: "1px solid #303f50",
                              }}
                            >
                              {index + 1}
                            </td>
                            <td
                              className="text-center text-white p-3"
                              style={{
                                backgroundColor: "#1b242d",
                                border: "1px solid #303f50",
                              }}
                            >
                              {member.username}
                            </td>
                            <td
                              className="text-center text-white p-3"
                              style={{
                                backgroundColor: "#1b242d",
                                border: "1px solid #303f50",
                              }}
                            >
                              {member.name || "N/A"}
                            </td>
                            <td
                              className="text-center text-white p-3"
                              style={{
                                backgroundColor: "#1b242d",
                                border: "1px solid #303f50",
                              }}
                            >
                              {member.email || "N/A"}
                            </td>
                            <td
                              className="text-center text-white p-3"
                              style={{
                                backgroundColor: "#1b242d",
                                border: "1px solid #303f50",
                              }}
                            >
                              {member.phone || "N/A"}
                            </td>
                            <td
                              className="text-center text-white p-3"
                              style={{
                                backgroundColor: "#1b242d",
                                border: "1px solid #303f50",
                              }}
                            >
                              {member.directReferrals || 0}
                            </td>
                            <td
                              className="text-center text-white p-3"
                              style={{
                                backgroundColor: "#1b242d",
                                border: "1px solid #303f50",
                              }}
                            >
                              {member.chainReferrals || 0}
                            </td>
                            <td
                              className="text-center text-white p-3"
                              style={{
                                backgroundColor: "#1b242d",
                                border: "1px solid #303f50",
                              }}
                            >
                              {member.totalReferrals || 0}
                            </td>
                            <td
                              className="text-center text-white p-3"
                              style={{
                                backgroundColor: "#1b242d",
                                border: "1px solid #303f50",
                              }}
                            >
                              {member.isQualified === true ? (
                                <span className="flex items-center justify-center gap-1 text-green-500">
                                  <CheckCircle size={18} />
                                </span>
                              ) : member.isQualified === false ? (
                                <span className="flex items-center justify-center gap-1 text-red-500">
                                  <XCircle size={18} />
                                </span>
                              ) : (
                                <span className="flex items-center justify-center gap-1 text-yellow-400">
                                  <Hourglass size={18} />
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="text-center">
                            No qualified members found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Modal.Body>
            </Modal>
          )}

          {/* Pagination controls */}
          {paginationComponent}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ShareHolderDashboard;
