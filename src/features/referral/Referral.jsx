import React, { useState, useEffect } from "react";
import DashboardLayout from "../../Layout/DashboardLayout";

import { Icon } from "@iconify/react/dist/iconify.js";
import Pagination from "../../components/Pagination";
import { useGetRefQuery } from "./referralApiSlice";
import Skeleton from "react-loading-skeleton";
const Referral = () => {
  //pagination
  const [state, setState] = useState({
    currentPage: 1,
    perPage: 10,
    search: "",
  });

  const queryParams = `limit=${state?.perPage || ""}&page=${
    state?.currentPage || ""
  }&search=${state?.search || ""}`;

  const { data: getRef, isLoading, refetch } = useGetRefQuery(queryParams);
  const TableData = getRef?.data?.withdrawRequests || [];

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

  return (
    <DashboardLayout>
      <section className="profile_section py-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="my_total_team_data rounded-3 px-3 pb-0 py-4">
                <h1 className="mb-3">Referral </h1>
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
                        <th scope="col">Name</th>
                        <th scope="col">Referral ID</th>
                        <th scope="col">No of Referral</th>
                        <th scope="col">No of Sub Referral</th>
                        <th scope="col">Total Referral Bonus</th>
                        <th scope="col">Total Super Bonus</th>
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
                            <td>{data.name || "N/A"}</td>
                            <td> {data.username || "N/A"}</td>
                            {/* <td>{data.referenceCount || 0}</td> */}

                            <td>{data.referenceCount || 0}</td>
                            <td>{data.totalChainReferrals || 0}</td>
                            <td>
                              {data.countryCode === 91
                                ? `₹${data.referenceInr.toFixed(2)}`
                                : `$${data.referenceInr.toFixed(2)}`}
                            </td>
                            <td>
                              {data.countryCode === 91
                                ? `₹${data.super_bonus.toFixed(2)}`
                                : `$${data.super_bonus.toFixed(2)}`}
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
                      getRef?.data?.pagination?.total / state?.perPage
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

export default Referral;
