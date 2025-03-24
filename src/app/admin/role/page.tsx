'use client';

import { useEffect, useState } from 'react';
import styles from './roles.module.css';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';

export default function RolesPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [permissions, setPermissions] = useState('');

  // Récupérer les utilisateurs et les rôles existants
  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => setUsers(data));

    fetch('/api/roles') // API pour récupérer les rôles existants
      .then((res) => res.json())
      .then((data) => setRoles(data));
  }, []);

  // Modifier le rôle d'un utilisateur
  const updateRole = async (userId: string, newRole: string) => {
    await fetch(`/api/users/${userId}/update_role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    });
    alert('Rôle mis à jour');
  };

  // Ajouter un nouveau rôle avec des permissions
  const addRole = async () => {
    if (!newRole.trim()) {
      alert("Le nom du rôle est obligatoire !");
      return;
    }

    await fetch('/api/roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newRole, permissions: permissions.split(',') }),
    });

    alert('Rôle ajouté avec succès');
    setNewRole('');
    setPermissions('');
    setIsFormVisible(false);

    // Rafraîchir les rôles
    fetch('/api/roles')
      .then((res) => res.json())
      .then((data) => setRoles(data));
  };

  return (
    <div className={styles.adminContainer}>
      {/* Sidebar */}
      <Sidebar />

      {/* Contenu principal */}
      <div className={styles.mainContent}>
        <Header title="Gestion des Rôles" />

        {/* Bouton pour afficher/masquer le formulaire */}
        <button
          className={styles.toggleFormButton}
          onClick={() => setIsFormVisible(!isFormVisible)}
        >
          {isFormVisible ? 'Fermer' : 'Ajouter un Rôle'}
        </button>

        {/* Formulaire pour ajouter un rôle */}
        {isFormVisible && (
          <div className={styles.roleForm}>
            <h2>Ajouter un Nouveau Rôle</h2>
            <input
              type="text"
              placeholder="Nom du rôle"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className={styles.roleInput}
            />
            <input
              type="text"
              placeholder="Permissions (séparées par des virgules)"
              value={permissions}
              onChange={(e) => setPermissions(e.target.value)}
              className={styles.roleInput}
            />
            <button onClick={addRole} className={styles.addRoleButton}>
              Ajouter Rôle
            </button>
          </div>
        )}

        {/* Table des rôles et utilisateurs */}
        <div className={styles.usersContainer}>
          <h1 className={styles.title}>Gestion des Rôles</h1>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Rôle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => updateRole(user.id, e.target.value)}
                      className={styles.select}
                    >
                      {roles.map((role) => (
                        <option key={role.name} value={role.name}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
