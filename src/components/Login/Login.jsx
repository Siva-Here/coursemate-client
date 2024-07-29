import React, { useContext, useEffect } from "react";
import axios from "axios";
import "./Login.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../AuthContext";
import { IdContext } from "../../IdContext";

function Login() {
  const { setIsLoggedIn } = useContext(AuthContext);
  const { setUserId } = useContext(IdContext);

  function handleCallbackResponse(response) {
    const token = response.credential;
    const notify = JSON.parse(localStorage.getItem("notify"));

    axios
      .post(
        `${process.env.REACT_APP_BASE_API_URL}/user/login`,
        {
          token: notify,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setIsLoggedIn(true);
          setUserId(res.data._id);
          localStorage.setItem("userId", res.data._id);
          localStorage.setItem("username", res.data.username);
          toast.success("Login Successful!");
          localStorage.setItem("user", JSON.stringify(token));
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else if (res.status === 201) {
          localStorage.setItem("user", JSON.stringify(token));
          localStorage.setItem("username", res.data.user.username);
          localStorage.setItem("userId", res.data.user._id);
          setUserId(res.data.user._id);
          setIsLoggedIn(true);
          toast.success("Sign up Successful! Welcome to coursemate!");
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          toast.error("Failed to Login! Try with Your College Email!");
        }
      })
      .catch((error) => {
        toast.error("Failed to login! Try Again!");
      });
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: process.env.REACT_APP_CLIENT_ID,
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
    });

    google.accounts.id.prompt();
  }, []);

  return (
    <div className="login-container">
      <ToastContainer />
      <div className="login-content row">
        <h1
          className={`display-5 text-center cust-text-dark`}
          style={{
            zIndex: 1000,
            marginTop: "15px",
            fontFamily: "Julius Sans One",
          }}
        >
          Welcome To CoursMate
        </h1>
        <div className="login-left justify-content-center col-12 col-sm-12 col-md-6">
          <img
            src="/logo-login1.png"
            height={"300px"}
            alt="Coursemate"
            style={{ borderRadius: "50%" }}
            className="coursmate-img"
          />
        </div>
        <div className="login-right justify-content-center col-12 col-sm-12 col-md-6">
          <div id="signInDiv"></div>
        </div>
      </div>
    </div>
  );
}

export default Login;
