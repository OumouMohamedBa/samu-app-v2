'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import styles from './Statistiques.module.css';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Enregistrer les éléments nécessaires
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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
    totalInterventions: 0,
  });

  // Exemple de données pour les graphiques sur les urgences
  const [graphData, setGraphData] = useState({
    labels: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
    datasets: [
      {
        label: 'Urgences Traitées',
        data: [12, 19, 3, 5, 2], // Exemple de données
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true, // pour remplir sous la ligne (optionnel)
      },
    ],
  });

  useEffect(() => {
    const fetchUsersAndStats = async () => {
      try {
        const usersCollection = collection(db, 'users');
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

        const interventionsSnapshot = await getDocs(collection(db, 'interventions')); // Assure-toi que la collection d'interventions existe
        const totalInterventions = interventionsSnapshot.size;

        const ambulancesSnapshot = await getDocs(collection(db, 'ambulances')); // Assure-toi que la collection des ambulances existe
        let ambulancesDisponibles = 0;
        ambulancesSnapshot.forEach(doc => {
          if (doc.data().disponible) {
            ambulancesDisponibles++;
          }
        });

        setStats((prevStats) => ({
          ...prevStats,
          medecins: countMedecins,
          infirmiers: countInfirmiers,
          totalInterventions: totalInterventions,
          ambulancesDisponibles: ambulancesDisponibles,
        }));
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchUsersAndStats();
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

          <div className={styles.statCard}>
            <h3>Nombre Total d'Interventions</h3>
            <p><strong>{stats.totalInterventions}</strong></p>
          </div>

          <div className={styles.statCard}>
            <h3>Urgences Traitées (Graphique)</h3>
            <Line data={graphData} />
          </div>
        </div>
      </div>
    </div>
  );
}
