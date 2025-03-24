'use client';

import SessionSettings from '@/components/admin/SessionSettings';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import styles from './settings.module.css';

export default function SettingsPage() {
  return (
    <div className={styles.settingsContainer}>
      {/* Sidebar */}
      <Sidebar />

      {/* Conteneur principal */}
      <div className={styles.mainContent}>
        <Header title="Paramètres de session" />

        {/* Contenu des paramètres */}
        <div className={styles.settingsContent}>
          <SessionSettings />
        </div>
      </div>
    </div>
  );
}
