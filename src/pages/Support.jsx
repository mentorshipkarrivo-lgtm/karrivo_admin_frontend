// import React, { useState, useEffect } from "react";
// import DashboardLayout from "../Layout/DashboardLayout";
// import { Icon } from "@iconify/react/dist/iconify.js";
// import Pagination from "../components/Pagination";
// import { Link, useNavigate } from "react-router-dom";
// import SupportModal from "../components/Modals";
// import { Button, Modal } from "react-bootstrap";
// import { useSupportDataQuery } from "../features/support/supportApiSlice";
// // import { useEditStatusMutation } from "../features/support/supportApiSlice";
// import Form from "react-bootstrap/Form";
// import { ClipLoader } from "react-spinners";
// import { toast } from "react-toastify";

// const Support = () => {
//   const [show, setShow] = useState(false);
//   const handleClose = () => setShow(false);
//   const navigate = useNavigate();

//   const [deleteModal, setDeleteModal] = useState(false);
//   const handleDeleteClose = () => setDeleteModal(false);
//   const handleDelete = () => setDeleteModal(true);

//   const [state, setState] = useState({
//     currentPage: 1,
//     perPage: 10,
//     search: "",
//   });
//   const [id, setId] = useState("");
//   const [status, setStatus] = useState("");

//   const queryParams = `limit=${state?.perPage || ""}&page=${
//     state?.currentPage || ""
//   }&searchParam=${state?.search || ""}`;

//   const {
//     data: supportData,
//     error,
//     isLoading,
//     refetch,
//   } = useSupportDataQuery(queryParams);
//   const TableData = supportData?.data?.response || [];

//   const handlePageChange = (e) => {
//     setState({ ...state, currentPage: e });
//   };

//   // const [editStatus, { data: result, isLoading: isEditing }] =
//   //   useEditStatusMutation();

//   const handleShow = (id) => {
//     setId(id);
//     setShow(true);
//   };

//   const handleEditStatus = async (id, newStatus) => {
//     const values = {
//       id: id,
//       status: newStatus,
//     };

//     try {
//       const response = await editStatus(values);
//       if (response?.data?.status_code == 200) {
//         setShow(false);
//         toast.success(response?.data?.message, {
//           position: "top-center",
//         });
//       }
//     } catch (error) {
//       console.error("Failed to update status", error);
//       toast.error(error.message, {
//         position: "top-center",
//       });
//     }
//   };
//   const capitalizeFirstLetter = (str) => {
//     if (!str) return ""; // Handle empty strings or undefined
//     return str.charAt(0).toUpperCase() + str.slice(1);
//   };
//   useEffect(() => {
//     refetch();
//   }, []);
//   return (
//     <DashboardLayout>
//       <section className="profile_section py-4">
//         <div className="container-fluid">
//           <div className="row">
//             <div className="col-12">
//               <div className="my_total_team_data rounded-3 px-3 py-4">
//                 <h1 className="mb-3">Support</h1>
//                 <div className="row justify-content-between">
//                   <div className="col-12 col-sm-6 col-md-2 col-xxl-1">
//                     <div className="pagination__box mb-4">
//                       <div className="showing_data">
//                         <select
//                           className="form-select shadow-none"
//                           aria-label="Default select example"
//                           onChange={(e) =>
//                             setState({ ...state, perPage: e.target.value })
//                           }
//                         >
//                           <option value="10">10</option>
//                           <option value="30">30</option>
//                           <option value="50">50</option>
//                         </select>
//                       </div>
//                     </div>
//                   </div>
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
//                           placeholder="Search"
//                           aria-label="Username"
//                           aria-describedby="basic-addon1"
//                           onChange={(e) =>
//                             setState({ ...state, search: e.target.value })
//                           }
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="table_data table-responsive">
//                   {isLoading ? (
//                     <div className="text-center">
//                       <ClipLoader
//                         size={50}
//                         color={"#123abc"}
//                         loading={isLoading}
//                       />
//                     </div>
//                   ) : (
//                     <table className="table mb-0">
//                       <thead>
//                         <tr>
//                           <th scope="col">S.No</th>
//                           <th scope="col">User ID</th>
//                           <th scope="col">Name</th>
//                           <th scope="col">Email</th>
//                           <th scope="col">Status</th>
//                           <th scope="col">Action</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {TableData.length > 0 ? (
//                           TableData.map((data, i) => (
//                             <tr key={i}>
//                               <td>
//                                 {state?.currentPage * state?.perPage -
//                                   (state?.perPage - 1) +
//                                   i}
//                               </td>
//                               <td>{data._id ? data?._id : "N/A"}</td>
//                               <td>
//                                 {data.author_name ? data?.author_name : "N/A"}
//                               </td>
//                               <td>
//                                 {data.author_email ? data.author_email : "N/A"}
//                               </td>
//                               <td
//                                 className={`${
//                                   data.status === "open"
//                                     ? "statusGree"
//                                     : data.status === "close"
//                                     ? "statusRed"
//                                     : "statusWarring"
//                                 }`}
//                               >
//                                 {capitalizeFirstLetter(
//                                   data.status ? data.status : "N/A"
//                                 )}
//                                 {/* data.status ? data.status : "N/A" */}
//                               </td>
//                               <td>
//                                 <div className="action_data">
//                                   <button
//                                     onClick={() =>
//                                       navigate(`/support-chart/${data._id}`)
//                                     }
//                                     className="bg-transparent border-0 pe-2"
//                                     title="View Ticket"
//                                   >
//                                     <Icon
//                                       icon="carbon:view-filled"
//                                       width="25"
//                                       height="25"
//                                       style={{ color: "var(--green)" }}
//                                     />
//                                   </button>
//                                   <button
//                                     className="bg-transparent border-0 me-3"
//                                     title="Edit Ticket"
//                                   >
//                                     <Button
//                                       variant="bg-transparent"
//                                       onClick={() => handleShow(data?._id)}
//                                     >
//                                       <img src="./images/edit.png" alt="edit" />
//                                     </Button>
//                                   </button>
//                                 </div>
//                               </td>
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td colSpan="6" className="text-center">
//                               No records found
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   )}
//                 </div>
//               </div>
//               <Pagination
//                 currentPage={state?.currentPage}
//                 totalPages={
//                   supportData
//                     ? Math.ceil(supportData?.data?.totalCount / state?.perPage)
//                     : 1
//                 }
//                 onPageChange={handlePageChange}
//               />
//             </div>
//           </div>
//         </div>
//       </section>
//       {/* DELETE MODAL */}
//       <Modal
//         className="support_modal"
//         show={deleteModal}
//         centered
//         onHide={handleDeleteClose}
//       >
//         <Modal.Header className="border-0 justify-content-center">
//           <Modal.Title className="text-center">
//             Are You Sure You Want To Delete
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Footer className="border-0 flex-nowrap justify-content-center gap-5">
//           <Button
//             className="m-0 no_btns px-5 rounded-1"
//             onClick={handleDeleteClose}
//           >
//             No
//           </Button>
//           <div className="submit_btn text-center">
//             <Button className="btns border-0 px-5" onClick={handleDeleteClose}>
//               Yes
//             </Button>
//           </div>
//         </Modal.Footer>
//       </Modal>

//       {/* EDIT MODAL */}
//       <Modal show={show} onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>Edit Status</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="select_input">
//             <Form.Select
//               aria-label="Default select example"
//               onChange={(e) => setStatus(e.target.value)}
//             >
//               <option value="">Select</option>
//               <option value="inprogress">In Progress</option>
//               <option value="open">Open</option>
//               <option value="closed">Closed</option>
//             </Form.Select>
//           </div>
//         </Modal.Body>
//         <Modal.Footer className="me-auto">
//           <Button variant="secondary" onClick={handleClose}>
//             Close
//           </Button>
//           <Button
//             variant="primary"
//             onClick={() => handleEditStatus(id, status)}
//           >
//             Save
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </DashboardLayout>
//   );
// };

// export default Support;
