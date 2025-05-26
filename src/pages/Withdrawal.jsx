import React, { useState, useEffect } from "react";
import DashboardLayout from "../Layout/DashboardLayout";
import { Icon } from "@iconify/react/dist/iconify.js";
import Pagination from "../components/Pagination";
import { Link } from "react-router-dom";
import Modals from "../components/Modals";
import Skeleton from "react-loading-skeleton";
import {
  useWithdrawApprovalMutation,
  useGetWithdrawListQuery,
} from "../features/withdrawal/withdrawalApiSlice";
import { toast } from "react-toastify";

const Withdrawal = () => {
  const [selectedWithdrawId, setSelectedWithdrawId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [allRequests, setAllRequests] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("Select Status");
  //pagination
  const [state, setState] = useState({
    currentPage: 1,
    perPage: 10,
    search: "",
    selectedUserId: null,
  });

  const queryParams = `limit=${state?.perPage || ""}&page=${
    state?.currentPage || ""
  }&search=${state?.search || ""}&status=${
    selectedStatus === "Select Status" ? "" : selectedStatus
  }`;
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModal3, setDeleteModal3] = useState(false);

  // const [check, setCheck] = useState(false);
  const [check2, setCheck2] = useState(false);

  const handleDelete = (withdrawId) => {
    setSelectedWithdrawId(withdrawId);
    setDeleteModal(true);
  };

  const handleCheck = (withdrawId) => {
    setSelectedWithdrawId(withdrawId);
    setCheck2(true);
  };
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setState({ ...state, currentPage: 1 });
  };
  const {
    data: getWithdrawList,
    isLoading,
    refetch,
  } = useGetWithdrawListQuery(queryParams);

  const [withdrawApprovalAmount, isloading] = useWithdrawApprovalMutation();
  const TableData = getWithdrawList?.data?.withdrawRequests || [];

  useEffect(() => {
    if (getWithdrawList?.data?.withdrawRequests) {
      setAllRequests(getWithdrawList.data.withdrawRequests);
    }
  }, [getWithdrawList]);

  const totalPending = allRequests?.filter(
    (request) => request.status === 0
  ).length;
  const totalApproved = allRequests?.filter(
    (request) => request.status === 1
  ).length;
  const totalRejected = allRequests?.filter(
    (request) => request.status === 2
  ).length;
  // const totalRejected = TableData?.data?.pagination?.is_approved.filter(
  //   (request)=> request.is_approved === 2
  // ).length;

  // const totalRejected = TableData?.pagination?.is_approved || 0;

  // console.log("??????????", TableData?.pagination);

  // Handle PerChange    const activeMembers = getUser?.data?.pagination?.active || 0;

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

  const handleApprove = async () => {
    try {
      const payload = {
        isApproved: 1,
        withraw_id: [selectedWithdrawId],
      };
      await withdrawApprovalAmount(payload).unwrap();
      toast.success("Withdrawal approved successfully", {
        position: "top-center",
      });
      setCheck2(false);
      setRefresh(true);
    } catch (error) {
      toast.error(`${error?.data?.isApproved?.message}`, {
        position: "top-center",
      });
      console.error("Failed to approve withdrawal:", error);
    }
  };

  const handleReject = async (reason, setReason) => {
    try {
      const payload = {
        isApproved: 0,
        withraw_id: [selectedWithdrawId],
        reason: reason,
      };

      await withdrawApprovalAmount(payload).unwrap();
      toast.success("Withdrawal rejected successfully", {
        position: "top-center",
      });
      setDeleteModal(false);
      setRefresh(true);
      setReason("");
    } catch (error) {
      toast.error("Failed to reject withdrawal", {
        position: "top-center",
      });
      console.error("Failed to reject withdrawal:", error);
    }
  };
  const withdrawalData = [
    {
      images: "pending.png",
      heading: totalPending, // total pending
      mainHeading: "Pending",
    },
    {
      images: "approve.png",
      heading: totalApproved, // total approved
      mainHeading: "Approved",
    },
    {
      images: "approve.png",
      heading: totalRejected, // total Rejected
      mainHeading: "Rejected",
    },
  ];
  useEffect(() => {
    refetch();
    if (refresh) {
      refetch();
      setRefresh(false);
    }
  }, [refresh, refetch]);
  /**
   * This method is used to convert the iso string to date & time format
   * @param {*} isoString
   */
  const formatDateWithAmPm = (isoString) => {
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
  return (
    <DashboardLayout>
      <section className="profile_section py-4">
        <div className="container-fluid">
          <div className="row">
            {withdrawalData.map((data, i) => (
              <div
                className="col-12 col-sm-6 col-md-6 col-xl-5 col-xxl-3"
                key={i}
              >
                <div className="my_total_team_data mb-4 rounded-3 px-3 py-3 py-md-4">
                  <div className="total_user_card d-flex align-items-center gap-2 gap-md-3">
                    <div className="total_user_images rounded-3 p-2 p-md-4">
                      <img
                        src={`/images/${data.images}`}
                        alt="total-member"
                        className="img-fluid"
                      />
                    </div>
                    <div className="total_user_card_data">
                      <h2>{data.heading}</h2>
                      <h5>{data.mainHeading}</h5>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="col-12">
              <div className="my_total_team_data rounded-3 px-3 py-4">
                <h1 className="mb-3">Withdrawal Bonus</h1>
                <div className="row justify-content-between">
                  <div className="col-12 col-sm-6 col-md-2 col-xxl-1 ">
                    <div className="pagination__box mb-4 ">
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
                  <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                    {/* <div className="select_level_data mb-4">
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
                          className="form-control border-0 shadow-none rounded-0 bg-transparent"
                          placeholder="Search"
                          aria-label="Username"
                          aria-describedby="basic-addon1"
                          onChange={handleSearch}
                        />
                      </div>
                    </div> */}
                    <div className="d-flex gap-3">
                      <select
                        className="form-select my-auto mt-0"
                        aria-label="Default select status"
                        value={selectedStatus}
                        onChange={handleStatusChange}
                      >
                        <option value="Select Status">Select Status</option>
                        <option value="Approved">Approved</option>
                        <option value="Pending">Pending</option>
                        <option value="Rejected">Rejected</option>
                      </select>
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
                              style={{ color: "var(--black)" }}
                            />
                          </span>
                          <input
                            type="text"
                            autoComplete="off"
                            className="form-control border-0 shadow-none rounded-0 bg-transparent"
                            placeholder="Search"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            onChange={handleSearch}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="table_data table-responsive">
                  <table className="table mb-0 align-middle">
                    <thead>
                      <tr>
                        <th scope="col">S.No</th>
                        <th scope="col">Customer Name</th>
                        <th scope="col">Transaction Id</th>
                        <th scope="col">Customer Id</th>
                        <th scope="col">Currency Type</th>
                        <th scope="col">Withdrawal Amount</th>
                        <th scope="col">Admin Charges</th>
                        <th scope="col">Final Amount</th>
                        <th scope="col">Date and Time</th>
                        <th scope="col">Status</th>
                        <th scope="col">Bank Details</th>
                        <th scope="col">Note</th>
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
                          <tr key={i} className="text-center">
                            <td>
                              {state?.currentPage * state?.perPage -
                                (state?.perPage - 1) +
                                i}
                              .
                            </td>
                            <td>{data?.userId?.name}</td>
                            <td> {data?._id}</td>
                            <td>{data?.userId?.username}</td>
                            <td>{data.currency}</td>
                            {/* <td>{data.amount}</td> */}
                            <td>
                              {data.currency === "INR"
                                ? `₹${data.amount.toFixed(2)}`
                                : `$${data.amount.toFixed(2)}`}
                            </td>
                            {/* <td>{data.admin_inr_charges}</td> */}
                            <td>
                              {data.currency === "INR"
                                ? `₹${data.admin_inr_charges.toFixed(2)}`
                                : `$${data.admin_inr_charges.toFixed(2)}`}
                            </td>
                            <td>
                              {data.currency === "INR"
                                ? `₹ ${(
                                    data.amount - data.admin_inr_charges || 0
                                  ).toFixed(2)}`
                                : `$ ${(
                                    data.amount - data.admin_inr_charges || 0
                                  ).toFixed(2)}`}
                            </td>
                            <td>{formatDateWithAmPm(data?.created_at)}</td>

                            <td
                              style={{
                                color:
                                  data.status == "1"
                                    ? "green"
                                    : data.status == "2"
                                    ? "#ef233c"
                                    : data.status == "0"
                                    ? "goldenrod"
                                    : "black",
                              }}
                            >
                              {data.status == "1"
                                ? "Approved"
                                : data.status == "2"
                                ? "Rejected"
                                : data.status == "0"
                                ? "Pending"
                                : "Failed"}
                            </td>

                            <td>
                              <textarea
                                cols={30}
                                rows={3}
                                name=""
                                disabled
                                value={`Bank Name: ${
                                  data.bankDetails?.bank_name || "N/A"
                                }\nAccount No: ${
                                  data.bankDetails?.bank_account || "N/A"
                                }\nIFSC Code: ${
                                  data.bankDetails?.ifsc_code || "N/A"
                                }`}
                              ></textarea>
                            </td>

                            <td>
                              <textarea
                                cols={30}
                                rows={3}
                                name=""
                                disabled
                                value={data.note}
                              ></textarea>
                            </td>

                            {data?.status == "0" && (
                              <td>
                                <span>
                                  <button
                                    className="bg-transparent border-0"
                                    title="Approve"
                                    onClick={() => handleCheck(data?._id)}
                                  >
                                    <Icon
                                      icon="mdi:check"
                                      width="20"
                                      height="20"
                                      style={{ color: "var(--green)" }}
                                    />
                                  </button>
                                  <button
                                    className="bg-transparent border-0"
                                    title="Reject"
                                    onClick={() => handleDelete(data?._id)}
                                  >
                                    <Icon
                                      icon="charm:cross"
                                      width="26"
                                      height="26"
                                      style={{ color: "var(--red)" }}
                                    />
                                  </button>
                                </span>
                              </td>
                            )}
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
                      getWithdrawList?.data?.pagination?.total / state?.perPage
                    ) || 1
                  }
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>
        </div>
      </section>
      <Modals
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        setDeleteModal3={setDeleteModal3}
        check2={check2}
        setCheck2={setCheck2}
        handleApprove={handleApprove}
        handleReject={handleReject}
      />
    </DashboardLayout>
  );
};

export default Withdrawal;
