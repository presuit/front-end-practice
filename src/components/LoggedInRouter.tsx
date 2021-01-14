import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory,
} from "react-router-dom";
import { useMe } from "../hooks/useMe";
import { Home } from "../pages/Home";
import { Me } from "../pages/Me";
import { Messages } from "../pages/Messages";
import { UserProfile } from "../pages/UserProfile";
import { ValidationCode } from "../pages/ValidateCode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import "../styles/animation.css";

export const LoggedInRouter = () => {
  const { loading, error } = useMe();
  const onClickToRestart = () => {
    const token = localStorage.getItem("token");
    if (token) {
      localStorage.removeItem("token");
    }
    window.location.href = "/";
    window.location.reload();
  };
  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <FontAwesomeIcon
          className="text-5xl text-white spinAround "
          icon={faSpinner}
        />
      </div>
    );
  }
  if (!loading && error) {
    return (
      <>
        <div className="h-screen flex flex-col items-center justify-center  px-16">
          <h1 className="text-5xl font-bold text-red-500">유저 에러 발생!</h1>
          <h3 className="mt-10 text-3xl font-medium text-white">
            유저 토큰에 문제가 생겼습니다.
          </h3>
          <h3 className="mt-10 text-3xl font-medium text-white">
            다시 로그인 해주세요.
          </h3>

          <button
            onClick={onClickToRestart}
            className="mt-10 py-5 px-5 ring-4 ring-indigo-600  focus:outline-none rounded-lg shadow-lg text-white "
          >
            다시 로그인하기
          </button>
        </div>
      </>
    );
  }
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/validate-code">
          <ValidationCode />
        </Route>
        <Route path="/me">
          <Me />
        </Route>
        <Route path="/users/:id">
          <UserProfile />
        </Route>
        <Route path="/messages">
          <Messages />
        </Route>
        <Route>
          <Redirect to={"/"} />
        </Route>
      </Switch>
    </Router>
  );
};
