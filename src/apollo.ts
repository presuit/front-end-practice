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
import {
  BASE_BACKEND_HTTPS_URL,
  BASE_BACKEND_WS_URL,
  BASE_LOCAL_BACKEND_HTTP_URL,
  BASE_LOCAL_BACKEND_WS_URL,
} from "./constants";

export interface newMsgManagerProps {
  id: number;
  prevMsg: number;
  newMsg: number;
}

const token = localStorage.getItem("token");
export const isLoggedIn = makeVar(Boolean(token));
export const authToken = makeVar(token);
export const currentHomePage = makeVar(1);
export const currentMeMenu = makeVar(MeMenus.UsernameMenu);
export const currentUserProfileMenu = makeVar(UserProfileMenus.UsernameMenu);
export const newMsgManager = makeVar<newMsgManagerProps[]>([]);

const httpLink = createHttpLink({
  uri:
    process.env.NODE_ENV === "production"
      ? `${BASE_BACKEND_HTTPS_URL}/graphql`
      : `${BASE_LOCAL_BACKEND_HTTP_URL}/graphql`,
});

const wsLink = new WebSocketLink({
  uri:
    process.env.NODE_ENV === "production"
      ? `${BASE_BACKEND_WS_URL}/graphql`
      : `${BASE_LOCAL_BACKEND_WS_URL}/graphql`,
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
