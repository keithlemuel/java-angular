import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vaccinations',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatTableModule,
    MatChipsModule
  ],
  template: `
    <div class="vaccinations-container">
      <div class="header">
        <h1>Vaccination Management</h1>
        <button mat-raised-button color="primary">
          <mat-icon>add</mat-icon>
          New Vaccination Record
        </button>
      </div>

      <mat-card class="alerts-card">
        <mat-card-header>
          <mat-icon mat-card-avatar>warning</mat-icon>
          <mat-card-title>Due Vaccinations</mat-card-title>
          <mat-card-subtitle>Upcoming and overdue vaccinations</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="alert-grid">
            <mat-card class="alert-item overdue">
              <div class="alert-icon">
                <mat-icon>priority_high</mat-icon>
              </div>
              <div class="alert-content">
                <h3>Max (Golden Retriever)</h3>
                <p>Rabies Vaccine Overdue</p>
                <small>Due date: 01/15/2024</small>
              </div>
              <button mat-stroked-button color="warn">Schedule Now</button>
            </mat-card>

            <mat-card class="alert-item upcoming">
              <div class="alert-icon">
                <mat-icon>schedule</mat-icon>
              </div>
              <div class="alert-content">
                <h3>Luna (Cat)</h3>
                <p>FVRCP Vaccine Due Soon</p>
                <small>Due date: 02/28/2024</small>
              </div>
              <button mat-stroked-button color="primary">Schedule Now</button>
            </mat-card>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="records-card">
        <mat-tab-group>
          <mat-tab label="Recent Vaccinations">
            <table mat-table [dataSource]="[]" class="records-table">
              <ng-container matColumnDef="pet">
                <th mat-header-cell *matHeaderCellDef>Pet</th>
                <td mat-cell *matCellDef="let element">
                  <div class="pet-info">
                    <span class="pet-name">{{element?.pet}}</span>
                    <span class="pet-breed">{{element?.breed}}</span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="vaccine">
                <th mat-header-cell *matHeaderCellDef>Vaccine</th>
                <td mat-cell *matCellDef="let element">{{element?.vaccine}}</td>
              </ng-container>

              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef>Date</th>
                <td mat-cell *matCellDef="let element">{{element?.date}}</td>
              </ng-container>

              <ng-container matColumnDef="nextDue">
                <th mat-header-cell *matHeaderCellDef>Next Due</th>
                <td mat-cell *matCellDef="let element">{{element?.nextDue}}</td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let element">
                  <mat-chip [color]="element?.status === 'Complete' ? 'primary' : 'warn'">
                    {{element?.status}}
                  </mat-chip>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let element">
                  <button mat-icon-button color="primary" matTooltip="View Details">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button color="accent" matTooltip="Edit Record">
                    <mat-icon>edit</mat-icon>
                  </button>
                </td>
              </ng-container>
            </table>
          </mat-tab>

          <mat-tab label="Vaccination Schedule">
            <div class="schedule-grid">
              <!-- Schedule content here -->
            </div>
          </mat-tab>
        </mat-tab-group>
      </mat-card>
    </div>
  `,
  styles: [`
    .vaccinations-container {
      padding: 24px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      h1 {
        margin: 0;
        color: #00838f;
        font-size: 24px;
      }

      button {
        mat-icon {
          margin-right: 8px;
        }
      }
    }

    .alerts-card {
      margin-bottom: 24px;

      mat-card-header {
        margin-bottom: 16px;

        mat-icon {
          color: #f44336;
        }
      }
    }

    .alert-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
    }

    .alert-item {
      display: flex;
      align-items: center;
      padding: 16px;

      &.overdue {
        border-left: 4px solid #f44336;
        .alert-icon mat-icon {
          color: #f44336;
        }
      }

      &.upcoming {
        border-left: 4px solid #ff9800;
        .alert-icon mat-icon {
          color: #ff9800;
        }
      }

      .alert-icon {
        margin-right: 16px;
      }

      .alert-content {
        flex: 1;

        h3 {
          margin: 0;
          color: #1976d2;
        }

        p {
          margin: 4px 0;
          color: #5f6368;
        }

        small {
          color: #9e9e9e;
        }
      }
    }

    .records-card {
      .records-table {
        width: 100%;
        margin-top: 16px;

        .pet-info {
          display: flex;
          flex-direction: column;

          .pet-name {
            font-weight: 500;
            color: #1976d2;
          }

          .pet-breed {
            font-size: 12px;
            color: #5f6368;
          }
        }

        th.mat-header-cell {
          color: #1976d2;
          font-weight: 500;
        }

        td.mat-cell {
          padding: 16px 8px;
        }
      }
    }

    .schedule-grid {
      padding: 16px;
    }
  `]
})
export class VaccinationsComponent {} 