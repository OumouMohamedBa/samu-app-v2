// 🔹 UsersTable.tsx
'use client';

import { useState } from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { logAdminAction } from '@/types/logAdminAction';
import { useAuth } from '@/contexts/AuthContext';
import { FaEdit, FaToggleOn, FaToggleOff, FaRedo, FaSearch, FaTrash, FaPen, FaTimes } from 'react-icons/fa';
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
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editEmail, setEditEmail] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { user } = useAuth();

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await updateDoc(doc(db, 'users', userId), { isActive: !isActive });
      await logAdminAction('Statut utilisateur modifié', user?.email || '', 'users', `ID: ${userId}, Actif: ${!isActive}`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(`Email de réinitialisation envoyé à ${email}`);
      await logAdminAction('Réinitialisation mot de passe', user?.email || '', 'users', `Email: ${email}`);
    } catch (error) {
      console.error("Erreur d'envoi:", error);
      setMessage("Erreur lors de l'envoi de l'email.");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Es-tu sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        setMessage('Utilisateur supprimé avec succès.');
        await logAdminAction('Utilisateur supprimé', user?.email || '', 'users', `ID: ${userId}`);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setMessage("Erreur lors de la suppression de l'utilisateur.");
      }
    }
  };

  const openEditModal = (user: UserData) => {
    setEditingUserId(user.id);
    setEditEmail(user.email);
    setIsModalOpen(true);
  };

  const handleEditUser = async () => {
    if (editingUserId && editEmail) {
      try {
        await updateDoc(doc(db, 'users', editingUserId), { email: editEmail, updatedAt: new Date().toISOString() });
        setMessage('Email de l\'utilisateur modifié avec succès.');
        setIsModalOpen(false);
        setEditingUserId(null);
        await logAdminAction('Email utilisateur modifié', user?.email || '', 'users', `ID: ${editingUserId}, Nouvel email: ${editEmail}`);
      } catch (error) {
        console.error('Erreur lors de la modification:', error);
        setMessage("Erreur lors de la modification de l'utilisateur.");
      }
    }
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.role && user.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className={styles.tableContainer}>
      {message && <p className={styles.successMessage}>{message}</p>}

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
                <td>
                  {editingUserId === user.id ? (
                    <select
                      className={styles.roleSelect}
                      value={user.role || ''}
                      onChange={(e) => {
                        handleRoleUpdate(user.id, e.target.value);
                        setEditingUserId(null);
                        logAdminAction('Rôle utilisateur modifié', user?.email || '', 'users', `ID: ${user.id}, Nouveau rôle: ${e.target.value}`);
                      }}
                    >
                      <option value="">Sélectionner un rôle</option>
                      <option value="admin">Admin</option>
                      <option value="operateur">Opérateur</option>
                      <option value="medecin">Médecin</option>
                      <option value="infirmier">Infirmier</option>
                    </select>
                  ) : (
                    <span>{user.role || 'Non défini'}</span>
                  )}
                </td>
                <td className={styles.actionCell}>
                  {editingUserId === user.id ? (
                    <FaTimes className={styles.closeIcon} onClick={() => setEditingUserId(null)} />
                  ) : (
                    <FaEdit className={styles.editIcon} onClick={() => setEditingUserId(user.id)} />
                  )}
                </td>
                <td className={user.isActive ? styles.active : styles.inactive}>
                  {user.isActive ? 'Actif' : 'Inactif'}
                </td>
                <td className={styles.actionButtons}>
                  <button className={styles.toggleButton} onClick={() => toggleUserStatus(user.id, user.isActive)}>
                    {user.isActive ? <FaToggleOn className={styles.activeIcon} /> : <FaToggleOff className={styles.inactiveIcon} />}
                  </button>
                  <button className={styles.resetButton} onClick={() => handleResetPassword(user.email)}>
                    <FaRedo />
                  </button>
                  <button className={styles.editUserButton} onClick={() => openEditModal(user)}><FaPen /></button>
                  <button className={styles.deleteUserButton} onClick={() => handleDeleteUser(user.id)}><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <FaTimes className={styles.closeIcon} onClick={() => setIsModalOpen(false)} />
            <h3>Modifier l'email</h3>
            <input
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className={styles.modalInput}
            />
            <button className={styles.modalButton} onClick={handleEditUser}>Enregistrer</button>
          </div>
        </div>
      )}
    </div>
  );
}
