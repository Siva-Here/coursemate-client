import React, { useContext, useEffect, useState } from "react";
import "./Units.css";
import Sidebar from "../navbar/Sidebar";
import Resource from "../Resource/Resource";
import { useLocation, useNavigate } from "react-router-dom";
import { IdContext } from "../../IdContext";
import { ThemeContext } from "../../ThemeContext";

function Units({ folders }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { folderId, imgSrc } = location.state || {};
  const [delayedFolders, setDelayedFolders] = useState([]);
  const [parentFolder, setParentFolder] = useState("Subject");
  const [view, setView] = useState("units");
  const [user, setUser] = useState(false);
  const { theme } = useContext(ThemeContext);
  const { userId } = useContext(IdContext);

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
    navigate("/content", { state: { folderId, imgSrc, parentFolder } });
  };

  return (
    <div>
      {user ? (
        <>
          {/* <div className="blur1"></div> */}
          <div style={{ marginTop: "50px", zIndex: 10 }}>
            <div className={`units-img ${theme}`}></div>
            <div>
              <Sidebar />
              <div className="outer-container-units text-center">
                <h1
                  className={`display-5 text-center cust-text-${theme}`}
                  style={{ zIndex: 1000, marginTop: "15px" }}
                >
                  {parentFolder}
                </h1>
                <div className={`btn-group ${theme} text-center`}>
                  <button
                    className={`btn ${theme} ${
                      view === "units" ? "active" : ""
                    }`}
                    onClick={() => setView("units")}
                  >
                    Units
                  </button>
                  <button
                    className={`btn ${theme} ${
                      view !== "units" ? "active" : ""
                    }`}
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
                  <div className="content text-center container-fluid d-flex flex-column align-items-center justify-content-center">
                    {delayedFolders.map((folder) => (
                      <div
                        key={folder._id}
                        className={`folder-div-sub ${theme} d-flex rounded-3 fw-bold lead p-4 justify-content-evenly`}
                        onClick={() =>
                          handleFolderClick(folder._id, folder.name)
                        }
                      >
                        <div className="w-25 text-end align-items-end">
                          {theme == "light" ? (
                            <>
                              <img
                                className="text-start"
                                src="/bing/folder.png"
                                alt=""
                                height={"30px"}
                                style={{ opacity: 1 }}
                              />
                            </>
                          ) : (
                            <>
                              <img
                                className="text-start"
                                src="/bing/folder1.png"
                                alt=""
                                height={"40px"}
                                style={{ opacity: 0.8 }}
                              />
                            </>
                          )}
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

export default Units;
