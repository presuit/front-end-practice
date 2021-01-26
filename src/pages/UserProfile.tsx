import { gql, useQuery, useReactiveVar } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { currentUserProfileMenu } from "../apollo";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useMe } from "../hooks/useMe";
import {
  findUserById,
  findUserByIdVariables,
} from "../__generated__/findUserById";

interface IParams {
  id: string;
}

const FIND_USER_BY_ID_QUERY = gql`
  query findUserById($input: FindUserByIdInput!) {
    findUserById(input: $input) {
      ok
      error
      user {
        id
        email
        isVerified
        username
        avatarImg
      }
    }
  }
`;
export enum UserProfileMenus {
  UsernameMenu = "UsernameMenu",
  SellingHistoryMenu = "SellingHistoryMenu",
}

export const UserProfile = () => {
  const history = useHistory();
  const { id } = useParams<IParams>();
  const currentMenu = useReactiveVar(currentUserProfileMenu);
  const [selected, setSelected] = useState<string>(currentMenu);
  const { loading: userLoading, data: userData } = useMe();
  const { loading, data } = useQuery<findUserById, findUserByIdVariables>(
    FIND_USER_BY_ID_QUERY,
    { variables: { input: { userId: +id } } }
  );

  const onClickMenu = (e: any) => {
    let targetMenu = e.target;
    if (targetMenu.tagName === "H2") {
      targetMenu = targetMenu.parentNode;
    }
    if (targetMenu.id) {
      if (selected) {
        if (selected === targetMenu.id) {
          return;
        }
        const selectedMenu = document.getElementById(selected);
        selectedMenu?.classList.remove("bg-indigo-500", "text-amber-300");
      }

      if (targetMenu.id === UserProfileMenus.SellingHistoryMenu) {
        setSelected(UserProfileMenus.SellingHistoryMenu);
        currentUserProfileMenu(UserProfileMenus.SellingHistoryMenu);
      }
      if (targetMenu.id === UserProfileMenus.UsernameMenu) {
        setSelected(UserProfileMenus.UsernameMenu);
        currentUserProfileMenu(UserProfileMenus.UsernameMenu);
      }
    }
  };

  useEffect(() => {
    const selectedMenu = document.getElementById(selected);
    if (selectedMenu) {
      selectedMenu.classList.add("bg-indigo-500", "text-amber-300");
    }
  }, [selected]);

  useEffect(() => {
    if (userData?.me.user?.isVerified === false) {
      history.push("/not-valid-user");
    }
  }, [userData]);

  useEffect(() => {
    if (userData?.me.user && data?.findUserById.user) {
      if (userData?.me.user.id === data?.findUserById.user.id) {
        history.push("/me");
      }
    }
  }, [userData, data]);

  if (userLoading) {
    <LoadingSpinner />;
  }
  return (
    <div>
      <div>
        {data?.findUserById.user && (
          <>
            <div className="max-w-screen-2xl  min-h-screen  mx-12 2xl:mx-auto shadow-2xl">
              <header className="flex w-full items-center justify-between shadow-2xl bg-amber-300">
                <div
                  id={UserProfileMenus.UsernameMenu}
                  onClick={onClickMenu}
                  className="w-full py-5 cursor-pointer overflow-hidden bg-indigo-500 text-amber-300"
                >
                  <h2 className="text-xs md:text-xl text-center font-semibold uppercase">
                    {data.findUserById.user.username}
                  </h2>
                </div>
                <div
                  id={UserProfileMenus.SellingHistoryMenu}
                  onClick={onClickMenu}
                  className="w-full py-5 cursor-pointer  "
                >
                  <h2 className="text-xs md:text-xl text-center font-semibold">
                    판매 내역
                  </h2>
                </div>
              </header>
              {selected === UserProfileMenus.UsernameMenu && (
                <div>UserName</div>
              )}
              {selected === UserProfileMenus.SellingHistoryMenu && (
                <div>SellingHistory</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
