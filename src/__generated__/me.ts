/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: me
// ====================================================

export interface me_me_user_sellingProducts {
  __typename: "Product";
  id: number;
}

export interface me_me_user {
  __typename: "User";
  id: number;
  isVerified: boolean;
  email: string;
  username: string;
  avatarImg: string | null;
  sellingProducts: me_me_user_sellingProducts[] | null;
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
