import React from "react";
import { Menu } from "../components/Menu";
import { useMe } from "../hooks/useMe";

export const Me = () => {
  const { data, loading } = useMe();
  return (
    <div>
      {!loading && data?.me.ok && (
        <>
          <div className="max-w-screen-2xl h-screen  mx-16 2xl:mx-auto shadow-2xl"></div>
          <Menu />
        </>
      )}
    </div>
  );
};
