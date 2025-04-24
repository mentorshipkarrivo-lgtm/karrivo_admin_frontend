import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "./authApiSlice";
import { toast } from "react-toastify";

import hide from "/images/icons/hide.svg";
import show from "/images/icons/show.svg";
import { MyContext } from "./AuthContext";

const LoginForm = () => {
  const { data, setData } = useContext(MyContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    loginEmail: "",
    loginPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(hide);
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    if (refresh) {
      setRefresh(false);
    }
  }, [refresh]);
  // toggle Password hide and show
  const togglePassword = () => {
    if (type == "password") {
      setIcon(show);
      setType("text");
    } else {
      setIcon(hide);
      setType("password");
    }
  };
  let permissions = [];
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    let formErrors = {};
    const emailRegex =
      /^[^\W_](?:[\w.-]*[^\W_])?@(?:\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.|(?:[\w-]+\.)+)(?:[a-zA-Z]{2,3}|[0-9]{1,3})\]?$/gm;

    //email validation
    if (!formData.loginEmail) {
      formErrors.loginEmail = "Email is required";
    } else if (!emailRegex.test(formData.loginEmail)) {
      formErrors.loginEmail = "Invalid email format";
    }

    // Password validation
    if (!formData.loginPassword) {
      formErrors.loginPassword = "Password is required";
    } else if (formData.loginPassword.length < 6) {
      formErrors.loginPassword = "Password must be at least 6 characters";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await login({
          email: formData.loginEmail,
          password: formData.loginPassword,
          role: 0,
        }).unwrap();
        toast.success(`${response?.message}`, {
          position: "top-center",
        });
        setRefresh(true);
        localStorage.setItem("token", response?.data?.token);
        localStorage.setItem("userData", JSON.stringify(response));
        localStorage.setItem("username", response?.data?.username);
        const userDataString = localStorage.getItem("userData");
        localStorage.setItem("permissions", permissions);
        const userData = JSON.parse(userDataString);
        permissions = userData?.data?.permissions;
        const isKycS = permissions?.includes("KYC MANAGEMENT");
        const isWalletS = permissions?.includes("WALLET MANAGEMENT");
        const isWithdrawalS = permissions?.includes("WITHDRAW MANAGEMENT");
        const arr1 = ["KYC MANAGEMENT", "WALLET MANAGEMENT"];
        const isKyc = permissions?.every((i) => arr1.includes(i));
        const arr2 = ["WALLET MANAGEMENT", "WITHDRAW MANAGEMENT"];
        const isWallet = permissions?.every((i) => arr2.includes(i));
        const arr3 = ["WITHDRAW MANAGEMENT", "KYC MANAGEMENT"];
        const isWithdrawal = permissions?.every((i) => arr3.includes(i));
        setRefresh(true);
        localStorage.setItem("User Roles", isKycS);
        console.log(isKycS + " <><> " + isWalletS + " <><> " + isWithdrawalS);
        if (isKycS && isWalletS && !isWithdrawalS) {
          setTimeout(() => {
            setRefresh(true);
            navigate("/kyc-management");
          }, 1000);
        } else if (!isKycS && isWalletS && isWithdrawalS) {
          setRefresh(true);
          setTimeout(() => {
            navigate("/withdrawal");
          }, 1000);
        } else if (isKycS && !isWalletS && isWithdrawalS) {
          setRefresh(true);
          setTimeout(() => {
            navigate("/kyc-management");
          }, 1000);
        } else if (isKycS && !isWalletS && !isWithdrawalS) {
          setRefresh(true);
          setTimeout(() => {
            navigate("/kyc-management");
          }, 1000);
        } else if (!isKycS && isWalletS && !isWithdrawalS) {
          setRefresh(true);
          setTimeout(() => {
            navigate("/wallet-management");
          }, 1000);
        } else if (!isKycS && !isWalletS && isWithdrawalS) {
          setRefresh(true);
          setTimeout(() => {
            navigate("/withdrawal");
          }, 1000);
        } else if (isKycS && isWalletS && isWithdrawalS) {
          setRefresh(true);
          setTimeout(() => {
            navigate("/kyc-management");
          }, 1000);
        } else {
          setRefresh(true);
          setTimeout(() => {
            navigate("/");
          }, 1000);
        }
      } catch (error) {
        console.log(error);
        toast.error(`${error?.data?.message}`, {
          position: "top-center",
        });
      }
    }
  };

  return (
    <div>
      <section className="auth_sec">
        <div className="container-fluid">
          <div className="row justify-content-center justify-content-md-start px-xl-4 mx-xl-4 px-xxl-5 mx-xxl-5">
            <div className="col-12 col-sm-10 col-md-6 col-xl-5 col-xxl-4">
              <div className="auth_form p-3 pt-4 p-xxl-5 rounded-2">
                <div className="login_heading mb-4 mb-xxl-5 text-center">
                  <h2>Welcome to Jaimax Coin</h2>
                </div>
                <form className="auth_form_data pb-4 pb-md-5">
                  <div className="mb-3">
                    <label htmlFor="text" className="form-label">
                      Email Id
                    </label>
                    <input
                      type="email"
                      className="form-control rounded-1 shadow-none border-0"
                      name="loginEmail"
                      autoComplete="off"
                      value={formData.loginEmail}
                      onChange={handleChange}
                    />
                    {errors.loginEmail && (
                      <div className="error_cls">{errors.loginEmail}</div>
                    )}
                  </div>
                  <div className="mb-4">
                    <label htmlFor="text" className="form-label">
                      Password
                    </label>
                    <div className="input-group otp_box rounded-1">
                      <input
                        type={type}
                        autoComplete="off"
                        className="form-control rounded-1 shadow-none border-0"
                        name="loginPassword"
                        value={formData.loginPassword}
                        onChange={handleChange}
                      />
                      <span className="input-group-text bg-transparent border-0">
                        <img
                          src={icon}
                          alt="eye-icon"
                          className="img-fluid"
                          onClick={togglePassword}
                          style={{ cursor: "pointer" }}
                        />
                      </span>
                    </div>

                    {errors.loginPassword && (
                      <div className="error_cls">{errors.loginPassword}</div>
                    )}
                  </div>

                  <div className="submit_btn text-center">
                    <button
                      onClick={handleLogin}
                      type="submit"
                      className="btns border-0 w-100 mb-2 rounded-5"
                      disabled={isLoading}
                    >
                      {isLoading ? "Loading..." : "Login"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const Login = () => {
  return <LoginForm />;
};

export default Login;
