import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { UserProfileMenus } from "./pages/Me";

const token = localStorage.getItem("token");
export const isLoggedIn = makeVar(Boolean(token));
export const authToken = makeVar(token);
export const currentHomePage = makeVar(1);
export const currentMeMenu = makeVar(UserProfileMenus.UsernameMenu);

const httpLink = createHttpLink({ uri: "http://localhost:4000/graphql" });

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "x-jwt": authToken() || "",
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
