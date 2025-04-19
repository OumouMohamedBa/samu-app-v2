'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import styles from './Header.module.css';

export default function Header() {
  const { user, userData, logout } = useAuth();
  const router = useRouter();
  const [showActions, setShowActions] = useState(false);
  const [actions, setActions] = useState<string[]>([]);

  // 🔹 Récupérer les permissions selon le rôle (depuis la collection "autorisation")
  useEffect(() => {
    const fetchPermissionsByRole = async () => {
      if (!userData?.role) return;

      try {
        const q = query(collection(db, 'autorisation'), where('role', '==', userData.role));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const roleDoc = snap.docs[0];
          const data = roleDoc.data();
          setActions(data?.permissions || []);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des permissions:', error);
      }
    };

    fetchPermissionsByRole();
  }, [userData]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  const getTitleBasedOnRole = () => {
    switch (userData?.role) {
      case 'admin':
        return 'Admin';
      case 'operateur':
        return 'Base Centrale';
      case 'base_centrale':
        return 'Base Centrale';
      case 'medecin':
        return 'Médecin';
      case 'infirmier':
        return 'Infirmier';
      case 'responsable':
        return 'Responsable';
      default:
        return 'Système SAMU';
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <h2>{getTitleBasedOnRole()}</h2>
      </div>

      <div className={styles.navRight}>
        <div className={styles.userWrapper}>
        <FaUserCircle
  className={`${styles.userIcon} ${showActions ? styles.activeIcon : ''}`}
  onClick={() => setShowActions(!showActions)}
/>

          {showActions && (
            <div className={styles.dropdown}>
              <p className={styles.userName}>{user?.email}</p>
              <ul className={styles.actionList}>
                {actions.length > 0 ? (
                  actions.map((action, index) => (
                    <li key={index} className={styles.actionItem}>
                      {action.replace(/_/g, ' ')}
                    </li>
                  ))
                ) : (
                  <li className={styles.noPermission}>Aucune action définie</li>
                )}
              </ul>
            </div>
          )}
        </div>

        <button className={styles.logoutButton} onClick={handleLogout}>
          <FaSignOutAlt />
        </button>
      </div>
    </header>
  );
}
