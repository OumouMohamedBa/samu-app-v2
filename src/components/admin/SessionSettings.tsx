'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '../../lib/firebase';
import { updateProfile, updateEmail, updatePassword, signOut, deleteUser } from 'firebase/auth';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import styles from './SessionSettings.module.css';

export default function SessionSettings() {
  const user = auth.currentUser;
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const updateUserProfile = async () => {
    try {
      if (user) {
        await updateProfile(user, { displayName });
        await updateDoc(doc(db, 'users', user.uid), { displayName });
        setMessage('Profil mis à jour avec succès ✅');
      }
    } catch (error) {
      setMessage('Erreur lors de la mise à jour 😢');
    }
  };

  const updateUserEmail = async () => {
    try {
      if (user) {
        await updateEmail(user, email);
        await updateDoc(doc(db, 'users', user.uid), { email });
        setMessage('Email mis à jour ✅');
      }
    } catch (error) {
      setMessage('Erreur lors du changement d’email 😢');
    }
  };

  const updateUserPassword = async () => {
    try {
      if (user && newPassword) {
        await updatePassword(user, newPassword);
        setMessage('Mot de passe mis à jour ✅');
      }
    } catch (error) {
      setMessage('Erreur lors du changement du mot de passe 😢');
    }
  };

  const logout = async () => {
    await signOut(auth);
    window.location.href = '/login'; 
  };

  const deleteAccount = async () => {
    if (confirm('Es-tu sûr de vouloir supprimer ton compte ? Cette action est irréversible !')) {
      try {
        if (user) {
          await deleteDoc(doc(db, 'users', user.uid));
          await deleteUser(user);
          setMessage('Compte supprimé 🚀');
        }
      } catch (error) {
        setMessage('Erreur lors de la suppression 😢');
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Paramètres de session</h1>
      {message && <p className={styles.message}>{message}</p>}

      <div className={styles.form}>
        <label className={styles.label}>Nom d'utilisateur</label>
        <input className={styles.input} type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        <button className={styles.button} onClick={updateUserProfile}>Mettre à jour</button>
      </div>

      <div className={styles.form}>
        <label className={styles.label}>Email</label>
        <input className={styles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className={styles.button} onClick={updateUserEmail}>Changer l'email</button>
      </div>

      <div className={styles.form}>
        <label className={styles.label}>Nouveau mot de passe</label>
        <input className={styles.input} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <button className={styles.button} onClick={updateUserPassword}>Changer le mot de passe</button>
      </div>

      <div className={styles.actions}>
        <button onClick={logout} className={`${styles.button} ${styles.logout}`}>Déconnexion</button>
        <button onClick={deleteAccount} className={`${styles.button} ${styles.delete}`}>Supprimer le compte</button>
      </div>
    </div>
  );
}
