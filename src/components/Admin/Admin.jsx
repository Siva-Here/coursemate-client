import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./Admin.css";
import Sidebar from "../navbar/Sidebar";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../../AuthContext";

function Admin() {
  const { isLoggedIn } = useContext(AuthContext);
  const [userId, setUserId] = useState(null);
  const [docs, setDocs] = useState([]);
  const [delayedDocs, setDelayedDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isChanged, setIsChanged] = useState(false);
  const [usernames, setUsernames] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("user") || null;
  const [resources, setResources] = useState(null);
  const [view, setView] = useState("docs");

  useEffect(() => {
    const storedUser = localStorage.getItem("user") || false;
    let email;
    if (isLoggedIn) {
      try {
        email = jwtDecode(storedUser).email;
      } catch (error) {
        navigate("/");
      }
    } else {
      navigate("/");
    }
    axios
      .post(
        `${process.env.REACT_APP_BASE_API_URL}/user/getUserId`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setUserId(response.data.userId);
      })
      .catch((error) => {
        console.error("Cannot get user ID", error);
      });
    fetchDocuments();
  }, [isChanged]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_API_URL}/resource/resources`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          let sortedResources = response.data.sort((a, b) =>
            b.uploadedAt.localeCompare(a.uploadedAt)
          );
          sortedResources = sortedResources.filter(
            (resource) => !resource.isAccepted
          );
          setResources(sortedResources);
        } else {
          toast.error("Failed to fetch resources. Please try again later.");
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
        toast.error("Failed to fetch resources. Please try again later.");
      }
    };
    fetchResources();
  }, [isChanged]);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API_URL}/document/docs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const rootDocs = response.data.docs.filter((doc) => !doc.isAccepted);
      setDocs(rootDocs);
      setLoading(false);
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

  useEffect(() => {
    const fetchUsernames = async () => {
      const userPromises = docs.map((doc) => getUserName(doc.uploadedBy));
      const fetchedUsernames = await Promise.all(userPromises);
      const usernameMap = docs.reduce((acc, doc, index) => {
        acc[doc.uploadedBy] = fetchedUsernames[index];
        return acc;
      }, {});
      setUsernames(usernameMap);
    };

    fetchUsernames();
  }, [docs]);

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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="lead text-white m-3 loading">Loading...</p>
      </div>
    );
  }

  async function getUserName(uploadedBy) {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_API_URL}/user/profile`,
        { userId: uploadedBy },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 200) {
        return response.data.username;
      } else {
        toast.error("Can't get user names");
      }
    } catch (error) {
      toast.error("Can't get user names");
    }
  }

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
        toast.success("File accepted...");
        setIsChanged(!isChanged);
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
        toast.success("Resource accepted...");
        setIsChanged(!isChanged);
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

      if (response.ok) {
        toast.success("Resource Deleted...");
        setIsChanged(!isChanged);
      } else {
        const errorData = await response.json();
        toast.error(`Error Deleting the Resource: ${errorData.message}`);
      }
    } catch (error) {
      toast.error("Error Deleting the Resource...");
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

      if (response.ok) {
        toast.success("Resource Deleted...");
        setIsChanged(!isChanged);
      } else {
        const errorData = await response.json();
        toast.error(`Error Deleting the Resource: ${errorData.message}`);
      }
    } catch (error) {
      toast.error("Error Deleting the Resource...");
    }
  }

  return (
    <>
      {isLoggedIn ? (
        <div>
          <ToastContainer />
          <div className="blur1"></div>
          <div style={{ marginTop: "50px" }}>
            <div className="admin-img"></div>
            <div>
              <Sidebar />
              <div className="outer-container-admin">
                <h1
                  className="display-3 text-center text-white blinking-text"
                  style={{ zIndex: 100 }}
                >
                  Recently Uploaded
                </h1>
                <div className="btn-group text-center w-75 justify-content-center ms-5">
                  <button
                    className={`btn ${view === "docs" ? "active" : ""}`}
                    onClick={() => setView("docs")}
                  >
                    Documents
                  </button>
                  <button
                    className={`btn ${view === "resource" ? "active" : ""}`}
                    onClick={() => {
                      // navigate("/resource", {
                      //   state: { parentFolder: folderId, uploadedBy: userId },
                      // })
                      setView("resource");
                    }}
                  >
                    Resources
                  </button>
                </div>
                {view == "docs" ? (
                  <div className="admin-admin text-center w-50 container-fluid d-flex flex-column align-items-center justify-admin-center">
                    {delayedDocs.map((doc) => (
                      <div key={doc._id}>
                        <div className="d-flex flex-column mt-3">
                          <h1 className="lead text-center text-white fw-bold m-0">
                            {usernames[doc.uploadedBy] || "Loading..."}
                          </h1>
                          <div className="admin-div d-flex fw-bold text-white lead py-4 justify-admin-between">
                            <div className="img-div text-start ms-4 align-items-end">
                              <img
                                className="text-start"
                                src={getImageSrc(doc.name)}
                                alt=""
                                height={"35px"}
                              />
                            </div>
                            <div
                              className="text-div text-start align-items-start"
                              onClick={() => {
                                window.location.href = `${doc.viewLink}`;
                              }}
                            >
                              {doc.name.toUpperCase()}
                            </div>

                            <div
                              className="download-div text-end me-3 align-items-start"
                              onClick={() => handleAccept(doc._id)}
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
                  </div>
                ) : (
                  <>
                    <ToastContainer />
                    <div>
                      {view !== "docs" ? (
                        <div style={{ marginTop: "50px" }}>
                          <Sidebar />
                          <div className="units-img"></div>
                        </div>
                      ) : null}
                      <div className="blur1"></div>
                      {resources.map((resource) => (
                        <div key={resource._id} className="resource-div">
                          <div className="resource-content">
                            <p className="resource-user d-inline">
                              Uploaded by: {resource.uploadedBy}
                            </p>
                            <div
                              className="download-div d-inline me-3 ms-5"
                              onClick={() => handleAcceptResource(resource._id)}
                            >
                              <img
                                src="/favicons/tick.png"
                                alt=""
                                height={"35px"}
                              />
                            </div>
                            <div
                              className="download-div d-inline me-3"
                              onClick={() => handleDeleteResource(resource._id)}
                            >
                              <img
                                src="/favicons/delete.png"
                                alt=""
                                height={"35px"}
                                style={{ opacity: 0.8 }}
                              />
                            </div>
                            <p className="text-uppercase fw-bold fst-italic font-italic">
                              {" "}
                              {resource.name}
                            </p>
                            <p>{resource.description}</p>
                            <p>
                              Link:{" "}
                              <a
                                href={resource.rscLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: "yellow" }}
                              >
                                {resource.rscLink}
                              </a>
                            </p>
                          </div>
                          <br />
                          <div className="resource-date">
                            <p style={{ fontSize: "1.2em" }}>
                              Posted at: {formatTimestamp(resource.uploadedAt)}
                            </p>
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
