// import React, { useCallback, useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import {
//   useChatGetQuery,
//   useCreateCommentMutation,
// } from "../features/support/supportApiSlice";
// import DashboardLayout from "../Layout/DashboardLayout";

// const SupportChart = () => {
//   let imageUrl = import.meta.env.VITE_IMAGE_URL;

//   const { id } = useParams();
//   const { data, isLoading, error } = useChatGetQuery(id);
//   const [createComment] = useCreateCommentMutation();
//   const [displayImage, setDisplayImage] = useState("");
//   const [isViewerOpen, setIsViewerOpen] = useState(false);
//   const [clickedImage, setClickedImage] = useState("");

//   const openImageViewer = useCallback((i) => {
//     console.log({ i });
//     setClickedImage([i.image]);
//     setIsViewerOpen(true);
//   }, []);
//   const chartData = data;

//   const [state, setState] = useState({
//     comment: "",
//     image: null,
//   });

//   /**
//    * This method is used to send the comment
//    * @return {*}
//    */
//   const sendComment = async () => {
//     if (state?.comment == "") {
//       return toast?.error("Please enter a message");
//     }
//     const formData = new FormData();
//     formData.append("comment", state.comment);
//     if (state?.image) {
//       formData.append("image", state.image);
//     }
//     formData.append("ticket_id", id);

//     try {
//       const response = await createComment(formData);
//       if (response?.data?.status_code == 200) {
//         setState({
//           comment: "",
//           image: null,
//         });
//         setDisplayImage("");
//       } else {
//         toast.error(response?.error?.data?.message, {
//           position: "top-center",
//         });
//         setState({
//           comment: "",
//           image: null,
//         });
//         setDisplayImage("");
//       }
//     } catch (error) {
//       if (error.response.status >= 400 && error.response.status <= 500) {
//         toast.error(error.response.data.message, {
//           position: "top-center",
//         });
//       }
//     }
//   };

//   /**
//    * This method is used to upload the file
//    */
//   const handleUpload = () => {
//     let input = document.createElement("input");
//     input.type = "file";
//     input.onchange = (_) => {
//       let files = Array.from(input.files);
//       if (files) {
//         const acceptedFormats = ["image/png", "image/jpeg", "image/jpg"];
//         const invalidFile = !acceptedFormats.includes(files[0].type);
//         if (invalidFile) {
//           toast.warning("Only JPG / PNG files are allowed", {
//             position: "top-center",
//           });
//           return;
//         }
//       }
//       const showImage = URL.createObjectURL(files[0]);
//       setDisplayImage(showImage);
//       setState({ ...state, image: files[0] });
//     };

//     input.click();
//   };

//   /**
//    * This method is used to clear the uploaded file
//    */
//   const clearImage = () => {
//     setDisplayImage("");
//   };

//   /**
//    * This method is used to scroll the chat to bottom
//    */
//   const scrollToBottom = () => {
//     const chatBox = document.getElementById("chat_scroll");
//     if (chatBox) {
//       chatBox.scrollTop = chatBox.scrollHeight;
//     }
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [chartData]);

//   /**
//    * This method is used to format to IST
//    * @param {*} isoString
//    * @return {*}
//    */
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

//   return (
//     <>
//       <DashboardLayout>
//         <section className="profile_section text-white">
//           <div className="container-fluid">
//             <div className="row justify-content-center gap-5">
//               <Link
//                 to="/support"
//                 style={{
//                   textDecoration: "none",
//                   fontSize: "18px",
//                   color: "Orange",
//                 }}
//                 className="mb-4 back_arrow"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   style={{ fill: "rgba(235, 102, 15, 1)" }}
//                 >
//                   <path d="M12.707 17.293 8.414 13H18v-2H8.414l4.293-4.293-1.414-1.414L4.586 12l6.707 6.707z"></path>
//                 </svg>{" "}
//                 {/* Back */}
//               </Link>

//               <div className="col-12 col-md-7 col-xl-5 col-xxl-5 pb-3">
//                 <div className="support_chart_main_box rounded-top-3 px-3 pb-1 py-4">
//                   <h3 className="text-white pb-2">Chat Support</h3>
//                   {/* <div className="chart_heading mb-4 d-flex flex-wrap flex-md-nowrap align-items-center justify-content-between"></div> */}
//                   <div className="chart_data chat_card">
//                     <ul
//                       className="list-unstyled admin_chart_main_data pe-1"
//                       id="chat_scroll"
//                     >
//                       {chartData?.data?.comments?.map((item, i) => {
//                         // console.log("item,,,,,,,,,,,", item);
//                         return item?.commented_by?.role == "0" ? (
//                           <li
//                             className="d-flex justify-content-end mb-4"
//                             key={`${item?._id}-${i}`}
//                           >
//                             <div className="admin_data">
//                               <div className="d-flex align-items-center justify-content-end me-1">
//                                 {" "}
//                                 <img
//                                   src={
//                                     item.commented_by.profile ||
//                                     "/images/chart-user.png"
//                                   }
//                                   style={{
//                                     height: "30px",
//                                     width: "30px",
//                                     borderRadius: "50%",
//                                   }}
//                                   alt="chart"
//                                   className="img-fluid"
//                                 />
//                                 <h6 className="mb-0 ms-1">
//                                   {" "}
//                                   {item?.commented_by?.name}{" "}
//                                 </h6>
//                               </div>
//                               <div className="charts admin_chart p-3 mt-2">
//                                 <p className="mb-0">{item.comment}</p>
//                                 {item?.image ? (
//                                   <div className="mb-0 text-end chart_imgs">
//                                     <img
//                                       // crossOrigin="anonymous"
//                                       alt="chart-images"
//                                       className="chart_img img-fluid"
//                                       key={i}
//                                       style={{ cursor: "pointer" }}
//                                       onClick={() => {
//                                         openImageViewer(item);
//                                       }}
//                                       height={100}
//                                       width={100}
//                                       data-bs-toggle="modal"
//                                       data-bs-target="#selectModal"
//                                       // src={`${item?.image}`}
//                                       src={`${item?.image}`}
//                                     />
//                                   </div>
//                                 ) : (
//                                   ""
//                                 )}
//                               </div>
//                               <p
//                                 className="ms-1 text-white text-end"
//                                 style={{ fontSize: "10px" }}
//                               >
//                                 {formatDateWithAmPm(item?.created_at)}
//                               </p>
//                             </div>
//                           </li>
//                         ) : (
//                           <li
//                             className="mb-4 d-flex align-items-end"
//                             key={`${item?._id}-${i}`}
//                           >
//                             <div className="user_chart mb-3 align-items-center gap-3">
//                               <div className="d-flex align-items-center">
//                                 {" "}
//                                 <img
//                                   src={
//                                     item.commented_by.profile ||
//                                     "/images/chart-user.png"
//                                   }
//                                   style={{
//                                     height: "30px",
//                                     width: "30px",
//                                     borderRadius: "50%",
//                                   }}
//                                   alt="chart"
//                                   className="img-fluid"
//                                 />
//                                 <h6 className="mb-0 ms-1">
//                                   {" "}
//                                   {item?.commented_by?.name}{" "}
//                                 </h6>
//                               </div>
//                               <div className="charts p-3 mt-2">
//                                 <p className="mb-0">{item?.comment}</p>
//                                 {item?.image ? (
//                                   <div className="mb-0  chart_imgs mt-2 ">
//                                     <img
//                                       className="img-fluid"
//                                       alt="chart-images"
//                                       src={`${item?.image}`}
//                                       // src={"http://192.168.11.184:3002/uploads/091GOLG.png"}
//                                       data-bs-toggle="modal"
//                                       height={100}
//                                       width={100}
//                                       data-bs-target="#selectModal"
//                                       onClick={() => {
//                                         openImageViewer(item);
//                                       }}
//                                     />
//                                   </div>
//                                 ) : (
//                                   ""
//                                 )}
//                               </div>
//                               <p
//                                 className="ms-1 text-white"
//                                 style={{ fontSize: "10px" }}
//                               >
//                                 {formatDateWithAmPm(item?.created_at)}
//                               </p>
//                             </div>
//                           </li>
//                         );
//                       })}
//                     </ul>
//                   </div>
//                 </div>
//                 <div className="chart_send_box rounded-bottom-3 d-flex align-items-center gap-2 gap-sm-3 pe-3">
//                   <input
//                     type="text"
//                     className="form-control shadow-none"
//                     id="exampleInputEmail1"
//                     aria-describedby="emailHelp"
//                     placeholder="Type your message |"
//                     value={state?.comment}
//                     onChange={(e) =>
//                       setState({ ...state, comment: e.target.value })
//                     }
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter") {
//                         sendComment();
//                       }
//                     }}
//                   />
//                   <div className="send_icons d-flex align-items-center gap-3">
//                     <Link to="#">
//                       {" "}
//                       <div>
//                         {displayImage ? (
//                           <div className="d-flex gap-1 position-relative">
//                             <img
//                               src={displayImage}
//                               alt="file"
//                               className="img-fluid my-auto "
//                               style={{
//                                 height: "27px",
//                                 width: "50px",
//                                 cursor: "pointer",
//                               }}
//                             />
//                             <div
//                               className="text-white bg-white position-absolute d-flex justify-content-center align-items-center"
//                               style={{
//                                 borderRadius: "50%",
//                                 height: "20px",
//                                 width: "20px",
//                                 top: "-10px",
//                                 left: "30px",
//                               }}
//                             >
//                               <small
//                                 className="m-0"
//                                 style={{
//                                   fontSize: "10px",
//                                   fontFamily: "Inter",
//                                   color: "#eb660f",
//                                   fontWeight: "bold",
//                                 }}
//                                 onClick={() => clearImage()}
//                               >
//                                 X
//                               </small>
//                             </div>

//                             {/*  */}
//                           </div>
//                         ) : (
//                           <img
//                             src="/images/file.png"
//                             alt="file"
//                             className="img-fluid"
//                             style={{ height: "27px", cursor: "pointer" }}
//                             onClick={() => handleUpload()}
//                           />
//                         )}
//                       </div>
//                     </Link>

//                     <Link to="#">
//                       <img
//                         src="/images/send.png"
//                         alt="send"
//                         className="img-fluid"
//                         style={{ height: "20px" }}
//                         onClick={() => sendComment()}
//                       />
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//               <div
//                 className="col-12 col-md-7 col-xl-5 col-xxl-5 user_ticket p-3 mb-3"
//                 style={{
//                   backgroundColor: "rgb(27, 35, 45)",
//                   borderRadius: "8px",
//                 }}
//               >
//                 <h3 className="text-white mb-3">Ticket Details</h3>
//                 <div className="px-3 text-white">
//                   <h6 className="mb-3 fw-bold">
//                     Name:{" "}
//                     {chartData?.data?.ticket?.author_name
//                       ? chartData.data.ticket.author_name
//                           .charAt(0)
//                           .toUpperCase() +
//                         chartData.data.ticket.author_name.slice(1).toLowerCase()
//                       : ""}
//                   </h6>
//                   <h6 className="mb-3 fw-bold">
//                     Email: {chartData?.data?.ticket.author_email}
//                   </h6>
//                   <h6 className="mb-3 text-capitalize fw-bold">
//                     Title: {chartData?.data?.ticket.title}
//                   </h6>
//                   <h6 className="mb-3 text-capitalize fw-bold">
//                     Content: {chartData?.data?.ticket.content}
//                   </h6>
//                   <h6 className="mb-3 text-capitalize fw-bold">
//                     Priority: {chartData?.data?.ticket.priority}
//                   </h6>
//                     {chartData?.data?.ticket?.image && (
//                   <div className="d-flex gap-3">
//                       <h6 className="my-auto fw-bold">Image: </h6>
//                       <img
//                         className="img-fluid"
//                         src={chartData?.data?.ticket.image}
//                         alt="user_Ticket_Image"
//                         style={{ height: "200px", width: "300px" }}
//                         onClick={() => {
//                           openImageViewer(chartData?.data?.ticket);
//                         }}
//                         data-bs-toggle="modal"
//                         data-bs-target="#selectModal"
//                       />
//                   </div>
//                     )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//       </DashboardLayout>
//       <div
//         className="modal costem_modal  fade"
//         id="selectModal"
//         tabIndex="-1"
//         aria-labelledby="exampleModalLabel"
//         aria-hidden="true"
//       >
//         <div className="modal-dialog modal-lg modal-dialog-centered">
//           <div className="modal-content suspend_content rounded-3 pb-3 pt-0">
//             <div className="modal-header border-0 justify-content-end ">
//               <img
//                 id="closeCross"
//                 src="/images/cross.png"
//                 alt="cross"
//                 data-bs-dismiss="modal"
//                 aria-label="Close"
//                 style={{ height: "34px" }}
//               />
//             </div>
//             <div className="modal-body suspend_content_data p-0">
//               {isViewerOpen && (
//                 <div className="modal_img overflow-hidden d-flex justify-content-center">
//                   {" "}
//                   <img
//                     src={clickedImage}
//                     alt="image"
//                     style={{
//                       minHeight: "300px",
//                       maxHeight: "600px",
//                       minWidth: "250px",
//                       maxWidth: "600px",
//                     }}
//                     className="img-fluid"
//                   />
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default SupportChart;
