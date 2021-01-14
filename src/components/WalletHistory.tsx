import { gql, useQuery } from "@apollo/client";
import React from "react";
import {
  findProductById,
  findProductByIdVariables,
} from "../__generated__/findProductById";
import { myWallet_myWallet_wallet_histories } from "../__generated__/myWallet";

const FIND_PRODUCT_BY_ID = gql`
  query findProductById($productId: Float!) {
    findProductById(productId: $productId) {
      ok
      error
      product {
        name
      }
    }
  }
`;

export const WalletHistory: React.FC<myWallet_myWallet_wallet_histories> = ({
  canIRefund,
  price,
  productId,
  purchaseDate,
}) => {
  const { loading, data } = useQuery<findProductById, findProductByIdVariables>(
    FIND_PRODUCT_BY_ID,
    {
      variables: {
        productId,
      },
    }
  );
  return (
    <div>
      <div className="grid grid-cols-3   border-t-2 border-l-2 border-r-2 border-gray-400">
        <h1 className="flex justify-center items-center w-full h-full text-xs md:text-base border-r-2 border-dotted border-gray-400 py-5">
          {data?.findProductById.product?.name}
        </h1>
        <h1 className="flex justify-center items-center w-full h-full text-xs md:text-base border-r-2 border-dotted border-gray-400 py-5">
          {price}
        </h1>
        <h1 className="flex justify-center items-center w-full h-full text-xs md:text-base py-5">
          {purchaseDate}
        </h1>
      </div>
    </div>
  );
};
