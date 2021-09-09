import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [me, setMe] = useState(null);

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");
    if (me) {
      axios.defaults.headers.common.sessionid = me.sessionId;
      localStorage.setItem("sessionId", me.sessionId);
    } else if (sessionId) {
      axios
        .get("/users/me", {
          headers: { sessionid: sessionId },
        })
        .then((result) => {
          setMe({
            userId: result.data.userId,
            nickname: result.data.nickname,
            sessionId: result.data.sessionId,
          });
        })
        .catch((err) => {
          console.error(err);
          localStorage.removeItem("sessionId");
          delete axios.defaults.headers.common.sessionid;
        });
    } else {
      delete axios.defaults.headers.common.sessionid;
    }
  }, [me]);

  return (
    <AuthContext.Provider value={[me, setMe]}>{children}</AuthContext.Provider>
  );
};
