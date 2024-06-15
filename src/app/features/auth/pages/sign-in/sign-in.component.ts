/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { PasswordModule } from "primeng/password";
import { InputTextModule } from "primeng/inputtext";
import { AutoFocusModule } from "primeng/autofocus";

import { MessageService } from "primeng/api";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-sign-in",
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
  /**
   * Router injection for handling navigation.
   */
  public router: Router = inject(Router);

  /**
   * Form builder injection for handling form operations.
   */
  public formBuilder: FormBuilder = inject(FormBuilder);

  /**
   * AuthService injection for handling authentication operations.
   */
  public authService: AuthService = inject(AuthService);

  /**
   * MessageService injection for displaying messages to the user.
   */
  public messageService: MessageService = inject(MessageService);

  /**
   * The form group that holds the login form controls and validators.
   */
  public loginForm: FormGroup<any> = this.formBuilder.group({
    email: this.formBuilder.control("", {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: this.formBuilder.control("", {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  /**
   * Handles the login action when the user clicks the login button.
   */
  public loginWithEmailClick(): void {
    if (this.loginForm.valid) {
      this.authService.signInWithEmail(this.loginForm.value as { email: string; password: string }).subscribe({
        next: () => {
          this.router.navigateByUrl("/chat"),
            this.messageService.add({
              severity: "success",
              summary: "Succes",
              detail: `successful session!`,
              life: 5000,
            });
        },
        error: (err: any) => {
          console.log(err.message);
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: `${err.message}`,
            life: 5000,
          });
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  /**
   * Handles the Google login action when the user clicks the Google login button.
   */
  public loginWithGoogleClick(): void {
    this.authService.signInWithGoogle();
  }
}
