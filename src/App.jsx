import React, { useContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./components/Home/Home";
import Subjects from "./components/Subjects/Subjects";
import "./App.css";
import Login from "./components/Login/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import Domains from "./components/Domains/Domains";
import Units from "./components/Units/Units";
import Content from "./components/Content/Content";
import Year from "./components/Year/Year";
import Team from "./components/Team/Team";
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
import { Modal } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import NestedItems from "./NestedItems";
import { ThemeContext } from "./ThemeContext";
import { NavbarContext } from "./NavbarContext";
import Launch from "./components/Launch/Launch";

function buildNestedStructure(folderId, folders) {
  let nestedFolders = [];
  folders.forEach((folder) => {
    if (folder.parentFolder === folderId) {
      nestedFolders.push({
        _id: folder._id,
        name: folder.name,
        nested: buildNestedStructure(folder._id, folders),
      });
    }
  });
  nestedFolders.sort((a, b) => a.name.localeCompare(b.name));
  return nestedFolders;
}

function App() {
  useClickSound(clickSoundFile, []);
  const [folders, setFolders] = useState([]);
  const [docs, setDocs] = useState([]);
  const { setResources } = useContext(ResourceContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const { theme, setTheme } = useContext(ThemeContext);
  const { isExpanded } = useContext(NavbarContext);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [launch, setLaunch] = useState(true);
  const [launch1, setLaunch1] = useState(false);
  const [showButton, setShowButton] = useState(true);
  let launching = localStorage.getItem("launching");

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
        setDocs(response.data);
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
        setResources(response.data);
      });
  }

  useEffect(() => {
    localStorage.setItem("lottie", 1);
    console.log(launching, typeof launching);
    const token = localStorage.getItem("user") || false;
    try {
      const email = jwtDecode(token).email;
      if (email.endsWith("@rguktn.ac.in") && true) {
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

  let semFolders = folders
    .filter((folder) => ["E1", "E2", "E3", "E4"].includes(folder.name))
    .sort((a, b) => a.name.localeCompare(b.name));
  let nestedFolders = [];
  semFolders.forEach((folder) => {
    nestedFolders.push({
      _id: folder._id,
      name: folder.name,
      nested: buildNestedStructure(folder._id, folders),
    });
  });

  const toggleTheme = () => {
    let theme1 = localStorage.getItem("theme");
    if (theme1 === "light") {
      theme1 = "dark";
    } else {
      theme1 = "light";
    }
    setTheme(theme1);
    localStorage.setItem("theme", theme1);
  };

  return (
    <div className="App">
      <ToastContainer />
      {launch && launching == 1 ? (
        <div>
          {showButton && (
            <div
              className="wrapper-launch"
              onClick={() => {
                setShowButton(false);
                setLaunch1(true);
                setTimeout(() => {
                  setLaunch(false);
                  localStorage.setItem("launching", 0);
                }, 11000);
              }}
            >
              <a className="launch-a" href="#">
                <span className="launch-span">Launch</span>
              </a>
            </div>
          )}
          {launch1 && <Launch />}
        </div>
      ) : (
        <>
          {docs.length !== 0 && (
            <>
              <div onClick={toggleTheme} style={{ cursor: "pointer" }}>
                <Toggle />
              </div>
              <Search docs={docs} folders={folders} />
              <button
                className={`${theme} stunning-btn show-${isExpanded}`}
                onClick={handleShow}
              >
                <i className="fas fa-plus"></i>
              </button>
              <Modal
                show={show}
                onHide={handleClose}
                centered
                className="modal-dialog-upload"
              >
                <Modal.Header closeButton className="modal-header-upload">
                  <Modal.Title>Upload document</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body-upload">
                  <NestedItems data={nestedFolders} docs={docs} />
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
            {/* <Route path="/sem" element={<Sem folders={folders} />} /> */}
            <Route path="/year" element={<Year folders={folders} />} />
            <Route path="/team" element={<Team />} />
            <Route path="/notifications" element={<Notification />} />
            <Route path="/contribution" element={<Contribution />} />
            <Route path="/resource" element={<Resource />} />
            <Route
              path="/admin"
              element={<Admin documents={docs} folders={folders} />}
            />
            <Route path="/gate" element={<Gate folders={folders} />} />
            <Route path="/placements" element={<Placements docs={docs} />} />
            <Route
              path="/gateunits"
              element={<GateUnits folders={folders} docs={docs} />}
            />
          </Routes>
          <Notifications />
        </>
      )}
    </div>
  );
}

export default App;
