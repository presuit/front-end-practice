import { gql } from "@apollo/client";
import { useEffect, useState } from "react";
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
  const { loading: userLoading, data: userData } = useMe();
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
  console.log(msgType);
  return (
    <div
      className={`flex my-5 mx-5 ${
        msgType === MsgType.SEND ? "self-end" : "self-start"
      }`}
    >
      <img
        className="w-14 h-14 border-4 rounded-full mr-5"
        src={fromUser.avatarImg}
      />
      <div className="p-5 bg-gray-200 rounded-xl">{msgText}</div>
    </div>
  );
};
