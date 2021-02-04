import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useHistory, useParams } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import { allCategories } from "../__generated__/allCategories";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { PointPercent } from "../__generated__/globalTypes";
import { FormError } from "../components/FormError";
import { numberWithCommas } from "../utils";
import { ALL_CATEGORIES_QUERY } from "./CreateProduct";
import { PRODUCTS_FRAGMENT } from "../fragment";
import {
  editProductProductQuery,
  editProductProductQueryVariables,
} from "../__generated__/editProductProductQuery";
import {
  editProduct,
  editProductVariables,
} from "../__generated__/editProduct";
import { ImgGrid } from "../components/ImgGrid";
import { BackButton } from "../components/BackButton";
import { FormButton } from "../components/FormButton";
import { FIND_PRODUCT_BY_ID_QUERY } from "./Product";

export const EDIT_PRODUCT_PRODUCT_QUERY = gql`
  query editProductProductQuery($productId: Float!) {
    findProductById(productId: $productId) {
      ok
      error
      product {
        ...productsParts
        seller {
          id
          username
        }
      }
    }
  }
  ${PRODUCTS_FRAGMENT}
`;

export const EDIT_PRODUCT_MUTATION = gql`
  mutation editProduct($input: EditProductInput!) {
    editProduct(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  id: string;
}

interface IFormProps {
  productName: string;
  productPrice: string;
  category: string;
}

export const EditProduct = () => {
  const { id } = useParams<IParams>();
  const descriptionDivRef = useRef<HTMLDivElement>(null);
  const { data: userData, loading: userLoading } = useMe();
  const { data: categoriesData } = useQuery<allCategories>(
    ALL_CATEGORIES_QUERY
  );
  const { data: productData } = useQuery<
    editProductProductQuery,
    editProductProductQueryVariables
  >(EDIT_PRODUCT_PRODUCT_QUERY, { variables: { productId: +id } });
  const [imgUrls, setImgUrls] = useState<string[]>([]);
  const [exitImgGrid, setExitImgGrid] = useState(true);

  const onCompleted = (data: editProduct) => {
    const {
      editProduct: { ok, error },
    } = data;
    if (ok) {
      alert("업데이트 성공!");
      history.push(`/product/${id}`);
    } else {
      alert(error);
    }
  };

  const [editProductMutation, { loading: editProductLoading }] = useMutation<
    editProduct,
    editProductVariables
  >(EDIT_PRODUCT_MUTATION, { onCompleted });

  const history = useHistory();
  const {
    register,
    getValues,
    handleSubmit,
    errors,
    formState,
    setValue,
  } = useForm<IFormProps>({
    mode: "onChange",
  });

  const onSubmit = async () => {
    const { category, productName } = getValues();
    const description = descriptionDivRef.current?.innerHTML;

    await editProductMutation({
      variables: {
        input: {
          productId: +id,
          categorySlug: category,
          ...(description && { description }),
          ...(productName && { name: productName }),
        },
      },
      refetchQueries: [
        {
          query: FIND_PRODUCT_BY_ID_QUERY,
          variables: {
            productId: +id,
          },
        },
      ],
    });
  };

  const generatePointPercentOption = (value: PointPercent) => {
    if (value === PointPercent.full) {
      return "가격의 100%";
    }
    if (value === PointPercent.half) {
      return "가격의 50%";
    }
    if (value === PointPercent.one) {
      return "가격의 1%";
    }
    if (value === PointPercent.ten) {
      return "가격의 10%";
    }
    if (value === PointPercent.zeroDotOne) {
      return "가격의 0.1%";
    }
  };

  const setProductValueToInput = () => {
    if (productData?.findProductById.product) {
      console.log("setProductValueToInput");
      const originalCategory =
        productData.findProductById.product.category.slug;
      const originalName = productData.findProductById.product.name;
      const originalPrice = productData.findProductById.product.price;
      const originalDescription =
        productData.findProductById.product.description;

      setValue("category", originalCategory);
      setValue("productName", originalName);
      setValue("productPrice", originalPrice);

      if (descriptionDivRef.current && originalDescription) {
        descriptionDivRef.current.innerHTML = originalDescription;
      }

      if (productData?.findProductById.product?.detailImgs) {
        const detailImgs = productData?.findProductById.product?.detailImgs;
        let imgUrlContainer: string[] = [];
        detailImgs.forEach((eachImg) => {
          imgUrlContainer.push(eachImg.source);
        });
        setImgUrls([...imgUrlContainer]);
      }
    }
  };

  useEffect(() => {
    if (!userLoading && userData?.me.user?.isVerified === false) {
      history.push("/not-valid-user");
    }

    if (userData?.me.user && productData?.findProductById.product) {
      if (
        userData?.me.user.id !== productData?.findProductById.product.seller.id
      ) {
        alert("접근 권한이 없습니다.");
        history.push(`/product/${id}`);
      }
    }
  }, []);

  useEffect(() => {
    setProductValueToInput();
  }, [productData]);

  useEffect(() => {
    if (exitImgGrid) {
      console.log("refetchProduct");
      setProductValueToInput();
    }
  }, [exitImgGrid]);

  if (productData?.findProductById.error) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center">
        <h1 className="text-amber-300 text-3xl font-bold">
          {productData?.findProductById.error}
        </h1>
        <Link className="mt-10 text-gray-200 hover:underline text-xl" to="/">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div>
      {!exitImgGrid ? (
        <ImgGrid
          productId={+id}
          useFor="EDIT"
          originalImgs={imgUrls.slice()}
          exitImgGrid={exitImgGrid}
          setExitImgGrid={setExitImgGrid}
        />
      ) : (
        <>
          <BackButton />
          <div className="max-w-screen-2xl min-h-screen mx-12 2xl:mx-auto shadow-2xl">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div
                onClick={() => setExitImgGrid(false)}
                className=" h-64 md:h-96 bg-indigo-800 w-full  cursor-pointer flex justify-center items-center"
              >
                {productData?.findProductById.product?.bigImg ? (
                  <img
                    className="max-w-full max-h-full"
                    src={productData.findProductById.product.bigImg}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faPlus}
                    className="text-5xl text-indigo-500"
                  />
                )}
              </div>
              <div className="grid grid-cols-5 grid-rows-4 md:grid-rows-2 bg-indigo-600 ">
                <div className="col-start-1 col-span-5 md:col-start-1 md:col-span-3">
                  <input
                    ref={register}
                    type="text"
                    name="productName"
                    placeholder="상품 이름 "
                    className="w-full py-8 md:py-10 px-5 text-xs md:text-xl focus:outline-none bg-indigo-600 text-white  "
                  />
                </div>
                <div className=" bg-indigo-600 row-start-2 row-span-1 col-start-1 col-span-5 md:col-start-1 md:col-span-3 md:row-start-2 md:row-span-1">
                  <div className="w-full py-8 md:py-10 px-5 text-xs md:text-xl focus:outline-none bg-indigo-600 text-white cursor-not-allowed ">
                    {productData?.findProductById.product?.price && (
                      <span className="text-amber-300 font-semibold">
                        {numberWithCommas(
                          productData?.findProductById.product?.price
                        )}
                        원
                      </span>
                    )}
                  </div>
                  {errors.productPrice?.message && (
                    <FormError errorMsg={errors.productPrice?.message} />
                  )}
                </div>

                <div className="col-span-full row-start-3 row-span-1 md:col-start-4 md:col-span-2 md:row-start-1 md:row-span-1">
                  <select
                    ref={register}
                    name="category"
                    className="bg-indigo-400 text-xs md:text-xl font-semibold text-amber-300 focus:outline-none w-full h-full "
                  >
                    {categoriesData?.allCategories.categories &&
                      categoriesData?.allCategories.categories.map(
                        (category, index) => (
                          <option key={index} className="text-white ">
                            {category.slug}
                          </option>
                        )
                      )}
                  </select>
                </div>
                <div className="col-span-full row-start-4 row-span-1 md:col-start-4 md:col-span-2 md:row-start-2 md:row-span-1">
                  <div className="bg-indigo-500 focus:outline-none text-xs md:text-xl font-semibold text-amber-300 w-full h-full flex justify-start items-center pl-2 cursor-not-allowed">
                    {productData?.findProductById.product?.pointPercent &&
                      generatePointPercentOption(
                        productData?.findProductById.product?.pointPercent
                      )}
                  </div>
                </div>
              </div>
              <div className=" py-12 px-10 bg-indigo-800">
                <div
                  ref={descriptionDivRef}
                  className="w-full rounded-lg px-5 py-5 focus:outline-none bg-indigo-100 text-black text-sm md:text-xl"
                  contentEditable={true}
                  style={{ minHeight: "500px" }}
                />
              </div>
              <div className="py-10 flex justify-center items-center ">
                <FormButton
                  btnText={"수정"}
                  isValid={formState.isValid}
                  loading={editProductLoading}
                />
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
