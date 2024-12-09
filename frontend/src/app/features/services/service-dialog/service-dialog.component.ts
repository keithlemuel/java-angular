import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { VetService } from '../../../models/vet-service';

@Component({
  selector: 'app-service-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatGridListModule,
    MatIconModule
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>{{data ? 'Edit' : 'Add'}} Service</h2>
      <form [formGroup]="serviceForm" (ngSubmit)="onSubmit()">
        <mat-dialog-content>
          <mat-form-field appearance="fill">
            <mat-label>Name</mat-label>
            <input matInput formControlName="name" placeholder="Service name">
            <mat-error *ngIf="serviceForm.get('name')?.hasError('required')">
              Name is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" placeholder="Service description"></textarea>
            <mat-error *ngIf="serviceForm.get('description')?.hasError('required')">
              Description is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Duration (minutes)</mat-label>
            <input matInput type="number" formControlName="duration" placeholder="Duration in minutes">
            <mat-error *ngIf="serviceForm.get('duration')?.hasError('required')">
              Duration is required
            </mat-error>
            <mat-error *ngIf="serviceForm.get('duration')?.hasError('min')">
              Duration must be greater than 0
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Price</mat-label>
            <input matInput type="number" formControlName="price" placeholder="Price in dollars">
            <mat-error *ngIf="serviceForm.get('price')?.hasError('required')">
              Price is required
            </mat-error>
            <mat-error *ngIf="serviceForm.get('price')?.hasError('min')">
              Price must be greater than 0
            </mat-error>
          </mat-form-field>

          <div class="icon-selection">
            <label>Select Icon</label>
            <mat-grid-list cols="6" rowHeight="50px">
              <mat-grid-tile *ngFor="let icon of availableIcons" 
                [class.selected]="serviceForm.get('icon')?.value === icon"
                (click)="selectIcon(icon)">
                <mat-icon>{{icon}}</mat-icon>
              </mat-grid-tile>
            </mat-grid-list>
          </div>

          <div class="color-selection">
            <label>Select Background Color</label>
            <mat-grid-list cols="6" rowHeight="50px">
              <mat-grid-tile *ngFor="let color of availableColors" 
                [style.background-color]="color"
                [class.selected]="serviceForm.get('iconBg')?.value === color"
                (click)="selectColor(color)">
              </mat-grid-tile>
            </mat-grid-list>
          </div>

          <div class="icon-preview">
            <label>Preview</label>
            <div class="preview-icon" [style.background-color]="serviceForm.get('iconBg')?.value || '#000'">
              <mat-icon>{{serviceForm.get('icon')?.value || 'help'}}</mat-icon>
            </div>
          </div>
        </mat-dialog-content>

        <mat-dialog-actions align="end">
          <button mat-button mat-dialog-close>Cancel</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!serviceForm.valid">
            {{data ? 'Update' : 'Add'}}
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

    .icon-selection, .color-selection {
      margin: 16px 0;

      label {
        display: block;
        margin-bottom: 8px;
        color: rgba(255, 255, 255, 0.7);
      }
    }

    mat-grid-tile {
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.2s ease;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }

      &.selected {
        background-color: rgba(33, 150, 243, 0.3);
        border: 2px solid #2196f3;
      }
    }

    .icon-preview {
      margin: 24px 0;
      text-align: center;

      label {
        display: block;
        margin-bottom: 12px;
        color: rgba(255, 255, 255, 0.7);
      }

      .preview-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        
        mat-icon {
          font-size: 24px;
          width: 24px;
          height: 24px;
          color: white;
        }
      }
    }
  `]
})
export class ServiceDialogComponent implements OnInit {
  serviceForm: FormGroup;

  availableIcons = [
    'pets', 'healing', 'vaccines', 'medication', 'medical_services',
    'health_and_safety', 'monitor_heart', 'psychology', 'science',
    'sanitizer', 'cleaning_services', 'cut', 'water_drop', 'scale',
    'bloodtype', 'medication_liquid', 'view_timeline', 'calendar_month'
  ];

  availableColors = [
    '#4caf50', '#2196f3', '#9c27b0', '#ff5722', '#607d8b',
    '#ff9800', '#795548', '#009688', '#673ab7', '#3f51b5',
    '#e91e63', '#f44336', '#00bcd4', '#8bc34a', '#ffeb3b'
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ServiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VetService | null
  ) {
    this.serviceForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(0)]],
      icon: ['pets', Validators.required],
      iconBg: ['#4caf50', Validators.required]
    });
  }

  ngOnInit() {
    if (this.data) {
      this.serviceForm.patchValue(this.data);
    }
  }

  onSubmit() {
    if (this.serviceForm.valid) {
      const service = {
        ...this.serviceForm.value,
        id: this.data?.id
      };
      this.dialogRef.close(service);
    }
  }

  selectIcon(icon: string) {
    this.serviceForm.patchValue({ icon });
  }

  selectColor(color: string) {
    this.serviceForm.patchValue({ iconBg: color });
  }
} 