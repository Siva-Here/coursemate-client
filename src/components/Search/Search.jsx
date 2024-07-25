import React, { useState, useRef, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import "./Search.css";
import { ThemeContext } from "../../ThemeContext";

const Search = ({ initialIsOpened = false, position = {}, size = 32 }) => {
  const [isOpened, setIsOpened] = useState(initialIsOpened);
  const inputRef = useRef(null);
  const { theme } = useContext(ThemeContext);

  const toggleApp = () => {
    setIsOpened(!isOpened);

    if (isOpened) {
      setTimeout(() => {
        inputRef.current.classList.remove("move-up");
        inputRef.current.value = "";
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
    return () => {
      if (layer) {
        layer.removeEventListener("click", toggleApp);
      }
    };
  }, [isOpened]);

  const appCoverStyle = {
    ...position,
    width: `${size}px`,
    height: `${size}px`,
  };

  return (
    <div className="search-div">
      <div id="app-cover" style={appCoverStyle}>
        <div id="app" className={isOpened ? "opened" : ""}>
          <form>
            <div id="f-element">
              <input
                type="text"
                name="query"
                placeholder="Type something to search ..."
                autoComplete="off"
                ref={inputRef}
                className={`search-bar ${isOpened ? "visible" : ""}`}
              />
            </div>
            <button type="submit" className={isOpened ? "" : "shadow"}>
              <i className="fas fa-search" style={{ zIndex: 3000 }}></i>
            </button>
          </form>
        </div>
        <div
          id="layer"
          title="Click the blue area to hide the form"
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
};

export default Search;
