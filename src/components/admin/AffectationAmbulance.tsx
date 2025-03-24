'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import styles from './AffectationAmbulance.module.css';

interface Urgence {
  id: string;
  lieu: string;
  latitude: number;
  longitude: number;
  statut: 'en attente' | 'assignée' | 'terminée';
}

interface Ambulance {
  id: string;
  nom: string;
  baseId: string;
}

interface BaseSamu {
  id: string;
  nom: string;
  latitude: number;
  longitude: number;
}

export default function AffectationAmbulance() {
  const [urgences, setUrgences] = useState<Urgence[]>([]);
  const [bases, setBases] = useState<BaseSamu[]>([]);
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [mode, setMode] = useState<'manuel' | 'automatique'>('manuel');
  const [selectionUrgence, setSelectionUrgence] = useState<string | null>(null);
  const [selectionAmbulance, setSelectionAmbulance] = useState<string | null>(null);

  const [typeAccident, setTypeAccident] = useState('');
  const [nbPatients, setNbPatients] = useState('');
  const [nbVehicules, setNbVehicules] = useState('');
  const [lieuAccident, setLieuAccident] = useState('');

  useEffect(() => {
    setUrgences([
      { id: '1', lieu: 'Nouakchott', latitude: 18.07, longitude: -15.98, statut: 'en attente' },
      { id: '2', lieu: 'Rosso', latitude: 16.51, longitude: -15.80, statut: 'en attente' },
    ]);

    setBases([
      { id: 'B1', nom: 'SAMU Nouakchott', latitude: 18.10, longitude: -15.95 },
      { id: 'B2', nom: 'SAMU Rosso', latitude: 16.50, longitude: -15.80 },
    ]);

    setAmbulances([
      { id: 'A1', nom: 'Ambulance 1', baseId: 'B1' },
      { id: 'A2', nom: 'Ambulance 2', baseId: 'B2' },
    ]);
  }, []);

  const assignerAutomatiquement = () => {
    if (!lieuAccident || !typeAccident || !nbPatients || !nbVehicules) {
      alert('Veuillez remplir tous les champs.');
      return;
    }
    alert('Assignation automatique en cours...');
  };

  const assignerManuellement = () => {
    if (!selectionUrgence || !selectionAmbulance) {
      alert('Sélectionnez une urgence et une ambulance.');
      return;
    }
    alert(`Ambulance ${selectionAmbulance} assignée à l'urgence ${selectionUrgence} !`);
  };

  return (
    <div className={styles.adminContainer}>
      <Sidebar />
      <div className={styles.affectationContainer}>
        <Header />
        <div className={styles.content}>
          <h2 className={styles.title}>Gestion des Affectations</h2>

          <div className={styles.modeSelector}>
            <button
              className={`${styles.modeButton} ${mode === 'manuel' ? styles.active : ''}`}
              onClick={() => setMode('manuel')}
            >
              Affectation Manuelle
            </button>
            <button
              className={`${styles.modeButton} ${mode === 'automatique' ? styles.active : ''}`}
              onClick={() => setMode('automatique')}
            >
              Affectation Automatique
            </button>
          </div>

          {mode === 'manuel' && (
            <div className={styles.formSection}>
              <div className={styles.formField}>
                <label> Sélectionnez une urgence :</label>
                <select onChange={(e) => setSelectionUrgence(e.target.value)}>
                  <option value="">-- Choisir une urgence --</option>
                  {urgences.map((u) => (
                    <option key={u.id} value={u.id}>{u.lieu}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formField}>
                <label> Sélectionnez une ambulance :</label>
                <select onChange={(e) => setSelectionAmbulance(e.target.value)}>
                  <option value="">-- Choisir une ambulance --</option>
                  {ambulances.map((a) => (
                    <option key={a.id} value={a.id}>{a.nom}</option>
                  ))}
                </select>
              </div>

              <button className={styles.assignButton} onClick={assignerManuellement}>
                Confirmer l'affectation
              </button>
            </div>
          )}

          {mode === 'automatique' && (
            <div className={styles.formSection}>
              <div className={styles.formField}>
                <label>Type d’accident :</label>
                <input type="text" onChange={(e) => setTypeAccident(e.target.value)} />
              </div>
              <div className={styles.formField}>
                <label>Nombre de patients :</label>
                <input type="number" onChange={(e) => setNbPatients(e.target.value)} />
              </div>
              <div className={styles.formField}>
                <label>Nombre de véhicules :</label>
                <input type="number" onChange={(e) => setNbVehicules(e.target.value)} />
              </div>
              <div className={styles.formField}>
                <label>Lieu (latitude, longitude) :</label>
                <input type="text" onChange={(e) => setLieuAccident(e.target.value)} />
              </div>

              <button className={styles.assignButton} onClick={assignerAutomatiquement}>
                Démarrer l’assignation automatique
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
