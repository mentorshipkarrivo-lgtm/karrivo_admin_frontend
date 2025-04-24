import React, { useContext } from "react";
import MainNavbar from "../components/MainNavbar";
import Sidebar from "../components/Sidebar";
import { StateContext } from "../context/StateContext";

const DashboardLayout = ({ children }) => {
  const { sidebarMenu, setSidebarMenu } = useContext(StateContext);

  return (
    <div>
      <div className="navbar_data">
        <MainNavbar />
      </div>
      <div className="navbar_data">
        <Sidebar />
      </div>
      <div
        className={`main_data ${
          !sidebarMenu ? "main_data_open" : "main_data_close"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
