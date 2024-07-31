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
      uploadedBy: "Site is Under Maintanance...",
      name: "",
      _id: "",
      description: "",
      rscLink: "",
    },
  ]);

  const [loading, setLoading] = useState(true);
  const [isSlow, setIsSlow] = useState(false);
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
    setLoading(false);
    setNotifications(sortedNotifications);
  };

  useEffect(() => {
    setTimeout(() => {
      setIsSlow(true);
    }, 2000);
    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner-notification"></div>
        <p className="lead text-white m-3 loading">
          Site is Under Maintanance...
        </p>
        {isSlow ? (
          <p className="text-white m-3 loading">
            Server is Busy! Please wait...
          </p>
        ) : (
          <p></p>
        )}
      </div>
    );
  }
  return (
    <>
      {isLoggedIn ? (
        <>
          <div className={`img-container2 ${theme}`}></div>
          <Sidebar />
          <div
            className={`outer-container-sem ${isExpanded ? "expanded" : ""}`}
          >
            <h1
              className={`display-5 text-center cust-text-${theme}`}
              style={{ zIndex: 1000, margin: "25px", maxWidth: "799px" }}
            >
              Notifications
            </h1>
            {Notifications.map((Notification) => (
              <div key={Notification.name} className="Notification-div">
                <div className="Notification-content">
                  <p className="Notification-user">
                    Uploaded by: {Notification.uploadedBy}
                  </p>
                  <p className="text-uppercase fw-bold fst-italic font-italic">
                    {" "}
                    {Notification.name}
                  </p>
                  <p>{Notification.description}</p>
                  <p>
                    Link:{""}
                    <a
                      href={Notification.rscLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "red" }}
                    >
                      {Notification.rscLink}
                    </a>
                  </p>
                </div>
                <br />
                <div className="Notification-date">
                  <p style={{ fontSize: "1.2em" }}>
                    Posted at: {formatTimestamp(Notification.uploadedAt)}
                  </p>
                </div>
              </div>
            ))}
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
