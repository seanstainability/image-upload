import React, { useContext } from "react";
import "./ImageList.css";
import { Link } from "react-router-dom";

import { ImageContext } from "../context/ImageContext";
import { AuthContext } from "../context/AuthContext";

const ImageList = () => {
  const [me] = useContext(AuthContext);
  const { images, myImages, isPublic, setIsPublic } = useContext(ImageContext);

  const imageList = (isPublic ? images : myImages).map((image) => (
    <Link to={`/images/${image._id}`} key={image.key}>
      <img src={`/uploads/${image.key}`} alt="" />
    </Link>
  ));

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <h4 style={{ display: "inline-block", fontWeight: "bold" }}>
          🌉 {isPublic ? "공개" : "개인"}사진목록
        </h4>
        {me && (
          <button onClick={() => setIsPublic(!isPublic)}>
            {isPublic ? "개인" : "공개"}사진보기
          </button>
        )}
      </div>
      <div className="image-list--container">{imageList}</div>
    </div>
  );
};

export default ImageList;
