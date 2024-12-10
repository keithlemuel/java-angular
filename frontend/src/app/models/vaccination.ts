export interface Vaccination {
  id?: number;
  name: string;
  dateAdministered: string;  // ISO date string
  nextDueDate: string;      // ISO date string
  pet: {
    id: number;
    name: string;
    breed: string;
  };
  status?: VaccinationStatus;
}

export interface NewVaccination extends Omit<Vaccination, 'id'> {} 

export enum VaccinationStatus {
  UPCOMING = 'UPCOMING',
  OVERDUE = 'OVERDUE',
  COMPLETED = 'COMPLETED'
} 