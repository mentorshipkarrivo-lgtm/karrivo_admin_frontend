import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import DashboardLayout from "../../Layout/DashboardLayout";
import {
  useGetExcludedUsersQuery,
  useAddExcludedUserMutation,
  useDeleteExcludedUserMutation,
} from "../excludeUsers/excludedUsersApiSlice";

// Toast Component
const Toast = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastStyles = () => {
    const baseStyles = {
      position: "fixed",
      top: "20px",
      right: "20px",
      padding: "12px 20px",
      borderRadius: "8px",
      color: "white",
      fontSize: "14px",
      fontWeight: "500",
      zIndex: 9999,
      minWidth: "300px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      animation: "slideIn 0.3s ease-out",
    };

    const typeStyles = {
      success: { backgroundColor: "#28a745" },
      error: { backgroundColor: "#dc3545" },
      warning: { backgroundColor: "#ffc107", color: "#212529" },
      info: { backgroundColor: "#17a2b8" },
    };

    return { ...baseStyles, ...typeStyles[type] };
  };

  return (
    <>
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
      <div style={getToastStyles()}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{message}</span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "inherit",
              fontSize: "18px",
              marginLeft: "10px",
              cursor: "pointer",
              padding: "0",
              lineHeight: "1",
            }}
          >
            ×
          </button>
        </div>
      </div>
    </>
  );
};

function ExcludeUsers() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [toast, setToast] = useState(null);

  // RTK Query hooks
  const {
    data: excludedUsersData,
    isLoading,
    error,
  } = useGetExcludedUsersQuery();
  const [addUser, { isLoading: isAdding }] = useAddExcludedUserMutation();
  const [deleteUser, { isLoading: isDeleting }] =
    useDeleteExcludedUserMutation();

  const excludedUsers = excludedUsersData?.data?.excludedUsers || [];

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  // Formik setup
  const formik = useFormik({
    initialValues: {
      username: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be less than 20 characters")
        .matches(
          /^[a-zA-Z0-9_]+$/,
          "Username can only contain letters, numbers, and underscores"
        )
        .required("Username is required"),
    }),
    onSubmit: async (values) => {
      try {
        await addUser(values).unwrap();
        formik.resetForm();
        setShowAddForm(false);
        showToast("User excluded successfully!", "success");
      } catch (err) {
        console.error("Failed to add user:", err);

        // Handle different error responses
        if (err?.data?.message) {
          showToast(err.data.message, "error");
        } else if (err?.message) {
          showToast(err.message, "error");
        } else {
          showToast("Failed to exclude user. Please try again.", "error");
        }
      }
    },
  });

  const handleDeleteUser = async (username) => {
    try {
      await deleteUser(username).unwrap();
      showToast("User removed from exclusion list successfully!", "success");
    } catch (err) {
      console.error("Failed to delete user:", err);

      if (err?.data?.message) {
        showToast(err.data.message, "error");
      } else if (err?.message) {
        showToast(err.message, "error");
      } else {
        showToast("Failed to remove user. Please try again.", "error");
      }
    }
  };

  const resetForm = () => {
    formik.resetForm();
    setShowAddForm(false);
  };

  if (isLoading) {
    return (
      <div>
        <DashboardLayout>
          <section className="profile_section py-4">
            <div className="container-fluid">
              <div className="rounded-3 px-3 pb-4 py-4 bg-dark text-white">
                <div className="text-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </DashboardLayout>
      </div>
    );
  }

  return (
    <div>
      <DashboardLayout>
        <section className="profile_section py-4">
          <div className="container-fluid">
            <div className="rounded-3 px-3 pb-4 py-4 bg-dark text-white">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Exclude Users</h2>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowAddForm(!showAddForm)}
                  style={{
                    backgroundColor: "#ec660f",
                    border: "1px solid #ec660f",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#d25400";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 8px rgba(0, 0, 0, 0.2)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#ec660f";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {showAddForm ? "Cancel" : "Add User"}
                </button>
              </div>

              <p className="mb-4 text-light">
                Here you can exclude users from your referral program.
              </p>

              {/* Add User Form */}
              {showAddForm && (
                <div
                  className="card mb-4"
                  style={{
                    backgroundColor: "#1b232d",
                    border: "1px solid #3a3a3a",
                  }}
                >
                  <div
                    className="card-header"
                    style={{
                      backgroundColor: "transparent",
                      borderBottom: "1px solid #3a3a3a",
                      borderRadius: "0.375rem 0.375rem 0 0",
                      padding: "12px 20px",
                    }}
                  >
                    <h5 className="mb-0 text-white">
                      Add User to Exclusion List
                    </h5>
                  </div>
                  <div className="card-body">
                    <form
                      onSubmit={formik.handleSubmit}
                      className="row g-3 align-items-end"
                    >
                      <div className="col-lg-4 col-md-6 col-12">
                        <label className="form-label text-white">
                          Username <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="username"
                          className={`form-control ${
                            formik.errors.username && formik.touched.username
                              ? "is-invalid"
                              : ""
                          }`}
                          style={{
                            backgroundColor: "#1b232d",
                            color: "#fff",
                            border: "1px solid #3a3a3a",
                          }}
                          placeholder="Enter username"
                          onChange={formik.handleChange}
                          value={formik.values.username}
                        />
                        {formik.errors.username && formik.touched.username && (
                          <div className="invalid-feedback">
                            {formik.errors.username}
                          </div>
                        )}
                      </div>
                      <div className="col-lg-2 col-md-3 col-12">
                        <button
                          type="submit"
                          className="btn btn-success w-100"
                          disabled={formik.isSubmitting || isAdding}
                          style={{
                            backgroundColor: "#ec660f",
                            border: "1px solid #ec660f",
                            transition: "all 0.3s ease",
                          }}
                        >
                          {formik.isSubmitting || isAdding ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Adding...
                            </>
                          ) : (
                            "Add User"
                          )}
                        </button>
                      </div>
                      <div className="col-lg-2 col-md-3 col-12">
                        <button
                          type="button"
                          className="btn btn-secondary w-100"
                          onClick={resetForm}
                          disabled={formik.isSubmitting}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Excluded Users Table */}
              <div
                className="card"
                style={{
                  backgroundColor: "#1b232d",
                  border: "1px solid #3a3a3a",
                }}
              >
                <div
                  className="card-header"
                  style={{
                    backgroundColor: "transparent",
                    borderBottom: "1px solid #3a3a3a",
                    borderRadius: "0.375rem 0.375rem 0 0",
                    padding: "12px 20px",
                  }}
                >
                  <h5 className="mb-0 text-white">
                    Excluded Users ({excludedUsers.length})
                  </h5>
                </div>
                <div className="card-body">
                  {excludedUsers.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted">
                        No users are currently excluded.
                      </p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-dark">
                        <thead>
                          <tr style={{ backgroundColor: "#2a2a2a" }}>
                            <th
                              style={{
                                backgroundColor: "#ec660f",
                                fontWeight: "600",
                                border: "1px solid #3a3a3a",
                              }}
                            >
                              SNo
                            </th>
                            <th
                              style={{
                                backgroundColor: "#ec660f",
                                fontWeight: "600",
                                border: "1px solid #3a3a3a",
                              }}
                            >
                              Name
                            </th>
                            <th
                              style={{
                                backgroundColor: "#ec660f",
                                fontWeight: "600",
                                border: "1px solid #3a3a3a",
                              }}
                            >
                              Username
                            </th>
                            <th
                              style={{
                                backgroundColor: "#ec660f",
                                fontWeight: "600",
                                border: "1px solid #3a3a3a",
                              }}
                            >
                              Email
                            </th>
                            <th
                              style={{
                                backgroundColor: "#ec660f",
                                fontWeight: "600",
                                border: "1px solid #3a3a3a",
                              }}
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {excludedUsers.map((user, index) => (
                            <tr
                              key={user._id || index}
                              style={{
                                backgroundColor: "#1a1a1a",
                                transition: "all 0.3s ease",
                              }}
                            >
                              <td
                                style={{
                                  border: "1px solid #3a3a3a",
                                  color: "#fff",
                                }}
                              >
                                {index + 1}
                              </td>
                              <td
                                style={{
                                  border: "1px solid #3a3a3a",
                                  color: "#fff",
                                }}
                              >
                                {user.name}
                              </td>
                              <td
                                style={{
                                  border: "1px solid #3a3a3a",
                                  color: "#fff",
                                }}
                              >
                                {user.username}
                              </td>
                              <td
                                style={{
                                  border: "1px solid #3a3a3a",
                                  color: "#fff",
                                }}
                              >
                                {user.email}
                              </td>
                              <td style={{ border: "1px solid #3a3a3a" }}>
                                <button
                                  className="btn btn-danger btn-sm "
                                  onClick={() =>
                                    handleDeleteUser(user.username)
                                  }
                                  disabled={isDeleting}
                                  style={{
                                    backgroundColor: "#ec660f",
                                    border: "1px solid #ec660f",
                                  }}
                                >
                                  {isDeleting ? (
                                    <>
                                      <span
                                        className="spinner-border spinner-border-sm me-1"
                                        role="status"
                                        aria-hidden="true"
                                      ></span>
                                      Removing...
                                    </>
                                  ) : (
                                    "Remove"
                                  )}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </DashboardLayout>

      {/* Toast Notification */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}

export default ExcludeUsers;
