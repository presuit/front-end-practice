/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateMsgInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createMsg
// ====================================================

export interface createMsg_createMsg {
  __typename: "CreateMsgOutput";
  ok: boolean;
  error: string | null;
}

export interface createMsg {
  createMsg: createMsg_createMsg;
}

export interface createMsgVariables {
  input: CreateMsgInput;
}
