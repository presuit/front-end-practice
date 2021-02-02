/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: receiveMsg
// ====================================================

export interface receiveMsg_receiveMsg {
  __typename: "Msg";
  id: number;
  msgText: string;
  fromId: number;
  toId: number;
}

export interface receiveMsg {
  receiveMsg: receiveMsg_receiveMsg;
}

export interface receiveMsgVariables {
  msgRoomId: number;
}
