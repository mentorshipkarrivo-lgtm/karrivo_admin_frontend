import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useGetUserInfoQuery } from '../services/api/userInfoApi'; // Adjust the path as necessary


function buildReferralMap(data) {
    
  const map = new Map();
  data.forEach((user) => {
    if (user.isActive) {
      if (!map.has(user.referenceId)) {
        map.set(user.referenceId, []);
      }
      map.get(user.referenceId).push(user);
    }
  });
  return map;
}

function getReferralsForUser(referenceId, data) {
  const referralMap = buildReferralMap(data);
  const directReferrals = referralMap.get(referenceId) || [];
  const chainReferrals = [];
  const visited = new Set();
  directReferrals.forEach((user) => {
    visited.add(user.username);
  });
  const findChainReferrals = (user) => {
    const children = referralMap.get(user.username) || [];
    children.forEach((child) => {
      if (child.isActive && !visited.has(child.username)) {
        visited.add(child.username);
        chainReferrals.push(child);
        findChainReferrals(child);
      }
    });
  };
  directReferrals.forEach((user) => {
    if (user.isActive) {
      findChainReferrals(user);
    }
  });

  return {
    directReferrals,
    chainReferrals,
  };
}

const Userinfo = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [referrals, setReferrals] = useState([]);
  const [refType, setRefType] = useState("");
  const [loading, setLoading] = useState(false);
  const { data, error, isLoading } = useGetUserInfoQuery();

  const handleDirectSearch = () => {
    setLoading(true);
    setTimeout(() => {
      const { directReferrals } = getReferralsForUser(searchTerm.trim(), data.directReferrals);
      setRefType("direct");
      setReferrals(directReferrals);
      setLoading(false);
    }, 500);
  };

  const handleChainSearch = () => {
    setLoading(true);
    setTimeout(() => {
      const { chainReferrals } = getReferralsForUser(searchTerm.trim(), data.chainReferrals);
      setRefType("chain");
      setReferrals(chainReferrals);
      setLoading(false);
    }, 500);
  };

  const exportToExcel = () => {
    if (referrals.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(referrals);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Referrals");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `${refType}_referrals.xlsx`);
  };

  return (
    <div
      style={{
        background: "#2b2e3b",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "fixed",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          textAlign: "center",
          width: "100%",
          maxWidth: "900px",
          padding: "1rem",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          borderRadius: "12px",
          backdropFilter: "blur(8px)",
        }}
      >
        <h2 style={{ color: "#ff8800", marginBottom: "1rem" }}>
          REFERRAL FINDER
        </h2>

        <input
          type="text"
          placeholder="Enter Reference ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control mb-3 mx-auto"
          style={{
            padding: "14px",
            backgroundColor: "#3a3f4c",
            color: "#fff",
            borderRadius: "10px",
            border: "2px solid #ff8800",
            width: "100%",
            maxWidth: "300px",
            marginBottom: "1rem",
            textAlign: "center",
          }}
        />

        <div
          className="d-flex justify-content-center"
          style={{ gap: "10px", flexWrap: "wrap" }}
        >
          <button
            onClick={handleDirectSearch}
            className="btn"
            style={{
              backgroundColor: "#ff8800",
              color: "#fff",
              borderRadius: "12px",
              padding: "12px 20px",
              minWidth: "150px",
            }}
          >
            Show Direct Referrals
          </button>

          <button
            onClick={handleChainSearch}
            className="btn"
            style={{
              backgroundColor: "#ff8800",
              color: "#fff",
              borderRadius: "12px",
              padding: "12px 20px",
              minWidth: "150px",
            }}
          >
            Show Chain Referrals
          </button>

          <button
            onClick={exportToExcel}
            className="btn"
            disabled={referrals.length === 0}
            style={{
              backgroundColor: "#ff8800",
              color: "#fff",
              borderRadius: "12px",
              padding: "12px 20px",
              minWidth: "150px",
            }}
          >
            Download XLSX
          </button>
        </div>
      </div>

      {/* Table or Spinner */}
      <div
        className="table-container"
        style={{
          marginTop: "240px",
          padding: "1rem",
          height: "calc(100vh - 220px)",
          overflowY: "auto",
          scrollbarWidth: "none",
        }}
      >
        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "200px" }}
          >
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden" style={{ padding: "50%" }}>
                Loading...
              </span>
            </div>
          </div>
        ) : referrals.length > 0 ? (
          <div className="table-responsive p-3">
            <table
              className="table table-dark  table-striped rounded-3"
              style={{
                width: "100%",
                tableLayout: "fixed",
                backgroundColor: "#000",
                marginTop: "20px",
              }}
            >
              <thead
                style={{
                  backgroundColor: "#ff8800",
                  position: "sticky",
                  top: 0,
                }}
              >
                <tr
                  className="text-light"
                  style={{ borderBottom: "2px solid #333", marginTop: "0px" }}
                >
                  <th
                    className="text-center p-3"
                    style={{
                      border: "1px solid #444",
                      color: "#fff",
                      padding: "10px",
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    S.No
                  </th>
                  <th
                    className="text-center p-3"
                    style={{
                      border: "1px solid #444",
                      color: "#fff",
                      // position: 'sticky',
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    Name
                  </th>
                  {refType === "direct" && (
                    <th
                      className="text-center p-3"
                      style={{
                        // border: '1px solid #444',
                        color: "#fff",
                        // position: 'sticky',
                        top: 0,
                        zIndex: 1,
                      }}
                    >
                      Username
                    </th>
                  )}
                  <th
                    className="text-center p-3"
                    style={{
                      // border: '1px solid #444',
                      color: "#fff",
                      // position: 'sticky',
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    Phone
                  </th>
                  <th
                    className="text-center p-3"
                    style={{
                      // border: '1px solid #444',
                      color: "#fff",
                      // position: 'sticky',
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    Email
                  </th>
                  <th
                    className="text-center p-3"
                    style={{
                      color: "#fff",
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    Referred by
                  </th>
                </tr>
              </thead>
              <tbody
                style={{
                  maxHeight: "calc(100vh - 220px)",
                  overflowY: "auto",
                  scrollbarWidth: "none",
                }}
              >
                {referrals.map((user, index) => (
                  <tr
                    key={index}
                    style={{
                      textAlign: "center",
                      backgroundColor: index % 2 === 0 ? "#2e2e2e" : "#333",
                      color: "#fff",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#444")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor =
                        index % 2 === 0 ? "#2e2e2e" : "#333")
                    }
                  >
                    <td
                      className="text-center p-3"
                      style={{
                        border: "1px solid #444",
                        padding: "10px",
                        textAlign: "center",
                      }}
                    >
                      {index + 1}
                    </td>
                    <td className="p-3">{user.name}</td>
                    {refType === "direct" && (
                      <td className="p-3">{user.username}</td>
                    )}
                    <td className="p-3">{user.phone}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.referenceId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-light text-center" style={{ paddingLeft: "45%" }}>
            No referrals found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Userinfo;
