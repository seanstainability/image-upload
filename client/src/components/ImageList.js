import React, { useContext, useState } from "react";

import { ImageContext } from "../context/ImageContext";
import { AuthContext } from "../context/AuthContext";

const ImageList = () => {
  const [me] = useContext(AuthContext);
  const { images, myImages, isPublic, setIsPublic } = useContext(ImageContext);

  const imageList = (isPublic ? images : myImages).map((image) => (
    <img
      key={image.key}
      src={`/uploads/${image.key}`}
      alt=""
      style={{ width: "100%" }}
    />
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
          {isPublic ? "공개" : "개인"}사진목록
        </h4>
        {me && (
          <button onClick={() => setIsPublic(!isPublic)}>
            {isPublic ? "개인" : "공개"}사진보기
          </button>
        )}
      </div>
      {imageList}
    </div>
  );
};

export default ImageList;
