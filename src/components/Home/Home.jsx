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
  const [isSlow, setIsSlow] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isClickedSem, setIsClickedSem] = useState(false);
  const [isClickedGate, setIsClickedGate] = useState(false);
  const [isClickedPlacements, setIsClickedPlacements] = useState(false);
  const [isClickedDomains, setIsClickedDomains] = useState(false);
  const navigate = useNavigate();
  let lottie = localStorage.getItem("lottie");
  setTimeout(() => {
    localStorage.setItem("lottie", 2);
  }, 5000);

  useEffect(() => {
    // const notify = localStorage.getItem("notify") || false;
    // if (!notify) {
    //   localStorage.removeItem("userId");
    //   localStorage.removeItem("user");
    //   localStorage.removeItem("username");
    //   navigate("/");
    // }
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
    }, 790);
  }

  function handleOpenDomains() {
    setIsClickedDomains(true);
    setTimeout(() => {
      navigate("/domains");
    }, 790);
  }

  function handleOpenGate() {
    setIsClickedGate(true);
    setTimeout(() => {
      navigate("/gate");
    }, 790);
  }

  function handleOpenPlacements() {
    setIsClickedPlacements(true);
    setTimeout(() => {
      navigate("/placements");
    }, 790);
  }

  useEffect(() => {
    setTimeout(() => {
      setIsSlow(false);
    }, 5000);
  }, []);

  // if (loading) {
  //   return (
  //     <>
  //       <div className="loading-container">
  //         <div className="loading-spinner"></div>
  //         <p className="lead text-black m-3 loading">Site is Under Maintanance...</p>
  //       </div>
  //     </>
  //   );
  // }

  return (
    <div>
      {isLoggedIn ? (
        <div className="img-container">
          <img
            className="d-block logo ms-auto me-auto"
            src="/logo-login1.png"
            alt=""
            height="250px"
          />
          {/* <h1
            className="display-5 text-center text-white cust-text d-block logo ms-auto me-auto"
            style={{ zIndex: 1000, marginTop: "40px" }}
          >
            CoursMate
          </h1> */}
          {isSlow && lottie == 1 ? (
            <>
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
                <Lottie
                  animationData={welcome}
                  style={{ marginInlineStart: "30px" }}
                />
              </div>
            </>
          ) : (
            <>
              <div className="blur1"></div>
              <div className="blr">
                <SideBar />
                <div className="outer-container" style={{ marginTop: "15vh" }}>
                  <div className="blur-home"></div>
                  <div className="content container-fluid d-flex flex-column align-items-center justify-content-center">
                    <div
                      className={`categories sem ${
                        isClickedSem ? "expand-open" : ""
                      } text-decoration-none rounded-3 fw-bold text-black lead p-4`}
                      onClick={handleOpenSem}
                    >
                      <div className="w-100">
                        <div
                          className="px-3 ps-auto d-inline-block text-end"
                          style={{ width: "40%" }}
                        >
                          <img
                            src="/favicons/book.png"
                            alt="book"
                            height="38px"
                            className="ms-auto"
                          />
                        </div>
                        <div
                          className="text-start ps-3 d-inline-block"
                          style={{ width: "60%" }}
                        >
                          SEMESTERS
                        </div>
                      </div>
                    </div>
                    <div
                      className={`categories domains ${
                        isClickedDomains ? "expand-open" : ""
                      } text-decoration-none rounded-3 fw-bold text-black lead p-4`}
                      onClick={handleOpenDomains}
                    >
                      <div className="w-100">
                        <div
                          className="px-3 ps-auto d-inline-block text-end"
                          style={{ width: "40%" }}
                        >
                          <img
                            src="/favicons/domain-home.png"
                            alt="book"
                            height="38px"
                            className="ms-auto"
                          />
                        </div>
                        <div
                          className="text-start ps-3 d-inline-block"
                          style={{ width: "60%" }}
                        >
                          DOMAINS
                        </div>
                      </div>
                    </div>
                    <div
                      className={`categories gate${
                        isClickedGate ? "expand-open" : ""
                      } text-decoration-none rounded-3 fw-bold text-black lead p-4`}
                      onClick={handleOpenGate}
                    >
                      <div className="w-100">
                        <div
                          className="px-3 ps-auto d-inline-block text-end"
                          style={{ width: "40%" }}
                        >
                          <img
                            src="/favicons/gate.png"
                            alt="book"
                            height="38px"
                            className="ms-auto"
                          />
                        </div>
                        <div
                          className="text-start ps-3 d-inline-block"
                          style={{ width: "60%" }}
                        >
                          GATE
                        </div>
                      </div>
                    </div>
                    <div
                      className={`categories placements${
                        isClickedPlacements ? "expand-open" : ""
                      } text-decoration-none rounded-3 fw-bold text-black lead p-4`}
                      onClick={handleOpenPlacements}
                    >
                      <div className="w-100">
                        <div
                          className="px-3 ps-auto d-inline-block text-end"
                          style={{ width: "40%" }}
                        >
                          <img
                            src="/favicons/job.png"
                            alt="book"
                            height="38px"
                            className="ms-auto"
                          />
                        </div>
                        <div
                          className="text-start ps-3 d-inline-block"
                          style={{ width: "60%" }}
                        >
                          PLACEMENTS
                        </div>
                      </div>
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
