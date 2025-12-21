// import React, { useState, useEffect, useContext } from "react";
// import { Icon } from "@iconify/react/dist/iconify.js";
// import Pagination from "../../components/Pagination";
// import DashboardLayout from "../../Layout/DashboardLayout";
// import Modals from "../../components/Modals";
// import {
//   useBlockUserMutation,
//   useGetUserQuery,
//   useSendTransactionMutation,
//   useViewUserQuery,
// } from "./userApiSlice";
// import Skeleton from "react-loading-skeleton";
// import { toast } from "react-toastify";
// import { MyContext } from "../auth/AuthContext";
// import { StateContext } from "../../context/StateContext";

// const UserManagement = () => {
//   const { amount, setAmount, transaction_type, setTransactionType } =
//     useContext(StateContext);
//   console.log("amount", amount);
//   console.log("transactionType", transaction_type);
//   const [modal, setModal] = useState(null);
//   const [refresh, setRefresh] = useState(false);
//   const [selectedWithdrawId, setSelectedWithdrawId] = useState(null);
//   // const [amount, setAmount] = useState('');
//   // const [transactionType, setTransactionType] = useState('');
//   const [sendTransaction] = useSendTransactionMutation();
//   const [blockUser] = useBlockUserMutation();
//   const [check1, setCheck1] = useState(false);

//   //pagination
//   const [state, setState] = useState({
//     currentPage: 1,
//     perPage: 10,
//     search: "",
//     selectedUserId: "",
//     userStatus: {},
//   });

//   const queryParams = `limit=${state?.perPage || ""}&page=${
//     state?.currentPage || ""
//   }&search=${state?.search || ""}`;

//   const { data: getUser, isLoading, refetch } = useGetUserQuery(queryParams);
//   const { data: viewUser, isLoading: isUserLoading } = useViewUserQuery(
//     state.selectedUserId,
//     { skip: !state.selectedUserId }
//   );
//   const TableData = getUser?.data?.users || [];
//   const totalMembers = getUser?.data?.pagination?.total || 0; //  total members

//   // Handle PerChange
//   const handlePageChange = (e) => {
//     setState({ ...state, currentPage: e });
//   };
//   // Function for handling search with delay
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

//   //handleUserView
//   const handleUserView = (userId) => {
//     setState({ ...state, selectedUserId: userId });
//     // setTimeout(() => {
//     //   if (modal) modal.show();
//     // }, 100);
//   };

//   const blockedUser = getUser?.data?.pagination?.blocked || 0;
//   // console.log("bta tere andar kya kya hai ?", getUser?.data);
//   const activeMembers = getUser?.data?.pagination?.active || 0;



//   const handleToggleActive = async (userId, isBlock) => {
//     try {
//       const isBlocked = isBlock == true ? 0 : 1;

//       const payload = {
//         is_blocked: isBlocked,
//         user_id: userId,
//       };

//       // Update local state first
//       const updatedUserStatus = {
//         ...state.userStatus,
//         [userId]: !isBlock,
//       };
//       setState({ ...state, userStatus: updatedUserStatus });

//       // Make API call to update server-side status
//       const response = await blockUser(payload);
//       toast.success(`${response?.data?.message}`, {
//         position: "top-center",
//       });
//       setRefresh(true);
//     } catch (error) {
//       toast.error(`${error?.data?.message}`, {
//         position: "top-center",
//       });
//       console.error("Failed to update user status:", error);
//     }
//   };

//   const handleCheck = (withdrawId) => {
//     setSelectedWithdrawId(withdrawId);
//     setCheck1(true);
//   };

//   const handleTransactionSubmit = async (e, transactionType, amount) => {
//     e.preventDefault();
//     if (amount == "") {
//       toast.error("Enter amount");
//       setAmount("");
//     } else if (amount < 1) {
//       toast.error("Amount must be greater than 1");
//       setAmount("");
//     } else if (!/[0-9]/.test(amount)) {
//       toast.error("Enter only numbers");
//       setAmount("");
//     } else {
//       try {
//         const res = await sendTransaction({
//           amount,
//           transaction_type: transactionType,
//           user_id: selectedWithdrawId,
//         });
//         toast.success(res?.data?.message, {
//           position: "top-center",
//         });
//         setAmount("");
//         setTransactionType("referral_amount");
//         setCheck1(false);
//       } catch (error) {
//         console.error("Transaction failed:", error);
//         toast.error(`${error?.data?.message}`);
//         setAmount("");
//       }
//     }
//   };
//   // const handleTransactionS = async () => {
//   //   try {
//   //     const payload = {
//   //       isApproved: 1,
//   //       withraw_id: [selectedWithdrawId],
//   //     };
//   //     await withdrawApprovalAmount(payload).unwrap();
//   //     toast.success("Withdrawal approved successfully");
//   //     setCheck(false);
//   //     setRefresh(true);
//   //   } catch (error) {
//   //     toast.error(`${error?.data?.isApproved?.message}`);
//   //     console.error("Failed to approve withdrawal:", error);
//   //   }
//   // };

//   // useEffect(() => {
//   //   setModal(new window.bootstrap.Modal(document.getElementById("editModal")));
//   // }, []);
//   const formatDateWithAmPm = (isoString) => {
//     const date = new Date(isoString);
//     const day = String(date.getUTCDate()).padStart(2, "0");
//     const month = String(date.getUTCMonth() + 1).padStart(2, "0");
//     const year = date.getUTCFullYear();
//     let hours = date.getUTCHours();
//     const minutes = String(date.getUTCMinutes()).padStart(2, "0");
//     const amAndPm = hours >= 12 ? "PM" : "AM";

//     hours = hours % 12 || 12;
//     return `${day}-${month}-${year} ${hours}:${minutes} ${amAndPm}`;
//   };
//   useEffect(() => {
//     if (refresh) {
//       refetch();
//       setRefresh(false);
//     }
//   }, [refresh, refetch]);

//   // const TableData = getUser?.data?.users
//   return (
//     <>
//       <DashboardLayout>
//         <section className="profile_section user__management py-4">
//           <div className="container-fluid">
//             <div className="row">
//               <div className="col-12 col-sm-6 col-md-6 col-xl-5 col-xxl-4">
//                 <div className="my_total_team_data mb-4 rounded-3 px-3 py-3 py-md-4">
//                   <div className="total_user_card d-flex align-items-center gap-2 gap-md-3">
//                     <div className="total_user_images rounded-3 p-2 p-md-4">
//                       <img
//                         src="/images/total-member.png"
//                         alt="total-member"
//                         className="img-fluid"
//                       />
//                     </div>
//                     <div className="total_user_card_data">
//                       <h2>{totalMembers}</h2>
//                       <h5>Total members</h5>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="col-12 col-sm-6 col-md-6 col-xl-5 col-xxl-4">
//                 <div className="my_total_team_data mb-4 rounded-3 px-3 py-3 py-md-4">
//                   <div className="total_user_card d-flex align-items-center gap-2 gap-md-3">
//                     <div className="total_user_images rounded-3 p-2 p-md-4">
//                       <img
//                         src="/images/total-member.png"
//                         alt="total-member"
//                         className="img-fluid"
//                       />
//                     </div>
//                     <div className="total_user_card_data">
//                       <h2>{blockedUser}</h2>
//                       <h5>Total Blocked</h5>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="col-12 col-sm-6 col-md-6 col-xl-5 col-xxl-4">
//                 <div className="my_total_team_data mb-4 rounded-3 px-3 py-3 py-md-4">
//                   <div className="total_user_card d-flex align-items-center gap-2 gap-md-3">
//                     <div className="total_user_images rounded-3 p-2 p-md-4">
//                       <img
//                         src="/images/total-member.png"
//                         alt="total-member"
//                         className="img-fluid"
//                       />
//                     </div>
//                     <div className="total_user_card_data">
//                       <h2>{activeMembers}</h2>
//                       <h5>Total Active Members</h5>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="col-12">
//                 <div className="my_total_team_data rounded-3 px-3 py-4">
//                   <h1 className="mb-3">Total User</h1>
//                   <div className="row justify-content-between">
//                     <div className="col-12 col-sm-6 col-md-2 col-xxl-1 ">
//                       <div className="pagination__box mb-4 ">
//                         modal
//                         <div className=" showing_data">
//                           <select
//                             className="form-select shadow-none"
//                             aria-label="Default select example"
//                             onClick={(e) =>
//                               setState({
//                                 ...state,
//                                 perPage: e.target.value,
//                                 currentPage: 1,
//                               })
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
//                             <Icon
//                               icon="tabler:search"
//                               width="16"
//                               height="16"
//                               style={{ color: "var(--white)" }}
//                             />
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
//                           <th scope="col">Name</th>
//                           <th scope="col">Email</th>
//                           <th scope="col">Mobile Number</th>
//                           <th scope="col">Referral Code</th>
//                           <th scope="col">Available Balance</th>
//                           <th scope="col">Withdrawal Amount</th>
//                           <th scope="col">Block/Unblock</th>
//                           <th scope="col">Status</th>
//                           <th scope="col">View User</th>
//                           <th scope="col">View Referrer User</th>
//                           <th scope="col">Action</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {isLoading ? (
//                           <>
//                             {[...Array(10)].map((e, i) => (
//                               <tr key={i}>
//                                 <td>
//                                   <Skeleton />
//                                 </td>
//                                 <td>
//                                   <Skeleton />
//                                 </td>
//                                 <td>
//                                   <Skeleton />
//                                 </td>
//                                 <td>
//                                   <Skeleton />
//                                 </td>
//                                 <td>
//                                   <Skeleton />
//                                 </td>
//                                 <td>
//                                   <Skeleton />
//                                 </td>
//                                 <td>
//                                   <Skeleton />
//                                 </td>
//                                 <td>
//                                   <Skeleton />
//                                 </td>
//                                 <td>
//                                   <Skeleton />
//                                 </td>
//                                 <td>
//                                   <Skeleton />
//                                 </td>
//                                 <td>
//                                   <Skeleton />
//                                 </td>
//                               </tr>
//                             ))}
//                           </>
//                         ) : TableData.length === 0 ? (
//                           <tr>
//                             <td colSpan="8" className="text-center">
//                               No data found
//                             </td>
//                           </tr>
//                         ) : (
//                           TableData.map((data, i) => (
//                             <tr key={i}>
//                               <td>
//                                 {state?.currentPage * state?.perPage -
//                                   (state?.perPage - 1) +
//                                   i}
//                                 .
//                               </td>
//                               <td>{data.name}</td>
//                               <td>{data.email}</td>
//                               <td>
//                                 +{data.countryCode} {data.phone}
//                               </td>
//                               <td>{data.username}</td>
//                               <td>
//                                 {data.countryCode === 91
//                                   ? `₹${data.Inr}`
//                                   : `$${data.Inr}`}
//                               </td>
//                               <td>
//                                 {" "}
//                                 {data.countryCode === 91
//                                   ? `₹${data.totalWithdrawal}`
//                                   : `$${data.totalWithdrawal}`}
//                               </td>

//                               <td>
//                                 <div className="form-check form-switch">
//                                   <input
//                                     className="form-check-input shadow-none"
//                                     type="checkbox"
//                                     role="switch"
//                                     id={`toggle-${data._id}`}
//                                     checked={data.isBlock == false}
//                                     onChange={() =>
//                                       handleToggleActive(data._id, data.isBlock)
//                                     }
//                                   />
//                                   {/* <label
//                                   className="form-check-label"
//                                   htmlFor={`toggle-${data._id}`}
//                                 >
//                                   {data.isActive == true
//                                     ? "Active"
//                                     : "Inactive"}
//                                 </label> */}
//                                 </div>
//                               </td>
//                               <td>
//                                 <span
//                                   className={
//                                     data.isActive ? "unblock" : "block"
//                                   }
//                                 >
//                                   {data.isActive ? "Active" : "Inactive"}
//                                 </span>
//                               </td>

//                               <td>
//                                 <button
//                                   className="bg-transparent border-0"
//                                   style={{ cursor: "pointer" }}
//                                   data-bs-toggle="modal"
//                                   data-bs-target="#editModal"
//                                   onClick={() => handleUserView(data._id)}
//                                 >
//                                   <img
//                                     src="/images/icons/show.svg"
//                                     alt="icon"
//                                     title="View User"
//                                   />
//                                 </button>
//                               </td>
//                               <td>
//                                 <button
//                                   className="bg-transparent border-0"
//                                   style={{ cursor: "pointer" }}
//                                   data-bs-toggle="modal"
//                                   data-bs-target="#referrerDetailsModal"
//                                   onClick={() =>
//                                     handleUserView(data.referenceUserId)
//                                   }
//                                 >
//                                   <img
//                                     src="/images/icons/show.svg"
//                                     alt="icon"
//                                     title="View Referrer User"
//                                   />
//                                 </button>
//                               </td>
//                               <td>
//                                 <button
//                                   className="btn_send rounded px-3 py-1 pb-2"
//                                   onClick={() =>
//                                     !data.isBlock && handleCheck(data?._id)
//                                   }
//                                   title="Send Transaction"
//                                   disabled={data.isBlock}
//                                 >
//                                   <svg
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     height="18"
//                                     fill="#eb660f"
//                                     viewBox="0 0 512 512"
//                                   >
//                                     {" "}
//                                     <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480l0-83.6c0-4 1.5-7.8 4.2-10.8L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
//                                   </svg>
//                                 </button>
//                                 <span>
//                                   {/* <svg xmlns="http://www.w3.org/2000/svg" height="22" fill="#eb660f" viewBox="0 0 512 512"><path d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376l0 103.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z"/></svg> */}
//                                 </span>
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
//                     currentPage={state?.currentPage}
//                     totalPages={
//                       Math.ceil(
//                         getUser?.data?.pagination?.total / state?.perPage
//                       ) || 1
//                     }
//                     onPageChange={handlePageChange}
//                   />
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* View User Modal */}
//           <div
//             className="modal fade common__modal"
//             id="editModal"
//             tabIndex="-1"
//             aria-labelledby="editModalLabel"
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
//                   ></button>
//                 </div>
//                 <div className="modal-body pt-0 px-4">
//                   <h1 className="modal-title mb-4" id="editModalLabel">
//                     User Details
//                   </h1>
//                   {state.selectedUserId && !isUserLoading && viewUser && (
//                     <div className="user-details">
//                       <div className="row">
//                         <div className="col-md-6 mb-3">
//                           <div className="form__box">
//                             <label htmlFor="">Name</label>
//                             <input
//                               type="text"
//                               autoComplete="off"
//                               className="form-control shadow-none"
//                               value={viewUser?.data?.name}
//                               readOnly
//                             />
//                           </div>
//                         </div>
//                         <div className="col-md-6 mb-3">
//                           <div className="form__box">
//                             <label htmlFor="">User ID</label>
//                             <input
//                               type="text"
//                               autoComplete="off"
//                               className="form-control shadow-none"
//                               value={viewUser?.data?.username}
//                               readOnly
//                             />
//                           </div>
//                         </div>
//                         <div className="col-md-6 mb-3">
//                           <div className="form__box">
//                             <label htmlFor="">Email</label>
//                             <input
//                               type="text"
//                               autoComplete="off"
//                               className="form-control shadow-none"
//                               value={viewUser?.data?.email}
//                               readOnly
//                             />
//                           </div>
//                         </div>

//                         <div className="col-md-6 mb-3">
//                           <div className="form__box">
//                             <label htmlFor="">Phone</label>
//                             <input
//                               type="text"
//                               autoComplete="off"
//                               className="form-control shadow-none"
//                               value={`+${viewUser?.data?.countryCode} ${viewUser?.data?.phone}`}
//                               readOnly
//                             />
//                           </div>
//                         </div>

//                         <div className="col-md-6 mb-3">
//                           <div className="form__box">
//                             <label htmlFor="">Referral Amount</label>
//                             <input
//                               type="text"
//                               autoComplete="off"
//                               className="form-control shadow-none"
//                               //value={viewUser?.data?.referenceInr.toFixed(2)}
//                               value={
//                                 viewUser?.data?.countryCode === 91
//                                   ? `₹${viewUser?.data?.referenceInr.toFixed(
//                                       2
//                                     )}`
//                                   : `$${viewUser?.data?.referenceInr.toFixed(
//                                       2
//                                     )}`
//                               }
//                               readOnly
//                             />
//                           </div>
//                         </div>

//                         {/* <div className="col-md-6 mb-3">
//                           <div className="form__box">
//                             <label htmlFor="">Inr</label>
//                             <input
//                               type="text"
//                               className="form-control shadow-none"
//                               value={viewUser?.data?.Inr.toFixed(2)}
//                               readOnly
//                             />
//                           </div>
//                         </div> */}

//                         <div className="col-md-6 mb-3">
//                           <div className="form__box">
//                             <label htmlFor="">Referrer ID</label>
//                             <input
//                               type="text"
//                               autoComplete="off"
//                               className="form-control shadow-none"
//                               value={viewUser?.data?.referenceId}
//                               readOnly
//                             />
//                           </div>
//                         </div>

//                         <div className="col-md-6 mb-3">
//                           <div className="form__box">
//                             <label htmlFor="">Tokens</label>
//                             <input
//                               type="text"
//                               autoComplete="off"
//                               className="form-control shadow-none"
//                               value={viewUser?.data?.tokens}
//                               readOnly
//                             />
//                           </div>
//                         </div>

//                         <div className="col-md-6 mb-3">
//                           <div className="form__box">
//                             <label htmlFor="">Referral Count</label>
//                             <input
//                               type="text"
//                               autoComplete="off"
//                               className="form-control shadow-none"
//                               value={viewUser?.data?.referenceCount}
//                               readOnly
//                             />
//                           </div>
//                         </div>

//                         <div className="col-md-6 mb-3">
//                           <div className="form__box">
//                             <label htmlFor="">Status</label>
//                             <input
//                               type="text"
//                               autoComplete="off"
//                               className="form-control shadow-none"
//                               value={
//                                 viewUser?.data?.isActive ? "Active" : "Inactive"
//                               }
//                               readOnly
//                             />
//                           </div>
//                         </div>

//                         <div className="col-md-6 mb-3">
//                           <div className="form__box">
//                             <label htmlFor="">Created On</label>
//                             <input
//                               type="text"
//                               autoComplete="off"
//                               className="form-control shadow-none"
//                               value={formatDateWithAmPm(
//                                 viewUser?.data?.createdAt
//                               )}
//                               readOnly
//                             />
//                           </div>
//                         </div>
//                         <div className="col-md-6 mb-3">
//                           <div className="form__box">
//                             <label htmlFor="">Wallet Amount</label>
//                             <input
//                               type="text"
//                               autoComplete="off"
//                               className="form-control shadow-none"
//                               value={
//                                 viewUser?.data?.countryCode === 91
//                                   ? `₹${viewUser?.data?.walletBalance.toFixed(
//                                       2
//                                     )}`
//                                   : `$${viewUser?.data?.walletBalance.toFixed(
//                                       2
//                                     )}`
//                               }
//                               // value={viewUser?.data?.walletBalance}
//                               readOnly
//                             />
//                           </div>
//                         </div>

//                         <div className="col-md-6 mb-3">
//                           <div className="form__box">
//                             <label htmlFor="">Verified</label>
//                             <input
//                               type="text"
//                               autoComplete="off"
//                               className="form-control shadow-none"
//                               value={
//                                 viewUser?.data?.isVerified
//                                   ? "Verified"
//                                   : "Not Verified"
//                               }
//                               readOnly
//                             />
//                           </div>
//                         </div>
//                         <div className="col-md-6 mb-3">
//                           <div className="form__box">
//                             <label htmlFor="">KYC Status</label>
//                             <input
//                               type="text"
//                               autoComplete="off"
//                               className="form-control shadow-none"
//                               value={
//                                 viewUser?.data?.kycStatus === "open"
//                                   ? "In Open"
//                                   : viewUser?.data?.kycStatus === "approve"
//                                   ? "Approved"
//                                   : viewUser?.data?.kycStatus === "inprogress"
//                                   ? "In Progress"
//                                   : viewUser?.data?.kycStatus === "reject"
//                                   ? "Rejected"
//                                   : "N/A"
//                               }
//                               readOnly
//                             />
//                           </div>
//                         </div>
//                       </div>
//                       <div className="text-center my-4">
//                         <button
//                           type="button"
//                           className="btn btn-secondary  px-3"
//                           data-bs-dismiss="modal"
//                         >
//                           Close
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                   {isUserLoading && <Skeleton count={5} />}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* View Referral User Modal */}
//           <div
//             className="modal fade common__modal"
//             id="referrerDetailsModal"
//             tabIndex="-1"
//             aria-labelledby="editModalLabel"
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
//                   ></button>
//                 </div>
//                 <div className="modal-body pt-0 px-4">
//                   <h1 className="modal-title mb-4" id="editModalLabel">
//                     Referrer User Details
//                   </h1>
//                   {state.selectedUserId && !isUserLoading && viewUser && (
//                     <div className="user-details">
//                       <div className="row">
//                         <div className="col-md-6 mb-3">
//                           <div className="form__box">
//                             <label htmlFor="">Name</label>
//                             <input
//                               type="text"
//                               autoComplete="off"
//                               className="form-control shadow-none"
//                               value={viewUser?.data?.name}
//                               readOnly
//                             />
//                           </div>
//                         </div>
//                         <div className="col-md-6 mb-3">
//                           <div className="form__box">
//                             <label htmlFor="">User ID</label>
//                             <input
//                               type="text"
//                               autoComplete="off"
//                               className="form-control shadow-none"
//                               value={viewUser?.data?.username}
//                               readOnly
//                             />
//                           </div>
//                         </div>
//                         <div className="col-md-6 mb-3">
//                           <div className="form__box">
//                             <label htmlFor="">Email</label>
//                             <input
//                               type="text"
//                               autoComplete="off"
//                               className="form-control shadow-none"
//                               value={viewUser?.data?.email}
//                               readOnly
//                             />
//                           </div>
//                         </div>

//                         <div className="col-md-6 mb-3">
//                           <div className="form__box">
//                             <label htmlFor="">Phone</label>
//                             <input
//                               type="text"
//                               autoComplete="off"
//                               className="form-control shadow-none"
//                               value={`+${viewUser?.data?.countryCode} ${viewUser?.data?.phone}`}
//                               readOnly
//                             />
//                           </div>
//                         </div>

//                         <div className="col-md-6 mb-3">
//                           <div className="form__box">
//                             <label htmlFor="">Referral Amount</label>
//                             <input
//                               type="text"
//                               autoComplete="off"
//                               className="form-control shadow-none"
//                               //value={viewUser?.data?.referenceInr.toFixed(2)}
//                               value={
//                                 viewUser?.data?.countryCode === 91
//                                   ? `₹${viewUser?.data?.referenceInr.toFixed(
//                                       2
//                                     )}`
//                                   : `$${viewUser?.data?.referenceInr.toFixed(
//                                       2
//                                     )}`
//                               }
//                               readOnly
//                             />
//                           </div>
//                         </div>

//                         {/* <div className="col-md-6 mb-3">
//                           <div className="form__box">
//                             <label htmlFor="">Inr</label>
//                             <input
//                               type="text"
//                               className="form-control shadow-none"
//                               value={viewUser?.data?.Inr.toFixed(2)}
//                               readOnly
//                             />
//                           </div>
//                         </div> */}

//                         <div className="col-md-6 mb-3">
//                           <div className="form__box">
//                             <label htmlFor="">Referrer ID</label>
//                             <input
//                               type="text"
//                               autoComplete="off"
//                               className="form-control shadow-none"
//                               value={viewUser?.data?.referenceId}
//                               readOnly
//                             />
//                           </div>
//                         </div>

//                         <div className="col-md-6 mb-3">
//                           <div className="form__box">
//                             <label htmlFor="">Tokens</label>
//                             <input
//                               type="text"
//                               autoComplete="off"
//                               className="form-control shadow-none"
//                               value={viewUser?.data?.tokens}
//                               readOnly
//                             />
//                           </div>
//                         </div>

//                         <div className="col-md-6 mb-3">
//                           <div className="form__box">
//                             <label htmlFor="">Referral Count</label>
//                             <input
//                               type="text"
//                               autoComplete="off"
//                               className="form-control shadow-none"
//                               value={viewUser?.data?.referenceCount}
//                               readOnly
//                             />
//                           </div>
//                         </div>

//                         <div className="col-md-6 mb-3">
//                           <div className="form__box">
//                             <label htmlFor="">Status</label>
//                             <input
//                               type="text"
//                               autoComplete="off"
//                               className="form-control shadow-none"
//                               value={
//                                 viewUser?.data?.isActive ? "Active" : "Inactive"
//                               }
//                               readOnly
//                             />
//                           </div>
//                         </div>

//                         <div className="col-md-6 mb-3">
//                           <div className="form__box">
//                             <label htmlFor="">Created On</label>
//                             <input
//                               type="text"
//                               autoComplete="off"
//                               className="form-control shadow-none"
//                               value={formatDateWithAmPm(
//                                 viewUser?.data?.createdAt
//                               )}
//                               readOnly
//                             />
//                           </div>
//                         </div>
//                         <div className="col-md-6 mb-3">
//                           <div className="form__box">
//                             <label htmlFor="">Wallet Amount</label>
//                             <input
//                               type="text"
//                               autoComplete="off"
//                               className="form-control shadow-none"
//                               value={
//                                 viewUser?.data?.countryCode === 91
//                                   ? `₹${viewUser?.data?.walletBalance.toFixed(
//                                       2
//                                     )}`
//                                   : `$${viewUser?.data?.walletBalance.toFixed(
//                                       2
//                                     )}`
//                               }
//                               // value={viewUser?.data?.walletBalance}
//                               readOnly
//                             />
//                           </div>
//                         </div>

//                         <div className="col-md-6 mb-3">
//                           <div className="form__box">
//                             <label htmlFor="">Verified</label>
//                             <input
//                               type="text"
//                               autoComplete="off"
//                               className="form-control shadow-none"
//                               value={
//                                 viewUser?.data?.isVerified
//                                   ? "Verified"
//                                   : "Not Verified"
//                               }
//                               readOnly
//                             />
//                           </div>
//                         </div>
//                         <div className="col-md-6 mb-3">
//                           <div className="form__box">
//                             <label htmlFor="">KYC Status</label>
//                             <input
//                               type="text"
//                               autoComplete="off"
//                               className="form-control shadow-none"
//                               value={
//                                 viewUser?.data?.kycStatus === "open"
//                                   ? "In Open"
//                                   : viewUser?.data?.kycStatus === "approve"
//                                   ? "Approved"
//                                   : viewUser?.data?.kycStatus === "inprogress"
//                                   ? "In Progress"
//                                   : viewUser?.data?.kycStatus === "reject"
//                                   ? "Rejected"
//                                   : "N/A"
//                               }
//                               readOnly
//                             />
//                           </div>
//                         </div>
//                       </div>
//                       <div className="text-center my-4">
//                         <button
//                           type="button"
//                           className="btn btn-secondary  px-3"
//                           data-bs-dismiss="modal"
//                         >
//                           Close
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                   {isUserLoading && <Skeleton count={5} />}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//       </DashboardLayout>

//       {/* // <!-- Modal --> */}

//       <Modals
//         check1={check1}
//         setCheck1={setCheck1}
//         handleTransactionSubmit={handleTransactionSubmit}
//       />
//     </>
//   );
// };

// export default UserManagement;



import React, { useState, useEffect, useContext } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Pagination from "../../components/Pagination";
import DashboardLayout from "../../Layout/DashboardLayout";
import { useGetUserQuery, useApproveRejectApplicationMutation } from "./userApiSlice";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import { StateContext } from "../../context/StateContext";

const UserManagement = () => {
  const { amount, setAmount, transaction_type, setTransactionType } =
    useContext(StateContext);

  const [refresh, setRefresh] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [check1, setCheck1] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);

  // Pagination state
  const [state, setState] = useState({
    currentPage: 1,
    perPage: 10,
    search: "",
  });

  const queryParams = `limit=${state.perPage}&page=${state.currentPage}&search=${state.search}`;

  const { data: getUser, isLoading, refetch } = useGetUserQuery(queryParams);
  const [approveRejectApplication, { isLoading: isUpdating }] = useApproveRejectApplicationMutation();

  const TableData = getUser?.data?.data || [];
  const totalMembers = TableData.length || 0;
  const blockedUser = TableData.filter(user => user.isBlock).length || 0;
  const activeMembers = TableData.filter(user => user.isActive).length || 0;

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

  // Handle user view
  const handleUserView = (user) => {
    setSelectedUserId(user._id);
    setSelectedUserData(user);
  };

  // Handle action button click (Approve/Reject)
  const handleActionClick = (user) => {
    setSelectedUserId(user._id);
    setSelectedUserData(user);
    setShowActionModal(true);
  };

  // Handle approve or reject
  const handleApproveReject = async (action) => {
    try {
      const response = await approveRejectApplication({
        id: selectedUserId,
        action: action, // 'approve' or 'reject'
      }).unwrap();

      toast.success(
        `Application ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
        { position: "top-center" }
      );

      setShowActionModal(false);
      setSelectedUserId(null);
      setSelectedUserData(null);
      refetch();
    } catch (error) {
      console.error("Action failed:", error);
      toast.error(error?.data?.message || `Failed to ${action} application`);
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
      // Add your transaction API call here
      toast.success("Transaction sent successfully", {
        position: "top-center",
      });
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

  return (
    <>
      <DashboardLayout>
        <section className="profile_section user__management py-4">
          <div className="container-fluid">
            <div className="row">
              {/* Total Members Card */}
              <div className="col-12 col-sm-6 col-md-6 col-xl-5 col-xxl-4">
                <div className="my_total_team_data mb-4 rounded-3 px-3 py-3 py-md-4">
                  <div className="total_user_card d-flex align-items-center gap-2 gap-md-3">
                    <div className="total_user_images rounded-3 p-2 p-md-4">
                      <img
                        src="/images/total-member.png"
                        alt="total-member"
                        className="img-fluid"
                      />
                    </div>
                    <div className="total_user_card_data">
                      <h2>{totalMembers}</h2>
                      <h5>Total Applications</h5>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Blocked Card */}
              <div className="col-12 col-sm-6 col-md-6 col-xl-5 col-xxl-4">
                <div className="my_total_team_data mb-4 rounded-3 px-3 py-3 py-md-4">
                  <div className="total_user_card d-flex align-items-center gap-2 gap-md-3">
                    <div className="total_user_images rounded-3 p-2 p-md-4">
                      <img
                        src="/images/total-member.png"
                        alt="total-member"
                        className="img-fluid"
                      />
                    </div>
                    <div className="total_user_card_data">
                      <h2>{blockedUser}</h2>
                      <h5>Total Blocked</h5>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Active Members Card */}
              <div className="col-12 col-sm-6 col-md-6 col-xl-5 col-xxl-4">
                <div className="my_total_team_data mb-4 rounded-3 px-3 py-3 py-md-4">
                  <div className="total_user_card d-flex align-items-center gap-2 gap-md-3">
                    <div className="total_user_images rounded-3 p-2 p-md-4">
                      <img
                        src="/images/total-member.png"
                        alt="total-member"
                        className="img-fluid"
                      />
                    </div>
                    <div className="total_user_card_data">
                      <h2>{activeMembers}</h2>
                      <h5>Total Active</h5>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Table */}
              <div className="col-12">
                <div className="my_total_team_data rounded-3 px-3 py-4">
                  <h1 className="mb-3">Mentor Applications</h1>
                  <div className="row justify-content-between">
                    {/* Items per page selector */}
                    <div className="col-12 col-sm-6 col-md-2 col-xxl-1">
                      <div className="pagination__box mb-4">
                        <div className="showing_data">
                          <select
                            className="form-select shadow-none"
                            aria-label="Default select example"
                            onChange={(e) =>
                              setState({
                                ...state,
                                perPage: e.target.value,
                                currentPage: 1,
                              })
                            }
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
                          <th scope="col">View Details</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          <>
                            {[...Array(10)].map((e, i) => (
                              <tr key={i}>
                                {[...Array(11)].map((_, j) => (
                                  <td key={j}>
                                    <Skeleton />
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </>
                        ) : TableData.length === 0 ? (
                          <tr>
                            <td colSpan="11" className="text-center">
                              No data found
                            </td>
                          </tr>
                        ) : (
                          TableData.map((data, i) => (
                            <tr key={data._id}>
                              <td>
                                {state.currentPage * state.perPage -
                                  (state.perPage - 1) +
                                  i}
                                .
                              </td>
                              <td>{data.fullName}</td>
                              <td>{data.email}</td>
                              <td>{data.phone}</td>
                              <td>{data.location}</td>
                              <td>{data.currentRole}</td>
                              <td>{data.companyName}</td>
                              <td>{data.mentorCategory}</td>
                              <td>
                                <span
                                  className={
                                    data.isActive ? "unblock" : "block"
                                  }
                                >
                                  {data.isActive ? "Active" : "Inactive"}
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
                                  <img
                                    src="/images/icons/show.svg"
                                    alt="icon"
                                    title="View Details"
                                  />
                                </button>
                              </td>
                              <td>
                                <button
                                  className="btn_send rounded px-3 py-1 pb-2"
                                  onClick={() => handleActionClick(data)}
                                  title="Approve/Reject"
                                  data-bs-toggle="modal"
                                  data-bs-target="#actionModal"
                                  disabled={data.status === 'approved' || data.status === 'rejected'}
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

          {/* View Details Modal */}
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
                  ></button>
                </div>
                <div className="modal-body pt-0 px-4">
                  <h1 className="modal-title mb-4" id="detailsModalLabel">
                    Application Details
                  </h1>
                  {selectedUserData && (
                    <div className="user-details">
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <div className="form__box">
                            <label>Full Name</label>
                            <input
                              type="text"
                              autoComplete="off"
                              className="form-control shadow-none"
                              value={selectedUserData.fullName}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="form__box">
                            <label>Email</label>
                            <input
                              type="text"
                              autoComplete="off"
                              className="form-control shadow-none"
                              value={selectedUserData.email}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="form__box">
                            <label>Phone</label>
                            <input
                              type="text"
                              autoComplete="off"
                              className="form-control shadow-none"
                              value={selectedUserData.phone}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="form__box">
                            <label>Date of Birth</label>
                            <input
                              type="text"
                              autoComplete="off"
                              className="form-control shadow-none"
                              value={formatDateWithAmPm(selectedUserData.dateOfBirth)}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="form__box">
                            <label>Location</label>
                            <input
                              type="text"
                              autoComplete="off"
                              className="form-control shadow-none"
                              value={selectedUserData.location}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="form__box">
                            <label>Current Role</label>
                            <input
                              type="text"
                              autoComplete="off"
                              className="form-control shadow-none"
                              value={selectedUserData.currentRole}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="form__box">
                            <label>Company Name</label>
                            <input
                              type="text"
                              autoComplete="off"
                              className="form-control shadow-none"
                              value={selectedUserData.companyName}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="form__box">
                            <label>Years of Experience</label>
                            <input
                              type="text"
                              autoComplete="off"
                              className="form-control shadow-none"
                              value={selectedUserData.yearsOfExperience}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="form__box">
                            <label>Mentor Category</label>
                            <input
                              type="text"
                              autoComplete="off"
                              className="form-control shadow-none"
                              value={selectedUserData.mentorCategory}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="form__box">
                            <label>Mentoring Style</label>
                            <input
                              type="text"
                              autoComplete="off"
                              className="form-control shadow-none"
                              value={selectedUserData.mentoringStyle}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="form__box">
                            <label>Mentoring Frequency</label>
                            <input
                              type="text"
                              autoComplete="off"
                              className="form-control shadow-none"
                              value={selectedUserData.mentoringFrequency}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="form__box">
                            <label>Hourly Rate</label>
                            <input
                              type="text"
                              autoComplete="off"
                              className="form-control shadow-none"
                              value={`₹${selectedUserData.hourlyRate}`}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="form__box">
                            <label>Languages</label>
                            <input
                              type="text"
                              autoComplete="off"
                              className="form-control shadow-none"
                              value={selectedUserData.languages?.join(", ")}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="form__box">
                            <label>LinkedIn URL</label>
                            <input
                              type="text"
                              autoComplete="off"
                              className="form-control shadow-none"
                              value={selectedUserData.linkedinUrl}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-md-12 mb-3">
                          <div className="form__box">
                            <label>Areas of Interest</label>
                            <input
                              type="text"
                              autoComplete="off"
                              className="form-control shadow-none"
                              value={selectedUserData.areasOfInterest}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-md-12 mb-3">
                          <div className="form__box">
                            <label>Motivation Statement</label>
                            <textarea
                              className="form-control shadow-none"
                              rows="3"
                              value={selectedUserData.motivationStatement}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="form__box">
                            <label>Status</label>
                            <input
                              type="text"
                              autoComplete="off"
                              className="form-control shadow-none"
                              value={
                                selectedUserData.isActive ? "Active" : "Inactive"
                              }
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

          {/* Approve/Reject Action Modal */}
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
                  ></button>
                </div>
                <div className="modal-body pt-0 px-4">
                  <h1 className="modal-title mb-4 text-center" id="actionModalLabel">
                    Application Action
                  </h1>
                  {selectedUserData && (
                    <div className="action-content text-center">
                      <p className="mb-4">
                        Select an action for <strong>{selectedUserData.fullName}</strong>'s application
                      </p>
                      <div className="d-flex gap-3 justify-content-center">
                        <button
                          type="button"
                          className="btn btn-success px-4"
                          onClick={() => handleApproveReject('approve')}
                          disabled={isUpdating}
                          data-bs-dismiss="modal"
                        >
                          {isUpdating ? "Processing..." : "Approve"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger px-4"
                          onClick={() => handleApproveReject('reject')}
                          disabled={isUpdating}
                          data-bs-dismiss="modal"
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








