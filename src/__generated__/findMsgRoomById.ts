/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FindMsgRoomByIdInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: findMsgRoomById
// ====================================================

export interface findMsgRoomById_findMsgRoomById_msgRoom_msgs {
  __typename: "Msg";
  id: number;
  msgText: string;
  fromId: number;
  toId: number;
  createdAt: any;
}

export interface findMsgRoomById_findMsgRoomById_msgRoom_participants {
  __typename: "User";
  id: number;
  username: string;
  email: string;
  avatarImg: string | null;
}

export interface findMsgRoomById_findMsgRoomById_msgRoom_product {
  __typename: "Product";
  id: number;
  name: string;
  price: number;
  bigImg: string | null;
}

export interface findMsgRoomById_findMsgRoomById_msgRoom {
  __typename: "MsgRoom";
  id: number;
  msgs: findMsgRoomById_findMsgRoomById_msgRoom_msgs[] | null;
  participants: findMsgRoomById_findMsgRoomById_msgRoom_participants[];
  product: findMsgRoomById_findMsgRoomById_msgRoom_product;
}

export interface findMsgRoomById_findMsgRoomById {
  __typename: "FindMsgRoomByIdOutput";
  ok: boolean;
  error: string | null;
  msgRoom: findMsgRoomById_findMsgRoomById_msgRoom | null;
}

export interface findMsgRoomById {
  findMsgRoomById: findMsgRoomById_findMsgRoomById;
}

export interface findMsgRoomByIdVariables {
  input: FindMsgRoomByIdInput;
}
