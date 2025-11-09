import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationComponent {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  hidePassword = signal<boolean>(true);
  registrationForm: FormGroup;

  // Regex patterns
  private readonly EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private readonly USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9]*$/;
  private readonly PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)\S+$/;

  constructor() {
    this.registrationForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(this.EMAIL_REGEX),
        ],
      ],
      username: [
        '',
        [
          Validators.required,
          Validators.pattern(this.USERNAME_REGEX),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(this.PASSWORD_REGEX),
        ],
      ],
    });
  }

  getEmailError(): string {
    const emailControl = this.registrationForm.get('email');
    if (emailControl?.hasError('required')) {
      return 'Email is required';
    }
    if (emailControl?.hasError('pattern')) {
      return 'Please enter a valid email address';
    }
    return '';
  }

  getUsernameError(): string {
    const usernameControl = this.registrationForm.get('username');
    if (usernameControl?.hasError('required')) {
      return 'Username is required';
    }
    if (usernameControl?.hasError('pattern')) {
      return 'Username must contain only English characters and numbers, and cannot start with a number';
    }
    return '';
  }

  getPasswordError(): string {
    const passwordControl = this.registrationForm.get('password');
    if (passwordControl?.hasError('required')) {
      return 'Password is required';
    }
    if (passwordControl?.hasError('pattern')) {
      return 'Password must contain at least 1 uppercase letter, 1 number, and no spaces';
    }
    return '';
  }

  public get isFormTouched(): boolean {
    return this.registrationForm.touched;
  }

  togglePasswordVisibility(): void {
    this.hidePassword.update(value => !value);
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {

      this.snackBar.open('Registration successful!', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['success-snackbar'],
      });

      this.registrationForm.reset();

      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.registrationForm.controls).forEach(key => {
        this.registrationForm.get(key)?.markAsTouched();
      });

      this.snackBar.open('Please fix the errors in the form', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
    }
  }

  onReset(): void {
    this.registrationForm.reset();
  }
}
