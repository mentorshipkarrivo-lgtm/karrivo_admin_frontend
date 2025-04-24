import React, { useState, useEffect } from "react";
import DashboardLayout from "../../Layout/DashboardLayout";
import { Icon } from "@iconify/react/dist/iconify.js";
import Pagination from "../../components/Pagination";
import Skeleton from "react-loading-skeleton";
import {
  useGetRoundQuery,
  useUpdateRoundMutation,
  useGetExchangeQuery,
} from "./icoApiSlice";
import { toast } from "react-toastify";
import axios from "axios";

const IcoManagement = () => {
  const [currentEditData, setCurrentEditData] = useState(null);
  const [errors, setErrors] = useState({});
  const [refresh, setRefresh] = useState(false);
  //pagination
  const [state, setState] = useState({
    currentPage: 1,
    perPage: 10,
    search: "",
    selectedUserId: null,
  });

  const queryParams = `limit=${state?.perPage || ""}&page=${
    state?.currentPage || ""
  }&search=${state?.search || ""}`;

  const { data: getRound, isLoading, refetch } = useGetRoundQuery(queryParams);

  const TableData = getRound?.data?.rounds || [];
  const [updateRound] = useUpdateRoundMutation();

  const { data: getExchange } = useGetExchangeQuery(queryParams);

  const TableData1 = getExchange?.data || [];

  // const [exchange] = useGetExchangeQuery();
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

  //////////// Validation for update ICO Rounds
  const validate = () => {
    let formErrors = {};

    // Round validation
    if (!currentEditData.round) {
      formErrors.round = "Round is required";
    } else if (isNaN(currentEditData.round)) {
      formErrors.round = "Round must be a number";
    } else if (currentEditData.round < 0) {
      formErrors.round = "Round cannot be less than 0";
    }

    // Price validation
    if (!currentEditData.atPriceUsdt) {
      formErrors.atPriceUsdt = "Price is required";
    } else if (isNaN(currentEditData.atPriceUsdt)) {
      formErrors.atPriceUsdt = "Price must be a number";
    } else if (currentEditData.atPriceUsdt < 0) {
      formErrors.atPriceUsdt = "Price cannot be less than 0";
    }

    //Inr validation
    if (!currentEditData.atPriceInr) {
      formErrors.atPriceInr = "Price is required";
    } else if (isNaN(currentEditData.atPriceInr)) {
      formErrors.atPriceUsdt = "Price must be a number";
    } else if (currentEditData.atPriceInr < 0) {
      formErrors.atPriceInr = "Price cannot be less than 0";
    }

    // Total Quantity validation
    if (!currentEditData.totalQty) {
      formErrors.totalQty = "Total Quantity is required";
    } else if (isNaN(currentEditData.totalQty)) {
      formErrors.totalQty = "Total Quantity must be a number";
    } else if (currentEditData.totalQty < 0) {
      formErrors.totalQty = "Total Quantity cannot be less than 0";
    }

    // Remaining Quantity validation
    if (!currentEditData.remaingQty) {
      formErrors.remaingQty = "Remaining Quantity is required";
    } else if (isNaN(currentEditData.remaingQty)) {
      formErrors.remaingQty = "Remaining Quantity must be a number";
    } else if (currentEditData.remaingQty < 0) {
      formErrors.remaingQty = "Remaining Quantity cannot be less than 0";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const openModal = (data) => {
    setCurrentEditData(data);
    const modal = new window.bootstrap.Modal(
      document.getElementById("editModal")
    );
    modal.show();
  };
  const handleEditChange = (e) => {
    console.log(e.target);
    const { name, value } = e.target;
    setCurrentEditData({ ...currentEditData, [name]: value });
  };
  // handleEditChangeINR
  const [inputValue, setInputValue] = useState("");
  const handleKeyUp = async (event) => {
    const fieldName = event.target.name;
    try {
      // let currency = await axios.get(`https://api.solarpath.io/v1/6f8b013c0a3f3aaa455229a9fd96793a/price2forex/usdinr`);
      // console.log(currency.data.result.price);
      if (fieldName == "atPriceUsdt") {
        // const inrValue = event.target.value * currency.data.result.price;
        const inrValue = event.target.value * TableData1;
        setCurrentEditData({
          ...currentEditData,
          ["atPriceInr"]: inrValue?.toFixed(5),
        });
      } else {
        // const usdValue = event.target.value / currency.data.result.price;
        const usdValue = event.target.value / TableData1;
        setCurrentEditData({
          ...currentEditData,
          ["atPriceUsdt"]: usdValue?.toFixed(5),
        });
      }
    } catch (error) {
      console.error("Error converting USD to INR:", error);
    }
  };

  const handleUpdateRound = async () => {
    if (!validate()) {
      return;
    }

    try {
      await updateRound(currentEditData).unwrap();
      // const modal = window.bootstrap.Modal.getInstance(
      //   document.getElementById("editModal")
      // );
      // modal.hide();
      toast.success("Round Updated Successfully", {
        position: "top-center",
      });
      setRefresh(true);
      document.getElementById("closeModal").click();
    } catch (error) {
      // console.log("error", error);
      toast.error(`${error?.data?.message}`, {
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    refetch();
    if (refresh) {
      refetch();
      setRefresh(false);
    }
  }, [refresh, refetch]);

  useEffect(() => {
    return () => {
      clearTimeout(searchTimeout);
    };
  }, []);

  return (
    <DashboardLayout>
      <section className="profile_section py-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="my_total_team_data rounded-3 px-3 pb-0 py-4">
                <h1 className="mb-3">ICO Management</h1>
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
                        <th scope="col">Round</th>
                        <th scope="col">Price(USD)</th>
                        <th scope="col">Price(INR)</th>
                        <th scope="col">Total Tokens</th>
                        <th scope="col">Sold Tokens</th>
                        {/* <th scope="col">Bonus Tokens</th>
                        <th scope="col">Issued Tokens</th>*/}
                        <th scope="col">Remaining Tokens</th>

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
                              {/* <td>
                                <Skeleton />
                              </td>
                              <td>
                                <Skeleton />
                              </td>*/}
                              <td>
                                <Skeleton />
                              </td>
                            </tr>
                          ))}
                        </>
                      ) : TableData.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center">
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
                            <td>{data.round}</td>
                            {/* <td>{data.atPriceUsdt?.toFixed(2)}</td> */}
                            <td>{data.atPriceUsdt?.toFixed(5)}</td>
                            <td>{data.atPriceInr?.toFixed(2)}</td>

                            <td>{data?.totalQty}</td>
                            <td>{data?.soldQty.toFixed(3)}</td>
                            {/* <td>
                              {(
                                (Number(data.soldQty) || 0) -
                                (Number(data.jaimaxCoins) || 0)
                              ).toFixed(3)}
                            </td> */}
                            {/* <td>{data.jaimaxCoins?.toFixed(3)}</td>
                            <td>
                              {(
                                (Number(data.jaimaxCoins) || 0) +
                                ((Number(data.soldQty) || 0) -
                                  (Number(data.jaimaxCoins) || 0))
                              ).toFixed(3)}
                            </td>*/}
                            <td>{data.remaingQty?.toFixed(3)}</td>
                            <td>
                              <span
                                style={{ cursor: "pointer" }}
                                data-bs-toggle="modal"
                                data-bs-target="#editModal"
                                onClick={() => openModal(data)}
                              >
                                <img
                                  src="/images/icons/edit.svg"
                                  alt="icon"
                                  title="Edit Round"
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
                      getRound?.data?.pagination?.total / state?.perPage
                    ) || 1
                  }
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <div
        className="modal fade common__modal"
        id="editModal"
        tabIndex="-1"
        aria-labelledby="editModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0 pb-0">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeModal"
              ></button>
            </div>
            <div className="modal-body pt-0 px-4">
              <h1 className="modal-title mb-4" id="editModalLabel">
                Edit Round
              </h1>

              {currentEditData && (
                <form className="row">
                  <div className="col-md-6 mb-3">
                    <div className="form__box">
                      <label htmlFor="">Round</label>
                      <input
                        type="text"
                        autoComplete="off"
                        className="form-control shadow-none"
                        name="round"
                        value={currentEditData.round}
                        disabled="true"
                        onChange={handleEditChange}
                      />
                    </div>
                    {errors.round && (
                      <div className="error">{errors.round}</div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <div className="form__box">
                      <label htmlFor="">USD Price</label>
                      <input
                        type="text"
                        autoComplete="off"
                        className="form-control shadow-none"
                        name="atPriceUsdt"
                        value={currentEditData.atPriceUsdt}
                        onKeyUp={handleKeyUp}
                        onChange={handleEditChange}
                      />
                    </div>
                    {errors.atPriceUsdt && (
                      <div className="error">{errors.atPriceUsdt}</div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <div className="form__box">
                      <label htmlFor="">INR Price</label>
                      <input
                        type="text"
                        autoComplete="off"
                        className="form-control shadow-none"
                        name="atPriceInr"
                        value={currentEditData.atPriceInr}
                        onKeyUp={handleKeyUp}
                        onChange={handleEditChange}
                      />
                    </div>
                    {errors.atPriceInr && (
                      <div className="error">{errors.atPriceInr}</div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <div className="form__box">
                      <label htmlFor=""> Total Quantity</label>
                      <input
                        type="text"
                        autoComplete="off"
                        className="form-control shadow-none"
                        name="totalQty"
                        disabled="true"
                        value={currentEditData.totalQty}
                        onChange={handleEditChange}
                      />
                    </div>
                    {errors.totalQty && (
                      <div className="error">{errors.totalQty}</div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <div className="form__box">
                      <label htmlFor="">Remaining Quantity</label>
                      <input
                        type="text"
                        autoComplete="off"
                        className="form-control shadow-none"
                        name="remaingQty"
                        disabled="true"
                        value={currentEditData.remaingQty}
                        onChange={handleEditChange}
                      />
                    </div>
                    {errors.remaingQty && (
                      <div className="error">{errors.remaingQty}</div>
                    )}
                  </div>

                  <div className="d-flex gap-3 justify-content-center flex-wrap my-4">
                    <button
                      type="button"
                      className="btn_cancel"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn_orange"
                      onClick={handleUpdateRound}
                    >
                      Save changes
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default IcoManagement;
