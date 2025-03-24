'use client';

import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import AmbulanceMap from '@/components/admin/Map';
import styles from './ambulances.module.css';

export default function AmbulanceTrackingPage() {
  return (
    <div className={styles.adminContainer}>
      <Sidebar />
      <div className={styles.contentContainer}>
        <Header />
        <div className={styles.content}>
          <h2 className={styles.title}>Suivi des Ambulances en Temps Réel</h2>
          <AmbulanceMap />
        </div>
      </div>
    </div>
  );
}
