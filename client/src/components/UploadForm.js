import React, { useState } from "react";
import axios from "axios";
import "./UploadForm.css";
import { toast } from "material-react-toastify";
import ProgressBar from "./ProgressBar";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const defaultMsg = "클릭 또는 드래그하여 사진을 업로드 해주세요.";
  const [fileName, setFileName] = useState(defaultMsg);
  const [percent, setPercent] = useState(0);

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
        onUploadProgress: (e) => {
          const progressPercent = Math.round((100 * e.loaded) / e.total);
          setPercent(progressPercent);
        },
      });
      console.log(res);
      toast.success("업로드 완료!");
      setTimeout(() => {
        setPercent(0);
        setFileName(defaultMsg);
      }, 3000);
    } catch (err) {
      console.error(err);
      toast.error("업로드 실패!");
      setPercent(0);
      setFileName(defaultMsg);
    }
  };

  return (
    <form onSubmit={onUpload}>
      <ProgressBar percent={percent} />
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
