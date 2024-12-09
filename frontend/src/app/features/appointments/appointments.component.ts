import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';
import { Appointment } from '../../models/appointment';
import { formatDate } from '@angular/common';
import { AppointmentDialogComponent } from './appointment-dialog/appointment-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatTableModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <div class="appointments-container">
      <div class="header">
        <h1>Appointments</h1>
        <button mat-raised-button color="primary" (click)="openAppointmentDialog()">
          <mat-icon>add</mat-icon>
          New Appointment
        </button>
      </div>

      <mat-card class="appointments-card">
        <mat-tab-group>
          <mat-tab label="Today">
            <div class="appointments-list">
              <div class="time-slot" *ngFor="let hour of [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]">
                <div class="time-label">{{hour}}:00</div>
                <mat-card 
                  class="appointment-card" 
                  *ngIf="getAppointmentForTimeSlot(hour) as appointment"
                > 
                  <div class="appointment-status" [ngClass]="appointment.status.toLowerCase()"></div>
                  <div class="appointment-info">
                    <h3>{{appointment.pet.name}} ({{appointment.pet.species}})</h3>
                    <p>{{appointment.service.name}}</p>
                    <small>Owner: {{appointment.pet.owner.firstName}} {{appointment.pet.owner.lastName}}</small>
                  </div>
                  <div class="appointment-actions">
                    <button mat-icon-button color="primary" (click)="openAppointmentDialog(appointment)">
                      <mat-icon>visibility</mat-icon>
                    </button>
                    <button 
                      mat-icon-button 
                      color="warn" 
                      (click)="cancelAppointment(appointment.id!)"
                      *ngIf="appointment.status === 'SCHEDULED'"
                    >
                      <mat-icon>cancel</mat-icon>
                    </button>
                  </div>
                </mat-card>
              </div>
            </div>
          </mat-tab>
          
          <mat-tab label="Upcoming">
            <table mat-table [dataSource]="upcomingAppointments" class="upcoming-table">
              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef> Date </th>
                <td mat-cell *matCellDef="let apt"> 
                  {{apt.dateTime | date:'mediumDate'}} 
                </td>
              </ng-container>

              <ng-container matColumnDef="time">
                <th mat-header-cell *matHeaderCellDef> Time </th>
                <td mat-cell *matCellDef="let apt"> 
                  {{apt.dateTime | date:'shortTime'}} 
                </td>
              </ng-container>

              <ng-container matColumnDef="pet">
                <th mat-header-cell *matHeaderCellDef> Pet </th>
                <td mat-cell *matCellDef="let apt"> 
                  {{apt.pet.name}} ({{apt.pet.species}}) 
                </td>
              </ng-container>

              <ng-container matColumnDef="service">
                <th mat-header-cell *matHeaderCellDef> Service </th>
                <td mat-cell *matCellDef="let apt"> {{apt.service.name}} </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef> Status </th>
                <td mat-cell *matCellDef="let apt"> 
                  <span class="status-chip" [ngClass]="apt.status.toLowerCase()">
                    {{apt.status}}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef> Actions </th>
                <td mat-cell *matCellDef="let apt">
                  <button mat-icon-button color="primary" (click)="openAppointmentDialog(apt)">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button 
                    mat-icon-button 
                    color="warn" 
                    (click)="cancelAppointment(apt.id!)"
                    *ngIf="apt.status === 'SCHEDULED'"
                  >
                    <mat-icon>cancel</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </mat-tab>
        </mat-tab-group>
      </mat-card>
    </div>
  `,
  styles: [`
    .appointments-container {
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

    .appointments-card {
      .appointments-list {
        padding: 16px;
      }

      .time-slot {
        display: flex;
        align-items: flex-start;
        margin-bottom: 16px;
        min-height: 80px;

        .time-label {
          width: 80px;
          color: #5f6368;
          font-weight: 500;
        }

        .appointment-card {
          flex: 1;
          margin-left: 16px;
          display: flex;
          align-items: center;
          padding: 16px;
          background: #f8f9fa;
          border-left: 4px solid #1976d2;

          .appointment-status {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 16px;
            margin-bottom: 16px;

            &.scheduled { background: #1976d2; }
            &.in_progress { background: #4caf50; }
            &.completed { background: #9e9e9e; }
            &.cancelled { background: #f44336; }
          }

          .appointment-info {
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

          .appointment-actions {
            display: flex;
            gap: 8px;
          }
        }
      }
    }

    .upcoming-table {
      width: 100%;
      margin-top: 16px;
      background: white;

      .mat-mdc-header-cell {
        color: #1976d2;
        font-weight: 500;
        background: #f5f5f5;
        padding: 16px;
      }

      .mat-mdc-cell {
        padding: 16px;
      }

      .status-chip {
        padding: 4px 12px;
        border-radius: 16px;
        font-size: 12px;
        font-weight: 500;

        &.scheduled {
          background: #e3f2fd;
          color: #1976d2;
        }

        &.in_progress {
          background: #e8f5e9;
          color: #4caf50;
        }

        &.completed {
          background: #f5f5f5;
          color: #9e9e9e;
        }

        &.cancelled {
          background: #ffebee;
          color: #f44336;
        }
      }
    }

    .mat-mdc-row:nth-child(even) {
      background-color: #fafafa;
    }

    .mat-mdc-row:hover {
      background-color: #f5f5f5;
    }
  `]
})
export class AppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  todayAppointments: Appointment[] = [];
  upcomingAppointments: Appointment[] = [];
  displayedColumns: string[] = ['date', 'time', 'pet', 'service', 'status', 'actions'];
  isVet: boolean = false;

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.isVet = this.authService.isVet();
  }

  ngOnInit() {
    console.log('Component initialized');
    this.loadAppointments();
  }

  loadAppointments() {
    this.appointmentService.getAllAppointments().subscribe(appointments => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // Sort appointments by date
      appointments.sort((a, b) => 
        new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
      );

      // Today's appointments
      this.todayAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.dateTime);
        return aptDate.getFullYear() === today.getFullYear() &&
               aptDate.getMonth() === today.getMonth() &&
               aptDate.getDate() === today.getDate();
      });

      // Future appointments (after today)
      this.upcomingAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.dateTime);
        return aptDate >= tomorrow;  // Include appointments from tomorrow onwards
      });
    });
  }

  formatTime(dateTime: string): string {
    return formatDate(dateTime, 'HH:mm', 'en-US');
  }

  getAppointmentForTimeSlot(hour: number): Appointment | undefined {
    const found = this.todayAppointments.find(apt => {
      const aptHour = new Date(apt.dateTime).getHours();
      return aptHour === hour;
    });
    return found;
  }

  openAppointmentDialog(appointment?: Appointment) {
    const dialogRef = this.dialog.open(AppointmentDialogComponent, {
      width: '600px',
      data: { 
        appointment: appointment,
        isVet: this.isVet
      },
      panelClass: 'appointment-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          // Update existing appointment
          this.appointmentService.updateAppointment(result.id, result).subscribe({
            next: () => {
              this.loadAppointments();
              this.showSuccess('Appointment updated successfully');
            },
            error: (error) => {
              console.error('Error updating appointment:', error);
              this.showError('Failed to update appointment');
            }
          });
        } else {
          // Create new appointment
          this.appointmentService.scheduleAppointment(result).subscribe({
            next: () => {
              this.loadAppointments();
              this.showSuccess('Appointment scheduled successfully');
            },
            error: (error) => {
              console.error('Error scheduling appointment:', error);
              this.showError('Failed to schedule appointment');
            }
          });
        }
      }
    });
  }

  cancelAppointment(id: number) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      this.appointmentService.cancelAppointment(id).subscribe({
        next: () => {
          this.loadAppointments();
          this.showSuccess('Appointment cancelled successfully');
        },
        error: (error) => {
          console.error('Error cancelling appointment:', error);
          this.showError('Failed to cancel appointment');
        }
      });
    }
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
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