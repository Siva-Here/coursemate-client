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

const Resource = ({ parentFolder, view, folderName }) => {
  const { resources } = useContext(ResourceContext);
  const [resource, setResource] = useState([]);
  const location = useLocation();
  const token = localStorage.getItem("user") || null;
  const [showModal, setShowModal] = useState(false);
  const [folderId, setFolderId] = useState(parentFolder);
  const { userId } = useContext(IdContext);

  if (!folderName) {
    folderName = location.state.folderName;
  }

  useEffect(() => {
    if (view !== "units") {
      setFolderId(location.state?.parentFolder || parentFolder);
    } else {
      setFolderId(parentFolder);
    }
    if (!folderId) return;

    const sortedResources = resources
      .filter((rsc) => {
        return !rsc.byAdmin && rsc.isAccepted && rsc.parentFolder === folderId;
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
    console.error(formData);
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
      <div>
        {view !== "units" ? (
          <div style={{ marginTop: "50px" }}>
            <Sidebar />
            <div className="units-img"></div>
            <div className="outer-container-units text-center">
              <h1
                className="display-3 text-center text-white blinking-text-units"
                style={{ zIndex: 100 }}
              >
                {folderName}
              </h1>
            </div>
          </div>
        ) : null}
        <div className="blur1"></div>
        {resource ? (
          <>
            {resource.map((rsc) => (
              <div key={rsc._id} className="resource-div">
                <div className="resource-content">
                  <p className="resource-user">Uploaded by: {rsc.uploadedBy}</p>
                  <p className="text-uppercase fw-bold fst-italic font-italic">
                    {rsc.name}
                  </p>
                  <p>{rsc.description}</p>
                  <p>
                    Link:{" "}
                    <a
                      href={rsc.rscLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "yellow" }}
                    >
                      {rsc.rscLink}
                    </a>
                  </p>
                </div>
                <br />
                <div className="resource-date">
                  <p style={{ fontSize: "1.2em" }}>
                    Posted at: {formatTimestamp(rsc.uploadedAt)}
                  </p>
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
            <div className="blur1"></div>
            <div className="blur1"></div>
            <h1
              className="text-center fw-bold h-100 text-white display-6 d-flex align-items-center justify-content-center"
              style={{ zIndex: 100 }}
            >
              No Resources Yet. Please Try to share....
            </h1>
          </div>
        )}

        <div className="add-button-container">
          <button className="add-button" onClick={handleModalShow}>
            +
          </button>
        </div>

        <Modal show={showModal} onHide={handleModalClose} className="modal">
          <Modal.Header closeButton>
            <Modal.Title>Add New Resource</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Enter name" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter description"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formLink">
                <Form.Label>Link</Form.Label>
                <Form.Control type="text" placeholder="Enter link" />
              </Form.Group>
              <Button variant="outline-warning" type="submit">
                Submit
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

const formatTimestampToIST = (timestamp) => {
  const date = new Date(timestamp);

  const IST_OFFSET = 5 * 60 + 30;

  const utcMinutes =
    date.getUTCMinutes() +
    30 +
    (date.getUTCHours() + 5 + (date.getUTCMinutes() + 30) / 60) * 60;

  const istMinutes = utcMinutes + IST_OFFSET;

  const istHours = Math.floor(istMinutes / 60) % 24;
  const istMinutesRemainder = istMinutes % 60;

  const istDate = new Date(date);
  istDate.setUTCHours(
    istHours,
    istMinutesRemainder,
    date.getUTCSeconds(),
    date.getUTCMilliseconds()
  );

  const formattedDate = istDate.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  });

  return formattedDate.replace(",", "");
};

export default Resource;
