import React, { useEffect, useState } from "react";
import "./Domains.css";
import Sidebar from "../navbar/Sidebar";
import { useNavigate } from "react-router-dom";

function Domains({ folders }) {
  const [delayedFolders, setDelayedFolders] = useState([]);
  const [user, setUser] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate("/");
    }

    let timer;
    const rootFolders = folders.filter(
      (folder) => !folder.parentFolder && !folder.isSubject && !folder.isSem
    );

    rootFolders.forEach((folder, index) => {
      timer = setTimeout(() => {
        setDelayedFolders((prevFolders) => [...prevFolders, folder]);
      }, index * 75);
    });

    return () => {
      clearTimeout(timer);
    };
  }, [folders]);

  return (
    <div>
      {user ? (
        <>
          <div className="blur1"></div>
          <div style={{ marginTop: "50px" }}>
            <div className="img-container2"></div>
            <div>
              <Sidebar />
              <div className="outer-container-domains">
                <h1 className="display-1 text-center text-white blinking-text-domains">
                  Domains
                </h1>
                <div className="content-domains text-center w-50 container-fluid d-flex flex-column align-items-center justify-content-center">
                  {delayedFolders.map((folder) => (
                    <div
                      key={folder._id}
                      className="domains-div d-flex rounded-3 fw-bold text-white lead p-4 justify-content-evenly"
                    >
                      <div className="w-25 text-end align-items-end">
                        <img
                          className="text-start"
                          src={`/favicons/${folder.name}.png`}
                          alt=""
                          height={"40px"}
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

export default Domains;
