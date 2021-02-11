import { gql, useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { faPaperPlane, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { newMsgManager } from "../apollo";
import { BackButton } from "../components/BackButton";
import { MsgBlock } from "../components/msgBlock";
import {
  BASE_BACKEND_HTTPS_URL,
  BASE_LOCAL_BACKEND_HTTP_URL,
} from "../constants";
import { MSG_ROOM_FRAGMENT } from "../fragment";
import { useMe } from "../hooks/useMe";
import { createMsg, createMsgVariables } from "../__generated__/createMsg";
import {
  findMsgRoomById,
  findMsgRoomByIdVariables,
} from "../__generated__/findMsgRoomById";
import { receiveMsgRoom } from "../__generated__/receiveMsgRoom";

const FIND_MSG_ROOM_BY_ID_QUERY = gql`
  query findMsgRoomById($input: FindMsgRoomByIdInput!) {
    findMsgRoomById(input: $input) {
      ok
      error
      msgRoom {
        ...msgRoomParts
      }
    }
  }
  ${MSG_ROOM_FRAGMENT}
`;

export const RECEIVE_MSG_ROOM_SUBSCRIPTION = gql`
  subscription receiveMsgRoom($msgRoomId: Float!) {
    receiveMsgRoom(msgRoomId: $msgRoomId) {
      ...msgRoomParts
    }
  }
  ${MSG_ROOM_FRAGMENT}
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
  const _newMsgManager = useReactiveVar(newMsgManager);

  const { register, getValues, handleSubmit, setValue } = useForm<IFormProps>();

  const [createMsgMutation, { loading: createMsgLoading }] = useMutation<
    createMsg,
    createMsgVariables
  >(CREATE_MSG_MUTATION);

  const {
    data: msgRoomData,
    refetch: refetchMsgRoom,
    subscribeToMore,
  } = useQuery<findMsgRoomById, findMsgRoomByIdVariables>(
    FIND_MSG_ROOM_BY_ID_QUERY,
    {
      variables: { input: { id: +id } },
    }
  );

  const getUserFromMsg = (id: number) => {
    if (msgRoomData?.findMsgRoomById.msgRoom?.participants) {
      const user = msgRoomData?.findMsgRoomById.msgRoom?.participants.filter(
        (eachUser) => eachUser.id === id
      )[0];
      return user;
    }
  };

  const onSubmit = async () => {
    if (!createMsgLoading) {
      const { msg } = getValues();
      if (msg === "") {
        return;
      }
      if (userData?.me?.user && msgRoomData?.findMsgRoomById?.msgRoom) {
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
        });
        setValue("msg", "");
        setTimeout(() => {
          window.scrollTo(0, document.body.scrollHeight);
        }, 100);
      }
    }
  };

  useEffect(() => {
    subscribeToMore({
      document: RECEIVE_MSG_ROOM_SUBSCRIPTION,
      variables: { msgRoomId: +id },
      updateQuery: (
        prev,
        {
          subscriptionData: { data },
        }: { subscriptionData: { data: receiveMsgRoom } }
      ) => {
        if (!data) {
          return prev;
        }
        return {
          findMsgRoomById: {
            ...prev.findMsgRoomById,
            msgRoom: { ...data.receiveMsgRoom },
          },
        };
      },
    });
    window.scrollTo(0, document.body.scrollHeight);

    if (
      window.location.href !== `${BASE_BACKEND_HTTPS_URL}/messages/${id}` ||
      `${BASE_LOCAL_BACKEND_HTTP_URL}/messages/${id}`
    ) {
      return;
    }
    // newMsgManager reactiveVar update
    const findOne = _newMsgManager.find((each) => each.id === +id);
    const prevMsg = msgRoomData?.findMsgRoomById?.msgRoom?.msgs
      ? msgRoomData.findMsgRoomById.msgRoom.msgs.length
      : 0;
    if (findOne) {
      const filtered = _newMsgManager.filter((each) => each.id !== +id);
      newMsgManager([...filtered, { id: +id, prevMsg, newMsg: 0 }]);
    } else {
      newMsgManager([..._newMsgManager, { id: +id, prevMsg, newMsg: 0 }]);
    }
  }, [msgRoomData]);

  useEffect(() => {
    (() => {
      return refetchMsgRoom({ input: { id: +id } });
    })();
  }, []);

  console.log(msgRoomData?.findMsgRoomById.msgRoom?.msgs);

  return (
    <div className="max-w-screen-2xl min-h-screen 2xl:mx-auto ">
      <BackButton url={"/messages"} />
      <div className="w-full max-w-screen-lg min-h-screen bg-indigo-700 mx-auto flex flex-col items-start pb-32">
        {msgRoomData?.findMsgRoomById?.msgRoom?.msgs?.map((eachMsg) => (
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
        {createMsgLoading ? (
          <button
            type="submit"
            className=" px-5 bg-amber-300 text-indigo-500 focus:outline-none col-start-9 col-span-2 md:col-start-10 md:col-span-1 pointer-events-none "
          >
            <FontAwesomeIcon className=" spinAround " icon={faSpinner} />
          </button>
        ) : (
          <button
            type="submit"
            className=" px-5 bg-amber-300 text-indigo-500 focus:outline-none col-start-9 col-span-2 md:col-start-10 md:col-span-1"
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        )}
      </form>
    </div>
  );
};
