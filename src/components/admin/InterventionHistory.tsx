'use client';

import { useEffect, useState } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import styles from './InterventionHistory.module.css';

interface ActionHistory {
  id: string;
  date: string;
  action: string;
  user: string;
}

export default function InterventionHistory() {
  const [history, setHistory] = useState<ActionHistory[]>([]);

  const logAdminAction = async (
    action: string,
    userEmail: string,
    target: string,
    additionalInfo = ''
  ) => {
    try {
      await addDoc(collection(db, 'actionHistory'), {
        action,
        userEmail,
        target,
        additionalInfo,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error('Erreur lors de l’enregistrement de l’action admin :', error);
    }
  };

  const fetchHistory = async () => {
    try {
      const q = query(collection(db, 'actionHistory'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);

      const historyData: ActionHistory[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          date: data.timestamp?.toDate().toLocaleString('fr-FR') || '',
          action: data.action || 'Action inconnue',
          user: data.userEmail || 'Utilisateur inconnu',
        };
      });

      setHistory(historyData);
    } catch (error) {
      console.error('Erreur de récupération historique :', error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    const csvContent = [
      ['Date', 'Action', 'Utilisateur'],
      ...history.map(item => [item.date, item.action, item.user])
    ].map(e => e.join(';')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'historique_actions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.adminContainer}>
      <Sidebar />
      <div className={styles.historyContainer}>
        <Header />
        <div className={styles.content}>
          <h2 className={styles.title}>Historique des Actions Admin</h2>

          <div className={styles.actionsStyled}>
            <button className={styles.downloadBtn} onClick={handleDownloadCSV}>Télécharger CSV</button>
            <button className={styles.printBtn} onClick={handlePrint}>Imprimer</button>
          </div>

          <table className={styles.historyTable}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Action</th>
                <th>Utilisateur</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? (
                history.map((item) => (
                  <tr key={item.id}>
                    <td>{item.date}</td>
                    <td>{item.action}</td>
                    <td>{item.user}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className={styles.noData}>Aucune action enregistrée</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
