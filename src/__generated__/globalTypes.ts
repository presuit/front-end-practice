/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum PointPercent {
  full = "full",
  half = "half",
  one = "one",
  ten = "ten",
  zeroDotOne = "zeroDotOne",
}

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

export interface CreateMsgInput {
  msgText: string;
  toId: number;
  fromId: number;
  msgRoomId: number;
}

export interface CreateProductInput {
  name: string;
  price: number;
  pointPercent: PointPercent;
  bigImg?: string | null;
  detailImgs?: string[] | null;
  categorySlug: string;
  description?: string | null;
}

export interface DeleteProductInput {
  productId: number;
}

export interface EditProductInput {
  name?: string | null;
  description?: string | null;
  bigImg?: string | null;
  productId: number;
  detailImgSrcs?: string[] | null;
  categorySlug?: string | null;
}

export interface EditProfileInput {
  password?: string | null;
  username?: string | null;
  avatarImg?: string | null;
  userId: number;
}

export interface FindCategoryBySlugInput {
  slug: string;
}

export interface FindMsgRoomByIdInput {
  id: number;
}

export interface FindUserByIdInput {
  userId: number;
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

export interface RequestNewVerificationInput {
  userId: number;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
