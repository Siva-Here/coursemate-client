import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../navbar/Sidebar";
import "./Home.css";

function Home() {
  const [user, setUser] = useState(null);
  const [isClickedSem, setIsClickedSem] = useState(false);
  const [isClickedDomains, setIsClickedDomains] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user") || false;
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate("/");
    }
  }, [navigate]);

  function handleOpenSem() {
    setIsClickedSem(true);
    setTimeout(() => {
      navigate("/sem");
    }, 450);
  }
  function handleOpenDomains() {
    setIsClickedDomains(true);
    setTimeout(() => {
      navigate("/domains");
    }, 450);
  }

  return (
    <div>
      {user ? (
        <div className="img-container">
          <div className="blur">
            <SideBar />
            <div className="outer-container">
              <div className="content container-fluid d-flex flex-column align-items-center justify-content-center">
                <div
                  className={`categories ${
                    isClickedSem ? "expand-open" : ""
                  } text-decoration-none rounded-3 fw-bold text-white lead p-4`}
                  onClick={handleOpenSem}
                >
                  SEMESTERS
                </div>
                <div
                  className={`categories ${
                    isClickedDomains ? "expand-open" : ""
                  } text-decoration-none rounded-3 fw-bold text-white lead p-4`}
                  onClick={handleOpenDomains}
                >
                  DOMAINS
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
}

export default Home;
