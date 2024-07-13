import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../navbar/Sidebar";
import Resource from "../Resource/Resource";
import { useLocation, useNavigate } from "react-router-dom";
import { IdContext } from "../../IdContext";
import Content from "../Content/Content";
import "./GateUnits.css";

function GateUnits({ folders, docs }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { folderId, imgSrc, courseLink } = location.state || {};
  const [delayedFolders, setDelayedFolders] = useState([]);
  const [parentFolder, setParentFolder] = useState("Subject");
  const [view, setView] = useState("content");
  const [user, setUser] = useState(false);
  const { userId, setUserId } = useContext(IdContext);

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

  const handleFolderClick = (folderId, parentFolder) => {
    navigate("/units", { state: { folderId, imgSrc, parentFolder } });
  };

  return (
    <div>
      {user ? (
        <>
          <div style={{ marginTop: "50px", zIndex: 10 }}>
            <div>
              <Sidebar />
              <div className="outer-container-content text-center">
                <h1
                  className="display-5 text-center text-white blinking-text-units"
                  style={{ zIndex: 1001, marginTop: "50px" }}
                >
                  {parentFolder}
                </h1>
                <div className="btn-group text-center">
                  <button
                    className={`btn ${view === "content" ? "active" : ""}`}
                    onClick={() => setView("content")}
                  >
                    Content
                  </button>
                  <button
                    className={`btn ${view !== "content" ? "active" : ""}`}
                    onClick={() => {
                      setView("pyqs");
                    }}
                  >
                    PYQs
                  </button>
                </div>
                {view === "content" ? (
                  <div className="w-100">
                    <a
                      href={courseLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="gate-img ms-auto me-auto">
                        <img
                          src={`/favicons/gate/${parentFolder.toLowerCase()}.png`}
                          alt={`${parentFolder.toLowerCase()}`}
                          height="100px"
                        />
                      </div>
                    </a>
                    <h1 className="lead text-white text-center fw-bold mt-3 cust-text">
                      Video Course 👆
                    </h1>
                    <Content
                      documents={docs}
                      gateFolderId={folderId}
                      view="gate"
                    />
                  </div>
                ) : (
                  <>
                    <Resource
                      parentFolder={folderId}
                      uploadedBy={userId}
                      view={"units"}
                      folderName={parentFolder}
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

export default GateUnits;
