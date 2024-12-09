export interface VetService {
  id?: number;
  name: string;
  description: string;
  duration: number;  // in minutes
  price: number;
  icon: string;
  iconBg: string;
}

export interface NewVetService extends Omit<VetService, 'id'> {} 