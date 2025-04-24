import React, { useState, useEffect } from "react";
import DashboardLayout from "../Layout/DashboardLayout";
import { Icon } from "@iconify/react/dist/iconify.js";
import Pagination from "../components/Pagination";
import { Link } from "react-router-dom";
import Modals from "../components/WalletModal";
import {
  useTransAmountUpdateMutation,
  useTransListQuery,
} from "../features/wallet/walletApiSlice";
import { ClipLoader } from "react-spinners";
import { Button, Modal } from "react-bootstrap";

const WalletApprove = () => {
  const [show, setShow] = useState(false);
  const [deleteModal1, setDeleteModal1] = useState(false);
  const [check, setCheck, check3, setCheck3] = useState(false);
  const [id, setId] = useState("");
  const [status, setStatus] = useState("");
  const [editShow, setEditShow] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const handleClose = () => setEditShow(false);
  const handleEditShow = () => setEditShow(true);
  const [updateTransaction] = useTransAmountUpdateMutation();
  const [selectedStatus, setSelectedStatus] = useState("Transaction Type");
  const handleDelete = (id) => {
    setDeleteModal1(true);
    setId(id);
  };
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setState({ ...state, currentPage: 1 });
  };
  const handleEdit = (data) => {
    // setEditModal1(true);
    handleEditShow();
    setSelectedData(data);
  };

  const handleCheck = (id, status) => {
    setCheck(true);
    setId(id);
    setStatus(status);
  };

  const [state, setState] = useState({
    currentPage: 1,
    perPage: 10,
    search: "",
  });

  const queryParams = `limit=${state?.perPage || ""}&page=${
    state?.currentPage || ""
  }&search=${state?.search || ""}&transactionType=${
    selectedStatus === "Transaction Type" ? "" : selectedStatus
  }`;


  // Handle PerChange
  const handlePageChange = (e) => {
    setState({ ...state, currentPage: e });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const { data, isLoading, error, refetch } = useTransListQuery(queryParams);
  const tableData = data;
  console.log(tableData);
  const handleShow = (data) => {
    setId(data);
    setShow(true);
  };
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
  useEffect(() => {
    refetch();
  }, []);

  const handleUpdate = async () => {
    try {
      const payload = {
        transactionId: selectedData.transactionId,
        transactionAmount: parseFloat(selectedData.transactionAmount),
      };

      await updateTransaction(payload);
      handleClose();
    } catch (error) {
      console.error("Failed to update transaction:", error);
    }
  };

  return (
    <DashboardLayout>
      <section className="profile_section py-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="my_total_team_data rounded-3 px-3 pb-0 py-4">
                <h1 className="mb-3">Wallet Management</h1>
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
                  <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                  <div className="d-flex gap-3">
                      <select
                        className="form-select my-auto mt-0"
                        aria-label="Default Transaction Type"
                        value={selectedStatus}
                        onChange={handleStatusChange}
                      >
                        <option value="Transaction Type">Transaction Type</option>
                        <option value="Credit">Credit</option>
                        <option value="Debit">Debit</option>
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
                          <th scope="col">Name</th>
                          <th scope="col">Payment Method</th>
                          <th scope="col">Transaction Type</th>
                          <th scope="col">Transaction Amount</th>
                          <th scope="col">Transaction ID</th>
                          <th scope="col">Transaction Date</th>
                          <th scope="col">Updated By</th>
                          <th scope="col">Status</th>
                          <th scope="col">Reason</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData?.data?.transactions?.length > 0 ? (
                          tableData.data.transactions.map((data, i) => (
                            <tr key={i}>
                              <td>
                                {state.currentPage * state.perPage -
                                  (state.perPage - 1) +
                                  i}
                                .
                              </td>
                              <td>{data.name}</td>
                              <td>{data.paymentMode}</td>
                              <td>{data.transactionType}</td>
                              {/* <td>{data.transactionAmount}</td> */}

                              <td>
                                {data.userId?.countryCode === 91
                                  ? `₹${data.transactionAmount.toFixed(2)}`
                                  : `$${data.transactionAmount.toFixed(2)}`}
                              </td>
                              {/* {(data.transactionType != 'Debit' && ( <td> <a href={data.screenshotUrl} target="_blank" style={{ textDecoration: 'none' }}>  {data.transactionId}</a></td>)) }
                              {(data.transactionType != 'Credit' && ( <td>{data.transactionId}</td>)) } */}
                              <td>
                                {data.screenshotUrl ? (
                                  <a
                                    href={data.screenshotUrl}
                                    target="_blank"
                                    style={{ textDecoration: "none" }}
                                  >
                                    {data.transactionId}
                                  </a>
                                ) : (
                                  data.transactionId
                                )}
                              </td>
                              <td>
                                {formatDateWithAmPm(data.transactionDate)}
                              </td>

                              <td>{data.updatedBy?.name || "N/A"}</td>
                              <td
                                className={`text-capitalize  ${
                                  data.transactionStatus === "Completed"
                                    ? "statusGree"
                                    : data.transactionStatus === "Pending"
                                    ? "statusWarring"
                                    : "statusRed"
                                }`}
                              >
                                {data.transactionStatus}
                              </td>
                              <td>{data?.reason || "N/A"}</td>
                              {/* <td>{data.status}</td> */}
                              {data.transactionStatus != "Completed" &&
                                data.transactionStatus != "Failed" && (
                                  <td>
                                    <div className="d-flex gap-2">
                                      <button
                                        title="Approve"
                                        className="bg-transparent border-0"
                                        onClick={() =>
                                          handleCheck(
                                            data.transactionId,
                                            "Approve"
                                          )
                                        }
                                      >
                                        <Icon
                                          icon="mdi:check"
                                          width="20"
                                          height="20"
                                          style={{ color: "var(--green)" }}
                                        />
                                      </button>
                                      {data.transactionStatus != "Hold" && (
                                        <button
                                          title="Hold"
                                          className="bg-transparent border-0 me-2"
                                          onClick={() =>
                                            handleCheck(
                                              data.transactionId,
                                              "Hold"
                                            )
                                          }
                                        >
                                          <Icon
                                            icon="mdi:pause"
                                            width="20"
                                            height="20"
                                            style={{ color: "var(--orange)" }}
                                          />
                                        </button>
                                      )}

                                      <button
                                        title="Reject"
                                        className="bg-transparent border-0"
                                        onClick={() =>
                                          handleDelete(data.transactionId)
                                        }
                                      >
                                        <Icon
                                          icon="charm:cross"
                                          width="26"
                                          height="26"
                                          style={{ color: "var(--red)" }}
                                        />
                                      </button>

                                      <button
                                        className="bg-transparent border-0"
                                        onClick={() => handleEdit(data)}
                                      >
                                        <img
                                          src="/images/icons/edit.svg"
                                          alt="edit"
                                          title="edit"
                                        />
                                      </button>
                                    </div>
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
                    ? Math.ceil(tableData.data.total / state.perPage)
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
          status,
        }}
      />
      <Modal
        className="common__modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={editShow}
        onHide={handleClose}
        backdrop="static"
      >
        <Modal.Header className=" border-0" closeButton>
          <Modal.Title>Update Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body className="border-0 ">
          {selectedData ? (
            <form>
              <div className="mb-3 form__box">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  className="form-control shadow-none bg-transparent text-white"
                  id="name"
                  name="name"
                  value={selectedData.name}
                  onChange={handleEditChange}
                  readOnly
                />
              </div>
              <div className="mb-3 form__box">
                <label htmlFor="transactionAmount" className="form-label">
                  Transaction Amount
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  className="form-control shadow-none bg-transparent text-white"
                  id="transactionAmount"
                  name="transactionAmount"
                  value={selectedData.transactionAmount}
                  onChange={handleEditChange}
                />
              </div>
              <div className="mb-3 form__box">
                <label htmlFor="transactionAmountId" className="form-label">
                  Transaction Id
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  className="form-control shadow-none  bg-transparent text-white"
                  id="transactionAmountId"
                  name="transactionId"
                  value={selectedData.transactionId}
                  onChange={handleEditChange}
                  readOnly
                />
              </div>
            </form>
          ) : (
            <p>No data available.</p>
          )}
        </Modal.Body>
        <Modal.Footer className="submit_btn border-0 d-flex justify-content-center gap-3">
          <Button
            variant="secondary"
            className="m-0 no_btns px-5 rounded-1 btn btn-primary"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            className="btns border-0 px-5 btn btn-primary "
            onClick={handleUpdate}
          >
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  );
};

export default WalletApprove;
