// // import React, { useState, useEffect, useContext } from "react";
// // import { Icon } from "@iconify/react/dist/iconify.js";
// // import Pagination from "../../components/Pagination";
// // import DashboardLayout from "../../Layout/DashboardLayout";
// // import { useGetUserQuery, useApproveRejectApplicationMutation } from "./userApiSlice";
// // import Skeleton from "react-loading-skeleton";
// // import { toast } from "react-toastify";
// // import { StateContext } from "../../context/StateContext";

// // const UserManagement = () => {
// //   const { amount, setAmount, transaction_type, setTransactionType } =
// //     useContext(StateContext);

// //   const [refresh, setRefresh] = useState(false);
// //   const [selectedUserId, setSelectedUserId] = useState(null);
// //   const [selectedUserData, setSelectedUserData] = useState(null);
// //   const [check1, setCheck1] = useState(false);
// //   const [showActionModal, setShowActionModal] = useState(false);

// //   // Pagination state
// //   const [state, setState] = useState({
// //     currentPage: 1,
// //     perPage: 10,
// //     search: "",
// //   });

// //   const queryParams = `limit=${state.perPage}&page=${state.currentPage}&search=${state.search}`;

// //   const { data: getUser, isLoading, refetch } = useGetUserQuery(queryParams);
// //   const [approveRejectApplication, { isLoading: isUpdating }] = useApproveRejectApplicationMutation();

// //   const TableData = getUser?.data?.data || [];
// //   const totalMembers = TableData.length || 0;
// //   const blockedUser = TableData.filter(user => user.isBlock).length || 0;
// //   const activeMembers = TableData.filter(user => user.isActive).length || 0;

// //   // Handle page change
// //   const handlePageChange = (e) => {
// //     setState({ ...state, currentPage: e });
// //   };

// //   // Handle search with debounce
// //   let searchTimeout;
// //   const handleSearch = (e) => {
// //     clearTimeout(searchTimeout);
// //     searchTimeout = setTimeout(() => {
// //       setState({ ...state, search: e.target.value, currentPage: 1 });
// //     }, 1000);
// //   };

// //   useEffect(() => {
// //     refetch();
// //     return () => {
// //       clearTimeout(searchTimeout);
// //     };
// //   }, []);

// //   // Handle user view
// //   const handleUserView = (user) => {
// //     setSelectedUserId(user._id);
// //     setSelectedUserData(user);
// //   };

// //   // Handle action button click (Approve/Reject)
// //   const handleActionClick = (user) => {
// //     setSelectedUserId(user._id);
// //     setSelectedUserData(user);
// //     setShowActionModal(true);
// //   };

// //   // In UserManagement.jsx

// //   const handleApproveReject = async (action) => {
// //     try {
// //       const response = await approveRejectApplication({
// //         id: selectedUserId,
// //         action: action,

// //       }).unwrap();

// //       const actionText = action === 'approve' ? 'approved' :
// //         action === 'reject' ? 'rejected' : 'put on hold';

// //       toast.success(
// //         action === 'approve'
// //           ? 'Application approved! Password reset email sent to mentor.'
// //           : `Application ${actionText} successfully`,
// //         { position: "top-center", autoClose: 5000 }
// //       );

// //       setShowActionModal(false);
// //       setSelectedUserId(null);
// //       setSelectedUserData(null);
// //       refetch();
// //     } catch (error) {
// //       console.error("Action failed:", error);
// //       toast.error(
// //         error?.data?.message || `Failed to ${action} application`,
// //         { position: "top-center" }
// //       );
// //     }
// //   };
// //   // Handle check for transaction
// //   const handleCheck = (userId) => {
// //     setSelectedUserId(userId);
// //     setCheck1(true);
// //   };

// //   // Handle transaction submission
// //   const handleTransactionSubmit = async (e, transactionType, amount) => {
// //     e.preventDefault();

// //     if (!amount || amount === "") {
// //       toast.error("Enter amount");
// //       setAmount("");
// //       return;
// //     }

// //     if (amount < 1) {
// //       toast.error("Amount must be greater than 1");
// //       setAmount("");
// //       return;
// //     }

// //     if (!/^[0-9]+(\.[0-9]+)?$/.test(amount)) {
// //       toast.error("Enter only valid numbers");
// //       setAmount("");
// //       return;
// //     }

// //     try {
// //       // Add your transaction API call here
// //       toast.success("Transaction sent successfully", {
// //         position: "top-center",
// //       });
// //       setAmount("");
// //       setTransactionType("referral_amount");
// //       setCheck1(false);
// //       setRefresh(true);
// //     } catch (error) {
// //       console.error("Transaction failed:", error);
// //       toast.error(error?.data?.message || "Transaction failed");
// //       setAmount("");
// //     }
// //   };

// //   // Format date with AM/PM
// //   const formatDateWithAmPm = (isoString) => {
// //     if (!isoString) return "N/A";

// //     const date = new Date(isoString);
// //     const day = String(date.getDate()).padStart(2, "0");
// //     const month = String(date.getMonth() + 1).padStart(2, "0");
// //     const year = date.getFullYear();
// //     let hours = date.getHours();
// //     const minutes = String(date.getMinutes()).padStart(2, "0");
// //     const amPm = hours >= 12 ? "PM" : "AM";

// //     hours = hours % 12 || 12;
// //     return `${day}-${month}-${year} ${hours}:${minutes} ${amPm}`;
// //   };

// //   useEffect(() => {
// //     if (refresh) {
// //       refetch();
// //       setRefresh(false);
// //     }
// //   }, [refresh, refetch]);

// //   return (
// //     <>
// //       <DashboardLayout>
// //         <section className="profile_section user__management py-4">
// //           <div className="container-fluid">
// //             <div className="row">
// //               {/* Total Members Card */}
// //               <div className="col-6 col-sm-6 col-md-6 col-xl-5 col-xxl-4">
// //                 <div className="my_total_team_data mb-4 rounded-3 px-3 py-3 py-md-4">
// //                   <div className="total_user_card d-flex align-items-center gap-2 gap-md-3">
// //                     <div className="total_user_images rounded-3 p-2 p-md-4">
// //                       <img
// //                         src="/images/total-member.png"
// //                         alt="total-member"
// //                         className="img-fluid"
// //                       />
// //                     </div>
// //                     <div className="total_user_card_data">
// //                       <h2>{totalMembers}</h2>
// //                       <h5>Total Applications</h5>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Total Blocked Card */}
// //               <div className="col-12 col-sm-6 col-md-6 col-xl-5 col-xxl-4">
// //                 <div className="my_total_team_data mb-4 rounded-3 px-3 py-3 py-md-4">
// //                   <div className="total_user_card d-flex align-items-center gap-2 gap-md-3">
// //                     <div className="total_user_images rounded-3 p-2 p-md-4">
// //                       <img
// //                         src="/images/total-member.png"
// //                         alt="total-member"
// //                         className="img-fluid"
// //                       />
// //                     </div>
// //                     <div className="total_user_card_data">
// //                       <h2>{blockedUser}</h2>
// //                       <h5>Total Blocked</h5>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Total Active Members Card */}
// //               <div className="col-12 col-sm-6 col-md-6 col-xl-5 col-xxl-4">
// //                 <div className="my_total_team_data mb-4 rounded-3 px-3 py-3 py-md-4">
// //                   <div className="total_user_card d-flex align-items-center gap-2 gap-md-3">
// //                     <div className="total_user_images rounded-3 p-2 p-md-4">
// //                       <img
// //                         src="/images/total-member.png"
// //                         alt="total-member"
// //                         className="img-fluid"
// //                       />
// //                     </div>
// //                     <div className="total_user_card_data">
// //                       <h2>{activeMembers}</h2>
// //                       <h5>Total Active</h5>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* User Table */}
// //               <div className="col-12">
// //                 <div className="my_total_team_data rounded-3 px-3 py-4">
// //                   <h1 className="mb-3">Mentor Applications Management</h1>
// //                   <div className="row justify-content-between">
// //                     {/* Items per page selector */}
// //                     <div className="col-12 col-sm-6 col-md-2 col-xxl-1">
// //                       <div className="pagination__box mb-4">
// //                         <div className="showing_data">
// //                           <select
// //                             className="form-select shadow-none"
// //                             aria-label="Default select example"
// //                             onChange={(e) =>
// //                               setState({
// //                                 ...state,
// //                                 perPage: e.target.value,
// //                                 currentPage: 1,
// //                               })
// //                             }
// //                           >
// //                             <option value="10">10</option>
// //                             <option value="30">30</option>
// //                             <option value="50">50</option>
// //                           </select>
// //                         </div>
// //                       </div>
// //                     </div>

// //                     {/* Search input */}
// //                     <div className="col-12 col-sm-6 col-md-3 col-lg-2">
// //                       <div className="select_level_data mb-4">
// //                         <div className="input-group search_group">
// //                           <span
// //                             className="input-group-text border-0 shadow-none bg-transparent rounded-0 pe-0"
// //                             id="basic-addon1"
// //                           >
// //                             <Icon
// //                               icon="tabler:search"
// //                               width="16"
// //                               height="16"
// //                               style={{ color: "var(--white)" }}
// //                             />
// //                           </span>
// //                           <input
// //                             type="text"
// //                             autoComplete="off"
// //                             className="form-control border-0 shadow-none rounded-0 bg-transparent"
// //                             placeholder="Search"
// //                             onChange={handleSearch}
// //                           />
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>

// //                   <div className="table_data table-responsive">
// //                     <table className="table mb-0">
// //                       <thead>
// //                         <tr>
// //                           <th scope="col">S.No</th>
// //                           <th scope="col">Full Name</th>
// //                           <th scope="col">Email</th>
// //                           <th scope="col">Phone</th>
// //                           <th scope="col">Location</th>
// //                           <th scope="col">Current Role</th>
// //                           <th scope="col">Company</th>
// //                           <th scope="col">Mentor Category</th>
// //                           <th scope="col">Status</th>
// //                           <th scope="col">Action status</th>
// //                           <th scope="col">View Details</th>
// //                           <th scope="col">Action</th>
// //                         </tr>
// //                       </thead>
// //                       <tbody>
// //                         {isLoading ? (
// //                           <>
// //                             {[...Array(10)].map((e, i) => (
// //                               <tr key={i}>
// //                                 {[...Array(11)].map((_, j) => (
// //                                   <td key={j}>
// //                                     <Skeleton />
// //                                   </td>
// //                                 ))}
// //                               </tr>
// //                             ))}
// //                           </>
// //                         ) : TableData.length === 0 ? (
// //                           <tr>
// //                             <td colSpan="11" className="text-center">
// //                               No data found
// //                             </td>
// //                           </tr>
// //                         ) : (
// //                           TableData.map((data, i) => (
// //                             <tr key={data._id}>
// //                               <td>
// //                                 {state.currentPage * state.perPage -
// //                                   (state.perPage - 1) +
// //                                   i}
// //                                 .
// //                               </td>
// //                               <td>{data.fullName}</td>
// //                               <td>{data.email}</td>
// //                               <td>{data.phone}</td>
// //                               <td>{data.location}</td>
// //                               <td>{data.currentRole}</td>
// //                               <td>{data.companyName}</td>
// //                               <td>{data.mentorCategory}</td>
// //                               <td>
// //                                 <span
// //                                   className={
// //                                     data.isActive ? "unblock" : "block"
// //                                   }
// //                                 >
// //                                   {data.isActive ? "Active" : "Inactive"}
// //                                 </span>
// //                               </td>
// //                               <td>
// //                                 <span
// //                                   className={
// //                                     data.isActive ? "unblock" : "block"
// //                                   }
// //                                 >
// //                                   {data.status}
// //                                 </span>
// //                               </td>
// //                               <td>
// //                                 <button
// //                                   className="bg-transparent border-0"
// //                                   style={{ cursor: "pointer" }}
// //                                   data-bs-toggle="modal"
// //                                   data-bs-target="#detailsModal"
// //                                   onClick={() => handleUserView(data)}
// //                                 >
// //                                   <img
// //                                     src="/images/icons/show.svg"
// //                                     alt="icon"
// //                                     title="View Details"
// //                                   />
// //                                 </button>
// //                               </td>
// //                               <td>
// //                                 <button
// //                                   className="btn_send rounded px-3 py-1 pb-2"
// //                                   onClick={() => handleActionClick(data)}
// //                                   title="Approve/Reject"
// //                                   data-bs-toggle="modal"
// //                                   data-bs-target="#actionModal"
// //                                   disabled={data.status === 'approved' || data.status === 'rejected'}
// //                                 >
// //                                   <Icon
// //                                     icon="mdi:check-circle"
// //                                     width="18"
// //                                     height="18"
// //                                     style={{ color: "#eb660f" }}
// //                                   />
// //                                 </button>
// //                               </td>
// //                             </tr>
// //                           ))
// //                         )}
// //                       </tbody>
// //                     </table>
// //                   </div>
// //                 </div>
// //                 {TableData?.length > 0 && (
// //                   <Pagination
// //                     currentPage={state.currentPage}
// //                     totalPages={Math.ceil(totalMembers / state.perPage) || 1}
// //                     onPageChange={handlePageChange}
// //                   />
// //                 )}
// //               </div>
// //             </div>
// //           </div>

// //           {/* View Details Modal */}
// //           <div
// //             className="modal fade common__modal"
// //             id="detailsModal"
// //             tabIndex="-1"
// //             aria-labelledby="detailsModalLabel"
// //             aria-hidden="true"
// //           >
// //             <div className="modal-dialog modal-dialog-centered modal-lg">
// //               <div className="modal-content">
// //                 <div className="modal-header border-0 pb-0">
// //                   <button
// //                     type="button"
// //                     className="btn-close"
// //                     data-bs-dismiss="modal"
// //                     aria-label="Close"
// //                   ></button>
// //                 </div>
// //                 <div className="modal-body pt-0 px-4">
// //                   <h1 className="modal-title mb-4" id="detailsModalLabel">
// //                     Application Details
// //                   </h1>
// //                   {selectedUserData && (
// //                     <div className="user-details">
// //                       <div className="row">
// //                         <div className="col-md-6 mb-3">
// //                           <div className="form__box">
// //                             <label>Full Name</label>
// //                             <input
// //                               type="text"
// //                               autoComplete="off"
// //                               className="form-control shadow-none"
// //                               value={selectedUserData.fullName}
// //                               readOnly
// //                             />
// //                           </div>
// //                         </div>
// //                         <div className="col-md-6 mb-3">
// //                           <div className="form__box">
// //                             <label>Email</label>
// //                             <input
// //                               type="text"
// //                               autoComplete="off"
// //                               className="form-control shadow-none"
// //                               value={selectedUserData.email}
// //                               readOnly
// //                             />
// //                           </div>
// //                         </div>
// //                         <div className="col-md-6 mb-3">
// //                           <div className="form__box">
// //                             <label>Phone</label>
// //                             <input
// //                               type="text"
// //                               autoComplete="off"
// //                               className="form-control shadow-none"
// //                               value={selectedUserData.phone}
// //                               readOnly
// //                             />
// //                           </div>
// //                         </div>
// //                         <div className="col-md-6 mb-3">
// //                           <div className="form__box">
// //                             <label>Date of Birth</label>
// //                             <input
// //                               type="text"
// //                               autoComplete="off"
// //                               className="form-control shadow-none"
// //                               value={formatDateWithAmPm(selectedUserData.dateOfBirth)}
// //                               readOnly
// //                             />
// //                           </div>
// //                         </div>
// //                         <div className="col-md-6 mb-3">
// //                           <div className="form__box">
// //                             <label>Location</label>
// //                             <input
// //                               type="text"
// //                               autoComplete="off"
// //                               className="form-control shadow-none"
// //                               value={selectedUserData.location}
// //                               readOnly
// //                             />
// //                           </div>
// //                         </div>
// //                         <div className="col-md-6 mb-3">
// //                           <div className="form__box">
// //                             <label>Current Role</label>
// //                             <input
// //                               type="text"
// //                               autoComplete="off"
// //                               className="form-control shadow-none"
// //                               value={selectedUserData.currentRole}
// //                               readOnly
// //                             />
// //                           </div>
// //                         </div>
// //                         <div className="col-md-6 mb-3">
// //                           <div className="form__box">
// //                             <label>Company Name</label>
// //                             <input
// //                               type="text"
// //                               autoComplete="off"
// //                               className="form-control shadow-none"
// //                               value={selectedUserData.companyName}
// //                               readOnly
// //                             />
// //                           </div>
// //                         </div>
// //                         <div className="col-md-6 mb-3">
// //                           <div className="form__box">
// //                             <label>Years of Experience</label>
// //                             <input
// //                               type="text"
// //                               autoComplete="off"
// //                               className="form-control shadow-none"
// //                               value={selectedUserData.yearsOfExperience}
// //                               readOnly
// //                             />
// //                           </div>
// //                         </div>
// //                         <div className="col-md-6 mb-3">
// //                           <div className="form__box">
// //                             <label>Mentor Category</label>
// //                             <input
// //                               type="text"
// //                               autoComplete="off"
// //                               className="form-control shadow-none"
// //                               value={selectedUserData.mentorCategory}
// //                               readOnly
// //                             />
// //                           </div>
// //                         </div>
// //                         <div className="col-md-6 mb-3">
// //                           <div className="form__box">
// //                             <label>Mentoring Style</label>
// //                             <input
// //                               type="text"
// //                               autoComplete="off"
// //                               className="form-control shadow-none"
// //                               value={selectedUserData.mentoringStyle}
// //                               readOnly
// //                             />
// //                           </div>
// //                         </div>
// //                         <div className="col-md-6 mb-3">
// //                           <div className="form__box">
// //                             <label>Mentoring Frequency</label>
// //                             <input
// //                               type="text"
// //                               autoComplete="off"
// //                               className="form-control shadow-none"
// //                               value={selectedUserData.mentoringFrequency}
// //                               readOnly
// //                             />
// //                           </div>
// //                         </div>
// //                         <div className="col-md-6 mb-3">
// //                           <div className="form__box">
// //                             <label>Hourly Rate</label>
// //                             <input
// //                               type="text"
// //                               autoComplete="off"
// //                               className="form-control shadow-none"
// //                               value={`₹${selectedUserData.hourlyRate}`}
// //                               readOnly
// //                             />
// //                           </div>
// //                         </div>
// //                         <div className="col-md-6 mb-3">
// //                           <div className="form__box">
// //                             <label>Languages</label>
// //                             <input
// //                               type="text"
// //                               autoComplete="off"
// //                               className="form-control shadow-none"
// //                               value={selectedUserData.languages?.join(", ")}
// //                               readOnly
// //                             />
// //                           </div>
// //                         </div>
// //                         <div className="col-md-6 mb-3">
// //                           <div className="form__box">
// //                             <label>LinkedIn URL</label>
// //                             <input
// //                               type="text"
// //                               autoComplete="off"
// //                               className="form-control shadow-none"
// //                               value={selectedUserData.linkedinUrl}
// //                               readOnly
// //                             />
// //                           </div>
// //                         </div>
// //                         <div className="col-md-12 mb-3">
// //                           <div className="form__box">
// //                             <label>Areas of Interest</label>
// //                             <input
// //                               type="text"
// //                               autoComplete="off"
// //                               className="form-control shadow-none"
// //                               value={selectedUserData.areasOfInterest}
// //                               readOnly
// //                             />
// //                           </div>
// //                         </div>
// //                         <div className="col-md-12 mb-3">
// //                           <div className="form__box">
// //                             <label>Motivation Statement</label>
// //                             <textarea
// //                               className="form-control shadow-none"
// //                               rows="3"
// //                               value={selectedUserData.motivationStatement}
// //                               readOnly
// //                             />
// //                           </div>
// //                         </div>
// //                         <div className="col-md-6 mb-3">
// //                           <div className="form__box">
// //                             <label>Status</label>
// //                             <input
// //                               type="text"
// //                               autoComplete="off"
// //                               className="form-control shadow-none"
// //                               value={
// //                                 selectedUserData.isActive ? "Active" : "Inactive"
// //                               }
// //                               readOnly
// //                             />
// //                           </div>
// //                         </div>
// //                       </div>
// //                       <div className="text-center my-4">
// //                         <button
// //                           type="button"
// //                           className="btn btn-secondary px-3"
// //                           data-bs-dismiss="modal"
// //                         >
// //                           Close
// //                         </button>
// //                       </div>
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Approve/Reject Action Modal */}
// //           {/* Approve/Reject/On Hold Action Modal */}
// //           <div
// //             className="modal fade common__modal"
// //             id="actionModal"
// //             tabIndex="-1"
// //             aria-labelledby="actionModalLabel"
// //             aria-hidden="true"
// //           >
// //             <div className="modal-dialog modal-dialog-centered">
// //               <div className="modal-content">
// //                 <div className="modal-header border-0 pb-0">
// //                   <button
// //                     type="button"
// //                     className="btn-close"
// //                     data-bs-dismiss="modal"
// //                     aria-label="Close"
// //                   ></button>
// //                 </div>
// //                 <div className="modal-body pt-0 px-4">
// //                   <h1 className="modal-title mb-4 text-center" id="actionModalLabel">
// //                     Application Action
// //                   </h1>
// //                   {selectedUserData && (
// //                     <div className="action-content text-center">
// //                       <p className="mb-4">
// //                         Select an action for <strong>{selectedUserData.fullName}</strong>'s application
// //                       </p>
// //                       <div className="d-flex gap-3 justify-content-center flex-wrap">
// //                         <button
// //                           type="button"
// //                           className="btn btn-success px-4"
// //                           onClick={() => handleApproveReject('approve')}
// //                           disabled={isUpdating}
// //                           data-bs-dismiss="modal"
// //                         >
// //                           {isUpdating ? "Processing..." : "Approve"}
// //                         </button>
// //                         <button
// //                           type="button"
// //                           className="btn btn-warning px-4"
// //                           onClick={() => handleApproveReject('onhold')}
// //                           disabled={isUpdating}
// //                           data-bs-dismiss="modal"
// //                         >
// //                           {isUpdating ? "Processing..." : "On Hold"}
// //                         </button>
// //                         <button
// //                           type="button"
// //                           className="btn btn-danger px-4"
// //                           onClick={() => handleApproveReject('reject')}
// //                           disabled={isUpdating}
// //                           data-bs-dismiss="modal"
// //                         >
// //                           {isUpdating ? "Processing..." : "Reject"}
// //                         </button>
// //                       </div>
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </section>
// //       </DashboardLayout>
// //     </>
// //   );
// // };

// // export default UserManagement;


// // import React, { useState, useEffect, useContext } from "react";
// // import { Icon } from "@iconify/react/dist/iconify.js";
// // import Pagination from "../../components/Pagination";
// // import DashboardLayout from "../../Layout/DashboardLayout";
// // import { useGetUserQuery, useApproveRejectApplicationMutation } from "./userApiSlice";
// // import Skeleton from "react-loading-skeleton";
// // import { toast } from "react-toastify";
// // import { StateContext } from "../../context/StateContext";

// // const UserManagement = () => {
// //   const { amount, setAmount, transaction_type, setTransactionType } =
// //     useContext(StateContext);

// //   const [refresh, setRefresh] = useState(false);
// //   const [selectedUserId, setSelectedUserId] = useState(null);
// //   const [selectedUserData, setSelectedUserData] = useState(null);
// //   const [check1, setCheck1] = useState(false);
// //   const [showActionModal, setShowActionModal] = useState(false);

// //   // Pagination state
// //   const [state, setState] = useState({
// //     currentPage: 1,
// //     perPage: 10,
// //     search: "",
// //   });

// //   const queryParams = `limit=${state.perPage}&page=${state.currentPage}&search=${state.search}`;

// //   const { data: getUser, isLoading, isFetching, refetch } = useGetUserQuery(queryParams);
// //   const [approveRejectApplication, { isLoading: isUpdating }] = useApproveRejectApplicationMutation();

// //   const TableData = getUser?.data?.data || [];
// //   const totalMembers = TableData.length || 0;
// //   const blockedUser = TableData.filter(user => user.isBlock).length || 0;
// //   const activeMembers = TableData.filter(user => user.isActive).length || 0;

// //   // Handle page change
// //   const handlePageChange = (e) => {
// //     setState({ ...state, currentPage: e });
// //   };

// //   // Handle search with debounce
// //   let searchTimeout;
// //   const handleSearch = (e) => {
// //     clearTimeout(searchTimeout);
// //     searchTimeout = setTimeout(() => {
// //       setState({ ...state, search: e.target.value, currentPage: 1 });
// //     }, 1000);
// //   };

// //   useEffect(() => {
// //     refetch();
// //     return () => {
// //       clearTimeout(searchTimeout);
// //     };
// //   }, []);

// //   // Handle user view
// //   const handleUserView = (user) => {
// //     setSelectedUserId(user._id);
// //     setSelectedUserData(user);
// //   };

// //   // Handle action button click (Approve/Reject)
// //   const handleActionClick = (user) => {
// //     setSelectedUserId(user._id);
// //     setSelectedUserData(user);
// //     setShowActionModal(true);
// //   };

// //   const handleApproveReject = async (action) => {
// //     try {
// //       const response = await approveRejectApplication({
// //         id: selectedUserId,
// //         action: action,
// //       }).unwrap();

// //       const actionText = action === 'approve' ? 'approved' :
// //         action === 'reject' ? 'rejected' : 'put on hold';

// //       toast.success(
// //         action === 'approve'
// //           ? 'Application approved! Password reset email sent to mentor.'
// //           : `Application ${actionText} successfully`,
// //         { position: "top-center", autoClose: 5000 }
// //       );

// //       setShowActionModal(false);
// //       setSelectedUserId(null);
// //       setSelectedUserData(null);
// //       refetch();
// //     } catch (error) {
// //       console.error("Action failed:", error);
// //       toast.error(
// //         error?.data?.message || `Failed to ${action} application`,
// //         { position: "top-center" }
// //       );
// //     }
// //   };

// //   // Handle check for transaction
// //   const handleCheck = (userId) => {
// //     setSelectedUserId(userId);
// //     setCheck1(true);
// //   };

// //   // Handle transaction submission
// //   const handleTransactionSubmit = async (e, transactionType, amount) => {
// //     e.preventDefault();

// //     if (!amount || amount === "") {
// //       toast.error("Enter amount");
// //       setAmount("");
// //       return;
// //     }

// //     if (amount < 1) {
// //       toast.error("Amount must be greater than 1");
// //       setAmount("");
// //       return;
// //     }

// //     if (!/^[0-9]+(\.[0-9]+)?$/.test(amount)) {
// //       toast.error("Enter only valid numbers");
// //       setAmount("");
// //       return;
// //     }

// //     try {
// //       toast.success("Transaction sent successfully", { position: "top-center" });
// //       setAmount("");
// //       setTransactionType("referral_amount");
// //       setCheck1(false);
// //       setRefresh(true);
// //     } catch (error) {
// //       console.error("Transaction failed:", error);
// //       toast.error(error?.data?.message || "Transaction failed");
// //       setAmount("");
// //     }
// //   };

// //   // Format date with AM/PM
// //   const formatDateWithAmPm = (isoString) => {
// //     if (!isoString) return "N/A";
// //     const date = new Date(isoString);
// //     const day = String(date.getDate()).padStart(2, "0");
// //     const month = String(date.getMonth() + 1).padStart(2, "0");
// //     const year = date.getFullYear();
// //     let hours = date.getHours();
// //     const minutes = String(date.getMinutes()).padStart(2, "0");
// //     const amPm = hours >= 12 ? "PM" : "AM";
// //     hours = hours % 12 || 12;
// //     return `${day}-${month}-${year} ${hours}:${minutes} ${amPm}`;
// //   };

// //   useEffect(() => {
// //     if (refresh) {
// //       refetch();
// //       setRefresh(false);
// //     }
// //   }, [refresh, refetch]);

// //   return (
// //     <>
// //       <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
// //       <DashboardLayout>
// //         <section className="profile_section user__management py-4">
// //           <div className="container-fluid">
// //             <div className="row">
// //               {/* Total Members Card */}
// //               <div className="col-6 col-sm-6 col-md-6 col-xl-5 col-xxl-4">
// //                 <div className="my_total_team_data mb-4 rounded-3 px-3 py-3 py-md-4">
// //                   <div className="total_user_card d-flex align-items-center gap-2 gap-md-3">
// //                     <div className="total_user_images rounded-3 p-2 p-md-4">
// //                       <img src="/images/total-member.png" alt="total-member" className="img-fluid" />
// //                     </div>
// //                     <div className="total_user_card_data">
// //                       <h2>{totalMembers}</h2>
// //                       <h5>Total Applications</h5>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Total Blocked Card */}
// //               <div className="col-12 col-sm-6 col-md-6 col-xl-5 col-xxl-4">
// //                 <div className="my_total_team_data mb-4 rounded-3 px-3 py-3 py-md-4">
// //                   <div className="total_user_card d-flex align-items-center gap-2 gap-md-3">
// //                     <div className="total_user_images rounded-3 p-2 p-md-4">
// //                       <img src="/images/total-member.png" alt="total-member" className="img-fluid" />
// //                     </div>
// //                     <div className="total_user_card_data">
// //                       <h2>{blockedUser}</h2>
// //                       <h5>Total Blocked</h5>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Total Active Members Card */}
// //               <div className="col-12 col-sm-6 col-md-6 col-xl-5 col-xxl-4">
// //                 <div className="my_total_team_data mb-4 rounded-3 px-3 py-3 py-md-4">
// //                   <div className="total_user_card d-flex align-items-center gap-2 gap-md-3">
// //                     <div className="total_user_images rounded-3 p-2 p-md-4">
// //                       <img src="/images/total-member.png" alt="total-member" className="img-fluid" />
// //                     </div>
// //                     <div className="total_user_card_data">
// //                       <h2>{activeMembers}</h2>
// //                       <h5>Total Active</h5>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* User Table */}
// //               <div className="col-12">
// //                 <div className="my_total_team_data rounded-3 px-3 py-4">

// //                   {/* Title row with Refresh button */}
// //                   <div className="d-flex align-items-center justify-content-between mb-3">
// //                     <h1 className="mb-0">Mentor Applications Management</h1>
// //                     <button
// //                       type="button"
// //                       className="btn d-flex align-items-center gap-2"
// //                       style={{ backgroundColor: "#eb660f", borderColor: "#eb660f", color: "#fff" }}
// //                       onClick={() => refetch()}
// //                       disabled={isFetching}
// //                       title="Refresh"
// //                     >
// //                       <Icon
// //                         icon="mdi:refresh"
// //                         width="18"
// //                         height="18"
// //                         style={{ animation: isFetching ? "spin 1s linear infinite" : "none" }}
// //                       />
// //                       {isFetching ? "Refreshing..." : "Refresh"}
// //                     </button>
// //                   </div>

// //                   <div className="row justify-content-between">
// //                     {/* Items per page selector */}
// //                     <div className="col-12 col-sm-6 col-md-2 col-xxl-1">
// //                       <div className="pagination__box mb-4">
// //                         <div className="showing_data">
// //                           <select
// //                             className="form-select shadow-none"
// //                             aria-label="Default select example"
// //                             onChange={(e) =>
// //                               setState({ ...state, perPage: e.target.value, currentPage: 1 })
// //                             }
// //                           >
// //                             <option value="10">10</option>
// //                             <option value="30">30</option>
// //                             <option value="50">50</option>
// //                           </select>
// //                         </div>
// //                       </div>
// //                     </div>

// //                     {/* Search input */}
// //                     <div className="col-12 col-sm-6 col-md-3 col-lg-2">
// //                       <div className="select_level_data mb-4">
// //                         <div className="input-group search_group">
// //                           <span
// //                             className="input-group-text border-0 shadow-none bg-transparent rounded-0 pe-0"
// //                             id="basic-addon1"
// //                           >
// //                             <Icon icon="tabler:search" width="16" height="16" style={{ color: "var(--white)" }} />
// //                           </span>
// //                           <input
// //                             type="text"
// //                             autoComplete="off"
// //                             className="form-control border-0 shadow-none rounded-0 bg-transparent"
// //                             placeholder="Search"
// //                             onChange={handleSearch}
// //                           />
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>

// //                   <div className="table_data table-responsive">
// //                     <table className="table mb-0">
// //                       <thead>
// //                         <tr>
// //                           <th scope="col">S.No</th>
// //                           <th scope="col">Full Name</th>
// //                           <th scope="col">Email</th>
// //                           <th scope="col">Phone</th>
// //                           <th scope="col">Location</th>
// //                           <th scope="col">Current Role</th>
// //                           <th scope="col">Company</th>
// //                           <th scope="col">Mentor Category</th>
// //                           <th scope="col">Status</th>
// //                           <th scope="col">Action status</th>
// //                           <th scope="col">View Details</th>
// //                           <th scope="col">Action</th>
// //                         </tr>
// //                       </thead>
// //                       <tbody>
// //                         {(isLoading || isFetching) ? (
// //                           <>
// //                             {[...Array(10)].map((e, i) => (
// //                               <tr key={i}>
// //                                 {[...Array(11)].map((_, j) => (
// //                                   <td key={j}><Skeleton /></td>
// //                                 ))}
// //                               </tr>
// //                             ))}
// //                           </>
// //                         ) : TableData.length === 0 ? (
// //                           <tr>
// //                             <td colSpan="11" className="text-center">No data found</td>
// //                           </tr>
// //                         ) : (
// //                           TableData.map((data, i) => (
// //                             <tr key={data._id}>
// //                               <td>{state.currentPage * state.perPage - (state.perPage - 1) + i}.</td>
// //                               <td>{data.fullName}</td>
// //                               <td>{data.email}</td>
// //                               <td>{data.phone}</td>
// //                               <td>{data.location}</td>
// //                               <td>{data.currentRole}</td>
// //                               <td>{data.companyName}</td>
// //                               <td>{data.mentorCategory}</td>
// //                               <td>
// //                                 <span className={data.isActive ? "unblock" : "block"}>
// //                                   {data.isActive ? "Active" : "Inactive"}
// //                                 </span>
// //                               </td>
// //                               <td>
// //                                 <span className={data.isActive ? "unblock" : "block"}>
// //                                   {data.status}
// //                                 </span>
// //                               </td>
// //                               <td>
// //                                 <button
// //                                   className="bg-transparent border-0"
// //                                   style={{ cursor: "pointer" }}
// //                                   data-bs-toggle="modal"
// //                                   data-bs-target="#detailsModal"
// //                                   onClick={() => handleUserView(data)}
// //                                 >
// //                                   <img src="/images/icons/show.svg" alt="icon" title="View Details" />
// //                                 </button>
// //                               </td>
// //                               <td>
// //                                 <button
// //                                   className="btn_send rounded px-3 py-1 pb-2"
// //                                   onClick={() => handleActionClick(data)}
// //                                   title="Approve/Reject"
// //                                   data-bs-toggle="modal"
// //                                   data-bs-target="#actionModal"
// //                                   disabled={data.status === 'approved' || data.status === 'rejected'}
// //                                 >
// //                                   <Icon icon="mdi:check-circle" width="18" height="18" style={{ color: "#eb660f" }} />
// //                                 </button>
// //                               </td>
// //                             </tr>
// //                           ))
// //                         )}
// //                       </tbody>
// //                     </table>
// //                   </div>
// //                 </div>
// //                 {TableData?.length > 0 && (
// //                   <Pagination
// //                     currentPage={state.currentPage}
// //                     totalPages={Math.ceil(totalMembers / state.perPage) || 1}
// //                     onPageChange={handlePageChange}
// //                   />
// //                 )}
// //               </div>
// //             </div>
// //           </div>

// //           {/* View Details Modal */}
// //           <div
// //             className="modal fade common__modal"
// //             id="detailsModal"
// //             tabIndex="-1"
// //             aria-labelledby="detailsModalLabel"
// //             aria-hidden="true"
// //           >
// //             <div className="modal-dialog modal-dialog-centered modal-lg">
// //               <div className="modal-content">
// //                 <div className="modal-header border-0 pb-0">
// //                   <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
// //                 </div>
// //                 <div className="modal-body pt-0 px-4">
// //                   <h1 className="modal-title mb-4" id="detailsModalLabel">Application Details</h1>
// //                   {selectedUserData && (
// //                     <div className="user-details">
// //                       <div className="row">
// //                         <div className="col-md-6 mb-3">
// //                           <div className="form__box">
// //                             <label>Full Name</label>
// //                             <input type="text" autoComplete="off" className="form-control shadow-none" value={selectedUserData.fullName} readOnly />
// //                           </div>
// //                         </div>
// //                         <div className="col-md-6 mb-3">
// //                           <div className="form__box">
// //                             <label>Email</label>
// //                             <input type="text" autoComplete="off" className="form-control shadow-none" value={selectedUserData.email} readOnly />
// //                           </div>
// //                         </div>
// //                         <div className="col-md-6 mb-3">
// //                           <div className="form__box">
// //                             <label>Phone</label>
// //                             <input type="text" autoComplete="off" className="form-control shadow-none" value={selectedUserData.phone} readOnly />
// //                           </div>
// //                         </div>
// //                         <div className="col-md-6 mb-3">
// //                           <div className="form__box">
// //                             <label>Date of Birth</label>
// //                             <input type="text" autoComplete="off" className="form-control shadow-none" value={formatDateWithAmPm(selectedUserData.dateOfBirth)} readOnly />
// //                           </div>
// //                         </div>
// //                         <div className="col-md-6 mb-3">
// //                           <div className="form__box">
// //                             <label>Location</label>
// //                             <input type="text" autoComplete="off" className="form-control shadow-none" value={selectedUserData.location} readOnly />
// //                           </div>
// //                         </div>
// //                         <div className="col-md-6 mb-3">
// //                           <div className="form__box">
// //                             <label>Current Role</label>
// //                             <input type="text" autoComplete="off" className="form-control shadow-none" value={selectedUserData.currentRole} readOnly />
// //                           </div>
// //                         </div>
// //                         <div className="col-md-6 mb-3">
// //                           <div className="form__box">
// //                             <label>Company Name</label>
// //                             <input type="text" autoComplete="off" className="form-control shadow-none" value={selectedUserData.companyName} readOnly />
// //                           </div>
// //                         </div>
// //                         <div className="col-md-6 mb-3">
// //                           <div className="form__box">
// //                             <label>Years of Experience</label>
// //                             <input type="text" autoComplete="off" className="form-control shadow-none" value={selectedUserData.yearsOfExperience} readOnly />
// //                           </div>
// //                         </div>
// //                         <div className="col-md-6 mb-3">
// //                           <div className="form__box">
// //                             <label>Mentor Category</label>
// //                             <input type="text" autoComplete="off" className="form-control shadow-none" value={selectedUserData.mentorCategory} readOnly />
// //                           </div>
// //                         </div>
// //                         <div className="col-md-6 mb-3">
// //                           <div className="form__box">
// //                             <label>Mentoring Style</label>
// //                             <input type="text" autoComplete="off" className="form-control shadow-none" value={selectedUserData.mentoringStyle} readOnly />
// //                           </div>
// //                         </div>
// //                         <div className="col-md-6 mb-3">
// //                           <div className="form__box">
// //                             <label>Mentoring Frequency</label>
// //                             <input type="text" autoComplete="off" className="form-control shadow-none" value={selectedUserData.mentoringFrequency} readOnly />
// //                           </div>
// //                         </div>
// //                         <div className="col-md-6 mb-3">
// //                           <div className="form__box">
// //                             <label>Hourly Rate</label>
// //                             <input type="text" autoComplete="off" className="form-control shadow-none" value={`₹${selectedUserData.hourlyRate}`} readOnly />
// //                           </div>
// //                         </div>
// //                         <div className="col-md-6 mb-3">
// //                           <div className="form__box">
// //                             <label>Languages</label>
// //                             <input type="text" autoComplete="off" className="form-control shadow-none" value={selectedUserData.languages?.join(", ")} readOnly />
// //                           </div>
// //                         </div>
// //                         <div className="col-md-6 mb-3">
// //                           <div className="form__box">
// //                             <label>LinkedIn URL</label>
// //                             <input type="text" autoComplete="off" className="form-control shadow-none" value={selectedUserData.linkedinUrl} readOnly />
// //                           </div>
// //                         </div>
// //                         <div className="col-md-12 mb-3">
// //                           <div className="form__box">
// //                             <label>Areas of Interest</label>
// //                             <input type="text" autoComplete="off" className="form-control shadow-none" value={selectedUserData.areasOfInterest} readOnly />
// //                           </div>
// //                         </div>
// //                         <div className="col-md-12 mb-3">
// //                           <div className="form__box">
// //                             <label>Motivation Statement</label>
// //                             <textarea className="form-control shadow-none" rows="3" value={selectedUserData.motivationStatement} readOnly />
// //                           </div>
// //                         </div>
// //                         <div className="col-md-6 mb-3">
// //                           <div className="form__box">
// //                             <label>Status</label>
// //                             <input type="text" autoComplete="off" className="form-control shadow-none" value={selectedUserData.isActive ? "Active" : "Inactive"} readOnly />
// //                           </div>
// //                         </div>
// //                       </div>
// //                       <div className="text-center my-4">
// //                         <button type="button" className="btn btn-secondary px-3" data-bs-dismiss="modal">Close</button>
// //                       </div>
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Approve/Reject/On Hold Action Modal */}
// //           <div
// //             className="modal fade common__modal"
// //             id="actionModal"
// //             tabIndex="-1"
// //             aria-labelledby="actionModalLabel"
// //             aria-hidden="true"
// //           >
// //             <div className="modal-dialog modal-dialog-centered">
// //               <div className="modal-content">
// //                 <div className="modal-header border-0 pb-0">
// //                   <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
// //                 </div>
// //                 <div className="modal-body pt-0 px-4">
// //                   <h1 className="modal-title mb-4 text-center" id="actionModalLabel">Application Action</h1>
// //                   {selectedUserData && (
// //                     <div className="action-content text-center">
// //                       <p className="mb-4">
// //                         Select an action for <strong>{selectedUserData.fullName}</strong>'s application
// //                       </p>
// //                       <div className="d-flex gap-3 justify-content-center flex-wrap">
// //                         <button
// //                           type="button"
// //                           className="btn btn-success px-4"
// //                           onClick={() => handleApproveReject('approve')}
// //                           disabled={isUpdating}
// //                           data-bs-dismiss="modal"
// //                         >
// //                           {isUpdating ? "Processing..." : "Approve"}
// //                         </button>
// //                         <button
// //                           type="button"
// //                           className="btn btn-warning px-4"
// //                           onClick={() => handleApproveReject('onhold')}
// //                           disabled={isUpdating}
// //                           data-bs-dismiss="modal"
// //                         >
// //                           {isUpdating ? "Processing..." : "On Hold"}
// //                         </button>
// //                         <button
// //                           type="button"
// //                           className="btn btn-danger px-4"
// //                           onClick={() => handleApproveReject('reject')}
// //                           disabled={isUpdating}
// //                           data-bs-dismiss="modal"
// //                         >
// //                           {isUpdating ? "Processing..." : "Reject"}
// //                         </button>
// //                       </div>
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </section>
// //       </DashboardLayout>
// //     </>
// //   );
// // };

// // export default UserManagement;


// // import React, { useState, useEffect, useContext } from "react";
// // import { Icon } from "@iconify/react/dist/iconify.js";
// // import Pagination from "../../components/Pagination";
// // import DashboardLayout from "../../Layout/DashboardLayout";
// // import {
// //   useGetUserQuery,
// //   useApproveRejectApplicationMutation,
// //   useUpdateMentorMutation,
// // } from "./userApiSlice";
// // import Skeleton from "react-loading-skeleton";
// // import { toast } from "react-toastify";
// // import { StateContext } from "../../context/StateContext";

// // const UserManagement = () => {
// //   const { amount, setAmount, transaction_type, setTransactionType } =
// //     useContext(StateContext);

// //   const [refresh, setRefresh] = useState(false);
// //   const [selectedUserId, setSelectedUserId] = useState(null);
// //   const [selectedUserData, setSelectedUserData] = useState(null);
// //   const [editFormData, setEditFormData] = useState({});
// //   const [isEditMode, setIsEditMode] = useState(false);
// //   const [check1, setCheck1] = useState(false);
// //   const [showActionModal, setShowActionModal] = useState(false);

// //   // Pagination state
// //   const [state, setState] = useState({
// //     currentPage: 1,
// //     perPage: 10,
// //     search: "",
// //   });

// //   const queryParams = `limit=${state.perPage}&page=${state.currentPage}&search=${state.search}`;

// //   const { data: getUser, isLoading, isFetching, refetch } = useGetUserQuery(queryParams);
// //   const [approveRejectApplication, { isLoading: isUpdating }] = useApproveRejectApplicationMutation();
// //   const [updateMentor, { isLoading: isSaving }] = useUpdateMentorMutation();

// //   const TableData = getUser?.data?.data || [];
// //   const totalMembers = TableData.length || 0;
// //   const blockedUser = TableData.filter((user) => user.isBlock).length || 0;
// //   const activeMembers = TableData.filter((user) => user.isActive).length || 0;

// //   // Handle page change
// //   const handlePageChange = (e) => {
// //     setState({ ...state, currentPage: e });
// //   };

// //   // Handle search with debounce
// //   let searchTimeout;
// //   const handleSearch = (e) => {
// //     clearTimeout(searchTimeout);
// //     searchTimeout = setTimeout(() => {
// //       setState({ ...state, search: e.target.value, currentPage: 1 });
// //     }, 1000);
// //   };

// //   useEffect(() => {
// //     refetch();
// //     return () => {
// //       clearTimeout(searchTimeout);
// //     };
// //   }, []);

// //   // Handle user view — seed edit form with current data
// //   const handleUserView = (user) => {
// //     setSelectedUserId(user._id);
// //     setSelectedUserData(user);
// //     setEditFormData({
// //       fullName: user.fullName || "",
// //       email: user.email || "",
// //       phone: user.phone || "",
// //       dateOfBirth: user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : "",
// //       location: user.location || "",
// //       currentRole: user.currentRole || "",
// //       companyName: user.companyName || "",
// //       yearsOfExperience: user.yearsOfExperience || "",
// //       mentorCategory: user.mentorCategory || "",
// //       mentoringStyle: user.mentoringStyle || "",
// //       mentoringFrequency: user.mentoringFrequency || "",
// //       hourlyRate: user.hourlyRate || "",
// //       languages: user.languages?.join(", ") || "",
// //       linkedinUrl: user.linkedinUrl || "",
// //       areasOfInterest: user.areasOfInterest || "",
// //       motivationStatement: user.motivationStatement || "",
// //     });
// //     setIsEditMode(false);
// //   };

// //   // Handle edit form field changes
// //   const handleEditChange = (field, value) => {
// //     setEditFormData((prev) => ({ ...prev, [field]: value }));
// //   };

// //   // Save updated mentor data
// //   const handleSaveEdit = async () => {
// //     try {
// //       const payload = {
// //         ...editFormData,
// //         languages: editFormData.languages
// //           ? editFormData.languages.split(",").map((l) => l.trim()).filter(Boolean)
// //           : [],
// //       };

// //       await updateMentor({ id: selectedUserId, data: payload }).unwrap();

// //       toast.success("Mentor details updated successfully", {
// //         position: "top-center",
// //         autoClose: 4000,
// //       });

// //       setIsEditMode(false);
// //       refetch();
// //     } catch (error) {
// //       console.error("Update failed:", error);
// //       toast.error(error?.data?.message || "Failed to update mentor details", {
// //         position: "top-center",
// //       });
// //     }
// //   };

// //   // Handle action button click (Approve/Reject)
// //   const handleActionClick = (user) => {
// //     setSelectedUserId(user._id);
// //     setSelectedUserData(user);
// //     setShowActionModal(true);
// //   };

// //   const handleApproveReject = async (action) => {
// //     try {
// //       await approveRejectApplication({ id: selectedUserId, action }).unwrap();

// //       const actionText =
// //         action === "approve"
// //           ? "approved"
// //           : action === "reject"
// //             ? "rejected"
// //             : "put on hold";

// //       toast.success(
// //         action === "approve"
// //           ? "Application approved! Password reset email sent to mentor."
// //           : `Application ${actionText} successfully`,
// //         { position: "top-center", autoClose: 5000 }
// //       );

// //       setShowActionModal(false);
// //       setSelectedUserId(null);
// //       setSelectedUserData(null);
// //       refetch();
// //     } catch (error) {
// //       console.error("Action failed:", error);
// //       toast.error(error?.data?.message || `Failed to ${action} application`, {
// //         position: "top-center",
// //       });
// //     }
// //   };

// //   // Handle check for transaction
// //   const handleCheck = (userId) => {
// //     setSelectedUserId(userId);
// //     setCheck1(true);
// //   };

// //   // Handle transaction submission
// //   const handleTransactionSubmit = async (e, transactionType, amount) => {
// //     e.preventDefault();

// //     if (!amount || amount === "") {
// //       toast.error("Enter amount");
// //       setAmount("");
// //       return;
// //     }
// //     if (amount < 1) {
// //       toast.error("Amount must be greater than 1");
// //       setAmount("");
// //       return;
// //     }
// //     if (!/^[0-9]+(\.[0-9]+)?$/.test(amount)) {
// //       toast.error("Enter only valid numbers");
// //       setAmount("");
// //       return;
// //     }

// //     try {
// //       toast.success("Transaction sent successfully", { position: "top-center" });
// //       setAmount("");
// //       setTransactionType("referral_amount");
// //       setCheck1(false);
// //       setRefresh(true);
// //     } catch (error) {
// //       console.error("Transaction failed:", error);
// //       toast.error(error?.data?.message || "Transaction failed");
// //       setAmount("");
// //     }
// //   };

// //   // Format date with AM/PM
// //   const formatDateWithAmPm = (isoString) => {
// //     if (!isoString) return "N/A";
// //     const date = new Date(isoString);
// //     const day = String(date.getDate()).padStart(2, "0");
// //     const month = String(date.getMonth() + 1).padStart(2, "0");
// //     const year = date.getFullYear();
// //     let hours = date.getHours();
// //     const minutes = String(date.getMinutes()).padStart(2, "0");
// //     const amPm = hours >= 12 ? "PM" : "AM";
// //     hours = hours % 12 || 12;
// //     return `${day}-${month}-${year} ${hours}:${minutes} ${amPm}`;
// //   };

// //   useEffect(() => {
// //     if (refresh) {
// //       refetch();
// //       setRefresh(false);
// //     }
// //   }, [refresh, refetch]);

// //   // Reusable editable field renderer
// //   const renderField = (label, field, type = "text", fullWidth = false) => (
// //     <div className={`${fullWidth ? "col-md-12" : "col-md-6"} mb-3`} key={field}>
// //       <div className="form__box">
// //         <label>{label}</label>
// //         <input
// //           type={type}
// //           autoComplete="off"
// //           className={`form-control shadow-none${isEditMode ? " edit-active" : ""}`}
// //           value={editFormData[field] ?? ""}
// //           readOnly={!isEditMode}
// //           onChange={(e) => handleEditChange(field, e.target.value)}
// //           style={
// //             isEditMode
// //               ? { borderColor: "#eb660f", background: "rgba(235,102,15,0.06)" }
// //               : {}
// //           }
// //         />
// //       </div>
// //     </div>
// //   );

// //   const renderTextarea = (label, field) => (
// //     <div className="col-md-12 mb-3" key={field}>
// //       <div className="form__box">
// //         <label>{label}</label>
// //         <textarea
// //           className={`form-control shadow-none${isEditMode ? " edit-active" : ""}`}
// //           rows="3"
// //           value={editFormData[field] ?? ""}
// //           readOnly={!isEditMode}
// //           onChange={(e) => handleEditChange(field, e.target.value)}
// //           style={
// //             isEditMode
// //               ? { borderColor: "#eb660f", background: "rgba(235,102,15,0.06)" }
// //               : {}
// //           }
// //         />
// //       </div>
// //     </div>
// //   );

// //   return (
// //     <>
// //       <style>{`
// //         @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
// //         .edit-active { transition: border-color 0.2s, background 0.2s; }
// //         .edit-toggle-btn { border: 1.5px solid #eb660f; color: #eb660f; background: transparent; border-radius: 6px; padding: 5px 16px; font-size: 14px; cursor: pointer; transition: background 0.15s, color 0.15s; }
// //         .edit-toggle-btn:hover { background: #eb660f; color: #fff; }
// //         .edit-toggle-btn.active { background: #eb660f; color: #fff; }
// //         .save-btn { background: #eb660f; border: none; color: #fff; border-radius: 6px; padding: 5px 20px; font-size: 14px; cursor: pointer; }
// //         .save-btn:disabled { opacity: 0.65; cursor: not-allowed; }
// //         .cancel-edit-btn { background: transparent; border: 1.5px solid #6c757d; color: #6c757d; border-radius: 6px; padding: 5px 16px; font-size: 14px; cursor: pointer; }
// //         .cancel-edit-btn:hover { background: #6c757d; color: #fff; }
// //         .edit-mode-banner { background: rgba(235,102,15,0.10); border-left: 3px solid #eb660f; border-radius: 4px; padding: 7px 14px; font-size: 13px; color: #eb660f; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
// //       `}</style>
// //       <DashboardLayout>
// //         <section className="profile_section user__management py-4">
// //           <div className="container-fluid">
// //             <div className="row">
// //               {/* Total Members Card */}
// //               <div className="col-12 col-sm-4">
// //                 <div className="my_total_team_data mb-4 rounded-3 px-3 py-3 py-md-4">
// //                   <div className="total_user_card d-flex align-items-center gap-2 gap-md-3">
// //                     <div className="total_user_images rounded-3 p-2 p-md-4">
// //                       <img src="/images/total-member.png" alt="total-member" className="img-fluid" />
// //                     </div>
// //                     <div className="total_user_card_data">
// //                       <h2>{totalMembers}</h2>
// //                       <h5>Total Applications</h5>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Total Blocked Card */}
// //               <div className="col-12 col-sm-4">
// //                 <div className="my_total_team_data mb-4 rounded-3 px-3 py-3 py-md-4">
// //                   <div className="total_user_card d-flex align-items-center gap-2 gap-md-3">
// //                     <div className="total_user_images rounded-3 p-2 p-md-4">
// //                       <img src="/images/total-member.png" alt="total-member" className="img-fluid" />
// //                     </div>
// //                     <div className="total_user_card_data">
// //                       <h2>{blockedUser}</h2>
// //                       <h5>Total Blocked</h5>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Total Active Members Card */}
// //               <div className="col-12 col-sm-4">
// //                 <div className="my_total_team_data mb-4 rounded-3 px-3 py-3 py-md-4">
// //                   <div className="total_user_card d-flex align-items-center gap-2 gap-md-3">
// //                     <div className="total_user_images rounded-3 p-2 p-md-4">
// //                       <img src="/images/total-member.png" alt="total-member" className="img-fluid" />
// //                     </div>
// //                     <div className="total_user_card_data">
// //                       <h2>{activeMembers}</h2>
// //                       <h5>Total Active</h5>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* User Table */}
// //               <div className="col-12">
// //                 <div className="my_total_team_data rounded-3 px-3 py-4">
// //                   <div className="d-flex align-items-center justify-content-between mb-3">
// //                     <h1 className="mb-0">Mentor Applications Management</h1>
// //                     <button
// //                       type="button"
// //                       className="btn d-flex align-items-center gap-2"
// //                       style={{ backgroundColor: "#eb660f", borderColor: "#eb660f", color: "#fff" }}
// //                       onClick={() => refetch()}
// //                       disabled={isFetching}
// //                       title="Refresh"
// //                     >
// //                       <Icon
// //                         icon="mdi:refresh"
// //                         width="18"
// //                         height="18"
// //                         style={{ animation: isFetching ? "spin 1s linear infinite" : "none" }}
// //                       />
// //                       {isFetching ? "Refreshing..." : "Refresh"}
// //                     </button>
// //                   </div>

// //                   <div className="row justify-content-between">
// //                     <div className="col-12 col-sm-6 col-md-2 col-xxl-1">
// //                       <div className="pagination__box mb-4">
// //                         <div className="showing_data">
// //                           <select
// //                             className="form-select shadow-none"
// //                             aria-label="Default select example"
// //                             onChange={(e) =>
// //                               setState({ ...state, perPage: e.target.value, currentPage: 1 })
// //                             }
// //                           >
// //                             <option value="10">10</option>
// //                             <option value="30">30</option>
// //                             <option value="50">50</option>
// //                           </select>
// //                         </div>
// //                       </div>
// //                     </div>

// //                     <div className="col-12 col-sm-6 col-md-3 col-lg-2">
// //                       <div className="select_level_data mb-4">
// //                         <div className="input-group search_group">
// //                           <span
// //                             className="input-group-text border-0 shadow-none bg-transparent rounded-0 pe-0"
// //                             id="basic-addon1"
// //                           >
// //                             <Icon icon="tabler:search" width="16" height="16" style={{ color: "var(--white)" }} />
// //                           </span>
// //                           <input
// //                             type="text"
// //                             autoComplete="off"
// //                             className="form-control border-0 shadow-none rounded-0 bg-transparent"
// //                             placeholder="Search"
// //                             onChange={handleSearch}
// //                           />
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>

// //                   <div className="table_data table-responsive">
// //                     <table className="table mb-0">
// //                       <thead>
// //                         <tr>
// //                           <th scope="col">S.No</th>
// //                           <th scope="col">Full Name</th>
// //                           <th scope="col">Email</th>
// //                           <th scope="col">Phone</th>
// //                           <th scope="col">Location</th>
// //                           <th scope="col">Current Role</th>
// //                           <th scope="col">Company</th>
// //                           <th scope="col">Mentor Category</th>
// //                           <th scope="col">Status</th>
// //                           <th scope="col">Action status</th>
// //                           <th scope="col">View Details</th>
// //                           <th scope="col">Action</th>
// //                         </tr>
// //                       </thead>
// //                       <tbody>
// //                         {isLoading || isFetching ? (
// //                           <>
// //                             {[...Array(10)].map((e, i) => (
// //                               <tr key={i}>
// //                                 {[...Array(11)].map((_, j) => (
// //                                   <td key={j}><Skeleton /></td>
// //                                 ))}
// //                               </tr>
// //                             ))}
// //                           </>
// //                         ) : TableData.length === 0 ? (
// //                           <tr>
// //                             <td colSpan="11" className="text-center">No data found</td>
// //                           </tr>
// //                         ) : (
// //                           TableData.map((data, i) => (
// //                             <tr key={data._id}>
// //                               <td>{state.currentPage * state.perPage - (state.perPage - 1) + i}.</td>
// //                               <td>{data.fullName}</td>
// //                               <td>{data.email}</td>
// //                               <td>{data.phone}</td>
// //                               <td>{data.location}</td>
// //                               <td>{data.currentRole}</td>
// //                               <td>{data.companyName}</td>
// //                               <td>{data.mentorCategory}</td>
// //                               <td>
// //                                 <span className={data.isActive ? "unblock" : "block"}>
// //                                   {data.isActive ? "Active" : "Inactive"}
// //                                 </span>
// //                               </td>
// //                               <td>
// //                                 <span className={data.isActive ? "unblock" : "block"}>
// //                                   {data.status}
// //                                 </span>
// //                               </td>
// //                               <td>
// //                                 <button
// //                                   className="bg-transparent border-0"
// //                                   style={{ cursor: "pointer" }}
// //                                   data-bs-toggle="modal"
// //                                   data-bs-target="#detailsModal"
// //                                   onClick={() => handleUserView(data)}
// //                                 >
// //                                   <img src="/images/icons/show.svg" alt="icon" title="View Details" />
// //                                 </button>
// //                               </td>
// //                               <td>
// //                                 <button
// //                                   className="btn_send rounded px-3 py-1 pb-2"
// //                                   onClick={() => handleActionClick(data)}
// //                                   title="Approve/Reject"
// //                                   data-bs-toggle="modal"
// //                                   data-bs-target="#actionModal"
// //                                   disabled={data.status === "approved" || data.status === "rejected"}
// //                                 >
// //                                   <Icon icon="mdi:check-circle" width="18" height="18" style={{ color: "#eb660f" }} />
// //                                 </button>
// //                               </td>
// //                             </tr>
// //                           ))
// //                         )}
// //                       </tbody>
// //                     </table>
// //                   </div>
// //                 </div>
// //                 {TableData?.length > 0 && (
// //                   <Pagination
// //                     currentPage={state.currentPage}
// //                     totalPages={Math.ceil(totalMembers / state.perPage) || 1}
// //                     onPageChange={handlePageChange}
// //                   />
// //                 )}
// //               </div>
// //             </div>
// //           </div>

// //           {/* ─── View / Edit Details Modal ─────────────────────────────── */}
// //           <div
// //             className="modal fade common__modal"
// //             id="detailsModal"
// //             tabIndex="-1"
// //             aria-labelledby="detailsModalLabel"
// //             aria-hidden="true"
// //           >
// //             <div className="modal-dialog modal-dialog-centered modal-lg">
// //               <div className="modal-content">
// //                 <div className="modal-header border-0 pb-0">
// //                   <button
// //                     type="button"
// //                     className="btn-close"
// //                     data-bs-dismiss="modal"
// //                     aria-label="Close"
// //                     onClick={() => setIsEditMode(false)}
// //                   />
// //                 </div>

// //                 <div className="modal-body pt-0 px-4">
// //                   {/* Modal title row + Edit / Save / Cancel buttons */}
// //                   <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
// //                     <h1 className="modal-title mb-0" id="detailsModalLabel">
// //                       Application Details
// //                     </h1>
// //                     <div className="d-flex gap-2">
// //                       {!isEditMode ? (
// //                         <button
// //                           type="button"
// //                           className="edit-toggle-btn"
// //                           onClick={() => setIsEditMode(true)}
// //                         >
// //                           <Icon icon="mdi:pencil" width="14" height="14" style={{ marginRight: 4 }} />
// //                           Edit
// //                         </button>
// //                       ) : (
// //                         <>
// //                           <button
// //                             type="button"
// //                             className="cancel-edit-btn"
// //                             onClick={() => {
// //                               setIsEditMode(false);
// //                               // reset form back to original
// //                               if (selectedUserData) handleUserView(selectedUserData);
// //                             }}
// //                           >
// //                             Cancel
// //                           </button>
// //                           <button
// //                             type="button"
// //                             className="save-btn"
// //                             onClick={handleSaveEdit}
// //                             disabled={isSaving}
// //                           >
// //                             {isSaving ? "Saving..." : "Save Changes"}
// //                           </button>
// //                         </>
// //                       )}
// //                     </div>
// //                   </div>

// //                   {/* Edit mode indicator banner */}
// //                   {isEditMode && (
// //                     <div className="edit-mode-banner">
// //                       <Icon icon="mdi:information-outline" width="16" height="16" />
// //                       Edit mode is active. Modify fields below and click <strong>&nbsp;Save Changes</strong>.
// //                     </div>
// //                   )}

// //                   {selectedUserData && (
// //                     <div className="user-details">
// //                       <div className="row">
// //                         {renderField("Full Name", "fullName")}
// //                         {renderField("Email", "email", "email")}
// //                         {renderField("Phone", "phone", "tel")}
// //                         {renderField("Date of Birth", "dateOfBirth", "date")}
// //                         {renderField("Location", "location")}
// //                         {renderField("Current Role", "currentRole")}
// //                         {renderField("Company Name", "companyName")}
// //                         {renderField("Years of Experience", "yearsOfExperience", "number")}
// //                         {renderField("Mentor Category", "mentorCategory")}
// //                         {renderField("Mentoring Style", "mentoringStyle")}
// //                         {renderField("Mentoring Frequency", "mentoringFrequency")}
// //                         {renderField("Hourly Rate (₹)", "hourlyRate", "number")}
// //                         {renderField("Languages (comma-separated)", "languages")}
// //                         {renderField("LinkedIn URL", "linkedinUrl", "url")}
// //                         {renderField("Areas of Interest", "areasOfInterest", "text", true)}
// //                         {renderTextarea("Motivation Statement", "motivationStatement")}

// //                         {/* Status — read-only always */}
// //                         <div className="col-md-6 mb-3">
// //                           <div className="form__box">
// //                             <label>Status</label>
// //                             <input
// //                               type="text"
// //                               autoComplete="off"
// //                               className="form-control shadow-none"
// //                               value={selectedUserData.isActive ? "Active" : "Inactive"}
// //                               readOnly
// //                             />
// //                           </div>
// //                         </div>
// //                       </div>

// //                       <div className="text-center my-4">
// //                         <button
// //                           type="button"
// //                           className="btn btn-secondary px-3"
// //                           data-bs-dismiss="modal"
// //                           onClick={() => setIsEditMode(false)}
// //                         >
// //                           Close
// //                         </button>
// //                       </div>
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* ─── Approve / Reject / On Hold Action Modal ───────────────── */}
// //           <div
// //             className="modal fade common__modal"
// //             id="actionModal"
// //             tabIndex="-1"
// //             aria-labelledby="actionModalLabel"
// //             aria-hidden="true"
// //           >
// //             <div className="modal-dialog modal-dialog-centered">
// //               <div className="modal-content">
// //                 <div className="modal-header border-0 pb-0">
// //                   <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
// //                 </div>
// //                 <div className="modal-body pt-0 px-4">
// //                   <h1 className="modal-title mb-4 text-center" id="actionModalLabel">Application Action</h1>
// //                   {selectedUserData && (
// //                     <div className="action-content text-center">
// //                       <p className="mb-4">
// //                         Select an action for <strong>{selectedUserData.fullName}</strong>'s application
// //                       </p>
// //                       <div className="d-flex gap-3 justify-content-center flex-wrap">
// //                         <button
// //                           type="button"
// //                           className="btn btn-success px-4"
// //                           onClick={() => handleApproveReject("approve")}
// //                           disabled={isUpdating}
// //                           data-bs-dismiss="modal"
// //                         >
// //                           {isUpdating ? "Processing..." : "Approve"}
// //                         </button>
// //                         <button
// //                           type="button"
// //                           className="btn btn-warning px-4"
// //                           onClick={() => handleApproveReject("onhold")}
// //                           disabled={isUpdating}
// //                           data-bs-dismiss="modal"
// //                         >
// //                           {isUpdating ? "Processing..." : "On Hold"}
// //                         </button>
// //                         <button
// //                           type="button"
// //                           className="btn btn-danger px-4"
// //                           onClick={() => handleApproveReject("reject")}
// //                           disabled={isUpdating}
// //                           data-bs-dismiss="modal"
// //                         >
// //                           {isUpdating ? "Processing..." : "Reject"}
// //                         </button>
// //                       </div>
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </section>
// //       </DashboardLayout>
// //     </>
// //   );
// // };

// // export default UserManagement;




// import React, { useState, useEffect, useContext } from "react";
// import { Icon } from "@iconify/react/dist/iconify.js";
// import Pagination from "../../components/Pagination";
// import DashboardLayout from "../../Layout/DashboardLayout";
// import {
//   useGetUserQuery,
//   useApproveRejectApplicationMutation,
//   useUpdateMentorMutation,
// } from "./userApiSlice";
// import Skeleton from "react-loading-skeleton";
// import { toast } from "react-toastify";
// import { StateContext } from "../../context/StateContext";

// const UserManagement = () => {
//   const { amount, setAmount, transaction_type, setTransactionType } =
//     useContext(StateContext);

//   const [refresh, setRefresh] = useState(false);
//   const [selectedUserId, setSelectedUserId] = useState(null);
//   const [selectedUserData, setSelectedUserData] = useState(null);
//   const [editFormData, setEditFormData] = useState({});
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [check1, setCheck1] = useState(false);
//   const [showActionModal, setShowActionModal] = useState(false);

//   // Pagination state
//   const [state, setState] = useState({
//     currentPage: 1,
//     perPage: 10,
//     search: "",
//   });

//   const queryParams = `limit=${state.perPage}&page=${state.currentPage}&search=${state.search}`;

//   const { data: getUser, isLoading, isFetching, refetch } = useGetUserQuery(queryParams);
//   const [approveRejectApplication, { isLoading: isUpdating }] = useApproveRejectApplicationMutation();
//   const [updateMentor, { isLoading: isSaving }] = useUpdateMentorMutation();

//   const TableData = getUser?.data?.data || [];
//   const totalMembers = TableData.length || 0;
//   const blockedUser = TableData.filter((user) => user.isBlock).length || 0;
//   const activeMembers = TableData.filter((user) => user.isActive).length || 0;

//   // Stats card data — 3 cards, each takes col-sm-4 → equal thirds
//   const statsCards = [
//     { count: totalMembers,   label: "Total Applications", alt: "total-applications" },
//     { count: blockedUser,    label: "Total Blocked",      alt: "total-blocked"      },
//     { count: activeMembers,  label: "Total Active",       alt: "total-active"       },
//   ];

//   // Handle page change
//   const handlePageChange = (e) => {
//     setState({ ...state, currentPage: e });
//   };

//   // Handle search with debounce
//   let searchTimeout;
//   const handleSearch = (e) => {
//     clearTimeout(searchTimeout);
//     searchTimeout = setTimeout(() => {
//       setState({ ...state, search: e.target.value, currentPage: 1 });
//     }, 1000);
//   };

//   useEffect(() => {
//     refetch();
//     return () => {
//       clearTimeout(searchTimeout);
//     };
//   }, []);

//   // Handle user view — seed edit form with current data
//   const handleUserView = (user) => {
//     setSelectedUserId(user._id);
//     setSelectedUserData(user);
//     setEditFormData({
//       fullName: user.fullName || "",
//       email: user.email || "",
//       phone: user.phone || "",
//       dateOfBirth: user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : "",
//       location: user.location || "",
//       currentRole: user.currentRole || "",
//       companyName: user.companyName || "",
//       yearsOfExperience: user.yearsOfExperience || "",
//       mentorCategory: user.mentorCategory || "",
//       mentoringStyle: user.mentoringStyle || "",
//       mentoringFrequency: user.mentoringFrequency || "",
//       hourlyRate: user.hourlyRate || "",
//       languages: user.languages?.join(", ") || "",
//       linkedinUrl: user.linkedinUrl || "",
//       areasOfInterest: user.areasOfInterest || "",
//       motivationStatement: user.motivationStatement || "",
//     });
//     setIsEditMode(false);
//   };

//   // Handle edit form field changes
//   const handleEditChange = (field, value) => {
//     setEditFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   // Save updated mentor data
//   const handleSaveEdit = async () => {
//     try {
//       const payload = {
//         ...editFormData,
//         languages: editFormData.languages
//           ? editFormData.languages.split(",").map((l) => l.trim()).filter(Boolean)
//           : [],
//       };

//       await updateMentor({ id: selectedUserId, data: payload }).unwrap();

//       toast.success("Mentor details updated successfully", {
//         position: "top-center",
//         autoClose: 4000,
//       });

//       setIsEditMode(false);
//       refetch();
//     } catch (error) {
//       console.error("Update failed:", error);
//       toast.error(error?.data?.message || "Failed to update mentor details", {
//         position: "top-center",
//       });
//     }
//   };

//   // Handle action button click (Approve/Reject)
//   const handleActionClick = (user) => {
//     setSelectedUserId(user._id);
//     setSelectedUserData(user);
//     setShowActionModal(true);
//   };

//   const handleApproveReject = async (action) => {
//     try {
//       await approveRejectApplication({ id: selectedUserId, action }).unwrap();

//       const actionText =
//         action === "approve"
//           ? "approved"
//           : action === "reject"
//             ? "rejected"
//             : "put on hold";

//       toast.success(
//         action === "approve"
//           ? "Application approved! Password reset email sent to mentor."
//           : `Application ${actionText} successfully`,
//         { position: "top-center", autoClose: 5000 }
//       );

//       setShowActionModal(false);
//       setSelectedUserId(null);
//       setSelectedUserData(null);
//       refetch();
//     } catch (error) {
//       console.error("Action failed:", error);
//       toast.error(error?.data?.message || `Failed to ${action} application`, {
//         position: "top-center",
//       });
//     }
//   };

//   // Handle check for transaction
//   const handleCheck = (userId) => {
//     setSelectedUserId(userId);
//     setCheck1(true);
//   };

//   // Handle transaction submission
//   const handleTransactionSubmit = async (e, transactionType, amount) => {
//     e.preventDefault();

//     if (!amount || amount === "") {
//       toast.error("Enter amount");
//       setAmount("");
//       return;
//     }
//     if (amount < 1) {
//       toast.error("Amount must be greater than 1");
//       setAmount("");
//       return;
//     }
//     if (!/^[0-9]+(\.[0-9]+)?$/.test(amount)) {
//       toast.error("Enter only valid numbers");
//       setAmount("");
//       return;
//     }

//     try {
//       toast.success("Transaction sent successfully", { position: "top-center" });
//       setAmount("");
//       setTransactionType("referral_amount");
//       setCheck1(false);
//       setRefresh(true);
//     } catch (error) {
//       console.error("Transaction failed:", error);
//       toast.error(error?.data?.message || "Transaction failed");
//       setAmount("");
//     }
//   };

//   // Format date with AM/PM
//   const formatDateWithAmPm = (isoString) => {
//     if (!isoString) return "N/A";
//     const date = new Date(isoString);
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();
//     let hours = date.getHours();
//     const minutes = String(date.getMinutes()).padStart(2, "0");
//     const amPm = hours >= 12 ? "PM" : "AM";
//     hours = hours % 12 || 12;
//     return `${day}-${month}-${year} ${hours}:${minutes} ${amPm}`;
//   };

//   useEffect(() => {
//     if (refresh) {
//       refetch();
//       setRefresh(false);
//     }
//   }, [refresh, refetch]);

//   // Reusable editable field renderer
//   const renderField = (label, field, type = "text", fullWidth = false) => (
//     <div className={`${fullWidth ? "col-md-12" : "col-md-6"} mb-3`} key={field}>
//       <div className="form__box">
//         <label>{label}</label>
//         <input
//           type={type}
//           autoComplete="off"
//           className={`form-control shadow-none${isEditMode ? " edit-active" : ""}`}
//           value={editFormData[field] ?? ""}
//           readOnly={!isEditMode}
//           onChange={(e) => handleEditChange(field, e.target.value)}
//           style={
//             isEditMode
//               ? { borderColor: "#eb660f", background: "rgba(235,102,15,0.06)" }
//               : {}
//           }
//         />
//       </div>
//     </div>
//   );

//   const renderTextarea = (label, field) => (
//     <div className="col-md-12 mb-3" key={field}>
//       <div className="form__box">
//         <label>{label}</label>
//         <textarea
//           className={`form-control shadow-none${isEditMode ? " edit-active" : ""}`}
//           rows="3"
//           value={editFormData[field] ?? ""}
//           readOnly={!isEditMode}
//           onChange={(e) => handleEditChange(field, e.target.value)}
//           style={
//             isEditMode
//               ? { borderColor: "#eb660f", background: "rgba(235,102,15,0.06)" }
//               : {}
//           }
//         />
//       </div>
//     </div>
//   );

//   return (
//     <>
//       <style>{`
//         @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
//         .edit-active { transition: border-color 0.2s, background 0.2s; }
//         .edit-toggle-btn { border: 1.5px solid #eb660f; color: #eb660f; background: transparent; border-radius: 6px; padding: 5px 16px; font-size: 14px; cursor: pointer; transition: background 0.15s, color 0.15s; }
//         .edit-toggle-btn:hover { background: #eb660f; color: #fff; }
//         .edit-toggle-btn.active { background: #eb660f; color: #fff; }
//         .save-btn { background: #eb660f; border: none; color: #fff; border-radius: 6px; padding: 5px 20px; font-size: 14px; cursor: pointer; }
//         .save-btn:disabled { opacity: 0.65; cursor: not-allowed; }
//         .cancel-edit-btn { background: transparent; border: 1.5px solid #6c757d; color: #6c757d; border-radius: 6px; padding: 5px 16px; font-size: 14px; cursor: pointer; }
//         .cancel-edit-btn:hover { background: #6c757d; color: #fff; }
//         .edit-mode-banner { background: rgba(235,102,15,0.10); border-left: 3px solid #eb660f; border-radius: 4px; padding: 7px 14px; font-size: 13px; color: #eb660f; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }

//         /* Equal-height stat cards */
//         .stat-card-col { display: flex; margin-bottom: 1.5rem; }
//         .stat-card-inner { display: flex; align-items: center; width: 100%; border-radius: 0.5rem; padding: 1rem 1.25rem; }
//         @media (min-width: 768px) { .stat-card-inner { padding: 1.25rem 1.5rem; } }
//         .stat-card-icon { flex-shrink: 0; border-radius: 0.5rem; padding: 0.6rem; display: flex; align-items: center; justify-content: center; }
//         @media (min-width: 768px) { .stat-card-icon { padding: 0.85rem; } }
//         .stat-card-icon img { width: 40px; height: 40px; object-fit: contain; display: block; }
//         .stat-card-text h2 { margin-bottom: 0.1rem; line-height: 1.2; }
//         .stat-card-text h5 { margin-bottom: 0; }
//       `}</style>

//       <DashboardLayout>
//         <section className="profile_section user__management py-4">
//           <div className="container-fluid">
//             <div className="row">

//               {/* ── Statistics Cards ── */}
//               {statsCards.map(({ count, label, alt }) => (
//                 <div key={label} className="col-12 col-sm-4 stat-card-col">
//                   <div className="my_total_team_data stat-card-inner">
//                     <div className="total_user_card d-flex align-items-center gap-2 gap-md-3 w-100">
//                       <div className="total_user_images stat-card-icon">
//                         <img src="/images/total-member.png" alt={alt} />
//                       </div>
//                       <div className="total_user_card_data stat-card-text">
//                         <h2>{count}</h2>
//                         <h5>{label}</h5>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}

//               {/* ── User Table ── */}
//               <div className="col-12">
//                 <div className="my_total_team_data rounded-3 px-3 py-4">
//                   <div className="d-flex align-items-center justify-content-between mb-3">
//                     <h1 className="mb-0">Mentor Applications Management</h1>
//                     <button
//                       type="button"
//                       className="btn d-flex align-items-center gap-2"
//                       style={{ backgroundColor: "#eb660f", borderColor: "#eb660f", color: "#fff" }}
//                       onClick={() => refetch()}
//                       disabled={isFetching}
//                       title="Refresh"
//                     >
//                       <Icon
//                         icon="mdi:refresh"
//                         width="18"
//                         height="18"
//                         style={{ animation: isFetching ? "spin 1s linear infinite" : "none" }}
//                       />
//                       {isFetching ? "Refreshing..." : "Refresh"}
//                     </button>
//                   </div>

//                   <div className="row justify-content-between">
//                     <div className="col-12 col-sm-6 col-md-2 col-xxl-1">
//                       <div className="pagination__box mb-4">
//                         <div className="showing_data">
//                           <select
//                             className="form-select shadow-none"
//                             aria-label="Default select example"
//                             onChange={(e) =>
//                               setState({ ...state, perPage: e.target.value, currentPage: 1 })
//                             }
//                           >
//                             <option value="10">10</option>
//                             <option value="30">30</option>
//                             <option value="50">50</option>
//                           </select>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="col-12 col-sm-6 col-md-3 col-lg-2">
//                       <div className="select_level_data mb-4">
//                         <div className="input-group search_group">
//                           <span
//                             className="input-group-text border-0 shadow-none bg-transparent rounded-0 pe-0"
//                             id="basic-addon1"
//                           >
//                             <Icon icon="tabler:search" width="16" height="16" style={{ color: "var(--white)" }} />
//                           </span>
//                           <input
//                             type="text"
//                             autoComplete="off"
//                             className="form-control border-0 shadow-none rounded-0 bg-transparent"
//                             placeholder="Search"
//                             onChange={handleSearch}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="table_data table-responsive">
//                     <table className="table mb-0">
//                       <thead>
//                         <tr>
//                           <th scope="col">S.No</th>
//                           <th scope="col">Full Name</th>
//                           <th scope="col">Email</th>
//                           <th scope="col">Phone</th>
//                           <th scope="col">Location</th>
//                           <th scope="col">Current Role</th>
//                           <th scope="col">Company</th>
//                           <th scope="col">Mentor Category</th>
//                           <th scope="col">Status</th>
//                           <th scope="col">Action status</th>
//                           <th scope="col">View Details</th>
//                           <th scope="col">Action</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {isLoading || isFetching ? (
//                           <>
//                             {[...Array(10)].map((e, i) => (
//                               <tr key={i}>
//                                 {[...Array(11)].map((_, j) => (
//                                   <td key={j}><Skeleton /></td>
//                                 ))}
//                               </tr>
//                             ))}
//                           </>
//                         ) : TableData.length === 0 ? (
//                           <tr>
//                             <td colSpan="11" className="text-center">No data found</td>
//                           </tr>
//                         ) : (
//                           TableData.map((data, i) => (
//                             <tr key={data._id}>
//                               <td>{state.currentPage * state.perPage - (state.perPage - 1) + i}.</td>
//                               <td>{data.fullName}</td>
//                               <td>{data.email}</td>
//                               <td>{data.phone}</td>
//                               <td>{data.location}</td>
//                               <td>{data.currentRole}</td>
//                               <td>{data.companyName}</td>
//                               <td>{data.mentorCategory}</td>
//                               <td>
//                                 <span className={data.isActive ? "unblock" : "block"}>
//                                   {data.isActive ? "Active" : "Inactive"}
//                                 </span>
//                               </td>
//                               <td>
//                                 <span className={data.isActive ? "unblock" : "block"}>
//                                   {data.status}
//                                 </span>
//                               </td>
//                               <td>
//                                 <button
//                                   className="bg-transparent border-0"
//                                   style={{ cursor: "pointer" }}
//                                   data-bs-toggle="modal"
//                                   data-bs-target="#detailsModal"
//                                   onClick={() => handleUserView(data)}
//                                 >
//                                   <img src="/images/icons/show.svg" alt="icon" title="View Details" />
//                                 </button>
//                               </td>
//                               <td>
//                                 <button
//                                   className="btn_send rounded px-3 py-1 pb-2"
//                                   onClick={() => handleActionClick(data)}
//                                   title="Approve/Reject"
//                                   data-bs-toggle="modal"
//                                   data-bs-target="#actionModal"
//                                   disabled={data.status === "approved" || data.status === "rejected"}
//                                 >
//                                   <Icon icon="mdi:check-circle" width="18" height="18" style={{ color: "#eb660f" }} />
//                                 </button>
//                               </td>
//                             </tr>
//                           ))
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>

//                 {TableData?.length > 0 && (
//                   <Pagination
//                     currentPage={state.currentPage}
//                     totalPages={Math.ceil(totalMembers / state.perPage) || 1}
//                     onPageChange={handlePageChange}
//                   />
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* ─── View / Edit Details Modal ─────────────────────────────── */}
//           <div
//             className="modal fade common__modal"
//             id="detailsModal"
//             tabIndex="-1"
//             aria-labelledby="detailsModalLabel"
//             aria-hidden="true"
//           >
//             <div className="modal-dialog modal-dialog-centered modal-lg">
//               <div className="modal-content">
//                 <div className="modal-header border-0 pb-0">
//                   <button
//                     type="button"
//                     className="btn-close"
//                     data-bs-dismiss="modal"
//                     aria-label="Close"
//                     onClick={() => setIsEditMode(false)}
//                   />
//                 </div>

//                 <div className="modal-body pt-0 px-4">
//                   <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
//                     <h1 className="modal-title mb-0" id="detailsModalLabel">
//                       Application Details
//                     </h1>
//                     <div className="d-flex gap-2">
//                       {!isEditMode ? (
//                         <button
//                           type="button"
//                           className="edit-toggle-btn"
//                           onClick={() => setIsEditMode(true)}
//                         >
//                           <Icon icon="mdi:pencil" width="14" height="14" style={{ marginRight: 4 }} />
//                           Edit
//                         </button>
//                       ) : (
//                         <>
//                           <button
//                             type="button"
//                             className="cancel-edit-btn"
//                             onClick={() => {
//                               setIsEditMode(false);
//                               if (selectedUserData) handleUserView(selectedUserData);
//                             }}
//                           >
//                             Cancel
//                           </button>
//                           <button
//                             type="button"
//                             className="save-btn"
//                             onClick={handleSaveEdit}
//                             disabled={isSaving}
//                           >
//                             {isSaving ? "Saving..." : "Save Changes"}
//                           </button>
//                         </>
//                       )}
//                     </div>
//                   </div>

//                   {isEditMode && (
//                     <div className="edit-mode-banner">
//                       <Icon icon="mdi:information-outline" width="16" height="16" />
//                       Edit mode is active. Modify fields below and click <strong>&nbsp;Save Changes</strong>.
//                     </div>
//                   )}

//                   {selectedUserData && (
//                     <div className="user-details">
//                       <div className="row">
//                         {renderField("Full Name", "fullName")}
//                         {renderField("Email", "email", "email")}
//                         {renderField("Phone", "phone", "tel")}
//                         {renderField("Date of Birth", "dateOfBirth", "date")}
//                         {renderField("Location", "location")}
//                         {renderField("Current Role", "currentRole")}
//                         {renderField("Company Name", "companyName")}
//                         {renderField("Years of Experience", "yearsOfExperience", "number")}
//                         {renderField("Mentor Category", "mentorCategory")}
//                         {renderField("Mentoring Style", "mentoringStyle")}
//                         {renderField("Mentoring Frequency", "mentoringFrequency")}
//                         {renderField("Hourly Rate (₹)", "hourlyRate", "number")}
//                         {renderField("Languages (comma-separated)", "languages")}
//                         {renderField("LinkedIn URL", "linkedinUrl", "url")}
//                         {renderField("Areas of Interest", "areasOfInterest", "text", true)}
//                         {renderTextarea("Motivation Statement", "motivationStatement")}

//                         <div className="col-md-6 mb-3">
//                           <div className="form__box">
//                             <label>Status</label>
//                             <input
//                               type="text"
//                               autoComplete="off"
//                               className="form-control shadow-none"
//                               value={selectedUserData.isActive ? "Active" : "Inactive"}
//                               readOnly
//                             />
//                           </div>
//                         </div>
//                       </div>

//                       <div className="text-center my-4">
//                         <button
//                           type="button"
//                           className="btn btn-secondary px-3"
//                           data-bs-dismiss="modal"
//                           onClick={() => setIsEditMode(false)}
//                         >
//                           Close
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* ─── Approve / Reject / On Hold Action Modal ───────────────── */}
//           <div
//             className="modal fade common__modal"
//             id="actionModal"
//             tabIndex="-1"
//             aria-labelledby="actionModalLabel"
//             aria-hidden="true"
//           >
//             <div className="modal-dialog modal-dialog-centered">
//               <div className="modal-content">
//                 <div className="modal-header border-0 pb-0">
//                   <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
//                 </div>
//                 <div className="modal-body pt-0 px-4">
//                   <h1 className="modal-title mb-4 text-center" id="actionModalLabel">Application Action</h1>
//                   {selectedUserData && (
//                     <div className="action-content text-center">
//                       <p className="mb-4">
//                         Select an action for <strong>{selectedUserData.fullName}</strong>'s application
//                       </p>
//                       <div className="d-flex gap-3 justify-content-center flex-wrap">
//                         <button
//                           type="button"
//                           className="btn btn-success px-4"
//                           onClick={() => handleApproveReject("approve")}
//                           disabled={isUpdating}
//                           data-bs-dismiss="modal"
//                         >
//                           {isUpdating ? "Processing..." : "Approve"}
//                         </button>
//                         <button
//                           type="button"
//                           className="btn btn-warning px-4"
//                           onClick={() => handleApproveReject("onhold")}
//                           disabled={isUpdating}
//                           data-bs-dismiss="modal"
//                         >
//                           {isUpdating ? "Processing..." : "On Hold"}
//                         </button>
//                         <button
//                           type="button"
//                           className="btn btn-danger px-4"
//                           onClick={() => handleApproveReject("reject")}
//                           disabled={isUpdating}
//                           data-bs-dismiss="modal"
//                         >
//                           {isUpdating ? "Processing..." : "Reject"}
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//         </section>
//       </DashboardLayout>
//     </>
//   );
// };

// export default UserManagement;





import React, { useState, useEffect, useContext } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Pagination from "../../components/Pagination";
import DashboardLayout from "../../Layout/DashboardLayout";
import {
  useGetUserQuery,
  useApproveRejectApplicationMutation,
  useUpdateMentorMutation,
} from "./userApiSlice";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import { StateContext } from "../../context/StateContext";

const MENTOR_CATEGORIES = [
  "Engineering Mentors",
  "Startup Mentors",
  "Product Mentors",
  "Marketing Mentors",
  "Leadership Mentors",
  "Career Mentors",
  "AI Mentors",
];

const UserManagement = () => {
  const { amount, setAmount, transaction_type, setTransactionType } =
    useContext(StateContext);

  const [refresh, setRefresh] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [check1, setCheck1] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(""); // ← new

  // Pagination state
  const [state, setState] = useState({
    currentPage: 1,
    perPage: 10,
    search: "",
  });

  const queryParams = `limit=${state.perPage}&page=${state.currentPage}&search=${state.search}`;

  const { data: getUser, isLoading, isFetching, refetch } = useGetUserQuery(queryParams);
  const [approveRejectApplication, { isLoading: isUpdating }] =
    useApproveRejectApplicationMutation();
  const [updateMentor, { isLoading: isSaving }] = useUpdateMentorMutation();

  const TableData = getUser?.data?.data || [];
  const totalMembers = TableData.length || 0;
  const blockedUser = TableData.filter((user) => user.isBlock).length || 0;
  const activeMembers = TableData.filter((user) => user.isActive).length || 0;

  const statsCards = [
    { count: totalMembers, label: "Total Applications", alt: "total-applications" },
    { count: blockedUser, label: "Total Blocked", alt: "total-blocked" },
    { count: activeMembers, label: "Total Active", alt: "total-active" },
  ];

  // Handle page change
  const handlePageChange = (e) => {
    setState({ ...state, currentPage: e });
  };

  // Handle search with debounce
  let searchTimeout;
  const handleSearch = (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      setState({ ...state, search: e.target.value, currentPage: 1 });
    }, 1000);
  };

  useEffect(() => {
    refetch();
    return () => {
      clearTimeout(searchTimeout);
    };
  }, []);

  // Handle user view — seed edit form with current data
  const handleUserView = (user) => {
    setSelectedUserId(user._id);
    setSelectedUserData(user);
    setEditFormData({
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : "",
      location: user.location || "",
      currentRole: user.currentRole || "",
      companyName: user.companyName || "",
      yearsOfExperience: user.yearsOfExperience || "",
      mentorCategory: user.mentorCategory || "",
      mentoringStyle: user.mentoringStyle || "",
      mentoringFrequency: user.mentoringFrequency || "",
      hourlyRate: user.hourlyRate || "",
      languages: user.languages?.join(", ") || "",
      linkedinUrl: user.linkedinUrl || "",
      areasOfInterest: user.areasOfInterest || "",
      motivationStatement: user.motivationStatement || "",
    });
    setIsEditMode(false);
  };

  // Handle edit form field changes
  const handleEditChange = (field, value) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Save updated mentor data
  const handleSaveEdit = async () => {
    try {
      const payload = {
        ...editFormData,
        languages: editFormData.languages
          ? editFormData.languages.split(",").map((l) => l.trim()).filter(Boolean)
          : [],
      };

      await updateMentor({ id: selectedUserId, data: payload }).unwrap();

      toast.success("Mentor details updated successfully", {
        position: "top-center",
        autoClose: 4000,
      });

      setIsEditMode(false);
      refetch();
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(error?.data?.message || "Failed to update mentor details", {
        position: "top-center",
      });
    }
  };

  // Handle action button click — reset category on each open
  const handleActionClick = (user) => {
    setSelectedUserId(user._id);
    setSelectedUserData(user);
    setSelectedCategory(""); // reset every time
    setShowActionModal(true);
  };

  const handleApproveReject = async (action) => {
    try {
      await approveRejectApplication({
        id: selectedUserId,
        action,
        mentorCategory: selectedCategory, // pass selected category to API
      }).unwrap();

      const actionText =
        action === "approve"
          ? "approved"
          : action === "reject"
            ? "rejected"
            : "put on hold";

      toast.success(
        action === "approve"
          ? "Application approved! Password reset email sent to mentor."
          : `Application ${actionText} successfully`,
        { position: "top-center", autoClose: 5000 }
      );

      setShowActionModal(false);
      setSelectedUserId(null);
      setSelectedUserData(null);
      setSelectedCategory(""); // reset after action
      refetch();
    } catch (error) {
      console.error("Action failed:", error);
      toast.error(error?.data?.message || `Failed to ${action} application`, {
        position: "top-center",
      });
    }
  };

  // Handle check for transaction
  const handleCheck = (userId) => {
    setSelectedUserId(userId);
    setCheck1(true);
  };

  // Handle transaction submission
  const handleTransactionSubmit = async (e, transactionType, amount) => {
    e.preventDefault();

    if (!amount || amount === "") {
      toast.error("Enter amount");
      setAmount("");
      return;
    }
    if (amount < 1) {
      toast.error("Amount must be greater than 1");
      setAmount("");
      return;
    }
    if (!/^[0-9]+(\.[0-9]+)?$/.test(amount)) {
      toast.error("Enter only valid numbers");
      setAmount("");
      return;
    }

    try {
      toast.success("Transaction sent successfully", { position: "top-center" });
      setAmount("");
      setTransactionType("referral_amount");
      setCheck1(false);
      setRefresh(true);
    } catch (error) {
      console.error("Transaction failed:", error);
      toast.error(error?.data?.message || "Transaction failed");
      setAmount("");
    }
  };

  // Format date with AM/PM
  const formatDateWithAmPm = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const amPm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${day}-${month}-${year} ${hours}:${minutes} ${amPm}`;
  };

  useEffect(() => {
    if (refresh) {
      refetch();
      setRefresh(false);
    }
  }, [refresh, refetch]);

  // Reusable editable field renderer
  const renderField = (label, field, type = "text", fullWidth = false) => (
    <div className={`${fullWidth ? "col-md-12" : "col-md-6"} mb-3`} key={field}>
      <div className="form__box">
        <label>{label}</label>
        <input
          type={type}
          autoComplete="off"
          className={`form-control shadow-none${isEditMode ? " edit-active" : ""}`}
          value={editFormData[field] ?? ""}
          readOnly={!isEditMode}
          onChange={(e) => handleEditChange(field, e.target.value)}
          style={
            isEditMode
              ? { borderColor: "#eb660f", background: "rgba(235,102,15,0.06)" }
              : {}
          }
        />
      </div>
    </div>
  );

  const renderTextarea = (label, field) => (
    <div className="col-md-12 mb-3" key={field}>
      <div className="form__box">
        <label>{label}</label>
        <textarea
          className={`form-control shadow-none${isEditMode ? " edit-active" : ""}`}
          rows="3"
          value={editFormData[field] ?? ""}
          readOnly={!isEditMode}
          onChange={(e) => handleEditChange(field, e.target.value)}
          style={
            isEditMode
              ? { borderColor: "#eb660f", background: "rgba(235,102,15,0.06)" }
              : {}
          }
        />
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .edit-active { transition: border-color 0.2s, background 0.2s; }

        .edit-toggle-btn {
          border: 1.5px solid #eb660f; color: #eb660f; background: transparent;
          border-radius: 6px; padding: 5px 16px; font-size: 14px; cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .edit-toggle-btn:hover { background: #eb660f; color: #fff; }
        .edit-toggle-btn.active { background: #eb660f; color: #fff; }

        .save-btn {
          background: #eb660f; border: none; color: #fff;
          border-radius: 6px; padding: 5px 20px; font-size: 14px; cursor: pointer;
        }
        .save-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        .cancel-edit-btn {
          background: transparent; border: 1.5px solid #6c757d; color: #6c757d;
          border-radius: 6px; padding: 5px 16px; font-size: 14px; cursor: pointer;
        }
        .cancel-edit-btn:hover { background: #6c757d; color: #fff; }

        .edit-mode-banner {
          background: rgba(235,102,15,0.10); border-left: 3px solid #eb660f;
          border-radius: 4px; padding: 7px 14px; font-size: 13px; color: #eb660f;
          margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
        }

        /* Equal-height stat cards */
        .stat-card-col { display: flex; margin-bottom: 1.5rem; }
        .stat-card-inner { display: flex; align-items: center; width: 100%; border-radius: 0.5rem; padding: 1rem 1.25rem; }
        @media (min-width: 768px) { .stat-card-inner { padding: 1.25rem 1.5rem; } }
        .stat-card-icon { flex-shrink: 0; border-radius: 0.5rem; padding: 0.6rem; display: flex; align-items: center; justify-content: center; }
        @media (min-width: 768px) { .stat-card-icon { padding: 0.85rem; } }
        .stat-card-icon img { width: 40px; height: 40px; object-fit: contain; display: block; }
        .stat-card-text h2 { margin-bottom: 0.1rem; line-height: 1.2; }
        .stat-card-text h5 { margin-bottom: 0; }

        /* Category dropdown hint */
        .category-hint { font-size: 12px; color: #aaa; margin-top: 5px; }

        /* Action buttons disabled state visual */
        .action-btn-group .btn:disabled { opacity: 0.45; cursor: not-allowed; }
      `}</style>

      <DashboardLayout>
        <section className="profile_section user__management py-4">
          <div className="container-fluid">
            <div className="row">

              {/* ── Statistics Cards ── */}
              {statsCards.map(({ count, label, alt }) => (
                <div key={label} className="col-12 col-sm-4 stat-card-col">
                  <div className="my_total_team_data stat-card-inner">
                    <div className="total_user_card d-flex align-items-center gap-2 gap-md-3 w-100">
                      <div className="total_user_images stat-card-icon">
                        <img src="/images/total-member.png" alt={alt} />
                      </div>
                      <div className="total_user_card_data stat-card-text">
                        <h2>{count}</h2>
                        <h5>{label}</h5>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* ── User Table ── */}
              <div className="col-12">
                <div className="my_total_team_data rounded-3 px-3 py-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h1 className="mb-0">Mentor Applications Management</h1>
                    <button
                      type="button"
                      className="btn d-flex align-items-center gap-2"
                      style={{ backgroundColor: "#eb660f", borderColor: "#eb660f", color: "#fff" }}
                      onClick={() => refetch()}
                      disabled={isFetching}
                      title="Refresh"
                    >
                      <Icon
                        icon="mdi:refresh"
                        width="18"
                        height="18"
                        style={{ animation: isFetching ? "spin 1s linear infinite" : "none" }}
                      />
                      {isFetching ? "Refreshing..." : "Refresh"}
                    </button>
                  </div>

                  <div className="row justify-content-between">
                    <div className="col-12 col-sm-6 col-md-2 col-xxl-1">
                      <div className="pagination__box mb-4">
                        <div className="showing_data">
                          <select
                            className="form-select shadow-none"
                            aria-label="Default select example"
                            onChange={(e) =>
                              setState({ ...state, perPage: e.target.value, currentPage: 1 })
                            }
                          >
                            <option value="10">10</option>
                            <option value="30">30</option>
                            <option value="50">50</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-sm-6 col-md-3 col-lg-2">
                      <div className="select_level_data mb-4">
                        <div className="input-group search_group">
                          <span
                            className="input-group-text border-0 shadow-none bg-transparent rounded-0 pe-0"
                            id="basic-addon1"
                          >
                            <Icon
                              icon="tabler:search"
                              width="16"
                              height="16"
                              style={{ color: "var(--white)" }}
                            />
                          </span>
                          <input
                            type="text"
                            autoComplete="off"
                            className="form-control border-0 shadow-none rounded-0 bg-transparent"
                            placeholder="Search"
                            onChange={handleSearch}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="table_data table-responsive">
                    <table className="table mb-0">
                      <thead>
                        <tr>
                          <th scope="col">S.No</th>
                          <th scope="col">Full Name</th>
                          <th scope="col">Email</th>
                          <th scope="col">Phone</th>
                          <th scope="col">Location</th>
                          <th scope="col">Current Role</th>
                          <th scope="col">Company</th>
                          <th scope="col">Mentor Category</th>
                          <th scope="col">Status</th>
                          <th scope="col">Action status</th>
                          <th scope="col">View Details</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading || isFetching ? (
                          <>
                            {[...Array(10)].map((_, i) => (
                              <tr key={i}>
                                {[...Array(12)].map((_, j) => (
                                  <td key={j}><Skeleton /></td>
                                ))}
                              </tr>
                            ))}
                          </>
                        ) : TableData.length === 0 ? (
                          <tr>
                            <td colSpan="12" className="text-center">No data found</td>
                          </tr>
                        ) : (
                          TableData.map((data, i) => (
                            <tr key={data._id}>
                              <td>
                                {state.currentPage * state.perPage - (state.perPage - 1) + i}.
                              </td>
                              <td>{data.fullName}</td>
                              <td>{data.email}</td>
                              <td>{data.phone}</td>
                              <td>{data.location}</td>
                              <td>{data.currentRole}</td>
                              <td>{data.companyName}</td>
                              <td>{data.mentorCategory}</td>
                              <td>
                                <span className={data.isActive ? "unblock" : "block"}>
                                  {data.isActive ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td>
                                <span className={data.isActive ? "unblock" : "block"}>
                                  {data.status}
                                </span>
                              </td>
                              <td>
                                <button
                                  className="bg-transparent border-0"
                                  style={{ cursor: "pointer" }}
                                  data-bs-toggle="modal"
                                  data-bs-target="#detailsModal"
                                  onClick={() => handleUserView(data)}
                                >
                                  <img src="/images/icons/show.svg" alt="icon" title="View Details" />
                                </button>
                              </td>
                              <td>
                                <button
                                  className="btn_send rounded px-3 py-1 pb-2"
                                  onClick={() => handleActionClick(data)}
                                  title="Approve/Reject"
                                  data-bs-toggle="modal"
                                  data-bs-target="#actionModal"
                                  disabled={
                                    data.status === "approved" || data.status === "rejected"
                                  }
                                >
                                  <Icon
                                    icon="mdi:check-circle"
                                    width="18"
                                    height="18"
                                    style={{ color: "#eb660f" }}
                                  />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {TableData?.length > 0 && (
                  <Pagination
                    currentPage={state.currentPage}
                    totalPages={Math.ceil(totalMembers / state.perPage) || 1}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>
            </div>
          </div>

          {/* ─── View / Edit Details Modal ─────────────────────────────── */}
          <div
            className="modal fade common__modal"
            id="detailsModal"
            tabIndex="-1"
            aria-labelledby="detailsModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header border-0 pb-0">
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => setIsEditMode(false)}
                  />
                </div>

                <div className="modal-body pt-0 px-4">
                  <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
                    <h1 className="modal-title mb-0" id="detailsModalLabel">
                      Application Details
                    </h1>
                    <div className="d-flex gap-2">
                      {!isEditMode ? (
                        <button
                          type="button"
                          className="edit-toggle-btn"
                          onClick={() => setIsEditMode(true)}
                        >
                          <Icon
                            icon="mdi:pencil"
                            width="14"
                            height="14"
                            style={{ marginRight: 4 }}
                          />
                          Edit
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="cancel-edit-btn"
                            onClick={() => {
                              setIsEditMode(false);
                              if (selectedUserData) handleUserView(selectedUserData);
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="save-btn"
                            onClick={handleSaveEdit}
                            disabled={isSaving}
                          >
                            {isSaving ? "Saving..." : "Save Changes"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {isEditMode && (
                    <div className="edit-mode-banner">
                      <Icon icon="mdi:information-outline" width="16" height="16" />
                      Edit mode is active. Modify fields below and click{" "}
                      <strong>&nbsp;Save Changes</strong>.
                    </div>
                  )}

                  {selectedUserData && (
                    <div className="user-details">
                      <div className="row">
                        {renderField("Full Name", "fullName")}
                        {renderField("Email", "email", "email")}
                        {renderField("Phone", "phone", "tel")}
                        {renderField("Date of Birth", "dateOfBirth", "date")}
                        {renderField("Location", "location")}
                        {renderField("Current Role", "currentRole")}
                        {renderField("Company Name", "companyName")}
                        {renderField("Years of Experience", "yearsOfExperience", "number")}
                        {renderField("Mentor Category", "mentorCategory")}
                        {renderField("Mentoring Style", "mentoringStyle")}
                        {renderField("Mentoring Frequency", "mentoringFrequency")}
                        {renderField("Hourly Rate (₹)", "hourlyRate", "number")}
                        {renderField("Languages (comma-separated)", "languages")}
                        {renderField("LinkedIn URL", "linkedinUrl", "url")}
                        {renderField("Areas of Interest", "areasOfInterest", "text", true)}
                        {renderTextarea("Motivation Statement", "motivationStatement")}

                        {/* Status — always read-only */}
                        <div className="col-md-6 mb-3">
                          <div className="form__box">
                            <label>Status</label>
                            <input
                              type="text"
                              autoComplete="off"
                              className="form-control shadow-none"
                              value={selectedUserData.isActive ? "Active" : "Inactive"}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="text-center my-4">
                        <button
                          type="button"
                          className="btn btn-secondary px-3"
                          data-bs-dismiss="modal"
                          onClick={() => setIsEditMode(false)}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ─── Approve / Reject / On Hold Action Modal ───────────────── */}
          <div
            className="modal fade common__modal"
            id="actionModal"
            tabIndex="-1"
            aria-labelledby="actionModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header border-0 pb-0">
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => setSelectedCategory("")}
                  />
                </div>
                <div className="modal-body pt-0 px-4 pb-4">
                  <h1 className="modal-title mb-4 text-center" id="actionModalLabel">
                    Application Action
                  </h1>

                  {selectedUserData && (
                    <div className="action-content">
                      <p className="mb-4 text-center">
                        Select an action for{" "}
                        <strong>{selectedUserData.fullName}</strong>'s application
                      </p>

                      {/* ── Mentor Category Dropdown ── */}
                      <div className="mb-4">
                        <label
                          className="form-label fw-semibold"
                          style={{ fontSize: 14, color: "#ffffff" }}
                        >
                          Mentor Category{" "}
                          <span style={{ color: "#ffffff" }}>*</span>
                        </label>
                        <select
                          className="form-select shadow-none"
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          style={
                            selectedCategory
                              ? {
                                // borderColor: "#eb660f",
                                // background: "rgba(235,102,15,0.06)",
                              }
                              : {}
                          }
                        >
                          <option value="">— Select a category —</option>
                          {MENTOR_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                        {!selectedCategory && (
                          <div className="category-hint">
                            <Icon
                              icon="mdi:information-outline"
                              width="13"
                              height="13"
                              style={{ marginRight: 4, color: "#ffffff", verticalAlign: "middle" }}
                            />
                            Please select a category to enable the action buttons.
                          </div>
                        )}
                      </div>

                      {/* ── Action Buttons ── */}
                      <div className="action-btn-group d-flex gap-3 justify-content-center flex-wrap">
                        <button
                          type="button"
                          className="btn btn-success px-4"
                          onClick={() => handleApproveReject("approve")}
                          disabled={isUpdating || !selectedCategory}
                          data-bs-dismiss="modal"
                          title={!selectedCategory ? "Select a category first" : "Approve"}
                        >
                          {isUpdating ? "Processing..." : "Approve"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-warning px-4"
                          onClick={() => handleApproveReject("onhold")}
                          disabled={isUpdating || !selectedCategory}
                          data-bs-dismiss="modal"
                          title={!selectedCategory ? "Select a category first" : "On Hold"}
                        >
                          {isUpdating ? "Processing..." : "On Hold"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger px-4"
                          onClick={() => handleApproveReject("reject")}
                          disabled={isUpdating || !selectedCategory}
                          data-bs-dismiss="modal"
                          title={!selectedCategory ? "Select a category first" : "Reject"}
                        >
                          {isUpdating ? "Processing..." : "Reject"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </section>
      </DashboardLayout>
    </>
  );
};

export default UserManagement;