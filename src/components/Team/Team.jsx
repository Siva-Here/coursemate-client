import React, { useEffect, useState } from "react";
import "./Team.css";
import Sidebar from "../navbar/Sidebar";
import { useNavigate } from "react-router-dom";

const Team = () => {
  const [user, setUser] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const storedUser = localStorage.getItem("user") || false;
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate("/");
    }
  });
  return (
    <>
      {user ? (
        <div className="container-fluid">
          <div style={{ marginTop: "50px" }}>
            <div className="img-container-sem"></div>
            <Sidebar />
            <h1
              className="display-4 text-center text-light blinking-text-team"
              style={{ fontSize: "48px" }}
            >
              Web Team
            </h1>
            <div className="home-container d-flex row justify-content-evenly">
              <div className="profile-card col-12 col-md-6 order-2 shrink">
                <div className="img">
                  <img
                    className="person"
                    src="/favicons/charan3.png"
                    alt="Profile"
                    width="180px"
                  />
                </div>
                <div className="caption mb-5">
                  <h2 className="blinking-text-team">Tvnl Charan</h2>
                  <p className="blinking-text-team">Full Stack Developer</p>
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
              <div className="profile-card col-12 col-md-6 order-1 shrink">
                <div className="img">
                  <img
                    className="person"
                    src="/favicons/siva4.png"
                    alt="Profile"
                    style={{ marginBottom: "150px" }}
                  />
                </div>
                <div className="caption mb-5">
                  <h2 className="blinking-text-team">Siva Shankar</h2>
                  <p className="blinking-text-team">Full Stack Developer</p>
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
