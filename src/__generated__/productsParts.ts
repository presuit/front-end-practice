/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: productsParts
// ====================================================

export interface productsParts_category {
  __typename: "Category";
  id: number;
  name: string;
  slug: string;
}

export interface productsParts {
  __typename: "Product";
  id: number;
  name: string;
  price: number;
  bigImg: string | null;
  savedAmount: number;
  description: string | null;
  category: productsParts_category;
}
