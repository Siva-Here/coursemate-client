import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../navbar/Sidebar";
import "./Home.css";
import { AuthContext } from "../../AuthContext";
import axios from "axios";
import Lottie from "lottie-react";
import welcome from "./welcome.json";

function Home() {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [isClickedSem, setIsClickedSem] = useState(false);
  const [isSlow, setIsSlow] = useState(true);
  const [isClickedDomains, setIsClickedDomains] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId") || false;
    if (!userId) {
      navigate("/");
    }
    const token = localStorage.getItem("user") || false;
    const token1 = localStorage.getItem("user") || false;
    localStorage.removeItem("user");
    localStorage.setItem("user", token);
    axios
      .post(
        `${process.env.REACT_APP_BASE_API_URL}/user/exists`,
        { _id: userId },
        {
          headers: {
            Authorization: `Bearer ${token1}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setIsLoggedIn(true);
          setLoading(false);
        }
      })
      .catch((error) => {});
    // } else {
    //   navigate("/");
    // }
  }, []);

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

  useEffect(() => {
    setTimeout(() => {
      setIsSlow(false);
    }, 5000);
  }, []);

  if (loading) {
    return (
      <>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="lead text-white m-3 loading">Loading...</p>
        </div>
      </>
    );
  }

  return (
    <div>
      {isLoggedIn ? (
        <div className="img-container">
          <img
            className="d-block logo ms-auto me-auto"
            src="/home.png"
            alt=""
            height="250px"
          />
          {isSlow ? (
            <div
              className="lottie"
              style={{ zIndex: 1000, position: "absolute" }}
            >
              <h1
                className="lead fw-bold text-center cust-text welcome"
                style={{ fontSize: "2rem" }}
              >
                Welcome
              </h1>
              <Lottie animationData={welcome} />
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Home;
