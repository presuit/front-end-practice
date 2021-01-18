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
    <div className="relative">
      <Link to="/">
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="absolute text-2xl text-gray-700 mx-3 my-5 hover:text-amber-400 transition-colors md:text-5xl"
        />
      </Link>
      <div className="min-h-screen  shadow-2xl ">
        <div
          className="py-32 2xl:py-52 bg-cover bg-center"
          style={{
            backgroundImage: `url(${data?.findProductById.product?.bigImg})`,
          }}
        ></div>
        <div className="flex justify-between items-center px-5 py-10  bg-amber-300 ">
          {data?.findProductById.product && (
            <>
              <div>
                <h1 className="text-lg md:text-3xl pb-5  text-indigo-600 font-semibold">
                  📦: {getNameSuppressed(data?.findProductById.product?.name)}
                </h1>
                <h2 className="text-lg md:text-3xl pb-5 text-indigo-600 font-semibold">
                  💲: {data?.findProductById.product?.savedAmount}/
                  {data?.findProductById.product?.price}원
                </h2>

                <h2 className="text-lg md:text-3xl text-indigo-600 font-semibold hover:underline">
                  <Link
                    to={`/category/${data?.findProductById.product?.category.slug}`}
                  >
                    🛒: {data?.findProductById.product?.category.slug}
                  </Link>
                </h2>
              </div>
              <div className="flex items-center">
                <div className="mr-5 text-lg md:text-3xl text-coolGray-600 border-4  px-3 py-5 rounded-full border-indigo-600 focus:outline-none">
                  <h1 className="text-center">👩👨🧑👧</h1>
                  <h1 className="text-center text-black">15,438</h1>
                </div>
                <button className="text-lg md:text-3xl font-semibold text-coolGray-600 border-4  px-3 py-5 rounded-full border-indigo-600 focus:outline-none hover:bg-indigo-600 hover:text-amber-400  transition-all">
                  참여하기
                </button>
              </div>
            </>
          )}
        </div>
        {data?.findProductById.product?.description && (
          <div className="bg-indigo-600 py-20">
            {data.findProductById.product.description}
          </div>
        )}
      </div>
    </div>
  );
};
