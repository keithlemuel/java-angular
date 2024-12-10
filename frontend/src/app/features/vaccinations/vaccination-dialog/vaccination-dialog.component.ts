import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { PetService } from '../../../services/pet.service';
import { Pet } from '../../../models/pet';

@Component({
  selector: 'app-vaccination-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>{{data.vaccination ? 'Edit' : 'Add'}} Vaccination Record</h2>
      <form [formGroup]="vaccinationForm" (ngSubmit)="onSubmit()">
        <mat-dialog-content>
          <mat-form-field appearance="fill">
            <mat-label>Vaccine Name</mat-label>
            <input matInput formControlName="name" placeholder="Enter vaccine name">
            <mat-error *ngIf="vaccinationForm.get('name')?.hasError('required')">
              Vaccine name is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="fill" *ngIf="data.isVet">
            <mat-label>Pet</mat-label>
            <mat-select formControlName="petId">
              <mat-option *ngFor="let pet of pets" [value]="pet.id">
                {{pet.name}} (Owner: {{pet.owner?.firstName}} {{pet.owner?.lastName}})
              </mat-option>
            </mat-select>
            <mat-error *ngIf="vaccinationForm.get('petId')?.hasError('required')">
              Pet is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Date Administered</mat-label>
            <input matInput [matDatepicker]="administeredPicker" formControlName="dateAdministered">
            <mat-datepicker-toggle matSuffix [for]="administeredPicker"></mat-datepicker-toggle>
            <mat-datepicker #administeredPicker></mat-datepicker>
            <mat-error *ngIf="vaccinationForm.get('dateAdministered')?.hasError('required')">
              Date administered is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Next Due Date</mat-label>
            <input matInput [matDatepicker]="duePicker" formControlName="nextDueDate">
            <mat-datepicker-toggle matSuffix [for]="duePicker"></mat-datepicker-toggle>
            <mat-datepicker #duePicker></mat-datepicker>
            <mat-error *ngIf="vaccinationForm.get('nextDueDate')?.hasError('required')">
              Next due date is required
            </mat-error>
          </mat-form-field>
        </mat-dialog-content>

        <mat-dialog-actions align="end">
          <button mat-button type="button" (click)="onCancel()">Cancel</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!vaccinationForm.valid">
            {{data.vaccination ? 'Update' : 'Add'}}
          </button>
        </mat-dialog-actions>
      </form>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 24px;
      background: white;
      border-radius: 8px;
    }

    h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 500;
      color: black;
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
  `]
})
export class VaccinationDialogComponent implements OnInit {
  vaccinationForm: FormGroup;
  pets: Pet[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<VaccinationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      vaccination?: any;
      isVet: boolean;
      petId?: number;
    },
    private petService: PetService
  ) {
    this.vaccinationForm = this.fb.group({
      name: ['', Validators.required],
      petId: [data.petId || '', Validators.required],
      dateAdministered: ['', Validators.required],
      nextDueDate: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.data.isVet) {
      this.loadPets();
    }

    if (this.data.vaccination) {
      this.vaccinationForm.patchValue({
        name: this.data.vaccination.name,
        petId: this.data.vaccination.pet.id,
        dateAdministered: new Date(this.data.vaccination.dateAdministered),
        nextDueDate: new Date(this.data.vaccination.nextDueDate)
      });
    }
  }

  loadPets() {
    this.petService.getAllPets().subscribe({
      next: (pets) => {
        this.pets = pets;
      },
      error: (error) => console.error('Error loading pets:', error)
    });
  }

  onSubmit() {
    if (this.vaccinationForm.valid) {
      const formValue = this.vaccinationForm.value;
      const dateAdministered = formValue.dateAdministered;
      const nextDueDate = formValue.nextDueDate;
      
      // Format the dates properly
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const formData = {
        id: this.data.vaccination?.id,
        name: formValue.name,
        dateAdministered: formatDate(dateAdministered),
        nextDueDate: formatDate(nextDueDate),
        pet: { id: formValue.petId }
      };

      this.dialogRef.close(formData);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
} 