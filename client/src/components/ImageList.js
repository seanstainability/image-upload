import React, { useContext, useEffect, useRef } from "react";
import "./ImageList.css";
import { Link } from "react-router-dom";

import { ImageContext } from "../context/ImageContext";
import { AuthContext } from "../context/AuthContext";

const ImageList = () => {
  const [me] = useContext(AuthContext);
  const {
    images,
    myImages,
    isPublic,
    setIsPublic,
    loadMoreImages,
    imgLoading,
  } = useContext(ImageContext);
  const elementRef = useRef(null);

  useEffect(() => {
    if (!elementRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) loadMoreImages();
    });
    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [loadMoreImages]);
  const imageList = isPublic
    ? images.map((image, index) => (
        <Link
          to={`/images/${image._id}`}
          key={image.key}
          ref={index + 1 === images.length ? elementRef : undefined}
        >
          <img src={`/uploads/${image.key}`} alt="" />
        </Link>
      ))
    : myImages.map((image, index) => (
        <Link
          to={`/images/${image._id}`}
          key={image.key}
          ref={index + 5 === images.length ? elementRef : undefined} // 4번째 전
        >
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
