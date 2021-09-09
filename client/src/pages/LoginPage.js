import React, { useContext } from "react";
import axios from "axios";
import { toast } from "material-react-toastify";
import { useHistory } from "react-router-dom";

import CustomInput from "../components/CustomInput";
import useInput from "../hooks/useInput";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
  const history = useHistory();
  const [, setMe] = useContext(AuthContext);
  const [email, onChangeEmail] = useInput("");
  const [password, onChangePassword] = useInput("");

  const onLogIn = async (e) => {
    try {
      e.preventDefault();
      // 이메일 정규식 추가
      if (password.length < 6)
        throw new Error("입력하신 정보가 올바르지 않습니다.");
      const result = await axios.patch("/users/login", { email, password });
      console.log(result);
      setMe({
        userId: result.data.userId,
        sessionId: result.data.sessionId,
        nickname: result.data.nickname,
      });
      toast.success("로그인 성공!");
      history.push("/");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 350, margin: "auto" }}>
      <h3>[ 로그인 ]</h3>
      <form onSubmit={onLogIn}>
        <CustomInput label="이메일" value={email} handler={onChangeEmail} />
        <CustomInput
          label="비밀번호"
          value={password}
          handler={onChangePassword}
          type="password"
        />
        <button type="submit">로그인</button>
      </form>
    </div>
  );
};

export default LoginPage;
