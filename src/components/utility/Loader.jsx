import React from "react";
import "./loader.css";
const Loader = (props) => {
  return (
    <div
      className={`w-100 h-100 d-flex justify-content-center align-items-center my-2 ${
        props?.fullpage ? "fullpage--loader" : ""
      }`}
      style={{ height: "100%" }}
    >
      <div className="loader"></div>
    </div>
  );
};

export default Loader;
