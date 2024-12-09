import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OwnerService } from '../../services/owner.service';
import { Owner } from '../../models/owner';
import { OwnerDialogComponent } from './owner-dialog/owner-dialog.component';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-owners',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Pet Owners</h1>
        <button mat-raised-button color="primary" (click)="openOwnerDialog()" *ngIf="isVet">
          <mat-icon>add</mat-icon>
          Add New Owner
        </button>
      </div>
      
      <div class="search-container" *ngIf="isVet">
        <mat-icon>search</mat-icon>
        <input type="text" placeholder="Search owners..." (input)="filterOwners($event)">
      </div>

      <div class="owners-grid">
        <mat-card class="owner-card" *ngFor="let owner of filteredOwners">
          <div class="owner-info">
            <h2>{{owner.firstName}} {{owner.lastName}}</h2>
            <p><mat-icon>phone</mat-icon> {{owner.phoneNumber}}</p>
            <p><mat-icon>email</mat-icon> {{owner.email}}</p>
            <p><mat-icon>home</mat-icon> {{owner.address}}</p>
            <p *ngIf="owner.pets"><mat-icon>pets</mat-icon> {{owner.pets.length}} pets</p>
          </div>
          <div class="owner-actions">
            <button mat-icon-button color="primary" (click)="openOwnerDialog(owner)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteOwner(owner.id)" *ngIf="isVet">
              <mat-icon>delete</mat-icon>
            </button>
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

    .search-container {
      background: white;
      border-radius: 12px;
      padding: 12px 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      margin-bottom: 24px;

      mat-icon {
        color: #9e9e9e;
      }

      input {
        border: none;
        outline: none;
        width: 100%;
        font-size: 1rem;
        font-family: inherit;
        color: #37474f;
        background: transparent;

        &::placeholder {
          color: #9e9e9e;
        }
      }
    }

    .owners-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }

    .owner-card {
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;

      .owner-info {
        h2 {
          margin: 0 0 16px 0;
          color: #00838f;
          font-size: 20px;
        }

        p {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 8px 0;
          color: #616161;

          mat-icon {
            font-size: 18px;
            width: 18px;
            height: 18px;
            color: #9e9e9e;
          }
        }
      }

      .owner-actions {
        display: flex;
        gap: 8px;
      }
    }
  `]
})
export class OwnersComponent implements OnInit {
  owners: Owner[] = [];
  filteredOwners: Owner[] = [];
  isVet: boolean = false;

  constructor(
    private ownerService: OwnerService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.isVet = this.authService.isVet();
  }

  ngOnInit() {
    this.loadOwners();
  }

  loadOwners() {
    if (this.isVet) {
      this.ownerService.getAllOwners().subscribe({
        next: (owners) => {
          this.owners = owners;
          this.filteredOwners = owners;
        },
        error: (error) => {
          console.error('Error loading owners:', error);
          this.showError('Failed to load owners');
        }
      });
    } else {
      this.ownerService.getCurrentOwner().subscribe({
        next: (owner) => {
          this.owners = [owner];
          this.filteredOwners = [owner];
        },
        error: (error) => {
          console.error('Error loading owner details:', error);
          this.showError('Failed to load owner details');
        }
      });
    }
  }

  filterOwners(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredOwners = this.owners.filter(owner => 
      owner.firstName.toLowerCase().includes(searchTerm) ||
      owner.lastName.toLowerCase().includes(searchTerm) ||
      owner.email.toLowerCase().includes(searchTerm)
    );
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  openOwnerDialog(owner?: Owner) {
    const dialogRef = this.dialog.open(OwnerDialogComponent, {
      width: '500px',
      data: { owner: owner || null }
    });

    dialogRef.afterClosed().subscribe(result => {
      // Only proceed if we have actual form data
      if (result && Object.keys(result).length > 0) {
        if (result.id) {
          // Update existing owner
          this.ownerService.updateOwner(result.id, result).subscribe({
            next: () => {
              this.loadOwners();
              this.showSuccess('Owner updated successfully');
            },
            error: (error) => {
              console.error('Error updating owner:', error);
              this.showError('Failed to update owner');
            }
          });
        } else {
          // Create new owner
          this.ownerService.createOwner(result).subscribe({
            next: () => {
              this.loadOwners();
              this.showSuccess('Owner created successfully');
            },
            error: (error) => {
              console.error('Error creating owner:', error);
              this.showError('Failed to create owner');
            }
          });
        }
      }
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

  deleteOwner(id: number) {
    if (confirm('Are you sure you want to delete this owner?')) {
      this.ownerService.deleteOwner(id).subscribe({
        next: () => {
          this.loadOwners();
        },
        error: (error) => console.error('Error deleting owner:', error)
      });
    }
  }
} 