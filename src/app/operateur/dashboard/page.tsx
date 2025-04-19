'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import styles from './DashboardOperateur.module.css';

interface AppelData {
  id: string;
  statut: 'en_cours' | 'traite' | 'echoue';
}

export default function DashboardOperateur() {
  const [appels, setAppels] = useState<AppelData[]>([]);

  useEffect(() => {
    const fetchAppels = async () => {
      const snapshot = await getDocs(collection(db, 'appels'));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as AppelData[];

      setAppels(data);
    };

    fetchAppels();
  }, []);

  const total = appels.length;
  const enCours = appels.filter(appel => appel.statut === 'en_cours').length;
  const traites = appels.filter(appel => appel.statut === 'traite').length;
  const echoues = appels.filter(appel => appel.statut === 'echoue').length;

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.main}>
        <Header />
        <h2 className={styles.title}>Tableau de Bord - Opérateur Base Centrale</h2>
        <div className={styles.statsGrid}>
          <div className={styles.card}>
            <h3>Total Appels</h3>
            <p>{total}</p>
          </div>
          <div className={styles.card}>
            <h3>Appels en Cours</h3>
            <p>{enCours}</p>
          </div>
          <div className={styles.card}>
            <h3>Appels Traités</h3>
            <p>{traites}</p>
          </div>
          <div className={styles.card}>
            <h3>Appels Échoués</h3>
            <p>{echoues}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
