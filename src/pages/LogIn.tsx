import React from "react";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { logIn, logInVariables } from "../__generated__/logIn";
import { Link } from "react-router-dom";
import { isLoggedIn } from "../apollo";
import { Helmet } from "react-helmet-async";

const LOG_IN_MUTATION = gql`
  mutation logIn($input: LogInInput!) {
    logIn(input: $input) {
      ok
      error
      token
    }
  }
`;

interface IFormProps {
  email: string;
  password: string;
}

export const LogIn = () => {
  const { register, getValues, errors, handleSubmit } = useForm<IFormProps>({
    mode: "onChange",
  });
  const onCompleted = (data: logIn) => {
    const {
      logIn: { ok, token },
    } = data;

    if (ok && token) {
      console.log(token);
      localStorage.setItem("token", token);
      isLoggedIn(true);
    }
  };
  const onClick = () => {
    const { email, password } = getValues();
    logInMutation({
      variables: {
        input: {
          email,
          password,
        },
      },
    });
  };
  const [logInMutation, { data, error: mutationError }] = useMutation<
    logIn,
    logInVariables
  >(LOG_IN_MUTATION, {
    onCompleted,
  });
  return (
    <div className=" h-screen  bg-indigo-500 flex items-center justify-center">
      <Helmet>
        <title>로그인 | front-end-practice</title>
      </Helmet>
      <div className=" max-w-screen-sm   px-10 pt-20  pb-5  shadow-xl bg-white rounded-md  mx-10 sm:mx-auto  ">
        <form
          onSubmit={handleSubmit(onClick)}
          className="flex flex-col w-full "
        >
          <input
            className="py-5 px-3  w-full  mb-3 focus:outline-none border border-black"
            ref={register({
              required: "이메일은 로그인 하는데 필수적인 요소입니다.",
              pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            type="email"
            name="email"
            placeholder="이메일"
            required
          />
          {errors.email?.types?.pattern && (
            <h4 className="text-red-500 font-medium text-md my-3">
              이메일 형식이 잘못되었습니다.
            </h4>
          )}
          {errors.email?.message && (
            <h4 className="text-red-500 font-medium text-md my-3">
              {errors.email?.message}
            </h4>
          )}
          <input
            className="py-5 px-3  mb-3 w-full focus:outline-none border border-black"
            ref={register({
              required: "비밀번호는 로그인 하는데 필수적인 요소입니다.",
            })}
            type="password"
            name="password"
            placeholder="비밀번호"
            required
          />
          {errors.password?.message && (
            <h4 className="text-red-500 font-medium text-md my-3">
              {errors.password?.message}
            </h4>
          )}
          <button
            className="py-5 px-3  w-full  mb-3 focus:outline-none border border-black hover:bg-indigo-700 hover:text-white transition-colors"
            type="submit"
          >
            로그인
          </button>
          {mutationError && (
            <h4 className="text-red-500 font-medium text-md my-3">
              {mutationError.message}
            </h4>
          )}
        </form>
        <div>
          <h3>
            아직 회원이 아니신가요?{" "}
            <Link
              className="text-indigo-700 hover:underline"
              to="/create-account"
            >
              여기
            </Link>
            를 눌러 회원가입 하세요!
          </h3>
        </div>
      </div>
    </div>
  );
};