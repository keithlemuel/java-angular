import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MedicalHistoryService } from '../../services/medical-history.service';
import { MedicalHistoryDialogComponent } from './medical-history-dialog/medical-history-dialog.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-medical-history-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule 
  ],
  template: `
    <div class="medical-history-container">
      <div class="header">
        <h2>Medical History</h2>
        <button mat-raised-button color="primary" (click)="openAddDialog()" *ngIf="isVet">
          <mat-icon>add</mat-icon>
          Add Medical History
        </button>
      </div>

      <div class="history-list">
        <mat-card *ngFor="let history of medicalHistories">
          <mat-card-header>
            <mat-card-title>{{history.condition}}</mat-card-title>
            <mat-card-subtitle>{{history.date | date}}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p><strong>Treatment:</strong> {{history.treatment}}</p>
            <p *ngIf="history.notes"><strong>Notes:</strong> {{history.notes}}</p>
          </mat-card-content>
          <mat-card-actions align="end" *ngIf="isVet">
            <button mat-icon-button color="primary" (click)="openEditDialog(history)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteHistory(history.id)">
              <mat-icon>delete</mat-icon>
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .medical-history-container {
      padding: 20px;
    }
    h2 {
      color: #00838f;
      font-size: 24px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .history-list {
      display: grid;
      gap: 16px;
    }
    mat-card {
      margin-bottom: 16px;
    }
  `]
})
export class MedicalHistoryListComponent implements OnInit {
  @Input() petId!: number;
  medicalHistories: any[] = [];
  isVet: boolean = false;

  constructor(
    private medicalHistoryService: MedicalHistoryService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.isVet = this.authService.isVet();
  }

  ngOnInit() {
    this.loadMedicalHistories();
  }

  loadMedicalHistories() {
    this.medicalHistoryService.getMedicalHistoriesByPetId(this.petId)
      .subscribe(histories => this.medicalHistories = histories);
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(MedicalHistoryDialogComponent, {
      data: { petId: this.petId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.medicalHistoryService.addMedicalHistory(result)
          .subscribe(() => this.loadMedicalHistories());
      }
    });
  }

  openEditDialog(history: any) {
    const dialogRef = this.dialog.open(MedicalHistoryDialogComponent, {
      data: { medicalHistory: history, petId: this.petId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.medicalHistoryService.updateMedicalHistory(history.id, result)
          .subscribe(() => this.loadMedicalHistories());
      }
    });
  }

  deleteHistory(id: number) {
    if (confirm('Are you sure you want to delete this medical history?')) {
      this.medicalHistoryService.deleteMedicalHistory(id)
        .subscribe(() => this.loadMedicalHistories());
    }
  }
} 