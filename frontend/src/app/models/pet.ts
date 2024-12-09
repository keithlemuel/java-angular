export interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
  age: number;
  owner?: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

export interface NewPet {
  name: string;
  species: string;
  breed: string;
  age: number;
  owner?: {
    id: number;
    firstName: string;
    lastName: string;
  };
} 