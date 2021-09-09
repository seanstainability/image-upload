import React, { useContext } from "react";
import axios from "axios";
import { toast } from "material-react-toastify";
import { useHistory } from "react-router-dom";

import useInput from "../hooks/useInput";
import CustomInput from "../components/CustomInput";
import { AuthContext } from "../context/AuthContext";

const RegisterPage = () => {
  const history = useHistory();
  const [, setMe] = useContext(AuthContext);
  const [nickname, onChangeNickname] = useInput("");
  const [email, onChangeEmail] = useInput("");
  const [password, onChangePassword] = useInput("");
  const [passwordCheck, onChangePasswordCheck] = useInput("");

  const onRegister = async (e) => {
    try {
      e.preventDefault();
      console.log(nickname, email, password, passwordCheck);
      // 이메일 정규식 추가
      if (nickname.length < 3)
        throw new Error("닉네임은 3자 이상이어야 합니다.");
      if (password.length < 6)
        throw new Error("비밀번호는 6자 이상이어야 합니다.");
      if (password !== passwordCheck)
        throw new Error("비밀번호가 일치하지 않습니다.");
      const result = await axios.post("/users/register", {
        nickname,
        email,
        password,
      });
      console.log(result);
      setMe({
        userId: result.data.userId,
        sessionId: result.data.sessionId,
        nickname: result.data.nickname,
      });
      toast.success("회원가입 성공!");
      history.push("/");
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.message);
    }
  };

  return (
    <div style={{ maxWidth: 350, margin: "auto" }}>
      <h3>[ 회원가입 ]</h3>
      <form onSubmit={onRegister}>
        <CustomInput label="이메일" value={email} handler={onChangeEmail} />
        <CustomInput
          label="닉네임"
          value={nickname}
          handler={onChangeNickname}
        />
        <CustomInput
          label="비밀번호"
          value={password}
          handler={onChangePassword}
          type="password"
        />
        <CustomInput
          label="비밀번호 확인"
          value={passwordCheck}
          handler={onChangePasswordCheck}
          type="password"
        />
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default RegisterPage;
