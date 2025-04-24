import React, { useEffect, useState } from "react";
import DashboardLayout from "../Layout/DashboardLayout";
import { ClipLoader } from "react-spinners";

import {
  useEditSettingsMutation,
  useSettingstDataQuery,
} from "../features/settings/settingsApiSlice";
import { toast } from "react-toastify";

const Setting = () => {
  const {
    data: setting,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useSettingstDataQuery();
  console.log({ setting });

  const [settings, setSettings] = useState({
    min_withdrawal_inr: "",
    max_withdrawal_inr: "",
    withdrawal_commission_inr: "",
    buy_min_price_jaimax_inr: "",
    buy_max_price_jaimax_inr: "",
    min_withdrawal_usd: "",
    max_withdrawal_usd: "",
    withdrawal_commission_usd: "",
    buy_min_price_jaimax_usd: "",
    buy_max_price_jaimax_usd: "",
    launched_inr_price: "",
    launched_usd_price: "",
    referral_percentage: "",
    usd_to_inr_price: "",
  });

  const handleOnchange = (e) => {
    let { name, value } = e.target;
    console.log(name);
    value = value.replace(/[^0-9. ]/g, "");

    setSettings({ ...settings, [name]: value });
  };

  const getSettings = () => {
    if (isSuccess) {
      setSettings({ ...settings, ...setting?.data });
    }
  };

  const [update, { data: result, isLoading: load }] = useEditSettingsMutation();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await update(settings);
      if (response?.data?.success) {
        toast.success(`${response?.data?.message || "Update successful!"}`, {
          position: "top-center",
        });
      } else {
        toast.error(`${response?.error?.data?.message}`, {
          position: "top-center",
        });
      }
    } catch (error) {
      console.log("error", error);
      toast.error(`${error?.data?.message}`, {
        position: "top-center",
      });
    }
  };
  useEffect(() => {
    getSettings();
  }, [isSuccess]);

  return (
    <div>
      <DashboardLayout>
        <section className="setting_sec">
          <div className="container-fluid">
            <div className="col-12 col-md-12 col-xxl-5">
              <div className="p-3 px-4 cus_form_row rounded-3">
                <h1 className="heading mb-4">Software Setting</h1>
              </div>
            </div>
            {isLoading ? (
              <div
                className="d-flex justify-content-center align-items-center flex-column"
                style={{ height: "85vh" }}
              >
                <ClipLoader size={80} color={"white"} loading={isLoading} />
                <span className="text-light font-wright-lighter mt-1">
                  Please wait until loading ...
                </span>
              </div>
            ) : (
              <div className="row justify-content-center">
                <div className="col-md-12 col-lg-12 col-xl-12">
                  <div className="p-3 px-4 cus_form_row rounded-3 my-1">
                    <form onSubmit={handleFormSubmit} className="row">
                      {/* INR Section */}
                      <div className="col-md-6">
                        <p className="text-light font-weight-lighter">
                          All values are in INR <span className="error">*</span>
                        </p>
                        {[
                          {
                            label: "Min Buy Amount",
                            name: "buy_min_price_jaimax_inr",
                          },
                          {
                            label: "Max Buy Amount",
                            name: "buy_max_price_jaimax_inr",
                          },
                          {
                            label: "Min Withdrawal Amount",
                            name: "min_withdrawal_inr",
                          },
                          {
                            label: "Max Withdrawal Amount",
                            name: "max_withdrawal_inr",
                          },
                          {
                            label: "Withdrawal Fees (%)",
                            name: "withdrawal_commission_inr",
                          },
                          {
                            label: "Referral Percentage",
                            name: "referral_percentage",
                          },
                        ].map((item) => (
                          <div className="col-md-12" key={item.name}>
                            <div className="form__box mb-3">
                              <label htmlFor={item.name}>{item.label}</label>
                              <input
                                type="text"
                                autoComplete="off"
                                className="form-control shadow-none"
                                value={settings[item.name]}
                                name={item.name}
                                onChange={handleOnchange}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* USD Section */}
                      <div className="col-md-6">
                        <p className="text-light font-weight-lighter ">
                          All values are in USD <span className="error">*</span>
                        </p>
                        {[
                          {
                            label: "Min Buy Amount",
                            name: "buy_min_price_jaimax_usd",
                          },
                          {
                            label: "Max Buy Amount",
                            name: "buy_max_price_jaimax_usd",
                          },
                          {
                            label: "Min Withdrawal Amount",
                            name: "min_withdrawal_usd",
                          },
                          {
                            label: "Max Withdrawal Amount",
                            name: "max_withdrawal_usd",
                          },
                          {
                            label: "Withdrawal Fees (%)",
                            name: "withdrawal_commission_usd",
                          },
                          {
                            label: "USD to INR Price",
                            name: "usd_to_inr_price",
                          },
                        ].map((item) => (
                          <div className="col-md-12" key={item.name}>
                            <div className="form__box mb-3">
                              <label htmlFor={item.name}>{item.label}</label>
                              <input
                                type="text"
                                autoComplete="off"
                                className="form-control shadow-none"
                                value={settings[item.name]}
                                name={item.name}
                                onChange={handleOnchange}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      {load ? (
                        <div className="col-md-12 text-center mt-5 mb-4">
                          <button
                            className="btn_submit rounded-2 px-3 py-2"
                            type="button"
                            disabled
                          >
                            <span
                              className="spinner-border spinner-border-sm mx-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Loading...
                          </button>
                        </div>
                      ) : (
                        <div className="col-md-12 text-center mt-5 mb-4">
                          <button
                            type="submit"
                            className="btn_submit rounded-2 px-3 py-2"
                          >
                            Submit
                          </button>
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </DashboardLayout>
    </div>
  );
};

export default Setting;
