import React, { useContext, useEffect, useState } from "react";
import "./Gate.css";
import Sidebar from "../navbar/Sidebar";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { ThemeContext } from "../../ThemeContext";
import { NavbarContext } from "../../NavbarContext";

function Gate({ folders }) {
  const [delayedFolders, setDelayedFolders] = useState([]);
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const { isExpanded } = useContext(NavbarContext);

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
          {theme == "dark" && <div className="blur1"></div>}
          <div style={{ marginTop: "50px" }}>
            <div className={`img-container2 ${theme}`}></div>
            <div>
              <Sidebar />
              <div
                className={`outer-container-year ${
                  isExpanded ? "expanded" : ""
                }`}
              >
                <h1
                  className={`text-center cust-text-${theme}`}
                  style={{ zIndex: 1000, marginTop: "15px" }}
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
                          className={`gate-div ${theme} d-flex flex-column align-items-center justify-content-center p-3`}
                          onClick={() =>
                            handleClick(
                              folder._id,
                              `/${folder.name}.png`,
                              folder.courseLink
                            )
                          }
                        >
                          <img
                            src={`/favicons/gate/${folder.name.toLowerCase()}.png`}
                            alt={folder.name}
                            height="50px"
                            style={{ opacity: 0.8 }}
                          />
                          <div
                            className={`${theme} text-capitalize mt-3 fw-bold text-nowrap`}
                            style={{ fontSize: "1rem" }}
                          >
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
