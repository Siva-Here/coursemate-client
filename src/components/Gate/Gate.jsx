import React, { useContext, useEffect, useState } from "react";
import "./Gate.css";
import Sidebar from "../navbar/Sidebar";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";

function Gate({ folders }) {
  const [delayedFolders, setDelayedFolders] = useState([]);
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
    let timer;
    const rootFolders = folders
      .filter((folder) => folder.isGate)
      .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

    rootFolders.forEach((folder, index) => {
      timer = setTimeout(() => {
        setDelayedFolders((prevFolders) => [...prevFolders, folder]);
      }, index * 175);
    });

    return () => {
      clearTimeout(timer);
    };
  }, [folders]);

  const handleClick = (folderId, imgSrc, courseLink) => {
    navigate("/gateunits", {
      state: { folderId, imgSrc, folders, courseLink },
    });
  };

  return (
    <div>
      {isLoggedIn ? (
        <>
          <div className="blur1"></div>
          <div style={{ marginTop: "50px" }}>
            <div className="units-img"></div>
            <div>
              <Sidebar />
              <div className="outer-container-year">
                <h1
                  className="display-1 text-center text-light blinking-text-year"
                  style={{ fontSize: "48px" }}
                >
                  Gate
                </h1>
                <div
                  className="text-center mt-5 container-fluid"
                  style={{ width: "90vw", maxWidth: "750px" }}
                >
                  <div className="row justify-content-center">
                    {delayedFolders.map((folder) => (
                      <div
                        key={folder._id}
                        className="col-lg-3 col-md-4 col-sm-6 mb-4 col-6"
                        style={{ cursor: "pointer" }}
                      >
                        <div
                          className="d-flex flex-column align-items-center justify-content-center p-3"
                          onClick={() =>
                            handleClick(
                              folder._id,
                              `/${folder.name}.png`,
                              folder.courseLink
                            )
                          }
                          style={{
                            borderRadius: "15px",
                            background: "rgba(0, 0, 0, 0.5)",
                            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                            backdropFilter: "blur(10px)",
                            WebkitBackdropFilter: "blur(10px)",
                            border: "1px solid rgba(255, 255, 255, 0.3)",
                          }}
                        >
                          <img
                            src={`/favicons/gate/${folder.name.toLowerCase()}.png`}
                            alt={folder.name}
                            height="50px"
                            style={{ opacity: 0.8 }}
                          />
                          <div className="text-white text-capitalize mt-3 fw-bold text-nowrap">
                            {folder.name.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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

export default Gate;
