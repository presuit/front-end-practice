import React from "react";
import { isLoggedIn } from "../apollo";

export const LoggedInRouter = () => {
  return (
    <div>
      <span>LoggedInRouter</span>
      <button
        className="py-5 px-3 bg-red-600"
        onClick={() => isLoggedIn(false)}
      >
        Click to logOut
      </button>
    </div>
  );
};
