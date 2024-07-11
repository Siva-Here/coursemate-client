import React, { useContext, useEffect } from "react";
import axios from "axios";
import "./Login.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../AuthContext";
import { IdContext } from "../../IdContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const { setIsLoggedIn } = useContext(AuthContext);
  const { setUserId } = useContext(IdContext);
  const navigate = useNavigate();

  function handleCallbackResponse(response) {
    const token = response.credential;

    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}/user/login`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
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
          console.log(res.data);
          localStorage.setItem("user", JSON.stringify(token));
          localStorage.setItem("username", res.data.user.username);
          localStorage.setItem("userId", res.data.user._id);
          setUserId(res.data.user._id);
          setIsLoggedIn(true);
          console.log(res.data.user._id);
          toast.success("Sign up Successful! Welcome to coursemate!");
          setTimeout(() => {
            window.location.reload();
          }, 19500);
        } else {
          toast.error("Failed to Login! Try with Your College Email!");
        }
      })
      .catch(() => {
        toast.error("Failed to login!");
      });
    //   if (res.status === 200) {
    //     const user = jwtDecode(token);
    //     const username = user.family_name;
    //     const email = user.email;

    //     axios
    //       .get(`${process.env.REACT_APP_BASE_API_URL}/user/users`)
    //       .then((userRes) => {
    //         const users = userRes.data;
    //         const userExists = users.some((u) => u.email === email);

    //         if (!userExists) {
    //           axios
    //             .post(`${process.env.REACT_APP_BASE_API_URL}/user/create`, {
    //               username,
    //               email,
    //             })
    //             .then((createRes) => {
    //               if (createRes.status === 201) {
    //                 localStorage.setItem("user", JSON.stringify(token));
    //                 setIsLoggedIn(true);
    //                 toast.success("Login Successful!");
    //                 setTimeout(() => {
    //                   navigate("/home");
    //                 }, 1500);
    //               } else {
    //                 toast.error("Error logging in. Please try again.");
    //               }
    //             })
    //             .catch((error) => {
    //               console.error("Error creating user:", error);
    //               toast.error("Error logging in. Please try again.");
    //             });
    //         } else {
    // setIsLoggedIn(true);
    // toast.success("Login Successful!");
    // localStorage.setItem("user", JSON.stringify(token));
    // navigate("/home");
    //         }
    //       })
    //       .catch((error) => {
    //         console.error("Error fetching users:", error);
    //         toast.error("Error logging in. Please try again.");
    //       });
    //   }
    // })
    // .catch((error) => {
    //   if (error.response && error.response.status === 401) {
    //     toast.error("Please login with your college Mail ID");
    //   } else {
    //     console.error("Login error:", error);
    //     toast.error("An error occurred during login. Please try again.");
    //   }
    // });
  }

  // useEffect(() => {
  //   const token = localStorage.getItem("user") || false;
  //   let email;
  //   if (token) {
  //     try {
  //       email = jwtDecode(token).email;
  //     } catch (error) {}
  //     axios
  //       .post(
  //         `${process.env.REACT_APP_BASE_API_URL}/user/getUserId`,
  //         { email },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       )
  //       .then((res) => {
  //         if (res.status === 200) {
  //           setIsLoggedIn(true);
  //           navigate("/home");
  //         }
  //       })
  //       .catch((error) => {});
  //   }
  // }, []);

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
        <h1 className="display-5 fw-bold text-center cust-text">
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
