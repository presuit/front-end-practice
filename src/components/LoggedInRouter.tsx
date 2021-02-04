import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useMe } from "../hooks/useMe";
import { Home } from "../pages/Home";
import { Me } from "../pages/Me";
import { Messages } from "../pages/Messages";
import { UserProfile } from "../pages/UserProfile";
import { ValidationCode } from "../pages/ValidateCode";
import "../styles/animation.css";
import { NotValidUser } from "../pages/NotValidUser";
import { Product } from "../pages/Product";
import { LoadingSpinner } from "./LoadingSpinner";
import { CreateProduct } from "../pages/CreateProduct";
import { EditProfile } from "../pages/EditProfile";
import { EditProduct } from "../pages/EditProduct";
import { MsgRoom } from "../pages/MsgRoom";
import { gql, useReactiveVar, useSubscription } from "@apollo/client";
import { receiveMsgCount } from "../__generated__/receiveMsgCount";
import { newMsgManager } from "../apollo";

export const RECEIVE_MSG_COUNT = gql`
  subscription receiveMsgCount {
    receiveMsgCount {
      id
      msgCounts
      createdAt
    }
  }
`;

const routes = [
  {
    path: "/",
    component: Home,
    exact: true,
  },
  {
    path: "/not-valid-user",
    component: NotValidUser,
  },
  {
    path: "/validate-code",
    component: ValidationCode,
  },
  {
    path: "/me",
    component: Me,
  },
  {
    path: "/messages",
    component: Messages,
    exact: true,
  },
  {
    path: "/messages/:id",
    component: MsgRoom,
  },
  {
    path: "/users/:id",
    component: UserProfile,
    exact: true,
  },
  {
    path: "/users/:id/edit-profile",
    component: EditProfile,
  },
  {
    path: "/category/:slug",
    component: Home,
  },
  {
    path: "/product/new",
    component: CreateProduct,
  },
  {
    path: "/product/:id",
    component: Product,
    exact: true,
  },
  {
    path: "/product/:id/edit",
    component: EditProduct,
  },
];

export const LoggedInRouter = () => {
  const { loading, error, data: userData, refetch: refetchMe } = useMe();
  const { data: receiveMsgCountData } = useSubscription<receiveMsgCount>(
    RECEIVE_MSG_COUNT
  );
  const _newMsgManager = useReactiveVar(newMsgManager);
  const onClickToRestart = () => {
    const token = localStorage.getItem("token");
    if (token) {
      localStorage.removeItem("token");
    }
    window.location.href = "/";
    window.location.reload();
  };

  useEffect(() => {
    (() => {
      return refetchMe();
    })();
    if (receiveMsgCountData?.receiveMsgCount) {
      const {
        receiveMsgCount: { msgCounts, id: msgRoomId },
      } = receiveMsgCountData;

      if (
        window.location.href === `http://localhost:3000/messages/${msgRoomId}`
      ) {
        return;
      }

      if (userData?.me.user?.msgRooms) {
        const msgRoomAuth = userData.me.user.msgRooms.find(
          (each) => each.id === msgRoomId
        );
        if (!msgRoomAuth) {
          return;
        }
      }

      const findOne = _newMsgManager.find((each) => each.id === msgRoomId);
      if (findOne) {
        const filtered = _newMsgManager.filter((each) => each.id !== msgRoomId);
        newMsgManager([
          ...filtered,
          { ...findOne, newMsg: msgCounts - findOne.prevMsg },
        ]);
      } else {
        newMsgManager([
          ..._newMsgManager,
          { id: msgRoomId, prevMsg: msgCounts - 1, newMsg: 1 },
        ]);
      }
    }
  }, [receiveMsgCountData]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
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

  console.log(
    "receiveMsgCountData",
    receiveMsgCountData?.receiveMsgCount,
    "userDAta",
    userData?.me.user?.msgRooms
  );

  return (
    <Router>
      <Switch>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            component={route.component}
            exact={route.exact}
          />
        ))}
        <Route>
          <Redirect to={"/"} />
        </Route>
      </Switch>
    </Router>
  );
};
