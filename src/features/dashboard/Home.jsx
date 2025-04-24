import React, { useState, useEffect } from "react";
import DashboardLayout from "../../Layout/DashboardLayout";
import Pagination from "../../components/Pagination";

import { Icon } from "@iconify/react/dist/iconify.js";
import { toast } from "react-toastify";
import { useGetDetailsQuery } from "./dashboardApiSlice";
const Home = () => {
  const [copy, setCopied] = useState("");

  // for copy text
  const copyToClipboard = () => {
    var text = document.getElementById("copyLink").value;
    var elem = document.createElement("textarea");
    document.body.appendChild(elem);
    elem.value = text;
    elem.select();
    elem.setSelectionRange(0, 99999); // Updated selection range
    document.execCommand("copy");
    document.body.removeChild(elem);

    // Select the copied text in the input field
    document.getElementById("copyLink").select();

    setCopied("copied");
    toast.success("Referral Link copied Successfully", {
      position: "top-center",
    });

    setTimeout(() => {
      setCopied("copy");
      document.getSelection().removeAllRanges(); // Deselect the text
    }, 2000);
  };

  const userDataString = localStorage.getItem("userData");
  const userData = JSON.parse(userDataString);

  const { data: getDetails, refetch } = useGetDetailsQuery();

  // console.log("????????", getDetails);
  let username = localStorage.getItem("username");
  // console.log({username})

  const cionData = [
    {
      images: "total-tokens-sale.png",
      mainCion: "total_tokens",
      cionHeading: "Total Tokens Sold",
      Heading: `${Number(getDetails?.data?.total_token_sale)?.toFixed(3) || 0}`,
    },
    {
      images: "raised.png",
      mainCion: "raised",
      cionHeading: "Total Amount Raised",
      Heading: `${getDetails?.data?.total_Raised?.INR?.toFixed(
        2
      )} INR ${getDetails?.data?.total_Raised?.USDT?.toFixed(2)} USD`,
    },
    {
      images: "token-price.png",
      mainCion: "token_price ",
      cionHeading: "Current Token Price",
      Heading: `${getDetails?.data?.current_token_price?.INR?.toFixed(
        5
      )} INR  ${getDetails?.data?.current_token_price?.USDT?.toFixed(5)} USD`,
    },
    {
      images: "total-user.png",
      mainCion: "total_user",
      cionHeading: "Total Users",
      Heading: getDetails?.data?.usersCount || 0,
    },
    {
      images: "withdrawal.png",
      mainCion: "withdrawal",
      cionHeading: "Withdrawal Amount Released",
      Heading: `${
        getDetails?.data?.withdraw_amount?.INR?.toFixed(2) || 0.0
      } INR  ${getDetails?.data?.withdraw_amount?.USDT?.toFixed(2) || 0.0} USD`,
    },
    // {
    //   images: "token-sold.png",
    //   mainCion: "token_sold",
    //   cionHeading: "Particular Token Sold",
    //   Heading: "$0.00",
    // },
    {
      images: "referral-amount.png",
      mainCion: "referral_amount",
      cionHeading: "Total Referral Earnings",
      // Heading: `${Number(getDetails?.data?.total_referral)?.toFixed(3) || 0}`,
      Heading: `${
        getDetails?.data?.total_referral?.INR?.toFixed(2) || 0.0
      } INR  ${getDetails?.data?.total_referral?.USDT?.toFixed(2) || 0.0} USD`,
    },
  ];
  // const TableData = [
  //   {
  //     no: "1",
  //     userId: "6541545",
  //     username: "username",
  //     walletaAddress: "52347254sddsds4223",
  //     joiningDate: "10/05/2024",
  //     amount: "$10,000",
  //   },
  //   {
  //     no: "1",
  //     userId: "6541545",
  //     username: "username",
  //     walletaAddress: "52347254sddsds4223",
  //     joiningDate: "10/05/2024",
  //     amount: "$10,000",
  //   },
  //   {
  //     no: "1",
  //     userId: "6541545",
  //     username: "username",
  //     walletaAddress: "52347254sddsds4223",
  //     joiningDate: "10/05/2024",
  //     amount: "$10,000",
  //   },
  //   {
  //     no: "1",
  //     userId: "6541545",
  //     username: "username",
  //     walletaAddress: "52347254sddsds4223",
  //     joiningDate: "10/05/2024",
  //     amount: "$10,000",
  //   },
  //   {
  //     no: "1",
  //     userId: "6541545",
  //     username: "username",
  //     walletaAddress: "52347254sddsds4223",
  //     joiningDate: "10/05/2024",
  //     amount: "$10,000",
  //   },
  // ];
  // const TableTranslations = [
  //   {
  //     no: "1",
  //     userId: "6541545",
  //     username: "username",
  //     walletaAddress: "52347254sddsds4223",
  //     joiningDate: "10/05/2024",
  //     amount: "$10,000",
  //   },
  //   {
  //     no: "1",
  //     userId: "6541545",
  //     username: "username",
  //     walletaAddress: "52347254sddsds4223",
  //     joiningDate: "10/05/2024",
  //     amount: "$10,000",
  //   },
  //   {
  //     no: "1",
  //     userId: "6541545",
  //     username: "username",
  //     walletaAddress: "52347254sddsds4223",
  //     joiningDate: "10/05/2024",
  //     amount: "$10,000",
  //   },
  //   {
  //     no: "1",
  //     userId: "6541545",
  //     username: "username",
  //     walletaAddress: "52347254sddsds4223",
  //     joiningDate: "10/05/2024",
  //     amount: "$10,000",
  //   },
  //   {
  //     no: "1",
  //     userId: "6541545",
  //     username: "username",
  //     walletaAddress: "52347254sddsds4223",
  //     joiningDate: "10/05/2024",
  //     amount: "$10,000",
  //   },
  // ];
  useEffect(() => {
    refetch();
  }, []);
  return (
    <DashboardLayout>
      <section className="main_section py-4 py-md-0">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="welcome_user_data position-relative mb-4 p-2 p-md-4 p-lg-5 rounded-4">
                <div className="row">
                  <div className="col-12 col-md-12 col-xxl-5">
                    <div className="welcome_data position-relative z-2">
                      <div className="user_heading mb-4">
                        {" "}
                        <h1 className="mb-0 text-capitalize">
                          Welcome {userData?.data?.name}{" "}
                        </h1>
                        <h5 className="pb-xxl-2">Its great to see you again</h5>
                      </div>
                      {/* <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Etiam <br className="d-none b-xl-block" /> eu
                          turpis molestie, dictum est a, mattis tellus.{" "}
                        </p> */}
                      <div className="personal_details ">
                        <div className="input-group copy_input">
                          <input
                            type="text"
                            autoComplete="off"
                            className="form-control shadow-none border-0"
                            placeholder={username}
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            disabled
                            id="copyLink"
                            readOnly
                            value={username}
                          />
                          <button
                            className="input-group-text copy_button rounded-0 shadow-none border-0"
                            type="button"
                            onClick={copyToClipboard}
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="user_images text-end ">
                      <img
                        src="/images/main_user.png"
                        alt="main_user"
                        className="img-fluid position-relative z-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="coin_cards">
                <div className="row">
                  {cionData.map((data, i) => (
                    <div
                      className="col-12 col-sm-6 col-lg-4 mb-4 col-xl-2"
                      key={i}
                    >
                      <div
                        className={`coin_cards_data h-100 p-4 p-md-2 p-lg-4 p-xl-3 p-xxl-4 rounded-2 mb-4 text-start ${data.mainCion}`}
                      >
                        <div className="coin_main_images py-1 mb-3">
                          <img
                            src={`/images/main_dashboard/${data.images}`}
                            alt="my_referral"
                            className="img-fluid"
                          />
                        </div>
                        <div className="coin_main_data pb-1">
                          <h6 className="mb-1">{data.cionHeading}</h6>
                          <h5 className="mb-0 text-break">{data.Heading}</h5>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* <div className="col-12 col-xl-6">
                <div className="translations_data rounded-3 px-3 py-4">
                  <div className="row justify-content-between">
                    <div className="col-12 col-sm-6 col-md-6 col-xl-8 col-xxl-7">
                      <h5 className="mb-4 mb-md-0">Latest Transactions </h5>
                    </div>
                    <div className="col-12 col-sm-6 col-md-6 col-xl-4 col-xxl-3">
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
                            className="form-control border-0 shadow-none rounded-0 bg-transparent"
                            placeholder="Search"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
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
                          <th scope="col">User ID</th>
                          <th scope="col">Wallet Address</th>
                          <th scope="col">Username</th>
                          <th scope="col">Joining Date</th>
                          <th scope="col">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {TableData.map((data, i) => (
                          <tr key={i}>
                            <td> {data.no}</td>
                            <td> {data.userId}</td>
                            <td>{data.walletaAddress}</td>
                            <td>{data.username}</td>
                            <td>{data.joiningDate}</td>
                            <td>{data.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <Pagination />
              </div> */}
            {/* <div className="col-12 col-xl-6">
                <div className="translations_data rounded-3 px-3 py-4">
                  <div className="row justify-content-between">
                    <div className="col-12 col-sm-6 col-md-6 col-xl-8 col-xxl-7">
                      <h5 className="mb-4 mb-md-0">Latest Transactions </h5>
                    </div>
                    <div className="col-12 col-sm-6 col-md-6 col-xl-4 col-xxl-3">
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
                            className="form-control border-0 shadow-none rounded-0 bg-transparent"
                            placeholder="Search"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
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
                          <th scope="col">User ID</th>
                          <th scope="col">Wallet Address</th>
                          <th scope="col">Username</th>
                          <th scope="col">Joining Date</th>
                          <th scope="col">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {TableTranslations.map((data, i) => (
                          <tr key={i}>
                            <td> {data.no}</td>
                            <td> {data.userId}</td>
                            <td>{data.walletaAddress}</td>
                            <td>{data.username}</td>
                            <td>{data.joiningDate}</td>
                            <td>{data.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <Pagination />
              </div> */}
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default Home;
