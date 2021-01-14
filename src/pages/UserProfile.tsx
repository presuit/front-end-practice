import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useMe } from "../hooks/useMe";

export const UserProfile = () => {
  const history = useHistory();
  const { loading, data } = useMe();
  useEffect(() => {
    if (!loading && data?.me.user?.isVerified === false) {
      history.push("/not-valid-user");
    }
  }, []);
  return <div>UserProfile</div>;
};
