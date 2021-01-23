import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import { allCategories } from "../__generated__/allCategories";
import { createAccountVariables } from "../__generated__/createAccount";
import { createProduct } from "../__generated__/createProduct";
import { CreateProductInput } from "../__generated__/globalTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPlus,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
// @ts-ignore
import Editor from "ckeditor5-custom-build/build/ckeditor";
// @ts-ignore
import { CKEditor } from "@ckeditor/ckeditor5-react";
import "../styles/ckeditor.css";

const CREATE_PRODUCT_MUTATION = gql`
  mutation createProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      ok
      error
      productId
    }
  }
`;

const ALL_CATEGORIES_QUERY = gql`
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

const editorConfiguration = {
  toolbar: {
    items: [
      "|",
      "heading",
      "bold",
      "italic",
      "link",
      "bulletedList",
      "numberedList",
      "|",
      "imageUpload",
      "indent",
      "outdent",
      "|",
      "blockQuote",
      "undo",
      "redo",
      "|",
      "fontSize",
      "fontFamily",
      "fontColor",
    ],
  },
  ckfinder: {
    uploadUrl: "http://localhost:4000/uploads",
  },
  fontSize: {
    options: [9, 11, 13, "default", 17, 19, 21],
  },
};

export const CreateProduct = () => {
  const [previewImage, setPreviewImage] = useState<string[]>([]);
  const [currentPreview, setCurrentPreview] = useState(0);
  const imageRef = useRef<HTMLLabelElement>(null);
  const { data: userData, loading: userLoading } = useMe();
  const { data: categoriesData } = useQuery<allCategories>(
    ALL_CATEGORIES_QUERY
  );
  const [createProductMutation] = useMutation<
    createProduct,
    createAccountVariables
  >(CREATE_PRODUCT_MUTATION);
  const history = useHistory();
  const descriptionRef = useRef<HTMLDivElement>(null);
  const {
    register,
    getValues,
    handleSubmit,
    errors,
  } = useForm<CreateProductInput>({
    mode: "onChange",
  });
  useEffect(() => {
    if (!userLoading && userData?.me.user?.isVerified === false) {
      history.push("/not-valid-user");
    }
  }, []);

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.style.backgroundImage = `url(${previewImage[currentPreview]})`;
      imageRef.current.style.backgroundSize = "cover";
      imageRef.current.style.backgroundPosition = "center center";
    }
  }, [previewImage, currentPreview]);

  const onClickToGoBack = () => {
    history.goBack();
  };
  const onChangeDescription = () => {
    console.log(descriptionRef.current?.innerHTML);
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

  console.log(previewImage, currentPreview);

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
        <form>
          <div className="flex  bg-indigo-800">
            {previewImage && previewImage.length !== 0 && (
              <div
                onClick={onClickPreviewImageLeft}
                className="px-3 cursor-pointer h-48 md:h-64 xl:h-96 flex items-center justify-center"
              >
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  className="md:text-4xl text-amber-400  "
                />
              </div>
            )}
            <label
              ref={imageRef}
              htmlFor="imageUploads"
              className="h-48 md:h-64 xl:h-96 bg-indigo-800 w-full flex justify-center items-center cursor-pointer"
            >
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
                className="px-3 cursor-pointer h-48 md:h-64 xl:h-96 flex items-center justify-center"
              >
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="text-base md:text-4xl text-amber-400  "
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
              const fileList: FileList = getValues("imageUploads");
              const keys = Object.keys(fileList);
              for (const key of keys) {
                const url = URL.createObjectURL(fileList.item(+key));
                setPreviewImage((prev) => [...prev, url]);
              }
            }}
          />
          <div className="grid grid-cols-5 grid-rows-2 ">
            <input
              style={{ gridColumn: "1/-3" }}
              ref={register}
              type="text"
              required
              name="productName"
              placeholder="상품 이름 (20자 이하로 작성해 주세요)"
              className="w-full py-8 md:py-10 px-5 text-xs md:text-xl focus:outline-none bg-indigo-600 text-white"
            />
            <div
              className="flex items-center bg-indigo-600"
              style={{ gridColumn: "1/-3" }}
            >
              <input
                ref={register}
                type="text"
                required
                name="productPrice"
                placeholder="상품 가격"
                className="w-full py-8 md:py-10 px-5 text-xs md:text-xl focus:outline-none bg-indigo-600 text-white  "
              />
              <span className=" text-sm md:text-xl text-amber-300 pr-5">
                원
              </span>
            </div>

            <select
              style={{ gridColumn: "-3/-1", gridRow: "1/ 2" }}
              className="bg-indigo-400 text-xs md:text-xl font-semibold text-amber-300 focus:outline-none "
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
            <select
              style={{ gridRow: "2/-1", gridColumn: "-3/-1" }}
              className="bg-indigo-500 focus:outline-none text-xs md:text-xl font-semibold text-amber-300"
            >
              <option className="text-white">판매금의 0.1%</option>
              <option className="text-white">판매금의 1%</option>
              <option className="text-white">판매금의 10%</option>
              <option className="text-white">판매금의 50%</option>
              <option className="text-white">판매금의 100%</option>
            </select>
          </div>
          <div className="pb-14">
            <div
              onInput={onChangeDescription}
              ref={descriptionRef}
              className="w-full px-10 py-5 focus:outline-none bg-indigo-900 text-amber-300 text-base md:text-xl"
              contentEditable={true}
              style={{ minHeight: "500px" }}
            />
          </div>
          <div className="pb-10 flex justify-center items-center">
            <button
              type="submit"
              className="py-5 px-10 md:px-20 text-base md:text-xl font-semibold bg-indigo-900 rounded-full text-amber-300 focus:outline-none"
            >
              완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
