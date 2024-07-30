import React, { useState, useEffect, useContext } from "react";
import "./Posts.css";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IdContext } from "../../IdContext";
import { ResourceContext } from "../../ResourceContext";
import { ThemeContext } from "../../ThemeContext";
import { NavbarContext } from "../../NavbarContext";

const Post = () => {
  const { resources } = useContext(ResourceContext);
  const [resource, setResource] = useState([]);
  const token = localStorage.getItem("user") || null;
  const [showModal, setShowModal] = useState(false);
  const [questions, setQuestions] = useState([""]);
  const { userId } = useContext(IdContext);
  const { theme } = useContext(ThemeContext);
  const { isExpanded } = useContext(NavbarContext);

  useEffect(() => {
    const sortedResources = resources
      .filter((rsc) => {
        return rsc.isPost && rsc.isAccepted;
      })
      .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));

    setResource(sortedResources);
  }, [resources]);

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  const handleAddQuestion = () => {
    setQuestions([...questions, ""]);
  };

  const handleQuestionChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index] = event.target.value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      name: event.target.formName.value,
      description: event.target.formDescription.value,
      posts: questions.filter((question) => question.trim() !== ""),
      uploadedBy: userId,
      parentFolder: process.env.REACT_APP_PLACEMENTS_FOLDER,
      rscLink: "post",
    };
    console.log(formData);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_API_URL}/resource/addPost`,
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
        toast.error("Failed to add Post. Please try again later.");
      }
    } catch (error) {
      console.error("Error adding Post:", error);
      toast.error("Failed to add Post. Please try again later.");
    }
  };

  return (
    <>
      <ToastContainer />
      <div
        className={`outer-resource-container ${isExpanded ? "expanded" : ""}`}
      >
        <div className={`units-img ${theme}`}></div>

        {resource.length !== 0 ? (
          <>
            {resource.map((rsc) => (
              <div className={`rsc-img ${theme}`} key={rsc._id}>
                <div className={`resource-div ${theme}`}>
                  <div className="resource-content">
                    <p
                      className={`text-uppercase fw-bold fst-italic font-italic`}
                      style={
                        theme === "light"
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
                        overflow: "auto",
                        maxWidth: "750px",
                      }}
                    >
                      <div className={`inner-post ${theme}`}>
                        <ol>
                          {rsc.posts.map((post, index) => (
                            <li key={index} style={{ listStyle: "disc" }}>
                              {post}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </p>
                  </div>
                  <br />
                  <div className={`resource-date ${theme}`}>
                    <p style={{ fontSize: "1.2em", margin: "0px" }}>
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

        <div className="add-button-container">
          <button className={`add-button ${theme}`} onClick={handleModalShow}>
            +
          </button>
        </div>

        <Modal show={showModal} onHide={handleModalClose} className="modal">
          <Modal.Header closeButton>
            <Modal.Title>Add New Post</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body">
            <Form onSubmit={handleSubmit} className="rsc-form">
              <Form.Group className="mb-3 form-group" controlId="formName">
                <Form.Label>Company</Form.Label>
                <Form.Control type="text" placeholder="Enter name" />
              </Form.Group>
              <Form.Group
                className="mb-3 form-group"
                controlId="formDescription"
              >
                <Form.Label>Your Experience</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Provide your experience"
                />
              </Form.Group>
              <Form.Group className="mb-3 form-group" controlId="formLink">
                <Form.Label>Questions</Form.Label>
                {questions.map((question, index) => (
                  <Form.Control
                    key={index}
                    type="text"
                    placeholder="Enter question"
                    value={question}
                    onChange={(event) => handleQuestionChange(index, event)}
                    className="mb-2"
                  />
                ))}
                <Button
                  variant="btn btn-warning ms-auto"
                  onClick={handleAddQuestion}
                >
                  Add
                </Button>
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

export default Post;
