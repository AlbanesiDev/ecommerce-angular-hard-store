import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, exhaustMap, map, of } from "rxjs";
import {
  signIn,
  signInSuccess,
  signInFailure,
  signUp,
  signUpSuccess,
  signUpFailure,
  signInWithGoogle,
  signInWithGoogleSuccess,
  signInWithGoogleFailure,
  signOut,
  signOutSuccess,
  signOutFailure,
  resetPassword,
  resetPasswordSuccess,
  resetPasswordFailure,
} from "./auth.actions";
import { MessageService } from "primeng/api";
import { AuthService } from "../services/auth.service";

@Injectable()
export class AuthEffects {
  private readonly _messageService = inject(MessageService);
  private readonly _authService = inject(AuthService);
  private readonly _actions = inject(Actions);
  private readonly _router = inject(Router);

  signIn$ = createEffect(() =>
    this._actions.pipe(
      ofType(signIn),
      exhaustMap(({ email, password }) =>
        this._authService.signInWithEmail({ email, password }).pipe(
          map(() => signInSuccess()),
          catchError((error) => of(signInFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  signUp$ = createEffect(() =>
    this._actions.pipe(
      ofType(signUp),
      exhaustMap(({ email, password }) =>
        this._authService.signUpWithEmail({ email: email, password: password }).pipe(
          map(() => signUpSuccess()),
          catchError((error) => of(signUpFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  signInWithGoogle$ = createEffect(() =>
    this._actions.pipe(
      ofType(signInWithGoogle),
      exhaustMap(() =>
        this._authService.signInWithGoogle().pipe(
          map(() => signInWithGoogleSuccess()),
          catchError((error) => of(signInWithGoogleFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  signOut$ = createEffect(() =>
    this._actions.pipe(
      ofType(signOut),
      exhaustMap(() =>
        this._authService.signOut().pipe(
          map(() => signOutSuccess()),
          catchError((error) => of(signOutFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  signOutSuccess$ = createEffect(() =>
    this._actions.pipe(
      ofType(signOutSuccess),
      map(() => {
        this._router.navigateByUrl("/");
        this._messageService.add({ severity: "info", summary: "Información", detail: "Cierre de sesión exitoso" });
        return { type: "DUMMY" };
      }),
    ),
  );

  success$ = createEffect(() =>
    this._actions.pipe(
      ofType(signInSuccess, signUpSuccess, signInWithGoogleSuccess),
      map(() => {
        this._router.navigateByUrl("/perfil");
        this._messageService.add({ severity: "success", summary: "Éxito", detail: "Inicio de sesión exitoso" });
        return { type: "DUMMY" };
      }),
    ),
  );

  failure$ = createEffect(
    () =>
      this._actions.pipe(
        ofType(signInFailure, signUpFailure, signInWithGoogleFailure, signOutFailure),
        map(({ error }) => {
          this._messageService.add({ severity: "error", summary: "Error", detail: error });
          return { type: "DUMMY" };
        }),
      ),
    { dispatch: false },
  );

  forgotPassword$ = createEffect(() =>
    this._actions.pipe(
      ofType(resetPassword),
      exhaustMap(({ email }) =>
        this._authService.sendEmailForResetPassword(email).pipe(
          map(() => resetPasswordSuccess()),
          catchError((error) => of(resetPasswordFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  forgotPasswordSuccess$ = createEffect(() =>
    this._actions.pipe(
      ofType(resetPasswordSuccess),
      map(() => {
        this._messageService.add({
          severity: "success",
          summary: "Información",
          detail: "Correo enviado exitosamente",
        });
        return { type: "DUMMY" };
      }),
    ),
  );
}
