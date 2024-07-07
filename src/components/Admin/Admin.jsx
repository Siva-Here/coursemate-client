import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Admin.css";
import Sidebar from "../navbar/Sidebar";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";

function Admin() {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [docs, setDocs] = useState([]);
  const [delayedDocs, setDelayedDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAccepted, setIsAccepted] = useState(false);
  const [usernames, setUsernames] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("user") || null;

  useEffect(() => {
    const storedUser = localStorage.getItem("user") || false;
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate("/");
    }
    const email = jwtDecode(token).email;
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
  }, []);

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

  useEffect(() => {
    fetchDocuments();
  }, [isAccepted]);

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

  async function handleAccept(docId) {
    console.log(token);
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
        setIsAccepted(!isAccepted);
      } else {
        toast.error("Error accepting the file...");
      }
    } catch (error) {
      toast.error("Error accepting the file...");
    }
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
        console.log(response.data);
        return response.data.username;
      } else {
        toast.error("Can't get user names");
      }
    } catch (error) {
      toast.error("Can't get user names");
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
        const data = await response.json();
        toast.success("File Deleted...");
        setIsAccepted(!isAccepted);
      } else {
        const errorData = await response.json();
        toast.error(`Error Deleting the file: ${errorData.message}`);
      }
    } catch (error) {
      toast.error("Error Deleting the file...");
    }
  }

  return (
    <>
      {user ? (
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
export default Admin;
