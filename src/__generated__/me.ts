/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: me
// ====================================================

export interface me_me_user_msgRooms {
  __typename: "MsgRoom";
  id: number;
}

export interface me_me_user {
  __typename: "User";
  id: number;
  isVerified: boolean;
  email: string;
  username: string;
  avatarImg: string | null;
  msgRooms: me_me_user_msgRooms[] | null;
}

export interface me_me {
  __typename: "MeOutput";
  ok: boolean;
  error: string | null;
  user: me_me_user | null;
}

export interface me {
  me: me_me;
}
