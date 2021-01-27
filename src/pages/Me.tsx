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
import { gql, useLazyQuery, useQuery, useReactiveVar } from "@apollo/client";
import { currentMeMenu } from "../apollo";
import { numberWithCommas } from "../utils";
import { SellingHistory } from "../components/SellingHistory";
import {
  findUserById,
  findUserByIdVariables,
} from "../__generated__/findUserById";
import { LoadingSpinner } from "../components/LoadingSpinner";
import {
  userSellingHistory,
  userSellingHistoryVariables,
} from "../__generated__/userSellingHistory";
import { useForm } from "react-hook-form";

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
  const { data, loading, refetch: refetchMe } = useMe();
  const [
    sellingProductHistoryQuery,
    {
      loading: sellingPHLoading,
      data: sellingPHData,
      called,
      refetch: refetchSellingPH,
    },
  ] = useLazyQuery<userSellingHistory, userSellingHistoryVariables>(
    USER_SELLING_HISTORY_QUERY
  );
  const {
    data: myWalletData,
    loading: myWalletLoading,
    refetch,
  } = useMyWallet();
  const history = useHistory();
  const currentMenu = useReactiveVar(currentMeMenu);
  const [selected, setSelected] = useState<string>(currentMenu);

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

  useEffect(() => {
    const selectedMenu = document.getElementById(selected);
    if (selectedMenu) {
      selectedMenu.classList.add("bg-indigo-500", "text-amber-300");
    }
  }, [selected]);

  useEffect(() => {
    console.log("data Effect!");
    if (data?.me.user?.isVerified === false) {
      history.push("/not-valid-user");
    }
  }, [data]);

  useEffect(() => {
    refetch();
    refetchMe();
    if (data?.me.user?.id) {
      console.log("data Effect and user!");
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
          <div className="max-w-screen-2xl  min-h-screen  mx-12 2xl:mx-auto shadow-2xl">
            <header className="flex w-full items-center justify-between shadow-2xl bg-amber-300">
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
                  <div className="grid grid-rows-2 md:grid-cols-2 md:grid-rows-1 w-full">
                    {data.me.user.avatarImg ? (
                      <div
                        className="w-full py-32 bg-cover bg-center "
                        style={{
                          backgroundImage: `url(${data.me.user.avatarImg})`,
                        }}
                      ></div>
                    ) : (
                      <div className="w-full bg-indigo-800 ">
                        <div className="w-full py-20 md:py-32 flex items-center justify-center bg-indigo-800">
                          <FontAwesomeIcon
                            icon={faUserTimes}
                            className="md:text-9xl text-6xl text-indigo-500"
                          />
                        </div>
                      </div>
                    )}
                    <article className="w-full h-full grid grid-cols-3 grid-rows-1 bg-gray-200 ">
                      <section className="py-10 md:px-5 w-full h-full md:text-base lg:text-xl 2xl:text-2xl  font-semibold text-indigo-600  border-r-2 border-dotted border-indigo-600  flex justify-center items-center relative ">
                        <span className="z-10 text-black">
                          {data.me.user.email}
                        </span>
                        <FontAwesomeIcon
                          icon={faAt}
                          className="md:text-9xl text-6xl absolute mx-auto text-center opacity-40"
                        />
                      </section>
                      <section className="py-10 md:px-5 w-full h-full md:text-base lg:text-xl 2xl:text-2xl  font-semibold text-indigo-600  border-r-2 border-dotted border-indigo-600 flex justify-center items-center relative">
                        <span className="z-10 text-black">
                          {data.me.user.isVerified
                            ? "인증 됨"
                            : "인증되지 않음"}
                        </span>
                        {data.me.user.isVerified ? (
                          <FontAwesomeIcon
                            icon={faCheck}
                            className=" md:text-9xl text-6xl absolute mx-auto text-center opacity-40"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faTimes}
                            className=" md:text-9xl text-6xl absolute mx-auto text-center opacity-40"
                          />
                        )}
                      </section>
                      <section className="py-10 md:px-5 w-full h-full md:text-base lg:text-xl 2xl:text-2xl  font-semibold text-indigo-600 flex justify-center items-center relative">
                        <span className="z-10 text-black">
                          {data.me.user.username}
                        </span>
                        <FontAwesomeIcon
                          icon={faUserCircle}
                          className="md:text-9xl text-6xl absolute mx-auto text-center opacity-40"
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
                  <div className=" mt-5 shadow  transition-shadow flex justify-around items-center">
                    <h1 className="w-full md:text-2xl  text-center py-5 md:py-10 px-5 rounded-l-2xl bg-indigo-600 text-amber-300 ">
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
                    <button className="w-full md:text-2xl bg-teal-500 py-5 md:py-10 px-5 rounded-r-2xl focus:outline-none focus:ring-4 ring-teal-600 font-semibold text-gray-200 ">
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
                    <div className="p-5 grid md:grid-cols-3 gap-5">
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
