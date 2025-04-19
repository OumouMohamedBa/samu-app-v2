'use client';

import { useEffect, useState } from 'react';
import styles from './FormulaireAppel.module.css';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { logAdminAction } from '@/types/logAdminAction';

export default function FormulaireAppel() {
  const [numero, setNumero] = useState('');
  const [localisation, setLocalisation] = useState('');
  const [urgence, setUrgence] = useState('faible');
  const [message, setMessage] = useState('');
  const [baseSamu, setBaseSamu] = useState('');

  const [bases, setBases] = useState<any[]>([]);

  useEffect(() => {
    const fetchBases = async () => {
      const snap = await getDocs(collection(db, 'samuBases'));
      setBases(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchBases();
  }, []);

  const findClosestBase = (location: string): string => {
    const match = bases.find(b => location.toLowerCase().includes(b.nom.toLowerCase()));
    return match ? match.nom : 'Base Inconnue';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    const matchedBase = findClosestBase(localisation);
    setBaseSamu(matchedBase);

    const data = {
      numero,
      localisation,
      niveauUrgence: urgence,
      statut: 'en_attente',
      createdAt: serverTimestamp(),
      baseSamu: matchedBase,
    };

    await addDoc(collection(db, 'appelsUrgence'), data);
    await logAdminAction('Ajout appel d’urgence', user.email || '', 'appelsUrgence', `Localisation: ${localisation} → ${matchedBase}`);

    setMessage(`✅ Appel enregistré et assigné à : ${matchedBase}`);
    setNumero('');
    setLocalisation('');
    setUrgence('faible');

    setTimeout(() => setMessage(''), 4000);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3>Saisie d’un appel</h3>
      {message && <p className={styles.success}>{message}</p>}

      <input
        type="text"
        placeholder="Numéro d'appel"
        value={numero}
        onChange={(e) => setNumero(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Localisation"
        value={localisation}
        onChange={(e) => setLocalisation(e.target.value)}
        required
      />

      <select value={urgence} onChange={(e) => setUrgence(e.target.value)}>
        <option value="faible">Faible</option>
        <option value="moyenne">Moyenne</option>
        <option value="élevée">Élevée</option>
      </select>

      <button type="submit">Enregistrer</button>
    </form>
  );
}
