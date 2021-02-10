import { gql, useQuery } from "@apollo/client";
import { Link, useParams } from "react-router-dom";
import { BackButton } from "../components/BackButton";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ProductGridItem } from "../components/ProductGridItem";
import {
  findCategoryBySlug,
  findCategoryBySlugVariables,
} from "../__generated__/findCategoryBySlug";

export const FIND_CATEGORY_BY_SLUG_QUERY = gql`
  query findCategoryBySlug($input: FindCategoryBySlugInput!) {
    findCategoryBySlug(input: $input) {
      ok
      error
      category {
        id
        slug
        name
        products {
          id
          name
          price
          bigImg
          savedAmount
        }
      }
    }
  }
`;

interface IParams {
  slug: string;
}

export const Category = () => {
  const { slug } = useParams<IParams>();
  const { loading, data } = useQuery<
    findCategoryBySlug,
    findCategoryBySlugVariables
  >(FIND_CATEGORY_BY_SLUG_QUERY, {
    variables: {
      input: {
        slug,
      },
    },
    fetchPolicy: "network-only",
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  console.log(data);
  return (
    <div>
      <BackButton />
      <div className="max-w-screen-2xl min-h-screen mx-10 2xl:mx-auto pt-10 pb-32 grid  md:grid-cols-4 md:auto-rows-fr   gap-5">
        {data?.findCategoryBySlug.ok &&
          data?.findCategoryBySlug.category?.products &&
          data?.findCategoryBySlug.category?.products.map((product) => (
            <Link
              className="h-96"
              key={product.id}
              to={`/product/${product.id}`}
            >
              <ProductGridItem
                name={product.name}
                price={product.price}
                bigImg={product.bigImg}
                savedAmount={product.savedAmount}
              />
            </Link>
          ))}
      </div>
    </div>
  );
};
