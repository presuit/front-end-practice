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
      <div className=" min-h-screen max-w-screen-2xl shadow-2xl mx-12 2xl:mx-auto">
        <div className="grid grid-cols-2 items-center pt-10">
          <div
            className="p-32 md:p-52 bg-cover bg-center"
            style={{
              backgroundImage: `url(${data?.findProductById.product?.bigImg})`,
            }}
          ></div>
          <div className="border-2 border-amber-300">
            <h1 className="mx-5 my-3 text-3xl font-semibold p-5  text-amber-400">
              {data?.findProductById.product?.name}
            </h1>
            <h1 className="mx-5 my-3 text-3xl font-semibold p-5  text-amber-400">
              {data?.findProductById.product?.price}
            </h1>
            <h1 className="mx-5 my-3 text-3xl font-semibold p-5  text-amber-400">
              {data?.findProductById.product?.savedAmount}
            </h1>
            <h1 className="mx-5 my-3 text-3xl font-semibold p-5  text-amber-400">
              {data?.findProductById.product?.category.slug}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};
