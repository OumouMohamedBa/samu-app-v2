'use client';

import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <div className={styles.dashboardContainer}>
        <Header />
        <h2 className={styles.dashboardHeader}>Tableau de bord - Super Admin</h2>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Statistiques</h3>
            <p>Analysez les performances</p>
          </div>
          <div className={styles.card}>
            <h3>Utilisateurs</h3>
            <p>Gérez les comptes et les accès</p>
          </div>
          <div className={styles.card}>
            <h3>Logs</h3>
            <p>Consultez l'historique des actions</p>
          </div>
          <div className={styles.card}>
            <h3>Paramètres</h3>
            <p>Configurez l'application</p>
          </div>
        </div>
      </div>
    </div>
  );
}
