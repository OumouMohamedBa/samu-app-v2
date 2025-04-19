'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import styles from './roles.module.css';

const permissionsDisponibles = [
  'ajouter_utilisateur',
  'modifier_utilisateur',
  'supprimer_utilisateur',
  'voir_dashboard',
  'gérer_samu',
  'gérer_hôpital',
  'modifier_roles',
  'accès_statistiques'
];

export default function RolesPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [newRole, setNewRole] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    const snapshot = await getDocs(collection(db, 'autorisation'));
    const rolesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setRoles(rolesData);
  };

  const handlePermissionChange = async (roleId: string, permission: string, isChecked: boolean) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;

    let updatedPermissions = [...(role.permissions || [])];

    if (isChecked) {
      updatedPermissions.push(permission);
    } else {
      updatedPermissions = updatedPermissions.filter(p => p !== permission);
    }

    await updateDoc(doc(db, 'autorisation', roleId), {
      permissions: updatedPermissions,
    });

    fetchRoles();
    setMessage(`Permission ${isChecked ? 'ajoutée à' : 'retirée de'} ${role.role}`);
  };

  const handleAddRole = async () => {
    if (!newRole.trim()) {
      setMessage("Le nom du rôle est requis !");
      return;
    }

    await setDoc(doc(db, 'autorisation', newRole.toLowerCase()), {
      role: newRole,
      permissions: []
    });

    setNewRole('');
    fetchRoles();
    setMessage(`Rôle "${newRole}" ajouté avec succès ✅`);
  };

  return (
    <div className={styles.adminContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Header />
        <h2 className={styles.title}>Gestion des Rôles & Permissions</h2>

        {message && <div className={styles.message}>{message}</div>}

        <div className={styles.addRoleSection}>
          <input
            type="text"
            placeholder="Nouveau rôle"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className={styles.inputRole}
          />
          <button className={styles.addButton} onClick={handleAddRole}>Ajouter</button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.roleTable}>
            <thead>
              <tr>
                <th>Rôle</th>
                {permissionsDisponibles.map((perm) => (
                  <th key={perm}>{perm.replace(/_/g, ' ')}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.id}>
                  <td className={styles.roleName}>{role.role}</td>
                  {permissionsDisponibles.map((perm) => (
                    <td className={styles.checkboxCell} key={perm}>
                      <input
                        type="checkbox"
                        checked={role.permissions?.includes(perm)}
                        onChange={(e) =>
                          handlePermissionChange(role.id, perm, e.target.checked)
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
