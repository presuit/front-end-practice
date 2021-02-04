import { useReactiveVar } from "@apollo/client";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { newMsgManager } from "../apollo";

interface IProps {
  onClick?: any;
  style?: string;
}

export const NewMsg: React.FC<IProps> = ({ onClick, style }) => {
  const _newMsgManager = useReactiveVar(newMsgManager);
  const getAllNewMsg = () => {
    let result = 0;
    if (_newMsgManager) {
      for (const item of _newMsgManager) {
        if (item.newMsg) {
          result += item.newMsg;
        }
      }
    }
    return result;
  };
  return (
    <div onClick={onClick} className="relative">
      <FontAwesomeIcon icon={faCommentDots} className={style} />
      {_newMsgManager &&
        _newMsgManager.length !== 0 &&
        getAllNewMsg() !== 0 && (
          <span className="absolute -top-2 -right-6 text-xs font-semibold bg-indigo-500 text-amber-300  w-7 h-7 flex justify-center items-center rounded-full ">
            {getAllNewMsg()}
          </span>
        )}
    </div>
  );
};
