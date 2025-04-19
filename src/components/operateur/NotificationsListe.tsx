'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import styles from './NotificationsListe.module.css';

interface Appel {
  id: string;
  numero: string;
  localisation: string;
  niveauUrgence: string;
  statut: string;
  createdAt: any;
}

export default function NotificationsListe() {
  const [appels, setAppels] = useState<Appel[]>([]);
  const [tri, setTri] = useState<'date' | 'urgence'>('date');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let q;

    if (tri === 'date') {
      q = query(collection(db, 'appelsUrgence'), orderBy('createdAt', 'desc'));
    } else {
      q = query(collection(db, 'appelsUrgence'), orderBy('niveauUrgence', 'desc'));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Appel[];

      setAppels(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [tri]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Notifications des Appels d’Urgence</h2>

      <div className={styles.triContainer}>
  <label htmlFor="tri">Trier par :</label>
  <select
    id="tri"
    className={styles.triSelect}
    value={tri}
    onChange={(e) => setTri(e.target.value as 'date' | 'urgence')}
  >
    <option value="date">Date</option>
    <option value="urgence">Niveau d'urgence</option>
  </select>
</div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#006233' }}>Chargement en cours...</p>
      ) : appels.length === 0 ? (
        <p className={styles.empty}>Aucune notification enregistrée</p>
      ) : (
        <ul className={styles.list}>
          {appels.map((appel) => (
            <li key={appel.id} className={`${styles.item} ${styles[appel.niveauUrgence]}`}>
              <div className={styles.details}>
                <strong>Localisation:</strong> {appel.localisation}<br />
                <strong>Numéro:</strong> {appel.numero}<br />
                <strong>Urgence:</strong> {appel.niveauUrgence}<br />
                <strong>Date:</strong> {appel.createdAt?.toDate().toLocaleString('fr-FR')}
              </div>
              <span className={styles.status}>{appel.statut.replace('_', ' ')}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
