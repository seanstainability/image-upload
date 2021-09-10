import React from "react";
import "./ProgressBar.css";

const ProgressBar = ({ percent }) => {
  return (
    <div className="progress-bar--boundary">
      <div style={{ width: `${percent || 0}%`, transition: "0.3s" }}></div>
    </div>
  );
};

export default ProgressBar;
