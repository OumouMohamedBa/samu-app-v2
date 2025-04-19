'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import styles from './GestionSAMU.module.css';
import { logAdminAction } from '@/types/logAdminAction';
import { FaEdit, FaTrash, FaMapMarkerAlt } from 'react-icons/fa';

export default function GestionSAMU() {
  const [bases, setBases] = useState([]);
  const [hopitaux, setHopitaux] = useState([]);
  const [nom, setNom] = useState('');
  const [adresse, setAdresse] = useState('');
  const [telephone, setTelephone] = useState('');
  const [capacite, setCapacite] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedAdresse, setSelectedAdresse] = useState<string | null>(null);

  useEffect(() => {
    const chargerBases = async () => {
      const snapshot = await getDocs(collection(db, 'samuBases'));
      setBases(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    const chargerHopitaux = async () => {
      const snapshot = await getDocs(collection(db, 'hopitaux'));
      setHopitaux(snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          disponible: data.litsOccupes < data.capaciteTotale
        };
      }));
    };
    chargerBases();
    chargerHopitaux();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    const data = { nom, adresse, telephone, capacite, updatedAt: new Date() };

    if (editingId) {
      await updateDoc(doc(db, 'samuBases', editingId), data);
      await logAdminAction('Modification base SAMU', user.email!, 'samuBases', `ID: ${editingId}`);
      setEditingId(null);
    } else {
      const docRef = await addDoc(collection(db, 'samuBases'), data);
      await logAdminAction('Ajout base SAMU', user.email!, 'samuBases', `ID: ${docRef.id}`);
    }

    setNom('');
    setAdresse('');
    setTelephone('');
    setCapacite(0);
    setShowFormModal(false);

    const snapshot = await getDocs(collection(db, 'samuBases'));
    setBases(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleEdit = (base: any) => {
    setEditingId(base.id);
    setNom(base.nom);
    setAdresse(base.adresse);
    setTelephone(base.telephone);
    setCapacite(base.capacite);
    setShowFormModal(true);
  };

  const handleDelete = async (baseId: string) => {
    const user = auth.currentUser;
    if (!user) return;

    if (confirm('Êtes-vous sûr de vouloir supprimer cette base SAMU ?')) {
      await deleteDoc(doc(db, 'samuBases', baseId));
      await logAdminAction('Suppression base SAMU', user.email!, 'samuBases', `ID: ${baseId}`);
      const snapshot = await getDocs(collection(db, 'samuBases'));
      setBases(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
  };

  const handleVoirLocalisation = (adresse: string) => {
    setSelectedAdresse(adresse);
  };

  return (
    <div className={styles.adminContainer}>
      <Sidebar />
      <div className={styles.usersContainer}>
        <Header />
        <div className={styles.content}>
          <h2 className={styles.title}>Gestion des Bases SAMU & Disponibilité des Hôpitaux</h2>
          <div className={styles.gestionContainer}>
            <button className={styles.btnAjouter} onClick={() => setShowFormModal(true)}>➕ </button>

            <ul className={styles.baseList}>
              {bases.map((base: any) => (
                <li key={base.id}>
                  <span>
                    <strong>{base.nom}</strong> ({base.adresse}) - {base.telephone} - Ambulances : {base.capacite}
                  </span>
                  <span>
  <FaEdit className={styles.iconEdit} onClick={() => handleEdit(base)} />
  <FaTrash className={styles.iconDelete} onClick={() => handleDelete(base.id)} />
  <FaMapMarkerAlt className={styles.iconMap} onClick={() => handleVoirLocalisation(base.adresse)} />
</span>

                </li>
              ))}
            </ul>

            {selectedAdresse && (
              <div className={styles.modalOverlay} onClick={() => setSelectedAdresse(null)}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                  <h3>Localisation</h3>
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedAdresse)}&z=15&output=embed`}
                    width="100%"
                    height="300"
                    style={{ border: 0, borderRadius: '12px' }}
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </div>
            )}

            {showFormModal && (
              <div className={styles.modalOverlay} onClick={() => setShowFormModal(false)}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                  <form className={styles.formSamu} onSubmit={handleSubmit}>
                  <h2 className={styles.title}>Ajouter une base</h2>
                    <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom de la base" required />
                    <input value={adresse} onChange={(e) => setAdresse(e.target.value)} placeholder="Adresse" required />
                    <input value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="Téléphone" required />
                    <input type="number" value={capacite} onChange={(e) => setCapacite(Number(e.target.value))} placeholder="Nombre d’ambulances" required />
                    <button type="submit">{editingId ? 'Modifier' : 'Ajouter'}</button>
                  </form>
                </div>
              </div>
            )}

            <h2 className={styles.title}>Disponibilité des hôpitaux</h2>
            <ul className={styles.hopitauxList}>
              {hopitaux.map((h: any) => (
                <li key={h.id}>
                  {h.nom} - {h.disponible ? '✅ Disponible' : '❌ Complet'}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
