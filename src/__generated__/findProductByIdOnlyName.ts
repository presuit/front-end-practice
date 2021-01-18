/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: findProductByIdOnlyName
// ====================================================

export interface findProductByIdOnlyName_findProductById_product {
  __typename: "Product";
  name: string;
}

export interface findProductByIdOnlyName_findProductById {
  __typename: "FindProductByIdOutput";
  ok: boolean;
  error: string | null;
  product: findProductByIdOnlyName_findProductById_product | null;
}

export interface findProductByIdOnlyName {
  findProductById: findProductByIdOnlyName_findProductById;
}

export interface findProductByIdOnlyNameVariables {
  productId: number;
}
