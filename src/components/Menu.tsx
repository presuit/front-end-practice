import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUser,
  faArrowCircleRight,
  faArrowCircleLeft,
  faCommentDots,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import "../styles/animation.css";
import { currentHomePage } from "../apollo";
import { NewMsg } from "./newMsg";

interface IHomeMenuProps {
  totalPages?: number | null;
  totalProducts?: number | null;
  page?: number | null;
  setPage?: React.Dispatch<React.SetStateAction<number>> | null;
}

export const Menu: React.FC<IHomeMenuProps> = ({
  totalPages,
  totalProducts,
  page,
  setPage,
}) => {
  const [mode, setMode] = useState<string>("");
  const location = useLocation();
  const menuDiv = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const triggerMenu = () => {
    if (menuOpen) {
      //  close It!
      if (menuDiv.current) {
        menuDiv.current.id = "menuSmall";
        menuDiv.current.style.pointerEvents = "none";
        setTimeout(() => {
          if (menuDiv.current) {
            menuDiv.current.style.pointerEvents = "inherit";
          }
        }, 1000);
        setMenuOpen((prev) => !prev);
      }
    } else {
      //  Open it!
      if (menuDiv.current) {
        menuDiv.current.id = "menuBig";
        menuDiv.current.style.pointerEvents = "none";
        setTimeout(() => {
          if (menuDiv.current) {
            menuDiv.current.style.pointerEvents = "inherit";
          }
        }, 1000);
        setTimeout(() => {
          setMenuOpen((prev) => !prev);
        }, 500);
      }
    }
  };
  const onClickMovePage = (e: any) => {
    if (totalPages && totalProducts && page && setPage) {
      let target = e.target;
      if (e.target.tagName === "path") {
        target = e.target.parentNode;
      }
      const targetIconAhead = target.getAttribute("data-icon").split("-")[2];
      if (targetIconAhead === "right") {
        if (page < totalPages) {
          setPage((prev) => prev + 1);
          currentHomePage(page + 1);
        }
      }
      if (targetIconAhead === "left") {
        if (page > 1) {
          setPage((prev) => prev - 1);
          currentHomePage(page - 1);
        }
      }
    }
  };
  useEffect(() => {
    const path = location.pathname;
    if (path === "/") {
      setMode("home");
    }
    if (path === "/me") {
      setMode("me");
    }
    if (path === "/messages") {
      setMode("messages");
    }
    triggerMenu();
  }, [location]);
  return (
    <div className=" flex justify-center items-center max-w-screen-md  mx-10 md:mx-auto fixed bottom-0 left-0 right-0  ">
      <div
        ref={menuDiv}
        className="md:px-12 px-10 py-5 my-5   flex items-center justify-around  shadow-2xl bg-amber-300  rounded-full  "
      >
        {mode === "home" && (
          <>
            {menuOpen && (
              <Link to="/messages">
                <NewMsg
                  style={
                    "text-3xl text-gray-100 cursor-pointer md:text-4xl slowToShow"
                  }
                />
              </Link>
            )}
            {menuOpen && (
              <FontAwesomeIcon
                onClick={onClickMovePage}
                icon={faArrowCircleLeft}
                className="text-3xl text-indigo-400 cursor-pointer md:text-4xl slowToShow"
              />
            )}
            {!menuOpen && (
              <FontAwesomeIcon
                onClick={triggerMenu}
                icon={faHome}
                className="text-3xl text-gray-100 cursor-pointer md:text-4xl slowToShow"
              />
            )}
            {menuOpen && (
              <h1
                onClick={triggerMenu}
                className="text-3xl text-indigo-400 cursor-pointer md:text-4xl slowToShow  "
              >
                {page}
              </h1>
            )}
            {menuOpen && (
              <FontAwesomeIcon
                onClick={onClickMovePage}
                icon={faArrowCircleRight}
                className="text-3xl text-indigo-400 cursor-pointer md:text-4xl slowToShow"
              />
            )}
            {menuOpen && (
              <Link to={`/me`}>
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-3xl text-gray-100 cursor-pointer md:text-4xl slowToShow"
                />
              </Link>
            )}
          </>
        )}
        {mode === "me" && (
          <>
            {menuOpen && (
              <Link to="/messages">
                <NewMsg
                  style={
                    "text-3xl text-gray-100 cursor-pointer md:text-4xl slowToShow"
                  }
                />
              </Link>
            )}
            {menuOpen && (
              <FontAwesomeIcon
                icon={faUser}
                onClick={triggerMenu}
                className="text-3xl text-indigo-400 cursor-pointer md:text-4xl slowToShow"
              />
            )}
            {!menuOpen && (
              <FontAwesomeIcon
                icon={faUser}
                onClick={triggerMenu}
                className="text-3xl text-gray-100 cursor-pointer md:text-4xl slowToShow"
              />
            )}
            {menuOpen && (
              <Link to="/">
                <FontAwesomeIcon
                  icon={faHome}
                  className="text-3xl text-gray-100 cursor-pointer md:text-4xl slowToShow"
                />
              </Link>
            )}
          </>
        )}
        {mode === "messages" && (
          <>
            {menuOpen && (
              <Link to="/">
                <FontAwesomeIcon
                  icon={faHome}
                  className="text-3xl text-gray-100 cursor-pointer md:text-4xl slowToShow"
                />
              </Link>
            )}
            {menuOpen && (
              <NewMsg
                onClick={triggerMenu}
                style={
                  "text-3xl text-indigo-400 cursor-pointer md:text-4xl slowToShow"
                }
              />
            )}
            {!menuOpen && (
              <NewMsg
                onClick={triggerMenu}
                style={
                  "text-3xl text-gray-100 cursor-pointer md:text-4xl slowToShow"
                }
              />
            )}
            {menuOpen && (
              <Link to="/me">
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-3xl text-indigo-100 cursor-pointer md:text-4xl slowToShow"
                />
              </Link>
            )}
          </>
        )}
      </div>
      {mode === "home" && (
        <div className="fixed bottom-0 right-0">
          <Link to="/product/new">
            <FontAwesomeIcon
              icon={faPlusCircle}
              className="mr-2 md:mr-5 mb-7 2xl:mr-10 text-3xl md:text-5xl text-indigo-800 transform hover:scale-125 transition-transform"
            />
          </Link>
        </div>
      )}
    </div>
  );
};
