import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    RouterModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <div class="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue to VetCare</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" color="primary">
            <mat-label>Username</mat-label>
            <input matInput formControlName="username" placeholder="Enter your username">
            <mat-icon matSuffix>person</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" color="primary">
            <mat-label>Password</mat-label>
            <input matInput 
                   [type]="hidePassword ? 'password' : 'text'" 
                   formControlName="password"
                   placeholder="Enter your password">
            <mat-icon matSuffix (click)="hidePassword = !hidePassword" style="cursor: pointer">
              {{hidePassword ? 'visibility_off' : 'visibility'}}
            </mat-icon>
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit" [disabled]="loginForm.invalid">
            Sign In
          </button>

          <div class="register-link">
            <p>Don't have an account? <a routerLink="/register">Sign up</a></p>
          </div>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #00838f 0%, #006064 100%);
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 2rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.95);
    }

    .login-header {
      text-align: center;
      margin-bottom: 2rem;

      h1 {
        color: #00838f;
        margin: 0;
        font-size: 2rem;
        font-weight: 600;
      }

      p {
        color: #5f6368;
        margin: 0.5rem 0 0;
      }
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      mat-form-field {
        width: 100%;

        ::ng-deep .mat-form-field-wrapper {
          background: white;
          border-radius: 4px;
        }

        ::ng-deep .mat-form-field-outline {
          color: rgba(0, 131, 143, 0.5);
        }

        ::ng-deep .mat-form-field-label {
          color: #00838f;
        }

        input {
          color: #333;
          &::placeholder {
            color: #999;
          }
        }

        mat-icon {
          color: #00838f;
        }
      }

      button {
        margin-top: 1rem;
        padding: 0.75rem;
        font-size: 1rem;
        background-color: #00838f;
        color: white;
        
        &:hover:not([disabled]) {
          background-color: #006064;
        }

        &[disabled] {
          background-color: rgba(0, 131, 143, 0.5);
        }
      }
    }

    .register-link {
      text-align: center;
      margin-top: 1.5rem;

      p {
        color: #5f6368;
        margin: 0;

        a {
          color: #00838f;
          text-decoration: none;
          font-weight: 500;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Login failed:', error);
        }
      });
    }
  }
} 