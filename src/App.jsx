import { Route, Routes, useNavigate } from "react-router-dom";
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
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Notification from "./components/Notifications/Notification";
import Resource from "./components/Resource/Resource";
import Contribution from "./components/Contribution/Contribution";
import Admin from "./components/Admin/Admin";
import useClickSound from "./components/SoundHook/useClickSound";
import clickSoundFile from "./click.mp3";
import { jwtDecode } from "jwt-decode";
import { ResourceContext } from "./ResourceContext";
import Gate from "../src/components/Gate/Gate";
import GateUnits from "./components/Gate/GateUnits";
import Placements from "./components/Placements/Placements";
import Notifications from "./Notification";
import Toggle from "./components/Toggle/Toggle";
import Search from "./components/Search/Search";
import { NavbarContext } from "./NavbarContext";
import { Button, Modal } from "react-bootstrap";
import NestedItems from "./NestedItems";
import { ThemeContext } from "./ThemeContext";

function App() {
  useClickSound(clickSoundFile, []);
  const [folders, setFolders] = useState([]);
  const [docs, setDocs] = useState([]);
  const { setResources } = useContext(ResourceContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isExpanded } = useContext(NavbarContext);
  const [show, setShow] = useState(false);
  const { theme } = useContext(ThemeContext);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function fetchFolders() {
    const token = localStorage.getItem("user") || false;
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
      .catch(() => {
        setLoading(false);
      });
  }
  function fetchDocuments() {
    const token = localStorage.getItem("user") || false;
    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}/document/docs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const docs = response.data;
        setDocs(docs);
      });
  }
  function fetchResources() {
    const token = localStorage.getItem("user") || false;
    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}/resource/resources`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const resources = response.data;
        setResources(resources);
      });
  }
  useEffect(() => {
    localStorage.setItem("lottie", 1);
    const token = localStorage.getItem("user") || false;
    try {
      const email = jwtDecode(token).email;
      if (
        email.endsWith("@rguktn.ac.in") &&
        process.env.REACT_APP_ADMIN_EMAILS.split(",").includes(email)
        // true
      ) {
        fetchFolders();
        fetchDocuments();
        fetchResources();
        navigate("/home");
      } else {
        console.error("Temporarily not allowed..");
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      navigate("/");
    }
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="lead text-white m-3 loading">
          Site is Under Maintanance...
        </p>
      </div>
    );
  }
  let data = folders.filter((folder) => {
    return (
      folder.name == "E1" ||
      folder.name == "E2" ||
      folder.name == "E3" ||
      folder.name == "E4"
    );
  });
  data = data.sort((a, b) => {
    return a.name.localeCompare(b) > b.name.localeCompare(a);
  });

  return (
    <div className="App">
      {docs.length != 0 && (
        <>
          <Toggle />
          <Search docs={docs} folders={folders} />
          <button className={`${theme} stunning-btn`} onClick={handleShow}>
            <i className="fas fa-plus"></i>
          </button>
          <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>Upload Document</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <NestedItems data={data} />
            </Modal.Body>
          </Modal>
        </>
      )}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/subjects" element={<Subjects folders={folders} />} />
        <Route path="/domains" element={<Domains folders={folders} />} />
        <Route path="/units" element={<Units folders={folders} />} />
        <Route path="/content" element={<Content documents={docs} />} />
        <Route path="/sem" element={<Sem folders={folders} />} />
        <Route path="/year" element={<Year folders={folders} />} />
        <Route path="/team" element={<Team />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/contribution" element={<Contribution />} />
        <Route path="/resource" element={<Resource />} />
        <Route path="/admin" element={<Admin documents={docs} />} />
        <Route path="/gate" element={<Gate folders={folders} />} />
        <Route path="/placements" element={<Placements docs={docs} />} />
        <Route
          path="/gateunits"
          element={<GateUnits folders={folders} docs={docs} />}
        />
      </Routes>
      <Notifications />
    </div>
  );
}

export default App;
