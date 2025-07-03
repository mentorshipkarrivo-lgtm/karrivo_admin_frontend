import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DashboardLayout from "../../Layout/DashboardLayout";
import {
  useGetInactiveUsersQuery,
  useGetUsersWithZeroDirectRefsQuery,
  useGetUsersWithOneToTwoDirectRefsQuery,
  useGetUsersWithThreeToFiveDirectRefsQuery,
  useGetUsersWithSixToNineDirectRefsQuery,
  useGetUsersWithTenToTwentyFiveDirectRefsQuery,
  useGetUsersWithTwentySixToHundredDirectRefsQuery,
} from "../reports/reportsApiSlice";
import { useSendBulkNotificationMutation } from "./notificationApiSlice";
import {
  UserX,
  UserCheck,
  Users2,
  UsersRound,
  Crown,
  Trophy,
  Zap,
  RefreshCw,
  Send,
  Edit3,
  MessageCircle,
  Info,
  ExternalLink,
  Eye,
  EyeOff,
} from "lucide-react";

const BulkNotificationManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  // RTK Query hooks
  const {
    data: inactiveUsers,
    isLoading: loadingInactive,
    refetch: refetchInactive,
  } = useGetInactiveUsersQuery(undefined, {
    skip: selectedCategory !== "inactive",
  });

  const {
    data: zeroRefsUsers,
    isLoading: loadingZeroRefs,
    refetch: refetchZeroRefs,
  } = useGetUsersWithZeroDirectRefsQuery(undefined, {
    skip: selectedCategory !== "zero-refs",
  });

  const {
    data: oneToTwoRefsUsers,
    isLoading: loadingOneToTwo,
    refetch: refetchOneToTwo,
  } = useGetUsersWithOneToTwoDirectRefsQuery(undefined, {
    skip: selectedCategory !== "1-2-refs",
  });

  const {
    data: threeToFiveRefsUsers,
    isLoading: loadingThreeToFive,
    refetch: refetchThreeToFive,
  } = useGetUsersWithThreeToFiveDirectRefsQuery(undefined, {
    skip: selectedCategory !== "3-5-refs",
  });

  const {
    data: sixToNineRefsUsers,
    isLoading: loadingSixToNine,
    refetch: refetchSixToNine,
  } = useGetUsersWithSixToNineDirectRefsQuery(undefined, {
    skip: selectedCategory !== "6-9-refs",
  });

  const {
    data: tenToTwentyFiveRefsUsers,
    isLoading: loadingTenToTwentyFive,
    refetch: refetchTenToTwentyFive,
  } = useGetUsersWithTenToTwentyFiveDirectRefsQuery(undefined, {
    skip: selectedCategory !== "10-25-refs",
  });

  const {
    data: twentySixToHundredRefsUsers,
    isLoading: loadingTwentySixToHundred,
    refetch: refetchTwentySixToHundred,
  } = useGetUsersWithTwentySixToHundredDirectRefsQuery(undefined, {
    skip: selectedCategory !== "26-100-refs",
  });

  const [sendBulkNotification, { isLoading: isSendingNotification }] =
    useSendBulkNotificationMutation();

  const userCategories = [
    {
      id: "inactive",
      name: "Inactive Members",
      description: "Users who are marked as inactive",
      icon: UserX,
      color: "#FF6B35",
      bgClass: "bg-danger",
      textClass: "text-white",
      borderClass: "border-danger",
    },
    {
      id: "zero-refs",
      name: "Zero Direct Referrals",
      description: "Active users with 0 direct referrals",
      icon: UserCheck,
      color: "#FF6B35",
      bgClass: "bg-warning",
      textClass: "text-dark",
      borderClass: "border-warning",
    },
    {
      id: "1-2-refs",
      name: "1-2 Direct Referrals",
      description: "Users with 1-2 direct referrals",
      icon: Users2,
      color: "#FF6B35",
      bgClass: "bg-success",
      textClass: "text-white",
      borderClass: "border-success",
    },
    {
      id: "3-5-refs",
      name: "3-5 Direct Referrals",
      description: "Users with 3-5 direct referrals",
      icon: UsersRound,
      color: "#FF6B35",
      bgClass: "bg-info",
      textClass: "text-white",
      borderClass: "border-info",
    },
    {
      id: "6-9-refs",
      name: "6-9 Direct Referrals",
      description: "Users with 6-9 direct referrals",
      icon: Crown,
      color: "#FF6B35",
      bgClass: "bg-warning",
      textClass: "text-dark",
      borderClass: "border-warning",
    },
    {
      id: "10-25-refs",
      name: "10-25 Direct Referrals",
      description: "Users with 10-25 direct referrals",
      icon: Trophy,
      color: "#FF6B35",
      bgClass: "bg-primary",
      textClass: "text-white",
      borderClass: "border-primary",
    },
    {
      id: "26-100-refs",
      name: "26-100 Direct Referrals",
      description: "High performing users with 26-100 direct referrals",
      icon: Zap,
      color: "#FF6B35",
      bgClass: "bg-secondary",
      textClass: "text-white",
      borderClass: "border-secondary",
    },
  ];

  const getCurrentCategoryData = () => {
    switch (selectedCategory) {
      case "inactive":
        return {
          users: inactiveUsers?.data || [],
          isLoading: loadingInactive,
          refetch: refetchInactive,
        };
      case "zero-refs":
        return {
          users: zeroRefsUsers?.data || [],
          isLoading: loadingZeroRefs,
          refetch: refetchZeroRefs,
        };
      case "1-2-refs":
        return {
          users: oneToTwoRefsUsers?.data || [],
          isLoading: loadingOneToTwo,
          refetch: refetchOneToTwo,
        };
      case "3-5-refs":
        return {
          users: threeToFiveRefsUsers?.data || [],
          isLoading: loadingThreeToFive,
          refetch: refetchThreeToFive,
        };
      case "6-9-refs":
        return {
          users: sixToNineRefsUsers?.data || [],
          isLoading: loadingSixToNine,
          refetch: refetchSixToNine,
        };
      case "10-25-refs":
        return {
          users: tenToTwentyFiveRefsUsers?.data || [],
          isLoading: loadingTenToTwentyFive,
          refetch: refetchTenToTwentyFive,
        };
      case "26-100-refs":
        return {
          users: twentySixToHundredRefsUsers?.data || [],
          isLoading: loadingTwentySixToHundred,
          refetch: refetchTwentySixToHundred,
        };
      default:
        return { users: [], isLoading: false, refetch: () => {} };
    }
  };

  const {
    users: currentUsers,
    isLoading: currentLoading,
    refetch: currentRefetch,
  } = getCurrentCategoryData();
  const userCount = currentUsers.length;
  const previewUsers = currentUsers.slice(0, 5);

  const toastConfig = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };

  const validationSchema = Yup.object({
    notificationTitle: Yup.string()
      .required("Notification title is required")
      .max(100, "Title must be 100 characters or less"),
    notificationMessage: Yup.string()
      .required("Notification message is required")
      .max(500, "Message must be 500 characters or less"),
    notificationLink: Yup.string().url("Must be a valid URL").optional(),
  });

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setShowPreview(false);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  const handleRefreshData = () => {
    currentRefetch();
    toast.info("Refreshing user data...", toastConfig);
  };

  const CategoryCard = ({ category }) => {
    const Icon = category.icon;
    const isSelected = selectedCategory === category.id;

    return (
      <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 mb-4">
        <div
          className={`card h-100 shadow-sm border-2 position-relative overflow-hidden ${
            isSelected ? "" : ""
          }`}
          onClick={() => handleCategorySelect(category.id)}
          style={{
            cursor: "pointer",
            transition: "all 0.3s ease-in-out",
            transform: isSelected ? "translateY(-4px)" : "none",
            backgroundColor: isSelected ? "#2D3748" : "#1E293B",
            color: "#FFFFFF",
          }}
        >
          {isSelected && (
            <div
              className="position-absolute top-0 start-0 w-100"
              style={{
                height: "4px",
                backgroundColor: "#FF6B35",
              }}
            ></div>
          )}

          <div className="card-body text-center p-4">
            <div className="mb-3">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle p-3 mb-2"
                style={{
                  backgroundColor: isSelected ? "#FF6B35" : "#374151",
                  transition: "all 0.3s ease",
                }}
              >
                <Icon size={32} color={isSelected ? "#FFFFFF" : "#FF6B35"} />
              </div>
            </div>

            <h5 className="card-title mb-2 fw-bold text-white">
              {category.name}
            </h5>

            <p className="card-text small mb-3" style={{ color: "#9CA3AF" }}>
              {category.description}
            </p>

            {isSelected && (
              <div className="mt-3">
                <span
                  className="badge px-3 py-2 rounded-pill"
                  style={{
                    backgroundColor: "#FF6B35",
                    color: "#FFFFFF",
                  }}
                >
                  <i className="bi bi-check-circle-fill me-1"></i>
                  Selected {userCount > 0 && `• ${userCount} users`}
                </span>
              </div>
            )}
          </div>

          {!isSelected && (
            <div className="card-footer bg-transparent border-0 text-center">
              <small style={{ color: "#6B7280" }}>Click to select</small>
            </div>
          )}
        </div>
      </div>
    );
  };

  const UserPreview = ({ users }) => (
    <div
      className="mt-4 p-4 border rounded-3 shadow-sm"
      style={{
        backgroundColor: "#374151",
        borderColor: "#4B5563",
      }}
    >
      <h6 className="text-white mb-4 d-flex align-items-center fw-bold">
        <Users2 size={20} className="me-2" style={{ color: "#FF6B35" }} />
        Preview Users ({userCount} total)
      </h6>

      <div className="row g-3">
        {users.map((user, index) => (
          <div key={index} className="col-12">
            <div
              className="card border-0 shadow-sm"
              style={{ backgroundColor: "#2D3748" }}
            >
              <div className="card-body p-3">
                <div className="row align-items-center">
                  <div className="col-auto">
                    <div
                      className="text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: "#FF6B35",
                      }}
                    >
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  </div>

                  <div className="col">
                    <h6 className="mb-1 text-white fw-semibold">{user.name}</h6>
                    <p className="mb-0 small" style={{ color: "#9CA3AF" }}>
                      @{user.username}
                    </p>
                    <p className="mb-0 small" style={{ color: "#9CA3AF" }}>
                      {user.email}
                    </p>
                  </div>

                  <div className="col-auto text-end">
                    {user.directRefs !== undefined && (
                      <div>
                        <span
                          className="badge mb-1 d-block"
                          style={{
                            backgroundColor: "#FF6B35",
                            color: "#FFFFFF",
                          }}
                        >
                          {user.directRefs} Direct
                        </span>
                        <small style={{ color: "#9CA3AF" }}>
                          {user.totalRefs} Total
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {userCount > 5 && (
        <div className="text-center mt-3">
          <small style={{ color: "#9CA3AF" }}>
            ... and {userCount - 5} more users
          </small>
        </div>
      )}
    </div>
  );

  return (
    <DashboardLayout>
      <section className="py-4">
        <div className="container-fluid">
          <div
            className="rounded-3  p-4"
            style={{ backgroundColor: "#1b232d" }}
          >
            {/* Header */}
            <div
              className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-5 pb-3 border-bottom"
              style={{ borderColor: "#374151" }}
            >
              <div className="mb-3 mb-md-0">
                <h2 className="mb-2 d-flex align-items-center text-white fw-bold">
                  <Send
                    size={28}
                    className="me-3"
                    style={{ color: "#FF6B35" }}
                  />
                  Bulk Notification Center
                </h2>
                <p className="mb-0" style={{ color: "#9CA3AF" }}>
                  Send targeted notifications to specific user groups
                </p>
              </div>

              <div className="d-flex align-items-center gap-2 flex-wrap">
                {selectedCategory && (
                  <>
                    <button
                      className="btn btn-outline-secondary btn-sm d-flex align-items-center"
                      onClick={handleRefreshData}
                      disabled={currentLoading}
                      style={{
                        borderColor: "#6B7280",
                        color: "#9CA3AF",
                      }}
                    >
                      {currentLoading ? (
                        <div
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      ) : (
                        <RefreshCw size={16} className="me-2" />
                      )}
                      Refresh Data
                    </button>

                    <span
                      className="badge px-3 py-2 fs-6"
                      style={{
                        backgroundColor: "#FF6B35",
                        color: "#FFFFFF",
                      }}
                    >
                      {userCount} users selected
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Step 1: Select User Category */}
            <div className="mb-5">
              <div className="mb-4">
                <h4 className="mb-3 text-white fw-bold d-flex align-items-center">
                  <span
                    className="badge rounded-circle me-3 fs-6"
                    style={{
                      width: "35px",
                      height: "35px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#FF6B35",
                      color: "#FFFFFF",
                    }}
                  >
                    1
                  </span>
                  Select User Category
                </h4>
                <p className="ms-5" style={{ color: "#9CA3AF" }}>
                  Choose the target audience for your notification
                </p>
              </div>

              {currentLoading ? (
                <div className="text-center py-5">
                  <div
                    className="spinner-border mb-3"
                    role="status"
                    style={{ color: "#FF6B35" }}
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p style={{ color: "#9CA3AF" }}>
                    Fetching user categories...
                  </p>
                </div>
              ) : (
                <div className="row g-4">
                  {userCategories.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                  ))}
                </div>
              )}

              {/* Selected Category Info */}
              {selectedCategory && userCount > 0 && (
                <div className="mt-4">
                  <div
                    className="alert border-0 shadow-sm"
                    style={{
                      backgroundColor: "#66462a",
                      borderColor: "#66462a",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <i
                          className="bi bi-check-circle-fill me-2 fs-5"
                          style={{ color: "#66462a" }}
                        ></i>
                        <span className="fw-semibold text-white">
                          {userCount} users found in "
                          {
                            userCategories.find(
                              (cat) => cat.id === selectedCategory
                            )?.name
                          }
                          "
                        </span>
                      </div>

                      <button
                        className={`btn btn-sm d-flex align-items-center ${
                          showPreview ? "btn-danger" : ""
                        }`}
                        onClick={() => setShowPreview(!showPreview)}
                        style={{
                          backgroundColor: showPreview ? "#DC2626" : "#FF6B35",
                          borderColor: showPreview ? "#DC2626" : "#FF6B35",
                          color: "#FFFFFF",
                        }}
                      >
                        {showPreview ? (
                          <>
                            <EyeOff size={16} className="me-2" />
                            Hide Preview
                          </>
                        ) : (
                          <>
                            <Eye size={16} className="me-2" />
                            Show Preview
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {showPreview && previewUsers.length > 0 && (
                    <UserPreview users={previewUsers} />
                  )}
                </div>
              )}
            </div>

            {/* Step 2: Compose Notification */}
            <div className="mb-5">
              <div className="mb-4">
                <h4 className="mb-3 text-white fw-bold d-flex align-items-center">
                  <span
                    className="badge rounded-circle me-3 fs-6"
                    style={{
                      width: "35px",
                      height: "35px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#FF6B35",
                      color: "#FFFFFF",
                    }}
                  >
                    2
                  </span>
                  Compose Notification
                </h4>
                <p className="ms-5" style={{ color: "#9CA3AF" }}>
                  Create your notification content
                </p>
              </div>

              <Formik
                initialValues={{
                  notificationTitle: "",
                  notificationMessage: "",
                  notificationLink: "",
                  notificationtType: "zoom session",
                }}
                validationSchema={validationSchema}
                onSubmit={async (values, { resetForm }) => {
                  if (!selectedCategory) {
                    toast.error("Please select a user category", toastConfig);
                    return;
                  }
                  console.log(values);

                  const confirmMessage = `Are you sure you want to send notification "${
                    values.notificationTitle
                  }" to ${userCount} users in category "${
                    userCategories.find((cat) => cat.id === selectedCategory)
                      ?.name
                  }"?`;

                  if (!window.confirm(confirmMessage)) {
                    return;
                  }

                  try {
                    const result = await sendBulkNotification({
                      category: selectedCategory,
                      title: values.notificationTitle,
                      message: values.notificationMessage,
                      notificationLink: values.notificationLink.trim() || "",
                      notificationtType: values.notificationtType,
                    }).unwrap();

                    if (result.success) {
                      toast.success(
                        `Notification sent successfully! ${result.data.success} sent, ${result.data.failed} failed`,
                        { ...toastConfig, autoClose: 5000 }
                      );
                      resetForm();
                      setSelectedCategory("");
                      setShowPreview(false);
                    } else {
                      toast.error(
                        result.message || "Failed to send notifications",
                        toastConfig
                      );
                    }
                  } catch (error) {
                    console.error("Error sending notification:", error);
                    toast.error(
                      error?.data?.message || "Failed to send notification",
                      toastConfig
                    );
                  }
                }}
              >
                {({ values, isSubmitting }) => (
                  <Form>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <div className="col-md-6">
                          <div className="mb-4">
                            <label
                              htmlFor="notificationType"
                              className="form-label d-flex align-items-center text-white fw-semibold mb-2"
                            >
                              <MessageCircle
                                size={18}
                                className="me-2"
                                style={{ color: "#FF6B35" }}
                              />
                              Notification type *
                            </label>
                            <Field
                              as="select"
                              name="notificationType"
                              className="form-select border-2"
                              style={{
                                backgroundColor: "#374151",
                                borderColor: "#6B7280",
                                color: "#FFFFFF",
                              }}
                            >
                              <option value="">Select notification type</option>
                              <option value="zoom session">zoom session</option>
                              <option value="push notifications">Push Notification</option>
                            </Field>
                            <ErrorMessage
                              name="notificationType"
                              component="div"
                              className="text-danger small mt-2"
                            />
                          </div>
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor="notificationTitle"
                            className="form-label d-flex align-items-center text-white fw-semibold mb-2"
                          >
                            <Edit3
                              size={18}
                              className="me-2"
                              style={{ color: "#FF6B35" }}
                            />
                            Notification Title *
                          </label>
                          <Field
                            type="text"
                            name="notificationTitle"
                            className="form-control form-control-lg border-2"
                            placeholder="Enter a compelling notification title"
                            maxLength={100}
                            style={{
                              backgroundColor: "#374151",
                              borderColor: "#6B7280",
                              color: "#FFFFFF",
                            }}
                          />
                          <ErrorMessage
                            name="notificationTitle"
                            component="div"
                            className="text-danger small mt-2"
                          />
                          <div
                            className="form-text"
                            style={{ color: "#9CA3AF" }}
                          >
                            {values.notificationTitle.length}/100 characters
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-4">
                          <label
                            htmlFor="notificationMessage"
                            className="form-label d-flex align-items-center text-white fw-semibold mb-2"
                          >
                            <MessageCircle
                              size={18}
                              className="me-2"
                              style={{ color: "#FF6B35" }}
                            />
                            Notification Message *
                          </label>
                          <Field
                            as="textarea"
                            name="notificationMessage"
                            className="form-control border-2"
                            rows="5"
                            placeholder="Write your notification message here..."
                            maxLength={500}
                            style={{
                              backgroundColor: "#374151",
                              borderColor: "#6B7280",
                              color: "#FFFFFF",
                            }}
                          />
                          <ErrorMessage
                            name="notificationMessage"
                            component="div"
                            className="text-danger small mt-2"
                          />
                          <div
                            className="form-text"
                            style={{ color: "#9CA3AF" }}
                          >
                            {values.notificationMessage.length}/500 characters
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-4">
                          <label
                            htmlFor="notificationLink"
                            className="form-label d-flex align-items-center text-white fw-semibold mb-2"
                          >
                            <ExternalLink
                              size={18}
                              className="me-2"
                              style={{ color: "#FF6B35" }}
                            />
                            Action Link (Optional)
                          </label>
                          <Field
                            type="text"
                            name="notificationLink"
                            className="form-control form-control-lg border-2"
                            placeholder="https://example.com/action"
                            style={{
                              backgroundColor: "#374151",
                              borderColor: "#6B7280",
                              color: "#FFFFFF",
                            }}
                          />
                          <ErrorMessage
                            name="notificationLink"
                            component="div"
                            className="text-danger small mt-2"
                          />
                          <div
                            className="form-text"
                            style={{ color: "#9CA3AF" }}
                          >
                            Add a clickable link to your notification
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Notification Preview */}
                    {(values.notificationTitle ||
                      values.notificationMessage) && (
                      <div className="mt-4">
                        <h6 className="mb-3 d-flex align-items-center text-white fw-semibold">
                          <Eye
                            size={18}
                            className="me-2"
                            style={{ color: "#FF6B35" }}
                          />
                          Live Preview
                        </h6>

                        <div className="row">
                          <div className="col-lg-6">
                            <div
                              className="card shadow-sm border-2"
                              style={{
                                backgroundColor: "#2D3748",
                                borderColor: "#FF6B35",
                              }}
                            >
                              <div
                                className="card-header d-flex align-items-center"
                                style={{
                                  backgroundColor: "#FF6B35",
                                  color: "#FFFFFF",
                                }}
                              >
                                <div
                                  className="bg-white rounded-circle me-2"
                                  style={{ width: "24px", height: "24px" }}
                                ></div>
                                <div className="flex-grow-1">
                                  <small className="fw-bold">
                                    Your App Notification
                                  </small>
                                </div>
                                <small className="opacity-75">now</small>
                              </div>

                              <div className="card-body">
                                <h6 className="card-title text-white fw-bold mb-2">
                                  {values.notificationTitle ||
                                    "Your notification title will appear here"}
                                </h6>
                                <p
                                  className="card-text mb-3"
                                  style={{ color: "#9CA3AF" }}
                                >
                                  {values.notificationMessage ||
                                    "Your notification message will appear here"}
                                </p>
                                {values.notificationLink && (
                                  <a
                                    href={values.notificationLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-sm"
                                    style={{
                                      backgroundColor: "transparent",
                                      borderColor: "#FF6B35",
                                      color: "#FF6B35",
                                    }}
                                  >
                                    <ExternalLink size={14} className="me-1" />
                                    Open Link
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Send Notification */}
                    <div className="mt-5">
                      <div className="mb-4">
                        <h4 className="mb-3 text-white fw-bold d-flex align-items-center">
                          <span
                            className="badge rounded-circle me-3 fs-6"
                            style={{
                              width: "35px",
                              height: "35px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "#FF6B35",
                              color: "#FFFFFF",
                            }}
                          >
                            3
                          </span>
                          Send Notification
                        </h4>
                        <p className="ms-5" style={{ color: "#9CA3AF" }}>
                          Review and send your notification
                        </p>
                      </div>

                      <div
                        className="card border-2"
                        style={{
                          backgroundColor: "#66462a",
                          borderColor: "#66462a",
                        }}
                      >
                        <div className="card-body p-4">
                          <div className="row align-items-center">
                            <div className="col-md-8">
                              <h5
                                className="fw-bold mb-2 d-flex align-items-center"
                                style={{ color: "#fff" }}
                              >
                                <i className="bi bi-rocket-takeoff me-2"></i>
                                Ready to Launch?
                              </h5>
                              <p className="mb-0" style={{ color: "#FFFFFF" }}>
                                {selectedCategory && userCount > 0
                                  ? `Your notification will be delivered to ${userCount} users in the "${
                                      userCategories.find(
                                        (cat) => cat.id === selectedCategory
                                      )?.name
                                    }" category.`
                                  : "Please complete steps 1 and 2 before sending your notification."}
                              </p>
                            </div>

                            <div className="col-md-4 text-md-end mt-3 mt-md-0">
                              <button
                                type="submit"
                                className="btn btn-lg px-4 py-2 fw-bold shadow"
                                disabled={
                                  isSubmitting ||
                                  !selectedCategory ||
                                  !values.notificationTitle.trim() ||
                                  !values.notificationMessage.trim() ||
                                  userCount === 0
                                }
                                style={{
                                  backgroundColor: "#eb660f",
                                  borderColor: "#eb660f",
                                  color: "#FFFFFF",
                                }}
                              >
                                {isSubmitting ? (
                                  <>
                                    <div
                                      className="spinner-border spinner-border-sm me-2"
                                      role="status"
                                    >
                                      <span className="visually-hidden">
                                        Loading...
                                      </span>
                                    </div>
                                    Sending...
                                  </>
                                ) : (
                                  <>
                                    <Send size={20} className="me-2" />
                                    Send to{" "}
                                    {userCount > 0
                                      ? `${userCount} Users`
                                      : "Users"}
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default BulkNotificationManagement;
