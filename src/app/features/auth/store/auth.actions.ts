import { createAction, props } from "@ngrx/store";

export const signIn = createAction("[Auth] Sign In", props<{ email: string; password: string }>());
export const signInSuccess = createAction("[Auth] Sign In Success");
export const signInFailure = createAction("[Auth] Sign In Failure", props<{ error: string }>());

export const signUp = createAction("[Auth] Sign Up", props<{ email: string; password: string }>());
export const signUpSuccess = createAction("[Auth] Sign Up Success");
export const signUpFailure = createAction("[Auth] Sign Up Failure", props<{ error: string }>());

export const signInWithGoogle = createAction("[Auth] Sign In with Google");
export const signInWithGoogleSuccess = createAction("[Auth] Sign In with Google Success");
export const signInWithGoogleFailure = createAction("[Auth] Sign In with Google Failure", props<{ error: string }>());

export const signOut = createAction("[Auth] Sign Out");
export const signOutSuccess = createAction("[Auth] Sign Out Success");
export const signOutFailure = createAction("[Auth] Sign Out Failure", props<{ error: string }>());

export const resetPassword = createAction("[Auth] Reset Password", props<{ email: string }>());
export const resetPasswordSuccess = createAction("[Auth] Reset Password Success");
export const resetPasswordFailure = createAction("[Auth] Reset Password Failure", props<{ error: string }>());
