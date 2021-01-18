/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AllProductsInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: allProducts
// ====================================================

export interface allProducts_allProducts_products_category {
  __typename: "Category";
  id: number;
  name: string;
  slug: string;
}

export interface allProducts_allProducts_products {
  __typename: "Product";
  id: number;
  name: string;
  price: number;
  bigImg: string | null;
  savedAmount: number;
  description: string | null;
  category: allProducts_allProducts_products_category;
}

export interface allProducts_allProducts {
  __typename: "AllProductsOuput";
  ok: boolean;
  error: string | null;
  totalResults: number | null;
  totalPages: number | null;
  products: allProducts_allProducts_products[] | null;
}

export interface allProducts {
  allProducts: allProducts_allProducts;
}

export interface allProductsVariables {
  input: AllProductsInput;
}
