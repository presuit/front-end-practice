/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: findProductById
// ====================================================

export interface findProductById_findProductById_product_category {
  __typename: "Category";
  id: number;
  name: string;
  slug: string;
}

export interface findProductById_findProductById_product_room {
  __typename: "Room";
  participantCounts: number;
}

export interface findProductById_findProductById_product {
  __typename: "Product";
  id: number;
  name: string;
  price: number;
  bigImg: string | null;
  savedAmount: number;
  description: string | null;
  category: findProductById_findProductById_product_category;
  room: findProductById_findProductById_product_room | null;
}

export interface findProductById_findProductById {
  __typename: "FindProductByIdOutput";
  ok: boolean;
  error: string | null;
  product: findProductById_findProductById_product | null;
}

export interface findProductById {
  findProductById: findProductById_findProductById;
}

export interface findProductByIdVariables {
  productId: number;
}
