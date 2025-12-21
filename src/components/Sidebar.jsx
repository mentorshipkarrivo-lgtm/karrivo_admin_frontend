import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { StateContext } from "../context/StateContext";
import Swal from "sweetalert2";
import logo from "../../public/logo.jpg";

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
      mainButton: "Mentor Management",
      images: "my-team.png",
      link: "/mentor-management",
      dropDown: "side_drop",
    },
    {
      mainButton: "Mentees",
      images: "admin.png",
      link: "/total-admin",
      dropDown: "side_drop",
    },
    {
      mainButton: "Sessions & Bookings",
      images: "referral.png",
      link: "/referral",
      dropDown: "side_drop",
    },

    {
      mainButton: "Transactions ",
      images: "ico.png",
      link: "/ico-management",
      dropDown: "side_drop",
    },
    {
      mainButton: "Support",
      images: "kyc.png",
      link: "/kyc-management",
      dropDown: "side_drop",
    },

    {
      mainButton: "Analytics",
      images: "walleticon.png",
      link: "/wallet-management",
      dropDown: "side_drop",
    },
    {
      mainButton: "All Transactions",
      images: "new-wallet.png",
      link: "/all-transactions",
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
        className={`main_sidebar ${sidebarMenu ? "main_sidebar_close" : "main_sidebar_open"
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
                <h5 className="m-0 my-auto jaimax_head ">KARRIVO.IN</h5>
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
