// import React, { useState, useEffect } from "react";
// import { Icon } from "@iconify/react/dist/iconify.js";
// import Pagination from "../../components/Pagination";
// import DashboardLayout from "../../Layout/DashboardLayout";
// import {
//   useGetMenteesQuery,
//   useToggleBlockMenteeMutation,
//   useAssignMentorMutation,
//   useDeleteMenteeMutation,
//   useUpdateMenteeMutation,
// } from "./allmentessapislice";
// import Skeleton from "react-loading-skeleton";
// import { toast } from "react-toastify";

// const MenteesManagement = () => {
//   const [selectedMentee, setSelectedMentee] = useState(null);
//   const [editFormData, setEditFormData] = useState({});
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [mentorId, setMentorId] = useState("");

//   // Pagination state
//   const [state, setState] = useState({
//     currentPage: 1,
//     perPage: 10,
//     search: "",
//   });

//   const queryParams = `limit=${state.perPage}&page=${state.currentPage}&search=${state.search}`;

//   const { data: getMentees, isLoading, refetch } = useGetMenteesQuery(queryParams);
//   const [toggleBlock, { isLoading: isToggling }] = useToggleBlockMenteeMutation();
//   const [assignMentor, { isLoading: isAssigning }] = useAssignMentorMutation();
//   const [deleteMentee, { isLoading: isDeleting }] = useDeleteMenteeMutation();
//   const [updateMentee, { isLoading: isSaving }] = useUpdateMenteeMutation();

//   const TableData = getMentees?.data?.data || [];
//   const totalMentees = getMentees?.data?.total || 0;
//   const activeMentees = TableData.filter((user) => user.isActive && !user.isBlock).length || 0;
//   const blockedMentees = TableData.filter((user) => user.isBlock).length || 0;
//   const withoutMentor = TableData.filter((user) => !user.mentorId).length || 0;

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
//     return () => clearTimeout(searchTimeout);
//   }, []);

//   // Seed edit form when opening modal
//   const handleViewDetails = (mentee) => {
//     setSelectedMentee(mentee);
//     setEditFormData({
//       name: mentee.name || "",
//       phone: mentee.phone || "",
//       country: mentee.country || "",
//       state: mentee.state || "",
//       city: mentee.city || "",
//       address: mentee.address || "",
//     });
//     setIsEditMode(false);
//   };

//   // Update single field
//   const handleEditChange = (field, value) => {
//     setEditFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   // Save updated mentee data
//   const handleSaveEdit = async () => {
//     try {
//       const payload = Object.fromEntries(
//         Object.entries(editFormData).filter(([, v]) => v !== "" && v !== null && v !== undefined)
//       );

//       await updateMentee({ id: selectedMentee._id, data: payload }).unwrap();

//       toast.success("Mentee details updated successfully", {
//         position: "top-center",
//         autoClose: 4000,
//       });

//       setIsEditMode(false);
//       refetch();
//     } catch (error) {
//       console.error("Update failed:", error);
//       toast.error(error?.data?.message || "Failed to update mentee details", {
//         position: "top-center",
//       });
//     }
//   };

//   // Cancel edit — reset form to original
//   const handleCancelEdit = () => {
//     if (selectedMentee) handleViewDetails(selectedMentee);
//     setIsEditMode(false);
//   };

//   // Handle block/unblock
//   const handleToggleBlock = async (mentee) => {
//     try {
//       await toggleBlock({ id: mentee._id, isBlock: !mentee.isBlock }).unwrap();
//       toast.success(
//         `Mentee ${!mentee.isBlock ? "blocked" : "unblocked"} successfully`,
//         { position: "top-center" }
//       );
//       refetch();
//     } catch (error) {
//       toast.error(error?.data?.message || "Failed to update status", {
//         position: "top-center",
//       });
//     }
//   };

//   // Handle assign mentor
//   const handleAssignMentor = async (e) => {
//     e.preventDefault();
//     if (!mentorId) {
//       toast.error("Please enter a mentor ID");
//       return;
//     }
//     try {
//       await assignMentor({ menteeId: selectedMentee._id, mentorId }).unwrap();
//       toast.success("Mentor assigned successfully", { position: "top-center" });
//       setMentorId("");
//       setSelectedMentee(null);
//       const modalElement = document.getElementById("assignMentorModal");
//       window.bootstrap.Modal.getInstance(modalElement)?.hide();
//       refetch();
//     } catch (error) {
//       toast.error(error?.data?.message || "Failed to assign mentor", {
//         position: "top-center",
//       });
//     }
//   };

//   // Handle delete
//   const handleDelete = async (menteeId) => {
//     if (!window.confirm("Are you sure you want to delete this mentee?")) return;
//     try {
//       await deleteMentee(menteeId).unwrap();
//       toast.success("Mentee deleted successfully", { position: "top-center" });
//       refetch();
//     } catch (error) {
//       toast.error(error?.data?.message || "Failed to delete mentee", {
//         position: "top-center",
//       });
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

//   // Reusable editable field
//   const renderField = (label, field, type = "text", fullWidth = false) => (
//     <div className={`${fullWidth ? "col-md-12" : "col-md-6"} mb-3`} key={field}>
//       <div className="form__box">
//         <label>{label}</label>
//         <input
//           type={type}
//           autoComplete="off"
//           className="form-control shadow-none"
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
//           className="form-control shadow-none"
//           rows="2"
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

//   // Stats card data
//   const statsCards = [
//     { count: totalMentees, label: "Total Mentees", alt: "total-mentees" },
//     { count: activeMentees, label: "Active Mentees", alt: "active-mentees" },
//     { count: blockedMentees, label: "Blocked", alt: "blocked" },
//     // { count: withoutMentor, label: "Without Mentor", alt: "without-mentor" },
//   ];

//   return (
//     <>
//       <style>{`
//         .edit-toggle-btn { border: 1.5px solid #eb660f; color: #eb660f; background: transparent; border-radius: 6px; padding: 5px 16px; font-size: 14px; cursor: pointer; transition: background 0.15s, color 0.15s; }
//         .edit-toggle-btn:hover { background: #eb660f; color: #fff; }
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
//                 <div key={label} className="col-12 col-sm-6 col-xl-3 stat-card-col">
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

//               {/* ── Mentees Table ── */}
//               <div className="col-12">
//                 <div className="my_total_team_data rounded-3 px-3 py-4">
//                   <h1 className="mb-3">Mentees Management</h1>
//                   <div className="row justify-content-between">
//                     <div className="col-12 col-sm-6 col-md-2 col-xxl-1">
//                       <div className="pagination__box mb-4">
//                         <div className="showing_data">
//                           <select
//                             className="form-select shadow-none"
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
//                           <span className="input-group-text border-0 shadow-none bg-transparent rounded-0 pe-0">
//                             <Icon icon="tabler:search" width="16" height="16" style={{ color: "var(--white)" }} />
//                           </span>
//                           <input
//                             type="text"
//                             autoComplete="off"
//                             className="form-control border-0 shadow-none rounded-0 bg-transparent"
//                             placeholder="Search by name, email..."
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
//                           <th scope="col">Name</th>
//                           <th scope="col">Email</th>
//                           <th scope="col">Phone</th>
//                           <th scope="col">Total Bookings</th>
//                           <th scope="col">Completed</th>
//                           <th scope="col">Verified</th>
//                           <th scope="col">Blocked</th>
//                           <th scope="col">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {isLoading ? (
//                           [...Array(10)].map((_, i) => (
//                             <tr key={i}>
//                               {[...Array(10)].map((_, j) => (
//                                 <td key={j}><Skeleton /></td>
//                               ))}
//                             </tr>
//                           ))
//                         ) : TableData.length === 0 ? (
//                           <tr>
//                             <td colSpan="10" className="text-center">No mentees found</td>
//                           </tr>
//                         ) : (
//                           TableData.map((data, i) => (
//                             <tr key={data._id}>
//                               <td>{state.currentPage * state.perPage - (state.perPage - 1) + i}.</td>
//                               <td>{data.name || "N/A"}</td>
//                               <td>{data.email || "N/A"}</td>
//                               <td>{data.phone ? `+${data.countryCode || 91} ${data.phone}` : "N/A"}</td>
//                               <td>{data.totalBookings || 0}</td>
//                               <td>{data.completedBookings || 0}</td>
//                               <td>
//                                 <span className={data.isVerified ? "unblock" : "block"}>
//                                   {data.isVerified ? "Yes" : "No"}
//                                 </span>
//                               </td>
//                               <td>
//                                 <span className={data.isBlock ? "block" : "unblock"}>
//                                   {data.isBlock ? "Yes" : "No"}
//                                 </span>
//                               </td>
//                               <td>
//                                 <div className="d-flex gap-2">
//                                   <button
//                                     className="btn btn-sm btn-info"
//                                     title="View Details"
//                                     data-bs-toggle="modal"
//                                     data-bs-target="#menteeDetailsModal"
//                                     onClick={() => handleViewDetails(data)}
//                                   >
//                                     <Icon icon="mdi:eye" width="16" height="16" />
//                                   </button>
//                                   <button
//                                     className={`btn btn-sm ${data.isBlock ? "btn-warning" : "btn-danger"}`}
//                                     title={data.isBlock ? "Unblock" : "Block"}
//                                     onClick={() => handleToggleBlock(data)}
//                                     disabled={isToggling}
//                                   >
//                                     <Icon icon={data.isBlock ? "mdi:lock-open" : "mdi:lock"} width="16" height="16" />
//                                   </button>
//                                   <button
//                                     className="btn btn-sm btn-danger"
//                                     title="Delete"
//                                     onClick={() => handleDelete(data._id)}
//                                     disabled={isDeleting}
//                                   >
//                                     <Icon icon="mdi:delete" width="16" height="16" />
//                                   </button>
//                                 </div>
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
//                     totalPages={Math.ceil(totalMentees / state.perPage) || 1}
//                     onPageChange={handlePageChange}
//                   />
//                 )}
//               </div>

//             </div>
//           </div>

//           {/* ─── View / Edit Details Modal ─────────────────────────────── */}
//           <div
//             className="modal fade common__modal"
//             id="menteeDetailsModal"
//             tabIndex="-1"
//             aria-labelledby="menteeDetailsModalLabel"
//             aria-hidden="true"
//           >
//             <div className="modal-dialog modal-dialog-centered modal-xl">
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
//                   {/* Title row + Edit / Save / Cancel buttons */}
//                   <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
//                     <h1 className="modal-title mb-0" id="menteeDetailsModalLabel">
//                       <Icon icon="mdi:account-details" width="28" height="28" className="me-2" />
//                       Mentee Details
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
//                           <button type="button" className="cancel-edit-btn" onClick={handleCancelEdit}>
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

//                   {/* Edit mode banner */}
//                   {isEditMode && (
//                     <div className="edit-mode-banner">
//                       <Icon icon="mdi:information-outline" width="16" height="16" />
//                       Edit mode is active — modify fields below and click <strong>&nbsp;Save Changes</strong>.
//                     </div>
//                   )}

//                   {selectedMentee && (
//                     <>
//                       {/* Profile Header */}
//                       <div className="text-center mb-4 pb-4 border-bottom">
//                         <img
//                           src={selectedMentee.profile || "/images/default-avatar.png"}
//                           alt="Profile"
//                           className="rounded-circle mb-3"
//                           style={{
//                             width: "120px",
//                             height: "120px",
//                             objectFit: "cover",
//                             border: "3px solid var(--primary-color)",
//                           }}
//                         />
//                         <h3>{selectedMentee.name}</h3>
//                         <div className="d-flex gap-2 justify-content-center flex-wrap">
//                           {selectedMentee.isBlock && (
//                             <span className="badge bg-danger">
//                               <Icon icon="mdi:block-helper" width="14" height="14" className="me-1" />
//                               Blocked
//                             </span>
//                           )}
//                         </div>
//                       </div>

//                       <div className="row">

//                         {/* ── Personal Information (editable) ── */}
//                         <div className="col-12 mb-4">
//                           <h5 className="mb-3">
//                             <Icon icon="mdi:account" width="20" height="20" className="me-2" />
//                             Personal Information
//                           </h5>
//                           <div className="row">
//                             {renderField("Full Name", "name")}
//                             {/* Username & Email are read-only always */}
//                             <div className="col-md-6 mb-3">
//                               <div className="form__box">
//                                 <label>Username</label>
//                                 <input
//                                   type="text"
//                                   className="form-control shadow-none"
//                                   value={selectedMentee.username || "N/A"}
//                                   readOnly
//                                 />
//                               </div>
//                             </div>
//                             <div className="col-md-6 mb-3">
//                               <div className="form__box">
//                                 <label>Email</label>
//                                 <input
//                                   type="text"
//                                   className="form-control shadow-none"
//                                   value={selectedMentee.email || "N/A"}
//                                   readOnly
//                                 />
//                               </div>
//                             </div>
//                             {renderField("Phone", "phone", "tel")}
//                           </div>
//                         </div>

//                         {/* ── Location Information (editable) ── */}
//                         <div className="col-12 mb-4">
//                           <h5 className="mb-3">
//                             <Icon icon="mdi:map-marker" width="20" height="20" className="me-2" />
//                             Location Information
//                           </h5>
//                           <div className="row">
//                             {renderField("Country", "country")}
//                             {renderField("State", "state")}
//                             {renderField("City", "city")}
//                             {renderTextarea("Address", "address")}
//                           </div>
//                         </div>

//                         {/* ── Booking Statistics (read-only always) ── */}
//                         <div className="col-md-6 mb-4">
//                           <h5 className="mb-3">
//                             <Icon icon="mdi:calendar-check" width="20" height="20" className="me-2" />
//                             Booking Statistics
//                           </h5>
//                           <div className="row">
//                             <div className="col-md-6 mb-3">
//                               <div className="form__box">
//                                 <label>Total Bookings</label>
//                                 <input type="text" className="form-control shadow-none" value={selectedMentee.totalBookings || 0} readOnly />
//                               </div>
//                             </div>
//                             <div className="col-md-6 mb-3">
//                               <div className="form__box">
//                                 <label>Completed Bookings</label>
//                                 <input type="text" className="form-control shadow-none" value={selectedMentee.completedBookings || 0} readOnly />
//                               </div>
//                             </div>
//                             <div className="col-md-6 mb-3">
//                               <div className="form__box">
//                                 <label>Free Session Status</label>
//                                 <input
//                                   type="text"
//                                   className="form-control shadow-none"
//                                   value={selectedMentee.freeSessionUsed ? "Used" : "Available"}
//                                   readOnly
//                                   style={{ color: selectedMentee.freeSessionUsed ? "orange" : "green", fontWeight: "bold" }}
//                                 />
//                               </div>
//                             </div>
//                             {selectedMentee.mentorId && (
//                               <div className="col-md-6 mb-3">
//                                 <div className="form__box">
//                                   <label>Assigned Mentor ID</label>
//                                   <input type="text" className="form-control shadow-none" value={selectedMentee.mentorId} readOnly />
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         </div>

//                         {/* ── Status Information (read-only always) ── */}
//                         <div className="col-12 mb-4">
//                           <h5 className="mb-3">
//                             <Icon icon="mdi:flag" width="20" height="20" className="me-2" />
//                             Status Information
//                           </h5>
//                           <div className="row">
//                             <div className="col-md-3 mb-3">
//                               <div className="form__box">
//                                 <label>Active Status</label>
//                                 <input
//                                   type="text"
//                                   className="form-control shadow-none"
//                                   value={selectedMentee.isActive ? "Active" : "Inactive"}
//                                   readOnly
//                                   style={{ color: selectedMentee.isActive ? "green" : "red", fontWeight: "bold" }}
//                                 />
//                               </div>
//                             </div>
//                             <div className="col-md-3 mb-3">
//                               <div className="form__box">
//                                 <label>Verified</label>
//                                 <input
//                                   type="text"
//                                   className="form-control shadow-none"
//                                   value={selectedMentee.isVerified ? "Yes" : "No"}
//                                   readOnly
//                                   style={{ color: selectedMentee.isVerified ? "green" : "orange", fontWeight: "bold" }}
//                                 />
//                               </div>
//                             </div>
//                             <div className="col-md-3 mb-3">
//                               <div className="form__box">
//                                 <label>Blocked</label>
//                                 <input
//                                   type="text"
//                                   className="form-control shadow-none"
//                                   value={selectedMentee.isBlock ? "Yes" : "No"}
//                                   readOnly
//                                   style={{ color: selectedMentee.isBlock ? "red" : "green", fontWeight: "bold" }}
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                         </div>

//                       </div>

//                       <div className="text-center my-4">
//                         <button
//                           type="button"
//                           className="btn btn-secondary px-5 py-2"
//                           data-bs-dismiss="modal"
//                           onClick={() => setIsEditMode(false)}
//                         >
//                           Close
//                         </button>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* ─── Assign Mentor Modal ──────────────────────────────────── */}
//           <div
//             className="modal fade common__modal"
//             id="assignMentorModal"
//             tabIndex="-1"
//             aria-labelledby="assignMentorModalLabel"
//             aria-hidden="true"
//           >
//             <div className="modal-dialog modal-dialog-centered">
//               <div className="modal-content">
//                 <div className="modal-header border-0 pb-0">
//                   <h1 className="modal-title" id="assignMentorModalLabel">Assign Mentor</h1>
//                   <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
//                 </div>
//                 <div className="modal-body pt-0 px-4">
//                   {selectedMentee && (
//                     <form onSubmit={handleAssignMentor}>
//                       <p className="mb-3">
//                         Assign a mentor to <strong>{selectedMentee.name}</strong>
//                       </p>
//                       <div className="form__box mb-4">
//                         <label>Mentor ID</label>
//                         <input
//                           type="text"
//                           className="form-control shadow-none"
//                           placeholder="Enter Mentor ID"
//                           value={mentorId}
//                           onChange={(e) => setMentorId(e.target.value)}
//                           required
//                         />
//                       </div>
//                       <div className="d-flex gap-3 justify-content-center">
//                         <button type="submit" className="btn btn-success px-4" disabled={isAssigning}>
//                           {isAssigning ? "Assigning..." : "Assign"}
//                         </button>
//                         <button type="button" className="btn btn-secondary px-4" data-bs-dismiss="modal">
//                           Cancel
//                         </button>
//                       </div>
//                     </form>
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

// export default MenteesManagement;



import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Pagination from "../../components/Pagination";
import DashboardLayout from "../../Layout/DashboardLayout";
import {
  useGetMenteesQuery,
  useToggleBlockMenteeMutation,
  useAssignMentorMutation,
  useDeleteMenteeMutation,
  useUpdateMenteeMutation,
} from "./allmentessapislice";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";

const MenteesManagement = () => {
  const [selectedMentee, setSelectedMentee] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [mentorId, setMentorId] = useState("");

  // Pagination state
  const [state, setState] = useState({
    currentPage: 1,
    perPage: 10,
    search: "",
  });

  const queryParams = `limit=${state.perPage}&page=${state.currentPage}&search=${state.search}`;

  const { data: getMentees, isLoading, refetch } = useGetMenteesQuery(queryParams);
  const [toggleBlock, { isLoading: isToggling }] = useToggleBlockMenteeMutation();
  const [assignMentor, { isLoading: isAssigning }] = useAssignMentorMutation();
  const [deleteMentee, { isLoading: isDeleting }] = useDeleteMenteeMutation();
  const [updateMentee, { isLoading: isSaving }] = useUpdateMenteeMutation();

  const TableData = getMentees?.data?.data || [];
  const totalMentees = getMentees?.data?.total || 0;
  const activeMentees = TableData.filter((user) => user.isActive && !user.isBlock).length || 0;
  const blockedMentees = TableData.filter((user) => user.isBlock).length || 0;

  const handlePageChange = (e) => setState({ ...state, currentPage: e });

  let searchTimeout;
  const handleSearch = (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      setState({ ...state, search: e.target.value, currentPage: 1 });
    }, 1000);
  };

  useEffect(() => {
    refetch();
    return () => clearTimeout(searchTimeout);
  }, []);

  // Seed edit form when opening details modal
  const handleViewDetails = (mentee) => {
    setSelectedMentee(mentee);
    setEditFormData({
      name: mentee.name || "",
      phone: mentee.phone || "",
      country: mentee.country || "",
      state: mentee.state || "",
      city: mentee.city || "",
      address: mentee.address || "",
    });
    setIsEditMode(false);
  };

  // Open assign mentor modal for a specific mentee
  const handleOpenAssignModal = (mentee) => {
    setSelectedMentee(mentee);
    setMentorId("");
  };

  const handleEditChange = (field, value) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      const payload = Object.fromEntries(
        Object.entries(editFormData).filter(([, v]) => v !== "" && v !== null && v !== undefined)
      );
      await updateMentee({ id: selectedMentee._id, data: payload }).unwrap();
      toast.success("Mentee details updated successfully", { position: "top-center", autoClose: 4000 });
      setIsEditMode(false);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update mentee details", { position: "top-center" });
    }
  };

  const handleCancelEdit = () => {
    if (selectedMentee) handleViewDetails(selectedMentee);
    setIsEditMode(false);
  };

  const handleToggleBlock = async (mentee) => {
    try {
      await toggleBlock({ id: mentee._id, isBlock: !mentee.isBlock }).unwrap();
      toast.success(`Mentee ${!mentee.isBlock ? "blocked" : "unblocked"} successfully`, { position: "top-center" });
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update status", { position: "top-center" });
    }
  };

  const handleAssignMentor = async (e) => {
    e.preventDefault();
    if (!mentorId) { toast.error("Please enter a mentor ID"); return; }
    try {
      await assignMentor({ menteeId: selectedMentee._id, mentorId }).unwrap();
      toast.success("Mentor assigned successfully", { position: "top-center" });
      setMentorId("");
      setSelectedMentee(null);
      const modalElement = document.getElementById("assignMentorModal");
      window.bootstrap.Modal.getInstance(modalElement)?.hide();
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to assign mentor", { position: "top-center" });
    }
  };

  const handleDelete = async (menteeId) => {
    if (!window.confirm("Are you sure you want to delete this mentee?")) return;
    try {
      await deleteMentee(menteeId).unwrap();
      toast.success("Mentee deleted successfully", { position: "top-center" });
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete mentee", { position: "top-center" });
    }
  };

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

  const renderField = (label, field, type = "text", fullWidth = false) => (
    <div className={`${fullWidth ? "col-md-12" : "col-md-6"} mb-3`} key={field}>
      <div className="form__box">
        <label>{label}</label>
        <input
          type={type}
          autoComplete="off"
          className="form-control shadow-none"
          value={editFormData[field] ?? ""}
          readOnly={!isEditMode}
          onChange={(e) => handleEditChange(field, e.target.value)}
          style={isEditMode ? { borderColor: "#eb660f", background: "rgba(235,102,15,0.06)" } : {}}
        />
      </div>
    </div>
  );

  const renderTextarea = (label, field) => (
    <div className="col-md-12 mb-3" key={field}>
      <div className="form__box">
        <label>{label}</label>
        <textarea
          className="form-control shadow-none"
          rows="2"
          value={editFormData[field] ?? ""}
          readOnly={!isEditMode}
          onChange={(e) => handleEditChange(field, e.target.value)}
          style={isEditMode ? { borderColor: "#eb660f", background: "rgba(235,102,15,0.06)" } : {}}
        />
      </div>
    </div>
  );

  const statsCards = [
    { count: totalMentees, label: "Total Mentees", alt: "total-mentees" },
    // { count: activeMentees, label: "Active Mentees", alt: "active-mentees" },
    { count: blockedMentees, label: "Blocked", alt: "blocked" },
  ];

  return (
    <>
      <style>{`
        .edit-toggle-btn { border: 1.5px solid #eb660f; color: #eb660f; background: transparent; border-radius: 6px; padding: 4px 14px; font-size: 13px; cursor: pointer; transition: background 0.15s, color 0.15s; }
        .edit-toggle-btn:hover { background: #eb660f; color: #fff; }
        .save-btn { background: #eb660f; border: none; color: #fff; border-radius: 6px; padding: 4px 18px; font-size: 13px; cursor: pointer; }
        .save-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        .cancel-edit-btn { background: transparent; border: 1.5px solid #6c757d; color: #6c757d; border-radius: 6px; padding: 4px 14px; font-size: 13px; cursor: pointer; }
        .cancel-edit-btn:hover { background: #6c757d; color: #fff; }
        .edit-mode-banner { background: rgba(235,102,15,0.10); border-left: 3px solid #eb660f; border-radius: 4px; padding: 6px 12px; font-size: 12px; color: #eb660f; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }

        /* Modal title override — smaller */
        .modal-title-sm { font-size: 1rem; font-weight: 600; }

        /* Stat cards */
        .stat-card-col { display: flex; margin-bottom: 1.5rem; }
        .stat-card-inner { display: flex; align-items: center; width: 100%; border-radius: 0.5rem; padding: 1rem 1.25rem; }
        @media (min-width: 768px) { .stat-card-inner { padding: 1.25rem 1.5rem; } }
        .stat-card-icon { flex-shrink: 0; border-radius: 0.5rem; padding: 0.6rem; display: flex; align-items: center; justify-content: center; }
        .stat-card-icon img { width: 40px; height: 40px; object-fit: contain; display: block; }
        .stat-card-text h2 { margin-bottom: 0.1rem; line-height: 1.2; }
        .stat-card-text h5 { margin-bottom: 0; }
      `}</style>

      <DashboardLayout>
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

              {/* ── Mentees Table ── */}
              <div className="col-12">
                <div className="my_total_team_data rounded-3 px-3 py-4">
                  <h1 className="mb-3">Mentees Management</h1>

                  <div className="row justify-content-between">
                    <div className="col-12 col-sm-6 col-md-2 col-xxl-1">
                      <div className="pagination__box mb-4">
                        <div className="showing_data">
                          <select
                            className="form-select shadow-none"
                            onChange={(e) => setState({ ...state, perPage: e.target.value, currentPage: 1 })}
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
                          <span className="input-group-text border-0 shadow-none bg-transparent rounded-0 pe-0">
                            <Icon icon="tabler:search" width="16" height="16" style={{ color: "var(--white)" }} />
                          </span>
                          <input
                            type="text"
                            autoComplete="off"
                            className="form-control border-0 shadow-none rounded-0 bg-transparent"
                            placeholder="Search by name, email..."
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
                          <th scope="col">Name</th>
                          <th scope="col">Email</th>
                          <th scope="col">Phone</th>
                          <th scope="col">Total Bookings</th>
                          <th scope="col">Completed</th>
                          <th scope="col">Verified</th>
                          <th scope="col">Blocked</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          [...Array(10)].map((_, i) => (
                            <tr key={i}>
                              {[...Array(9)].map((_, j) => (
                                <td key={j}><Skeleton /></td>
                              ))}
                            </tr>
                          ))
                        ) : TableData.length === 0 ? (
                          <tr>
                            <td colSpan="9" className="text-center">No mentees found</td>
                          </tr>
                        ) : (
                          TableData.map((data, i) => (
                            <tr key={data._id}>
                              <td>{state.currentPage * state.perPage - (state.perPage - 1) + i}.</td>
                              <td>{data.name || "N/A"}</td>
                              <td>{data.email || "N/A"}</td>
                              <td>{data.phone ? `+${data.countryCode || 91} ${data.phone}` : "N/A"}</td>
                              <td>{data.totalBookings || 0}</td>
                              <td>{data.completedBookings || 0}</td>
                              <td>
                                <span className={data.isVerified ? "unblock" : "block"}>
                                  {data.isVerified ? "Yes" : "No"}
                                </span>
                              </td>
                              <td>
                                <span className={data.isBlock ? "block" : "unblock"}>
                                  {data.isBlock ? "Yes" : "No"}
                                </span>
                              </td>
                              <td style={{ whiteSpace: "nowrap" }}>
                                <div className="d-flex gap-1 align-items-center flex-nowrap">
                                  {/* View Details */}
                                  <button
                                    className="btn btn-sm btn-info"
                                    title="View Details"
                                    data-bs-toggle="modal"
                                    data-bs-target="#menteeDetailsModal"
                                    onClick={() => handleViewDetails(data)}
                                  >
                                    <Icon icon="mdi:eye" width="15" height="15" />
                                  </button>

                                  {/* Assign Mentor */}
                                  <button
                                    className="btn btn-sm btn-primary"
                                    title="Assign Mentor"
                                    data-bs-toggle="modal"
                                    data-bs-target="#assignMentorModal"
                                    onClick={() => handleOpenAssignModal(data)}
                                  >
                                    <Icon icon="mdi:account-plus" width="15" height="15" />
                                  </button>

                                  {/* Block / Unblock */}
                                  <button
                                    className={`btn btn-sm ${data.isBlock ? "btn-warning" : "btn-secondary"}`}
                                    title={data.isBlock ? "Unblock" : "Block"}
                                    onClick={() => handleToggleBlock(data)}
                                    disabled={isToggling}
                                  >
                                    <Icon icon={data.isBlock ? "mdi:lock-open" : "mdi:lock"} width="15" height="15" />
                                  </button>

                                  {/* Delete */}
                                  <button
                                    className="btn btn-sm btn-danger"
                                    title="Delete"
                                    onClick={() => handleDelete(data._id)}
                                    disabled={isDeleting}
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
                </div>

                {TableData?.length > 0 && (
                  <Pagination
                    currentPage={state.currentPage}
                    totalPages={Math.ceil(totalMentees / state.perPage) || 1}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>

            </div>
          </div>

          {/* ─── View / Edit Details Modal ─────────────────────────────── */}
          <div
            className="modal fade common__modal"
            id="menteeDetailsModal"
            tabIndex="-1"
            aria-labelledby="menteeDetailsModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header py-2 px-3">
                  {/* ← Smaller title */}
                  <h6 className="modal-title modal-title-sm d-flex align-items-center gap-2 mb-0" id="menteeDetailsModalLabel">
                    <Icon icon="mdi:account-details" width="16" height="16" />
                    Mentee Details
                  </h6>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => setIsEditMode(false)}
                  />
                </div>

                <div className="modal-body pt-2 px-3 pb-2">
                  {/* Edit / Save / Cancel buttons row */}
                  <div className="d-flex align-items-center justify-content-end mb-3 gap-2">
                    {!isEditMode ? (
                      <button type="button" className="edit-toggle-btn" onClick={() => setIsEditMode(true)}>
                        <Icon icon="mdi:pencil" width="13" height="13" style={{ marginRight: 4 }} />
                        Edit
                      </button>
                    ) : (
                      <>
                        <button type="button" className="cancel-edit-btn" onClick={handleCancelEdit}>
                          Cancel
                        </button>
                        <button type="button" className="save-btn" onClick={handleSaveEdit} disabled={isSaving}>
                          {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                      </>
                    )}
                  </div>

                  {/* Edit mode banner */}
                  {isEditMode && (
                    <div className="edit-mode-banner">
                      <Icon icon="mdi:information-outline" width="15" height="15" />
                      Edit mode is active — modify fields below and click <strong>&nbsp;Save Changes</strong>.
                    </div>
                  )}

                  {selectedMentee && (
                    <>
                      {/* Profile Header */}
                      <div className="text-center mb-3 pb-2 border-bottom">
                        <img
                          src={selectedMentee.profile || "/images/default-avatar.png"}
                          alt="Profile"
                          className="rounded-circle mb-1"
                          style={{ width: "64px", height: "64px", objectFit: "cover", border: "2px solid var(--primary-color)" }}
                        />
                        <p className="mb-1 fw-semibold" style={{ fontSize: "14px" }}>{selectedMentee.name}</p>
                        <div className="d-flex gap-2 justify-content-center flex-wrap">
                          {selectedMentee.isBlock && (
                            <span className="badge bg-danger">
                              <Icon icon="mdi:block-helper" width="13" height="13" className="me-1" />
                              Blocked
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="row">

                        {/* ── Personal Information ── */}
                        <div className="col-12 mb-2">
                          <p className="fw-semibold mb-2 d-flex align-items-center gap-1" style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#6c757d" }}>
                            <Icon icon="mdi:account" width="14" height="14" />
                            Personal Information
                          </p>
                          <div className="row">
                            {renderField("Full Name", "name")}
                            <div className="col-md-6 mb-3">
                              <div className="form__box">
                                <label>Username</label>
                                <input type="text" className="form-control shadow-none" value={selectedMentee.username || "N/A"} readOnly />
                              </div>
                            </div>
                            <div className="col-md-6 mb-3">
                              <div className="form__box">
                                <label>Email</label>
                                <input type="text" className="form-control shadow-none" value={selectedMentee.email || "N/A"} readOnly />
                              </div>
                            </div>
                            {renderField("Phone", "phone", "tel")}
                          </div>
                        </div>

                        {/* ── Location Information ── */}
                        <div className="col-12 mb-2">
                          <p className="fw-semibold mb-2 d-flex align-items-center gap-1" style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#6c757d" }}>
                            <Icon icon="mdi:map-marker" width="14" height="14" />
                            Location Information
                          </p>
                          <div className="row">
                            {renderField("Country", "country")}
                            {renderField("State", "state")}
                            {renderField("City", "city")}
                            {renderTextarea("Address", "address")}
                          </div>
                        </div>

                        {/* ── Booking Statistics ── */}
                        <div className="col-md-6 mb-2">
                          <p className="fw-semibold mb-2 d-flex align-items-center gap-1" style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#6c757d" }}>
                            <Icon icon="mdi:calendar-check" width="14" height="14" />
                            Booking Statistics
                          </p>
                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <div className="form__box">
                                <label>Total Bookings</label>
                                <input type="text" className="form-control shadow-none" value={selectedMentee.totalBookings || 0} readOnly />
                              </div>
                            </div>
                            <div className="col-md-6 mb-3">
                              <div className="form__box">
                                <label>Completed Bookings</label>
                                <input type="text" className="form-control shadow-none" value={selectedMentee.completedBookings || 0} readOnly />
                              </div>
                            </div>
                            <div className="col-md-6 mb-3">
                              <div className="form__box">
                                <label>Free Session Status</label>
                                <input
                                  type="text"
                                  className="form-control shadow-none"
                                  value={selectedMentee.freeSessionUsed ? "Used" : "Available"}
                                  readOnly
                                  style={{ color: selectedMentee.freeSessionUsed ? "orange" : "green", fontWeight: "bold" }}
                                />
                              </div>
                            </div>
                            {selectedMentee.mentorId && (
                              <div className="col-md-6 mb-3">
                                <div className="form__box">
                                  <label>Assigned Mentor ID</label>
                                  <input type="text" className="form-control shadow-none" value={selectedMentee.mentorId} readOnly />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* ── Status Information ── */}
                        <div className="col-12 mb-2">
                          <p className="fw-semibold mb-2 d-flex align-items-center gap-1" style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#6c757d" }}>
                            <Icon icon="mdi:flag" width="14" height="14" />
                            Status Information
                          </p>
                          <div className="row">
                            <div className="col-md-3 mb-3">
                              <div className="form__box">
                                <label>Active Status</label>
                                <input
                                  type="text"
                                  className="form-control shadow-none"
                                  value={selectedMentee.isActive ? "Active" : "Inactive"}
                                  readOnly
                                  style={{ color: selectedMentee.isActive ? "green" : "red", fontWeight: "bold" }}
                                />
                              </div>
                            </div>
                            <div className="col-md-3 mb-3">
                              <div className="form__box">
                                <label>Verified</label>
                                <input
                                  type="text"
                                  className="form-control shadow-none"
                                  value={selectedMentee.isVerified ? "Yes" : "No"}
                                  readOnly
                                  style={{ color: selectedMentee.isVerified ? "green" : "orange", fontWeight: "bold" }}
                                />
                              </div>
                            </div>
                            <div className="col-md-3 mb-3">
                              <div className="form__box">
                                <label>Blocked</label>
                                <input
                                  type="text"
                                  className="form-control shadow-none"
                                  value={selectedMentee.isBlock ? "Yes" : "No"}
                                  readOnly
                                  style={{ color: selectedMentee.isBlock ? "red" : "green", fontWeight: "bold" }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>

                      <div className="text-center mt-3 mb-1">
                        <button
                          type="button"
                          className="btn btn-secondary px-5 py-2"
                          data-bs-dismiss="modal"
                          onClick={() => setIsEditMode(false)}
                        >
                          Close
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ─── Assign Mentor Modal ──────────────────────────────────── */}
          <div
            className="modal fade common__modal"
            id="assignMentorModal"
            tabIndex="-1"
            aria-labelledby="assignMentorModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header border-0 pb-0">
                  {/* ← Smaller title */}
                  <h6 className="modal-title modal-title-sm d-flex align-items-center gap-2" id="assignMentorModalLabel">
                    <Icon icon="mdi:account-plus" width="18" height="18" />
                    Assign Mentor
                  </h6>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                </div>
                <div className="modal-body pt-2 px-4">
                  {selectedMentee && (
                    <form onSubmit={handleAssignMentor}>
                      <p className="mb-3 text-muted" style={{ fontSize: "13px" }}>
                        Assign a mentor to{" "}
                        <strong className="text-dark">{selectedMentee.name}</strong>
                      </p>
                      <div className="form__box mb-4">
                        <label>Mentor ID</label>
                        <input
                          type="text"
                          className="form-control shadow-none"
                          placeholder="Enter Mentor ID"
                          value={mentorId}
                          onChange={(e) => setMentorId(e.target.value)}
                          required
                        />
                      </div>
                      <div className="d-flex gap-3 justify-content-center">
                        <button type="submit" className="btn btn-success px-4" disabled={isAssigning}>
                          {isAssigning ? "Assigning..." : "Assign"}
                        </button>
                        <button type="button" className="btn btn-secondary px-4" data-bs-dismiss="modal">
                          Cancel
                        </button>
                      </div>
                    </form>
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

export default MenteesManagement;