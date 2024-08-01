import React, { useEffect, useState, useRef, useContext } from "react";
import { BiSolidCategory } from "react-icons/bi";
import { TbLogout2 } from "react-icons/tb";
import { NavLink, useLocation } from "react-router-dom";
import "./Sidebar.css";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../../AuthContext";
import { ThemeContext } from "../../ThemeContext";
import { NavContext } from "../../NavContext";
import { NavbarContext } from "../../NavbarContext";

function Sidebar() {
  const { isExpanded, setIsExpanded } = useContext(NavbarContext);
  const [username, setUsername] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const menuButtonRef = useRef(null);
  const { setIsLoggedIn } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const { selected, setSelected } = useContext(NavContext);
  const location = useLocation();

  const routeToItemMap = {
    "/home": "Home",
    "/year": "Year",
    "/placements": "Placements",
    "/gate": "Gate",
    "/domains": "Domains",
    "/placements": "Placements",
    "/contribution": "Contributions",
    "/notifications": "Notifications",
    "/team": "Web Team",
    "/admin": "Admin Page",
  };

  useEffect(() => {
    try {
      const user = jwtDecode(localStorage.getItem("user"));
      const email = user.email;
      setUsername(email.split("@")[0].toUpperCase());
      setProfile(user.picture);
      if (process.env.REACT_APP_ADMIN_EMAILS.split(",").includes(email)) {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setIsExpanded(window.innerWidth >= 768);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const clickSound = new Audio("/nav.aac");
  clickSound.volume = 0.05;

  function handleLogOut() {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    window.location.reload();
    // playClickSound();
  }

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
    // playClickSound();
  };

  useEffect(() => {
    const selectedItem = routeToItemMap[location.pathname];
    if (selectedItem) {
      setSelected(selectedItem);
    }
  }, [location.pathname]);

  return (
    <div className={`wrapper ${isExpanded ? "expand" : ""}`}>
      <aside id="sidebar" className={isExpanded ? `expand-${theme}` : ""}>
        <div className="d-flex menu-button" ref={menuButtonRef}>
          <button className="toggle-btn" type="button" onClick={toggleSidebar}>
            <BiSolidCategory className={`fs-1 home-icon icons ${theme}`} />
            <h5 className={`${theme}`}>Menu</h5>
          </button>
          <div className="sidebar-logo fw-bold">
            {username !== null ? (
              <div className={`usrname ${theme}`}>
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
              ""
            )}
          </div>
        </div>
        <ul
          className={`my-0 sidebar-nav ${
            isExpanded ? "d-inline" : "d-none s-sm-inline"
          }`}
          style={{ overflow: "auto" }}
        >
          <li
            className={`sidebar-item text-start ms-2 ${
              selected === "Home" ? `selected ${theme}` : ""
            }`}
            onClick={() => {
              setIsExpanded(false || window.innerWidth >= 768);
            }}
          >
            <NavLink to="/home" className="sidebar-link">
              <img src="/favicons/home.png" height={"32px"} alt="" />
              <span className={`${theme} ms-3 fw-bold`}>Home</span>
            </NavLink>
          </li>
          <li
            className={`sidebar-item mt-2 text-start ms-2 ${
              selected === "Year" ? `selected ${theme}` : ""
            }`}
            onClick={() => {
              setIsExpanded(false || window.innerWidth >= 768);
            }}
          >
            <NavLink to="/year" className="sidebar-link">
              <img src="/favicons/book.png" height={"32px"} alt="" />
              <span className={`${theme} ms-3 fw-bold`}>Year</span>
            </NavLink>
          </li>
          <li
            className={`sidebar-item mt-2 text-start ms-2 ${
              selected === "Domains" ? `selected ${theme}` : ""
            }`}
            onClick={() => {
              setIsExpanded(false || window.innerWidth >= 768);
            }}
          >
            <NavLink to="/domains" className="sidebar-link">
              <img src="/favicons/computer.png" height={"32px"} alt="" />
              <span className={`${theme} ms-3 fw-bold`}>Domains</span>
            </NavLink>
          </li>
          <li
            className={`sidebar-item mt-1 text-start ms-2 ${
              selected === "Gate" ? `selected ${theme}` : ""
            }`}
            onClick={() => {
              setIsExpanded(false || window.innerWidth >= 768);
            }}
          >
            <NavLink to="/gate" className="sidebar-link">
              <img src="/favicons/gate.png" height={"32px"} alt="" />
              <span className={`${theme} ms-3 fw-bold`}>Gate</span>
            </NavLink>
          </li>
          <li
            className={`sidebar-item mt-1 text-start ms-2 ${
              selected === "Placements" ? `selected ${theme}` : ""
            }`}
            onClick={() => {
              setIsExpanded(false || window.innerWidth >= 768);
            }}
          >
            <NavLink to="/placements" className="sidebar-link">
              <img src="/favicons/job.png" height={"32px"} alt="" />
              <span className={`${theme} ms-3 fw-bold`}>Placements</span>
            </NavLink>
          </li>
          <li
            className={`sidebar-item mt-2 text-start ms-2 ${
              selected === "Contributions" ? `selected ${theme}` : ""
            }`}
            onClick={() => {
              setIsExpanded(false || window.innerWidth >= 768);
            }}
          >
            <NavLink to="/contribution" className="sidebar-link">
              <img src="/favicons/star1.png" height={"32px"} alt="" />
              <span className={`${theme} ms-3 fw-bold`}>Contributions</span>
            </NavLink>
          </li>
          <li
            className={`sidebar-item mt-1 text-start ms-2 ${
              selected === "Notifications" ? `selected ${theme}` : ""
            }`}
            onClick={() => {
              setIsExpanded(false || window.innerWidth >= 768);
            }}
          >
            <NavLink to="/notifications" className="sidebar-link">
              <div style={{ display: "inline" }}>
                <div className="notify"></div>
                <img src="/favicons/message1.png" height={"32px"} alt="" />
              </div>
              <span className={`${theme} ms-3 fw-bold`}>Notifications</span>
            </NavLink>
          </li>
          <li
            className={`sidebar-item mt-1 text-start ms-2 ${
              selected === "Web Team" ? `selected ${theme}` : ""
            }`}
            onClick={() => {
              setIsExpanded(false || window.innerWidth >= 768);
            }}
          >
            <NavLink to="/team" className="sidebar-link">
              <img src="/favicons/coding.png" height={"32px"} alt="" />
              <span className={`${theme} ms-3 fw-bold`}>Web Team</span>
            </NavLink>
          </li>
          {isAdmin ? (
            <li
              className={`sidebar-item mt-2 text-start ms-2 ${
                selected === "Admin Page" ? `selected ${theme}` : ""
              }`}
              onClick={() => {
                setIsExpanded(false || window.innerWidth >= 768);
              }}
            >
              <NavLink to="/admin" className="sidebar-link">
                <img src="/favicons/admin.png" height={"32px"} alt="" />
                <span className={`${theme} ms-3 fw-bold`}>Admin Page</span>
              </NavLink>
            </li>
          ) : null}
          <li className={`sidebar-item mt-2 text-start ms-2`}>
            <div
              className={`sidebar-footer mb-3 wrapper ${
                isExpanded ? "" : "d-none"
              }`}
              onClick={handleLogOut}
            >
              <NavLink to="/" onClick={handleLogOut}>
                <TbLogout2 className="fs-3 icons" />
                <span className="ms-4 navbar-link ms-2 mb-5 text-danger fw-bold">
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
