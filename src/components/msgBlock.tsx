import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMe } from "../hooks/useMe";
interface IProps {
  fromUser: any;
  toUser: any;
  msgText: string;
}

enum MsgType {
  RECEIVE = "RECEIVE",
  SEND = "SEND",
}

export const MsgBlock: React.FC<IProps> = ({ fromUser, msgText, toUser }) => {
  const { data: userData } = useMe();
  const [msgType, setMsgType] = useState<MsgType | null>(null);
  useEffect(() => {
    if (userData?.me.user) {
      if (userData.me.user.id === fromUser.id) {
        setMsgType(MsgType.SEND);
      }
      if (userData.me.user.id === toUser.id) {
        setMsgType(MsgType.RECEIVE);
      }
    }
  }, [userData]);
  return (
    <div
      className={`flex my-5 mx-5 ${
        msgType === MsgType.SEND ? "self-end" : "self-start"
      }`}
    >
      {msgType === MsgType.RECEIVE && (
        <Link to={`/users/${fromUser.id}`}>
          <img
            style={{ minWidth: "3.5rem" }}
            className="w-14 h-14 border-4 rounded-full mr-5 border-gray-200"
            src={fromUser.avatarImg}
          />
        </Link>
      )}
      <div
        className={`p-5  rounded-xl max-w-xs ${
          msgType === MsgType.SEND ? "bg-amber-300 " : "bg-gray-200"
        }`}
      >
        {msgText}
      </div>
    </div>
  );
};
