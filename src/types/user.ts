export type UserRole =
  | 'admin'
  | 'medecin'
  | 'infirmier'
  | 'operateur_centrale'
  | 'operateur_samu';

export interface UserData {
  email: string;
  role: UserRole | null;
  createdAt: string;
  updatedAt?: string;
  uid?: string; // Ajout de l'UID pour une meilleure traçabilité
  permissions?: string[]; // Optionnel : Liste des permissions pour une gestion plus fine
}
