import React, { useContext, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useTransUpdateMutation } from "../features/wallet/walletApiSlice";
import { toast } from "react-toastify";

const Modals = ({
  deleteModal1,
  setDeleteModal1,
  check,
  setCheck,
  id,
  status,
}) => {
  const [approveTransaction] = useTransUpdateMutation();
  const handleDeleteClose1 = () => {
    setDeleteModal1(false);
    setErrors("");
  };
  const handleCheckClose = () => setCheck(false);
  const [reasons, setReason] = useState("");
  const [errors, setErrors] = useState("");
  let tranStatus;
  if (status == "Approve") {
    tranStatus = "Completed";
  } else {
    tranStatus = "Hold";
  }
  //////////// Validation for update ICO Rounds
  const validate = () => {
    if (reasons == "") {
      setErrors("Please enter a reason");
      return false;
    } else if (reasons.length < 5) {
      setErrors("Reason cannot be less than 5 characters");
      return false;
    }
    setErrors("");
    return true;
  };
  const handleStatus = async (val) => {
    try {
      if (val == "Completed") {
        const data = { transactionId: id, transactionStatus: val, reason: "" };
        const res = await approveTransaction(data);
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
      } else if (val == "Hold") {
        const data = { transactionId: id, transactionStatus: val };
        const res = await approveTransaction(data);
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
      } else if (val == "Failed") {
        setErrors("");
        if (!validate()) {
          return;
        }
        const data = {
          transactionId: id,
          transactionStatus: val,
          reason: reasons,
        };
        const res = await approveTransaction(data);
        if (res?.data?.status_code == 200) {
          setReason("");
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
          setErrors("");
        }
      }
    } catch (error) {
      toast.error(error?.message, {
        position: "top-center",
      });
    }
  };

  return (
    <div>
      {/*  Transaction REJECT MODAL */}
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
          <Modal.Title>
            Do You Really Want To cancel the Transaction ?
          </Modal.Title>
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
        {errors && <div className="error_cls px-2">{errors}</div>}
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
              onClick={() => handleStatus("Failed")}
            >
              Reject
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Approve/hold transaction MODAL */}
      <Modal
        className="support_modal"
        show={check}
        // backdrop="static"
        id="close__bts"
        centered
        onHide={handleCheckClose}
      >
        <Modal.Header
          className="border_bottom justify-content-center"
          closeButton
        >
          <Modal.Title>
            Are you sure you want to {status} the Transaction ?
          </Modal.Title>
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
              onClick={() => handleStatus(tranStatus)}
            >
              {status}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Modals;
