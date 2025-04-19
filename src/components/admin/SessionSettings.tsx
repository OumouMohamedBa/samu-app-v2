'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import styles from './SessionSettings.module.css';

export default function SessionSettings() {
  const user = auth.currentUser;
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (typeof window !== 'undefined' && (localStorage.getItem('theme') as 'light' | 'dark')) || 'light');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [langue, setLangue] = useState('fr');
  const [timezone, setTimezone] = useState('GMT+0');
  const [notifications, setNotifications] = useState({
    email: true,
    sound: true,
  });

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const updateUserProfile = async () => {
    try {
      if (user) {
        await updateProfile(user, { displayName, photoURL: avatar || undefined });
        await updateDoc(doc(db, 'users', user.uid), { displayName, photoURL: avatar, preferences: { langue, timezone, notifications } });
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

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Paramètres de session</h1>
      {message && <p className={styles.message}>{message}</p>}


      {/* Nom d'utilisateur */}
      <div className={styles.form}>
        <label className={styles.label}>Nom d'utilisateur</label>
        <input className={styles.input} type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        <button className={styles.button} onClick={updateUserProfile}>Mettre à jour</button>
      </div>

      

      

      {/* Thème */}
      <div className={styles.form}>
        <label className={styles.label}>Thème</label>
        <select className={styles.input} value={theme} onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}>
          <option value="light">Clair</option>
          <option value="dark">Sombre</option>
        </select>
      </div>

      {/* Langue */}
      <div className={styles.form}>
        <label className={styles.label}>Langue</label>
        <select className={styles.input} value={langue} onChange={(e) => setLangue(e.target.value)}>
          <option value="fr">Français</option>
          <option value="en">Anglais</option>
          <option value="ar">العربية</option>
        </select>
      </div>

     

     
    </div>
  );
}
