import React, { useContext } from "react";
import { ListGroup } from "react-bootstrap";
import "./NestedItem.css";
import { ThemeContext } from "./ThemeContext";
import NestedItems from "./NestedItems";

const NestedItem = ({ item, openId, setOpenId, docs }) => {
  const { theme } = useContext(ThemeContext);

  const toggleOpen = (id) => {
    if (openId === id) {
      setOpenId(null);
    } else {
      setOpenId(id);
    }
  };

  return (
    <ListGroup.Item className="nested-item">
      <button
        className={`nested-btn ${theme} text-start`}
        onClick={() => toggleOpen(item._id)}
      >
        <img
          src={`/bing/${
            theme === "dark"
              ? openId === item._id
                ? "open-dark"
                : "folder1"
              : openId === item._id
              ? "open-light"
              : "folder"
          }.png`}
          alt=""
          height="22px"
          style={{ margin: "5px", marginLeft: "20px" }}
        />
        <span className="ms-5">{item.name}</span>
      </button>
      {openId === item._id && item.nested && (
        <ListGroup className="ml-4">
          <NestedItems
            key={item.nested._id}
            data={item.nested}
            docs={docs}
            parentFolder={item._id}
          />
        </ListGroup>
      )}
    </ListGroup.Item>
  );
};

export default NestedItem;
