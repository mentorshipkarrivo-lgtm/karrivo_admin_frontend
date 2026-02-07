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
      <DashboardLayout>
        <section className="profile_section user__management py-4">
          <div className="container-fluid">
            <div className="row">
              {/* Stats Cards */}
              <div className="col-12 col-sm-6 col-md-6 col-xl-3">
                <div className="my_total_team_data mb-4 rounded-3 px-3 py-3 py-md-4">
                  <div className="total_user_card d-flex align-items-center gap-2 gap-md-3">
                    <div className="total_user_images rounded-3 p-2 p-md-4">
                      <img
                        src="/images/total-member.png"
                        alt="total-tickets"
                        className="img-fluid"
                      />
                    </div>
                    <div className="total_user_card_data">
                      <h2>{totalRecords}</h2>
                      <h5>Total Tickets</h5>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-md-6 col-xl-3">
                <div className="my_total_team_data mb-4 rounded-3 px-3 py-3 py-md-4">
                  <div className="total_user_card d-flex align-items-center gap-2 gap-md-3">
                    <div className="total_user_images rounded-3 p-2 p-md-4">
                      <img
                        src="/images/total-member.png"
                        alt="pending-tickets"
                        className="img-fluid"
                      />
                    </div>
                    <div className="total_user_card_data">
                      <h2>{data?.tickets?.filter(t => t.status === 'pending').length || 0}</h2>
                      <h5>Pending</h5>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-md-6 col-xl-3">
                <div className="my_total_team_data mb-4 rounded-3 px-3 py-3 py-md-4">
                  <div className="total_user_card d-flex align-items-center gap-2 gap-md-3">
                    <div className="total_user_images rounded-3 p-2 p-md-4">
                      <img
                        src="/images/total-member.png"
                        alt="in-progress-tickets"
                        className="img-fluid"
                      />
                    </div>
                    <div className="total_user_card_data">
                      <h2>{data?.tickets?.filter(t => t.status === 'in_progress').length || 0}</h2>
                      <h5>In Progress</h5>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-md-6 col-xl-3">
                <div className="my_total_team_data mb-4 rounded-3 px-3 py-3 py-md-4">
                  <div className="total_user_card d-flex align-items-center gap-2 gap-md-3">
                    <div className="total_user_images rounded-3 p-2 p-md-4">
                      <img
                        src="/images/total-member.png"
                        alt="resolved-tickets"
                        className="img-fluid"
                      />
                    </div>
                    <div className="total_user_card_data">
                      <h2>{data?.tickets?.filter(t => t.status === 'resolved').length || 0}</h2>
                      <h5>Resolved</h5>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Table Section */}
              <div className="col-12">
                <div className="my_total_team_data rounded-3 px-3 py-4">
                  <h1 className="mb-3">Mentor Support Tickets</h1>

                  {/* FILTERS */}
                  <div className="row justify-content-between">
                    {/* Items per page selector */}
                    <div className="col-12 col-sm-6 col-md-2 col-xxl-1">
                      <div className="pagination__box mb-4">
                        <div className="showing_data">
                          <select
                            className="form-select shadow-none"
                            aria-label="Default select example"
                            value={state.perPage}
                            onChange={(e) =>
                              setState({
                                ...state,
                                perPage: Number(e.target.value),
                                currentPage: 1,
                              })
                            }
                          >
                            <option value="10">10</option>
                            <option value="30">30</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-sm-12 col-md-10">
                      <div className="row g-2 mb-4">
                        <div className="col-12 col-sm-6 col-md-3">
                          <div className="select_level_data">
                            <select
                              className="form-select shadow-none"
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
                        </div>

                        <div className="col-12 col-sm-6 col-md-3">
                          <div className="select_level_data">
                            <select
                              className="form-select shadow-none"
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
                        </div>

                        <div className="col-12 col-sm-6 col-md-2">
                          <div className="select_level_data">
                            <select
                              className="form-select shadow-none"
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
                        </div>

                        <div className="col-12 col-sm-6 col-md-3 col-lg-3">
                          <div className="select_level_data">
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
                          </div>
                        </div>

                        <div className="col-12 col-sm-6 col-md-1">
                          <button 
                            className="btn w-100"
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
                  <div className="table_data table-responsive">
                    {isLoading ? (
                      <div className="text-center py-5">
                        <ClipLoader size={50} color="#eb660f" />
                        <p className="mt-3">Loading mentor support tickets...</p>
                      </div>
                    ) : error ? (
                      <div className="text-center py-3">
                        <Icon icon="mdi:alert-circle" width="24" className="me-2" />
                        <span>Failed to load tickets. Please try again.</span>
                        <button 
                          className="btn btn-sm ms-3"
                          onClick={() => refetch()}
                        >
                          Retry
                        </button>
                      </div>
                    ) : (
                      <table className="table mb-0">
                        <thead>
                          <tr>
                            <th scope="col">S.No</th>
                            <th scope="col">Ticket ID</th>
                            <th scope="col">Mentor Details</th>
                            <th scope="col">Subject</th>
                            <th scope="col">Category</th>
                            <th scope="col">Priority</th>
                            <th scope="col">Status</th>
                            <th scope="col">Created At</th>
                            <th scope="col">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedTickets.length ? (
                            paginatedTickets.map((ticket, i) => (
                              <tr key={ticket._id}>
                                <td>{startIndex + i + 1}</td>
                                <td>
                                  <span className="badge bg-secondary">
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
                                  <span className="badge bg-info">
                                    {ticket.category}
                                  </span>
                                </td>
                                <td>
                                  <span className={`badge ${
                                    ticket.priority === 'urgent' ? 'bg-danger' :
                                    ticket.priority === 'high' ? 'bg-warning' :
                                    ticket.priority === 'medium' ? 'bg-primary' : 'bg-secondary'
                                  }`}>
                                    {ticket.priority?.toUpperCase()}
                                  </span>
                                </td>
                                <td>
                                  <select
                                    className="form-select form-select-sm shadow-none"
                                    style={{ minWidth: '120px' }}
                                    value={ticket.status}
                                    onChange={(e) => handleQuickStatusUpdate(ticket._id, e.target.value)}
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
                                    className="bg-transparent border-0"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => openResponseModal(ticket)}
                                    title="View/Add Response"
                                    data-bs-toggle="modal"
                                    data-bs-target="#responseModal"
                                  >
                                    <img
                                      src="/images/icons/show.svg"
                                      alt="icon"
                                      title="View Details"
                                    />
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="9" className="text-center py-4">
                                <Icon icon="mdi:ticket-outline" width="48" className="mb-2 text-muted" />
                                <p className="mb-0">No mentor support tickets found</p>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                {/* Pagination */}
                {totalRecords > 0 && (
                  <Pagination
                    currentPage={state.currentPage}
                    totalPages={Math.ceil(totalRecords / state.perPage) || 1}
                    onPageChange={(page) =>
                      setState({ ...state, currentPage: page })
                    }
                  />
                )}
              </div>
            </div>
          </div>

          {/* Response Modal */}
          <div
            className="modal fade common__modal"
            id="responseModal"
            tabIndex="-1"
            aria-labelledby="responseModalLabel"
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
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body pt-0 px-4">
                  <h1 className="modal-title mb-4" id="responseModalLabel">
                    <Icon icon="mdi:ticket" width="24" className="me-2" />
                    Ticket Details - {selectedTicket?.ticketId}
                  </h1>
                  {selectedTicket && (
                    <div className="ticket-details">
                      {/* Mentor Information */}
                      <div className="card mb-3">
                        <div className="card-header">
                          <Icon icon="mdi:account" width="20" className="me-2" />
                          Mentor Information
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <div className="form__box">
                                <label>Name</label>
                                <input
                                  type="text"
                                  className="form-control shadow-none"
                                  value={selectedTicket.mentorId?.name || "N/A"}
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
                                  value={selectedTicket.mentorId?.email || "N/A"}
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
                                  value={selectedTicket.mentorId?.phone || "N/A"}
                                  readOnly
                                />
                              </div>
                            </div>
                            <div className="col-md-6 mb-3">
                              <div className="form__box">
                                <label>Username</label>
                                <input
                                  type="text"
                                  className="form-control shadow-none"
                                  value={selectedTicket.mentorId?.username || "N/A"}
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Ticket Details */}
                      <div className="row mb-3">
                        <div className="col-md-6 mb-3">
                          <div className="form__box">
                            <label>Category</label>
                            <input
                              type="text"
                              className="form-control shadow-none"
                              value={selectedTicket.category}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="form__box">
                            <label>Priority</label>
                            <input
                              type="text"
                              className="form-control shadow-none"
                              value={selectedTicket.priority?.toUpperCase()}
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
                              value={selectedTicket.status.replace('_', ' ').toUpperCase()}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="form__box">
                            <label>Created At</label>
                            <input
                              type="text"
                              className="form-control shadow-none"
                              value={formatDateWithAmPm(selectedTicket.createdAt)}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="form__box">
                          <label>
                            <Icon icon="mdi:text-box" width="18" className="me-1" />
                            Subject
                          </label>
                          <input
                            type="text"
                            className="form-control shadow-none"
                            value={selectedTicket.subject}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="form__box">
                          <label>
                            <Icon icon="mdi:file-document" width="18" className="me-1" />
                            Description
                          </label>
                          <textarea
                            className="form-control shadow-none"
                            rows="4"
                            value={selectedTicket.description}
                            readOnly
                          />
                        </div>
                      </div>

                      {selectedTicket.userRemarks && (
                        <div className="mb-3">
                          <div className="form__box">
                            <label>
                              <Icon icon="mdi:comment-account" width="18" className="me-1" />
                              Mentor Remarks
                            </label>
                            <textarea
                              className="form-control shadow-none"
                              rows="3"
                              value={selectedTicket.userRemarks}
                              readOnly
                            />
                            {selectedTicket.feedbackAt && (
                              <small className="text-muted">
                                Provided on: {formatDateWithAmPm(selectedTicket.feedbackAt)}
                              </small>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="mb-3">
                        <div className="form__box">
                          <label>
                            <Icon icon="mdi:reply" width="18" className="me-1" />
                            Admin Response
                          </label>
                          <textarea
                            className="form-control shadow-none"
                            rows="5"
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                            placeholder="Enter your response to the mentor..."
                          />
                          <small className="text-muted">
                            Provide a detailed response to help resolve the mentor's query
                          </small>
                        </div>
                      </div>

                      {selectedTicket.respondedBy && selectedTicket.respondedAt && (
                        <div className="alert alert-info">
                          <Icon icon="mdi:information" width="18" className="me-2" />
                          Last responded at: {formatDateWithAmPm(selectedTicket.respondedAt)}
                        </div>
                      )}

                      <div className="text-center my-4">
                        <button
                          type="button"
                          className="btn btn-secondary px-3 me-2"
                          data-bs-dismiss="modal"
                          onClick={() => setShowModal(false)}
                        >
                          <Icon icon="mdi:close" width="18" className="me-1" />
                          Close
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary px-3"
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

export default AllMentorSupportTickets;