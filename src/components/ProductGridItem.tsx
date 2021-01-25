import React, { useEffect, useRef } from "react";
import { getNameSuppressed, numberWithCommas } from "../utils";

interface IProps {
  name: string;
  price: number;
  bigImg: string | null;
  savedAmount: number;
}

export const ProductGridItem: React.FC<IProps> = ({ bigImg, name, price }) => {
  return (
    <div className="w-full h-full  shadow-xl ">
      <div
        className=" py-24 md:w-full md:h-2/3  md:py-0 bg-center bg-cover  rounded-t-lg border-4 border-indigo-900 border-b-0  "
        style={{ backgroundImage: `url(${bigImg})` }}
      ></div>
      <div className="grid grid-cols-2 md:h-1/3 py-10  md:py-0 rounded-b-lg w-full bg-indigo-800 border-4 border-t-0 border-indigo-900">
        <h1 className="text-amber-300 font-semibold  flex justify-center items-center text-xl md:text-base lg:text-xl xl:text-2xl px-3">
          {getNameSuppressed(name)}
        </h1>
        <h1 className="flex justify-center items-center text-amber-300 font-semibold text-xl md:text-base lg:text-xl xl:text-2xl px-3">
          {numberWithCommas(price)}원
        </h1>
      </div>
    </div>
  );
};
