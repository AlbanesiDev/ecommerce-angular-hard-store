import { Injectable, inject } from "@angular/core";
import { FirebaseError } from "@angular/fire/app";
import {
  Auth,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
} from "@angular/fire/auth";
import { Observable, catchError, from, throwError } from "rxjs";

/**
 * A service that provides authentication functionalities using Firebase.
 */
@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly _auth = inject(Auth);

  /**
   * Sign in an existing user with email and password.
   * @param credentials User email and password.
   * @returns An observable emitting UserCredential upon successful signin.
   */
  public signInWithEmail(credentials: { email: string; password: string }): Observable<UserCredential> {
    const promise = signInWithEmailAndPassword(this._auth, credentials.email, credentials.password);
    return from(promise).pipe(catchError((error) => this.handleError(error)));
  }

  /**
   * Sign up a new user with email and password.
   * @param credentials User email and password.
   * @returns An observable emitting UserCredential upon successful signup.
   */
  public signUpWithEmail(credentials: { email: string; password: string }): Observable<UserCredential> {
    console.log(credentials);
    const promise = createUserWithEmailAndPassword(this._auth, credentials.email, credentials.password);
    return from(promise).pipe(catchError((error) => this.handleError(error)));
  }

  /**
   * Sign in using Google.
   * @returns An observable emitting UserCredential upon successful signin.
   */
  public signInWithGoogle(): Observable<UserCredential> {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    const promise = signInWithPopup(auth, provider);
    return from(promise).pipe(catchError((error) => this.handleError(error)));
  }

  /**
   * Sign out the current user.
   * @returns An observable emitting void upon successful signout.
   */
  public signOut(): Observable<void> {
    const auth = getAuth();
    const promise = signOut(auth);
    return from(promise);
  }

  /**
   * Send a password reset email to the specified email address.
   * @param email User email address.
   * @returns A promise that resolves upon successful email sending.
   */
  public sendEmailForResetPassword(email: string): Observable<void> {
    const auth = getAuth();
    const promise = sendPasswordResetEmail(auth, email);
    console.log(email);
    console.log(promise);
    return from(promise);
  }

  /**
   * Handles Firebase authentication errors and maps them to appropriate error messages.
   * @param error Firebase error object.
   * @returns An observable that emits an error with a descriptive message.
   */
  private handleError(error: FirebaseError): Observable<never> {
    let errorMessage = "An unknown error occurred";
    if (error.code) {
      switch (error.code) {
        case "auth/invalid-credential":
          errorMessage = "Credenciales no válidas. Por favor, inténtelo de nuevo.";
          break;
        case "auth/user-not-found":
          errorMessage = "No se ha encontrado ningún usuario con la dirección de correo electrónico ingresada.";
          break;
        case "auth/wrong-password":
          errorMessage = "Contraseña incorrecta. Por favor, inténtelo de nuevo.";
          break;
        case "auth/email-already-in-use":
          errorMessage = "Este correo electrónico ya está en uso.";
          break;
        case "auth/weak-password":
          errorMessage = "La contraseña es demasiado débil.";
          break;
        case "auth/popup-closed-by-user":
          errorMessage = "La ventana emergente ha sido cerrada por el usuario antes de finalizar la operación.";
          break;
        case "auth/cancelled-popup-request":
          errorMessage = "La solicitud de popup ha sido cancelada.";
          break;
        case "auth/popup-blocked":
          errorMessage = "La ventana emergente ha sido bloqueada por el navegador.";
          break;
        default:
          errorMessage = error.message;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
