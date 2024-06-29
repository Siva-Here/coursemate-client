import React, { useEffect, useState } from "react";
import { BiSolidCategory } from "react-icons/bi";
import { TbLogout2 } from "react-icons/tb";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import { jwtDecode } from "jwt-decode";

function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [username, setUsername] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    try {
      const user = jwtDecode(localStorage.getItem("user"));
      const email = user.email;
      setUsername(email.split("@")[0].toUpperCase());
      setProfile(user.picture);
    } catch (error) {
      console.error(error);
    }
  });

  const clickSound = new Audio("/nav.aac");

  function handleLogOut() {
    localStorage.removeItem("user");
    playClickSound();
  }

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
    playClickSound();
  };

  const playClickSound = () => {
    clickSound.play();
  };

  return (
    <div className={`wrapper ${isExpanded ? "expand" : ""}`}>
      <aside id="sidebar" className={isExpanded ? "expand" : ""}>
        <div className="d-flex">
          <button className="toggle-btn" type="button" onClick={toggleSidebar}>
            <BiSolidCategory className="fs-1 text-white home-icon icons" />
            <h5 className="mt-2 text-white">Menu</h5>
          </button>
          <div className="sidebar-logo text-white fw-bold">
            {username !== null ? (
              <div>
                <img
                  src={`${profile}`}
                  alt=""
                  width={"30px"}
                  height={"30px"}
                  style={{ borderRadius: "50%", margin: "10px" }}
                />
                {username}
              </div>
            ) : (
              "CoursMate"
            )}
          </div>
        </div>
        <ul
          className={`my-0 sidebar-nav ${
            isExpanded ? "d-inline" : "d-none s-sm-inline"
          }`}
        >
          <li className="sidebar-item mt-3 text-start ms-2">
            <NavLink
              to="/home"
              className="sidebar-link"
              onClick={playClickSound}
            >
              <img src="/favicons/home.png" height={"32px"} alt="" />
              <span className="ms-3 fw-bold">Home</span>
            </NavLink>
          </li>
          <li className="sidebar-item mt-3 text-start ms-2">
            <NavLink
              to="/sem"
              className="sidebar-link"
              onClick={playClickSound}
            >
              <img src="/favicons/book.png" height={"32px"} alt="" />
              <span className="ms-3 fw-bold">Semesters</span>
            </NavLink>
          </li>
          <li className="sidebar-item mt-3 text-start ms-2">
            <NavLink
              to="/domains"
              className="sidebar-link"
              onClick={playClickSound}
            >
              <img src="/favicons/computer.png" height={"32px"} alt="" />
              <span className="ms-3 fw-bold">Domains</span>
            </NavLink>
          </li>
          <li className="sidebar-item mt-3 text-start ms-2">
            <NavLink
              to="/contribution"
              className="sidebar-link"
              onClick={playClickSound}
            >
              <img src="/favicons/star1.png" height={"32px"} alt="" />
              <span className="ms-3 fw-bold">Contributions</span>
            </NavLink>
          </li>
          <li className="sidebar-item mt-3 text-start ms-2">
            <NavLink
              to="/notifications"
              className="sidebar-link"
              onClick={playClickSound}
            >
              <div style={{ display: "inline" }}>
                <div className="notify"></div>
                <img src="/favicons/message1.png" height={"32px"} alt="" />
              </div>
              <span className="ms-3 fw-bold">Notifications</span>
            </NavLink>
          </li>
          <li className="sidebar-item mt-3 text-start ms-2">
            <NavLink
              to="/team"
              className="sidebar-link"
              onClick={playClickSound}
            >
              <img src="/favicons/coding.png" height={"32px"} alt="" />
              <span className="ms-3 fw-bold">Web Team</span>
            </NavLink>
          </li>
          <li className="sidebar-item mt-3 text-start ms-2">
            <div
              className={`sidebar-footer mb-3 wrapper ${
                isExpanded ? "" : "d-none"
              }`}
              onClick={handleLogOut}
            >
              <NavLink to="/" onClick={handleLogOut}>
                <TbLogout2 className="fs-3 text-white icons" />
                <span
                  className="ms-4 navbar-link ms-2 mb-5 text-danger fw-bold"
                  style={{ marginBottom: "100px" }}
                >
                  SignOut
                </span>
              </NavLink>
            </div>
          </li>
        </ul>
      </aside>
    </div>
  );
}

export default Sidebar;
