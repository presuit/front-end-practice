import { gql, useQuery } from "@apollo/client";
import { me } from "../__generated__/me";

const ME_QUERY = gql`
  query me {
    me {
      ok
      error
      user {
        id
        isVerified
        email
        username
        avatarImg
      }
    }
  }
`;

export const useMe = () => {
  return useQuery<me>(ME_QUERY);
};
