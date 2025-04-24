import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { StateContext } from "../context/StateContext";
import { Icon } from "@iconify/react/dist/iconify.js";
import Swal from "sweetalert2";
import { useUserDataQuery } from "../features/user/userApiSlice";
const MainNavbar = () => {
  const { sidebarMenu, setSidebarMenu } = useContext(StateContext);
  const { data: userData } = useUserDataQuery();
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
  return (
    <div>
      <nav
        className={`navbar navbar-expand main_dashboard_navbar ${
          sidebarMenu ? "navbarClose" : "navbarOpen"
        }`}
      >
        <div className="container-fluid">
          <div
            className="collapse navbar-collapse justify-content-between gap-2 gap-md-0"
            id="navbarSupportedContent"
          >
            <div
              className="menu_data"
              onClick={() => setSidebarMenu(!sidebarMenu)}
            >
              <Link to="#" className="d-lg-none">
                <img
                  src={`/images/svg/${sidebarMenu ? "menu.svg" : "close.svg"}`}
                  alt="menu-svg"
                />
              </Link>
              <Link to="#" className="d-none d-lg-block">
                <img
                  src={`/images/svg/${!sidebarMenu ? "menu.svg" : "close.svg"}`}
                  alt="menu-svg"
                />
              </Link>
            </div>
            <div className="user_details d-flex align-items-center justify-content-center gap-5">
              <div className="user-details dropdown d-flex align-items-center justify-content-center gap-2">
                <div className="user_image">
                  <img
                    src={userData?.data?.profile || "/images/nav-logo.png"}
                    alt="user-image"
                    className="img-fluid"
                    style={{
                      cursor: "pointer",
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                    }}
                  />
                </div>
                <div
                  className="user_data"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <h3 className="mb-0 text-capitalize">
                    {userData?.data?.name}
                  </h3>
                  <p className="mb-0">{userData?.data?.email}</p>
                </div>
                <ul className="dropdown-menu profile_drop py-0">
                  <li>
                    <Link
                      className="dropdown-item px-1 d-flex align-items-center gap-1"
                      to="/profile"
                    >
                      <Icon
                        icon="ph:user-bold"
                        width="20"
                        height="20"
                        style={{ color: "var(--white)" }}
                      />
                      Profile
                    </Link>
                  </li>

                  <li>
                    <Link
                      className="dropdown-item px-1 d-flex align-items-center gap-1"
                      to="#"
                      onClick={handleLogout}
                    >
                      <Icon
                        icon="basil:logout-solid"
                        width="22"
                        height="22"
                        style={{ color: "var(--white)" }}
                      />
                      Log Out
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default MainNavbar;
