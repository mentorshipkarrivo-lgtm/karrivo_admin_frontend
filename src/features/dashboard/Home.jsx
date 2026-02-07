import React from "react";
import DashboardLayout from "../../Layout/DashboardLayout";

const Home = () => {
  return (
    <DashboardLayout>
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
    

        {/* Main Heading */}
        <h1
          style={{
            fontSize: "36px",
            fontWeight: "700",
            color : "white",
            marginBottom: "15px",
            textAlign: "center",
          }}
        >
          Dashboard Coming Soon
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: "18px",
            fontWeight: "400",
            color: "#666",
            maxWidth: "600px",
            textAlign: "center",
            marginBottom: "30px",
            lineHeight: "1.6",
          }}
        >
          We're building an amazing dashboard experience for you. Soon you'll be able to view comprehensive analytics, insights, and manage your platform from here.
        </p>

        {/* Feature Highlights */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            maxWidth: "800px",
            width: "100%",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              padding: "20px",
              backgroundColor: "rgba(235, 102, 15, 0.1)",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "10px" }}>📊</div>
            <h5 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "5px" }}>
              Analytics & Insights
            </h5>
            <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
              Real-time platform statistics
            </p>
          </div>

          <div
            style={{
              padding: "20px",
              backgroundColor: "rgba(235, 102, 15, 0.1)",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "10px" }}>👥</div>
            <h5 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "5px" }}>
              User Management
            </h5>
            <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
              Monitor mentors & mentees
            </p>
          </div>

          <div
            style={{
              padding: "20px",
              backgroundColor: "rgba(235, 102, 15, 0.1)",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "10px" }}>📅</div>
            <h5 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "5px" }}>
              Session Tracking
            </h5>
            <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
              Manage bookings & schedules
            </p>
          </div>
        </div>

        {/* Status Message */}
        <div
          style={{
            marginTop: "40px",
            padding: "15px 30px",
            backgroundColor: "#f8f9fa",
            borderRadius: "25px",
            fontSize: "14px",
            fontWeight: "500",
            color: "#eb660f",
          }}
        >
          ⏳ In Development - Stay Tuned!
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;