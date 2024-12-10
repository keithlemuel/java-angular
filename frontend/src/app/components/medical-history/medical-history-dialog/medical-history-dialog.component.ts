import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-medical-history-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>{{ data.medicalHistory ? 'Edit' : 'Add' }} Medical History</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <mat-dialog-content>
          <mat-form-field appearance="fill">
            <mat-label>Condition</mat-label>
            <input matInput formControlName="condition" required>
            <mat-error *ngIf="form.get('condition')?.hasError('required')">
              Condition is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Treatment</mat-label>
            <textarea matInput formControlName="treatment" required rows="3"></textarea>
            <mat-error *ngIf="form.get('treatment')?.hasError('required')">
              Treatment is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Date</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="date" required>
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            <mat-error *ngIf="form.get('date')?.hasError('required')">
              Date is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Notes</mat-label>
            <textarea matInput formControlName="notes" rows="3"></textarea>
          </mat-form-field>
        </mat-dialog-content>

        <mat-dialog-actions align="end">
          <button mat-button (click)="onCancel()">Cancel</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!form.valid">
            {{ data.medicalHistory ? 'Update' : 'Add' }}
          </button>
        </mat-dialog-actions>
      </form>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 20px;
      max-width: 500px;
      overflow: hidden;
    }

    h2 {
      margin: 0;
      color: #00838f !important;
      font-size: 24px;
    }

    mat-dialog-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin: 20px 0;
      min-width: 400px;
      overflow: hidden !important;
      padding: 0 !important;
    }

    mat-form-field {
      width: 100%;
    }

    ::ng-deep {
      .mat-mdc-dialog-content {
        max-height: none !important;
        overflow: hidden !important;
        padding: 0 !important;
      }
      
      .mat-mdc-form-field {
        .mdc-text-field--filled {
          background-color: #f5f5f5;
          border-radius: 4px 4px 0 0;
        }

        .mat-mdc-form-field-focus-overlay {
          background-color: rgba(0, 0, 0, 0.04);
        }

        .mdc-floating-label, .mat-mdc-select-value, input {
          color: rgba(0, 0, 0, 0.87) !important;
        }

        .mdc-text-field--filled:not(.mdc-text-field--disabled) {
          background-color: #f5f5f5;
        }

        .mat-mdc-input-element {
          color: rgba(0, 0, 0, 0.87) !important;
        }

        input::placeholder {
          color: rgba(0, 0, 0, 0.6);
        }

        .mat-mdc-select-arrow {
          color: rgba(0, 0, 0, 0.54);
        }
      }
    }

    mat-dialog-actions {
      margin: 20px -24px -24px;
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;
      
      button {
        margin-left: 8px;
      }
    }
  `]
})
export class MedicalHistoryDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MedicalHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      medicalHistory?: any,
      petId: number,
      appointmentId?: number
    }
  ) {
    this.form = this.fb.group({
      condition: [data.medicalHistory?.condition || '', Validators.required],
      treatment: [data.medicalHistory?.treatment || '', Validators.required],
      date: [data.medicalHistory?.date ? new Date(data.medicalHistory.date) : new Date(), Validators.required],
      notes: [data.medicalHistory?.notes || '']
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      const medicalHistory = {
        ...formValue,
        date: formValue.date.toISOString().split('T')[0],
        pet: { id: this.data.petId },
        appointment: this.data.appointmentId ? { id: this.data.appointmentId } : null
      };
      this.dialogRef.close(medicalHistory);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
} 