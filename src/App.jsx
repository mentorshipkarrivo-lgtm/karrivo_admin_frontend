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

//ToastContainer
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PrivateRoute from "./router/PrivateRoute";
import PublicRoute from "./router/PublicRoute";

import Setting from "./pages/Setting";

import NoAccess from "./features/noaccess/NoAccess";
import Userinfo from "./features/userinfo/Userinfo";
// import ShareHolderDashboard from "./features/shareHolders/ShareHolder";

const App = () => {
  const userDataString = localStorage.getItem("userData");
  const userData = JSON.parse(userDataString);
  const permissions = userData?.data?.permissions;
  const isKycS = permissions?.includes("KYC MANAGEMENT");
  console.log(localStorage.getItem("User Roles"));
  const isWalletS = permissions?.includes("WALLET MANAGEMENT");
  const isWithdrawalS = permissions?.includes("WITHDRAW MANAGEMENT");
  const arr1 = ["KYC MANAGEMENT", "WALLET MANAGEMENT"];
  const isKyc = permissions?.every((i) => arr1.includes(i));
  const arr2 = ["WALLET MANAGEMENT", "WITHDRAW MANAGEMENT"];
  const isWallet = permissions?.every((i) => arr2.includes(i));
  const arr3 = ["WITHDRAW MANAGEMENT", "KYC MANAGEMENT"];
  const isWithdrawal = permissions?.every((i) => arr3.includes(i));

  return (
    <>
      <ToastContainer />
      <Routes>
        {permissions == null && (
          <Route element={<PrivateRoute />}>
            <Route path={"/"} element={<Home />} />
            <Route path={"/total-user"} element={<UserManagement />} />
            <Route path={"/total-admin"} element={<AdminManagement />} />
            <Route path={"/referral"} element={<Referral />} />
            <Route path={"/ico-management"} element={<IcoManagement />} />
            <Route path={"/kyc-management"} element={<KycApprove />} />
            <Route path={"/legal-updation"} element={<LegalUpdation />} />
            <Route path={"/profile"} element={<Profile />} />
            <Route path={"/withdrawal"} element={<Withdrawal />} />
            <Route path={"/support"} element={<Support />} />
            <Route path={"/support-chart/:id"} element={<SupportChart />} />
            <Route path={"/buy-history"} element={<BuyHistory />} />
            <Route path={"/wallet-management"} element={<WalletManagement />} />
            <Route path={"/setting"} element={<Setting />} />
            <Route path={"/bonus-history"} element={<BonusHistory />} />
          </Route>
        )}
        {permissions?.length == 0 && (
          <Route element={<PrivateRoute />}>
            <Route path={"/"} element={<Home />} />
            <Route path={"/total-user"} element={<UserManagement />} />
            <Route path={"/total-admin"} element={<AdminManagement />} />
            <Route path={"/referral"} element={<Referral />} />
            <Route path={"/ico-management"} element={<IcoManagement />} />
            <Route path={"/kyc-management"} element={<KycApprove />} />
            <Route path={"/legal-updation"} element={<LegalUpdation />} />
            <Route path={"/profile"} element={<Profile />} />
            <Route path={"/withdrawal"} element={<Withdrawal />} />
            <Route path={"/support"} element={<Support />} />
            <Route path={"/support-chart/:id"} element={<SupportChart />} />
            <Route path={"/buy-history"} element={<BuyHistory />} />
            <Route path={"/wallet-management"} element={<WalletManagement />} />
            <Route path={"/setting"} element={<Setting />} />
            <Route path={"/bonus-history"} element={<BonusHistory />} />
            <Route path={"/get-user-details"} element={<Userinfo />} />
            {/* <Route path={"/share-holders"} element={<ShareHolderDashboard />} /> */}
          </Route>
        )}
        {isKycS && isWalletS && !isWithdrawalS && (
          <Route element={<PrivateRoute />}>
            <Route path={"/profile"} element={<Profile />} />
            <Route path={"/"} element={<KycApprove />} />
            <Route path={"/kyc-management"} element={<KycApprove />} />
            <Route path={"/wallet-management"} element={<WalletManagement />} />
            <Route path={"/total-user"} element={<NoAccess />} />
            <Route path={"/total-admin"} element={<NoAccess />} />
            <Route path={"/referral"} element={<NoAccess />} />
            <Route path={"/ico-management"} element={<NoAccess />} />
            <Route path={"/legal-updation"} element={<NoAccess />} />
            <Route path={"/withdrawal"} element={<NoAccess />} />
            <Route path={"/support"} element={<NoAccess />} />
            <Route path={"/support-chart/:id"} element={<NoAccess />} />
            <Route path={"/buy-history"} element={<NoAccess />} />
            <Route path={"/setting"} element={<NoAccess />} />
            <Route path={"/bonus-history"} element={<NoAccess />} />
          </Route>
        )}
        {!isKycS && isWalletS && isWithdrawalS && (
          <Route element={<PrivateRoute />}>
            <Route path={"/"} element={<Withdrawal />} />
            <Route path={"/profile"} element={<Profile />} />
            <Route path={"/wallet-management"} element={<WalletManagement />} />
            <Route path={"/withdrawal"} element={<Withdrawal />} />
            <Route path={"/total-user"} element={<NoAccess />} />
            <Route path={"/total-admin"} element={<NoAccess />} />
            <Route path={"/referral"} element={<NoAccess />} />
            <Route path={"/ico-management"} element={<NoAccess />} />
            <Route path={"/kyc-management"} element={<NoAccess />} />
            <Route path={"/legal-updation"} element={<NoAccess />} />
            <Route path={"/support"} element={<NoAccess />} />
            <Route path={"/support-chart/:id"} element={<NoAccess />} />
            <Route path={"/buy-history"} element={<NoAccess />} />
            <Route path={"/setting"} element={<NoAccess />} />
            <Route path={"/bonus-history"} element={<NoAccess />} />
          </Route>
        )}
        {isKycS && !isWalletS && isWithdrawalS && (
          <Route element={<PrivateRoute />}>
            <Route path={"/"} element={<KycApprove />} />
            <Route path={"/profile"} element={<Profile />} />
            <Route path={"/kyc-management"} element={<KycApprove />} />
            <Route path={"/withdrawal"} element={<Withdrawal />} />
            <Route path={"/total-user"} element={<NoAccess />} />
            <Route path={"/total-admin"} element={<NoAccess />} />
            <Route path={"/referral"} element={<NoAccess />} />
            <Route path={"/ico-management"} element={<NoAccess />} />
            <Route path={"/legal-updation"} element={<NoAccess />} />
            <Route path={"/support"} element={<NoAccess />} />
            <Route path={"/support-chart/:id"} element={<NoAccess />} />
            <Route path={"/buy-history"} element={<NoAccess />} />
            <Route path={"/setting"} element={<NoAccess />} />
            <Route path={"/bonus-history"} element={<NoAccess />} />
          </Route>
        )}

        {isKycS && !isWalletS && !isWithdrawalS && (
          <Route element={<PrivateRoute />}>
            <Route path={"/profile"} element={<Profile />} />
            <Route path={"/"} element={<KycApprove />} />
            <Route path={"/kyc-management"} element={<KycApprove />} />
            <Route path={"/total-user"} element={<NoAccess />} />
            <Route path={"/total-admin"} element={<NoAccess />} />
            <Route path={"/referral"} element={<NoAccess />} />
            <Route path={"/ico-management"} element={<NoAccess />} />
            <Route path={"/legal-updation"} element={<NoAccess />} />
            <Route path={"/withdrawal"} element={<NoAccess />} />
            <Route path={"/support"} element={<NoAccess />} />
            <Route path={"/support-chart/:id"} element={<NoAccess />} />
            <Route path={"/buy-history"} element={<NoAccess />} />
            <Route path={"/wallet-management"} element={<NoAccess />} />
            <Route path={"/setting"} element={<NoAccess />} />
            <Route path={"/bonus-history"} element={<NoAccess />} />
          </Route>
        )}
        {!isKycS && isWalletS && !isWithdrawalS && (
          <Route element={<PrivateRoute />}>
            <Route path={"/profile"} element={<Profile />} />
            <Route path={"/"} element={<WalletManagement />} />
            <Route path={"/wallet-management"} element={<WalletManagement />} />
            <Route path={"/total-user"} element={<NoAccess />} />
            <Route path={"/total-admin"} element={<NoAccess />} />
            <Route path={"/referral"} element={<NoAccess />} />
            <Route path={"/ico-management"} element={<NoAccess />} />
            <Route path={"/kyc-management"} element={<NoAccess />} />
            <Route path={"/legal-updation"} element={<NoAccess />} />
            <Route path={"/withdrawal"} element={<NoAccess />} />
            <Route path={"/support"} element={<NoAccess />} />
            <Route path={"/support-chart/:id"} element={<NoAccess />} />
            <Route path={"/buy-history"} element={<NoAccess />} />
            <Route path={"/setting"} element={<NoAccess />} />
            <Route path={"/bonus-history"} element={<NoAccess />} />
          </Route>
        )}
        {!isKycS && !isWalletS && isWithdrawalS && (
          <Route element={<PrivateRoute />}>
            <Route path={"/profile"} element={<Profile />} />
            <Route path={"/"} element={<Withdrawal />} />
            <Route path={"/withdrawal"} element={<Withdrawal />} />
            <Route path={"/total-user"} element={<NoAccess />} />
            <Route path={"/total-admin"} element={<NoAccess />} />
            <Route path={"/referral"} element={<NoAccess />} />
            <Route path={"/ico-management"} element={<NoAccess />} />
            <Route path={"/kyc-management"} element={<NoAccess />} />
            <Route path={"/legal-updation"} element={<NoAccess />} />
            <Route path={"/support"} element={<NoAccess />} />
            <Route path={"/support-chart/:id"} element={<NoAccess />} />
            <Route path={"/buy-history"} element={<NoAccess />} />
            <Route path={"/wallet-management"} element={<NoAccess />} />
            <Route path={"/setting"} element={<NoAccess />} />
            <Route path={"/bonus-history"} element={<NoAccess />} />
          </Route>
        )}
        {permissions?.length > 2 && isKycS && isWalletS && isWithdrawalS && (
          <Route element={<PrivateRoute />}>
            <Route path={"/profile"} element={<Profile />} />
            <Route path={"/"} element={<KycApprove />} />
            <Route path={"/kyc-management"} element={<KycApprove />} />
            <Route path={"/wallet-management"} element={<WalletManagement />} />
            <Route path={"/withdrawal"} element={<Withdrawal />} />
            <Route path={"/total-user"} element={<NoAccess />} />
            <Route path={"/total-admin"} element={<NoAccess />} />
            <Route path={"/referral"} element={<NoAccess />} />
            <Route path={"/ico-management"} element={<NoAccess />} />
            <Route path={"/legal-updation"} element={<NoAccess />} />
            <Route path={"/support"} element={<NoAccess />} />
            <Route path={"/support-chart/:id"} element={<NoAccess />} />
            <Route path={"/buy-history"} element={<NoAccess />} />
            <Route path={"/setting"} element={<NoAccess />} />
            <Route path={"/bonus-history"} element={<NoAccess />} />
          </Route>
        )}

        <Route element={<PublicRoute />}>
          <Route path={"/login"} element={<Login />} />
        </Route>
        <Route path="*" element={<Navigate to={"/"} replace />} />
      </Routes>
    </>
  );
};

export default App;
