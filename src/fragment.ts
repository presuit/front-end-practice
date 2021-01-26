import { gql } from "@apollo/client";

export const PRODUCTS_FRAGMENT = gql`
  fragment productsParts on Product {
    id
    name
    price
    bigImg
    detailImgs {
      source
    }
    savedAmount
    description
    pointPercent
    soldout
    category {
      id
      name
      slug
    }
  }
`;
