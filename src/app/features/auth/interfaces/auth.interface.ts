import { FormControl } from "@angular/forms";

export interface AuthState {
  userAuth: boolean;
  loading: boolean;
  error: unknown;
  forgotSuccess: boolean;
}

export interface SignForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

export interface PasswordRequirement {
  validator: string;
  message: string;
  valid: boolean;
}
