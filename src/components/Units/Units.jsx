import React, { useEffect, useState } from "react";
import "./Units.css";
import axios from "axios";
import Sidebar from "../navbar/Sidebar";
import Resource from "../Resource/Resource";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Units({ folders }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { folderId, imgSrc } = location.state || {};
  const [delayedFolders, setDelayedFolders] = useState([]);
  const [parentFolder, setParentFolder] = useState("Subject");
  const [view, setView] = useState("units");
  const [user, setUser] = useState(false);
  const token = localStorage.getItem("user") || null;
  const [userId, setUserId] = useState(null);

  if (!user) {
    navigate("/resource", {
      state: { parentFolder: folderId, uploadedBy: userId },
    });
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("user") || false;
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate("/");
    }

    if (!folderId) {
      navigate("/");
      return;
    }

    let timer;
    const email = jwtDecode(token).email;
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/user/getUserId`,
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

    const rootFolders = folders.filter(
      (folder) => folder.parentFolder === folderId
    );

    const sortedFolders = rootFolders.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    const parent = folders.find((folder) => folder._id === folderId);
    if (parent) {
      setParentFolder(parent.name);
    } else {
      console.error("Parent folder not found");
    }

    sortedFolders.forEach((folder, index) => {
      timer = setTimeout(() => {
        setDelayedFolders((prevFolders) => [...prevFolders, folder]);
      }, index * 175);
    });

    return () => {
      clearTimeout(timer);
    };
  }, [folders, folderId, navigate]);

  const handleFolderClick = (folderId) => {
    navigate("/content", { state: { folderId, imgSrc } });
  };

  return (
    <div>
      {user ? (
        <>
          <div className="blur1"></div>
          <div style={{ marginTop: "50px" }}>
            <div className="units-img"></div>
            <div>
              <Sidebar />
              <div className="outer-container-units text-center">
                <h1
                  className="display-3 text-center text-white blinking-text-units"
                  style={{ zIndex: 100 }}
                >
                  {parentFolder}
                </h1>
                <div className="btn-group text-center">
                  <button
                    className={`btn ${view === "units" ? "active" : ""}`}
                    onClick={() => setView("units")}
                  >
                    Units
                  </button>
                  <button
                    className={`btn ${view === "resources" ? "active" : ""}`}
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
                {view === "units" ? (
                  <div className="content-units text-center w-50 container-fluid d-flex flex-column align-items-center justify-content-center">
                    {delayedFolders.map((folder) => (
                      <div
                        key={folder._id}
                        className="units-div d-flex rounded-3 fw-bold text-white lead p-4 justify-content-evenly"
                        onClick={() => handleFolderClick(folder._id)}
                      >
                        <div className="w-25 text-end align-items-end">
                          <img
                            className="text-start"
                            src="/bing/folder1.png"
                            alt=""
                            height={"40px"}
                            style={{ opacity: 0.8 }}
                          />
                        </div>
                        <div className="w-75 text-start px-3 px-5 align-items-start">
                          {folder.name}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <Resource
                      parentFolder={folderId}
                      uploadedBy={userId}
                      view={"units"}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="display-1 text-white"></p>
      )}
    </div>
  );
}

export default Units;
