import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="dashboard-container">
      <div class="stats-cards">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon">
              <mat-icon>pets</mat-icon>
            </div>
            <div class="stat-info">
              <h3>Total Pets</h3>
              <p class="stat-number">150</p>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon">
              <mat-icon>event</mat-icon>
            </div>
            <div class="stat-info">
              <h3>Today's Appointments</h3>
              <p class="stat-number">12</p>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon">
              <mat-icon>vaccines</mat-icon>
            </div>
            <div class="stat-info">
              <h3>Pending Vaccinations</h3>
              <p class="stat-number">8</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="action-cards">
        <mat-card class="quick-action-card">
          <mat-card-header>
            <mat-card-title>Quick Actions</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <button mat-raised-button color="primary">
              <mat-icon>add</mat-icon>
              New Appointment
            </button>
            <button mat-raised-button color="accent">
              <mat-icon>person_add</mat-icon>
              Register Pet
            </button>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
    }

    .stats-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      margin-bottom: 24px;
    }

    .stat-card {
      mat-card-content {
        display: flex;
        align-items: center;
        padding: 24px;
      }

      .stat-icon {
        background: #e3f2fd;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;

        mat-icon {
          font-size: 32px;
          width: 32px;
          height: 32px;
          color: #1976d2;
        }
      }

      .stat-info {
        h3 {
          margin: 0;
          color: #5f6368;
          font-size: 16px;
        }

        .stat-number {
          margin: 8px 0 0;
          font-size: 28px;
          font-weight: 500;
          color: #1976d2;
        }
      }
    }

    .action-cards {
      .quick-action-card {
        mat-card-content {
          display: flex;
          gap: 16px;
          padding: 16px;
        }

        button {
          mat-icon {
            margin-right: 8px;
          }
        }
      }
    }
  `]
})
export class DashboardComponent {} 