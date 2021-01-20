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
    <div className="">
      <div className="max-w-screen-2xl min-h-screen mx-12 2xl:mx-auto shadow-2xl bg-indigo-500">
        <div className="flex items-center flex-col md:flex-row  pt-10 mx-5  shadow-xl">
          <div
            className="bg-cover bg-center  py-32 md:py-48  w-full md:rounded-l-2xl md:rounded-t-none rounded-t-2xl"
            style={{
              backgroundImage: `url(${data?.findProductById.product?.bigImg})`,
            }}
          ></div>
          <div className="md:h-96 h-48  w-full bg-amber-300 text-indigo-600 grid grid-cols-2 md:rounded-r-2xl md:rounded-b-none rounded-b-2xl ">
            <h1 className="text-xl font-semibold md:text-3xl  flex flex-col justify-center items-center border-r border-b border-indigo-300 p-3 ">
              <span>📦</span>
              {data?.findProductById.product?.name && (
                <span>
                  {getNameSuppressed(data?.findProductById.product?.name)}
                </span>
              )}
            </h1>
            <h1 className="text-xl font-semibold md:text-3xl  flex flex-col justify-center items-center border-b border-indigo-300 p-3">
              <span>💲</span>
              <span>{data?.findProductById.product?.price}원</span>
            </h1>
            <h1 className="text-xl font-semibold md:text-3xl  flex flex-col justify-center items-center border-r border-indigo-300 p-3">
              <span>🛒</span>
              <Link to={`/category/slug`} className="hover:underline">
                {data?.findProductById.product?.category.slug}
              </Link>
            </h1>
            <h1 className="text-xl font-semibold md:text-3xl  flex flex-col justify-center items-center p-3">
              <span>👨‍👧‍👧</span>
              <span>15,400</span>
            </h1>
          </div>
        </div>
        {/*  */}
        <div className="mt-10 mx-5 grid grid-cols-2">
          <button className="py-5 px-3 bg-amber-500 text-center font-semibold text-xl text-gray-200 rounded-l-2xl focus:ring-4 ring-amber-600 focus:outline-none">
            현재까지 {data?.findProductById.product?.savedAmount}원
          </button>
          <button className="py-5 px-3 bg-teal-500 rounded-r-2xl focus:outline-none font-semibold text-xl text-gray-200 hover:text-amber-300 transition-colors focus:ring-4 ring-teal-600 ">
            참가하기
          </button>
        </div>
        <div className="mt-10 mx-5 pb-10">
          <h1 className="bg-gray-200 py-16 px-5 rounded-2xl shadow-2xl md:text-xl">
            {data?.findProductById.product?.description}
          </h1>
        </div>
      </div>
    </div>
  );
};
