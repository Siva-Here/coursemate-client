import React from "react";
import "./Options.css";
import Toggle from "../Toggle/Toggle";
import Search from "../Search/Search";

const Options = ({ docs, folders }) => {
  return (
    <div className="container-options">
      <input
        type="checkbox"
        id="toggle"
        defaultChecked
        style={{ margin: "20px" }}
      />
      <label className="button" htmlFor="toggle">
        <nav className="nav">
          <ul>
            <li>
              <Toggle />
            </li>
            <li>
              <Search docs={docs} folders={folders} />
            </li>
            <li>
              <a href="#0">+</a>
            </li>
            <li>
              <a href="#0">+</a>
            </li>
          </ul>
        </nav>
      </label>
    </div>
  );
};

export default Options;
