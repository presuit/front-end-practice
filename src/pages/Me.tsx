import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Menu } from "../components/Menu";
import { useMe, useMyWallet } from "../hooks/useMe";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAt,
  faCheck,
  faUserCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { WalletHistory } from "../components/WalletHistory";
import { useReactiveVar } from "@apollo/client";
import { currentMeMenu } from "../apollo";

export enum MeMenus {
  UsernameMenu = "meUsernameMenu",
  BuyingHistoryMenu = "meBuyingHistoryMenu",
  SellingHistoryMenu = "meSellingHistoryMenu",
}

export const Me = () => {
  const { data, loading } = useMe();
  const { data: myWalletData, loading: myWalletLoading } = useMyWallet();
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
    if (data?.me.user?.isVerified === false) {
      history.push("/not-valid-user");
    }
  }, [data]);

  console.log(myWalletData);

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
                  <div className="md:flex shadow hover:shadow-xl transition-shadow duration-500 border bg-amber-400 border-indigo-600">
                    <div
                      className="py-32 w-full md:w-1/3 md:py-40 bg-cover bg-center "
                      style={{
                        backgroundImage: `url(${data.me.user.avatarImg})`,
                      }}
                    ></div>
                    <div className=" md:w-2/3 grid grid-cols-3  w-full">
                      <h2 className="py-10 md:py-0 w-full h-full md:text-base lg:text-xl 2xl:text-2xl text-xs font-semibold text-indigo-600  border-r-2 border-dotted border-indigo-600  flex justify-center items-center relative">
                        <span className="z-10 text-black">
                          {data.me.user.email}
                        </span>
                        <FontAwesomeIcon
                          icon={faAt}
                          className="md:text-9xl text-6xl absolute mx-auto text-center opacity-40"
                        />
                      </h2>
                      <h2 className="py-10 md:py-0 w-full h-full md:text-base lg:text-xl 2xl:text-2xl text-xs font-semibold text-indigo-600  border-r-2 border-dotted border-indigo-600 flex justify-center items-center relative">
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
                      </h2>
                      <h2 className="py-10 md:py-0 w-full h-full md:text-base lg:text-xl 2xl:text-2xl text-xs font-semibold text-indigo-600 flex justify-center items-center relative">
                        <span className="z-10 text-black">
                          {data.me.user.username}
                        </span>
                        <FontAwesomeIcon
                          icon={faUserCircle}
                          className="md:text-9xl text-6xl absolute mx-auto text-center opacity-40"
                        />
                      </h2>
                    </div>
                  </div>
                  <div className=" mt-10   shadow  transition-shadow flex justify-around items-center">
                    <h1 className="w-full md:text-2xl  text-center py-5 md:py-10 px-5 rounded-l-2xl bg-indigo-600 text-amber-300 ">
                      보유 포인트:{" "}
                      {myWalletData?.myWallet.wallet?.point ? (
                        <span className=" font-semibold ">
                          {myWalletData?.myWallet.wallet?.point}
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
                  <div className="bg-white pt-10 pb-20 px-10"></div>
                  <div className="flex overflow-hidden">
                    {Array.from({ length: 50 }, () => "a").map((_, index) => (
                      <div
                        key={index}
                        className="w-0 h-0"
                        style={{
                          borderTop: "1rem solid white",
                          borderLeft: "1rem solid transparent",
                          borderRight: "1rem solid transparent",
                        }}
                      ></div>
                    ))}
                  </div>
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
