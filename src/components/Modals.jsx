import React, { useContext, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import {
  useKycUpdateMutation,
  useGetkycDetailsQuery,
} from "../features/kyc/kycApiSlice";
import { toast } from "react-toastify";
import { useSendTransactionMutation } from "../features/user/userApiSlice";
import { MyContext } from "../features/auth/AuthContext";
import { StateContext } from "../context/StateContext";
import { useGetShareHoldersQuery } from "../features/shareHolders/shareHoldersApiSlice"; 

const Modals = ({
  show,
  setShow,
  deleteModal,
  deleteModal3,    
  setDeleteModal,
  setDeleteModal2,
  deleteModal1,
  setDeleteModal1,
  check,
  setCheck,
  check1,
  setCheck1,
  handleApprove,
  handleReject,
  handleTransactionSubmit,
  handleCheckClose2,
  check2,
  setCheck2,
  deleteModal2,

  // formData,
  id,
}) => {
  // const [amount, setAmount] = useState('');
  // const [transactionType, setTransactionType] = useState('');
  const [sendTransaction] = useSendTransactionMutation();
  // const [loading,setLoading] = useState("false");
  const { amount, setAmount, transactionType, setTransactionType } =
    useContext(StateContext);

  // console.log({id})
  let image_url = import.meta.env.VITE_IMAGE_URL;

  const [approveKyc] = useKycUpdateMutation();
  const handleClose = () => setShow(false);

  const handleCheck1 = () => {
    setCheck1(false);
    setAmount("");
  };
  // const handleCheck2 = () => setCheck2(false);

  const handleDeleteClose = () => setDeleteModal(false);
  const handleDeleteClose1 = () => setDeleteModal1(false);
  const handleDeleteClose2 = () => setCheck2(false);

  const handleCheckClose = () => setCheck(false);
  const [reasons, setReason] = useState("");
  const capitalizeFirstLetter = (str) => {
    if (!str) return ""; // Handle empty strings or undefined
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const handleKyc = async (val) => {
    try {
      if (val == "approve") {
        const data = { id: id, status: val };
        const res = await approveKyc(data);
        if (res?.data?.status_code == 200) {
          handleCheckClose(true);
          toast.success(res?.data?.message, {
            position: "top-center",
          });
        } else {
          handleCheckClose(true);

          toast.error(res?.error?.data?.message, {
            position: "top-center",
          });
        }
      } else if (val == "reject") {
        const data = { id: id, status: val, reason: reasons };
        if (data?.reason == "") {
          toast.error("Please enter a reason ", {
            position: "top-center",
          });
        } else {
          const res = await approveKyc(data);
          if (res?.data?.status_code == 200) {
            setReason("");

            // handleDeleteClose(true);
            handleDeleteClose1(true);
            toast.success(res?.data?.message, {
              position: "top-center",
            });
          } else {
            handleDeleteClose1(true);

            toast.error(res?.error?.data?.message, {
              position: "top-center",
            });
            setReason("");
          }
        }
      }
    } catch (error) {
      toast.error(error?.message, {
        position: "top-center",
      });
    }
  };
  let aadharStatus = id?.hasOwnProperty("aadhar_doc_front");
  console.log(aadharStatus);
  let aadhar_front_image = id?.aadhar_doc_front ?? "";
  let aadhar_back_image = id?.aadhar_doc_back ?? "";
  let dl_front_image = id?.dl_doc_front ?? "";
  let dlStatus = id?.hasOwnProperty("dl_doc_front");
  let dl_back_image = id?.dl_doc_back ?? "";
  let passportStatus = id?.hasOwnProperty("passport_doc_front");
  let passport_front_image = id?.passport_doc_front ?? "";
  let passport_back_image = id?.passport_doc_back ?? "";
  let pancard_image = id?.pan_doc_front ?? "";
  let pancardStatus = id?.hasOwnProperty("pan_doc_front");
  const handleTransactionDelete = async (e, transactionType, amount) => {
    e.preventDefault();
    setAmount("");
    setTransactionType("");
    try {
      setCheck1(false);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };
  const amountInput = (e) => {
    const value = e.target.value;
    setAmount(value);
  };
  return (
    <div>
      <Modal
        className="support_modal"
        show={show}
        backdrop="static"
        centered
        id="close-btns"
        size="xl"
        onHide={handleClose}
      >
        <Modal.Header className=" border_bottom shadow-none" closeButton>
          <Modal.Title>View Kyc</Modal.Title>
        </Modal.Header>
        <Modal.Body className="create_data pt-2">
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="mb-3">
                {aadhar_front_image != "" ? (
                  <label htmlFor="text" className="form-label">
                    Browse front and back side of Aadhaar Card{" "}
                    <span className="error">*</span>
                  </label>
                ) : (
                  <label htmlFor="text" className="form-label">
                    Browse front and back side of Driving License{" "}
                    <span className="error">*</span>
                  </label>
                )}
                <div className="mb-2 d-flex gap-2">
                  {/* <span>
                    <img
                      src={`http://${id?.doc_front}`}
                      alt="aadhaar"
                      className="img-fluid"
                    />
                  </span> */}
                  {aadhar_front_image != "" ? (
                    <div class="col">
                      {aadhar_front_image ? (
                        <img
                          src={`${aadhar_front_image}`}
                          alt="aadhaar-front"
                          className="w-100 h-100 img-fluid"
                        />
                      ) : (
                        <span>No image found</span>
                      )}
                    </div>
                  ) : (
                    <div class="col">
                      {dl_front_image ? (
                        <img
                          src={`${dl_front_image}`}
                          alt="aadhaar-front"
                          className="w-100 h-100 img-fluid"
                        />
                      ) : (
                        <span>No image found</span>
                      )}
                    </div>
                  )}
                  {aadhar_back_image != "" ? (
                    <div class="col">
                      {aadhar_back_image ? (
                        <img
                          src={`${aadhar_back_image}`}
                          alt="aadhaar-back"
                          className="w-100 h-100 img-fluid"
                        />
                      ) : (
                        <span>No image found</span>
                      )}
                    </div>
                  ) : (
                    <div class="col">
                      {dl_back_image ? (
                        <img
                          src={`${dl_back_image}`}
                          alt="dl-back"
                          className="w-100 h-100 img-fluid"
                        />
                      ) : (
                        <span>No image found</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="mb-3">
                {pancard_image ? (
                  <label htmlFor="text" className="form-label">
                    {" "}
                    Browse PAN Card <span className="error">*</span>
                  </label>
                ) : (
                  <label htmlFor="text" className="form-label">
                    {" "}
                    Browse front and back side of Passport{" "}
                    <span className="error">*</span>
                  </label>
                )}

                <div className="mb-2 d-flex gap-2">
                  {/* <span>
                    <img
                      src={`http://${id?.doc_front1}`}
                      alt="pan"
                      className="img-fluid"
                    />
                  </span>
                   */}
                  {pancard_image != "" ? (
                    <div class="col">
                      {pancard_image ? (
                        <img
                          src={`${pancard_image}`}
                          alt="pan"
                          className="img-fluid w-100 h-100"
                        />
                      ) : (
                        <span>No image found</span>
                      )}
                    </div>
                  ) : (
                    <div class="col">
                      {passport_front_image ? (
                        <img
                          src={`${passport_front_image}`}
                          alt="Passport"
                          className="img-fluid w-100 h-100"
                        />
                      ) : (
                        <span>No image found</span>
                      )}
                    </div>
                  )}

                  {pancard_image != "" ? (
                    <div class="col"></div>
                  ) : (
                    <div class="col">
                      {passport_back_image ? (
                        <img
                          src={`${passport_back_image}`}
                          alt="Passport"
                          className="img-fluid w-100 h-100"
                        />
                      ) : (
                        <span>No image found</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="mb-3">
                <label htmlFor="text" className="form-label">
                  Applicants <span className="error">*</span>
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  className="form-control shadow-none"
                  placeholder={id?.name}
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  disabled
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="mb-3">
                <label htmlFor="text" className="form-label">
                  Mobile Number <span className="error">*</span>
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  className="form-control shadow-none"
                  placeholder={id?.mobile_number}
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  disabled
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="mb-3">
                <label htmlFor="text" className="form-label">
                  Address <span className="error">*</span>
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  className="form-control shadow-none"
                  placeholder={id?.address}
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  disabled
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="mb-3">
                <label htmlFor="text" className="form-label">
                  UPI Number <span className="error">*</span>
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  className="form-control shadow-none"
                  placeholder={id?.upi_id}
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  disabled
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="mb-3">
                <label htmlFor="text" className="form-label">
                  Bank Account Number <span className="error">*</span>
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  className="form-control shadow-none"
                  placeholder={id?.bank_account}
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  disabled
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="mb-3">
                <label htmlFor="text" className="form-label">
                  Status <span className="error">*</span>
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  className="form-control shadow-none"
                  placeholder={capitalizeFirstLetter(id?.status)}
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  disabled
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="mb-3">
                <label htmlFor="text" className="form-label">
                  Bank Name<span className="error">*</span>
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  className="form-control shadow-none"
                  placeholder={id?.bank_name}
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  disabled
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="mb-3">
                <label htmlFor="text" className="form-label">
                  Bank IFSC Code<span className="error">*</span>
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  className="form-control shadow-none"
                  placeholder={id?.ifsc_code}
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  disabled
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        {/* <Modal.Footer className="border-0">
          <div className="submit_btn text-end w-100">
            <Button className="btns border-0 w-100" onClick={handleClose}>
              Submit
            </Button>
          </div>
        </Modal.Footer> */}
      </Modal>

      {/* REJECT WITHDRAWL MODAL */}
      <Modal
        className="support_modal"
        show={deleteModal}
        backdrop="static"
        id="close-btn"
        centered
        onHide={handleDeleteClose}
      >
        <Modal.Header
          className="border_bottom justify-content-center"
          closeButton
        >
          <Modal.Title>Do You Really Want To Reject ?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="create_data p-0"></Modal.Body>
        <textarea
          id="w3review"
          name="reasons"
          rows="4"
          cols="50"
          className="mx-2 bg-transparent text-white p-3"
          value={reasons}
          onChange={(e) => setReason(e.target.value)}
        ></textarea>
        <Modal.Footer className="border-0 flex-nowrap justify-content-center gap-5">
          <Button
            // variant="secondary"
            className="m-0 no_btns px-5 rounded-1"
            onClick={handleDeleteClose}
          >
            Cancel
          </Button>
          <div className="submit_btn text-center ">
            <Button
              className="btns border-0 px-5"
              onClick={() => handleReject(reasons, setReason)}
            >
              Reject
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Approved MODAL */}
      <Modal
        className="support_modal"
        show={check2}
        backdrop="static"
        id="close__bts"
        centered
        onHide={handleDeleteClose2}
      >
        <Modal.Header
          className="border_bottom justify-content-center"
          closeButton
        >
          <Modal.Title>
            Are you sure you want to approve Withdrawal ?{" "}
          </Modal.Title>
        </Modal.Header>

        <Modal.Footer className="border-0 flex-nowrap justify-content-center gap-5">
          <Button
            // variant="secondary"
            className="m-0 no_btns px-5 rounded-1"
            onClick={handleDeleteClose2}
          >
            Cancel
          </Button>
          <div className="submit_btn text-center ">
            <Button
              className="btns border-0 px-5"
              onClick={() => handleApprove()}
            >
              Approve
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* SEND TRANSACTION MODAL */}

      <Modal
        className="support_modal send_trxn"
        show={check1}
        backdrop="static"
        id="close-bts"
        centered
        onHide={handleCheck1}
      >
        <Modal.Header
          className="border_bottom justify-content-center"
          closeButton
        >
          <Modal.Title> Send Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-5 pb-3">
          <form action="" className="row">
            <div className="col-md-12">
              <div className="form__box mb-3">
                <select
                  className="form-select shadow-none"
                  aria-label="Default select example"
                  onChange={(e) => setTransactionType(e.target.value)}
                  required
                >
                  {/* <option value="" disabled>
                    Select transaction type
                  </option> */}
                  <option value="referral_amount">Referral Amount</option>
                  <option value="jaimax">Jaimax Coins</option>
                  <option value="super_bonus">Super Bonus</option>
                </select>
              </div>
            </div>
            <div className="col-md-12">
              <div className="form__box">
                <label htmlFor="">Enter Amount</label>
                <input
                  type="text"
                  autoComplete="off"
                  className="form-control shadow-none"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => amountInput(e)}
                  required
                />
              </div>
            </div>
          </form>
        </Modal.Body>

        <Modal.Footer className="border-0 flex-nowrap justify-content-center gap-5">
          <Button
            // variant="secondary"
            className="m-0 no_btns px-5 rounded-1"
            onClick={(e) => handleTransactionDelete(e, transactionType, amount)}
          >
            Cancel
          </Button>
          <div className="submit_btn text-center ">
            <Button
              className="btns border-0 px-5"
              onClick={(e) =>
                handleTransactionSubmit(e, transactionType, amount)
              }
            >
              Send
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/*  KYC REJECT MODAL */}
      <Modal
        className="support_modal"
        show={deleteModal1}
        backdrop="static"
        id="close-btn"
        centered
        onHide={handleDeleteClose1}
      >
        <Modal.Header
          className="border_bottom justify-content-center"
          closeButton
        >
          <Modal.Title>Do You Really Want To Reject KYC ?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="create_data p-0"></Modal.Body>
        <textarea
          id="w3review"
          name="reasons"
          rows="4"
          cols="50"
          className="mx-2 bg-transparent text-white p-3"
          value={reasons}
          onChange={(e) => setReason(e.target.value)}
        ></textarea>
        <Modal.Footer className="border-0 flex-nowrap justify-content-center gap-5">
          <Button
            // variant="secondary"
            className="m-0 no_btns px-5 rounded-1"
            onClick={handleDeleteClose1}
          >
            Cancel
          </Button>
          <div className="submit_btn text-center ">
            <Button
              className="btns border-0 px-5"
              onClick={() => handleKyc("reject")}
            >
              Reject
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Approved KYC MODAL */}
      <Modal
        className="support_modal"
        show={check}
        backdrop="static"
        id="close__bts"
        centered
        onHide={handleCheckClose}
      >
        <Modal.Header
          className="border_bottom justify-content-center"
          closeButton
        >
          <Modal.Title>Are you sure you want to approve KYC ?</Modal.Title>
        </Modal.Header>

        <Modal.Footer className="border-0 flex-nowrap justify-content-center gap-5">
          <Button
            // variant="secondary"
            className="m-0 no_btns px-5 rounded-1"
            onClick={handleCheckClose}
          >
            Cancel
          </Button>
          <div className="submit_btn text-center ">
            <Button
              className="btns border-0 px-5"
              onClick={() => handleKyc("approve")}
            >
              Approve
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

           {/* qualified list members */}


    </div>
  );
};

export default Modals;
