import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [images, setImages] = useState([]);

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

  return (
    <ImageContext.Provider value={[images, setImages]}>
      {children}
    </ImageContext.Provider>
  );
};
