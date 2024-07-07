import React, { useContext, useEffect, useState } from "react";
import "./Subjects.css";
import Sidebar from "../navbar/Sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../AuthContext";

function Subjects() {
  const navigate = useNavigate();
  const location = useLocation();
  const { folderId, folders } = location.state || {};
  const [delayedFolders, setDelayedFolders] = useState([]);
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }

    if (!folderId) {
      navigate("/home");
      return;
    }

    let timer;
    const rootFolders = folders.filter(
      (folder) => folder.parentFolder === folderId
    );
    rootFolders.forEach((folder, index) => {
      timer = setTimeout(() => {
        setDelayedFolders((prevFolders) => [...prevFolders, folder]);
      }, index * 75);
    });

    return () => {
      clearTimeout(timer);
    };
  }, [folders, folderId, navigate]);

  const handleClick = (folderId, imgSrc) => {
    navigate("/units", { state: { folderId, imgSrc } });
  };

  return (
    <div>
      {isLoggedIn ? (
        <>
          <div className="blur1"></div>
          <div style={{ marginTop: "50px" }}>
            <div className="img-container1"></div>
            <div>
              <Sidebar />
              <div className="outer-container">
                <h1
                  className="display-1 text-center text-light blinking-text-sem"
                  style={{ fontSize: "48px" }}
                >
                  Subjects
                </h1>
                <div className="content text-center w-50 container-fluid d-flex flex-column align-items-center justify-content-center">
                  {delayedFolders.map((folder) => (
                    <div
                      key={folder._id}
                      className="folder-div d-flex rounded-3 fw-bold text-white lead p-4 justify-content-evenly"
                      onClick={() =>
                        handleClick(folder._id, "/icons8-folder-96.png")
                      }
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
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="display-1 text-center"></p>
      )}
    </div>
  );
}

export default Subjects;
