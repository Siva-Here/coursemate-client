import React, { useState, useEffect, useContext } from "react";
import "./Resource.css";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import Sidebar from "../navbar/Sidebar";
import { IdContext } from "../../IdContext";
import { ResourceContext } from "../../ResourceContext";
import { ThemeContext } from "../../ThemeContext";
import { NavbarContext } from "../../NavbarContext";
import { jwtDecode } from "jwt-decode";

const Resource = ({ parentFolder, view, folderName }) => {
  const { resources } = useContext(ResourceContext);
  const [resource, setResource] = useState([]);
  const location = useLocation();
  const token = localStorage.getItem("user") || null;
  const [showModal, setShowModal] = useState(false);
  const [folderId, setFolderId] = useState(parentFolder);
  const { userId } = useContext(IdContext);
  const { theme } = useContext(ThemeContext);
  const { isExpanded } = useContext(NavbarContext);
  const [isAdmin, setIsAdmin] = useState(false);

  if (!folderName) {
    folderName = location.state.folderName;
  }
  useEffect(() => {
    const user = jwtDecode(localStorage.getItem("user"));
    const email = user.email;
    if (process.env.REACT_APP_ADMIN_EMAILS.split(",").includes(email)) {
      setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    if (view !== "units") {
      setFolderId(location.state.parentFolder || parentFolder);
    } else {
      setFolderId(parentFolder);
    }
    if (!folderId) return;

    const sortedResources = resources
      .filter((rsc) => {
        return (
          (!rsc.byAdmin || rsc.isJobUpdate || rsc.isPost || rsc.isPlacement) &&
          rsc.isAccepted &&
          rsc.parentFolder === folderId
        );
      })
      .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));

    setResource(sortedResources);
  }, [resources, location.state, parentFolder, view, folderId]);

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      name: event.target.formName.value,
      description: event.target.formDescription.value,
      rscLink: event.target.formLink.value,
      userId,
      folderId,
    };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_API_URL}/resource/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        setShowModal(false);
        toast.success("Added! Wait until admin accepts it!");
      } else {
        toast.error("Failed to add resource. Please try again later.");
      }
    } catch (error) {
      console.error("Error adding resource:", error);
      toast.error("Failed to add resource. Please try again later.");
    }
  };

  return (
    <>
      <ToastContainer />
      <div
        className={`outer-resource-container ${isExpanded ? "expanded" : ""}`}
      >
        <div className={`units-img ${theme}`}></div>
        {view !== "units" ? (
          <div style={{ marginTop: "50px" }}>
            <Sidebar />
            <div className="text-center">
              <h1
                className={`text-center cust-text-${theme}`}
                style={{ zIndex: 1000, margin: "25px" }}
              >
                {folderName}
              </h1>
            </div>
          </div>
        ) : null}
        {/* <div className="blur1"></div> */}
        {resource.length !== 0 ? (
          <>
            {resource.map((rsc) => (
              <div className={`rsc-img ${theme}`}>
                <div key={rsc._id} className={`resource-div ${theme}`}>
                  <div className="resource-content">
                    {/* <p className="resource-user">Uploaded by: {rsc.uploadedBy}</p> */}
                    <p
                      className={`text-uppercase fw-bold fst-italic font-italic`}
                      style={
                        theme == "light"
                          ? { color: "green" }
                          : { color: "lightblue" }
                      }
                    >
                      {rsc.name}
                    </p>
                    <p className={`${theme}`}>{rsc.description}</p>
                    <p
                      className={`${theme}`}
                      style={{
                        width: "75vw",
                        overflow: "auto",
                        maxWidth: "750px",
                      }}
                    >
                      Link:{" "}
                      <a
                        href={rsc.rscLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`rsc-link ${theme}`}
                      >
                        {rsc.rscLink}
                      </a>
                    </p>
                  </div>
                  <br />
                  <div className={`resource-date ${theme}`}>
                    <p style={{ fontSize: "1.2em" }}>
                      Posted at: {formatTimestamp(rsc.uploadedAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div
            className="text-center d-flex justify-content-center align-items-center text-white display-6"
            style={{ height: "60vh" }}
          >
            <div className="blur1"></div>
            <h1
              className="text-center fw-bold h-100 text-white display-6 d-flex align-items-center justify-content-center"
              style={{ zIndex: 100 }}
            >
              No Resources Yet. Please Try to share....
            </h1>
          </div>
        )}
        {(folderId != process.env.REACT_APP_JOB_FOLDER || isAdmin) && (
          <div className="add-button-container">
            <button className={`add-button ${theme}`} onClick={handleModalShow}>
              +
            </button>
          </div>
        )}

        <Modal show={showModal} onHide={handleModalClose} className="modal">
          <Modal.Header closeButton>
            <Modal.Title>Add New Resource</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit} className="rsc-form">
              <Form.Group className="mb-3 form-group" controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Enter name" />
              </Form.Group>
              <Form.Group
                className="mb-3 form-group"
                controlId="formDescription"
              >
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter description"
                />
              </Form.Group>
              <Form.Group className="mb-3 form-group" controlId="formLink">
                <Form.Label>Link</Form.Label>
                <Form.Control type="text" placeholder="Enter link" />
              </Form.Group>
              <Button variant="btn btn-primary" type="submit">
                Submit
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

const formatTimestamp = (timestamp) => {
  const d = new Date(timestamp);
  const date = new Date(d);
  const formattedDate = date.toLocaleString("en-IN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return formattedDate.replace(",", "");
};
export default Resource;
