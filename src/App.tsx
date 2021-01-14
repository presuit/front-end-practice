import { useReactiveVar } from "@apollo/client";
import React from "react";
import { isLoggedIn } from "./apollo";
import { LoggedInRouter } from "./components/LoggedInRouter";
import { LoggedOutRouter } from "./components/LoggedOutRouter";

function App() {
  const isLoggedInVar = useReactiveVar<boolean>(isLoggedIn);
  console.log(isLoggedInVar, "gg");
  return isLoggedInVar ? <LoggedInRouter /> : <LoggedOutRouter />;
}

export default App;
