/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LogInInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: logIn
// ====================================================

export interface logIn_logIn {
  __typename: "LogInOutput";
  ok: boolean;
  error: string | null;
  token: string | null;
}

export interface logIn {
  logIn: logIn_logIn;
}

export interface logInVariables {
  input: LogInInput;
}
