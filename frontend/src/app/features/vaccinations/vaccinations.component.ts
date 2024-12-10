import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { VaccinationService } from '../../services/vaccination.service';
import { Vaccination } from '../../models/vaccination';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VaccinationDialogComponent } from './vaccination-dialog/vaccination-dialog.component';
import { AuthService } from '../../services/auth.service';
import { MatDialogModule } from '@angular/material/dialog';
import { VaccinationStatus } from '../../models/vaccination';

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
    MatChipsModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <div class="vaccinations-container">
      <div class="header">
        <h1>Vaccination Management</h1>
        <button mat-raised-button color="primary" (click)="openVaccinationDialog()">
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
            <mat-card class="alert-item overdue" *ngFor="let vaccination of dueVaccinations">
              <div class="alert-icon">
                <mat-icon>priority_high</mat-icon>
              </div>
              <div class="alert-content">
                <h3>{{vaccination.pet.name}} ({{vaccination.pet.breed}})</h3>
                <p>{{vaccination.name}} Vaccine Overdue</p>
                <small>Due date: {{vaccination.nextDueDate}}</small>
              </div>
              <button mat-stroked-button color="warn">Schedule Now</button>
            </mat-card>

            <mat-card class="alert-item upcoming" *ngFor="let vaccination of upcomingVaccinations">
              <div class="alert-icon">
                <mat-icon>schedule</mat-icon>
              </div>
              <div class="alert-content">
                <h3>{{vaccination.pet.name}} ({{vaccination.pet.breed}})</h3>
                <p>{{vaccination.name}} Vaccine Due Soon</p>
                <small>Due date: {{vaccination.nextDueDate}}</small>
              </div>
              <button mat-stroked-button color="primary">Schedule Now</button>
            </mat-card>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="records-card">
        <mat-tab-group>
          <mat-tab label="Recent Vaccinations">
            <table mat-table [dataSource]="recentVaccinations" class="records-table">
              <ng-container matColumnDef="pet">
                <th mat-header-cell *matHeaderCellDef>Pet</th>
                <td mat-cell *matCellDef="let vaccination">
                  <div class="pet-info">
                    <span class="pet-name">{{vaccination.pet.name}}</span>
                    <span class="pet-breed">{{vaccination.pet.breed}}</span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Vaccine</th>
                <td mat-cell *matCellDef="let vaccination">{{vaccination.name}}</td>
              </ng-container>

              <ng-container matColumnDef="dateAdministered">
                <th mat-header-cell *matHeaderCellDef>Date Administered</th>
                <td mat-cell *matCellDef="let vaccination">{{vaccination.dateAdministered | date}}</td>
              </ng-container>

              <ng-container matColumnDef="nextDueDate">
                <th mat-header-cell *matHeaderCellDef>Next Due Date</th>
                <td mat-cell *matCellDef="let vaccination">{{vaccination.nextDueDate | date}}</td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let vaccination">
                  <button mat-icon-button color="primary" (click)="openVaccinationDialog(vaccination)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteVaccination(vaccination.id)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </mat-tab>

          <mat-tab label="Vaccination Schedule">
            <div class="schedule-grid">
              <table mat-table [dataSource]="upcomingVaccinations" class="records-table">
                <ng-container matColumnDef="pet">
                  <th mat-header-cell *matHeaderCellDef>Pet</th>
                  <td mat-cell *matCellDef="let vaccination">
                    <div class="pet-info">
                      <span class="pet-name">{{vaccination.pet.name}}</span>
                      <small class="pet-breed">{{vaccination.pet.breed}}</small>
                    </div>
                  </td>
                </ng-container>

                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Vaccine</th>
                  <td mat-cell *matCellDef="let vaccination">{{vaccination.name}}</td>
                </ng-container>

                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Status</th>
                  <td mat-cell *matCellDef="let vaccination">
                    <div class="status-indicator" [ngClass]="vaccination.status.toLowerCase()">
                      <mat-icon *ngIf="vaccination.status === 'OVERDUE'">priority_high</mat-icon>
                      <mat-icon *ngIf="vaccination.status === 'UPCOMING'">schedule</mat-icon>
                      <mat-icon *ngIf="vaccination.status === 'COMPLETED'">check_circle</mat-icon>
                      {{vaccination.status}}
                    </div>
                  </td>
                </ng-container>

                <ng-container matColumnDef="dateAdministered">
                  <th mat-header-cell *matHeaderCellDef>Date Administered</th>
                  <td mat-cell *matCellDef="let vaccination">{{vaccination.dateAdministered | date}}</td>
                </ng-container>

                <ng-container matColumnDef="nextDueDate">
                  <th mat-header-cell *matHeaderCellDef>Next Due Date</th>
                  <td mat-cell *matCellDef="let vaccination">{{vaccination.nextDueDate | date}}</td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Actions</th>
                  <td mat-cell *matCellDef="let vaccination">
                    <button mat-icon-button color="primary" (click)="openVaccinationDialog(vaccination)">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" (click)="deleteVaccination(vaccination.id)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>
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
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
      padding: 16px;
    }

    .alert-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;

      &.overdue {
        border-left: 4px solid #f44336;
      }

      &.upcoming {
        border-left: 4px solid #ff9800;
      }

      .alert-icon {
        mat-icon {
          font-size: 24px;
          width: 24px;
          height: 24px;
        }
      }

      .alert-content {
        flex: 1;
        h3 {
          margin: 0 0 4px 0;
          font-size: 16px;
        }
        p {
          margin: 0 0 4px 0;
          color: #666;
        }
        small {
          color: #999;
        }
      }
    }

    .records-table {
      width: 100%;

      .pet-info {
        display: flex;
        flex-direction: column;

        .pet-name {
          font-weight: 500;
        }

        .pet-breed {
          font-size: 12px;
          color: #666;
        }
      }

      th.mat-header-cell {
        color: #00838f;
        font-weight: 500;
      }

      td.mat-cell {
        padding: 16px 8px;
      }
    }

    .status-chip {
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;

      &.upcoming {
        background: #e3f2fd;
        color: #1976d2;
      }

      &.overdue {
        background: #ffebee;
        color: #f44336;
      }

      &.completed {
        background: #e8f5e9;
        color: #4caf50;
      }
    }

    .schedule-grid {
      padding: 16px;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      width: fit-content;

      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      &.upcoming {
        background: #e3f2fd;
        color: #1976d2;
      }

      &.overdue {
        background: #ffebee;
        color: #f44336;
      }

      &.completed {
        background: #e8f5e9;
        color: #4caf50;
      }
    }

    .pet-info {
      display: flex;
      flex-direction: column;

      .pet-name {
        font-weight: 500;
      }

      .pet-breed {
        font-size: 12px;
        color: #666;
      }
    }
  `]
})
export class VaccinationsComponent implements OnInit {
  displayedColumns: string[] = ['pet', 'name', 'dateAdministered', 'nextDueDate', 'actions'];
  scheduleColumns: string[] = ['pet', 'name', 'status', 'nextDueDate', 'actions'];
  dueVaccinations: Vaccination[] = [];
  recentVaccinations: Vaccination[] = [];
  upcomingVaccinations: Vaccination[] = [];
  isLoading = false;

  constructor(
    private vaccinationService: VaccinationService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadVaccinations();
  }

  loadVaccinations() {
    this.isLoading = true;
    
    // Get due vaccinations (due before next month)
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const today = new Date();
    // Reset time to start of day for accurate comparison
    today.setHours(0, 0, 0, 0);
    
    console.log('Today:', today);
    
    this.vaccinationService.getDueVaccinations(nextMonth.toISOString().split('T')[0])
      .subscribe({
        next: (vaccinations) => {
          // Remove duplicates first
          const uniqueVaccinations = vaccinations.filter((v, index, self) => 
            index === self.findIndex((t) => t.id === v.id)
          );
          
          // Process and separate vaccinations
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          // First filter out overdue vaccinations
          this.dueVaccinations = uniqueVaccinations
            .filter(v => {
              const dueDate = new Date(v.nextDueDate);
              dueDate.setHours(0, 0, 0, 0);
              return dueDate < today;
            })
            .map(v => ({
              ...v,
              status: VaccinationStatus.OVERDUE
            }));

          // Then filter remaining vaccinations for upcoming
          // Exclude any vaccination IDs that are already in dueVaccinations
          const overdueIds = new Set(this.dueVaccinations.map(v => v.id));
          this.upcomingVaccinations = uniqueVaccinations
            .filter(v => {
              const dueDate = new Date(v.nextDueDate);
              dueDate.setHours(0, 0, 0, 0);
              return dueDate >= today && !overdueIds.has(v.id);
            })
            .map(v => ({
              ...v,
              status: VaccinationStatus.UPCOMING
            }));
          
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading due vaccinations:', error);
          this.showError('Failed to load due vaccinations');
          this.isLoading = false;
        }
      });

    // Second API call - for the table views
    this.vaccinationService.getAllVaccinations()
      .subscribe({
        next: (vaccinations) => {
          // Sort by date administered for recent vaccinations table
          this.recentVaccinations = vaccinations.sort((a, b) => 
            new Date(b.dateAdministered).getTime() - new Date(a.dateAdministered).getTime()
          );
        },
        error: (error) => {
          console.error('Error loading vaccinations:', error);
          this.showError('Failed to load vaccination records');
        }
      });
  }

  openVaccinationDialog(vaccination?: any) {
    const dialogRef = this.dialog.open(VaccinationDialogComponent, {
      width: '500px',
      data: { 
        vaccination: vaccination || null,
        isVet: this.authService.isVet()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          // Update existing vaccination
          this.vaccinationService.updateVaccination(result.id, result).subscribe({
            next: () => {
              this.loadVaccinations();
              this.showSuccess('Vaccination record updated successfully');
            },
            error: (error) => {
              console.error('Error updating vaccination:', error);
              this.showError('Failed to update vaccination record');
            }
          });
        } else {
          // Create new vaccination
          this.vaccinationService.addVaccination(result).subscribe({
            next: () => {
              this.loadVaccinations();
              this.showSuccess('Vaccination record added successfully');
            },
            error: (error) => {
              console.error('Error adding vaccination:', error);
              this.showError('Failed to add vaccination record');
            }
          });
        }
      }
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

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  deleteVaccination(id: number | undefined) {
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this vaccination record?')) {
      this.vaccinationService.deleteVaccination(id).subscribe({
        next: () => {
          this.loadVaccinations();
          this.showSuccess('Vaccination record deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting vaccination:', error);
          this.showError('Failed to delete vaccination record');
        }
      });
    }
  }

  scheduleVaccination(vaccination: Vaccination) {
    this.openVaccinationDialog({
      ...vaccination,
      id: undefined,
      dateAdministered: new Date(),
      status: VaccinationStatus.COMPLETED
    });
  }
} 