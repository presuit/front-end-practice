import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { ProductGridItem } from "../components/ProductGridItem";
import { useMe } from "../hooks/useMe";
import {
  allProducts,
  allProductsVariables,
} from "../__generated__/allProducts";
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
  const { data: productsData, loading: productsLoading, refetch } = useQuery<
    allProducts,
    allProductsVariables
  >(ALL_PRODUCTS_QUERY, {
    variables: {
      input: {
        page,
      },
    },
  });
  useEffect(() => {
    if (!userLoading && userData?.me.user?.isVerified === false) {
      history.push("/not-valid-user");
    }
    refetch({ input: { page } });
  }, []);
  return (
    <div>
      {!userLoading && userData?.me.user?.isVerified === true && (
        <div>
          <div className="max-w-screen-2xl min-h-screen mx-16 2xl:mx-auto pt-10 pb-32 grid  md:grid-cols-4 gap-10">
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
