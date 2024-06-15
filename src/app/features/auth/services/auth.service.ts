import { Injectable, inject, signal } from "@angular/core";
import {
  Auth,
  authState,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
} from "@angular/fire/auth";
import { Observable, from } from "rxjs";

/**
 * A service that provides authentication functionalities using Firebase.
 */
@Injectable({
  providedIn: "root",
})
export class AuthService {
  /**
   * Injects the Firebase Auth object for authentication operations.
   */
  private firebaseAuth: Auth = inject(Auth);

  /**
   * An signal indicating whether the user is authenticated.
   */
  public userAuth = signal<boolean>(false);

  /**
   *
   */
  public authState$ = authState(this.firebaseAuth);

  /**
   * Registers a new user with an email and password.
   * @param email The email address of the user.
   * @param password The password for the user's account.
   * @returns An observable that completes when the registration is finished.
   */
  public signUpWithEmail(credentials: { email: string; password: string }): Observable<UserCredential> {
    const promise = createUserWithEmailAndPassword(this.firebaseAuth, credentials.email, credentials.password);
    return from(promise);
  }

  /**
   * Signs in a user with an email and password.
   * @param email The email address of the user.
   * @param password The password for the user's account.
   * @returns An observable that completes when the sign-in is finished.
   */
  public signInWithEmail(credentials: { email: string; password: string }): Observable<UserCredential> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, credentials.email, credentials.password);
    return from(promise);
  }

  /**
   * Sign in the user with Google authentication.
   * @returns A Promise that resolves with a UserCredential.
   */
  public async signInWithGoogle(): Promise<UserCredential | void> {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    return signInWithPopup(auth, provider)
      .then(() => {
        this.userAuth.set(false);
      })
      .catch(() => {
        this.userAuth.set(false);
      });
  }

  /**
   * Signs out the current user.
   * @returns A promise that resolves when the sign-out is complete.
   */
  public async signOut(): Promise<void> {
    const auth = getAuth();
    return signOut(auth);
  }

  /**
   * Sends a password reset email to the specified email address.
   * @param email The email address to send the password reset email to.
   * @returns A Promise that resolves when the email is successfully sent.
   */
  public async sendPasswordResetEmail(email: string): Promise<void> {
    const auth = getAuth();
    return sendPasswordResetEmail(auth, email);
  }
}
