import { gql, useQuery, useReactiveVar } from "@apollo/client";
import {
  faAt,
  faUserCircle,
  faUserTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { currentUserProfileMenu } from "../apollo";
import { AvatarFullsize } from "../components/avatarFullsize";
import { BackButton } from "../components/BackButton";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { SellingHistory } from "../components/SellingHistory";
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
        sellingProducts {
          id
          name
          bigImg
        }
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
  const { loading: userLoading, data: userData } = useMe();
  const menuRef = useRef<HTMLDivElement>(null);
  const currentMenu = useReactiveVar(currentUserProfileMenu);
  const [selected, setSelected] = useState<string>(currentMenu);
  const [fullsizeMode, setFullsizeMode] = useState(false);
  const { data, error } = useQuery<findUserById, findUserByIdVariables>(
    FIND_USER_BY_ID_QUERY,
    { variables: { input: { userId: +id } }, fetchPolicy: "network-only" }
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

  const onClickToFullsize = () => {
    setFullsizeMode(true);
  };

  useEffect(() => {
    const selectedMenu = document.getElementById(selected);
    if (selectedMenu) {
      selectedMenu.classList.add("bg-indigo-500", "text-amber-300");
    }
  }, [data, selected]);

  useEffect(() => {
    if (userData?.me.user && data?.findUserById.user) {
      if (userData?.me.user.id === data?.findUserById.user.id) {
        history.push("/me");
      }
    }
  }, [userData, data]);

  useEffect(() => {
    if (userData?.me.user?.isVerified === false) {
      history.push("/not-valid-user");
    }
  }, [userData]);

  if (userLoading) {
    <LoadingSpinner />;
  }

  if (data) {
    if (!data.findUserById.ok) {
      history.goBack();
    }
  }

  if (error) {
    console.log(error);
    history.goBack();
  }

  console.log(menuRef);

  return (
    <div>
      <BackButton />
      {data?.findUserById.user && (
        <div>
          {data.findUserById.user.avatarImg && fullsizeMode === true && (
            <AvatarFullsize
              avatarUrl={data.findUserById.user.avatarImg}
              fullsizeMode={fullsizeMode}
              setFullsizeMode={setFullsizeMode}
            />
          )}
          <div className="max-w-screen-2xl  min-h-screen  mx-12 2xl:mx-auto shadow-2xl">
            <header className="flex w-full items-center justify-between shadow-2xl bg-amber-300">
              <div
                id={UserProfileMenus.UsernameMenu}
                onClick={onClickMenu}
                className="w-full py-5 cursor-pointer overflow-hidden "
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
            <main className="p-5">
              {selected === UserProfileMenus.UsernameMenu && (
                <>
                  <div className="grid grid-rows-2 md:grid-cols-2 md:grid-rows-1 w-full transition-shadow duration-500   ">
                    {data.findUserById.user.avatarImg ? (
                      <div className="overflow-hidden">
                        <div
                          onClick={onClickToFullsize}
                          className="w-full py-32 md:h-96 md:py-0 bg-cover bg-center transform hover:scale-125 duration-500 "
                          style={{
                            backgroundImage: `url(${data.findUserById.user.avatarImg})`,
                          }}
                        ></div>
                      </div>
                    ) : (
                      <div className="w-full py-20 md:py-32 flex items-center justify-center bg-indigo-800">
                        <FontAwesomeIcon
                          icon={faUserTimes}
                          className="md:text-9xl text-6xl text-indigo-500"
                        />
                      </div>
                    )}
                    <article className="w-full h-2/3 md:h-full grid grid-cols-2 grid-rows-1 bg-gray-200">
                      <section className="py-10 md:py-0 w-full h-full md:text-base lg:text-xl 2xl:text-2xl text-xs font-semibold text-indigo-600  border-r-2 border-dotted border-indigo-600  flex justify-center items-center relative">
                        <span className="z-10 text-black">
                          {data.findUserById.user.email}
                        </span>
                        <FontAwesomeIcon
                          icon={faAt}
                          className="md:text-9xl text-6xl absolute mx-auto text-center opacity-40"
                        />
                      </section>
                      <section className="py-10 md:py-0 w-full h-full md:text-base lg:text-xl 2xl:text-2xl text-xs font-semibold text-indigo-600 flex justify-center items-center relative">
                        <span className="z-10 text-black">
                          {data.findUserById.user.username}
                        </span>
                        <FontAwesomeIcon
                          icon={faUserCircle}
                          className="md:text-9xl text-6xl absolute mx-auto text-center opacity-40"
                        />
                      </section>
                    </article>
                  </div>
                </>
              )}
              {selected === UserProfileMenus.SellingHistoryMenu && (
                <div className="p-5 grid md:grid-cols-3 gap-5">
                  {data.findUserById.user.sellingProducts &&
                    data.findUserById.user.sellingProducts.map(
                      (eachHistory) => (
                        <SellingHistory
                          id={eachHistory.id}
                          key={eachHistory.id}
                          bigImg={eachHistory.bigImg}
                          name={eachHistory.name}
                        />
                      )
                    )}
                </div>
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
};
