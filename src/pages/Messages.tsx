import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Menu } from "../components/Menu";
import { useMe } from "../hooks/useMe";

export const Messages = () => {
  const history = useHistory();
  const { loading, data } = useMe();
  useEffect(() => {
    if (!loading && data?.me.user?.isVerified === false) {
      history.push("/not-valid-user");
    }
  }, []);
  return (
    <div>
      <div className="max-w-screen-2xl  min-h-screen  mx-12 2xl:mx-auto shadow-2xl">
        <Menu />
      </div>
    </div>
  );
};
