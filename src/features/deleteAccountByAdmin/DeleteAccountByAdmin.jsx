// DeletedUsersTable.jsx
import React, { useState, useEffect } from "react";
import DashboardLayout from "../../Layout/DashboardLayout";
import { Icon } from "@iconify/react/dist/iconify.js";
import Skeleton from "react-loading-skeleton";
import {
  useGetDeletedUsersQuery,
  useDeleteUserMutation,
} from "../deleteAccountByAdmin/deleteAccountByAdminApiSlice";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";

const DeletedUsersTable = () => {
  // Modal state for user details
  const [showDetails, setShowDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Modal state for delete user
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteFormData, setDeleteFormData] = useState({
    username: "",
    reasonForDelete: "",
  });

  const handleCloseDetails = () => setShowDetails(false);
  const handleShowDetails = (user) => {
    setSelectedUser(user);
    setShowDetails(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteFormData({ username: "", reasonForDelete: "" });
  };

  const handleShowDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const {
    data: deletedUsersReport,
    isLoading,
    refetch,
  } = useGetDeletedUsersQuery();

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const usersData = deletedUsersReport?.data || [];
  const totalDeletedUsers = usersData.length;

  // Format date function
  const formatDateWithAmPm = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    let hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const amAndPm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;
    return `${day}-${month}-${year} ${hours}:${minutes} ${amAndPm}`;
  };

  // Handle delete user form submission
  const handleDeleteUser = async (e) => {
    e.preventDefault();

    if (!deleteFormData.username.trim()) {
      toast.error("Username is required");
      return;
    }

    if (!deleteFormData.reasonForDelete.trim()) {
      toast.error("Reason for delete is required");
      return;
    }

    try {
      await deleteUser({
        username: deleteFormData.username.trim(),
        reasonForDelete: deleteFormData.reasonForDelete.trim(),
      }).unwrap();

      toast.success("User deleted successfully!");
      handleCloseDeleteModal();
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete user");
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeleteFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <DashboardLayout>
      <section className="profile_section py-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="my_total_team_data rounded-3 px-3 pb-0 py-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h1 className="mb-0">Deleted Users Report</h1>
                  <button
                    className="btn btn-danger"
                    onClick={handleShowDeleteModal}
                  >
                    <Icon
                      icon="heroicons:trash"
                      width="16"
                      height="16"
                      className="me-2"
                    />
                    Delete User
                  </button>
                </div>

                {/* Total Count Display */}
                <div className="row justify-content-between mb-4">
                  <div className="col-12 col-sm-6 col-md-4">
                    <div className="my_total_team_data mb-4 rounded-3">
                      <div className="total_user_card d-flex align-items-center gap-2 gap-md-3">
                        <div className="total_user_card_data justify-content-between ms-2 px-1 py-1 py-md-2">
                          <h5>
                            Total deleted users:{" "}
                            <b>{Number(totalDeletedUsers).toLocaleString()}</b>
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="table_data table-responsive">
                  <table className="table mb-0">
                    <thead>
                      <tr>
                        <th scope="col">S.No</th>
                        <th scope="col">Username</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Tokens</th>
                        <th scope="col">Tokens Transferred To</th>
                        <th scope="col">Deletion Reason</th>
                        <th scope="col">Deleted Date</th>
                        <th scope="col">Deleted By</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <>
                          {[...Array(10)].map((e, i) => (
                            <tr key={i}>
                              <td>
                                <Skeleton />
                              </td>
                              <td>
                                <Skeleton />
                              </td>
                              <td>
                                <Skeleton />
                              </td>
                              <td>
                                <Skeleton />
                              </td>
                              <td>
                                <Skeleton />
                              </td>
                              <td>
                                <Skeleton />
                              </td>
                              <td>
                                <Skeleton />
                              </td>
                              <td>
                                <Skeleton />
                              </td>
                            </tr>
                          ))}
                        </>
                      ) : usersData.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="text-center">
                            No deleted users found
                          </td>
                        </tr>
                      ) : (
                        usersData.map((user, i) => (
                          <tr key={i}>
                            <td>{i + 1}.</td>
                            <td>{user?.username || "N/A"}</td>
                            <td>{user?.name || "N/A"}</td>
                            <td>{user?.email || "N/A"}</td>
                            <td>
                              {Number(user?.tokens || 0).toLocaleString()}
                            </td>
                            <td>{user?.tokensTransferredTo || "N/A"}</td>
                            <td>
                              <span
                                className="text-truncate d-inline-block"
                                style={{ maxWidth: "150px" }}
                                title={
                                  user?.deletionReason || "No reason provided"
                                }
                              >
                                {user?.deletionReason || "No reason provided"}
                              </span>
                            </td>
                            <td>{formatDateWithAmPm(user?.deletedAt)}</td>
                            <td>{user?.deletedBy || "System"}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-info"
                                onClick={() => handleShowDetails(user)}
                                title="View Details"
                              >
                                <Icon
                                  icon="heroicons:eye"
                                  width="16"
                                  height="16"
                                />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Details Modal */}
      <Modal
        show={showDetails}
        onHide={handleCloseDetails}
        size="lg"
     
      >
        <Modal.Header closeButton>
          <Modal.Title>
            User Details -{" "}
            {selectedUser?.username || selectedUser?.name || "User"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser ? (
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <strong>Username:</strong>
                  <p className="mb-1">{selectedUser.username || "N/A"}</p>
                </div>
                <div className="mb-3">
                  <strong>Name:</strong>
                  <p className="mb-1">{selectedUser.name || "N/A"}</p>
                </div>
                <div className="mb-3">
                  <strong>Email:</strong>
                  <p className="mb-1">{selectedUser.email || "N/A"}</p>
                </div>
                <div className="mb-3">
                  <strong>Phone:</strong>
                  <p className="mb-1">
                    {selectedUser.countryCode && selectedUser.phone
                      ? `+${selectedUser.countryCode} ${selectedUser.phone}`
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <strong>User ID:</strong>
                  <p className="mb-1">{selectedUser._id || "N/A"}</p>
                </div>
                <div className="mb-3">
                  <strong>Tokens:</strong>
                  <p className="mb-1">
                    {Number(selectedUser.tokens || 0).toLocaleString()}
                  </p>
                </div>
                <div className="mb-3">
                  <strong>Tokens Transferred To:</strong>
                  <p className="mb-1">
                    {selectedUser.tokensTransferredTo || "N/A"}
                  </p>
                </div>
                <div className="mb-3">
                  <strong>Deleted Date:</strong>
                  <p className="mb-1">
                    {formatDateWithAmPm(selectedUser.deletedAt)}
                  </p>
                </div>
                <div className="mb-3">
                  <strong>Deleted By:</strong>
                  <p className="mb-1">{selectedUser.deletedBy || "System"}</p>
                </div>
              </div>
              <div className="col-12">
                <div className="mb-3">
                  <strong>Deletion Reason:</strong>
                  <p className="mb-1 p-2 bg-light rounded">
                    {selectedUser.deletionReason || "No reason provided"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center">No user details available.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetails}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete User Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleDeleteUser}>
          <Modal.Body>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={deleteFormData.username}
                onChange={handleInputChange}
                placeholder="Enter username to delete"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="reasonForDelete" className="form-label">
                Reason for Delete <span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control"
                id="reasonForDelete"
                name="reasonForDelete"
                rows="3"
                value={deleteFormData.reasonForDelete}
                onChange={handleInputChange}
                placeholder="Enter reason for deletion"
                required
              ></textarea>
            </div>
            <div className="alert alert-warning">
              <Icon
                icon="heroicons:exclamation-triangle"
                width="20"
                height="20"
                className="me-2"
              />
              <strong>Warning:</strong> This action cannot be undone. The user
              will be permanently deleted.
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDeleteModal}>
              Cancel
            </Button>
            <Button variant="danger" type="submit" disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Icon
                    icon="eos-icons:loading"
                    width="16"
                    height="16"
                    className="me-2"
                  />
                  Deleting...
                </>
              ) : (
                <>
                  <Icon
                    icon="heroicons:trash"
                    width="16"
                    height="16"
                    className="me-2"
                  />
                  Delete User
                </>
              )}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default DeletedUsersTable;
