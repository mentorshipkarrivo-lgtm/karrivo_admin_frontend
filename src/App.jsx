import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./features/dashboard/Home";
import UserManagement from "./features/user/UserManagement";
import AdminManagement from "./features/admin/AdminManagement";
import Referral from "./features/referral/Referral";
import IcoManagement from "./features/ico/IcoManagement";
import BuyHistory from "./features/buyHistory/BuyHistory";
import Withdrawal from "./pages/Withdrawal";
import Support from "./pages/Support";
import KycApprove from "./pages/KycManagement";
import LegalUpdation from "./pages/LegalUpdation";
import Profile from "./pages/Profile";
import WalletManagement from "./pages/WalletManagement";
import SupportChart from "./pages/SupportChart";
import Login from "./features/auth/Login";
import BonusHistory from "./features/bonusHistory/BonusHistory";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./router/PrivateRoute";
import PublicRoute from "./router/PublicRoute";
import Setting from "./pages/Setting";
import NoAccess from "./features/noaccess/NoAccess";
import Userinfo from "./features/userinfo/Userinfo";
import PaymentGatewayManagement from "./features/paymentGateway/PaymentGatewayManagement";
import GetBusniessDetails from "./features/getBusniessAnalyticsDetails/GetBusniessDetails";
import DeletedUsersTable from "./features/deleteAccountByAdmin/DeleteAccountByAdmin";
import ShareHolderDashboard from "./features/shareHolders/ShareHolder";
import GetBusinessReportFromTo from "./features/getBusinessReportFromTo/getBusinessReportFromTo";
import ExludeUsers from "./features/excludeUsers/ExludeUsers";
import MarketingReportsDownload from "./features/reports/Reports";
import Notifications from "./features/notifications/BulkNotificationManagement";
import AllTransactions from "./pages/AllTransactions";

const App = () => {
  const userDataString = localStorage.getItem("userData");
  const userData = JSON.parse(userDataString);
  const role = userData?.data?.role;
  const permissions = userData?.data?.permissions || [];

  // Super Admin (role 0) - All Access
  if (role === 0) {
    return (
      <>
        <ToastContainer />
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/total-user" element={<UserManagement />} />
            <Route path="/total-admin" element={<AdminManagement />} />
            <Route path="/referral" element={<Referral />} />
            <Route path="/ico-management" element={<IcoManagement />} />
            <Route path="/kyc-management" element={<KycApprove />} />
            <Route path="/legal-updation" element={<LegalUpdation />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/withdrawal" element={<Withdrawal />} />
            <Route path="/support" element={<Support />} />
            <Route path="/support-chart/:id" element={<SupportChart />} />
            <Route path="/buy-history" element={<BuyHistory />} />
            <Route path="/wallet-management" element={<WalletManagement />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/bonus-history" element={<BonusHistory />} />
            <Route path="/get-user-details" element={<Userinfo />} />
            <Route
              path="/payment-gateways"
              element={<PaymentGatewayManagement />}
            />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/all-transactions" element={<AllTransactions />} />
            <Route
              path="/get-deleted-accounts"
              element={<DeletedUsersTable />}
            />
            <Route
              path="/get-business-analytics"
              element={<GetBusniessDetails />}
            />
            <Route
              path="/get-business-report"
              element={<GetBusinessReportFromTo />}
            />
            <Route path="/share-holders" element={<ShareHolderDashboard />} />
            <Route path="/exclude-users" element={<ExludeUsers />} />
            <Route path="/get-reports" element={<MarketingReportsDownload />} />
          </Route>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </>
    );
  }

  // Limited User (role 2) - Based on permissions
  if (role === 2) {
    return (
      <>
        <ToastContainer />
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />

            {/* KYC Management Permission */}
            {permissions.includes("KYC MANAGEMENT") ? (
              <Route path="/kyc-management" element={<KycApprove />} />
            ) : (
              <Route path="/kyc-management" element={<NoAccess />} />
            )}

            {/* notifications Permission */}
            {permissions.includes("NOTIFICATIONS") ? (
              <Route path="/notifications" element={<Notifications />} />
            ) : (
              <Route path="/notifications" element={<NoAccess />} />
            )}

            {/* all walltet transactions Permission */}
            {permissions.includes("ALL_TRANSACTIONS") ? (
              <Route path="/all-transactions" element={<AllTransactions />} />
            ) : (
              <Route path="/all-transactions" element={<NoAccess />} />
            )}

            {/* paymentgateways Permission */}
            {permissions.includes("PAYMENTGATEWAYS") ? (
              <Route
                path="/payment-gateways"
                element={<PaymentGatewayManagement />}
              />
            ) : (
              <Route path="/payment-gateways" element={<NoAccess />} />
            )}

            {/* Wallet Management Permission */}
            {permissions.includes("WALLET MANAGEMENT") ? (
              <Route path="/wallet-management" element={<WalletManagement />} />
            ) : (
              <Route path="/wallet-management" element={<NoAccess />} />
            )}

            {/* Withdrawal Management Permission */}
            {permissions.includes("WITHDRAW MANAGEMENT") ? (
              <Route path="/withdrawal" element={<Withdrawal />} />
            ) : (
              <Route path="/withdrawal" element={<NoAccess />} />
            )}

            {/* Support Permission */}
            {permissions.includes("SUPPORT") ? (
              <>
                <Route path="/support" element={<Support />} />
                <Route path="/support-chart/:id" element={<SupportChart />} />
              </>
            ) : (
              <>
                <Route path="/support" element={<NoAccess />} />
                <Route path="/support-chart/:id" element={<NoAccess />} />
              </>
            )}

            {/* User Info Permission */}
            {permissions.includes("USER INFO") ? (
              <Route path="/get-user-details" element={<Userinfo />} />
            ) : (
              <Route path="/get-user-details" element={<NoAccess />} />
            )}

            {/* Default Home Route - Always show Home component */}
            {permissions.includes("DASHBOARD") ? (
              <Route path="/" element={<Home />} />
            ) : (
              <Route path="/" element={<NoAccess />} />
            )}

            {/* Total User Permission */}
            {permissions.includes("USER MANAGEMENT") ? (
              <Route path="/total-user" element={<UserManagement />} />
            ) : (
              <Route path="/total-user" element={<NoAccess />} />
            )}

            {/* Total Admin Permission */}

            <Route path="/total-admin" element={<NoAccess />} />

            {/* Referral Permission */}
            {permissions.includes("REFERRAL") ? (
              <Route path="/referral" element={<Referral />} />
            ) : (
              <Route path="/referral" element={<NoAccess />} />
            )}

            {/* ICO Management Permission */}
            {permissions.includes("ICO_MANAGEMENT") ? (
              <Route path="/ico-management" element={<IcoManagement />} />
            ) : (
              <Route path="/ico-management" element={<NoAccess />} />
            )}

            {/* Exclude Users Permission */}
            {permissions.includes("EXCLUDE_USERS") ? (
              <Route path="/exclude-users" element={<ExludeUsers />} />
            ) : (
              <Route path="/exclude-users" element={<NoAccess />} />
            )}

            {/* Legal Updation Permission */}
            {permissions.includes("LEGAL_UPDATION") ? (
              <Route path="/legal-updation" element={<LegalUpdation />} />
            ) : (
              <Route path="/legal-updation" element={<NoAccess />} />
            )}

            {/* Buy History Permission */}
            {permissions.includes("BUY_HISTORY") ? (
              <Route path="/buy-history" element={<BuyHistory />} />
            ) : (
              <Route path="/buy-history" element={<NoAccess />} />
            )}

            {/* Setting Permission */}
            {permissions.includes("SETTING") ? (
              <Route path="/setting" element={<Setting />} />
            ) : (
              <Route path="/setting" element={<NoAccess />} />
            )}

            {/* Bonus History Permission */}
            {permissions.includes("SUPER BONUS") ? (
              <Route path="/bonus-history" element={<BonusHistory />} />
            ) : (
              <Route path="/bonus-history" element={<NoAccess />} />
            )}

            {/* Get Deleted Accounts Permission */}
            {permissions.includes("DELETE ACCOUNTS") ? (
              <Route
                path="/get-deleted-accounts"
                element={<DeletedUsersTable />}
              />
            ) : (
              <Route path="/get-deleted-accounts" element={<NoAccess />} />
            )}

            {/* Get Business Analytics Permission */}
            {permissions.includes("GET_BUSINESS_ANALYTICS") ? (
              <Route
                path="/get-business-analytics"
                element={<GetBusniessDetails />}
              />
            ) : (
              <Route path="/get-business-analytics" element={<NoAccess />} />
            )}

            {/* Get Business Report Permission */}
            {permissions.includes("BUSINESS REPORT") ? (
              <Route
                path="/get-business-report"
                element={<GetBusinessReportFromTo />}
              />
            ) : (
              <Route path="/get-business-report" element={<NoAccess />} />
            )}

            {/* Share Holders Permission */}
            {permissions.includes("SHARE_HOLDERS") ? (
              <Route path="/share-holders" element={<ShareHolderDashboard />} />
            ) : (
              <Route path="/share-holders" element={<NoAccess />} />
            )}

            {/* Share Holders Permission */}
            {permissions.includes("REPORTS") ? (
              <Route
                path="/get-reports"
                element={<MarketingReportsDownload />}
              />
            ) : (
              <Route path="/get-reports" element={<NoAccess />} />
            )}
          </Route>

          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </>
    );
  }

  // Default - No role or invalid role
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
};

export default App;
