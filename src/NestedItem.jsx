import React, { useContext } from "react";
import { ListGroup } from "react-bootstrap";
import "./NestedItem.css";
import { ThemeContext } from "./ThemeContext";
import NestedItems from "./NestedItems";

const NestedItem = ({ item, openId, setOpenId }) => {
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
        className={`nested-btn ${theme}`}
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
          height="32px"
          style={{ marginRight: "20px" }}
        />
        {item.name}
      </button>
      {openId === item._id && item.nested && item.nested.length > 0 && (
        <ListGroup className="ml-4">
          {/* {item.nested.map((nestedItem) => ( */}
          <NestedItems
            key={item.nested._id}
            data={item.nested}
            //   openId={openId}
            //   setOpenId={setOpenId}
          />
          {/* ))} */}
        </ListGroup>
      )}
    </ListGroup.Item>
  );
};

export default NestedItem;
