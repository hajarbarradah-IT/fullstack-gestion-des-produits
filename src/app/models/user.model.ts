// Niveaux scolaires
export enum SchoolLevel {
  PRIMAIRE = 'Primaire',
  COLLEGE = 'Collège',
  LYCEE = 'Lycée',
  LICENCE = 'Licence',
  MASTER = 'Master',
  DOCTORAT = 'Doctorat',
  AUTRE = 'Autre'
}

// Interface User
export interface User {
  id?: number;
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date | string;
  gender: string;
  schoolLevel?: SchoolLevel;
  phoneNumber?: string;
  country: string;
  city?: string;
  address?: string;
  profilePicture?: string;
  role?: string;
  createdAt?: string;
}
