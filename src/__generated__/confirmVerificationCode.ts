/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ConfirmVerificationCodeInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: confirmVerificationCode
// ====================================================

export interface confirmVerificationCode_confirmVerificationCode {
  __typename: "ConfirmVerificationCodeOutput";
  ok: boolean;
  error: string | null;
  userId: number | null;
}

export interface confirmVerificationCode {
  confirmVerificationCode: confirmVerificationCode_confirmVerificationCode;
}

export interface confirmVerificationCodeVariables {
  input: ConfirmVerificationCodeInput;
}
