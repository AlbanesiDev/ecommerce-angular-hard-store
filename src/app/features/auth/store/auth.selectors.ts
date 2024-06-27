import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "../interfaces/auth.interface";

export const selectAuthState = createFeatureSelector<AuthState>("auth");

export const selectUserAuth = createSelector(selectAuthState, (state) => state.userAuth);
export const selectLoading = createSelector(selectAuthState, (state) => state.loading);
export const selectError = createSelector(selectAuthState, (state) => state.error);
export const selectForgotSuccess = createSelector(selectAuthState, (state) => state.forgotSuccess);
