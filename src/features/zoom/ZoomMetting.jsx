import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Link,
  FileText,
  Video,
  CheckCircle,
  Calendar,
  Activity,
  Filter,
  Plus,
  Trash2,
  Pencil,
} from "lucide-react";
import DashboardLayout from "../../Layout/DashboardLayout";
import {
  useCreateZoomMeetingMutation,
  useGetAllZoomMeetingsQuery,
  useUpdateZoomMeetingMutation,
  useDeleteZoomMeetingMutation,
} from "./zoomMeetingApiSlice";

// Validation schema using Yup
const validationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  subTitle: Yup.string()
    .required("Sub Title is required")
    .min(3, "Sub Title must be at least 3 characters"),
  url: Yup.string().required("URL is required").url("Please enter a valid URL"),
  videoId: Yup.string()
    .required("Video ID is required")
    .min(1, "Video ID cannot be empty"),
  type: Yup.string().required("Meeting type is required"),
});

// Initial form values
const initialValues = {
  title: "",
  subTitle: "",
  url: "",
  videoId: "",
  type: "",
};

function ZoomMeeting() {
  const [submittedMeeting, setSubmittedMeeting] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [selectedType, setSelectedType] = useState("all");

  // Video types for filtering
  const videoTypes = [
    { value: "all", label: "All Videos" },
    { value: "zoom meet", label: "Zoom Meetings" },
    { value: "youtube", label: "YouTube Videos" },
    { value: "google meet", label: "Google Meet" },
  ];
  // API queries and mutations
  const {
    data: allMeetings,
    isLoading: loadingMeetings,
    refetch: refetchMeetings,
  } = useGetAllZoomMeetingsQuery({ page: currentPage, limit });

  const [createZoomMeeting, { isLoading: creatingMeeting }] =
    useCreateZoomMeetingMutation();
  const [updateZoomMeeting, { isLoading: updatingMeeting }] =
    useUpdateZoomMeetingMutation();
  const [deleteZoomMeeting, { isLoading: deletingMeeting }] =
    useDeleteZoomMeetingMutation();

  // Toast configuration
  const toastConfig = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Create payload matching the required format
      const payload = {
        url: values.url,
        title: values.title,
        videoId: values.videoId,
        subTitle: values.subTitle,
        type: values.type,
      };

      console.log("Payload to send:", payload);

      // Make API call
      const result = await createZoomMeeting(payload).unwrap();

      if (result.success || result) {
        toast.success("Zoom meeting created successfully!", toastConfig);
        setSubmittedMeeting(values);
        resetForm();
        refetchMeetings(); // Refresh the meetings list
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error?.data?.message ||
          "Failed to create Zoom meeting. Please try again.",
        toastConfig
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle update meeting
  const handleUpdateMeeting = async (values, { setSubmitting }) => {
    try {
      // Create payload with ID for update
      const payload = {
        id: editingMeeting.id,
        url: values.url,
        title: values.title,
        videoId: values.videoId,
        subTitle: values.subTitle,
        type: values.type,
      };

      console.log("Update payload:", payload);

      // Make API call
      const result = await updateZoomMeeting(payload).unwrap();

      if (result.success || result) {
        toast.success("Zoom meeting updated successfully!", toastConfig);
        setShowEditModal(false);
        setEditingMeeting(null);
        refetchMeetings(); // Refresh the meetings list
      }
    } catch (error) {
      console.error("Error updating meeting:", error);
      toast.error(
        error?.data?.message ||
          "Failed to update Zoom meeting. Please try again.",
        toastConfig
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete meeting
  const handleDeleteMeeting = async (meetingId, meetingTitle) => {
    if (toast.success("Zoom meeting deleted successfully!", toastConfig)) {
      try {
        const result = await deleteZoomMeeting(meetingId).unwrap();

        if (result.success || result) {
          toast.success("Zoom meeting deleted successfully!", toastConfig);
          refetchMeetings(); // Refresh the meetings list
        }
      } catch (error) {
        console.error("Error deleting meeting:", error);
        toast.error(
          error?.data?.message ||
            "Failed to delete Zoom meeting. Please try again.",
          toastConfig
        );
      }
    }
  };

  // Open edit modal
  const openEditModal = (meeting) => {
    setEditingMeeting({
      id: meeting._id,
      title: meeting.title,
      subTitle: meeting.subTitle,
      url: meeting.url,
      videoId: meeting.videoId,
      type: meeting.type || "",
    });
    setShowEditModal(true);
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setCurrentPage(1); // Reset to first page when changing limit
  };

  // Handle type filter change
  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setCurrentPage(1);
  };

  // Filter meetings by type
  const filteredMeetings =
    allMeetings?.data?.videos?.filter((meeting) => {
      if (selectedType === "all") return true;
      return meeting.type === selectedType;
    }) || [];

  // Generate page numbers for pagination
  const renderPaginationButtons = () => {
    const pagination = allMeetings?.data?.pagination;
    if (!pagination || pagination.totalPages <= 1) return null;

    const buttons = [];
    const maxButtons = 5;
    const currentPage = pagination.currentPage;
    const totalPages = pagination.totalPages;

    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={`btn btn-sm mx-1 ${
            i === currentPage ? "text-white" : "btn-outline-light"
          }`}
          onClick={() => handlePageChange(i)}
          style={{
            backgroundColor: i === currentPage ? "#f29b0a" : "transparent",
            borderColor: i === currentPage ? "#f29b0a" : "#64748b",
            minWidth: "40px",
          }}
        >
          {i}
        </button>
      );
    }

    return buttons;
  };

  // Enhanced Stats Card Component
  const StatsCard = ({
    title,
    value,
    icon: IconComponent,
    gradient,
    isLoading,
  }) => (
    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4">
      <div
        className="card h-100 border-0 shadow-lg position-relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
          transform: "translateY(0)",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow =
            "0 10px 25px rgba(242, 155, 10, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "";
        }}
      >
        <div className="position-absolute top-0 end-0 p-3 opacity-25">
          <IconComponent size={60} color="white" />
        </div>
        <div className="card-body text-white position-relative">
          <div className="d-flex align-items-center mb-3">
            <div
              className="p-3 rounded-circle me-3"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            >
              <IconComponent size={24} color="white" />
            </div>
            <div>
              <h6 className="card-title mb-0 text-white-50 small fw-normal">
                {title}
              </h6>
            </div>
          </div>
          {isLoading ? (
            <div className="d-flex align-items-center justify-content-center py-2">
              <div
                className="spinner-border spinner-border-sm text-white"
                role="status"
                style={{ width: "1.5rem", height: "1.5rem" }}
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <h2
              className="mb-0 fw-bold text-white"
              style={{ fontSize: "2rem" }}
            >
              {value || 0}
            </h2>
          )}
        </div>
      </div>
    </div>
  );

  // Meeting Card Component
  const MeetingCard = ({ meeting }) => (
    <div className="col-xl-6 col-lg-8 col-md-10 mb-4">
      <div
        className="card h-100 border-0 shadow-lg position-relative overflow-hidden"
        style={{
          backgroundColor: "#1e293b",
          border: "1px solid #334155",
          transform: "translateY(0)",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-8px)";
          e.currentTarget.style.boxShadow =
            "0 15px 35px rgba(242, 155, 10, 0.2)";
          e.currentTarget.style.borderColor = "#f29b0a";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "";
          e.currentTarget.style.borderColor = "#334155";
        }}
      >
        {/* Success indicator */}
        <div
          className="position-absolute top-0 end-0"
          style={{
            width: "0",
            height: "0",
            borderLeft: "50px solid transparent",
            borderTop: "50px solid #f29b0a",
          }}
        >
          <CheckCircle
            size={16}
            color="white"
            className="position-absolute"
            style={{ top: "-45px", right: "-45px" }}
          />
        </div>

        <div className="card-body p-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center">
              <div
                className="p-3 rounded-circle me-3"
                style={{ backgroundColor: "#f29b0a" }}
              >
                <Video size={24} color="white" />
              </div>
              <div>
                <h5 className="card-title text-white mb-1 fw-bold">
                  {meeting.title}
                </h5>
                <span
                  className="badge px-3 py-2 rounded-pill text-white fw-semibold"
                  style={{
                    backgroundColor: "#f29b0a",
                    fontSize: "0.75rem",
                  }}
                >
                  <CheckCircle size={12} className="me-1" />
                  Created Successfully
                </span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="row g-2">
              <div className="col-12 mb-3">
                <div
                  className="p-3 rounded"
                  style={{
                    backgroundColor: "rgba(242, 155, 10, 0.1)",
                    border: "1px solid rgba(242, 155, 10, 0.2)",
                  }}
                >
                  <div className="d-flex align-items-center text-white mb-2">
                    <FileText
                      size={14}
                      className="me-2"
                      style={{ color: "#fff" }}
                    />
                    <small className="fw-medium">Sub Title</small>
                  </div>
                  <small className="text-white">{meeting.subTitle}</small>
                </div>
              </div>
              <div className="col-12 mb-3">
                <div
                  className="p-3 rounded"
                  style={{
                    backgroundColor: "rgba(100, 116, 139, 0.1)",
                    border: "1px solid rgba(100, 116, 139, 0.2)",
                  }}
                >
                  <div className="d-flex align-items-center text-white mb-2">
                    <Link
                      size={14}
                      className="me-2"
                      style={{ color: "#fff" }}
                    />
                    <small className="fw-medium">Meeting URL</small>
                  </div>
                  <a
                    href={meeting.url}
                    className="text-decoration-none"
                    style={{ color: "#f29b0a", fontSize: "0.875rem" }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {meeting.url}
                  </a>
                </div>
              </div>
              <div className="col-12">
                <div
                  className="p-3 rounded"
                  style={{
                    backgroundColor: "rgba(100, 116, 139, 0.1)",
                    border: "1px solid rgba(100, 116, 139, 0.2)",
                  }}
                >
                  <div className="d-flex align-items-center text-white mb-2">
                    <Video
                      size={14}
                      className="me-2"
                      style={{ color: "#fff" }}
                    />
                    <small className="fw-medium">Video ID</small>
                  </div>
                  <small className="text-white">{meeting.videoId}</small>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-sm flex-fill d-flex align-items-center justify-content-center"
              onClick={() => setSubmittedMeeting(null)}
              style={{
                backgroundColor: "#64748b",
                borderColor: "#64748b",
                color: "white",
                minHeight: "40px",
              }}
            >
              <Plus size={16} className="me-2" />
              Create Another
            </button>
            <button
              className="btn btn-sm flex-fill d-flex align-items-center justify-content-center"
              onClick={() => openEditModal(meeting)}
              style={{
                backgroundColor: "#f29b0a",
                borderColor: "#f29b0a",
                color: "white",
                minHeight: "40px",
              }}
            >
              <FileText size={16} className="me-2" />
              Edit Meeting
            </button>
            <button
              className="btn btn-sm flex-fill d-flex align-items-center justify-content-center"
              onClick={() => handleDeleteMeeting(meeting._id, meeting.title)}
              disabled={deletingMeeting}
              style={{
                backgroundColor: "#dc3545",
                borderColor: "#dc3545",
                color: "white",
                minHeight: "40px",
              }}
            >
              {deletingMeeting ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
              ) : (
                <Video size={16} className="me-2" />
              )}
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <section className="profile_section py-4">
        <div className="container-fluid">
          <div
            className="rounded-3 px-4 pb-4 py-4 position-relative overflow-hidden"
            style={{ backgroundColor: "#0f172a", minHeight: "100vh" }}
          >
            {/* Header Section */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-5">
              <div>
                <h3 className="mb-2 text-white fw-bold">
                  <Video
                    size={32}
                    className="me-3"
                    style={{ color: "#f29b0a" }}
                  />
                  Zoom Meeting Management
                </h3>
                <p className="text-white mb-0">
                  Create and manage your Zoom meetings efficiently
                </p>
              </div>
            </div>

            {/* Stats Section */}
            <div className="row mb-5">
              <StatsCard
                title="Total Meetings"
                value={
                  allMeetings?.data?.pagination?.totalCount ||
                  (submittedMeeting ? 1 : 0)
                }
                icon={Video}
                gradient={{ from: "#f29b0a", to: "#d97706" }}
                isLoading={loadingMeetings}
              />
              <StatsCard
                title="Active Meetings"
                value={
                  allMeetings?.data?.videos?.length ||
                  (submittedMeeting ? 1 : 0)
                }
                icon={CheckCircle}
                gradient={{ from: "#f29b0a", to: "#d97706" }}
                isLoading={loadingMeetings}
              />
              <StatsCard
                title="Total Pages"
                value={allMeetings?.data?.pagination?.totalPages || 1}
                icon={Activity}
                gradient={{ from: "#f29b0a", to: "#d97706" }}
                isLoading={loadingMeetings}
              />
              <StatsCard
                title="Current Page"
                value={allMeetings?.data?.pagination?.currentPage || 1}
                icon={Calendar}
                gradient={{ from: "#64748b", to: "#475569" }}
                isLoading={loadingMeetings}
              />
            </div>

            {/* Success Alert */}
            {submittedMeeting && (
              <div
                className="alert mb-4 border-0 shadow-sm"
                role="alert"
                style={{
                  backgroundColor: "rgba(242, 155, 10, 0.1)",
                  borderLeft: "4px solid #f29b0a",
                }}
              >
                <div className="d-flex align-items-center">
                  <CheckCircle
                    size={20}
                    className="me-2"
                    style={{ color: "#f29b0a" }}
                  />
                  <strong className="text-white">Meeting Created:</strong>
                  <span className="text-white ms-2">
                    {submittedMeeting.title}
                  </span>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="row">
              {/* Form Section */}
              <div className="col-xl-4 col-lg-5 mb-4">
                <div
                  className="card h-100 border-0 shadow-lg"
                  style={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                  }}
                >
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-4">
                      <div
                        className="p-3 rounded-circle me-3"
                        style={{ backgroundColor: "#f29b0a" }}
                      >
                        <Plus size={24} color="white" />
                      </div>
                      <div>
                        <h5 className="card-title text-white mb-1 fw-bold">
                          Create New Meeting
                        </h5>
                        <p className="text-white-50 mb-0 small">
                          Fill in the details to create a new meeting
                        </p>
                      </div>
                    </div>

                    <Formik
                      initialValues={initialValues}
                      validationSchema={validationSchema}
                      onSubmit={handleSubmit}
                    >
                      {({ isSubmitting, resetForm }) => (
                        <Form className="space-y-4">
                          {/* Title Field */}
                          <div className="mb-4">
                            <label className="form-label text-white fw-medium mb-2">
                              Title <span className="text-danger">*</span>
                            </label>
                            <Field
                              type="text"
                              name="title"
                              className="form-control bg-dark text-white border-secondary"
                              placeholder="Enter meeting title"
                              style={{
                                backgroundColor: "#0f172a",
                                borderColor: "#334155",
                                color: "white",
                              }}
                              disabled={creatingMeeting}
                            />
                            <ErrorMessage
                              name="title"
                              component="div"
                              className="text-danger small mt-1"
                            />
                          </div>

                          {/* Sub Title Field */}
                          <div className="mb-4">
                            <label className="form-label text-white fw-medium mb-2">
                              Sub Title <span className="text-danger">*</span>
                            </label>
                            <Field
                              type="text"
                              name="subTitle"
                              className="form-control bg-dark text-white border-secondary"
                              placeholder="Enter sub title"
                              style={{
                                backgroundColor: "#0f172a",
                                borderColor: "#334155",
                                color: "white",
                              }}
                              disabled={creatingMeeting}
                            />
                            <ErrorMessage
                              name="subTitle"
                              component="div"
                              className="text-danger small mt-1"
                            />
                          </div>

                          {/* URL Field */}
                          <div className="mb-4">
                            <label className="form-label text-white fw-medium mb-2">
                              URL <span className="text-danger">*</span>
                            </label>
                            <Field
                              type="url"
                              name="url"
                              className="form-control bg-dark text-white border-secondary"
                              placeholder="https://zoom.us/j/..."
                              style={{
                                backgroundColor: "#0f172a",
                                borderColor: "#334155",
                                color: "white",
                              }}
                              disabled={creatingMeeting}
                            />
                            <ErrorMessage
                              name="url"
                              component="div"
                              className="text-danger small mt-1"
                            />
                          </div>

                          {/* Video ID Field */}
                          <div className="mb-4">
                            <label className="form-label text-white fw-medium mb-2">
                              Video ID <span className="text-danger">*</span>
                            </label>
                            <Field
                              type="text"
                              name="videoId"
                              className="form-control bg-dark text-white border-secondary"
                              placeholder="Enter video ID"
                              style={{
                                backgroundColor: "#0f172a",
                                borderColor: "#334155",
                                color: "white",
                              }}
                              disabled={creatingMeeting}
                            />
                            <ErrorMessage
                              name="videoId"
                              component="div"
                              className="text-danger small mt-1"
                            />
                          </div>

                          {/* Meeting Type Field */}
                          <div className="mb-4">
                            <label className="form-label text-white fw-medium mb-2">
                              Meeting Type{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <Field
                              as="select"
                              name="type"
                              className="form-select bg-dark text-white border-secondary"
                              style={{
                                backgroundColor: "#0f172a",
                                borderColor: "#334155",
                                color: "white",
                              }}
                              disabled={creatingMeeting}
                            >
                              <option value="">Select meeting type</option>
                              <option value="zoom meet">Zoom Meet</option>
                              <option value="youtube">YouTube</option>
                              <option value="google meet">Google Meet</option>
                              <option value="social media">Social Media</option>
                            </Field>
                            <ErrorMessage
                              name="type"
                              component="div"
                              className="text-danger small mt-1"
                            />
                          </div>

                          {/* Buttons */}
                          <div className="d-flex gap-2 pt-2">
                            <button
                              type="submit"
                              disabled={isSubmitting || creatingMeeting}
                              className="btn flex-fill d-flex align-items-center justify-content-center"
                              style={{
                                backgroundColor: "#f29b0a",
                                borderColor: "#f29b0a",
                                color: "white",
                                minHeight: "45px",
                              }}
                            >
                              {isSubmitting || creatingMeeting ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2"></span>
                                  Creating...
                                </>
                              ) : (
                                <>
                                  <CheckCircle size={18} className="me-2" />
                                  Create Meeting
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => resetForm()}
                              disabled={isSubmitting || creatingMeeting}
                              className="btn btn-secondary"
                              style={{
                                backgroundColor: "#64748b",
                                borderColor: "#64748b",
                                minHeight: "45px",
                              }}
                            >
                              Clear
                            </button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>

              {/* Table Section */}
              <div className="col-xl-8 col-lg-7">
                <div className="table_data table-responsive">
                  {loadingMeetings ? (
                    <div className="text-center py-5">
                      <div
                        className="spinner-border text-primary mb-3"
                        role="status"
                        style={{
                          width: "3rem",
                          height: "3rem",
                          color: "#f29b0a !important",
                        }}
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="text-white h5">Loading meetings...</p>
                    </div>
                  ) : (
                    <table
                      className="table mb-0"
                      style={{
                        color: "white",
                        borderColor: "#334155",
                        borderRadius: "0.5rem",
                      }}
                    >
                      <thead>
                        <tr
                          className="text-center"
                          style={{ backgroundColor: "#f29b0a" }}
                        >
                          <th scope="col">S.No</th>
                          <th scope="col">Title</th>
                          <th scope="col">Sub Title</th>
                          <th scope="col">Type</th>
                          <th scope="col">Video ID</th>
                          <th scope="col">URL</th>
                          <th scope="col">Created Date</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMeetings.length > 0 ? (
                          filteredMeetings.map((meeting, i) => (
                            <tr key={meeting._id}>
                              <td>{i + 1}</td>
                              <td>{meeting.title}</td>
                              <td>{meeting.subTitle}</td>
                              <td>
                                <span
                                  className="badge px-2 py-1 rounded-pill"
                                  style={{
                                    backgroundColor:
                                      meeting.type === "zoom meet"
                                        ? "#007bff"
                                        : meeting.type === "youtube"
                                        ? "#ff0000"
                                        : meeting.type === "google meet"
                                        ? "#34a853"
                                        : "#6c757d",
                                    color: "white",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  {meeting.type}
                                </span>
                              </td>
                              <td>{meeting.videoId}</td>
                              <td>
                                <a
                                  href={meeting.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    color: "#f29b0a",
                                    textDecoration: "none",
                                  }}
                                >
                                  View Link
                                </a>
                              </td>
                              <td>
                                {new Date(meeting.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </td>
                              <td>
                                <div className="d-flex gap-2">
                                  <button
                                    title="Edit"
                                    className="btn btn-sm"
                                    onClick={() => openEditModal(meeting)}
                                    style={{
                                      backgroundColor: "#f29b0a",
                                      borderColor: "#f29b0a",
                                      color: "white",
                                    }}
                                  >
                                    <Pencil size={14} />
                                  </button>
                                  <button
                                    title="Delete"
                                    className="btn btn-sm"
                                    onClick={() =>
                                      handleDeleteMeeting(
                                        meeting._id,
                                        meeting.title
                                      )
                                    }
                                    disabled={deletingMeeting}
                                    style={{
                                      backgroundColor: "#dc3545",
                                      borderColor: "#dc3545",
                                      color: "white",
                                    }}
                                  >
                                    {deletingMeeting ? (
                                      <span className="spinner-border spinner-border-sm"></span>
                                    ) : (
                                      <Trash2 size={14} />
                                    )}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="8" className="text-center">
                              No meetings found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>

            {/* Pagination Section */}
            {allMeetings?.data?.pagination &&
              allMeetings.data.pagination.totalPages > 1 && (
                <div className="row mt-4">
                  <div className="col-12">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                      <div className="d-flex align-items-center mb-3 mb-md-0">
                        <span className="text-white me-3">Items per page:</span>
                        <select
                          className="form-select form-select-sm"
                          value={limit}
                          onChange={(e) =>
                            handleLimitChange(Number(e.target.value))
                          }
                          style={{
                            backgroundColor: "#1e293b",
                            borderColor: "#334155",
                            color: "white",
                            width: "80px",
                          }}
                        >
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </select>
                      </div>

                      <div className="d-flex align-items-center">
                        <span className="text-white me-3 small">
                          Showing{" "}
                          {(allMeetings.data.pagination.currentPage - 1) *
                            limit +
                            1}{" "}
                          to{" "}
                          {Math.min(
                            allMeetings.data.pagination.currentPage * limit,
                            allMeetings.data.pagination.totalCount
                          )}{" "}
                          of {allMeetings.data.pagination.totalCount} entries
                        </span>
                      </div>

                      <div className="d-flex align-items-center">
                        <button
                          className="btn btn-sm btn-outline-light me-2"
                          onClick={() =>
                            handlePageChange(
                              allMeetings.data.pagination.currentPage - 1
                            )
                          }
                          disabled={
                            !allMeetings.data.pagination.hasPrevPage ||
                            loadingMeetings
                          }
                          style={{ borderColor: "#64748b" }}
                        >
                          Previous
                        </button>

                        {renderPaginationButtons()}

                        <button
                          className="btn btn-sm btn-outline-light ms-2"
                          onClick={() =>
                            handlePageChange(
                              allMeetings.data.pagination.currentPage + 1
                            )
                          }
                          disabled={
                            !allMeetings.data.pagination.hasNextPage ||
                            loadingMeetings
                          }
                          style={{ borderColor: "#64748b" }}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* Edit Meeting Modal */}
        {showEditModal && editingMeeting && (
          <div
            className="modal show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div
                className="modal-content border-0 shadow-lg"
                style={{ backgroundColor: "#1e293b" }}
              >
                <div
                  className="modal-header border-0"
                  style={{ borderBottom: "1px solid #334155" }}
                >
                  <h5 className="modal-title text-white d-flex align-items-center">
                    <FileText
                      size={24}
                      className="me-2"
                      style={{ color: "#f29b0a" }}
                    />
                    Edit Zoom Meeting
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingMeeting(null);
                    }}
                  ></button>
                </div>
                <div className="modal-body p-4">
                  <Formik
                    initialValues={{
                      title: editingMeeting.title || "",
                      subTitle: editingMeeting.subTitle || "",
                      url: editingMeeting.url || "",
                      videoId: editingMeeting.videoId || "",
                      type: editingMeeting.type || "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleUpdateMeeting}
                  >
                    {({ isSubmitting }) => (
                      <Form>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label text-white fw-medium">
                              Title <span className="text-danger">*</span>
                            </label>
                            <Field
                              type="text"
                              name="title"
                              className="form-control bg-dark text-white border-secondary"
                              style={{
                                backgroundColor: "#0f172a",
                                borderColor: "#334155",
                                color: "white",
                              }}
                              disabled={updatingMeeting}
                            />
                            <ErrorMessage
                              name="title"
                              component="div"
                              className="text-danger small mt-1"
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label text-white fw-medium">
                              Sub Title <span className="text-danger">*</span>
                            </label>
                            <Field
                              type="text"
                              name="subTitle"
                              className="form-control bg-dark text-white border-secondary"
                              style={{
                                backgroundColor: "#0f172a",
                                borderColor: "#334155",
                                color: "white",
                              }}
                              disabled={updatingMeeting}
                            />
                            <ErrorMessage
                              name="subTitle"
                              component="div"
                              className="text-danger small mt-1"
                            />
                          </div>
                          <div className="col-12 mb-3">
                            <label className="form-label text-white fw-medium">
                              URL <span className="text-danger">*</span>
                            </label>
                            <Field
                              type="url"
                              name="url"
                              className="form-control bg-dark text-white border-secondary"
                              style={{
                                backgroundColor: "#0f172a",
                                borderColor: "#334155",
                                color: "white",
                              }}
                              disabled={updatingMeeting}
                            />
                            <ErrorMessage
                              name="url"
                              component="div"
                              className="text-danger small mt-1"
                            />
                          </div>
                          <div className="col-12 mb-4">
                            <label className="form-label text-white fw-medium">
                              Video ID <span className="text-danger">*</span>
                            </label>
                            <Field
                              type="text"
                              name="videoId"
                              className="form-control bg-dark text-white border-secondary"
                              style={{
                                backgroundColor: "#0f172a",
                                borderColor: "#334155",
                                color: "white",
                              }}
                              disabled={updatingMeeting}
                            />
                            <ErrorMessage
                              name="videoId"
                              component="div"
                              className="text-danger small mt-1"
                            />
                          </div>
                          <div className="col-12 mb-4">
                            <label className="form-label text-white fw-medium">
                              Meeting Type{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <Field
                              as="select"
                              name="type"
                              className="form-select bg-dark text-white border-secondary"
                              style={{
                                backgroundColor: "#0f172a",
                                borderColor: "#334155",
                                color: "white",
                              }}
                              disabled={updatingMeeting}
                            >
                              <option value="">Select meeting type</option>
                              <option value="zoom meet">Zoom Meet</option>
                              <option value="youtube">YouTube</option>
                              <option value="google meet">Google Meet</option>
                              <option value="social media">Social Media</option>
                            </Field>
                            <ErrorMessage
                              name="type"
                              component="div"
                              className="text-danger small mt-1"
                            />
                          </div>
                        </div>
                        <div className="d-flex gap-2 justify-content-end">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                              setShowEditModal(false);
                              setEditingMeeting(null);
                            }}
                            disabled={updatingMeeting}
                            style={{
                              backgroundColor: "#64748b",
                              borderColor: "#64748b",
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting || updatingMeeting}
                            className="btn d-flex align-items-center"
                            style={{
                              backgroundColor: "#f29b0a",
                              borderColor: "#f29b0a",
                              color: "white",
                            }}
                          >
                            {isSubmitting || updatingMeeting ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Updating...
                              </>
                            ) : (
                              <>
                                <CheckCircle size={16} className="me-2" />
                                Update Meeting
                              </>
                            )}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}

export default ZoomMeeting;
