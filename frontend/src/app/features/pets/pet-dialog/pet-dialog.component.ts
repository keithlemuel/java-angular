import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { OwnerService } from '../../../services/owner.service';
import { PetService } from '../../../services/pet.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pet-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>{{data.pet ? 'Edit' : 'Add'}} Pet</h2>
      <form [formGroup]="petForm" (ngSubmit)="onSubmit()">
        <mat-dialog-content>
          <mat-form-field appearance="fill">
            <mat-label>Name</mat-label>
            <input matInput formControlName="name" placeholder="Pet's name">
            <mat-error *ngIf="petForm.get('name')?.hasError('required')">
              Name is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Species</mat-label>
            <input matInput formControlName="species" placeholder="e.g., Dog, Cat">
            <mat-error *ngIf="petForm.get('species')?.hasError('required')">
              Species is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Breed</mat-label>
            <input matInput formControlName="breed" placeholder="Pet's breed">
            <mat-error *ngIf="petForm.get('breed')?.hasError('required')">
              Breed is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Age</mat-label>
            <input matInput type="number" formControlName="age" placeholder="Pet's age">
            <mat-error *ngIf="petForm.get('age')?.hasError('required')">
              Age is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="fill" *ngIf="data.isVet">
            <mat-label>Owner</mat-label>
            <mat-select formControlName="ownerId">
              <mat-option *ngFor="let owner of owners" [value]="owner.id">
                {{owner.firstName}} {{owner.lastName}}
              </mat-option>
            </mat-select>
            <mat-error *ngIf="petForm.get('ownerId')?.hasError('required')">
              Owner is required
            </mat-error>
          </mat-form-field>
        </mat-dialog-content>

        <mat-dialog-actions align="end">
          <button mat-button type="button" (click)="onCancel()">Cancel</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!petForm.valid">
            {{data.pet ? 'Update' : 'Add'}}
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

        .mat-mdc-select-value {
          color: black;
        }

        .mat-mdc-select-arrow {
          color: rgba(255, 255, 255, 0.7);
        }
      }
    }
  `]
})
export class PetDialogComponent implements OnInit {
  petForm: FormGroup;
  owners: any[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { pet: any; isVet: boolean },
    private petService: PetService,
    private ownerService: OwnerService,
    private snackBar: MatSnackBar
  ) {
    this.petForm = this.fb.group({
      name: ['', Validators.required],
      species: ['', Validators.required],
      breed: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      ownerId: [null]
    });

    if (data.isVet) {
      this.petForm.get('ownerId')?.setValidators(Validators.required);
    }
  }

  ngOnInit() {
    if (this.data.pet) {
      this.petForm.patchValue({
        name: this.data.pet.name,
        species: this.data.pet.species,
        breed: this.data.pet.breed,
        age: this.data.pet.age,
        ownerId: this.data.pet.owner?.id
      });
    }

    if (this.data.isVet) {
      this.loadOwners();
    }
  }

  loadOwners() {
    this.ownerService.getAllOwners().subscribe({
      next: (owners) => {
        this.owners = owners;
      },
      error: (error) => {
        console.error('Error loading owners:', error);
        this.showError('Failed to load owners');
      }
    });
  }

  onSubmit() {
    if (this.petForm.valid) {
      const formData = this.petForm.value;
      if (this.data.pet) {
        formData.id = this.data.pet.id;
      }
      
      if (formData.ownerId) {
        formData.owner = { id: formData.ownerId };
        delete formData.ownerId;
      }
      
      this.dialogRef.close(formData);
    }
  }

  onCancel() {
    this.dialogRef.close(null);
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }
} 