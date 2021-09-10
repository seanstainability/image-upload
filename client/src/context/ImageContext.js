import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

import { AuthContext } from "./AuthContext";

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [me] = useContext(AuthContext);
  const [images, setImages] = useState([]);
  const [myImages, setMyImages] = useState([]);
  const [isPublic, setIsPublic] = useState(false);
  const [imgUrl, setImgUrl] = useState("/images");

  useEffect(() => {
    axios
      .get(imgUrl)
      .then((result) => {
        console.log(result.data);
        setImages((prev) => [...prev, ...result.data]);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [imgUrl]);
  useEffect(() => {
    if (me) {
      setTimeout(() => {
        axios
          .get("/users/me/images")
          .then((result) => {
            console.log(result.data);
            setMyImages(result.data);
          })
          .catch((err) => {
            console.error(err);
          });
      }, 0);
    } else {
      setMyImages([]);
      setIsPublic(true);
    }
  }, [me]);
  const loadMoreImages = () => {
    if (images.length === 0) return;
    const lastImageId = images[images.length - 1]._id;
    setImgUrl(`/images?lastId=${lastImageId}`);
  };

  return (
    <ImageContext.Provider
      value={{
        images,
        setImages,
        myImages,
        setMyImages,
        isPublic,
        setIsPublic,
        loadMoreImages,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};
