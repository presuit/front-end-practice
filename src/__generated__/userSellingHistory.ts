/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FindUserByIdInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: userSellingHistory
// ====================================================

export interface userSellingHistory_findUserById_user_sellingProducts {
  __typename: "Product";
  id: number;
  name: string;
  bigImg: string | null;
}

export interface userSellingHistory_findUserById_user {
  __typename: "User";
  id: number;
  sellingProducts: userSellingHistory_findUserById_user_sellingProducts[] | null;
}

export interface userSellingHistory_findUserById {
  __typename: "FindUserByIdOutput";
  ok: boolean;
  error: string | null;
  user: userSellingHistory_findUserById_user | null;
}

export interface userSellingHistory {
  findUserById: userSellingHistory_findUserById;
}

export interface userSellingHistoryVariables {
  input: FindUserByIdInput;
}
