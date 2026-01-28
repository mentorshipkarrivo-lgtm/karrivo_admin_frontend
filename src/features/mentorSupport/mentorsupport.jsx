// src/pages/admin/AllMentorSupportTickets.jsx
import React, { useState } from "react";
import DashboardLayout from "../../Layout/DashboardLayout";
import { Icon } from "@iconify/react/dist/iconify.js";
import Pagination from "../../components/Pagination";
import { 
  useGetAllMentorSupportTicketsQuery,
  useUpdateMentorSupportTicketMutation,
  useRespondToMentorTicketMutation
} from  "./mentorsupportslice"
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

const AllMentorSupportTickets = () => {
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedPriority, setSelectedPriority] = useState("All Priorities");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [response, setResponse] = useState("");

  const [state, setState] = useState({
    currentPage: 1,
    perPage: 10,
    search: "",
  });

  // ✅ Fetch all mentor support tickets
  const { data, isLoading, error, refetch } = useGetAllMentorSupportTicketsQuery();
  const [updateTicket, { isLoading: isUpdating }] = useUpdateMentorSupportTicketMutation();
  const [respondToTicket, { isLoading: isResponding }] = useRespondToMentorTicketMutation();

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setState({ ...state, currentPage: 1 });
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setState({ ...state, currentPage: 1 });
  };

  const handlePriorityChange = (e) => {
    setSelectedPriority(e.target.value);
    setState({ ...state, currentPage: 1 });
  };

  // ✅ Filter tickets
  const filteredTickets =
    data?.tickets?.filter((ticket) => {
      const matchesStatus =
        selectedStatus === "All Status" || ticket.status === selectedStatus;

      const matchesCategory =
        selectedCategory === "All Categories" || ticket.category === selectedCategory;

      const matchesPriority =
        selectedPriority === "All Priorities" || ticket.priority === selectedPriority;

      const matchesSearch =
        ticket.subject?.toLowerCase().includes(state.search.toLowerCase()) ||
        ticket.ticketId?.toLowerCase().includes(state.search.toLowerCase()) ||
        ticket.category?.toLowerCase().includes(state.search.toLowerCase()) ||
        ticket.mentorId?.name?.toLowerCase().includes(state.search.toLowerCase()) ||
        ticket.mentorId?.email?.toLowerCase().includes(state.search.toLowerCase());

      return matchesStatus && matchesCategory && matchesPriority && matchesSearch;
    }) || [];

  // ✅ Pagination
  const totalRecords = filteredTickets.length;
  const startIndex = (state.currentPage - 1) * state.perPage;
  const paginatedTickets = filteredTickets.slice(
    startIndex,
    startIndex + state.perPage
  );

  const formatDateWithAmPm = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    let hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const amPm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${day}-${month}-${year} ${hours}:${minutes} ${amPm}`;
  };

  // ✅ Handle Quick Status Update
  const handleQuickStatusUpdate = async (ticketId, newStatus) => {
    try {
      await updateTicket({
        ticketId,
        updates: { status: newStatus }
      }).unwrap();
      
      toast.success(`Ticket status updated to ${newStatus.replace('_', ' ')}`);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update ticket status");
    }
  };

  // ✅ Open Response Modal
  const openResponseModal = (ticket) => {
    setSelectedTicket(ticket);
    setResponse(ticket.response || "");
    setShowModal(true);
  };

  // ✅ Handle Response Submission
  const handleSubmitResponse = async () => {
    if (!response.trim()) {
      toast.error("Please enter a response");
      return;
    }

    try {
      const adminData = JSON.parse(localStorage.getItem("adminData") || "{}");
      const respondedBy = adminData._id || adminData.id;

      await respondToTicket({
        ticketId: selectedTicket._id,
        response,
        respondedBy
      }).unwrap();

      toast.success("Response added successfully!");
      setShowModal(false);
      setSelectedTicket(null);
      setResponse("");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add response");
    }
  };

  // ✅ Get Status Badge Color
  const getStatusBadgeClass = (status) => {
    const statusColors = {
      pending: "bg-warning",
      in_progress: "bg-info",
      resolved: "bg-success",
      closed: "bg-secondary"
    };
    return statusColors[status] || "bg-secondary";
  };

  // ✅ Get Priority Badge Color
  const getPriorityBadgeClass = (priority) => {
    const priorityColors = {
      low: "bg-success",
      medium: "bg-warning",
      high: "bg-danger",
      urgent: "bg-danger"
    };
    return priorityColors[priority?.toLowerCase()] || "bg-secondary";
  };

  return (
    <DashboardLayout>
      <section className="profile_section py-4">
        <div className="container-fluid">
          <div className="my_total_team_data rounded-3 px-3 py-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="mb-1">Mentor Support Tickets</h1>
                <p className="text-muted mb-0">Manage and respond to mentor queries</p>
              </div>
              <div className="d-flex gap-2">
                <div className="badge bg-primary p-2 text-white">
                  <Icon icon="mdi:ticket" width="16" className="me-1" />
                  Total: {totalRecords}
                </div>
                <div className="badge bg-warning p-2 text-white">
                  <Icon icon="mdi:clock-outline" width="16" className="me-1" />
                  Pending: {data?.tickets?.filter(t => t.status === 'pending').length || 0}
                </div>
                <div className="badge bg-info p-2 text-white">
                  <Icon icon="mdi:progress-clock" width="16" className="me-1" />
                  In Progress: {data?.tickets?.filter(t => t.status === 'in_progress').length || 0}
                </div>
                <div className="badge bg-success p-2 text-white">
                  <Icon icon="mdi:check-circle" width="16" className="me-1" />
                  Resolved: {data?.tickets?.filter(t => t.status === 'resolved').length || 0}
                </div>
              </div>
            </div>

            {/* FILTERS */}
            <div className="row justify-content-between mb-3">
              <div className="col-md-2">
                <select
                  className="form-select"
                  value={state.perPage}
                  onChange={(e) =>
                    setState({
                      ...state,
                      perPage: Number(e.target.value),
                      currentPage: 1,
                    })
                  }
                >
                  <option value="10">10 per page</option>
                  <option value="30">30 per page</option>
                  <option value="50">50 per page</option>
                  <option value="100">100 per page</option>
                </select>
              </div>

              <div className="col-md-10">
                <div className="row g-2">
                  <div className="col-md-3">
                    <select
                      className="form-select"
                      value={selectedStatus}
                      onChange={handleStatusChange}
                    >
                      <option value="All Status">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div className="col-md-3">
                    <select
                      className="form-select"
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                    >
                      <option value="All Categories">All Categories</option>
                      <option value="Technical Issue">Technical Issue</option>
                      <option value="Session Management">Session Management</option>
                      <option value="Mentee Related">Mentee Related</option>
                      <option value="Payment/Billing">Payment/Billing</option>
                      <option value="Account Settings">Account Settings</option>
                      <option value="Platform Features">Platform Features</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="col-md-2">
                    <select
                      className="form-select"
                      value={selectedPriority}
                      onChange={handlePriorityChange}
                    >
                      <option value="All Priorities">All Priorities</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div className="col-md-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by Ticket ID, Subject, Mentor..."
                      value={state.search}
                      onChange={(e) =>
                        setState({
                          ...state,
                          search: e.target.value,
                          currentPage: 1,
                        })
                      }
                    />
                  </div>

                  <div className="col-md-1">
                    <button 
                      className="btn btn-outline-secondary w-100"
                      onClick={() => {
                        setState({ ...state, search: "", currentPage: 1 });
                        setSelectedStatus("All Status");
                        setSelectedCategory("All Categories");
                        setSelectedPriority("All Priorities");
                      }}
                      title="Reset Filters"
                    >
                      <Icon icon="mdi:refresh" width="20" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* TABLE */}
            <div className="table-responsive">
              {isLoading ? (
                <div className="text-center py-5">
                  <ClipLoader size={50} color="#0d6efd" />
                  <p className="mt-3">Loading mentor support tickets...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger text-center">
                  <Icon icon="mdi:alert-circle" width="24" className="me-2" />
                  Failed to load tickets. Please try again.
                  <button 
                    className="btn btn-sm btn-danger ms-3"
                    onClick={() => refetch()}
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <table className="table table-hover align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>S.No</th>
                      <th>Ticket ID</th>
                      <th>Mentor Details</th>
                      <th>Subject</th>
                      <th>Category</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTickets.length ? (
                      paginatedTickets.map((ticket, i) => (
                        <tr key={ticket._id}>
                          <td>{startIndex + i + 1}</td>
                          <td>
                            <span className="badge bg-primary">
                              {ticket.ticketId}
                            </span>
                          </td>
                          <td>
                            <div>
                              <div className="fw-semibold">{ticket.mentorId?.name || "N/A"}</div>
                              <div className="small text-muted">{ticket.mentorId?.email || "N/A"}</div>
                            </div>
                          </td>
                          <td>
                            <div className="text-truncate" style={{ maxWidth: '250px' }} title={ticket.subject}>
                              {ticket.subject}
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-dark border border-secondary text-white">
                              {ticket.category}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${getPriorityBadgeClass(ticket.priority)} text-white`}>
                              {ticket.priority?.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <select
                              className={`form-select form-select-sm ${getStatusBadgeClass(ticket.status)} text-white`}
                              value={ticket.status}
                              onChange={(e) => handleQuickStatusUpdate(ticket._id, e.target.value)}
                              disabled={isUpdating}
                              style={{ minWidth: '120px' }}
                            >
                              <option value="pending">Pending</option>
                              <option value="in_progress">In Progress</option>
                              <option value="resolved">Resolved</option>
                              <option value="closed">Closed</option>
                            </select>
                          </td>
                          <td className="text-nowrap small">
                            {formatDateWithAmPm(ticket.createdAt)}
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => openResponseModal(ticket)}
                              title="View/Add Response"
                            >
                              <Icon icon="mdi:message-reply" width="18" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center py-4">
                          <Icon icon="mdi:ticket-outline" width="48" className="text-muted mb-2" />
                          <p className="text-muted mb-0">No mentor support tickets found</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {totalRecords > 0 && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <p className="mb-0 text-muted">
                  Showing {startIndex + 1} to {Math.min(startIndex + state.perPage, totalRecords)} of {totalRecords} tickets
                </p>
                <Pagination
                  currentPage={state.currentPage}
                  totalPages={Math.ceil(totalRecords / state.perPage) || 1}
                  onPageChange={(page) =>
                    setState({ ...state, currentPage: page })
                  }
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Response Modal */}
      {showModal && selectedTicket && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-dark text-light">
              <div className="modal-header border-secondary">
                <h5 className="modal-title">
                  <Icon icon="mdi:ticket" width="24" className="me-2" />
                  Mentor Ticket Details - {selectedTicket.ticketId}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Mentor Information */}
                <div className="card bg-secondary mb-3">
                  <div className="card-header">
                    <Icon icon="mdi:account" width="20" className="me-2" />
                    Mentor Information
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <p className="mb-1"><strong>Name:</strong> {selectedTicket.mentorId?.name || "N/A"}</p>
                        <p className="mb-1"><strong>Email:</strong> {selectedTicket.mentorId?.email || "N/A"}</p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-1"><strong>Phone:</strong> {selectedTicket.mentorId?.phone || "N/A"}</p>
                        <p className="mb-1"><strong>Username:</strong> {selectedTicket.mentorId?.username || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ticket Details */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Category:</strong> {selectedTicket.category}</p>
                    <p className="mb-1"><strong>Priority:</strong> 
                      <span className={`badge ${getPriorityBadgeClass(selectedTicket.priority)} ms-2 text-white`}>
                        {selectedTicket.priority?.toUpperCase()}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Status:</strong> 
                      <span className={`badge ${getStatusBadgeClass(selectedTicket.status)} ms-2 text-white`}>
                        {selectedTicket.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </p>
                    <p className="mb-1"><strong>Created:</strong> {formatDateWithAmPm(selectedTicket.createdAt)}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <strong>
                    <Icon icon="mdi:text-box" width="18" className="me-1" />
                    Subject:
                  </strong>
                  <p className="mt-1">{selectedTicket.subject}</p>
                </div>

                <div className="mb-3">
                  <strong>
                    <Icon icon="mdi:file-document" width="18" className="me-1" />
                    Description:
                  </strong>
                  <p className="mt-1 p-3 bg-secondary rounded">{selectedTicket.description}</p>
                </div>

                {selectedTicket.userRemarks && (
                  <div className="mb-3">
                    <strong>
                      <Icon icon="mdi:comment-account" width="18" className="me-1" />
                      Mentor Remarks:
                    </strong>
                    <p className="mt-1 p-3 bg-secondary rounded border border-info">
                      {selectedTicket.userRemarks}
                    </p>
                    {selectedTicket.feedbackAt && (
                      <small className="text-muted">
                        Provided on: {formatDateWithAmPm(selectedTicket.feedbackAt)}
                      </small>
                    )}
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label">
                    <strong>
                      <Icon icon="mdi:reply" width="18" className="me-1" />
                      Admin Response:
                    </strong>
                  </label>
                  <textarea
                    className="form-control bg-dark text-light border-secondary"
                    rows="5"
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Enter your response to the mentor..."
                  ></textarea>
                  <small className="text-muted">
                    Provide a detailed response to help resolve the mentor's query
                  </small>
                </div>

                {selectedTicket.respondedBy && selectedTicket.respondedAt && (
                  <div className="alert alert-info">
                    <Icon icon="mdi:information" width="18" className="me-2" />
                    Last responded at: {formatDateWithAmPm(selectedTicket.respondedAt)}
                  </div>
                )}
              </div>
              <div className="modal-footer border-secondary">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  <Icon icon="mdi:close" width="18" className="me-1" />
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmitResponse}
                  disabled={isResponding || !response.trim()}
                >
                  {isResponding ? (
                    <>
                      <ClipLoader size={16} color="#fff" className="me-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Icon icon="mdi:send" width="18" className="me-1" />
                      Submit Response
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AllMentorSupportTickets;