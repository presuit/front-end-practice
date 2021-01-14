import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Menu } from "../components/Menu";
import { useMe } from "../hooks/useMe";

enum UserProfileMenus {
  UsernameMenu = "userProfileUsernameMenu",
  BuyingHistoryMenu = "userProfileBuyingHistoryMenu",
  SellingHistoryMenu = "userProfileSellingHistoryMenu",
}

export const Me = () => {
  const { data, loading } = useMe();
  const history = useHistory();
  const [selected, setSelected] = useState<string>(
    UserProfileMenus.UsernameMenu
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
      if (targetMenu.id === UserProfileMenus.BuyingHistoryMenu) {
        setSelected(UserProfileMenus.BuyingHistoryMenu);
      }
      if (targetMenu.id === UserProfileMenus.SellingHistoryMenu) {
        setSelected(UserProfileMenus.SellingHistoryMenu);
      }
      if (targetMenu.id === UserProfileMenus.UsernameMenu) {
        setSelected(UserProfileMenus.UsernameMenu);
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

  return (
    <div>
      {!loading && data?.me.user && (
        <>
          <div className="max-w-screen-2xl h-screen  mx-12 2xl:mx-auto shadow-2xl">
            <header className="flex w-full items-center justify-between shadow-2xl bg-amber-300">
              <div
                id="userProfileUsernameMenu"
                onClick={onClickMenu}
                className="w-full py-5 bg-indigo-500 text-amber-300  cursor-pointer overflow-hidden"
              >
                <h2 className="text-xs md:text-xl text-center font-semibold uppercase">
                  {data.me.user.username}
                </h2>
              </div>
              <div
                id="userProfileBuyingHistoryMenu"
                onClick={onClickMenu}
                className="w-full py-5 cursor-pointer "
              >
                <h2 className="text-xs md:text-xl text-center font-semibold">
                  구매 내역
                </h2>
              </div>
              <div
                id="userProfileSellingHistoryMenu"
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
            <main className="mt-3">
              <div className="flex">
                <div
                  className="py-20 bg-cover bg-center bg-amber-300"
                  style={{ backgroundImage: `url(${data.me.user.avatarImg})` }}
                ></div>
                <div>hello world</div>
              </div>
            </main>
          </div>
          <Menu />
        </>
      )}
    </div>
  );
};
