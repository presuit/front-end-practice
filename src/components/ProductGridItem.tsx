import React from "react";
import { getNameSuppressed, numberWithCommas } from "../utils";

interface IProps {
  name: string;
  price: number;
  bigImg: string | null;
  savedAmount: number;
}

export const ProductGridItem: React.FC<IProps> = ({ bigImg, name, price }) => {
  return (
    <div className="w-full h-full  shadow ">
      <div className=" md:w-full md:h-2/3  rounded-t-lg border-8 border-indigo-900 border-b-0 overflow-hidden">
        <div
          className=" bg-center bg-cover md:w-full md:h-full py-32 md:py-0 transform hover:scale-125 transition-transform"
          style={{
            backgroundImage: `url(${bigImg})`,
            transitionDuration: "0.5s",
          }}
        ></div>
      </div>
      <div className="grid grid-cols-2 md:h-1/3 py-10  md:py-0 rounded-b-lg w-full bg-indigo-800 border-8 border-t-0 border-indigo-900">
        <h1 className="text-amber-300 font-semibold  flex justify-center items-center text-xl md:text-base lg:text-lg xl:text-xl 2xl:text-2xl px-3">
          {getNameSuppressed(name)}
        </h1>
        <h1 className="flex justify-center items-center text-amber-300 font-semibold text-xl md:text-base lg:text-lg xl:text-xl 2xl:text-2xl px-3">
          {numberWithCommas(price)}원
        </h1>
      </div>
    </div>
  );
};
