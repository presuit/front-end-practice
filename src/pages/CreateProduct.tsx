import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import { allCategories } from "../__generated__/allCategories";
import { createAccountVariables } from "../__generated__/createAccount";
import { createProduct } from "../__generated__/createProduct";
import { CreateProductInput } from "../__generated__/globalTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPlus } from "@fortawesome/free-solid-svg-icons";
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
  const { data: userData, loading: userLoading } = useMe();
  const { data: categoriesData } = useQuery<allCategories>(
    ALL_CATEGORIES_QUERY
  );
  const [createProductMutation] = useMutation<
    createProduct,
    createAccountVariables
  >(CREATE_PRODUCT_MUTATION);
  const history = useHistory();
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

  const onClickToGoBack = () => {
    history.goBack();
  };
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
        <form className="pt-10">
          <div className="h-48 md:h-64 xl:h-96 bg-indigo-800 w-full flex justify-center items-center cursor-pointer">
            <FontAwesomeIcon
              icon={faPlus}
              className="text-5xl text-amber-400"
            />
          </div>
          <div className="grid grid-cols-5 grid-rows-2">
            <input
              style={{ gridColumn: "1/-3" }}
              ref={register({
                minLength: 1,
                maxLength: 20,
              })}
              type="text"
              required
              name="productName"
              placeholder="상품 이름"
              className="w-full py-8 md:py-10 px-5 text-xs md:text-xl focus:outline-none bg-indigo-600 text-white"
            />
            <input
              style={{ gridColumn: "1/-3" }}
              ref={register({
                validate: {
                  positive: (value) => parseInt(value, 10) > 0,
                  lessThanTen: (value) => parseInt(value, 10) < 10,
                },
                valueAsNumber: true,
              })}
              type="number"
              required
              name="productPrice"
              placeholder="상품 가격"
              className="w-full  py-8 md:py-10 px-5 text-xs md:text-xl focus:outline-none bg-indigo-600 text-white"
            />

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
              className="bg-indigo-900 focus:outline-none text-xs md:text-xl font-semibold text-amber-300"
            >
              <option className="text-white">판매금의 0.1%</option>
              <option className="text-white">판매금의 1%</option>
              <option className="text-white">판매금의 10%</option>
              <option className="text-white">판매금의 50%</option>
              <option className="text-white">판매금의 100%</option>
            </select>
          </div>
          <div className="pb-14">
            <CKEditor
              editor={Editor}
              config={editorConfiguration}
              data="<p>세부 사항을 적어주세요!</p>"
              // @ts-ignore
              onChange={(event, editor) => {
                const data = editor.getData();
                console.log(data);
              }}
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
