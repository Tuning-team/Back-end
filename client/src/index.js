import ReactDOM from "react-dom";
import axios from "axios";
import React, { useEffect } from "react";

function Index() {
  useEffect(() => {
    axios
      .get("/api/user")
      .then((e) => console.log(e.data))
      .catch((e) => console.log(e));
  }, []);

  return (
    <>
      <h1>Hello, world!</h1>
      <a href="https://accounts.google.com/o/oauth2/auth?client_id=603162325798-hb44n9gjugoc6aoinmb0964ovrqi8uqe.apps.googleusercontent.com&redirect_uri=https://localhost/api/google_callback&scope=https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email&response_type=code&access_type=offline">
        구글로 로그인
      </a>
    </>
  );
}

ReactDOM.render(<Index />, document.getElementById("root"));

if (module.hot) {
  module.hot.accept();
}
