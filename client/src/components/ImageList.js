import React, { useContext } from "react";

import { ImageContext } from "../context/ImageContext";

const ImageList = () => {
  const [images] = useContext(ImageContext);

  const imageList = images.map((image) => (
    <img
      key={image.key}
      src={`/uploads/${image.key}`}
      alt=""
      style={{ width: "100%" }}
    />
  ));

  return (
    <div>
      <h3>목록</h3>
      {imageList}
    </div>
  );
};

export default ImageList;
