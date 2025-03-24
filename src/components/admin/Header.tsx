'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation'; // Import du router
import { FaSignOutAlt, FaAmbulance, FaUserCircle } from 'react-icons/fa';
import styles from './Header.module.css';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter(); // Initialisation du router

  const handleLogout = async () => {
    try {
      await logout(); // Déconnexion de l'utilisateur
      router.push('/'); // Redirection vers la page d'accueil
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  return (
    <header className={styles.header}>
      {/* Logo et titre */}
      <div className={styles.logoContainer}>
        <FaAmbulance className={styles.logoIcon} />
        <h2>Ambulance Connect</h2>
      </div>

      {/* Infos utilisateur et déconnexion */}
      <div className={styles.navRight}>
        <FaUserCircle className={styles.userIcon} />
        <span className={styles.userName}>{user?.email}</span>
        <button className={styles.logoutButton} onClick={handleLogout}>
          <FaSignOutAlt />
        </button>
      </div>
    </header>
  );
}
