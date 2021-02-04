import { useReactiveVar } from "@apollo/client";
import { faCommentAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { newMsgManager } from "../apollo";
import { getNameSuppressed } from "../utils";

interface IProps {
  msgRoomId: number;
  msgCounts: number;
  productBigImg: string | null;
  productName: string;
}

export const MsgRoomStick: React.FC<IProps> = ({
  msgCounts,
  productName,
  productBigImg,
  msgRoomId,
}) => {
  const _newMsgManager = useReactiveVar(newMsgManager);

  const updateNewMsgAlert = () => {
    const findOne = _newMsgManager.find((each) => each.id === msgRoomId);
    if (findOne) {
      return findOne.newMsg !== 0;
    }
    return false;
  };

  return (
    <Link
      to={`/messages/${msgRoomId}`}
      style={{ minWidth: "7rem" }}
      className=" w-full max-w-screen-lg mx-auto bg-gray-700 mb-3 cursor-pointer rounded-lg flex items-center justify-between p-5 "
    >
      {productBigImg ? (
        <img
          className="  md:w-20 md:h-20 h-16 w-16  rounded-full border-4 border-indigo-300 "
          src={productBigImg}
        />
      ) : (
        <div className=" w-20 h-20 rounded-full border-4 border-indigo-300 flex items-center justify-center">
          <FontAwesomeIcon icon={faTimes} className="text-3xl text-amber-300" />
        </div>
      )}
      <h1 className="text-amber-300 font-semibold md:text-3xl text-lg">
        {getNameSuppressed(productName)}
      </h1>
      <h2
        className={`md:text-2xl text-indigo-300 font-semibold ${
          updateNewMsgAlert() ? "text-amber-300" : "text-indigo-300"
        }`}
      >
        <FontAwesomeIcon icon={faCommentAlt} />{" "}
        <span className="text-base">{msgCounts}</span>
      </h2>
    </Link>
  );
};
