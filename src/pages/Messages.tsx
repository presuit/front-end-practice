import { gql, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
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
  const { loading: userLoading, data: userData } = useMe();
  const { loading, data, error, refetch } = useQuery<allMsgRooms>(
    ALL_MSG_ROOMS_QUERY
  );

  useEffect(() => {
    if (!userLoading && userData?.me.user?.isVerified === false) {
      history.push("/not-valid-user");
    }
  }, [userData]);

  useEffect(() => {
    refetch();
  }, []);

  console.log(loading, data, error);
  return (
    <div>
      <div className="max-w-screen-2xl min-h-screen   2xl:mx-auto shadow-2xl">
        <main className="pb-32 pt-10  px-5 ">
          {data?.allMsgRooms.msgRooms &&
            data?.allMsgRooms.msgRooms.length !== 0 &&
            data.allMsgRooms.msgRooms.map((eachMsgRoom) => (
              <MsgRoomStick
                key={eachMsgRoom.id}
                msgRoomId={eachMsgRoom.id}
                productName={eachMsgRoom.product.name}
                productBigImg={eachMsgRoom.product.bigImg}
                msgCounts={eachMsgRoom.msgCounts}
              />
            ))}
        </main>
        <Menu />
      </div>
    </div>
  );
};
