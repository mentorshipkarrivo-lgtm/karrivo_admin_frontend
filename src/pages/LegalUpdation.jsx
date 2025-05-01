import React, { useEffect, useState } from "react";
import DashboardLayout from "../Layout/DashboardLayout";
import {
  useUpdateLegalMutation,
  useGetLegalQuery,
} from "../features/legalApiSlice";
import { Editor } from "@tinymce/tinymce-react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

const LegalUpdation = () => {
  const [legalData, setLegalData] = useState("");
  const [ids, setIds] = useState("");
  const [loading, setLoading] = useState(false);
  const { data, isLoading, error, refetch } = useGetLegalQuery();

  const handleEditorChange = (content, editor) => {
    setLegalData(content);
  };
  let tinyMceApiKey = "";
  console.log("window.location.origin", window.location.origin);
  let origin = window.location.origin;

  if (origin && (origin.includes("5173") || origin.includes("5174"))) {
    tinyMceApiKey = process.env.TINY_MCE_EDITOR_API_KEY;
  } else if (window.location.origin === "https://admin.jaimax.com") {
    tinyMceApiKey = process.env.TINY_MCE_EDITOR_API_KEY_PROD;
  } else {
    tinyMceApiKey = process.env.TINY_MCE_EDITOR_API_KEY;
  }
  console.log("apiKey:", tinyMceApiKey);

  useEffect(() => {
    refetch();
    if (data) {
      let responseData = data?.data?.legal_text || "N/A";
      setIds(data?.data?._id);
      setLegalData(responseData);
    }
  }, [data]);

  const [legalUpdate] = useUpdateLegalMutation();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let value = {
        id: ids,
        legal_text: legalData,
      };
      let response = await legalUpdate(value);
      if (response?.data?.status_code === 200) {
        setLegalData(response?.data?.data?.legal_text);
        toast.success(response?.data?.message, {
          position: "top-center",
        });
        // setLegalData("")
      }
    } catch (error) {
      toast.error(error?.message, {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  // checking the acess of the user

  return (
    <DashboardLayout>
      <section className="profile_section py-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="my_total_team_data rounded-3 px-3 pb-0 py-4">
                <h1 className="mb-3">Legal Updations</h1>
                <div className="row justify-content-between">
                  <div className="col-12 col-md-12">
                    <div className="mb-3">
                      <label htmlFor="text" className="form-label">
                        Comment <span className="error">*</span>
                      </label>
                      {isLoading ? (
                        <div className="text-center">
                          <ClipLoader
                            size={50}
                            color={"#123abc"}
                            loading={isLoading}
                          />
                        </div>
                      ) : (
                        <Editor
                          //apiKey="eyymvffrc8nj9lg3at0a14bhccbn62gbug0ga85g3emeqtd5"

                          apiKey={tinyMceApiKey}
                          init={{
                            selector: 'textarea',
                            plugins:
                              "table lists media paste anchor autolink charmap codesample emoticons image link wordcount visualblocks",
                            toolbar:
                              "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                            tinycomments_mode: "embedded",
                            paste_as_text: true,
                            ai_request: (request, respondWith) =>
                              respondWith.string(() =>
                                Promise.reject(
                                  "See docs to implement AI Assistant"
                                )
                              ),
                          }}
                          value={legalData}
                          onEditorChange={handleEditorChange}
                        />
                      )}
                      <button
                        type="button"
                        className="btn btn-primary mt-3"
                        onClick={handleSubmit}
                        disabled={loading}
                      >
                        {loading ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default LegalUpdation;
