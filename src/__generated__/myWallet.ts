/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: myWallet
// ====================================================

export interface myWallet_myWallet_wallet_histories {
  __typename: "WalletHistory";
  productId: number;
  purchaseDate: number;
  canIRefund: boolean;
  price: number;
}

export interface myWallet_myWallet_wallet {
  __typename: "Wallet";
  id: number;
  point: number;
  histories: myWallet_myWallet_wallet_histories[] | null;
}

export interface myWallet_myWallet {
  __typename: "MyWalletOutput";
  ok: boolean;
  error: string | null;
  wallet: myWallet_myWallet_wallet | null;
}

export interface myWallet {
  myWallet: myWallet_myWallet;
}
