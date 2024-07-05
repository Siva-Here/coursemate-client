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
        "https://course-mate-server.onrender.com/user/getUserId",
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
        "https://course-mate-server.onrender.com/document/docs",
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
    fetchDocuments();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="lead text-white m-3 loading">Loading...</p>
      </div>
    );
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
                    <div
                      key={doc._id}
                      className="admin-div d-flex fw-bold text-white lead py-4 justify-admin-between"
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
                        className="text-div text-start align-items-start"
                        onClick={() => {
                          window.location.href = `${doc.viewLink}`;
                        }}
                      >
                        {doc.name.toUpperCase()}
                      </div>

                      <div
                        className="download-div text-end me-3 align-items-start"
                        onClick={handleAccept}
                      >
                        <img
                          className=""
                          src="/favicons/tick.png"
                          alt=""
                          height={"40px"}
                        />
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
