import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ChangeDetectionStrategy, Component, OnInit, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";

import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { PasswordModule } from "primeng/password";
import { InputTextModule } from "primeng/inputtext";
import { AutoFocusModule } from "primeng/autofocus";

import { signInWithGoogle, signUp } from "../../store/auth.actions";
import { PasswordRequirement, SignForm } from "../../interfaces/auth.interface";

@Component({
  selector: "app-sign-up",
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
  templateUrl: "./sign-up.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SignUpComponent implements OnInit {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _store = inject(Store);

  public passwordRequirements: PasswordRequirement[] = [
    { validator: "hasMinLength", message: "Minimo 8 caracteres", valid: false },
    { validator: "hasUppercase", message: "Necesita al menos una mayúscula", valid: false },
    { validator: "hasLowercase", message: "Necesita al menos una minúscula", valid: false },
    { validator: "hasNumber", message: "Necesita al menos un número", valid: false },
  ];

  public registerForm: FormGroup<SignForm> = this._formBuilder.group({
    email: this._formBuilder.control("", {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: this._formBuilder.control("", {
      validators: [Validators.required, Validators.minLength(8)],
      nonNullable: true,
    }),
  });

  ngOnInit(): void {
    this.listenToPasswordChanges();
  }

  private updatePasswordRequirements(value: string): void {
    this.passwordRequirements.forEach((req) => {
      switch (req.validator) {
        case "hasMinLength":
          req["valid"] = value.length >= 8;
          break;
        case "hasUppercase":
          req["valid"] = /[A-Z]/.test(value);
          break;
        case "hasLowercase":
          req["valid"] = /[a-z]/.test(value);
          break;
        case "hasNumber":
          req["valid"] = /[0-9]/.test(value);
          break;
      }
    });
  }

  private listenToPasswordChanges(): void {
    this.registerForm.get("password")!.valueChanges.subscribe((value) => {
      this.updatePasswordRequirements(value);
    });
  }

  public onRegisterWithEmailClick(): void {
    if (this.registerForm.valid) {
      this._store.dispatch(signUp(this.registerForm.value as { email: string; password: string }));
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  public onSignInWithGoogleClick(): void {
    this._store.dispatch(signInWithGoogle());
  }
}
