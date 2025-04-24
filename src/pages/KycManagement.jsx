import React, { useState, useEffect } from "react";
import DashboardLayout from "../Layout/DashboardLayout";
import { Icon } from "@iconify/react/dist/iconify.js";
import Pagination from "../components/Pagination";
import { Link } from "react-router-dom";
import Modals from "../components/Modals";
import { useKycListQuery } from "../features/kyc/kycApiSlice";
import { ClipLoader } from "react-spinners";

const KycApprove = () => {
  const [show, setShow] = useState(false);
  const [deleteModal1, setDeleteModal1] = useState(false);
  const [check, setCheck] = useState(false);
  const [id, setId] = useState("");

  const handleDelete = (id) => {
    setDeleteModal1(true);
    setId(id);
  };

  const handleCheck = (id) => {
    setCheck(true);
    setId(id);
  };

  const [state, setState] = useState({
    currentPage: 1,
    perPage: 10,
    search: "",
  });

  const queryParams = `limit=${state?.perPage || ""}&page=${
    state?.currentPage || ""
  }&search=${state?.search || ""}`;

  // Handle PerChange
  const handlePageChange = (e) => {
    setState({ ...state, currentPage: e });
  };

  const { data, isLoading, error, refetch } = useKycListQuery(queryParams);
  const tableData = data;

  const handleShow = (data) => {
    setId(data);
    setShow(true);
  };

  useEffect(() => {
    refetch();
  }, []);

  return (
    <DashboardLayout>
      <section className="profile_section py-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="my_total_team_data rounded-3 px-3 pb-0 py-4">
                <h1 className="mb-3">KYC Management</h1>
                <div className="row justify-content-between">
                  <div className="col-12 col-sm-6 col-md-3 col-xxl-1">
                    <div className="pagination__box mb-4 ">
                      <div className=" showing_data">
                        <select
                          className="form-select shadow-none"
                          aria-label="Default select example"
                          onClick={(e) =>
                            setState({ ...state, perPage: e.target.value })
                          }
                        >
                          <option value="10">10</option>
                          <option value="30">30</option>
                          <option value="50">50</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  {/* <div className="col-sm-6 col-md-4 col-xxl-3">
                    <div className="pagination__box mb-4 ">
                      <div className=" showing_data">
                        <select
                          className="form-select shadow-none"
                          aria-label="Default select example"
                        >
                          <option selected>Selected By Status</option>
                          <option value="10">Approved</option>
                          <option value="30">Rejected</option>
                          <option value="50">Open</option>
                        </select>
                      </div>
                    </div>
                  </div> */}

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
                          placeholder="Search"
                          aria-label="Username"
                          aria-describedby="basic-addon1"
                          onChange={(e) =>
                            setState({ ...state, search: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="table_data table-responsive">
                  {isLoading ? (
                    <div className="text-center">
                      <ClipLoader
                        size={50}
                        color={"#123abc"}
                        loading={isLoading}
                      />
                    </div>
                  ) : (
                    <table className="table mb-0">
                      <thead>
                        <tr>
                          <th scope="col">S.No</th>
                          <th scope="col">User ID</th>
                          <th scope="col">Name</th>
                          <th scope="col">Bank Name</th>
                          <th scope="col">Bank Account</th>
                          <th scope="col">Address</th>
                          <th scope="col">IFSC code</th>
                          <th scope="col">Mobile Number</th>
                          <th scope="col">Status</th>
                          <th scope="col">UPI Id</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData?.data?.kycs?.length > 0 ? (
                          tableData.data.kycs.map((data, i) => (
                            <tr key={i}>
                              <td>
                                {state.currentPage * state.perPage -
                                  (state.perPage - 1) +
                                  i}
                                .
                              </td>
                              <td>{data?.user_id?.username}</td>
                              <td>{data.name}</td>
                              <td>{data.bank_name}</td>
                              <td>{data.bank_account}</td>
                              <td>{data.address}</td>
                              <td>{data.ifsc_code}</td>
                              <td>{data.mobile_number}</td>
                              <td
                                className={`text-capitalize  ${
                                  data.status === "approve"
                                    ? "statusGree"
                                    : data.status === "reject"
                                    ? "statusRed"
                                    : "statusWarring"
                                }`}
                              >
                                {data.status === "open"
                                  ? "In Open"
                                  : data.status === "approve"
                                  ? "Approved"
                                  : data.status === "inprogress"
                                  ? "In Progress"
                                  : data.status === "reject"
                                  ? "Rejected"
                                  : "N/A"}
                              </td>

                              {/* <td>{data.status}</td> */}

                              <td>{data.upi_id}</td>

                              {data.status === "open" ? (
                                <td>
                                  <div className="d-flex gap-2">
                                    <button
                                      className="bg-transparent border-0 me-2"
                                      onClick={() => handleShow(data)}
                                      title="View KYC"
                                    >
                                      <Icon
                                        icon="raphael:view"
                                        width="24"
                                        height="24"
                                        style={{ color: "white" }}
                                      />
                                    </button>

                                    <button
                                      className="bg-transparent border-0"
                                      onClick={() => handleCheck(data._id)}
                                      title="Approve"
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
                                      onClick={() => handleDelete(data._id)}
                                      title="Reject"
                                    >
                                      <Icon
                                        icon="charm:cross"
                                        width="26"
                                        height="26"
                                        style={{ color: "var(--red)" }}
                                      />
                                    </button>
                                  </div>
                                </td>
                              ) : (
                                <td>
                                  <span>
                                    <button
                                      className="bg-transparent border-0"
                                      onClick={() => handleShow(data)}
                                      title="View KYC"
                                    >
                                      <Icon
                                        icon="raphael:view"
                                        width="24"
                                        height="24"
                                        style={{ color: "white" }}
                                      />
                                    </button>
                                  </span>
                                </td>
                              )}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="11" className="text-center">
                              No records found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
              <Pagination
                currentPage={state.currentPage}
                totalPages={
                  tableData
                    ? Math.ceil(tableData.data.pagination.total / state.perPage)
                    : 1
                }
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </section>
      <Modals
        {...{
          show,
          setShow,
          deleteModal1,
          setDeleteModal1,
          check,
          setCheck,
          id,
        }}
      />
    </DashboardLayout>
  );
};

export default KycApprove;
