import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Link } from "react-router-dom";
import { getDate, getNameSuppressed } from "../utils";
import {
  findProductByIdOnlyName,
  findProductByIdOnlyNameVariables,
} from "../__generated__/findProductByIdOnlyName";
import { myWallet_myWallet_wallet_histories } from "../__generated__/myWallet";

const FIND_PRODUCT_BY_ID_ONLY_NAME = gql`
  query findProductByIdOnlyName($productId: Float!) {
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
  const { data } = useQuery<
    findProductByIdOnlyName,
    findProductByIdOnlyNameVariables
  >(FIND_PRODUCT_BY_ID_ONLY_NAME, {
    variables: {
      productId,
    },
  });

  return (
    <Link to={`/product/${productId}`}>
      <div className="w-full h-full  ">
        <div className="py-5 px-5 bg-white ">
          <h1 className="md:text-3xl text-xl font-medium">
            {data?.findProductById.product?.name
              ? getNameSuppressed(data?.findProductById.product?.name)
              : "이름 없음"}
          </h1>
          <h1 className="">{price}원</h1>
          <h1 className="">{getDate(purchaseDate)}</h1>
        </div>
        {/* 구매 내역 아래 찢은 종이 표현 하기 위해 만든 삼각형들 */}
        <div className="flex md:overflow-hidden w-full">
          {Array.from({ length: 20 }, () => "a").map((_, index) => (
            <div
              key={index}
              className="w-0 h-0"
              style={{
                borderTop: "1rem solid white",
                borderLeft: "1rem solid transparent",
                borderRight: "1rem solid transparent",
              }}
            ></div>
          ))}
        </div>
      </div>
    </Link>
  );
};
