import React from "react";
import { ToastContainer } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";

import UploadForm from "./components/UploadForm";
import ImageList from "./components/ImageList";

const App = () => {
  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>사진첩</h2>
      <UploadForm />
      <ImageList />
      <ToastContainer />
    </div>
  );
};

export default App;
