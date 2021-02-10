import { gql, useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import {
  requestNewVerification,
  requestNewVerificationVariables,
} from "../__generated__/requestNewVerification";

const REQUEST_NEW_VERIFICATION_MUTATION = gql`
  mutation requestNewVerification($input: RequestNewVerificationInput!) {
    requestNewVerification(input: $input) {
      ok
      error
    }
  }
`;

export const NotValidUser = () => {
  const history = useHistory();
  const { data, error } = useMe();

  const onCompleted = (data: requestNewVerification) => {
    const {
      requestNewVerification: { ok },
    } = data;
    if (ok === true) {
      alert(
        "성공적으로 인증 코드가 발급 되었습니다. 이메일에 접근하여 인증을 마쳐주세요."
      );
    }
  };

  const [requestNewVerification] = useMutation<
    requestNewVerification,
    requestNewVerificationVariables
  >(REQUEST_NEW_VERIFICATION_MUTATION, {
    onCompleted,
  });

  const onClickToRequestNewVerification = () => {
    if (data?.me.user?.id) {
      requestNewVerification({
        variables: { input: { userId: data?.me.user.id } },
      });
    } else {
      alert("유저 정보에 에러가 발생하였습니다. 다시 로그인 해주세요.");
      onClickToResetToken();
    }
  };

  const onClickToResetToken = () => {
    localStorage.removeItem("token");
    history.push("/");
    window.location.reload();
  };

  useEffect(() => {
    if (data?.me.user?.isVerified && data?.me.user?.isVerified === true) {
      history.push("/");
      window.location.reload();
    }
  }, [data]);

  return (
    <div>
      <div className="min-h-screen flex justify-center items-center bg-indigo-500">
        <div className="max-w-screen-sm w-full mx-10 bg-white shadow-xl rounded-md py-12 px-10 sm:mx-0">
          <div className="text-center font-semibold text-2xl">
            <h1>입력하신 이메일로 인증 링크를 보냈습니다.</h1>
            <h2 className="text-base mt-3">
              메일을 체크하고 링크를 클릭하여 인증을 마쳐주세요!
            </h2>
          </div>
          <div className="grid grid-cols-2 w-full mt-10 bg-gray-200  border ">
            <button
              onClick={onClickToResetToken}
              className="py-5 hover:bg-indigo-500 transition-colors  focus:outline-none "
            >
              이전 페이지로 돌아가기
            </button>
            <button
              onClick={onClickToRequestNewVerification}
              className="py-5 hover:bg-indigo-500 transition-colors focus:outline-none"
            >
              메일 다시 보내기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
