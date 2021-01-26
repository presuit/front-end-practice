/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PointPercent } from "./globalTypes";

// ====================================================
// GraphQL fragment: productsParts
// ====================================================

export interface productsParts_detailImgs {
  __typename: "DetailImg";
  source: string;
}

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
  detailImgs: productsParts_detailImgs[] | null;
  savedAmount: number;
  description: string | null;
  pointPercent: PointPercent;
  soldout: boolean;
  category: productsParts_category;
}
