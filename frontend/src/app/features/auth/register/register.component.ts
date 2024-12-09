import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    RouterModule,
    MatSnackBarModule
  ],
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <div class="register-header">
          <h1>Create Account</h1>
          <p>Sign up to get started with VetCare</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>First Name</mat-label>
              <input matInput formControlName="firstName" placeholder="Enter your first name">
              <mat-error *ngIf="registerForm.get('firstName')?.hasError('required')">
                First name is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Last Name</mat-label>
              <input matInput formControlName="lastName" placeholder="Enter your last name">
              <mat-error *ngIf="registerForm.get('lastName')?.hasError('required')">
                Last name is required
              </mat-error>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline">
            <mat-label>Username</mat-label>
            <input matInput formControlName="username" placeholder="Choose a username">
            <mat-error *ngIf="registerForm.get('username')?.hasError('required')">
              Username is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" placeholder="Enter your email" type="email">
            <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
              Email is required
            </mat-error>
            <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
              Please enter a valid email address
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Phone Number</mat-label>
            <input matInput formControlName="phoneNumber" placeholder="Enter your phone number">
            <mat-error *ngIf="registerForm.get('phoneNumber')?.hasError('required')">
              Phone number is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Address</mat-label>
            <input matInput formControlName="address" placeholder="Enter your address">
            <mat-error *ngIf="registerForm.get('address')?.hasError('required')">
              Address is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Password</mat-label>
            <input matInput [type]="hidePassword ? 'password' : 'text'" 
                   formControlName="password" placeholder="Choose a password">
            <mat-icon matSuffix (click)="hidePassword = !hidePassword">
              {{hidePassword ? 'visibility_off' : 'visibility'}}
            </mat-icon>
            <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
              Password is required
            </mat-error>
            <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
              Password must be at least 6 characters
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Role</mat-label>
            <mat-select formControlName="role">
              <mat-option value="user">Pet Owner</mat-option>
              <mat-option value="vet">Veterinarian</mat-option>
            </mat-select>
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit" 
                  [disabled]="registerForm.invalid">
            Sign Up
          </button>

          <div class="login-link">
            <p>Already have an account? <a routerLink="/login">Sign in</a></p>
          </div>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #00838f 0%, #006064 100%);
      padding: 20px;
    }

    .register-card {
      width: 100%;
      max-width: 500px;
      padding: 2rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.98);
    }

    .register-header {
      text-align: center;
      margin-bottom: 2rem;

      h1 {
        color: #00838f;
        margin: 0;
        font-size: 2rem;
        font-weight: 600;
      }

      p {
        color: #424242;
        margin: 0.5rem 0 0;
        font-size: 1.1rem;
      }
    }

    .form-row {
      display: flex;
      gap: 1rem;
      
      mat-form-field {
        flex: 1;
      }
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      mat-form-field {
        width: 100%;

        ::ng-deep {
          .mat-input-element {
            color: #000000 !important;
          }

          .mat-select-value-text {
            color: #000000 !important;
          }

          .mat-form-field-label {
            color: rgba(0, 0, 0, 0.7) !important;
          }

          .mat-form-field-outline {
            color: rgba(0, 0, 0, 0.3);
          }

          input::placeholder {
            color: rgba(0, 0, 0, 0.6);
          }

          .mat-select-value {
            color: rgba(0, 0, 0, 0.8);
          }

          .mat-select-placeholder {
            color: rgba(0, 0, 0, 0.6);
          }
        }
      }

      button {
        margin-top: 1rem;
        padding: 0.75rem;
        font-size: 1.1rem;
        font-weight: 500;
        background-color: #00838f;
        color: white;
        transition: background-color 0.3s ease;

        &:hover:not([disabled]) {
          background-color: #006064;
        }

        &[disabled] {
          background-color: rgba(0, 131, 143, 0.6);
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }

    .login-link {
      text-align: center;
      margin-top: 1.5rem;

      p {
        color: #424242;
        margin: 0;
        font-size: 1rem;

        a {
          color: #00838f;
          text-decoration: none;
          font-weight: 500;

          &:hover {
            text-decoration: underline;
            color: #006064;
          }
        }
      }
    }

    ::ng-deep {
      .mat-form-field-appearance-outline .mat-form-field-outline {
        color: rgba(0, 0, 0, 0.3);
      }

      .mat-form-field-appearance-outline.mat-focused .mat-form-field-outline {
        color: #00838f;
      }

      .mat-form-field-appearance-outline .mat-form-field-outline-thick {
        color: #00838f;
      }

      .mat-form-field-label {
        color: rgba(0, 0, 0, 0.7) !important;
      }

      .mat-select-arrow {
        color: rgba(0, 0, 0, 0.7);
      }

      .mat-mdc-input-element {
        color: #000000 !important;
      }
      
      .mdc-text-field--filled {
        .mdc-text-field__input {
          color: #000000 !important;
        }
      }

      .mat-mdc-select-value-text {
        color: #000000 !important;
      }

      .mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input {
        color: #000000 !important;
      }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['user', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
      const registrationData = {
        username: formValue.username,
        email: formValue.email,
        password: formValue.password,
        roles: formValue.role === 'vet' ? ['ROLE_VET'] : [],
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        phoneNumber: formValue.phoneNumber,
        address: formValue.address
      };

      console.log('Sending registration data:', registrationData);

      this.authService.register(registrationData).subscribe({
        next: (response: string) => {
          this.snackBar.open(response || 'Registration successful! Please login.', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (error) => {
          console.error('Registration error:', error);
          const errorMessage = error.error || 'Registration failed. Please try again.';
          this.snackBar.open(errorMessage, 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
} 