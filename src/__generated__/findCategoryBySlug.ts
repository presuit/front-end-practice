/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FindCategoryBySlugInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: findCategoryBySlug
// ====================================================

export interface findCategoryBySlug_findCategoryBySlug_category_products {
  __typename: "Product";
  id: number;
  name: string;
  price: number;
  bigImg: string | null;
  savedAmount: number;
}

export interface findCategoryBySlug_findCategoryBySlug_category {
  __typename: "Category";
  id: number;
  slug: string;
  name: string;
  products: findCategoryBySlug_findCategoryBySlug_category_products[] | null;
}

export interface findCategoryBySlug_findCategoryBySlug {
  __typename: "FindCategoryBySlugOutput";
  ok: boolean;
  error: string | null;
  category: findCategoryBySlug_findCategoryBySlug_category | null;
}

export interface findCategoryBySlug {
  findCategoryBySlug: findCategoryBySlug_findCategoryBySlug;
}

export interface findCategoryBySlugVariables {
  input: FindCategoryBySlugInput;
}
