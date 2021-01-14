import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { ProductGridItem } from "../components/ProductGridItem";
import { useMe } from "../hooks/useMe";
import {
  allProducts,
  allProductsVariables,
} from "../__generated__/allProducts";
import { ConfirmVerificationCodeInput } from "../__generated__/globalTypes";
import { PRODUCTS_FRAGMENT } from "../fragment";
import { Menu } from "../components/Menu";

const ALL_PRODUCTS_QUERY = gql`
  query allProducts($input: AllProductsInput!) {
    allProducts(input: $input) {
      ok
      error
      totalResults
      totalPages
      products {
        ...productsParts
      }
    }
  }

  ${PRODUCTS_FRAGMENT}
`;

export const Home = () => {
  const history = useHistory();
  const [page, setPage] = useState(1);
  const { data: userData, loading: userLoading } = useMe();
  const {
    register,
    getValues,
    handleSubmit,
    errors,
  } = useForm<ConfirmVerificationCodeInput>({ mode: "onChange" });
  const { data: productsData, loading: productsLoading } = useQuery<
    allProducts,
    allProductsVariables
  >(ALL_PRODUCTS_QUERY, {
    variables: {
      input: {
        page,
      },
    },
  });
  const onClickValidation = () => {
    const { code } = getValues();
    history.push(`/validate-code?code=${code}`);
  };
  console.log(
    productsData?.allProducts.totalPages,
    productsData?.allProducts.totalResults
  );
  return (
    <div>
      {!userLoading && userData?.me.user?.isVerified === false && (
        <div className="h-screen flex justify-center items-center bg-indigo-500">
          <div className="max-w-screen-sm w-full mx-10 bg-white shadow-xl rounded-md py-12 px-10 sm:mx-0">
            <h1 className="text-center font-semibold text-2xl">
              받으신 코드를 입력하고, 서비스를 계속 이용해주세요.
            </h1>
            <form
              onSubmit={handleSubmit(onClickValidation)}
              className="w-full mt-5 flex flex-col items-end"
            >
              <input
                ref={register({
                  required: "코드를 입력해 주세요",
                })}
                className="w-full py-5 px-3 border focus:outline-none focus:border-indigo-600 transition-colors"
                type="text"
                name="code"
                placeholder="코드"
                required
              />
              {errors.code?.message && (
                <h2 className="text-red-500 font-medium text-md my-3">
                  {errors.code?.message}
                </h2>
              )}
              <button className="mt-3 border px-5 py-2  font-medium text-md hover:bg-green-600 hover:text-white transition-colors ">
                확인
              </button>
            </form>
          </div>
        </div>
      )}
      {!userLoading && userData?.me.user?.isVerified === true && (
        <div>
          <div className="max-w-screen-2xl md:h-screen  mx-16 2xl:mx-auto pt-10 pb-32 grid  md:grid-cols-4 gap-10">
            {!productsLoading &&
              productsData?.allProducts.products?.map((product) => (
                <ProductGridItem
                  key={product.id}
                  name={product.name}
                  price={product.price}
                  bigImg={product.bigImg}
                  savedAmount={product.savedAmount}
                />
              ))}
          </div>
          <Menu
            totalPages={productsData?.allProducts.totalPages}
            totalProducts={productsData?.allProducts.totalResults}
            page={page}
            setPage={setPage}
          />
        </div>
      )}
    </div>
  );
};
