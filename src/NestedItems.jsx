import React, { useState, useContext } from "react";
import { ListGroup } from "react-bootstrap";
import NestedItem from "./NestedItem";
import axios from "axios";
import { toast } from "react-toastify";

const NestedItems = ({ data, docs, parentFolder }) => {
  const [openId, setOpenId] = useState(0);
  const [billFile, setBillFile] = useState(null);
  const [isFileSet, setIsFileSet] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);
  const token = localStorage.getItem("user") || false;
  const userId = localStorage.getItem("userId");
  // const [parentFolder, setParentFolder] = useState(null);

  const handleFileChange = (e) => {
    setIsFileSet(false);
    setBillFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!billFile) {
      setErrorMessage("Please select a file");
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
      setErrorMessage(
        "Invalid file type. Only PDF, PPT, PPTX, DOC, and DOCX files are allowed."
      );
      setIsLoading(false);
      return;
    }

    if (billFile.size > 30 * 1024 * 1024) {
      setErrorMessage("File is too large. Maximum size allowed is 30MB.");
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
        parentFolder,
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
          setIsUploaded((prev) => !prev);
          setIsFileSet(true);
          setBillFile(null);
          setErrorMessage("");
          toast.success(
            "File saved successfully! Wait until admin accepts it!"
          );
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
      setErrorMessage("Failed to upload file. Please try again later.");
    } finally {
      setIsLoading(false);
      setIsFileSet(true);
    }
  };

  return (
    <>
      {data.length > 0 ? (
        <ListGroup>
          {data.map((item) => (
            <div
              // onClick={() => {
              //   setParentFolder(item._id);
              // }}
              key={item._id}
            >
              <NestedItem
                item={item}
                openId={openId}
                setOpenId={setOpenId}
                docs={docs}
              />
            </div>
          ))}
        </ListGroup>
      ) : (
        <>
          {isFileSet ? (
            <>
              <input
                type="file"
                className="file-input"
                id="file-input"
                accept=".pdf, .ppt, .pptx, .doc, .docx"
                onChange={handleFileChange}
              />
              <button
                className="custom-button ms-auto me-auto"
                htmlFor="file-input"
                style={{ width: "150px", height: "50px", borderRadius: "10px" }}
              >
                +
              </button>
            </>
          ) : (
            <button
              className={`custom-button-submit ${
                isLoading ? "loading" : ""
              } ms-auto me-auto`}
              type="submit"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? <div className="spinner"></div> : "Upload"}
            </button>
          )}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </>
      )}
    </>
  );
};

export default NestedItems;
