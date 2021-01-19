import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Link, useParams } from "react-router-dom";
import { PRODUCTS_FRAGMENT } from "../fragment";
import {
  findProductById,
  findProductByIdVariables,
} from "../__generated__/findProductById";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { getNameSuppressed } from "../utils";

interface IParams {
  id: string;
}

const FIND_PRODUCT_BY_ID_QUERY = gql`
  query findProductById($productId: Float!) {
    findProductById(productId: $productId) {
      ok
      error
      product {
        ...productsParts
      }
    }
  }
  ${PRODUCTS_FRAGMENT}
`;

export const Product = () => {
  const { id } = useParams<IParams>();
  const { loading, data } = useQuery<findProductById, findProductByIdVariables>(
    FIND_PRODUCT_BY_ID_QUERY,
    {
      variables: {
        productId: +id,
      },
    }
  );
  if (loading) {
    return <LoadingSpinner />;
  }
  console.log(data);
  return (
    <div>
      <div className="max-w-screen-2xl min-h-screen mx-12 2xl:mx-auto shadow-2xl">
        <div className="py-16 md:py-32 bg-amber-400 relative opacity-90 z-0">
          <div className="py-16 w-full bg-amber-400 absolute left-0 bottom-0 transform translate-y-16 skew-y-3 z-0"></div>
        </div>
        <div className="flex items-center flex-col md:flex-row h-64 md:h-80  px-10  z-10  transform -translate-y-16 md:-translate-y-24 shadow-2xl">
          <div
            className="bg-cover bg-center h-full z-10  md:w-1/2 w-full "
            style={{
              backgroundImage: `url(${data?.findProductById.product?.bigImg})`,
            }}
          ></div>
          <div className="z-10 bg-amber-100   h-full w-full md:w-1/3">
            <h1 className="text-xl md:text-3xl">
              📦 {data?.findProductById.product?.name}
            </h1>
            <h1 className="text-xl md:text-3xl">
              💲 {data?.findProductById.product?.price}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};
