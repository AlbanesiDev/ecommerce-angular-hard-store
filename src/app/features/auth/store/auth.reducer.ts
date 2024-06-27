import { createReducer, on } from "@ngrx/store";
import {
  signInSuccess,
  signUpSuccess,
  signOutSuccess,
  signInWithGoogleSuccess,
  signInWithGoogleFailure,
  signInFailure,
  signUpFailure,
  signOutFailure,
  signIn,
  signInWithGoogle,
  signUp,
  resetPasswordSuccess,
  resetPasswordFailure,
} from "./auth.actions";
import { AuthState } from "../interfaces/auth.interface";

export const authInitialState: AuthState = {
  userAuth: false,
  loading: false,
  error: null,
  forgotSuccess: false,
};

export const authReducer = createReducer(
  authInitialState,
  on(signIn, signUp, signInWithGoogle, (state) => ({
    ...state,
    loading: true,
  })),
  on(signInSuccess, signUpSuccess, signInWithGoogleSuccess, (state) => ({
    ...state,
    userAuth: true,
    loading: false,
  })),
  on(signOutSuccess, (state) => ({
    ...state,
    userAuth: false,
    loading: false,
  })),
  on(
    signOutFailure,
    signInWithGoogleFailure,
    signInFailure,
    signUpFailure,
    resetPasswordFailure,
    (state, { error }) => ({
      ...state,
      userAuth: false,
      loading: false,
      error,
    }),
  ),
  on(resetPasswordSuccess, (state) => ({
    ...state,
    forgotSuccess: true,
  })),
);
