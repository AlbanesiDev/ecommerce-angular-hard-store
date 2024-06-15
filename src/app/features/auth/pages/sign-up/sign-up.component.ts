/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { PasswordModule } from "primeng/password";
import { MessageService } from "primeng/api";
import { InputTextModule } from "primeng/inputtext";
import { AutoFocusModule } from "primeng/autofocus";

import { AuthService } from "../../services/auth.service";

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
export default class SignUpComponent {
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
   * @todo Create a custom password validator and replace this variable.
   */
  public validator: boolean = false;

  /**s
   * The form group that holds the registration form controls and validators.
   */
  public registerForm: FormGroup<any> = this.formBuilder.group({
    email: this.formBuilder.control("", {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: this.formBuilder.control("", {
      validators: [Validators.required, Validators.minLength(8)],
      nonNullable: true,
    }),
  });

  /**
   * Handles the registration action when the user clicks the register button.
   */
  public registerWithEmailClick(): void {
    if (this.registerForm.valid) {
      this.authService
        .signUpWithEmail(this.registerForm.value as { nickname: string; email: string; password: string })
        .subscribe({
          next: () => {
            this.router.navigateByUrl("/perfil"),
              this.messageService.add({
                severity: "success",
                summary: "Succes",
                detail: `Successful registration!`,
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
      this.registerForm.markAllAsTouched();
    }
  }

  /**
   * Handles the Google login action when the user clicks the Google login button.
   */
  public loginWithGoogleClick(): void {
    this.authService
      .signInWithGoogle()
      .then(() => this.router.navigateByUrl("/perfil"))
      .catch((err) => {
        console.error(err);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: `Error: ${err}`,
        });
      });
  }
}
