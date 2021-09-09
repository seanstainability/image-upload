import React from "react";
import { ToastContainer } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import { Switch, Route } from "react-router-dom";
import ToolBar from "./components/ToolBar";

const App = () => {
  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <ToolBar />
      <Switch>
        <Route path="/auth/register" exact component={RegisterPage} />
        <Route path="/auth/login" exact component={LoginPage} />
        <Route path="/" exact component={MainPage} />
      </Switch>
      <ToastContainer />
    </div>
  );
};

export default App;
