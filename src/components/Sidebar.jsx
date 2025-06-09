import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { StateContext } from "../context/StateContext";
import Swal from "sweetalert2";
import logo from "../../public/site_logo.png";

const Sidebar = () => {
  const { sidebarMenu, setSidebarMenu } = useContext(StateContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to Logout from this Device!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: " #eb660f",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate("/login");
      }
    });
  };

  const sidebarData = [
    {
      mainButton: "Dashboard",
      images: "home.png",
      link: "/",
      dropDown: "side_drop",
    },

    {
      mainButton: "User Management",
      images: "my-team.png",
      link: "/total-user",
      dropDown: "side_drop",
    },
    {
      mainButton: "Admin Users",
      images: "admin.png",
      link: "/total-admin",
      dropDown: "side_drop",
    },
    {
      mainButton: "Referral",
      images: "referral.png",
      link: "/referral",
      dropDown: "side_drop",
    },
    {
      mainButton: "ICO Management",
      images: "ico.png",
      link: "/ico-management",
      dropDown: "side_drop",
    },
    {
      mainButton: "KYC Management",
      images: "kyc.png",
      link: "/kyc-management",
      dropDown: "side_drop",
    },
    {
      mainButton: "Busniess Analytics",
      images: "report.png",
      link: "/get-business-analytics",
      dropDown: "side_drop",
    },
    {
      mainButton: "Busniess Report",
      images: "report.png",
      link: "/get-business-report",
      dropDown: "side_drop",
    },
    {
      mainButton: "User Info",
      images: "usericon.png",
      link: "/get-user-details",
      dropDown: "side_drop",
    },
    {
      mainButton: "Buy History",
      images: "history.png",
      link: "/buy-history",
      dropDown: "side_drop",
    },
    {
      mainButton: "Bonus Coins History",  
      images: "bonuscoinhistory.png",
      link: "/bonus-history",
      dropDown: "side_drop",
    },
    {
      mainButton: "Wallet Management",
      images: "walleticon.png",
      link: "/wallet-management",
      dropDown: "side_drop",
    },
    {
      mainButton: "Legal Updation",
      images: "legal.png",
      link: "/legal-updation",
      dropDown: "side_drop",
    },

    {
      mainButton: "Share Holders",
      images: "my-team.png",
      link: "/share-holders",
      dropDown: "side_drop",
    },
    {
      mainButton: "Withdrawal Bonus",
      images: "withdrawal.png",
      link: "/withdrawal",
      dropDown: "side_drop",
    },

    {
      mainButton: "Support",
      images: "support.png",
      link: "/support",
      dropDown: "side_drop",
    },
    {
      mainButton: "Software Setting",
      images: "setting.svg",
      link: "/setting",
      dropDown: "side_drop",
    },
    {
      mainButton: "Delete Account",
      images: "delete.png",
      link: "/get-deleted-accounts",
      dropDown: "side_drop",
    },
    {
      mainButton: "Logout",
      images: "logout.png",
      link: "#",
      dropDown: "side_drop",
      onClick: handleLogout,
    },
  ];

  return (
    <div>
      <div
        className={`main_sidebar ${
          sidebarMenu ? "main_sidebar_close" : "main_sidebar_open"
        } `}
      >
        <div className="sidebar_image text-start d-flex flex-md-block align-items-center justify-content-between px-1 px-md-3 py-ms-3 pb-4">
          <Link to="/" className="text-decoration-none text-center">
            {sidebarMenu ? (
              <img
                src={logo}
                alt="logo-image"
                style={{ width: "48.021px" }}
                className="img-fluid"
              />
            ) : (
              <div className="d-flex gap-3">
                <img
                  src={logo}
                  alt="logo-image"
                  style={{ width: "48.021px" }}
                  className="img-fluid"
                />{" "}
                <h5 className="m-0 my-auto jaimax_head ">JAIMAX COIN</h5>
              </div>
            )}
          </Link>
          <div
            className="menu_data d-lg-none"
            onClick={() => setSidebarMenu(!sidebarMenu)}
          >
            <Link to="#" className="">
              <img src={`/images/svg/close.svg`} alt="menu-svg" />
            </Link>
          </div>
        </div>

        <div className="sidebar_list_data">
          <div className="accordion accordion-flush" id="accordionFlushExample">
            {sidebarData.map((data, i) =>
              data.onClick ? (
                <div
                  onClick={data.onClick}
                  className={`text-decoration-none ${data.active}`}
                  key={i}
                >
                  <div className="accordion-item sidebardata border-0 my-2 bg-transparent">
                    <h2 className="accordion-header">
                      <button
                        className={`accordion-button collapsed gap-3 sidebar_list rounded-2 shadow-none ${data.dropDown}`}
                        type="button"
                      >
                        <img
                          src={`/images/sidebar/${data.images}`}
                          alt="home-img"
                          className="img-fluid"
                        />
                        {data.mainButton}
                      </button>
                    </h2>
                  </div>
                </div>
              ) : (
                <NavLink
                  to={data.link}
                  className={`text-decoration-none ${data.active}`}
                  key={i}
                >
                  <div className="accordion-item sidebardata border-0 my-2 bg-transparent">
                    <h2 className="accordion-header">
                      <button
                        className={`accordion-button collapsed gap-3 sidebar_list rounded-2 shadow-none ${data.dropDown}`}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#flush-collapse${data.id}`}
                        aria-expanded="false"
                        aria-controls={`flush-collapse${data.id}`}
                      >
                        <img
                          src={`/images/sidebar/${data.images}`}
                          alt="home-img"
                          className="img-fluid"
                        />
                        {data.mainButton}
                      </button>
                    </h2>
                    <div
                      id={`flush-collapse${data.id}`}
                      className="accordion-collapse collapse"
                      data-bs-parent="#accordionFlushExample"
                    >
                      {data.sidebarList && (
                        <div className="accordion-body pb-1">
                          <ul className="list-unstyled ps-4 sidebar_list mb-0">
                            {data?.sidebarList?.map((list, i) => (
                              <li key={i} className="mb-2">
                                <NavLink
                                  to={list.sidebarlink}
                                  className="text-decoration-none"
                                >
                                  {list.lists}
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </NavLink>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
