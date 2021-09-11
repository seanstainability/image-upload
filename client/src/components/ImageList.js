import React, { useCallback, useContext, useEffect, useRef } from "react";
import "./ImageList.css";
import { Link } from "react-router-dom";

import { ImageContext } from "../context/ImageContext";
import { AuthContext } from "../context/AuthContext";
import Image from "../components/Image";

const ImageList = () => {
  const [me] = useContext(AuthContext);
  const { images, isPublic, setIsPublic, imgLoading, setImgUrl } =
    useContext(ImageContext);
  const elementRef = useRef(null);

  const lastImageId = images.length > 0 ? images[images.length - 1]._id : null;
  const loadMoreImages = useCallback(() => {
    if (imgLoading || !lastImageId) return;
    setImgUrl(`${isPublic ? "" : "/users/me"}/images?lastId=${lastImageId}`);
  }, [lastImageId, imgLoading, isPublic, setImgUrl]);
  useEffect(() => {
    if (!elementRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) loadMoreImages();
    });
    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [loadMoreImages]);
  const imageList = images.map((image, index) => (
    <Link
      to={`/images/${image._id}`}
      key={image.key}
      ref={index + 1 === images.length ? elementRef : undefined}
    >
      <Image
        imageUrl={`https://d1uh2bybdvfw6i.cloudfront.net/w140/${image.key}`}
      />
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
      {imgLoading && <div>로딩 중...</div>}
      {/*{imgLoading ? (*/}
      {/*  <div>로딩 중...</div>*/}
      {/*) : (*/}
      {/*  <button onClick={loadMoreImages}>더보기</button>*/}
      {/*)}*/}
    </div>
  );
};

export default ImageList;
