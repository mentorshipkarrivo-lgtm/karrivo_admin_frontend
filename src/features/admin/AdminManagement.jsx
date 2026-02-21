// // SessionBookingManagement.jsx
// import React, { useState, useEffect } from "react";
// import DashboardLayout from "../../Layout/DashboardLayout";
// import { Icon } from "@iconify/react/dist/iconify.js";
// import Pagination from "../../components/Pagination";
// import Skeleton from "react-loading-skeleton";
// import {
//   useGetSessionBookingsQuery,
//   useViewSessionBookingQuery,
//   useUpdateSessionBookingMutation,
//   useUpdateSessionStatusMutation,
//   useUpdatePaymentStatusMutation,
//   useDeleteSessionBookingMutation,
// } from "./adminApiSlice"
// import { toast } from "react-toastify";

// const SessionBookingManagement = () => {
//   const [currentEditData, setCurrentEditData] = useState(null);
//   const [errors, setErrors] = useState({});

//   // State for pagination
//   const [state, setState] = useState({
//     currentPage: 1,
//     perPage: 10,
//     search: "",
//     selectedBookingId: null,
//   });

//   // Build query params
//   const queryParams = `limit=${state.perPage}&page=${state.currentPage}&search=${state.search}`;

//   // Fetch session bookings
//   const {
//     data: sessionBookingsResponse,
//     isLoading,
//     isError,
//     error,
//     refetch
//   } = useGetSessionBookingsQuery(queryParams);

//   console.log("Session Bookings Response:", sessionBookingsResponse);
//   // Fetch single booking for view modal
//   const {
//     data: viewBookingResponse,
//     isLoading: isBookingLoading,
//   } = useViewSessionBookingQuery(state.selectedBookingId, {
//     skip: !state.selectedBookingId,
//   });

//   // Mutations
//   const [updateSessionBooking] = useUpdateSessionBookingMutation();
//   const [updateSessionStatus] = useUpdateSessionStatusMutation();
//   const [updatePaymentStatus] = useUpdatePaymentStatusMutation();
//   const [deleteSessionBooking] = useDeleteSessionBookingMutation();

//   // Extract data from response
//   const TableData = sessionBookingsResponse?.data || [];
//   const paginationData = sessionBookingsResponse?.pagination || {};
//   const viewBookingData = viewBookingResponse?.data || null;

//   console.log("📊 Session Bookings Response:", sessionBookingsResponse);
//   console.log("📋 Table Data:", TableData);
//   console.log("📄 Pagination:", paginationData);

//   // Calculate statistics
//   const totalBookings = TableData.length || 0;
//   const confirmedBookings = TableData.filter(b => b.status === "confirmed").length || 0;
//   const completedBookings = TableData.filter(b => b.status === "completed").length || 0;
//   const pendingBookings = TableData.filter(b => b.status === "pending").length || 0;

//   // Handle page change
//   const handlePageChange = (page) => {
//     setState({ ...state, currentPage: page });
//   };

//   // Handle search with debounce
//   let searchTimeout;
//   const handleSearch = (e) => {
//     clearTimeout(searchTimeout);
//     searchTimeout = setTimeout(() => {
//       setState({ ...state, search: e.target.value, currentPage: 1 });
//     }, 500);
//   };

//   useEffect(() => {
//     return () => {
//       clearTimeout(searchTimeout);
//     };
//   }, []);

//   // Validation
//   const validate = () => {
//     let formErrors = {};

//     if (!currentEditData?.topic?.trim()) {
//       formErrors.topic = "Topic is required";
//     }

//     if (!currentEditData?.sessionDate) {
//       formErrors.sessionDate = "Session date is required";
//     }

//     if (!currentEditData?.startTime?.trim()) {
//       formErrors.startTime = "Start time is required";
//     }

//     if (!currentEditData?.durationMinutes) {
//       formErrors.durationMinutes = "Duration is required";
//     } else if (currentEditData.durationMinutes < 15) {
//       formErrors.durationMinutes = "Duration cannot be less than 15 minutes";
//     }

//     if (currentEditData?.price === undefined || currentEditData?.price === null || currentEditData?.price === "") {
//       formErrors.price = "Price is required";
//     } else if (currentEditData.price < 0) {
//       formErrors.price = "Price cannot be negative";
//     }

//     setErrors(formErrors);
//     return Object.keys(formErrors).length === 0;
//   };

//   // Open edit modal
//   const openModal = (data) => {
//     setCurrentEditData({
//       ...data,
//       sessionDate: data.sessionDate ? new Date(data.sessionDate).toISOString().split('T')[0] : '',
//     });
//     setErrors({});
//     const modal = new window.bootstrap.Modal(document.getElementById("editModal"));
//     modal.show();
//   };

//   // Open view modal
//   const openViewModal = (data) => {
//     setState({ ...state, selectedBookingId: data._id });
//     const modal = new window.bootstrap.Modal(document.getElementById("viewModal"));
//     modal.show();
//   };

//   // Handle edit change
//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setCurrentEditData({ ...currentEditData, [name]: value });
//     if (errors[name]) {
//       setErrors({ ...errors, [name]: null });
//     }
//   };

//   // Handle update
//   const handleUpdateBooking = async () => {
//     if (!validate()) return;

//     try {
//       const { _id, __v, createdAt, userId, mentorId, menteeId, zoomMeeting, ...updateData } = currentEditData;

//       await updateSessionBooking({
//         bookingId: _id,
//         ...updateData
//       }).unwrap();

//       toast.success("Session booking updated successfully", {
//         position: "top-center",
//       });
//       document.getElementById("closeEditModal").click();
//       refetch();
//     } catch (error) {
//       console.error(error);
//       toast.error(error?.data?.message || "Failed to update session booking", {
//         position: "top-center",
//       });
//     }
//   };

//   // Handle status change
//   const handleStatusChange = async (bookingId, newStatus) => {
//     try {
//       await updateSessionStatus({ bookingId, status: newStatus }).unwrap();
//       toast.success(`Status updated to ${newStatus}`, {
//         position: "top-center",
//       });
//       refetch();
//     } catch (error) {
//       toast.error(error?.data?.message || "Failed to update status", {
//         position: "top-center",
//       });
//     }
//   };

//   // Handle payment status change
//   const handlePaymentStatusChange = async (bookingId, newPaymentStatus) => {
//     try {
//       await updatePaymentStatus({ bookingId, paymentStatus: newPaymentStatus }).unwrap();
//       toast.success(`Payment status updated to ${newPaymentStatus}`, {
//         position: "top-center",
//       });
//       refetch();
//     } catch (error) {
//       toast.error(error?.data?.message || "Failed to update payment status", {
//         position: "top-center",
//       });
//     }
//   };

//   // Handle delete
//   const handleDeleteBooking = async (bookingId) => {
//     if (!window.confirm("Are you sure you want to delete this booking?")) return;

//     try {
//       await deleteSessionBooking(bookingId).unwrap();
//       toast.success("Session booking deleted successfully", {
//         position: "top-center",
//       });
//       refetch();
//     } catch (error) {
//       toast.error(error?.data?.message || "Failed to delete booking", {
//         position: "top-center",
//       });
//     }
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   // Format date with time
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

//   // Format currency
//   const formatCurrency = (amount, currency) => {
//     if (amount === 0) return "Free";
//     if (!amount) return "N/A";
//     return `${currency === "INR" ? "₹" : "$"}${amount}`;
//   };

//   // Get status badge
//   const getStatusBadge = (status) => {
//     const badges = {
//       pending: "badge bg-warning text-dark",
//       confirmed: "badge bg-info text-dark",
//       completed: "badge bg-success",
//       cancelled: "badge bg-danger",
//       rescheduled: "badge bg-secondary"
//     };
//     return badges[status] || "badge bg-secondary";
//   };

//   // Get payment badge
//   const getPaymentBadge = (paymentStatus) => {
//     const badges = {
//       unpaid: "badge bg-warning text-dark",
//       paid: "badge bg-success",
//       refunded: "badge bg-info text-dark",
//       failed: "badge bg-danger"
//     };
//     return badges[paymentStatus] || "badge bg-secondary";
//   };

//   return (
//     <DashboardLayout>
//       <section className="profile_section user__management py-4">
//         <div className="container-fluid">
//           <div className="row">
//             {/* Statistics Cards */}
//             <div className="col-12 col-sm-6 col-md-6 col-xl-3">
//               <div className="my_total_team_data mb-4 rounded-3 px-3 py-3 py-md-4">
//                 <div className="total_user_card d-flex align-items-center gap-2 gap-md-3">
//                   <div className="total_user_images rounded-3 p-2 p-md-4">
//                     <img
//                       src="/images/total-member.png"
//                       alt="total-bookings"
//                       className="img-fluid"
//                     />
//                   </div>
//                   <div className="total_user_card_data">
//                     <h2>{totalBookings}</h2>
//                     <h5>Total Bookings</h5>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="col-12 col-sm-6 col-md-6 col-xl-3">
//               <div className="my_total_team_data mb-4 rounded-3 px-3 py-3 py-md-4">
//                 <div className="total_user_card d-flex align-items-center gap-2 gap-md-3">
//                   <div className="total_user_images rounded-3 p-2 p-md-4">
//                     <img
//                       src="/images/total-member.png"
//                       alt="confirmed-bookings"
//                       className="img-fluid"
//                     />
//                   </div>
//                   <div className="total_user_card_data">
//                     <h2>{confirmedBookings}</h2>
//                     <h5>Confirmed</h5>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="col-12 col-sm-6 col-md-6 col-xl-3">
//               <div className="my_total_team_data mb-4 rounded-3 px-3 py-3 py-md-4">
//                 <div className="total_user_card d-flex align-items-center gap-2 gap-md-3">
//                   <div className="total_user_images rounded-3 p-2 p-md-4">
//                     <img
//                       src="/images/total-member.png"
//                       alt="completed-bookings"
//                       className="img-fluid"
//                     />
//                   </div>
//                   <div className="total_user_card_data">
//                     <h2>{completedBookings}</h2>
//                     <h5>Completed</h5>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="col-12 col-sm-6 col-md-6 col-xl-3">
//               <div className="my_total_team_data mb-4 rounded-3 px-3 py-3 py-md-4">
//                 <div className="total_user_card d-flex align-items-center gap-2 gap-md-3">
//                   <div className="total_user_images rounded-3 p-2 p-md-4">
//                     <img
//                       src="/images/total-member.png"
//                       alt="pending-bookings"
//                       className="img-fluid"
//                     />
//                   </div>
//                   <div className="total_user_card_data">
//                     <h2>{pendingBookings}</h2>
//                     <h5>Pending</h5>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Bookings Table */}
//             <div className="col-12">
//               <div className="my_total_team_data rounded-3 px-3 py-4">
//                 <h1 className="mb-3">Session Booking Management</h1>

//                 <div className="row justify-content-between">
//                   {/* Items per page selector */}
//                   <div className="col-12 col-sm-6 col-md-2 col-xxl-1">
//                     <div className="pagination__box mb-4">
//                       <div className="showing_data">
//                         <select
//                           className="form-select shadow-none"
//                           value={state.perPage}
//                           onChange={(e) => setState({ ...state, perPage: e.target.value, currentPage: 1 })}
//                         >
//                           <option value="10">10</option>
//                           <option value="30">30</option>
//                           <option value="50">50</option>
//                         </select>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Search input */}
//                   <div className="col-12 col-sm-6 col-md-3 col-lg-2">
//                     <div className="select_level_data mb-4">
//                       <div className="input-group search_group">
//                         <span
//                           className="input-group-text border-0 shadow-none bg-transparent rounded-0 pe-0"
//                           id="basic-addon1"
//                         >
//                           <Icon
//                             icon="tabler:search"
//                             width="16"
//                             height="16"
//                             style={{ color: "var(--white)" }}
//                           />
//                         </span>
//                         <input
//                           type="text"
//                           autoComplete="off"
//                           className="form-control border-0 shadow-none rounded-0 bg-transparent"
//                           placeholder="Search by mentee, topic..."
//                           onChange={handleSearch}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Table */}
//                 <div className="table_data table-responsive">
//                   <table className="table mb-0">
//                     <thead>
//                       <tr>
//                         <th scope="col">S.No</th>
//                         <th scope="col">Mentee Name</th>
//                         <th scope="col">Topic</th>
//                         <th scope="col">Session Date</th>
//                         <th scope="col">Time</th>
//                         <th scope="col">Duration</th>
//                         <th scope="col">Price</th>
//                         <th scope="col">Status</th>
//                         <th scope="col">Payment</th>
//                         <th scope="col">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {isLoading ? (
//                         Array(5).fill(0).map((_, i) => (
//                           <tr key={i}>
//                             {Array(10).fill(0).map((_, j) => (
//                               <td key={j}><Skeleton /></td>
//                             ))}
//                           </tr>
//                         ))
//                       ) : isError ? (
//                         <tr>
//                           <td colSpan="10" className="text-center text-danger">
//                             Error: {error?.data?.message || "Failed to load bookings"}
//                           </td>
//                         </tr>
//                       ) : TableData.length === 0 ? (
//                         <tr>
//                           <td colSpan="10" className="text-center">
//                             No bookings found
//                           </td>
//                         </tr>
//                       ) : (
//                         TableData.map((booking, i) => (
//                           <tr key={booking._id}>
//                             <td>{(state.currentPage - 1) * state.perPage + i + 1}</td>
//                             <td>{booking.menteeName || "N/A"}</td>
//                             <td>{booking.topic || "N/A"}</td>
//                             <td>
//                               <small>{formatDate(booking.sessionDate)}</small>
//                             </td>
//                             <td>{booking.startTime || "N/A"}</td>
//                             <td>{booking.durationMinutes} min</td>
//                             <td>{formatCurrency(booking.price, booking.currency)}</td>
//                             <td>
//                               <select
//                                 className={getStatusBadge(booking.status)}
//                                 value={booking.status}
//                                 onChange={(e) => handleStatusChange(booking._id, e.target.value)}
//                                 style={{ cursor: "pointer", border: "none", padding: "4px 8px" }}
//                               >
//                                 <option value="pending">Pending</option>
//                                 <option value="confirmed">Confirmed</option>
//                                 <option value="completed">Completed</option>
//                                 <option value="cancelled">Cancelled</option>
//                                 <option value="rescheduled">Rescheduled</option>
//                               </select>
//                             </td>
//                             <td>
//                               <select
//                                 className={getPaymentBadge(booking.paymentStatus)}
//                                 value={booking.paymentStatus}
//                                 onChange={(e) => handlePaymentStatusChange(booking._id, e.target.value)}
//                                 style={{ cursor: "pointer", border: "none", padding: "4px 8px" }}
//                               >
//                                 <option value="unpaid">Unpaid</option>
//                                 <option value="paid">Paid</option>
//                                 <option value="refunded">Refunded</option>
//                                 <option value="failed">Failed</option>
//                               </select>
//                             </td>
//                             <td>
//                               <div className="d-flex gap-2">
//                                 {/* View Details */}
//                                 <button
//                                   className="btn btn-sm btn-info"
//                                   title="View Details"
//                                   onClick={() => openViewModal(booking)}
//                                 >
//                                   <Icon icon="mdi:eye" width="16" height="16" />
//                                 </button>

//                                 {/* Edit */}
//                                 <button
//                                   className="btn btn-sm btn-warning"
//                                   title="Edit"
//                                   onClick={() => openModal(booking)}
//                                 >
//                                   <Icon icon="mdi:pencil" width="16" height="16" />
//                                 </button>

//                                 {/* Delete */}
//                                 <button
//                                   className="btn btn-sm btn-danger"
//                                   title="Delete"
//                                   onClick={() => handleDeleteBooking(booking._id)}
//                                 >
//                                   <Icon icon="mdi:delete" width="16" height="16" />
//                                 </button>
//                               </div>
//                             </td>
//                           </tr>
//                         ))
//                       )}
//                     </tbody>
//                   </table>
//                 </div>

//                 {/* Pagination */}
//                 {TableData.length > 0 && paginationData.totalPages > 1 && (
//                   <Pagination
//                     currentPage={state.currentPage}
//                     totalPages={paginationData.totalPages}
//                     onPageChange={handlePageChange}
//                   />
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* View Modal */}
//       <div
//         className="modal fade common__modal"
//         id="viewModal"
//         tabIndex="-1"
//         aria-labelledby="viewModalLabel"
//         aria-hidden="true"
//       >
//         <div className="modal-dialog modal-dialog-centered modal-xl">
//           <div className="modal-content">
//             <div className="modal-header border-0 pb-0">
//               <h1 className="modal-title" id="viewModalLabel">
//                 <Icon
//                   icon="mdi:calendar-check"
//                   width="28"
//                   height="28"
//                   className="me-2"
//                 />
//                 Session Booking Details
//               </h1>
//               <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
//             </div>
//             <div className="modal-body pt-0 px-4">
//               {isBookingLoading ? (
//                 <Skeleton count={10} />
//               ) : viewBookingData ? (
//                 <>
//                   {/* Header Section */}
//                   <div className="text-center mb-4 pb-4 border-bottom">
//                     <h3>{viewBookingData.topic || "N/A"}</h3>
//                     <div className="d-flex gap-2 justify-content-center flex-wrap mt-2">
//                       <span className={getStatusBadge(viewBookingData.status)}>
//                         {viewBookingData.status}
//                       </span>
//                       <span className={getPaymentBadge(viewBookingData.paymentStatus)}>
//                         {viewBookingData.paymentStatus}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="row">
//                     {/* Mentee Information */}
//                     <div className="col-12 mb-4">
//                       <h5 className="mb-3">
//                         <Icon
//                           icon="mdi:account"
//                           width="20"
//                           height="20"
//                           className="me-2"
//                         />
//                         Mentee Information
//                       </h5>
//                       <div className="row">
//                         <div className="col-md-4 mb-3">
//                           <div className="form__box">
//                             <label>Mentee Name</label>
//                             <input type="text" className="form-control shadow-none" value={viewBookingData.menteeName || "N/A"} readOnly />
//                           </div>
//                         </div>
//                         <div className="col-md-4 mb-3">
//                           <div className="form__box">
//                             <label>Email</label>
//                             <input type="text" className="form-control shadow-none" value={viewBookingData.email || "N/A"} readOnly />
//                           </div>
//                         </div>
//                         <div className="col-md-4 mb-3">
//                           <div className="form__box">
//                             <label>Phone</label>
//                             <input type="text" className="form-control shadow-none" value={viewBookingData.phone || "N/A"} readOnly />
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Session Information */}
//                     <div className="col-12 mb-4">
//                       <h5 className="mb-3">
//                         <Icon
//                           icon="mdi:calendar-clock"
//                           width="20"
//                           height="20"
//                           className="me-2"
//                         />
//                         Session Information
//                       </h5>
//                       <div className="row">
//                         <div className="col-md-6 mb-3">
//                           <div className="form__box">
//                             <label>Topic</label>
//                             <input type="text" className="form-control shadow-none" value={viewBookingData.topic || "N/A"} readOnly />
//                           </div>
//                         </div>
//                         <div className="col-md-6 mb-3">
//                           <div className="form__box">
//                             <label>Session Type</label>
//                             <input type="text" className="form-control shadow-none" value={viewBookingData.sessionType || "One-on-One"} readOnly />
//                           </div>
//                         </div>
//                         <div className="col-md-4 mb-3">
//                           <div className="form__box">
//                             <label>Session Date</label>
//                             <input type="text" className="form-control shadow-none" value={formatDate(viewBookingData.sessionDate)} readOnly />
//                           </div>
//                         </div>
//                         <div className="col-md-4 mb-3">
//                           <div className="form__box">
//                             <label>Time</label>
//                             <input type="text" className="form-control shadow-none" value={viewBookingData.startTime || "N/A"} readOnly />
//                           </div>
//                         </div>
//                         <div className="col-md-4 mb-3">
//                           <div className="form__box">
//                             <label>Duration</label>
//                             <input type="text" className="form-control shadow-none" value={`${viewBookingData.durationMinutes} minutes`} readOnly />
//                           </div>
//                         </div>
//                         <div className="col-12 mb-3">
//                           <div className="form__box">
//                             <label>Description</label>
//                             <textarea className="form-control shadow-none" value={viewBookingData.description || "No description"} readOnly rows="3" />
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Payment Information */}
//                     <div className="col-md-6 mb-4">
//                       <h5 className="mb-3">
//                         <Icon
//                           icon="mdi:currency-usd"
//                           width="20"
//                           height="20"
//                           className="me-2"
//                         />
//                         Payment Information
//                       </h5>
//                       <div className="row">
//                         <div className="col-md-6 mb-3">
//                           <div className="form__box">
//                             <label>Price</label>
//                             <input type="text" className="form-control shadow-none" value={formatCurrency(viewBookingData.price, viewBookingData.currency)} readOnly />
//                           </div>
//                         </div>
//                         <div className="col-md-6 mb-3">
//                           <div className="form__box">
//                             <label>Payment Status</label>
//                             <input 
//                               type="text" 
//                               className="form-control shadow-none" 
//                               value={viewBookingData.paymentStatus || "N/A"} 
//                               readOnly 
//                               style={{
//                                 color: viewBookingData.paymentStatus === "paid" ? "green" : 
//                                        viewBookingData.paymentStatus === "unpaid" ? "orange" : "red",
//                                 fontWeight: "bold",
//                               }}
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Meeting Link */}
//                     {viewBookingData.meetingLink && (
//                       <div className="col-12 mb-4">
//                         <h5 className="mb-3">
//                           <Icon
//                             icon="mdi:video"
//                             width="20"
//                             height="20"
//                             className="me-2"
//                           />
//                           Meeting Link
//                         </h5>
//                         <div className="input-group">
//                           <input type="text" className="form-control shadow-none" value={viewBookingData.meetingLink} readOnly />
//                           <a href={viewBookingData.meetingLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Join Meeting</a>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   <div className="text-center my-4">
//                     <button
//                       type="button"
//                       className="btn btn-secondary px-5 py-2"
//                       data-bs-dismiss="modal"
//                     >
//                       Close
//                     </button>
//                   </div>
//                 </>
//               ) : null}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Edit Modal */}
//       <div
//         className="modal fade common__modal"
//         id="editModal"
//         tabIndex="-1"
//         aria-labelledby="editModalLabel"
//         aria-hidden="true"
//       >
//         <div className="modal-dialog modal-dialog-centered modal-lg">
//           <div className="modal-content">
//             <div className="modal-header border-0 pb-0">
//               <h1 className="modal-title" id="editModalLabel">
//                 <Icon
//                   icon="mdi:pencil"
//                   width="28"
//                   height="28"
//                   className="me-2"
//                 />
//                 Edit Session Booking
//               </h1>
//               <button type="button" className="btn-close" data-bs-dismiss="modal" id="closeEditModal"></button>
//             </div>
//             <div className="modal-body pt-0 px-4">
//               {currentEditData && (
//                 <div className="row g-3">
//                   <div className="col-md-6">
//                     <div className="form__box">
//                       <label>Topic *</label>
//                       <input type="text" className="form-control shadow-none" name="topic" value={currentEditData.topic || ""} onChange={handleEditChange} />
//                       {errors.topic && <small className="text-danger">{errors.topic}</small>}
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="form__box">
//                       <label>Session Date *</label>
//                       <input type="date" className="form-control shadow-none" name="sessionDate" value={currentEditData.sessionDate || ""} onChange={handleEditChange} />
//                       {errors.sessionDate && <small className="text-danger">{errors.sessionDate}</small>}
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="form__box">
//                       <label>Start Time *</label>
//                       <input type="text" className="form-control shadow-none" name="startTime" value={currentEditData.startTime || ""} onChange={handleEditChange} placeholder="09:00 - 10:00" />
//                       {errors.startTime && <small className="text-danger">{errors.startTime}</small>}
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="form__box">
//                       <label>Duration (minutes) *</label>
//                       <input type="number" className="form-control shadow-none" name="durationMinutes" value={currentEditData.durationMinutes || ""} onChange={handleEditChange} />
//                       {errors.durationMinutes && <small className="text-danger">{errors.durationMinutes}</small>}
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="form__box">
//                       <label>Price *</label>
//                       <input type="number" className="form-control shadow-none" name="price" value={currentEditData.price || ""} onChange={handleEditChange} />
//                       {errors.price && <small className="text-danger">{errors.price}</small>}
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="form__box">
//                       <label>Session Type</label>
//                       <select className="form-select shadow-none" name="sessionType" value={currentEditData.sessionType || "One-on-One"} onChange={handleEditChange}>
//                         <option value="One-on-One">One-on-One</option>
//                         <option value="Group">Group</option>
//                         <option value="Workshop">Workshop</option>
//                       </select>
//                     </div>
//                   </div>
//                   <div className="col-12">
//                     <div className="form__box">
//                       <label>Description</label>
//                       <textarea className="form-control shadow-none" name="description" value={currentEditData.description || ""} onChange={handleEditChange} rows="3" />
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//             <div className="modal-footer border-0">
//               <button type="button" className="btn btn-secondary px-4" data-bs-dismiss="modal">Cancel</button>
//               <button type="button" className="btn btn-success px-4" onClick={handleUpdateBooking}>Save Changes</button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default SessionBookingManagement;



// SessionBookingManagement.jsx
import React, { useState, useEffect } from "react";
import DashboardLayout from "../../Layout/DashboardLayout";
import { Icon } from "@iconify/react/dist/iconify.js";
import Pagination from "../../components/Pagination";
import Skeleton from "react-loading-skeleton";
import {
  useGetSessionBookingsQuery,
  useViewSessionBookingQuery,
  useUpdateSessionBookingMutation,
  useUpdateSessionStatusMutation,
  useUpdatePaymentStatusMutation,
  useDeleteSessionBookingMutation,
} from "./adminApiSlice"
import { toast } from "react-toastify";

const SessionBookingManagement = () => {
  const [currentEditData, setCurrentEditData] = useState(null);
  const [errors, setErrors] = useState({});

  // State for pagination
  const [state, setState] = useState({
    currentPage: 1,
    perPage: 10,
    search: "",
    selectedBookingId: null,
  });

  // Build query params
  const queryParams = `limit=${state.perPage}&page=${state.currentPage}&search=${state.search}`;

  // Fetch session bookings
  const {
    data: sessionBookingsResponse,
    isLoading,
    isError,
    error,
    refetch
  } = useGetSessionBookingsQuery(queryParams);

  // Fetch single booking for view modal
  const {
    data: viewBookingResponse,
    isLoading: isBookingLoading,
  } = useViewSessionBookingQuery(state.selectedBookingId, {
    skip: !state.selectedBookingId,
  });

  // Mutations
  const [updateSessionBooking] = useUpdateSessionBookingMutation();
  const [updateSessionStatus] = useUpdateSessionStatusMutation();
  const [updatePaymentStatus] = useUpdatePaymentStatusMutation();
  const [deleteSessionBooking] = useDeleteSessionBookingMutation();

  // Extract data from response
  const TableData = sessionBookingsResponse?.data || [];
  const paginationData = sessionBookingsResponse?.pagination || {};
  const viewBookingData = viewBookingResponse?.data || null;

  // Calculate statistics
  const totalBookings = TableData.length || 0;
  const confirmedBookings = TableData.filter(b => b.status === "confirmed").length || 0;
  const completedBookings = TableData.filter(b => b.status === "completed").length || 0;
  const pendingBookings = TableData.filter(b => b.status === "pending").length || 0;

  // Stats card data
  const statsCards = [
    { count: totalBookings, label: "Total Bookings", alt: "total-bookings" },
    { count: confirmedBookings, label: "Confirmed", alt: "confirmed-bookings" },
    { count: completedBookings, label: "Completed", alt: "completed-bookings" },
    { count: pendingBookings, label: "Pending", alt: "pending-bookings" },
  ];

  // Handle page change
  const handlePageChange = (page) => {
    setState({ ...state, currentPage: page });
  };

  // Handle search with debounce
  let searchTimeout;
  const handleSearch = (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      setState({ ...state, search: e.target.value, currentPage: 1 });
    }, 500);
  };

  useEffect(() => {
    return () => {
      clearTimeout(searchTimeout);
    };
  }, []);

  // Validation
  const validate = () => {
    let formErrors = {};

    if (!currentEditData?.topic?.trim()) {
      formErrors.topic = "Topic is required";
    }

    if (!currentEditData?.sessionDate) {
      formErrors.sessionDate = "Session date is required";
    }

    if (!currentEditData?.startTime?.trim()) {
      formErrors.startTime = "Start time is required";
    }

    if (!currentEditData?.durationMinutes) {
      formErrors.durationMinutes = "Duration is required";
    } else if (currentEditData.durationMinutes < 15) {
      formErrors.durationMinutes = "Duration cannot be less than 15 minutes";
    }

    if (currentEditData?.price === undefined || currentEditData?.price === null || currentEditData?.price === "") {
      formErrors.price = "Price is required";
    } else if (currentEditData.price < 0) {
      formErrors.price = "Price cannot be negative";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  // Open edit modal
  const openModal = (data) => {
    setCurrentEditData({
      ...data,
      sessionDate: data.sessionDate ? new Date(data.sessionDate).toISOString().split('T')[0] : '',
    });
    setErrors({});
    const modal = new window.bootstrap.Modal(document.getElementById("editModal"));
    modal.show();
  };

  // Open view modal
  const openViewModal = (data) => {
    setState({ ...state, selectedBookingId: data._id });
    const modal = new window.bootstrap.Modal(document.getElementById("viewModal"));
    modal.show();
  };

  // Handle edit change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCurrentEditData({ ...currentEditData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  // Handle update
  const handleUpdateBooking = async () => {
    if (!validate()) return;

    try {
      const { _id, __v, createdAt, userId, mentorId, menteeId, zoomMeeting, ...updateData } = currentEditData;

      await updateSessionBooking({
        bookingId: _id,
        ...updateData
      }).unwrap();

      toast.success("Session booking updated successfully", {
        position: "top-center",
      });
      document.getElementById("closeEditModal").click();
      refetch();
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to update session booking", {
        position: "top-center",
      });
    }
  };

  // Handle status change
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateSessionStatus({ bookingId, status: newStatus }).unwrap();
      toast.success(`Status updated to ${newStatus}`, {
        position: "top-center",
      });
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update status", {
        position: "top-center",
      });
    }
  };

  // Handle payment status change
  const handlePaymentStatusChange = async (bookingId, newPaymentStatus) => {
    try {
      await updatePaymentStatus({ bookingId, paymentStatus: newPaymentStatus }).unwrap();
      toast.success(`Payment status updated to ${newPaymentStatus}`, {
        position: "top-center",
      });
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update payment status", {
        position: "top-center",
      });
    }
  };

  // Handle delete
  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    try {
      await deleteSessionBooking(bookingId).unwrap();
      toast.success("Session booking deleted successfully", {
        position: "top-center",
      });
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete booking", {
        position: "top-center",
      });
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format date with time
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

  // Format currency
  const formatCurrency = (amount, currency) => {
    if (amount === 0) return "Free";
    if (!amount) return "N/A";
    return `${currency === "INR" ? "₹" : "$"}${amount}`;
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      pending: "badge bg-warning text-dark",
      confirmed: "badge bg-info text-dark",
      completed: "badge bg-success",
      cancelled: "badge bg-danger",
      rescheduled: "badge bg-secondary"
    };
    return badges[status] || "badge bg-secondary";
  };

  // Get payment badge
  const getPaymentBadge = (paymentStatus) => {
    const badges = {
      unpaid: "badge bg-warning text-dark",
      paid: "badge bg-success",
      refunded: "badge bg-info text-dark",
      failed: "badge bg-danger"
    };
    return badges[paymentStatus] || "badge bg-secondary";
  };

  return (
    <DashboardLayout>
      <style>{`
        /* Equal-height stat cards */
        .stat-card-col { display: flex; margin-bottom: 1.5rem; }
        .stat-card-inner { display: flex; align-items: center; width: 100%; border-radius: 0.5rem; padding: 1rem 1.25rem; }
        @media (min-width: 768px) { .stat-card-inner { padding: 1.25rem 1.5rem; } }
        .stat-card-icon { flex-shrink: 0; border-radius: 0.5rem; padding: 0.6rem; display: flex; align-items: center; justify-content: center; }
        @media (min-width: 768px) { .stat-card-icon { padding: 0.85rem; } }
        .stat-card-icon img { width: 40px; height: 40px; object-fit: contain; display: block; }
        .stat-card-text h2 { margin-bottom: 0.1rem; line-height: 1.2; }
        .stat-card-text h5 { margin-bottom: 0; }
      `}</style>

      <section className="profile_section user__management py-4">
        <div className="container-fluid">
          <div className="row">

            {/* ── Statistics Cards ── */}
            {statsCards.map(({ count, label, alt }) => (
              <div key={label} className="col-12 col-sm-6 col-xl-3 stat-card-col">
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

            {/* ── Bookings Table ── */}
            <div className="col-12">
              <div className="my_total_team_data rounded-3 px-3 py-4">
                <h1 className="mb-3">Session Booking Management</h1>

                <div className="row justify-content-between">
                  {/* Items per page selector */}
                  <div className="col-12 col-sm-6 col-md-2 col-xxl-1">
                    <div className="pagination__box mb-4">
                      <div className="showing_data">
                        <select
                          className="form-select shadow-none"
                          value={state.perPage}
                          onChange={(e) => setState({ ...state, perPage: e.target.value, currentPage: 1 })}
                        >
                          <option value="10">10</option>
                          <option value="30">30</option>
                          <option value="50">50</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Search input */}
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
                          placeholder="Search by mentee, topic..."
                          onChange={handleSearch}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="table_data table-responsive">
                  <table className="table mb-0">
                    <thead>
                      <tr>
                        <th scope="col">S.No</th>
                        <th scope="col">Mentee Name</th>
                        <th scope="col">Topic</th>
                        <th scope="col">Session Date</th>
                        <th scope="col">Time</th>
                        {/* <th scope="col">Duration</th> */}
                        <th scope="col">Price</th>
                        <th scope="col">Status</th>
                        <th scope="col">Payment</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        Array(5).fill(0).map((_, i) => (
                          <tr key={i}>
                            {Array(10).fill(0).map((_, j) => (
                              <td key={j}><Skeleton /></td>
                            ))}
                          </tr>
                        ))
                      ) : isError ? (
                        <tr>
                          <td colSpan="10" className="text-center text-danger">
                            Error: {error?.data?.message || "Failed to load bookings"}
                          </td>
                        </tr>
                      ) : TableData.length === 0 ? (
                        <tr>
                          <td colSpan="10" className="text-center">
                            No bookings found
                          </td>
                        </tr>
                      ) : (
                        TableData.map((booking, i) => (
                          <tr key={booking._id}>
                            <td>{(state.currentPage - 1) * state.perPage + i + 1}</td>
                            <td>{booking.menteeName || "N/A"}</td>
                            <td>{booking.topic || "N/A"}</td>
                            <td>
                              <small>{formatDate(booking.sessionDate)}</small>
                            </td>
                            <td>{booking.startTime || "N/A"}</td>
                            {/* <td>{booking.durationMinutes} min</td> */}
                            <td>{formatCurrency(booking.price, booking.currency)}</td>
                            <td>
                              <select
                                className={getStatusBadge(booking.status)}
                                value={booking.status}
                                onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                                style={{ cursor: "pointer", border: "none", padding: "4px 8px" }}
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="rescheduled">Rescheduled</option>
                              </select>
                            </td>
                            <td>
                              <select
                                className={getPaymentBadge(booking.paymentStatus)}
                                value={booking.paymentStatus}
                                onChange={(e) => handlePaymentStatusChange(booking._id, e.target.value)}
                                style={{ cursor: "pointer", border: "none", padding: "4px 8px" }}
                              >
                                <option value="unpaid">Unpaid</option>
                                <option value="paid">Paid</option>
                                <option value="refunded">Refunded</option>
                                <option value="failed">Failed</option>
                              </select>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                {/* <button
                                  className="btn btn-sm btn-info"
                                  title="View Details"
                                  onClick={() => openViewModal(booking)}
                                >
                                  <Icon icon="mdi:eye" width="16" height="16" />
                                </button>
                                <button
                                  className="btn btn-sm btn-warning"
                                  title="Edit"
                                  onClick={() => openModal(booking)}
                                >
                                  <Icon icon="mdi:pencil" width="16" height="16" />
                                </button> */}
                                <button
                                  className="btn btn-sm btn-danger"
                                  title="Delete"
                                  onClick={() => handleDeleteBooking(booking._id)}
                                >
                                  <Icon icon="mdi:delete" width="16" height="16" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {TableData.length > 0 && paginationData.totalPages > 1 && (
                  <Pagination
                    currentPage={state.currentPage}
                    totalPages={paginationData.totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── View Modal ──────────────────────────────────────────────── */}
      <div
        className="modal fade common__modal"
        id="viewModal"
        tabIndex="-1"
        aria-labelledby="viewModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header border-0 pb-0">
              <h1 className="modal-title" id="viewModalLabel">
                <Icon icon="mdi:calendar-check" width="28" height="28" className="me-2" />
                Session Booking Details
              </h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body pt-0 px-4">
              {isBookingLoading ? (
                <Skeleton count={10} />
              ) : viewBookingData ? (
                <>
                  {/* Header Section */}
                  <div className="text-center mb-4 pb-4 border-bottom">
                    <h3>{viewBookingData.topic || "N/A"}</h3>
                    <div className="d-flex gap-2 justify-content-center flex-wrap mt-2">
                      <span className={getStatusBadge(viewBookingData.status)}>
                        {viewBookingData.status}
                      </span>
                      <span className={getPaymentBadge(viewBookingData.paymentStatus)}>
                        {viewBookingData.paymentStatus}
                      </span>
                    </div>
                  </div>

                  <div className="row">
                    {/* Mentee Information */}
                    <div className="col-12 mb-4">
                      <h5 className="mb-3">
                        <Icon icon="mdi:account" width="20" height="20" className="me-2" />
                        Mentee Information
                      </h5>
                      <div className="row">
                        <div className="col-md-4 mb-3">
                          <div className="form__box">
                            <label>Mentee Name</label>
                            <input type="text" className="form-control shadow-none" value={viewBookingData.menteeName || "N/A"} readOnly />
                          </div>
                        </div>
                        <div className="col-md-4 mb-3">
                          <div className="form__box">
                            <label>Email</label>
                            <input type="text" className="form-control shadow-none" value={viewBookingData.email || "N/A"} readOnly />
                          </div>
                        </div>
                        <div className="col-md-4 mb-3">
                          <div className="form__box">
                            <label>Phone</label>
                            <input type="text" className="form-control shadow-none" value={viewBookingData.phone || "N/A"} readOnly />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Session Information */}
                    <div className="col-12 mb-4">
                      <h5 className="mb-3">
                        <Icon icon="mdi:calendar-clock" width="20" height="20" className="me-2" />
                        Session Information
                      </h5>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <div className="form__box">
                            <label>Topic</label>
                            <input type="text" className="form-control shadow-none" value={viewBookingData.topic || "N/A"} readOnly />
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="form__box">
                            <label>Session Type</label>
                            <input type="text" className="form-control shadow-none" value={viewBookingData.sessionType || "One-on-One"} readOnly />
                          </div>
                        </div>
                        <div className="col-md-4 mb-3">
                          <div className="form__box">
                            <label>Session Date</label>
                            <input type="text" className="form-control shadow-none" value={formatDate(viewBookingData.sessionDate)} readOnly />
                          </div>
                        </div>
                        <div className="col-md-4 mb-3">
                          <div className="form__box">
                            <label>Time</label>
                            <input type="text" className="form-control shadow-none" value={viewBookingData.startTime || "N/A"} readOnly />
                          </div>
                        </div>
                        <div className="col-md-4 mb-3">
                          <div className="form__box">
                            <label>Duration</label>
                            <input type="text" className="form-control shadow-none" value={`${viewBookingData.durationMinutes} minutes`} readOnly />
                          </div>
                        </div>
                        <div className="col-12 mb-3">
                          <div className="form__box">
                            <label>Description</label>
                            <textarea className="form-control shadow-none" value={viewBookingData.description || "No description"} readOnly rows="3" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Information */}
                    <div className="col-md-6 mb-4">
                      <h5 className="mb-3">
                        <Icon icon="mdi:currency-usd" width="20" height="20" className="me-2" />
                        Payment Information
                      </h5>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <div className="form__box">
                            <label>Price</label>
                            <input type="text" className="form-control shadow-none" value={formatCurrency(viewBookingData.price, viewBookingData.currency)} readOnly />
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="form__box">
                            <label>Payment Status</label>
                            <input
                              type="text"
                              className="form-control shadow-none"
                              value={viewBookingData.paymentStatus || "N/A"}
                              readOnly
                              style={{
                                color: viewBookingData.paymentStatus === "paid" ? "green" :
                                  viewBookingData.paymentStatus === "unpaid" ? "orange" : "red",
                                fontWeight: "bold",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Meeting Link */}
                    {viewBookingData.meetingLink && (
                      <div className="col-12 mb-4">
                        <h5 className="mb-3">
                          <Icon icon="mdi:video" width="20" height="20" className="me-2" />
                          Meeting Link
                        </h5>
                        <div className="input-group">
                          <input type="text" className="form-control shadow-none" value={viewBookingData.meetingLink} readOnly />
                          <a href={viewBookingData.meetingLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Join Meeting</a>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-center my-4">
                    <button type="button" className="btn btn-secondary px-5 py-2" data-bs-dismiss="modal">
                      Close
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Edit Modal ───────────────────────────────────────────────── */}
      <div
        className="modal fade common__modal"
        id="editModal"
        tabIndex="-1"
        aria-labelledby="editModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0 pb-0">
              <h1 className="modal-title" id="editModalLabel">
                <Icon icon="mdi:pencil" width="28" height="28" className="me-2" />
                Edit Session Booking
              </h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" id="closeEditModal"></button>
            </div>
            <div className="modal-body pt-0 px-4">
              {currentEditData && (
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form__box">
                      <label>Topic *</label>
                      <input type="text" className="form-control shadow-none" name="topic" value={currentEditData.topic || ""} onChange={handleEditChange} />
                      {errors.topic && <small className="text-danger">{errors.topic}</small>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form__box">
                      <label>Session Date *</label>
                      <input type="date" className="form-control shadow-none" name="sessionDate" value={currentEditData.sessionDate || ""} onChange={handleEditChange} />
                      {errors.sessionDate && <small className="text-danger">{errors.sessionDate}</small>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form__box">
                      <label>Start Time *</label>
                      <input type="text" className="form-control shadow-none" name="startTime" value={currentEditData.startTime || ""} onChange={handleEditChange} placeholder="09:00 - 10:00" />
                      {errors.startTime && <small className="text-danger">{errors.startTime}</small>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form__box">
                      <label>Duration (minutes) *</label>
                      <input type="number" className="form-control shadow-none" name="durationMinutes" value={currentEditData.durationMinutes || ""} onChange={handleEditChange} />
                      {errors.durationMinutes && <small className="text-danger">{errors.durationMinutes}</small>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form__box">
                      <label>Price *</label>
                      <input type="number" className="form-control shadow-none" name="price" value={currentEditData.price || ""} onChange={handleEditChange} />
                      {errors.price && <small className="text-danger">{errors.price}</small>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form__box">
                      <label>Session Type</label>
                      <select className="form-select shadow-none" name="sessionType" value={currentEditData.sessionType || "One-on-One"} onChange={handleEditChange}>
                        <option value="One-on-One">One-on-One</option>
                        <option value="Group">Group</option>
                        <option value="Workshop">Workshop</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form__box">
                      <label>Description</label>
                      <textarea className="form-control shadow-none" name="description" value={currentEditData.description || ""} onChange={handleEditChange} rows="3" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer border-0">
              <button type="button" className="btn btn-secondary px-4" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-success px-4" onClick={handleUpdateBooking}>Save Changes</button>
            </div>
          </div>
        </div>
      </div>

    </DashboardLayout>
  );
};

export default SessionBookingManagement;