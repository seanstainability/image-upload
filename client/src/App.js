import React from "react";
import { ToastContainer } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";

import UploadForm from "./components/UploadForm";

const App = () => {
  return (
    <div>
      <h2>사진첩</h2>
      <UploadForm />
      <ToastContainer />
    </div>
  );
};

export default App;
