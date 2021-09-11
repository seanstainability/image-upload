import React, { useContext, useRef, useState } from "react";
import axios from "axios";
import "./UploadForm.css";
import { toast } from "material-react-toastify";

import ProgressBar from "./ProgressBar";
import { ImageContext } from "../context/ImageContext";

const UploadForm = () => {
  const { setImages, setMyImages } = useContext(ImageContext);
  const [files, setFiles] = useState(null);
  const defaultMsg = "클릭 또는 드래그하여 사진을 업로드 해주세요.";
  // const [fileName, setFileName] = useState(defaultMsg);
  const [percent, setPercent] = useState([]);
  // const [imgSrc, setImgSrc] = useState(null);
  const [isPublic, setIsPublic] = useState(false);
  const [previews, setPreviews] = useState([]);
  const inputRef = useRef();

  const onChangeInput = async (e) => {
    const images = e.target.files;
    setFiles(images);
    const imagePreviews = await Promise.all(
      [...images].map(async (img) => {
        return new Promise((resolve, reject) => {
          try {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(img);
            fileReader.onload = (e) => {
              resolve({ imgSrc: e.target.result, fileName: img.name });
            };
          } catch (err) {
            reject(err);
          }
        });
      })
    );
    setPreviews(imagePreviews);
  };
  const onUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let file of files) {
      formData.append("image", file);
    }
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
      if (isPublic) {
        setImages((prev) => [...res.data, ...prev]);
      } else {
        setMyImages((prev) => [...res.data, ...prev]);
      }
      toast.success("업로드 완료!");
      setTimeout(() => {
        // setFileName(defaultMsg);
        setPercent(0);
        // setImgSrc(null);
        setPreviews([]);
        inputRef.current.value = null;
      }, 3000);
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.message);
      // setFileName(defaultMsg);
      setPercent(0);
      // setImgSrc(null);
      setPreviews([]);
      inputRef.current.value = null;
    }
  };
  const onUploadV2 = async (e) => {
    try {
      e.preventDefault();
      const presignedData = await axios.post("/images/presigned", {
        contentTypes: [...files].map((file) => file.type),
      });
      await Promise.all(
        [...files].map((file, index) => {
          const { presigned } = presignedData.data[index];
          const formData = new FormData();
          for (const key in presigned.fields) {
            formData.append(key, presigned.fields[key]);
          }
          formData.append("Content-Type", file.type);
          formData.append("file", file);
          return axios.post(presigned.url, formData, {
            onUploadProgress: (e) => {
              // const progressPercent = Math.round((100 * e.loaded) / e.total);
              setPercent((prev) => {
                const newData = [...prev];
                newData[index] = Math.round((100 * e.loaded) / e.total);
                return newData;
              });
            },
          });
        })
      );
      const res = await axios.post("/images", {
        images: [...files].map((file, index) => ({
          imageKey: presignedData.data[index].imageKey,
          originalname: file.name,
        })),
        public: isPublic,
      });
      console.log(res.data);
      if (isPublic) {
        setImages((prev) => [...res.data, ...prev]);
      } else {
        setMyImages((prev) => [...res.data, ...prev]);
      }
      toast.success("업로드 완료!");
      setTimeout(() => {
        setPercent([]);
        setPreviews([]);
        inputRef.current.value = null;
      }, 3000);
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.message);
      setPercent([]);
      setPreviews([]);
      inputRef.current.value = null;
    }
  };
  const previewImages = previews.map((preview, index) => (
    <div key={index}>
      <img
        src={preview.imgSrc}
        alt=""
        style={{ width: 250, height: 250, objectFit: "cover" }}
        className={`image-preview ${preview.imgSrc && "image-preview--show"}`}
      />
      <ProgressBar percent={percent[index]} />
    </div>
  ));
  const fileName =
    previews.length === 0
      ? defaultMsg
      : previews.reduce((prev, curr) => prev + `${curr.fileName}\n`, "");

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 20,
          justifyContent: "space-evenly",
          marginBottom: 20,
        }}
      >
        {previewImages}
      </div>
      <form onSubmit={onUploadV2}>
        <div className="file-dropper">
          {fileName}
          {/*<label htmlFor="image-upload">{fileName}</label>*/}
          <input
            id="image-upload"
            type="file"
            multiple
            onChange={onChangeInput}
            ref={inputRef}
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
