import React, { useState } from "react";
import { ListGroup } from "react-bootstrap";
import NestedItem from "./NestedItem";

const NestedItems = ({ data }) => {
  const [openId, setOpenId] = useState(0);

  return (
    <ListGroup>
      {data.map((item) => (
        <NestedItem
          key={item._id}
          item={item}
          openId={openId}
          setOpenId={setOpenId}
        />
      ))}
    </ListGroup>
  );
};

export default NestedItems;
