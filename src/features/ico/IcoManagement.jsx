// SessionBookingManagement.jsx - Frontend Component

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
} from "./icoApiSlice"
import { toast } from "react-toastify";

const SessionBookingManagement = () => {
  const [currentEditData, setCurrentEditData] = useState(null);
  const [errors, setErrors] = useState({});
  const [refresh, setRefresh] = useState(false);
  
  // State for pagination
  const [state, setState] = useState({
    currentPage: 1,
    perPage: 10,
    search: "",
    selectedBookingId: null,
  });

  const queryParams = `limit=${state?.perPage || ""}&page=${
    state?.currentPage || ""
  }&search=${state?.search || ""}`;

  const { 
    data: getSessionBookings, 
    isLoading, 
    refetch 
  } = useGetSessionBookingsQuery(queryParams);

  const {
    data: viewBooking,
    isLoading: isBookingLoading,
  } = useViewSessionBookingQuery(state.selectedBookingId, {
    skip: !state.selectedBookingId,
  });

  const TableData = getSessionBookings?.data?.bookings || [];
  
  const [updateSessionBooking] = useUpdateSessionBookingMutation();
  const [updateSessionStatus] = useUpdateSessionStatusMutation();
  const [updatePaymentStatus] = useUpdatePaymentStatusMutation();
  const [deleteSessionBooking] = useDeleteSessionBookingMutation();

  // Handle page change
  const handlePageChange = (e) => {
    setState({ ...state, currentPage: e });
  };

  // Handle search with delay
  let searchTimeout;
  const handleSearch = (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      setState({ ...state, search: e.target.value, currentPage: 1 });
    }, 1000);
  };

  // Validation for update session booking
  const validate = () => {
    let formErrors = {};

    // Topic validation
    if (!currentEditData.topic || currentEditData.topic.trim() === "") {
      formErrors.topic = "Topic is required";
    }

    // Session date validation
    if (!currentEditData.sessionDate) {
      formErrors.sessionDate = "Session date is required";
    }

    // Start time validation
    if (!currentEditData.startTime || currentEditData.startTime.trim() === "") {
      formErrors.startTime = "Start time is required";
    }

    // Duration validation
    if (!currentEditData.durationMinutes) {
      formErrors.durationMinutes = "Duration is required";
    } else if (isNaN(currentEditData.durationMinutes)) {
      formErrors.durationMinutes = "Duration must be a number";
    } else if (currentEditData.durationMinutes < 15) {
      formErrors.durationMinutes = "Duration cannot be less than 15 minutes";
    }

    // Price validation
    if (!currentEditData.price) {
      formErrors.price = "Price is required";
    } else if (isNaN(currentEditData.price)) {
      formErrors.price = "Price must be a number";
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
      _id: data._id
    });
    setState({ ...state, selectedBookingId: data._id });
    const modal = new window.bootstrap.Modal(
      document.getElementById("editModal")
    );
    modal.show();
  };

  // Open view modal
  const openViewModal = (data) => {
    setState({ ...state, selectedBookingId: data._id });
    const modal = new window.bootstrap.Modal(
      document.getElementById("viewModal")
    );
    modal.show();
  };

  // Handle edit change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCurrentEditData({ ...currentEditData, [name]: value });
  };

  // Handle update session booking
  const handleUpdateBooking = async () => {
    if (!validate()) {
      return;
    }

    try {
      const { _id, ...updateData } = currentEditData;
      await updateSessionBooking({
        bookingId: _id,
        ...updateData
      }).unwrap();
      
      toast.success("Session booking updated successfully", {
        position: "top-center",
      });
      setRefresh(true);
      document.getElementById("closeModal").click();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update session booking", {
        position: "top-center",
      });
    }
  };

  // Handle status change
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateSessionStatus({
        bookingId,
        status: newStatus
      }).unwrap();
      
      toast.success(`Status updated to ${newStatus} successfully`, {
        position: "top-center",
      });
      setRefresh(true);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update status", {
        position: "top-center",
      });
    }
  };

  // Handle payment status change
  const handlePaymentStatusChange = async (bookingId, newPaymentStatus) => {
    try {
      await updatePaymentStatus({
        bookingId,
        paymentStatus: newPaymentStatus
      }).unwrap();
      
      toast.success(`Payment status updated to ${newPaymentStatus} successfully`, {
        position: "top-center",
      });
      setRefresh(true);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update payment status", {
        position: "top-center",
      });
    }
  };

  // Handle delete booking
  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await deleteSessionBooking(bookingId).unwrap();
        
        toast.success("Session booking deleted successfully", {
          position: "top-center",
        });
        setRefresh(true);
      } catch (error) {
        toast.error(error?.data?.message || "Failed to delete booking", {
          position: "top-center",
        });
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount, currency) => {
    if (!amount) return "N/A";
    return `${currency === "INR" ? "₹" : "$"}${amount}`;
  };

  // Get status badge class
  const getStatusBadge = (status) => {
    const badges = {
      pending: "badge bg-warning",
      confirmed: "badge bg-info",
      completed: "badge bg-success",
      cancelled: "badge bg-danger",
      rescheduled: "badge bg-secondary"
    };
    return badges[status] || "badge bg-secondary";
  };

  // Get payment status badge
  const getPaymentBadge = (paymentStatus) => {
    const badges = {
      unpaid: "badge bg-warning",
      paid: "badge bg-success",
      refunded: "badge bg-info",
      failed: "badge bg-danger"
    };
    return badges[paymentStatus] || "badge bg-secondary";
  };

  useEffect(() => {
    if (refresh) {
      refetch();
      setRefresh(false);
    }
  }, [refresh, refetch]);

  useEffect(() => {
    return () => {
      clearTimeout(searchTimeout);
    };
  }, []);

  return (
    <DashboardLayout>
      <section className="profile_section py-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="my_total_team_data rounded-3 px-3 pb-0 py-4">
                <h1 className="mb-3">Session Booking Management</h1>
                <div className="row justify-content-between">
                  <div className="col-12 col-sm-6 col-md-2 col-xxl-1">
                    <div className="pagination__box mb-4">
                      <div className="showing_data">
                        <select
                          className="form-select shadow-none"
                          aria-label="Items per page"
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
                          aria-label="Search"
                          aria-describedby="basic-addon1"
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
                        <th scope="col">Duration</th>
                        <th scope="col">Price</th>
                        <th scope="col">Status</th>
                        <th scope="col">Payment</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <>
                          {[...Array(10)].map((_, i) => (
                            <tr key={i}>
                              {[...Array(10)].map((_, j) => (
                                <td key={j}>
                                  <Skeleton />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </>
                      ) : TableData.length === 0 ? (
                        <tr>
                          <td colSpan="10" className="text-center">
                            No bookings found
                          </td>
                        </tr>
                      ) : (
                        TableData.map((booking, i) => (
                          <tr key={booking._id}>
                            <td>
                              {state?.currentPage * state?.perPage -
                                (state?.perPage - 1) +
                                i}
                              .
                            </td>
                            <td>{booking.menteeName}</td>
                            <td>{booking.topic}</td>
                            <td>{formatDate(booking.sessionDate)}</td>
                            <td>{booking.startTime}</td>
                            <td>{booking.durationMinutes} min</td>
                            <td>{formatCurrency(booking.price, booking.currency)}</td>
                            <td>
                              <select
                                className={getStatusBadge(booking.status)}
                                value={booking.status}
                                onChange={(e) =>
                                  handleStatusChange(booking._id, e.target.value)
                                }
                                style={{ cursor: "pointer", border: "none" }}
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
                                onChange={(e) =>
                                  handlePaymentStatusChange(booking._id, e.target.value)
                                }
                                style={{ cursor: "pointer", border: "none" }}
                              >
                                <option value="unpaid">Unpaid</option>
                                <option value="paid">Paid</option>
                                <option value="refunded">Refunded</option>
                                <option value="failed">Failed</option>
                              </select>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <span
                                  style={{ cursor: "pointer" }}
                                  onClick={() => openViewModal(booking)}
                                  title="View Details"
                                >
                                  <Icon
                                    icon="mdi:eye"
                                    width="20"
                                    height="20"
                                    style={{ color: "#17a2b8" }}
                                  />
                                </span>
                                <span
                                  style={{ cursor: "pointer" }}
                                  onClick={() => openModal(booking)}
                                  title="Edit Booking"
                                >
                                  <Icon
                                    icon="mdi:pencil"
                                    width="20"
                                    height="20"
                                    style={{ color: "#ffc107" }}
                                  />
                                </span>
                                <span
                                  style={{ cursor: "pointer" }}
                                  onClick={() => handleDeleteBooking(booking._id)}
                                  title="Delete Booking"
                                >
                                  <Icon
                                    icon="mdi:delete"
                                    width="20"
                                    height="20"
                                    style={{ color: "#dc3545" }}
                                  />
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {TableData?.length > 0 && (
                <Pagination
                  currentPage={state?.currentPage}
                  totalPages={
                    Math.ceil(
                      getSessionBookings?.data?.pagination?.total / state?.perPage
                    ) || 1
                  }
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* View Modal */}
      <div
        className="modal fade common__modal"
        id="viewModal"
        tabIndex="-1"
        aria-labelledby="viewModalLabel"
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
              <h1 className="modal-title mb-4" id="viewModalLabel">
                Session Booking Details
              </h1>

              {isBookingLoading ? (
                <Skeleton count={10} />
              ) : viewBooking?.data ? (
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="form__box">
                      <label>Mentee Name</label>
                      <input
                        type="text"
                        className="form-control shadow-none"
                        value={viewBooking.data.menteeName}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="form__box">
                      <label>Email</label>
                      <input
                        type="text"
                        className="form-control shadow-none"
                        value={viewBooking.data.email}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="form__box">
                      <label>Phone</label>
                      <input
                        type="text"
                        className="form-control shadow-none"
                        value={viewBooking.data.phone}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="form__box">
                      <label>Topic</label>
                      <input
                        type="text"
                        className="form-control shadow-none"
                        value={viewBooking.data.topic}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-12 mb-3">
                    <div className="form__box">
                      <label>Description</label>
                      <textarea
                        className="form-control shadow-none"
                        value={viewBooking.data.description || "No description"}
                        readOnly
                        rows="3"
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="form__box">
                      <label>Session Date</label>
                      <input
                        type="text"
                        className="form-control shadow-none"
                        value={formatDate(viewBooking.data.sessionDate)}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="form__box">
                      <label>Time</label>
                      <input
                        type="text"
                        className="form-control shadow-none"
                        value={viewBooking.data.startTime}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="form__box">
                      <label>Duration</label>
                      <input
                        type="text"
                        className="form-control shadow-none"
                        value={`${viewBooking.data.durationMinutes} minutes`}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="form__box">
                      <label>Session Type</label>
                      <input
                        type="text"
                        className="form-control shadow-none"
                        value={viewBooking.data.sessionType}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="form__box">
                      <label>Price</label>
                      <input
                        type="text"
                        className="form-control shadow-none"
                        value={formatCurrency(viewBooking.data.price, viewBooking.data.currency)}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="form__box">
                      <label>Payment Method</label>
                      <input
                        type="text"
                        className="form-control shadow-none"
                        value={viewBooking.data.paymentMethod}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="form__box">
                      <label>Status</label>
                      <input
                        type="text"
                        className="form-control shadow-none"
                        value={viewBooking.data.status}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="form__box">
                      <label>Payment Status</label>
                      <input
                        type="text"
                        className="form-control shadow-none"
                        value={viewBooking.data.paymentStatus}
                        readOnly
                      />
                    </div>
                  </div>
                  {viewBooking.data.meetingLink && (
                    <div className="col-md-12 mb-3">
                      <div className="form__box">
                        <label>Meeting Link</label>
                        <input
                          type="text"
                          className="form-control shadow-none"
                          value={viewBooking.data.meetingLink}
                          readOnly
                        />
                      </div>
                    </div>
                  )}
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
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
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
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeModal"
              ></button>
            </div>
            <div className="modal-body pt-0 px-4">
              <h1 className="modal-title mb-4" id="editModalLabel">
                Edit Session Booking
              </h1>

              {currentEditData && (
                <form className="row">
                  <div className="col-md-6 mb-3">
                    <div className="form__box">
                      <label>Topic</label>
                      <input
                        type="text"
                        autoComplete="off"
                        className="form-control shadow-none"
                        name="topic"
                        value={currentEditData.topic}
                        onChange={handleEditChange}
                      />
                    </div>
                    {errors.topic && (
                      <div className="error_cls">{errors.topic}</div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <div className="form__box">
                      <label>Session Date</label>
                      <input
                        type="date"
                        autoComplete="off"
                        className="form-control shadow-none"
                        name="sessionDate"
                        value={currentEditData.sessionDate}
                        onChange={handleEditChange}
                      />
                    </div>
                    {errors.sessionDate && (
                      <div className="error_cls">{errors.sessionDate}</div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <div className="form__box">
                      <label>Start Time</label>
                      <input
                        type="text"
                        autoComplete="off"
                        className="form-control shadow-none"
                        name="startTime"
                        value={currentEditData.startTime}
                        onChange={handleEditChange}
                        placeholder="e.g., 09:00 - 10:00"
                      />
                    </div>
                    {errors.startTime && (
                      <div className="error_cls">{errors.startTime}</div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <div className="form__box">
                      <label>Duration (minutes)</label>
                      <input
                        type="number"
                        autoComplete="off"
                        className="form-control shadow-none"
                        name="durationMinutes"
                        value={currentEditData.durationMinutes}
                        onChange={handleEditChange}
                      />
                    </div>
                    {errors.durationMinutes && (
                      <div className="error_cls">{errors.durationMinutes}</div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <div className="form__box">
                      <label>Price</label>
                      <input
                        type="number"
                        autoComplete="off"
                        className="form-control shadow-none"
                        name="price"
                        value={currentEditData.price}
                        onChange={handleEditChange}
                      />
                    </div>
                    {errors.price && (
                      <div className="error_cls">{errors.price}</div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <div className="form__box">
                      <label>Session Type</label>
                      <select
                        className="form-select shadow-none"
                        name="sessionType"
                        value={currentEditData.sessionType}
                        onChange={handleEditChange}
                      >
                        <option value="One-on-One">One-on-One</option>
                        <option value="Group">Group</option>
                        <option value="Workshop">Workshop</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-12 mb-3">
                    <div className="form__box">
                      <label>Description</label>
                      <textarea
                        className="form-control shadow-none"
                        name="description"
                        value={currentEditData.description}
                        onChange={handleEditChange}
                        rows="3"
                      />
                    </div>
                  </div>

                  <div className="d-flex gap-3 justify-content-center flex-wrap my-4">
                    <button
                      type="button"
                      className="btn_cancel"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn_orange"
                      onClick={handleUpdateBooking}
                    >
                      Save changes
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SessionBookingManagement;