import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./Content.css";
import Sidebar from "../navbar/Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../AuthContext";
import { IdContext } from "../../IdContext";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { ThemeContext } from "../../ThemeContext";
import { NavbarContext } from "../../NavbarContext";

function Content(props) {
  const location = useLocation();
  let { folderId, parentFolder } = location.state;
  const { isLoggedIn } = useContext(AuthContext);
  const { userId } = useContext(IdContext);
  const [docs, setDocs] = useState([]);
  const [delayedDocs, setDelayedDocs] = useState([]);
  const [billFile, setBillFile] = useState(null);
  const [isFileSet, setIsFileSet] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("name");
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const token = localStorage.getItem("user") || null;
  const [pdfLink, setPdfLink] = useState(null);
  const { isExpanded } = useContext(NavbarContext);

  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    if (location.state) {
      folderId = location.state.folderId;
    }
  }, []);

  const fetchDocuments = async () => {
    try {
      let documents = JSON.stringify(props);
      documents = JSON.parse(documents).documents.docs;
      const rootDocs = documents.filter((doc) => {
        return (
          doc.parentFolder == folderId && doc.isAccepted && !doc.isPlacement
        );
      });
      setDocs(rootDocs);
      setLoading(false);
      setDelayedDocs([]);
      rootDocs.forEach((doc, index) => {
        setTimeout(() => {
          setDelayedDocs((prevDocs) => [...prevDocs, doc]);
        }, index * 175);
      });
    } catch (error) {
      console.error("Error fetching documents or folder", error);
    }
  };

  useEffect(() => {
    if (!folderId) {
      navigate("/");
    }
    fetchDocuments();
  }, [isUploaded]);

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

    const existingFile = docs.find(
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
        parentFolder: folderId || location.state.folderId,
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

  const getImageSrc = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    if (extension === "pdf") {
      return "/favicons/pdf.png";
    } else if (["ppt", "pptx"].includes(extension)) {
      return "/favicons/ppt.png";
    } else if (["doc", "docx"].includes(extension)) {
      return "/favicons/doc.png";
    } else {
      return "/favicons/default.png";
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortType(e.target.value);
  };

  function handlePreview(doc) {
    if (doc.name.split(".").slice(-1) == "pdf") {
      let link = doc.viewLink.split("/").slice(0, -1);
      link = link.join("/");
      setPdfLink(link);
    } else {
      window.location.href = doc.viewLink;
    }
  }

  const filteredAndSortedDocs = delayedDocs
    .filter((doc) => doc.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortType === "name") {
        return a.name.localeCompare(b.name);
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const currentDocs = filteredAndSortedDocs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredAndSortedDocs.length / ITEMS_PER_PAGE);

  if (loading && props.view !== "gate") {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="lead text-white m-3 loading">
          Site is Under Maintenance...
        </p>
      </div>
    );
  }

  return (
    <>
      {isLoggedIn ? (
        <div>
          <div className="sidebar-gate" style={{ backdropFilter: "0px" }}>
            <Sidebar />
          </div>
          <ToastContainer />
          <div style={{ marginTop: "50px" }}>
            {props.view != "gate" ? (
              <div className={`content-img ${theme}`}></div>
            ) : (
              <div
                className={`units-img ${theme}`}
                style={{ zIndex: -1 }}
              ></div>
            )}
            <div className="container">
              <div className="row justify-content-center align-items-center">
                <div
                  className={`col-12 col-sm-12 col-md-8 text-center outer-container-year ${
                    isExpanded ? "expanded" : ""
                  }`}
                >
                  <h1
                    className={`display-5 text-center cust-text-${theme}`}
                    style={{ zIndex: 1000, marginTop: "0px" }}
                  >
                    {parentFolder}
                  </h1>
                  {pdfLink ? (
                    <iframe
                      src={pdfLink + "/preview"}
                      frameborder="0"
                      width={"90%"}
                      height={"450px"}
                    ></iframe>
                  ) : (
                    <p className={`${theme} text-center`}>
                      Select a pdf to preview
                    </p>
                  )}
                </div>
                <div
                  className={`outer-container-content col-12 col-sm-12 col-md-4 justify-content-center align-items-center d-flex flex-column ${
                    isExpanded ? "expanded" : ""
                  }`}
                >
                  <div
                    className={`${theme} search-sort-container row justify-content-center align-items-center d-flex`}
                  >
                    <div className="col-12 col-sm-12 col-md-6">
                      <input
                        type="text"
                        placeholder="Search documents..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className={`search-input ${theme}`}
                      />
                    </div>
                    <div className="col-12 col-sm-12 col-md-6 mt-sm-2 mt-md-0 mt-2 box">
                      <select
                        value={sortType}
                        onChange={handleSortChange}
                        className={`sort-select ${theme}`}
                      >
                        <option value="name" className={`${theme}`}>
                          Sort by Name
                        </option>
                        <option value="createdAt" className={`${theme}`}>
                          Sort by Date
                        </option>
                      </select>
                    </div>
                  </div>
                  {currentDocs.length != 0 ? (
                    <table className="content-table">
                      <tbody>
                        {currentDocs
                          .filter((doc) => doc.isAccepted)
                          .map((doc) => (
                            <tr key={doc._id}>
                              <td>
                                <div
                                  key={doc._id}
                                  className={`content-div d-flex fw-bold lead py-4 justify-content-between ${theme}`}
                                  style={{
                                    height: "50px",
                                    textWrap: "nowrap",
                                    borderRadius: "5px",
                                  }}
                                >
                                  <div className="img-div text-start align-items-end">
                                    <img
                                      className="text-start"
                                      src={getImageSrc(doc.name)}
                                      alt=""
                                      height={"30px"}
                                    />
                                  </div>
                                  <div
                                    className={`${theme} text-div text-start mt-1 align-items-center justify-content-center`}
                                    onClick={() => {
                                      // window.location.href = `${doc.viewLink}`;
                                      handlePreview(doc);
                                    }}
                                  >
                                    {doc.name.toUpperCase()}
                                  </div>
                                  <div
                                    className="download-div text-end me-1 align-items-start"
                                    onClick={() => {
                                      window.location.href = `${doc.downloadLink}`;
                                    }}
                                  >
                                    <img
                                      className=""
                                      src="/favicons/download2.png"
                                      alt=""
                                      height={"30px"}
                                    />
                                  </div>
                                  <div className={`uploaded-date`}>
                                    <p
                                      className={`${theme}`}
                                      style={{
                                        fontSize: "0.5em",
                                      }}
                                    >
                                      {getDate(doc.createdAt)}
                                    </p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className={`h3 m-5 py-5 ${theme}`}>
                      <p className={`ps-5 ${theme}`}>No documents available.</p>
                    </div>
                  )}
                  <div className={`pagination-container `}>
                    <button
                      onClick={() =>
                        setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)
                      }
                      className="pagination-arrow"
                      disabled={currentPage === 1}
                    >
                      <FaArrowLeft />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage(
                          currentPage < totalPages
                            ? currentPage + 1
                            : totalPages
                        )
                      }
                      className="pagination-arrow"
                      disabled={currentPage === totalPages}
                    >
                      <FaArrowRight />
                    </button>
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmit}>
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
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? <div className="spinner"></div> : "Upload"}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        navigate("/")
      )}
    </>
  );
}

export default Content;

const getDate = (timestamp) => {
  const date = new Date(timestamp);

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  const getDayWithSuffix = (day) => {
    const j = day % 10,
      k = day % 100;
    //   if (j === 1 && k !== 11) {
    //     return day + "st";
    //   }
    //   if (j === 2 && k !== 12) {
    //     return day + "nd";
    //   }
    //   if (j === 3 && k !== 13) {
    //     return day + "rd";
    //   }
    return day;
  };

  const formattedDate = `${getDayWithSuffix(
    day
  )} ${month} ${year}`.toUpperCase();
  return formattedDate;
};
