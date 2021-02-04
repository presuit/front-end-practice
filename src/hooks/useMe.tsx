import { gql, useQuery } from "@apollo/client";
import { me } from "../__generated__/me";
import { myWallet } from "../__generated__/myWallet";

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
        msgRooms {
          id
        }
      }
    }
  }
`;

const MY_WALLET_QUERY = gql`
  query myWallet {
    myWallet {
      ok
      error
      wallet {
        id
        point
        histories {
          productId
          purchaseDate
          canIRefund
          price
        }
      }
    }
  }
`;

export const useMe = () => {
  return useQuery<me>(ME_QUERY);
};

export const useMyWallet = () => {
  return useQuery<myWallet>(MY_WALLET_QUERY);
};
