import React, { useState, useEffect } from "react";
import "./Resource.css";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import Sidebar from "../navbar/Sidebar";

const Resource = ({ parentFolder, uploadedBy }) => {
  const location = useLocation();
  const token = localStorage.getItem("user") || null;
  const [showModal, setShowModal] = useState(false);
  const { folderName } = location.state || null;
  const [resources, setResources] = useState([
    {
      uploadedBy: "Loading...",
      name: "",
      _id: "",
      description: "",
      rscLink: "",
      uploadedAt: "",
    },
  ]);
  const [isPosted, setIsPosted] = useState(true);

  const fetchResources = async () => {
    try {
      const response = await axios.post(
        "https://course-mate-server.onrender.com/resource/folder",
        { folderId: parentFolder },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        let sortedResources = response.data.sort((a, b) =>
          b.uploadedAt.localeCompare(a.uploadedAt)
        );
        sortedResources = sortedResources.filter((resource) => {
          if (!resource.byAdmin) {
            return true;
          } else return false;
        });
        setResources(sortedResources);
      } else {
        toast.error("Failed to fetch resources. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
      toast.error("Failed to fetch resources. Please try again later.");
    }
  };
  useEffect(() => {
    console.log(folderName);
    fetchResources();
  }, [isPosted]);

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      name: event.target.formName.value,
      description: event.target.formDescription.value,
      rscLink: event.target.formLink.value,
      userId: uploadedBy,
      folderId: parentFolder,
    };

    try {
      const response = await axios.post(
        "https://course-mate-server.onrender.com/resource/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setShowModal(false);
        fetchResources();
        setIsPosted(!isPosted);
        toast.success("Resource added successfully!");
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
        {folderName ? (
          <div style={{marginTop: "50px"}}>
            <Sidebar />
            <div className="outer-container-units text-center">
              <h1
                className="display-3 text-center text-white blinking-text-units"
                style={{ zIndex: 100 }}
              >
                {folderName}
              </h1>
            </div>
          </>
        ) : (
          <></>
        )}
        <div className="units-img"></div>
        <div className="blur1"></div>
        {resources.map((resource) => (
          <div key={resource._id} className="resource-div">
            <div className="resource-content">
              <p className="resource-user">
                Uploaded by: {resource.uploadedBy}
              </p>
              <p>Name: {resource.name}</p>
              <p>{resource.description}</p>
              <p>
                Link:{" "}
                <a
                  href={resource.rscLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "yellow" }}
                >
                  {resource.rscLink}
                </a>
              </p>
            </div>
            <br />
            <div className="resource-date">
              <p style={{ fontSize: "1.2em" }}>
                Posted at: {formatTimestamp(resource.uploadedAt)}
              </p>
            </div>
          </div>
        ))}

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

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
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

export default Resource;
