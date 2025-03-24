'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import styles from './InterventionHistory.module.css';

interface Intervention {
  id: string;
  date: string;
  location: string;
  status: 'terminée' | 'en cours' | 'annulée';
  intervenants: string[];
}

export default function InterventionHistory() {
  const [interventions, setInterventions] = useState<Intervention[]>([]);

  // Simulation des données
  useEffect(() => {
    const fakeData: Intervention[] = [
      {
        id: '1',
        date: '2025-03-15',
        location: 'Nouakchott',
        status: 'terminée',
        intervenants: ['Dr. Ahmed', 'Infirmier Ali'],
      },
      {
        id: '2',
        date: '2025-03-16',
        location: 'Rosso',
        status: 'en cours',
        intervenants: ['Dr. Mariam', 'Infirmier Oumar'],
      },
      {
        id: '3',
        date: '2025-03-17',
        location: 'Atar',
        status: 'annulée',
        intervenants: ['Dr. Issa'],
      },
    ];
    setInterventions(fakeData);
  }, []);

  return (
    <div className={styles.adminContainer}>
      <Sidebar />
      <div className={styles.historyContainer}>
        <Header />
        <div className={styles.content}>
          <h2 className={styles.title}>Historique des Interventions</h2>
          <table className={styles.historyTable}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Lieu</th>
                <th>Statut</th>
                <th>Intervenants</th>
              </tr>
            </thead>
            <tbody>
              {interventions.length > 0 ? (
                interventions.map((intervention) => (
                  <tr key={intervention.id}>
                    <td>{new Date(intervention.date).toLocaleDateString('fr-FR')}</td>
                    <td>{intervention.location}</td>
                    <td className={styles[intervention.status]}>{intervention.status}</td>
                    <td>{intervention.intervenants.join(', ')}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className={styles.noData}>
                    Aucun historique disponible.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
