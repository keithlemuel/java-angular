import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { VetServiceService } from '../../services/vet-service.service';
import { VetService } from '../../models/vet-service';
import { MatDialog } from '@angular/material/dialog';
import { ServiceDialogComponent } from './service-dialog/service-dialog.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Veterinary Services</h1>
        <button mat-raised-button color="primary" class="add-button" (click)="openServiceDialog()">
          <mat-icon>add</mat-icon>
          Add New Service
        </button>
      </div>

      <div class="services-grid">
        <mat-card class="service-card" *ngFor="let service of services">
          <div class="service-icon" [style.background-color]="service.iconBg">
            <mat-icon>{{service.icon}}</mat-icon>
          </div>
          <h2>{{service.name}}</h2>
          <p>{{service.description}}</p>
          <div class="service-details">
            <div class="chips">
              <span class="time-chip">{{formatDuration(service.duration)}}</span>
              <span class="price-chip">{{formatPrice(service.price)}}</span>
            </div>
            <div class="action-buttons">
              <button mat-button color="primary">
                <mat-icon>event</mat-icon>
                Schedule
              </button>
              <button mat-icon-button (click)="openServiceDialog(service)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button (click)="deleteService(service.id)">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;

      h1 {
        color: #00838f;
        font-size: 24px;
        font-weight: 600;
        margin: 0;
        font-family: 'Poppins', sans-serif;
      }
    }

    .services-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
      margin-top: 24px;
    }

    .service-card {
      background: #212121;
      color: white;
      padding: 24px;
      position: relative;
      border-radius: 12px;

      .service-icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16px;

        mat-icon {
          font-size: 24px;
          width: 24px;
          height: 24px;
          color: white;
        }
      }

      h2 {
        font-family: 'Poppins', sans-serif;
        font-size: 20px;
        font-weight: 600;
        margin: 0 0 8px 0;
        color: #2196f3;
      }

      p {
        font-family: 'Poppins', sans-serif;
        color: #9e9e9e;
        margin: 0 0 24px 0;
        font-size: 14px;
        line-height: 1.5;
      }

      .service-details {
        .chips {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;

          span {
            font-family: 'Poppins', sans-serif;
            padding: 4px 12px;
            border-radius: 16px;
            font-size: 14px;
            background: rgba(255, 255, 255, 0.1);
          }
        }

        .action-buttons {
          display: flex;
          justify-content: space-between;
          align-items: center;

          button {
            font-family: 'Poppins', sans-serif;
            
            mat-icon {
              margin-right: 8px;
            }
          }
        }
      }
    }
  `],
})
export class ServicesComponent implements OnInit {
  services: VetService[] = [];

  constructor(
    private vetServiceService: VetServiceService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.vetServiceService.getAllServices().subscribe({
      next: (services) => {
        this.services = services;
      },
      error: (error) => console.error('Error loading services:', error)
    });
  }

  formatDuration(minutes: number): string {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
    return `${minutes} mins`;
  }

  formatPrice(price: number): string {
    return `₱${price.toFixed(2)}`;
  }

  openServiceDialog(service?: VetService) {
    const dialogRef = this.dialog.open(ServiceDialogComponent, {
      data: service || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.vetServiceService.updateService(result.id, result).subscribe({
            next: () => this.loadServices(),
            error: (error) => console.error('Error updating service:', error)
          });
        } else {
          this.vetServiceService.createService(result).subscribe({
            next: () => this.loadServices(),
            error: (error) => console.error('Error creating service:', error)
          });
        }
      }
    });
  }

  deleteService(id: number | undefined) {
    if (id === undefined) return;
    
    if (confirm('Are you sure you want to delete this service?')) {
      this.vetServiceService.deleteService(id).subscribe({
        next: () => this.loadServices(),
        error: (error) => console.error('Error deleting service:', error) 
      });
    }
  }
} 