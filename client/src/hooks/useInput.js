import { useState } from "react";

// eslint-disable-next-line
export default (initialValue = null) => {
  const [value, setter] = useState(initialValue);

  const handler = (e) => {
    setter(e.target.value);
  };

  return [value, handler];
};
