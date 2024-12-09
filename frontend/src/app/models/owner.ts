// View model for displaying owner details
export interface OwnerView {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  pets?: PetSummary[];
}

// Simplified pet information for owner views
export interface PetSummary {
  id: number;
  name: string;
  species: string;
  breed: string;
  age: number;
}

// Payload for API requests
export interface OwnerPayload {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
}

export type Owner = OwnerView; 