import { gql, useQuery, useReactiveVar } from "@apollo/client";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { newMsgManager } from "../apollo";
import { Menu } from "../components/Menu";
import { MsgRoomStick } from "../components/MsgRoomStick";
import { useMe } from "../hooks/useMe";
import { allMsgRooms } from "../__generated__/allMsgRooms";

export const ALL_MSG_ROOMS_QUERY = gql`
  query allMsgRooms {
    allMsgRooms {
      ok
      error
      msgRooms {
        id
        product {
          id
          name
          bigImg
        }
        msgCounts
      }
    }
  }
`;

export const Messages = () => {
  const history = useHistory();
  const _newMsgManager = useReactiveVar(newMsgManager);
  const { loading: userLoading, data: userData } = useMe();
  const { data, refetch } = useQuery<allMsgRooms>(ALL_MSG_ROOMS_QUERY);

  const getNewMsgCount = (msgRoomId: number) => {
    const findOne = _newMsgManager.find((each) => each.id === msgRoomId);
    if (findOne) {
      return findOne.newMsg || 0;
    }
    return 0;
  };

  useEffect(() => {
    if (!userLoading && userData?.me.user?.isVerified === false) {
      history.push("/not-valid-user");
    }
  }, [userData]);

  useEffect(() => {
    refetch();
  }, []);

  console.log(_newMsgManager);

  return (
    <div>
      <div className="max-w-screen-2xl min-h-screen   2xl:mx-auto ">
        <main className="pb-32 pt-10  px-5 ">
          {data?.allMsgRooms.msgRooms &&
            data?.allMsgRooms.msgRooms.length !== 0 &&
            data.allMsgRooms.msgRooms.map((eachMsgRoom) => (
              <MsgRoomStick
                key={eachMsgRoom.id}
                msgRoomId={eachMsgRoom.id}
                productName={eachMsgRoom.product.name}
                productBigImg={eachMsgRoom.product.bigImg}
                msgCounts={getNewMsgCount(eachMsgRoom.id)}
              />
            ))}
        </main>
        <Menu />
      </div>
    </div>
  );
};
