import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Owner } from '../../../models/owner';

@Component({
  selector: 'app-owner-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>{{data.owner ? 'Edit' : 'Add'}} Owner</h2>
      <form [formGroup]="ownerForm" (ngSubmit)="onSubmit()">
        <mat-dialog-content>
          <mat-form-field appearance="fill">
            <mat-label>First Name</mat-label>
            <input matInput formControlName="firstName" placeholder="Enter first name">
            <mat-error *ngIf="ownerForm.get('firstName')?.hasError('required')">
              First name is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Last Name</mat-label>
            <input matInput formControlName="lastName" placeholder="Enter last name">
            <mat-error *ngIf="ownerForm.get('lastName')?.hasError('required')">
              Last name is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Phone Number</mat-label>
            <input matInput formControlName="phoneNumber" placeholder="Enter phone number">
            <mat-error *ngIf="ownerForm.get('phoneNumber')?.hasError('required')">
              Phone number is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" placeholder="Enter email" type="email">
            <mat-error *ngIf="ownerForm.get('email')?.hasError('required')">
              Email is required
            </mat-error>
            <mat-error *ngIf="ownerForm.get('email')?.hasError('email')">
              Please enter a valid email
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Address</mat-label>
            <input matInput formControlName="address" placeholder="Enter address">
            <mat-error *ngIf="ownerForm.get('address')?.hasError('required')">
              Address is required
            </mat-error>
          </mat-form-field>
        </mat-dialog-content>

        <mat-dialog-actions align="end">
          <button mat-button type="button" (click)="onCancel()">Cancel</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="ownerForm.invalid">
            {{data.owner ? 'Update' : 'Add'}}
          </button>
        </mat-dialog-actions>
      </form>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 24px;
      background-color: #303030;
    }

    h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 500;
      color: white;
    }

    mat-dialog-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin: 20px 0;
      min-width: 400px;
    }

    mat-form-field {
      width: 100%;
    }

    ::ng-deep {
      .mat-mdc-form-field {
        .mdc-text-field--filled {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .mat-mdc-form-field-focus-overlay {
          background-color: rgba(255, 255, 255, 0.05);
        }

        .mdc-floating-label {
          color: rgba(255, 255, 255, 0.7);
        }

        .mdc-text-field--filled:not(.mdc-text-field--disabled) {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .mat-mdc-input-element {
          color: black !important;
        }

        input::placeholder {
          color: rgba(0, 0, 0, 0.6);
        }

        .mat-mdc-form-field-infix {
          color: black;
        }
      }
    }
  `]
})
export class OwnerDialogComponent {
  ownerForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { owner: Owner | null },
    private dialogRef: MatDialogRef<OwnerDialogComponent>,
    private fb: FormBuilder
  ) {
    this.ownerForm = this.fb.group({
      firstName: [data.owner?.firstName || '', Validators.required],
      lastName: [data.owner?.lastName || '', Validators.required],
      phoneNumber: [data.owner?.phoneNumber || '', Validators.required],
      email: [data.owner?.email || '', [Validators.required, Validators.email]],
      address: [data.owner?.address || '', Validators.required]
    });
  }

  onSubmit() {
    if (this.ownerForm.valid) {
      const owner = {
        ...this.ownerForm.value,
        id: this.data.owner?.id
      };
      this.dialogRef.close(owner);
    }
  }

  onCancel() {
    this.dialogRef.close(undefined);
  }
} 