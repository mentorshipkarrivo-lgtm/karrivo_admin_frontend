import React, { useState, useEffect } from "react";
import DashboardLayout from "../../Layout/DashboardLayout";

import { Icon } from "@iconify/react/dist/iconify.js";
import Pagination from "../../components/Pagination";
import Skeleton from "react-loading-skeleton";
import { useBuyHistoryQuery } from "./buyHistoryApiSlice";

const BuyHistory = () => {
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

  const {
    data: buyHistory,
    isLoading,
    refetch,
  } = useBuyHistoryQuery(queryParams);
  // console.log("??????", buyHistory?.data?.withdrawRequests );
  // ?.data?.withdrawRequests

  const TableData = buyHistory?.data?.withdrawRequests || [];
  const totalCoins = buyHistory?.data?.totalPurchasedCoins || [];

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
  return (
    <DashboardLayout>
      <section className="profile_section py-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="my_total_team_data rounded-3 px-3 pb-0 py-4">
                <h1 className="mb-3">Buy History</h1>
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
                  <div className="col-12 col-sm-6 col-md-6 col-xl-5 col-xxl-4">
                    <div className="my_total_team_data mb-4 rounded-3">
                      <div className="total_user_card d-flex align-items-center gap-2 gap-md-3">
                        <div className="total_user_card_data justify-content-between ms-2 px-1 py-1 py-md-2">
                          <h5>
                            Total coins sold:{" "}
                            <b>{Number(totalCoins).toFixed(3)}</b>
                          </h5>
                        </div>
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
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Purchased Date</th>
                        <th scope="col">Round</th>
                        <th scope="col">Paid Currency</th>
                        <th scope="col">Jaimax Coins</th>
                        <th scope="col">AtPrice</th>
                        <th scope="col">Paid</th>
                        <th scope="col">Status</th>
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
                            <td>{data?.userId?.name}</td>
                            <td>{data?.userId?.email}</td>
                            <td>{formatDateWithAmPm(data.createdAt)}</td>
                            <td>{data.round}</td>
                            <td> {data.currency}</td>

                            <td>{Number(data.jaimax).toFixed(3)}</td>
                            {/* <td>{data.atPriceInr}</td> */}
                            {/* <td>
                              {data.currency === "INR"
                                ? `${data.atPriceInr.toFixed(5)}`
                                : `${data.atPriceUsdt.toFixed(5)}`}
                            </td> */}
                            <td>
                              {data.currency === "INR"
                                ? `₹${data.atPriceInr.toFixed(5)}`
                                : `$${data.atPriceUsdt.toFixed(5)}`}
                            </td>
                            <td>
                              {data.currency === "INR"
                                ? `₹${data.amount.toFixed(2)}`
                                : `$${data.amount.toFixed(2)}`}
                            </td>

                            {/* <td>
                              {(
                                Number(data.amount || 0) ).toFixed(2)}
                            </td> */}
                            <td
                              className="text-capitalize"
                              style={{
                                color:
                                  data?.status.toLowerCase() == "pending"
                                    ? "#daa520"
                                    : data?.status == "Completed"
                                    ? "green"
                                    : "red",
                              }}
                            >
                              {data?.status}
                            </td>
                            {/* <td>{Number(data.referenceIdShare).toFixed(3)} INR</td> */}
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
                      buyHistory?.data?.pagination?.total / state?.perPage
                    ) || 1
                  }
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default BuyHistory;
