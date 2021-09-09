import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "material-react-toastify";

const ToolBar = () => {
  const [me, setMe] = useContext(AuthContext);

  const onLogout = async () => {
    try {
      await axios.patch("/logout");
      setMe();
      toast.success("로그아웃 완료!");
    } catch (err) {
      console.error(err);
      toast.error("로그아웃 실패!");
    }
  };

  return (
    <div>
      <Link to="/">
        <span>홈</span>
      </Link>
      {me ? (
        <>
          <span onClick={onLogout} style={{ float: "right" }}>
            로그아웃
          </span>
          <span style={{ float: "right", marginRight: 10 }}>{me.nickname}</span>
        </>
      ) : (
        <>
          <Link to="/auth/register">
            <span style={{ float: "right" }}>회원가입</span>
          </Link>
          <Link to="/auth/login">
            <span style={{ float: "right", marginRight: 10 }}>로그인</span>
          </Link>
        </>
      )}
    </div>
  );
};

export default ToolBar;
