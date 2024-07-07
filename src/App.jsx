import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Home from "./components/Home/Home";
import Subjects from "./components/Subjects/Subjects";
import "./App.css";
import Login from "./components/Login/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import Domains from "./components/Domains/Domains";
import Units from "./components/Units/Units";
import Content from "./components/Content/Content";
import Sem from "./components/Sem/Sem";
import Year from "./components/Year/Year";
import Team from "./components/Team/Team";
import { useEffect, useState } from "react";
import axios from "axios";
import Notification from "./components/Notifications/Notification";
import Resource from "./components/Resource/Resource";
import Contribution from "./components/Contribution/Contribution";
import Admin from "./components/Admin/Admin";
import useClickSound from "./components/SoundHook/useClickSound";
import clickSoundFile from "./click.mp3";

import { jwtDecode } from "jwt-decode";
function App() {
  useClickSound(clickSoundFile, []);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSlow, setIsSlow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("user");
    try {
      if (jwtDecode(token).email.endsWith("@rguktn.ac.in")) {
        navigate("/home");
      }
    } catch (error) {
    } finally {
      axios
        .get(`${process.env.REACT_APP_BASE_API_URL}/folder/folders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setFolders(response.data);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    }
  }, []);

  if (loading) {
    setTimeout(() => {
      setIsSlow(true);
    }, 4000);
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="lead text-white m-3 loading">Loading...</p>
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
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/subjects" element={<Subjects folders={folders} />} />
        <Route path="/domains" element={<Domains folders={folders} />} />
        <Route path="/units" element={<Units folders={folders} />} />
        <Route path="/content" element={<Content />} />
        <Route path="/sem" element={<Sem folders={folders} />} />
        <Route path="/year" element={<Year folders={folders} />} />
        <Route path="/team" element={<Team />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/contribution" element={<Contribution />} />
        <Route path="/resource" element={<Resource />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}

export default App;
