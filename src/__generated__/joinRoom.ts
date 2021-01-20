/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { JoinRoomInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: joinRoom
// ====================================================

export interface joinRoom_joinRoom {
  __typename: "JoinRoomOutput";
  ok: boolean;
  error: string | null;
  soldout: boolean;
}

export interface joinRoom {
  joinRoom: joinRoom_joinRoom;
}

export interface joinRoomVariables {
  input: JoinRoomInput;
}
