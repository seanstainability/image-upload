import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
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

  useEffect(() => {
    setImgLoading(true);
    axios
      .get(imgUrl)
      .then((result) => {
        console.log(result.data);
        setImages((prev) => [...prev, ...result.data]);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setImgLoading(false));
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
  const lastImageId = images.length > 0 ? images[images.length - 1]._id : null;
  const loadMoreImages = useCallback(() => {
    if (imgLoading || !lastImageId) return;
    setImgUrl(`/images?lastId=${lastImageId}`);
  }, [lastImageId, imgLoading]);

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
        imgLoading,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};
