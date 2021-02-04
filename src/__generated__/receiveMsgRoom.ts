/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: receiveMsgRoom
// ====================================================

export interface receiveMsgRoom_receiveMsgRoom_msgs {
  __typename: "Msg";
  id: number;
  msgText: string;
  fromId: number;
  toId: number;
  createdAt: any;
}

export interface receiveMsgRoom_receiveMsgRoom_participants {
  __typename: "User";
  id: number;
  username: string;
  email: string;
  avatarImg: string | null;
}

export interface receiveMsgRoom_receiveMsgRoom_product {
  __typename: "Product";
  id: number;
  name: string;
  price: number;
  bigImg: string | null;
}

export interface receiveMsgRoom_receiveMsgRoom {
  __typename: "MsgRoom";
  id: number;
  msgs: receiveMsgRoom_receiveMsgRoom_msgs[] | null;
  participants: receiveMsgRoom_receiveMsgRoom_participants[];
  product: receiveMsgRoom_receiveMsgRoom_product;
}

export interface receiveMsgRoom {
  receiveMsgRoom: receiveMsgRoom_receiveMsgRoom;
}

export interface receiveMsgRoomVariables {
  msgRoomId: number;
}
