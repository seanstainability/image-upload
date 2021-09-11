import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "material-react-toastify";

import { ImageContext } from "../context/ImageContext";
import { AuthContext } from "../context/AuthContext";

const ImagePage = () => {
  const history = useHistory();
  const { imageId } = useParams();
  const { images, setImages, setMyImages } = useContext(ImageContext);
  const [me] = useContext(AuthContext);
  const [hasLiked, setHasLiked] = useState(false);
  const [image, setImage] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const image = images.find((img) => img._id === imageId);
    if (image) setImage(image);
  }, [images, imageId]);
  useEffect(() => {
    if (image && image._id === imageId) return;
    axios
      .get(`/images/${imageId}`)
      .then(({ data }) => {
        setImage(data);
        setError(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        toast.error(err.response.data.message);
      });
  }, [imageId, image]);
  useEffect(() => {
    if (me && image?.likes.map((v) => v._id).includes(me.userId))
      setHasLiked(true);
  }, [me, image]);
  const updateImage = (images, image) =>
    [...images.filter((img) => img._id !== imageId), image].sort((a, b) => {
      // new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (a._id < b._id) return 1;
      else return -1;
    });
  const onToggleLike = async () => {
    const result = await axios.patch(
      `/images/${imageId}/${hasLiked ? "unlike" : "like"}`
    );
    if (result.data.public) {
      setImages(updateImage(images, result.data));
    } else {
      setMyImages(updateImage(images, result.data));
    }
    setHasLiked(!hasLiked);
  };
  const deleteImage = (images) => images.filter((img) => img._id !== imageId);
  const onDelete = async () => {
    try {
      if (!window.confirm("정말 해당 이미지를 삭제하시겠습니까?")) return;
      const result = await axios.delete(`/images/${imageId}`);
      toast.success(result.data.message);
      setImages(deleteImage(images));
      setMyImages(deleteImage(images));
      history.push("/");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };
  if (error) return <h4>잘못된 접근입니다.</h4>;
  else if (!image) return <h4>로딩 중...</h4>;

  return (
    <div>
      <h4>상세 이미지</h4>
      <div style={{ marginBottom: 5 }}>
        <span style={{ fontWeight: "bold" }}>좋아요 {image.likes.length}</span>
        {image.user._id === me?.userId && (
          <button style={{ float: "right" }} onClick={onDelete}>
            삭제
          </button>
        )}
        {me && (
          <button
            style={{ float: "right", marginRight: 10 }}
            onClick={onToggleLike}
          >
            {hasLiked ? "좋아요 취소" : "좋아요"}
          </button>
        )}
      </div>
      <img
        src={`https://d1uh2bybdvfw6i.cloudfront.net/w600/${image.key}`}
        alt=""
        style={{ width: "100%" }}
      />
    </div>
  );
};

export default ImagePage;
