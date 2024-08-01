import React, { useState, useRef, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import "./Search.css";
import { ThemeContext } from "../../ThemeContext";
import { NavbarContext } from "../../NavbarContext";

const Search = ({
  initialIsOpened = false,
  position = {},
  size = 32,
  docs = [],
  folders = [],
}) => {
  const [isOpened, setIsOpened] = useState(initialIsOpened);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDocs, setFilteredDocs] = useState([]);
  const inputRef = useRef(null);
  const { theme } = useContext(ThemeContext);
  const { isExpanded } = useContext(NavbarContext);

  useEffect(() => {
    if (searchQuery) {
      let filtered = docs.docs
        .filter((doc) =>
          doc.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5);
      setFilteredDocs(filtered);
    } else {
      setFilteredDocs([]);
    }
  }, [searchQuery, docs]);

  const toggleApp = () => {
    setIsOpened(!isOpened);
    if (isOpened) {
      setTimeout(() => {
        inputRef.current.classList.remove("move-up");
        inputRef.current.value = "";
        setSearchQuery("");
      }, 200);
    } else {
      setTimeout(() => {
        inputRef.current.classList.add("move-up");
      }, 200);
      setTimeout(() => {
        inputRef.current.focus();
      }, 500);
    }
  };

  useEffect(() => {
    const layer = document.getElementById("layer");
    if (layer) {
      layer.addEventListener("click", toggleApp);
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpened(false);
      }
    };

    const handlePopState = () => {
      setIsOpened(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("popstate", handlePopState);

    return () => {
      if (layer) {
        layer.removeEventListener("click", toggleApp);
      }
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isOpened]);

  const appCoverStyle = {
    ...position,
    width: `${size}px`,
    height: `${size}px`,
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value.trim());
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

  const getParentFolderName = (parentFolderId) => {
    const parentFolder = folders.find(
      (folder) => folder._id === parentFolderId
    );
    const subject = folders.find(
      (folder) => folder._id === parentFolder.parentFolder
    );
    return subject ? subject.name : parentFolder.name;
  };

  return (
    <div className={`search-div show-${isExpanded}`}>
      <div id="app-cover" style={appCoverStyle}>
        <div id="app" className={isOpened ? "opened" : ""}>
          <form className={`${isOpened ? "visible" : ""}`}>
            <div id="f-element">
              <input
                type="text"
                name="query"
                placeholder="Search documents"
                autoComplete="off"
                ref={inputRef}
                className={`search-bar ${isOpened ? "visible" : ""} ${theme}`}
                onChange={handleInputChange}
              />
              <div
                className={`search-bar-div ${theme} ${
                  isOpened ? "visible" : ""
                }`}
              >
                {filteredDocs.length !== 0 ? (
                  <div className="content-content text-center w-50 container-fluid d-flex flex-column align-items-center justify-content-center">
                    {filteredDocs.map((doc) => (
                      <div
                        key={doc._id}
                        className={`content-div ${theme} d-flex fw-bold text-white lead py-4 justify-content-between`}
                        style={{
                          height: "50px",
                          textWrap: "nowrap",
                        }}
                      >
                        <div className="img-div text-start ms-4 align-items-end">
                          <img
                            className="text-start"
                            src={getImageSrc(doc.name)}
                            alt=""
                            height={"25px"}
                          />
                        </div>
                        <div
                          className={`text-div-search text-start align-items-start ${theme}`}
                          onClick={() => {
                            window.location.href = `${doc.viewLink}`;
                          }}
                        >
                          {doc.name.toUpperCase()}
                        </div>
                        <div className={`parent-name ${theme}`}>
                          <p
                            style={{
                              fontSize: "0.5em",
                            }}
                          >
                            {getParentFolderName(doc.parentFolder)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No results found.</p>
                )}
              </div>
            </div>
            <button
              type="submit"
              className={isOpened ? "search-btn" : "shadow search-btn"}
            >
              <i className="fas fa-search" style={{ zIndex: 3000 }}></i>
            </button>
          </form>
        </div>
        <div
          id="layer"
          className={`ms-auto me-auto d-flex justify-content-center align-items-center layer-${theme}`}
        >
          <i className={`fas fa-search ${isOpened ? "d-none" : ""}`}></i>
        </div>
        <div id="init" onClick={toggleApp}></div>
      </div>
    </div>
  );
};

Search.propTypes = {
  initialIsOpened: PropTypes.bool,
  position: PropTypes.object,
  size: PropTypes.number,
  docs: PropTypes.array,
  folders: PropTypes.array,
};

export default Search;
