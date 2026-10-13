// Utilisateur connecté avec token JWT
export interface LoggedUser {
  id: number;
  username: string;
  email: string;
  token: string;
  role: string;
  permissions?: string[];
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
}
