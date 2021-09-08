import React, { useState } from "react";
import axios from "axios";
import "./UploadForm.css";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const defaultMsg = "클릭 또는 드래그하여 사진을 업로드 해주세요.";
  const [fileName, setFileName] = useState(defaultMsg);

  const onChangeInput = (e) => {
    const image = e.target.files[0];
    setFile(image);
    setFileName(image.name);
  };
  const onUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await axios.post("/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={onUpload}>
      <div className="file-dropper">
        {fileName}
        {/*<label htmlFor="image-upload">{fileName}</label>*/}
        <input id="image-upload" type="file" onChange={onChangeInput} />
      </div>
      <button type="submit">업로드</button>
    </form>
  );
};

export default UploadForm;
