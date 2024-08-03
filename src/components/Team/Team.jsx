import React, { useContext, useEffect, useState } from "react";
import "./Team.css";
import Sidebar from "../navbar/Sidebar";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { ThemeContext } from "../../ThemeContext";
import { NavbarContext } from "../../NavbarContext";

const Team = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const { isExpanded } = useContext(NavbarContext);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, []);
  return (
    <>
      {isLoggedIn ? (
        <div className="container">
          <h1
            className={`text-center cust-text-${theme} ${
              isExpanded ? "expanded" : ""
            }`}
            style={{ zIndex: 1000, marginTop: "75px" }}
          >
            Web Team
          </h1>
          <div style={{ marginTop: "50px" }}>
            <div className={`img-container-team ${theme}`}></div>
            {theme == "dark" && (
              <>
                <div className="blur1"></div>
                <div className="blur1"></div>
              </>
            )}
            <Sidebar />
            <div
              className="outer-container-gate d-flex row justify-content-evenly"
              // style={{ maxWidth: "80vw" }}
            >
              <div
                className={`profile-card col-12 col-md-6 mx-5 order-2 shrink ${theme}`}
              >
                <div className="img">
                  <img
                    className="person"
                    src="/favicons/charan3.png"
                    alt="Profile"
                    width="180px"
                    style={{ marginTop: "50px" }}
                  />
                </div>
                <div className="caption mb-5">
                  <h2 className="cust-text-dark fw-normal">Tvnl Charan</h2>
                  <p className="cust-text-dark fw-normal">
                    Full Stack Developer
                  </p>
                  <div className="social-links">
                    <div className="button-container mb-5">
                      <a
                        href="https://in.linkedin.com/in/tvnl-charan-726545262"
                        className="glass-btn blue-btn linkedIn"
                      >
                        <img
                          src="/favicons/linkedin.png"
                          alt="linkedin"
                          style={{ width: "1.5em" }}
                        />
                      </a>

                      <a
                        href="mailto: n200232@rguktn.ac.in"
                        className="glass-btn red-btn insta"
                      >
                        <img
                          src="/favicons/gmail.png"
                          alt="gmail"
                          style={{ width: "1.5em" }}
                        />
                      </a>
                      <a
                        href="https://wa.me/7075464701"
                        className="glass-btn amber-btn whatsApp"
                      >
                        <img
                          src="/favicons/whatsapp.png"
                          alt="whatsapp"
                          style={{ width: "1.5em" }}
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={`profile-card col-12 col-md-6 mx-5 order-1 shrink ${theme}`}
              >
                <div className="img">
                  <img
                    className="person"
                    src="/favicons/siva4.png"
                    alt="Profile"
                  />
                </div>
                <div className="caption mb-5">
                  <h2 className="cust-text-dark fw-normal">Siva Shankar</h2>
                  <p className="cust-text-dark fw-normal">
                    Full Stack Developer
                  </p>
                  <div className="social-links">
                    <div className="button-container">
                      <a
                        href="https://linkedin.com/in/siva-guttula-561995258"
                        className="glass-btn blue-btn linkedIn"
                      >
                        <img
                          src="/favicons/linkedin.png"
                          alt="linkedin"
                          style={{ width: "1.5em" }}
                        />
                      </a>

                      <a
                        href="mailto: n200086@rguktn.ac.in"
                        className="glass-btn red-btn insta"
                      >
                        <img
                          src="/favicons/gmail.png"
                          alt="gmail"
                          style={{ width: "1.5em" }}
                        />
                      </a>

                      <a
                        href="https://wa.me/7660869697"
                        className="glass-btn amber-btn whatsApp"
                      >
                        <img
                          src="/favicons/whatsapp.png"
                          alt="whatsapp"
                          style={{ width: "1.5em" }}
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Team;
