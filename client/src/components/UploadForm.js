import React, { useState } from "react";
import axios from "axios";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

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
      <label htmlFor="image-upload">이미지</label>
      <input id="image-upload" type="file" onChange={onChangeInput} />
      <button type="submit">업로드</button>
    </form>
  );
};

export default UploadForm;
