/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface AllProductsInput {
  page?: number | null;
}

export interface ConfirmVerificationCodeInput {
  code: string;
}

export interface CreateAccountInput {
  email: string;
  password: string;
  username: string;
}

export interface CreateProductInput {
  name: string;
  price: number;
  bigImg?: string | null;
  detailImgs?: string[] | null;
  categorySlug: string;
  description?: string | null;
}

export interface JoinRoomInput {
  userId: number;
  productId: number;
  price: number;
}

export interface LogInInput {
  email: string;
  password: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
