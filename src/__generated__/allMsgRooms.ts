/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: allMsgRooms
// ====================================================

export interface allMsgRooms_allMsgRooms_msgRooms_product {
  __typename: "Product";
  id: number;
  name: string;
  bigImg: string | null;
}

export interface allMsgRooms_allMsgRooms_msgRooms {
  __typename: "MsgRoom";
  id: number;
  product: allMsgRooms_allMsgRooms_msgRooms_product;
  msgCounts: number;
}

export interface allMsgRooms_allMsgRooms {
  __typename: "AllMsgRoomsOutput";
  ok: boolean;
  error: string | null;
  msgRooms: allMsgRooms_allMsgRooms_msgRooms[] | null;
}

export interface allMsgRooms {
  allMsgRooms: allMsgRooms_allMsgRooms;
}
