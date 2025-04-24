import React, { useState, useEffect, useContext } from "react";
import DashboardLayout from "../../Layout/DashboardLayout";
const NoAccess = () => {

  return (
    <>
      <DashboardLayout>
        <section className="profile_section user__management py-4">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="my_total_team_data rounded-3 px-3 pb-0 py-4">
                  <h1 className="mb-3">No Access</h1>
                </div>

              </div>
            </div>
          </div>
        </section>
      </DashboardLayout>

      {/* // <!-- Modal --> */}
    </>
  );
};

export default NoAccess;
