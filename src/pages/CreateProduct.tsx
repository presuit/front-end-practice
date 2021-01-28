import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import { allCategories } from "../__generated__/allCategories";
import {
  createProduct,
  createProductVariables,
} from "../__generated__/createProduct";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPlus,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { PointPercent } from "../__generated__/globalTypes";
import { FormError } from "../components/FormError";
import { numberWithCommas } from "../utils";

const CREATE_PRODUCT_MUTATION = gql`
  mutation createProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      ok
      error
      productId
    }
  }
`;

export const ALL_CATEGORIES_QUERY = gql`
  query allCategories {
    allCategories {
      ok
      error
      categories {
        slug
      }
    }
  }
`;

interface IFormProps {
  imageUploads: FileList;
  productName: string;
  productPrice: string;
  category: string;
  pointPercentKor: string;
}

export const CreateProduct = () => {
  const descriptionDivRef = useRef<HTMLDivElement>(null);
  const [previewImage, setPreviewImage] = useState<string[]>([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentPreview, setCurrentPreview] = useState(0);
  const { data: userData, loading: userLoading } = useMe();
  const { data: categoriesData } = useQuery<allCategories>(
    ALL_CATEGORIES_QUERY
  );
  const onCompleted = (data: createProduct) => {
    const {
      createProduct: { ok, error, productId },
    } = data;
    if (ok) {
      alert("상품 가격의 일원 단위는 지워집니다.");
      alert("프로덕트가 성공적으로 create 되었습니다.");
      history.push(`/product/${productId}`);
    } else {
      alert("에러 발생!");
      console.log(error);
    }
  };
  const [createProductMutation] = useMutation<
    createProduct,
    createProductVariables
  >(CREATE_PRODUCT_MUTATION, { onCompleted });
  const history = useHistory();
  const {
    register,
    getValues,
    handleSubmit,
    watch,
    errors,
    formState,
    setValue,
  } = useForm<IFormProps>({
    mode: "onChange",
  });
  useEffect(() => {
    if (!userLoading && userData?.me.user?.isVerified === false) {
      history.push("/not-valid-user");
    }
  }, []);

  const onClickToGoBack = () => {
    history.push("/");
  };
  const onClickPreviewImageLeft = () => {
    if (currentPreview === 0) {
      setCurrentPreview(previewImage.length - 1);
    }
    if (currentPreview >= 1) {
      setCurrentPreview((prev) => prev - 1);
    }
  };
  const onClickPreviewImageRight = () => {
    if (currentPreview === previewImage.length - 1) {
      setCurrentPreview(0);
    }
    if (currentPreview < previewImage.length - 1) {
      setCurrentPreview((prev) => prev + 1);
    }
  };
  const parsePointPercentKorToEnum = (value: string): PointPercent => {
    if (value === "가격의 100%") {
      return PointPercent.full;
    }
    if (value === "가격의 50%") {
      return PointPercent.half;
    }
    if (value === "가격의 1%") {
      return PointPercent.one;
    }
    if (value === "가격의 10%") {
      return PointPercent.ten;
    }
    if (value === "가격의 0.1%") {
      return PointPercent.zeroDotOne;
    }
    return PointPercent.zeroDotOne;
  };
  const onSubmit = async () => {
    const {
      category,
      imageUploads,
      productName,
      pointPercentKor,
    } = getValues();
    const description = descriptionDivRef.current?.innerHTML;
    const pointPercent = parsePointPercentKorToEnum(pointPercentKor);
    const price = Math.floor(currentPrice / 10) * 10;
    let bigImg: string | null = null;
    let detailImgs: string[] | null = null;

    console.log("Submit!", imageUploads);

    if (imageUploads && imageUploads.length !== 0) {
      const formImgData = new FormData();
      Object.values(imageUploads).forEach((eachImg) =>
        formImgData.append("uploads", eachImg)
      );
      const {
        data,
      }: { data: { uploaded: boolean; url: string }[] } = await axios({
        method: "POST",
        url: "http://localhost:4000/uploads",
        headers: { "Content-Type": "multipart/form-data" },
        data: formImgData,
      });
      if (data && data.length !== 0) {
        bigImg = data[0].uploaded ? data[0].url : "";
        detailImgs = data.map((eachData) =>
          eachData.uploaded ? eachData.url : ""
        );
      }
    }
    await createProductMutation({
      variables: {
        input: {
          categorySlug: category,
          name: productName,
          price,
          ...(description && { description }),
          ...(bigImg && { bigImg }),
          ...(detailImgs && { detailImgs }),
          pointPercent,
        },
      },
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

  const validatePrice = () => {
    let value = watch("productPrice");
    if (value.includes(",")) {
      value = value.replaceAll(",", "");
    }
    let number = Number.parseInt(value);
    if (isNaN(number)) {
      setValue("productPrice", value.substr(0, value.length - 1));
    } else {
      setValue("productPrice", numberWithCommas(number));
      setCurrentPrice(number);
    }
  };

  console.log(errors);

  return (
    <div>
      <div className="fixed top-0 left-0  ml-3 mt-5">
        <FontAwesomeIcon
          icon={faArrowLeft}
          onClick={onClickToGoBack}
          className="text-2xl 2xl:text-5xl text-amber-300 transition-colors cursor-pointer"
        />
      </div>
      <div className="max-w-screen-2xl min-h-screen mx-12 2xl:mx-auto shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex">
            {previewImage && previewImage.length !== 0 && (
              <div
                onClick={onClickPreviewImageLeft}
                className="px-3 md:px-5 cursor-pointer  flex items-center justify-center bg-indigo-900 "
              >
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  className="text-2xl md:text-4xl text-indigo-300  "
                />
              </div>
            )}
            <label
              htmlFor="imageUploads"
              className=" h-64 md:h-96 bg-indigo-800 w-full flex justify-center items-center cursor-pointer"
            >
              {previewImage && previewImage.length !== 0 && (
                <img
                  src={previewImage[currentPreview]}
                  className="max-h-full  max-w-full"
                />
              )}
              {previewImage && previewImage.length === 0 && (
                <FontAwesomeIcon
                  icon={faPlus}
                  className="text-5xl text-amber-400"
                />
              )}
            </label>
            {previewImage && previewImage.length !== 0 && (
              <div
                onClick={onClickPreviewImageRight}
                className="px-3 md:px-5 cursor-pointer  flex items-center justify-center bg-indigo-900   "
              >
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="text-2xl md:text-4xl text-indigo-300   "
                />
              </div>
            )}
          </div>
          <input
            ref={register}
            className="absolute opacity-0 pointer-events-none"
            type="file"
            name="imageUploads"
            id="imageUploads"
            accept="image/*"
            multiple={true}
            onInput={() => {
              if (previewImage.length !== 0) {
                setPreviewImage([]);
              }
              const fileList: FileList = getValues("imageUploads");
              const keys = Object.keys(fileList);
              for (const key of keys) {
                const url = URL.createObjectURL(fileList.item(+key));
                setPreviewImage((prev) => [...prev, url]);
              }
            }}
          />
          <div className="grid grid-cols-5 grid-rows-4 md:grid-rows-2 bg-indigo-600 ">
            <div className="col-start-1 col-span-5 md:col-start-1 md:col-span-3">
              <input
                ref={register({
                  required: "이름은 필수적인 요소입니다.",
                })}
                type="text"
                required
                name="productName"
                placeholder="상품 이름 "
                className="w-full py-8 md:py-10 px-5 text-xs md:text-xl focus:outline-none bg-indigo-600 text-white  "
              />
              {errors.productName?.message && (
                <FormError errorMsg={errors.productName?.message} />
              )}
              {errors.productName?.type === "maxLength" && (
                <FormError errorMsg={"최대 길이는 20자입니다."} />
              )}
            </div>
            <div className=" bg-indigo-600 row-start-2 row-span-1 col-start-1 col-span-5 md:col-start-1 md:col-span-3 md:row-start-2 md:row-span-1">
              <div className="flex items-center">
                <input
                  ref={register({
                    minLength: {
                      message: "상품 금액은 최소 10원부터입니다.",
                      value: 2,
                    },
                    maxLength: {
                      message: "상품 금액이 1억을 넘어갈 순 없습니다.",
                      value: 10,
                    },
                    required: "가격은 필수적인 요소입니다.",
                  })}
                  onChange={validatePrice}
                  type="text"
                  required
                  name="productPrice"
                  maxLength={10}
                  minLength={2}
                  placeholder="상품 가격"
                  className="w-full py-8 md:py-10 px-5 text-xs md:text-xl focus:outline-none bg-indigo-600 text-white  "
                />
                <span className=" text-sm md:text-xl text-amber-300 pr-5">
                  원
                </span>
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
              <select
                ref={register}
                name="pointPercentKor"
                className="bg-indigo-500 focus:outline-none text-xs md:text-xl font-semibold text-amber-300 w-full h-full"
              >
                {Object.values(PointPercent).map((value, index) => (
                  <option key={index} className="text-amber-300">
                    {generatePointPercentOption(value)}
                  </option>
                ))}
              </select>
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
          <div className="pb-10 flex justify-center items-center">
            {formState.isValid ? (
              <button
                type="submit"
                className="w-full py-5 px-10 md:px-20 text-base md:text-xl font-semibold bg-teal-500  text-gray-200 focus:outline-none focus:ring-4 ring-teal-600"
              >
                완료
              </button>
            ) : (
              <button
                type="submit"
                className="w-full py-5 px-10 md:px-20 text-base md:text-xl font-semibold bg-teal-500  text-gray-200 focus:outline-none focus:ring-4 ring-teal-600 opacity-70 pointer-events-none"
              >
                ...
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
