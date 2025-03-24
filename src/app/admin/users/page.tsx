'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import UsersTable from '@/components/admin/UsersTable';
import styles from './user.module.css';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'users'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        setUsers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
    );
    return () => unsubscribe();
  }, []);

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rôle :", error);
    }
  };

  return (
    <div className={styles.adminContainer}>
      <Sidebar />
      <div className={styles.usersContainer}>
        <Header />
        <div className={styles.content}>
          <h2 className={styles.title}>Gestion des Utilisateurs</h2>
          <div className={styles.tableContainer}>
            <UsersTable users={users} handleRoleUpdate={handleRoleUpdate} />
          </div>
        </div>
      </div>
    </div>
  );
}
