import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";

import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { PasswordModule } from "primeng/password";
import { InputTextModule } from "primeng/inputtext";
import { AutoFocusModule } from "primeng/autofocus";

import { signIn, signInWithGoogle } from "../../store/auth.actions";
import { SignForm } from "../../interfaces/auth.interface";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ButtonModule,
    DividerModule,
    PasswordModule,
    InputTextModule,
    AutoFocusModule,
  ],
  templateUrl: "./sign-in.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SignInComponent {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _store = inject(Store);

  public loginForm: FormGroup<SignForm> = this._formBuilder.group({
    email: this._formBuilder.control("", {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: this._formBuilder.control("", {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  public onLoginWithEmailClick(): void {
    if (this.loginForm.valid) {
      this._store.dispatch(signIn(this.loginForm.value as { email: string; password: string }));
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  public onGoogleSignInClick(): void {
    this._store.dispatch(signInWithGoogle());
  }
}
