import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./Admin.css";
import Sidebar from "../navbar/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../AuthContext";
import { ResourceContext } from "../../ResourceContext";
import { ThemeContext } from "../../ThemeContext";

function Admin(props) {
  const { resources } = useContext(ResourceContext);
  const [resource, setResource] = useState([]);
  const { isLoggedIn } = useContext(AuthContext);
  const [delayedDocs, setDelayedDocs] = useState([]);
  const token = localStorage.getItem("user") || null;
  const [view, setView] = useState("docs");
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    const fetchResources = async () => {
      let sortedResources = resources.sort((a, b) =>
        b.uploadedAt.localeCompare(a.uploadedAt)
      );
      sortedResources = sortedResources.filter((rsc) => {
        return !rsc.isAccepted;
      });
      setResource(sortedResources);
    };
    fetchResources();
  }, []);

  const fetchDocuments = async () => {
    try {
      let documents = JSON.stringify(props);
      documents = JSON.parse(documents).documents.docs;
      const rootDocs = documents.filter((doc) => {
        return (
          !doc.isAccepted &&
          doc.parentFolder != process.env.REACT_APP_PLACEMENTS_FOLDER
        );
      });
      setDelayedDocs([]);
      rootDocs.forEach((doc, index) => {
        setTimeout(() => {
          setDelayedDocs((prevDocs) => [...prevDocs, doc]);
        }, index * 175);
      });
    } catch (error) {
      console.error("Error fetching documents or folder", error);
    }
  };

  const getImageSrc = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    if (extension === "pdf") {
      return "/favicons/pdf.png";
    } else if (["ppt", "pptx"].includes(extension)) {
      return "/favicons/ppt.png";
    } else if (["doc", "docx"].includes(extension)) {
      return "/favicons/doc.png";
    } else {
      return "/favicons/default.png";
    }
  };

  async function handleAccept(docId) {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_API_URL}/document/accept`,
        { docId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 200) {
        let docs = delayedDocs.filter((doc) => {
          return doc._id != docId;
        });
        setDelayedDocs(docs);
      } else {
        toast.error("Error accepting the file...");
      }
    } catch (error) {
      toast.error("Error accepting the file...");
    }
  }

  async function handleAcceptResource(rscId) {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_API_URL}/resource/accept`,
        { rscId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 200) {
        let rscs = resource.filter((rsc) => {
          return rsc._id != rscId;
        });
        setResource(rscs);
      } else {
        toast.error("Error accepting the Resource...");
      }
    } catch (error) {
      toast.error("Error accepting the Resource...");
    }
  }

  async function handleDelete(docId) {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_API_URL}/document/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ docId }),
        }
      );

      if (response.status == 200) {
        let docs = delayedDocs.filter((doc) => {
          return doc._id != docId;
        });
        setDelayedDocs(docs);
      } else {
        const errorData = await response.json();
        toast.error(`Error Deleting the File: ${errorData.message}`);
      }
    } catch (error) {
      toast.error("Error Deleting the File...");
    }
  }

  async function handleDeleteResource(rscId) {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_API_URL}/resource/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rscId }),
        }
      );

      if (response.status == 200) {
        let rscs = resource.filter((rsc) => {
          return rsc._id != rscId;
        });
        setResource(rscs);
      } else {
        const errorData = await response.json();
        toast.error(`Error Deleting the Resource: ${errorData.message}`);
        console.error(errorData);
      }
    } catch (error) {
      toast.error("Error Deleting the Resource...");
      console.error(error);
    }
  }

  async function handleActivate() {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_ACTIVATE_URL}/auth`
      );
      if (response.status == 201) {
        toast.success("Token Updated successfully...");
      }
    } catch (error) {
      console.error(error);
    }
  }

  function getFolderName(folderId) {
    const folder = props.folders.find((f) => {
      return f._id == folderId;
    });
    return folder.name;
  }

  function getDocFolderName(folderId) {
    const folder = props.folders.find((f) => {
      return f._id == folderId;
    });

    if (!folder) {
      return "";
    }

    const subFolder = props.folders.find((f) => {
      return f._id == folder.parentFolder;
    });

    if (subFolder) {
      return `${folder.name} (${subFolder.name})`;
    }
    console.log(folder);
    return folder.name;
  }

  return (
    <>
      {isLoggedIn ? (
        <div>
          <ToastContainer />
          <div style={{ marginTop: "50px" }}>
            <div className={`img-container2 ${theme}`}></div>
            <div className="text-center">
              <Sidebar />
              <div className="outer-container-year">
                <h1
                  className={`display-5 text-center cust-text-${theme}`}
                  style={{ zIndex: 1000, margin: "20px 0px" }}
                >
                  Recently Uploaded
                </h1>
                <div className={`btn-group ${theme} text-center`}>
                  <button
                    className={`btn ${theme} ${
                      view === "docs" ? "active" : ""
                    }`}
                    onClick={() => setView("docs")}
                  >
                    Documents
                  </button>
                  <button
                    className={`btn ${theme} ${
                      view !== "docs" ? "active" : ""
                    }`}
                    onClick={() => {
                      setView("resource");
                    }}
                  >
                    Resources
                  </button>
                </div>
                {view == "docs" ? (
                  <div className="admin-admin text-center w-50 container-fluid d-flex flex-column align-items-center justify-admin-center">
                    {theme == "dark" && <div className="blur1"></div>}
                    {delayedDocs.map((doc) => (
                      <div key={doc._id}>
                        <div className="d-flex flex-column mt-3">
                          <h2
                            className={`lead text-center text-white fw-bold m-0 ${theme}`}
                          >
                            {doc.uploadedBy} uploaded into{" "}
                            {getDocFolderName(doc.parentFolder)}
                          </h2>

                          <div
                            className="content-div d-flex fw-bold text-white lead py-4 justify-admin-between"
                            style={{
                              height: "50px",
                              textWrap: "nowrap",
                              borderRadius: "5px",
                            }}
                          >
                            <div className="img-div text-start ms-4 align-items-end">
                              <img
                                className="text-start"
                                src={getImageSrc(doc.name)}
                                alt=""
                                height={"35px"}
                              />
                            </div>
                            <div
                              className={`text-div text-start align-items-start mt-2 ${theme}`}
                              onClick={() => {
                                window.location.href = `${doc.viewLink}`;
                              }}
                            >
                              {doc.name.toUpperCase()}
                            </div>

                            <div
                              className="download-div text-end me-3 align-items-start"
                              onClick={() => handleAccept(doc._id)}
                              style={{ cursor: "pointer" }}
                            >
                              <img
                                className=""
                                src="/favicons/tick.png"
                                alt=""
                                height={"35px"}
                              />
                            </div>
                            <div
                              className="download-div text-end me-3 align-items-start"
                              onClick={() => handleDelete(doc._id)}
                              style={{ cursor: "pointer" }}
                            >
                              <img
                                className=""
                                src="/favicons/delete.png"
                                alt=""
                                height={"35px"}
                                style={{ opacity: 0.8 }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {/* <button
                      className="custom-button-submit"
                      style={{
                        zIndex: 1010,
                        cursor: "pointer",
                        position: "absolute",
                        bottom: "80px",
                        right: "50px",
                      }}
                      onClick={handleActivate}
                    >
                      Activate
                    </button> */}
                  </div>
                ) : (
                  <>
                    {theme == "dark" && <div className="blur1"></div>}
                    <ToastContainer />
                    <div>
                      {view !== "docs" ? (
                        <div style={{ marginTop: "50px" }}>
                          <div className={`img-container2 ${theme}`}></div>
                        </div>
                      ) : null}
                      {resource.map((rsc) => (
                        <div className={`rsc-img ${theme}`}>
                          <div
                            key={rsc._id}
                            className={`resource-div ${theme}`}
                          >
                            <div className="resource-content text-start">
                              <p className={`resource-user ${theme}`}>
                                {rsc.uploadedBy} upload into{" "}
                                {getFolderName(rsc.parentFolder)}
                              </p>
                              <div className="d-flex justify-content-between align-items-center">
                                <p
                                  className={`text-uppercase fw-bold fst-italic font-italic`}
                                  style={
                                    theme == "light"
                                      ? { color: "green" }
                                      : { color: "lightblue" }
                                  }
                                >
                                  {rsc.name}
                                </p>
                                <div className="d-flex justify-content-end">
                                  <div
                                    className="download-div d-inline me-3 ms-5"
                                    onClick={() =>
                                      handleAcceptResource(rsc._id)
                                    }
                                    style={{ cursor: "pointer" }}
                                  >
                                    <img
                                      src="/favicons/tick.png"
                                      alt=""
                                      height={"35px"}
                                    />
                                  </div>
                                  <div
                                    className="download-div d-inline me-3"
                                    onClick={() =>
                                      handleDeleteResource(rsc._id)
                                    }
                                    style={{ cursor: "pointer" }}
                                  >
                                    <img
                                      src="/favicons/delete.png"
                                      alt=""
                                      height={"35px"}
                                      style={{ opacity: 0.8 }}
                                    />
                                  </div>
                                </div>
                              </div>

                              <p className={`${theme}`}>{rsc.description}</p>
                              <p
                                className={`${theme}`}
                                style={{
                                  width: "75vw",
                                  overflow: "auto",
                                  maxWidth: "750px",
                                }}
                              >
                                Link:{" "}
                                <a
                                  href={rsc.rscLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`rsc-link ${theme}`}
                                >
                                  {rsc.rscLink}
                                </a>
                              </p>
                            </div>
                            <br />
                            <div className={`resource-date ${theme}`}>
                              <p style={{ fontSize: "1.2em" }}>
                                Posted at: {formatTimestamp(rsc.uploadedAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="display-1 text-white"></p>
      )}
    </>
  );
}

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return formattedDate.replace(",", "");
};

export default Admin;
