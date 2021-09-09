import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

import { AuthContext } from "./AuthContext";

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [me] = useContext(AuthContext);
  const [images, setImages] = useState([]);
  const [myImages, setMyImages] = useState([]);
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    axios
      .get("/images")
      .then((result) => {
        console.log(result.data);
        setImages(result.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
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

  return (
    <ImageContext.Provider
      value={{
        images,
        setImages,
        myImages,
        setMyImages,
        isPublic,
        setIsPublic,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};
