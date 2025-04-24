import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import hide from "/images/icons/hide.svg";
import show from "/images/icons/show.svg";
import countryCodes from "../components/countryCodes.json";
import "./profile.css";

import DashboardLayout from "../Layout/DashboardLayout";
import {
  useChangePwdMutation,
  useChangePwdReqMutation,
  useUpdateAddressMutation,
  useUserDataQuery,
  useVerifyMutation,
} from "../features/user/userApiSlice";

const Profile = () => {
  const [formData, setFormData] = useState({
    password: "",
    newPassword: "",
    confirmPwd: "",
    otp: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(180);
  const [resendOtp, setResendOtp] = useState(false);
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [errors, setErrors] = useState({});
  const [changePwd, { isLoading }] = useChangePwdMutation();
  const [changePwdReq] = useChangePwdReqMutation();
  const [verify, { isLoading: isVerifying }] = useVerifyMutation();
  const [update] = useUpdateAddressMutation();

  const [type, setType] = useState("password");
  const [type2, setType2] = useState("password");
  const [icon, setIcon] = useState(hide);
  const [icon2, setIcon2] = useState(hide);
  const [type3, setType3] = useState("password");
  const [icon3, setIcon3] = useState(hide);
  const [profileImage, setProfileImage] = useState("");

  const [otpVerified, setOtpVerified] = useState(false);
  const { data: userData } = useUserDataQuery();
  const profileRef = useRef(null);
  const [state, setState] = useState({
    name: userData?.data?.name || "",
    _id: userData?.data?._id || "",
    email: userData?.data?.email || "",
    phone: userData?.data?.phone || "",
    address: userData?.data?.address || "",
    city: userData?.data?.city || "",
    country: userData?.data?.country || "",
    state: userData?.data?.state || "",
    profile: userData?.data?.profile || "",
  });

  useEffect(() => {
    setState({
      name: userData?.data?.name || "",
      _id: userData?.data?._id || "",
      email: userData?.data?.email || "",
      phone: userData?.data?.phone || "",
      address: userData?.data?.address || "",
      city: userData?.data?.city || "",
      country: userData?.data?.country || "",
      state: userData?.data?.state || "",
      profile: userData?.data?.profile || "",
    });
    if (userData?.data?.profile) {
      localStorage.setItem("profile", userData?.data?.profile);
    } else {
      localStorage.removeItem("profile");
    }
  }, [userData]);

  const validateForm = () => {
    let formErrors = {};
    const phoneRegex = /^[0-9]{6,12}$/;

    if (!state.name.trim()) {
      formErrors.name = "Name is required";
    }

    if (!state.phone.toString().trim()) {
      formErrors.phone = "Mobile number is required";
    } else if (!phoneRegex.test(state.phone)) {
      formErrors.phone = "Invalid mobile number format";
    }
    if (!state.address.trim()) {
      formErrors.address = "Address is required";
    }

    if (!state.city.trim()) {
      formErrors.city = "City is required";
    }
    if (!state.country.trim()) {
      formErrors.country = "Country is required";
    }
    if (!state.state.trim()) {
      formErrors.state = "State is required";
    }
    return formErrors;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    const acceptedFormats = ["image/png", "image/jpeg", "image/jpg"];
    const invalidFile = !acceptedFormats.includes(file.type);
    if (invalidFile) {
      toast.warning("Only JPG / PNG files are allowed", {
        position: "top-center",
      });
      profileRef.current.value = "";
    } else {
      const imageUrl = URL.createObjectURL(file);
      setState((prevState) => ({
        ...prevState,
        profile: file,
      }));
      setProfileImage(imageUrl); // Set the blob URL for display
    }
  };

  const currentImage = () => {
    if (profileImage) {
      return profileImage;
    } else if (state.profile) {
      return state.profile;
    } else {
      return "/images/user_logo.png";
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const formData = new FormData();

        formData.append("name", state.name);
        formData.append("_id", state._id);
        formData.append("email", state.email);
        formData.append("phone", state.phone);
        formData.append("address", state.address);
        formData.append("city", state.city);
        formData.append("country", state.country);
        formData.append("state", state.state);

        // Append profile picture only if it exists
        if (state.profile instanceof File) {
          formData.append("profile", state.profile);
        }

        // Send FormData using the update function
        const res = await update(formData);

        if (res?.data?.status_code == 200) {
          toast.success(res?.data?.message, {
            position: "top-center",
          });
        }
      } catch (error) {
        toast.error(error?.message, {
          position: "top-center",
        });
      }
    }
  };

  const togglePassword = () => {
    if (type === "password") {
      setIcon(show);
      setType("text");
    } else {
      setIcon(hide);
      setType("password");
    }
  };

  const togglePassword2 = () => {
    if (type2 === "password") {
      setIcon2(show);
      setType2("text");
    } else {
      setIcon2(hide);
      setType2("password");
    }
  };

  const togglePassword3 = () => {
    if (type3 === "password") {
      setIcon3(show);
      setType3("text");
    } else {
      setIcon3(hide);
      setType3("password");
    }
  };

  useEffect(() => {
    let countdown;
    if (otpSent && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setResendOtp(true);
    }
    return () => clearInterval(countdown);
  }, [otpSent, timer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateOldPassword = () => {
    let formErrors = {};

    if (!formData.password) {
      formErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      formErrors.password = "Password must be at least 6 characters";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const validateNewPassword = () => {
    let formErrors = {};

    if (!formData.newPassword) {
      formErrors.newPassword = "New Password is required";
    } else if (formData.newPassword.length < 6) {
      formErrors.newPassword = "Password must be at least 6 characters";
    }

    if (formData.newPassword !== formData.confirmPwd) {
      formErrors.confirmPwd = "Passwords do not match";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const validateOtp = () => {
    let formErrors = {};
    const numberRegex = /^[0-9]+$/;
    if (!formData.otp) {
      formErrors.otp = "OTP is required";
    } else if (!numberRegex.test(formData.otp)) {
      formErrors.otp = "OTP must be a number";
    } else if (formData.otp.length < 4) {
      formErrors.otp = "OTP must be 4 Numbers";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleVerify = async () => {
    if (validateOldPassword()) {
      try {
        const payload = {
          password: formData.password,
        };
        await changePwdReq(payload).unwrap();
        toast.success(`OTP sent to your email`, {
          position: "top-center",
        });
        setOtpSent(true);
      } catch (error) {
        toast.error(`${error?.data?.message}`, {
          position: "top-center",
        });
      }
    }
  };

  const verifyOtpAndShowNewPasswordFields = async () => {
    if (validateOtp()) {
      try {
        const payload = {
          email: userData?.data?.email,
          otp: Number(formData.otp),
          otpType: "ChangePassword",
        };
        await verify(payload).unwrap();
        toast.success(`OTP verified successfully`, {
          position: "top-center",
        });
        setOtpVerified(true);
        setResendOtp(true);
      } catch (error) {
        toast.error(`${error?.data?.message}`, {
          position: "top-center",
        });
      }
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (validateNewPassword()) {
      try {
        const payload = {
          password: formData.password,
          newPassword: formData.newPassword,
          email: userData?.data?.email,
        };
        const res = await changePwd(payload).unwrap();
        toast.success(`${res?.message}`, {
          position: "top-center",
        });
        setFormData({
          password: "",
          newPassword: "",
          confirmPwd: "",
          otp: "",
        });
        setOtpSent(false);
        setOtpVerified(false);
      } catch (error) {
        toast.error(`${error?.data?.message}`, {
          position: "top-center",
        });
      }
    }
  };

  return (
    <DashboardLayout>
      <section className="profile_section py-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 col-md-7">
              <form>
                <div className=" container rounded-3 details">
                  <div className="row  position-relative">
                    <div className="col-12 p-5 p-xl-1 col-xl-3 profilePic_section d-flex justify-content-center align-items-center">
                      <div className="d-flex flex-column align-items-center gap-3">
                        <div className="d-flex justify-content-center">
                          <img
                            src={currentImage()}
                            alt="user_image"
                            className="img-fluid z-2 pt-xl-0 mx-auto"
                            style={{
                              width: "100px",
                              height: "100px",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                        </div>

                        <label
                          htmlFor="fileInput"
                          style={{ cursor: "pointer" }}
                        >
                          <p className="text-white text-center mx-auto fs-6 m-0 text-wrap text-break profile_label">
                            Upload Profile Picture
                          </p>
                        </label>
                        <input
                          id="fileInput"
                          type="file"
                          ref={profileRef}
                          accept=".png,.jpg,.jpeg"
                          style={{ display: "none" }}
                          onChange={handleImageChange}
                        />
                      </div>
                    </div>

                    <div className="col-12 col-xl-9">
                      <div className="personal_details_content p-3 py-4 w-100">
                        <h1 className="mb-3">Personal Details</h1>
                        <div className="mb-3">
                          <label htmlFor="text" className="form-label">
                            Name <span className="error">*</span>
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className="form-control shadow-none"
                            placeholder="Enter Your Name"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            value={state.name}
                            name="name"
                            onChange={handleChange}
                          />
                          {errors.name && (
                            <div className="error_cls">{errors.name}</div>
                          )}
                        </div>
                        <div className="mb-3">
                          <label htmlFor="text" className="form-label">
                            Email <span className="error">*</span>
                          </label>
                          <input
                            type="email"
                            className="form-control shadow-none"
                            placeholder="Enter Your Email"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            value={state.email}
                            name="email"
                            style={{ opacity: "0.7" }}
                            onChange={handleChange}
                            disabled
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="text" className="form-label">
                            Mobile Number <span className="error">*</span>
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className="form-control shadow-none"
                            placeholder="Enter your Mobile number"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            value={state.phone}
                            name="phone"
                            onChange={handleChange}
                            onKeyPress={(event) => {
                              if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                              }
                            }}
                          />
                          {errors.phone && (
                            <div className="error_cls">{errors.phone}</div>
                          )}
                        </div>
                        <div className="mb-4">
                          <label htmlFor="text" className="form-label">
                            Address <span className="error">*</span>
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className="form-control shadow-none"
                            placeholder="Enter Your Address"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            value={state.address}
                            name="address"
                            onChange={handleChange}
                          />
                          {errors.address && (
                            <div className="error_cls">{errors.address}</div>
                          )}
                        </div>
                        <div className="mb-3">
                          <label htmlFor="text" className="form-label">
                            City <span className="error">*</span>
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className="form-control shadow-none"
                            placeholder="Enter Your City"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            value={state.city}
                            name="city"
                            onChange={handleChange}
                          />
                          {errors.city && (
                            <div className="error_cls">{errors.city}</div>
                          )}
                        </div>
                        <div className="mb-3">
                          <label htmlFor="text" className="form-label">
                            State <span className="error">*</span>
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className="form-control shadow-none"
                            placeholder="Enter Your State"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            value={state.state}
                            name="state"
                            onChange={handleChange}
                          />
                          {errors.state && (
                            <div className="error_cls">{errors.state}</div>
                          )}
                        </div>
                        <div className="mb-3">
                          <label htmlFor="text" className="form-label">
                            Country <span className="error">*</span>
                          </label>
                          <select
                            className="form-control shadow-none"
                            name="country"
                            value={state.country}
                            onChange={handleChange}
                            disabled
                            style={{ opacity: "0.7" }}
                          >
                            {countryCodes.map(({ country_name }) => (
                              <option key={country_name} value={country_name}>
                                {country_name}
                              </option>
                            ))}
                          </select>
                          {errors.country_name && (
                            <div className="error_cls">
                              {errors.country_name}
                            </div>
                          )}
                        </div>

                        <div className="text-center mt-4">
                          <button
                            type="submit"
                            className="btn btn-primary border-0 px-4"
                            onClick={handleUpdate}
                            style={{ background: "var(--orange)" }}
                          >
                            Update
                          </button>
                        </div>
                        {/* <button
                          type="submit"
                          className="btn btn-warning"
                          style={{backgroundColor:""}}
                          onClick={handleUpdate}
                          disabled={updateLoader}
                        >
                          {updateLoader ? (
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          ) : (
                            "Update"
                          )}
                        </button> */}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="col-12 col-md-5">
              <div className="password_box p-4 rounded-3">
                <h1 className="mb-4">Change Password</h1>
                <form>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Current Password
                    </label>
                    <div className="input-group">
                      <input
                        type={type}
                        className="form-control shadow-none rounded-0"
                        placeholder="Enter current password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        readOnly={otpVerified}
                      />
                      <span
                        className="input-group-text text-white border-0 rounded-0"
                        style={{ background: "var(--orange)" }}
                      >
                        <button
                          type="button"
                          className="btn p-0 m-0 border-0 "
                          disabled={otpVerified}
                          onClick={togglePassword}
                        >
                          <img src={icon} alt="toggle visibility" />
                        </button>
                      </span>
                    </div>
                    {errors.password && (
                      <div className="error_cls">{errors.password}</div>
                    )}
                  </div>
                  <div className="d-flex justify-content-between">
                    <div className="col-12">
                      <div className="mb-4">
                        <label htmlFor="OTP" className="form-label">
                          OTP
                        </label>
                        <div className="input-group rounded-1 otp_box">
                          <input
                            type="text"
                            autoComplete="off"
                            className="form-control rounded-0 shadow-none "
                            name="otp"
                            placeholder="Enter OTP"
                            value={formData.otp}
                            onChange={(e) =>
                              setFormData({ ...formData, otp: e.target.value })
                            }
                            readOnly={otpVerified}
                          />
                          {!otpVerified && (
                            <>
                              <span
                                className="input-group-text text-white border-0 rounded-0"
                                style={{
                                  background: "var(--orange)",
                                  fontSize: "14px",
                                  cursor:
                                    otpSent && !resendOtp
                                      ? "not-allowed"
                                      : "pointer",
                                }}
                              >
                                <button
                                  type="button"
                                  className="btn p-0 border-0 text-white"
                                  onClick={
                                    !otpSent || resendOtp ? handleVerify : null
                                  }
                                  disabled={otpSent && !resendOtp}
                                >
                                  {isOtpSending
                                    ? "Sending..."
                                    : otpSent && !resendOtp
                                    ? `Resend OTP in ${Math.floor(
                                        timer / 60
                                      )}:${
                                        timer % 60 < 10
                                          ? `0${timer % 60}`
                                          : timer % 60
                                      }`
                                    : "Get OTP"}
                                </button>
                              </span>
                            </>
                          )}
                        </div>
                        {errors.OTP && (
                          <div className="error_cls">{errors.OTP}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {otpVerified && (
                    <>
                      <div className="mb-3">
                        <label htmlFor="newPassword" className="form-label">
                          New Password
                        </label>
                        <div className="input-group">
                          <input
                            type={type2}
                            className="form-control shadow-none rounded-0"
                            placeholder="Enter new password"
                            value={formData.newPassword}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                newPassword: e.target.value,
                              })
                            }
                          />
                          <span
                            className="input-group-text text-white border-0 rounded-0"
                            style={{ backgroundColor: "var(--orange)" }}
                          >
                            <button
                              type="button"
                              className="btn p-0 border-0 text-white"
                              onClick={togglePassword2}
                            >
                              <img src={icon2} alt="toggle visibility" />
                            </button>
                          </span>
                        </div>
                        {errors.newPassword && (
                          <div className="error_cls">{errors.newPassword}</div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label htmlFor="confirmPwd" className="form-label">
                          Confirm Password
                        </label>
                        <div className="input-group">
                          <input
                            type={type3}
                            className="form-control shadow-none rounded-0"
                            placeholder="Confirm new password"
                            value={formData.confirmPwd}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                confirmPwd: e.target.value,
                              })
                            }
                          />
                          <span
                            className="input-group-text text-white border-0 rounded-0"
                            style={{ backgroundColor: "var(--orange)" }}
                          >
                            <button
                              type="button"
                              className="btn p-0 border-0 text-white"
                              onClick={togglePassword3}
                            >
                              <img src={icon3} alt="toggle visibility" />
                            </button>
                          </span>
                        </div>
                        {errors.confirmPwd && (
                          <div className="error_cls">{errors.confirmPwd}</div>
                        )}
                      </div>
                    </>
                  )}

                  <div className="text-center mt-4">
                    <button
                      type="button"
                      className="btn btn-primary border-0"
                      style={{ background: "var(--orange)" }}
                      onClick={
                        otpVerified
                          ? changePassword
                          : verifyOtpAndShowNewPasswordFields
                      }
                      disabled={isLoading || isVerifying}
                    >
                      {otpVerified ? "Change Password" : "Verify OTP"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default Profile;
