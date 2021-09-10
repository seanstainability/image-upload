import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import axios from "axios";

import { AuthContext } from "./AuthContext";

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [me] = useContext(AuthContext);
  const [images, setImages] = useState([]);
  const [myImages, setMyImages] = useState([]);
  const [isPublic, setIsPublic] = useState(false);
  const [imgUrl, setImgUrl] = useState("/images");
  const [imgLoading, setImgLoading] = useState(false);
  const prevImgUrlRef = useRef();

  useEffect(() => {
    if (prevImgUrlRef.current === imgUrl) return;
    setImgLoading(true);
    axios
      .get(imgUrl)
      .then((result) => {
        console.log(result.data);
        isPublic
          ? setImages((prev) => [...prev, ...result.data])
          : setMyImages((prev) => [...prev, ...result.data]);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setImgLoading(false);
        prevImgUrlRef.current = imgUrl;
      });
  }, [imgUrl, isPublic]);
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
        images: isPublic ? images : myImages,
        setImages,
        setMyImages,
        isPublic,
        setIsPublic,
        setImgUrl,
        imgLoading,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};
