import React, { useContext, useState } from "react";
import axios from "axios";
import "./UploadForm.css";
import { toast } from "material-react-toastify";

import ProgressBar from "./ProgressBar";
import { ImageContext } from "../context/ImageContext";

const UploadForm = () => {
  const { images, setImages, myImages, setMyImages } = useContext(ImageContext);
  const [file, setFile] = useState(null);
  const defaultMsg = "클릭 또는 드래그하여 사진을 업로드 해주세요.";
  const [fileName, setFileName] = useState(defaultMsg);
  const [percent, setPercent] = useState(0);
  const [imgSrc, setImgSrc] = useState(null);
  const [isPublic, setIsPublic] = useState(false);

  const onChangeInput = (e) => {
    const image = e.target.files[0];
    setFile(image);
    setFileName(image.name);
    const fileReader = new FileReader();
    fileReader.readAsDataURL(image);
    fileReader.onload = (e) => {
      setImgSrc(e.target.result);
    };
  };
  const onUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", file);
    formData.append("public", isPublic);
    try {
      const res = await axios.post("/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          const progressPercent = Math.round((100 * e.loaded) / e.total);
          setPercent(progressPercent);
        },
      });
      console.log(res.data);
      if (res.data.public) {
        setImages([...images, res.data]);
      } else {
        setMyImages([...myImages, res.data]);
      }
      toast.success("업로드 완료!");
      setTimeout(() => {
        setFileName(defaultMsg);
        setPercent(0);
        setImgSrc(null);
      }, 3000);
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.message);
      setFileName(defaultMsg);
      setPercent(0);
      setImgSrc(null);
    }
  };

  return (
    <div>
      <img
        src={imgSrc}
        alt=""
        className={`image-preview ${imgSrc && "image-preview--show"}`}
      />
      <form onSubmit={onUpload}>
        <ProgressBar percent={percent} />
        <div className="file-dropper">
          {fileName}
          {/*<label htmlFor="image-upload">{fileName}</label>*/}
          <input
            id="image-upload"
            type="file"
            onChange={onChangeInput}
            accept="image/*"
          />
        </div>
        <input
          type="checkbox"
          id="public-check"
          value={isPublic}
          onChange={(e) => setIsPublic(!isPublic)}
        />
        <label htmlFor="public-check">공개</label>
        <button type="submit" style={{ float: "right" }}>
          업로드
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
