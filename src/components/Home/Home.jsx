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
      navigate("/year");
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
          <img
            className="d-block logo ms-auto me-auto"
            src="/home.png"
            alt=""
            height="250px"
          />
          <div className="blur1"></div>
          <div className="blur">
            <SideBar />
            <div className="outer-container">
              <div className="blur-home"></div>
              <div className="content container-fluid d-flex flex-column align-items-center justify-content-center">
                <div
                  className={`categories ${
                    isClickedSem ? "expand-open" : ""
                  } text-decoration-none rounded-3 fw-bold text-white lead p-4`}
                  onClick={handleOpenSem}
                >
                  <img
                    src="/favicons/book.png"
                    alt="book"
                    height="38px"
                    className="me-3"
                  />
                  SEMESTERS
                </div>
                <div
                  className={`categories ${
                    isClickedDomains ? "expand-open" : ""
                  } text-decoration-none rounded-3 fw-bold text-white lead p-4`}
                  onClick={handleOpenDomains}
                >
                  <img
                    src="/favicons/domain-home.png"
                    alt="book"
                    height="40px"
                    className="me-3"
                  />
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
