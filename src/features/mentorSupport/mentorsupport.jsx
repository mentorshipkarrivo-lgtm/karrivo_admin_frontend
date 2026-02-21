

// src/pages/admin/AllMentorSupportTickets.jsx
import React, { useState, useRef, useEffect } from "react";
import DashboardLayout from "../../Layout/DashboardLayout";
import { Icon } from "@iconify/react/dist/iconify.js";
import Pagination from "../../components/Pagination";
import {
  useGetAllMentorSupportTicketsQuery,
  useUpdateMentorSupportTicketMutation,
  useRespondToMentorTicketMutation,
} from "./mentorsupportslice";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

const AllMentorSupportTickets = () => {
  // ─── Filter State ──────────────────────────────────────────────────────────
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedPriority, setSelectedPriority] = useState("All Priorities");

  // ─── Modal State ───────────────────────────────────────────────────────────
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [response, setResponse] = useState("");
  const activeTicketRef = useRef(null);

  // ─── Pagination ────────────────────────────────────────────────────────────
  const [state, setState] = useState({ currentPage: 1, perPage: 10, search: "" });

  // ─── API ───────────────────────────────────────────────────────────────────
  const { data, isLoading, error, refetch } = useGetAllMentorSupportTicketsQuery();
  const [updateTicket, { isLoading: isUpdating }] = useUpdateMentorSupportTicketMutation();
  const [respondToTicket, { isLoading: isResponding }] = useRespondToMentorTicketMutation();

  // ─── Clear state only AFTER Bootstrap finishes hiding the modal ────────────
  useEffect(() => {
    const modalEl = document.getElementById("responseModal");
    if (!modalEl) return;

    const onHidden = () => {
      setSelectedTicket(null);
      setResponse("");
      activeTicketRef.current = null;
    };

    modalEl.addEventListener("hidden.bs.modal", onHidden);
    return () => modalEl.removeEventListener("hidden.bs.modal", onHidden);
  }, []);

  // ─── Helpers ───────────────────────────────────────────────────────────────
  const formatDate = (iso) => {
    if (!iso) return "N/A";
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, "0");
    let h = d.getUTCHours();
    const ap = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${pad(d.getUTCDate())}-${pad(d.getUTCMonth() + 1)}-${d.getUTCFullYear()} ${h}:${pad(d.getUTCMinutes())} ${ap}`;
  };

  const priorityClass = (p) =>
    p === "urgent" ? "bg-danger"
      : p === "high" ? "bg-warning text-dark"
        : p === "medium" ? "bg-primary"
          : "bg-secondary";

  // ─── Filter + Paginate ─────────────────────────────────────────────────────
  const filtered = (data?.tickets || []).filter((t) => {
    const q = state.search.toLowerCase();
    return (
      (selectedStatus === "All Status" || t.status === selectedStatus) &&
      (selectedCategory === "All Categories" || t.category === selectedCategory) &&
      (selectedPriority === "All Priorities" || t.priority === selectedPriority) &&
      (
        t.subject?.toLowerCase().includes(q) ||
        t.ticketId?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q) ||
        t.mentorId?.name?.toLowerCase().includes(q) ||
        t.mentorId?.email?.toLowerCase().includes(q)
      )
    );
  });

  const totalRecords = filtered.length;
  const startIdx = (state.currentPage - 1) * state.perPage;
  const paginated = filtered.slice(startIdx, startIdx + state.perPage);

  // ─── Stat counts ───────────────────────────────────────────────────────────
  const all = data?.tickets || [];

  const statsCards = [
    { label: "Total Tickets", count: totalRecords },
    { label: "Pending",       count: all.filter((t) => t.status === "pending").length },
    { label: "In Progress",   count: all.filter((t) => t.status === "in_progress").length },
    { label: "Resolved",      count: all.filter((t) => t.status === "resolved").length },
  ];

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const resetFilters = () => {
    setState({ ...state, search: "", currentPage: 1 });
    setSelectedStatus("All Status");
    setSelectedCategory("All Categories");
    setSelectedPriority("All Priorities");
  };

  const handleQuickStatusUpdate = async (ticketId, newStatus) => {
    try {
      await updateTicket({ ticketId, updates: { status: newStatus } }).unwrap();
      toast.success(`Status updated to ${newStatus.replace("_", " ")}`);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  const openModal = (ticket) => {
    activeTicketRef.current = ticket;
    setSelectedTicket(ticket);
    setResponse(ticket.response || "");
  };

  const handleSubmitResponse = async () => {
    const ticket = activeTicketRef.current;
    if (!response.trim()) { toast.error("Please enter a response"); return; }
    if (!ticket) return;

    try {
      const admin = JSON.parse(localStorage.getItem("adminData") || "{}");
      const respondedBy = admin._id || admin.id;

      await respondToTicket({ ticketId: ticket._id, response, respondedBy }).unwrap();

      toast.success("Response submitted successfully!", { position: "top-center", autoClose: 4000 });
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to submit response", { position: "top-center" });
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout>
      <style>{`
        /* Equal-height stat cards */
        .stat-card-col { display: flex; margin-bottom: 1.5rem; }
        .stat-card-inner { display: flex; align-items: center; width: 100%; border-radius: 0.5rem; padding: 1rem 1.25rem; }
        @media (min-width: 768px) { .stat-card-inner { padding: 1.25rem 1.5rem; } }
        .stat-card-icon { flex-shrink: 0; border-radius: 0.5rem; padding: 0.6rem; display: flex; align-items: center; justify-content: center; }
        @media (min-width: 768px) { .stat-card-icon { padding: 0.85rem; } }
        .stat-card-icon img { width: 40px; height: 40px; object-fit: contain; display: block; }
        .stat-card-text h2 { margin-bottom: 0.1rem; line-height: 1.2; }
        .stat-card-text h5 { margin-bottom: 0; }
      `}</style>

      <section className="profile_section user__management py-4">
        <div className="container-fluid">
          <div className="row">

            {/* ── Statistics Cards ── */}
            {statsCards.map(({ label, count }) => (
              <div key={label} className="col-12 col-sm-6 col-xl-3 stat-card-col">
                <div className="my_total_team_data stat-card-inner">
                  <div className="total_user_card d-flex align-items-center gap-2 gap-md-3 w-100">
                    <div className="total_user_images stat-card-icon">
                      <img src="/images/total-member.png" alt={label} />
                    </div>
                    <div className="total_user_card_data stat-card-text">
                      <h2>{count}</h2>
                      <h5>{label}</h5>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* ── Table section ── */}
            <div className="col-12">
              <div className="my_total_team_data rounded-3 px-3 py-4">
                <h1 className="mb-3">Mentor Support Tickets</h1>

                {/* Filters */}
                <div className="row justify-content-between">
                  <div className="col-12 col-sm-6 col-md-2 col-xxl-1">
                    <div className="pagination__box mb-4">
                      <select
                        className="form-select shadow-none"
                        value={state.perPage}
                        onChange={(e) => setState({ ...state, perPage: Number(e.target.value), currentPage: 1 })}
                      >
                        {[10, 30, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="col-12 col-sm-12 col-md-10">
                    <div className="row g-2 mb-4">
                      <div className="col-12 col-sm-6 col-md-3">
                        <select className="form-select shadow-none" value={selectedStatus}
                          onChange={(e) => { setSelectedStatus(e.target.value); setState({ ...state, currentPage: 1 }); }}>
                          <option value="All Status">All Status</option>
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>

                      <div className="col-12 col-sm-6 col-md-3">
                        <select className="form-select shadow-none" value={selectedCategory}
                          onChange={(e) => { setSelectedCategory(e.target.value); setState({ ...state, currentPage: 1 }); }}>
                          <option value="All Categories">All Categories</option>
                          {["Technical Issue", "Session Management", "Mentee Related",
                            "Payment/Billing", "Account Settings", "Platform Features", "Other"]
                            .map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      <div className="col-12 col-sm-6 col-md-2">
                        <select className="form-select shadow-none" value={selectedPriority}
                          onChange={(e) => { setSelectedPriority(e.target.value); setState({ ...state, currentPage: 1 }); }}>
                          <option value="All Priorities">All Priorities</option>
                          {["low", "medium", "high", "urgent"].map((p) => (
                            <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-12 col-sm-6 col-md-3">
                        <div className="input-group search_group">
                          <span className="input-group-text border-0 shadow-none bg-transparent rounded-0 pe-0">
                            <Icon icon="tabler:search" width="16" height="16" style={{ color: "var(--white)" }} />
                          </span>
                          <input
                            type="text"
                            autoComplete="off"
                            className="form-control border-0 shadow-none rounded-0 bg-transparent"
                            placeholder="Search"
                            value={state.search}
                            onChange={(e) => setState({ ...state, search: e.target.value, currentPage: 1 })}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-sm-6 col-md-1">
                        <button className="btn w-100" onClick={resetFilters} title="Reset Filters">
                          <Icon icon="mdi:refresh" width="20" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="table_data table-responsive">
                  {isLoading ? (
                    <div className="text-center py-5">
                      <ClipLoader size={50} color="#eb660f" />
                      <p className="mt-3">Loading mentor support tickets...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center py-3">
                      <Icon icon="mdi:alert-circle" width="24" className="me-2" />
                      <span>Failed to load tickets.</span>
                      <button className="btn btn-sm ms-3" onClick={refetch}>Retry</button>
                    </div>
                  ) : (
                    <table className="table mb-0">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Ticket ID</th>
                          <th>Mentor ID</th>
                          <th>Subject</th>
                          <th>Category</th>
                          <th>Priority</th>
                          <th>Status</th>
                          <th>Created At</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginated.length ? (
                          paginated.map((ticket, i) => (
                            <tr key={ticket._id}>
                              <td>{startIdx + i + 1}</td>
                              <td><span className="badge">{ticket.ticketId}</span></td>
                              <td><div className="fw-semibold small">{ticket.mentorId || "N/A"}</div></td>
                              <td>
                                <div className="text-truncate" style={{ maxWidth: "220px" }} title={ticket.subject}>
                                  {ticket.subject}
                                </div>
                              </td>
                              <td><span className="badge">{ticket.category}</span></td>
                              <td>
                                <span className={`badge ${priorityClass(ticket.priority)}`}>
                                  {ticket.priority?.toUpperCase()}
                                </span>
                              </td>
                              <td>
                                <select
                                  className="form-select form-select-sm shadow-none"
                                  style={{ minWidth: "120px" }}
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
                              <td className="text-nowrap small">{formatDate(ticket.createdAt)}</td>
                              <td>
                                <button
                                  className="bg-transparent border-0"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => openModal(ticket)}
                                  data-bs-toggle="modal"
                                  data-bs-target="#responseModal"
                                  title="View / Respond"
                                >
                                  <img src="/images/icons/show.svg" alt="View" />
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

              {totalRecords > 0 && (
                <Pagination
                  currentPage={state.currentPage}
                  totalPages={Math.ceil(totalRecords / state.perPage) || 1}
                  onPageChange={(page) => setState({ ...state, currentPage: page })}
                />
              )}
            </div>
          </div>
        </div>

        {/* ── Response Modal ─────────────────────────────────────────────────── */}
        <div
          className="modal fade common__modal"
          id="responseModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">

              <div className="modal-header border-0 pb-0">
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
              </div>

              <div className="modal-body pt-0 px-4">
                {selectedTicket && (
                  <>
                    <h1 className="modal-title mb-4">
                      <Icon icon="mdi:ticket" width="24" className="me-2" />
                      Ticket Details — {selectedTicket.ticketId}
                    </h1>

                    {/* Meta Fields */}
                    <div className="row mb-3">
                      {[
                        { label: "Category",   value: selectedTicket.category },
                        { label: "Priority",   value: selectedTicket.priority?.toUpperCase() },
                        { label: "Status",     value: selectedTicket.status?.replace("_", " ").toUpperCase() },
                        { label: "Created At", value: formatDate(selectedTicket.createdAt) },
                      ].map(({ label, value }) => (
                        <div key={label} className="col-md-6 mb-3">
                          <div className="form__box">
                            <label>{label}</label>
                            <input type="text" className="form-control shadow-none" value={value || ""} readOnly />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Subject */}
                    <div className="mb-3">
                      <div className="form__box">
                        <label><Icon icon="mdi:text-box" width="18" className="me-1" />Subject</label>
                        <input type="text" className="form-control shadow-none" value={selectedTicket.subject || ""} readOnly />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-3">
                      <div className="form__box">
                        <label><Icon icon="mdi:file-document" width="18" className="me-1" />Description</label>
                        <textarea className="form-control shadow-none" rows="4" value={selectedTicket.description || ""} readOnly />
                      </div>
                    </div>

                    {/* Mentor Remarks */}
                    {selectedTicket.userRemarks && (
                      <div className="mb-3">
                        <div className="form__box">
                          <label><Icon icon="mdi:comment-account" width="18" className="me-1" />Mentor Remarks</label>
                          <textarea className="form-control shadow-none" rows="3" value={selectedTicket.userRemarks} readOnly />
                          {selectedTicket.feedbackAt && (
                            <small className="text-muted">Provided on: {formatDate(selectedTicket.feedbackAt)}</small>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Admin Response */}
                    <div className="mb-3">
                      <div className="form__box">
                        <label><Icon icon="mdi:reply" width="18" className="me-1" />Admin Response</label>
                        <textarea
                          className="form-control shadow-none"
                          rows="5"
                          value={response}
                          onChange={(e) => setResponse(e.target.value)}
                          placeholder="Enter your response to the mentor..."
                        />
                        <small className="text-muted">Provide a detailed response to help resolve the mentor's query.</small>
                      </div>
                    </div>

                    {/* Last responded */}
                    {selectedTicket.respondedBy && selectedTicket.respondedAt && (
                      <div className="alert alert-info">
                        <Icon icon="mdi:information" width="18" className="me-2" />
                        Last responded at: {formatDate(selectedTicket.respondedAt)}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="text-center my-4 d-flex justify-content-center gap-3">
                      <button type="button" className="btn btn-secondary px-4" data-bs-dismiss="modal">
                        <Icon icon="mdi:close" width="18" className="me-1" />
                        Close
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary px-4"
                        data-bs-dismiss="modal"
                        onClick={handleSubmitResponse}
                        disabled={isResponding || !response.trim()}
                      >
                        {isResponding ? (
                          <><ClipLoader size={16} color="#fff" className="me-2" />Saving...</>
                        ) : (
                          <><Icon icon="mdi:send" width="18" className="me-1" />Submit Response</>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>

            </div>
          </div>
        </div>

      </section>
    </DashboardLayout>
  );
};

export default AllMentorSupportTickets;