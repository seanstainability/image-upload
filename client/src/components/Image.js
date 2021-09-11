import React, { useEffect, useState } from "react";

const Image = ({ imageUrl }) => {
  const [isError, setIsError] = useState(false);
  const [hashedUrl, setHashedUrl] = useState(imageUrl);

  useEffect(() => {
    let intervalId;
    if (isError && !intervalId) {
      intervalId = setInterval(
        () => setHashedUrl(`${imageUrl}#${Date.now()}`),
        1000
      );
    } else if (!isError && intervalId) {
      clearInterval(intervalId);
    } else {
      setHashedUrl(imageUrl);
    }
    return () => clearInterval(intervalId);
  }, [isError, setHashedUrl, imageUrl]);

  return (
    <img
      alt=""
      src={hashedUrl}
      style={{ display: isError ? "none" : "block" }}
      onLoad={() => setIsError(false)}
      onError={() => setIsError(true)}
    />
  );
};

export default Image;
