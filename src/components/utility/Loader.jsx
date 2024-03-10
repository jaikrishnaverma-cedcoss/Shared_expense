import React from "react";
import "./loader.css";
const Loader = ({fullPage,backdrop}) => {

  return (
      <div
      className={`${fullPage?`loader-wrapper fullpage--loader`:`loader-wrapper`} ${backdrop?'loader-backdrop':''}`}
    >
      <div className="loader"></div>
    </div>
  );
};

export default Loader;
