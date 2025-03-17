'use client';

import { useAuth } from '@/contexts/AuthContext';
import RoleProtectedRoute from '@/components/RoleProtectedRoute';
import Link from 'next/link';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const { user, userData, logout, isAdmin } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const getRoleSpecificContent = () => {
    switch (userData?.role) {
      case 'medecin':
        return (
          <div className={styles.grid}>
            <div className={styles.card}>
              <h3>Consultations</h3>
              <p>Gérez vos consultations et suivis patients</p>
            </div>
            <div className={styles.card}>
              <h3>Urgences</h3>
              <p>Accédez aux cas d'urgence en attente</p>
            </div>
          </div>
        );
      case 'infirmier':
        return (
          <div className={styles.grid}>
            <div className={styles.card}>
              <h3>Soins</h3>
              <p>Liste des soins à administrer</p>
            </div>
            <div className={styles.card}>
              <h3>Patients</h3>
              <p>Suivi des patients</p>
            </div>
          </div>
        );
      case 'receptionniste':
        return (
          <div className={styles.grid}>
            <div className={styles.card}>
              <h3>Admissions</h3>
              <p>Gestion des admissions patients</p>
            </div>
            <div className={styles.card}>
              <h3>Rendez-vous</h3>
              <p>Planning des rendez-vous</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <RoleProtectedRoute>
      <div className={styles.container}>
        <nav className={styles.navbar}>
          <Link href="/">Home</Link>
          <Link href="/dashboard">Dashboard</Link>
          {isAdmin && <Link href="/admin/users">Admin</Link>}
          <div className={styles.user}>
            <p>{user?.email}</p>
            <p>
              {isAdmin ? 'Super Admin' : userData?.role || 'Rôle non attribué'}
            </p>
            <button
              onClick={handleLogout}
              className={styles.logout}
            >
              Déconnexion
            </button>
          </div>
        </nav>
        <main className={styles.dashboard}>
          <div className={styles.header}>
            <h2>Tableau de bord</h2>
            {isAdmin && (
              <Link
                href="/admin/users"
                className={styles.adminLink}
              >
                Gestion des utilisateurs
              </Link>
            )}
          </div>
          {getRoleSpecificContent()}
          {!userData?.role && !isAdmin && (
            <div className={styles.noRole}>
              <p>
                Votre rôle n&apos;a pas encore été attribué. Veuillez contacter l&apos;administrateur.
              </p>
            </div>
          )}
        </main>
      </div>
    </RoleProtectedRoute>
  );
}
