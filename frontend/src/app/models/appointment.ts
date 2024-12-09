export interface Appointment {
    id?: number;
    pet: {
      id: number;
      name: string;
      species: string;
      breed: string;
      owner: {
        id: number;
        firstName: string;
        lastName: string;
      };
    };
    service: {
      id: number;
      name: string;
      duration: number;
      price: number;
    };
    dateTime: string;
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  }
  
  export interface NewAppointment extends Omit<Appointment, 'id'> {}