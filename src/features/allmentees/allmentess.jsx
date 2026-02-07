import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Pagination from "../../components/Pagination";
import DashboardLayout from "../../Layout/DashboardLayout";
import { 
  useGetMenteesQuery, 
  useToggleBlockMenteeMutation,
  useAssignMentorMutation,
  useDeleteMenteeMutation 
} from "./allmentessapislice"
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";

const MenteesManagement = () => {
  const [selectedMentee, setSelectedMentee] = useState(null);
  const [mentorId, setMentorId] = useState("");

  // Pagination state
  const [state, setState] = useState({
    currentPage: 1,
    perPage: 10,
    search: "",
  });

  const queryParams = `limit=${state.perPage}&page=${state.currentPage}&search=${state.search}`;

  const { data: getMentees, isLoading, refetch } = useGetMenteesQuery(queryParams);
  const [toggleBlock, { isLoading: isToggling }] = useToggleBlockMenteeMutation();
  const [assignMentor, { isLoading: isAssigning }] = useAssignMentorMutation();
  const [deleteMentee, { isLoading: isDeleting }] = useDeleteMenteeMutation();

  const TableData = getMentees?.data?.data || [];
  const totalMentees = getMentees?.data?.total || 0;
  const activeMentees = TableData.filter(user => user.isActive && !user.isBlock).length || 0;
  const blockedMentees = TableData.filter(user => user.isBlock).length || 0;
  const withoutMentor = TableData.filter(user => !user.mentorId).length || 0;

  // Handle page change
  const handlePageChange = (e) => {
    setState({ ...state, currentPage: e });
  };

  // Handle search with debounce
  let searchTimeout;
  const handleSearch = (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      setState({ ...state, search: e.target.value, currentPage: 1 });
    }, 1000);
  };

  useEffect(() => {
    refetch();
    return () => {
      clearTimeout(searchTimeout);
    };
  }, []);

  // Handle view details
  const handleViewDetails = (mentee) => {
    setSelectedMentee(mentee);
  };

  // Handle block/unblock
  const handleToggleBlock = async (mentee) => {
    try {
      await toggleBlock({
        id: mentee._id,
        isBlock: !mentee.isBlock,
      }).unwrap();

      toast.success(
        `Mentee ${!mentee.isBlock ? "blocked" : "unblocked"} successfully`,
        { position: "top-center" }
      );
      refetch();
    } catch (error) {
      console.error("Toggle block failed:", error);
      toast.error(error?.data?.message || "Failed to update status", {
        position: "top-center",
      });
    }
  };

  // Handle assign mentor
  const handleAssignMentor = async (e) => {
    e.preventDefault();

    if (!mentorId || mentorId === "") {
      toast.error("Please enter a mentor ID");
      return;
    }

    try {
      await assignMentor({
        menteeId: selectedMentee._id,
        mentorId: mentorId,
      }).unwrap();

      toast.success("Mentor assigned successfully", {
        position: "top-center",
      });
      setMentorId("");
      setSelectedMentee(null);
      // Close modal programmatically
      const modalElement = document.getElementById("assignMentorModal");
      const modal = window.bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
      refetch();
    } catch (error) {
      console.error("Assign mentor failed:", error);
      toast.error(error?.data?.message || "Failed to assign mentor", {
        position: "top-center",
      });
    }
  };

  // Handle delete mentee
  const handleDelete = async (menteeId) => {
    if (!window.confirm("Are you sure you want to delete this mentee?")) {
      return;
    }

    try {
      await deleteMentee(menteeId).unwrap();
      toast.success("Mentee deleted successfully", {
        position: "top-center",
      });
      refetch();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(error?.data?.message || "Failed to delete mentee", {
        position: "top-center",
      });
    }
  };

  // Format date with AM/PM
  const formatDateWithAmPm = (isoString) => {
    if (!isoString) return "N/A";

    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const amPm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;
    return `${day}-${month}-${year} ${hours}:${minutes} ${amPm}`;
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    return formatDateWithAmPm(new Date(timestamp * 1000));
  };

  return (
    <>
      <DashboardLayout>
        <section className="profile_section user__management py-4">
          <div className="container-fluid">
            <div className="row">
              {/* Statistics Cards */}
              <div className="col-12 col-sm-6 col-md-6 col-xl-3">
                <div className="my_total_team_data mb-4 rounded-3 px-3 py-3 py-md-4">
                  <div className="total_user_card d-flex align-items-center gap-2 gap-md-3">
                    <div className="total_user_images rounded-3 p-2 p-md-4">
                      <img
                        src="/images/total-member.png"
                        alt="total-mentees"
                        className="img-fluid"
                      />
                    </div>
                    <div className="total_user_card_data">
                      <h2>{totalMentees}</h2>
                      <h5>Total Mentees</h5>
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
                        alt="active-mentees"
                        className="img-fluid"
                      />
                    </div>
                    <div className="total_user_card_data">
                      <h2>{activeMentees}</h2>
                      <h5>Active Mentees</h5>
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
                        alt="blocked"
                        className="img-fluid"
                      />
                    </div>
                    <div className="total_user_card_data">
                      <h2>{blockedMentees}</h2>
                      <h5>Blocked</h5>
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
                        alt="without-mentor"
                        className="img-fluid"
                      />
                    </div>
                    <div className="total_user_card_data">
                      <h2>{withoutMentor}</h2>
                      <h5>Without Mentor</h5>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mentees Table */}
              <div className="col-12">
                <div className="my_total_team_data rounded-3 px-3 py-4">
                  <h1 className="mb-3">Mentees Management</h1>
                  <div className="row justify-content-between">
                    {/* Items per page selector */}
                    <div className="col-12 col-sm-6 col-md-2 col-xxl-1">
                      <div className="pagination__box mb-4">
                        <div className="showing_data">
                          <select
                            className="form-select shadow-none"
                            aria-label="Default select example"
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

                    {/* Search input */}
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
                            placeholder="Search by name, email..."
                            onChange={handleSearch}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="table_data table-responsive">
                    <table className="table mb-0">
                      <thead>
                        <tr>
                          <th scope="col">S.No</th>
                          <th scope="col">Name</th>
                          <th scope="col">Email</th>
                          <th scope="col">Phone</th>
                          <th scope="col">Total Bookings</th>
                          <th scope="col">Completed</th>
                      
                          <th scope="col">Status</th>
                          <th scope="col">Verified</th>
                          <th scope="col">Blocked</th>
                       
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          <>
                            {[...Array(10)].map((e, i) => (
                              <tr key={i}>
                                {[...Array(15)].map((_, j) => (
                                  <td key={j}>
                                    <Skeleton />
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </>
                        ) : TableData.length === 0 ? (
                          <tr>
                            <td colSpan="15" className="text-center">
                              No mentees found
                            </td>
                          </tr>
                        ) : (
                          TableData.map((data, i) => (
                            <tr key={data._id}>
                              <td>
                                {state.currentPage * state.perPage -
                                  (state.perPage - 1) +
                                  i}
                                .
                              </td>
                              <td>{data.name || "N/A"}</td>
                          
                              <td>{data.email || "N/A"}</td>
                              <td>
                                {data.phone
                                  ? `+${data.countryCode || 91} ${data.phone}`
                                  : "N/A"}
                              </td>
                           
                                    
                              <td>{data.totalBookings || 0}</td>
                              <td>{data.completedBookings || 0}</td>
                            
                              <td>
                                <span
                                  className={
                                    data.isActive ? "unblock" : "block"
                                  }
                                >
                                  {data.isActive ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td>
                                <span
                                  className={
                                    data.isVerified ? "unblock" : "block"
                                  }
                                >
                                  {data.isVerified ? "Yes" : "No"}
                                </span>
                              </td>
                              <td>
                                <span
                                  className={data.isBlock ? "block" : "unblock"}
                                >
                                  {data.isBlock ? "Yes" : "No"}
                                </span>
                              </td>
                            
                              <td>
                                <div className="d-flex gap-2">
                                  {/* View Details */}
                                  <button
                                    className="btn btn-sm btn-info"
                                    title="View Details"
                                    data-bs-toggle="modal"
                                    data-bs-target="#menteeDetailsModal"
                                    onClick={() => handleViewDetails(data)}
                                  >
                                    <Icon icon="mdi:eye" width="16" height="16" />
                                  </button>

                               

                                  {/* Block/Unblock */}
                                  <button
                                    className={`btn btn-sm ${
                                      data.isBlock ? "btn-warning" : "btn-danger"
                                    }`}
                                    title={data.isBlock ? "Unblock" : "Block"}
                                    onClick={() => handleToggleBlock(data)}
                                    disabled={isToggling}
                                  >
                                    <Icon
                                      icon={
                                        data.isBlock
                                          ? "mdi:lock-open"
                                          : "mdi:lock"
                                      }
                                      width="16"
                                      height="16"
                                    />
                                  </button>

                                  {/* Delete */}
                                  <button
                                    className="btn btn-sm btn-danger"
                                    title="Delete"
                                    onClick={() => handleDelete(data._id)}
                                    disabled={isDeleting}
                                  >
                                    <Icon
                                      icon="mdi:delete"
                                      width="16"
                                      height="16"
                                    />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                {TableData?.length > 0 && (
                  <Pagination
                    currentPage={state.currentPage}
                    totalPages={Math.ceil(totalMentees / state.perPage) || 1}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>
            </div>
          </div>

          {/* View Details Modal */}
          <div
            className="modal fade common__modal"
            id="menteeDetailsModal"
            tabIndex="-1"
            aria-labelledby="menteeDetailsModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered modal-xl">
              <div className="modal-content">
                <div className="modal-header border-0 pb-0">
                  <h1 className="modal-title" id="menteeDetailsModalLabel">
                    <Icon
                      icon="mdi:account-details"
                      width="28"
                      height="28"
                      className="me-2"
                    />
                    Mentee Details
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body pt-0 px-4">
                  {selectedMentee && (
                    <>
                      {/* Profile Header */}
                      <div className="text-center mb-4 pb-4 border-bottom">
                        <img
                          src={
                            selectedMentee.profile || "/images/default-avatar.png"
                          }
                          alt="Profile"
                          className="rounded-circle mb-3"
                          style={{
                            width: "120px",
                            height: "120px",
                            objectFit: "cover",
                            border: "3px solid var(--primary-color)",
                          }}
                        />
                        <h3>{selectedMentee.name}</h3>
                    
                        <div className="d-flex gap-2 justify-content-center flex-wrap">
                         
                         
                          {selectedMentee.isBlock && (
                            <span className="badge bg-danger">
                              <Icon
                                icon="mdi:block-helper"
                                width="14"
                                height="14"
                                className="me-1"
                              />
                              Blocked
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="row">
                        {/* Personal Information */}
                        <div className="col-12 mb-4">
                          <h5 className="mb-3">
                            <Icon
                              icon="mdi:account"
                              width="20"
                              height="20"
                              className="me-2"
                            />
                            Personal Information
                          </h5>
                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <div className="form__box">
                                <label>Full Name</label>
                                <input
                                  type="text"
                                  className="form-control shadow-none"
                                  value={selectedMentee.name || "N/A"}
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
                                  value={selectedMentee.username || "N/A"}
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
                                  value={selectedMentee.email || "N/A"}
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
                                  value={
                                    selectedMentee.phone
                                      ? `+${selectedMentee.countryCode || 91} ${
                                          selectedMentee.phone
                                        }`
                                      : "N/A"
                                  }
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Location Information */}
                        <div className="col-12 mb-4">
                          <h5 className="mb-3">
                            <Icon
                              icon="mdi:map-marker"
                              width="20"
                              height="20"
                              className="me-2"
                            />
                            Location Information
                          </h5>
                          <div className="row">
                            <div className="col-md-4 mb-3">
                              <div className="form__box">
                                <label>Country</label>
                                <input
                                  type="text"
                                  className="form-control shadow-none"
                                  value={selectedMentee.country}
                                  readOnly
                                />
                              </div>
                            </div>
                            <div className="col-md-4 mb-3">
                              <div className="form__box">
                                <label>State</label>
                                <input
                                  type="text"
                                  className="form-control shadow-none"
                                  value={selectedMentee.state}
                                  readOnly
                                />
                              </div>
                            </div>
                            <div className="col-md-4 mb-3">
                              <div className="form__box">
                                <label>City</label>
                                <input
                                  type="text"
                                  className="form-control shadow-none"
                                  value={selectedMentee.city }
                                  readOnly
                                />
                              </div>
                            </div>
                            <div className="col-md-12 mb-3">
                              <div className="form__box">
                                <label>Address</label>
                                <textarea
                                  className="form-control shadow-none"
                                  rows="2"
                                  value={selectedMentee.address || "N/A"}
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>
                        </div>

              
                        {/* Booking Statistics */}
                        <div className="col-md-6 mb-4">
                          <h5 className="mb-3">
                            <Icon
                              icon="mdi:calendar-check"
                              width="20"
                              height="20"
                              className="me-2"
                            />
                            Booking Statistics
                          </h5>
                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <div className="form__box">
                                <label>Total Bookings</label>
                                <input
                                  type="text"
                                  className="form-control shadow-none"
                                  value={selectedMentee.totalBookings || 0}
                                  readOnly
                                />
                              </div>
                            </div>
                            <div className="col-md-6 mb-3">
                              <div className="form__box">
                                <label>Completed Bookings</label>
                                <input
                                  type="text"
                                  className="form-control shadow-none"
                                  value={selectedMentee.completedBookings || 0}
                                  readOnly
                                />
                              </div>
                            </div>
                            <div className="col-md-6 mb-3">
                              <div className="form__box">
                                <label>Free Session Status</label>
                                <input
                                  type="text"
                                  className="form-control shadow-none"
                                  value={
                                    selectedMentee.freeSessionUsed
                                      ? "Used"
                                      : "Available"
                                  }
                                  readOnly
                                  style={{
                                    color: selectedMentee.freeSessionUsed
                                      ? "orange"
                                      : "green",
                                    fontWeight: "bold",
                                  }}
                                />
                              </div>
                            </div>
                            {selectedMentee.mentorId && (
                              <div className="col-md-6 mb-3">
                                <div className="form__box">
                                  <label>Assigned Mentor ID</label>
                                  <input
                                    type="text"
                                    className="form-control shadow-none"
                                    value={selectedMentee.mentorId}
                                    readOnly
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Status Information */}
                        <div className="col-12 mb-4">
                          <h5 className="mb-3">
                            <Icon
                              icon="mdi:flag"
                              width="20"
                              height="20"
                              className="me-2"
                            />
                            Status Information
                          </h5>
                          <div className="row">
                            <div className="col-md-3 mb-3">
                              <div className="form__box">
                                <label>Active Status</label>
                                <input
                                  type="text"
                                  className="form-control shadow-none"
                                  value={
                                    selectedMentee.isActive ? "Active" : "Inactive"
                                  }
                                  readOnly
                                  style={{
                                    color: selectedMentee.isActive
                                      ? "green"
                                      : "red",
                                    fontWeight: "bold",
                                  }}
                                />
                              </div>
                            </div>
                            <div className="col-md-3 mb-3">
                              <div className="form__box">
                                <label>Verified</label>
                                <input
                                  type="text"
                                  className="form-control shadow-none"
                                  value={selectedMentee.isVerified ? "Yes" : "No"}
                                  readOnly
                                  style={{
                                    color: selectedMentee.isVerified
                                      ? "green"
                                      : "orange",
                                    fontWeight: "bold",
                                  }}
                                />
                              </div>
                            </div>
                            <div className="col-md-3 mb-3">
                              <div className="form__box">
                                <label>Blocked</label>
                                <input
                                  type="text"
                                  className="form-control shadow-none"
                                  value={selectedMentee.isBlock ? "Yes" : "No"}
                                  readOnly
                                  style={{
                                    color: selectedMentee.isBlock ? "red" : "green",
                                    fontWeight: "bold",
                                  }}
                                />
                              </div>
                            </div>
                          
                          </div>
                        </div>
                      </div>

                      <div className="text-center my-4">
                        <button
                          type="button"
                          className="btn btn-secondary px-5 py-2"
                          data-bs-dismiss="modal"
                        >
                          Close
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Assign Mentor Modal */}
          <div
            className="modal fade common__modal"
            id="assignMentorModal"
            tabIndex="-1"
            aria-labelledby="assignMentorModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header border-0 pb-0">
                  <h1 className="modal-title" id="assignMentorModalLabel">
                    Assign Mentor
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body pt-0 px-4">
                  {selectedMentee && (
                    <form onSubmit={handleAssignMentor}>
                      <p className="mb-3">
                        Assign a mentor to <strong>{selectedMentee.name}</strong>
                      </p>
                      <div className="form__box mb-4">
                        <label>Mentor ID</label>
                        <input
                          type="text"
                          className="form-control shadow-none"
                          placeholder="Enter Mentor ID"
                          value={mentorId}
                          onChange={(e) => setMentorId(e.target.value)}
                          required
                        />
                      </div>
                      <div className="d-flex gap-3 justify-content-center">
                        <button
                          type="submit"
                          className="btn btn-success px-4"
                          disabled={isAssigning}
                        >
                          {isAssigning ? "Assigning..." : "Assign"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary px-4"
                          data-bs-dismiss="modal"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
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

export default MenteesManagement;