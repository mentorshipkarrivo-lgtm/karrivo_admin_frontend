
import React, { useState } from "react";
import DashboardLayout from "../../Layout/DashboardLayout";
import { Icon } from "@iconify/react/dist/iconify.js";
import Pagination from "../../components/Pagination";
import { 
  useGetAllSupportTicketsQuery,
  useUpdateSupportTicketMutation 
} from "./supportApiSlice";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

const AllSupportTickets = () => {
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [response, setResponse] = useState("");

  const [state, setState] = useState({
    currentPage: 1,
    perPage: 10,
    search: "",
  });

  // ✅ Fetch all support tickets
  const { data, isLoading, error, refetch } = useGetAllSupportTicketsQuery();
  const [updateTicket, { isLoading: isUpdating }] = useUpdateSupportTicketMutation();

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setState({ ...state, currentPage: 1 });
  };

  // ✅ Filter tickets
  const filteredTickets =
    data?.tickets?.filter((ticket) => {
      const matchesStatus =
        selectedStatus === "All Status" || ticket.status === selectedStatus;

      const matchesSearch =
        ticket.subject?.toLowerCase().includes(state.search.toLowerCase()) ||
        ticket.ticketId?.toLowerCase().includes(state.search.toLowerCase()) ||
        ticket.category?.toLowerCase().includes(state.search.toLowerCase()) ||
        ticket.username?.toLowerCase().includes(state.search.toLowerCase());

      return matchesStatus && matchesSearch;
    }) || [];

  // ✅ Pagination
  const totalRecords = filteredTickets.length;
  const startIndex = (state.currentPage - 1) * state.perPage;
  const paginatedTickets = filteredTickets.slice(
    startIndex,
    startIndex + state.perPage
  );

  const formatDateWithAmPm = (isoString) => {
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
      await updateTicket({
        ticketId: selectedTicket.ticketId,
        updates: {
          response,
          status: "in_progress",
        }
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
              <h1 className="mb-0">All Support Tickets</h1>
              <div className="d-flex gap-2">
                <div className="badge bg-primary p-2 text-white">
                  Total: {totalRecords}
                </div>
                <div className="badge bg-warning p-2 text-white">
                  Pending: {data?.tickets?.filter(t => t.status === 'pending').length || 0}
                </div>
                <div className="badge bg-success p-2 text-white">
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

              <div className="col-md-7 d-flex gap-2">
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

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by Ticket ID, Subject, Category, or Username..."
                  value={state.search}
                  onChange={(e) =>
                    setState({
                      ...state,
                      search: e.target.value,
                      currentPage: 1,
                    })
                  }
                />

                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setState({ ...state, search: "", currentPage: 1 });
                    setSelectedStatus("All Status");
                  }}
                >
                  <Icon icon="mdi:refresh" width="20" />
                </button>
              </div>
            </div>

            {/* TABLE */}
            <div className="table-responsive">
              {isLoading ? (
                <div className="text-center py-5">
                  <ClipLoader size={50} color="#0d6efd" />
                  <p className="mt-3">Loading tickets...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger text-center">
                  <Icon icon="mdi:alert-circle" width="24" className="me-2" />
                  Failed to load tickets. Please try again.
                </div>
              ) : (
                <table className="table table-hover align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>S.No</th>
                      <th>Ticket ID</th>
                      <th>Username</th>
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
                          <td className="fw-semibold">{ticket.username}</td>
                          <td>
                            <div className="text-truncate" style={{ maxWidth: '200px' }} title={ticket.subject}>
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
                              {ticket.priority}
                            </span>
                          </td>
                          <td>
                            <select
                              className={`form-select form-select-sm ${getStatusBadgeClass(ticket.status)} text-white`}
                              value={ticket.status}
                              onChange={(e) => handleQuickStatusUpdate(ticket.ticketId, e.target.value)}
                              disabled={isUpdating}
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
                          <p className="text-muted mb-0">No tickets found</p>
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
                  Ticket Details - {selectedTicket.ticketId}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Username:</strong> {selectedTicket.username}</p>
                    <p className="mb-1"><strong>Category:</strong> {selectedTicket.category}</p>
                    <p className="mb-1"><strong>Priority:</strong> 
                      <span className={`badge ${getPriorityBadgeClass(selectedTicket.priority)} ms-2 text-white`}>
                        {selectedTicket.priority}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Status:</strong> 
                      <span className={`badge ${getStatusBadgeClass(selectedTicket.status)} ms-2 text-white`}>
                        {selectedTicket.status.replace('_', ' ')}
                      </span>
                    </p>
                    <p className="mb-1"><strong>Created:</strong> {formatDateWithAmPm(selectedTicket.createdAt)}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <strong>Subject:</strong>
                  <p className="mt-1">{selectedTicket.subject}</p>
                </div>

                <div className="mb-3">
                  <strong>Description:</strong>
                  <p className="mt-1 p-3 bg-secondary rounded">{selectedTicket.description}</p>
                </div>

                {selectedTicket.userRemarks && (
                  <div className="mb-3">
                    <strong>User Remarks:</strong>
                    <p className="mt-1 p-3 bg-secondary rounded">{selectedTicket.userRemarks}</p>
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label"><strong>Admin Response:</strong></label>
                  <textarea
                    className="form-control bg-dark text-light border-secondary"
                    rows="4"
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Enter your response to the user..."
                  ></textarea>
                </div>

                {selectedTicket.respondedBy && (
                  <p className="text-muted small">
                    <Icon icon="mdi:account" width="16" className="me-1" />
                    Last responded by: {selectedTicket.respondedBy} at {formatDateWithAmPm(selectedTicket.respondedAt)}
                  </p>
                )}
              </div>
              <div className="modal-footer border-secondary">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmitResponse}
                  disabled={isUpdating || !response.trim()}
                >
                  {isUpdating ? (
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

export default AllSupportTickets;


