import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { MeMenus } from "./pages/Me";
import { UserProfileMenus } from "./pages/UserProfile";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

const token = localStorage.getItem("token");
export const isLoggedIn = makeVar(Boolean(token));
export const authToken = makeVar(token);
export const currentHomePage = makeVar(1);
export const currentMeMenu = makeVar(MeMenus.UsernameMenu);
export const currentUserProfileMenu = makeVar(UserProfileMenus.UsernameMenu);

const httpLink = createHttpLink({ uri: "http://localhost:4000/graphql" });

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      "x-jwt": authToken() || "",
    },
  },
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "x-jwt": authToken() || "",
    },
  };
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
