import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { PetService } from '../../services/pet.service';
import { PetDialogComponent } from './pet-dialog/pet-dialog.component';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Pets</h1>
        <button mat-raised-button color="primary" (click)="openPetDialog()">
          <mat-icon>add</mat-icon>
          Add New Pet
        </button>
      </div>

      <div class="search-container" *ngIf="isVet">
        <mat-icon>search</mat-icon>
        <input type="text" placeholder="Search pets..." (input)="filterPets($event)">
      </div>

      <div class="pets-grid">
        <mat-card class="pet-card" *ngFor="let pet of filteredPets">
          <div class="pet-info">
            <div class="pet-header">
              <h2>{{pet.name}}</h2>
              <mat-chip-listbox>
                <mat-chip>{{pet.species}}</mat-chip>
              </mat-chip-listbox>
            </div>
            <p><strong>Breed:</strong> {{pet.breed}}</p>
            <p><strong>Age:</strong> {{pet.age}} years</p>
            <p *ngIf="isVet"><strong>Owner:</strong> {{pet.owner?.firstName}} {{pet.owner?.lastName}}</p>
          </div>
          <div class="pet-actions">
            <button mat-icon-button color="accent" (click)="openPetDialog(pet)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deletePet(pet.id)" *ngIf="isVet">
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
    }

    .search-container {
      background: white;
      border-radius: 12px;
      padding: 12px 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);

      mat-icon {
        color: #9e9e9e;
      }

      input {
        border: none;
        outline: none;
        width: 100%;
        font-size: 1rem;
      }
    }

    .pets-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }

    .pet-card {
      padding: 20px;

      .pet-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;

        h2 {
          margin: 0;
          color: #00838f;
        }
      }

      .pet-info {
        p {
          margin: 8px 0;
          color: #616161;
        }
      }

      .pet-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 16px;
      }
    }
  `]
})
export class PetsComponent implements OnInit {
  pets: any[] = [];
  filteredPets: any[] = [];
  isVet: boolean = false;

  constructor(
    private petService: PetService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.isVet = this.authService.isVet();
  }

  ngOnInit() {
    this.loadPets();
  }

  loadPets() {
    this.petService.getAllPets().subscribe({
      next: (pets) => {
        this.pets = pets;
        this.filteredPets = pets;
      },
      error: (error) => {
        console.error('Error loading pets:', error);
        this.showError('Failed to load pets');
      }
    });
  }

  filterPets(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredPets = this.pets.filter(pet => 
      pet.name.toLowerCase().includes(searchTerm) ||
      pet.species.toLowerCase().includes(searchTerm) ||
      pet.breed.toLowerCase().includes(searchTerm) ||
      (this.isVet && pet.owner && 
        (`${pet.owner.firstName} ${pet.owner.lastName}`).toLowerCase().includes(searchTerm))
    );
  }

  openPetDialog(pet?: any) {
    const dialogRef = this.dialog.open(PetDialogComponent, {
      width: '500px',
      data: { pet: pet, isVet: this.isVet }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      // Only proceed if result exists and is not undefined/null
      if (result) {
        if (result.id) {
          // Update existing pet
          this.petService.updatePet(result.id, result).subscribe({
            next: () => {
              this.loadPets();
              this.showSuccess('Pet updated successfully');
            },
            error: (error) => {
              console.error('Error updating pet:', error);
              this.showError('Failed to update pet');
            }
          });
        } else if (!result.id && Object.keys(result).length > 0) {
          // Create new pet
          this.petService.createPet(result).subscribe({
            next: () => {
              this.loadPets();
              this.showSuccess('Pet added successfully');
            },
            error: (error) => {
              console.error('Error creating pet:', error);
              this.showError('Failed to create pet');
            }
          });
        }
      }
    });
  }
  
  deletePet(id: number) {
    if (confirm('Are you sure you want to delete this pet?')) {
      this.petService.deletePet(id).subscribe({
        next: () => {
          this.loadPets();
          this.showSuccess('Pet deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting pet:', error);
          this.showError('Failed to delete pet');
        }
      });
    }
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
} 