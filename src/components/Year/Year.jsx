import React, { useContext, useEffect, useState } from "react";
import "./Year.css";
import Sidebar from "../navbar/Sidebar";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { ThemeContext } from "../../ThemeContext";
import "bootstrap/dist/css/bootstrap.min.css";

function Year({ folders }) {
  const [delayedFolders, setDelayedFolders] = useState([]);
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
    let timer;
    const rootFolders = folders
      .filter((folder) => !folder.parentFolder && folder.isSubject)
      .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

    rootFolders.forEach((folder, index) => {
      timer = setTimeout(() => {
        setDelayedFolders((prevFolders) => [...prevFolders, folder]);
      }, index * 375);
    });

    return () => {
      clearTimeout(timer);
    };
  }, [folders]);

  const handleClick = (folderId, imgSrc) => {
    navigate("/sem", { state: { folderId, imgSrc, folders } });
  };

  return (
    <div>
      {isLoggedIn ? (
        <>
          <div className="blur1"></div>
          <div style={{ marginTop: "50px" }}>
            <div className={`units-img ${theme}`}></div>
            <div>
              <Sidebar />
              <div className="outer-container-year">
                <h1
                  className={`display-5 text-center cust-text-${theme}`}
                  style={{ zIndex: 1000, marginTop: "15px" }}
                >
                  Year
                </h1>
                <div className="content-year text-center w-50 container-fluid d-flex flex-column align-items-center justify-content-center">
                  <div className="accordion" id="accordionExample">
                    {delayedFolders.map((folder, index) => (
                      <div
                        className={`folder-div-year ${theme} d-flex rounded-3 fw-bold text-white lead justify-content-evenly`}
                        // onClick={() =>
                        //   handleClick(folder._id, "/icons8-folder-96.png")
                        // }
                      >
                        <div
                          key={folder._id}
                          className={`accordion-item ${theme}`}
                        >
                          <h2
                            className="accordion-header"
                            id={`heading${index}`}
                          >
                            <button
                              className={`accordion-button ${theme}`}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#collapse${index}`}
                              aria-expanded="true"
                              aria-controls={`collapse${index}`}
                            >
                              <div className="w-25 text-end align-items-end">
                                {theme === "light" ? (
                                  <img
                                    className="text-start"
                                    src={`/bing/${
                                      false ? "folder" : "open-light"
                                    }.png`}
                                    alt=""
                                    height={"30px"}
                                    style={{ opacity: 1 }}
                                  />
                                ) : (
                                  <img
                                    className="text-start"
                                    src={`/bing/${
                                      false ? "folder1" : "open-dark"
                                    }.png`}
                                    alt=""
                                    height={"40px"}
                                    style={{ opacity: 0.8 }}
                                  />
                                )}
                              </div>
                              <div
                                className={`${theme} w-75 text-start px-3 px-5 align-items-start fw-bold`}
                              >
                                {folder.name}
                              </div>
                            </button>
                          </h2>
                          <div
                            id={`collapse${index}`}
                            className="accordion-collapse collapse"
                            aria-labelledby={`heading${index}`}
                            data-bs-parent="#accordionExample"
                          >
                            <div className="accordion-body">
                              <div
                                className={`btn-group ${theme} text-center`}
                                style={{ margin: "0px", marginTop: "-20px" }}
                              >
                                <button
                                  className={`btn ${theme} active`}
                                  style={{ width: "100px", zIndex: 1000 }}
                                >
                                  Sem1
                                </button>
                                <button
                                  className={`btn ${theme} active`}
                                  style={{ width: "100px", zIndex: 1000 }}
                                >
                                  Sem2
                                </button>
                              </div>
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
        </>
      ) : (
        <p className="display-1 text-center"></p>
      )}
    </div>
  );
}

export default Year;
