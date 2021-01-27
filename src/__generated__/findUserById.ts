/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FindUserByIdInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: findUserById
// ====================================================

export interface findUserById_findUserById_user_sellingProducts {
  __typename: "Product";
  id: number;
  name: string;
  bigImg: string | null;
}

export interface findUserById_findUserById_user {
  __typename: "User";
  id: number;
  email: string;
  isVerified: boolean;
  username: string;
  avatarImg: string | null;
  sellingProducts: findUserById_findUserById_user_sellingProducts[] | null;
}

export interface findUserById_findUserById {
  __typename: "FindUserByIdOutput";
  ok: boolean;
  error: string | null;
  user: findUserById_findUserById_user | null;
}

export interface findUserById {
  findUserById: findUserById_findUserById;
}

export interface findUserByIdVariables {
  input: FindUserByIdInput;
}
