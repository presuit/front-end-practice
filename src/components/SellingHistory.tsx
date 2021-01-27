import { Link } from "react-router-dom";
import { getNameSuppressed } from "../utils";

interface IProps {
  id: number;
  name: string;
  bigImg: string | null;
}

export const SellingHistory: React.FC<IProps> = ({ id, bigImg, name }) => {
  return (
    <Link to={`/product/${id}`}>
      <div className="w-full h-full flex flex-col items-center justify-center  bg-indigo-800 shadow-xl border-8 border-indigo-900 ">
        <div className="overflow-hidden w-full">
          <div
            className="bg-cover bg-center py-32 w-full  transform hover:scale-125"
            style={{
              backgroundImage: `url(${bigImg})`,
              transitionDuration: "0.5s",
            }}
          ></div>
        </div>
        <div className="p-5 ">
          <span className="text-base md:text-xl text-amber-300 font-semibold">
            {name ? getNameSuppressed(name) : "이름 없음"}
          </span>
        </div>
      </div>
    </Link>
  );
};
