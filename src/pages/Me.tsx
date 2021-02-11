import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Menu } from "../components/Menu";
import { useMe, useMyWallet } from "../hooks/useMe";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAt,
  faCheck,
  faUserCircle,
  faTimes,
  faPlus,
  faUserTimes,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { WalletHistory } from "../components/WalletHistory";
import { gql, useLazyQuery, useReactiveVar } from "@apollo/client";
import { currentMeMenu } from "../apollo";
import { numberWithCommas } from "../utils";
import { SellingHistory } from "../components/SellingHistory";
import { LoadingSpinner } from "../components/LoadingSpinner";
import {
  userSellingHistory,
  userSellingHistoryVariables,
} from "../__generated__/userSellingHistory";
import { AvatarFullsize } from "../components/avatarFullsize";
import { url } from "inspector";

export enum MeMenus {
  UsernameMenu = "meUsernameMenu",
  BuyingHistoryMenu = "meBuyingHistoryMenu",
  SellingHistoryMenu = "meSellingHistoryMenu",
}

const USER_SELLING_HISTORY_QUERY = gql`
  query userSellingHistory($input: FindUserByIdInput!) {
    findUserById(input: $input) {
      ok
      error
      user {
        id
        sellingProducts {
          id
          name
          bigImg
        }
      }
    }
  }
`;

export const Me = () => {
  const history = useHistory();
  const currentMenu = useReactiveVar(currentMeMenu);
  const [selected, setSelected] = useState<string>(currentMenu);
  const [fullsizeMode, setFullsizeMode] = useState(false);
  const { data, loading, refetch: refetchMe } = useMe();

  const [
    sellingProductHistoryQuery,
    { loading: sellingPHLoading, data: sellingPHData, called },
  ] = useLazyQuery<userSellingHistory, userSellingHistoryVariables>(
    USER_SELLING_HISTORY_QUERY,
    { fetchPolicy: "network-only" }
  );

  const {
    data: myWalletData,
    loading: myWalletLoading,
    refetch,
  } = useMyWallet();

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
      if (targetMenu.id === MeMenus.BuyingHistoryMenu) {
        setSelected(MeMenus.BuyingHistoryMenu);
        currentMeMenu(MeMenus.BuyingHistoryMenu);
      }
      if (targetMenu.id === MeMenus.SellingHistoryMenu) {
        setSelected(MeMenus.SellingHistoryMenu);
        currentMeMenu(MeMenus.SellingHistoryMenu);
      }
      if (targetMenu.id === MeMenus.UsernameMenu) {
        setSelected(MeMenus.UsernameMenu);
        currentMeMenu(MeMenus.UsernameMenu);
      }
    }
  };

  const onClickLogOut = () => {
    const token = localStorage.getItem("token");
    if (token) {
      localStorage.removeItem("token");
    }
    history.push("/");
    window.location.reload();
  };

  const onClickToFullsize = () => {
    setFullsizeMode(true);
  };

  useEffect(() => {
    const selectedMenu = document.getElementById(selected);
    if (selectedMenu) {
      selectedMenu.classList.add("bg-indigo-500", "text-amber-300");
    }
  }, [selected]);

  useEffect(() => {
    if (data?.me.user?.isVerified === false) {
      history.push("/not-valid-user");
    }
  }, [data]);

  useEffect(() => {
    refetch();
    refetchMe();
    if (data?.me.user?.id) {
      sellingProductHistoryQuery({
        variables: { input: { userId: data?.me.user?.id } },
      });
    }
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {!loading && data?.me.user && (
        <>
          {data.me.user.avatarImg && fullsizeMode === true && (
            <AvatarFullsize
              avatarUrl={data.me.user.avatarImg}
              fullsizeMode={fullsizeMode}
              setFullsizeMode={setFullsizeMode}
            />
          )}
          <div className="max-w-screen-2xl  min-h-screen  2xl:mx-auto">
            <header className="flex w-full items-stretch justify-between shadow-2xl bg-amber-300">
              <div
                id={MeMenus.UsernameMenu}
                onClick={onClickMenu}
                className="w-full py-5   cursor-pointer overflow-hidden"
              >
                <h2 className="text-xs md:text-xl text-center font-semibold uppercase">
                  {data.me.user.username}
                </h2>
              </div>
              <div
                id={MeMenus.BuyingHistoryMenu}
                onClick={onClickMenu}
                className="w-full py-5 cursor-pointer "
              >
                <h2 className="text-xs md:text-xl text-center font-semibold">
                  구매 내역
                </h2>
              </div>
              <div
                id={MeMenus.SellingHistoryMenu}
                onClick={onClickMenu}
                className="w-full py-5 cursor-pointer  "
              >
                <h2 className="text-xs md:text-xl text-center font-semibold">
                  판매 내역
                </h2>
              </div>
              <div
                onClick={onClickLogOut}
                className="w-6/12 py-5 cursor-pointer  bg-red-500 "
              >
                <h2 className="text-xs md:text-xl text-center font-semibold text-amber-300 ">
                  로그아웃
                </h2>
              </div>
            </header>
            <main className="p-5">
              {selected === MeMenus.UsernameMenu && (
                <>
                  <div className="flex flex-col items-center lg:grid lg:grid-cols-2 lg:grid-rows-1 w-full shadow-xl">
                    {data.me.user.avatarImg ? (
                      <div className="w-full h-60 md:h-96  overflow-hidden">
                        <div
                          onClick={onClickToFullsize}
                          className="w-full h-full  bg-cover bg-center cursor-pointer transform hover:scale-125 duration-500"
                          style={{
                            backgroundImage: `url(${data.me.user.avatarImg})`,
                          }}
                        ></div>
                      </div>
                    ) : (
                      <div className="w-full bg-indigo-800 ">
                        <div className="w-full py-20 lg:py-32 flex items-center justify-center bg-indigo-800">
                          <FontAwesomeIcon
                            icon={faUserTimes}
                            className="md:text-9xl text-6xl text-indigo-500"
                          />
                        </div>
                      </div>
                    )}
                    <article className=" w-full h-40 lg:h-full grid grid-cols-3 grid-rows-1 bg-indigo-500  ">
                      <section className=" w-full h-full   font-semibold text-indigo-800  border-r-2 border-dotted border-indigo-600  flex justify-center items-center relative  ">
                        <span className="z-10 text-gray-200 max-w-full break-words px-5 lg:text-xl">
                          {data.me.user.email}
                        </span>
                        <FontAwesomeIcon
                          icon={faAt}
                          className="lg:text-9xl text-6xl absolute mx-auto text-center opacity-40"
                        />
                      </section>
                      <section className=" w-full h-full   font-semibold text-indigo-800  border-r-2 border-dotted border-indigo-600 flex justify-center items-center relative">
                        <span className="z-10 text-black">
                          {data.me.user.isVerified ? (
                            <span className="text-gray-200 max-w-full break-words px-5 lg:text-xl">
                              인증 됨
                            </span>
                          ) : (
                            <span className="text-gray-200 max-w-full break-words px-5 lg:text-xl">
                              인증되지 않음
                            </span>
                          )}
                        </span>
                        {data.me.user.isVerified ? (
                          <FontAwesomeIcon
                            icon={faCheck}
                            className=" lg:text-9xl text-6xl absolute mx-auto text-center opacity-40"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faTimes}
                            className=" lg:text-9xl text-6xl absolute mx-auto text-center opacity-40"
                          />
                        )}
                      </section>
                      <section className=" w-full h-full   font-semibold text-indigo-800 flex justify-center items-center relative">
                        <span className="z-10 text-gray-200 max-w-full break-words px-5 lg:text-xl">
                          {data.me.user.username}
                        </span>
                        <FontAwesomeIcon
                          icon={faUserCircle}
                          className="lg:text-9xl text-6xl absolute mx-auto text-center opacity-40"
                        />
                      </section>
                    </article>
                  </div>
                  {/* edit Profile button */}
                  <div className="pt-3 flex justify-end items-center">
                    {data.me.user && (
                      <Link
                        to={`/users/${data.me.user.id}/edit-profile`}
                        className="md:text-xl text-base bg-indigo-600 py-5 px-3 text-gray-200 font-semibold rounded-xl"
                      >
                        프로필 수정하기
                      </Link>
                    )}
                  </div>
                  {/* point component */}
                  <div className=" mt-5  grid grid-cols-2 pb-32">
                    <h1 className="w-full h-full md:text-2xl  text-center py-5 md:py-10 px-5 rounded-l-2xl bg-indigo-600 text-amber-300 ">
                      <span className="text-gray-200">보유 포인트: </span>
                      {myWalletData?.myWallet.wallet?.point ? (
                        <span className=" font-semibold ">
                          {numberWithCommas(
                            myWalletData?.myWallet.wallet?.point
                          )}
                        </span>
                      ) : (
                        <span>0</span>
                      )}
                    </h1>
                    <button className="w-full h-full md:text-2xl bg-teal-500 py-5 md:py-10 px-5 rounded-r-2xl focus:outline-none focus:ring-4 ring-teal-600 font-semibold text-gray-200 ">
                      포인트 충전하기
                    </button>
                  </div>
                </>
              )}
              {selected === MeMenus.BuyingHistoryMenu && (
                <>
                  <div className="pt-10 pb-32 md:px-10 grid  md:grid-cols-3 gap-5  overflow-hidden">
                    {!myWalletLoading &&
                      myWalletData?.myWallet.wallet?.histories?.map(
                        (walletHistory, index) => (
                          <WalletHistory key={index} {...walletHistory} />
                        )
                      )}
                  </div>
                </>
              )}
              {selected === MeMenus.SellingHistoryMenu && (
                <>
                  {sellingPHLoading && called ? (
                    <LoadingSpinner />
                  ) : (
                    <div className="p-5 grid md:grid-cols-3 gap-5 pb-32">
                      {sellingPHData?.findUserById.user?.sellingProducts &&
                        sellingPHData?.findUserById.user?.sellingProducts.map(
                          (eachProduct) => (
                            <SellingHistory
                              key={eachProduct.id}
                              id={eachProduct.id}
                              bigImg={eachProduct.bigImg}
                              name={eachProduct.name}
                            />
                          )
                        )}
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
          <Menu />
        </>
      )}
    </div>
  );
};
