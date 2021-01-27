import React from "react";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { isLoggedIn } from "../apollo";
import { Helmet } from "react-helmet-async";
import { CreateAccountInput } from "../__generated__/globalTypes";
import {
  createAccount,
  createAccountVariables,
} from "../__generated__/createAccount";

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount($input: CreateAccountInput!) {
    createAccount(input: $input) {
      ok
      error
    }
  }
`;

export const CreateAccount = () => {
  const history = useHistory();
  const {
    register,
    getValues,
    errors,
    handleSubmit,
  } = useForm<CreateAccountInput>({
    mode: "onChange",
  });
  const onClick = () => {
    const { email, password, username } = getValues();
    createAccountMutation({
      variables: {
        input: {
          email,
          password,
          username,
        },
      },
    });
  };
  const onCompleted = (data: createAccount) => {
    const {
      createAccount: { ok, error },
    } = data;

    if (!ok && error) {
      alert(error);
    }

    if (ok) {
      alert("회원가입 성공! 로그인 해주세요");
      history.push("/");
    }
  };
  const [createAccountMutation, { error }] = useMutation<
    createAccount,
    createAccountVariables
  >(CREATE_ACCOUNT_MUTATION, {
    onCompleted,
  });

  return (
    <div className=" min-h-screen  bg-indigo-500 flex items-center justify-center">
      <Helmet>
        <title>회원가입 | front-end-practice</title>
      </Helmet>
      <div className=" max-w-screen-sm w-full   px-10 pt-10  pb-5  shadow-xl bg-white rounded-md  mx-10 ">
        <form
          onSubmit={handleSubmit(onClick)}
          className="flex flex-col w-full "
        >
          <h2 className="mb-5 text-center font-semibold text-2xl text-indigo-600">
            회원가입
          </h2>
          <input
            className="py-5 px-3  w-full  mb-3 focus:outline-none border border-black focus:border-indigo-600 transition-colors"
            ref={register({
              required: "이메일은 회원가입 하는데 필수적인 요소입니다.",
              pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            type="email"
            name="email"
            placeholder="이메일"
            required
          />
          {errors.email?.type === "pattern" && (
            <h4 className="text-red-500 font-medium text-md my-3">
              이메일 형식이 잘못되었습니다.
            </h4>
          )}
          {errors.email?.type === "required" && (
            <h4 className="text-red-500 font-medium text-md my-3">
              {errors.email?.message}
            </h4>
          )}
          <input
            className="py-5 px-3  mb-3 w-full focus:outline-none border border-black focus:border-indigo-600 transition-colors"
            ref={register({
              required: "닉네임은 회원가입 하는데 필수적인 요소입니다.",
            })}
            type="text"
            name="username"
            placeholder="닉네임"
            required
          />
          {errors.username?.type === "required" && (
            <h4 className="text-red-500 font-medium text-md my-3">
              {errors.username?.message}
            </h4>
          )}
          <input
            className="py-5 px-3  mb-3 w-full focus:outline-none border border-black focus:border-indigo-600 transition-colors"
            ref={register({
              required: "비밀번호는 회원가입 하는데 필수적인 요소입니다.",
            })}
            type="password"
            name="password"
            placeholder="비밀번호"
            required
          />
          {errors.password?.type === "required" && (
            <h4 className="text-red-500 font-medium text-md my-3">
              {errors.password?.message}
            </h4>
          )}
          <button
            className="py-5 px-3  w-full  mb-3 focus:outline-none border border-black hover:bg-indigo-700 hover:text-white transition-colors"
            type="submit"
          >
            회원가입
          </button>
          {error && (
            <h4 className="text-red-500 font-medium text-md my-3">{error}</h4>
          )}
        </form>
        <div>
          <h3 className="text-center">
            이미 회원이신가요?{" "}
            <Link
              className="text-indigo-700 font-semibold hover:underline"
              to="/"
            >
              여기
            </Link>
            를 눌러 로그인 하세요!
          </h3>
        </div>
      </div>
    </div>
  );
};
