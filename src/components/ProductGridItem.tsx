import React, { useEffect, useRef } from "react";
import { pickRandomBgColor } from "../utils";

interface IProps {
  name: string;
  price: number;
  bigImg: string | null;
  savedAmount: number;
}

export const ProductGridItem: React.FC<IProps> = ({
  bigImg,
  name,
  price,
  savedAmount,
}) => {
  const bgContainer = useRef<HTMLDivElement>(null);
  const hoverPlate = useRef<HTMLDivElement>(null);
  const onMouseEnter = () => {
    if (hoverPlate.current && bgContainer.current) {
      console.log("event in!");
      hoverPlate.current.style.left = "0px";
    }
  };
  const onMouseLeave = () => {
    if (hoverPlate.current && bgContainer.current) {
      console.log("event out!");
      hoverPlate.current.style.left = "-100%";
    }
  };
  useEffect(() => {
    if (bgContainer.current && hoverPlate.current) {
      bgContainer.current.onmouseover = onMouseEnter;
      hoverPlate.current.onmouseover = onMouseEnter;
      hoverPlate.current.onmouseout = onMouseLeave;
    }
  }, []);
  return (
    <div className="relative overflow-hidden ">
      <div
        ref={bgContainer}
        className=" py-24 bg-center bg-cover shadow-lg rounded-lg"
        style={{ backgroundImage: `url(${bigImg})` }}
      ></div>
      <div
        ref={hoverPlate}
        className="absolute top-0 -left-full  w-full h-full rounded-lg  cursor-pointer transition-all flex flex-col items-center justify-center bg-indigo-100 z-10"
      >
        <h3 className="font-bold text-3xl text-gray-800">
          <span className="text-indigo-600">{savedAmount}만원</span>/{price}만원
        </h3>
        <h4 className="mt-5 font-semibold text-xl text-gray-800">{name}</h4>
      </div>
    </div>
  );
};