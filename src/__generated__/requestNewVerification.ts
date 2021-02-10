/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RequestNewVerificationInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: requestNewVerification
// ====================================================

export interface requestNewVerification_requestNewVerification {
  __typename: "RequestNewVerificationOutput";
  ok: boolean;
  error: string | null;
}

export interface requestNewVerification {
  requestNewVerification: requestNewVerification_requestNewVerification;
}

export interface requestNewVerificationVariables {
  input: RequestNewVerificationInput;
}
