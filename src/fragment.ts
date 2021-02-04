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

export const MSG_ROOM_FRAGMENT = gql`
  fragment msgRoomParts on MsgRoom {
    id
    msgs {
      id
      msgText
      fromId
      toId
      createdAt
    }
    participants {
      id
      username
      email
      avatarImg
    }
    product {
      id
      name
      price
      bigImg
    }
  }
`;
