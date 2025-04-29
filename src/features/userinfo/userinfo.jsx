// import React from "react";
// import DashboardLayout from "../../Layout/DashboardLayout";
// import { useFormik } from "formik";

// import * as Yup from "yup";
// const userinfo = () => {
//   const formik = useFormik({
//     initialValues: {
//       username: "",
//     },
//     validationSchema: Yup.object({
//       username: Yup.string().required("Username is required"),
//     }),
//     onSubmit: (values) => {
//       console.log(values);
//     },
//   });
//   return (
//     <>
//       <DashboardLayout>
//         <section className=" py-4">
//           <section className=" py-4 h-100">
//             <div className="">
//               <div className="row">
//                 <div className="col-12">
//                   <div className="my_total_team_data h-100 rounded-3 px-3 pb-0 py-4">
//                     <div>
//                       <div className="row">
//                         <div className="col-12">
//                           <div className="user_heading mb-4">
//                             <h1>User Information</h1>
//                           </div>

//                           <div
//                             style={{
//                               margin: "0 auto",
//                               maxWidth: "fit-content",
//                             }}
//                           >
//                             <form
//                               onSubmit={formik.handleSubmit}
//                               className="d-flex"
//                             >
//                               <div className="">
//                                 <label
//                                   htmlFor="username"
//                                   className="form-label"
//                                 >
//                                   Username <span className="error">*</span>
//                                 </label>
//                                 <input
//                                   type="text"
//                                   id="username"
//                                   name="username"
//                                   className="form-control shadow-none bg-transparent text-white w-50"
//                                   value={formik.values.username}
//                                   onChange={formik.handleChange}
//                                   onBlur={formik.handleBlur}
//                                   style={{
//                                     width: "300px",
//                                   }}
//                                 />

//                                 {formik.touched.username &&
//                                   formik.errors.username && (
//                                     <div className="error">
//                                       {formik.errors.username}
//                                     </div>
//                                   )}
//                               </div>
//                               <button type="submit">Submit</button>
//                             </form>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="table_data table-responsive">
//                       <table className="table ">
//                         <thead>
//                           <tr>
//                             <th scope="col">S.No</th>
//                             <th scope="col">Name</th>
//                             <th scope="col">username</th>
//                             <th scope="col">email</th>
//                             <th scope="col">Phone Number</th>
//                             <th scope="col">Referred By</th>
//                           </tr>
//                         </thead>
//                       </table>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>
//         </section>
//       </DashboardLayout>
//     </>
//   );
// };

// export default userinfo;
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import DashboardLayout from "../../Layout/DashboardLayout";
import { useGetUserInfoQuery } from "./userinfoApiSlice";

function buildReferralMap(users) {
  const map = new Map();
  users.forEach((user) => {
    if (user.isActive) {
      if (!map.has(user.referenceId)) {
        map.set(user.referenceId, []);
      }
      map.get(user.referenceId).push(user);
    }
  });
  return map;
}

const Userinfo = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [referrals, setReferrals] = useState([]);
  const [refType, setRefType] = useState("");
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  // Use the API query hook with skip parameter
  const {
    data: userData,
    error,
    isLoading,
    refetch,
  } = useGetUserInfoQuery(searchTerm, {
    skip: !searchTerm.trim(),
  });

  const clearAll = () => {
    setReferrals([]);
    setUserDetails(null);
    setRefType("");
  };

  const handleDirectSearch = () => {
    if (!searchTerm.trim()) {
      alert("Please enter a Reference ID");
      return;
    }

    setLoading(true);
    clearAll();

    // Trigger API call with current searchTerm
    refetch().then(() => {
      setRefType("direct");
      setLoading(false);
    });
  };

  const handleChainSearch = () => {
    if (!searchTerm.trim()) {
      alert("Please enter a Reference ID");
      return;
    }

    setLoading(true);
    clearAll();

    // Trigger API call with current searchTerm
    refetch().then(() => {
      setRefType("chain");
      setLoading(false);
    });
  };

  const handleShowUserDetails = () => {
    if (!searchTerm.trim()) {
      alert("Please enter a Reference ID");
      return;
    }

    setLoading(true);
    clearAll();

    // Refresh data from API
    refetch().then(() => {
      // User details will be updated from the useEffect
      setLoading(false);
    });
  };

  // Handle API response - process data when it changes
  useEffect(() => {
    if (userData) {
      // Check for token expiration error
      if (
        userData.status_code === 408 &&
        userData.message?.includes("Token expired")
      ) {
        alert("Session expired. Please login again.");
        // Redirect to login page
        // window.location.href = "/login";
        return;
      }

      // If data is successfully retrieved
      if (userData.success === 1 && userData.data) {
        // Get the response data structure based on your description
        const { directReferrals = [], chainReferrals = [] } = userData.data;

        // Update referrals based on the selected type
        if (refType === "direct") {
          setReferrals(directReferrals);
        } else if (refType === "chain") {
          setReferrals(chainReferrals);
        }

        // If we're showing user details
        if (!refType) {
          // Find the user in directReferrals or calculate from the response
          const foundUser = userData.data.user || {};

          if (foundUser) {
            setUserDetails({
              ...foundUser,
              directCount: directReferrals.length,
              chainCount: chainReferrals.length,
            });
          } else {
            alert("User not found!");
          }
        }
      }
    }
  }, [userData, refType]);

  const exportToExcel = () => {
    if (!searchTerm.trim()) {
      alert("Please enter a Reference ID");
      return;
    }

    setLoading(true);

    // Refresh data from API if needed
    refetch().then(() => {
      if (!userData || !userData.data) {
        alert("No user data available");
        setLoading(false);
        return;
      }

      const { directReferrals = [], chainReferrals = [], user } = userData.data;

      if (!user) {
        alert("User not found!");
        setLoading(false);
        return;
      }

      const dataToExport = [];

      dataToExport.push({
        Name: user.name,
        Username: user.username,
        Phone: user.phone,
        Email: user.email,
        ReferralBonus: user.referenceInr,
        DirectReferralsCount: directReferrals.length,
        ChainReferralsCount: chainReferrals.length,
      });

      dataToExport.push({ Section: "" });
      dataToExport.push({ Section: "Direct Referrals" });

      dataToExport.push({
        Name: "Name",
        Username: "Username",
        Phone: "Phone",
        Email: "Email",
        ReferralBonus: "Referral Bonus",
        ReferredBy: "Referred By",
      });

      directReferrals.forEach((user) => {
        dataToExport.push({
          Name: user.name,
          Username: user.username,
          Phone: user.phone,
          Email: user.email,
          ReferralBonus: user.referenceInr,
          ReferredBy: user.referenceId,
        });
      });

      dataToExport.push({ Section: "" });
      dataToExport.push({ Section: "Chain Referrals" });

      dataToExport.push({
        Name: "Name",
        Username: "Username",
        Phone: "Phone",
        Email: "Email",
        ReferralBonus: "Referral Bonus",
        ReferredBy: "Referred By",
      });

      chainReferrals.forEach((user) => {
        dataToExport.push({
          Name: user.name,
          Username: user.username,
          Phone: user.phone,
          Email: user.email,
          ReferralBonus: user.referenceInr,
          ReferredBy: user.referenceId,
        });
      });

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Referrals");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const data = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });

      const today = new Date().toISOString().slice(0, 10);
      saveAs(data, `${user.name}_referrals_${today}.xlsx`);

      alert("Download started successfully!");
      setLoading(false);
    });
  };

  // Display API loading state
  const isPageLoading = loading || isLoading;

  return (
    <DashboardLayout>
      <div
        className="profile_section py-4"
        style={{
          backgroundColor: "#1b232d",
          borderRadius: "5px",
          overflow: "hidden",
          marginRight: "10px",
          marginLeft: "10px",
        }}
      >
        <div className="container-fluid ">
          <div className="container">
            <div className=" rounded-3 p-3">
              <div className="row justify-content-center">
                <div className="col-auto">
                  <input
                    type="text"
                    placeholder="Enter Reference ID"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control mb-3"
                    style={{ maxWidth: "300px", textAlign: "center" }}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <button
                  onClick={handleDirectSearch}
                  className="btn text-white"
                  style={{ backgroundColor: "#ec660f" }}
                  disabled={isPageLoading}
                >
                  Show Direct Referrals
                </button>
                <button
                  onClick={handleChainSearch}
                  className="btn text-white"
                  style={{ backgroundColor: "#ec660f" }}
                  disabled={isPageLoading}
                >
                  Show Chain Referrals
                </button>
                <button
                  onClick={handleShowUserDetails}
                  className="btn text-white"
                  style={{ backgroundColor: "#ec660f" }}
                  disabled={isPageLoading}
                >
                  Show Details
                </button>
                <button
                  onClick={exportToExcel}
                  className="btn text-white"
                  style={{ backgroundColor: "#ec660f" }}
                  disabled={isPageLoading}
                >
                  Download XLSX
                </button>
              </div>

              {/* Display API error message */}
              {error && (
                <div className="alert alert-danger mt-3 text-center">
                  Error loading data. Please try again.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="container" style={{ backgroundColor: "#1b242d" }}>
          {isPageLoading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "240px" }}
            >
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              {userDetails && (
                <div className="d-flex justify-content-center">
                  <div
                    className="alert alert-info mt-4 p-4 w-100"
                    style={{
                      backgroundColor: "#1b242d",
                      color: "#fff",
                      maxWidth: "500px",
                    }}
                  >
                    <h4
                      className="text-center mb-4"
                      style={{ color: "#ec660f" }}
                    >
                      User Details
                    </h4>
                    <ul className="list-unstyled mb-0">
                      <li className="mb-2">
                        <strong>Name:</strong> {userDetails.name}
                      </li>
                      <li className="mb-2">
                        <strong>Username :</strong> {userDetails.username}
                      </li>
                      <li className="mb-2">
                        <strong>Phone :</strong> {userDetails.phone}
                      </li>
                      <li className="mb-2">
                        <strong>Email :</strong> {userDetails.email}
                      </li>

                      <li className="mb-2">
                        <strong>Referral Bonus :</strong> ₹
                        {userDetails.referenceInr}
                      </li>
                      <li className="mb-2">
                        <strong>Direct Referrals :</strong>{" "}
                        {userDetails.directCount}
                      </li>
                      <li>
                        <strong>Chain Referrals :</strong>{" "}
                        {userDetails.chainCount}
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {referrals.length > 0 && (
                <div className="table-responsive p-3">
                  <table
                    className="table table-bordered table-dark"
                    style={{ backgroundColor: "#1b242d" }}
                  >
                    <thead style={{ backgroundColor: "#ec660f" }}>
                      <tr className="text-light">
                        <th
                          className="text-center p-3"
                          style={{ backgroundColor: "#ec660f" }}
                        >
                          S.No
                        </th>
                        <th
                          className="text-center p-3"
                          style={{ backgroundColor: "#ec660f" }}
                        >
                          Name
                        </th>
                        {refType === "direct" && (
                          <th
                            className="text-center p-3"
                            style={{ backgroundColor: "#ec660f" }}
                          >
                            Username
                          </th>
                        )}
                        <th
                          className="text-center p-3"
                          style={{ backgroundColor: "#ec660f" }}
                        >
                          Phone
                        </th>
                        <th
                          className="text-center p-3"
                          style={{ backgroundColor: "#ec660f" }}
                        >
                          Email
                        </th>
                        <th
                          className="text-center p-3"
                          style={{ backgroundColor: "#ec660f" }}
                        >
                          Referral Bonus
                        </th>
                        <th
                          className="text-center p-3"
                          style={{ backgroundColor: "#ec660f" }}
                        >
                          Referred by
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {referrals.map((user, index) => (
                        <tr
                          key={index}
                          style={{ backgroundColor: "#2e2e2e", color: "#fff" }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#444")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#2e2e2e")
                          }
                        >
                          <td className="text-center p-3">{index + 1}</td>
                          <td className="p-3">{user.name}</td>
                          {refType === "direct" && (
                            <td className="p-3">{user.username}</td>
                          )}
                          <td className="p-3">{user.phone}</td>
                          <td className="p-3">{user.email}</td>
                          <td className="p-3">{user.referenceInr}</td>
                          <td className="p-3">{user.referenceId}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Userinfo;
