import React, { useEffect, useRef } from "react";

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
      hoverPlate.current.style.left = "0px";
      hoverPlate.current.style.opacity = "1";
    }
  };
  const onMouseLeave = () => {
    if (hoverPlate.current && bgContainer.current) {
      hoverPlate.current.style.left = "-100%";
      hoverPlate.current.style.opacity = "0";
    }
  };
  useEffect(() => {
    if (bgContainer.current && hoverPlate.current) {
      bgContainer.current.onmouseenter = onMouseEnter;
      hoverPlate.current.onmouseenter = onMouseEnter;
      hoverPlate.current.onmouseleave = onMouseLeave;
      bgContainer.current.onmouseleave = onMouseLeave;
    }
  }, []);
  return (
    <div className="relative overflow-hidden">
      <div
        ref={bgContainer}
        className=" py-24 md:w-full md:h-full md:py-0 bg-center bg-cover shadow-lg rounded-lg  "
        style={{ backgroundImage: `url(${bigImg})` }}
      ></div>
      <div
        ref={hoverPlate}
        className="absolute top-0 -left-full  w-full h-full rounded-lg  cursor-pointer transition-all flex flex-col items-center justify-center bg-indigo-100 z-10 opacity-0 "
        style={{ transitionDuration: ".7s" }}
      >
        <h3 className="font-bold text-3xl text-gray-800">
          <span className="text-indigo-600">{savedAmount}만원</span>/{price}만원
        </h3>
        <h4 className="mt-5 font-semibold text-xl text-gray-800">{name}</h4>
      </div>
    </div>
  );
};
