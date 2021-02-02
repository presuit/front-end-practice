import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { BackButton } from "../components/BackButton";
import { MsgBlock } from "../components/msgBlock";
import { useMe } from "../hooks/useMe";
import { createMsg, createMsgVariables } from "../__generated__/createMsg";
import {
  findMsgRoomById,
  findMsgRoomByIdVariables,
  findMsgRoomById_findMsgRoomById_msgRoom_msgs,
} from "../__generated__/findMsgRoomById";
import { receiveMsg, receiveMsgVariables } from "../__generated__/receiveMsg";
import { ALL_MSG_ROOMS_QUERY } from "./Messages";

const FIND_MSG_ROOM_BY_ID_QUERY = gql`
  query findMsgRoomById($input: FindMsgRoomByIdInput!) {
    findMsgRoomById(input: $input) {
      ok
      error
      msgRoom {
        id
        msgs {
          id
          msgText
          fromId
          toId
        }
        participants {
          id
          username
          email
          avatarImg
        }
        product {
          id
          name
          price
          bigImg
        }
      }
    }
  }
`;

const RECEIVE_MSG_SUBSCRIPTION = gql`
  subscription receiveMsg($msgRoomId: Float!) {
    receiveMsg(msgRoomId: $msgRoomId) {
      id
      msgText
      fromId
      toId
    }
  }
`;

const CREATE_MSG_MUTATION = gql`
  mutation createMsg($input: CreateMsgInput!) {
    createMsg(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  id: string;
}

interface IFormProps {
  msg: string;
}

export const MsgRoom = () => {
  const { id } = useParams<IParams>();
  const { data: userData } = useMe();

  const [currentMsg, setCurrentMsg] = useState<
    findMsgRoomById_findMsgRoomById_msgRoom_msgs[]
  >([]);

  const { register, getValues, handleSubmit, setValue } = useForm<IFormProps>();

  const { data: subscriptionData, error, loading } = useSubscription<
    receiveMsg,
    receiveMsgVariables
  >(RECEIVE_MSG_SUBSCRIPTION, {
    variables: { msgRoomId: +id },
  });

  const [createMsgMutation] = useMutation<createMsg, createMsgVariables>(
    CREATE_MSG_MUTATION
  );

  const { data: msgRoomData, refetch: refetchMsgRoom } = useQuery<
    findMsgRoomById,
    findMsgRoomByIdVariables
  >(FIND_MSG_ROOM_BY_ID_QUERY, {
    variables: { input: { id: +id } },
  });

  const getUserFromMsg = (id: number) => {
    if (msgRoomData?.findMsgRoomById.msgRoom?.participants) {
      const user = msgRoomData?.findMsgRoomById.msgRoom?.participants.filter(
        (eachUser) => eachUser.id === id
      )[0];
      return user;
    }
  };

  const onSubmit = async () => {
    const { msg } = getValues();
    if (userData?.me.user && msgRoomData?.findMsgRoomById.msgRoom) {
      const toUser = msgRoomData.findMsgRoomById.msgRoom.participants.filter(
        (eachUser) => eachUser.id !== userData.me.user?.id
      )[0];
      await createMsgMutation({
        variables: {
          input: {
            fromId: userData.me.user.id,
            toId: toUser.id,
            msgRoomId: +id,
            msgText: msg,
          },
        },
        refetchQueries: [
          {
            query: FIND_MSG_ROOM_BY_ID_QUERY,
            variables: { input: { id: +id } },
          },
          { query: ALL_MSG_ROOMS_QUERY },
        ],
      });
      setValue("msg", "");
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
      }, 100);
    }
  };

  useEffect(() => {
    if (
      msgRoomData?.findMsgRoomById.ok &&
      msgRoomData.findMsgRoomById.msgRoom?.msgs
    ) {
      setCurrentMsg([...msgRoomData.findMsgRoomById.msgRoom?.msgs]);
    }
  }, [msgRoomData]);

  useEffect(() => {
    if (subscriptionData?.receiveMsg) {
      setCurrentMsg((prev) => [...prev, subscriptionData.receiveMsg]);
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
      }, 100);
    }
  }, [subscriptionData]);

  useEffect(() => {
    refetchMsgRoom({ input: { id: +id } });
  }, []);

  console.log(subscriptionData, error, loading, currentMsg);

  return (
    <div className="max-w-screen-2xl min-h-screen 2xl:mx-auto shadow-2xl">
      <BackButton url={"/messages"} />
      <div className="w-full max-w-screen-lg min-h-screen bg-indigo-700 mx-auto flex flex-col items-start pb-32">
        {currentMsg &&
          currentMsg.length !== 0 &&
          currentMsg.map((eachMsg) => (
            <MsgBlock
              key={eachMsg.id}
              fromUser={getUserFromMsg(eachMsg.fromId)}
              toUser={getUserFromMsg(eachMsg.toId)}
              msgText={eachMsg.msgText}
            />
          ))}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="fixed bottom-0 left-0 right-0 mx-auto max-w-screen-lg grid grid-cols-10"
      >
        <input
          ref={register}
          className="py-5 px-3 w-full focus:outline-none md:col-start-1 md:col-span-9 col-start-1 col-span-8"
          type="text"
          name="msg"
          placeholder="메세지를 입력해주세요"
        />
        <button
          type="submit"
          className=" px-5 bg-amber-300 text-indigo-500 focus:outline-none col-start-9 col-span-2 md:col-start-10 md:col-span-1"
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </form>
    </div>
  );
};
