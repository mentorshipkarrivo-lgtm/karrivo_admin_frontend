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

    console.log("Session Bookings Response:", sessionBookingsResponse);
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

  console.log("📊 Session Bookings Response:", sessionBookingsResponse);
  console.log("📋 Table Data:", TableData);
  console.log("📄 Pagination:", paginationData);

  // Handle page change
  const handlePageChange = (page) => {
    setState({ ...state, currentPage: page });
  };

  // Handle search with debounce
  const handleSearch = (e) => {
    const value = e.target.value;
    setTimeout(() => {
      setState({ ...state, search: value, currentPage: 1 });
    }, 500);
  };

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
      
      toast.success("Session booking updated successfully");
      document.getElementById("closeEditModal").click();
      refetch();
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to update session booking");
    }
  };

  // Handle status change
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateSessionStatus({ bookingId, status: newStatus }).unwrap();
      toast.success(`Status updated to ${newStatus}`);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  // Handle payment status change
  const handlePaymentStatusChange = async (bookingId, newPaymentStatus) => {
    try {
      await updatePaymentStatus({ bookingId, paymentStatus: newPaymentStatus }).unwrap();
      toast.success(`Payment status updated to ${newPaymentStatus}`);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update payment status");
    }
  };

  // Handle delete
  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    try {
      await deleteSessionBooking(bookingId).unwrap();
      toast.success("Session booking deleted successfully");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete booking");
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
      <section className="profile_section py-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="my_total_team_data rounded-3 px-3 pb-0 py-4">
                <h1 className="mb-3">Session Booking Management</h1>

                <div className="row justify-content-between mb-3">
                  <div className="col-12 col-sm-6 col-md-2">
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
                  <div className="col-12 col-sm-6 col-md-3">
                    <div className="input-group search_group">
                      <span className="input-group-text">
                        <Icon icon="tabler:search" width="16" height="16" />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search"
                        onChange={handleSearch}
                      />
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Mentee Name</th>
                        <th>Topic</th>
                        <th>Session Date</th>
                        <th>Time</th>
                        <th>Duration</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Payment</th>
                        <th>Actions</th>
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
                            <td>{formatDate(booking.sessionDate)}</td>
                            <td>{booking.startTime || "N/A"}</td>
                            <td>{booking.durationMinutes} min</td>
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
                                <Icon
                                  icon="mdi:eye"
                                  width="20"
                                  height="20"
                                  style={{ color: "#17a2b8", cursor: "pointer" }}
                                  onClick={() => openViewModal(booking)}
                                  title="View"
                                />
                                <Icon
                                  icon="mdi:pencil"
                                  width="20"
                                  height="20"
                                  style={{ color: "#ffc107", cursor: "pointer" }}
                                  onClick={() => openModal(booking)}
                                  title="Edit"
                                />
                                <Icon
                                  icon="mdi:delete"
                                  width="20"
                                  height="20"
                                  style={{ color: "#dc3545", cursor: "pointer" }}
                                  onClick={() => handleDeleteBooking(booking._id)}
                                  title="Delete"
                                />
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

      {/* View Modal */}
      <div className="modal fade" id="viewModal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Session Booking Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {isBookingLoading ? (
                <Skeleton count={10} />
              ) : viewBookingData ? (
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Mentee Name</label>
                    <input type="text" className="form-control" value={viewBookingData.menteeName || ""} readOnly />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input type="text" className="form-control" value={viewBookingData.email || ""} readOnly />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone</label>
                    <input type="text" className="form-control" value={viewBookingData.phone || ""} readOnly />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Topic</label>
                    <input type="text" className="form-control" value={viewBookingData.topic || ""} readOnly />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" value={viewBookingData.description || "No description"} readOnly rows="3" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Session Date</label>
                    <input type="text" className="form-control" value={formatDate(viewBookingData.sessionDate)} readOnly />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Time</label>
                    <input type="text" className="form-control" value={viewBookingData.startTime || ""} readOnly />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Duration</label>
                    <input type="text" className="form-control" value={`${viewBookingData.durationMinutes} minutes`} readOnly />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Price</label>
                    <input type="text" className="form-control" value={formatCurrency(viewBookingData.price, viewBookingData.currency)} readOnly />
                  </div>
                  {viewBookingData.meetingLink && (
                    <div className="col-12">
                      <label className="form-label">Meeting Link</label>
                      <div className="input-group">
                        <input type="text" className="form-control" value={viewBookingData.meetingLink} readOnly />
                        <a href={viewBookingData.meetingLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Join</a>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <div className="modal fade" id="editModal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Session Booking</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" id="closeEditModal"></button>
            </div>
            <div className="modal-body">
              {currentEditData && (
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Topic *</label>
                    <input type="text" className="form-control" name="topic" value={currentEditData.topic || ""} onChange={handleEditChange} />
                    {errors.topic && <small className="text-danger">{errors.topic}</small>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Session Date *</label>
                    <input type="date" className="form-control" name="sessionDate" value={currentEditData.sessionDate || ""} onChange={handleEditChange} />
                    {errors.sessionDate && <small className="text-danger">{errors.sessionDate}</small>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Start Time *</label>
                    <input type="text" className="form-control" name="startTime" value={currentEditData.startTime || ""} onChange={handleEditChange} placeholder="09:00 - 10:00" />
                    {errors.startTime && <small className="text-danger">{errors.startTime}</small>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Duration (minutes) *</label>
                    <input type="number" className="form-control" name="durationMinutes" value={currentEditData.durationMinutes || ""} onChange={handleEditChange} />
                    {errors.durationMinutes && <small className="text-danger">{errors.durationMinutes}</small>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Price *</label>
                    <input type="number" className="form-control" name="price" value={currentEditData.price || ""} onChange={handleEditChange} />
                    {errors.price && <small className="text-danger">{errors.price}</small>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Session Type</label>
                    <select className="form-select" name="sessionType" value={currentEditData.sessionType || "One-on-One"} onChange={handleEditChange}>
                      <option value="One-on-One">One-on-One</option>
                      <option value="Group">Group</option>
                      <option value="Workshop">Workshop</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" name="description" value={currentEditData.description || ""} onChange={handleEditChange} rows="3" />
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary" onClick={handleUpdateBooking}>Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SessionBookingManagement;