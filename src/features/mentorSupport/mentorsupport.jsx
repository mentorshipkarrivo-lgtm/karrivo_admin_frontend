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

  return (
    <>
      <style>
        {`
          .form-control::placeholder,
          .form-select option {
            color: rgba(255, 255, 255, 0.7) !important;
          }
          .table-hover tbody tr:hover {
            background-color: rgba(255, 255, 255, 0.05) !important;
          }
        `}
      </style>
      <DashboardLayout>
      <section className="profile_section py-4">
        <div className="container-fluid">
          <div className="my_total_team_data rounded-3 px-3 py-4" style={{ backgroundColor: '#1b232d' }}>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="mb-1 text-white">Mentor Support Tickets</h1>
                <p className="mb-0" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Manage and respond to mentor queries</p>
              </div>
              <div className="d-flex gap-2">
                <div className="p-2 text-white" style={{ backgroundColor: 'transparent', border: '1px solid white', borderRadius: '4px' }}>
                  <Icon icon="mdi:ticket" width="16" className="me-1" />
                  Total: {totalRecords}
                </div>
                <div className="p-2 text-white" style={{ backgroundColor: 'transparent', border: '1px solid white', borderRadius: '4px' }}>
                  <Icon icon="mdi:clock-outline" width="16" className="me-1" />
                  Pending: {data?.tickets?.filter(t => t.status === 'pending').length || 0}
                </div>
                <div className="p-2 text-white" style={{ backgroundColor: 'transparent', border: '1px solid white', borderRadius: '4px' }}>
                  <Icon icon="mdi:progress-clock" width="16" className="me-1" />
                  In Progress: {data?.tickets?.filter(t => t.status === 'in_progress').length || 0}
                </div>
                <div className="p-2 text-white" style={{ backgroundColor: 'transparent', border: '1px solid white', borderRadius: '4px' }}>
                  <Icon icon="mdi:check-circle" width="16" className="me-1" />
                  Resolved: {data?.tickets?.filter(t => t.status === 'resolved').length || 0}
                </div>
              </div>
            </div>

            {/* FILTERS */}
            <div className="row justify-content-between mb-3">
              <div className="col-md-2">
                <select
                  className="form-select text-white"
                  style={{ backgroundColor: 'transparent', border: '1px solid white' }}
                  value={state.perPage}
                  onChange={(e) =>
                    setState({
                      ...state,
                      perPage: Number(e.target.value),
                      currentPage: 1,
                    })
                  }
                >
                  <option value="10" style={{ backgroundColor: '#1b232d' }}>10 per page</option>
                  <option value="30" style={{ backgroundColor: '#1b232d' }}>30 per page</option>
                  <option value="50" style={{ backgroundColor: '#1b232d' }}>50 per page</option>
                  <option value="100" style={{ backgroundColor: '#1b232d' }}>100 per page</option>
                </select>
              </div>

              <div className="col-md-10">
                <div className="row g-2">
                  <div className="col-md-3">
                    <select
                      className="form-select text-white"
                      style={{ backgroundColor: 'transparent', border: '1px solid white' }}
                      value={selectedStatus}
                      onChange={handleStatusChange}
                    >
                      <option value="All Status" style={{ backgroundColor: '#1b232d' }}>All Status</option>
                      <option value="pending" style={{ backgroundColor: '#1b232d' }}>Pending</option>
                      <option value="in_progress" style={{ backgroundColor: '#1b232d' }}>In Progress</option>
                      <option value="resolved" style={{ backgroundColor: '#1b232d' }}>Resolved</option>
                      <option value="closed" style={{ backgroundColor: '#1b232d' }}>Closed</option>
                    </select>
                  </div>

                  <div className="col-md-3">
                    <select
                      className="form-select text-white"
                      style={{ backgroundColor: 'transparent', border: '1px solid white' }}
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                    >
                      <option value="All Categories" style={{ backgroundColor: '#1b232d' }}>All Categories</option>
                      <option value="Technical Issue" style={{ backgroundColor: '#1b232d' }}>Technical Issue</option>
                      <option value="Session Management" style={{ backgroundColor: '#1b232d' }}>Session Management</option>
                      <option value="Mentee Related" style={{ backgroundColor: '#1b232d' }}>Mentee Related</option>
                      <option value="Payment/Billing" style={{ backgroundColor: '#1b232d' }}>Payment/Billing</option>
                      <option value="Account Settings" style={{ backgroundColor: '#1b232d' }}>Account Settings</option>
                      <option value="Platform Features" style={{ backgroundColor: '#1b232d' }}>Platform Features</option>
                      <option value="Other" style={{ backgroundColor: '#1b232d' }}>Other</option>
                    </select>
                  </div>

                  <div className="col-md-2">
                    <select
                      className="form-select text-white"
                      style={{ backgroundColor: 'transparent', border: '1px solid white' }}
                      value={selectedPriority}
                      onChange={handlePriorityChange}
                    >
                      <option value="All Priorities" style={{ backgroundColor: '#1b232d' }}>All Priorities</option>
                      <option value="low" style={{ backgroundColor: '#1b232d' }}>Low</option>
                      <option value="medium" style={{ backgroundColor: '#1b232d' }}>Medium</option>
                      <option value="high" style={{ backgroundColor: '#1b232d' }}>High</option>
                      <option value="urgent" style={{ backgroundColor: '#1b232d' }}>Urgent</option>
                    </select>
                  </div>

                  <div className="col-md-3">
                    <input
                      type="text"
                      className="form-control text-white"
                      style={{ backgroundColor: 'transparent', border: '1px solid white' }}
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
                      className="btn w-100 text-white"
                      style={{ backgroundColor: 'transparent', border: '1px solid white' }}
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
                  <ClipLoader size={50} color="#ffffff" />
                  <p className="mt-3 text-white">Loading mentor support tickets...</p>
                </div>
              ) : error ? (
                <div className="text-center py-3" style={{ border: '1px solid white', borderRadius: '4px', backgroundColor: 'transparent' }}>
                  <Icon icon="mdi:alert-circle" width="24" className="me-2 text-white" />
                  <span className="text-white">Failed to load tickets. Please try again.</span>
                  <button 
                    className="btn btn-sm ms-3 text-white"
                    style={{ backgroundColor: 'transparent', border: '1px solid white' }}
                    onClick={() => refetch()}
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <table className="table table-hover align-middle" style={{ backgroundColor: 'transparent' }}>
                  <thead style={{ backgroundColor: 'transparent', borderBottom: '2px solid white' }}>
                    <tr>
                      <th className="text-white" style={{ backgroundColor: 'transparent' }}>S.No</th>
                      <th className="text-white" style={{ backgroundColor: 'transparent' }}>Ticket ID</th>
                      <th className="text-white" style={{ backgroundColor: 'transparent' }}>Mentor Details</th>
                      <th className="text-white" style={{ backgroundColor: 'transparent' }}>Subject</th>
                      <th className="text-white" style={{ backgroundColor: 'transparent' }}>Category</th>
                      <th className="text-white" style={{ backgroundColor: 'transparent' }}>Priority</th>
                      <th className="text-white" style={{ backgroundColor: 'transparent' }}>Status</th>
                      <th className="text-white" style={{ backgroundColor: 'transparent' }}>Created At</th>
                      <th className="text-white" style={{ backgroundColor: 'transparent' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody style={{ backgroundColor: 'transparent' }}>
                    {paginatedTickets.length ? (
                      paginatedTickets.map((ticket, i) => (
                        <tr key={ticket._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)', backgroundColor: 'transparent' }}>
                          <td className="text-white" style={{ backgroundColor: 'transparent' }}>{startIndex + i + 1}</td>
                          <td style={{ backgroundColor: 'transparent' }}>
                            <span className="text-white" style={{ padding: '4px 8px', border: '1px solid white', borderRadius: '4px', backgroundColor: 'transparent' }}>
                              {ticket.ticketId}
                            </span>
                          </td>
                          <td style={{ backgroundColor: 'transparent' }}>
                            <div>
                              <div className="fw-semibold text-white">{ticket.mentorId?.name || "N/A"}</div>
                              <div className="small" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{ticket.mentorId?.email || "N/A"}</div>
                            </div>
                          </td>
                          <td style={{ backgroundColor: 'transparent' }}>
                            <div className="text-truncate text-white" style={{ maxWidth: '250px' }} title={ticket.subject}>
                              {ticket.subject}
                            </div>
                          </td>
                          <td style={{ backgroundColor: 'transparent' }}>
                            <span className="text-white" style={{ padding: '4px 8px', border: '1px solid white', borderRadius: '4px', backgroundColor: 'transparent' }}>
                              {ticket.category}
                            </span>
                          </td>
                          <td style={{ backgroundColor: 'transparent' }}>
                            <span className="text-white" style={{ padding: '4px 8px', border: '1px solid white', borderRadius: '4px', backgroundColor: 'transparent' }}>
                              {ticket.priority?.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ backgroundColor: 'transparent' }}>
                            <select
                              className="form-select form-select-sm text-white"
                              style={{ backgroundColor: 'transparent', border: '1px solid white', minWidth: '120px' }}
                              value={ticket.status}
                              onChange={(e) => handleQuickStatusUpdate(ticket._id, e.target.value)}
                              disabled={isUpdating}
                            >
                              <option value="pending" style={{ backgroundColor: '#1b232d' }}>Pending</option>
                              <option value="in_progress" style={{ backgroundColor: '#1b232d' }}>In Progress</option>
                              <option value="resolved" style={{ backgroundColor: '#1b232d' }}>Resolved</option>
                              <option value="closed" style={{ backgroundColor: '#1b232d' }}>Closed</option>
                            </select>
                          </td>
                          <td className="text-nowrap small text-white" style={{ backgroundColor: 'transparent' }}>
                            {formatDateWithAmPm(ticket.createdAt)}
                          </td>
                          <td style={{ backgroundColor: 'transparent' }}>
                            <button
                              className="btn btn-sm text-white"
                              style={{ backgroundColor: 'transparent', border: '1px solid white' }}
                              onClick={() => openResponseModal(ticket)}
                              title="View/Add Response"
                            >
                              <Icon icon="mdi:message-reply" width="18" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr style={{ backgroundColor: 'transparent' }}>
                        <td colSpan="9" className="text-center py-4" style={{ backgroundColor: 'transparent' }}>
                          <Icon icon="mdi:ticket-outline" width="48" style={{ color: 'rgba(255, 255, 255, 0.5)' }} className="mb-2" />
                          <p className="mb-0" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>No mentor support tickets found</p>
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
                <p className="mb-0" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
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
            <div className="modal-content" style={{ backgroundColor: '#1b232d', color: 'white' }}>
              <div className="modal-header" style={{ borderBottom: '1px solid white' }}>
                <h5 className="modal-title text-white">
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
                <div className="card mb-3" style={{ backgroundColor: 'transparent', border: '1px solid white' }}>
                  <div className="card-header text-white" style={{ borderBottom: '1px solid white', backgroundColor: 'transparent' }}>
                    <Icon icon="mdi:account" width="20" className="me-2" />
                    Mentor Information
                  </div>
                  <div className="card-body" style={{ backgroundColor: 'transparent' }}>
                    <div className="row">
                      <div className="col-md-6">
                        <p className="mb-1 text-white"><strong>Name:</strong> {selectedTicket.mentorId?.name || "N/A"}</p>
                        <p className="mb-1 text-white"><strong>Email:</strong> {selectedTicket.mentorId?.email || "N/A"}</p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-1 text-white"><strong>Phone:</strong> {selectedTicket.mentorId?.phone || "N/A"}</p>
                        <p className="mb-1 text-white"><strong>Username:</strong> {selectedTicket.mentorId?.username || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ticket Details */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <p className="mb-1 text-white"><strong>Category:</strong> {selectedTicket.category}</p>
                    <p className="mb-1 text-white"><strong>Priority:</strong> 
                      <span className="ms-2 text-white" style={{ padding: '4px 8px', border: '1px solid white', borderRadius: '4px' }}>
                        {selectedTicket.priority?.toUpperCase()}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1 text-white"><strong>Status:</strong> 
                      <span className="ms-2 text-white" style={{ padding: '4px 8px', border: '1px solid white', borderRadius: '4px' }}>
                        {selectedTicket.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </p>
                    <p className="mb-1 text-white"><strong>Created:</strong> {formatDateWithAmPm(selectedTicket.createdAt)}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <strong className="text-white">
                    <Icon icon="mdi:text-box" width="18" className="me-1" />
                    Subject:
                  </strong>
                  <p className="mt-1 text-white">{selectedTicket.subject}</p>
                </div>

                <div className="mb-3">
                  <strong className="text-white">
                    <Icon icon="mdi:file-document" width="18" className="me-1" />
                    Description:
                  </strong>
                  <p className="mt-1 p-3 rounded text-white" style={{ border: '1px solid white' }}>{selectedTicket.description}</p>
                </div>

                {selectedTicket.userRemarks && (
                  <div className="mb-3">
                    <strong className="text-white">
                      <Icon icon="mdi:comment-account" width="18" className="me-1" />
                      Mentor Remarks:
                    </strong>
                    <p className="mt-1 p-3 rounded text-white" style={{ border: '1px solid white' }}>
                      {selectedTicket.userRemarks}
                    </p>
                    {selectedTicket.feedbackAt && (
                      <small style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Provided on: {formatDateWithAmPm(selectedTicket.feedbackAt)}
                      </small>
                    )}
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label">
                    <strong className="text-white">
                      <Icon icon="mdi:reply" width="18" className="me-1" />
                      Admin Response:
                    </strong>
                  </label>
                  <textarea
                    className="form-control text-white"
                    style={{ backgroundColor: 'transparent', border: '1px solid white' }}
                    rows="5"
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Enter your response to the mentor..."
                  ></textarea>
                  <small style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Provide a detailed response to help resolve the mentor's query
                  </small>
                </div>

                {selectedTicket.respondedBy && selectedTicket.respondedAt && (
                  <div className="p-3 rounded" style={{ border: '1px solid white', backgroundColor: 'transparent' }}>
                    <Icon icon="mdi:information" width="18" className="me-2 text-white" />
                    <span className="text-white">Last responded at: {formatDateWithAmPm(selectedTicket.respondedAt)}</span>
                  </div>
                )}
              </div>
              <div className="modal-footer" style={{ borderTop: '1px solid white' }}>
                <button
                  type="button"
                  className="btn text-white"
                  style={{ backgroundColor: 'transparent', border: '1px solid white' }}
                  onClick={() => setShowModal(false)}
                >
                  <Icon icon="mdi:close" width="18" className="me-1" />
                  Close
                </button>
                <button
                  type="button"
                  className="btn text-white"
                  style={{ backgroundColor: 'transparent', border: '1px solid white' }}
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
    </>
  );
};

export default AllMentorSupportTickets;