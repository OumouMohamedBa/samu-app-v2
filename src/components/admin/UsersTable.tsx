'use client';

import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { FaEdit, FaToggleOn, FaToggleOff, FaRedo, FaSearch } from 'react-icons/fa';  
import styles from './UsersTable.module.css';

interface UserData {
  id: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
  role?: string;
  isActive: boolean;
}

interface UsersTableProps {
  users: UserData[];
  handleRoleUpdate: (userId: string, role: string) => void;
}

export default function UsersTable({ users, handleRoleUpdate }: UsersTableProps) {
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(''); // ⬅️ État de la recherche

  // 🔹 Fonction pour activer/désactiver un utilisateur
  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await updateDoc(doc(db, 'users', userId), { isActive: !isActive });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut :", error);
    }
  };

  // 🔹 Fonction pour envoyer un email de réinitialisation
  const handleResetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(`Email de réinitialisation envoyé à ${email}`);
    } catch (error) {
      console.error("Erreur d'envoi :", error);
      setMessage("Erreur lors de l'envoi de l'email.");
    }
  };

  // 🔹 Filtrage des utilisateurs selon le champ de recherche
  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.role && user.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className={styles.tableContainer}>
      {message && <p className={styles.successMessage}>{message}</p>}

      {/* 🔎 Barre de recherche */}
      <div className={styles.searchContainer}>
        <FaSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Rechercher par email ou rôle..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {filteredUsers.length === 0 ? (
        <p className={styles.emptyMessage}>Aucun utilisateur trouvé.</p>
      ) : (
        <table className={styles.usersTable}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Date d'inscription</th>
              <th>Dernière modification</th>
              <th>Rôle Actuel</th>
              <th>Modifier le Rôle</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}</td>
                <td>{user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('fr-FR') : 'N/A'}</td>
                <td>{user.role || (
                  <select
                    className={styles.roleSelect}
                    onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                  >
                    <option value="">Attribuer un rôle</option>
                    <option value="admin">Admin</option>
                    <option value="medecin">Médecin</option>
                    <option value="infirmier">Infirmier</option>
                  </select>
                )}</td>
                <td className={styles.actionCell}>
                  {editingUserId === user.id ? (
                    <select
                      className={styles.roleSelect}
                      value={user.role || ''}
                      onChange={(e) => {
                        handleRoleUpdate(user.id, e.target.value);
                        setEditingUserId(null);
                      }}
                    >
                      <option value="">Sélectionner un rôle</option>
                      <option value="admin">Admin</option>
                      <option value="medecin">Médecin</option>
                      <option value="infirmier">Infirmier</option>
                    </select>
                  ) : (
                    <FaEdit 
                      className={styles.editIcon} 
                      onClick={() => setEditingUserId(user.id)} 
                    />
                  )}
                </td>
                <td className={user.isActive ? styles.active : styles.inactive}>
                  {user.isActive ? 'Actif' : 'Inactif'}
                </td>
                <td className={styles.actionButtons}>
                  <button 
                    className={styles.toggleButton}
                    onClick={() => toggleUserStatus(user.id, user.isActive)}
                  >
                    {user.isActive ? <FaToggleOn className={styles.activeIcon} /> : <FaToggleOff className={styles.inactiveIcon} />}
                  </button>
                  <button 
                    className={styles.resetButton}
                    onClick={() => handleResetPassword(user.email)}
                  >
                    <FaRedo /> 
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
