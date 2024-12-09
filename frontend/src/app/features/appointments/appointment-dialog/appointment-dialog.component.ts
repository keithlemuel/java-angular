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
import { VetServiceService } from '../../../services/vet-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Appointment } from '../../../models/appointment';

@Component({
  selector: 'app-appointment-dialog',
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
      <h2 mat-dialog-title>{{data.appointment ? 'Edit' : 'Schedule'}} Appointment</h2>
      <form [formGroup]="appointmentForm" (ngSubmit)="onSubmit()">
        <mat-dialog-content>
          <mat-form-field appearance="fill" *ngIf="data.isVet">
            <mat-label>Pet</mat-label>
            <mat-select formControlName="petId">
              <mat-option *ngFor="let pet of pets" [value]="pet.id">
                {{pet.name}} (Owner: {{pet.owner.firstName}} {{pet.owner.lastName}})
              </mat-option>
            </mat-select>
            <mat-error *ngIf="appointmentForm.get('petId')?.hasError('required')">
              Pet is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="fill" *ngIf="!data.isVet">
            <mat-label>Pet</mat-label>
            <mat-select formControlName="petId">
              <mat-option *ngFor="let pet of userPets" [value]="pet.id">
                {{pet.name}} ({{pet.species}})
              </mat-option>
            </mat-select>
            <mat-error *ngIf="appointmentForm.get('petId')?.hasError('required')">
              Pet is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Service</mat-label>
            <mat-select formControlName="serviceId">
              <mat-option *ngFor="let service of services" [value]="service.id">
                {{service.name}} ({{formatDuration(service.duration)}})
              </mat-option>
            </mat-select>
            <mat-error *ngIf="appointmentForm.get('serviceId')?.hasError('required')">
              Service is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Date</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="date">
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            <mat-error *ngIf="appointmentForm.get('date')?.hasError('required')">
              Date is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Time</mat-label>
            <mat-select formControlName="time">
              <mat-option *ngFor="let time of availableTimes" [value]="time">
                {{time}}:00
              </mat-option>
            </mat-select>
            <mat-error *ngIf="appointmentForm.get('time')?.hasError('required')">
              Time is required
            </mat-error>
          </mat-form-field>
        </mat-dialog-content>

        <mat-dialog-actions align="end">
          <button mat-button type="button" (click)="onCancel()">Cancel</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!appointmentForm.valid">
            {{data.appointment ? 'Update' : 'Schedule'}}
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
      color: #00838f;
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
export class AppointmentDialogComponent implements OnInit {
  appointmentForm: FormGroup;
  pets: any[] = [];
  userPets: any[] = [];
  services: any[] = [];
  availableTimes: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      appointment?: any;
      isVet: boolean;
    },
    private petService: PetService,
    private vetService: VetServiceService,
    private snackBar: MatSnackBar
  ) {
    this.appointmentForm = this.fb.group({
      petId: ['', Validators.required],
      serviceId: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadServices();
    
    if (this.data.isVet) {
      this.loadAllPets();
    } else {
      this.loadUserPets();
    }

    if (this.data.appointment) {
      const appointmentDate = new Date(this.data.appointment.dateTime);
      this.appointmentForm.patchValue({
        petId: this.data.appointment.pet.id,
        serviceId: this.data.appointment.service.id,
        date: appointmentDate,
        time: appointmentDate.getHours()
      });
    }
  }

  loadAllPets() {
    this.petService.getAllPets().subscribe({
      next: (pets) => {
        this.pets = pets;
      },
      error: (error) => {
        console.error('Error loading pets:', error);
        this.showError('Failed to load pets');
      }
    });
  }

  loadUserPets() {
    this.petService.getAllPets().subscribe({
      next: (pets) => {
        this.userPets = pets;
      },
      error: (error) => {
        console.error('Error loading your pets:', error);
        this.showError('Failed to load your pets');
      }
    });
  }

  loadServices() {
    this.vetService.getAllServices().subscribe({
      next: (services) => {
        this.services = services;
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.showError('Failed to load services');
      }
    });
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}m` : ''}`;
    }
    return `${remainingMinutes}m`;
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      const formValue = this.appointmentForm.value;
      const date = formValue.date;
      const time = formValue.time;
      
      // Format the date properly, adding 1 to month since getMonth() is 0-based
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      // Combine date and time directly
      const dateTime = `${dateStr}T${time}:00:00`;
      
      const appointment: Appointment = {
        id: this.data.appointment?.id,
        pet: {
          id: formValue.petId,
          name: '',
          species: '',
          breed: '',
          owner: { id: 0, firstName: '', lastName: '' }
        },
        service: {
          id: formValue.serviceId,
          name: '',
          duration: 0,
          price: 0
        },
        dateTime: dateTime,
        status: this.data.appointment?.status || 'SCHEDULED'
      };

      this.dialogRef.close(appointment);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}