import { useReactiveVar } from "@apollo/client";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IProps {
  onClick?: any;
  style?: string;
}

export const NewMsg: React.FC<IProps> = ({ onClick, style }) => {
  return (
    <div onClick={onClick} className="relative">
      <FontAwesomeIcon icon={faCommentDots} className={style} />
      <span className="absolute -top-2 -right-6 text-xs font-semibold bg-indigo-500 text-amber-300  w-7 h-7 flex justify-center items-center rounded-full ">
        0
      </span>
    </div>
  );
};
