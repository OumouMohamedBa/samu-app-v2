'use client';

import styles from './OperateurDashboard.module.css';

export default function OperateurDashboard() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Tableau de Bord - Opérateur Base Centrale</h2>
      <div className={styles.cards}>
        <div className={`${styles.card} ${styles.total}`}>
          <h3> Total Appels</h3>
          <p>125</p>
        </div>
        <div className={`${styles.card} ${styles.enCours}`}>
          <h3>🟡 En Cours</h3>
          <p>34</p>
        </div>
        <div className={`${styles.card} ${styles.traites}`}>
          <h3>✅ Traités</h3>
          <p>78</p>
        </div>
        <div className={`${styles.card} ${styles.echoues}`}>
          <h3>❌ Échoués</h3>
          <p>13</p>
        </div>
      </div>
    </div>
  );
}
