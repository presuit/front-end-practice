/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: msgRoomParts
// ====================================================

export interface msgRoomParts_msgs {
  __typename: "Msg";
  id: number;
  msgText: string;
  fromId: number;
  toId: number;
  createdAt: any;
}

export interface msgRoomParts_participants {
  __typename: "User";
  id: number;
  username: string;
  email: string;
  avatarImg: string | null;
}

export interface msgRoomParts_product {
  __typename: "Product";
  id: number;
  name: string;
  price: number;
  bigImg: string | null;
}

export interface msgRoomParts {
  __typename: "MsgRoom";
  id: number;
  msgs: msgRoomParts_msgs[] | null;
  participants: msgRoomParts_participants[];
  product: msgRoomParts_product;
}
