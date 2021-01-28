/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PointPercent } from "./globalTypes";

// ====================================================
// GraphQL query operation: editProductProductQuery
// ====================================================

export interface editProductProductQuery_findProductById_product_detailImgs {
  __typename: "DetailImg";
  source: string;
}

export interface editProductProductQuery_findProductById_product_category {
  __typename: "Category";
  id: number;
  name: string;
  slug: string;
}

export interface editProductProductQuery_findProductById_product_seller {
  __typename: "User";
  id: number;
  username: string;
}

export interface editProductProductQuery_findProductById_product {
  __typename: "Product";
  id: number;
  name: string;
  price: number;
  bigImg: string | null;
  detailImgs: editProductProductQuery_findProductById_product_detailImgs[] | null;
  savedAmount: number;
  description: string | null;
  pointPercent: PointPercent;
  soldout: boolean;
  category: editProductProductQuery_findProductById_product_category;
  seller: editProductProductQuery_findProductById_product_seller;
}

export interface editProductProductQuery_findProductById {
  __typename: "FindProductByIdOutput";
  ok: boolean;
  error: string | null;
  product: editProductProductQuery_findProductById_product | null;
}

export interface editProductProductQuery {
  findProductById: editProductProductQuery_findProductById;
}

export interface editProductProductQueryVariables {
  productId: number;
}
