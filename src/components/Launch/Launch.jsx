import React, { useState, useEffect } from "react";
import "./Launch.css";

const Launch = () => {
  const [count, setCount] = useState(10);
  const [launch, setLaunch] = useState(false);

  useEffect(() => {
    if (count > 0) {
      const timer = setInterval(() => {
        setCount((count) => {
          if (count > 0) {
            return count - 1;
          } else {
            return 0;
          }
        });
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setLaunch(true);
    }
  }, []);

  return (
    <div className="launch-container">
      <div className={`black-div top-div ${count == 0 ? "launch" : ""}`}></div>
      {count != 0 && <div className="countdown">{count}</div>}
      <div
        className={`black-div bottom-div ${count == 0 ? "launch" : ""}`}
      ></div>
    </div>
  );
};

export default Launch;
