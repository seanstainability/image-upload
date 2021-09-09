import React from "react";

const CustomInput = ({ label, value, handler, type = "text" }) => {
  return (
    <div style={{ marginBottom: 10 }}>
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={handler}
        style={{ display: "block", width: 200 }}
      />
    </div>
  );
};

export default CustomInput;
