import React, { useState, useEffect, useContext } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Pagination from "../../components/Pagination";
import DashboardLayout from "../../Layout/DashboardLayout";
import Modals from "../../components/Modals";
import {
  useBlockUserMutation,
  useGetAdminUserQuery,
  useSendUserMutation,
  useViewUserQuery,
  useEditUserMutation,
} from "./adminApiSlice";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import countryCodes from "../../components/countryCodes.json";

const AdminManagement = () => {
  const [refresh, setRefresh] = useState(false);
  const [blockUser] = useBlockUserMutation();
  const [errors, setErrors] = useState({});
  const [errorsT, setErrorsT] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [sendUser] = useSendUserMutation();
  const [editUser] = useEditUserMutation();

  //pagination
  const [state, setState] = useState({
    currentPage: 1,
    perPage: 10,
    search: "",
    selectedUserId: "",
    userStatus: {},
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    countryCode: "+91",
    mobile: "",
    permissions: [],
  });

  const [formEditData, setFormEditData] = useState({
    name: "",
    email: "",
    countryCode: "",
    mobile: "",
    permissions: [],
  });

  const queryParams = `limit=${state?.perPage || ""}&page=${
    state?.currentPage || ""
  }&search=${state?.search || ""}`;

  const {
    data: getAdminUser,
    isLoading,
    refetch,
  } = useGetAdminUserQuery(queryParams);
  const {
    data: viewUser,
    isLoading: isUserLoading,
    refetch: ViewadminUsers,
  } = useViewUserQuery(state.selectedUserId, { skip: !state.selectedUserId });

  const TableData = getAdminUser?.data?.users || [];

  // Handle PerChange
  const handlePageChange = (e) => {
    setState({ ...state, currentPage: e });
  };

  // Function for handling search with delay
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

  //handleUserView
  const handleUserView = (userId) => {
    console.log(userId);
    setState({ ...state, selectedUserId: userId });
  };

  const handleToggleActive = async (userId, isBlock) => {
    try {
      const isBlocked = isBlock == true ? 0 : 1;

      const payload = {
        is_blocked: isBlocked,
        user_id: userId,
      };

      // Update local state first
      const updatedUserStatus = {
        ...state.userStatus,
        [userId]: !isBlock,
      };
      setState({ ...state, userStatus: updatedUserStatus });

      // Make API call to update server-side status
      const response = await blockUser(payload);
      toast.success(`${response?.data?.message}`, {
        position: "top-center",
      });
      setRefresh(true);
    } catch (error) {
      toast.error(`${error?.data?.message}`, {
        position: "top-center",
      });
      console.error("Failed to update user status:", error);
    }
  };

  useEffect(() => {
    if (refresh) {
      refetch();
      if (state.selectedUserId) {
        ViewadminUsers();
      }

      setRefresh(false);
    }
  }, [refresh, refetch]);

  useEffect(() => {
    if (viewUser?.data) {
      setFormEditData({
        name: viewUser.data.name || "",
        email: viewUser.data.email || "",
        countryCode: "+" + viewUser.data.countryCode || "",
        mobile: viewUser.data.phone || "",
        permissions: viewUser.data.permissions || [],
      });
    }
  }, [viewUser]);

  const toggleModal = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      countryCode: "+91",
      mobile: "",
      permissions: [],
    });
    setErrors({});
    setRefresh(true);
    setIsVisible(!isVisible);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChange = (e) => {
    const { name } = e.target;
    if (name === "countryCode") {
      const selectedCountryName = countryCodes.filter(
        (item) => item.countryCode === e.target.value
      )[0]?.countryCode;

      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        countryCode: selectedCountryName,
      });
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === "countryCode") {
      const selectedCountryName = countryCodes.filter(
        (item) => item.countryCode === e.target.value
      )[0]?.countryCode;
      console.log(e.target.value + "<><>" + selectedCountryName);
      setFormEditData((prev) => ({
        ...prev,
        [name]: value,
        countryCode: selectedCountryName,
      }));
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setFormEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleKeyPress = (e) => {
    // Allow only numbers
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const permissions = checked
        ? [...prev.permissions, value]
        : prev.permissions.filter((permissions) => permissions !== value);

      return { ...prev, permissions };
    });
  };

  const handleEditCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormEditData((prev) => {
      const permissions = checked
        ? [...prev.permissions, value]
        : prev.permissions.filter((permissions) => permissions !== value);

      return { ...prev, permissions };
    });
  };

  const handleSubmit = async (e) => {
    if (!validate()) {
      return;
    }
    e.preventDefault();

    try {
      const res = await sendUser({
        name: formData.name,
        email: formData.email,
        countryCode: formData.countryCode,
        phone: Number(formData.mobile),
        password: formData.password,
        permissions: formData.permissions,
      });

      if (res?.data?.message) {
        toast.success(res?.data?.message, {
          position: "top-center",
        });
        document.getElementById("closeModal").click();
        setFormData({
          name: "",
          email: "",
          countryCode: "",
          mobile: "",
          permissions: [],
        });
        setRefresh(true);
      } else {
        toast.error(res?.error?.data?.message, {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Transaction failed:", error);
      toast.error(`${error?.data?.message}`);
    }
  };

  const handleUserSubmit = async (e, formEditData) => {
    if (!validateEdit()) {
      return;
    }
    e.preventDefault();
    try {
      const res = await editUser({
        adminId: state.selectedUserId,
        name: formEditData.name,
        email: formEditData.email,
        countryCode: formEditData.countryCode,
        phone: Number(formEditData.mobile),
        password: formEditData.password,
        permissions: formEditData.permissions,
      });
      setFormEditData({
        name: formEditData.name,
        email: formEditData.email,
        countryCode: formEditData.countryCode,
        mobile: Number(formEditData.mobile),
        permissions: formEditData.permissions,
      });
      if (res?.data?.message) {
        toast.success(res?.data?.message, {
          position: "top-center",
        });
        setRefresh(true);
        document.getElementById("closeModalEdit").click();
      } else {
        toast.error(res?.error?.data?.message, {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Transaction failed:", error);
      toast.error(`${error?.data?.message}`);
    }
  };

  const validate = () => {
    const errors = {};
    // const emailRegex = /^[a-zA-Z0-9_.±]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/;
    const emailRegex =
      /^[^\W_](?:[\w.-]*[^\W_])?@(?:\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.|(?:[\w-]+\.)+)(?:[a-zA-Z]{2,3}|[0-9]{1,3})\]?$/gm;
    const phoneRegex = /^[0-9]{6,12}$/;

    // Name validation
    if (!formData.name || formData.name.length < 3) {
      errors.name = formData.name
        ? "Name must be at least 3 characters"
        : "Name is required";
    } else {
    }

    // Email validation
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    // Phone validation
    if (!formData.mobile) {
      errors.mobile = "Phone number is required";
    } else if (!phoneRegex.test(formData.mobile)) {
      errors.mobile = "Invalid phone number format";
    }

    const permissionsData = formData.permissions;

    if (permissionsData.length === 0) {
      errors.permissions = "Permissions is required";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateEdit = () => {
    const errorsT = {};
    //const emailRegex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;

    const emailRegex =
      /^[^\W_](?:[\w.-]*[^\W_])?@(?:\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.|(?:[\w-]+\.)+)(?:[a-zA-Z]{2,3}|[0-9]{1,3})\]?$/gm;
    const phoneRegex = /^[0-9]{6,12}$/;

    // Name validation
    if (!formEditData.name || formEditData.name.length < 3) {
      errorsT.name = formEditData.name
        ? "Name must be at least 3 characters"
        : "Name is required";
    }
    // Email validation
    if (!formEditData.email) {
      errorsT.email = "Email is required";
    } else if (!emailRegex.test(formEditData.email)) {
      errorsT.email = "Invalid email format";
    }

    // Phone validation
    if (!formEditData.mobile) {
      errorsT.mobile = "Phone number is required";
    } else if (!phoneRegex.test(formEditData.mobile)) {
      errorsT.mobile = "Invalid phone number format";
    }

    const permissionsData = formEditData.permissions;

    if (permissionsData.length === 0) {
      errorsT.permissions = "Permissions is required";
    }
    setErrorsT(errorsT);
    return Object.keys(errorsT).length === 0;
  };

  const handleCancel = async () => {
    setFormData({
      name: "",
      email: "",
      countryCode: "",
      mobile: "",
      permissions: [],
    });
    setErrors({});
    setRefresh(true);
    document.getElementById("closeModal").click();
  };

  const handleEditCancel = async () => {
    setFormEditData({
      name: viewUser.data.name,
      email: viewUser.data.email,
      countryCode: viewUser.data.countryCode,
      mobile: viewUser.data.phone,
      permissions: viewUser.data.permissions,
    });
    setErrorsT({});
    setRefresh(true);
    document.getElementById("closeModalEdit").click();
  };

  return (
    <>
      <DashboardLayout>
        <section className="profile_section user__management py-4">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="my_total_team_data rounded-3 px-3 pb-0 py-4">
                  <h1 className="mb-3">Admin Users</h1>
                  <div className="row justify-content-between">
                    <div className="col-12 col-sm-6 col-md-2 col-xxl-1 ">
                      <div className="pagination__box mb-4">
                        <div className=" showing_data">
                          <select
                            className="form-select shadow-none"
                            aria-label="Default select example"
                            onClick={(e) =>
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
                    <div className="col-12 col-sm-6 col-md-2 col-xxl-1 mt-4">
                      <button
                        type="button"
                        className="userButton"
                        data-bs-toggle="modal"
                        data-bs-target="#addModal"
                        onClick={toggleModal}
                      >
                        Add User
                      </button>
                    </div>
                    <div className="col-12 col-sm-6 col-md-3 col-lg-2 mt-4">
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
                            placeholder="Search"
                            aria-label="search"
                            name="search"
                            aria-describedby="basic-addon1"
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
                          <th scope="col">User No.</th>
                          <th scope="col">Name</th>
                          <th scope="col">Email</th>
                          <th scope="col">Phone</th>
                          <th scope="col">Referral Code</th>
                          <th scope="col">Block/Unblock</th>
                          <th scope="col">Status</th>
                          <th scope="col">View User</th>
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
                        ) : TableData.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="text-center">
                              No data found
                            </td>
                          </tr>
                        ) : (
                          TableData.map((data, i) => (
                            <tr key={i}>
                              <td>
                                {state?.currentPage * state?.perPage -
                                  (state?.perPage - 1) +
                                  i}
                                .
                              </td>
                              <td>{data.name}</td>
                              <td>{data.email}</td>
                              <td>
                                +{data.countryCode} {data.phone}
                              </td>
                              <td>{data.username}</td>

                              <td>
                                <div className="form-check form-switch">
                                  <input
                                    className="form-check-input shadow-none"
                                    type="checkbox"
                                    role="switch"
                                    id={`toggle-${data._id}`}
                                    checked={data.isBlock == false}
                                    onChange={() =>
                                      handleToggleActive(data._id, data.isBlock)
                                    }
                                  />
                                </div>
                              </td>
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
                                  style={{ cursor: "pointer" }}
                                  data-bs-toggle="modal"
                                  data-bs-target="#editModal"
                                  onClick={() => handleUserView(data._id)}
                                >
                                  <img
                                    src="/images/icons/show.svg"
                                    alt="icon"
                                    title="View User"
                                  />
                                </span>
                              </td>
                              <td>
                                <span
                                  style={{ cursor: "pointer" }}
                                  data-bs-toggle="modal"
                                  data-bs-target="#editUserModal"
                                  onClick={() => handleUserView(data._id)}
                                >
                                  <img
                                    src="/images/icons/edit.svg"
                                    alt="icon"
                                    title="Edit User"
                                  />
                                </span>
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
                    currentPage={state?.currentPage}
                    totalPages={
                      Math.ceil(
                        getAdminUser?.data?.pagination?.total / state?.perPage
                      ) || 1
                    }
                    onPageChange={handlePageChange}
                  />
                )}
              </div>
            </div>
          </div>

          <div
            className="modal fade common__modal"
            id="editModal"
            tabIndex="-1"
            aria-labelledby="editModalLabel"
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
                  ></button>
                </div>
                <div className="modal-body pt-0 px-4">
                  <h1 className="modal-title mb-4" id="editModalLabel">
                    User Details
                  </h1>
                  {state.selectedUserId && !isUserLoading && viewUser && (
                    <div className="user-details">
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <div className="form__box">
                            <label htmlFor="">Name</label>
                            <input
                              type="text"
                              autoComplete="off"
                              className="form-control shadow-none"
                              value={viewUser?.data?.name}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="form__box">
                            <label htmlFor="">Email</label>
                            <input
                              type="text"
                              autoComplete="off"
                              className="form-control shadow-none"
                              value={viewUser?.data?.email}
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="col-md-6 mb-3">
                          <div className="form__box">
                            <label htmlFor="">Phone</label>
                            <input
                              type="text"
                              autoComplete="off"
                              className="form-control shadow-none"
                              value={`+${viewUser?.data?.countryCode} ${viewUser?.data?.phone}`}
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="col-md-12 mb-3">
                          <div className="form__box">
                            <label
                              htmlFor=""
                              className="form-label fw-semibold mb-3"
                            >
                              Permissions
                            </label>
                            <fieldset className="border-0 p-0">
                              <div className="row g-3">
                                <div className="col-lg-6 col-md-12">
                                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                    <label className="mb-0 fw-medium">
                                      KYC
                                    </label>
                                    <input
                                      type="checkbox"
                                      value="KYC MANAGEMENT"
                                      checked={viewUser?.data?.permissions.includes(
                                        "KYC MANAGEMENT"
                                      )}
                                      readOnly
                                      className="form-check-input"
                                    />
                                  </div>

                                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                    <label className="mb-0 fw-medium">
                                      Reports
                                    </label>
                                    <input
                                      type="checkbox"
                                      value="REPORTS"
                                      checked={viewUser?.data?.permissions.includes(
                                        "REPORTS"
                                      )}
                                      readOnly
                                      className="form-check-input"
                                    />
                                  </div>

                                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                    <label className="mb-0 fw-medium">
                                      Wallet
                                    </label>
                                    <input
                                      type="checkbox"
                                      value="WALLET MANAGEMENT"
                                      checked={viewUser?.data?.permissions.includes(
                                        "WALLET MANAGEMENT"
                                      )}
                                      readOnly
                                      className="form-check-input"
                                    />
                                  </div>

                                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                    <label className="mb-0 fw-medium">
                                      Withdrawal
                                    </label>
                                    <input
                                      type="checkbox"
                                      value="WITHDRAW MANAGEMENT"
                                      checked={viewUser?.data?.permissions.includes(
                                        "WITHDRAW MANAGEMENT"
                                      )}
                                      readOnly
                                      className="form-check-input"
                                    />
                                  </div>

                                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                    <label className="mb-0 fw-medium">
                                      User Info
                                    </label>
                                    <input
                                      type="checkbox"
                                      value="USER INFO"
                                      checked={viewUser?.data?.permissions.includes(
                                        "USER INFO"
                                      )}
                                      readOnly
                                      className="form-check-input"
                                    />
                                  </div>

                                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                    <label className="mb-0 fw-medium">
                                      Support
                                    </label>
                                    <input
                                      type="checkbox"
                                      value="SUPPORT"
                                      checked={viewUser?.data?.permissions.includes(
                                        "SUPPORT"
                                      )}
                                      readOnly
                                      className="form-check-input"
                                    />
                                  </div>

                                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                    <label className="mb-0 fw-medium">
                                      Home Access
                                    </label>
                                    <input
                                      type="checkbox"
                                      value="DASHBOARD"
                                      checked={viewUser?.data?.permissions.includes(
                                        "DASHBOARD"
                                      )}
                                      readOnly
                                      className="form-check-input"
                                    />
                                  </div>

                                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                    <label className="mb-0 fw-medium">
                                      Total User
                                    </label>
                                    <input
                                      type="checkbox"
                                      value="USER MANAGEMENT"
                                      checked={viewUser?.data?.permissions.includes(
                                        "USER MANAGEMENT"
                                      )}
                                      readOnly
                                      className="form-check-input"
                                    />
                                  </div>

                                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                    <label className="mb-0 fw-medium">
                                      Referral
                                    </label>
                                    <input
                                      type="checkbox"
                                      value="REFERRAL"
                                      checked={viewUser?.data?.permissions.includes(
                                        "REFERRAL"
                                      )}
                                      readOnly
                                      className="form-check-input"
                                    />
                                  </div>

                                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                    <label className="mb-0 fw-medium">
                                      ICO Management
                                    </label>
                                    <input
                                      type="checkbox"
                                      value="ICO_MANAGEMENT"
                                      checked={viewUser?.data?.permissions.includes(
                                        "ICO_MANAGEMENT"
                                      )}
                                      readOnly
                                      className="form-check-input"
                                    />
                                  </div>
                                </div>

                                <div className="col-lg-6 col-md-12">
                                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                    <label className="mb-0 fw-medium">
                                      Exclude Users
                                    </label>
                                    <input
                                      type="checkbox"
                                      value="EXCLUDE_USERS"
                                      checked={viewUser?.data?.permissions.includes(
                                        "EXCLUDE_USERS"
                                      )}
                                      readOnly
                                      className="form-check-input"
                                    />
                                  </div>

                                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                    <label className="mb-0 fw-medium">
                                      Legal Update
                                    </label>
                                    <input
                                      type="checkbox"
                                      value="LEGAL_UPDATION"
                                      checked={viewUser?.data?.permissions.includes(
                                        "LEGAL_UPDATION"
                                      )}
                                      readOnly
                                      className="form-check-input"
                                    />
                                  </div>

                                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                    <label className="mb-0 fw-medium">
                                      Buy History
                                    </label>
                                    <input
                                      type="checkbox"
                                      value="BUY_HISTORY"
                                      checked={viewUser?.data?.permissions.includes(
                                        "BUY_HISTORY"
                                      )}
                                      readOnly
                                      className="form-check-input"
                                    />
                                  </div>

                                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                    <label className="mb-0 fw-medium">
                                      Setting
                                    </label>
                                    <input
                                      type="checkbox"
                                      value="SETTING"
                                      checked={viewUser?.data?.permissions.includes(
                                        "SETTING"
                                      )}
                                      readOnly
                                      className="form-check-input"
                                    />
                                  </div>

                                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                    <label className="mb-0 fw-medium">
                                      Bonus History
                                    </label>
                                    <input
                                      type="checkbox"
                                      value="SUPER BONUS"
                                      checked={viewUser?.data?.permissions.includes(
                                        "SUPER BONUS"
                                      )}
                                      readOnly
                                      className="form-check-input"
                                    />
                                  </div>

                                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                    <label className="mb-0 fw-medium">
                                      Deleted Accounts
                                    </label>
                                    <input
                                      type="checkbox"
                                      value="DELETE ACCOUNTS"
                                      checked={viewUser?.data?.permissions.includes(
                                        "DELETE ACCOUNTS"
                                      )}
                                      readOnly
                                      className="form-check-input"
                                    />
                                  </div>

                                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                    <label className="mb-0 fw-medium">
                                      Business Analytics
                                    </label>
                                    <input
                                      type="checkbox"
                                      value="GET_BUSINESS_ANALYTICS"
                                      checked={viewUser?.data?.permissions.includes(
                                        "GET_BUSINESS_ANALYTICS"
                                      )}
                                      readOnly
                                      className="form-check-input"
                                    />
                                  </div>

                                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                    <label className="mb-0 fw-medium">
                                      Business Report
                                    </label>
                                    <input
                                      type="checkbox"
                                      value="BUSINESS REPORT"
                                      checked={viewUser?.data?.permissions.includes(
                                        "BUSINESS REPORT"
                                      )}
                                      readOnly
                                      className="form-check-input"
                                    />
                                  </div>

                                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                    <label className="mb-0 fw-medium">
                                      Share Holders
                                    </label>
                                    <input
                                      type="checkbox"
                                      value="SHARE_HOLDERS"
                                      checked={viewUser?.data?.permissions.includes(
                                        "SHARE_HOLDERS"
                                      )}
                                      readOnly
                                      className="form-check-input"
                                    />
                                  </div>
                                </div>
                              </div>
                            </fieldset>
                          </div>
                        </div>
                      </div>
                      <div className="text-center my-4">
                        <button
                          type="button"
                          className="btn btn-secondary  px-3"
                          data-bs-dismiss="modal"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                  {isUserLoading && <Skeleton count={5} />}
                </div>
              </div>
            </div>
          </div>
          {/* Add User Code Starts */}

          <div
            className="modal fade common__modal"
            id="addModal"
            tabIndex="-1"
            aria-labelledby="addModalLabel"
            aria-hidden="true"
            style={{ display: isVisible ? "inline-block" : "none" }}
            data-bs-backdrop="static"
            data-bs-keyboard="false"
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header border-0 pb-0">
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    id="closeModal"
                    onClick={handleCancel}
                  ></button>
                </div>
                <div className="modal-body pt-0 px-4">
                  <h1 className="modal-title mb-4" id="addModalLabel">
                    Add User
                  </h1>
                  <div className="user-details">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <div className="form__box">
                          <label htmlFor="">Name</label>
                          <input
                            type="text"
                            autoComplete="off"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your name"
                            className="form-control shadow-none"
                          />
                        </div>
                        {errors.name && (
                          <div className="error_cls">{errors.name}</div>
                        )}
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="form__box">
                          <label htmlFor="">Email</label>
                          <input
                            type="text"
                            autoComplete="off"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            className="form-control shadow-none"
                          />
                        </div>
                        {errors.email && (
                          <div className="error_cls">{errors.email}</div>
                        )}
                      </div>

                      <div className="col-md-6 mb-3">
                        <div className="form__box">
                          <label htmlFor="">Password</label>
                          <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter your password"
                            className="form-control shadow-none"
                          />
                        </div>
                        {errors.password && (
                          <div className="error_cls">{errors.password}</div>
                        )}
                      </div>

                      <div className="col-md-6 mb-3">
                        <div className="form__box">
                          <label htmlFor="">Country Code</label>
                          <select
                            className="form-select shadow-none"
                            aria-label="Default select example"
                            name="countryCode"
                            value={formData.countryCode}
                            onChange={handleChange}
                          >
                            {countryCodes.map(
                              ({ country_name, countryCode, flag }, i) => (
                                <option
                                  key={`${i}${countryCode}`}
                                  value={countryCode}
                                >
                                  {countryCode} {flag}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                      </div>

                      <div className="col-md-6 mb-3">
                        <div className="form__box">
                          <label htmlFor="">Phone</label>
                          <input
                            type="text"
                            autoComplete="off"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            placeholder="Enter your phone no."
                            className="form-control shadow-none"
                          />
                        </div>
                        {errors.mobile && (
                          <div className="error_cls">{errors.mobile}</div>
                        )}
                      </div>
                      <div className="col-md-12 mb-3">
                        <div className="form__box">
                          <label
                            htmlFor=""
                            className="form-label fw-semibold mb-3"
                          >
                            Permissions
                          </label>
                          <fieldset className="border-0 p-0">
                            <div className="row g-3">
                              <div className="col-lg-6 col-md-12">
                                <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                  <label className="mb-0 fw-medium">KYC</label>
                                  <input
                                    type="checkbox"
                                    value="KYC MANAGEMENT"
                                    checked={formData.permissions.includes(
                                      "KYC MANAGEMENT"
                                    )}
                                    onChange={handleCheckboxChange}
                                    className="form-check-input"
                                  />
                                </div>

                                <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                  <label className="mb-0 fw-medium">
                                    Reports
                                  </label>
                                  <input
                                    type="checkbox"
                                    value="REPORTS"
                                    checked={formData.permissions.includes(
                                      "REPORTS"
                                    )}
                                    onChange={handleCheckboxChange}
                                    className="form-check-input"
                                  />
                                </div>

                                <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                  <label className="mb-0 fw-medium">
                                    Wallet
                                  </label>
                                  <input
                                    type="checkbox"
                                    value="WALLET MANAGEMENT"
                                    checked={formData.permissions.includes(
                                      "WALLET MANAGEMENT"
                                    )}
                                    onChange={handleCheckboxChange}
                                    className="form-check-input"
                                  />
                                </div>

                                <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                  <label className="mb-0 fw-medium">
                                    Withdrawal
                                  </label>
                                  <input
                                    type="checkbox"
                                    value="WITHDRAW MANAGEMENT"
                                    checked={formData.permissions.includes(
                                      "WITHDRAW MANAGEMENT"
                                    )}
                                    onChange={handleCheckboxChange}
                                    className="form-check-input"
                                  />
                                </div>

                                <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                  <label className="mb-0 fw-medium">
                                    User Info
                                  </label>
                                  <input
                                    type="checkbox"
                                    value="USER INFO"
                                    checked={formData.permissions.includes(
                                      "USER INFO"
                                    )}
                                    onChange={handleCheckboxChange}
                                    className="form-check-input"
                                  />
                                </div>

                                <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                  <label className="mb-0 fw-medium">
                                    Support
                                  </label>
                                  <input
                                    type="checkbox"
                                    value="SUPPORT"
                                    checked={formData.permissions.includes(
                                      "SUPPORT"
                                    )}
                                    onChange={handleCheckboxChange}
                                    className="form-check-input"
                                  />
                                </div>

                                <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                  <label className="mb-0 fw-medium">
                                    Home Access
                                  </label>
                                  <input
                                    type="checkbox"
                                    value="DASHBOARD"
                                    checked={formData.permissions.includes(
                                      "DASHBOARD"
                                    )}
                                    onChange={handleCheckboxChange}
                                    className="form-check-input"
                                  />
                                </div>

                                <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                  <label className="mb-0 fw-medium">
                                    Total User
                                  </label>
                                  <input
                                    type="checkbox"
                                    value="USER MANAGEMENT"
                                    checked={formData.permissions.includes(
                                      "USER MANAGEMENT"
                                    )}
                                    onChange={handleCheckboxChange}
                                    className="form-check-input"
                                  />
                                </div>

                                <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                  <label className="mb-0 fw-medium">
                                    Referral
                                  </label>
                                  <input
                                    type="checkbox"
                                    value="REFERRAL"
                                    checked={formData.permissions.includes(
                                      "REFERRAL"
                                    )}
                                    onChange={handleCheckboxChange}
                                    className="form-check-input"
                                  />
                                </div>

                                <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                  <label className="mb-0 fw-medium">
                                    ICO Management
                                  </label>
                                  <input
                                    type="checkbox"
                                    value="ICO_MANAGEMENT"
                                    checked={formData.permissions.includes(
                                      "ICO_MANAGEMENT"
                                    )}
                                    onChange={handleCheckboxChange}
                                    className="form-check-input"
                                  />
                                </div>
                              </div>

                              <div className="col-lg-6 col-md-12">
                                <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                  <label className="mb-0 fw-medium">
                                    Exclude Users
                                  </label>
                                  <input
                                    type="checkbox"
                                    value="EXCLUDE_USERS"
                                    checked={formData.permissions.includes(
                                      "EXCLUDE_USERS"
                                    )}
                                    onChange={handleCheckboxChange}
                                    className="form-check-input"
                                  />
                                </div>

                                <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                  <label className="mb-0 fw-medium">
                                    Legal Update
                                  </label>
                                  <input
                                    type="checkbox"
                                    value="LEGAL_UPDATION"
                                    checked={formData.permissions.includes(
                                      "LEGAL_UPDATION"
                                    )}
                                    onChange={handleCheckboxChange}
                                    className="form-check-input"
                                  />
                                </div>

                                <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                  <label className="mb-0 fw-medium">
                                    Buy History
                                  </label>
                                  <input
                                    type="checkbox"
                                    value="BUY_HISTORY"
                                    checked={formData.permissions.includes(
                                      "BUY_HISTORY"
                                    )}
                                    onChange={handleCheckboxChange}
                                    className="form-check-input"
                                  />
                                </div>

                                <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                  <label className="mb-0 fw-medium">
                                    Setting
                                  </label>
                                  <input
                                    type="checkbox"
                                    value="SETTING"
                                    checked={formData.permissions.includes(
                                      "SETTING"
                                    )}
                                    onChange={handleCheckboxChange}
                                    className="form-check-input"
                                  />
                                </div>

                                <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                  <label className="mb-0 fw-medium">
                                    Bonus History
                                  </label>
                                  <input
                                    type="checkbox"
                                    value="SUPER BONUS"
                                    checked={formData.permissions.includes(
                                      "SUPER BONUS"
                                    )}
                                    onChange={handleCheckboxChange}
                                    className="form-check-input"
                                  />
                                </div>

                                <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                  <label className="mb-0 fw-medium">
                                    Deleted Accounts
                                  </label>
                                  <input
                                    type="checkbox"
                                    value="DELETE ACCOUNTS"
                                    checked={formData.permissions.includes(
                                      "DELETE ACCOUNTS"
                                    )}
                                    onChange={handleCheckboxChange}
                                    className="form-check-input"
                                  />
                                </div>

                                <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                  <label className="mb-0 fw-medium">
                                    Business Analytics
                                  </label>
                                  <input
                                    type="checkbox"
                                    value="GET_BUSINESS_ANALYTICS"
                                    checked={formData.permissions.includes(
                                      "GET_BUSINESS_ANALYTICS"
                                    )}
                                    onChange={handleCheckboxChange}
                                    className="form-check-input"
                                  />
                                </div>

                                <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                  <label className="mb-0 fw-medium">
                                    Business Report
                                  </label>
                                  <input
                                    type="checkbox"
                                    value="BUSINESS REPORT"
                                    checked={formData.permissions.includes(
                                      "BUSINESS REPORT"
                                    )}
                                    onChange={handleCheckboxChange}
                                    className="form-check-input"
                                  />
                                </div>

                                <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                  <label className="mb-0 fw-medium">
                                    Share Holders
                                  </label>
                                  <input
                                    type="checkbox"
                                    value="SHARE_HOLDERS"
                                    checked={formData.permissions.includes(
                                      "SHARE_HOLDERS"
                                    )}
                                    onChange={handleCheckboxChange}
                                    className="form-check-input"
                                  />
                                </div>
                              </div>
                            </div>
                          </fieldset>
                        </div>
                        {errors.permissions && (
                          <div className="error_cls">{errors.permissions}</div>
                        )}
                      </div>

                      <div className="text-center my-4">
                        <button
                          type="button"
                          className="btn_cancel my-4"
                          data-bs-dismiss="modal"
                          style={{ marginRight: "5%" }}
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="userButton"
                          onClick={(e) => handleSubmit(e, formData)}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                    {isUserLoading && <Skeleton count={5} />}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Add User Code Ends */}

          {/* Edit User Code Starts */}

          <div
            className="modal fade common__modal"
            id="editUserModal"
            tabIndex="-1"
            aria-labelledby="editModalLabel"
            aria-hidden="true"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header border-0 pb-0">
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    id="closeModalEdit"
                    onClick={handleEditCancel}
                  ></button>
                </div>
                <div className="modal-body pt-0 px-4">
                  <h1 className="modal-title mb-4" id="editModalLabel">
                    Edit User
                  </h1>
                  {state.selectedUserId && !isUserLoading && viewUser && (
                    <div className="user-details">
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <div className="form__box">
                            <label htmlFor="">Name</label>
                            <input
                              type="text"
                              autoComplete="off"
                              name="name"
                              value={formEditData?.name}
                              onChange={handleEditInputChange}
                              placeholder="Enter your name"
                              className="form-control shadow-none"
                            />
                          </div>
                          {errorsT.name && (
                            <div className="error_cls">{errorsT.name}</div>
                          )}
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="form__box">
                            <label htmlFor="">Email</label>
                            <input
                              type="email"
                              name="email"
                              value={formEditData?.email}
                              onChange={handleEditInputChange}
                              placeholder="Enter your email"
                              className="form-control shadow-none"
                              autoComplete="off"
                            />
                          </div>
                          {errorsT.email && (
                            <div className="error_cls">{errorsT.email}</div>
                          )}
                        </div>

                        <div className="col-md-6 mb-3">
                          <div className="form__box">
                            <label htmlFor="">Country Code</label>
                            <select
                              className="form-control bg-transparent text-white shadow-none"
                              name="countryCode"
                              value={formEditData?.countryCode}
                              onChange={handleEditChange}
                            >
                              {countryCodes.map(
                                ({ country_name, countryCode, flag }, i) => (
                                  <option
                                    key={`${i}${countryCode}`}
                                    value={countryCode}
                                    className="form-select bg-transparent text-black shadow-none"
                                  >
                                    {countryCode} {flag}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                        </div>

                        <div className="col-md-6 mb-3">
                          <div className="form__box">
                            <label htmlFor="">Phone</label>
                            <input
                              type="text"
                              autoComplete="off"
                              name="mobile"
                              value={formEditData?.mobile}
                              onChange={handleEditInputChange}
                              placeholder="Enter your phone no."
                              className="form-control shadow-none"
                              onKeyPress={handleKeyPress}
                            />
                          </div>
                          {errorsT.mobile && (
                            <div className="error_cls">{errorsT.mobile}</div>
                          )}
                        </div>
                        <div className="col-md-12 mb-3">
                          <div className="form__box">
                            <label
                              htmlFor=""
                              className="form-label fw-semibold mb-3"
                            >
                              Permissions
                            </label>
                            <fieldset className="border-0 p-0">
                              <div className="row g-3">
                                <div className="col-lg-6 col-md-12">
                                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                    <label className="mb-0 fw-medium">
                                      KYC
                                    </label>
                                    <input
                                      type="checkbox"
                                      value="KYC MANAGEMENT"
                                      checked={formEditData?.permissions.includes(
                                        "KYC MANAGEMENT"
                                      )}
                                      onChange={handleEditCheckboxChange}
                                      className="form-check-input"
                                    />
                                  </div>
                                   <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                    <label className="mb-0 fw-medium">
                                      Reports
                                    </label>
                                    <input
                                      type="checkbox"
                                      value="REPORTS"
                                      checked={formEditData?.permissions.includes(
                                        "REPORTS"
                                      )}
                                      onChange={handleEditCheckboxChange}
                                      className="form-check-input"
                                    />
                                  </div>

                                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                    <label className="mb-0 fw-medium">
                                      Wallet
                                    </label>
                                    <input
                                      type="checkbox"
                                      value="WALLET MANAGEMENT"
                                      checked={formEditData?.permissions.includes(
                                        "WALLET MANAGEMENT"
                                      )}
                                      onChange={handleEditCheckboxChange}
                                      className="form-check-input"
                                    />
                                  </div>

                                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                    <label className="mb-0 fw-medium">
                                      Withdrawal
                                    </label>
                                    <input
                                      type="checkbox"
                                      value="WITHDRAW MANAGEMENT"
                                      checked={formEditData.permissions.includes(
                                        "WITHDRAW MANAGEMENT"
                                      )}
                                      onChange={handleEditCheckboxChange}
                                      className="form-check-input"
                                    />
                                  </div>

                                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                    <label className="mb-0 fw-medium">
                                      User Info
                                    </label>
                                    <input
                                      type="checkbox"
                                      value="USER INFO"
                                      checked={formEditData.permissions.includes(
                                        "USER INFO"
                                      )}
                                      onChange={handleEditCheckboxChange}
                                      className="form-check-input"
                                    />
                                  </div>

                                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                    <label className="mb-0 fw-medium">
                                      Support
                                    </label>
                                    <input
                                      type="checkbox"
                                      value="SUPPORT"
                                      checked={formEditData.permissions.includes(
                                        "SUPPORT"
                                      )}
                                      onChange={handleEditCheckboxChange}
                                      className="form-check-input"
                                    />
                                  </div>

                                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                    <label className="mb-0 fw-medium">
                                      Home Access
                                    </label>
                                    <input
                                      type="checkbox"
                                      value="DASHBOARD"
                                      checked={formEditData.permissions.includes(
                                        "DASHBOARD"
                                      )}
                                      onChange={handleEditCheckboxChange}
                                      className="form-check-input"
                                    />
                                  </div>

                                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                    <label className="mb-0 fw-medium">
                                      Total User
                                    </label>
                                    <input
                                      type="checkbox"
                                      value="USER MANAGEMENT"
                                      checked={formEditData.permissions.includes(
                                        "USER MANAGEMENT"
                                      )}
                                      onChange={handleEditCheckboxChange}
                                      className="form-check-input"
                                    />
                                  </div>

                                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                    <label className="mb-0 fw-medium">
                                      Referral
                                    </label>
                                    <input
                                      type="checkbox"
                                      value="REFERRAL"
                                      checked={formEditData.permissions.includes(
                                        "REFERRAL"
                                      )}
                                      onChange={handleEditCheckboxChange}
                                      className="form-check-input"
                                    />
                                  </div>

                                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                    <label className="mb-0 fw-medium">
                                      ICO Management
                                    </label>
                                    <input
                                      type="checkbox"
                                      value="ICO_MANAGEMENT"
                                      checked={formEditData.permissions.includes(
                                        "ICO_MANAGEMENT"
                                      )}
                                      onChange={handleEditCheckboxChange}
                                      className="form-check-input"
                                    />
                                  </div>
                                </div>

                                <div className="col-lg-6 col-md-12">
                                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                    <label className="mb-0 fw-medium">
                                      Exclude Users
                                    </label>
                                    <input
                                      type="checkbox"
                                      value="EXCLUDE_USERS"
                                      checked={formEditData.permissions.includes(
                                        "EXCLUDE_USERS"
                                      )}
                                      onChange={handleEditCheckboxChange}
                                      className="form-check-input"
                                    />
                                  </div>

                                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                    <label className="mb-0 fw-medium">
                                      Legal Update
                                    </label>
                                    <input
                                      type="checkbox"
                                      value="LEGAL_UPDATION"
                                      checked={formEditData.permissions.includes(
                                        "LEGAL_UPDATION"
                                      )}
                                      onChange={handleEditCheckboxChange}
                                      className="form-check-input"
                                    />
                                  </div>

                                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                    <label className="mb-0 fw-medium">
                                      Buy History
                                    </label>
                                    <input
                                      type="checkbox"
                                      value="BUY_HISTORY"
                                      checked={formEditData.permissions.includes(
                                        "BUY_HISTORY"
                                      )}
                                      onChange={handleEditCheckboxChange}
                                      className="form-check-input"
                                    />
                                  </div>

                                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                    <label className="mb-0 fw-medium">
                                      Setting
                                    </label>
                                    <input
                                      type="checkbox"
                                      value="SETTING"
                                      checked={formEditData.permissions.includes(
                                        "SETTING"
                                      )}
                                      onChange={handleEditCheckboxChange}
                                      className="form-check-input"
                                    />
                                  </div>

                                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                    <label className="mb-0 fw-medium">
                                      Bonus History
                                    </label>
                                    <input
                                      type="checkbox"
                                      value="SUPER BONUS"
                                      checked={formEditData.permissions.includes(
                                        "SUPER BONUS"
                                      )}
                                      onChange={handleEditCheckboxChange}
                                      className="form-check-input"
                                    />
                                  </div>

                                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                    <label className="mb-0 fw-medium">
                                      Deleted Accounts
                                    </label>
                                    <input
                                      type="checkbox"
                                      value="DELETE ACCOUNTS"
                                      checked={formEditData.permissions.includes(
                                        "DELETE ACCOUNTS"
                                      )}
                                      onChange={handleEditCheckboxChange}
                                      className="form-check-input"
                                    />
                                  </div>

                                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                    <label className="mb-0 fw-medium">
                                      Business Analytics
                                    </label>
                                    <input
                                      type="checkbox"
                                      value="GET_BUSINESS_ANALYTICS"
                                      checked={formEditData.permissions.includes(
                                        "GET_BUSINESS_ANALYTICS"
                                      )}
                                      onChange={handleEditCheckboxChange}
                                      className="form-check-input"
                                    />
                                  </div>

                                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                    <label className="mb-0 fw-medium">
                                      Business Report
                                    </label>
                                    <input
                                      type="checkbox"
                                      value="BUSINESS REPORT"
                                      checked={formEditData.permissions.includes(
                                        "BUSINESS REPORT"
                                      )}
                                      onChange={handleEditCheckboxChange}
                                      className="form-check-input"
                                    />
                                  </div>

                                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded">
                                    <label className="mb-0 fw-medium">
                                      Share Holders
                                    </label>
                                    <input
                                      type="checkbox"
                                      value="SHARE_HOLDERS"
                                      checked={formEditData.permissions.includes(
                                        "SHARE_HOLDERS"
                                      )}
                                      onChange={handleEditCheckboxChange}
                                      className="form-check-input"
                                    />
                                  </div>
                                </div>
                              </div>
                            </fieldset>
                          </div>
                          {errorsT.permissions && (
                            <div className="error_cls">
                              {errorsT.permissions}
                            </div>
                          )}
                        </div>

                        <div className="text-center my-4">
                          <button
                            id="closeModalEdit"
                            type="button"
                            className="btn_cancel my-4"
                            data-bs-dismiss="modal"
                            style={{ marginRight: "5%" }}
                            onClick={handleEditCancel}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="userButton"
                            onClick={(e) => handleUserSubmit(e, formEditData)}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                      {isUserLoading && <Skeleton count={5} />}
                    </div>
                  )}
                  {isUserLoading && <Skeleton count={5} />}
                </div>
              </div>
            </div>
          </div>

          {/* Edit User Code Ends */}
        </section>
      </DashboardLayout>

      {/* // <!-- Modal --> */}
    </>
  );
};

export default AdminManagement;
