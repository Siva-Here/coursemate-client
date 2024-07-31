import React, { useState, useEffect, useContext } from "react";
import "./Contribution.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../navbar/Sidebar";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { ThemeContext } from "../../ThemeContext";
import { NavbarContext } from "../../NavbarContext";

const Contribution = () => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSlow, setIsSlow] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("user") || null;
  const { theme } = useContext(ThemeContext);
  const { isExpanded } = useContext(NavbarContext);

  const fetchContributions = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API_URL}/user/contributions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const sortedContributions = response.data
          .sort((a, b) => b.totalUploaded - a.totalUploaded)
          .slice(0, 10);
        setContributions(sortedContributions);
        setLoading(false);
      } else {
        toast.error("Failed to fetch contributions. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching contributions:", error);
      toast.error("Failed to fetch contributions. Please try again later.");
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
    fetchContributions();
  }, []);

  const getMedalImage = (index) => {
    switch (index) {
      case 0:
        return "favicons/1st.png";
      case 1:
        return "favicons/2nd.png";
      case 2:
        return "favicons/3rd-place.png";
      default:
        return "favicons/medal.png";
    }
  };

  if (loading) {
    setTimeout(() => {
      setIsSlow(true);
    }, 4000);
    return (
      <div className="loading-container1">
        <div className="loading-spinner-leaderboard"></div>
        <p className="lead text-white m-3 loading1">
          Site is Under Maintanance...
        </p>
        {/* {isSlow ? (
          <p className="text-white m-3 loading">
            Server is Busy! Please wait...
          </p>
        ) : (
          <p></p>
        )} */}
      </div>
    );
  }

  return (
    <>
      {isLoggedIn ? (
        <>
          <ToastContainer />
          <div
            className={`outer-container-year ${isExpanded ? "expanded" : ""}`}
          >
            <Sidebar />
            <h1
              className={`display-5 text-center cust-text-${theme}`}
              style={{ zIndex: 1000, marginTop: "50px" }}
            >
              Leaderboard
            </h1>
            <div className={`img-container2 ${theme}`}></div>
            <div className="contributions-container">
              {contributions.map((contribution, index) => (
                <div
                  key={contribution._id}
                  className={`contribution-div ${theme}`}
                >
                  <img
                    className="medal-image"
                    src={getMedalImage(index)}
                    alt=""
                    height="40px"
                    width="40px"
                  />
                  <div className="name-div ms-3 ps-3">
                    <p className={`fw-bold username ${theme}`}>
                      {contribution.username}
                    </p>
                  </div>
                  <div className="totaluploaded-div ">
                    <p className={`totaluploaded fw-bold ${theme}`}>
                      {contribution.totalUploaded}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <p className="display-1 text-white"></p>
      )}
    </>
  );
};

export default Contribution;
