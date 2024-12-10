export interface MedicalHistory {
  id?: number;
  condition: string;
  treatment: string;
  date: string;  // ISO date string
  notes: string;
  pet: {
    id: number;
    name: string;
    breed: string;
  };
  appointment?: {
    id: number;
    dateTime: string;
  };
}

export interface NewMedicalHistory extends Omit<MedicalHistory, 'id'> {} 