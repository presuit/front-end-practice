import { gql } from "@apollo/client";

export const PRODUCTS_FRAGMENT = gql`
  fragment productsParts on Product {
    id
    name
    price
    bigImg
    savedAmount
    category {
      id
      name
      slug
    }
  }
`;
