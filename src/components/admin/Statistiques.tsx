'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import styles from './Statistiques.module.css';

export default function Statistiques() {
  const [stats, setStats] = useState({
    urgencesParJour: 0,
    urgencesParSemaine: 0,
    urgencesParMois: 0,
    tempsMoyenIntervention: 0,
    trajetsAmbulances: 0,
    ambulancesDisponibles: 0,
    medecins: 0,
    infirmiers: 0,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users'); // 📌 Assure-toi que la collection s'appelle bien "users"
        const usersSnapshot = await getDocs(usersCollection);
        
        let countMedecins = 0;
        let countInfirmiers = 0;

        usersSnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.role === 'medecin') {
            countMedecins++;
          } else if (userData.role === 'infirmier') {
            countInfirmiers++;
          }
        });

        setStats((prevStats) => ({
          ...prevStats,
          medecins: countMedecins,
          infirmiers: countInfirmiers,
        }));
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className={styles.adminContainer}>
      <Sidebar />
      <div className={styles.statsContainer}>
        <Header />
        <h2 className={styles.title}>📊 Tableau de Bord - Statistiques</h2>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>Urgences Traitées</h3>
            <p>Jour: <strong>{stats.urgencesParJour}</strong></p>
            <p>Semaine: <strong>{stats.urgencesParSemaine}</strong></p>
            <p>Mois: <strong>{stats.urgencesParMois}</strong></p>
          </div>

          <div className={styles.statCard}>
            <h3>Temps Moyen d’Intervention</h3>
            <p><strong>{stats.tempsMoyenIntervention} min</strong></p>
          </div>

          <div className={styles.statCard}>
            <h3>Performance des Ambulances</h3>
            <p>Trajets: <strong>{stats.trajetsAmbulances}</strong></p>
            <p>Disponibles: <strong>{stats.ambulancesDisponibles}</strong></p>
          </div>

          <div className={styles.statCard}>
            <h3>Effectifs Médicaux</h3>
            <p>Médecins: <strong>{stats.medecins}</strong></p>
            <p>Infirmiers: <strong>{stats.infirmiers}</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}
