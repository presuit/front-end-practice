import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useMe } from "../hooks/useMe";

export const CreateProduct = () => {
  const { data: userData, loading: userLoading } = useMe();
  const history = useHistory();
  if (!userLoading && userData?.me.user?.isVerified === false) {
    history.push("/not-valid-user");
  }
  return <div>CreateProduct</div>;
};
