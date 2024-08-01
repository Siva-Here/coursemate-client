import React, { useState, useEffect, useContext } from "react";
import "./Notification.css";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../navbar/Sidebar";
import { ResourceContext } from "../../ResourceContext";
import { AuthContext } from "../../AuthContext";
import { ThemeContext } from "../../ThemeContext";
import { NavbarContext } from "../../NavbarContext";

const Notification = () => {
  const { resources } = useContext(ResourceContext);
  const { theme } = useContext(ThemeContext);
  const { isExpanded } = useContext(NavbarContext);
  const [Notifications, setNotifications] = useState([
    {
      uploadedBy: "Loading...",
      name: "",
      _id: "",
      description: "",
      rscLink: "",
    },
  ]);
  const { isLoggedIn } = useContext(AuthContext);

  const fetchNotifications = () => {
    const sortedResources = resources
      .filter((rsc) => {
        return rsc.byAdmin && !rsc.isPlacement;
      })
      .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));

    const data = sortedResources.filter((notification) => {
      return notification.byAdmin;
    });
    const sortedNotifications = data.sort((a, b) =>
      b.uploadedAt.localeCompare(a.uploadedAt)
    );
    setNotifications(sortedNotifications);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <>
      {isLoggedIn ? (
        <>
          <div style={{ marginTop: "50px" }}></div>
          <div className={`img-container2 ${theme}`}></div>
          <div>
            <Sidebar />
            <div
              className={`outer-container-year justify-content-center ${
                isExpanded ? "expanded" : ""
              }`}
            >
              <h1
                className={`display-5 text-center cust-text-${theme}`}
                style={{ zIndex: 1000, marginTop: "15px" }}
              >
                Notifications
              </h1>
              <div className="mt-5">
                {Notifications.map((Notification) => (
                  <div
                    key={Notification.name}
                    className={`Notification-div ms-auto me-auto ${theme}`}
                  >
                    <span className="top"></span>
                    <span className="left"></span>
                    <span className="right"></span>
                    <span className="bottom"></span>
                    <div className="Notification-content">
                      <p className="Notification-user">
                        Posted by: {Notification.uploadedBy}
                      </p>
                      <p className="text-uppercase fw-bold fst-italic font-italic">
                        {" "}
                        {Notification.name}
                      </p>
                      <p>{Notification.description}</p>
                      <p>
                        Link: {""}
                        <a
                          href={Notification.rscLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "blue" }}
                        >
                          {Notification.rscLink}
                        </a>
                      </p>
                    </div>
                    <br />
                    <div className={`Notification-date ${theme}`}>
                      <p style={{ fontSize: "1.2em" }}>
                        Posted at: {formatTimestamp(Notification.uploadedAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="display-1 text-white"></p>
      )}
    </>
  );
};

const formatTimestamp = (timestamp) => {
  const d = new Date(timestamp);
  const date = new Date(d - -19800000);
  const formattedDate = date.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return formattedDate.replace(",", "");
};

export default Notification;
