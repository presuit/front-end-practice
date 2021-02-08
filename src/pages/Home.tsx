import { gql, useQuery, useReactiveVar } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { ProductGridItem } from "../components/ProductGridItem";
import { useMe } from "../hooks/useMe";
import {
  allProducts,
  allProductsVariables,
} from "../__generated__/allProducts";
import { Menu } from "../components/Menu";
import { currentHomePage } from "../apollo";

const ALL_PRODUCTS_QUERY = gql`
  query allProducts($input: AllProductsInput!) {
    allProducts(input: $input) {
      ok
      error
      totalResults
      totalPages
      products {
        id
        name
        price
        bigImg
        savedAmount
      }
    }
  }
`;

export const Home = () => {
  const history = useHistory();
  const currentPage = useReactiveVar(currentHomePage);
  const [page, setPage] = useState(currentPage);
  const { data: userData, loading: userLoading } = useMe();
  const {
    data: productsData,
    loading: productsLoading,
    refetch,
    error,
  } = useQuery<allProducts, allProductsVariables>(ALL_PRODUCTS_QUERY, {
    variables: {
      input: {
        page,
      },
    },
  });
  useEffect(() => {
    refetch({ input: { page } });
  }, []);
  if (!userLoading && userData?.me.user?.isVerified === false) {
    history.push("/not-valid-user");
  }
  console.log(productsData, error);
  return (
    <div>
      {!userLoading && userData?.me.user?.isVerified === true && (
        <div>
          <div className="max-w-screen-2xl min-h-screen mx-10 2xl:mx-auto pt-10 pb-32 grid  md:grid-cols-4 grid-rows-2 gap-5 ">
            {!productsLoading &&
              productsData?.allProducts.products?.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`}>
                  <ProductGridItem
                    name={product.name}
                    price={product.price}
                    bigImg={product.bigImg}
                    savedAmount={product.savedAmount}
                  />
                </Link>
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
