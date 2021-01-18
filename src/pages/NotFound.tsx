import React from "react";
import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div>
      <div className="w-full min-h-screen bg-indigo-400  text-white flex flex-col items-center justify-center">
        <h1 className="font-bold text-5xl mb-5">Page Not Found</h1>
        <h3 className="font-medium mb-5">
          이 페이지는 서비스 되지 않는 영역입니다.
        </h3>
        <h2 className="font-semibold text-3xl">
          <Link to="/" className=" hover:text-gray-800 transition-colors">
            홈으로 돌아가기
          </Link>
        </h2>
      </div>
    </div>
  );
};
