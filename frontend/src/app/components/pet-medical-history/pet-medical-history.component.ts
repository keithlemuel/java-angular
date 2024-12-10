import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MedicalHistoryService } from '../../services/medical-history.service';
import { MedicalHistoryDialogComponent } from '../medical-history/medical-history-dialog/medical-history-dialog.component';
import { MedicalHistoryListComponent } from '../medical-history/medical-history-list.component';

@Component({
  selector: 'app-pet-medical-history',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MedicalHistoryListComponent
  ],
  template: `
    <div class="medical-history-container">
      <mat-tab-group class="custom-tabs">
        <mat-tab label="All Medical History">
          <app-medical-history-list [petId]="petId"></app-medical-history-list>
        </mat-tab>
        <mat-tab label="Appointment History">
          <div class="appointment-history" *ngIf="appointmentHistories.length">
            <mat-card *ngFor="let history of appointmentHistories">
              <mat-card-header>
                <mat-card-title>
                  {{history.condition}}
                  <span class="appointment-date">
                    (Appointment: {{history.appointment?.dateTime | date}})
                  </span>
                </mat-card-title>
                <mat-card-subtitle>{{history.date | date}}</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <p><strong>Treatment:</strong> {{history.treatment}}</p>
                <p *ngIf="history.notes"><strong>Notes:</strong> {{history.notes}}</p>
              </mat-card-content>
            </mat-card>
          </div>
          <div class="no-records" *ngIf="!appointmentHistories.length">
            <p>No appointment-related medical records found.</p>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .medical-history-container {
      padding: 20px;
    }
    
    ::ng-deep .custom-tabs {
      .mat-mdc-tab-header {
        margin-bottom: 20px;
        border-bottom: 1px solid #e0e0e0;
      }

      .mat-mdc-tab {
        min-width: 160px;
      }

      .mat-mdc-tab-label-container {
        background-color: white;
        border-radius: 8px 8px 0 0;
      }

      .mdc-tab {
        height: 48px;
        padding: 0 24px;
        
        &.mdc-tab--active {
          background-color: #e8f5f7;
          
          .mdc-tab__text-label {
            color: #00838f;
            font-weight: 500;
          }
        }

        .mdc-tab__text-label {
          font-size: 16px;
          letter-spacing: 0.5px;
          color: #616161;
        }
      }

      .mdc-tab-indicator--active {
        .mdc-tab-indicator__content {
          border-color: #00838f;
        }
      }
    }

    .appointment-history {
      padding: 20px;
      display: grid;
      gap: 16px;
    }

    .appointment-date {
      font-size: 14px;
      color: #666;
      margin-left: 8px;
    }

    .no-records {
      padding: 20px;
      text-align: center;
      color: #666;
    }
  `]
})
export class PetMedicalHistoryComponent implements OnInit {
  petId!: number;
  appointmentHistories: any[] = [];

  constructor(
    private medicalHistoryService: MedicalHistoryService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.petId = +params['id'];
      if (this.petId) {
        this.loadAppointmentHistories();
      }
    });
  }

  loadAppointmentHistories() {
    this.medicalHistoryService.getMedicalHistoriesByPetId(this.petId)
      .subscribe(histories => {
        this.appointmentHistories = histories.filter(h => h.appointment);
      });
  }
} 