/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: findProductById
// ====================================================

export interface findProductById_findProductById_product {
  __typename: "Product";
  name: string;
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
