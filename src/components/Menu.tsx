import React, { useRef, useState } from "react";
import { useMe } from "../hooks/useMe";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThLarge, faUser, faAdjust } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "../styles/animation.css";

export const Menu: React.FC = () => {
  const { data, loading } = useMe();
  const menuDiv = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const triggerMenu = () => {
    if (menuOpen) {
      //  close It!
      if (menuDiv.current) {
        menuDiv.current.id = "menuSmall";
      }
    } else {
      //  Open it!
      if (menuDiv.current) {
        menuDiv.current.id = "menuBig";
      }
    }
    return setMenuOpen((prev) => !prev);
  };
  return (
    <div className=" flex justify-center items-center max-w-screen-md  mx-16 md:mx-auto  ">
      <div
        ref={menuDiv}
        className="px-12 py-5 mb-10  flex items-center justify-around  shadow-2xl bg-amber-300  rounded-full  "
      >
        {menuOpen && (
          <Link to="/">
            <FontAwesomeIcon
              icon={faAdjust}
              className="text-3xl text-gray-100 cursor-pointer md:text-5xl"
            />
          </Link>
        )}
        <Link to="/">
          <FontAwesomeIcon
            onClick={triggerMenu}
            icon={faThLarge}
            className="text-3xl text-gray-100 cursor-pointer md:text-5xl"
          />
        </Link>
        {menuOpen && (
          <Link to="/">
            <FontAwesomeIcon
              icon={faUser}
              className="text-3xl text-gray-100 cursor-pointer md:text-5xl"
            />
          </Link>
        )}
      </div>
    </div>
  );
};
