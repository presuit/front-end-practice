import { gql, useQuery, useReactiveVar, useSubscription } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { newMsgManager } from "../apollo";
import { Menu } from "../components/Menu";
import { MsgRoomStick } from "../components/MsgRoomStick";
import { useMe } from "../hooks/useMe";
import { allMsgRooms } from "../__generated__/allMsgRooms";
import { receiveMsgCount } from "../__generated__/receiveMsgCount";

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

export const RECEIVE_MSG_COUNT = gql`
  subscription receiveMsgCount {
    receiveMsgCount {
      id
      msgCounts
      createdAt
    }
  }
`;

interface IStateProps {
  id: number;
  msgCounts: number;
}

export const Messages = () => {
  const history = useHistory();
  const _newMsgManager = useReactiveVar(newMsgManager);
  const [currentMsgCounts, setCurrentMsgCounts] = useState<IStateProps[]>([]);
  const { loading: userLoading, data: userData } = useMe();
  const { data, refetch } = useQuery<allMsgRooms>(ALL_MSG_ROOMS_QUERY);
  const {
    loading: msgCountLoading,
    data: msgCountData,
  } = useSubscription<receiveMsgCount>(RECEIVE_MSG_COUNT);

  useEffect(() => {
    if (!msgCountLoading && msgCountData?.receiveMsgCount) {
      setCurrentMsgCounts((prev) => {
        const existed = prev.filter(
          (eachPrev) => eachPrev.id !== msgCountData.receiveMsgCount.id
        );
        existed.push({ ...msgCountData.receiveMsgCount });
        return [...existed];
      });
    }
  }, [msgCountData]);

  useEffect(() => {
    if (!userLoading && userData?.me.user?.isVerified === false) {
      history.push("/not-valid-user");
    }
  }, [userData]);

  useEffect(() => {
    if (data?.allMsgRooms?.ok && data?.allMsgRooms?.msgRooms) {
      for (const item of data.allMsgRooms.msgRooms) {
        const data: IStateProps = { id: item.id, msgCounts: item.msgCounts };
        setCurrentMsgCounts((prev) => {
          const existed = prev.filter((eachPrev) => eachPrev.id !== data.id);
          existed.push({ ...data });
          return [...existed];
        });
      }
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, []);

  console.log(_newMsgManager, msgCountData?.receiveMsgCount);

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
                msgCounts={
                  currentMsgCounts.find((each) => each.id === eachMsgRoom.id)
                    ?.msgCounts || 0
                }
              />
            ))}
        </main>
        <Menu />
      </div>
    </div>
  );
};
