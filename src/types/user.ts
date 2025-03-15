export type UserRole = 'admin' | 'medecin' | 'infirmier' | 'receptionniste';

export interface UserData {
  email: string;
  role: UserRole | null;
  createdAt: string;
  updatedAt?: string;
  uid?: string; // Ajout de l'UID pour une meilleure traçabilité
}
