import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Home from "./features/dashboard/Home";
import UserManagement from "./features/user/UserManagement";
import AdminManagement from "./features/admin/AdminManagement";
import Referral from "./features/referral/Referral";
import IcoManagement from "./features/ico/IcoManagement";
import BuyHistory from "./features/buyHistory/BuyHistory";
import Withdrawal from "./pages/Withdrawal";
// import Support from "./pages/Support";
// import KycApprove from "./pages/KycManagement";
import LegalUpdation from "./pages/LegalUpdation";
import Profile from "./pages/Profile";
import WalletManagement from "./pages/WalletManagement";
// import SupportChart from "./pages/SupportChart";
import Login from "./features/auth/Login";
import BonusHistory from "./features/bonusHistory/BonusHistory";
import Setting from "./pages/Setting";
import Userinfo from "./features/userinfo/Userinfo";
import PaymentGatewayManagement from "./features/paymentGateway/PaymentGatewayManagement";
import GetBusniessDetails from "./features/getBusniessAnalyticsDetails/GetBusniessDetails";
import DeletedUsersTable from "./features/deleteAccountByAdmin/DeleteAccountByAdmin";
import ShareHolderDashboard from "./features/shareHolders/ShareHolder";
import GetBusinessReportFromTo from "./features/getBusinessReportFromTo/getBusinessReportFromTo";
import ExludeUsers from "./features/excludeUsers/ExludeUsers";
import MarketingReportsDownload from "./features/reports/Reports";
import Notifications from "./features/notifications/BulkNotificationManagement";
import AllTransactions from "./features/support/support";
import ZoomMetting from "./features/zoom/ZoomMetting";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResetPassword from "./features/resetpage/ResetPassword";
import AllMentorSupportTickets from "./features/mentorSupport/mentorsupport";
import SessionBookingManagement from "./features/ico/IcoManagement";
import UserProfile from "./features/allmentees/allmentess";
import AllMenteeSupportTickets from "./features/MenteeSupport/MenteeSupport";
const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard */}
        <Route path="/" element={<Home />} />

        {/* User & Admin */}
        <Route path="/mentor-management" element={<UserManagement />} />
        <Route path="/allbookings" element={<AdminManagement />} />
        <Route path="/allmentees" element={<UserProfile />} />
        <Route path="/get-deleted-accounts" element={<DeletedUsersTable />} />
        <Route path="/exclude-users" element={<ExludeUsers />} />
        <Route path="/mentor-Support" element={<AllMentorSupportTickets />} />
        <Route path="/mentee-Support" element={<AllMenteeSupportTickets />} />



        {/* Mentor / KYC / Legal */}
        {/* <Route path="/kyc-management" element={<AllTransactions />} /> */}
        <Route path="/legal-updation" element={<LegalUpdation />} />

        {/* Finance */}
        <Route path="/wallet-management" element={<WalletManagement />} />
        <Route path="/withdrawal" element={<Withdrawal />} />
        <Route path="/bonus-history" element={<BonusHistory />} />
        <Route path="/all-transactions" element={<AllTransactions />} />
        <Route path="/payment-gateways" element={<PaymentGatewayManagement />} />

        {/* ICO / Referral */}
        <Route path="/ico-management" element={<SessionBookingManagement />} />
        <Route path="/referral" element={<Referral />} />
        <Route path="/buy-history" element={<BuyHistory />} />

        {/* Support */}
        {/* <Route path="/support" element={<Support />} /> */}
        {/* <Route path="/support-chart/:id" element={<SupportChart />} /> */}

        {/* Reports & Analytics */}
        <Route path="/get-business-analytics" element={<GetBusniessDetails />} />
        <Route path="/get-business-report" element={<GetBusinessReportFromTo />} />
        <Route path="/get-reports" element={<MarketingReportsDownload />} />
        <Route path="/share-holders" element={<ShareHolderDashboard />} />

        {/* Notifications & Meetings */}
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/zoom-meeting" element={<ZoomMetting />} />
        <Route path="/Reset-Password" element={<ResetPassword />} />






        {/* Settings & Profile */}
        <Route path="/setting" element={<Setting />} />
        <Route path="/profile" element={<Profile />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
