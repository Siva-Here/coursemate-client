import React, { useState, useEffect, useContext } from "react";
import "./Placements.css";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../navbar/Sidebar";
import { IdContext } from "../../IdContext";
import { ResourceContext } from "../../ResourceContext";
import { jwtDecode } from "jwt-decode";

const Placements = ({ docs }) => {
  const { resources } = useContext(ResourceContext);
  const [placement, setPlacements] = useState([]);
  const token = localStorage.getItem("user") || null;
  const [showModal, setShowModal] = useState(false);
  const parentFolder = process.env.REACT_APP_PLACEMENTS_FOLDER;
  const [folderId, setFolderId] = useState(parentFolder);
  const { userId } = useContext(IdContext);
  const [billFile, setBillFile] = useState(null);
  const [isFileSet, setIsFileSet] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [rscLink, setRscLink] = useState(null);
  const [isAllowed, setIsAllowed] = useState(false);
  const [disable, setDisable] = useState(true);

  useEffect(() => {
    try {
      const user = jwtDecode(localStorage.getItem("user"));
      const email = user.email;
      if (
        process.env.REACT_APP_ADMIN_EMAILS.split(",").includes(email) ||
        process.env.REACT_APP_PLACEMENT_EMAILS.split(",").includes(email)
      ) {
        setIsAllowed(true);
      }
    } catch (error) {
      console.error(error);
    }

    const sortedPlacements = resources
      .filter((rsc) => {
        return rsc.isPlacement && rsc.isAccepted;
      })
      .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));

    setPlacements(sortedPlacements);
  }, []);

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  const handleFileChange = (e) => {
    setIsFileSet(false);
    setBillFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!billFile) {
      setIsLoading(false);
      return;
    }

    const existingFile = docs.docs.find(
      (doc) => doc.name.toLowerCase() === billFile.name.toLowerCase()
    );
    if (existingFile) {
      toast.error(
        "File with the same name exists. Please upload a different file."
      );
      setIsFileSet(true);
      setIsLoading(false);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(billFile.type)) {
      setIsLoading(false);
      return;
    }

    if (billFile.size > 30 * 1024 * 1024) {
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", billFile);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_API_URL}/document/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { name, fileId, viewLink, downloadLink } = response.data;
      const params = {
        name,
        fileId,
        viewLink,
        downloadLink,
        parentFolder: folderId,
        uploadedBy: userId,
      };

      axios
        .post(
          `${process.env.REACT_APP_BASE_API_URL}/document/saveDocument`,
          params,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setIsFileSet(true);
          setBillFile(null);
          setRscLink(viewLink);
          toast.success(
            "File saved successfully! Wait until admin accepts it!"
          );
          setDisable(false);
        })
        .catch((error) => {
          console.error("Cannot save the document", error);
          toast.error("Cannot save the document!");
        });
    } catch (error) {
      console.error(
        "Error uploading file:",
        error.response?.data?.error || error.message
      );
      toast.error("Can't upload file");
    } finally {
      setIsLoading(false);
      setIsFileSet(true);
    }
  };

  const getImageSrc = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    if (extension === "pdf") {
      return "/favicons/pdf.png";
    } else if (["ppt", "pptx"].includes(extension)) {
      return "/favicons/ppt.png";
    } else if (["doc", "docx"].includes(extension)) {
      return "/favicons/doc.png";
    } else {
      return "/favicons/pdf.png";
    }
  };

  const submitResource = async (event) => {
    event.preventDefault();

    const formData = {
      name: event.target.formName.value,
      description: event.target.formDescription.value,
      rscLink,
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
        toast.error("Failed to add placement. Please try again later.");
      }
    } catch (error) {
      toast.error("Server Error. Can't add placement...");
    }
  };

  return (
    <>
      <ToastContainer />
      <div>
        <div className="units-img"></div>
        <div style={{ marginTop: "50px" }}>
          <Sidebar />
          <div className="outer-container-units text-center">
            <h1
              className="display-5 text-center text-white cust-text"
              style={{ zIndex: 1000, marginTop: "40px" }}
            >
              Placements
            </h1>
          </div>
        </div>
        <div className="blur1"></div>
        {placement.length !== 0 ? (
          <>
            {placement.map((rsc) => (
              <div key={rsc._id} className="resource-div">
                <div className="resource-content">
                  <p className="text-uppercase fw-bold fst-italic font-italic">
                    {rsc.name}
                  </p>
                  <p>{rsc.description}</p>
                  <div
                    className="placements-div d-flex fw-bold text-white lead py-4 justify-content-between mb-4 ms-auto me-auto"
                    style={{ marginRight: "8px" }}
                  >
                    <div className="img-div text-start ms-4 align-items-end">
                      <img
                        className="text-start"
                        src={getImageSrc(rsc.name)}
                        alt=""
                        height={"35px"}
                      />
                    </div>
                    <div
                      className="text-div text-start align-items-start"
                      onClick={() => {
                        window.location.href = `${rsc.rscLink}`;
                      }}
                    >
                      {rsc.name.toUpperCase()}
                    </div>
                  </div>
                </div>
                <br />
                <div className="resource-date mt-5">
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
            <h1
              className="text-center fw-bold h-100 text-white display-6 d-flex align-items-center justify-content-center"
              style={{ zIndex: 100 }}
            ></h1>
          </div>
        )}
        {isAllowed && (
          <div className="add-button-container">
            <button className="add-button" onClick={handleModalShow}>
              +
            </button>
          </div>
        )}

        <Modal show={showModal} onHide={handleModalClose} className="modal">
          <Modal.Header closeButton>
            <Modal.Title>Add New Placement Updates</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={submitResource}>
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Company Name</Form.Label>
                <Form.Control type="text" placeholder="Enter name" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formDescription">
                <Form.Label>Job Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter description"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formLink">
                <Form.Label></Form.Label>
                <div className="file-input-wrapper">
                  {isFileSet ? (
                    <>
                      <input
                        type="file"
                        className="file-input"
                        id="file-input"
                        accept=".pdf, .ppt, .pptx, .doc, .docx"
                        onChange={handleFileChange}
                      />
                      <button className="custom-button" htmlFor="file-input">
                        +
                      </button>
                    </>
                  ) : (
                    <button
                      className={`custom-button-submit ${
                        isLoading ? "loading" : ""
                      }`}
                      type="button"
                      disabled={isLoading}
                      onClick={handleSubmit}
                    >
                      {isLoading ? <div className="spinner"></div> : "Upload"}
                    </button>
                  )}
                </div>
              </Form.Group>
              <Button
                variant="outline-warning"
                type="submit"
                disabled={disable}
              >
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

export default Placements;
